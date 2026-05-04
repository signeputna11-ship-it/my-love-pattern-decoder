## Goals

1. Set up sending app emails (welcome, purchase confirmation, course/booking notifications) via Lovable's built-in email infrastructure.
2. Add an admin-only Email Delivery dashboard so failures and bounces are surfaced.
3. Brand all email templates (auth + new app emails) with the My Love Pattern logo and palette.
4. Clean up landing/app copy: remove decorative `// ...` lines and unnecessary em-dashes.
5. Add the uploaded MLP logo next to the title on the landing page nav AND in the in-app header.

---

## 1. Brand asset

- Copy `user-uploads://1X1_LOGO_MLP.png` to `src/assets/mlp-logo.png` (used in nav/app header) and to `public/mlp-logo.png` (used by email templates via absolute URL).

## 2. Logo placement

- **Landing nav** (`src/components/healthy-love/sections.tsx`, `Nav`): replace the small `Sparkles` circle next to "My Love Pattern" with the imported logo (rounded, white background, ~28-32px).
- **App header** (`src/routes/app.tsx`, lines 171-185): add the same logo to the left of "My Love Pattern / Reset Portal".

## 3. Copy cleanup

In `src/components/healthy-love/sections.tsx`, remove the four visible `// ...` decorative lines (lines 214, 280, 428, 524) — keep the surrounding `<p>` removed entirely so spacing collapses naturally.

For em-dashes: only `InAppTools.tsx` lines 281, 288, 289, 561 are user-visible. Replace with a colon or hyphen:
- `My version — ${title}` -> `My version: ${title}`
- `Day N — Intention` / `Day N — Note` -> `Day N: Intention` / `Day N: Note`
- table empty placeholder `"—"` -> `"-"`

(Code comment em-dashes inside `// ...` lines are not user-facing and will be left alone.)

## 4. App email infrastructure (transactional)

Email infra (queues, RPCs, cron, send log, suppression, unsubscribe tokens) is already set up. The auth webhook is already in place. We now need to add transactional sending:

- Run the transactional email scaffold tool. This creates:
  - `src/routes/lovable/email/transactional/send.ts` (authenticated send route)
  - `src/routes/lovable/email/transactional/preview.ts`
  - `src/routes/email/unsubscribe.ts` (token validate + unsubscribe POST)
  - `src/routes/lovable/email/suppression/webhook.ts` (bounce/complaint handler)
  - `src/lib/email-templates/registry.ts`
  - A sample template
- Create `src/lib/email/send.ts` — the `sendTransactionalEmail` client helper (uses the user's Supabase JWT).

### App email templates to add (all branded with logo + palette)

In `src/lib/email-templates/`:
1. `welcome.tsx` — sent after signup confirms / first login. Subject: "Welcome to My Love Pattern".
2. `purchase-confirmation.tsx` — sent from the Stripe webhook after a successful purchase. Subject: "Your access is unlocked".
3. `course-notification.tsx` — generic notification template (used for new module unlocks / reminders). Accepts `title`, `body`, `ctaUrl`, `ctaLabel` props.
4. `password-reset-followup.tsx` — sent after a password reset completes ("Your password was changed"). Subject: "Your password was updated".

All four register in `registry.ts` with `previewData`.

### Triggering sends

- **Welcome**: in `src/routes/auth.tsx` (or wherever signup completes) — after the email-verified session is established for the first time, call `sendTransactionalEmail({ templateName: 'welcome', recipientEmail, idempotencyKey: 'welcome-${user.id}' })`. Use a `profiles.welcome_sent_at` flag (add via migration) to ensure once-only delivery.
- **Purchase confirmation**: in `src/routes/api/public/payments/webhook.ts` — after we record a successful purchase, send via the service-role path (a tiny internal helper in `src/server/email.server.ts` that signs in as service role and POSTs to the send route, OR replicates the enqueue logic directly using `enqueue_email` RPC). Idempotency key: `purchase-confirm-${stripe_session_id}`.
- **Course notification**: expose a `notifyCourseEvent(userId, payload)` server function for future use; not auto-wired to a UI trigger yet (admin will trigger it). 
- **Password reset followup**: hooked into the auth state change in `src/routes/auth.tsx` — when the user updates their password successfully via the recovery flow.

## 5. Branded auth + app templates

Update existing six auth templates AND the four new app templates to share a common look:
- White body background (`#ffffff`)
- Centered MLP logo at the top (62px), referenced as `https://heart-pattern-decoder.lovable.app/mlp-logo.png`
- Heading: serif, black
- Body: 14px, dark grey (`#55575d`)
- Buttons: black bg, white text, 8px radius
- Footer: small, grey, "My Love Pattern · mylovepattern.com"

Refactor by adding a small shared `src/lib/email-templates/_layout.tsx` that exports `<EmailLayout>` (header with logo + footer), then wrap each template with it.

## 6. Email delivery admin dashboard

### Admin role

Add admin role infrastructure (none exists today):
- Migration: create `app_role` enum (`admin`, `user`), `user_roles` table, `has_role(uuid, app_role)` SECURITY DEFINER function, RLS so users can read only their own roles, admins can read all.
- Seed: leave empty; user grants themselves admin via SQL (we'll provide the one-line snippet in chat).

### Route

`src/routes/app.admin.emails.tsx` (under the existing `/app` layout so it inherits the auth gate). On mount:
- Verify `has_role(user, 'admin')`. If not admin, redirect to `/app`.
- Server function `getEmailDeliveryStats(range, template, status)` queries `email_send_log` with the deduplication pattern from the dashboard guide (`DISTINCT ON (message_id) ... ORDER BY message_id, created_at DESC`).
- UI:
  - Stat cards: total, sent, failed, suppressed
  - Filters: time range presets (24h / 7d / 30d / custom), template multi-select, status select
  - Table: paginated 50/page, columns Template / Recipient / Status badge / Timestamp / Error
  - Color-coded status badges (green sent, red dlq/failed, yellow suppressed)

Add a small "Admin" link in the app header (only visible when `has_role` returns true).

## 7. Unsubscribe page

Create `src/routes/unsubscribe.tsx` — branded page that:
1. Reads `?token=` query param
2. GET `/email/unsubscribe?token=...` to validate
3. Shows confirm button -> POST to same endpoint
4. Displays success / already-unsubscribed / invalid states

---

## Technical notes

- `sender_domain` constant stays `notify.mylovepattern.com`; `FROM_DOMAIN` stays `mylovepattern.com`. Do not change.
- All emails go through the existing pgmq queue + `process-email-queue` cron. No direct sends.
- The Stripe webhook is unauthenticated, so it cannot use the JWT-protected send route — it will enqueue directly via the service-role Supabase client + `enqueue_email` RPC, mirroring what `auth/webhook.ts` already does.
- No new third-party dependencies. `@react-email/components` is already installed.
- No changes to `supabase/config.toml`, `client.ts`, or `types.ts`.

---

## Out of scope

- Marketing / bulk emails (newsletters) — explicitly not supported.
- File attachments (Lovable email infra doesn't support these).
- Scheduled / drip campaigns.
