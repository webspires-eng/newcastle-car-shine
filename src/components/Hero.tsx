import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Star } from "lucide-react";
import blueCar from "@/assets/blue-car-transparent.png";
import bmwLogo from "@/assets/bmw-logo.png";

export const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-background py-12 md:py-20">
      {/* Diagonal Yellow Geometric Shapes Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Left large diagonal shape */}
        <div 
          className="absolute top-0 left-0 w-[55%] h-full bg-hero-yellow"
          style={{
            clipPath: 'polygon(0 0, 100% 0, 80% 100%, 0% 100%)'
          }}
        />
        
        {/* Middle diagonal shape */}
        <div 
          className="absolute top-0 right-[22%] w-[28%] h-full bg-hero-yellow"
          style={{
            clipPath: 'polygon(20% 0, 100% 0, 80% 100%, 0% 100%)'
          }}
        />
        
        {/* Right small diagonal shape */}
        <div 
          className="absolute top-0 right-0 w-[12%] h-full bg-hero-yellow"
          style={{
            clipPath: 'polygon(35% 0, 100% 0, 100% 100%, 0% 100%)'
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center min-h-[600px]">
            {/* Left Content */}
            <div className="space-y-6 relative z-10">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground leading-tight">
                Sell my car.
                <br />
                Fast, fair and
                <br />
                no fuss.
              </h1>

              <p className="text-lg md:text-xl text-foreground/90 max-w-xl">
                <span className="font-semibold">Get a free valuation,</span> the best offer from 7,500+ dealers,
                and free home collection with same-day payment.
              </p>

              {/* CTA Form */}
              <div className="flex flex-col sm:flex-row gap-3 max-w-2xl">
                <Input 
                  type="text" 
                  placeholder="ENTER REG" 
                  className="h-14 text-base bg-background border-2 border-border font-medium uppercase placeholder:text-muted-foreground/50 rounded-xl"
                />
                <Button 
                  variant="default" 
                  size="lg"
                  className="h-14 px-8 text-base font-semibold whitespace-nowrap bg-foreground text-background hover:bg-foreground/90 rounded-xl"
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

            {/* Right Content - Car Image with BMW Logo */}
            <div className="relative flex items-center justify-center lg:justify-end">
              {/* BMW Logo positioned above car */}
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 lg:left-auto lg:right-32 lg:translate-x-0 z-20">
                <div className="flex items-center gap-2 bg-background/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg">
                  <img src={bmwLogo} alt="BMW" className="w-10 h-10 md:w-12 md:h-12" />
                  <span className="text-lg md:text-xl font-bold text-foreground">Newcastle</span>
                </div>
              </div>
              
              <img 
                src={blueCar}
                alt="Blue BMW car"
                className="w-full max-w-2xl h-auto relative z-10"
                style={{
                  filter: 'drop-shadow(0 25px 50px rgba(0, 0, 0, 0.15))'
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
