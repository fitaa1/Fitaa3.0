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
import type { NoteKey, PriceKey } from "@/lib/region";

/** A price on a service card. The figures themselves live in src/config/pricing.json, once per
 *  currency (GHS for Ghana, GBP for the UK, USD for everyone else), so the visitor sees one
 *  price in their own currency. `key` names the price there; `unit` is shown beside it. */
export type Price = { key: PriceKey; unit: string };

export type Service = {
  /** "Step 1" etc. on the card; leave out for services outside the journey. */
  step?: string;
  title: string;
  description: string;
  icon: LucideIcon;
  deliverables: string[];
  /** Leave out to show "Quoted per project". */
  price?: Price;
  /** A second, smaller price line (Get Chosen note, upkeep), named by its key in pricing.json. */
  priceNote?: NoteKey;
  timing?: string;
  /** The message WhatsApp opens with when a visitor taps "Start this project". */
  whatsapp: string;
  /** The label shown in the header and floating WhatsApp button when this package is in view. */
  dataCtaLabel: string;
  /** The WhatsApp message sent when this package's CTA is used. */
  dataCtaMessage: string;
};

export const siteConfig = {
  /* ── Brand ─────────────────────────────────────────────────────────────── */
  name: "Fitaa Creative",
  tagline: "Pure. Strategic. Impactful.",
  /** Shown under the hero headline. */
  description:
    "We make sure the customers already looking for you find you, trust you and book you. Google listings, WhatsApp booking, premium websites, Meta ads and design, for businesses in Ghana, the UK and beyond.",
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
    eyebrow: "Creative Agency · Ghana & UK",
    eyebrowWidePrefix: "Premium ",
    /** Two lines: the second line is coloured with the accent colour. */
    headline: ["Turn Eyeballs", "Into Revenue."],
    primaryButton: "Start Your Project",
    secondaryButton: "View Our Work",
    /** The header button and floating WhatsApp button read this when the hero is in view. */
    dataCtaLabel: "Get in touch",
    dataCtaMessage: "Hi Fitaa Creative, I'd like to get in touch. My business is ",
  },

  /* ── 2. Services ───────────────────────────────────────────────────────────
   * icon: any icon from lucide.dev, imported at the top of this file.
   * deliverables: shown when a visitor taps the card ("What's included"). */
  servicesSection: {
    eyebrow: "What We Do",
    heading: "From first search to fully booked.",
    lede: "Three steps that take a customer from finding you to booking you, then coming back. Take one, or take all three.",
    /** moreHref is also where each package card's "Learn more" goes (Nigel, 7 Nov: the open card already shows that package, so it opens the full page). */
    moreLabel: "See the full packages and live demos",
    moreHref: "/fully-booked",
    dataCtaLabel: "Ask about a package",
    dataCtaMessage: "Hi Fitaa, I'd like to ask about a package.",
    /** Under the packages: the mechanism shown, one live demo per step that opens WhatsApp with the booking already written. */
    seeItWorking: {
      heading: "See it working",
      messageHeading: "The message, already written",
      lede: "Tap a button on this site and WhatsApp opens with this written for you. You finish the line and send it.",
      demosEyebrow: "The demos",
      demosHeading: "Try a live demo",
      demosLede: "Open any demo, pick a date or a service, and the button opens WhatsApp with the request already written.",
      demos: [
        { label: "Ridge House", href: "/demo/ridge-house" },
        { label: "Maison Adwoa", href: "/demo/studio" },
        { label: "Kora Drive", href: "/demo/car-rental" },
        { label: "Adom Family Clinic", href: "/demo/clinic" },
        { label: "Nkyene Kitchen", href: "/demo/restaurant" },
        { label: "Lumen Skin Clinic", href: "/demo/aesthetics" },
        { label: "Sika Frames", href: "/demo/photographer" },
      ],
    },
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
      price: { key: "getFound", unit: "one-off" },
      timing: "Live in 5 days",
      whatsapp: "Hi Fitaa, I'm interested in Get Found. My business is ",
      dataCtaLabel: "Ask about Get Found",
      dataCtaMessage: "Hi Fitaa, I'd like to ask about Get Found. My business is ",
    },
    {
      step: "Step 2",
      title: "Get Chosen",
      description:
        "Look like the obvious choice. A premium website on your own web address that shows your best work, prices and reviews, with one button that opens WhatsApp with the booking already written.",
      icon: BadgeCheck,
      deliverables: [
        "A premium one-page website on your own web address (domain billed at cost)",
        "Built for search, so you show up on Google and in AI answers like ChatGPT",
        "Gallery, prices, reviews and map",
        "A booking button that opens WhatsApp with the request already written",
        "Shaped around how your customers book, whether by dates, slots, vehicles or appointments",
        "One round of revisions before launch",
      ],
      price: { key: "getChosen", unit: "one-off" },
      priceNote: "getChosenNote",
      timing: "Live in 7 days",
      whatsapp: "Hi Fitaa, I'm interested in Get Chosen. My business is ",
      dataCtaLabel: "Ask about Get Chosen",
      dataCtaMessage: "Hi Fitaa, I'd like to ask about Get Chosen. My business is ",
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
      price: { key: "stayBooked", unit: "a month, 3-month minimum" },
      priceNote: "upkeepNote",
      whatsapp: "Hi Fitaa, I'm interested in Stay Booked. My business is ",
      dataCtaLabel: "Ask about Stay Booked",
      dataCtaMessage: "Hi Fitaa, I'd like to ask about Stay Booked. My business is ",
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
      dataCtaLabel: "Ask about design",
      dataCtaMessage: "Hi Fitaa, I'd like a quote for design work. My business is ",
    },
  ] as Service[],

  /* ── 3. Why Us + stats ─────────────────────────────────────────────────────
   * Stats count up from 0 when they scroll into view. */
  whyUsSection: {
    eyebrow: "Why Fitaa Creative",
    heading: "Pure craft. Measurable results.",
    body: "We don't design for decoration. Every listing, page, post and ad is built to move one person closer to booking you, and we measure whether it did.",
    dataCtaLabel: "Get in touch",
    dataCtaMessage: "Hi Fitaa, I'd like to get in touch. My business is ",
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
    dataCtaLabel: "Ask about your project",
    dataCtaMessage: "Hi Fitaa, I'd like to ask about my project. My business is ",
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
    dataCtaLabel: "Get in touch",
    dataCtaMessage: "Hi Fitaa, I'd like to get in touch. My business is ",
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
    /** The floating WhatsApp button shows this when the Contact section is in view; the header button is hidden here. */
    dataCtaLabel: "Get in touch",
    dataCtaMessage: "Hi Fitaa Creative, I'd like to get in touch. My business is ",
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
