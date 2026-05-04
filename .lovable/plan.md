## Switch checkout to USD only

Currently the app sells The Reset at €49 via the `reset_lifetime_eur` Stripe price. You want to switch everything to USD only — single currency, no toggle.

### Steps

1. **Create a USD price in Stripe**
   - Product: existing Reset product
   - New price ID: `reset_lifetime_usd`, amount `4900` cents, currency `usd`, one-time, qty 1/1
   - Use `payments--create_price` (auto-syncs to live on publish)

2. **Update checkout to use the USD price**
   - `src/routes/checkout.tsx`: change `priceId: "reset_lifetime_eur"` → `"reset_lifetime_usd"`
   - Update copy: "Lifetime access. 5 modules. Workbook, AI guide, downloadable answers. **$49**."

3. **Update all €49 references to $49 across the landing page**
   - `src/components/healthy-love/StickyMobileCTA.tsx`: label `Unlock My Pattern · $49`
   - `src/components/healthy-love/sections.tsx`: any `€49` strings → `$49`
   - `src/components/healthy-love/data.ts`: same
   - `src/routes/index.tsx`: any `€49` → `$49`
   - Any meta description mentioning €49 (checkout head, etc.)

4. **Leave existing EUR purchases alone**
   - The old `reset_lifetime_eur` price stays in Stripe (any past purchase records remain valid; `has_paid_access` checks the `purchases` table regardless of currency)
   - No DB migration needed
   - Webhook already records whatever currency Stripe returns — no change

### Out of scope
- No currency toggle, no auto-detect, no second price
- No changes to auth, RLS, or `has_paid_access`
- No refunds/migration of past EUR buyers

### Verification
- `/checkout` opens Stripe embedded form showing **$49 USD**
- Landing page, sticky CTA, and final CTA all show **$49**
- Test card `4242 4242 4242 4242` completes → return page → `/app` unlocks
