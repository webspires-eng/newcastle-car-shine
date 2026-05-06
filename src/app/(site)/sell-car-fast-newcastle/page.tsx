import type { Metadata } from "next";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { TrustBadges } from "@/components/TrustBadges";
import { FAQ } from "@/components/FAQ";

export const metadata: Metadata = {
  title: "Sell Your Car Fast in Newcastle - Same-Day Payment",
  description:
    "Sell your car fast in Newcastle. Free collection and same-day payment from verified UK dealers. Quick, easy, no hassle.",
  alternates: { canonical: "/sell-car-fast-newcastle" },
  robots: { index: false, follow: true },
};

export default function SellCarFastNewcastleLanding() {
  return (
    <main className="min-h-screen">
      <Hero
        headline="Sell Your Car Fast in Newcastle"
        subheadline="Same-day payment. Free collection. The quickest way to sell in the North East."
      />
      <HowItWorks />
      <TrustBadges />
      <FAQ />
    </main>
  );
}
