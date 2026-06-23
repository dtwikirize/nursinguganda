#!/usr/bin/env node
/* Build a browser-readable medical instruments catalogue from assets/images/medical-instruments. */
const fs = require("node:fs");
const path = require("node:path");

const ROOT = process.cwd();
const IMAGE_DIR = path.join(ROOT, "assets", "images", "medical-instruments");
const OUT_FILE = path.join(ROOT, "assets", "data", "medical-instruments.json");

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function titleCase(value) {
  const small = new Set(["and", "or", "of", "the", "for", "in", "to"]);
  return String(value || "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .map((word, index) => {
      const lower = word.toLowerCase();
      if (index && small.has(lower)) return lower;
      if (/^[A-Z]{2,5}$/.test(word)) return word;
      if (["ett", "mva"].includes(lower)) return lower.toUpperCase();
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(" ");
}

function categoryFor(name) {
  const text = name.toLowerCase();
  if (/forceps|scissor|blade|holder|retractor|dilator|sound|curette|vulsellum|tenaculum|needle|clip|hook|elevator|gag|probe|sims/.test(text)) {
    if (/cord|fetal|amni|ovum|uterine|vaginal|cervical|auvard|cusco|wrigley|mva/.test(text)) return "Midwifery And Obstetric Instruments";
    if (/dental|teeth|root/.test(text)) return "Dental And ENT Instruments";
    return "Theatre And Surgical Instruments";
  }
  if (/air|airway|ett|laryngoscope|trache|suction|mucus|nebulizer|inhaler|oxygen/.test(text)) return "Airway, Oxygen And Emergency Care";
  if (/auriscope|ophthalmoscope|otoscope|snellen|tuning|penlight|patella|glucometer|pulse|scope|height/.test(text)) return "Assessment And Diagnostic Equipment";
  if (/catheter|urinal|bed-pan|bed pan|colostomy|enema|sputum|vomit|urinometer|penile/.test(text)) return "Elimination And Specimen Care";
  if (/bed|backrest|footrest|cradle|trapeze|sandbag|screen|cardiac|trolley|table|hot water|bin|drape|tray|drum|goggles/.test(text)) return "Ward, Comfort And Infection Prevention";
  if (/ampoule|vial|giving|syringe|cup|mortar|pestle/.test(text)) return "Medication And Fluid Therapy";
  return "General Clinical Instruments";
}

function categoryBody(category) {
  return {
    "Assessment And Diagnostic Equipment": "Tools used for observation, screening, examination and routine clinical monitoring.",
    "Airway, Oxygen And Emergency Care": "Equipment used to maintain airway, support breathing and manage urgent clinical situations.",
    "Theatre And Surgical Instruments": "Instruments used in sterile procedures, tissue handling, cutting, clamping and retraction.",
    "Midwifery And Obstetric Instruments": "Instruments used during antenatal care, labour, delivery, postnatal care and gynecological procedures.",
    "Dental And ENT Instruments": "Specialized tools used for oral, dental, ear, nose and throat assessment or procedures.",
    "Elimination And Specimen Care": "Bedside equipment used for urinary, bowel, stoma, sputum and specimen management.",
    "Ward, Comfort And Infection Prevention": "Ward equipment used for positioning, comfort, safe care, environmental control and infection prevention.",
    "Medication And Fluid Therapy": "Items used for medication preparation, measurement, administration and fluid therapy.",
    "General Clinical Instruments": "Common equipment used across nursing skills laboratories and clinical care areas."
  }[category] || "Common clinical instruments for nursing and midwifery practice.";
}

function useFor(name, category) {
  const n = name.toLowerCase();
  if (/forceps/.test(n)) return `${name} is used to hold, grasp, clamp or handle tissue, swabs, dressings or procedure materials depending on its design.`;
  if (/scissor/.test(n)) return `${name} is used for cutting sutures, dressings, cord, tissue or procedure materials according to the specific type.`;
  if (/catheter/.test(n)) return `${name} is used to drain urine, access a body passage, or support a related clinical procedure where ordered.`;
  if (/scope|auriscope|ophthalmoscope|endoscope|laryngoscope/.test(n)) return `${name} is used to visualize or assess a body area during examination or airway management.`;
  if (/syringe|vial|ampoule|giving set|cup|glucometer/.test(n)) return `${name} supports medication, fluid therapy, specimen testing or bedside measurement.`;
  if (/bed|backrest|footrest|cradle|trapeze|table|trolley|screen/.test(n)) return `${name} supports patient positioning, privacy, comfort, transport or ward procedure organization.`;
  if (/air|ett|trache|nebulizer|inhaler|suction|mucus/.test(n)) return `${name} is used in airway care, respiratory support, oxygen delivery or secretion management.`;
  if (/fetal|cord|amni|uterine|vaginal|cervical|mva|ovum|vulsellum|wrigley/.test(n)) return `${name} is used in midwifery, gynecological or obstetric care under appropriate clinical guidance.`;
  if (/urinal|bed pan|bed-pan|colostomy|enema|sputum|vomit|urinometer|penile/.test(n)) return `${name} assists elimination care, specimen collection, output observation or patient hygiene.`;
  return `${name} is a clinical instrument used during nursing assessment, procedures, patient care or skills laboratory practice.`;
}

function preparationFor(name, category) {
  const n = name.toLowerCase();
  if (/forceps|scissor|dilator|sound|curette|blade|retractor|needle|hook|holder|clip/.test(n)) return "Confirm the correct type and size, check function, confirm sterility where required, and arrange it on the tray before exposing the patient.";
  if (/catheter|tube|ett|air|suction|nebulizer|inhaler/.test(n)) return "Check size, patency, cleanliness, required accessories and patient identity; explain the procedure and prepare infection prevention supplies.";
  if (/bed|backrest|footrest|cradle|trapeze|screen|table|trolley/.test(n)) return "Inspect stability and cleanliness, position it safely, lock wheels where present, and ensure patient comfort and privacy.";
  if (/vial|ampoule|giving|glucometer|cup/.test(n)) return "Check expiry, cleanliness, compatibility and required prescription or test request before use.";
  return "Inspect the item, confirm cleanliness or sterility as needed, gather accessories, explain the procedure and prepare a safe working area.";
}

function safetyFor(name, category) {
  const n = name.toLowerCase();
  if (/needle|blade|scissor|forceps|hook|curette|dilator|sound|clip/.test(n)) return "Use aseptic technique when required, handle tips and sharp edges carefully, avoid tissue trauma and dispose or decontaminate according to local protocol.";
  if (/air|ett|trache|suction|nebulizer|inhaler/.test(n)) return "Monitor breathing, oxygenation and patient response; avoid prolonged or forceful use and escalate respiratory distress promptly.";
  if (/catheter|urinal|bed pan|colostomy|enema|sputum|vomit/.test(n)) return "Maintain privacy, use gloves, prevent contamination, observe output where needed and clean equipment promptly after use.";
  if (/bed|trapeze|trolley|table|screen|backrest|footrest/.test(n)) return "Prevent falls, pressure injury and pinching; ensure the equipment is stable before leaving the patient.";
  return "Follow infection prevention, patient dignity, correct identification, safe handling and documentation requirements.";
}

function examPointsFor(name, category) {
  return [
    `Identify ${name} by its correct name and category.`,
    "State the main use in one clear sentence.",
    "Mention preparation before use, including cleanliness or sterility where relevant.",
    "Give one patient-safety or infection-prevention point."
  ];
}

function build() {
  const files = fs.readdirSync(IMAGE_DIR)
    .filter((file) => /\.(png|jpe?g|webp|gif)$/i.test(file))
    .sort((a, b) => a.localeCompare(b));

  const usedSlugs = new Map();
  const instruments = files.map((file) => {
    const base = path.basename(file, path.extname(file));
    const name = titleCase(base.replace(/[’']/g, "'"));
    const category = categoryFor(name);
    const baseSlug = slugify(name) || "instrument";
    const count = usedSlugs.get(baseSlug) || 0;
    usedSlugs.set(baseSlug, count + 1);
    const slug = count ? `${baseSlug}-${count + 1}` : baseSlug;

    return {
      name,
      slug,
      category,
      image: `assets/images/medical-instruments/${file}`,
      imageAlt: `${name} medical instrument reference image`,
      use: useFor(name, category),
      preparation: preparationFor(name, category),
      safety: safetyFor(name, category),
      examPoints: examPointsFor(name, category)
    };
  });

  const categories = [...new Set(instruments.map((item) => item.category))]
    .map((title) => ({
      title,
      body: categoryBody(title),
      items: instruments.filter((item) => item.category === title)
    }));

  for (const instrument of instruments) {
    const sameCategory = instruments
      .filter((item) => item.category === instrument.category && item.slug !== instrument.slug)
      .slice(0, 4);
    const fallback = instruments
      .filter((item) => item.slug !== instrument.slug && !sameCategory.some((related) => related.slug === item.slug))
      .slice(0, 4 - sameCategory.length);
    instrument.related = [...sameCategory, ...fallback].map((item) => item.slug);
  }

  const output = {
    generatedAt: new Date().toISOString(),
    source: "assets/images/medical-instruments",
    count: instruments.length,
    categories
  };

  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
  fs.writeFileSync(OUT_FILE, `${JSON.stringify(output, null, 2)}\n`);
  console.log(`Built ${instruments.length} medical instrument records in ${path.relative(ROOT, OUT_FILE)}.`);
}

build();
