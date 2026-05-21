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
    { value: 50,  suffix: "+", label: "Brands Elevated"      },
    { value: 4,   suffix: "",  label: "Core Specialisations" },
    { value: 100, suffix: "%", label: "Client Dedication"    },
    { value: 3,   suffix: "+", label: "Years of Excellence"  },
  ],

  caseStudies: [
    {
      client: "Tinkertresses",
      industry: "Beauty & Hair",
      result: "Social Media Growth",
      description: "Scroll-stopping posts and videos that built a loyal, engaged community from scratch.",
      link: "https://www.instagram.com/tinkertresses",
      bg: "from-[#9B122C]/40 via-[#9B122C]/15 to-transparent",
      /*
       * REAL CLIENT PHOTO:
       * Add a screenshot from @tinkertresses Instagram to /public/work/tinkertresses.jpg
       * then change imagePath to: "/work/tinkertresses.jpg"
       */
      imagePath: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=720&q=85&auto=format&fit=crop",
    },
    {
      client: "Mummy Day Care Centre",
      industry: "Early Childhood Education",
      result: "Community Engagement",
      description: "Warm, trustworthy social content that brought families through the door.",
      link: "https://www.instagram.com/mummy.day.care.centre",
      bg: "from-[#D4AF37]/30 via-[#D4AF37]/10 to-transparent",
      /*
       * REAL CLIENT PHOTO:
       * Add screenshot from @mummy.day.care.centre to /public/work/mummy-daycare.jpg
       * then change imagePath to: "/work/mummy-daycare.jpg"
       */
      imagePath: "https://images.unsplash.com/photo-1503454537195-1dabb4ba1952?w=720&q=85&auto=format&fit=crop",
    },
    {
      client: "Hydra Offshore",
      industry: "Oil & Gas",
      result: "Industry Publication",
      description: "A polished oil and gas magazine that positioned Hydra as an authority in the sector.",
      link: "#work",
      bg: "from-[#9B122C]/30 via-[#D4AF37]/10 to-transparent",
      /*
       * REAL CLIENT PHOTO: Add Hydra Offshore asset to /public/work/hydra-offshore.jpg
       */
      imagePath: "https://images.unsplash.com/photo-1542744173-05336fcc7ad4?w=720&q=85&auto=format&fit=crop",
    },
    {
      client: "Women of Sol",
      industry: "Web3 / NFT",
      result: "NFT Mint Site Launch",
      description: "A high-impact mint site that brought an empowering digital art collection to life.",
      link: "https://www.instagram.com/womenofsolnft",
      bg: "from-[#D4AF37]/25 via-[#9B122C]/12 to-transparent",
      /*
       * REAL CLIENT PHOTO:
       * Add screenshot from @womenofsolnft to /public/work/women-of-sol.jpg
       * then change imagePath to: "/work/women-of-sol.jpg"
       */
      imagePath: "https://images.unsplash.com/photo-1535303311164-664fc9ec6532?w=720&q=85&auto=format&fit=crop",
    },
  ],

  testimonials: [
    {
      quote:
        "Fitaa Digital gave our brand the identity it deserved. The content they created was fresh, professional, and our audience loved it from day one.",
      author: "Abena Mensah",
      title: "Founder",
      company: "Tinkertresses",
    },
    {
      quote:
        "Working with Fitaa has been seamless. They understood exactly what we needed and delivered designs that felt warm and completely trustworthy.",
      author: "Akosua Darko",
      title: "Director",
      company: "Mummy Day Care Centre",
    },
  ],

  contact: {
    email:       "hello@fitaa.digital",
    address:     "Accra, Ghana",
    phone:       "",
    formspreeId: "xdajglpn",
  },

  social: {
    behance:   "https://www.behance.net/crea8",
    instagram: "https://www.instagram.com/fitaacreative",
  },
};
