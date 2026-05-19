import { createFileRoute, Link } from "@tanstack/react-router";
import { PatternPageShell } from "@/components/healthy-love/PatternPageShell";

const URL = "https://mylovepattern.com/the-boundary-softener";
const TITLE = "Why You Lose Your Boundaries When You Like Someone, The Boundary Softener Pattern";
const DESC = "You know your standards until you like someone. This is the Boundary Softener love pattern, where the people-pleasing comes from and what shifts it.";

export const Route = createFileRoute("/the-boundary-softener")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:url", content: URL },
      { property: "og:type", content: "article" },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "Why do I lose my boundaries when I like someone?",
              acceptedAnswer: { "@type": "Answer", text: "Because expressing needs created conflict early on, so you learned to shrink them. Saying yes when you mean no became safety. You called it flexibility. It was actually a survival strategy that has outlived its usefulness." },
            },
            {
              "@type": "Question",
              name: "What is the Boundary Softener love pattern?",
              acceptedAnswer: { "@type": "Answer", text: "One of four love patterns. The Boundary Softener accommodates, prioritises the other person's comfort, and slowly disappears inside relationships, without ever finding out whether the real version of them could have been loved." },
            },
            {
              "@type": "Question",
              name: "How do I stop people-pleasing in relationships?",
              acceptedAnswer: { "@type": "Answer", text: "Start by noticing the moment you soften. Don't change it immediately. Just notice. Then ask: what would I say if I were not afraid of the reaction? Awareness comes before any behaviour change." },
            },
          ],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://mylovepattern.com/" },
            { "@type": "ListItem", position: 2, name: "The Boundary Softener", item: URL },
          ],
        }),
      },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <><PageBackground image="left-crystal-flowers" /><SiteNav /><main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-serif text-5xl text-foreground">Why You Lose Your Boundaries When You Like Someone</h1>
      <p className="mt-3 text-base text-muted-foreground">The Boundary Softener love pattern</p>
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
      <RelatedPatterns currentSlug="/the-boundary-softener" />
    </main><SiteFooter /></>
  );
}
