import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/the-validator-seeker")({
  head: () => ({
    meta: [
      { title: "The Validator Seeker Love Pattern" },
      {
        name: "description",
        content:
          "One unanswered message shifts your entire nervous system. This is the Validator Seeker pattern.",
      },
      { property: "og:title", content: "The Validator Seeker Love Pattern" },
      {
        property: "og:description",
        content:
          "One unanswered message shifts your entire nervous system. This is the Validator Seeker pattern.",
      },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-24">
      <h1 className="font-serif text-5xl text-foreground">The Validator Seeker</h1>
      <div className="mt-8 space-y-6 text-lg text-muted-foreground leading-relaxed">
        <p className="text-xl text-foreground">One unanswered message shifts your entire nervous system.</p>
        <p>
          When attention comes you feel calm, capable, fine. When it goes quiet you feel anxious, restless, uncertain about everything. The reassurance does not last long. You need it again. And the cycle continues.
        </p>
        <p>
          The Validator Seeker pattern forms when your sense of being okay became tied to external signals. A response, a choice, a look, a text back. Not because you are needy. Because at some point the people around you made their approval feel conditional, and your nervous system learned to scan for it constantly.
        </p>
        <p>
          This is not about the person you are dating. It is about the story running underneath: that you are only as lovable as someone's last response to you.
        </p>
        <p>
          <span className="font-semibold text-foreground">What shifts it:</span> Separating your internal state from their external behaviour. Building a source of okayness that does not depend on what they do next.
        </p>
        <p>
          Take the free 60-second quiz to confirm your pattern at <Link to="/" className="text-foreground underline">mylovepattern.com</Link>
        </p>
      </div>
    </main>
  );
}
