import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getShopProducts } from "@/server/shop.functions";
import { Loader2 } from "lucide-react";

type Product = {
  slug: string;
  kind: string;
  name: string;
  short_description: string | null;
  price_cents: number;
  currency: string;
};

export const Route = createFileRoute("/shop")({
  component: ShopIndex,
  head: () => ({
    meta: [
      { title: "Shop · My Love Pattern" },
      {
        name: "description",
        content:
          "Worksheets and the complete Reset Kit. No login required — buy, get an access link, fill it in.",
      },
    ],
  }),
});

function formatPrice(cents: number, currency: string) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: currency.toUpperCase() }).format(
    cents / 100,
  );
}

function ShopIndex() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    getShopProducts()
      .then((r) => setProducts(r.products as Product[]))
      .catch((e) => setErr(e?.message ?? "Could not load products"));
  }, []);

  return (
    <div className="relative min-h-screen bg-black text-white">
      <div className="mx-auto max-w-5xl px-4 py-16 sm:py-24">
        <header className="mb-12 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-white/40">My Love Pattern · Shop</p>
          <h1 className="mt-3 font-serif text-4xl sm:text-5xl">Pick the worksheet that fits the moment.</h1>
          <p className="mx-auto mt-4 max-w-xl text-sm text-white/60">
            Individual worksheets are $7. The full Reset Kit ($49) includes everything.
          </p>
        </header>

        {err && (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
            {err}
          </div>
        )}

        {!products && !err && (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-white/40" />
          </div>
        )}

        {products && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => {
              const isKit = p.kind === "kit";
              return (
                <Link
                  key={p.slug}
                  to="/shop/$slug"
                  params={{ slug: p.slug }}
                  className={`group rounded-3xl p-6 ring-1 transition hover:scale-[1.01] ${
                    isKit
                      ? "bg-gradient-to-br from-white/15 to-white/5 ring-white/30"
                      : "bg-white/5 ring-white/10 hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className="text-[10px] uppercase tracking-widest text-white/40">
                      {isKit ? "Complete Kit" : "Worksheet"}
                    </span>
                    <span className="text-base font-medium">
                      {formatPrice(p.price_cents, p.currency)}
                    </span>
                  </div>
                  <h2 className="mt-6 font-serif text-2xl leading-tight text-balance">{p.name}</h2>
                  {p.short_description && (
                    <p className="mt-2 text-sm text-white/60">{p.short_description}</p>
                  )}
                  <span className="mt-8 inline-block text-xs uppercase tracking-widest text-white/70 group-hover:text-white">
                    {isKit ? "Get the full kit →" : "Get it →"}
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
