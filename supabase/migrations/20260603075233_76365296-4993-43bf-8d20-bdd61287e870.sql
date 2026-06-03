
-- 1) purchases: remove client SELECT policy; server uses service_role (bypasses RLS)
DROP POLICY IF EXISTS purchases_select_own ON public.purchases;
REVOKE SELECT, INSERT, UPDATE, DELETE ON public.purchases FROM anon, authenticated;

-- 2) email_subscribers: remove admin client policy; server uses service_role
DROP POLICY IF EXISTS email_subscribers_admin_all ON public.email_subscribers;
REVOKE SELECT, INSERT, UPDATE, DELETE ON public.email_subscribers FROM anon, authenticated;

-- 3) shop_products: hide stripe_price_id from anon/authenticated via column-level revoke
REVOKE SELECT ON public.shop_products FROM anon, authenticated;
GRANT SELECT (id, slug, kind, name, short_description, price_cents, currency, position, active, created_at, updated_at)
  ON public.shop_products TO anon, authenticated;
