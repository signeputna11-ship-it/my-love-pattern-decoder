## Goal
On every blog post, automatically inject a "matching template" card mid-article. Clicking the CTA opens embedded Stripe checkout right there — no navigation away.

## Matching logic (auto by tag/category)
Shop products have no `category`/`tags` columns, so we match using what blog posts already have:

1. If any of `post.tags` equals a `shop_products.slug` → use that product.
2. Else if `post.category` (lowercased, hyphenated) equals a `shop_products.slug` → use that.
3. Else fall back to the flagship product `love-pattern-reset-kit`.

This needs **no schema change**. Authors control the match by adding the product slug as a tag (e.g. tag a post with `breadcrumbing-red-flags`). The 8 existing product slugs become the "matching pool."

## Implementation

### 1. New server fn `getMatchingProductForPost` (in `src/lib/blog.functions.ts`)
- Input: `{ tags: string[] | null, category: string | null }`
- Looks up `shop_products` where `active = true` and `slug` in candidate list, returns first match in priority order (tag match > category match > fallback slug).
- Returns `{ product: { slug, name, short_description, price_cents, currency, stripe_price_id } | null }`.

### 2. New component `src/components/blog/InlineProductCard.tsx`
- Parchment card styled to match blog prose (rounded, soft border, ✦ accent).
- Shows product name, short description, price.
- "Get the template →" button calls the existing `useStripeCheckout` hook (`src/hooks/useStripeCheckout.tsx`) — opens embedded checkout in a modal/inline panel using `priceId = product.slug` (matches lookup_key convention) and the current user's email/id if signed in.
- `return_url` → `/checkout/return?session_id={CHECKOUT_SESSION_ID}`.

### 3. Inject mid-article in `src/routes/blog.$slug.tsx`
- After `DOMPurify.sanitize(post.content)`, split the sanitized HTML at roughly the midpoint **on a `</p>` boundary** (so we never break inside a tag).
- Render: `<div className="blog-prose" dangerouslySetInnerHTML={{ __html: firstHalf }} /> <InlineProductCard product={matched} /> <div className="blog-prose" dangerouslySetInnerHTML={{ __html: secondHalf }} />`.
- Loader extends to also call `getMatchingProductForPost`; product passed to component via loader data.
- If no match found and no fallback product is active, render nothing (graceful).

### 4. Checkout wiring
- Reuse existing `createCheckoutSession` server fn + `StripeEmbeddedCheckout` component already in the project (per shop pages).
- Render `checkoutElement` at the page root so the modal overlays the article.

## Files touched
- `src/lib/blog.functions.ts` — add `getMatchingProductForPost`
- `src/components/blog/InlineProductCard.tsx` — new
- `src/routes/blog.$slug.tsx` — loader + mid-article split + render card + render checkout element

## Out of scope
- No DB migration, no admin editor changes, no shop product changes.
- Authors opt into a specific match by adding the product slug as a tag on the post.
