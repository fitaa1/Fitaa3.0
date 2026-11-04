// Runs last in the build. Renders the home page to HTML with the server build of
// src/entry-server.tsx and puts it inside <div id="root"> of dist/index.html, so the page paints
// its real content before the script loads. static-pages.mjs runs first, so the privacy, terms
// and 404 copies keep an empty root and render in the browser as before.
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const file = path.join(root, "dist/index.html");
const server = fs.readdirSync(path.join(root, "dist-ssr")).find((f) => /^entry-server\.(m?js)$/.test(f));
if (!server) throw new Error("prerender: dist-ssr/entry-server.js not found");
const { render } = await import(pathToFileURL(path.join(root, "dist-ssr", server)).href);
const html = render();
if (!html.includes("<h1")) throw new Error("prerender: the rendered home page has no h1");
const page = fs.readFileSync(file, "utf8");
if (!page.includes('<div id="root"></div>')) throw new Error("prerender: empty root not found in dist/index.html");
fs.writeFileSync(file, page.replace('<div id="root"></div>', `<div id="root">${html}</div>`));
fs.rmSync(path.join(root, "dist-ssr"), { recursive: true, force: true });
console.log(`prerender: home page HTML written (${Math.round(html.length / 1024)} KB)`);
