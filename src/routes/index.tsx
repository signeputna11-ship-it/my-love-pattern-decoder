import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { FrontFooter, FrontNav } from "@/components/front/FrontShell";
import { JOURNEYS } from "@/lib/quiz";
import portrait from "@/assets/signe-portrait.png";

export const Route = createFileRoute("/")({
  component: FrontDoor,
  head: () => ({
    meta: [
      { title: "Signe Coach · Find your starting point" },
      {
        name: "description",
        content:
          "A private space for women who are ready to grow. Take a two-minute quiz, find your starting point and begin with guided audio and workbooks.",
      },
      { property: "og:title", content: "Signe Coach · Find your starting point" },
      { property: "og:description", content: "Two minutes. One starting point. Guided audio and workbooks built around you." },
    ],
  }),
});

const STEPS = [
  { n: "01", title: "Answer a few questions", body: "Seven short questions, about two minutes. No wrong answers." },
  { n: "02", title: "Meet your starting point", body: "See which area to begin with, and why it fits you." },
  { n: "03", title: "Begin with Signe", body: "Guided audio, private workbooks and gentle daily support, at your own pace." },
];

function FrontDoor() {
  return (
    <div>
      <FrontNav />
      <main>
        <section className="mx-auto max-w-4xl px-5 pb-8 pt-16 text-center sm:px-8 sm:pt-24">
          <p className="mx-auto inline-block rounded-full border border-foreground/15 bg-white/60 px-4 py-1.5 text-[11px] uppercase tracking-[0.25em] text-foreground/70">
            A private space for women who are ready to grow
          </p>
          <h1 className="mt-8 font-serif text-5xl leading-[1.05] sm:text-7xl">
            You know what you want to say.
            <br />
            <span className="italic text-foreground/70">Then you soften it.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-foreground/75">
            Take a two-minute quiz, find where to begin, and start with guided audio and workbooks built around you.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/quiz" className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-base font-medium text-primary-foreground">
              Find my starting point <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/auth" className="rounded-full border border-foreground/20 bg-white/50 px-7 py-4 text-base hover:bg-white/80">
              I already have an account
            </Link>
          </div>
          <p className="mt-4 text-sm text-foreground/55">Free to start. No card needed.</p>
        </section>

        <section className="mx-auto mt-16 max-w-6xl px-5 sm:px-8">
          <h2 className="text-center font-serif text-3xl sm:text-4xl">Six places to begin</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(Object.keys(JOURNEYS) as (keyof typeof JOURNEYS)[]).map((k) => (
              <Link key={k} to="/quiz" className="liquid-glass group block rounded-3xl p-6 transition hover:bg-white/80">
                <h3 className="font-serif text-2xl">{JOURNEYS[k].title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-foreground/70">{JOURNEYS[k].tagline}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm text-foreground/60 group-hover:text-foreground">
                  Is this my starting point? <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-24 max-w-6xl px-5 sm:px-8">
          <h2 className="text-center font-serif text-3xl sm:text-4xl">How it works</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.n} className="liquid-glass-strong rounded-3xl p-6">
                <p className="text-xs tracking-[0.3em] text-foreground/50">{s.n}</p>
                <h3 className="mt-3 font-serif text-2xl">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-foreground/70">{s.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-24 grid max-w-5xl items-center gap-8 px-5 sm:px-8 md:grid-cols-[280px_1fr]">
          <div className="liquid-glass overflow-hidden rounded-3xl p-2">
            <img src={portrait} alt="Signe Putna" className="aspect-[4/5] w-full rounded-[1.25rem] object-cover" loading="lazy" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-foreground/55">Your guide</p>
            <h2 className="mt-3 font-serif text-3xl sm:text-4xl">Hello, I am Signe.</h2>
            <p className="mt-4 leading-relaxed text-foreground/75">
              I am a holistic coach and certified RTT practitioner. My own path included years in luxury yachting, and I
              work with women who want to speak more clearly, trust their decisions and build a life that fits them.
              Everything here is made in that spirit: warm, practical and at your pace.
            </p>
          </div>
        </section>

        <section className="mx-auto mt-24 max-w-3xl px-5 text-center sm:px-8">
          <div className="liquid-glass-strong rounded-3xl p-8 sm:p-12">
            <h2 className="font-serif text-3xl sm:text-4xl">Start free. Grow when you are ready.</h2>
            <p className="mt-3 text-foreground/70">
              Your quiz result and a free guided audio cost nothing. Members open every journey, workbook and audio for 4,99 € a month.
            </p>
            <Link to="/quiz" className="mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-base font-medium text-primary-foreground">
              Find my starting point <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
      <FrontFooter />
    </div>
  );
}
