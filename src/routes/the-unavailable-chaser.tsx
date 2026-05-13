import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/the-unavailable-chaser")({
  head: () => ({
    meta: [
      { title: "The Unavailable Chaser Love Pattern" },
      {
        name: "description",
        content:
          "Distance feels like desire. Availability feels flat. This is the Unavailable Chaser pattern and here is why it forms.",
      },
      { property: "og:title", content: "The Unavailable Chaser Love Pattern" },
      {
        property: "og:description",
        content:
          "Distance feels like desire. Availability feels flat. This is the Unavailable Chaser pattern and here is why it forms.",
      },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-24">
      <h1 className="font-serif text-5xl text-foreground">The Unavailable Chaser</h1>
      <div className="mt-8 space-y-6 text-lg text-muted-foreground leading-relaxed">
        <p className="text-xl text-foreground">Distance feels like desire to you. Availability feels flat.</p>
        <p>
          The relationships that have affected you most deeply were with people who never fully chose you. They were interested but not committed. Present but not reliable. Close enough to feel real, distant enough to keep you reaching.
        </p>
        <p>
          The Unavailable Chaser pattern forms when early love was inconsistent. Not cruel, not absent. Inconsistent. You learned that connection requires vigilance. That you have to read the room, earn the moment, work to bring the warm version back. That vigilance became a reflex.
        </p>
        <p>
          Your nervous system does not evaluate people objectively. It pattern-matches. When someone is clear and consistent, something feels off. When someone is ambiguous, warm one day and quiet the next, something lights up. Your system recognises the pattern. The chase begins. And you call it chemistry because you have no other word for what it actually is.
        </p>
        <p>
          <span className="font-semibold text-foreground">What shifts it:</span> Learning to name the spike in real time. This is the pattern activating. This is not information about them. This is information about me.
        </p>
        <p>
          Take the free 60-second quiz to confirm your pattern at <Link to="/" className="text-foreground underline">mylovepattern.com</Link>
        </p>
      </div>
    </main>
  );
}
