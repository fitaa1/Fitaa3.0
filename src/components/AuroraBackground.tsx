import { useEffect, useRef } from "react";

/**
 * Aurora mesh backdrop for the hero.
 *
 * Pure CSS (styles live in index.css under "Aurora mesh hero backdrop"),
 * so it renders the same on phone, tablet and desktop, stays sharp on
 * Retina screens and costs no JavaScript per frame. Colours come from the
 * --aurora-* theme variables, and motion stops when the visitor has
 * "reduce motion" turned on.
 *
 * The drift starts once the page has finished loading and pauses while the
 * hero is off screen, so it never competes with the first paint or with
 * scrolling. The first frame looks exactly the same either way.
 */
export function AuroraBackground() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let loaded = false;
    let onScreen = true;
    const sync = () => el.classList.toggle("is-live", loaded && onScreen);
    let timer = 0;
    const start = () => { timer = window.setTimeout(() => { loaded = true; sync(); }, 800); };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    const io = typeof IntersectionObserver === "undefined"
      ? null
      : new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; sync(); });
    io?.observe(el);
    return () => { window.clearTimeout(timer); window.removeEventListener("load", start); io?.disconnect(); };
  }, []);

  return (
    <div ref={ref} className="aurora" aria-hidden="true">
      <div className="aurora__blob aurora__blob--1" />
      <div className="aurora__blob aurora__blob--2" />
      <div className="aurora__blob aurora__blob--3" />
      <div className="aurora__blob aurora__blob--4" />
      <div className="aurora__grid" />
      <div className="aurora__grain" />
      <div className="aurora__fade" />
    </div>
  );
}
