// Rebuilds the share cards (the picture WhatsApp, iMessage and social apps show when a link is
// sent): 1200 × 630 JPEGs in each page's own fonts and story. See SITE_STANDARD.md.
//
//   npm run build && node scripts/share-cards.mjs
//
// Home, Ridge House and Studio are designed cards (the HTML below). Car rental, clinic and
// restaurant are their own page hero, rendered from dist/ at 1200 × 630.
// Every card gets the new file name in CARD (change it whenever a card changes, so WhatsApp
// fetches it fresh); the script points each page's og:image and twitter:image at it and deletes
// the old file. Needs the network for Google Fonts.
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const pub = path.join(root, "public");
const CARD = "og-2026-11-06.jpg";

const font = (q) => `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?${q}&display=block">`;
const base = `*{box-sizing:border-box;margin:0}html,body{width:1200px;height:630px;overflow:hidden}`;
const logo = "data:image/webp;base64," + fs.readFileSync(path.join(pub, "logo-160.webp")).toString("base64");

const designed = {
  /* Home: the hero's headline and colours. */
  "": `${font("family=Bricolage+Grotesque:opsz,wght@12..96,700..800&family=Inter:wght@400;500;600")}
<style>${base}
body{font-family:Inter,sans-serif;color:#eff4fa;padding:56px 64px;position:relative;
  background:
    radial-gradient(700px 420px at 1100px 300px,#064e5d 0%,rgba(6,78,93,0) 70%),
    radial-gradient(800px 500px at 0 0,#122953 0%,rgba(18,41,83,0) 70%),
    #090e12}
body:before{content:"";position:absolute;inset:0;
  background-image:linear-gradient(rgba(255,255,255,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.035) 1px,transparent 1px);
  background-size:48px 48px}
.brand{position:relative;display:flex;align-items:center;gap:14px}
.brand img{width:52px;height:52px;border-radius:12px}
.brand b{display:block;font-size:19px;font-weight:600;letter-spacing:.32em}
.brand small{display:block;font-size:9.5px;letter-spacing:.42em;color:#9fb0c3;margin-top:3px}
h1{position:relative;margin-top:118px;font-family:'Bricolage Grotesque',sans-serif;font-weight:800;font-size:84px;line-height:.98;letter-spacing:-.035em}
h1 span{display:block;color:#05dbff}
.foot{position:absolute;left:64px;right:64px;bottom:62px;display:flex;align-items:flex-end;justify-content:space-between}
.foot p{font-size:21px;font-weight:500}
.foot p small{display:block;margin-top:8px;font-size:15.5px;font-weight:400;color:#9fb0c3}
.pill{padding:14px 22px;border-radius:6px;background:linear-gradient(135deg,#f7cc64,#e8a23c);color:#14130f;font-size:14px;font-weight:600;letter-spacing:.16em}
</style>
<div class="brand"><img src="${logo}" alt=""><div><b>FITAA</b><small>CREATIVE</small></div></div>
<h1>Turn Eyeballs<span>Into Revenue.</span></h1>
<div class="foot"><p>Get Found · Get Chosen · Stay Booked · Design<small>Websites, Google, WhatsApp and Meta ads. Ghana, the UK and beyond.</small></p><span class="pill">FITAACREATIVE.COM</span></div>`,

  "demo/ridge-house/": `${font("family=Manrope:wght@400;500;600;700")}
<style>${base}
body{font-family:Manrope,sans-serif;color:#F2EBDD;padding:64px 64px 0;
  background:radial-gradient(620px 420px at 1000px 90px,#2b301f 0%,rgba(43,48,31,0) 70%),#0E1B17}
.eyebrow{font-size:14.5px;letter-spacing:3px;text-transform:uppercase;color:#D4A85A;font-weight:700}
h1{margin-top:30px;font-weight:600;font-size:70px;line-height:1.06;letter-spacing:-.02em;max-width:900px}
p{margin-top:26px;font-size:21px;line-height:1.5;color:#C9C1B2;max-width:640px}
.foot{position:absolute;left:64px;right:64px;bottom:58px;padding-top:26px;border-top:1px solid #2a4237;display:flex;justify-content:space-between;align-items:center}
.foot b{font-size:23px;font-weight:600}
.pill{padding:10px 18px;border-radius:999px;background:#D4A85A;color:#14130F;font-size:14px;font-weight:700}
</style>
<div class="eyebrow">Serviced apartments · Near the airport</div>
<h1>Home in the city, from the moment you land.</h1>
<p>Book directly with the host on WhatsApp. No platform fees, and a real person answers.</p>
<div class="foot"><b>Ridge House Residences</b><span class="pill">Demo by Fitaa Creative</span></div>`,

  "demo/studio/": `${font("family=Jost:wght@400;500&family=Manrope:wght@400;600;700")}
<style>${base}
body{font-family:Manrope,sans-serif;color:#2A1E22;padding:64px 64px 0;
  background:radial-gradient(560px 480px at 1150px 300px,#f4e3e2 0%,rgba(244,227,226,0) 72%),#FBF6F2}
.eyebrow{font-size:14px;letter-spacing:3px;text-transform:uppercase;color:#8E4352;font-weight:700}
h1{margin-top:30px;font-family:Jost,sans-serif;font-weight:500;font-size:72px;line-height:1.06;letter-spacing:-.005em;max-width:900px}
p{margin-top:26px;font-size:21px;line-height:1.5;color:#6B5A5F;max-width:640px}
.foot{position:absolute;left:64px;right:64px;bottom:58px;padding-top:26px;border-top:1px solid #E7D9D0;display:flex;justify-content:space-between;align-items:center}
.foot b{font-family:Jost,sans-serif;font-size:24px;font-weight:500}
.pill{padding:10px 18px;border-radius:999px;background:#8E4352;color:#FFF7F3;font-size:14px;font-weight:700}
</style>
<div class="eyebrow">Beauty studio · By appointment</div>
<h1>Leave looking like the best day of your year.</h1>
<p>See the menu, pick your slot and confirm on WhatsApp in under a minute.</p>
<div class="foot"><b>Maison Adwoa</b><span class="pill">Demo by Fitaa Creative</span></div>`,
};

/* Page heroes, from the built default copy. */
const heroes = ["demo/car-rental/", "demo/clinic/", "demo/restaurant/"];

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1, reducedMotion: "reduce" });
const page = await ctx.newPage();

async function shoot(dir) {
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(400);
  const out = path.join(pub, dir, CARD);
  await page.screenshot({ path: out, type: "jpeg", quality: 86 });
  return out;
}

const made = [];
for (const [dir, html] of Object.entries(designed)) {
  await page.setContent(`<!doctype html><meta charset="utf-8">${html}`, { waitUntil: "networkidle" });
  made.push([dir, await shoot(dir)]);
}
for (const dir of heroes) {
  const file = path.join(root, "dist", dir, "index.html");
  if (!fs.existsSync(file)) throw new Error(`share-cards: ${file} missing, run npm run build first`);
  await page.goto(pathToFileURL(file).href, { waitUntil: "networkidle" });
  /* The card shows the business, not the "this is a demo" bar or the clinic's emergency notice. */
  await page.addStyleTag({ content: ".demo-bar,.urgent{display:none!important}.reveal{opacity:1!important;transform:none!important}" });
  made.push([dir, await shoot(dir)]);
}
await browser.close();

/* Point each page at its new card and remove the card it replaces. */
for (const [dir] of made) {
  const htmlFile = dir === "" ? path.join(root, "index.html") : path.join(pub, dir, "index.html");
  let html = fs.readFileSync(htmlFile, "utf8");
  const re = new RegExp(`(https://fitaacreative\\.com/${dir.replace(/\//g, "\\/")})(og[\\w-]*\\.jpg)`, "g");
  const old = new Set([...html.matchAll(re)].map((m) => m[2]));
  if (old.size !== 1) throw new Error(`share-cards: ${htmlFile} should name one card, found ${[...old].join(", ") || "none"}`);
  const [was] = old;
  if (was !== CARD) {
    html = html.replace(re, `$1${CARD}`);
    fs.writeFileSync(htmlFile, html);
    fs.rmSync(path.join(pub, dir, was), { force: true });
  }
  console.log(`share-cards: ${dir || "home"} → ${dir}${CARD}${was !== CARD ? ` (replaces ${was})` : ""}`);
}
