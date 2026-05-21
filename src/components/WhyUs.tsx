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
      transition={{ delay: index * 0.12 }}
      className="group flex flex-col items-center md:items-start border-l border-border/30 pl-7 py-3 hover:border-ruby/40 transition-colors duration-500"
    >
      <div className="text-[3.2rem] md:text-[3.8rem] font-serif font-bold text-ruby leading-none mb-2 tracking-tight">
        {stat.prefix && <span>{stat.prefix}</span>}
        <span>{count}</span>
        {stat.suffix && <span>{stat.suffix}</span>}
      </div>
      <div className="text-xs font-sans uppercase tracking-[0.18em] text-muted-foreground group-hover:text-foreground/60 transition-colors duration-300">
        {stat.label}
      </div>
    </motion.div>
  );
}

export function WhyUs() {
  return (
    <section id="why-us" className="py-36 bg-card relative overflow-hidden" aria-labelledby="whyus-heading">
      <div
        className="absolute top-1/2 right-0 w-[50vw] h-[50vw] max-w-[500px] max-h-[500px] -translate-y-1/2 opacity-8 pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(155,18,44,0.18), transparent 70%)" }}
        aria-hidden="true"
      />
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 items-center">
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
              className="mb-8"
            />
            <p className="text-muted-foreground font-sans font-light text-lg leading-[1.7]">
              We don't just create pretty visuals. Every billboard, every post, every landing page is engineered to move people and drive real business results — in Accra and across Ghana.
            </p>
            <motion.div
              className="mt-10 w-8 h-px bg-gold/50"
              initial={{ scaleX: 0, originX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={cardViewport}
              transition={{ delay: 0.6, duration: 0.8, ease: EASE_CURVE }}
              aria-hidden="true"
            />
          </motion.div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-10 lg:pl-12">
            {siteConfig.stats.map((stat, index) => (
              <StatItem key={stat.label} stat={stat} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
