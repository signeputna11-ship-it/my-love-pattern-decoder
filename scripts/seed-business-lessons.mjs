// node --env-file=.env.local scripts/seed-business-lessons.mjs
import { seedJourney, L, P, S, F, C, K } from "./lesson-helpers.mjs";

await seedJourney(
  "business",
  [
    {
      slug: "business-clarity",
      position: 1,
      title: "Who You Help and What Changes for Her",
      subtitle: "Get clear on one woman, her problem and your promise.",
      intro: "A clear business starts with one woman and one problem.",
      steps: [
        L(
          "A clear business starts with one woman",
          `When you try to serve everyone, nobody feels you are speaking to her.

Picture one woman. Not a statistic, a person. What is her life like? What keeps her awake at night? What would she pay to solve it?

Clear beats clever. When she reads your words and thinks "that is exactly me", you do not need to convince her of much more.

This module gives you a sentence you can use everywhere: who you help, what result she gets, and what changes in her life.`,
        ),
        F("Describe her", "Be specific. Think of a real client or someone you know.", [
          "Who she is: work, life stage, situation",
          "What keeps her awake at night",
          "What she has already tried",
          "What she says out loud when she describes the problem, in her own words",
        ]),
        L(
          "Her words, not yours",
          `People buy when they feel understood. That means using **their** words, not your professional ones.

You might say "limiting beliefs". She says "I keep undercharging and then resenting my clients".

Listen for the exact phrases women use in messages, calls and comments. Write them down. They are the best copy you will ever have.`,
        ),
        P(
          "Write her problem as she would say it",
          "Write three to five sentences in her voice, using the words she uses. Start with 'I...'",
        ),
        S("How clear are you?", "Rate each one honestly.", [
          "I can describe my ideal client in one sentence.",
          "I know the main problem I solve.",
          "I know what she has already tried.",
          "I can say what changes after she works with me.",
        ]),
        F("Your promise", "Fill it in, then read it aloud.", [
          "I help (who)",
          "to (get what result)",
          "so that (what changes in her life)",
        ]),
        C("Where are you right now?", "Pick the closest.", [
          "I know my skills but not my niche",
          "I have a niche but my offer is unclear",
          "I have an offer but few clients",
          "I have clients but I undercharge",
        ]),
        K("Before you move on", "Tick what you agree to.", [
          "I described my ideal client",
          "I wrote my promise sentence",
          "I will collect five real phrases from women I want to help",
        ]),
      ],
    },
    {
      slug: "business-offer",
      position: 2,
      title: "Build an Offer People Say Yes To",
      subtitle: "Shape a clear offer: result, what is included, time and price.",
      intro: "A clear offer makes selling much easier.",
      steps: [
        L(
          "An offer is a clear exchange",
          `An offer answers six questions, in plain words:

- **Who** is it for?
- **What result** will she get?
- **What is included?** Sessions, materials, support.
- **How long** does it take?
- **What does it cost?**
- **What is the first step** to say yes?

If a woman cannot explain your offer to a friend in two sentences, it is not clear yet. Clarity feels like a relief to her.`,
        ),
        F("Draft your offer", "Write it in plain words, as you would say it.", [
          "Who it is for",
          "The result she gets",
          "What is included",
          "How long it takes",
          "The price",
          "The first step to say yes",
        ]),
        L(
          "Pricing with confidence",
          `Three questions help you land on a price that is fair and sustainable:

- **What does the problem cost her?** In money, time, energy and stress.
- **What is the result worth to her?** Not your hours. Her outcome.
- **What do I need to earn from this?** So the work can last.

Choose a clear, round number. Avoid pricing that apologises. If the number makes you slightly uncomfortable, you are often in the right place.`,
        ),
        F("Price check", "Do the maths calmly.", [
          "What the problem costs her each month",
          "What the result is worth to her",
          "The income I need from this offer each month",
          "The price that feels clear and a little stretching",
        ]),
        S("How does your price feel?", "Say it aloud before rating.", [
          "I can say my price calmly.",
          "I believe the result is worth it.",
          "I would be glad to work for this price.",
        ]),
        F("Who it is not for", "A clear no protects your energy and builds trust.", [
          "Who this offer is not right for",
          "What I will say to her kindly",
        ]),
        C("What will your first entry point be?", "A way for her to start without a big leap.", [
          "A free call",
          "A low-cost starter: workbook or audio",
          "A paid single session",
          "A signature package",
        ]),
        K("Before you move on", "Tick what you agree to.", [
          "I wrote my offer in plain words",
          "I chose a price I can say calmly",
          "I decided my entry point",
        ]),
      ],
    },
    {
      slug: "business-sales",
      position: 3,
      title: "Sell Without Cringing",
      subtitle: "Quiet confidence: a clear price, a calm conversation, no pressure.",
      intro: "Selling is helping someone decide. You can do it calmly and be yourself.",
      steps: [
        L(
          "Selling is helping someone decide",
          `Many women dislike selling because they picture pressure, tricks and pushing. You do not need any of that.

Selling is **helping a person make a clear decision** about something that could change her life.

In luxury service, nobody chases or pressures. People are calm, attentive and clear. That is the style here: quiet confidence, a clear price and no pressure.

She can say yes, no or not yet. All three are fine. Your job is to make the decision easy, not to win.`,
        ),
        S("How do you feel about selling?", "Rate each one honestly.", [
          "I avoid talking about price.",
          "I over-explain when I make an offer.",
          "I feel pushy when I follow up.",
          "I give discounts before I am asked.",
          "I feel sick when someone says 'I need to think'.",
        ]),
        L(
          "The five-part conversation",
          `A sales conversation does not need to be clever. Five calm steps:

- **1. Listen.** Ask about her situation and let her talk. Use her words.
- **2. Reflect.** "What I hear is..." Check you have understood.
- **3. Show.** How you would help and what could change.
- **4. Name the price.** Say it plainly. Then stop talking and let it land.
- **5. Invite a decision.** "Does that feel right for you?" Yes, no or not yet. Follow up once, kindly.

If you do these in order, the conversation almost runs itself.`,
        ),
        F("Write your conversation", "Make notes you can rehearse. Use your own words.", [
          "1. Two questions I will ask her",
          "2. How I will reflect back what I heard",
          "3. How I will describe what changes for her",
          "4. How I will say my price",
          "5. How I will invite a decision",
        ]),
        L(
          "Objections are questions",
          `When someone hesitates, she usually has a real question under it. Listen, acknowledge, then ask.

- **"It is too expensive."** "I understand. Can I ask what feels like the main concern: the amount or the timing?"
- **"I need to think about it."** "Of course. What would help you feel clear? I can answer anything now."
- **"I am not sure it will work."** "That is a fair question. What would you need to see to feel confident?"
- **"I need to ask my partner."** "Of course. Would it help to send a short summary so it is easy to explain?"

Never argue. Never chase. One kind follow-up is enough.`,
        ),
        F("Your objection answers", "Write the answers you will use.", [
          "When she says it is too expensive, I say",
          "When she says she needs to think, I say",
          "When she says she is not sure it will work, I say",
        ]),
        P(
          "Rehearse out loud",
          "Say your five-part conversation aloud to a mirror or a friend. Then write what felt natural and what you want to change.",
        ),
        K("Before you move on", "Tick what you agree to.", [
          "I wrote my five-part conversation",
          "I will rehearse it aloud twice this week",
          "I will invite one real person to make a decision this week",
        ]),
      ],
    },
    {
      slug: "business-visibility",
      position: 4,
      title: "Be Seen by the Right Women",
      subtitle: "Share your work consistently, in one place, in your own voice.",
      intro: "Being seen is a skill you build in small steps.",
      steps: [
        L(
          "Visibility is a skill, built small",
          `You do not need to be everywhere. You need to be **consistent in one place**, with one clear message, speaking to one woman.

Visibility feels exposing because it is. That feeling is normal and it fades with practice.

The aim is not to go viral. It is to be found by the few women who need what you do, and to help them trust you.`,
        ),
        F("Where she spends time", "Think about the woman you described.", [
          "Where she looks for help: platforms, groups, people",
          "What she searches for or asks",
          "Who already has her trust and could refer her",
        ]),
        L(
          "Three kinds of content",
          `A simple rhythm keeps you consistent:

- **Teach.** One useful idea she can use today.
- **Tell.** A story: yours, or a client's, with permission.
- **Invite.** A clear, calm invitation to take the next step.

Aim for teach and tell most of the time, and invite regularly. No gimmicks.`,
        ),
        F("A story you can share", "Choose a moment that shows the change you create.", [
          "Where she started",
          "The turning point",
          "What changed",
          "What I want the reader to feel or do",
        ]),
        C("Choose one home channel", "Pick one and commit for 30 days.", [
          "Instagram",
          "LinkedIn",
          "An email list",
          "Talks and groups",
          "Referrals and partnerships",
        ]),
        F("Your next seven days", "Small and doable.", [
          "Three pieces of content I will share",
          "Three conversations I will start",
          "One invitation I will make",
        ]),
        S("How do you feel being visible?", "Rate each one honestly.", [
          "I worry about being judged when I post.",
          "I compare myself to others online.",
          "I avoid mentioning my offer.",
        ]),
        L(
          "When it wobbles",
          `You may meet silence, criticism or comparison. Silence usually means people are busy. Criticism often says more about the critic. Comparison is a poor measure, because you see their highlights and your own behind-the-scenes.

Come back to your one woman and one message. Share anyway, and keep going.`,
        ),
        K("Before you move on", "Tick what you agree to.", [
          "I chose one home channel",
          "I planned my next seven days",
          "I will share one story this week",
        ]),
      ],
    },
    {
      slug: "business-rhythm",
      position: 5,
      title: "Your 30-Day Rhythm",
      subtitle: "A steady weekly routine for selling, creating and resting.",
      intro: "Consistency beats intensity. Here you build a rhythm you can keep.",
      steps: [
        L(
          "Consistency beats intensity",
          `Most women burn out in a burst of effort, then stop. A steady rhythm works better: a few simple actions, done every week.

For the next 30 days you will set up a weekly routine with four kinds of day: **selling**, **creating**, **admin and money**, and **rest**.

Rest is part of the plan, not a reward for finishing.`,
        ),
        F("Your weekly rhythm", "Put days and times against each one.", [
          "Selling day: when I make offers and have conversations",
          "Creating day: when I make content and deliver work",
          "Admin and money day: when I do invoices and review numbers",
          "Rest day: what I will not work on",
        ]),
        F("Your 30-day targets", "Choose numbers you can influence.", [
          "Conversations I will have",
          "Offers I will make",
          "Clients I would love to work with",
          "Income I am aiming for, as a range",
        ]),
        L(
          "What to measure",
          `Track the actions you control, not just the result.

- **Conversations** you started.
- **Offers** you made.
- **Yeses** you received.
- **Cash** collected.

Ignore vanity numbers such as likes. Review once a month: what worked, what to do more of, what to drop.`,
        ),
        C("How will you track it?", "Pick the simplest option.", [
          "A simple weekly scorecard",
          "A notebook",
          "A spreadsheet",
          "A weekly call with an accountability partner",
        ]),
        S("Where are you now?", "Compare these with the first module.", [
          "I can describe my ideal client clearly.",
          "My offer is written in plain words.",
          "I can say my price calmly.",
          "I make offers without feeling pushy.",
          "I am visible in at least one place.",
        ]),
        P("Your first week in detail", "Write exactly what you will do in the next seven days, as specific as a shopping list."),
        L(
          "Grow at a pace that lasts",
          `A business that drains you is not a success. Keep your non-negotiables, your rest and your money rhythm.

The Money journey, especially **Keep What You Earn**, pairs well with this one. And if you want personal support with your offer or your sales conversations, you can book a free call with Signe from the **Work with Signe** page.`,
        ),
        K("Before you finish", "Tick what you agree to.", [
          "I set my weekly rhythm",
          "I wrote my 30-day targets",
          "I will review my numbers at the end of the month",
        ]),
      ],
    },
  ],
  { publish: true },
);

// The two old placeholder modules are replaced by the five above.
const BASE = process.env.SUPABASE_URL;
const H = { apikey: process.env.SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}` };
for (const slug of ["money-offer", "money-visibility"]) {
  const r = await fetch(`${BASE}/rest/v1/modules?slug=eq.${slug}`, { method: "DELETE", headers: H });
  console.log("removed old", slug, r.status);
}
