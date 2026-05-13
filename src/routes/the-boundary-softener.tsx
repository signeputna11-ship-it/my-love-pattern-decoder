import { createFileRoute } from "@tanstack/react-router";

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
      <p className="mt-6 text-lg text-muted-foreground">Placeholder content.</p>
    </main>
  );
}
