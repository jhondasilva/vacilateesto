DROP POLICY IF EXISTS "Allowed users can view whitelist" ON public.allowed_users;

CREATE POLICY "Authenticated users can check their own email"
ON public.allowed_users
FOR SELECT
TO authenticated
USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()));