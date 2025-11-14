import { Link } from "react-router-dom";
import logo from "@/assets/sell-my-car-newcastle-logo.png";

export const Header = () => {
  return <header className="bg-background border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-background/95">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img src={logo} alt="Sell My Car Newcastle" className="h-12 w-auto" />
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="/#how-it-works" className="text-foreground hover:text-foreground/70 transition-colors font-medium">
              How it works
            </a>
            <Link to="/about" className="text-foreground hover:text-foreground/70 transition-colors font-medium">
              About Us
            </Link>
            <Link to="/careers" className="text-foreground hover:text-foreground/70 transition-colors font-medium">
              Careers
            </Link>
            <Link to="/guides" className="text-foreground hover:text-foreground/70 transition-colors font-medium">
              Explore Guides
            </Link>
          </nav>
        </div>
      </div>
    </header>;
};