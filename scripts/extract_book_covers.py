#!/usr/bin/env python3
"""
Renders Page 1 of each imported Free Book PDF into assets/images/book-covers/<slug>.webp
and updates coverImage in assets/data/ebooks.json so every book has its own unique cover.
"""
import io
import json
import re
from pathlib import Path
import fitz
from PIL import Image

AUDIT_PATH = Path(r"C:\Users\USER\.gemini\antigravity\brain\aa4ea4c4-4fd7-4c21-b28f-b2522a3e5312\scratch\infobooks_audit.json")
EBOOKS_PATH = Path("assets/data/ebooks.json")
COVER_DIR = Path("assets/images/book-covers")


def slugify(text: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")[:72]


def main():
    COVER_DIR.mkdir(parents=True, exist_ok=True)
    audit = json.loads(AUDIT_PATH.read_text(encoding="utf-8"))
    ebooks_doc = json.loads(EBOOKS_PATH.read_text(encoding="utf-8"))

    # Map book slug -> PDF path
    slug_to_pdf = {}
    for rec in audit.get("records", []):
        if rec["status"] != "KEEP":
            continue
        slug = f"book-{slugify(rec['title'])}"
        slug_to_pdf[slug] = Path(rec["path"])

    rendered = 0
    for eb in ebooks_doc.get("ebooks", []):
        if not eb.get("importedFromInfoBooks"):
            continue
        pdf_path = slug_to_pdf.get(eb["slug"])
        if not pdf_path or not pdf_path.exists():
            continue
        try:
            doc = fitz.open(str(pdf_path))
            page = doc[0]
            # Target ~360px width for crisp fast-loading WebP covers
            zoom = 360.0 / max(1.0, page.rect.width)
            pix = page.get_pixmap(matrix=fitz.Matrix(zoom, zoom), alpha=False)
            pil = Image.open(io.BytesIO(pix.tobytes("png"))).convert("RGB")
            out_path = COVER_DIR / f"{eb['slug']}.webp"
            pil.save(out_path, "WEBP", quality=82)
            eb["coverImage"] = f"/assets/images/book-covers/{eb['slug']}.webp"
            rendered += 1
        except Exception as exc:
            print(f"ERROR rendering cover for {eb['slug']}: {exc}")

    EBOOKS_PATH.write_text(json.dumps(ebooks_doc, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"Rendered {rendered} unique PDF covers into {COVER_DIR}")


if __name__ == "__main__":
    main()
