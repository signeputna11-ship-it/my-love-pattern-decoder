## Problem

When you submit the email/password signup form on `/auth`, it looks like nothing happens. In reality, signup **succeeds** — the auth logs confirm a `user_confirmation_requested` event with HTTP 200, and Supabase queues a confirmation email. The code calls `toast.success("Check your email to confirm your account.")`, but **`<Toaster />` is never mounted anywhere in the app**, so the toast renders to nothing. The form just sits there silently, so it feels broken.

A second contributing factor: even with a working toast, a small disappearing notification is easy to miss for a "check your email" instruction. Users expect a clear in-page state change.

## Fix

1. **Mount `<Toaster />` globally** in `src/routes/__root.tsx` so every `toast.*` call across the app is visible (this also fixes silent toasts on `/app`, `/checkout`, etc.).
   - Import the existing styled wrapper from `@/components/ui/sonner` and render it inside `RootComponent` next to `<Outlet />`.

2. **Add inline post-signup confirmation UI** in `src/routes/auth.tsx` so the result is unmistakable even if the toast is missed:
   - Add a `signupSuccess` state that flips true after a successful `supabase.auth.signUp` (when no error and `data.user` exists).
   - When `signupSuccess` is true, replace the form with a clear panel: heading "Check your email", body "We sent a confirmation link to **{email}**. Click it to activate your account, then return here to sign in.", plus a "Back to sign in" button that resets state to `mode: "signin"`.
   - Keep the existing toast as a secondary signal.

3. **Surface duplicate-account errors clearly.** If `supabase.auth.signUp` returns `data.user` with an empty `identities` array (Supabase's signal that the email is already registered), show a specific message: "An account with this email already exists. Try signing in instead." instead of a generic success.

## Out of scope

- No change to the email-confirmation requirement itself (auto-confirm stays off, per project rules).
- No change to Google OAuth flow.
- No change to the `/app` redirect or session handling.

## Verification

- Sign up with a new email → form is replaced by the "Check your email" panel, toast appears top-right.
- Sign up with an existing email → clear "account already exists" message, no false success.
- Sign in with wrong password → existing toast error is now actually visible.
- Confirm via the email link → returns to `/app` and proceeds normally (unchanged).
