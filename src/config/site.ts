import { Monitor, Palette, Globe, BarChart2 } from "lucide-react";

export const siteConfig = {
  name: "Fitaa Digital",
  tagline: "Pure. Strategic. Impactful.",
  description:
    "We turn billboard views and digital impressions into real customers. LED campaigns, striking visuals, and high-converting web experiences — built for brands in Accra and beyond.",
  url: "https://fitaadigital.vercel.app",

  nav: [
    { label: "Home",     href: "#home"     },
    { label: "Services", href: "#services" },
    { label: "Work",     href: "#work"     },
    { label: "Why Us",   href: "#why-us"   },
    { label: "Contact",  href: "#contact"  },
  ],

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
        "Professional visuals and creatives that grab attention instantly — crafted to work across billboards, social media, and every digital surface.",
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
        "Complete online setup — websites, SEO basics, Google Business, and social presence — that amplifies every advertising effort.",
      icon: BarChart2,
      deliverables: ["Business websites", "Google Business Profile setup", "SEO basics", "Social media content"],
    },
  ],

  stats: [
    { value: 50,  suffix: "+", label: "Brands Elevated"      },
    { value: 4,   suffix: "",  label: "Core Specialisations" },
    { value: 100, suffix: "%", label: "Client Dedication"    },
    { value: 10,  suffix: "+", label: "Years of Excellence"  },
  ],

  caseStudies: [
    {
      client: "Hydra Offshore",
      industry: "Oil & Gas",
      year: "2013 – 2014",
      result: "Every Page Designed",
      description:
        "An oil and gas services firm needed print that matched the seriousness of its sector. We designed every page of the company magazine, plus its advertising rate card and corporate brochure.",
      deliverables: ["Magazine", "Rate card", "Brochure"],
      link: "#work",
      imagePath: "/work/hydra-offshore.webp",
      imageAlt: "Hydra Offshore magazine cover and advertising rate card designed by Fitaa",
    },
    {
      client: "Mummy Day Care Centre",
      industry: "Early Childhood Education",
      year: "2018 – 2021",
      result: "3 Years of Marketing",
      description:
        "Three years running marketing for an Accra day care — admissions campaigns like the 50%-off September intake, social content and a video ad that kept enrolment conversations going.",
      deliverables: ["Admissions flyers", "Social content", "Video ad"],
      link: "https://www.instagram.com/mummy.day.care.centre",
      imagePath: "/work/mummy-day-care.webp",
      imageAlt: "Mummy Day Care Centre admissions flyer and crest",
    },
    {
      client: "Tinkertresses",
      industry: "Beauty & Hair",
      year: "Oct 2019 – Jan 2020",
      result: "Scroll-Stopping Promos",
      description:
        "Animated product promos for a hair-care brand's Instagram — restocks, bundle deals and price drops, built to sell in the scroll. One bundle promo pulled 719 views.",
      deliverables: ["Animated posts", "Promo campaigns", "Social content"],
      link: "https://www.instagram.com/tinkertresses",
      imagePath: "/work/tinkertresses.webp",
      imageAlt: "Tinker Hair Care Instagram promos: bestseller restock and bundle deal",
    },
    {
      client: "Women of SOL",
      industry: "Web3 / NFT",
      year: "2022",
      result: "10,000-Piece Mint",
      description:
        "The mint site for a Ghanaian, women-led collection of 10,000 hand-drawn avatars on Solana — a project giving 20% of mint sales to women's health and education.",
      deliverables: ["Mint website", "Web3 integration"],
      link: "https://www.instagram.com/womenofsolnft",
      imagePath: "/work/women-of-sol.webp",
      imageAlt: "Two Women of SOL NFT avatars from the collection",
    },
  ],

  /** Smaller clients shown in the "Also worked with" strip under Selected Work. */
  alsoWorkedWith: ["ChicKing!", "Liberty Hands Foundation", "502", "2nd Generation IT Group"],

  testimonials: [
    {
      quote:
        "Fitaa Digital gave our brand the identity it deserved. The content they created was fresh, professional, and our audience loved it from day one.",
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

  contact: {
    email:       "fitaaba@gmail.com",
    address:     "Accra, Ghana",
    phone:       "+233 24 280 5256",
    formspreeId: "xdajglpn",
  },

  social: {
    behance:   "https://www.behance.net/crea8",
    instagram: "https://www.instagram.com/fitaacreative",
  },
};
