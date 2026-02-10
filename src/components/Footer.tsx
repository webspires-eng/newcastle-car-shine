import { Facebook, Instagram } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/sell-my-car-newcastle-logo.png";

export const Footer = () => {
  return (
    <footer className="bg-hero-yellow text-foreground py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <img src={logo} alt="Sell My Car Newcastle" className="h-12 w-auto" />
            </div>
            <p className="text-foreground/80 text-sm leading-relaxed max-w-xs">
              The hassle-free way to sell your car in Newcastle. Get the best price from verified dealers instantly.
            </p>
            {/* Social Media Icons */}
            <div className="flex gap-4">
              <a href="#" className="bg-background/50 hover:bg-background rounded-full w-10 h-10 flex items-center justify-center transition-all duration-300">
                <Facebook className="w-5 h-5 text-foreground" />
              </a>
              <a href="#" className="bg-background/50 hover:bg-background rounded-full w-10 h-10 flex items-center justify-center transition-all duration-300">
                <svg className="w-5 h-5 text-foreground" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="#" className="bg-background/50 hover:bg-background rounded-full w-10 h-10 flex items-center justify-center transition-all duration-300">
                <Instagram className="w-5 h-5 text-foreground" />
              </a>
            </div>
          </div>

          {/* About Column */}
          <div>
            <h3 className="font-bold text-lg mb-6">About Us</h3>
            <ul className="space-y-4 text-foreground/80">
              <li><Link to="/about" className="hover:text-foreground transition-colors">About us</Link></li>
              <li><Link to="/careers" className="hover:text-foreground transition-colors">Careers</Link></li>
              <li><a href="/#how-it-works" className="hover:text-foreground transition-colors">How it works</a></li>
              <li><Link to="/guides" className="hover:text-foreground transition-colors">Guides</Link></li>
            </ul>
          </div>

          {/* Selling Your Car Column */}
          <div>
            <h3 className="font-bold text-lg mb-6">Selling your car</h3>
            <ul className="space-y-4 text-foreground/80">
              <li><Link to="/" className="hover:text-foreground transition-colors">Sell my car</Link></li>
              <li><Link to="/guides/how-to-sell-car" className="hover:text-foreground transition-colors">How to sell a car</Link></li>
              <li><Link to="/guides/sell-car-on-finance" className="hover:text-foreground transition-colors">Sell on finance</Link></li>
              <li><Link to="/guides/car-valuation" className="hover:text-foreground transition-colors">Value my car</Link></li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="font-bold text-lg mb-6">Contact</h3>
            <ul className="space-y-4 text-foreground/80">
              <li>
                <a href="mailto:support@sellmycarnewcastle.co.uk" className="hover:text-foreground transition-colors">Help and contact</a>
              </li>
              <li className="pt-4">
                <p className="font-semibold text-foreground">Need help?</p>
                <a href="mailto:support@sellmycarnewcastle.co.uk" className="hover:underline">support@sellmycarnewcastle.co.uk</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-foreground/10 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
            <p className="text-sm font-medium">© Sell My Car Newcastle, 2017-{new Date().getFullYear()}</p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-foreground/80">
              <Link to="/sitemap.xml" className="hover:text-foreground transition-colors">Sitemap</Link>
            </div>
          </div>

          {/* Disclaimers */}
          <div className="text-center space-y-2 text-xs text-foreground/60 max-w-4xl mx-auto">
            <p>
              *84% of Newcastle sellers sold their vehicle for more than the average market price valuation between Jan 2020 and April 2024 (based on two independent market pricing guides).
            </p>
            <p>
              **On average Newcastle sellers got £1,600 more for their vehicle vs part exchange offers (based on a customer survey in August 2024).
            </p>
            <p>
              ‡83% of payments are made on the day of handover.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
