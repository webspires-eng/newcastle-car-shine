import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback } from "react";

export const TrustBadges = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true,
    align: "start",
    breakpoints: {
      '(min-width: 768px)': { active: false }
    }
  });

  const [emblaRefBrands, emblaApiBrands] = useEmblaCarousel({ 
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

  const scrollPrevBrands = useCallback(() => {
    if (emblaApiBrands) emblaApiBrands.scrollPrev();
  }, [emblaApiBrands]);

  const scrollNextBrands = useCallback(() => {
    if (emblaApiBrands) emblaApiBrands.scrollNext();
  }, [emblaApiBrands]);
  const reviews = [{
    text: "It was a much better and easier process than I imagined, customer service was excellent.",
    author: "customer",
    time: "2 hours ago"
  }, {
    text: "I have sold two cars through Motorway and found the experience very simple and smooth...",
    author: "Raj",
    time: "3 hours ago"
  }, {
    text: "Straightforward process, clear instructions, good result",
    author: "Cranhamman",
    time: "4 hours ago"
  }, {
    text: "Great service; very quick and easy, with good transparency throughout. I would happi...",
    author: "Jason Moore",
    time: "6 hours ago"
  }];
  return <section className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-8">
            Rated 'Excellent' with 80,000+ reviews
          </h2>
        </div>

        <div className="relative max-w-7xl mx-auto mb-16">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={scrollPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background md:hidden"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>

          <div className="overflow-hidden md:overflow-visible" ref={emblaRef}>
            <div className="flex md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-6 px-[10px]">
              {reviews.map((review, index) => (
                <div 
                  key={index} 
                  className="flex-[0_0_100%] mr-4 md:flex-none md:mr-0 bg-card border border-border rounded-lg p-6"
                >
                  <div className="flex items-center gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map(star => <Star key={star} className="w-4 h-4 fill-[#00b67a] text-[#00b67a]" />)}
                    <span className="text-xs text-muted-foreground ml-2">✓ Invited</span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2 text-sm">
                    {review.text.split('.')[0]}...
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    {review.text}
                  </p>
                  <div className="text-xs text-muted-foreground">
                    <p className="font-semibold">{review.author}, {review.time}</p>
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

        <div className="text-center mb-12">
          <p className="text-muted-foreground mb-2">
            Rated <span className="font-bold">4.4</span> / 5 based on <span className="font-bold">92,400 reviews</span>. Showing our 5 star reviews.
          </p>
          <div className="flex items-center justify-center gap-1">
            <Star className="w-5 h-5 fill-[#00b67a] text-[#00b67a]" />
            <span className="font-bold text-[#00b67a]">Trustpilot</span>
          </div>
        </div>

        <div className="border-t border-border pt-12">
          <div className="text-center mb-6">
            <span className="text-muted-foreground font-medium">Recommended by</span>
          </div>
          
          <div className="relative max-w-5xl mx-auto">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={scrollPrevBrands}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background md:hidden"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>

            <div className="overflow-hidden md:overflow-visible" ref={emblaRefBrands}>
              <div className="flex md:flex-wrap md:justify-center gap-8 px-10 md:px-4">
                <div className="flex-[0_0_100%] md:flex-[0_0_auto] flex justify-center bg-[#FFCC00] px-4 py-2 font-bold text-xl">AA</div>
                <div className="flex-[0_0_100%] md:flex-[0_0_auto] flex items-center justify-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#FF1F8F]"></div>
                  <span className="font-bold text-xl whitespace-nowrap">octopus</span>
                </div>
                <span className="flex-[0_0_100%] md:flex-[0_0_auto] flex justify-center font-bold text-xl whitespace-nowrap">Confused<span className="text-[#FF1F8F]">.com</span></span>
                <div className="flex-[0_0_100%] md:flex-[0_0_auto] text-center flex flex-col items-center justify-center">
                  <div className="font-bold text-lg text-[#00B67A]">MONEY</div>
                  <div className="font-bold text-lg whitespace-nowrap">SUPERMARKET</div>
                </div>
                <span className="flex-[0_0_100%] md:flex-[0_0_auto] flex justify-center font-bold text-xl whitespace-nowrap text-[#00B67A]">GoCompare</span>
              </div>
            </div>

            <Button 
              variant="ghost" 
              size="icon" 
              onClick={scrollNextBrands}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background md:hidden"
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </div>
    </section>;
};