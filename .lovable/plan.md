# Fix: `/app` dashboard shows nothing

## What's happening
`src/routes/app.index.tsx` uses the same fragile pattern that broke `/app/module/$slug`:
- Calls `supabase.auth.getSession()` (no timeout, no error handling).
- Returns silently if there's no session, leaving `modules` as an empty array.
- The dashboard then renders an empty state instead of any content, which looks like "nothing loads."

If `getSession()` hangs or returns no session (stale local token), the dashboard renders blank — no header tiles, no module list.

## Fix
Update `src/routes/app.index.tsx` so its `load()`:
1. Uses `supabase.auth.getUser()` (validates the token, doesn't just read local storage).
2. Wraps everything in `try/catch` and logs each query's error to the console.
3. Cancels safely on unmount.
4. Even if the user query fails, still attempt to fetch `modules` (which is publicly readable to authenticated users) so the 5 module tiles always render.

Also: render a small "Loading your dashboard…" state until `modules` has loaded, and a fallback "We couldn't load your modules — try refreshing" message if the fetch fails. This way the user always sees something instead of a blank page.

## File touched
- `src/routes/app.index.tsx`

## Out of scope
DB, RLS, modules table — all confirmed correct in the previous fix.
