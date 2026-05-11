
-- Event log table for analytics
CREATE TABLE public.event_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  city text,
  zip text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.event_log ENABLE ROW LEVEL SECURITY;

-- Anyone can insert events (public site tracking)
CREATE POLICY "Anyone can insert events"
  ON public.event_log FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Admins can read events
CREATE POLICY "Admins can read events"
  ON public.event_log FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'));

-- Seed FAKE_ACTIVITY_ENABLED setting
INSERT INTO public.site_settings (key, value) VALUES ('FAKE_ACTIVITY_ENABLED', 'true'::jsonb);
