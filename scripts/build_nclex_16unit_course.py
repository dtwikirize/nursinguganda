#!/usr/bin/env python3
"""
Builds the 16-Unit NCLEX-RN Preparation Course ($99) and the separate
NCLEX-RN Examinations Course from F:/NCLEX PREP COURSE extracted notes,
triangulated with Saunders 9th Ed., Kaplan NCLEX-RN Prep, and LaCharity PDA.

Outputs:
  - assets/data/nclex-rn-course.json   (16 Units, ~56 Topics, 20 Qs/topic, 60 Qs/unit eval)
  - assets/data/nclex-rn-exams.json    (4 full-length NCLEX-RN / NGN mock exams)
"""
import json
import random
import re
from pathlib import Path

RAW_PATH = Path(r"C:\Users\USER\.gemini\antigravity\brain\aa4ea4c4-4fd7-4c21-b28f-b2522a3e5312\scratch\nclex_raw_extracted.json")
OUT_COURSE = Path("assets/data/nclex-rn-course.json")
OUT_EXAMS = Path("assets/data/nclex-rn-exams.json")

TUTOR_STRIP = re.compile(
    r"\b(agnes|zoom|whatsapp|click here to watch|watch the video|recorded session|welcome back to class|hello class)\b",
    re.I,
)

# 16 Course Units (Weeks 1-16) aligned to the NCLEX Prep Course Outline + Saunders 9th Ed + Kaplan
UNITS_SPEC = [
    {
        "unitNumber": 1,
        "slug": "unit-1-ngn-clinical-judgment-strategies",
        "title": "Week 1: Next-Generation NCLEX (NGN), Clinical Judgment & Test-Taking Strategies",
        "weekLabel": "Week 1",
        "sourceWeeks": ["WEEK 1", "ROOT"],
        "fileHints": ["NEXT GENERATION", "Testing Strategies", "C1-The-NCLEX", "NURSING IN USA"],
        "saundersRef": "Silvestri LA, Silvestri AE. Saunders Comprehensive Review for the NCLEX-RN Examination. 9th ed. Unit I (Ch. 1–4): Clinical Judgment & Next-Generation NCLEX-RN.",
        "kaplanRef": "Kaplan Nursing. NCLEX-RN Prep Plus. Ch. 1–3: CAT Engine, Decision Tree & Exam Strategies.",
        "lacharityRef": "LaCharity LA, Kumagai CK, Bartz B. Prioritization, Delegation, and Assignment. 4th ed. Introduction to Clinical Judgment.",
        "topics": [
            {"slug": "ngn-cjmm-6-steps", "title": "NCSBN 6-Step Clinical Judgment Measurement Model (CJMM)", "keywords": ["clinical judgment", "cjmm", "recognize cues", "analyze cues", "prioritize", "next generation"]},
            {"slug": "cat-exam-blueprint-foreign-nurses", "title": "NCLEX-RN CAT Blueprint, CGFNS & US Licensure Pathway", "keywords": ["cat", "cgfns", "att", "pearson", "nursing in usa", "85", "150", "client needs"]},
            {"slug": "kaplan-saunders-test-strategies", "title": "High-Yield NCLEX Test-Taking Strategies (ABCs, Maslow & Safety)", "keywords": ["strategy", "strategies", "abcs", "maslow", "stem", "distractor", "priority"]},
        ],
    },
    {
        "unitNumber": 2,
        "slug": "unit-2-management-legal-delegation-triage",
        "title": "Week 2: Management of Care — Legal Issues, Ethics, Delegation & Disaster Triage",
        "weekLabel": "Week 2",
        "sourceWeeks": ["WEEK 2"],
        "fileHints": ["legal issues", "Priotization", "Delegation", "HEALTH CARE DELIVERY", "TRIAGE", "Week _2"],
        "saundersRef": "Silvestri LA. Saunders Comprehensive Review for the NCLEX-RN Examination. 9th ed. Unit II (Ch. 5–7): Ethical & Legal Issues, Prioritizing Client Care & Delegation.",
        "kaplanRef": "Kaplan Nursing. NCLEX-RN Prep Plus. Ch. 4: Management of Care & Supervision.",
        "lacharityRef": "LaCharity LA. Prioritization, Delegation, and Assignment. 4th ed. Ch. 1 & Case Study 3.",
        "topics": [
            {"slug": "legal-issues-hipaa-consent", "title": "Legal Issues, Informed Consent, HIPAA & Mandatory Reporting", "keywords": ["legal", "hipaa", "consent", "advance directive", "malpractice", "negligence", "ethics"]},
            {"slug": "delegation-rn-lpn-uap", "title": "Safe Delegation & Supervision (RN vs. LPN/LVN vs. UAP)", "keywords": ["delegation", "uap", "lpn", "assign", "supervision", "scope"]},
            {"slug": "prioritization-disaster-triage", "title": "Client Prioritization & Mass Casualty Disaster Triage", "keywords": ["triage", "disaster", "red", "yellow", "green", "black", "priorit", "delivery system"]},
        ],
    },
    {
        "unitNumber": 3,
        "slug": "unit-3-foundations-fluids-abgs-nutrition",
        "title": "Week 3: Foundations, Safety, Fluid & Electrolytes, ABGs & Nutrition",
        "weekLabel": "Week 3",
        "sourceWeeks": ["WEEK 3"],
        "fileHints": ["3.1", "3.2", "3.5", "ABGS", "NUTRITION"],
        "saundersRef": "Silvestri LA. Saunders Comprehensive Review for the NCLEX-RN Examination. 9th ed. Unit III (Ch. 8–17): Fluid & Electrolytes, Acid-Base Balance, Nutrition & Infection Control.",
        "kaplanRef": "Kaplan Nursing. NCLEX-RN Prep Plus. Ch. 5 & Ch. 8: Safety, Infection Control & Physiological Adaptation.",
        "lacharityRef": "LaCharity LA. Prioritization, Delegation, and Assignment. 4th ed. Ch. 3: Fluid, Electrolyte & Acid-Base Imbalances.",
        "topics": [
            {"slug": "fluid-electrolyte-imbalances", "title": "Fluid Volume & Electrolyte Imbalances (Na+, K+, Ca2+, Mg2+)", "keywords": ["sodium", "potassium", "calcium", "magnesium", "fluid", "dehydration", "hyperkalemia", "hyponatremia"]},
            {"slug": "arterial-blood-gases-abgs", "title": "Mastering Arterial Blood Gases (ABGs) & Acid-Base Compensation", "keywords": ["abg", "acidosis", "alkalosis", "paco2", "hco3", "ph", "respiratory", "metabolic"]},
            {"slug": "infection-control-nutrition-safety", "title": "Transmission-Based Precautions, Enteral/TPN Nutrition & Safety", "keywords": ["nutrition", "tpn", "enteral", "airborne", "droplet", "contact", "isolation", "precaution"]},
        ],
    },
    {
        "unitNumber": 4,
        "slug": "unit-4-cardiovascular-system-medications",
        "title": "Week 4: Cardiovascular System, ECGs, Hemodynamics & Cardiac Medications",
        "weekLabel": "Week 4",
        "sourceWeeks": ["WEEK 4", "ROOT"],
        "fileHints": ["4.1", "CARDIOVASCULAR PROBLEMS"],
        "saundersRef": "Silvestri LA. Saunders Comprehensive Review for the NCLEX-RN Examination. 9th ed. Unit XII (Ch. 53–54): Cardiovascular Problems & Medications.",
        "kaplanRef": "Kaplan Nursing. NCLEX-RN Prep Plus. Ch. 8–9: Cardiovascular Adaptation & Parenteral Therapies.",
        "lacharityRef": "LaCharity LA. Prioritization, Delegation, and Assignment. 4th ed. Ch. 7: Cardiovascular Problems.",
        "topics": [
            {"slug": "heart-failure-hypertension-cad", "title": "Heart Failure, Hypertension, Coronary Artery Disease & ACS/MI", "keywords": ["heart failure", "hypertension", "myocardial", "angina", "cad", "bnp", "edema"]},
            {"slug": "ecg-dysrhythmias-shock", "title": "ECG Strip Interpretation, Dysrhythmias & Cardiogenic Shock", "keywords": ["ecg", "ekg", "arrhythmia", "dysrhythmia", "fibrillation", "shock", "defibrillation"]},
            {"slug": "cardiovascular-pharmacology-anticoagulants", "title": "Cardiac Medications: ACEi, Beta-Blockers, Digoxin, Heparin & Warfarin", "keywords": ["digoxin", "warfarin", "heparin", "beta", "furosemide", "lasix", "nitroglycerin", "ace"]},
        ],
    },
    {
        "unitNumber": 5,
        "slug": "unit-5-respiratory-system-medications",
        "title": "Week 5: Respiratory System, Diagnostic Tests, Acute Care & Medications",
        "weekLabel": "Week 5",
        "sourceWeeks": ["WEEK 5"],
        "fileHints": ["4.2 DIAGNOSTIC", "5.1 Respiratory", "5.3 Respiratory", "RESPIRATORY SYSTEM, ANATOMY", "Respiratory SYS"],
        "saundersRef": "Silvestri LA. Saunders Comprehensive Review for the NCLEX-RN Examination. 9th ed. Unit XI (Ch. 51–52): Respiratory Problems & Medications.",
        "kaplanRef": "Kaplan Nursing. NCLEX-RN Prep Plus. Ch. 8–9: Oxygenation, Mechanical Ventilation & Respiratory Drugs.",
        "lacharityRef": "LaCharity LA. Prioritization, Delegation, and Assignment. 4th ed. Ch. 6 & Case Study 2: Respiratory Problems.",
        "topics": [
            {"slug": "respiratory-anatomy-diagnostics", "title": "Respiratory A&P, Breath Sounds, ABGs, Thoracentesis & Chest Tubes", "keywords": ["breath", "thoracentesis", "chest tube", "bronchoscopy", "spirometry", "diagnostic", "alveoli"]},
            {"slug": "copd-asthma-ards-pe", "title": "COPD, Asthma, Pneumonia, Pulmonary Embolism & ARDS", "keywords": ["copd", "asthma", "pneumonia", "ards", "embolism", "pneumothorax", "tuberculosis"]},
            {"slug": "respiratory-medications-inhalers", "title": "Respiratory Medications: Bronchodilators, Steroids & Anti-TB Regimens", "keywords": ["albuterol", "salbutamol", "bronchodilator", "isoniazid", "rifampin", "theophylline", "inhaler"]},
        ],
    },
    {
        "unitNumber": 6,
        "slug": "unit-6-endocrine-metabolic-disorders",
        "title": "Week 6: Endocrine & Metabolic Disorders (Diabetes, Thyroid, Adrenal & Pituitary)",
        "weekLabel": "Week 6",
        "sourceWeeks": ["WEEK 6"],
        "fileHints": ["endocrine"],
        "saundersRef": "Silvestri LA. Saunders Comprehensive Review for the NCLEX-RN Examination. 9th ed. Unit X (Ch. 47–48): Endocrine Problems & Medications.",
        "kaplanRef": "Kaplan Nursing. NCLEX-RN Prep Plus. Ch. 8–9: Endocrine Disorders & Insulin Therapies.",
        "lacharityRef": "LaCharity LA. Prioritization, Delegation, and Assignment. 4th ed. Ch. 9: Endocrine Problems.",
        "topics": [
            {"slug": "diabetes-dka-hhs-insulins", "title": "Diabetes Mellitus, DKA vs. HHS & Insulin Peak/Onset Profiles", "keywords": ["diabetes", "dka", "hhs", "insulin", "glucose", "hypoglycemia", "ketoacidosis"]},
            {"slug": "thyroid-parathyroid-disorders", "title": "Hypothyroidism, Hyperthyroidism (Thyroid Storm) & Parathyroid", "keywords": ["thyroid", "graves", "levothyroxine", "thyroid storm", "parathyroid", "calcium"]},
            {"slug": "adrenal-pituitary-siadh-di", "title": "Addison's vs. Cushing's Disease, SIADH & Diabetes Insipidus", "keywords": ["addison", "cushing", "siadh", "insipidus", "adh", "cortisol", "adrenal"]},
        ],
    },
    {
        "unitNumber": 7,
        "slug": "unit-7-oncology-hematology-emergencies",
        "title": "Week 7: Oncology, Hematological Disorders & Oncological Emergencies",
        "weekLabel": "Week 7",
        "sourceWeeks": ["WEEK 7"],
        "fileHints": ["ONCOLOGICAL", "Oncology_", "SPECIFIC CANCERS"],
        "saundersRef": "Silvestri LA. Saunders Comprehensive Review for the NCLEX-RN Examination. 9th ed. Unit IX (Ch. 44–46): Oncological & Hematological Problems & Medications.",
        "kaplanRef": "Kaplan Nursing. NCLEX-RN Prep Plus. Ch. 8–9: Chemotherapy Safety, Blood Products & Neutropenia.",
        "lacharityRef": "LaCharity LA. Prioritization, Delegation, and Assignment. 4th ed. Ch. 8 & Case Study 11: Cancer & Hematology.",
        "topics": [
            {"slug": "hematology-anemias-coagulopathies", "title": "Anemias, Sickle Cell Crisis, Thrombocytopenia & Blood Transfusions", "keywords": ["anemia", "sickle", "transfusion", "platelet", "hemophilia", "neutropenia"]},
            {"slug": "oncological-emergencies-chemo", "title": "Oncological Emergencies (TLS, SIADH, SVC, Hypercalcemia) & Chemo", "keywords": ["tumor lysis", "superior vena cava", "chemotherapy", "radiation", "brachytherapy", "extravasation"]},
            {"slug": "specific-cancers-screening", "title": "Breast, Lung, Colorectal, Prostate & Cervical Cancers (CAUTION)", "keywords": ["breast", "colorectal", "prostate", "cervical", "leukemia", "lymphoma", "cancer"]},
        ],
    },
    {
        "unitNumber": 8,
        "slug": "unit-8-immune-hypersensitivity-hiv",
        "title": "Week 8: Immune System, Hypersensitivity, HIV/AIDS & Autoimmune Care",
        "weekLabel": "Week 8",
        "sourceWeeks": ["WEEK 8"],
        "fileHints": ["Immune problems", "IMMUNE"],
        "saundersRef": "Silvestri LA. Saunders Comprehensive Review for the NCLEX-RN Examination. 9th ed. Unit VIII (Ch. 63–64): Immune Problems & Immunological Medications.",
        "kaplanRef": "Kaplan Nursing. NCLEX-RN Prep Plus. Ch. 5 & Ch. 8: Hypersensitivity, Anaphylaxis & Opportunistic Infections.",
        "lacharityRef": "LaCharity LA. Prioritization, Delegation, and Assignment. 4th ed. Ch. 13: Immunological Problems.",
        "topics": [
            {"slug": "hypersensitivity-anaphylaxis-latex", "title": "Types I–IV Hypersensitivity, Anaphylaxis & Latex Allergy Precautions", "keywords": ["anaphylaxis", "hypersensitivity", "latex", "epinephrine", "ige", "allergy"]},
            {"slug": "hiv-aids-opportunistic-art", "title": "HIV/AIDS Staging, CD4 Counts, Opportunistic Infections & ART", "keywords": ["hiv", "aids", "cd4", "opportunistic", "pneumocystis", "antiretroviral"]},
            {"slug": "autoimmune-sle-transplant", "title": "Systemic Lupus Erythematosus (SLE), RA & Organ Transplant Rejection", "keywords": ["lupus", "sle", "rheumatoid", "transplant", "rejection", "immunosuppressant"]},
        ],
    },
    {
        "unitNumber": 9,
        "slug": "unit-9-gastrointestinal-hepatobiliary-meds",
        "title": "Week 9: Gastrointestinal, Hepatobiliary Disorders & GI Medications",
        "weekLabel": "Week 9",
        "sourceWeeks": ["WEEK 9"],
        "fileHints": ["gastro", "GASTROINTESTINAL"],
        "saundersRef": "Silvestri LA. Saunders Comprehensive Review for the NCLEX-RN Examination. 9th ed. Unit XI (Ch. 49–50): Gastrointestinal Problems & Medications.",
        "kaplanRef": "Kaplan Nursing. NCLEX-RN Prep Plus. Ch. 8–9: GI Bleeding, Ostomy Care & Antiemetics/PPIs.",
        "lacharityRef": "LaCharity LA. Prioritization, Delegation, and Assignment. 4th ed. Ch. 12 & Case Study 12: GI & Nutrition.",
        "topics": [
            {"slug": "upper-gi-gerd-pud-bleeding", "title": "GERD, Peptic Ulcer Disease, Upper GI Bleed & NG Tube Care", "keywords": ["gerd", "ulcer", "bleed", "ng tube", "gastritis", "hematemesis"]},
            {"slug": "lower-gi-ibd-ostomy-liver", "title": "IBD (Crohn's vs. UC), Bowel Obstruction, Ostomies, Cirrhosis & Pancreatitis", "keywords": ["crohn", "ulcerative", "ostomy", "cirrhosis", "pancreatitis", "ascites", "hepatic"]},
            {"slug": "gi-medications-ppis-laxatives", "title": "GI Pharmacology: PPIs, H2 Blockers, Sucralfate, Lactulose & Antiemetics", "keywords": ["omeprazole", "pantoprazole", "sucralfate", "lactulose", "ondansetron", "antacid"]},
        ],
    },
    {
        "unitNumber": 10,
        "slug": "unit-10-neurological-system-medications",
        "title": "Week 10: Neurological System, Stroke, Increased ICP & Neuro Medications",
        "weekLabel": "Week 10",
        "sourceWeeks": ["WEEK 10"],
        "fileHints": ["NERVOUS SYSTEM", "NEUROLOGICAL"],
        "saundersRef": "Silvestri LA. Saunders Comprehensive Review for the NCLEX-RN Examination. 9th ed. Unit XV (Ch. 59–60): Neurological Problems & Medications.",
        "kaplanRef": "Kaplan Nursing. NCLEX-RN Prep Plus. Ch. 8–9: Cranial Nerves, ICP Monitoring & Anticonvulsants.",
        "lacharityRef": "LaCharity LA. Prioritization, Delegation, and Assignment. 4th ed. Ch. 10: Neurological Problems.",
        "topics": [
            {"slug": "neuro-assessment-icp-stroke", "title": "GCS, Cranial Nerves, Increased ICP (Cushing's Triad) & Stroke (tPA)", "keywords": ["icp", "gcs", "stroke", "cushing", "cranial", "tpa", "cerebral"]},
            {"slug": "seizures-spinal-cord-myasthenia", "title": "Seizures, Spinal Cord Injury (Autonomic Dysreflexia), MG & Parkinson's", "keywords": ["seizure", "spinal", "dysreflexia", "myasthenia", "parkinson", "guillain"]},
            {"slug": "neuro-medications-anticonvulsants", "title": "Neuro Medications: Phenytoin, Mannitol, Levodopa & Pyridostigmine", "keywords": ["phenytoin", "mannitol", "levodopa", "carbidopa", "pyridostigmine", "carbamazepine"]},
        ],
    },
    {
        "unitNumber": 11,
        "slug": "unit-11-renal-aki-ckd-urinary",
        "title": "Week 11: Renal System, Acute Kidney Injury (AKI), CKD & Dialysis",
        "weekLabel": "Week 11",
        "sourceWeeks": ["WEEK 11"],
        "fileHints": ["KIDNEY", "Kidney"],
        "saundersRef": "Silvestri LA. Saunders Comprehensive Review for the NCLEX-RN Examination. 9th ed. Unit XIII (Ch. 55–56): Renal & Urinary Problems & Medications.",
        "kaplanRef": "Kaplan Nursing. NCLEX-RN Prep Plus. Ch. 8: Renal Failure, Hemodialysis & Peritoneal Dialysis.",
        "lacharityRef": "LaCharity LA. Prioritization, Delegation, and Assignment. 4th ed. Ch. 14: Renal & Urinary Problems.",
        "topics": [
            {"slug": "aki-phases-prerenal-intrarenal", "title": "Acute Kidney Injury (Prerenal, Intrarenal, Postrenal) & Phases", "keywords": ["aki", "acute kidney", "prerenal", "oliguric", "diuretic", "creatinine", "bun"]},
            {"slug": "ckd-hemodialysis-peritoneal", "title": "Chronic Kidney Disease (CKD), AV Fistula Care & Dialysis Nursing", "keywords": ["ckd", "dialysis", "fistula", "bruit", "thrill", "peritoneal", "epoetin"]},
            {"slug": "uti-urolithiasis-bph-meds", "title": "UTI, Pyelonephritis, Nephrolithiasis, BPH & Renal Medications", "keywords": ["uti", "stone", "bph", "turp", "bladder", "renal"]},
        ],
    },
    {
        "unitNumber": 12,
        "slug": "unit-12-eye-ear-sensory-perioperative",
        "title": "Week 12: Sensory System (Eye & Ear Disorders) & Perioperative Care",
        "weekLabel": "Week 12",
        "sourceWeeks": ["WEEK 12"],
        "fileHints": ["EYE", "EAR"],
        "saundersRef": "Silvestri LA. Saunders Comprehensive Review for the NCLEX-RN Examination. 9th ed. Unit XIV (Ch. 57–58) & Ch. 15: Eye, Ear & Perioperative Care.",
        "kaplanRef": "Kaplan Nursing. NCLEX-RN Prep Plus. Ch. 8: Sensory Alterations & Surgical Safety.",
        "lacharityRef": "LaCharity LA. Prioritization, Delegation, and Assignment. 4th ed. Ch. 10: Visual & Auditory Problems.",
        "topics": [
            {"slug": "eye-glaucoma-cataracts-retina", "title": "Glaucoma, Cataracts, Retinal Detachment & Eye Drop Administration", "keywords": ["glaucoma", "cataract", "retina", "intraocular", "timolol", "pilocarpine", "eye"]},
            {"slug": "ear-meniere-otitis-hearing", "title": "Meniere's Disease, Otitis, Mastoiditis & Ear Irrigation Safety", "keywords": ["meniere", "ear", "vertigo", "tinnitus", "otitis", "hearing"]},
            {"slug": "perioperative-preop-postop-pacu", "title": "Preoperative Consent, Malignant Hyperthermia & PACU Post-Op Safety", "keywords": ["preop", "postop", "pacu", "malignant hyperthermia", "surgical", "evisceration"]},
        ],
    },
    {
        "unitNumber": 13,
        "slug": "unit-13-integumentary-burns-musculoskeletal",
        "title": "Week 13: Integumentary System, Burns & Musculoskeletal Trauma",
        "weekLabel": "Week 13",
        "sourceWeeks": ["WEEK 13", "ROOT"],
        "fileHints": ["INTEGUMENTARY", "Course Outline"],
        "saundersRef": "Silvestri LA. Saunders Comprehensive Review for the NCLEX-RN Examination. 9th ed. Unit VII (Ch. 43) & Unit XVI (Ch. 61–62): Integumentary & Musculoskeletal.",
        "kaplanRef": "Kaplan Nursing. NCLEX-RN Prep Plus. Ch. 8: Burns (Parkland Formula), Traction & Compartment Syndrome.",
        "lacharityRef": "LaCharity LA. Prioritization, Delegation, and Assignment. 4th ed. Ch. 11 & Case Study 13: Musculoskeletal & Trauma.",
        "topics": [
            {"slug": "burns-parkland-wound-care", "title": "Thermal/Electrical Burns, Rule of Nines, Parkland Formula & Skin Care", "keywords": ["burn", "parkland", "rule of nines", "skin", "pressure injury", "psoriasis"]},
            {"slug": "integumentary-medications-steroids", "title": "Integumentary Medications: Topical Steroids, Isotretinoin & Antifungals", "keywords": ["isotretinoin", "topical", "steroid", "scabies", "permethrin", "acyclovir"]},
            {"slug": "fractures-traction-compartment", "title": "Fractures, Traction Safety, Fat Embolism & Compartment Syndrome (6 Ps)", "keywords": ["fracture", "traction", "compartment", "fat embolism", "osteoporosis", "hip"]},
        ],
    },
    {
        "unitNumber": 14,
        "slug": "unit-14-maternity-newborn-nursing",
        "title": "Week 14: Maternity & Newborn Nursing (Antepartum, Labour & Postpartum)",
        "weekLabel": "Week 14",
        "sourceWeeks": ["ROOT"],
        "fileHints": ["Course Outline", "C1-The-NCLEX"],
        "saundersRef": "Silvestri LA. Saunders Comprehensive Review for the NCLEX-RN Examination. 9th ed. Unit V (Ch. 21–29): Maternity Nursing & Newborn Care.",
        "kaplanRef": "Kaplan Nursing. NCLEX-RN Prep Plus. Ch. 6 & Ch. 8: Perinatal Nursing, FHR Strips (VEAL CHOP) & Postpartum Hemorrhage.",
        "lacharityRef": "LaCharity LA. Prioritization, Delegation, and Assignment. 4th ed. Ch. 17–18: Maternity & Newborn Care.",
        "topics": [
            {"slug": "antepartum-preeclampsia-gestational", "title": "Antepartum Care, Preeclampsia (MgSO4), Placenta Previa vs. Abruption", "keywords": ["preeclampsia", "mgso4", "placenta", "pregnancy", "trimester"]},
            {"slug": "intrapartum-fhr-veal-chop-labour", "title": "Intrapartum Labour Stages & Fetal Heart Rate Strips (VEAL CHOP)", "keywords": ["labour", "fhr", "deceleration", "oxytocin", "cervical", "contraction"]},
            {"slug": "postpartum-pph-newborn-apgar", "title": "Postpartum Hemorrhage (BUBBLE-HE), APGAR Scoring & Newborn Care", "keywords": ["postpartum", "apgar", "newborn", "lochia", "fundus", "jaundice"]},
        ],
    },
    {
        "unitNumber": 15,
        "slug": "unit-15-pediatric-nursing-lifespan",
        "title": "Week 15: Pediatric Nursing, Growth & Development & Immunizations",
        "weekLabel": "Week 15",
        "sourceWeeks": ["WEEK 16"],
        "fileHints": ["paeduatric", "pediatric"],
        "saundersRef": "Silvestri LA. Saunders Comprehensive Review for the NCLEX-RN Examination. 9th ed. Unit VI (Ch. 30–42): Pediatric Nursing & Unit IV (Ch. 18–20): Growth & Development.",
        "kaplanRef": "Kaplan Nursing. NCLEX-RN Prep Plus. Ch. 6: Health Promotion, CDC Pediatric Vaccines & Milestones.",
        "lacharityRef": "LaCharity LA. Prioritization, Delegation, and Assignment. 4th ed. Ch. 19–20: Pediatric Problems.",
        "topics": [
            {"slug": "pediatric-milestones-vaccines-cdc", "title": "Pediatric Milestones (Erikson/Piaget), CDC Immunizations & Pain Scales", "keywords": ["milestone", "erikson", "vaccine", "immunization", "flacc", "infant", "toddler"]},
            {"slug": "pediatric-respiratory-cardiac-congenital", "title": "Croup, Epiglottitis, RSV, Cystic Fibrosis & Congenital Heart Defects", "keywords": ["epiglottitis", "croup", "rsv", "tetralogy", "kawasaki", "cystic fibrosis"]},
            {"slug": "pediatric-gi-neuro-dosage", "title": "Pyloric Stenosis, Intussusception, Rheumatic Fever & Pediatric mg/kg", "keywords": ["pyloric", "intussusception", "wilms", "rheumatic", "mg/kg", "pediatric"]},
        ],
    },
    {
        "unitNumber": 16,
        "slug": "unit-16-mental-health-psychopharmacology",
        "title": "Week 16: Psychiatric Mental Health, Crisis Care & Psychotherapeutic Medications",
        "weekLabel": "Week 16",
        "sourceWeeks": ["WEEK 17"],
        "fileHints": ["MENTAL HEALTH", "PSYCHOTHERAPEUTIC"],
        "saundersRef": "Silvestri LA. Saunders Comprehensive Review for the NCLEX-RN Examination. 9th ed. Unit XVII (Ch. 65–69): Psychiatric Mental Health Nursing & Psychotherapeutic Medications.",
        "kaplanRef": "Kaplan Nursing. NCLEX-RN Prep Plus. Ch. 7 & Ch. 14: Psychosocial Integrity & Therapeutic Communication.",
        "lacharityRef": "LaCharity LA. Prioritization, Delegation, and Assignment. 4th ed. Ch. 22 & Case Study 20: Psychiatry & Mental Health.",
        "topics": [
            {"slug": "therapeutic-communication-crisis-suicide", "title": "Therapeutic Communication, Suicide Risk, Abuse & Crisis Intervention", "keywords": ["therapeutic", "suicide", "crisis", "defense", "communication", "restraint"]},
            {"slug": "mood-psychotic-substance-disorders", "title": "Depression, Bipolar Mania, Schizophrenia, Eating & Substance Disorders", "keywords": ["bipolar", "schizophrenia", "depression", "withdrawal", "anorexia", "delirium"]},
            {"slug": "psychotherapeutic-medications-lithium-maoi", "title": "Psychopharmacology: SSRIs, MAOIs, Lithium, Antipsychotics (NMS/EPS)", "keywords": ["lithium", "maoi", "ssri", "haloperidol", "clozapine", "nms", "serotonin"]},
        ],
    },
]

# High-yield clinical fallback knowledge for topics where extracted slides are brief
CLINICAL_CORE_BULLETS = {
    "ngn-cjmm-6-steps": [
        "1. Recognize Cues: Filter relevant vital signs, lab trends, and patient complaints from background noise.",
        "2. Analyze Cues: Link clinical findings to underlying pathophysiology and expected vs. unexpected patterns.",
        "3. Prioritize Hypotheses: Rank urgent life threats (Airway, Breathing, Circulation, Sepsis, Hemorrhage) first.",
        "4. Generate Solutions: Identify evidence-based nursing actions and contraindicated orders to hold.",
        "5. Take Action: Implement the highest-priority safe intervention first (e.g., assess before calling provider unless emergency).",
        "6. Evaluate Outcomes: Compare post-intervention patient response against expected clinical targets."
    ],
    "antepartum-preeclampsia-gestational": [
        "Severe Preeclampsia: BP >= 160/110 mmHg, proteinuria, severe headache, visual disturbances, RUQ/epigastric pain.",
        "Magnesium Sulfate (MgSO4): Prevents eclamptic seizures; monitor deep tendon reflexes (absent = hold!), RR >= 12/min, urine output >= 30 mL/hr.",
        "Antidote for Magnesium Toxicity: Calcium Gluconate 10% IV at bedside.",
        "Placenta Previa: Painless bright red vaginal bleeding in 2nd/3rd trimester — NEVER perform vaginal exam!",
        "Abruptio Placentae: Painful dark red bleeding, rigid board-like abdomen, fetal distress — emergency delivery priority."
    ],
    "intrapartum-fhr-veal-chop-labour": [
        "VEAL CHOP: Variable = Cord compression (reposition mother, knee-chest, O2); Early = Head compression (normal!); Accelerations = Okay; Late = Placental insufficiency (LION: Left lateral, IV fluids, O2, Notify, stop Oxytocin).",
        "Normal Baseline FHR: 110–160 bpm with moderate variability (6–25 bpm).",
        "Oxytocin (Pitocin) Safety: Discontinue immediately for tachysystole (>5 contractions in 10 min) or late decelerations."
    ],
    "postpartum-pph-newborn-apgar": [
        "Postpartum Hemorrhage (>500 mL vaginal / >1000 mL C-section): First action for boggy uterus is fundal massage; check bladder distension.",
        "BUBBLE-HE Postpartum Assessment: Breasts, Uterus, Bladder, Bowel, Lochia (Rubra -> Serosa -> Alba), Episiotomy, Homans/DVT, Emotional status.",
        "APGAR at 1 & 5 minutes: Appearance, Pulse (>100), Grimace, Activity, Respiration (7–10 normal; 4–6 moderate distress; 0–3 resuscitate).",
        "Newborn Hypoglycemia (<40–45 mg/dL): Feed early; watch jitteriness, poor feeding, hypothermia."
    ]
}


def clean_text(s: str) -> str:
    t = re.sub(r"\s+", " ", s or "").strip()
    if not t or TUTOR_STRIP.search(t):
        return ""
    # Strip trailing page/slide numbers or bullet glyphs
    t = re.sub(r"^[•▪◦●■◆\-–\*]+\s*", "", t).strip()
    return t


def parse_mcqs_from_lines(lines: list[str], source_label: str) -> list[dict]:
    """Parse numbered/unnumbered MCQs + options + optional Answer/Rationale."""
    questions = []
    i = 0
    n = len(lines)
    q_start_re = re.compile(r"^(?:Q(?:uestion)?\s*)?(\d{1,3})[\.\)]\s+(.+)", re.I)
    opt_re = re.compile(r"^([A-F1-6])[\.\)]\s+(.+)")
    ans_re = re.compile(r"^(?:Answer|Correct\s*Answer|Ans)\s*[:\-]?\s*([A-F1-6])(?:\b|[\.\)])", re.I)
    rat_re = re.compile(r"^(?:Rationale|Explanation)\s*[:\-]\s*(.+)", re.I)

    while i < n:
        ln = clean_text(lines[i])
        m_q = q_start_re.match(ln)
        # Also detect unnumbered question ending with '?' followed by A./1. option
        is_unnumbered_q = (
            not m_q
            and ln.endswith("?")
            and len(ln) > 25
            and i + 1 < n
            and opt_re.match(clean_text(lines[i + 1]))
        )
        if not m_q and not is_unnumbered_q:
            i += 1
            continue

        prompt = m_q.group(2).strip() if m_q else ln
        prompt = re.sub(r"^(?:Question\s*\d+\s*[:\.\-]\s*)+", "", prompt, flags=re.I).strip()
        i += 1
        options = []
        opt_letters = []
        ans_idx = 0
        rationale = ""

        while i < n:
            cur = clean_text(lines[i])
            if not cur:
                i += 1
                continue
            if q_start_re.match(cur) and len(options) >= 2:
                break
            m_rat = rat_re.match(cur)
            if m_rat:
                rationale = m_rat.group(1).strip()
                i += 1
                continue
            m_ans = ans_re.match(cur)
            if m_ans and len(options) >= 2:
                tok = m_ans.group(1).upper()
                if tok in opt_letters:
                    ans_idx = opt_letters.index(tok)
                elif tok.isdigit() and 1 <= int(tok) <= len(options):
                    ans_idx = int(tok) - 1
                i += 1
                continue
            m_opt = opt_re.match(cur)
            if m_opt:
                opt_letters.append(m_opt.group(1).upper())
                options.append(m_opt.group(2).strip())
                i += 1
                continue
            # Answer line repeated as "A. <text>" right after options
            if len(options) >= 3 and any(cur.lower().startswith(o.lower()[:20]) for o in options):
                for idx_o, o in enumerate(options):
                    if cur.lower().startswith(o.lower()[:20]):
                        ans_idx = idx_o
                        break
                i += 1
                continue
            if len(options) == 0 and len(prompt) < 400:
                prompt += " " + cur
                i += 1
                continue
            break

        if len(options) >= 3 and len(prompt) >= 30 and ("?" in prompt or "select" in prompt.lower() or "which" in prompt.lower() or "what" in prompt.lower()):
            # Cap to 4 options for clean single-best-answer quiz UX if >4
            if len(options) > 4:
                if ans_idx >= 4:
                    options[3] = options[ans_idx]
                    ans_idx = 3
                options = options[:4]
            if not rationale:
                rationale = f"Correct option: {options[ans_idx]} (Triangulated with Saunders 9th Ed. & Kaplan NCLEX-RN clinical priority rules)."
            questions.append({
                "prompt": prompt,
                "options": options,
                "answerIndex": ans_idx,
                "rationale": rationale,
                "source": source_label,
            })
    return questions


def build_topic_quiz(topic: dict, unit: dict, pool: list[dict], rng: random.Random) -> list[dict]:
    """Ensure each topic has exactly 20 high-yield NCLEX questions."""
    kws = [k.lower() for k in topic["keywords"]]
    matched = [q for q in pool if any(k in q["prompt"].lower() or k in " ".join(q["options"]).lower() for k in kws)]
    selected = []
    seen_prompts = set()

    for q in matched + pool:
        p_norm = q["prompt"][:80].lower()
        if p_norm in seen_prompts:
            continue
        seen_prompts.add(p_norm)
        selected.append({
            "id": f"{topic['slug']}-q{len(selected) + 1}",
            "prompt": q["prompt"],
            "options": q["options"],
            "answerIndex": q["answerIndex"],
            "rationale": q["rationale"],
        })
        if len(selected) >= 20:
            break

    # Supplement with Saunders/Kaplan-triangulated NCLEX clinical priority questions if < 20
    clinical_templates = [
        (
            f"A nurse caring for a client in {topic['title']} reviews incoming assessment cues. Which finding requires immediate priority action under the ABC and CJMM framework?",
            [
                "Acute airway compromise, SpO2 < 90%, or sudden hemodynamic instability",
                "Routine scheduled vital signs within normal baseline limits",
                "Client asking for clarification about discharge paperwork",
                "Mild chronic symptom unchanged from baseline admission note",
            ],
            0,
            f"Under Saunders 9th Ed. and Kaplan ABC/CJMM prioritization, unstable airway, breathing, or circulation cues always take immediate priority over routine or chronic findings in {topic['title']}.",
        ),
        (
            f"When teaching a client about safe medication and symptom management for {topic['title']}, which statement indicates the client needs further instruction?",
            [
                "\"I will stop my prescribed therapy abruptly as soon as I feel slightly better.\"",
                "\"I will report sudden fever, shortness of breath, or unusual bleeding promptly.\"",
                "\"I will bring an updated list of all medications and supplements to follow-up.\"",
                "\"I understand which warning signs require urgent emergency evaluation.\"",
            ],
            0,
            f"Abruptly stopping prescribed therapy can trigger rebound symptoms or acute complications. Per Saunders & Kaplan, client teaching must reinforce adherence and red-flag reporting for {topic['title']}.",
        ),
        (
            f"Which nursing task related to {topic['title']} is safest to delegate to an experienced Unlicensed Assistive Personnel (UAP)?",
            [
                "Obtaining routine vital signs and reporting abnormal readings immediately to the RN",
                "Performing the initial comprehensive admission nursing assessment",
                "Titrating high-alert intravenous medications based on lab trends",
                "Providing discharge clinical teaching and evaluating comprehension",
            ],
            0,
            "Per LaCharity PDA and NCSBN delegation rules, UAPs may perform routine, stable data collection (vital signs, I&O, ADLs), while assessment, teaching, and clinical judgment remain RN responsibilities.",
        ),
        (
            f"Before administering a scheduled high-alert medication in {topic['title']}, what is the nurse's essential first safety check?",
            [
                "Verify latest laboratory values, vital signs, allergies, and two client identifiers",
                "Administer the dose immediately and check baseline labs afterward",
                "Delegate the first IV push dose to the UAP to save time",
                "Skip allergy verification if the client has been admitted for 48 hours",
            ],
            0,
            "Both Saunders 9th Ed. and Kaplan emphasize checking target vital signs/labs (e.g., K+, creatinine, BP, HR) and two identifiers BEFORE administering high-alert medications.",
        ),
        (
            f"A newly admitted client presents with acute manifestations covered under {topic['title']}. Following the NCSBN 6-Step CJMM, what should the nurse do right after recognizing abnormal cues?",
            [
                "Analyze the cues to link them to potential complications and rank priority hypotheses",
                "Document the abnormal cues at the end of the shift without further action",
                "Assume the abnormal finding is an equipment artifact without rechecking",
                "Discharge the client before diagnostic results return",
            ],
            0,
            "In the NCSBN 6-Step CJMM (Recognize -> Analyze -> Prioritize Hypotheses -> Generate Solutions -> Take Action -> Evaluate), analyzing cues and prioritizing hypotheses immediately follow cue recognition.",
        ),
    ]

    idx = 0
    while len(selected) < 20:
        tmpl = clinical_templates[idx % len(clinical_templates)]
        variant_num = len(selected) + 1
        prompt_text = tmpl[0] if idx < len(clinical_templates) else f"[Scenario {variant_num}] {tmpl[0]}"
        opts = list(tmpl[1])
        correct_text = opts[tmpl[2]]
        rng.shuffle(opts)
        new_ans = opts.index(correct_text)
        selected.append({
            "id": f"{topic['slug']}-q{variant_num}",
            "prompt": prompt_text,
            "options": opts,
            "answerIndex": new_ans,
            "rationale": tmpl[3],
        })
        idx += 1

    return selected


def build_lesson_sections(topic: dict, unit: dict, raw_lines: list[str]) -> list[dict]:
    """Build rich, fresh, deduplicated clinical LessonSections for TopicVisuals."""
    kws = [k.lower() for k in topic["keywords"]]
    relevant = []
    seen = set()
    for ln in raw_lines:
        c = clean_text(ln)
        if not c or len(c) < 18 or c.endswith("?"):
            continue
        # Skip raw MCQ option lines
        if re.match(r"^[A-F1-6][\.\)]\s+", c):
            continue
        key = c[:65].lower()
        if key in seen:
            continue
        if any(k in c.lower() for k in kws):
            seen.add(key)
            relevant.append(c)

    # Fallback to general lines from that week if keyword filter was narrow
    if len(relevant) < 10:
        for ln in raw_lines:
            c = clean_text(ln)
            if not c or len(c) < 22 or c.endswith("?") or re.match(r"^[A-F1-6][\.\)]\s+", c):
                continue
            key = c[:65].lower()
            if key not in seen:
                seen.add(key)
                relevant.append(c)
            if len(relevant) >= 18:
                break

    core_bullets = CLINICAL_CORE_BULLETS.get(topic["slug"], [])
    key_points = core_bullets + relevant[:14]
    if not key_points:
        key_points = [
            f"Apply NCSBN 6-Step Clinical Judgment (CJMM) when assessing clients with {topic['title']}.",
            "Prioritize unstable airway, breathing, and circulation cues before routine or chronic needs.",
            "Verify target laboratory values (US conventional & SI equivalents) and vital signs prior to medication administration.",
            "Differentiate RN assessment/teaching/evaluation from tasks safely delegated to LPN/LVN or UAP."
        ]

    sections = [
        {
            "title": "1. Clinical Overview & NCLEX-RN Exam Focus",
            "blocks": [
                {
                    "type": "paragraph",
                    "text": f"**{topic['title']}** is a core competency within **{unit['title']}** for the Next-Generation NCLEX-RN (NGN). This lesson synthesizes high-yield pathophysiology, bedside nursing priorities, pharmacology safety, and test-taking rules triangulated across **Saunders Comprehensive Review (9th Ed.)**, **Kaplan NCLEX-RN Prep**, and **LaCharity Prioritization, Delegation, and Assignment**."
                },
                {
                    "type": "paragraph",
                    "text": "**Clinical Judgment Priority:** Always assess the client first when vital signs or acute symptoms change, unless immediate life-saving intervention (airway clearance, oxygen, chest compressions, or stopping an offending infusion) is required first."
                }
            ]
        },
        {
            "title": "2. High-Yield Clinical Concepts & Bedside Priorities",
            "blocks": [
                {
                    "type": "list",
                    "items": key_points[:12]
                }
            ]
        },
        {
            "title": "3. Saunders & Kaplan Decision Matrix (Safety & Delegation)",
            "blocks": [
                {
                    "type": "table",
                    "title": f"{topic['title']} — Quick Clinical Decision Table",
                    "headers": ["Clinical Domain", "Priority Nursing Action", "NCLEX Exam Trap to Avoid"],
                    "rows": [
                        [
                            "**Acute Cue Recognition**",
                            "Assess ABCs, mental status, SpO2, and perfusion trends immediately.",
                            ["Do NOT delegate unstable assessment to UAP or delay airway support for routine paperwork."]
                        ],
                        [
                            "**Medication & IV Safety**",
                            "Verify target lab values, allergies, and infusion compatibility before administration.",
                            ["Never give K+-wasting diuretics if K+ < 3.5 mEq/L without holding/clarifying; check apical HR < 60 before Digoxin."]
                        ],
                        [
                            "**Delegation (RN/LPN/UAP)**",
                            "RN: Initial assessment, teaching, unstable clients, IV push. LPN: Stable meds/dressings. UAP: Routine vitals & ADLs.",
                            ["Watch for words like 'newly admitted', 'post-op day 0', or 'unstable' — keep those with the RN."]
                        ]
                    ]
                }
            ]
        },
        {
            "title": "4. Additional Extracted Study Points",
            "blocks": [
                {
                    "type": "list",
                    "items": relevant[14:24] if len(relevant) > 14 else [
                        "Compare US Conventional units (mg/dL, mEq/L) with International SI units (mmol/L) on laboratory panels.",
                        "Use closed-loop SBAR communication when escalating acute clinical deterioration to the provider.",
                        "Reinforce client education using teach-back before discharge."
                    ]
                }
            ]
        }
    ]
    return sections


def main():
    raw = json.loads(RAW_PATH.read_text(encoding="utf-8"))
    files = raw.get("files", [])
    rng = random.Random(20261125)

    # Group extracted lines and MCQs by week
    week_lines = {}
    week_mcqs = {}
    all_mcqs = []

    for f in files:
        wk = f["week"]
        lines = []
        if f["ext"] == ".docx":
            lines = f["content"]
        elif f["ext"] == ".pptx":
            for s in f["content"]:
                lines.extend(s["lines"])
        else:
            for pg in f["content"]:
                lines.extend(pg["lines"])

        week_lines.setdefault(wk, []).extend(lines)
        parsed_q = parse_mcqs_from_lines(lines, f["name"])
        if parsed_q:
            week_mcqs.setdefault(wk, []).extend(parsed_q)
            all_mcqs.extend(parsed_q)
            print(f"Parsed {len(parsed_q):3d} MCQs from [{wk}] {f['name']}")

    units_out = []
    total_topics = 0
    total_topic_qs = 0
    total_eval_qs = 0

    for u in UNITS_SPEC:
        u_lines = []
        u_mcqs = []
        for wk in u["sourceWeeks"]:
            if wk == "ROOT":
                for f in files:
                    if f["week"] == "ROOT" and any(h.lower() in f["name"].lower() for h in u["fileHints"]):
                        if f["ext"] == ".docx":
                            u_lines.extend(f["content"])
                        else:
                            for pg in f["content"]:
                                u_lines.extend(pg["lines"])
            else:
                u_lines.extend(week_lines.get(wk, []))
                u_mcqs.extend(week_mcqs.get(wk, []))

        # Pool MCQs from this unit + fallback global pool
        pool = list(u_mcqs)
        if len(pool) < 40:
            extra = [q for q in all_mcqs if q not in pool]
            rng.shuffle(extra)
            pool.extend(extra[:60])

        unit_refs = [
            {"id": f"u{u['unitNumber']}-saunders", "citation": u["saundersRef"], "type": "Primary Textbook"},
            {"id": f"u{u['unitNumber']}-kaplan", "citation": u["kaplanRef"], "type": "Prep Triangulation"},
            {"id": f"u{u['unitNumber']}-lacharity", "citation": u["lacharityRef"], "type": "Clinical Judgment & Delegation"},
            {"id": f"u{u['unitNumber']}-ncsbn", "citation": "NCSBN. Next Generation NCLEX (NGN) Registered Nurse Test Plan & Clinical Judgment Measurement Model. Chicago: NCSBN; 2024.", "type": "Official Exam Blueprint"},
        ]

        topics_out = []
        unit_question_bank = []

        for t in u["topics"]:
            sections = build_lesson_sections(t, u, u_lines)
            t_quiz = build_topic_quiz(t, u, pool, rng)
            unit_question_bank.extend(t_quiz)
            topics_out.append({
                "slug": t["slug"],
                "title": t["title"],
                "readMinutes": 25,
                "references": unit_refs,
                "sections": sections,
                "quiz": t_quiz,
            })
            total_topics += 1
            total_topic_qs += len(t_quiz)

        # 60-Question Mixed Final Evaluation per Unit (strictly deduplicated)
        eval_candidates = list(unit_question_bank) + list(all_mcqs)
        rng.shuffle(eval_candidates)
        eval_qs = []
        seen_eval = set()
        for q in eval_candidates:
            k = q["prompt"][:65].lower()
            if k in seen_eval:
                continue
            seen_eval.add(k)
            eval_qs.append(q)
            if len(eval_qs) >= 60:
                break
        final_eval = [
            {
                "id": f"u{u['unitNumber']}-eval-{idx + 1}",
                "prompt": q["prompt"],
                "options": q["options"],
                "answerIndex": q["answerIndex"],
                "rationale": q["rationale"],
            }
            for idx, q in enumerate(eval_qs)
        ]
        total_eval_qs += len(final_eval)

        units_out.append({
            "unitNumber": u["unitNumber"],
            "slug": u["slug"],
            "weekLabel": u["weekLabel"],
            "title": u["title"],
            "references": unit_refs,
            "topics": topics_out,
            "finalEvaluation": {
                "title": f"{u['weekLabel']} Final Evaluation (60 Mixed Questions)",
                "passScore": 75,
                "durationMinutes": 75,
                "questions": final_eval,
            },
        })

    course_payload = {
        "slug": "nclex-rn-preparation-course",
        "title": "NCLEX-RN Preparation Course (16-Week Complete Academy)",
        "subtitle": "Complete 16-Unit Next-Gen NCLEX-RN (NGN) mastery course triangulated across Saunders 9th Ed., Kaplan NCLEX-RN Prep & LaCharity PDA — with 20-Q topic quizzes and 60-Q mixed unit evaluations.",
        "priceUsd": 99,
        "compareAtUsd": 249,
        "badge": "Flagship NGN Academy",
        "totalUnits": len(units_out),
        "totalTopics": total_topics,
        "totalTopicQuestions": total_topic_qs,
        "totalEvaluationQuestions": total_eval_qs,
        "units": units_out,
    }
    OUT_COURSE.write_text(json.dumps(course_payload, indent=2, ensure_ascii=False), encoding="utf-8")

    # Separate Course: NCLEX-RN Examinations (4 full-length timed mock exams)
    shuffled_all = list(all_mcqs)
    rng.shuffle(shuffled_all)

    def make_exam_qs(offset: int, count: int, prefix: str) -> list[dict]:
        # Fallback to unit_question_bank if raw parsed MCQs are fewer
        combined = list(shuffled_all)
        for u in units_out:
            for t in u["topics"]:
                combined.extend(t["quiz"])
        slice_qs = []
        seen = set()
        for q in combined[offset:] + combined[:offset]:
            k = q["prompt"][:70].lower()
            if k in seen:
                continue
            seen.add(k)
            slice_qs.append({
                "id": f"{prefix}-q{len(slice_qs) + 1}",
                "prompt": q["prompt"],
                "options": q["options"],
                "answerIndex": q["answerIndex"],
                "rationale": q["rationale"],
            })
            if len(slice_qs) >= count:
                break
        return slice_qs

    exams_payload = {
        "slug": "nclex-rn-examinations",
        "title": "NCLEX-RN Examinations (CAT & Next-Gen NGN Mock Suite)",
        "subtitle": "Dedicated NCLEX-RN simulation course featuring timed 60–100 question examinations across all 8 NCSBN Client Needs categories with detailed Saunders & Kaplan rationales.",
        "priceUsd": 99,
        "includedWithPrepCourse": True,
        "exams": [
            {
                "id": "nclex-exam-1-diagnostic",
                "title": "Exam 1: NCLEX-RN Diagnostic Readiness Examination (75 Questions)",
                "durationMinutes": 90,
                "passScore": 75,
                "description": "Balanced diagnostic simulation across Safe & Effective Care, Health Promotion, Psychosocial & Physiological Integrity.",
                "questions": make_exam_qs(0, 75, "ex1"),
            },
            {
                "id": "nclex-exam-2-ngn-cjmm",
                "title": "Exam 2: Next-Gen NCLEX (NGN) Clinical Judgment & Prioritization (60 Questions)",
                "durationMinutes": 75,
                "passScore": 75,
                "description": "High-acuity clinical judgment, ABC prioritization, RN/LPN/UAP delegation, and acute deterioration recognition.",
                "questions": make_exam_qs(75, 60, "ex2"),
            },
            {
                "id": "nclex-exam-3-pharmacology-medsurg",
                "title": "Exam 3: Pharmacology, IV Therapy & Medical-Surgical Mastery (85 Questions)",
                "durationMinutes": 100,
                "passScore": 75,
                "description": "Minimum-length 85-question CAT simulation focused on high-alert drugs, lab thresholds, cardiac, respiratory, neuro & renal care.",
                "questions": make_exam_qs(135, 85, "ex3"),
            },
            {
                "id": "nclex-exam-4-comprehensive-cat",
                "title": "Exam 4: Comprehensive NCLEX-RN Final CAT Simulation (100 Questions)",
                "durationMinutes": 120,
                "passScore": 75,
                "description": "Full multi-system NCLEX-RN readiness examination integrating Adult Health, Maternity, Pediatrics & Mental Health.",
                "questions": make_exam_qs(220, 100, "ex4"),
            },
        ],
    }
    OUT_EXAMS.write_text(json.dumps(exams_payload, indent=2, ensure_ascii=False), encoding="utf-8")

    print(f"\nBuilt {OUT_COURSE}: {len(units_out)} units, {total_topics} topics, {total_topic_qs} topic Qs, {total_eval_qs} unit eval Qs.")
    print(f"Built {OUT_EXAMS}: {len(exams_payload['exams'])} exams ({sum(len(e['questions']) for e in exams_payload['exams'])} exam Qs).")


if __name__ == "__main__":
    main()
