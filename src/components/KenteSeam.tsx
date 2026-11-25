import { useRef } from "react";
import { useRise } from "@/hooks/useRise";

/*
 * The kente of baguettes (Nigel, 24 Nov 2026): Fitaa Creative's royal signature, set on the seam where two
 * sections meet. One link of a Nautilus-style bracelet read as a strip of kente: royal sapphire baguettes set
 * edge to edge between white gold set diamonds, drawn once in public/kente-band.svg (scripts/kente-band.py).
 * It rises with the page, then one glint of light crosses it once. At most two on a page.
 */
export function KenteSeam() {
  const ref = useRef<HTMLDivElement>(null);
  useRise(ref);
  return (
    <div className="kente-seam" aria-hidden="true">
      <div className="container mx-auto px-6 md:px-12">
        <div className="kente-hold"><div ref={ref} className="kente rise" /></div>
      </div>
    </div>
  );
}
