
CREATE OR REPLACE FUNCTION public.is_allowed_user()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.allowed_users au
    JOIN auth.users u
      ON lower(btrim(u.email)) = lower(btrim(au.email))
    WHERE u.id = auth.uid()
      AND u.email_confirmed_at IS NOT NULL
  )
$function$;
