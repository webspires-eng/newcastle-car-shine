import { Plus } from "lucide-react";
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
      question: "Is it free to sell my car with Newcastle?",
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
    },
    {
      question: "What paperwork do I need to sell my car?",
      answer: "You'll need your V5C log book, MOT certificate, and service history if available. We'll guide you through all the necessary paperwork to ensure a smooth transfer of ownership."
    },
    {
      question: "Where can I sell my car for the best price?",
      answer: "Our auction platform ensures you get the best price by having multiple verified dealers compete for your car. This competition drives up the price compared to selling to a single buyer."
    },
    {
      question: "How does service history impact selling my car?",
      answer: "A full service history can significantly increase your car's value as it demonstrates proper maintenance and care, giving buyers confidence in the vehicle's condition."
    },
    {
      question: "Is it better to part exchange or sell my car online?",
      answer: "Selling online typically gets you a better price than part exchange. With our service, you'll receive competitive bids from multiple dealers, often resulting in higher offers than dealer part exchange values."
    },
    {
      question: "Can I sell any make or model of car with Newcastle?",
      answer: "Yes! We accept almost all makes and models, including cars on finance, high mileage vehicles, and those with minor damage. Our network of dealers covers a wide range of vehicle types."
    }
  ];

  return (
    <section className="py-10 bg-background rounded-[4rem] mx-4 sm:mx-6 lg:mx-8 my-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 sticky top-8">
              Sell my car FAQs
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Accordion key={index} type="single" collapsible>
                <AccordionItem
                  value={`item-${index}`}
                  className="bg-hero-yellow/30 border-none rounded-2xl px-6 hover:bg-hero-yellow/40 transition-colors duration-300"
                >
                  <AccordionTrigger className="text-left text-base font-semibold hover:no-underline py-5">
                    <span className="flex items-center justify-between w-full pr-4">
                      {faq.question}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-foreground/80 leading-relaxed pb-5">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
