-- Members could read exercises of unpublished (draft) journeys through the API.
-- Content of a journey is only open once the journey is published, except for admins.
create or replace function public.can_access_module(_user_id uuid, _module_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.modules m
    left join public.journeys j on j.id = m.journey_id
    where m.id = _module_id
      and (
        public.has_role(_user_id, 'admin')
        or (
          (j.id is null or j.is_published)
          and (
            m.is_free
            or public.has_membership(_user_id)
            or (coalesce(j.slug, 'relationships') = 'relationships' and public.has_paid_access(_user_id))
          )
        )
      )
  );
$$;
