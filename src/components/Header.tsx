import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "@/assets/sell-my-car-newcastle-logo.png";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ManualEntryDialog } from "@/components/ManualEntryDialog";

export const Header = () => {
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const navItems = [
    { href: "/#how-it-works", label: "How it works" },
    { to: "/about", label: "About Us" },
    { to: "/careers", label: "Careers" },
    { to: "/guides", label: "Explore Guides" },
    { to: "/vehicle-lookup", label: "Vehicle Lookup" },
  ];

  return (
    <header className="bg-background/80 backdrop-blur-md border-b border-border/50 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-16">
          {/* Logo - Centered */}
          <Link to="/" className="absolute left-4 sm:left-6 lg:left-8">
            <img src={logo} alt="Sell My Car Newcastle" className="h-10 w-auto" />
          </Link>

          {/* Desktop Navigation - Centered */}
          <nav className="hidden md:flex items-center space-x-8 font-montserrat">
            {navItems.map((item) =>
              item.href ? (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-foreground/80 hover:text-foreground transition-colors font-medium text-sm uppercase tracking-wider"
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.label}
                  to={item.to!}
                  className="text-foreground/80 hover:text-foreground transition-colors font-medium text-sm uppercase tracking-wider"
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>

          {/* Instant Valuation Button - Desktop */}
          <div className="hidden md:block absolute right-4 sm:right-6 lg:right-8">
            <Button
              onClick={() => setDialogOpen(true)}
              className="font-montserrat uppercase tracking-wider text-sm font-medium"
            >
              Instant Valuation
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden absolute right-4">
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] font-montserrat">
              <SheetHeader>
                <SheetTitle className="uppercase tracking-wide">Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col space-y-4 mt-8">
                {navItems.map((item) =>
                  item.href ? (
                    <a
                      key={item.label}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="text-lg font-medium text-foreground/80 hover:text-foreground transition-colors py-2 uppercase tracking-wide"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      key={item.label}
                      to={item.to!}
                      onClick={() => setOpen(false)}
                      className="text-lg font-medium text-foreground/80 hover:text-foreground transition-colors py-2 uppercase tracking-wide"
                    >
                      {item.label}
                    </Link>
                  )
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <ManualEntryDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={() => { }}
      />
    </header>
  );
};