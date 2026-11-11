// Page check for every built page (SITE_STANDARD.md, "Proof in every pull request").
// Serves dist/ the way the host does (compressed, clean addresses, the Ghana copy of each
// priced page), opens every page at 390, 820 and 1440 px in light and dark, and FAILS on:
//   sideways scroll, a browser console error, an image without alt text, a tap target under
//   44 px, a phone menu that does not open fully (a link hidden, off screen or covered), and a first load heavier
//   than the standard's first-screen budget (350 KB).
// Run after a build:  npm run build && npm run check:pages
// SHOTS=1 also saves a screenshot of every page, width and scheme into shots/ to look at.
// Never loosen a limit here to get a pull request through: fix the page (Nigel, 5 Nov 2026).
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require("playwright")); }
catch { ({ chromium } = createRequire("/opt/npm-tools/node_modules/")("playwright")); }

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const dist = path.join(root, "dist");
if (!fs.existsSync(path.join(dist, "index.html"))) { console.error("No build found. Run npm run build first."); process.exit(1); }

const COPY = "ghs-gh"; // the copy a visitor in Ghana gets (middleware.ts picks it on the host)
const BUDGET_KB = 350; // SITE_STANDARD.md, Budgets: first screen 350 KB or less
const TAP = 44; // SITE_STANDARD.md, Function and look
const WIDTHS = [390, 820, 1440];
const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".xml": "application/xml", ".txt": "text/plain; charset=utf-8", ".webmanifest": "application/manifest+json" };

let sent = 0; // bytes this server has sent since the last reset, as a visitor would download them
function fileFor(urlPath) {
  const clean = decodeURIComponent(urlPath.split("?")[0]).replace(/\/+$/, "") || "/";
  const tries = [];
  if (!path.extname(clean)) {
    tries.push(path.join(dist, "_r", COPY, clean, "index.html"), path.join(dist, clean, "index.html"), path.join(dist, clean + ".html"));
  } else {
    if (clean.endsWith(".html")) tries.push(path.join(dist, "_r", COPY, clean));
    tries.push(path.join(dist, clean));
  }
  return tries.find((f) => f.startsWith(dist) && fs.existsSync(f) && fs.statSync(f).isFile());
}
const server = http.createServer((req, res) => {
  const f = fileFor(req.url);
  const file = f || path.join(dist, "404.html");
  const ext = path.extname(file);
  let body = fs.readFileSync(file);
  const head = { "content-type": TYPES[ext] || "application/octet-stream", "cache-control": "no-store" };
  if (/\.(html|js|css|json|svg|xml|txt|webmanifest)$/.test(ext) && /gzip/.test(req.headers["accept-encoding"] || "")) {
    body = zlib.gzipSync(body); head["content-encoding"] = "gzip";
  }
  sent += body.length;
  res.writeHead(f ? 200 : 404, head); res.end(body);
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const BASE = `http://127.0.0.1:${server.address().port}`;

// Every page a visitor or a lead can be sent to.
const pages = ["/", "/fully-booked", "/privacy", "/terms"];
for (const d of fs.readdirSync(path.join(dist, "demo"))) pages.push(`/demo/${d}`);
for (const p of fs.readdirSync(path.join(dist, "preview"))) if (p.endsWith(".html")) pages.push(`/preview/${p}`);

const problems = [];
const weights = [];
// On GitHub the check uses the browser Playwright installs. Claude's workspace cannot download it, so it uses Chrome.
const exe = process.env.CHROME || (!process.env.CI && fs.existsSync("/usr/bin/google-chrome") ? "/usr/bin/google-chrome" : undefined);
const browser = await chromium.launch({ executablePath: exe });
if (process.env.SHOTS) fs.mkdirSync(path.join(root, "shots"), { recursive: true });

try {
  for (const pagePath of pages) {
    for (const scheme of ["light", "dark"]) {
      for (const width of WIDTHS) {
        const where = `${pagePath} at ${width} px, ${scheme}`;
        const ctx = await browser.newContext({ viewport: { width, height: width < 600 ? 844 : width < 1000 ? 1180 : 900 }, colorScheme: scheme, hasTouch: width < 1000 });
        const p = await ctx.newPage();
        const errs = [];
        p.on("console", (m) => { if (m.type() === "error") errs.push(m.text()); });
        p.on("pageerror", (e) => errs.push(String(e)));
        p.on("response", (r) => { if (r.status() >= 400) errs.push(`${r.status()} for ${r.url().replace(BASE, "")}`); });
        // Other hosts (fonts, analytics) are counted by their stated size when they give one.
        let outside = 0;
        p.on("response", (r) => { if (!r.url().startsWith(BASE)) outside += Number(r.headers()["content-length"] || 0); });
        sent = 0;
        await p.goto(BASE + pagePath, { waitUntil: "networkidle" });
        if (scheme === "light" && width === 390) weights.push([pagePath, Math.round((sent + outside) / 1024)]);
        // Scroll through once so content that appears on scroll is shown, as a visitor sees it.
        await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 30)); } scrollTo(0, 0); });
        await p.waitForTimeout(400);
        const r = await p.evaluate((TAP) => {
          const seen = (el) => { const b = el.getBoundingClientRect(); const s = getComputedStyle(el); return b.width > 0 && b.height > 0 && s.visibility !== "hidden" && s.display !== "none"; };
          const name = (el) => (el.getAttribute("aria-label") || el.textContent || el.id || el.className || el.tagName).toString().trim().replace(/\s+/g, " ").slice(0, 40);
          return {
            overflow: document.documentElement.scrollWidth - window.innerWidth,
            noAlt: [...document.images].filter((i) => !i.hasAttribute("alt")).map((i) => i.currentSrc || i.src).slice(0, 5),
            small: [...document.querySelectorAll("a[href], button, input:not([type=hidden]), select, textarea, summary")].filter((el) => {
              if (!seen(el) || el.disabled) return false;
              // A link inside a sentence is text, not a button (WCAG 2.5.8 makes the same exception).
              // "In a sentence" means its parent also holds at least 20 characters of plain text of its own.
              if (el.matches("a") && getComputedStyle(el).display === "inline") {
                const own = [...el.parentElement.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join("").trim();
                if (own.length >= 20) return false;
              }
              const lab = el.matches("input[type=checkbox], input[type=radio]") && el.closest("label");
              const b = (lab || el).getBoundingClientRect();
              return b.height < TAP - 0.5 || b.width < TAP - 0.5;
            }).map((el) => { const b = el.getBoundingClientRect(); return `"${name(el)}" <${el.tagName.toLowerCase()}${el.className && typeof el.className === "string" ? "." + el.className.trim().split(/\s+/).slice(0, 2).join(".") : ""}> ${Math.round(b.width)} x ${Math.round(b.height)}`; }).slice(0, 12),
          };
        }, TAP);
        if (r.overflow > 0) problems.push(`${where}: sideways scroll of ${r.overflow} px`);
        if (r.noAlt.length) problems.push(`${where}: image without alt text: ${r.noAlt.join(", ")}`);
        if (r.small.length) problems.push(`${where}: tap target under ${TAP} px: ${r.small.join("; ")}`);
        for (const e of [...new Set(errs)]) problems.push(`${where}: console error: ${e.slice(0, 160)}`);
        if (process.env.SHOTS) await p.screenshot({ path: path.join(root, "shots", `${pagePath.replace(/[^\w]+/g, "_") || "home"}-${width}-${scheme}.png`), fullPage: true });

        // The phone menu must open fully (SITE_STANDARD.md, Navigation).
        if (width === 390 && scheme === "light") {
          const btn = p.locator("header button[aria-expanded], nav button[aria-expanded], button[aria-controls][aria-expanded]").first();
          if (await btn.count() && await btn.isVisible()) {
            await btn.click();
            await p.waitForTimeout(500);
            const m = await p.evaluate(() => {
              const b = document.querySelector("button[aria-expanded=true]");
              if (!b) return { open: false };
              const id = b.getAttribute("aria-controls");
              const panel = (id && document.getElementById(id)) || [...document.querySelectorAll("nav, [role=dialog], [data-menu]")].filter((n) => n.querySelectorAll("a").length > 1 && n.getBoundingClientRect().height > 0).sort((x, y) => y.querySelectorAll("a").length - x.querySelectorAll("a").length)[0];
              if (!panel) return { open: true, found: false };
              // Open fully: every link in the menu is on screen and nothing sits on top of it.
              const hidden = [...panel.querySelectorAll("a")].filter((a) => {
                const r = a.getBoundingClientRect();
                if (!r.width || !r.height) return true;
                const x = r.left + r.width / 2, y = r.top + r.height / 2;
                if (x < 0 || x > innerWidth || y < 0 || y > innerHeight) return true;
                const top = document.elementFromPoint(x, y);
                return !(top && (top === a || a.contains(top) || top.contains(a) && panel.contains(top)));
              }).map((a) => a.textContent.trim().slice(0, 30));
              return { open: true, found: true, links: panel.querySelectorAll("a").length, hidden };
            });
            if (!m.open) problems.push(`${where}: the phone menu button did not open a menu`);
            else if (!m.found) problems.push(`${where}: the phone menu opened but its panel could not be found (give the button aria-controls)`);
            else if (!m.links) problems.push(`${where}: the phone menu opened with no links in it`);
            else if (m.hidden.length) problems.push(`${where}: the phone menu did not open fully, these links are hidden or covered: ${m.hidden.join(", ")}`);
            if (process.env.SHOTS) await p.screenshot({ path: path.join(root, "shots", `${pagePath.replace(/[^\w]+/g, "_") || "home"}-390-menu.png`) });
          }
        }
        await ctx.close();
      }
    }
  }
} finally {
  await browser.close();
  await new Promise((r) => server.close(r)); // never leave the local server running
}

console.log("First load at 390 px (compressed, as downloaded):");
for (const [pg, kb] of weights) {
  console.log(`  ${String(kb).padStart(5)} KB  ${pg}`);
  if (kb > BUDGET_KB) problems.push(`${pg}: first load is ${kb} KB, over the ${BUDGET_KB} KB budget`);
}
console.log(`\nChecked ${pages.length} pages at ${WIDTHS.join(", ")} px, light and dark.`);
if (problems.length) {
  console.log(`\n${problems.length} problem(s):`);
  for (const x of problems) console.log("  - " + x);
  process.exit(1);
}
console.log("No problems found.");
