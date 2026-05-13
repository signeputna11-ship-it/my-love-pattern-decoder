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
      <div className="mt-8 space-y-6 text-lg text-muted-foreground leading-relaxed">
        <p>
          Signe Putna created My Love Pattern after years of watching smart, self-aware women — herself included — repeat the same relationship ending with a different person.
        </p>
        <p>
          The patterns had names. The Over-Investor. The Unavailable Chaser. The Validator Seeker. The Boundary Softener. Once you could see yours, everything made sense. Not in a painful way. In a finally way.
        </p>
        <p>
          My Love Pattern exists for the woman who already knows something is off but cannot yet see what she is choosing and why. The quiz takes 60 seconds. The reset takes longer. Both are worth it.
        </p>
        <p>
          This is not therapy. It is not coaching. It is a mirror held steady until you can see yourself clearly enough to make a different choice.
        </p>
        <p>
          <a href="https://mylovepattern.com" className="text-foreground underline">mylovepattern.com</a>
        </p>
      </div>
    </main>
  );
}
