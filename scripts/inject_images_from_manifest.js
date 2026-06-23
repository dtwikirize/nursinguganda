#!/usr/bin/env node
/**
 * Inject lesson images into pages that have none, using the existing
 * lesson-images-manifest.json (no source website directories needed).
 *
 * For each unmatched page it:
 *  1. Extracts the lesson slug from the file path.
 *  2. Looks up the manifest for an exact or fuzzy slug match.
 *  3. Injects a <details class="seo-lesson-section" id="lesson-images"> block
 *     immediately before the </article> or before the first seo-actions nav after
 *     the article content.
 *
 * Usage:
 *   node scripts/inject_images_from_manifest.js          (live run)
 *   node scripts/inject_images_from_manifest.js --dry    (preview, no writes)
 *   node scripts/inject_images_from_manifest.js --report (show matches only)
 */

const fs   = require("node:fs");
const path = require("node:path");

const ROOT      = process.cwd();
const COURSES   = path.join(ROOT, "courses");
const MANIFEST_F = path.join(ROOT, "assets", "data", "lesson-images-manifest.json");
const IMG_BASE   = "./assets/images/lesson-images/";

const IS_DRY     = process.argv.includes("--dry");
const REPORT     = process.argv.includes("--report");

// ─── load manifest ────────────────────────────────────────────────────────────
const manifest = JSON.parse(fs.readFileSync(MANIFEST_F, "utf8"));
const manifestKeys = Object.keys(manifest);

// ─── helpers ──────────────────────────────────────────────────────────────────
function slugTokens(slug) {
  return slug.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim().split(" ").filter(Boolean);
}

const GENERIC = new Set([
  "system","intro","introduction","overview","notes","study","guide",
  "nursing","care","plan","health","disease","therapy","treatment",
  "types","type","basic","general","common","clinical","medical","patient",
  "approach","management","assessment","principles","concept","concepts",
  "definition","definitions","drug","drugs","blood","body","and","the","of",
  "to","for","in","a","an","with","its","by",
]);

function meaningfulTokens(tokens) {
  return tokens.filter(t => t.length > 2 && !GENERIC.has(t));
}

function scoreMatch(lessonSlug, manifestKey) {
  const lt = meaningfulTokens(slugTokens(lessonSlug));
  const mt = meaningfulTokens(slugTokens(manifestKey));
  if (!lt.length || !mt.length) return 0;
  const overlap = lt.filter(t => mt.includes(t)).length;
  const pct = overlap / Math.max(lt.length, mt.length);
  return pct;
}

function findBestMatch(slug) {
  // 1. exact
  if (manifest[slug]) return { key: slug, images: manifest[slug], score: 1.0 };
  // 2. slug contains manifest key or vice versa (prefix/suffix)
  for (const key of manifestKeys) {
    if (slug === key) continue;
    if (slug.includes(key) || key.includes(slug)) {
      return { key, images: manifest[key], score: 0.9 };
    }
  }
  // 3. token overlap ≥ 50%
  let best = null;
  let bestScore = 0;
  for (const key of manifestKeys) {
    const s = scoreMatch(slug, key);
    if (s > bestScore) { bestScore = s; best = key; }
  }
  if (bestScore >= 0.6) {
    return { key: best, images: manifest[best], score: bestScore };
  }
  return null;
}

function relToRoot(filePath) {
  const rel = path.relative(path.dirname(filePath), ROOT).replace(/\\/g, "/");
  return rel ? `${rel}/` : "./";
}

function buildImagesBlock(images, rootRel) {
  const MAX_IMGS = 8;
  const shown = images.slice(0, MAX_IMGS);
  const figures = shown.map(img => {
    const alt = img.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").replace(/\b\w/g, c => c.toUpperCase());
    return `          <figure style="margin:0;break-inside:avoid"><img src="${rootRel}assets/images/lesson-images/${img}" alt="${alt}" loading="lazy" style="max-width:100%;height:auto;border-radius:8px;border:1px solid var(--seo-border);display:block"><figcaption style="font-size:.82rem;color:var(--seo-muted);margin-top:4px;text-align:center">${alt}</figcaption></figure>`;
  }).join("\n");
  return `\n      <details class="seo-lesson-section" id="lesson-images">\n        <summary>Illustrations and Diagrams (${shown.length})</summary>\n        <div class="lesson-images-section" style="display:grid;gap:16px;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));padding:8px 0">\n${figures}\n        </div>\n        \n      </details>`;
}

// ─── find pages without images ─────────────────────────────────────────────
function walk(dir, results = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) { walk(full, results); continue; }
    if (entry.name === "index.html") results.push(full);
  }
  return results;
}

const allPages = walk(COURSES);
const unmatched = allPages.filter(f => {
  const html = fs.readFileSync(f, "utf8");
  return !html.includes("lesson-images-section");
});

console.log(`Total pages: ${allPages.length}`);
console.log(`Without images: ${unmatched.length}`);

let injected = 0;
let skipped  = 0;

for (const filePath of unmatched) {
  // Derive the lesson slug from the path
  const parts   = filePath.replace(/\\/g, "/").split("/courses/")[1]?.split("/").filter(p => p && p !== "index.html") || [];
  const slug    = parts[parts.length - 1]; // last folder name (the lesson slug)
  if (!slug) { skipped++; continue; }

  const match = findBestMatch(slug);
  if (!match) { skipped++; continue; }

  if (REPORT) {
    console.log(`  MATCH  ${slug.padEnd(52)} ← ${match.key} (score=${match.score.toFixed(2)}, ${match.images.length} imgs)`);
    injected++;
    continue;
  }

  let html = fs.readFileSync(filePath, "utf8");
  const rootRel = relToRoot(filePath);
  const block   = buildImagesBlock(match.images, rootRel);

  // Insert before </article> if it exists, otherwise before the last seo-actions nav
  let updated;
  if (html.includes("</article>")) {
    updated = html.replace("</article>", `${block}\n      </article>`);
  } else if (html.includes('<nav class="seo-actions"')) {
    updated = html.replace('<nav class="seo-actions"', `${block}\n    <nav class="seo-actions"`);
  } else {
    // fallback: before </main>
    updated = html.replace("</main>", `${block}\n  </main>`);
  }

  if (updated === html) { skipped++; continue; }

  if (!IS_DRY) {
    fs.writeFileSync(filePath, updated, "utf8");
  }

  injected++;
  if (injected <= 5 || injected % 50 === 0) {
    console.log(`  [${IS_DRY ? "DRY" : "OK"}] ${slug} ← ${match.key} (${match.images.length} imgs)`);
  }
}

console.log(`\nDone. Injected: ${injected} | Skipped (no match): ${skipped}${IS_DRY ? " [DRY RUN]" : ""}`);
