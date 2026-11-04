import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
const root = document.getElementById("root")!;
const isHome = window.location.pathname.replace(/\/+$/, "").replace(/\/index\.html$/, "") === "";
/* The home page arrives already rendered (scripts/prerender.mjs), so React takes it over in place. */
if (isHome && root.firstElementChild) hydrateRoot(root, <App />);
else createRoot(root).render(<App />);

/* Fade out the splash once the first frame has painted (see index.html). */
requestAnimationFrame(() =>
  (window as unknown as { __hideSplash?: () => void }).__hideSplash?.(),
);