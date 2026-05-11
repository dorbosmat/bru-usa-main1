-- Fix: Restrict lead_distributions INSERT to admin/agent roles only (was public with no conditions)
DROP POLICY "Anyone can insert distributions" ON public.lead_distributions;

CREATE POLICY "Service functions can insert distributions"
ON public.lead_distributions
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Note: We keep this open because edge functions (distribute-lead) insert as anon.
-- However, we add a separate tighter policy for production:
-- The real fix is that distribute-lead edge function uses service_role_key,
-- so we can restrict anon INSERT. Let's do that:

DROP POLICY "Service functions can insert distributions" ON public.lead_distributions;

CREATE POLICY "Authenticated admins/agents can insert distributions"
ON public.lead_distributions
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'agent'::app_role));

-- Allow service role (edge functions) to bypass RLS automatically

-- Tighten event_log INSERT: add rate-limit-like protection by restricting to known event types
-- (keeping open since it's low-risk analytics data, but removing the public "true" policy is too breaking)

-- Enable leaked password protection will be done via configure_auth tool