// ─────────────────────────────────────────────────────────────────────────────
// Frontend client for the submit-lead edge function (Sprint Task 7)
//
// This is the ONE place every public lead-capture surface calls when it's
// ready to send a lead to the server. Replaces the previous pattern of
// direct supabase.from("leads").insert() + hardcoded Zapier fetch from the
// client bundle.
//
// LEAD-REOPEN-TODO: this client only runs when LEAD_SUBMISSION_ENABLED is
// flipped to true in src/lib/lead-submission-gate.ts. Every caller still
// guards its invocation with that gate today — keep it that way until
// Tasks 1–7 sign-off is complete.
//
// TURNSTILE-TODO: when VITE_TURNSTILE_SITE_KEY is configured, callers
// should pass a Turnstile token via the `turnstileToken` argument so the
// edge function can verify it (header x-turnstile-token).
// ─────────────────────────────────────────────────────────────────────────────

import { supabase } from "@/integrations/supabase/client";
import { CURRENT_CONSENT } from "@/lib/consent-text";

export interface LeadSubmitPayload {
  /** Full name as the user entered it. Max 100 chars. */
  name: string;
  /** US phone — server validates the 10-digit shape and rejects fake patterns. */
  phone: string;
  /** Email address. */
  email: string;
  /** 5-digit ZIP. */
  zip: string;
  /** Service slug or label (server validates). */
  service: string;
  /** Service area slug or label (server validates). */
  service_area: string;
  /** Optional project details / notes. */
  message?: string;
  /** Optional landing page slug for SEO landing pages. */
  landing_page?: string;
  /** Optional source page (defaults to window.location.pathname). */
  source_page?: string;
  /** Honeypot field — caller passes the form's hidden field value. */
  honeypot?: string;
}

export interface LeadSubmitResult {
  success: boolean;
  lead_id?: string;
  error?: string;
  /** When the gate is off the server returns 503; the caller should show
   *  the maintenance state, NOT an error toast. */
  maintenance?: boolean;
}

const SUBMIT_LEAD_PATH = "submit-lead";

/**
 * Submit a lead through the TCPA-safer edge function path.
 *
 * - Adds the current consent version + a boolean true (the caller must
 *   have already shown the consent text and the user must have ticked
 *   the box — the edge function rejects payloads with consent.given !== true).
 * - Captures source_url from window.location for the audit trail.
 * - Forwards UTM params from the current URL.
 * - Passes the Turnstile token via the x-turnstile-token header when
 *   one is provided.
 *
 * Returns:
 *   - { success: true, lead_id } on insert
 *   - { success: false, maintenance: true } on HTTP 503 (gate off)
 *   - { success: false, error } on any other failure
 *
 * Never throws — callers can `await submitLeadV1(payload)` without try/catch.
 */
export async function submitLeadV1(
  payload: LeadSubmitPayload,
  opts: { turnstileToken?: string | null } = {},
): Promise<LeadSubmitResult> {
  const params = new URLSearchParams(
    typeof window !== "undefined" ? window.location.search : "",
  );

  const body = {
    name: payload.name,
    phone: payload.phone,
    email: payload.email,
    zip: payload.zip,
    service: payload.service,
    service_area: payload.service_area,
    message: payload.message ?? null,
    landing_page: payload.landing_page ?? null,
    source_page:
      payload.source_page ??
      (typeof window !== "undefined" ? window.location.pathname : null),
    source_url:
      typeof window !== "undefined"
        ? window.location.href
        : null,
    utm_source: params.get("utm_source"),
    utm_medium: params.get("utm_medium"),
    utm_campaign: params.get("utm_campaign"),
    utm_term: params.get("utm_term"),
    utm_content: params.get("utm_content"),
    honeypot: payload.honeypot ?? "",
    consent: {
      given: true,
      version: CURRENT_CONSENT.version,
    },
  };

  const headers: Record<string, string> = {};
  if (opts.turnstileToken) headers["x-turnstile-token"] = opts.turnstileToken;

  try {
    const { data, error } = await supabase.functions.invoke<LeadSubmitResult & { lead_id?: string }>(
      SUBMIT_LEAD_PATH,
      { body, headers },
    );

    if (error) {
      // supabase-js wraps non-2xx responses in `error`. Inspect status code
      // via the message — the gate returns 503, which we map to maintenance.
      const status = (error as { status?: number }).status;
      if (status === 503) {
        return { success: false, maintenance: true, error: "gate-off" };
      }
      return { success: false, error: error.message ?? "submission-failed" };
    }

    if (data && (data as any).success && (data as any).lead_id) {
      return { success: true, lead_id: (data as any).lead_id };
    }
    return { success: false, error: "unexpected-response" };
  } catch (err) {
    return {
      success: false,
      error: (err as Error).message ?? "submission-threw",
    };
  }
}
