-- Drop the broad public SELECT policy on brand-logos.
-- The bucket is public so direct downloads via /object/public/brand-logos/... still work,
-- but anonymous clients can no longer LIST all files in the bucket.
DROP POLICY IF EXISTS "Brand logos public read" ON storage.objects;

-- Lock down the admin-only maintenance function so it can't be called from the API.
REVOKE EXECUTE ON FUNCTION public.cleanup_duplicate_expense_reports() FROM PUBLIC, anon, authenticated;