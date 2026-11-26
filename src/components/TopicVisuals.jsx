import React from "react";
import { AlertTriangle, CheckCircle2, Layers, Sparkles, Table2 } from "lucide-react";
import RichText from "./RichText";

const IMAGE_VERSION = "20261126a";

function withImgVersion(src) {
  const s = String(src || "");
  if (!s) return s;
  if (s.includes("/assets/images/medical-illustrations/") && !s.includes("?v=")) {
    return `${s}?v=${IMAGE_VERSION}`;
  }
  return s;
}

const DOMAIN_TABLES = {
  cardiovascular: {
    title: "Cardiac Circulation & Hemodynamic Reference Values",
    badge: "Cardiovascular",
    headers: ["Parameter / Structure", "Normal Range / Pathway", "High-Yield Clinical Significance"],
    rows: [
      ["Blood Flow Order", "SVC/IVC → RA → Tricuspid → RV → Pulm. Artery → Lungs → PV → LA → Mitral → LV → Aorta", "Right side = Deoxygenated; Left side = Oxygenated"],
      ["Normal Adult BP", "< 120 / 80 mmHg (MAP 70–100 mmHg)", "HTN ≥ 140/90 mmHg; Hypotension SBP < 90 mmHg"],
      ["Heart Rate / Cardiac Output", "60–100 bpm · CO = HR × SV (~4–8 L/min)", "Tachycardia reduces ventricular filling time"],
      ["Normal ECG Intervals", "PR: 0.12–0.20s · QRS: < 0.12s", "ST elevation = acute transmural myocardial injury"]
    ]
  },
  respiratory: {
    title: "Respiratory Mechanics & Arterial Blood Gas (ABG) Table",
    badge: "Respiratory",
    headers: ["Measurement", "Normal Adult Value", "Clinical Alert"],
    rows: [
      ["Respiratory Rate & SpO2", "12–20 breaths/min · SpO2 95%–100%", "SpO2 < 90% = Severe hypoxemia (start O2 therapy)"],
      ["Arterial pH", "7.35 – 7.45", "< 7.35 Acidosis · > 7.45 Alkalosis"],
      ["PaCO2 (Respiratory)", "35 – 45 mmHg", "Retention in COPD / respiratory depression (opioids)"],
      ["HCO3- (Metabolic)", "22 – 26 mEq/L", "Low in DKA, diarrhea, renal failure"]
    ]
  },
  neurology: {
    title: "Glasgow Coma Scale (GCS 3–15) & Cranial Nerve Check",
    badge: "Neurology",
    headers: ["Component", "Score Range", "Key Clinical Check"],
    rows: [
      ["Eye Opening (E)", "1 (None) to 4 (Spontaneous)", "4 = Spontaneous, 3 = Speech, 2 = Pain, 1 = None"],
      ["Verbal Response (V)", "1 (None) to 5 (Oriented)", "5 = Oriented, 4 = Confused, 3 = Words, 2 = Sounds"],
      ["Motor Response (M)", "1 (None) to 6 (Obeys commands)", "5 = Localizes pain, 4 = Withdraws, 3/2 = Posturing"],
      ["Total GCS Interpretation", "15 Normal · ≤ 8 Severe Coma", "GCS ≤ 8: Intubate / protect airway immediately"]
    ]
  },
  renal: {
    title: "Renal Function, Urine Output & Serum Electrolytes",
    badge: "Renal & Fluids",
    headers: ["Parameter", "Normal Range", "Priority Nursing Action"],
    rows: [
      ["Minimum Urine Output", "≥ 0.5 mL/kg/hr (≥ 30 mL/hr adult)", "< 30 mL/hr = Oliguria (assess dehydration / AKI)"],
      ["Serum Sodium (Na+)", "135 – 145 mmol/L", "Rapid correction risks osmotic demyelination"],
      ["Serum Potassium (K+)", "3.5 – 5.0 mmol/L", "Hyperkalemia > 5.5 triggers tall peaked T waves"],
      ["Creatinine / BUN", "Cr: 0.6–1.2 mg/dL · BUN: 7–20 mg/dL", "Adjust nephrotoxic drugs (Gentamicin) in CKD"]
    ]
  },
  obstetric: {
    title: "Stages of Labour & Newborn APGAR Scoring Table",
    badge: "Midwifery",
    headers: ["Stage / Assessment", "Timeline / Criteria", "Uganda MoH / WHO Standard Action"],
    rows: [
      ["1st Stage (Latent → Active)", "0–3 cm Latent · 4–10 cm Active (~1 cm/hr)", "Monitor partograph, FHR q30m, contractions q30m"],
      ["2nd Stage (Delivery)", "Full dilation (10 cm) to birth of baby", "Encourage coached pushing; guard perineum"],
      ["3rd Stage (Placenta)", "Birth of baby to placenta expulsion", "AMTSL: Oxytocin 10 IU IM within 1 min + CCT"],
      ["APGAR Score (1 & 5 min)", "Appearance, Pulse, Grimace, Activity, Resp (0–10)", "7–10 Normal · 4–6 Moderate · 0–3 Resuscitate"]
    ]
  },
  pharmacology: {
    title: "Pharmacology Safety, Calculations & Antidotes Reference",
    badge: "Pharmacology",
    headers: ["Drug / Rule", "Formula / Antidote", "Clinical Nursing Watchpoint"],
    rows: [
      ["IV Drip Rate", "(Volume mL × Drop Factor) ÷ Time (min)", "Standard adult giving set = 15 or 20 gtt/mL; Burette = 60"],
      ["Heparin / Warfarin", "Protamine Sulfate / Vitamin K", "Monitor aPTT (Heparin) · INR 2.0–3.0 (Warfarin)"],
      ["Opioids / Morphine", "Naloxone (Narcan)", "Hold opioid if Respiratory Rate < 12 breaths/min"],
      ["Magnesium Sulfate (Eclampsia)", "Calcium Gluconate 10% (1g IV)", "Hold MgSO4 if RR < 16, Urine < 30 mL/hr, or absent patellar reflex"]
    ]
  },
  pharmacology_iv: {
    title: "Parenteral & IV Therapy Drug Calculation Reference",
    badge: "IV & Parenteral Care",
    headers: ["Therapy / Rule", "Formula / Monitoring Standard", "Clinical Nursing Watchpoint"],
    rows: [
      ["IV Drip Rate", "(Volume mL × Drop Factor) ÷ Time (min)", "Standard adult giving set = 15 or 20 gtt/mL; Burette = 60"],
      ["Isotonic Fluids", "0.9% Sodium Chloride · Ringer's Lactate", "Monitor lung bases & JVP for fluid overload in elderly/CKD"],
      ["Cannula Inspection", "Assess Phlebitis score & patency every shift", "Replace immediately if erythema, pain, warmth, or cord develops"],
      ["High-Alert IV Infusions", "Heparin, Insulin, Potassium Chloride, MgSO4", "Never push undiluted KCl IV; double-check rate with second nurse"]
    ]
  },
  skeletal: {
    title: "Classification of Bones, Joints & Fracture Care",
    badge: "Skeletal System",
    headers: ["Bone Class / Landmark", "Anatomical Example", "High-Yield Clinical Focus"],
    rows: [
      ["Long Bones", "Femur, Humerus, Tibia, Radius", "Diaphysis shaft (compact bone) + vascular red marrow epiphyses"],
      ["Short & Sesamoid Bones", "Carpals, Tarsals, Patella (kneecap)", "Shock absorption & tendon leverage across weight-bearing joints"],
      ["Flat & Irregular Bones", "Sternum, Ribs, Skull, Vertebrae, Pelvis", "Protect vital organs & major haematopoietic bone marrow sites"],
      ["Synovial Joints", "Hip, Knee, Shoulder (articular cartilage + synovium)", "Assess 5 Ps (Pain, Pallor, Pulselessness, Paraesthesia, Paralysis)"]
    ]
  },
  paediatrics: {
    title: "Paediatric Vital Signs & IMCI Triage Classification",
    badge: "Paediatrics",
    headers: ["Age Group / Priority", "Normal HR / RR", "IMCI / UNEPI Key Action"],
    rows: [
      ["Newborn (0–28 days)", "HR 110–160 · RR 30–60", "Keep warm (KMC), early breastfeeding, BCG + OPV0 at birth"],
      ["Infant (1–12 months)", "HR 100–150 · RR 30–50", "Pentavalent + PCV + Rota at 6, 10, 14 wks; Measles at 9m"],
      ["Toddler (1–3 years)", "HR 90–140 · RR 24–40", "Assess MUAC (< 11.5 cm = Severe Acute Malnutrition)"],
      ["IMCI Danger Signs", "Unable to drink, vomits all, convulsions, lethargic", "Pink = Urgent pre-referral antibiotic + hospital transfer"]
    ]
  },
  planes: {
    title: "Anatomical Planes, Cavities & Directional Terminology",
    badge: "Anatomy Basics",
    headers: ["Term / Plane", "Anatomical Definition", "Clinical / Surgical Example"],
    rows: [
      ["Sagittal / Midsagittal", "Divides body into Left and Right halves", "Sagittal pelvic view in midwifery delivery anatomy"],
      ["Coronal (Frontal)", "Divides body into Anterior (front) & Posterior (back)", "Coronal kidney section showing cortex & medulla"],
      ["Transverse (Axial)", "Divides body into Superior (upper) & Inferior (lower)", "Standard CT scan abdominal slice"],
      ["Proximal vs Distal", "Closer to vs farther from trunk attachment", "Brachial pulse is proximal to radial pulse"]
    ]
  },
  cell: {
    title: "Cell Biology & Microbiology Diagnostic Comparison",
    badge: "Cell & Micro",
    headers: ["Structure / Stain", "Function / Finding", "Clinical Antimicrobial Target"],
    rows: [
      ["Mitochondria", "ATP energy powerhouse (aerobic respiration)", "Cyanide/hypoxia blocks electron transport"],
      ["Ribosomes (80S vs 70S)", "Protein synthesis (80S human vs 70S bacterial)", "Macrolides & Aminoglycosides target bacterial 70S only"],
      ["Gram-Positive (Purple)", "Thick peptidoglycan cell wall (Staph, Strep)", "Penicillins & Cephalosporins inhibit cell wall synthesis"],
      ["Gram-Negative (Pink)", "Thin peptidoglycan + outer LPS endotoxin layer", "Endotoxin triggers septic shock fever & hypotension"]
    ]
  },
  digestive: {
    title: "Gastrointestinal Enzymes, Organs & Absorption Map",
    badge: "GI & Nutrition",
    headers: ["GI Region", "Primary Secretion / Enzyme", "Absorption & Clinical Pathology"],
    rows: [
      ["Stomach", "HCl (pH 1.5–2) + Pepsin + Intrinsic Factor", "B12 requires Intrinsic Factor; H. pylori / NSAIDs → PUD"],
      ["Liver & Gallbladder", "Bile salts (emulsifies dietary fats)", "Bilirubin elevation → Jaundice; Murphy's sign = Cholecystitis"],
      ["Pancreas (Exocrine)", "Amylase, Lipase, Trypsin + Bicarbonate", "↑ Serum Amylase/Lipase (> 3× normal) = Acute Pancreatitis"],
      ["Small & Large Intestine", "Villi nutrient uptake · Colon water recovery", "ORS replaces Na+ + glucose via SGLT1 co-transport in diarrhea"]
    ]
  },
  endocrine: {
    title: "Major Endocrine Glands, Hormones & Clinical Disorders",
    badge: "Endocrine",
    headers: ["Gland / Hormone", "Primary Physiologic Action", "Hypo vs Hyper Disorder"],
    rows: [
      ["Thyroid (T3 / T4)", "Basal metabolic rate, growth, CNS alertness", "Myxedema (Hypo) vs Graves' Storm (Hyper)"],
      ["Parathyroid (PTH)", "↑ Serum Ca2+ (bone resorption + renal retention)", "Low Ca2+ → Tetany (Chvostek's & Trousseau's signs)"],
      ["Pancreas (Insulin / Glucagon)", "Insulin ↓ Blood Glucose; Glucagon ↑ Blood Glucose", "Type 1 DKA (Kussmaul breathing) vs Hypoglycemia < 3.9"],
      ["Adrenal Cortex (Cortisol)", "Stress glucose mobilization & anti-inflammatory", "Addison's Crisis (↓BP, ↑K+) vs Cushing's Syndrome"]
    ]
  },
  blood: {
    title: "Complete Blood Count (CBC) & Coagulation Reference",
    badge: "Hematology",
    headers: ["Component", "Normal Adult Reference", "Clinical Interpretation"],
    rows: [
      ["Hemoglobin (Hb)", "Men: 13–17 g/dL · Women: 12–15 g/dL", "< 7 g/dL severe anemia (assess for packed RBCs)"],
      ["White Blood Cells (WBC)", "4,000 – 11,000 /µL", "Neutrophilia = Bacterial · Lymphocytosis = Viral"],
      ["Platelets (PLT)", "150,000 – 400,000 /µL", "< 50,000 high risk of mucosal & intracranial bleeding"],
      ["CD4 Count / Viral Load", "CD4 > 500 normal · < 200 AIDS-defining", "Initiate cotrimoxazole prophylaxis & ART adherence support"]
    ]
  },
  skin: {
    title: "Wound Staging, Burns Assessment & Pressure Ulcer Care",
    badge: "Wound & Skin",
    headers: ["Classification", "Tissue Depth Involved", "Nursing Management Principle"],
    rows: [
      ["Stage 1 / Superficial Burn", "Intact skin (epidermis), non-blanchable erythema", "Relieve pressure every 2h; soothe & hydrate skin"],
      ["Stage 2 / Partial Thickness", "Epidermis + Dermis (blisters / shallow ulcer)", "Keep blister intact if sterile; moist normal saline dressing"],
      ["Stage 3 / Full Thickness", "Subcutaneous fat visible (no exposed bone/tendon)", "Debride slough, manage exudate, high-protein diet"],
      ["Parkland Burn Resuscitation", "4 mL × Weight(kg) × %TBSA in 24h", "Give 50% in first 8 hrs from burn time (Ringer's Lactate)"]
    ]
  },
  sensory: {
    title: "ENT & Ophthalmology Clinical Examination Reference",
    badge: "Eye & Ear",
    headers: ["Test / Structure", "Normal Expected Finding", "Abnormal Clinical Sign"],
    rows: [
      ["PERRLA Pupil Exam", "Pupils Equal, Round, Reactive to Light & Acc.", "Fixed dilated unilateral pupil =↑ ICP emergency (CN III)"],
      ["Intraocular Pressure (IOP)", "10 – 21 mmHg", "> 21 mmHg + eye pain/halos = Acute Glaucoma"],
      ["Rinne Tuning Fork Test", "Air Conduction > Bone Conduction (AC > BC)", "BC > AC indicates Conductive Hearing Loss (wax/OME)"],
      ["Pediatric Ear Canal Exam", "Pull pinna DOWN & BACK (< 3 yrs); UP & BACK (adult)", "Bulging red tympanic membrane = Acute Otitis Media"]
    ]
  },
  mental: {
    title: "Psychiatric Medications, EPS Monitoring & Risk Matrix",
    badge: "Mental Health",
    headers: ["Medication Class / Risk", "Key Mechanism & Indication", "Priority Nurse Watchpoint"],
    rows: [
      ["SSRIs (Fluoxetine, Sertraline)", "↑ Serotonin for depression, PTSD, anxiety", "Takes 2–4 weeks; monitor early suicidal ideation & Serotonin Syndrome"],
      ["Antipsychotics (Haloperidol, Risperidone)", "D2 blockade for schizophrenia & mania", "Watch EPS (dystonia, akathisia) & Neuroleptic Malignant Syndrome"],
      ["Mood Stabilizer (Lithium)", "Bipolar mania prophylaxis (0.6–1.2 mEq/L)", "Toxicity > 1.5 mEq/L (coarse tremor, diarrhea, dehydration risk)"],
      ["Therapeutic Communication", "Open-ended, empathy, active listening", "Avoid false reassurance, 'why' questions, or arguing delusions"]
    ]
  },
  adpie: {
    title: "ADPIE Nursing Process & Clinical Priority Framework",
    badge: "Foundations",
    headers: ["Phase", "Core Clinical Action", "Documentation Standard"],
    rows: [
      ["1. Assessment", "Collect Subjective (symptoms) + Objective (vitals/IPPA)", "Verify abnormal vitals immediately against baseline"],
      ["2. Diagnosis (NANDA)", "Formulate Problem + Related-to + As-evidenced-by", "Prioritize Airway → Breathing → Circulation first"],
      ["3. Planning", "Set SMART goals (Specific, Measurable, Time-bound)", "Involve patient & family in Ugandan home-care realities"],
      ["4. Implementation & Eval", "Execute intervention safely; evaluate goal attainment", "Document date, exact time, dose, response & signature"]
    ]
  },
  emergency: {
    title: "Emergency Resuscitation, Shock Types & Triage Matrix",
    badge: "Emergency Care",
    headers: ["Emergency / Shock Type", "Key Bedside Signs", "First-Line Immediate Treatment"],
    rows: [
      ["Hypovolemic Shock", "↓ BP, ↑ HR, cold clammy skin, oliguria", "2 wide-bore IVs, Ringer's Lactate bolus, stop bleeding"],
      ["Anaphylactic Shock", "Stridor, urticaria, wheezing, hypotension", "Epinephrine (Adrenaline) 0.5 mg IM (1:1000) outer thigh STAT"],
      ["Septic Shock", "Fever/hypothermia, warm flushed early → ↓BP", "Blood cultures, broad-spectrum IV antibiotics < 1 hr, fluids"],
      ["Cardiac Arrest (BLS)", "Unresponsive, no breathing, no carotid pulse", "Immediate CPR 30:2 at 100–120/min, depth 5–6 cm + AED"]
    ]
  },
  leadership: {
    title: "Nursing Ethics, Delegation Rights & Research Methodology",
    badge: "Leadership & Ethics",
    headers: ["Concept", "Core Components", "UNMC Accountability Rule"],
    rows: [
      ["4 Ethical Principles", "Autonomy, Beneficence, Non-Maleficence, Justice", "Patient informed consent is mandatory prior to invasive care"],
      ["5 Rights of Delegation", "Right Task, Circumstance, Person, Direction, Supervision", "Initial assessment, IV push & teaching cannot be delegated to UAP"],
      ["PICO Clinical Question", "Population · Intervention · Comparison · Outcome", "Guides evidence-based literature search before ward policy change"],
      ["PDSA Quality Cycle", "Plan → Do → Study → Act", "Continuous infection-control & maternal safety improvement"]
    ]
  },
  malaria: {
    title: "Uganda MoH Malaria Classification & Antimalarial Protocol",
    badge: "Malaria & Parasitology",
    headers: ["Severity Classification", "Diagnostic & Clinical Criteria", "First-Line Uganda MoH Regimen"],
    rows: [
      ["Uncomplicated Malaria", "Positive RDT / smear + fever, chills, zero danger signs", "Oral Artemether-Lumefantrine (Coartem) BD x 3 days + Paracetamol"],
      ["Severe Malaria", "Prostration, impaired GCS, convulsions, hypoglycaemia, blackwater", "IV Artesunate 2.4 mg/kg at 0, 12, 24h (>20kg) or 3.0 mg/kg (<20kg)"],
      ["Pregnancy (Trimester 1)", "Symptomatic malaria in first 12 weeks gestation", "Oral Quinine + Clindamycin (or Artesunate if severe | save mother's life!)"],
      ["Hypoglycaemia Check", "Blood glucose < 2.2–2.5 mmol/L on ward glucometer", "IV Dextrose 10% (2–5 mL/kg child) / 50% Dextrose 50 mL adult"]
    ]
  },
  pneumonia_tb: {
    title: "Pneumonia & Pulmonary Tuberculosis Clinical Reference",
    badge: "Respiratory Pathology",
    headers: ["Condition", "Key Radiograph / Clinical Finding", "Priority Nursing Intervention"],
    rows: [
      ["Pulmonary TB", "Chronic cough >2 wks, night sweats, weight loss, apical cavitations", "GeneXpert sputum test, airborne mask isolation, 6-mo 2RHZE/4RH DOTS"],
      ["Lobar Pneumonia", "Dense consolidation on CXR, fever, productive rust sputum, tachypnoea", "Sputum C&S before antibiotics, O2 if SpO2 < 92%, Amoxicillin/Ceftriaxone"],
      ["Paediatric IMCI", "Fast breathing >=60 (<2m), >=50 (2–11m), >=40 (1–5y), chest indrawing", "Oral Dispersible Amoxicillin 40 mg/kg BD or IV Ampicillin + Gentamicin"],
      ["Pleural Effusion", "Blunted costophrenic angle meniscus, stony dull percussion", "Assist diagnostic/therapeutic thoracocentesis sitting leaning forward"]
    ]
  },
  sickle_cell: {
    title: "Sickle Cell Disease (HbSS) Crisis & Hydroxyurea Matrix",
    badge: "Haematology Pathology",
    headers: ["Crisis Type", "Pathophysiology & Clinical Clues", "Priority Emergency Care"],
    rows: [
      ["Vaso-Occlusive Crisis", "Sickled RBCs occlude bone/joint capillaries → severe ischaemic pain", "Rapid IV/oral Hydration, Paracetamol + Morphine analgesia, keep warm"],
      ["Acute Chest Syndrome", "New pulmonary infiltrate + fever, chest pain, hypoxaemia", "Oxygen to keep SpO2 >=95%, broad-spectrum IV antibiotics, exchange transfusion"],
      ["Splenic Sequestration", "Sudden massive splenomegaly + precipitous Hb drop + hypovolaemic shock", "Urgent isotonic fluid resuscitation + packed RBC transfusion + crossmatch"],
      ["Long-Term Prophylaxis", "Hyposplenism infection & stroke prevention in Ugandan children", "Oral Penicillin V prophylaxis, Folic Acid 5 mg OD, Hydroxyurea"]
    ]
  },
  placenta: {
    title: "Obstetric Placenta, APH Differential & Active 3rd Stage Care",
    badge: "Obstetric Pathology",
    headers: ["Condition", "Key Differentiation", "Immediate Midwifery Safeguard"],
    rows: [
      ["Placenta Praevia", "PAINLESS bright red bleeding >=24 wks, soft non-tender uterus", "STRICTLY NO Digital Vaginal Exam! IV access + ultrasound localization"],
      ["Abruptio Placentae", "PAINFUL dark bleeding, rigid woody tender uterus, foetal distress", "Resuscitate shock (2x 16G IV), cross-match blood, expedite delivery"],
      ["Retained Placenta", "Placenta undelivered >30 min despite Controlled Cord Traction", "Manual removal in theatre under anaesthesia + Oxytocin + antibiotics"],
      ["AMTSL PPH Prevention", "Standard care within 1 minute of every live birth", "Oxytocin 10 IU IM, Controlled Cord Traction, uterine massage q15m x 2h"]
    ]
  },
  thyroid: {
    title: "Thyroid Disorder, Goitre & Post-Thyroidectomy Care Table",
    badge: "Endocrine Pathology",
    headers: ["Disorder / Risk", "Classic Signs & Lab Pattern", "Priority Clinical Safety"],
    rows: [
      ["Hypothyroidism / Iodine Goitre", "Weight gain, cold intolerance, bradycardia, lethargy; ↑ TSH, ↓ T4", "Give Levothyroxine morning on empty stomach; promote iodized salt"],
      ["Hyperthyroidism (Graves)", "Weight loss, tachycardia, heat intolerance, tremor, exophthalmos", "Carbimazole/Propylthiouracil + Propranolol; watch Thyroid Storm fever"],
      ["Post-Thyroidectomy Bleeding", "Neck fullness, stridor, tracheal deviation in first 24 hours", "Keep Tracheostomy & suture-removal set AT BEDSIDE always"],
      ["Hypocalcaemia (Parathyroid)", "Circumoral numbness, Chvostek's & Trousseau's signs, laryngospasm", "Verify serum Calcium and administer slow IV Calcium Gluconate 10%"]
    ]
  }
};

function stripTrailingColon(str) {
  return String(str || "").replace(/:\s*$/, "").trim();
}

function getInlineSectionRules() {
  return [
    {
      match: /\b(human\s+body\s+organization|structural\s+organization|levels?\s+of\s+organization)\b/i,
      titleOnly: true,
      src: "/assets/images/medical-illustrations/levels-of-structural-organization.webp",
      caption: "Figure: Levels of Structural Organization (Atom to Human Organism)"
    },
    {
      match: /\b(anatomical\s+position|relative\s+directional\s+terms|directional\s+terminology)\b/i,
      titleOnly: true,
      src: "/assets/images/medical-illustrations/anatomical-position-directional-terms.webp",
      caption: "Figure: Standard Anatomical Position & Directional Terms (Anterior & Lateral Views)"
    },
    {
      match: /\b(body\s+parts?\s+regions|abdominal\s+quadrants)\b/i,
      titleOnly: true,
      src: "/assets/images/medical-illustrations/anatomy-terms-03-abdominal-quadrants.webp",
      caption: "Figure: Four Abdominopelvic Quadrants vs Nine Anatomical Regions"
    },
    {
      match: /\b(body\s+planes\s+and\s+sections|sagittal\s+plane|coronal\s+plane|transverse\s+plane)\b/i,
      titleOnly: true,
      src: "/assets/images/medical-illustrations/anatomical-body-planes-sections.webp",
      caption: "Figure: Sagittal, Coronal (Frontal) & Transverse Anatomical Planes"
    },
    {
      match: /\b(body\s+cavities|protective\s+spaces\s+for\s+vital\s+organs|dorsal\s+body\s+cavity)\b/i,
      titleOnly: true,
      src: "/assets/images/medical-illustrations/dorsal-ventral-body-cavities.webp",
      caption: "Figure: Major Dorsal (Cranial & Vertebral) and Ventral (Thoracic & Abdominopelvic) Cavities"
    },
    {
      match: /\b(9\s+abdominopelvic\s+regions|nine\s+abdominopelvic\s+regions)\b/i,
      titleOnly: true,
      src: "/assets/images/medical-illustrations/anatomy-terms-06-abdominopelvic-regions.webp",
      caption: "Figure: The 9 Abdominopelvic Regions & Key Underlying Viscera"
    },
    {
      match: /\b(essential\s+body\s+systems|11\s+body\s+systems)\b/i,
      titleOnly: true,
      src: "/assets/images/medical-illustrations/anatomy-terms-07-body-systems.webp",
      caption: "Figure: Overview of the 11 Integrated Human Body Systems"
    },
    {
      match: /\bcardiovascular\s+system\b/i,
      titleOnly: true,
      src: "/assets/images/medical-illustrations/heart-cardiovascular.webp",
      caption: "Cardiovascular System | Heart, Pulmonary & Systemic Circulation"
    },
    {
      match: /\bnervous\s+system\b/i,
      titleOnly: true,
      src: "/assets/images/medical-illustrations/brain-nervous-system.webp",
      caption: "Nervous System | Central & Peripheral Control Pathways"
    },
    {
      match: /\bendocrine\s+system\b/i,
      titleOnly: true,
      src: "/assets/images/medical-illustrations/endocrine-glands.webp",
      caption: "Endocrine System | Major Hormone-Secreting Glands"
    },
    {
      match: /\brespiratory\s+system\b/i,
      titleOnly: true,
      src: "/assets/images/medical-illustrations/lungs-respiratory.webp",
      caption: "Respiratory System | Airways, Lungs & Gas Exchange"
    },
    {
      match: /\bdigestive\s+system\b/i,
      titleOnly: true,
      src: "/assets/images/medical-illustrations/digestive-gi-tract.webp",
      caption: "Digestive System | Gastrointestinal Tract & Accessory Organs"
    },
    {
      match: /\burinary\s+system\b/i,
      titleOnly: true,
      src: "/assets/images/medical-illustrations/kidney-renal-nephron.webp",
      caption: "Urinary System | Renal Filtration & Fluid Homeostasis"
    },
    {
      match: /\breproductive\s+system\b/i,
      titleOnly: true,
      src: "/assets/images/medical-illustrations/obstetric-fetus-pelvis.webp",
      caption: "Reproductive & Pelvic Anatomy"
    },
    {
      match: /\b(type[s]?\s+of\s+bone|classification\s+of\s+bone|long\s+bone|short\s+bone|flat\s+bone|irregular\s+bone|sesamoid)\b/i,
      src: "/assets/images/medical-illustrations/inline-types-of-bones.webp",
      caption: "Types of Bones | Long, Short, Flat, Irregular & Sesamoid Classification"
    },
    {
      match: /\b(epiphysis|diaphysis|periosteum|medullary\s+cavity|compact\s+bone|spongy\s+bone|ossification|fracture\s+healing)\b/i,
      src: "/assets/images/medical-illustrations/inline-long-bone.webp",
      caption: "Internal & Macroscopic Anatomy of a Long Bone"
    },
    {
      match: /\b(synovial\s+joint|articular\s+cartilage|joint\s+cavity|ligament|arthritis|articulation[s]?)\b/i,
      src: "/assets/images/medical-illustrations/inline-synovial-joint.webp",
      caption: "Synovial Joint Anatomy & Articular Surface Changes"
    },
    {
      match: /\b(lymph\s+node|germinal\s+center|immunity|immune\s+response|macrophage|lymphocyte|b[- ]?cell|t[- ]?cell)\b/i,
      src: "/assets/images/medical-illustrations/inline-lymph-node.webp",
      caption: "Structure of a Lymph Node & Immune Surveillance"
    },
    {
      match: /\b(fluid\s+recovery|interstitial\s+fluid|lymphatic\s+capillar|thoracic\s+duct|chyle)\b/i,
      src: "/assets/images/medical-illustrations/blood-immune-lymphatic.webp",
      caption: "Lymphatic Drainage Pathways & Capillary Fluid Recovery"
    },
    {
      match: /\b(nephron|glomerul|bowman|loop\s+of\s+henle|tubular\s+reabsorption|filtration\s+rate)\b/i,
      src: "/assets/images/medical-illustrations/inline-nephron-filtration.webp",
      caption: "Nephron Filtration, Reabsorption & Secretion"
    },
    {
      match: /\b(alveol|gas\s+exchange|pulmonary\s+capillar|surfactant|respiratory\s+membrane)\b/i,
      src: "/assets/images/medical-illustrations/inline-alveoli-gas-exchange.webp",
      caption: "Pulmonary Alveoli & Capillary Gas Exchange"
    },
    {
      match: /\b(heart\s+chamber|coronary|ventricle|atrium|tricuspid|mitral|aortic\s+arch)\b/i,
      src: "/assets/images/medical-illustrations/inline-heart-anatomy.webp",
      caption: "Anterior & Posterior Cardiac Anatomy"
    },
    {
      match: /\b(neuron|axon|dendrite|synapse|neurotransmit|action\s+potential|myelin)\b/i,
      src: "/assets/images/medical-illustrations/inline-neuron-synapse.webp",
      caption: "Multipolar Neuron & Synaptic Transmission Anatomy"
    },
    {
      match: /\b(intravenous|iv\s+fluid|cannul|drip\s+rate|infusion\s+rate|parenteral)\b/i,
      src: "/assets/images/medical-illustrations/pharmacology-adme.webp",
      caption: "Intravenous Fluid Administration & Sterile Cannulation"
    },
    {
      match: /\b(pressure\s+ulcer|pressure\s+injury|pressure\s+sore|stage\s+[1-4]\s+ulcer|epidermis|dermis|wound\s+healing|skin\s+layers|integumentary)\b/i,
      titleOnly: true,
      src: "/assets/images/medical-illustrations/skin-wound-healing.webp",
      caption: "Skin Layers & Clinical Wound Depth Staging"
    }
  ];
}

function pickInlineSectionVisual(secTitle, secBodyText, topicTitle, usedSrcs) {
  const combined = `${secTitle} ${secBodyText} ${topicTitle || ""}`;
  const titleOnly = `${secTitle}`;
  const rules = getInlineSectionRules();

  // First check exact section title match (highest relevance to what user is reading right there)
  for (const r of rules) {
    if (r.match.test(titleOnly) && !usedSrcs.has(r.src)) {
      return r;
    }
  }
  // Then check section body + topic title (skip rules marked titleOnly)
  for (const r of rules) {
    if (!r.titleOnly && r.match.test(combined) && !usedSrcs.has(r.src)) {
      return r;
    }
  }
  return null;
}

function VisualPlateFigure({ src, index, topicTitle, isSingle, lesson, badge }) {
  const [portraitSplit, setPortraitSplit] = React.useState(false);

  const handleLoad = (e) => {
    if (!isSingle) return;
    const { naturalWidth, naturalHeight } = e.currentTarget || {};
    if (naturalWidth && naturalHeight && naturalWidth / naturalHeight < 1.25) {
      setPortraitSplit(true);
    }
  };

  const takeaways = React.useMemo(() => {
    const items = [];
    if (lesson?.excerpt) {
      items.push(String(lesson.excerpt).trim());
    }
    for (const sec of lesson?.sections || []) {
      const title = stripTrailingColon(sec?.title);
      if (!title || /^reference/i.test(title) || items.length >= 4) continue;
      items.push(title);
    }
    return items.slice(0, 4);
  }, [lesson]);

  if (portraitSplit && takeaways.length > 0) {
    return (
      <figure className="nu-visual-figure nu-visual-figure--split">
        <div className="nu-visual-split-media">
          <img
            src={withImgVersion(src)}
            alt={`${topicTitle} | medical reference diagram ${index + 1}`}
            loading="lazy"
            onLoad={handleLoad}
          />
        </div>
        <div className="nu-visual-split-info">
          <span className="nu-visual-split-tag">{badge || "Clinical Visual Guide"}</span>
          <h4>{topicTitle} | Key Study Context</h4>
          <ul>
            {takeaways.map((point, idx) => (
              <li key={idx}>{point}</li>
            ))}
          </ul>
          <figcaption>
            Figure {index + 1}: {topicTitle} | Visual Clinical Guide
          </figcaption>
        </div>
      </figure>
    );
  }

  return (
    <figure className="nu-visual-figure">
      <img
        src={withImgVersion(src)}
        alt={`${topicTitle} | medical reference diagram ${index + 1}`}
        loading="lazy"
        onLoad={handleLoad}
      />
      <figcaption>
        Figure {index + 1}: {topicTitle} | Visual Clinical Guide
      </figcaption>
    </figure>
  );
}

export default function TopicVisuals({ lesson, topicTitle }) {
  if (!lesson) return null;

  const domain = lesson.visualDomain || "adpie";
  const tableData = DOMAIN_TABLES[domain] || DOMAIN_TABLES.adpie;

  const workflowSteps = (lesson.sections || [])
    .map((s, idx) => ({ title: stripTrailingColon(s.title), idx }))
    .filter((s) => s.title && !/^reference/i.test(s.title))
    .slice(0, 6);

  const images = (lesson.images || []).filter(Boolean);

  const jumpToSection = (idx) => {
    const el = document.getElementById(`lesson-sec-${idx}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="nu-visual-suite">
      {/* 1. Custom Medical Illustrations & Anatomical Plates */}
      {images.length > 0 && (
        <div className="nu-visual-plate-box">
          <div className="nu-visual-head">
            <span className="nu-visual-kicker">
              Medical Textbook Illustration &amp; Anatomy Plate
            </span>
            <span className="nu-visual-domain-pill">{tableData.badge}</span>
          </div>
          <div className="nu-visual-plate-grid">
            {images.slice(0, 2).map((src, i) => (
              <VisualPlateFigure
                key={i}
                src={src}
                index={i}
                topicTitle={topicTitle}
                isSingle={images.length === 1}
                lesson={lesson}
                badge={tableData.badge}
              />
            ))}
          </div>
        </div>
      )}

      {/* 2. Clean Monochrome Quick-Jump Study Outline Strip (Zero Colored Boxes) */}
      {workflowSteps.length >= 2 && (
        <div className="nu-outline-strip">
          <span className="nu-outline-strip-label">
            <Layers size={14} /> In this topic:
          </span>
          <div className="nu-outline-pills">
            {workflowSteps.map((step) => (
              <button
                key={step.idx}
                type="button"
                className="nu-outline-pill"
                onClick={() => jumpToSection(step.idx)}
              >
                {step.title}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 3. Structured High-Yield Clinical Reference Table */}
      <div className="nu-clinical-table-card">
        <div className="nu-visual-head">
          <span className="nu-visual-kicker">
            <Table2 size={14} /> {tableData.title}
          </span>
          <span className="nu-badge nu-badge-highyield">UNMEB Exam Reference</span>
        </div>

        <div className="nu-admin-table-wrap">
          <table className="nu-clinical-table">
            <thead>
              <tr>
                {tableData.headers.map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.rows.map((row, rIdx) => (
                <tr key={rIdx}>
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className={cIdx === 0 ? "nu-table-lead" : ""}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="nu-clinical-callout-strip">
          <span>
            <CheckCircle2 size={14} color="#065F46" /> <strong>Clinical Pearl:</strong> Link these normal ranges to bedside findings before administering high-alert treatments.
          </span>
          <span>
            <AlertTriangle size={14} color="#B45309" /> <strong>Safety Check:</strong> Always escalate red-flag vitals promptly.
          </span>
        </div>
      </div>
    </div>
  );
}

function classifyBlockTone(text) {
  const s = String(text || "");
  if (/^(red flag|caution|warning|danger|contraindication|emergency|never|urgent|alert)[:\s]/i.test(s)) {
    return "alert";
  }
  if (/^(clinical pearl|key point|remember|exam tip|high[- ]yield|formula)[:\s]/i.test(s)) {
    return "pearl";
  }
  return null;
}

function groupSectionBlocks(blocks = []) {
  const grouped = [];
  let bulletBuf = null;

  for (const b of blocks) {
    if (b?.type === "bullet") {
      if (!bulletBuf) bulletBuf = [];
      bulletBuf.push(b.text);
    } else if (Array.isArray(b?.items)) {
      if (!bulletBuf) bulletBuf = [];
      bulletBuf.push(...b.items);
    } else {
      if (bulletBuf) {
        grouped.push({ kind: "list", items: bulletBuf });
        bulletBuf = null;
      }
      if (b?.type === "table" && Array.isArray(b.headers) && Array.isArray(b.rows)) {
        grouped.push({ kind: "table", title: b.title || "", headers: b.headers, rows: b.rows });
      } else if (b?.type === "diagram") {
        grouped.push({ kind: "diagram", block: b });
      } else if (b?.type === "subheading") {
        grouped.push({ kind: "subheading", text: b.text || "" });
      } else {
        const raw = String(b?.text || "");
        if (/\s*[•▪◦●]\s+/.test(raw)) {
          const parts = raw.split(/\s*[•▪◦●]\s+/).map((p) => p.trim()).filter(Boolean);
          if (parts.length > 1) {
            if (!raw.trim().startsWith("•") && !raw.trim().startsWith("▪") && !raw.trim().startsWith("◦")) {
              grouped.push({ kind: "block", text: parts[0] });
              grouped.push({ kind: "list", items: parts.slice(1) });
            } else {
              grouped.push({ kind: "list", items: parts });
            }
            continue;
          }
        }
        grouped.push({ kind: "block", text: raw });
      }
    }
  }
  if (bulletBuf) {
    grouped.push({ kind: "list", items: bulletBuf });
  }
  return grouped;
}

function LessonInlineDiagram({ block }) {
  const variant = block?.variant || "flow";
  const title = block?.title || "Clinical Procedure Diagram";
  const caption = block?.caption || "";

  if (variant === "aseptic_trolley") {
    return (
      <figure className="nu-note-diagram-card">
        <div className="nu-note-diagram-head">
          <span>{title}</span>
          <span className="nu-note-diagram-tag">2-Color Clinical Schematic</span>
        </div>
        <svg
          viewBox="0 0 760 270"
          role="img"
          aria-label={title}
          style={{ width: "100%", height: "auto", display: "block", background: "#FFFFFF", borderRadius: 8 }}
        >
          {/* Left Panel: Trolley Separation */}
          <rect x="16" y="16" width="350" height="236" rx="10" fill="#F8FAFC" stroke="#0F172A" strokeWidth="1.6" />
          <text x="34" y="42" fontSize="13" fontWeight="800" fill="#0F172A">1. TROLLEY ZONE SEPARATION</text>

          {/* Top Shelf (Solid Royal Purple Fill + White Font) */}
          <rect x="34" y="56" width="314" height="84" rx="8" fill="#6D28D9" />
          <rect x="44" y="66" width="136" height="20" rx="4" fill="#FFFFFF" />
          <text x="53" y="80" fontSize="10.5" fontWeight="800" fill="#6D28D9">TOP SHELF · STERILE</text>
          <text x="44" y="106" fontSize="11.5" fontWeight="700" fill="#FFFFFF">Sterile pack, gallipots, forceps, drapes</text>
          <text x="44" y="124" fontSize="10.5" fill="#EDE9FE">Use Cheatle forceps · Keep strict asepsis</text>

          {/* Bottom Shelf (Solid Obsidian Fill + White Font) */}
          <rect x="34" y="152" width="314" height="84" rx="8" fill="#0F172A" />
          <rect x="44" y="162" width="174" height="20" rx="4" fill="#FFFFFF" />
          <text x="53" y="176" fontSize="10.5" fontWeight="800" fill="#0F172A">BOTTOM SHELF · UNSTERILE</text>
          <text x="44" y="202" fontSize="11.5" fontWeight="700" fill="#FFFFFF">Soiled receivers, mackintosh, bandages</text>
          <text x="44" y="220" fontSize="10.5" fill="#CBD5E1">Never return used instruments to top shelf</text>

          {/* Right Panel: Swabbing Direction */}
          <rect x="394" y="16" width="350" height="236" rx="10" fill="#F8FAFC" stroke="#0F172A" strokeWidth="1.6" />
          <text x="412" y="42" fontSize="13" fontWeight="800" fill="#0F172A">2. SWABBING STROKE DIRECTION</text>

          {/* Clean Wound Center-Outward Solid Diagram */}
          <ellipse cx="569" cy="116" rx="126" ry="48" fill="#0F2942" />
          <line x1="485" y1="116" x2="653" y2="116" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="569" cy="116" r="5.5" fill="#A855F7" stroke="#FFFFFF" strokeWidth="1.5" />
          {/* Outward arrows */}
          <path d="M 569 104 L 569 78 M 563 85 L 569 77 L 575 85" fill="none" stroke="#C084FC" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 569 128 L 569 154 M 563 147 L 569 155 L 575 147" fill="none" stroke="#C084FC" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />

          <rect x="412" y="174" width="314" height="66" rx="7" fill="#5B21B6" />
          <text x="424" y="194" fontSize="11.5" fontWeight="800" fill="#FFFFFF">Clean wound: Centre → Sides (Outwards)</text>
          <text x="424" y="212" fontSize="10.8" fill="#EDE9FE">1 swab = 1 stroke · Discard immediately after pass</text>
          <text x="424" y="229" fontSize="10.8" fontWeight="700" fill="#FFFFFF">Septic wound: Cleanest periphery → Centre/Pus</text>
        </svg>
        {caption && <figcaption>{caption}</figcaption>}
      </figure>
    );
  }

  const steps = Array.isArray(block?.steps) ? block.steps : [];
  if (!steps.length) return null;

  return (
    <figure className="nu-note-diagram-card">
      <div className="nu-note-diagram-head">
        <span>{title}</span>
        <span className="nu-note-diagram-tag">Procedure Sequence</span>
      </div>
      <div className="nu-proc-flow-grid">
        {steps.map((st, idx) => (
          <React.Fragment key={idx}>
            <div className="nu-proc-flow-node">
              <div className="nu-proc-flow-step">STEP {st.step || idx + 1}</div>
              <div className="nu-proc-flow-title">{st.label}</div>
              {st.detail && <div className="nu-proc-flow-detail">{st.detail}</div>}
            </div>
            {idx < steps.length - 1 && (
              <div className="nu-proc-flow-arrow" aria-hidden="true">
                &rarr;
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}

function hashVariant(str, mod) {
  let h = 0;
  const s = String(str || "");
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) >>> 0;
  }
  return mod > 0 ? h % mod : 0;
}

const TABLE_THEMES = ["minimal", "minimal", "neutral", "minimal", "neutral", "navy", "minimal", "purple"]; // Calm monochrome/neutral by default; color accents sparingly
const HEAD_THEMES = ["light", "light", "slate-light", "light", "navy", "slate"]; // Calm paper headers by default, occasional dark anchor headers

export function LessonSections({ sections = [], lesson = null, topicTitle = "", headingTag = "h2", disableInlineFigures = false, idPrefix = "lesson-sec-" }) {
  const Heading = headingTag;
  const usedSrcs = new Set(
    (lesson?.images || []).map((img) => String(img || "").split("?")[0]).filter(Boolean)
  );
  let inlineImagesAdded = 0;
  const maxInlineImages = sections.length >= 16 ? 12 : 4;
  let tableCounter = 0;
  const topicSeed = `${topicTitle}::${lesson?.slug || ""}`;

  return (
    <div className="nu-notes-pages">
      {sections.map((sec, sIdx) => {
        const cleanHeading = stripTrailingColon(sec.title);
        const grouped = groupSectionBlocks(sec.blocks || []);
        const headTone = HEAD_THEMES[hashVariant(`${topicSeed}::sec${sIdx}`, HEAD_THEMES.length)];
        const bodySample = (sec.blocks || [])
          .slice(0, 6)
          .map((b) => b.text || (Array.isArray(b.items) ? b.items.join(" ") : ""))
          .join(" ");

        let inlineFig = null;
        if (
          !disableInlineFigures &&
          inlineImagesAdded < maxInlineImages &&
          !/^(reference|learning outcome|nursing uganda clinical lens|nursing priorities|clinical safety|unmeb)/i.test(cleanHeading)
        ) {
          const picked = pickInlineSectionVisual(cleanHeading, bodySample, topicTitle, usedSrcs);
          if (picked) {
            usedSrcs.add(picked.src);
            inlineFig = picked;
            inlineImagesAdded++;
          }
        }

        return (
          <section key={sIdx} id={`${idPrefix}${sIdx}`} className="nu-note-page-card">
            <div className={`nu-note-page-head nu-head--${headTone}`}>
              <Heading className="nu-note-section-title">{cleanHeading}</Heading>
            </div>

            <div className="nu-note-page-body">
              {grouped.map((g, gIdx) => {
                if (g.kind === "table") {
                  const tone = TABLE_THEMES[hashVariant(`${topicSeed}::tbl${tableCounter++}`, TABLE_THEMES.length)];
                  return (
                    <div key={gIdx} className={`nu-inline-table-card nu-table-tone--${tone}`}>
                      {g.title && <div className="nu-inline-table-title">{g.title}</div>}
                      <div className="nu-admin-table-wrap">
                        <table className={`nu-clinical-table nu-tbl--${tone}`}>
                          <thead>
                            <tr>
                              {g.headers.map((h, hi) => (
                                <th key={hi}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {g.rows.map((row, ri) => (
                              <tr key={ri}>
                                {row.map((cell, ci) => (
                                  <td key={ci} className={ci === 0 ? "nu-table-lead" : ""}>
                                    {Array.isArray(cell) ? (
                                      <ul className="nu-table-bullet-list">
                                        {cell.map((bulletItem, bi) => (
                                          <li key={bi}>
                                            <RichText text={bulletItem} highlightKeyFacts />
                                          </li>
                                        ))}
                                      </ul>
                                    ) : (
                                      <RichText text={cell} highlightKeyFacts />
                                    )}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                }

                if (g.kind === "diagram") {
                  return <LessonInlineDiagram key={gIdx} block={g.block} />;
                }

                if (g.kind === "subheading") {
                  return (
                    <h4 key={gIdx} className="nu-note-subhead">
                      {stripTrailingColon(g.text)}
                    </h4>
                  );
                }

                if (g.kind === "list") {
                  return (
                    <ul key={gIdx} className="nu-note-clean-list">
                      {g.items.map((it, ii) => (
                        <li key={ii}>
                          <RichText text={it} highlightKeyFacts />
                        </li>
                      ))}
                    </ul>
                  );
                }
                const text = String(g.text || "").trim();
                if (!text) return null;

                // Bold short standalone sub-topic titles or clean question subheadings
                if (
                  (text.length <= 72 && text.endsWith(":") && !text.includes(". ")) ||
                  (text.length <= 82 && text.endsWith("?") && !text.includes(". "))
                ) {
                  return (
                    <h4 key={gIdx} className="nu-note-subhead">
                      {stripTrailingColon(text)}
                    </h4>
                  );
                }

                const tone = classifyBlockTone(text);
                if (tone) {
                  return (
                    <div key={gIdx} className={`nu-note-callout nu-note-callout--${tone}`}>
                      <span className="nu-note-callout-icon">
                        {tone === "alert" ? <AlertTriangle size={16} /> : <Sparkles size={16} />}
                      </span>
                      <div>
                        <RichText text={text} highlightKeyFacts />
                      </div>
                    </div>
                  );
                }
                return (
                  <p key={gIdx}>
                    <RichText text={text} highlightKeyFacts />
                  </p>
                );
              })}

              {inlineFig && (
                <figure className="nu-note-inline-figure">
                  <img
                    src={withImgVersion(inlineFig.src)}
                    alt={inlineFig.caption}
                    loading="lazy"
                  />
                  <figcaption>{inlineFig.caption}</figcaption>
                </figure>
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}
