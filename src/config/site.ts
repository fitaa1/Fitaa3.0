import { Monitor, Palette, Globe, BarChart2 } from "lucide-react";

export const siteConfig = {
  name: "Fitaa Digital",
  tagline: "Pure. Strategic. Impactful.",
  description:
    "We turn billboard views and digital impressions into real customers. LED campaigns, striking visuals, and high-converting web experiences — built for brands in Accra and beyond.",
  url: "https://fitaa.digital",

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
    },
    {
      title: "Graphic & Digital Design",
      description:
        "Professional visuals and creatives that grab attention instantly — crafted to work across billboards, social media, and every digital surface.",
      icon: Palette,
    },
    {
      title: "Campaign Landing Pages",
      description:
        "Fast, high-converting websites built specifically to turn billboard viewers and ad clicks into paying customers.",
      icon: Globe,
    },
    {
      title: "Digital Marketing & Web Presence",
      description:
        "Complete online setup — websites, SEO basics, Google Business, and social presence — that amplifies every advertising effort.",
      icon: BarChart2,
    },
  ],

  stats: [
    { value: 50,  suffix: "+",  label: "Brands Elevated"       },
    { value: 4,   suffix: "",   label: "Core Specialisations"  },
    { value: 100, suffix: "%",  label: "Client Dedication"     },
    { value: 3,   suffix: "+",  label: "Years of Excellence"   },
  ],

  caseStudies: [
    {
      client: "Tinkertresses",
      industry: "Beauty & Hair",
      result: "Social Media Growth",
      description: "Social media collateral — scroll-stopping posts and videos that built a loyal community.",
      link: "https://www.instagram.com/tinkertresses",
      bg: "from-[#9B122C]/30 via-[#9B122C]/10 to-transparent",
      imagePath: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=700&q=80&auto=format&fit=crop",
    },
    {
      client: "Mummy Day Care Centre",
      industry: "Early Childhood",
      result: "Community Engagement",
      description: "Warm, trustworthy social media content that brought families through the door.",
      link: "https://www.instagram.com/mummy.day.care.centre",
      bg: "from-[#D4AF37]/25 via-[#D4AF37]/8 to-transparent",
      imagePath: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=700&q=80&auto=format&fit=crop",
    },
    {
      client: "Hydra Offshore",
      industry: "Oil & Gas",
      result: "Industry Publication",
      description: "A polished oil and gas magazine that positioned Hydra as an authority in the sector.",
      link: "#work",
      bg: "from-[#9B122C]/20 via-[#D4AF37]/8 to-transparent",
      imagePath: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=700&q=80&auto=format&fit=crop",
    },
    {
      client: "Women of Sol",
      industry: "Web3 / NFT",
      result: "Mint Site Launch",
      description: "A high-impact NFT mint site that brought an empowering digital art collection to life.",
      link: "https://www.instagram.com/womenofsolnft",
      bg: "from-[#D4AF37]/20 via-[#9B122C]/10 to-transparent",
      imagePath: "https://images.unsplash.com/photo-1639762681057-408e52192e55?w=700&q=80&auto=format&fit=crop",
    },
  ],

  testimonials: [
    {
      quote:
        "Fitaa Digital gave our brand the identity it deserved. The content they created for us was fresh, professional, and our audience loved it from day one.",
      author: "Abena Mensah",
      title: "Founder",
      company: "Tinkertresses",
    },
    {
      quote:
        "Working with Fitaa has been seamless. They understood exactly what we needed for our centre and delivered designs that felt warm and trustworthy.",
      author: "Akosua Darko",
      title: "Director",
      company: "Mummy Day Care Centre",
    },
  ],

  contact: {
    email:   "hello@fitaa.digital",
    address: "Accra, Ghana",
    phone:   "+233 (0) 000 000 000",
    formspreeId: "",
  },

  social: {
    behance:   "https://www.behance.net/crea8",
    instagram: "https://www.instagram.com/fitaacreative",
  },
};
