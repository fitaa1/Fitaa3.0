import type { Variants } from "framer-motion";

/* Signature easing: custom cubic bezier for premium deceleration */
export const EASE_CURVE    = [0.22, 1, 0.36, 1]    as const;
export const EASE_IN_OUT   = [0.42, 0, 0.14, 1]    as const;
export const EASE_SPRING   = [0.34, 1.56, 0.64, 1] as const; /* slight overshoot */

export const sectionViewport = { once: true, margin: "-80px"  } as const;
export const cardViewport    = { once: true, margin: "-40px"  } as const;
export const lazyViewport    = { once: true, margin: "-20px"  } as const;

/* ── Fade variants ─────────────────────────────────────────────────────── */
export const fadeIn: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.7, ease: EASE_CURVE } },
};
export const fadeInUp: Variants = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0,  transition: { duration: 0.75, ease: EASE_CURVE } },
};
export const fadeInDown: Variants = {
  hidden:  { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0,   transition: { duration: 0.7, ease: EASE_CURVE } },
};
export const fadeInLeft: Variants = {
  hidden:  { opacity: 0, x: -36 },
  visible: { opacity: 1, x: 0,   transition: { duration: 0.85, ease: EASE_CURVE } },
};
export const fadeInRight: Variants = {
  hidden:  { opacity: 0, x: 36  },
  visible: { opacity: 1, x: 0,  transition: { duration: 0.85, ease: EASE_CURVE } },
};

/* ── Scale variants ────────────────────────────────────────────────────── */
export const scaleIn: Variants = {
  hidden:  { opacity: 0, scale: 0.94 },
  visible: { opacity: 1, scale: 1,   transition: { duration: 0.6, ease: EASE_CURVE } },
};
export const scaleInSpring: Variants = {
  hidden:  { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1,   transition: { duration: 0.7, ease: EASE_SPRING } },
};

/* ── Stagger containers ────────────────────────────────────────────────── */
export const staggerContainer: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1  } },
};
export const staggerContainerFast: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};
export const staggerContainerSlow: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.18, delayChildren: 0.15 } },
};

/* ── Hero specific ─────────────────────────────────────────────────────── */
export const heroStagger: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.22, delayChildren: 0.12 } },
};
export const heroItem: Variants = {
  hidden:  { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0,  transition: { duration: 1.0, ease: EASE_CURVE } },
};

/* ── Slide reveal ──────────────────────────────────────────────────────── */
export const slideReveal: Variants = {
  hidden:  { clipPath: "inset(0 100% 0 0)" },
  visible: { clipPath: "inset(0 0% 0 0)",  transition: { duration: 0.9, ease: EASE_CURVE } },
};
