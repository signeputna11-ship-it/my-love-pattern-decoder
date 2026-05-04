import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export function StickyMobileCTA() {
  const navigate = useNavigate();
  const [signedIn, setSignedIn] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const [hideAtBottom, setHideAtBottom] = useState(false);

  useEffect(() => {
    let mounted = true;
    const check = async () => {
      const { data: sess } = await supabase.auth.getSession();
      const uid = sess.session?.user.id;
      if (!mounted) return;
      setSignedIn(!!uid);
      if (!uid) {
        setHasAccess(false);
        return;
      }
      const { data: ok } = await supabase.rpc("has_paid_access", { _user_id: uid });
      if (!mounted) return;
      setHasAccess(!!ok);
    };
    check();
    const { data: sub } = supabase.auth.onAuthStateChange(() => check());
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const target = document.getElementById("final-cta");
    if (!target) return;
    const observer = new IntersectionObserver(
      ([entry]) => setHideAtBottom(entry.isIntersecting),
      { threshold: 0.25 },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  const handleClick = () => {
    if (hasAccess) {
      navigate({ to: "/app" });
    } else if (signedIn) {
      navigate({ to: "/checkout" });
    } else {
      navigate({ to: "/auth" });
    }
  };

  const label = hasAccess ? "Open My Reset" : "Unlock My Pattern · $49";

  return (
    <div
      aria-hidden={hideAtBottom}
      className={`fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(env(safe-area-inset-bottom),0.75rem)] pt-3 transition-all duration-300 md:hidden ${
        hideAtBottom ? "pointer-events-none translate-y-full opacity-0" : "translate-y-0 opacity-100"
      }`}
    >
      <div className="mx-auto max-w-md rounded-full bg-black/70 p-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-xl ring-1 ring-white/10">
        <button
          onClick={handleClick}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-black transition active:scale-[0.98]"
        >
          {label} <ArrowUpRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
