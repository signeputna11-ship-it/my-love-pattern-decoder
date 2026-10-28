-- Admins can attach audio to modules (and edit module text) from the app.
create policy "modules_admin_write" on public.modules
  for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));
