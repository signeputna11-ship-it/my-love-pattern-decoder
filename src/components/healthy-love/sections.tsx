import React, { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
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
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <video
        src={src}
        autoPlay
        muted
        loop
        playsInline
        className="h-full w-full object-cover opacity-60"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-black" />
    </div>
  );
}

export function Nav() {
  const [open, setOpen] = useState(false);
  const links: { label: string; href: string }[] = [
    { label: "Home", href: "#top" },
    { label: "Patterns", href: "#patterns" },
    { label: "Diagnosis", href: "#diagnosis" },
    { label: "Toolkit", href: "#toolkit" },
    { label: "Experience", href: "#experience" },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4">
      <div className="mx-auto flex max-w-6xl items-center justify-between rounded-full liquid-glass px-4 py-3">
        <a href="#top" className="flex items-center gap-2 text-white">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-white/10">
            <Sparkles className="h-4 w-4" />
          </span>
          <span className="font-serif text-lg">Healthy Love</span>
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
          Start Diagnosis
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
    <section id="top" className="relative min-h-screen overflow-hidden">
      <BackgroundVideo src={VIDEOS.hero} />
      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 pt-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="liquid-glass mb-8 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-white/80"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-white" />
          New · Relationship Pattern Observatory
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.1 }}
          className="font-serif text-5xl leading-[1.05] text-white text-balance md:text-7xl"
        >
          Your heart knows the pattern before your mind can{" "}
          <em className="italic text-white/80">name it.</em>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.25 }}
          className="mt-6 max-w-2xl text-base leading-relaxed text-white/70 md:text-lg"
        >
          A guided self-worth and relationship clarity system for people who keep getting pulled
          toward mixed signals, unavailable partners, and the fear of not being chosen.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="mt-10 flex flex-col items-center gap-3 sm:flex-row"
        >
          <a
            href="#diagnosis"
            className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-black transition hover:bg-white/90"
          >
            Start Pattern Diagnosis <ArrowUpRight className="h-4 w-4" />
          </a>
          <a
            href="#toolkit"
            className="liquid-glass inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-white"
          >
            Explore Toolkit
          </a>
        </motion.div>
      </div>
    </section>
  );
}

export function PatternSection() {
  return (
    <section id="patterns" className="relative overflow-hidden py-32">
      <BackgroundVideo src={VIDEOS.pattern} />
      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.25em] text-white/50">
            // Pattern types
          </p>
          <h2 className="font-serif text-4xl leading-tight text-white md:text-6xl">
            The pattern is not random.{" "}
            <em className="italic text-white/70">It is readable.</em>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-white/65">
            Your diagnosis turns vague relationship pain into a named pattern, a clear trigger map,
            and a next action.
          </p>
        </div>

        <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {patterns.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={p.key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, delay: i * 0.08 }}
                className="liquid-glass-strong rounded-3xl p-6"
              >
                <div className="flex items-center justify-between">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10">
                    <Icon className="h-5 w-5 text-white" />
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-white/45">
                    Profile {i + 1}
                  </span>
                </div>
                <h3 className="mt-5 font-serif text-2xl text-white">{p.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/70">{p.description}</p>
                <p className="mt-5 border-t border-white/10 pt-4 text-xs italic text-white/55">
                  {p.signal}
                </p>
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
    <section id="diagnosis" className="relative overflow-hidden py-32">
      <BackgroundVideo src={VIDEOS.diagnosis} />
      <div className="relative mx-auto max-w-4xl px-6">
        <div className="text-center">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.25em] text-white/50">
            // Diagnosis
          </p>
          <h2 className="font-serif text-4xl leading-tight text-white md:text-6xl">
            Meet your <em className="italic text-white/70">relationship profile.</em>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-white/65">
            Answer four questions. Get a fast pattern read. Then unlock the full reset experience.
          </p>
          <div className="mx-auto mt-8 h-1 w-64 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full bg-white transition-all duration-500"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </div>

        <div className="mt-12">
          {!showResult ? (
            <>
              <div className="space-y-5">
                {quizQuestions.map((q, idx) => (
                  <div key={q.id} className="liquid-glass-strong rounded-3xl p-6 md:p-8">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-white/45">
                      Question {idx + 1}
                    </p>
                    <h3 className="mt-2 font-serif text-2xl text-white md:text-3xl">
                      {q.question}
                    </h3>
                    <div className="mt-5 grid gap-3 md:grid-cols-2">
                      {q.options.map((opt) => {
                        const active = answers[q.id] === opt.pattern;
                        return (
                          <button
                            key={opt.label}
                            onClick={() =>
                              setAnswers((a) => ({ ...a, [q.id]: opt.pattern }))
                            }
                            className={`rounded-2xl px-4 py-3 text-left text-sm leading-5 transition ${
                              active
                                ? "bg-white text-black"
                                : "bg-white/[0.04] text-white/75 hover:bg-white/[0.08]"
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
              className="liquid-glass-strong rounded-3xl p-8 md:p-12"
            >
              <p className="font-mono text-[10px] uppercase tracking-widest text-white/45">
                Your Relationship Pattern Profile
              </p>
              <h3 className="mt-3 font-serif text-4xl text-white md:text-5xl">{result.title}</h3>
              <p className="mt-4 max-w-2xl text-white/70">{result.description}</p>

              <div className="mt-10 grid gap-5 md:grid-cols-3">
                <div className="rounded-2xl border border-white/10 p-5">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-white/45">01</p>
                  <p className="mt-2 font-serif text-lg text-white">What is happening</p>
                  <p className="mt-2 text-sm text-white/70">{result.signal}</p>
                </div>
                <div className="rounded-2xl border border-white/10 p-5">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-white/45">02</p>
                  <p className="mt-2 font-serif text-lg text-white">Why it repeats</p>
                  <p className="mt-2 text-sm text-white/70">
                    Your nervous system treats familiar uncertainty as chemistry, then turns
                    attention into evidence of worth.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 p-5">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-white/45">03</p>
                  <p className="mt-2 font-serif text-lg text-white">Next action</p>
                  <p className="mt-2 text-sm text-white/70">
                    Pause the chase, track behavior, and let consistency decide access to you.
                  </p>
                </div>
              </div>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#toolkit"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-black"
                >
                  Unlock Full Reset Experience <ArrowUpRight className="h-4 w-4" />
                </a>
                <button
                  onClick={() => {
                    setAnswers({});
                    setShowResult(false);
                  }}
                  className="liquid-glass rounded-full px-7 py-3.5 text-sm font-semibold text-white"
                >
                  Retake Diagnosis
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
  return (
    <section id="toolkit" className="relative overflow-hidden py-32">
      <BackgroundVideo src={VIDEOS.toolkit} />
      <div className="relative mx-auto max-w-6xl px-6">
        <div className="grid items-start gap-12 lg:grid-cols-2">
          <div>
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.25em] text-white/50">
              // Full reset experience
            </p>
            <h2 className="font-serif text-4xl leading-tight text-white md:text-6xl">
              Turn insight into a new{" "}
              <em className="italic text-white/70">relationship standard.</em>
            </h2>
            <p className="mt-6 max-w-lg text-white/65">
              A guided digital system with trackers, scripts, worksheets, and self-soothing
              protocols to move from anxious interpretation to clear action.
            </p>

            <ul className="mt-10 space-y-3">
              {toolkit.map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-white/85">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-white/10">
                    <Check className="h-3.5 w-3.5 text-white" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="liquid-glass-strong rounded-3xl p-8 md:p-10">
            <div className="flex items-baseline justify-between">
              <div>
                <p className="font-serif text-2xl text-white">Healthy Love System</p>
                <p className="mt-1 text-xs uppercase tracking-widest text-white/45">
                  Lifetime access
                </p>
              </div>
              <p className="font-serif text-5xl text-white">€49</p>
            </div>

            <div className="my-8 h-px w-full bg-white/10" />

            <p className="text-sm text-white/70">
              Best for buyers who want immediate clarity, practical boundaries, and a structured
              path through the emotional pattern.
            </p>

            {/*
              Future: connect this button to Stripe Checkout.
              After successful payment, redirect buyers to /experience.
              Supabase can later store user purchase + module progress.
            */}
            <button className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-4 text-sm font-semibold text-black">
              Purchase the Experience <ArrowUpRight className="h-4 w-4" />
            </button>

            <p className="mt-4 text-center text-[11px] text-white/40">
              Connects to Stripe. After payment, buyers are redirected to /experience.
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
    ["Boundaries & Standards", "Turn your needs into clear words and protected decisions.", Shield],
    ["Relationship Decision", "Choose from evidence instead of chemistry, hope, or fear.", Brain],
  ];

  return (
    <section id="experience" className="relative overflow-hidden py-32">
      <BackgroundVideo src={VIDEOS.toolkit} />
      <div className="relative mx-auto max-w-6xl px-6">
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.25em] text-white/50">
          // Post-purchase portal
        </p>
        <h2 className="max-w-3xl font-serif text-4xl leading-tight text-white md:text-6xl">
          Your Relationship Reset{" "}
          <em className="italic text-white/70">Experience.</em>
        </h2>
        <p className="mt-6 max-w-2xl text-white/65">
          After purchase, users enter this guided portal. Each module includes teaching, interactive
          questions, saved answers, downloadable tools, and a completion step.
        </p>

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {modules.map(([title, desc, Icon], i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: i * 0.08 }}
              className="liquid-glass-strong rounded-3xl p-6"
            >
              <div className="flex items-center justify-between">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10">
                  <Icon className="h-5 w-5 text-white" />
                </span>
                {/* Completion circle — future: bind to Supabase user progress */}
                <span className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-[10px] font-mono text-white/55">
                  {i + 1}
                </span>
              </div>
              <h3 className="mt-5 font-serif text-2xl text-white">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/70">{desc}</p>
              <button className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-semibold text-black">
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
    <section className="relative overflow-hidden py-32">
      <BackgroundVideo src={VIDEOS.hero} />
      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <Sparkles className="mx-auto h-6 w-6 text-white/70" />
        <h2 className="mt-6 font-serif text-4xl leading-tight text-white md:text-6xl">
          Stop decoding mixed signals.{" "}
          <em className="italic text-white/70">Start choosing clearly.</em>
        </h2>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="#diagnosis"
            className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-black"
          >
            Start Diagnosis <ArrowUpRight className="h-4 w-4" />
          </a>
          <a
            href="#toolkit"
            className="liquid-glass inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-white"
          >
            Get the Toolkit <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
        <p className="mt-16 text-xs text-white/40">
          © {new Date().getFullYear()} Healthy Love Observatory. Crafted with intention.
        </p>
      </div>
    </section>
  );
}
