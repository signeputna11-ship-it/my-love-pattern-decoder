import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import mark from "@/assets/signe-coach-mark.png";

export function FrontNav() {
  return (
    <header className="mx-auto flex max-w-6xl items-center justify-between px-5 pt-5 sm:px-8">
      <Link to="/" className="flex items-center gap-2.5">
        <span className="grid h-9 w-9 place-items-center overflow-hidden rounded-full bg-white">
          <img src={mark} alt="Signe Coach" className="h-full w-full object-contain" />
        </span>
        <span className="font-serif text-xl italic">Signe Coach</span>
      </Link>
      <nav className="flex items-center gap-2 text-sm">
        <Link to="/auth" className="rounded-full px-4 py-2 text-foreground/70 hover:text-foreground">
          Sign in
        </Link>
        <Link to="/quiz" className="hidden rounded-full bg-primary px-5 py-2.5 font-medium text-primary-foreground sm:inline-block">
          Find my starting point
        </Link>
      </nav>
    </header>
  );
}

export function FrontFooter(): ReactNode {
  return (
    <footer className="mx-auto mt-24 max-w-6xl px-5 pb-12 text-xs leading-relaxed text-foreground/60 sm:px-8">
      <p>
        Signe Coach offers educational self-reflection, coaching and guided audio. It does not replace medical or
        mental health care. If you are in crisis, please contact your local emergency number or a helpline in your
        country.
      </p>
      <p className="mt-2">© {new Date().getFullYear()} Signe Coach</p>
    </footer>
  );
}
