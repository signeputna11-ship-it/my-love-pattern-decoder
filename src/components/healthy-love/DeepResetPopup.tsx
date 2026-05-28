import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowUpRight } from "lucide-react";

const MAILTO =
  "https://calendly.com/mylovepattern/30min";

const STORAGE_KEY = "mlp_deep_reset_popup_dismissed_v1";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

function pushDataLayer(payload: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
}

export function DeepResetPopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(STORAGE_KEY)) return;

    let shown = false;
    const show = () => {
      if (shown) return;
      shown = true;
      setOpen(true);
      pushDataLayer({ event: "popup_open", popup_name: "deep_pattern_reset" });
    };

    const timer = setTimeout(show, 60_000);

    const onMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) show();
    };
    document.addEventListener("mouseleave", onMouseLeave);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  const close = () => {
    setOpen(false);
    pushDataLayer({ event: "popup_close", popup_name: "deep_pattern_reset" });
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {}
  };

  const handleCtaClick = () => {
    pushDataLayer({
      event: "popup_cta_click",
      popup_name: "deep_pattern_reset",
      cta_label: "email_signe_discovery_call",
    });
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 px-4 py-6 backdrop-blur-sm"
          onClick={close}
        >
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="liquid-glass-strong relative flex max-h-[92vh] w-full max-w-lg flex-col rounded-3xl bg-black/85 text-white"
          >
          <div className="overflow-y-auto p-6 sm:p-8">
            <button
              onClick={close}
              aria-label="Close"
              className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-white/10 text-white/70 transition hover:bg-white/20 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>

            <h3 className="pr-8 font-serif text-2xl leading-tight sm:text-3xl">
              Ready to go deeper than a pattern?
            </h3>
            <p className="mt-3 font-serif text-sm italic text-white/75 sm:text-base">
              Some patterns live below what a quiz can reach. This session goes
              there.
            </p>

            <div className="mt-5 space-y-3 text-sm leading-relaxed text-white/80">
              <p>
                The Deep Pattern Reset is a private 1:1 session with Signe.
              </p>
              <p>
                In 90 minutes, you will enter a deeply relaxed, meditative state.
                The kind where the mind slows down enough to actually release
                what it has been holding. From that place, we work directly on
                the beliefs driving your pattern: the ones about your worth,
                your lovability, and what you believe you are allowed to want.
              </p>
              <p>
                This is not talk therapy. It is not coaching. It is a targeted
                reset of the story your nervous system has been running on,
                often since childhood, using a deep, evidence-informed approach
                that works at the level where the pattern actually lives.
              </p>
              <p>
                You will leave with clarity, a recorded 21-day audio meditation
                personalised to your reset, and a different relationship with
                the voice that has been telling you that you are too much, not
                enough, or asking for too much.
              </p>
            </div>

            <div className="mt-5 border-t border-white/10 pt-4">
              <p className="text-[10px] uppercase tracking-widest text-white/45">
                What is included
              </p>
              <ul className="mt-3 space-y-1.5 text-sm text-white/80">
                <li>✦ 90-minute private 1:1 session with Signe</li>
                <li>
                  ✦ Personalised 21-day reset audio meditation to anchor your
                  shift
                </li>
                <li>✦ Pre-session pattern clarity worksheet</li>
                <li>✦ Follow-up voice note from Signe within 48 hours</li>
              </ul>
            </div>

            <div className="mt-5 flex items-baseline justify-between border-t border-white/10 pt-4">
              <p className="text-[10px] uppercase tracking-widest text-white/45">
                Investment
              </p>
              <p className="font-serif text-3xl text-white sm:text-4xl">$333</p>
            </div>

            <p className="mt-4 text-xs italic text-white/60">
              Signe takes a limited number of sessions each month. If you feel
              the pull toward this, that feeling is worth following.
            </p>
            </div>

            <div className="border-t border-white/10 bg-black/85 p-6 sm:p-8 sm:pt-6 rounded-b-3xl">
              <a
                href={MAILTO} target="_blank" rel="noopener noreferrer"
                onClick={handleCtaClick}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-3.5 text-sm font-semibold text-black transition hover:bg-white/90"
              >
                Email Signe to arrange a discovery call{" "}
                <ArrowUpRight className="h-4 w-4" />
              </a>
              <p className="mt-3 text-center text-[11px] text-white/50">
                The discovery call is a short conversation to make sure this is
                the right fit for you. Signe responds personally within 48 hours.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
