import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { siteConfig } from "@/config/site";
import { ParticleBackground } from "./ParticleBackground";
import { heroStagger, heroItem, EASE_CURVE } from "@/lib/animations";

export function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden pt-24"
    >
      <ParticleBackground />

      {/* Ambient light pools — golden ratio placement */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {/* Primary — large, top-left at 1/φ from top */}
        <div
          className="absolute w-[55vw] h-[55vw] max-w-[580px] max-h-[580px] rounded-full blur-[160px]"
          style={{
            top: "18%", left: "8%",
            background: "radial-gradient(circle, rgba(155,18,44,0.22) 0%, transparent 70%)",
            opacity: 0.45,
          }}
        />
        {/* Secondary — smaller, bottom-right */}
        <div
          className="absolute w-[34vw] h-[34vw] max-w-[420px] max-h-[420px] rounded-full blur-[130px]"
          style={{
            bottom: "14%", right: "6%",
            background: "radial-gradient(circle, rgba(212,175,55,0.18) 0%, transparent 70%)",
            opacity: 0.35,
          }}
        />
      </div>

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
            <span className="inline-flex items-center gap-2.5 px-5 py-2 border border-border/35 bg-card/40 backdrop-blur-md text-[0.65rem] font-sans uppercase tracking-[0.28em] text-muted-foreground">
              <span className="w-1.5 h-1.5 bg-ruby inline-block animate-pulse" style={{ animationDuration: "2.4s" }} aria-hidden="true" />
              Premium Creative Agency · Accra, Ghana
            </span>
          </motion.div>

          {/* Main headline — scale: 6.5rem / φ / φ */}
          <motion.h1
            variants={heroItem}
            className="text-[clamp(2.8rem,8vw,6.5rem)] font-serif font-bold leading-[1.04] tracking-[-0.015em] mb-[2.125rem] text-balance"
          >
            <span className="block text-foreground">Turn Eyeballs</span>
            <span className="block text-ruby mt-[0.18em]">Into Revenue.</span>
          </motion.h1>

          {/* Sub-headline — sits at golden width: max-w-2xl ≈ 62% of max-w-5xl */}
          <motion.p
            variants={heroItem}
            className="text-[1.0625rem] md:text-[1.125rem] text-muted-foreground font-sans font-light max-w-2xl mb-[3.4375rem] leading-[1.75]"
          >
            {siteConfig.description}
          </motion.p>

          {/* CTAs — no rounded corners */}
          <motion.div
            variants={heroItem}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto items-center"
          >
            <a
              href="#contact"
              className="btn-gold group inline-flex items-center justify-center px-10 py-4 font-sans text-[0.72rem] tracking-[0.22em] uppercase w-full sm:w-auto"
              aria-label="Start your project with Fitaa Digital"
            >
              <span className="flex items-center gap-2.5">
                Start Your Project
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
              aria-label="View Fitaa Digital's case studies"
            >
              View Our Work
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1.2, ease: EASE_CURVE }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
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
