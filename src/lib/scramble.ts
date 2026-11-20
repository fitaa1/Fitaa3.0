/* One frame of a label rewriting itself like code: see CodedLabel.tsx. Pure, so it is tested. */
export function scrambleFrame(from: string, to: string, p: number, rand: () => number = Math.random): string {
  if (p >= 1) return to;
  const len = Math.round(from.length + (to.length - from.length) * Math.min(1, p * 1.6));
  let out = "";
  for (let i = 0; i < len; i++) {
    // Each place settles once the wave passes it: earlier places first.
    const settle = 0.35 + (i / Math.max(1, to.length)) * 0.55;
    const target = to[i] ?? "";
    if (p >= settle && target) { out += target; continue; }
    out += target === " " || (!target && from[i] === " ") ? " " : rand() < 0.5 ? "0" : "1";
  }
  return out;
}

