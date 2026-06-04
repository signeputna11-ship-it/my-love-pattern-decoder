## Goal

Make the homepage live at `/home` so its URL matches the "Home" nav label, while keeping the old `/` URL working for anyone who lands on the bare domain.

## Changes

1. **New route `src/routes/home.tsx`**
   - Move the entire current contents of `src/routes/index.tsx` here (component, `head()`, all JSON-LD scripts).
   - Update `createFileRoute("/")` → `createFileRoute("/home")`.
   - Update canonical + `og:url` from `https://mylovepattern.com/` → `https://mylovepattern.com/home`.

2. **Replace `src/routes/index.tsx` with a redirect**
   - Same pattern already used in `src/routes/about.tsx`:
     ```ts
     export const Route = createFileRoute("/")({
       beforeLoad: () => { throw redirect({ to: "/home" }); },
     });
     ```

3. **Update nav links `to="/"` → `to="/home"`** in:
   - `src/components/healthy-love/SiteNav.tsx` (desktop + mobile "Home" link; logo link; "Take the quiz" button which uses `to="/"` + `hash="diagnosis"`)
   - `src/components/healthy-love/sections.tsx` (`Nav` component used on the home page itself, plus any internal `to="/"` + `hash` links like Diagnosis/FinalCTA CTAs)
   - `src/components/healthy-love/SiteFooter.tsx` (logo + Home link)
   - `src/components/healthy-love/StickyMobileCTA.tsx` (if it links to `/` + hash)
   - `src/components/healthy-love/DeepResetPopup.tsx`, `DeepResetSection.tsx` — only if they link to `/`
   - Any `to="/"` in pattern pages (`the-over-investor.tsx`, etc.) and `blog.*`, `shop.*`, `thank-you.tsx`

4. **Sitemap** — `src/routes/sitemap[.]xml.ts`: replace `/` entry with `/home` (priority 1.0).

5. **Structured data on `/home`** — update the `WebSite` / `Organization` / `Product` JSON-LD `url` fields from `https://mylovepattern.com` (root) to `https://mylovepattern.com/home` where they reference the homepage URL specifically. Keep brand-level `url: "https://mylovepattern.com"` as-is for `Organization`.

## SEO note

Moving the homepage off `/` is unusual and Google may take time to re-index. The 307 redirect from `/` → `/home` preserves traffic but you'll temporarily split link equity. If you'd rather keep `/` as the canonical homepage and only rename the nav label, say the word and I'll switch approach.

## Out of scope

- No copy or design changes.
- No changes to `/about` redirect (already points to `/deep-reset`).
- No Meta Pixel changes.

## Verification

- Visit `/` → redirects to `/home`, full homepage renders.
- Nav "Home" link is active on `/home`.
- All in-page anchors (`#diagnosis`, etc.) work from other pages.
- `/sitemap.xml` lists `/home`.
