## 1. Hide the "Edit with Lovable" badge

Toggle the project setting `hide_badge = true` via `publish_settings--set_badge_visibility`. This removes the badge from the published site at `mylovepattern.com` and `heart-pattern-decoder.lovable.app`. Requires Pro plan or higher (Lovable will surface a billing prompt on approval if not on Pro). No code change.

Note: the badge does not appear in the Lovable editor preview — only on published deployments — so it will keep showing in your editor view, that is expected.

## 2. Landing-page conversion quick wins

Heads up: your funnel has no actual modal or popup component. The "popup" is the inline quiz/result block inside `Diagnosis` in `src/components/healthy-love/sections.tsx`. The Tailwind `items-start` / `fixed inset-0` snippets you pasted assume a modal that does not exist here. I'll adapt the spirit of those fixes to the inline structure.

### 2a. Auto-scroll to result + tighter reveal copy (Diagnosis section)

In `src/components/healthy-love/sections.tsx` `Diagnosis`:

- When `showResult` flips to `true`, scroll the result card into view smoothly so users see it instantly (`useEffect` watching `showResult`, calling `resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })`).
- Add a short "Your result is ready" eyebrow above the pattern title (psychological progress cue).
- Tighten the result intro to lead with a 2-line punch: pattern title, then one-sentence emotional hook ("This is not random. Your nervous system is repeating a loop."), then CTA — current 3-card grid stays below for users who want detail.
- Replace soft verbs in the primary CTAs on this section: "Unlock My Reset" stays, but the secondary "explore" / "discover" wording (where present) becomes "See your pattern" / "Understand why this keeps happening".

### 2b. Sticky mobile CTA bar on landing

Add a new component `StickyMobileCTA` rendered from `src/routes/index.tsx` (so it lives only on `/`, not inside `/app` or `/checkout`). Behavior:

- Visible only on screens `< md` (mobile/tablet).
- Fixed to the bottom of the viewport with safe-area padding.
- Single button: "Unlock My Pattern €49" → routes to `/checkout` if signed in with no paid access, `/auth?redirect=/checkout` if signed out, `/app` if already paid (mirrors the Nav CTA logic in `sections.tsx`).
- Hidden once the user scrolls past the FinalCTA section (so it doesn't double up with the in-page CTA at the bottom). Use an IntersectionObserver on the `#final-cta` anchor.
- Add `pb-24 md:pb-0` to the landing page wrapper so the sticky bar never covers the last section's content.

No changes to the auth or payment flow — login still happens before checkout, as it does today. (You picked "Quick wins + sticky mobile CTA" so I'm not moving login after payment in this pass.)

## Files touched

- `src/components/healthy-love/sections.tsx` — auto-scroll on result reveal, eyebrow + tightened reveal copy, copy nits.
- `src/components/healthy-love/StickyMobileCTA.tsx` — new component (mobile-only sticky buy bar with auth-aware routing).
- `src/routes/index.tsx` — mount `StickyMobileCTA` and add `pb-24 md:pb-0` wrapper padding.
- Project setting: `hide_badge = true` (no file change).

## Not in scope this pass

- Pay-then-create-account rework (you opted out — would require guest Stripe checkout + webhook account provisioning + auth refactor; happy to plan separately).
- New modal/Dialog component (none exists; not needed for these fixes).
- Stripe €49 inclusive-tax pricing — already flat €49 from previous change.
