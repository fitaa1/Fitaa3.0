# Fitaa Creative

The agency site for Fitaa Creative, for businesses in Ghana, the UK and beyond. It is also the template every Fitaa site starts from: `SITE_STANDARD.md` is the standard they all meet.

- **Live:** [fitaacreative.com](https://fitaacreative.com). www and the old fitaacreative.vercel.app addresses redirect here.
- **Hosted on:** Vercel, project `fitaadigital`. Every pull request gets its own preview link.
- **Built with:** React, TypeScript, Vite and Tailwind, with Lucide icons and Formspree for the contact form.

## The pages

| Address | What it is | Where it lives |
|---|---|---|
| `/` | The agency site, one page: Services, Why Us, Work, Contact | `src/components/`, words in `src/config/site.ts` |
| `/fully-booked` | The offer page. Each package has its own link: `#get-found`, `#get-chosen`, `#stay-booked` | `public/fully-booked/index.html` |
| `/demo/ridge-house`, `/demo/studio`, `/demo/car-rental`, `/demo/clinic`, `/demo/restaurant` | One demo per niche, hidden from Google | `public/demo/<name>/index.html` |
| `/preview/<lead>` | Lead and client previews (persia, kass, masterpiece, palm-court, airport-grande, diz-eden, 1125-city-apartments), hidden from Google | `public/preview/` |
| `/privacy`, `/terms`, 404 | Written at build time | `scripts/static-pages.mjs`, titles in `src/config/legal-meta.json` |

## Change something

| To change | Edit |
|---|---|
| Any word, link, contact detail or list | `src/config/site.ts` (see `CUSTOMIZE.md` for a section-by-section map) |
| A price | `src/config/pricing.json` only, once per currency (GHS, GBP, USD). The build writes it everywhere else |
| Colours and fonts | `src/index.css` (the guide at the top lists every setting) |
| Title, description, link previews, business details for Google | `index.html` |
| Redirects and headers | `vercel.json` |
| Analytics events | `public/fitaa-analytics.js` (Google Analytics `G-D62TL0T2VD`) |

## Prices and WhatsApp by country

Visitors see prices in their own currency without choosing anything:

| Visitor in | Sees | WhatsApp number |
|---|---|---|
| Ghana | GHS | Ghana |
| UK | GBP | UK (Vercel variable `UK_WHATSAPP`) |
| Everywhere else, and search engines | USD | Ghana |

`middleware.ts` reads the visitor's country and serves one of six ready-built copies of each page, so nothing is worked out while the page loads. Three small dimmed flags in the footer let a visitor correct a wrong guess. A new page with prices or WhatsApp needs a line in `PAGES` in `middleware.ts` and in `scripts/regional-pages.mjs`.

## Run, check, deploy, roll back

| Step | How |
|---|---|
| Install | `npm ci` |
| Run locally | `npm run dev` (opens on port 5000) |
| Check | `npm run typecheck`, `npm run build`, then `npm test` (it checks every country's prices, WhatsApp number and Google data in the built copies) |
| Look | Changed pages at 390, 820 and 1440 px wide. Open standalone pages as `/fully-booked/index.html` locally |
| Deploy | Merge the pull request into `main`; Vercel publishes it |
| Roll back | Vercel, project `fitaadigital`, Deployments, the last good one, menu, **Instant Rollback** (under two minutes) |

Every change goes on a branch with a pull request. Nobody pushes to `main`, and Nigel approves every merge.

## After changing images

- **Share cards** (the picture WhatsApp and social apps show): after a build, run `node scripts/share-cards.mjs`. It rebuilds every 1200 × 630 card. To force apps to fetch the new one, change `CARD` in the script.
- **Portfolio images:** three sizes of each in `public/work/`: `name.webp` (1440 px), `name-1080.webp` and `name-720.webp`, so phones never download the large one.
- **Preview photos:** WebP in `public/preview/<page>-img/`, at most 1200 px. Never link to Airbnb or Booking.com photos directly (their links change); `scripts/localise-preview-images.py` copies them in.

## Built-in behaviour worth knowing

- **Speed:** the page is pre-built, the contact form and legal pages load only when needed, fonts never hold up the first paint, and Google Analytics waits for the first tap, scroll or 4 seconds.
- **Splash:** a 0.5 second pulse of the logo on the first visit of a session.
- **Theme:** follows the device (light or dark) until the visitor taps the toggle, then remembers their choice.
- **Menu:** stays at the top, marks the section on screen, and on phones opens a centred full-screen menu.
- **Contact form:** if Formspree can't be reached, it shows an error with the email address, never a false "message received".

## Client sites

Client sites start from this standard but live in their own repo, hosted on Cloudflare, connected to GitHub so every merge deploys. Their domain sits in the client's own Cloudflare account with Fitaa added as a member.

## Other documents

| File | What's in it |
|---|---|
| `CUSTOMIZE.md` | Where every part of the page is edited in `site.ts`, images, colours, SEO |
| `SITE_STANDARD.md` | The standard every Fitaa site meets. Improve it in the same pull request as the site |
| `CLAUDE.md` | Claude's rules for this repo, including every known issue and its guard |
| `QWEN.md` | Qwen's rules |
