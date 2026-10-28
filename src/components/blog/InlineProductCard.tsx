import { Link } from "@tanstack/react-router";
import type { MatchedProduct } from "@/lib/blog.functions";

function formatPrice(cents: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
      maximumFractionDigits: 0,
    }).format(cents / 100);
  } catch {
    return `$${(cents / 100).toFixed(0)}`;
  }
}

export function InlineProductCard({ product }: { product: MatchedProduct }) {
  return (
    <aside
      className="not-prose my-10"
      style={{
        backgroundColor: "rgba(255,255,255,0.9)",
        border: "1px solid #E8E3DC",
        borderRadius: "20px",
        padding: "28px 28px 24px",
        boxShadow: "0 6px 24px -16px rgba(0,0,0,0.18)",
      }}
    >
      <div
        style={{
          fontFamily: "Inter, sans-serif",
          fontSize: "11px",
          letterSpacing: "1.8px",
          textTransform: "uppercase",
          color: "#8A8480",
          marginBottom: "10px",
        }}
      >
        <span style={{ color: "#EDB200" }}>✦</span> Matching template
      </div>
      <h3
        className="italic text-balance"
        style={{
          fontFamily: "Instrument Serif, serif",
          fontSize: "clamp(24px, 3.2vw, 30px)",
          color: "#111111",
          lineHeight: 1.2,
          marginBottom: "8px",
        }}
      >
        {product.name}
      </h3>
      {product.short_description && (
        <p
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "15px",
            color: "#4a3a35",
            lineHeight: 1.55,
            marginBottom: "18px",
          }}
        >
          {product.short_description}
        </p>
      )}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div
          style={{
            fontFamily: "Instrument Serif, serif",
            fontStyle: "italic",
            fontSize: "22px",
            color: "#111111",
          }}
        >
          {formatPrice(product.price_cents, product.currency)}
        </div>
        <Link
          to="/checkout"
          search={{ slug: product.slug }}
          className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-foreground"
          style={{ backgroundColor: "#111111", fontFamily: "Inter, sans-serif" }}
        >
          Get the template →
        </Link>
      </div>
    </aside>
  );
}
