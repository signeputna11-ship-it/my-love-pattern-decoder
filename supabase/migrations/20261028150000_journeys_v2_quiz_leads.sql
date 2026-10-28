-- Journeys v2: Confidence, Self-Worth, Money, Business, Purpose first; Relationships and Sustainable Growth after.
update public.journeys set slug = 'money', title = 'Money', subtitle = 'Release money blocks and keep what you earn.' where slug = 'money-and-business';

insert into public.journeys (slug, position, title, subtitle, is_published) values
  ('self-worth', 2, 'Self-Worth', 'Feel enough as you are, then act from it.', false),
  ('business', 4, 'Business', 'Build an offer that sells with ease.', false)
on conflict (slug) do nothing;

update public.journeys set position = 1 where slug = 'confidence';
update public.journeys set position = 2 where slug = 'self-worth';
update public.journeys set position = 3 where slug = 'money';
update public.journeys set position = 4 where slug = 'business';
update public.journeys set position = 5 where slug = 'purpose';
update public.journeys set position = 6 where slug = 'relationships';
update public.journeys set position = 7 where slug = 'sustainable-growth';

-- The offer and visibility modules belong to Business.
update public.modules
set journey_id = (select id from public.journeys where slug = 'business')
where slug in ('money-offer', 'money-visibility');

-- Where she starts, chosen by the quiz.
alter table public.profiles add column if not exists starting_journey text;

-- Quiz leads: written and read only by server code (service role). No client policies on purpose.
create table if not exists public.quiz_leads (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  first_name text,
  answers jsonb not null default '[]'::jsonb,
  scores jsonb not null default '{}'::jsonb,
  primary_journey text not null,
  secondary_journey text,
  marketing_consent boolean not null default false,
  consent_text text,
  consent_at timestamptz,
  source text not null default 'quiz',
  user_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.quiz_leads enable row level security;
revoke all on public.quiz_leads from anon, authenticated;
create trigger trg_quiz_leads_updated before update on public.quiz_leads
  for each row execute function public.update_updated_at_column();
