# Plan

## 1. Finish wiring admin link visibility

In `src/routes/app.tsx`, the `isAdmin` state exists and the `Shield` link renders conditionally, but `checkIsAdmin()` is never called.

- After the session check confirms a user, call `checkIsAdmin()` and set `isAdmin` from `result.isAdmin`.
- Wrap in try/catch so a non-admin (or RPC error) silently keeps `isAdmin = false`.
- Reset `isAdmin` to false on `SIGNED_OUT`.

Result: the "Admin" pill appears in the app header only for users in `user_roles` with role `admin`.

## 2. Charge a flat €49 with no tax added on top

Currently `createCheckoutSession` uses `managed_payments: { enabled: true }`, which tells Stripe to calculate and add tax on top of the €49 price. The user wants €49 to be the total at checkout.

Change in `src/server/payments.functions.ts`:
- Remove `managed_payments: { enabled: true }` from `checkout.sessions.create`.
- Remove the `managed_payments: "true"` metadata flag.
- Remove the `ensureProductTaxCode` call and helper (no longer needed for the checkout path; tax handling is off).
- Keep everything else (line item, embedded mode, return URL, userId metadata).

This makes the €49 price the exact amount charged. Stripe will not add VAT/tax on top, and the user is responsible for any tax obligations themselves (consistent with their request).

Note: this opts out of Stripe's end-to-end tax compliance handling. If they later want tax included in the €49 (inclusive pricing), we'd need to mark the price as `tax_behavior: "inclusive"` in Stripe — call out as a follow-up only.

## 3. Add the founder signature to all email templates

Add the signature once in the shared `EmailLayout` footer (`src/lib/email-templates/_layout.tsx`) so every auth and transactional email automatically includes it. No per-template edits needed.

Signature block (rendered above the existing "My Love Pattern / mylovepattern.com" line):

```
With love,
Signe Putna
Founder, My Love Pattern

mylovepattern.com
hello@mylovepattern.com

Private sessions available on request
```

Implementation details:
- Add a new `signatureSection` above `footerSection` in the layout.
- Use serif italic for "With love," and "Signe Putna" matching brand voice.
- "hello@mylovepattern.com" rendered as a `mailto:` link.
- Small muted text for the "Private sessions available on request" line.
- Keep the existing minimal "My Love Pattern / mylovepattern.com" footer below as the legal/brand footer.

## Files touched

- `src/routes/app.tsx` — call `checkIsAdmin()` after auth resolves; reset on sign-out.
- `src/server/payments.functions.ts` — remove `managed_payments` and tax-code helper so €49 is the exact charge.
- `src/lib/email-templates/_layout.tsx` — add founder signature block to footer.

No DB migrations, no new routes, no new dependencies.
