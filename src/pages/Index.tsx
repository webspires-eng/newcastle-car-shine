import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { Testimonials } from "@/components/Testimonials";
import { RecentSales } from "@/components/RecentSales";
import { TrustBadges } from "@/components/TrustBadges";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <HowItWorks />
      <Testimonials />
      <RecentSales />
      <TrustBadges />
      <FAQ />
      <Footer />
    </div>
  );
};

export default Index;
