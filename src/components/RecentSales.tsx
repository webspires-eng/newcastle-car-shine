import { Card, CardContent } from "@/components/ui/card";

export const RecentSales = () => {
  const sales = [
    { seller: "Lucy", car: "Fiat 500 for £5,126", time: "4 mins ago" },
    { seller: "Helen", car: "BMW M1 for £20,939", time: "5 hours ago" },
    { seller: "Sam", car: "Audi Q2 for £10,609", time: "5 hours ago" },
    { seller: "Kate", car: "Porsche 911 for £44,501", time: "5 hours ago" },
    { seller: "Velina", car: "Mercedes GLA 220 D 4MAT AMG", time: "6 hours ago" },
  ];

  return (
    <section className="py-20 bg-background rounded-[4rem] mx-4 sm:mx-6 lg:mx-8 my-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight">
            Join 500,000+ people who've
            <br />
            sold with us
          </h2>
        </div>

        {/* Horizontal Scrolling Container */}
        <div className="overflow-x-auto pb-4 -mx-4 px-4">
          <div className="flex gap-6 min-w-max">
            {sales.map((sale, index) => (
              <Card 
                key={index} 
                className="w-80 hover:shadow-lg transition-all duration-300 rounded-2xl border-2"
              >
                <CardContent className="p-6">
                  {/* Car Image Placeholder */}
                  <div className="w-full h-48 bg-muted rounded-xl mb-4 flex items-center justify-center">
                    <span className="text-muted-foreground text-sm">Car Image</span>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Sold by {sale.seller}</p>
                    <p className="font-semibold text-foreground text-lg">{sale.car}</p>
                    <p className="text-xs text-muted-foreground">{sale.time}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
