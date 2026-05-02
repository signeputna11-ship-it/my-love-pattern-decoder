-- Create private storage bucket for the kit
insert into storage.buckets (id, name, public)
values ('secure-response-relationship-kit', 'secure-response-relationship-kit', false)
on conflict (id) do nothing;

-- kit_resources table
create table if not exists public.kit_resources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  module text not null,
  description text,
  file_path text not null,
  file_type text,
  order_index integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists kit_resources_module_order_idx
  on public.kit_resources (module, order_index);

alter table public.kit_resources enable row level security;

-- Only users with paid access can read kit resources metadata
drop policy if exists kit_resources_select_paid on public.kit_resources;
create policy kit_resources_select_paid
on public.kit_resources
for select
to authenticated
using (public.has_paid_access(auth.uid()));

-- Storage object policies: only paid users can read objects from the bucket
drop policy if exists "kit_objects_select_paid" on storage.objects;
create policy "kit_objects_select_paid"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'secure-response-relationship-kit'
  and public.has_paid_access(auth.uid())
);

-- updated_at trigger
drop trigger if exists update_kit_resources_updated_at on public.kit_resources;
create trigger update_kit_resources_updated_at
before update on public.kit_resources
for each row execute function public.update_updated_at_column();