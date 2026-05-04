REVOKE EXECUTE ON FUNCTION public.has_paid_access(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_paid_access(uuid) TO authenticated, service_role;