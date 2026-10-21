// Runs after `vite build`. Writes three extra copies of dist/index.html so that search
// engines and link previews see the right title, description and canonical without
// running JavaScript:
//   dist/privacy/index.html  and  dist/terms/index.html  (served by vercel.json rewrites)
//   dist/404.html                                         (served by Vercel with a 404 status)
// The React app still decides what to show from the address (src/App.tsx).
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const dist = path.join(root, "dist");
const meta = JSON.parse(fs.readFileSync(path.join(root, "src/config/legal-meta.json"), "utf8"));
const siteTs = fs.readFileSync(path.join(root, "src/config/site.ts"), "utf8");
const SITE = (siteTs.match(/url:\s*"(https:\/\/[^"]+)"/) || [])[1];
if (!SITE) throw new Error("static-pages: could not read siteConfig.url from src/config/site.ts");

const base = fs.readFileSync(path.join(dist, "index.html"), "utf8");
const esc = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

function must(html, re, label) {
  if (!re.test(html)) throw new Error(`static-pages: ${label} not found in dist/index.html`);
  return html;
}

function page({ title, description, url, noindex }) {
  let html = base;
  const t = esc(title), d = esc(description);
  html = must(html, /<title>[\s\S]*?<\/title>/, "<title>").replace(/<title>[\s\S]*?<\/title>/, `<title>${t}</title>`);
  html = must(html, /<meta name="description"[^>]*>/, "description").replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${d}" />`);
  html = html.replace(/<meta property="og:title"[^>]*>/, `<meta property="og:title" content="${t}" />`);
  html = html.replace(/<meta property="og:description"[^>]*>/, `<meta property="og:description" content="${d}" />`);
  html = html.replace(/<meta name="twitter:title"[^>]*>/, `<meta name="twitter:title" content="${t}" />`);
  html = html.replace(/<meta name="twitter:description"[^>]*>/, `<meta name="twitter:description" content="${d}" />`);
  // The business details (JSON-LD) belong to the home page only.
  html = html.replace(/\s*<!-- Structured Data -->\s*<script type="application\/ld\+json">[\s\S]*?<\/script>/, "");
  if (noindex) {
    html = html.replace(/<link rel="canonical"[^>]*>/, "");
    html = html.replace(/<meta property="og:url"[^>]*>/, "");
    html = must(html, /<meta name="robots"[^>]*>/, "robots").replace(/<meta name="robots"[^>]*>/, `<meta name="robots" content="noindex" />`);
  } else {
    html = must(html, /<link rel="canonical"[^>]*>/, "canonical").replace(/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${url}" />`);
    html = html.replace(/<meta property="og:url"[^>]*>/, `<meta property="og:url" content="${url}" />`);
  }
  return html;
}

function write(rel, html) {
  const file = path.join(dist, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
  console.log(`static-pages: wrote dist/${rel}`);
}

for (const key of ["privacy", "terms"]) {
  const m = meta[key];
  write(`${key}/index.html`, page({ title: `${m.title} | Fitaa Creative`, description: m.intro, url: `${SITE}/${key}` }));
}
write("404.html", page({ title: "Page not found | Fitaa Creative", description: "This page isn't here. Everything Fitaa Creative does is one tap away.", noindex: true }));
