import { useRef, type ReactNode } from "react";
import { useRise } from "@/hooks/useRise";

interface SectionLabelProps {
  /** id for the <h2>, so the section can point to it with aria-labelledby */
  id?: string;
  eyebrow: ReactNode;
  heading?: string;  // Optional — when omitted, only the eyebrow + signature line appear
  eyebrowColor?: "ruby" | "gold";
  align?: "left" | "center";
  headingClass?: string;
  className?: string;
}

export function SectionLabel({
  id,
  eyebrow,
  heading,
  eyebrowColor = "ruby",
  align = "left",
  headingClass = "",
  className = "",
}: SectionLabelProps) {
  const ref = useRef<HTMLDivElement>(null);
  const keyRef = useRef<HTMLSpanElement>(null);
  useRise(ref);
  useRise(keyRef);

  const alignClass  = align === "center" ? "text-center items-center" : "items-start";
  const colorClass  = eyebrowColor === "gold" ? "text-gold" : "text-ruby";

  return (
    <div ref={ref} className={`rise flex flex-col ${alignClass} ${className}`}>
      {/* Signature line: 2 px champagne key, 24 px long, with 1 px hairline in the border colour running on from it to the end of the container, above the label. */}
      <div
        className={`section-signature mb-[1.3125rem] flex items-center gap-0 ${align === "center" ? "justify-center" : "w-full"}`}
        aria-hidden="true"
      >
        <span
          ref={keyRef}
          className="rise-key section-signature-key block w-6 h-0.5 bg-[var(--champagne)]"
        />
        {/* Centred, the key stands alone: a hairline running one way from a centred label would pull it off centre. */}
        {align !== "center" && <span className="section-signature-hairline flex-1 h-px bg-border" />}
      </div>

      {/* Eyebrow — golden ratio gap below: ~21px = var(--sp-3) */}
      <span className={`text-[0.68rem] font-sans font-medium uppercase tracking-[0.28em] ${colorClass}`}>
        {eyebrow}
      </span>

      {/* Heading — type scale: 4.2rem ≈ 6.8rem / φ */}
      {heading && (
        <h2
          id={id}
          className={`text-[clamp(2.2rem,4.5vw,4.2rem)] font-display font-semibold text-foreground leading-[1.1] tracking-[-0.008em] ${headingClass}`}
        >
          {heading}
        </h2>
      )}
    </div>
  );
}
