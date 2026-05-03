import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle2, Circle, ArrowRight } from "lucide-react";

type Module = {
  id: string;
  slug: string;
  position: number;
  title: string;
  subtitle: string | null;
};

export const Route = createFileRoute("/app/")({
  component: Dashboard,
});

function Dashboard() {
  const [modules, setModules] = useState<Module[]>([]);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [pattern, setPattern] = useState<string | null>(null);
  const [name, setName] = useState<string>("");
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const { data: userData, error: userErr } = await supabase.auth.getUser();
        const userId = userErr ? undefined : userData?.user?.id;

        const modsRes = await supabase.from("modules").select("*").order("position");
        if (cancelled) return;
        if (modsRes.error) console.error("[modules]", modsRes.error);
        setModules((modsRes.data as Module[]) ?? []);

        if (userId) {
          const [progRes, profileRes] = await Promise.all([
            supabase.from("user_progress").select("module_id, completed_at").eq("user_id", userId),
            supabase
              .from("profiles")
              .select("display_name, pattern_type")
              .eq("user_id", userId)
              .maybeSingle(),
          ]);
          if (cancelled) return;
          if (progRes.error) console.error("[user_progress]", progRes.error);
          if (profileRes.error) console.error("[profiles]", profileRes.error);

          setCompletedIds(
            new Set(
              ((progRes.data as any[]) ?? [])
                .filter((p) => p.completed_at)
                .map((p) => p.module_id as string),
            ),
          );
          setPattern(profileRes.data?.pattern_type ?? null);
          setName(profileRes.data?.display_name ?? "");
        }

        setStatus("ready");
      } catch (e) {
        console.error("[Dashboard.load]", e);
        if (!cancelled) setStatus("error");
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (status === "loading") {
    return (
      <div className="mx-auto max-w-5xl px-4 py-20 text-center text-sm text-white/60">
        Loading your dashboard…
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="mx-auto max-w-5xl px-4 py-20 text-center">
        <p className="font-serif text-2xl">We couldn't load your dashboard.</p>
        <p className="mt-2 text-sm text-white/60">Please refresh the page.</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 rounded-full bg-white px-5 py-2 text-sm text-black"
        >
          Refresh
        </button>
      </div>
    );
  }

  const completedCount = modules.filter((m) => completedIds.has(m.id)).length;
  const total = modules.length || 5;
  const percent = Math.round((completedCount / total) * 100);
  const next = modules.find((m) => !completedIds.has(m.id)) ?? modules[0];

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-20">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <p className="text-xs uppercase tracking-[0.3em] text-white/50">Welcome back{name ? "," : ""}</p>
        {name && <h1 className="mt-1 font-serif text-3xl sm:text-5xl">{name}</h1>}
        <h1 className={`${name ? "mt-1 text-lg text-white/70" : "mt-1 font-serif text-3xl sm:text-5xl"}`}>
          Your reset is in motion.
        </h1>
      </motion.div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="liquid-glass-strong rounded-3xl p-6">
          <p className="text-xs uppercase tracking-widest text-white/50">Your pattern</p>
          <p className="mt-2 font-serif text-2xl">{pattern ?? "Not yet detected"}</p>
          <p className="mt-2 text-xs text-white/50">
            {pattern
              ? "Each module loops back to this."
              : "Complete the quiz on the home page to find yours."}
          </p>
        </div>
        <div className="liquid-glass-strong rounded-3xl p-6">
          <p className="text-xs uppercase tracking-widest text-white/50">Progress</p>
          <p className="mt-2 font-serif text-2xl">
            {completedCount} <span className="text-white/40">/ {total}</span>
          </p>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full bg-white"
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              transition={{ duration: 0.8 }}
            />
          </div>
        </div>
        <div className="liquid-glass-strong rounded-3xl p-6">
          <p className="text-xs uppercase tracking-widest text-white/50">Next step</p>
          <p className="mt-2 font-serif text-xl">{next?.title ?? "All complete"}</p>
          {next && (
            <Link
              to="/app/module/$slug"
              params={{ slug: next.slug }}
              className="mt-3 inline-flex items-center gap-1.5 text-sm text-white hover:text-white/80"
            >
              Continue <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>
      </div>

      <div className="mt-12">
        <p className="text-xs uppercase tracking-[0.3em] text-white/50">The 5 modules</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {modules.map((m, i) => {
            const done = completedIds.has(m.id);
            return (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
              >
                <Link
                  to="/app/module/$slug"
                  params={{ slug: m.slug }}
                  className="group block rounded-3xl liquid-glass p-6 transition hover:bg-white/10"
                >
                  <div className="flex items-start gap-4">
                    <div className="mt-0.5">
                      {done ? (
                        <CheckCircle2 className="h-6 w-6 text-white" />
                      ) : (
                        <Circle className="h-6 w-6 text-white/40" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs uppercase tracking-widest text-white/40">
                        Module {m.position}
                      </p>
                      <h3 className="mt-1 font-serif text-2xl">{m.title}</h3>
                      <p className="mt-1 text-sm text-white/60">{m.subtitle}</p>
                    </div>
                    <ArrowRight className="mt-2 h-4 w-4 text-white/40 transition group-hover:translate-x-1 group-hover:text-white" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
