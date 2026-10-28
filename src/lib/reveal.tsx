/*
 * Lean motion: CSS transform and opacity only, no animation library.
 *
 * <Reveal> fades an element in once, when it scrolls into view. One shared
 * IntersectionObserver watches every Reveal on the page. The look lives in
 * index.css ([data-reveal] rules), so the browser animates it off the main thread.
 * Reduced motion: the CSS shows everything at once, with no movement.
 *
 * Maps from the old framer-motion presets in animations.ts:
 *   fadeIn → "fade"   fadeInUp → "up"   fadeInDown → "down"
 *   fadeInLeft → "left"   fadeInRight → "right"
 *   scaleIn and scaleInSpring → "scale"   heroText → "glide" (visible from first paint)
 *   heroItem → "up" with a longer duration (dur={1})
 *   stagger containers → give each child its own delay: delay={0.1 + i * 0.12}
 */
import { createElement, useEffect, useRef, useState, type ElementType, type ReactNode, type CSSProperties, type RefObject } from "react";

export type RevealVariant = "fade" | "up" | "down" | "left" | "right" | "scale" | "glide";

let observer: IntersectionObserver | null = null;
const show = (el: Element) => el.classList.add("is-in");

function watch(el: Element, margin: string) {
  if (typeof IntersectionObserver === "undefined") { show(el); return () => {}; }
  // One observer per margin keeps it cheap; the default margin covers almost every use.
  const io = margin === "0px 0px -80px 0px"
    ? (observer ??= new IntersectionObserver(onSeen, { rootMargin: margin }))
    : new IntersectionObserver(onSeen, { rootMargin: margin });
  io.observe(el);
  return () => io.unobserve(el);
}
function onSeen(entries: IntersectionObserverEntry[], io: IntersectionObserver) {
  for (const e of entries) if (e.isIntersecting) { show(e.target); io.unobserve(e.target); }
}

interface RevealProps {
  as?: ElementType;
  variant?: RevealVariant;
  /** seconds before it starts, for staggered lists */
  delay?: number;
  /** seconds the movement takes (default 0.75) */
  dur?: number;
  /** how far inside the screen it must be before it shows */
  margin?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  [attr: string]: unknown;
}

export function Reveal({ as = "div", variant = "up", delay = 0, dur, margin = "0px 0px -80px 0px", className, style, children, ...rest }: RevealProps) {
  const ref = useRef<Element>(null);
  useEffect(() => (ref.current ? watch(ref.current, margin) : undefined), [margin]);
  const vars = { ...style, ...(delay ? { "--d": `${delay}s` } : {}), ...(dur ? { "--dur": `${dur}s` } : {}) } as CSSProperties;
  return createElement(as, { ref, "data-reveal": variant, className, style: vars, ...rest }, children);
}

/** true once the element has been on screen (replaces framer-motion's useInView with once: true). */
export function useInViewOnce(ref: RefObject<Element | null>, margin = "0px 0px -50px 0px") {
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    if (typeof IntersectionObserver === "undefined") { setSeen(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { rootMargin: margin });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, margin, seen]);
  return seen;
}

/**
 * Enter and exit for things that appear and disappear (menus, buttons, form states),
 * replacing AnimatePresence. Render while `mounted`; put data-open={visible} on the
 * element and style [data-open="true"] / [data-open="false"] in CSS. It stays mounted
 * for `ms` after closing so the exit can play.
 */
export function usePresence(open: boolean, ms = 300) {
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(open);
  useEffect(() => {
    if (open) {
      setMounted(true);
      const raf = requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
      return () => cancelAnimationFrame(raf);
    }
    setVisible(false);
    const t = setTimeout(() => setMounted(false), ms);
    return () => clearTimeout(t);
  }, [open, ms]);
  return { mounted, visible };
}
