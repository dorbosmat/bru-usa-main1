// ─────────────────────────────────────────────────────────────────────────────
// Consent text registry (Sprint Task 7)
//
// Single source of truth for the TCPA/lead-gen consent copy that
// appears on every submission surface (LeadForm, GetQuote, AI Preview
// lead capture, chat lead capture). When the wording is changed, BUMP
// THE VERSION KEY — never mutate an existing version's text in place.
// The submit-lead edge function has the same registry; both sides must
// agree on a version key before a submission is accepted.
//
// CONSENT-TODO: this copy is conservative — Build Right USA contacts
// the visitor itself rather than promising specific named contractor
// buyers will call. Before flipping LEAD_SUBMISSION_ENABLED to true,
// have outside counsel review against:
//   1. The FCC 2024 "one-to-one consent" reform (per-seller consent
//      required if the lead is sold to multiple contractor buyers).
//   2. CCPA / CPRA right-to-opt-out language.
//   3. SMS-specific carrier requirements (CTIA Short Code Compliance).
//
// TCPA-TODO: when contractor buyers are real, the consent text MUST be
// expanded to enumerate each seller by name (and a separate checkbox
// per seller may be required). At that point a v2 version key replaces
// v1 here AND in the submit-lead edge function.
// ─────────────────────────────────────────────────────────────────────────────

export interface ConsentVersion {
  version: string;
  /** The literal copy shown next to the consent checkbox. */
  text: string;
  /** ISO date when this wording was first published. */
  publishedAt: string;
}

export const CURRENT_CONSENT: ConsentVersion = {
  version: "v1-2026-05-20",
  publishedAt: "2026-05-20",
  text:
    "By submitting, you agree that Build Right USA may contact you about your project by phone, SMS, or email at the contact information you provide, including by automated technology. Consent is not a condition of any purchase. Message and data rates may apply. You can opt out at any time by replying STOP. See our Privacy Policy, SMS Consent, and Lead Generation Disclosure for details.",
};
