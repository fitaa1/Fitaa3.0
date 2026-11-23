// Page check for every built page (SITE_STANDARD.md, "Proof in every pull request").
// Serves dist/ the way the host does (compressed, clean addresses, the Ghana copy of each
// priced page), opens every page at 390, 820 and 1440 px in light and dark, and FAILS on:
//   sideways scroll, a browser console error, an image without alt text, a tap target under
//   44 px, a phone menu that does not open fully (a link hidden, off screen or covered), a photo below the first screen that is not
//   lazy, a first screen heavier than the standard's budget (350 KB), a phone menu that does not close as smoothly as it
//   opens, and missing search basics (title, one h1, lang, structured data that parses, and on pages meant for Google a
//   description of 170 characters or fewer, a canonical address and a share card).
// Run after a build:  npm run build && npm run check:pages
// SHOTS=1 also saves a screenshot of every page, width and scheme into shots/ to look at.
// Never loosen a limit here to get a pull request through: fix the page (Nigel, 5 Nov 2026).
//
// One check for every Fitaa site (SITE_STANDARD.md, How every site is held to this standard). This file is the
// reference and is copied unchanged into each site's scripts/ folder; what differs between sites lives in
// scripts/check-pages.config.mjs beside it (which pages, where the build is, which price copy to serve).
// Fitaa OS compares each copy's version line with this one and shows a copy that has fallen behind.
// check-pages version: 2026-11-23
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require("playwright")); }
catch { ({ chromium } = createRequire("/opt/npm-tools/node_modules/")("playwright")); }

const here = path.dirname(new URL(import.meta.url).pathname);
const root = path.resolve(here, "..");
// The site's own settings (optional). Every field has a default that suits a plain static build in dist/.
const configFile = path.join(here, "check-pages.config.mjs");
const config = fs.existsSync(configFile) ? (await import(configFile)).default : {};
const dist = path.resolve(root, config.dist || "dist");
if (!fs.existsSync(path.join(dist, "index.html"))) { console.error(`No build found in ${dist}. Run the build first.`); process.exit(1); }

const COPY = config.copy || ""; // a price copy to serve first, e.g. "ghs-gh" on fitaacreative.com (middleware.ts picks it on the host)
const BUDGET_KB = 350; // SITE_STANDARD.md, Budgets: first screen 350 KB or less
const TAP = 44; // SITE_STANDARD.md, Function and look
const WIDTHS = [390, 820, 1440];
const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".xml": "application/xml", ".txt": "text/plain; charset=utf-8", ".webmanifest": "application/manifest+json" };

let sent = 0; // bytes this server has sent since the last reset, as a visitor would download them
let sentBy = {}; // the same, per address, so photos below the first screen can be told apart
function fileFor(urlPath) {
  const clean = decodeURIComponent(urlPath.split("?")[0]).replace(/\/+$/, "") || "/";
  const tries = [];
  if (!path.extname(clean)) {
    if (COPY) tries.push(path.join(dist, "_r", COPY, clean, "index.html"));
    tries.push(path.join(dist, clean, "index.html"), path.join(dist, clean + ".html"));
  } else {
    if (COPY && clean.endsWith(".html")) tries.push(path.join(dist, "_r", COPY, clean));
    tries.push(path.join(dist, clean));
  }
  return tries.find((f) => f.startsWith(dist) && fs.existsSync(f) && fs.statSync(f).isFile());
}
// A site whose pages read its own API (a calendar, saved dates) names a stand-in answer for each address in
// config.api, so the page is checked as a visitor sees it, e.g. { "/api/availability": { status: "not-connected" } }.
const api = Object.entries(config.api || {});
const server = http.createServer((req, res) => {
  const stand = api.find(([prefix]) => req.url.startsWith(prefix));
  if (stand) { res.writeHead(200, { "content-type": "application/json", "cache-control": "no-store" }); res.end(JSON.stringify(stand[1])); return; }
  const f = fileFor(req.url);
  const file = f || path.join(dist, "404.html");
  const ext = path.extname(file);
  let body = fs.readFileSync(file);
  const head = { "content-type": TYPES[ext] || "application/octet-stream", "cache-control": "no-store" };
  if (/\.(html|js|css|json|svg|xml|txt|webmanifest)$/.test(ext) && /gzip/.test(req.headers["accept-encoding"] || "")) {
    body = zlib.gzipSync(body); head["content-encoding"] = "gzip";
  }
  sent += body.length;
  sentBy[req.url.split("?")[0]] = body.length;
  res.writeHead(f ? 200 : 404, head); res.end(body);
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const BASE = `http://127.0.0.1:${server.address().port}`;

// Every page a visitor or a lead can be sent to: the site's own list, or every HTML page in the build
// (folders with an index.html and loose .html files), leaving out 404, the price copies and anything in config.skip.
function everyPage() {
  const found = [];
  const walk = (dir, base) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const rel = `${base}/${e.name}`;
      if (e.isDirectory()) { if (e.name === "_r" || e.name.startsWith(".")) continue; if (fs.existsSync(path.join(dir, e.name, "index.html"))) found.push(rel); walk(path.join(dir, e.name), rel); }
      else if (e.name.endsWith(".html") && e.name !== "index.html" && !/^404/.test(e.name)) found.push(rel);
    }
  };
  walk(dist, "");
  return ["/", ...found.filter((p) => !/\/404(\.html)?$/.test(p))];
}
const skip = (config.skip || []).map((s) => new RegExp(s));
const pages = (typeof config.pages === "function" ? config.pages({ dist, fs, path }) : config.pages || everyPage()).filter((p) => !skip.some((r) => r.test(p)));

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
        sent = 0; sentBy = {};
        await p.goto(BASE + pagePath, { waitUntil: "networkidle" });
        // The budget is for the first screen. A browser fetches lazy photos some way ahead, and how far
        // differs between machines, so photos that are lazy and start below the first screen are taken
        // off the total. A photo below the first screen that is NOT lazy is a fault of its own.
        const below = await p.evaluate(() => [...document.images].filter((i) => i.getBoundingClientRect().top + scrollY > innerHeight).map((i) => ({ src: new URL(i.currentSrc || i.src, location.href).pathname, lazy: i.loading === "lazy" })));
        const later = below.filter((i) => i.lazy).reduce((n, i) => n + (sentBy[i.src] || 0), 0);
        const eager = [...new Set(below.filter((i) => !i.lazy && !i.src.startsWith("data:")).map((i) => i.src))];
        if (eager.length) problems.push(`${where}: photo below the first screen is not lazy (add loading="lazy"): ${eager.slice(0, 4).join(", ")}`);
        if (scheme === "light" && width === 390) weights.push([pagePath, Math.round((sent - later + outside) / 1024)]);
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
              // A skip link hidden the accessible way (clipped to 1 x 1 until it is focused) is not a tap target.
              { const b = el.getBoundingClientRect(); if (b.width <= 1 && b.height <= 1) return false; }
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
        // Found, trusted and chosen (SITE_STANDARD.md, Search and AI answers): checked once per page.
        if (width === 1440 && scheme === "light") {
          const s = await p.evaluate(() => {
            const meta = (q) => document.querySelector(q)?.getAttribute("content") || "";
            const robots = meta('meta[name="robots"]');
            const ld = [...document.querySelectorAll('script[type="application/ld+json"]')].map((n) => { try { JSON.parse(n.textContent); return null; } catch (e) { return String(e).slice(0, 80); } }).filter(Boolean);
            return { title: document.title.trim(), desc: meta('meta[name="description"]'), canonical: document.querySelector('link[rel="canonical"]')?.href || "", noindex: /noindex/i.test(robots), ogImage: meta('meta[property="og:image"]'), ogTitle: meta('meta[property="og:title"]'), lang: document.documentElement.lang, h1: document.querySelectorAll("h1").length, ld };
          });
          const fault = (x) => problems.push(`${pagePath}: ${x}`);
          if (!s.title) fault("no title");
          else if (s.title.length > 70) fault(`the title is ${s.title.length} characters, Google cuts it after about 60 to 70`);
          if (!s.lang) fault("the page has no lang attribute");
          if (s.h1 !== 1) fault(`the page has ${s.h1} main headings (h1), it needs exactly one`);
          for (const e of s.ld) fault(`structured data does not parse: ${e}`);
          if (!s.noindex) {
            if (!s.desc) fault("no meta description");
            else if (s.desc.length > 170) fault(`the meta description is ${s.desc.length} characters, Google shows about 160`);
            if (!s.canonical.startsWith("https://")) fault("no canonical address");
            if (!s.ogImage || !s.ogTitle) fault("no share card (og:image and og:title)");
          }
        }
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
            // The phone menu must close as well as it opens (Nigel, 22 Nov 2026): tapping the button again plays a
            // way out (the panel is still on screen and on its way 80 ms later, never gone in one frame), and by
            // 900 ms nothing of it covers the page or takes a tap.
            if (m.found && m.links) {
              const panelSel = await p.evaluate(() => { const b = document.querySelector("button[aria-expanded=true]"); return b && b.getAttribute("aria-controls") ? "#" + b.getAttribute("aria-controls") : null; });
              const state = () => p.evaluate((sel) => {
                const panel = sel && document.querySelector(sel);
                if (!panel) return { gone: true };
                const s = getComputedStyle(panel), r = panel.getBoundingClientRect();
                const onScreen = r.bottom > 0 && r.top < innerHeight && r.height > 0 && s.display !== "none" && s.visibility !== "hidden" && +s.opacity > 0.02;
                const takesTap = onScreen && s.pointerEvents !== "none" && [...panel.querySelectorAll("a")].some((a) => { const b = a.getBoundingClientRect(); const top = document.elementFromPoint(b.left + b.width / 2, b.top + b.height / 2); return top && (top === a || a.contains(top)); });
                return { gone: false, onScreen, takesTap, sig: `${s.opacity}|${s.transform}|${r.top}` };
              }, panelSel);
              const before = await state();
              // Close it the way a visitor would: a Close button inside the open panel if it has one, else the menu button.
              const inPanel = panelSel ? p.locator(`${panelSel} button`).filter({ hasText: /close/i }).or(p.locator(`${panelSel} button[aria-label*="lose" i]`)).first() : null;
              const closer = inPanel && await inPanel.count() && await inPanel.isVisible() ? inPanel : p.locator("button[aria-expanded=true]").first();
              if (await closer.count()) {
                await closer.click({ timeout: 3000 }).catch(() => problems.push(`${where}: the control that closes the phone menu cannot be tapped (something covers it)`));
                await p.waitForTimeout(80);
                const during = await state();
                await p.waitForTimeout(820);
                const after = await state();
                const still = await p.evaluate(() => !!document.querySelector("button[aria-expanded=true]"));
                if (still) problems.push(`${where}: the phone menu button did not close the menu`);
                else if (!after.gone && (after.onScreen || after.takesTap)) problems.push(`${where}: the phone menu is still on screen or takes taps 900 ms after closing`);
                else if (panelSel && (during.gone || !during.onScreen || during.sig === before.sig)) problems.push(`${where}: the phone menu vanishes in one frame when it closes; give it a way out as smooth as its way in`);
              } else problems.push(`${where}: the open phone menu has no button to close it`);
            }
          }
          // Demo pages must not show bracket placeholders (Nigel, 12 Nov 2026).
          if (pagePath.startsWith("/demo/")) {
            const placeholder = await p.evaluate(() => {
              const text = document.body.innerText || "";
              return /\[[^\]\n]{1,80}\]/.test(text);
            });
            if (placeholder) problems.push(`${where}: a bracket placeholder is showing`);
          }
          // A page whose section nav is hidden on a phone needs a visible menu button to open it.
          const missingMenu = await p.evaluate(() => {
            const navs = [...document.querySelectorAll("nav")];
            const sectionNav = navs.find((n) => n.querySelectorAll("a[href^='#']").length >= 3);
            if (!sectionNav) return null;
            const links = [...sectionNav.querySelectorAll("a[href^='#']")];
            const visible = (el) => { const b = el.getBoundingClientRect(); const s = getComputedStyle(el); return b.width > 0 && b.height > 0 && s.visibility !== "hidden" && s.display !== "none"; };
            if (links.some((a) => visible(a))) return null;
            const btn = document.querySelector("button[aria-expanded]");
            const btnVisible = !!btn && getComputedStyle(btn).display !== "none" && getComputedStyle(btn).visibility !== "hidden" && btn.getBoundingClientRect().width > 0;
            if (btnVisible) return null;
            return "section links are hidden on a phone and there is no menu button";
          });
          if (missingMenu) problems.push(`${where}: ${missingMenu}`);
        }
        await ctx.close();
      }
    }
  }
} finally {
  await browser.close();
  await new Promise((r) => server.close(r)); // never leave the local server running
}

console.log("First screen at 390 px (compressed, as downloaded, lazy photos below the first screen left out):");
for (const [pg, kb] of weights) {
  console.log(`  ${String(kb).padStart(5)} KB  ${pg}`);
  if (kb > BUDGET_KB) problems.push(`${pg}: the first screen is ${kb} KB, over the ${BUDGET_KB} KB budget`);
}
console.log(`\nChecked ${pages.length} pages at ${WIDTHS.join(", ")} px, light and dark.`);
if (problems.length) {
  console.log(`\n${problems.length} problem(s):`);
  for (const x of problems) console.log("  - " + x);
  process.exit(1);
}
console.log("No problems found.");
