# Editing the site

Almost everything is in **one file: `src/config/site.ts`**. Each section of the page has a labelled block there, in page order.

## Text

| On the page | In `site.ts` |
|---|---|
| Hero pill, headline, buttons | `hero` |
| Line under the headline | `description` |
| Menu | `nav` |
| Services heading and cards | `servicesSection`, `services` (prices are in `src/config/pricing.json`, not here) |
| Why Us heading, paragraph, numbers | `whyUsSection`, `stats` |
| Work heading, case studies, "Also worked with" | `workSection`, `caseStudies`, `alsoWorkedWith` |
| Testimonials | `testimonialsSection`, `testimonials` |
| Contact heading, WhatsApp wording | `contactSection` |
| Email, phone, form inbox | `contact` |
| Footer social links | `social` |

Rules: change only the text between the quotes, keep the commas. To add a card, copy a whole `{ … }` block and edit the copy.

## Case study images

1. Make a **4:3** image, saved as **WebP**, in three sizes: `name.webp` (1440 px wide, under about 150 KB), `name-1080.webp` and `name-720.webp`. Phones only download the small ones.
2. Put all three in `public/work/`.
3. In `site.ts`, set `imagePath: "/work/your-file.webp"` and write a short `imageAlt` describing it.
4. `link`: the client's page (opens in a new tab). Use `""` if there isn't one.

## Colours and fonts

Open `src/index.css`; the guide at the top lists every setting.

- **Colours:** the `LIGHT MODE` and `DARK MODE` blocks. `--ruby` is the main accent, `--gold` the second.
- **Fonts:** change `--app-font-sans` / `--app-font-display` **and** the Google Fonts link in `index.html` (and in each page in `public/`). Use sans serif pairings; serif only rarely and on purpose.

## SEO and link previews

In `index.html`: `<title>`, `description`, the `og:` and `twitter:` tags, and the business details in the `application/ld+json` block. If the domain changes, update it there, in `site.ts` (`url`), and in `public/sitemap.xml` and `public/robots.txt`.

- **Main address:** https://fitaacreative.com. Old `fitaacreative.vercel.app` links 301 to the same path on fitaacreative.com (`vercel.json`, `redirects`). `www` is redirected in the Vercel dashboard (Settings → Domains), not in `vercel.json`, so the two can never loop.
- **Privacy, Terms and the 404 page:** `npm run build` runs `scripts/static-pages.mjs`, which writes `dist/privacy/index.html`, `dist/terms/index.html` and `dist/404.html` with their own title, description and canonical. Their titles and intros live in `src/config/legal-meta.json`. Any address that isn't a real page shows the 404 page with a real 404 status.
- **Share images:** every page and preview has its own 1200 × 630 card, rebuilt by `node scripts/share-cards.mjs` after a build (change `CARD` in the script so WhatsApp fetches the new one). Demos and previews stay hidden from Google (`noindex`) but still show a proper card when the link is sent on WhatsApp.

## Enquiry form

Messages go to Formspree. To change the inbox, create a form at formspree.io and paste its ID into `contact.formspreeId`.

## Before publishing a change

Run `npm run typecheck`, `npm run build` and `npm test`. If all three pass, push to a branch, open a pull request and check its Vercel preview on a phone before merging.
