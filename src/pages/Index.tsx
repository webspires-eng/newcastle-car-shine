import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { Testimonials } from "@/components/Testimonials";
import { CtaSection } from "@/components/CtaSection";
import { RecentSales } from "@/components/RecentSales";
import { TrustBadges } from "@/components/TrustBadges";
import { SellingConfidence } from "@/components/SellingConfidence";
import { FAQ } from "@/components/FAQ";
import { GuidesSection } from "@/components/GuidesSection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <HowItWorks />
      <Testimonials />
      <CtaSection />
      <RecentSales />
      <TrustBadges />
      <SellingConfidence />
      <FAQ />
      <GuidesSection />
      <Footer />
    </div>
  );
};

export default Index;
