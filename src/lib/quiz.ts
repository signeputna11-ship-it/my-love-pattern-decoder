// The starting-point quiz. Copy and weights live here so the page and the server score the same way.
export type JourneyKey = "confidence" | "self-worth" | "money" | "business" | "purpose" | "relationships";

export const JOURNEYS: Record<JourneyKey, { title: string; tagline: string; reflection: string }> = {
  confidence: {
    title: "Confidence",
    tagline: "Say what you mean and stand by it.",
    reflection:
      "You know what you think, and you swallow it. You say yes when you mean no. Your starting point is speaking clearly and deciding without apologising for it.",
  },
  "self-worth": {
    title: "Self-Worth",
    tagline: "Stop earning your place. You already have it.",
    reflection:
      "You work hard, you give a lot, and it still feels like it is never enough. Your starting point is separating your worth from your output.",
  },
  money: {
    title: "Money",
    tagline: "Keep what you earn and lose the dread of the next bill.",
    reflection:
      "Money comes in and does not stay, or it never feels safe. Your starting point is the story you learned about money, and rewriting it.",
  },
  business: {
    title: "Business",
    tagline: "Charge what you are worth and sell without cringing.",
    reflection:
      "You have real skill, and you are undercharging or underselling it. Your starting point is a clear offer at a price you stand behind.",
  },
  purpose: {
    title: "Purpose",
    tagline: "Know what you are here to do.",
    reflection:
      "From the outside it looks fine. On the inside you do not know what it is all for. Your starting point is finding a direction you believe in.",
  },
  relationships: {
    title: "Relationships",
    tagline: "Break the pattern and choose differently.",
    reflection:
      "The same kind of person, and the same ending. Your starting point is seeing your pattern clearly, so the next choice can be a different one.",
  },
};

export type QuizOption = { label: string; weights: Partial<Record<JourneyKey, number>> };
export type QuizQuestion = { id: string; prompt: string; options: QuizOption[] };

export const QUIZ: QuizQuestion[] = [
  {
    id: "sentence",
    prompt: "Which one is the most true for you right now?",
    options: [
      { label: "I say yes when I mean no, and I stay quiet when I should speak.", weights: { confidence: 3, "self-worth": 1 } },
      { label: "I work myself to exhaustion and still feel I am not enough.", weights: { "self-worth": 3, purpose: 1 } },
      { label: "I earn money and it disappears. I feel broke or scared even when it comes in.", weights: { money: 3 } },
      { label: "I have the skills, I undercharge, and I cannot get people to pay a real price.", weights: { business: 3, money: 1 } },
      { label: "On paper my life looks fine. Inside I feel lost and I do not know what it is for.", weights: { purpose: 3 } },
      { label: "I keep ending up with the same type of person and the same ending.", weights: { relationships: 3 } },
    ],
  },
  {
    id: "year",
    prompt: "If nothing changes, where are you a year from now?",
    options: [
      { label: "Still biting my tongue and second-guessing every decision.", weights: { confidence: 3 } },
      { label: "Still feeling not good enough, however much I achieve.", weights: { "self-worth": 3 } },
      { label: "Still stressed about money and living month to month.", weights: { money: 3 } },
      { label: "Still stuck with a business or a skill that does not pay what it should.", weights: { business: 3 } },
      { label: "Still drifting, with no direction I believe in.", weights: { purpose: 3 } },
      { label: "Still lonely in my relationship, or repeating the same heartbreak.", weights: { relationships: 3 } },
    ],
  },
  {
    id: "feedback",
    prompt: "After a hard conversation or criticism, what do you do?",
    options: [
      { label: "I replay it for hours and rewrite what I should have said.", weights: { confidence: 3 } },
      { label: "I decide I must work harder to deserve my place.", weights: { "self-worth": 3 } },
      { label: "I shut down, say it is fine and swallow how it felt.", weights: { "self-worth": 1, purpose: 1, relationships: 1 } },
      { label: "I panic about what it means for my work and my income.", weights: { business: 2, purpose: 1 } },
    ],
  },
  {
    id: "price",
    prompt: "When you have to name your price or ask for what you need...",
    options: [
      { label: "I discount myself before they can say no.", weights: { money: 2, confidence: 2, business: 1 } },
      { label: "I feel I do not have the right to ask.", weights: { "self-worth": 3 } },
      { label: "I honestly do not know what I am worth, so I guess low.", weights: { business: 3, money: 1 } },
      { label: "I can say it, but my income still does not match my work.", weights: { business: 2, purpose: 1 } },
    ],
  },
  {
    id: "weekends",
    prompt: "It is 11pm and you cannot sleep. What is your mind on?",
    options: [
      { label: "What is the point of all this, and what am I meant to be doing?", weights: { purpose: 3 } },
      { label: "Everything I have not done well enough.", weights: { "self-worth": 2, business: 1 } },
      { label: "One person: what they said, what they did not say, and where it is going.", weights: { relationships: 3 } },
      { label: "Bills, my balance and how long the money will last.", weights: { money: 3 } },
    ],
  },
  {
    id: "support",
    prompt: "What would you actually use to change this?",
    options: [
      { label: "A guided audio for when my head will not switch off.", weights: { "self-worth": 1, confidence: 1, purpose: 1 } },
      { label: "Questions that make me face what I have been avoiding.", weights: { money: 1, business: 1, purpose: 1 } },
      { label: "A daily push from Signe so I stay on track.", weights: { confidence: 1, "self-worth": 1 } },
      { label: "A clear plan with steps I can follow.", weights: { business: 1, money: 1 } },
    ],
  },
  {
    id: "ready",
    prompt: "How ready are you to change this?",
    options: [
      { label: "Ready. I am done living like this.", weights: {} },
      { label: "Nervous. I have tried before and it did not stick.", weights: {} },
      { label: "Not sure yet. I want to look around first.", weights: {} },
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
