INSERT INTO storage.buckets (id, name, public) VALUES ('brand-logos', 'brand-logos', true) ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Brand logos public read"
ON storage.objects FOR SELECT
USING (bucket_id = 'brand-logos');

CREATE POLICY "Admins can manage brand logos"
ON storage.objects FOR ALL
TO authenticated
USING (bucket_id = 'brand-logos' AND public.is_allowed_user())
WITH CHECK (bucket_id = 'brand-logos' AND public.is_allowed_user());