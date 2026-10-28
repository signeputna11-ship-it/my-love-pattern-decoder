import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getShopProducts } from "@/lib/server-fns/shop.functions";
import { Loader2 } from "lucide-react";
import { VideoBg } from "@/components/shop/VideoBg";
import { SiteNav } from "@/components/healthy-love/SiteNav";

type Product = {
  slug: string;
  kind: string;
  name: string;
  short_description: string | null;
  price_cents: number;
  currency: string;
};

export const Route = createFileRoute("/shop/")({
  component: ShopIndex,
  head: () => ({
    meta: [
      { title: "Shop · My Love Pattern" },
      {
        name: "description",
        content:
          "Worksheets, the complete Reset Kit, and private sessions with Signe.",
      },
      { property: "og:title", content: "Shop · My Love Pattern" },
      {
        property: "og:description",
        content:
          "Worksheets, the complete Reset Kit, and private sessions with Signe.",
      },
      { property: "og:url", content: "https://mylovepattern.com/shop" },
    ],
    links: [{ rel: "canonical", href: "https://mylovepattern.com/shop" }],
  }),
});

const SESSION_MAILTO =
  "https://calendly.com/mylovepattern/30min";

function formatPrice(cents: number, currency: string) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: currency.toUpperCase() }).format(
    cents / 100,
  );
}

const SECTION_LABEL: React.CSSProperties = {
  fontFamily: "Inter, sans-serif",
  fontSize: 11,
  textTransform: "uppercase",
  letterSpacing: "2.5px",
  color: "#6B6560",
  marginBottom: 24,
};

function ShopIndex() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    getShopProducts()
      .then((r) => setProducts(r.products as Product[]))
      .catch((e) => setErr(e?.message ?? "Could not load products"));
  }, []);

  const worksheets = (products ?? []).filter((p) => p.kind === "worksheet");
  const kit = (products ?? []).find((p) => p.kind === "kit");
  const session = (products ?? []).find((p) => p.kind === "session");

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
        src="https://pub-687d7fb8b7f44636a61754dc527f9690.r2.dev/FLOWER%20AND%20CRYSTALS%20ISLAND%20TOP%20VIEW.mp4"
        overlay="rgba(248,245,240,0.85)"
      />
      <div style={{ position: "relative", zIndex: 2 }}>
        <SiteNav />
      </div>
      <div style={{ position: "relative", zIndex: 2 }} className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
        <header className="mb-16 text-center">
          <p style={SECTION_LABEL}><span style={{ color: "#E8BAC9" }}>✦</span> My Love Pattern Shop</p>
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
            Pick the worksheet that fits the moment.
          </h1>
          <p
            className="mx-auto mt-5 max-w-xl"
            style={{ fontFamily: "Inter, sans-serif", fontSize: 17, color: "#2c1f1a", lineHeight: 1.6 }}
          >
            Individual worksheets are $7. The full Reset Kit is $49. Private sessions with Signe start at $333.
          </p>
        </header>

        {err && (
          <div className="rounded-2xl border border-red-300 bg-red-50 p-4 text-sm text-red-700">{err}</div>
        )}

        {!products && !err && (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin" style={{ color: "#6B6560" }} />
          </div>
        )}

        {products && (
          <>
            {/* SECTION 1 — WORKSHEETS */}
            <section className="mb-20">
              <p style={SECTION_LABEL}><span style={{ color: "#E8BAC9" }}>✦</span> Individual Worksheets</p>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {worksheets.map((p) => (
                  <Link
                    key={p.slug}
                    to="/shop/$slug"
                    params={{ slug: p.slug }}
                    style={{
                      background: "rgba(255,255,255,0.82)",
                      backdropFilter: "blur(16px)",
                      WebkitBackdropFilter: "blur(16px)",
                      border: "1px solid rgba(255,255,255,0.6)",
                      boxShadow:
                        "0 4px 24px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.9)",
                      borderRadius: 20,
                      padding: 28,
                      display: "block",
                      transition: "all 0.3s ease",
                    }}
                    className="hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(0,0,0,0.08)]"
                  >
                    <div className="flex items-center justify-between">
                      <span
                        style={{
                          fontSize: 11,
                          textTransform: "uppercase",
                          letterSpacing: "2px",
                          color: "#6B6560",
                        }}
                      >
                        Worksheet
                      </span>
                      <span
                        style={{
                          fontFamily: "'Instrument Serif', serif",
                          fontSize: 22,
                          color: "#111111",
                        }}
                      >
                        {formatPrice(p.price_cents, p.currency)}
                      </span>
                    </div>
                    <h2
                      style={{
                        fontFamily: "'Instrument Serif', serif",
                        fontStyle: "italic",
                        fontSize: 26,
                        color: "#111111",
                        lineHeight: 1.2,
                        textWrap: "balance",
                        marginTop: 18,
                      }}
                    >
                      {p.name}
                    </h2>
                    {p.short_description && (
                      <p
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontSize: 14,
                          color: "#6b4c44",
                          marginTop: 10,
                          lineHeight: 1.6,
                        }}
                      >
                        {p.short_description}
                      </p>
                    )}
                    <span
                      style={{
                        marginTop: 24,
                        display: "inline-block",
                        fontSize: 12,
                        textTransform: "uppercase",
                        letterSpacing: "2px",
                        color: "#111111",
                      }}
                    >
                      Get it →
                    </span>
                  </Link>
                ))}
              </div>
            </section>

            {/* SECTION 2 — KIT BANNER */}
            {kit && (
              <section className="mb-20">
                <p style={SECTION_LABEL}><span style={{ color: "#E8BAC9" }}>✦</span> The Complete Reset Kit</p>
                <Link
                  to="/shop/$slug"
                  params={{ slug: kit.slug }}
                  style={{
                    display: "block",
                    background:
                      "linear-gradient(135deg, #173D34, #1f4a40)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 24,
                    padding: "52px 60px",
                    color: "white",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <div className="grid items-center gap-8 sm:grid-cols-[1fr_auto]">
                    <div>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "5px 16px",
                          borderRadius: 100,
                          background: "rgba(237,178,0,0.15)",
                          border: "1px solid rgba(237,178,0,0.3)",
                          fontSize: 11,
                          letterSpacing: "1.5px",
                          textTransform: "uppercase",
                          color: "#E8BAC9",
                          marginBottom: 20,
                        }}
                      >
                        All six worksheets + 5-stage reset
                      </span>
                      <h2
                        style={{
                          fontFamily: "'Instrument Serif', serif",
                          fontStyle: "italic",
                          fontSize: 48,
                          lineHeight: 1.1,
                          textWrap: "balance",
                          color: "white",
                        }}
                      >
                        {kit.name}
                      </h2>
                      <p
                        style={{
                          marginTop: 16,
                          fontSize: 15,
                          color: "rgba(255,255,255,0.7)",
                          lineHeight: 1.7,
                          maxWidth: 520,
                        }}
                      >
                        {kit.short_description}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-3">
                      <div
                        style={{
                          fontFamily: "'Instrument Serif', serif",
                          fontSize: 72,
                          color: "white",
                          lineHeight: 1,
                        }}
                      >
                        {formatPrice(kit.price_cents, kit.currency)}
                      </div>
                      <span
                        style={{
                          background: "white",
                          color: "#111",
                          borderRadius: 100,
                          padding: "12px 28px",
                          fontSize: 14,
                          fontWeight: 500,
                        }}
                      >
                        Get the full kit →
                      </span>
                    </div>
                  </div>
                </Link>
              </section>
            )}

            {/* SECTION 3 — DEEP PATTERN RESET SESSION */}
            {session && (
              <section>
                <p style={SECTION_LABEL}><span style={{ color: "#E8BAC9" }}>✦</span> Private 1:1 Session</p>
                <div
                  style={{
                    maxWidth: 1100,
                    margin: "0 auto",
                    background:
                      "linear-gradient(135deg, #102440, #173D34)",
                    border: "1px solid rgba(232,186,201,0.45)",
                    borderRadius: 24,
                    padding: "52px 60px",
                    position: "relative",
                    overflow: "hidden",
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
                  <div
                    className="grid gap-10 sm:grid-cols-[1fr_auto]"
                    style={{ position: "relative", zIndex: 2 }}
                  >
                    <div>
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
                        Private Session with Signe
                      </span>
                      <h2
                        style={{
                          fontFamily: "'Instrument Serif', serif",
                          fontStyle: "italic",
                          fontSize: 48,
                          color: "white",
                          textWrap: "balance",
                          marginBottom: 16,
                          lineHeight: 1.1,
                        }}
                      >
                        The Deep Pattern Reset
                      </h2>
                      <p
                        style={{
                          fontFamily: "'Instrument Serif', serif",
                          fontStyle: "italic",
                          fontSize: 22,
                          color: "rgba(245,200,190,0.8)",
                          marginBottom: 24,
                        }}
                      >
                        One session. A different nervous system story.
                      </p>
                      <p
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontSize: 15,
                          color: "rgba(255,255,255,0.65)",
                          lineHeight: 1.8,
                          maxWidth: 480,
                          marginBottom: 28,
                        }}
                      >
                        Some patterns live below what a worksheet can reach. In a private 90-minute session you enter a deeply relaxed meditative state and we work directly on the belief driving your pattern at the level where it actually lives. Not managing it. Resetting it.
                      </p>
                      <ul style={{ display: "flex", flexDirection: "column", gap: 10, listStyle: "none", padding: 0, margin: 0 }}>
                        {[
                          "90-minute private 1:1 session with Signe",
                          "Personalised 21-day reset audio meditation",
                          "Pre-session pattern clarity worksheet",
                          "Follow-up voice note within 48 hours",
                        ].map((t) => (
                          <li
                            key={t}
                            style={{ display: "flex", gap: 10, alignItems: "flex-start" }}
                          >
                            <span
                              style={{
                                width: 5,
                                height: 5,
                                borderRadius: "50%",
                                background: "rgba(201,133,122,0.8)",
                                flexShrink: 0,
                                marginTop: 7,
                              }}
                            />
                            <span style={{ fontSize: 14, color: "rgba(255,255,255,0.7)" }}>{t}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex flex-col items-end gap-5">
                      <div>
                        <div
                          style={{
                            fontFamily: "'Instrument Serif', serif",
                            fontSize: 72,
                            color: "white",
                            lineHeight: 1,
                            textAlign: "right",
                          }}
                        >
                          $333
                        </div>
                        <div style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", textAlign: "right", marginTop: 4 }}>
                          per session
                        </div>
                      </div>
                      <a
                        href={SESSION_MAILTO}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          background: "linear-gradient(135deg,#E8BAC9,#d99fb2)",
                          color: "white",
                          borderRadius: 100,
                          padding: "14px 32px",
                          fontSize: 14,
                          fontWeight: 500,
                          boxShadow: "0 8px 32px rgba(160,87,78,0.4)",
                          textDecoration: "none",
                        }}
                      >
                        Email Signe to arrange a discovery call →
                      </a>
                      <p
                        style={{
                          fontSize: 12,
                          color: "rgba(255,255,255,0.3)",
                          textAlign: "right",
                          marginTop: 4,
                          maxWidth: 260,
                        }}
                      >
                        Signe responds personally within 48 hours. Limited spots each month.
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}
