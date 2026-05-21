import { motion } from "framer-motion";
import { sectionViewport, fadeInUp } from "@/lib/animations";
interface SectionLabelProps { eyebrow: string; heading: string; eyebrowColor?: "ruby" | "gold"; align?: "left" | "center"; headingClass?: string; className?: string; }
export function SectionLabel({ eyebrow, heading, eyebrowColor = "ruby", align = "left", headingClass = "", className = "" }: SectionLabelProps) {
  const alignClass = align === "center" ? "text-center items-center" : "items-start";
  const colorClass = eyebrowColor === "gold" ? "text-gold" : "text-ruby";
  return (
    <motion.div className={`flex flex-col ${alignClass} ${className}`} initial="hidden" whileInView="visible" viewport={sectionViewport} variants={fadeInUp}>
      <span className={`text-xs font-sans font-medium uppercase tracking-[0.25em] mb-4 ${colorClass}`}>{eyebrow}</span>
      <h2 className={`text-4xl md:text-5xl font-serif font-semibold text-foreground leading-[1.1] tracking-[-0.005em] ${headingClass}`}>{heading}</h2>
    </motion.div>
  );
}