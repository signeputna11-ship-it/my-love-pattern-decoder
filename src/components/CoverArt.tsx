import { Headphones } from "lucide-react";
import type { ReactNode } from "react";

// Graphic cards in the Signe Coach palette: one line illustration per theme, set on a soft wash.
// Palette: paper #FFFCF8, forest #173D34, rose #E8BAC9, blush #F4D9E2, powder #BBDCF0, butter #F3E4A2, leaf #B9CBB1.
const INK = "#173D34";

type Theme = { from: string; to: string; accent: string };
const THEMES: Record<string, Theme> = {
  vortex: { from: "#BBDCF0", to: "#B9CBB1", accent: "#F3E4A2" },
  rain: { from: "#F4D9E2", to: "#BBDCF0", accent: "#FFFCF8" },
  waves: { from: "#BBDCF0", to: "#FFFCF8", accent: "#F3E4A2" },
  money: { from: "#F3E4A2", to: "#B9CBB1", accent: "#E8BAC9" },
  business: { from: "#B9CBB1", to: "#BBDCF0", accent: "#F3E4A2" },
  focus: { from: "#BBDCF0", to: "#F4D9E2", accent: "#FFFCF8" },
  manifest: { from: "#E8BAC9", to: "#BBDCF0", accent: "#F3E4A2" },
  love: { from: "#F4D9E2", to: "#E8BAC9", accent: "#FFFCF8" },
  purpose: { from: "#F3E4A2", to: "#BBDCF0", accent: "#E8BAC9" },
  sunrise: { from: "#F3E4A2", to: "#E8BAC9", accent: "#FFFCF8" },
  loop: { from: "#BBDCF0", to: "#B9CBB1", accent: "#E8BAC9" },
  ripple: { from: "#BBDCF0", to: "#F4D9E2", accent: "#FFFCF8" },
  gem: { from: "#E8BAC9", to: "#F4D9E2", accent: "#BBDCF0" },
  boundary: { from: "#B9CBB1", to: "#FFFCF8", accent: "#E8BAC9" },
  fork: { from: "#BBDCF0", to: "#F3E4A2", accent: "#E8BAC9" },
};

const KEY_BY_SLUG: Record<string, keyof typeof THEMES> = {
  "healing-vortex": "vortex",
  "total-relaxation": "rain",
  "start-calm": "waves",
  "wealth-made-easy": "money",
  "money-reframe": "money",
  "purpose-direction": "purpose",
  "beats-deep-focus": "focus",
  "beats-money-mindset": "money",
  "beats-business-flow": "business",
  "beats-manifesting": "manifest",
  "beats-love-heart": "love",
  "beats-purpose-clarity": "purpose",
  "beats-calm-release": "rain",
  "beats-deep-rest": "waves",
  "beats-inspiration": "sunrise",
  "beats-motivation": "sunrise",
  "see-the-pattern": "loop",
  "calm-the-trigger": "ripple",
  "rebuild-self-worth": "gem",
  "set-the-boundary": "boundary",
  "decide-differently": "fork",
};
const FALLBACK: (keyof typeof THEMES)[] = ["loop", "waves", "focus", "gem", "sunrise", "ripple"];

function keyFor(slug: string): keyof typeof THEMES {
  if (KEY_BY_SLUG[slug]) return KEY_BY_SLUG[slug];
  let h = 0;
  for (const c of slug) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return FALLBACK[h % FALLBACK.length];
}

const line = { fill: "none", stroke: INK, strokeWidth: 1.4, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

function spiral(offset: number, scale: number) {
  const pts: string[] = [];
  for (let a = 0; a <= 6 * Math.PI; a += 0.12) {
    const r = 5 + scale * a;
    pts.push(`${(100 + r * Math.cos(a + offset)).toFixed(1)},${(100 + r * Math.sin(a + offset)).toFixed(1)}`);
  }
  return "M" + pts.join(" L");
}

function Art({ k, t }: { k: keyof typeof THEMES; t: Theme }): ReactNode {
  switch (k) {
    case "vortex":
      return (
        <g>
          <circle cx="100" cy="100" r="86" fill={t.accent} opacity="0.35" />
          <path d={spiral(0, 4.5)} {...line} opacity="0.85" />
          <path d={spiral(Math.PI, 4.5)} {...line} opacity="0.4" />
          <circle cx="100" cy="100" r="5" fill={INK} />
        </g>
      );
    case "waves":
      return (
        <g>
          <circle cx="138" cy="52" r="28" fill={t.accent} opacity="0.9" />
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const y = 88 + i * 17;
            return (
              <path key={i} d={`M10 ${y} Q 35 ${y - 11} 60 ${y} T 110 ${y} T 160 ${y} T 210 ${y}`} {...line} opacity={0.9 - i * 0.13} />
            );
          })}
        </g>
      );
    case "rain":
      return (
        <g>
          <path d="M45 78 C45 58 70 52 80 66 C88 48 120 50 124 72 C146 72 152 96 132 100 L56 100 C38 100 34 82 45 78Z" fill={t.accent} opacity="0.75" {...{ stroke: INK, strokeWidth: 1.3 }} />
          {Array.from({ length: 11 }, (_, i) => (
            <line key={i} x1={44 + i * 11} y1={112 + (i % 3) * 8} x2={40 + i * 11} y2={132 + (i % 3) * 8} {...line} opacity="0.7" />
          ))}
          {[22, 40, 58].map((rx, i) => (
            <ellipse key={rx} cx="100" cy="168" rx={rx} ry={rx / 4} {...line} opacity={0.8 - i * 0.2} />
          ))}
        </g>
      );
    case "money":
      return (
        <g>
          <circle cx="118" cy="96" r="58" fill={t.accent} opacity="0.45" />
          <circle cx="118" cy="96" r="58" {...line} opacity="0.8" />
          <circle cx="118" cy="96" r="46" {...line} opacity="0.35" />
          <text x="118" y="112" textAnchor="middle" fontSize="48" fontStyle="italic" fill={INK} style={{ fontFamily: "Georgia, serif" }}>€</text>
          <path d="M14 172 C 50 164 70 140 96 128 S 150 120 186 70" {...line} strokeWidth="1.8" />
          {[[14, 172], [64, 150], [114, 126], [150, 112], [186, 70]].map(([x, y]) => (
            <circle key={x} cx={x} cy={y} r="4" fill={INK} />
          ))}
        </g>
      );
    case "business":
      return (
        <g>
          {[34, 56, 78, 100, 124].map((h, i) => (
            <rect key={i} x={26 + i * 32} y={172 - h} width="22" height={h} rx="3" fill={i === 4 ? t.accent : INK} opacity={i === 4 ? 0.95 : 0.12 + i * 0.1} stroke={INK} strokeWidth="1.2" />
          ))}
          <path d="M30 120 L 90 96 L 130 70 L 176 34" {...line} strokeWidth="1.8" />
          <path d="M162 32 L 178 32 L 178 48" {...line} strokeWidth="1.8" />
        </g>
      );
    case "focus":
      return (
        <g>
          {[78, 58, 38, 18].map((r, i) => (
            <circle key={r} cx="100" cy="100" r={r} {...line} opacity={0.35 + i * 0.18} />
          ))}
          <circle cx="100" cy="100" r="58" fill={t.accent} opacity="0.35" />
          <line x1="100" y1="10" x2="100" y2="190" {...line} opacity="0.4" />
          <line x1="10" y1="100" x2="190" y2="100" {...line} opacity="0.4" />
          <circle cx="100" cy="100" r="6" fill={INK} />
        </g>
      );
    case "manifest": {
      const pts: [number, number][] = [[40, 150], [66, 100], [104, 118], [132, 70], [168, 54], [158, 120]];
      return (
        <g>
          <path d="M130 30 A44 44 0 1 0 170 106 A34 34 0 1 1 130 30Z" fill={t.accent} opacity="0.9" />
          <polyline points={pts.map((p) => p.join(",")).join(" ")} {...line} opacity="0.55" strokeDasharray="3 5" />
          {pts.map(([x, y], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r={i === 3 ? 6 : 3.6} fill={INK} />
              <circle cx={x} cy={y} r={i === 3 ? 12 : 8} {...line} opacity="0.3" />
            </g>
          ))}
        </g>
      );
    }
    case "love":
      return (
        <g>
          <circle cx="78" cy="100" r="48" {...line} opacity="0.8" />
          <circle cx="122" cy="100" r="48" {...line} opacity="0.8" />
          <path d="M100 138 C 66 112 66 80 86 78 C 95 77 100 84 100 90 C 100 84 105 77 114 78 C 134 80 134 112 100 138Z" fill={t.accent} stroke={INK} strokeWidth="1.4" />
        </g>
      );
    case "purpose":
      return (
        <g>
          <circle cx="100" cy="100" r="76" {...line} opacity="0.8" />
          <circle cx="100" cy="100" r="62" fill={t.accent} opacity="0.4" />
          {Array.from({ length: 24 }, (_, i) => {
            const a = (i * 15 * Math.PI) / 180;
            const long = i % 6 === 0;
            const r1 = long ? 56 : 66;
            return <line key={i} x1={100 + 76 * Math.cos(a)} y1={100 + 76 * Math.sin(a)} x2={100 + r1 * Math.cos(a)} y2={100 + r1 * Math.sin(a)} {...line} opacity={long ? 0.9 : 0.4} />;
          })}
          <g transform="rotate(38 100 100)">
            <polygon points="100,34 112,100 100,166 88,100" fill={INK} opacity="0.12" stroke={INK} strokeWidth="1.3" />
            <polygon points="100,34 112,100 88,100" fill={INK} />
          </g>
          <circle cx="100" cy="100" r="5" fill={t.accent} stroke={INK} strokeWidth="1.3" />
        </g>
      );
    case "sunrise":
      return (
        <g>
          <path d="M52 134 A48 48 0 0 1 148 134Z" fill={t.accent} opacity="0.95" stroke={INK} strokeWidth="1.3" />
          {Array.from({ length: 11 }, (_, i) => {
            const a = Math.PI + (i * Math.PI) / 10;
            return <line key={i} x1={100 + 62 * Math.cos(a)} y1={134 + 62 * Math.sin(a)} x2={100 + 86 * Math.cos(a)} y2={134 + 86 * Math.sin(a)} {...line} opacity="0.75" />;
          })}
          {[134, 148, 162, 176].map((y, i) => (
            <line key={y} x1={20 + i * 10} y1={y} x2={180 - i * 10} y2={y} {...line} opacity={0.8 - i * 0.18} />
          ))}
        </g>
      );
    case "loop":
      return (
        <g>
          <path d="M34 100 C34 56 90 56 100 100 C110 144 166 144 166 100 C166 56 110 56 100 100 C90 144 34 144 34 100Z" fill={t.accent} opacity="0.3" />
          <path d="M34 100 C34 56 90 56 100 100 C110 144 166 144 166 100 C166 56 110 56 100 100 C90 144 34 144 34 100Z" {...line} strokeWidth="1.8" />
          <circle cx="166" cy="100" r="5" fill={INK} />
          <path d="M156 88 L 166 100 L 176 88" {...line} />
        </g>
      );
    case "ripple":
      return (
        <g>
          {[78, 60, 42, 24].map((r, i) => (
            <circle key={r} cx="100" cy="100" r={r} {...line} opacity={0.3 + i * 0.2} />
          ))}
          <circle cx="100" cy="100" r="42" fill={t.accent} opacity="0.5" />
          <circle cx="100" cy="100" r="6" fill={INK} />
        </g>
      );
    case "gem":
      return (
        <g>
          <polygon points="60,78 80,50 120,50 140,78 100,152" fill={t.accent} opacity="0.7" />
          <polygon points="60,78 80,50 120,50 140,78 100,152" {...line} strokeWidth="1.8" />
          <path d="M60 78 H140 M80 50 L90 78 L100 152 M120 50 L110 78 L100 152 M90 78 L110 78" {...line} opacity="0.7" />
          <path d="M100 30 V40 M62 38 L68 46 M138 38 L132 46" {...line} opacity="0.6" />
        </g>
      );
    case "boundary":
      return (
        <g>
          <line x1="100" y1="22" x2="100" y2="80" {...line} strokeWidth="3" />
          <line x1="100" y1="120" x2="100" y2="178" {...line} strokeWidth="3" />
          <path d="M100 120 A40 40 0 0 1 140 160" {...line} strokeDasharray="3 4" opacity="0.6" />
          <circle cx="52" cy="100" r="14" fill={t.accent} stroke={INK} strokeWidth="1.4" />
          <path d="M66 100 H 90" {...line} />
          <path d="M84 94 L 92 100 L 84 106" {...line} />
          <rect x="122" y="92" width="26" height="16" rx="3" {...line} opacity="0.5" />
        </g>
      );
    case "fork":
      return (
        <g>
          <path d="M100 176 V118 L56 62" {...line} strokeWidth="1.6" opacity="0.5" />
          <path d="M100 118 L144 56" {...line} strokeWidth="2.6" />
          <circle cx="100" cy="176" r="6" fill={INK} />
          <circle cx="56" cy="62" r="7" {...line} opacity="0.6" />
          <circle cx="144" cy="56" r="10" fill={t.accent} stroke={INK} strokeWidth="1.4" />
          <path d="M136 50 L 144 44 L 152 50" {...line} />
        </g>
      );
  }
}

/** Small square used on the dashboard cards. */
export function CoverArt({ slug, className = "" }: { slug: string; className?: string }) {
  const k = keyFor(slug);
  const t = THEMES[k];
  return (
    <div
      aria-hidden
      className={`relative overflow-hidden ring-1 ring-inset ring-white/70 ${className}`}
      style={{ background: `linear-gradient(135deg, ${t.from}, ${t.to})` }}
    >
      <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full p-1.5">
        <Art k={k} t={t} />
      </svg>
    </div>
  );
}

/** The card above an audio: says what it is, how long, and how to listen. */
export function CoverHero({
  slug,
  title,
  subtitle,
  label,
  minutes,
}: {
  slug: string;
  title: string;
  subtitle?: string | null;
  label: string;
  minutes?: number | null;
}) {
  const k = keyFor(slug);
  const t = THEMES[k];
  return (
    <div
      className="relative mb-4 overflow-hidden rounded-3xl ring-1 ring-inset ring-white/70"
      style={{ background: `linear-gradient(120deg, ${t.from}, ${t.to})` }}
    >
      <svg viewBox="0 0 200 200" preserveAspectRatio="xMidYMid meet" className="absolute -right-4 top-1/2 h-[120%] w-auto -translate-y-1/2 sm:right-4">
        <Art k={k} t={t} />
      </svg>
      <div className="relative z-10 flex min-h-[190px] max-w-[68%] flex-col justify-between p-5 sm:min-h-[210px] sm:max-w-[60%] sm:p-7">
        <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-[#173D34]/70">{label}</p>
        <div>
          <h2 className="font-serif text-[28px] italic leading-[1.05] text-[#173D34] sm:text-4xl">{title}</h2>
          {subtitle && <p className="mt-2 text-xs leading-snug text-[#173D34]/75 sm:text-sm">{subtitle}</p>}
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-[#173D34]/70">
          {minutes ? <span>{minutes} min</span> : null}
          <span className="inline-flex items-center gap-1">
            <Headphones className="h-3.5 w-3.5" /> Best with headphones
          </span>
          <span className="ml-auto font-serif italic">Signe Coach</span>
        </div>
      </div>
    </div>
  );
}
