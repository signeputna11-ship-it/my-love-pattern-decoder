import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import {
  Loader2,
  Lock,
  Sparkles,
  Wand2,
  Save,
  Download,
  X,
  Plus,
  Trash2,
  Copy as CopyIcon,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";

type ToolKind = "worksheet" | "tracker" | "cheatsheet" | "scripts" | "planner";

type PromptField = {
  key: string;
  label: string;
  type: "text" | "textarea" | "select";
  placeholder?: string;
  options?: string[];
};

type Tool = {
  id: string;
  module: string;
  slug: string;
  title: string;
  description: string | null;
  kind: ToolKind;
  schema: any;
  order_index: number;
};

const SLUG_TO_MODULE_KEY: Record<string, string> = {
  "see-the-pattern": "pattern",
  "calm-the-trigger": "trigger",
  "rebuild-self-worth": "self-worth",
  "set-the-boundary": "boundary",
  "decide-differently": "decisions",
};

function isNonEmpty(value: any): boolean {
  if (value == null) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (Array.isArray(value)) return value.some(isNonEmpty);
  if (typeof value === "object") return Object.values(value).some(isNonEmpty);
  return !!value;
}

export function InAppTools({ moduleKey }: { moduleKey: string }) {
  const dbKey = SLUG_TO_MODULE_KEY[moduleKey] ?? moduleKey;
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("tools")
        .select("*")
        .eq("module", dbKey)
        .order("order_index", { ascending: true });
      if (!cancelled) {
        setTools(error ? [] : ((data as Tool[]) ?? []));
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [dbKey]);

  const active = useMemo(() => tools.find((t) => t.id === activeId) ?? null, [tools, activeId]);

  useEffect(() => {
    if (active && panelRef.current) {
      panelRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [active]);

  if (loading) {
    return (
      <section className="mt-10">
        <div className="liquid-glass rounded-3xl p-6 flex items-center gap-3 text-white/60">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm">Loading tools…</span>
        </div>
      </section>
    );
  }

  if (tools.length === 0) {
    return (
      <section className="mt-10">
        <div className="liquid-glass rounded-3xl p-6 text-sm text-white/60">
          No in-app tools found for this module yet.
        </div>
      </section>
    );
  }

  return (
    <section className="mt-10">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/40">Module resources</p>
          <h2 className="mt-1 font-serif text-2xl text-white">Your in-app tools</h2>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-white/40">
          <Lock className="h-3 w-3" /> Private to you
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {tools.map((t, i) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.04 }}
            className={`liquid-glass rounded-3xl p-5 flex flex-col ${
              activeId === t.id ? "ring-1 ring-white/30" : ""
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-white/5 p-3 ring-1 ring-white/10">
                <Sparkles className="h-5 w-5 text-white/80" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-serif text-lg text-white">{t.title}</h3>
                {t.description && (
                  <p className="mt-1 text-sm text-white/60">{t.description}</p>
                )}
                <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/5 px-2.5 py-1 text-[10px] uppercase tracking-widest text-white/50 ring-1 ring-white/10">
                  <Wand2 className="h-3 w-3" /> Guided tool
                </span>
              </div>
            </div>

            <button
              onClick={() => setActiveId(activeId === t.id ? null : t.id)}
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-medium text-black hover:bg-white/90"
            >
              <Sparkles className="h-4 w-4" />
              {activeId === t.id ? "Close tool" : "Start Tool"}
            </button>
          </motion.div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {active && (
          <motion.div
            key={active.id}
            ref={panelRef}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.35 }}
            className="mt-6"
          >
            <ToolRunner tool={active} onClose={() => setActiveId(null)} />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* ---------------- Runner ---------------- */

function ToolRunner({ tool, onClose }: { tool: Tool; onClose: () => void }) {
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState<string>("");
  const saveTimer = useRef<any>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const { data: u } = await supabase.auth.getUser();
      const uid = u?.user?.id ?? "";
      if (!cancelled) setUserId(uid);
      if (!uid) {
        setLoading(false);
        return;
      }
      const { data: row } = await supabase
        .from("user_tool_responses")
        .select("data")
        .eq("user_id", uid)
        .eq("tool_id", tool.id)
        .maybeSingle();
      if (!cancelled) {
        setData((row as any)?.data ?? {});
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [tool.id]);

  const persist = async (next: any) => {
    if (!userId) return;
    setSaving(true);
    await supabase
      .from("user_tool_responses")
      .upsert(
        { user_id: userId, tool_id: tool.id, data: next, updated_at: new Date().toISOString() },
        { onConflict: "user_id,tool_id" },
      );
    setSaving(false);
  };

  const update = (next: any) => {
    setData(next);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => persist(next), 800);
  };

  const saveNow = async () => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    await persist(data);
    toast.success("Progress saved");
  };

  const hasAnswers = isNonEmpty(data);

  const downloadAnswers = () => {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const margin = 48;
    let y = margin;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text(tool.title, margin, y);
    y += 22;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);

    const writeBlock = (label: string, body: string) => {
      if (y > 760) {
        doc.addPage();
        y = margin;
      }
      doc.setFont("helvetica", "bold");
      doc.text(label, margin, y);
      y += 14;
      doc.setFont("helvetica", "normal");
      const lines = doc.splitTextToSize(body || "(no answer)", 500);
      doc.text(lines, margin, y);
      y += lines.length * 14 + 10;
    };

    if (tool.kind === "worksheet" || tool.kind === "cheatsheet") {
      const prompts: PromptField[] = tool.schema.prompts ?? [];
      prompts.forEach((p) => writeBlock(p.label, String(data[p.key] ?? "")));
    } else if (tool.kind === "tracker") {
      const fields: PromptField[] = tool.schema.fields ?? [];
      const entries = (data.entries ?? []) as any[];
      entries.forEach((e, i) => {
        writeBlock(`Entry ${i + 1}`, "");
        fields.forEach((f) => writeBlock("  " + f.label, String(e[f.key] ?? "")));
      });
    } else if (tool.kind === "scripts") {
      const scenarios = tool.schema.scenarios ?? [];
      scenarios.forEach((s: any, i: number) => {
        const mine = data[`s_${i}`] ?? "";
        if (mine) writeBlock(`My version: ${s.title}`, mine);
      });
    } else if (tool.kind === "planner") {
      const days = tool.schema.days ?? 14;
      for (let d = 0; d < days; d++) {
        const dd = data[`day_${d}`] ?? {};
        if (isNonEmpty(dd)) {
          writeBlock(`Day ${d + 1}: Intention`, dd.intention ?? "");
          if (dd.note) writeBlock(`Day ${d + 1}: Note`, dd.note);
        }
      }
    }

    doc.save(`${tool.slug}-my-answers.pdf`);
  };

  return (
    <div className="liquid-glass-strong rounded-3xl p-5 sm:p-7">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/40">In-app tool</p>
          <h3 className="mt-1 font-serif text-2xl text-white">{tool.title}</h3>
          {tool.description && (
            <p className="mt-1 text-sm text-white/60">{tool.description}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {saving && <Loader2 className="h-3.5 w-3.5 animate-spin text-white/40" />}
          <button
            onClick={onClose}
            aria-label="Close tool"
            className="rounded-full p-2 text-white/60 hover:bg-white/10 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-5">
        {loading ? (
          <div className="flex items-center gap-2 text-sm text-white/50">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading your progress…
          </div>
        ) : tool.kind === "worksheet" ? (
          <WorksheetRunner schema={tool.schema} data={data} onChange={update} />
        ) : tool.kind === "tracker" ? (
          <TrackerRunner schema={tool.schema} data={data} onChange={update} />
        ) : tool.kind === "cheatsheet" ? (
          <CheatsheetRunner schema={tool.schema} data={data} onChange={update} />
        ) : tool.kind === "scripts" ? (
          <ScriptsRunner schema={tool.schema} data={data} onChange={update} />
        ) : (
          <PlannerRunner schema={tool.schema} data={data} onChange={update} />
        )}
      </div>

      <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button
          onClick={saveNow}
          className="inline-flex items-center justify-center gap-2 rounded-full liquid-glass px-4 py-2.5 text-sm font-medium text-white hover:bg-white/10"
        >
          <Save className="h-4 w-4" /> Save progress
        </button>
        {hasAnswers && (
          <button
            onClick={downloadAnswers}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-medium text-black hover:bg-white/90"
          >
            <Download className="h-4 w-4" /> Download my answers
          </button>
        )}
      </div>
    </div>
  );
}

/* ---------------- Field primitives ---------------- */

function FieldInput({
  field,
  value,
  onChange,
}: {
  field: PromptField;
  value: any;
  onChange: (v: any) => void;
}) {
  if (field.type === "textarea") {
    return (
      <textarea
        rows={4}
        value={value ?? ""}
        placeholder={field.placeholder ?? "Write what comes up. Nothing is wrong."}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-white/30"
      />
    );
  }
  if (field.type === "select") {
    return (
      <select
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl bg-black/30 px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white/30"
      >
        <option value="">Select…</option>
        {(field.options ?? []).map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    );
  }
  return (
    <input
      type="text"
      value={value ?? ""}
      placeholder={field.placeholder ?? ""}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-2xl bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-white/30"
    />
  );
}

/* ---------------- Worksheet ---------------- */

function WorksheetRunner({
  schema,
  data,
  onChange,
}: {
  schema: any;
  data: any;
  onChange: (next: any) => void;
}) {
  const prompts: PromptField[] = schema.prompts ?? [];
  return (
    <div className="space-y-5">
      {prompts.map((p) => (
        <div key={p.key}>
          <label className="text-sm font-medium text-white/80">{p.label}</label>
          <div className="mt-2">
            <FieldInput
              field={p}
              value={data[p.key]}
              onChange={(v) => onChange({ ...data, [p.key]: v })}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------------- Cheatsheet ---------------- */

function CheatsheetRunner({
  schema,
  data,
  onChange,
}: {
  schema: any;
  data: any;
  onChange: (next: any) => void;
}) {
  const cards = schema.cards ?? [];
  const prompts: PromptField[] = schema.prompts ?? [];
  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c: any, i: number) => (
          <div key={i} className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
            <p className="font-serif text-base text-white">{c.title}</p>
            <ul className="mt-2 space-y-1.5 text-sm text-white/70">
              {(c.points ?? []).map((p: string, j: number) => (
                <li key={j} className="flex gap-2">
                  <span className="text-white/40">•</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      {prompts.length > 0 && (
        <div className="space-y-5">
          {prompts.map((p) => (
            <div key={p.key}>
              <label className="text-sm font-medium text-white/80">{p.label}</label>
              <div className="mt-2">
                <FieldInput
                  field={p}
                  value={data[p.key]}
                  onChange={(v) => onChange({ ...data, [p.key]: v })}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------- Tracker ---------------- */

function TrackerRunner({
  schema,
  data,
  onChange,
}: {
  schema: any;
  data: any;
  onChange: (next: any) => void;
}) {
  const fields: PromptField[] = schema.fields ?? [];
  const entries: any[] = data.entries ?? [];
  const [draft, setDraft] = useState<Record<string, any>>({});

  const addEntry = () => {
    if (!isNonEmpty(draft)) return;
    const next = {
      ...data,
      entries: [{ ...draft, _at: new Date().toISOString() }, ...entries],
    };
    onChange(next);
    setDraft({});
  };

  const removeEntry = (idx: number) => {
    const next = { ...data, entries: entries.filter((_, i) => i !== idx) };
    onChange(next);
  };

  return (
    <div className="space-y-6">
      <div className="liquid-glass rounded-2xl p-4 space-y-4">
        <p className="text-xs uppercase tracking-widest text-white/50">New entry</p>
        {fields.map((f) => (
          <div key={f.key}>
            <label className="text-sm font-medium text-white/80">{f.label}</label>
            <div className="mt-2">
              <FieldInput
                field={f}
                value={draft[f.key]}
                onChange={(v) => setDraft({ ...draft, [f.key]: v })}
              />
            </div>
          </div>
        ))}
        <button
          onClick={addEntry}
          className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-black hover:bg-white/90"
        >
          <Plus className="h-4 w-4" /> Save entry
        </button>
      </div>

      {entries.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-widest text-white/50">Your entries</p>
          {entries.map((e, i) => (
            <div key={i} className="rounded-2xl bg-black/20 p-4 ring-1 ring-white/10">
              <div className="flex items-start justify-between gap-3">
                <p className="text-[11px] uppercase tracking-widest text-white/40">
                  {new Date(e._at ?? Date.now()).toLocaleString()}
                </p>
                <button
                  onClick={() => removeEntry(i)}
                  className="rounded-full p-1.5 text-white/40 hover:bg-white/10 hover:text-white"
                  aria-label="Delete entry"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="mt-2 space-y-2 text-sm text-white/80">
                {fields.map((f) => (
                  <div key={f.key}>
                    <span className="text-white/50">{f.label}: </span>
                    <span>{String(e[f.key] ?? "-")}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------- Scripts ---------------- */

function ScriptsRunner({
  schema,
  data,
  onChange,
}: {
  schema: any;
  data: any;
  onChange: (next: any) => void;
}) {
  const scenarios: any[] = schema.scenarios ?? [];
  const [copied, setCopied] = useState<number | null>(null);

  const copy = async (text: string, i: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(i);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      toast.error("Couldn't copy. Long-press to select.");
    }
  };

  return (
    <div className="space-y-4">
      {scenarios.map((s, i) => {
        const myKey = `s_${i}`;
        return (
          <div key={i} className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
            <p className="font-serif text-lg text-white">{s.title}</p>
            <div className="mt-3 rounded-xl bg-black/30 p-3 text-sm text-white/85">
              {s.script}
            </div>
            {s.pushback && (
              <div className="mt-2 rounded-xl bg-black/20 p-3 text-xs text-white/60">
                <span className="text-white/40">If they push back: </span>
                {s.pushback}
              </div>
            )}
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                onClick={() => copy(s.script, i)}
                className="inline-flex items-center gap-1.5 rounded-full liquid-glass px-3 py-1.5 text-xs text-white hover:bg-white/10"
              >
                {copied === i ? (
                  <>
                    <Check className="h-3 w-3" /> Copied
                  </>
                ) : (
                  <>
                    <CopyIcon className="h-3 w-3" /> Copy
                  </>
                )}
              </button>
            </div>
            <div className="mt-3">
              <label className="text-xs uppercase tracking-widest text-white/50">
                Make it yours
              </label>
              <textarea
                rows={3}
                value={data[myKey] ?? ""}
                onChange={(e) => onChange({ ...data, [myKey]: e.target.value })}
                placeholder="Rewrite it in your voice."
                className="mt-2 w-full rounded-2xl bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-white/30"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ---------------- Planner ---------------- */

function PlannerRunner({
  schema,
  data,
  onChange,
}: {
  schema: any;
  data: any;
  onChange: (next: any) => void;
}) {
  const days: number = schema.days ?? 14;
  const actions: string[] = schema.actions ?? [];

  const updateDay = (idx: number, patch: any) => {
    const key = `day_${idx}`;
    onChange({ ...data, [key]: { ...(data[key] ?? {}), ...patch } });
  };

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {Array.from({ length: days }, (_, i) => {
        const key = `day_${i}`;
        const dd = data[key] ?? {};
        const checks: Record<string, boolean> = dd.checks ?? {};
        return (
          <div key={i} className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
            <p className="text-xs uppercase tracking-widest text-white/50">Day {i + 1}</p>
            <input
              type="text"
              value={dd.intention ?? ""}
              onChange={(e) => updateDay(i, { intention: e.target.value })}
              placeholder="Intention for today"
              className="mt-2 w-full rounded-xl bg-black/30 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-white/30"
            />
            <div className="mt-3 space-y-1.5">
              {actions.map((a) => (
                <label key={a} className="flex cursor-pointer items-center gap-2 text-sm text-white/80">
                  <input
                    type="checkbox"
                    checked={!!checks[a]}
                    onChange={(e) =>
                      updateDay(i, { checks: { ...checks, [a]: e.target.checked } })
                    }
                    className="h-4 w-4 accent-white"
                  />
                  <span>{a}</span>
                </label>
              ))}
            </div>
            <textarea
              rows={2}
              value={dd.note ?? ""}
              onChange={(e) => updateDay(i, { note: e.target.value })}
              placeholder="Note (optional)"
              className="mt-2 w-full rounded-xl bg-black/30 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-white/30"
            />
          </div>
        );
      })}
    </div>
  );
}
