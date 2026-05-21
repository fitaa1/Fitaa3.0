import { motion } from "framer-motion";
import { SectionLabel } from "./SectionLabel";
import { siteConfig } from "@/config/site";
import { staggerContainerFast, fadeInUp, cardViewport } from "@/lib/animations";
export function Services() {
  return (
    <section id="services" className="py-36 bg-background relative border-t border-border/20">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-16 bg-gradient-to-b from-ruby/40 to-transparent" />
      <div className="container mx-auto px-6 md:px-12">
        <SectionLabel eyebrow="Core Competencies" heading="Transformation at Scale." className="mb-20 md:max-w-lg" />
        <motion.div variants={staggerContainerFast} initial="hidden" whileInView="visible" viewport={cardViewport} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {siteConfig.services.map((service) => (
            <motion.div key={service.title} variants={fadeInUp} className="group relative p-8 bg-card border border-border/40 hover:border-ruby/25 transition-all duration-500 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-ruby/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-ruby/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <service.icon className="w-7 h-7 text-gold mb-7 group-hover:text-ruby transition-colors duration-300" strokeWidth={1.25} />
              <h3 className="text-xl font-serif font-medium mb-3 text-foreground group-hover:text-ruby transition-colors duration-300">{service.title}</h3>
              <p className="text-muted-foreground font-sans font-light text-sm leading-relaxed">{service.description}</p>
              <div className="absolute bottom-4 right-4 w-1 h-1 rounded-full bg-border group-hover:bg-ruby/50 transition-colors duration-500" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}