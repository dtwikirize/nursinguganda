#!/usr/bin/env node
/**
 * Compress and convert lesson images to WebP.
 *
 * For every image in assets/images/lesson-images/ that is a JPG, PNG, JPEG, or GIF:
 *   1. Resize to max 1200px wide (keeps aspect ratio)
 *   2. Re-encode as WebP at quality 82
 *   3. Save as <basename>.webp  (removes the old file)
 *   4. Update the manifest so generate_seo_pages.js uses the new filenames
 *
 * Already-WebP files are only processed if > 80KB (re-compressed to save space).
 *
 * Usage:
 *   node scripts/optimize_lesson_images.js          (live)
 *   node scripts/optimize_lesson_images.js --dry    (dry run, no writes)
 *   node scripts/optimize_lesson_images.js --report (show stats, no writes)
 */

const fs   = require("node:fs");
const path = require("node:path");

const ROOT         = process.cwd();
const IMAGES_DIR   = path.join(ROOT, "assets", "images", "lesson-images");
const MANIFEST_F   = path.join(ROOT, "assets", "data", "lesson-images-manifest.json");
const IS_DRY       = process.argv.includes("--dry") || process.argv.includes("--report");
const MAX_WIDTH    = 1200;
const WEBP_QUALITY = 82;

async function main() {
  let sharp;
  try {
    sharp = require("sharp");
  } catch {
    console.error("sharp not found. Run: npm install sharp --save-dev");
    process.exit(1);
  }

  const files = fs.readdirSync(IMAGES_DIR).filter(f =>
    /\.(jpg|jpeg|png|gif|webp)$/i.test(f)
  );

  console.log(`Images found     : ${files.length}`);

  let processed = 0, skipped = 0, saved = 0, errors = 0;
  // Map: oldFilename → newFilename (only entries that changed)
  const renames = new Map();

  for (const filename of files) {
    const src  = path.join(IMAGES_DIR, filename);
    const stat = fs.statSync(src);
    const ext  = path.extname(filename).toLowerCase();
    const base = path.basename(filename, ext);
    const newName = base + ".webp";
    const dest = path.join(IMAGES_DIR, newName);

    // Skip: already WebP and small enough
    if (ext === ".webp" && stat.size <= 80 * 1024) {
      skipped++;
      continue;
    }

    try {
      let pipeline = sharp(src).resize({ width: MAX_WIDTH, withoutEnlargement: true });
      // GIFs: extract first frame only
      if (ext === ".gif") pipeline = pipeline.gif ? pipeline : sharp(src, { pages: 1 }).resize({ width: MAX_WIDTH, withoutEnlargement: true });
      pipeline = pipeline.webp({ quality: WEBP_QUALITY });

      const originalSize = stat.size;
      let newSize = 0;

      if (!IS_DRY) {
        const buf = await pipeline.toBuffer();
        newSize = buf.length;

        // Only replace if we actually made it smaller (or it's a format change)
        if (ext !== ".webp" || newSize < originalSize) {
          fs.writeFileSync(dest, buf);
          if (ext !== ".webp" && dest !== src) {
            fs.unlinkSync(src);   // delete original non-webp file
          }
        }
      } else {
        const { data, info } = await pipeline.toBuffer({ resolveWithObject: true });
        newSize = info.size;
      }

      const delta = originalSize - newSize;
      saved += Math.max(0, delta);
      processed++;

      if (filename !== newName) renames.set(filename, newName);

      if (processed <= 10 || processed % 100 === 0) {
        const pct = ((1 - newSize / originalSize) * 100).toFixed(0);
        console.log(`  ${filename.padEnd(50)} ${(originalSize/1024).toFixed(0)}KB → ${(newSize/1024).toFixed(0)}KB (${pct}%)`);
      }
    } catch (err) {
      errors++;
      if (errors <= 5) console.warn(`  WARN: ${filename}: ${err.message}`);
    }
  }

  console.log(`\nProcessed : ${processed}`);
  console.log(`Skipped   : ${skipped} (already optimised WebP)`);
  console.log(`Errors    : ${errors}`);
  console.log(`Space saved: ${(saved / 1024 / 1024).toFixed(1)} MB`);
  console.log(`Renames   : ${renames.size} files got new .webp names`);

  if (IS_DRY) {
    console.log("\n[Dry run — no files written]");
    return;
  }

  // Update manifest
  if (renames.size > 0) {
    const manifest = JSON.parse(fs.readFileSync(MANIFEST_F, "utf8"));
    let manifestChanges = 0;
    for (const [slug, filenames] of Object.entries(manifest)) {
      const updated = filenames.map(f => renames.has(f) ? renames.get(f) : f);
      if (updated.some((f, i) => f !== filenames[i])) {
        manifest[slug] = updated;
        manifestChanges++;
      }
    }
    fs.writeFileSync(MANIFEST_F, JSON.stringify(manifest, null, 2));
    console.log(`Manifest updated: ${manifestChanges} slugs had filenames changed`);
    console.log("\nNext step: run  npm run build:pages  to rebuild SEO pages with new image names.");
  } else {
    console.log("No filename changes — manifest unchanged.");
  }
}

main().catch(err => { console.error(err); process.exit(1); });
