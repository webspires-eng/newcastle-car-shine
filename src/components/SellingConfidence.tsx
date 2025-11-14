import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import carAppPhone from "@/assets/car-app-phone.jpg";
import dealershipInterior from "@/assets/dealership-interior.jpg";
import carHandshake from "@/assets/car-handshake.jpg";

export const SellingConfidence = () => {
  const cards = [
    {
      badge: "Tools",
      badgeColor: "bg-[#4FC3F7]",
      title: "Sell easily with our app",
      link: "Download app",
      image: carAppPhone
    },
    {
      badge: "News",
      badgeColor: "bg-[#BA68C8]",
      title: "Visit our showroom in Newcastle",
      link: "Find location",
      image: dealershipInterior
    },
    {
      badge: "Guides",
      badgeColor: "bg-[#4DB6AC]",
      title: "How to sell a car: a step by step guide",
      link: "Read guide",
      image: carHandshake
    }
  ];

  return (
    <section className="py-20 bg-hero-yellow rounded-[4rem] mx-4 sm:mx-6 lg:mx-8 my-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Sell your car with confidence
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {cards.map((card, index) => (
            <div 
              key={index} 
              className="bg-card rounded-2xl overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img 
                  src={card.image} 
                  alt={card.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <span className={`inline-block ${card.badgeColor} text-foreground px-4 py-1 rounded-full text-sm font-medium mb-4`}>
                  {card.badge}
                </span>
                <h3 className="text-xl font-bold text-foreground mb-4">
                  {card.title}
                </h3>
                <Button variant="link" className="p-0 h-auto text-primary hover:text-primary/80">
                  {card.link}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
