## Goal

Refine the already-deployed `ai-pattern-guide` edge function and `PatternGuideCard` to match the new spec exactly:
- Response shape: `{ noticing, question, next_step: string, recommended_resource_id }`
- Model receives `kit_resources` for the current module and may recommend one by ID
- Empty-state shows the exact copy: *"Complete at least one answer first so your guide has something real to read."*
- "Open Recommended Tool" deep-links to the recommended `kit_resources` row
- All AI memory writes already happen — keep them and route arrays through the new shape

No DB migration is needed (every column the spec lists already exists on `ai_memory` from the prior turn).

## 1. Edge function — `supabase/functions/ai-pattern-guide/index.ts`

Edit in place:

**1a. Load kit_resources for the module** — add a third parallel query that fetches `kit_resources` rows where `module = moduleSlug` (id, title, description, file_type, file_path, order_index). Pass them into the user context as `available_kit_resources`.

**1b. Empty-state response** — when `moduleAnswers.length === 0`, return only:
```json
{ "empty": true, "message": "Complete at least one answer first so your guide has something real to read." }
```
(Drop the placeholder noticing/question/next_step that the prior version returned.)

**1c. Tool schema** — replace the structured `next_step` object with the flat shape from the spec:
```
noticing: string                  // 2-3 sentences, supportive direct, grounded, no diagnosis
question: string                  // ONE focused follow-up question
next_step: string                 // ONE practical next step
recommended_resource_id: string|null   // restricted via enum to the IDs in available_kit_resources, or null
key_triggers / repeated_behaviors / boundaries_needed: string[] (max 5)
```
Constraining `recommended_resource_id` via `enum` (the actual UUID list + `null`) prevents hallucinated IDs.

**1d. System prompt** — keep existing guardrails (no therapy claims, no diagnosis, no open-ended chat, one clear question, supportive direct grounded tone, recommend only one resource). Add: "Recommend a kit resource only when one is genuinely a fit — otherwise return `recommended_resource_id: null`."

**1e. ai_memory upsert** — same fields as today, but `recommended_next` now stores the `recommended_resource_id` (or `next_step` text fallback if null), and `next_steps` array appends the new `next_step` string. Everything else (`pattern_type`, `key_triggers`, `repeated_behaviors`, `boundaries_needed`, `last_module_slug`, `last_noticing`, `last_question`, `updated_at`) keeps working.

Auth & RLS: function continues to verify the JWT (so only the logged-in user is touched) and uses the service-role client to read aggregates and upsert memory. Paid-access gating already exists at the route level (`/app/*` is paid-only) and on `kit_resources` via RLS.

## 2. Frontend — `src/components/healthy-love/PatternGuideCard.tsx`

Rewrite for the new contract:

- **Type**: `Reflection = { noticing; question; next_step: string; recommended_resource_id: string | null; ... }`
- **Empty state**: when the function returns `{ empty: true, message }`, render that message inside the card with a disabled "Generate Guidance" hint — no fake reflection.
- **Buttons** (per spec): primary **Generate Guidance** (initial + regenerate state), **Save AI Reflection** (persists the textarea note into `ai_memory.last_reflection`), **Open Recommended Tool**.
- **Open Recommended Tool**:
  - If `recommended_resource_id` is set → fetch a 10-min signed URL for that `kit_resources.file_path` (same pattern already used by `KitResources.tsx`) and `window.open(url)`.
  - If `null` → scroll to `#kit-resources` so the user picks from the bonus tools section.
- **Sections** (titles unchanged): "What I'm noticing", "One question to answer" (with the same private textarea), "Recommended next step" (renders `next_step` string + a small chip "Open recommended tool" if a resource was picked).
- **Initial render**: still hydrates from `ai_memory.last_*` on mount so the user sees their previous reflection without re-spending a model call.
- Toast handling for 429/402 stays.

## 3. Module page — `src/routes/app.module.$slug.tsx`

No changes — `<PatternGuideCard moduleSlug={module.slug} />` is already mounted above `<KitResources>` (which has `id="kit-resources"` for the scroll target). Just verify both still render.

## 4. Deploy

Redeploy `ai-pattern-guide` after the edits.

## Technical summary

- Files touched:
  - `supabase/functions/ai-pattern-guide/index.ts` — load kit_resources, switch tool schema to flat `next_step` + `recommended_resource_id` enum, tighten empty-state response, adjust ai_memory upsert mapping.
  - `src/components/healthy-love/PatternGuideCard.tsx` — new types, empty-state copy, Generate Guidance / Save AI Reflection / Open Recommended Tool buttons, signed-URL handling for recommended resource.
- No DB migration.
- No new secrets.
- Auth: edge fn verifies JWT, RLS on `ai_memory` / `user_answers` / `kit_resources` already restricts access to the logged-in paying user.
