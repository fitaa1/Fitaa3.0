import { useRef } from "react";
import { useRise } from "@/hooks/useRise";
import { siteConfig } from "@/config/site";
import { SectionLabel } from "./SectionLabel";

export function Testimonials() {
  const ref = useRef<HTMLDivElement>(null);
  useRise(ref);

  return (
    <section
      id="testimonials"
      className="py-[var(--sp-7)] plane-band relative overflow-hidden"
      aria-labelledby="testimonials-heading"
    >
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <SectionLabel id="testimonials-heading" eyebrow={siteConfig.testimonialsSection.eyebrow} heading={siteConfig.testimonialsSection.heading} className="mb-[var(--sp-6)]" />

        <div ref={ref} className={`rise grid grid-cols-1 ${siteConfig.testimonials.length > 1 ? "md:grid-cols-2" : ""} gap-12 lg:gap-[5.5rem]`}>
          {siteConfig.testimonials.map((t, i) => (
            <figure key={t.company} className="relative flex flex-col text-center">
              {/* Quote */}
              <blockquote className="relative z-10 text-[1.2rem] md:text-[1.35rem] font-display font-light text-foreground/82 leading-[1.68] mb-[2.125rem] pt-5 max-w-xl mx-auto">
                {t.quote}
              </blockquote>

              <figcaption className="flex items-center gap-4 mt-auto">
                {/* Avatar initial */}
                <div
                  className="w-10 h-10 border border-border/25 bg-background flex items-center justify-center text-ruby font-display text-base shrink-0"
                  aria-hidden="true"
                >
                  {t.company.charAt(0)}
                </div>
                <div>
                  <p className="font-sans font-medium text-foreground text-[0.875rem]">{t.company}</p>
                  <p className="text-[0.7rem] text-muted-foreground font-sans uppercase tracking-[0.16em] mt-0.5">
                    {t.title}
                  </p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
