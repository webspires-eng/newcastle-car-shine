import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const GuidesSection = () => {
  const guides = [
    {
      title: "How to sell a car: step by step guide",
      date: "15/03/2025",
      description: "Selling your car can seem stressful. You want to ..."
    },
    {
      title: "How much is my car worth? 4 quick and easy ways to find out",
      date: "15/03/2025",
      description: "Looking to find out what the value of your car is?..."
    },
    {
      title: "How to transfer car ownership",
      date: "15/03/2025",
      description: "When you sell your car or transfer ownership to a..."
    },
    {
      title: "How to sell a car on finance – the ultimate guide",
      date: "15/03/2025",
      description: "Nowadays, a huge number of cars in the UK are bo..."
    }
  ];

  return (
    <section className="py-10 bg-hero-yellow rounded-[4rem] mx-4 sm:mx-6 lg:mx-8 my-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start justify-between mb-12 gap-6">
          <div>
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
              Car selling guides
            </h2>
            <p className="text-lg text-foreground/80">
              Everything to know about selling, valuing, and maintaining your car. Made simple.
            </p>
          </div>
          <Button
            variant="secondary"
            className="bg-background hover:bg-background/90 text-foreground rounded-full w-full md:w-auto justify-between md:justify-center"
          >
            Explore guides
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {guides.map((guide, index) => (
            <div
              key={index}
              className="bg-card rounded-2xl p-6 hover:shadow-lg transition-shadow duration-300 cursor-pointer group"
            >
              <h3 className="text-lg font-bold text-foreground mb-4 leading-tight">
                {guide.title}
              </h3>
              <div className="mt-auto pt-16">
                <p className="text-xs text-muted-foreground mb-2">{guide.date}</p>
                <p className="text-sm text-foreground/80 mb-4">
                  {guide.description}
                </p>
                <ArrowRight className="w-5 h-5 text-foreground group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
