#!/usr/bin/env python3
"""Download a missing studio bridal photo and save as WebP."""
import os
from PIL import Image
import requests

BASE = "/workspaces/Fitaa3.0/public/demo"
out = f"{BASE}/studio-img/photo-1519681393784-d120267933ba.webp"

url = f"https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&auto=format&fit=crop"
r = requests.get(url, timeout=15)
if r.status_code != 200:
    print(f"FAIL: HTTP {r.status_code}")
    raise SystemExit(1)

with open("/tmp/bridal.jpg", "wb") as f:
    f.write(r.content)

with Image.open("/tmp/bridal.jpg") as img:
    img.thumbnail((1200, 800), Image.LANCZOS)
    img.save(out, "WEBP", quality=80)
    print(f"OK: {out} = {os.path.getsize(out)//1024} KB")

os.remove("/tmp/bridal.jpg")
