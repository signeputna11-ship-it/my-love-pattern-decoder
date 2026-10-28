import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { checkIsAdmin } from "@/lib/server-fns/admin-emails.functions";

export const Route = createFileRoute("/app/admin/audio")({
  component: AdminAudioPage,
  head: () => ({ meta: [{ title: "Audio · Admin" }, { name: "robots", content: "noindex" }] }),
});

type Mod = {
  id: string;
  slug: string;
  title: string;
  journey_id: string | null;
  audio_path: string | null;
  audio_title: string | null;
};
type Journey = { id: string; title: string };

function AdminAudioPage() {
  const [auth, setAuth] = useState<"checking" | "ok" | "denied">("checking");
  const [modules, setModules] = useState<Mod[]>([]);
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [moduleId, setModuleId] = useState("");
  const [title, setTitle] = useState("");
  const [minutes, setMinutes] = useState("");
  const [binaural, setBinaural] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    const m = await supabase.from("modules").select("*").order("position");
    setModules((m.data as unknown as Mod[]) ?? []);
    const j = await (supabase as any).from("journeys").select("id,title").order("position");
    setJourneys((j.data as Journey[]) ?? []);
  };

  useEffect(() => {
    checkIsAdmin()
      .then((r) => {
        setAuth(r.isAdmin ? "ok" : "denied");
        if (r.isAdmin) load();
      })
      .catch(() => setAuth("denied"));
  }, []);

  const upload = async () => {
    if (!moduleId || !file) return toast.error("Choose a module and an audio file");
    const mod = modules.find((m) => m.id === moduleId);
    if (!mod) return;
    setBusy(true);
    try {
      const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
      const path = `${mod.slug}/${Date.now()}-${safe}`;
      const up = await supabase.storage.from("audio").upload(path, file, {
        contentType: file.type || "audio/mpeg",
        upsert: false,
      });
      if (up.error) throw up.error;
      const upd = await (supabase as any)
        .from("modules")
        .update({
          audio_path: path,
          audio_title: title || mod.title,
          audio_minutes: minutes ? Number(minutes) : null,
          audio_binaural: binaural,
        })
        .eq("id", moduleId);
      if (upd.error) throw upd.error;
      toast.success("Audio attached");
      setFile(null);
      setTitle("");
      setMinutes("");
      await load();
    } catch (e: any) {
      console.error("[admin audio]", e);
      toast.error(e?.message ?? "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  if (auth === "checking")
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-foreground/50" />
      </div>
    );
  if (auth === "denied")
    return <div className="mx-auto max-w-md px-6 py-20 text-center text-foreground/70">Admins only.</div>;

  const jTitle = (id: string | null) => journeys.find((j) => j.id === id)?.title ?? "No journey";

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
      <h1 className="font-serif text-4xl">Audio library</h1>
      <p className="mt-2 text-sm text-foreground/60">
        Attach a recording to a module. MP3 at 96 to 128 kbps keeps files small. Maximum about 50 MB.
      </p>

      <div className="mt-8 liquid-glass-strong space-y-4 rounded-3xl p-6">
        <label className="block text-sm">
          Module
          <select
            value={moduleId}
            onChange={(e) => setModuleId(e.target.value)}
            className="mt-1 w-full rounded-2xl bg-white/60 px-4 py-3 text-sm text-foreground"
          >
            <option value="">Choose a module</option>
            {modules.map((m) => (
              <option key={m.id} value={m.id}>
                {jTitle(m.journey_id)} · {m.title}
                {m.audio_path ? " (has audio)" : ""}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          Title shown to members
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Wealth Generator"
            className="mt-1 w-full rounded-2xl bg-white/60 px-4 py-3 text-sm text-foreground placeholder:text-foreground/30"
          />
        </label>
        <div className="flex flex-wrap items-center gap-4">
          <label className="text-sm">
            Minutes
            <input
              type="number"
              min={1}
              value={minutes}
              onChange={(e) => setMinutes(e.target.value)}
              className="ml-2 w-24 rounded-2xl bg-white/60 px-3 py-2 text-sm text-foreground"
            />
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={binaural} onChange={(e) => setBinaural(e.target.checked)} />
            Binaural (shows headphones notice)
          </label>
        </div>
        <input
          type="file"
          accept="audio/mpeg,audio/mp4,audio/x-m4a,.mp3,.m4a"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="block w-full text-sm text-foreground/70"
        />
        <button
          onClick={upload}
          disabled={busy}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-50"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          {busy ? "Uploading…" : "Upload and attach"}
        </button>
      </div>
    </div>
  );
}
