
-- Set search_path on the two SECURITY INVOKER helpers that lack it
ALTER FUNCTION public.get_diarization_status(integer) SET search_path = public;
ALTER FUNCTION public.get_videos_without_transcription(integer) SET search_path = public;

-- Lock down SECURITY DEFINER helpers that are only used internally (by triggers
-- or by RLS policies that run as the policy's invoker). They never need to be
-- callable directly by anon or authenticated clients.
REVOKE EXECUTE ON FUNCTION public.is_allowed_user() FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.is_brand_client() FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.user_has_brand_access(uuid) FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.cleanup_duplicate_expense_reports() FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.prevent_duplicate_expense_reports() FROM anon, authenticated, PUBLIC;

-- Tighten the newsletter INSERT policy: require a non-empty, plausibly-formed
-- email instead of accepting WITH CHECK (true) blindly.
DROP POLICY IF EXISTS "Anyone can subscribe to newsletter" ON public.newsletter_subscribers;
CREATE POLICY "Anyone can subscribe to newsletter"
ON public.newsletter_subscribers
FOR INSERT
TO anon, authenticated
WITH CHECK (
  email IS NOT NULL
  AND length(email) BETWEEN 5 AND 255
  AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
);
