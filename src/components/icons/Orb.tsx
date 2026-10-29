import type { CSSProperties } from "react";

// Signe Coach mark: two soft rings, the same shape as the glass circles on the cover art.
// Takes the same props as a lucide icon so it can stand in anywhere an icon is expected.
export function Orb({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={className}
      style={style}
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="4.5" />
    </svg>
  );
}
