// node --env-file=.env.local scripts/seed-selfworth-lessons.mjs
import { seedJourney, L, P, S, F, C, K } from "./lesson-helpers.mjs";

await seedJourney(
  "self-worth",
  [
    {
      slug: "selfworth-enough",
      position: 1,
      title: "Why Nothing Feels Like Enough",
      subtitle: "See how you try to earn your worth, and what it costs you.",
      intro: "Doing more does not fix feeling not enough. Here you see why.",
      steps: [
        L(
          "Achieving more does not fix it",
          `You work hard, you give a lot, and when you finally reach the goal the relief lasts a day. Then the bar moves and you feel behind again.

That is the pattern: **achieve, relief, bar moves**. It happens when worth is treated like something to earn, rather than something you have.

You will not solve it with another achievement. You solve it by changing the rule underneath.

This module helps you see your rule, so you can start to change it.`,
        ),
        S("How true is this for you?", "Rate each one honestly.", [
          "I feel I must earn my rest.",
          "I cannot enjoy a win before I think about what is next.",
          "I feel guilty when I am not being useful.",
          "I compare my behind-the-scenes with other people's highlights.",
          "I find it hard to take a compliment.",
          "I work hardest when I feel least enough.",
        ]),
        C("Which rule do you live by?", "Pick the one that feels most true, even if it is uncomfortable.", [
          "I am enough when I am useful",
          "I am enough when I am successful",
          "I am enough when I am liked",
          "I am enough when I am perfect",
          "I am enough when I am needed",
        ]),
        F("Your proving pattern", "Be honest and kind.", [
          "What I do to prove myself",
          "Who I am really proving it to",
          "What I think would happen if I stopped",
          "What I am afraid that would mean about me",
        ]),
        L(
          "Worth is not a trophy",
          `Your skills, results and habits are things you do. Your worth is something you **are**, from the start, without earning it.

Think of a baby. She has done nothing, achieved nothing, and nobody doubts her worth.

You may not believe this yet. You do not have to. You only need to be willing to test it, a little at a time, through the rest of this journey.`,
        ),
        P(
          "A day without earning",
          "Imagine a whole day where you did nothing useful and still had full worth. What would you do? What would you feel? What would be hardest?",
        ),
        K("Before you move on", "Tick what you agree to.", [
          "I know the rule I live by",
          "I can see what it costs me",
          "I will rest once this week without earning it",
        ]),
      ],
    },
    {
      slug: "selfworth-critic",
      position: 2,
      title: "Meet Your Inner Critic",
      subtitle: "Hear what it says, understand why, and learn to answer it.",
      intro: "Your inner critic is trying to help, in a harsh way. Here you get to know it.",
      steps: [
        L(
          "The critic is trying to help",
          `That harsh voice has a job. It believes that if it criticises you first, nobody else can hurt you. It believes it keeps you humble, safe or motivated.

Its method is cruel, and its intention is protection.

You do not need to silence it or fight it. You need to understand it, so you can answer it calmly and keep it from running your life.`,
        ),
        F("Describe your critic", "Notice how it speaks.", [
          "What it says most often, word for word",
          "What its voice sounds like, and whose it reminds me of",
          "When it is loudest",
          "What it is afraid will happen if it stops",
        ]),
        L(
          "Give it a name and a job",
          `Naming your critic creates distance between **you** and **the voice**. It becomes something you hear, not something you are.

You can give it a name, even a funny one. Then you can say:

> "Thank you, Gwen. I know you are trying to protect me. I have got this."

You are firm and kind at the same time. That is how you lead an anxious part of yourself.`,
        ),
        F("Name it and answer it", "Write it while you are calm.", [
          "My critic's name",
          "What I will say back, kind and firm",
          "What I would like it to do instead",
        ]),
        S("How do you talk to yourself?", "Rate each one honestly.", [
          "I speak to myself more harshly than to anyone else.",
          "I replay mistakes for hours.",
          "I dismiss my own achievements.",
          "I expect myself to be perfect.",
        ]),
        P(
          "Rewrite three harsh sentences",
          "Take three of your critic's sentences and rewrite each one as something fair and factual. Not fluffy, just accurate. For example, 'I am useless' becomes 'I made a mistake and I can learn from it'.",
        ),
        L(
          "Fair, not fluffy",
          `You do not need to replace criticism with big praise you do not believe. Aim for **fair**.

A fair thought is true, specific and kind. "That presentation was hard, and I did the parts I prepared well."

Over time, fair thoughts become the new default.`,
        ),
        K("Before you move on", "Tick what you agree to.", [
          "I named my inner critic",
          "I wrote what I will say back",
          "I will catch one harsh thought a day and make it fair",
        ]),
      ],
    },
    {
      slug: "selfworth-proof",
      position: 3,
      title: "Build Proof, Not Pep Talks",
      subtitle: "Collect real evidence of who you are, and learn to take it in.",
      intro: "Your mind believes evidence more than affirmations. Here you build a proof file.",
      steps: [
        L(
          "Your mind keeps the evidence it expects",
          `If you believe you are not enough, your brain quietly notices every sign of it and ignores the rest. That is not weakness. It is how attention works.

You can retrain it by deliberately collecting evidence of what is also true: what you have survived, what you are good at, and what you have done for others.

This is not fake positivity. It is balancing the file.`,
        ),
        F("Your proof list", "Aim for specifics, not generalities.", [
          "Five things I have survived",
          "Five things I am good at",
          "Five times I showed up for someone",
          "Three times I did something that scared me",
        ]),
        L(
          "How to take a compliment",
          `Many women deflect compliments: "Oh, it was nothing", "Anyone could have done it".

Try a different move: **"Thank you."** Pause. Let it land for one breath.

You may feel awkward. That is the old rule being tested. Keep a **compliments file**, a note on your phone where you save what people say, and read it when the critic is loud.`,
        ),
        F("Your compliments file", "Start with one you received recently.", [
          "A compliment I received and brushed off",
          "What it says about me",
          "How I will answer next time: 'Thank you...'",
        ]),
        C("Choose your daily proof habit", "Pick one you will actually do.", [
          "Three lines each night: did, am, needed",
          "A short voice note",
          "A compliments folder on my phone",
          "A weekly review every Sunday",
        ]),
        S("How easy is it for you to...", "Rate each one honestly.", [
          "Name something I did well today.",
          "Say thank you to a compliment.",
          "Remember a time I handled something hard.",
        ]),
        K("Before you move on", "Tick what you agree to.", [
          "I wrote my proof list",
          "I started my compliments file",
          "I will do my proof habit for seven days",
        ]),
      ],
    },
    {
      slug: "selfworth-receive",
      position: 4,
      title: "Receive Without Paying It Back",
      subtitle: "Let help, rest, praise and good things in, without earning them first.",
      intro: "Many women give easily and receive badly. Here you practise receiving.",
      steps: [
        L(
          "Giving feels safe. Receiving feels risky.",
          `Receiving can feel like owing something, being a burden or being seen. So you repay favours at once, say "I am fine" when you are not, or refuse help altogether.

Underneath it is a belief: **I have to earn what I am given**.

You cannot feel worthy and refuse everything at the same time. Practising receiving, in small ways, is how worth becomes real.`,
        ),
        S("How true is this for you?", "Rate each one honestly.", [
          "I feel I must repay every favour straight away.",
          "I say 'I am fine' when I am not.",
          "I find it hard to ask for help.",
          "I turn down gifts or offers.",
          "I feel selfish when I rest.",
          "I play down my needs.",
        ]),
        F("What is hardest to receive?", "Think about each area.", [
          "Where it shows up: compliments, help, money, rest, attention",
          "What I tell myself when I am offered something",
          "What I would allow myself if I felt worthy",
        ]),
        L(
          "Practise in small steps",
          `Start small and low-risk:

- **Compliments.** Say "thank you" and stop.
- **Help.** Ask for one small favour this week.
- **Gifts.** Accept without repaying straight away.
- **Rest.** Take twenty minutes without having earned it.

Notice what your body does. A tight chest, a rush to explain, an urge to repay. Stay with it, breathe and let it pass.`,
        ),
        C("Choose your receiving practice for the week", "Pick one.", [
          "Say 'thank you' to every compliment, with no deflecting",
          "Ask for one small piece of help",
          "Accept something without paying it back at once",
          "Take twenty minutes of rest, unearned",
        ]),
        P(
          "A letter of permission",
          "Write a short letter to yourself that begins 'I give myself permission to...'. Be generous. Read it twice.",
        ),
        K("Before you move on", "Tick what you agree to.", [
          "I chose my receiving practice",
          "I will notice the urge to pay things back and let it pass",
          "I will tell someone what I am practising",
        ]),
      ],
    },
    {
      slug: "selfworth-daily",
      position: 5,
      title: "Your Daily Worth Practice",
      subtitle: "A ten-minute daily routine that keeps your worth steady.",
      intro: "Worth is practised, not found. Here you build a routine you can keep.",
      steps: [
        L(
          "Worth is practised, not found",
          `Feeling worthy does not arrive once and stay. It is a daily practice, like brushing your teeth: small and regular.

A simple version takes about ten minutes:

- **Morning, 2 minutes.** Say your worth sentence and set one kind intention.
- **Midday, 1 minute.** Ask: what do I need right now?
- **Evening, 3 minutes.** Write your proof: something I did, something I am, something I needed.

Keep it small enough that you will do it on a bad day.`,
        ),
        F("Your daily routine", "Make it specific and easy.", [
          "My morning practice (2 minutes)",
          "My midday needs check (1 minute)",
          "My evening proof (3 minutes)",
          "My worth sentence, 5 to 10 words",
        ]),
        S("Where are you now?", "Compare these with the first module.", [
          "I can rest without feeling I must earn it.",
          "I notice my inner critic and answer it fairly.",
          "I can take a compliment.",
          "I can ask for and accept help.",
          "I feel worthy on ordinary days.",
        ]),
        C("Choose how you will remember", "Pick one reminder you will actually see.", [
          "A phone alarm with my worth sentence",
          "A note on my mirror",
          "A habit I attach to my morning coffee",
          "A weekly check-in with a friend",
        ]),
        P("A letter from your future self", "Write a note from yourself thirty days from now, after practising daily. What has changed? What does she want you to remember today?"),
        L(
          "Be patient with the wobbles",
          `You will have days when the old rule roars back. That is not failure. It is part of unlearning.

On those days, shrink the practice, not the effort: one line, one breath, one kind sentence. Then return tomorrow.

If you want personal support with the beliefs underneath, you can book a free call with Signe from the **Work with Signe** page.`,
        ),
        K("Before you finish", "Tick what you agree to.", [
          "I set my daily routine and my worth sentence",
          "I chose a reminder",
          "I will practise for 30 days and start again if I miss a day",
        ]),
      ],
    },
  ],
  { publish: true },
);
