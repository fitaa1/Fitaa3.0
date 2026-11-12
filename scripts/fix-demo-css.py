#!/usr/bin/env python3
"""Fix demo pages: add max-width:100% to images, add loading="lazy" where needed."""
import re, glob

BASE = "/workspaces/Fitaa3.0/public/demo"
demo_files = glob.glob(f"{BASE}/*/index.html")

for df in demo_files:
    with open(df, "r", encoding="utf-8") as f:
        html = f.read()

    # 1. Add max-width:100% to img elements by wrapping them or adding style
    # Add a global img rule right after the :root block in the CSS
    # Find the :root block and add img rule after it
    if "img{max-width:100%}" not in html:
        # Add img rule after the :root closing brace
        html = html.replace(
            "}",
            "}\nimg{max-width:100%;height:auto}",
            1  # only first occurrence (the :root block)
        )

    # 2. Add loading="lazy" to all img tags that don't have it yet
    # But keep the first hero image eager (it's the first img in the hero section)
    # Strategy: find all img tags, add loading="lazy" to all except the first one in each page
    
    # Find all img tags
    img_tags = re.findall(r'<img[^>]+>', html)
    if not img_tags:
        continue
    
    # The first img tag in each demo is the hero image - keep it eager
    # Add loading="lazy" to all subsequent img tags
    first = True
    new_html = html
    for tag in img_tags:
        if first:
            first = False
            continue
        if 'loading="lazy"' not in tag:
            new_tag = tag.replace('class="photo"', 'class="photo" loading="lazy"')
            if new_tag == tag:
                # class="photo" not found, try other insertion point
                new_tag = tag.replace('<img ', '<img loading="lazy" ')
            new_html = new_html.replace(tag, new_tag, 1)
    
    with open(df, "w", encoding="utf-8") as f:
        f.write(new_html)
    print(f"Fixed {df}")

print("Done")