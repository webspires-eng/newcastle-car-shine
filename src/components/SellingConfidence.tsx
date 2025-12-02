import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import carAppPhone from "@/assets/car-app-phone.jpg";
import dealershipInterior from "@/assets/dealership-interior.jpg";
import carHandshake from "@/assets/car-handshake.jpg";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback } from "react";

export const SellingConfidence = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    breakpoints: {
      '(min-width: 768px)': { active: false }
    }
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);
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
    <section className="py-10 bg-hero-yellow rounded-[4rem] mx-4 sm:mx-6 lg:mx-8 my-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Sell your car with confidence
          </h2>
        </div>

        <div className="relative max-w-7xl mx-auto">
          <Button
            variant="ghost"
            size="icon"
            onClick={scrollPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background md:hidden"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>

          <div className="overflow-hidden md:overflow-visible px-4 md:px-0" ref={emblaRef}>
            <div className="flex md:grid md:grid-cols-3 gap-6">
              {cards.map((card, index) => (
                <div
                  key={index}
                  className="flex-[0_0_100%] min-w-0 md:flex-none bg-card rounded-2xl overflow-hidden hover:shadow-lg transition-shadow duration-300"
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

          <Button
            variant="ghost"
            size="icon"
            onClick={scrollNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background md:hidden"
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </section>
  );
};
