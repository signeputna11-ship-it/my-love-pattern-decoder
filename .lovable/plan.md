## Goal

The fresh auth email templates were scaffolded but (a) have a build error and (b) lost the My Love Pattern branding. Fix both.

## Changes

### 1. Fix build errors (`renderAsync` no longer exists)

In current `@react-email/components`, `renderAsync` was removed — `render` is now async. Replace in 2 files:

- `src/routes/lovable/email/auth/webhook.ts` — change `renderAsync` import + 2 call sites to `render`
- `src/routes/lovable/email/auth/preview.ts` — change `renderAsync` import + 1 call site to `render`

### 2. Rebrand all 6 auth email templates

The existing brand layout already lives at `src/lib/email-templates/_layout.tsx` (white bg, MLP circular logo at top, Georgia serif headings, black pill buttons, "With love, Signe Putna · Founder, My Love Pattern" signature block).

Rewrite each template to use `EmailLayout` + the shared `styles` from `_layout.tsx`, keeping the existing prop signatures (so the webhook keeps working) and the existing copy intent:

- **`signup.tsx`** — "Confirm your email" heading, intro mentioning the site, Verify Email button, ignore-if-not-you footer.
- **`magic-link.tsx`** — "Your sign-in link" heading, Sign In button, expires-shortly footer.
- **`recovery.tsx`** — "Reset your password" heading, Reset Password button, ignore-if-not-you footer.
- **`invite.tsx`** — "You've been invited" heading, Accept Invitation button.
- **`email-change.tsx`** — "Confirm your email change" heading, shows old → new email, Confirm Email Change button, security warning footer.
- **`reauthentication.tsx`** — "Your verification code" heading, large code block (using `styles.code`), expires-shortly footer.

All templates remain default-exported and named-exported with the same names the webhook imports (`SignupEmail`, `MagicLinkEmail`, `RecoveryEmail`, `InviteEmail`, `EmailChangeEmail`, `ReauthenticationEmail`) and accept the same prop shapes the webhook passes.

### 3. No infrastructure changes

- No npm installs (`@react-email/components` is already present)
- No vite.config.ts changes (already configured from prior scaffolding run)
- No middleware changes (already configured)
- Server routes auto-deploy with the app

## Verification

After approval, preview the signup template via `Cloud → Emails` to confirm the MLP logo, serif heading, and signature block render correctly. Repeat for recovery and magic-link.
