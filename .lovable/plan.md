## Goal

1. Make every page show the same top nav order: **Home · Shop · Deep Reset · Blog · Patterns**.
2. Replace every "Book a Deep Pattern Reset" mailto link with the Calendly 30-min discovery call: `https://calendly.com/mylovepattern/30min` (open in new tab).

## 1. Nav consistency

There are currently two nav components and they disagree.

**`src/components/healthy-love/sections.tsx` (`Nav`)** — used on the home page.
- Today: Home · Shop · Patterns · Blog (no Deep Reset).
- Change to: Home · Shop · Deep Reset · Blog · Patterns.
- "Deep Reset" links to `/about` (that route hosts the Deep Reset content) — both desktop and mobile menus.

**`src/components/healthy-love/SiteNav.tsx`** — used on every other page.
- Today desktop: Home · Shop · Deep Reset · Blog · Patterns ✅ already correct.
- Today mobile: shows "Signe" for the /about link — rename to "Deep Reset" to match desktop.

No route files change; `/about` continues to serve the Deep Reset page.

## 2. Calendly CTA swap

Replace the `BOOKING_HREF` / equivalent constant (and any inline mailto for "Deep Pattern Reset — Discovery Call") in these files so the button/link points to Calendly and opens in a new tab (`target="_blank"`, `rel="noopener noreferrer"`):

- `src/components/healthy-love/DeepResetSection.tsx`
- `src/components/healthy-love/DeepResetPopup.tsx`
- `src/components/healthy-love/SiteFooter.tsx`
- `src/routes/about.tsx` (3 CTAs)
- `src/routes/shop.index.tsx`
- `src/routes/shop.$slug.tsx`
- `src/routes/thank-you.tsx`

New value: `const BOOKING_HREF = "https://calendly.com/mylovepattern/30min";`

Email templates (`src/lib/email-templates/nurture-sequence.tsx`) are out of scope — emails are already sent and shouldn't be silently retargeted unless you ask.

## Out of scope

- No copy rewrites beyond the link target.
- No changes to the JSON-LD FAQ text on the home route (still references emailing Signe); can update next pass if you want it aligned.
- No route renames.

## Verification

After build: load `/` and `/about`, confirm nav order matches on both, click "Book a Deep Pattern Reset" on home, about, shop, footer → opens Calendly in a new tab.
