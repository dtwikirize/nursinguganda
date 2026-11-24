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
  "country-study-hubs.json",
  "dictionary.json",
  "ebooks.json",
  "global-nursing.json",
  "medical-instruments.json",
  "mock-exams.json",
  "references.json",
  "topic-visuals-manifest.json",
  "topic-quizzes.json",
  "unmeb-essay-papers.json"
];
for (const f of dataFiles) {
  copyFileSafe(path.join("assets", "data", f));
}
copyDirSafe(path.join("assets", "data", "courses"));

// 2. Clean stale dist/assets/images then copy current WebP/SVG assets
fs.rmSync(path.join(DIST, "assets", "images"), { recursive: true, force: true });
copyDirSafe(path.join("assets", "images", "brand"));
copyDirSafe(path.join("assets", "images", "medical-illustrations"));
copyDirSafe(path.join("assets", "images", "udemy"));
copyDirSafe(path.join("assets", "images", "pwa"));
copyDirSafe(path.join("assets", "images", "medical-instruments"));
for (const entry of fs.readdirSync(path.join(ROOT, "assets", "images"))) {
  if (entry.startsWith("nursing-uganda-") && /\.(png|webp|svg|jpg)$/i.test(entry)) {
    copyFileSafe(path.join("assets", "images", entry));
  }
}

// Inject unhashed LCP & catalog preloads directly into dist/index.html
const distHtmlPath = path.join(DIST, "index.html");
if (fs.existsSync(distHtmlPath)) {
  const html = fs.readFileSync(distHtmlPath, "utf8");
  const preloads = [
    '<link rel="preload" as="image" href="/assets/images/udemy/hero-banner.webp" fetchpriority="high" />',
    '<link rel="preload" as="fetch" href="/assets/data/catalog.json" crossorigin="anonymous" />'
  ].join("\n    ");
  if (!html.includes("/assets/images/udemy/hero-banner.webp")) {
    fs.writeFileSync(distHtmlPath, html.replace("</head>", `    ${preloads}\n  </head>`), "utf8");
  }
}

// 3. Node.js Hostinger API (clean stale PHP/SQL artifacts so only express-api.js & email-templates.js ship)
fs.rmSync(path.join(DIST, "api"), { recursive: true, force: true });
copyDirSafe(
  "api",
  "api",
  new Set([
    "config.php",
    "config.example.php",
    "auth.php",
    "db.php",
    "ebooks.php",
    "enrollments.php",
    "paypal-capture.php",
    "progress.php",
    "qa.php",
    "schema.sql"
  ])
);

// 4. Root hosting, agent-readiness & SEO files
for (const rootFile of [".htaccess", "manifest.webmanifest", "robots.txt", "llms.txt", "sitemap.xml", "service-worker.js", "_offline.html", "404.html"]) {
  copyFileSafe(rootFile);
}
copyDirSafe(".well-known");

// 5. Static SEO landing folders for crawlers
copyDirSafe("course");
copyDirSafe("ebooks");
copyDirSafe("global-nursing");

console.log("Finalized Hostinger dist/ package successfully.");
