// Seeds the guided lessons for the Relationships journey.
// Run: node --env-file=.env.local scripts/seed-relationships-lessons.mjs
// Re-running replaces the steps of these five modules (saved answers to them are removed).
const BASE = process.env.SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const H = { apikey: KEY, Authorization: `Bearer ${KEY}`, "content-type": "application/json" };

const L = (title, body) => ({ kind: "lesson", title, body });
const P = (title, body) => ({ kind: "prompt", title, body });
const S = (title, body, options) => ({ kind: "scales", title, body, options });
const F = (title, body, options) => ({ kind: "fields", title, body, options });
const C = (title, body, options) => ({ kind: "choice", title, body, options });
const K = (title, body, options) => ({ kind: "checklist", title, body, options });

const MODULES = {
  "see-the-pattern": [
    L(
      "Same type. Same ending. It is not bad luck.",
      `You meet someone new. It feels different this time. A few months later you are in the same place: confused, exhausted, replaying conversations, wondering what you did wrong.

Most women call this bad luck, or say they just attract the wrong people. A pattern is more specific than luck. It is a loop that runs in the same order each time, and the only thing that changes is the name.

This module will not tell you what is wrong with you. Nothing is. It will help you see your loop clearly enough to step out of it.

**By the end you will have:** your loop written in five steps, the early signal in your body, and one change to try next time.`,
    ),
    L(
      "Why familiar feels like chemistry",
      `Long before you dated anyone, you learned what love feels like. Maybe attention had to be earned. Maybe closeness came with worry, or a parent was warm one day and distant the next. Your nervous system filed that away as "this is what love is".

So when someone shows up who feels like that, you get a rush: intensity, butterflies, a need to win them over. It feels like chemistry. Very often it is **recognition**.

And when someone is steady, kind and consistent, it can feel flat or even uncomfortable at first, because your body has no map for it.

> The fizz is not proof that someone is right for you. It is often proof that they feel familiar.

That is useful news, because familiar can be unlearned.`,
    ),
    S("How much does this sound like you?", "Rate each one honestly. There are no right answers.", [
      "I fall quickly and talk myself out of early red flags.",
      "I try harder when someone pulls away.",
      "I feel more attracted when I am unsure where I stand.",
      "I put their needs, plans and moods ahead of mine.",
      "Kind, steady people feel boring or too much too soon.",
      "I stay longer than I know I should.",
    ]),
    P(
      "The last three people",
      "Think of the last three people who hurt you or left you confused. For each one, write their first name or initials, and what pulled you in at the start.",
    ),
    C("What pulled you in most often?", "Pick the one that is true most often, even if it is not flattering.", [
      "Intensity and attention. I felt chosen.",
      "Being needed. I felt useful.",
      "Potential. I could see who they could become.",
      "Familiarity. It felt like home.",
      "The challenge. I wanted to win them over.",
    ]),
    L(
      "Your loop has five beats",
      `Look closely at your past relationships and you will usually find the same five beats, in the same order.

- **1. The spark.** A rush that feels bigger than the situation.
- **2. The overlook.** You notice something off, and explain it away.
- **3. The effort.** You give more, fix more, adapt more.
- **4. The distance.** They get busy, vague or cold, or you feel the strain.
- **5. The chase or the collapse.** You push harder to get closeness back, or you shut down and leave.

> Example: He texted constantly for three weeks (spark). He cancelled twice and I told myself work was crazy (overlook). I planned everything and stayed flexible (effort). His replies slowed (distance). I sent long messages asking what changed, then went silent for days (chase and collapse).

Your version will look different. The order is what matters.`,
    ),
    F("Write your loop", "Use your most recent relationship, or the one that hurt most. Short answers are fine.", [
      "1. The spark: what pulled me in",
      "2. The overlook: what I noticed and explained away",
      "3. The effort: what I did to keep them",
      "4. The distance: what changed",
      "5. The chase or the collapse: how it ended",
    ]),
    P(
      "Where do you feel it first?",
      "Think back to the overlook, the moment you noticed something off. Where in your body did you feel the first warning? A tight chest, a stomach drop, a quiet knowing? Describe it as exactly as you can. This is the signal you will learn to listen to.",
    ),
    L(
      "A pattern is a strategy, not a flaw",
      `Every part of this loop once had a job. Trying hard kept the peace. Ignoring red flags kept hope alive. Chasing kept someone close.

These were clever ways to get love and safety with what you had. They stopped working for you as an adult, and that can be true without any blame.

Seeing your pattern is not about judging your past choices. It is about getting a choice at the next fork.

**A note on safety.** If a relationship involves fear, control, threats or violence, this is not about your pattern. Please contact a local support service or emergency number. Your safety comes first.`,
    ),
    K("Before you move on", "Tick what is true for you today.", [
      "I can describe my loop in five steps",
      "I know the first signal in my body",
      "I will notice my loop this week without judging myself",
      "I will tell one safe person what I learned",
    ]),
  ],

  "calm-the-trigger": [
    L(
      "What happens when they go quiet",
      `A message goes unanswered. A tone changes. A plan is cancelled. Within seconds your chest tightens, your thoughts speed up and your phone is in your hand.

That is not weakness. It is your alarm system. To your body, a loss of connection can feel like danger, so it floods you with stress hormones and starts writing stories: they are losing interest, I said something wrong, it is happening again.

The story feels like a fact. It is a prediction made by an alarm.

**The key idea:** the first wave of alarm eases if you do not feed it. What feeds it is checking, drafting, rereading and asking everyone what it means. This module teaches you to let the wave pass before you act.`,
    ),
    S("When they go quiet, I...", "Rate how true each one is for you.", [
      "Check my phone again and again.",
      "Write long messages asking what is wrong.",
      "Reread old messages for clues.",
      "Ask friends to decode what it means.",
      "Go silent to punish or protect myself.",
      "Cannot concentrate on anything else.",
    ]),
    F("Your trigger map", "Fill this in for the last time it happened.", [
      "The moment it started (what they did or did not do)",
      "The story my mind told me",
      "What I felt in my body",
      "What I did next",
      "How I felt an hour later",
    ]),
    L(
      "The 90-second reset",
      `Use this the moment you feel the spiral start. It takes about 90 seconds and works best when you have practised it before you need it.

- **1. Feet.** Press both feet into the floor. Look around and name three things you can see.
- **2. Breathe out longer.** In for 4, out for 6. Do six rounds. The long exhale tells your body it is safe.
- **3. Name it.** Say quietly: "I feel afraid. This is a feeling, not a fact."
- **4. Delay.** Put the phone in another room. Promise yourself 30 minutes before you act.
- **5. One kind action.** Water, a short walk, a call with someone who is on your side.

You are not trying to feel calm. You are giving the wave time to pass so you can choose what to do.`,
    ),
    C("Which step is hardest for you?", "Be honest. This is where you will practise first.", [
      "Putting the phone down",
      "Staying with the feeling without fixing it",
      "Waiting 30 minutes before replying",
      "Not asking friends to analyse every message",
    ]),
    F("Your reset plan", "Write it now, while you are calm.", [
      "My first move when I feel it start",
      "Where I will put my phone",
      "A sentence I will say to myself",
      "Who I can call who will stay calm with me",
    ]),
    F(
      "The two messages",
      "Write the message you want to send in the heat of the moment. Then write the version you would send from a calm place. Do not send the first one.",
      ["The raw message (for your eyes only)", "The calm version, or 'no message needed'"],
    ),
    L(
      "What you do not need to send",
      `Most messages sent from a spiral are trying to do one thing: get relief from the feeling. They ask "are we okay?", "did I do something?", "why are you being distant?"

They rarely get you what you want. They hand your calm to the other person and often create the distance you fear.

A useful test before sending anything:

- **Am I calm enough to hear any answer?**
- **Would I send this if I knew they would reply in two days?**
- **Am I asking for information, or for relief?**

If the answer points to relief, do your reset first. The message will still be there in 30 minutes.`,
    ),
    K("Practise this week", "Tick what you will do.", [
      "Rehearse the 90-second reset once a day, even when calm",
      "Use it the next time I feel the spiral start",
      "Wait 30 minutes before sending any anxious message",
      "Notice what happens when I do not send it",
    ]),
  ],

  "rebuild-self-worth": [
    L(
      "When your worth lives in their phone",
      `If your mood rises when they text and drops when they do not, your sense of worth is being held by someone else. You may not even like how much power it has, and it still feels automatic.

This usually does not come from vanity. It comes from learning early that being chosen, praised or needed was how you stayed safe and loved. Approval became the proof that you were enough.

The problem is not wanting to be chosen. Everyone does. The problem is when being chosen is the **only** evidence you have.

This module builds a second source: evidence that comes from you.`,
    ),
    S("How much is this true for you?", "Rate each one honestly.", [
      "My day is shaped by whether they message.",
      "I hide my needs so I seem easy to be with.",
      "I feel more valuable when I am chosen.",
      "I say yes to things I do not want, to keep the peace.",
      "I feel empty or restless when I am on my own.",
      "I compare myself to the people they used to date.",
    ]),
    P(
      "What would you say to a friend?",
      "Imagine your closest friend is going through exactly what you are. She is waiting for a text, doubting herself, shrinking. Write what you would tell her. Then read it as if it were meant for you.",
    ),
    L(
      "Evidence beats affirmations",
      `Telling yourself "I am enough" often bounces off, because part of you does not believe it. Evidence works better.

Your worth does not go up when someone approves of you and does not go down when they do not. What you can build is a record of what is true about you, collected from your own life.

Each day, write down three things:

- **Something I did** that I am proud of, however small.
- **Something I am** that people rely on: kind, funny, steady, brave.
- **Something I needed** and noticed.

After two weeks you will have a pile of proof that does not depend on anyone's reply.`,
    ),
    F("Start your evidence log now", "Fill in today. Come back and add to it each day this week.", [
      "Something I did that I am proud of",
      "Something about me that people rely on",
      "A need I noticed today",
    ]),
    F("Rewrite the rule", "Write the old rule you live by, then the new rule you want to live by.", [
      "The old rule (for example: I am worth more when they choose me)",
      "The new rule (for example: My worth is not up for a vote)",
    ]),
    C("Choose one practice for the next 7 days", "One is enough. Pick the one you will actually do.", [
      "The daily evidence log, 3 lines a night",
      "A needs check at noon: what do I need right now?",
      "The first hour of the day without my phone",
      "One thing a day done only for me",
    ]),
    K("Commit", "Tick what you agree to.", [
      "I will do my practice for 7 days, and if I miss a day I will simply start again",
      "I will notice when my mood follows their messages, without scolding myself",
      "I will tell one safe person what I am working on",
    ]),
  ],

  "set-the-boundary": [
    L(
      "What a boundary really is",
      `A boundary is not a rule you set for someone else. It is a statement about what **you** will do.

> "Please do not shout at me" is a request. "If you shout, I will leave the room" is a boundary.

The first depends on the other person. The second depends only on you. That is why boundaries feel powerful, and why they feel frightening if you are used to keeping the peace.

A good boundary is calm, short and followed through. It is not a punishment, a threat or a wall.`,
    ),
    L(
      "Why yours keep collapsing",
      `Most women do not struggle to know what they need. They struggle to hold it once someone reacts. It usually collapses in one of three ways:

- **You soften it.** "It is fine, I just feel a bit..." until it means nothing.
- **You over-explain.** Long reasons invite a debate.
- **You take it back.** Guilt arrives, and you apologise for having asked.

Guilt is not proof that you did something wrong. It is the feeling of doing something new in a system that is used to the old way. It fades if you stay steady.

**Remember:** you can be kind and still say no.`,
    ),
    S("How much is this true for you?", "Rate each one honestly.", [
      "I say yes and resent it later.",
      "I over-explain when I say no.",
      "I apologise for having needs.",
      "I take boundaries back when someone is upset.",
      "I put up with things I told myself I would not.",
      "I feel guilty for days after saying no.",
    ]),
    L(
      "The three-part boundary",
      `Use this simple formula:

- **1. What I need or will no longer accept.** One clear sentence.
- **2. What I am asking for.** The change, kept simple.
- **3. What I will do if it is crossed.** Your action, not theirs.

> Example: I do not want to be contacted late at night when you have been drinking. Please text me in the morning. If it happens, I will not reply until the next day.

> Example: I need a plan by Thursday if we are going to keep seeing each other. If I do not have one, I will step back.

Short wins. Do not add reasons the other person can argue with.`,
    ),
    F("Write three boundaries", "Start with the ones that matter most. Keep each one short.", [
      "Boundary 1: what I need or will no longer accept",
      "Boundary 1: what I will do if it is crossed",
      "Boundary 2: what I need or will no longer accept",
      "Boundary 2: what I will do if it is crossed",
      "Boundary 3: what I need or will no longer accept",
      "Boundary 3: what I will do if it is crossed",
    ]),
    C("Which one will you practise first?", "Start where it feels possible, not where it is hardest.", [
      "With a partner or someone I am seeing",
      "With an ex who still contacts me",
      "With a friend or family member",
      "At work or with a client",
    ]),
    F("Rehearse it", "Plan for the guilt before it arrives.", [
      "The words, short and calm",
      "The guilty thought I expect to have",
      "My answer to that thought (for example: Guilt is not proof I did something wrong)",
    ]),
    P(
      "Say it out loud three times",
      "Read your boundary aloud, three times, in a calm voice. Then write what your body did: your voice, chest, shoulders and breath. This is the feeling you are training yourself to stay steady inside.",
    ),
    K("Commit", "Tick what you agree to.", [
      "I will say one boundary this week",
      "I will keep it short and not add extra reasons",
      "I will let the guilt come and pass without taking the boundary back",
      "I will tell someone safe how it went",
    ]),
  ],

  "decide-differently": [
    L(
      "From knowing to doing",
      `You now know your loop, your early signal, your reset and your boundaries. Many people stop here and still repeat the pattern, because in the moment, at the fork, you are not thinking. You are reacting.

The answer is to decide **in advance**. Athletes and pilots do this: they plan for pressure while calm, so the plan is there when pressure arrives.

This module is where you write that plan.`,
    ),
    L(
      "Green, amber and red",
      `Sort what you notice in other people into three groups:

- **Green:** signs of care and consistency. They do what they say. They are the same on Tuesday as on Saturday. They make space for your needs.
- **Amber:** slow down and watch. Mixed messages, vague plans, intensity that arrives too fast, hot and cold.
- **Red:** leave, or do not begin. Disrespect, control, pressure, lies, ignoring your no.

You decide these lists now, not in the middle of the spark, when everything looks green.`,
    ),
    F("Your three lists", "Write them in your own words. Be specific.", [
      "Green flags I want to see",
      "Amber flags: I slow down when...",
      "Red flags: I walk away when...",
    ]),
    S("How ready am I to...?", "Rate how ready you feel today. This is not a test. It shows where to start.", [
      "Slow down when I feel the spark.",
      "Notice an amber flag and say so out loud.",
      "Walk away at a red flag.",
      "Let a good, steady person feel a little boring at first.",
      "Tell a friend what is happening before I decide.",
    ]),
    L(
      "The pause that changes everything",
      `Your old loop runs on speed: spark, then commitment, then effort, within weeks. The simplest change is to slow it down.

- **Wait before exclusive.** Give yourself at least a few weeks of seeing how someone is over time, not how they are in the first rush.
- **Check in with your body after each meeting.** Calm and steady, or buzzing and anxious?
- **Compare words and actions.** What they say, and what they do three times in a row.
- **Keep your own life.** Friends, plans and routines stay in place.

A right person can handle your pace. A wrong person will push against it. Both teach you something.`,
    ),
    F("If, then plans", "Write what you will do next time. If this happens, then I will do that.", [
      "If I feel the spark very fast, then I will...",
      "If they pull away or go quiet, then I will...",
      "If I see an amber flag, then I will...",
      "If an ex contacts me, then I will...",
      "If I notice myself over-giving, then I will...",
    ]),
    C("Who will hold you to it?", "Telling someone makes a plan far more likely to happen.", [
      "A close friend",
      "A family member I trust",
      "My journal, every week",
      "A coach or therapist",
    ]),
    P(
      "A letter from the other side",
      "Write a short letter from yourself one year from now, after you have broken this pattern. What did you do differently? What does your life look like? What does she want you to know today?",
    ),
    K("Commit", "Tick what you agree to.", [
      "I have written my flags and my if-then plans",
      "I told one person my plan",
      "I will keep my reset and my boundaries close",
      "I will come back to this workbook when the pattern shows up",
    ]),
    L(
      "Where you go from here",
      `You have done real work: you named your loop, learned your signal, practised a reset, wrote boundaries and made a plan.

Change rarely arrives all at once. It looks like noticing a moment earlier, pausing a little longer and choosing one thing differently, again and again.

If you want to go deeper, the audio library and the other journeys are here for you. And if you want personal support with a pattern that keeps returning, you can book a free call with Signe from the **Work with Signe** page.`,
    ),
  ],
};

for (const [slug, steps] of Object.entries(MODULES)) {
  const m = (await (await fetch(`${BASE}/rest/v1/modules?slug=eq.${slug}&select=id`, { headers: H })).json())[0];
  if (!m) throw new Error(`module ${slug} not found`);
  const del = await fetch(`${BASE}/rest/v1/exercises?module_id=eq.${m.id}`, { method: "DELETE", headers: H });
  if (!del.ok) throw new Error(`delete ${slug}: ${await del.text()}`);
  const rows = steps.map((s, i) => ({
    module_id: m.id,
    position: i + 1,
    kind: s.kind,
    title: s.title,
    body: s.body ?? null,
    options: s.options ?? null,
  }));
  const ins = await fetch(`${BASE}/rest/v1/exercises`, { method: "POST", headers: { ...H, Prefer: "return=minimal" }, body: JSON.stringify(rows) });
  if (!ins.ok) throw new Error(`insert ${slug}: ${await ins.text()}`);
  console.log(slug.padEnd(22), rows.length, "steps,", rows.filter((r) => r.kind === "lesson").length, "lessons");
}
