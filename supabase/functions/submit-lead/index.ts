// ─────────────────────────────────────────────────────────────────────────────
// submit-lead edge function (Sprint Task 7)
//
// Single TCPA-safer entry point for every public lead submission. Replaces
// the previous pattern of (1) direct client-side supabase.from("leads")
// .insert() (2) hardcoded Zapier webhook fetch from the client bundle and
// (3) client-invoked notify-lead / distribute-lead.
//
// This function:
//   - is GATED off by default. Returns HTTP 503 unless the SUBMIT_LEAD_ENABLED
//     secret is set to "1" or "true" in Supabase secrets. Defense-in-depth
//     alongside the frontend gate in src/lib/lead-submission-gate.ts —
//     BOTH must flip to true to actually accept leads.
//   - applies the persistent Task 6 rate-limit helper (10 submissions per
//     IP per hour by default, observable in abuse_events).
//   - applies the Task 6 Turnstile verifier (shadow-mode while
//     TURNSTILE_SECRET_KEY is unset; hard-rejects once set — see TCPA-TODO).
//   - validates payload fields server-side (length caps, US phone shape,
//     ZIP shape, known service area, honeypot empty, consent given,
//     consent_text_version matches a known registry entry).
//   - inserts the lead via service_role into public.leads with full
//     TCPA-audit columns (ip_address, user_agent, source_url,
//     consent_text_version, consent_given_at, submission_method).
//   - inserts an immutable row into public.lead_consent_log so consent
//     can be proven later even if the leads row is edited / archived.
//   - invokes notify-lead server-to-server (the client never touches it).
//   - does NOT invoke distribute-lead — that flow stays paused until real
//     contractors are onboarded. See LEAD-REOPEN-TODO below.
//
// LEAD-REOPEN-TODO checklist before flipping the gates:
//   1. Provision Cloudflare Turnstile site + secret; set
//      VITE_TURNSTILE_SITE_KEY (Vercel) and TURNSTILE_SECRET_KEY (Supabase).
//   2. Have counsel review src/lib/consent-text.ts vs FCC one-to-one
//      consent rule + CCPA + CTIA.
//   3. Onboard at least one real contractor with a signed lead-share
//      agreement; populate public.contractors; turn distribute-lead ON in
//      this function (see "DISTRIBUTION" block below).
//   4. Flip ENFORCE_RATE_LIMIT=1 in Supabase secrets so this function
//      hard-rejects bucket overflows.
//   5. Set SUBMIT_LEAD_ENABLED=1 in Supabase secrets.
//   6. In src/lib/lead-submission-gate.ts, flip LEAD_SUBMISSION_ENABLED
//      to true.
// ─────────────────────────────────────────────────────────────────────────────

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { checkRateLimit, logAbuse } from "../_shared/rate-limit.ts";
import { verifyTurnstile } from "../_shared/turnstile.ts";

// CORS-TODO: shared origin allowlist (mirrors the other edge functions).
// Move to a shared deno module once the function count grows.
const ALLOWED_ORIGINS = [
  "https://buildright-usa.com",
  "https://www.buildright-usa.com",
  "http://localhost:5173",
  "http://localhost:8080",
];
function corsHeadersFor(req: Request): Record<string, string> {
  const origin = req.headers.get("origin") ?? "";
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[1];
  return {
    "Access-Control-Allow-Origin": allowed,
    "Vary": "Origin",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type, x-turnstile-token, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  };
}

// ─── Consent registry (mirrors src/lib/consent-text.ts) ────────────────────
// CONSENT-TODO: keep these entries IN SYNC with src/lib/consent-text.ts. When
// adding a new version, do NOT remove old versions — historic leads still
// reference them. The server is authoritative for the text stored in
// lead_consent_log so client-supplied snapshots cannot be forged.
const CONSENT_VERSIONS: Record<string, string> = {
  "v1-2026-05-20":
    "By submitting, you agree that Build Right USA may contact you about your project by phone, SMS, or email at the contact information you provide, including by automated technology. Consent is not a condition of any purchase. Message and data rates may apply. You can opt out at any time by replying STOP. See our Privacy Policy, SMS Consent, and Lead Generation Disclosure for details.",
};

// ─── Validators ────────────────────────────────────────────────────────────
const MAX_BODY_BYTES = 32_768;

function isValidUSPhone(phone: string): boolean {
  const d = String(phone || "").replace(/\D/g, "");
  if (d.length !== 10) return false;
  if (/^(\d)\1{9}$/.test(d)) return false; // all-same-digit
  if (d === "1234567890") return false;
  if (d[0] === "0" || d[0] === "1") return false;
  return true;
}
function formatPhone(phone: string): string {
  const d = String(phone || "").replace(/\D/g, "");
  return d.length === 10 ? `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}` : phone;
}
function isValidEmail(email: string): boolean {
  if (!email || email.length > 255) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}
function isValidZip(zip: string): boolean {
  return /^\d{5}$/.test(String(zip || "").replace(/\D/g, "").slice(0, 5));
}
function clamp(s: unknown, max: number): string | null {
  if (s === undefined || s === null) return null;
  const str = String(s);
  return str.length > max ? str.slice(0, max) : str;
}
function getClientIP(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("cf-connecting-ip") ??
    "unknown"
  );
}

// ─── Handler ────────────────────────────────────────────────────────────────
Deno.serve(async (req) => {
  const corsHeaders = corsHeadersFor(req);
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "method-not-allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // ── Gate (defense in depth — frontend has its own gate too) ──
  const enabled = Deno.env.get("SUBMIT_LEAD_ENABLED");
  if (enabled !== "1" && enabled !== "true") {
    return new Response(
      JSON.stringify({
        error: "submission-temporarily-disabled",
        message:
          "Lead submission is temporarily disabled while we upgrade the contractor network.",
      }),
      { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  const ip = getClientIP(req);
  const userAgent = req.headers.get("user-agent") ?? "";

  // ── Rate limit (Task 6 helper; defaults to shadow mode) ──
  const rl = await checkRateLimit({
    endpoint: "submit-lead:submit",
    ip,
    limit: 10,
    windowSeconds: 60 * 60, // 1 hour
  });
  if (!rl.allowed) {
    return new Response(
      JSON.stringify({ error: "rate-limited", retryAfter: rl.resetAt }),
      { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  // ── Turnstile (Task 6 helper; soft-pass while TURNSTILE_SECRET_KEY unset) ──
  const turnstileToken = req.headers.get("x-turnstile-token");
  const turnstile = await verifyTurnstile(turnstileToken, {
    remoteIp: ip,
    expectedAction: "submit-lead",
  });
  if (!turnstile.valid) {
    await logAbuse({
      event_type: "turnstile_observed_invalid",
      endpoint: "submit-lead:submit",
      details: { reason: turnstile.reason },
    });
    // TURNSTILE-TODO: when TURNSTILE_SECRET_KEY is configured in Supabase
    // secrets, change this to a hard reject:
    //   return new Response(JSON.stringify({ error: "verification-failed" }),
    //     { status: 403, headers: ... });
  }

  // ── Body size + JSON parse ──
  const contentLength = parseInt(req.headers.get("content-length") ?? "0", 10);
  if (contentLength > MAX_BODY_BYTES) {
    return new Response(JSON.stringify({ error: "payload-too-large" }), {
      status: 413,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "invalid-json" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // ── Honeypot ──
  if (typeof body?.honeypot === "string" && body.honeypot.length > 0) {
    await logAbuse({
      event_type: "honeypot_tripped",
      endpoint: "submit-lead:submit",
      details: { length: body.honeypot.length },
    });
    // Quietly accept-and-discard so the bot doesn't learn it failed.
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // ── Field validation ──
  const name         = clamp(body?.name, 100);
  const phoneRaw     = clamp(body?.phone, 20);
  const email        = clamp(body?.email, 255);
  const zip          = clamp(body?.zip, 10);
  const service      = clamp(body?.service, 100);
  const serviceArea  = clamp(body?.service_area, 100);
  const message      = clamp(body?.message ?? body?.details, 1000);
  const landingPage  = clamp(body?.landing_page, 500);
  const sourcePage   = clamp(body?.source_page, 500);
  const sourceUrl    = clamp(body?.source_url, 1000);
  const utmSource    = clamp(body?.utm_source, 200);
  const utmMedium    = clamp(body?.utm_medium, 200);
  const utmCampaign  = clamp(body?.utm_campaign, 200);
  const utmTerm      = clamp(body?.utm_term, 200);
  const utmContent   = clamp(body?.utm_content, 200);

  if (!name || !phoneRaw || !email || !zip || !service || !serviceArea) {
    return new Response(JSON.stringify({ error: "missing-required-fields" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  if (!isValidUSPhone(phoneRaw)) {
    return new Response(JSON.stringify({ error: "invalid-phone" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  if (!isValidEmail(email)) {
    return new Response(JSON.stringify({ error: "invalid-email" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  if (!isValidZip(zip)) {
    return new Response(JSON.stringify({ error: "invalid-zip" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // ── Consent validation ──
  const consent = body?.consent ?? {};
  if (consent.given !== true) {
    return new Response(JSON.stringify({ error: "consent-required" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  const consentVersion = typeof consent.version === "string" ? consent.version : "";
  const consentText = CONSENT_VERSIONS[consentVersion];
  if (!consentText) {
    await logAbuse({
      event_type: "consent_version_unknown",
      endpoint: "submit-lead:submit",
      details: { received_version: consentVersion },
    });
    return new Response(JSON.stringify({ error: "unknown-consent-version" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // ── Insert via service_role ──
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const admin = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });

  const newLeadId = crypto.randomUUID();
  const now = new Date();
  const phone = formatPhone(phoneRaw);

  const leadRow = {
    id: newLeadId,
    name,
    phone,
    email,
    zip,
    service,
    service_area: serviceArea,
    message: message ?? null,
    source: "website" as const,
    landing_page: landingPage ?? null,
    source_page: sourcePage ?? null,
    utm_source: utmSource,
    utm_medium: utmMedium,
    utm_campaign: utmCampaign,
    utm_term: utmTerm,
    utm_content: utmContent,
    // Audit + TCPA columns added by 20260520150000_lead_consent_audit.sql
    consent_given: true,
    consent_text_version: consentVersion,
    consent_given_at: now.toISOString(),
    ip_address: ip,
    user_agent: userAgent,
    source_url: sourceUrl,
    submission_method: "submit-lead-edge-v1",
    distribution_status: "not_distributed" as const,
  };

  const { error: insertErr } = await admin.from("leads").insert(leadRow as any);
  if (insertErr) {
    console.error("[submit-lead] insert failed:", insertErr);
    return new Response(JSON.stringify({ error: "submission-failed" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Immutable consent record (server stores its own authoritative text,
  // not the client-supplied snapshot — prevents forged "I agreed to X")
  await admin.from("lead_consent_log").insert({
    lead_id: newLeadId,
    consent_given: true,
    consent_text_version: consentVersion,
    consent_text_snapshot: consentText,
    ip_address: ip,
    user_agent: userAgent,
    source_url: sourceUrl,
    submission_method: "submit-lead-edge-v1",
  });

  // Server-to-server invoke of notify-lead — client never touches it.
  // Errors are non-fatal: the lead is already saved.
  admin.functions
    .invoke("notify-lead", { body: { lead_id: newLeadId } })
    .catch((err) => console.warn("[submit-lead] notify-lead invoke failed:", err));

  // LEAD-REOPEN-TODO: distribute-lead is intentionally NOT invoked here.
  // When real contractors are onboarded:
  //   1. Update public.contractors with active rows in the lead's ZIP.
  //   2. Uncomment the block below.
  //   3. Make sure distribution_status is updated by distribute-lead.
  //
  // admin.functions
  //   .invoke("distribute-lead", { body: { lead_id: newLeadId } })
  //   .catch((err) => console.warn("[submit-lead] distribute-lead invoke failed:", err));

  return new Response(
    JSON.stringify({ success: true, lead_id: newLeadId }),
    { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
});
