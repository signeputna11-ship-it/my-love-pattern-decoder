import { createFileRoute, Outlet, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, LogOut, Shield } from "lucide-react";
import { toast } from "sonner";
import mlpLogo from "@/assets/signe-coach-mark.png";
import { checkIsAdmin } from "@/lib/server-fns/admin-emails.functions";
import { linkGuestPurchases } from "@/lib/server-fns/payments.functions";
import { TermsConsent } from "@/components/TermsConsent";
import { TERMS_VERSION } from "@/lib/legal";

const TERMS_KEY = "sc_terms_version";

async function recordTerms(userId: string) {
  const { error } = await (supabase as any)
    .from("profiles")
    .update({ terms_accepted_at: new Date().toISOString(), terms_version: TERMS_VERSION })
    .eq("user_id", userId);
  return !error;
}

export const Route = createFileRoute("/app")({
  component: AppLayout,
  head: () => ({
    meta: [
      { title: "Your space · Signe Coach" },
      { name: "description", content: "Your private space." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

function AppLayout() {
  const navigate = useNavigate();
  const [state, setState] = useState<"loading" | "no-auth" | "no-access" | "terms" | "ready" | "error">("loading");
  const [userId, setUserId] = useState<string>("");
  const [agreed, setAgreed] = useState(false);
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
      setUserId(user.id);

      // Terms: everyone must have accepted the current version. A box ticked at sign-up
      // (kept in the user's metadata or browser) is recorded silently, otherwise we ask.
      const { data: prof } = await (supabase as any)
        .from("profiles")
        .select("terms_version")
        .eq("user_id", user.id)
        .maybeSingle();
      if (prof && prof.terms_version !== TERMS_VERSION) {
        let ticked = user.user_metadata?.terms_version === TERMS_VERSION;
        try { ticked = ticked || localStorage.getItem(TERMS_KEY) === TERMS_VERSION; } catch { /* private mode */ }
        if (!ticked || !(await recordTerms(user.id))) {
          setState("terms");
          return;
        }
      }

      // Admin check (best-effort, never blocks)
      checkIsAdmin()
        .then((r) => setIsAdmin(!!r?.isAdmin))
        .catch(() => setIsAdmin(false));

      // Best-effort: attach any guest purchases made with this email
      // to the now-authenticated account before checking access.
      try { await linkGuestPurchases(); } catch { /* non-fatal */ }

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
        // The free tier is open to every signed-in user, so continue.
        setState("ready");
        return;
      }

      // Free tier: every signed-in user enters. Paid content is locked per module by RLS.
      setState("ready");
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
      <div className="flex min-h-screen items-center justify-center bg-transparent text-foreground">
        <Loader2 className="h-6 w-6 animate-spin text-foreground/60" />
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
            className="inline-block rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Sign in
          </Link>
        }
      />
    );
  }

  if (state === "terms") {
    return (
      <CenterCard
        title="One quick step"
        body="Please read and accept our terms to enter your space."
        cta={
          <div className="space-y-4">
            <div className="rounded-2xl liquid-glass p-4">
              <TermsConsent checked={agreed} onChange={setAgreed} />
            </div>
            <button
              disabled={!agreed}
              onClick={async () => {
                if (await recordTerms(userId)) {
                  try { localStorage.setItem(TERMS_KEY, TERMS_VERSION); } catch { /* private mode */ }
                  setAgreed(false);
                  check();
                } else {
                  toast.error("Could not save your acceptance. Please try again.");
                }
              }}
              className="w-full rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              Agree and continue
            </button>
          </div>
        }
        footer={
          <button onClick={signOut} className="text-xs text-foreground/50 hover:text-foreground">
            Sign out
          </button>
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
            className="inline-block rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Unlock The Reset for $49
          </Link>
        }
        footer={
          <button onClick={signOut} className="text-xs text-foreground/50 hover:text-foreground">
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
            className="inline-block rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Try again
          </button>
        }
        footer={
          <button onClick={signOut} className="text-xs text-foreground/50 hover:text-foreground">
            Sign out
          </button>
        }
      />
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-transparent text-foreground">
      <div className="fixed inset-0 z-[1] bg-white/60" />

      <header className="relative z-10 flex flex-wrap items-center justify-between gap-x-3 gap-y-2 px-4 pt-4 sm:px-6">
        <Link to="/app" className="flex shrink-0 items-center gap-2 whitespace-nowrap text-sm">
          <span className="grid h-7 w-7 flex-shrink-0 place-items-center overflow-hidden rounded-full bg-white">
            <img src={mlpLogo} alt="Signe Coach" className="h-full w-full object-contain" />
          </span>
          <span className="whitespace-nowrap font-serif italic text-base">Signe Coach</span>
          <span className="hidden text-xs text-foreground/40 sm:inline">/ Member space</span>
        </Link>
        <div className="flex flex-wrap items-center justify-end gap-2 text-xs text-foreground/60 sm:gap-3">
          <span className="hidden truncate max-w-[160px] lg:inline">{email}</span>
          <Link
            to="/app"
            activeOptions={{ exact: true }}
            className="flex items-center gap-1.5 rounded-full liquid-glass px-3 py-1.5 hover:bg-foreground/5"
          >
            Today
          </Link>
          <Link
            to="/app/checkin"
            className="flex items-center gap-1.5 rounded-full liquid-glass px-3 py-1.5 hover:bg-foreground/5"
          >
            Check-in
          </Link>
          <Link
            to="/app/library"
            className="flex items-center gap-1.5 rounded-full liquid-glass px-3 py-1.5 hover:bg-foreground/5"
          >
            Library
          </Link>
          <Link
            to="/app/membership"
            className="flex items-center gap-1.5 rounded-full liquid-glass px-3 py-1.5 hover:bg-foreground/5"
          >
            Membership
          </Link>
          <Link
            to="/app/work-with-signe"
            className="flex items-center gap-1.5 rounded-full liquid-glass px-3 py-1.5 hover:bg-foreground/5"
          >
            Work with Signe
          </Link>
          {isAdmin && (
            <Link
              to="/app/admin/emails"
              className="flex items-center gap-1.5 rounded-full liquid-glass px-3 py-1.5 hover:bg-foreground/5"
            >
              <Shield className="h-3.5 w-3.5" /> Admin
            </Link>
          )}
          {isAdmin && (
            <Link
              to="/app/admin/codes"
              className="flex items-center gap-1.5 rounded-full liquid-glass px-3 py-1.5 hover:bg-foreground/5"
            >
              Codes
            </Link>
          )}
          {isAdmin && (
            <Link
              to="/app/admin/audio"
              className="flex items-center gap-1.5 rounded-full liquid-glass px-3 py-1.5 hover:bg-foreground/5"
            >
              Audio
            </Link>
          )}
          <button
            onClick={signOut}
            className="flex items-center gap-1.5 rounded-full liquid-glass px-3 py-1.5 hover:bg-foreground/5"
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
    <div className="relative min-h-screen overflow-hidden bg-transparent text-foreground">
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <div className="liquid-glass-strong w-full max-w-md rounded-3xl p-8 text-center">
          <h1 className="font-serif text-3xl">{title}</h1>
          <p className="mt-3 text-sm text-foreground/70">{body}</p>
          <div className="mt-6">{cta}</div>
          {footer && <div className="mt-6">{footer}</div>}
        </div>
      </div>
    </div>
  );
}
