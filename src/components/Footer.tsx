import { Car, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Car className="w-8 h-8 text-secondary" />
              <span className="text-xl font-bold">Sell My Car Newcastle</span>
            </div>
            <p className="text-sm text-background/70">
              Fast, fair and no fuss car selling service in Newcastle and surrounding areas.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-background/70 hover:text-secondary transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-background/70 hover:text-secondary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-background/70 hover:text-secondary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-background/70 hover:text-secondary transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Tools */}
          <div>
            <h3 className="font-semibold mb-4">Tools</h3>
            <ul className="space-y-2 text-sm text-background/70">
              <li><a href="#" className="hover:text-secondary transition-colors">Car Valuation</a></li>
              <li><a href="#" className="hover:text-secondary transition-colors">Sell My Car App</a></li>
              <li><a href="#" className="hover:text-secondary transition-colors">Finance Calculator</a></li>
              <li><a href="#" className="hover:text-secondary transition-colors">Free Collection</a></li>
            </ul>
          </div>

          {/* Guides */}
          <div>
            <h3 className="font-semibold mb-4">Guides</h3>
            <ul className="space-y-2 text-sm text-background/70">
              <li><a href="#" className="hover:text-secondary transition-colors">How to Sell a Car</a></li>
              <li><a href="#" className="hover:text-secondary transition-colors">Car Selling Tips</a></li>
              <li><a href="#" className="hover:text-secondary transition-colors">Selling on Finance</a></li>
              <li><a href="#" className="hover:text-secondary transition-colors">Documentation Guide</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-background/70">
              <li><a href="#" className="hover:text-secondary transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-secondary transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-secondary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-secondary transition-colors">Terms & Conditions</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/20 pt-8 text-center text-sm text-background/70">
          <p>&copy; {new Date().getFullYear()} Sell My Car Newcastle. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
