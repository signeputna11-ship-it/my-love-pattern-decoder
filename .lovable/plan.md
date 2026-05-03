## Fix module resource display in `KitResources.tsx`

### Problem
The component queries `kit_resources.module` using the route slug (e.g. `see-the-pattern`), but the DB stores short keys (`pattern`, `trigger`, `self-worth`, `boundary`, `decisions`). Result: query returns 0 rows and the section silently hides.

### Change (single file: `src/components/healthy-love/KitResources.tsx`)

1. **Slug → module key mapping**
   ```ts
   const SLUG_TO_MODULE_KEY: Record<string, string> = {
     "see-the-pattern": "pattern",
     "calm-the-trigger": "trigger",
     "rebuild-self-worth": "self-worth",
     "set-the-boundary": "boundary",
     "decide-differently": "decisions",
   };
   ```
   Use `SLUG_TO_MODULE_KEY[moduleKey] ?? moduleKey` in the `.eq("module", ...)` query.

2. **Card layout per resource** (liquid-glass, preserves existing styling):
   - Title
   - Description
   - `file_type` tag (small uppercase pill)
   - "Open Tool" button → calls `supabase.storage.from("secure-response-relationship-kit").createSignedUrl(file_path, 600)` and opens in new tab with `noopener,noreferrer`.

3. **States**
   - Loading: liquid-glass card showing spinner + `"Loading tools…"`.
   - Empty (after load, 0 rows): liquid-glass card showing `"No bonus tools found for this module yet."` (replaces current `return null`).
   - Signed URL failure: `toast.error("Couldn't open this tool. Please try again.")`.

### Out of scope
No changes to dashboard, landing, Stripe, auth, RLS, bucket, or `app.module.$slug.tsx`.

### Result
On `/app/module/see-the-pattern` etc., the "Module resources" section lists matching `kit_resources` rows with an Open Tool button that opens a fresh signed URL in a new tab.
