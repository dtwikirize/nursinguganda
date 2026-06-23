import os
import time
import hashlib
import mimetypes
import re
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse, urldefrag

BASE_URL = "https://nurseslabs.com/"
DOMAIN = "nurseslabs.com"

OUTPUT_DIR = "NursesLabs_Full"
ASSETS_DIR = os.path.join(OUTPUT_DIR, "assets")

MAX_PAGES = 2000
DELAY = 1

os.makedirs(OUTPUT_DIR, exist_ok=True)
os.makedirs(ASSETS_DIR, exist_ok=True)

visited = set()
queue = [BASE_URL]
downloaded = {}

headers = {
    "User-Agent": "Mozilla/5.0"
}

def normalize(url):
    url, _ = urldefrag(url)
    p = urlparse(url)
    return f"{p.scheme}://{p.netloc}{p.path}"

def is_internal(url):
    return DOMAIN in urlparse(url).netloc

def page_filename(url):
    p = urlparse(url)
    path = p.path.strip("/")

    if path == "":
        return "index.html"

    name = path.replace("/", "_")
    if not name.endswith(".html"):
        name += ".html"

    return name

def asset_filename(url, content_type=""):
    name = os.path.basename(urlparse(url).path)

    if not name or "." not in name:
        ext = mimetypes.guess_extension(content_type.split(";")[0]) or ".bin"
        name = hashlib.md5(url.encode()).hexdigest() + ext

    return name

def download(url):
    if url in downloaded:
        return downloaded[url]

    try:
        r = requests.get(url, headers=headers, timeout=20)
        if r.status_code != 200:
            return url

        fname = asset_filename(url, r.headers.get("Content-Type", ""))
        path = os.path.join(ASSETS_DIR, fname)

        if os.path.exists(path):
            base, ext = os.path.splitext(fname)
            fname = base + "_" + hashlib.md5(url.encode()).hexdigest()[:6] + ext
            path = os.path.join(ASSETS_DIR, fname)

        with open(path, "wb") as f:
            f.write(r.content)

        local = "assets/" + fname
        downloaded[url] = local

        print("  Asset:", fname)
        return local

    except:
        return url

def fix_css(css):
    urls = re.findall(r'url\((.*?)\)', css)
    for u in urls:
        clean = u.strip('"\'')
        full = urljoin(BASE_URL, clean)
        if full.startswith("http"):
            local = download(full)
            css = css.replace(u, local)
    return css

def process_assets(soup, current_url):
    for tag in soup.find_all(["img","script","link","source","video"]):
        attr = "src" if tag.name != "link" else "href"

        link = tag.get(attr) or tag.get("data-src")

        if not link:
            continue

        full = urljoin(current_url, link)

        if full.startswith("http"):
            tag[attr] = download(full)

def process_links(soup, current_url):
    for a in soup.find_all("a", href=True):
        full = urljoin(current_url, a["href"])
        clean = normalize(full)

        if is_internal(clean):
            a["href"] = page_filename(clean)

            if clean not in visited and clean not in queue:
                queue.append(clean)

def clone():
    while queue and len(visited) < MAX_PAGES:
        url = queue.pop(0)

        if url in visited:
            continue

        print("\nPage:", url)

        try:
            r = requests.get(url, headers=headers, timeout=25)
            if r.status_code != 200:
                continue
        except:
            continue

        visited.add(url)

        soup = BeautifulSoup(r.text, "lxml")

        process_assets(soup, url)
        process_links(soup, url)

        for style in soup.find_all("style"):
            style.string = fix_css(style.text)

        fname = page_filename(url)
        path = os.path.join(OUTPUT_DIR, fname)

        with open(path, "w", encoding="utf-8") as f:
            f.write(str(soup))

        print("Saved:", fname)
        print("Queue:", len(queue))
        print("Total:", len(visited))

        time.sleep(DELAY)

    print("\nDONE ✅")
    print("Pages:", len(visited))
    print("Assets:", len(downloaded))

clone()