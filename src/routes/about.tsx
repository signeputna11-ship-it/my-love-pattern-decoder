import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNav } from "@/components/healthy-love/SiteNav";
import { SiteFooter } from "@/components/healthy-love/SiteFooter";
import { VideoBackground } from "@/components/blog/VideoBackground";

const ABOUT_VIDEO =
  "https://pub-687d7fb8b7f44636a61754dc527f9690.r2.dev/FLOWER%20AND%20CRYSTALS%20ISLAND%20SIDE%20VIEW.mp4";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About My Love Pattern" },
      {
        name: "description",
        content:
          "My Love Pattern was created to help women understand the relationship patterns keeping them stuck. Founded by Signe.",
      },
      { property: "og:title", content: "About My Love Pattern" },
      {
        property: "og:description",
        content:
          "My Love Pattern was created to help women understand the relationship patterns keeping them stuck. Founded by Signe.",
      },
      { property: "og:url", content: "https://mylovepattern.com/about" },
    ],
    links: [{ rel: "canonical", href: "https://mylovepattern.com/about" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "AboutPage",
          name: "About My Love Pattern",
          url: "https://mylovepattern.com/about",
          mainEntity: {
            "@type": "Person",
            name: "Signe Putna",
            jobTitle: "Founder, My Love Pattern",
            url: "https://mylovepattern.com",
          },
        }),
      },
    ],
  }),
  component: AboutPage,
});

const labelStyle = {
  fontFamily: "Inter, sans-serif",
  fontSize: "11px",
  fontWeight: 600,
  letterSpacing: "2.5px",
  textTransform: "uppercase" as const,
  color: "#8A8480",
};

const PATTERNS = [
  {
    n: "Pattern 01",
    name: "The Over-Investor",
    desc: "Gives everything before anything is established. Believes love is something you earn through effort.",
    href: "/the-over-investor",
  },
  {
    n: "Pattern 02",
    name: "The Unavailable Chaser",
    desc: "Feels most alive when someone is unclear. Distance reads as desire. Availability feels flat.",
    href: "/the-unavailable-chaser",
  },
  {
    n: "Pattern 03",
    name: "The Validator Seeker",
    desc: "Calm when attention comes, anxious when it does not. One unanswered message shifts everything.",
    href: "/the-validator-seeker",
  },
  {
    n: "Pattern 04",
    name: "The Boundary Softener",
    desc: "Knows their standards until they like someone. Then quietly abandons them.",
    href: "/the-boundary-softener",
  },
];

function Rule() {
  return (
    <div
      style={{
        width: "40px",
        height: "1px",
        background: "#C8B8A8",
        margin: "32px auto",
      }}
    />
  );
}

function AboutPage() {
  return (
    <>
      <VideoBackground src={ABOUT_VIDEO} overlayColor="rgba(248,245,240,0.82)" />
      <SiteNav />
      <div style={{ backgroundColor: "#F8F5F0" }} className="relative">
        <main className="relative z-[1]">
          {/* SECTION 1 — Hero */}
          <section
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "100vh",
              textAlign: "center",
              position: "relative",
              padding: "0 24px",
            }}
          >
            <p style={{ ...labelStyle, letterSpacing: "3px" }}>
              <span style={{ color: "#EDB200" }}>✦</span> About
            </p>
            <h1
              className="italic"
              style={{
                fontFamily: "Instrument Serif, serif",
                fontStyle: "italic",
                fontSize: "clamp(52px, 8vw, 96px)",
                color: "#111111",
                lineHeight: 1.05,
                maxWidth: "800px",
                margin: "16px auto 0",
              }}
            >
              You don't have a dating problem. You have a pattern.
            </h1>
            <Rule />
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 400,
                fontSize: "18px",
                color: "#6b4c44",
                maxWidth: "500px",
                lineHeight: 1.75,
                margin: "0 auto",
              }}
            >
              My Love Pattern was created to help women see the pattern clearly
              — and finally understand why it keeps happening.
            </p>
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                bottom: "40px",
                left: "50%",
                transform: "translateX(-50%)",
                color: "#8A8480",
                animation: "aboutBounce 2s infinite",
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path
                  d="M6 9l6 6 6-6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <style>{`
              @keyframes aboutBounce {
                0%, 100% { transform: translate(-50%, 0); }
                50% { transform: translate(-50%, 8px); }
              }
            `}</style>
          </section>

          {/* SECTION 2 — Signe's story */}
          <section
            style={{
              maxWidth: "1100px",
              margin: "0 auto",
              padding: "100px 24px",
            }}
          >
            <div
              className="story-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "80px",
                alignItems: "start",
              }}
            >
              <div>
                <div
                  style={{
                    aspectRatio: "3 / 4",
                    borderRadius: "24px",
                    overflow: "hidden",
                    background: "rgba(255,255,255,0.5)",
                    border: "1px solid #E8E3DC",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span
                    className="italic"
                    style={{
                      fontFamily: "Instrument Serif, serif",
                      fontStyle: "italic",
                      fontSize: "18px",
                      color: "#8A8480",
                    }}
                  >
                    Signe's photo
                  </span>
                </div>
                <p
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "12px",
                    color: "#8A8480",
                    textAlign: "center",
                    marginTop: "12px",
                  }}
                >
                  Signe Putna · Founder
                </p>
              </div>

              <div>
                <p style={{ ...labelStyle, marginBottom: "16px" }}>
                  <span style={{ color: "#EDB200" }}>✦</span> The story
                </p>
                <h2
                  className="italic"
                  style={{
                    fontFamily: "Instrument Serif, serif",
                    fontStyle: "italic",
                    fontSize: "42px",
                    color: "#111111",
                    lineHeight: 1.15,
                    marginBottom: "28px",
                  }}
                >
                  Built for the woman who already knows something is off.
                </h2>
                {[
                  "Signe Putna created My Love Pattern after years of watching smart, self-aware women — herself included — repeat the same relationship ending with a different person.",
                  "The patterns had names. The Over-Investor. The Unavailable Chaser. The Validator Seeker. The Boundary Softener. Once you could see yours, everything made sense. Not in a painful way. In a finally way.",
                  "My Love Pattern exists for the woman who already knows something is off but cannot yet see what she is choosing and why.",
                ].map((p, i) => (
                  <p
                    key={i}
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "17px",
                      color: "#2c1f1a",
                      lineHeight: 1.85,
                      marginBottom: "20px",
                    }}
                  >
                    {p}
                  </p>
                ))}
              </div>
            </div>
            <style>{`
              @media (max-width: 768px) {
                .story-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
              }
            `}</style>
          </section>

          {/* SECTION 3 — Four pattern cards */}
          <section
            style={{
              maxWidth: "1100px",
              margin: "0 auto",
              padding: "0 24px 100px",
            }}
          >
            <p
              style={{
                ...labelStyle,
                marginBottom: "12px",
                textAlign: "center",
              }}
            >
              <span style={{ color: "#EDB200" }}>✦</span> The four patterns
            </p>
            <h2
              className="italic"
              style={{
                fontFamily: "Instrument Serif, serif",
                fontStyle: "italic",
                fontSize: "48px",
                color: "#111111",
                marginBottom: "48px",
                textAlign: "center",
              }}
            >
              Which one is yours?
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "20px",
              }}
            >
              {PATTERNS.map((p) => (
                <Link
                  key={p.href}
                  to={p.href}
                  className="pattern-about-card"
                  style={{
                    background: "rgba(255,255,255,0.82)",
                    border: "1px solid #E8E3DC",
                    borderRadius: "20px",
                    padding: "32px 28px",
                    transition: "transform 0.25s, box-shadow 0.25s",
                    textDecoration: "none",
                    display: "block",
                  }}
                >
                  <p
                    style={{
                      ...labelStyle,
                      letterSpacing: "2px",
                      marginBottom: "12px",
                    }}
                  >
                    {p.n}
                  </p>
                  <h3
                    className="italic"
                    style={{
                      fontFamily: "Instrument Serif, serif",
                      fontStyle: "italic",
                      fontSize: "28px",
                      color: "#111111",
                      lineHeight: 1.2,
                      marginBottom: "12px",
                    }}
                  >
                    {p.name}
                  </h3>
                  <p
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "14px",
                      color: "#6b4c44",
                      lineHeight: 1.65,
                    }}
                  >
                    {p.desc}
                  </p>
                  <span
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "13px",
                      color: "#111111",
                      borderBottom: "1px solid #E8E3DC",
                      textDecoration: "none",
                      marginTop: "20px",
                      display: "inline-block",
                    }}
                  >
                    Learn more →
                  </span>
                </Link>
              ))}
            </div>
            <style>{`
              .pattern-about-card:hover {
                transform: translateY(-4px);
                box-shadow: 0 12px 40px rgba(0,0,0,0.06);
              }
            `}</style>
          </section>

          {/* SECTION 4 — Mission */}
          <section
            style={{
              maxWidth: "740px",
              margin: "0 auto",
              padding: "0 24px 80px",
              textAlign: "center",
            }}
          >
            <p
              className="italic"
              style={{
                fontFamily: "Instrument Serif, serif",
                fontStyle: "italic",
                fontSize: "clamp(26px, 3.5vw, 38px)",
                color: "#6b4c44",
                lineHeight: 1.5,
                marginBottom: "32px",
              }}
            >
              This is not therapy. It is not coaching. It is a mirror held
              steady until you can see yourself clearly enough to make a
              different choice.
            </p>
            <div
              style={{
                width: "40px",
                height: "1px",
                background: "#C8B8A8",
                margin: "0 auto 32px",
              }}
            />
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "16px",
                color: "#8A8480",
              }}
            >
              mylovepattern.com
            </p>
          </section>

          {/* SECTION 5 — CTA */}
          <section
            style={{
              maxWidth: "700px",
              margin: "0 auto",
              padding: "0 24px 120px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                background: "rgba(255,255,255,0.85)",
                border: "1px solid #E8E3DC",
                borderRadius: "24px",
                padding: "52px 48px",
              }}
            >
              <p style={{ ...labelStyle, marginBottom: "16px" }}>
                <span style={{ color: "#EDB200" }}>✦</span> Start here
              </p>
              <h3
                className="italic"
                style={{
                  fontFamily: "Instrument Serif, serif",
                  fontStyle: "italic",
                  fontSize: "36px",
                  color: "#111111",
                  marginBottom: "16px",
                }}
              >
                Find your pattern in 60 seconds.
              </h3>
              <p
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "16px",
                  color: "#6b4c44",
                  marginBottom: "28px",
                }}
              >
                The quiz is free. No sign-up required. Instant results.
              </p>
              <Link
                to="/"
                style={{
                  background: "#111111",
                  color: "white",
                  borderRadius: "100px",
                  padding: "14px 32px",
                  fontSize: "15px",
                  fontWeight: 500,
                  fontFamily: "Inter, sans-serif",
                  textDecoration: "none",
                  display: "inline-block",
                }}
              >
                Take the free quiz →
              </Link>
            </div>
          </section>
        </main>
      </div>
      <SiteFooter />
    </>
  );
}
