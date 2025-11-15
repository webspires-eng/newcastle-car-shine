import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import blueCar from "@/assets/blue-bmw-car.png";
import personWithCar from "@/assets/person-with-car-nobg.png";
import { ManualEntryDialog } from "@/components/ManualEntryDialog";
export const Hero = () => {
  const [showManualEntry, setShowManualEntry] = useState(false);

  const handleManualEntry = () => {
    // Success handling is now done within ManualEntryDialog
    setShowManualEntry(false);
  };
  return <section id="hero" className="relative overflow-hidden bg-background py-12 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Centered Yellow Background Container with rounded corners */}
          <div className="relative rounded-[3rem] md:rounded-[4rem] overflow-hidden bg-hero-yellow p-8 md:p-12 lg:p-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Left Content */}
              <div className="space-y-2 relative z-10">
               
                <h1 className="sm:text-6xl lg:text-7xl font-bold text-foreground leading-tight text-3xl text-left">
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

                <div className="max-w-2xl space-y-3">
                  <Button type="button" variant="default" size="lg" onClick={() => setShowManualEntry(true)} className="h-16 px-8 text-lg font-semibold bg-foreground text-background hover:bg-foreground/90 rounded-xl">
                    Get Your Free Valuation
                  </Button>
                  <p className="text-xs text-foreground/70">Enter your vehicle details to get an instant valuation from 7,500+ dealers.</p>
                </div>

                {/* Trustpilot Badge */}
                <div className="flex items-center gap-3 pt-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-[#00B67A] text-[#00B67A]" />
                    <span className="font-bold text-foreground">Trustpilot</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map(star => <Star key={star} className="w-4 h-4 fill-[#00B67A] text-[#00B67A]" />)}
                  </div>
                  <span className="text-sm text-foreground/80">92,250+ reviews</span>
                </div>
              </div>

              {/* Right Content - Car Image with Person */}
              <div className="relative flex items-center justify-center">
                {/* Person image positioned absolutely */}
                <img 
                  src={personWithCar} 
                  alt="Professional car dealer" 
                  className="absolute left-0 bottom-0 w-1/3 h-auto z-20 animate-fade-in"
                  style={{
                    filter: 'drop-shadow(0 10px 30px rgba(0, 0, 0, 0.2))'
                  }} 
                />
                {/* Car image */}
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

      {/* Manual Entry Dialog */}
      <ManualEntryDialog open={showManualEntry} onOpenChange={setShowManualEntry} onSubmit={handleManualEntry} />
    </section>;
};