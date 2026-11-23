import { useRef, type KeyboardEvent, type PointerEvent } from "react";

/** One row of equal segments with a single pill that slides to the choice (SITE_STANDARD.md, Switches slide).
 *  The pill moves by transform only: each segment is the same width, so the pill is one segment wide and
 *  translates by whole segments. Real buttons with aria-pressed, arrow keys move the choice, and under
 *  reduced motion the pill moves without the spring. Without CSS support the pressed button keeps its fill. */
export function SlideSwitch<T extends string>({ label, options, value, onChange }: {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  const row = useRef<HTMLDivElement>(null);
  const index = Math.max(0, options.findIndex((o) => o.value === value));
  const move = (e: KeyboardEvent, step: number) => {
    e.preventDefault();
    const next = options[(index + step + options.length) % options.length];
    onChange(next.value);
    (row.current?.querySelectorAll("button")[options.indexOf(next)] as HTMLButtonElement | undefined)?.focus();
  };
  // Drag: while a finger or mouse is down on the row, the segment under it is chosen, so the pill follows.
  const dragging = useRef(false);
  const pick = (e: PointerEvent) => {
    const box = row.current?.getBoundingClientRect();
    if (!box) return;
    const i = Math.min(options.length - 1, Math.max(0, Math.floor(((e.clientX - box.left) / box.width) * options.length)));
    if (options[i].value !== value) onChange(options[i].value);
  };
  return (
    <div
      ref={row}
      onPointerDown={(e) => { dragging.current = true; row.current?.setPointerCapture?.(e.pointerId); }}
      onPointerMove={(e) => { if (dragging.current) pick(e); }}
      onPointerUp={() => { dragging.current = false; }}
      onPointerCancel={() => { dragging.current = false; }}
      role="group"
      aria-label={label}
      className="slide-switch"
      style={{ ["--n" as string]: options.length, ["--i" as string]: index }}
      onKeyDown={(e) => (e.key === "ArrowRight" ? move(e, 1) : e.key === "ArrowLeft" ? move(e, -1) : undefined)}
    >
      <span className="slide-switch__pill" aria-hidden="true" />
      {options.map((o) => (
        <button key={o.value} type="button" aria-pressed={o.value === value} onClick={() => onChange(o.value)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}
