# Shop QA + Nav Confirmation

## What I found on first pass

**Already good**
- Stripe go-live: all 5 readiness steps complete. Live checkout is ready.
- Webhook (`/api/public/payments/webhook`) is idempotent (upsert on `stripe_session_id`, stable `access_token` on retry), expands line items, resolves slug via `lookup_key` → `shop_products.stripe_price_id`, captures `first_name`/`last_name`/`phone` from metadata + Stripe customer_details fallback, handles refunds (`charge.refunded`, `refund.created/updated`), and enqueues both Step‑1 purchase confirmation and the nurture sequence enrollment in one path.
- All 8 products live in `shop_products` with correct prices (6 × $7 worksheets, $49 kit, $333 session) and stable `lookup_key`-style `stripe_price_id` values that resolve across sandbox/live.
- Shop, kit, worksheet, thank‑you all share the parchment + `VideoBg` look. Session product correctly branches to a `mailto:` CTA instead of Stripe.
- Nurture cron (`/api/public/hooks/email-sequence`) gates by `last_emailed_at + gap`, idempotency keyed `nurture-{sub.id}-{step}`, pauses at step 7.
- Unsubscribe page exists at `/unsubscribe` and calls the system `/email/unsubscribe` route.
- `SiteNav` **already renders Shop directly next to Home** on both desktop and mobile — so the nav requirement is already satisfied. I'll just verify it visually in the live preview.

## QA plan (no code yet, just verifications)

1. **Live smoke test of the full funnel** using `browser--act`:
   - `/shop` loads, all 8 cards visible, prices correct
   - `/shop/breadcrumbing-red-flags` → enter first/last/phone/email → "Continue to payment" enables only when valid → embedded Stripe loads
   - `/shop/love-pattern-reset-kit` → same
   - `/shop/deep-pattern-reset` → renders SessionProductView with mailto CTA, no Stripe
   - `/unsubscribe?token=foo` → shows "invalid" state cleanly
2. **Webhook + DB audit** via `psql`:
   - Confirm recent `purchases` rows have `first_name`, `last_name`, `phone`, `access_token`, `has_access=true`, `product_slug` populated
   - Confirm `email_subscribers` enrolls with `sequence_step=1` on purchase
   - Confirm `email_send_log` shows a `purchase-confirmation` row right after a test purchase (use `stack_modern--server-function-logs` if missing)
3. **Email registry sanity**: all 5 templates present (`welcome`, `purchase-confirmation`, `course-notification`, `password-reset-followup`, `nurture-sequence`) — confirmed.
4. **Cron job presence**: cron schema isn't readable via psql; instead I'll verify by checking `email_subscribers` row timestamps advance, and by reading recent `stack_modern--server-function-logs` for `/api/public/hooks/email-sequence` hits.

## Fixes I expect to need (will only apply if QA surfaces them)

- **Thank‑you polling** currently retries 4× × 1.5s = 6s. If the webhook lags on live Stripe, the page falls into the null state. If I see this on the smoke test, I'll bump to 8 retries × 2s and show a "Check your email — your link was just sent" fallback panel with email link.
- **First/last/phone validation** uses a permissive regex — fine; no change unless test fails.
- **Nurture cron** depends on a pg_cron job created in a prior migration; if logs show it isn't firing every 30 min, I'll add a `cron.schedule` migration (idempotent) that pings the route.
- **Shop nav highlight** uses `activeProps` — verify the active style actually applies on `/shop/...` deep routes (TanStack matches loosely by default; may need `activeOptions={{ exact: false }}` which is the default — should be fine, will confirm).

## Nav placement

`SiteNav.tsx` already orders nav as: **Home → Shop → About → Blog → Patterns**. So "next to Home" is already true. No change needed unless the visual QA shows otherwise.

## Out of scope

- Re-styling the shop (already on-brand)
- Adding new products
- Marketing emails (forbidden)

## Deliverable

A single short report after QA: ✅ items, any issues found, and any small fixes I shipped. If everything passes, the only "change" will be a confirmation that Shop is already in the nav next to Home.
