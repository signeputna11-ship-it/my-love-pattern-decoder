## Problem

A new user (Nicolas, signed up via Google a few minutes ago) was redirected to `/app` after OAuth, but instead of seeing the upsell screen (“One step away — Unlock The Reset for €49”), they got the **error screen** — “Something went sideways / We couldn’t verify your access.”

Confirmed in DB:
- The user’s account exists (`profiles` row created at signup).
- They have no `purchases` row, so `has_paid_access()` correctly returns `false`.
- The DB function itself works.

So the error screen is being shown not because access really failed, but because the `has_paid_access` RPC call from the browser **errored or timed out** right after the OAuth redirect — a known race window where the Supabase client is briefly between sessions / token refreshes.

## Where the bug is

`src/routes/app.tsx` — `AppLayout.check()`:

- The `try/catch` retries once on *thrown* errors (timeout, network).
- But when `supabase.rpc(...)` returns `{ error }` (e.g. transient auth error after redirect), the code **immediately** sets `state = "error"` with no retry. That’s the path that hit the new signup.
- A first-load failure of the access check shouldn’t block the upsell — even if the RPC truly fails, treating the user as “no-access” is safer than trapping them on an error screen with no path forward.

## Fix

Edit `src/routes/app.tsx` only. No DB changes, no auth changes.

1. **Retry the RPC once on `rpcRes.error`**, mirroring the existing soft-retry in the `catch` block. Use the same 250 ms delay + `retry: true` guard so we don’t loop.
2. **After the retry still fails, fall through to `no-access` instead of `error`** when the user is authenticated. Rationale: the access check is an upsell gate, not a security boundary — the real gate lives in RLS on the course content tables. Showing the “Unlock for €49” card is the correct, useful screen even if the RPC briefly misbehaves; if they actually paid, the next navigation revalidates.
3. Keep the existing `error` state as a fallback for the truly-broken case (e.g. session totally missing on retry), so the “Try again / Sign out” card still exists.
4. Keep `checkIsAdmin()` best-effort as today.

### Technical detail

In `check()`:

```ts
if (rpcRes.error) {
  console.error("[has_paid_access]", rpcRes.error);
  if (!opts.retry) {
    setTimeout(() => check({ silent: true, retry: true }), 250);
    return;
  }
  // After retry: don't trap the user. Default to the upsell screen.
  setState("no-access");
  return;
}
```

No other files change.

## Out of scope

- No changes to `auth.tsx`, OAuth flow, or Supabase config.
- No changes to RLS, `has_paid_access`, or purchases.
- No UI redesign of the error/upsell cards.

## Verification

- New Google signup with no purchase → lands on `/app` → sees “One step away / Unlock The Reset for €49” (not the error card), even if the first RPC call has a transient hiccup.
- Existing paid user (Signe) → still sees the full reset portal.
- True signed-out state → still routed to “Sign in to continue”.