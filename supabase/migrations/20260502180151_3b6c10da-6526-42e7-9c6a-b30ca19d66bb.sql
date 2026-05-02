-- ============ PROFILES ============
create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  email text,
  display_name text,
  pattern_type text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
create policy "profiles_select_own" on public.profiles for select using (auth.uid() = user_id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = user_id);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = user_id);

-- ============ PURCHASES ============
create table public.purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  stripe_session_id text unique,
  stripe_payment_intent_id text,
  stripe_customer_id text,
  price_id text,
  product_id text,
  amount_total integer,
  currency text,
  status text not null default 'pending',
  has_access boolean not null default false,
  refunded boolean not null default false,
  environment text not null default 'sandbox',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_purchases_user on public.purchases(user_id);
alter table public.purchases enable row level security;
create policy "purchases_select_own" on public.purchases for select using (auth.uid() = user_id);
-- writes happen via service role from webhook only

-- ============ MODULES ============
create table public.modules (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  position integer not null,
  title text not null,
  subtitle text,
  intro text,
  created_at timestamptz not null default now()
);
alter table public.modules enable row level security;
create policy "modules_read_authenticated" on public.modules for select to authenticated using (true);

-- ============ EXERCISES ============
create table public.exercises (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.modules(id) on delete cascade,
  position integer not null,
  kind text not null check (kind in ('prompt','checklist')),
  title text not null,
  body text,
  options jsonb,
  created_at timestamptz not null default now()
);
create index idx_exercises_module on public.exercises(module_id);
alter table public.exercises enable row level security;
create policy "exercises_read_authenticated" on public.exercises for select to authenticated using (true);

-- ============ USER ANSWERS ============
create table public.user_answers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  exercise_id uuid not null references public.exercises(id) on delete cascade,
  answer_text text,
  answer_data jsonb,
  updated_at timestamptz not null default now(),
  unique (user_id, exercise_id)
);
create index idx_user_answers_user on public.user_answers(user_id);
alter table public.user_answers enable row level security;
create policy "answers_select_own" on public.user_answers for select using (auth.uid() = user_id);
create policy "answers_insert_own" on public.user_answers for insert with check (auth.uid() = user_id);
create policy "answers_update_own" on public.user_answers for update using (auth.uid() = user_id);
create policy "answers_delete_own" on public.user_answers for delete using (auth.uid() = user_id);

-- ============ USER PROGRESS ============
create table public.user_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  module_id uuid not null references public.modules(id) on delete cascade,
  started_at timestamptz default now(),
  completed_at timestamptz,
  unique (user_id, module_id)
);
alter table public.user_progress enable row level security;
create policy "progress_select_own" on public.user_progress for select using (auth.uid() = user_id);
create policy "progress_insert_own" on public.user_progress for insert with check (auth.uid() = user_id);
create policy "progress_update_own" on public.user_progress for update using (auth.uid() = user_id);

-- ============ AI MEMORY ============
create table public.ai_memory (
  user_id uuid primary key references auth.users(id) on delete cascade,
  summary text,
  recommended_next text,
  updated_at timestamptz not null default now()
);
alter table public.ai_memory enable row level security;
create policy "ai_memory_select_own" on public.ai_memory for select using (auth.uid() = user_id);
create policy "ai_memory_insert_own" on public.ai_memory for insert with check (auth.uid() = user_id);
create policy "ai_memory_update_own" on public.ai_memory for update using (auth.uid() = user_id);

-- ============ HELPER FUNCTIONS ============
create or replace function public.has_paid_access(_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.purchases
    where user_id = _user_id
      and has_access = true
      and refunded = false
  );
$$;

create or replace function public.update_updated_at_column()
returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger trg_profiles_updated before update on public.profiles
  for each row execute function public.update_updated_at_column();
create trigger trg_purchases_updated before update on public.purchases
  for each row execute function public.update_updated_at_column();
create trigger trg_answers_updated before update on public.user_answers
  for each row execute function public.update_updated_at_column();
create trigger trg_ai_memory_updated before update on public.ai_memory
  for each row execute function public.update_updated_at_column();

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (user_id, email, display_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)))
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============ SEED MODULES ============
insert into public.modules (slug, position, title, subtitle, intro) values
('see-the-pattern', 1, 'See the Pattern', 'Name what keeps repeating',
 'Patterns hide in plain sight. Before you can change one, you have to be able to see it without flinching. This module walks you through the exact loop your nervous system has been running — gently, without judgment.'),
('calm-the-trigger', 2, 'Calm the Trigger', 'Stop the spiral before it starts',
 'When the trigger fires, your body moves faster than your thoughts. You will learn the 90-second reset that interrupts the loop in real time.'),
('rebuild-self-worth', 3, 'Rebuild Self-Worth', 'Worth that does not depend on them',
 'You will rebuild a sense of self that is not borrowed from anyone else. Quiet, internal, yours.'),
('set-the-boundary', 4, 'Set the Boundary', 'Words your nervous system can hold',
 'Boundaries fail when your body cannot back them up. You will write the exact lines you need — and rehearse holding them.'),
('decide-differently', 5, 'Decide Differently', 'The next choice changes everything',
 'You already know the pattern. Now you decide what happens at the next fork in the road.')
on conflict (slug) do nothing;

-- ============ SEED EXERCISES (Module 1) ============
insert into public.exercises (module_id, position, kind, title, body)
select m.id, 1, 'prompt',
  'When did you first notice this pattern?',
  'Think back to the earliest version. Not the most painful one — the first one. Where were you? What did it feel like in your body?'
from public.modules m where m.slug = 'see-the-pattern';

insert into public.exercises (module_id, position, kind, title, body)
select m.id, 2, 'prompt',
  'What is the moment the pattern always begins?',
  'A text that goes unanswered. A tone shift. A look. Name the exact trigger — be specific.'
from public.modules m where m.slug = 'see-the-pattern';

insert into public.exercises (module_id, position, kind, title, body)
select m.id, 3, 'prompt',
  'What does your body do next?',
  'Tight chest. Stomach drop. Mind racing. Describe the physical signature of the spiral.'
from public.modules m where m.slug = 'see-the-pattern';

insert into public.exercises (module_id, position, kind, title, body)
select m.id, 4, 'prompt',
  'What story does your mind tell you in that moment?',
  'The exact words. "They are pulling away." "I did something wrong." Write them as you hear them.'
from public.modules m where m.slug = 'see-the-pattern';

insert into public.exercises (module_id, position, kind, title, body, options)
select m.id, 5, 'checklist',
  'I am willing to:',
  null,
  '["Notice the pattern without judging myself","Name the exact trigger out loud","Sit with the body sensation for 60 seconds before reacting","Write down the story instead of acting on it"]'::jsonb
from public.modules m where m.slug = 'see-the-pattern';