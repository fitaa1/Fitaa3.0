# Fitaa site standard

Every website Fitaa builds meets this before it ships: Fitaa's own sites, client sites,
demos and lead previews. fitaacreative.com (this repo) is the reference implementation.
When the reference gets better, this file changes in the same pull request, so the next
site starts from the best version. Nothing here is ever relaxed without Nigel's say.

The three tests, in order: as fast as possible, as functional as possible, as beautiful as possible.
A speed gain that makes the site plainer fails the third test; find another way. Function comes first
and form follows it (Nigel, 22 Nov 2026): every part is designed for what it does, then made as
beautiful as that job allows, never the other way round.

How a site is held to this file, and which checks hold which rule, is at the end ("How every site is
held to this standard"). Fitaa OS shows the same rules, live, in Brain, Standard.

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
- **Response budget (Nigel, 22 Nov 2026, the Su-57 cue in section 6):** a tap shows its answer within
  100 ms (press state at once, the result as soon as it is ready) and Interaction to Next Paint stays
  at 200 ms or less. No animation ever holds input: a menu can be closed while it is still opening, a
  switch can be moved again mid-slide.

- **Fingerprinted photo and asset addresses (19 Nov 2026):** every photo and file the build
  serves carries a short hash of its contents in its address (`?v=` and ten characters), so it can
  be cached for a year (`immutable`) and still change the moment the file changes. A replaced photo
  once kept showing the old picture on Nigel's iPad.

## Found, trusted and chosen (search and AI answers)

Nigel, 22 Nov 2026: the goal isn't simply to be online. It's to be found, trusted and chosen. A
person, Google or an AI answer that asks for "a digital marketing agency in Accra" without knowing the
name must be able to land on the right business. Every site says plainly what the business is and
where, in every place a search engine or an AI reads.

- **Title:** the name, then what it is and where, at 60 to 70 characters or fewer, for example
  "Fitaa Creative | Creative & Digital Marketing Agency in Accra, Ghana". One title per page, each
  different.
- **Description:** opens with what the business is and where ("Creative and digital marketing agency
  in East Legon, Accra."), then what it does for the reader, at about 160 characters and never more
  than 170. The share description may run longer.
- **One `h1` per page and `lang` on the page,** so readers and machines know the main subject and
  the language.
- **One address per page:** a canonical link on every page meant for Google, `www` and the host's
  test address 301 to the main domain, and old addresses 301 to their new home, checked against the
  real host list before writing (CLAUDE.md, Redirect hosts).
- **Share card as packaging** (section 6): title, description and share image (og and twitter) on every page, lead previews included. The share card is a 1200 × 630 JPEG, rebuilt with `scripts/share-cards.mjs` (WhatsApp does not reliably show WebP) in the page's own fonts and story, never an old niche or old fonts. When a card changes, give it a new file name (e.g. `og-2026-11.jpg`) so WhatsApp and others fetch it fresh.
- `sitemap.xml` with real dates, updated when a page's content changes; `robots.txt` that lets
  everyone in, AI crawlers included, and names the sitemap. Demos and lead previews carry `noindex`
  instead. After launch, the sitemap is submitted in Google Search Console.
- **Structured data** for the business type (ProfessionalService, LodgingBusiness, BeautySalon and
  so on), with one `@id`: name, address with its locality, phone, opening hours, `areaServed` naming
  the city as well as the countries, `knowsAbout` with the services in plain words, `sameAs` with
  the business's real profiles, and offers with real prices. Coordinates only when Nigel has
  confirmed them.
- **The same name, address and phone everywhere:** the site, the Google Business Profile, WhatsApp
  Business, directories (GhanaYello and the like) and social profiles say the same thing in the same
  words, because Google and AI answers trust a business whose details agree.
- Questions sections carry FAQPage data built from the visible questions, so the two never differ.
  The questions are the ones people ask a search box or an AI ("How long does a website take?").
- `llms.txt`: who the business is, contacts, pages and published prices, built from the same facts
  file as the site so it can never say something the site doesn't.
- Facts only from sources Nigel has confirmed. Never invent prices, numbers, reviews or awards.
- **Checked by machine:** the page check (title, one `h1`, `lang`, structured data that parses, and
  on pages meant for Google a description of 170 characters or fewer, a canonical address and a share
  card) and, on fitaacreative.com, `tests/found.test.mjs` (the agency and Accra in the title and
  description, Accra in the business data, canonical, robots and sitemap, the card at 1200 × 630).

## Function and look

- Text contrast 4.5:1 or more (logo lockups excepted), one `main` landmark, headings in order,
  tap targets 44 px or more, every field labelled.
- Fluid layout (clamp sizes, container queries), never fixed phone, tablet and desktop layouts.
  Light and dark both designed.
- **Breathing room (Nigel, 19 Nov 2026):** side margins are fluid and intentional, never large.
  Content runs close to the edge on a phone and gains space as the screen grows, for example
  `.wrap{width:min(1320px,100% - 2*clamp(14px,3.2vw,40px));margin-inline:auto}`. Space between
  sections follows the same clamp idea, so no screen feels cramped or empty.
- **Photos fit their frame (19 Nov 2026):** a photo never scrolls, drags or spills inside its
  frame in any direction. A slider track hides vertical overflow, each slide hides its own
  overflow, and every photo uses `object-fit: cover` on a set aspect ratio. A test holds it.
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
  One display heading per screen. One line of it may carry the brand's accent colour as a flat
  colour (Nigel, 13 Nov 2026: Fitaa Creative's second line stays cyan, because one colour made
  the headline plainer, not better).

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
  parallax, no looping motion apart from one first-visit splash and the logo's turn. A signature
  detail may settle once into place (Kora Drive's key tag swings once on its hook and comes to rest).
  The page check fails anything that loops outside the logo's `.logo-sheen`.
- The logo turns and the light follows (Nigel, 12 and 13 Nov 2026): the logo mark rocks slowly
  from side to side and one band of champagne light crosses it as it turns. The turn and the light
  share one clock, so the angle decides where the light is. One wrapper and one pseudo-element,
  transform only, no script and no image (`.logo-sheen` in this site's `src/index.css`, and the same rules inside `public/fully-booked/index.html`). A second, slower clock lifts and
  settles the mark by a pixel, so the turn never repeats the same path. On hover
  the mark lifts. Under reduced motion the logo is still. Only the logo carries it.

- Pictures that explain (Nigel, 19 Nov 2026): where a process is easier seen than read (how a
  booking works, what happens after payment), a short strip of inline SVG steps may draw in once as
  part of the rise. It teaches, never decorates, and it reads as a plain list without scripts.

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

### 6. Signatures every site carries (Mercedes, Maserati GT2 Stradale, and Nigel's cues of 22 Nov 2026)

The fixed set, kept for years: the signature line, the Fitaa rise, the edge in place of shadows,
tabular figures, the sticky header that marks the section in view, WhatsApp reachable from
anywhere, and "Site by Fitaa Creative" once in the footer. Everything else (fonts, colour, the
signature detail in the table above) belongs to the client's own story.

The fixed set is what a Fitaa site carries. The cues below are how it behaves and why people choose
it. They are read from what Nigel named, never copied from it, and each one is turned into rules a
screenshot or a test can check. Function first, then form follows: every cue starts from a job the
visitor needs done.

#### 6.1 Reality view (Tesla's Reality view and FSD v15 visualisation)

What it teaches: the screen shows what the system actually sees and is about to do, simply, calmly,
in real time. Trust comes from seeing the machine work, not from being told it works.

- Each selling page shows the real mechanism, live, built from the same data the business uses: the
  exact WhatsApp message a button sends, the booking summary filling in as the visitor chooses (Kora
  Drive's key tag, Airport Grande's boarding pass, Nkyene Kitchen's table card), the speed score with
  its date. This sharpens section 3's "Show the mechanism": it must react to the visitor, not sit
  as a picture.
- Simplified, never fake. Leave out what does not help the decision, the way the car leaves out
  every leaf on every tree, but never draw a state the system is not in. No "live" tick, no counter
  that is not counting (Fail safe, never fail free).
- Calm: the view updates in place, with the 200 ms fade or the Fitaa rise, never a flash or a jump.
- On fitaacreative.com: See it working has a sliding switch over the four packages, and the chat shows
  the exact message that package's button sends, read from `site.ts`, with a link that opens WhatsApp
  with it on the visitor's own country's number. `tests/see-it-working.test.mjs` holds that the
  message comes from `site.ts` and is never typed into the component.

#### 6.2 One bloodline, many variants (Ferrari: 296 GTB, 296 Speciale and the track Challenge Stradale; SF90 and SF90 XX; the Purosangue; the electric Luce)

What it teaches: one family line runs through every model, so each is unmistakably a Ferrari, and
each variant is tuned hard for its own purpose. The range stays modern, prestigious and exclusive
because it adds purpose, never clutter. Nigel's reading: the Purosangue, the practical one, sells
quietly and strongly, and the Luce shows the line carrying into a new kind of car.

- The bloodline is the fixed set above. A visitor who has seen one Fitaa site should recognise the
  next in a second, by the signature line, the rise, the edge and the calm.
- Variants are tuned by purpose: a client site is the road car (the business's own story, every
  detail finished), a demo is the track variant (one niche pushed to its clearest form, fictional and
  labelled), a lead preview is the entry model (the business's own photos and facts, fast to make,
  never cheap-looking). Each keeps the bloodline and changes only what its purpose needs.
- Prestige is restraint: fewer things, each finished. No discount stickers, no countdown timers, no
  "limited offer" banners, no stock badges. Exclusive means fixed prices and a clear way in, not
  pressure.
- The practical model is made as desirable as the flagship. Get Found, the package most businesses
  start with, gets the same care in its card, its demo and its message as Get Chosen.
- Modern means the generation moves on: when a new car in the line teaches something (a new
  material, a new way to show information), this file takes it the same day, and every site follows
  at its next change.

#### 6.3 Depth you can feel (Simon Bull's thick impasto paintings)

What it teaches: paint laid on thick catches light on its ridges, so a flat canvas has relief you
almost want to touch. Depth comes from light on texture, not from outlines.

- Depth comes from light, never from drop shadows (section 2 still holds): `--sheen` over
  `--graphite`, `--edge` on raised surfaces, the hero's still aurora of colour, and type set heavy
  where it carries weight.
- Layers are real and few: ground, raised, control (section 1, at most three). Each layer is lit
  from the same direction, the top edge catching light, so the eye reads relief without being told.
- Touch answers back: every tappable thing presses in (`scale(.985)`, 120 ms), a switch's pill sits
  raised on its track, a card lifts by its edge on hover where a mouse is used.
- Texture is earned: the richest surface on a page is the one thing the visitor acts on (the open
  package, the booking card). Never texture for its own sake, never a noise image.

#### 6.4 Agility (the Su-57's supermanoeuvrability)

What it teaches: thrust vectoring lets the aircraft change direction faster than its size suggests,
and it answers the pilot's input at once, even at the edge of its flight. Responsiveness is designed
in, not added later.

- The response budget in Speed: a tap shows its answer within 100 ms and Interaction to Next Paint
  stays at 200 ms or less.
- Every motion can be interrupted and reversed mid-flight: tapping the menu again while it opens
  turns it round from where it is; a switch can be moved again while its pill is sliding; nothing
  waits for an animation to finish before it listens.
- The way out matches the way in (Nigel, 22 Nov 2026, on fitaacreative.com's phone menu): whatever
  opens with motion closes with the same motion in reverse, a little faster, and stays on screen
  until that motion has played. The page check fails a menu that vanishes in one frame or still
  covers the page 900 ms after closing.
- Controls work by every means: tap, drag, keys. The sliding switch follows a finger dragged across
  it, and arrow keys move it.
- One tap is one click on every device (fitaa-os CLAUDE.md, One tap is one click): hover rules sit
  inside `@media (hover: hover)`, and a card that opens listens for its own tap.

#### 6.5 Remarkable on purpose (Seth Godin's Purple Cow)

What it teaches: a brown cow is invisible however good it is; a purple cow gets talked about.
Being very good is not enough to be chosen, being remarkable is.

- Each site has one remarkable thing, worth a visitor telling someone about, and it is the signature
  detail doing a job (Type and intent, Signatures do a job): the key tag that fills in, the boarding
  pass, the message already written. One per site, so it stays remarkable.
- Remarkable is not loud. It is something no other business in that niche does on its page, done
  calmly and perfectly.
- Test before shipping: would the client show this page to a friend on their phone, and say what is
  special about it in one sentence? If not, find the purple cow before the page ships.

#### 6.6 Packaging (Nigel's mother tries new things because of their packaging)

What it teaches: before anyone uses a product, the package has already sold it or lost it. Most
people meet a business first through its packaging.

- The package is everything seen before the page itself: the WhatsApp link preview (share card, title,
  description), the Google result (title and description), the favicon on the tab and the home screen,
  the first screen with its headline, and the 0.5 s splash where a site has one. Each is designed and
  checked as carefully as the page.
- One look across the package: the share card uses the page's own fonts, colours and story
  (Found, trusted and chosen), the favicon is the real mark with rounded corners, and the first
  screen says the same promise as the card.
- Opening it is a pleasure: the first screen paints in 1.5 s or less, with the headline in the first
  paint, nothing jumping as fonts arrive.
- Checked by: the share card size in the tests, the page check's search basics, a look at the card
  as WhatsApp shows it before a pull request is opened.

#### 6.7 Magnets that tidy by themselves (Tesla, Li Auto's magnetic cushions, Apple MagSafe, the iPad Magic Keyboard and Apple Pencil)

What it teaches: a magnet puts a thing exactly where it belongs with no effort, and when it is not
needed it is stowed out of sight. Order happens "by magic", so the space stays clear.

- Things snap: a sliding switch lands on a segment with a small spring, a swipeable row snaps each
  item to the edge (`scroll-snap`), a sheet or menu settles open or shut, never half way.
- Clutter stows itself: detail sits behind a disclosure (the + on each package) until it is asked
  for, controls that cannot be used now are not shown (section 7), and the floating WhatsApp button
  docks out of the way of the section's own button.
- Alignment is automatic: every block sits on the grid (section 3), so the visitor never sees
  something that needs straightening.
- The pull is felt, not seen: snapping uses the Fitaa spring (`cubic-bezier(0.32, 1.32, 0.44, 1)`,
  about 460 ms), transform only, and under reduced motion it snaps without the spring.

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
- **Switches slide (Nigel, 19 Nov 2026):** any choice between two to five views (a niche
  switcher, tabs on a listing, a currency fail-safe kept small) is one row of equal segments with a
  single pill that slides to the choice, like iOS. Tap, press and drag all work, the pill moves by
  transform only with a small spring, and under reduced motion it moves without the spring. The
  segments are real buttons with `aria-pressed` or tabs with `aria-selected`.
- In Fitaa OS, one action bar per tab, fixed at the bottom, holding only what that tab can do now.
  It lights by state: needs you, ready to merge, overdue. Its rules are in the fitaa-os CLAUDE.md.

## How every site is held to this standard

A rule only holds if something checks it every time. This is the chain, from the strongest guard to
the last look:

1. **The repo names it.** Every Fitaa site's CLAUDE.md says the site meets this file, so every model
   working on it reads it first: fitaacreative.com (this repo), Fitaa Global, Fitaa Homes, Airport
   Grande, Fitaa Collections and, for its own design language, Fitaa OS.
2. **The page check runs on every push.** Each site carries `scripts/check-pages.mjs` and runs it in
   GitHub Actions on every push to every branch. It opens every page at 390, 820 and 1440 px in light
   and dark and fails on the faults listed in Proof below. This repo holds the reference version, and
   each site's copy names the reference it came from, so Fitaa OS can show a copy that has fallen
   behind.
3. **Tests hold the rules a page check cannot see:** prices from one file, the WhatsApp number by
   country, one tap is one click, the header button's look, the message in See it working, the search
   basics. A rule that has gone wrong once gets a test the same day.
4. **The pull request proves it.** Every note follows the shared template: what changed, what was
   checked (tests, page check, screenshots at three sizes, first paint and page size) and what was not.
5. **Claude reviews and Nigel approves.** Nothing reaches `main` without Nigel's merge. Qwen never
   opens a pull request, so an open one means Claude has reviewed it.
6. **The last look is human.** No check can judge beauty. Claude looks at the screenshots, and
   Nigel's iPhone is the final check.

Coverage on 23 Nov 2026: the same page check, byte for byte, runs in GitHub Actions on
fitaacreative.com, Fitaa Global, Fitaa Homes and Airport Grande, and every page of all four passes
it. Each site keeps only its settings in `scripts/check-pages.config.mjs`: where the build is, which
pages, and a stand-in answer for any address the page reads from its own server (Fitaa Homes' and
Airport Grande's calendars), so the page is checked as a visitor sees it. Fitaa Collections has its
own version for accounts and payments (not rechecked here, that repo is kept apart). A new site
copies the check and its settings file on its first day.

## Proof in every pull request

- Checked at 390, 820 and 1440 px and the sizes between, light and dark.
- First paint, load time and page size, before and after, measured several times
  (single Lighthouse runs are noisy).
- Anything not checked is written as UNVERIFIED, with the reason.
- Every site has `scripts/check-pages.mjs` and runs it on every pull request (`.github/workflows/ci.yml`).
  It opens every built page at 390, 820 and 1440 px in light and dark and fails on sideways scroll,
  a console error, an image without alt text, a tap target under 44 px, a phone menu that does not
  open fully, a phone menu that vanishes in one frame or still covers the page after closing, a
  first load over the budget, and missing search basics (title, one `h1`, `lang`, structured data
  that parses, and on pages meant for Google a description, a canonical address and a share card). This site's script is the example for a static site,
  Fitaa Collections' for a site with accounts and payments, which also scripts the whole journey.
  When it fails, fix the page. Never loosen a limit to get a pull request through.
- The check cannot judge beauty. Look at the screenshots (`SHOTS=1 npm run check:pages`), and
  Nigel's iPhone is the final check.
