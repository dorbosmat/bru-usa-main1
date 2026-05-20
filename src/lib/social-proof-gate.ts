// ─────────────────────────────────────────────────────────────────────────────
// SOCIAL-PROOF GATE — Liability Containment Sprint (Task 2)
// ─────────────────────────────────────────────────────────────────────────────
//
// Every deceptive social-proof surface on Build Right USA is centrally gated
// by the constants in this file. While these flags are false, components MUST
// short-circuit and either render nothing or render honest static copy — no
// fake "someone in {city} just requested a quote" toasts, no random
// "we found N pros for you" matching theatre, no all-5★ hardcoded
// testimonials, no fabricated live activity of any kind.
//
// Surfaces gated by this file (search for `FAKE-ACTIVITY-TODO` for full list):
//   - src/components/ActivityToast.tsx         (live-activity toast notifications)
//   - src/components/LeadForm.tsx              (post-submit "matching … found N pros")
//   - src/pages/Index.tsx                      (hardcoded testimonials section)
//   - supabase/migrations/2026…_final_schema.sql
//                                              (DB seed for FAKE_ACTIVITY_ENABLED)
//
// TO RE-ENABLE A SURFACE LATER:
//   1. Wire the surface to REAL data (genuine Realtime feed for ActivityToast,
//      actual contractor distribution result for the LeadForm matching screen,
//      verified Google Business Profile or Trustpilot reviews for testimonials).
//   2. Flip the corresponding flag to true OR remove the gate guard entirely.
//   3. Do NOT just flip the flag back to true — the original code paths
//      shipped fabricated data and must not be reused as-is.
// ─────────────────────────────────────────────────────────────────────────────

// Controls <ActivityToast /> and any UI implying real-time user activity.
// Backed historically by site_settings.FAKE_ACTIVITY_ENABLED, but the code-side
// gate is now authoritative — the DB toggle in /admin/settings is overridden.
export const REALTIME_ACTIVITY_ENABLED = false;

// Controls the post-submit "Matching you with X pros in {ZIP}" theatre in
// LeadForm.tsx. The original implementation used Math.random() to fabricate
// the contractor count — a deceptive dark pattern. Re-enable ONLY when the
// number reflects a real distribute-lead result.
export const MATCHING_ANIMATION_ENABLED = false;

// Controls the hardcoded testimonials block on the homepage. The original
// seven entries were all-5★ Florida-only and read as marketing copy. Re-enable
// ONLY when wired to a verified third-party review source (Google Business
// Profile, Trustpilot) or to real first-party reviews with provenance.
export const HARDCODED_TESTIMONIALS_ENABLED = false;
