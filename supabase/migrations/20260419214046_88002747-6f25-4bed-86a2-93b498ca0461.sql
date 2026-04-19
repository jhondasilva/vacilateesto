DROP POLICY IF EXISTS "Authenticated users can check their own email" ON public.allowed_users;
DROP POLICY IF EXISTS "Allowed users can view whitelist" ON public.allowed_users;

CREATE POLICY "Authenticated users can check their own email"
ON public.allowed_users
FOR SELECT
TO authenticated
USING (lower(btrim(email)) = lower(btrim((current_setting('request.jwt.claims', true)::json ->> 'email'))));

CREATE OR REPLACE FUNCTION public.is_allowed_user()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO public
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.allowed_users au
    WHERE lower(btrim(au.email)) = lower(btrim(coalesce(current_setting('request.jwt.claims', true)::json ->> 'email', '')))
  )
$function$;