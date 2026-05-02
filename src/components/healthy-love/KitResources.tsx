import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { BookOpen, FileText, Headphones, Loader2, Lock, PlayCircle } from "lucide-react";
import { toast } from "sonner";

const BUCKET = "secure-response-relationship-kit";

type KitResource = {
  id: string;
  title: string;
  module: string;
  description: string | null;
  file_path: string;
  file_type: string | null;
  order_index: number;
};

function iconFor(fileType: string | null) {
  const t = (fileType ?? "").toLowerCase();
  if (t.includes("audio") || t.includes("mp3") || t.includes("wav")) return Headphones;
  if (t.includes("video") || t.includes("mp4")) return PlayCircle;
  if (t.includes("pdf")) return BookOpen;
  return FileText;
}

type Props = {
  /** Module slug or identifier. Must match the `module` column on kit_resources. */
  moduleKey: string;
};

export function KitResources({ moduleKey }: Props) {
  const [resources, setResources] = useState<KitResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [openingId, setOpeningId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("kit_resources")
        .select("*")
        .eq("module", moduleKey)
        .order("order_index", { ascending: true });
      if (!cancelled) {
        if (error) {
          // No noisy error. Likely just no access yet.
          setResources([]);
        } else {
          setResources((data as KitResource[]) ?? []);
        }
        setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [moduleKey]);

  const openResource = async (r: KitResource) => {
    setOpeningId(r.id);
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .createSignedUrl(r.file_path, 60 * 10); // 10 minutes
    setOpeningId(null);
    if (error || !data?.signedUrl) {
      toast.error("Couldn't open this resource. Please try again.");
      return;
    }
    window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  };

  if (loading) {
    return (
      <div className="mt-8 liquid-glass rounded-3xl p-6 flex items-center gap-3 text-white/60">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm">Loading your resources…</span>
      </div>
    );
  }

  if (resources.length === 0) return null;

  return (
    <section className="mt-10">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/40">Module resources</p>
          <h2 className="mt-1 font-serif text-2xl text-white">Bonus tools for this module</h2>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-white/40">
          <Lock className="h-3 w-3" /> Private to you
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {resources.map((r, i) => {
          const Icon = iconFor(r.file_type);
          const opening = openingId === r.id;
          return (
            <motion.button
              key={r.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
              onClick={() => openResource(r)}
              disabled={opening}
              className="group text-left liquid-glass rounded-3xl p-5 transition hover:bg-white/[0.06] disabled:opacity-60"
            >
              <div className="flex items-start gap-4">
                <div className="rounded-2xl bg-white/5 p-3 ring-1 ring-white/10 group-hover:ring-white/20">
                  {opening ? (
                    <Loader2 className="h-5 w-5 animate-spin text-white/70" />
                  ) : (
                    <Icon className="h-5 w-5 text-white/80" />
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="font-serif text-lg text-white truncate">{r.title}</h3>
                  {r.description && (
                    <p className="mt-1 text-sm text-white/60 line-clamp-3">{r.description}</p>
                  )}
                  <p className="mt-2 text-[10px] uppercase tracking-widest text-white/40">
                    {opening ? "Opening securely…" : "Tap to open securely"}
                  </p>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
