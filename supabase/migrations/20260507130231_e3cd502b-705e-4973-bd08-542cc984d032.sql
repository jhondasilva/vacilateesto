
CREATE POLICY "Admins can view all brands"
  ON public.brands FOR SELECT TO authenticated
  USING (public.is_allowed_user());
