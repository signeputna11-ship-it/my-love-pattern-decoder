import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { FrontFooter, FrontNav } from "@/components/front/FrontShell";
import { JOURNEYS, QUIZ, type JourneyKey } from "@/lib/quiz";
import { CONSENT_TEXT, submitQuiz } from "@/lib/server-fns/quiz.functions";

export const Route = createFileRoute("/quiz")({
  component: QuizPage,
  head: () => ({
    meta: [
      { title: "Find your starting point · Signe Coach" },
      { name: "description", content: "A two-minute quiz that shows you where to begin: confidence, self-worth, money, business, purpose or relationships." },
    ],
  }),
});

type Phase = "questions" | "email" | "result";

function QuizPage() {
  const [phase, setPhase] = useState<Phase>("questions");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ primary: JourneyKey; secondary: JourneyKey | null } | null>(null);

  const q = QUIZ[step];

  const choose = (i: number) => {
    const next = [...answers.slice(0, step), i];
    setAnswers(next);
    if (step + 1 < QUIZ.length) setStep(step + 1);
    else setPhase("email");
  };

  const back = () => {
    if (phase === "email") {
      setPhase("questions");
      setStep(QUIZ.length - 1);
    } else if (step > 0) setStep(step - 1);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const r = await submitQuiz({ data: { answers, email, firstName, marketingConsent: consent, website } });
      setResult(r);
      setPhase("result");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const restart = () => {
    setPhase("questions");
    setStep(0);
    setAnswers([]);
    setResult(null);
  };

  return (
    <div>
      <FrontNav />
      <main className="mx-auto max-w-2xl px-5 pt-10 sm:px-8 sm:pt-16">
        {phase === "questions" && q && (
          <section className="liquid-glass-strong rounded-3xl p-6 sm:p-10" aria-live="polite">
            <div className="flex items-center justify-between text-xs uppercase tracking-widest text-foreground/60">
              <span>
                Question {step + 1} of {QUIZ.length}
              </span>
              {step > 0 && (
                <button onClick={back} className="inline-flex items-center gap-1 hover:text-foreground">
                  <ArrowLeft className="h-3.5 w-3.5" /> Back
                </button>
              )}
            </div>
            <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-foreground/10">
              <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${((step + 1) / QUIZ.length) * 100}%` }} />
            </div>
            <h1 className="mt-8 font-serif text-3xl leading-tight sm:text-4xl">{q.prompt}</h1>
            <div className="mt-6 space-y-3">
              {q.options.map((o, i) => (
                <button
                  key={o.label}
                  onClick={() => choose(i)}
                  className={`w-full rounded-2xl border px-5 py-4 text-left text-[15px] transition hover:bg-white ${
                    answers[step] === i ? "border-primary bg-white" : "border-foreground/15 bg-white/60"
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </section>
        )}

        {phase === "email" && (
          <section className="liquid-glass-strong rounded-3xl p-6 sm:p-10">
            <button onClick={back} className="inline-flex items-center gap-1 text-xs uppercase tracking-widest text-foreground/60 hover:text-foreground">
              <ArrowLeft className="h-3.5 w-3.5" /> Back
            </button>
            <h1 className="mt-6 font-serif text-3xl leading-tight sm:text-4xl">Your starting point is ready.</h1>
            <p className="mt-3 text-foreground/70">Where should we save it? Your answers stay private.</p>
            <form onSubmit={submit} className="mt-6 space-y-3">
              <input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First name (optional)"
                autoComplete="given-name"
                className="w-full rounded-2xl border border-foreground/15 bg-white/70 px-4 py-3 text-sm placeholder:text-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                autoComplete="email"
                className="w-full rounded-2xl border border-foreground/15 bg-white/70 px-4 py-3 text-sm placeholder:text-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <input
                tabIndex={-1}
                autoComplete="off"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="absolute left-[-9999px] h-0 w-0 opacity-0"
                aria-hidden
              />
              <label className="flex cursor-pointer items-start gap-3 text-sm text-foreground/70">
                <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 h-4 w-4 accent-[#173D34]" />
                <span>{CONSENT_TEXT}</span>
              </label>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <button
                type="submit"
                disabled={busy}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-medium text-primary-foreground disabled:opacity-50"
              >
                {busy && <Loader2 className="h-4 w-4 animate-spin" />} Show my starting point
              </button>
              <p className="text-xs text-foreground/50">We use your email to save your result. Marketing emails only if you tick the box above.</p>
            </form>
          </section>
        )}

        {phase === "result" && result && (
          <section className="liquid-glass-strong rounded-3xl p-6 sm:p-10">
            <p className="text-xs uppercase tracking-[0.3em] text-foreground/60">Your starting point</p>
            <h1 className="mt-3 font-serif text-5xl leading-none sm:text-6xl">{JOURNEYS[result.primary].title}</h1>
            <p className="mt-2 font-serif text-xl italic text-foreground/70">{JOURNEYS[result.primary].tagline}</p>
            <p className="mt-6 text-[15px] leading-relaxed text-foreground/80">{JOURNEYS[result.primary].reflection}</p>
            {result.secondary && (
              <p className="mt-4 text-sm text-foreground/60">
                You may also be drawn to <strong className="font-medium text-foreground">{JOURNEYS[result.secondary].title}</strong>. You can explore it any time.
              </p>
            )}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/auth" search={{ mode: "signup" }} className="rounded-full bg-primary px-6 py-3.5 text-center text-sm font-medium text-primary-foreground">
                Create my free space
              </Link>
              <button onClick={restart} className="rounded-full border border-foreground/20 px-6 py-3.5 text-sm hover:bg-white/60">
                Retake the quiz
              </button>
            </div>
            <p className="mt-5 text-xs text-foreground/50">
              Sign up with the same email and your starting point will be waiting. Your free Calm Start audio is the first step.
            </p>
          </section>
        )}
      </main>
      <FrontFooter />
    </div>
  );
}
