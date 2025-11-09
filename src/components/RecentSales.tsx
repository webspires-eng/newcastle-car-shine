import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";

export const RecentSales = () => {
  const sales = [
    {
      seller: "Gurdeep",
      car: "Tesla Model 3",
      price: "£16,138",
      time: "8 hours ago"
    },
    {
      seller: "Iain",
      car: "Audi A3",
      price: "£4,888",
      time: "8 hours ago"
    },
    {
      seller: "Jodi",
      car: "Nissan Qashqai",
      price: "£7,745",
      time: "8 hours ago"
    },
    {
      seller: "David",
      car: "Mercedes C180",
      price: "£2,160",
      time: "8 hours ago"
    }
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Join 500,000+ people who've sold with us
          </h2>
          <p className="text-lg text-muted-foreground">
            Recent sales from Newcastle and surrounding areas
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {sales.map((sale, index) => (
            <Card key={index} className="hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Sold by {sale.seller}</p>
                    <p className="font-semibold text-foreground">{sale.car}</p>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
                </div>
                <div className="space-y-2">
                  <p className="text-2xl font-bold text-primary">{sale.price}</p>
                  <Badge variant="secondary" className="text-xs">
                    {sale.time}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
