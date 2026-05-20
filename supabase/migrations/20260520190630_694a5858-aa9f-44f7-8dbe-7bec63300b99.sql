GRANT EXECUTE ON FUNCTION public.is_allowed_user() TO authenticated;
GRANT EXECUTE ON FUNCTION public.user_has_brand_access(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_brand_client() TO authenticated;