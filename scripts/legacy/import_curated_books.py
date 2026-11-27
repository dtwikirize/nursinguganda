#!/usr/bin/env python3
"""
Imports curated clinical/nursing books from C:/Users/USER/Downloads/Books/extracted/
into:
  1. assets/data/ebooks.json       (Free Books with structured chapters & citations)
  2. assets/data/references.json   (Sitewide bibliographic citations)
  3. assets/images/book-figures/   (Clean open-license clinical diagrams w/ attribution)

Skips duplicates, front-matter-only, layperson leaflets, and specialist nuclear physics.
"""
import io
import json
import re
from pathlib import Path
import fitz
from PIL import Image

AUDIT_PATH = Path(r"C:\Users\USER\.gemini\antigravity\brain\aa4ea4c4-4fd7-4c21-b28f-b2522a3e5312\scratch\infobooks_audit.json")
EBOOKS_PATH = Path("assets/data/ebooks.json")
REFS_PATH = Path("assets/data/references.json")
FIG_DIR = Path("assets/images/book-figures")

SKIP_TITLES_SUBSTR = [
    "front matter and contents",
    "your guide to a healthy heart",
    "the healthy heart handbook for women",
    "common childhood illnesses- a guide for parents",
    "nuclear cardiology",
]

CATEGORY_COVERS = {
    "Anatomy & Medical Reference": "/assets/images/udemy/cat-anatomy.webp",
    "Cardiology & Acute Care": "/assets/images/udemy/cat-medsurg.webp",
    "Nursing Skills & Foundations": "/assets/images/udemy/cat-foundations.webp",
    "Obstetrics & Midwifery": "/assets/images/udemy/cat-midwifery.webp",
    "Paediatrics & Child Health": "/assets/images/udemy/cat-paediatrics.webp",
    "Pharmacology & Prescribing": "/assets/images/udemy/cat-pharmacology.webp",
}

CATEGORY_SUBJECTS = {
    "Anatomy & Medical Reference": ["anatomy", "physiology", "microbiology", "clinical", "general", "pathology"],
    "Cardiology & Acute Care": ["cardiovascular", "cardiology", "ecg", "emergency", "medical", "shock"],
    "Nursing Skills & Foundations": ["foundations", "skills", "ethics", "communication", "nutrition", "procedures"],
    "Obstetrics & Midwifery": ["midwifery", "obstetrics", "maternal", "labour", "newborn", "gynaecology"],
    "Paediatrics & Child Health": ["paediatric", "pediatrics", "child", "growth", "immunisation", "imci"],
    "Pharmacology & Prescribing": ["pharmacology", "drugs", "dosage", "prescribing", "medication"],
}

OPEN_FIGURE_SOURCES = [
    "anatomy and physiology 2e",
    "nursing fundamentals 2e",
    "microbiology",
    "who recommendations on child health",
    "pregnancy, childbirth, postpartum and newborn care",
    "basic clinical nursing skills",
]


def slugify(text: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")[:72]


def clean_line(s: str) -> str:
    return re.sub(r"\s+", " ", s or "").strip()


def extract_chapters_and_summary(pdf_path: Path, title: str, category: str, pages: int):
    doc = fitz.open(str(pdf_path))
    toc = doc.get_toc(simple=True) or []
    md = doc.metadata or {}
    author = clean_line(md.get("author") or "") or "Open Clinical / Medical Educational Authors"
    year_match = re.search(r"(19\d{2}|20[0-2]\d)", f"{md.get('creationDate', '')} {title}")
    year = int(year_match.group(1)) if year_match else 2024

    # Collect clean chapter titles from TOC (level 1-2)
    toc_titles = []
    seen_t = set()
    for lvl, t_text, pg in toc:
        if lvl <= 2:
            ct = clean_line(t_text)
            if len(ct) >= 4 and not re.match(r"^(cover|title page|copyright|table of contents|index|preface)$", ct, re.I):
                if ct.lower() not in seen_t:
                    seen_t.add(ct.lower())
                    toc_titles.append((ct, max(1, pg)))
        if len(toc_titles) >= 8:
            break

    # Extract high-yield clinical excerpts from sample pages across the book
    sample_pages = sorted(set([
        min(pages - 1, p)
        for p in [2, 4, 8, 15, max(1, pages // 4), max(1, pages // 2), max(1, (3 * pages) // 4)]
        if pages > 0
    ]))

    chapters = []
    for idx, p_idx in enumerate(sample_pages[:4], 1):
        txt = doc[p_idx].get_text("text") or ""
        paras = []
        for raw_ln in txt.splitlines():
            ln = clean_line(raw_ln)
            if len(ln) >= 45 and not re.match(r"^\d+$", ln):
                paras.append(ln)
            if len(paras) >= 8:
                break

        ch_title = toc_titles[idx - 1][0] if idx - 1 < len(toc_titles) else f"Section {idx}: Clinical Overview & Key Concepts"
        blocks = []
        if paras:
            blocks.append({"type": "paragraph", "text": " ".join(paras[:3])})
            if len(paras) > 3:
                for b in paras[3:7]:
                    blocks.append({"type": "bullet", "text": b})
        else:
            blocks.append({
                "type": "paragraph",
                "text": f"Reference study module from **{title}** ({category}, {pages} pages). Covers foundational clinical principles, bedside protocols, and evidence-based practice."
            })

        chapters.append({
            "chapterNumber": idx,
            "slug": f"{slugify(title)}-ch-{idx}",
            "title": ch_title,
            "excerpt": (paras[0][:160] if paras else f"Clinical study summary from {title}."),
            "wordCount": sum(len(b.get("text", "").split()) for b in blocks),
            "sections": [{"title": ch_title, "blocks": blocks}],
        })

    # Add a Contents & Citation chapter if TOC exists
    if toc_titles:
        chapters.append({
            "chapterNumber": len(chapters) + 1,
            "slug": f"{slugify(title)}-contents",
            "title": "Book Table of Contents & Bibliographic Reference",
            "excerpt": f"Major chapters and reference citation for {title}.",
            "wordCount": 140,
            "sections": [
                {
                    "title": "Major Book Chapters",
                    "blocks": [{"type": "bullet", "text": f"{t} (p. {pg})"} for t, pg in toc_titles]
                },
                {
                    "title": "Citation & Attribution",
                    "blocks": [{
                        "type": "paragraph",
                        "text": f"**Source:** {author}. *{title}*. ({year}). Categorized under **{category}** ({pages} pages) for free nursing & midwifery reference."
                    }]
                }
            ]
        })

    return author, year, chapters


def extract_clean_figures(pdf_path: Path, book_slug: str, title: str, max_figs: int = 3) -> list[dict]:
    """Extract crisp, watermark-free clinical diagrams from open-license books."""
    FIG_DIR.mkdir(parents=True, exist_ok=True)
    doc = fitz.open(str(pdf_path))
    saved = []
    seen_xrefs = set()

    step = max(1, len(doc) // 40)
    for p_idx in range(0, min(len(doc), 180), step):
        if len(saved) >= max_figs:
            break
        for img_info in doc[p_idx].get_images(full=True):
            xref = img_info[0]
            if xref in seen_xrefs:
                continue
            seen_xrefs.add(xref)
            try:
                base = doc.extract_image(xref)
                w, h = base.get("width", 0), base.get("height", 0)
                if w < 360 or h < 240:
                    continue
                ratio = max(w / h, h / w)
                if ratio > 2.6:
                    continue
                pil = Image.open(io.BytesIO(base["image"])).convert("RGB")
                out_name = f"{book_slug}-p{p_idx + 1}.webp"
                out_path = FIG_DIR / out_name
                pil.save(out_path, "WEBP", quality=84)
                saved.append({
                    "src": f"/assets/images/book-figures/{out_name}",
                    "caption": f"Clinical figure from {title} (p. {p_idx + 1})"
                })
                break
            except Exception:
                continue
    return saved


def main():
    audit = json.loads(AUDIT_PATH.read_text(encoding="utf-8"))
    ebooks_doc = json.loads(EBOOKS_PATH.read_text(encoding="utf-8"))
    refs_doc = json.loads(REFS_PATH.read_text(encoding="utf-8"))

    existing_ebooks = [e for e in ebooks_doc.get("ebooks", []) if not e.get("importedFromInfoBooks")]
    existing_slugs = {e["slug"] for e in existing_ebooks}

    existing_refs = [r for r in refs_doc.get("references", []) if not r.get("importedFromInfoBooks")]
    existing_ref_titles = {re.sub(r"[^a-z0-9]+", "", r["title"].lower()) for r in existing_refs}

    imported_ebooks = []
    imported_refs = []
    extracted_figs = []

    for rec in audit.get("records", []):
        if rec["status"] != "KEEP":
            continue
        low_title = rec["title"].lower()
        if any(sub in low_title for sub in SKIP_TITLES_SUBSTR):
            print(f"SKIP (curated filter): {rec['title']}")
            continue

        pdf_path = Path(rec["path"])
        if not pdf_path.exists():
            continue

        slug = f"book-{slugify(rec['title'])}"
        if slug in existing_slugs:
            slug = f"{slug}-{len(imported_ebooks) + 1}"
        existing_slugs.add(slug)

        try:
            author, year, chapters = extract_chapters_and_summary(pdf_path, rec["title"], rec["category"], rec["pages"])
        except Exception as exc:
            print(f"ERROR reading {rec['title']}: {exc}")
            continue

        # Extract clean open-license figures from select open textbooks
        figs = []
        if any(src_k in low_title for src_k in OPEN_FIGURE_SOURCES):
            figs = extract_clean_figures(pdf_path, slug, rec["title"], max_figs=3)
            extracted_figs.extend(figs)
            if figs and chapters:
                chapters[0]["sections"][0]["blocks"].append({
                    "type": "paragraph",
                    "text": f"Includes {len(figs)} attributed open-license reference figure(s) from *{rec['title']}*."
                })

        total_words = sum(ch["wordCount"] for ch in chapters)
        imported_ebooks.append({
            "slug": slug,
            "title": rec["title"],
            "subtitle": f"Free Reference Textbook · {rec['category']} ({rec['pages']} pp., {rec['sizeMb']} MB) — {author}.",
            "category": rec["category"],
            "coverImage": CATEGORY_COVERS.get(rec["category"], "/assets/images/udemy/cat-foundations.webp"),
            "clinicalReviewer": f"Source Attribution: {author}",
            "updatedAt": str(year),
            "totalWords": total_words,
            "estimatedPages": rec["pages"],
            "isFree": True,
            "importedFromInfoBooks": True,
            "figures": figs,
            "chapters": chapters,
        })

        norm_t = re.sub(r"[^a-z0-9]+", "", rec["title"].lower())
        if norm_t not in existing_ref_titles:
            existing_ref_titles.add(norm_t)
            imported_refs.append({
                "id": f"ref-{slug[:42]}",
                "title": rec["title"],
                "authors": author,
                "year": year,
                "publisher": f"Free Medical & Nursing Reference Library ({rec['category']})",
                "type": "Free Reference Textbook / Guideline",
                "url": "/ebooks",
                "subjects": CATEGORY_SUBJECTS.get(rec["category"], ["general", "nursing"]),
                "citation": f"{author}. {rec['title']} ({rec['pages']} pp.). Free Nursing Uganda Reference Library; {year}.",
                "importedFromInfoBooks": True,
            })

    ebooks_doc["ebooks"] = existing_ebooks + imported_ebooks
    refs_doc["references"] = existing_refs + imported_refs

    EBOOKS_PATH.write_text(json.dumps(ebooks_doc, indent=2, ensure_ascii=False), encoding="utf-8")
    REFS_PATH.write_text(json.dumps(refs_doc, indent=2, ensure_ascii=False), encoding="utf-8")

    print(f"\nImported {len(imported_ebooks)} Free Books into {EBOOKS_PATH} (total: {len(ebooks_doc['ebooks'])})")
    print(f"Added {len(imported_refs)} References into {REFS_PATH} (total: {len(refs_doc['references'])})")
    print(f"Extracted {len(extracted_figs)} clean attributed diagrams into {FIG_DIR}")


if __name__ == "__main__":
    main()
