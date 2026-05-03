## Goal
Make module resources feel like native in-app tools (not a download list) and move the per-module action buttons into a sticky bottom liquid-glass bar.

Scope: only `src/components/healthy-love/KitResources.tsx` and `src/routes/app.module.$slug.tsx`. No changes to storage, RLS, Stripe, auth, exercises, or signed URL logic.

---

## 1. `src/components/healthy-love/KitResources.tsx`

### Section header
- Rename heading from **"Bonus tools for this module"** → **"Your in-app tools"**.
- Keep the small "Module resources" eyebrow + the "Private to you" lock chip.

### Tool card (replace current file-style card)
Each `kit_resource` renders as a liquid-glass card with:
- Generic tool icon in a soft glass tile (no file-type icon switching — drop `iconFor` and the `Headphones`/`PlayCircle`/`BookOpen`/`FileText` differentiation).
- **Title** (resource title).
- **Short description**.
- Small tag pill: **"Guided tool"** (replaces the uppercase `file_type` pill — `file_type` is no longer rendered anywhere).
- Primary button: **"Start Tool"** (full width on mobile).
- Secondary small text under the button: **"Opens securely"** in muted white.

No "Open Tool" / "Open in new tab" wording. No "PDF" / "DOCX" labels visible.

### Click behavior — open in-app modal first
On **Start Tool** click, open an in-app modal (use existing `Dialog` from `@/components/ui/dialog`, styled with `liquid-glass-strong` to match the app):

- Modal title = resource title.
- Body = description (fallback friendly copy if null).
- Three actions stacked (or 1-row on sm+):
  1. **"Open secure original"** — fetches a fresh signed URL via `supabase.storage.from("secure-response-relationship-kit").createSignedUrl(file_path, 600)` and opens in a new tab (`noopener,noreferrer`).
  2. **"Download original"** — same signed URL flow but triggers a download (anchor with `download` attribute on the signed URL, opened in a new tab as fallback).
  3. **"Use this inside the module"** — primary CTA, labeled as an app tool (not a PDF). For now, this also opens the signed URL in a new tab, but the button copy stays app-tool framed (e.g. caption underneath: "Launches the guided tool"). No mention of file type.

All three actions reuse the existing signed URL helper. Loading + error states preserved:
- Per-action loading spinner on the clicked button.
- On signed URL failure: existing `toast.error("Couldn't open this tool. Please try again.")`.

Keep current loading state ("Loading tools…") and empty state ("No bonus tools found for this module yet.") exactly as they are.

### Removed
- `iconFor` helper and the `Headphones`, `PlayCircle`, `BookOpen`, `FileText` imports (use a single neutral icon like `Sparkles` or `Wand2` from lucide for all cards).
- Visible `file_type` pill.
- "Open Tool" / `ExternalLink` button on the card itself (action moves into modal; card CTA is "Start Tool").

---

## 2. `src/routes/app.module.$slug.tsx`

### Sticky action bar
Move the existing **"Save progress"** and **"Download my answers"** buttons out of the inline button row into a new sticky bottom bar:

- Fixed positioning: `fixed bottom-4 left-1/2 -translate-x-1/2 z-40` with safe inner max-width (`max-w-3xl w-[calc(100%-1.5rem)]`).
- `liquid-glass` rounded-full container, padded, flex row with the two buttons.
- Order: `Save progress` (ghost glass) · `Download my answers` (ghost glass).
- Saving spinner indicator preserved (reuses existing `savingId` UX is per-exercise, no change there).

### "Mark module complete" button
Stays in the inline section at the bottom of the page (it's a milestone action, not an always-on utility). Add bottom padding (`pb-28`) to the page container so the sticky bar never overlaps the complete CTA or the kit resources.

No other layout, copy, or behavioral changes on the module page.

---

## Technical notes
- Reuse `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogFooter` from `@/components/ui/dialog`.
- State additions in `KitResources`: `activeResource: KitResource | null`, `actionLoading: "open" | "download" | "use" | null`.
- Single `getSignedUrl(r)` helper inside the component to dedupe the three action handlers.
- Download action: create signed URL, then `const a = document.createElement("a"); a.href = url; a.download = ""; a.rel = "noopener noreferrer"; a.target = "_blank"; a.click();`.
- No changes to `kit_resources` schema, bucket, or RLS.
- No changes to `app.module.$slug.tsx` data flow, exercises, PDF export, or completion logic.
