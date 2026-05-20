import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { getWorksheetByToken, saveWorksheetResponse } from "@/server/access.functions";
import { Loader2, Check } from "lucide-react";

type Loaded = {
  product: { slug: string; name: string; short_description: string | null } | null;
  response: { data: Record<string, string>; updated_at: string | null };
};

// Placeholder question set used for every worksheet until per-slug content is added.
const QUESTIONS: { id: string; label: string; placeholder?: string }[] = [
  { id: "q1", label: "The pattern I notice most often", placeholder: "Write freely…" },
  { id: "q2", label: "Where I first learned this pattern" },
  { id: "q3", label: "What the pattern protects me from" },
  { id: "q4", label: "The cost I'm paying to keep it" },
  { id: "q5", label: "One small move I'll try this week" },
];

export const Route = createFileRoute("/w/$token")({
  component: WorksheetPage,
  head: () => ({
    meta: [
      { title: "Your Worksheet · My Love Pattern" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

function WorksheetPage() {
  const { token } = Route.useParams();
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    getWorksheetByToken({ data: { token } })
      .then((r) => {
        setLoaded(r as Loaded);
        setValues((r.response.data as Record<string, string>) ?? {});
      })
      .catch((e) => setErr(e?.message ?? "Could not load worksheet"));
  }, [token]);

  const persist = useCallback(
    (next: Record<string, string>) => {
      if (debounce.current) clearTimeout(debounce.current);
      setSaveState("saving");
      debounce.current = setTimeout(() => {
        saveWorksheetResponse({ data: { token, data: next } })
          .then(() => setSaveState("saved"))
          .catch(() => setSaveState("idle"));
      }, 800);
    },
    [token],
  );

  const onChange = (id: string, val: string) => {
    const next = { ...values, [id]: val };
    setValues(next);
    persist(next);
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

  if (!loaded) {
    return (
      <div className="grid min-h-screen place-items-center bg-black text-white">
        <Loader2 className="h-6 w-6 animate-spin text-white/40" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-black text-white">
      <div className="mx-auto max-w-2xl px-4 py-12 sm:py-16">
        <header className="border-b border-white/10 pb-8">
          <p className="text-xs uppercase tracking-[0.3em] text-white/40">Worksheet</p>
          <h1 className="mt-2 font-serif text-3xl sm:text-4xl text-balance">
            {loaded.product?.name ?? "Your worksheet"}
          </h1>
          {loaded.product?.short_description && (
            <p className="mt-2 text-sm text-white/60">{loaded.product.short_description}</p>
          )}
          <div className="mt-4 inline-flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-white/50">
            {saveState === "saving" ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin" /> Saving…
              </>
            ) : saveState === "saved" ? (
              <>
                <Check className="h-3 w-3 text-emerald-300" /> Saved
              </>
            ) : (
              <>Auto-saves as you write</>
            )}
          </div>
        </header>

        <div className="mt-8 space-y-8">
          {QUESTIONS.map((q, i) => (
            <div key={q.id}>
              <label className="block text-xs uppercase tracking-widest text-white/50">
                {i + 1}. {q.label}
              </label>
              <textarea
                value={values[q.id] ?? ""}
                onChange={(e) => onChange(q.id, e.target.value)}
                placeholder={q.placeholder ?? "Write freely…"}
                rows={5}
                className="mt-2 w-full rounded-2xl bg-white/5 px-4 py-3 text-sm leading-relaxed ring-1 ring-white/10 placeholder:text-white/30 focus:outline-none focus:ring-white/30"
              />
            </div>
          ))}
        </div>

        <p className="mt-12 text-center text-xs text-white/40">
          Your answers are private to this link. Save the link — it's your way back in.
        </p>
      </div>
    </div>
  );
}
