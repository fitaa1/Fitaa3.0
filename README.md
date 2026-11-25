# Fitaa Creative

The agency site for Fitaa Creative, for businesses in Ghana, the UK and beyond. It is also the template every Fitaa site starts from: `SITE_STANDARD.md` is the standard they all meet, and it improves in the same pull request as this site.

- **Live:** [fitaacreative.com](https://fitaacreative.com). www and the old fitaacreative.vercel.app addresses redirect here.
- **Hosted on:** Vercel, project `fitaadigital`. Every pull request gets its own preview link.
- **Built with:** React, TypeScript, Vite and Tailwind, with Lucide icons and Formspree for the contact form.
- **How each part works:** the Site anatomy tab in Fitaa OS takes this site apart piece by piece, and Kwame answers questions about it ("how do I recreate the tap light", "how does dark mode follow the phone").

## The pages

| Address | What it is | Where it lives |
|---|---|---|
| `/` | The agency site, one page | `src/pages/Home.tsx`, sections in `src/components/`, words in `src/config/site.ts` |
| `/fully-booked` | The offer page. Each package has its own link: `#get-found`, `#get-chosen`, `#stay-booked` | `public/fully-booked/index.html` |
| `/demo/<niche>` | One demo per niche (ridge-house, studio, car-rental, clinic, restaurant, aesthetics, photographer), each a fictional business, hidden from Google | `public/demo/<niche>/index.html` |
| `/preview/<lead>` | Lead and client previews (persia, kass, masterpiece, palm-court, airport-grande, diz-eden, 1125-city-apartments), hidden from Google | `public/preview/` |
| `/privacy`, `/terms`, 404 | Written at build time | `scripts/static-pages.mjs`, titles in `src/config/legal-meta.json` |

## Change something

Almost everything is in **one file, `src/config/site.ts`**. Each part of the page has a labelled block there, in page order. Change only the text between the quotes and keep the commas. To add a card, copy a whole `{ … }` block and edit the copy.

| To change | Edit |
|---|---|
| The order of the home sections, or hide one | `sections` in `site.ts`: move a line to reorder, delete it to hide. Remove its menu link from `nav` too (a test checks every menu link has its section) |
| Menu | `nav` in `site.ts` |
| Hero pill, headline, buttons, line under it | `hero`, `description` |
| Services heading and cards | `servicesSection`, `services` |
| Why Us heading, paragraph, numbers | `whyUsSection`, `stats` |
| Work heading, case studies, "Also worked with" | `workSection`, `caseStudies`, `alsoWorkedWith` |
| Testimonials | `testimonialsSection`, `testimonials` |
| Contact heading, WhatsApp wording | `contactSection` |
| Email, phone, form inbox (Formspree ID) | `contact` |
| Footer social links | `social` |
| A price | `src/config/pricing.json` only, once per currency (GHS, GBP, USD). The build writes it everywhere else |
| Colours | `src/index.css`, the light block (`:root`) and the dark block (`.dark`). `--ruby` is the main accent, `--gold` the second, `--sapphire` the royal blue, `--press-ripple` the light a tap makes |
| Fonts | `--app-font-sans` and `--app-font-display` in `src/index.css`, and the Google Fonts link in `index.html` and in each page in `public/`. Sans serif pairings, serif only rarely and on purpose |
| Title, description, link previews, business details for Google | `index.html` (the `og:` and `twitter:` tags and the `application/ld+json` block). If the domain changes, also `url` in `site.ts`, `public/sitemap.xml` and `public/robots.txt` |
| Redirects and headers | `vercel.json`. www is redirected in the Vercel dashboard (Settings, Domains), never in `vercel.json`, so the two can't loop |
| Analytics events | `public/fitaa-analytics.js` (Google Analytics `G-D62TL0T2VD`) |
| A brand icon Lucide doesn't have | `src/components/icons.tsx` (WhatsApp, Behance), one copy each |

## Prices and WhatsApp by country

Visitors see prices in their own currency without choosing anything:

| Visitor in | Sees | WhatsApp number |
|---|---|---|
| Ghana | GHS | Ghana |
| UK | GBP | UK (Vercel variable `UK_WHATSAPP`) |
| Everywhere else, and search engines | USD | Ghana |

`middleware.ts` reads the visitor's country and serves one of six ready-built copies of each page, so nothing is worked out while the page loads (`scripts/regions.mjs` holds the copies, `scripts/prerender.mjs` and `scripts/regional-pages.mjs` write them). Three small dimmed flags in the footer let a visitor correct a wrong guess. A new page with prices or WhatsApp needs a line in `PAGES` in `middleware.ts` and in `scripts/regional-pages.mjs`.

## Built-in behaviour worth knowing

- **Speed:** the home page is pre-built, the contact form and legal pages load only when needed, fonts never hold up the first paint, and Google Analytics waits for the first tap, scroll or 4 seconds.
- **Light and dark:** a few lines in the head of `index.html` pick the theme before the first paint (a saved choice, else the device setting), so there is no flash. `src/contexts/ThemeContext.tsx` then follows the device live until the visitor taps the sun or moon, and remembers their choice.
- **The press:** `public/press.js` answers every tap. A button or tile fills with one soft light from the finger, a word, icon or logo glows from its own outline. Its one colour is `--press-ripple`. The same file runs unchanged on every Fitaa site and every demo.
- **The royal sapphire:** one drawing, `public/sapphire.svg` (built by `scripts/sapphire.py`), set on a section seam by `src/components/SapphireSeam.tsx`. On home it sits under the hero and above Contact.
- **One tap is one click:** every hover effect waits for a real mouse (`scripts/mouse-hover.mjs`), so iPhone and iPad never need two taps.
- **Splash:** a 0.5 second pulse of the logo on the first visit of a session.
- **Menu:** stays at the top, marks the section on screen, and on phones opens a centred full-screen menu.
- **Contact form:** if Formspree can't be reached, it shows an error with the email address, never a false "message received".

## Images

- **Case study images:** a 4:3 WebP in three sizes in `public/work/`: `name.webp` (1440 px, under about 150 KB), `name-1080.webp` and `name-720.webp`, so phones download only the small ones. In `site.ts` set `imagePath: "/work/name.webp"` and a short `imageAlt`.
- **Share cards** (the picture WhatsApp and social apps show): after a build, run `node scripts/share-cards.mjs`. It rebuilds every 1200 × 630 card. To make apps fetch the new one, change `CARD` in the script.
- **Preview photos:** WebP in `public/preview/<page>-img/`, at most 1200 px. Never link to Airbnb or Booking.com photos directly (their links change). `scripts/localise-preview-images.py` copies them in.

## Run, check, deploy, roll back

| Step | How |
|---|---|
| Install | `npm ci` |
| Run locally | `npm run dev` (port 5000) |
| Check | `npm run typecheck`, `npm run build`, `npm test` (prices, WhatsApp and Google data in every country's copy, sections, the press, the sapphire, one tap), then `npm run check:pages` (every page at 390, 820 and 1440 px in light and dark: no sideways scroll, no console error, alt text, 44 px taps, the phone menu, 350 KB first load) |
| Look | Changed pages at 390, 820 and 1440 px. Open standalone pages locally as `/fully-booked/index.html` |
| Deploy | Merge the pull request into `main`. Vercel publishes it. GitHub runs every check on every push first |
| Roll back | Vercel, project `fitaadigital`, Deployments, the last good one, menu, **Instant Rollback** (under two minutes) |

Every change goes on a branch with a pull request. Nobody pushes to `main`, and Nigel approves every merge.

## Client sites

Client sites start from this standard but live in their own repo, hosted on Cloudflare and connected to GitHub so every merge deploys. Their domain sits in the client's own Cloudflare account with Fitaa added as a member.

## Other documents

| File | What's in it |
|---|---|
| `SITE_STANDARD.md` | The standard every Fitaa site meets |
| `CLAUDE.md` | Claude's rules for this repo, including every known issue and its guard |
| `QWEN.md` | Qwen's rules |
