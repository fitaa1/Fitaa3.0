# Editing the site

Almost everything is in **one file: `src/config/site.ts`**. Each section of the page has a labelled block there, in page order.

## Text

| On the page | In `site.ts` |
|---|---|
| Hero pill, headline, buttons | `hero` |
| Line under the headline | `description` |
| Menu | `nav` |
| Services heading and cards | `servicesSection`, `services` |
| Why Us heading, paragraph, numbers | `whyUsSection`, `stats` |
| Work heading, case studies, "Also worked with" | `workSection`, `caseStudies`, `alsoWorkedWith` |
| Testimonials | `testimonialsSection`, `testimonials` |
| Contact heading, WhatsApp wording | `contactSection` |
| Email, phone, form inbox | `contact` |
| Footer social links | `social` |

Rules: change only the text between the quotes, keep the commas. To add a card, copy a whole `{ … }` block and edit the copy.

## Case study images

1. Make a **4:3** image, about **1440 × 1080**, saved as **WebP** under ~150 KB.
2. Put it in `public/work/`.
3. In `site.ts`, set `imagePath: "/work/your-file.webp"` and write a short `imageAlt` describing it.
4. `link`: the client's page (opens in a new tab). Use `""` if there isn't one.

## Colours and fonts

Open `src/index.css`; the guide at the top lists every setting.

- **Colours:** the `LIGHT MODE` and `DARK MODE` blocks. `--ruby` is the main accent, `--gold` the second.
- **Fonts:** change `--app-font-sans` / `--app-font-serif` **and** the Google Fonts link in `index.html`.

## SEO and link previews

In `index.html`: `<title>`, `description`, the `og:` and `twitter:` tags, and the business details in the `application/ld+json` block. If the domain changes, update it there, in `site.ts` (`url`), and in `public/sitemap.xml` and `public/robots.txt`.

## Enquiry form

Messages go to Formspree. To change the inbox, create a form at formspree.io and paste its ID into `contact.formspreeId`.

## Before publishing a change

Run `npm run build`. If it finishes without errors, push to a branch and check the Vercel preview on a phone before merging.
