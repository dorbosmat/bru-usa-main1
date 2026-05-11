
-- Create photos table
CREATE TABLE public.photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  url text NOT NULL,
  storage_path text,
  service_category text NOT NULL DEFAULT 'Other',
  location_tag text NOT NULL DEFAULT 'Unknown',
  quality_score integer NOT NULL DEFAULT 50,
  approved boolean NOT NULL DEFAULT false,
  caption text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;

-- Anyone can view approved photos
CREATE POLICY "Anyone can view approved photos"
  ON public.photos FOR SELECT
  USING (approved = true);

-- Admins can do everything
CREATE POLICY "Admins can manage photos"
  ON public.photos FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Create storage bucket for photos
INSERT INTO storage.buckets (id, name, public) VALUES ('photos', 'photos', true);

-- Storage policies: admin upload
CREATE POLICY "Admins can upload photos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'photos' AND public.has_role(auth.uid(), 'admin'::app_role));

-- Storage policies: admin delete
CREATE POLICY "Admins can delete photos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'photos' AND public.has_role(auth.uid(), 'admin'::app_role));

-- Public read for photos bucket
CREATE POLICY "Public can view photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'photos');
