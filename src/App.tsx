import { lazy, Suspense } from "react";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Home from "@/pages/Home";

const Legal = lazy(() => import("@/pages/Legal"));
const path = window.location.pathname.replace(/\/+$/, "");
const legalPage = path === "/privacy" ? "privacy" : path === "/terms" ? "terms" : null;

export default function App() {
  return (
    <ThemeProvider>
      {legalPage ? (
        <Suspense fallback={<div className="min-h-screen bg-background" />}>
          <Legal page={legalPage} />
        </Suspense>
      ) : (
        <Home />
      )}
    </ThemeProvider>
  );
}
