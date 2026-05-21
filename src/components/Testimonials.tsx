import { motion } from "framer-motion";
import { siteConfig } from "@/config/site";
import { SectionLabel } from "./SectionLabel";
import { staggerContainerSlow, fadeInUp, cardViewport } from "@/lib/animations";

export function Testimonials() {
  return (
    <section
      className="py-[var(--sp-7)] bg-card border-y border-border/20 relative overflow-hidden"
      aria-labelledby="testimonials-heading"
    >
      {/* Faint background motif */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 50%, rgba(155,18,44,1) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(212,175,55,1) 0%, transparent 50%)",
        }}
        aria-hidden="true"
      />

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <SectionLabel eyebrow="Client Voices" heading="What our clients say." className="mb-[var(--sp-6)]" />

        <motion.div
          variants={staggerContainerSlow}
          initial="hidden"
          whileInView="visible"
          viewport={cardViewport}
          className={`grid grid-cols-1 ${siteConfig.testimonials.length > 1 ? "md:grid-cols-2" : ""} gap-12 lg:gap-[5.5rem]`}
          role="list"
          aria-label="Client testimonials"
        >
          {siteConfig.testimonials.map((t) => (
            <motion.figure
              key={t.author}
              variants={fadeInUp}
              className="relative flex flex-col"
              role="listitem"
            >
              {/* Large decorative quotation mark */}
              <div
                className="absolute -top-3 -left-1 text-[6rem] leading-none font-serif text-ruby/8 select-none pointer-events-none"
                aria-hidden="true"
              >
                &ldquo;
              </div>

              <blockquote className="relative z-10 text-[1.2rem] md:text-[1.35rem] font-serif font-light text-foreground/82 leading-[1.68] mb-[2.125rem] pt-5">
                {t.quote}
              </blockquote>

              {/* Divider line — golden width */}
              <div className="w-8 h-px bg-gradient-to-r from-ruby/45 to-transparent mb-[1.3125rem]" aria-hidden="true" />

              <figcaption className="flex items-center gap-4 mt-auto">
                {/* Avatar initial */}
                <div
                  className="w-10 h-10 border border-ruby/25 bg-background flex items-center justify-center text-ruby font-serif text-base shrink-0"
                  aria-hidden="true"
                >
                  {t.author.charAt(0)}
                </div>
                <div>
                  <p className="font-sans font-medium text-foreground text-[0.875rem]">{t.author}</p>
                  <p className="text-[0.7rem] text-muted-foreground font-sans uppercase tracking-[0.16em] mt-0.5">
                    {t.title} — {t.company}
                  </p>
                </div>
                <div className="flex-1 h-px bg-border/25 hidden md:block" aria-hidden="true" />
              </figcaption>
            </motion.figure>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
