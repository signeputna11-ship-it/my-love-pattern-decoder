import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Heart,
  Sparkles,
  Shield,
  Eye,
  Waves,
  Brain,
  Check,
  Menu,
  X,
} from "lucide-react";
import { patterns, toolkit, quizQuestions, VIDEOS } from "./data";

function BackgroundVideo({ src }: { src: string }) {
  return (
    <video
      key={src}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      className="absolute inset-0 z-0 h-full w-full object-cover"
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}

export function Nav() {
  const [open, setOpen] = useState(false);
  const links: { label: string; href: string }[] = [
    { label: "Home", href: "#top" },
    { label: "Patterns", href: "#patterns" },
    { label: "Diagnosis", href: "#diagnosis" },
    { label: "Reset", href: "#toolkit" },
    { label: "Path", href: "#experience" },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4">
      <div className="mx-auto flex max-w-6xl items-center justify-between rounded-full liquid-glass px-4 py-3">
        <a href="#top" className="flex items-center gap-2 text-white">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-white/10">
            <Sparkles className="h-4 w-4" />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="font-serif text-lg">My Love Pattern</span>
            <span className="hidden text-[10px] text-white/55 sm:block">
              Understand why it keeps happening.
            </span>
          </span>
        </a>
        <nav className="hidden items-center gap-7 md:flex">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-white/70 transition hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <a
          href="#diagnosis"
          className="hidden rounded-full bg-white px-4 py-2 text-sm font-semibold text-black md:inline-flex"
        >
          Find My Pattern
        </a>
        <button
          onClick={() => setOpen(!open)}
          aria-label="Open menu"
          className="md:hidden text-white"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="mx-auto mt-2 max-w-6xl rounded-3xl liquid-glass p-3 md:hidden">
          {links.map((link) => (
            <a
              key={link.label}
              onClick={() => setOpen(false)}
              href={link.href}
              className="block rounded-xl px-3 py-3 text-sm text-white/85"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}

export function Hero() {
  return (
    <section id="top" className="relative min-h-screen overflow-hidden bg-black">
      <BackgroundVideo src={VIDEOS.hero} />
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-4 pb-16 pt-28 text-center sm:px-6 sm:pt-32">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="liquid-glass mb-6 inline-flex max-w-full rounded-full px-3 py-1.5 text-[9px] uppercase tracking-[0.18em] text-white/80 sm:mb-8 sm:px-4 sm:text-[11px] sm:tracking-[0.2em]"
        >
          <span className="truncate">My Love Pattern · Pattern Diagnosis</span>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1 }}
          className="font-serif text-[2.25rem] leading-[1.05] text-white text-balance sm:text-5xl md:text-7xl"
        >
          You don't have a dating problem.
          <br />
          <em className="italic text-white/85">You have a pattern.</em>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mt-6 max-w-2xl text-sm leading-relaxed text-white/75 sm:mt-8 sm:text-base md:text-lg"
        >
          You keep getting pulled into the same kind of connection —
          mixed signals, uncertainty, emotional highs and lows.
          This shows you exactly why… and what to do instead.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="mt-8 flex w-full flex-col items-stretch gap-3 sm:mt-10 sm:w-auto sm:flex-row sm:items-center"
        >
          <a
            href="#diagnosis"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-black transition hover:bg-white/90 sm:px-7"
          >
            Find My Pattern <ArrowUpRight className="h-4 w-4" />
          </a>
          <a
            href="#patterns"
            className="liquid-glass inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold text-white sm:px-7"
          >
            See How It Works
          </a>
        </motion.div>
        <p className="mt-6 text-xs text-white/55">
          Most people recognize their pattern in under 2 minutes.
        </p>
      </div>
    </section>
  );
}

export function PatternSection() {
  return (
    <section id="patterns" className="relative min-h-screen overflow-hidden bg-black py-20 sm:py-32">
      <BackgroundVideo src={VIDEOS.pattern} />
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-white/55 sm:mb-4 sm:text-xs sm:tracking-[0.25em]">
            // You feel it when they pull away.
          </p>
          <h2 className="font-serif text-[2rem] leading-tight text-white sm:text-4xl md:text-6xl">
            You've seen this <em className="italic text-white/75">before…</em>
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-white/75 sm:mt-6 sm:text-base">
            When the same emotional loop keeps repeating, the problem is not your worth.
            It is the pattern your nervous system keeps following.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:mt-16 sm:gap-5 md:grid-cols-2 lg:grid-cols-4">
          {patterns.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={p.key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, delay: i * 0.08 }}
                className="liquid-glass-strong rounded-2xl p-5 sm:rounded-3xl sm:p-6"
              >
                <div className="flex items-center justify-between">
                  <span className="grid h-10 w-10 place-items-center rounded-2xl bg-white/10 sm:h-11 sm:w-11">
                    <Icon className="h-5 w-5 text-white" />
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-white/45">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-4 font-serif text-xl text-white sm:mt-5 sm:text-2xl">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/75 sm:mt-3">{p.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function Diagnosis() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResult, setShowResult] = useState(false);

  const result = useMemo(() => {
    const counts: Record<string, number> = {};
    Object.values(answers).forEach((key) => {
      counts[key] = (counts[key] || 0) + 1;
    });
    const top =
      Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || "validator_seeker";
    return patterns.find((p) => p.key === top) || patterns[2];
  }, [answers]);

  const progress = Object.keys(answers).length / quizQuestions.length;
  const allAnswered = Object.keys(answers).length === quizQuestions.length;

  return (
    <section id="diagnosis" className="relative min-h-screen overflow-hidden bg-black py-20 sm:py-32">
      <BackgroundVideo src={VIDEOS.diagnosis} />
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6">
        <div className="text-center">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-white/55 sm:mb-4 sm:text-xs sm:tracking-[0.25em]">
            // Now you can see it clearly.
          </p>
          <h2 className="font-serif text-[2rem] leading-tight text-white sm:text-4xl md:text-6xl">
            This takes 60 seconds.
            <br />
            <em className="italic text-white/75">You'll see your pattern clearly.</em>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-sm text-white/75 sm:mt-6 sm:text-base">
            Answer four questions and get your relationship pattern profile.
          </p>
          <div className="mx-auto mt-6 h-1 w-48 overflow-hidden rounded-full bg-white/10 sm:mt-8 sm:w-64">
            <div
              className="h-full bg-white transition-all duration-500"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </div>

        <div className="mt-10 sm:mt-12">
          {!showResult ? (
            <>
              <div className="space-y-4 sm:space-y-5">
                {quizQuestions.map((q, idx) => (
                  <div key={q.id} className="liquid-glass-strong rounded-2xl p-5 sm:rounded-3xl sm:p-6 md:p-8">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-white/45">
                      Question {idx + 1}
                    </p>
                    <h3 className="mt-2 font-serif text-xl text-white sm:text-2xl md:text-3xl">
                      {q.question}
                    </h3>
                    <div className="mt-4 grid gap-2.5 sm:mt-5 sm:gap-3 md:grid-cols-2">
                      {q.options.map((opt) => {
                        const active = answers[q.id] === opt.pattern;
                        return (
                          <button
                            key={opt.label}
                            onClick={() =>
                              setAnswers((a) => ({ ...a, [q.id]: opt.pattern }))
                            }
                            className={`rounded-xl px-3.5 py-3 text-left text-sm leading-5 transition sm:rounded-2xl sm:px-4 ${
                              active
                                ? "bg-white text-black"
                                : "bg-white/[0.04] text-white/80 hover:bg-white/[0.08]"
                            }`}
                          >
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
              <button
                disabled={!allAnswered}
                onClick={() => setShowResult(true)}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-4 text-sm font-semibold text-black transition disabled:cursor-not-allowed disabled:opacity-35"
              >
                Reveal My Pattern <ArrowUpRight className="h-4 w-4" />
              </button>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="liquid-glass-strong rounded-2xl p-6 sm:rounded-3xl sm:p-8 md:p-12"
            >
              <p className="font-mono text-[10px] uppercase tracking-widest text-white/45">
                Your Love Pattern
              </p>
              <h3 className="mt-3 font-serif text-3xl text-white sm:text-4xl md:text-5xl">{result.title}</h3>
              <p className="mt-4 max-w-2xl text-sm text-white/80 sm:text-base">{result.description}</p>

              <div className="mt-8 grid gap-4 sm:mt-10 sm:gap-5 md:grid-cols-3">
                <div className="rounded-2xl border border-white/10 p-4 sm:p-5">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-white/45">01</p>
                  <p className="mt-2 font-serif text-lg text-white">What's actually happening</p>
                  <p className="mt-2 text-sm text-white/75">
                    You move closer when connection feels uncertain.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 p-4 sm:p-5">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-white/45">02</p>
                  <p className="mt-2 font-serif text-lg text-white">Why it repeats</p>
                  <p className="mt-2 text-sm text-white/75">
                    Your nervous system reads inconsistency as something to solve —
                    not something to step away from.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 p-4 sm:p-5">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-white/45">03</p>
                  <p className="mt-2 font-serif text-lg text-white">What changes everything</p>
                  <p className="mt-2 text-sm text-white/75">
                    You stop responding to intensity
                    and start responding to consistency.
                  </p>
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row">
                <a
                  href="#toolkit"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-black"
                >
                  Unlock My Reset <ArrowUpRight className="h-4 w-4" />
                </a>
                <button
                  onClick={() => {
                    setAnswers({});
                    setShowResult(false);
                  }}
                  className="liquid-glass rounded-full px-7 py-3.5 text-sm font-semibold text-white"
                >
                  Retake
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}

export function Toolkit() {
  const transformations = [
    "You stop overthinking messages",
    "You stop chasing clarity",
    "You stop mistaking anxiety for chemistry",
    "You start choosing based on behavior",
  ];

  return (
    <section id="toolkit" className="relative min-h-screen overflow-hidden bg-black py-32">
      <BackgroundVideo src={VIDEOS.toolkit} />
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <p className="mb-6 font-mono text-xs uppercase tracking-[0.25em] text-white/55">
          // This is where it changes.
        </p>
        <div className="grid items-start gap-12 lg:grid-cols-2">
          <div>
            <h2 className="font-serif text-4xl leading-tight text-white md:text-6xl">
              This is where things <em className="italic text-white/75">actually change.</em>
            </h2>
            <p className="mt-6 max-w-lg text-white/75">
              You don't need more advice.
              You need a reset you can use in real time.
            </p>

            <ul className="mt-10 space-y-3">
              {transformations.map((item) => (
                <li key={item} className="flex items-center gap-3 text-base text-white/90">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-white/10">
                    <Check className="h-3.5 w-3.5 text-white" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-10 border-t border-white/10 pt-6">
              <p className="text-xs uppercase tracking-widest text-white/45">Inside</p>
              <ul className="mt-4 grid gap-2 text-sm text-white/70 sm:grid-cols-2">
                {toolkit.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-2 h-1 w-1 rounded-full bg-white/40" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="liquid-glass-strong rounded-3xl p-8 md:p-10">
            <div className="flex items-baseline justify-between">
              <div>
                <p className="font-serif text-2xl text-white">My Reset</p>
                <p className="mt-1 text-xs uppercase tracking-widest text-white/45">
                  Lifetime access
                </p>
              </div>
              <p className="font-serif text-5xl text-white">€49</p>
            </div>

            <div className="my-8 h-px w-full bg-white/10" />

            <p className="text-sm text-white/75">
              For people who already know the pattern — and are ready to stop living it.
            </p>

            <button className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-4 text-sm font-semibold text-black">
              Get My Reset (€49) <ArrowUpRight className="h-4 w-4" />
            </button>

            <p className="mt-4 text-center text-[11px] text-white/50">
              Instant access. Start immediately.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ExperiencePortal() {
  const modules: [string, string, React.ComponentType<{ className?: string }>][] = [
    ["Pattern Reveal", "Map the repeated dynamic and name what is actually happening.", Heart],
    ["Trigger Reset", "Calm the anxiety spike before it becomes a chase response.", Waves],
    ["Self-Worth Rebuild", "Separate your value from attention, silence, and being chosen.", Sparkles],
    ["Boundaries", "Turn your needs into clear words and protected decisions.", Shield],
    ["Relationship Decision", "Choose from evidence instead of chemistry, hope, or fear.", Brain],
  ];

  return (
    <section id="experience" className="relative min-h-screen overflow-hidden bg-black py-32">
      <BackgroundVideo src={VIDEOS.experience} />
      <div className="absolute inset-0 bg-black/70" />
      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <div className="max-w-3xl">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.25em] text-white/55">
            // You respond differently now.
          </p>
          <h2 className="font-serif text-4xl leading-tight text-white md:text-6xl">
            Your Reset <em className="italic text-white/75">Path.</em>
          </h2>
          <p className="mt-6 max-w-2xl text-white/80">
            Move from understanding
            to choosing differently.
          </p>
          <p className="mt-3 text-xs text-white/55">
            Most people complete this in 2–3 sittings.
          </p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {modules.map(([title, desc, Icon], i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: i * 0.08 }}
              className="liquid-glass-strong flex flex-col rounded-3xl p-6"
            >
              <div className="flex items-center justify-between">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10">
                  <Icon className="h-5 w-5 text-white" />
                </span>
                <span
                  aria-label="Completion"
                  className="grid h-9 w-9 place-items-center rounded-full border border-white/20 text-[10px] font-mono text-white/55"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="mt-5 font-serif text-2xl text-white">{title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-white/75">{desc}</p>
              <button className="liquid-glass mt-6 inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-xs font-semibold uppercase tracking-widest text-white">
                Start Module <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FinalCTA() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-black py-32">
      <BackgroundVideo src={VIDEOS.final} />
      <div className="absolute inset-0 bg-black/65" />
      <div className="relative z-10 mx-auto flex min-h-[70vh] max-w-4xl flex-col items-center justify-center px-6 text-center">
        <h2 className="font-serif text-4xl leading-tight text-white md:text-6xl">
          You already know this pattern.
          <br />
          You've lived it.
          <br />
          <em className="italic text-white/85">Now you can finally change it.</em>
        </h2>
        <div className="mt-12 flex flex-col items-center gap-3 sm:flex-row">
          <a
            href="#toolkit"
            className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-semibold text-black transition hover:bg-white/90"
          >
            Start My Reset <ArrowUpRight className="h-4 w-4" />
          </a>
          <a
            href="#diagnosis"
            className="liquid-glass inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-semibold text-white"
          >
            Find My Pattern
          </a>
        </div>
        <p className="mt-6 text-xs text-white/65">
          Start with the diagnosis. Unlock the reset when you're ready.
        </p>
        <p className="mt-20 text-xs text-white/40">
          © {new Date().getFullYear()} My Love Pattern. Understand why it keeps happening.
        </p>
      </div>
    </section>
  );
}
