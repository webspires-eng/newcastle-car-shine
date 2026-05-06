import type { Metadata } from "next";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { Testimonials } from "@/components/Testimonials";
import { CtaSection } from "@/components/CtaSection";
import { RecentSales } from "@/components/RecentSales";
import { TrustBadges } from "@/components/TrustBadges";
import { SellingConfidence } from "@/components/SellingConfidence";
import { FAQ } from "@/components/FAQ";
import { GuidesSection } from "@/components/GuidesSection";

export const metadata: Metadata = {
  title: "Sell My Car Newcastle | Get an Instant Free Valuation",
  description:
    "Sell your car in Newcastle quickly and fairly. Get a free instant valuation from 7,500+ dealers, free home collection and same-day payment.",
  alternates: { canonical: "/" },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Can I sell my car on finance?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, you can sell a car with outstanding finance. We handle settlement of the finance directly with your lender as part of the sale process.",
      },
    },
    {
      "@type": "Question",
      name: "Is it free to sell my car with Sell My Car Newcastle?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, it is completely free to sell your car with us. There are no fees or hidden charges.",
      },
    },
    {
      "@type": "Question",
      name: "How can I sell my car fast?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Get an instant online valuation, accept an offer from our 7,500+ dealer network, and we'll arrange free collection with same-day payment.",
      },
    },
    {
      "@type": "Question",
      name: "How much is my car worth?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Enter your reg number for an instant free valuation. Our system checks live market data from 7,500+ dealers to give you an accurate current value.",
      },
    },
    {
      "@type": "Question",
      name: "Who will buy my car?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Your car is auctioned to our network of 7,500+ verified UK dealers who compete to give you the highest price.",
      },
    },
    {
      "@type": "Question",
      name: "Where can I sell my car for the best price?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sell My Car Newcastle gets you offers from 7,500+ dealers competing for your car, meaning you get the best market price without the hassle of selling privately.",
      },
    },
  ],
};

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Hero />
      <HowItWorks />
      <Testimonials />
      <CtaSection />
      <RecentSales />
      <TrustBadges />
      <SellingConfidence />
      <FAQ />
      <GuidesSection />
    </main>
  );
}
