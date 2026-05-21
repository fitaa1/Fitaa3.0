import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { siteConfig } from "@/config/site";
import { SectionLabel } from "./SectionLabel";
import { useCountUp } from "@/hooks/useCountUp";
import { fadeInLeft, fadeInUp, cardViewport, sectionViewport, EASE_CURVE } from "@/lib/animations";

type Stat = (typeof siteConfig.stats)[0];

function StatItem({ stat, index }: { stat: Stat; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const count = useCountUp(stat.value, 2000, isInView);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={fadeInUp}
      transition={{ delay: index * 0.13 }}
      className="group flex flex-col items-center md:items-start border-l border-border/30 pl-7 py-3 hover:border-ruby/45 transition-colors duration-500"
    >
      {/* Number — golden type scale: 4rem (closest φ step from 1rem) */}
      <div className="text-[clamp(2.8rem,5vw,4rem)] font-serif font-bold text-ruby leading-none mb-2 tracking-tight tabular-nums">
        {stat.prefix && <span>{stat.prefix}</span>}
        <span>{count}</span>
        {stat.suffix && <span>{stat.suffix}</span>}
      </div>
      <div className="text-[0.68rem] font-sans uppercase tracking-[0.2em] text-muted-foreground group-hover:text-foreground/55 transition-colors duration-350">
        {stat.label}
      </div>
    </motion.div>
  );
}

export function WhyUs() {
  return (
    <section
      id="why-us"
      className="py-[var(--sp-7)] bg-card relative overflow-hidden"
      aria-labelledby="whyus-heading"
    >
      {/* Ambient glow — right edge */}
      <div
        className="absolute top-1/2 right-0 w-[45vw] h-[45vw] max-w-[480px] max-h-[480px] -translate-y-1/2 pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(155,18,44,0.12) 0%, transparent 70%)",
          opacity: 0.6,
        }}
        aria-hidden="true"
      />

      <div className="container mx-auto px-6 md:px-12">
        {/*
          Golden ratio column split: 5 / 7 out of 12
          ≈ 41.6% / 58.3% → very close to 38.2% / 61.8% (1/φ : 1/φ²)
        */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 items-center">

          {/* Left copy — 5/12 */}
          <motion.div
            variants={fadeInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={sectionViewport}
            className="lg:col-span-5 flex flex-col"
          >
            <SectionLabel
              eyebrow={`Why ${siteConfig.name}`}
              heading="Pure craft. Measurable results."
              eyebrowColor="gold"
              className="mb-[2.125rem]"
            />
            <p className="text-muted-foreground font-sans font-light text-[1.0625rem] leading-[1.75] max-w-md">
              We don't just create pretty visuals. Every billboard, every post, every landing page is engineered to move people — and drive real business results in Accra and across Ghana.
            </p>

            {/* Animated gold line */}
            <motion.div
              className="mt-10 h-px bg-gradient-to-r from-gold/55 via-gold/25 to-transparent w-16"
              initial={{ scaleX: 0, originX: "left" }}
              whileInView={{ scaleX: 1 }}
              viewport={cardViewport}
              transition={{ delay: 0.55, duration: 0.9, ease: EASE_CURVE }}
              aria-hidden="true"
            />
          </motion.div>

          {/* Right stats — 7/12 */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10 lg:pl-14">
            {siteConfig.stats.map((stat, index) => (
              <StatItem key={stat.label} stat={stat} index={index} />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
