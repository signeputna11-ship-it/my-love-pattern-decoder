import { useEffect, useState } from "react";
import { Headphones } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Props = {
  path: string | null;
  title?: string | null;
  minutes?: number | null;
  binaural?: boolean;
};

export function AudioPlayer({ path, title, minutes, binaural }: Props) {
  const [url, setUrl] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!path) return;
    let cancelled = false;
    supabase.storage
      .from("audio")
      .createSignedUrl(path, 60 * 60)
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error || !data?.signedUrl) setFailed(true);
        else setUrl(data.signedUrl);
      });
    return () => {
      cancelled = true;
    };
  }, [path]);

  if (!path) {
    return (
      <div className="mt-6 liquid-glass rounded-3xl p-5 text-sm text-white/60">
        <p className="flex items-center gap-2">
          <Headphones className="h-4 w-4" /> Audio for this module is being recorded by Signe.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6 liquid-glass-strong rounded-3xl p-5 sm:p-6">
      <p className="flex items-center gap-2 text-xs uppercase tracking-widest text-white/50">
        <Headphones className="h-4 w-4" /> Listen{minutes ? ` · ${minutes} min` : ""}
      </p>
      {title && <h3 className="mt-1 font-serif text-xl">{title}</h3>}
      {failed ? (
        <p className="mt-3 text-sm text-white/60">We couldn't load the audio. Please refresh.</p>
      ) : url ? (
        <audio controls preload="none" src={url} className="mt-3 w-full" />
      ) : (
        <p className="mt-3 text-sm text-white/50">Loading audio…</p>
      )}
      <p className="mt-3 text-xs leading-relaxed text-white/50">
        {binaural ? "Use headphones for this recording. " : ""}
        Listen somewhere safe and comfortable. Never while driving or using machinery. If you have
        epilepsy, are pregnant or have a heart-rhythm condition, check with your doctor before
        using binaural audio. This audio is educational self-reflection and does not replace
        medical or mental health care.
      </p>
    </div>
  );
}
