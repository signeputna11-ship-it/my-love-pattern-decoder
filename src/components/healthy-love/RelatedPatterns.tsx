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
    <section style={{ marginTop: "72px", borderTop: "1px solid #E8E3DC", paddingTop: "48px" }}>
      <h2 className="italic" style={{ fontFamily: "Instrument Serif, serif", fontSize: "clamp(26px, 3.5vw, 36px)", color: "#111111" }}>
        The other three patterns
      </h2>
      <p style={{ marginTop: "12px", fontFamily: "Inter, sans-serif", fontSize: "16px", color: "#6b4c44", lineHeight: 1.6 }}>
        Most women see themselves in more than one. Read the rest, then take the quiz to confirm your dominant pattern.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {others.map((p) => (
          <Link
            key={p.slug}
            to={p.slug}
            className="block"
            style={{
              backgroundColor: "rgba(255,255,255,0.75)",
              border: "1px solid #E8E3DC",
              borderRadius: "16px",
              padding: "20px",
              transition: "background-color 0.2s",
            }}
          >
            <h3 className="italic" style={{ fontFamily: "Instrument Serif, serif", fontSize: "22px", color: "#111111" }}>
              {p.label}
            </h3>
            <p style={{ marginTop: "8px", fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#6b4c44", lineHeight: 1.55 }}>
              {p.blurb}
            </p>
          </Link>
        ))}
      </div>
      <div
        className="text-center"
        style={{
          marginTop: "40px",
          backgroundColor: "rgba(255,255,255,0.85)",
          border: "1px solid #E8E3DC",
          borderRadius: "20px",
          padding: "40px",
        }}
      >
        <p className="italic" style={{ fontFamily: "Instrument Serif, serif", fontSize: "28px", color: "#111111", lineHeight: 1.2 }}>
          Find out which pattern is yours.
        </p>
        <p style={{ marginTop: "10px", fontFamily: "Inter, sans-serif", fontSize: "15px", color: "#6b4c44" }}>
          The quiz takes 60 seconds. No sign-up required.
        </p>
        <Link
          to="/"
          hash="diagnosis"
          className="mt-6 inline-block"
          style={{
            backgroundColor: "#111111",
            color: "#ffffff",
            borderRadius: "100px",
            padding: "12px 28px",
            fontSize: "15px",
            fontWeight: 500,
            fontFamily: "Inter, sans-serif",
          }}
        >
          Take the free quiz →
        </Link>
      </div>
    </section>
  );
}
