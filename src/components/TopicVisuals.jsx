import React from "react";
import { Activity, AlertTriangle, ArrowRight, CheckCircle2, Layers, Sparkles, Table2 } from "lucide-react";
import RichText from "./RichText";

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
      ["Pregnancy (Trimester 1)", "Symptomatic malaria in first 12 weeks gestation", "Oral Quinine + Clindamycin (or Artesunate if severe—save mother's life!)"],
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

const WORKFLOW_COLORS = [
  { bg: "#F7EDFF", border: "#A137F2", text: "#6B21A8", badge: "#A137F2" },
  { bg: "#ECFDF5", border: "#0D9488", text: "#065F46", badge: "#0D9488" },
  { bg: "#EFF6FF", border: "#2563EB", text: "#1E40AF", badge: "#2563EB" },
  { bg: "#FFFBEB", border: "#D97706", text: "#92400E", badge: "#D97706" },
  { bg: "#FDF2F8", border: "#DB2777", text: "#9D174D", badge: "#DB2777" }
];

export default function TopicVisuals({ lesson, topicTitle }) {
  if (!lesson) return null;

  const domain = lesson.visualDomain || "adpie";
  const tableData = DOMAIN_TABLES[domain] || DOMAIN_TABLES.adpie;

  // Build Napkin-style connected study nodes from real lesson sections
  const workflowSteps = (lesson.sections || [])
    .map((s) => s.title)
    .filter((t) => t && !/^reference/i.test(t))
    .slice(0, 5);

  const images = (lesson.images || []).filter(Boolean);

  return (
    <div className="nu-visual-suite">
      {/* 1. Custom Medical Illustrations & Anatomical Plates */}
      {images.length > 0 && (
        <div className="nu-visual-plate-box">
          <div className="nu-visual-head">
            <span className="nu-visual-kicker">
              <Sparkles size={14} /> Medical Textbook Illustration &amp; Anatomy Plate
            </span>
            <span className="nu-visual-domain-pill">{tableData.badge}</span>
          </div>
          <div className="nu-visual-plate-grid">
            {images.slice(0, 2).map((src, i) => (
              <figure key={i} className="nu-visual-figure">
                <img
                  src={src}
                  alt={`${topicTitle} — medical reference diagram ${i + 1}`}
                  loading="lazy"
                />
                <figcaption>
                  Figure {i + 1}: {topicTitle} — Visual Clinical Guide
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      )}

      {/* 2. Napkin-Style Topic Learning Workflow / Concept Diagram */}
      {workflowSteps.length >= 2 && (
        <div className="nu-napkin-card">
          <div className="nu-visual-head">
            <span className="nu-visual-kicker">
              <Layers size={14} /> Visual Study Map &amp; Clinical Sequence
            </span>
            <span style={{ fontSize: "0.74rem", color: "var(--nu-ink-muted)", fontWeight: 600 }}>
              {workflowSteps.length}-Step Lesson Blueprint
            </span>
          </div>

          <div className="nu-napkin-flow">
            {workflowSteps.map((stepTitle, idx) => {
              const palette = WORKFLOW_COLORS[idx % WORKFLOW_COLORS.length];
              return (
                <React.Fragment key={idx}>
                  <div
                    className="nu-napkin-node"
                    style={{
                      background: palette.bg,
                      borderColor: palette.border
                    }}
                  >
                    <span className="nu-napkin-step-badge" style={{ background: palette.badge }}>
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <div className="nu-napkin-node-title" style={{ color: palette.text }}>
                      {stepTitle}
                    </div>
                  </div>
                  {idx < workflowSteps.length - 1 && (
                    <div className="nu-napkin-arrow" aria-hidden="true">
                      <ArrowRight size={18} color="#A137F2" />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
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

const SECTION_ACCENTS = [
  { border: "#A137F2", bg: "#F7EDFF", ink: "#6B21A8" },
  { border: "#0D9488", bg: "#ECFDF5", ink: "#065F46" },
  { border: "#2563EB", bg: "#EFF6FF", ink: "#1E40AF" },
  { border: "#D97706", bg: "#FFFBEB", ink: "#92400E" },
  { border: "#BE185D", bg: "#FDF2F8", ink: "#9D174D" }
];

function classifyBlockTone(text) {
  const s = String(text || "");
  if (/^(red flag|caution|warning|danger|contraindication|emergency|never|urgent|alert)[:\s]/i.test(s)) {
    return "alert";
  }
  if (/^(clinical pearl|key point|remember|exam tip|high[- ]yield|note|summary|formula)[:\s]/i.test(s)) {
    return "pearl";
  }
  return null;
}

export function LessonSections({ sections = [], headingTag = "h2" }) {
  const Heading = headingTag;
  return (
    <div className="nu-notes-pages">
      {sections.map((sec, sIdx) => {
        const accent = SECTION_ACCENTS[sIdx % SECTION_ACCENTS.length];
        return (
          <section
            key={sIdx}
            className="nu-note-page-card"
            style={{ borderTopColor: accent.border }}
          >
            <div className="nu-note-page-head">
              <span className="nu-note-page-num" style={{ background: accent.bg, color: accent.ink, borderColor: accent.border }}>
                {String(sIdx + 1).padStart(2, "0")}
              </span>
              <Heading style={{ margin: 0 }}>{sec.title}</Heading>
            </div>

            <div className="nu-note-page-body">
              {(sec.blocks || []).map((b, bIdx) => {
                if (b.type === "bullet") {
                  return (
                    <ul key={bIdx} className="nu-note-styled-list">
                      <li><RichText text={b.text} /></li>
                    </ul>
                  );
                }
                if (Array.isArray(b.items)) {
                  return (
                    <ul key={bIdx} className="nu-note-styled-list">
                      {b.items.map((it, ii) => (
                        <li key={ii}><RichText text={it} /></li>
                      ))}
                    </ul>
                  );
                }
                const tone = classifyBlockTone(b.text);
                if (tone) {
                  return (
                    <div key={bIdx} className={`nu-note-callout nu-note-callout--${tone}`}>
                      <span className="nu-note-callout-icon">
                        {tone === "alert" ? <AlertTriangle size={16} /> : <Sparkles size={16} />}
                      </span>
                      <div><RichText text={b.text} /></div>
                    </div>
                  );
                }
                return (
                  <p key={bIdx}>
                    <RichText text={b.text} />
                  </p>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
