## Diagnosis

Your purchase is fully recorded — two paid sessions in the database with `has_access: true`. So access works. The issue is purely navigation: you didn't land on `/app` after checkout, and the "Lifetime access. 5 modules…" copy you're seeing is the marketing pitch on the checkout/landing page, not a button.

The auto-redirect from `/checkout/return` → `/app` exists but may not have triggered if you closed the tab or the polling timed out before the webhook synced.

## Fix

Two small, safe changes:

### 1. Make `/app` the entry point — always
Right now if anyone is signed in with paid access and lands anywhere ambiguous, there's no global "go to your modules" shortcut. Add a clear path from the landing page header: when a signed-in user with access visits `/`, show a prominent **"Enter your portal"** button in the nav (replacing or alongside the sign-in CTA).

### 2. Harden the checkout return page
In `src/routes/checkout.return.tsx`:
- Increase the polling window from 12 attempts (~18s) to 20 attempts (~30s) so slower webhook syncs don't fall through to the "pending" state.
- If the user lands on `/checkout/return` WITHOUT a `session_id` but already has access, send them straight to `/app` — covers the case where they navigated back manually.
- Keep the existing 1.8s success → `/app` auto-redirect.

## Right now (no code needed)

You can access your modules immediately by going to **`/app`** in the URL bar, or I can ship the fix above and add an "Enter portal" button to the landing page so this never happens again.

## Files touched
- `src/routes/checkout.return.tsx` — longer polling, fallback redirect
- `src/routes/index.tsx` (or wherever the landing nav lives) — conditional "Enter portal" CTA for signed-in paid users

No DB changes. No breaking changes to checkout or webhook.
