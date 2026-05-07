
ALTER TABLE public.brand_users ALTER COLUMN user_id DROP NOT NULL;

CREATE OR REPLACE FUNCTION public.user_has_brand_access(_brand_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.brand_users bu
    WHERE bu.brand_id = _brand_id
      AND (
        bu.user_id = auth.uid()
        OR lower(btrim(bu.email)) = lower(btrim(coalesce(current_setting('request.jwt.claims', true)::json ->> 'email', '')))
      )
  )
$$;

CREATE OR REPLACE FUNCTION public.is_brand_client()
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.brand_users bu
    WHERE bu.user_id = auth.uid()
       OR lower(btrim(bu.email)) = lower(btrim(coalesce(current_setting('request.jwt.claims', true)::json ->> 'email', '')))
  )
$$;

DROP POLICY IF EXISTS "Users can view their own brand link" ON public.brand_users;
CREATE POLICY "Users can view their own brand links"
  ON public.brand_users FOR SELECT TO authenticated
  USING (
    user_id = auth.uid()
    OR lower(btrim(email)) = lower(btrim(coalesce(current_setting('request.jwt.claims', true)::json ->> 'email', '')))
  );
