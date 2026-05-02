revoke execute on function public.has_paid_access(uuid) from public, anon, authenticated;
grant execute on function public.has_paid_access(uuid) to service_role;