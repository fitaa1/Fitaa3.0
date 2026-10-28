# Fitaa site standard

Every website Fitaa builds meets this before it ships: Fitaa's own sites, client sites,
demos and lead previews. fitaacreative.com (this repo) is the reference implementation.
When the reference gets better, this file changes in the same pull request, so the next
site starts from the best version. Nothing here is ever relaxed without Nigel's say.

The three tests, in order: as fast as possible, as functional as possible, as beautiful as possible.
A speed gain that makes the site plainer fails the third test; find another way.

## Speed

- **Fonts:** Google Fonts load without blocking the first paint (preload, `media="print"` swap,
  `noscript` fallback, `display=swap`), or the device's own fonts.
- **Analytics:** one file (`public/fitaa-analytics.js`) with a list of live hosts. Google Analytics
  loads on the visitor's first tap, scroll or key press, or after 4 seconds. Events queue until then.
- **Motion:** CSS transform and opacity only, through one shared reveal helper
  (`src/lib/reveal.tsx`). No animation libraries. Decorative motion starts after load and pauses
  off screen. Reduce motion shows everything still.
- **Images:** WebP. Responsive sizes with `srcset` and `sizes` (720, 1080 and 1440 px for
  portfolio work; at most 1200 px for gallery and preview photos). Width and height always set;
  lazy below the first screen.
- **Never hotlink** Airbnb, Booking.com, Trip.com or any listing site. Copy photos in
  (`scripts/localise-preview-images.py`) and convert them to WebP.
- **Splash (optional):** at most 0.5 s, first visit only, starts once its image has loaded,
  skipped for reduce motion. Later visits never download it.
- **Budgets** (Lighthouse, mobile): speed 90 or more, accessibility 100, best practices 96 or
  more, search 100 on pages meant for Google. First paint 1.5 s or less, first screen 350 KB or less.

## Search and AI answers

- Title, description, canonical, share image (og and twitter) on every page.
- `sitemap.xml` with real dates; `robots.txt` that lets everyone in, AI crawlers included.
  Demos and lead previews carry `noindex` instead.
- Structured data for the business type (ProfessionalService, LodgingBusiness, BeautySalon and
  so on): address, phone, area served, and offers with real prices.
- Questions sections carry FAQPage data built from the visible questions, so the two never differ.
- `llms.txt`: who the business is, contacts, pages and published prices.
- Facts only from sources Nigel has confirmed. Never invent prices, numbers, reviews or awards.

## Function and look

- Text contrast 4.5:1 or more (logo lockups excepted), one `main` landmark, headings in order,
  tap targets 44 px or more, every field labelled.
- Fluid layout (clamp sizes, container queries), never fixed phone, tablet and desktop layouts.
  Light and dark both designed.
- WhatsApp click-to-chat with a message already written.
- Fail safe, never fail free: when data cannot be read (a calendar, a form service), the page
  says so and sends the visitor to WhatsApp. No success message it cannot back up.

## Proof in every pull request

- Checked at 390, 820 and 1440 px and the sizes between, light and dark.
- First paint, load time and page size, before and after, measured several times
  (single Lighthouse runs are noisy).
- Anything not checked is written as UNVERIFIED, with the reason.
