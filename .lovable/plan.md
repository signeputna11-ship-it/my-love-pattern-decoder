# Wire the "Start Module" buttons to checkout

## Problem
On the landing page in the `ExperiencePortal` section (`src/components/healthy-love/sections.tsx`, line 508), each module card has a **Start Module** button rendered as a plain `<button>` with no `onClick`. Clicking does nothing.

## Fix
In `ExperiencePortal`, add a `handleStartModule` handler and wire it to all 5 module buttons:

1. If the user is **not signed in** → navigate to `/auth`.
2. If the user **is signed in but has not paid** → navigate to `/checkout`.
3. If the user **is signed in and has paid access** (via the existing `has_paid_access` RPC) → navigate to `/app` to enter the portal.

The `useNavigate` hook and `supabase` client are already imported at the top of this file (added in the previous fix).

## Files changed
- `src/components/healthy-love/sections.tsx` — add `handleStartModule` inside `ExperiencePortal` and attach `onClick={handleStartModule}` to the `Start Module` button.

No database, schema, or edge function changes.
