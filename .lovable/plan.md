## Fix: 403 on `has_paid_access` RPC blocking `/app`

### Root cause
The `/app` access check calls `supabase.rpc("has_paid_access", ...)` and gets back `403 permission denied for function has_paid_access`. The function exists and is `SECURITY DEFINER`, but the `authenticated` role does not have `EXECUTE` on it, so PostgREST refuses the call.

### Fix
Run a one-line migration granting EXECUTE to the API roles:

```sql
GRANT EXECUTE ON FUNCTION public.has_paid_access(uuid) TO authenticated, anon;
```

### Files
- New migration: `supabase/migrations/<timestamp>_grant_has_paid_access.sql`

### Result
After the migration, the `/app` layout's access check returns `true`/`false` instead of erroring, and signed-in users with a purchase will land on the dashboard. Users without a purchase will see the "One step away" upsell card (correct behavior) instead of "Something went sideways".