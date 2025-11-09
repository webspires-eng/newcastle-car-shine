import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Star } from "lucide-react";
import blueCar from "@/assets/blue-bmw-car.png";
import bmwLogo from "@/assets/bmw-logo.png";

export const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-background py-12 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Centered Yellow Background Container with rounded corners */}
          <div className="relative rounded-[3rem] md:rounded-[4rem] overflow-hidden bg-hero-yellow p-8 md:p-12 lg:p-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Left Content */}
              <div className="space-y-6 relative z-10">
                {/* BMW Logo */}
                <div className="flex items-center gap-3 mb-4">
                  <img src={bmwLogo} alt="BMW" className="w-12 h-12 md:w-16 md:h-16" />
                  <span className="text-xl md:text-2xl font-bold text-foreground">Newcastle</span>
                </div>

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

              {/* Right Content - Car Image */}
              <div className="relative flex items-center justify-center">
                <img 
                  src={blueCar}
                  alt="Blue BMW car"
                  className="w-full h-auto relative z-10"
                  style={{
                    filter: 'drop-shadow(0 25px 50px rgba(0, 0, 0, 0.15))'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
