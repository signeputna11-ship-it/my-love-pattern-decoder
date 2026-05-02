# Fix the "Get My Reset (€49)" button

## Problem
On the landing page pricing card (`src/components/healthy-love/sections.tsx`, line 426), the **Get My Reset (€49)** button is a bare `<button>` with no `onClick` and no link wrapper. Clicking it does nothing.

The checkout route (`/checkout`) and Stripe embedded flow already exist and work — the button just isn't connected.

## Fix

In `src/components/healthy-love/sections.tsx`:

1. Import `Link` from `@tanstack/react-router` and `supabase` from `@/integrations/supabase/client` (if not already in this file).
2. Replace the plain `<button>` on line 426 with a smart handler:
   - If the user has an active Supabase session → navigate to `/checkout`.
   - If not signed in → navigate to `/auth` with a redirect param so they land on `/checkout` after sign-in.
3. Keep the existing styling and `ArrowUpRight` icon exactly as-is.

Implementation approach: convert the button to a small client component that calls `supabase.auth.getSession()` on click and uses `useNavigate()` to route accordingly. This avoids hard-coding the auth check at render time and keeps SSR clean.

## Optional follow-up (only if you confirm)
The CTA at the top of the same section (and any other "Unlock" buttons) should be checked too — let me know if you want me to audit and wire all of them in the same pass.

## Files changed
- `src/components/healthy-love/sections.tsx` (single button + small handler + 2 imports)

No database, edge function, or schema changes needed.
