## Problem

On every Stripe product page (`/shop/:slug` for the 6 worksheets + Reset Kit), the "Continue to payment" button often appears inactive. Root causes:

1. **Silent validation** — the button is `disabled` whenever any of First name / Last name / Phone / Email fails validation, but nothing tells the user which field is wrong. Phone regex (`/^[+0-9()\-.\s]{4,40}$/`) rejects common inputs (e.g. letters mid-typing, missing length). Users assume the button is broken.
2. **No clickable affordance** — disabled state uses only `opacity: 0.4`. No `cursor: not-allowed` when disabled, no `cursor: pointer` when enabled, no hover state. Looks dead either way.
3. **No `type="button"`** — inside any future wrapper `<form>` this would submit/refresh.
4. **No error surfacing on submit failure** — if `createGuestCheckout` throws (network, Stripe error, bad slug), the Embedded Checkout silently fails to mount and the user sees a blank panel with no retry.
5. **Phone marked "required"** but many guest buyers don't want to share it — friction that blocks conversion. Spec earlier required it; we'll keep required but relax the regex and show inline help.

## Fix

### 1. `src/routes/shop.$slug.tsx` — `StripeProductView`
- Add per-field inline validation messages (red helper text under each field) that appear only after the field has been touched (`onBlur`).
- Relax phone regex to `^[+0-9()\-.\s]{6,40}$` and strip-on-validate; trim before checking length. Email regex unchanged.
- Button:
  - Add `type="button"`.
  - Add `cursor: formValid ? "pointer" : "not-allowed"`.
  - When `!formValid`, keep `disabled` but also render a small hint line above: "Fill in all fields to continue".
  - Add hover state (slight bg lift) when enabled.
- Wrap `fetchClientSecret` in try/catch; on failure, `setStarted(false)` and surface a toast/inline error ("Couldn't start payment. Try again or refresh."). Add a "Back to details" link inside the embedded checkout panel so users can re-edit and retry.
- Add a loading state on the button while `setStarted` transitions (prevent double-click).

### 2. Verify identical CTA in `src/routes/checkout.tsx` (the legacy authenticated Reset Kit checkout)
- That page mounts `EmbeddedCheckout` immediately (no name/phone gate), so the "Continue to payment" issue does not apply there. No change unless QA shows otherwise.

### 3. Smoke-test the full Stripe path after the fix
- Hit `/shop/breadcrumbing-red-flags`, fill fields, confirm the button activates and the Stripe iframe mounts.
- Use Stripe test card `4242 4242 4242 4242` (sandbox token is active in preview).
- Confirm webhook `/api/public/payments/webhook?env=sandbox` fires, `purchases` row is written with first/last/phone, Step-1 confirmation email is enqueued, and `/thank-you?session_id=...` resolves the access link.
- Check `stack_modern--server-function-logs` for webhook errors.

### 4. Out of scope
- No changes to product list, pricing, email templates, navigation, or the Deep Pattern Reset session (mailto flow stays as-is).
- No DB migrations.

## Files touched

- `src/routes/shop.$slug.tsx` (UX + error handling only — `StripeProductView`)

## Acceptance

1. On any worksheet or kit page, the "Continue to payment" button visibly becomes active (dark, pointer cursor) the moment all four fields are valid.
2. If a field is invalid after blur, the user sees exactly which field and why.
3. Clicking the button mounts the Stripe Embedded Checkout reliably; on backend failure the user sees a clear error and can retry.
4. Test purchase end-to-end with `4242 4242 4242 4242` writes a `purchases` row and enqueues the confirmation email.