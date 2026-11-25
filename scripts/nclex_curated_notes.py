"""
High-yield clinical diagrams, system-specific Saunders 9th Ed. + Kaplan + LaCharity
tables, and priority clinical rules for all 16 NCLEX-RN Course Units (48 Topics).
"""

TOPIC_CURATED_CONTENT = {
    "ngn-cjmm-6-steps": {
        "overview": (
            "The **NCSBN Clinical Judgment Measurement Model (NCJMM)** is the scoring backbone of the Next-Generation NCLEX-RN (NGN). "
            "Rather than testing isolated memorization, NGN unfolding 6-item case studies and standalone clinical judgment items evaluate your "
            "ability to notice unstable patient cues, link them to pathophysiology, rank urgent threats, choose safe interventions, and verify outcomes."
        ),
        "diagram": {
            "title": "NCSBN 6-Step Clinical Judgment Measurement Model (CJMM)",
            "caption": "Sequential cognitive steps tested across every Next-Generation NCLEX (NGN) unfolding case study.",
            "steps": [
                {"step": 1, "label": "Recognize Cues", "detail": "Identify relevant vital signs, labs & history vs. noise"},
                {"step": 2, "label": "Analyze Cues", "detail": "Connect findings to organ systems & potential complications"},
                {"step": 3, "label": "Prioritize Hypotheses", "detail": "Rank urgent life threats (ABCs, sepsis, shock) first"},
                {"step": 4, "label": "Generate Solutions", "detail": "Select safe interventions & identify contraindicated orders"},
                {"step": 5, "label": "Take Action", "detail": "Execute the #1 safest bedside priority intervention first"},
                {"step": 6, "label": "Evaluate Outcomes", "detail": "Compare post-action findings against expected recovery"}
            ]
        },
        "table": {
            "title": "Next-Generation NCLEX (NGN) Item Formats & Partial-Credit Scoring Rules",
            "headers": ["NGN Item Type", "How It Works", "Kaplan / Saunders Scoring Tip"],
            "rows": [
                ["**Extended Multiple Response (EMR)**", "Choose all clinically appropriate actions from 5–10 options.", ["Uses **+/- partial credit scoring**: you gain +1 for right answers and lose -1 for wrong picks. Never guess blindly!"]],
                ["**Bow-Tie Item**", "Select 1 likely condition (center), 2 findings (left), 2 actions & 2 monitoring parameters (right).", ["Start from the **center diagnosis** first, then align causes on the left and immediate actions/labs on the right."]],
                ["**Matrix / Grid**", "Indicate for each row whether an intervention is **Indicated**, **Contraindicated**, or **Non-Essential**.", ["Evaluate each row independently against **ABCs, allergies, and lab contraindications** (e.g., K+ < 3.5 -> hold furosemide)."]],
                ["**Drop-Down / Cloze & Highlight**", "Complete a clinical reasoning sentence or highlight abnormal chart cues.", ["Highlight only **abnormal trends** (rising Cr, dropping BP, SpO2 < 90%) — avoid highlighting normal values."]]
            ]
        },
        "bullets": [
            "**Recognize Cues (Filter Noise):** Focus on trends over time (e.g., BP dropping from 128/78 to 92/58 while HR rises from 76 to 114 = early hypovolemic/septic shock).",
            "**Analyze Cues:** Connect abnormal labs to clinical signs (e.g., Na+ 122 mEq/L + confusion = cerebral edema/seizure risk; K+ 6.4 mEq/L + peaked T waves = immediate cardiac arrest risk).",
            "**Prioritize Hypotheses (Maslow + ABCs):** Airway obstruction, respiratory distress, circulatory collapse, and acute neurological decline always outrank chronic pain or routine teaching.",
            "**Generate Solutions:** Anticipate expected orders (oxygen, isotonic NS/LR bolus, ECG monitoring) and identify **contraindicated orders to clarify/hold** (e.g., beta-blockers in bradycardia, potassium in anuria, vaginal exam in placenta previa).",
            "**Take Action:** Assess the patient first unless immediate life-saving action is clear (e.g., apply oxygen for SpO2 84%, stop IV infusion for anaphylaxis, raise HOB for dyspnea).",
            "**Evaluate Outcomes:** Confirm intervention effectiveness (e.g., urine output >= 30 mL/hr after fluid resuscitation, clear lung sounds after furosemide, glucose rising above 70 mg/dL after D50W)."
        ]
    },
    "cat-exam-blueprint-foreign-nurses": {
        "overview": (
            "The **NCLEX-RN Computerized Adaptive Test (CAT)** adjusts question difficulty dynamically in real time based on your previous responses. "
            "For **internationally educated nurses (IENs)** licensed in Uganda, Kenya, UK, India, or the Philippines, success requires transitioning "
            "from SI laboratory units (`mmol/L`) and local drug names (Paracetamol, Adrenaline) to **US Conventional Units (`mg/dL`, `mEq/L`)** and **USAN drug names (Acetaminophen, Epinephrine)**."
        ),
        "diagram": {
            "title": "Foreign-Trained Nurse NCLEX-RN & US Licensure Sequence",
            "caption": "Core steps from UNMC/home-council credential evaluation to passing the NGN CAT examination.",
            "steps": [
                {"step": 1, "label": "Credential Evaluation", "detail": "Submit transcripts & home license to CGFNS CES / State Board"},
                {"step": 2, "label": "English (If Required)", "detail": "Verify IELTS/OET or English-instruction exemption by State"},
                {"step": 3, "label": "ATT Issued", "detail": "Receive Authorization to Test & schedule at Pearson VUE"},
                {"step": 4, "label": "NGN CAT Exam", "detail": "85–150 questions (max 5 hours) using 95% confidence rule"},
                {"step": 5, "label": "RN License & VisaScreen", "detail": "Obtain State RN license & complete CGFNS VisaScreen"}
            ]
        },
        "table": {
            "title": "NCSBN NCLEX-RN Test Plan — Client Needs Blueprint Weights",
            "headers": ["NCSBN Client Needs Category", "Approx. Weight", "High-Yield Topics Tested"],
            "rows": [
                ["**Management of Care**", "15% – 21%", ["Delegation (RN/LPN/UAP), Prioritization, HIPAA, Advance Directives, Informed Consent"]],
                ["**Safety & Infection Control**", "10% – 16%", ["Airborne/Droplet/Contact precautions, Falls/Restraints, Disaster Triage, Error Prevention"]],
                ["**Pharmacological & Parenteral Therapies**", "13% – 19%", ["High-alert drugs (Insulin, Heparin, Warfarin, Digoxin), IV compatibility, Blood transfusions"]],
                ["**Physiological Adaptation**", "11% – 17%", ["ICU/ER emergencies, Shock, DKA, Sepsis, Increased ICP, ABG compensation, Fluid crises"]],
                ["**Reduction of Risk Potential**", "9% – 15%", ["US lab ranges (BMP, CBC, Coags), Post-op complications, Diagnostic prep (NPO, allergies)"]]
            ]
        },
        "bullets": [
            "**CAT Length & Time:** Minimum **85 questions** (includes 15 unscored pretest items), maximum **150 questions**, total time limit **5 hours** including breaks.",
            "**95% Confidence Interval Rule:** The computer stops when it is 95% certain your ability is either above or below the passing standard — stopping at 85 does NOT mean you failed or passed.",
            "**US Conventional Lab Transition:** Memorize fasting glucose (`70–99 mg/dL`), K+ (`3.5–5.0 mEq/L`), Na+ (`135–145 mEq/L`), Creatinine (`0.7–1.2 mg/dL`), BUN (`10–20 mg/dL`), and INR (`0.8–1.1`, therapeutic warfarin `2.0–3.0`).",
            "**US Drug Name Conversion:** Paracetamol = Acetaminophen; Adrenaline = Epinephrine; Salbutamol = Albuterol; Lignocaine = Lidocaine; Pethidine = Meperidine."
        ]
    },
    "kaplan-saunders-test-strategies": {
        "overview": (
            "Clinical knowledge alone does not guarantee NCLEX-RN success when all four answer choices look partially right. "
            "Combining the **Kaplan Decision Tree** with **Saunders Priority Frameworks** allows you to eliminate distractors consistently and select "
            "the safest, least-invasive, highest-priority nursing response."
        ),
        "diagram": {
            "title": "Kaplan & Saunders 5-Step NCLEX Question Decision Tree",
            "caption": "Systematic elimination process for prioritizing when multiple options appear clinically sound.",
            "steps": [
                {"step": 1, "label": "Identify Topic & Issue", "detail": "Re-read the final question stem — what is specifically asked?"},
                {"step": 2, "label": "Assessment vs. Implementation", "detail": "Have you assessed the patient yet? Assess before acting unless emergency"},
                {"step": 3, "label": "Apply Maslow & ABCs", "detail": "Airway > Breathing > Circulation > Safety > Psychosocial"},
                {"step": 4, "label": "Patient-Centered Safety", "detail": "Stay with the patient; never leave an unstable client unattended"},
                {"step": 5, "label": "Eliminate Absolutes & Traps", "detail": "Reject 'always', 'never', 'why?' questions, and premature referrals"}
            ]
        },
        "table": {
            "title": "Saunders & Kaplan High-Yield Elimination Rules",
            "headers": ["Question Pattern", "Correct Priority Rule", "Classic NCLEX Trap to Reject"],
            "rows": [
                ["**Call Provider vs. Assess/Act**", "Collect vital signs/lungs or perform immediate bedside safety action FIRST.", ["'Notify the healthcare provider' before you have assessed lung sounds, BP, or SpO2."]],
                ["**Therapeutic Communication**", "Reflect client's feelings, use open-ended statements, offer self, focus on client.", ["Asking **'Why?'**, giving false reassurance ('Everything will be fine'), or changing the subject."]],
                ["**Medication Administration Hold Rules**", "Hold if target parameter is unsafe (e.g., HR < 60 for Digoxin/Metoprolol; K+ < 3.5 for Lasix).", ["Giving the drug first and monitoring later, or doubling a missed dose."]],
                ["**Acute vs. Chronic Priority**", "See **unstable, new-onset, post-op day 0, or bleeding** clients before stable/chronic clients.", ["Seeing a routine dressing change or stable discharge teaching client first."]]
            ]
        },
        "bullets": [
            "**Assess vs. Implement Rule:** If the stem gives an incomplete assessment (e.g., client complains of calf pain), **assess first** (inspect/measure/vital signs) rather than intervening blindly — Exception: obvious life threat like choking, ventricular fibrillation, or blood transfusion reaction (stop infusion immediately).",
            "**Least Invasive to Most Invasive:** Try repositioning, deep breathing/coughing, and oxygen before suctioning or intubation; try bladder scan/running water before straight catheterization.",
            "**Look for the Umbrella Option:** When 3 choices are narrow specific steps of the same process, the broader comprehensive option often wins (and vice versa if one option clearly addresses Airway).",
            "**Never 'Pass the Buck':** Avoid answers where the RN tells a distressed client 'Ask your doctor' or leaves an anxious/suicidal client alone."
        ]
    },
    "legal-issues-hipaa-consent": {
        "overview": "Covers US nursing scope-of-practice, **HIPAA privacy**, **Informed Consent**, **Advance Directives (Living Will & Healthcare Proxy)**, tort law (negligence/malpractice), and mandatory reporting of abuse/communicable diseases.",
        "table": {
            "title": "Legal & Ethical Responsibilities of the Registered Nurse",
            "headers": ["Legal Domain", "RN Legal Responsibility", "Common NCLEX Legal Trap"],
            "rows": [
                ["**Informed Consent**", "Verify client competence, voluntary agreement & witness signature.", ["RN does **NOT** explain procedural risks/alternatives — that is the **performing provider's** duty."]],
                ["**HIPAA & Confidentiality**", "Share chart/PHI only with direct care team; log off unattended screens.", ["Do NOT look up charts of family, neighbors, or non-assigned patients out of curiosity."]],
                ["**Incident Reports**", "Document factual care in chart; file internal report separately without bias.", ["Never reference 'Incident Report filed' inside the patient's permanent medical record."]],
                ["**Restraints Safety**", "Obtain provider order (within 1 hr for violent restraints), neurovascular checks q15–30m, release q2h.", ["Never tie restraints to **side rails** (use quick-release knot on bed frame) or order PRN."]]
            ]
        }
    },
    "delegation-rn-lpn-uap": {
        "overview": "Applies **NCSBN Five Rights of Delegation** and **LaCharity Prioritization, Delegation, and Assignment** rules differentiating the scope of practice of **RN**, **LPN/LVN**, and **UAP/CNA**.",
        "table": {
            "title": "RN vs. LPN/LVN vs. UAP Scope-of-Practice Matrix",
            "headers": ["Team Member", "Safely Delegated Tasks", "Must NEVER Be Delegated"],
            "rows": [
                ["**RN (Registered Nurse)**", "Admission assessments, initial teaching, care planning, IV push/blood transfusion, unstable clients.", ["Remain directly responsible for the **EAT** framework: Evaluation, Assessment, Teaching."]],
                ["**LPN / LVN**", "Oral/IM/SubQ meds, stable chronic dressing changes, Foley insertion, reinforcing existing teaching, monitoring chronic clients.", ["Initial admission assessment, IV push meds, blood administration, unstable/fresh post-op clients."]],
                ["**UAP / CNA**", "Routine vitals on stable clients, ADLs, ambulation, strict I&O, bed-making, specimen transport, capillary glucose checks.", ["Any nursing assessment, sterile dressing changes, medication administration, or dysphagia feeding evaluation."]]
            ]
        }
    },
    "prioritization-disaster-triage": {
        "overview": "Synthesizes **emergency room & mass-casualty START triage** alongside **multi-client assignment prioritization** on medical-surgical and critical care units.",
        "table": {
            "title": "Mass Casualty Disaster Triage Color Tagging (START Protocol)",
            "headers": ["Triage Tag", "Priority Level", "Clinical Examples"],
            "rows": [
                ["**RED (Immediate — Emergent)**", "1st Priority — Life-threatening but salvageable within 1 hr.", ["Airway obstruction, tension pneumothorax, active arterial hemorrhage, shock."]],
                ["**YELLOW (Delayed — Urgent)**", "2nd Priority — Serious injuries; stable to wait 30 min–2 hrs.", ["Open fractures with intact distal pulses, large non-life-threatening wounds."]],
                ["**GREEN (Minimal — Walking Wounded)**", "3rd Priority — Minor injuries; can wait hours/days.", ["Minor lacerations, sprains, abrasions, anxiety."]],
                ["**BLACK (Expectant — Deceased/Unsalvageable)**", "4th Priority — Comfort care only when resources limited.", ["Massive head trauma with absent brain activity, fixed pupils, full cardiac arrest in mass disaster."]]
            ]
        }
    },
    "fluid-electrolyte-imbalances": {
        "overview": "Covers isotonic, hypotonic, and hypertonic IV fluids plus US conventional reference ranges and ECG/neurological manifestations of **Sodium**, **Potassium**, **Calcium**, and **Magnesium** imbalances.",
        "table": {
            "title": "NCLEX High-Yield Electrolyte Thresholds (US Conventional Units)",
            "headers": ["Electrolyte", "Normal US Range", "Hypo- Signs / Priority Action", "Hyper- Signs / Priority Action"],
            "rows": [
                ["**Potassium (K+)**", "**3.5 – 5.0 mEq/L**", "U waves, flat T waves, muscle weakness. Oral/IV KCl (**never IV push!** max 10–20 mEq/hr).", "Peaked T waves, wide QRS, VF arrest! Give **Ca gluconate** (stabilize heart), **Insulin + D50**, Kayexalate."],
                ["**Sodium (Na+)**", "**135 – 145 mEq/L**", "Confusion, lethargy, cerebral edema, seizures. Restrict fluids / 3% NS slowly.", "Thirst, dry mucous membranes, agitation, fever. Oral water / hypotonic IV (0.45% NS)."],
                ["**Calcium (Ca2+)**", "**8.5 – 10.5 mg/dL**", "**Chvostek & Trousseau signs**, tetany, laryngospasm! IV Ca gluconate + seizure precautions.", "Lethargy, bone pain, kidney stones, constipation. IV 0.9% NS hydration + loop diuretic."],
                ["**Magnesium (Mg2+)**", "**1.5 – 2.5 mEq/L**", "Hyperactive DTRs, **Torsades de Pointes**, tetany. IV MgSO4.", "Absent DTRs, RR < 12/min, hypotension. Stop MgSO4; antidote **Calcium Gluconate**!"]
            ]
        }
    },
    "arterial-blood-gases-abgs": {
        "overview": "Step-by-step **ROME** interpretation (Respiratory Opposite, Metabolic Equal) of **pH (`7.35–7.45`)**, **PaCO2 (`35–45 mmHg`)**, **HCO3- (`22–26 mEq/L`)**, and compensation status.",
        "table": {
            "title": "ABG Reference Values & ROME Acid-Base Interpretation",
            "headers": ["Imbalance", "pH / PaCO2 / HCO3 Pattern", "Primary Causes & Priority Nursing Action"],
            "rows": [
                ["**Respiratory Acidosis**", "pH **< 7.35**, PaCO2 **> 45**, HCO3 normal/high", "COPD hypoventilation, opioids, pneumonia. **Improve ventilation** (HOB up, bronchodilators, Naloxone if opioid)."],
                ["**Respiratory Alkalosis**", "pH **> 7.45**, PaCO2 **< 35**, HCO3 normal/low", "Hyperventilation (anxiety, pain, early PE, fever). **Slow breathing**, coach pursed-lip breathing, treat cause."],
                ["**Metabolic Acidosis**", "pH **< 7.35**, HCO3 **< 22**, PaCO2 normal/low", "**DKA**, renal failure, severe diarrhea, lactic shock. Treat underlying cause (Insulin/NS for DKA); watch hyperkalemia!"],
                ["**Metabolic Alkalosis**", "pH **> 7.45**, HCO3 **> 26**, PaCO2 normal/high", "NG suctioning, vomiting, excess antacids/diuretics. Replace fluids & **KCl**, treat vomiting."]
            ]
        }
    },
    "diabetes-dka-hhs-insulins": {
        "overview": "Compares **DKA** (Type 1, ketones, Kussmaul respirations, acidosis) vs. **HHS** (Type 2, extreme hyperglycemia > 600 mg/dL, severe dehydration, NO ketones) plus **Insulin Onset/Peak/Duration** profiles.",
        "table": {
            "title": "Insulin Profiles & Peak Hypoglycemia Watch Times",
            "headers": ["Insulin Class & Examples", "Onset", "Peak (Highest Hypoglycemia Risk)", "Nursing Priority"],
            "rows": [
                ["**Rapid-Acting** (Lispro, Aspart, Glulisine)", "10 – 15 min", "**1 – 3 hours**", "Give only when meal tray is **in front of client**!"],
                ["**Short-Acting** (Regular — Humulin R)", "30 – 60 min", "**2 – 4 hours**", "ONLY insulin safe for **IV push/drip (DKA)**; draw clear before cloudy (RN)."],
                ["**Intermediate** (NPH — Cloudy)", "1 – 2 hours", "**4 – 12 hours**", "Roll gently between palms (do not shake); risk for afternoon/evening low glucose."],
                ["**Long-Acting** (Glargine, Detemir)", "1 – 2 hours", "**Peakless (No pronounced peak)**", "Do **NOT mix** in same syringe with any other insulin; give once daily same time."]
            ]
        }
    }
}


UNIT_CURATED_TABLES = {
    4: {
        "title": "Cardiovascular Safety, Antidotes & Hemodynamic Targets",
        "headers": ["Drug / Condition", "Critical Safety Lab / Vital Check", "Toxicity Signs & Antidote"],
        "rows": [
            ["**Digoxin**", "Hold if **apical HR < 60 bpm**; monitor **K+ (3.5–5.0)** (hypokalemia causes toxicity!).", "Yellow-green halos, nausea, bradycardia. Antidote: **Digibind (Digoxin immune Fab)**."],
            ["**Warfarin (Coumadin)**", "Target **INR 2.0–3.0** (mechanical valves 2.5–3.5); steady Vitamin K diet.", "Bleeding gums/melena/INR > 4. Antidote: **Vitamin K (Phytonadione)** + FFP."],
            ["**Heparin IV**", "Target **aPTT 1.5–2.5x control** (~60–80 sec); monitor platelets (HIT risk!).", "Hemorrhage. Antidote: **Protamine Sulfate**."],
            ["**Acute MI (MONA-B)**", "Oxygen (if SpO2 < 94%), Nitroglycerin (check **BP > 90/60**, no PDE5i!), Aspirin 325 mg, Morphine.", "Watch cardiogenic shock & ventricular fibrillation; **Troponin I (>0.04 ng/mL)**."]
        ]
    },
    5: {
        "title": "Respiratory Emergencies, Chest Tubes & Medication Safety",
        "headers": ["Condition / Device", "Immediate Priority Action", "Critical NCLEX Trap"],
        "rows": [
            ["**Chest Tube (Water-Seal)**", "Continuous gentle bubbling in **suction chamber** = normal; **tidaling** in water seal = normal.", "Intermittent bubbling is OK; **continuous bubbling in water seal = air leak**. If dislodged, tape **3 sides**!"],
            ["**COPD Oxygenation**", "Low-flow O2 **1–2 L/min NC** (target SpO2 **88–92%**); teach pursed-lip breathing.", "Never blast high-flow O2 unnecessarily — may blunt hypoxic respiratory drive and worsen CO2 retention."],
            ["**Tension Pneumothorax**", "Tracheal deviation to **unaffected side**, absent breath sounds, JVD, shock.", "Emergency **needle decompression** followed by chest tube insertion."],
            ["**Tuberculosis (RIPE)**", "Airborne precautions (**N95 respirator, negative-pressure room**); sputum negative x3.", "Rifampin turns urine **red-orange**; Isoniazid causes peripheral neuropathy (give **Vitamin B6**) & hepatotoxicity."]
        ]
    },
    6: {
        "title": "Endocrine Crises Comparison (DKA/HHS, Thyroid, Adrenal, SIADH vs. DI)",
        "headers": ["Endocrine Condition", "Hallmark Lab & Assessment Cues", "Priority Nursing Intervention"],
        "rows": [
            ["**Thyroid Storm vs. Myxedema**", "**Storm:** Fever > 104°F, HR > 140, delirium. **Myxedema:** Hypothermia, bradycardia, coma.", "**Storm:** PTU, iodine, beta-blockers, cooling (NO aspirin!). **Myxedema:** IV Levothyroxine + warming."],
            ["**Addison's vs. Cushing's**", "**Addison (Low steroid):** Hypotension, hyperkalemia, bronze skin. **Cushing (High):** Moon face, hyperglycemia, K+ loss.", "**Addisonian Crisis:** Rapid IV 0.9% NS + **IV Hydrocortisone**; never stop chronic steroids abruptly."],
            ["**SIADH vs. Diabetes Insipidus**", "**SIADH (High ADH):** Fluid overload, hyponatremia, high urine SG. **DI (Low ADH):** Polyuria, hypernatremia, low urine SG (<1.005).", "**SIADH:** Fluid restriction + 3% NS if seizures. **DI:** Desmopressin (DDAVP) + IV fluids."]
        ]
    },
    7: {
        "title": "Oncological Emergencies & Neutropenic Precautions",
        "headers": ["Emergency / Hazard", "Key Signs & Critical Labs", "Priority Safety Action"],
        "rows": [
            ["**Neutropenia (ANC < 500–1,000)**", "Even mild **fever (>= 100.4°F / 38°C)** is a medical emergency!", "Private room, strict handwashing, **NO fresh flowers/raw fruits/rectal temps/enemas**."],
            ["**Thrombocytopenia (Plt < 50k)**", "Petechiae, ecchymosis, epistaxis, hematuria.", "Soft toothbrush, **electric razor**, avoid IM injections/NSAIDs/straining."],
            ["**Tumor Lysis Syndrome (TLS)**", "High **K+**, high **P+**, high **Uric Acid**, **LOW Ca2+** -> AKI.", "Aggressive IV hydration + **Allopurinol / Rasburicase** + cardiac monitoring."],
            ["**Brachytherapy (Internal Rad)**", "Sealed radioactive implant inside client.", "Private room, lead shield, **30-min/shift limit**, long forceps + lead container for dislodged implant."]
        ]
    },
    8: {
        "title": "Immune Hypersensitivity, Anaphylaxis & HIV Care",
        "headers": ["Condition", "Priority Manifestations", "First-Line Action & Teaching"],
        "rows": [
            ["**Anaphylaxis (Type I IgE)**", "Stridor, wheezing, angioedema, urticaria, hypotension.", "**IM Epinephrine (1:1000)** into vastus lateralis immediately + O2 + IV 0.9% NS."],
            ["**Latex Allergy**", "Cross-reactivity with **bananas, avocados, kiwis, chestnuts**.", "Screen all clients prior to surgery/catheterization; use latex-free gloves & equipment."],
            ["**HIV/AIDS (CD4 < 200)**", "Risk for Pneumocystis (PCP), TB, Kaposi sarcoma, candidiasis.", "Strict **ART adherence** (>95% doses); TMP-SMX (Bactrim) prophylaxis when CD4 < 200."]
        ]
    },
    9: {
        "title": "GI Bleed, Cirrhosis, Ostomy Care & Key GI Medications",
        "headers": ["Condition / Drug", "Clinical Cues & Nursing Assessment", "Critical Nursing Priority"],
        "rows": [
            ["**Cirrhosis & Hepatic Encephalopathy**", "High **Ammonia**, **asterixis (flapping tremor)**, ascites, esophageal varices.", "Give **Lactulose** (titrate to **2–3 soft stools/day** to excrete ammonia!); prevent bleeding/straining."],
            ["**Appendicitis & Peritonitis**", "RLQ McBurney's point pain; sudden relief + rigid abdomen = perforation!", "**NPO**, NO heat pack & NO laxatives/enemas prior to surgical evaluation."],
            ["**Ostomy Care**", "Healthy stoma is **beefy red/pink & moist**; pale/dusky/black = ischemia!", "Report black/necrotic stoma immediately; empty pouch when **1/3 to 1/2 full**."],
            ["**Sucralfate & PPIs**", "Sucralfate coats ulcers; Omeprazole/Pantoprazole suppress acid.", "Give **Sucralfate 1 hr before meals/other meds**; PPIs before breakfast."]
        ]
    },
    10: {
        "title": "Neurological Emergencies (Stroke, Increased ICP, SCI & Neuro Meds)",
        "headers": ["Neuro Condition / Drug", "Key Warning Signs", "Priority Action / Threshold"],
        "rows": [
            ["**Increased ICP & Cushing's Triad**", "Late triad: **Widening pulse pressure**, **bradycardia**, **irregular respirations**; early sign = change in LOC.", "HOB **30 degrees**, midline head, avoid straining/clustering suctioning, give **IV Mannitol**."],
            ["**Acute Ischemic Stroke (tPA)**", "Rule out hemorrhage with **STAT Non-Contrast Head CT** first!", "Alteplase (tPA) window typically **<= 3 to 4.5 hours**; monitor neuro checks & BP q15m; no anticoagulants x24h."],
            ["**Autonomic Dysreflexia (SCI >= T6)**", "Sudden **severe HTN**, pounding headache, flushing/sweating above injury.", "**Sit upright immediately** -> check Foley kink/bladder distension -> loosen tight clothes."],
            ["**Phenytoin (Dilantin)**", "Therapeutic range **10–20 mcg/mL**; causes gingival hyperplasia.", "Push IV slowly (<= 50 mg/min) in **0.9% NS only**; regular soft brushing + dental visits."]
        ]
    },
    11: {
        "title": "Renal Failure (AKI Phases), CKD & Dialysis Precautions",
        "headers": ["Renal Concept", "Key Labs & Assessment", "Critical Nursing Precautions"],
        "rows": [
            ["**AKI Oliguric Phase**", "Urine **< 400 mL/24h (< 30 mL/hr)**, high K+, high Cr/BUN, fluid overload.", "Daily weights, strict I&O, restrict K+/P+/fluid; watch **peaked T waves**."],
            ["**Hemodialysis AV Fistula**", "Palpate **thrill** & auscultate **bruit** at fistula site every shift.", "**NO BP cuffs, NO venipunctures, NO IV lines** on the fistula arm! Hold dialyzable meds before HD."],
            ["**Peritoneal Dialysis**", "Warm dialysate before instilling; monitor outflow volume.", "**Cloudy outflow = Peritonitis** (notify provider & culture!). Reposition if slow drain."]
        ]
    },
    12: {
        "title": "Sensory (Eye & Ear) & Perioperative Safety",
        "headers": ["Disorder / Phase", "Hallmark Clinical Cues", "Nursing Priority"],
        "rows": [
            ["**Glaucoma (High IOP)**", "Tunnel vision, halos, ocular emergency in angle-closure.", "Give **Timolol** / **Pilocarpine**; **NO mydriatics (atropine)** in angle-closure glaucoma!"],
            ["**Retinal Detachment**", "Flashes of light, floaters, **'curtain falling' over vision** (painless).", "Bedrest, eye patches, maintain prescribed post-op positioning (often **face-down**)."],
            ["**Meniere's Disease**", "Episodic **vertigo**, tinnitus, sensorineural hearing loss.", "Low-sodium diet, avoid caffeine/alcohol/sudden head turns; **Meclizine**."],
            ["**Malignant Hyperthermia (OR)**", "Early sign: **unexplained hypercarbia (rising EtCO2)**, tachycardia, jaw rigidity; late = extreme fever.", "Stop triggering volatile anesthetics/succinylcholine + give **IV Dantrolene** + cold fluids."]
        ]
    },
    13: {
        "title": "Burns (Parkland Formula), Traction & Compartment Syndrome",
        "headers": ["Condition", "Formula / Assessment", "Priority Action"],
        "rows": [
            ["**Major Burns & Airway**", "Singed nasal hairs, soot in sputum, hoarseness = **inhalation injury**!", "Intubate/O2 early. **Parkland:** **4 mL x kg x %TBSA (LR)** -> give **1/2 in first 8 hrs** from time of burn."],
            ["**Compartment Syndrome (6 Ps)**", "**Severe pain unrelieved by opioids/elevation**, paresthesia, pallor, pulselessness (late), poikilothermia.", "Keep limb **at heart level** (do NOT elevate above heart or ice), loosen cast, prep for **fasciotomy**."],
            ["**Skeletal Traction & Fat Embolism**", "Weights must **hang freely** (never lift/rest on floor). Fat embolism: **petechiae on chest/neck** + dyspnea.", "Elevate HOB, apply O2, assess respiratory/neuro changes in long-bone/pelvic fractures."]
        ]
    },
    15: {
        "title": "Pediatric Emergencies, Congenital Defects & Growth Milestones",
        "headers": ["Pediatric Condition", "Hallmark Presentation", "Priority Safety Rule"],
        "rows": [
            ["**Epiglottitis vs. Croup**", "**Epiglottitis:** Tripod posture, drooling, dysphagia, high fever. **Croup:** Barking seal cough, stridor.", "**Epiglottitis: NEVER examine throat with tongue blade** (airway spasm!) — keep calm + prep intubation."],
            ["**Pyloric Stenosis vs. Intussusception**", "**Pyloric:** Olive-shaped RUQ mass, projectile non-bilious vomiting. **Intussusception:** **Currant-jelly stools**, sausage mass.", "Correct dehydration/electrolytes before pyloromyotomy; air/hydrostatic enema for intussusception."],
            ["**Tetralogy of Fallot (Tet Spells)**", "Acute cyanosis, irritability, hypoxia during crying/feeding.", "Place infant immediately in **knee-to-chest position**, give O2 & morphine."],
            ["**Pediatric Milestones & Meds**", "2 mo: social smile; 6 mo: sits w/ support; 12 mo: 3x birth weight; 24 mo: 2-word phrases.", "Measure oral liquids with **oral syringe** (never kitchen spoon); calculate **safe mg/kg/day**."]
        ]
    },
    16: {
        "title": "Psychiatric Safety, Lithium, MAOIs & Antipsychotic Emergencies",
        "headers": ["Medication / Crisis", "Critical Toxicity / Interaction", "Priority Intervention"],
        "rows": [
            ["**Lithium**", "Therapeutic **0.6–1.2 mEq/L** (>1.5 toxic); **low Na+ or dehydration increases toxicity!**", "Maintain normal sodium & hydration; report coarse tremor, ataxia, severe diarrhea, confusion."],
            ["**MAOIs (Phenelzine, Tranylcypromine)**", "Aged cheese, cured meats, red wine (**Tyramine**) -> **Hypertensive Crisis**!", "Teach strict tyramine-free diet; 14-day washout before starting SSRIs (Serotonin Syndrome risk)."],
            ["**Neuroleptic Malignant Syndrome (NMS)**", "High fever, severe **'lead-pipe' rigidity**, tachycardia, high CPK.", "**Medical emergency:** Stop antipsychotic immediately, cool client, give **Dantrolene / Bromocriptine**."],
            ["**Alcohol Withdrawal (DTs)**", "Tremors, hallucinations, autonomic hyperactivity (48–72 hrs post-stop).", "Administer **Benzodiazepines (Lorazepam / Chlordiazepoxide)**, CIWA scoring, thiamine (B1)."]
        ]
    }
}
