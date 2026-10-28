-- Journeys: group modules into themed paths (Relationships, Confidence, ...) and attach audio to modules.

create table if not exists public.journeys (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  position integer not null,
  title text not null,
  subtitle text,
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.journeys enable row level security;

create policy "journeys_read_published" on public.journeys
  for select to authenticated
  using (is_published or public.has_role(auth.uid(), 'admin'));
create policy "journeys_admin_write" on public.journeys
  for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

alter table public.modules
  add column if not exists journey_id uuid references public.journeys(id) on delete set null,
  add column if not exists audio_path text,
  add column if not exists audio_title text,
  add column if not exists audio_minutes integer,
  add column if not exists audio_binaural boolean not null default false;
create index if not exists idx_modules_journey on public.modules(journey_id);

insert into public.journeys (slug, position, title, subtitle, is_published) values
  ('relationships', 1, 'Relationships', 'Understand your love pattern and choose differently.', true),
  ('confidence', 2, 'Confidence', 'Stop second-guessing. Start trusting yourself.', false),
  ('money-and-business', 3, 'Money and Business', 'Release money blocks and charge what you are worth.', false),
  ('purpose', 4, 'Purpose', 'Find the direction that feels like yours.', false),
  ('sustainable-growth', 5, 'Sustainable Growth', 'Grow in a way you can keep up for life.', false)
on conflict (slug) do nothing;

update public.modules
set journey_id = (select id from public.journeys where slug = 'relationships')
where journey_id is null;

-- Only show modules (and their exercises, which inherit this check) of published journeys.
drop policy if exists "modules_read_authenticated" on public.modules;
create policy "modules_read_published_journeys" on public.modules
  for select to authenticated
  using (
    journey_id is null
    or exists (
      select 1 from public.journeys j
      where j.id = modules.journey_id
        and (j.is_published or public.has_role(auth.uid(), 'admin'))
    )
  );

-- Private audio bucket: signed in members can listen, admins upload.
insert into storage.buckets (id, name, public)
values ('audio', 'audio', false)
on conflict (id) do nothing;

create policy "audio_members_read" on storage.objects
  for select to authenticated
  using (bucket_id = 'audio');
create policy "audio_admin_insert" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'audio' and public.has_role(auth.uid(), 'admin'));
create policy "audio_admin_update" on storage.objects
  for update to authenticated
  using (bucket_id = 'audio' and public.has_role(auth.uid(), 'admin'));
create policy "audio_admin_delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'audio' and public.has_role(auth.uid(), 'admin'));
