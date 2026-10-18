/* ═══════════════════════════════════════════════════════════════════════════
 * FULLY BOOKED PAGE: every word on /fully-booked lives in this file.
 *
 * How to edit
 *   • Change the text between the quotes. Keep the quotes and the commas.
 *   • Prices are plain text, so write them exactly as they should appear.
 *   • The WhatsApp number comes from siteConfig.contact.phone (src/config/site.ts).
 *   • Source: the "Fully Booked by Fitaa: Offer Playbook" doc in Google Drive.
 * ═══════════════════════════════════════════════════════════════════════════ */

export type Niche = "hosts" | "studios";

export const fullyBooked = {
  seo: {
    title: "Fully Booked by Fitaa | Direct bookings for Accra hosts and studios",
    description:
      "Google listing, WhatsApp booking and a premium page for short-let hosts and beauty studios in Accra. Live in 7 days, or 50% of your fee back.",
  },

  banner: "December is coming. We are taking 6 launch spots before the season.",

  hero: {
    eyebrow: "Fully Booked by Fitaa",
    headline: "Your next client is already looking for you.",
    subhead: "We make sure they find you, trust you and book you, in one WhatsApp message.",
    primaryButton: "Claim your December spot",
    secondaryButton: "See the packages",
  },

  /** The hero switch: one tab per niche. */
  niches: {
    hosts: {
      tab: "Short-let hosts",
      headline: "Guests who book you directly.",
      subhead:
        "A private booking page, a WhatsApp that answers in seconds, and ads that reach Ghanaians abroad while they plan December. Keep more of every night.",
      whatsapp: "Hi Fitaa, I'd like a Fully Booked spot for my short-let. Property name: ",
    },
    studios: {
      tab: "Beauty studios",
      headline: "Your chair, fully booked.",
      subhead:
        "Clients find you on Google, fall for your work, and book on WhatsApp in under a minute.",
      whatsapp: "Hi Fitaa, I'd like a Fully Booked spot for my studio. Studio name: ",
    },
  },

  promise: {
    eyebrow: "The promise",
    heading: "The gap between being great and being chosen.",
    paragraphs: [
      "You built something good. The finish is beautiful, the service is excellent, and the people who find you come back.",
      "The problem was never your work. It's the gap between being great and being chosen: a missing Google listing, a WhatsApp that answers too late, an Instagram with no clear way to book.",
      "Fully Booked closes that gap. We set up everything a customer touches before they arrive, so the first impression matches the experience. Then we keep it working, month after month, until full is your normal.",
    ],
  },

  tiersSection: {
    eyebrow: "Three ways in",
    heading: "Find you. Choose you. Come back.",
  },
  tiers: [
    {
      name: "Get Found",
      price: "GHS 1,500",
      cadence: "one-off",
      tagline: "Be easy to find and easy to message.",
      timing: "Live in 5 days",
      featured: false,
      includes: [
        "Google Business Profile set up and polished: photos, hours, services, map pin (eligible businesses)",
        "Instagram profile tune-up for single-unit hosts, who can't have a Google profile",
        "WhatsApp Business: catalog with prices, greeting and away messages, quick replies for your 5 most-asked questions",
        "One click-to-chat link for your bio, flyers and stickers",
        "Print-ready QR card: a counter review card for studios, a welcome card with Wi-Fi and house rules for hosts",
      ],
    },
    {
      name: "Get Chosen",
      price: "GHS 3,500",
      cadence: "one-off",
      tagline: "Look like the obvious choice.",
      timing: "Live in 7 days",
      featured: true,
      foundingNote: "Founding price GHS 2,500 for the first 3 clients",
      includes: [
        "Everything in Get Found",
        "A premium one-page website on your own web address (domain billed at cost)",
        "Gallery, prices, reviews and map, with one button that opens WhatsApp with the booking already written",
        "Hosts: amenities strip, house rules, a Request your dates button and deposit instructions",
        "Studios: service menu with prices and times, stylist showcase and a Book your slot button",
        "One round of revisions before launch",
      ],
    },
    {
      name: "Stay Booked",
      price: "GHS 1,200",
      cadence: "per month",
      tagline: "Keep the calendar full.",
      timing: "3-month minimum",
      featured: false,
      includes: [
        "Meta Ads managed for you. Hosts: Ghanaians in the UK, US and Canada planning December. Studios: people within a short drive",
        "Website and catalog updates: new photos, prices and seasonal offers",
        "A one-page monthly report: WhatsApp enquiries, bookings, new reviews and ad results",
        "Ad budget is separate and agreed on the call",
      ],
    },
  ],
  upkeep: "Upkeep only: GHS 350 a month for hosting and small updates, for Get Chosen clients who don't want ads.",

  guarantee: {
    heading: "Live in 7 days, or half your fee back.",
    body: "No fine print beyond this: the clock starts when we have your photos, prices, logo and account access. One revision round is included. If you pause us, the clock pauses too.",
  },

  founding: {
    eyebrow: "Founding clients",
    heading: "Get Chosen for GHS 2,500, for the first 3 clients.",
    body: "In return: a short video or written testimonial, permission to show the work, and access to your before and after numbers at 30 days. Founding clients may pay 50% to start and 50% at launch.",
  },

  stepsSection: { eyebrow: "How it works", heading: "From first call to fully booked." },
  steps: [
    { title: "A 15-minute call", text: "We learn what you offer, who books you and what's in the way." },
    { title: "You send the essentials", text: "Photos, prices and your logo. We handle the rest." },
    { title: "We build", text: "Your Google listing, WhatsApp setup and page, done properly." },
    { title: "You approve", text: "One round of revisions so it's exactly right." },
    { title: "You go live", text: "Inside 7 days, or half your fee comes back." },
  ],

  proofSection: {
    eyebrow: "Why it works",
    heading: "Guests and clients check before they pay.",
    note: "Guest surveys are mostly of US and UK travellers, the same people who fly home for December.",
  },
  proof: [
    { figure: "59%", label: "name a professional website as the top reason they trust a host enough to book direct", source: "Touch Stay, 1,204 guests", url: "https://touchstay.com/blog/direct-bookings" },
    { figure: "39%", label: "have walked away from a business because it had no website", source: "DreamHost 2026 Local Business Trust Index", url: "https://www.dreamhost.com/blog/dreamhost-2026-local-business-trust-index/" },
    { figure: "67%", label: "start a local business search on Google", source: "DreamHost 2026 Local Business Trust Index", url: "https://www.dreamhost.com/blog/dreamhost-2026-local-business-trust-index/" },
    { figure: "93%", label: "of Ghana's internet users were on WhatsApp", source: "Statista, Q3 2024", url: "https://statista.com/statistics/1171534/leading-social-media-platforms-ghana" },
  ],

  demo: {
    eyebrow: "See it for yourself",
    heading: "What a host's booking page looks like.",
    body: "A demo built for a fictional serviced apartment: amenities, apartments, gallery and a Request your dates form that opens WhatsApp with the booking already written.",
    button: "Open the demo page",
    href: "/demo/ridge-house/",
  },

  faqSection: { eyebrow: "Questions", heading: "Straight answers." },
  faqs: [
    {
      q: "Isn't it expensive?",
      a: "Think of it as two bookings. If Get Chosen brings you two extra nights or four extra clients, it has paid for itself. And if it isn't live in 7 days, half comes back to you. Hosts: management companies typically take 15 to 25% of revenue every month; this is a one-time fee.",
    },
    {
      q: "I already have Instagram.",
      a: "Instagram is where people discover you. Your page is where they decide and book. It also puts you on Google, where people search when they're ready to buy, and your Instagram links straight to it.",
    },
    {
      q: "Airbnb already brings me guests.",
      a: "Keep Airbnb. This adds a direct line for repeat guests and referrals, where you keep the full rate.",
    },
    {
      q: "Can you put my apartment on Google Maps?",
      a: "Not a single rental apartment: Google doesn't allow Business Profiles for individual rentals, and we won't risk your listing. Guest houses with a reception and short-let companies with a staffed office can have one. For single units, your page shows the neighbourhood on a map and your name shows up in Google search.",
    },
    {
      q: "Who else have you done this for?",
      a: "You'd be one of our founding clients, which is why the price is lower and the guarantee is there. Our past work for brands in Accra is on the main site.",
    },
  ],

  finalCta: {
    heading: "Your next client is already looking.",
    body: "Hosts: launch by 1 November for the 20 December to 5 January peak. Studios: book by 14 November to launch before 1 December.",
    button: "Claim your December spot",
  },
};
