#!/usr/bin/env node
/**
 * Prepares the clean Hostinger `dist/` directory after `vite build`:
 *  - Copies lightweight JSON datasets (excluding raw 27 MB curriculum.json)
 *  - Copies Udemy imagery, brand icons, PWA icons, and medical-instruments images
 *  - Copies PHP/MySQL `api/` (excluding local config.php)
 *  - Copies `.htaccess`, `manifest.webmanifest`, `robots.txt`, `sitemap.xml`, `_offline.html`, `404.html`
 *  - Copies generated static SEO HTML pages (`course/` and `ebooks/`) if present
 */
const fs = require("node:fs");
const path = require("node:path");

const ROOT = process.cwd();
const DIST = path.join(ROOT, "dist");

function copyFileSafe(srcRel, destRel = srcRel) {
  const src = path.join(ROOT, srcRel);
  const dest = path.join(DIST, destRel);
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

function copyDirSafe(srcRel, destRel = srcRel, ignoreNames = new Set()) {
  const src = path.join(ROOT, srcRel);
  const dest = path.join(DIST, destRel);
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (ignoreNames.has(entry.name)) continue;
    const s = path.join(srcRel, entry.name);
    const d = path.join(destRel, entry.name);
    if (entry.isDirectory()) {
      copyDirSafe(s, d, ignoreNames);
    } else {
      copyFileSafe(s, d);
    }
  }
}

// 1. Lightweight datasets (skip 27 MB curriculum.json and 3.5 MB topic-image-matches.json)
const dataFiles = [
  "catalog.json",
  "canonical-lessons-index.json",
  "clinical-tools.json",
  "dictionary.json",
  "ebooks.json",
  "medical-instruments.json",
  "mock-exams.json",
  "references.json"
];
for (const f of dataFiles) {
  copyFileSafe(path.join("assets", "data", f));
}
copyDirSafe(path.join("assets", "data", "courses"));

// 2. Core brand & Udemy imagery (keep 286 MB lesson-images separate or already on Hostinger)
copyDirSafe(path.join("assets", "images", "brand"));
copyDirSafe(path.join("assets", "images", "udemy"));
copyDirSafe(path.join("assets", "images", "pwa"));
copyDirSafe(path.join("assets", "images", "medical-instruments"));
for (const entry of fs.readdirSync(path.join(ROOT, "assets", "images"))) {
  if (entry.startsWith("nursing-uganda-") && /\.(png|webp|svg|jpg)$/i.test(entry)) {
    copyFileSafe(path.join("assets", "images", entry));
  }
}

// 3. Hostinger PHP + MySQL API (never overwrite live config.php)
copyDirSafe("api", "api", new Set(["config.php"]));

// 4. Root hosting & SEO files
for (const rootFile of [".htaccess", "manifest.webmanifest", "robots.txt", "sitemap.xml", "_offline.html", "404.html"]) {
  copyFileSafe(rootFile);
}

// 5. Static SEO landing folders for crawlers
copyDirSafe("course");
copyDirSafe("ebooks");

console.log("Finalized Hostinger dist/ package successfully.");
