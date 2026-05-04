## Goal

Under (next to) the "Mark module complete" button on `/app/module/$slug`, add a "Go to next module" button that navigates the user to the next module in sequence.

## Changes

### `src/routes/app.module.$slug.tsx`

1. **Load module list for sequencing.** In the existing `load` effect (or a small follow-up fetch), fetch `modules` ordered by `position` and store as `allModules` state. Compute `nextModule` = the module with `position > current.position` (lowest such), or `null` if this is the last one.

2. **Add the button.** In the action row (currently just the "Mark module complete" button at lines 344–352), add a second button `Go to next module` styled as a secondary/outline button (transparent bg, white border, white text) so it pairs with the primary white button. The two should sit side-by-side on `sm:` and stack on mobile (the row already does `flex-col gap-3 sm:flex-row`).

3. **Behavior:**
   - If `nextModule` exists: render a `<Link to="/app/module/$slug" params={{ slug: nextModule.slug }}>` styled as a button with `ArrowRight` icon and label `Go to next module: {nextModule.title}` (truncated on small screens).
   - If this is the last module: render a `<Link to="/app">` labeled `Back to dashboard` instead.
   - The button is always visible (not gated on completion) so users can move on whenever they want. Clicking it does NOT auto-mark the current module complete — completion stays an explicit choice via the existing button.

4. **Make "Mark module complete" auto-advance optional touch:** after `markComplete` succeeds, if `nextModule` exists, show the toast as today and leave navigation to the user (they can click "Go to next module"). No automatic redirect — keeps user in control.

### Imports

Add `ArrowRight` to the existing `lucide-react` import.

## Out of scope

- No DB/schema changes.
- No changes to PatternGuideCard, InAppTools, or the sticky save/download bar.
- No reordering logic — uses existing `position` column.
