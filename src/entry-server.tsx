// Build-time render of the home page (scripts/prerender.mjs puts the HTML into dist/index.html
// and into one copy per currency and WhatsApp line under dist/_r/, see middleware.ts), so the
// first paint shows real content and the visitor's own prices before any JavaScript runs, and
// search engines and AI crawlers read the page's words directly. The browser then hydrates the
// same markup.
import { renderToString } from "react-dom/server";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { RegionProvider, type Currency } from "@/lib/region";
import Home from "@/pages/Home";

export function render(currency: Currency, waNumber: string) {
  return renderToString(
    <ThemeProvider>
      <RegionProvider currency={currency} waNumber={waNumber}>
        <Home />
      </RegionProvider>
    </ThemeProvider>,
  );
}
