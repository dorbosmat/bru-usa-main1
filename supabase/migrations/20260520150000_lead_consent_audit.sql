-- ============================================================
-- Build Right USA — Lead consent + audit columns
-- Sprint Task 7 (TCPA-safe lead reopening infrastructure)
--
-- Adds the audit fields required for a defensible TCPA consent
-- record to public.leads, plus an append-only public.lead_consent_log
-- table that captures the original consent state as an immutable
-- snapshot (so admin edits to the leads row never destroy the proof
-- that consent existed at submission time).
--
-- Lead submission is still gated OFF in the frontend
-- (LEAD_SUBMISSION_ENABLED = false in src/lib/lead-submission-gate.ts)
-- AND in the new submit-lead edge function (SUBMIT_LEAD_ENABLED secret
-- unset). Both gates must flip to re-enable. This migration is purely
-- additive and changes no behavior on its own.
-- ============================================================

-- ── 1. New audit columns on public.leads ──────────────────

ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS consent_given       boolean;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS consent_text_version text;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS consent_given_at    timestamptz;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS ip_address          text;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS user_agent          text;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS source_url          text;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS submission_method   text;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS distribution_status text DEFAULT 'not_distributed';
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS lead_buyer          text;

-- Enforce known distribution states. The default 'not_distributed' is
-- correct while contractor distribution is paused (no real contractors
-- onboarded yet, see distribute-lead notes). Other values reserved for
-- future use.
DO $$ BEGIN
  ALTER TABLE public.leads
    ADD CONSTRAINT leads_distribution_status_chk
    CHECK (distribution_status IN ('not_distributed','pending','distributed','no_match','paused'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

COMMENT ON COLUMN public.leads.consent_given        IS 'True when the visitor explicitly ticked the consent checkbox at submission time.';
COMMENT ON COLUMN public.leads.consent_text_version IS 'Pointer to the version in the server-side consent registry; the authoritative text is stored in lead_consent_log.consent_text_snapshot.';
COMMENT ON COLUMN public.leads.consent_given_at     IS 'Server clock at the moment the row was inserted.';
COMMENT ON COLUMN public.leads.ip_address           IS 'Source IP captured by the submit-lead edge function (x-forwarded-for / cf-connecting-ip).';
COMMENT ON COLUMN public.leads.user_agent           IS 'User-Agent header from the submitting request.';
COMMENT ON COLUMN public.leads.source_url           IS 'Full URL the visitor was on when they submitted (path + query string).';
COMMENT ON COLUMN public.leads.submission_method    IS 'Free-text marker — e.g. submit-lead-edge-v1 — to trace which submission code path produced the row.';
COMMENT ON COLUMN public.leads.distribution_status  IS 'Lifecycle state for contractor distribution; defaults to not_distributed while paused.';
COMMENT ON COLUMN public.leads.lead_buyer           IS 'Identifier of the contractor (or buyer cohort) the lead was assigned to, once distribution is live.';


-- ── 2. Append-only consent audit log ──────────────────────
-- One row per submission. Stores the literal consent text the server
-- knew at the moment of submission, so even if the leads row is later
-- archived / edited / soft-deleted, the original consent proof remains.

CREATE TABLE IF NOT EXISTS public.lead_consent_log (
  id                   uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id              uuid          NOT NULL,
  consent_given        boolean       NOT NULL,
  consent_text_version text          NOT NULL,
  consent_text_snapshot text         NOT NULL,
  ip_address           text,
  user_agent           text,
  source_url           text,
  submission_method    text,
  lead_buyer           text,
  submitted_at         timestamptz   NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS lead_consent_log_lead_id_idx
  ON public.lead_consent_log (lead_id);
CREATE INDEX IF NOT EXISTS lead_consent_log_submitted_at_idx
  ON public.lead_consent_log (submitted_at DESC);

ALTER TABLE public.lead_consent_log ENABLE ROW LEVEL SECURITY;

-- TCPA-TODO: explicitly grant admin read access via a policy here once
-- the admin-side consent log viewer ships. Today no policies are
-- defined, so RLS denies anon + authenticated and only service_role
-- (i.e. the submit-lead edge function and CLI tools) can write/read.

COMMENT ON TABLE public.lead_consent_log IS
'Append-only TCPA consent audit log. One row per lead submission. '
'Records the literal consent text the server knew at submission time '
'so that lead_id can always be traced back to verifiable consent. '
'Writes happen via supabase/functions/submit-lead. service_role only.';


-- ── ROLLBACK NOTES ────────────────────────────────────────
-- ALTER TABLE public.leads DROP COLUMN IF EXISTS consent_given;
-- ALTER TABLE public.leads DROP COLUMN IF EXISTS consent_text_version;
-- ALTER TABLE public.leads DROP COLUMN IF EXISTS consent_given_at;
-- ALTER TABLE public.leads DROP COLUMN IF EXISTS ip_address;
-- ALTER TABLE public.leads DROP COLUMN IF EXISTS user_agent;
-- ALTER TABLE public.leads DROP COLUMN IF EXISTS source_url;
-- ALTER TABLE public.leads DROP COLUMN IF EXISTS submission_method;
-- ALTER TABLE public.leads DROP COLUMN IF EXISTS distribution_status;
-- ALTER TABLE public.leads DROP COLUMN IF EXISTS lead_buyer;
-- ALTER TABLE public.leads DROP CONSTRAINT IF EXISTS leads_distribution_status_chk;
-- DROP TABLE IF EXISTS public.lead_consent_log;
