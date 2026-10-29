import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { FrontFooter, FrontNav } from "@/components/front/FrontShell";
import { TERMS_VERSION } from "@/lib/legal";

export function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="min-h-screen text-foreground">
      <FrontNav />
      <main className="mx-auto max-w-3xl px-5 pt-12 sm:px-8">
        <h1 className="font-serif text-4xl sm:text-5xl">{title}</h1>
        <p className="mt-2 text-xs uppercase tracking-widest text-foreground/50">Version {TERMS_VERSION}</p>
        <div className="mt-8 space-y-4 text-sm leading-relaxed text-foreground/80 [&_h2]:mt-8 [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:text-foreground [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5">
          {children}
        </div>
        <nav className="mt-12 flex flex-wrap gap-4 text-xs uppercase tracking-widest text-foreground/60">
          <Link to="/terms" className="hover:text-foreground">Terms</Link>
          <Link to="/privacy" className="hover:text-foreground">Privacy</Link>
          <Link to="/refunds" className="hover:text-foreground">Refunds</Link>
        </nav>
      </main>
      <FrontFooter />
    </div>
  );
}
