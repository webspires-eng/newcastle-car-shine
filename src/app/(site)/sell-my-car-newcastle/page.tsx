import type { Metadata } from "next";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { TrustBadges } from "@/components/TrustBadges";
import { FAQ } from "@/components/FAQ";

export const metadata: Metadata = {
  title: "Sell My Car Newcastle - Free Instant Valuation",
  description:
    "Sell your car in Newcastle today. Free valuation, free collection, same-day payment. Trusted by 500,000+ customers.",
  alternates: { canonical: "/sell-my-car-newcastle" },
  robots: { index: false, follow: true },
};

export default function SellMyCarNewcastleLanding() {
  return (
    <main className="min-h-screen">
      <Hero
        headline="Sell Your Car in Newcastle Today"
        subheadline="Free instant valuation. Free collection. Same-day payment from 7,500+ verified dealers."
      />
      <HowItWorks />
      <TrustBadges />
      <FAQ />
    </main>
  );
}
