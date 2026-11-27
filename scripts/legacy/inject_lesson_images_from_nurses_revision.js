#!/usr/bin/env node
/* Inject lesson images sourced from Nurses Revision HTML files into NursingUganda lesson pages.
 * Also writes assets/data/lesson-images-manifest.json so generate_seo_pages.js can embed
 * images directly during page generation (build-safe — survives cleanCoursesRoot()).
 *
 * Usage:
 *   node scripts/inject_lesson_images_from_nurses_revision.js          (all lessons)
 *   node scripts/inject_lesson_images_from_nurses_revision.js --dry    (dry run, no writes)
 *   node scripts/inject_lesson_images_from_nurses_revision.js --test cardiovascular-system
 *   node scripts/inject_lesson_images_from_nurses_revision.js --manifest-only (just write manifest)
 */

const fs = require("node:fs");
const path = require("node:path");

const ROOT = process.cwd();
const NURSES_REVISION_DIR = path.resolve(ROOT, "..", "Nurses revision", "Nurses_Revision_Full");
const NURSES_REVISION_ASSETS = path.join(NURSES_REVISION_DIR, "assets");
const LESSON_IMAGES_DIR = path.join(ROOT, "assets", "images", "lesson-images");
const COURSES_ROOT = path.join(ROOT, "courses");
const MANIFEST_FILE = path.join(ROOT, "assets", "data", "lesson-images-manifest.json");

const IS_DRY = process.argv.includes("--dry");
const MANIFEST_ONLY = process.argv.includes("--manifest-only");
const TEST_SLUG = (() => {
  const idx = process.argv.indexOf("--test");
  return idx !== -1 ? process.argv[idx + 1] : null;
})();

// Images to always skip: site logos, avatars, spinners
const SKIP_IMAGE_RE = /^(pupo-|nursing-uganda-favicon|placeholder|spinner|loading|avatar|logo|wp-emoji|gravatar)/i;

// Image extensions considered content images
const IMAGE_EXT_RE = /\.(jpg|jpeg|png|webp|gif)$/i;

// Suffixes stripped from Nurses Revision filenames when normalizing for matching
const NR_SUFFIX_STRIP_RE = /(-(notes?|summary|overview|details?|revision|part|volume|v?\d+))+$/i;

function normalizeSlug(value) {
  return value
    .toLowerCase()
    .replace(NR_SUFFIX_STRIP_RE, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function slugTokens(slug) {
  return slug.split("-").filter((t) => t.length >= 4);
}

// Build index: normalized-slug → original filename
function buildNursesRevisionIndex() {
  const files = fs.readdirSync(NURSES_REVISION_DIR).filter((f) => f.endsWith(".html"));
  const index = new Map();
  for (const file of files) {
    const base = path.basename(file, ".html");
    const normalized = normalizeSlug(base);
    if (!index.has(normalized)) {
      index.set(normalized, file);
    }
    // Also store original slug without suffix strip for exact match
    const direct = base.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    if (direct !== normalized && !index.has(direct)) {
      index.set(direct, file);
    }
  }
  return index;
}

// Match a lesson slug to the best Nurses Revision source file
function findMatch(lessonSlug, index) {
  const normalized = normalizeSlug(lessonSlug);

  // 1. Exact match on normalized slug
  if (index.has(normalized)) return { file: index.get(normalized), method: "exact" };

  // 2. Exact match on original slug (before stripping suffixes)
  if (index.has(lessonSlug)) return { file: index.get(lessonSlug), method: "exact-raw" };

  // 3. Prefix: lesson slug is a prefix of a NR entry, or vice versa
  for (const [nrSlug, file] of index) {
    if (nrSlug.startsWith(normalized + "-") || normalized.startsWith(nrSlug + "-")) {
      return { file, method: "prefix" };
    }
  }

  // 4. Token overlap: at least 70% of lesson tokens appear in NR slug
  const lessonTokens = slugTokens(normalized);
  if (!lessonTokens.length) return null;

  let best = null;
  let bestScore = 0;

  for (const [nrSlug, file] of index) {
    const nrTokens = new Set(slugTokens(nrSlug));
    const overlap = lessonTokens.filter((t) => nrTokens.has(t)).length;
    const score = overlap / lessonTokens.length;
    if (score > bestScore && score >= 0.7 && overlap >= 2) {
      bestScore = score;
      best = { file, method: `token(${score.toFixed(2)})` };
    }
  }

  return best;
}

// Extract content image filenames from a Nurses Revision HTML file (deduplicated, in order)
function extractImages(html) {
  const seen = new Set();
  const images = [];
  const imgRegex = /<img[^>]+>/gi;
  let m;
  while ((m = imgRegex.exec(html)) !== null) {
    const tag = m[0];
    const srcMatch = tag.match(/\bsrc="assets\/([^"]+)"/i);
    if (!srcMatch) continue;
    const filename = srcMatch[1];
    if (!IMAGE_EXT_RE.test(filename)) continue;
    if (SKIP_IMAGE_RE.test(filename)) continue;
    if (seen.has(filename)) continue;
    seen.add(filename);
    images.push(filename);
  }
  return images;
}

function humanAlt(filename) {
  return filename
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\d+x\d+$/, "")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function getRelToRoot(htmlFile) {
  const rel = path.relative(path.dirname(htmlFile), ROOT).replace(/\\/g, "/");
  return rel ? `${rel}/` : "./";
}

function buildImagesSection(imageFilenames, relToRoot) {
  const figTags = imageFilenames
    .map((filename) => {
      const src = `${relToRoot}assets/images/lesson-images/${filename}`;
      const alt = humanAlt(filename);
      return (
        `<figure style="margin:0;break-inside:avoid">` +
        `<img src="${src}" alt="${alt}" loading="lazy" ` +
        `style="max-width:100%;height:auto;border-radius:8px;border:1px solid var(--seo-border);display:block">` +
        `<figcaption style="font-size:.82rem;color:var(--seo-muted);margin-top:4px;text-align:center">${alt}</figcaption>` +
        `</figure>`
      );
    })
    .join("\n          ");

  return (
    `\n      <details class="seo-lesson-section" id="lesson-images" open>\n` +
    `        <summary>Illustrations and Diagrams</summary>\n` +
    `        <div class="lesson-images-section" style="display:grid;gap:16px;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));padding:8px 0">\n` +
    `          ${figTags}\n` +
    `        </div>\n` +
    `      </details>`
  );
}

function hasImagesSection(html) {
  return html.includes('id="lesson-images"') || html.includes('lesson-images-section');
}

function injectIntoPage(html, imagesSection) {
  // Insert just before the YouTube video section
  const videoIdx = html.indexOf('<section class="seo-panel seo-video">');
  if (videoIdx !== -1) {
    return html.slice(0, videoIdx) + imagesSection + "\n      " + html.slice(videoIdx);
  }
  // Fallback: insert before the footer
  const footerIdx = html.indexOf('<footer class="seo-footer">');
  if (footerIdx !== -1) {
    return html.slice(0, footerIdx) + imagesSection + "\n      " + html.slice(footerIdx);
  }
  return html;
}

// Build the full slug→images manifest by scanning all Nurses Revision source files.
// This is done up-front so the manifest is always current regardless of whether
// pages have already been processed.
function buildManifest(nrIndex) {
  const manifest = {};
  // Walk courses to collect all unique lesson slugs
  const slugsSeen = new Set();
  function collectSlugs(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) collectSlugs(path.join(dir, entry.name));
      else if (entry.name === "index.html") {
        slugsSeen.add(path.basename(path.dirname(path.join(dir, entry.name))));
      }
    }
  }
  if (fs.existsSync(COURSES_ROOT)) collectSlugs(COURSES_ROOT);

  for (const slug of slugsSeen) {
    const match = findMatch(slug, nrIndex);
    if (!match) continue;
    const nrHtml = fs.readFileSync(path.join(NURSES_REVISION_DIR, match.file), "utf8");
    const imageFilenames = extractImages(nrHtml).filter((f) =>
      fs.existsSync(path.join(NURSES_REVISION_ASSETS, f))
    );
    if (imageFilenames.length) manifest[slug] = imageFilenames;
  }
  return manifest;
}

function processLesson(htmlFile, nrIndex, manifest, stats) {
  const lessonSlug = path.basename(path.dirname(htmlFile));
  const html = fs.readFileSync(htmlFile, "utf8");

  if (hasImagesSection(html)) {
    stats.alreadyDone++;
    return;
  }

  const existingImages = manifest[lessonSlug];
  if (!existingImages) {
    stats.noMatch++;
    return;
  }
  if (!existingImages.length) {
    stats.noImages++;
    return;
  }

  if (!IS_DRY) {
    fs.mkdirSync(LESSON_IMAGES_DIR, { recursive: true });
    for (const filename of existingImages) {
      const dest = path.join(LESSON_IMAGES_DIR, filename);
      if (!fs.existsSync(dest)) {
        fs.copyFileSync(path.join(NURSES_REVISION_ASSETS, filename), dest);
      }
    }
  }

  const relToRoot = getRelToRoot(htmlFile);
  const imagesSection = buildImagesSection(existingImages, relToRoot);
  const newHtml = injectIntoPage(html, imagesSection);

  if (!IS_DRY) {
    fs.writeFileSync(htmlFile, newHtml);
  }

  stats.injected++;

  if (TEST_SLUG) {
    console.log(`\nLesson slug    : ${lessonSlug}`);
    console.log(`Images         : ${existingImages.length}`);
    for (const f of existingImages) console.log(`  ${f}`);
  }
}

function walkCourses(dir, nrIndex, manifest, stats) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      walkCourses(path.join(dir, entry.name), nrIndex, manifest, stats);
    } else if (entry.name === "index.html") {
      const htmlFile = path.join(dir, entry.name);
      if (TEST_SLUG && path.basename(path.dirname(htmlFile)) !== TEST_SLUG) continue;
      try {
        processLesson(htmlFile, nrIndex, manifest, stats);
      } catch (err) {
        stats.errors++;
        console.error(`Error processing ${htmlFile}: ${err.message}`);
      }
      if (!TEST_SLUG && stats.injected % 100 === 0 && stats.injected > 0) {
        process.stdout.write(`  Injected: ${stats.injected}\r`);
      }
    }
  }
}

function main() {
  console.log(`Mode: ${IS_DRY ? "DRY RUN" : MANIFEST_ONLY ? "MANIFEST ONLY" : "LIVE"}${TEST_SLUG ? ` | Test slug: ${TEST_SLUG}` : ""}`);

  const nrIndex = buildNursesRevisionIndex();
  console.log(`Nurses Revision index built: ${nrIndex.size} slug entries`);

  // Always build and write the manifest (source of truth for generate_seo_pages.js)
  console.log("Building lesson-images manifest...");
  const manifest = buildManifest(nrIndex);
  const manifestSlugs = Object.keys(manifest).length;
  console.log(`  Manifest: ${manifestSlugs} lesson slugs with images`);

  if (!IS_DRY) {
    fs.mkdirSync(path.dirname(MANIFEST_FILE), { recursive: true });
    fs.writeFileSync(MANIFEST_FILE, JSON.stringify(manifest, null, 2));
    console.log(`  Written : ${MANIFEST_FILE}`);

    // Copy all referenced images now (so they're ready for generate_seo_pages.js too)
    fs.mkdirSync(LESSON_IMAGES_DIR, { recursive: true });
    let copied = 0;
    for (const filenames of Object.values(manifest)) {
      for (const filename of filenames) {
        const dest = path.join(LESSON_IMAGES_DIR, filename);
        if (!fs.existsSync(dest)) {
          fs.copyFileSync(path.join(NURSES_REVISION_ASSETS, filename), dest);
          copied++;
        }
      }
    }
    if (copied) console.log(`  Copied  : ${copied} new images to lesson-images/`);
  }

  if (MANIFEST_ONLY) {
    console.log("Done (manifest-only mode — lesson pages not modified).");
    return;
  }

  const stats = { injected: 0, alreadyDone: 0, noMatch: 0, noImages: 0, errors: 0 };
  walkCourses(COURSES_ROOT, nrIndex, manifest, stats);

  console.log(`\nDone${IS_DRY ? " (dry run — no files written)" : ""}:`);
  console.log(`  Pages injected  : ${stats.injected}`);
  console.log(`  Already done    : ${stats.alreadyDone}`);
  console.log(`  No NR match     : ${stats.noMatch}`);
  console.log(`  Match, no images: ${stats.noImages}`);
  console.log(`  Errors          : ${stats.errors}`);
}

main();
