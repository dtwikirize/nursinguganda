#!/usr/bin/env node
/* Inject lesson images from NursesLabs HTML files into NursingUganda lesson pages.
 * Operates as a SECOND-PASS source: only fills lesson slugs not already covered by the
 * Nurses Revision manifest (inject_lesson_images_from_nurses_revision.js runs first).
 * Merges results into assets/data/lesson-images-manifest.json.
 *
 * Usage:
 *   node scripts/inject_lesson_images_from_nurseslabs.js              (all lessons)
 *   node scripts/inject_lesson_images_from_nurseslabs.js --dry        (dry run)
 *   node scripts/inject_lesson_images_from_nurseslabs.js --manifest-only
 *   node scripts/inject_lesson_images_from_nurseslabs.js --test congestive-heart-failure
 */

const fs = require("node:fs");
const path = require("node:path");

const ROOT = process.cwd();
const NL_DIR = path.resolve(ROOT, "..", "NursesLabs Clone", "NursesLabs_Full");
const NL_ASSETS = path.join(NL_DIR, "assets");
const LESSON_IMAGES_DIR = path.join(ROOT, "assets", "images", "lesson-images");
const COURSES_ROOT = path.join(ROOT, "courses");
const MANIFEST_FILE = path.join(ROOT, "assets", "data", "lesson-images-manifest.json");

const IS_DRY = process.argv.includes("--dry");
const MANIFEST_ONLY = process.argv.includes("--manifest-only");
const TEST_SLUG = (() => {
  const idx = process.argv.indexOf("--test");
  return idx !== -1 ? process.argv[idx + 1] : null;
})();

// Images to skip (logos, nav, ads, decorative)
const SKIP_IMAGE_RE = /^(logo-nurseslabs|logo-|nursing-uganda-favicon|placeholder|spinner|loading|avatar|gravatar|wp-emoji|advert|menu-item|jquery|analytics)/i;

// Image extensions
const IMAGE_EXT_RE = /\.(jpg|jpeg|png|webp|gif)$/i;

// NursesLabs slugs to strip: number prefixes and nursing-specific suffixes
function normalizeNLSlug(value) {
  return value
    .toLowerCase()
    // Strip leading digit prefix (e.g. "10-", "5-", "11-")
    .replace(/^\d+-/, "")
    // Strip common nursing suffixes from the end (order matters — largest first)
    .replace(/-(nursing-care-plans?-and-nursing-diagnosis)$/, "")
    .replace(/-(nursing-care-plans?)$/, "")
    .replace(/-(nursing-notes?-and-study-guides?)$/, "")
    .replace(/-(nursing-notes?)$/, "")
    .replace(/-(nursing-diagnosis)$/, "")
    .replace(/-(study-guides?)$/, "")
    .replace(/-(care-plans?)$/, "")
    .replace(/-(overview|notes?|summary|review|guide|v?\d+)$/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function slugTokens(slug) {
  return slug.split("-").filter((t) => t.length >= 4);
}

// Build index: normalized-slug → original filename
function buildNLIndex() {
  const files = fs.readdirSync(NL_DIR).filter((f) => f.endsWith(".html"));
  const index = new Map();
  for (const file of files) {
    const base = path.basename(file, ".html");
    const normalized = normalizeNLSlug(base);
    if (!index.has(normalized)) index.set(normalized, file);
    // Also store without stripping the leading number (in case slug already starts with digit)
    const raw = base.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    if (raw !== normalized && !index.has(raw)) index.set(raw, file);
  }
  return index;
}

// Match a lesson slug to the best NursesLabs source file
function findMatch(lessonSlug, nlIndex) {
  const normalized = normalizeNLSlug(lessonSlug);

  // 1. Exact match
  if (nlIndex.has(normalized)) return { file: nlIndex.get(normalized), method: "exact" };
  if (nlIndex.has(lessonSlug)) return { file: nlIndex.get(lessonSlug), method: "exact-raw" };

  // 2. Prefix containment
  for (const [nlSlug, file] of nlIndex) {
    if (nlSlug.startsWith(normalized + "-") || normalized.startsWith(nlSlug + "-")) {
      return { file, method: "prefix" };
    }
  }

  // 3. Token overlap (≥70% of lesson slug tokens appear in NL slug, min 2 tokens)
  const lessonTokens = slugTokens(normalized);
  if (!lessonTokens.length) return null;

  let best = null;
  let bestScore = 0;
  for (const [nlSlug, file] of nlIndex) {
    const nlTokens = new Set(slugTokens(nlSlug));
    const overlap = lessonTokens.filter((t) => nlTokens.has(t)).length;
    const score = overlap / lessonTokens.length;
    if (score > bestScore && score >= 0.7 && overlap >= 2) {
      bestScore = score;
      best = { file, method: `token(${score.toFixed(2)})` };
    }
  }
  return best;
}

// Extract content image filenames from a NursesLabs HTML file
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
    // Skip resized thumbnails (NursesLabs appends -160x120, -480x360 etc.)
    if (/-\d{2,4}x\d{2,4}\.(jpg|jpeg|png|webp|gif)$/i.test(filename)) continue;
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
  const videoIdx = html.indexOf('<section class="seo-panel seo-video">');
  if (videoIdx !== -1) {
    return html.slice(0, videoIdx) + imagesSection + "\n      " + html.slice(videoIdx);
  }
  const footerIdx = html.indexOf('<footer class="seo-footer">');
  if (footerIdx !== -1) {
    return html.slice(0, footerIdx) + imagesSection + "\n      " + html.slice(footerIdx);
  }
  return html;
}

// Load existing manifest (from Nurses Revision pass)
function loadManifest() {
  try {
    return JSON.parse(fs.readFileSync(MANIFEST_FILE, "utf8"));
  } catch {
    return {};
  }
}

// Collect all unique lesson slugs from the courses directory
function collectAllSlugs() {
  const slugs = new Set();
  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) walk(path.join(dir, entry.name));
      else if (entry.name === "index.html") {
        slugs.add(path.basename(path.dirname(path.join(dir, entry.name))));
      }
    }
  }
  if (fs.existsSync(COURSES_ROOT)) walk(COURSES_ROOT);
  return slugs;
}

// Build the NursesLabs additions to the manifest (only for slugs not already covered)
function buildNLManifestAdditions(nlIndex, existingManifest) {
  const allSlugs = collectAllSlugs();
  const additions = {};
  const unmatchedSlugs = [...allSlugs].filter((s) => !existingManifest[s]);

  for (const slug of unmatchedSlugs) {
    if (TEST_SLUG && slug !== TEST_SLUG) continue;
    const match = findMatch(slug, nlIndex);
    if (!match) continue;
    const nlHtml = fs.readFileSync(path.join(NL_DIR, match.file), "utf8");
    const imageFilenames = extractImages(nlHtml).filter((f) =>
      fs.existsSync(path.join(NL_ASSETS, f))
    );
    if (imageFilenames.length) {
      additions[slug] = imageFilenames;
      if (TEST_SLUG) {
        console.log(`\nLesson slug    : ${slug}`);
        console.log(`NL source file : ${match.file} (${match.method})`);
        console.log(`Images found   : ${imageFilenames.length}`);
        for (const f of imageFilenames) console.log(`  ${f}`);
      }
    }
  }
  return additions;
}

function processLesson(htmlFile, mergedManifest, stats) {
  const lessonSlug = path.basename(path.dirname(htmlFile));
  const html = fs.readFileSync(htmlFile, "utf8");

  if (hasImagesSection(html)) {
    stats.alreadyDone++;
    return;
  }

  const existingImages = mergedManifest[lessonSlug];
  if (!existingImages || !existingImages.length) {
    stats.noMatch++;
    return;
  }

  if (!IS_DRY) {
    fs.mkdirSync(LESSON_IMAGES_DIR, { recursive: true });
    for (const filename of existingImages) {
      const dest = path.join(LESSON_IMAGES_DIR, filename);
      if (!fs.existsSync(dest)) {
        // Could be from NL or NR — try NL assets first, then NR
        const nlSrc = path.join(NL_ASSETS, filename);
        if (fs.existsSync(nlSrc)) fs.copyFileSync(nlSrc, dest);
      }
    }
  }

  const relToRoot = getRelToRoot(htmlFile);
  const imagesSection = buildImagesSection(existingImages, relToRoot);
  const newHtml = injectIntoPage(html, imagesSection);

  if (!IS_DRY) fs.writeFileSync(htmlFile, newHtml);
  stats.injected++;
}

function walkCourses(dir, mergedManifest, stats) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      walkCourses(path.join(dir, entry.name), mergedManifest, stats);
    } else if (entry.name === "index.html") {
      const htmlFile = path.join(dir, entry.name);
      if (TEST_SLUG && path.basename(path.dirname(htmlFile)) !== TEST_SLUG) continue;
      try {
        processLesson(htmlFile, mergedManifest, stats);
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

  const nlIndex = buildNLIndex();
  console.log(`NursesLabs index built: ${nlIndex.size} slug entries`);

  const existingManifest = loadManifest();
  console.log(`Existing manifest: ${Object.keys(existingManifest).length} slugs already covered (from Nurses Revision)`);

  console.log("Building NursesLabs manifest additions (unmatched slugs only)...");
  const additions = buildNLManifestAdditions(nlIndex, existingManifest);
  console.log(`  NursesLabs additions: ${Object.keys(additions).length} new lesson slugs`);

  // Merge: NR entries take priority (not overwritten)
  const mergedManifest = { ...existingManifest, ...additions };

  if (!IS_DRY) {
    fs.mkdirSync(path.dirname(MANIFEST_FILE), { recursive: true });
    fs.writeFileSync(MANIFEST_FILE, JSON.stringify(mergedManifest, null, 2));
    console.log(`  Manifest updated: ${Object.keys(mergedManifest).length} total slugs`);

    // Copy all new NL images
    fs.mkdirSync(LESSON_IMAGES_DIR, { recursive: true });
    let copied = 0;
    for (const filenames of Object.values(additions)) {
      for (const filename of filenames) {
        const src = path.join(NL_ASSETS, filename);
        const dest = path.join(LESSON_IMAGES_DIR, filename);
        if (fs.existsSync(src) && !fs.existsSync(dest)) {
          fs.copyFileSync(src, dest);
          copied++;
        }
      }
    }
    if (copied) console.log(`  Copied: ${copied} new NursesLabs images to lesson-images/`);
  }

  if (MANIFEST_ONLY) {
    console.log("Done (manifest-only).");
    return;
  }

  // Inject only into pages that are still unprocessed (no images section yet)
  const stats = { injected: 0, alreadyDone: 0, noMatch: 0, errors: 0 };
  walkCourses(COURSES_ROOT, mergedManifest, stats);

  console.log(`\nDone${IS_DRY ? " (dry run)" : ""}:`);
  console.log(`  Pages injected  : ${stats.injected}`);
  console.log(`  Already done    : ${stats.alreadyDone}`);
  console.log(`  No match/images : ${stats.noMatch}`);
  console.log(`  Errors          : ${stats.errors}`);
}

main();
