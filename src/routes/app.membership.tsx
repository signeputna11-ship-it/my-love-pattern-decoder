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
import { WITHDRAWAL_CONSENT } from "@/lib/legal";
import { FOUNDING_OPEN, MEMBER_DISCOUNT_PERCENT, memberPrice } from "@/lib/offers";
import type { MembershipPlan } from "@/lib/server-fns/membership.functions";

export const Route = createFileRoute("/app/membership")({
  component: MembershipPage,
  head: () => ({
    meta: [{ title: "Membership" }, { name: "robots", content: "noindex, nofollow" }],
  }),
});

type Sub = {
  status: string;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  price_lookup_key: string | null;
};

const PLAN_LABEL: Record<MembershipPlan, string> = {
  starter: "Starter · 4,99 € a month",
  monthly: "Full Member · 14,99 € a month",
  yearly: "Full Member · 119 € a year",
  founding: "Founding Member · 79 € a year",
};

const PERKS = [
  "Every journey: Relationships, Confidence, Money and Business, Purpose and Sustainable Growth",
  "Interactive workbooks that save privately to your account",
  "The full audio library, recorded by Signe",
  `${MEMBER_DISCOUNT_PERCENT}% off your Deep Reset with Signe (${memberPrice(400)} € instead of 400 €)`,
];

const STARTER_PERKS = [
  "Daily support cards",
  "Your starting-point journey, from your quiz",
  "A starter set of audios",
];

function MembershipPage() {
  const [loading, setLoading] = useState(true);
  const [sub, setSub] = useState<Sub | null>(null);
  const [plan, setPlan] = useState<MembershipPlan | null>(null);
  const [admin, setAdmin] = useState(false);
  const [busy, setBusy] = useState(false);
  const [ack, setAck] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [grant, setGrant] = useState<{ tier: "full" | "starter"; expires_at: string } | null>(null);
  const [code, setCode] = useState("");

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (u.user) {
        const { data: g } = await (supabase as any)
          .from("access_grants")
          .select("tier,expires_at")
          .eq("user_id", u.user.id)
          .gt("expires_at", new Date().toISOString())
          .order("expires_at", { ascending: false });
        const grants = (g as { tier: "full" | "starter"; expires_at: string }[] | null) ?? [];
        setGrant(grants.find((x) => x.tier === "full") ?? grants[0] ?? null);
        const { data } = await (supabase as any)
          .from("subscriptions")
          .select("status,current_period_end,cancel_at_period_end,price_lookup_key")
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
  const isStarter = active && !!sub?.price_lookup_key?.startsWith("signe_coach_starter");
  const returnUrl = () => `${window.location.origin}/app/membership?welcome=1`;
  const passFull = grant?.tier === "full";

  const redeem = async () => {
    if (!code.trim()) return;
    setBusy(true);
    const { data, error } = await (supabase as any).rpc("redeem_access_code", { _code: code });
    if (error) {
      toast.error(error.message || "That code did not work");
      setBusy(false);
      return;
    }
    toast.success(
      `Your ${data?.tier === "starter" ? "Starter" : "Full Member"} pass is active until ${new Date(data?.expires_at).toLocaleDateString()}.`,
    );
    window.location.reload();
  };

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

  const leaveCheckout = () => {
    setPlan(null);
    setAck(false);
    setConfirmed(false);
  };

  if (plan && !confirmed) {
    return (
      <div className="mx-auto max-w-xl px-4 py-10 sm:py-16">
        <button onClick={leaveCheckout} className="text-xs uppercase tracking-widest text-foreground/50 hover:text-foreground">
          Back
        </button>
        <div className="mt-6 liquid-glass-strong rounded-3xl p-6 sm:p-8">
          <p className="text-xs uppercase tracking-widest text-foreground/50">
            {PLAN_LABEL[plan]}
          </p>
          <h1 className="mt-2 font-serif text-3xl">Before you pay</h1>
          <p className="mt-3 text-sm text-foreground/70">
            Your access opens the moment you pay. Your membership renews automatically and you can cancel any time from this page.
          </p>
          <p className="mt-2 text-xs text-foreground/50">
            Have a free pass code? Go back and enter it on the Membership page. Do not use the code box in the payment form.
          </p>
          <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-2xl liquid-glass p-4 text-xs leading-relaxed text-foreground/70">
            <input
              type="checkbox"
              checked={ack}
              onChange={(e) => setAck(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--primary)]"
            />
            <span>
              {WITHDRAWAL_CONSENT}{" "}
              <Link to="/refunds" target="_blank" className="underline underline-offset-2 hover:text-foreground">
                Refund Policy
              </Link>
            </span>
          </label>
          <button
            disabled={!ack}
            onClick={() => setConfirmed(true)}
            className="mt-5 w-full rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground disabled:opacity-50"
          >
            Continue to payment
          </button>
        </div>
      </div>
    );
  }

  if (plan) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10 sm:py-16">
        <button onClick={leaveCheckout} className="text-xs uppercase tracking-widest text-foreground/50 hover:text-foreground">
          Back
        </button>
        <div className="mt-6 liquid-glass-strong overflow-hidden rounded-3xl p-2">
          <EmbeddedCheckoutProvider
            stripe={getStripe()}
            options={{
              fetchClientSecret: async () => {
                const secret = await createMembershipCheckout({
                  data: { plan, returnUrl: returnUrl(), environment: getStripeEnvironment(), withdrawalAck: ack },
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

      {passFull && !(active && !isStarter) && (
        <div className="mt-8 liquid-glass-strong rounded-3xl p-6">
          <p className="font-serif text-2xl">Your free pass is active</p>
          <p className="mt-2 text-sm text-foreground/60">
            You have Full Member access until {new Date(grant!.expires_at).toLocaleDateString()}. Keep going, and you can
            join any time to keep it after that.
          </p>
        </div>
      )}

      {active && !isStarter ? (
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
          {!passFull && (
            <div className="mt-8 liquid-glass-strong rounded-3xl p-5 ring-1 ring-foreground/10">
              <p className="font-serif text-xl">Have a pass code?</p>
              <p className="mt-1 text-sm text-foreground/60">Enter it here to unlock your free access. No card needed.</p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  redeem();
                }}
                className="mt-3 flex flex-col gap-2 sm:flex-row"
              >
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="BETA-XXXX-XXXX"
                  autoCapitalize="characters"
                  className="flex-1 rounded-2xl liquid-glass px-4 py-3 text-sm tracking-widest text-foreground placeholder:text-foreground/30 focus:outline-none focus:ring-1 focus:ring-foreground/30"
                />
                <button
                  type="submit"
                  disabled={busy || !code.trim()}
                  className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground disabled:opacity-50"
                >
                  Redeem
                </button>
              </form>
            </div>
          )}
          {isStarter && (
            <div className="mt-6 liquid-glass rounded-3xl p-5 text-sm text-foreground/70">
              <p className="font-serif text-xl text-foreground">You are on Starter</p>
              <p className="mt-1">
                Move up to Full Member below and your Starter plan ends automatically, so you are never billed twice.
              </p>
              <button
                onClick={portal}
                disabled={busy}
                className="mt-3 rounded-full border border-foreground/30 px-4 py-2 text-xs text-foreground disabled:opacity-50"
              >
                Manage billing
              </button>
            </div>
          )}

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="liquid-glass-strong relative rounded-3xl p-6 ring-1 ring-foreground/15">
              <span className="absolute -top-3 left-6 rounded-full bg-primary px-3 py-1 text-[10px] font-medium uppercase tracking-widest text-primary-foreground">
                Best value
              </span>
              <p className="text-xs uppercase tracking-widest text-foreground/50">Full Member, yearly</p>
              <p className="mt-2 font-serif text-4xl">
                119 € <span className="text-base text-foreground/40 line-through">179,88 €</span>
              </p>
              <p className="text-sm text-foreground/60">per year. Four months free. About 9,92 € a month.</p>
              <ul className="mt-4 space-y-2 text-sm text-foreground/80">
                {PERKS.map((p) => (
                  <li key={p} className="flex gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0" /> {p}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => setPlan("yearly")}
                className="mt-5 w-full rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
              >
                Join yearly
              </button>
              <button
                onClick={() => setPlan("monthly")}
                className="mt-2 w-full rounded-full px-5 py-2 text-xs text-foreground/60 hover:text-foreground"
              >
                Or pay monthly, 14,99 €
              </button>
            </div>

            <div className="liquid-glass rounded-3xl p-6">
              <p className="text-xs uppercase tracking-widest text-foreground/50">Starter</p>
              <p className="mt-2 font-serif text-4xl">4,99 €</p>
              <p className="text-sm text-foreground/60">per month. Cancel any time.</p>
              <ul className="mt-4 space-y-2 text-sm text-foreground/80">
                {STARTER_PERKS.map((p) => (
                  <li key={p} className="flex gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0" /> {p}
                  </li>
                ))}
              </ul>
              {!isStarter && (
                <button
                  onClick={() => setPlan("starter")}
                  className="mt-5 w-full rounded-full border border-foreground/30 px-5 py-2.5 text-sm font-medium text-foreground"
                >
                  Start with Starter
                </button>
              )}
            </div>
          </div>

          {FOUNDING_OPEN && (
            <div className="mt-4 liquid-glass-strong rounded-3xl p-6 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest text-foreground/50">Founding offer, first 100 members</p>
                <p className="mt-1 font-serif text-2xl">79 € a year, locked in for life</p>
                <p className="text-sm text-foreground/60">Everything in Full Member, at the founding price for as long as you stay.</p>
              </div>
              <button
                onClick={() => setPlan("founding")}
                className="mt-4 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground sm:mt-0"
              >
                Claim founding place
              </button>
            </div>
          )}
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
