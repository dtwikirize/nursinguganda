import os
import time
import hashlib
import mimetypes
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse, urldefrag

BASE_URL = "https://nursesrevisionuganda.com/"
DOMAIN = "nursesrevisionuganda.com"

OUTPUT_DIR = "Nurses_Revision_Full"
ASSETS_DIR = os.path.join(OUTPUT_DIR, "assets")

MAX_PAGES = 10000   # increase later if needed
DELAY = 1          # polite delay between pages

os.makedirs(OUTPUT_DIR, exist_ok=True)
os.makedirs(ASSETS_DIR, exist_ok=True)

visited_pages = set()
queued_pages = [BASE_URL]
downloaded_assets = {}

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
}

def normalize_url(url):
    url, _ = urldefrag(url)
    parsed = urlparse(url)
    return parsed.scheme + "://" + parsed.netloc + parsed.path

def is_same_domain(url):
    parsed = urlparse(url)
    return parsed.netloc == DOMAIN or parsed.netloc.endswith("." + DOMAIN)

def is_html_page(url):
    path = urlparse(url).path.lower()
    bad_ext = (
        ".jpg", ".jpeg", ".png", ".gif", ".svg", ".webp", ".ico",
        ".css", ".js", ".pdf", ".zip", ".mp4", ".mp3", ".woff",
        ".woff2", ".ttf", ".eot"
    )
    return not path.endswith(bad_ext)

def page_filename(url):
    parsed = urlparse(url)
    path = parsed.path.strip("/")

    if path == "":
        return "index.html"

    if path.endswith("/"):
        path += "index"

    filename = path.replace("/", "_")

    if not filename.endswith(".html"):
        filename += ".html"

    return filename

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
        local_path = os.path.join(ASSETS_DIR, filename)

        # avoid overwriting same filenames from different folders
        if os.path.exists(local_path):
            base, ext = os.path.splitext(filename)
            filename = base + "_" + hashlib.md5(url.encode()).hexdigest()[:8] + ext
            local_path = os.path.join(ASSETS_DIR, filename)

        with open(local_path, "wb") as f:
            f.write(r.content)

        local_ref = "assets/" + filename
        downloaded_assets[url] = local_ref
        print("  Asset:", filename)
        return local_ref

    except Exception as e:
        print("  Asset failed:", url, e)
        return url

def fix_assets(soup, current_url):
    asset_tags = [
        ("img", "src"),
        ("script", "src"),
        ("link", "href"),
        ("source", "src"),
        ("video", "src"),
        ("audio", "src"),
    ]

    for tag_name, attr in asset_tags:
        for tag in soup.find_all(tag_name):
            link = tag.get(attr)
            if not link:
                continue

            full_url = urljoin(current_url, link)
            parsed = urlparse(full_url)

            if parsed.scheme not in ["http", "https"]:
                continue

            if is_same_domain(full_url) or tag_name in ["img", "link", "script", "source"]:
                local_ref = download_asset(full_url)
                tag[attr] = local_ref

def fix_links_and_queue(soup, current_url):
    for a in soup.find_all("a", href=True):
        full_url = urljoin(current_url, a["href"])
        clean_url = normalize_url(full_url)

        parsed = urlparse(clean_url)

        if parsed.scheme not in ["http", "https"]:
            continue

        if is_same_domain(clean_url) and is_html_page(clean_url):
            a["href"] = page_filename(clean_url)

            if clean_url not in visited_pages and clean_url not in queued_pages:
                queued_pages.append(clean_url)

def clone_site():
    while queued_pages and len(visited_pages) < MAX_PAGES:
        url = queued_pages.pop(0)

        if url in visited_pages:
            continue

        print("\nPage:", url)

        try:
            r = requests.get(url, headers=headers, timeout=25)
            if r.status_code != 200:
                print("Failed:", r.status_code)
                continue
        except Exception as e:
            print("Failed:", e)
            continue

        visited_pages.add(url)

        soup = BeautifulSoup(r.text, "lxml")

        fix_assets(soup, url)
        fix_links_and_queue(soup, url)

        filename = page_filename(url)
        filepath = os.path.join(OUTPUT_DIR, filename)

        with open(filepath, "w", encoding="utf-8") as f:
            f.write(str(soup))

        print("Saved:", filename)
        print("Queued:", len(queued_pages))
        print("Total pages:", len(visited_pages))

        time.sleep(DELAY)

    print("\nDONE")
    print("Pages saved:", len(visited_pages))
    print("Assets saved:", len(downloaded_assets))
    print("Folder:", os.path.abspath(OUTPUT_DIR))

clone_site()