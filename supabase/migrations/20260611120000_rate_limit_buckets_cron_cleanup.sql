-- ============================================================
-- Build Right USA — Sprint 1 T11
-- Scheduled cleanup for rate_limit_buckets via pg_cron.
--
-- The rate-limit helper (supabase/functions/_shared/rate-limit.ts) writes
-- one row per (endpoint, ip-hash, rounded window). Without pruning, the
-- table grows unbounded. This migration enables pg_cron and schedules an
-- hourly DELETE of expired buckets.
--
-- Idempotent: safe to re-run. Only ever deletes rows whose window has
-- already expired (expires_at < now()), so active counters are never
-- touched (active windows always carry a future expires_at). The delete
-- uses the existing rate_limit_buckets_expires_at_idx index.
--
-- NOTE: applying this requires pg_cron to be enabled on the project
-- (Supabase Dashboard -> Database -> Extensions, or the CREATE EXTENSION
-- below if the migration role has privilege). pg_cron runs only in the
-- 'postgres' database. Do NOT rely on this until it has been applied AND a
-- successful run is confirmed in cron.job_run_details. This file is created
-- but NOT applied (no db push) as of T11.
-- ============================================================

-- ── 1. Ensure pg_cron is available ────────────────────────
create extension if not exists pg_cron;

-- ── 2. Idempotent (re)schedule ────────────────────────────
-- cron.unschedule(name) raises if the job name does not exist, so guard it
-- with an EXISTS check. This keeps the migration safe to re-run.
select cron.unschedule('rate-limit-buckets-cleanup')
where exists (
  select 1 from cron.job where jobname = 'rate-limit-buckets-cleanup'
);

-- ── 3. Hourly prune of expired rate-limit buckets ─────────
select cron.schedule(
  'rate-limit-buckets-cleanup',
  '0 * * * *',
  $$ delete from public.rate_limit_buckets where expires_at < now(); $$
);

-- ── ROLLBACK NOTES ────────────────────────────────────────
-- select cron.unschedule('rate-limit-buckets-cleanup');
-- (Leave pg_cron installed; drop only if nothing else uses it:
--  drop extension if exists pg_cron;)
