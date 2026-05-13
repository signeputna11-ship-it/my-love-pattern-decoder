import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About My Love Pattern" },
      {
        name: "description",
        content:
          "My Love Pattern was created to help women understand the relationship patterns keeping them stuck. Founded by Signe.",
      },
      { property: "og:title", content: "About My Love Pattern" },
      {
        property: "og:description",
        content:
          "My Love Pattern was created to help women understand the relationship patterns keeping them stuck. Founded by Signe.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-24">
      <h1 className="font-serif text-5xl text-foreground">About My Love Pattern</h1>
      <p className="mt-6 text-lg text-muted-foreground">
        Placeholder text. Add your story here.
      </p>
    </main>
  );
}
