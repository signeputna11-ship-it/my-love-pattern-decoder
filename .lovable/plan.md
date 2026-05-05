## Goal

Change the email signature line from "With love," to "Warm regards," across all transactional and auth emails.

## Change

### `src/lib/email-templates/_layout.tsx`

Update the `signatureSection` text:
- Line "With love," → "Warm regards,"
- Keep everything else identical: name (Signe Putna), role (Founder, My Love Pattern), links (mylovepattern.com, hello@mylovepattern.com), and the note (Private sessions available on request).

This single edit propagates to every email that uses `EmailLayout` (welcome, purchase confirmation, course notification, password reset, magic link, signup, invite, recovery, email change, reauthentication).

## Out of scope

- No styling changes.
- No changes to logo, footer, or per-template content.
- No changes to auth-email-hook templates if they exist separately under `supabase/functions/_shared/email-templates/` (none currently scaffolded based on file listing).
