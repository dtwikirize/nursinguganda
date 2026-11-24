/**
 * Fetch authentic, high-resolution public/open-license medical, disease, pathology,
 * clinical photography, and surgical instrument images via Wikimedia Commons API,
 * replacing ALL UI/flowchart box diagrams with real photographs and textbook plates.
 */
const fs = require("node:fs");
const path = require("node:path");
const sharp = require("sharp");

const ROOT = path.resolve(__dirname, "..");
const ILLUS_DIR = path.join(ROOT, "assets", "images", "medical-illustrations");
const INST_DIR = path.join(ROOT, "assets", "images", "medical-instruments");

const UA = "NursingUgandaEduBot/1.0 (https://nursinguganda.com; support@nursinguganda.com)";

// Curated Wikimedia queries prioritizing clear JPEG/PNG medical illustrations & photography (skip SVG charts)
const DOMAIN_REPLACEMENTS = [
  {
    file: "pharmacology-adme.webp",
    query: "intravenous cannula infusion therapy hospital nurse",
    fallbackQuery: "intramuscular injection site deltoid anatomy",
    alt: "Intravenous drug administration and clinical infusion"
  },
  {
    file: "endocrine-glands.webp",
    query: "Blausen endocrine system thyroid adrenal pancreas",
    fallbackQuery: "thyroid gland goitre anatomy",
    alt: "Human endocrine glands anatomy (thyroid, adrenal, pancreas)"
  },
  {
    file: "blood-immune-lymphatic.webp",
    query: "Anatomy of the lymphatic system.jpg",
    fallbackQuery: "Blausen white blood cells erythrocytes platelets",
    alt: "Human lymphatic system & blood cells anatomy"
  },
  {
    file: "skin-wound-healing.webp",
    query: "Blausen pressure ulcer stages skin wound",
    fallbackQuery: "granulation tissue wound healing ulcer",
    alt: "Clinical skin anatomy and pressure ulcer wound staging"
  },
  {
    file: "eye-ear-sensory.webp",
    query: "Blausen Eye Anatomy iris retina optic nerve",
    fallbackQuery: "Blausen Ear Anatomy tympanic membrane cochlea",
    alt: "Human eye and sensory organ anatomical cross-section"
  },
  {
    file: "nursing-vitals-assessment.webp",
    query: "nurse measuring blood pressure stethoscope patient",
    fallbackQuery: "pulse oximeter fingertip oxygen monitor",
    alt: "Nurse measuring clinical vital signs with stethoscope & sphygmomanometer"
  },
  {
    file: "emergency-cpr-triage.webp",
    query: "cardiopulmonary resuscitation chest compressions CPR training",
    fallbackQuery: "automated external defibrillator CPR training",
    alt: "Cardiopulmonary resuscitation and emergency airway management"
  },
  {
    file: "mental-health-biopsychosocial.webp",
    query: "brain MRI scan neuroimaging Alzheimer hippocampus",
    fallbackQuery: "human brain sagittal MRI medical",
    alt: "Human brain neuroimaging and mental health neurobiology"
  },
  {
    file: "leadership-research-ethics.webp",
    query: "african nurses hospital ward rounds healthcare team",
    fallbackQuery: "nurses doctors ward rounds hospital bedside",
    alt: "Nursing clinical ward rounds and healthcare team leadership"
  },
  // Dedicated high-yield Ugandan Disease & Condition Plates!
  {
    file: "condition-malaria-smear.webp",
    query: "Plasmodium falciparum rings thick thin blood smear",
    fallbackQuery: "malaria blood smear Plasmodium falciparum",
    alt: "Plasmodium falciparum malaria parasites on blood smear"
  },
  {
    file: "condition-tb-pneumonia-xray.webp",
    query: "pulmonary tuberculosis chest radiograph pneumonia X-ray",
    fallbackQuery: "lobar pneumonia chest X-ray",
    alt: "Chest radiograph showing pneumonia and tuberculosis lung pathology"
  },
  {
    file: "condition-sickle-cell.webp",
    query: "sickle cell anemia blood smear erythrocytes",
    fallbackQuery: "drepanocytes sickle cell peripheral blood film",
    alt: "Sickled erythrocytes on peripheral blood smear microscopy"
  },
  {
    file: "condition-preeclampsia-placenta.webp",
    query: "human placenta obstetrics umbilical cord",
    fallbackQuery: "placenta praevia abruption illustration",
    alt: "Obstetric placenta and umbilical vascular anatomy"
  },
  {
    file: "condition-burns-wound.webp",
    query: "second degree thermal burn blisters medical",
    fallbackQuery: "rule of nines burns percentage",
    alt: "Clinical partial-thickness burn assessment"
  },
  {
    file: "condition-goitre-thyroid.webp",
    query: "thyroid goitre clinical examination neck",
    fallbackQuery: "thyroid gland anatomy multinodular goiter",
    alt: "Clinical thyroid enlargement (goitre) presentation"
  }
];

const INSTRUMENT_PHOTO_QUERIES = [
  { slug: "ambu-bag-resuscitator", q: "bag valve mask resuscitator Ambu" },
  { slug: "venturi-oxygen-mask", q: "Venturi oxygen mask" },
  { slug: "non-rebreather-mask", q: "non-rebreather oxygen mask reservoir" },
  { slug: "yankauer-suction-tip", q: "Yankauer suction tip" },
  { slug: "magill-intubating-forceps", q: "Magill forceps intubation" },
  { slug: "nasopharyngeal-airway", q: "nasopharyngeal airway tube" },
  { slug: "aed-defibrillator-pads", q: "automated external defibrillator AED" },
  { slug: "foetal-doppler-monitor", q: "fetal doppler ultrasound handheld" },
  { slug: "mva-syringe-cannulae", q: "manual vacuum aspiration syringe Karman" },
  { slug: "penguin-bulb-suction", q: "neonatal bulb syringe suction" },
  { slug: "neonatal-resuscitation-bag", q: "neonatal resuscitation bag mask infant" },
  { slug: "partograph-chart-board", q: "WHO partograph labour monitoring" },
  { slug: "iv-cannula-set", q: "intravenous cannula catheter venflon" },
  { slug: "blood-transfusion-set", q: "blood transfusion IV set bag" },
  { slug: "burette-iv-chamber", q: "burette IV infusion set paediatric" },
  { slug: "three-way-stopcock", q: "three-way stopcock medical luer" },
  { slug: "insulin-syringe-u100", q: "insulin syringe U-100 needle" },
  { slug: "sharps-safety-box", q: "sharps container medical biohazard" },
  { slug: "muac-tape", q: "MUAC malnutrition tape child" },
  { slug: "infantometer-length-board", q: "infantometer baby length measuring board" },
  { slug: "sphygmomanometer-bp", q: "aneroid sphygmomanometer blood pressure cuff" },
  { slug: "peak-flow-meter", q: "peak expiratory flow meter asthma" },
  { slug: "urinalysis-reagent-strips", q: "urine test dipstick reagent strips" },
  { slug: "oto-ophthalmoscope-set", q: "ophthalmoscope otoscope diagnostic set" },
  { slug: "toomey-irrigation-syringe", q: "50ml catheter tip irrigation syringe" },
  { slug: "mosquito-curved-halstead", q: "Halsted mosquito hemostat forceps" },
  { slug: "mayo-hegar-needle-holder", q: "Mayo-Hegar needle holder surgical" },
  { slug: "bard-parker-scalpel-handle", q: "surgical scalpel handle Bard Parker blade" },
  { slug: "langenbeck-retractor", q: "Langenbeck surgical retractor" },
  { slug: "morris-retractor", q: "surgical abdominal retractor stainless" },
  { slug: "littauer-suture-scissors", q: "suture removal scissors hook blade" },
  { slug: "metzenbaum-scissors", q: "Metzenbaum surgical dissecting scissors" },
  { slug: "rampley-sponge-forceps", q: "Rampley sponge holding forceps" },
  { slug: "fundal-height-tape", q: "prenatal fundal height measuring tape" },
  { slug: "umbilical-cord-clamp-sterile", q: "umbilical cord clamp plastic" },
  { slug: "nebulizer-compressor-unit", q: "nebulizer mask compressor medical" },
  { slug: "urine-specimen-container", q: "urine sample specimen cup sterile" },
  { slug: "oxygen-concentrator-humidifier", q: "oxygen concentrator medical cylinder humidifier" }
];

async function searchWikimediaImage(query) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrsearch=${encodeURIComponent(query)}&gsrlimit=6&prop=imageinfo&iiprop=url|mime|size&iiurlwidth=900&format=json`;
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) return null;
  const json = await res.json();
  const pages = Object.values(json?.query?.pages || {});
  pages.sort((a, b) => (a.index || 99) - (b.index || 99));

  for (const p of pages) {
    const ii = p.imageinfo?.[0];
    if (!ii) continue;
    const mime = (ii.mime || "").toLowerCase();
    // Strictly prefer crisp raster photos / illustrations (skip raw SVG posters or tiny icons)
    if (!["image/jpeg", "image/png", "image/webp"].includes(mime)) continue;
    if ((ii.width || 0) < 300 || (ii.height || 0) < 220) continue;
    const dlUrl = ii.thumburl || ii.url;
    if (dlUrl) {
      return { url: dlUrl, title: p.title, width: ii.width, height: ii.height };
    }
  }
  return null;
}

async function downloadAndSaveWebp(imgUrl, outPath, { fit = "contain", bg = { r: 255, g: 255, b: 255, alpha: 1 }, width = 900, height = 640 } = {}) {
  const res = await fetch(imgUrl, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 4000) throw new Error("Tiny image buffer");
  await sharp(buf)
    .resize(width, height, { fit, background: bg })
    .sharpen({ sigma: 0.6 })
    .webp({ quality: 86 })
    .toFile(outPath);
  return fs.statSync(outPath).size;
}

async function main() {
  const domainResults = [];
  for (const d of DOMAIN_REPLACEMENTS) {
    let hit = await searchWikimediaImage(d.query);
    if (!hit && d.fallbackQuery) hit = await searchWikimediaImage(d.fallbackQuery);
    const outPath = path.join(ILLUS_DIR, d.file);
    if (hit) {
      try {
        const bytes = await downloadAndSaveWebp(hit.url, outPath, { fit: "contain", width: 960, height: 640 });
        domainResults.push({ file: d.file, status: "updated", source: hit.title, kb: Math.round(bytes / 1024) });
        continue;
      } catch (e) {
        domainResults.push({ file: d.file, status: "error", err: e.message });
      }
    } else {
      domainResults.push({ file: d.file, status: "not_found" });
    }
  }

  const instResults = [];
  for (const inst of INSTRUMENT_PHOTO_QUERIES) {
    let hit = await searchWikimediaImage(inst.q);
    if (!hit) hit = await searchWikimediaImage(inst.q.split(" ").slice(0, 2).join(" ") + " medical");
    const outPath = path.join(INST_DIR, `${inst.slug}.webp`);
    if (hit) {
      try {
        const bytes = await downloadAndSaveWebp(hit.url, outPath, { fit: "contain", width: 800, height: 600 });
        instResults.push({ slug: inst.slug, status: "updated", source: hit.title, kb: Math.round(bytes / 1024) });
      } catch (e) {
        instResults.push({ slug: inst.slug, status: "error", err: e.message });
      }
    } else {
      instResults.push({ slug: inst.slug, status: "kept_existing" });
    }
  }

  console.log(JSON.stringify({
    ok: true,
    domainUpdated: domainResults.filter((x) => x.status === "updated").length,
    domainResults,
    instUpdated: instResults.filter((x) => x.status === "updated").length,
    instMissing: instResults.filter((x) => x.status !== "updated")
  }, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
