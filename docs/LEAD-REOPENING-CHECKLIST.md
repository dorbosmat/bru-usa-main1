# Lead Reactivation Checklist — Build Right USA

> **Status: LEADS ARE INTENTIONALLY OFF.** This document is the single
> authoritative runbook for safely turning lead capture back on. Do **not**
> flip the two gates (bottom of this file) until **every** item in sections
> A–F is checked. Created in **Sprint Task 14** (readiness prep only — no gates
> were flipped).

The platform has **defense in depth**: two independent gates must both be ON to
accept a lead.

| Gate | Where | Value today | Controls |
|------|-------|-------------|----------|
| `LEAD_SUBMISSION_ENABLED` | `src/lib/lead-submission-gate.ts` | `false` | Frontend — every form short-circuits to `MaintenanceHoldingState` |
| `SUBMIT_LEAD_ENABLED` | Supabase secret (edge fn) | unset → **HTTP 503** | Backend — `submit-lead` rejects all payloads |

---

## A. Turnstile (bot protection)

Frontend plumbing is **DONE** (Task 14). All five surfaces mount an invisible
`<TurnstileWidget>` and pass its token into `submitLeadV1`:
`LeadForm`, `GetQuote`, `LeadCaptureForm`, `LeadCaptureModal`, `ChatWidget`.
While `VITE_TURNSTILE_SITE_KEY` is empty the widget renders nothing and
`getToken()` returns the dev sentinel — **no UX impact, no enforcement**.

- [ ] Create a Cloudflare Turnstile widget (free tier); note site key + secret.
- [ ] Set `VITE_TURNSTILE_SITE_KEY` in **Vercel** env (Production + Preview).
- [ ] Set `TURNSTILE_SECRET_KEY` in **Supabase** secrets.
- [ ] In `supabase/functions/submit-lead/index.ts`, change the Turnstile block
      from soft-pass to **hard reject** (the `TURNSTILE-TODO` at the `if
      (!turnstile.valid)` branch) so an invalid/missing token returns 403.
- [ ] Confirm the widget `action` (`"submit-lead"`) matches `expectedAction` in
      the edge function.

## B. Real US callback phone

Phone is now a **single source of truth**: `src/lib/phone.ts`. `COMPANY_PHONE`
(marketing) and `CALLBACK_PHONE_*` (maintenance) both derive from it.

- [ ] Provision a real US line (OpenPhone / Twilio).
- [ ] Set `CALLBACK_PHONE_E164` (format `+1XXXXXXXXXX`) and
      `CALLBACK_PHONE_DISPLAY` (format `(XXX) XXX-XXXX`) in `src/lib/phone.ts`.
      `hasRealCallbackNumber` flips to `true` automatically and
      `MaintenanceHoldingState` renders a live tap-to-call.
- [ ] **Never** restore the old fictional `(555) 123-4567` placeholder.

## C. Consent / counsel review (legal)

- [ ] Outside counsel reviews `src/lib/consent-text.ts` (`CURRENT_CONSENT`)
      against: FCC 2024 one-to-one consent reform, CCPA/CPRA opt-out, CTIA SMS.
- [ ] If contractor **buyers** are named, expand consent to enumerate each
      seller (likely a per-seller checkbox) and bump to a **v2** key in BOTH
      `src/lib/consent-text.ts` and the `CONSENT_VERSIONS` registry in
      `supabase/functions/submit-lead/index.ts` (keep v1 — historic leads
      reference it).
- [ ] **ChatWidget HARD BLOCKER:** the chat flow has **no explicit consent
      step** today. Add a yes/no confirmation in `ChatWidget.submitLead`
      *before* `submitLeadV1` (the `TCPA-TODO` there). `submitLeadV1` always
      sends `consent.given=true`, which is untrue for chat until this exists.
      Do **not** reopen chat lead capture without it.

## D. Contractor onboarding (supply)

- [ ] Onboard ≥1 real licensed contractor with a signed lead-share agreement.
- [ ] Populate `public.contractors` with active rows for the target ZIP(s).
- [ ] Only then enable distribution: uncomment the `distribute-lead` invoke in
      `submit-lead/index.ts` (`LEAD-REOPEN-TODO`) and verify
      `distribution_status` is updated.
- [ ] Keep `SERVICE_AREAS` (`src/lib/constants.ts`) honest — no metro without
      real contractor supply; never use "nationwide"/"all 50 states" copy.

## E. Admin / security blockers (PII exposure)

The admin role can read every homeowner's PII (phone, email, address). These
must be closed **before** real leads flow (`SECURITY-TODO` in
`src/pages/admin/AdminLogin.tsx`):

- [ ] **MFA:** enable Supabase TOTP MFA; require it for the `admin` role.
- [ ] **Admin access:** add a Vercel middleware / edge-config IP allowlist
      gating all `/admin/*` to office/VPN ranges (`robots.txt` already
      Disallows `/admin`, but that is not an access control).
- [ ] **Session:** reduce admin session timeout to ≤ 4 hours.
- [ ] **Audit log:** add a table every admin write appends to.
- [ ] **Rate limit:** flip `ENFORCE_RATE_LIMIT=1` in Supabase secrets so
      `submit-lead` hard-rejects bucket overflows (helper:
      `supabase/functions/_shared/rate-limit.ts`; default 10/IP/hour). Leave in
      shadow mode until ~1 week of `abuse_events` has been reviewed.
- [ ] **Monitoring:** confirm `abuse_events` is populating (honeypot trips,
      turnstile-observed-invalid, rate-limit) and watch `submit-lead` logs via
      `get_logs` after reopen.

## F. Final smoke tests (staging / preview first)

- [ ] With keys set but gates still OFF: confirm `submit-lead` still returns
      **503** (proves the backend gate, not just the frontend).
- [ ] Flip gates in a **preview** env only; submit one real test lead end to
      end: row in `leads` + immutable row in `lead_consent_log` (correct
      consent version) + `notify-lead` email received.
- [ ] Submit with a bad/missing Turnstile token → **403**.
- [ ] Exceed the rate limit → **429**.
- [ ] Honeypot filled → silent `200` accept-and-discard (no row).
- [ ] Verify no fake social proof reappears (`REALTIME_ACTIVITY_ENABLED`,
      `MATCHING_ANIMATION_ENABLED`, `HARDCODED_TESTIMONIALS_ENABLED` stay
      `false` unless wired to real data).

---

## THE FINAL TWO-FLAG FLIP (do last, in this order)

Only after A–F are fully checked:

1. **Backend first:** set `SUBMIT_LEAD_ENABLED=1` in Supabase secrets.
   Verify a direct POST now passes validation in a preview project.
2. **Frontend second:** set `LEAD_SUBMISSION_ENABLED = true` in
   `src/lib/lead-submission-gate.ts`; deploy.

Flip backend → frontend so the public UI never opens before the server accepts.
To pause again, flip either gate back; both must be ON to accept a lead.
