#!/usr/bin/env python3
"""
Extracts and deduplicates non-video lecture notes, outlines, and quizzes from
F:/NCLEX PREP COURSE into a clean intermediate JSON for the 16-Unit NCLEX-RN
Preparation Course. Strips tutor names/emails/branding.
"""
import json
import os
import re
from pathlib import Path
from docx import Document
from pptx import Presentation
import fitz  # PyMuPDF

SRC_ROOT = Path(r"F:\NCLEX PREP COURSE")
OUT_PATH = Path(r"C:\Users\USER\.gemini\antigravity\brain\aa4ea4c4-4fd7-4c21-b28f-b2522a3e5312\scratch\nclex_raw_extracted.json")

SKIP_PDF_KEYWORDS = [
    "kaplan-nclex-rn premier",
    "prioritization, delegation, and assignment - practice exercises",
    "featured course images",
    "background.pptx",
    "banner.pptx",
    "course materials.pptx",
]

TUTOR_PATTERNS = [
    re.compile(r"\b(agnes|tutor|instructor|facilitator|zoom\s+id|passcode|whatsapp|@gmail\.com)\b.*", re.I),
    re.compile(r"\+?\d{3}[\s-]?\d{3}[\s-]?\d{6}"),
]


def clean_line(text: str) -> str:
    t = re.sub(r"\s+", " ", text or "").strip()
    if not t:
        return ""
    for pat in TUTOR_PATTERNS:
        if pat.search(t) and len(t) < 160:
            return ""
    return t


def extract_pptx(path: Path):
    prs = Presentation(str(path))
    slides = []
    for idx, slide in enumerate(prs.slides, 1):
        lines = []
        for shape in slide.shapes:
            if shape.has_text_frame:
                for p in shape.text_frame.paragraphs:
                    c = clean_line(p.text)
                    if c:
                        lines.append(c)
            if shape.has_table:
                for row in shape.table.rows:
                    cells = [clean_line(cell.text) for cell in row.cells]
                    if any(cells):
                        lines.append(" | ".join(cells))
        if lines:
            slides.append({"slide": idx, "lines": lines})
    return slides


def extract_docx(path: Path):
    doc = Document(str(path))
    blocks = []
    for p in doc.paragraphs:
        c = clean_line(p.text)
        if c:
            blocks.append(c)
    for tbl in doc.tables:
        for row in tbl.rows:
            cells = [clean_line(cell.text) for cell in row.cells]
            if any(cells):
                blocks.append(" | ".join(cells))
    return blocks


def extract_pdf(path: Path, max_pages=60):
    doc = fitz.open(str(path))
    pages = []
    for i, page in enumerate(doc):
        if i >= max_pages:
            break
        txt = page.get_text("text") or ""
        lines = [clean_line(ln) for ln in txt.splitlines()]
        lines = [ln for ln in lines if ln]
        if lines:
            pages.append({"page": i + 1, "lines": lines})
    return pages


def get_week_label(path: Path) -> str:
    rel = path.relative_to(SRC_ROOT)
    parts = rel.parts
    if len(parts) > 1:
        return parts[0]
    return "ROOT"


def main():
    all_files = []
    for p in sorted(SRC_ROOT.rglob("*")):
        if not p.is_file():
            continue
        ext = p.suffix.lower()
        if ext not in {".pptx", ".docx", ".pdf"}:
            continue
        low = p.name.lower()
        if any(skip in low for skip in SKIP_PDF_KEYWORDS):
            continue
        all_files.append(p)

    # Deduplicate same-stem files in the same folder (.pptx/.docx preferred over .pdf)
    ext_rank = {".docx": 1, ".pptx": 2, ".pdf": 3}
    dedup = {}
    for p in all_files:
        stem_key = (str(p.parent).lower(), re.sub(r"[_-]agnes$", "", p.stem.lower()).strip())
        if stem_key not in dedup or ext_rank[p.suffix.lower()] < ext_rank[dedup[stem_key].suffix.lower()]:
            dedup[stem_key] = p

    items = []
    for p in sorted(dedup.values(), key=lambda x: str(x)):
        week = get_week_label(p)
        ext = p.suffix.lower()
        try:
            if ext == ".pptx":
                content = extract_pptx(p)
                word_count = sum(len(" ".join(s["lines"]).split()) for s in content)
            elif ext == ".docx":
                content = extract_docx(p)
                word_count = sum(len(ln.split()) for ln in content)
            else:
                content = extract_pdf(p)
                word_count = sum(len(" ".join(pg["lines"]).split()) for pg in content)
            items.append({
                "week": week,
                "relPath": str(p.relative_to(SRC_ROOT)),
                "name": p.name,
                "ext": ext,
                "wordCount": word_count,
                "content": content,
            })
            print(f"[{week}] {p.name} ({ext}) -> {word_count} words")
        except Exception as exc:
            print(f"ERROR [{week}] {p.name}: {exc}")

    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUT_PATH.write_text(json.dumps({"totalFiles": len(items), "files": items}, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"\nSaved {len(items)} deduplicated files to {OUT_PATH}")


if __name__ == "__main__":
    main()
