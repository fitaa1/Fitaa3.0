// Run with: npm test (node --test tests/*.test.mjs). Fakes the country header Vercel sets
// (x-vercel-ip-country) and checks which copy of each page middleware.ts sends the visitor to.
import { test } from "node:test";
import assert from "node:assert/strict";
import middleware, { choose, cleanPath, isCrawler, PAGES } from "../middleware.ts";

const BASE = "https://fitaacreative.com";
const PHONE_UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1";

function visit(path, { country, cookie, ua = PHONE_UA } = {}) {
  const headers = new Headers({ "user-agent": ua });
  if (country) headers.set("x-vercel-ip-country", country);
  if (cookie) headers.set("cookie", cookie);
  return middleware(new Request(BASE + path, { headers }));
}
/** Where the visitor ends up: the copy's path, "default" for the page itself, or a redirect. */
function outcome(res) {
  const to = res.headers.get("x-middleware-rewrite");
  if (to) return new URL(to).pathname + new URL(to).search;
  if (res.status >= 300 && res.status < 400) return "redirect " + new URL(res.headers.get("location")).pathname;
  if (res.headers.get("x-middleware-next")) return "default";
  return "unknown " + res.status;
}

test("Ghana sees GHS with the Ghana WhatsApp line", () => {
  assert.equal(outcome(visit("/", { country: "GH" })), "/_r/ghs-gh/index.html");
  assert.equal(outcome(visit("/fully-booked", { country: "GH" })), "/_r/ghs-gh/fully-booked/index.html");
  assert.equal(outcome(visit("/demo/car-rental", { country: "gh" })), "/_r/ghs-gh/demo/car-rental/index.html");
});

test("The United Kingdom sees GBP with the UK WhatsApp line", () => {
  assert.equal(outcome(visit("/", { country: "GB" })), "/_r/gbp-uk/index.html");
  assert.equal(outcome(visit("/fully-booked/", { country: "GB" })), "/_r/gbp-uk/fully-booked/index.html");
  assert.equal(outcome(visit("/demo/studio", { country: "GB" })), "/_r/gbp-uk/demo/studio/index.html");
});

test("Every other country, or no country, sees USD with the Ghana line (the page as built)", () => {
  for (const country of ["US", "NG", "FR", "IE", "JE", undefined]) {
    assert.equal(outcome(visit("/", { country })), "default", `country ${country}`);
    assert.equal(outcome(visit("/fully-booked", { country })), "default", `country ${country}`);
  }
});

test("A saved choice changes the currency but never the WhatsApp line", () => {
  assert.equal(outcome(visit("/fully-booked", { country: "GH", cookie: "fitaa_cur=usd" })), "default");
  assert.equal(outcome(visit("/fully-booked", { country: "GH", cookie: "a=1; fitaa_cur=gbp" })), "/_r/gbp-gh/fully-booked/index.html");
  assert.equal(outcome(visit("/", { country: "GB", cookie: "fitaa_cur=ghs" })), "/_r/ghs-uk/index.html");
  assert.equal(outcome(visit("/", { country: "GB", cookie: "fitaa_cur=usd" })), "/_r/usd-uk/index.html");
  assert.equal(outcome(visit("/", { country: "US", cookie: "fitaa_cur=GHS" })), "/_r/ghs-gh/index.html");
  /* Anything else in the cookie is ignored. */
  assert.equal(outcome(visit("/", { country: "GH", cookie: "fitaa_cur=eur" })), "/_r/ghs-gh/index.html");
  assert.equal(outcome(visit("/", { country: "GH", cookie: "my_fitaa_cur=gbp" })), "/_r/ghs-gh/index.html");
});

test("Search engines and AI crawlers always get the USD page, wherever they crawl from", () => {
  const crawlers = [
    "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
    "Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.7390.122 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
    "Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)",
    "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; GPTBot/1.2; +https://openai.com/gptbot)",
    "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; ClaudeBot/1.0; +claudebot@anthropic.com)",
    "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; PerplexityBot/1.0; +https://perplexity.ai/perplexitybot)",
  ];
  for (const ua of crawlers) {
    assert.equal(outcome(visit("/fully-booked", { country: "GH", ua, cookie: "fitaa_cur=gbp" })), "default", ua);
    assert.equal(outcome(visit("/", { country: "GB", ua })), "default", ua);
  }
});

test("People are not mistaken for crawlers (phones, browsers, link previews)", () => {
  const people = [
    PHONE_UA,
    "Mozilla/5.0 (Linux; Android 13; CUBOT KINGKONG 9 Build/TP1A) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Mobile Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0 Safari/537.36",
    "WhatsApp/2.24.6.77 A",
  ];
  for (const ua of people) assert.equal(isCrawler(ua), false, ua);
  assert.equal(outcome(visit("/", { country: "GB", ua: people[1] })), "/_r/gbp-uk/index.html");
});

test("Query strings ride along (for example ?demo=cars)", () => {
  assert.equal(outcome(visit("/fully-booked?demo=cars", { country: "GB" })), "/_r/gbp-uk/fully-booked/index.html?demo=cars");
});

test("The copies are never served at their own address", () => {
  assert.equal(outcome(visit("/_r/gbp-uk/fully-booked/index.html", { country: "GB" })), "redirect /fully-booked");
  assert.equal(outcome(visit("/_r/ghs-gh/index.html")), "redirect /");
  assert.equal(visit("/_r/ghs-gh/index.html").status, 308);
});

test("Pages without prices or WhatsApp pass straight through", () => {
  assert.equal(outcome(visit("/privacy", { country: "GB" })), "default");
  assert.equal(outcome(visit("/demo/unknown", { country: "GB" })), "default");
});

test("cleanPath and the page list", () => {
  assert.equal(cleanPath("/"), "/");
  assert.equal(cleanPath("/index.html"), "/");
  assert.equal(cleanPath("/fully-booked/"), "/fully-booked");
  assert.equal(cleanPath("/fully-booked/index.html"), "/fully-booked");
  assert.deepEqual(choose(new Headers({ "x-vercel-ip-country": "GB" })), { currency: "gbp", line: "uk" });
  for (const file of Object.values(PAGES)) assert.match(file, /^\/.*index\.html$/);
});
