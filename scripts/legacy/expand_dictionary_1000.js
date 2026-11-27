/**
 * Expands assets/data/dictionary.json to 1,000+ comprehensive clinical, nursing,
 * midwifery, pharmacology, anatomy, pathology & diagnostic A–Z terms and 150+ hospital
 * ward abbreviations by combining:
 *   1. Existing curated Nursing Uganda dictionary entries
 *   2. Curated clinical core nursing/medical/pathology glossary entries across A–Z
 *   3. Authentic clinical terms & first-section definitions extracted from the 95 course units
 *   4. Authentic clinical instrument terms from medical-instruments.json (categorized cleanly)
 */
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const DATA_PATH = path.join(ROOT, "assets", "data", "dictionary.json");
const COURSES_DIR = path.join(ROOT, "assets", "data", "courses");
const INST_PATH = path.join(ROOT, "assets", "data", "medical-instruments.json");

function slugify(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// High-yield curated medical roots, diseases, labs, pharmacology, midwifery & anatomy A–Z pack
const CURATED_MEDICAL_PAIRS = [
  ["Abdominal Distension", "Assessment", "Gastrointestinal", "Visible or measurable swelling of the abdomen from gas, fluid (ascites), faeces, mass, or pregnancy.", "Measure abdominal girth consistently at umbilical level, auscultate all four quadrants for bowel sounds before palpation, and assess rigidity or guarding."],
  ["Acapnia", "Pathology", "Respiratory", "Abnormally low arterial carbon dioxide level (hypocapnia) typically triggered by hyperventilation.", "Coach anxious hyperventilating patients on slow pursed-lip breathing and check underlying hypoxia, pain, or metabolic acidosis before attributing to anxiety."],
  ["Acetabulum", "Anatomy & Physiology", "Musculoskeletal", "Cup-shaped socket of the pelvic hip bone articulating with the femoral head.", "Assess hip alignment, limb shortening, and external rotation urgently after pelvic falls or RTA trauma."],
  ["Achalasia", "Medical-Surgical", "Gastrointestinal", "Oesophageal motility disorder with failure of lower oesophageal sphincter relaxation and absent peristalsis.", "Elevate head during meals, encourage small soft swallows with fluids, and monitor for aspiration pneumonia."],
  ["Acidosis (Metabolic / Respiratory)", "Pathology", "Systemic / Renal", "Blood pH below 7.35 caused either by bicarbonate loss/acid accumulation or CO2 retention.", "Track arterial blood gases (pH, PaCO2, HCO3-), Kussmaul hyperventilation, serum potassium shifts, and underlying DKA, shock, or COPD."],
  ["Acromegaly", "Medical-Surgical", "Endocrine", "Progressive enlargement of extremities and facial bones in adults from excess Growth Hormone (pituitary adenoma).", "Assess visual field deficits (bitemporal hemianopia), hypertension, sleep apnoea, and glucose intolerance."],
  ["Acute Kidney Injury (AKI)", "Medical-Surgical", "Renal", "Sudden reversible decline in glomerular filtration rate causing rising creatinine, urea, and oliguria.", "Calculate strict hourly urine output (< 0.5 mL/kg/hr alert), hold nephrotoxic drugs (gentamicin/NSAIDs), and monitor ECG for hyperkalaemia."],
  ["Addison's Disease", "Medical-Surgical", "Endocrine", "Primary chronic adrenal cortex insufficiency causing deficient cortisol and aldosterone.", "Educate patients never to stop oral Hydrocortisone abruptly and double doses during fever/stress to prevent fatal Addisonian crisis."],
  ["Adduction vs Abduction", "Anatomy & Physiology", "Musculoskeletal", "Adduction moves a limb toward the body midline; abduction moves a limb away from the midline.", "Maintain hip abduction with a triangular pillow after total hip arthroplasty per orthopaedic orders to prevent dislocation."],
  ["Adenocarcinoma", "Pathology", "Oncology", "Malignant epithelial tumour originating in glandular or secretory tissues such as stomach, colon, lung, or breast.", "Coordinate analgesia, nutrition support, staging investigations, and compassionate patient/family counselling."],
  ["Adhesion (Post-Surgical)", "Medical-Surgical", "Gastrointestinal", "Fibrous scar bands forming between internal tissues and organs after abdominal surgery or PID.", "Monitor post-op bowel obstruction red flags: colicky pain, bilious vomiting, distension, and absent flatus."],
  ["Adrenaline (Epinephrine)", "Pharmacology", "Emergency Care", "Potent alpha/beta adrenergic agonist used first-line in anaphylaxis and cardiac arrest resuscitation.", "Administer 0.5 mg (1:1000) IM into outer thigh immediately for anaphylaxis; use 1 mg (1:10,000) IV during cardiac arrest algorithms."],
  ["Afebrile", "Assessment", "Systemic", "Absence of fever (normal body temperature around 36.2 C–37.4 C).", "Note that malnourished or severely immunocompromised neonates/elderly can have lethal sepsis while remaining afebrile."],
  ["Agranulocytosis", "Pathology & Lab", "Haematology", "Dangerously severe deficiency of granulocytes (neutrophils), carrying extreme bacterial sepsis risk.", "Institute protective reverse isolation, avoid rectal temperatures/enemas, and treat any fever >= 38 C as an immediate emergency."],
  ["Akathisia", "Mental Health", "Neurology / Psychiatry", "Extrapyramidal antipsychotic side-effect causing intense subjective inner restlessness and pacing.", "Distinguish carefully from worsening psychosis before increasing antipsychotic doses; review with prescriber for dose reduction or beta-blocker/anticholinergic relief."],
  ["Albuminuria", "Pathology & Lab", "Renal / Midwifery", "Presence of abnormal albumin protein in urine, indicating glomerular barrier damage or pre-eclampsia.", "Check urine dipstick protein at every antenatal visit >= 20 weeks alongside blood pressure screening."],
  ["Alkalosis (Respiratory / Metabolic)", "Pathology", "Systemic", "Arterial pH > 7.45 from excess bicarbonate retention, protracted gastric vomiting, or hyperventilation.", "Monitor for circumoral numbness, carpopedal spasm (hypocalcaemic tetany), and hypokalaemia."],
  ["Alopecia", "Medical-Surgical", "Integumentary", "Partial or complete loss of scalp or body hair secondary to chemotherapy, alopecia areata, malnutrition, or fungal tinea.", "Provide empathetic psychosocial support, scalp protection from sun/cold, and inspect scalp for tinea capitis."],
  ["Alveolus", "Anatomy & Physiology", "Respiratory", "Microscopic grape-like air sac at the end of respiratory bronchioles where O2 and CO2 gas exchange occurs.", "Promote deep breathing, early ambulation, and incentive spirometry to prevent post-operative alveolar collapse (atelectasis)."],
  ["Amenorrhoea", "Midwifery & OB", "Reproductive", "Absence of menstruation — physiological in pregnancy/lactation or pathological (primary > 16 yrs; secondary >= 3–6 months).", "Perform urine beta-hCG pregnancy test FIRST in every reproductive-age woman presenting with secondary amenorrhoea."],
  ["Amniocentesis", "Midwifery & OB", "Obstetrics", "Ultrasound-guided needle aspiration of amniotic fluid for genetic, lung-maturity, or infection testing.", "Monitor fetal heart rate, maternal vitals, and counsel Rh-negative mothers on Anti-D immunoglobulin prophylaxis."],
  ["Amniotomy (ARM)", "Midwifery & OB", "Obstetrics", "Artificial rupture of the chorioamniotic membranes using an AmniHook during active labour.", "Check fetal heart rate IMMEDIATELY before and after rupture to detect umbilical cord prolapse and note liquor colour (meconium staining)."],
  ["Amylase & Lipase", "Pathology & Lab", "Gastrointestinal", "Pancreatic digestive enzymes sharply elevated in blood during acute pancreatitis.", "Keep NBM initially in acute pancreatitis, infuse aggressive IV fluids, give opioid analgesia (avoiding hypotension), and monitor serum calcium."],
  ["Anasarca", "Assessment", "Cardiovascular / Renal", "Extreme generalized body-wide subcutaneous oedema seen in severe nephrotic syndrome, kwashiorkor, or liver failure.", "Handle oedematous fragile skin gently, reposition q2h, chart daily weights, and restrict sodium/fluids as ordered."],
  ["Aneurysm", "Medical-Surgical", "Cardiovascular", "Abnormal localized ballooning of a weakened arterial wall (e.g. abdominal aorta or cerebral berry aneurysm).", "Control hypertension gently and NEVER deeply palpate a pulsatile abdominal mass (risk of catastrophic rupture)."],
  ["Angina Pectoris", "Medical-Surgical", "Cardiovascular", "Crushing/tight substernal chest pain triggered by transient myocardial ischaemia without tissue necrosis.", "Rest patient upright, give sublingual Glyceryl Trinitrate (GTN) q5m x 3 max checking BP >= 90 mmHg first; escalate immediately if unrelieved (possible MI)."],
  ["Ankylosis", "Medical-Surgical", "Musculoskeletal", "Abnormal stiffening and fusion of a joint from chronic arthritis (RA/AS), trauma, or prolonged immobility.", "Maintain functional joint alignment and perform prescribed range-of-motion physiotherapy early."],
  ["Anorexia Nervosa vs Anorexia", "Mental Health", "Psychiatric / Systemic", "Anorexia is simple loss of appetite; anorexia nervosa is a psychiatric eating disorder with intense fear of weight gain and extreme restriction.", "Monitor electrolytes (refeeding hypophosphataemia/hypokalaemia), bradycardia, and orthostatic hypotension."],
  ["Antepartum Haemorrhage (APH)", "Midwifery & OB", "Obstetrics", "Genital tract bleeding occurring from >= 20–24 weeks gestation until delivery (placenta praevia or abruption).", "DO NOT perform digital vaginal examination; check vitals, insert 2 wide-bore IV lines, cross-match blood, and arrange urgent obstetric ultrasound."],
  ["Anticholinergic Toxidrome", "Pharmacology", "Neurology", "Drug toxicity syndrome (Atropine, Amitriptyline, Chlorpheniramine) causing 'hot as a hare, dry as a bone, blind as a bat, mad as a hatter'.", "Assess urinary retention (bladder scan), dilated pupils, hyperthermia, and cardiac rhythm telemetry."],
  ["Anticoagulant Therapy", "Pharmacology", "Haematology", "Agents preventing thrombus formation or extension (Heparin/Enoxaparin, Warfarin, Rivaroxaban).", "Monitor aPTT for unfractionated Heparin, INR (2.0–3.0 target) for Warfarin, avoid IM injections, and watch stool/urine/gums for bleeding."],
  ["Antipyretic", "Pharmacology", "Systemic", "Medicine that lowers elevated hypothalamic set-point temperature during fever (Paracetamol, Ibuprofen).", "Avoid Aspirin in children < 16 years due to Reye's syndrome encephalopathy risk; pair with tepid sponging only if shivering absent."],
  ["Antisepsis vs Disinfection vs Sterilization", "Infectious Diseases", "IPC / Microbiology", "Antisepsis reduces microbes on living tissue; disinfection destroys vegetative pathogens on surfaces; sterilization destroys ALL microorganisms including bacterial spores.", "Use autoclaving (121 C at 15 psi for 15–30 min) for surgical instruments penetrating sterile tissue."],
  ["Anuria", "Assessment", "Renal", "Near-complete cessation of urine output (< 50–100 mL over 24 hours).", "Perform immediate bladder scan or gentle catheter patency flush FIRST to exclude simple mechanical retention/kinked catheter before diagnosing renal failure."],
  ["Aortic Stenosis", "Medical-Surgical", "Cardiovascular", "Narrowing of aortic valve orifice obstructing left ventricular outflow (classic triad: syncope, angina, exertional dyspnoea).", "Warn against sudden vigorous exertion and avoid abrupt vasodilator drops in afterload."],
  ["Aphasia (Broca's vs Wernicke's)", "Assessment", "Neurology", "Expressive (Broca's: struggles to speak fluently, understands) vs Receptive (Wernicke's: fluent meaningless words, impaired comprehension) after stroke.", "Speak slowly face-to-face using yes/no cues or picture boards; never rush or speak loudly (hearing is intact)."],
  ["Apnoea", "Emergency Care", "Respiratory", "Temporary or sustained cessation of spontaneous breathing (> 20 sec in neonates with bradycardia).", "Stimulate gently in preterms or open airway + start positive-pressure Bag-Valve-Mask ventilation immediately."],
  ["Appendicitis", "Medical-Surgical", "Gastrointestinal", "Acute inflammation of vermiform appendix causing periumbilical pain migrating to McBurney's point (RLQ) with rebound tenderness.", "Keep NBM for surgery, NEVER apply warm heat pads or give laxatives/enemas (perforation risk); sudden pain relief may signal dangerous perforation."],
  ["Arterial Blood Gas (ABG)", "Pathology & Lab", "Respiratory", "Blood test from radial/femoral artery measuring pH (7.35–7.45), PaCO2 (35–45 mmHg), PaO2 (80–100 mmHg), and HCO3- (22–26 mEq/L).", "Perform Modified Allen Test before radial puncture and apply firm direct pressure for >= 5 minutes afterward."],
  ["Arthritis (Osteo vs Rheumatoid)", "Medical-Surgical", "Musculoskeletal", "OA is asymmetric wear-and-tear worse after use; RA is symmetric autoimmune synovitis with prolonged morning stiffness (> 60 min).", "Promote warm morning showers/joint protection for RA stiffness and low-impact mobility exercise."],
  ["Aseptic Non-Touch Technique (ANTT)", "Infectious Diseases", "Foundations", "Standard clinical framework protecting key sterile parts/sites during IV cannulation, catheterization, and dressing changes.", "Never touch catheter tips, needle hubs, or sterile gauze contact zones with unsterile gloves."],
  ["Asthma (Status Asthmaticus)", "Emergency Care", "Respiratory", "Severe refractory bronchospasm failing initial bronchodilators, risking silent chest and respiratory arrest.", "Notice that a QUIET / SILENT CHEST in an exhausted asthmatic is an extreme red-flag pre-arrest sign requiring immediate ICU escalation."],
  ["Atelectasis", "Medical-Surgical", "Respiratory", "Collapse of alveoli leading to reduced gas exchange, mild early post-op fever, and diminished breath sounds.", "Prevent post-op with early mobilization, deep breathing/coughing splinted with pillow, and pain control."],
  ["Atherosclerosis", "Pathology", "Cardiovascular", "Chronic progressive buildup of lipid plaques and fibrous tissue within arterial intima narrowing blood flow.", "Target modifiable risk factors: smoking cessation, hypertension control, diabetic control, statins, and exercise."],
  ["Atrial Fibrillation", "Medical-Surgical", "Cardiovascular", "Chaotic atrial depolarization creating an irregularly irregular pulse and left atrial stasis thrombus/stroke risk.", "Always count apical heart rate for 1 full minute and assess anticoagulation adherence (Warfarin/Rivaroxaban)."],
  ["Aura (Migraine / Seizure)", "Neurology", "Neurological", "Sensory warning symptom (flashing lights, epigastric rising, odd smell) preceding migraine or focal-onset seizure.", "Teach patients experiencing seizure auras to sit/lie down safely in an open area immediately."],
  ["Auscultation", "Assessment", "Foundations", "Physical exam technique listening via stethoscope to heart valves, lung fields, vascular bruits, and bowel sounds.", "Always auscultate the abdomen BEFORE percussion or palpation so handling doesn't falsely stimulate or mask bowel sounds."],
  ["Autoclave Sterilization", "Infectious Diseases", "IPC / Surgery", "Pressurized saturated steam chamber destroying vegetative bacteria, viruses, fungi, and heat-resistant endospores.", "Verify chemical indicator strips turned dark AND biological spore tests pass regularly."],
  ["Bacteraemia vs Septicaemia (Sepsis)", "Infectious Diseases", "Microbiology", "Bacteraemia is bacteria transiently in blood; Sepsis is life-threatening organ dysfunction from dysregulated host response to infection.", "Apply 'Sepsis Six' within 1 hour: O2, blood cultures, IV antibiotics, IV fluids, lactate, and strict urine output."],
  ["Baroreceptor Reflex", "Anatomy & Physiology", "Cardiovascular", "Stretch pressure sensors in carotid sinus & aortic arch that rapidly modulate heart rate and vascular tone.", "Explain postural orthostatic dizziness to elderly patients and advise sitting on bed edge before standing."],
  ["Benign Prostatic Hyperplasia (BPH)", "Medical-Surgical", "Urological", "Non-malignant enlargement of periurethral prostate causing weak stream, hesitancy, nocturia, and acute urinary retention.", "Insert Coude/Foley catheter carefully per protocol; never abruptly clamp/drain > 1,000 mL if haematuria/post-obstructive diuresis risk."],
  ["Beta-Blockers", "Pharmacology", "Cardiovascular", "Cardio-protective drugs (Atenolol, Propranolol, Carvedilol) slowing HR and contractility via beta-receptor blockade.", "Check apical HR >= 60 bpm & SBP before dose; avoid non-selective Propranolol in asthmatics (bronchospasm) and warn diabetics it masks hypoglycaemia tachycardia."],
  ["Bilirubin & Kernicterus", "Paediatrics & IMCI", "Neonatal / Hepatic", "Yellow haemoglobin breakdown pigment; unconjugated levels crossing newborn blood-brain barrier stain basal ganglia (kernicterus).", "Initiate intensive blue-light phototherapy early with opaque eye shields, frequent feeds, and hydration."],
  ["Bishop Score", "Midwifery & OB", "Obstetrics", "0–13 cervical readiness grading scale (dilation, effacement, station, consistency, position) before labour induction.", "Score <= 5 signals unfavourable cervix needing prostaglandin (Misoprostol) ripening before Oxytocin."],
  ["Blackwater Fever", "Infectious Diseases", "Malaria / Renal", "Severe malaria complication featuring massive intravascular haemolysis and dark Coca-Cola-coloured haemoglobinuria.", "Monitor urine output urgently, check renal function & Hb for packed RBC transfusion, and monitor on IV Artesunate."],
  ["Blood Transfusion Reaction", "Emergency Care", "Haematology", "Immune or infectious reaction (febrile, acute haemolytic ABO mismatch, urticarial, TRALI) during blood infusion.", "If acute fever, chills, flank pain, or hypotension occurs: STOP TRANSFUSION IMMEDIATELY, keep vein open with fresh 0.9% NaCl tubing, check patient/bag ID, notify blood bank."],
  ["Body Mass Index (BMI)", "Assessment", "Nutrition", "Weight in kg divided by height in metres squared (Normal 18.5–24.9 kg/m2; Obesity >= 30).", "In under-5s and pregnant mothers, use MUAC (< 11.5 cm SAM / < 23 cm maternal undernutrition) rather than adult BMI."],
  ["Bone Marrow Aspiration", "Pathology & Lab", "Haematology", "Sterile extraction of marrow from posterior iliac crest (or sternum) diagnosing leukaemia, aplastic anaemia, or visceral leishmaniasis.", "Apply firm sterile pressure dressing 10–15 min post-procedure and watch closely for haematoma or infection."],
  ["Bowel Obstruction", "Medical-Surgical", "Gastrointestinal", "Mechanical or paralytic blockage of intestinal transit causing colicky pain, bilious/faeculent vomiting, and obstipation.", "Place patient NBM, insert NGT for low intermittent suction, infuse IV fluids + K+ replacement, and prep for surgery if strangulation suspected."],
  ["Bronchiolitis (RSV)", "Paediatrics & IMCI", "Respiratory", "Acute viral lower airway inflammation in infants < 2 years causing wheezing, nasal flaring, subcostal indrawing, and poor feeding.", "Provide gentle nasal suction before feeds, humidified O2 if SpO2 < 90–92%, and small frequent NGT/IV fluids; routine antibiotics/steroids rarely help viral bronchiolitis."],
  ["Brudzinski's & Kernig's Signs", "Assessment", "Neurology", "Classic meningeal irritation reflexes where passive neck flexion flexes hips/knees (Brudzinski) or knee extension causes hamstring pain (Kernig).", "Recognize neck stiffness + photophobia + fever as acute Meningitis urgency requiring lumbar puncture & IV Ceftriaxone cleanly."],
  ["Burns (Rule of Nines & Parkland)", "Emergency Care", "Surgery / Trauma", "Estimates TBSA burned (Head 9%, Arms 9% each, Anterior/Posterior trunk 18% each, Legs 18% each, Perineum 1%).", "Parkland formula for 24h Ringer's Lactate = 4 mL × kg × %TBSA — give HALF in first 8 hours from time of burn, maintaining adult urine output 30–50 mL/hr."],
  ["Candida Albicans (Thrush)", "Infectious Diseases", "Microbiology", "Opportunistic yeast causing white removable curdy plaques on oral mucosa or thick curdy vaginal discharge.", "Always suspect underlying HIV immunosuppression, uncontrolled diabetes, or recent steroid inhaler use without mouth rinsing."],
  ["Capillary Refill Time (CRT)", "Assessment", "Cardiovascular", "Seconds required for blanched nailbed or sternum capillary bed to regain pink colour (Normal <= 2 seconds).", "CRT >= 3 seconds indicates hypovolaemic/septic peripheral hypoperfusion or hypothermia."],
  ["Cardiopulmonary Resuscitation (CPR)", "Emergency Care", "Resuscitation", "Immediate chest compressions (30:2 adult at 100–120/min, depth 5–6 cm) and rescue breaths preserving brain/coronary perfusion during arrest.", "Minimize compression interruptions (< 10 seconds) and attach AED/defibrillator pads immediately upon availability."],
  ["Cataract", "Ophthalmology & ENT", "Sensory", "Progressive painless clouding/opacification of the crystalline lens causing blurred glare and milky pupil.", "Post-op teach patient: avoid bending below waist, heavy lifting, straining, or rubbing the shielded operated eye."],
  ["Catheter-Associated UTI (CAUTI)", "Infectious Diseases", "IPC / Renal", "Preventable hospital infection introduced via prolonged or non-sterile indwelling urethral catheterization.", "Keep drainage bag strictly BELOW bladder level, maintain closed sterile drainage, perform daily perineal hygiene, and remove catheter as early as clinically safe."],
  ["Cellulitis", "Medical-Surgical", "Integumentary", "Diffuse acute bacterial (Streptococcal/Staph) infection of dermis and subcutaneous tissue with hot, swollen, spreading erythema.", "Outline skin erythema border cleanly with a skin marker pen and timestamp so spreading improvement/worsening is unmistakable."],
  ["Cerebrovascular Accident (Stroke)", "Medical-Surgical", "Neurology", "Acute focal neurological deficit from cerebral artery ischaemia (85%) or intracerebral haemorrhage (15%).", "Verify exact 'last known well' time, check RBG immediately (rule out hypoglycaemia stroke mimic), keep NBM until bedside Swallow Screen passes."],
  ["Cholecystitis & Murphy's Sign", "Medical-Surgical", "Gastrointestinal", "Gallbladder inflammation causing RUQ pain radiating to right shoulder blade after fatty meals and inspiratory arrest during RUQ palpation.", "Keep NBM during acute attack, hydrate IV, manage biliary spasm pain, and educate low-fat diet post-cholecystectomy."],
  ["Chronic Kidney Disease (CKD)", "Medical-Surgical", "Renal", "Progressive irreversible nephron loss (>= 3 months GFR < 60) causing uraemia, normocytic anaemia, hypertension, and renal bone disease.", "Protect fistula arms from venipuncture/BP cuffs ('Limb Alert') and review all renally excreted drug dosages."],
  ["Chronic Obstructive Pulmonary Disease", "Medical-Surgical", "Respiratory", "Irreversible progressive airflow limitation (emphysema + chronic bronchitis) driven by tobacco or indoor biomass smoke exposure.", "Target controlled SpO2 88–92% (Venturi 24–28% mask) to avoid abolishing hypoxic respiratory drive & worsening CO2 narcosis."],
  ["Cirrhosis & Hepatic Encephalopathy", "Medical-Surgical", "Gastrointestinal", "End-stage nodular liver scarring impairing ammonia clearance, causing asterixis flapping tremor, confusion, ascites, and oesophageal varices.", "Give Lactulose titrated to 2–3 soft stools/day to trap ammonia in the gut; monitor bleeding and avoid sedatives."],
  ["Cleft Lip & Palate", "Paediatrics & IMCI", "Congenital / Surgery", "Congenital failure of facial lip/palatal fusion causing feeding difficulty, nasal regurgitation, and chronic otitis media risk.", "Feed upright using specialized compressible/Haberman bottles, burp frequently, and after lip repair protect suture line using elbow restraints/Logan bow."],
  ["Coagulation Profile (PT / INR / aPTT)", "Pathology & Lab", "Haematology", "Lab clotting cascade assays: PT/INR measures extrinsic pathway (Warfarin monitoring); aPTT measures intrinsic pathway (Heparin).", "Report critical INR > 4.0–5.0 immediately and hold anticoagulants while assessing occult GI bleeding."],
  ["Cold Chain (UNEPI Vaccines)", "Paediatrics & IMCI", "Community / IPC", "Uninterrupted +2 C to +8 C temperature-controlled storage and transport preserving live/killed vaccine potency from factory to child.", "Check Vaccine Vial Monitor (VVM) colour square before drawing ANY vaccine and NEVER freeze Pentavalent, HepB, TT, or PCV vials (perform Shake Test if freeze-damage suspected)."],
  ["Colostomy & Stoma Care", "Medical-Surgical", "Gastrointestinal", "Surgically created abdominal opening diverting stool output into an adhesive pouch.", "Healthy viable stoma MUST appear beefy-red/pink and moist; dark purple, black, or pale cold stoma signals urgent ischaemia."],
  ["Compartment Syndrome", "Emergency Care", "Orthopaedics", "Dangerous pressure build-up inside a tight fascial muscle compartment cutting off arterial capillary blood supply.", "Earliest cardinal warning is severe pain out of proportion on passive stretch; release tight casts/bandages immediately and prepare urgent fasciotomy."],
  ["Congenital Heart Disease (Tetralogy / VSD)", "Paediatrics & IMCI", "Cardiovascular", "Structural fetal heart defects causing left-to-right overload or cyanotic right-to-left shunting ('Tet spells').", "During an infant hypercyanotic Tet spell: IMMEDIATELY place knees-to-chest (squatting position), give high-flow O2, calm the baby, and summon emergency physician."],
  ["Conjunctivitis (Bacterial / Viral / Neonatorum)", "Ophthalmology & ENT", "Sensory", "Inflammation of ocular conjunctiva; ophthalmia neonatorum (< 28 days) from Gonorrhoea/Chlamydia risks rapid corneal blindness.", "Apply routine Tetracycline 1% eye ointment at birth; wipe discharge inner-to-outer canthus using separate sterile swabs for each eye."],
  ["Contraception & Family Planning", "Midwifery & OB", "Reproductive", "Hormonal (pills, DMPA, implants), intrauterine (Cu-IUD), barrier, and surgical methods preventing unintended pregnancy.", "Verify UKMEC/WHO medical eligibility (e.g. avoid combined oestrogen pills in breastfeeding < 6 weeks, migraine with aura, or uncontrolled hypertension)."],
  ["Cord Prolapse", "Midwifery & OB", "Obstetrics", "Obstetric emergency where umbilical cord descends below presenting fetal part after membrane rupture causing lethal cord compression.", "Keep gloved fingers in vagina continuously pushing presenting part UP off the cord, place mother in knee-chest/exaggerated Sims position, do NOT handle/push cord back, rush to Caesarean theatre."],
  ["Coronary Artery Disease & MI", "Medical-Surgical", "Cardiovascular", "Plaque rupture + coronary thrombus causing irreversible myocardial muscle necrosis with crushing chest pain, diaphoresis, and ST elevation.", "Give MONA-style acute stabilization cleanly (Oxygen ONLY if hypoxic < 90–94%, chewed Aspirin 300 mg, GTN if BP allows, Morphine IV cautiously, urgent reperfusion/ECG)."],
  ["Cranial Nerves (I–XII)", "Anatomy & Physiology", "Neurology", "Twelve paired brain-stem/forebrain nerves controlling smell, vision, eye movements, facial sensation/expression, hearing, swallowing, and tongue movement.", "Assess gag reflex (CN IX & X) rigorously BEFORE offering water post-stroke to prevent silent aspiration."],
  ["Cryptococcal Meningitis", "Infectious Diseases", "Neurology / HIV", "Opportunistic encapsulated fungal meningitis in advanced HIV (CD4 < 100) causing severe headache, raised ICP, and cranial palsies.", "Verify CrAg test, monitor therapeutic lumbar puncture CSF opening pressure relief cleanly, and monitor Amphotericin B potassium/magnesium levels carefully."],
  ["Cushing's Syndrome vs Cushing's Triad", "Neurology / Endocrine", "Assessment", "Syndrome = chronic cortisol excess (moon face, buffalo hump, striae, hyperglycaemia). Triad = brainstem herniation red alert (widening pulse pressure/HTN, bradycardia, irregular respirations).", "Elevate head of bed 30° neutral neck alignment and summon neurosurgical help immediately for Cushing's Triad."],
  ["Deep Vein Thrombosis (DVT)", "Medical-Surgical", "Cardiovascular", "Blood clot inside deep leg veins (calf/femoral) causing unilateral warm swollen painful limb and life-threatening Pulmonary Embolism risk.", "NEVER massage a suspected DVT calf; maintain bed rest temporarily, start prescribed heparin/anticoagulant, and watch for sudden pleuritic chest pain or dyspnoea (PE)."],
  ["Dehydration (Mild / Some / Severe)", "Paediatrics & IMCI", "Renal / Fluids", "Deficit of body water and electrolytes graded by mental state, sunken eyes, thirst, and skin pinch recoil.", "Follow WHO IMCI Plan A (home fluids + ORS + Zinc), Plan B (75 mL/kg ORS over 4h), and Plan C (100 mL/kg IV Ringer's Lactate)."],
  ["Delirium vs Dementia", "Mental Health", "Neurology / Psychiatry", "Delirium is ACUTE, fluctuating, reversible brain confusion (infection, hypoxia, drugs); Dementia is CHRONIC progressive memory/cognitive decline.", "Always rule out hypoxia, UTI, hypoglycaemia, or sepsis first when an elderly patient develops sudden overnight confusion."],
  ["Diabetes Mellitus (Type 1 vs Type 2)", "Medical-Surgical", "Endocrine", "Type 1: autoimmune beta-cell destruction requiring lifelong insulin. Type 2: insulin resistance + progressive beta-cell fatigue.", "Check foot ulcers daily, teach sick-day insulin rules (never omit basal insulin even when vomiting — check RBG & ketones), and carry quick sugar."],
  ["Dialysis (Haemodialysis vs Peritoneal)", "Medical-Surgical", "Renal", "Artificial blood filtration removing uraemic toxins and excess fluid/potassium when kidneys fail.", "Inspect AV fistula thrill/bruit daily, forbid BP cuffs/IVs on fistula arm, and weigh patient before & after each session."],
  ["Diarrhoea & Dysentery", "Infectious Diseases", "Gastrointestinal", "Watery loose stools >= 3/day; Dysentery features visible blood/mucus indicating invasive Shigella or Entamoeba histolytica.", "Always prescribe Zinc (20 mg daily x 10–14d; 10 mg if < 6 months) alongside low-osmolarity ORS; treat dysentery with Ciprofloxacin per UCG."],
  ["Digoxin Toxicity", "Pharmacology", "Cardiovascular", "Narrow-therapeutic-index toxicity precipitated by hypokalaemia or CKD causing nausea, yellow-green visual halos, and arrhythmias.", "Check full 1-minute apical pulse BEFORE every dose — HOLD if adult HR < 60 bpm (child < 80–90 bpm) and check serum K+."],
  ["Disseminated Intravascular Coagulation", "Pathology & Lab", "Haematology", "Paradoxical clotting microthrombi consuming all platelets & clotting factors -> catastrophic multisite oozing haemorrhage (PPH, sepsis, abruption).", "Treat underlying obstetric/septic cause urgently while transfusing fresh frozen plasma, cryoprecipitate, and platelets."],
  ["Diuretics (Loop vs Thiazide vs K-Sparing)", "Pharmacology", "Renal / Cardio", "Loop (Furosemide) works powerfully on Loop of Henle & wastes K+; Thiazide on DCT; Spironolactone conserves K+.", "Give morning/early afternoon to prevent nocturia; monitor daily weight, BP, and serum Potassium."],
  ["Dysphagia", "Assessment", "Neurology / GI", "Difficulty swallowing solids or liquids increasing aspiration pneumonia and malnutrition risk.", "Perform formal water swallow screen post-stroke before feeding; keep patient sitting upright 90° during and 30 min after meals."],
  ["Dyspnoea", "Assessment", "Respiratory", "Subjective sensation of uncomfortable or laboured breathing (orthopnoea when lying flat; PND waking patient at night).", "Sit patient upright leaning over cardiac table, check SpO2 and RR immediately, and loosen tight chest clothing."],
  ["Eclampsia", "Midwifery & OB", "Obstetrics", "New-onset generalized tonic-clonic seizures or unexplained coma in a pregnant/postpartum woman with hypertensive disorder.", "Left lateral airway safety -> Magnesium Sulfate Pritchard loading (4g IV + 10g IM) -> gentle BP control -> definitive delivery."],
  ["Ectopic Pregnancy", "Midwifery & OB", "Obstetrics", "Blastocyst implantation outside the uterine cavity (95% Fallopian tube), causing unilateral pelvic pain, amenorrhoea, and hypovolaemic shock upon rupture.", "Any reproductive-age woman with lower abdominal pain + positive hCG + syncope/shoulder-tip pain is ruptured ectopic until proven otherwise — urgent surgical laparotomy prep."],
  ["Electrocardiogram (ECG / EKG)", "Assessment", "Cardiovascular", "12-lead surface tracing recording P-wave (atrial depolarization), QRS complex (ventricles), and T-wave (ventricular repolarization).", "Remember: Peaked tall T waves = Hyperkalaemia emergency; ST elevation = acute STEMI infarction."],
  ["Embolism (Pulmonary / Air / Fat)", "Emergency Care", "Cardiovascular / Resp", "Sudden blockage of pulmonary arterial branch by blood clot (PE), IV line air bubble, or long-bone fracture fat globules causing acute hypoxia & pleuritic chest pain.", "Elevate head high, start high-flow O2 immediately, obtain ABG/CTPA/anticoagulation; for suspected IV air embolism place left-lateral Trendelenburg (Durant's manoeuvre)."],
  ["Empyema Thoracis", "Medical-Surgical", "Respiratory", "Collection of frank pus inside the pleural cavity requiring diagnostic thoracentesis, IV antibiotics, and closed water-seal chest tube drainage.", "Ensure chest drainage bottle ALWAYS stays upright BELOW chest level; observe fluid tidaling and stop-check if continuous vigorous bubbling indicates air leak."],
  ["Encephalitis vs Meningitis", "Infectious Diseases", "Neurology", "Meningitis inflames meninges (neck stiffness, Kernig+, normal initial alertness); Encephalitis directly inflames brain parenchyma (early coma, behavioural change, focal deficits).", "Check RBG immediately, start empiric IV antimicrobials/antivirals promptly, and institute seizure precautions."],
  ["Endocarditis (Infective)", "Infectious Diseases", "Cardiovascular", "Microbial colonization of heart valves creating friable vegetations, fever, new/changing murmur, splinter haemorrhages, and Osler's nodes.", "Draw three sets of blood cultures from different sites BEFORE starting prolonged IV bactericidal antibiotics."],
  ["Enteral Feeding (NGT / PEG)", "Assessment", "Nutrition / GI", "Direct liquid nutritional delivery into stomach/jejunum via nasogastric or gastrostomy tube.", "Confirm gastric tube placement via pH <= 5.5 aspirate + CXR before ANY feed/medication; keep head >= 30–45° to prevent aspiration."],
  ["Epiglottitis", "Paediatrics & IMCI", "Respiratory / ENT", "Acute life-threatening bacterial swelling of supraglottic epiglottis (Hib) presenting with toxic fever, dysphagia, drooling, and tripod posture.", "NEVER insert a tongue depressor into the throat (triggers fatal reflex laryngospasm); keep child calm with mother and summon emergency airway/ENT team."],
  ["Epilepsy & Status Epilepticus", "Emergency Care", "Neurology", "Recurrent unprovoked seizures; Status Epilepticus = single seizure > 5 min or repeated seizures without recovery between episodes.", "Protect head/turn left lateral (do NOT force anything between teeth), give O2 + RBG check, administer IV Diazepam 10 mg (or Lorazepam/rectal Diazepam) per protocol."],
  ["Epistaxis (Nosebleed)", "Ophthalmology & ENT", "Sensory / First Aid", "Acute bleeding from anterior Kiesselbach's plexus or posterior nasal vessels.", "Lean patient FORWARD (NOT backward — prevents swallowed blood aspiration) and pinch soft cartilaginous nose firmly continuously for 10–15 minutes."],
  ["Erythrocyte Sedimentation Rate (ESR)", "Pathology & Lab", "Haematology", "Non-specific inflammatory blood marker measuring red cell settling rate over 1 hour (markedly elevated in TB, temporal arteritis, osteomyelitis).", "Interpret alongside CRP, clinical exam, and specific microbiology tests."],
  ["Extrapyramidal Side Effects (EPSEs)", "Mental Health", "Pharmacology / Psych", "Movement disorders caused by dopamine D2 blockade (dystonia, akathisia, pseudoparkinsonism, tardive dyskinesia).", "Treat acute painful oculogyric crisis/laryngeal dystonia urgently with IM/IV Biperiden or Benztropine/Promethazine per guideline."],
  ["Femoral & Pelvic Fracture", "Emergency Care", "Orthopaedics", "High-energy trauma bone disruption capable of hiding 1,000–2,000+ mL internal retroperitoneal/thigh blood loss.", "Immobilize, establish two large-bore IV lines, cross-match blood, and do NOT 'spring' or rock an unstable pelvis."],
  ["Fistula (Obstetric VVF / RVF)", "Midwifery & OB", "Gynaecology", "Abnormal opening between bladder/rectum and vagina from prolonged obstructed labour ischaemia causing continuous urinary/faecal leakage.", "Prevent 100% through timely partograph monitoring & Caesarean relief of obstructed labour; provide compassionate post-repair catheter care."],
  ["Fontanelle Assessment", "Paediatrics & IMCI", "Neurology / Fluids", "Anterior diamond soft spot closes ~12–18 months; SUNKEN = dehydration; BULGING + tense (while calm) = raised ICP / meningitis.", "Always palpate anterior fontanelle when the infant is calm and held upright rather than crying."],
  ["Gastroschisis vs Omphalocele", "Paediatrics & IMCI", "Congenital / GI", "Gastroschisis = bare herniated bowel without sac to right of umbilicus; Omphalocele = midline defect covered by translucent amniotic sac.", "Cover exposed bowel IMMEDIATELY in sterile warm saline-moistened gauze wrapped loosely in sterile clear plastic wrap to halt evaporative heat/fluid loss, place NGT decompression."],
  ["Glaucoma (Open vs Angle-Closure)", "Ophthalmology & ENT", "Sensory", "Optic nerve cupping/vision loss from raised intraocular pressure; Acute Angle-Closure is an emergency with stony hard red eye, severe brow ache, dilated non-reactive pupil, and halos.", "Avoid anticholinergics/mydriatics (Atropine) in narrow-angle glaucoma; start Pilocarpine, Acetazolamide, and Mannitol urgently as prescribed."],
  ["Glomerulonephritis (Acute Post-Strep)", "Medical-Surgical", "Renal", "Immune-complex glomerular injury post Group A Strep throat/impetigo causing dark smoky haematuria, periorbital oedema, and hypertension.", "Monitor strict blood pressure, fluid/salt restriction, daily weights, and hypertensive encephalopathy signs."],
  ["Goitre & Thyroidectomy Care", "Medical-Surgical", "Endocrine", "Neck swelling of thyroid gland (iodine deficiency, Graves, multinodular); surgery carries hypocalcaemia & airway haematoma dangers.", "Keep sterile tracheostomy tray, suction, & suture-removal kit beside bed 24–48 hrs post-thyroidectomy and watch for voice hoarseness or stridor."],
  ["Gout", "Medical-Surgical", "Musculoskeletal", "Uric acid crystal deposition causing excruciating hot red swelling typically of the first metatarsophalangeal big toe joint.", "Treat acute flare with NSAID/Colchicine (never start Allopurinol abruptly mid-flare), push fluids, and restrict purine/alcohol intake."],
  ["Guillain-Barre Syndrome (GBS)", "Medical-Surgical", "Neurology", "Post-infectious ascending symmetrical motor weakness/areflexia risking rapid diaphragmatic respiratory failure.", "Monitor serial Forced Vital Capacity / peak cough and prepare mechanical ventilation proactively BEFORE cyanosis occurs."],
  ["Haematemesis & Melaena", "Emergency Care", "Gastrointestinal", "Haematemesis = vomiting bright red or 'coffee-ground' blood; Melaena = black tarry foul-smelling stool from upper GI bleeding (oesophageal varices/peptic ulcer).", "Two 16G IV lines, cross-match blood, high-dose IV PPI (Omeprazole) / Octreotide for varices, and prepare urgent endoscopy."],
  ["Haemophilia", "Pathology & Lab", "Haematology", "X-linked congenital clotting Factor VIII (Haemophilia A) or IX (Haemophilia B) deficiency causing painful haemarthrosis & deep bleeds.", "Avoid Aspirin, NSAIDs, and IM injections; replace deficient Factor VIII/IX concentrate promptly before even minor procedures."],
  ["Haemothorax & Pneumothorax", "Emergency Care", "Respiratory", "Collection of blood (haemothorax) or trapped air (pneumothorax) inside pleural space collapsing lung tissue.", "Tension pneumothorax (absent breath sounds + hypotension + distended neck veins + tracheal deviation AWAY) requires IMMEDIATE needle decompression at 2nd/5th ICS -> chest tube."],
  ["HELLP Syndrome", "Midwifery & OB", "Obstetrics", "Life-threatening severe pre-eclampsia variant: Haemolysis, Elevated Liver enzymes, Low Platelets.", "Handle gently (avoid forceful liver palpation due to subcapsular haematoma rupture risk) and expedite safe stabilization & delivery."],
  ["Hepatitis B & Post-Exposure Prophylaxis", "Infectious Diseases", "Microbiology / IPC", "Blood/body-fluid viral hepatitis prevented cleanly by 3-dose vaccine series & birth-dose infant prophylaxis.", "After occupational needlestick injury: wash gently with soap and running water immediately (don't squeeze), report to IPC focal person for HBsAg/HIV PEP assessment within 2 hrs."],
  ["Hernia (Reducible vs Strangulated)", "Medical-Surgical", "Gastrointestinal", "Protrusion of bowel/omentum through abdominal wall weakness; Strangulation cuts blood supply -> severe irreducible tender red lump + fever/vomiting.", "NEVER forcefully push back a tender, discoloured, strangulated hernia — emergency surgical exploration."],
  ["Herpes Zoster (Shingles)", "Infectious Diseases", "Integumentary / HIV", "Painful unilateral vesicular rash restricted strictly to a single dermatome caused by Varicella-Zoster reactivation.", "Consider underlying HIV/immunosuppression screening in young adults presenting with multi-dermatomal zoster; give early Acyclovir + neuropathic pain control."],
  ["HIV Opportunistic Infections & ART", "Infectious Diseases", "HIV / Pharmacology", "Initiating Tenofovir/Lamivudine/Dolutegravir (TLD) achieves viral suppression & CD4 recovery, preventing TB, Cryptococcus, and PCP.", "Give Cotrimoxazole (Septrin) daily prophylaxis per MoH guidelines and emphasize strict lifelong daily ART adherence."],
  ["Hydatidiform Mole (Molar Pregnancy)", "Midwifery & OB", "Gynaecology", "Abnormal trophoblastic grape-like vesicles filling uterus -> disproportionately large uterus, severe hyperemesis, high hCG, 'snowstorm' ultrasound.", "Follow serial quantitative beta-hCG levels for 6–12 months post-evacuation and prevent pregnancy during surveillance to detect choriocarcinoma."],
  ["Hydrocephalus", "Paediatrics & IMCI", "Neurology", "Excess CSF buildup inside brain ventricles enlarging infant head circumference, causing tense fontanelle and 'sunset eyes'.", "Measure daily occipitofrontal head circumference (OFC) at widest occipital-frontal plane and monitor VP shunt infection/blockage signs."],
  ["Hyperkalaemia (K+ > 5.5 mmol/L)", "Emergency Care", "Renal / Cardio", "Dangerous potassium elevation destabilizing cardiac membranes -> peaked T waves, widened QRS, and sudden ventricular fibrillation.", "Emergency 3-step protection: IV Calcium Gluconate 10% (protects myocardium immediately), IV Insulin + 50% Dextrose + nebulized Salbutamol (shifts K+ into cells), Kayexalate/dialysis (removes K+)."],
  ["Hypernatraemia / Hyponatraemia", "Pathology & Lab", "Renal / Fluids", "Imbalances of serum Na+ (Normal 135–145 mmol/L) causing cellular shrinkage or cerebral oedema confusion/seizures.", "Correct chronic hyponatraemia slowly (<= 8–10 mmol/L per 24h) to avoid lethal central pontine myelinolysis."],
  ["Hypocalcaemia (Tetany)", "Pathology & Lab", "Endocrine / Electrolyte", "Serum calcium deficit causing perioral numbness, Chvostek facial twitch, Trousseau carpal spasm, and stridor after thyroid/parathyroid injury.", "Administer slow diluted IV Calcium Gluconate via secure large vein under cardiac monitoring."],
  ["Hypokalaemia (K+ < 3.5 mmol/L)", "Pathology & Lab", "Renal / Pharmacology", "Low serum potassium from Furosemide, vomiting, diarrhoea, or insulin causing muscle weakness, ileus, flat T waves + U waves.", "NEVER give Potassium Chloride IV push (fatal cardiac arrest); always dilute safely inside infusion bag <= 10–20 mEq/hr with cardiac monitor."],
  ["Hypothermia (Neonatal)", "Paediatrics & IMCI", "Neonatal Care", "Newborn axillary temperature < 36.5 C draining glucose/oxygen stores rapidly -> acidosis, hypoglycaemia, and apnoea.", "Apply immediate Kangaroo Mother Care (skin-to-skin), pre-warmed cap/linen, and defer first bath >= 24 hours post-delivery."],
  ["Icterus (Jaundice)", "Assessment", "Hepatic / Neonatal", "Yellow bilirubin staining visible best in daylight on sclerae and newborn palms/soles.", "Any neonatal jaundice appearing WITHIN FIRST 24 HOURS OF LIFE is pathological (haemolytic/sepsis) until proven otherwise."],
  ["Immunization Schedule (UNEPI Uganda)", "Paediatrics & IMCI", "Community Health", "National free infant vaccine schedule: Birth (BCG + OPV0 + HepB), 6/10/14 wks (DPT-HepB-Hib + PCV + OPV + Rota; IPV at 14 wks), 9m (Measles-Rubella + Yellow Fever), 18m (MR2).", "Document accurately on Child Health Card and educate caregivers on expected mild post-vaccine fever vs emergency reactions."],
  ["Incentive Spirometry", "Assessment", "Respiratory", "Sustained slow deep-inhalation lung expansion training preventing post-surgical atelectasis & pneumonia.", "Coach patient to INHALE slowly and deeply (holding 3–5 seconds), NOT blow outward."],
  ["Infiltration vs Extravasation (IV)", "Pharmacology", "Foundations", "Infiltration is accidental leakage of non-vesicant IV fluid into tissue; Extravasation leaks vesicant/necrotizing drugs (e.g. Calcium, Dopamine, Vincristine, 50% Dextrose) causing tissue sloughing.", "Stop IV immediately at first swelling/pain/coolness; for extravasation, leave cannula briefly ONLY to aspirate/antidote per drug protocol before removing & elevating."],
  ["Insulin Storage & Rotation", "Pharmacology", "Endocrine", "Rapid/Short (Clear Soluble) and Intermediate (Cloudy NPH/Mixtard) insulins controlling diabetes.", "Unopened vials fridge +2 to +8 C (NEVER freeze); in-use vial/pen keeps cleanly cool room temp ~28 days; rotate abdomen/thigh sites >= 2 cm apart to prevent lipohypertrophy."],
  ["Intussusception", "Paediatrics & IMCI", "Gastrointestinal", "Telescoping of one bowel segment inside another in infants 5–12 months -> episodic drawing knees up screaming, vomiting, sausage-shaped mass, & 'red currant jelly' stool.", "Keep NBM, insert NGT + IV hydration, and escalate immediately to paediatric surgery (air/saline reduction or theatre)."],
  ["Jaundice (Pre-Hepatic / Hepatic / Obstructive)", "Pathology & Lab", "Gastrointestinal", "Pre-hepatic (haemolysis/malaria/sickle cell), Hepatocellular (viral hepatitis/alcohol), Post-hepatic obstructive (gallstones/pancreatic head tumour -> pale stools & dark tea urine).", "Investigate dark urine + pale clay-coloured stools + pruritus for biliary tract obstruction."],
  ["Kangaroo Mother Care (KMC)", "Paediatrics & IMCI", "Neonatal Care", "Continuous skin-to-skin chest contact between low-birthweight (< 2.5 kg) baby and mother, providing warmth, exclusive breastfeeding support, and apnoea reduction.", "Secure baby upright frog-legged with airway open/head turned and check temp/breathing regularly."],
  ["Kaposi Sarcoma", "Infectious Diseases", "HIV / Oncology", "HHV-8 associated vascular skin/mucosal purplish-brown nodules or plaques frequently marking advanced untreated HIV.", "Initiate/optimize lifelong ART cleanly alongside oncology/chemotherapy referral where disseminated."],
  ["Ketoacidosis vs Hyperosmolar Hyperglycaemia", "Emergency Care", "Endocrine", "DKA (Type 1, young, Kussmaul acidosis + ketones); HHS (Type 2 elderly, extreme glucose > 33 mmol/L & dehydration with minimal ketones).", "Hydration + Potassium vigilance + controlled Insulin infusion apply to both."],
  ["Koilonychia", "Assessment", "Haematology", "Spoon-shaped concave brittle fingernails classic for chronic severe iron-deficiency anaemia.", "Check stool ova/parasites (hookworm), diet/menses history, haemoglobin, and supplement oral ferrous sulphate + Vitamin C."],
  ["Kwashiorkor vs Marasmus", "Paediatrics & IMCI", "Nutrition", "Oedematous SAM (Kwashiorkor: bilateral pitting oedema, flaky paint skin, hepatomegaly, miserable) vs Wasted SAM (Marasmus: extreme muscle wasting, ribs visible, old-man face, alert).", "Avoid routine IV fluids in SAM dehydration unless frank shock exists (risk of heart failure); give F-75 first, F-100/RUTF later."],
  ["Lactation & Breast Engorgement", "Midwifery & OB", "Postnatal Care", "Painful warm bilateral breast fullness days 3–5 postpartum due to milk stasis and vascular congestion.", "Treat by frequent proper deep-latch feeding (every 2–3 hrs), gentle warm compress just before feed, and hand expression to soften areola (avoid binding)."],
  ["Laryngospasm", "Emergency Care", "Respiratory / ENT", "Sudden involuntary closure of true vocal cords blocking airflow (stridor -> silent obstruction post-extubation/epiglottitis/hypocalcaemia).", "Jaw thrust, positive-pressure 100% O2 via bag-mask, suction secretions cleanly, and summon emergency airway/anaesthesia."],
  ["Leishmaniasis (Visceral Kala-azar)", "Infectious Diseases", "Tropical Medicine", "Sandfly-transmitted protozoan causing prolonged fever, massive splenomegaly, weight loss, and pancytopenia in endemic East African pockets.", "Confirm rk39/splenic aspirate safely and treat with Sodium Stibogluconate + Paromomycin or Liposomal Amphotericin B monitoring ECG/renal function."],
  ["Leucocytosis vs Leucopenia", "Pathology & Lab", "Haematology", "Raised WBC (> 11,000/uL = bacterial infection/stress) vs Low WBC (< 4,000/uL = viral, typhoid, HIV, bone marrow suppression).", "In typhoid fever/malaria, a normal or low WBC count is common — do not wait for leucocytosis to suspect infection."],
  ["Lochia (Rubra, Serosa, Alba)", "Midwifery & OB", "Postnatal Care", "Normal postpartum uterine discharge transitioning Rubra (red Days 1–4) -> Serosa (pink/brown Days 5–10) -> Alba (yellowish-white Weeks 2–6).", "Sudden return of heavy bright red bleeding with clots or foul offensive smell + fever signals secondary PPH / puerperal endometritis."],
  ["Lumbar Puncture (Spinal Tap)", "Assessment", "Neurology", "Sterile insertion at L3–L4 / L4–L5 spinal subarachnoid space collecting CSF for meningitis microscopy/protein/glucose/CrAg.", "Position patient curled tightly in fetal side-lying (or upright), keep lying flat afterward 2–4 hrs, and hydrate to prevent post-LP headache; avoid if raised ICP herniation signs exist."],
  ["Magnesium Sulfate (MgSO4)", "Pharmacology", "Midwifery & OB", "Drug of choice preventing/halting eclamptic seizures (4g IV + 10g IM Pritchard loading, then 5g IM q4h x 24h).", "BEFORE EVERY DOSE check: 1) Resp Rate >= 16/min, 2) Patellar knee reflex PRESENT, 3) Urine Output >= 30 mL/hr. Antidote = Calcium Gluconate 10% 1g IV."],
  ["Malaria (Uncomplicated vs Severe)", "Infectious Diseases", "Tropical Medicine", "Plasmodium infection; Severe signs include impaired consciousness, convulsions, severe anaemia (Hb < 5), hypoglycaemia, jaundice, AKI, or pulmonary oedema.", "Always test with mRDT/blood smear FIRST; treat uncomplicated with Artemether-Lumefantrine 3d, severe with IV/IM Artesunate >= 24 hrs then full oral ACT."],
  ["Mastitis vs Breast Abscess", "Midwifery & OB", "Postnatal Care", "Unilateral wedge-shaped red hot painful breast area + fever (milk stasis + S. aureus); fluctuant pocket = abscess requiring incision & drainage.", "DO NOT stop breastfeeding on affected side unless draining pus directly into nipple — empty breast well + Flucloxacillin/Cloxacillin."],
  ["Measles", "Infectious Diseases", "Paediatrics", "Highly contagious viral paramyxovirus causing high fever, 3 Cs (Cough, Coryza, Conjunctivitis), Koplik spots, and blotchy cephalocaudal maculopapular rash.", "Airborne isolation + Give mandatory TWO doses of high-dose Vitamin A (100k–200k IU) on Day 1 & Day 2 to prevent corneal blindness & reduce mortality 50%."],
  ["Meconium Aspiration Syndrome", "Midwifery & OB", "Neonatal Care", "Respiring meconium-stained amniotic fluid at birth causing chemical pneumonitis, patchy atelectasis, and neonatal respiratory distress.", "If newborn is vigorous and crying at birth even with meconium liquor, do routine gentle wipe — start bag-mask ventilation immediately if limp/non-breathing."],
  ["Melena vs Haematochezia", "Assessment", "Gastrointestinal", "Melena = black tarry stool (upper GI bleed digested by stomach acid); Haematochezia = fresh bright red blood per rectum (lower GI/haemorrhoids/fissure/colorectal).", "Check orthostatic vital signs, Hb, and bleeding history (NSAIDs/varices/alcohol)."],
  ["Metformin & Lactic Acidosis Risk", "Pharmacology", "Endocrine", "First-line oral biguanide for Type 2 Diabetes improving peripheral insulin sensitivity without causing weight gain or isolated hypoglycaemia.", "Give WITH meals to cut GI diarrhoea/nausea and hold 48 hrs around IV iodinated CT contrast or severe AKI/sepsis (lactic acidosis safety)."],
  ["Mid-Upper Arm Circumference (MUAC)", "Assessment", "Nutrition", "Tape measurement at midpoint between acromion and olecranon in children 6–59 months: < 11.5 cm RED (SAM), 11.5–12.4 cm YELLOW (MAM), >= 12.5 cm GREEN.", "Always hang left arm relaxed at child's side with zero tension pinching tape."],
  ["Mitral Stenosis & Murmurs", "Medical-Surgical", "Cardiovascular", "Narrowed left atrial-ventricular valve commonly post-Rheumatic Fever causing LA dilation, atrial fibrillation, and pulmonary congestion.", "Screen sore throats in children early and give Benzathine Penicillin G prophylaxis cleanly to prevent Rheumatic Heart Disease."],
  ["Modified Early Warning Score (MEWS)", "Emergency Care", "Assessment", "Bedside composite trigger score summing RR, HR, SBP, Temp, SpO2, and AVPU neurological status to spot deteriorating ward patients hours before cardiac arrest.", "Score >= 5 demands immediate bedside clinician escalation and intensified monitoring."],
  ["Morphine Sulfate", "Pharmacology", "Analgesia / Cardio", "Potent opioid agonist relieving severe post-op/MI/palliative pain and acute pulmonary oedema preload.", "COUNT Respiratory Rate & sedation BEFORE every dose; hold & consider Naloxone if RR < 12 breaths/min or pinpoint unarousable pupils."],
  ["Mucopurulent vs Serous Exudate", "Assessment", "Surgical / IPC", "Serous = clear straw healing fluid; Sanguineous = bloody fresh; Purulent = thick yellow-green foul pus indicating bacterial wound infection.", "Collect deep wound swab AFTER cleansing surface debris with sterile saline before topical/systemic antibiotics."],
  ["Myasthenia Gravis", "Medical-Surgical", "Neurology", "Autoimmune destruction of postsynaptic acetylcholine receptors causing fatigable ptosis, diplopia, bulbar dysphagia, and progressive weakness worse in evening.", "Time Pyridostigmine strictly 30–60 min BEFORE meals; watch Cholinergic vs Myasthenic respiratory crisis carefully."],
  ["Mycobacterium Tuberculosis (Acid-Fast)", "Infectious Diseases", "Microbiology", "Slow-growing acid-fast aerobic bacillus (Ziehl-Neelsen red rods) resisting standard Gram staining.", "Place smear-positive pulmonary TB patients in airborne ventilation isolation until >= 2 weeks effective chemotherapy."],
  ["Myxoedema Coma", "Emergency Care", "Endocrine", "Decompensated extreme hypothyroidism causing hypothermia, bradycardia, hypoventilation, hyponatraemia, and altered consciousness.", "Give IV Levothyroxine + IV Hydrocortisone (cover possible adrenal insufficiency), rewarm slowly passively, and support airway/breathing."],
  ["Naloxone (Narcan)", "Pharmacology", "Emergency Care", "Pure competitive opioid receptor antagonist reversing respiratory depression from Morphine, Pethidine, or Tramadol overdose.", "Remember Naloxone half-life (~30–60 min) is SHORTER than long-acting opioids — monitor patient closely for recurrent apnoea needing repeat doses."],
  ["Nephrotic Syndrome", "Medical-Surgical", "Renal / Paeds", "Glomerular podocyte injury causing massive proteinuria (> 3.5g/24h), hypoalbuminaemia, severe generalized oedema (periorbital/ascites), and hyperlipidaemia.", "Track strict daily weights, morning urine dipstick protein, infection prevention, and Prednisolone steroid adherence cleanly."],
  ["Neural Tube Defects (Spina Bifida)", "Midwifery & OB", "Congenital / Paeds", "Incomplete neural tube closure in first 28 days of pregnancy preventable in ~70% of cases by periconceptional Folic Acid 400 mcg–5 mg daily.", "Before surgery cover exposed sac gently with sterile warm moist dressing, nurse infant PRONE (on belly) without pressure on sac, and maintain latex-free precautions."],
  ["Neutropenic Sepsis", "Emergency Care", "Oncology / IPC", "Fever >= 38.0 C in patient with Absolute Neutrophil Count < 500–1,000 cells/uL — rapid life-threatening medical emergency.", "Never wait for blood culture results — infuse broad-spectrum empiric IV anti-pseudomonal antibiotics within 30–60 minutes."],
  ["Nocturia", "Assessment", "Renal / Cardio", "Waking once or more nightly to pass urine — early sign of BPH, UTI, uncontrolled Diabetes Mellitus, CKD, or heart failure fluid mobilization.", "Teach diuretic timing (give morning, not bedtime) and check fasting glucose + prostate/bladder evaluation."],
  ["Nystagmus", "Assessment", "Neurology", "Involuntary rhythmic oscillating eye movements signaling cerebellar lesion, vestibular vertigo, or phenytoin toxicity.", "Assess cranial nerves III/IV/VI, gait ataxia, and check anti-epileptic drug serum levels if on Phenytoin."],
  ["Obstructed Labour & Bandl's Ring", "Midwifery & OB", "Obstetrics", "Mechanical arrest of descent despite strong uterine contractions causing crossed Partograph Action Line, moulding +++, caput, haematuria, and rising Bandl's retraction ring.", "EMERGENCY DANGER SIGN of imminent uterine rupture — STOP Oxytocin immediately, insert catheter, prep 2 IV lines, and perform urgent Caesarean section."],
  ["Oligohydramnios vs Polyhydramnios", "Midwifery & OB", "Obstetrics", "Oligohydramnios = too little amniotic fluid (renal agenesis/IUGR/PROM, variable cord decelerations); Polyhydramnios = excess fluid (maternal diabetes/oesophageal atresia/twins, PPH risk).", "Expect preterm PROM or uterine overdistension postpartum haemorrhage and check fetal anomalies closely."],
  ["Oliguria", "Assessment", "Renal", "Adult urine output < 400 mL/24 hrs or < 30 mL/hr (< 0.5 mL/kg/hr; child < 1 mL/kg/hr).", "Act immediately: palpate/scan bladder for retention, inspect Foley tubing for kinks, assess hydration/BP/perfusion, and hold nephrotoxic medications."],
  ["Ophthalmia Neonatorum", "Ophthalmology & ENT", "Neonatal / STI", "Purulent conjunctivitis within first 28 days of life caused by Neisseria gonorrhoeae (profuse bilateral pus Day 2–5) or Chlamydia trachomatis.", "Give mandatory newborn Tetracycline 1% prophylaxis at birth; treat active gonococcal infection aggressively with single-dose IM Ceftriaxone + saline eye washes to preserve sight."],
  ["Oral Rehydration Salts (ORS)", "Pharmacology", "Paediatrics / GI", "Low-osmolarity WHO glucose-sodium electrolyte packet activating co-transport absorption in intact small intestine regardless of diarrhoea.", "Dissolve ONE full sachet strictly in 1 Litre of clean boiled cooled water; discard unused mixture after 24 hours; give sip-by-sip slowly if vomiting."],
  ["Osteomyelitis", "Medical-Surgical", "Orthopaedics", "Acute or chronic bone infection (commonly Staphylococcus aureus or Salmonella in Sickle Cell Disease) causing localized throbbing bone pain, fever, and refusal to bear weight.", "Immobilize painful limb gently, avoid aggressive heat/massage, draw blood cultures before prolonged IV Cloxacillin/Ceftriaxone."],
  ["Otitis Media (Acute / Chronic Suppurative)", "Ophthalmology & ENT", "Sensory / Paeds", "Middle ear infection often post-URTI causing ear tugging, bulging red tympanic membrane, or draining ear pus (CSOM) risking mastoiditis/meningitis.", "Teach dry ear wicking with clean rolled tissue paper ('wicking dry') in CSOM + Ciprofloxacin ear drops per UCG."],
  ["Oxytocin Safety", "Pharmacology", "Midwifery & OB", "Uterotonic peptide triggering rhythmic uterine smooth muscle contractions for labour induction/augmentation or AMTSL PPH control.", "Use infusion pump/counted strict drip rate for induction, monitor fetal heart rate & uterine relaxation (>= 60 sec resting interval between contractions) continuously, and stop if tachysystole > 5 contractions/10 min."],
  ["Palliative & End-of-Life Care", "Foundations of Nursing", "Pain / Ethics", "Active total holistic physical, psychological, spiritual, and social care supporting patients & families facing life-limiting illness.", "Never withhold oral liquid Morphine strictly timed q4h in severe cancer pain out of misplaced addiction fear; treat breakthrough pain & constipation proactively (give Bisacodyl/Senna)."],
  ["Pancreatitis (Acute)", "Medical-Surgical", "Gastrointestinal", "Premature autodigestion of pancreas by trypsin enzyme (gallstones/alcohol) causing severe epigastric pain boring straight to the back & vomiting.", "Keep NBM initially, hydrate aggressively with Ringer's Lactate, manage pain, and monitor Cullen's/Grey-Turner's signs & glucose."],
  ["Paracentesis (Abdominal)", "Assessment", "Gastrointestinal", "Sterile needle catheter drainage of tense ascitic fluid relieving dyspnoea and diagnosing spontaneous bacterial peritonitis (SBP).", "ALWAYS have the patient empty urinary bladder FIRST and monitor supine vitals / IV albumin replacement if large-volume drainage (> 4–5 L) per order."],
  ["Partograph Alert vs Action Line", "Midwifery & OB", "Obstetrics", "WHO active-labour chart starting >= 4 cm cervical dilation expecting >= 1 cm/hr dilation progress.", "Crossing Alert line requires closer review & potential transfer to CEmONC facility; reaching Action line demands definitive intervention (ARM, cautious oxytocin if hypotonic, or C-section)."],
  ["Pelvic Inflammatory Disease (PID)", "Midwifery & OB", "Gynaecology / STI", "Ascending polymicrobial STI infection (Chlamydia/Gonorrhoea + anaerobes) causing lower abdominal pain, cervical motion tenderness, fever, and tubo-ovarian infertility risk.", "Treat BOTH patient and sexual partner(s) cleanly with UCG triple antibiotic regimen (Ceftriaxone + Doxycycline + Metronidazole) and counsel barrier protection."],
  ["Peptic Ulcer Disease (Gastric vs Duodenal)", "Medical-Surgical", "Gastrointestinal", "Mucosal ulceration (H. pylori + NSAIDs): Gastric pain worsens 30–60 min AFTER eating; Duodenal pain strikes 2–3 hrs later/at night and is relieved briefly by food.", "Stop NSAIDs, complete H. pylori triple eradication therapy, and monitor melena/perforation board-like abdomen."],
  ["Peritonitis", "Emergency Care", "Gastrointestinal", "Life-threatening inflammation of peritoneal lining (ruptured appendix/typhoid perforation/perforated ulcer) causing silent abdomen, high fever, and rigid board-like guarding.", "Keep strictly NBM, insert NGT + 2 IV lines, infuse Ringer's Lactate, start broad-spectrum IV antibiotics (Ceftriaxone + Metronidazole), and prepare emergency laparotomy."],
  ["Phlebitis & Cannula Care", "Assessment", "IPC / Foundations", "Vein-wall inflammation along an IV cannula presenting with pain, redness, warmth, swelling, or palpable venous cord (VIP score >= 2).", "Remove affected cannula IMMEDIATELY, insert fresh cannula at alternate proximal/contralateral site using strict ANTT, and apply warm compress."],
  ["Placenta Praevia vs Abruptio", "Midwifery & OB", "Obstetrics", "Praevia = painless bright red vaginal bleeding with soft non-tender uterus & high presenting part; Abruption = painful dark concealed/revealed bleeding with rigid 'woody' tender uterus.", "In BOTH, forbid digital vaginal examination until ultrasound rules out low-lying placenta covering cervical os."],
  ["Pneumocystis Pneumonia (PCP / PJP)", "Infectious Diseases", "HIV / Respiratory", "Fungal lung infection in advanced HIV (CD4 < 200) causing progressive exertional dyspnoea, dry non-productive cough, normal/clear initial chest auscultation, and steep exercise SpO2 desaturation.", "Start high-dose Cotrimoxazole (Septrin) +/- adjunctive Prednisolone if hypoxaemic (PaO2 < 70 mmHg) cleanly."],
  ["Pneumonia (Hospital vs Community)", "Medical-Surgical", "Respiratory", "Acute alveolar lung consolidation causing fever, tachypnoea, productive cough, bronchial breath sounds, and crackles.", "Under Uganda IMCI, fast breathing alone (>= 50/min in 2–11m; >= 40/min in 1–5 yrs) without chest indrawing classifies child Pneumonia for oral Amoxicillin."],
  ["Polypharmacy", "Pharmacology", "Geriatrics / Ethics", "Concurrent prescription of multiple (>= 5) medications increasing adverse drug-drug interactions, falls, and renal/hepatic toxicity.", "Review patient's complete brown-bag drug list every clinic visit, checking duplicate brands and renal/hepatic dose adjustments."],
  ["Postpartum Haemorrhage (4 Ts)", "Midwifery & OB", "Obstetrics", "Blood loss >= 500 mL vaginal (>= 1,000 mL C-section) or any loss causing haemodynamic shock within 24h (Primary) or 24h–6wks (Secondary).", "Diagnose rapid cause via the '4 Ts': Tone (uterine atony 70%!), Trauma (lacerations), Tissue (retained placenta), Thrombin (coagulopathy)."],
  ["Pre-eclampsia", "Midwifery & OB", "Obstetrics", "New-onset hypertension (BP >= 140/90 mmHg) after 20 weeks gestation accompanied by proteinuria or maternal/fetal organ dysfunction.", "Monitor severe headache, blurred flashing vision, and epigastric RUQ pain continuously — they precede imminent eclamptic convulsions."],
  ["Pressure Injury (Ulcer) Staging", "Medical-Surgical", "Integumentary", "Localized ischaemic skin/tissue necrosis over bony prominences (sacrum/heels): Stage 1 non-blanchable erythema -> Stage 2 partial-thickness blister -> Stage 3 full-thickness fat visible -> Stage 4 exposed bone/tendon/muscle.", "Turn bedbound patients q2h using 30° lateral tilt sheets (don't drag skin), keep dry/clean, boost protein nutrition, and float heels off mattress."],
  ["Puerperal Sepsis", "Midwifery & OB", "Postnatal / IPC", "Genital tract infection arising from delivery/miscarriage up to 42 days postpartum: fever >= 38 C, lower abdominal tenderness, foul lochia, sub-involution of uterus.", "Obtain blood/high vaginal swabs carefully and infuse broad-spectrum IV Ampicillin + Gentamicin + Metronidazole without delay."],
  ["Pulmonary Oedema", "Emergency Care", "Cardiovascular / Resp", "Acute fluid flooding alveoli from left ventricular failure or IV fluid overload causing extreme dyspnoea, orthopnoea, pink frothy sputum, and bilateral basal crackles.", "Sit upright legs dangling over bed, apply high-flow O2, give IV Furosemide + vasodilators as ordered, stop/slow all maintenance IV fluids immediately."],
  ["Pulse Pressure & MAP", "Assessment", "Cardiovascular", "Pulse Pressure = SBP - DBP (Narrow in hypovolaemic shock; Wide in raised ICP Cushing's); MAP = (SBP + 2×DBP) / 3 (>= 65 mmHg required to perfuse kidneys & brain).", "Never rely only on SBP alone — look at narrowing pulse pressure and rising tachycardia to catch early compensated shock."],
  ["Pyelonephritis (Acute)", "Medical-Surgical", "Renal", "Ascending bacterial upper urinary/kidney pelvis infection causing high spiking fever, rigors, flank/loin costovertebral angle tenderness, and nausea/vomiting.", "Collect clean midstream urine BEFORE starting IV Ceftriaxone/Gentamicin; treat seriously in pregnancy as it triggers preterm labour."],
  ["Quarantine vs Isolation", "Infectious Diseases", "Public Health", "Isolation separates ALREADY SICK contagious cases; Quarantine restricts movement of WELL exposed contacts during incubation period.", "Maintain empathetic communication, PPE compliance, and clear respiratory/contact precautions."],
  ["Rabies Post-Exposure Prophylaxis", "Emergency Care", "Infectious Diseases", "100% fatal viral encephalitis once neurological symptoms start — 100% preventable immediately after dog/cat/bat bite.", "Wash wound VIGOROUSLY for FULL 15 MINUTES with soap & flowing water immediately, do NOT suture tightly, give Tetanus toxoid + Rabies Vaccine series (Days 0, 3, 7, 14) + RIG for Category III bites."],
  ["Renal Calculi (Kidney Stones)", "Medical-Surgical", "Urological", "Crystalline mineral concretions causing excruciating loin-to-groin wave-like colicky pain and microscopic/frank haematuria.", "Strain all voided urine cleanly through gauze to recover stone for lab composition analysis and push 2.5–3 L oral/IV hydration."],
  ["Retinopathy (Diabetic / Hypertensive)", "Ophthalmology & ENT", "Sensory / Endocrine", "Progressive retinal microaneurysm haemorrhages & neovascularization risking silent irreversible blindness.", "Advise every Type 2 diabetic to attend dilated funduscopy exam yearly even when vision feels sharp."],
  ["Rhesus Isoimmunization (Anti-D)", "Midwifery & OB", "Haematology / OB", "Maternal anti-D antibody sensitization occurring when an Rh-negative mother carries an Rh-positive fetus or experiences APH/miscarriage/delivery.", "Administer Anti-D Immunoglobulin (RhoGAM) IM cleanly to every unsensitized Rh-negative mother within 72 hours of delivery, miscarriage, ectopic, or amniocentesis."],
  ["Rickets", "Paediatrics & IMCI", "Nutrition / Ortho", "Vitamin D/Calcium deficiency softening growing paediatric bones -> bowed legs (genu varum), rachitic rosary beaded ribs, craniotabes, and widened wrists.", "Counsel safe daily gentle morning sunlight exposure + Vitamin D/Calcium rich foods (milk, fish, eggs) + therapeutic Vitamin D."],
  ["Schistosomiasis (Bilharzia)", "Infectious Diseases", "Tropical Medicine", "Freshwater snail-borne blood fluke (S. mansoni causing portal hypertension/bloody diarrhoea; S. haematobium causing terminal haematuria & bladder cancer).", "Treat cleanly with single-dose Praziquantel 40 mg/kg alongside safe sanitation/avoiding stagnant freshwater exposure."],
  ["Schizophrenia (Positive vs Negative)", "Mental Health", "Psychiatry", "Positive symptoms = added distortions (hallucinations, delusions, disorganized speech); Negative symptoms = lost functions (flat affect, avolition, social withdrawal).", "Do NOT argue directly with fixed delusions or validate hallucinations as real — acknowledge patient emotions calmly and prioritize medication adherence."],
  ["Seizure Precautions", "Foundations of Nursing", "Neurology", "Bedside safety environment preventing trauma and aspiration in high-risk CNS/eclamptic patients.", "Keep side rails padded/up, functioning bedside suction + oxygen tested daily, bed in lowest position, and NEVER leave padded tongue blades/bite blocks inside mouth."],
  ["Septic Shock", "Emergency Care", "Critical Care", "Subset of sepsis with profound circulatory/cellular abnormalities causing persistent SBP < 90 / MAP < 65 mmHg despite adequate IV fluid resuscitation + lactate > 2 mmol/L.", "Escalate early for Vasopressor (Noradrenaline) support alongside 30 mL/kg crystalloid bolus & 1-hour IV antibiotics."],
  ["Sickle Cell Crisis (Vaso-Occlusive)", "Medical-Surgical", "Haematology", "Hypoxia, dehydration, cold, or infection triggers sickled RBCs jamming microvasculature causing agonizing bone/chest/abdominal pain and infarction.", "Cornerstone acute emergency triad: HIGH Hydration (IV + oral fluids) + Strong Analgesia (Morphine/Paracetamol) + Oxygen ONLY if hypoxic + treat Infection precipitants (never use cold packs or ice!)."],
  ["Sinusitis", "Ophthalmology & ENT", "Sensory", "Inflammation of paranasal facial sinuses causing facial pressure worsening when bending forward, nasal blockage, and purulent post-nasal drip.", "Advise steam inhalation, saline nasal irrigation, hydration, and complete antibiotics if bacterial > 10 days or severe double-sickening."],
  ["Spinal Cord Injury & Autonomic Dysreflexia", "Emergency Care", "Neurology", "Injury above T6 triggers life-threatening sympathetic hypertensive crisis (BP 220/120, pounding headache, bradycardia, sweating above lesion) from a noxious stimulus BELOW injury.", "IMMEDIATELY sit patient UPRIGHT 90° (lowers BP!), loosen tight clothes, then inspect/catheterize distended bladder or clear faecal impaction (most common causes)."],
  ["Splenomegaly & Splenic Rupture Risk", "Assessment", "Haematology", "Enlarged spleen palpated from RUQ diagonally toward left costal margin in malaria, sickle cell, typhoid, or portal hypertension.", "Palpate gently and forbid contact trauma or deep abdominal palpation when mononucleosis or massive tropical splenomegaly is suspected."],
  ["Stridor vs Wheezing vs Crackles", "Assessment", "Respiratory", "Stridor = high-pitched inspiratory upper airway obstruction (croup/epiglottitis/foreign body emergency); Wheeze = musical expiratory lower airway narrowing (asthma/COPD); Crackles = alveolar fluid/secretions (pneumonia/pulmonary oedema).", "Always treat sudden inspiratory stridor at rest as an imminent upper airway obstruction alert."],
  ["Subdural vs Epidural Haematoma", "Emergency Care", "Neurology / Trauma", "Epidural (middle meningeal artery laceration -> brief 'lucid interval' then rapid fatal coma); Subdural (bridging veins -> slower progressive confusion in elderly/alcoholics).", "Never discharge head-trauma patients without documented written head-injury red flags and reliable carer observation."],
  ["Syncope (Fainting)", "Assessment", "Cardiovascular", "Transient brief loss of consciousness caused by global cerebral hypoperfusion (vasovagal, arrhythmia, aortic stenosis, orthostatic hypovolaemia).", "Lay supine with legs elevated, check capillary glucose & pulse/ECG rhythm, and exclude ectopic pregnancy in women."],
  ["Tachypnoea", "Assessment", "Respiratory", "Abnormally rapid respiratory rate (> 20/min adult; >= 50/min 2–11m infant; >= 40/min 1–5 yr child).", "Remember tachypnoea is often the VERY FIRST subtle physiological indicator of sepsis, pneumonia, PE, or metabolic acidosis before SpO2 drops."],
  ["Tetanus & Opisthotonus", "Infectious Diseases", "Neurology / Trauma", "Clostridium tetani exotoxin blocking inhibitory GABA/glycine neurons -> lockjaw (trismus), risus sardonicus, painful generalized spasms & backward arching (opisthotonus).", "Place in quiet dark darkened low-stimulus room, maintain airway, give HTIG + Metronidazole + IV Diazepam spasms control, and check TT immunization status."],
  ["Thoracentesis (Pleural Tap)", "Medical-Surgical", "Respiratory", "Needle drainage of pleural effusion at upper border of lower rib (avoiding neurovascular bundle along inferior rib margin!).", "Lean seated patient comfortably over bedside cardiac table; post-procedure check breath sounds and CXR for iatrogenic pneumothorax."],
  ["Thrombocytopaenia", "Pathology & Lab", "Haematology", "Platelets < 150,000/uL (severe bleeding risk < 20,000–50,000/uL) causing petechiae, purpura, epistaxis, and gum bleeding.", "Use soft-bristle toothbrush, electric razor, forbid IM injections/NSAIDs/suppositories, and apply 5–10 min firm pressure after blood draws."],
  ["Thyroid Storm (Thyrotoxic Crisis)", "Emergency Care", "Endocrine", "Life-threatening hyperthyroid surge triggered by infection, trauma, or abrupt antithyroid stopping -> fever > 40 C, HR > 140 bpm, agitation, delirium, heart failure.", "Give Propylthiouracil (PTU) FIRST, then Lugol's iodine (>= 1 hr later!), Propranolol, IV Hydrocortisone, and external cooling (NEVER give Aspirin — displaces T4!)."],
  ["Tonsillitis & Peritonsillar Abscess", "Ophthalmology & ENT", "Sensory", "Group A Strep exudative tonsillar infection; unilateral 'hot potato' voice, trismus, and uvular deviation AWAY indicate urgent Quinsy abscess.", "Complete full 10-day Penicillin V / Amoxicillin course to prevent post-strep Rheumatic Heart Disease & glomerulonephritis."],
  ["Tracheostomy Care", "Medical-Surgical", "Respiratory / IPC", "Artificial airway stoma; requires strictly patent inner cannula, humidified air, & emergency spare tube at bedside ALWAYS.", "Keep spare same-size AND one size smaller tracheostomy tubes + obturator + tracheal dilator taped plainly at patient bedside continuously."],
  ["Triage (Start / ETAT Paediatrics)", "Emergency Care", "Emergency", "Sorting trauma/sick patients rapidly into Red (Immediate emergency resuscitation), Yellow (Priority/Urgent), Green (Queue/Non-urgent), Black (Deceased/Expectant).", "Apply WHO ETAT 'ABCD' signs in every clinic queue immediately on arrival so silent hypoxaemic/shocked babies never wait in line."],
  ["Typhoid Fever (Enteric Fever)", "Infectious Diseases", "Microbiology / GI", "Salmonella typhi systemic bacteraemia causing step-ladder fever, relative bradycardia, rose spots, pea-soup diarrhoea or constipation, risking week-3 ileal perforation.", "Watch abdominal tenderness/rigidity closely during week 2–3 and treat per UCG susceptibility (Ciprofloxacin/Azithromycin/Ceftriaxone)."],
  ["Ulcerative Colitis vs Crohn's", "Medical-Surgical", "Gastrointestinal", "UC = continuous mucosal rectal-to-colon ulcers causing bloody diarrhoea & tenesmus; Crohn's = skip-lesion transmural mouth-to-anus inflammation causing fistulae & strictures.", "Monitor stool frequency/blood, electrolytes, Hb, steroid/mesalazine adherence, and toxic megacolon distension."],
  ["Umbilical Cord Care (Chlorhexidine)", "Midwifery & OB", "Neonatal / IPC", "Keeping umbilical stump clean & dry (or Chlorhexidine 7.1% gel per Ugandan newborn protocol) leaving cord exposed OUTSIDE nappy.", "Periumbilical skin redness, pus, swelling, or foul smell (omphalitis) signals lethal neonatal sepsis requiring immediate IV Ampicillin + Gentamicin."],
  ["Uraemia", "Pathology & Lab", "Renal", "Toxic clinical syndrome in severe kidney failure featuring nausea, metallic taste, pruritus, asterixis flap, pericardial friction rub, and encephalopathy.", "Monitor pericardial friction rub (dialysis urgency), fluid overload, and neurological changes."],
  ["Uterine Inversion / Rupture", "Midwifery & OB", "Obstetrics", "Inversion: uterus turns inside-out during unguarded traction causing severe vagal/neurogenic shock; Rupture: torn uterine wall (scar/obstructed labour) causing sudden sharp pain loss, cessation of contractions, easily felt fetal parts, & absent FHR.", "For rupture -> urgent laparotomy; for inversion -> leave placenta attached initially if still adherent, push fundus gently upward via Johnson's manoeuvre, start Oxytocin only AFTER replacement."],
  ["Vaginal Examination (Sterile / VE)", "Midwifery & OB", "Obstetrics", "4-hourly active-labour pelvic check assessing cervical dilation (0–10 cm), effacement, station (-3 to +3), moulding, membranes, and cord exclusion.", "Contraindicated STRICTLY in antepartum haemorrhage until ultrasound rules out placenta praevia; minimize after membrane rupture."],
  ["Varicella (Chickenpox)", "Infectious Diseases", "Microbiology", "Highly infectious airborne & contact herpesvirus rash with concurrent 'crops' of macules, papules, vesicles ('dewdrop on rose petal'), and crusts.", "Isolate away from pregnant mothers and immunocompromised children; trim fingernails to prevent secondary Group A Strep skin superinfection."],
  ["Venous vs Arterial Leg Ulcer", "Assessment", "Cardiovascular", "Venous = medial malleolus gaiter area, warm skin, haemosiderin brown staining, irregular wet shallow base, milder pain better elevated. Arterial = lateral/toes punched-out deep pale cold painful base, absent pulse, worse elevated.", "Check Ankle-Brachial Pressure Index (ABPI) >= 0.8 BEFORE applying ANY compression bandage so you never gangrene an arterial leg."],
  ["Venturi Mask (High-Flow Controlled O2)", "Pharmacology", "Respiratory", "Colour-coded air-entrainment mask delivering exact fixed FiO2 (Blue 24%, White 28%, Yellow 35%, Red 40%, Green 60%) independent of patient breathing depth.", "Essential oxygen mask for COPD retainers requiring exact 24%–28% controlled titration without hypercapnic narcosis."],
  ["Vital Signs Normal Ranges (Adult)", "Assessment", "Foundations", "Temp 36.2–37.4 C · Pulse 60–100 bpm · RR 12–20 breaths/min · BP < 120/80 mmHg · SpO2 95–100%.", "A sudden shift in trend across two consecutive charts matters even more than a single borderline number."],
  ["Vitamin K (Phytomenadione) Newborn", "Pharmacology", "Neonatal / Haematology", "Single 1 mg IM dose (0.5 mg < 1.5 kg) into anterolateral thigh at birth preventing fatal Haemorrhagic Disease of the Newborn.", "Give cleanly within 1st hour post-delivery; vitamin K is poorly transferred across placenta and low in newborn gut flora."],
  ["Wernicke's Encephalopathy", "Emergency Care", "Neurology / Psych", "Acute reversible Thiamine (Vitamin B1) brain deficiency in chronic alcohol use/malnutrition causing triad: confusion, ataxia, and ophthalmoplegia/nystagmus.", "ALWAYS administer IV Thiamine BEFORE IV Dextrose infusion so glucose metabolism doesn't exhaust residual thiamine and precipitate permanent Korsakoff psychosis."],
  ["Wheelchair & Crutch Safety (3-Point Gait)", "Foundations of Nursing", "Orthopaedics", "Safe crutch fit: 2–3 fingerbreadths gap below axilla (weight borne strictly on HANDS, never armpits -> avoids radial nerve crutch palsy!).", "Remember safety mnemonic going up/down stairs on crutches: 'Up with the Good leg, Down with the Bad leg'."],
  ["Widal Test (Interpretation Caution)", "Pathology & Lab", "Microbiology", "Agglutination serology detecting Salmonella typhi antibodies; limited specificity in endemic Uganda due to prior vaccination, cross-reactivity, or past infection.", "Never over-diagnose Typhoid solely from an isolated weak Widal titre; interpret against fever history, blood/stool culture, and alternative causes like Malaria."],
  ["Xanthochromia", "Pathology & Lab", "Neurology", "Yellow bilirubin discolouration of centrifuged cerebrospinal fluid confirming Subarachnoid Haemorrhage (SAH) > 6–12 hours post-bleed vs traumatic tap.", "Observe acute 'thunderclap' worst-ever headache + photophobia + neck stiffness for urgent CT head & neurosurgical care."],
  ["Xerophthalmia & Bitot's Spots", "Ophthalmology & ENT", "Nutrition / Eye", "Dry ocular keratinization and foamy white triangular Bitot's spots on conjunctiva pathognomonic for severe Vitamin A deficiency.", "Give therapeutic high-dose Vitamin A immediately + repeated at Day 2 and Week 2 to rescue vision cleanly."],
  ["Xerostomia", "Assessment", "Sensory / Palliative", "Abnormal dry mouth from anticholinergics, head-neck radiation, dehydration, or Sjogren's impairing swallowing, dentures, and dental hygiene.", "Offer frequent small sips of water, sugar-free lozenges, gentle soft moist brushing, and non-alcohol mouth care."],
  ["Yellow Fever (VHF Surveillance)", "Infectious Diseases", "Tropical / PHE", "Mosquito-borne flavivirus causing acute biphasic fever, severe jaundice, black vomit haematemesis, albuminuria, and renal failure.", "Verify single-dose 17D Yellow Fever vaccine status (now part of Ugandan UNEPI 9-month routine infant schedule) and isolate suspected VHF under barrier IPC."],
  ["Yersinia & Plague Surveillance", "Infectious Diseases", "Microbiology", "Zoonotic Gram-negative coccobacillus (flea vector / rodent host in West Nile endemic foci) causing acute painful buboes or lethal pneumonic plague.", "Immediately isolate suspected pneumonic cases under strict droplet IPC, notify District Surveillance Focal Person cleanly, and initiate Doxycycline/Gentamicin/Streptomycin per MoH."],
  ["Zinc Sulfate (Paediatric Diarrhoea)", "Pharmacology", "Paediatrics", "Essential trace-mineral epithelial repair co-therapy cutting duration and severity of childhood diarrhoea by ~25% and preventing recurrence for 2–3 months.", "Administer 20 mg once daily x 10–14 days for children >= 6 months (10 mg/day for infants < 6 months) dissolved in clean water or breastmilk."],
  ["Zoonosis", "Infectious Diseases", "Community Health", "Any infectious disease naturally transmitted between vertebrate animals and humans (Rabies, Brucellosis, Anthrax, Rift Valley Fever, Ebola/Marburg).", "Always ask animal contact, raw unpasteurized milk (Brucellosis), and bushmeat/slaughter exposures during fever workups."],
  ["Zygote", "Anatomy & Physiology", "Midwifery & OB", "Diploid single-cell embryo formed by fusion of sperm and ovum inside the Fallopian ampulla, dividing toward morula and blastocyst before uterine implantation.", "Remember early embryonic organogenesis peaks Weeks 3–8 — the highest vulnerability window for teratogenic drugs and rubella."],
  ["Abscess (Cutaneous / Visceral)", "Medical-Surgical", "Integumentary / IPC", "Localized painful fluctuant collection of pus walled off inside body tissues following bacterial invasion.", "Treat with surgical Incision & Drainage (I&D) plus sterile moist packing — antibiotics alone cannot penetrate thick abscess capsules cleanly."],
  ["Acetaminophen (Paracetamol) Toxicity", "Pharmacology", "Toxicology / Hepatic", "Acute liver centrilobular necrosis caused by NAPQI metabolite accumulation after overdose (> 150 mg/kg or > 7.5–10 g adult).", "Administer N-Acetylcysteine (NAC) IV/oral antidote urgently — most effective within 8 hours of ingestion; check 4-hour serum paracetamol level & LFTs."],
  ["Acromioclavicular Separation", "Medical-Surgical", "Orthopaedics", "Traumatic disruption of AC ligaments connecting distal clavicle and acromion after direct lateral shoulder fall.", "Support injured arm comfortably in broad arm sling, apply ice intermittently, assess distal radial pulse/sensory axillary nerve over deltoid."],
  ["Actinic Keratosis", "Medical-Surgical", "Integumentary", "Premalignant rough scaly macule/papule on chronically sun-exposed skin especially in fair skin or albinism.", "Counsel broad-spectrum sunscreen, protective hats/clothing (crucial for Ugandans with oculocutaneous albinism), and dermatology cryotherapy."],
  ["Acute Coronary Syndrome (ACS)", "Emergency Care", "Cardiovascular", "Spectrum covering Unstable Angina, NSTEMI, and STEMI resulting from coronary plaque erosion/rupture.", "Record 12-lead ECG within 10 minutes of arrival, check serial Troponin-I/T, give chewed Aspirin 300 mg + dual antiplatelet per clinician order."],
  ["Adenoidectomy & Tonsillectomy Care", "Ophthalmology & ENT", "Paediatrics / Surgery", "Post-operative airway vigilance after lymphoid pharyngeal excision.", "Position side-lying/prone during recovery, watch frequent swallowing (silent hidden pharyngeal bleeding red alert!), avoid red liquids & harsh coughing."],
  ["Afterpains", "Midwifery & OB", "Postnatal Care", "Painful intermittent cramping uterine contractions during the first days postpartum caused by breastfeeding oxytocin release especially in multiparae.", "Reassure mother that afterpains confirm healthy uterine involution; keep bladder empty and offer safe Paracetamol/Ibuprofen 30 min prior to feeds."],
  ["Agoraphobia", "Mental Health", "Psychiatry", "Intense anxiety about public open or enclosed spaces where escape or help feels difficult.", "Use calm graded desensitization, slow diaphragmatic breathing, and avoid abrupt forceful confrontation."],
  ["Albumin (Serum) & Oncotic Pressure", "Pathology & Lab", "Systemic", "Major plasma protein synthesized by liver (Normal 35–50 g/L) maintaining intravascular colloid oncotic pull.", "Low albumin (nephrotic syndrome, liver failure, kwashiorkor) leaks water directly into third spaces creating pitting oedema & ascites."],
  ["Alcohol Withdrawal (Delirium Tremens)", "Emergency Care", "Mental Health", "Severe sympathetic rebound 48–96 hrs post cessation: coarse tremor, hallucinations, tachycardia, hypertension, fever, and seizures.", "Start CIWA-Ar monitoring, give Diazepam/Chlordiazepoxide symptom-triggered sedation AND IV Thiamine BEFORE any glucose."],
  ["Allopurinol", "Pharmacology", "Musculoskeletal", "Xanthine oxidase inhibitor lowering uric acid chronically to prevent recurrent gout flares and uric acid nephropathy.", "Never initiate abruptly mid-acute gout attack without anti-inflammatory cover, encourage >= 2 L water daily, watch rash (SJS alert)."],
  ["Alpha-Fetoprotein (AFP)", "Midwifery & OB", "Obstetrics / Lab", "Fetal glycoprotein screened in maternal serum: elevated in open Neural Tube Defects/gastroschisis/twins; reduced in Trisomy 21.", "Confirm gestational age cleanly via ultrasound dating before interpreting maternal screening titres."],
  ["Amenorrhoea (Lactational LAM)", "Midwifery & OB", "Family Planning", "Natural postpartum contraception >= 98% effective ONLY if ALL 3 criteria hold: Exclusive breastfeeding day & night, Amenorrhoeic, Infant < 6 months.", "Counsel mothers promptly to add another contraceptive method immediately once any single LAM rule lapses."],
  ["Aminoglycosides (Gentamicin / Amikacin)", "Pharmacology", "Infectious Diseases", "Potent bactericidal Gram-negative IV antibiotics carrying dose-limiting nephrotoxicity and irreversible CN VIII ototoxicity.", "Check renal function (Creatinine/urine output) and tinnitus/vertigo before dosing; never co-mix in same IV syringe with Penicillins."],
  ["Amniotic Fluid Embolism (AFE)", "Midwifery & OB", "Obstetrics", "Rare catastrophic anaphylactoid reaction during/after delivery -> sudden severe hypoxia, hypotension, cardiovascular collapse, and rapid DIC bleeding.", "Summon full multidisciplinary ICU/obstetric team immediately: airway intubation, CPR/BP support, and massive transfusion for DIC."],
  ["Amphotericin B Safety", "Pharmacology", "Infectious Diseases", "Broad antifungal used in severe cryptococcal meningitis causing infusion rigors, nephrotoxicity, and severe K+/Mg2+ wasting.", "Pre-hydrate with 1 L Normal Saline + KCl/MgSO4 supplementation per Uganda HIV/Cryptococcal protocol and protect IV solution per product instructions."],
  ["Analgesic Ladder (WHO Pain)", "Foundations of Nursing", "Pain Care", "Three-step pain escalation: Step 1 Non-opioids (Paracetamol/NSAIDs) -> Step 2 Weak opioids (Tramadol/Codeine) -> Step 3 Strong opioids (Morphine).", "Give cancer/palliative pain analgesia strictly 'by the clock' rather than forcing patients to wait in agony 'PRN'."],
  ["Angioedema (ACE-Inhibitor Induced)", "Emergency Care", "Pharmacology / Airway", "Rapid bradykinin-mediated swelling of lips, tongue, and glottis triggered unpredictably days or years after starting Enalapril/Lisinopril.", "STOP ACE inhibitor permanently, protect airway urgently (unlike histamine anaphylaxis, steroids/antihistamines work poorly — prepare airway intubation!)."],
  ["Anion Gap (Metabolic Acidosis)", "Pathology & Lab", "Critical Care", "Serum Na+ minus (Cl- + HCO3-), normal ~8–12 mEq/L; widened in DKA, Lactate shock, Uraemia, Salicylate/Methanol poisoning ('MUDPILES').", "Investigate unexplained high anion gap for hidden tissue sepsis hypoperfusion or toxic ingestion."],
  ["Anosmia", "Assessment", "Neurology / ENT", "Partial or total loss of smell sensation (Cranial Nerve I) following viral URTI, ethmoid fracture, or anterior fossa lesions.", "Educate home safety: fit smoke detectors & check food expiry dates since spoiled food/gas leaks cannot be smelled."],
  ["Anthelmintics (Albendazole / Mebendazole)", "Pharmacology", "Community Health", "Benzimidazole dewormers starving intestinal roundworms, hookworms, and whipworms of glucose uptake.", "Administer preventive community deworming (every 6 months in ages 1–14 yrs) safely after 1st trimester pregnancy if clinically indicated."],
  ["Antidiuretic Hormone (ADH / SIADH vs DI)", "Anatomy & Physiology", "Endocrine / Renal", "Posterior pituitary vasopressin conserving free water in renal collecting ducts. Excess (SIADH) causes dilutional hyponatraemia; Deficit (Diabetes Insipidus) causes massive dilute polyuria.", "Measure strict urine specific gravity, daily weights, and serum sodium closely."],
  ["Apnoea of Prematurity", "Paediatrics & IMCI", "Neonatal Care", "Immature brainstem respiratory pauses >= 20 seconds or accompanied by bradycardia (< 100 bpm) / desaturation in babies < 34 weeks.", "Give gentle tactile stimulation first, maintain KMC warmth, start Caffeine Citrate/Aminophylline per NICU order, avoid deep aggressive suctioning."],
  ["Aqueous Humour & Intraocular Flow", "Ophthalmology & ENT", "Eye Anatomy", "Clear nourishing fluid produced by ciliary body flowing from posterior chamber -> pupil -> anterior chamber -> trabecular meshwork/Canal of Schlemm.", "Impaired drainage raises IOP quickly damaging optic disc axons (glaucoma)."],
  ["Areola & Montgomery's Tubercles", "Midwifery & OB", "Obstetrics", "Pigmented ring surrounding nipple containing sebaceous lubricating glands protecting skin during breastfeeding.", "Teach mother baby must latch deeply onto AREOLA (not tip of nipple alone!) to draw milk efficiently without painful cracked nipples."],
  ["Arterial Line Monitoring", "Emergency Care", "Critical Care", "Indwelling radial/femoral arterial catheter delivering continuous beat-to-beat BP & painless ABG sampling.", "Keep pressure transducer strictly zeroed & levelled horizontally to Phlebostatic Axis (4th ICS mid-axillary line); verify Allen test & pressurized flush bag."],
  ["Arthroplasty (Hip / Knee Replacement)", "Medical-Surgical", "Orthopaedics", "Surgical prosthetic joint reconstruction restoring pain-free mobility in severe osteoarthritis or displaced femoral neck fracture.", "Prevent hip dislocation first 6–12 wks: NO hip flexion > 90°, NO crossing legs, NO internal rotation; keep abduction pillow & start DVT prophylaxis."],
  ["Aspiration Pneumonia Prevention", "Foundations of Nursing", "Respiratory", "Chemical/bacterial pneumonitis after inhaling gastric acid, vomit, or oral feeds in stroke, GCS <= 8, or post-anaesthesia.", "Turn unconscious patients recovery-lateral, keep HOB 30–45° during enteral feeds, and confirm swallow safety before fluids."],
  ["Astigmatism & Refractive Errors", "Ophthalmology & ENT", "Sensory", "Asymmetric corneal/lens curvature causing blurred distorted vision across all distances.", "Screen school-age children using Snellen chart at 6 metres and refer for corrective cylindrical lenses."],
  ["Ataxic Gait", "Assessment", "Neurology", "Wide-based staggering uncoordinated walking from cerebellar disease, dorsal column loss, or acute alcohol/phenytoin toxicity.", "Institute high falls precautions, assistive gait belt ambulation, and perform Romberg & finger-to-nose testing."],
  ["Atropine Sulfate", "Pharmacology", "Emergency / Toxicology", "Muscarinic anticholinergic antidote reversing organophosphate pesticide poisoning and symptomatic sinus bradycardia.", "In Organophosphate poisoning, titrate IV Atropine aggressively until chest bronchial secretions dry cleanly ('clear chest lungs', HR >= 80–100) rather than pupil size alone!"],
  ["Auscultatory Gap", "Assessment", "Cardiovascular", "Silent temporary disappearance of Korotkoff sounds between systolic & diastolic pressures common in severe hypertension.", "ALWAYS palpate radial pulse while inflating cuff until radial pulse disappears + add 30 mmHg FIRST to avoid falsely low systolic readings."],
  ["Autologous vs Allogeneic Transfusion", "Pathology & Lab", "Haematology", "Donor vs patient-derived blood products requiring strict ABO & Rhesus compatibility cross-matching.", "Verify TWO licensed clinicians match full name, inpatient ID, unit serial number, blood group, & expiry at bedside immediately before hanging bag."],
  ["Babinski Sign (Plantar Reflex)", "Assessment", "Neurology", "Stroking lateral sole -> upgoing great toe extension + fanning toes: NORMAL in infants < 18–24 months; abnormal upper motor neuron corticospinal sign in adults.", "Test routinely during focal stroke, spinal cord, or post-ictal neuro exams."],
  ["Bacterial Vaginosis (BV)", "Midwifery & OB", "Gynaecology", "Polymicrobial anaerobic vaginal flora shift replacing protective Lactobacilli -> thin grey-white 'fishy' amine discharge.", "Treat symptomatic & pregnant mothers with oral Metronidazole per UCG to cut preterm birth/PROM risks cleanly."],
  ["Balanitis", "Medical-Surgical", "Urological", "Inflammation/infection of glans penis often linked to poor hygiene under foreskin, Candida, or undiagnosed Diabetes Mellitus.", "Screen fasting blood glucose in recurrent fungal balanitis and instruct gentle warm retraction/drying hygiene."],
  ["Bartholin's Cyst / Abscess", "Midwifery & OB", "Gynaecology", "Blocked lubricated posterior labial vestibular gland causing unilateral tender swelling at 4 or 8 o'clock vulvar position.", "Provide warm sitz baths for mild cysts; warm painful abscesses require surgical marsupialization/Word catheter + STI screen."],
  ["Basal Metabolic Rate (BMR)", "Anatomy & Physiology", "Endocrine / Nutrition", "Minimal baseline energy expenditure sustaining cellular respiration, heartbeat, breathing, and core warmth at complete rest.", "Fever raises BMR ~13% per 1 C above normal, accelerating protein catabolism and calorie needs in ICU/burn/TB wards."],
  ["Bell's Palsy (CN VII LMN)", "Medical-Surgical", "Neurology", "Acute idiopathic lower motor neuron facial nerve paralysis affecting BOTH forehead & lower face equally (distinguishes cleanly from stroke where forehead is spared!).", "Start early oral Prednisolone within 72 hours AND tape eyelid shut/apply lubricating ointment every night so exposed cornea doesn't ulcerate!"],
  ["Benign Paroxysmal Positional Vertigo", "Ophthalmology & ENT", "Sensory", "Brief episodic spinning vertigo (< 60 s) triggered by rolling in bed or tilting head upward due to displaced inner-ear otoliths.", "Assist patient slowly up from lying, protect from falls, and coordinate Epley canalith repositioning."],
  ["Bicarbonate (HCO3-) Buffer System", "Anatomy & Physiology", "Renal / Resp", "Primary extracellular blood acid-base chemical buffer balancing CO2 + H2O <-> H2CO3 <-> H+ + HCO3- within seconds.", "Remember lungs blow off volatile CO2 quickly while kidneys excrete fixed H+ & regenerate bicarbonate over days."],
  ["Biopsy (Excisional / Core / FNA)", "Pathology & Lab", "Oncology / Diagnostics", "Tissue sampling submitted in 10% neutral buffered formalin (NEVER freeze histology specimen!) for definitive histological diagnosis.", "Verify correct patient labelling, intact fixative seal, bleeding check post-procedure, and timely pathology tracking."],
  ["Bladder Scan (Post-Void Residual)", "Assessment", "Urological", "Non-invasive bedside ultrasound calculating residual urine volume without risking catheter CAUTI.", "PVR < 50–100 mL normal; >= 300–400 mL post-void signals urinary retention needing intermittent/indwelling catheter assessment."],
  ["Blepharitis", "Ophthalmology & ENT", "Sensory", "Chronic flaky crusting inflammation along eyelid margins from seborrhoea or Staph infection causing gritty morning lashes.", "Demonstrate gentle warm eyelid compresses followed by diluted baby-shampoo lid scrubs + clean margin wiping."],
  ["Blood-Brain Barrier (BBB)", "Anatomy & Physiology", "Neurology / Pharm", "Tight endothelial astrocyte junction shielding brain CSF from circulating toxins, microbes, and water-soluble drugs.", "Lipid-soluble drugs (Diazepam, Propofol) cross instantaneously; water-soluble Penicillins require inflamed meninges or high IV dosing."],
  ["Body Surface Area (BSA)", "Pharmacology", "Paediatrics / Oncology", "Mosteller square-root formula calculating individualized chemotherapy and paediatric high-precision doses (m2).", "Always verify weight (kg) AND height (cm) cleanly before checking double-verified chemotherapy charts."],
  ["Borreliosis (Tick-Borne Relapsing Fever)", "Infectious Diseases", "Tropical Medicine", "Spirochaete infection (Ornithodoros soft tick in mud-walled dwellings) causing recurring high fever episodes, hepatosplenomegaly, and pregnancy loss.", "Give Penicillin/Doxycycline cautiously — monitor patient FIRST 2–4 hours closely for acute Jarisch-Herxheimer fever/hypotension crisis."],
  ["Brachial Plexus & Erb's Palsy", "Midwifery & OB", "Neonatal / Neuro", "Excessive lateral traction during shoulder dystocia stretching C5–C6 nerve roots -> infant arm adducted, internally rotated ('waiter's tip' position).", "Perform gentle passive ROM after initial swelling settles (~Day 7–10), reassure parents on frequent recovery, avoid forceful shoulder pull during birth."],
  ["Bradykinesia", "Assessment", "Neurology", "Slowness initiating & executing voluntary movements characteristic of Parkinson's disease nigrostriatal dopamine loss.", "Allow unhurried time for walking/dressing, give visual step cues, and time Levodopa/Carbidopa doses on time every day."],
  ["Braxton Hicks Contractions", "Midwifery & OB", "Obstetrics", "Irregular painless uterine tightening from 2nd trimester causing ZERO progressive cervical dilation ('false labour').", "Differentiate cleanly from true labour (regular intensifying interval + cervical effacement/dilation) by hydration, walking rest check, and palpation."],
  ["Breech Presentation (Frank / Complete / Footling)", "Midwifery & OB", "Obstetrics", "Fetal buttocks or feet enter pelvic brim first (~3–4% at term); Footling breech carries highest umbilical cord prolapse risk.", "Confirm via Leopold abdominal palpation & ultrasound after 36 weeks; refer early for External Cephalic Version (ECV) or safe CEmONC hospital delivery."],
  ["Bronchiectasis", "Medical-Surgical", "Respiratory", "Permanent abnormal bronchial dilation with chronic foul copious three-layered sputum, coarse crackles, and finger clubbing.", "Provide daily postural percussion drainage, hydration, sputum cultures for exacerbations, and vaccinations."],
  ["Brucellosis", "Infectious Diseases", "Tropical Medicine", "Zoonotic Gram-negative coccobacillus contracted via unpasteurized milk or livestock birth tissues causing undulating fevers, drenching sweats, & sacroiliac joint pain.", "Counsel boiling/pasteurizing all fresh milk and treat cleanly with 6-week Doxycycline + Gentamicin/Rifampicin combination."],
  ["Buck's Skin Traction", "Medical-Surgical", "Orthopaedics", "Temporary non-invasive leg foam-boot traction stabilizing hip/femoral fractures pre-operatively to relieve painful muscle spasms.", "Inspect heels/peroneal nerve pressure daily, ensure weights hang FREELY off the floor at all times, and NEVER lift traction weights arbitrarily."],
  ["Bursitis", "Medical-Surgical", "Musculoskeletal", "Painful fluid-filled swelling of periarticular bursae (olecranon elbow, prepatellar knee) from repetitive friction or gout/sepsis.", "Rest joint, apply ice first 24–48 hrs, aspirate ONLY under strict sterility if septic bursitis suspected."],
  ["Caffeine Citrate (Neonatal)", "Pharmacology", "Neonatal Care", "Methylxanthine CNS stimulant lowering apnoea frequency & extubation failure in preterm neonates < 34 weeks.", "Hold or review dose if neonatal resting tachycardia > 180–200 bpm or marked jitteriness/feeding intolerance develops."],
  ["Calcium Channel Blockers (Amlodipine / Nifedipine)", "Pharmacology", "Cardiovascular", "Vascular smooth muscle vasodilators lowering blood pressure and severe pre-eclampsia hypertension cleanly.", "Advise slow rising to prevent orthostatic dizziness, avoid grapefruit juice where applicable, and report ankle oedema or gingival hyperplasia."],
  ["Candida Diaper Dermatitis", "Paediatrics & IMCI", "Integumentary", "Bright beefy-red confluent groin crease rash WITH classic pinpoint 'satellite' pustules beyond border.", "Apply topical Nystatin/Clotrimazole cream after washing gently with plain warm water + air drying (hydrocortisone alone worsens fungal rash!)."],
  ["Caput Succedaneum vs Cephalhaematoma", "Midwifery & OB", "Neonatal Care", "Caput = soft boggy scalp oedema CROSSING suture lines present at birth resolving in days. Cephalhaematoma = subperiosteal blood collection NEVER crossing suture lines rising after hours, risking hyperbilirubinaemia.", "NEVER aspirate a cephalhaematoma (introduces osteomyelitis/meningitis!) — monitor jaundice cleanly."],
  ["Carbamazepine", "Pharmacology", "Neurology / Psych", "First-line sodium-channel blocker for focal epilepsy, trigeminal neuralgia, & bipolar mania (enzyme inducer).", "Monitor skin for Stevens-Johnson rash (HLA-B*1502 alert), hyponatraemia, leukopenia, and counsel reduced effectiveness of oral contraceptives."],
  ["Cardiac Tamponade (Beck's Triad)", "Emergency Care", "Cardiovascular", "Haemopericardial compression choking heart filling -> Beck's triad: Hypotension + Distended Jugular Veins + Muffled Heart Sounds (+ Pulsus Paradoxus).", "Prepare emergency ultrasound-guided pericardiocentesis tray + cautious IV preload support immediately."],
  ["Cardiomegaly", "Assessment", "Cardiovascular", "Enlarged heart silhouette on Chest X-Ray (Cardiothoracic Ratio > 0.50 PA film) from chronic hypertension, RHD, or dilated cardiomyopathy.", "Assess S3 gallop, basal crackles, pedal oedema, and medication adherence."],
  ["Cardioversion vs Defibrillation", "Emergency Care", "Critical Care", "Synchronized Cardioversion times shock cleanly to R-wave for unstable SVT/AFib WITH pulse; Unsynchronized Defibrillation fires immediately for pulseless VF / VT!", "Shout 'CLEAR — EVERYONE STEP BACK!' and verify zero oxygen mask flow is blowing right across chest paddles before pressing shock."],
  ["Carpal Tunnel Syndrome", "Medical-Surgical", "Neurology / Ortho", "Median nerve compression under wrist flexor retinaculum causing thumb/index/middle finger numbness worse at night (Phalen's & Tinel's positive).", "Fit neutral wrist splint especially at night and assess thenar muscle wasting."],
  ["Carpopedal Spasm (Trousseau's Sign)", "Assessment", "Endocrine / Electrolyte", "Painful thumb adduction & metacarpophalangeal wrist flexion appearing within 3 minutes when BP cuff is inflated > SBP (classic hypocalcaemia tetany sign).", "Alert physician immediately post-thyroidectomy for slow IV Calcium Gluconate."],
  ["Ceftriaxone", "Pharmacology", "Infectious Diseases", "Broad third-generation cephalosporin treating meningitis, severe pneumonia, pyelonephritis, gonorrhoea, & pelvic infections.", "NEVER mix or run IV Ceftriaxone through the same line as Calcium-containing fluids (Ringer's Lactate!) in neonates due to fatal lung/kidney calcium-ceftriaxone precipitates."],
  ["Central Venous Pressure (CVP)", "Emergency Care", "Critical Care", "Right atrial preload measurement (Normal 2–8 mmHg / 5–12 cmH2O) via internal jugular/subclavian CVC.", "Keep catheter hub strictly sterile ('Scrub the Hub' 15 sec alcohol) and inspect insertion site daily for CLABSI sepsis."],
  ["Cerebral Oedema", "Emergency Care", "Neurology", "Hazardous swelling of brain tissue following trauma, DKA, hypoxic ischaemia, or hyponatraemia risking brainstem herniation.", "Elevate head 30° neutral midline, avoid tight neck tape/ties obstructing jugular outflow, maintain normal temperature/Na+, and give Mannitol/3% NaCl as ordered."],
  ["Cervical Effacement & Dilation", "Midwifery & OB", "Obstetrics", "Thinning/shortening of cervix (0–100%) and opening of internal cervical os (0–10 cm full dilation) driven by true uterine contractions.", "In nulliparae, cervical effacement largely precedes full dilation; both progress smoothly together in active labour."],
  ["Chain of Infection", "Infectious Diseases", "IPC / Microbiology", "Six linked steps required for spread: Agent -> Reservoir -> Portal of Exit -> Transmission -> Portal of Entry -> Susceptible Host.", "Consistent alcohol hand-rub & proper PPE cleanly break Transmission — the weakest and easiest link to interrupt!"],
  ["Cheyne-Stokes Respirations", "Assessment", "Neurology / Palliative", "Crescendo-decrescendo breathing cycles alternating regularly with brief central apnoeic pauses seen in severe heart failure, raised ICP, or active dying.", "Reassure anxious family during peaceful end-of-life care that irregular cycles reflect brainstem slowing, not choking distress."],
  ["Chloramphenicol Eye Drops / Ointment", "Ophthalmology & ENT", "Pharmacology", "Broad topical ocular antibiotic clearing superficial bacterial conjunctivitis.", "Administer inside pulled lower conjunctival fornix without letting dropper tip touch lashes/sclera; keep systemic chloramphenicol cautiously avoiding neonate Gray Baby Syndrome."],
  ["Cholelithiasis (Gallstones)", "Medical-Surgical", "Gastrointestinal", "Cholesterol or pigment stones inside gallbladder causing episodic post-fatty-meal biliary colic ('4 Fs' risk factors).", "Monitor jaundice/dark urine (common bile duct obstruction) and counsel low-fat meals."],
  ["Chvostek's Sign", "Assessment", "Endocrine", "Ipsilateral facial corner twitching when tapping facial nerve anterior to earlobe -> indicates hypocalcaemia tetany excitability.", "Test routinely alongside Trousseau's sign every shift for 48 hrs after neck/thyroid surgery."],
  ["Clubbing (Digital)", "Assessment", "Respiratory / Cardio", "Painless bulbous enlargement of distal phalanges losing normal Schamroth diamond nail-bed window -> bronchiectasis, lung cancer, cyanotic heart disease, infective endocarditis.", "Always inspect fingers sideways from profile during routine respiratory & cardiac exams."],
  ["Colostrum", "Midwifery & OB", "Postnatal Care", "Thick golden-yellow pre-milk secreted first 2–4 days postpartum packed cleanly with protective secretory IgA antibodies, growth factors, & lactoferrin ('baby's first vaccine').", "Initiate skin-to-skin breastfeeding strictly WITHIN 1 HOUR of birth and NEVER discard colostrum!"],
  ["Conjunctival Pallor", "Assessment", "Haematology", "Pale lower inner eyelid mucosal vasculature indicating significant clinical anaemia (Hb often < 7–9 g/dL); confirm via palmar/nailbed pallor & Hb lab check.", "Examine lower palpebral conjunctivae softly in bright natural daylight."],
  ["Contracture (Joint / Burn)", "Medical-Surgical", "Orthopaedics / Surgery", "Permanent fixed shortening of muscle, tendon, or scar skin pulling a joint out of functional position.", "Prevent cleanly in stroke/burn wards via neutral splinting, prone/extension positioning, and daily passive full range-of-motion."],
  ["Cotrimoxazole (Septrin Prophylaxis)", "Pharmacology", "HIV / Infectious", "Trimethoprim-Sulfamethoxazole preventive daily tablet reducing PCP pneumonia, Toxoplasmosis, & malaria bacterial morbidity in PLHIV.", "Maintain good hydration to prevent sulfonamide crystalluria and monitor immediately for itchy rash/mucosal blisters (SJS)."],
  ["Crepitus (Subcutaneous / Bone)", "Assessment", "Emergency / Ortho", "Crunch-like 'Rice Krispies' crackling beneath skin (subcutaneous emphysema after pneumothorax/chest injury) OR grating bone ends in fractures.", "Mark margin of neck/chest subcutaneous air smoothly with pen and report expanding air track immediately."],
  ["Croup (Laryngotracheobronchitis)", "Paediatrics & IMCI", "Respiratory", "Parainfluenza viral subglottic airway swelling in ages 6m–3y causing harsh seal-like 'barking' cough, hoarseness, & inspiratory stridor.", "Treat promptly with single oral/IM Dexamethasone (0.15–0.6 mg/kg) + nebulized Adrenaline if stridor persists at rest; keep child calm with parent."],
  ["Cullen's & Grey-Turner's Signs", "Assessment", "Emergency / GI", "Periumbilical bluish bruising (Cullen) or flank ecchymosis (Grey-Turner) signaling retroperitoneal haemorrhage in severe acute pancreatitis or ruptured ectopic pregnancy.", "Immediately escalate hypovolaemic volume support & urgent abdominal surgical imaging."],
  ["Cystitis (Uncomplicated UTI)", "Medical-Surgical", "Renal", "Lower bladder mucosal infection causing dysuria, urgency, frequency, and suprapubic tenderness WITHOUT systemic fever/loin pain.", "Encourage liberal fluids, double-voiding, front-to-back wiping hygiene, and targeted UCG Nitrofurantoin/short course."],
  ["Dactylitis (Hand-Foot Syndrome)", "Paediatrics & IMCI", "Haematology", "Painful symmetric non-pitting swelling of infant hands & feet — often the FIRST vaso-occlusive crisis presenting sign of Sickle Cell Disease around 6–12 months.", "Screen infant haemoglobin electrophoresis / sickling test cleanly alongside hydration & gentle analgesia."],
  ["Dehiscence & Evisceration (Wound)", "Emergency Care", "Surgical Nursing", "Dehiscence = partial/full separation of abdominal wound layers; Evisceration = loops of bowel protruding outside opened wound.", "EVISCERATION EMERGENCY: Stay calm with patient, lie supine knees slightly bent to relax abdomen, cover protruding organs IMMEDIATELY with sterile warm 0.9% saline-soaked towels (NEVER push bowel back in!), keep NBM, call surgeon urgently."],
  ["Dengue Fever", "Infectious Diseases", "Tropical Medicine", "Aedes mosquito-borne flavivirus causing abrupt high fever, severe retro-orbital headache, myalgia ('breakbone fever'), rash, and plasma-leakage shock warning.", "Give Paracetamol ONLY — strictly AVOID Aspirin/Ibuprofen NSAIDs due to severe thrombocytopaenic haemorrhage risk!"],
  ["Depo-Provera (DMPA Contraception)", "Midwifery & OB", "Family Planning", "150 mg IM (or Sayana Press SC) progestin-only injection given cleanly every 12 weeks (13 weeks grace window).", "Counsel upfront on expected lighter/irregular spotting or amenorrhoea (does not hurt uterus!) and do NOT firmly massage injection site."],
  ["Dermatome", "Anatomy & Physiology", "Neurology", "Specific unilateral skin band strip supplied by a single spinal dorsal nerve root — key landmark in spinal anaesthesia height check & Shingles distribution.", "Know key landmarks: T4 = Nipples, T10 = Umbilicus (used cleanly checking spinal block height before C-section!)."],
  ["Diabetes Insipidus (Central vs Nephrogenic)", "Medical-Surgical", "Endocrine / Renal", "Deficient ADH release or renal resistance pouring 4–15 L/day pale dilute urine (specific gravity < 1.005) -> severe hypernatraemia & thirst.", "Match strict hourly urine output with oral water/IV 5% Dextrose or Desmopressin cleanly."],
  ["Diazepam Rectal Administration", "Pharmacology", "Paediatrics / Emergency", "Rapid mucosal rectal benzodiazepine route (0.5 mg/kg) halting active childhood seizures within 2–5 minutes when IV access is unavailable.", "Use needleless syringe 4–5 cm gently inside rectum, pinch buttocks smoothly 1–2 minutes post-instillation so medication stays absorbed cleanly, watch respiration."],
  ["Diabetic Foot Neuropathy", "Medical-Surgical", "Endocrine", "Stocking-glove peripheral nerve loss eliminating protective pain -> silent painless shoe trauma turning into deep limb-threatening ulcers.", "Perform 10g monofilament screening annually, inspect footwear/between toes daily, never walk barefoot, cut nails straight across."],
  ["Diplopia (Double Vision)", "Ophthalmology & ENT", "Neurology / Eye", "Seeing two overlapping images from cranial nerve III/IV/VI palsy, myasthenia gravis, raised ICP, or orbital wall fracture.", "Assess unilateral vs binocular (persists vs vanishes covering 1 eye) and pupil reactivity urgently."],
  ["Dobutamine vs Dopamine vs Noradrenaline", "Pharmacology", "Critical Care", "IV vasoactive infusions: Noradrenaline first-line vasopressor raising MAP in Septic Shock; Dobutamine boosts myocardial contractility in Cardiogenic Shock.", "Infuse strictly via dedicated central lumen or closely watched secure line using calibrated syringe pump, monitor distal perfusion continuously."],
  ["Dorsal Recumbent vs Lithotomy vs Sims", "Foundations of Nursing", "Procedures", "Clinical exam positions: Sims (left lateral semi-prone with upper knee flexed -> rectal exam/enemas/recovery); Lithotomy (knees up in stirrups -> gynaecology); Fowler's (45–60° sitting -> dyspnoea).", "Preserve dignity with clean draping exposing ONLY the immediate examination area."],
  ["Doxycycline Safety", "Pharmacology", "Infectious Diseases", "Broad tetracycline treating Chlamydia/PID, cholera, brucellosis, acne, & plague.", "Advise swallowing with full glass of water staying upright >= 30 minutes (prevents severe oesophageal pill ulcer!), photosensitivity sunscreen, & avoid in pregnancy / < 8 yrs."],
  ["Dry Powder Inhaler vs MDI Spacer", "Pharmacology", "Respiratory", "MDI requires coordinated slow actuation + breath-hold (greatly boosted using Spacer chamber cleanly); DPI demands quick deep sharp inhalation without spacer.", "Always rinse mouth and spit out AFTER steroid inhalers (Beclomethasone/Budesonide) to prevent oral Candidiasis thrush!"],
  ["Dysmenorrhoea (Primary vs Secondary)", "Midwifery & OB", "Gynaecology", "Primary = prostaglandin cramping right at menses onset without pelvic pathology (responds well to early Ibuprofen/Mefenamic acid); Secondary = progressive pain from endometriosis, fibroids, or chronic PID.", "Assess dyspareunia, fever, or abnormal bleeding patterns carefully."],
  ["Dysuria", "Assessment", "Renal / STI", "Painful burning stinging urination most frequently triggered by bacterial cystitis, urethritis STI (Chlamydia/Gonorrhoea), or local vulvovaginitis.", "Check urine dipstick nitrites/leukocytes, pregnancy status, and counsel completing full prescribed antibiotics."],
  ["Ebola / Marburg VHF Triad IPC", "Infectious Diseases", "Tropical / PHE", "Viral Haemorrhagic Fevers presenting with acute fever, severe diarrhoea/vomiting/weakness + unexplained bleeding after contact exposure.", "Immediately isolate suspect case cleanly, don full impermeable VHF PPE with trained buddy system, notify Surveillance team, avoid needle recapping."],
  ["Echocardiography", "Assessment", "Cardiovascular", "Painless cardiac ultrasound evaluating Ejection Fraction (Normal 55–70%), valve regurgitation/stenosis, vegetations, & pericardial effusion.", "Explain non-invasive gel ultrasound clearly to reduce patient procedure anxiety."],
  ["Electrolyte Balance (K+, Na+, Ca2+, Mg2+)", "Anatomy & Physiology", "Renal", "Primary cellular cations maintaining cardiac membrane excitability, osmotic fluid balance, and neuromuscular transmission.", "Always check serum Mg2+ alongside refractory low K+ or low Ca2+ — hypomagnesaemia blocks kidney potassium retention!"],
  ["Emphysema ('Pink Puffer')", "Medical-Surgical", "Respiratory", "Alveolar septal destruction trapping stale air -> barrel chest, prolonged pursed-lip exhalation, hyperresonant percussion, & severe dyspnoea.", "Teach Tripod leaning posture & pursed-lip breathing (prevents small airway collapse during exhalation)."],
  ["Encephalopathy (Hypertensive / Hepatic / HIE)", "Medical-Surgical", "Neurology", "Diffuse metabolic, hypoxic, or hypertensive brain dysfunction causing fluctuating confusion, asterixis, seizures, or lethargy.", "Identify and reverse acute precipitant immediately (BP drop, Lactulose/ammonia, O2/cooling)."],
  ["Endometritis (Postpartum)", "Midwifery & OB", "Obstetrics / IPC", "Ascending polymicrobial uterine lining infection days 2–10 post-delivery especially post-C-section or prolonged PROM -> fever, tender boggy subinvoluted uterus, foul lochia.", "Start broad IV Ampicillin + Gentamicin + Metronidazole until afebrile >= 24–48 hrs."],
  ["Erythropoietin (EPO)", "Anatomy & Physiology", "Renal / Haematology", "Renal peritubular hormone stimulating bone marrow red blood cell production during hypoxia.", "Explains why chronic kidney disease patients develop progressive normocytic anaemia requiring ESA + iron therapy."],
  ["Eschar & Escharotomy", "Emergency Care", "Burns / Surgery", "Leathery burnt inelastic dead skin ringing chest or limb tightly -> tourniquet compartment/breathing suffocation -> urgent bedside longitudinal surgical incision restoring circulation/ventilation.", "Always elevate burned extremities above heart and check Doppler distal pulses hourly for first 48 hrs."],
  ["Evisceration vs Amputation Stump Shrinker", "Medical-Surgical", "Surgery", "Post-amputation residual limb wrapped firmly in figure-of-8 elastic compression to shape conical stump & prevent swelling before prosthesis fitting.", "Prevent hip/knee flexion contractures by placing patient PRONE 20–30 min 2x/day (NEVER prop stump chronically on pillow!)."],
  ["Exudate vs Transudate (Pleural / Ascitic)", "Pathology & Lab", "Diagnostics", "Light's Criteria: Exudate = high protein/LDH inflammatory fluid (TB, pneumonia empyema, cancer); Transudate = low-protein hydrostatic fluid (heart failure, cirrhosis, nephrotic).", "Distinguishing exudate vs transudate directs right diagnosis cleanly before blind antibiotics."],
  ["Febrile Convulsions", "Paediatrics & IMCI", "Neurology / Paeds", "Benign brief generalized seizures in children 6 months–5 years triggered by rapid fever rise (commonly malaria/URTI/otitis) WITHOUT CNS meningitis infection.", "Keep child safe left lateral during fit, check RBG, control fever gently after fit resolves, and examine carefully to rule out meningitis/malaria."],
  ["Ferrous Sulfate & Oral Iron Absorption", "Pharmacology", "Haematology", "First-line oral iron supplementation restoring haemoglobin & ferritin stores over 3–6 months.", "Take with Vitamin C citrus water (enhances absorption cleanly — NEVER with milk, tea, antacids, or calcium!); warn black-green harmless stools & constipation."],
  ["Fetal Heart Rate (FHR) Accelerations & Decelerations", "Midwifery & OB", "Obstetrics", "Normal baseline 110–160 bpm. Early decels mirror contractions (head compression = benign); Variable decels sharp V/W (cord compression -> turn mother left lateral!); Late decels AFTER contraction peak (uteroplacental insufficiency -> RED ALERT!).", "For Late decelerations: turn left lateral, stop Oxytocin, give IV fluid bolus, apply O2, summon emergency obstetrician."],
  ["Fibrinogen & D-Dimer", "Pathology & Lab", "Haematology", "D-dimer rises sharply when crosslinked fibrin clots actively break down (sensitive screening rule-out for low-probability DVT/PE or active DIC).", "Low fibrinogen (< 1.5 g/L) during severe PPH flags critical DIC clotting exhaustion."],
  ["Flail Chest", "Emergency Care", "Respiratory / Trauma", "Fracture of >= 3 adjacent ribs in >= 2 places detaching a chest wall segment that sucks INWARD during inspiration ('paradoxical breathing').", "Give high-flow O2, effective analgesia (rib blocks/opioids), cautious IV fluid avoiding pulmonary contusion oedema, and prepare ventilator CPAP/intubation if tiring."],
  ["Folate Deficiency vs B12 (Pernicious)", "Pathology & Lab", "Haematology", "Both produce large macrocytic MCV > 100 fL megaloblastic anaemia + hypersegmented neutrophils; ONLY Vitamin B12 deficiency additionally damages dorsal columns causing peripheral paraesthesias & ataxia.", "NEVER give Folate alone to treat an undiagnosed macrocytic anaemia without checking B12 — haematology recovers while irreversible spinal nerve damage worsens!"],
  ["Fundal Height (Symphysis-Fundal Height)", "Midwifery & OB", "Obstetrics", "Centimetre tape distance from upper symphysis pubis to uterine top fundus between 20–36 wks closely matches gestational age in weeks (+/- 2 cm).", "Ask mother to empty bladder cleanly FIRST and measure along longitudinal uterine axis with centimetre marks facing downward first to prevent observer bias."],
  ["Furosemide (Lasix) Safe IV Push", "Pharmacology", "Cardiovascular / Renal", "Powerful loop diuretic clearing acute pulmonary oedema fluid overload rapidly.", "Inject slow IV (<= 20–40 mg/min) — rapid bolus high-dose IV Furosemide risks temporary or permanent deafness (ototoxicity)!"],
  ["Gastric Lavage Contraindications", "Emergency Care", "Toxicology", "Washout procedure strictly LIMITED today and CONTRAINDICATED after caustic acid/alkali bleach ingestion, petroleum/paraffin hydrocarbons, or unprotected airway coma (GCS <= 8).", "Think activated charcoal (only within 1 hour of adsorbable drugs with protected airway) or specific antidotes (NAC, Atropine, Naloxone)."],
  ["Gestational Diabetes Mellitus (GDM)", "Midwifery & OB", "Obstetrics / Endocrine", "Glucose intolerance diagnosed first in pregnancy risking fetal macrosomia (> 4 kg), shoulder dystocia, polyhydramnios, & newborn neonatal hypoglycaemia immediately at birth.", "Check neonate blood glucose at 1–2 hrs post-delivery and initiate immediate early feeding to prevent severe rebound neonatal hypoglycaemia."],
  ["Gingival Hyperplasia (Phenytoin / Nifedipine)", "Pharmacology", "Neurology / Dental", "Painless fibrous gum overgrowth encasing teeth triggered by Phenytoin, Cyclosporine, or Nifedipine.", "Teach thorough gentle twice-daily brushing, flossing, & routine dental cleanings rather than abrupt anti-epileptic stopping."],
  ["Glucagon Emergency Rescue", "Pharmacology", "Endocrine", "Pancreatic alpha-cell hormone mobilizing hepatic glycogen stores within 10–15 min when unconscious hypoglycaemic diabetics lack IV access.", "Note Glucagon FAILS in depleted glycogen states (alcoholics, starvation, severe liver cirrhosis) — give IV Dextrose directly instead; once conscious give oral complex carbs!"],
  ["Glucose Tolerance Test (OGTT)", "Pathology & Lab", "Endocrine", "75g fasting glucose challenge confirming Diabetes (2-hr >= 11.1 mmol/L) or Gestational Diabetes.", "Patient remains seated resting fasting cleanly throughout the 2-hour test window."],
  ["Glyceryl Trinitrate (GTN) Storage", "Pharmacology", "Cardiovascular", "Potent volatile sublingual coronary vasodilator breaking acute angina attacks within 2–3 min.", "Store strictly inside original dark amber glass bottle away from light/heat (replace every 8–12 weeks once opened); sit patient down first & check BP >= 90 SBP."],
  ["Graves' Disease", "Medical-Surgical", "Endocrine", "Autoimmune TSH-receptor antibodies hyperstimulating thyroid -> goitre bruit, weight loss with huge appetite, heat intolerance, fine tremor, & exophthalmos bulging eyes.", "Protect exposed bulging dry eyes cleanly at night with lubricating ointment/tape and watch for Thyroid Storm."],
  ["Haemarthrosis", "Medical-Surgical", "Haematology / Ortho", "Painful acute bleeding inside a joint capsule (knee/ankle/elbow) hallmark of severe Haemophilia A or B.", "Give clotting factor concentrate IMMEDIATELY (before ice/rest alone!), immobilize gently in mild flexion initially, NEVER use Aspirin."],
  ["Haemodialysis Fistula Protection", "Foundations of Nursing", "Renal", "Surgically joined forearm artery-to-vein conduit maturing for repetitive high-flow dialysis access.", "Feel smooth buzzing 'thrill' & auscultate 'bruit' every shift; NEVER measure blood pressure, draw blood, or insert IVs in that arm ('No BP/IV Arm Band')."],
  ["Haemoptysis vs Haematemesis", "Assessment", "Respiratory / GI", "Haemoptysis = coughing bright red FROTHY alkaline blood mixed with sputum (TB, bronchiectasis, PE, lung CA); Haematemesis = vomiting dark acid 'coffee-ground' or clotted blood mixed with food.", "Turn massive haemoptysis patient affected-lung-side DOWN immediately so blood doesn't flood the healthy lung!"],
  ["Haemorrhoids (Internal vs External)", "Medical-Surgical", "Gastrointestinal", "Engorged anal cushions from constipation, pregnancy, or portal hypertension causing bright painless toilet-bowl blood streaks.", "Prevent straining via high-fibre diet, 2 L fluids, bulk laxatives, and lukewarm sitz baths."],
  ["Heparin-Induced Thrombocytopaenia (HIT)", "Pharmacology", "Haematology", "Paradoxical immune prothrombotic reaction dropping platelets >= 50% days 5–10 on Heparin/LMWH -> deadly arterial/venous clots.", "Stop ALL heparins/LMWH flushes immediately if unexplained >50% platelet drop occurs; switch cleanly to non-heparin anticoagulant per haematology."],
  ["Hepatomegaly", "Assessment", "Gastrointestinal", "Enlarged palpable liver edge > 1–2 cm below right costal margin with increased span (> 12 cm) in hepatitis, heart failure congestion, malaria, or malignancy.", "Note sharp firm nodular edge vs smooth tender congestive edge in right-sided heart failure."],
  ["Hirsutism & PCOS", "Midwifery & OB", "Gynaecology / Endocrine", "Excess terminal androgen hair growth, irregular anovulatory cycles, acne, & insulin resistance in Polycystic Ovary Syndrome.", "Support compassionate lifestyle modification, weight balancing, & Metformin / fertility guidance cleanly."],
  ["Holter Monitor (24–48h Ambulatory ECG)", "Assessment", "Cardiovascular", "Portable wearable ECG capturing paroxysmal palpitations, syncope pauses, or transient AFib missed on 10-second clinic ECG.", "Instruct patient to keep clean diary log correlating exact clock time of symptoms (dizziness/palpitations) and avoid showering/wetting leads."],
  ["Hydralazine (Hypertensive Pregnancy Emergency)", "Pharmacology", "Midwifery & OB", "Direct arteriolar vasodilator given slow IV (5 mg bolus q20m max 20 mg) halting dangerous SBP >= 160 / DBP >= 110 in severe pre-eclampsia.", "Keep mother left lateral checking BP every 5–15 min & continuous FHR so sudden hypotension never starves placental blood flow."],
  ["Hydrocortisone Crisis Rule", "Pharmacology", "Endocrine", "Stress-dose glucocorticoid replacement saving Addison's / chronic steroid patients during acute sepsis, trauma, or surgery.", "NEVER abruptly discontinue long-term Prednisolone/Hydrocortisone (> 2 weeks) without slow physician-guided tapering to allow adrenal HPA recovery."],
  ["Hyperbilirubinaemia (Phototherapy Care)", "Paediatrics & IMCI", "Neonatal Care", "Blue-spectrum (450–470 nm) light isomerizing toxic insoluble unconjugated bilirubin inside newborn skin into water-soluble excretory isomers.", "Keep baby exposed cleanly EXCEPT opaque black/soft EYE SHIELDS & nappy; track hydration/temperature & turn off lights briefly ONLY for blood draws/parent bonding."],
  ["Hyperemesis Gravidarum", "Midwifery & OB", "Obstetrics", "Intractable severe pregnancy vomiting causing >= 5% pre-pregnancy weight loss, ketonuria, dehydration, & electrolyte imbalance (exclude Molar pregnancy / UTI / twins!).", "Rehydrate IV, give anti-emetics (Ondansetron/Metoclopramide) AND add Thiamine (Vitamin B1) cleanly to prevent fatal Wernicke's encephalopathy!"]
];

const EXTRA_ABBRS = [
  { abbr: "ABG", full: "Arterial Blood Gas" },
  { abbr: "ACEi", full: "Angiotensin-Converting Enzyme Inhibitor" },
  { abbr: "ACLS", full: "Advanced Cardiac Life Support" },
  { abbr: "ACT", full: "Artemisinin-based Combination Therapy" },
  { abbr: "ADH", full: "Antidiuretic Hormone (Vasopressin)" },
  { abbr: "AED", full: "Automated External Defibrillator" },
  { abbr: "AFB", full: "Acid-Fast Bacilli (Tuberculosis sputum microscopy)" },
  { abbr: "AKI", full: "Acute Kidney Injury" },
  { abbr: "ALP / ALT / AST", full: "Alkaline Phosphatase / Alanine & Aspartate Aminotransferases (LFTs)" },
  { abbr: "ANC / PNC", full: "Antenatal Care / Postnatal Care" },
  { abbr: "ANTT", full: "Aseptic Non-Touch Technique" },
  { abbr: "APH", full: "Antepartum Haemorrhage" },
  { abbr: "aPTT", full: "Activated Partial Thromboplastin Time" },
  { abbr: "ARDS", full: "Acute Respiratory Distress Syndrome" },
  { abbr: "ARM", full: "Artificial Rupture of Membranes (Amniotomy)" },
  { abbr: "ART", full: "Antiretroviral Therapy" },
  { abbr: "AVPU", full: "Alert, Voice, Pain, Unresponsive (Rapid Neuro Scale)" },
  { abbr: "BCG", full: "Bacillus Calmette-Guerin (TB Newborn Vaccine)" },
  { abbr: "BMI", full: "Body Mass Index (kg/m2)" },
  { abbr: "BP", full: "Blood Pressure (mmHg)" },
  { abbr: "BPH", full: "Benign Prostatic Hyperplasia" },
  { abbr: "BUN", full: "Blood Urea Nitrogen" },
  { abbr: "CBC / FBC", full: "Complete / Full Blood Count" },
  { abbr: "CC / CCT", full: "Controlled Cord Traction (AMTSL)" },
  { abbr: "CCF / CHF", full: "Congestive Cardiac / Heart Failure" },
  { abbr: "CEmONC", full: "Comprehensive Emergency Obstetric & Newborn Care" },
  { abbr: "CKD", full: "Chronic Kidney Disease" },
  { abbr: "CNS / PNS", full: "Central / Peripheral Nervous System" },
  { abbr: "CO / SV", full: "Cardiac Output / Stroke Volume" },
  { abbr: "COPD", full: "Chronic Obstructive Pulmonary Disease" },
  { abbr: "CPAP", full: "Continuous Positive Airway Pressure" },
  { abbr: "CPR", full: "Cardiopulmonary Resuscitation" },
  { abbr: "CrAg", full: "Cryptococcal Antigen Test (HIV / CSF)" },
  { abbr: "CRP", full: "C-Reactive Protein (Inflammatory Marker)" },
  { abbr: "CRT", full: "Capillary Refill Time (Normal <= 2 seconds)" },
  { abbr: "CSF", full: "Cerebrospinal Fluid" },
  { abbr: "CT / MRI", full: "Computed Tomography / Magnetic Resonance Imaging" },
  { abbr: "CVA", full: "Cerebrovascular Accident (Stroke)" },
  { abbr: "CXR", full: "Chest X-Ray / Radiograph" },
  { abbr: "DIC", full: "Disseminated Intravascular Coagulation" },
  { abbr: "DKA / HHS", full: "Diabetic Ketoacidosis / Hyperosmolar Hyperglycaemic State" },
  { abbr: "DM", full: "Diabetes Mellitus" },
  { abbr: "DOTS", full: "Directly Observed Treatment, Short-Course (TB)" },
  { abbr: "DVT / PE", full: "Deep Vein Thrombosis / Pulmonary Embolism" },
  { abbr: "ECG / EKG", full: "Electrocardiogram" },
  { abbr: "EDD", full: "Estimated Date of Delivery" },
  { abbr: "EEG", full: "Electroencephalogram" },
  { abbr: "EID", full: "Early Infant Diagnosis (HIV PCR)" },
  { abbr: "ENT", full: "Ear, Nose & Throat (Otorhinolaryngology)" },
  { abbr: "EPSE", full: "Extrapyramidal Side Effects" },
  { abbr: "ESR", full: "Erythrocyte Sedimentation Rate" },
  { abbr: "ETAT", full: "Emergency Triage Assessment and Treatment (Paediatrics)" },
  { abbr: "FHR", full: "Foetal Heart Rate (Normal 110–160 bpm)" },
  { abbr: "FiO2", full: "Fraction of Inspired Oxygen" },
  { abbr: "GFR", full: "Glomerular Filtration Rate" },
  { abbr: "GGT", full: "Gamma-Glutamyl Transferase" },
  { abbr: "GI", full: "Gastrointestinal" },
  { abbr: "GTN", full: "Glyceryl Trinitrate (Sublingual Angina Spray/Tablet)" },
  { abbr: "GTPAL", full: "Gravida, Term, Preterm, Abortion, Living Children" },
  { abbr: "HC III / IV", full: "Health Centre III / IV (Uganda Health Tier)" },
  { abbr: "HDL / LDL", full: "High- / Low-Density Lipoprotein Cholesterol" },
  { abbr: "HELLP", full: "Haemolysis, Elevated Liver Enzymes, Low Platelets" },
  { abbr: "HR", full: "Heart Rate (beats per minute)" },
  { abbr: "HTN", full: "Hypertension" },
  { abbr: "I&O", full: "Fluid Intake and Output Charting" },
  { abbr: "ICP", full: "Intracranial Pressure" },
  { abbr: "ICU / HDU", full: "Intensive Care Unit / High Dependency Unit" },
  { abbr: "IM / IV / SC", full: "Intramuscular / Intravenous / Subcutaneous" },
  { abbr: "IMCI", full: "Integrated Management of Childhood Illness" },
  { abbr: "INR", full: "International Normalized Ratio (Warfarin monitoring)" },
  { abbr: "IUD", full: "Intrauterine Contraceptive Device" },
  { abbr: "IUGR", full: "Intrauterine Growth Restriction" },
  { abbr: "JVP", full: "Jugular Venous Pressure" },
  { abbr: "KMC", full: "Kangaroo Mother Care" },
  { abbr: "LFTs / RFTs", full: "Liver / Renal Function Tests" },
  { abbr: "LP", full: "Lumbar Puncture" },
  { abbr: "MAP", full: "Mean Arterial Pressure" },
  { abbr: "MCV", full: "Mean Corpuscular Volume (fL)" },
  { abbr: "MDR-TB", full: "Multi-Drug Resistant Tuberculosis" },
  { abbr: "MEWS", full: "Modified Early Warning Score" },
  { abbr: "MI", full: "Myocardial Infarction" },
  { abbr: "MR", full: "Measles-Rubella Vaccine (UNEPI)" },
  { abbr: "MRSA", full: "Methicillin-Resistant Staphylococcus aureus" },
  { abbr: "NANDA", full: "North American Nursing Diagnosis Association" },
  { abbr: "NDA", full: "National Drug Authority (Uganda)" },
  { abbr: "NICU", full: "Neonatal Intensive Care Unit" },
  { abbr: "NSAID", full: "Non-Steroidal Anti-Inflammatory Drug" },
  { abbr: "OPD", full: "Outpatient Department" },
  { abbr: "OPV / IPV", full: "Oral / Inactivated Polio Vaccine" },
  { abbr: "ORIF", full: "Open Reduction and Internal Fixation (Ortho)" },
  { abbr: "OTC", full: "Over-The-Counter Medicine" },
  { abbr: "PCV", full: "Pneumococcal Conjugate Vaccine (or Packed Cell Volume)" },
  { abbr: "PEP", full: "Post-Exposure Prophylaxis (HIV / Rabies)" },
  { abbr: "PHC", full: "Primary Health Care" },
  { abbr: "PID", full: "Pelvic Inflammatory Disease" },
  { abbr: "PO / PR / PV", full: "Per Oral / Per Rectum / Per Vaginum" },
  { abbr: "PPE", full: "Personal Protective Equipment" },
  { abbr: "PPI", full: "Proton Pump Inhibitor (e.g. Omeprazole)" },
  { abbr: "PROM / PPROM", full: "Prelabour / Preterm Prelabour Rupture of Membranes" },
  { abbr: "PUD", full: "Peptic Ulcer Disease" },
  { abbr: "Q2H / Q4H / Q6H", full: "Every 2 / 4 / 6 Hours" },
  { abbr: "RA / OA", full: "Rheumatoid Arthritis / Osteoarthritis" },
  { abbr: "RBC / WBC", full: "Red Blood Cell / White Blood Cell" },
  { abbr: "RHD", full: "Rheumatic Heart Disease" },
  { abbr: "ROM", full: "Range of Motion (or Rupture of Membranes)" },
  { abbr: "RR", full: "Respiratory Rate (breaths per minute)" },
  { abbr: "RTA", full: "Road Traffic Accident / Crash" },
  { abbr: "RUQ / LUQ", full: "Right / Left Upper Abdominal Quadrant" },
  { abbr: "RLQ / LLQ", full: "Right / Left Lower Abdominal Quadrant" },
  { abbr: "SBP / DBP", full: "Systolic / Diastolic Blood Pressure" },
  { abbr: "SCD", full: "Sickle Cell Disease" },
  { abbr: "SOB", full: "Shortness of Breath (Dyspnoea)" },
  { abbr: "STI", full: "Sexually Transmitted Infection" },
  { abbr: "TLD", full: "Tenofovir + Lamivudine + Dolutegravir (1st-line ART)" },
  { abbr: "TSH", full: "Thyroid-Stimulating Hormone" },
  { abbr: "TT", full: "Tetanus Toxoid Vaccine" },
  { abbr: "UNEPI", full: "Uganda National Expanded Programme on Immunisation" },
  { abbr: "URTI / LRTI", full: "Upper / Lower Respiratory Tract Infection" },
  { abbr: "V/Q", full: "Ventilation-Perfusion Ratio" },
  { abbr: "VBAC", full: "Vaginal Birth After Caesarean" },
  { abbr: "VHT", full: "Village Health Team (Uganda Community Health)" },
  { abbr: "VIP Score", full: "Visual Infusion Phlebitis Score" },
  { abbr: "VVF / RVF", full: "Vesicovaginal / Rectovaginal Fistula" },
  { abbr: "VVM", full: "Vaccine Vial Monitor (Heat-exposure square)" },
  { abbr: "WASH", full: "Water, Sanitation, and Hygiene" },
  { abbr: "WHO", full: "World Health Organization" }
];

function cleanTopicHeadword(rawTitle) {
  let s = String(rawTitle || "").trim();
  // Strip leading unit numbering like "1.1 ", "Module 2: ", "Chapter 3 - "
  s = s.replace(/^(?:module|unit|chapter|part|lesson|topic)\s+\d+[:.\-\s]+/i, "");
  s = s.replace(/^\d+(?:\.\d+)*[:.\-\s]+/, "");
  s = s.replace(/^introduction\s+to\s+/i, "");
  s = s.replace(/:\s*$/, "").trim();
  // Keep titles starting cleanly with A-Z letter
  if (!/^[A-Za-z]/.test(s) || s.length < 4 || s.length > 78) return "";
  // Exclude generic non-clinical titles
  if (/^(overview|summary|references|assessment|conclusion|learning\s+outcomes|study\s+wrap|welcome|syllabus|course\s+guide|clinical\s+lens)/i.test(s)) {
    return "";
  }
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function normalizeSentence(str, maxLen = 220) {
  const s = String(str || "").replace(/\*\*/g, "").replace(/\s+/g, " ").trim();
  if (!s) return "";
  if (s.length <= maxLen) return s;
  return s.slice(0, maxLen - 1).replace(/\s+\S*$/, "") + ".";
}

function mapCategory(courseCat = "") {
  const c = courseCat.toLowerCase();
  if (c.includes("pharmac")) return ["Pharmacology", "Medication Therapy"];
  if (c.includes("midwifery") || c.includes("maternal")) return ["Midwifery & OB", "Maternal / Neonatal"];
  if (c.includes("paediat")) return ["Paediatrics & IMCI", "Child Health"];
  if (c.includes("anatomy")) return ["Anatomy & Physiology", "Human Structure"];
  if (c.includes("mental")) return ["Mental Health", "Psychosocial Care"];
  if (c.includes("community")) return ["Infectious Diseases", "Community Health"];
  if (c.includes("leadership") || c.includes("research")) return ["Assessment & Procedures", "Clinical Practice"];
  if (c.includes("foundations")) return ["Foundations of Nursing", "Bedside Care"];
  return ["Medical-Surgical", "Clinical Pathology"];
}

function defaultClinicalPriority(cat) {
  switch (cat) {
    case "Pharmacology":
      return "Verify 10 Rights of Drug Administration, allergies, weight/renal dosage checks, and vital-sign parameters before every dose.";
    case "Midwifery & OB":
      return "Monitor maternal vital signs, fetal heart rate, uterine tone, and bleeding status closely under WHO & Uganda MoH maternal standards.";
    case "Paediatrics & IMCI":
      return "Screen early for IMCI red-flag danger signs, hydration status, weight-based dosing, capillary glucose, and UNEPI immunization records.";
    case "Anatomy & Physiology":
      return "Connect anatomical structure directly to physical assessment landmarks, organ perfusion, and bedside clinical abnormalities.";
    case "Mental Health":
      return "Ensure therapeutic rapport, immediate safety/suicide screening, extrapyramidal medication monitoring, and caregiver psychoeducation.";
    case "Infectious Diseases":
      return "Enforce strict Infection Prevention & Control (IPC), specimen collection prior to antimicrobials, and Uganda Clinical Guidelines completion.";
    default:
      return "Assess ABCDE & vital trends systematically, identify early red-flag deterioration, document clearly, and initiate priority nursing interventions.";
  }
}

function main() {
  const existing = JSON.parse(fs.readFileSync(DATA_PATH, "utf8"));
  const termMap = new Map();

  const addTerm = (entry) => {
    const baseKey = entry.term.toLowerCase().replace(/\s+/g, " ").trim();
    const shortKey = baseKey.replace(/\s*\([^)]*\)/g, "").trim();
    if (!baseKey || termMap.has(baseKey)) return;
    // Also skip near-identical existing term without parenthetical
    for (const k of termMap.keys()) {
      if (k.replace(/\s*\([^)]*\)/g, "").trim() === shortKey) return;
    }
    termMap.set(baseKey, {
      id: slugify(entry.term),
      slug: slugify(entry.term),
      partOfSpeech: "noun",
      difficulty: entry.difficulty || "Intermediate",
      ...entry
    });
  };

  // 1. Keep existing curated terms first
  for (const t of existing.terms || []) {
    addTerm(t);
  }

  // 2. Add curated clinical A–Z terms
  for (const [term, category, bodySystem, simpleDefinition, clinicalContext] of CURATED_MEDICAL_PAIRS) {
    addTerm({
      term,
      category,
      bodySystem,
      difficulty: "Intermediate",
      simpleDefinition,
      definition: simpleDefinition,
      clinicalContext
    });
  }

  // 3. Extract canonical clinical topics & definitions from all 95 course units
  if (fs.existsSync(COURSES_DIR)) {
    const files = fs.readdirSync(COURSES_DIR).filter((f) => f.endsWith(".json")).sort();
    for (const file of files) {
      const course = JSON.parse(fs.readFileSync(path.join(COURSES_DIR, file), "utf8"));
      const [dictCat, bodySys] = mapCategory(course.category);
      for (const lesson of Object.values(course.lessons || {})) {
        const cleanName = cleanTopicHeadword(lesson.title);
        if (!cleanName) continue;

        let defText = normalizeSentence(lesson.excerpt || "", 210);
        // Find real clinical sentence inside first non-outcome section if excerpt is generic template text
        if (!defText || /explained as original nursing uganda/i.test(defText)) {
          for (const sec of lesson.sections || []) {
            if (/outcome|reference/i.test(sec.title || "")) continue;
            const b = (sec.blocks || []).find((x) => (x.text || "").length > 35);
            if (b?.text) {
              defText = normalizeSentence(b.text, 220);
              break;
            }
          }
        }
        if (!defText || defText.length < 28) continue;

        // Grab an authentic nursing management / priority sentence from lesson sections if available
        let priorityText = defaultClinicalPriority(dictCat);
        const mgmtSec = (lesson.sections || []).find((s) =>
          /management|nursing|assessment|treatment|prevention|complication|priority|danger/i.test(s.title || "")
        );
        if (mgmtSec) {
          const mb = (mgmtSec.blocks || []).find((x) => (x.text || "").length > 32);
          if (mb?.text) priorityText = normalizeSentence(mb.text, 220);
        }

        addTerm({
          term: cleanName,
          category: dictCat,
          bodySystem: bodySys,
          simpleDefinition: defText,
          definition: `${defText} (${course.title} curriculum concept).`,
          clinicalContext: priorityText
        });
      }
    }
  }

  // 4. Include clinical instruments & diagnostic equipment from medical-instruments.json
  if (fs.existsSync(INST_PATH)) {
    const instJson = JSON.parse(fs.readFileSync(INST_PATH, "utf8"));
    for (const catObj of instJson.categories || []) {
      const arr = Object.values(catObj).find((v) => Array.isArray(v)) || [];
      for (const item of arr) {
        const name = cleanTopicHeadword(item.name || item.title);
        if (!name) continue;
        const uses = normalizeSentence(item.uses || item.description || item.summary || "", 220);
        if (!uses || uses.length < 25) continue;
        addTerm({
          term: name,
          category: "Assessment & Procedures",
          bodySystem: catObj.title || "Clinical Equipment",
          simpleDefinition: uses,
          definition: `${uses} Classified under ${catObj.title || "Nursing & Surgical Instruments"}.`,
          clinicalContext: normalizeSentence(item.safety || item.cleaning || item.nursingCare || "Verify functional integrity, sterility/calibration, and correct clinical sizing prior to patient use.", 210)
        });
      }
    }
  }

  // Abbreviations merge
  const abbrMap = new Map();
  for (const a of existing.abbreviations || []) {
    abbrMap.set(a.abbr.toUpperCase().trim(), a);
  }
  for (const a of EXTRA_ABBRS) {
    const k = a.abbr.toUpperCase().trim();
    if (!abbrMap.has(k)) abbrMap.set(k, a);
  }

  const finalTerms = [...termMap.values()].sort((a, b) => a.term.localeCompare(b.term));
  const finalAbbr = [...abbrMap.values()].sort((a, b) => a.abbr.localeCompare(b.abbr));

  const out = {
    ...existing,
    updatedAt: new Date().toISOString(),
    terms: finalTerms,
    abbreviations: finalAbbr
  };
  fs.writeFileSync(DATA_PATH, JSON.stringify(out, null, 2), "utf8");

  const letters = {};
  for (const t of finalTerms) {
    const ch = (t.term[0] || "?").toUpperCase();
    letters[ch] = (letters[ch] || 0) + 1;
  }
  console.log(JSON.stringify({
    ok: true,
    totalTerms: finalTerms.length,
    totalAbbreviations: finalAbbr.length,
    lettersCount: Object.keys(letters).length,
    lettersCovered: Object.keys(letters).sort().join(""),
    missingAZ: "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").filter((l) => !letters[l])
  }, null, 2));
}

main();
