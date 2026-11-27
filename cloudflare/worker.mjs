/* ═══════════════════════════════════════════════════════════════════════════
 * fitaacreative.com on Cloudflare, ready to take over if Vercel stops (Nigel, 26 Nov 2026).
 *
 * Vercel stays the live host. This Worker serves the same built site (dist/) at its own
 * workers.dev address, so swapping fitaacreative.com to it is a DNS change, nothing else.
 * It does exactly what Vercel does for this site, reading the same files:
 *   - prices and WhatsApp by country: middleware.ts's own choose(), with Cloudflare's
 *     country header in place of Vercel's, so both hosts always choose the same copy;
 *   - vercel.json's rewrites, security headers and asset caching, read from vercel.json
 *     itself, so a change there reaches both hosts;
 *   - the 404 page for anything else.
 * tests/cloudflare.test.mjs holds the two together.
 * ═══════════════════════════════════════════════════════════════════════════ */
import { choose, cleanPath, PAGES } from "../middleware.ts";
import VERCEL from "../vercel.json" with { type: "json" };

const REWRITES = Object.fromEntries(VERCEL.rewrites.map((r) => [r.source, r.destination]));
const ALL = VERCEL.headers.find((h) => h.source === "/(.*)").headers;
const ASSET_CACHE = VERCEL.headers.find((h) => h.source === "/assets/(.*)").headers;

/** The file in dist/ that answers this address, before country copies. */
export function fileFor(pathname) {
  const clean = cleanPath(pathname);
  if (PAGES[clean]) return PAGES[clean];
  if (REWRITES[clean]) return REWRITES[clean];
  if (pathname.endsWith("/")) return `${pathname}index.html`;
  return pathname;
}

/** Vercel's country header from Cloudflare's, so middleware.ts decides for both hosts. */
export function asVercel(headers) {
  const h = new Headers(headers);
  const country = headers.get("cf-ipcountry");
  if (country && country !== "XX" && country !== "T1") h.set("x-vercel-ip-country", country);
  return h;
}

function finish(res, pathname, extra = {}) {
  const out = new Response(res.body, res);
  for (const { key, value } of ALL) out.headers.set(key, value);
  if (pathname.startsWith("/assets/")) for (const { key, value } of ASSET_CACHE) out.headers.set(key, value);
  for (const [k, v] of Object.entries(extra)) out.headers.set(k, v);
  return out;
}

export async function handle(request, env) {
  const url = new URL(request.url);

  // The copies are only served through their clean address, as on Vercel.
  if (url.pathname.startsWith("/_r/")) {
    const rest = url.pathname.replace(/^\/_r\/[^/]+/, "") || "/";
    return finish(Response.redirect(new URL(cleanPath(rest) + url.search, url).toString(), 308), url.pathname);
  }

  let file = fileFor(url.pathname);
  let vary = {};
  if (PAGES[cleanPath(url.pathname)]) {
    const { currency, line } = choose(asVercel(request.headers));
    if (!(currency === "usd" && line === "gh")) file = `/_r/${currency}-${line}${file}`;
    // One country's prices must never be cached for another.
    vary = { "cache-control": "private, no-cache" };
  }

  const res = await env.ASSETS.fetch(new Request(new URL(file, url), request));
  if (res.status === 404) {
    const page = await env.ASSETS.fetch(new Request(new URL("/404.html", url), request));
    return finish(new Response(page.body, { status: 404, headers: page.headers }), url.pathname);
  }
  return finish(res, url.pathname, vary);
}

export default { fetch: (request, env) => handle(request, env) };
