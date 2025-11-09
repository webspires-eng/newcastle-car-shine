import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";

export const Testimonials = () => {
  const testimonials = [
    {
      quote: "I needed to sell my car. I did shop around, and they gave me the best price.",
      author: "Anthonia",
      car: "sold her Hyundai"
    },
    {
      quote: "When we looked at competitors, this was the most straightforward and gave us a better price.",
      author: "Nigel",
      car: "sold his VW"
    },
    {
      quote: "It was the best quote we got. Full stop.",
      author: "Annabel",
      car: "sold her Alfa Romeo"
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            See why thousands have sold with us
          </h2>
          <p className="text-xl text-muted-foreground">
            Real stories from happy car sellers in Newcastle.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="relative overflow-hidden hover:shadow-xl transition-all duration-300 border-2 hover:border-secondary/20">
              <CardContent className="p-8">
                <Quote className="w-12 h-12 text-secondary/20 mb-4" />
                <blockquote className="text-lg text-foreground mb-6 leading-relaxed">
                  "{testimonial.quote}"
                </blockquote>
                <div className="border-t border-border pt-4">
                  <p className="font-semibold text-foreground">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.car}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
