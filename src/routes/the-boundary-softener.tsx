import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/the-boundary-softener")({
  head: () => ({
    meta: [
      { title: "The Boundary Softener Love Pattern" },
      {
        name: "description",
        content:
          "You know your standards until you like someone. This is the Boundary Softener pattern.",
      },
      { property: "og:title", content: "The Boundary Softener Love Pattern" },
      {
        property: "og:description",
        content:
          "You know your standards until you like someone. This is the Boundary Softener pattern.",
      },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-24">
      <h1 className="font-serif text-5xl text-foreground">The Boundary Softener</h1>
      <div className="mt-8 space-y-6 text-lg text-muted-foreground leading-relaxed">
        <p className="text-xl text-foreground">You know your standards until you like someone.</p>
        <p>
          In theory you know what you want. Consistency. Follow-through. Someone who shows up. But then you meet someone and something shifts. You start accommodating. You say yes when you mean no. You call it flexibility. You call it not being difficult. You have done it so long you have stopped noticing where your actual edge is.
        </p>
        <p>
          The Boundary Softener pattern usually forms when expressing needs created conflict early on. So you learned to shrink them. To be agreeable. To prioritise the other person's comfort over your own. You called it love. It was survival.
        </p>
        <p>
          The problem is it makes you invisible in every relationship you are in. The other person never meets the real version of you. And you never find out whether they could actually handle it.
        </p>
        <p>
          <span className="font-semibold text-foreground">What shifts it:</span> Starting to notice the moment you soften. Not changing it immediately. Just noticing. Then asking: what would I say if I were not afraid of the reaction?
        </p>
        <p>
          Take the free 60-second quiz to confirm your pattern at <Link to="/" className="text-foreground underline">mylovepattern.com</Link>
        </p>
      </div>
    </main>
  );
}
