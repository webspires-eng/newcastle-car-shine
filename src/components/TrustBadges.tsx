import { Star } from "lucide-react";

export const TrustBadges = () => {
  const reviews = [
    {
      text: "It was a much better and easier process than I imagined, customer service was excellent.",
      author: "Customer",
      time: "1 hour ago"
    },
    {
      text: "Simple and smooth experience. I have sold two cars and found the experience straightforward.",
      author: "Raj",
      time: "2 hours ago"
    },
    {
      text: "Straightforward process, clear instructions, good result.",
      author: "Cranhamman",
      time: "3 hours ago"
    },
    {
      text: "Great service; very quick and easy with good transparency throughout.",
      author: "Jason Moore",
      time: "5 hours ago"
    }
  ];

  return (
    <section className="py-16 bg-muted/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="w-6 h-6 fill-secondary text-secondary" />
              ))}
            </div>
            <span className="text-xl font-bold">Rated 'Excellent'</span>
          </div>
          <p className="text-muted-foreground">
            Rated 4.4/5 based on 92,400 reviews. Showing our 5 star reviews.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {reviews.map((review, index) => (
            <div 
              key={index} 
              className="bg-card border-2 border-border rounded-lg p-6 hover:border-secondary/30 transition-colors duration-300"
            >
              <div className="flex items-center gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4 fill-secondary text-secondary" />
                ))}
              </div>
              <p className="text-sm text-foreground/80 mb-4 leading-relaxed">
                {review.text}
              </p>
              <div className="text-xs text-muted-foreground">
                <p className="font-semibold">{review.author}</p>
                <p>{review.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
