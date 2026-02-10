import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    document.title = "Page Not Found | Sell My Car Newcastle";
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="mb-4 text-6xl font-bold text-foreground">404</h1>
        <p className="mb-6 text-xl text-muted-foreground">Oops! Page not found</p>
        <Link to="/" className="inline-flex items-center gap-2 bg-hero-yellow text-foreground px-6 py-3 rounded-xl font-semibold hover:bg-hero-yellow/90 transition-colors">
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
