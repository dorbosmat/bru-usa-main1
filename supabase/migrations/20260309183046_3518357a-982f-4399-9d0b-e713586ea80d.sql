-- Recreate admin/agent policies as PERMISSIVE so they actually work
DROP POLICY IF EXISTS "Admin/agents can view leads" ON public.leads;
CREATE POLICY "Admin/agents can view leads"
  ON public.leads FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'agent'::app_role));

DROP POLICY IF EXISTS "Admin/agents can update leads" ON public.leads;
CREATE POLICY "Admin/agents can update leads"
  ON public.leads FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'agent'::app_role));

DROP POLICY IF EXISTS "Admins can delete leads" ON public.leads;
CREATE POLICY "Admins can delete leads"
  ON public.leads FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));