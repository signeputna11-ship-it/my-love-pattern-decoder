import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { createServerFn } from "@tanstack/react-start";
import { VideoBg } from "@/components/shop/VideoBg";

const resolvePurchaseBySession = createServerFn({ method: "GET" })
  .inputValidator((data: { sessionId: string }) => {
    if (!/^cs_[a-zA-Z0-9_]+$/.test(data.sessionId)) throw new Error("Invalid session id");
    return data;
  })
  .handler(async ({ data }) => {
    for (let i = 0; i < 20; i++) {
      const { data: purchase } = await supabaseAdmin
        .from("purchases")
        .select("access_token, product_slug, customer_email, has_access, refunded")
        .eq("stripe_session_id", data.sessionId)
        .maybeSingle();
      if (purchase?.access_token && purchase?.has_access && !purchase?.refunded) {
        return { purchase };
      }
      await new Promise((r) => setTimeout(r, 1500));
    }
    return { purchase: null as null };
  });

type Resolved = {
  access_token: string;
  product_slug: string | null;
  customer_email: string | null;
} | null;

const SESSION_MAILTO =
  "https://calendly.com/mylovepattern/30min";

export const Route = createFileRoute("/thank-you")({
  component: ThankYouPage,
  validateSearch: (search: Record<string, unknown>) => ({
    session_id: typeof search.session_id === "string" ? search.session_id : undefined,
  }),
  head: () => ({
    meta: [
      { title: "You're in · My Love Pattern" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

function SessionUpsellCard() {
  return (
    <div
      style={{
        background: "linear-gradient(135deg, rgba(30,15,25,0.95), rgba(25,15,35,0.95))",
        border: "1px solid rgba(201,133,122,0.2)",
        borderRadius: 24,
        padding: 48,
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
        maxWidth: 680,
        margin: "0 auto",
        color: "white",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: "rgba(201,133,122,0.12)",
          filter: "blur(80px)",
          top: -60,
          right: -40,
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          width: 250,
          height: 250,
          borderRadius: "50%",
          background: "rgba(122,92,138,0.08)",
          filter: "blur(80px)",
          bottom: -40,
          left: -40,
          pointerEvents: "none",
        }}
      />
      <div style={{ position: "relative", zIndex: 2 }}>
        <span
          style={{
            display: "inline-block",
            padding: "5px 16px",
            borderRadius: 100,
            background: "rgba(201,133,122,0.15)",
            border: "1px solid rgba(201,133,122,0.3)",
            fontSize: 11,
            letterSpacing: "1.5px",
            textTransform: "uppercase",
            color: "rgba(245,200,190,0.9)",
            marginBottom: 20,
          }}
        >
          <span style={{ color: "#EDB200" }}>✦</span> For when you are ready to go deeper
        </span>
        <h2
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontStyle: "italic",
            fontSize: 36,
            color: "white",
            textWrap: "balance",
            marginBottom: 16,
            lineHeight: 1.15,
          }}
        >
          Want to reset the belief, not just the behaviour?
        </h2>
        <p
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 15,
            color: "rgba(255,255,255,0.65)",
            maxWidth: 460,
            margin: "0 auto",
            marginBottom: 24,
            lineHeight: 1.7,
          }}
        >
          The Deep Pattern Reset is a private 90-minute session with Signe. You work directly on the belief underneath your pattern at the level where it was formed. Includes a personalised 21-day audio meditation to anchor the shift.
        </p>
        <div
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: 52,
            color: "white",
            marginBottom: 4,
            lineHeight: 1,
          }}
        >
          $333
        </div>
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 28 }}>
          one private session
        </p>
        <Link
          to="/shop/$slug"
          params={{ slug: "deep-pattern-reset" }}
          style={{
            display: "inline-block",
            background: "linear-gradient(135deg,#c9857a,#a0574e)",
            color: "white",
            borderRadius: 100,
            padding: "14px 32px",
            fontSize: 14,
            fontWeight: 500,
            boxShadow: "0 8px 32px rgba(160,87,78,0.3)",
            textDecoration: "none",
          }}
        >
          Reserve your session · $333 →
        </Link>
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 14 }}>
          Not ready yet?{" "}
          <a
            href={SESSION_MAILTO}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "rgba(255,255,255,0.75)", textDecoration: "underline" }}
          >
            Book a free discovery call first →
          </a>
        </p>
      </div>
    </div>
  );
}

function ThankYouPage() {
  const { session_id } = Route.useSearch();
  const [resolved, setResolved] = useState<Resolved>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session_id) {
      setLoading(false);
      return;
    }
    resolvePurchaseBySession({ data: { sessionId: session_id } })
      .then((r) => setResolved(r.purchase as Resolved))
      .finally(() => setLoading(false));
  }, [session_id]);

  const isKit = resolved?.product_slug === "love-pattern-reset-kit";
  const accessHref = resolved
    ? isKit
      ? `/kit/${resolved.access_token}`
      : `/w/${resolved.access_token}`
    : null;

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        overflow: "hidden",
        backgroundColor: "#F8F5F0",
        color: "#111111",
      }}
    >
      <VideoBg
        src="https://pub-687d7fb8b7f44636a61754dc527f9690.r2.dev/FLOWER%20AND%20CRYSTALS%20ISLAND%20CRYSTAL%20BALL.mp4"
        overlay="rgba(248,245,240,0.86)"
      />
      <div style={{ position: "relative", zIndex: 2 }} className="mx-auto max-w-3xl px-4 py-16">
        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin" style={{ color: "#8A8480" }} />
          </div>
        ) : !resolved ? (
          <div
            style={{
              background: "rgba(255,255,255,0.82)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.6)",
              borderRadius: 24,
              padding: "52px 48px",
              textAlign: "center",
            }}
          >
            <h1
              style={{
                fontFamily: "'Instrument Serif', serif",
                fontStyle: "italic",
                fontSize: 36,
                color: "#111111",
                textWrap: "balance",
              }}
            >
              Payment received
            </h1>
            <p style={{ marginTop: 12, fontSize: 16, color: "#2c1f1a", lineHeight: 1.7 }}>
              Your access link is on its way to your inbox. If you don't see it in a minute, check spam.
            </p>
          </div>
        ) : (
          <>
            {/* Section 1 — confirmation */}
            <div
              style={{
                background: "rgba(255,255,255,0.82)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.6)",
                borderRadius: 24,
                padding: "52px 48px",
              }}
            >
              <div className="flex items-center gap-3">
                <span
                  className="grid h-8 w-8 place-items-center rounded-full"
                  style={{ background: "rgba(120,180,120,0.15)", color: "#3f7048" }}
                >
                  <Check className="h-4 w-4" />
                </span>
                <p
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: 11,
                    textTransform: "uppercase",
                    letterSpacing: "2.5px",
                    color: "#8A8480",
                  }}
                >
                  You're in
                </p>
              </div>
              <h1
                style={{
                  fontFamily: "'Instrument Serif', serif",
                  fontStyle: "italic",
                  fontSize: "clamp(32px,4.5vw,52px)",
                  color: "#111111",
                  lineHeight: 1.1,
                  textWrap: "balance",
                  marginTop: 16,
                }}
              >
                Your access is ready
                {resolved.customer_email ? `, ${resolved.customer_email.split("@")[0]}` : ""}.
              </h1>
              <p style={{ marginTop: 14, fontSize: 16, color: "#2c1f1a", lineHeight: 1.7 }}>
                We sent a copy of this link to <strong>{resolved.customer_email}</strong>. Bookmark it or keep the email, it is how you re-open this any time.
              </p>

              {accessHref && (
                <a
                  href={accessHref}
                  style={{
                    display: "inline-block",
                    marginTop: 28,
                    background: "#111111",
                    color: "white",
                    borderRadius: 100,
                    padding: "14px 32px",
                    fontSize: 14,
                    fontWeight: 500,
                    textDecoration: "none",
                  }}
                >
                  Open {isKit ? "Reset Kit" : "Worksheet"} →
                </a>
              )}
            </div>

            {/* Section 2 — Kit upsell for worksheet buyers */}
            {!isKit && (
              <div
                className="mt-10"
                style={{
                  background: "rgba(255,255,255,0.78)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  border: "1px solid rgba(255,255,255,0.55)",
                  borderRadius: 24,
                  padding: 36,
                }}
              >
                <p
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: 11,
                    textTransform: "uppercase",
                    letterSpacing: "2.5px",
                    color: "#8A8480",
                  }}
                >
                  <span style={{ color: "#EDB200" }}>✦</span> One-time upgrade
                </p>
                <h2
                  style={{
                    fontFamily: "'Instrument Serif', serif",
                    fontStyle: "italic",
                    fontSize: 28,
                    color: "#111111",
                    textWrap: "balance",
                    marginTop: 8,
                    lineHeight: 1.2,
                  }}
                >
                  Want all six worksheets and the full five-stage reset?
                </h2>
                <p style={{ marginTop: 10, fontSize: 15, color: "#2c1f1a", lineHeight: 1.7 }}>
                  The complete My Love Pattern Reset Kit. $49, one payment, lifetime access.
                </p>
                <Link
                  to="/shop/$slug"
                  params={{ slug: "love-pattern-reset-kit" }}
                  style={{
                    display: "inline-block",
                    marginTop: 20,
                    background: "#111111",
                    color: "white",
                    borderRadius: 100,
                    padding: "12px 28px",
                    fontSize: 14,
                    fontWeight: 500,
                    textDecoration: "none",
                  }}
                >
                  Upgrade to the Reset Kit · $49
                </Link>
              </div>
            )}

            {/* Section 3 — next steps */}
            <div className="mt-10">
              <p
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: "2.5px",
                  color: "#8A8480",
                  textAlign: "center",
                }}
              >
                <span style={{ color: "#EDB200" }}>✦</span> Next steps
              </p>
              <p
                style={{
                  marginTop: 10,
                  fontSize: 15,
                  color: "#2c1f1a",
                  lineHeight: 1.7,
                  textAlign: "center",
                  maxWidth: 520,
                  margin: "10px auto 0",
                }}
              >
                Take your time. The work is in the writing, not the speed. Come back to it whenever you have a quiet half-hour.
              </p>
            </div>

            {/* Divider with sparkle */}
            <div style={{ textAlign: "center", margin: "48px 0" }}>
              <span style={{ color: "#EDB200", fontSize: 18 }}>✦</span>
            </div>

            {/* Section 4 — Deep Pattern Reset upsell for everyone */}
            <SessionUpsellCard />
          </>
        )}
      </div>
    </div>
  );
}
