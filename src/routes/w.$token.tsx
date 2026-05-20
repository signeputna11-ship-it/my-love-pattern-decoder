import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getWorksheetByToken, saveWorksheetResponse } from "@/server/access.functions";
import { Loader2, Check } from "lucide-react";

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

  if (err) {
    return (
      <div className="grid min-h-screen place-items-center p-6" style={{ backgroundColor: "#F8F5F0" }}>
        <div className="rounded-3xl border border-red-300 bg-red-50 p-6 text-center">
          <p className="text-red-700">{err}</p>
        </div>
      </div>
    );
  }

  if (!loaded) {
    return (
      <div className="grid min-h-screen place-items-center" style={{ backgroundColor: "#F8F5F0" }}>
        <Loader2 className="h-6 w-6 animate-spin" style={{ color: "#6b4c44" }} />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen" style={{ backgroundColor: "#F8F5F0", color: "#111" }}>
      <div className="mx-auto max-w-2xl px-4 py-12 sm:py-16">
        <header className="pb-8" style={{ borderBottom: "1px solid #E8E3DC" }}>
          <p className="text-xs uppercase tracking-[0.3em]" style={{ color: "#8A8480" }}>
            Worksheet <span style={{ color: "#EDB200" }}>✦</span>
          </p>
          <h1
            className="mt-2 text-3xl sm:text-4xl italic"
            style={{ fontFamily: "Instrument Serif, serif", textWrap: "balance" }}
          >
            {loaded.product?.name ?? "Your worksheet"}
          </h1>
          {loaded.product?.short_description && (
            <p className="mt-2 text-sm" style={{ color: "#6b4c44" }}>{loaded.product.short_description}</p>
          )}
          <div className="mt-4 inline-flex items-center gap-1.5 text-[11px] uppercase tracking-widest" style={{ color: "#8A8480" }}>
            {saveState === "saving" ? (
              <><Loader2 className="h-3 w-3 animate-spin" /> Saving</>
            ) : saveState === "saved" ? (
              <><Check className="h-3 w-3" style={{ color: "#5a8a5c" }} /> Saved</>
            ) : (
              <>Auto-saves as you write</>
            )}
          </div>
        </header>

        <div className="mt-8 space-y-8">
          {questions.map((q) => (
            <div key={q.id}>
              <label className="block text-xs uppercase tracking-widest" style={{ color: "#8A8480" }}>
                {q.number}. <span style={{ color: "#111" }}>{q.text}</span>
              </label>
              <textarea
                value={values[q.id] ?? ""}
                onChange={(e) => onChange(q.id, e.target.value)}
                placeholder="Write freely"
                rows={5}
                className="mt-2 w-full rounded-2xl px-4 py-3 text-sm leading-relaxed focus:outline-none"
                style={{
                  backgroundColor: "#fff",
                  border: "1px solid #E8E3DC",
                  color: "#111",
                  fontFamily: "Inter, sans-serif",
                }}
              />
            </div>
          ))}
        </div>

        <p className="mt-12 text-center text-xs" style={{ color: "#8A8480" }}>
          Your answers are private to this link. Save the link, it's your way back in.
        </p>
      </div>
    </div>
  );
}
