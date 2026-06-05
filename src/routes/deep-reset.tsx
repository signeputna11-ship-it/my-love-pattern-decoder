import { createFileRoute } from "@tanstack/react-router";
import { DeepResetPage } from "@/components/healthy-love/DeepResetPage";

export const Route = createFileRoute("/deep-reset")({
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
      { property: "og:url", content: "https://mylovepattern.com/deep-reset" },
    ],
    links: [{ rel: "canonical", href: "https://mylovepattern.com/deep-reset" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "AboutPage",
          name: "About My Love Pattern",
          url: "https://mylovepattern.com/deep-reset",
          mainEntity: {
            "@type": "Person",
            name: "Signe Putna",
            jobTitle: "Founder, My Love Pattern",
            url: "https://mylovepattern.com",
          },
        }),
      },
    ],
  }),
  component: DeepResetPage,
});
