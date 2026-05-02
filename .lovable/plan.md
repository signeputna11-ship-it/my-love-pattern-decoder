## Goal

Replace the static "Your AI guide" placeholder card on the module page with a live, structured AI reflection powered by a Supabase Edge Function. The guide reads the user's saved answers + pattern + completed modules, and returns three short structured fields (noticing / one question / next step). It never opens a free-form chat.

## 1. Database migration — extend `ai_memory`

The current `ai_memory` table only stores `user_id, summary, recommended_next, updated_at`. Add columns to match the requested schema:

- `pattern_type text`
- `key_triggers text[]`
- `repeated_behaviors text[]`
- `boundaries_needed text[]`
- `next_steps text[]`
- `last_module_slug text` (so the UI can show "last reflected on X")
- `last_question text` (the focused question returned)
- `last_noticing text` (the 2–3 sentence summary)

Existing `summary` and `recommended_next` stay for backwards-compat. RLS policies already cover all columns (own-row select/insert/update). No new policies needed.

## 2. Edge Function — `supabase/functions/ai-pattern-guide`

Create `supabase/functions/ai-pattern-guide/index.ts` (CORS, JWT verified — function runs as the user via their bearer token, then uses service role for the DB read/write to avoid RLS round-trips on aggregates).

Input: `{ moduleSlug: string }`

Server work:
1. Verify JWT, get `user_id`.
2. Load: `profiles.pattern_type`, current `modules` row by slug, this module's `exercises` + the user's `user_answers` for them, list of completed module slugs from `user_progress`, and existing `ai_memory` row.
3. Build a strict structured prompt for Lovable AI Gateway (`google/gemini-3-flash-preview`) using **tool calling** to force JSON output with this schema:
   ```
   {
     noticing: string (2–3 sentences, descriptive, no diagnosis),
     question: string (one focused self-reflection question),
     next_step: { type: "module" | "resource", slug: string, label: string, reason: string },
     key_triggers: string[] (max 5),
     repeated_behaviors: string[] (max 5),
     boundaries_needed: string[] (max 5)
   }
   ```
4. **System prompt guardrails**: "You are a structured self-reflection guide, not a therapist. Do not diagnose. Do not make medical or mental-health claims. Do not give crisis advice — if user mentions self-harm or abuse, set `next_step.type='resource'` pointing to professional support and keep noticing brief and non-clinical. Use the user's own words. Stay grounded in the answers provided. Output only via the provided tool."
5. Upsert into `ai_memory`: merge new triggers/behaviors/boundaries with existing arrays (dedupe), set `pattern_type`, `last_module_slug`, `last_noticing`, `last_question`, `next_steps` (append `next_step.slug`), `summary`, `recommended_next`, `updated_at = now()`.
6. Return the structured object to the client.
7. Handle 429 / 402 from the gateway with friendly error messages.

`supabase/config.toml`: add a function block for `ai-pattern-guide` only if non-default settings are needed (default `verify_jwt=true` is what we want — skip the block).

## 3. Frontend — replace placeholder card

In `src/routes/app.module.$slug.tsx`, replace lines ~287–298 with a new `<PatternGuideCard moduleSlug={module.slug} />` component (new file `src/components/healthy-love/PatternGuideCard.tsx`).

Card behavior:
- Liquid-glass styling matching the existing `liquid-glass-strong rounded-3xl` look.
- Title: **Your Pattern Guide** with `Sparkles` icon.
- Initial state: subtle "Reflect on what you wrote" CTA + button **Generate reflection** (calls `supabase.functions.invoke('ai-pattern-guide', { body: { moduleSlug } })`). Loading state with spinner.
- After response, three sections rendered as labeled blocks:
  1. **What I'm noticing** — the `noticing` text.
  2. **One question to answer** — `question` shown in a quoted style + small textarea so the user can jot a private note (autosaved to `user_answers` under a synthetic exercise key, OR to local `ai_memory.last_reflection` — we'll store it as a new `last_reflection text` column added in the same migration to keep it simple).
  3. **Recommended next step** — `next_step.label` + 1-line `reason`.
- Two buttons at the bottom:
  - **Save AI Reflection** — persists the textarea note into `ai_memory.last_reflection` (small server fn or direct upsert via the user-scoped client).
  - **Open Recommended Tool** — `<Link>` to `/app/module/{slug}` if `type='module'`, or scrolls to `KitResources` and highlights the matching resource if `type='resource'`.
- On mount, if an existing `ai_memory` row exists for this `last_module_slug === moduleSlug`, prefill the card with the saved values so the user sees their last reflection without re-spending a model call.
- Toast errors for 429 ("Try again in a moment") and 402 ("AI credits exhausted — contact support").

The existing `<KitResources moduleKey={module.slug} />` stays directly below the card, unchanged.

## 4. Safety rails (codified in the system prompt + UI copy)

- Card subtitle: *"Structured self-reflection, not therapy or diagnosis."*
- Footer disclaimer in small text: *"This guide doesn't provide medical or mental health advice. If you're in crisis, contact a licensed professional."*
- The function rejects (returns a fixed safe response) any request that produces no answers yet — instead it returns a "Write at least one answer above first" message rather than calling the model.

## Technical summary

- **Migration**: ALTER TABLE `ai_memory` ADD the 8 new columns (all nullable).
- **Edge function**: `supabase/functions/ai-pattern-guide/index.ts` using Lovable AI Gateway with tool-calling for forced structured output, model `google/gemini-3-flash-preview`.
- **Client**: New `PatternGuideCard` component invoked via `supabase.functions.invoke`. Replaces lines 287–298 of `src/routes/app.module.$slug.tsx`.
- **No new secrets** required (`LOVABLE_API_KEY` already configured).
- **Bonus tools section** (`<KitResources />`) remains below the card, untouched.
