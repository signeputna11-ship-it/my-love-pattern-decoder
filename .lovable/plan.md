## Diagnosis

`/app` shows nothing because the CSS bundle fails to compile. The dev server logs show:

```
[vite:css][postcss] @import must precede all other statements
4121 | @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif...
```

In `src/styles.css` the Google Fonts `@import url(...)` sits on line 4, after `@import "tailwindcss"` and `@source "../src"`. Once Tailwind inlines its base styles, that font `@import` ends up after thousands of CSS rules — which violates the spec, so PostCSS aborts and no styles (or app shell) render. The route mounts but the page looks blank/broken.

(The `tailwind.config.ts` esbuild error in the same log is a separate, harmless internal generator warning — Tailwind v4 doesn't use that file. Not the cause.)

## Fix

One small change to `src/styles.css`:

- Move the Google Fonts `@import url(...)` line to be the **very first line** of the file, before `@import "tailwindcss"` and `@import "tw-animate-css"`.
- Optionally, replace it with a `<link rel="stylesheet">` in `src/routes/__root.tsx` head so it never collides with Tailwind ordering again. (I'll do the inline `<link>` approach — more robust.)

### Concrete edits
1. `src/styles.css` — remove line 4 (`@import url('https://fonts.googleapis.com/...')`).
2. `src/routes/__root.tsx` — add to `head().links`:
   ```ts
   { rel: "preconnect", href: "https://fonts.googleapis.com" },
   { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
   { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600;700&display=swap" },
   ```

No DB, route, or auth changes. Once CSS compiles, `/app` will render the dashboard you already built (modules grid, progress, "Enter your portal" flow).

## Files touched
- `src/styles.css` — drop the misplaced font `@import`
- `src/routes/__root.tsx` — load fonts via `<link>` in head
