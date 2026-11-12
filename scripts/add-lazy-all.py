#!/usr/bin/env python3
"""Add loading="lazy" to ALL img tags in demo pages (safe: browser skips near-top images)."""
import re, glob

BASE = "/workspaces/Fitaa3.0/public/demo"
demo_files = glob.glob(f"{BASE}/*/index.html")

for df in demo_files:
    with open(df, "r", encoding="utf-8") as f:
        html = f.read()

    # Add loading="lazy" to every img tag that doesn't already have it
    def add_lazy(match):
        tag = match.group(0)
        if 'loading=' in tag:
            return tag
        # Insert loading="lazy" before the closing >
        return tag[:-1] + ' loading="lazy">'

    new_html = re.sub(r'<img[^>]+>', add_lazy, html)

    if new_html != html:
        with open(df, "w", encoding="utf-8") as f:
            f.write(new_html)
        print(f"Added lazy to {df}")
    else:
        print(f"No changes: {df}")

print("Done")