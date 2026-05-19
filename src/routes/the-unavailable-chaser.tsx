import { createFileRoute, Link } from "@tanstack/react-router";
import { PatternPageShell } from "@/components/healthy-love/PatternPageShell";

const URL = "https://mylovepattern.com/the-unavailable-chaser";
const TITLE = "Why You Keep Attracting Emotionally Unavailable Men, The Unavailable Chaser Pattern";
const DESC = "If you keep attracting emotionally unavailable men, distance probably feels like desire. This is the Unavailable Chaser pattern, where it comes from and what shifts it.";

export const Route = createFileRoute("/the-unavailable-chaser")({
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
              name: "Why do I keep attracting emotionally unavailable men?",
              acceptedAnswer: { "@type": "Answer", text: "Because your nervous system pattern-matches inconsistency as chemistry. Inconsistent love early in life teaches you that connection requires vigilance, earning back the warm version. Consistent, available people then feel flat, while ambiguous people feel magnetic. This is the Unavailable Chaser pattern, not chemistry." },
            },
            {
              "@type": "Question",
              name: "What is the Unavailable Chaser love pattern?",
              acceptedAnswer: { "@type": "Answer", text: "It is one of four love patterns. People with this pattern feel most alive when someone is unclear, distant, or hot-and-cold, and feel bored or anxious around partners who are clear and consistent." },
            },
            {
              "@type": "Question",
              name: "How do I stop chasing emotionally unavailable people?",
              acceptedAnswer: { "@type": "Answer", text: "Learn to name the spike in real time. When you feel the magnetic pull toward someone ambiguous, recognise it as the pattern activating, information about you, not about them. Over time you can stop confusing nervous-system arousal with love." },
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
            { "@type": "ListItem", position: 2, name: "The Unavailable Chaser", item: URL },
          ],
        }),
      },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <><PageBackground image="crystal-ball" /><SiteNav /><main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-serif text-5xl text-foreground">Why You Keep Attracting Emotionally Unavailable Men</h1>
      <p className="mt-3 text-base text-muted-foreground">The Unavailable Chaser love pattern</p>
      <div className="mt-8 space-y-6 text-lg text-muted-foreground leading-relaxed">
        <p className="text-xl text-foreground">Distance feels like desire to you. Availability feels flat.</p>
        <p>
          If you keep attracting emotionally unavailable men, the relationships that have affected you most deeply were with people who never fully chose you. They were interested but not committed. Present but not reliable. Close enough to feel real, distant enough to keep you reaching.
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
      <RelatedPatterns currentSlug="/the-unavailable-chaser" />
    </main><SiteFooter /></>
  );
}
