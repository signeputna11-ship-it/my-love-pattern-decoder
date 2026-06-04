import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X, ChevronDown } from "lucide-react";
import mlpLogo from "@/assets/mlp-logo.png";

const PATTERN_LINKS = [
  { label: "The Over-Investor", to: "/the-over-investor" as const },
  { label: "The Unavailable Chaser", to: "/the-unavailable-chaser" as const },
  { label: "The Validator Seeker", to: "/the-validator-seeker" as const },
  { label: "The Boundary Softener", to: "/the-boundary-softener" as const },
];

export function SiteNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link to="/home" className="flex items-center gap-2 text-foreground">
          <span className="grid h-8 w-8 place-items-center overflow-hidden rounded-full bg-black">
            <img src={mlpLogo} alt="My Love Pattern" className="h-full w-full object-contain" />
          </span>
          <span className="font-serif text-base sm:text-lg">My Love Pattern</span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          <Link to="/home" className="text-sm text-muted-foreground hover:text-foreground" activeOptions={{ exact: true }} activeProps={{ className: "text-sm text-foreground font-medium" }}>
            Home
          </Link>
          <Link to="/shop" className="text-sm text-muted-foreground hover:text-foreground" activeProps={{ className: "text-sm text-foreground font-medium" }}>
            Shop
          </Link>
          <Link to="/deep-reset" className="text-sm text-muted-foreground hover:text-foreground" activeProps={{ className: "text-sm text-foreground font-medium" }}>
            Deep Reset
          </Link>
          <Link to="/blog" className="text-sm text-muted-foreground hover:text-foreground" activeProps={{ className: "text-sm text-foreground font-medium" }}>
            Blog
          </Link>
          <div className="relative group">
            <button className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
              Patterns <ChevronDown className="h-3.5 w-3.5" />
            </button>
            <div className="absolute right-0 top-full hidden min-w-[240px] pt-2 group-hover:block">
              <div className="rounded-lg border border-border bg-popover p-2 shadow-md">
                {PATTERN_LINKS.map((p) => (
                  <Link
                    key={p.to}
                    to={p.to}
                    className="block rounded-md px-3 py-2 text-sm text-foreground hover:bg-accent"
                  >
                    {p.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </nav>


        <Link
          to="/home"
          hash="diagnosis"
          className="hidden rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 md:inline-flex"
        >
          Take the quiz
        </Link>

        <button
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          className="grid h-9 w-9 place-items-center rounded-md text-foreground md:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <div className="mx-auto max-w-6xl px-4 py-2">
            <Link to="/home" onClick={() => setOpen(false)} className="block rounded-md px-3 py-3 text-sm text-foreground">Home</Link>
            <Link to="/shop" onClick={() => setOpen(false)} className="block rounded-md px-3 py-3 text-sm text-foreground">Shop</Link>
            <Link to="/deep-reset" onClick={() => setOpen(false)} className="block rounded-md px-3 py-3 text-sm text-foreground">Deep Reset</Link>
            <Link to="/blog" onClick={() => setOpen(false)} className="block rounded-md px-3 py-3 text-sm text-foreground">Blog</Link>

            <p className="mt-2 px-3 pt-2 text-[10px] uppercase tracking-widest text-muted-foreground">Patterns</p>
            {PATTERN_LINKS.map((p) => (
              <Link key={p.to} to={p.to} onClick={() => setOpen(false)} className="block rounded-md px-3 py-3 text-sm text-foreground">
                {p.label}
              </Link>
            ))}
            <Link
              to="/home"
              hash="diagnosis"
              onClick={() => setOpen(false)}
              className="mt-2 block rounded-full bg-primary px-4 py-3 text-center text-sm font-semibold text-primary-foreground"
            >
              Take the quiz
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
