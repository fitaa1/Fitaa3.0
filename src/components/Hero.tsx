import { ArrowRight } from "lucide-react";
import React from "react";
import { siteConfig } from "@/config/site";
import { AuroraBackground } from "./AuroraBackground";
import { SectionLabel } from "./SectionLabel";
import { useRef } from "react";
import { useRise } from "@/hooks/useRise";

export function Hero() {
  const { hero } = siteConfig;
  /* The headline and the line under it are in the first paint, never held back by script
   * (they are the largest thing on the first screen). The label, the two buttons and the
   * scroll cue enter with the Fitaa rise, 60 ms apart. */
  const primaryRef = useRef<HTMLAnchorElement>(null);
  const secondaryRef = useRef<HTMLAnchorElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  useRise(primaryRef);
  useRise(secondaryRef);
  useRise(scrollRef);
  return (
    <section
      id="home"
      data-cta-label={hero.dataCtaLabel}
      data-cta-message={hero.dataCtaMessage}
      className="relative min-h-[100svh] flex items-start md:items-center justify-center overflow-hidden pt-28 sm:pt-32 md:pt-24 pb-24 md:pb-28"
    >
      <AuroraBackground />

      {/* Content — centred, max-w follows golden ratio (text at 62% of container) */}
      <div className="container mx-auto px-6 md:px-12 relative z-10 flex flex-col items-center text-center">

        {/* Eyebrow label — SectionLabel with signature line */}
        <SectionLabel eyebrow={<><span className="hidden sm:inline">{hero.eyebrowWidePrefix}</span>{hero.eyebrow}</>} align="center" className="mb-[1.3125rem]" />

        {/* Main headline: in the first paint */}
        <h1
          className="text-[clamp(2.25rem,6vw,4.5rem)] font-display font-semibold tracking-[-0.02em] leading-[1.05] mb-[2.125rem] text-balance"
        >
          <span className="block text-foreground">{hero.headline[0]}</span>
          <span className="block mt-[0.18em] text-foreground">{hero.headline[1]}</span>
        </h1>

        {/* Sub-headline: in the first paint */}
        <p
          className="text-[1.0625rem] md:text-[1.125rem] text-muted-foreground font-sans font-light max-w-2xl mb-[3.4375rem] leading-[1.75]"
        >
          {siteConfig.description}
        </p>

        {/* Buttons: gold primary, plain text secondary */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto items-center">
          <a
            ref={primaryRef}
            href="#contact"
            className="rise btn-gold group inline-flex items-center justify-center px-10 py-4 font-sans text-[0.72rem] tracking-[0.22em] uppercase w-full sm:w-auto"
            aria-label="Start your project with Fitaa Creative"
            style={{ '--d': '60ms' } as React.CSSProperties}
          >
            <span className="flex items-center gap-2.5">
              {hero.primaryButton}
              <ArrowRight
                size={14}
                className="group-hover:translate-x-1.5 transition-transform duration-350"
                aria-hidden="true"
              />
            </span>
          </a>

          <a
            ref={secondaryRef}
            href="#work"
            className="rise inline-flex items-center gap-2 font-sans text-[0.72rem] uppercase tracking-[0.22em] text-foreground hover:text-ruby transition-colors duration-250 group px-4 py-4 min-h-[44px]"
            aria-label="View our work"
            style={{ '--d': '120ms' } as React.CSSProperties}
          >
            {hero.secondaryButton}
            <ArrowRight
              size={14}
              className="group-hover:translate-x-1.5 transition-transform duration-350"
              aria-hidden="true"
            />
          </a>
        </div>

      </div>

      {/* Scroll cue — rise entrance on scroll */}
      <div
        ref={scrollRef}
        className="rise absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2"
        style={{ '--d': '180ms' } as React.CSSProperties}
        aria-hidden="true"
      >
        <span className="text-[0.55rem] font-sans uppercase tracking-[0.35em] text-muted-foreground/45">
          Scroll
        </span>
        <div
          className="scroll-line w-px h-11 bg-gradient-to-b from-muted-foreground/25 to-transparent"
          aria-hidden="true"
        />
      </div>
    </section>
  );
}