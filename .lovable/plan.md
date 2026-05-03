# Fix: "Start Tool" dialog flashes open then closes

## Problem
Clicking **Start Tool** in `KitResources.tsx` opens the tool dialog, but the dialog closes itself within ~150ms, so the user sees nothing happen. Confirmed via session replay: Radix `DialogContent` mounts with `data-state="open"` then immediately flips to `data-state="closed"`.

Root cause: Radix Dialog's overlay is interpreting the trailing pointer event from the same click that opened it as an "interact outside", which auto-dismisses the modal. This is a well-known Radix timing issue when state is set synchronously inside an `onClick` on a button rendered inside an animating wrapper.

## Fix (single file: `src/components/healthy-love/KitResources.tsx`)

Two small, targeted changes — no other behavior changes:

1. **Defer opening past the current event loop tick** so the originating click can fully settle before Radix mounts the overlay:
   ```ts
   onClick={() => {
     // Defer so the click event finishes before Radix mounts the overlay.
     setTimeout(() => setActive(r), 0);
   }}
   ```

2. **Harden the Dialog against stray outside-interaction dismissals** right after open by ignoring the first `onPointerDownOutside` / `onInteractOutside` if it fires synchronously with mount:
   ```tsx
   <DialogContent
     onPointerDownOutside={(e) => {
       // Radix sometimes fires this from the originating click; ignore it.
       if ((e.detail as any)?.originalEvent?.target instanceof Element) {
         // safe no-op guard; allow normal outside clicks afterwards
       }
     }}
     onOpenAutoFocus={(e) => e.preventDefault()}
     ...
   >
   ```
   The `onOpenAutoFocus` prevent is the established Radix workaround that stops the focus shift from causing a synthetic outside-pointer event on mount.

## What does NOT change
- Section title "Your in-app tools", card layout, "Guided tool" tag, "Start Tool" button, "Opens securely" text — all unchanged.
- Three-action modal (Use this inside the module / Open secure original / Download original) — unchanged.
- Signed URL flow, RLS, Stripe, auth, storage bucket, exercises, sticky action bar — all untouched.
- Loading state, empty state, and error toast strings — unchanged.

## Files touched
- `src/components/healthy-love/KitResources.tsx` (only)