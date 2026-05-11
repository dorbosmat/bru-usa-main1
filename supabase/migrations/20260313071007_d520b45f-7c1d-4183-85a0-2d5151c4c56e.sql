-- Create storage bucket for renovation photo uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('renovation-uploads', 'renovation-uploads', true);

-- Allow anyone to upload to renovation-uploads
CREATE POLICY "Anyone can upload renovation photos"
ON storage.objects FOR INSERT TO anon, authenticated
WITH CHECK (bucket_id = 'renovation-uploads');

-- Allow anyone to read renovation uploads
CREATE POLICY "Anyone can view renovation uploads"
ON storage.objects FOR SELECT TO anon, authenticated
USING (bucket_id = 'renovation-uploads');