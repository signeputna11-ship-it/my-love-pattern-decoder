ALTER TABLE public.ai_memory
  ADD COLUMN IF NOT EXISTS pattern_type text,
  ADD COLUMN IF NOT EXISTS key_triggers text[] DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS repeated_behaviors text[] DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS boundaries_needed text[] DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS next_steps text[] DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS last_module_slug text,
  ADD COLUMN IF NOT EXISTS last_question text,
  ADD COLUMN IF NOT EXISTS last_noticing text,
  ADD COLUMN IF NOT EXISTS last_reflection text;