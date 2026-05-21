import { motion } from "framer-motion";
import { SectionLabel } from "./SectionLabel";
import { siteConfig } from "@/config/site";
import { staggerContainerFast, fadeInUp, cardViewport } from "@/lib/animations";

export function Services() {
  return (
    <section
      id="services"
      className="py-[var(--sp-7)] bg-background relative border-t border-border/20"
      aria-labelledby="services-heading"
    >
      {/* Decorative top line */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-14 bg-gradient-to-b from-ruby/35 to-transparent"
        aria-hidden="true"
      />

      <div className="container mx-auto px-6 md:px-12">
        <SectionLabel
          eyebrow="What We Do"
          heading="Services Built to Perform."
          className="mb-[var(--sp-6)] md:max-w-[38rem]"
        />

        <motion.ul
          variants={staggerContainerFast}
          initial="hidden"
          whileInView="visible"
          viewport={cardViewport}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
          role="list"
        >
          {siteConfig.services.map((service) => (
            <motion.li
              key={service.title}
              variants={fadeInUp}
              className="card-hover group relative p-9 bg-card border border-border/40 hover:border-ruby/20 overflow-hidden"
            >
              {/* Hover glow */}
              <div
                className="absolute inset-0 bg-gradient-to-br from-ruby/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                aria-hidden="true"
              />
              {/* Top edge line reveal */}
              <div
                className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-ruby/45 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                aria-hidden="true"
              />

              {/* Icon — golden ratio gap below: --sp-4 = 34px */}
              <service.icon
                className="w-[1.625rem] h-[1.625rem] text-gold mb-[2.125rem] group-hover:text-ruby transition-colors duration-350"
                strokeWidth={1.2}
                aria-hidden="true"
              />

              <h3 className="text-[1.25rem] font-serif font-medium mb-3 text-foreground group-hover:text-ruby transition-colors duration-350 leading-snug">
                {service.title}
              </h3>
              <p className="text-muted-foreground font-sans font-light text-[0.9rem] leading-[1.72]">
                {service.description}
              </p>

              {/* Corner accent */}
              <div
                className="absolute bottom-4 right-4 w-1 h-1 bg-border group-hover:bg-ruby/45 transition-colors duration-500"
                aria-hidden="true"
              />
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
