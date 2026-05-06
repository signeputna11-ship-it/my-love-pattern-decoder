import { createFileRoute } from "@tanstack/react-router";
import {
  Nav,
  Hero,
  PatternSection,
  Diagnosis,
  Toolkit,
  ExperiencePortal,
  FinalCTA,
} from "@/components/healthy-love/sections";
import { StickyMobileCTA } from "@/components/healthy-love/StickyMobileCTA";
import { DeepResetSection } from "@/components/healthy-love/DeepResetSection";
import { DeepResetPopup } from "@/components/healthy-love/DeepResetPopup";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "My Love Pattern · Understand why it keeps happening." },
      {
        name: "description",
        content:
          "You don't have a dating problem. You have a pattern. Find yours in 60 seconds and learn exactly what to do instead.",
      },
      { property: "og:title", content: "My Love Pattern" },
      {
        property: "og:description",
        content: "Understand why it keeps happening. Find your pattern in 60 seconds.",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "My Love Pattern",
          url: "https://mylovepattern.com",
          description:
            "You don't have a dating problem. You have a pattern. My Love Pattern helps you identify your exact love pattern and reset it.",
          sameAs: [],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          name: "My Love Pattern Reset Kit",
          description:
            "A self-guided digital toolkit to identify your love pattern, reset self-worth, and choose healthier committed relationships.",
          offers: {
            "@type": "Offer",
            price: "49.00",
            priceCurrency: "USD",
            availability: "https://schema.org/InStock",
            url: "https://mylovepattern.com",
          },
        }),
      },
    ],
  }),
});

function Index() {
  return (
    <div className="min-h-screen bg-black pb-24 text-white md:pb-0">
      <Nav />
      <Hero />
      <PatternSection />
      <Diagnosis />
      <Toolkit />
      <ExperiencePortal />
      <DeepResetSection />
      <FinalCTA />
      <StickyMobileCTA />
      <DeepResetPopup />
    </div>
  );
}
