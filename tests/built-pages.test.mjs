// Checks the built copies (run `npm run build` first; this skips if dist/ is missing).
// Every page middleware.ts can send a visitor to must exist, say its own currency and WhatsApp
// line, show only that currency's prices, and carry valid structured data in that currency.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { PAGES } from "../middleware.ts";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const dist = path.join(root, "dist");
const pricing = JSON.parse(fs.readFileSync(path.join(root, "src/config/pricing.json"), "utf8"));
const built = fs.existsSync(path.join(dist, "_r"));
const GH = "233242805256";

const copies = [];
for (const cur of ["ghs", "gbp", "usd"]) for (const line of ["gh", "uk"]) copies.push({ cur, line, dir: cur === "usd" && line === "gh" ? "" : `_r/${cur}-${line}` });

/* Every price text of the other two currencies, so a copy can be searched for any of them. */
const others = (cur) =>
  pricing.order.filter((c) => c !== cur).flatMap((c) =>
    ["getFound", "getChosen", "stayBooked", "founding", "upkeep"].map((k) => pricing.currencies[c][k].text),
  );

test("every copy middleware.ts can serve exists, in its own currency and WhatsApp line", { skip: !built && "run npm run build first" }, () => {
  for (const file of Object.values(PAGES)) {
    for (const { cur, line, dir } of copies) {
      const f = path.join(dist, dir, file);
      assert.ok(fs.existsSync(f), `missing ${dir}${file}`);
      const html = fs.readFileSync(f, "utf8");
      const tag = html.match(/<html lang="en" data-cur="([A-Z]{3})" data-wa="(\d+)">/);
      assert.ok(tag, `${dir}${file}: <html> has no data-cur and data-wa`);
      assert.equal(tag[1], cur.toUpperCase(), `${dir}${file}: wrong currency`);
      if (line === "gh") assert.equal(tag[2], GH, `${dir}${file}: Ghana copy must use the Ghana number`);
      /* Every WhatsApp number written into the page is this copy's number. */
      const numbers = [...html.matchAll(/wa\.me\/(\d+)|HOST_NUMBER = '(\d+)'|whatsapp: '(\d+)'/g)].map((m) => m[1] || m[2] || m[3]);
      assert.ok(numbers.length > 0, `${dir}${file}: no WhatsApp number found`);
      for (const n of numbers) assert.equal(n, tag[2], `${dir}${file}: WhatsApp ${n} is not this copy's number`);
      /* Structured data parses and speaks one currency. */
      for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
        const body = m[1];
        assert.doesNotThrow(() => JSON.parse(body), `${dir}${file}: structured data is not valid JSON`);
        for (const c of body.matchAll(/"priceCurrency": "([A-Z]+)"/g)) assert.equal(c[1], cur.toUpperCase(), `${dir}${file}: offer in ${c[1]}`);
      }
    }
  }
});

test("Fully Booked shows only the copy's own currency on screen", { skip: !built && "run npm run build first" }, () => {
  for (const { cur, dir } of copies) {
    const html = fs.readFileSync(path.join(dist, dir, "fully-booked/index.html"), "utf8");
    const p = pricing.currencies[cur.toUpperCase()];
    /* Visible text only: drop the switch's price list in SETTINGS and the structured data. */
    const visible = html.replace(/<script[\s\S]*?<\/script>/g, "").replace(/<style[\s\S]*?<\/style>/g, "");
    for (const k of ["getFound", "getChosen", "stayBooked"]) assert.ok(visible.includes(`>${p[k].text}<`), `${dir}: ${k} ${p[k].text} not shown`);
    assert.ok(visible.includes(p.foundingNote), `${dir}: founding note`);
    assert.ok(visible.includes(p.upkeepNote), `${dir}: upkeep note`);
    for (const t of others(cur.toUpperCase())) assert.ok(!visible.includes(`>${t}<`), `${dir}: shows another currency's price ${t}`);
    assert.match(visible, new RegExp(`data-currency="${cur.toUpperCase()}" aria-pressed="true"`), `${dir}: switch does not mark ${cur}`);
    assert.equal((visible.match(/aria-pressed="true"/g) || []).length, 1, `${dir}: exactly one currency pressed`);
  }
});

test("demos show the copy's price sign", { skip: !built && "run npm run build first" }, () => {
  for (const { cur, dir } of copies) {
    const sym = pricing.currencies[cur.toUpperCase()].symbol;
    for (const demo of ["ridge-house", "car-rental", "clinic", "restaurant"]) {
      const html = fs.readFileSync(path.join(dist, dir, `demo/${demo}/index.html`), "utf8");
      const signs = [...html.matchAll(/<span data-sym>([^<]*)<\/span>/g)].map((m) => m[1]);
      assert.ok(signs.length > 0 && signs.every((s) => s === sym), `${dir} ${demo}: signs ${signs}`);
    }
    for (const demo of ["studio", "aesthetics", "photographer"]) {
      const html = fs.readFileSync(path.join(dist, dir, `demo/${demo}/index.html`), "utf8");
      assert.ok(html.includes(`sym: '${sym}',`), `${dir} ${demo}: sign`);
    }
  }
});

test("llms.txt lists the prices in all three currencies", { skip: !built && "run npm run build first" }, () => {
  const txt = fs.readFileSync(path.join(dist, "llms.txt"), "utf8");
  for (const cur of pricing.order) for (const k of ["getFound", "getChosen", "stayBooked", "founding", "upkeep"]) assert.ok(txt.includes(pricing.currencies[cur][k].text), `${cur} ${k}`);
});

test("the currency flags sit only in the footer, quiet, with the copy's currency pressed", { skip: !built && "run npm run build first" }, () => {
  for (const { cur, dir } of copies) {
    for (const file of ["index.html", "fully-booked/index.html"]) {
      const html = fs.readFileSync(path.join(dist, dir, file), "utf8");
      const footer = html.slice(html.lastIndexOf("<footer"));
      const before = html.slice(0, html.lastIndexOf("<footer"));
      assert.ok(!/data-currency=/.test(before), `${dir}${file}: a currency control sits above the footer`);
      const flags = [...footer.matchAll(/<button[^>]*data-currency="(\w+)" aria-pressed="(true|false)"[^>]*>(<svg[\s\S]*?<\/svg>)<\/button>/g)];
      assert.equal(flags.length, 3, `${dir}${file}: expected 3 flag buttons with SVGs, found ${flags.length}`);
      assert.deepEqual(flags.filter((m) => m[2] === "true").map((m) => m[1]), [cur.toUpperCase()], `${dir}${file}: wrong flag pressed`);
    }
  }
});
