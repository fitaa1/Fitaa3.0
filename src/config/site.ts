import { Activity, BarChart, Globe, Megaphone, Target, Zap } from "lucide-react";
export const siteConfig = {
  name: "Fitaa Digital",
  tagline: "Turn ambition into market dominance.",
  description: "Elite strategy meets cutting-edge execution. We don't just run campaigns — we transform brands into category leaders.",
  nav: [
    { label: "Home",     href: "#home"     },
    { label: "Services", href: "#services" },
    { label: "Work",     href: "#work"     },
    { label: "Why Us",   href: "#why-us"   },
    { label: "Contact",  href: "#contact"  },
  ],
  services: [
    { title: "Brand Strategy",        description: "Position your brand to command premium pricing and unshakeable loyalty.",     icon: Target    },
    { title: "Performance Marketing", description: "Data-driven acquisition engines that scale revenue predictably.",              icon: Zap       },
    { title: "Digital Experience",    description: "Immersive web and mobile properties that convert visitors into buyers.",       icon: Globe     },
    { title: "Content & Creative",    description: "High-end visual and written assets that capture attention instantly.",         icon: Megaphone },
    { title: "SEO & Growth",          description: "Dominate search results and capture high-intent organic demand.",             icon: Activity  },
    { title: "Analytics & Insights",  description: "Deep attribution models to understand exactly what drives growth.",           icon: BarChart  },
  ],
  stats: [
    { value: 127, suffix: "+",  label: "Brands Transformed"  },
    { prefix: "$", value: 2.4, suffix: "B", label: "Revenue Generated" },
    { value: 94,  suffix: "%", label: "Client Retention"     },
    { value: 12,  suffix: "",  label: "Industry Awards"      },
  ],
  caseStudies: [
    { client: "Aura Fintech", industry: "Financial Services", result: "+450% User Acquisition", bg: "from-[#9B122C]/25 via-[#9B122C]/10 to-transparent" },
    { client: "Vellure",      industry: "Luxury Retail",      result: "$12M Q4 Revenue",        bg: "from-[#D4AF37]/20 via-[#D4AF37]/8  to-transparent" },
    { client: "Nexus Health", industry: "HealthTech",         result: "Category Leadership",     bg: "from-[#9B122C]/20 via-[#D4AF37]/8  to-transparent" },
  ],
  testimonials: [
    { quote: "Fitaa Digital doesn't just execute; they completely re-engineered our market positioning. The results were immediate and staggering.", author: "Elena Rostova", title: "CMO",           company: "Aura Fintech" },
    { quote: "Working with them feels like having an unfair advantage. They operate at a level of precision I've rarely seen in this industry.",       author: "Marcus Vance",  title: "Founder & CEO", company: "Vellure"      },
  ],
  contact: {
    email:   "hello@fitaa.digital",
    address: "100 Elite Way, Suite 400\nSan Francisco, CA 94105",
    phone:   "+1 (800) 555-0199",
  },
  social: { linkedin: "https://linkedin.com", twitter: "https://twitter.com", instagram: "https://instagram.com" },
};