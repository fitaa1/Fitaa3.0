/* ═══════════════════════════════════════════════════════════════════════════
 * SITE CONTENT: every word, link and image on the page lives in this file.
 *
 * How to edit
 *   • Change the text between the quotes. Keep the quotes and the commas.
 *   • To add an item to a list (a service, case study, stat…), copy one
 *     whole { … } block, paste it below, and edit it.
 *   • Images go in /public (e.g. /public/work/my-image.webp) and are
 *     referenced from here as "/work/my-image.webp".
 *   • Colours and fonts live in src/index.css. SEO text for Google and link
 *     previews lives in index.html.
 * ═══════════════════════════════════════════════════════════════════════════ */

import { Search, BadgeCheck, CalendarCheck, Palette, type LucideIcon } from "lucide-react";

/** A price in Ghana cedis with fixed GBP and USD figures for clients abroad.
 *  GBP and USD are straight conversions of the GHS price at the Wise mid-market
 *  rate on 4 Nov 2026 (GHS 1 = GBP 0.0644 = USD 0.0851), rounded to the nearest 5.
 *  Nigel chose straight conversion. Review them if the cedi moves a lot. */
export type Price = { ghs: string; gbp: string; usd: string; unit: string };

export type Service = {
  /** "Step 1" etc. on the card; leave out for services outside the journey. */
  step?: string;
  title: string;
  description: string;
  icon: LucideIcon;
  deliverables: string[];
  /** Leave out to show "Quoted per project". */
  price?: Price;
  /** A second, smaller price line (founding offer, upkeep). */
  priceNote?: string;
  timing?: string;
  /** The message WhatsApp opens with when a visitor taps "Start this project". */
  whatsapp: string;
};

export const siteConfig = {
  /* ── Brand ─────────────────────────────────────────────────────────────── */
  name: "Fitaa Creative",
  tagline: "Pure. Strategic. Impactful.",
  /** Shown under the hero headline. */
  description:
    "We make sure the customers already looking for you find you, trust you and book you. Google listings, WhatsApp booking, premium websites, Meta ads and design, built in Accra for businesses at home and abroad.",
  /** Live site address, no trailing slash. Used for the legal pages' canonical links. */
  url: "https://fitaacreative.com",

  /* ── Top menu ──────────────────────────────────────────────────────────────
   * href must match a section id: #home #services #why-us #work #contact,
   * or be a page path such as "/fully-booked".
   * Keep the order the same as the page so the active-section highlight reads
   * naturally. */
  nav: [
    { label: "Home",     href: "#home"     },
    { label: "Services", href: "#services" },
    { label: "Why Us",   href: "#why-us"   },
    { label: "Work",     href: "#work"     },
    { label: "Fully Booked", href: "/fully-booked" },
    { label: "Contact",  href: "#contact"  },
  ],

  /* ── 1. Hero (first screen) ────────────────────────────────────────────── */
  hero: {
    /** Small pill above the headline. The prefix only shows on wider screens. */
    eyebrow: "Creative Agency · Accra, Ghana",
    eyebrowWidePrefix: "Premium ",
    /** Two lines: the second line is coloured with the accent colour. */
    headline: ["Turn Eyeballs", "Into Revenue."],
    primaryButton: "Start Your Project",
    secondaryButton: "View Our Work",
  },

  /* ── 2. Services ───────────────────────────────────────────────────────────
   * icon: any icon from lucide.dev, imported at the top of this file.
   * deliverables: shown when a visitor taps the card ("What's included"). */
  servicesSection: {
    eyebrow: "What We Do",
    heading: "From first search to fully booked.",
    lede: "Three steps that take a customer from finding you to booking you, then coming back. Take one, or take all three.",
    /** Shown under the cards. */
    moreLabel: "See the full packages and live demos",
    moreHref: "/fully-booked",
  },
  services: [
    {
      step: "Step 1",
      title: "Get Found",
      description:
        "Be easy to find and easy to message. We put you on Google and set up WhatsApp Business, so people searching for what you sell can reach you in one tap.",
      icon: Search,
      deliverables: [
        "Google Business Profile set up and polished, for eligible businesses",
        "Instagram profile tune-up",
        "WhatsApp Business catalogue with prices, greeting and away messages",
        "Quick replies for your five most-asked questions",
        "One click-to-chat link for your bio, flyers and signage",
        "A print-ready QR card for your counter, desk or car",
      ],
      price: { ghs: "1,500", gbp: "95", usd: "130", unit: "one-off" },
      timing: "Live in 5 days",
      whatsapp: "Hi Fitaa, I'm interested in Get Found. My business is ",
    },
    {
      step: "Step 2",
      title: "Get Chosen",
      description:
        "Look like the obvious choice. A premium website on your own web address that shows your best work, prices and reviews, with one button that opens WhatsApp with the booking already written.",
      icon: BadgeCheck,
      deliverables: [
        "Everything in Get Found",
        "A premium one-page website on your own web address (domain billed at cost)",
        "Gallery, prices, reviews and map",
        "A booking button that opens WhatsApp with the request already written",
        "Shaped around how your customers book, whether by dates, slots, vehicles or appointments",
        "One round of revisions before launch",
      ],
      price: { ghs: "3,500", gbp: "225", usd: "300", unit: "one-off" },
      priceNote: "Founding price GHS 2,500 / £160 / $215 for the first 3 clients",
      timing: "Live in 7 days",
      whatsapp: "Hi Fitaa, I'm interested in Get Chosen. My business is ",
    },
    {
      step: "Step 3",
      title: "Stay Booked",
      description:
        "Keep the calendar full. We run your Meta ads, keep your page and catalogue fresh, and send a one-page report each month so you can see what's working.",
      icon: CalendarCheck,
      deliverables: [
        "Meta ads managed for you, aimed at the people most likely to book",
        "Website and catalogue updates with new photos, prices and seasonal offers",
        "A one-page monthly report on enquiries, bookings, reviews and ad results",
        "Ad budget is separate and agreed on the call",
      ],
      price: { ghs: "1,200", gbp: "75", usd: "100", unit: "a month, 3-month minimum" },
      priceNote: "Upkeep only GHS 350 / £25 / $30 a month for hosting and small updates, for Get Chosen clients who don't want ads",
      whatsapp: "Hi Fitaa, I'm interested in Stay Booked. My business is ",
    },
    {
      title: "Graphic & Digital Design",
      description:
        "Logos, brand identities, print and social content that look as good as the business behind them, for launches, campaigns and everything in between.",
      icon: Palette,
      deliverables: [
        "Logos & brand identity",
        "Flyers, brochures & magazines",
        "Social graphics & animated posts",
        "Artwork for LED and digital screens",
        "Print-ready files",
      ],
      whatsapp: "Hi Fitaa, I'd like a quote for design work. My business is ",
    },
  ] as Service[],

  /* ── 3. Why Us + stats ─────────────────────────────────────────────────────
   * Stats count up from 0 when they scroll into view. */
  whyUsSection: {
    eyebrow: "Why Fitaa Creative",
    heading: "Pure craft. Measurable results.",
    body: "We don't design for decoration. Every listing, page, post and ad is built to move one person closer to booking you, and we measure whether it did.",
  },
  stats: [
    { value: 50,  suffix: "+", label: "Brands Elevated"      },
    { value: 4,   suffix: "",  label: "Core Specialisations" },
    { value: 100, suffix: "%", label: "Client Dedication"    },
    { value: 10,  suffix: "+", label: "Years of Excellence"  },
  ],

  /* ── 4. Selected Work (case studies) ───────────────────────────────────────
   * Images: 4:3 ratio, about 1440×1080, WebP, under ~150 KB each.
   * result: the small label on the image. link: leave "" if there's no page
   * to send visitors to; the tile then shows without an arrow. */
  workSection: {
    eyebrow: "Selected Work",
    heading: "Real Clients. Real Results.",
    headerLink: "Start a Project",
    alsoWorkedWithLabel: "Also worked with",
  },
  caseStudies: [
    {
      client: "Hydra Offshore",
      industry: "Oil & Gas",
      year: "2013–2014",
      result: "Every Page Designed",
      description:
        "Designed every page of Offshore Ghana, Hydra's oil and gas magazine with 20,000 readers across West Africa, plus its advertising rate card and corporate brochure.",
      deliverables: ["Offshore Ghana magazine", "Rate card", "Brochure"],
      link: "",
      imagePath: "/work/hydra-offshore.webp",
      imageAlt: "Offshore Ghana magazine cover and advertising rate card designed for Hydra Offshore",
    },
    {
      client: "Mummy Day Care Centre",
      industry: "Early Childhood Education",
      year: "2018–2021",
      result: "3 Years of Marketing",
      description:
        "Three years leading marketing for an Accra day care, designing almost everything the brand put out: admissions campaigns like the 50%-off September intake, flyers, social content and a video ad.",
      deliverables: ["Marketing lead", "Admissions campaigns", "Social content", "Video ad"],
      link: "https://www.instagram.com/mummy.day.care.centre",
      imagePath: "/work/mummy-day-care.webp",
      imageAlt: "Mummy Day Care Centre admissions flyer and crest",
    },
    {
      client: "Tinkertresses",
      industry: "Beauty & Hair",
      year: "Oct 2019–Jan 2020",
      result: "Scroll-Stopping Promos",
      description:
        "Animated product promos for a hair-care brand's Instagram: restocks, bundle deals and price drops, built to sell in the scroll. One bundle promo pulled 719 views.",
      deliverables: ["Animated posts", "Promo campaigns", "Social content"],
      link: "https://www.instagram.com/tinkertresses",
      imagePath: "/work/tinkertresses.webp",
      imageAlt: "Tinker Hair Care Instagram promos: bestseller restock and bundle deal",
    },
    {
      client: "Waypoint Enterprise",
      industry: "Shipping & Logistics",
      year: "2026",
      result: "UK Shipping Website",
      description:
        "Website for a Southampton shipping company sending barrels, boxes, vehicles and containers to the Caribbean, with published sailing schedules, shipment tracking and online payment for quotes, space and barrels.",
      deliverables: ["Website design and build"],
      link: "https://waypointenterprise.co.uk",
      imagePath: "/work/waypoint-enterprise.webp",
      imageAlt: "The Waypoint Enterprise website on a laptop and a phone",
    },
  ],
  /** Names shown in the "Also worked with" row under the case studies. */
  alsoWorkedWith: ["ChicKing!", "Liberty Hands Foundation", "502", "2nd Generation IT Group", "Women of SOL"],

  /* ── 5. Testimonials ───────────────────────────────────────────────────── */
  testimonialsSection: {
    eyebrow: "Client Voices",
    heading: "What our clients say.",
  },
  testimonials: [
    {
      quote:
        "Fitaa Creative gave our brand the identity it deserved. The content they created was fresh, professional, and our audience loved it from day one.",
      title: "Founder",
      company: "Tinkertresses",
    },
    {
      quote:
        "Working with Fitaa has been seamless. They understood exactly what we needed and delivered designs that felt warm and completely trustworthy.",
      title: "Director",
      company: "Mummy Day Care Centre",
    },
  ],

  /* ── 6. Contact ────────────────────────────────────────────────────────────
   * The WhatsApp link is built from `phone` automatically.
   * formspreeId: the enquiry form's inbox at formspree.io. */
  contactSection: {
    eyebrow: "Start the Conversation",
    /** Two lines, shown one under the other. */
    heading: ["Ready to Elevate", "Your Brand?"],
    body: "Whether you need to be found, chosen or kept fully booked, tell us about your business and we'll show you the fastest way there.",
    whatsappTab: "WhatsApp",
    formTab: "Send Enquiry",
    whatsappHeading: "Prefer a quick conversation?",
    whatsappBody: "Message us directly on WhatsApp. We typically reply within the hour.",
    whatsappButton: "Chat on WhatsApp",
    whatsappNote: "Opens WhatsApp on mobile or desktop",
  },
  contact: {
    email:       "fitaaba@gmail.com",
    address:     "7 Boundary Rd, East Legon, Accra",  // must match the Google Business Profile exactly
    phone:       "+233 24 280 5256",
    formspreeId: "xdajglpn",
  },

  /* ── Footer social links ───────────────────────────────────────────────── */
  social: {
    behance:   "https://www.behance.net/crea8",
    instagram: "https://www.instagram.com/fitaacreative",
  },
};
