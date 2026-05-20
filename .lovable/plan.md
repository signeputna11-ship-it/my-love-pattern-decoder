## Decisions locked in
- **Payments**: existing gateway-proxied Stripe client (`createStripeClient`) — no new `stripe` SDK init, no `STRIPE_SECRET_KEY`.
- **DB**: extend `purchases` (add `access_token`, `upsell_converted`, `email`, `product_slug`) instead of creating an `orders` table.
- **Token access**: `/app/worksheet/:token` and `/app/kit/:token` are intentionally token-gated (no Supabase login required) — token is the access credential.
- **Emails**: Lovable Emails queue (`enqueue_email`) — no Resend.
- **Kit content**: new 5-stage kit lives **alongside** existing Reset modules. New tables (`kit_stages`, `kit_stage_progress`) rather than overwriting `modules`/`user_progress`.

## Scope to build
1. **Schema migration**: add `access_token`, `email`, `product_slug`, `upsell_converted` to `purchases`; create `kit_stages` (admin-seeded content), `kit_stage_progress` (token-scoped progress), `worksheet_responses` (token-scoped auto-save).
2. **Stripe checkout server fn**: `createCheckoutSession` for two products (`worksheet`, `kit_upsell`), using gateway client.
3. **Stripe webhook** at `/api/public/stripe-webhook`: on `checkout.session.completed` insert `purchases` row with generated `access_token`, enqueue welcome email + nurture sequence.
4. **Public routes**:
   - `/shop/worksheet` — sales page with blurred preview + checkout button
   - `/thank-you?token=...` — access link + upsell card
   - `/app/worksheet/:token` — token-gated fillable worksheet with auto-save (no auth)
   - `/app/kit/:token` — token-gated 5-stage dashboard
5. **Server fns** (token-validated, no `requireSupabaseAuth`): `getWorksheetByToken`, `saveWorksheetResponse`, `getKitByToken`, `markStageComplete`.
6. **Admin** (auth-gated under `_authenticated`, admin role): orders list + subscribers list — extend existing admin if present.
7. **Email sequence**: 7 templates enqueued on purchase with scheduled `send_at` offsets (D0, D1, D3, D5, D7, D14, D21). Requires `delayed_send_at` column on queue — if not supported, fall back to a cron processor.

## Open blockers before I write code
- **Spec truncation**: the original prompt was cut at ~40k chars. I'm missing: exact product prices, exact worksheet questions, exact 5 kit stage names/content, exact 7 email copy, upsell pricing, and "preview questions blurred" design details. I cannot invent these without producing the wrong thing.
- **Stripe products**: not yet created via `payments--create_product`. I need prices in cents + currency for `worksheet` and `kit_upsell`.

## Ask
Paste (or confirm I should invent placeholders for):
1. Worksheet price + upsell price (e.g. `$27` / `$67`), currency
2. Names of the 5 kit stages
3. Worksheet question list (or "use placeholders, you'll edit later")
4. Email subject lines + body copy (or "use placeholders")

If you say **"use placeholders for everything, just ship the plumbing"**, I'll build the full stack with sensible placeholder content you can edit in the admin.