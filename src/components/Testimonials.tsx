import { motion } from "framer-motion";
import { siteConfig } from "@/config/site";
import { SectionLabel } from "./SectionLabel";
import { staggerContainer, fadeInUp, cardViewport } from "@/lib/animations";
export function Testimonials() {
  return (
    <section className="py-36 bg-card border-y border-border/20 relative overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <SectionLabel eyebrow="Client Voices" heading="Results that speak first." className="mb-20" />
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={cardViewport} className={`grid grid-cols-1 ${siteConfig.testimonials.length > 1 ? "md:grid-cols-2" : ""} gap-12 lg:gap-20`}>
          {siteConfig.testimonials.map((t) => (
            <motion.div key={t.author} variants={fadeInUp} className="relative flex flex-col">
              <div className="absolute -top-4 -left-2 text-[7rem] leading-none font-serif text-ruby/10 select-none pointer-events-none" aria-hidden="true">&ldquo;</div>
              <blockquote className="relative z-10 text-xl md:text-2xl font-serif font-light text-foreground/85 leading-relaxed mb-10 pt-6">{t.quote}</blockquote>
              <div className="flex items-center gap-4 mt-auto">
                <div className="w-11 h-11 rounded-full border border-ruby/30 bg-background flex items-center justify-center text-ruby font-serif text-lg shrink-0">{t.author.charAt(0)}</div>
                <div>
                  <p className="font-sans font-medium text-foreground text-sm">{t.author}</p>
                  <p className="text-xs text-muted-foreground font-sans uppercase tracking-wider">{t.title} — {t.company}</p>
                </div>
                <div className="flex-1 h-px bg-border/30 hidden md:block" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}