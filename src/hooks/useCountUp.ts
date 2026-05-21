import { useState, useEffect } from "react";
export function useCountUp(end: number, duration = 2000, inView = true) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) { setCount(0); return; }
    let startTime: number | null = null; let af: number;
    const ease = (t: number) => 1 - Math.pow(1 - t, 4);
    const step = (ts: number) => {
      if (!startTime) startTime = ts;
      const p = Math.min((ts - startTime) / duration, 1);
      setCount(end * ease(p));
      if (p < 1) af = requestAnimationFrame(step);
    };
    af = requestAnimationFrame(step);
    return () => cancelAnimationFrame(af);
  }, [end, duration, inView]);
  return end % 1 !== 0 ? count.toFixed(1) : Math.round(count);
}