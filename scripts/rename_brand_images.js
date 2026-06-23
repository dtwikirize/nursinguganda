#!/usr/bin/env node
/* Copy, brand-rename and relink image files for Nursing Uganda pages. */
const fs = require("node:fs");
const path = require("node:path");

const ROOT = process.cwd();
const LEGACY_SOURCE_FOLDER = ["Nurses", "revision"].join(" ");
const LEGACY_SOURCE_DIR = ["Nurses", "Revision", "Full"].join("_");
const DEFAULT_SOURCE = path.resolve(ROOT, "..", LEGACY_SOURCE_FOLDER, LEGACY_SOURCE_DIR, "assets");
const DEFAULT_DEST = path.resolve(ROOT, "assets", "images");
const DEFAULT_PREFIX = "nursing-uganda";
const DEFAULT_MANIFEST = path.join(DEFAULT_DEST, "nursing-uganda-image-manifest.json");
const IMAGE_EXTS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif", ".svg"]);

function getArgValue(args, name, fallback) {
  const idx = args.indexOf(name);
  if (idx === -1) return fallback;
  return args[idx + 1] || fallback;
}

function hasFlag(args, name) {
  return args.includes(name);
}

function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function listFiles(dir) {
  const out = [];
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, item.name);
    if (item.isDirectory()) {
      out.push(...listFiles(full));
    } else {
      out.push(full);
    }
  }
  return out;
}

function nextNumberForSlug(destDir, prefix, slug, ext) {
  const pattern = new RegExp(`^${prefix}-${slug}-(\\d{2})\\${ext}$`, "i");
  let max = 0;
  if (!fs.existsSync(destDir)) return 1;
  for (const file of fs.readdirSync(destDir)) {
    const m = file.match(pattern);
    if (m) max = Math.max(max, Number(m[1]));
  }
  return max + 1;
}

function pad2(num) {
  return String(num).padStart(2, "0");
}

function loadManifest(manifestPath) {
  if (!fs.existsSync(manifestPath)) {
    return { brand_prefix: DEFAULT_PREFIX, source_folder: DEFAULT_SOURCE, images: [] };
  }
  try {
    return JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  } catch {
    return { brand_prefix: DEFAULT_PREFIX, source_folder: DEFAULT_SOURCE, images: [] };
  }
}

function saveManifest(manifestPath, data) {
  fs.writeFileSync(manifestPath, JSON.stringify(data, null, 2));
}

function replaceLinksInHtml(rootDir, replacements) {
  const htmlFiles = listFiles(rootDir).filter((f) => f.toLowerCase().endsWith(".html"));
  let touched = 0;
  for (const file of htmlFiles) {
    const original = fs.readFileSync(file, "utf8");
    let updated = original;
    for (const { from, to } of replacements) {
      if (updated.includes(from)) {
        updated = updated.split(from).join(to);
      }
    }
    if (updated !== original) {
      fs.writeFileSync(file, updated);
      touched += 1;
    }
  }
  return touched;
}

function main() {
  const args = process.argv.slice(2);
  const sourceDir = path.resolve(getArgValue(args, "--source", DEFAULT_SOURCE));
  const destDir = path.resolve(getArgValue(args, "--dest", DEFAULT_DEST));
  const prefix = getArgValue(args, "--prefix", DEFAULT_PREFIX);
  const manifestPath = path.resolve(getArgValue(args, "--manifest", DEFAULT_MANIFEST));
  const dryRun = hasFlag(args, "--dry-run");
  const updateLinks = !hasFlag(args, "--no-link-update");

  if (!fs.existsSync(sourceDir)) {
    throw new Error(`Source folder not found: ${sourceDir}`);
  }

  fs.mkdirSync(destDir, { recursive: true });
  const manifest = loadManifest(manifestPath);
  const existingBySource = new Map(
    (manifest.images || []).map((entry) => [String(entry.source_file).toLowerCase(), entry])
  );

  const sourceImages = listFiles(sourceDir)
    .filter((file) => IMAGE_EXTS.has(path.extname(file).toLowerCase()))
    .sort((a, b) => a.localeCompare(b));

  const copied = [];
  const replacements = [];

  for (const src of sourceImages) {
    const sourceFile = path.basename(src);
    const sourceKey = sourceFile.toLowerCase();
    if (existingBySource.has(sourceKey)) continue;

    const ext = path.extname(sourceFile).toLowerCase();
    const raw = path.basename(sourceFile, ext);
    const slug = slugify(raw).slice(0, 60) || "image";
    const next = nextNumberForSlug(destDir, prefix, slug, ext);
    const renamed = `${prefix}-${slug}-${pad2(next)}${ext}`;
    const dest = path.join(destDir, renamed);

    if (!dryRun) {
      fs.copyFileSync(src, dest);
    }

    copied.push({ source_file: sourceFile, renamed_file: renamed, used_in: [], alt: "Add alt text" });
    replacements.push({ from: sourceFile, to: renamed });
  }

  let filesTouched = 0;
  if (updateLinks && replacements.length > 0 && !dryRun) {
    filesTouched = replaceLinksInHtml(ROOT, replacements);
  }

  if (!dryRun) {
    manifest.generated_at_utc = new Date().toISOString();
    manifest.brand_prefix = prefix;
    manifest.source_folder = sourceDir.replace(/\\/g, "/");
    manifest.images = [...(manifest.images || []), ...copied];
    saveManifest(manifestPath, manifest);
  }

  console.log(`Source: ${sourceDir}`);
  console.log(`Destination: ${destDir}`);
  console.log(`Copied: ${copied.length} image(s)${dryRun ? " (dry-run)" : ""}`);
  console.log(`Updated HTML files: ${filesTouched}`);
  console.log(`Manifest: ${manifestPath}`);
}

main();
