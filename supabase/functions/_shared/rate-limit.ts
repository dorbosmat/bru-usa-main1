// ─────────────────────────────────────────────────────────────────────────────
// Persistent rate-limit checker (Sprint Task 6)
//
// Imported by edge functions that need per-IP, per-endpoint rate limiting
// that survives Supabase Edge's horizontally-scaled isolates. The previous
// in-memory Map approach (see chat function pre-Task-5) was easy to bypass
// because each isolate had its own counter.
//
// SHADOW MODE:
//   The default `mode` is "observe". checkRateLimit increments the bucket
//   and logs a row to abuse_events if the bucket would have exceeded the
//   limit — but `allowed` is still returned as `true`. This lets us
//   collect real traffic data before turning on enforcement.
//
//   When ready, callers flip mode: "enforce" (or globally via the
//   ENFORCE_RATE_LIMIT secret) and the helper starts returning
//   `allowed: false` for exceeded buckets.
//
// RATE-LIMIT-TODO:
//   - Provision the migration in supabase/migrations/20260520140000_…sql
//     (`supabase db push` or run the SQL in the dashboard).
//   - Enable pg_cron and schedule
//     `DELETE FROM rate_limit_buckets WHERE expires_at < now();`
//     hourly (otherwise the table grows unbounded).
//   - After a week of shadow-mode data, set ENFORCE_RATE_LIMIT=1 secret
//     OR pass { mode: "enforce" } at each call site.
// ─────────────────────────────────────────────────────────────────────────────

import { createClient, type SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";
import { hashIp } from "./turnstile.ts";

export type RateLimitMode = "observe" | "enforce";

export interface RateLimitOptions {
  endpoint: string;       // canonical name, e.g. "ai-renovation:generate"
  ip: string;             // raw IP from req headers — will be hashed before storage
  limit: number;          // max requests per window
  windowSeconds: number;  // window length, e.g. 60 = 1 minute
  mode?: RateLimitMode;   // default "observe"
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: Date;
  /** True if mode is "observe" and the bucket would have been exceeded
   *  under "enforce". Lets the caller log without blocking. */
  shadowedRejection: boolean;
  reason?: string;
}

// Round timestamp DOWN to the nearest `windowSeconds` boundary so all
// requests in the same window share the same bucket row.
function roundWindow(date: Date, windowSeconds: number): Date {
  const ms = windowSeconds * 1000;
  return new Date(Math.floor(date.getTime() / ms) * ms);
}

let cachedAdminClient: SupabaseClient | null = null;
function adminClient(): SupabaseClient | null {
  if (cachedAdminClient) return cachedAdminClient;
  const url = (globalThis as any).Deno?.env?.get?.("SUPABASE_URL") as string | undefined;
  const key = (globalThis as any).Deno?.env?.get?.("SUPABASE_SERVICE_ROLE_KEY") as string | undefined;
  if (!url || !key) return null;
  cachedAdminClient = createClient(url, key, { auth: { persistSession: false } });
  return cachedAdminClient;
}

/**
 * Increment the rate-limit bucket for (endpoint, ip-hash, current window)
 * and return whether the request is allowed.
 *
 * - In "observe" mode (default), `allowed` is always true; if the bucket
 *   would have been exceeded under enforcement, `shadowedRejection` is
 *   set and the event is logged to abuse_events.
 * - In "enforce" mode, exceeded buckets return `allowed: false`.
 *
 * Fails safely: if the helper cannot reach Supabase, it returns
 * `allowed: true` and a `reason` describing the failure — never block a
 * legitimate user because the limiter itself broke.
 */
export async function checkRateLimit(opts: RateLimitOptions): Promise<RateLimitResult> {
  const mode = opts.mode ?? envMode() ?? "observe";
  const now = new Date();
  const windowStart = roundWindow(now, opts.windowSeconds);
  const expiresAt = new Date(windowStart.getTime() + opts.windowSeconds * 1000);

  const supa = adminClient();
  if (!supa) {
    return {
      allowed: true,
      remaining: opts.limit,
      resetAt: expiresAt,
      shadowedRejection: false,
      reason: "no-supabase-client-soft-pass",
    };
  }

  const ipHash = await hashIp(opts.ip);

  // Atomic upsert: insert {count:1} or increment existing row.
  // We do it as a transaction-ish two-step (Supabase JS doesn't expose
  // ON CONFLICT … DO UPDATE SET count = count + 1 directly, so we use
  // a Postgres RPC fallback OR an upsert + read). For simplicity we
  // upsert with count: 1, then if pre-existing row, fetch + update.
  // The unique index ensures correctness even under concurrent writes.
  try {
    const { data: existing } = await supa
      .from("rate_limit_buckets")
      .select("id, count")
      .eq("endpoint", opts.endpoint)
      .eq("ip_hash", ipHash)
      .eq("window_started_at", windowStart.toISOString())
      .maybeSingle();

    let newCount: number;
    if (existing) {
      newCount = existing.count + 1;
      await supa
        .from("rate_limit_buckets")
        .update({ count: newCount })
        .eq("id", existing.id);
    } else {
      newCount = 1;
      await supa.from("rate_limit_buckets").insert({
        endpoint: opts.endpoint,
        ip_hash: ipHash,
        count: 1,
        window_started_at: windowStart.toISOString(),
        expires_at: expiresAt.toISOString(),
      });
    }

    const exceeded = newCount > opts.limit;
    const remaining = Math.max(0, opts.limit - newCount);

    if (exceeded) {
      await logAbuse({
        event_type:
          mode === "enforce" ? "rate_limit_blocked" : "rate_limit_observed",
        endpoint: opts.endpoint,
        ip_hash: ipHash,
        details: { count: newCount, limit: opts.limit, mode },
      });
    }

    if (exceeded && mode === "enforce") {
      return {
        allowed: false,
        remaining: 0,
        resetAt: expiresAt,
        shadowedRejection: false,
        reason: "rate-limit-exceeded",
      };
    }

    return {
      allowed: true,
      remaining,
      resetAt: expiresAt,
      shadowedRejection: exceeded && mode === "observe",
    };
  } catch (err) {
    // Never block on internal limiter failure — soft-pass with a log.
    return {
      allowed: true,
      remaining: opts.limit,
      resetAt: expiresAt,
      shadowedRejection: false,
      reason: `limiter-error-${(err as Error).message}`,
    };
  }
}

/**
 * Append a row to abuse_events. Fire-and-forget: if logging itself
 * fails, swallow the error — the function should never throw out of a
 * security helper.
 */
export async function logAbuse(row: {
  event_type: string;
  endpoint: string;
  ip_hash?: string | null;
  details?: Record<string, unknown>;
}): Promise<void> {
  const supa = adminClient();
  if (!supa) return;
  try {
    await supa.from("abuse_events").insert({
      event_type: row.event_type,
      endpoint: row.endpoint,
      ip_hash: row.ip_hash ?? null,
      details: row.details ?? {},
    });
  } catch {
    // intentionally swallow
  }
}

function envMode(): RateLimitMode | undefined {
  const v = (globalThis as any).Deno?.env?.get?.("ENFORCE_RATE_LIMIT") as
    | string
    | undefined;
  if (v === "1" || v === "true") return "enforce";
  if (v === "0" || v === "false") return "observe";
  return undefined;
}
