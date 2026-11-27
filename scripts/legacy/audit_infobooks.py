#!/usr/bin/env python3
"""
Unzips all 6 InfoBooks archives in C:/Users/USER/Downloads/Books into
C:/Users/USER/Downloads/Books/extracted/ and audits all 85 PDFs for
relevance, page count, language, license/attribution, and category.
"""
import glob
import json
import os
import re
import zipfile
from pathlib import Path
import fitz

ZIP_DIR = Path(r"C:\Users\USER\Downloads\Books")
EXTRACT_DIR = ZIP_DIR / "extracted"
OUT_JSON = Path(r"C:\Users\USER\.gemini\antigravity\brain\aa4ea4c4-4fd7-4c21-b28f-b2522a3e5312\scratch\infobooks_audit.json")

CATEGORY_MAP = {
    "cardiology": "Cardiology & Acute Care",
    "medical": "Anatomy & Medical Reference",
    "nursing": "Nursing Skills & Foundations",
    "obstetrics": "Obstetrics & Midwifery",
    "pediatrics": "Paediatrics & Child Health",
    "pharmacology": "Pharmacology & Prescribing",
}

NON_ENGLISH_HINTS = re.compile(r"\b(capítulo|introducción|farmacología|enfermería|pediatría|obstetricia|cardiología|salud|paciente|tratamiento|médico)\b", re.I)
LAYPERSON_HINTS = re.compile(r"\b(your guide to a healthy heart|for patients|patient brochure|coloring book|magazine)\b", re.I)


def detect_zip_cat(zip_name: str) -> str:
    low = zip_name.lower()
    for k, v in CATEGORY_MAP.items():
        if k in low:
            return v
    return "General Nursing"


def main():
    EXTRACT_DIR.mkdir(parents=True, exist_ok=True)
    records = []
    seen_stems = set()

    for zp_str in sorted(glob.glob(str(ZIP_DIR / "*.zip"))):
        zp = Path(zp_str)
        cat = detect_zip_cat(zp.name)
        cat_slug = re.sub(r"[^a-z0-9]+", "-", cat.lower()).strip("-")
        dest_dir = EXTRACT_DIR / cat_slug
        dest_dir.mkdir(parents=True, exist_ok=True)

        with zipfile.ZipFile(zp, "r") as z:
            for member in z.infolist():
                if member.is_dir() or not member.filename.lower().endswith(".pdf"):
                    continue
                fname = Path(member.filename).name
                out_pdf = dest_dir / fname
                if not out_pdf.exists():
                    with z.open(member) as src, open(out_pdf, "wb") as dst:
                        dst.write(src.read())

                size_mb = round(out_pdf.stat().st_size / (1024 * 1024), 2)
                pages = 0
                meta_title = ""
                author = ""
                sample_text = ""
                img_count_sample = 0
                err = ""
                try:
                    doc = fitz.open(str(out_pdf))
                    pages = len(doc)
                    md = doc.metadata or {}
                    meta_title = (md.get("title") or "").strip()
                    author = (md.get("author") or "").strip()
                    for pi in range(min(4, pages)):
                        sample_text += " " + (doc[pi].get_text("text") or "")
                    for pi in range(min(10, pages)):
                        img_count_sample += len(doc[pi].get_images(full=True))
                except Exception as exc:
                    err = str(exc)

                clean_title = Path(fname).stem.replace("_", " ").strip()
                stem_norm = re.sub(r"[^a-z0-9]+", "", clean_title.lower())
                is_dup = stem_norm in seen_stems
                seen_stems.add(stem_norm)

                # Relevance rules
                status = "KEEP"
                reason = "Clinical/nursing textbook or guideline"
                if err:
                    status = "SKIP"
                    reason = f"Corrupt/unreadable PDF: {err}"
                elif is_dup:
                    status = "SKIP"
                    reason = "Duplicate title across archives"
                elif pages < 12:
                    status = "SKIP"
                    reason = f"Too short ({pages} pages — pamphlet/leaflet)"
                elif len(NON_ENGLISH_HINTS.findall(sample_text[:2500])) >= 4:
                    status = "SKIP"
                    reason = "Non-English (Spanish) text"
                elif LAYPERSON_HINTS.search(clean_title) and pages < 80:
                    status = "SKIP"
                    reason = "Layperson/patient booklet"

                records.append({
                    "fileName": fname,
                    "title": clean_title,
                    "category": cat,
                    "pages": pages,
                    "sizeMb": size_mb,
                    "author": author,
                    "metaTitle": meta_title,
                    "sampleImagesFirst10Pages": img_count_sample,
                    "status": status,
                    "reason": reason,
                    "path": str(out_pdf),
                })

    keep = [r for r in records if r["status"] == "KEEP"]
    skip = [r for r in records if r["status"] == "SKIP"]

    OUT_JSON.parent.mkdir(parents=True, exist_ok=True)
    OUT_JSON.write_text(json.dumps({"total": len(records), "keepCount": len(keep), "skipCount": len(skip), "records": records}, indent=2, ensure_ascii=False), encoding="utf-8")

    print(f"Audited {len(records)} PDFs -> KEEP: {len(keep)}, SKIP: {len(skip)}\n")
    print("=== KEEP BY CATEGORY ===")
    for cat in sorted(set(r["category"] for r in keep)):
        cat_rows = [r for r in keep if r["category"] == cat]
        print(f"\n[{cat}] ({len(cat_rows)} books):")
        for r in cat_rows:
            print(f"  - {r['title']} ({r['pages']} pp, {r['sizeMb']} MB, imgs/10p={r['sampleImagesFirst10Pages']})")

    print(f"\n=== SKIPPED ({len(skip)}) ===")
    for r in skip:
        print(f"  - [{r['category']}] {r['title']} ({r['pages']} pp) -> {r['reason']}")


if __name__ == "__main__":
    main()
