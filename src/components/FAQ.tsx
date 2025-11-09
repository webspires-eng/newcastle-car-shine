import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const FAQ = () => {
  const faqs = [
    {
      question: "Can I sell my car on finance?",
      answer: "Yes! We can help you settle any outstanding finance as part of the sale process. We'll work with your finance company to ensure everything is handled smoothly, and you'll receive any remaining funds after the finance is settled."
    },
    {
      question: "Is it free to sell my car with us?",
      answer: "Absolutely! There are no fees or charges for using our service. We don't take any commission from your sale. You keep 100% of the selling price."
    },
    {
      question: "How can I sell my car fast?",
      answer: "Our platform connects you with 7,500+ verified dealers who bid on your car in a daily auction. Once you accept an offer, we arrange free collection and same-day payment. Most cars are collected within 24-48 hours."
    },
    {
      question: "How much is my car worth?",
      answer: "Enter your registration number above to get an instant free valuation. Our system checks real-time market data to give you an accurate estimate of your car's value. You'll then receive competitive offers from verified dealers."
    },
    {
      question: "Who will buy my car?",
      answer: "Your car is presented to our network of 7,500+ verified dealers across the UK. These professional buyers bid on your vehicle, and you'll receive the highest offer. We vet all dealers to ensure a safe and professional service."
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
              Sell my car FAQs
            </h2>
            <p className="text-xl text-muted-foreground">
              Everything you need to know about selling your car
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border-2 border-border rounded-lg px-6 hover:border-primary/30 transition-colors duration-300"
              >
                <AccordionTrigger className="text-left text-lg font-semibold hover:text-primary">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pt-2">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};
