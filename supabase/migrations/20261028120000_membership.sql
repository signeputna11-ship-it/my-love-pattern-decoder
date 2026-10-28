-- Membership (monthly / yearly subscription). Free tier = quiz + "Start Here" module.

create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  stripe_subscription_id text not null unique,
  stripe_customer_id text,
  price_lookup_key text,
  status text not null,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  environment text not null default 'sandbox',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_subscriptions_user on public.subscriptions(user_id);
alter table public.subscriptions enable row level security;
create policy "subscriptions_select_own" on public.subscriptions
  for select to authenticated using (auth.uid() = user_id);
-- writes happen only from the Stripe webhook (service role)

create trigger trg_subscriptions_updated before update on public.subscriptions
  for each row execute function public.update_updated_at_column();

create or replace function public.has_membership(_user_id uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.subscriptions
    where user_id = _user_id
      and (
        status in ('active', 'trialing')
        or (status = 'past_due' and current_period_end > now())
      )
  );
$$;
revoke execute on function public.has_membership(uuid) from public, anon;
grant execute on function public.has_membership(uuid) to authenticated, service_role;

alter table public.modules add column if not exists is_free boolean not null default false;

-- A module's content is open to: admins, members, anyone for free modules,
-- and (lifetime kit buyers) the Relationships journey only.
create or replace function public.can_access_module(_user_id uuid, _module_id uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1
    from public.modules m
    left join public.journeys j on j.id = m.journey_id
    where m.id = _module_id
      and (
        m.is_free
        or public.has_role(_user_id, 'admin')
        or public.has_membership(_user_id)
        or (coalesce(j.slug, 'relationships') = 'relationships' and public.has_paid_access(_user_id))
      )
  );
$$;
revoke execute on function public.can_access_module(uuid, uuid) from public, anon;
grant execute on function public.can_access_module(uuid, uuid) to authenticated, service_role;

drop policy if exists "exercises_read_authenticated" on public.exercises;
drop policy if exists "exercises_read_paid" on public.exercises;
create policy "exercises_read_accessible" on public.exercises
  for select to authenticated
  using (public.can_access_module(auth.uid(), module_id));

-- Audio files follow the same rule as the module they belong to.
drop policy if exists "audio_members_read" on storage.objects;
create policy "audio_accessible_read" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'audio'
    and exists (
      select 1 from public.modules m
      where m.audio_path = storage.objects.name
        and public.can_access_module(auth.uid(), m.id)
    )
  );

-- Free starter journey
insert into public.journeys (slug, position, title, subtitle, is_published) values
  ('start-here', 0, 'Start Here', 'A free calm moment, just for you.', true)
on conflict (slug) do nothing;

with j as (select id from public.journeys where slug = 'start-here')
insert into public.modules (slug, position, title, subtitle, intro, journey_id, is_free)
select 'start-calm', 1, 'Calm Start', 'Ten minutes to arrive in your body.',
  'Welcome. This free module is a gentle way to begin. Listen when you have a quiet moment, then write what you notice.',
  j.id, true
from j
on conflict (slug) do nothing;

insert into public.exercises (module_id, position, kind, title, body, options)
select m.id, e.position, 'prompt', e.title, e.body, null
from public.modules m
join (values
  (1, 'How do you feel right now?', 'Write a few words about your body and your mind.'),
  (2, 'What would you like more of in your days?', 'Name one thing, big or small.')
) as e(position, title, body) on true
where m.slug = 'start-calm'
  and not exists (select 1 from public.exercises x where x.module_id = m.id and x.position = e.position);
