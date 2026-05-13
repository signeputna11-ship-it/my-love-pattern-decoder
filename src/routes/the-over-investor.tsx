import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/the-over-investor")({
  head: () => ({
    meta: [
      { title: "The Over-Investor Love Pattern" },
      {
        name: "description",
        content:
          "You give everything before anything is established. You think love is something you earn through effort. This is the Over-Investor pattern.",
      },
      { property: "og:title", content: "The Over-Investor Love Pattern" },
      {
        property: "og:description",
        content:
          "You give everything before anything is established. You think love is something you earn through effort. This is the Over-Investor pattern.",
      },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-24">
      <h1 className="font-serif text-5xl text-foreground">The Over-Investor</h1>
      <div className="mt-8 space-y-6 text-lg text-muted-foreground leading-relaxed">
        <p className="text-xl text-foreground">You give everything before anything is established.</p>
        <p>
          You reply faster. You make yourself available. You accommodate their schedule, their pace, their mood before they have given you any real reason to. And the worst part is it feels like caring. It feels like you.
        </p>
        <p>
          The Over-Investor pattern runs on a single belief formed long before this person existed in your life: love is something you earn through effort.
        </p>
        <p>
          When that belief runs in the background, early investment does not feel like a risk. It feels like strategy. The problem is what it selects for. The people who match your energy feel boring. The ones who make you work for it feel like home. That is not chemistry. That is a pattern.
        </p>
        <p>
          <span className="font-semibold text-foreground">Where it starts:</span> Most Over-Investors learned early that love was conditional on performance. Affection was inconsistent. You learned to work for the warm moments. That adaptation followed you into adult relationships where the other person never asked for that level of effort.
        </p>
        <p>
          <span className="font-semibold text-foreground">What shifts it:</span> Learning to let the situation establish itself before you invest in it. Not how do I show up for this person, but what is this person actually showing me.
        </p>
        <p>
          Take the free 60-second quiz to confirm your pattern at <Link to="/" className="text-foreground underline">mylovepattern.com</Link>
        </p>
      </div>
    </main>
  );
}
