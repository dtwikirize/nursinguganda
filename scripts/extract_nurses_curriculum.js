#!/usr/bin/env node
/* Extract Diploma Nursing Direct/Extension tree from Nurses revision HTML. */
const fs = require("node:fs");
const path = require("node:path");

const ROOT = process.cwd();
const SOURCE_ROOT = path.resolve(ROOT, "..", "Nurses revision", "Nurses_Revision_Full");
const OUT_FILE = path.resolve(ROOT, "programmes", "diploma-nursing", "curriculum-tree.json");

const SOURCE_FILES = [
  {
    key: "direct",
    label: "Diploma in Nursing (Direct)",
    codePrefix: "DND",
    file: "diploma-in-nursing-direct-curriculum.html"
  },
  {
    key: "extension",
    label: "Diploma in Nursing (Extension)",
    codePrefix: "DNE",
    file: "diploma-nursing-extension-curriculum.html"
  }
];

const WORD_TO_NUM = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6
};

function toSlug(value) {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function cleanupText(value) {
  return value
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&rsquo;/g, "'")
    .replace(/&lsquo;/g, "'")
    .replace(/&ndash;/g, "-")
    .replace(/&mdash;/g, "-")
    .replace(/Â/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function parseYearSemester(marker) {
  const text = marker.toLowerCase();
  const yearWordMatch = text.match(/year\s+([a-z]+)/);
  const semesterWordMatch = text.match(/semester\s+([a-z]+)/);
  const yearNumMatch = text.match(/year\s+(\d+)/);
  const semesterNumMatch = text.match(/semester\s+(\d+)/);

  const year =
    (yearNumMatch && Number(yearNumMatch[1])) ||
    (yearWordMatch && WORD_TO_NUM[yearWordMatch[1]]) ||
    null;
  const semester =
    (semesterNumMatch && Number(semesterNumMatch[1])) ||
    (semesterWordMatch && WORD_TO_NUM[semesterWordMatch[1]]) ||
    null;

  return { year, semester };
}

function extractProgramme(sourceCfg) {
  const filePath = path.join(SOURCE_ROOT, sourceCfg.file);
  const html = fs.readFileSync(filePath, "utf8");

  const yearMarkers = [];
  const yearRegex = /price-currency">([^<]*Year[^<]*Semester[^<]*)</gi;
  for (const match of html.matchAll(yearRegex)) {
    const label = cleanupText(match[1]);
    const parsed = parseYearSemester(label);
    if (parsed.year && parsed.semester) {
      yearMarkers.push({
        index: match.index || 0,
        year: parsed.year,
        semester: parsed.semester,
        label
      });
    }
  }

  const units = [];

  function assignMarker(start) {
    let assigned = null;
    for (const marker of yearMarkers) {
      if (marker.index <= start) assigned = marker;
      else break;
    }
    return assigned;
  }

  // Pattern A: "DND 111: Title..." or "DNE 111: Title..."
  const inlineTitleRegex = new RegExp(`(${sourceCfg.codePrefix})\\s*(\\d{3})\\s*:\\s*([^<\\r\\n]+)<`, "gi");
  for (const match of html.matchAll(inlineTitleRegex)) {
    const code = `${match[1]} ${match[2]}`;
    const start = match.index || 0;
    const title = cleanupText(match[3]);
    if (!title) continue;
    const assigned = assignMarker(start);
    units.push({
      code,
      title,
      slug: toSlug(title),
      year: assigned ? assigned.year : null,
      semester: assigned ? assigned.semester : null,
      index: start
    });
  }

  // Pattern B: code block with title in li-icon span.
  const unitRegex = new RegExp(`price-currency">(${sourceCfg.codePrefix})\\s*(\\d{3})<`, "gi");
  for (const match of html.matchAll(unitRegex)) {
    const code = `${match[1]} ${match[2]}`;
    const start = match.index || 0;
    const block = html.slice(start, start + 1800);
    let title = "";
    const titleMatch = block.match(/class="li-icon"[\s\S]*?<span>([^<]+)<\/span>/i);
    if (titleMatch) {
      title = cleanupText(titleMatch[1]);
    }
    if (!title) continue;
    const assigned = assignMarker(start);
    units.push({
      code,
      title,
      slug: toSlug(title),
      year: assigned ? assigned.year : null,
      semester: assigned ? assigned.semester : null,
      index: start
    });
  }

  units.sort((a, b) => a.index - b.index);

  // De-duplicate by code while preserving order; prefer the first non-empty title.
  const dedupedMap = new Map();
  for (const unit of units) {
    if (!dedupedMap.has(unit.code)) {
      dedupedMap.set(unit.code, unit);
      continue;
    }
    const existing = dedupedMap.get(unit.code);
    if ((!existing.title || existing.title.length < 4) && unit.title) {
      dedupedMap.set(unit.code, unit);
    }
  }
  const deduped = Array.from(dedupedMap.values()).map((unit) => {
    // Fallback classification from unit code when marker-based assignment is absent.
    if (!unit.year || !unit.semester) {
      const m = unit.code.match(/\b\d(\d)\d\b/);
      if (m) {
        unit.year = Number(unit.code.match(/\b(\d)\d\d\b/)?.[1] || unit.year);
        unit.semester = Number(m[1]);
      }
    }
    return unit;
  });

  const years = {};
  for (const unit of deduped) {
    const yKey = `year-${unit.year}`;
    const sKey = `semester-${unit.semester}`;
    if (!years[yKey]) years[yKey] = { year: unit.year, semesters: {} };
    if (!years[yKey].semesters[sKey]) {
      years[yKey].semesters[sKey] = { semester: unit.semester, courseUnits: [] };
    }
    years[yKey].semesters[sKey].courseUnits.push({
      code: unit.code,
      title: unit.title,
      slug: unit.slug
    });
  }

  return {
    key: sourceCfg.key,
    label: sourceCfg.label,
    source_file: sourceCfg.file,
    years
  };
}

function main() {
  const tree = {
    generated_at_utc: new Date().toISOString(),
    source_root: SOURCE_ROOT,
    programmes: {}
  };

  for (const cfg of SOURCE_FILES) {
    tree.programmes[cfg.key] = extractProgramme(cfg);
  }

  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
  fs.writeFileSync(OUT_FILE, JSON.stringify(tree, null, 2));

  const summary = SOURCE_FILES.map((cfg) => {
    const p = tree.programmes[cfg.key];
    let unitCount = 0;
    for (const y of Object.values(p.years)) {
      for (const s of Object.values(y.semesters)) {
        unitCount += s.courseUnits.length;
      }
    }
    return `${cfg.label}: ${unitCount} units`;
  });
  console.log(`Wrote ${OUT_FILE}`);
  console.log(summary.join("\n"));
}

main();
