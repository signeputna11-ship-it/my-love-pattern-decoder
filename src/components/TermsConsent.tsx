import { Link } from "@tanstack/react-router";

export function TermsConsent({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  const link = "underline underline-offset-2 hover:text-foreground";
  return (
    <label className="flex cursor-pointer items-start gap-3 text-left text-xs leading-relaxed text-foreground/70">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--primary)]"
      />
      <span>
        I am 18 or over and I agree to the{" "}
        <Link to="/terms" target="_blank" className={link}>Terms</Link>, the{" "}
        <Link to="/privacy" target="_blank" className={link}>Privacy Policy</Link> and the{" "}
        <Link to="/refunds" target="_blank" className={link}>Refund Policy</Link>. I understand that paid memberships and digital
        content are non-refundable once access begins.
      </span>
    </label>
  );
}
