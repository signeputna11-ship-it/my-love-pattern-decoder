-- Guided lessons: more step types besides prompt and checklist.
--   lesson    teaching card (title + body text)
--   scales    several statements rated 1 to 5 (options = statements)
--   fields    several labelled short answers (options = labels)
--   choice    pick one (options = choices)
alter table public.exercises drop constraint if exists exercises_kind_check;
alter table public.exercises
  add constraint exercises_kind_check
  check (kind in ('prompt', 'checklist', 'lesson', 'scales', 'fields', 'choice'));
