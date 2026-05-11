
-- Add 'distributed' to lead_status enum
ALTER TYPE public.lead_status ADD VALUE IF NOT EXISTS 'distributed';

-- Contractors table
CREATE TABLE public.contractors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text NOT NULL,
  contact_name text NOT NULL,
  phone text NOT NULL,
  email text,
  services_offered text[] NOT NULL DEFAULT '{}',
  zip_codes_served text[] NOT NULL DEFAULT '{}',
  city text,
  state text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  max_leads_per_day integer NOT NULL DEFAULT 10,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.contractors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage contractors" ON public.contractors
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Agents can view contractors" ON public.contractors
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'agent'));

-- Lead distribution table
CREATE TABLE public.lead_distributions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  contractor_id uuid NOT NULL REFERENCES public.contractors(id) ON DELETE CASCADE,
  sent_at timestamptz NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'sent' CHECK (status IN ('sent', 'viewed', 'contacted')),
  UNIQUE(lead_id, contractor_id)
);

ALTER TABLE public.lead_distributions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage distributions" ON public.lead_distributions
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Agents can view distributions" ON public.lead_distributions
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'agent'));

CREATE POLICY "Anyone can insert distributions" ON public.lead_distributions
  FOR INSERT WITH CHECK (true);
