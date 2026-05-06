import { Star } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export const TrustBadges = () => {
  const reviews = [{
    text: "It was a much better and easier process than I imagined, customer service was excellent.",
    author: "customer",
    time: "2 hours ago"
  }, {
    text: "I have sold two cars through Sell My Car Newcastle and found the experience very simple and smooth...",
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

  return <section className="py-10 bg-background">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-8">
          Rated 'Excellent' with 92,000+ reviews
        </h2>
      </div>

      <div className="relative max-w-7xl mx-auto mb-16 md:px-12">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4 md:-ml-6">
            {reviews.map((review, index) => (
              <CarouselItem key={index} className="pl-4 md:pl-6 basis-full sm:basis-1/2 md:basis-1/2 lg:basis-1/4">
                <div className="bg-card border border-border rounded-lg p-6 h-full">
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
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2 md:-left-12" />
          <CarouselNext className="right-2 md:-right-12" />
        </Carousel>
      </div>

      <div className="text-center mb-12">
        <p className="text-muted-foreground mb-2">
          Rated <span className="font-bold">4.4</span> / 5 based on <span className="font-bold">92,000+ reviews</span>. Showing our 5 star reviews.
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

        <div className="relative max-w-5xl mx-auto md:px-12">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4 md:-ml-8 items-center">
              <CarouselItem className="pl-4 md:pl-8 basis-full md:basis-auto flex justify-center">
                <div className="flex items-center justify-center bg-[#FFCC00] px-4 py-2 font-bold text-xl w-fit">AA</div>
              </CarouselItem>
              <CarouselItem className="pl-4 md:pl-8 basis-full md:basis-auto flex justify-center">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#FF1F8F]"></div>
                  <span className="font-bold text-xl whitespace-nowrap">octopus</span>
                </div>
              </CarouselItem>
              <CarouselItem className="pl-4 md:pl-8 basis-full md:basis-auto flex justify-center">
                <span className="flex items-center justify-center font-bold text-xl whitespace-nowrap">Confused<span className="text-[#FF1F8F]">.com</span></span>
              </CarouselItem>
              <CarouselItem className="pl-4 md:pl-8 basis-full md:basis-auto flex justify-center">
                <div className="text-center flex flex-col items-center justify-center">
                  <div className="font-bold text-lg text-[#00B67A]">MONEY</div>
                  <div className="font-bold text-lg whitespace-nowrap">SUPERMARKET</div>
                </div>
              </CarouselItem>
              <CarouselItem className="pl-4 md:pl-8 basis-full md:basis-auto flex justify-center">
                <span className="flex items-center justify-center font-bold text-xl whitespace-nowrap text-[#00B67A]">GoCompare</span>
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious className="left-2 md:-left-12" />
            <CarouselNext className="right-2 md:-right-12" />
          </Carousel>
        </div>
      </div>
    </div>
  </section>;
};