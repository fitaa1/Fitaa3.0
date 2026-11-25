# Builds public/sapphire.svg (run: python3 scripts/sapphire.py). One royal sapphire, emerald cut, in a white gold
# bezel (Nigel, 25 Nov 2026: leave one small sapphire, and make it look real, with depth and clarity, not plastic).
# A real step cut reads as a hall of mirrors: crisp bands of bright and near black, the pavilion steps seen through a
# clear table, and one sharp highlight where the light first strikes. Every facet is shaded from one light at the top
# left, the crown steps lit with it and the pavilion reflections against it, with strong contrast and hard edges and
# no soft gradients, which is what makes a drawn stone look like plastic. The table is slightly see-through.
import math, sys, random
random.seed(5990)
OUT = sys.argv[1] if len(sys.argv) > 1 else "public/sapphire.svg"
LIGHT = (-0.55, -0.83)               # light falls from the top left
W, H = 40.0, 28.0                    # the stone
BEZEL, PAD = 1.3, 0.8
HUE = 224

def octagon(cx, cy, w, h, c):
    x0, x1, y0, y1 = cx - w / 2, cx + w / 2, cy - h / 2, cy + h / 2
    return [(x0 + c, y0), (x1 - c, y0), (x1, y0 + c), (x1, y1 - c), (x1 - c, y1), (x0 + c, y1), (x0, y1 - c), (x0, y0 + c)]

def pts(p):
    return " ".join(f"{x:.2f},{y:.2f}" for x, y in p)

def poly(p, fill, extra=""):
    return f'<polygon points="{pts(p)}" fill="{fill}"{extra}/>'

def blue(l, s=74):
    return f"hsl({HUE} {s}% {max(4, min(l, 78)):.1f}%)"

def ring(outer, inner, cx, cy, flip, base, strength, op=1.0):
    out = []
    for i in range(8):
        a, b = outer[i], outer[(i + 1) % 8]
        p, q = inner[(i + 1) % 8], inner[i]
        mx, my = (a[0] + b[0]) / 2 - cx, (a[1] + b[1]) / 2 - cy
        n = math.hypot(mx, my) or 1
        lit = (mx * LIGHT[0] + my * LIGHT[1]) / n * (-1 if flip else 1)
        extra = f' fill-opacity="{op}"' if op < 1 else ""
        l = base + lit * strength + random.uniform(-5, 5)
        out.append(poly([a, b, p, q], blue(l), extra))
        out.append(poly([a, b, p, q], 'url(#fs)', ' fill-opacity=".5"'))
    return "".join(out)

cx = cy = 0
TW, TH = W + 2 * (BEZEL + PAD), H + 2 * (BEZEL + PAD)
cx, cy = TW / 2, TH / 2
c = min(W, H) * 0.22
s = []
# white gold bezel, bright at the top left, with a dark seat where the stone sits in it
s.append(poly(octagon(cx, cy, W + 2 * BEZEL, H + 2 * BEZEL, c + BEZEL * 0.6), "url(#wg)"))
s.append(poly(octagon(cx, cy, W + 0.8, H + 0.8, c + 0.3), "#3d4652"))
# crown: three steps, lit with the light, contrast growing toward the girdle
k = [0, 0.11, 0.21, 0.30]
def r(t, scale=1.0):
    return octagon(cx, cy, W * (1 - t), H - W * t, max(0.4, c * (1 - t * 1.6)))
crown = [r(t) for t in k]
s.append(ring(crown[0], crown[1], cx, cy, False, 22, 24))
s.append(ring(crown[1], crown[2], cx, cy, True, 30, 18))
s.append(ring(crown[2], crown[3], cx, cy, False, 38, 16))
# the table, and through it the pavilion steps reflected against the light: the hall of mirrors
table = crown[3]
s.append(poly(table, 'url(#tb)', ' fill-opacity=".9"'))
pav = [0.30, 0.40, 0.50, 0.60]
pr = [r(t) for t in pav]
s.append(ring(pr[0], pr[1], cx, cy, True, 30, 24, .7))
s.append(ring(pr[1], pr[2], cx, cy, False, 20, 22, .7))
s.append(ring(pr[2], pr[3], cx, cy, True, 42, 20, .65))
s.append(poly(pr[3], blue(48, 70), ' fill-opacity=".6"'))
# a clean window of light across the table, as clear glass shows the sky
x0, y0 = table[0]
s.append(f'<polygon points="{pts([(table[7][0]+1, table[7][1]), (table[0][0]+5, table[0][1]+0.2), (table[0][0]+11, table[0][1]+0.2), (table[7][0]+3.5, table[6][1])])}" fill="#fff" fill-opacity=".16"/>')
# hard edges: every facet edge is a fine line, which is what a cut stone shows and plastic does not
for poly_ in (crown + pr):
    s.append(f'<polygon points="{pts(poly_)}" fill="none" stroke="hsl({HUE} 60% 80%)" stroke-opacity=".22" stroke-width=".25"/>')
for i in range(8):
    a = crown[0][i]; b = pr[3][i]
    s.append(f'<line x1="{a[0]:.2f}" y1="{a[1]:.2f}" x2="{b[0]:.2f}" y2="{b[1]:.2f}" stroke="hsl({HUE} 60% 80%)" stroke-opacity=".18" stroke-width=".25"/>')
for (fx, fy, fr) in [(pr[1][2][0]-1.2, pr[1][2][1]+0.8, .7), (pr[2][5][0]+0.8, pr[2][5][1]-0.6, .55), (cx+3, cy+0.4, .45)]:
    s.append(f'<circle cx="{fx:.2f}" cy="{fy:.2f}" r="{fr}" fill="url(#star)" opacity=".75"/>')
# where the light first strikes: one sharp white edge and a star of light on the corner facet
a, b = crown[0][7], crown[0][0]
s.append(f'<line x1="{a[0]+.2:.2f}" y1="{a[1]:.2f}" x2="{b[0]:.2f}" y2="{b[1]+.2:.2f}" stroke="#fff" stroke-width=".7" stroke-linecap="round" opacity=".9"/>')
a, b = crown[0][0], crown[0][1]
s.append(f'<line x1="{a[0]:.2f}" y1="{a[1]+.3:.2f}" x2="{a[0]+(b[0]-a[0])*.55:.2f}" y2="{b[1]+.3:.2f}" stroke="#fff" stroke-width=".5" stroke-linecap="round" opacity=".7"/>')
sx, sy = crown[1][0][0] + 0.6, crown[1][0][1] + 0.6
s.append(f'<circle cx="{sx:.2f}" cy="{sy:.2f}" r="1.1" fill="url(#star)"/>')
defs = (
    '<linearGradient id="wg" x1="0" y1="0" x2=".6" y2="1"><stop offset="0" stop-color="#ffffff"/>'
    '<stop offset=".45" stop-color="#c3ccd6"/><stop offset=".7" stop-color="#8d98a5"/><stop offset="1" stop-color="#e3e8ee"/></linearGradient>'
    '<linearGradient id="fs" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".14"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".18"/></linearGradient>'
    '<radialGradient id="tb" cx=".45" cy=".42" r=".7"><stop offset="0" stop-color="hsl(222 72% 46%)"/><stop offset=".6" stop-color="hsl(224 76% 28%)"/><stop offset="1" stop-color="hsl(226 80% 14%)"/></radialGradient>'
    '<radialGradient id="star"><stop offset="0" stop-color="#fff"/><stop offset=".4" stop-color="#fff" stop-opacity=".8"/>'
    '<stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>')
svg = (f'<svg xmlns="http://www.w3.org/2000/svg" width="{TW:.1f}" height="{TH:.1f}" viewBox="0 0 {TW:.1f} {TH:.1f}">'
       f'<defs>{defs}</defs>{"".join(s)}</svg>\n')
open(OUT, "w").write(svg)
print(f"{len(svg)} bytes, {TW:.1f} x {TH:.1f}")
