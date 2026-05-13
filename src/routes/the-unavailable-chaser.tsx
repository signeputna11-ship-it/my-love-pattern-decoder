import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/the-unavailable-chaser")({
  head: () => ({
    meta: [
      { title: "The Unavailable Chaser Love Pattern" },
      {
        name: "description",
        content:
          "Distance feels like desire. Availability feels flat. This is the Unavailable Chaser pattern and here is why it forms.",
      },
      { property: "og:title", content: "The Unavailable Chaser Love Pattern" },
      {
        property: "og:description",
        content:
          "Distance feels like desire. Availability feels flat. This is the Unavailable Chaser pattern and here is why it forms.",
      },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-24">
      <h1 className="font-serif text-5xl text-foreground">The Unavailable Chaser</h1>
      <p className="mt-6 text-lg text-muted-foreground">Placeholder content.</p>
    </main>
  );
}
