import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";
import houseSunset from "@/assets/house-sunset.jpg";

export const CtaSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto rounded-[4rem] overflow-hidden relative">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img 
              src={houseSunset} 
              alt="Beautiful house at sunset"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 to-foreground/40"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 py-20 px-8 md:px-16 lg:px-20">
            <div className="max-w-2xl">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-background mb-6 leading-tight">
                It's not magic.
                <br />
                It's Newcastle.
              </h2>
              
              <p className="text-lg text-background/90 mb-8 leading-relaxed">
                Sold. Collected. Paid. In almost no time at all... 
                Selling your car really can be that easy. Getting started? 
                Let's find out what yours is worth.
              </p>

              {/* CTA Form */}
              <div className="flex flex-col sm:flex-row gap-3 max-w-xl bg-background/95 backdrop-blur-sm rounded-2xl p-2">
                <Input 
                  type="text" 
                  placeholder="ENTER REG" 
                  className="h-14 text-base border-0 font-medium uppercase placeholder:text-muted-foreground/50 bg-transparent"
                />
                <Button 
                  size="lg"
                  className="h-14 px-8 text-base font-semibold whitespace-nowrap bg-hero-yellow text-foreground hover:bg-hero-yellow/90 rounded-xl"
                >
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
