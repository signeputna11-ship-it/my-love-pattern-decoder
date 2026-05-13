import { createFileRoute } from "@tanstack/react-router";

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
      <p className="mt-6 text-lg text-muted-foreground">Placeholder content.</p>
    </main>
  );
}
