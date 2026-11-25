/*
 * The home page: the header, then each section in the order `sections` in src/config/site.ts gives, then the
 * footer, back to top and the floating WhatsApp button. To reorder or hide a section, change that list, not
 * this file. A new section is added here once (in SECTIONS) and then placed from site.ts.
 */
import type { ComponentType } from "react";
import { siteConfig }   from "@/config/site";
import { Navbar }       from "@/components/Navbar";
import { Hero }         from "@/components/Hero";
import { Services }     from "@/components/Services";
import { WhyUs }        from "@/components/WhyUs";
import { FeaturedWork } from "@/components/FeaturedWork";
import { Testimonials } from "@/components/Testimonials";
import { FinalCTA }     from "@/components/FinalCTA";
import { Footer }       from "@/components/Footer";
import { ScrollToTop }  from "@/components/ScrollToTop";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { SapphireSeam } from "@/components/SapphireSeam";

/* Every section the page can show, by the name used in site.ts. */
export const SECTIONS: Record<(typeof siteConfig.sections)[number], ComponentType> = {
  hero: Hero,
  sapphire: SapphireSeam,
  services: Services,
  whyUs: WhyUs,
  work: FeaturedWork,
  testimonials: Testimonials,
  contact: FinalCTA,
};

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-ruby/25 selection:text-foreground">
      <Navbar />
      {siteConfig.sections.map((name, i) => {
        const Section = SECTIONS[name];
        return <Section key={`${name}-${i}`} />;
      })}
      <Footer /><ScrollToTop /><FloatingWhatsApp />
    </main>
  );
}
