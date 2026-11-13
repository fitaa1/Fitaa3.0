/*
 * Adaptive CTA hook.
 * Observes all elements with [data-cta-label] and determines which section/card
 * is crossing the middle of the screen. Returns the active label and message,
 * and whether the header CTA should be hidden (e.g. Contact section).
 *
 * The IntersectionObserver uses the same thin middle band as the existing nav
 * active-section tracker: rootMargin "-45% 0px -54% 0px".
 */
import { useEffect, useState } from "react";

export type SectionCta = {
  label: string;
  message: string;
  hidden: boolean;
};

export function useAdaptiveCta(): SectionCta {
  const [cta, setCta] = useState<SectionCta>({ label: "", message: "", hidden: false });

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;

    const els = [
      ...document.querySelectorAll<Element>('[data-cta-label]'),
    ];

    if (!els.length) return;

    const mid = typeof window !== "undefined" ? window.innerHeight / 2 : 0;

    const io = new IntersectionObserver(
      (entries) => {
        let best: { dist: number; el: Element } | null = null;
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const target = e.target as HTMLElement;
          const r = target.getBoundingClientRect();
          const center = r.top + r.height / 2;
          const dist = Math.abs(center - mid);
          if (!best || dist < best.dist) best = { dist, el: target };
        }
        if (best) {
          const el = best.el;
          const label = el.getAttribute("data-cta-label") || "";
          const message = el.getAttribute("data-cta-message") || "";
          // If the element has data-cta-hidden, the header CTA is hidden.
          const hidden = el.hasAttribute("data-cta-hidden");
          setCta({ label, message, hidden });
        }
      },
      { rootMargin: "-45% 0px -54% 0px", threshold: 0 },
    );

    els.forEach((el) => io.observe(el));

    return () => io.disconnect();
  }, []);

  return cta;
}