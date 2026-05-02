import React, { useMemo, useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  ChevronDown,
  Sparkles,
  Check,
  Menu,
  X,
} from "lucide-react";
import { FadingVideo } from "./FadingVideo";
import {
  patterns,
  toolkit,
  quizQuestions,
  VIDEO_URL_HERO,
  VIDEO_URL_DARK,
  HERO_IMAGE,
  CRYSTAL_IMAGE,
  AVATAR_IMAGE,
} from "./data";

export function Nav() {
  const [open, setOpen] = useState(false);
  const links = ["Patterns", "Diagnosis", "Toolkit", "Experience"];
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
            <a key={link} href={`#${link.toLowerCase()}`} className="text-sm text-white/70 transition hover:text-white">
              {link}
            </a>
          ))}
        </nav>
        <a
          href="#diagnosis"
          className="hidden rounded-full bg-white px-4 py-2 text-sm font-semibold text-black md:inline-flex"
        >
          Start Diagnosis
        </a>
        <button onClick={() => setOpen(!open)} aria-label="Open menu" className="md:hidden text-white">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mx-auto mt-2 max-w-6xl rounded-2xl liquid-glass-strong p-2 md:hidden"
          >
            {links.map((link) => (
              <a
                key={link}
                onClick={() => setOpen(false)}
                href={`#${link.toLowerCase()}`}
                className="block rounded-xl px-3 py-3 text-sm text-white/85"
              >
                {link}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const yText = useTransform(scrollYProgress, [0, 0.5], [0, -200]);
  const opacityText = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const yOrb = useTransform(scrollYProgress, [0, 1], [0, -260]);

  return (
    <section id="top" ref={sectionRef} className="relative min-h-screen overflow-hidden">
      <FadingVideo src={VIDEO_URL_HERO} className="absolute inset-0 h-full w-full object-cover" />
      <img src={HERO_IMAGE} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black" />
      <div className="noise absolute inset-0" />

      <motion.div
        style={{ y: yText, opacity: opacityText }}
        className="relative z-10 mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-6 text-center pt-32"
      >
        <div className="mb-6 flex items-center gap-2 rounded-full liquid-glass px-4 py-1.5 text-xs text-white/80">
          <span className="rounded-full bg-white/15 px-2 py-0.5">New</span>
          <span>Relationship Pattern Observatory</span>
        </div>

        <h1 className="font-serif text-5xl leading-[1.05] text-white text-balance md:text-7xl lg:text-8xl">
          Your heart knows the pattern <em className="italic text-white/80">before</em> your mind can name it.
        </h1>

        <p className="mt-6 max-w-2xl text-base text-white/70 md:text-lg text-balance">
          A guided self-worth and relationship clarity system for people who keep getting pulled toward mixed signals,
          unavailable partners, and the fear of not being chosen.
        </p>

        <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
          <a
            href="#diagnosis"
            className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-black transition hover:bg-white/90"
          >
            Start Pattern Diagnosis <ArrowUpRight className="h-4 w-4" />
          </a>
          <a
            href="#toolkit"
            className="inline-flex items-center gap-2 rounded-full liquid-glass px-7 py-3.5 text-sm font-semibold text-white"
          >
            Explore Toolkit
          </a>
        </div>

        <div className="mt-20 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/50">
          Scroll <ChevronDown className="h-3 w-3 animate-bounce" />
        </div>
      </motion.div>

      <motion.div
        style={{ y: yOrb }}
        className="pointer-events-none absolute -bottom-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full"
      >
        <div className="h-full w-full rounded-full bg-gradient-to-tr from-rose-300/20 via-amber-200/10 to-transparent blur-3xl" />
      </motion.div>
    </section>
  );
}

export function PatternSection() {
  return (
    <section id="patterns" className="relative bg-black py-32 px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-20 grid gap-10 md:grid-cols-2 md:items-end">
          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.25em] text-white/50">// Pattern types</p>
            <h2 className="font-serif text-4xl text-white text-balance md:text-6xl">
              The pattern is not random. It is readable.
            </h2>
          </div>
          <p className="text-white/65 text-balance md:text-lg">
            Your diagnosis turns vague relationship pain into a named pattern, a clear trigger map, and a next action.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {patterns.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={p.key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.05 }}
                className="group rounded-3xl liquid-glass-strong p-8"
              >
                <div className="mb-6 flex items-center justify-between">
                  <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10">
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-xs uppercase tracking-[0.2em] text-white/40">Profile {i + 1}</span>
                </div>
                <h3 className="font-serif text-2xl text-white md:text-3xl">{p.title}</h3>
                <p className="mt-3 text-white/65">{p.description}</p>
                <p className="mt-4 border-t border-white/10 pt-4 text-sm italic text-white/55">{p.signal}</p>
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
    const counts = Object.values(answers).reduce<Record<string, number>>((acc, key) => {
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || "validator_seeker";
    return patterns.find((p) => p.key === top) || patterns[2];
  }, [answers]);

  const progress = Object.keys(answers).length / quizQuestions.length;
  const ready = Object.keys(answers).length === quizQuestions.length;

  return (
    <section id="diagnosis" className="relative overflow-hidden bg-black py-32 px-6">
      <FadingVideo src={VIDEO_URL_DARK} className="absolute inset-0 h-full w-full object-cover opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black" />

      <div className="relative mx-auto max-w-4xl">
        <div className="mb-12 text-center">
          <p className="mb-4 text-xs uppercase tracking-[0.25em] text-white/50">// Diagnosis</p>
          <h2 className="font-serif text-4xl text-white text-balance md:text-6xl">
            Meet your relationship profile.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-white/65">
            Answer four questions. Get a fast pattern read. Then unlock the full reset path with the toolkit.
          </p>
          <div className="mx-auto mt-8 h-1 w-full max-w-sm overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full bg-white"
              initial={{ width: 0 }}
              animate={{ width: `${progress * 100}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {!showResult ? (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="rounded-3xl liquid-glass-strong p-6 md:p-10"
            >
              <div className="space-y-10">
                {quizQuestions.map((q, idx) => (
                  <div key={q.id}>
                    <p className="mb-2 text-xs uppercase tracking-[0.2em] text-white/40">Question {idx + 1}</p>
                    <h3 className="font-serif text-2xl text-white md:text-3xl">{q.question}</h3>
                    <div className="mt-5 grid gap-2 md:grid-cols-2">
                      {q.options.map((opt) => {
                        const active = answers[q.id] === opt.pattern;
                        return (
                          <button
                            key={opt.label}
                            onClick={() => setAnswers((a) => ({ ...a, [q.id]: opt.pattern }))}
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
                disabled={!ready}
                onClick={() => setShowResult(true)}
                className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-4 text-sm font-semibold text-black transition disabled:cursor-not-allowed disabled:opacity-35"
              >
                Reveal My Pattern <ArrowUpRight className="h-4 w-4" />
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="rounded-3xl liquid-glass-strong p-6 md:p-10"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-white/40">Your Relationship Pattern Profile</p>
              <h3 className="mt-3 font-serif text-4xl text-white md:text-6xl">{result.title}</h3>
              <p className="mt-4 text-white/70 md:text-lg">{result.description}</p>

              <div className="mt-10 grid gap-4 md:grid-cols-3">
                {["What is happening", "Why it repeats", "Next self-respecting action"].map((title, i) => (
                  <div key={title} className="rounded-2xl bg-white/[0.04] p-5">
                    <p className="text-xs text-white/40">0{i + 1}</p>
                    <p className="mt-2 font-serif text-lg text-white">{title}</p>
                    <p className="mt-3 text-sm text-white/65">
                      {i === 0 && result.signal}
                      {i === 1 &&
                        "The nervous system treats familiar uncertainty as chemistry, then turns attention into evidence of worth."}
                      {i === 2 &&
                        "Pause the chase, track behavior, and let consistency decide access to you."}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#toolkit"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-black"
                >
                  Unlock Full Reset Plan <ArrowUpRight className="h-4 w-4" />
                </a>
                <button
                  onClick={() => {
                    setAnswers({});
                    setShowResult(false);
                  }}
                  className="rounded-full liquid-glass px-7 py-3.5 text-sm font-semibold text-white"
                >
                  Retake Diagnosis
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

export function Toolkit() {
  return (
    <section id="toolkit" className="relative bg-black py-32 px-6">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.25em] text-white/50">// Premium toolkit</p>
            <h2 className="font-serif text-4xl text-white text-balance md:text-6xl">
              Turn insight into a new relationship standard.
            </h2>
            <p className="mt-5 text-white/65 md:text-lg">
              A guided digital system with trackers, scripts, worksheets, and self-soothing protocols to move from
              anxious interpretation to clear action.
            </p>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {toolkit.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-white/80">
                  <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-white/60" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative rounded-3xl liquid-glass-strong p-8">
            <div className="relative mb-6 overflow-hidden rounded-2xl">
              <img src={CRYSTAL_IMAGE} alt="Crystal" className="aspect-[4/3] w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                <p className="font-serif text-2xl text-white">Healthy Love System</p>
                <p className="font-serif text-3xl text-white">€49</p>
              </div>
            </div>
            <p className="text-sm text-white/65">
              Best for buyers who want immediate clarity, practical boundaries, and a structured path through the
              emotional pattern.
            </p>
            <a
              href="#"
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-4 text-sm font-semibold text-black"
            >
              Get the Full Toolkit <ArrowUpRight className="h-4 w-4" />
            </a>
            <p className="mt-3 text-center text-xs text-white/40">Connect this to Stripe, Lemon Squeezy, or Gumroad.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Experience() {
  const ref = useRef<HTMLDivElement>(null);
  const words =
    "This gave me language for the pattern I kept calling chemistry. I finally saw where I was chasing attention instead of choosing consistency."
      .split(" ");
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end center"] });

  return (
    <section id="experience" ref={ref} className="relative bg-black py-40 px-6">
      <div className="mx-auto max-w-4xl text-center">
        <p className="font-serif text-7xl leading-none text-white/20">“</p>
        <p className="mt-4 font-serif text-3xl leading-tight text-balance md:text-5xl">
          {words.map((word, i) => {
            const start = i / words.length;
            const end = (i + 1) / words.length;
            return <FadingWord key={i} word={word} progress={scrollYProgress} start={start} end={end} />;
          })}
          <span className="text-white/30">”</span>
        </p>

        <div className="mt-10 flex items-center justify-center gap-3">
          <img src={AVATAR_IMAGE} alt="Reader" className="h-12 w-12 rounded-full object-cover" />
          <div className="text-left">
            <p className="text-sm text-white">Early Reader</p>
            <p className="text-xs text-white/50">Healthy Love System</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function FadingWord({
  word,
  progress,
  start,
  end,
}: {
  word: string;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  start: number;
  end: number;
}) {
  const opacity = useTransform(progress, [start, end], [0.2, 1]);
  const color = useTransform(progress, [start, end], ["hsl(0 0% 35%)", "hsl(0 0% 100%)"]);
  return (
    <motion.span style={{ opacity, color }} className="mr-[0.25em] inline-block">
      {word}
    </motion.span>
  );
}

export function FooterCTA() {
  return (
    <section className="relative overflow-hidden bg-black py-32 px-6">
      <div className="absolute inset-0 bg-gradient-to-tr from-rose-300/10 via-transparent to-amber-200/10 blur-3xl" />
      <div className="relative mx-auto max-w-3xl text-center">
        <Sparkles className="mx-auto h-6 w-6 text-white/60" />
        <h2 className="mt-6 font-serif text-4xl text-white text-balance md:text-6xl">
          Stop decoding mixed signals. Start choosing clearly.
        </h2>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="#diagnosis"
            className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-black"
          >
            Start Diagnosis <ArrowUpRight className="h-4 w-4" />
          </a>
          <a
            href="#"
            className="inline-flex items-center gap-2 rounded-full liquid-glass px-7 py-3.5 text-sm font-semibold text-white"
          >
            Book Reset Session
          </a>
        </div>
        <p className="mt-16 text-xs text-white/40">© Healthy Love Observatory</p>
      </div>
    </section>
  );
}
