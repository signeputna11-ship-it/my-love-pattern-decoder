import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { getStripe, getStripeEnvironment } from "@/lib/stripe";
import { getShopProduct, createGuestCheckout } from "@/server/shop.functions";
import { ArrowLeft, Loader2 } from "lucide-react";
import { VideoBg } from "@/components/shop/VideoBg";

type Product = {
  slug: string;
  kind: string;
  name: string;
  short_description: string | null;
  price_cents: number;
  currency: string;
};

const SESSION_MAILTO =
  "mailto:mylovepattern@gmail.com?subject=Deep Pattern Reset — Discovery Call&body=Hi Signe, I would like to arrange a discovery call for the Deep Pattern Reset session. My name is:";

const VIDEO_BY_SLUG: Record<string, { src: string; overlay: string }> = {
  "love-pattern-reset-kit": {
    src: "https://pub-687d7fb8b7f44636a61754dc527f9690.r2.dev/GEMS%20ISLAND%20MOTION.mp4",
    overlay: "rgba(248,245,240,0.82)",
  },
  "deep-pattern-reset": {
    src: "https://pub-687d7fb8b7f44636a61754dc527f9690.r2.dev/FLOWER%20AND%20CRYSTALS%20ISLAND%20CRYSTAL%20BALL.mp4",
    overlay: "rgba(248,245,240,0.80)",
  },
};
const DEFAULT_VIDEO = {
  src: "https://pub-687d7fb8b7f44636a61754dc527f9690.r2.dev/FLOWER%20AND%20CRYSTALS%20ISLAND%20CRYSTAL.mp4",
  overlay: "rgba(248,245,240,0.85)",
};

export const Route = createFileRoute("/shop/$slug")({
  component: ShopProductPage,
  head: () => ({
    meta: [{ title: "Checkout · My Love Pattern" }, { name: "robots", content: "noindex, nofollow" }],
  }),
});

function formatPrice(cents: number, currency: string) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: currency.toUpperCase() }).format(
    cents / 100,
  );
}

const labelStyle: React.CSSProperties = {
  fontFamily: "Inter, sans-serif",
  fontSize: 11,
  textTransform: "uppercase",
  letterSpacing: "2.5px",
  color: "#8A8480",
};

const cardStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.88)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,0.6)",
  boxShadow:
    "0 8px 40px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.9)",
  borderRadius: 24,
  padding: 32,
};

function SessionProductView({ product }: { product: Product }) {
  const Section = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="mt-8">
      <p style={labelStyle}>
        <span style={{ color: "#EDB200" }}>✦</span> {label}
      </p>
      <div className="mt-3">{children}</div>
    </div>
  );
  const Bullet = ({ children }: { children: React.ReactNode }) => (
    <li style={{ display: "flex", gap: 10, alignItems: "flex-start", marginTop: 8 }}>
      <span
        style={{
          width: 5,
          height: 5,
          borderRadius: "50%",
          background: "#c9857a",
          flexShrink: 0,
          marginTop: 9,
        }}
      />
      <span style={{ fontFamily: "Inter, sans-serif", fontSize: 15, color: "#2c1f1a", lineHeight: 1.7 }}>
        {children}
      </span>
    </li>
  );

  return (
    <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
      <div>
        <span
          style={{
            display: "inline-block",
            padding: "5px 16px",
            borderRadius: 100,
            background: "rgba(201,133,122,0.12)",
            border: "1px solid rgba(201,133,122,0.3)",
            fontSize: 11,
            letterSpacing: "1.5px",
            textTransform: "uppercase",
            color: "#a0574e",
            marginBottom: 16,
          }}
        >
          Private Session
        </span>
        <h1
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontStyle: "italic",
            fontSize: "clamp(36px,5vw,60px)",
            color: "#111111",
            lineHeight: 1.1,
            textWrap: "balance",
          }}
        >
          The Deep Pattern Reset
        </h1>
        <p
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 17,
            color: "#2c1f1a",
            lineHeight: 1.7,
            marginTop: 16,
          }}
        >
          Some patterns live below what a worksheet can reach. In a private 90-minute session you enter a deeply relaxed meditative state and work directly on the belief underneath your pattern at the level where it was formed.
        </p>

        <Section label="What is included">
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            <Bullet>90-minute private 1:1 session with Signe</Bullet>
            <Bullet>A deeply relaxed meditative state where real change becomes possible</Bullet>
            <Bullet>Direct work on the belief driving your pattern, not just the behaviour</Bullet>
            <Bullet>Personalised 21-day reset audio meditation to anchor your shift</Bullet>
            <Bullet>Pre-session pattern clarity worksheet sent before your session</Bullet>
            <Bullet>Follow-up voice note from Signe within 48 hours</Bullet>
          </ul>
        </Section>

        <Section label="This is for you if">
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            <Bullet>You have tried understanding your pattern and it has not shifted the behaviour</Bullet>
            <Bullet>You want to work at the level of the belief, not just the symptom</Bullet>
            <Bullet>You are ready for a private personalised experience with Signe</Bullet>
            <Bullet>You want something that works at the level where the pattern actually lives</Bullet>
          </ul>
        </Section>

        <Section label="How it works">
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: 15, color: "#2c1f1a", lineHeight: 1.8 }}>
            Before your session you receive a pre-session worksheet to identify what you want to shift. In the session you enter a deeply relaxed meditative state, locate the origin of the belief, and update it with the mind of an adult. After the session Signe sends you a personalised 21-day audio meditation and a follow-up voice note within 48 hours.
          </p>
        </Section>
      </div>

      <aside>
        <div style={{ ...cardStyle, position: "sticky", top: 24 }}>
          <div
            style={{
              fontFamily: "'Instrument Serif', serif",
              fontSize: 56,
              color: "#111111",
              lineHeight: 1,
            }}
          >
            $333
          </div>
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#8A8480", marginTop: 4 }}>
            per private session
          </div>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: "#6b4c44", marginTop: 20, lineHeight: 1.65 }}>
            Email Signe to arrange a short discovery call first. She responds to every message personally within 48 hours.
          </p>
          <a
            href={SESSION_MAILTO}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "block",
              textAlign: "center",
              background: "#111111",
              color: "white",
              borderRadius: 100,
              padding: "14px 24px",
              fontSize: 14,
              fontWeight: 500,
              marginTop: 20,
              textDecoration: "none",
            }}
          >
            Email Signe to arrange a discovery call →
          </a>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#8A8480", marginTop: 12 }}>
            This opens your email directly to Signe. Limited spots each month.
          </p>
          <div style={{ height: 1, background: "#E8E3DC", margin: "20px 0" }} />
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#6b4c44", fontStyle: "italic", lineHeight: 1.6 }}>
            This is not talk therapy or coaching. It is a targeted reset of the belief at the level where it was formed.
          </p>
        </div>
      </aside>
    </div>
  );
}

function StripeProductView({ product }: { product: Product }) {
  const { slug } = product;
  const [email, setEmail] = useState("");
  const [emailValid, setEmailValid] = useState(false);
  const [started, setStarted] = useState(false);
  const stripePromise = useMemo(() => getStripe(), []);

  useEffect(() => {
    setEmailValid(/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email));
  }, [email]);

  const fetchClientSecret = async (): Promise<string> => {
    const secret = await createGuestCheckout({
      data: {
        slug,
        customerEmail: email,
        returnUrl: `${window.location.origin}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
        environment: getStripeEnvironment(),
      },
    });
    if (!secret) throw new Error("Could not start checkout");
    return secret;
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
      <div>
        <p style={labelStyle}>{product.kind === "kit" ? "Complete Reset Kit" : "Single Worksheet"}</p>
        <h1
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontStyle: "italic",
            fontSize: "clamp(36px,5vw,60px)",
            color: "#111111",
            lineHeight: 1.1,
            textWrap: "balance",
            marginTop: 8,
          }}
        >
          {product.name}
        </h1>
        {product.short_description && (
          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: 17,
              color: "#2c1f1a",
              lineHeight: 1.7,
              marginTop: 16,
            }}
          >
            {product.short_description}
          </p>
        )}

        <div
          className="mt-8"
          style={{
            background: "rgba(255,255,255,0.5)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.5)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.8)",
            borderRadius: 16,
            padding: 28,
          }}
        >
          <p style={labelStyle}><span style={{ color: "#EDB200" }}>✦</span> What you get</p>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              marginTop: 12,
              fontFamily: "Inter, sans-serif",
              fontSize: 15,
              color: "#2c1f1a",
              lineHeight: 1.8,
            }}
          >
            <li>· Instant access link sent to your inbox</li>
            <li>· Fillable, auto-saving as you write</li>
            <li>· Re-open anytime from your email, no account needed</li>
          </ul>
          {product.kind === "worksheet" && (
            <p style={{ marginTop: 14, fontSize: 13, color: "#8A8480" }}>
              Want all six worksheets plus the full five-stage reset?{" "}
              <Link
                to="/shop/$slug"
                params={{ slug: "love-pattern-reset-kit" }}
                style={{ color: "#111111", textDecoration: "underline" }}
              >
                Get the Reset Kit for $49
              </Link>
              .
            </p>
          )}
        </div>
      </div>

      <aside>
        <div style={{ ...cardStyle, position: "sticky", top: 24 }}>
          <div
            style={{
              fontFamily: "'Instrument Serif', serif",
              fontSize: 56,
              color: "#111111",
              lineHeight: 1,
            }}
          >
            {formatPrice(product.price_cents, product.currency)}
          </div>
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#8A8480", marginTop: 4 }}>
            one-time, lifetime access
          </div>

          {!started ? (
            <div className="mt-6">
              <label style={{ ...labelStyle, display: "block" }}>Your email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={{
                  marginTop: 8,
                  width: "100%",
                  background: "rgba(255,255,255,0.6)",
                  border: "1px solid rgba(255,255,255,0.7)",
                  borderRadius: 12,
                  padding: "14px 16px",
                  fontFamily: "Inter, sans-serif",
                  fontSize: 15,
                  color: "#2c1f1a",
                  outline: "none",
                }}
              />
              <button
                disabled={!emailValid}
                onClick={() => setStarted(true)}
                style={{
                  marginTop: 14,
                  width: "100%",
                  background: "#111111",
                  color: "white",
                  borderRadius: 100,
                  padding: "14px 20px",
                  fontSize: 14,
                  fontWeight: 500,
                  opacity: emailValid ? 1 : 0.4,
                  transition: "all 0.2s",
                }}
              >
                Continue to payment · {formatPrice(product.price_cents, product.currency)}
              </button>
              <p style={{ marginTop: 12, fontSize: 12, color: "#8A8480" }}>
                Your access link goes to this email. Double-check spelling.
              </p>
            </div>
          ) : (
            <div className="mt-6 overflow-hidden rounded-2xl bg-white p-2">
              <EmbeddedCheckoutProvider stripe={stripePromise} options={{ fetchClientSecret }}>
                <EmbeddedCheckout />
              </EmbeddedCheckoutProvider>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}

function ShopProductPage() {
  const { slug } = Route.useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    getShopProduct({ data: { slug } })
      .then((r) => setProduct(r.product as Product))
      .catch((e) => setErr(e?.message ?? "Could not load product"));
  }, [slug]);

  const video = VIDEO_BY_SLUG[slug] ?? DEFAULT_VIDEO;

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
      <VideoBg src={video.src} overlay={video.overlay} />
      <div
        style={{ position: "relative", zIndex: 2 }}
        className="mx-auto max-w-6xl px-4 py-10 sm:py-16"
      >
        <Link
          to="/shop"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: 12,
            textTransform: "uppercase",
            letterSpacing: "2px",
            color: "#8A8480",
          }}
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to shop
        </Link>

        {err && (
          <div className="mt-6 rounded-2xl border border-red-300 bg-red-50 p-4 text-sm text-red-700">
            {err}
          </div>
        )}

        {!product && !err && (
          <div className="mt-20 flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin" style={{ color: "#8A8480" }} />
          </div>
        )}

        {product && (
          <div className="mt-8">
            {product.kind === "session" ? (
              <SessionProductView product={product} />
            ) : (
              <StripeProductView product={product} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
