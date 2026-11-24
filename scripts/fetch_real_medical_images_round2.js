/**
 * Round 2: Fetch remaining medical condition/anatomy & instrument images via Wikimedia Commons API
 * with cleaner, broader medical terms so ZERO box/card SVGs remain anywhere!
 */
const fs = require("node:fs");
const path = require("node:path");
const sharp = require("sharp");

const ROOT = path.resolve(__dirname, "..");
const ILLUS_DIR = path.join(ROOT, "assets", "images", "medical-illustrations");
const INST_DIR = path.join(ROOT, "assets", "images", "medical-instruments");
const UA = "NursingUgandaEduBot/1.0 (https://nursinguganda.com; support@nursinguganda.com)";

const DOMAIN_ROUND2 = [
  { file: "pharmacology-adme.webp", queries: ["intravenous drip infusion", "syringes vials medication", "pills tablets pharmacy"] },
  { file: "endocrine-glands.webp", queries: ["Endocrine system", "Illu endocrine system", "Thyroid gland"] },
  { file: "skin-wound-healing.webp", queries: ["Decubitus ulcer", "Bedsores", "Skin anatomy diagram", "Wound healing"] },
  { file: "eye-ear-sensory.webp", queries: ["Human eye anatomy", "Eye diagram", "Middle ear anatomy"] },
  { file: "nursing-vitals-assessment.webp", queries: ["Blood pressure measurement", "Sphygmomanometer", "Stethoscope examination"] },
  { file: "leadership-research-ethics.webp", queries: ["Nurse Uganda hospital", "Africa hospital nurses", "Medical team rounds"] },
  { file: "condition-sickle-cell.webp", queries: ["Sickle cell blood", "Sickle-cell disease", "Drepanocyte"] },
  { file: "condition-burns-wound.webp", queries: ["Burn degree skin", "Rule of nines", "Thermal burn"] },
  { file: "condition-goitre-thyroid.webp", queries: ["Goitre", "Goiter", "Struma thyroid"] }
];

const INST_ROUND2 = [
  { slug: "venturi-oxygen-mask", queries: ["Oxygen mask", "Venturi mask", "Medical oxygen"] },
  { slug: "penguin-bulb-suction", queries: ["Bulb syringe", "Nasal aspirator", "Suction bulb"] },
  { slug: "partograph-chart-board", queries: ["Partogram", "Partograph", "Obstetric chart"] },
  { slug: "burette-iv-chamber", queries: ["Intravenous therapy", "Infusion bottle", "Drip chamber"] },
  { slug: "three-way-stopcock", queries: ["Stopcock valve", "Medical stopcock", "Luer lock"] },
  { slug: "muac-tape", queries: ["Mid-upper arm circumference", "MUAC", "Malnutrition screening"] },
  { slug: "infantometer-length-board", queries: ["Baby length measurement", "Infant height", "Stadiometer"] },
  { slug: "oto-ophthalmoscope-set", queries: ["Otoscope", "Ophthalmoscope", "Welch Allyn"] },
  { slug: "toomey-irrigation-syringe", queries: ["Syringe 50 ml", "Medical syringe", "Catheter syringe"] },
  { slug: "mosquito-curved-halstead", queries: ["Hemostat forceps", "Artery forceps", "Surgical forceps"] },
  { slug: "fundal-height-tape", queries: ["Measuring tape", "Fundal height", "Tape measure"] }
];

async function searchWikimediaImage(query) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrsearch=${encodeURIComponent(query)}&gsrlimit=8&prop=imageinfo&iiprop=url|mime|size&iiurlwidth=900&format=json`;
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) return null;
  const json = await res.json();
  const pages = Object.values(json?.query?.pages || {});
  pages.sort((a, b) => (a.index || 99) - (b.index || 99));

  for (const p of pages) {
    const ii = p.imageinfo?.[0];
    if (!ii) continue;
    const mime = (ii.mime || "").toLowerCase();
    if (!["image/jpeg", "image/png", "image/webp"].includes(mime)) continue;
    if ((ii.width || 0) < 280 || (ii.height || 0) < 200) continue;
    return { url: ii.thumburl || ii.url, title: p.title };
  }
  return null;
}

async function downloadAndSaveWebp(imgUrl, outPath, width, height) {
  const res = await fetch(imgUrl, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 3000) throw new Error("Too small");
  await sharp(buf)
    .resize(width, height, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .sharpen({ sigma: 0.6 })
    .webp({ quality: 86 })
    .toFile(outPath);
  return Math.round(fs.statSync(outPath).size / 1024);
}

async function main() {
  const domainOut = [];
  for (const d of DOMAIN_ROUND2) {
    let saved = null;
    for (const q of d.queries) {
      const hit = await searchWikimediaImage(q);
      if (hit) {
        try {
          const kb = await downloadAndSaveWebp(hit.url, path.join(ILLUS_DIR, d.file), 960, 640);
          saved = { file: d.file, source: hit.title, kb };
          break;
        } catch {}
      }
    }
    domainOut.push(saved || { file: d.file, status: "still_missing" });
  }

  const instOut = [];
  for (const inst of INST_ROUND2) {
    let saved = null;
    for (const q of inst.queries) {
      const hit = await searchWikimediaImage(q);
      if (hit) {
        try {
          const kb = await downloadAndSaveWebp(hit.url, path.join(INST_DIR, `${inst.slug}.webp`), 800, 600);
          saved = { slug: inst.slug, source: hit.title, kb };
          break;
        } catch {}
      }
    }
    instOut.push(saved || { slug: inst.slug, status: "still_missing" });
  }

  console.log(JSON.stringify({ ok: true, domainOut, instOut }, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
