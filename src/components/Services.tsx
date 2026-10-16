import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Check } from "lucide-react";
import { SectionLabel } from "./SectionLabel";
import { siteConfig } from "@/config/site";
import { staggerContainerFast, fadeInUp, cardViewport, EASE_CURVE } from "@/lib/animations";

type Service = (typeof siteConfig.services)[number];

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLLIElement>(null);
  const panelId = `service-panel-${index}`;

  /* Spotlight follows the pointer (mouse, pen or finger) via CSS variables. */
  const track = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <motion.li
      ref={ref}
      variants={fadeInUp}
      onPointerMove={track}
      onPointerDown={track}
      data-open={open}
      className="service-card group relative bg-card border border-border/40 overflow-hidden"
    >
      {/* Pointer spotlight */}
      <div className="service-spotlight pointer-events-none absolute inset-0" aria-hidden="true" />
      {/* Top edge line */}
      <div
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-ruby/60 to-transparent opacity-0 group-hover:opacity-100 group-data-[open=true]:opacity-100 transition-opacity duration-500"
        aria-hidden="true"
      />

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        className="relative w-full text-left p-8 md:p-9 cursor-pointer focus-visible:outline-offset-[-2px]"
      >
        <div className="flex items-start justify-between mb-8">
          <span className="service-icon relative inline-flex items-center justify-center w-12 h-12 border border-border/50 bg-background/40">
            <service.icon className="w-[1.4rem] h-[1.4rem] text-gold" strokeWidth={1.3} aria-hidden="true" />
          </span>
          <span
            className="inline-flex items-center justify-center w-8 h-8 border border-border/50 text-muted-foreground transition-all duration-400 group-hover:border-ruby/50 group-hover:text-ruby group-data-[open=true]:rotate-45 group-data-[open=true]:text-ruby group-data-[open=true]:border-ruby/50"
            aria-hidden="true"
          >
            <Plus size={15} />
          </span>
        </div>

        <h3 className="text-[1.25rem] font-serif font-medium mb-3 text-foreground group-hover:text-ruby group-data-[open=true]:text-ruby transition-colors duration-300 leading-snug">
          {service.title}
        </h3>
        <p className="text-muted-foreground font-sans font-light text-[0.9rem] leading-[1.72]">
          {service.description}
        </p>
        <span className="sr-only">{open ? "Hide" : "Show"} what's included</span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            key="panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE_CURVE }}
            className="relative overflow-hidden"
          >
            <div className="px-8 md:px-9 pb-8 md:pb-9">
              <p className="text-[0.62rem] font-sans uppercase tracking-[0.22em] text-gold mb-4 pt-5 border-t border-border/40">
                What's included
              </p>
              <ul className="grid gap-2.5">
                {service.deliverables.map((d, i) => (
                  <motion.li
                    key={d}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.06 * i + 0.1, duration: 0.35, ease: EASE_CURVE }}
                    className="flex items-center gap-3 text-[0.9rem] font-sans text-foreground/85"
                  >
                    <Check size={14} className="text-ruby shrink-0" aria-hidden="true" />
                    {d}
                  </motion.li>
                ))}
              </ul>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 mt-6 text-[0.68rem] font-sans uppercase tracking-[0.18em] text-ruby hover:text-foreground transition-colors"
              >
                Start this project →
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  );
}

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
          id="services-heading"
          eyebrow={siteConfig.servicesSection.eyebrow}
          heading={siteConfig.servicesSection.heading}
          className="mb-[var(--sp-6)] md:max-w-[38rem]"
        />

        <motion.ul
          variants={staggerContainerFast}
          initial="hidden"
          whileInView="visible"
          viewport={cardViewport}
          className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start"
          role="list"
        >
          {siteConfig.services.map((service, i) => (
            <ServiceCard key={service.title} service={service} index={i} />
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
