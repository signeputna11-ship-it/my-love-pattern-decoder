// node --env-file=.env.local scripts/seed-purpose-lessons.mjs
import { seedJourney, L, P, S, F, C, K } from "./lesson-helpers.mjs";

await seedJourney(
  "purpose",
  [
    {
      slug: "purpose-direction",
      position: 1,
      title: "Hear What Is Already Pulling You",
      subtitle: "Find the clues you have been leaving for yourself for years.",
      intro: "Purpose shows up as small signals. Here you learn to hear them.",
      noAudio: true,
      steps: [
        L(
          "Purpose is not one big answer",
          `Many women wait for a lightning bolt that tells them what they are here to do. It rarely comes.

Purpose is usually found by **noticing patterns**: what you are drawn to, what you cannot help doing, what makes hours disappear. Then you test small versions of it in real life.

So you do not need to think harder. You need to notice better, and try things.

In this module you will collect your clues.`,
        ),
        S("How much does this sound like you?", "Rate each one honestly.", [
          "On paper my life looks fine, and something is missing.",
          "I keep waiting to know what I am meant to do.",
          "I envy people who seem certain.",
          "I say yes to things that do not really matter to me.",
          "I feel restless on Sunday evenings.",
          "I have ideas and I do not act on them.",
        ]),
        C("What is missing most?", "Pick the one that is most true right now.", [
          "Meaning: my days feel empty",
          "Direction: I do not know where to go",
          "Courage: I know, and I am afraid to start",
          "Time and space: life is too full",
          "Permission: I do not feel allowed",
        ]),
        L(
          "Three signals to follow",
          `Look for these in your own life:

- **Energy.** What gives you energy, and what drains it? Notice how you feel after, not before.
- **Curiosity.** What do you read, watch and search for when nobody is asking you to?
- **Envy.** Who do you envy, and for what exactly? Envy points to something you want.

None of these is silly. Together they form a map.`,
        ),
        F("Your three signals", "Write what comes first. Do not edit.", [
          "What gives me energy",
          "What I am endlessly curious about",
          "What I envy in other people, exactly",
        ]),
        F("Clues from childhood", "The younger you knew things.", [
          "What I loved doing as a child",
          "What I could do for hours without being asked",
          "What people asked me for help with, even then",
        ]),
        P(
          "When do you lose track of time?",
          "Describe a recent moment when hours disappeared. What were you doing, who were you with, and what made it absorbing?",
        ),
        K("Before you move on", "Tick what you agree to.", [
          "I listed my three signals",
          "I will watch for energy this week and note what gives it",
          "I will not judge any clue as too small or too silly",
        ]),
      ],
    },
    {
      slug: "purpose-strengths",
      position: 2,
      title: "Name Your Strengths",
      subtitle: "See what you do easily that others find hard, and how to use it.",
      intro: "What is easy for you is often the most valuable thing about you.",
      steps: [
        L(
          "What is easy for you is valuable",
          `The things you do easily are the hardest for you to value. If it comes naturally, you assume it comes naturally to everyone. It does not.

Your strengths may be listening, organising, explaining, spotting what is missing, calming a room or making something beautiful.

Your past work and life experience, even jobs that seemed unrelated, built skills that are useful together in a way nobody else's mix is.

This module helps you see them clearly.`,
        ),
        F("Your strength inventory", "Write freely. You can edit later.", [
          "Things people thank me for",
          "What I do easily that others find hard",
          "Skills I have built over time, in work and in life",
          "A kind of problem I am good at solving",
        ]),
        L(
          "Ask five people",
          `You are a poor judge of your own strengths. Other people see them clearly.

Send this to five people who know you well:

> "I am doing a short exercise on my strengths. What do you think I am best at? And when do I seem most like myself?"

Keep it short and ask for specifics. Their answers will often surprise you.`,
        ),
        P(
          "What did they say?",
          "Come back here after you have heard from a few people. Write the patterns you notice, and anything that surprised you.",
        ),
        S("How much do you use your strengths?", "Rate each one honestly.", [
          "My work uses what I am best at.",
          "I am recognised for what I do best.",
          "I use my strengths outside work too.",
        ]),
        C("Which strength do you want to use more?", "Pick one.", [
          "Listening and understanding people",
          "Organising and making things happen",
          "Teaching and explaining",
          "Creating and designing",
          "Leading and guiding",
          "Connecting people",
          "Solving problems",
        ]),
        K("Before you move on", "Tick what you agree to.", [
          "I wrote my strength inventory",
          "I will ask at least three people what I am best at",
          "I will use my chosen strength once this week, on purpose",
        ]),
      ],
    },
    {
      slug: "purpose-values",
      position: 3,
      title: "What You Will Not Trade",
      subtitle: "Name your values and your non-negotiables, so decisions get easier.",
      intro: "Your values are your compass. When they are clear, decisions get lighter.",
      steps: [
        L(
          "Values are your compass",
          `Many choices feel hard because you are trying to meet several values at once without knowing which matters most.

Values are not what you think you should care about. They are what you actually care about, shown in how you spend your time and what upsets you when it is missing.

When your values are clear, you can say no more easily, you choose with less doubt, and you stop living by someone else's script.`,
        ),
        C("Which value matters most to you?", "Pick the one you would defend even when it costs you.", [
          "Freedom",
          "Security",
          "Creativity",
          "Connection",
          "Growth",
          "Contribution",
          "Adventure",
          "Calm",
        ]),
        F("Your top three values", "In your own words, not from a list.", [
          "My top three values",
          "A time I lived by them and felt proud",
          "A time I went against them and how it felt",
        ]),
        L(
          "Your non-negotiables",
          `A non-negotiable is something you will not trade, however tempting the offer.

It might be time with your children, your health, your honesty, your freedom, your sleep or your peace of mind.

Writing these down in advance protects you from slowly trading them away one small yes at a time.`,
        ),
        F("My non-negotiables", "Be specific.", [
          "I will not trade ____ for money",
          "I will not trade ____ for approval",
          "I need ____ in every week of my life",
        ]),
        S("Does my life match my values?", "Rate each one honestly.", [
          "How I spend my days matches what I care about.",
          "My work fits my values.",
          "I protect my non-negotiables.",
        ]),
        P(
          "Where is the gap?",
          "Where does your life not match your values? What is one small change you could make this month to close the gap?",
        ),
        K("Before you move on", "Tick what you agree to.", [
          "I know my top three values",
          "I wrote my non-negotiables",
          "I will make one small change to close a gap",
        ]),
      ],
    },
    {
      slug: "purpose-vision",
      position: 4,
      title: "Picture the Life You Want",
      subtitle: "Describe an ordinary day three years from now, in detail.",
      intro: "A clear picture helps you take the next step. This module builds yours.",
      audio: { path: "purpose-direction/6-figure-life-purpose.mp3", title: "6 Figure Life Purpose", minutes: 41 },
      steps: [
        L(
          "A vision is a decision, not a prediction",
          `You are not trying to predict the future. You are choosing a direction.

Your brain responds to specific images far more than to vague wishes. "I want to be happier" gives it nothing to aim at. "I wake up in a bright room, work on projects I am proud of and finish by four" gives it a target.

After this lesson there is a longer guided audio to help your picture become vivid. Listen with headphones in a quiet place, then come back.`,
        ),
        F("An ordinary Tuesday, three years from now", "Write in the present tense, as if it is happening.", [
          "Where I wake up and what I see",
          "What my work looks like",
          "Who is around me",
          "How I feel at the end of the day",
          "What I earn, and how that feels",
        ]),
        P(
          "What is in the way?",
          "Write what you think is stopping you from living that day. Be honest. It may be money, time, confidence, a person or a fear.",
        ),
        L(
          "Fears are information",
          `A fear that shows up when you picture your vision is not a stop sign. It is a clue to what matters.

Common ones:

- **Fear of failing.** You care about the result.
- **Fear of being seen.** You are about to step into something visible.
- **Fear of success.** You worry about who it will change you into, or who it will leave behind.

Naming the fear takes some of its power. You can then plan around it.`,
        ),
        F("Name the fear", "Write it plainly.", [
          "The fear that shows up when I picture it",
          "What it is trying to protect me from",
          "What I will do anyway",
        ]),
        S("How possible does it feel?", "Rate each one honestly.", [
          "This vision feels possible for me.",
          "I can see the first step.",
          "I am willing to be uncomfortable for it.",
        ]),
        K("Before you move on", "Tick what you agree to.", [
          "I wrote my ordinary Tuesday",
          "I named my fear",
          "I will read my Tuesday aloud once a week",
        ]),
      ],
    },
    {
      slug: "purpose-plan",
      position: 5,
      title: "Your 90-Day Plan",
      subtitle: "Turn direction into small experiments you can start this week.",
      intro: "Direction becomes real through small, regular steps. Here you plan yours.",
      steps: [
        L(
          "Experiments, not leaps",
          `You do not need to quit anything or know everything. You need to **test** your direction in small, safe ways.

An experiment has three parts:

- **An action.** Small and specific.
- **A signal.** How you will know it is working: you feel energised, someone responds, you want to do more.
- **A review.** A date to look at what you learned and decide the next step.

Over 90 days, three experiments will teach you more than a year of thinking.`,
        ),
        C("Choose your first move", "Pick one to start this week.", [
          "Talk to someone already doing what I want to do",
          "Take on one small project, paid or unpaid",
          "Learn one skill for 30 days",
          "Share my idea with five people",
          "Block two hours a week for it",
        ]),
        F("Three experiments", "Be specific about each action and signal.", [
          "Experiment 1: what I will try",
          "Experiment 1: how I will know it is working",
          "Experiment 2: what I will try",
          "Experiment 2: how I will know it is working",
          "Experiment 3: what I will try",
          "Experiment 3: how I will know it is working",
        ]),
        F("Your support and space", "A plan needs room and a witness.", [
          "Who will hold me accountable",
          "When I will work on this each week, day and time",
          "What I will stop doing to make room",
        ]),
        L(
          "When you stall",
          `You will stall. Everyone does. The usual reasons are that the step was too big, there was no set time, or the old fear arrived.

When it happens:

- **Make it smaller.** Ten minutes counts.
- **Fix a time.** Same day, same hour, every week.
- **Tell someone.** A message is enough.
- **Celebrate what you did.** Not what you did not do.

Progress is rarely a straight line. It is a pattern of returning.`,
        ),
        P(
          "Your first seven days",
          "Write exactly what you will do in the next seven days. Be as specific as a shopping list: what, when and where.",
        ),
        K("Before you finish", "Tick what you agree to.", [
          "I chose my first move and my three experiments",
          "I set a weekly time and told someone",
          "I will review my plan in 30 days",
        ]),
        L(
          "Where you go from here",
          `You have named your signals, your strengths, your values and your vision, and you have a plan you can start this week.

Keep this workbook close and come back to it when you feel stuck. And if you want a guide for the next stage, you can book a free call with Signe from the **Work with Signe** page.`,
        ),
      ],
    },
  ],
  { publish: true },
);
