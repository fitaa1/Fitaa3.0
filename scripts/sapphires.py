# Builds public/sapphires.svg (run: python3 scripts/sapphires.py). Five royal sapphires in a graduated line, the
# middle one largest, each emerald cut (a step cut with its corners clipped) and set in its own white gold bezel,
# spaced apart like stones set by hand (Nigel, 25 Nov 2026: the kente of baguettes looked like bricks; five sapphires
# with the largest in the middle, or one, with the same glint). Every facet is shaded from one light at the top left,
# with the middle step reflected the other way, as a real step cut reflects.
import math
LIGHT = (-0.55, -0.83)          # light falls from the top left
SIZES = [(21, 15), (27, 19), (34, 24), (27, 19), (21, 15)]   # width, height of each stone, middle largest
GAP, BEZEL, PAD = 7.0, 1.6, 1.4

def octagon(cx, cy, w, h, c):
    x0, x1, y0, y1 = cx - w / 2, cx + w / 2, cy - h / 2, cy + h / 2
    return [(x0 + c, y0), (x1 - c, y0), (x1, y0 + c), (x1, y1 - c), (x1 - c, y1), (x0 + c, y1), (x0, y1 - c), (x0, y0 + c)]

def poly(pts, fill, extra=""):
    return f'<polygon points="{" ".join(f"{x:.2f},{y:.2f}" for x, y in pts)}" fill="{fill}"{extra}/>'

def hsl(l):
    return f"hsl(224 82% {l:.1f}%)"

def ring(outer, inner, cx, cy, flip, strength):
    out = []
    for i in range(8):
        a, b = outer[i], outer[(i + 1) % 8]
        p, q = inner[(i + 1) % 8], inner[i]
        mx, my = (a[0] + b[0]) / 2 - cx, (a[1] + b[1]) / 2 - cy
        n = math.hypot(mx, my) or 1
        lit = (mx * LIGHT[0] + my * LIGHT[1]) / n * (-1 if flip else 1)
        out.append(poly([a, b, p, q], hsl(29 + lit * strength)))
    return "".join(out)

def stone(cx, cy, w, h):
    c = min(w, h) * 0.2
    s = []
    bez = octagon(cx, cy, w + 2 * BEZEL, h + 2 * BEZEL, c + BEZEL * 0.6)
    s.append(poly(bez, "url(#wg)"))
    s.append(poly(octagon(cx, cy, w + 0.7, h + 0.7, c + 0.3), "#5f6b78"))
    steps = [0, 0.15, 0.28, 0.4]
    rings = [octagon(cx, cy, w * (1 - k) - (h * k * 0.0), h * (1 - k * (w / h) * 0.62), c * (1 - k * 1.3)) for k in steps]
    s.append(ring(rings[0], rings[1], cx, cy, False, 20))
    s.append(ring(rings[1], rings[2], cx, cy, True, 11))
    s.append(ring(rings[2], rings[3], cx, cy, False, 8))
    s.append(poly(rings[3], "url(#tb)"))
    # the one bright edge where the light first catches the stone
    a, b = rings[0][0], rings[0][1]
    s.append(f'<line x1="{a[0]:.2f}" y1="{a[1]+0.25:.2f}" x2="{b[0]:.2f}" y2="{b[1]+0.25:.2f}" stroke="#dfe8ff" stroke-width="0.45" stroke-linecap="round" opacity=".7"/>')
    return "".join(s)

total = sum(w for w, _ in SIZES) + GAP * (len(SIZES) - 1) + 2 * (BEZEL + PAD)
H = max(h for _, h in SIZES) + 2 * (BEZEL + PAD)
x = BEZEL + PAD
parts = []
for w, h in SIZES:
    parts.append(stone(x + w / 2, H / 2, w, h))
    x += w + GAP
defs = ('<linearGradient id="wg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f7f9fb"/><stop offset=".5" stop-color="#c9d1da"/><stop offset="1" stop-color="#eef2f5"/></linearGradient>'
        '<linearGradient id="tb" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="hsl(224 80% 40%)"/><stop offset=".55" stop-color="hsl(224 84% 27%)"/><stop offset="1" stop-color="hsl(225 88% 18%)"/></linearGradient>')
svg = (f'<svg xmlns="http://www.w3.org/2000/svg" width="{total:.1f}" height="{H:.1f}" viewBox="0 0 {total:.1f} {H:.1f}">'
       f'<defs>{defs}</defs>{"".join(parts)}</svg>\n')
open("public/sapphires.svg", "w").write(svg)
print(f"{len(svg)} bytes, {total:.1f} x {H:.1f}")
