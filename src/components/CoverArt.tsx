// Soft cover art in the Signe Coach palette: layered gradients, no photos, no motion.
const PALETTES: Record<string, [string, string, string]> = {
  // [base start, base end, glow]
  "healing-vortex": ["#BBDCF0", "#B9CBB1", "#F3E4A2"],
  "total-relaxation": ["#F4D9E2", "#BBDCF0", "#FFFCF8"],
  "start-calm": ["#F3E4A2", "#B9CBB1", "#FFFCF8"],
  "money-reframe": ["#F3E4A2", "#E8BAC9", "#FFFCF8"],
  "purpose-direction": ["#BBDCF0", "#E8BAC9", "#F3E4A2"],
};
const FALLBACK: [string, string, string][] = [
  ["#E8BAC9", "#BBDCF0", "#FFFCF8"],
  ["#B9CBB1", "#F3E4A2", "#FFFCF8"],
  ["#BBDCF0", "#F4D9E2", "#F3E4A2"],
  ["#F4D9E2", "#B9CBB1", "#FFFCF8"],
];

function paletteFor(slug: string) {
  if (PALETTES[slug]) return PALETTES[slug];
  let h = 0;
  for (const c of slug) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return FALLBACK[h % FALLBACK.length];
}

export function CoverArt({ slug, className = "" }: { slug: string; className?: string }) {
  const [a, b, glow] = paletteFor(slug);
  return (
    <div
      aria-hidden
      className={`relative overflow-hidden ring-1 ring-inset ring-white/70 ${className}`}
      style={{
        background: `radial-gradient(60% 80% at 25% 20%, ${glow}cc 0%, transparent 70%), radial-gradient(50% 70% at 80% 85%, ${glow}99 0%, transparent 70%), linear-gradient(135deg, ${a}, ${b})`,
      }}
    >
      <span
        className="absolute inset-[12%] rounded-full border border-white/60"
        style={{ boxShadow: "inset 0 0 40px rgba(255,255,255,0.35)" }}
      />
      <span className="absolute inset-[28%] rounded-full border border-white/50" />
    </div>
  );
}
