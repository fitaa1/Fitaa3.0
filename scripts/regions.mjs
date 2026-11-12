// Shared by scripts/prerender.mjs and scripts/regional-pages.mjs: the prices, the two WhatsApp
// lines and the copies each page gets. middleware.ts picks a copy per visitor; see the note there.
import fs from "node:fs";
import path from "node:path";

export const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
export const dist = path.join(root, "dist");

export const pricing = JSON.parse(fs.readFileSync(path.join(root, "src/config/pricing.json"), "utf8"));
export const CURRENCIES = pricing.order; // ["GHS", "GBP", "USD"]

/* Strict: every price's plain number must match its text, so search engines and visitors
   are never shown two different figures. */
for (const cur of CURRENCIES) {
  const c = pricing.currencies[cur];
  if (!c) throw new Error(`pricing.json: ${cur} is listed in "order" but has no prices`);
  for (const key of ["getFound", "getChosen", "stayBooked", "upkeep"]) {
    const p = c[key];
    if (!p || typeof p.amount !== "number" || typeof p.text !== "string")
      throw new Error(`pricing.json: ${cur}.${key} needs an amount and a text`);
    const digits = p.text.replace(/[^\d.]/g, "");
    if (Number(digits) !== p.amount) throw new Error(`pricing.json: ${cur}.${key} text "${p.text}" does not match amount ${p.amount}`);
  }
  for (const key of ["getChosenNote", "upkeepNote"]) {
    if (typeof c[key] !== "string" || !c[key]) throw new Error(`pricing.json: ${cur}.${key} is missing`);
  }
}

/* The Ghana number comes from the one phone number in src/config/site.ts. */
const siteTs = fs.readFileSync(path.join(root, "src/config/site.ts"), "utf8");
const phone = (siteTs.match(/phone:\s*"([^"]+)"/) || [])[1];
if (!phone) throw new Error("regions: could not read contact.phone from src/config/site.ts");
export const GHANA = phone.replace(/\D/g, "").replace(/^0/, "233");

/* The UK number lives only in Vercel (UK_WHATSAPP), never in the repo. Any common way of
   writing it works: +44 7700 900123, 07700 900123, 447700900123. */
function ukNumber() {
  const raw = process.env.UK_WHATSAPP;
  if (!raw || !raw.trim()) {
    console.log("regions: UK_WHATSAPP is not set, so UK visitors get the Ghana WhatsApp number");
    return null;
  }
  let d = raw.replace(/\D/g, "");
  if (d.startsWith("00")) d = d.slice(2);
  if (d.startsWith("0")) d = "44" + d.slice(1);
  if (!/^44\d{9,10}$/.test(d)) {
    console.warn("regions: WARNING UK_WHATSAPP is set but is not a UK number (+44 and 9 or 10 digits). UK visitors get the Ghana WhatsApp number until it is fixed in Vercel.");
    return null;
  }
  console.log("regions: UK_WHATSAPP is set, UK visitors get the UK WhatsApp number");
  return d;
}
export const UK = ukNumber();
export const LINES = { gh: GHANA, uk: UK || GHANA };

/* Every copy: 3 currencies × 2 WhatsApp lines. USD with the Ghana line is the default copy,
   at the page's own path; the others go under dist/_r/<currency>-<line>/. */
export const COPIES = CURRENCIES.flatMap((cur) =>
  ["gh", "uk"].map((line) => ({
    cur,
    line,
    number: LINES[line],
    dir: cur === pricing.default && line === "gh" ? "" : `_r/${cur.toLowerCase()}-${line}/`,
  })),
);

/** Puts the currency and WhatsApp number on the <html> tag, where the page's scripts read them. */
export function markHtml(html, cur, number) {
  if (!/<html lang="en"[^>]*>/.test(html)) throw new Error('regions: <html lang="en"> not found');
  return html.replace(/<html lang="en"[^>]*>/, `<html lang="en" data-cur="${cur}" data-wa="${number}">`);
}

/** Rewrites the offers in a page's structured data to one currency's prices. */
const OFFER_KEYS = { "Get Found": "getFound", "Get Chosen": "getChosen", "Stay Booked": "stayBooked" };
export function offersFor(cur) {
  const c = pricing.currencies[cur];
  return Object.fromEntries(Object.entries(OFFER_KEYS).map(([name, key]) => [name, { price: String(c[key].amount), priceCurrency: cur }]));
}
export function rewriteJsonLd(html, test, edit, label) {
  const re = /(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/g;
  let hits = 0;
  const out = html.replace(re, (all, open, body, close) => {
    if (!test(body)) return all;
    hits++;
    const data = JSON.parse(body);
    edit(data);
    return `${open}\n${JSON.stringify(data, null, 2)}\n${close}`;
  });
  if (hits !== 1) throw new Error(`regions: expected one ${label} structured data block, found ${hits}`);
  return out;
}

export function write(rel, html) {
  const file = path.join(dist, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
}
