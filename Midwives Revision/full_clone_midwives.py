import os
import time
import hashlib
import mimetypes
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse, urldefrag

BASE_URL = "https://midwivesrevisionuganda.com/"
DOMAIN = "midwivesrevisionuganda.com"

OUTPUT_DIR = "Midwives_Revision_Full"
ASSETS_DIR = os.path.join(OUTPUT_DIR, "assets")

MAX_PAGES = 1500
DELAY = 1

os.makedirs(OUTPUT_DIR, exist_ok=True)
os.makedirs(ASSETS_DIR, exist_ok=True)

visited_pages = set()
queued_pages = [BASE_URL]
downloaded_assets = {}

headers = {
    "User-Agent": "Mozilla/5.0"
}

def normalize_url(url):
    url, _ = urldefrag(url)
    parsed = urlparse(url)
    return parsed.scheme + "://" + parsed.netloc + parsed.path

def is_same_domain(url):
    parsed = urlparse(url)
    return DOMAIN in parsed.netloc

def is_html_page(url):
    path = urlparse(url).path.lower()
    return not any(path.endswith(ext) for ext in [
        ".jpg",".jpeg",".png",".gif",".svg",".webp",".ico",
        ".css",".js",".pdf",".zip",".mp4",".mp3",".woff",
        ".woff2",".ttf",".eot"
    ])

def page_filename(url):
    parsed = urlparse(url)
    path = parsed.path.strip("/")

    if path == "":
        return "index.html"

    if path.endswith("/"):
        path += "index"

    name = path.replace("/", "_")

    if not name.endswith(".html"):
        name += ".html"

    return name

def asset_filename(url, content_type=""):
    parsed = urlparse(url)
    name = os.path.basename(parsed.path)

    if not name or "." not in name:
        ext = mimetypes.guess_extension(content_type.split(";")[0].strip()) or ".bin"
        name = hashlib.md5(url.encode()).hexdigest() + ext

    return name

def download_asset(url):
    if url in downloaded_assets:
        return downloaded_assets[url]

    try:
        r = requests.get(url, headers=headers, timeout=20)
        if r.status_code != 200:
            return url

        content_type = r.headers.get("Content-Type", "")
        filename = asset_filename(url, content_type)
        filepath = os.path.join(ASSETS_DIR, filename)

        if os.path.exists(filepath):
            base, ext = os.path.splitext(filename)
            filename = base + "_" + hashlib.md5(url.encode()).hexdigest()[:6] + ext
            filepath = os.path.join(ASSETS_DIR, filename)

        with open(filepath, "wb") as f:
            f.write(r.content)

        local_ref = "assets/" + filename
        downloaded_assets[url] = local_ref
        print("  Asset:", filename)
        return local_ref

    except:
        return url

def fix_assets(soup, current_url):
    for tag in soup.find_all(["img","script","link","source","video","audio"]):
        attr = "src" if tag.name in ["img","script","source","video","audio"] else "href"

        link = tag.get(attr) or tag.get("data-src")

        if not link:
            continue

        full_url = urljoin(current_url, link)

        if full_url.startswith("http"):
            local = download_asset(full_url)
            tag[attr] = local

def fix_links(soup, current_url):
    for a in soup.find_all("a", href=True):
        full = urljoin(current_url, a["href"])
        clean = normalize_url(full)

        if is_same_domain(clean) and is_html_page(clean):
            a["href"] = page_filename(clean)

            if clean not in visited_pages and clean not in queued_pages:
                queued_pages.append(clean)

def clone():
    while queued_pages and len(visited_pages) < MAX_PAGES:
        url = queued_pages.pop(0)

        if url in visited_pages:
            continue

        print("\nPage:", url)

        try:
            r = requests.get(url, headers=headers, timeout=25)
            if r.status_code != 200:
                continue
        except:
            continue

        visited_pages.add(url)

        soup = BeautifulSoup(r.text, "lxml")

        fix_assets(soup, url)
        fix_links(soup, url)

        filename = page_filename(url)
        path = os.path.join(OUTPUT_DIR, filename)

        with open(path, "w", encoding="utf-8") as f:
            f.write(str(soup))

        print("Saved:", filename)
        print("Queue:", len(queued_pages))
        print("Total:", len(visited_pages))

        time.sleep(DELAY)

    print("\nDONE")
    print("Pages:", len(visited_pages))
    print("Assets:", len(downloaded_assets))

clone()