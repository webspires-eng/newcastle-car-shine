import { Card, CardContent } from "@/components/ui/card";
import { FileCheck, Gavel, Truck } from "lucide-react";

export const HowItWorks = () => {
  const steps = [
    {
      icon: FileCheck,
      title: "Get a free valuation",
      description: "See your car's value instantly, then use our app to profile your vehicle. Quick, easy to follow and done in a few taps.",
      highlight: "Free & instant"
    },
    {
      icon: Gavel,
      title: "Choose the best offer",
      description: "7,500+ verified dealers bid on your car in our daily auction. We send the highest offer. No fees. No stress.",
      highlight: "Best price guaranteed"
    },
    {
      icon: Truck,
      title: "They pick up. You get paid.",
      description: "Sold! The dealer collects from you wherever you are, and pays the same day. Outstanding finance? We'll sort it.",
      highlight: "Same-day payment"
    }
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Why sell with us
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We make car selling simple. Here's how it works.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <Card key={index} className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20">
                <CardContent className="p-8">
                  <div className="mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 bg-secondary/10 text-secondary text-xs font-semibold rounded-full mb-4">
                      {step.highlight}
                    </span>
                    <h3 className="text-2xl font-bold text-foreground mb-3">
                      {step.title}
                    </h3>
                  </div>
                  
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>

                  {/* Step Number */}
                  <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary/30">{index + 1}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
