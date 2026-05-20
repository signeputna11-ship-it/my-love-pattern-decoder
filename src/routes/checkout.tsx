import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { getStripe, getStripeEnvironment } from "@/lib/stripe";
import { createCheckoutSession } from "@/server/payments.functions";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Loader2 } from "lucide-react";
import coverImage from "@/assets/my-love-pattern-cover.png";

export const Route = createFileRoute("/checkout")({
  component: CheckoutPage,
  head: () => ({
    meta: [
      { title: "Unlock the Reset Kit · My Love Pattern" },
      { name: "description", content: "Lifetime access to the My Love Pattern Reset Kit for $49." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

function CheckoutPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        navigate({ to: "/auth" });
        return;
      }
      setUser({ id: data.session.user.id, email: data.session.user.email ?? "" });
      setReady(true);
    });
  }, [navigate]);

  const fetchClientSecret = async (): Promise<string> => {
    const secret = await createCheckoutSession({
      data: {
        priceId: "love_pattern_reset_kit_usd",
        customerEmail: user?.email,
        userId: user?.id,
        returnUrl: `${window.location.origin}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
        environment: getStripeEnvironment(),
      },
    });
    if (!secret) throw new Error("Could not start checkout");
    return secret;
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 z-0 h-full w-full object-cover opacity-50"
        src="https://pub-687d7fb8b7f44636a61754dc527f9690.r2.dev/FLOWER%20AND%20CRYSTALS%20CLOSE%20UP.mp4"
      preload="metadata" />
      <div className="absolute inset-0 z-[1] bg-black/70" />
      <div className="relative z-10 mx-auto max-w-2xl px-4 py-10 sm:py-16">
        <Link
          to="/app"
          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-white/50 hover:text-white"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back
        </Link>
        <div className="mt-6 overflow-hidden rounded-3xl ring-1 ring-white/10 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)]">
          <img
            src={coverImage}
            alt="My Love Pattern, The Reset cover"
            className="h-auto w-full object-cover"
            loading="eager"
          />
        </div>
        <h1 className="mt-6 font-serif text-4xl sm:text-5xl">Unlock the Reset Kit</h1>
        <p className="mt-2 text-sm text-white/70">
          My Love Pattern Reset Kit. All worksheets included. Lifetime access. $49.
        </p>

        <div className="mt-8 liquid-glass-strong overflow-hidden rounded-3xl p-2">
          {ready ? (
            <EmbeddedCheckoutProvider stripe={getStripe()} options={{ fetchClientSecret }}>
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
          ) : (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-white/60" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
