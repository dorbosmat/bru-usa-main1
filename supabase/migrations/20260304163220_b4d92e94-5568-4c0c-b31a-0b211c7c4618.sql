ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS budget_range text;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS timeline text;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS property_type text;