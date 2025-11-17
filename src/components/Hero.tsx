import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import heroCar from "@/assets/hero-car.png";
import personWithCar from "@/assets/person-with-car-nobg.png";
import { ManualEntryDialog } from "@/components/ManualEntryDialog";
export const Hero = () => {
  const [showManualEntry, setShowManualEntry] = useState(false);
  const handleManualEntry = () => {
    // Success handling is now done within ManualEntryDialog
    setShowManualEntry(false);
  };
  return <section id="hero" className="relative overflow-hidden bg-background py-4 md:py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Centered Yellow Background Container with rounded corners */}
          <div className="relative rounded-[2rem] md:rounded-[3rem] lg:rounded-[4rem] overflow-hidden bg-hero-yellow px-4 py-6 md:p-8 lg:p-12 xl:p-16">
            <div className="flex flex-col-reverse lg:flex-row gap-10 md:gap-12 lg:gap-16 xl:gap-20 items-center lg:items-center min-h-[480px] lg:min-h-[600px] xl:min-h-[650px]">
              {/* Left Content */}
              <div className="space-y-6 flex flex-col justify-center relative z-10 order-2 lg:order-1 w-full lg:w-[52%] text-center lg:text-left px-2 lg:px-8 xl:px-12">
               
                <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl font-bold text-foreground leading-tight md:leading-[1.1] drop-shadow-sm">
                  Sell my car.
                  <br />
                  Fast, fair and
                  <br />
                  no fuss.
                </h1>

                <p className="text-base md:text-lg lg:text-lg xl:text-xl text-foreground/90 max-w-2xl md:max-w-xl lg:max-w-full mt-2 mb-4">
                  <span className="font-semibold">Get a free valuation,</span> the best offer from 7,500+ dealers,
                  and free home collection with same-day payment.
                </p>

                <div className="max-w-2xl space-y-3 mx-auto lg:mx-0 pt-2 md:pt-4">
                  <Button type="button" variant="default" size="lg" onClick={() => setShowManualEntry(true)} className="h-16 md:h-16 px-8 text-lg md:text-lg font-semibold bg-foreground text-background hover:bg-foreground/90 rounded-xl w-full sm:w-auto touch-manipulation shadow-lg">
                    Get Your Instant Quote Now
                  </Button>
                  {/* Trustpilot Badge below CTA on desktop */}
                  <div className="hidden lg:flex items-center gap-3 pt-6">
                    <div className="flex items-center gap-1">
                      
                      <span className="font-bold text-foreground">Trustpilot</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map(star => <Star key={star} className="w-4 h-4 fill-[#00B67A] text-[#00B67A]" />)}
                    </div>
                    <span className="text-sm text-foreground/80">92,250+ reviews</span>
                  </div>
                </div>
              </div>

              {/* Right Content - Car Image with Person */}
              <div className="relative order-1 lg:order-2 w-full lg:w-[48%] flex justify-center items-center pb-4 lg:pb-0">
                {/* Car image */}
                <div className="w-full max-w-[340px] md:max-w-[420px] lg:max-w-[480px] xl:max-w-[550px] aspect-[4/3] overflow-hidden rounded-2xl shadow-2xl relative z-10 animate-fade-in">
                  <img src={heroCar} alt="Dark blue sedan car" className="w-full h-full object-cover object-center" style={{
                  filter: 'drop-shadow(0 25px 50px rgba(0, 0, 0, 0.15))'
                }} />
                </div>
              </div>

              {/* Mobile-only content below image */}
              <div className="lg:hidden order-3 space-y-3 w-full mt-2">
                <p className="text-xs md:text-xs text-foreground/70 text-center">
                  Enter your vehicle details to get an instant valuation from 7,500+ dealers.
                </p>

                {/* Trustpilot Badge */}
                <div className="flex items-center justify-center gap-3">
                  <div className="flex items-center gap-1">
                    
                    <span className="font-bold text-foreground">Trustpilot</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map(star => <Star key={star} className="w-4 h-4 fill-[#00B67A] text-[#00B67A]" />)}
                  </div>
                  <span className="text-sm text-foreground/80">92,250+ reviews</span>
                </div>
              </div>

              {/* Desktop-only Trustpilot in original position */}
              {/* Trustpilot badge now below CTA on desktop, so this is removed */}
            </div>
          </div>
        </div>
      </div>

      {/* Manual Entry Dialog */}
      <ManualEntryDialog open={showManualEntry} onOpenChange={setShowManualEntry} onSubmit={handleManualEntry} />
    </section>;
};