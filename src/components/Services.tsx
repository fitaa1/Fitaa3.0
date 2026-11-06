import { useRef, useState, type CSSProperties } from "react";
import { usePresence, useInViewOnce } from "@/lib/reveal";
import { Plus, Check, ArrowRight } from "lucide-react";
import { SectionLabel } from "./SectionLabel";
import { siteConfig, type Service } from "@/config/site";
import { CurrencySwitch, useRegion } from "@/lib/region";

function ServiceCard({ service, index, delay }: { service: Service; index: number; delay: number }) {
  const [open, setOpen] = useState(false);
  const { price, note, waLink } = useRegion();
  const ref = useRef<HTMLLIElement>(null);
  const isInView = useInViewOnce(ref, "-40px");
  const { mounted, visible } = usePresence(open, 300);
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
    <li
      ref={ref}
      data-reveal="up"
      data-open={open}
      style={{ "--d": `${delay}s` } as CSSProperties}
      className={`service-card group relative z-10 bg-card border border-border/40 overflow-hidden ${service.step ? "" : "lg:col-span-3"} ${isInView ? "is-in" : ""}`}
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
          <span className="ml-auto mr-4 mt-1.5 text-[0.62rem] font-sans uppercase tracking-[0.22em] text-muted-foreground">
            {service.step ?? "Alongside every step"}
          </span>
          <span
            className="inline-flex items-center justify-center w-8 h-8 border border-border/50 text-muted-foreground transition-all duration-400 group-hover:border-ruby/50 group-hover:text-ruby group-data-[open=true]:rotate-45 group-data-[open=true]:text-ruby group-data-[open=true]:border-ruby/50"
            aria-hidden="true"
          >
            <Plus size={15} />
          </span>
        </div>

        <h3 className="text-[1.25rem] font-display font-medium mb-3 text-foreground group-hover:text-ruby group-data-[open=true]:text-ruby transition-colors duration-300 leading-snug">
          {service.title}
        </h3>
        <p className="text-muted-foreground font-sans font-light text-[0.9rem] leading-[1.72]">
          {service.description}
        </p>
        <span className="sr-only">{open ? "Hide" : "Show"} what's included</span>
      </button>

      {mounted && (
        <div
          id={panelId}
          data-open={visible}
          className="service-panel relative overflow-hidden"
        >
          <div className="px-8 md:px-9 pb-8 md:pb-9">
            <div className="pt-5 border-t border-border/40 mb-6" data-stagger style={{ "--d": "0.05s" } as CSSProperties}>
              {service.price ? (
                <>
                  <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="font-display font-semibold text-[1.9rem] leading-none text-foreground tabular-nums">{price(service.price.key)}</span>
                    <span className="text-[0.8rem] font-sans text-muted-foreground">{service.price.unit}</span>
                  </p>
                  {service.timing && (
                    <p className="mt-2 text-[0.62rem] font-sans uppercase tracking-[0.22em] text-ruby">{service.timing}</p>
                  )}
                  {service.priceNote && (
                    <p className="mt-3 text-[0.82rem] font-sans leading-relaxed text-gold-text border border-gold/30 bg-gold/[0.06] px-3 py-2">{note(service.priceNote)}</p>
                  )}
                </>
              ) : (
                <p className="font-display font-semibold text-[1.35rem] leading-tight text-foreground">Quoted per project</p>
              )}
            </div>
            <p className="text-[0.62rem] font-sans uppercase tracking-[0.22em] text-gold-text mb-4">
              What's included
            </p>
            <ul className={`grid gap-2.5 ${service.step ? "" : "lg:grid-cols-2 lg:gap-x-10"}`}>
              {service.deliverables.map((d, i) => (
                <li
                  key={d}
                  data-stagger
                  style={{ "--d": `${0.1 + 0.06 * i}s` } as CSSProperties}
                  className="flex items-start gap-3 text-[0.9rem] leading-[1.6] font-sans text-foreground/85"
                >
                  <Check size={14} className="text-ruby shrink-0 mt-[0.3rem]" aria-hidden="true" />
                  {d}
                </li>
              ))}
            </ul>
            <a
              href={waLink(service.whatsapp)}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-2 min-h-[44px] mt-5 text-[0.68rem] font-sans uppercase tracking-[0.18em] text-ruby hover:text-foreground transition-colors"
            >
              {service.price ? "Start this project" : "Get a quote"} <ArrowRight size={14} aria-hidden="true" />
            </a>
          </div>
        </div>
      )}
    </li>
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
          className="mb-5 md:max-w-[38rem]"
        />
        <p className="mb-5 max-w-[36rem] text-muted-foreground font-sans font-light text-[1rem] leading-[1.75]">
          {siteConfig.servicesSection.lede}
        </p>
        <CurrencySwitch className="mb-[var(--sp-6)]" />

        {/* The three steps share one thread: it runs behind the cards and shows in the gaps,
            so Found, Chosen and Booked read as one journey. Design sits below, alongside all three. */}
        <ul
          className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-start"
          role="list"
        >
          <span className="service-thread pointer-events-none absolute hidden lg:block" aria-hidden="true" />
          {siteConfig.services.map((service, i) => (
            <ServiceCard key={service.title} service={service} index={i} delay={0.1 + i * 0.12} />
          ))}
        </ul>

        <a
          href={siteConfig.servicesSection.moreHref}
          className="group/more inline-flex items-center gap-2 min-h-[44px] mt-8 text-[0.7rem] font-sans uppercase tracking-[0.18em] text-gold-text hover:text-ruby transition-colors"
        >
          {siteConfig.servicesSection.moreLabel}
          <ArrowRight size={14} className="transition-transform group-hover/more:translate-x-1" aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
