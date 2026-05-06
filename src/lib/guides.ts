export interface Guide {
  slug: string;
  title: string;
  description: string;
  category: string;
  date: string;
  readTime?: string;
  content: string;
}

export const guides: Guide[] = [
  {
    slug: "how-to-sell-a-car-complete-guide",
    title: "How to Sell a Car: The Complete Step-by-Step Guide",
    date: "January 15, 2025",
    category: "Getting Started",
    readTime: "8 min read",
    description:
      "Everything you need to know about selling your car, from preparation to finalizing the sale.",
    content: `
      <h2>Getting Started with Selling Your Car</h2>
      <p>Selling your car can seem daunting, but with the right preparation and knowledge, it can be a straightforward process. This comprehensive guide will walk you through every step of selling your car, ensuring you get the best price and a smooth transaction.</p>
      <h2>Step 1: Prepare Your Vehicle</h2>
      <p>Before listing your car for sale, it's crucial to prepare it properly. Start with a thorough cleaning, both inside and out. Consider professional detailing to make your car look its best. Check for any minor issues that can be easily fixed, as these small investments can significantly increase your car's value.</p>
      <h2>Step 2: Gather Your Documents</h2>
      <p>Having all necessary documents ready is essential. You'll need:</p>
      <ul><li>V5C registration document (logbook)</li><li>Service history and MOT certificates</li><li>Owner's manual and spare keys</li><li>Any warranty documents</li></ul>
      <h2>Step 3: Get Your Car Valued</h2>
      <p>Understanding your car's worth is crucial for setting a realistic price. Use online valuation tools and compare similar vehicles in your area. Consider factors like mileage, condition, and market demand.</p>
      <h2>Step 4: Choose Your Selling Method</h2>
      <p>You have several options when selling your car:</p>
      <ul><li><strong>Car buying services:</strong> Quick and convenient, though may offer slightly lower prices</li><li><strong>Private sale:</strong> Potentially higher price but requires more time and effort</li><li><strong>Part exchange:</strong> Convenient if buying another car, but may not get the best price</li></ul>
      <h2>Step 5: Complete the Sale</h2>
      <p>Once you've found a buyer, ensure all paperwork is completed correctly. Transfer ownership via the DVLA, cancel your insurance, and claim any remaining road tax. Keep records of the sale for your protection.</p>
      <h2>Conclusion</h2>
      <p>Selling your car doesn't have to be complicated. With proper preparation, realistic pricing, and attention to paperwork, you can achieve a successful sale. If you want a quick and hassle-free experience, consider using a professional car buying service.</p>
    `,
  },
  {
    slug: "documents-needed-to-sell-car",
    title: "What Documents Do I Need to Sell My Car?",
    date: "January 10, 2025",
    category: "Paperwork",
    readTime: "5 min read",
    description: "A comprehensive checklist of all the documents required to sell your car legally in the UK.",
    content: `
      <h2>Essential Documents for Selling Your Car</h2>
      <p>Having the right paperwork is crucial when selling your car in the UK. Missing documents can delay the sale or even make it impossible to complete legally. Here's everything you need to know.</p>
      <h2>The V5C Registration Document (Logbook)</h2>
      <p>The V5C is the most important document you'll need. This proves you're the registered keeper of the vehicle. You'll need to complete the V5C/2 section when you sell and send it to the DVLA. Give the V5C/3 section to the buyer as proof of purchase until they receive their new V5C.</p>
      <h2>MOT Certificates</h2>
      <p>If your car is over three years old, it must have a valid MOT certificate. Keep all recent MOT certificates to show the vehicle's history. This demonstrates how the car has been maintained and any previous advisories.</p>
      <h2>Service History</h2>
      <p>A full service history can significantly increase your car's value. Gather all service records, receipts for parts and repairs, and any warranty documents. This proves the car has been well-maintained and cared for.</p>
      <h2>Owner's Manual and Spare Keys</h2>
      <p>Having the original owner's manual and all spare keys makes your car more attractive to buyers. If you've lost these items, it's worth getting replacements before selling.</p>
      <h2>Finance Settlement Letter</h2>
      <p>If there's outstanding finance on your car, you'll need a settlement letter from your finance company. This shows how much needs to be paid to clear the finance before the sale can proceed.</p>
      <h2>Important Actions After Selling</h2>
      <p>Don't forget to:</p>
      <ul><li>Notify the DVLA of the sale</li><li>Cancel your car insurance</li><li>Claim back any remaining road tax</li><li>Keep a receipt or proof of sale</li></ul>
    `,
  },
  {
    slug: "get-best-price-for-car",
    title: "How to Get the Best Price for Your Car",
    date: "January 5, 2025",
    category: "Valuation",
    readTime: "6 min read",
    description: "Top tips to maximize your car's value and get the best offers.",
    content: `
      <h2>Maximizing Your Car's Value</h2>
      <p>Getting the best price for your car requires preparation, timing, and smart marketing. Follow these proven strategies to maximize your vehicle's value.</p>
      <h2>First Impressions Matter</h2>
      <p>A clean, well-presented car can fetch hundreds of pounds more than one that looks neglected. Invest in professional valeting or spend time thoroughly cleaning both the interior and exterior. Fix minor cosmetic issues like scratches or dents if the cost is reasonable.</p>
      <h2>Timing Your Sale</h2>
      <p>When you sell can significantly affect the price you receive. Convertibles sell better in spring and summer, while 4x4s are in higher demand during winter. Consider market trends and seasonal factors when timing your sale.</p>
      <h2>Complete Service History</h2>
      <p>A full service history from reputable garages adds significant value. If your car is due for service soon, consider getting it done before selling. The investment often pays for itself in the higher price you can command.</p>
      <h2>Know Your Car's True Value</h2>
      <p>Research similar vehicles in your area to understand realistic pricing. Use multiple valuation tools online and consider factors like mileage, condition, service history, previous owners, and local market demand.</p>
      <h2>Transparent Communication</h2>
      <p>Be honest about your car's condition and history. Buyers appreciate transparency and are more likely to pay a fair price when they trust the seller.</p>
      <h2>Professional Photography</h2>
      <p>If listing your car online, high-quality photos are essential. Take pictures in good lighting, from multiple angles, and include interior shots.</p>
    `,
  },
  {
    slug: "understanding-car-valuation",
    title: "Understanding Car Valuation: What Affects Your Car's Worth?",
    date: "December 28, 2024",
    category: "Valuation",
    readTime: "7 min read",
    description: "Discover the key factors that determine your car's value.",
    content: `
      <h2>What Determines Your Car's Value?</h2>
      <p>Understanding car valuation helps you set realistic expectations and get the best possible price. Multiple factors influence how much your car is worth in today's market.</p>
      <h2>Mileage</h2>
      <p>Mileage is one of the most significant factors affecting value. The UK average is around 7,500-10,000 miles per year. Higher mileage typically means lower value, though a well-maintained high-mileage car can still be worth good money.</p>
      <h2>Age and Depreciation</h2>
      <p>Cars lose value as they age, with the steepest depreciation occurring in the first three years. However, classic cars can appreciate, and some models hold their value better than others.</p>
      <h2>Condition</h2>
      <p>Overall condition significantly impacts value. This includes bodywork and paintwork, interior wear and cleanliness, mechanical condition, and tire condition.</p>
      <h2>Service History</h2>
      <p>A complete service history from reputable garages adds substantial value. It proves the car has been properly maintained and can prevent mechanical issues.</p>
      <h2>Market Demand</h2>
      <p>Supply and demand affect car values. Popular models in desirable colors and specifications command higher prices.</p>
      <h2>Previous Owners</h2>
      <p>Fewer previous owners generally means higher value. Cars with one or two owners are typically more desirable.</p>
      <h2>Modifications</h2>
      <p>While some modifications can increase value for specific buyers, most aftermarket changes can decrease a car's worth or narrow its appeal.</p>
    `,
  },
  {
    slug: "selling-car-with-outstanding-finance",
    title: "Selling a Car with Outstanding Finance",
    date: "December 20, 2024",
    category: "Finance",
    readTime: "6 min read",
    description: "Learn about your options and the correct process for settling outstanding finance.",
    content: `
      <h2>Can You Sell a Car with Finance?</h2>
      <p>Yes, you can sell a car with outstanding finance, but you must follow the correct legal process. Selling without settling the finance first is illegal and can have serious consequences.</p>
      <h2>Check Your Finance Agreement</h2>
      <p>First, understand what type of finance you have:</p>
      <ul><li><strong>Hire Purchase (HP):</strong> You don't own the car until final payment</li><li><strong>Personal Contract Purchase (PCP):</strong> Similar to HP with a balloon payment</li><li><strong>Personal Loan:</strong> You own the car, but the loan must be repaid</li></ul>
      <h2>Get a Settlement Figure</h2>
      <p>Contact your finance company to get an up-to-date settlement figure. This is the amount needed to pay off the finance completely.</p>
      <h2>Options for Selling</h2>
      <p><strong>Option 1: Pay Off the Finance First.</strong> If possible, settle the finance before selling.</p>
      <p><strong>Option 2: Use Sale Proceeds.</strong> If the car's value exceeds the settlement figure, use proceeds to pay off the finance.</p>
      <p><strong>Option 3: Car Buying Service.</strong> Many car buying services will handle the finance settlement directly.</p>
      <h2>Negative Equity</h2>
      <p>If you owe more than the car is worth, you'll need to make up the difference.</p>
      <h2>Important Warnings</h2>
      <p>Never sell a car with finance without settling it first. This is illegal and the finance company can repossess the vehicle from the new owner.</p>
    `,
  },
  {
    slug: "preparing-car-for-sale-checklist",
    title: "Preparing Your Car for Sale: A Detailed Checklist",
    date: "December 15, 2024",
    category: "Preparation",
    readTime: "8 min read",
    description: "Follow our checklist to get your car sale-ready and attractive to buyers.",
    content: `
      <h2>Complete Pre-Sale Preparation Checklist</h2>
      <p>Proper preparation can significantly increase your car's value and appeal. Follow this comprehensive checklist to ensure your vehicle is in the best possible condition.</p>
      <h2>Cleaning and Detailing</h2>
      <p><strong>Exterior:</strong></p>
      <ul><li>Wash and wax the bodywork</li><li>Clean wheels and tires thoroughly</li><li>Polish headlights and taillights</li><li>Clean windows inside and out</li><li>Touch up minor paint chips if possible</li></ul>
      <p><strong>Interior:</strong></p>
      <ul><li>Vacuum seats, carpets, and boot</li><li>Clean and condition leather seats</li><li>Wipe down all surfaces and dashboard</li><li>Clean floor mats or replace if necessary</li><li>Remove personal items and air fresheners</li></ul>
      <h2>Mechanical Checks</h2>
      <ul><li>Check all fluid levels</li><li>Test all lights and replace any faulty bulbs</li><li>Check tire pressure and tread depth</li><li>Test wipers and replace if worn</li><li>Ensure battery is in good condition</li></ul>
      <h2>Documentation</h2>
      <ul><li>Gather all service records and receipts</li><li>Locate V5C registration document</li><li>Find MOT certificates</li><li>Collect owner's manual and service book</li><li>Have all keys ready</li></ul>
      <h2>Minor Repairs Worth Doing</h2>
      <ul><li>Repair minor dents and scratches</li><li>Fix non-working features</li><li>Replace worn wiper blades</li><li>Address any warning lights on dashboard</li></ul>
      <h2>Final Presentation</h2>
      <ul><li>Park in a clean, well-lit area</li><li>Have all documents organized and ready</li><li>Prepare a list of the car's features</li><li>Be ready to answer questions honestly</li></ul>
    `,
  },
  {
    slug: "private-sale-vs-car-buying-service",
    title: "Private Sale vs. Car Buying Service: Which is Best?",
    date: "December 10, 2024",
    category: "Getting Started",
    readTime: "7 min read",
    description: "Compare the pros and cons of selling privately versus using a car buying service.",
    content: `
      <h2>Choosing the Right Selling Method</h2>
      <p>Deciding how to sell your car depends on your priorities: do you want the highest price, the quickest sale, or the least hassle?</p>
      <h2>Private Sale</h2>
      <p><strong>Advantages:</strong> Potentially the highest sale price, direct negotiation, control over process, no commission fees.</p>
      <p><strong>Disadvantages:</strong> Time-consuming, time-wasters, security concerns, paperwork, payment risks.</p>
      <h2>Car Buying Service</h2>
      <p><strong>Advantages:</strong> Quick sale within 24 hours, secure transaction, no advertising, immediate payment, paperwork handled, free collection.</p>
      <p><strong>Disadvantages:</strong> May offer slightly less than private sale, less negotiation room.</p>
      <h2>Part Exchange</h2>
      <p><strong>Advantages:</strong> Convenient when buying another car, dealer handles paperwork, may reduce VAT.</p>
      <p><strong>Disadvantages:</strong> Usually the lowest price option.</p>
      <h2>Which Should You Choose?</h2>
      <p><strong>Private Sale:</strong> If you have time and want maximum money.</p>
      <p><strong>Car Buying Service:</strong> If you want a quick, secure sale with minimal effort.</p>
      <p><strong>Part Exchange:</strong> If you're buying another car from a dealer.</p>
    `,
  },
  {
    slug: "how-long-to-sell-car",
    title: "How Long Does It Take to Sell a Car?",
    date: "December 5, 2024",
    category: "Timeline",
    readTime: "5 min read",
    description: "Realistic timelines for selling your car through different methods.",
    content: `
      <h2>Typical Timelines for Selling Your Car</h2>
      <p>The time it takes to sell a car varies significantly depending on the method you choose and various market factors.</p>
      <h2>Car Buying Service: Same Day to 48 Hours</h2>
      <p>This is the fastest option. Most car buying services can complete the transaction within 24-48 hours.</p>
      <h2>Private Sale: 2-8 Weeks Average</h2>
      <p>Private sales take longer but can achieve higher prices. Expect preparation, viewings, negotiations, paperwork, and payment confirmation.</p>
      <h2>Part Exchange: 1-7 Days</h2>
      <p>Part exchange is quick but typically offers the lowest price.</p>
      <h2>Factors That Affect Sale Time</h2>
      <p>Desirability of model, condition and mileage, price competitiveness, complete documentation, time of year, local market conditions.</p>
      <h2>How to Speed Up the Process</h2>
      <ul><li>Price competitively from the start</li><li>Have all paperwork ready</li><li>Present the car in excellent condition</li><li>Be flexible with viewing times</li><li>Respond quickly to enquiries</li></ul>
      <h2>When Speed Matters</h2>
      <p>If you need to sell quickly, a car buying service is your best option.</p>
    `,
  },
  {
    slug: "tax-insurance-after-selling-car",
    title: "Tax and Insurance: What to Do After Selling Your Car",
    date: "November 28, 2024",
    category: "Paperwork",
    readTime: "6 min read",
    description: "Important steps to take after your car is sold, including canceling insurance and claiming tax refunds.",
    content: `
      <h2>Essential Post-Sale Tasks</h2>
      <p>Selling your car isn't complete until you've handled the administrative tasks. Follow these steps to ensure everything is properly finalized.</p>
      <h2>Notify the DVLA</h2>
      <ul><li>Complete the V5C/2 section and send it to DVLA</li><li>Give the V5C/3 section to the buyer</li><li>You can also notify DVLA online at gov.uk/sold-bought-vehicle</li><li>Keep the green V5C/2 section for your records</li></ul>
      <h2>Cancel Your Car Insurance</h2>
      <ul><li>Tell them the exact date and time you sold the car</li><li>You may be entitled to a refund for unused months</li><li>Get written confirmation of cancellation</li><li>Ask for a no-claims bonus certificate</li></ul>
      <h2>Claim Back Vehicle Tax</h2>
      <ul><li>DVLA automatically cancels the tax when notified</li><li>You'll receive a refund for any full months remaining</li><li>The refund is usually sent as a check within 4-6 weeks</li></ul>
      <h2>Keep Records</h2>
      <ul><li>Keep the V5C/2 section</li><li>Save any sale agreement or receipt</li><li>Store correspondence with the buyer</li><li>Keep these for at least 6 months after the sale</li></ul>
    `,
  },
  {
    slug: "selling-older-high-mileage-cars",
    title: "Selling an Older Car: Tips for High-Mileage Vehicles",
    date: "November 20, 2024",
    category: "Specialist",
    readTime: "7 min read",
    description: "Learn how to highlight the value in high-mileage vehicles and find the right buyers.",
    content: `
      <h2>Selling High-Mileage Cars Successfully</h2>
      <p>Older, high-mileage cars require a different selling approach. While they may not command premium prices, there's definitely a market for well-maintained older vehicles.</p>
      <h2>Emphasize Maintenance History</h2>
      <ul><li>Gather all service records and receipts</li><li>Highlight recent repairs and replacements</li><li>Document any major component overhauls</li><li>Show proof of regular servicing</li></ul>
      <h2>Be Realistic About Pricing</h2>
      <p>Look at similar age and mileage vehicles, consider condition over age, price competitively to attract buyers, be prepared to negotiate.</p>
      <h2>Target the Right Buyers</h2>
      <ul><li><strong>Budget buyers:</strong> Looking for reliable transport at low cost</li><li><strong>First-time drivers:</strong> Want affordable insurance and running costs</li><li><strong>Practical buyers:</strong> Need a work vehicle</li><li><strong>Enthusiasts:</strong> May want older models for restoration</li></ul>
      <h2>Highlight Positive Aspects</h2>
      <p>Low running costs, proven reliability, recent MOT pass, new parts or recent servicing, good fuel economy.</p>
      <h2>Be Honest About Issues</h2>
      <p>Disclose any known faults, mention advisory items from last MOT, explain cosmetic damage.</p>
      <h2>Selling Options for Older Cars</h2>
      <p><strong>Scrap value, spares or repair, classic potential.</strong></p>
    `,
  },
  {
    slug: "selling-electric-hybrid-cars",
    title: "Electric and Hybrid Cars: Special Considerations When Selling",
    date: "November 15, 2024",
    category: "Specialist",
    readTime: "8 min read",
    description: "The unique factors to consider when selling electric or hybrid vehicles.",
    content: `
      <h2>Selling Electric and Hybrid Vehicles</h2>
      <p>Electric and hybrid cars have unique considerations when selling. Understanding these factors helps you present your vehicle effectively and get the best price.</p>
      <h2>Battery Health is Crucial</h2>
      <ul><li>Obtain a battery health report if possible</li><li>Document charging history and habits</li><li>Mention warranty status on battery</li><li>Be transparent about range reduction</li></ul>
      <h2>Charging History and Equipment</h2>
      <ul><li>Type of charging typically used</li><li>Include any charging cables and adaptors</li><li>Mention if home charger is included</li></ul>
      <h2>Warranty and Service Plans</h2>
      <p>Check remaining manufacturer warranty, battery warranty is usually longer than vehicle warranty.</p>
      <h2>Range and Performance Data</h2>
      <p>State real-world range, not just manufacturer claims. Explain typical range in different conditions.</p>
      <h2>Government Grants and Incentives</h2>
      <p>Some benefits may transfer to new owners, like company car tax benefits and clean air zone eligibility.</p>
      <h2>Hybrid-Specific Points</h2>
      <p>Explain the type of hybrid (mild, full, plug-in), document both electric and petrol economy, mention typical electric-only range for PHEVs.</p>
    `,
  },
  {
    slug: "avoiding-car-selling-scams",
    title: "Avoiding Scams When Selling Your Car",
    date: "November 10, 2024",
    category: "Safety",
    readTime: "7 min read",
    description: "Protect yourself from common car selling scams and ensure a safe transaction.",
    content: `
      <h2>Protecting Yourself from Car Selling Scams</h2>
      <p>Unfortunately, car selling scams are common. Being aware of red flags and taking precautions can protect you from fraudsters.</p>
      <h2>Common Scams to Watch For</h2>
      <h3>The Overpayment Scam</h3>
      <p>The buyer sends a check for more than the agreed price, then asks you to refund the difference. The original payment later bounces.</p>
      <h3>The Fake Bank Transfer</h3>
      <p>Buyers show fake payment confirmation screens. Always verify payments in your own banking app.</p>
      <h3>The Test Drive Theft</h3>
      <p>Buyers take the car for a test drive and never return. Always accompany buyers and check their driving license first.</p>
      <h3>The Cloned Cashier's Check</h3>
      <p>Fraudulent official-looking checks that initially clear but are later identified as fake.</p>
      <h2>Red Flags to Watch For</h2>
      <ul><li>Buyers who want to pay more than asking price</li><li>Pressure to complete the sale urgently</li><li>Requests to ship the car abroad immediately</li><li>Inability to view the car in person</li><li>Overly complicated payment methods</li></ul>
      <h2>Safe Selling Practices</h2>
      <p>Bank transfer is safest. Meet in public, well-lit places. Bring someone with you. Never hand over V5C until payment clears.</p>
      <h2>The Safest Option</h2>
      <p>Using a reputable car buying service eliminates most scam risks. They provide secure, guaranteed payment and handle everything professionally.</p>
    `,
  },
];

export function getAllGuides(): Guide[] {
  return guides;
}

export function getAllGuideSlugs(): string[] {
  return guides.map((g) => g.slug);
}

export function getGuideBySlug(slug: string): Guide | undefined {
  return guides.find((g) => g.slug === slug);
}
