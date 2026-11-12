#!/usr/bin/env python3
"""Check that all demo HTML image references point to real files."""
import os, re, glob

BASE = "/workspaces/Fitaa3.0/public/demo"

demo_files = glob.glob(f"{BASE}/*/index.html")
missing = []
total = 0

for df in demo_files:
    with open(df, "r", encoding="utf-8") as f:
        html = f.read()
    # Find all img src references
    srcs = re.findall(r'src="([^"]+)"', html)
    for src in srcs:
        if src.startswith("http") or src.startswith("data:") or src.startswith("/"):
            continue
        total += 1
        # src like "studio-img/photo-1412312.webp" or "ridge-house-img/photo-1412318.webp"
        demo_dir = None
        for d in ["studio", "aesthetics", "clinic", "car-rental", "restaurant", "photographer", "ridge-house"]:
            if src.startswith(d + "-img/"):
                demo_dir = d
                break
        if not demo_dir:
            missing.append((df, src, "UNKNOWN_DIR"))
            continue
        img_path = f"{BASE}/{demo_dir}-img/{src.split('/', 1)[1]}"
        if not os.path.exists(img_path):
            missing.append((df, src, f"MISSING: {img_path}"))

print(f"Checked {len(demo_files)} demo files, {total} image refs")
if missing:
    print(f"\n{len(missing)} missing references:")
    for df, src, why in missing:
        print(f"  {df}: {src}  ->  {why}")
else:
    print("All image references OK")
