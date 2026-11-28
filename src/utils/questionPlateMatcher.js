/**
 * Clinical Visual Rationale Plate Matcher
 * Maps exam & quiz questions to 1280x800 high-yield clinical plates
 * with clinical pearls, summaries, and full-screen modal zoom support.
 */

const HIGH_YIELD_PLATES = [
  {
    id: "condition-burns-rule-of-nines",
    file: "/assets/images/medical-illustrations/condition-burns-rule-of-nines.webp",
    title: "Wallace Rule of Nines & Parkland Fluid Resuscitation",
    keywords: ["burn", "burns", "parkland", "rule of nines", "tbsa", "blister", "scald", "carbon monoxide", "escharotomy", "hartmann"],
    clinicalPearl: "Adults: Head 9%, Each Arm 9%, Anterior Trunk 18%, Posterior Trunk 18%, Each Leg 18%, Perineum 1%. Fluid of choice is Lactated Ringer's (4 mL × kg × %TBSA), with 50% given in the first 8 hours from injury."
  },
  {
    id: "condition-atopic-dermatitis-anaphylaxis",
    file: "/assets/images/medical-illustrations/condition-atopic-dermatitis-anaphylaxis.webp",
    title: "Atopic Dermatitis, Seborrheic Cradle Cap & Skin Allergies",
    keywords: ["cradle cap", "seborrheic", "dermatitis", "eczema", "atopic", "scales", "infantile rash", "pruritus", "emollient"],
    clinicalPearl: "Seborrheic dermatitis (cradle cap) presents with non-pruritic thick greasy yellow scales on scalp. Treat by softening with mineral or baby oil, followed by gentle brushing with a soft-bristled brush."
  },
  {
    id: "pharmacology-insulin-diabetes-therapy",
    file: "/assets/images/medical-illustrations/pharmacology-insulin-diabetes-therapy.webp",
    title: "Insulin Delivery, Peak Profiles & Diabetic Neuropathy",
    keywords: ["diabetes", "diabetic", "neuropathy", "insulin", "hypoglycemia", "hyperglycemia", "dka", "metformin", "glargine", "lispro", "numbness in feet"],
    clinicalPearl: "Diabetic peripheral neuropathy presents with distal 'stocking-glove' numbness and paresthesias. Daily foot inspection, lukewarm water testing, and prompt wound care prevent severe ulceration and amputation."
  },
  {
    id: "paed-newborn-resuscitation-apgar-kmc",
    file: "/assets/images/medical-illustrations/paed-newborn-resuscitation-apgar-kmc.webp",
    title: "Immediate Newborn Care, HBB Resuscitation & APGAR Scoring",
    keywords: ["apgar", "newborn", "resuscitation", "neonate", "kmc", "kangaroo mother care", "acrocyanosis", "clamping", "cord care", "1 minute", "5 minutes"],
    clinicalPearl: "APGAR assesses 5 vital parameters (0-2 points each): Appearance, Pulse, Grimace, Activity, and Respiration. Score 7-10 indicates good condition; score 0-3 warrants immediate resuscitation."
  },
  {
    id: "medsurg-cardiovascular-mi-hf",
    file: "/assets/images/medical-illustrations/medsurg-cardiovascular-mi-hf.webp",
    title: "Cardiovascular Emergencies: Myocardial Infarction & Telemetry",
    keywords: ["infarction", "angina", "troponin", "mona", "stemi", "nstemi", "cardiac arrest", "chest pain", "ecg", "rhythm", "dysrhythmia", "heart failure"],
    clinicalPearl: "Acute coronary syndrome protocol: Immediate chewable Aspirin (162-325 mg), sublingual Nitroglycerin (hold if SBP <90 mmHg or PDE-5 inhibitor use), continuous 12-lead ECG monitoring, and urgent catheterization."
  },
  {
    id: "pharmacology-respiratory-asthma-bronchodilators",
    file: "/assets/images/medical-illustrations/pharmacology-respiratory-asthma-bronchodilators.webp",
    title: "Respiratory Pharmacology: Asthma, Inhalers & Bronchodilators",
    keywords: ["asthma", "albuterol", "bronchodilator", "inhaler", "mdi", "spacer", "wheezing", "peak flow", "corticosteroid", "beclomethasone", "fluticasone"],
    clinicalPearl: "When using both a bronchodilator and an inhaled corticosteroid, inhale the fast-acting bronchodilator (Albuterol) first to dilate airways, wait 1-2 minutes, then inhale the steroid. Rinse mouth thoroughly to prevent thrush."
  },
  {
    id: "medsurg-stroke-cva-hemorrhage",
    file: "/assets/images/medical-illustrations/medsurg-stroke-cva-hemorrhage.webp",
    title: "Cerebrovascular Accident (Stroke): Ischaemic vs Haemorrhagic",
    keywords: ["stroke", "cva", "tpa", "alteplase", "facial droop", "hemiparesis", "aphasia", "dysarthria", "thrombolytic", "unilateral weakness"],
    clinicalPearl: "Assess FAST signs immediately. Non-contrast brain CT is essential to exclude hemorrhage before administering IV alteplase (tPA), which must be initiated within 3 to 4.5 hours of symptom onset."
  },
  {
    id: "neuro-brain-lobes-motor-sensory-gcs",
    file: "/assets/images/medical-illustrations/neuro-brain-lobes-motor-sensory-gcs.webp",
    title: "Glasgow Coma Scale (GCS), Cranial Pressures & Cushing's Triad",
    keywords: ["gcs", "glasgow coma", "cushing", "intracranial pressure", "icp", "pupil", "coma", "decerebrate", "decorticate", "brainstem", "neurological assessment"],
    clinicalPearl: "GCS evaluates Eye (4), Verbal (5), and Motor (6). A score of 8 or less indicates severe coma ('GCS 8, intubate!'). Cushing's triad (widening pulse pressure, bradycardia, irregular respirations) signals herniation."
  },
  {
    id: "hub-uk-nmc-pathway-news2",
    file: "/assets/images/medical-illustrations/hub-uk-nmc-pathway-news2.webp",
    title: "National Early Warning Score (NEWS2) & Arterial Blood Gas (ABG)",
    keywords: ["abg", "acidosis", "alkalosis", "respiratory acidosis", "metabolic acidosis", "paco2", "hco3", "arterial blood gas", "rome rule", "deterioration", "news2"],
    clinicalPearl: "ROME: Respiratory Opposite (pH & PaCO2 opposite), Metabolic Equal (pH & HCO3 same). Any single vital score of 3 or total score >= 5 triggers urgent clinical escalation."
  },
  {
    id: "paed-imci-dehydration-ors-plans",
    file: "/assets/images/medical-illustrations/paed-imci-dehydration-ors-plans.webp",
    title: "IMCI Dehydration Assessment & Oral Rehydration Therapy (ORS)",
    keywords: ["dehydration", "ors", "oral rehydration", "imci", "sunken fontanelle", "skin pinch", "diarrhea", "cholera", "fluid deficit", "some dehydration"],
    clinicalPearl: "Plan B (Some Dehydration) prescribes 75 mL/kg ORS solution administered orally over 4 hours with frequent spoonfuls. Reassess after 4 hours; switch to Plan C (IV Ringer's Lactate) if severe."
  },
  {
    id: "condition-preeclampsia-placenta",
    file: "/assets/images/medical-illustrations/condition-preeclampsia-placenta.webp",
    title: "Pre-Eclampsia, Magnesium Sulfate & Antepartum Hemorrhage",
    keywords: ["preeclampsia", "eclampsia", "magnesium sulfate", "placenta previa", "placental abruption", "clonus", "proteinuria", "calcium gluconate"],
    clinicalPearl: "Magnesium sulfate toxicity check: Deep tendon reflexes (+2 normal; 0 is toxicity), Respiratory rate (>12 bpm required), and Urine output (>30 mL/hr). Antidote is 10% Calcium Gluconate IV push."
  },
  {
    id: "leadership-management-styles-delegation",
    file: "/assets/images/medical-illustrations/leadership-management-styles-delegation.webp",
    title: "Nursing Leadership, Safe Delegation & Legal Accountability",
    keywords: ["delegation", "delegate", "uap", "unlicensed assistive", "assistive personnel", "lpn", "lvn", "scope of practice", "leadership style", "democratic", "authoritarian"],
    clinicalPearl: "Do NOT delegate what you can EAT: Evaluation, Assessment, and Teaching. UAPs perform routine, predictable tasks on stable clients (ADLs, vital signs, intake/output)."
  },
  {
    id: "medsurg-haematology-sickle-transfusion",
    file: "/assets/images/medical-illustrations/medsurg-haematology-sickle-transfusion.webp",
    title: "Sickle Cell Crisis & Blood Transfusion Reaction Protocols",
    keywords: ["sickle cell", "vaso-occlusive", "transfusion", "blood reaction", "hemolytic", "packed red blood cells", "blood typing", "fever during transfusion"],
    clinicalPearl: "If acute transfusion reaction occurs (fever, chills, flank pain, dyspnea): STOP transfusion immediately, maintain IV access with 0.9% Normal Saline on new IV tubing, notify MD, and return blood bag to lab."
  },
  {
    id: "condition-varicella-scabies-skin-rashes",
    file: "/assets/images/medical-illustrations/condition-varicella-scabies-skin-rashes.webp",
    title: "Communicable Skin Eruptions: Varicella vs. Scabies",
    keywords: ["scabies", "varicella", "chickenpox", "shingles", "burrows", "permethrin", "vesicles", "maculopapular", "itchy rash"],
    clinicalPearl: "Varicella requires Airborne and Contact precautions until all vesicles are crusted over. Scabies burrows in webbing of fingers; treat whole household with Permethrin 5% cream from neck down."
  },
  {
    id: "medsurg-meningitis-lumbar-puncture",
    file: "/assets/images/medical-illustrations/medsurg-meningitis-lumbar-puncture.webp",
    title: "Bacterial Meningitis, Nuchal Rigidity & Lumbar Puncture",
    keywords: ["meningitis", "lumbar puncture", "kernig", "brudzinski", "nuchal rigidity", "csf", "photophobia", "spinal tap"],
    clinicalPearl: "Droplet precautions are mandatory for bacterial meningitis until 24 hours of IV antibiotic therapy. Positive Kernig's (pain on knee extension) and Brudzinski's (neck flexion causes hip flexion) confirm meningeal irritation."
  },
  {
    id: "condition-snakebite-stings-envenomation",
    file: "/assets/images/medical-illustrations/condition-snakebite-stings-envenomation.webp",
    title: "Envenomation, Anaphylaxis & IM Epinephrine Protocol",
    keywords: ["snakebite", "envenomation", "antivenom", "sting", "anaphylaxis", "epipen", "epinephrine", "stridor", "angioedema"],
    clinicalPearl: "Anaphylaxis first-line treatment is Epinephrine 1:1,000 (0.01 mg/kg; max 0.3-0.5 mg) injected IM into the anterolateral mid-thigh. Never delay epinephrine for antihistamines or steroids."
  },
  {
    id: "paed-neonatal-jaundice-phototherapy",
    file: "/assets/images/medical-illustrations/paed-neonatal-jaundice-phototherapy.webp",
    title: "Neonatal Hyperbilirubinemia, Kernicterus & Phototherapy",
    keywords: ["jaundice", "phototherapy", "kernicterus", "hyperbilirubinemia", "bilirubin", "bili light", "eye shields"],
    clinicalPearl: "Protect eyes with opaque patches and cover genitals during phototherapy. Monitor hydration status, temperature, and stool frequency. Turn infant every 2 hours to maximize skin exposure."
  },
  {
    id: "paed-nephrotic-vs-nephritic-syndrome",
    file: "/assets/images/medical-illustrations/paed-nephrotic-vs-nephritic-syndrome.webp",
    title: "Pediatric Renal Disorders: Nephrotic vs. Nephritic Syndrome",
    keywords: ["nephrotic", "nephritic", "proteinuria", "edema", "hypoalbuminemia", "hematuria", "glomerulonephritis", "periorbital edema"],
    clinicalPearl: "Nephrotic syndrome causes massive proteinuria (>3.5g/24h), severe hypoalbuminemia, and massive generalized edema (anasarca). Treat with corticosteroids and sodium restriction."
  },
  {
    id: "medsurg-urinary-catheterization-uti",
    file: "/assets/images/medical-illustrations/medsurg-urinary-catheterization-uti.webp",
    title: "Urinary Catheterization & CAUTI Prevention Standards",
    keywords: ["catheter", "foley", "cauti", "urinary retention", "indwelling", "bladder irrigation", "catheterization"],
    clinicalPearl: "Keep the drainage bag below the level of the bladder at all times to prevent backflow and CAUTI. Maintain a sterile closed system and remove catheter as early as clinically feasible."
  },
  {
    id: "medsurg-shock-haemorrhage-cpr",
    file: "/assets/images/medical-illustrations/medsurg-shock-haemorrhage-cpr.webp",
    title: "Emergency Resuscitation: Shock, Hemorrhage & BLS/CPR",
    keywords: ["shock", "cpr", "bls", "chest compressions", "defibrillation", "hypovolemic", "septic shock", "anaphylactic shock", "resuscitation"],
    clinicalPearl: "High-quality CPR: 100-120 compressions/min, at least 2 inches (5 cm) depth, full chest recoil, and minimal interruptions. In witnessed VF/pVT, defibrillate immediately."
  },
  {
    id: "micro-chain-of-infection-pathogenesis",
    file: "/assets/images/medical-illustrations/micro-chain-of-infection-pathogenesis.webp",
    title: "Infection Control: PPE Sequences & Isolation Precautions",
    keywords: ["isolation", "precautions", "ppe", "droplet", "airborne", "contact", "n95", "donning", "doffing", "chain of infection"],
    clinicalPearl: "Airborne precautions (Tuberculosis, Measles, Varicella): N95 respirator mask and negative-pressure airflow room. Doffing PPE order: Gloves -> Goggles/Shield -> Gown -> Mask (last)."
  },
  {
    id: "neuro-epilepsy-status-epilepticus-firstaid",
    file: "/assets/images/medical-illustrations/neuro-epilepsy-status-epilepticus-firstaid.webp",
    title: "Status Epilepticus & Seizure First Aid Clinical Safety",
    keywords: ["seizure", "epilepsy", "status epilepticus", "convulsion", "tonic-clonic", "postictal", "diazepam", "lorazepam"],
    clinicalPearl: "Seizure safety: Ease patient to floor, turn to side to maintain patent airway, protect head with padding. NEVER restrain limbs and NEVER insert anything into the mouth. Time the seizure."
  },
  {
    id: "nclex-ngn-cat-question-formats",
    file: "/assets/images/medical-illustrations/nclex-ngn-cat-question-formats.webp",
    title: "NCSBN Clinical Judgment Measurement Model (CJMM) & CAT",
    keywords: ["cjmm", "clinical judgment", "recognize cues", "analyze cues", "prioritize hypotheses", "generate solutions", "take action", "evaluate outcomes", "ngn"],
    clinicalPearl: "NCSBN CJMM 6-step cycle: 1. Recognize Cues -> 2. Analyze Cues -> 3. Prioritize Hypotheses -> 4. Generate Solutions -> 5. Take Action -> 6. Evaluate Outcomes."
  },
  {
    id: "medsurg-endocrine-goitre-diabetes",
    file: "/assets/images/medical-illustrations/medsurg-endocrine-goitre-diabetes.webp",
    title: "Endocrine Surgery: Thyroidectomy & Hypocalcemia Alerts",
    keywords: ["thyroid", "thyroidectomy", "goitre", "trousseau", "chvostek", "hypocalcemia", "calcium", "parathyroid", "stridor"],
    clinicalPearl: "Post-thyroidectomy priority: Keep a tracheostomy tray and Calcium Gluconate at the bedside. Assess for accidental parathyroidectomy signs: Chvostek's sign (facial twitching) and Trousseau's sign (carpal spasm)."
  },
  {
    id: "pharmacology-diuretics-nephron-sites",
    file: "/assets/images/medical-illustrations/pharmacology-diuretics-nephron-sites.webp",
    title: "Diuretic Nephron Sites: Furosemide, Thiazides & Spironolactone",
    keywords: ["furosemide", "lasix", "diuretic", "spironolactone", "hydrochlorothiazide", "hypokalemia", "potassium", "aldosterone"],
    clinicalPearl: "Loop diuretics (Furosemide) act on the ascending limb of Henle and waste potassium (monitor for hypokalemia, muscle cramps, and dysrhythmias). Spironolactone spares potassium."
  },
  {
    id: "safety-disaster-management-triage",
    file: "/assets/images/medical-illustrations/safety-disaster-management-triage.webp",
    title: "Disaster Management & Simple Triage and Rapid Treatment (START)",
    keywords: ["triage", "start triage", "mass casualty", "mci", "disaster", "green tag", "red tag", "yellow tag", "black tag"],
    clinicalPearl: "START Triage color tags: RED (Immediate, life-threatening), YELLOW (Delayed, serious but stable), GREEN (Minor, walking wounded), BLACK (Deceased or expectant non-salvageable)."
  }
];

/**
 * Searches the clinical plate database for the best matching visual diagram
 * based on the question prompt, rationale, and answer options.
 */
export function findQuestionVisualPlate(question, context = {}) {
  if (!question) return null;

  const textToSearch = [
    question.prompt || "",
    question.rationale || "",
    ...(question.options || []),
    context.unitTitle || "",
    context.topicTitle || ""
  ]
    .join(" ")
    .toLowerCase();

  let bestMatch = null;
  let highestScore = 0;

  for (const plate of HIGH_YIELD_PLATES) {
    let score = 0;
    for (const kw of plate.keywords) {
      const lowerKw = kw.toLowerCase();
      // Whole-word or sub-phrase match
      if (textToSearch.includes(lowerKw)) {
        // Boost longer, specific keywords
        score += lowerKw.length >= 6 ? 3 : 2;
        // High bonus if keyword is in prompt or rationale
        if ((question.prompt || "").toLowerCase().includes(lowerKw)) score += 3;
        if ((question.rationale || "").toLowerCase().includes(lowerKw)) score += 2;
      }
    }

    if (score > highestScore && score >= 4) {
      highestScore = score;
      bestMatch = { ...plate, matchScore: score };
    }
  }

  return bestMatch;
}
