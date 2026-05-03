## Fix unclickable buttons (hydration failure on body)

**Root cause:** The Grammarly browser extension injects `data-new-gr-c-s-check-loaded` and `data-gr-ext-installed` attributes on `<body>` before React hydrates. React detects the SSR/client attribute mismatch on `<body>`, aborts hydration of that subtree, and never attaches the onClick handlers — so "Get My Reset (€49)", "Start Module", "Find My Pattern", etc. all do nothing.

**Fix:** Add `suppressHydrationWarning` to both `<html>` and `<body>` in `src/routes/__root.tsx`. This tells React to ignore extension-injected attributes and complete hydration normally, restoring all click handlers.

**Files changed:**
- `src/routes/__root.tsx` — add `suppressHydrationWarning` to `<html>` and `<body>`
