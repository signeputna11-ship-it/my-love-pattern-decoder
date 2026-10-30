import { Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle2, Download } from "lucide-react";

export type Step = {
  id: string;
  position: number;
  kind: "prompt" | "checklist" | "lesson" | "scales" | "fields" | "choice";
  title: string;
  body: string | null;
  options: any;
};
export type Answer = { text: string; data: any };

const KIND_LABEL: Record<string, string> = {
  scales: "Check in",
  fields: "Your workbook",
  choice: "Choose",
  prompt: "Reflect",
  checklist: "Commit",
};

/** A readable version of an answer, used for the summary, the PDF and the saved text. */
export function answerSummary(step: Step, a?: Answer): string {
  if (!a) return "";
  const data = a.data;
  if (step.kind === "scales" && data && typeof data === "object")
    return Object.entries(data as Record<string, number>).map(([k, v]) => `${k}: ${v}/5`).join("\n");
  if (step.kind === "fields" && data && typeof data === "object")
    return Object.entries(data as Record<string, string>)
      .filter(([, v]) => (v ?? "").trim())
      .map(([k, v]) => `${k}: ${v}`)
      .join("\n");
  if (step.kind === "checklist" && data && typeof data === "object")
    return Object.entries(data as Record<string, boolean>).filter(([, v]) => v).map(([k]) => `[x] ${k}`).join("\n");
  return (a.text ?? "").trim();
}

function Bold({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
        part.startsWith("**") ? (
          <strong key={i} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

/** Tiny formatter: blank line = new paragraph, "- " = bullets, "> " = example, **bold**. */
function Rich({ text }: { text: string }) {
  const blocks = text.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
  return (
    <div className="space-y-4 text-[15px] leading-relaxed text-foreground/80">
      {blocks.map((b, i) => {
        const lines = b.split("\n");
        if (lines.every((l) => l.startsWith("- ")))
          return (
            <ul key={i} className="space-y-2">
              {lines.map((l, j) => (
                <li key={j} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/40" />
                  <span><Bold text={l.slice(2)} /></span>
                </li>
              ))}
            </ul>
          );
        if (lines.every((l) => l.startsWith("> ")))
          return (
            <blockquote key={i} className="rounded-2xl border-l-2 border-[#E8BAC9] bg-white/50 px-4 py-3 italic text-foreground/75">
              <Bold text={lines.map((l) => l.slice(2)).join(" ")} />
            </blockquote>
          );
        return <p key={i}><Bold text={lines.join(" ")} /></p>;
      })}
    </div>
  );
}

const area =
  "w-full rounded-2xl border border-foreground/15 bg-white/60 px-4 py-3 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:ring-1 focus:ring-foreground/30";

function StepBody({ step, a, onAnswer }: { step: Step; a: Answer; onAnswer: (text: string, data: any) => void }) {
  if (step.kind === "prompt")
    return (
      <textarea
        value={a.text}
        onChange={(e) => onAnswer(e.target.value, null)}
        rows={6}
        placeholder="Write what comes up. Nothing here is wrong."
        className={`${area} mt-5`}
      />
    );

  if (step.kind === "fields") {
    const labels: string[] = step.options ?? [];
    const data: Record<string, string> = a.data && typeof a.data === "object" ? a.data : {};
    const set = (label: string, v: string) => {
      const next = { ...data, [label]: v };
      onAnswer(answerSummary(step, { text: "", data: next }), next);
    };
    return (
      <div className="mt-5 space-y-4">
        {labels.map((l) => (
          <label key={l} className="block">
            <span className="text-xs uppercase tracking-widest text-foreground/50">{l}</span>
            <textarea value={data[l] ?? ""} onChange={(e) => set(l, e.target.value)} rows={3} className={`${area} mt-1.5`} />
          </label>
        ))}
      </div>
    );
  }

  if (step.kind === "scales") {
    const items: string[] = step.options ?? [];
    const data: Record<string, number> = a.data && typeof a.data === "object" ? a.data : {};
    const set = (s: string, n: number) => {
      const next = { ...data, [s]: n };
      onAnswer(answerSummary(step, { text: "", data: next }), next);
    };
    return (
      <div className="mt-5 space-y-5">
        <div className="flex justify-between text-[10px] uppercase tracking-widest text-foreground/40">
          <span>1 · Not me</span>
          <span>5 · Very me</span>
        </div>
        {items.map((s) => (
          <div key={s} className="rounded-2xl bg-white/50 p-4">
            <p className="text-sm text-foreground/85">{s}</p>
            <div className="mt-3 grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => set(s, n)}
                  aria-pressed={data[s] === n}
                  className={`h-10 rounded-full text-sm transition ${
                    data[s] === n ? "bg-primary text-primary-foreground" : "border border-foreground/25 bg-white/70 text-foreground/70 hover:bg-white"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (step.kind === "choice") {
    const opts: string[] = step.options ?? [];
    return (
      <div className="mt-5 space-y-2.5">
        {opts.map((o) => {
          const on = a.text === o;
          return (
            <button
              key={o}
              type="button"
              onClick={() => onAnswer(o, { selected: o })}
              aria-pressed={on}
              className={`flex w-full items-start gap-3 rounded-2xl px-4 py-3.5 text-left text-sm transition ${
                on ? "bg-primary text-primary-foreground" : "border border-foreground/15 bg-white/60 text-foreground/85 hover:bg-white"
              }`}
            >
              <span className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full border ${on ? "border-primary-foreground" : "border-foreground/30"}`}>
                {on && <span className="h-2 w-2 rounded-full bg-primary-foreground" />}
              </span>
              <span>{o}</span>
            </button>
          );
        })}
      </div>
    );
  }

  if (step.kind === "checklist") {
    const opts: string[] = step.options ?? [];
    const data: Record<string, boolean> = a.data && typeof a.data === "object" ? a.data : {};
    return (
      <div className="mt-5 space-y-2.5">
        {opts.map((o) => (
          <label key={o} className="flex cursor-pointer items-start gap-3 rounded-2xl border border-foreground/15 bg-white/60 px-4 py-3.5 text-sm hover:bg-white">
            <input
              type="checkbox"
              checked={!!data[o]}
              onChange={(e) => {
                const next = { ...data, [o]: e.target.checked };
                onAnswer("", next);
              }}
              className="mt-0.5 h-4 w-4 shrink-0 accent-[#173D34]"
            />
            <span>{o}</span>
          </label>
        ))}
      </div>
    );
  }
  return null;
}

type Item = { type: "step"; step: Step } | { type: "audio" } | { type: "summary" };

export function LessonPlayer({
  moduleSlug,
  steps,
  answers,
  onAnswer,
  audioNode,
  summaryExtra,
  completed,
  onComplete,
  onPdf,
  nextModule,
}: {
  moduleSlug: string;
  steps: Step[];
  answers: Record<string, Answer>;
  onAnswer: (id: string, text: string, data: any) => void;
  audioNode?: ReactNode;
  summaryExtra?: ReactNode;
  completed: boolean;
  onComplete: () => void;
  onPdf: () => void;
  nextModule?: { slug: string; title: string } | null;
}) {
  const items: Item[] = useMemo(() => {
    const out: Item[] = [];
    let audioPlaced = !audioNode;
    steps.forEach((s) => {
      out.push({ type: "step", step: s });
      if (!audioPlaced && s.kind === "lesson") {
        out.push({ type: "audio" });
        audioPlaced = true;
      }
    });
    out.push({ type: "summary" });
    return out;
  }, [steps, audioNode]);

  const key = `sc_step_${moduleSlug}`;
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    try {
      const saved = Number(localStorage.getItem(key));
      if (Number.isFinite(saved) && saved > 0 && saved < items.length) setIdx(saved);
    } catch { /* private mode */ }
  }, [key, items.length]);
  const go = (n: number) => {
    const next = Math.min(Math.max(n, 0), items.length - 1);
    setIdx(next);
    try { localStorage.setItem(key, String(next)); } catch { /* private mode */ }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const item = items[idx];
  const lessons = steps.filter((s) => s.kind === "lesson");
  const pct = Math.round(((idx + 1) / items.length) * 100);

  return (
    <div className="mt-8">
      <div className="flex items-center gap-3">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-foreground/10">
          <motion.div className="h-full rounded-full bg-primary" animate={{ width: `${pct}%` }} transition={{ duration: 0.4 }} />
        </div>
        <span className="text-[11px] tabular-nums text-foreground/50">{idx + 1} / {items.length}</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          className="mt-6"
        >
          {item.type === "audio" && <div>{audioNode}</div>}

          {item.type === "step" && (
            <div className="liquid-glass-strong rounded-3xl p-6 sm:p-9">
              <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-foreground/45">
                {item.step.kind === "lesson"
                  ? `Lesson ${lessons.findIndex((l) => l.id === item.step.id) + 1} of ${lessons.length}`
                  : KIND_LABEL[item.step.kind]}
              </p>
              <h2 className="mt-3 font-serif text-3xl leading-tight sm:text-4xl">{item.step.title}</h2>
              {item.step.kind === "lesson" ? (
                <div className="mt-5"><Rich text={item.step.body ?? ""} /></div>
              ) : (
                <>
                  {item.step.body && <div className="mt-3"><Rich text={item.step.body} /></div>}
                  <StepBody
                    step={item.step}
                    a={answers[item.step.id] ?? { text: "", data: null }}
                    onAnswer={(t, d) => onAnswer(item.step.id, t, d)}
                  />
                </>
              )}
            </div>
          )}

          {item.type === "summary" && (
            <div>
              <div className="liquid-glass-strong rounded-3xl p-6 sm:p-9">
                <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-foreground/45">Your workbook</p>
                <h2 className="mt-3 font-serif text-3xl sm:text-4xl">What you wrote, in one place</h2>
                <div className="mt-6 space-y-5">
                  {steps
                    .filter((s) => s.kind !== "lesson")
                    .map((s) => {
                      const text = answerSummary(s, answers[s.id]);
                      if (!text) return null;
                      return (
                        <div key={s.id}>
                          <p className="text-xs uppercase tracking-widest text-foreground/45">{s.title}</p>
                          <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-foreground/85">{text}</p>
                        </div>
                      );
                    })}
                  {steps.filter((s) => s.kind !== "lesson").every((s) => !answerSummary(s, answers[s.id])) && (
                    <p className="text-sm text-foreground/50">Nothing written yet. Go back and answer a few steps, then come here to keep them.</p>
                  )}
                </div>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <button
                    onClick={onComplete}
                    className="flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                  >
                    <CheckCircle2 className="h-4 w-4" /> {completed ? "Completed. Save again" : "Mark module complete"}
                  </button>
                  <button
                    onClick={onPdf}
                    className="flex flex-1 items-center justify-center gap-2 rounded-full border border-foreground/30 px-5 py-3 text-sm font-medium hover:bg-foreground/5"
                  >
                    <Download className="h-4 w-4" /> Download my workbook
                  </button>
                </div>
                {nextModule && (
                  <Link
                    to="/app/module/$slug"
                    params={{ slug: nextModule.slug }}
                    className="mt-3 flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm text-foreground/70 hover:text-foreground"
                  >
                    Next: {nextModule.title} <ArrowRight className="h-4 w-4" />
                  </Link>
                )}
              </div>
              {summaryExtra}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="mt-6 flex items-center justify-between gap-3">
        <button
          onClick={() => go(idx - 1)}
          disabled={idx === 0}
          className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm text-foreground/70 hover:text-foreground disabled:opacity-30"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        {idx < items.length - 1 && (
          <button
            onClick={() => go(idx + 1)}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            {idx === items.length - 2 ? "Finish" : "Continue"} <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
