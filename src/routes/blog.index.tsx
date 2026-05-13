import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "Blog — My Love Pattern" },
      {
        name: "description",
        content:
          "Weekly writing on love patterns, self-worth, and why relationships keep repeating.",
      },
      { property: "og:title", content: "Blog — My Love Pattern" },
      {
        property: "og:description",
        content:
          "Weekly writing on love patterns, self-worth, and why relationships keep repeating.",
      },
    ],
  }),
  component: BlogIndex,
});

function BlogIndex() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-24">
      <h1 className="font-serif text-5xl text-foreground">Blog</h1>
      <p className="mt-4 text-muted-foreground">
        Weekly writing on love patterns, self-worth, and why relationships keep repeating.
      </p>
      <div className="mt-12 grid gap-6">
        <Link
          to="/blog/the-over-investor"
          className="block rounded-lg border border-border p-6 transition-colors hover:bg-accent"
        >
          <h2 className="font-serif text-2xl text-foreground">
            The Over-Investor: why you give everything before anything is real
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            The Over-Investor pattern makes you give everything before anything is established.
          </p>
        </Link>
      </div>
    </main>
  );
}
