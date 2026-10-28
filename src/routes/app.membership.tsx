import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { getStripe, getStripeEnvironment } from "@/lib/stripe";
import {
  createMembershipCheckout,
  createBillingPortal,
  setupMembershipInStripe,
} from "@/lib/server-fns/membership.functions";
import { checkIsAdmin } from "@/lib/server-fns/admin-emails.functions";

export const Route = createFileRoute("/app/membership")({
  component: MembershipPage,
  head: () => ({
    meta: [{ title: "Membership" }, { name: "robots", content: "noindex, nofollow" }],
  }),
});

type Sub = { status: string; current_period_end: string | null; cancel_at_period_end: boolean };

const PERKS = [
  "Every journey: Relationships, Confidence, Money and Business, Purpose and Sustainable Growth",
  "Interactive workbooks that save privately to your account",
  "The full audio library, recorded by Signe",
  "A discount on 1:1 sessions with Signe",
];

function MembershipPage() {
  const [loading, setLoading] = useState(true);
  const [sub, setSub] = useState<Sub | null>(null);
  const [plan, setPlan] = useState<"monthly" | "yearly" | null>(null);
  const [admin, setAdmin] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (u.user) {
        const { data } = await (supabase as any)
          .from("subscriptions")
          .select("status,current_period_end,cancel_at_period_end")
          .eq("user_id", u.user.id)
          .order("created_at", { ascending: false })
          .limit(1);
        const row = (data as Sub[] | null)?.[0] ?? null;
        setSub(row);
        checkIsAdmin().then((r) => setAdmin(!!r.isAdmin)).catch(() => {});
      }
      setLoading(false);
    })();
  }, []);

  const active = !!sub && (sub.status === "active" || sub.status === "trialing");
  const returnUrl = () => `${window.location.origin}/app/membership?welcome=1`;

  const portal = async () => {
    setBusy(true);
    try {
      const url = await createBillingPortal({
        data: { returnUrl: returnUrl(), environment: getStripeEnvironment() },
      });
      window.location.href = url;
    } catch (e: any) {
      toast.error(e?.message ?? "Could not open billing");
      setBusy(false);
    }
  };

  const setup = async () => {
    setBusy(true);
    try {
      const r = await setupMembershipInStripe({ data: { environment: getStripeEnvironment() } });
      toast.success(r.created.length ? `Created: ${r.created.join(", ")}` : "Already set up");
    } catch (e: any) {
      toast.error(e?.message ?? "Setup failed");
    } finally {
      setBusy(false);
    }
  };

  if (loading)
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-foreground/50" />
      </div>
    );

  if (plan) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10 sm:py-16">
        <button onClick={() => setPlan(null)} className="text-xs uppercase tracking-widest text-foreground/50 hover:text-foreground">
          Back
        </button>
        <div className="mt-6 liquid-glass-strong overflow-hidden rounded-3xl p-2">
          <EmbeddedCheckoutProvider
            stripe={getStripe()}
            options={{
              fetchClientSecret: async () => {
                const secret = await createMembershipCheckout({
                  data: { plan, returnUrl: returnUrl(), environment: getStripeEnvironment() },
                });
                if (!secret) throw new Error("Could not start checkout");
                return secret;
              },
            }}
          >
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
      <p className="text-xs uppercase tracking-[0.3em] text-foreground/50">Membership</p>
      <h1 className="mt-2 font-serif text-4xl sm:text-5xl">Grow at your own pace</h1>

      {active ? (
        <div className="mt-8 liquid-glass-strong rounded-3xl p-6">
          <p className="font-serif text-2xl">You are a member</p>
          <p className="mt-2 text-sm text-foreground/60">
            {sub?.cancel_at_period_end
              ? "Your membership ends on "
              : "Your membership renews on "}
            {sub?.current_period_end ? new Date(sub.current_period_end).toLocaleDateString() : "the next billing date"}.
          </p>
          <button
            onClick={portal}
            disabled={busy}
            className="mt-4 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-50"
          >
            Manage billing
          </button>
        </div>
      ) : (
        <>
          <ul className="mt-6 space-y-2 text-sm text-foreground/80">
            {PERKS.map((p) => (
              <li key={p} className="flex gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0" /> {p}
              </li>
            ))}
          </ul>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="liquid-glass-strong rounded-3xl p-6">
              <p className="text-xs uppercase tracking-widest text-foreground/50">Monthly</p>
              <p className="mt-2 font-serif text-4xl">4,99 €</p>
              <p className="text-sm text-foreground/50">per month. Cancel any time.</p>
              <button
                onClick={() => setPlan("monthly")}
                className="mt-4 w-full rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
              >
                Join monthly
              </button>
            </div>
            <div className="liquid-glass-strong rounded-3xl p-6">
              <p className="text-xs uppercase tracking-widest text-foreground/50">Yearly</p>
              <p className="mt-2 font-serif text-4xl">39 €</p>
              <p className="text-sm text-foreground/50">per year. About two months free.</p>
              <button
                onClick={() => setPlan("yearly")}
                className="mt-4 w-full rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
              >
                Join yearly
              </button>
            </div>
          </div>
          <p className="mt-6 text-xs text-foreground/40">
            Educational self-reflection and coaching tools. They do not replace medical or mental health care.
          </p>
        </>
      )}

      {admin && (
        <div className="mt-10 rounded-3xl border border-foreground/10 p-5 text-sm text-foreground/60">
          <p>Admin: create the membership product, prices and member coupon in Stripe (safe to run again).</p>
          <button onClick={setup} disabled={busy} className="mt-3 rounded-full border border-foreground/30 px-4 py-2 text-foreground disabled:opacity-50">
            Set up membership in Stripe
          </button>
        </div>
      )}
      <Link to="/app" className="mt-8 inline-block text-xs uppercase tracking-widest text-foreground/50 hover:text-foreground">
        Back to dashboard
      </Link>
    </div>
  );
}
