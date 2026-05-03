## Problem

On `/app/*` routes, users intermittently see:

> Something went sideways
> Something blocked your reset from loading. Please try again.

Console shows repeated `[AppLayout.check] Error: timeout` thrown from the 6s race in `src/routes/app.tsx`. Network logs confirm `auth/v1/user` and `rpc/has_paid_access` actually return 200 — so requests succeed, but our `check()` is firing inside Supabase's auth lock and timing out.

## Root cause

In `src/routes/app.tsx`:

```ts
supabase.auth.onAuthStateChange(() => check());
```

`check()` calls `supabase.auth.getUser()` synchronously inside the auth state change callback. Supabase's gotrue client holds an internal lock during that callback; calling another auth method from inside it deadlocks until the 5s lock timeout fires (we see the warning: `Lock "lock:sb-...-auth-token" was not released within 5000ms`). Our 6s race then rejects with `timeout`, flipping state to `error`. This happens on every `TOKEN_REFRESHED` event (~hourly), and on tab refocus.

## Fix (single file: `src/routes/app.tsx`)

1. Defer the re-check out of the auth callback with `setTimeout(..., 0)` so the lock releases first.
2. Only re-run `check()` for meaningful events (`SIGNED_IN`, `SIGNED_OUT`, `USER_UPDATED`). Skip `TOKEN_REFRESHED` and `INITIAL_SESSION` — the session is already valid; no need to re-verify access on every silent refresh.
3. Use the `session` provided by the callback instead of re-calling `getUser()` when possible (use `session.user` directly for `SIGNED_IN`).
4. Increase the timeout race from 6s to 12s as a safety net for slow networks, and treat a `timeout` while a session is known-present as a soft retry rather than a hard error (single silent retry before showing the error card).

Nothing else changes — no styling, dashboard, Stripe, auth flow, RLS, or storage changes.

## Why this is safe

- Initial mount still calls `check()` once (unchanged).
- Sign-in / sign-out still trigger re-check.
- Token refreshes no longer cause a UI flip; the existing session remains valid and the next user action will revalidate naturally.
- The deferred callback pattern (`setTimeout 0`) is the documented Supabase workaround for "do not call supabase methods inside onAuthStateChange".

## Files touched

- `src/routes/app.tsx` (the `useEffect` subscription + `check()` timeout handling only)
