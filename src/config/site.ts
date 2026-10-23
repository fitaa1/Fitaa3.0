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

import { Monitor, Palette, Globe, BarChart2 } from "lucide-react";

export const siteConfig = {
  /* ── Brand ─────────────────────────────────────────────────────────────── */
  name: "Fitaa Creative",
  tagline: "Pure. Strategic. Impactful.",
  /** Shown under the hero headline. */
  description:
    "We turn billboard views and digital impressions into real customers. LED campaigns, striking visuals, and high-converting web experiences built for brands in Accra and beyond.",
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
    heading: "Services Built to Perform.",
  },
  services: [
    {
      title: "LED Billboard Campaigns",
      description:
        "Turn high-traffic views into real customers with dynamic, eye-catching LED advertising that commands attention day and night.",
      icon: Monitor,
      deliverables: ["Campaign concept & messaging", "Static and animated LED creatives", "Artwork sized for every screen", "QR / landing page follow-through"],
    },
    {
      title: "Graphic & Digital Design",
      description:
        "Professional visuals and creatives that grab attention instantly, crafted to work across billboards, social media, and every digital surface.",
      icon: Palette,
      deliverables: ["Logos & brand identity", "Flyers, brochures & magazines", "Social graphics & animated posts", "Print-ready files"],
    },
    {
      title: "Campaign Landing Pages",
      description:
        "Fast, high-converting websites built specifically to turn billboard viewers and ad clicks into paying customers.",
      icon: Globe,
      deliverables: ["Single-page campaign sites", "Mobile-first and fast-loading", "WhatsApp & enquiry forms", "Web3 / NFT mint sites"],
    },
    {
      title: "Digital Marketing & Web Presence",
      description:
        "Complete online setup: websites, SEO basics, Google Business and social presence that amplify every advertising effort.",
      icon: BarChart2,
      deliverables: ["Business websites", "Google Business Profile setup", "SEO basics", "Social media content"],
    },
  ],

  /* ── 3. Why Us + stats ─────────────────────────────────────────────────────
   * Stats count up from 0 when they scroll into view. */
  whyUsSection: {
    eyebrow: "Why Fitaa Creative",
    heading: "Pure craft. Measurable results.",
    body: "We don't just create pretty visuals. Every billboard, every post, every landing page is engineered to move people and drive real business results in Accra and across Ghana.",
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
        "Website for a Southampton shipping company sending barrels, boxes, vehicles and full containers to 10 Caribbean destinations, with published sailing schedules and online payment for quotes and space.",
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
    body: "Whether it's a billboard campaign, a striking new identity, or a complete digital presence, let's make it happen.",
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
