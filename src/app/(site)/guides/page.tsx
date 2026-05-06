import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Calendar } from "lucide-react";
import { getAllGuides } from "@/lib/guides";

export const metadata: Metadata = {
  title: "Car Selling Guides | Expert Advice",
  description:
    "Free expert guides on how to sell your car, get the best price, handle paperwork and more. Everything you need to know.",
  alternates: { canonical: "/guides" },
};

export default function GuidesPage() {
  const guides = getAllGuides();
  const categories = [
    "All",
    "Getting Started",
    "Valuation",
    "Paperwork",
    "Finance",
    "Preparation",
    "Specialist",
    "Safety",
    "Timeline",
  ];

  return (
    <main>
      <section className="py-20 bg-hero-yellow">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-6">Car Selling Guides</h1>
            <p className="text-xl text-foreground/80 leading-relaxed">
              Expert advice and comprehensive guides to help you sell your car with confidence.
            </p>
          </div>
        </div>
      </section>

      <section className="py-8 bg-background border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <span
                key={category}
                className={`px-6 py-2 rounded-full font-medium ${
                  category === "All" ? "bg-hero-yellow text-foreground" : "bg-muted text-foreground"
                }`}
              >
                {category}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {guides.map((guide) => (
              <Link key={guide.slug} href={`/guides/${guide.slug}`}>
                <Card className="hover:shadow-xl transition-all duration-300 group cursor-pointer h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <Calendar className="w-4 h-4" />
                      <span>{guide.date}</span>
                    </div>
                    <span className="inline-block bg-hero-yellow text-foreground px-3 py-1 rounded-full text-xs font-medium mb-4">
                      {guide.category}
                    </span>
                    <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                      {guide.title}
                    </h3>
                    <p className="text-muted-foreground mb-4 leading-relaxed">{guide.description}</p>
                    <div className="flex items-center text-primary font-medium group-hover:gap-3 transition-all">
                      Read guide
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
