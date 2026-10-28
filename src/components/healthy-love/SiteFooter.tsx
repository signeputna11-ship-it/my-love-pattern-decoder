import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";

const SIGNE_MAILTO =
  "https://calendly.com/mylovepattern/30min";

type PatternSlug =
  | "/the-over-investor"
  | "/the-unavailable-chaser"
  | "/the-validator-seeker"
  | "/the-boundary-softener";

const PATTERN_LABELS: Record<PatternSlug, string> = {
  "/the-over-investor": "The Over-Investor",
  "/the-unavailable-chaser": "The Unavailable Chaser",
  "/the-validator-seeker": "The Validator Seeker",
  "/the-boundary-softener": "The Boundary Softener",
};

export function SiteFooter({ relatedPattern }: { relatedPattern?: PatternSlug } = {}) {
  return (
    <footer className="mt-16 border-t border-border bg-transparent">
      {relatedPattern && (
        <section className="border-b border-border bg-accent/40">
          <div className="mx-auto max-w-6xl px-6 py-6 text-sm">
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Related pattern
            </span>
            <Link
              to={relatedPattern}
              className="ml-3 inline-flex items-center gap-1 text-foreground underline underline-offset-4"
            >
              Read about {PATTERN_LABELS[relatedPattern]} →
            </Link>
          </div>
        </section>
      )}
      {/* Dual CTA preview */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-5 md:grid-cols-2">
          {/* Take the quiz */}
          <div className="rounded-2xl border border-border bg-card p-8">
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              60 seconds, free
            </p>
            <h3 className="mt-3 font-serif text-2xl text-foreground sm:text-3xl">
              Find your love pattern
            </h3>
            <p className="mt-3 text-sm text-muted-foreground">
              Four questions. One clear answer about why your relationships keep ending the same way.
            </p>
            <Link
              to="/home"
              hash="diagnosis"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Take the quiz <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Book Signe */}
          <div className="rounded-2xl border border-border bg-foreground p-8 text-background">
            <p className="font-mono text-[10px] uppercase tracking-widest text-background/60">
              1:1 with Signe
            </p>
            <h3 className="mt-3 font-serif text-2xl sm:text-3xl">
              Book a Deep Pattern Reset
            </h3>
            <p className="mt-3 text-sm text-background/75">
              A private 90-minute session to reset the pattern at the level it actually lives. Includes a personalised 21-day audio meditation.
            </p>
            <a
              href={SIGNE_MAILTO} target="_blank" rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#FFFCF8] px-5 py-3 text-sm font-semibold text-foreground hover:opacity-90"
            >
              Email Signe <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Sitemap nav */}
      <div className="border-t border-border">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 py-12 sm:grid-cols-3">
          <div>
            <p className="font-serif text-lg text-foreground">My Love Pattern</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Understand why it keeps happening, and choose differently.
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Explore</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link to="/home" className="text-foreground hover:underline">Home</Link></li>
              <li><Link to="/deep-reset" className="text-foreground hover:underline">About</Link></li>
              <li><Link to="/blog" className="text-foreground hover:underline">Blog</Link></li>
              <li><Link to="/home" hash="diagnosis" className="text-foreground hover:underline">Take the quiz</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">The four patterns</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link to="/the-over-investor" className="text-foreground hover:underline">The Over-Investor</Link></li>
              <li><Link to="/the-unavailable-chaser" className="text-foreground hover:underline">The Unavailable Chaser</Link></li>
              <li><Link to="/the-validator-seeker" className="text-foreground hover:underline">The Validator Seeker</Link></li>
              <li><Link to="/the-boundary-softener" className="text-foreground hover:underline">The Boundary Softener</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border">
          <p className="mx-auto max-w-6xl px-6 py-6 text-xs text-muted-foreground">
            © {new Date().getFullYear()} My Love Pattern. Created by Signe Putna.
          </p>
        </div>
      </div>
    </footer>
  );
}
