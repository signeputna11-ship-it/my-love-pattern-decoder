import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Loader2, Save, ArrowRight, RefreshCw, Lightbulb } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type Reflection = {
  noticing: string;
  question: string;
  next_step: string;
  recommended_resource_id: string | null;
  key_triggers?: string[];
  repeated_behaviors?: string[];
  boundaries_needed?: string[];
};

type ResourceMeta = { id: string; title: string; file_path: string; file_type: string | null };

export function PatternGuideCard({ moduleSlug }: { moduleSlug: string }) {
  const [loading, setLoading] = useState(false);
  const [reflection, setReflection] = useState<Reflection | null>(null);
  const [emptyMessage, setEmptyMessage] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [hasSavedReflection, setHasSavedReflection] = useState(false);
  const [recommended, setRecommended] = useState<ResourceMeta | null>(null);
  const [openingTool, setOpeningTool] = useState(false);

  // Hydrate from previous ai_memory row for this module
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const { data: sess } = await supabase.auth.getSession();
      const uid = sess.session?.user.id;
      if (!uid) return;
      const { data } = await supabase
        .from("ai_memory")
        .select("last_module_slug, last_noticing, last_question, last_reflection, recommended_next")
        .eq("user_id", uid)
        .maybeSingle();
      if (cancelled || !data) return;
      if (data.last_module_slug === moduleSlug && data.last_noticing && data.last_question) {
        const recId =
          data.recommended_next && /^[0-9a-f-]{36}$/i.test(data.recommended_next)
            ? data.recommended_next
            : null;
        setReflection({
          noticing: data.last_noticing,
          question: data.last_question,
          next_step: recId ? "Open the recommended tool below." : data.recommended_next ?? "",
          recommended_resource_id: recId,
        });
        setNote(data.last_reflection ?? "");
        setHasSavedReflection(!!data.last_reflection);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [moduleSlug]);

  // When a reflection has a recommended_resource_id, fetch its title for the button label
  useEffect(() => {
    let cancelled = false;
    const fetchResource = async () => {
      const id = reflection?.recommended_resource_id;
      if (!id) {
        setRecommended(null);
        return;
      }
      const { data } = await supabase
        .from("kit_resources")
        .select("id, title, file_path, file_type")
        .eq("id", id)
        .maybeSingle();
      if (!cancelled) setRecommended((data as ResourceMeta) ?? null);
    };
    fetchResource();
    return () => {
      cancelled = true;
    };
  }, [reflection?.recommended_resource_id]);

  const generate = async () => {
    setLoading(true);
    setEmptyMessage(null);
    try {
      const { data, error } = await supabase.functions.invoke("ai-pattern-guide", {
        body: { moduleSlug },
      });
      if (error) {
        const status = (error as any)?.context?.status;
        if (status === 429) toast.error("Too many requests. Try again in a moment.");
        else if (status === 402) toast.error("AI credits exhausted. Please contact support.");
        else toast.error("Couldn't generate guidance. Try again.");
        return;
      }
      if ((data as any)?.error) {
        toast.error((data as any).error);
        return;
      }
      if ((data as any)?.empty) {
        setReflection(null);
        setEmptyMessage((data as any).message ?? "Complete at least one answer first so your guide has something real to read.");
        return;
      }
      setReflection(data as Reflection);
      setNote("");
      setHasSavedReflection(false);
    } catch (e) {
      console.error(e);
      toast.error("Couldn't generate guidance.");
    } finally {
      setLoading(false);
    }
  };

  const saveReflection = async () => {
    setSaving(true);
    try {
      const { data: sess } = await supabase.auth.getSession();
      const uid = sess.session?.user.id;
      if (!uid) {
        toast.error("Sign in to save.");
        return;
      }
      const { error } = await supabase
        .from("ai_memory")
        .update({ last_reflection: note, updated_at: new Date().toISOString() })
        .eq("user_id", uid);
      if (error) throw error;
      setHasSavedReflection(true);
      toast.success("Reflection saved.");
    } catch (e) {
      console.error(e);
      toast.error("Couldn't save reflection.");
    } finally {
      setSaving(false);
    }
  };

  const openRecommendedTool = async () => {
    if (!recommended) {
      const el = document.getElementById("kit-resources");
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    setOpeningTool(true);
    try {
      const { data, error } = await supabase.storage
        .from("secure-response-relationship-kit")
        .createSignedUrl(recommended.file_path, 600);
      if (error || !data?.signedUrl) {
        toast.error("Couldn't open the recommended tool.");
        return;
      }
      window.open(data.signedUrl, "_blank", "noopener,noreferrer");
    } catch (e) {
      console.error(e);
      toast.error("Couldn't open the recommended tool.");
    } finally {
      setOpeningTool(false);
    }
  };

  return (
    <div className="mt-8 liquid-glass-strong rounded-3xl p-5 sm:p-7">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-white/10 p-2">
            <Sparkles className="h-4 w-4 text-white/80" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-white/40">Your Pattern Guide</p>
            <h3 className="mt-1 text-lg font-medium text-white">Structured self-reflection</h3>
            <p className="mt-0.5 text-xs text-white/50">
              Built from your own answers. Not therapy or diagnosis.
            </p>
          </div>
        </div>
        {(reflection || emptyMessage) && !loading && (
          <button
            onClick={generate}
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs text-white/70 hover:bg-white/10"
          >
            <RefreshCw className="h-3 w-3" /> Regenerate
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {!reflection && !loading && !emptyMessage && (
          <motion.div
            key="initial"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-5"
          >
            <p className="text-sm text-white/70">
              When you're ready, generate a single focused reflection drawn from what you wrote above.
            </p>
            <button
              onClick={generate}
              className="mt-4 flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black hover:bg-white/90"
            >
              <Sparkles className="h-4 w-4" /> Generate Guidance
            </button>
          </motion.div>
        )}

        {loading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-6 flex items-center gap-3 text-sm text-white/60"
          >
            <Loader2 className="h-4 w-4 animate-spin" />
            Reading your answers…
          </motion.div>
        )}

        {emptyMessage && !loading && (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4"
          >
            <div className="flex items-start gap-3">
              <Lightbulb className="mt-0.5 h-4 w-4 text-white/60" />
              <p className="text-sm text-white/80">{emptyMessage}</p>
            </div>
          </motion.div>
        )}

        {reflection && !loading && (
          <motion.div
            key="ref"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-6 space-y-5"
          >
            <Section label="What I'm noticing">
              <p className="text-sm leading-relaxed text-white/85">{reflection.noticing}</p>
            </Section>

            <Section label="One question to answer">
              <p className="text-sm italic leading-relaxed text-white/85">"{reflection.question}"</p>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Write your private answer here…"
                rows={3}
                className="mt-3 w-full rounded-2xl bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-white/30"
              />
            </Section>

            <Section label="Recommended next step">
              <p className="text-sm leading-relaxed text-white/85">{reflection.next_step}</p>
              {recommended && (
                <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs text-white/80">
                  <Lightbulb className="h-3 w-3" /> Suggested tool: {recommended.title}
                </p>
              )}
            </Section>

            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:flex-wrap">
              <button
                onClick={saveReflection}
                disabled={saving || !note.trim()}
                className="flex items-center justify-center gap-2 rounded-full liquid-glass px-5 py-2.5 text-sm font-medium text-white hover:bg-white/10 disabled:opacity-40"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {hasSavedReflection ? "Update reflection" : "Save AI Reflection"}
              </button>

              <button
                onClick={openRecommendedTool}
                disabled={openingTool}
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black hover:bg-white/90 disabled:opacity-60"
              >
                {openingTool ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                Open Recommended Tool
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="mt-6 text-[11px] leading-relaxed text-white/35">
        This guide doesn't provide medical or mental-health advice. If you're in crisis, contact a licensed professional or local support line.
      </p>
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-widest text-white/40">{label}</p>
      <div className="mt-2">{children}</div>
    </div>
  );
}
