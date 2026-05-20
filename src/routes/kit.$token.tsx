import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getKitByToken, markStageComplete } from "@/server/access.functions";
import { Check, Loader2 } from "lucide-react";

type Stage = {
  id: string;
  position: number;
  slug: string;
  title: string;
  subtitle: string | null;
  body: string | null;
  completed: boolean;
};

export const Route = createFileRoute("/kit/$token")({
  component: KitPage,
  head: () => ({
    meta: [
      { title: "Your Reset Kit · My Love Pattern" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

function KitPage() {
  const { token } = Route.useParams();
  const [stages, setStages] = useState<Stage[] | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    getKitByToken({ data: { token } })
      .then((r) => setStages(r.stages as Stage[]))
      .catch((e) => setErr(e?.message ?? "Could not load kit"));
  }, [token]);

  const toggle = async (stageId: string) => {
    setStages((s) =>
      s ? s.map((st) => (st.id === stageId ? { ...st, completed: true } : st)) : s,
    );
    try {
      await markStageComplete({ data: { token, stageId } });
    } catch {
      // silent — best-effort
    }
  };

  if (err) {
    return (
      <div className="grid min-h-screen place-items-center bg-black p-6 text-white">
        <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-6 text-center">
          <p className="text-red-200">{err}</p>
        </div>
      </div>
    );
  }

  if (!stages) {
    return (
      <div className="grid min-h-screen place-items-center bg-black text-white">
        <Loader2 className="h-6 w-6 animate-spin text-white/40" />
      </div>
    );
  }

  const done = stages.filter((s) => s.completed).length;

  return (
    <div className="relative min-h-screen bg-black text-white">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
        <header className="border-b border-white/10 pb-8">
          <p className="text-xs uppercase tracking-[0.3em] text-white/40">My Love Pattern · Reset Kit</p>
          <h1 className="mt-2 font-serif text-4xl sm:text-5xl text-balance">
            Your five-stage reset.
          </h1>
          <p className="mt-3 text-sm text-white/60">
            Move through the stages at your pace. Mark each one complete when you finish.
          </p>
          <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full bg-white transition-all"
              style={{ width: `${(done / stages.length) * 100}%` }}
            />
          </div>
          <p className="mt-2 text-[11px] uppercase tracking-widest text-white/40">
            {done} of {stages.length} complete
          </p>
        </header>

        <div className="mt-10 space-y-4">
          {stages.map((s) => (
            <div
              key={s.id}
              className={`rounded-3xl p-6 ring-1 transition ${
                s.completed ? "bg-emerald-500/5 ring-emerald-400/30" : "bg-white/5 ring-white/10"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-[10px] uppercase tracking-widest text-white/40">
                    Stage {s.position}
                  </p>
                  <h2 className="mt-1 font-serif text-2xl text-balance">{s.title}</h2>
                  {s.subtitle && <p className="mt-1 text-sm text-white/60">{s.subtitle}</p>}
                  {s.body && <p className="mt-4 text-sm leading-relaxed text-white/75">{s.body}</p>}
                </div>
                <button
                  onClick={() => toggle(s.id)}
                  disabled={s.completed}
                  className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ring-1 transition ${
                    s.completed
                      ? "bg-emerald-400/20 text-emerald-300 ring-emerald-400/40"
                      : "bg-white/5 text-white/40 ring-white/10 hover:bg-white/10 hover:text-white"
                  }`}
                  aria-label={s.completed ? "Completed" : "Mark complete"}
                >
                  <Check className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-12 text-center text-xs text-white/40">
          Bookmark this page. Your progress saves to your access link.
        </p>
      </div>
    </div>
  );
}
