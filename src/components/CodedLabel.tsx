import { useEffect, useRef, useState } from "react";
import { scrambleFrame } from "@/lib/scramble";

/*
 * A label that rewrites itself like code (Nigel, 20 Nov 2026). When the text changes, the old words
 * break into 0s and 1s, the length walks to the new length one character at a time, and the new
 * words settle in from left to right. One requestAnimationFrame loop, about half a second. A new
 * text mid-change starts from whatever is on screen, so fast scrolling never leaves it stuck, and
 * the last frame is always the exact text. Under reduced motion it simply swaps.
 */
const DURATION = 520;

export function CodedLabel({ text, className, onCoding }: { text: string; className?: string; onCoding?: (on: boolean) => void }) {
  const [shown, setShown] = useState(text);
  const shownRef = useRef(text);
  const raf = useRef(0);

  useEffect(() => {
    if (text === shownRef.current) return;
    const reduce = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    cancelAnimationFrame(raf.current);
    if (reduce) { shownRef.current = text; setShown(text); onCoding?.(false); return; }
    const from = shownRef.current, start = performance.now();
    onCoding?.(true);
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / DURATION);
      const next = scrambleFrame(from, text, p);
      shownRef.current = next;
      setShown(next);
      if (p < 1) raf.current = requestAnimationFrame(step);
      else onCoding?.(false);
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [text]); // eslint-disable-line react-hooks/exhaustive-deps

  return <span className={className} aria-hidden="true">{shown}</span>;
}
