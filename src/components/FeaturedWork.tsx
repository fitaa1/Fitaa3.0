import { ArrowUpRight } from "lucide-react";
import { useRef } from "react";
import { siteConfig } from "@/config/site";
import { SectionLabel } from "./SectionLabel";
import { useRise } from "@/hooks/useRise";

export function FeaturedWork() {
  const { workSection } = siteConfig;
  /* Entrance: the Fitaa rise. Each tile is one rise, staggered 60 ms between
   * siblings (at most six in a group). The "also worked with" row is a second. */
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  useRise(headerRef);
  useRise(gridRef);
  useRise(rowRef);
  return (
    <section
      id="work"
      data-cta-label={siteConfig.workSection.dataCtaLabel}
      data-cta-message={siteConfig.workSection.dataCtaMessage}
      className="py-[var(--sp-7)] plane-band"
      aria-labelledby="work-heading"
    >
      <div className="container mx-auto px-6 md:px-12">

        {/* Header row */}
        <div ref={headerRef} className="rise flex flex-col md:flex-row md:items-end justify-between mb-[var(--sp-6)] gap-5">
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
        </div>

        {/* Grid: 1 column on phones, 2 from tablets up. Each tile is one rise, staggered
         * 60 ms between siblings (at most six in a group). */}
        <div ref={gridRef} className="rise grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {siteConfig.caseStudies.map((study, i) => {
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
            <div key={study.client} className="group h-full">
              <Wrapper {...linkProps} className="flex flex-col h-full">
                {/* Image: every tile uses the same 4:3 frame */}
                <div className="relative overflow-hidden bg-card mb-5 aspect-[4/3]">
                  <img
                    src={study.imagePath.replace(/\.webp$/, "-720.webp")}
                    srcSet={`${study.imagePath.replace(/\.webp$/, "-720.webp")} 720w, ${study.imagePath.replace(/\.webp$/, "-1080.webp")} 1080w, ${study.imagePath} 1440w`}
                    sizes="(min-width: 768px) 46vw, calc(100vw - 48px)"
                    alt={study.imageAlt}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    loading="lazy"
                    decoding="async"
                    width={720}
                    height={540}
                  />

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
                  <h3 className="text-[1.5rem] font-display font-normal text-foreground group-hover:text-ruby transition-colors duration-300 leading-snug">
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
            </div>
            );
          })}
        </div>

        {/* "Also worked with" row */}
        <div ref={rowRef} className="rise mt-[var(--sp-6)] pt-8 flex flex-col md:flex-row md:items-center gap-5 md:gap-10">
          <p className="text-[0.65rem] font-sans uppercase tracking-[0.22em] text-muted-foreground shrink-0">
            {workSection.alsoWorkedWithLabel}
          </p>
          <ul className="flex flex-wrap gap-x-8 gap-y-3">
            {siteConfig.alsoWorkedWith.map((name) => (
              <li key={name} className="font-display text-[1.15rem] text-foreground/75">
                {name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}