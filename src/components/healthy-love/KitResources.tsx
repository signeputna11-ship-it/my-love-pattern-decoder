import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Lock, Sparkles, ShieldCheck, Download, ExternalLink, Wand2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const BUCKET = "secure-response-relationship-kit";

const SLUG_TO_MODULE_KEY: Record<string, string> = {
  "see-the-pattern": "pattern",
  "calm-the-trigger": "trigger",
  "rebuild-self-worth": "self-worth",
  "set-the-boundary": "boundary",
  "decide-differently": "decisions",
};

type KitResource = {
  id: string;
  title: string;
  module: string;
  description: string | null;
  file_path: string;
  file_type: string | null;
  order_index: number;
};

type Props = {
  /** Module slug from the route. Mapped to the `module` column on kit_resources. */
  moduleKey: string;
};

type ActionKey = "open" | "download" | "use" | null;

export function KitResources({ moduleKey }: Props) {
  const [resources, setResources] = useState<KitResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<KitResource | null>(null);
  const [actionLoading, setActionLoading] = useState<ActionKey>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      const dbKey = SLUG_TO_MODULE_KEY[moduleKey] ?? moduleKey;
      const { data, error } = await supabase
        .from("kit_resources")
        .select("*")
        .eq("module", dbKey)
        .order("order_index", { ascending: true });
      if (!cancelled) {
        setResources(error ? [] : ((data as KitResource[]) ?? []));
        setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [moduleKey]);

  const getSignedUrl = async (r: KitResource): Promise<string | null> => {
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .createSignedUrl(r.file_path, 60 * 10);
    if (error || !data?.signedUrl) {
      toast.error("Couldn't open this tool. Please try again.");
      return null;
    }
    return data.signedUrl;
  };

  const handleAction = async (key: Exclude<ActionKey, null>) => {
    if (!active) return;
    setActionLoading(key);
    const url = await getSignedUrl(active);
    setActionLoading(null);
    if (!url) return;
    if (key === "download") {
      const a = document.createElement("a");
      a.href = url;
      a.download = "";
      a.rel = "noopener noreferrer";
      a.target = "_blank";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } else {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

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

  if (resources.length === 0) {
    return (
      <section className="mt-10">
        <div className="liquid-glass rounded-3xl p-6 text-sm text-white/60">
          No bonus tools found for this module yet.
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
        {resources.map((r, i) => (
          <motion.div
            key={r.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.04 }}
            className="liquid-glass rounded-3xl p-5 flex flex-col"
          >
            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-white/5 p-3 ring-1 ring-white/10">
                <Sparkles className="h-5 w-5 text-white/80" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-serif text-lg text-white">{r.title}</h3>
                {r.description && (
                  <p className="mt-1 text-sm text-white/60">{r.description}</p>
                )}
                <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/5 px-2.5 py-1 text-[10px] uppercase tracking-widest text-white/50 ring-1 ring-white/10">
                  <Wand2 className="h-3 w-3" /> Guided tool
                </span>
              </div>
            </div>

            <button
              onClick={() => setActive(r)}
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-medium text-black hover:bg-white/90"
            >
              <Sparkles className="h-4 w-4" /> Start Tool
            </button>
            <p className="mt-2 flex items-center justify-center gap-1.5 text-[11px] text-white/40">
              <ShieldCheck className="h-3 w-3" /> Opens securely
            </p>
          </motion.div>
        ))}
      </div>

      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="liquid-glass-strong border-white/10 text-white sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">{active?.title}</DialogTitle>
            <DialogDescription className="text-white/70">
              {active?.description ?? "A guided tool to use alongside this module."}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-2 flex flex-col gap-3">
            <button
              onClick={() => handleAction("use")}
              disabled={actionLoading !== null}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-4 py-3 text-sm font-medium text-black hover:bg-white/90 disabled:opacity-60"
            >
              {actionLoading === "use" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              Use this inside the module
            </button>
            <p className="-mt-1 text-center text-[11px] text-white/40">
              Launches the guided tool
            </p>

            <div className="grid gap-2 sm:grid-cols-2">
              <button
                onClick={() => handleAction("open")}
                disabled={actionLoading !== null}
                className="inline-flex items-center justify-center gap-2 rounded-full liquid-glass px-4 py-2.5 text-sm font-medium text-white hover:bg-white/10 disabled:opacity-60"
              >
                {actionLoading === "open" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ExternalLink className="h-4 w-4" />
                )}
                Open secure original
              </button>
              <button
                onClick={() => handleAction("download")}
                disabled={actionLoading !== null}
                className="inline-flex items-center justify-center gap-2 rounded-full liquid-glass px-4 py-2.5 text-sm font-medium text-white hover:bg-white/10 disabled:opacity-60"
              >
                {actionLoading === "download" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                Download original
              </button>
            </div>
          </div>

          <DialogFooter className="mt-2">
            <p className="flex w-full items-center justify-center gap-1.5 text-[11px] text-white/40">
              <ShieldCheck className="h-3 w-3" /> Secure private link, expires shortly
            </p>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
