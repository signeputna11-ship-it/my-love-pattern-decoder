import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, Save, Download } from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";
import { AudioPlayer } from "@/components/AudioPlayer";
import { CoverHero } from "@/components/CoverArt";
import { InAppTools } from "@/components/healthy-love/InAppTools";
import { PatternGuideCard } from "@/components/healthy-love/PatternGuideCard";
import { LessonPlayer, answerSummary, type Step } from "@/components/LessonPlayer";

type Module = {
  id: string;
  slug: string;
  position: number;
  title: string;
  subtitle: string | null;
  intro: string | null;
  audio_path?: string | null;
  audio_title?: string | null;
  audio_minutes?: number | null;
  audio_binaural?: boolean;
  is_free?: boolean;
};
type Exercise = Step;

export const Route = createFileRoute("/app/module/$slug")({
  component: ModulePage,
});

function ModulePage() {
  const { slug } = useParams({ from: "/app/module/$slug" });
  const [module, setModule] = useState<Module | null>(null);
  const [allModules, setAllModules] = useState<Module[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [answers, setAnswers] = useState<Record<string, { text: string; data: any }>>({});
  const [completed, setCompleted] = useState(false);
  const [locked, setLocked] = useState(false);
  const [userId, setUserId] = useState<string>("");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const saveTimers = useRef<Record<string, any>>({});

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoadError(null);
      setNotFound(false);
      try {
        const { data: userData, error: userErr } = await supabase.auth.getUser();
        if (userErr || !userData?.user) {
          if (!cancelled) setLoadError("Please sign in again to view this module.");
          return;
        }
        const uid = userData.user.id;
        if (cancelled) return;
        setUserId(uid);

        const { data: mod, error: modErr } = await supabase
          .from("modules")
          .select("*")
          .eq("slug", slug)
          .maybeSingle();
        if (modErr) throw modErr;
        if (!mod) {
          if (!cancelled) setNotFound(true);
          return;
        }
        if (cancelled) return;
        setModule(mod as Module);
        const { data: canOpen } = await (supabase as any).rpc("can_access_module", {
          _user_id: uid,
          _module_id: (mod as any).id,
        });
        if (!cancelled) setLocked(canOpen === false);

        supabase
          .from("modules")
          .select("*")
          .order("position")
          .then(({ data, error }) => {
            if (error) console.warn("[modules list]", error);
            if (!cancelled) setAllModules((data as Module[]) ?? []);
          });

        const { data: exs, error: exErr } = await supabase
          .from("exercises")
          .select("*")
          .eq("module_id", (mod as any).id)
          .order("position");
        if (exErr) throw exErr;
        if (cancelled) return;
        setExercises((exs as Exercise[]) ?? []);

        const { data: existing } = await supabase
          .from("user_answers")
          .select("exercise_id, answer_text, answer_data")
          .eq("user_id", uid);

        const map: Record<string, { text: string; data: any }> = {};
        ((existing as any[]) ?? []).forEach((a) => {
          map[a.exercise_id] = { text: a.answer_text ?? "", data: a.answer_data ?? null };
        });
        if (cancelled) return;
        setAnswers(map);

        const { data: prog } = await supabase
          .from("user_progress")
          .select("completed_at")
          .eq("user_id", uid)
          .eq("module_id", (mod as any).id)
          .maybeSingle();
        if (cancelled) return;
        setCompleted(!!prog?.completed_at);

        // mark started — fire and forget so a failure here doesn't block render
        supabase
          .from("user_progress")
          .upsert(
            { user_id: uid, module_id: (mod as any).id, started_at: new Date().toISOString() },
            { onConflict: "user_id,module_id", ignoreDuplicates: true },
          )
          .then(({ error }) => {
            if (error) console.warn("[mark started]", error);
          });
      } catch (e: any) {
        console.error("[ModulePage.load]", e);
        if (!cancelled) setLoadError(e?.message ?? "Couldn't load this module.");
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const persist = async (exerciseId: string, text: string, data: any) => {
    if (!userId) return;
    setSavingId(exerciseId);
    await supabase.from("user_answers").upsert(
      {
        user_id: userId,
        exercise_id: exerciseId,
        answer_text: text,
        answer_data: data,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,exercise_id" },
    );
    setSavingId(null);
  };

  const updateAnswer = (id: string, text: string, data: any) => {
    setAnswers((prev) => ({ ...prev, [id]: { text, data } }));
    if (saveTimers.current[id]) clearTimeout(saveTimers.current[id]);
    saveTimers.current[id] = setTimeout(() => persist(id, text, data), 800);
  };

  const saveAll = async () => {
    for (const ex of exercises) {
      if (ex.kind === "lesson") continue;
      const a = answers[ex.id] ?? { text: "", data: null };
      await persist(ex.id, a.text, a.data);
    }
    toast.success("Progress saved");
  };

  const markComplete = async () => {
    if (!module || !userId) return;
    await saveAll();
    await supabase
      .from("user_progress")
      .upsert(
        {
          user_id: userId,
          module_id: module.id,
          completed_at: new Date().toISOString(),
        },
        { onConflict: "user_id,module_id" },
      );
    setCompleted(true);
    toast.success("Module complete");
  };

  const downloadPdf = () => {
    if (!module) return;
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const margin = 48;
    let y = margin;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text(module.title, margin, y);
    y += 14;
    doc.setFont("helvetica", "italic");
    doc.setFontSize(11);
    if (module.subtitle) {
      doc.text(module.subtitle, margin, y + 8);
      y += 24;
    }
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);

    exercises
      .filter((ex) => ex.kind !== "lesson")
      .forEach((ex, i) => {
        if (y > 740) {
          doc.addPage();
          y = margin;
        }
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        const heading = doc.splitTextToSize(`${i + 1}. ${ex.title}`, 500);
        doc.text(heading, margin, y);
        y += heading.length * 15 + 3;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        const text = answerSummary(ex, answers[ex.id]) || "(no answer)";
        const lines = doc.splitTextToSize(text, 500);
        for (const line of lines as string[]) {
          if (y > 780) {
            doc.addPage();
            y = margin;
          }
          doc.text(line, margin, y);
          y += 14;
        }
        y += 12;
      });

    doc.save(`${module.slug}-signe-coach-workbook.pdf`);
  };

  if (loadError || notFound) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-6 text-center">
        <h2 className="font-serif text-2xl text-foreground">
          {notFound ? "We couldn't find that module" : "We couldn't load this module"}
        </h2>
        <p className="mt-2 text-sm text-foreground/60">
          {notFound
            ? "It may have been renamed or moved."
            : loadError ?? "Please try again in a moment."}
        </p>
        <Link
          to="/app"
          className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <ArrowLeft className="h-4 w-4" /> Back to dashboard
        </Link>
      </div>
    );
  }

  if (!module) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-foreground/50" />
      </div>
    );
  }

  const lessonMode = exercises.some((e) => e.kind === "lesson");
  const nextModule = allModules
    .filter((m) => m.position > module.position)
    .sort((a, b) => a.position - b.position)[0];
  const audioNode = (
    <>
      <CoverHero
        slug={module.slug}
        title={module.audio_title || module.title}
        subtitle={module.subtitle}
        label={`${module.is_free ? "Free audio" : "Member audio"}${module.audio_binaural ? " · Binaural" : ""}`}
        minutes={module.audio_minutes}
      />
      <AudioPlayer
        path={module.audio_path ?? null}
        title={module.audio_title}
        minutes={module.audio_minutes}
        binaural={module.audio_binaural}
      />
    </>
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 pb-32 sm:px-6 sm:py-16 sm:pb-32">
      <Link
        to="/app"
        className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-foreground/50 hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Dashboard
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mt-6"
      >
        <p className="text-xs uppercase tracking-[0.3em] text-foreground/50">Module {module.position}</p>
        <h1 className="mt-2 font-serif text-4xl sm:text-5xl">{module.title}</h1>
        {module.subtitle && (
          <p className="mt-2 font-serif italic text-lg text-foreground/70">{module.subtitle}</p>
        )}
      </motion.div>

      {module.intro && (
        <div className="mt-6 liquid-glass-strong rounded-3xl p-6 text-sm leading-relaxed text-foreground/80">
          {module.intro}
        </div>
      )}

      {locked && (
        <div className="mt-8 liquid-glass-strong rounded-3xl p-6 text-center">
          <p className="font-serif text-2xl">This module is for members</p>
          <p className="mt-2 text-sm text-foreground/60">
            Join for 4,99 € a month to open every journey, workbook and audio.
          </p>
          <Link
            to="/app/membership"
            className="mt-4 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
          >
            See membership
          </Link>
        </div>
      )}

      {!locked && lessonMode && (
        <LessonPlayer
          moduleSlug={module.slug}
          steps={exercises}
          answers={answers}
          onAnswer={updateAnswer}
          audioNode={module.audio_path ? audioNode : undefined}
          summaryExtra={<PatternGuideCard moduleSlug={module.slug} />}
          completed={completed}
          onComplete={markComplete}
          onPdf={downloadPdf}
          nextModule={nextModule ? { slug: nextModule.slug, title: nextModule.title } : null}
        />
      )}

      {!lessonMode && (
        <>
      {!locked && module.audio_path && (
        <CoverHero
          slug={module.slug}
          title={module.audio_title || module.title}
          subtitle={module.subtitle}
          label={`${module.is_free ? "Free audio" : "Member audio"}${module.audio_binaural ? " · Binaural" : ""}`}
          minutes={module.audio_minutes}
        />
      )}

      {!locked && <AudioPlayer
        path={module.audio_path ?? null}
        title={module.audio_title}
        minutes={module.audio_minutes}
        binaural={module.audio_binaural}
      />}

      <div className="mt-8 space-y-4">
        {exercises.map((ex, i) => {
          const a = answers[ex.id] ?? { text: "", data: {} };
          return (
            <motion.div
              key={ex.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
              className="liquid-glass rounded-3xl p-5 sm:p-6"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-widest text-foreground/40">
                    {ex.kind === "checklist" ? "Commitment" : `Question ${i + 1}`}
                  </p>
                  <h3 className="mt-1 font-serif text-xl">{ex.title}</h3>
                  {ex.body && <p className="mt-1.5 text-sm text-foreground/60">{ex.body}</p>}
                </div>
                {savingId === ex.id && (
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-foreground/40" />
                )}
              </div>

              {ex.kind === "prompt" ? (
                <textarea
                  value={a.text}
                  onChange={(e) => updateAnswer(ex.id, e.target.value, null)}
                  rows={4}
                  placeholder="Write what comes up. Nothing is wrong."
                  className="mt-4 w-full rounded-2xl bg-white/60 px-4 py-3 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:ring-1 focus:ring-foreground/30"
                />
              ) : (
                <div className="mt-4 space-y-2">
                  {(ex.options ?? []).map((opt: string) => {
                    const data = (a.data as Record<string, boolean>) || {};
                    const checked = !!data[opt];
                    return (
                      <label
                        key={opt}
                        className="flex cursor-pointer items-center gap-3 rounded-2xl bg-white/60 px-4 py-3 text-sm transition hover:bg-white/60"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => {
                            const nextData = { ...data, [opt]: e.target.checked };
                            updateAnswer(ex.id, "", nextData);
                          }}
                          className="h-4 w-4 accent-[#173D34]"
                        />
                        <span>{opt}</span>
                      </label>
                    );
                  })}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {!locked && (
        <>
      <PatternGuideCard moduleSlug={module.slug} />

      <div id="in-app-tools">
        <InAppTools moduleKey={module.slug} />
      </div>

      {(() => {
        const nextModule = allModules
          .filter((m) => m.position > module.position)
          .sort((a, b) => a.position - b.position)[0];
        return (
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={markComplete}
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              <CheckCircle2 className="h-4 w-4" />
              {completed ? "Completed. Re-confirm" : "Mark module complete"}
            </button>
            {nextModule ? (
              <Link
                to="/app/module/$slug"
                params={{ slug: nextModule.slug }}
                className="flex flex-1 items-center justify-center gap-2 rounded-full border border-foreground/30 bg-transparent px-5 py-3 text-sm font-medium text-foreground hover:bg-foreground/5"
              >
                <span className="truncate">Go to next module: {nextModule.title}</span>
                <ArrowRight className="h-4 w-4 shrink-0" />
              </Link>
            ) : (
              <Link
                to="/app"
                className="flex flex-1 items-center justify-center gap-2 rounded-full border border-foreground/30 bg-transparent px-5 py-3 text-sm font-medium text-foreground hover:bg-foreground/5"
              >
                Back to dashboard
                <ArrowRight className="h-4 w-4 shrink-0" />
              </Link>
            )}
          </div>
        );
      })()}
        </>
      )}

        </>
      )}

      {!lessonMode && (
      <div className="fixed bottom-4 left-1/2 z-40 w-[calc(100%-1.5rem)] max-w-xl -translate-x-1/2">
        <div className="liquid-glass flex items-center justify-center gap-2 rounded-full px-3 py-2 shadow-2xl backdrop-blur">
          <button
            onClick={saveAll}
            className="flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium text-foreground hover:bg-foreground/5"
          >
            <Save className="h-4 w-4" /> Save progress
          </button>
          <div className="h-6 w-px bg-foreground/10" />
          <button
            onClick={downloadPdf}
            className="flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium text-foreground hover:bg-foreground/5"
          >
            <Download className="h-4 w-4" /> Download my answers
          </button>
        </div>
      </div>
      )}
    </div>
  );
}
