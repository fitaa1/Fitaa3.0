import { useRef } from "react";
import { useRise } from "@/hooks/useRise";

/*
 * Five royal sapphires (Nigel, 25 Nov 2026): Fitaa Creative's royal signature, set on the seam where two sections
 * meet. A graduated line of emerald cut sapphires, the middle one largest, each in its own white gold bezel, drawn
 * once in public/sapphires.svg (scripts/sapphires.py). They rise with the page, then one glint of light crosses the
 * stones once. At most two on a page.
 */
export function SapphireSeam() {
  const ref = useRef<HTMLDivElement>(null);
  useRise(ref);
  return (
    <div className="sapphire-seam" aria-hidden="true">
      <div className="sapphire-hold"><div ref={ref} className="sapphires rise" /></div>
    </div>
  );
}
