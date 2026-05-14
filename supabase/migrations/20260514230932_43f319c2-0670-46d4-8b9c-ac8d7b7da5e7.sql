-- Tighten expense_reports DELETE/UPDATE to require allowed user
DROP POLICY IF EXISTS "Allowed users can delete their own expense reports" ON public.expense_reports;
DROP POLICY IF EXISTS "Allowed users can update their own expense reports" ON public.expense_reports;

CREATE POLICY "Allowed users can delete their own expense reports"
ON public.expense_reports FOR DELETE
TO authenticated
USING (is_allowed_user() AND auth.uid() = user_id);

CREATE POLICY "Allowed users can update their own expense reports"
ON public.expense_reports FOR UPDATE
TO authenticated
USING (is_allowed_user() AND auth.uid() = user_id)
WITH CHECK (is_allowed_user() AND auth.uid() = user_id);

-- Tighten trip_comments DELETE to require allowed user
DROP POLICY IF EXISTS "Allowed users can delete own comments" ON public.trip_comments;

CREATE POLICY "Allowed users can delete own comments"
ON public.trip_comments FOR DELETE
TO authenticated
USING (is_allowed_user() AND auth.uid() = user_id);

-- Harden user_has_brand_access: only match email if confirmed
CREATE OR REPLACE FUNCTION public.user_has_brand_access(_brand_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.brand_users bu
    WHERE bu.brand_id = _brand_id
      AND (
        bu.user_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM auth.users u
          WHERE u.id = auth.uid()
            AND u.email_confirmed_at IS NOT NULL
            AND lower(btrim(u.email)) = lower(btrim(bu.email))
        )
      )
  )
$function$;
