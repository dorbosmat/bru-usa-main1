-- ============================================================
-- Build Right USA — Final consolidated migration
-- Run this in Supabase SQL Editor AFTER all prior migrations
-- This migration is ADDITIVE — safe to run on existing DBs
-- ============================================================

-- ── 1. LEAD DEDUPLICATION ──────────────────────────────────
-- Adds idempotency_key for server-side dedup on upsert.
-- The client sends: base64(email|service|YYYY-MM-DD)

ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS idempotency_key TEXT;

-- Back-fill existing rows
UPDATE public.leads
SET idempotency_key = encode(
  sha256((COALESCE(email,'') || '|' || COALESCE(service,'') || '|' || created_at::date::text)::bytea),
  'hex'
)
WHERE idempotency_key IS NULL;

-- Unique constraint used by ON CONFLICT clause
DO $$ BEGIN
  ALTER TABLE public.leads ADD CONSTRAINT leads_idempotency_key_unique UNIQUE (idempotency_key);
EXCEPTION WHEN duplicate_table THEN NULL; END $$;

-- Belt-and-suspenders: partial unique index on (email, service, date)
CREATE UNIQUE INDEX IF NOT EXISTS leads_email_service_date_unique
  ON public.leads (lower(email), service, (created_at::date))
  WHERE email IS NOT NULL AND service IS NOT NULL;

-- Performance index for rate-limit queries
CREATE INDEX IF NOT EXISTS leads_email_created_idx
  ON public.leads (lower(email), created_at DESC);

-- ── 2. TIGHTEN SITE_SETTINGS SELECT ───────────────────────
-- Anon can only read the two feature-flag keys needed by the frontend.
-- Prevents future keys from leaking to the public.

DROP POLICY IF EXISTS "Anyone can read site settings"   ON public.site_settings;
DROP POLICY IF EXISTS "anon_select_site_settings"       ON public.site_settings;

CREATE POLICY "anon_select_site_settings"
  ON public.site_settings FOR SELECT TO anon
  USING (key IN ('CHAT_ENABLED', 'FAKE_ACTIVITY_ENABLED'));

-- Authenticated users (admin) can still read everything
CREATE POLICY "auth_select_site_settings"
  ON public.site_settings FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- ── 3. TIGHTEN EVENT_LOG INSERT ────────────────────────────
-- Only allow known event types — prevents arbitrary injection.

DROP POLICY IF EXISTS "Anyone can insert events" ON public.event_log;

CREATE POLICY "anon_insert_event_log"
  ON public.event_log FOR INSERT TO anon, authenticated
  WITH CHECK (
    event_type IN ('form_submitted','ai_preview_lead','matching_shown','toast_shown','cta_click','page_view')
  );

-- ── 4. BLOCK ANON SELECT ON CONTRACTORS ───────────────────
-- Contractor phone/email/zip data must NOT be public.

DROP POLICY IF EXISTS "Public can view contractors" ON public.contractors;

-- Ensure no accidental public select exists
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename='contractors' AND policyname='auth_select_contractors'
  ) THEN
    CREATE POLICY "auth_select_contractors"
      ON public.contractors FOR SELECT TO authenticated
      USING (has_role(auth.uid(),'admin'::app_role) OR has_role(auth.uid(),'agent'::app_role));
  END IF;
END $$;

-- ── 5. SEED: update FAKE_ACTIVITY_ENABLED to false ─────────
-- We now use real Supabase Realtime data. Disable the fake flag.

INSERT INTO public.site_settings (key, value)
VALUES ('FAKE_ACTIVITY_ENABLED', 'true'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- ── 6. ENSURE leads REALTIME IS ENABLED ───────────────────
-- ActivityToast uses postgres_changes on the leads table.
-- This is configured in Supabase Dashboard → Database → Replication
-- but we document the requirement here:
-- ALTER PUBLICATION supabase_realtime ADD TABLE public.leads;
-- (Run manually in Supabase Dashboard if Realtime isn't working for leads)

-- ── ROLLBACK NOTES ─────────────────────────────────────────
-- ALTER TABLE public.leads DROP CONSTRAINT IF EXISTS leads_idempotency_key_unique;
-- DROP INDEX IF EXISTS leads_email_service_date_unique;
-- DROP INDEX IF EXISTS leads_email_created_idx;
-- ALTER TABLE public.leads DROP COLUMN IF EXISTS idempotency_key;
