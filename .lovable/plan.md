## Goal

Eliminate the two redirect-status pages, ensure every public page returns 200 with a correct self-referential canonical, fix the shop product page that's accidentally `noindex`, and expand the sitemap to list every public URL.

## 1. Kill the two redirects (Issue 1)

`src/routes/index.tsx` and `src/routes/about.tsx` currently throw `redirect()` — those are the two pages GSC is flagging.

- **`src/routes/index.tsx`** — restore the full homepage component (move the contents of `src/routes/home.tsx` back into `index.tsx`, route `/`). Canonical = `https://mylovepattern.com/`. `og:url` = same.
- **`src/routes/home.tsx`** — keep it serving the same homepage component, but set canonical and `og:url` to `https://mylovepattern.com/` (points back to `/`). This way `/home` returns 200, no redirect, and Google de-dupes to `/`.
- **`src/routes/about.tsx`** — replace the redirect with a component that renders the Deep Reset content (re-export from `deep-reset.tsx`) and set canonical = `https://mylovepattern.com/deep-reset`. 200, no redirect, Google de-dupes to `/deep-reset`.

Internal `Link to="/home"` references stay valid; no nav changes needed.

## 2. Fix `/shop/$slug` head (Issue 2 — critical)

`src/routes/shop.$slug.tsx` currently has:
```ts
head: () => ({
  meta: [{ title: "Checkout · My Love Pattern" }, { name: "robots", content: "noindex, nofollow" }],
}),
```
That's wrong on two counts: title says "Checkout" and it's set to `noindex`. Replace with a loader-driven `head()`:

- Add a `loader` that calls `getShopProduct({ data: { slug: params.slug } })` (mirror the in-component fetch).
- `head({ params, loaderData })` returns title = `${product.name} · My Love Pattern`, description = `product.short_description`, `og:title`/`og:description`/`og:url`, `og:type: "product"`, and `links: [{ rel: "canonical", href: \`https://mylovepattern.com/shop/${params.slug}\` }]`.
- **Remove the `noindex` meta.**
- Add JSON-LD `Product` schema with `name`, `offers.price`, `offers.priceCurrency`, `offers.availability`.

## 3. Add canonical to `/shop`

`src/routes/shop.index.tsx` has a `head()` but no canonical. Add:
```ts
links: [{ rel: "canonical", href: "https://mylovepattern.com/shop" }]
```

## 4. Audit other public routes for canonical + no stray noindex

These already have correct canonicals (verified): `/home`, `/deep-reset`, `/blog`, `/blog/$slug`, `/blog/category/$category`, `/the-over-investor`, `/the-unavailable-chaser`, `/the-validator-seeker`, `/the-boundary-softener`. After step 1, `/` will too. No changes needed beyond what's listed above.

Confirmed `noindex` only lives on `/shop/$slug` (will be removed) — `/app`, `/admin`, `/auth`, `/checkout`, `/kit`, `/w`, `/thank-you`, `/unsubscribe` are correctly excluded from sitemap and robots.txt blocks the sensitive ones.

## 5. Expand sitemap (`src/routes/sitemap[.]xml.ts`)

Current sitemap only lists 9 static URLs + blog posts + blog categories, and uses `/home` (which won't be canonical after step 1). Changes:

- Replace `/home` entry with `/` (priority 1.0).
- Add all 8 active shop product slugs by calling `supabaseAdmin.from("shop_products").select("slug, updated_at").eq("active", true)` — same source/filter as the route loader. (Actual DB slugs: `breadcrumbing-red-flags`, `availability-vs-chemistry`, `insecurity-soothing-sop`, `higher-standards-fear`, `worth-tied-to-attention`, `saying-no-script`, `love-pattern-reset-kit`, `deep-pattern-reset`. Note: user's list mentioned `/shop/insecurity-soothing` and `/shop/full-kit` — those slugs don't exist; the real ones are `insecurity-soothing-sop` and `love-pattern-reset-kit`.)
- Use real `updated_at` from each shop product row for `lastmod` (today's date if null), same pattern as blog posts.

After the build, the sitemap will contain: `/`, `/deep-reset`, `/blog`, `/shop`, 8 shop products, 4 pattern pages, all published blog posts, all blog categories. Roughly 17–28 URLs depending on blog post count.

## 6. www vs apex (note, not code)

I can't probe DNS from here. The codebase uses `https://mylovepattern.com` (no www) everywhere — canonicals, sitemap, JSON-LD. As long as `www.mylovepattern.com` 301-redirects to the apex (or one of them is the only domain Google sees), this is consistent. If GSC shows a www↔apex redirect warning, that's a DNS/host setting outside the code — flag it after deploy if it still appears.

## Out of scope

- No copy or design changes.
- No new content pages.
- No Meta Pixel or analytics changes.
- The `/home` URL stays alive (200 + canonical to `/`) since it's now externally linked from the nav and from prior crawls; removing it would create new 404s.

## Verification (post-deploy)

- `curl -I https://mylovepattern.com/` → 200, not 30x.
- `curl -I https://mylovepattern.com/about` → 200, not 30x.
- `curl -s https://mylovepattern.com/shop/love-pattern-reset-kit | rg -i 'canonical|noindex'` → canonical present, no noindex.
- `curl -s https://mylovepattern.com/sitemap.xml` lists `/`, `/shop/<each-of-8-slugs>`, and every published blog post.
- Mark the corresponding SEO findings fixed via `seo_chat--update_findings`.
