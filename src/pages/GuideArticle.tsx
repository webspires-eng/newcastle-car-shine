import { useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { Link, useParams, Navigate } from "react-router-dom";
import { CtaSection } from "@/components/CtaSection";

const GuideArticle = () => {
  const { slug } = useParams();

  const guides = [
    {
      slug: "how-to-sell-a-car-complete-guide",
      title: "How to Sell a Car: The Complete Step-by-Step Guide",
      date: "January 15, 2025",
      category: "Getting Started",
      readTime: "8 min read",
      excerpt: "Everything you need to know about selling your car, from preparation to finalizing the sale.",
      content: `
        <h2>Getting Started with Selling Your Car</h2>
        <p>Selling your car can seem daunting, but with the right preparation and knowledge, it can be a straightforward process. This comprehensive guide will walk you through every step of selling your car, ensuring you get the best price and a smooth transaction.</p>
        
        <h2>Step 1: Prepare Your Vehicle</h2>
        <p>Before listing your car for sale, it's crucial to prepare it properly. Start with a thorough cleaning, both inside and out. Consider professional detailing to make your car look its best. Check for any minor issues that can be easily fixed, as these small investments can significantly increase your car's value.</p>
        
        <h2>Step 2: Gather Your Documents</h2>
        <p>Having all necessary documents ready is essential. You'll need:</p>
        <ul>
          <li>V5C registration document (logbook)</li>
          <li>Service history and MOT certificates</li>
          <li>Owner's manual and spare keys</li>
          <li>Any warranty documents</li>
        </ul>
        
        <h2>Step 3: Get Your Car Valued</h2>
        <p>Understanding your car's worth is crucial for setting a realistic price. Use online valuation tools and compare similar vehicles in your area. Consider factors like mileage, condition, and market demand.</p>
        
        <h2>Step 4: Choose Your Selling Method</h2>
        <p>You have several options when selling your car:</p>
        <ul>
          <li><strong>Car buying services:</strong> Quick and convenient, though may offer slightly lower prices</li>
          <li><strong>Private sale:</strong> Potentially higher price but requires more time and effort</li>
          <li><strong>Part exchange:</strong> Convenient if buying another car, but may not get the best price</li>
        </ul>
        
        <h2>Step 5: Complete the Sale</h2>
        <p>Once you've found a buyer, ensure all paperwork is completed correctly. Transfer ownership via the DVLA, cancel your insurance, and claim any remaining road tax. Keep records of the sale for your protection.</p>
        
        <h2>Conclusion</h2>
        <p>Selling your car doesn't have to be complicated. With proper preparation, realistic pricing, and attention to paperwork, you can achieve a successful sale. If you want a quick and hassle-free experience, consider using a professional car buying service.</p>
      `
    },
    {
      slug: "documents-needed-to-sell-car",
      title: "What Documents Do I Need to Sell My Car?",
      date: "January 10, 2025",
      category: "Paperwork",
      readTime: "5 min read",
      excerpt: "A comprehensive checklist of all the documents required to sell your car legally in the UK.",
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
        <ul>
          <li>Notify the DVLA of the sale</li>
          <li>Cancel your car insurance</li>
          <li>Claim back any remaining road tax</li>
          <li>Keep a receipt or proof of sale</li>
        </ul>
      `
    },
    {
      slug: "get-best-price-for-car",
      title: "How to Get the Best Price for Your Car",
      date: "January 5, 2025",
      category: "Valuation",
      readTime: "6 min read",
      excerpt: "Top tips to maximize your car's value and get the best offers.",
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
        <p>Research similar vehicles in your area to understand realistic pricing. Use multiple valuation tools online and consider factors like:</p>
        <ul>
          <li>Current mileage and annual average</li>
          <li>Overall condition and any modifications</li>
          <li>Service history completeness</li>
          <li>Number of previous owners</li>
          <li>Local market demand</li>
        </ul>
        
        <h2>Transparent Communication</h2>
        <p>Be honest about your car's condition and history. Buyers appreciate transparency and are more likely to pay a fair price when they trust the seller. Disclose any known issues upfront to avoid complications later.</p>
        
        <h2>Professional Photography</h2>
        <p>If listing your car online, high-quality photos are essential. Take pictures in good lighting, from multiple angles, and include interior shots. Clean the car thoroughly before photographing.</p>
      `
    },
    {
      slug: "understanding-car-valuation",
      title: "Understanding Car Valuation: What Affects Your Car's Worth?",
      date: "December 28, 2024",
      category: "Valuation",
      readTime: "7 min read",
      excerpt: "Discover the key factors that determine your car's value.",
      content: `
        <h2>What Determines Your Car's Value?</h2>
        <p>Understanding car valuation helps you set realistic expectations and get the best possible price. Multiple factors influence how much your car is worth in today's market.</p>
        
        <h2>Mileage</h2>
        <p>Mileage is one of the most significant factors affecting value. The UK average is around 7,500-10,000 miles per year. Higher mileage typically means lower value, though a well-maintained high-mileage car can still be worth good money.</p>
        
        <h2>Age and Depreciation</h2>
        <p>Cars lose value as they age, with the steepest depreciation occurring in the first three years. However, classic cars can appreciate, and some models hold their value better than others.</p>
        
        <h2>Condition</h2>
        <p>Overall condition significantly impacts value. This includes:</p>
        <ul>
          <li>Bodywork and paintwork quality</li>
          <li>Interior wear and cleanliness</li>
          <li>Mechanical condition</li>
          <li>Tire condition and tread depth</li>
        </ul>
        
        <h2>Service History</h2>
        <p>A complete service history from reputable garages adds substantial value. It proves the car has been properly maintained and can prevent mechanical issues.</p>
        
        <h2>Market Demand</h2>
        <p>Supply and demand affect car values. Popular models in desirable colors and specifications command higher prices. Current fuel prices can also impact demand for certain vehicle types.</p>
        
        <h2>Previous Owners</h2>
        <p>Fewer previous owners generally means higher value. Cars with one or two owners are typically more desirable than those with multiple owners.</p>
        
        <h2>Modifications</h2>
        <p>While some modifications can increase value for specific buyers, most aftermarket changes can decrease a car's worth or narrow its appeal.</p>
      `
    },
    {
      slug: "selling-car-with-outstanding-finance",
      title: "Selling a Car with Outstanding Finance",
      date: "December 20, 2024",
      category: "Finance",
      readTime: "6 min read",
      excerpt: "Learn about your options and the correct process for settling outstanding finance.",
      content: `
        <h2>Can You Sell a Car with Finance?</h2>
        <p>Yes, you can sell a car with outstanding finance, but you must follow the correct legal process. Selling without settling the finance first is illegal and can have serious consequences.</p>
        
        <h2>Check Your Finance Agreement</h2>
        <p>First, understand what type of finance you have:</p>
        <ul>
          <li><strong>Hire Purchase (HP):</strong> You don't own the car until final payment</li>
          <li><strong>Personal Contract Purchase (PCP):</strong> Similar to HP with a balloon payment</li>
          <li><strong>Personal Loan:</strong> You own the car, but the loan must be repaid</li>
        </ul>
        
        <h2>Get a Settlement Figure</h2>
        <p>Contact your finance company to get an up-to-date settlement figure. This is the amount needed to pay off the finance completely. Factor in any early settlement fees.</p>
        
        <h2>Options for Selling</h2>
        <p><strong>Option 1: Pay Off the Finance First</strong><br/>
        If possible, settle the finance before selling. This makes the process much simpler and gives you full ownership.</p>
        
        <p><strong>Option 2: Use Sale Proceeds</strong><br/>
        If the car's value exceeds the settlement figure, you can use the sale proceeds to pay off the finance. The buyer pays you, you pay the finance company, and keep the difference.</p>
        
        <p><strong>Option 3: Car Buying Service</strong><br/>
        Many car buying services will handle the finance settlement directly, making the process hassle-free for you.</p>
        
        <h2>Negative Equity</h2>
        <p>If you owe more than the car is worth (negative equity), you'll need to make up the difference. Consider waiting, making extra payments, or rolling the negative equity into a new finance agreement if purchasing another car.</p>
        
        <h2>Important Warnings</h2>
        <p>Never sell a car with finance without settling it first. This is illegal and the finance company can repossess the vehicle from the new owner. Always be transparent with buyers about any finance.</p>
      `
    },
    {
      slug: "preparing-car-for-sale-checklist",
      title: "Preparing Your Car for Sale: A Detailed Checklist",
      date: "December 15, 2024",
      category: "Preparation",
      readTime: "8 min read",
      excerpt: "Follow our checklist to get your car sale-ready and attractive to buyers.",
      content: `
        <h2>Complete Pre-Sale Preparation Checklist</h2>
        <p>Proper preparation can significantly increase your car's value and appeal. Follow this comprehensive checklist to ensure your vehicle is in the best possible condition.</p>
        
        <h2>Cleaning and Detailing</h2>
        <p><strong>Exterior:</strong></p>
        <ul>
          <li>Wash and wax the bodywork</li>
          <li>Clean wheels and tires thoroughly</li>
          <li>Polish headlights and taillights</li>
          <li>Clean windows inside and out</li>
          <li>Touch up minor paint chips if possible</li>
        </ul>
        
        <p><strong>Interior:</strong></p>
        <ul>
          <li>Vacuum seats, carpets, and boot</li>
          <li>Clean and condition leather seats</li>
          <li>Wipe down all surfaces and dashboard</li>
          <li>Clean floor mats or replace if necessary</li>
          <li>Remove personal items and air fresheners</li>
        </ul>
        
        <h2>Mechanical Checks</h2>
        <ul>
          <li>Check all fluid levels (oil, coolant, brake fluid, windscreen wash)</li>
          <li>Test all lights and replace any faulty bulbs</li>
          <li>Check tire pressure and tread depth</li>
          <li>Test wipers and replace if worn</li>
          <li>Ensure battery is in good condition</li>
        </ul>
        
        <h2>Documentation</h2>
        <ul>
          <li>Gather all service records and receipts</li>
          <li>Locate V5C registration document</li>
          <li>Find MOT certificates</li>
          <li>Collect owner's manual and service book</li>
          <li>Have all keys ready (including spares)</li>
        </ul>
        
        <h2>Minor Repairs Worth Doing</h2>
        <p>Some small fixes can significantly improve saleability:</p>
        <ul>
          <li>Repair minor dents and scratches</li>
          <li>Fix non-working features (radio, air conditioning, etc.)</li>
          <li>Replace worn wiper blades</li>
          <li>Address any warning lights on dashboard</li>
        </ul>
        
        <h2>Final Presentation</h2>
        <p>Before showing your car to potential buyers:</p>
        <ul>
          <li>Park in a clean, well-lit area</li>
          <li>Have all documents organized and ready</li>
          <li>Prepare a list of the car's features and recent maintenance</li>
          <li>Be ready to answer questions honestly</li>
        </ul>
      `
    },
    {
      slug: "private-sale-vs-car-buying-service",
      title: "Private Sale vs. Car Buying Service: Which is Best?",
      date: "December 10, 2024",
      category: "Getting Started",
      readTime: "7 min read",
      excerpt: "Compare the pros and cons of selling privately versus using a car buying service.",
      content: `
        <h2>Choosing the Right Selling Method</h2>
        <p>Deciding how to sell your car depends on your priorities: do you want the highest price, the quickest sale, or the least hassle? Let's compare your options.</p>
        
        <h2>Private Sale</h2>
        <p><strong>Advantages:</strong></p>
        <ul>
          <li>Potentially the highest sale price</li>
          <li>Direct negotiation with buyers</li>
          <li>Control over the sale process and timeline</li>
          <li>No commission fees</li>
        </ul>
        
        <p><strong>Disadvantages:</strong></p>
        <ul>
          <li>Time-consuming to advertise and show the car</li>
          <li>Dealing with time-wasters and test drivers</li>
          <li>Security concerns with unknown buyers</li>
          <li>Handling paperwork yourself</li>
          <li>Payment risks (fraud, bounced checks)</li>
        </ul>
        
        <h2>Car Buying Service</h2>
        <p><strong>Advantages:</strong></p>
        <ul>
          <li>Quick, hassle-free sale (often within 24 hours)</li>
          <li>Safe, secure transaction</li>
          <li>No advertising or viewings needed</li>
          <li>Immediate payment guaranteed</li>
          <li>They handle all paperwork</li>
          <li>Free collection from your door</li>
        </ul>
        
        <p><strong>Disadvantages:</strong></p>
        <ul>
          <li>May offer slightly less than private sale</li>
          <li>Less room for negotiation</li>
          <li>Must accept their valuation or decline</li>
        </ul>
        
        <h2>Part Exchange</h2>
        <p><strong>Advantages:</strong></p>
        <ul>
          <li>Convenient when buying another car</li>
          <li>Dealer handles all paperwork</li>
          <li>May reduce VAT on new car purchase</li>
        </ul>
        
        <p><strong>Disadvantages:</strong></p>
        <ul>
          <li>Usually the lowest price option</li>
          <li>Limited to dealer's valuation</li>
          <li>Less transparent pricing</li>
        </ul>
        
        <h2>Which Should You Choose?</h2>
        <p><strong>Choose Private Sale if:</strong> You have time, want maximum money, and don't mind the hassle of viewings and negotiations.</p>
        
        <p><strong>Choose Car Buying Service if:</strong> You want a quick, secure sale with minimal effort and guaranteed payment.</p>
        
        <p><strong>Choose Part Exchange if:</strong> You're buying another car from a dealer and convenience is more important than getting the absolute best price.</p>
      `
    },
    {
      slug: "how-long-to-sell-car",
      title: "How Long Does It Take to Sell a Car?",
      date: "December 5, 2024",
      category: "Timeline",
      readTime: "5 min read",
      excerpt: "Realistic timelines for selling your car through different methods.",
      content: `
        <h2>Typical Timelines for Selling Your Car</h2>
        <p>The time it takes to sell a car varies significantly depending on the method you choose and various market factors. Here's what to expect.</p>
        
        <h2>Car Buying Service: Same Day to 48 Hours</h2>
        <p>This is the fastest option. Most car buying services can complete the transaction within 24-48 hours:</p>
        <ul>
          <li><strong>Day 1:</strong> Get online valuation, book appointment</li>
          <li><strong>Day 2:</strong> Vehicle inspection, instant offer, immediate payment</li>
        </ul>
        
        <h2>Private Sale: 2-8 Weeks Average</h2>
        <p>Private sales take longer but can achieve higher prices:</p>
        <ul>
          <li><strong>Week 1:</strong> Preparation, photos, creating listings</li>
          <li><strong>Weeks 2-4:</strong> Viewings, negotiations, dealing with enquiries</li>
          <li><strong>Weeks 4-6:</strong> Final negotiations, completing paperwork</li>
          <li><strong>Weeks 6-8:</strong> Awaiting payment, finalizing transfer</li>
        </ul>
        
        <h2>Part Exchange: 1-7 Days</h2>
        <p>Part exchange is quick but typically offers the lowest price:</p>
        <ul>
          <li><strong>Day 1:</strong> Dealer valuation</li>
          <li><strong>Days 2-7:</strong> Paperwork and collection (when purchasing new car)</li>
        </ul>
        
        <h2>Factors That Affect Sale Time</h2>
        <p><strong>Car-Related Factors:</strong></p>
        <ul>
          <li>Desirability and popularity of model</li>
          <li>Condition and mileage</li>
          <li>Price competitiveness</li>
          <li>Complete documentation and history</li>
        </ul>
        
        <p><strong>Market Factors:</strong></p>
        <ul>
          <li>Time of year (seasonal demand)</li>
          <li>Local market conditions</li>
          <li>Economic climate</li>
          <li>Number of similar cars available</li>
        </ul>
        
        <h2>How to Speed Up the Process</h2>
        <ul>
          <li>Price competitively from the start</li>
          <li>Have all paperwork ready</li>
          <li>Present the car in excellent condition</li>
          <li>Be flexible with viewing times</li>
          <li>Respond quickly to enquiries</li>
          <li>Consider multiple selling platforms</li>
        </ul>
        
        <h2>When Speed Matters</h2>
        <p>If you need to sell quickly (moving abroad, need money urgently, etc.), a car buying service is your best option. While you might get slightly less money than a private sale, the guaranteed quick completion and hassle-free process often make it worthwhile.</p>
      `
    },
    {
      slug: "tax-insurance-after-selling-car",
      title: "Tax and Insurance: What to Do After Selling Your Car",
      date: "November 28, 2024",
      category: "Paperwork",
      readTime: "6 min read",
      excerpt: "Important steps to take after your car is sold, including canceling insurance and claiming tax refunds.",
      content: `
        <h2>Essential Post-Sale Tasks</h2>
        <p>Selling your car isn't complete until you've handled the administrative tasks. Follow these steps to ensure everything is properly finalized.</p>
        
        <h2>Notify the DVLA</h2>
        <p>This is crucial and must be done immediately after the sale:</p>
        <ul>
          <li>Complete the V5C/2 section (keep the top part) and send it to DVLA</li>
          <li>Give the V5C/3 section to the buyer as proof of purchase</li>
          <li>You can also notify DVLA online at gov.uk/sold-bought-vehicle</li>
          <li>Keep the green V5C/2 section for your records</li>
        </ul>
        
        <h2>Cancel Your Car Insurance</h2>
        <p>Contact your insurance company immediately after the sale:</p>
        <ul>
          <li>Tell them the exact date and time you sold the car</li>
          <li>You may be entitled to a refund for unused months</li>
          <li>Check for any cancellation fees in your policy</li>
          <li>Get written confirmation of cancellation</li>
          <li>Ask for a no-claims bonus certificate for future use</li>
        </ul>
        
        <h2>Claim Back Vehicle Tax</h2>
        <p>Road tax is not transferable to the new owner:</p>
        <ul>
          <li>DVLA automatically cancels the tax when you notify them of the sale</li>
          <li>You'll receive a refund for any full months remaining</li>
          <li>The refund is usually sent as a check within 4-6 weeks</li>
          <li>Ensure your address is up to date with DVLA</li>
        </ul>
        
        <h2>Direct Debit and Payments</h2>
        <p>If you pay tax or insurance by direct debit:</p>
        <ul>
          <li>Cancel any direct debits for the sold vehicle</li>
          <li>Check your bank statements to confirm cancellations</li>
          <li>Update your records for the refund</li>
        </ul>
        
        <h2>Keep Records</h2>
        <p>Maintain documentation of the sale:</p>
        <ul>
          <li>Keep the V5C/2 section</li>
          <li>Save any sale agreement or receipt</li>
          <li>Store correspondence with the buyer</li>
          <li>Keep these for at least 6 months after the sale</li>
        </ul>
        
        <h2>What If Something Goes Wrong?</h2>
        <p>If the buyer doesn't register the vehicle, you could receive parking fines or speeding tickets. Contact DVLA immediately if this happens and provide proof that you sold the vehicle.</p>
        
        <h2>Final Checklist</h2>
        <ul>
          <li>✓ DVLA notified via V5C/2 or online</li>
          <li>✓ Insurance cancelled and refund claimed</li>
          <li>✓ Road tax automatically refunded</li>
          <li>✓ Direct debits cancelled</li>
          <li>✓ Sale documentation safely stored</li>
        </ul>
      `
    },
    {
      slug: "selling-older-high-mileage-cars",
      title: "Selling an Older Car: Tips for High-Mileage Vehicles",
      date: "November 20, 2024",
      category: "Specialist",
      readTime: "7 min read",
      excerpt: "Learn how to highlight the value in high-mileage vehicles and find the right buyers.",
      content: `
        <h2>Selling High-Mileage Cars Successfully</h2>
        <p>Older, high-mileage cars require a different selling approach. While they may not command premium prices, there's definitely a market for well-maintained older vehicles.</p>
        
        <h2>Emphasize Maintenance History</h2>
        <p>For older cars, maintenance history is crucial:</p>
        <ul>
          <li>Gather all service records and receipts</li>
          <li>Highlight recent repairs and replacements</li>
          <li>Document any major component overhauls</li>
          <li>Show proof of regular servicing</li>
        </ul>
        
        <h2>Be Realistic About Pricing</h2>
        <p>Research the market carefully:</p>
        <ul>
          <li>Look at similar age and mileage vehicles</li>
          <li>Consider condition over age</li>
          <li>Price competitively to attract buyers quickly</li>
          <li>Be prepared to negotiate</li>
        </ul>
        
        <h2>Target the Right Buyers</h2>
        <p>Different buyers look for different things in older cars:</p>
        <ul>
          <li><strong>Budget buyers:</strong> Looking for reliable transport at low cost</li>
          <li><strong>First-time drivers:</strong> Want affordable insurance and running costs</li>
          <li><strong>Practical buyers:</strong> Need a work vehicle or second car</li>
          <li><strong>Enthusiasts:</strong> May want older models for restoration or collecting</li>
        </ul>
        
        <h2>Highlight Positive Aspects</h2>
        <p>Focus on your car's strengths:</p>
        <ul>
          <li>Low running costs and insurance</li>
          <li>Proven reliability of the model</li>
          <li>Recent MOT pass</li>
          <li>New parts or recent servicing</li>
          <li>Good fuel economy</li>
          <li>Practical features and space</li>
        </ul>
        
        <h2>Be Honest About Issues</h2>
        <p>Transparency builds trust:</p>
        <ul>
          <li>Disclose any known faults</li>
          <li>Mention advisory items from last MOT</li>
          <li>Explain any cosmetic damage</li>
          <li>Be clear about what works and what doesn't</li>
        </ul>
        
        <h2>Consider Professional Valuation</h2>
        <p>For older cars, car buying services can be ideal:</p>
        <ul>
          <li>Quick sale without hassle</li>
          <li>Fair valuation based on actual condition</li>
          <li>No risk from unknown buyers</li>
          <li>Guaranteed payment</li>
        </ul>
        
        <h2>Make It Presentable</h2>
        <p>Even older cars should look their best:</p>
        <ul>
          <li>Clean thoroughly inside and out</li>
          <li>Fix minor issues if cost-effective</li>
          <li>Address any unpleasant odors</li>
          <li>Take quality photos in good lighting</li>
        </ul>
        
        <h2>Selling Options for Older Cars</h2>
        <p><strong>Scrap value:</strong> If the car isn't roadworthy, consider scrapping for the metal value.</p>
        <p><strong>Spares or repair:</strong> Non-running cars can be sold to mechanics or enthusiasts.</p>
        <p><strong>Classic potential:</strong> Some older cars may have classic or future classic appeal.</p>
      `
    },
    {
      slug: "selling-electric-hybrid-cars",
      title: "Electric and Hybrid Cars: Special Considerations When Selling",
      date: "November 15, 2024",
      category: "Specialist",
      readTime: "8 min read",
      excerpt: "The unique factors to consider when selling electric or hybrid vehicles.",
      content: `
        <h2>Selling Electric and Hybrid Vehicles</h2>
        <p>Electric and hybrid cars have unique considerations when selling. Understanding these factors helps you present your vehicle effectively and get the best price.</p>
        
        <h2>Battery Health is Crucial</h2>
        <p>The battery is the most valuable component:</p>
        <ul>
          <li>Obtain a battery health report if possible</li>
          <li>Electric vehicles often have diagnostic reports showing battery degradation</li>
          <li>Document charging history and habits</li>
          <li>Mention warranty status on battery</li>
          <li>Be transparent about range reduction</li>
        </ul>
        
        <h2>Charging History and Equipment</h2>
        <p>Include information about charging:</p>
        <ul>
          <li>Type of charging typically used (home, public, rapid)</li>
          <li>Include any charging cables and adaptors</li>
          <li>Mention if home charger is included</li>
          <li>Document any charging membership cards</li>
        </ul>
        
        <h2>Warranty and Service Plans</h2>
        <p>Electric vehicles often have extensive warranties:</p>
        <ul>
          <li>Check remaining manufacturer warranty</li>
          <li>Battery warranty is usually longer than vehicle warranty</li>
          <li>Mention any transferable service plans</li>
          <li>Document all software updates performed</li>
        </ul>
        
        <h2>Range and Performance Data</h2>
        <p>Be accurate about real-world performance:</p>
        <ul>
          <li>State real-world range, not just manufacturer claims</li>
          <li>Explain typical range in different conditions</li>
          <li>Mention any range anxiety concerns honestly</li>
          <li>Highlight efficiency figures</li>
        </ul>
        
        <h2>Government Grants and Incentives</h2>
        <p>Some benefits may transfer to new owners:</p>
        <ul>
          <li>Check if any grants or incentives are transferable</li>
          <li>Mention potential company car tax benefits</li>
          <li>Highlight lower running costs</li>
          <li>Note eligibility for clean air zones</li>
        </ul>
        
        <h2>Technology and Features</h2>
        <p>EVs often have advanced technology:</p>
        <ul>
          <li>Highlight autonomous features</li>
          <li>Mention software update history</li>
          <li>Document connected services subscriptions</li>
          <li>Explain any smart features or apps</li>
        </ul>
        
        <h2>Market Considerations</h2>
        <p>The EV market is evolving rapidly:</p>
        <ul>
          <li>Newer models have better range, affecting used values</li>
          <li>Charging infrastructure is improving</li>
          <li>Government policy changes can affect demand</li>
          <li>Brand reputation for battery longevity matters</li>
        </ul>
        
        <h2>Hybrid-Specific Points</h2>
        <p>For hybrid vehicles:</p>
        <ul>
          <li>Explain the type of hybrid (mild, full, plug-in)</li>
          <li>Document both electric and petrol economy</li>
          <li>Mention typical electric-only range (PHEVs)</li>
          <li>Show maintenance history of both systems</li>
        </ul>
        
        <h2>Target the Right Buyers</h2>
        <p>EV and hybrid buyers often have specific priorities:</p>
        <ul>
          <li>Environmental consciousness</li>
          <li>Lower running costs</li>
          <li>Technology enthusiasts</li>
          <li>Company car tax benefits</li>
        </ul>
      `
    },
    {
      slug: "avoiding-car-selling-scams",
      title: "Avoiding Scams When Selling Your Car",
      date: "November 10, 2024",
      category: "Safety",
      readTime: "7 min read",
      excerpt: "Protect yourself from common car selling scams and ensure a safe transaction.",
      content: `
        <h2>Protecting Yourself from Car Selling Scams</h2>
        <p>Unfortunately, car selling scams are common. Being aware of red flags and taking precautions can protect you from fraudsters and ensure a safe transaction.</p>
        
        <h2>Common Scams to Watch For</h2>
        
        <h3>1. The Overpayment Scam</h3>
        <p>The buyer sends a check or bank transfer for more than the agreed price, then asks you to refund the difference. The original payment later bounces, leaving you out of pocket.</p>
        <p><strong>Protection:</strong> Never accept more than the agreed price. Wait for payments to fully clear before handing over the car.</p>
        
        <h3>2. The Fake Bank Transfer</h3>
        <p>Buyers show fake payment confirmation screens or emails claiming they've transferred money.</p>
        <p><strong>Protection:</strong> Always verify payments in your own banking app or website. Don't rely on screenshots or emails.</p>
        
        <h3>3. The Test Drive Theft</h3>
        <p>Buyers take the car for a test drive and never return, often using fake identification.</p>
        <p><strong>Protection:</strong> Always accompany buyers on test drives. Check and copy their driving license first. Consider asking for collateral (their car keys).</p>
        
        <h3>4. The Cloned Cashier's Check</h3>
        <p>Fraudulent official-looking checks that initially clear but are later identified as fake.</p>
        <p><strong>Protection:</strong> Accept bank transfers or cash only. If accepting a check, wait several days for it to fully clear.</p>
        
        <h3>5. The Sob Story Scam</h3>
        <p>Buyers create urgency with emotional stories to pressure you into rushing the sale and skipping safety checks.</p>
        <p><strong>Protection:</strong> Never let emotions override proper procedure. Genuine buyers will understand your caution.</p>
        
        <h2>Red Flags to Watch For</h2>
        <ul>
          <li>Buyers who want to pay more than asking price</li>
          <li>Pressure to complete the sale urgently</li>
          <li>Requests to ship the car abroad immediately</li>
          <li>Inability to view the car in person</li>
          <li>Overly complicated payment methods</li>
          <li>Poor communication or grammar in messages</li>
          <li>Reluctance to provide ID or contact details</li>
        </ul>
        
        <h2>Safe Selling Practices</h2>
        
        <h3>Payment Safety</h3>
        <ul>
          <li>Bank transfer is safest (verify in your account)</li>
          <li>For cash, meet at a bank and verify notes</li>
          <li>Never accept personal checks</li>
          <li>Don't hand over the car until payment clears</li>
        </ul>
        
        <h3>Meeting Safety</h3>
        <ul>
          <li>Meet in public, well-lit places</li>
          <li>Bring someone with you</li>
          <li>Tell others where you're going</li>
          <li>Keep your phone charged</li>
          <li>Trust your instincts</li>
        </ul>
        
        <h3>Document Safety</h3>
        <ul>
          <li>Never hand over V5C until payment clears</li>
          <li>Make copies of buyer's ID</li>
          <li>Keep records of all correspondence</li>
          <li>Write a receipt with both signatures</li>
        </ul>
        
        <h2>If You Suspect a Scam</h2>
        <ul>
          <li>Stop communication immediately</li>
          <li>Report to Action Fraud (0300 123 2040)</li>
          <li>Contact your bank if money is involved</li>
          <li>Report to the platform where you listed the car</li>
          <li>Keep all evidence (emails, messages, photos)</li>
        </ul>
        
        <h2>The Safest Option</h2>
        <p>Using a reputable car buying service eliminates most scam risks. They provide secure, guaranteed payment and handle everything professionally. While you may get slightly less than a private sale, the peace of mind is often worth it.</p>
      `
    }
  ];

  const guide = guides.find(g => g.slug === slug);

  useEffect(() => {
    document.title = guide
      ? `${guide.title} | Sell My Car Newcastle`
      : "Guide Not Found | Sell My Car Newcastle";
  }, [guide]);

  if (!guide) {
    return <Navigate to="/guides" replace />;
  }

  return (
    <div className="min-h-screen">
      <Header />

      <main>
        {/* Breadcrumb */}
        <div className="bg-muted/30 py-4 border-b">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
              <span>/</span>
              <Link to="/guides" className="hover:text-foreground transition-colors">Guides</Link>
              <span>/</span>
              <span className="text-foreground">{guide.category}</span>
            </div>
          </div>
        </div>

        {/* Article Header */}
        <article className="py-12 sm:py-16 lg:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <Link
                to="/guides"
                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8 font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to guides
              </Link>

              <div className="mb-8">
                <div className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
                  {guide.category}
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-6">
                  {guide.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{guide.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{guide.readTime}</span>
                  </div>
                </div>
              </div>

              {/* Article Content */}
              <div
                className="prose prose-lg max-w-none prose-headings:font-display prose-headings:font-bold prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4 prose-p:mb-6 prose-ul:mb-6 prose-li:mb-2"
                dangerouslySetInnerHTML={{ __html: guide.content }}
              />

              {/* Author CTA */}
              <div className="mt-16 p-8 bg-muted/30 rounded-xl border">
                <h3 className="text-2xl font-display font-bold mb-4">Ready to sell your car?</h3>
                <p className="text-muted-foreground mb-6">
                  Get an instant online valuation and receive a competitive offer within minutes. We make selling your car quick, easy, and hassle-free.
                </p>
                <Button size="lg" className="font-medium">
                  Get Your Free Valuation
                </Button>
              </div>
            </div>
          </div>
        </article>

        <CtaSection />
      </main>

      <Footer />
    </div>
  );
};

export default GuideArticle;
