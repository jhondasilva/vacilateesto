
CREATE POLICY "Admins view all brand_users" ON public.brand_users FOR SELECT TO authenticated USING (public.is_allowed_user());
CREATE POLICY "Admins insert brand_users" ON public.brand_users FOR INSERT TO authenticated WITH CHECK (public.is_allowed_user());
CREATE POLICY "Admins update brand_users" ON public.brand_users FOR UPDATE TO authenticated USING (public.is_allowed_user()) WITH CHECK (public.is_allowed_user());
CREATE POLICY "Admins delete brand_users" ON public.brand_users FOR DELETE TO authenticated USING (public.is_allowed_user());

CREATE POLICY "Admins view allowed_users" ON public.allowed_users FOR SELECT TO authenticated USING (public.is_allowed_user());
CREATE POLICY "Admins insert allowed_users" ON public.allowed_users FOR INSERT TO authenticated WITH CHECK (public.is_allowed_user());
CREATE POLICY "Admins delete allowed_users" ON public.allowed_users FOR DELETE TO authenticated USING (public.is_allowed_user());
