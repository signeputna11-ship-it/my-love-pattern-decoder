## Goal

Stop opening PDFs from "Open Recommended Tool". Instead, the button should scroll the user to the matching **in-app tool** in the "Module resources" section and open it automatically.

## Why the current flow is wrong

Today the AI recommends a row from `kit_resources` (a PDF in the secure storage bucket) and the button generates a signed URL to open that PDF in a new tab. The user wants to stay inside the app and use the guided in-app tools that already render in `<InAppTools>`.

The in-app tools live in a different table (`tools`, with `slug` and `module` keys), and that's what the "Module resources" section shows.

## Changes

### 1. Edge function `supabase/functions/ai-pattern-guide/index.ts`
- Stop fetching `kit_resources`. Fetch from `tools` instead, filtered by the same module key the page uses (`SLUG_TO_MODULE_KEY` map: `see-the-pattern → pattern`, etc.).
- Pass the available tools (`id`, `slug`, `title`, `description`, `kind`) into the AI context as `available_tools`.
- Rename the tool-call field `recommended_resource_id` → `recommended_tool_slug` (string slug, or null). Constrain the enum to the actual tool slugs for this module.
- Persist `recommended_next` as the chosen tool slug (or null).

### 2. `src/components/healthy-love/PatternGuideCard.tsx`
- Replace the `kit_resources` lookup with a `tools` lookup keyed by `slug` + module key (using the same `SLUG_TO_MODULE_KEY` map as InAppTools).
- Replace the storage `createSignedUrl` flow with:
  1. Dispatch a custom event `open-in-app-tool` with the recommended tool slug (and id as backup).
  2. Smooth-scroll to `#in-app-tools`.
- Update the suggestion chip text to show the in-app tool title.

### 3. `src/components/healthy-love/InAppTools.tsx`
- Listen for the `open-in-app-tool` window event. When fired, find the tool whose `slug` matches and call `setActiveId(tool.id)` so it opens (the existing `useEffect` already scrolls the panel into view).

### 4. Type field rename
- `Reflection.recommended_resource_id` → `recommended_tool_slug` in the card's local type.

## What the user will experience

1. Click **Generate Guidance** → AI returns a reflection plus a suggested in-app tool slug for this module.
2. Suggested-tool chip shows the matching tool's title.
3. Click **Open Recommended Tool** → page smooth-scrolls to "Module resources" and the recommended tool card auto-opens its guided runner. No PDF, no new tab.
4. If the AI returns no recommendation (or the slug doesn't match any tool), the button just scrolls to the resources section.

## Out of scope

- Leaving the existing `kit_resources` table and storage bucket untouched (they may still be used elsewhere).
- No DB migration needed — the `tools` table and `recommended_next` column already exist.
