## Problem

Clicking **Open Recommended Tool** calls `supabase.storage.from("secure-response-relationship-kit").createSignedUrl(...)`. That bucket is private and protected by an RLS policy:

```
(bucket_id = 'secure-response-relationship-kit') AND has_paid_access(auth.uid())
```

The DB shows EXECUTE on `public.has_paid_access(uuid)` is currently only granted to `sandbox_exec` — **not** `authenticated`. So when a logged-in paid user requests a signed URL, Postgres throws `permission denied for function has_paid_access`, the storage call returns an error, and the UI shows "Couldn't open the recommended tool."

(The earlier grant migrations didn't stick on this signature — likely the function was redefined afterward, which resets privileges.)

## Fix

One small migration:

1. `GRANT EXECUTE ON FUNCTION public.has_paid_access(uuid) TO authenticated;`
2. Keep `REVOKE` from `anon, public` so it stays locked down.

## Verify

After the migration:
- Re-check `information_schema.routine_privileges` shows `authenticated` has EXECUTE.
- In the preview, click **Open Recommended Tool** — the PDF should open in a new tab.

No code changes needed — this is purely a database permission fix.
