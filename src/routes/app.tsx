import { createFileRoute, Outlet, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, LogOut, Shield } from "lucide-react";
import { toast } from "sonner";
import mlpLogo from "@/assets/mlp-logo.png";
import { checkIsAdmin } from "@/server/admin-emails.functions";

export const Route = createFileRoute("/app")({
  component: AppLayout,
  head: () => ({
    meta: [
      { title: "Your Reset · My Love Pattern" },
      { name: "description", content: "Your private reset path." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

function AppLayout() {
  const navigate = useNavigate();
  const [state, setState] = useState<"loading" | "no-auth" | "no-access" | "ready" | "error">("loading");
  const [email, setEmail] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState(false);

  const check = async (opts: { silent?: boolean; retry?: boolean } = {}) => {
    if (!opts.silent) setState("loading");
    setErrorMsg("");
    try {
      const withTimeout = <T,>(p: PromiseLike<T>, ms: number): Promise<T> =>
        Promise.race<T>([
          Promise.resolve(p),
          new Promise<T>((_, rej) => setTimeout(() => rej(new Error("timeout")), ms)),
        ]);

      const sessionRes = await withTimeout(supabase.auth.getSession(), 12000);
      const user = sessionRes.data?.session?.user;

      if (!user) {
        setState("no-auth");
        return;
      }

      setEmail(user.email ?? "");

      // Admin check (best-effort, never blocks)
      checkIsAdmin()
        .then((r) => setIsAdmin(!!r?.isAdmin))
        .catch(() => setIsAdmin(false));

      const rpcRes = await withTimeout(
        supabase.rpc("has_paid_access", { _user_id: user.id }),
        12000,
      );

      if (rpcRes.error) {
        console.error("[has_paid_access]", rpcRes.error);
        // Soft retry once before falling back — guards against transient
        // auth races right after OAuth redirect.
        if (!opts.retry) {
          setTimeout(() => check({ silent: true, retry: true }), 250);
          return;
        }
        // Don't trap the user on an error screen — the access check is an
        // upsell gate, not a security boundary (RLS enforces real access).
        // Default to the upsell screen so they have a path forward.
        setState("no-access");
        return;
      }

      setState(rpcRes.data ? "ready" : "no-access");
    } catch (e) {
      console.error("[AppLayout.check]", e);
      // Soft retry once before showing the error card — guards against transient
      // auth-lock timeouts when called near a token refresh.
      if (!opts.retry) {
        setTimeout(() => check({ silent: true, retry: true }), 250);
        return;
      }
      setErrorMsg("Something blocked your reset from loading. Please try again.");
      setState("error");
    }
  };

  useEffect(() => {
    check();
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      // Only re-check on meaningful events. Ignore TOKEN_REFRESHED / INITIAL_SESSION
      // to avoid deadlocking on the auth lock (calling supabase methods inside the
      // callback can stall until the 5s lock timeout fires).
      if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
      if (event === "SIGNED_OUT") setIsAdmin(false);
      // Defer out of the callback so the auth lock can release first.
      setTimeout(() => check({ silent: true }), 0);
    });
    return () => {
      sub.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate({ to: "/" });
  };

  if (state === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <Loader2 className="h-6 w-6 animate-spin text-white/60" />
      </div>
    );
  }

  if (state === "no-auth") {
    return (
      <CenterCard
        title="Sign in to continue"
        body="Your reset lives behind a private login. Sign in to access your modules."
        cta={
          <Link
            to="/auth"
            className="inline-block rounded-full bg-white px-6 py-3 text-sm font-medium text-black hover:bg-white/90"
          >
            Sign in
          </Link>
        }
      />
    );
  }

  if (state === "no-access") {
    return (
      <CenterCard
        title="One step away"
        body="The Reset is unlocked after purchase. Get lifetime access for $49."
        cta={
          <Link
            to="/checkout"
            className="inline-block rounded-full bg-white px-6 py-3 text-sm font-medium text-black hover:bg-white/90"
          >
            Unlock The Reset for $49
          </Link>
        }
        footer={
          <button onClick={signOut} className="text-xs text-white/50 hover:text-white">
            Sign out
          </button>
        }
      />
    );
  }

  if (state === "error") {
    return (
      <CenterCard
        title="Something went sideways"
        body={errorMsg || "We couldn't load your reset. Please try again."}
        cta={
          <button
            onClick={() => check()}
            className="inline-block rounded-full bg-white px-6 py-3 text-sm font-medium text-black hover:bg-white/90"
          >
            Try again
          </button>
        }
        footer={
          <button onClick={signOut} className="text-xs text-white/50 hover:text-white">
            Sign out
          </button>
        }
      />
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed inset-0 z-0 h-full w-full object-cover opacity-50"
        src="https://pub-687d7fb8b7f44636a61754dc527f9690.r2.dev/FLOWER%20AND%20CRYSTALS%20ISLAND%20SIDE%20VIEW.mp4"
      preload="metadata" />
      <div className="fixed inset-0 z-[1] bg-black/70" />

      <header className="relative z-10 flex items-center justify-between px-4 pt-4 sm:px-6">
        <Link to="/app" className="flex items-center gap-2 text-sm">
          <span className="grid h-7 w-7 flex-shrink-0 place-items-center overflow-hidden rounded-full bg-white">
            <img src={mlpLogo} alt="My Love Pattern" className="h-full w-full object-contain" />
          </span>
          <span className="font-serif italic text-base">My Love Pattern</span>
          <span className="hidden text-xs text-white/40 sm:inline">/ Reset Portal</span>
        </Link>
        <div className="flex items-center gap-3 text-xs text-white/60">
          <span className="hidden truncate max-w-[160px] sm:inline">{email}</span>
          {isAdmin && (
            <Link
              to="/app/admin/emails"
              className="flex items-center gap-1.5 rounded-full liquid-glass px-3 py-1.5 hover:bg-white/10"
            >
              <Shield className="h-3.5 w-3.5" /> Admin
            </Link>
          )}
          <button
            onClick={signOut}
            className="flex items-center gap-1.5 rounded-full liquid-glass px-3 py-1.5 hover:bg-white/10"
          >
            <LogOut className="h-3.5 w-3.5" /> Sign out
          </button>
        </div>
      </header>

      <main className="relative z-10">
        <Outlet />
      </main>
    </div>
  );
}

function CenterCard({
  title,
  body,
  cta,
  footer,
}: {
  title: string;
  body: string;
  cta: React.ReactNode;
  footer?: React.ReactNode;
}) {
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
      <div className="absolute inset-0 z-[1] bg-black/65" />
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <div className="liquid-glass-strong w-full max-w-md rounded-3xl p-8 text-center">
          <h1 className="font-serif text-3xl">{title}</h1>
          <p className="mt-3 text-sm text-white/70">{body}</p>
          <div className="mt-6">{cta}</div>
          {footer && <div className="mt-6">{footer}</div>}
        </div>
      </div>
    </div>
  );
}
