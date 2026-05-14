
-- 1) Tighten receipt SELECT policy to owner folder (consistent with INSERT/DELETE)
DROP POLICY IF EXISTS "Allowed users can view receipts" ON storage.objects;
CREATE POLICY "Allowed users can view their own receipts"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'expense-receipts'
  AND public.is_allowed_user()
  AND (auth.uid())::text = (storage.foldername(name))[1]
);

-- 2) Explicit deny SELECT policy for newsletter_subscribers (service role bypasses RLS)
CREATE POLICY "No client read on newsletter subscribers"
ON public.newsletter_subscribers
FOR SELECT
TO anon, authenticated
USING (false);

-- 3) Harden is_allowed_user(): require verified email claim in JWT
CREATE OR REPLACE FUNCTION public.is_allowed_user()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  WITH claims AS (
    SELECT current_setting('request.jwt.claims', true)::json AS j
  )
  SELECT EXISTS (
    SELECT 1
    FROM public.allowed_users au, claims c
    WHERE lower(btrim(au.email)) = lower(btrim(coalesce(c.j ->> 'email', '')))
      AND coalesce((c.j ->> 'email_verified')::boolean, false) = true
  )
$function$;
