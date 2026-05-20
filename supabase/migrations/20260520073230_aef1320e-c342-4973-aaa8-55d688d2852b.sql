-- Extend purchases for token-gated access + product slug + upsell tracking
ALTER TABLE public.purchases
  ADD COLUMN IF NOT EXISTS access_token text UNIQUE,
  ADD COLUMN IF NOT EXISTS product_slug text,
  ADD COLUMN IF NOT EXISTS customer_email text,
  ADD COLUMN IF NOT EXISTS upsell_converted boolean NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_purchases_access_token ON public.purchases(access_token);
CREATE INDEX IF NOT EXISTS idx_purchases_product_slug ON public.purchases(product_slug);

-- Allow purchases to be created without a logged-in user (token-only flow).
-- We keep user_id NOT NULL historically; relax to nullable so guest checkouts work.
ALTER TABLE public.purchases ALTER COLUMN user_id DROP NOT NULL;

-- Allow public SELECT by access_token (token IS the credential)
DROP POLICY IF EXISTS purchases_select_by_token ON public.purchases;
CREATE POLICY purchases_select_by_token ON public.purchases
  FOR SELECT TO anon, authenticated
  USING (access_token IS NOT NULL);

-- ===== Kit stages (admin-seeded content) =====
CREATE TABLE IF NOT EXISTS public.kit_stages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  position integer NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  subtitle text,
  body text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.kit_stages ENABLE ROW LEVEL SECURITY;
CREATE POLICY kit_stages_public_read ON public.kit_stages FOR SELECT TO anon, authenticated USING (true);

-- ===== Worksheet responses (token-scoped, auto-save) =====
CREATE TABLE IF NOT EXISTS public.worksheet_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_id uuid NOT NULL REFERENCES public.purchases(id) ON DELETE CASCADE,
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (purchase_id)
);
ALTER TABLE public.worksheet_responses ENABLE ROW LEVEL SECURITY;
-- No anon policies — all reads/writes go through server fns with service role + token check.

-- ===== Kit stage progress (token-scoped) =====
CREATE TABLE IF NOT EXISTS public.kit_stage_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_id uuid NOT NULL REFERENCES public.purchases(id) ON DELETE CASCADE,
  stage_id uuid NOT NULL REFERENCES public.kit_stages(id) ON DELETE CASCADE,
  completed_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (purchase_id, stage_id)
);
ALTER TABLE public.kit_stage_progress ENABLE ROW LEVEL SECURITY;
-- No anon policies — server fns only.

-- Trigger to maintain updated_at
DROP TRIGGER IF EXISTS trg_worksheet_responses_updated ON public.worksheet_responses;
CREATE TRIGGER trg_worksheet_responses_updated
  BEFORE UPDATE ON public.worksheet_responses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trg_kit_stages_updated ON public.kit_stages;
CREATE TRIGGER trg_kit_stages_updated
  BEFORE UPDATE ON public.kit_stages
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed 5 placeholder kit stages
INSERT INTO public.kit_stages (position, slug, title, subtitle, body) VALUES
  (1, 'awareness', 'Stage 1: Awareness', 'Name the pattern out loud', 'Placeholder content for stage 1. Edit me later.'),
  (2, 'regulation', 'Stage 2: Regulation', 'Calm the nervous system first', 'Placeholder content for stage 2. Edit me later.'),
  (3, 'rewrite', 'Stage 3: Rewrite', 'Author a new internal story', 'Placeholder content for stage 3. Edit me later.'),
  (4, 'rehearse', 'Stage 4: Rehearse', 'Practice the new response', 'Placeholder content for stage 4. Edit me later.'),
  (5, 'integrate', 'Stage 5: Integrate', 'Make the change daily', 'Placeholder content for stage 5. Edit me later.')
ON CONFLICT (position) DO NOTHING;