import { ArrowUpRight } from "lucide-react";

const MAILTO =
  "https://calendly.com/mylovepattern/30min";

export function DeepResetSection() {
  return (
    <section
      id="deep-reset"
      className="relative overflow-hidden bg-black py-20 sm:py-32"
    >
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 z-0 h-full w-full object-cover opacity-40"
        src="https://pub-687d7fb8b7f44636a61754dc527f9690.r2.dev/GEM%20SPARKLE.mp4"
      preload="metadata" />
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/70 via-black/75 to-black/85" />
      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6">
        <p className="text-center font-mono text-[10px] uppercase tracking-[0.2em] text-white/55 sm:text-xs">
          For when you're ready to go all the way
        </p>
        <h2 className="mt-5 text-center font-serif text-[2rem] leading-tight text-white sm:text-4xl md:text-6xl">
          The Deep Pattern Reset
          <br />
          <em className="italic text-white/75" style={{ textWrap: "balance" }}>
            One session. A different{" "}
            <span style={{ whiteSpace: "nowrap" }}>nervous system story.</span>
          </em>
        </h2>

        <div className="liquid-glass-strong mt-10 rounded-2xl p-6 sm:mt-14 sm:rounded-3xl sm:p-10">
          <p className="text-sm leading-relaxed text-white/80 sm:text-base">
            If you have tried understanding your pattern and still feel stuck in
            it, this is why: patterns do not live in the mind. They live in the
            body, in the nervous system, in the part of you that formed its
            beliefs about love before you had language for any of it.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-white/80 sm:text-base">
            The Deep Pattern Reset is a 90-minute private session with Signe.
            You will enter a deeply relaxed, meditative state and we will work
            at the level where the pattern actually operates. Not managing it.
            Resetting it.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-white/80 sm:text-base">
            Every session includes a personalised 21-day audio meditation so the
            shift you make in the session continues to integrate long after it
            ends.
          </p>

          <div className="mt-8 border-t border-white/10 pt-6">
            <p className="text-[10px] uppercase tracking-widest text-white/45 sm:text-xs">
              What is included
            </p>
            <ul className="mt-4 space-y-2.5 text-sm text-white/80">
              <li>✦ 90-minute private session with Signe</li>
              <li>✦ Personalised 21-day reset audio meditation</li>
              <li>✦ Pre-session pattern worksheet</li>
              <li>✦ Follow-up voice note within 48 hours</li>
            </ul>
          </div>

          <div className="mt-8 flex items-baseline justify-between gap-3 border-t border-white/10 pt-6">
            <p className="text-[10px] uppercase tracking-widest text-white/45 sm:text-xs">
              Investment
            </p>
            <p className="font-serif text-4xl text-white sm:text-5xl">$333</p>
          </div>

          <a
            href={MAILTO} target="_blank" rel="noopener noreferrer"
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-4 text-sm font-semibold text-black transition hover:bg-white/90"
          >
            Email Signe to arrange a discovery call <ArrowUpRight className="h-4 w-4" />
          </a>
          <p className="mt-3 text-center text-[11px] text-white/50">
            The discovery call is a short conversation to make sure this is the
            right fit for you. Signe responds personally within 48 hours.
          </p>
        </div>
      </div>
    </section>
  );
}
