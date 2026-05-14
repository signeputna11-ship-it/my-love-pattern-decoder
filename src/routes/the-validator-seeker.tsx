import { createFileRoute, Link } from "@tanstack/react-router";
import { RelatedPatterns } from "@/components/healthy-love/RelatedPatterns";

const URL = "https://mylovepattern.com/the-validator-seeker";
const TITLE = "Why One Unanswered Text Wrecks You, The Validator Seeker Pattern";
const DESC = "When attention comes you feel calm. When it goes quiet you feel anxious about everything. This is the Validator Seeker love pattern and what shifts it.";

export const Route = createFileRoute("/the-validator-seeker")({
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
              name: "Why does one unanswered text affect me so much?",
              acceptedAnswer: { "@type": "Answer", text: "Because your sense of being okay became tied to external signals, a response, a choice, a look, a text back. Your nervous system learned to scan for approval constantly, so the absence of a reply feels like the absence of safety." },
            },
            {
              "@type": "Question",
              name: "What is the Validator Seeker love pattern?",
              acceptedAnswer: { "@type": "Answer", text: "One of four love patterns. The Validator Seeker feels calm when receiving attention and anxious when it stops, regardless of what is actually happening in the relationship." },
            },
            {
              "@type": "Question",
              name: "How do I stop needing constant reassurance in relationships?",
              acceptedAnswer: { "@type": "Answer", text: "Separate your internal state from their external behaviour. Build a source of okayness that does not depend on what they do next. The reassurance loop ends when their response stops being the only signal you trust." },
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
            { "@type": "ListItem", position: 2, name: "The Validator Seeker", item: URL },
          ],
        }),
      },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-24">
      <h1 className="font-serif text-5xl text-foreground">Why One Unanswered Text Wrecks You</h1>
      <p className="mt-3 text-base text-muted-foreground">The Validator Seeker love pattern</p>
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
      <RelatedPatterns currentSlug="/the-validator-seeker" />
    </main>
  );
}
