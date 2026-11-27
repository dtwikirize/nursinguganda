#!/usr/bin/env node
/* Import source images into a deduplicated Nursing Uganda image library. */
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = process.cwd();
const SOURCE_ROOTS = [
  {
    label: "nursing",
    path: path.resolve(ROOT, "..", ["Nurses", "revision"].join(" "), ["Nurses", "Revision", "Full"].join("_"))
  },
  {
    label: "midwifery",
    path: path.resolve(ROOT, "..", "Midwives Revision", "Midwives_Revision_Full")
  }
];
const DEFAULT_DEST = path.join(ROOT, "assets", "images", "source-library");
const DEFAULT_MANIFEST = path.join(ROOT, "assets", "images", "nursing-uganda-source-image-library.json");
const IMAGE_EXTS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"]);

function getArgValue(args, name, fallback) {
  const idx = args.indexOf(name);
  return idx === -1 ? fallback : args[idx + 1] || fallback;
}

function hasFlag(args, name) {
  return args.includes(name);
}

function listFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, item.name);
    if (item.isDirectory()) out.push(...listFiles(full));
    else out.push(full);
  }
  return out;
}

function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/nurses[-_\s]*revision(?:[-_\s]*uganda)?/g, "nursing-uganda")
    .replace(/midwives[-_\s]*r?revision(?:[-_\s]*uganda)?/g, "nursing-uganda")
    .replace(/miwives[-_\s]*revision(?:[-_\s]*uganda)?/g, "nursing-uganda")
    .replace(/midwives[-_\s]*revision(?:[-_\s]*uganda)?/g, "nursing-uganda")
    .replace(/doctors?[-_\s]*revision(?:[-_\s]*uganda)?/g, "nursing-uganda")
    .replace(/nursing[-_\s]*revision(?:[-_\s]*uganda)?/g, "nursing-uganda")
    .replace(/nursesrevisionuganda/g, "nursing-uganda")
    .replace(/&/g, " and ")
    .replace(/\b(e\d{8,}|scaled|copy|image|img)\b/g, " ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function publicSourceName(sourceLabel) {
  return sourceLabel === "midwifery" ? "Nursing Uganda midwifery source" : "Nursing Uganda nursing source";
}

function cleanSourceHint(value) {
  return String(value)
    .replace(/nurses[-_\s]*revision(?:[-_\s]*uganda)?/gi, "nursing-uganda")
    .replace(/midwives[-_\s]*r?revision(?:[-_\s]*uganda)?/gi, "nursing-uganda")
    .replace(/miwives[-_\s]*revision(?:[-_\s]*uganda)?/gi, "nursing-uganda")
    .replace(/midwives[-_\s]*revision(?:[-_\s]*uganda)?/gi, "nursing-uganda")
    .replace(/doctors?[-_\s]*revision(?:[-_\s]*uganda)?/gi, "nursing-uganda")
    .replace(/nursing[-_\s]*revision(?:[-_\s]*uganda)?/gi, "nursing-uganda")
    .replace(/nursesrevisionuganda/gi, "nursing-uganda");
}

function isHashLike(value) {
  return /^[a-f0-9]{16,}$/i.test(value) || /^\d{5,}$/.test(value);
}

function categoryFor(name, sourceLabel) {
  const value = `${name} ${sourceLabel}`.toLowerCase();
  if (/midwi|obstetric|pregnan|labou?r|antenatal|postnatal|puerper|fetal|foetal|newborn|placenta|uterus|cervix|gyn/.test(value)) return "midwifery";
  if (/anatomy|physiology|heart|lung|kidney|liver|pancreas|skeleton|muscle|brain|eye|ear|nerve|blood/.test(value)) return "anatomy-physiology";
  if (/mental|psychiatric|psychology|counsel/.test(value)) return "mental-health";
  if (/community|public-health|immuni|vaccine|nutrition|family|primary-health|phc/.test(value)) return "community-health";
  if (/instrument|forceps|syringe|needle|catheter|stethoscope|tray|autoclave|scissor|cannula|suture/.test(value)) return "medical-instruments";
  if (/pharmac|drug|medicine|tablet|dose|injection/.test(value)) return "pharmacology";
  if (/surgical|wound|dressing|theatre|operation|burn|fracture/.test(value)) return "medical-surgical";
  if (/school|student|class|skill|training|lecture|nursing-management|management/.test(value)) return "nursing-training";
  return sourceLabel === "midwifery" ? "midwifery" : "nursing-study";
}

function hashFile(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

function imageFiles() {
  return SOURCE_ROOTS.flatMap((source) => {
    return listFiles(source.path)
      .filter((file) => IMAGE_EXTS.has(path.extname(file).toLowerCase()))
      .filter((file) => fs.statSync(file).size > 0)
      .map((file) => ({ file, source }));
  }).sort((a, b) => a.file.localeCompare(b.file));
}

function buildName(file, sourceLabel, hash, counters) {
  const ext = path.extname(file).toLowerCase();
  const rawName = path.basename(file, ext);
  const category = categoryFor(rawName, sourceLabel);
  const rawSlug = slugify(rawName);
  const usefulSlug = rawSlug && !isHashLike(rawSlug) ? rawSlug.slice(0, 64) : `${category}-image`;
  const key = `${category}-${usefulSlug}`;
  counters.set(key, (counters.get(key) || 0) + 1);
  const count = String(counters.get(key)).padStart(3, "0");
  return `nursing-uganda-${usefulSlug}-${count}-${hash.slice(0, 8)}${ext}`;
}

function main() {
  const args = process.argv.slice(2);
  const destDir = path.resolve(getArgValue(args, "--dest", DEFAULT_DEST));
  const manifestPath = path.resolve(getArgValue(args, "--manifest", DEFAULT_MANIFEST));
  const dryRun = hasFlag(args, "--dry-run");

  const files = imageFiles();
  const seen = new Map();
  const counters = new Map();
  const entries = [];
  let duplicateCount = 0;

  if (!dryRun) fs.mkdirSync(destDir, { recursive: true });

  for (const { file, source } of files) {
    const hash = hashFile(file);
    const stat = fs.statSync(file);
    const rel = cleanSourceHint(path.relative(source.path, file).replace(/\\/g, "/"));
    if (seen.has(hash)) {
      const entry = seen.get(hash);
      entry.duplicates.push({ source: source.label, source_path: rel });
      duplicateCount += 1;
      continue;
    }

    const renamed = buildName(file, source.label, hash, counters);
    const dest = path.join(destDir, renamed);
    const entry = {
      id: path.basename(renamed, path.extname(renamed)),
      source: source.label,
      source_path: rel,
      source_name: publicSourceName(source.label),
      original_file_hint: cleanSourceHint(path.basename(file)),
      file: `assets/images/source-library/${renamed}`,
      category: categoryFor(path.basename(file, path.extname(file)), source.label),
      extension: path.extname(file).toLowerCase(),
      size_bytes: stat.size,
      sha256: hash,
      alt: "",
      status: "imported-needs-review",
      duplicates: []
    };

    if (!dryRun) fs.copyFileSync(file, dest);
    seen.set(hash, entry);
    entries.push(entry);
  }

  const manifest = {
    generated_at_utc: new Date().toISOString(),
    destination: "assets/images/source-library",
    source_roots: SOURCE_ROOTS.map((source) => ({ label: source.label, name: publicSourceName(source.label) })),
    total_source_images: files.length,
    unique_images: entries.length,
    duplicate_images: duplicateCount,
    images: entries
  };

  if (!dryRun) fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

  console.log(`Source images: ${files.length}`);
  console.log(`Unique images: ${entries.length}`);
  console.log(`Duplicates: ${duplicateCount}`);
  console.log(`Destination: ${destDir}`);
  console.log(`Manifest: ${manifestPath}`);
  if (dryRun) console.log("Dry run only; no files copied.");
}

main();
