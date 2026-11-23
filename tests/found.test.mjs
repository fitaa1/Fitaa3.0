// Found by people and AI answers searching for an agency in Accra without knowing the name (Nigel, 22 Nov 2026).
// SITE_STANDARD.md, Found, trusted and chosen.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
const html = fs.readFileSync(new URL("../index.html", import.meta.url), "utf8");
const ld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m => JSON.parse(m[1]));
const biz = ld.flatMap(d => d["@graph"] || [d]).find(n => n["@id"]?.endsWith("#business"));

test("the title and description name what Fitaa Creative is and where it is", () => {
  const title = html.match(/<title>([^<]*)<\/title>/)[1].replace(/&amp;/g, "&");
  assert.match(title, /Digital Marketing Agency/i);
  assert.match(title, /Accra/);
  assert.ok(title.length <= 70, `title is ${title.length} characters, Google cuts long titles`);
  const desc = html.match(/<meta name="description" content="([^"]*)"/)[1];
  assert.match(desc, /digital marketing agency in East Legon, Accra/i);
  assert.ok(desc.length <= 170, `description is ${desc.length} characters, Google shows about 160`);
  for (const p of ["og:title", "twitter:title"]) {
    const m = html.match(new RegExp(`(?:property|name)="${p}"\\s+content="([^"]*)"`));
    assert.ok(m, `${p} present`); assert.match(m[1], /Accra/);
  }
});

test("canonical, robots and the sitemap let Google index the page", () => {
  assert.match(html, /<link rel="canonical" href="https:\/\/fitaacreative\.com\/" \/>/);
  assert.match(html, /<meta name="robots" content="index, follow/);
  const robots = fs.readFileSync(new URL("../public/robots.txt", import.meta.url), "utf8");
  assert.match(robots, /Allow: \//); assert.doesNotMatch(robots, /Disallow: \/\s*$/m);
  assert.match(robots, /Sitemap: https:\/\/fitaacreative\.com\/sitemap\.xml/);
  const map = fs.readFileSync(new URL("../public/sitemap.xml", import.meta.url), "utf8");
  for (const u of ["https://fitaacreative.com/", "https://fitaacreative.com/fully-booked"]) assert.ok(map.includes(`<loc>${u}</loc>`), u);
});

test("the business data says it is in Accra and serves Accra", () => {
  assert.ok(biz, "a business node with @id #business");
  assert.match(biz.address.addressLocality, /Accra/);
  assert.equal(biz.address.addressCountry, "GH");
  assert.ok(biz.areaServed.some(a => a["@type"] === "City" && a.name === "Accra"));
  assert.ok(biz.knowsAbout.includes("Digital marketing"));
  assert.ok(biz.telephone && biz.url && biz.logo && biz.image);
});

test("the share card is the full 1200 by 630 size", () => {
  assert.match(html, /property="og:image:width"\s+content="1200"/);
  assert.match(html, /property="og:image:height"\s+content="630"/);
});
