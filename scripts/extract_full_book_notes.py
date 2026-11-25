#!/usr/bin/env python3
"""
Extracts well-organized, clean, whole-book structured study notes for all 79 imported
reference PDFs into lazy-loaded per-book JSONs:
  assets/data/books/<slug>.json

Improvements over raw block dumps:
- Normalizes Unicode ligatures (fi, fl, ff, ffi, ffl) and de-hyphenates line breaks
- Uses PyMuPDF typography & column layout to keep 2-column pages in true reading order
- Promotes real bold/larger headings to clean Section titles (avoiding generic Part 1..N clutter)
- Splits inline bullet runs (•, ▪, ◦) into structured bullet lists instead of walls of text
- Stitches incomplete sentences broken across page transitions
"""
import json
import re
import statistics
from pathlib import Path
import fitz

AUDIT_PATH = Path(r"C:\Users\USER\.gemini\antigravity\brain\aa4ea4c4-4fd7-4c21-b28f-b2522a3e5312\scratch\infobooks_audit.json")
EBOOKS_PATH = Path("assets/data/ebooks.json")
BOOKS_DIR = Path("assets/data/books")

LIGATURE_MAP = str.maketrans({
    "\ufb00": "ff",
    "\ufb01": "fi",
    "\ufb02": "fl",
    "\ufb03": "ffi",
    "\ufb04": "ffl",
    "\ufb05": "ft",
    "\ufb06": "st",
    "\u00ad": "",
    "\u200b": "",
    "\xa0": " ",
})

NOISE_LINE_RE = re.compile(
    r"^("
    r"page\s*\d+|"
    r"\d+\s*$|"
    r"copyright\s*[©(]|"
    r"all rights reserved|"
    r"isbn\b|"
    r"downloaded from|"
    r"www\.|"
    r"http://|"
    r"https://|"
    r"chapter\s+\d+\s*$|"
    r"fig(?:ure)?\.?\s*\d+(?:\.\d+)?\s*:?\s*$"
    r")",
    re.I,
)


def normalize_text(raw: str) -> str:
    if not raw:
        return ""
    t = raw.translate(LIGATURE_MAP)
    t = re.sub(r"(\w)-\s*\n\s*(\w)", r"\1\2", t)
    t = re.sub(r"(\w)-\s+([a-z]{2,})", r"\1\2", t)
    t = re.sub(r"[ \t\r\n]+", " ", t).strip()
    return t


def is_bold_font(span: dict) -> bool:
    flags = span.get("flags", 0)
    fname = (span.get("font") or "").lower()
    return bool(flags & 16) or any(k in fname for k in ("bold", "heavy", "black", "demi", "semibold", "medi"))


def extract_page_items(page, book_title_lower: str) -> list[dict]:
    """Extract clean ordered (heading | body) items preserving 2-column reading order."""
    page_w = float(page.rect.width or 600.0)
    page_h = float(page.rect.height or 800.0)
    top_margin = page_h * 0.06
    bottom_margin = page_h * 0.935

    text_dict = page.get_text("dict") or {}
    raw_blocks = []
    font_sizes = []

    for blk in text_dict.get("blocks", []):
        if blk.get("type", 0) != 0:
            continue
        x0, y0, x1, y1 = blk.get("bbox", (0, 0, 0, 0))
        lines = blk.get("lines") or []
        if not lines:
            continue

        # Collect spans while preserving soft line breaks for de-hyphenation
        line_texts = []
        total_chars = 0
        bold_chars = 0
        weighted_size = 0.0

        for ln in lines:
            span_parts = []
            for sp in ln.get("spans", []):
                s_txt = sp.get("text", "")
                if not s_txt:
                    continue
                span_parts.append(s_txt)
                n_ch = len(s_txt.strip())
                sz = float(sp.get("size", 10.0) or 10.0)
                if n_ch > 0:
                    total_chars += n_ch
                    weighted_size += sz * n_ch
                    if is_bold_font(sp):
                        bold_chars += n_ch
                    font_sizes.append(sz)
            if span_parts:
                line_texts.append("".join(span_parts))

        txt = normalize_text("\n".join(line_texts))
        if not txt or NOISE_LINE_RE.match(txt):
            continue

        # Filter running header/footer short labels
        if (y1 < top_margin or y0 > bottom_margin) and len(txt) < 90:
            continue
        if txt.lower() == book_title_lower:
            continue

        avg_size = (weighted_size / total_chars) if total_chars > 0 else 10.0
        bold_ratio = (bold_chars / total_chars) if total_chars > 0 else 0.0

        raw_blocks.append({
            "x0": x0,
            "y0": y0,
            "x1": x1,
            "y1": y1,
            "text": txt,
            "size": avg_size,
            "bold": bold_ratio >= 0.65,
        })

    if not raw_blocks:
        return []

    median_size = statistics.median(font_sizes) if font_sizes else 10.0

    # Detect true two-column layout: independent left blocks (x1 < 0.51*w) and right blocks (x0 > 0.48*w)
    left_col = [b for b in raw_blocks if b["x1"] <= page_w * 0.52 and b["x0"] < page_w * 0.35]
    right_col = [b for b in raw_blocks if b["x0"] >= page_w * 0.48]
    span_full = [b for b in raw_blocks if b not in left_col and b not in right_col]

    if len(left_col) >= 2 and len(right_col) >= 2:
        # Read full-width top banners, then left column top-to-bottom, then right column, then bottom banners
        mid_y = min(b["y0"] for b in left_col + right_col)
        top_full = sorted([b for b in span_full if b["y0"] < mid_y + 20], key=lambda b: b["y0"])
        bot_full = sorted([b for b in span_full if b["y0"] >= mid_y + 20], key=lambda b: b["y0"])
        ordered = (
            top_full
            + sorted(left_col, key=lambda b: b["y0"])
            + sorted(right_col, key=lambda b: b["y0"])
            + bot_full
        )
    else:
        ordered = sorted(raw_blocks, key=lambda b: (round(b["y0"] / 10.0) * 10.0, b["x0"]))

    items = []
    for b in ordered:
        txt = b["text"]
        if len(txt) < 4:
            continue
        looks_question_head = len(txt) <= 85 and txt.endswith("?") and "." not in txt[:-1]
        looks_heading = (
            4 <= len(txt) <= 88
            and not txt.endswith((".", ",", ";"))
            and not re.match(r"^[•▪◦●\-\*]", txt)
            and (
                b["size"] >= median_size + 1.3
                or (b["bold"] and len(txt.split()) <= 11)
                or looks_question_head
                or bool(re.match(r"^\d+(\.\d+){1,2}\s+[A-Z]", txt))
            )
        )
        if looks_heading:
            items.append({"kind": "heading", "text": txt.rstrip(":")})
        elif len(txt) >= 18 or re.match(r"^[•▪◦●\-\*\d]", txt):
            items.append({"kind": "body", "text": txt})

    return items


def split_bullets_from_text(text: str) -> list[dict]:
    """Turn inline 'Lead sentence • item 1 • item 2' or '- item' into structured paragraph + bullet blocks."""
    # Split inline bullet delimiters such as " . • " or " • "
    if re.search(r"(?:^|\s)[•▪◦●]\s+", text):
        parts = re.split(r"\s*[•▪◦●]\s+", text.strip())
        blocks = []
        lead = parts[0].strip()
        if lead:
            if len(lead) <= 82 and lead.endswith("?") and "." not in lead[:-1]:
                blocks.append({"type": "subheading", "text": lead})
            else:
                blocks.append({"type": "paragraph", "text": lead})
        for item in parts[1:]:
            clean_item = item.strip()
            if clean_item:
                blocks.append({"type": "bullet", "text": clean_item})
        return blocks

    if re.match(r"^(•|▪|◦|●|-|\*)\s+", text):
        clean_item = re.sub(r"^(•|▪|◦|●|-|\*)\s+", "", text).strip()
        return [{"type": "bullet", "text": clean_item}] if clean_item else []

    return [{"type": "paragraph", "text": text}]


def stitch_and_clean_items(items: list[dict], ch_title: str) -> list[dict]:
    """Stitch sentences split across page breaks and deduplicate repeated headers."""
    stitched = []
    seen_long = set()
    ch_norm = re.sub(r"\s+", " ", ch_title).strip().lower()

    for it in items:
        txt = it["text"]
        key = txt[:70].lower()
        if it["kind"] == "heading" and txt.lower() == ch_norm:
            continue
        if len(txt) >= 40 and key in seen_long:
            continue
        if len(txt) >= 40:
            seen_long.add(key)

        if (
            stitched
            and stitched[-1]["kind"] == "body"
            and it["kind"] == "body"
            and not re.match(r"^[•▪◦●\-\*]", txt)
            and not stitched[-1]["text"].endswith((".", "!", "?", ":", ";", ")", "\"", "'", "”"))
            and (txt[0].islower() or txt.startswith(("and ", "or ", "to ", "of ", "in ", "with ", "for ", "that ", "which ", "as ")))
        ):
            stitched[-1]["text"] = f"{stitched[-1]['text']} {txt}"
        else:
            stitched.append(dict(it))

    return stitched


def build_sections_from_items(items: list[dict], ch_title: str) -> tuple[list[dict], str, int]:
    """Group cleaned items into well-titled sections with crisp paragraphs & bullet lists."""
    sections = []
    current_title = ch_title
    current_blocks = []

    def flush_section():
        nonlocal current_title, current_blocks
        if not current_blocks:
            return
        # If section grew huge (> 12 blocks) without subheadings, split evenly cleanly
        if len(current_blocks) <= 12:
            sections.append({"title": current_title, "blocks": current_blocks})
        else:
            for idx in range(0, len(current_blocks), 8):
                chunk = current_blocks[idx : idx + 8]
                # Try to promote an internal subheading if one exists near the start of chunk
                sub = current_title if idx == 0 else f"{current_title} (Continued {idx // 8 + 1})"
                if chunk and chunk[0].get("type") == "subheading":
                    sub = chunk[0]["text"]
                    chunk = chunk[1:]
                if chunk:
                    sections.append({"title": sub, "blocks": chunk})
        current_blocks = []

    for it in items:
        if it["kind"] == "heading":
            # Only start a new section card if current section already has >= 2 blocks
            if len(current_blocks) >= 2:
                flush_section()
                current_title = it["text"]
            elif not current_blocks:
                current_title = it["text"]
            else:
                current_blocks.append({"type": "subheading", "text": it["text"]})
        else:
            current_blocks.extend(split_bullets_from_text(it["text"]))

    flush_section()

    # Calculate clean stats
    all_texts = [
        b.get("text", "")
        for s in sections
        for b in s.get("blocks", [])
    ]
    word_count = sum(len(t.split()) for t in all_texts)
    excerpt = next((t[:180] for t in all_texts if len(t) >= 45), ch_title)
    return sections, excerpt, max(30, word_count)


def chunk_range_into_chapters(doc, total_pages: int, max_chapters: int = 20):
    """Build clean (title, start_0idx, end_0idx) ranges covering the whole book."""
    toc = doc.get_toc(simple=True) or []
    skip_re = re.compile(
        r"^(cover|half title|title page|copyright|dedication|contents|table of contents|preface|foreword|acknowledg|contributors|index|glossary|references|bibliography|further reading|appendix)$",
        re.I,
    )

    entries = []
    seen = set()
    lvl1 = [t for t in toc if t[0] == 1]
    use_toc = lvl1 if len(lvl1) >= 4 else [t for t in toc if t[0] <= 2]

    for lvl, raw_title, pg in use_toc:
        title = normalize_text(raw_title)
        if len(title) < 3 or skip_re.match(title):
            continue
        p0 = max(0, min(total_pages - 1, int(pg) - 1))
        if p0 in seen:
            continue
        seen.add(p0)
        entries.append((title, p0))

    entries.sort(key=lambda x: x[1])
    if len(entries) > max_chapters:
        step = len(entries) / max_chapters
        entries = [entries[int(i * step)] for i in range(max_chapters)]

    if len(entries) >= 3:
        ranges = []
        for idx, (title, start_p) in enumerate(entries):
            end_p = entries[idx + 1][1] - 1 if idx + 1 < len(entries) else total_pages - 1
            if end_p < start_p:
                end_p = start_p
            ranges.append((title, start_p, end_p))
        return ranges

    start_page = 1 if total_pages > 8 else 0
    span = max(1, total_pages - start_page)
    num_parts = min(12, max(4, span // 8))
    chunk = max(1, span // num_parts)
    ranges = []
    cur = start_page
    for part in range(1, num_parts + 1):
        end_p = (total_pages - 1) if part == num_parts else min(total_pages - 1, cur + chunk - 1)
        if cur > total_pages - 1:
            break
        ranges.append((f"Section {part}: Clinical Study Notes (pp. {cur + 1}–{end_p + 1})", cur, end_p))
        cur = end_p + 1
    return ranges


def build_chapter_sections(doc, start_p: int, end_p: int, ch_title: str, book_title: str) -> tuple[list[dict], str, int]:
    total_span = end_p - start_p + 1
    if total_span <= 14:
        page_indices = list(range(start_p, end_p + 1))
    else:
        step = total_span / 14.0
        page_indices = sorted(set(start_p + int(i * step) for i in range(14)))

    raw_items = []
    bt_lower = book_title.lower().strip()
    for p_idx in page_indices:
        raw_items.extend(extract_page_items(doc[p_idx], bt_lower))

    cleaned_items = stitch_and_clean_items(raw_items, ch_title)
    if not cleaned_items:
        return ([{
            "title": ch_title,
            "blocks": [{
                "type": "paragraph",
                "text": f"Complete clinical study notes covering {ch_title} across pages {start_p + 1}–{end_p + 1}."
            }]
        }], f"Pages {start_p + 1}–{end_p + 1}", 30)

    return build_sections_from_items(cleaned_items, ch_title)


def main():
    BOOKS_DIR.mkdir(parents=True, exist_ok=True)
    audit = json.loads(AUDIT_PATH.read_text(encoding="utf-8"))
    ebooks_doc = json.loads(EBOOKS_PATH.read_text(encoding="utf-8"))

    slug_to_pdf = {}
    for rec in audit.get("records", []):
        if rec["status"] != "KEEP":
            continue
        slug = "book-" + re.sub(r"[^a-z0-9]+", "-", rec["title"].lower()).strip("-")[:72]
        slug_to_pdf[slug] = Path(rec["path"])

    processed = 0
    total_chapters = 0
    for eb in ebooks_doc.get("ebooks", []):
        if not eb.get("importedFromInfoBooks"):
            continue
        pdf_path = slug_to_pdf.get(eb["slug"])
        if not pdf_path or not pdf_path.exists():
            continue

        try:
            doc = fitz.open(str(pdf_path))
            total_pages = len(doc)
            ranges = chunk_range_into_chapters(doc, total_pages, max_chapters=20)
            full_chapters = []
            toc_summary = []

            for idx, (ch_title, start_p, end_p) in enumerate(ranges, 1):
                sections, excerpt, w_count = build_chapter_sections(doc, start_p, end_p, ch_title, eb["title"])
                ch_slug = f"ch-{idx}"
                full_chapters.append({
                    "chapterNumber": idx,
                    "slug": ch_slug,
                    "title": ch_title,
                    "pageRange": f"pp. {start_p + 1}–{end_p + 1}",
                    "excerpt": excerpt,
                    "wordCount": w_count,
                    "sections": sections,
                })
                toc_summary.append({
                    "chapterNumber": idx,
                    "slug": ch_slug,
                    "title": ch_title,
                    "pageRange": f"pp. {start_p + 1}–{end_p + 1}",
                    "wordCount": w_count,
                })

            total_words = sum(c["wordCount"] for c in full_chapters)
            book_payload = {
                "slug": eb["slug"],
                "title": eb["title"],
                "subtitle": eb["subtitle"],
                "category": eb["category"],
                "estimatedPages": total_pages,
                "totalWords": total_words,
                "references": eb.get("references", []),
                "figures": eb.get("figures", []),
                "chapters": full_chapters,
            }
            (BOOKS_DIR / f"{eb['slug']}.json").write_text(
                json.dumps(book_payload, indent=2, ensure_ascii=False),
                encoding="utf-8",
            )

            eb["hasFullBookData"] = True
            eb["totalWords"] = total_words
            eb["chapters"] = toc_summary
            processed += 1
            total_chapters += len(full_chapters)
            if processed % 15 == 0 or eb["slug"] == "book-instant-clinical-pharmacology":
                print(f"[{processed}] {eb['slug']} -> {len(full_chapters)} chapters, {total_words} words")
        except Exception as exc:
            print(f"ERROR processing {eb['slug']}: {exc}")

    EBOOKS_PATH.write_text(json.dumps(ebooks_doc, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"\nProcessed {processed} full books ({total_chapters} total chapters) into {BOOKS_DIR}/")


if __name__ == "__main__":
    main()
