import type { Metadata } from "next";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import dealershipImg from "@/assets/dealership-interior.jpg";
import carHandshakeImg from "@/assets/car-handshake.jpg";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Sell My Car Newcastle – the North East's trusted car buying service since 2010. We've helped 500,000+ people sell their cars.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <main>
      <section className="py-20 bg-hero-yellow">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-6">
              About Sell My Car Newcastle
            </h1>
            <p className="text-xl text-foreground/80 leading-relaxed">
              Newcastle&apos;s trusted car buying service, making selling your car simple, fair, and fast since 2010.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-foreground mb-6">Our Story</h2>
              <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
                Founded in Newcastle in 2010, we started with a simple mission: to make selling your car as easy as possible. We saw how frustrating and time-consuming the traditional car selling process could be, and we knew there had to be a better way.
              </p>
              <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
                Today, we&apos;ve helped over 500,000 people across Newcastle and the North East sell their cars quickly and fairly. Our team of experienced car valuation experts ensures you get the best price for your vehicle, with payment made the same day.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We&apos;re proud to be Newcastle&apos;s most trusted car buying service, with an average rating of 4.8 stars from over 50,000 reviews.
              </p>
            </div>
            <div className="rounded-3xl overflow-hidden shadow-xl">
              <Image src={dealershipImg} alt="Our dealership" className="w-full h-full object-cover" width={800} height={600} />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-foreground mb-12 text-center">Our Values</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-card p-8 rounded-2xl">
                <h3 className="text-2xl font-bold text-foreground mb-4">Fair Pricing</h3>
                <p className="text-muted-foreground">We use advanced market data to ensure you get a fair, competitive price for your car every time.</p>
              </div>
              <div className="bg-card p-8 rounded-2xl">
                <h3 className="text-2xl font-bold text-foreground mb-4">Speed &amp; Simplicity</h3>
                <p className="text-muted-foreground">From valuation to payment, we make the entire process fast and hassle-free. Most sales complete in under 24 hours.</p>
              </div>
              <div className="bg-card p-8 rounded-2xl">
                <h3 className="text-2xl font-bold text-foreground mb-4">Trust &amp; Transparency</h3>
                <p className="text-muted-foreground">No hidden fees, no surprises. What we offer is what you get, with full transparency throughout.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div className="rounded-3xl overflow-hidden shadow-xl">
              <Image src={carHandshakeImg} alt="Happy customer" className="w-full h-full object-cover" width={800} height={600} />
            </div>
            <div>
              <h2 className="text-4xl font-bold text-foreground mb-6">Why Choose Us?</h2>
              <ul className="space-y-4">
                {[
                  "Free, instant online valuation with no obligation",
                  "Same-day payment via bank transfer",
                  "Free collection from your home or workplace",
                  "We handle all the paperwork, including DVLA notifications",
                  "Outstanding customer service rated 4.8/5",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-hero-yellow flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-foreground font-bold">✓</span>
                    </div>
                    <p className="text-lg text-muted-foreground">{item}</p>
                  </li>
                ))}
              </ul>
              <Button size="lg" className="mt-8 bg-hero-yellow text-foreground hover:bg-hero-yellow/90">
                Get Your Free Valuation
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-hero-yellow">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">Ready to sell your car?</h2>
            <p className="text-xl text-foreground/80 mb-8">Join over 500,000 satisfied customers and get your free valuation today.</p>
            <Button size="lg" className="bg-foreground text-background hover:bg-foreground/90">
              Get Started Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
