import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { createServerFn } from "@tanstack/react-start";

const resolvePurchaseBySession = createServerFn({ method: "GET" })
  .inputValidator((data: { sessionId: string }) => {
    if (!/^cs_[a-zA-Z0-9_]+$/.test(data.sessionId)) throw new Error("Invalid session id");
    return data;
  })
  .handler(async ({ data }) => {
    // Webhook may take a few seconds — poll up to ~6s before giving up.
    for (let i = 0; i < 4; i++) {
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
    <div className="relative min-h-screen bg-black text-white">
      <div className="mx-auto max-w-2xl px-4 py-16">
        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-white/40" />
          </div>
        ) : !resolved ? (
          <div className="rounded-3xl bg-white/5 p-8 ring-1 ring-white/10">
            <h1 className="font-serif text-3xl">Payment received</h1>
            <p className="mt-3 text-white/70">
              Your access link is on its way to your inbox. If you don't see it in a minute, check spam.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-emerald-400/20 text-emerald-300">
                <Check className="h-4 w-4" />
              </span>
              <p className="text-xs uppercase tracking-[0.3em] text-white/50">You're in</p>
            </div>
            <h1 className="mt-3 font-serif text-4xl text-balance">
              Your access is ready{resolved.customer_email ? `, ${resolved.customer_email.split("@")[0]}` : ""}.
            </h1>
            <p className="mt-3 text-white/70">
              We sent a copy of this link to <strong>{resolved.customer_email}</strong>. Bookmark it or
              keep the email — it's how you re-open this any time.
            </p>

            {accessHref && (
              <a
                href={accessHref}
                className="mt-8 inline-block rounded-full bg-white px-8 py-4 text-sm font-semibold text-black hover:bg-white/90"
              >
                Open {isKit ? "Reset Kit" : "Worksheet"} →
              </a>
            )}

            {!isKit && (
              <div className="mt-12 rounded-3xl bg-gradient-to-br from-white/15 to-white/5 p-8 ring-1 ring-white/20">
                <p className="text-[10px] uppercase tracking-widest text-white/50">One-time upgrade</p>
                <h2 className="mt-2 font-serif text-2xl text-balance">
                  Want all six worksheets and the full five-stage reset?
                </h2>
                <p className="mt-2 text-sm text-white/70">
                  The complete My Love Pattern Reset Kit. $49 — one payment, lifetime access.
                </p>
                <Link
                  to="/shop/$slug"
                  params={{ slug: "love-pattern-reset-kit" }}
                  className="mt-6 inline-block rounded-full bg-white/90 px-6 py-3 text-sm font-medium text-black hover:bg-white"
                >
                  Upgrade to the Reset Kit · $49
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
