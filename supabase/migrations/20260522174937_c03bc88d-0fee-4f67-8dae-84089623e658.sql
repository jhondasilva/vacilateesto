DROP POLICY IF EXISTS "Allowed users can delete their own receipts" ON storage.objects;
CREATE POLICY "Allowed users can delete their own receipts"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'expense-receipts'
  AND is_allowed_user()
  AND (auth.uid())::text = (storage.foldername(name))[1]
);