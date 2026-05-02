## Goal
Remove every em-dash (—) from the codebase and rephrase the surrounding copy so it still reads naturally. Also normalize en-dashes (–) used in numeric ranges to the word "to" for consistency.

## Scope (files touched)

**User-facing copy (React)**
- `src/routes/index.tsx` — title + hero subline
- `src/routes/auth.tsx` — page title
- `src/routes/checkout.tsx` — page title
- `src/routes/checkout.return.tsx` — success body line
- `src/routes/app.tsx` — page title + CTA price line
- `src/routes/app.module.$slug.tsx` — empty-answer placeholder + completion button label
- `src/components/healthy-love/data.ts` — two pattern descriptions
- `src/components/healthy-love/sections.tsx` — diagnosis copy, nervous-system line, "ready to stop living it" line, "2–3 sittings" line
- `src/components/healthy-love/KitResources.tsx` — JSDoc + inline comment
- `src/components/healthy-love/PatternGuideCard.tsx` — two toast messages + save-button label

**Edge function**
- `supabase/functions/ai-pattern-guide/index.ts` — system prompt rules and one error message returned to the client

**Build config**
- `vite.config.ts` — single comment

**Database (already-seeded copy)**
The original seed migration (`20260502180151_*.sql`) ran once; editing it does not change live rows. Add a new migration that UPDATEs the affected rows so users see clean copy:
- `modules.intro` for slugs `see-the-pattern` and `set-the-boundary`
- `exercises.body` for the two Module 1 prompts that contain em-dashes

## Rewrite approach

Each em-dash is replaced with the punctuation that best fits the sentence rhythm — usually a period, comma, or colon — never another dash. Examples:

- "running — gently, without judgment." → "running. Gently, without judgment."
- "You give more, faster — hoping it creates security." → "You give more, faster, hoping it creates security."
- "Saved — update" → "Saved. Update"
- "Unlock The Reset — €49" → "Unlock The Reset for €49"
- "Sign in — My Love Pattern" → "Sign in · My Love Pattern" (middle dot for title separators)
- "AI credits exhausted — please contact support." → "AI credits exhausted. Please contact support."
- "Most people complete this in 2–3 sittings." → "Most people complete this in 2 to 3 sittings."
- "noticing = 2 to 3 sentences" (already fine); "1–2 short sentences" → "1 to 2 short sentences"; "2–6 words" → "2 to 6 words"

Page-title separators (where `—` joined a page name and the brand) become `·` (middle dot), which is a common convention and avoids re-introducing a dash.

Comments and JSDoc lines get the same treatment so the rule applies project-wide.

## Verification

After edits, re-run `rg -nP '[\x{2013}\x{2014}]'` across the project (excluding `node_modules`, generated files, and the original seed migration which stays as a historical record but is overridden by the new UPDATE migration). Expect zero matches in source and zero em-dashes in any user-visible string. The new migration's UPDATE statements ensure the live database reflects the cleaned copy.

## Out of scope
- The historical seed migration file itself is left untouched (migrations are append-only); the new migration supersedes its content for the affected rows.
- Generated files (`routeTree.gen.ts`, `supabase/types.ts`) and `node_modules` are not scanned or modified.
