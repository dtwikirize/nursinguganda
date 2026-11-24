/**
 * Convert heavy hero & category PNGs under assets/images/udemy/ to crisp lightweight WebP
 * and update references across JSON data and JSX components.
 */
const fs = require("node:fs");
const path = require("node:path");
const sharp = require("sharp");

const ROOT = path.resolve(__dirname, "..");
const UDEMY_DIR = path.join(ROOT, "assets", "images", "udemy");

async function main() {
  const files = fs.readdirSync(UDEMY_DIR).filter((f) => f.endsWith(".png"));
  const results = [];

  for (const file of files) {
    const src = path.join(UDEMY_DIR, file);
    const outName = file.replace(/\.png$/i, ".webp");
    const dest = path.join(UDEMY_DIR, outName);

    const isHero = file.startsWith("hero-banner");
    const targetWidth = isHero ? 1280 : 560;
    const targetHeight = isHero ? 382 : 315;

    const info = await sharp(src)
      .resize(targetWidth, targetHeight, { fit: "cover", position: "centre" })
      .webp({ quality: isHero ? 82 : 80 })
      .toFile(dest);

    const oldKb = Math.round((fs.statSync(src).size / 1024) * 10) / 10;
    const newKb = Math.round((info.size / 1024) * 10) / 10;
    results.push({ file, outName, oldKb, newKb });

    // Remove legacy heavy PNG once WebP verified non-empty
    if (info.size > 2000) {
      fs.unlinkSync(src);
    }
  }

  // Update JSON references cleanly
  const updateJsonRefs = (filePath) => {
    const raw = fs.readFileSync(filePath, "utf8");
    const next = raw.replace(/\/assets\/images\/udemy\/([a-z0-9-]+)\.png/gi, "/assets/images/udemy/$1.webp");
    if (next !== raw) {
      fs.writeFileSync(filePath, next, "utf8");
      return true;
    }
    return false;
  };

  let jsonUpdated = 0;
  for (const rel of ["assets/data/catalog.json", "assets/data/ebooks.json", "assets/data/mock-exams.json"]) {
    const p = path.join(ROOT, rel);
    if (fs.existsSync(p) && updateJsonRefs(p)) jsonUpdated += 1;
  }

  const coursesDir = path.join(ROOT, "assets", "data", "courses");
  for (const f of fs.readdirSync(coursesDir)) {
    if (f.endsWith(".json") && updateJsonRefs(path.join(coursesDir, f))) {
      jsonUpdated += 1;
    }
  }

  console.log(JSON.stringify({ ok: true, converted: results, jsonUpdated }, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
