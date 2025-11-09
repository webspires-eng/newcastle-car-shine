import { Button } from "@/components/ui/button";
import { ChevronDown, User } from "lucide-react";

export const Header = () => {
  return (
    <header className="bg-background border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-background/95">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <span className="text-2xl font-bold text-foreground">Sell My Car Newcastle</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#how-it-works" className="text-foreground hover:text-foreground/70 transition-colors font-medium">
              How it works
            </a>
            <a href="#help" className="text-foreground hover:text-foreground/70 transition-colors font-medium">
              Help
            </a>
            <button className="flex items-center gap-1 text-foreground hover:text-foreground/70 transition-colors font-medium">
              Tools
              <ChevronDown className="w-4 h-4" />
            </button>
            <button className="flex items-center gap-1 text-foreground hover:text-foreground/70 transition-colors font-medium">
              More
              <ChevronDown className="w-4 h-4" />
            </button>
          </nav>

          {/* Sign In */}
          <Button variant="ghost" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">Sign in</span>
          </Button>
        </div>
      </div>
    </header>
  );
};
