# Builds public/kente-band.svg (run: python3 scripts/kente-band.py). One link of a Nautilus-style bracelet read as
# a strip of kente: in each of two rows, a white gold set diamond baguette, three royal sapphire baguettes set
# edge to edge with no metal between them (the invisible setting), then another diamond. Every stone is step cut:
# two steps and a table, lit from the top left, so it looks cut rather than printed (Nigel, 24 Nov 2026).
W, H = 112, 24
G = 0.3
LIGHT = {
    "sapphire": [("#3f69dc", "#2148bf", "#0a226c", "#05164c"), ("#132f8c", "#10297d", "#2350c8", "#2e5cd6"), ("#183aa3", "#0c2470")],
    "diamond": [("#ffffff", "#eef2f6", "#b7c1cc", "#a3afbc"), ("#d9e0e7", "#e6ebf0", "#ffffff", "#f6f8fa"), ("#f7f9fb", "#d7dee6")],
}
def ring(x, y, w, h, d, top, left, right, bottom):
    X, Y = x + w, y + h
    q = lambda pts, c: f'<polygon points="{" ".join(f"{a:.2f},{b:.2f}" for a, b in pts)}" fill="{c}"/>'
    return (q([(x, y), (X, y), (X - d, y + d), (x + d, y + d)], top) + q([(X, y), (X, Y), (X - d, Y - d), (X - d, y + d)], right)
            + q([(x, Y), (X, Y), (X - d, Y - d), (x + d, Y - d)], bottom) + q([(x, y), (x + d, y + d), (x + d, Y - d), (x, Y)], left))
def stone(x, y, w, h, kind):
    s1, s2, table = LIGHT[kind]
    d = min(w, h) * 0.16
    out = ring(x, y, w, h, d, s1[0], s1[1], s1[2], s1[3])
    out += ring(x + d, y + d, w - 2 * d, h - 2 * d, d, *s2)
    t = "st" if kind == "sapphire" else "dt"
    out += f'<rect x="{x+2*d:.2f}" y="{y+2*d:.2f}" width="{w-4*d:.2f}" height="{h-4*d:.2f}" fill="url(#{t})"/>'
    return out
parts = [f'<rect width="{W}" height="{H}" fill="url(#wg)"/>', f'<rect width="0.6" height="{H}" fill="#8e98a3" opacity=".7"/>']
pad, dw = 2.0, 16.0
rh = (H - 2 * pad - G) / 2
for r in range(2):
    y = pad + r * (rh + G)
    parts.append(stone(pad, y, dw, rh, "diamond"))
    parts.append(stone(W - pad - dw, y, dw, rh, "diamond"))
bx = pad + dw + 1.4
bw = W - 2 * bx
parts.append(f'<rect x="{bx-0.5:.2f}" y="{pad-0.5:.2f}" width="{bw+1:.2f}" height="{H-2*pad+1:.2f}" fill="#7b8794" opacity=".6"/>')
cw = (bw - 2 * G) / 3
for r in range(2):
    for c in range(3):
        parts.append(stone(bx + c * (cw + G), pad + r * (rh + G), cw, rh, "sapphire"))
grad = lambda i, stops, x2="1", y2="1": f'<linearGradient id="{i}" x1="0" y1="0" x2="{x2}" y2="{y2}">' + "".join(f'<stop offset="{o}" stop-color="{c}"/>' for o, c in stops) + "</linearGradient>"
defs = (grad("wg", [(0, "#f6f8fa"), (0.45, "#d3d9e0"), (0.55, "#c3cbd4"), (1, "#eef1f4")], "0", "1")
        + grad("st", [(0, "#2452c9"), (0.45, "#163a9f"), (1, "#0b2368")])
        + grad("dt", [(0, "#ffffff"), (0.5, "#e4e9ef"), (1, "#f8fafc")]))
svg = (f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}"><defs>{defs}</defs>'
       + "".join(parts) + "</svg>\n")
open("public/kente-band.svg", "w").write(svg)
print(len(svg), "bytes")
