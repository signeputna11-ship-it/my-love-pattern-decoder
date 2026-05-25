## Goal

Replace the current `/about` page on mylovepattern.com with the structure and copy from `HerOwnRoots.jsx`, adapted to MLP's existing design system. Use Signe's uploaded photo. Use the existing mailto-to-Signe booking flow (no Calendly, no €333 Stripe checkout).

## What changes

### 1. Add the portrait asset
- Copy `user-uploads://IMG_1337.JPG` → `src/assets/signe-her-own-roots.jpg`.

### 2. Rewrite `src/routes/about.tsx`
Keep the existing `createFileRoute("/about")` block (head/meta/JSON-LD stay — they're already correct). Replace the `AboutPage` component with a new layout based on the Her Own Roots sections, but built from MLP primitives so it integrates visually.

**Reuse, don't fork:**
- `SiteNav` (top) and `SiteFooter` (bottom) — same as today. No second "Her Own Roots" sub-brand nav.
- `VideoBackground` for the hero (same R2 video the current About uses) — keep MLP's dark-video aesthetic instead of the cream `#F8F5F0` Her Own Roots palette.
- Tailwind + existing semantic tokens (`bg-background`, `text-foreground`, `text-muted-foreground`, `font-serif`, `font-mono`, `border-border`, `bg-accent`, etc.) — no inline `#111` / `#F8F5F0` / `#8A8480` colors.
- Existing typography pairing already in use (Instrument Serif italic for display, Inter for body).
- The "✦" ornament and uppercase tracked eyebrow labels stay — they already match MLP.

**Sections, in order (all copy lifted from HerOwnRoots.jsx):**
1. **Hero** — "You already know something needs to change." Two-column on desktop, stacked on mobile. Left: eyebrow ("About Signe ✦ Porto"), display headline, supporting paragraph. Right: small "Deep Pattern Reset" eyebrow + "Book a Deep Pattern Reset" CTA (mailto to `mylovepattern@gmail.com`, same `SIGNE_MAILTO` pattern used in `SiteFooter`) + a ghost link "What happens in a session" → `#session`. Bottom credential strip: RTT · Reiki · Kundalini · Intuitive Coaching.
   - Drop the €333 price tile and the "herownroots.com" URL chip (we are on mylovepattern.com, and pricing is handled off-site via email).
2. **Mirror** — "You have tried everything. And something is still there." Two-column copy block (3 paragraphs).
3. **Who this is for** — Six-card grid (01–06) on `bg-accent/40` with `border-border`. Same 6 items from the file.
4. **About Signe (`id="about"`)** — Two-column: left = Signe's photo (`signe-her-own-roots.jpg`, aspect-ratio 3/4, rounded, captioned "Signe Putna"); right = "I do not teach what I studied. I show you what I lived." with the 3 proof bullets and credential pills.
5. **The Session (`id="session"`)** — Dark band (`bg-foreground text-background` — already used by SiteFooter's "Book Signe" card). "One session. The root. Changed." + the 4 numbered steps (i–iv). End with the mailto CTA again.
6. **Closing CTA** — Single centered block: "Ready when you are" → mailto to Signe.

**Drop from the source file:**
- The fixed cream `<nav>` (replaced by `SiteNav`).
- All Calendly script-loading `useEffect` + `openCalendly` (we use mailto).
- Manual Google Fonts injection (fonts are already loaded globally).
- The `<style>` global reset and `.hor-btn` / `.hor-ghost` / `.hor-book` classes (Tailwind handles this).
- The `useReveal` IntersectionObserver scroll animations — not used elsewhere on MLP; keep the page static for now to match the rest of the site.
- The €333 price, "herownroots.com" wordmark, and "Her Own Roots" sub-brand naming. The page is the My Love Pattern About page; section copy can still reference Signe's practice but we don't introduce a second brand identity.

### 3. Nothing else changes
- `SiteNav` already links to `/about` — no nav edits needed.
- `SiteFooter`'s existing "Book a Deep Pattern Reset" CTA already mailtos Signe with the right subject/body; reuse the same `SIGNE_MAILTO` constant in the new About page.
- No new routes, no route-tree edits (`/about` already exists), no DB / RLS / payments changes.

## Technical notes

- File touched: `src/routes/about.tsx` (component body only — keep the `Route` export, head meta, and JSON-LD).
- Asset added: `src/assets/signe-her-own-roots.jpg`, imported as an ES module and passed to `<img src={...} />`.
- Use semantic tokens from `src/styles.css`. No raw hex values in JSX.
- `id="about"` and `id="session"` anchors preserved so in-page jumps from the hero work.
- Mobile: hero/about/session grids collapse to single column at `md:` breakpoint.

## Out of scope (flag, don't do)

- No Calendly integration.
- No €333 Stripe product / checkout.
- No new "Her Own Roots" sub-brand, logo, or separate domain page.
- No changes to the homepage, shop, or quiz flow.

If you later want a dedicated paid €333 session purchasable via Stripe (like the $7 shop items), that's a separate build.
