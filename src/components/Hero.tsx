import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Star } from "lucide-react";
import blueCar from "@/assets/blue-car.png";

export const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-background">
      {/* Yellow Geometric Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Main yellow shape */}
        <div 
          className="absolute top-0 left-0 w-[65%] h-full bg-hero-yellow"
          style={{
            clipPath: 'polygon(0 0, 85% 0, 70% 100%, 0 100%)'
          }}
        />
        {/* Second yellow shape */}
        <div 
          className="absolute top-0 right-[20%] w-[25%] h-full bg-hero-yellow"
          style={{
            clipPath: 'polygon(0 0, 85% 0, 70% 100%, 0 100%)'
          }}
        />
        {/* Third yellow shape */}
        <div 
          className="absolute top-0 right-0 w-[20%] h-full bg-hero-yellow"
          style={{
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 15% 100%)'
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center min-h-[600px] py-12">
          {/* Left Content */}
          <div className="space-y-6 lg:pr-12">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground leading-tight">
              Sell my car.
              <br />
              Fast, fair and
              <br />
              no fuss.
            </h1>

            <p className="text-lg text-foreground/90 max-w-xl">
              <span className="font-semibold">Get a free valuation,</span> the best offer from 7,500+ dealers,
              and free home collection with same-day payment.
            </p>

            {/* CTA Form */}
            <div className="flex flex-col sm:flex-row gap-3 max-w-2xl">
              <Input 
                type="text" 
                placeholder="ENTER REG" 
                className="h-14 text-base bg-background border-2 border-border font-medium uppercase placeholder:text-muted-foreground/50"
              />
              <Button 
                variant="default" 
                size="lg"
                className="h-14 px-8 text-base font-semibold whitespace-nowrap bg-foreground text-background hover:bg-foreground/90"
              >
                Value your car →
              </Button>
            </div>

            {/* Trustpilot Badge */}
            <div className="flex items-center gap-3 pt-4">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 fill-[#00B67A] text-[#00B67A]" />
                <span className="font-bold text-foreground">Trustpilot</span>
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4 fill-[#00B67A] text-[#00B67A]" />
                ))}
              </div>
              <span className="text-sm text-foreground/80">92,250+ reviews</span>
            </div>
          </div>

          {/* Right Content - Car Image */}
          <div className="relative lg:block hidden">
            <img 
              src={blueCar}
              alt="Blue car"
              className="w-full h-auto relative z-10"
              style={{
                filter: 'drop-shadow(0 25px 50px rgba(0, 0, 0, 0.15))'
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
