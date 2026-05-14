
DROP POLICY IF EXISTS "Allowed users can view their own receipts" ON storage.objects;

CREATE POLICY "Allowed users can view team receipts"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'expense-receipts'
  AND public.is_allowed_user()
);
