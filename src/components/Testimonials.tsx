import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import anthoniaImg from "@/assets/testimonial-anthonia.jpg";
import nigelImg from "@/assets/testimonial-nigel.jpg";
import annabelImg from "@/assets/testimonial-annabel.jpg";

export const Testimonials = () => {
  const testimonials = [
    {
      quote: "I needed to sell my car. I did shop around, and they gave me the best price.",
      author: "Anthonia",
      car: "sold her Hyundai",
      image: anthoniaImg
    },
    {
      quote: "When we looked at competitors, this was the most straightforward and gave us a better price.",
      author: "Nigel",
      car: "sold his VW",
      image: nigelImg
    },
    {
      quote: "It was the best quote we got. Full stop.",
      author: "Annabel",
      car: "sold her Alfa Romeo",
      image: annabelImg
    }
  ];

  return (
    <section className="py-20 bg-hero-yellow rounded-[4rem] mx-4 sm:mx-6 lg:mx-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            See why thousands have sold with us
          </h2>
          <p className="text-xl text-foreground/80">
            Real stories from happy car sellers in Newcastle.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="relative overflow-hidden hover:shadow-xl transition-all duration-300 border-0 rounded-3xl">
              <CardContent className="p-8 text-center">
                {/* Avatar */}
                <div className="flex justify-center mb-6 -mt-16">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-background shadow-lg">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.author}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <blockquote className="text-lg text-foreground mb-6 leading-relaxed">
                  "{testimonial.quote}"
                </blockquote>
                
                <div className="border-t border-border pt-4 mb-4">
                  <p className="font-semibold text-foreground">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.car}</p>
                </div>

                <Button variant="outline" size="sm" className="rounded-full">
                  More money stories
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
