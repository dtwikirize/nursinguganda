#!/usr/bin/env node
/**
 * Third-pass image injection — relaxed matching.
 *
 * Only operates on lesson slugs that are STILL unmatched after the two primary
 * passes (Nurses Revision + NursesLabs).  Uses a looser token-overlap rule:
 *
 *   ≥1 meaningful token overlap  (was ≥2)
 *   ≥40% of lesson tokens match  (was ≥70%)
 *
 * Also checks the reverse direction (NR/NL tokens in lesson tokens) so that
 * short source filenames can still match longer lesson slugs.
 *
 * Usage:
 *   node scripts/inject_lesson_images_relaxed.js              (live run)
 *   node scripts/inject_lesson_images_relaxed.js --dry        (dry run)
 *   node scripts/inject_lesson_images_relaxed.js --manifest-only
 *   node scripts/inject_lesson_images_relaxed.js --report     (show match list, no writes)
 */

const fs   = require("node:fs");
const path = require("node:path");

const ROOT        = process.cwd();
const NR_DIR      = path.resolve(ROOT, "..", "Nurses revision", "Nurses_Revision_Full");
const NR_ASSETS   = path.join(NR_DIR, "assets");
const NL_DIR      = path.resolve(ROOT, "..", "NursesLabs Clone", "NursesLabs_Full");
const NL_ASSETS   = path.join(NL_DIR, "assets");
const LESSON_IMG  = path.join(ROOT, "assets", "images", "lesson-images");
const COURSES     = path.join(ROOT, "courses");
const MANIFEST_F  = path.join(ROOT, "assets", "data", "lesson-images-manifest.json");

const IS_DRY       = process.argv.includes("--dry");
const MANIFEST_ONLY= process.argv.includes("--manifest-only");
const REPORT_ONLY  = process.argv.includes("--report");

const SKIP_NR  = /^(pupo-|nursing-uganda-favicon|placeholder|spinner|loading|avatar|logo|wp-emoji|gravatar)/i;
const SKIP_NL  = /^(logo-nurseslabs|logo-|nursing-uganda-favicon|placeholder|spinner|loading|avatar|gravatar|wp-emoji|advert|menu-item|jquery|analytics)/i;
const IMG_EXT  = /\.(jpg|jpeg|png|webp|gif)$/i;
const THUMB    = /-\d{2,4}x\d{2,4}\.(jpg|jpeg|png|webp|gif)$/i;

const NR_SUFFIX = /(-(notes?|summary|overview|details?|revision|part|volume|v?\d+))+$/i;
const NL_NURSING = [
  /-(nursing-care-plans?-and-nursing-diagnosis)$/,
  /-(nursing-care-plans?)$/,
  /-(nursing-notes?-and-study-guides?)$/,
  /-(nursing-notes?)$/,
  /-(nursing-diagnosis)$/,
  /-(study-guides?)$/,
  /-(care-plans?)$/,
  /-(overview|notes?|summary|review|guide|v?\d+)$/,
];

function normalizeNR(v) {
  return v.toLowerCase().replace(NR_SUFFIX, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
function normalizeNL(v) {
  let s = v.toLowerCase().replace(/^\d+-/, "");
  for (const re of NL_NURSING) s = s.replace(re, "");
  return s.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

// Generic tokens that should never drive a match on their own
const GENERIC = new Set([
  "system","intro","introduction","overview","notes","study","guide",
  "nursing","care","plan","health","disease","therapy","treatment",
  "types","type","basic","general","common","clinical","medical","patient",
  "approach","change","changes","management","assessment","intervention",
  "principles","concept","concepts","practice","review","chapter","unit",
  "part","course","lecture","module","term","terms","topic","lesson",
  "definition","definitions","drug","drugs","blood","body","pain",
  // Additional broad terms that match too many unrelated pages
  "disorders","disorder","structure","function","history","analysis",
  "anatomy","physiology","methods","tissue","process","using","skills",
  "evaluation","technique","techniques","findings","patient","clients",
  "applied","causes","signs","effects","features","stages","phases",
  "upper","lower","major","minor","components","component","levels",
  "introduction","advanced","applied","special","normal","abnormal",
]);

// Meaningful tokens only: ≥5 chars and not generic
function tokens(slug) {
  return slug.split("-").filter(t => t.length >= 5 && !GENERIC.has(t));
}

function relaxedScore(lessonSlug, sourceSlug) {
  const lt = tokens(lessonSlug);
  const st = new Set(tokens(sourceSlug));
  if (!lt.length || !st.size) return 0;
  // Forward: how many lesson tokens appear in source
  const fwd = lt.filter(t => st.has(t)).length / lt.length;
  // Reverse: how many source tokens appear in lesson
  const lt2 = new Set(lt);
  const rev = [...st].filter(t => lt2.has(t)).length / st.size;
  return Math.max(fwd, rev);
}

function buildIndex(dir, normFn) {
  const index = new Map();
  if (!fs.existsSync(dir)) return index;
  for (const file of fs.readdirSync(dir).filter(f => f.endsWith(".html"))) {
    const base = path.basename(file, ".html");
    const n = normFn(base);
    if (!index.has(n)) index.set(n, file);
  }
  return index;
}

function findRelaxed(slug, index, normFn) {
  const norm = normFn(slug);
  if (index.has(norm)) return { file: index.get(norm), score: 1.0 };
  if (index.has(slug)) return { file: index.get(slug), score: 1.0 };
  let best = null, bestScore = 0;
  for (const [idxSlug, file] of index) {
    const s = relaxedScore(norm, idxSlug);
    if (s > bestScore && s >= 0.4) {
      bestScore = s;
      best = { file, score: s };
    }
  }
  return best;
}

function extractImages(html, skipRe, isNL) {
  const seen = new Set(), out = [];
  const re = /<img[^>]+>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const tag = m[0];
    const src = tag.match(/\bsrc="assets\/([^"]+)"/i);
    if (!src) continue;
    const f = src[1];
    if (!IMG_EXT.test(f)) continue;
    if (skipRe.test(f)) continue;
    if (isNL && THUMB.test(f)) continue;
    if (seen.has(f)) continue;
    seen.add(f);
    out.push(f);
  }
  return out;
}

function loadManifest() {
  try { return JSON.parse(fs.readFileSync(MANIFEST_F, "utf8")); } catch { return {}; }
}

function collectSlugs() {
  const s = new Set();
  function walk(dir) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      if (e.isDirectory()) walk(path.join(dir, e.name));
      else if (e.name === "index.html") s.add(path.basename(path.dirname(path.join(dir, e.name))));
    }
  }
  if (fs.existsSync(COURSES)) walk(COURSES);
  return s;
}

function main() {
  const manifest = loadManifest();
  const all = collectSlugs();
  const unmatched = [...all].filter(s => !manifest[s]);
  console.log(`Existing manifest : ${Object.keys(manifest).length} slugs`);
  console.log(`Total lesson slugs: ${all.size}`);
  console.log(`Unmatched         : ${unmatched.length}`);

  const nrIndex = buildIndex(NR_DIR, normalizeNR);
  const nlIndex = buildIndex(NL_DIR, normalizeNL);
  console.log(`NR index: ${nrIndex.size} | NL index: ${nlIndex.size}`);

  const additions = {};
  let tried = 0;

  for (const slug of unmatched) {
    tried++;
    // Try NR first
    const nrMatch = findRelaxed(slug, nrIndex, normalizeNR);
    if (nrMatch) {
      const html = fs.readFileSync(path.join(NR_DIR, nrMatch.file), "utf8");
      const imgs = extractImages(html, SKIP_NR, false).filter(f => fs.existsSync(path.join(NR_ASSETS, f)));
      if (imgs.length) {
        additions[slug] = { filenames: imgs, source: "NR", score: nrMatch.score, file: nrMatch.file };
        continue;
      }
    }
    // Try NL
    const nlMatch = findRelaxed(slug, nlIndex, normalizeNL);
    if (nlMatch) {
      const html = fs.readFileSync(path.join(NL_DIR, nlMatch.file), "utf8");
      const imgs = extractImages(html, SKIP_NL, true).filter(f => fs.existsSync(path.join(NL_ASSETS, f)));
      if (imgs.length) {
        additions[slug] = { filenames: imgs, source: "NL", score: nlMatch.score, file: nlMatch.file };
      }
    }
  }

  console.log(`\nNew matches found : ${Object.keys(additions).length}`);

  if (REPORT_ONLY) {
    for (const [slug, info] of Object.entries(additions)) {
      console.log(`  ${slug.padEnd(50)} ← ${info.file} (${info.source}, score=${info.score.toFixed(2)}, imgs=${info.filenames.length})`);
    }
    return;
  }

  // Build updated manifest
  const newManifest = { ...manifest };
  for (const [slug, info] of Object.entries(additions)) {
    newManifest[slug] = info.filenames;
  }

  if (!IS_DRY && !MANIFEST_ONLY) {
    // Copy new images
    fs.mkdirSync(LESSON_IMG, { recursive: true });
    let copied = 0;
    for (const [slug, info] of Object.entries(additions)) {
      const assetsDir = info.source === "NR" ? NR_ASSETS : NL_ASSETS;
      for (const f of info.filenames) {
        const dest = path.join(LESSON_IMG, f);
        if (!fs.existsSync(dest)) {
          const src = path.join(assetsDir, f);
          if (fs.existsSync(src)) { fs.copyFileSync(src, dest); copied++; }
        }
      }
    }
    console.log(`Images copied     : ${copied}`);
  }

  if (!IS_DRY) {
    fs.mkdirSync(path.dirname(MANIFEST_F), { recursive: true });
    fs.writeFileSync(MANIFEST_F, JSON.stringify(newManifest, null, 2));
    console.log(`Manifest written  : ${Object.keys(newManifest).length} total slugs`);
  } else {
    console.log(`[Dry run] Would write ${Object.keys(newManifest).length} slugs to manifest`);
  }
  console.log("Done.");
}

main();
