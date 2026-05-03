## Goal

Every "bonus tool" in the app becomes an **interactive in-app experience** that opens inside the module dashboard. No more signed-URL PDFs, .docx, .csv, .txt, or .ics files opening in a new tab. The only download permitted is "Download my answers" (a PDF of what *the user* typed), and only when the user has actually entered responses.

## Audit (20 resources across 5 modules)

Mapped to 5 reusable in-app tool kinds:

| Kind | Used for | Inputs |
|---|---|---|
| `worksheet` | Workbooks, worksheets, "from X to Y", reflection guides | Ordered prompts → textareas + optional checklists |
| `tracker` | Pattern/trigger trackers (repeated entries over time) | Add-row form + saved entries list |
| `cheatsheet` | One-page guides, "spot it / name it" sheets | Readable cards + 1-2 reflection prompts |
| `scripts` | Boundary scripts, swipe files, ready-to-send messages | Browseable scenario cards with "Copy" + "My version" textarea |
| `planner` | The 14-day Waiting Room Planner (replaces .ics) | In-app 14-day grid: per-day intention, action checkboxes, note. No calendar export. |

Every kind shares: same module liquid-glass UI, autosave (debounced), "Save progress" button, "Download my answers" button (visible only when the user has at least one non-empty entry), mobile-first responsive layout, RLS-protected behind login + paid access.

## Data model

New tables (migrations, RLS on, owner-only policies):

- `tools` — `id, module, slug, title, description, kind, schema jsonb, order_index`. Schema holds the prompts/scenarios/days definition for that kind. Readable by `authenticated` + `has_paid_access(auth.uid())`.
- `user_tool_responses` — `id, user_id, tool_id, data jsonb, updated_at`. RLS owner-only (select/insert/update/delete). One row per user per tool; `data` shape depends on tool kind.

Seed `tools` from the 20 existing `kit_resources` (titles + descriptions reused; PDFs/docx/csv/txt/ics replaced with hand-authored prompt sets that match each resource's intent).

`kit_resources` stays in the DB for now but is no longer rendered anywhere.

## UI

Replace `KitResources.tsx` (the "Your in-app tools" section) with `InAppTools.tsx`:

- Lists `tools` for the current module as liquid-glass cards: title, description, "Guided tool" tag, **Start Tool** button. No file_type chip. No "Opens securely" caption.
- Click → opens `<ToolRunner>` **inline on the same page** (expands a panel below the card list, no Dialog, no new tab). Smooth scroll to it.
- `ToolRunner` switches on `tool.kind` and renders one of:
  - `WorksheetRunner` — list of prompts using the same textarea styling as exercises in `app.module.$slug.tsx`.
  - `TrackerRunner` — "Add entry" form + chronological list of past entries, each editable/deletable.
  - `CheatsheetRunner` — content cards (from schema) + reflection textareas.
  - `ScriptsRunner` — accordion of scenarios; each has the script text, a Copy button, and a "Make it mine" textarea.
  - `PlannerRunner` — 14 day cards with intention textarea + checkbox list + note. No calendar export anywhere.
- Autosave on change (800ms debounce → upsert into `user_tool_responses`). "Save progress" button forces a flush. Toast on save.
- "Download my answers" button rendered only when the row exists and contains at least one non-empty value. Generates a PDF client-side via `jsPDF` (already used in module page) titled `<tool-slug>-my-answers.pdf` containing only the user's text.
- Sticky bottom liquid-glass action bar from the module page is reused while a tool is open (Save progress / Download my answers reflect the active tool's state).

## Module page changes (`src/routes/app.module.$slug.tsx`)

- Keep exercises, PatternGuideCard, sticky action bar.
- Replace `<KitResources>` with `<InAppTools moduleKey={slug} />`.
- Remove `jsPDF`-based "Download my answers" for module exercises? No — keep it (it exports the user's exercise answers, which is the allowed "export user answers" case). Same applies to per-tool answers.

## Files

Create:
- `src/components/healthy-love/InAppTools.tsx` (list + opener)
- `src/components/healthy-love/tools/ToolRunner.tsx` (kind dispatcher, autosave, download-answers logic)
- `src/components/healthy-love/tools/WorksheetRunner.tsx`
- `src/components/healthy-love/tools/TrackerRunner.tsx`
- `src/components/healthy-love/tools/CheatsheetRunner.tsx`
- `src/components/healthy-love/tools/ScriptsRunner.tsx`
- `src/components/healthy-love/tools/PlannerRunner.tsx`
- `src/components/healthy-love/tools/types.ts` (TS types for each schema shape)

Edit:
- `src/routes/app.module.$slug.tsx` — swap KitResources → InAppTools.

Delete:
- `src/components/healthy-love/KitResources.tsx`

DB migrations:
- create `tools` table + RLS (`select` allowed for authenticated users with `has_paid_access`).
- create `user_tool_responses` table + owner-only RLS for select/insert/update/delete.
- seed 20 rows into `tools` (one per existing `kit_resources` row), each with a hand-authored schema for its kind.

## Out of scope / unchanged

- Storage bucket `secure-response-relationship-kit`, Stripe, auth, RLS for purchases/profiles, module exercises, ai-pattern-guide edge function — all untouched.
- No external links, no `window.open`, no `.ics`, no signed URLs anywhere in the new tools UI.

## Acceptance checklist

- [ ] No card shows "pdf", "docx", "Download original", "Open secure original", or "Opens securely".
- [ ] "Start Tool" expands an in-page panel; nothing opens in a new tab.
- [ ] Each of the 5 kinds renders, autosaves, and survives reload (data persisted per user).
- [ ] "Download my answers" appears only after the user has typed something.
- [ ] Works at 375px width and at desktop.
- [ ] All routes remain behind the existing auth + paid-access gate.
