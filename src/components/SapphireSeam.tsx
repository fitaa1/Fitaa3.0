import { useRef } from "react";
import { useRise } from "@/hooks/useRise";

/*
 * One royal sapphire (Nigel, 25 Nov 2026): Fitaa Creative's royal signature, one small emerald cut sapphire in an
 * invisible setting with no rim, set on the seam under the hero, once a page. Drawn once in public/sapphire.svg
 * (scripts/sapphire.py). It rises with the page, then one glint of light crosses the stone once.
 */
export function SapphireSeam() {
  const ref = useRef<HTMLDivElement>(null);
  useRise(ref);
  return (
    <div className="sapphire-seam" aria-hidden="true">
      <div className="sapphire-hold"><div ref={ref} className="sapphire rise" /></div>
    </div>
  );
}
