/**
 * Enrich assets/data/dictionary.json to full A-Z coverage (155+ clinical nursing/midwifery terms)
 * and 70+ essential Uganda hospital ward abbreviations.
 */
const fs = require("node:fs");
const path = require("node:path");

const DATA_PATH = path.resolve(__dirname, "..", "assets", "data", "dictionary.json");

const NEW_TERMS = [
  {
    term: "Abruptio Placentae (Placental Abruption)",
    pronunciation: "ab-RUP-shee-oh plah-SEN-tee",
    category: "Midwifery & OB",
    bodySystem: "Reproductive",
    difficulty: "Intermediate",
    simpleDefinition: "Premature separation of a normally implanted placenta from the uterine wall after 20 weeks gestation.",
    definition: "An obstetric emergency presenting with painful dark vaginal bleeding, tense 'woody' tender uterus, uterine hypertonus, and acute foetal distress or demise.",
    clinicalContext: "NEVER perform digital vaginal examination until placenta praevia is excluded; establish two wide-bore 16G/18G IV lines, cross-match blood urgently, and prepare for emergency delivery.",
    mnemonics: "Abruption = Acute painful + Board-like uterus."
  },
  {
    term: "Anaphylaxis",
    pronunciation: "an-uh-fih-LAK-sis",
    category: "Emergency Care",
    bodySystem: "Immune / Respiratory",
    difficulty: "Intermediate",
    simpleDefinition: "Rapid, life-threatening systemic allergic reaction causing airway swelling and severe hypotension.",
    definition: "Type I IgE-mediated hypersensitivity reaction triggering massive mast cell degranulation, bronchospasm, laryngeal oedema, urticaria, and distributive shock.",
    clinicalContext: "IMMEDIATE FIRST-LINE: Adrenaline (Epinephrine) 1:1000 — 0.5 mg (0.5 mL) IM into anterolateral thigh (paediatric 0.01 mg/kg), lay patient flat with legs elevated, high-flow oxygen, and IV Normal Saline.",
    mnemonics: "ABCDE + Adrenaline IM Outer Thigh FIRST (never wait for antihistamine)."
  },
  {
    term: "Apgar Score",
    pronunciation: "AP-gar",
    category: "Midwifery & Paediatrics",
    bodySystem: "Neonatal",
    difficulty: "Beginner",
    simpleDefinition: "Standardized 0–10 newborn vitality score checked at 1 and 5 minutes after birth.",
    definition: "Evaluates Appearance (colour), Pulse (heart rate), Grimace (reflex irritability), Activity (muscle tone), and Respiration — each scored 0, 1, or 2.",
    clinicalContext: "Never delay resuscitation to calculate the 1-minute Apgar score; begin drying, stimulation, and bag-valve-mask ventilation immediately if baby is apnoeic or gasping.",
    mnemonics: "A-P-G-A-R: Appearance, Pulse, Grimace, Activity, Respiration (7–10 Normal)."
  },
  {
    term: "Ascites",
    pronunciation: "uh-SY-teez",
    category: "Medical-Surgical",
    bodySystem: "Gastrointestinal",
    difficulty: "Intermediate",
    simpleDefinition: "Abnormal accumulation of serous fluid within the peritoneal cavity.",
    definition: "Commonly caused by portal hypertension in liver cirrhosis, nephrotic syndrome, right heart failure, tuberculous peritonitis, or intra-abdominal malignancy.",
    clinicalContext: "Measure daily abdominal girth at the umbilicus and daily morning weight; monitor respiratory distress and electrolytes on spironolactone + furosemide or therapeutic paracentesis."
  },
  {
    term: "Bradycardia",
    pronunciation: "brad-ee-KAR-dee-uh",
    category: "Assessment",
    bodySystem: "Cardiovascular",
    difficulty: "Beginner",
    simpleDefinition: "Abnormally slow resting heart rate below 60 beats per minute in adults.",
    definition: "Can result from vagal stimulation, beta-blocker or digoxin toxicity, hypothyroidism, inferior MI, sick sinus syndrome, or increased intracranial pressure (Cushing's reflex).",
    clinicalContext: "Always hold digoxin or beta-blockers if adult HR < 60 bpm per facility protocol and assess blood pressure, dizziness, or syncope urgently."
  },
  {
    term: "Bronchodilator",
    pronunciation: "brong-koh-dy-LAY-ter",
    category: "Pharmacology",
    bodySystem: "Respiratory",
    difficulty: "Beginner",
    simpleDefinition: "Medication that relaxes bronchial smooth muscle to open constricted airways.",
    definition: "Includes short-acting beta-2 agonists (Salbutamol), anticholinergics (Ipratropium), and methylxanthines (Aminophylline) used in asthma and COPD exacerbations.",
    clinicalContext: "Deliver short-acting Salbutamol FIRST before inhaled corticosteroids so bronchodilation opens airways cleanly; monitor heart rate for tachycardia and tremors."
  },
  {
    term: "Cardiogenic Shock",
    pronunciation: "kar-dee-oh-JEN-ik",
    category: "Emergency Care",
    bodySystem: "Cardiovascular",
    difficulty: "Advanced",
    simpleDefinition: "Critical drop in cardiac output caused by acute pump failure of the heart muscle.",
    definition: "Occurs after extensive myocardial infarction, myocarditis, or severe arrhythmias leading to hypotension (<90 mmHg SBP), cold clammy skin, oliguria, and pulmonary congestion.",
    clinicalContext: "Avoid rapid large IV fluid boluses unless preload-depleted because over-hydration worsens pulmonary oedema; monitor urine output hourly (<0.5 mL/kg/hr alert)."
  },
  {
    term: "Chorioamnionitis",
    pronunciation: "kor-ee-oh-am-nee-oh-NY-tis",
    category: "Midwifery & OB",
    bodySystem: "Reproductive",
    difficulty: "Intermediate",
    simpleDefinition: "Bacterial infection of the foetal membranes (chorion and amnion) and amniotic fluid.",
    definition: "Presents during pregnancy or labour with maternal fever (>=38 C), maternal/foetal tachycardia, uterine tenderness, and foul-smelling amniotic fluid.",
    clinicalContext: "Limit unnecessary repeated vaginal exams after membrane rupture; start broad-spectrum IV antibiotics per Uganda MoH guidelines and expedite safe delivery."
  },
  {
    term: "Cyanosis",
    pronunciation: "sy-uh-NOH-sis",
    category: "Assessment",
    bodySystem: "Respiratory / Cardiovascular",
    difficulty: "Beginner",
    simpleDefinition: "Bluish discolouration of skin or mucous membranes caused by low blood oxygen levels.",
    definition: "Central cyanosis (tongue, lips, buccal mucosa) indicates systemic hypoxaemia (>5 g/dL deoxygenated haemoglobin); peripheral cyanosis affects cold digits/nailbeds.",
    clinicalContext: "Examine the tongue and inner lip under bright daylight in dark-skinned patients; hypoxia may appear before cyanosis in severe anaemia—always verify with SpO2."
  },
  {
    term: "Dehydration (Plan A/B/C)",
    pronunciation: "dee-hy-DRAY-shun",
    category: "Paediatrics",
    bodySystem: "Fluid & Electrolytes",
    difficulty: "Beginner",
    simpleDefinition: "Loss of total body water and electrolytes exceeding intake, risking hypovolaemic shock in children.",
    definition: "WHO classifies paediatric diarrhoea into No Dehydration (Plan A: home ORS + Zinc), Some Dehydration (Plan B: 75 mL/kg ORS over 4 hrs), and Severe Dehydration (Plan C: IV Ringer's Lactate 100 mL/kg).",
    clinicalContext: "Assess sunken eyes, skin pinch elasticity, lethargy, and drinking ability; note Severe Acute Malnutrition children receive ReSoMal cautiously instead of rapid IV boluses."
  },
  {
    term: "Diabetic Ketoacidosis (DKA)",
    pronunciation: "kee-toh-ass-ih-DOH-sis",
    category: "Emergency Care",
    bodySystem: "Endocrine",
    difficulty: "Intermediate",
    simpleDefinition: "Life-threatening triad of hyperglycaemia, metabolic acidosis, and ketonaemia in insulin deficiency.",
    definition: "Triggers osmotic diuresis, severe dehydration, Kussmaul deep rapid breathing, fruity acetone breath, abdominal pain, and potassium shifts.",
    clinicalContext: "Priority sequence: 1) IV 0.9% Normal Saline resuscitation FIRST, 2) Fixed-rate IV Soluble Insulin infusion, 3) Monitor serum K+ closely BEFORE and DURING insulin therapy to avoid fatal hypokalaemia."
  },
  {
    term: "Dyspnoea",
    pronunciation: "disp-NEE-uh",
    category: "Assessment",
    bodySystem: "Respiratory",
    difficulty: "Beginner",
    simpleDefinition: "Subjective uncomfortable sensation of shortness of breath or laboured breathing.",
    definition: "Observed alongside nasal flaring, intercostal indrawing, tripod posturing, or accessory muscle usage across pneumonia, heart failure, asthma, and anaemia.",
    clinicalContext: "Place patient upright in High-Fowler's position, measure respiratory rate, auscultate lung fields, check SpO2, and escalate any drop <92%."
  },
  {
    term: "Eclampsia",
    pronunciation: "ih-KLAMP-see-uh",
    category: "Midwifery & Emergency",
    bodySystem: "Neurological / Reproductive",
    difficulty: "Intermediate",
    simpleDefinition: "New-onset generalized tonic-clonic seizures or coma in a woman with pre-eclampsia.",
    definition: "Occurs antenatally, intrapartum, or up to 6 weeks postpartum due to severe cerebral vasospasm, endothelial dysfunction, and hypertensive encephalopathy.",
    clinicalContext: "Uganda MoH first-line drug of choice: Magnesium Sulphate (MgSO4 — 4 g IV loading + 10 g IM Pritchard regimen). Keep calcium gluconate 10% (1 g IV) at bedside and check RR >=16, urine output >=30 mL/hr, and patellar reflexes before every maintenance dose.",
    mnemonics: "4g IV + 10g IM Pritchard -> Check Knees, Urine, Breaths!"
  },
  {
    term: "Embolism (Pulmonary Embolism)",
    pronunciation: "EM-boh-liz-um",
    category: "Emergency Care",
    bodySystem: "Cardiovascular / Respiratory",
    difficulty: "Advanced",
    simpleDefinition: "Sudden blockage of a pulmonary artery by a travelling blood clot, air bubble, or fat globule.",
    definition: "Usually originates from deep vein thrombosis (DVT) in legs/pelvis, producing sudden pleuritic chest pain, acute dyspnoea, tachycardia, and haemoptysis.",
    clinicalContext: "Encourage early ambulation post-surgery and caesarean section; keep high-risk surgical/immobilized patients hydrated and administer prescribed LMWH prophylaxis."
  },
  {
    term: "Endocarditis (Infective)",
    pronunciation: "en-doh-kar-DY-tis",
    category: "Medical-Surgical",
    bodySystem: "Cardiovascular",
    difficulty: "Advanced",
    simpleDefinition: "Microbial infection and vegetation growth on the inner lining and valves of the heart.",
    definition: "Complicates rheumatic heart disease, congenital valve defects, or unsterile IV access; causes prolonged fever, new regurgitant murmurs, splenomegaly, and embolic lesions.",
    clinicalContext: "Collect THREE sets of sterile blood cultures from separate venepuncture sites BEFORE starting IV antibiotics; strict aseptic IV line care is mandatory."
  },
  {
    term: "Febrile Convulsion",
    pronunciation: "FEE-bryle kon-VUL-shun",
    category: "Paediatrics",
    bodySystem: "Neurological",
    difficulty: "Intermediate",
    simpleDefinition: "Seizure triggered by a rapid spike in fever in children typically aged 6 months to 5 years.",
    definition: "Simple febrile seizures are generalized, last under 15 minutes, and do not recur within 24 hours; malaria, URTI, otitis media, or UTI are common triggers in Uganda.",
    clinicalContext: "Protect head, turn child to left-lateral recovery position, do NOT force anything into the mouth, give rectal Diazepam 0.5 mg/kg if >5 minutes, and evaluate urgently to rule out meningitis and severe malaria."
  },
  {
    term: "Fistula (Obstetric Vesicovaginal)",
    pronunciation: "FIS-tyoo-luh",
    category: "Midwifery & OB",
    bodySystem: "Reproductive / Urinary",
    difficulty: "Intermediate",
    simpleDefinition: "Abnormal opening between bladder and vagina caused by prolonged obstructed labour.",
    definition: "Ischaemic necrosis from sustained foetal head compression destroys pelvic tissues, resulting in continuous uncontrollable leakage of urine per vaginum and skin excoriation.",
    clinicalContext: "Prevention via early partograph monitoring and timely Caesarean section; post-repair nursing demands continuous bladder drainage (Foley catheter strictly patent for 14–21 days) and strict fluid intake >=3 L/day."
  },
  {
    term: "Glasgow Coma Scale (GCS)",
    pronunciation: "GLAS-goh KOH-muh skayl",
    category: "Assessment",
    bodySystem: "Neurological",
    difficulty: "Beginner",
    simpleDefinition: "Standardized 3–15 point neurological scale assessing Eye opening, Verbal response, and Motor response.",
    definition: "Scores Eye (1–4), Verbal (1–5), and Motor (1–6). GCS <=8 indicates severe coma and inability to protect the airway.",
    clinicalContext: "'GCS 8 or less — Intubate / Secure Airway!' Always record component breakdown (e.g., E3 V4 M6 = 13/15) rather than only a total sum, and escalate any drop >=2 points immediately.",
    mnemonics: "Eyes 4, Verbal 5, Motor 6 = 15 max (8 or less = Coma)."
  },
  {
    term: "Glycosuria",
    pronunciation: "gly-koh-SYOOR-ee-uh",
    category: "Assessment",
    bodySystem: "Endocrine / Renal",
    difficulty: "Beginner",
    simpleDefinition: "Presence of measurable glucose in urine when blood sugar exceeds renal threshold (~10 mmol/L).",
    definition: "Detected cleanly via urine reagent dipstick strips; hallmark screening finding in uncontrolled diabetes mellitus, gestational diabetes, or renal tubular dysfunction.",
    clinicalContext: "Any positive urine glucose must be followed with capillary random/fasting blood glucose testing and dipstick ketones check."
  },
  {
    term: "Gravida & Parity (GTPAL)",
    pronunciation: "GRAV-ih-duh & PAIR-ih-tee",
    category: "Midwifery & OB",
    bodySystem: "Reproductive",
    difficulty: "Beginner",
    simpleDefinition: "Obstetric shorthand recording total pregnancies (Gravida) and viable births >=28 weeks (Parity).",
    definition: "In Uganda's obstetric practice, viability is conventionally counted from 28 weeks gestation (or >1000 g); e.g., G3P2+0 means 3 pregnancies, 2 deliveries >=28 wks, 0 abortions/losses.",
    clinicalContext: "Grand multiparity (>=5 deliveries) carries elevated risk of uterine atony, malpresentation, and postpartum haemorrhage—actively prepare AMTSL and uterotonics."
  },
  {
    term: "Haemoptysis",
    pronunciation: "hee-MOP-tih-sis",
    category: "Assessment",
    bodySystem: "Respiratory",
    difficulty: "Intermediate",
    simpleDefinition: "Coughing up blood or blood-stained sputum from the lower respiratory tract.",
    definition: "Key red-flag symptom in Pulmonary Tuberculosis (PTB), bronchiectasis, lung abscess, pulmonary embolism, or mitral stenosis; distinct from haematemesis (vomited GI blood).",
    clinicalContext: "Initiate airborne/droplet respiratory isolation precautions immediately if chronic cough >2 weeks + weight loss/night sweats is present, and send sputum GeneXpert / AFB."
  },
  {
    term: "Haemorrhage (Postpartum — PPH)",
    pronunciation: "HEM-uh-rij",
    category: "Midwifery & Emergency",
    bodySystem: "Cardiovascular / Reproductive",
    difficulty: "Intermediate",
    simpleDefinition: "Blood loss >=500 mL after vaginal delivery or >=1000 mL after Caesarean section.",
    definition: "Leading cause of maternal mortality worldwide; driven by the '4 Ts': Tone (uterine atony ~70%), Trauma (cervical/vaginal tears), Tissue (retained placenta), and Thrombin (coagulopathy).",
    clinicalContext: "Act immediately: Call for help, bimanual/fundal uterine massage, Oxytocin 10 IU IM/IV + 20–40 IU infusion, empty bladder, inspect tears, give Tranexamic acid 1 g IV within 3 hours.",
    mnemonics: "4 Ts of PPH: Tone, Trauma, Tissue, Thrombin."
  },
  {
    term: "Hyperkalaemia",
    pronunciation: "hy-per-kuh-LEE-mee-uh",
    category: "Medical-Surgical",
    bodySystem: "Renal / Cardiovascular",
    difficulty: "Advanced",
    simpleDefinition: "Dangerously elevated serum potassium above 5.5 mmol/L risking fatal cardiac arrest.",
    definition: "Common in acute kidney injury (AKI), severe burns/crush trauma, DKA before therapy, or ACE-inhibitor overuse; ECG shows tall peaked T-waves and widened QRS.",
    clinicalContext: "Immediate cardiac membrane protection uses IV Calcium Gluconate 10% (10 mL slow IV over 3–5 min), followed by Insulin-Dextrose infusion to shift K+ intracellularly."
  },
  {
    term: "Hypoglycaemia",
    pronunciation: "hy-poh-gly-SEE-mee-uh",
    category: "Emergency Care",
    bodySystem: "Endocrine / Neurological",
    difficulty: "Beginner",
    simpleDefinition: "Dangerously low blood glucose (<3.9 mmol/L in diabetics, <2.5 mmol/L in severe malaria/paediatrics).",
    definition: "Triggers autonomic signs (sweating, palpitations, tremor, hunger) progressing swiftly to neuroglycopenia (confusion, convulsions, coma) especially with Quinine/Artesunate or Insulin therapy.",
    clinicalContext: "Check capillary blood glucose in EVERY confused or convulsing patient immediately. Give 50% Dextrose 50 mL IV in adults (or 10% Dextrose 2–5 mL/kg IV in children) if unconscious.",
    mnemonics: "Cold & clammy -> Give sugar candy (Oral 15g) or IV Dextrose if drowsy!"
  },
  {
    term: "Hypovolaemic Shock",
    pronunciation: "hy-poh-voh-LEE-mik",
    category: "Emergency Care",
    bodySystem: "Cardiovascular",
    difficulty: "Intermediate",
    simpleDefinition: "Acute inadequate organ perfusion from rapid loss of circulating blood or plasma volume.",
    definition: "Triggered by trauma bleeding, ruptured ectopic pregnancy, PPH, burns, or cholera diarrhoea; shows tachycardia FIRST before late blood pressure drop, capillary refill >3 s, and oliguria.",
    clinicalContext: "Tachycardia and cool extremities appear BEFORE hypotension; insert two large-bore 16G/18G cannulae, raise legs, infuse warm Ringer's Lactate or cross-matched blood."
  },
  {
    term: "Icterus",
    pronunciation: "IK-ter-us",
    category: "Assessment",
    bodySystem: "Hepatic / Eyes",
    difficulty: "Beginner",
    simpleDefinition: "Yellowish staining of the sclerae (whites of the eyes) and mucous membranes due to hyperbilirubinaemia.",
    definition: "Typically becomes clinically detectable in sclerae when total serum bilirubin exceeds ~35–50 micromol/L in hepatitis, malaria haemolysis, or biliary obstruction.",
    clinicalContext: "Always inspect sclerae in natural daylight rather than dim yellow ward bulbs; pair with checking urine colour (dark tea-like) and stool colour (pale/clay in obstruction)."
  },
  {
    term: "Intussusception",
    pronunciation: "in-tuh-suh-SEP-shun",
    category: "Paediatrics & Surgery",
    bodySystem: "Gastrointestinal",
    difficulty: "Advanced",
    simpleDefinition: "Telescoping of one proximal segment of bowel inside an adjacent distal segment causing obstruction.",
    definition: "Classic paediatric surgical emergency (ages 3–24 months) presenting with intermittent severe colicky crying, drawing knees up, vomiting, 'red currant jelly' mucoid bloody stool, and sausage-shaped RUQ mass.",
    clinicalContext: "Keep strictly Nil By Mouth (NBM), insert NG decompression tube, hydrate IV, and refer immediately to surgical theatre for hydrostatic reduction or laparotomy."
  },
  {
    term: "Jaundice (Neonatal)",
    pronunciation: "JAWN-dis",
    category: "Paediatrics & Midwifery",
    bodySystem: "Hepatic / Neurological",
    difficulty: "Intermediate",
    simpleDefinition: "Yellow skin and eye discolouration in newborns from elevated unconjugated or conjugated bilirubin.",
    definition: "Physiological jaundice starts AFTER 24 hours of life; jaundice appearing within the FIRST 24 HOURS is ALWAYS pathological (ABO/Rh incompatibility, G6PD, sepsis) and risks kernicterus brain damage.",
    clinicalContext: "Any jaundice within 24 hours of birth or reaching palms/soles is an EMERGENCY requiring serum bilirubin check and immediate phototherapy with eye shields + extra hydration."
  },
  {
    term: "Jugular Venous Pressure (JVP)",
    pronunciation: "JUG-yoo-ler VEE-nus PRESH-er",
    category: "Assessment",
    bodySystem: "Cardiovascular",
    difficulty: "Intermediate",
    simpleDefinition: "Clinical bedside estimate of right atrial pressure observed via internal jugular vein pulsations.",
    definition: "Measured with patient resting comfortably at 45 degrees elevation; normal vertical height is <=3–4 cm above the sternal angle of Louis.",
    clinicalContext: "Elevated JVP flags right-sided heart failure, fluid overload during IV therapy, tension pneumothorax, or cardiac tamponade—slow IV fluids immediately and notify clinician."
  },
  {
    term: "Kernicterus",
    pronunciation: "ker-NIK-ter-us",
    category: "Paediatrics",
    bodySystem: "Neurological",
    difficulty: "Advanced",
    simpleDefinition: "Irreversible bilirubin encephalopathy causing permanent brain injury in severely jaundiced newborns.",
    definition: "Unconjugated lipid-soluble bilirubin crosses the immature neonatal blood-brain barrier and deposits in basal ganglia, producing high-pitched cry, opisthotonus (arched back), hypotonia, and deafness/cerebral palsy.",
    clinicalContext: "Preventable through early phototherapy screening and exchange blood transfusion thresholds; monitor poor feeding and lethargy in all jaundiced neonates."
  },
  {
    term: "Koplik Spots",
    pronunciation: "KOP-lik spots",
    category: "Community & Paediatrics",
    bodySystem: "Integumentary / Immune",
    difficulty: "Intermediate",
    simpleDefinition: "Tiny bluish-white grain-of-salt lesions on bright red buccal mucosa — pathognomonic of Measles.",
    definition: "Appear inside the mouth opposite the upper molar teeth 1–2 days BEFORE the generalized maculopapular measles rash erupts alongside coryza, cough, and conjunctivitis.",
    clinicalContext: "Early recognition triggers strict airborne isolation, Vitamin A supplementation (2 doses per Uganda MoH), and public health surveillance reporting."
  },
  {
    term: "Kussmaul Respiration",
    pronunciation: "KOOS-mowl",
    category: "Assessment",
    bodySystem: "Respiratory / Metabolic",
    difficulty: "Intermediate",
    simpleDefinition: "Deep, rapid, sighing hyperventilation attempting to blow off CO2 in severe metabolic acidosis.",
    definition: "Classic compensatory respiratory drive seen in Diabetic Ketoacidosis (DKA), renal failure uraemia, severe sepsis lactic acidosis, and salicylate poisoning.",
    clinicalContext: "Never treat Kussmaul breathing as primary respiratory failure requiring sedation—correct the underlying metabolic acidosis (IV fluids/insulin)."
  },
  {
    term: "Lochia",
    pronunciation: "LOH-kee-uh",
    category: "Midwifery & OB",
    bodySystem: "Reproductive",
    difficulty: "Beginner",
    simpleDefinition: "Normal postpartum uterine discharge flowing for 4–6 weeks after childbirth.",
    definition: "Progresses sequentially: Lochia Rubra (bright red days 1–4), Lochia Serosa (pinkish-brown days 5–10), and Lochia Alba (yellowish-white days 11–28).",
    clinicalContext: "Foul-smelling lochia, sudden return to heavy bright bleeding, large clots, or sub-involution with fever signals puerperal sepsis or retained placental fragments."
  },
  {
    term: "Lumbar Puncture",
    pronunciation: "LUM-bar PUNK-cher",
    category: "Clinical Procedures",
    bodySystem: "Neurological",
    difficulty: "Intermediate",
    simpleDefinition: "Sterile needle insertion into the lumbar subarachnoid space (L3–L4 or L4–L5) to sample CSF.",
    definition: "Diagnoses bacterial/cryptococcal meningitis, encephalitis, and subarachnoid haemorrhage using opening pressure, cell counts, protein, glucose, and India Ink/CrAg/culture.",
    clinicalContext: "Position patient curled tightly in fetal lateral or sitting posture; monitor for post-LP headache, CSF leak, or lower-limb tingling, and never perform if focal neuro signs/papilloedema indicate herniation risk."
  },
  {
    term: "Malaise",
    pronunciation: "muh-LAYZ",
    category: "Assessment",
    bodySystem: "Systemic",
    difficulty: "Beginner",
    simpleDefinition: "General feeling of bodily discomfort, fatigue, and lack of well-being marking infection onset.",
    definition: "Early non-specific prodromal symptom of acute viral infections, malaria, HIV seroconversion, tuberculosis, and autoimmune flares.",
    clinicalContext: "Probe onset timeline, rigors, weight change, and localizing organ symptoms during holistic nursing history."
  },
  {
    term: "Meconium",
    pronunciation: "meh-KOH-nee-um",
    category: "Midwifery & Paediatrics",
    bodySystem: "Gastrointestinal / Respiratory",
    difficulty: "Beginner",
    simpleDefinition: "Dark greenish-black tarry first newborn stool formed from ingested amniotic debris in utero.",
    definition: "Passage within 24–48 hours confirms lower GI patency; fresh thick meconium-stained amniotic fluid during cephalic labour signals foetal distress and aspiration risk.",
    clinicalContext: "Delayed meconium >48 hrs suggests Hirschsprung disease or imperforate anus; for vigorous babies born through meconium, dry/stimulate without routine deep tracheal suction."
  },
  {
    term: "Melaena",
    pronunciation: "meh-LEE-nuh",
    category: "Assessment",
    bodySystem: "Gastrointestinal",
    difficulty: "Intermediate",
    simpleDefinition: "Black, tarry, foul-smelling stools caused by digested blood from upper GI bleeding.",
    definition: "Stomach acid digests haemoglobin from bleeding peptic ulcers, oesophageal varices, or NSAID gastritis into dark tarry stools (>50 mL blood loss needed).",
    clinicalContext: "Distinguish true melaena from dark stools caused by oral iron tablets (non-foul); monitor pulse, BP, postural drop, haemoglobin, and cross-match urgently."
  },
  {
    term: "Nephrotic Syndrome",
    pronunciation: "neh-FROT-ik",
    category: "Medical-Surgical",
    bodySystem: "Renal",
    difficulty: "Intermediate",
    simpleDefinition: "Kidney glomerular disorder causing heavy proteinuria, low blood albumin, generalized oedema, and hyperlipidaemia.",
    definition: "Damaged glomerular basement membrane leaks >3.5 g protein daily, slashing oncotic pressure and creating periorbital/pedal oedema, ascites, and infection susceptibility.",
    clinicalContext: "Track strict daily weights, fluid intake/output chart, urine dipstick protein, abdominal girth, and protect fragile oedematous skin from breakdown."
  },
  {
    term: "Oliguria & Anuria",
    pronunciation: "ol-ig-YOOR-ee-uh",
    category: "Assessment",
    bodySystem: "Renal / Cardiovascular",
    difficulty: "Intermediate",
    simpleDefinition: "Abnormally low urine output (<400 mL/24 hrs or <0.5 mL/kg/hr in adults); anuria is <100 mL/24 hrs.",
    definition: "Critical early marker of pre-renal hypovolaemia/shock, intrinsic acute kidney injury (nephrotoxins, blackwater fever), or post-renal Foley catheter/prostatic obstruction.",
    clinicalContext: "Before assuming kidney failure in catheterized patients, FIRST flush/inspect Foley tubing for kinks or clots! Monitor MgSO4 patients closely—withhold MgSO4 if urine <30 mL/hr."
  },
  {
    term: "Orthopnoea",
    pronunciation: "or-THOP-nee-uh",
    category: "Assessment",
    bodySystem: "Cardiovascular / Respiratory",
    difficulty: "Beginner",
    simpleDefinition: "Shortness of breath triggered when lying flat that relieves when propped upright on pillows.",
    definition: "Classic hallmark of left ventricular congestive heart failure as supine posture shifts peripheral venous blood centrally into congested pulmonary capillaries.",
    clinicalContext: "Nurse patient comfortably upright (45–90 degrees Fowler's) supported on pillows or cardiac table; record '2-pillow' or '3-pillow orthopnoea' baseline."
  },
  {
    term: "Partograph",
    pronunciation: "PAR-toh-graf",
    category: "Midwifery & OB",
    bodySystem: "Reproductive",
    difficulty: "Beginner",
    simpleDefinition: "WHO graphical labour chart tracking cervical dilatation, contractions, and maternal-foetal status.",
    definition: "Begins plotting strictly once active first-stage labour reaches >=4 cm cervical dilatation; compares dilatation pace against the Alert Line (1 cm/hr) and Action Line (+4 hrs).",
    clinicalContext: "Crossing the Alert Line warrants heightened monitoring/referral readiness; reaching the Action Line triggers urgent obstetric intervention for prolonged/obstructed labour."
  },
  {
    term: "Pre-eclampsia",
    pronunciation: "pree-ih-KLAMP-see-uh",
    category: "Midwifery & OB",
    bodySystem: "Cardiovascular / Reproductive",
    difficulty: "Intermediate",
    simpleDefinition: "Pregnancy-specific disorder after 20 weeks marked by new hypertension (>=140/90 mmHg) and proteinuria or organ dysfunction.",
    definition: "Driven by abnormal placental spiral artery remodelling causing vasospasm, endothelial leak, oedema, hyperreflexia, epigastric RUQ pain, and thrombocytopenia (HELLP).",
    clinicalContext: "Screen every ANC mother cleanly with calibrated BP cuff + urine protein dipstick; treat severe BP >=160/110 promptly with Nifedipine or IV Hydralazine + MgSO4 seizure prophylaxis."
  },
  {
    term: "Puerperal Sepsis",
    pronunciation: "pyoo-UR-per-ul SEP-sis",
    category: "Midwifery & OB",
    bodySystem: "Reproductive / Immune",
    difficulty: "Intermediate",
    simpleDefinition: "Severe bacterial genital tract infection occurring from membrane rupture/delivery up to 42 days postpartum.",
    definition: "Defined clinically by fever >=38 C with pelvic pain, foul lochia, sub-involution of uterus, tachycardia, and tachypnoea; commonly polymicrobial (Streptococci, E. coli, anaerobes).",
    clinicalContext: "Prevention via strict 5-Cleans delivery asepsis; treat early with Triple IV Antibiotics (Ampicillin + Gentamicin + Metronidazole) per Uganda Clinical Guidelines."
  },
  {
    term: "QRS Complex",
    pronunciation: "kyoo-ar-es KOM-pleks",
    category: "Assessment",
    bodySystem: "Cardiovascular",
    difficulty: "Intermediate",
    simpleDefinition: "Sharp ECG waveform deflection representing rapid ventricular depolarization (contraction).",
    definition: "Normal QRS duration is <0.12 seconds (<3 small ECG squares). Widened QRS suggests ventricular tachycardia, bundle branch block, or severe hyperkalaemia.",
    clinicalContext: "In cardiac arrest strips, rapid broad-complex rhythm without pulse = pulseless VT requiring immediate defibrillation."
  },
  {
    term: "Quickening",
    pronunciation: "KWIK-uh-ning",
    category: "Midwifery & OB",
    bodySystem: "Reproductive",
    difficulty: "Beginner",
    simpleDefinition: "First fluttering sensations of foetal movement felt by the mother, usually between 16–20 weeks.",
    definition: "Reassuring maternal milestone confirming foetal neuromuscular vitality; multigravidas typically perceive quickening ~2 weeks earlier than primigravidas.",
    clinicalContext: "After 28 weeks, instruct mothers to count '10 kicks within 2 hours' or monitor daily foetal movements and report any marked reduction urgently."
  },
  {
    term: "Rh Isoimmunization (Rhesus Negative)",
    pronunciation: "REE-sus eye-soh-im-yoo-ny-ZAY-shun",
    category: "Midwifery & OB",
    bodySystem: "Haematological / Reproductive",
    difficulty: "Advanced",
    simpleDefinition: "Maternal antibody development against Rh-positive foetal red cells risking haemolytic disease of newborn.",
    definition: "Occurs when an RhD-negative mother is exposed to RhD-positive foetal blood during birth, miscarriage, ectopic pregnancy, or trauma without Anti-D immunoglobulin prophylaxis.",
    clinicalContext: "Check maternal ABO/Rh blood group at first ANC booking! Administer Anti-D immunoglobulin IM within 72 hours of delivery, abortion, or sensitizing bleed if baby is Rh+."
  },
  {
    term: "Rigors",
    pronunciation: "RIG-orz",
    category: "Assessment",
    bodySystem: "Systemic / Immune",
    difficulty: "Beginner",
    simpleDefinition: "Violent uncontrollable shivering chills accompanied by teeth chattering as core fever rises steeply.",
    definition: "Classic hallmark of sudden pyrogen surges in acute malaria paroxysms, septicaemia, pyelonephritis, pneumonia, or acute blood transfusion reactions.",
    clinicalContext: "Obtain blood smear/RDT for malaria + blood cultures BEFORE empirical antipyretics when safe; remove heavy blankets only once shivering stops and hot phase begins."
  },
  {
    term: "Stridor",
    pronunciation: "STRY-dor",
    category: "Emergency Care",
    bodySystem: "Respiratory",
    difficulty: "Intermediate",
    simpleDefinition: "High-pitched harsh crowing sound predominantly on INSPIRATION indicating upper airway narrowing.",
    definition: "Signifies acute partial obstruction at larynx or trachea from croup, epiglottitis, anaphylaxis angioedema, inhaled foreign body, or post-extubation oedema.",
    clinicalContext: "EMERGENCY RED FLAG: Stridor at rest demands calm positioning (on caregiver's lap), humidified oxygen, nebulized Adrenaline + Dexamethasone, and NEVER agitate the child with throat spatulas!"
  },
  {
    term: "Tachypnoea",
    pronunciation: "tak-ip-NEE-uh",
    category: "Assessment",
    bodySystem: "Respiratory",
    difficulty: "Beginner",
    simpleDefinition: "Abnormally rapid breathing rate exceeding normal age thresholds.",
    definition: "WHO pneumonia fast-breathing cut-offs: >=60/min (age <2 months), >=50/min (2–11 months), >=40/min (1–5 years), and >20/min in resting adults.",
    clinicalContext: "Count full 60 seconds when child is calm; tachypnoea is the single most sensitive early sign of childhood pneumonia before crackles appear!"
  },
  {
    term: "Uterine Atony",
    pronunciation: "YOO-ter-in AT-uh-nee",
    category: "Midwifery & OB",
    bodySystem: "Reproductive",
    difficulty: "Intermediate",
    simpleDefinition: "Failure of uterine myometrial muscles to contract firmly after childbirth, leaving a soft boggy uterus.",
    definition: "Permits rapid torrential bleeding from open placental-site spiral arteries; accounts for ~70% of primary postpartum haemorrhage cases.",
    clinicalContext: "Prevent routinely with Active Management of Third Stage of Labour (Oxytocin 10 IU IM within 1 minute of birth); feel abdomen immediately postpartum—boggy = massage + uterotonics!"
  },
  {
    term: "Vaso-occlusive Crisis (Sickle Cell)",
    pronunciation: "VAY-zoh oh-KLOO-siv KRY-sis",
    category: "Paediatrics & Medicine",
    bodySystem: "Haematological",
    difficulty: "Intermediate",
    simpleDefinition: "Severe ischaemic pain crisis when sickled red blood cells block small capillaries in bones or organs.",
    definition: "Triggered in Sickle Cell Disease (HbSS) by dehydration, hypoxia, cold weather, or infections (malaria/pneumonia), presenting as dactylitis, long bone pain, or acute chest syndrome.",
    clinicalContext: "Priority triage triad: 1) Rapid IV/oral Hydration, 2) Adequate stepped Analgesia (Paracetamol + Ibuprofen/Morphine—never delay opioids!), 3) Oxygen + keep warm + treat infection."
  },
  {
    term: "Wheezes (Rhonchi)",
    pronunciation: "WEE-ziz",
    category: "Assessment",
    bodySystem: "Respiratory",
    difficulty: "Beginner",
    simpleDefinition: "Continuous high-pitched musical whistling sounds predominantly on EXPIRATION from narrowed small airways.",
    definition: "Indicates bronchospasm, airway oedema, or mucus plugging in bronchial asthma, infant bronchiolitis, COPD, or anaphylaxis.",
    clinicalContext: "A sudden 'SILENT CHEST' with poor air entry in severe asthma means extreme danger (exhaustion/imminent arrest), NOT improvement!"
  },
  {
    term: "Wound Dehiscence",
    pronunciation: "deh-HIS-enz",
    category: "Surgical Nursing",
    bodySystem: "Integumentary",
    difficulty: "Intermediate",
    simpleDefinition: "Partial or complete separation/bursting open of previously sutured surgical wound edges.",
    definition: "Often heralded on postoperative days 5–8 by sudden gush of serosanguinous ('pink watery') fluid; if viscera protrude through fascia, it is called EVISCERATION.",
    clinicalContext: "In Evisceration: STAY CALM, call surgeon stat, do NOT push organs back in—cover viscera with sterile saline-soaked gauze, bend patient's knees slightly (low-Fowler's), keep NBM."
  },
  {
    term: "X-Ray (Chest Radiograph Checks)",
    pronunciation: "EKS-ray",
    category: "Diagnostics",
    bodySystem: "Respiratory / Skeletal",
    difficulty: "Beginner",
    simpleDefinition: "Common radiographic imaging assessing lungs, heart silhouette, ribs, pneumothorax, and ETT/NGT positions.",
    definition: "Reveals lobar consolidation, pleural effusion meniscus, tension pneumothorax tracheal shift, cardiomegaly, and tuberculosis apical cavities.",
    clinicalContext: "Always verify pregnancy status BEFORE abdominal/pelvic X-rays in reproductive-age women and apply lead shielding when clinically feasible."
  },
  {
    term: "Yellow Fever",
    pronunciation: "YEL-oh FEE-ver",
    category: "Community Health",
    bodySystem: "Hepatic / Immune",
    difficulty: "Intermediate",
    simpleDefinition: "Acute viral haemorrhagic disease transmitted by daytime-biting Aedes aegypti mosquitoes.",
    definition: "Features acute fever, severe backache, bradycardia-fever dissociation (Faget's sign), progressing in severe toxic phase to jaundice, haematemesis ('black vomit'), and renal failure.",
    clinicalContext: "Single lifetime Yellow Fever vaccine (Stamaril) confers lifelong immunity at >=99%; immediate notifiable viral haemorrhagic surveillance alert in Uganda."
  },
  {
    term: "Zinc Supplementation (Diarrhoea)",
    pronunciation: "zingk sup-leh-men-TAY-shun",
    category: "Paediatrics & Pharmacology",
    bodySystem: "Gastrointestinal / Immune",
    difficulty: "Beginner",
    simpleDefinition: "Essential WHO adjunct therapy given alongside ORS for acute childhood diarrhoea.",
    definition: "Dispersible Zinc sulphate (20 mg once daily for 10–14 days in children >=6 months; 10 mg if <6 months) restores intestinal mucosal brush border and reduces episode severity/recurrence.",
    clinicalContext: "Give strictly WITH ORS (never as a standalone replacement for fluids!) and advise mothers to finish the full 10-day course even after diarrhoea stops."
  }
];

const EXTRA_ABBREVIATIONS = [
  { abbr: "ABCDE", full: "Airway, Breathing, Circulation, Disability, Exposure" },
  { abbr: "ACT", full: "Artemisinin-based Combination Therapy (e.g., Artemether-Lumefantrine)" },
  { abbr: "AMTSL", full: "Active Management of the Third Stage of Labour" },
  { abbr: "ANC", full: "Antenatal Care" },
  { abbr: "ART", full: "Antiretroviral Therapy" },
  { abbr: "BD / BID", full: "Bis In Die — Twice Daily (every 12 hours)" },
  { abbr: "BMI", full: "Body Mass Index (kg/m2)" },
  { abbr: "BP", full: "Blood Pressure (mmHg)" },
  { abbr: "BScN", full: "Bachelor of Science in Nursing" },
  { abbr: "C&S", full: "Culture and Sensitivity (microbiology)" },
  { abbr: "CPR", full: "Cardiopulmonary Resuscitation" },
  { abbr: "CS / C/S", full: "Caesarean Section" },
  { abbr: "DKA", full: "Diabetic Ketoacidosis" },
  { abbr: "DVT", full: "Deep Vein Thrombosis" },
  { abbr: "ECG / EKG", full: "Electrocardiogram" },
  { abbr: "EDD", full: "Estimated Date of Delivery (Naegele's Rule)" },
  { abbr: "EmONC", full: "Emergency Obstetric and Newborn Care" },
  { abbr: "ETT", full: "Endotracheal Tube" },
  { abbr: "FHR", full: "Foetal Heart Rate (normal 110–160 bpm)" },
  { abbr: "GCS", full: "Glasgow Coma Scale (3–15)" },
  { abbr: "Hb / Hgb", full: "Haemoglobin (g/dL)" },
  { abbr: "HBB", full: "Helping Babies Breathe (neonatal resuscitation)" },
  { abbr: "HIV / eMTCT", full: "Human Immunodeficiency Virus / Elimination of Mother-to-Child Transmission" },
  { abbr: "ICN / IPC", full: "Infection Prevention and Control" },
  { abbr: "IU / I.U.", full: "International Units (e.g., Oxytocin, Insulin)" },
  { abbr: "LMP", full: "Last Menstrual Period" },
  { abbr: "MAM / SAM", full: "Moderate / Severe Acute Malnutrition" },
  { abbr: "MgSO4", full: "Magnesium Sulphate (eclampsia prophylaxis & treatment)" },
  { abbr: "MUAC", full: "Mid-Upper Arm Circumference" },
  { abbr: "MVA", full: "Manual Vacuum Aspiration" },
  { abbr: "NBM / NPO", full: "Nil By Mouth (Nothing Per Oral)" },
  { abbr: "NGT", full: "Nasogastric Tube" },
  { abbr: "OD", full: "Omni Die — Once Daily" },
  { abbr: "ORS", full: "Oral Rehydration Salts (Low-Osmolarity WHO Formula)" },
  { abbr: "OSCE", full: "Objective Structured Clinical Examination" },
  { abbr: "PNC", full: "Postnatal Care" },
  { abbr: "PPH", full: "Postpartum Haemorrhage" },
  { abbr: "PRN", full: "Pro Re Nata — When Required / As Needed" },
  { abbr: "QID / QDS", full: "Quater In Die — Four Times Daily (every 6 hours)" },
  { abbr: "RBS / FBS", full: "Random / Fasting Blood Sugar" },
  { abbr: "RDT", full: "Rapid Diagnostic Test (Malaria / HIV)" },
  { abbr: "RUTF", full: "Ready-to-Use Therapeutic Food (Plumpy'Nut)" },
  { abbr: "SFH", full: "Symphysis-Fundal Height (cm)" },
  { abbr: "SpO2", full: "Peripheral Capillary Oxygen Saturation (%)" },
  { abbr: "STAT", full: "Statim — Immediately / Single Urgent Dose" },
  { abbr: "TDS / TID", full: "Ter In Die — Three Times Daily (every 8 hours)" },
  { abbr: "UCG", full: "Uganda Clinical Guidelines (Ministry of Health)" },
  { abbr: "UNMC / UNMEB", full: "Uganda Nurses & Midwives Council / Examinations Board" },
  { abbr: "UTI", full: "Urinary Tract Infection" },
  { abbr: "VIA", full: "Visual Inspection with Acetic Acid (Cervical Cancer Screening)" }
];

function slugify(str) {
  return String(str || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function main() {
  const existing = JSON.parse(fs.readFileSync(DATA_PATH, "utf8"));
  const termMap = new Map();

  for (const t of existing.terms || []) {
    termMap.set(t.term.toLowerCase().trim(), t);
  }

  for (const nt of NEW_TERMS) {
    const key = nt.term.toLowerCase().trim();
    if (!termMap.has(key)) {
      termMap.set(key, {
        id: slugify(nt.term),
        slug: slugify(nt.term),
        partOfSpeech: "noun",
        ...nt
      });
    }
  }

  const abbrMap = new Map();
  for (const a of existing.abbreviations || []) {
    abbrMap.set(a.abbr.toUpperCase().trim(), a);
  }
  for (const na of EXTRA_ABBREVIATIONS) {
    const k = na.abbr.toUpperCase().trim();
    if (!abbrMap.has(k)) abbrMap.set(k, na);
  }

  const finalTerms = [...termMap.values()].sort((a, b) => a.term.localeCompare(b.term));
  const finalAbbr = [...abbrMap.values()].sort((a, b) => a.abbr.localeCompare(b.abbr));

  const out = {
    ...existing,
    updatedAt: new Date().toISOString(),
    terms: finalTerms,
    abbreviations: finalAbbr
  };

  fs.writeFileSync(DATA_PATH, JSON.stringify(out, null, 2));

  const letterSet = new Set(finalTerms.map((t) => (t.term[0] || "?").toUpperCase()));
  console.log(JSON.stringify({
    ok: true,
    totalTerms: finalTerms.length,
    totalAbbreviations: finalAbbr.length,
    lettersCovered: [...letterSet].sort().join("")
  }, null, 2));
}

main();
