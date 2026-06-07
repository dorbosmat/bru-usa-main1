// ─────────────────────────────────────────────────────────────────────────────
// PHONE READINESS MODEL — single source of truth (Sprint Task 14)
// ─────────────────────────────────────────────────────────────────────────────
//
// Every phone number Build Right USA renders is defined HERE and nowhere else.
// Before Task 14 the callback number lived in src/lib/lead-submission-gate.ts
// and a separate `COMPANY_PHONE` lived in src/lib/constants.ts — two sources
// that could drift. Both now re-export from this file, so provisioning the real
// US line is a ONE-LINE change here.
//
// HONEST EMPTY STATE (do not break this contract):
//   While the values below are empty strings, the platform must NOT render a
//   tap-to-call button or print a number. `hasRealCallbackNumber` is the guard
//   every consumer checks — MaintenanceHoldingState renders a "Phone line being
//   provisioned" notice instead of a live link while it is false.
//
// PHONE-TODO (reopening): provision a real US callback line (OpenPhone / Twilio)
// and fill BOTH constants below. CALLBACK_PHONE_E164 MUST be E.164 ("+1" then
// ten digits) so `tel:` links work cross-platform. NEVER restore a fictional
// placeholder (the old fictional Hollywood number must not return). To avoid a
// literal fake number living in source, the format is shown with X's:
//   Example once provisioned (replace every X with the real digits):
//     export const CALLBACK_PHONE_E164    = "+1XXXXXXXXXX";
//     export const CALLBACK_PHONE_DISPLAY = "(XXX) XXX-XXXX";
// ─────────────────────────────────────────────────────────────────────────────

/** E.164 format, e.g. "+1<area><exchange><line>". Empty until provisioned. */
export const CALLBACK_PHONE_E164 = "";

/** Pretty US display format, e.g. "(XXX) XXX-XXXX". Empty until provisioned. */
export const CALLBACK_PHONE_DISPLAY = "";

/** Human-readable callback availability window. Safe to show even with no number. */
export const CALLBACK_HOURS = "Mon–Fri · 8AM–6PM EST";

/**
 * The single guard every phone consumer must check before rendering a number
 * or a `tel:` link. False while either constant is empty so we never ship a
 * dead or fake tap-to-call.
 */
export const hasRealCallbackNumber =
  CALLBACK_PHONE_E164.length > 0 && CALLBACK_PHONE_DISPLAY.length > 0;

/**
 * General-purpose company phone used by marketing surfaces (footer, contact
 * page, chatbot fallback copy). Derived from the callback line so there is ONE
 * number for the whole site. Empty string today — every consumer guards against
 * that and falls back to honest copy / the contact form / email.
 */
export const COMPANY_PHONE = CALLBACK_PHONE_DISPLAY;
