import { createFileRoute } from "@tanstack/react-router";
import { DeepResetPage } from "@/components/healthy-love/DeepResetPage";

const TITLE =
  "The Deep Pattern Reset — Private Session with Signe · My Love Pattern";
const DESC =
  "A private 90-minute session that resets the belief driving your love pattern at the level where it lives. Book a free 20-minute discovery call with Signe.";
const URL = "https://mylovepattern.com/deep-reset";

export const Route = createFileRoute("/deep-reset")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:url", content: URL },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          name: "The Deep Pattern Reset",
          provider: {
            "@type": "Person",
            name: "Signe Putna",
            url: "https://mylovepattern.com",
          },
          areaServed: "Worldwide",
          serviceType: "Private 1:1 subconscious pattern reset session",
          url: URL,
          description: DESC,
          offers: {
            "@type": "Offer",
            price: "333",
            priceCurrency: "USD",
            url: URL,
            availability: "https://schema.org/InStock",
          },
        }),
      },
    ],
  }),
  component: DeepResetPage,
});
