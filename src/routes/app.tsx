import { createFileRoute, Outlet, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, LogOut } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/app")({
  component: AppLayout,
  head: () => ({
    meta: [
      { title: "Your Reset · My Love Pattern" },
      { name: "description", content: "Your private reset path." },
    ],
  }),
});

function AppLayout() {
  const navigate = useNavigate();
  const [state, setState] = useState<"loading" | "no-auth" | "no-access" | "ready" | "error">("loading");
  const [email, setEmail] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const check = async () => {
    setState("loading");
    setErrorMsg("");
    try {
      const withTimeout = <T,>(p: Promise<T>, ms: number) =>
        Promise.race<T>([
          p,
          new Promise<T>((_, rej) => setTimeout(() => rej(new Error("timeout")), ms)),
        ]);

      const { data: userData, error: userErr } = await withTimeout(
        supabase.auth.getUser(),
        6000,
      );

      if (userErr || !userData?.user) {
        // Stale/invalid token — clear it so the user can sign in cleanly.
        if (userErr && /jwt|token|session/i.test(userErr.message ?? "")) {
          await supabase.auth.signOut().catch(() => {});
        }
        setState("no-auth");
        return;
      }

      setEmail(userData.user.email ?? "");

      const { data: hasAccess, error: rpcErr } = await withTimeout(
        supabase.rpc("has_paid_access", { _user_id: userData.user.id }),
        6000,
      );

      if (rpcErr) {
        console.error("[has_paid_access]", rpcErr);
        setErrorMsg("We couldn't verify your access. Please try again.");
        setState("error");
        return;
      }

      setState(hasAccess ? "ready" : "no-access");
    } catch (e) {
      console.error("[AppLayout.check]", e);
      setErrorMsg("Something blocked your reset from loading. Please try again.");
      setState("error");
    }
  };

  useEffect(() => {
    check();
    const { data: sub } = supabase.auth.onAuthStateChange(() => check());
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
        body="The Reset is unlocked after purchase. Get lifetime access for €49."
        cta={
          <Link
            to="/checkout"
            className="inline-block rounded-full bg-white px-6 py-3 text-sm font-medium text-black hover:bg-white/90"
          >
            Unlock The Reset for €49
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

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed inset-0 z-0 h-full w-full object-cover opacity-50"
        src="https://uxovrditgykjwrienwbx.supabase.co/storage/v1/object/public/VIDEOS/FLOWER%20AND%20CRYSTALS%20ISLAND%20SIDE%20VIEW.mp4"
      />
      <div className="fixed inset-0 z-[1] bg-black/70" />

      <header className="relative z-10 flex items-center justify-between px-4 pt-4 sm:px-6">
        <Link to="/app" className="flex items-center gap-2 text-sm">
          <span className="font-serif italic text-base">My Love Pattern</span>
          <span className="hidden text-xs text-white/40 sm:inline">/ Reset Portal</span>
        </Link>
        <div className="flex items-center gap-3 text-xs text-white/60">
          <span className="hidden truncate max-w-[160px] sm:inline">{email}</span>
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
        src="https://uxovrditgykjwrienwbx.supabase.co/storage/v1/object/public/VIDEOS/FLOWER%20AND%20CRYSTALS%20CLOSE%20UP.mp4"
      />
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
