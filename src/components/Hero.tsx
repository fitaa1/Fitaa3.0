import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { siteConfig } from "@/config/site";
import { ParticleBackground } from "./ParticleBackground";
import { heroStagger, heroItem, EASE_CURVE } from "@/lib/animations";

export function Hero() {
  return (
    <section id="home" className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden pt-24">
      <ParticleBackground />

      {/* Ambient glows */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-[18%] left-[12%] w-[55vw] h-[55vw] max-w-[600px] max-h-[600px] rounded-full blur-[140px] opacity-30 dark:opacity-35"
          style={{ background: "radial-gradient(circle, rgba(155,18,44,0.28), transparent 70%)" }} />
        <div className="absolute bottom-[12%] right-[8%] w-[40vw] h-[40vw] max-w-[460px] max-h-[460px] rounded-full blur-[120px] opacity-15 dark:opacity-20"
          style={{ background: "radial-gradient(circle, rgba(212,175,55,0.22), transparent 70%)" }} />
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10 flex flex-col items-center text-center">
        <motion.div variants={heroStagger} initial="hidden" animate="visible" className="flex flex-col items-center max-w-5xl">

          {/* Badge */}
          <motion.div variants={heroItem} className="mb-10">
            <span className="inline-flex items-center gap-2 px-4 py-2 border border-border/40 bg-card/50 backdrop-blur-sm text-[10px] font-sans uppercase tracking-[0.25em] text-muted-foreground rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-ruby inline-block animate-pulse" aria-hidden="true" />
              Premium Creative Agency · Accra, Ghana
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1 variants={heroItem} className="text-[clamp(2.8rem,8.5vw,6.5rem)] font-serif font-bold leading-[1.05] tracking-[-0.01em] mb-8 text-balance">
            <span className="block text-foreground">Turn Eyeballs</span>
            <span className="block font-semibold text-ruby mt-2">Into Revenue.</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p variants={heroItem} className="text-lg md:text-xl text-muted-foreground font-sans font-light max-w-2xl mb-14 leading-[1.7]">
            {siteConfig.description}
          </motion.p>

          {/* CTAs */}
          <motion.div variants={heroItem} className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto items-center">
            <a
              href="#contact"
              className="group relative inline-flex items-center justify-center px-9 py-4 bg-ruby text-white font-sans font-medium text-sm tracking-widest uppercase overflow-hidden w-full sm:w-auto"
              aria-label="Start your project with Fitaa Digital"
            >
              <span className="relative z-10 flex items-center gap-2">
                Start Your Project <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" aria-hidden="true" />
              </span>
              <span className="absolute inset-0 w-0 bg-white/10 transition-all duration-500 ease-out group-hover:w-full z-0" />
            </a>
            <a
              href="#work"
              className="inline-flex items-center justify-center px-9 py-4 border border-gold/50 text-gold hover:bg-gold/8 hover:border-gold/80 transition-all duration-300 font-sans font-light text-sm tracking-widest uppercase w-full sm:w-auto"
              aria-label="View our case studies"
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
        transition={{ delay: 1.4, duration: 1, ease: EASE_CURVE }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        aria-hidden="true"
      >
        <span className="text-[9px] font-sans uppercase tracking-[0.3em] text-muted-foreground/50">Scroll</span>
        <motion.div
          className="w-px h-12 bg-gradient-to-b from-muted-foreground/30 to-transparent"
          animate={{ scaleY: [0, 1], originY: 0 }}
          transition={{ delay: 1.6, duration: 1.2, ease: "easeOut" }}
        />
      </motion.div>
    </section>
  );
}
