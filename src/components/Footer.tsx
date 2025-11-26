import { Car, Facebook, Instagram } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-hero-yellow text-foreground py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand & App Downloads */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Car className="w-8 h-8 text-foreground" />
              <span className="text-2xl font-bold">Sell My Car Newcastle</span>
            </div>
            <div className="flex flex-col gap-3">
              <a href="#" className="block">
                <img src="https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/en-us?size=250x83" alt="Download on the App Store" className="h-12 w-auto" />
              </a>
              <a href="#" className="block">
                <img src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" alt="Get it on Google Play" className="h-[70px] w-auto -ml-2" />
              </a>
            </div>
          </div>

          {/* About Column */}
          <div>
            <h3 className="font-bold text-lg mb-4">About Us</h3>
            <ul className="space-y-3 text-foreground">
              <li><a href="#" className="hover:underline underline-offset-4">About us</a></li>
              <li><a href="#" className="hover:underline underline-offset-4">Careers</a></li>
              <li><a href="#how-it-works" className="hover:underline underline-offset-4">How it works</a></li>
              <li><a href="#" className="hover:underline underline-offset-4">Refer a friend</a></li>
              <li><a href="#" className="hover:underline underline-offset-4">Help and contact</a></li>
              <li><a href="#" className="hover:underline underline-offset-4">More money stories</a></li>
              <li><a href="#" className="hover:underline underline-offset-4">Press</a></li>
              <li><a href="#" className="hover:underline underline-offset-4">Reviews</a></li>
              <li><a href="#" className="hover:underline underline-offset-4">Blog</a></li>
            </ul>
          </div>

          {/* Selling Your Car Column */}
          <div>
            <h3 className="font-bold text-lg mb-4">Selling your car</h3>
            <ul className="space-y-3 text-foreground">
              <li><a href="#" className="hover:underline underline-offset-4">Sell my car</a></li>
              <li><a href="#" className="hover:underline underline-offset-4">Sell my van</a></li>
              <li><a href="#" className="hover:underline underline-offset-4">Sell on finance</a></li>
              <li><a href="#" className="hover:underline underline-offset-4">Sell to a dealer</a></li>
              <li><a href="#" className="hover:underline underline-offset-4">Car buyers</a></li>
            </ul>
          </div>

        </div>

        {/* Social Media Icons */}
        <div className="flex justify-center gap-4 mb-6">
          <a href="#" className="bg-background rounded-full w-10 h-10 flex items-center justify-center hover:opacity-80 transition-opacity">
            <Facebook className="w-5 h-5 text-foreground" />
          </a>
          <a href="#" className="bg-foreground rounded-full w-10 h-10 flex items-center justify-center hover:opacity-80 transition-opacity">
            <svg className="w-5 h-5 text-background" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
          <a href="#" className="bg-background rounded-full w-10 h-10 flex items-center justify-center hover:opacity-80 transition-opacity">
            <Instagram className="w-5 h-5 text-foreground" />
          </a>
        </div>

        {/* Footer Links */}
        <div className="text-center mb-6">
          <div className="flex flex-wrap justify-center gap-2 text-sm">
            <a href="#" className="hover:underline underline-offset-4">Terms</a>
            <span>•</span>
            <a href="#" className="hover:underline underline-offset-4">Privacy</a>
            <span>•</span>
            <a href="#" className="hover:underline underline-offset-4">Cookies</a>
            <span>•</span>
            <a href="#" className="hover:underline underline-offset-4">Sitemap</a>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center mb-8">
          <p className="text-sm font-medium">© Sell My Car Newcastle, 2017-{new Date().getFullYear()}</p>
        </div>

        {/* Disclaimers */}
        <div className="text-center space-y-2 text-xs max-w-4xl mx-auto">
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
    </footer>
  );
};
