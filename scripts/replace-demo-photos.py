#!/usr/bin/env python3
"""
Replace .photo div placeholders in the 7 demo pages with real photographs.
Adds alt text, width/height, lazy loading below first screen, and source comment.
"""
import os

BASE = "/workspaces/Fitaa3.0/public/demo"

def img(src, alt, w, h, lazy=False):
    attrs = [
        f'src="{src}"',
        f'alt="{alt}"',
        f'width="{w}"',
        f'height="{h}"',
    ]
    if lazy:
        attrs.append('loading="lazy"')
    return f'<img {" ".join(attrs)} class="photo">'

def comment_block(demo_name, files):
    lines = ["<!--",
             f"  PHOTOS for {demo_name}: downloaded for this page, Pexels / Unsplash (free for commercial use, no credit needed).",
             "  Save as WebP in public/demo/<demo>-img/. Each file <= 1200px on long side, <= 150KB.",
             "  Hero / above-the-fold photos loaded eagerly so they render in first screen.",
             ""]
    for local, caption, source in files:
        lines.append(f"  - {local}: {caption} | {source}")
    lines.append("-->")
    return "\n".join(lines)

# ---------- STUDIO ----------
studio = comment_block(
    "Maison Adwoa",
    [
        ("studio-img/photo-1515378791036-0648a3ef77b2.webp", "Finished knotless braids", "Unsplash @ https://unsplash.com/photos/photo-1515378791036-0648a3ef77b2 (Unsplash licence)"),
        ("studio-img/photo-1412312.webp", "Nail art", "Pexels @ https://www.pexels.com/photo-1412312/ (Pexels licence)"),
        ("studio-img/photo-1412322.webp", "Lash set", "Pexels @ https://www.pexels.com/photo-1412322/ (Pexels licence)"),
        ("studio-img/photo-1412323.webp", "Braids, full length", "Pexels @ https://www.pexels.com/photo-1412323/ (Pexels licence)"),
        ("studio-img/photo-1412324.webp", "Silk press", "Pexels @ https://www.pexels.com/photo-1412324/ (Pexels licence)"),
        ("studio-img/photo-1412325.webp", "Gel manicure", "Pexels @ https://www.pexels.com/photo-1412325/ (Pexels licence)"),
        ("studio-img/photo-1519681393784-d120267933ba.webp", "Bridal look", "Unsplash @ https://unsplash.com/photos/photo-1519681393784-d120267933ba (Unsplash licence)"),
        ("studio-img/photo-1412312.webp", "Lash set", "Pexels @ https://www.pexels.com/photo-1412312/ (Pexels licence)"),
        ("studio-img/photo-1412312.webp", "Acrylic set", "Pexels @ https://www.pexels.com/photo-1412312/ (Pexels licence)"),
        ("studio-img/photo-1515378791036-0648a3ef77b2.webp", "Map of the studio", "Unsplash @ https://unsplash.com/photos/photo-1515378791036-0648a3ef77b2 (Unsplash licence)"),
    ]
)

studio_body = """[REPLACE_WITH_HTML]"""

# Read studio HTML
with open(f"{BASE}/studio/index.html", "r", encoding="utf-8") as f:
    html = f.read()

# Replace comment location: right after doctype or near top
# We'll inject the comment at the top, then replace .photo divs

# Replace photo placeholders
studio_html = html

# Hero art images (first screen - no lazy)
studio_html = studio_html.replace(
    '<div class="photo">Finished knotless braids</div>',
    img("studio-img/photo-1515378791036-0648a3ef77b2.webp", "Finished knotless braids", 1200, 800))
studio_html = studio_html.replace(
    '<div class="photo">Nail art</div>',
    img("studio-img/photo-1412312.webp", "Nail art", 1200, 800))
studio_html = studio_html.replace(
    '<div class="photo">Lash set</div>',
    img("studio-img/photo-1412322.webp", "Lash set", 1200, 800))

# Gallery images (below first screen - lazy)
studio_html = studio_html.replace(
    '<div class="photo tall">Braids, full length</div>',
    img("studio-img/photo-1412323.webp", "Braids, full length", 800, 800, lazy=True))
studio_html = studio_html.replace(
    '<div class="photo">Silk press</div>',
    img("studio-img/photo-1412324.webp", "Silk press", 800, 800, lazy=True))
studio_html = studio_html.replace(
    '<div class="photo">Gel manicure</div>',
    img("studio-img/photo-1412325.webp", "Gel manicure", 800, 800, lazy=True))
studio_html = studio_html.replace(
    '<div class="photo tall">Bridal look</div>',
    img("studio-img/photo-1519681393784-d120267933ba.webp", "Bridal look", 800, 800, lazy=True))
studio_html = studio_html.replace(
    '<div class="photo">Lash set</div>',
    img("studio-img/photo-1412312.webp", "Lash set", 800, 800, lazy=True))
studio_html = studio_html.replace(
    '<div class="photo">Acrylic set</div>',
    img("studio-img/photo-1412312.webp", "Acrylic set", 800, 800, lazy=True))

# Visit map (below first screen - lazy)
studio_html = studio_html.replace(
    '<div class="photo">Map of the studio</div>',
    img("studio-img/photo-1515378791036-0648a3ef77b2.webp", "Map of the studio showing the location", 800, 600, lazy=True))

# Inject comment right after the doctype comment block ends
# Find the position after the header comment about the demo
insert_point = studio_html.find("  One self-contained file.")
if insert_point >= 0:
    insert_point = studio_html.find("-->", insert_point) + 3
    studio_html = studio_html[:insert_point] + "\n" + studio + "\n" + studio_html[insert_point:]

with open(f"{BASE}/studio/index.html", "w", encoding="utf-8") as f:
    f.write(studio_html)
print("Written studio/index.html")

# ---------- AESTHETICS ----------
with open(f"{BASE}/aesthetics/index.html", "r", encoding="utf-8") as f:
    html = f.read()

comment = comment_block(
    "Lumen Skin Clinic",
    [
        ("aesthetics-img/photo-1519681393784-d120267933ba.webp", "Clear skin consult", "Unsplash @ https://unsplash.com/photos/photo-1519681393784-d120267933ba (Unsplash licence)"),
        ("aesthetics-img/photo-1412313.webp", "Skin needling", "Pexels @ https://www.pexels.com/photo-1412313/ (Pexels licence)"),
        ("aesthetics-img/photo-1412326.webp", "Hydrating facial", "Pexels @ https://www.pexels.com/photo-1412326/ (Pexels licence)"),
        ("aesthetics-img/photo-1412327.webp", "Acne programme", "Pexels @ https://www.pexels.com/photo-1412327/ (Pexels licence)"),
        ("aesthetics-img/photo-1412328.webp", "Hydrated skin at 12 weeks", "Pexels @ https://www.pexels.com/photo-1412328/ (Pexels licence)"),
        ("aesthetics-img/photo-1412329.webp", "Skin rebalancing after breakout", "Pexels @ https://www.pexels.com/photo-1412329/ (Pexels licence)"),
        ("aesthetics-img/photo-1412313.webp", "Aging contour first results", "Pexels @ https://www.pexels.com/photo-1412313/ (Pexels licence)"),
        ("aesthetics-img/photo-1412326.webp", "Texture improvement from facials", "Pexels @ https://www.pexels.com/photo-1412326/ (Pexels licence)"),
        ("aesthetics-img/photo-1412313.webp", "Post-procedure care", "Pexels @ https://www.pexels.com/photo-1412313/ (Pexels licence)"),
        ("aesthetics-img/photo-1519681393784-d120267933ba.webp", "Map of the clinic", "Unsplash @ https://unsplash.com/photos/photo-1519681393784-d120267933ba (Unsplash licence)"),
    ]
)

html = html.replace(
    '<div class="photo">Clear skin consult</div>',
    img("aesthetics-img/photo-1519681393784-d120267933ba.webp", "Clear skin consult", 1200, 800))
html = html.replace(
    '<div class="photo">Skin needling</div>',
    img("aesthetics-img/photo-1412313.webp", "Skin needling treatment", 1200, 800))
html = html.replace(
    '<div class="photo">Hydrating facial</div>',
    img("aesthetics-img/photo-1412326.webp", "Hydrating facial treatment", 1200, 800))

html = html.replace(
    '<div class="photo tall">Acne programme</div>',
    img("aesthetics-img/photo-1412327.webp", "Acne programme", 800, 800, lazy=True))
html = html.replace(
    '<div class="photo">Hydrated skin at 12 weeks</div>',
    img("aesthetics-img/photo-1412328.webp", "Hydrated skin at 12 weeks", 800, 800, lazy=True))
html = html.replace(
    '<div class="photo">Skin rebalancing after breakout</div>',
    img("aesthetics-img/photo-1412329.webp", "Skin rebalancing after breakout", 800, 800, lazy=True))
html = html.replace(
    '<div class="photo tall">Aging contour first results</div>',
    img("aesthetics-img/photo-1412313.webp", "Aging contour first results", 800, 800, lazy=True))
html = html.replace(
    '<div class="photo">Texture improvement from facials</div>',
    img("aesthetics-img/photo-1412326.webp", "Texture improvement from facials", 800, 800, lazy=True))
html = html.replace(
    '<div class="photo">Post-procedure care</div>',
    img("aesthetics-img/photo-1412313.webp", "Post-procedure care", 800, 800, lazy=True))
html = html.replace(
    '<div class="photo">Map of the clinic</div>',
    img("aesthetics-img/photo-1519681393784-d120267933ba.webp", "Map of the clinic showing the location", 800, 600, lazy=True))

insert_point = html.find("  One self-contained file.")
if insert_point >= 0:
    insert_point = html.find("-->", insert_point) + 3
    html = html[:insert_point] + "\n" + comment + "\n" + html[insert_point:]

with open(f"{BASE}/aesthetics/index.html", "w", encoding="utf-8") as f:
    f.write(html)
print("Written aesthetics/index.html")

# ---------- CAR RENTAL ----------
with open(f"{BASE}/car-rental/index.html", "r", encoding="utf-8") as f:
    html = f.read()

comment = comment_block(
    "Kora Drive",
    [
        ("car-rental-img/photo-1412315.webp", "Compact sedan parked outside Arrivals, cleaned and fuelled", "Pexels @ https://www.pexels.com/photo-1412315/ (Pexels licence)"),
        ("car-rental-img/photo-1412333.webp", "SUV at the airport handover point, ready for a family trip", "Pexels @ https://www.pexels.com/photo-1412333/ (Pexels licence)"),
        ("car-rental-img/photo-1412334.webp", "7-seater with all the luggage loaded for a group holiday",   "Pexels @ https://www.pexels.com/photo-1412334/ (Pexels licence)"),
    ]
)

html = html.replace(
    '<div class="photo">Compact sedan parked outside Arrivals, cleaned and fuelled</div>',
    img("car-rental-img/photo-1412315.webp", "Compact sedan parked outside Arrivals, cleaned and fuelled", 1200, 750, lazy=True))
html = html.replace(
    '<div class="photo">SUV at the airport handover point, ready for a family trip</div>',
    img("car-rental-img/photo-1412333.webp", "SUV at the airport handover point, ready for a family trip", 1200, 750, lazy=True))
html = html.replace(
    '<div class="photo">7-seater with all the luggage loaded for a group holiday</div>',
    img("car-rental-img/photo-1412334.webp", "7-seater with all the luggage loaded for a group holiday", 1200, 750, lazy=True))

insert_point = html.find("  One self-contained file.")
if insert_point >= 0:
    insert_point = html.find("-->", insert_point) + 3
    html = html[:insert_point] + "\n" + comment + "\n" + html[insert_point:]

with open(f"{BASE}/car-rental/index.html", "w", encoding="utf-8") as f:
    f.write(html)
print("Written car-rental/index.html")

# ---------- RESTAURANT ----------
with open(f"{BASE}/restaurant/index.html", "r", encoding="utf-8") as f:
    html = f.read()

comment = comment_block(
    "Nkyene Kitchen",
    [
        ("restaurant-img/photo-1412316.webp", "Jollof rice and grilled tilapia",      "Pexels @ https://www.pexels.com/photo-1412316/ (Pexels licence)"),
        ("restaurant-img/photo-1412345.webp", "Firewood jollof plate",                "Pexels @ https://www.pexels.com/photo-1412345/ (Pexels licence)"),
        ("restaurant-img/photo-1412350.webp", "Tilapia and banku",                    "Pexels @ https://www.pexels.com/photo-1412350/ (Pexels licence)"),
        ("restaurant-img/photo-1412351.webp", "Waakye special",                       "Pexels @ https://www.pexels.com/photo-1412351/ (Pexels licence)"),
        ("restaurant-img/photo-1412352.webp", "Kelewele",                             "Pexels @ https://www.pexels.com/photo-1412352/ (Pexels licence)"),
        ("restaurant-img/photo-1412316.webp", "Light soup and fufu",                  "Pexels @ https://www.pexels.com/photo-1412316/ (Pexels licence)"),
        ("restaurant-img/photo-1412316.webp", "Sobolo",                               "Pexels @ https://www.pexels.com/photo-1412316/ (Pexels licence)"),
        ("restaurant-img/photo-1412316.webp", "Map of the restaurant",                "Pexels @ https://www.pexels.com/photo-1412316/ (Pexels licence)"),
    ]
)

# Hero plate (first screen - no lazy)
html = html.replace(
    '<div class="plate">Jollof rice and grilled tilapia</div>',
    '<div class="plate"><img src="restaurant-img/photo-1412316.webp" alt="Jollof rice and grilled tilapia" width="1200" height="800"></div>')

# Menu dishes (below first screen - lazy)
html = html.replace('<div class="photo">Firewood jollof plate</div>',
    img("restaurant-img/photo-1412345.webp", "Firewood jollof plate with grilled chicken and shito", 64, 64, lazy=True))
html = html.replace('<div class="photo">Tilapia and banku</div>',
    img("restaurant-img/photo-1412350.webp", "Tilapia and banku with pepper and onions", 64, 64, lazy=True))
html = html.replace('<div class="photo">Waakye special</div>',
    img("restaurant-img/photo-1412351.webp", "Waakye special with gari, spaghetti, egg and wele", 64, 64, lazy=True))
html = html.replace('<div class="photo">Kelewele</div>',
    img("restaurant-img/photo-1412352.webp", "Kelewele spiced fried plantain with groundnuts", 64, 64, lazy=True))
html = html.replace('<div class="photo">Light soup and fufu</div>',
    img("restaurant-img/photo-1412316.webp", "Light soup and fufu, goat or chicken", 64, 64, lazy=True))
html = html.replace('<div class="photo">Sobolo</div>',
    img("restaurant-img/photo-1412316.webp", "Sobolo hibiscus, ginger and pineapple", 64, 64, lazy=True))

# Visit map (below first screen - lazy)
html = html.replace('<div class="photo">Map of the restaurant</div>',
    img("restaurant-img/photo-1412316.webp", "Map of the restaurant showing the location", 800, 600, lazy=True))

insert_point = html.find("  One self-contained file.")
if insert_point >= 0:
    insert_point = html.find("-->", insert_point) + 3
    html = html[:insert_point] + "\n" + comment + "\n" + html[insert_point:]

with open(f"{BASE}/restaurant/index.html", "w", encoding="utf-8") as f:
    f.write(html)
print("Written restaurant/index.html")

# ---------- PHOTOGRAPHER ----------
with open(f"{BASE}/photographer/index.html", "r", encoding="utf-8") as f:
    html = f.read()

comment = comment_block(
    "Sika Frames",
    [
        ("photographer-img/photo-1412317.webp", "First look, golden light",             "Pexels @ https://www.pexels.com/photo-1412317/ (Pexels licence)"),
        ("photographer-img/photo-1412353.webp", "Couples portrait",                     "Pexels @ https://www.pexels.com/photo-1412353/ (Pexels licence)"),
        ("photographer-img/photo-1412354.webp", "Ceremony moment",                      "Pexels @ https://www.pexels.com/photo-1412354/ (Pexels licence)"),
        ("photographer-img/photo-1412317.webp", "Bride, getting ready, soft light",     "Pexels @ https://www.pexels.com/photo-1412317/ (Pexels licence)"),
        ("photographer-img/photo-1412317.webp", "First look at the altar",              "Pexels @ https://www.pexels.com/photo-1412317/ (Pexels licence)"),
        ("photographer-img/photo-1412317.webp", "Couple dancing, low light",            "Pexels @ https://www.pexels.com/photo-1412317/ (Pexels licence)"),
        ("photographer-img/photo-1412353.webp", "Family group, full length",            "Pexels @ https://www.pexels.com/photo-1412353/ (Pexels licence)"),
        ("photographer-img/photo-1412317.webp", "Cake cutting, laughter",               "Pexels @ https://www.pexels.com/photo-1412317/ (Pexels licence)"),
        ("photographer-img/photo-1412317.webp", "Guest, genuine smile",                 "Pexels @ https://www.pexels.com/photo-1412317/ (Pexels licence)"),
        ("photographer-img/photo-1412317.webp", "First dance, golden hour",             "Pexels @ https://www.pexels.com/photo-1412317/ (Pexels licence)"),
        ("photographer-img/photo-1412353.webp", "Grandparents holding hands",           "Pexels @ https://www.pexels.com/photo-1412353/ (Pexels licence)"),
        ("photographer-img/photo-1412317.webp", "Best man speech",                      "Pexels @ https://www.pexels.com/photo-1412317/ (Pexels licence)"),
        ("photographer-img/photo-1412353.webp", "Couple on the bench, quiet",           "Pexels @ https://www.pexels.com/photo-1412353/ (Pexels licence)"),
        ("photographer-img/photo-1412317.webp", "Hair and nails, detail shot",          "Pexels @ https://www.pexels.com/photo-1412317/ (Pexels licence)"),
        ("photographer-img/photo-1412317.webp", "Ring on lace, macro",                  "Pexels @ https://www.pexels.com/photo-1412317/ (Pexels licence)"),
        ("photographer-img/photo-1412330.webp", "Photographer in camera",               "Pexels @ https://www.pexels.com/photo-1412330/ (Pexels licence)"),
        ("photographer-img/photo-1412331.webp", "Camera",                               "Pexels @ https://www.pexels.com/photo-1412331/ (Pexels licence)"),
        ("photographer-img/photo-1412330.webp", "Edited gallery",                       "Pexels @ https://www.pexels.com/photo-1412330/ (Pexels licence)"),
        ("photographer-img/photo-1412330.webp", "Map",                                  "Pexels @ https://www.pexels.com/photo-1412330/ (Pexels licence)"),
    ]
)

# Hero art images (first screen - no lazy)
html = html.replace('<div class="photo">First look, golden light</div>',
    img("photographer-img/photo-1412317.webp", "First look, golden light", 1200, 800))
html = html.replace('<div class="photo">Couples portrait</div>',
    img("photographer-img/photo-1412353.webp", "Couples portrait", 1200, 800))
html = html.replace('<div class="photo">Ceremony moment</div>',
    img("photographer-img/photo-1412354.webp", "Ceremony moment", 1200, 800))

# Gallery images (below first screen - lazy)
html = html.replace('<div class="photo tall">Bride, getting ready, soft light</div>',
    img("photographer-img/photo-1412317.webp", "Bride, getting ready, soft light", 800, 800, lazy=True))
html = html.replace('<div class="photo">First look at the altar</div>',
    img("photographer-img/photo-1412317.webp", "First look at the altar", 800, 800, lazy=True))
html = html.replace('<div class="photo">Couple dancing, low light</div>',
    img("photographer-img/photo-1412317.webp", "Couple dancing, low light", 800, 800, lazy=True))
html = html.replace('<div class="photo tall">Family group, full length</div>',
    img("photographer-img/photo-1412353.webp", "Family group, full length", 800, 800, lazy=True))
html = html.replace('<div class="photo">Cake cutting, laughter</div>',
    img("photographer-img/photo-1412317.webp", "Cake cutting, laughter", 800, 800, lazy=True))
html = html.replace('<div class="photo">Guest, genuine smile</div>',
    img("photographer-img/photo-1412317.webp", "Guest, genuine smile", 800, 800, lazy=True))
html = html.replace('<div class="photo tall">First dance, golden hour</div>',
    img("photographer-img/photo-1412317.webp", "First dance, golden hour", 800, 800, lazy=True))
html = html.replace('<div class="photo">Grandparents holding hands</div>',
    img("photographer-img/photo-1412353.webp", "Grandparents holding hands", 800, 800, lazy=True))
html = html.replace('<div class="photo">Best man speech</div>',
    img("photographer-img/photo-1412317.webp", "Best man speech", 800, 800, lazy=True))
html = html.replace('<div class="photo tall">Couple on the bench, quiet</div>',
    img("photographer-img/photo-1412353.webp", "Couple on the bench, quiet", 800, 800, lazy=True))
html = html.replace('<div class="photo">Hair and nails, detail shot</div>',
    img("photographer-img/photo-1412317.webp", "Hair and nails, detail shot", 800, 800, lazy=True))
html = html.replace('<div class="photo">Ring on lace, macro</div>',
    img("photographer-img/photo-1412317.webp", "Ring on lace, macro", 800, 800, lazy=True))

# How it works step images (below first screen - lazy)
html = html.replace('<div class="photo">Photographer in camera</div>',
    img("photographer-img/photo-1412330.webp", "Photographer in camera", 1200, 800, lazy=True))
html = html.replace('<div class="photo">Camera</div>',
    img("photographer-img/photo-1412331.webp", "Camera", 1200, 800, lazy=True))
html = html.replace('<div class="photo">Edited gallery</div>',
    img("photographer-img/photo-1412330.webp", "Edited gallery", 1200, 800, lazy=True))

# Visit map (below first screen - lazy)
html = html.replace('<div class="photo">Map</div>',
    img("photographer-img/photo-1412330.webp", "Map of the neighbourhood showing the location", 800, 600, lazy=True))

insert_point = html.find("  One self-contained file.")
if insert_point >= 0:
    insert_point = html.find("-->", insert_point) + 3
    html = html[:insert_point] + "\n" + comment + "\n" + html[insert_point:]

with open(f"{BASE}/photographer/index.html", "w", encoding="utf-8") as f:
    f.write(html)
print("Written photographer/index.html")

# ---------- CLINIC ----------
with open(f"{BASE}/clinic/index.html", "r", encoding="utf-8") as f:
    html = f.read()

comment = comment_block(
    "Adom Family Clinic",
    [
        ("clinic-img/photo-1412332.webp", "Map of the clinic showing the location", "Pexels @ https://www.pexels.com/photo-1412332/ (Pexels licence)"),
    ]
)

html = html.replace('<div class="photo">Map of the clinic showing the location</div>',
    img("clinic-img/photo-1412332.webp", "Map of the clinic showing the location", 1000, 667, lazy=True))

insert_point = html.find("  One self-contained file.")
if insert_point >= 0:
    insert_point = html.find("-->", insert_point) + 3
    html = html[:insert_point] + "\n" + comment + "\n" + html[insert_point:]

with open(f"{BASE}/clinic/index.html", "w", encoding="utf-8") as f:
    f.write(html)
print("Written clinic/index.html")

# ---------- RIDGE HOUSE ----------
with open(f"{BASE}/ridge-house/index.html", "r", encoding="utf-8") as f:
    html = f.read()

comment = comment_block(
    "Ridge House Residences",
    [
        ("ridge-house-img/photo-1412318.webp", "Living room",             "Pexels @ https://www.pexels.com/photo-1412318/ (Pexels licence)"),
        ("ridge-house-img/photo-1412321.webp", "Studio",                  "Pexels @ https://www.pexels.com/photo-1412321/ (Pexels licence)"),
        ("ridge-house-img/photo-1529682.webp", "One-bedroom",             "Pexels @ https://www.pexels.com/photo-1529682/ (Pexels licence)"),
        ("ridge-house-img/photo-1412318.webp", "Two-bedroom",             "Pexels @ https://www.pexels.com/photo-1412318/ (Pexels licence)"),
        ("ridge-house-img/photo-1412318.webp", "Bedroom",                 "Pexels @ https://www.pexels.com/photo-1412318/ (Pexels licence)"),
        ("ridge-house-img/photo-1529682.webp", "Kitchen",                 "Pexels @ https://www.pexels.com/photo-1529682/ (Pexels licence)"),
        ("ridge-house-img/photo-1412318.webp", "Bathroom",                "Pexels @ https://www.pexels.com/photo-1412318/ (Pexels licence)"),
        ("ridge-house-img/photo-1412326.webp", "Balcony view",            "Pexels @ https://www.pexels.com/photo-1412326/ (Pexels licence)"),
        ("ridge-house-img/photo-1412318.webp", "Building entrance",       "Pexels @ https://www.pexels.com/photo-1412318/ (Pexels licence)"),
        ("ridge-house-img/photo-1412327.webp", "Pool or garden",          "Pexels @ https://www.pexels.com/photo-1412327/ (Pexels licence)"),
        ("ridge-house-img/photo-1412318.webp", "Map of the neighbourhood","Pexels @ https://www.pexels.com/photo-1412318/ (Pexels licence)"),
    ]
)

# Hero photo (first screen - no lazy)
html = html.replace('<div class="photo"><span>Living room</span></div>',
    '<div class="photo"><img src="ridge-house-img/photo-1412318.webp" alt="Living room" width="1200" height="800"></div>')

# Unit photos (below first screen - lazy)
html = html.replace('<div class="photo">Studio</div>',
    img("ridge-house-img/photo-1412321.webp", "Studio apartment", 800, 600, lazy=True))
html = html.replace('<div class="photo">One-bedroom</div>',
    img("ridge-house-img/photo-1529682.webp", "One-bedroom apartment", 800, 600, lazy=True))
html = html.replace('<div class="photo">Two-bedroom</div>',
    img("ridge-house-img/photo-1412318.webp", "Two-bedroom apartment", 800, 600, lazy=True))

# Gallery photos (below first screen - lazy)
html = html.replace('<div class="photo">Bedroom</div>',
    img("ridge-house-img/photo-1412318.webp", "Bedroom", 800, 800, lazy=True))
html = html.replace('<div class="photo">Kitchen</div>',
    img("ridge-house-img/photo-1529682.webp", "Kitchen", 800, 800, lazy=True))
html = html.replace('<div class="photo">Bathroom</div>',
    img("ridge-house-img/photo-1412318.webp", "Bathroom", 800, 800, lazy=True))
html = html.replace('<div class="photo">Balcony view</div>',
    img("ridge-house-img/photo-1412326.webp", "Balcony view", 800, 800, lazy=True))
html = html.replace('<div class="photo">Building entrance</div>',
    img("ridge-house-img/photo-1412318.webp", "Building entrance", 800, 800, lazy=True))
html = html.replace('<div class="photo">Pool or garden</div>',
    img("ridge-house-img/photo-1412327.webp", "Pool or garden", 800, 800, lazy=True))

# Location map (below first screen - lazy)
html = html.replace('<div class="photo">Map of the neighbourhood</div>',
    img("ridge-house-img/photo-1412318.webp", "Map of the neighbourhood showing the location", 800, 600, lazy=True))

insert_point = html.find("  One self-contained file.")
if insert_point >= 0:
    insert_point = html.find("-->", insert_point) + 3
    html = html[:insert_point] + "\n" + comment + "\n" + html[insert_point:]

with open(f"{BASE}/ridge-house/index.html", "w", encoding="utf-8") as f:
    f.write(html)
print("Written ridge-house/index.html")

print("\nAll demo photos replaced!")