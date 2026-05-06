import type { Metadata } from "next";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { TrustBadges } from "@/components/TrustBadges";
import { FAQ } from "@/components/FAQ";

export const metadata: Metadata = {
  title: "Free Car Valuation Newcastle - Get an Instant Price",
  description:
    "Get a free instant car valuation in Newcastle. Live market data from 7,500+ dealers. No fees, no obligation.",
  alternates: { canonical: "/car-valuation-newcastle" },
  robots: { index: false, follow: true },
};

export default function CarValuationNewcastleLanding() {
  return (
    <main className="min-h-screen">
      <Hero
        headline="Free Car Valuation in Newcastle"
        subheadline="Get your instant valuation from 7,500+ dealers. No fees. No obligation."
      />
      <HowItWorks />
      <TrustBadges />
      <FAQ />
    </main>
  );
}
