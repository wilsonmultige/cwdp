-- Create storage buckets for organized image management
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('projects', 'projects', true, 5242880, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']),
  ('gallery', 'gallery', true, 5242880, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']),
  ('logos', 'logos', true, 2097152, ARRAY['image/png', 'image/svg+xml', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Storage policies for projects bucket
CREATE POLICY "Public can view project images"
ON storage.objects FOR SELECT
USING (bucket_id = 'projects');

CREATE POLICY "Admins can upload project images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'projects' AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.user_id = auth.uid()
    AND profiles.role = 'admin'
  )
);

CREATE POLICY "Admins can update project images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'projects' AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.user_id = auth.uid()
    AND profiles.role = 'admin'
  )
);

CREATE POLICY "Admins can delete project images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'projects' AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.user_id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Storage policies for gallery bucket
CREATE POLICY "Public can view gallery images"
ON storage.objects FOR SELECT
USING (bucket_id = 'gallery');

CREATE POLICY "Admins can upload gallery images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'gallery' AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.user_id = auth.uid()
    AND profiles.role = 'admin'
  )
);

CREATE POLICY "Admins can update gallery images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'gallery' AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.user_id = auth.uid()
    AND profiles.role = 'admin'
  )
);

CREATE POLICY "Admins can delete gallery images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'gallery' AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.user_id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Storage policies for logos bucket
CREATE POLICY "Public can view logos"
ON storage.objects FOR SELECT
USING (bucket_id = 'logos');

CREATE POLICY "Admins can upload logos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'logos' AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.user_id = auth.uid()
    AND profiles.role = 'admin'
  )
);

CREATE POLICY "Admins can update logos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'logos' AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.user_id = auth.uid()
    AND profiles.role = 'admin'
  )
);

CREATE POLICY "Admins can delete logos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'logos' AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.user_id = auth.uid()
    AND profiles.role = 'admin'
  )
);