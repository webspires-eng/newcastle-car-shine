import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const Index = lazy(() => import("./pages/Index"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const Careers = lazy(() => import("./pages/Careers"));
const ExploreGuides = lazy(() => import("./pages/ExploreGuides"));
const GuideArticle = lazy(() => import("./pages/GuideArticle"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Valuation = lazy(() => import("./pages/Valuation"));
const ThankYou = lazy(() => import("./pages/ThankYou"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground"></div></div>}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/guides" element={<ExploreGuides />} />
            <Route path="/guides/:slug" element={<GuideArticle />} />
            <Route path="/valuation" element={<Valuation />} />
            <Route path="/thank-you" element={<ThankYou />} />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
