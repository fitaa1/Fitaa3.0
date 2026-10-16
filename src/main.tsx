import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
createRoot(document.getElementById("root")!).render(<App />);

/* Fade out the splash once the first frame has painted (see index.html). */
requestAnimationFrame(() =>
  (window as unknown as { __hideSplash?: () => void }).__hideSplash?.(),
);