import { lazy, Suspense } from "react";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Home from "@/pages/Home";

const Legal = lazy(() => import("@/pages/Legal"));
const FullyBooked = lazy(() => import("@/pages/FullyBooked"));
const path = window.location.pathname.replace(/\/+$/, "");
const legalPage = path === "/privacy" ? "privacy" : path === "/terms" ? "terms" : null;
const isFullyBooked = path === "/fully-booked";

export default function App() {
  return (
    <ThemeProvider>
      {isFullyBooked ? (
        <Suspense fallback={<div className="min-h-screen bg-background" />}>
          <FullyBooked />
        </Suspense>
      ) : legalPage ? (
        <Suspense fallback={<div className="min-h-screen bg-background" />}>
          <Legal page={legalPage} />
        </Suspense>
      ) : (
        <Home />
      )}
    </ThemeProvider>
  );
}
