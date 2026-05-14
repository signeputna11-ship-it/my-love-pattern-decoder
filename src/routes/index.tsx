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
      { title: "My Love Pattern — Discover Your Relationship Pattern in 60 Seconds" },
      {
        name: "description",
        content:
          "You don't have a dating problem. You have a pattern. Take the free 60-second quiz to discover which of the four love patterns is shaping your relationships — and what to do instead.",
      },
      { property: "og:title", content: "My Love Pattern — Discover Your Relationship Pattern in 60 Seconds" },
      {
        property: "og:description",
        content: "Free 60-second quiz: discover which of the four love patterns is shaping your relationships, and what shifts it.",
      },
      { property: "og:url", content: "https://mylovepattern.com/" },
    ],
    links: [{ rel: "canonical", href: "https://mylovepattern.com/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "My Love Pattern",
          url: "https://mylovepattern.com",
          logo: "https://mylovepattern.com/og-image.png",
          description:
            "You don't have a dating problem. You have a pattern. My Love Pattern helps you identify your exact love pattern and reset it.",
          sameAs: [
            "https://www.tiktok.com/@mylovepattern",
            "https://www.instagram.com/mylovepattern",
          ],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "My Love Pattern",
          url: "https://mylovepattern.com",
          description:
            "You don't have a dating problem. You have a pattern. Identify your exact love pattern and reset it.",
          potentialAction: {
            "@type": "SearchAction",
            target: {
              "@type": "EntryPoint",
              urlTemplate: "https://mylovepattern.com/?q={search_term_string}",
            },
            "query-input": "required name=search_term_string",
          },
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
          image: "https://mylovepattern.com/og-image.png",
          brand: { "@type": "Brand", name: "My Love Pattern" },
          offers: {
            "@type": "Offer",
            price: "49.00",
            priceCurrency: "USD",
            availability: "https://schema.org/InStock",
            url: "https://mylovepattern.com",
            shippingDetails: {
              "@type": "OfferShippingDetails",
              shippingRate: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
              deliveryTime: {
                "@type": "ShippingDeliveryTime",
                handlingTime: { "@type": "QuantitativeValue", minValue: 0, maxValue: 0, unitCode: "DAY" },
                transitTime: { "@type": "QuantitativeValue", minValue: 0, maxValue: 0, unitCode: "DAY" },
              },
              shippingDestination: { "@type": "DefinedRegion", addressCountry: "US" },
            },
            hasMerchantReturnPolicy: {
              "@type": "MerchantReturnPolicy",
              applicableCountry: "US",
              returnPolicyCategory: "https://schema.org/MerchantReturnNotPermitted",
            },
          },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "What is the My Love Pattern Reset Kit?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "The My Love Pattern Reset Kit is a self-guided digital toolkit for single adults who keep ending up in one-sided or unavailable relationships. It includes 20 practical tools to identify your love pattern, reset your self-worth, and build the inner foundation for healthy committed love.",
              },
            },
            {
              "@type": "Question",
              name: "What are the four love patterns?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "The four patterns are: The Over-Investor (gives everything before anything is established), The Unavailable Chaser (feels most alive when someone is unclear or distant), The Validator Seeker (calm when attention comes, anxious when it does not), and The Boundary Softener (knows their standards until they like someone).",
              },
            },
            {
              "@type": "Question",
              name: "How long does the quiz take?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "The pattern quiz takes approximately 60 seconds. Results are instant and no sign-up is required.",
              },
            },
            {
              "@type": "Question",
              name: "What is included in the Reset Kit?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "The Reset Kit includes 20 fillable PDF tools covering five stages: pattern recognition, belief questioning, inner stability, boundary setting, and staying grounded in healthy love. You receive lifetime access and can download everything to your device.",
              },
            },
            {
              "@type": "Question",
              name: "How much does the Reset Kit cost?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "The full Reset Kit costs $49 with lifetime access. The first worksheet is available free with no sign-up required.",
              },
            },
            {
              "@type": "Question",
              name: "Is this a replacement for therapy?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "No. The Reset Kit is a practical self-guided digital asset for reflection and decision-making. It is not a substitute for professional mental health support.",
              },
            },
            {
              "@type": "Question",
              name: "What is the Deep Pattern Reset session?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "The Deep Pattern Reset is a private 90-minute 1:1 session with Signe. You enter a deeply relaxed meditative state and work directly on the beliefs driving your pattern at the level where they actually live. It includes a personalised 21-day reset audio meditation, a pre-session worksheet, and a follow-up voice note from Signe within 48 hours. Investment is $333.",
              },
            },
          ],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: "How to use the My Love Pattern Reset Kit",
          description:
            "A step-by-step guide to identifying your love pattern and resetting your relationship with yourself and others.",
          totalTime: "PT21D",
          estimatedCost: { "@type": "MonetaryAmount", currency: "USD", value: "49" },
          step: [
            {
              "@type": "HowToStep",
              position: 1,
              name: "Take the 60-second pattern quiz",
              text: "Complete the free quiz at mylovepattern.com to identify which of the four love patterns is driving your relationship choices. Results are instant.",
            },
            {
              "@type": "HowToStep",
              position: 2,
              name: "Complete the free first worksheet",
              text: "Download and fill in the first worksheet to begin recognising your pattern in your own dating history. No payment required for this step.",
            },
            {
              "@type": "HowToStep",
              position: 3,
              name: "Unlock the full Reset Kit",
              text: "Purchase the full kit for $49 to access all 20 fillable tools across five stages: pattern recognition, belief questioning, inner stability, boundary setting, and steady love.",
            },
            {
              "@type": "HowToStep",
              position: 4,
              name: "Work through the tools in order",
              text: "Each stage builds on the previous one. Complete the tools in sequence for the full reset, or return to individual tools whenever a specific situation arises.",
            },
            {
              "@type": "HowToStep",
              position: 5,
              name: "Download your completed worksheets",
              text: "Save all completed worksheets as PDFs to your device. Your results and reflections are yours to keep with lifetime access.",
            },
            {
              "@type": "HowToStep",
              position: 6,
              name: "Optional: book a Deep Pattern Reset session",
              text: "If you want to go deeper than the kit, email Signe at mylovepattern@gmail.com to arrange a discovery call for the private 90-minute Deep Pattern Reset session at $333.",
            },
          ],
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
      {/* <DeepResetPopup /> disabled */}
    </div>
  );
}
