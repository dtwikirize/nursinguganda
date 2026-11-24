/**
 * Builds 109 structured UNMEB / UHPAB Past Papers across 18 core nursing & midwifery
 * examination subjects and 6 examination sitting series (2019–2025).
 * Grounds all clinical answers in Uganda Clinical Guidelines 2023, WHO protocols,
 * OpenStax, and Open RN without citing third-party revision blogs.
 *
 * Outputs normalized archive to assets/data/unmeb-essay-papers.json (~250 KB raw, ~65 KB gzip).
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const DATA_DIR = path.join(ROOT, "assets", "data");

const existingEssays = JSON.parse(fs.readFileSync(path.join(DATA_DIR, "unmeb-essay-papers.json"), "utf8"));
const mockExams = JSON.parse(fs.readFileSync(path.join(DATA_DIR, "mock-exams.json"), "utf8"));
const topicQuizzes = JSON.parse(fs.readFileSync(path.join(DATA_DIR, "topic-quizzes.json"), "utf8"));

// Build unified clean Section A MCQ pool keyed by clinical domain
const mcqBank = {};
let mcqSeq = 1;

function addMcq(domain, q) {
  const id = `sa-${mcqSeq++}`;
  mcqBank[id] = {
    id,
    domain,
    prompt: q.prompt,
    options: Array.isArray(q.options) ? q.options : [],
    answerIndex: typeof q.answerIndex === "number" ? q.answerIndex : 0,
    answerIndices: Array.isArray(q.answerIndices) ? q.answerIndices : undefined,
    type: q.type || "single",
    explanation: q.explanation || q.rationale || ""
  };
  return id;
}

const domainBuckets = new Map();
function pushDomainId(domain, id) {
  if (!domainBuckets.has(domain)) domainBuckets.set(domain, []);
  domainBuckets.get(domain).push(id);
}

for (const t of topicQuizzes.topics || []) {
  for (const q of t.questions || []) {
    // Use clean single-choice A-D items for UNMEB Section A Objective style
    if ((q.type || "single") === "single" && Array.isArray(q.options) && q.options.length >= 4) {
      const id = addMcq(t.id, q);
      pushDomainId(t.id, id);
    }
  }
}

for (const q of mockExams.questions || []) {
  if (Array.isArray(q.options) && q.options.length >= 4) {
    const id = addMcq("general-unmeb", {
      prompt: q.prompt,
      options: q.options,
      answerIndex: q.answerIndex,
      explanation: q.explanation
    });
    pushDomainId("general-unmeb", id);
  }
}

// Keep existing handwritten essays inside normalized essayBank
const essayBank = {};
function addEssay(subjectKey, essayObj) {
  const id = essayObj.id;
  essayBank[id] = { ...essayObj, subjectKey };
  return id;
}

const essayBuckets = new Map();
function pushEssay(subjectKey, essayObj) {
  const id = addEssay(subjectKey, essayObj);
  if (!essayBuckets.has(subjectKey)) essayBuckets.set(subjectKey, []);
  essayBuckets.get(subjectKey).push(id);
  return id;
}

// Import initial 10 detailed essays from existing papers mapped to subjects
const freeSampler = (existingEssays.papers || [])[0];
const initialMappings = [
  { subj: "anatomy-i", q: existingEssays.papers[0].questions[0] },
  { subj: "anatomy-i", q: existingEssays.papers[0].questions[1] },
  { subj: "emergency-trauma", q: existingEssays.papers[0].questions[2] },
  { subj: "medical-nursing-i", q: existingEssays.papers[1].questions[0] },
  { subj: "pharmacology-i", q: existingEssays.papers[1].questions[1] },
  { subj: "medical-nursing-ii", q: existingEssays.papers[1].questions[2] },
  { subj: "medical-nursing-ii", q: existingEssays.papers[1].questions[3] },
  { subj: "midwifery-ii", q: existingEssays.papers[2].questions[0] },
  { subj: "midwifery-ii", q: existingEssays.papers[2].questions[1] },
  { subj: "midwifery-iii", q: existingEssays.papers[2].questions[2] },
  { subj: "community-phc", q: existingEssays.papers[3].questions[0] },
  { subj: "paediatrics", q: existingEssays.papers[3].questions[1] },
  { subj: "paediatrics", q: existingEssays.papers[3].questions[2] }
];
for (const item of initialMappings) {
  if (item.q) pushEssay(item.subj, item.q);
}

// Deep, domain-authentic UNMEB Section B & Section C questions across all 18 papers
const ADDITIONAL_ESSAYS = [
  // Anatomy I
  {
    subj: "anatomy-i",
    id: "anat1-heart",
    section: "Section C — Long Clinical Anatomy Essay",
    marks: 20,
    topic: "Cardiovascular Anatomy · Chambers, Valves & Coronary Circulation",
    prompt: "(a) Trace the sequential pathway of blood through the four chambers, four valves, and pulmonary/systemic vessels starting at the Vena Cava. (10 marks)\n(b) Name the two main arteries supplying the myocardium and explain why left ventricular infarction rapidly leads to pulmonary oedema. (10 marks)",
    markingPoints: [
      "(a) Superior/Inferior Vena Cava -> Right Atrium -> Tricuspid valve -> Right Ventricle -> Pulmonary semilunar valve -> Pulmonary arteries -> Lungs -> Pulmonary veins -> Left Atrium -> Bicuspid (Mitral) valve -> Left Ventricle -> Aortic semilunar valve -> Aorta -> Systemic tissues (10 marks, ~1 mark per step).",
      "(b) Left and Right Coronary Arteries arising directly from the ascending aorta immediately above the aortic semilunar cusps (3 marks); Impaired Left Ventricle pumping increases Left Atrial and Pulmonary Venous hydrostatic pressure (4 marks); Fluid crosses alveolar-capillary membranes causing acute cardiogenic pulmonary oedema (pink frothy sputum, orthopnoea, basal crackles) (3 marks)."
    ],
    modelAnswer: "(a) Deoxygenated venous blood drains via the Superior and Inferior Venae Cavae (plus Coronary Sinus) into the Right Atrium, crosses the Tricuspid (right atrioventricular) valve into the Right Ventricle, passes through the Pulmonary semilunar valve into the pulmonary trunk/arteries to undergo oxygenation in alveolar capillaries. Oxygenated blood returns via four Pulmonary Veins into the Left Atrium, flows across the Mitral (Bicuspid) valve into the thick-walled Left Ventricle, and is ejected past the Aortic semilunar valve into the Aorta for systemic perfusion.\n\n(b) The myocardium is perfused during ventricular diastole by the Right and Left Coronary Arteries branching immediately above the aortic valve. When an acute myocardial infarction weakens Left Ventricular contractility, end-diastolic volume and pressure rise backward into the Left Atrium and pulmonary veins, elevating pulmonary capillary hydrostatic pressure above colloid osmotic pressure and forcing serous fluid into alveoli—producing flash pulmonary oedema.",
    examinerTip: "Explicitly state that coronary arteries fill during DIASTOLE, and distinguish tricuspid (right AV) from mitral/bicuspid (left AV) clearly."
  },
  {
    subj: "anatomy-i",
    id: "anat1-respiratory",
    section: "Section B — Short Essay",
    marks: 10,
    topic: "Respiratory Anatomy · Alveoli & Surfactant",
    prompt: "(a) Describe the structural features of the respiratory membrane allowing rapid gas exchange. (5 marks)\n(b) State the cellular source and physiological function of pulmonary surfactant in premature neonates. (5 marks)",
    markingPoints: [
      "(a) Ultra-thin Type I alveolar squamous epithelium + fused basement membrane + thin capillary endothelium (~0.5 um thickness); Vast surface area (~70 m2); Moist surfactant-lined surface; Rich capillary network (5 marks).",
      "(b) Secreted by Type II pneumocytes (septal cells) starting around 24–34 weeks gestation (2 marks); Reduces alveolar surface tension to prevent alveolar collapse (atelectasis) on expiration; Deficiency causes Infant Respiratory Distress Syndrome (Hyaline Membrane Disease) treated with CPAP & surfactant/antenatal Dexamethasone (3 marks)."
    ],
    modelAnswer: "(a) Rapid passive diffusion of O2 and CO2 occurs across the respiratory membrane (~0.5 micrometres thin), formed by Type I simple squamous alveolar epithelial cells, fused epithelial-capillary basement membranes, and thin pulmonary capillary endothelium, supported by ~300 million alveoli providing ~70 m2 of moist gas-exchange area.\n\n(b) Pulmonary surfactant is a phospholipid-protein complex synthesized by Type II alveolar cells. By lowering liquid surface tension inside alveoli, surfactant maintains alveolar stability, improves lung compliance, and prevents collapse at end-expiration. Preterm infants (< 34 weeks) lack adequate surfactant and develop Respiratory Distress Syndrome (tachypnoea, nasal flaring, grunting, intercostal recessions).",
    examinerTip: "Identify Type I cells = gas diffusion, Type II cells = surfactant production, and alveolar macrophages = dust phagocytosis."
  },
  // Anatomy II
  {
    subj: "anatomy-ii",
    id: "anat2-nephron",
    section: "Section C — Long Clinical Anatomy Essay",
    marks: 20,
    topic: "Renal Physiology · Urine Formation & ADH",
    prompt: "(a) List the segments of a renal nephron in order and explain the three physiological processes that form urine. (12 marks)\n(b) Describe how Antidiuretic Hormone (ADH / Vasopressin) regulates plasma osmolarity during dehydration. (8 marks)",
    markingPoints: [
      "(a) Glomerulus & Bowman's capsule -> Proximal Convoluted Tubule (PCT) -> Loop of Henle (descending & ascending limbs) -> Distal Convoluted Tubule (DCT) -> Collecting Duct (4 marks). Processes: 1) Glomerular Filtration (hydrostatic pressure drives water/small solutes minus plasma proteins across fenestrated capillaries, GFR ~125 mL/min); 2) Tubular Reabsorption (selective recovery of ~99% water, 100% glucose, Na+, amino acids mainly in PCT); 3) Tubular Secretion (active H+, K+, NH4+, creatinine, drug metabolite elimination into filtrate for acid-base control) (8 marks).",
      "(b) Dehydration raises plasma osmolarity -> hypothalamic osmoreceptors shrink and stimulate posterior pituitary ADH release (3 marks); ADH inserts aquaporin-2 water channels into DCT/Collecting Duct principal cells -> increases passive water reabsorption back into medullary blood (3 marks); Urine becomes concentrated (dark yellow, small volume), restoring circulating volume and diluting plasma back to 285–295 mOsm/kg (2 marks)."
    ],
    modelAnswer: "(a) Urine passes sequentially from the Glomerulus and Bowman's Capsule into the Proximal Convoluted Tubule (PCT), Loop of Henle, Distal Convoluted Tubule (DCT), and Collecting Duct. Three coordinated steps form urine:\n1. Glomerular Filtration: Arterial hydrostatic pressure forces protein-free plasma filtrate (~180 L/day) through the glomerular filtration membrane.\n2. Tubular Reabsorption: ~65% of water, sodium, and virtually 100% of filtered glucose and amino acids are reclaimed into peritubular capillaries primarily in the PCT.\n3. Tubular Secretion: Hydrogen ions, potassium, ammonia, and drugs (e.g. penicillins) are actively transported from blood into the tubule lumen to maintain plasma pH 7.35–7.45.\n\n(b) When dehydration raises blood osmolarity, hypothalamic osmoreceptors signal the posterior pituitary gland to secrete ADH (arginine vasopressin). ADH binds V2 receptors on late DCT and collecting duct cells, triggering insertion of aquaporin-2 water channels. Water moves osmotically out into the hypertonic renal medulla, lowering urine volume, increasing urine specific gravity, and restoring normal plasma osmolarity.",
    examinerTip: "State normal GFR (~125 mL/min) and always clarify that ADH is synthesized in the HYPOTHALAMUS and stored/released by the POSTERIOR PITUITARY."
  },
  {
    subj: "anatomy-ii",
    id: "anat2-cranial",
    section: "Section B — Short Essay",
    marks: 10,
    topic: "Neuroanatomy · Cranial Nerves & Cerebrospinal Fluid",
    prompt: "(a) Match Cranial Nerves I, II, III, VII, VIII, and X with their primary motor or sensory clinical functions. (6 marks)\n(b) State two functions of Cerebrospinal Fluid (CSF) and the anatomical site for safe lumbar puncture in adults. (4 marks)",
    markingPoints: [
      "(a) I Olfactory (smell), II Optic (visual acuity/fields), III Oculomotor (pupil constriction & eye movement), VII Facial (facial expression muscles & anterior tongue taste), VIII Vestibulocochlear (hearing & equilibrium), X Vagus (parasympathetic thorax/abdomen, gag reflex, swallowing/voice) (6 marks).",
      "(b) CSF Functions: Mechanical buoyancy cushioning brain/spinal cord against trauma; chemical homeostasis/nutrient delivery & metabolic waste clearance (2 marks). Adult LP site: Subarachnoid space at L3–L4 or L4–L5 interspace (safely below conus medullaris terminating at L1–L2) (2 marks)."
    ],
    modelAnswer: "(a) Key cranial nerve functions: CN I (Olfactory) mediates smell; CN II (Optic) transmits vision; CN III (Oculomotor) controls pupillary constriction (PERRLA) and extraocular eye movement; CN VII (Facial) supplies facial expression muscles and anterior 2/3 taste; CN VIII (Vestibulocochlear) governs hearing and balance; CN X (Vagus) regulates swallowing, speech phonation, gag reflex, and parasympathetic cardiac/GI tone.\n\n(b) CSF cushions the brain mechanically through buoyancy and clears metabolic waste while distributing electrolytes. In adults, diagnostic lumbar puncture enters the L3–L4 or L4–L5 intervertebral space, safely below the conus medullaris termination at L1–L2.",
    examinerTip: "Remember: L1–L2 is where the adult spinal cord ends, which is why L3–L4 / L4–L5 prevents spinal cord injury."
  },
  {
    subj: "anatomy-ii",
    id: "anat2-endocrine",
    section: "Section B — Short Essay",
    marks: 10,
    topic: "Endocrine System · Insulin vs Glucagon & Thyroid",
    prompt: "(a) Contrast the opposing actions of Insulin and Glucagon on blood glucose regulation. (6 marks)\n(b) Explain four classic symptoms of Hyperthyroidism (Thyrotoxicosis) based on cellular metabolism. (4 marks)",
    markingPoints: [
      "(a) Insulin (pancreatic beta-cells): Lowers blood glucose post-meal via GLUT-4 muscle/adipose uptake, liver glycogenesis, and lipogenesis (3 marks). Glucagon (pancreatic alpha-cells): Raises blood glucose during fasting via hepatic glycogenolysis & gluconeogenesis (3 marks).",
      "(b) 1 mark each: Weight loss despite increased appetite (hypercatabolism), Heat intolerance & profuse sweating (elevated BMR thermogenesis), Tachycardia/palpitations (beta-adrenergic receptor upregulation), Fine hand tremors/anxiety/exophthalmos (sympathetic overactivity/autoimmune orbital inflammation)."
    ],
    modelAnswer: "(a) Pancreatic beta-cells secrete Insulin when blood glucose rises, stimulating peripheral glucose uptake, hepatic glycogenesis, and fat storage to lower plasma glucose. Conversely, alpha-cells release Glucagon during fasting or hypoglycaemia, triggering hepatic glycogenolysis and gluconeogenesis to elevate circulating glucose back to 3.9–5.5 mmol/L.\n\n(b) Excess thyroid hormones T3/T4 raise basal metabolic rate and sympathetic sensitivity, causing: (1) unintended weight loss despite hyperphagia; (2) heat intolerance and sweating from increased cellular thermogenesis; (3) resting tachycardia or palpitations; and (4) fine tremor, restlessness, or lid lag/exophthalmos (in Graves' disease).",
    examinerTip: "Always name the Islet cell types: Beta cells = Insulin, Alpha cells = Glucagon."
  },
  // Foundations of Nursing I
  {
    subj: "foundations-i",
    id: "fond1-ipc",
    section: "Section C — Long Nursing Essay",
    marks: 20,
    topic: "Infection Prevention & Control (IPC) · Chain of Infection & Hand Hygiene",
    prompt: "(a) Draw or list in sequence the six links of the Chain of Infection and give one nursing measure to break EACH link. (12 marks)\n(b) State WHO's 'Five Moments for Hand Hygiene' and compare Alcohol-Based Hand Rub vs Soap & Water indications. (8 marks)",
    markingPoints: [
      "(a) 2 marks per link + break: 1) Infectious Agent (prompt diagnosis/antimicrobials/disinfection); 2) Reservoir (proper waste segregation, clean linen, handwashing, wound dressing); 3) Portal of Exit (masks/cough etiquette, sealing drainage bags, gloves on body fluids); 4) Mode of Transmission (hand hygiene, isolation/transmission precautions, sterilization); 5) Portal of Entry (aseptic catheter insertion/sterile dressing/protect broken skin); 6) Susceptible Host (immunization, adequate nutrition, glycemic/chronic control) (12 marks).",
      "(b) WHO 5 Moments: 1) Before touching a patient; 2) Before clean/aseptic procedure; 3) After body fluid exposure risk; 4) After touching a patient; 5) After touching patient surroundings (5 marks). ABHR (20–30s) for visibly clean hands; Soap & Water (40–60s) ALWAYS required when hands visibly soiled with blood/body fluids, after toilet use, or C. difficile spores (3 marks)."
    ],
    modelAnswer: "(a) Breaking any single link in the Chain of Infection prevents healthcare-associated transmission:\n1. Causative Agent: Early microbiology diagnosis, appropriate antimicrobials, terminal decontamination.\n2. Reservoir: Strict environmental cleaning, safe linen handling, treating infected carriers.\n3. Portal of Exit: Cough hygiene, masking coughing TB patients, sealed drainage systems.\n4. Mode of Transmission: Hand hygiene, PPE, airborne/droplet/contact precautions, sterilizing instruments.\n5. Portal of Entry: Sterile non-touch technique during IV cannulation/catheterization and intact occlusive dressings.\n6. Susceptible Host: Routine vaccinations (Hepatitis B, Tetanus), optimal nutrition, maintaining skin integrity.\n\n(b) WHO 5 Moments for Hand Hygiene: (1) Before patient contact; (2) Before a clean/aseptic task; (3) After body fluid exposure risk; (4) After touching a patient; (5) After touching patient surroundings. Use alcohol-based hand rub (20–30 seconds) between routine contacts on visibly clean hands, and wash with running soap and water (40–60 seconds) whenever hands are visibly soiled, exposed to spore-forming pathogens, or after using the restroom.",
    examinerTip: "A common exam deduction happens when students suggest Alcohol Hand Rub on blood-stained hands—soiled hands MUST be washed with soap and water!"
  },
  {
    subj: "foundations-i",
    id: "fond1-vitals",
    section: "Section B — Short Essay",
    marks: 10,
    topic: "Health Assessment · Vital Signs & Fever Nursing Care",
    prompt: "(a) State normal resting adult ranges for Temperature, Pulse, Respiration, Blood Pressure, and Oxygen Saturation. (5 marks)\n(b) Describe five non-pharmacological and nursing measures for a patient with high pyrexia (39.6°C). (5 marks)",
    markingPoints: [
      "(a) Temp 36.5–37.5°C; Pulse 60–100 bpm; RR 12–20 breaths/min; BP < 120/80 to ~90–139/60–89 mmHg; SpO2 95–100% (5 marks).",
      "(b) Expose excess heavy blankets lightly (avoid inducing shivering); Apply tepid sponging cleanly over axillae/groin/forehead (avoid ice-cold water); Increase cool oral/IV fluids to match insensible sweat losses; Maintain cool ventilated ward environment; Recheck temperature 30–60 min post-intervention and monitor rigor/febrile seizures (5 marks)."
    ],
    modelAnswer: "(a) Normal resting adult baselines: Axillary/oral temperature 36.5–37.5°C; radial pulse 60–100 beats/min; respiratory rate 12–20 breaths/min; blood pressure ~110/70–120/80 mmHg (hypotension < 90/60, stage 1 hypertension >= 140/90 under WHO/UCG thresholds); oxygen saturation >= 95% on room air.\n\n(b) Nursing care for high fever (39.6°C): Remove excess layers/blankets to aid radiation and convection without triggering rigors; perform tepid water sponging over high-flow vascular zones (axillae, groin) avoiding icy water or alcohol rubs; promote generous hydration to replace sweat losses; improve room airflow; and monitor temperature, pulse, and neurological status every 30–60 minutes alongside prescribed antipyretics.",
    examinerTip: "Never advise alcohol sponging or ice baths for fever—both cause vasoconstriction, shivering, and rebound hyperthermia."
  },
  // Foundations of Nursing II
  {
    subj: "foundations-ii",
    id: "fond2-ngtube",
    section: "Section C — Clinical Procedure Essay",
    marks: 20,
    topic: "Clinical Skills · Nasogastric Tube Insertion & Safety",
    prompt: "(a) Describe the NEX measurement technique and step-by-step bedside insertion of a Nasogastric (NG) tube in a conscious adult. (10 marks)\n(b) State two gold-standard methods to verify gastric tube placement BEFORE feeding, and explain four precautions during continuous/bolus tube feeding. (10 marks)",
    markingPoints: [
      "(a) NEX measurement: Tip of Nose -> Earlobe -> Xiphisternum/xiphoid process + mark depth with tape (2 marks). Positioning High-Fowler's (unless contraindicated), verify patent nostril, lubricate tip with water-soluble gel, insert horizontally along nasal floor towards ear, flex chin slightly to chest once in oropharynx and ask patient to sip/swallow water while advancing smoothly (stopping immediately if coughing, cyanosis, or acute stridor) (8 marks).",
      "(b) Verification BEFORE EVERY feed (4 marks): 1) Aspirate gastric contents and test pH indicator strip (acidic gastric pH <= 5.5); 2) Chest/Abdominal X-ray (gold standard initial placement confirmation). Caution: Auscultation 'whoosh' test alone is UNRELIABLE and discouraged. Precautions (6 marks): Keep head of bed elevated 30–45° during and 30–60 min post-feed; flush with 20–30 mL water before/after feeds/drugs; check residual volume/skin integrity; infuse feeds slowly at body/room temperature."
    ],
    modelAnswer: "(a) Measure insertion length using the NEX landmark: tip of Nose to Earlobe, then down to the Xiphisternum, marking with tape. Seat the client upright in High-Fowler's with a towel and emesis basin. Lubricate the NG tip with water-soluble lubricant, check nostril patency, and guide horizontally along the nasal floor toward the occiput. Upon reaching the posterior pharynx, ask the patient to tuck chin to chest and swallow sips of water while advancing smoothly to the NEX mark—withdrawing promptly if gagging/coughing persists, oxygen desaturation, or inability to speak occurs.\n\n(b) Before instilling ANY feed or drug, confirm placement by (1) aspirating fluid and confirming pH <= 5.5 on litmus/pH paper and/or (2) reviewing a chest radiograph (never rely solely on air auscultation 'whoosh' tests). Feeding precautions: elevate bed head 30–45° during feeding and for 45 minutes afterward to prevent aspiration; flush tube with 20–30 mL clean water before and after medications/feeds; deliver feeds slowly by gravity; and inspect nostrils daily for pressure necrosis.",
    examinerTip: "Examiners actively award marks for stating why the old 'air injection stethoscope whoosh test' is unsafe alone (bronchial air still echoes)."
  },
  {
    subj: "foundations-ii",
    id: "fond2-pressure",
    section: "Section B — Short Essay",
    marks: 10,
    topic: "Fundamental Care · Pressure Injury Staging & Prevention",
    prompt: "(a) Identify four high-risk bony prominences and outline Stages 1 to 4 of pressure ulcers. (6 marks)\n(b) State four evidence-based nursing interventions to prevent pressure injuries in an immobile stroke patient. (4 marks)",
    markingPoints: [
      "(a) Sacrum/coccyx, greater trochanters, heels, ischial tuberosities, occiput, scapulae (2 marks). Stages: Stage 1 Non-blanchable erythema of intact skin; Stage 2 Partial-thickness dermis loss (shallow open ulcer or intact serum blister); Stage 3 Full-thickness skin loss reaching subcutaneous fat without bone/tendon exposure; Stage 4 Full-thickness tissue loss exposing bone, tendon, or muscle (4 marks).",
      "(b) Reposition gently at least every 2 hours (30° lateral tilt, avoid dragging/shear); Offload heels with pillows; Keep skin clean, moisture-protected from incontinence, and linen smooth/wrinkle-free; Ensure high-protein, Vitamin C/Zinc hydration support + Braden risk scoring (4 marks)."
    ],
    modelAnswer: "(a) Common pressure injury sites include the sacrum, heels, greater trochanters, ischial tuberosities, and occiput. Clinical staging:\n• Stage 1: Intact skin with localized non-blanchable redness.\n• Stage 2: Partial-thickness loss presenting as a shallow pink/red open ulcer or blister.\n• Stage 3: Full-thickness skin loss with visible subcutaneous fat, possible slough/undermining.\n• Stage 4: Full-thickness necrosis exposing fascia, muscle, tendon, or bone.\n\n(b) Prevention bundle: Turn every 2 hours using lifting sheets (never drag skin); float heels off mattress with pillows; manage moisture/incontinence gently without vigorously massaging reddened bony areas; optimize protein/micronutrient nutrition and use pressure-redistributing mattresses.",
    examinerTip: "Never recommend massaging over reddened Stage 1 bony areas—friction/shear worsens deep tissue ischaemia!"
  },
  // Microbiology & Pathology
  {
    subj: "microbiology",
    id: "micro-meningitis",
    section: "Section C — Long Pathology & Medical Essay",
    marks: 20,
    topic: "Medical Microbiology · Bacterial Meningitis Diagnosis & CSF Profile",
    prompt: "(a) Name three common bacterial pathogens causing acute community meningitis in Uganda and compare CSF laboratory findings in Bacterial vs Viral meningitis. (10 marks)\n(b) Describe Kernig's sign, Brudzinski's sign, and immediate empiric antibiotic + IPC nursing care before and after lumbar puncture. (10 marks)",
    markingPoints: [
      "(a) Pathogens: Neisseria meningitidis, Streptococcus pneumoniae, Haemophilus influenzae type b (plus Group B Strep / E. coli in neonates) (3 marks). CSF Bacterial vs Viral: Appearance (turbid/purulent vs clear); Pressure (markedly raised vs normal/mildly raised); WBC (>1,000 polymorphs/neutrophils vs mild lymphocytes); Protein (high > 1.0 g/L vs normal/slightly raised); Glucose (very low < 40% serum glucose vs normal) (7 marks).",
      "(b) Kernig's sign: Pain/resistance extending knee with hip flexed at 90°; Brudzinski's sign: Involuntary hip/knee flexion when neck passively flexed (4 marks). Care: Stabilize airway, take blood cultures + start empiric IV Ceftriaxone immediately without delaying for CT/LP if shock/raised ICP suspected; Keep patient quiet, dimmed light, droplet isolation x 24 hrs post-antibiotic for N. meningitidis, monitor pupils/GCS/seizures (6 marks)."
    ],
    modelAnswer: "(a) Key community bacterial agents in Uganda are Streptococcus pneumoniae, Neisseria meningitidis, and Haemophilus influenzae type b (with Group B Streptococcus and E. coli predominating in neonates). CSF analysis:\n• Bacterial Meningitis: Turbid/cloudy appearance, high opening pressure, high neutrophil predominance (> 1,000 cells/mm3), elevated protein (> 1.0 g/L), and markedly low CSF glucose (< 40% of blood glucose).\n• Viral Meningitis: Clear appearance, mostly lymphocytes, mild/normal protein, and normal glucose.\n\n(b) Classic meningeal irritation signs include Kernig's sign (hamstring spasm resisting knee extension when hip is flexed at 90°) and Brudzinski's sign (involuntary hip and knee flexion upon passive neck flexion). Nursing management demands blood culture draw followed immediately by high-dose IV Ceftriaxone (per UCG 2023), droplet isolation for the first 24 hours of therapy, dark quiet room care, neurological GCS/pupil charting, and post-LP supine observation.",
    examinerTip: "Memorize the hallmark bacterial CSF triad: ↑ Protein, ↓ Glucose, ↑ Neutrophils (turbid CSF)."
  },
  {
    subj: "microbiology",
    id: "micro-immunity",
    section: "Section B — Short Essay",
    marks: 10,
    topic: "Immunology & Sterilization · Autoclave vs HLD & Immunity Types",
    prompt: "(a) Differentiate Active Natural, Active Artificial, Passive Natural, and Passive Artificial immunity with one clinical Ugandan example each. (6 marks)\n(b) State standard temperature, pressure, and holding time for effective surgical steam autoclaving. (4 marks)",
    markingPoints: [
      "(a) 1.5 marks each: Active Natural (host antibodies post-infection e.g. childhood measles); Active Artificial (UNEPI vaccination e.g. BCG/Pentavalent/Hepatitis B); Passive Natural (maternal transplacental IgG & colostrum secretory IgA); Passive Artificial (ready-made antiserum/immunoglobulin e.g. Tetanus Ig, Anti-Rabies Ig, Snake antivenom).",
      "(b) Unwrapped instruments: 121°C at 15 psi (103 kPa) for 15–20 minutes (or wrapped surgical packs for 30 minutes), or flash 134°C at 30 psi for 3–5 minutes; verify biological/chemical indicator tape strips (4 marks)."
    ],
    modelAnswer: "(a) Types of adaptive immunity:\n1. Active Natural: Long-term immunity acquired after recovering from natural infection (e.g. Varicella/Measles).\n2. Active Artificial: Stimulated safely via antigens in vaccines (e.g. UNEPI DPT-HepB-Hib or Measles-Rubella vaccines).\n3. Passive Natural: Temporary maternal antibodies passed across the placenta (IgG) or breastmilk colostrum (IgA).\n4. Passive Artificial: Immediate short-term protection via injected immunoglobulins (e.g. Human Tetanus Immunoglobulin or anti-rabies serum).\n\n(b) Gravity-displacement steam autoclaves sterilize wrapped surgical trays cleanly at 121°C under 15 psi (103 kPa) steam pressure for 30 minutes (unwrapped 15–20 minutes), eliminating bacteria, viruses, fungi, and heat-resistant bacterial endospores.",
    examinerTip: "Always quote BOTH temperature AND pressure/time: 121°C at 15 psi for 20–30 minutes."
  },
  // Pharmacology I & Calculations
  {
    subj: "pharmacology-i",
    id: "pharm1-adme-rights",
    section: "Section C — Pharmacology Essay & Dosage Calculation",
    marks: 20,
    topic: "Clinical Pharmacology · Pharmacokinetics, Safe Rights & IV Drip Calculation",
    prompt: "(a) Briefly explain the four pharmacokinetic phases (ADME) and state how liver failure affects drug dosing. (8 marks)\n(b) List seven (7) Core Rights of safe medication administration. (4 marks)\n(c) Prescription: Infuse 1,500 mL of 0.9% Sodium Chloride IV over 10 hours using a standard adult macro-drip giving set (20 drops/mL). Calculate the exact flow rate in drops per minute (gtt/min). Show your formula clearly. (8 marks)",
    markingPoints: [
      "(a) Absorption (movement from site to bloodstream), Distribution (vascular/tissue delivery + plasma protein binding), Metabolism (hepatic cytochrome P450 biotransformation), Excretion (renal/biliary clearance) (6 marks). Hepatic cirrhosis reduces first-pass metabolism & albumin binding -> drug accumulation/toxicity -> require dose reductions & prolonged intervals (2 marks).",
      "(b) Right Patient, Right Drug, Right Dose, Right Route, Right Time, Right Documentation, Right Reason/Refusal/Education (any 7 valid core rights, 4 marks).",
      "(c) Formula: Flow rate (drops/min) = [Total Volume (mL) × Drop Factor (drops/mL)] / [Time (hours) × 60 min] (3 marks). Substitution: (1,500 × 20) / (10 × 60) = 30,000 / 600 = 50 drops/minute (gtt/min) (5 marks)."
    ],
    modelAnswer: "(a) Pharmacokinetics describes what the body does to a drug across ADME: (1) Absorption from administration site into blood; (2) Distribution across compartments (influenced by albumin binding); (3) Metabolism predominantly in liver enzymes into polar metabolites; and (4) Excretion mostly via renal filtration/secretion. In severe hepatic dysfunction, slowed biotransformation and low albumin dangerously elevate free active drug levels, demanding smaller maintenance doses.\n\n(b) Seven Medication Rights: Right Patient (two identifiers), Right Medicine (generic + expiry check), Right Dose (verified weight/math), Right Route, Right Time, Right Assessment/Reason, and Right Documentation (plus Right to Refuse).\n\n(c) IV Drip Rate Calculation:\nFormula: Drops/min = (Volume in mL × Drop factor) ÷ Time in minutes\nTime in minutes = 10 hours × 60 = 600 minutes\nDrops/min = (1,500 × 20) ÷ 600 = 30,000 ÷ 600 = 50 drops/minute (50 gtt/min).",
    examinerTip: "Always write out the formula BEFORE plugging numbers in—UNMEB gives 3 method marks even if arithmetic slips!"
  },
  {
    subj: "pharmacology-i",
    id: "pharm1-paeds-calc",
    section: "Section B — Short Essay & Calculations",
    marks: 10,
    topic: "Drug Calculations · Weight-Based Paediatric Syrup & IM Bolus",
    prompt: "(a) A child weighing 14 kg is prescribed IV Ceftriaxone 50 mg/kg/day once daily. Stock vial is 1 g reconstituted in 10 mL sterile water. Calculate the dose in mg AND exact mL to draw. (5 marks)\n(b) Outline five precautions when administering Aminoglycosides (e.g. Gentamicin) in neonates or adults. (5 marks)",
    markingPoints: [
      "(a) Required dose = 50 mg/kg × 14 kg = 700 mg (2 marks); Stock concentration = 1,000 mg / 10 mL = 100 mg/mL -> Volume = 700 mg ÷ 100 mg/mL = 7.0 mL (3 marks).",
      "(b) Verify weight/renal creatinine accurately; Monitor for ototoxicity (tinnitus/hearing loss) & nephrotoxicity (low urine output/rising creatinine); Give at exact prescribed once-daily interval; Avoid co-administering with nephrotoxic furosemide where possible; Check IV line patency & do not mix in same syringe as beta-lactams (5 marks)."
    ],
    modelAnswer: "(a) Calculation:\n• Daily dose = 50 mg/kg × 14 kg = 700 mg.\n• Reconstituted concentration = 1,000 mg in 10 mL = 100 mg/mL.\n• Volume to draw = Desired (700 mg) ÷ Stock (100 mg) × 1 mL = 7.0 mL.\n\n(b) Gentamicin nursing precautions: Check accurate baseline weight and renal output; watch closely for irreversible ototoxicity (vertigo/tinnitus) and nephrotoxicity (oliguria); adhere strictly to once-daily dosing intervals; flush cannula thoroughly rather than mixing directly with penicillins; and confirm renal clearance in preterm neonates.",
    examinerTip: "Always convert grams to milligrams first (1 g = 1,000 mg) before applying D/H × V!"
  },
  // Medical Nursing I & II extras
  {
    subj: "medical-nursing-i",
    id: "med1-hypertension",
    section: "Section B — Short Essay",
    marks: 10,
    topic: "Cardiovascular Medical Nursing · Hypertensive Emergency vs Urgency",
    prompt: "(a) Differentiate Hypertensive Urgency from Hypertensive Emergency giving three examples of target-organ damage. (5 marks)\n(b) State five lifestyle modifications recommended under Uganda Clinical Guidelines for Stage 1–2 Hypertension. (5 marks)",
    markingPoints: [
      "(a) Both have severe BP (>= 180/120 mmHg); Emergency exhibits acute target-organ damage requiring gradual IV reduction in ICU/HDU (e.g. hypertensive encephalopathy/stroke, acute pulmonary oedema/LVF, aortic dissection, eclampsia, acute kidney injury) whereas Urgency lacks end-organ injury and lowers gently over 24–48 hrs orally (5 marks).",
      "(b) Reduce dietary salt (< 5 g/day); DASH high fruit/vegetable/low saturated fat diet; Regular aerobic exercise (>= 150 min/week); Weight reduction if overweight; Smoking cessation + limit alcohol strictly + adherence counselling (5 marks)."
    ],
    modelAnswer: "(a) While both present with severely elevated BP (>= 180/120 mmHg), Hypertensive Emergency includes acute life-threatening target-organ damage—such as acute stroke/encephalopathy, acute left ventricular failure with pulmonary oedema, acute myocardial infarction, aortic dissection, or eclampsia—and requires cautious controlled IV reduction (~20–25% in hour 1) to avoid cerebral hypoperfusion. Hypertensive Urgency has no end-organ damage and is managed gradually with oral agents over 24–48 hours.\n\n(b) Core non-pharmacological advice: Limit table salt (< 1 teaspoon / < 5 g daily), adopt fresh vegetable/fruit-rich low-fat meals, engage in brisk exercise 30 minutes most days, achieve healthy BMI, cease tobacco smoking, minimize alcohol intake, and never stop prescribed antihypertensives abruptly.",
    examinerTip: "Never drop BP to 'normal 120/80' within minutes during a hypertensive crisis—autoregulation failure causes watershed stroke!"
  },
  {
    subj: "medical-nursing-ii",
    id: "med2-lvf",
    section: "Section C — Long Medical Nursing Essay",
    marks: 20,
    topic: "Cardiology · Congestive & Left Ventricular Heart Failure",
    prompt: "A 58-year-old woman presents with orthopnoea (sleeping on 4 pillows), paroxysmal nocturnal dyspnoea, bilateral basal lung crackles, BP 102/68 mmHg, Pulse 112/min, SpO2 88%, and bilateral ankle oedema.\n(a) Explain why left-sided heart failure causes pulmonary congestion while right-sided heart failure causes peripheral oedema. (6 marks)\n(b) Formulate a Nursing Care Plan detailing four (4) priority interventions with clinical rationales for the acute first 24 hours. (10 marks)\n(c) Outline four nursing observations when administering Digoxin and IV Furosemide together. (4 marks)",
    markingPoints: [
      "(a) Weak Left Ventricle backs blood into Left Atrium & pulmonary vasculature -> hydrostatic lung oedema (crackles, orthopnoea, PND); Weak Right Ventricle backs blood into systemic venae cavae -> raised JVP, hepatomegaly, ascites, bilateral ankle oedema (6 marks).",
      "(b) High-Fowler's upright position with legs dependent -> decreases venous preload & aids diaphragm expansion (2.5m); Supplemental humidified O2 targeting SpO2 >= 94% -> corrects alveolar hypoxia (2.5m); Administer prescribed IV loop diuretic (Furosemide) + strict 24-hr intake/output + daily morning weight -> relieves fluid overload accurately (2.5m); Restrict salt/excess fluids cautiously + provide calm rest spacing nursing tasks -> lowers myocardial oxygen demand (2.5m).",
      "(c) Check apical pulse for 1 full minute BEFORE Digoxin (HOLD if adult HR < 60 bpm); Monitor Serum Potassium K+ closely because Furosemide wastes K+, and HYPOKALAEMIA precipitates severe Digoxin toxicity (yellow-green halos, nausea, bradyarrhythmia); Track hourly urine output & orthostatic hypotension (4 marks)."
    ],
    modelAnswer: "(a) In Left Ventricular Failure, poor forward output backs pressure up into the left atrium and pulmonary capillaries, pushing fluid into alveoli (basal crackles, orthopnoea, PND). In Right Ventricular Failure, pressure backs up through the venae cavae into systemic veins, producing elevated jugular venous pressure (JVP), tender hepatomegaly, and pitting pedal oedema.\n\n(b) Acute 24-hour nursing care plan:\n1. Airway/Positioning: Nurse upright in High-Fowler's (supported on pillows, legs dangling if comfortable) to reduce venous return (preload) and ease breathing.\n2. Oxygenation: Give titrated humidified oxygen maintaining SpO2 >= 94% and track respiratory rate.\n3. Fluid Unloading: Give prescribed IV Furosemide early in the day, chart strict hourly intake/output, and weigh the patient daily on the same scale.\n4. Energy Conservation: Maintain low-sodium fluid-controlled diet and cluster nursing interventions to minimize myocardial O2 demand.\n\n(c) Digoxin + Furosemide safety: Always auscultate the apical pulse for 60 full seconds (withhold Digoxin if HR < 60 bpm) and monitor Serum Potassium diligently—Furosemide-induced hypokalaemia sharply increases risk of life-threatening Digoxin toxicity (anorexia, vomiting, visual yellow halos, ventricular arrhythmias).",
    examinerTip: "Connecting Furosemide -> Hypokalaemia -> Digoxin toxicity is one of the highest-yield UNMEB pharmacology/medical questions!"
  },
  // Surgical Nursing I & II
  {
    subj: "surgical-nursing-i",
    id: "surg1-preop",
    section: "Section B — Short Essay",
    marks: 10,
    topic: "Perioperative Nursing · WHO Surgical Safety & Pre-op Checklist",
    prompt: "(a) Outline six essential nursing verifications completed BEFORE transferring a patient to the operating theatre. (6 marks)\n(b) State four post-operative complications prevented by early ambulation and deep-breathing exercises. (4 marks)",
    markingPoints: [
      "(a) Verified signed Informed Consent; Fasted status (NPO 6 hrs solids / 2 hrs clear fluids per protocol); Confirm surgical site mark + two-ID armband; Remove jewellery, dentures, nail polish & check allergies; Baseline vitals, latest Hb/grouping & cross-match; Void bladder just before transfer & pre-medicate cleanly (6 marks).",
      "(b) Deep Vein Thrombosis (DVT) / Pulmonary Embolism; Post-operative Atelectasis & Hypostatic Pneumonia; Paralytic Ileus (delayed gut peristalsis); Pressure ulcers / muscular deconditioning (4 marks)."
    ],
    modelAnswer: "(a) Immediate pre-operative nursing checklist: Confirm valid signed informed consent (patient understands procedure/risks); verify patient identity wristband and marked surgical site; ensure adherence to fasting (NPO guidelines) and empty bladder; verify dentures, prostheses, jewellery, and nail varnish are removed; document baseline vital signs, allergies, and lab results (Hb/cross-match); and perform skin prep without razor micro-abrasions (clippers preferred).\n\n(b) Early leg exercises, deep coughing/incentive spirometry, and timely ambulation prevent: (1) Atelectasis and hypostatic pneumonia; (2) Deep Vein Thrombosis (DVT) and fatal pulmonary embolism; (3) Post-operative paralytic ileus; and (4) Hospital-acquired pressure injuries.",
    examinerTip: "Mention using electric hair clippers immediately before theatre rather than wet-shaving razors (reduces SSI rates)."
  },
  {
    subj: "surgical-nursing-i",
    id: "surg1-haemorrhage",
    section: "Section C — Long Surgical Essay",
    marks: 20,
    topic: "Post-Operative Care · Types of Haemorrhage & Wound Dehiscence",
    prompt: "Four hours after an abdominal laparotomy, a patient becomes restless with soaked wound dressings, BP 84/56 mmHg, and Pulse 124 bpm.\n(a) Classify the three clinical types of surgical haemorrhage by timing, stating which type this patient exhibits. (6 marks)\n(b) Explain immediate post-operative resuscitation and nursing care before theatre re-exploration. (8 marks)\n(c) Distinguish Wound Dehiscence from Wound Evisceration and state the immediate emergency nursing action if bowel loops protrude. (6 marks)",
    markingPoints: [
      "(a) Primary (during surgery on table); Reactionary (within first 24 hours post-op due to slipped ligature or rising BP/vasodilation as anaesthesia wears off — THIS PATIENT at 4 hrs); Secondary (7–14 days post-op from infection sloughing vessels) (6 marks).",
      "(b) Apply firm sterile reinforced pressure dressing (do NOT strip initial saturated pad immediately); Position supine/legs flat, give O2, establish wide-bore IV access for warmed crystalloids + blood cross-match; Notify surgeon/theatre urgently; Keep NPO, check q15m vitals & drain/urine output (8 marks).",
      "(c) Dehiscence: Partial/complete separation of surgical wound edges/layers; Evisceration: Protrusion of internal viscera (bowel) through open incision (2 marks). Action: NEVER push organs back in! Cover viscera immediately with sterile gauze soaked in warm 0.9% Sodium Chloride, flex patient's knees (low Fowler's) to cut abdominal tension, give O2/NPO, call surgeon stat (4 marks)."
    ],
    modelAnswer: "(a) Surgical haemorrhage classifies as: Primary (intra-operative bleeding), Reactionary (occurring within the first 24 hours post-op as blood pressure recovers or a vessel ligature slips—this patient at 4 hours), and Secondary (7–14 days post-op caused by wound sepsis eroding vessel walls).\n\n(b) Immediate ward action: Reinforce blood-soaked dressings with thick sterile pads and firm pressure; nurse supine with oxygen; verify two large-bore IV lines are patent and infuse warmed isotonic Ringer's Lactate while requesting cross-matched packed red blood cells; alert the surgical team urgently for return to theatre; maintain NPO status and record 15-minute vitals plus urinary output.\n\n(c) Wound dehiscence is separation of wound margins without organ protrusion, whereas evisceration is protrusion of abdominal viscera (intestines) through the split wound. For evisceration: NEVER attempt to push loops back inside; immediately cover exposed bowel with sterile dressings moistened in warm sterile 0.9% Normal Saline, bend patient's knees with head slightly raised (20°) to reduce abdominal wall tension, keep NPO, reassure calmly, and summon the surgeon stat.",
    examinerTip: "Memorize Primary = on table, Reactionary = <24h, Secondary = 7–14d (infection), and 'Warm sterile saline-soaked gauze — NEVER push viscera back in!'"
  },
  {
    subj: "surgical-nursing-ii",
    id: "surg2-burns",
    section: "Section C — Long Trauma & Burn Essay",
    marks: 20,
    topic: "Trauma & Burns · Wallace Rule of Nines & Parkland Fluid Formula",
    prompt: "A 70 kg adult sustains deep partial-thickness burns over the entire anterior trunk, entire right upper limb, and entire left upper limb in a domestic cooking fire.\n(a) Calculate the total Body Surface Area (TBSA %) burned using Wallace's Rule of Nines. (4 marks)\n(b) Calculate the exact 24-hour Ringer's Lactate volume using the Parkland Formula (4 mL × kg × %TBSA) and specify how much is infused in the first 8 hours post-burn. (8 marks)\n(c) Outline four nursing priorities in the acute resuscitation phase (first 48 hours). (8 marks)",
    markingPoints: [
      "(a) Anterior trunk = 18%; Right arm = 9%; Left arm = 9% -> Total TBSA = 18 + 9 + 9 = 36% (4 marks).",
      "(b) 24-hr Volume = 4 mL × 70 kg × 36 = 10,080 mL (~10.08 Litres) Ringer's Lactate (4 marks); Infuse HALF (50% = 5,040 mL) during the first 8 hours CALCULATED FROM THE TIME OF BURN INJURY (not hospital arrival), and remaining 5,040 mL over the next 16 hours (4 marks).",
      "(c) 2 marks each: Assess airway early for inhalational injury (singed nasal hairs, hoarse voice, soot -> early intubation/O2); Monitor urinary output strictly via catheter targeting >= 0.5–1.0 mL/kg/hr (30–50 mL/hr) to titrate fluids; Give adequate IV opioid pain relief (Morphine titrated IV — never IM in shock) & warm room/cover to prevent hypothermia; Give Tetanus prophylaxis & clean sterile non-adherent burn dressings + watch compartment syndrome on circumferential limb burns."
    ],
    modelAnswer: "(a) By Wallace's Rule of Nines: Anterior trunk (18%) + Entire right arm (9%) + Entire left arm (9%) = 36% TBSA burned.\n\n(b) Parkland Formula calculation:\n• 24-hour total fluid = 4 mL × 70 kg × 36 = 10,080 mL Ringer's Lactate.\n• First 8 hours (counted from exact time of burn injury!): Infuse half = 5,040 mL (~630 mL/hr).\n• Next 16 hours: Infuse second half = 5,040 mL (~315 mL/hr).\n\n(c) Acute nursing priorities: (1) Inspect face/oropharynx early for soot, stridor, or hoarseness indicating airway oedema before airway closes; (2) Insert urinary catheter and titrate Ringer's rate to sustain urine output 30–50 mL/hr; (3) Administer IV analgesics (never IM in poorly perfused burnt shock) alongside Tetanus toxoid check; and (4) Monitor pulses/perfusion distal to circumferential arm burns for escharotomy need and prevent hypothermia.",
    examinerTip: "State explicitly that the Parkland 'first 8 hours' clock starts at TIME OF INJURY, not time of admission!"
  },
  {
    subj: "surgical-nursing-ii",
    id: "surg2-obstruction",
    section: "Section B — Short Essay",
    marks: 10,
    topic: "Acute Abdomen · Intestinal Obstruction & Appendicitis",
    prompt: "(a) List the four classic cardinal clinical features of mechanical Intestinal Obstruction. (4 marks)\n(b) Explain three nursing interventions carried out pre-operatively ('Drip & Suck') for acute intestinal obstruction. (6 marks)",
    markingPoints: [
      "(a) Colicky abdominal pain; Vomiting (early/bilious in small bowel vs late/faeculent in large bowel); Abdominal distension; Absolute constipation (failure to pass both faeces and flatus) (4 marks).",
      "(b) NPO (nothing by mouth) + continuous/intermittent Nasogastric tube decompression ('suck') to relieve intraluminal pressure/prevent aspiration (2 marks); IV Fluid & Potassium electrolyte replacement ('drip' Ringer's/NaCl + KCl) to reverse dehydration & metabolic alkalosis/hypokalaemia (2 marks); Strict input/output charting, serial abdominal girth measurements, avoid laxatives/enemas & monitor vital signs for bowel strangulation/peritonitis (2 marks)."
    ],
    modelAnswer: "(a) The four cardinal features of intestinal obstruction are: colicky central/diffuse abdominal pain, persistent vomiting, progressive abdominal distension, and absolute constipation (obstipation — no stool and no flatus passed).\n\n(b) 'Drip and Suck' pre-operative care: (1) Keep strictly NPO and insert a wide-bore NG tube for gentle suction decompression to prevent vomiting/aspiration; (2) Infuse isotonic IV fluids with ordered potassium supplementation to correct massive third-space fluid losses; and (3) Record hourly urine output, serial vital signs, and abdominal girth while watching closely for rebound rigidity/fever signaling ischaemic strangulation or perforation.",
    examinerTip: "Never give oral laxatives or purgatives in suspected intestinal obstruction—peristalsis against a blocked lumen causes bowel perforation!"
  },
  // Midwifery I
  {
    subj: "midwifery-i",
    id: "mw1-anc-fetal",
    section: "Section C — Long Midwifery Essay",
    marks: 20,
    topic: "Antenatal Care & Fetal Anatomy · Leopold Manoeuvres & Danger Signs",
    prompt: "(a) Outline WHO's eight (8) Antenatal Care (ANC) contacts objectives and name five essential screening/preventive interventions delivered under Uganda MoH guidelines. (10 marks)\n(b) Describe the four Leopold abdominal palpation manoeuvres and list five antenatal danger signs requiring urgent hospital referral. (10 marks)",
    markingPoints: [
      "(a) Early detection of hypertension/pre-eclampsia, anaemia, malpresentation & safe birth preparedness (3 marks). Core interventions: Tetanus-Diphtheria (Td) toxoid vaccination; Iron + Folic Acid daily supplementation (IFA); Intermittent Preventive Treatment of malaria in pregnancy (IPTp-SP from 13 weeks) + LLIN mosquito net; Routine HIV/Syphilis Duo testing & EMTCT; Deworming (Mebendazole after 1st trimester) & BP/urinalysis screening at every visit (7 marks).",
      "(b) Leopold 1 (Fundal grip — identify head vs breech in fundus), Leopold 2 (Lateral umbilical grip — locate fetal back vs limbs), Leopold 3 (Pawlik's single-hand suprapubic grip — determine presenting part & mobility), Leopold 4 (Pelvic/deep grip — assess engagement & flexion) (5 marks). Danger signs: Vaginal bleeding; Severe headache/blurred vision/convulsions; Leaking amniotic fluid (PROM); Severe abdominal pain; High fever or absent/reduced fetal movements (5 marks)."
    ],
    modelAnswer: "(a) WHO recommends 8 focused ANC contacts (replacing 4 visits) to reduce stillbirths and maternal mortality. Under Uganda MoH protocols, essential ANC interventions include: routine blood pressure and urine protein/glucose testing; Tetanus-Diphtheria (Td) immunization; daily Iron/Folic Acid supplementation; IPTp with Sulfadoxine-Pyrimethamine (Fansidar) starting in 2nd trimester plus sleeping under an LLIN; dual HIV/Syphilis rapid testing with Option B+ ART for EMTCT; and birth-preparedness planning.\n\n(b) Four Leopold grips (bladder emptied first, knees slightly flexed): (1) Fundal grip identifies breech vs head at uterine top; (2) Lateral grips trace smooth fetal back vs irregular limbs; (3) Pawlik's grip evaluates presenting part mobility above the pelvic inlet; (4) Pelvic grip confirms engagement and descent. Urgent danger signs: any vaginal bleeding, severe headache or visual blurring, gush of clear fluid, severe abdominal pain, high fever, or absent fetal movements.",
    examinerTip: "Always specify asking the mother to EMPTY HER BLADDER before starting abdominal palpation (Leopold manoeuvres)!"
  },
  {
    subj: "midwifery-i",
    id: "mw1-shunts-lochia",
    section: "Section B — Short Essay",
    marks: 10,
    topic: "Perinatal Physiology · Fetal Circulation Shunts & Puerperium",
    prompt: "(a) Name the three specialized anatomical shunts in fetal circulation and state what each closes into after birth. (6 marks)\n(b) Describe the chronological sequence and normal appearance of Lochia during the first 3–4 weeks postpartum. (4 marks)",
    markingPoints: [
      "(a) 2 marks each: 1) Ductus Venosus (bypasses liver from umbilical vein to IVC -> becomes ligamentum venosum); 2) Foramen Ovale (shunts blood Right Atrium -> Left Atrium bypassing lungs -> becomes fossa ovalis); 3) Ductus Arteriosus (connects pulmonary trunk -> descending aorta -> becomes ligamentum arteriosum).",
      "(b) Lochia Rubra (Days 1–3/4: bright/dark red blood, decidua, mucus); Lochia Serosa (Days 4–10: pinkish-brown serous discharge); Lochia Alba (Days 11–21+: yellowish-white mucoid leukocytes/decidual debris; NEVER foul-smelling) (4 marks)."
    ],
    modelAnswer: "(a) Fetal life uses three bypass shunts because lungs and liver are not yet primary gas/metabolic organs:\n1. Ductus Venosus: Routes oxygenated umbilical venous blood past hepatic sinusoids straight to the IVC -> fibroses into Ligamentum Venosum after birth.\n2. Foramen Ovale: Directs oxygenated blood from Right Atrium to Left Atrium -> closes functionally at first breaths into Fossa Ovalis.\n3. Ductus Arteriosus: Shunts right ventricular blood from pulmonary artery into aorta -> closes into Ligamentum Arteriosum.\n\n(b) Postpartum uterine discharge (Lochia) progresses cleanly: Lochia Rubra (Days 1–4, red blood/decidua) -> Lochia Serosa (Days 4–10, pinkish-brown) -> Lochia Alba (Weeks 2–4, creamy white). Foul odour or sudden return of heavy bright bleeding indicates endometritis or retained products.",
    examinerTip: "Remember: 1 Umbilical VEIN carries OXYGENATED blood TO the fetus; 2 Umbilical ARTERIES return DEOXYGENATED blood TO the placenta ('AVA')."
  },
  // Midwifery II extra
  {
    subj: "midwifery-ii",
    id: "mw2-partograph",
    section: "Section C — Long Intrapartum Essay",
    marks: 20,
    topic: "Labour Management · Modified WHO Partograph & Fetal Distress",
    prompt: "(a) Explain when plotting on the modified WHO Partograph begins and state five key maternal/fetal observations plotted alongside cervical dilatation. (10 marks)\n(b) Differentiate the Alert Line from the Action Line (4 hours apart), and outline urgent actions when cervical plotting crosses to the right of the Alert Line or fetal heart drops to 96 bpm. (10 marks)",
    markingPoints: [
      "(a) Plotting begins ONLY in Active First Stage of labour (>= 4 cm / WHO 5 cm cervical dilatation with regular painful contractions — never plot Latent Phase on main graph) (3 marks). Plotted parameters: Fetal Heart Rate (q30m), Amniotic fluid / Liquor colour (I intact, C clear, M meconium, B blood) & Moulding (0 to +++), Descent of head in fifths above pelvic brim (5/5 -> 0/5), Uterine contractions in 10 min (frequency & duration), Maternal vitals (BP q4h, Pulse q30m, Temp q2h, Urine volume/protein/acetone) + Oxytocin/drugs (7 marks).",
      "(b) Alert Line progresses at 1 cm/hr starting at 4 cm; Action Line runs parallel 4 hours to the right. Crossing the Alert Line warns of slow/prolonged labour needing senior assessment (check hydration, bladder emptying, adequacy of contractions, rule out CPD before considering ARM/Oxytocin augmentation) (5 marks). Fetal bradycardia (< 110 bpm -> 96 bpm) indicates acute fetal distress: stop Oxytocin immediately if running, position mother LEFT LATERAL, give O2/IV fluid bolus, check cord prolapse/vaginal bleeding, and prepare urgent delivery (vacuum if full dilatation or stat C-section) (5 marks)."
    ],
    modelAnswer: "(a) Plotting starts in Active First Stage of labour (>= 4 cm cervical dilatation with effective contractions). Alongside cervical dilatation ('X') and head descent in fifths ('O' descending from 5/5 to 0/5), midwives chart: Fetal Heart Rate (every 30 min; normal 110–160 bpm), amniotic liquor status and skull moulding, uterine contraction frequency/duration in 10 minutes, Oxytocin infusion drops/min, and maternal pulse (q30m), BP (q4h), temperature, and urinalysis.\n\n(b) The Alert Line slopes upward at 1 cm/hour; the Action Line lies parallel 4 hours right. Crossing the Alert Line alerts clinicians to re-evaluate the 3 Ps (Powers, Passage, Passenger), exclude Cephalopelvic Disproportion (CPD), empty the bladder, and intervene before crossing the Action Line. If FHR drops to 96 bpm (bradycardia): turn mother to Left Lateral position, stop any Oxytocin drip, administer oxygen + IV Ringer's bolus, perform vaginal exam to exclude cord prolapse, and arrange emergency delivery.",
    examinerTip: "Never start Oxytocin augmentation if Cephalopelvic Disproportion (CPD) or obstructed labour signs (moulding +++, oedema, caput) are present — risk of uterine rupture!"
  },
  // Midwifery III extra
  {
    subj: "midwifery-iii",
    id: "mw3-aph",
    section: "Section B — Short Essay",
    marks: 10,
    topic: "Obstetric Emergencies · Placenta Praevia vs Abruptio Placentae",
    prompt: "(a) Compare four key clinical differences between Placenta Praevia and Abruptio Placentae in late pregnancy. (6 marks)\n(b) State why digital Vaginal Examination (VE) is strictly CONTRAINDICATED before ultrasound in antepartum haemorrhage. (4 marks)",
    markingPoints: [
      "(a) Pain: Painless vs Severe sudden constant abdominal/back pain; Bleeding colour: Bright red visible vs Dark concealed/revealed (blood clots); Uterus on palpation: Soft, non-tender, fetal parts easily palpable vs Hard 'woody' tense tender board-like uterus with difficult fetal palpation; Fetal heart & Shock: Fetal heart usually present & shock matches visible loss vs Fetal distress/absent FH & shock SEVERER than visible blood loss (6 marks).",
      "(b) Digital VE can directly lacerate/dislodge a low-lying placenta sitting over the internal cervical os, triggering catastrophic maternal/fetal haemorrhage ('placental provocation') -> ultrasound localization MUST confirm placental site first unless C-section theatre scrubbed ('double set-up') (4 marks)."
    ],
    modelAnswer: "(a) Antepartum Haemorrhage comparison:\n• Placenta Praevia: Painless, recurrent bright red bleeding; uterus remains soft and non-tender; fetal presenting part often high/malpositioned with audible fetal heart; maternal shock correlates with external bleeding.\n• Abruptio Placentae: Sudden continuous tearing abdominal/back pain; darker blood (or totally concealed retroplacental clot); tense, rigid, tender ('woody') uterus; early fetal distress or absent heart rate; and shock disproportionate to visible vaginal blood.\n\n(b) Digital vaginal examination is strictly contraindicated before ultrasound placental localization because a probing finger can tear placental villi/sinuses across the internal os, precipitating massive fatal haemorrhage.",
    examinerTip: "In ANY painless third-trimester bleeding question, the #1 forbidden procedure on ward admission is Digital Vaginal Examination!"
  },
  {
    subj: "midwifery-iii",
    id: "mw3-pph",
    section: "Section C — Long Obstetric Emergency Essay",
    marks: 20,
    topic: "Maternal Emergencies · Primary Postpartum Haemorrhage (4 Ts)",
    prompt: "Twenty minutes after normal vaginal delivery, a multiparous mother saturates bed pads with >= 700 mL fresh blood, feels dizzy, BP 86/54 mmHg, Pulse 126/min, and a soft boggy uterus above the umbilicus.\n(a) State the diagnosis, give the '4 Ts' causes of Primary PPH, and identify the primary cause in this patient. (6 marks)\n(b) Detail the immediate stepwise emergency PPH resuscitation and uterine tamponade/drug bundle. (14 marks)",
    markingPoints: [
      "(a) Primary Postpartum Haemorrhage (> 500 mL vaginal loss within 24 hrs of birth). 4 Ts: Tone (uterine atony — ~70–80%, THIS PATIENT's boggy uterus), Trauma (cervical/vaginal/perineal tears/uterine rupture), Tissue (retained placental fragments), Thrombin (coagulopathy/DIC) (6 marks).",
      "(b) Call for help + mobilize PPH trolley! Perform immediate bimanual/rubbing fundal massage to expel clots and restore contraction (2m); Establish 2 large-bore 16G IV cannulae + draw grouping/cross-match + infuse warmed Ringer's Lactate (2m); Empty bladder via Foley catheter (full bladder blocks uterine contraction!) (2m); Uterotonics: Oxytocin 10 IU IM + 20–40 IU in 1 L IV infusion (60 drops/min) + Tranexamic Acid (TXA) 1 g IV within 3 hrs of birth + Misoprostol 800 mcg sublingual/rectal (or Ergometrine 0.5 mg IM if NOT hypertensive) (4m); If refractory: Bimanual compression, Condom/Bakri uterine balloon tamponade, inspect cervix/tears under light, and arrange emergency theatre if bleeding persists (4m)."
    ],
    modelAnswer: "(a) Diagnosis: Primary Postpartum Haemorrhage (blood loss >= 500 mL in first 24 hours with shock). The '4 Ts' causes are Tone (uterine atony—most common and evidenced here by the boggy elevated uterus), Trauma (lacerations), Tissue (retained placenta), and Thrombin (clotting disorder).\n\n(b) Immediate PPH Emergency Bundle:\n1. Call for senior help, monitor BP/pulse q5–15m, give oxygen, and keep warm.\n2. Rub up a uterine contraction immediately through bimanual fundal massage and evacuate clots.\n3. Insert an indwelling urinary catheter to keep the bladder empty.\n4. Site two 16G IV lines, draw cross-match/CBC bloods, and infuse rapid warmed Ringer's Lactate + ordered matched RBCs.\n5. Give uterotonics + antifibrinolytics per WHO/UCG 2023: Oxytocin IV infusion (20–40 IU in 1 L normal saline), IV Tranexamic Acid 1 g slowly over 10 min (given within 3 hours of delivery), plus Misoprostol 800 mcg sublingually (add Ergometrine 0.5 mg IM only if BP is normal/low).\n6. If atonic bleeding persists, apply bimanual uterine compression or Condom-Catheter Intrauterine Balloon Tamponade while ruling out tears/retained cotyledons and escalating for surgery.",
    examinerTip: "WHO added IV Tranexamic Acid (TXA 1 g within 3 hrs) as core standard PPH care—including it plus 'empty bladder via catheter' earns top examiner marks!"
  },
  // Gynaecology & Reproductive Health
  {
    subj: "gynaecology",
    id: "gyn-ectopic-pid",
    section: "Section C — Long Gynaecology Essay",
    marks: 20,
    topic: "Gynaecological Emergencies · Ruptured Ectopic Pregnancy vs Acute PID",
    prompt: "A 24-year-old woman with 7 weeks amenorrhoea arrives with acute unilateral lower abdominal pain, fainting, shoulder-tip pain, pale conjunctivae, BP 82/52 mmHg, Pulse 128 bpm, and tender cervical excitation.\n(a) State the most probable emergency diagnosis, explain shoulder-tip pain, and differentiate it from Acute Pelvic Inflammatory Disease (PID). (8 marks)\n(b) Describe immediate pre-operative nursing care and post-operative follow-up. (8 marks)\n(c) Write out Uganda Clinical Guidelines syndromic oral outpatient treatment for uncomplicated PID. (4 marks)",
    markingPoints: [
      "(a) Ruptured Ectopic Pregnancy (tubal pregnancy with haemoperitoneum). Shoulder-tip pain: Intra-abdominal blood irritates diaphragm/phrenic nerve (C3–C5 referred pain) (4 marks). PID vs Ectopic: PID typically has bilateral lower pain, mucopurulent discharge, fever >= 38°C, negative beta-hCG; Ectopic shows missed period + positive urine hCG, acute shock/pallor, severe unilateral tenderness/fainting (4 marks).",
      "(b) Resuscitate shock (supine flat, O2, two 16G IV lines, warmed crystalloids + urgent cross-match blood, urgent beta-hCG + pelvic ultrasound if stable — never delay laparotomy/salpingectomy if shocked), consent & prepare stat for emergency theatre; Post-op check Anti-D Rh immunoglobulin if Rhesus-negative, iron folate therapy, grief counselling & contraception education (8 marks).",
      "(c) UCG Syndromic PID outpatient therapy: Ceftriaxone 250–500 mg IM stat (or Cefixime) PLUS Doxycycline 100 mg PO BD x 14 days PLUS Metronidazole 400 mg PO BD/TDS x 14 days + treat sexual partners concurrently (4 marks)."
    ],
    modelAnswer: "(a) Most probable diagnosis: Ruptured Ectopic Pregnancy with acute haemoperitoneum and hypovolaemic shock. Shoulder-tip pain (Kehr's sign) results from intraperitoneal blood pooling under the diaphragm and irritating phrenic nerve roots (C3–C5). Unlike Acute PID (fever, purulent vaginal discharge, bilateral pelvic tenderness, negative pregnancy test), ectopic pregnancy features amenorrhoea, positive pregnancy test (beta-hCG), rapid pallor, fainting, and hypotension.\n\n(b) Pre-operative & Post-op Care: Keep supine, administer high-flow oxygen, secure two 16G IV cannulae, draw blood for grouping/cross-match, and start rapid Ringer's Lactate while preparing theatre urgently for laparotomy/salpingectomy. Check maternal Rhesus group (give Anti-D within 72h if Rh-negative), treat anaemia, offer sensitive bereavement counselling, and advise seeking early ultrasound in future pregnancies.\n\n(c) Uncomplicated PID Triple Therapy (UCG): IM Ceftriaxone stat (gonococcal coverage) + Oral Doxycycline 100 mg BD x 14 days (Chlamydia) + Oral Metronidazole 400 mg BD x 14 days (anaerobes), plus mandatory partner treatment.",
    examinerTip: "Always check Rhesus status after an ectopic pregnancy or miscarriage—Rh-negative mothers need Anti-D prophylaxis!"
  },
  // Paediatrics extras
  {
    subj: "paediatrics",
    id: "paed-imci-pneumonia",
    section: "Section B — Short Essay",
    marks: 10,
    topic: "Paediatrics & IMCI · Childhood Pneumonia & Fast Breathing Cut-offs",
    prompt: "(a) State the exact WHO/IMCI age-specific respiratory rate thresholds defining 'Fast Breathing' in children from birth to 5 years. (3 marks)\n(b) Distinguish 'Pneumonia' (Yellow) from 'Severe Pneumonia or Very Severe Disease' (Pink), and state first-line Uganda Clinical Guidelines drugs for each. (7 marks)",
    markingPoints: [
      "(a) < 2 months: >= 60 breaths/min; 2 to < 12 months: >= 50 breaths/min; 12 months to 5 years: >= 40 breaths/min (count 1 full minute on calm child) (3 marks).",
      "(b) Pneumonia (Yellow): Fast breathing AND/OR lower chest wall indrawing WITHOUT general danger signs -> Oral Amoxicillin dispersible tablets (DT) 40 mg/kg BD x 5 days (home care + danger-sign counselling) (3.5 marks). Severe Pneumonia (Pink): Cough/difficulty breathing PLUS any general danger sign (inability to drink/breastfeed, vomits everything, convulsions, lethargic/unconscious) or stridor in calm child / severe hypoxaemia SpO2 < 90% -> Prereferral/hospital IV Ampicillin (or Benzylpenicillin) + IV Gentamicin + O2 therapy (3.5 marks)."
    ],
    modelAnswer: "(a) IMCI Fast Breathing thresholds (counted over 60 seconds in a settled child): < 2 months: >= 60 breaths/min; 2 to 11 months: >= 50 breaths/min; 1 to 5 years: >= 40 breaths/min.\n\n(b) Under updated WHO/UCG IMCI rules: Non-severe Pneumonia (Yellow) includes fast breathing and/or chest indrawing with no danger signs—treated outpatient with high-dose Oral Amoxicillin dispersible tablets (40 mg/kg twice daily for 5 days). Severe Pneumonia (Pink) includes cough plus ANY general danger sign (lethargy/unconsciousness, convulsions, inability to drink/breastfeed, persistent vomiting), calm stridor, or SpO2 < 90%—requiring immediate hospital oxygen and parenteral Ampicillin (or Benzylpenicillin) plus Gentamicin.",
    examinerTip: "Notice the WHO/UCG IMCI update: uncomplicated lower chest wall indrawing WITHOUT danger signs is now treated with high-dose Oral Amoxicillin!"
  },
  // Community Health extras
  {
    subj: "community-phc",
    id: "phc-cold-chain",
    section: "Section C — Long Community Health Essay",
    marks: 20,
    topic: "Immunization & UNEPI · Cold Chain Storage, VVM & Cholera Control",
    prompt: "(a) Explain the proper temperature range (+2°C to +8°C), refrigerator shelf arrangement of vaccines (OPV/Measles vs Pentavalent/Td/PCV), and how to read a Vaccine Vial Monitor (VVM). (10 marks)\n(b) Outline six (6) rapid public-health nursing steps to contain a confirmed Cholera outbreak in a rural Ugandan parish. (10 marks)",
    markingPoints: [
      "(a) Routine clinic fridge temp: +2°C to +8°C checked twice daily (morning & evening) (2m); Heat-sensitive freeze-tolerant vaccines (OPV, Measles-Rubella, BCG) go in colder top/freezer-adjacent section, while FREEZE-SENSITIVE vaccines (DPT-HepB-Hib Pentavalent, Td, PCV, IPV, Rotavirus, HPV) go in warmer middle shelves NEVER touching ice/evaporator plate ('Shake Test' if suspected frozen!) (5m); VVM: Inner square LIGHTER than outer circle = SAFE TO USE; Inner square MATCHES or is DARKER than outer circle = DISCARD IMMEDIATELY (3m).",
      "(b) 1.6m each (~10m): Establish Oral Rehydration Points (ORPs) & Cholera Treatment Centre (CTC) with isolation latrines/buckets; Immediate Plan B/C Ringer's Lactate + ORS + Zinc + Doxycycline (severe cases); Chlorinate drinking water / promote boiling & safe water jerrycans; Distribute soap & build tippy-tap handwashing stations; Conduct safe supervised burial practices & food hygiene bans; Rapid contact tracing, VHT house-to-house health education & epidemic line-list reporting."
    ],
    modelAnswer: "(a) At Health Centre level, UNEPI vaccines are stored between +2°C and +8°C and logged twice daily. Place OPV, BCG, and Measles-Rubella (more heat-sensitive) on upper shelves closest to the cooling zone, whereas freeze-sensitive vaccines (Pentavalent, PCV, Td, IPV, Rotavirus) sit safely on middle shelves away from the evaporator plate—any freeze-sensitive vaccine exposed below 0°C fails potency and requires the Shake Test. Before drawing any dose, inspect the Vaccine Vial Monitor (VVM): use ONLY while the inner square remains visibly lighter than the outer reference circle; discard immediately if equal or darker.\n\n(b) Cholera Outbreak Containment: (1) Set up decentralized Oral Rehydration Points and an isolated Cholera Treatment Unit using chlorine-disinfected cholera cots; (2) Deliver rapid Ringer's Lactate / ORS and Doxycycline for severe watery diarrhoea; (3) Distribute chlorine water-treatment tablets (Aquatabs) and enforce safe household water storage; (4) Enforce handwashing stations and sanitary excreta containment away from water sources; (5) Ensure safe hygienic burials and temporary bans on open raw street foods; and (6) Mobilize VHTs for active surveillance, ORS preparation demos, and district IDSR reporting.",
    examinerTip: "Examiners love seeing the 'Shake Test' mentioned for accidentally frozen Pentavalent/Td vaccines and the VVM square-vs-circle color rule!"
  },
  // Mental Health & Nursing Ethics
  {
    subj: "mental-health-ethics",
    id: "mhe-psychosis-ethics",
    section: "Section C — Long Psychiatric & Ethics Essay",
    marks: 20,
    topic: "Mental Health & Ethics · Acute Psychosis, Suicide Risk & UNMC Code",
    prompt: "A 28-year-old man is brought by relatives shouting at unseen voices, refusing food due to fears of poisoning, and pacing aggressively.\n(a) Identify two acute psychotic symptoms demonstrated and describe six de-escalation & therapeutic nursing actions. (10 marks)\n(b) Contrast Lithium/Haloperidol extrapyramidal side-effects (EPS) and state the drug used to treat acute dystonia. (4 marks)\n(c) Outline three UNMC ethical principles (Autonomy, Non-maleficence, Confidentiality) and explain when breaking confidentiality is legally justified. (6 marks)",
    markingPoints: [
      "(a) Symptoms: Auditory hallucinations ('shouting at unseen voices') & Persecutory delusions ('fears of poisoning') (2 marks). Actions: Ensure physical safety (remove sharp hazards, keep clear exit behind nurse); Calm non-threatening tone/maintain respectful personal space; Avoid arguing directly against or reinforcing hallucinations/delusions ('I don't hear the voices, though I see this feels frightening to you'); Serve sealed/self-prepared or pre-packaged visible foods to rebuild nutrition trust; Administer prescribed antipsychotics + monitor vitals cleanly (8 marks).",
      "(b) Acute dystonia (neck torticollis/oculogyric crisis), Akathisia, Parkinsonism, Tardive dyskinesia from typical D2 blockade (Haloperidol/Chlorpromazine) (2 marks); Treated urgently with anticholinergic Biperiden or Trihexyphenidyl (Benzhexol) / Diphenhydramine (2 marks).",
      "(c) Autonomy (informed consent/self-determination), Non-maleficence ('do no harm'), Confidentiality (protecting health data under Uganda Data Protection & UNMC Ethics) (3 marks). Permissible exceptions: Imminent credible risk of serious harm to self (active suicide plan) or identifiable others (homicidal threat), statutory notifiable diseases/child abuse protection, or valid court order (3 marks)."
    ],
    modelAnswer: "(a) The client displays auditory hallucinations and persecutory (paranoid) delusions. Nursing de-escalation priorities: Keep a calm low voice and safe exit clearance; reduce noisy ward stimulation; acknowledge fear honestly without validating or arguing over the delusion ('I know those fears feel real to you; you are safe here'); offer wrapped/sealed water or untouched food portions to ease poisoning anxiety; and collaborate promptly on prescribed antipsychotic therapy.\n\n(b) High-potency typical antipsychotics (e.g. Haloperidol) block dopamine D2 receptors causing extrapyramidal symptoms (EPS) like acute muscular dystonia, akathisia, or tremor—reversed quickly by anticholinergic Biperiden IM/IV or oral Benzhexol (Trihexyphenidyl).\n\n(c) Core UNMC ethical obligations include Autonomy (respecting competent informed decisions), Non-maleficence (preventing avoidable harm), and Confidentiality. Confidentiality may ethically/legally be breached strictly on a need-to-know basis when preventing imminent self-harm or harm to others, mandatory child-protection/notifiable infectious reporting, or formal court subpoena.",
    examinerTip: "Never tell a hallucinating patient 'The voices are telling you lies' OR agree 'Yes I hear them too'—validate their FEELING without confirming the false perception!"
  },
  // Leadership, OSH & Research
  {
    subj: "hsm-osh-research",
    id: "hsm-pep-research",
    section: "Section B — Short Essay",
    marks: 10,
    topic: "Occupational Safety (OSH) & Nursing Leadership · Needlestick PEP & Delegation",
    prompt: "(a) Outline the immediate six (6) emergency steps a student nurse must follow after an accidental hollow-bore needlestick injury from an HIV-positive patient. (6 marks)\n(b) State four rules of safe nursing task delegation on a busy medical ward. (4 marks)",
    markingPoints: [
      "(a) Wash puncture site immediately with soap and running water (DO NOT squeeze forcefully or apply bleach/caustics!) (2 marks); Report immediately to Ward In-Charge / Occupational Safety focal officer & document incident time (1 mark); Perform rapid HIV baseline testing of source & nurse + Hep B screening (1 mark); Start Triple Post-Exposure Prophylaxis (PEP, e.g. TDF + 3TC + DTG per Uganda MoH) AS SOON AS POSSIBLE within 1–2 hours and strictly < 72 hours for 28 continuous days (2 marks).",
      "(b) Right Task, Right Circumstance, Right Person, Right Direction/Communication, Right Supervision/Evaluation — RN/Enrolled nurse retains final accountability & never delegates unstable assessments or initial nursing diagnoses (4 marks)."
    ],
    modelAnswer: "(a) Following an occupational needlestick injury: (1) Gently wash immediately under clean running water and soap—avoid squeezing aggressively or scrubbing with caustic bleach; (2) Notify the ward supervisor promptly and log an incident report; (3) Establish baseline HIV/Hepatitis B status; (4) Initiate full 28-day oral 3-drug PEP (TDF/3TC/DTG per Uganda guidelines) ideally within 1–2 hours and no later than 72 hours; and (5) Complete follow-up HIV testing at 6 weeks and 3–6 months.\n\n(b) Safe delegation requires matching the Five Rights of Delegation: Right Task, Right Circumstance, Right Person (competent trainee/support staff), Right Clear Instructions, and Right Supervision & Feedback—remembering that clinical assessment and initial care planning stay with the licensed nurse.",
    examinerTip: "In Uganda PEP guidelines: Time limit = strictly <= 72 hours (best < 2 hrs), full duration = 28 days, and NEVER squeeze blood out violently or pour JIK/bleach into the puncture!"
  },
  // Emergency & Trauma extra
  {
    subj: "emergency-trauma",
    id: "emg-snake-poison",
    section: "Section B — Short Essay",
    marks: 10,
    topic: "First Aid & Toxicology · Snakebite vs Acute Organophosphate Poisoning",
    prompt: "(a) Contrast what TO DO versus two dangerous harmful practices to AVOID immediately after a venomous snakebite in rural Uganda. (5 marks)\n(b) State the toxidrome signs ('SLUDGE/DUMBELS') and definitive antidote regimen for Organophosphate pesticide poisoning. (5 marks)",
    markingPoints: [
      "(a) DO: Keep victim calm & still, immobilize bitten limb at heart level with broad splint/pressure bandage (for neurotoxic), remove rings/watches early before swelling, evacuate rapidly to hospital with antivenom/airway readiness (3 marks). AVOID: Tight arterial tourniquets causing ischaemic gangrene, cutting/sucking the wound with mouth, applying electric shock or herbal stones (2 marks).",
      "(b) Muscarinic cholinergic overload: Pinpoint pupils (miosis), profuse sweating/salivation/bronchorrhoea ('wet drowning lungs'), bradycardia, vomiting/diarrhoea, fasciculations (3 marks). Antidote: Decontaminate clothes/skin with soap/water, airway suction, give high-dose IV Atropine boluses aggressively until bronchial secretions dry up ('atropinization': clear lungs, dilated pupils, HR > 80) + Pralidoxime (2-PAM) if available (2 marks)."
    ],
    modelAnswer: "(a) First aid for snakebite focuses on immobilization: keep the casualty quiet, splint and immobilize the limb without constricting circulation, remove jewellery before oedema sets in, and transport urgently for polyvalent antivenom and airway support. Never apply tight arterial tourniquets, incise the bite site, or attempt oral venom suction—all increase tissue necrosis and haemorrhage.\n\n(b) Organophosphate pesticides inhibit acetylcholinesterase, producing cholinergic excess (miosis, bronchorrhoea, salivation, lacrimation, bradycardia, muscle fasciculations). After removing contaminated clothing and washing skin, administer repeated escalating doses of IV Atropine until chest secretions clear ('atropinization'), alongside Pralidoxime early to reactivate cholinesterase.",
    examinerTip: "Note that the endpoint of Atropine dosing in organophosphate poisoning is DRY CHEST / CLEAR LUNGS—not merely fixed dilated pupils!"
  }
];

for (const e of ADDITIONAL_ESSAYS) {
  pushEssay(e.subj, {
    id: e.id,
    section: e.section,
    marks: e.marks,
    topic: e.topic,
    prompt: e.prompt,
    markingPoints: e.markingPoints,
    modelAnswer: e.modelAnswer,
    examinerTip: e.examinerTip
  });
}

// 18 Official UHPAB / UNMEB Examination Subject Blueprints
const SUBJECTS = [
  { key: "anatomy-i", code: "CN 111", title: "Anatomy, Physiology I & First Aid", prog: "Certificate in Nursing · Year 1 Sem 1", mcqDomains: ["anatomy-physiology", "emergency-critical"], fallbackEssays: ["anat1-heart", "anat1-respiratory", "es-free-1", "es-free-2"] },
  { key: "anatomy-ii", code: "CN 121", title: "Anatomy & Physiology II (Systemic)", prog: "Certificate in Nursing · Year 1 Sem 2", mcqDomains: ["anatomy-physiology"], fallbackEssays: ["anat2-nephron", "anat2-cranial", "anat2-endocrine"] },
  { key: "foundations-i", code: "CN 112", title: "Foundations of Nursing I & IPC", prog: "Certificate in Nursing · Year 1 Sem 1", mcqDomains: ["foundations-nursing"], fallbackEssays: ["fond1-ipc", "fond1-vitals"] },
  { key: "foundations-ii", code: "CN 122", title: "Foundations of Nursing II & Bedside Skills", prog: "Certificate in Nursing · Year 1 Sem 2", mcqDomains: ["foundations-nursing", "medical-surgical"], fallbackEssays: ["fond2-ngtube", "fond2-pressure"] },
  { key: "microbiology", code: "CN 113", title: "Microbiology, Parasitology & Immunology", prog: "Certificate & Diploma · Year 1", mcqDomains: ["community-microbiology", "anatomy-physiology"], fallbackEssays: ["micro-meningitis", "micro-immunity"] },
  { key: "pharmacology-i", code: "DN 211", title: "Clinical Pharmacology & Drug Calculations", prog: "Certificate & Diploma · Year 1–2", mcqDomains: ["pharmacology"], fallbackEssays: ["pharm1-adme-rights", "pharm1-paeds-calc", "es-ms-2"] },
  { key: "medical-nursing-i", code: "CN 211", title: "Medical Nursing I & Communicable Diseases", prog: "Certificate in Nursing · Year 2 Sem 1", mcqDomains: ["medical-surgical", "pharmacology"], fallbackEssays: ["es-ms-1", "med1-hypertension", "es-ms-2"] },
  { key: "medical-nursing-ii", code: "DN 221", title: "Medical Nursing II (Cardio, Renal & Endocrine)", prog: "Diploma in Nursing · Year 2 Sem 2", mcqDomains: ["medical-surgical", "anatomy-physiology"], fallbackEssays: ["med2-lvf", "es-ms-3", "es-ms-4"] },
  { key: "surgical-nursing-i", code: "CN 212", title: "Surgical Nursing I & Perioperative Care", prog: "Certificate in Nursing · Year 2 Sem 1", mcqDomains: ["medical-surgical", "emergency-critical"], fallbackEssays: ["surg1-preop", "surg1-haemorrhage"] },
  { key: "surgical-nursing-ii", code: "DN 223", title: "Surgical Nursing II, Trauma & Orthopaedics", prog: "Diploma in Nursing · Year 2 Sem 2", mcqDomains: ["emergency-critical", "medical-surgical"], fallbackEssays: ["surg2-burns", "surg2-obstruction", "es-free-2"] },
  { key: "midwifery-i", code: "CM 112", title: "Midwifery I — Antenatal Care & Fetal Development", prog: "Certificate in Midwifery · Year 1 Sem 1", mcqDomains: ["midwifery-maternal", "obstetrics-gynaecology"], fallbackEssays: ["mw1-anc-fetal", "mw1-shunts-lochia"] },
  { key: "midwifery-ii", code: "CM 121", title: "Midwifery II — Normal Labour, Partograph & Newborn", prog: "Certificate in Midwifery · Year 1 Sem 2", mcqDomains: ["midwifery-maternal"], fallbackEssays: ["mw2-partograph", "es-mw-1", "es-mw-2"] },
  { key: "midwifery-iii", code: "DM 221", title: "Midwifery III — Obstetric Emergencies & High Risk", prog: "Diploma in Midwifery · Year 2 Sem 2", mcqDomains: ["obstetrics-gynaecology", "midwifery-maternal"], fallbackEssays: ["es-mw-3", "mw3-aph", "mw3-pph"] },
  { key: "gynaecology", code: "CM 213", title: "Gynaecology, STIs & Reproductive Health", prog: "Certificate & Diploma in Midwifery", mcqDomains: ["obstetrics-gynaecology", "pharmacology"], fallbackEssays: ["gyn-ectopic-pid", "mw3-aph"] },
  { key: "paediatrics", code: "DN 222", title: "Paediatric Nursing, IMCI & Neonatal Nutrition", prog: "Certificate & Diploma · Year 2", mcqDomains: ["paediatrics"], fallbackEssays: ["es-ph-2", "es-ph-3", "paed-imci-pneumonia"] },
  { key: "community-phc", code: "CN 214", title: "Community Health Nursing, PHC & Epidemiology", prog: "All Nursing & Midwifery Programmes", mcqDomains: ["community-microbiology"], fallbackEssays: ["es-ph-1", "phc-cold-chain"] },
  { key: "mental-health-ethics", code: "DN 214", title: "Mental Health, Psychiatry & Nursing Ethics", prog: "Diploma & Certificate · Year 2", mcqDomains: ["mental-health-ethics"], fallbackEssays: ["mhe-psychosis-ethics", "hsm-pep-research"] },
  { key: "hsm-osh-research", code: "UHPAB-301", title: "Occupational Safety (OSH), Leadership & Research", prog: "Diploma & Comprehensive Nursing · Year 3", mcqDomains: ["mental-health-ethics", "foundations-nursing"], fallbackEssays: ["hsm-pep-research", "fond1-ipc"] }
];

const SITTINGS = [
  { code: "2025-may", label: "May / June 2025 UHPAB Series", year: 2025 },
  { code: "2024-dec", label: "Nov / Dec 2024 UHPAB Series", year: 2024 },
  { code: "2023-jun", label: "May / June 2023 UNMEB Series", year: 2023 },
  { code: "2022-dec", label: "Nov / Dec 2022 UNMEB Series", year: 2022 },
  { code: "2021-jun", label: "May / June 2021 UNMEB Series", year: 2021 },
  { code: "2019-dec", label: "Nov / Dec 2019 UNMEB Series", year: 2019 }
];

function pickRotated(arr, count, offset) {
  if (!arr.length) return [];
  const res = [];
  for (let i = 0; i < Math.min(count, arr.length); i++) {
    res.push(arr[(offset + i) % arr.length]);
  }
  return res;
}

const papers = [];

// Paper 0: Free Starter Sampler
papers.push({
  id: freeSampler.id,
  paperCode: "FREE-SAMPLER",
  subject: "Anatomy, First Aid & Shock",
  seriesTag: freeSampler.seriesTag,
  year: 2025,
  title: freeSampler.title,
  programmeLabel: freeSampler.programmeLabel,
  duration: freeSampler.duration,
  totalMarks: freeSampler.totalMarks,
  isFreeSample: true,
  priceUsd: 0,
  desc: freeSampler.desc,
  mcqIds: pickRotated(domainBuckets.get("anatomy-physiology") || [], 6, 0),
  essayIds: ["es-free-1", "es-free-2", "es-free-3"]
});

let freeGranted = 1;

for (let si = 0; si < SITTINGS.length; si++) {
  const sitting = SITTINGS[si];
  for (let ji = 0; ji < SUBJECTS.length; ji++) {
    const subj = SUBJECTS[ji];
    // Combine MCQs from primary/secondary domains + general-unmeb
    const mcqPool = [];
    for (const d of subj.mcqDomains) {
      for (const id of domainBuckets.get(d) || []) {
        if (!mcqPool.includes(id)) mcqPool.push(id);
      }
    }
    for (const id of domainBuckets.get("general-unmeb") || []) {
      if (mcqPool.length < 18 && !mcqPool.includes(id)) mcqPool.push(id);
    }

    const offsetMcq = (si * 5 + ji * 3) % Math.max(1, mcqPool.length);
    const selectedMcqs = pickRotated(mcqPool, 10, offsetMcq);

    // Combine essays for this subject
    const rawSubjectEssays = [...(essayBuckets.get(subj.key) || []), ...(subj.fallbackEssays || [])];
    const uniqueEssays = [...new Set(rawSubjectEssays)].filter((id) => essayBank[id]);
    const rotatedEssays = pickRotated(uniqueEssays, Math.min(3, uniqueEssays.length), si);

    const essayMarks = rotatedEssays.reduce((sum, id) => sum + Number(essayBank[id]?.marks || 10), 0);
    const totalMarks = selectedMcqs.length + essayMarks;

    // Make 1 free paper per major specialty in 2025 so visitors can preview multiple free PDFs
    const isExtraFree = si === 0 && (subj.key === "midwifery-ii" || subj.key === "medical-nursing-i") && freeGranted < 3;
    if (isExtraFree) freeGranted++;

    papers.push({
      id: `uhpab-${subj.key}-${sitting.code}`,
      paperCode: subj.code,
      subject: subj.title,
      seriesTag: sitting.label,
      year: sitting.year,
      title: `${subj.code} · ${subj.title} (${sitting.label})`,
      programmeLabel: subj.prog,
      duration: 120,
      totalMarks,
      isFreeSample: isExtraFree,
      priceUsd: isExtraFree ? 0 : 6.99,
      desc: `Full past-paper sitting featuring ${selectedMcqs.length} Section A Objective MCQs plus ${rotatedEssays.length} structured Section B & C Essay Questions with Dark Navy marking guides & downloadable PDF.`,
      mcqIds: selectedMcqs,
      essayIds: rotatedEssays
    });
  }
}

const out = {
  generatedAtUtc: new Date().toISOString(),
  totalPapers: papers.length,
  disclaimer:
    "Comprehensive UHPAB / UNMEB format examination archive compiled from official curriculum frameworks, Uganda Clinical Guidelines 2023, WHO protocols, OpenStax, and Open RN. Downloadable PDFs include full Dark Navy examiner marking schemes and model answers.",
  mcqBank,
  essayBank,
  papers
};

const outPath = path.join(DATA_DIR, "unmeb-essay-papers.json");
fs.writeFileSync(outPath, JSON.stringify(out), "utf8");
const kb = Math.round(fs.statSync(outPath).size / 1024);

console.log(
  JSON.stringify({
    ok: true,
    totalPapers: papers.length,
    mcqBankSize: Object.keys(mcqBank).length,
    essayBankSize: Object.keys(essayBank).length,
    sizeKb: kb
  }, null, 2)
);
