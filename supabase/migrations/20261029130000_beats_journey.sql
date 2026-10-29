-- Free Binaural Beats collection, placed right after Start Here.
do $$
begin
  if not exists (select 1 from public.journeys where slug = 'beats') then
    update public.journeys set position = position + 1 where position >= 1;
    insert into public.journeys (slug, position, title, subtitle, is_published)
    values ('beats', 1, 'Binaural Beats', 'Free soundscapes for focus, calm and intention.', true);
  end if;
end $$;
