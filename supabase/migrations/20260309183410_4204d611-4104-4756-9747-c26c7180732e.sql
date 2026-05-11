-- Grant table-level permissions required for RLS policies to work
GRANT INSERT ON public.leads TO anon;
GRANT INSERT ON public.leads TO authenticated;
GRANT SELECT ON public.leads TO authenticated;
GRANT UPDATE ON public.leads TO authenticated;
GRANT DELETE ON public.leads TO authenticated;

-- Also grant necessary permissions on event_log for lead form logging
GRANT INSERT ON public.event_log TO anon;
GRANT INSERT ON public.event_log TO authenticated;
GRANT SELECT ON public.event_log TO authenticated;