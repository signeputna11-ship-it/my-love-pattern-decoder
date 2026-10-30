// node --env-file=.env.local scripts/seed-money-lessons.mjs
import { seedJourney, L, P, S, F, C, K } from "./lesson-helpers.mjs";

const AUDIO_DIR = "/Users/signeputna/Documents/01_SIGNE COACH/APP_CONTENT/audio-for-app";

await seedJourney(
  "money",
  [
    {
      slug: "money-notice",
      position: 1,
      title: "Where You Really Stand With Money",
      subtitle: "Look at your numbers and your feelings, without shame.",
      intro: "Before anything changes, you look at where you are.",
      audio: { path: "money-notice/wealth-made-easy.mp3", file: `${AUDIO_DIR}/wealth-made-easy.mp3`, title: "Wealth Made Easy", minutes: 18 },
      steps: [
        L(
          "Start with the truth, not the shame",
          `Many women avoid looking. Statements stay unopened. Numbers stay vague. A knot arrives at the very thought of the banking app.

Looking is the first act of respect. Not to judge yourself, only to know. Facts and feelings, side by side.

In this module you will see where you stand today: what comes in, what goes out, and what you feel when you look. Everything you write is private.

After this first lesson there is a short guided audio. Listen when you have a quiet moment, then come back for the rest.`,
        ),
        F("Your numbers today", "Rough numbers are fine. You are not being audited.", [
          "Money coming in each month, roughly",
          "Money going out each month, roughly",
          "What I owe, if anything",
          "What I have saved, if anything",
          "What I would like to earn each month",
        ]),
        S("When I think about money, I...", "Rate each one honestly.", [
          "Avoid looking at my balance.",
          "Feel tense when I open my banking app.",
          "Spend to feel better.",
          "Underprice or give discounts.",
          "Feel guilty earning more than the people around me.",
          "Worry that money will run out, even when it has not.",
        ]),
        P(
          "What do you say to yourself?",
          "Think of the last time you looked at your bank account. What did you say to yourself, word for word? Write it exactly as it sounds in your head.",
        ),
        L(
          "Your money feeling matters as much as your number",
          `Two women can have the same income and feel completely different. The feeling decides the behaviour.

Most of us have a main money style:

- **The Avoider.** Looks away, delays, hopes it sorts itself.
- **The Spender.** Money leaves fast, often to soothe a feeling.
- **The Hoarder.** Saves, and still never feels safe.
- **The Over-giver.** Gives away time, discounts and money, and keeps little.

None of them is wrong. Each one is a way of coping. Naming yours shows you where to start.`,
        ),
        C("Which style is yours?", "Pick the closest, even if you are a mix.", [
          "The Avoider",
          "The Spender",
          "The Hoarder",
          "The Over-giver",
          "A mix of two or more",
        ]),
        K("Before you move on", "Tick what you agree to.", [
          "I looked at my numbers, even roughly",
          "I know my main money style",
          "I will look at my balance once this week, calmly, with a cup of tea",
        ]),
      ],
    },
    {
      slug: "money-understand",
      position: 2,
      title: "What You Learned About Money",
      subtitle: "Trace your money beliefs back to where they started.",
      intro: "Most money beliefs were learned early, from the people around you.",
      steps: [
        L(
          "You learned about money long before you earned any",
          `Watching the adults around you, you learned what money means: tension, silence, arguments, pride, secrets, scarcity or ease.

Beliefs that often come from this time:

- Money is hard to get.
- Rich people are selfish.
- It is not spiritual to want money.
- We do not talk about money.
- I am not good with numbers.

You absorbed them as facts. They were only the stories of the people who raised you.`,
        ),
        F("Your money origin", "Write short, honest answers.", [
          "What I heard about money growing up, in exact phrases",
          "How the adults around me felt about money",
          "What happened when money was short, or when it came easily",
          "What I decided money means",
        ]),
        C("Which belief sounds most like yours?", "Pick the closest.", [
          "Money is hard to get",
          "Money is dangerous or dirty",
          "There is never enough",
          "I do not deserve it, or I am not good with it",
          "Having more would make me selfish",
          "Money always disappears",
        ]),
        L(
          "What the belief protects you from",
          `Every money belief has a payoff, and a price.

- "Money is dirty" protects you from being judged. It costs you income.
- "There is never enough" protects you from disappointment. It costs you rest.
- "I must work hard for every cent" protects you from guilt. It costs you ease.

You cannot change a belief while you resent it. You change it by seeing what it was doing for you.`,
        ),
        F("Payoff and price", "Be honest and kind.", [
          "What this belief protects me from",
          "What it costs me in my income and my choices",
        ]),
        P(
          "A letter to the child who learned this",
          "Write a short, warm letter to the girl who first heard those messages about money. Tell her what you know now, and what you would like her to believe instead.",
        ),
        K("Before you move on", "Tick what you agree to.", [
          "I named my main money belief in one sentence",
          "I can see what it protected me from",
          "I will treat my money history with kindness",
        ]),
      ],
    },
    {
      slug: "money-reframe",
      position: 3,
      title: "Connect Your Worth to Your Price",
      subtitle: "Choose a belief that supports charging, receiving and keeping what you earn.",
      intro: "Your value is already there. Here you connect it to what you ask for.",
      steps: [
        L(
          "Price is a message about value",
          `When you underprice, you tell people your work is worth less than it is. They believe you.

Your price is not a verdict on your worth as a person. It is a statement about the **value of the result** you give.

Many women charge for their time. Clients pay for the change: the problem solved, the stress removed, the opportunity gained. Think about the result first, and the number feels different.

After this lesson there is a longer guided audio to help the new belief settle. Listen when you have time, then come back.`,
        ),
        F("Thank the old belief", "It did a job for you. Say so.", [
          "My old money belief, in one sentence",
          "What it was protecting me from",
          "My thank you: 'Thank you for...'",
        ]),
        C("Choose your new money belief", "Pick the one that feels closest, or write your own in the next step.", [
          "I am paid well for the value I give.",
          "Money flows to me through work I am proud of.",
          "I keep a share of everything I earn.",
          "I will write my own",
        ]),
        F("What is your work worth, and why?", "Think about the result, not the hours.", [
          "The result I help people get",
          "What that result is worth to her: time saved, money earned, peace of mind",
          "What I currently charge",
          "What a confident version of me would charge",
        ]),
        S("How does that number feel?", "Say it aloud before you rate it.", [
          "Saying my price out loud feels comfortable.",
          "I could say it without apologising.",
          "I believe someone will say yes.",
        ]),
        L(
          "How to say your price",
          `A simple script that works:

- **Say the number.** "The investment is 400 euros."
- **Stop talking.** Give a pause of three full seconds. It will feel long.
- **Do not discount before she asks.** And if she does ask, hold your price, or offer a smaller version of the work.

Avoid "just", "only", "sorry" and "I know it is a lot". Practise it aloud until it sounds like a normal sentence.`,
        ),
        P(
          "Say it out loud three times",
          "Say your price three times, calmly. Then write what your body did: voice, breath, shoulders, stomach.",
        ),
        K("Before you move on", "Tick what you agree to.", [
          "I chose my new money belief",
          "I wrote down what my work is worth",
          "I will say my price out loud, without apologising, at least once this week",
        ]),
      ],
    },
    {
      slug: "money-release",
      position: 4,
      title: "Money Blocks: Guilt, Fear and Over-Giving",
      subtitle: "Name the blocks that slow your income, and choose what to keep.",
      intro: "Guilt, fear of being seen and over-giving can sit between you and your income.",
      steps: [
        L(
          "The four blocks",
          `Most women who earn less than they want have one or more of these:

- **Guilt.** Earning more than the people you love.
- **Fear of being seen.** Visibility feels like inviting criticism.
- **Over-giving.** Discounts, free work and favours to avoid being disliked.
- **Fear of losing it.** Money feels like it could vanish, so you never settle.

Each looks like a behaviour, and each is a part of you trying to keep you safe. You will name yours and talk back, kindly.`,
        ),
        S("Which blocks are present?", "Rate each one honestly.", [
          "I feel guilty when I earn more than people I love.",
          "I give discounts or free work so people do not dislike me.",
          "I worry that if I charge more, people will leave.",
          "I spend money quickly so I do not have to hold it.",
          "I feel safer being busy than being well paid.",
          "I undercharge friends and family.",
        ]),
        F("Pick one block", "Choose the one that costs you the most.", [
          "The block I will work on",
          "What it says to me, in exact words",
          "What I would say back to it",
          "What I am willing to do differently this month",
        ]),
        L(
          "Talk back, kindly",
          `A block is not an enemy. It is a part of you with a job.

You can answer it with firm kindness:

> "I hear you. You are trying to keep me safe. I am safe. I am choosing differently."

Say this when the old feeling arrives. The block does not disappear overnight. It softens when it learns that you are still alright.`,
        ),
        P(
          "A letter to your money",
          "Write from you to your money. What do you want your relationship with it to be? What are you sorry for? What are you grateful for? What will you do differently?",
        ),
        L(
          "Tiny experiments",
          `Choose one small action this month:

- Raise your price for the next new client.
- Stop one free favour that drains you.
- Set aside a small amount from the next payment you receive.
- When someone pays you, simply say "thank you".

Small and real beats big and imaginary.`,
        ),
        K("Before you move on", "Tick what you agree to.", [
          "I named my main block",
          "I will answer it with kindness when it appears",
          "I chose one tiny experiment for this month",
        ]),
      ],
    },
    {
      slug: "money-sustain",
      position: 5,
      title: "Keep What You Earn",
      subtitle: "Build a calm money rhythm that fits your real life.",
      intro: "Earning is half the work. Keeping and using it well is the other half.",
      steps: [
        L(
          "A system you can actually follow",
          `You do not need a perfect budget. You need a simple rhythm you will really follow, even in a busy week.

A friendly structure is **three pots**:

- **Needs.** Rent, bills, food, transport.
- **Future.** Savings, taxes and a buffer for quiet months.
- **Joy.** Spending you do not need to justify.

A common starting point is to decide a percentage for each pot, then move the money across as soon as you are paid. The exact numbers depend on your situation. This is education, not personal financial advice. For your own plan, speak with a qualified adviser.`,
        ),
        F("Your three pots", "Rough percentages are fine. You can adjust them later.", [
          "What goes into Needs, roughly",
          "What goes into Future (savings, taxes, buffer)",
          "What goes into Joy",
          "The share I will set aside from every payment I receive",
        ]),
        C("Choose your rhythm", "Pick the one you will really do.", [
          "A 15-minute weekly money check",
          "A monthly review with a coach or accountant",
          "Automatic transfers on payday",
          "A money date with a friend each month",
        ]),
        F("A calm money week", "Plan it while you feel calm.", [
          "The day and time of my weekly check",
          "What I will look at",
          "What I will do if I feel anxious",
        ]),
        S("Where are you now?", "Compare these with the first module.", [
          "I look at my balance without dread.",
          "I can say my price without apologising.",
          "I keep a share of what I earn.",
          "I know what I need each month.",
          "I feel safe enough to rest.",
        ]),
        P(
          "Your money one year from now",
          "Write a short story about your relationship with money a year from now. What is different? How do you feel when you open your account? What did you do to get there?",
        ),
        L(
          "Rest is part of growth",
          `Sustainable money is not about hustling harder. It is about steady habits, enough rest and work you are proud of.

If you want to go further with your income, the Business journey helps you shape an offer and share it. And if you want personal support with the beliefs behind your money, you can book a free call with Signe from the **Work with Signe** page.`,
        ),
        K("Before you finish", "Tick what you agree to.", [
          "I chose my three pots",
          "I set a time for my weekly money check",
          "I will keep a share of everything I earn",
        ]),
      ],
    },
  ],
  { publish: true },
);
