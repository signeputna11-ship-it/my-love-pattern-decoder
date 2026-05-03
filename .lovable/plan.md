## Fix CSS build error blocking /checkout

**Root cause:** Line 1 of `src/styles.css` is `@import url('https://fonts.googleapis.com/...')`. After Tailwind v4 expands `@import "tailwindcss"` on line 2, the Google Fonts `@import` ends up after thousands of generated rules, and PostCSS fails with `@import must precede all other statements`. This breaks the CSS bundle, so `/checkout` (and other routes) render blank.

**Fix:** Delete line 1 of `src/styles.css`. The Google Fonts are already loaded via `<link rel="stylesheet">` tags in `src/routes/__root.tsx`, so removing this line is safe and sufficient.

**Files changed:**
- `src/styles.css` — remove the `@import url(...fonts.googleapis.com...)` line
