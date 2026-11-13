/*
 * The button that follows the visitor (SITE_STANDARD.md, Controls that adapt).
 * Every section, and every package card, carries data-cta-label and data-cta-message. This
 * hook says which one sits on the middle line of the screen, so the header button and the
 * floating WhatsApp button can ask about exactly that.
 *
 * On a phone the package cards are stacked, so one card at a time crosses the middle and the
 * button names that package. On a wide screen the three cards sit side by side and cross the
 * middle together: then the button names the open card, or the whole section if none is open.
 */
import { useEffect, useState } from "react";

export type SectionCta = { label: string; message: string; hidden: boolean };

/* Empty until the first section is read. The two buttons fall back to the hero's own words. */
const START: SectionCta = { label: "", message: "", hidden: false };

/** Chooses among the elements now on the middle line. Exported for the tests. */
export function chooseCta(onLine: Element[]): Element | null {
  const cards = onLine.filter((el) => el.tagName !== "SECTION");
  const open = cards.filter((el) => el.getAttribute("data-open") === "true");
  if (open.length === 1) return open[0];
  if (cards.length === 1) return cards[0];
  return onLine.find((el) => el.tagName === "SECTION") ?? null;
}

export function useAdaptiveCta(): SectionCta {
  const [cta, setCta] = useState<SectionCta>(START);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const els = [...document.querySelectorAll<Element>("[data-cta-label]")];
    if (!els.length) return;
    const onLine = new Set<Element>();
    const pick = () => {
      const el = chooseCta(els.filter((e) => onLine.has(e)));
      if (!el) return;
      const next = { label: el.getAttribute("data-cta-label") || START.label, message: el.getAttribute("data-cta-message") || START.message, hidden: el.hasAttribute("data-cta-hidden") };
      setCta((now) => (now.label === next.label && now.message === next.message && now.hidden === next.hidden ? now : next));
    };
    /* The same thin middle band the header uses to mark the section in view. */
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) { if (e.isIntersecting) onLine.add(e.target); else onLine.delete(e.target); }
      pick();
    }, { rootMargin: "-45% 0px -54% 0px", threshold: 0 });
    els.forEach((el) => io.observe(el));
    /* Opening or closing a package card changes the answer without any scrolling. */
    const mo = new MutationObserver(pick);
    els.forEach((el) => mo.observe(el, { attributes: true, attributeFilter: ["data-open"] }));
    return () => { io.disconnect(); mo.disconnect(); };
  }, []);

  return cta;
}
