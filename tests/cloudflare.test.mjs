// The Cloudflare standby copy (cloudflare/worker.mjs) must choose the same page, prices and headers as
// Vercel (middleware.ts, vercel.json), so swapping hosts changes nothing a visitor sees (Nigel, 26 Nov 2026).
import { test } from "node:test";
import assert from "node:assert/strict";
import { handle, fileFor, asVercel } from "../cloudflare/worker.mjs";

const files = new Set(["/index.html", "/fully-booked/index.html", "/_r/gbp-uk/fully-booked/index.html", "/_r/ghs-gh/index.html", "/privacy/index.html", "/404.html", "/assets/app.js"]);
const env = { ASSETS: { fetch: async (req) => { const p = new URL(req.url).pathname; return files.has(p) ? new Response(p) : new Response("missing", { status: 404 }); } } };
const visit = (path, headers = {}) => handle(new Request(`https://fitaa-creative.test${path}`, { headers: { "user-agent": "Mozilla/5.0 (iPhone)", ...headers } }), env);

test("each country gets the same copy as on Vercel", async () => {
  assert.equal(await (await visit("/fully-booked", { "cf-ipcountry": "GB" })).text(), "/_r/gbp-uk/fully-booked/index.html");
  assert.equal(await (await visit("/", { "cf-ipcountry": "GH" })).text(), "/_r/ghs-gh/index.html");
  assert.equal(await (await visit("/fully-booked", { "cf-ipcountry": "US" })).text(), "/fully-booked/index.html");
  assert.equal(await (await visit("/fully-booked", { "cf-ipcountry": "GB", "user-agent": "Googlebot" })).text(), "/fully-booked/index.html");
});

test("a priced page is never cached for another country", async () => {
  assert.match((await visit("/", { "cf-ipcountry": "GH" })).headers.get("cache-control"), /private/);
});

test("vercel.json's rewrites, headers and caching apply", async () => {
  assert.equal(fileFor("/privacy"), "/privacy/index.html");
  const r = await visit("/privacy");
  assert.equal(await r.text(), "/privacy/index.html");
  assert.equal(r.headers.get("x-frame-options"), "SAMEORIGIN");
  assert.match((await visit("/assets/app.js")).headers.get("cache-control"), /immutable/);
});

test("unknown addresses get the 404 page, and stray copies go to their clean address", async () => {
  const r = await visit("/nope");
  assert.equal(r.status, 404);
  assert.equal(await r.text(), "/404.html");
  const s = await visit("/_r/gbp-uk/fully-booked/");
  assert.equal(s.status, 308);
  assert.equal(new URL(s.headers.get("location")).pathname, "/fully-booked");
});

test("Cloudflare's unknown-country codes are not passed on as a country", () => {
  assert.equal(asVercel(new Headers({ "cf-ipcountry": "XX" })).get("x-vercel-ip-country"), null);
  assert.equal(asVercel(new Headers({ "cf-ipcountry": "GB" })).get("x-vercel-ip-country"), "GB");
});
