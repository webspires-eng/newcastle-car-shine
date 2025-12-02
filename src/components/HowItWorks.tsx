import { Card } from "@/components/ui/card";
import carAppPhone from "@/assets/car-app-phone.jpg";
import womanPhoneGreen from "@/assets/woman-phone-green.jpg";
import womanPhoneYellow from "@/assets/woman-phone-yellow.jpg";

export const HowItWorks = () => {
  const steps = [
    {
      number: 1,
      title: "Get a free valuation",
      description:
        "See your car's value instantly, then use our app to profile your vehicle. Quick, easy to follow and done in a few taps.",
      image: carAppPhone,
      badge: "Ford Focus ST",
      price: "£13,650",
    },
    {
      number: 2,
      title: "Choose the best offer",
      description:
        "7,500+ verified dealers bid on your car in our daily auction. We send the highest offer. No fees. No stress.",
      image: womanPhoneGreen,
      badge: "Offer received",
      price: "£14,250",
    },
    {
      number: 3,
      title: "They pick up. You get paid.",
      description:
        "Sold! The dealer collects from you wherever you are, and pays the same day. Outstanding finance? We'll sort it.",
      image: womanPhoneYellow,
      badge: "Collection",
      status: "confirmed",
    },
  ];

  return (
    <section id="how-it-works" className="py-8 md:py-12 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">Why sell with us</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We make car selling simple. Here's how it works.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {steps.map((step) => (
            <div key={step.number} className="space-y-6">
              {/* Image Card */}
              <Card className="relative overflow-hidden rounded-3xl border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="relative aspect-[3/4] md:aspect-[4/5]">
                  <img src={step.image} alt={step.title} className="w-full h-full object-cover" />
                  {/* Overlay Badge */}
                  <div className="absolute bottom-6 left-6 right-6 bg-foreground/90 backdrop-blur-sm text-background rounded-2xl p-4">
                    {step.price && (
                      <>
                        <p className="text-xs opacity-80 mb-1">{step.badge}</p>
                        <p className="text-2xl font-bold">{step.price}</p>
                      </>
                    )}
                    {step.status && (
                      <>
                        <p className="text-lg font-semibold">{step.badge}</p>
                        <p className="text-xl font-bold">{step.status}</p>
                      </>
                    )}
                  </div>
                </div>
              </Card>

              {/* Step Info */}
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-full bg-hero-yellow flex items-center justify-center">
                  <span className="text-2xl font-bold text-foreground">{step.number}</span>
                </div>

                <h3 className="text-2xl font-bold text-foreground">{step.title}</h3>

                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
