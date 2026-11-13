# Fitaa site standard

Every website Fitaa builds meets this before it ships: Fitaa's own sites, client sites,
demos and lead previews. fitaacreative.com (this repo) is the reference implementation.
When the reference gets better, this file changes in the same pull request, so the next
site starts from the best version. Nothing here is ever relaxed without Nigel's say.

The three tests, in order: as fast as possible, as functional as possible, as beautiful as possible.
A speed gain that makes the site plainer fails the third test; find another way.

## Speed

- **No jump when fonts load:** each web font gets a fallback face from local Arial with `size-adjust` set to its measured width (wide display faces need about 127 to 130%), listed straight after it, so layout shift stays under 0.1. Measured 4 Nov: Archivo wide 127.3%, Unbounded 129.3%, Manrope 101.6%, Atkinson Hyperlegible Next 98.3%, Archivo 97.5%, DM Sans 104.4% (6 Nov, lead previews), Schibsted Grotesk 700 100.7%, Inter 105.3% (7 Nov, Collections; `scripts/measure-fonts.mjs` there measures them in Chrome).
- **Fonts:** at most two families. Best: self-hosted on the site's own address (one latin WOFF2 per family and
  weight, preloaded, with `unicode-range` and `display=swap`), so no request leaves for Google before the first
  paint; Fitaa Collections does this. Otherwise Google Fonts load without blocking the first paint (preload,
  `media="print"` swap, `noscript` fallback, `display=swap`), or the device's own fonts.
- **Analytics:** one file (`public/fitaa-analytics.js`) with a list of live hosts. Google Analytics
  loads on the visitor's first tap, scroll or key press, or after 4 seconds. Events queue until then.
- **Motion:** CSS transform and opacity only, through one shared reveal helper
  (`src/lib/reveal.tsx`). No animation libraries. Decorative motion starts after load and pauses
  off screen. Reduce motion shows everything still.
- **Images:** WebP. Responsive sizes with `srcset` and `sizes` (720, 1080 and 1440 px for
  portfolio work; at most 1200 px for gallery and preview photos). Width and height always set;
  lazy below the first screen.
- **Photos visitors upload** are resized on their own phone before upload (1200 px and 480 px), WebP where
  the browser can make it and JPEG from Safari, which cannot make WebP from a canvas. The cover also uploads
  a JPEG for WhatsApp previews. Fitaa Collections, 7 Nov 2026.
- **Never hotlink** Airbnb, Booking.com, Trip.com or any listing site. Copy photos in
  (`scripts/localise-preview-images.py`) and convert them to WebP.
- **Splash (optional):** at most 0.5 s, first visit only, starts once its image has loaded,
  skipped for reduce motion. Later visits never download it.
- **Budgets** (Lighthouse, mobile): speed 90 or more, accessibility 100, best practices 96 or
  more, search 100 on pages meant for Google. First paint 1.5 s or less, first screen 350 KB or less.

## Search and AI answers

- Title, description, canonical, share image (og and twitter) on every page, lead previews included. The share card is a 1200 × 630 JPEG, rebuilt with `scripts/share-cards.mjs` (WhatsApp does not reliably show WebP) in the page's own fonts and story, never an old niche or old fonts. When a card changes, give it a new file name (e.g. `og-2026-11.jpg`) so WhatsApp and others fetch it fresh.
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
- **Payments fail safe too:** an order is paid only when the payment service confirms it to the site
  directly (a signed webhook, then a second check with the service). A visitor arriving back on a
  "thank you" address proves nothing. A test build refuses live keys and a live build refuses test keys,
  and a test build shows a test banner and sends `noindex` until the switch to live (Fitaa Collections).
- Prices use tabular figures (`font-variant-numeric: tabular-nums`) so they line up in lists and totals.

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
  menu button, and WhatsApp is one tap away from anywhere on the page. In the phone menu every label is
  truly centred: the in-view marker sits outside the label's box (absolutely placed, grown with a transform),
  never in the flow, where it pushes labels off centre (6 Nov 2026). A blur behind a sticky header goes on a
  `::before` layer, never on the header itself: `backdrop-filter` makes the header the containing box for
  the fixed phone menu, so the menu only covers the header. Checks open the phone menu and confirm it fills
  the screen (found on Fitaa Collections, 7 Nov 2026). Each package card ends with a "Learn
  more" link to the full offer page (not the package's own section: the open card already shows that),
  above its WhatsApp button (Nigel, 7 Nov 2026). Messages to leads still link to the exact section.
- **Signatures do a job.** The signature detail carries the page's main action or proof, not decoration:
  the Fully Booked hero shows the WhatsApp message the business is built to receive, the car rental
  demo's key tag fills in as the visitor builds a booking. Illustrations are labelled as illustrations.
- **Retell the story in every section.** When a page sells steps (Found, Chosen, Booked), the cards,
  the stats and the calls to action use the same steps, so the page reads as one journey.
- **Write for every reader.** Offer pages speak to any business; niche detail lives in the demos,
  behind one switch that takes a new demo with a button, a card and a line in SETTINGS.
- **Prices by country:** one price, in the visitor's own currency, chosen before the page leaves the
  host so it is right in the first paint (Ghana GHS, the United Kingdom GBP, everyone else USD). The
  build writes one copy of each page per currency and WhatsApp line, and Vercel middleware
  (`middleware.ts`) picks the copy from the `x-vercel-ip-country` header. Each copy has its own address
  on the CDN, so a cached page can never show one country's prices to another. The currency is
  automatic. The only control is a quiet fail-safe for a wrong guess: small dimmed flags in the
  footer (Ghana, UK, US), drawn in SVG because Windows shows flag emoji as letters, remembered in
  cookie `fitaa_cur`. Never put a currency switch above or beside the prices: it makes an automatic
  choice look like a task for the visitor (Nigel, 6 Nov 2026). Search engines and AI crawlers
  always get the USD copy, and every copy's structured data names its own currency. All figures live
  in one file (`src/config/pricing.json`), each written out in full, with the conversion rate and its
  date beside them, so they are checked when the cedi moves. Never work a price out in code.
- **WhatsApp by country:** a business with numbers in more than one country sends each visitor to the
  nearest one, decided the same way as prices. Numbers that are not public yet live in the host's
  environment variables, never in the repo, and the page falls back to the main number when one is
  missing or malformed.
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
| Fitaa Collections | Schibsted Grotesk (plain and sturdy, drawn for the Norwegian media and marketplace group Schibsted, made to sit next to prices) | Inter, tabular figures for prices | every price on a gold swing tag beside the item's condition |

## Design language (Nigel, 11 Nov 2026)

Nigel's direction: upgrade each identity, never replace it. Fitaa Creative keeps its blue logo and
palette, Fitaa OS keeps the gold Gye Nyame on near black, and each client site keeps its own story
(the table above). What follows is inferred from the cars Nigel named, never copied from them. It is
the part every Fitaa site shares, so a page Fitaa built is recognisable at a glance. Everything above
still holds: speed first, sans serif, light and dark, 4.5:1 contrast, reduced motion respected, motion
on transform and opacity only. Each rule can be checked by looking at a screenshot.

### 1. One solid form (Ferrari 12Cilindri, BMW 7 Series)

- A section is a continuous plane. Between two sections use one thing only: a change of background
  OR one hairline. Never both, never a shadow.
- No card inside a card. A group of items sits on the section's own plane, separated by space or
  hairlines. A card (its own background and radius) is allowed once per section, for the one thing
  the visitor must act on.
- At most three levels of surface on a screen: ground, raised, control.
- One decisive line per screen where several dividers sat before. If two hairlines are within 48 px
  of each other, remove one.
- Large quiet type: display headings `clamp(2.25rem, 6vw, 4.5rem)`, weight 500 to 600, letter
  spacing `-0.02em`, line height 1.05, in the plain text colour, never a gradient or outline.
  One display heading per screen.

### 2. Metal and leather (2011 Aston Martin)

Tokens every site defines, with these values unless the site's own palette (table above) needs a
different hue at the same lightness:

| Token | Light | Dark | Use |
|---|---|---|---|
| `--graphite` | `hsl(211 20% 94%)` | `hsl(211 32% 5%)` | the ground or band a premium section sits on |
| `--sheen` | `linear-gradient(180deg, hsl(0 0% 100% / .6), hsl(0 0% 100% / 0) 42%)` | `linear-gradient(180deg, hsl(0 0% 100% / .045), hsl(0 0% 100% / 0) 42%)` | laid over `--graphite` as a second background, never an image |
| `--edge` | `inset 0 1px 0 hsl(0 0% 100% / .9), inset 0 0 0 1px hsl(211 20% 88%)` | `inset 0 1px 0 hsl(0 0% 100% / .08), inset 0 0 0 1px hsl(0 0% 100% / .06)` | the `box-shadow` of any raised surface, in place of a drop shadow |
| `--champagne` | `hsl(38 72% 30%)` (6.0:1 on white) | `hsl(40 60% 68%)` (10.9:1 on the dark ground) | hardware only, see below |
| `--leather` | `hsl(24 45% 30%)` (8.2:1 on white) | `hsl(28 55% 62%)` (8.0:1 on the dark ground) | the rare warm accent |

- Drop shadows are not used. The two exceptions are the focus ring and the floating WhatsApp button.
- Champagne is hardware: lines of 2 px or less, icons of 20 px or less, the signature line, and at
  most one filled button per screen. Never a background for a section and never body text.
- Leather appears at most once per page, on the one premium moment (the guarantee, a signed-off
  result). If a second use is tempting, the first one was wrong.

### 3. Craft in the details (Pagani)

- One icon set per site, one stroke width (1.5 px at 24 px), drawn inline as SVG. Fitaa Creative
  uses lucide. Never mix sets.
- Every price, count, date, time and phone number uses `font-variant-numeric: tabular-nums`.
- Press state on everything tappable: `transform: scale(.985)` over 120 ms. No colour flash.
- Hairlines are 1 px in the border token. Nothing is 2 px except the signature line and focus rings.
- Alignment: every block starts on the container's left edge or on a column of its grid. Nothing is
  placed by eye.
- Show the mechanism. Each selling page carries one section that shows how the work is done with
  something real and live: the working demo, the booking message as it arrives on WhatsApp, the
  speed score with its date. No stock illustration of "process".

### 4. One motion (Koenigsegg)

- Every element earns its place by what it does. If removing it changes nothing the visitor can do
  or understand, remove it.
- The Fitaa rise is the only entrance: `opacity 0 to 1` with `translateY(12px) to 0`, 420 ms,
  `cubic-bezier(0.22, 1, 0.36, 1)`, once per element as it enters view, 60 ms between siblings,
  never more than six in one group. Under reduced motion it is opacity only, with no delay.
- Define it once per site (a `.rise` class or one keyframe) and reuse it. No other entrance, no
  parallax, no looping motion apart from one first-visit splash and the logo's turn.
- The logo turns and the light follows (Nigel, 12 and 13 Nov 2026): the logo mark rocks slowly
  from side to side and one band of champagne light crosses it as it turns. The turn and the light
  share one clock, so the angle decides where the light is. One wrapper and one pseudo-element,
  transform only, no script and no image (`.logo-sheen` in this site's `src/index.css`). On hover
  the mark lifts. Under reduced motion the logo is still. Only the logo carries it.

### 5. The signature line (Bugatti)

One line, drawn the same way everywhere: a 2 px champagne key, 24 px long, with a 1 px hairline in
the border token running on from it to the end of the container.

- Header: the key alone, 2 px by the width of the link, sits under the link of the section in view
  and slides between links with the Fitaa rise timing (transform only).
- Section entry: the full line sits above each section's label. The key draws in from the left
  (scaleX 0 to 1, transform origin left) as part of the rise.
- Favicon: a site with its own logo keeps it, with rounded edges. A site without one uses its
  initial on its ground colour with the key along the bottom edge.
- Nowhere else. It is not a divider and not decoration.

### 6. Signatures every site carries (Mercedes, Maserati GT2 Stradale)

The fixed set, kept for years: the signature line, the Fitaa rise, the edge in place of shadows,
tabular figures, the sticky header that marks the section in view, WhatsApp reachable from
anywhere, and "Site by Fitaa Creative" once in the footer. Everything else (fonts, colour, the
signature detail in the table above) belongs to the client's own story.

### 7. Controls that adapt (the BMW i3 50's wheel)

- Show and light only the controls this moment needs. A control that cannot be used now is not
  shown dimmed, it is not shown.
- The header's main button and the floating WhatsApp button take their label and their WhatsApp
  message from the section in view. Each section sets `data-cta-label` and `data-cta-message`
  (for example "Ask about Get Chosen" with a message that names Get Chosen). The button reads the
  section that crosses the middle of the screen. Its width is reserved (`min-width` in `ch`) so
  nothing moves, and only the text fades (200 ms, opacity).
- A lit state means something: champagne means "your move", the accent means "live now". No third
  meaning, and never lit for decoration.
- In Fitaa OS, one action bar per tab, fixed at the bottom, holding only what that tab can do now.
  It lights by state: needs you, ready to merge, overdue. Its rules are in the fitaa-os CLAUDE.md.

## Proof in every pull request

- Checked at 390, 820 and 1440 px and the sizes between, light and dark.
- First paint, load time and page size, before and after, measured several times
  (single Lighthouse runs are noisy).
- Anything not checked is written as UNVERIFIED, with the reason.
- Every site has `scripts/check-pages.mjs` and runs it on every pull request (`.github/workflows/ci.yml`).
  It opens every built page at 390, 820 and 1440 px in light and dark and fails on sideways scroll,
  a console error, an image without alt text, a tap target under 44 px, a phone menu that does not
  open fully and a first load over the budget. This site's script is the example for a static site,
  Fitaa Collections' for a site with accounts and payments, which also scripts the whole journey.
  When it fails, fix the page. Never loosen a limit to get a pull request through.
- The check cannot judge beauty. Look at the screenshots (`SHOTS=1 npm run check:pages`), and
  Nigel's iPhone is the final check.
