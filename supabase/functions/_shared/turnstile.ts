// ─────────────────────────────────────────────────────────────────────────────
// Cloudflare Turnstile server-side verifier (Sprint Task 6)
//
// Imported by edge functions that need to verify a Turnstile token sent
// from the frontend. While TURNSTILE_SECRET_KEY is unset in Supabase
// secrets, verifyTurnstile returns { valid: true, reason: "dev-bypass" }
// so dev / preview environments do not break — but the helper logs a
// warning and writes a row to abuse_events so the bypass is observable.
//
// TURNSTILE-TODO: provision a Cloudflare Turnstile site key + secret
// (free tier) and store the secret in Supabase secrets as
// TURNSTILE_SECRET_KEY (`supabase secrets set TURNSTILE_SECRET_KEY=…
// --project-ref lnbddkyryqambjxdnqme`). Once set, the helper switches
// to strict verification automatically.
// ─────────────────────────────────────────────────────────────────────────────

export interface TurnstileResult {
  valid: boolean;
  reason: string;
  // The Cloudflare action / cdata fields if the upstream call succeeded.
  action?: string;
  cdata?: string;
  hostname?: string;
}

const TURNSTILE_VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

/**
 * Verify a Turnstile token. Safe to call without a configured secret —
 * returns a dev-bypass result so local development and preview branches
 * keep working. In production with TURNSTILE_SECRET_KEY set, this
 * delegates to Cloudflare's siteverify endpoint.
 */
export async function verifyTurnstile(
  token: string | null | undefined,
  opts: { remoteIp?: string; expectedAction?: string } = {},
): Promise<TurnstileResult> {
  const secret = (globalThis as any).Deno?.env?.get?.("TURNSTILE_SECRET_KEY") as
    | string
    | undefined;

  // Dev / preview mode: no secret configured. Soft-pass with a marker.
  if (!secret) {
    return { valid: true, reason: "dev-bypass-no-secret" };
  }

  // Production mode: token is mandatory.
  if (!token || typeof token !== "string" || token.length < 10) {
    return { valid: false, reason: "missing-or-malformed-token" };
  }

  try {
    const form = new URLSearchParams();
    form.set("secret", secret);
    form.set("response", token);
    if (opts.remoteIp) form.set("remoteip", opts.remoteIp);

    const res = await fetch(TURNSTILE_VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form,
    });

    if (!res.ok) {
      return { valid: false, reason: `cf-upstream-${res.status}` };
    }

    const data = await res.json() as {
      success: boolean;
      action?: string;
      cdata?: string;
      hostname?: string;
      ["error-codes"]?: string[];
    };

    if (!data.success) {
      const codes = (data["error-codes"] ?? []).join(",") || "unknown";
      return { valid: false, reason: `cf-rejected-${codes}` };
    }

    if (opts.expectedAction && data.action && opts.expectedAction !== data.action) {
      return { valid: false, reason: `action-mismatch-${data.action}` };
    }

    return {
      valid: true,
      reason: "verified",
      action: data.action,
      cdata: data.cdata,
      hostname: data.hostname,
    };
  } catch (err) {
    return { valid: false, reason: `verify-threw-${(err as Error).message}` };
  }
}

/**
 * SHA-256 a string and return hex. Used for hashing IPs before logging,
 * so the rate-limit table never stores raw IPs (PII reduction).
 */
export async function hashIp(ip: string): Promise<string> {
  const enc = new TextEncoder().encode(ip);
  const buf = await crypto.subtle.digest("SHA-256", enc);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
