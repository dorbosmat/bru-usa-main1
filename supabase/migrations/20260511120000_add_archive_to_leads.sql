-- Soft-delete (archive) support for leads.
--
-- Admins can hide leads from the active list without losing the row, its
-- activity log, or any related history. Restoration is just an UPDATE that
-- sets archived_at back to NULL.
--
-- Defense in depth:
--   * The existing UPDATE RLS policy on `leads` permits both admins AND agents
--     to write rows. We want archive to be admin-only, so this migration adds
--     a BEFORE UPDATE trigger that hard-rejects any change to archived_at
--     coming from a user without the 'admin' role. The application also gates
--     the archive UI behind isAdmin, but the trigger ensures an agent who
--     reaches the table via the API cannot bypass that.

ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ NULL,
  ADD COLUMN IF NOT EXISTS archived_by UUID NULL REFERENCES auth.users(id) ON DELETE SET NULL;

-- Partial index speeds up the default active-leads query:
--   .is("archived_at", null) ORDER BY created_at DESC
CREATE INDEX IF NOT EXISTS leads_archived_at_idx
  ON public.leads (archived_at)
  WHERE archived_at IS NULL;

-- Trigger: only admins may toggle the archive flag.
CREATE OR REPLACE FUNCTION public.enforce_admin_only_lead_archive()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF (NEW.archived_at IS DISTINCT FROM OLD.archived_at)
     OR (NEW.archived_by IS DISTINCT FROM OLD.archived_by) THEN
    IF NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
      RAISE EXCEPTION 'Only admins can archive or restore leads'
        USING ERRCODE = '42501'; -- insufficient_privilege
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS leads_enforce_admin_only_archive ON public.leads;
CREATE TRIGGER leads_enforce_admin_only_archive
  BEFORE UPDATE ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_admin_only_lead_archive();
