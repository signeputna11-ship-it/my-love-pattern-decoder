import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getKitByToken, markStageComplete } from "@/server/access.functions";
import { Check, Loader2 } from "lucide-react";
import { VideoBg } from "@/components/shop/VideoBg";

type Stage = {
  id: string;
  position: number;
  slug: string;
  title: string;
  subtitle: string | null;
  body: string | null;
  completed: boolean;
};

export const Route = createFileRoute("/kit/$token")({
  component: KitPage,
  head: () => ({
    meta: [
      { title: "Your Reset Kit · My Love Pattern" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        overflow: "hidden",
        backgroundColor: "#F8F5F0",
        color: "#111111",
      }}
    >
      <VideoBg
        src="https://pub-687d7fb8b7f44636a61754dc527f9690.r2.dev/FLOWER%20AND%20CRYSTALS%20ISLAND%20TOP%20VIEW.mp4"
        overlay="rgba(248,245,240,0.84)"
      />
      <div style={{ position: "relative", zIndex: 2 }}>{children}</div>
    </div>
  );
}

function KitPage() {
  const { token } = Route.useParams();
  const [stages, setStages] = useState<Stage[] | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    getKitByToken({ data: { token } })
      .then((r) => setStages(r.stages as Stage[]))
      .catch((e) => setErr(e?.message ?? "Could not load kit"));
  }, [token]);

  const toggle = async (stageId: string) => {
    setStages((s) =>
      s ? s.map((st) => (st.id === stageId ? { ...st, completed: true } : st)) : s,
    );
    try {
      await markStageComplete({ data: { token, stageId } });
    } catch {
      // best-effort
    }
  };

  if (err) {
    return (
      <Shell>
        <div className="grid min-h-screen place-items-center p-6">
          <div className="rounded-3xl border border-red-300 bg-red-50 p-6 text-center">
            <p className="text-red-700">{err}</p>
          </div>
        </div>
      </Shell>
    );
  }

  if (!stages) {
    return (
      <Shell>
        <div className="grid min-h-screen place-items-center">
          <Loader2 className="h-6 w-6 animate-spin" style={{ color: "#6b4c44" }} />
        </div>
      </Shell>
    );
  }

  const done = stages.filter((s) => s.completed).length;
  const pct = stages.length ? (done / stages.length) * 100 : 0;

  return (
    <Shell>
      <div className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
        <header className="pb-8">
          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "2.5px",
              color: "#8A8480",
            }}
          >
            <span style={{ color: "#EDB200" }}>✦</span> My Love Pattern · Reset Kit
          </p>
          <h1
            style={{
              fontFamily: "'Instrument Serif', serif",
              fontStyle: "italic",
              fontSize: "clamp(36px,5vw,60px)",
              color: "#111111",
              lineHeight: 1.1,
              textWrap: "balance",
              marginTop: 8,
            }}
          >
            Your five-stage reset.
          </h1>
          <p style={{ marginTop: 14, fontSize: 15, color: "#2c1f1a", lineHeight: 1.7 }}>
            Move through the stages at your pace. Mark each one complete when you finish.
          </p>
          <div
            style={{
              marginTop: 20,
              height: 3,
              background: "rgba(255,255,255,0.4)",
              borderRadius: 100,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: 3,
                width: `${pct}%`,
                background: "linear-gradient(90deg, #c9857a, #EDB200)",
                borderRadius: 100,
                transition: "width 0.4s ease",
              }}
            />
          </div>
          <p
            style={{
              marginTop: 10,
              fontFamily: "Inter, sans-serif",
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "2px",
              color: "#8A8480",
            }}
          >
            {done} of {stages.length} complete
          </p>
        </header>

        <div className="mt-6 space-y-4">
          {stages.map((s) => (
            <div
              key={s.id}
              style={{
                background: "rgba(255,255,255,0.75)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1px solid rgba(255,255,255,0.5)",
                borderRadius: 16,
                padding: 28,
              }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: 11,
                      textTransform: "uppercase",
                      letterSpacing: "2px",
                      color: "#8A8480",
                    }}
                  >
                    Stage {s.position}
                  </p>
                  <h2
                    style={{
                      fontFamily: "'Instrument Serif', serif",
                      fontStyle: "italic",
                      fontSize: 26,
                      color: "#111111",
                      textWrap: "balance",
                      marginTop: 4,
                      lineHeight: 1.2,
                    }}
                  >
                    {s.title}
                  </h2>
                  {s.subtitle && (
                    <p style={{ marginTop: 6, fontSize: 14, color: "#6b4c44" }}>{s.subtitle}</p>
                  )}
                  {s.body && (
                    <div
                      style={{
                        marginTop: 16,
                        background: "rgba(255,255,255,0.65)",
                        backdropFilter: "blur(12px)",
                        WebkitBackdropFilter: "blur(12px)",
                        border: "1px solid #E8E3DC",
                        borderRadius: 14,
                        padding: "20px 24px",
                        fontSize: 15,
                        color: "#2c1f1a",
                        lineHeight: 1.75,
                      }}
                    >
                      {s.body}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => toggle(s.id)}
                  disabled={s.completed}
                  aria-label={s.completed ? "Completed" : "Mark complete"}
                  style={{
                    display: "flex",
                    width: 40,
                    height: 40,
                    flexShrink: 0,
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "9999px",
                    border: s.completed
                      ? "1px solid rgba(120,180,120,0.4)"
                      : "1px solid #E8E3DC",
                    background: s.completed ? "rgba(120,180,120,0.15)" : "rgba(255,255,255,0.7)",
                    color: s.completed ? "#3f7048" : "#8A8480",
                    transition: "all 0.2s",
                  }}
                >
                  <Check className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <p
          className="mt-12 text-center"
          style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#8A8480" }}
        >
          Bookmark this page. Your progress saves to your access link.
        </p>
      </div>
    </Shell>
  );
}
