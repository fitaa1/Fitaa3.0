// Runs last in the build. Writes one copy of each standalone page per currency and WhatsApp line
// (see scripts/regions.mjs and middleware.ts), from the copy Vite put in dist/:
//   Fully Booked: every [data-price] element, the currency switch, SETTINGS.whatsapp,
//                 SETTINGS.currency and SETTINGS.prices, and the offers in its structured data.
//   Demos:        the WhatsApp number their booking forms open, and the price sign before [rate].
// It also writes the price line in dist/llms.txt from src/config/pricing.json.
// Strict on purpose: if a page no longer has what this expects, the build stops and says what.
import fs from "node:fs";
import path from "node:path";
import { dist, pricing, CURRENCIES, GHANA, COPIES, markHtml, offersFor, rewriteJsonLd, write } from "./regions.mjs";

const read = (rel) => fs.readFileSync(path.join(dist, rel), "utf8");
const FLAGS = JSON.parse(fs.readFileSync(path.join(dist, "..", "src/config/flags.json"), "utf8"));

/* Replaces every match of `re`, after checking how many there are. A text value is passed as a
   function so "$130" is written as it is, never read as a replacement pattern. */
function swap(html, re, value, label, expected = 1) {
  const g = new RegExp(re.source, re.flags.includes("g") ? re.flags : re.flags + "g");
  const n = (html.match(g) || []).length;
  if (n !== expected) throw new Error(`regional-pages: expected ${expected} × ${label}, found ${n}`);
  return html.replace(g, typeof value === "function" ? value : () => value);
}

/* Every currency's text, for the switch on Fully Booked. */
const PRICES = Object.fromEntries(
  CURRENCIES.map((cur) => {
    const c = pricing.currencies[cur];
    return [cur, { getFound: c.getFound.text, getChosen: c.getChosen.text, stayBooked: c.stayBooked.text, getChosenNote: c.getChosenNote, upkeepNote: c.upkeepNote }];
  }),
);

/* ── Fully Booked ─────────────────────────────────────────────────────── */
const fb = read("fully-booked/index.html");
const fbKeys = [...fb.matchAll(/data-price="(\w+)"/g)].map((m) => m[1]);
for (const k of fbKeys) if (!(k in PRICES.USD)) throw new Error(`regional-pages: Fully Booked asks for data-price="${k}", which pricing.json does not have`);
for (const k of ["getFound", "getChosen", "stayBooked", "getChosenNote", "upkeepNote"]) if (!fbKeys.includes(k)) throw new Error(`regional-pages: Fully Booked is missing data-price="${k}"`);

for (const copy of COPIES) {
  const p = PRICES[copy.cur];
  let html = markHtml(fb, copy.cur, copy.number);
  html = html.replace(/(<[a-z0-9]+[^>]*\sdata-price="(\w+)"[^>]*>)([^<]*)(<\/)/g, (all, open, key, _old, close) => `${open}${p[key]}${close}`);
  html = swap(html, /data-currency="(GHS|GBP|USD)" aria-pressed="(true|false)"/, (all, c) => `data-currency="${c}" aria-pressed="${c === copy.cur}"`, "currency button", 3);
  html = swap(html, /(data-currency="(GHS|GBP|USD)"[^>]*data-flag>)(<\/button>)/, (all, open, c, close) => `${open}${FLAGS[c]}${close}`, "footer flag", 3);
  html = swap(html, new RegExp(`whatsapp: '${GHANA}',`), `whatsapp: '${copy.number}',`, "SETTINGS.whatsapp");
  html = swap(html, /currency: 'USD',\n  prices: null,/, `currency: '${copy.cur}',\n  prices: ${JSON.stringify(PRICES)},`, "SETTINGS.currency and SETTINGS.prices");
  const offers = offersFor(copy.cur);
  html = rewriteJsonLd(
    html,
    (body) => body.includes('"@type": "Service"'),
    (data) => {
      for (const offer of data.offers) Object.assign(offer, offers[offer.name]);
      if (data.offers.length !== 3 || data.offers.some((o) => o.priceCurrency !== copy.cur)) throw new Error("regional-pages: Fully Booked offers did not all change currency");
    },
    "Fully Booked service",
  );
  for (const key of new Set(fbKeys)) {
    if (!html.includes(`data-price="${key}">${p[key]}<`)) throw new Error(`regional-pages: ${copy.cur} ${key} did not reach the page`);
  }
  write(`${copy.dir}fully-booked/index.html`, html);
}

/* ── Demos ────────────────────────────────────────────────────────────── */
const DEMOS = {
  "ridge-house": { number: /var HOST_NUMBER = '\d+';/, set: (n) => `var HOST_NUMBER = '${n}';`, syms: 3 },
  "car-rental": { number: /var HOST_NUMBER = '\d+';/, set: (n) => `var HOST_NUMBER = '${n}';`, syms: 3 },
  clinic: { number: /var HOST_NUMBER = '\d+';/, set: (n) => `var HOST_NUMBER = '${n}';`, syms: 4 },
  restaurant: { number: /var HOST_NUMBER = '\d+';/, set: (n) => `var HOST_NUMBER = '${n}';`, syms: 6 },
  studio: { number: /whatsapp: '\d+',/, set: (n) => `whatsapp: '${n}',`, syms: 0, jsSym: true },
  aesthetics: { number: /whatsapp: '\d+',/, set: (n) => `whatsapp: '${n}',`, syms: 0, jsSym: true },
  photographer: { number: /whatsapp: '\d+',/, set: (n) => `whatsapp: '${n}',`, syms: 0, jsSym: true },
};
// Sample prices in the demos are written once, in US dollars, and shown in the visitor's own money
// at a believable size (Nigel, 12 Nov 2026: a lead must see a finished example, and GHS 14 a day for
// a car is not one). Fitaa's own prices never pass through here: they come from pricing.json.
const SAMPLE_RATE = { USD: 1, GHS: 11.75, GBP: 0.757 }; // the 4 Nov 2026 rates noted in pricing.json
const sampleAmount = (usd, cur) => {
  const raw = Number(usd) * SAMPLE_RATE[cur];
  if (cur === "USD") return Number(usd);
  const step = cur === "GHS" ? (raw >= 100 ? 10 : 5) : (raw >= 40 ? 5 : 1);
  return Math.max(step, Math.round(raw / step) * step);
};
const money = (n) => n.toLocaleString("en-GB");
function sampleMoney(html, cur, sym, name) {
  let n = 0;
  // 1. A sign followed by a number in the page itself.
  html = html.replace(/(<span data-sym>[^<]*<\/span>)(\d[\d,]*)/g, (_, sign, amt) => { n++; return sign + money(sampleAmount(amt.replace(/,/g, ""), cur)); });
  // 2. A sum written inside a sentence.
  html = html.replace(/<span data-money>\$(\d+)<\/span>/g, (_, amt) => { n++; return `<span data-money>${sym}${money(sampleAmount(amt, cur))}</span>`; });
  // 3. The price list in a page's SETTINGS.
  html = html.replace(/(prices: \{)([^}]*)(\})/, (_, a, body, z) => a + body.replace(/: '(\d+)'/g, (_m, amt) => { n++; return `: '${money(sampleAmount(amt, cur))}'`; }) + z);
  if (!n) throw new Error(`regional-pages: ${name} has no sample prices to show in ${cur}`);
  return html;
}
for (const [name, d] of Object.entries(DEMOS)) {
  const src = read(`demo/${name}/index.html`);
  for (const copy of COPIES) {
    const sym = pricing.currencies[copy.cur].symbol;
    let html = markHtml(src, copy.cur, copy.number);
    html = swap(html, d.number, d.set(copy.number), `${name} WhatsApp number`);
    if (d.syms) html = swap(html, /<span data-sym>[^<]*<\/span>/, `<span data-sym>${sym}</span>`, `${name} price sign`, d.syms);
    if (d.jsSym) html = swap(html, /sym: '[^']*',/, `sym: '${sym}',`, `${name} SETTINGS.sym`);
    html = sampleMoney(html, copy.cur, sym, name);
    write(`${copy.dir}demo/${name}/index.html`, html);
  }
}

/* ── llms.txt: the published prices, all three currencies ─────────────── */
const c = pricing.currencies;
const all = (key) => CURRENCIES.map((cur) => c[cur][key].text).join(" / ");
const line =
  `- [Fully Booked by Fitaa](https://fitaacreative.com/fully-booked): the three packages in full, for any business that takes bookings or enquiries (car rentals, clinics, short-let hosts, studios and more), in Ghana, the UK and beyond. ` +
  `Prices are fixed in three currencies (visitors in Ghana see GHS, in the UK GBP, everywhere else USD). ` +
  `Get Found ${all("getFound")} one-off, live in 5 days (Google Business Profile, WhatsApp Business, click-to-chat link, QR card). ` +
  `Get Chosen ${all("getChosen")} one-off, live in 7 days (a premium one-page website on your own web address, built for Google and AI answers, with WhatsApp booking). ` +
  `Stay Booked ${all("stayBooked")} a month, 3-month minimum (Meta ads management, updates, monthly report; ad budget separate). ` +
  `Upkeep only ${all("upkeep")} a month. Live in 7 days, or 50% of your fee back. Payment is once, in full, before work starts.`;
const llms = read("llms.txt");
write("llms.txt", swap(llms, /^- \[Fully Booked by Fitaa\]\(.*$/m, line, "Fully Booked line in llms.txt"));

console.log(`regional-pages: Fully Booked and ${Object.keys(DEMOS).length} demos written in ${COPIES.length} copies each; llms.txt prices written`);
