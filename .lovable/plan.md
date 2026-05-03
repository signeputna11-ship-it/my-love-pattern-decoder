# Fix: `/app/module/see-the-pattern` stuck on spinner

## What's happening
The `/app` layout (`src/routes/app.tsx`) renders a spinner while `state === "loading"`. That state only resolves after two awaits in `useEffect`:
- `supabase.auth.getSession()`
- `supabase.rpc("has_paid_access", { _user_id })`

Neither call has a timeout, error handler, or fallback. If the auth client hangs (stale local token, slow network, or an unresolved promise after a hot reload), `state` never leaves `"loading"` and you see the spinner forever. The module page (`src/routes/app.module.$slug.tsx`) has the same pattern in its own loader and adds a second spinner gate, so a single hung query freezes the whole route.

## Fix

1. **`src/routes/app.tsx`** — make the gate resilient:
   - Wrap `getSession` and `has_paid_access` in `try/catch`.
   - Add a 6s timeout: if the auth/RPC race doesn't resolve, fall back to `"no-auth"` so the user sees the sign-in card instead of an infinite spinner.
   - On RPC error, log it and show a friendly retry CTA (treat as `"no-access"` with a "Try again" button that re-runs `check`).
   - Use `supabase.auth.getUser()` (revalidates token) instead of just `getSession()` so a stale local token doesn't pretend the user is signed in.

2. **`src/routes/app.module.$slug.tsx`** — same hardening for its initial load:
   - Wrap the module + exercises + answers + progress fetches in `try/catch`.
   - Show an error state with a "Back to dashboard" link if the module can't load (instead of a permanent spinner).
   - Move the "mark started" `upsert` so a failure there doesn't block the rest of render.

3. **Add `errorComponent` to both routes** so any thrown error shows a useful message + retry button instead of falling through to nothing.

4. **Defensive: clear stale auth state.** If `getUser()` returns an `AuthApiError` (refresh token revoked, common cause of hangs after schema/key changes), call `supabase.auth.signOut()` then route to `/auth`. This auto-recovers users who were authenticated before a Supabase key rotation.

## Files touched
- `src/routes/app.tsx`
- `src/routes/app.module.$slug.tsx`

## Out of scope
- No DB changes. RLS, modules, exercises, and the user's purchase row are all confirmed correct (5 modules, 5 exercises for `see-the-pattern`, `has_access=true` for the signed-in user).
- No styling changes to the rest of the app.

After this, if the page is still slow it will be due to a real network/API failure — and you'll see a clear error message instead of a frozen spinner.
