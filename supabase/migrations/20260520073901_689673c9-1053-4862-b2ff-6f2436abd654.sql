CREATE TABLE IF NOT EXISTS public.shop_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  kind text NOT NULL CHECK (kind IN ('worksheet','kit')),
  name text NOT NULL,
  short_description text,
  price_cents integer NOT NULL,
  currency text NOT NULL DEFAULT 'usd',
  stripe_price_id text NOT NULL,
  position integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.shop_products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS shop_products_public_read ON public.shop_products;
CREATE POLICY shop_products_public_read ON public.shop_products
  FOR SELECT TO anon, authenticated USING (active = true);

DROP POLICY IF EXISTS shop_products_admin_write ON public.shop_products;
CREATE POLICY shop_products_admin_write ON public.shop_products
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

DROP TRIGGER IF EXISTS trg_shop_products_updated ON public.shop_products;
CREATE TRIGGER trg_shop_products_updated
  BEFORE UPDATE ON public.shop_products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.shop_products (slug, kind, name, short_description, price_cents, stripe_price_id, position) VALUES
  ('breadcrumbing-red-flags', 'worksheet', 'Breadcrumbing Red Flags Cheat Sheet', 'Spot breadcrumbing patterns in real time.', 700, 'breadcrumbing_red_flags_usd', 1),
  ('availability-vs-chemistry', 'worksheet', 'Availability vs Chemistry Worksheet', 'Tell real chemistry from intermittent reinforcement.', 700, 'availability_vs_chemistry_usd', 2),
  ('insecurity-soothing-sop', 'worksheet', 'Insecurity Soothing SOP', 'A standard operating procedure for self-soothing in dating.', 700, 'insecurity_soothing_sop_usd', 3),
  ('higher-standards-fear', 'worksheet', 'Higher Standards Fear Worksheet', 'Unpack the fear under raising your standards.', 700, 'higher_standards_fear_usd', 4),
  ('worth-tied-to-attention', 'worksheet', 'Worth Tied to Attention Reset', 'Decouple your self-worth from someone else''s attention.', 700, 'worth_tied_to_attention_usd', 5),
  ('saying-no-script', 'worksheet', 'Saying No Script', 'Word-for-word scripts for saying no without guilt.', 700, 'saying_no_script_usd', 6),
  ('love-pattern-reset-kit', 'kit', 'My Love Pattern Reset Kit', 'The complete five-stage reset — all worksheets included.', 4900, 'love_pattern_reset_kit_usd', 99)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  short_description = EXCLUDED.short_description,
  price_cents = EXCLUDED.price_cents,
  stripe_price_id = EXCLUDED.stripe_price_id,
  position = EXCLUDED.position;