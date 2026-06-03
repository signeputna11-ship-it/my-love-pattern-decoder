import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getWorksheetByToken, saveWorksheetResponse } from "@/lib/server-fns/access.functions";
import { Loader2, Check } from "lucide-react";
import { VideoBg } from "@/components/shop/VideoBg";

type Loaded = {
  product: { slug: string; name: string; short_description: string | null } | null;
  response: { data: Record<string, string>; updated_at: string | null };
};

type Question = { id: string; number: string; text: string };

const GENERIC_QUESTIONS: Question[] = [
  { id: "q1", number: "01", text: "The pattern I notice most often" },
  { id: "q2", number: "02", text: "Where I first learned this pattern" },
  { id: "q3", number: "03", text: "What the pattern protects me from" },
  { id: "q4", number: "04", text: "The cost I'm paying to keep it" },
  { id: "q5", number: "05", text: "One small move I'll try this week" },
];

const WORKSHEET_QUESTIONS: Record<string, Question[]> = {
  "breadcrumbing-red-flags": [
    { id: "q1", number: "01", text: "Describe the last time you felt confused about where you stood with someone. What were they doing that created that confusion?" },
    { id: "q2", number: "02", text: "Looking back, were there early signs of inconsistency that you explained away? What were they?" },
    { id: "q3", number: "03", text: "What story did you tell yourself to make the inconsistency feel okay?" },
    { id: "q4", number: "04", text: "How did their inconsistency affect your behaviour? Did you pursue more, pull back, or change yourself in response?" },
    { id: "q5", number: "05", text: "What would it have looked like if their attention had been consistent from the start? How would you have felt about that?" },
    { id: "q6", number: "06", text: "Breadcrumbing often feels like almost. Almost choosing you. Almost committing. Almost being available. What is the almost you have been waiting for?" },
    { id: "q7", number: "07", text: "What would you tell a close friend if she described this same situation to you?" },
    { id: "q8", number: "08", text: "What is one thing you are now able to name as a breadcrumb that you previously called a maybe?" },
  ],
  "availability-vs-chemistry": [
    { id: "q1", number: "01", text: "Think of the person you have felt most strongly about. Describe how they made you feel in three words." },
    { id: "q2", number: "02", text: "Now describe what they actually did consistently. What were their actions over time?" },
    { id: "q3", number: "03", text: "Where was the gap between how they felt and what they did?" },
    { id: "q4", number: "04", text: "Think of someone who was consistently available to you. How did they feel in comparison? What did you tell yourself about that difference?" },
    { id: "q5", number: "05", text: "What does chemistry feel like in your body when you meet someone? Where do you feel it physically?" },
    { id: "q6", number: "06", text: "Has that feeling ever turned out to be accurate information about the relationship? Or has it led you somewhere that did not match the feeling?" },
    { id: "q7", number: "07", text: "What would availability look like in practice for you? Name three specific behaviours." },
    { id: "q8", number: "08", text: "Finish this sentence: I will know someone is genuinely available when they..." },
  ],
  "insecurity-soothing-sop": [
    { id: "q1", number: "01", text: "Describe the last time you felt a spike of insecurity in a relationship or dating situation. What triggered it?" },
    { id: "q2", number: "02", text: "What did you want to do immediately after that spike? Text, check their profile, ask for reassurance?" },
    { id: "q3", number: "03", text: "What did you actually do?" },
    { id: "q4", number: "04", text: "How long did the relief last if you acted on the urge? What happened after?" },
    { id: "q5", number: "05", text: "What is the story your mind tells you when this spike happens? Write it out in full." },
    { id: "q6", number: "06", text: "Where in your body do you feel insecurity? Describe the physical sensation." },
    { id: "q7", number: "07", text: "What are three things that genuinely settle you that do not involve the other person? Not distraction. Actual settling." },
    { id: "q8", number: "08", text: "Write out your personal soothing sequence: the exact steps you will take next time the spike happens before you act on it." },
    { id: "q9", number: "09", text: "What would it mean about you if you went 24 hours without checking for a signal from them?" },
  ],
  "higher-standards-fear": [
    { id: "q1", number: "01", text: "Write down your actual standards. Not the ones you think you should have. The ones you actually want. List them." },
    { id: "q2", number: "02", text: "Which of those standards have you compromised in a recent relationship? Be specific." },
    { id: "q3", number: "03", text: "What did you tell yourself to justify the compromise?" },
    { id: "q4", number: "04", text: "What did you fear would happen if you held the standard?" },
    { id: "q5", number: "05", text: "Has that fear ever come true? Write honestly about what actually happened when you asked for more." },
    { id: "q6", number: "06", text: "What is the belief underneath the fear? Complete this sentence: If I ask for more I will..." },
    { id: "q7", number: "07", text: "Is that belief based on evidence from this relationship or is it an older story?" },
    { id: "q8", number: "08", text: "What would holding this standard actually cost you? And what is not holding it currently costing you?" },
    { id: "q9", number: "09", text: "Write one thing you are willing to ask for or require in your next relationship that you have previously let slide." },
  ],
  "worth-tied-to-attention": [
    { id: "q1", number: "01", text: "On a scale of one to ten, how would you rate how you feel about yourself right now? Now think of the last time someone you liked gave you a lot of attention. What was that number then?" },
    { id: "q2", number: "02", text: "Describe specifically how your internal state changes when someone you like goes quiet. What happens emotionally? Physically?" },
    { id: "q3", number: "03", text: "What does receiving attention from someone you like tell you about yourself?" },
    { id: "q4", number: "04", text: "What does a lack of attention from someone you like tell you about yourself?" },
    { id: "q5", number: "05", text: "Where did you first learn that attention from others was connected to your value?" },
    { id: "q6", number: "06", text: "What would it mean about you if the person you like never texted again? Write the full story your mind would tell." },
    { id: "q7", number: "07", text: "Now rewrite that story replacing their attention with your own evidence of your worth. What do you actually know to be true about yourself?" },
    { id: "q8", number: "08", text: "Finish this sentence: I am worthy of love even when..." },
    { id: "q9", number: "09", text: "Name three sources of self-worth that have nothing to do with how someone else responds to you." },
  ],
  "saying-no-script": [
    { id: "q1", number: "01", text: "Describe the last time you said yes when you meant no. What was the situation?" },
    { id: "q2", number: "02", text: "What did you fear would happen if you said no?" },
    { id: "q3", number: "03", text: "How did you feel after saying yes? Immediately, and then later?" },
    { id: "q4", number: "04", text: "What story did you tell yourself to justify the yes? Write it out." },
    { id: "q5", number: "05", text: "Write the no you wanted to say in that situation. Exactly as you would have said it if you were not afraid." },
    { id: "q6", number: "06", text: "Now write a version of that no that is direct but not harsh. One sentence." },
    { id: "q7", number: "07", text: "What do you imagine saying no communicates to the other person?" },
    { id: "q8", number: "08", text: "What does saying no actually communicate?" },
    { id: "q9", number: "09", text: "Write three sentences you can use as no scripts in future situations. Keep them short, honest, and without over-explanation." },
  ],
};

export const Route = createFileRoute("/w/$token")({
  component: WorksheetPage,
  head: () => ({
    meta: [
      { title: "Your Worksheet · My Love Pattern" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

function WorksheetPage() {
  const { token } = Route.useParams();
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    getWorksheetByToken({ data: { token } })
      .then((r) => {
        setLoaded(r as Loaded);
        setValues((r.response.data as Record<string, string>) ?? {});
      })
      .catch((e) => setErr(e?.message ?? "Could not load worksheet"));
  }, [token]);

  const questions = useMemo(() => {
    const slug = loaded?.product?.slug;
    if (slug && WORKSHEET_QUESTIONS[slug]) return WORKSHEET_QUESTIONS[slug];
    return GENERIC_QUESTIONS;
  }, [loaded?.product?.slug]);

  const persist = useCallback(
    (next: Record<string, string>) => {
      if (debounce.current) clearTimeout(debounce.current);
      setSaveState("saving");
      debounce.current = setTimeout(() => {
        saveWorksheetResponse({ data: { token, data: next } })
          .then(() => setSaveState("saved"))
          .catch(() => setSaveState("idle"));
      }, 800);
    },
    [token],
  );

  const onChange = (id: string, val: string) => {
    const next = { ...values, [id]: val };
    setValues(next);
    persist(next);
  };

  const answeredCount = questions.filter((q) => (values[q.id] ?? "").trim().length > 0).length;
  const progressPct = questions.length ? (answeredCount / questions.length) * 100 : 0;

  const Shell = ({ children }: { children: React.ReactNode }) => (
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
        src="https://pub-687d7fb8b7f44636a61754dc527f9690.r2.dev/FLOWER%20AND%20CRYSTALS%20CLOSE%20UP.mp4"
        overlay="rgba(248,245,240,0.84)"
      />
      <div style={{ position: "relative", zIndex: 2 }}>{children}</div>
    </div>
  );

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

  if (!loaded) {
    return (
      <Shell>
        <div className="grid min-h-screen place-items-center">
          <Loader2 className="h-6 w-6 animate-spin" style={{ color: "#6b4c44" }} />
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="mx-auto max-w-2xl px-4 py-12 sm:py-16">
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
            Worksheet <span style={{ color: "#EDB200" }}>✦</span>
          </p>
          <h1
            style={{
              fontFamily: "'Instrument Serif', serif",
              fontStyle: "italic",
              fontSize: "clamp(32px,4.5vw,52px)",
              color: "#111111",
              lineHeight: 1.1,
              textWrap: "balance",
              marginTop: 8,
            }}
          >
            {loaded.product?.name ?? "Your worksheet"}
          </h1>
          {loaded.product?.short_description && (
            <p style={{ marginTop: 10, fontSize: 15, color: "#2c1f1a", lineHeight: 1.7 }}>
              {loaded.product.short_description}
            </p>
          )}

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
                width: `${progressPct}%`,
                background: "linear-gradient(90deg, #c9857a, #EDB200)",
                borderRadius: 100,
                transition: "width 0.4s ease",
              }}
            />
          </div>

          <div
            className="mt-3 inline-flex items-center gap-1.5"
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "2px",
              color: "#8A8480",
            }}
          >
            {saveState === "saving" ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin" /> Saving
              </>
            ) : saveState === "saved" ? (
              <>
                <Check className="h-3 w-3" style={{ color: "#5a8a5c" }} /> Saved
              </>
            ) : (
              <>{answeredCount} of {questions.length} answered</>
            )}
          </div>
        </header>

        <div className="mt-4 space-y-5">
          {questions.map((q) => (
            <div
              key={q.id}
              style={{
                background: "rgba(255,255,255,0.52)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                border: "1px solid rgba(255,255,255,0.45)",
                boxShadow:
                  "0 4px 24px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.85)",
                borderRadius: 20,
                padding: 32,
              }}
            >
              <label
                style={{
                  display: "block",
                  fontFamily: "Inter, sans-serif",
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                  color: "#8A8480",
                }}
              >
                {q.number}.{" "}
                <span
                  style={{
                    fontFamily: "'Instrument Serif', serif",
                    fontStyle: "italic",
                    fontSize: 18,
                    color: "#111111",
                    textTransform: "none",
                    letterSpacing: "normal",
                  }}
                >
                  {q.text}
                </span>
              </label>
              <textarea
                value={values[q.id] ?? ""}
                onChange={(e) => onChange(q.id, e.target.value)}
                onFocus={() => setFocusedField(q.id)}
                onBlur={() => setFocusedField(null)}
                placeholder="Write freely"
                rows={5}
                style={{
                  marginTop: 14,
                  width: "100%",
                  background:
                    focusedField === q.id ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.6)",
                  backdropFilter: "blur(8px)",
                  border:
                    focusedField === q.id
                      ? "1px solid rgba(201,133,122,0.6)"
                      : "1px solid rgba(255,255,255,0.5)",
                  borderRadius: 12,
                  padding: 16,
                  fontSize: 15,
                  lineHeight: 1.75,
                  color: "#2c1f1a",
                  fontFamily: "Inter, sans-serif",
                  outline: "none",
                  resize: "vertical",
                }}
              />
            </div>
          ))}
        </div>

        <p
          className="mt-12 text-center"
          style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#8A8480" }}
        >
          Your answers are private to this link. Save the link, it's your way back in.
        </p>
      </div>
    </Shell>
  );
}
