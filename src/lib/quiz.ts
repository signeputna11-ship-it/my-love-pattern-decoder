// The starting-point quiz. Copy and weights live here so the page and the server score the same way.
export type JourneyKey = "confidence" | "self-worth" | "money" | "business" | "purpose" | "relationships";

export const JOURNEYS: Record<JourneyKey, { title: string; tagline: string; reflection: string }> = {
  confidence: {
    title: "Confidence",
    tagline: "Say it clearly. Trust your own decisions.",
    reflection:
      "You often know what you want to say, and then you soften it. Your starting point is learning to speak and decide from steady ground, one small moment at a time.",
  },
  "self-worth": {
    title: "Self-Worth",
    tagline: "Feel enough as you are, then act from it.",
    reflection:
      "You give, achieve and carry a lot, and enough still feels just out of reach. Your starting point is building a quiet, steady sense of worth that does not depend on proving anything.",
  },
  money: {
    title: "Money",
    tagline: "Release old money stories and keep what you earn.",
    reflection:
      "Your relationship with money has a story behind it, and that story can change. Your starting point is meeting it with kindness, then choosing a new one.",
  },
  business: {
    title: "Business",
    tagline: "Build an offer you are proud to sell.",
    reflection:
      "You have real skill and something worth offering. Your starting point is a clear offer, a clear price and a way of being seen that feels like you.",
  },
  purpose: {
    title: "Purpose",
    tagline: "Find the direction that feels like yours.",
    reflection:
      "You are capable, and you are ready for work and a life that mean something to you. Your starting point is hearing your own direction clearly.",
  },
  relationships: {
    title: "Relationships",
    tagline: "Understand your pattern and choose differently.",
    reflection:
      "The same kind of connection keeps finding you. Your starting point is seeing the pattern kindly, so the next choice can be a different one.",
  },
};

export type QuizOption = { label: string; weights: Partial<Record<JourneyKey, number>> };
export type QuizQuestion = { id: string; prompt: string; options: QuizOption[] };

export const QUIZ: QuizQuestion[] = [
  {
    id: "sentence",
    prompt: "Which sentence sounds most like you this week?",
    options: [
      { label: "I know what I want to say, then I soften it.", weights: { confidence: 3, "self-worth": 1 } },
      { label: "I do a lot, and it still does not feel like enough.", weights: { "self-worth": 3, purpose: 1 } },
      { label: "Money arrives and somehow leaves again.", weights: { money: 3 } },
      { label: "I have skills, and I want to turn them into real work.", weights: { business: 3, money: 1 } },
      { label: "I am capable, and I want to know where I am headed.", weights: { purpose: 3 } },
      { label: "I keep meeting the same kind of connection.", weights: { relationships: 3 } },
    ],
  },
  {
    id: "year",
    prompt: "A year from now, which change would matter most to you?",
    options: [
      { label: "Speaking up and trusting my decisions.", weights: { confidence: 3 } },
      { label: "Feeling worthy of good things.", weights: { "self-worth": 3 } },
      { label: "Earning more and feeling calm about money.", weights: { money: 3 } },
      { label: "Running work I am proud of.", weights: { business: 3 } },
      { label: "Knowing what I am here to do.", weights: { purpose: 3 } },
      { label: "Feeling safe and seen with someone.", weights: { relationships: 3 } },
    ],
  },
  {
    id: "feedback",
    prompt: "After a conversation or a piece of feedback, you tend to...",
    options: [
      { label: "Replay it and rewrite what I should have said.", weights: { confidence: 3 } },
      { label: "Decide I must try harder to deserve my place.", weights: { "self-worth": 3 } },
      { label: "Move on quickly and bury how it felt.", weights: { "self-worth": 1, purpose: 1, relationships: 1 } },
      { label: "Look for what it means for my work.", weights: { business: 2, purpose: 1 } },
    ],
  },
  {
    id: "price",
    prompt: "When it is time to name a price or ask for what you need...",
    options: [
      { label: "I lower it before anyone asks.", weights: { money: 2, confidence: 2, business: 1 } },
      { label: "I wonder if I am allowed to ask.", weights: { "self-worth": 3 } },
      { label: "I am unsure what my work is really worth.", weights: { business: 3, money: 1 } },
      { label: "It feels fine. I want to grow what I have.", weights: { business: 2, purpose: 1 } },
    ],
  },
  {
    id: "weekends",
    prompt: "Picture a free Sunday. What comes up first?",
    options: [
      { label: "A quiet wish for more meaning in how I spend my time.", weights: { purpose: 3 } },
      { label: "A list of things I still have to prove or catch up on.", weights: { "self-worth": 2, business: 1 } },
      { label: "Thinking about someone, or the lack of someone.", weights: { relationships: 3 } },
      { label: "Checking my accounts and feeling a knot.", weights: { money: 3 } },
    ],
  },
  {
    id: "support",
    prompt: "What kind of support would feel best right now?",
    options: [
      { label: "Short guided audio to settle and reset.", weights: { "self-worth": 1, confidence: 1, purpose: 1 } },
      { label: "Clear exercises I can fill in privately.", weights: { money: 1, business: 1, purpose: 1 } },
      { label: "A gentle daily nudge from Signe.", weights: { confidence: 1, "self-worth": 1 } },
      { label: "A bigger plan with real structure.", weights: { business: 1, money: 1 } },
    ],
  },
  {
    id: "ready",
    prompt: "How ready do you feel to begin?",
    options: [
      { label: "Ready. Show me where to start.", weights: {} },
      { label: "Curious, and a little cautious.", weights: {} },
      { label: "I want to look around first.", weights: {} },
    ],
  },
];

export type Scores = Record<JourneyKey, number>;

export function emptyScores(): Scores {
  return { confidence: 0, "self-worth": 0, money: 0, business: 0, purpose: 0, relationships: 0 };
}

/** answers[i] is the chosen option index for QUIZ[i]. Returns null for malformed input. */
export function scoreAnswers(answers: number[]): { scores: Scores; primary: JourneyKey; secondary: JourneyKey | null } | null {
  if (!Array.isArray(answers) || answers.length !== QUIZ.length) return null;
  const scores = emptyScores();
  for (let i = 0; i < QUIZ.length; i++) {
    const opt = QUIZ[i].options[answers[i]];
    if (!opt) return null;
    for (const [k, v] of Object.entries(opt.weights)) scores[k as JourneyKey] += v ?? 0;
  }
  // Stable tie-break by journey order so the same answers always give the same result.
  const order = Object.keys(JOURNEYS) as JourneyKey[];
  const ranked = order
    .map((k, idx) => ({ k, s: scores[k], idx }))
    .sort((a, b) => b.s - a.s || a.idx - b.idx);
  return {
    scores,
    primary: ranked[0].k,
    secondary: ranked[1] && ranked[1].s > 0 ? ranked[1].k : null,
  };
}
