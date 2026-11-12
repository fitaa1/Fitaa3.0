/* ═══════════════════════════════════════════════════════════════════════════
 * Prices and WhatsApp by country (Vercel Routing Middleware, runs before the CDN cache).
 *
 * The build (scripts/prerender.mjs and scripts/regional-pages.mjs) writes one copy of
 * each page per currency and WhatsApp line:
 *   dist/<page>                         USD prices, Ghana WhatsApp (the default copy)
 *   dist/_r/<currency>-<line>/<page>    e.g. dist/_r/gbp-uk/fully-booked/index.html
 * This file only picks which copy a visitor gets. Each copy is its own static file with
 * its own address on Vercel's CDN, so a cached page can never show one country's prices
 * to another, and the right prices are in the first paint with no flash.
 *
 *   Ghana (GH)            GHS prices, Ghana WhatsApp
 *   United Kingdom (GB)   GBP prices, UK WhatsApp (UK_WHATSAPP, set in Vercel)
 *   everyone else         USD prices, Ghana WhatsApp
 *   search engines and AI crawlers always get the default copy (USD).
 * A visitor's own choice on the currency switch (the fitaa_cur cookie) beats the country
 * guess for prices. The WhatsApp line always follows the country.
 * ═══════════════════════════════════════════════════════════════════════════ */
import { next, rewrite } from "@vercel/functions";

export const config = {
  /* Vercel's recommended runtime for Routing Middleware (the "edge" runtime is deprecated). */
  runtime: "nodejs",
  /* Only the pages that show prices or Fitaa's WhatsApp, so images and scripts never wait on this. */
  matcher: [
    "/",
    "/index.html",
    "/fully-booked",
    "/fully-booked/",
    "/fully-booked/index.html",
    "/demo/:page(ridge-house|studio|car-rental|clinic|restaurant|aesthetics|photographer)",
    "/demo/:page(ridge-house|studio|car-rental|clinic|restaurant|aesthetics|photographer)/",
    "/demo/:page(ridge-house|studio|car-rental|clinic|restaurant|aesthetics|photographer)/index.html",
    "/_r/:path*",
  ],
};

/** Clean address → the file the build writes for it. Keep in step with scripts/regional-pages.mjs. */
export const PAGES: Record<string, string> = {
  "/": "/index.html",
  "/fully-booked": "/fully-booked/index.html",
  "/demo/ridge-house": "/demo/ridge-house/index.html",
  "/demo/studio": "/demo/studio/index.html",
  "/demo/car-rental": "/demo/car-rental/index.html",
  "/demo/clinic": "/demo/clinic/index.html",
  "/demo/restaurant": "/demo/restaurant/index.html",
  "/demo/aesthetics": "/demo/aesthetics/index.html",
  "/demo/photographer": "/demo/photographer/index.html",
};

export const COOKIE = "fitaa_cur";
const CURRENCIES = ["ghs", "gbp", "usd"] as const;
type Currency = (typeof CURRENCIES)[number];
type Line = "gh" | "uk";

/* Search engines, AI crawlers and SEO tools, named one by one: a loose "bot" match would also
   catch phones such as Cubot. Link previews (WhatsApp, iMessage, Slack) are left out on purpose:
   the sender's phone builds the preview, so it shows their own prices. */
const CRAWLER =
  /googlebot|google-inspectiontool|googleother|google-extended|adsbot-google|mediapartners-google|storebot-google|bingbot|bingpreview|msnbot|duckduckbot|duckassistbot|yandexbot|baiduspider|applebot|slurp|gptbot|oai-searchbot|chatgpt-user|claudebot|claude-searchbot|claude-user|claude-web|anthropic-ai|perplexitybot|perplexity-user|ccbot|amazonbot|bytespider|petalbot|semrushbot|ahrefsbot|mj12bot|dotbot|seznambot|ia_archiver|cohere-ai|meta-externalagent|youbot|diffbot|crawler|spider/i;

export function isCrawler(userAgent: string | null): boolean {
  return !!userAgent && CRAWLER.test(userAgent);
}

/** "/fully-booked/index.html" and "/fully-booked/" both become "/fully-booked". */
export function cleanPath(pathname: string): string {
  const p = pathname.replace(/\/index\.html$/, "").replace(/\/+$/, "");
  return p === "" ? "/" : p;
}

function cookieCurrency(header: string | null): Currency | null {
  const m = (header || "").match(/(?:^|;\s*)fitaa_cur=([a-z]{3})/i);
  const v = m ? (m[1].toLowerCase() as Currency) : null;
  return v && CURRENCIES.includes(v) ? v : null;
}

/** Which copy of a page this visitor should get. Exported for tests/middleware.test.mjs. */
export function choose(headers: Headers): { currency: Currency; line: Line } {
  if (isCrawler(headers.get("user-agent"))) return { currency: "usd", line: "gh" };
  const country = (headers.get("x-vercel-ip-country") || "").toUpperCase();
  const line: Line = country === "GB" ? "uk" : "gh";
  const byCountry: Currency = country === "GH" ? "ghs" : country === "GB" ? "gbp" : "usd";
  return { currency: cookieCurrency(headers.get("cookie")) ?? byCountry, line };
}

export default function middleware(request: Request): Response {
  const url = new URL(request.url);

  /* The copies are only ever served through their clean address; send stray visits there. */
  if (url.pathname.startsWith("/_r/")) {
    const rest = url.pathname.replace(/^\/_r\/[^/]+/, "") || "/";
    return Response.redirect(new URL(cleanPath(rest) + url.search, url), 308);
  }

  const file = PAGES[cleanPath(url.pathname)];
  if (!file) return next();

  const { currency, line } = choose(request.headers);
  if (currency === "usd" && line === "gh") return next();
  return rewrite(new URL(`/_r/${currency}-${line}${file}${url.search}`, url));
}
