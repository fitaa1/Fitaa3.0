import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { siteConfig } from "@/config/site";
import { AuroraBackground } from "./AuroraBackground";
import { heroStagger, heroItem, heroText, EASE_CURVE } from "@/lib/animations";

export function Hero() {
  const { hero } = siteConfig;
  return (
    <section
      id="home"
      className="relative min-h-[100svh] flex items-start md:items-center justify-center overflow-hidden pt-28 sm:pt-32 md:pt-24 pb-24 md:pb-28"
    >
      <AuroraBackground />

      {/* Content — centred, max-w follows golden ratio (text at 62% of container) */}
      <div className="container mx-auto px-6 md:px-12 relative z-10 flex flex-col items-center text-center">
        <motion.div
          variants={heroStagger}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center max-w-5xl w-full"
        >
          {/* Eyebrow badge */}
          <motion.div variants={heroItem} className="mb-[2.125rem]">
            <span className="inline-flex items-center gap-2.5 px-4 sm:px-5 py-2 border border-border/50 bg-card/40 backdrop-blur-md text-[0.62rem] sm:text-[0.65rem] font-sans uppercase tracking-[0.2em] sm:tracking-[0.28em] text-muted-foreground whitespace-nowrap">
              <span className="w-1.5 h-1.5 bg-ruby inline-block animate-pulse shrink-0" style={{ animationDuration: "2.4s" }} aria-hidden="true" />
              <span><span className="hidden sm:inline">{hero.eyebrowWidePrefix}</span>{hero.eyebrow}</span>
            </span>
          </motion.div>

          {/* Main headline — scale: 6.5rem / φ / φ */}
          <motion.h1
            variants={heroText}
            className="text-[clamp(2.8rem,8vw,6.5rem)] font-serif font-bold leading-[1.04] tracking-[-0.015em] mb-[2.125rem] text-balance"
          >
            <span className="block text-foreground">{hero.headline[0]}</span>
            <span className="block text-ruby mt-[0.18em]">{hero.headline[1]}</span>
          </motion.h1>

          {/* Sub-headline — sits at golden width: max-w-2xl ≈ 62% of max-w-5xl */}
          <motion.p
            variants={heroText}
            className="text-[1.0625rem] md:text-[1.125rem] text-muted-foreground font-sans font-light max-w-2xl mb-[3.4375rem] leading-[1.75]"
          >
            {siteConfig.description}
          </motion.p>

          {/* Buttons: gold primary, outlined secondary */}
          <motion.div
            variants={heroItem}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto items-center"
          >
            <a
              href="#contact"
              className="btn-gold group inline-flex items-center justify-center px-10 py-4 font-sans text-[0.72rem] tracking-[0.22em] uppercase w-full sm:w-auto"
              aria-label="Start your project with Fitaa Creative"
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
              href="#work"
              className="btn-outline inline-flex items-center justify-center px-10 py-4 border border-gold/40 text-gold hover:bg-gold/8 hover:border-gold/70 font-sans font-light text-[0.72rem] tracking-[0.22em] uppercase w-full sm:w-auto"
            >
              {hero.secondaryButton}
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1.2, ease: EASE_CURVE }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex [@media(max-height:760px)]:hidden flex-col items-center gap-2"
        aria-hidden="true"
      >
        <span className="text-[0.55rem] font-sans uppercase tracking-[0.35em] text-muted-foreground/45">
          Scroll
        </span>
        <motion.div
          className="w-px h-11 bg-gradient-to-b from-muted-foreground/25 to-transparent"
          animate={{ scaleY: [0, 1], originY: 0 }}
          transition={{ delay: 1.8, duration: 1.4, ease: "easeOut" }}
        />
      </motion.div>
    </section>
  );
}
