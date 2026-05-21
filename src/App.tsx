import { useEffect } from "react";
import { siteConfig } from "@/config/site";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Home from "@/pages/Home";

export default function App() {
  useEffect(() => {
    document.title = `${siteConfig.name} — ${siteConfig.tagline}`;
  }, []);

  return (
    <ThemeProvider>
      <TooltipProvider>
        <Home />
        <Toaster />
      </TooltipProvider>
    </ThemeProvider>
  );
}
