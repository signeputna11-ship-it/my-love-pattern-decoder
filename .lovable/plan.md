# SEO Fix: Foundation + Targeted Rewrites

## Why this is needed (Semrush snapshot)

| Metric | Value |
|---|---|
| Authority Score | 0/100 |
| Organic keywords | 0 |
| Estimated organic traffic | 0/mo |
| Backlinks | 10 (all nofollow, 2 spam domains) |

97% of your current visits are Direct — Google isn't sending anyone yet. The site is too new and missing the technical signals search engines need to trust and index it. Below is what I'll ship in one build.

## Part A — Technical SEO (foundation)

**1. Canonicals + og:url on every leaf route**
Add `<link rel="canonical">` and `og:url` meta to: `/`, `/about`, `/blog`, `/blog/the-over-investor`, `/the-over-investor`, `/the-unavailable-chaser`, `/the-validator-seeker`, `/the-boundary-softener`. Tells Google `mylovepattern.com` is the authoritative URL.

**2. JSON-LD structured data** (this is what unlocks rich Google results)
- `__root.tsx` → `Organization` + `WebSite` schema
- `/blog/the-over-investor` → `Article` schema (headline, author "Signe Putna", datePublished)
- 4 pattern pages → `FAQPage` schema using the "Where it starts / What shifts it" structure
- All deep routes → `BreadcrumbList`

**3. Internal linking between pattern pages**
Each pattern page currently dead-ends at the quiz CTA. Add a "Related patterns" footer linking to the other 3 patterns + back to `/`. Internal links are how Google discovers and ranks deep pages.

**4. Sitemap + robots audit**
- Verify all 8 routes are in `/sitemap.xml` (they are) and `lastmod` reflects today
- Confirm `robots.txt` allows `/about`, `/blog`, and the 4 pattern pages (it does — only `/app`, `/checkout`, `/auth` are blocked)
- Add `Sitemap: https://mylovepattern.com/sitemap.xml` line to robots.txt (already present ✓)

**5. Google Search Console verification**
Add the Google site-verification meta tag to `__root.tsx` (alongside the existing Pinterest one), then I'll call the verification API and submit the sitemap automatically.

## Part B — Keyword-targeted rewrites (tone level 3 of 5)

Semrush data shows the high-opportunity terms in your niche. Current page titles target almost-zero-volume phrases. I'll rewrite titles, meta descriptions, and H1s only — body copy stays in your voice.

| Page | Current title | New title (keyword target) | Monthly searches |
|---|---|---|---|
| `/the-unavailable-chaser` | "The Unavailable Chaser Love Pattern" | "Why You Keep Attracting Emotionally Unavailable Men — The Unavailable Chaser Pattern" | 1,600 + 210 long-tail |
| `/the-over-investor` | "The Over-Investor Love Pattern" | "Why You Over-Give in Relationships — The Over-Investor Pattern" | targets anxious-attachment intent |
| `/the-validator-seeker` | "The Validator Seeker Love Pattern" | "Why One Unanswered Text Wrecks You — The Validator Seeker Pattern" | targets reassurance-seeking searches |
| `/the-boundary-softener` | "The Boundary Softener Love Pattern" | "Why You Lose Your Boundaries When You Like Someone — The Boundary Softener Pattern" | targets people-pleaser searches |
| `/` (homepage) | "My Love Pattern" | "My Love Pattern — Discover Your Relationship Pattern in 60 Seconds" | brand + intent |

Meta descriptions rewritten to include the question phrasing women actually search for (e.g. "why do I attract emotionally unavailable men", "why do I over-invest"). One subtle keyword phrase added to each opening paragraph — your voice intact, no SEO-spam tone.

## Part C — Things only you can do (instructions, no code)

1. **Google Search Console** — after deploy, I verify automatically. You then sign in at search.google.com/search-console, request indexing for each of the 8 URLs (one click each).
2. **Bing Webmaster Tools** — sign in with Google, import the GSC property, takes 60 seconds.
3. **Pinterest** — your verify tag is already live ✓. Start pinning quote graphics from the pattern pages. Pinterest is the single highest-leverage channel for this niche.
4. **Do NOT buy backlinks.** Your 2 existing referring domains are Fiverr SEO spam. More of those can trigger a Google penalty. Real links come from podcast appearances, guest posts on women's wellness sites, and Substack/newsletter mentions.

## Out of scope (separate plan if you want it later)

- New blog posts targeting question-keywords (e.g. "do emotionally unavailable men change" — 90/mo, KDI very easy)
- Open Graph share images for each pattern page
- A `/quiz` landing route separate from `/`

## Technical notes

- TanStack Start `createFileRoute` `head()` for all meta. Canonicals only on leaves (root canonical + leaf canonical would emit duplicates due to a TanStack links-merge bug).
- JSON-LD goes in the `scripts: []` array of each route's `head()`, type `application/ld+json`.
- Search Console verification uses the gateway API — I run the curl after deploy, no manual token entry needed from you.

## Expected timeline

- Code changes: ship today
- Google indexes new pages: 3–14 days after Search Console submission
- First organic clicks: 4–8 weeks (new domains take time, no shortcut)
- Meaningful traffic: 3–6 months with 1–2 new posts/month
