// Build-time render of the home page (scripts/prerender.mjs puts the HTML into dist/index.html),
// so the first paint shows real content before any JavaScript runs, and search engines and
// AI crawlers read the page's words directly. The browser then hydrates the same markup.
import { renderToString } from "react-dom/server";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Home from "@/pages/Home";

export function render() {
  return renderToString(
    <ThemeProvider>
      <Home />
    </ThemeProvider>,
  );
}
