revoke all on function public.has_paid_access(uuid) from public, anon;
grant execute on function public.has_paid_access(uuid) to authenticated;

revoke all on function public.handle_new_user() from public, anon, authenticated;