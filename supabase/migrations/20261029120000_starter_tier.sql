-- Starter tier (4,99 EUR a month): her quiz starting journey plus modules flagged is_starter.
-- Full membership = any active subscription that is not a starter price.
alter table public.modules add column if not exists is_starter boolean not null default false;

create or replace function public.has_starter(_user_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.subscriptions
    where user_id = _user_id
      and price_lookup_key like 'signe_coach_starter%'
      and (status in ('active','trialing') or (status = 'past_due' and current_period_end > now()))
  );
$$;
revoke execute on function public.has_starter(uuid) from public, anon;
grant execute on function public.has_starter(uuid) to authenticated, service_role;

create or replace function public.has_membership(_user_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.subscriptions
    where user_id = _user_id
      and coalesce(price_lookup_key, '') not like 'signe_coach_starter%'
      and (status in ('active','trialing') or (status = 'past_due' and current_period_end > now()))
  );
$$;

create or replace function public.can_access_module(_user_id uuid, _module_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
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
        or (public.has_starter(_user_id) and (
              m.is_starter
              or j.slug = (select p.starting_journey from public.profiles p where p.user_id = _user_id)
           ))
      )
  );
$$;
