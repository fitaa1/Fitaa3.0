"""Copy hotlinked photos on the preview pages into the site, so a lead's preview never
shows a broken image when Airbnb or Trip.com change or block their links.

Run from the repo root:  python3 scripts/localise-preview-images.py
For each page below it downloads every photo from the listed hosts into
public/preview/<page>-img/photo-NN.<ext> and points the page at the local copy.
A photo that fails to download is left as it was and reported.
"""
import pathlib, re, sys, urllib.request

PAGES = ["kass", "masterpiece"]
HOSTS = r"(?:ak-d\.tripcdn\.com|a0\.muscache\.com)"
URL = re.compile(r"https://" + HOSTS + r"""[^"'\s)]+""")
ROOT = pathlib.Path("public/preview")
failed = 0

for page in PAGES:
    html_path = ROOT / f"{page}.html"
    html = html_path.read_text(encoding="utf-8")
    urls = list(dict.fromkeys(URL.findall(html)))  # unique, in page order
    folder = ROOT / f"{page}-img"
    folder.mkdir(exist_ok=True)
    print(f"{page}: {len(urls)} photos")
    for n, url in enumerate(urls, 1):
        ext = ".webp" if ".webp" in url.split("?")[0] else ".jpg"
        name = f"photo-{n:02d}{ext}"
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
            data = urllib.request.urlopen(req, timeout=30).read()
            if len(data) < 2000:
                raise ValueError(f"only {len(data)} bytes")
            (folder / name).write_bytes(data)
            html = html.replace(url, f"/preview/{page}-img/{name}")
            print(f"  ok   {name}  {len(data)//1024} KB")
        except Exception as e:  # keep the remote link if the copy fails
            failed += 1
            print(f"  FAIL {url}  ({e})")
    html_path.write_text(html, encoding="utf-8")

left = sum(len(URL.findall((ROOT / f"{p}.html").read_text(encoding="utf-8"))) for p in PAGES)
print(f"remote photo links left: {left}, failed downloads: {failed}")
sys.exit(1 if failed else 0)
