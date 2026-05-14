import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNav } from "@/components/healthy-love/SiteNav";
import { SiteFooter } from "@/components/healthy-love/SiteFooter";

export const Route = createFileRoute("/blog/the-over-investor")({
  head: () => ({
    meta: [
      {
        title:
          "The Over-Investor: why you give everything before anything is real",
      },
      {
        name: "description",
        content:
          "The Over-Investor pattern makes you give everything before anything is established. Here is where it comes from and what actually shifts it.",
      },
      {
        property: "og:title",
        content:
          "The Over-Investor: why you give everything before anything is real",
      },
      {
        property: "og:description",
        content:
          "The Over-Investor pattern makes you give everything before anything is established. Here is where it comes from and what actually shifts it.",
      },
      { property: "og:url", content: "https://mylovepattern.com/blog/the-over-investor" },
      { property: "og:type", content: "article" },
    ],
    links: [{ rel: "canonical", href: "https://mylovepattern.com/blog/the-over-investor" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "The Over-Investor: why you give everything before anything is real",
          description: "The Over-Investor pattern makes you give everything before anything is established. Here is where it comes from and what actually shifts it.",
          author: { "@type": "Person", name: "Signe Putna" },
          publisher: { "@type": "Organization", name: "My Love Pattern", url: "https://mylovepattern.com" },
          mainEntityOfPage: "https://mylovepattern.com/blog/the-over-investor",
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://mylovepattern.com/" },
            { "@type": "ListItem", position: 2, name: "Blog", item: "https://mylovepattern.com/blog" },
            { "@type": "ListItem", position: 3, name: "The Over-Investor", item: "https://mylovepattern.com/blog/the-over-investor" },
          ],
        }),
      },
    ],
  }),
  component: PostPage,
});

function PostPage() {
  return (
    <><SiteNav /><main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-serif text-4xl text-foreground">
        The Over-Investor: why you give everything before anything is real
      </h1>
      <div className="mt-8 space-y-6 text-lg text-muted-foreground leading-relaxed">
        <p className="text-xl text-foreground">You have done it before.</p>
        <p>
          You meet someone and something shifts. The attention feels good. The conversation flows. And quietly, almost without noticing, you start investing.
        </p>
        <p>
          You reply faster. You make yourself available. You think about them more than the situation warrants. You start accommodating their schedule, their pace, their mood before they have given you any real reason to.
        </p>
        <p>And the worst part? It feels like caring. It feels like you.</p>
        <p>
          But here is what is actually happening. You are not falling in love. You are activating a pattern.
        </p>
        <p>
          The Over-Investor pattern runs on a single belief, formed long before this person existed in your life: love is something you earn through effort.
        </p>
        <p>
          When that belief is running in the background, early investment does not feel like a risk. It feels like strategy. Like if you show up fully, consistently, warmly, you create security. You make yourself hard to leave.
        </p>
        <p>The problem is what it selects for.</p>
        <p>
          When you over-invest early, two things happen. The people who match your energy feel boring. Too easy, too available, not enough friction. And the people who do not match your energy? Who stay a little distant, a little unclear? They feel magnetic. Because the gap between what you are giving and what you are getting creates a pull your nervous system reads as chemistry.
        </p>
        <p>It is not chemistry. It is the pattern doing exactly what it was designed to do.</p>
        <h2 className="font-serif text-2xl text-foreground pt-4">Where it usually starts</h2>
        <p>
          Most Over-Investors learned early that love was conditional on performance. Maybe affection in your family was inconsistent, warm sometimes, withdrawn others, and you learned to work for the warm moments. Maybe you were the responsible one, the easy one, the one who did not cause problems. Maybe love was something you felt most clearly when you had done something to deserve it.
        </p>
        <p>
          You did not choose this. You adapted to it. And the adaptation worked until you brought it into adult relationships where the other person never asked for that level of effort.
        </p>
        <h2 className="font-serif text-2xl text-foreground pt-4">How it shows up in real life</h2>
        <p>
          You know more about their life, schedule, and preferences than they know about yours two weeks in. You have already had the what are we conversation in your head but not out loud. You feel anxious when they go quiet, not because something is wrong, but because your nervous system is waiting for the investment to be matched. The relationships that have hurt you most were with people who were inconsistent, not cruel, just inconsistent. Available people have felt flat to you. Not because they were wrong for you. Because they did not activate the loop.
        </p>
        <h2 className="font-serif text-2xl text-foreground pt-4">What actually shifts it</h2>
        <p>
          Not affirmations. Not deciding to have higher standards. What shifts it is learning to let the situation establish itself before you invest in it.
        </p>
        <p>
          A different question at the start of something new: not how do I show up for this person but what is this person actually showing me.
        </p>
        <p>
          The anxiety you feel when you pull back is not a sign something is wrong. It is the pattern noticing it is not being fed.
        </p>
        <p>
          You do not have to kill the part of you that loves deeply and gives generously. You just have to stop letting it run ahead of the evidence.
        </p>
        <p>
          Find your exact pattern in 60 seconds at <Link to="/" className="text-foreground underline">mylovepattern.com</Link>
        </p>
      </div>
      <nav className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6 text-sm">
        <Link to="/blog" className="text-foreground underline">← Back to all posts</Link>
        <Link to="/the-over-investor" className="text-foreground underline">Read the full pattern page: The Over-Investor →</Link>
      </nav>
    </main><SiteFooter /></>
  );
}
