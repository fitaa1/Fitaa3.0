import { lazy, Suspense } from "react";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Home from "@/pages/Home";

const Legal = lazy(() => import("@/pages/Legal"));
const NotFound = lazy(() => import("@/pages/NotFound"));

// No router library: the address decides the page. Vercel only sends real pages here
// (see vercel.json); anything else gets /404.html, which also renders this app.
const path = window.location.pathname.replace(/\/+$/, "").replace(/\/index\.html$/, "");
const legalPage = path === "/privacy" ? "privacy" : path === "/terms" ? "terms" : null;
const isHome = path === "";

export default function App() {
  return (
    <ThemeProvider>
      {legalPage ? (
        <Suspense fallback={<div className="min-h-screen bg-background" />}>
          <Legal page={legalPage} />
        </Suspense>
      ) : isHome ? (
        <Home />
      ) : (
        <Suspense fallback={<div className="min-h-screen bg-background" />}>
          <NotFound />
        </Suspense>
      )}
    </ThemeProvider>
  );
}