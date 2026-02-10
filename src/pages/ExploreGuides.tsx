import { useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

const ExploreGuides = () => {
  useEffect(() => { document.title = "Car Selling Guides | Sell My Car Newcastle"; }, []);
  const guides = [
    {
      slug: "how-to-sell-a-car-complete-guide",
      title: "How to Sell a Car: The Complete Step-by-Step Guide",
      date: "January 15, 2025",
      category: "Getting Started",
      excerpt: "Everything you need to know about selling your car, from preparation to finalizing the sale. Learn the best practices for a smooth transaction."
    },
    {
      slug: "documents-needed-to-sell-car",
      title: "What Documents Do I Need to Sell My Car?",
      date: "January 10, 2025",
      category: "Paperwork",
      excerpt: "A comprehensive checklist of all the documents required to sell your car legally in the UK. Don't miss any crucial paperwork."
    },
    {
      slug: "get-best-price-for-car",
      title: "How to Get the Best Price for Your Car",
      date: "January 5, 2025",
      category: "Valuation",
      excerpt: "Top tips to maximize your car's value. Learn what factors affect pricing and how to present your vehicle for the best offers."
    },
    {
      slug: "understanding-car-valuation",
      title: "Understanding Car Valuation: What Affects Your Car's Worth?",
      date: "December 28, 2024",
      category: "Valuation",
      excerpt: "Discover the key factors that determine your car's value, including mileage, condition, market demand, and service history."
    },
    {
      slug: "selling-car-with-outstanding-finance",
      title: "Selling a Car with Outstanding Finance",
      date: "December 20, 2024",
      category: "Finance",
      excerpt: "Can you sell a car with finance still owed? Learn about your options and the correct process for settling outstanding finance."
    },
    {
      slug: "preparing-car-for-sale-checklist",
      title: "Preparing Your Car for Sale: A Detailed Checklist",
      date: "December 15, 2024",
      category: "Preparation",
      excerpt: "From deep cleaning to minor repairs, follow our checklist to get your car sale-ready and attractive to buyers."
    },
    {
      slug: "private-sale-vs-car-buying-service",
      title: "Private Sale vs. Car Buying Service: Which is Best?",
      date: "December 10, 2024",
      category: "Getting Started",
      excerpt: "Compare the pros and cons of selling privately versus using a car buying service. Find out which option suits your needs."
    },
    {
      slug: "how-long-to-sell-car",
      title: "How Long Does It Take to Sell a Car?",
      date: "December 5, 2024",
      category: "Timeline",
      excerpt: "Realistic timelines for selling your car through different methods. Learn what to expect at each stage of the process."
    },
    {
      slug: "tax-insurance-after-selling-car",
      title: "Tax and Insurance: What to Do After Selling Your Car",
      date: "November 28, 2024",
      category: "Paperwork",
      excerpt: "Important steps to take after your car is sold, including canceling insurance, claiming tax refunds, and updating DVLA records."
    },
    {
      slug: "selling-older-high-mileage-cars",
      title: "Selling an Older Car: Tips for High-Mileage Vehicles",
      date: "November 20, 2024",
      category: "Specialist",
      excerpt: "Older cars require special consideration. Learn how to highlight the value in high-mileage vehicles and find the right buyers."
    },
    {
      slug: "selling-electric-hybrid-cars",
      title: "Electric and Hybrid Cars: Special Considerations When Selling",
      date: "November 15, 2024",
      category: "Specialist",
      excerpt: "The unique factors to consider when selling electric or hybrid vehicles, including battery health and charging infrastructure."
    },
    {
      slug: "avoiding-car-selling-scams",
      title: "Avoiding Scams When Selling Your Car",
      date: "November 10, 2024",
      category: "Safety",
      excerpt: "Protect yourself from common car selling scams. Learn to identify red flags and ensure a safe, legitimate transaction."
    }
  ];

  const categories = ["All", "Getting Started", "Valuation", "Paperwork", "Finance", "Preparation", "Specialist", "Safety", "Timeline"];

  return (
    <div className="min-h-screen">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="py-20 bg-hero-yellow">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-6">
                Car Selling Guides
              </h1>
              <p className="text-xl text-foreground/80 leading-relaxed">
                Expert advice and comprehensive guides to help you sell your car with confidence.
              </p>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-8 bg-background border-b border-border sticky top-16 z-40 backdrop-blur-sm bg-background/95">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`px-6 py-2 rounded-full font-medium transition-colors ${category === "All"
                      ? "bg-hero-yellow text-foreground"
                      : "bg-muted text-foreground hover:bg-muted/80"
                    }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Guides Grid */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {guides.map((guide, index) => (
                <Link key={index} to={`/guides/${guide.slug}`}>
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

                      <p className="text-muted-foreground mb-4 leading-relaxed">
                        {guide.excerpt}
                      </p>

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

        {/* CTA Section */}
        <section className="py-20 bg-hero-yellow">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
                Ready to sell your car?
              </h2>
              <p className="text-xl text-foreground/80 mb-8">
                Get your free valuation in seconds and see how much your car is worth today.
              </p>
              <button className="inline-flex items-center gap-2 bg-foreground text-background px-8 py-4 rounded-xl text-lg font-semibold hover:bg-foreground/90 transition-colors">
                Get Free Valuation
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ExploreGuides;
