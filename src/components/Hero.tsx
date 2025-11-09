import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Car, Star } from "lucide-react";
import heroBackground from "@/assets/hero-background.jpg";

export const Hero = () => {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroBackground} 
          alt="Professional car service" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-primary/90 to-primary-glow/85"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Logo/Brand */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <Car className="w-10 h-10 text-secondary" />
            <span className="text-2xl font-bold text-primary-foreground">Sell My Car Newcastle</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-primary-foreground leading-tight">
            Sell my car.
          </h1>
          
          <p className="text-2xl sm:text-3xl lg:text-4xl text-primary-foreground/95 font-light">
            Fast, fair and no fuss.
          </p>

          <p className="text-lg sm:text-xl text-primary-foreground/90 max-w-3xl mx-auto">
            Get a free valuation, the best offer from 7,500+ dealers, and free home collection with same-day payment.
          </p>

          {/* CTA Form */}
          <div className="max-w-2xl mx-auto mt-8">
            <div className="flex flex-col sm:flex-row gap-4 p-6 bg-background/95 backdrop-blur-sm rounded-2xl shadow-2xl">
              <Input 
                type="text" 
                placeholder="Enter your registration (e.g., AB12 CDE)" 
                className="flex-1 h-14 text-lg border-2 border-border focus:border-primary"
              />
              <Button variant="hero" size="xl" className="sm:w-auto">
                Value Your Car
              </Button>
            </div>
            
            {/* Trust Indicators */}
            <div className="mt-6 flex items-center justify-center gap-2 text-primary-foreground/90">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-5 h-5 fill-secondary text-secondary" />
                ))}
              </div>
              <span className="text-sm font-medium">Rated 4.4/5 from 92,250+ reviews</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10"></div>
    </section>
  );
};
