
ALTER TABLE public.shop_products DROP CONSTRAINT IF EXISTS shop_products_kind_check;
ALTER TABLE public.shop_products ADD CONSTRAINT shop_products_kind_check CHECK (kind IN ('worksheet','kit','session'));
ALTER TABLE public.shop_products ALTER COLUMN stripe_price_id DROP NOT NULL;

INSERT INTO public.shop_products (slug, kind, name, short_description, price_cents, currency, stripe_price_id, position, active)
VALUES (
  'deep-pattern-reset',
  'session',
  'The Deep Pattern Reset',
  'A private 90-minute 1:1 session with Signe. Work directly on the belief driving your pattern at the level where it lives. Includes a personalised 21-day reset audio meditation.',
  33300,
  'usd',
  'deep_pattern_reset_session',
  100,
  true
)
ON CONFLICT (slug) DO UPDATE SET
  kind = EXCLUDED.kind,
  name = EXCLUDED.name,
  short_description = EXCLUDED.short_description,
  price_cents = EXCLUDED.price_cents,
  position = EXCLUDED.position,
  active = EXCLUDED.active,
  updated_at = now();
