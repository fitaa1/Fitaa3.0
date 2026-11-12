#!/usr/bin/env python3
"""Download demo photos from Pexels and Unsplash into public/demo/<demo>-img/, as WebP."""
import os, sys
from PIL import Image
import requests

BASE = "/workspaces/Fitaa3.0/public/demo"
DEMOS = ["studio", "aesthetics", "clinic", "car-rental", "restaurant", "photographer", "ridge-house"]

def save_pexels(pid, demo, filename=None):
    filename = filename or f"/{BASE}/{demo}-img/photo-{pid}.webp"
    if os.path.exists(filename):
        print(f"  - exists, skip: {demo}/photo-{pid}.webp")
        return True
    url = f"https://images.pexels.com/photos/{pid}/pexels-photo-{pid}.jpeg?w=1200&h=800&fit=crop&auto=compress"
    r = requests.get(url, timeout=15)
    if r.status_code != 200:
        print(f"  - fail {demo}/photo-{pid}: HTTP {r.status_code}")
        return False
    with open(f"/tmp/pexels-{pid}.jpg", "wb") as f:
        f.write(r.content)
    with Image.open(f"/tmp/pexels-{pid}.jpg") as img:
        img.thumbnail((1200, 800), Image.LANCZOS)
        img.save(filename, "WEBP", quality=85)
    os.remove(f"/tmp/pexels-{pid}.jpg")
    print(f"  - ok: {demo}/photo-{pid}.webp")
    return True

def save_unsplash(uid, demo, filename=None):
    filename = filename or f"/{BASE}/{demo}-img/{uid}.webp"
    if os.path.exists(filename):
        print(f"  - exists, skip: {demo}/{uid}.webp")
        return True
    url = f"https://images.unsplash.com/{uid}?w=1200&auto=format&fit=crop"
    r = requests.get(url, timeout=15)
    if r.status_code != 200:
        print(f"  - fail {demo}/{uid}: HTTP {r.status_code}")
        return False
    with open(f"/tmp/{uid}.jpg", "wb") as f:
        f.write(r.content)
    with Image.open(f"/tmp/{uid}.jpg") as img:
        img.thumbnail((1200, 800), Image.LANCZOS)
        img.save(filename, "WEBP", quality=85)
    os.remove(f"/tmp/{uid}.jpg")
    print(f"  - ok: {demo}/{uid}.webp")
    return True

if __name__ == "__main__":
    print("Saving working Pexels photos into demo folders...")
    mapping = {
        "studio": ["1412312", "1412322", "1412323", "1412324", "1412325"],
        "aesthetics": ["1412313", "1412326", "1412327", "1412328", "1412329"],
        "clinic": ["1412314", "1412319", "1412330", "1412331", "1412332"],
        "car-rental": ["1412315", "1412333", "1412334", "1412336", "1412340"],
        "restaurant": ["1412316", "1412345", "1412350", "1412351", "1412352"],
        "photographer": ["1412317", "1412353", "1412354", "1412330", "1412331"],
        "ridge-house": ["1412318", "1529682", "1412321", "1412326", "1412327"],
    }
    for demo, ids in mapping.items():
        for pid in ids:
            save_pexels(pid, demo)
    print("\nSaving working Unsplash photos...")
    save_unsplash("photo-1515378791036-0648a3ef77b2", "studio")
    save_unsplash("photo-1519681393784-d120267933ba", "aesthetics")
