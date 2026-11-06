// Runs after the server build. Renders the home page to HTML with dist-ssr/entry-server.js and
// puts it inside <div id="root">, so the page paints its real content before the script loads.
// It renders one copy per currency and WhatsApp line (see scripts/regions.mjs and middleware.ts):
// dist/index.html is the default copy (USD, Ghana WhatsApp), the rest go under dist/_r/.
// static-pages.mjs runs first, so the privacy, terms and 404 copies keep an empty root and
// render in the browser as before.
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { root, dist, COPIES, markHtml, offersFor, rewriteJsonLd, write } from "./regions.mjs";

const server = fs.readdirSync(path.join(root, "dist-ssr")).find((f) => /^entry-server\.(m?js)$/.test(f));
if (!server) throw new Error("prerender: dist-ssr/entry-server.js not found");
const { render } = await import(pathToFileURL(path.join(root, "dist-ssr", server)).href);

const page = fs.readFileSync(path.join(dist, "index.html"), "utf8");
if (!page.includes('<div id="root"></div>')) throw new Error("prerender: empty root not found in dist/index.html");

for (const copy of COPIES) {
  const html = render(copy.cur, copy.number);
  if (!html.includes("<h1")) throw new Error("prerender: the rendered home page has no h1");
  if (!html.includes(`wa.me/${copy.number}`)) throw new Error(`prerender: ${copy.cur}-${copy.line} copy has no WhatsApp link to its number`);
  let out = markHtml(page.replace('<div id="root"></div>', () => `<div id="root">${html}</div>`), copy.cur, copy.number);
  const offers = offersFor(copy.cur);
  out = rewriteJsonLd(
    out,
    (body) => body.includes('"ProfessionalService"'),
    (data) => {
      const business = data["@graph"].find((n) => n["@type"] === "ProfessionalService");
      for (const offer of business.hasOfferCatalog.itemListElement) {
        const o = offers[offer.itemOffered.name];
        if (o) Object.assign(offer, o);
      }
    },
    "home page business",
  );
  write(`${copy.dir}index.html`, out);
}
fs.rmSync(path.join(root, "dist-ssr"), { recursive: true, force: true });
console.log(`prerender: home page written in ${COPIES.length} copies (${COPIES.map((c) => `${c.cur}-${c.line}`).join(", ")})`);
