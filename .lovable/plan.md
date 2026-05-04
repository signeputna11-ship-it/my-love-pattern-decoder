## Two separate issues

### 1. The "Love Language Insights" text on the Google sign-in screen

That screen is Google's OAuth consent screen. The app name shown there ("Love Language Insights") is **not stored in this codebase** — it's configured in **Google Cloud Console** under the OAuth consent screen for the OAuth client used by Lovable Cloud auth. I can't change it from code.

**You will need to update it manually:**
- Go to Google Cloud Console → APIs & Services → OAuth consent screen
- Change **App name** from "Love Language Insights" to **My Love Pattern**
- Update the app logo, support email, and homepage URL (https://mylovepattern.com) while you're there
- Save. The new name appears on the consent screen immediately.

I'll add a short note in the code where Google OAuth is initiated so future-you remembers where the name lives.

### 2. Stale "heart-pattern-decoder" branding in the code

Found these leftover references from the old project name. None of them are user-visible on the marketing site, but they leak into emails and the email logo URL:

- `src/lib/email-templates/_layout.tsx` — logo image URL points to `heart-pattern-decoder.lovable.app/mlp-logo.png`
- `src/routes/lovable/email/auth/webhook.ts` — `SITE_NAME = "heart-pattern-decoder"` (used as the email "from" name and inside templates)
- `src/routes/lovable/email/auth/preview.ts` — same `SITE_NAME` plus a sample URL
- `src/routes/lovable/email/transactional/send.ts` — same `SITE_NAME`

## Changes

1. **`_layout.tsx`** — change `LOGO_URL` to `https://mylovepattern.com/mlp-logo.png`. (The logo file already exists in `public/mlp-logo.png` and serves from the custom domain.)
2. **`webhook.ts`, `preview.ts`, `send.ts`** — change `SITE_NAME` from `"heart-pattern-decoder"` to `"My Love Pattern"`.
3. **`preview.ts`** — change `SAMPLE_PROJECT_URL` to `https://mylovepattern.com`.
4. Quick re-scan after edits to confirm no other instances of "heart-pattern-decoder", "Love Language", or "Insights" remain in code.

## What you need to do (outside Lovable)

- Update the Google OAuth consent screen app name to **My Love Pattern** in Google Cloud Console (instructions above). This is the only fix for the screenshot you shared.
