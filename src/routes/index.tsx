import { createFileRoute } from "@tanstack/react-router";
import {
  Nav,
  Hero,
  PatternSection,
  Diagnosis,
  Toolkit,
  Experience,
  FooterCTA,
} from "@/components/healthy-love/sections";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Healthy Love Observatory — Relationship Pattern Diagnosis" },
      {
        name: "description",
        content:
          "A guided self-worth and relationship clarity system. Diagnose your pattern, reset your standards, choose consistency over chemistry.",
      },
      { property: "og:title", content: "Healthy Love Observatory" },
      {
        property: "og:description",
        content: "Diagnose your relationship pattern. Reset your standards. Choose consistency.",
      },
    ],
  }),
});

function Index() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Nav />
      <Hero />
      <PatternSection />
      <Diagnosis />
      <Toolkit />
      <Experience />
      <FooterCTA />
    </div>
  );
}
