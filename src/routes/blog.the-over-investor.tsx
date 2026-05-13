import { createFileRoute } from "@tanstack/react-router";

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
    ],
  }),
  component: PostPage,
});

function PostPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-24">
      <h1 className="font-serif text-4xl text-foreground">
        The Over-Investor: why you give everything before anything is real
      </h1>
      <p className="mt-6 text-lg text-muted-foreground">
        Placeholder body content.
      </p>
    </main>
  );
}
