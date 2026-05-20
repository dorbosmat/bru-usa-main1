// ─────────────────────────────────────────────────────────────────────────────
// LEAD SUBMISSION GATE — Liability Containment Sprint (Task 1)
// ─────────────────────────────────────────────────────────────────────────────
//
// While LEAD_SUBMISSION_ENABLED is false, every client-side surface that used
// to write to Supabase / invoke notify-lead / invoke distribute-lead / POST to
// the Zapier webhook must short-circuit BEFORE the network call and render
// <MaintenanceHoldingState />.
//
// Surfaces gated by this flag (search for `LEAD_SUBMISSION_ENABLED`):
//   - src/components/LeadForm.tsx                     (primary homepage form,
//                                                      also used by SmartQuoteEngine)
//   - src/pages/GetQuote.tsx                          (full-page quote form)
//   - src/components/ChatWidget.tsx                   (chatbot lead capture)
//   - src/components/renovation/LeadCaptureForm.tsx   (AI Preview gated reveal)
//   - src/components/renovation/LeadCaptureModal.tsx  (AI Preview modal)
//
// TO RE-ENABLE THE LEAD FLOW AFTER THE SPRINT:
//   1. Replace the client-side `supabase.from("leads").insert()` and
//      `fetch(ZAPIER_HOOK)` writes with a single call to the new server-side
//      submit edge function (TCPA-compliant consent log + Turnstile + rate
//      limit). DO NOT just flip this flag back to true — the original code
//      paths are unsafe.
//   2. Remove every `if (!LEAD_SUBMISSION_ENABLED)` guard and the TODO
//      comments tagged `LEAD-GATE-TODO`.
//   3. Delete `MaintenanceHoldingState.tsx` and this file.
// ─────────────────────────────────────────────────────────────────────────────

export const LEAD_SUBMISSION_ENABLED = false;

export const MAINTENANCE_MESSAGE =
  "We are currently upgrading our contractor network and temporarily not accepting new quote requests.";

export const MAINTENANCE_HEADLINE = "We're upgrading our contractor network";

// TODO(LEAD-GATE-TODO): Provision real US callback line (OpenPhone / Twilio)
// and replace both constants below. CALLBACK_PHONE_E164 must be in E.164
// format ("+15551234567") so `tel:` links work cross-platform.
// While CALLBACK_PHONE_E164 is empty, MaintenanceHoldingState renders a
// "Phone line being provisioned" notice instead of a live tap-to-call.
export const CALLBACK_PHONE_E164 = "";                  // e.g. "+18135550123"
export const CALLBACK_PHONE_DISPLAY = "";               // e.g. "(813) 555-0123"
export const CALLBACK_HOURS = "Mon–Fri · 8AM–6PM EST";
