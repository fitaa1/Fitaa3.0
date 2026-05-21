import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/config/site";
import { SectionLabel } from "./SectionLabel";
import { staggerContainer, fadeInUp, cardViewport, sectionViewport } from "@/lib/animations";
export function FeaturedWork() {
  return (
    <section id="work" className="py-36 bg-background">
      <div className="container mx-auto px-6 md:px-12">
        <motion.div initial="hidden" whileInView="visible" viewport={sectionViewport} variants={fadeInUp} className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-6">
          <SectionLabel eyebrow="Selected Work" heading="Proof of Concept." />
          <a href="#contact" className="text-xs font-sans uppercase tracking-[0.15em] text-muted-foreground hover:text-ruby transition-colors duration-300 flex items-center gap-2 group shrink-0">
            Start a Project <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
          </a>
        </motion.div>
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={cardViewport} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {siteConfig.caseStudies.map((study) => (
            <motion.div key={study.client} variants={fadeInUp} className="group cursor-pointer">
              <div className="relative aspect-[4/5] overflow-hidden bg-card mb-6">
                <div className={`absolute inset-0 bg-gradient-to-br ${study.bg}`} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-serif text-7xl font-bold text-foreground/5">{study.client.charAt(0)}</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/10 to-transparent opacity-70 group-hover:opacity-40 transition-opacity duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out">
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-background/70 text-ruby text-xs font-sans uppercase tracking-wider backdrop-blur-sm border border-ruby/25">{study.result}</span>
                </div>
                <div className="absolute top-4 right-4 w-8 h-8 bg-background/60 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ArrowUpRight size={14} className="text-foreground" />
                </div>
              </div>
              <div>
                <p className="text-[10px] font-sans uppercase tracking-[0.2em] text-gold mb-2">{study.industry}</p>
                <h3 className="text-2xl md:text-3xl font-serif font-medium text-foreground group-hover:text-ruby transition-colors duration-300">{study.client}</h3>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}