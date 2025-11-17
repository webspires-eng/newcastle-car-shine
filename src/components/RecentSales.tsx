import { Card, CardContent } from "@/components/ui/card";
import carFiat from "@/assets/car-fiat-500.png";
import carBMW from "@/assets/car-bmw-m1.png";
import carAudi from "@/assets/car-audi-q2.png";
import carPorsche from "@/assets/car-porsche-911.png";
import carMercedes from "@/assets/car-mercedes-gla.png";

export const RecentSales = () => {
  const sales = [
    { seller: "Lucy", car: "Fiat 500 for £5,126", time: "4 mins ago", image: carFiat },
    { seller: "Helen", car: "BMW M1 for £20,939", time: "5 hours ago", image: carBMW },
    { seller: "Sam", car: "Audi Q2 for £10,609", time: "5 hours ago", image: carAudi },
    { seller: "Kate", car: "Porsche 911 for £44,501", time: "5 hours ago", image: carPorsche },
    { seller: "Velina", car: "Mercedes GLA 220 D 4MAT AMG", time: "6 hours ago", image: carMercedes },
  ];

  return (
    <section className="py-12 md:py-16 bg-background rounded-[4rem] mx-4 sm:mx-6 lg:mx-8 my-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight">
            Join 500,000+ people who've
            <br />
            sold with us
          </h2>
        </div>

        {/* Horizontal Scrolling Container */}
        <div className="overflow-x-auto pb-4 -mx-4 px-4">
          <div className="flex gap-6 min-w-max">
            {sales.map((sale, index) => (
              <Card 
                key={index} 
                className="w-80 hover:shadow-xl transition-all duration-500 rounded-2xl border-2 animate-fade-in hover:scale-105"
                style={{
                  animationDelay: `${index * 0.1}s`,
                  animationFillMode: 'both'
                }}
              >
                <CardContent className="p-6">
                  {/* Car Image with slide animation */}
                  <div className="w-full h-40 bg-gradient-to-br from-muted to-muted/50 rounded-xl mb-4 flex items-center justify-center overflow-hidden relative group">
                    <img 
                      src={sale.image} 
                      alt={sale.car}
                      className="w-48 h-auto object-contain transform transition-all duration-700 group-hover:scale-110 group-hover:translate-x-2 animate-slide-in-right"
                      style={{
                        animationDelay: `${index * 0.15}s`,
                        animationFillMode: 'both'
                      }}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Sold by {sale.seller}</p>
                    <p className="font-semibold text-foreground text-lg">{sale.car}</p>
                    <p className="text-xs text-muted-foreground">{sale.time}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
