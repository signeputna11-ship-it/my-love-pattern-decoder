import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowUpRight } from "lucide-react";

const MAILTO =
  "mailto:mylovepattern@gmail.com?subject=Deep%20Pattern%20Reset%20%E2%80%94%20Session%20Request&body=Hi%20Signe%2C%20I%20would%20like%20to%20book%20a%20Deep%20Pattern%20Reset%20session.%20My%20name%20is%3A";

const STORAGE_KEY = "mlp_deep_reset_popup_dismissed_v1";

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
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {}
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
            className="liquid-glass-strong relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-black/85 p-6 text-white sm:p-8"
          >
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
                In 90 minutes, you will enter a deeply relaxed, meditative state
                — the kind where the mind slows down enough to actually release
                what it has been holding. From that place, we work directly on
                the beliefs driving your pattern: the ones about your worth,
                your lovability, and what you believe you are allowed to want.
              </p>
              <p>
                This is not talk therapy. It is not coaching. It is a targeted
                reset of the story your nervous system has been running on —
                often since childhood — using a deep, evidence-informed approach
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
              Signe takes a limited number of sessions each month. This is not a
              funnel. It is a real conversation with a real person who has done
              this work herself.
            </p>

            <a
              href={MAILTO}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-3.5 text-sm font-semibold text-black transition hover:bg-white/90"
            >
              Book My Deep Pattern Reset <ArrowUpRight className="h-4 w-4" />
            </a>
            <p className="mt-3 text-center text-[11px] text-white/50">
              This opens your email directly to Signe. She responds to every
              message personally within 48 hours.
            </p>
            <p className="mt-1.5 text-center text-[11px] text-white/45">
              You will be taken to a short intake form. Signe reviews every
              application personally.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
