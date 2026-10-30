import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/app/checkin")({
  component: Checkin,
  head: () => ({ meta: [{ title: "Weekly check-in · Signe Coach" }, { name: "robots", content: "noindex, nofollow" }] }),
});

type Row = { week_start: string; mood: number; win: string | null; wobble: string | null; next_commitment: string | null; note: string | null };
const MOODS = ["", "Hard", "Heavy", "Okay", "Good", "Great"];

function mondayISO(d = new Date()) {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  x.setDate(x.getDate() - ((x.getDay() + 6) % 7));
  return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}-${String(x.getDate()).padStart(2, "0")}`;
}
const pretty = (iso: string) => new Date(iso + "T12:00:00").toLocaleDateString(undefined, { day: "numeric", month: "short" });

const area =
  "w-full rounded-2xl border border-foreground/15 bg-white/60 px-4 py-3 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:ring-1 focus:ring-foreground/30";

function Checkin() {
  const [loading, setLoading] = useState(true);
  const [uid, setUid] = useState("");
  const [paid, setPaid] = useState(false);
  const [rows, setRows] = useState<Row[]>([]);
  const [saving, setSaving] = useState(false);
  const [justSaved, setJustSaved] = useState<number | null>(null);
  const week = mondayISO();
  const [mood, setMood] = useState(0);
  const [win, setWin] = useState("");
  const [wobble, setWobble] = useState("");
  const [next, setNext] = useState("");
  const [note, setNote] = useState("");

  const load = async () => {
    const { data: u } = await supabase.auth.getUser();
    const id = u.user?.id;
    if (!id) return;
    setUid(id);
    const [m, s] = await Promise.all([
      (supabase as any).rpc("has_membership", { _user_id: id }),
      (supabase as any).rpc("has_starter", { _user_id: id }),
    ]);
    const { data: adm } = await (supabase as any).rpc("has_role", { _user_id: id, _role: "admin" });
    setPaid(!!m.data || !!s.data || !!adm);
    const { data } = await (supabase as any)
      .from("weekly_checkins")
      .select("week_start, mood, win, wobble, next_commitment, note")
      .eq("user_id", id)
      .order("week_start", { ascending: false })
      .limit(12);
    const list = (data as Row[]) ?? [];
    setRows(list);
    const cur = list.find((r) => r.week_start === week);
    if (cur) {
      setMood(cur.mood);
      setWin(cur.win ?? "");
      setWobble(cur.wobble ?? "");
      setNext(cur.next_commitment ?? "");
      setNote(cur.note ?? "");
    }
    setLoading(false);
  };
  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    if (!mood) return toast.error("Choose how this week felt first.");
    setSaving(true);
    const { error } = await (supabase as any)
      .from("weekly_checkins")
      .upsert(
        { user_id: uid, week_start: week, mood, win: win.trim() || null, wobble: wobble.trim() || null, next_commitment: next.trim() || null, note: note.trim() || null },
        { onConflict: "user_id,week_start" },
      );
    setSaving(false);
    if (error) return toast.error("Could not save. Please try again.");
    setJustSaved(mood);
    load();
  };

  if (loading) return <div className="flex min-h-[40vh] items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-foreground/50" /></div>;

  const trend = [...rows].reverse();

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-16">
      <p className="text-xs uppercase tracking-[0.3em] text-foreground/50">Weekly check-in</p>
      <h1 className="mt-2 font-serif text-4xl sm:text-5xl">How was your week?</h1>
      <p className="mt-3 text-sm text-foreground/70">
        Two minutes, once a week. It shows you what is working and helps you plan the next one. Week of {pretty(week)}.
      </p>

      {!paid ? (
        <div className="mt-8 liquid-glass-strong rounded-3xl p-6 text-center">
          <p className="font-serif text-2xl">Weekly check-ins are for members</p>
          <p className="mt-2 text-sm text-foreground/65">They keep you on track, and your plan adapts when a week is hard.</p>
          <Link to="/app/membership" className="mt-4 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground">See membership</Link>
        </div>
      ) : justSaved ? (
        <div className="mt-8 liquid-glass-strong rounded-3xl p-6 sm:p-8">
          <p className="font-serif text-3xl">{justSaved <= 2 ? "Thank you for being honest." : justSaved === 3 ? "A steady week. That counts." : "That is worth celebrating."}</p>
          <p className="mt-3 text-sm leading-relaxed text-foreground/75">
            {justSaved <= 2
              ? "Hard weeks are part of change. Be gentle with yourself this week. Your plan stays the same, and I have put a calming audio on your Today page. If things feel heavy for more than a few days, please talk to someone you trust or a qualified professional."
              : justSaved === 3
              ? "Keep your one commitment for next week small and clear. Small and steady is how this works."
              : "Notice what made it good, and do a little more of it next week."}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/app" className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground">Back to Today</Link>
            <button onClick={() => setJustSaved(null)} className="rounded-full border border-foreground/30 px-6 py-3 text-sm">Edit my answers</button>
          </div>
        </div>
      ) : (
        <div className="mt-8 liquid-glass-strong rounded-3xl p-6 sm:p-8">
          <p className="text-xs uppercase tracking-widest text-foreground/50">How did this week feel?</p>
          <div className="mt-3 grid grid-cols-5 gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onClick={() => setMood(n)}
                aria-pressed={mood === n}
                className={`rounded-2xl px-1 py-3 text-sm transition ${mood === n ? "bg-primary text-primary-foreground" : "border border-foreground/20 bg-white/60 hover:bg-white"}`}
              >
                <span className="block font-serif text-xl">{n}</span>
                <span className="block text-[11px] opacity-80">{MOODS[n]}</span>
              </button>
            ))}
          </div>

          <label className="mt-6 block">
            <span className="text-xs uppercase tracking-widest text-foreground/50">One win this week</span>
            <textarea value={win} onChange={(e) => setWin(e.target.value)} rows={2} placeholder="Something you did or noticed, however small" className={`${area} mt-1.5`} />
          </label>
          <label className="mt-5 block">
            <span className="text-xs uppercase tracking-widest text-foreground/50">Where did you wobble?</span>
            <textarea value={wobble} onChange={(e) => setWobble(e.target.value)} rows={2} placeholder="A moment the old pattern showed up" className={`${area} mt-1.5`} />
          </label>
          <label className="mt-5 block">
            <span className="text-xs uppercase tracking-widest text-foreground/50">One thing you will do next week</span>
            <textarea value={next} onChange={(e) => setNext(e.target.value)} rows={2} placeholder="Small and specific" className={`${area} mt-1.5`} />
          </label>
          <label className="mt-5 block">
            <span className="text-xs uppercase tracking-widest text-foreground/50">Anything you want Signe to know? (optional)</span>
            <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} className={`${area} mt-1.5`} />
          </label>

          <button
            onClick={save}
            disabled={saving}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-medium text-primary-foreground disabled:opacity-50"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />} Save my check-in
          </button>
        </div>
      )}

      {paid && trend.length > 0 && (
        <div className="mt-10">
          <h2 className="font-serif text-2xl">Your weeks</h2>
          <div className="mt-4 flex h-28 items-end gap-2">
            {trend.map((r) => (
              <div key={r.week_start} className="flex flex-1 flex-col items-center gap-1">
                <div className="w-full rounded-t-xl bg-primary/80" style={{ height: `${r.mood * 18}px` }} title={`${pretty(r.week_start)}: ${MOODS[r.mood]}`} />
                <span className="text-[10px] text-foreground/50">{pretty(r.week_start)}</span>
              </div>
            ))}
          </div>
          <ul className="mt-6 space-y-3">
            {rows.map((r) => (
              <li key={r.week_start} className="liquid-glass rounded-2xl p-4 text-sm">
                <p className="text-xs uppercase tracking-widest text-foreground/50">Week of {pretty(r.week_start)} · {MOODS[r.mood]}</p>
                {r.win && <p className="mt-1.5"><span className="text-foreground/50">Win: </span>{r.win}</p>}
                {r.wobble && <p className="mt-1"><span className="text-foreground/50">Wobble: </span>{r.wobble}</p>}
                {r.next_commitment && <p className="mt-1"><span className="text-foreground/50">Next: </span>{r.next_commitment}</p>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
