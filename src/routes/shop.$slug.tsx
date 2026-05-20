import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { getStripe, getStripeEnvironment } from "@/lib/stripe";
import { getShopProduct, createGuestCheckout } from "@/server/shop.functions";
import { ArrowLeft, Loader2 } from "lucide-react";

type Product = {
  slug: string;
  kind: string;
  name: string;
  short_description: string | null;
  price_cents: number;
  currency: string;
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

function ShopProductPage() {
  const { slug } = Route.useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [email, setEmail] = useState("");
  const [emailValid, setEmailValid] = useState(false);
  const [started, setStarted] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const stripePromise = useMemo(() => getStripe(), []);

  useEffect(() => {
    getShopProduct({ data: { slug } })
      .then((r) => setProduct(r.product as Product))
      .catch((e) => setErr(e?.message ?? "Could not load product"));
  }, [slug]);

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
    <div className="relative min-h-screen bg-black text-white">
      <div className="mx-auto max-w-2xl px-4 py-10 sm:py-16">
        <Link
          to="/shop"
          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-white/50 hover:text-white"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to shop
        </Link>

        {err && (
          <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
            {err}
          </div>
        )}

        {!product && !err && (
          <div className="mt-20 flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-white/40" />
          </div>
        )}

        {product && (
          <>
            <p className="mt-6 text-xs uppercase tracking-[0.3em] text-white/40">
              {product.kind === "kit" ? "Complete Reset Kit" : "Single Worksheet"}
            </p>
            <h1 className="mt-2 font-serif text-4xl sm:text-5xl text-balance">{product.name}</h1>
            {product.short_description && (
              <p className="mt-3 text-white/70">{product.short_description}</p>
            )}
            <p className="mt-4 text-2xl font-medium">
              {formatPrice(product.price_cents, product.currency)}
            </p>

            <div className="mt-8 rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
              <h2 className="font-serif text-lg">What you get</h2>
              <ul className="mt-3 space-y-1.5 text-sm text-white/70">
                <li>· Instant access link sent to your inbox</li>
                <li>· Fillable, auto-saving as you write</li>
                <li>· Re-open anytime from your email — no account needed</li>
              </ul>
              {product.kind === "worksheet" && (
                <p className="mt-4 text-xs text-white/40">
                  Want all six worksheets plus the full five-stage reset?{" "}
                  <Link to="/shop/$slug" params={{ slug: "love-pattern-reset-kit" }} className="underline hover:text-white">
                    Get the Reset Kit for $49
                  </Link>
                  .
                </p>
              )}
            </div>

            {!started ? (
              <div className="mt-8 rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
                <label className="block text-xs uppercase tracking-widest text-white/50">
                  Your email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="mt-2 w-full rounded-xl bg-black/40 px-4 py-3 text-sm ring-1 ring-white/10 placeholder:text-white/30 focus:outline-none focus:ring-white/40"
                />
                <button
                  disabled={!emailValid}
                  onClick={() => setStarted(true)}
                  className="mt-4 w-full rounded-full bg-white px-6 py-3 text-sm font-semibold text-black disabled:opacity-40"
                >
                  Continue to payment · {formatPrice(product.price_cents, product.currency)}
                </button>
                <p className="mt-3 text-xs text-white/40">
                  Your access link goes to this email. Double-check spelling.
                </p>
              </div>
            ) : (
              <div className="mt-8 overflow-hidden rounded-3xl bg-white/5 p-2 ring-1 ring-white/10">
                <EmbeddedCheckoutProvider stripe={stripePromise} options={{ fetchClientSecret }}>
                  <EmbeddedCheckout />
                </EmbeddedCheckoutProvider>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
