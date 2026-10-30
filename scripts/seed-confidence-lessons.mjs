// node --env-file=.env.local scripts/seed-confidence-lessons.mjs
import { seedJourney, L, P, S, F, C, K } from "./lesson-helpers.mjs";

await seedJourney(
  "confidence",
  [
    {
      slug: "confidence-notice",
      position: 1,
      title: "Where You Shrink",
      subtitle: "Spot the moments you soften, stay quiet or say yes when you mean no.",
      intro: "Confidence starts with noticing. You cannot change a habit you have not seen.",
      steps: [
        L(
          "Confidence is not loud. It is steady.",
          `Many women think confidence means being bold, fearless and always sure. That is not what most of us need.

Real confidence is quieter. It is saying what you mean once, without apologising. It is making a decision without polling five people first. It is staying yourself when someone disagrees with you.

If you soften your words, over-explain or say yes when you mean no, that is not a flaw in your personality. It is a habit, built on a belief, and habits can change.

**This module is only about noticing.** You will see exactly where and how you shrink. Nothing needs fixing yet.`,
        ),
        S("How often do you...", "Rate each one honestly. Most women recognise several.", [
          "Soften what I say with 'just', 'sorry' or 'maybe'.",
          "Say yes when I mean no.",
          "Wait for someone else to agree before I decide.",
          "Stay quiet in a meeting, then replay what I should have said.",
          "Play down praise or achievements.",
          "Ask permission for things I do not need permission for.",
        ]),
        L(
          "The five ways women shrink",
          `Shrinking looks different for everyone. Most of us have one or two favourites.

- **Softening.** "Sorry to bother you, but I was just wondering..."
- **Over-explaining.** Five reasons for a simple no, in case the first four are not enough.
- **Deferring.** "Whatever you prefer." You do have a preference.
- **Disappearing.** You go quiet and let others decide.
- **Pleasing.** You say yes first and work out the cost later.

Each one started as a clever way to stay safe, liked or included. You are not going to fight them. You are going to notice them.`,
        ),
        C("Which one is yours?", "Pick the one that happens most often.", [
          "Softening",
          "Over-explaining",
          "Deferring",
          "Disappearing",
          "Pleasing",
        ]),
        F("Your last three shrinking moments", "Think of one recent moment and answer each line. Then repeat in your head for two more.", [
          "Where it happened (work, family, friends, partner)",
          "What I wanted to say or do",
          "What I actually said or did",
          "How I felt afterwards",
        ]),
        P(
          "When do you feel most like yourself?",
          "Describe a time you spoke freely or decided without doubt. Where were you, who was there, and what was different? This shows you what is possible.",
        ),
        L(
          "A small experiment for this week",
          `You do not need to change anything yet. Just catch it.

- **Notice** one shrinking move each day. A tally on your phone is enough.
- **Do not judge it.** You are collecting information, not evidence against yourself.
- **Try once** to say a sentence plainly, without "sorry" or "just". See what happens.

Most women find the world does not end. That is the first piece of evidence.`,
        ),
        K("Before you move on", "Tick what you agree to.", [
          "I know which shrinking move is mine",
          "I will notice it once a day this week without judging myself",
          "I will say one sentence plainly, without apologising",
        ]),
      ],
    },
    {
      slug: "confidence-understand",
      position: 2,
      title: "Where 'Not Enough' Began",
      subtitle: "Trace the belief back to the moment you first decided it about yourself.",
      intro: "Every belief has a beginning. Finding it takes away much of its power.",
      steps: [
        L(
          "Beliefs are decisions you made when you were young",
          `Somewhere between about three and ten years old, you drew conclusions about yourself. A teacher's comment. A parent's mood. Being the "good girl", the "loud one" or the "sensitive one".

A child's logic is simple: if something went wrong, it must be because of me. So you decided things like "I must be good to be loved", "my opinion causes trouble" or "I should not need much".

You do not remember deciding. You just live by it, like a rule written in the background of every day.

**The good news:** a decision can be reviewed. That is what this module does.`,
        ),
        L(
          "What the belief was protecting",
          `Every belief had a job. Not being punished. Keeping someone calm. Staying included.

Your softening kept the peace. Your people-pleasing kept you liked. Your quietness kept you out of trouble.

These strategies worked, for a child with few options. They stopped working for the woman you are now, who wants to be heard and to decide for herself.

Looking at the belief kindly, without blaming yourself or anyone else, is what lets it loosen.`,
        ),
        P(
          "The earliest time you felt 'not enough'",
          "Write what happened, who was there and what you felt, as if you were describing a scene. Keep it to everyday moments. If a memory feels very heavy, skip it, come back later, and consider talking it through with a qualified professional.",
        ),
        F("The decision you made", "Use the scene above, or any moment that comes to mind.", [
          "What happened (just the facts)",
          "What I decided about myself",
          "What I decided about other people or the world",
          "What this belief has cost me",
        ]),
        C("Which belief sounds most like yours?", "Pick the closest, even if it is not exact.", [
          "I am not enough",
          "I am too much",
          "My opinion does not matter",
          "I must be good to be loved",
          "I cannot get it wrong",
          "I am on my own",
        ]),
        L(
          "A kinder way to see it",
          `The child who made that decision had limited information and big feelings. She did her best.

You can talk to her now as the adult you are. Something like:

> "Thank you for trying to keep me safe. I have got it from here."

You are not erasing her. You are letting her stop carrying a job that no longer needs doing.`,
        ),
        K("Before you move on", "Tick what you agree to.", [
          "I have named the belief in one sentence",
          "I understand what it was protecting me from",
          "I will treat the younger me with kindness this week",
        ]),
      ],
    },
    {
      slug: "confidence-reframe",
      position: 3,
      title: "Rewrite the Belief",
      subtitle: "Thank the old belief, then choose a new one that fits the woman you are now.",
      intro: "You cannot argue a belief away. You replace it.",
      steps: [
        L(
          "Replace it, do not fight it",
          `If you try to delete a belief by arguing with it, it usually argues back. A better way is to **replace** it.

The steps are simple:

- **1.** Name the old belief.
- **2.** Thank it for what it did.
- **3.** Choose a new belief that you can almost believe.
- **4.** Collect evidence for it, one small act at a time.
- **5.** Repeat, because beliefs grow through repetition.

This is the heart of the journey. Take your time over it.`,
        ),
        F("Thank the old belief", "Be generous. It did its best.", [
          "The old belief, in one sentence",
          "What it was trying to protect me from",
          "My thank you: 'Thank you for...'",
        ]),
        L(
          "How to write a belief that works",
          `A good belief is:

- **Present tense.** "I trust my voice", not "I will trust my voice".
- **Personal and positive.** Say what you are, not what you are not.
- **Believable.** It should feel like a stretch you can take, not a lie.
- **Short.** Five to ten words you can say in one breath.

> "I say what I mean, and I stay kind."
> "My voice belongs in this room."
> "I decide, and I can adjust."

If "I am confident" feels false, try "I am learning to trust my voice". That is a belief you can build on.`,
        ),
        F("Choose your new belief", "Write two drafts, then your final version.", [
          "Draft 1",
          "Draft 2 (shorter, in my own words)",
          "My final belief (5 to 10 words)",
        ]),
        S("How true does it feel today?", "Be honest. A low number is a starting point, not a failure.", [
          "My new belief feels true when I am calm.",
          "I could act as if it is true for one hour this week.",
          "Part of me already believes it.",
        ]),
        P(
          "What would she do differently?",
          "Describe a day in the life of the woman who already believes it. What does she say in meetings? How does she answer a request she does not want? How does she stand, speak and rest?",
        ),
        L(
          "Say it, then do it",
          `A belief grows from two things: words and actions.

- **Say it.** Read your belief aloud each morning and evening. Out loud works better than in your head.
- **Do one small thing** that matches it, every day. A direct sentence. A decision you make alone. A no with no apology.

Each act is a vote. Enough votes and the belief changes who you are.`,
        ),
        K("Before you move on", "Tick what you agree to.", [
          "I wrote my new belief in 5 to 10 words",
          "I will say it aloud morning and evening this week",
          "I will do one small act each day that matches it",
        ]),
      ],
    },
    {
      slug: "confidence-release",
      position: 4,
      title: "Give Back What Is Not Yours",
      subtitle: "Set down the voices, rules and expectations you picked up from other people.",
      intro: "Some of what you carry belongs to other people. Here you set it down with care.",
      steps: [
        L(
          "Not every voice in your head is yours",
          `That inner critic often sounds a lot like someone else: a parent, a teacher, an ex, a boss, or the culture you grew up in.

You were never meant to carry their opinions for life. The question to ask when a harsh thought arrives is:

> "Whose voice is this?"

Once you can hear that it has an owner, it loses some of its authority. You are not fighting yourself. You are giving something back.`,
        ),
        F("Whose voice is it?", "Take the harshest thing you tell yourself.", [
          "The sentence I hear, exactly as I hear it",
          "Whose voice it really is",
          "How old I was when I first heard it",
          "What it wants from me",
        ]),
        L(
          "The letter you will never send",
          `Writing is one of the safest ways to release what you have been holding. The letter is for you alone.

A simple structure:

- **Dear...** Name the person, or the part of you.
- **What happened.** Say it plainly.
- **How it affected me.** Be as honest and as angry as you need to be.
- **What I am giving back.** The rules, the shame, the weight.
- **What I choose instead.**

When you finish, you can tear it up, delete it or keep it somewhere safe. Do not send it.`,
        ),
        P("Write the letter", "Take as long as you need. Nobody will read this."),
        F("What you are ready to set down", "Keep these short and honest.", [
          "I am setting down",
          "I am keeping",
          "I am picking up",
        ]),
        L(
          "Relief, sadness and everything in between",
          `Releasing can bring relief, sadness, tiredness or even lightness. All of them are normal.

Be gentle with yourself afterwards. Drink water, go for a walk, rest, talk to someone you trust.

If strong feelings stay with you for days, or if memories feel overwhelming, please speak with a qualified therapist or your doctor. This course is self-help and does not replace professional care.`,
        ),
        K("Before you move on", "Tick what you agree to.", [
          "I have written my letter",
          "I will look after myself today and tomorrow",
          "I will ask for support if I need more than self-help",
        ]),
      ],
    },
    {
      slug: "confidence-rehearse",
      position: 5,
      title: "Practise Being Her This Week",
      subtitle: "Seven small, real moments where you act from your new belief.",
      intro: "Beliefs grow through repetition. You plan seven tiny moments and celebrate each one.",
      steps: [
        L(
          "Confidence is built by evidence",
          `You do not become confident by waiting to feel it. You act a little differently, you survive, and your belief updates.

For the next seven days you will plan **one small moment a day** where you act from your new belief. Keep each one under five minutes.

Small is the point. Small enough to do on a tired Tuesday. Small enough that your old fear does not even notice.`,
        ),
        C("Choose your focus for the week", "Pick one theme to run through all seven days.", [
          "Say what I think once, plainly",
          "Say no without explaining",
          "Ask for what I want",
          "Make one decision without asking anyone",
          "Take up space: speak first, share my view",
        ]),
        F("Your seven moments", "One small action per day. Be specific.", [
          "Day 1",
          "Day 2",
          "Day 3",
          "Day 4",
          "Day 5",
          "Day 6",
          "Day 7",
        ]),
        L(
          "When it wobbles",
          `You will have a wobble. The old voice will say you were too much, or not enough, or that you should apologise.

That is the belief changing, not failing. When it happens:

- **Pause** and take one slow breath.
- **Say your belief** once, in your head or out loud.
- **Do the thing anyway**, or do a smaller version.
- **Write it down** in your wins list, even if it felt messy.

Celebrate each moment. Your brain learns from the feeling of progress.`,
        ),
        F("Your support", "Tell someone. It makes this far more likely to happen.", [
          "One person who will cheer me on",
          "What I will ask her to do",
          "How I will celebrate each moment",
        ]),
        S("Where are you now?", "Compare these with the first module.", [
          "I say what I mean.",
          "I can say no without long explanations.",
          "I make decisions without polling everyone.",
          "I can hear praise and say thank you.",
          "I trust my voice.",
        ]),
        P("A note to yourself in 30 days", "Write what you want her to remember about this week and about who you are becoming."),
        K("Before you finish", "Tick what you agree to.", [
          "I chose my focus and wrote my seven moments",
          "I told one person",
          "I will keep a wins list and add to it every day",
        ]),
      ],
    },
  ],
  { publish: true },
);
