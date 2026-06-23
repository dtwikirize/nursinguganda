import os
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse

BASE_DIR = "Nurses_Revision_Full"
ASSETS_DIR = os.path.join(BASE_DIR, "assets")

os.makedirs(ASSETS_DIR, exist_ok=True)

headers = {
    "User-Agent": "Mozilla/5.0"
}

def download_image(url):
    try:
        response = requests.get(url, headers=headers, timeout=10)
        if response.status_code == 200:
            filename = os.path.basename(urlparse(url).path)

            if filename == "":
                return

            filepath = os.path.join(ASSETS_DIR, filename)

            if not os.path.exists(filepath):
                with open(filepath, "wb") as f:
                    f.write(response.content)
                print("Downloaded:", filename)
    except:
        pass

# 🔹 Scan all HTML files
for file in os.listdir(BASE_DIR):
    if file.endswith(".html"):
        filepath = os.path.join(BASE_DIR, file)

        with open(filepath, "r", encoding="utf-8") as f:
            soup = BeautifulSoup(f, "lxml")

        # 🔹 Check both src and data-src (lazy load fix)
        for img in soup.find_all("img"):
            src = img.get("src") or img.get("data-src")

            if src and not src.startswith("assets/"):
                full_url = urljoin("https://nursesrevisionuganda.com/", src)
                download_image(full_url)

print("Done fixing images ✅")