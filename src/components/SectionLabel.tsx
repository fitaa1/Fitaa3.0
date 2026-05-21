import { motion } from "framer-motion";
import { sectionViewport, fadeInUp } from "@/lib/animations";

interface SectionLabelProps {
  eyebrow: string;
  heading: string;
  eyebrowColor?: "ruby" | "gold";
  align?: "left" | "center";
  headingClass?: string;
  className?: string;
}

export function SectionLabel({
  eyebrow,
  heading,
  eyebrowColor = "ruby",
  align = "left",
  headingClass = "",
  className = "",
}: SectionLabelProps) {
  const alignClass  = align === "center" ? "text-center items-center" : "items-start";
  const colorClass  = eyebrowColor === "gold" ? "text-gold" : "text-ruby";

  return (
    <motion.div
      className={`flex flex-col ${alignClass} ${className}`}
      initial="hidden"
      whileInView="visible"
      viewport={sectionViewport}
      variants={fadeInUp}
    >
      {/* Eyebrow — golden ratio gap below: ~21px = var(--sp-3) */}
      <span className={`text-[0.68rem] font-sans font-medium uppercase tracking-[0.28em] mb-[1.3125rem] ${colorClass}`}>
        {eyebrow}
      </span>

      {/* Heading — type scale: 4.2rem ≈ 6.8rem / φ */}
      <h2
        className={`text-[clamp(2.2rem,4.5vw,4.2rem)] font-serif font-semibold text-foreground leading-[1.1] tracking-[-0.008em] ${headingClass}`}
      >
        {heading}
      </h2>
    </motion.div>
  );
}
