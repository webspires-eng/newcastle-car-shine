import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";
import luxuryCarsRow from "@/assets/luxury-cars-row.jpg";
export const CtaSection = () => {
  return <section className="py-10 bg-background">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto rounded-[4rem] overflow-hidden relative">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={luxuryCarsRow}
            alt="Luxury cars ready for sale"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/85 to-foreground/50"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 py-20 px-8 md:px-16 lg:px-20">
          <div className="max-w-2xl">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-background mb-6 leading-tight">
              Join 500,000+ people who sold with us
            </h2>

            <p className="text-lg text-background/90 leading-relaxed">
              Sold. Collected. Paid. In almost no time at all...
              Selling your car really can be that easy. Getting started?
              Let's find out what yours is worth.
            </p>


          </div>
        </div>
      </div>
    </div>
  </section>;
};