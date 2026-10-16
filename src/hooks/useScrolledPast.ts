import { useState, useEffect } from "react";

/**
 * True once the page is scrolled past `threshold` pixels.
 * Only re-renders when the answer changes, not on every scroll event.
 */
export function useScrolledPast(threshold: number) {
  const [past, setPast] = useState(false);
  useEffect(() => {
    const check = () => setPast(window.scrollY > threshold);
    check();
    window.addEventListener("scroll", check, { passive: true });
    return () => window.removeEventListener("scroll", check);
  }, [threshold]);
  return past;
}
