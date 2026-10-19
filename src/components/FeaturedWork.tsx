import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/config/site";
import { SectionLabel } from "./SectionLabel";
import { staggerContainer, fadeInUp, cardViewport, sectionViewport } from "@/lib/animations";

export function FeaturedWork() {
  const { workSection } = siteConfig;
  return (
    <section id="work" className="py-[var(--sp-7)] bg-background" aria-labelledby="work-heading">
      <div className="container mx-auto px-6 md:px-12">

        {/* Header row */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={sectionViewport}
          variants={fadeInUp}
          className="flex flex-col md:flex-row md:items-end justify-between mb-[var(--sp-6)] gap-5"
        >
          <SectionLabel id="work-heading" eyebrow={workSection.eyebrow} heading={workSection.heading} />
          <a
            href="#contact"
            className="text-[0.7rem] font-sans uppercase tracking-[0.18em] text-muted-foreground hover:text-ruby transition-colors duration-300 flex items-center gap-2 group shrink-0 pb-0.5 nav-link"
            aria-label="Start a project with Fitaa Creative"
          >
            {workSection.headerLink}
            <ArrowUpRight
              size={13}
              className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-250"
              aria-hidden="true"
            />
          </a>
        </motion.div>

        {/* Grid: 1 column on phones, 2 from tablets up */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={cardViewport}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
        >
          {siteConfig.caseStudies.map((study) => {
            /* A tile is a link only when the case study has one (e.g. Instagram). */
            const Wrapper = study.link ? "a" : "div";
            const linkProps = study.link
              ? {
                  href: study.link,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  "aria-label": `${study.client}, ${study.industry} case study (opens in a new tab)`,
                }
              : {};
            return (
            <motion.article
              key={study.client}
              variants={fadeInUp}
              className="group h-full"
            >
              <Wrapper {...linkProps} className="flex flex-col h-full">
                {/* Image: every tile uses the same 4:3 frame */}
                <div className="relative overflow-hidden bg-card mb-5 aspect-[4/3]">
                  <img
                    src={study.imagePath}
                    alt={study.imageAlt}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    loading="lazy"
                    decoding="async"
                    width={720}
                    height={540}
                  />

                  {/* Soft bottom shadow: same dark tint in light and dark mode */}
                  <div className="tile-shadow absolute inset-0 transition-opacity duration-500 group-hover:opacity-50" aria-hidden="true" />

                  {/* Result badge: always shown on touch screens, slides up on hover elsewhere */}
                  <div
                    className="absolute bottom-0 left-0 right-0 p-5 transition-all duration-500 ease-out [@media(hover:hover)]:translate-y-2 [@media(hover:hover)]:opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
                    aria-hidden="true"
                  >
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-background/80 text-ruby text-[0.68rem] font-sans uppercase tracking-[0.15em] backdrop-blur-sm border border-ruby/25">
                      {study.result}
                    </span>
                  </div>

                  {/* Arrow, top right: only on tiles that link somewhere */}
                  {study.link && (
                    <div
                      className="absolute top-4 right-4 w-8 h-8 bg-background/65 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      aria-hidden="true"
                    >
                      <ArrowUpRight size={13} className="text-foreground" />
                    </div>
                  )}
                </div>

                {/* Caption */}
                <div className="space-y-1.5 flex-1">
                  <p className="text-[0.65rem] font-sans uppercase tracking-[0.22em] text-gold">
                    {study.industry}
                    <span className="text-muted-foreground/70"> · {study.year}</span>
                  </p>
                  <h3 className="text-[1.5rem] font-serif font-normal text-foreground group-hover:text-ruby transition-colors duration-300 leading-snug">
                    {study.client}
                  </h3>
                  <p className="text-[0.875rem] text-muted-foreground font-sans font-light leading-[1.7]">
                    {study.description}
                  </p>
                  <ul className="flex flex-wrap gap-2 pt-2" aria-label="What we delivered">
                    {study.deliverables.map((d) => (
                      <li
                        key={d}
                        className="px-2.5 py-1 border border-border/60 text-[0.62rem] font-sans uppercase tracking-[0.14em] text-muted-foreground"
                      >
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              </Wrapper>
            </motion.article>
            );
          })}
        </motion.div>

        {/* "Also worked with" row */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={sectionViewport}
          variants={fadeInUp}
          className="mt-[var(--sp-6)] pt-8 border-t border-border/30 flex flex-col md:flex-row md:items-center gap-5 md:gap-10"
        >
          <p className="text-[0.65rem] font-sans uppercase tracking-[0.22em] text-muted-foreground shrink-0">
            {workSection.alsoWorkedWithLabel}
          </p>
          <ul className="flex flex-wrap gap-x-8 gap-y-3">
            {siteConfig.alsoWorkedWith.map((name) => (
              <li key={name} className="font-serif text-[1.15rem] text-foreground/75">
                {name}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
