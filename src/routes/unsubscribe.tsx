import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/unsubscribe")({
  component: UnsubscribePage,
  head: () => ({
    meta: [
      { title: "Unsubscribe · My Love Pattern" },
      { name: "robots", content: "noindex" },
    ],
  }),
});

type State = "loading" | "valid" | "already" | "invalid" | "submitting" | "done" | "error";

function UnsubscribePage() {
  const [state, setState] = useState<State>("loading");
  const [token, setToken] = useState<string>("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("token") ?? "";
    setToken(t);
    if (!t) {
      setState("invalid");
      return;
    }
    fetch(`/email/unsubscribe?token=${encodeURIComponent(t)}`)
      .then(async (r) => {
        const data = await r.json().catch(() => ({}));
        if (!r.ok) return setState("invalid");
        if (data.valid) return setState("valid");
        if (data.reason === "already_unsubscribed") return setState("already");
        setState("invalid");
      })
      .catch(() => setState("error"));
  }, []);

  const confirm = async () => {
    setState("submitting");
    try {
      const r = await fetch("/email/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await r.json().catch(() => ({}));
      if (data.success) setState("done");
      else if (data.reason === "already_unsubscribed") setState("already");
      else setState("error");
    } catch {
      setState("error");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="liquid-glass-strong w-full max-w-md rounded-3xl p-8 text-center">
        <img src="/mlp-logo.png" alt="My Love Pattern" className="mx-auto mb-6 h-14 w-14 rounded-full bg-white" />
        <h1 className="font-serif text-3xl mb-3">Unsubscribe</h1>
        {state === "loading" && <p className="text-sm text-white/70">Checking your link...</p>}
        {state === "invalid" && (
          <p className="text-sm text-white/70">This unsubscribe link is invalid or has expired.</p>
        )}
        {state === "already" && (
          <p className="text-sm text-white/70">You're already unsubscribed. We won't send you any more emails.</p>
        )}
        {state === "valid" && (
          <>
            <p className="text-sm text-white/70 mb-6">
              Confirm to stop receiving emails from My Love Pattern.
            </p>
            <button
              onClick={confirm}
              className="rounded-full bg-white px-6 py-3 text-sm font-medium text-black hover:bg-white/90"
            >
              Confirm Unsubscribe
            </button>
          </>
        )}
        {state === "submitting" && <p className="text-sm text-white/70">Processing...</p>}
        {state === "done" && (
          <p className="text-sm text-white/80">You're unsubscribed. Take care.</p>
        )}
        {state === "error" && (
          <p className="text-sm text-red-300">Something went wrong. Please try again later.</p>
        )}
      </div>
    </div>
  );
}
