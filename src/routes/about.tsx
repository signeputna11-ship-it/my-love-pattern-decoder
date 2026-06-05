import { createFileRoute } from "@tanstack/react-router";
import { DeepResetPage } from "@/components/healthy-love/DeepResetPage";

// /about renders the same content as /deep-reset (the page was renamed).
// Returns 200 instead of a 30x redirect so Google can index the canonical
// /deep-reset URL via the canonical link tag below.
export const Route = createFileRoute("/about")({
  component: DeepResetPage,
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
  }),
});
