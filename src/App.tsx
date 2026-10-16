import { useEffect, lazy, Suspense } from "react";
import { siteConfig } from "@/config/site";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Home from "@/pages/Home";

const Legal = lazy(() => import("@/pages/Legal"));
const path = window.location.pathname.replace(/\/+$/, "");
const legalPage = path === "/privacy" ? "privacy" : path === "/terms" ? "terms" : null;

export default function App() {
  useEffect(() => {
    if (legalPage) return;
    document.title = `${siteConfig.name} — ${siteConfig.tagline}`;
  }, []);

  return (
    <ThemeProvider>
      <TooltipProvider>
        {legalPage ? (
          <Suspense fallback={<div className="min-h-screen bg-background" />}>
            <Legal page={legalPage} />
          </Suspense>
        ) : (
          <Home />
        )}
        <Toaster />
      </TooltipProvider>
    </ThemeProvider>
  );
}
