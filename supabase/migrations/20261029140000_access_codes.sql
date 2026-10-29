-- Free pass codes: an admin creates codes, members redeem them for Full Member or Starter access.
create table public.access_codes (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  tier text not null default 'full' check (tier in ('full', 'starter')),
  days integer not null default 90 check (days between 1 and 3650),
  max_uses integer not null default 1 check (max_uses >= 1),
  uses integer not null default 0,
  expires_at timestamptz,
  note text,
  active boolean not null default true,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);
alter table public.access_codes enable row level security;
create policy "access_codes_admin_all" on public.access_codes
  for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

create table public.access_grants (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  code_id uuid references public.access_codes(id) on delete set null,
  tier text not null check (tier in ('full', 'starter')),
  starts_at timestamptz not null default now(),
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  unique (user_id, code_id)
);
create index idx_access_grants_user on public.access_grants(user_id);
alter table public.access_grants enable row level security;
create policy "access_grants_select_own" on public.access_grants
  for select to authenticated using (auth.uid() = user_id);
create policy "access_grants_admin_select" on public.access_grants
  for select to authenticated using (public.has_role(auth.uid(), 'admin'));
-- writes happen only through redeem_access_code (security definer)

create or replace function public.redeem_access_code(_code text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
  c public.access_codes;
  g public.access_grants;
begin
  if uid is null then
    raise exception 'Please sign in first';
  end if;
  select * into c from public.access_codes where code = upper(trim(_code)) for update;
  if not found or not c.active then
    raise exception 'That code is not valid';
  end if;
  if c.expires_at is not null and c.expires_at < now() then
    raise exception 'That code has expired';
  end if;
  if exists (select 1 from public.access_grants where user_id = uid and code_id = c.id) then
    raise exception 'You have already used this code';
  end if;
  if c.uses >= c.max_uses then
    raise exception 'That code has already been used';
  end if;
  insert into public.access_grants (user_id, code_id, tier, expires_at)
  values (uid, c.id, c.tier, now() + make_interval(days => c.days))
  returning * into g;
  update public.access_codes set uses = uses + 1 where id = c.id;
  return jsonb_build_object('tier', g.tier, 'expires_at', g.expires_at);
end;
$$;
revoke all on function public.redeem_access_code(text) from public, anon;
grant execute on function public.redeem_access_code(text) to authenticated;

-- Passes count as membership: full grants open everything, starter grants open the starter set.
create or replace function public.has_membership(_user_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.subscriptions
    where user_id = _user_id
      and coalesce(price_lookup_key, '') not like 'signe_coach_starter%'
      and (status in ('active','trialing') or (status = 'past_due' and current_period_end > now()))
  ) or exists (
    select 1 from public.access_grants
    where user_id = _user_id and tier = 'full' and starts_at <= now() and expires_at > now()
  );
$$;

create or replace function public.has_starter(_user_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.subscriptions
    where user_id = _user_id
      and price_lookup_key like 'signe_coach_starter%'
      and (status in ('active','trialing') or (status = 'past_due' and current_period_end > now()))
  ) or exists (
    select 1 from public.access_grants
    where user_id = _user_id and tier = 'starter' and starts_at <= now() and expires_at > now()
  );
$$;
