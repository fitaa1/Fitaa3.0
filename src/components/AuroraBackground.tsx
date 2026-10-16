/**
 * Aurora mesh backdrop for the hero.
 *
 * Pure CSS (styles live in index.css under "Aurora mesh hero backdrop"),
 * so it renders the same on phone, tablet and desktop, stays sharp on
 * Retina screens and costs no JavaScript per frame. Colours come from the
 * --aurora-* theme variables, and motion stops when the visitor has
 * "reduce motion" turned on.
 */
export function AuroraBackground() {
  return (
    <div className="aurora" aria-hidden="true">
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
