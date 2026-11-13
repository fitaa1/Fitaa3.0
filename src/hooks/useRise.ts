import { useEffect, type RefObject } from "react";

/*
 * The Fitaa rise: one shared IntersectionObserver (SITE_STANDARD.md, Design language).
 * The .rise class carries the transition; this hook adds .is-in once the element
 * enters the viewport, and the browser runs the animation off the main thread.
 * Reduced motion: the CSS shows everything at once, with no movement.
 */
let observer: IntersectionObserver | null = null;
const show = (el: Element) => el.classList.add("is-in");

function watch(el: Element, margin: string) {
  if (typeof IntersectionObserver === "undefined") {
    show(el);
    return () => {};
  }
  const io = margin === "0px 0px -80px 0px"
    ? (observer ??= new IntersectionObserver(onSeen, { rootMargin: margin }))
    : new IntersectionObserver(onSeen, { rootMargin: margin });
  io.observe(el);
  return () => io.unobserve(el);
}

function onSeen(entries: IntersectionObserverEntry[], io: IntersectionObserver) {
  for (const e of entries) {
    if (e.isIntersecting) {
      show(e.target);
      io.unobserve(e.target);
    }
  }
}

/**
 * Hook for the Fitaa rise. Add `className="rise"` to the element and call
 * this hook with a ref on the same element.
 *
 * @param ref     Ref attached to the .rise element
 * @param margin  How far inside the screen it must be before it shows
 */
export function useRise(ref: RefObject<Element | null>, margin = "0px 0px -80px 0px") {
  useEffect(() => {
    if (ref.current) {
      return watch(ref.current, margin);
    }
  }, [ref, margin]);
}
