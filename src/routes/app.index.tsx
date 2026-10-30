import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getMyStartingPoint } from "@/lib/server-fns/quiz.functions";
import { JOURNEYS, type JourneyKey } from "@/lib/quiz";
import { CoverArt } from "@/components/CoverArt";

export const Route = createFileRoute("/app/")({
  component: Today,
  head: () => ({ meta: [{ title: "Today · Signe Coach" }, { name: "robots", content: "noindex, nofollow" }] }),
});

type Mod = { id: string; slug: string; position: number; title: string; subtitle: string | null };
type Checkin = { week_start: string; mood: number; wobble: string | null; win: string | null };

const MOODS = ["", "Hard", "Heavy", "Okay", "Good", "Great"];
const DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];
const FREE_CARD_DAYS = 7;

// The words she wrote herself, shown back to her on her daily card.
const OWN_WORDS: Record<string, { module: string; step: string; field?: string; label: string }> = {
  confidence: { module: "confidence-reframe", step: "Choose your new belief", field: "My final belief (5 to 10 words)", label: "Your belief" },
  "self-worth": { module: "selfworth-daily", step: "Your daily routine", field: "My worth sentence, 5 to 10 words", label: "Your worth sentence" },
  money: { module: "money-reframe", step: "Choose your new money belief", label: "Your money belief" },
};

// Audio that suits each journey, shown as gentle support.
const SUPPORT_AUDIO: Record<string, string> = {
  confidence: "healing-vortex",
  "self-worth": "healing-vortex",
  money: "money-notice",
  business: "start-calm",
  purpose: "purpose-vision",
  relationships: "total-relaxation",
};

function mondayOf(d: Date) {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const day = (x.getDay() + 6) % 7; // Monday = 0
  x.setDate(x.getDate() - day);
  return x;
}
const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
}

function Today() {
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const [name, setName] = useState("");
  const [userId, setUserId] = useState("");
  const [journey, setJourney] = useState<string | null>(null);
  const [startedAt, setStartedAt] = useState<Date | null>(null);
  const [modules, setModules] = useState<Mod[]>([]);
  const [done, setDone] = useState<Set<string>>(new Set());
  const [access, setAccess] = useState({ member: false, starter: false });
  const [nextLocked, setNextLocked] = useState(false);
  const [card, setCard] = useState<string | null>(null);
  const [ownWords, setOwnWords] = useState<{ label: string; text: string } | null>(null);
  const [activeDays, setActiveDays] = useState<Set<number>>(new Set());
  const [checkins, setCheckins] = useState<Checkin[]>([]);
  const [busy, setBusy] = useState(false);

  const paid = access.member || access.starter;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data: u } = await supabase.auth.getUser();
        const uid = u.user?.id;
        if (!uid) return;
        setUserId(uid);

        // Links her quiz result to her account the first time, then read the profile.
        try { await getMyStartingPoint(); } catch { /* not fatal */ }

        const { data: prof } = await (supabase as any)
          .from("profiles")
          .select("display_name, starting_journey, plan_started_at")
          .eq("user_id", uid)
          .maybeSingle();
        const j: string | null = prof?.starting_journey ?? null;
        if (cancelled) return;
        setName(prof?.display_name ?? "");

        const [memRes, stRes] = await Promise.all([
          (supabase as any).rpc("has_membership", { _user_id: uid }),
          (supabase as any).rpc("has_starter", { _user_id: uid }),
        ]);
        if (cancelled) return;
        const { data: adm } = await (supabase as any).rpc("has_role", { _user_id: uid, _role: "admin" });
        const acc = { member: !!memRes.data || !!adm, starter: !!stRes.data };
        setAccess(acc);

        const { data: ck } = await (supabase as any)
          .from("weekly_checkins")
          .select("week_start, mood, wobble, win")
          .eq("user_id", uid)
          .order("week_start", { ascending: false })
          .limit(8);
        if (!cancelled) setCheckins((ck as Checkin[]) ?? []);

        if (!j) {
          setJourney(null);
          setState("ready");
          return;
        }
        setJourney(j);

        let start: Date | null = prof?.plan_started_at ? new Date(prof.plan_started_at) : null;
        if (!start) {
          start = new Date();
          await (supabase as any).from("profiles").update({ plan_started_at: start.toISOString() }).eq("user_id", uid);
        }
        if (cancelled) return;
        setStartedAt(start);

        const { data: jr } = await (supabase as any).from("journeys").select("id").eq("slug", j).maybeSingle();
        const { data: mods } = await (supabase as any)
          .from("modules")
          .select("id, slug, position, title, subtitle")
          .eq("journey_id", jr?.id ?? "")
          .order("position");
        const list = (mods as Mod[]) ?? [];
        if (cancelled) return;
        setModules(list);

        const { data: prog } = await supabase.from("user_progress").select("module_id, completed_at").eq("user_id", uid);
        const doneIds = new Set(((prog as any[]) ?? []).filter((p) => p.completed_at).map((p) => p.module_id as string));
        if (cancelled) return;
        setDone(doneIds);

        const next = list.find((m) => !doneIds.has(m.id));
        if (next) {
          const { data: can } = await (supabase as any).rpc("can_access_module", { _user_id: uid, _module_id: next.id });
          if (!cancelled) setNextLocked(can === false);
        }

        // Daily card: one per day of her plan, cycling through 30.
        const dayIndex = Math.max(0, Math.floor((Date.now() - start.getTime()) / 86400000));
        const { data: dc } = await (supabase as any)
          .from("daily_cards")
          .select("body")
          .eq("journey_slug", j)
          .eq("day", (dayIndex % 30) + 1)
          .maybeSingle();
        if (!cancelled) setCard(dc?.body ?? null);

        // Her own words, from the module where she wrote them.
        const ow = OWN_WORDS[j];
        if (ow) {
          const { data: m } = await supabase.from("modules").select("id").eq("slug", ow.module).maybeSingle();
          if (m) {
            const { data: ex } = await supabase.from("exercises").select("id").eq("module_id", (m as any).id).eq("title", ow.step).maybeSingle();
            if (ex) {
              const { data: ans } = await supabase.from("user_answers").select("answer_text, answer_data").eq("user_id", uid).eq("exercise_id", (ex as any).id).maybeSingle();
              const text = ow.field ? (ans?.answer_data as any)?.[ow.field] : ans?.answer_text;
              if (!cancelled && text && !/^I will write my own/.test(text)) setOwnWords({ label: ow.label, text: String(text).trim() });
            }
          }
        }

        // Which days this week she did something.
        const mon = mondayOf(new Date());
        const { data: acts } = await supabase.from("user_answers").select("updated_at").eq("user_id", uid).gte("updated_at", mon.toISOString());
        const days = new Set<number>();
        ((acts as any[]) ?? []).forEach((a) => days.add((new Date(a.updated_at).getDay() + 6) % 7));
        if (!cancelled) setActiveDays(days);

        if (!cancelled) setState("ready");
      } catch (e) {
        console.error("[Today]", e);
        if (!cancelled) setState("error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const choose = async (key: string) => {
    setBusy(true);
    await (supabase as any).from("profiles").update({ starting_journey: key, plan_started_at: new Date().toISOString() }).eq("user_id", userId);
    window.location.reload();
  };

  if (state === "loading")
    return <div className="mx-auto max-w-3xl px-4 py-24 text-center text-sm text-foreground/60">Getting your day ready…</div>;
  if (state === "error")
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <p className="font-serif text-2xl">We could not load your day.</p>
        <button onClick={() => window.location.reload()} className="mt-4 rounded-full bg-primary px-5 py-2 text-sm text-primary-foreground">Refresh</button>
      </div>
    );

  // No starting point yet: pick one.
  if (!journey) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:py-20">
        <p className="text-xs uppercase tracking-[0.3em] text-foreground/50">{greeting()}{name ? `, ${name}` : ""}</p>
        <h1 className="mt-2 font-serif text-4xl sm:text-5xl">Where do you want to start?</h1>
        <p className="mt-3 text-sm text-foreground/70">
          Your plan is built around one journey at a time. Take the two-minute quiz and I will choose for you, or pick one now.
        </p>
        <Link to="/quiz" className="mt-5 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground">
          Take the quiz
        </Link>
        <div className="mt-10 grid gap-3 sm:grid-cols-2">
          {(Object.keys(JOURNEYS) as JourneyKey[]).map((k) => (
            <button key={k} disabled={busy} onClick={() => choose(k)} className="liquid-glass rounded-3xl p-5 text-left transition hover:bg-foreground/5">
              <p className="font-serif text-2xl">{JOURNEYS[k].title}</p>
              <p className="mt-1 text-sm text-foreground/60">{JOURNEYS[k].tagline}</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const info = (JOURNEYS as any)[journey] as { title: string; tagline: string } | undefined;
  const dayIndex = startedAt ? Math.max(0, Math.floor((Date.now() - startedAt.getTime()) / 86400000)) : 0;
  const week = Math.floor(dayIndex / 7) + 1;
  const total = modules.length || 5;
  const doneCount = modules.filter((m) => done.has(m.id)).length;
  const next = modules.find((m) => !done.has(m.id));
  const thisMonday = iso(mondayOf(new Date()));
  const thisWeekCheckin = checkins.find((c) => c.week_start === thisMonday);
  const last = checkins[0];
  const lowWeek = last && (last.mood <= 2 || !!last.wobble?.trim());
  const todayIdx = (new Date().getDay() + 6) % 7;
  const cardLocked = !paid && dayIndex >= FREE_CARD_DAYS;
  const supportSlug = lowWeek ? "total-relaxation" : SUPPORT_AUDIO[journey] ?? "start-calm";

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <p className="text-xs uppercase tracking-[0.3em] text-foreground/50">
          {greeting()}{name ? `, ${name}` : ""}
        </p>
        <h1 className="mt-2 font-serif text-4xl leading-tight sm:text-5xl">
          Your {info?.title ?? journey} plan
        </h1>
        <div className="mt-4 flex items-center gap-3">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-foreground/10">
            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${(doneCount / total) * 100}%` }} />
          </div>
          <p className="text-xs text-foreground/60">
            Week {Math.min(week, total)} of {total} · {doneCount} of {total} modules done
          </p>
        </div>
      </motion.div>

      {/* Today's step */}
      <section className="mt-8">
        <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-foreground/45">Today's step · about 10 minutes</p>
        {next ? (
          <div className="mt-3 liquid-glass-strong flex gap-4 rounded-3xl p-5 sm:p-6">
            <CoverArt slug={next.slug} className="hidden h-24 w-24 shrink-0 rounded-2xl sm:block" />
            <div className="min-w-0 flex-1">
              <p className="text-xs uppercase tracking-widest text-foreground/45">Module {next.position} of {total}</p>
              <h2 className="mt-1 font-serif text-2xl leading-snug sm:text-3xl">{next.title}</h2>
              {next.subtitle && <p className="mt-1 text-sm text-foreground/65">{next.subtitle}</p>}
              {nextLocked ? (
                <Link to="/app/membership" className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground">
                  <Lock className="h-4 w-4" /> Unlock your plan
                </Link>
              ) : (
                <Link to="/app/module/$slug" params={{ slug: next.slug }} className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground">
                  {doneCount === 0 ? "Start" : "Continue"} <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div className="mt-3 liquid-glass-strong rounded-3xl p-6">
            <p className="font-serif text-2xl">You have finished the {info?.title} plan.</p>
            <p className="mt-1 text-sm text-foreground/65">Choose your next journey in the library, and keep your daily card and weekly check-in going.</p>
            <Link to="/app/library" className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground">
              Open the library <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </section>

      {/* Daily card */}
      <section className="mt-8">
        <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-foreground/45">Your daily card · Day {dayIndex + 1}</p>
        <div className="relative mt-3 overflow-hidden rounded-3xl ring-1 ring-inset ring-white/70" style={{ background: "linear-gradient(120deg, #F4D9E2, #BBDCF0)" }}>
          <div className="relative z-10 p-6 sm:p-8">
            {cardLocked ? (
              <>
                <p className="font-serif text-2xl italic text-[#173D34]">Your free week of daily cards is complete.</p>
                <Link to="/app/membership" className="mt-4 inline-flex rounded-full bg-[#173D34] px-5 py-2.5 text-sm font-medium text-white">
                  Keep your daily support
                </Link>
              </>
            ) : (
              <>
                <p className="font-serif text-2xl italic leading-snug text-[#173D34] sm:text-3xl">{card ?? "Take one slow breath. You are exactly where you need to start."}</p>
                {ownWords && (
                  <div className="mt-5 border-t border-[#173D34]/15 pt-4">
                    <p className="text-[10px] uppercase tracking-[0.25em] text-[#173D34]/60">{ownWords.label}</p>
                    <p className="mt-1 text-sm text-[#173D34]/85">{ownWords.text}</p>
                  </div>
                )}
                <p className="mt-5 text-right font-serif text-sm italic text-[#173D34]/60">Signe Coach</p>
              </>
            )}
          </div>
        </div>
      </section>

      {/* This week */}
      <section className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="liquid-glass rounded-3xl p-5">
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-foreground/45">This week</p>
          <div className="mt-4 flex justify-between">
            {DAY_LABELS.map((d, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <span className={`grid h-9 w-9 place-items-center rounded-full text-xs ${activeDays.has(i) ? "bg-primary text-primary-foreground" : i === todayIdx ? "border border-foreground/40 text-foreground/70" : "border border-foreground/15 text-foreground/35"}`}>
                  {activeDays.has(i) ? <CheckCircle2 className="h-4 w-4" /> : d}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-foreground/55">A day counts when you save an answer in a lesson.</p>
        </div>

        <div className="liquid-glass rounded-3xl p-5">
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-foreground/45">Weekly check-in</p>
          {thisWeekCheckin ? (
            <>
              <p className="mt-3 font-serif text-2xl">Done. This week felt {MOODS[thisWeekCheckin.mood].toLowerCase()}.</p>
              <Link to="/app/checkin" className="mt-2 inline-block text-sm underline underline-offset-2 text-foreground/70">See your check-ins</Link>
            </>
          ) : (
            <>
              <p className="mt-3 text-sm text-foreground/70">Two minutes to look back at your week and plan the next one.</p>
              <Link to="/app/checkin" className="mt-3 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground">
                {paid ? "Start check-in" : "See how it works"} <ArrowRight className="h-4 w-4" />
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Gentle support */}
      <section className="mt-8">
        <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-foreground/45">{lowWeek ? "For a harder week" : "Listen today"}</p>
        <Link to="/app/module/$slug" params={{ slug: supportSlug }} className="mt-3 flex items-center gap-4 rounded-3xl liquid-glass p-4 transition hover:bg-foreground/5">
          <CoverArt slug={supportSlug} className="h-16 w-16 shrink-0 rounded-2xl" />
          <div className="min-w-0 flex-1">
            <p className="font-serif text-xl">
              {lowWeek ? "Total Relaxation for Anxiety" : supportSlug === "healing-vortex" ? "Healing Vortex" : supportSlug === "money-notice" ? "Wealth Made Easy" : supportSlug === "purpose-vision" ? "6 Figure Life Purpose" : supportSlug === "start-calm" ? "Easy Relaxation" : "Total Relaxation for Anxiety"}
            </p>
            <p className="text-sm text-foreground/60">
              {lowWeek ? "You said this week was hard. Give yourself twenty quiet minutes." : "A guided recording chosen to support this journey."}
            </p>
          </div>
          <ArrowRight className="h-4 w-4 shrink-0 text-foreground/40" />
        </Link>
      </section>

      <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs uppercase tracking-widest text-foreground/50">
        <Link to="/app/library" className="hover:text-foreground">Library</Link>
        <Link to="/quiz" className="hover:text-foreground">Retake the quiz</Link>
        <Link to="/app/work-with-signe" className="hover:text-foreground">Work with Signe</Link>
      </div>
    </div>
  );
}
