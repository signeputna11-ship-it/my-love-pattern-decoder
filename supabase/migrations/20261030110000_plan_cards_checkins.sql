-- Phase 1: a personal plan, daily support cards and weekly check-ins.
alter table public.profiles add column if not exists plan_started_at timestamptz;

create table public.daily_cards (
  id uuid primary key default gen_random_uuid(),
  journey_slug text not null,
  day integer not null check (day between 1 and 365),
  body text not null,
  created_at timestamptz not null default now(),
  unique (journey_slug, day)
);
alter table public.daily_cards enable row level security;
create policy "daily_cards_read" on public.daily_cards for select to authenticated using (true);
create policy "daily_cards_admin_write" on public.daily_cards
  for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

create table public.weekly_checkins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  week_start date not null,
  mood integer not null check (mood between 1 and 5),
  win text,
  wobble text,
  next_commitment text,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, week_start)
);
create index idx_weekly_checkins_user on public.weekly_checkins(user_id, week_start desc);
alter table public.weekly_checkins enable row level security;
create policy "checkins_select_own" on public.weekly_checkins for select to authenticated using (auth.uid() = user_id);
create policy "checkins_insert_own" on public.weekly_checkins for insert to authenticated with check (auth.uid() = user_id);
create policy "checkins_update_own" on public.weekly_checkins for update to authenticated using (auth.uid() = user_id);
create policy "checkins_admin_select" on public.weekly_checkins for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create trigger trg_checkins_updated before update on public.weekly_checkins
  for each row execute function public.update_updated_at_column();
