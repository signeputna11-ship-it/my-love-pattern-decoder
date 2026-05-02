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

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "My Love Pattern — Understand why it keeps happening." },
      {
        name: "description",
        content:
          "You don't have a dating problem — you have a pattern. Find yours in 60 seconds and learn exactly what to do instead.",
      },
      { property: "og:title", content: "My Love Pattern" },
      {
        property: "og:description",
        content: "Understand why it keeps happening. Find your pattern in 60 seconds.",
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
      <ExperiencePortal />
      <FinalCTA />
    </div>
  );
}
