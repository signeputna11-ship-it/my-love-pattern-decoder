import { createFileRoute, Link } from "@tanstack/react-router";
import { RelatedPatterns } from "@/components/healthy-love/RelatedPatterns";
import { SiteNav } from "@/components/healthy-love/SiteNav";
import { SiteFooter } from "@/components/healthy-love/SiteFooter";

const URL = "https://mylovepattern.com/the-over-investor";
const TITLE = "Why You Over-Give in Relationships, The Over-Investor Pattern";
const DESC = "If you over-invest in relationships and pick people who never match your effort, this is the Over-Investor love pattern. Where it comes from and what actually shifts it.";

export const Route = createFileRoute("/the-over-investor")({
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
              name: "Why do I over-give in relationships?",
              acceptedAnswer: { "@type": "Answer", text: "Because somewhere along the way you learned love is something you earn through effort. Over-investing then feels like caring, but it is a strategy your nervous system uses to create security with people who haven't earned it yet." },
            },
            {
              "@type": "Question",
              name: "What is the Over-Investor love pattern?",
              acceptedAnswer: { "@type": "Answer", text: "One of four love patterns. The Over-Investor invests early and heavily before the situation has been established, often making available partners feel boring and inconsistent partners feel magnetic." },
            },
            {
              "@type": "Question",
              name: "How do I stop over-investing in relationships?",
              acceptedAnswer: { "@type": "Answer", text: "Stop asking how do I show up for this person and start asking what is this person actually showing me. Let the situation establish itself before you invest in it. The anxiety of pulling back is the pattern noticing it is not being fed." },
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
            { "@type": "ListItem", position: 2, name: "The Over-Investor", item: URL },
          ],
        }),
      },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <><SiteNav /><main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-serif text-5xl text-foreground">Why You Over-Give in Relationships</h1>
      <p className="mt-3 text-base text-muted-foreground">The Over-Investor love pattern</p>
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
      <RelatedPatterns currentSlug="/the-over-investor" />
    </main><SiteFooter /></>
  );
}
