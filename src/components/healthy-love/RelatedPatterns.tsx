import { Link } from "@tanstack/react-router";

const ALL_PATTERNS = [
  { slug: "/the-over-investor", label: "The Over-Investor", blurb: "You give everything before anything is established." },
  { slug: "/the-unavailable-chaser", label: "The Unavailable Chaser", blurb: "Distance feels like desire. Availability feels flat." },
  { slug: "/the-validator-seeker", label: "The Validator Seeker", blurb: "One unanswered message shifts your entire nervous system." },
  { slug: "/the-boundary-softener", label: "The Boundary Softener", blurb: "You know your standards until you like someone." },
] as const;

export function RelatedPatterns({ currentSlug }: { currentSlug: string }) {
  const others = ALL_PATTERNS.filter((p) => p.slug !== currentSlug);
  return (
    <section className="mt-20 border-t border-border pt-12">
      <h2 className="font-serif text-3xl text-foreground">The other three patterns</h2>
      <p className="mt-2 text-muted-foreground">
        Most women see themselves in more than one. Read the rest, then take the quiz to confirm your dominant pattern.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {others.map((p) => (
          <Link
            key={p.slug}
            to={p.slug}
            className="block rounded-lg border border-border p-5 transition-colors hover:bg-accent"
          >
            <h3 className="font-serif text-lg text-foreground">{p.label}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{p.blurb}</p>
          </Link>
        ))}
      </div>
      <div className="mt-8">
        <Link to="/" className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          Take the 60-second quiz
        </Link>
      </div>
    </section>
  );
}
