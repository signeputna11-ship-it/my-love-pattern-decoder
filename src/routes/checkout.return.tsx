import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/checkout/return")({
  validateSearch: (search: Record<string, unknown>): { session_id?: string } => ({
    session_id: typeof search.session_id === "string" ? search.session_id : undefined,
  }),
  component: CheckoutReturn,
});

function CheckoutReturn() {
  const { session_id } = Route.useSearch();
  const navigate = useNavigate();
  const [state, setState] = useState<"checking" | "ready" | "pending">("checking");

  useEffect(() => {
    let cancelled = false;
    let attempts = 0;
    const poll = async () => {
      const { data: sess } = await supabase.auth.getSession();
      const uid = sess.session?.user.id;
      if (!uid) {
        setState("pending");
        return;
      }
      const { data: ok } = await supabase.rpc("has_paid_access", { _user_id: uid });
      if (cancelled) return;
      if (ok) {
        setState("ready");
      } else if (attempts++ < 12) {
        setTimeout(poll, 1500);
      } else {
        setState("pending");
      }
    };
    poll();
    return () => {
      cancelled = true;
    };
  }, [session_id]);

  useEffect(() => {
    if (state !== "ready") return;
    const t = setTimeout(() => navigate({ to: "/app" }), 1800);
    return () => clearTimeout(t);
  }, [state, navigate]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 z-0 h-full w-full object-cover opacity-50"
        src="https://uxovrditgykjwrienwbx.supabase.co/storage/v1/object/public/VIDEOS/FLOWER%20AND%20CRYSTALS%20ISLAND%20SIDE%20VIEW.mp4"
      />
      <div className="absolute inset-0 z-[1] bg-black/65" />
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <div className="liquid-glass-strong w-full max-w-md rounded-3xl p-8 text-center">
          {state === "checking" && (
            <>
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-white/70" />
              <h1 className="mt-4 font-serif text-3xl">Confirming your access…</h1>
              <p className="mt-2 text-sm text-white/60">Just a moment.</p>
            </>
          )}
          {state === "ready" && (
            <>
              <CheckCircle2 className="mx-auto h-10 w-10 text-white" />
              <h1 className="mt-4 font-serif text-4xl">You're in.</h1>
              <p className="mt-2 text-sm text-white/70">
                The Reset is unlocked. Taking you to your modules…
              </p>
              <Link
                to="/app"
                className="mt-6 inline-block rounded-full bg-white px-6 py-3 text-sm font-medium text-black hover:bg-white/90"
              >
                Enter the portal
              </Link>
            </>
          )}
          {state === "pending" && (
            <>
              <h1 className="font-serif text-3xl">Almost there</h1>
              <p className="mt-2 text-sm text-white/70">
                Your payment was received but access is still syncing. Try again in a few seconds.
              </p>
              <Link
                to="/app"
                className="mt-6 inline-block rounded-full bg-white px-6 py-3 text-sm font-medium text-black hover:bg-white/90"
              >
                Go to portal
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
