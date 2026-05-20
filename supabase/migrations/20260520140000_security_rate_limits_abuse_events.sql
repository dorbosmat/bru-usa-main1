-- ============================================================
-- Build Right USA — Persistent rate-limit + abuse-event log
-- Sprint Task 6 (Turnstile + rate-limit infrastructure scaffolding)
--
-- Adds two tables that the edge-function helpers
-- (supabase/functions/_shared/rate-limit.ts and turnstile.ts) read
-- and write. Both are RLS-locked to service_role; the anon and
-- authenticated roles have no access. The helpers run in SHADOW MODE
-- today — they record observations but do not yet reject requests.
--
-- Safe to apply anytime — purely additive, no data migration,
-- no behavioral change to existing flows.
-- ============================================================

-- ── 1. rate_limit_buckets ─────────────────────────────────
-- Each row is a single (endpoint, ip-hash, window) counter.
-- Helpers upsert into this table with an atomic increment using
-- ON CONFLICT … DO UPDATE SET count = count + 1.

CREATE TABLE IF NOT EXISTS public.rate_limit_buckets (
  id                  uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  endpoint            text          NOT NULL,
  ip_hash             text          NOT NULL,
  count               integer       NOT NULL DEFAULT 1,
  window_started_at   timestamptz   NOT NULL DEFAULT now(),
  expires_at          timestamptz   NOT NULL,
  created_at          timestamptz   NOT NULL DEFAULT now()
);

-- Composite key for the atomic upsert.
CREATE UNIQUE INDEX IF NOT EXISTS rate_limit_buckets_endpoint_ip_window_uniq
  ON public.rate_limit_buckets (endpoint, ip_hash, window_started_at);

-- Cleanup index — a scheduled job (or a per-request opportunistic
-- delete) prunes rows where expires_at < now().
CREATE INDEX IF NOT EXISTS rate_limit_buckets_expires_at_idx
  ON public.rate_limit_buckets (expires_at);

ALTER TABLE public.rate_limit_buckets ENABLE ROW LEVEL SECURITY;

-- Service role only. anon + authenticated have no SELECT / INSERT /
-- UPDATE / DELETE on this table (no policies = no access by default).
-- (RLS denies by default once enabled and no policies are defined.)

COMMENT ON TABLE public.rate_limit_buckets IS
'Rate-limit counters keyed by (endpoint, sha256(ip), rounded window). '
'Written by supabase/functions/_shared/rate-limit.ts. service_role only.';


-- ── 2. abuse_events ───────────────────────────────────────
-- Audit log of suspicious activity. Helpers write a row when:
--   - a rate-limit window would-have-been exceeded (shadow mode)
--   - a Turnstile token verification fails
--   - an input fails server-side validation
-- The log lets us tune limits before flipping enforcement on.

CREATE TABLE IF NOT EXISTS public.abuse_events (
  id            uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type    text          NOT NULL,
  endpoint      text          NOT NULL,
  ip_hash       text,
  details       jsonb         NOT NULL DEFAULT '{}'::jsonb,
  created_at    timestamptz   NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS abuse_events_endpoint_created_idx
  ON public.abuse_events (endpoint, created_at DESC);

CREATE INDEX IF NOT EXISTS abuse_events_ip_created_idx
  ON public.abuse_events (ip_hash, created_at DESC)
  WHERE ip_hash IS NOT NULL;

CREATE INDEX IF NOT EXISTS abuse_events_event_type_idx
  ON public.abuse_events (event_type);

ALTER TABLE public.abuse_events ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE public.abuse_events IS
'Audit log of rate-limit hits, Turnstile failures, and input '
'validation rejections. Written by edge function helpers. '
'service_role only. anon + authenticated have no access.';


-- ── 3. Cleanup job hint ───────────────────────────────────
-- RATE-LIMIT-TODO: schedule a pg_cron job (or a recurring edge function)
-- that runs the following hourly to keep rate_limit_buckets bounded:
--
--   DELETE FROM public.rate_limit_buckets WHERE expires_at < now();
--
-- Without it, the table grows unbounded. With pg_cron available in
-- Supabase, register the job via SQL once the extension is enabled.


-- ── ROLLBACK NOTES ────────────────────────────────────────
-- DROP TABLE IF EXISTS public.abuse_events;
-- DROP TABLE IF EXISTS public.rate_limit_buckets;
