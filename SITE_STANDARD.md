# Fitaa site standard

Every website Fitaa builds meets this before it ships: Fitaa's own sites, client sites,
demos and lead previews. fitaacreative.com (this repo) is the reference implementation.
When the reference gets better, this file changes in the same pull request, so the next
site starts from the best version. Nothing here is ever relaxed without Nigel's say.

The three tests, in order: as fast as possible, as functional as possible, as beautiful as possible.
A speed gain that makes the site plainer fails the third test; find another way.

## Speed

- **Fonts:** at most two families. Google Fonts load without blocking the first paint (preload, `media="print"` swap,
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

## Type and intent (Nigel, 4 Nov 2026)

- **Sans serif first.** Each site sets its headings in one display sans and its text in one text sans
  (or one family for both), chosen for what the business stands for. The reason sits in a comment next
  to the font settings, so the choice is never accidental.
- **Serif only as a signature:** one name or word per site at most, set like a nameplate, for example
  "Southampton" on Fitaa Homes. Never for body text or every heading.
- **No fake styles:** load every weight and italic the page uses, or the browser smears its own.
- **One idea per site.** The type, colour, icons and one signature detail all tell the same story about
  that business. Design for the story, never decoration for its own sake.
- **Navigation:** the header stays on screen at every size, the section in view is marked, phones get a
  menu button, and WhatsApp is one tap away from anywhere on the page.
- **Signatures do a job.** The signature detail carries the page's main action or proof, not decoration:
  the Fully Booked hero shows the WhatsApp message the business is built to receive, the car rental
  demo's key tag fills in as the visitor builds a booking. Illustrations are labelled as illustrations.
- **Retell the story in every section.** When a page sells steps (Found, Chosen, Booked), the cards,
  the stats and the calls to action use the same steps, so the page reads as one journey.
- **Write for every reader.** Offer pages speak to any business; niche detail lives in the demos,
  behind one switch that takes a new demo with a button, a card and a line in SETTINGS.
- **Prices abroad:** GHS first, with fixed GBP and USD beside it. The conversion rate and its date sit in
  a comment next to the prices (`src/config/site.ts`), so the figures are checked when the cedi moves.
- **Favicon:** rounded corners (about a 22% radius) with the outside transparent, never a hard square.

| Site | Headings | Text | Signature |
| --- | --- | --- | --- |
| fitaacreative.com and Fully Booked | Bricolage Grotesque (poster type, for a studio that makes billboards and print) | Inter | Adinkra mark |
| Fitaa Homes | Manrope | Manrope | the home's name in Fraunces italic, like a nameplate |
| Airport Grande | Instrument Sans (clear like airport signs) | device sans | the booking summary as a boarding pass |
| Fitaa Global | Plus Jakarta Sans (a confident group voice) | Inter | one mark, four divisions |
| Ridge House demo | Manrope | Manrope | |
| Maison Adwoa demo (studio) | Jost (fashion type, for a beauty studio) | Manrope | |
| Kora Drive demo (car rental) | Archivo, set wide (125) like a car badge | Archivo at normal width | the booking as a key tag that fills in as you choose |
| Adom Family Clinic demo | Atkinson Hyperlegible Next (built by the Braille Institute so every reader can read it) | the same | an appointment card with a heartbeat line, filled in by the form |
| Nkyene Kitchen demo (restaurant) | Unbounded (round and generous, like a full plate) | Manrope | a "Reserved" table card standing on the plate, filled in by the booking |
| Lead previews | DM Sans | DM Sans | |

## Proof in every pull request

- Checked at 390, 820 and 1440 px and the sizes between, light and dark.
- First paint, load time and page size, before and after, measured several times
  (single Lighthouse runs are noisy).
- Anything not checked is written as UNVERIFIED, with the reason.
