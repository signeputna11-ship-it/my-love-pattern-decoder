import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { sendTransactionalEmail } from "@/lib/email/send";
import { linkGuestPurchases } from "@/lib/server-fns/payments.functions";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
  head: () => ({
    meta: [
      { title: "Sign in · My Love Pattern" },
      { name: "description", content: "Sign in to access your private reset path." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

async function maybeSendWelcome(userId: string, email: string | null) {
  if (!email) return;
  try {
    const { data: profile } = await supabase
      .from("profiles")
      .select("welcome_sent_at, display_name")
      .eq("user_id", userId)
      .maybeSingle();
    if (profile?.welcome_sent_at) return;
    const result = await sendTransactionalEmail({
      templateName: "welcome",
      recipientEmail: email,
      idempotencyKey: `welcome-${userId}`,
      templateData: { name: profile?.display_name ?? undefined },
    });
    if (result.success) {
      await supabase
        .from("profiles")
        .update({ welcome_sent_at: new Date().toISOString() })
        .eq("user_id", userId);
    }
  } catch (e) {
    console.warn("welcome send failed", e);
  }
}

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [signupSuccessEmail, setSignupSuccessEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        const u = data.session.user;
        maybeSendWelcome(u.id, u.email ?? null);
        linkGuestPurchases().catch(() => {});
        navigate({ to: "/app" });
      }
    });
  }, [navigate]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/app` },
        });
        if (error) throw error;
        // Supabase signals "email already registered" by returning a user with empty identities.
        if (data.user && data.user.identities && data.user.identities.length === 0) {
          toast.error("An account with this email already exists. Try signing in instead.");
          setMode("signin");
        } else {
          setSignupSuccessEmail(email);
          toast.success("Check your email to confirm your account.");
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        linkGuestPurchases().catch(() => {});
        navigate({ to: "/app" });
      }
    } catch (err: any) {
      toast.error(err.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: `${window.location.origin}/app`,
      });
      if (result.error) {
        toast.error("Google sign-in failed");
        setLoading(false);
        return;
      }
      if (result.redirected) return;
      navigate({ to: "/app" });
    } catch {
      toast.error("Google sign-in failed");
      setLoading(false);
    }
  };

  // Send password-reset followup email after a recovery-driven password update.
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "USER_UPDATED" && session?.user?.email) {
        sendTransactionalEmail({
          templateName: "password-reset-followup",
          recipientEmail: session.user.email,
          idempotencyKey: `pwd-reset-followup-${session.user.id}-${Date.now()}`,
        }).catch(() => {});
      }
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 z-0 h-full w-full object-cover opacity-60"
        src="https://pub-687d7fb8b7f44636a61754dc527f9690.r2.dev/FLOWER%20AND%20CRYSTALS%20CLOSE%20UP.mp4"
      preload="metadata" />
      <div className="absolute inset-0 z-[1] bg-black/65" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="liquid-glass-strong w-full max-w-md rounded-3xl p-8"
        >
          <Link
            to="/home"
            className="mb-6 inline-block text-xs uppercase tracking-[0.3em] text-white/60 hover:text-white"
          >
            ← My Love Pattern
          </Link>

          {signupSuccessEmail ? (
            <div>
              <h1 className="font-serif text-4xl">Check your email</h1>
              <p className="mt-3 text-sm text-white/80">
                We sent a confirmation link to{" "}
                <span className="font-medium text-white">{signupSuccessEmail}</span>.
                Click it to activate your account, then return here to sign in.
              </p>
              <p className="mt-3 text-xs text-white/50">
                Don't see it? Check your spam folder.
              </p>
              <button
                onClick={() => {
                  setSignupSuccessEmail(null);
                  setMode("signin");
                  setPassword("");
                }}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-white/90"
              >
                Back to sign in
              </button>
            </div>
          ) : (
            <>
              <h1 className="font-serif text-4xl">
                {mode === "signin" ? "Welcome back" : "Begin your reset"}
              </h1>
              <p className="mt-2 text-sm text-white/70">
                {mode === "signin"
                  ? "Sign in to continue your path."
                  : "Create an account to access your reset."}
              </p>

              <button
                onClick={handleGoogle}
                disabled={loading}
                className="mt-6 flex w-full items-center justify-center gap-3 rounded-full liquid-glass px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10 disabled:opacity-50"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.56c2.08-1.92 3.28-4.74 3.28-8.09Z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.99.66-2.25 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.11A6.6 6.6 0 0 1 5.5 12c0-.74.13-1.45.34-2.11V7.05H2.18A11 11 0 0 0 1 12c0 1.77.42 3.45 1.18 4.95l3.66-2.84Z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.05l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z"
                  />
                </svg>
                Continue with Google
              </button>

              <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-widest text-white/40">
                <span className="h-px flex-1 bg-white/15" /> or <span className="h-px flex-1 bg-white/15" />
              </div>

              <form onSubmit={handleEmailAuth} className="space-y-3">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-2xl liquid-glass px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-white/30"
                />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full rounded-2xl liquid-glass px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-white/30"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-white/90 disabled:opacity-50"
                >
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  {mode === "signin" ? "Sign in" : "Create account"}
                </button>
              </form>

              <button
                onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
                className="mt-5 w-full text-center text-xs text-white/60 hover:text-white"
              >
                {mode === "signin"
                  ? "New here? Create an account"
                  : "Already have an account? Sign in"}
              </button>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
