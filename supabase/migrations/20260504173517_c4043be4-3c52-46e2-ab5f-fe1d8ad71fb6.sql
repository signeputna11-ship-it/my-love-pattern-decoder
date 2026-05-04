REVOKE EXECUTE ON FUNCTION public.has_paid_access(uuid) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.has_paid_access(uuid) TO authenticated;