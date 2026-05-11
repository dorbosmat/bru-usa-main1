-- Revoke SELECT on leads from anon - they should only INSERT
REVOKE SELECT ON public.leads FROM anon;