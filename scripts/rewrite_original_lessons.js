#!/usr/bin/env node
/* Rewrite selected lesson bodies into original Nursing Uganda study notes. */
const fs = require("node:fs");
const path = require("node:path");

const ROOT = process.cwd();
const DATA_FILE = path.join(ROOT, "assets", "data", "curriculum.json");
const DEFAULT_TARGETS = [
  {
    programmeId: "bachelor-of-nursing-science-top-up",
    unitId: "pharmacology-i",
    mode: "pharmacology",
    slugScope: "topic"
  },
  {
    programmeId: "certificate-in-nursing",
    unitId: "medical-nursing-i-and-pharmacology-i",
    mode: "medical-pharmacology",
    slugScope: "programme-unit"
  },
  {
    programmeId: "diploma-nursing-direct",
    unitId: "medical-nursing-i-and-pharmacology-i",
    mode: "medical-pharmacology",
    slugScope: "programme-unit"
  },
  {
    programmeId: "certificate-in-midwifery",
    unitId: "midwifery-i-and-pharmacology-i",
    mode: "midwifery-pharmacology",
    slugScope: "programme-unit-position"
  },
  {
    programmeId: "certificate-in-nursing",
    unitId: "medical-nursing-ll-and-pharmacology-ll",
    mode: "medical-pharmacology",
    slugScope: "programme-unit"
  },
  {
    programmeId: "diploma-nursing-direct",
    unitId: "medical-nursing-ii-and-tropical-medicines",
    mode: "medical-pharmacology",
    slugScope: "programme-unit"
  },
  {
    programmeId: "diploma-nursing-direct",
    unitId: "mental-health-nursing-i-and-pharmacology-ii",
    mode: "mental-pharmacology",
    slugScope: "programme-unit"
  },
  {
    programmeId: "diploma-nursing-direct",
    unitId: "mental-health-nursing-ii-pharmacology-iii",
    mode: "mental-pharmacology",
    slugScope: "programme-unit"
  },
  {
    programmeId: "diploma-nursing-extension",
    unitId: "mental-health-nursing-ii-pharmacology-iii",
    mode: "mental-pharmacology",
    slugScope: "programme-unit"
  }
];

const SKIP_TOPIC_RE = /^(terms|privacy policy|disclaimer|about(?: us)?|click here\b.*|want notes in pdf\??.*|home|blog|contact|whatsapp|support|login|register|share|comments?|(?:nurses|midwives)\s+revision|index)$/i;

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function titleCase(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b([a-z])/g, (match) => match.toUpperCase());
}

function block(type, text) {
  return { type, text };
}

function inferPharmacologyFrame(topicTitle, groupTitle) {
  const title = topicTitle.toLowerCase();
  const group = groupTitle.toLowerCase();
  const combined = `${title} ${group}`;

  if (/classification/.test(combined)) {
    return {
      theme: "drug classification",
      definition: `${topicTitle} organizes medicines into groups according to their source, mechanism, therapeutic use, chemical structure, safety profile or body system effect. For a nurse, classification is not only a naming exercise; it helps predict indications, contraindications, common adverse effects and the observations required after administration.`,
      conceptBullets: [
        "Therapeutic classification groups medicines by the condition they treat.",
        "Pharmacological classification groups medicines by how they act in the body.",
        "Chemical classification groups medicines with similar molecular structures.",
        "Nursing classification thinking links the drug group to assessment, patient education and monitoring."
      ],
      assessment: [
        "Confirm the patient diagnosis or reason for treatment before giving the medicine.",
        "Check allergies, previous reactions and current medicines from the same or related class.",
        "Identify class-specific risks such as bleeding, hypoglycaemia, respiratory depression, ototoxicity or renal impairment."
      ]
    };
  }

  if (/absorption|distribution|metabolism|elimination|clearance|adme|kinetic/.test(combined)) {
    return {
      theme: "pharmacokinetics",
      definition: `${topicTitle} describes what the body does to a medicine after administration. The nurse should connect absorption, distribution, metabolism and elimination with route selection, dose timing, organ function and patient response.`,
      conceptBullets: [
        "Absorption is the movement of a medicine from the site of administration into circulation.",
        "Distribution is movement from the blood into tissues, influenced by blood flow, protein binding and barriers such as the blood-brain barrier.",
        "Metabolism changes medicines into active or inactive forms, commonly through liver enzymes.",
        "Elimination removes medicines or metabolites, commonly through the kidneys, bile, lungs or stool."
      ],
      assessment: [
        "Assess age, nutrition, hydration, pregnancy status and organ function where relevant.",
        "Review renal and liver risk before medicines with narrow safety margins.",
        "Monitor onset, peak effect, duration and signs of accumulation or toxicity."
      ]
    };
  }

  if (/mechanism|action|receptor|signaling|cholinergic|adrenergic|sympath|parasympath|autonomic|ans/.test(combined)) {
    return {
      theme: "pharmacodynamics",
      definition: `${topicTitle} explains how a medicine produces its effect at receptors, enzymes, ion channels or other body targets. Nursing care links the expected action to measurable patient outcomes and early recognition of exaggerated or unwanted effects.`,
      conceptBullets: [
        "Agonists activate receptors and produce a response.",
        "Antagonists block receptors and reduce or prevent a response.",
        "Dose-response thinking helps predict therapeutic benefit and toxicity.",
        "Autonomic medicines can affect heart rate, blood pressure, secretions, bronchi, bladder and pupil size."
      ],
      assessment: [
        "Measure baseline observations that relate to the drug action, such as pulse, blood pressure, respiratory rate or mental state.",
        "Check contraindications before medicines that alter autonomic or central nervous system function.",
        "Evaluate whether the expected response occurs within the correct time frame."
      ]
    };
  }

  if (/adverse|side effect|toxicity|interaction/.test(combined)) {
    return {
      theme: "medicine safety",
      definition: `${topicTitle} covers harmful, unintended or excessive responses to medicines. The nurse's role is prevention, early detection, immediate action and accurate reporting so that harm is reduced and future treatment is safer.`,
      conceptBullets: [
        "Predictable adverse effects are often related to the known action of a medicine.",
        "Allergic reactions may occur even at normal doses and require urgent recognition.",
        "Toxicity risk rises with overdose, impaired elimination, drug interactions or narrow therapeutic index medicines.",
        "Patient education helps clients report warning symptoms early."
      ],
      assessment: [
        "Ask about allergies, previous adverse reactions, herbal medicines and over-the-counter medicines.",
        "Observe for rash, swelling, breathing difficulty, abnormal bleeding, confusion, severe vomiting or collapse.",
        "Report serious reactions promptly and document the medicine, dose, time, findings and actions taken."
      ]
    };
  }

  if (/route|administration|storage|ordering|prescription|dosage|calculation|rational|authority|act|nda|regulation/.test(combined)) {
    return {
      theme: "safe medicine systems",
      definition: `${topicTitle} focuses on the systems that make medicine use safe: clear prescriptions, accurate calculations, correct storage, lawful supply, rational selection and careful administration. In Uganda, nurses must connect classroom pharmacology with professional accountability and facility policy.`,
      conceptBullets: [
        "A complete medicine order should identify the patient, medicine, dose, route, frequency, duration and prescriber.",
        "Storage protects medicine potency and prevents misuse, expiry errors or accidental exposure.",
        "Dosage calculation requires units, concentration and patient-specific factors to be checked carefully.",
        "Rational drug use means the patient receives the appropriate medicine, in the right dose and duration, at the lowest practical risk."
      ],
      assessment: [
        "Check the prescription for completeness, legibility and clinical appropriateness.",
        "Verify calculations with another trained person when risk is high.",
        "Assess patient understanding, affordability, adherence barriers and safe home storage."
      ]
    };
  }

  if (/penicillin|cephalosporin|aminoglycoside|tetracycline|sulphonamide|quinolone|antitubercular|antimalarial|antihelminthic|antifungal|antiviral|antimicrobial|chemotherapeutic|anticancer/.test(combined)) {
    return {
      theme: "anti-infective and chemotherapeutic medicines",
      definition: `${topicTitle} reviews medicines used to treat infection or abnormal cell growth. Nursing care must balance therapeutic effect, resistance prevention, toxicity monitoring and patient adherence.`,
      conceptBullets: [
        "Choice of antimicrobial depends on likely organism, site of infection, severity, patient risk and local guidance.",
        "Correct timing and completion of treatment help reduce treatment failure and resistance.",
        "Some agents require renal, liver, hearing, blood count or neurological monitoring.",
        "Patient counselling should cover dose timing, missed doses, side effects and when to return urgently."
      ],
      assessment: [
        "Assess fever, infection focus, allergies, pregnancy status and prior antimicrobial use.",
        "Collect ordered specimens before first dose when possible and safe.",
        "Monitor clinical response, adverse effects and adherence throughout treatment."
      ]
    };
  }

  if (/histamine|serotonin|migraine|eicosanoid|nsaid|prostanoid|autacoid/.test(combined)) {
    return {
      theme: "local mediator pharmacology",
      definition: `${topicTitle} deals with medicines that influence locally acting chemical mediators involved in pain, fever, inflammation, allergy, vascular tone and migraine. The nurse should understand both symptom relief and risk monitoring.`,
      conceptBullets: [
        "Autacoids are locally produced substances that act near their site of release.",
        "Histamine is important in allergic responses, gastric acid secretion and inflammation.",
        "Eicosanoids contribute to pain, fever, inflammation, platelet activity and smooth muscle effects.",
        "NSAIDs can relieve pain and inflammation but may increase gastric, renal, bleeding or asthma-related risks."
      ],
      assessment: [
        "Assess pain, fever, allergy history, asthma history, gastric symptoms and bleeding risk.",
        "Check concurrent anticoagulants, steroids or other anti-inflammatory medicines.",
        "Teach the patient to report black stools, severe abdominal pain, wheezing, swelling or persistent symptoms."
      ]
    };
  }

  if (/central nervous|cns|cardiovascular|digestive|reproductive|urinary|organ system/.test(combined)) {
    return {
      theme: "organ-system pharmacology",
      definition: `${topicTitle} connects medicine action to a specific body system. The nurse should review normal physiology first, then ask how each medicine changes that system and which observations prove benefit or harm.`,
      conceptBullets: [
        "Organ-system medicines are best learned with anatomy, physiology and disease patterns together.",
        "Baseline assessment guides whether a medicine is appropriate and how response will be measured.",
        "Many system medicines require ongoing monitoring because effects may be delayed or cumulative.",
        "Patient teaching should translate the medicine purpose into clear everyday instructions."
      ],
      assessment: [
        "Record baseline system-specific observations before administration.",
        "Monitor therapeutic response using measurable clinical signs.",
        "Escalate deterioration, severe adverse effects or unexpected lack of response."
      ]
    };
  }

  return {
    theme: "general pharmacology",
    definition: `${topicTitle} is part of pharmacology, the study of medicines and their safe use in patient care. For Nursing Uganda learners, the topic should always be tied to assessment, the nursing process, patient education, monitoring and professional accountability.`,
    conceptBullets: [
      "Pharmacology links medicine action with patient condition and expected outcomes.",
      "Safe administration depends on correct patient, medicine, dose, route, time, documentation and evaluation.",
      "Clinical judgement is needed when age, pregnancy, organ function, allergies or interactions increase risk.",
      "Patient education improves adherence and helps detect adverse effects early."
    ],
    assessment: [
      "Confirm indication, allergies, current medicines and baseline observations.",
      "Check dose, route, timing and contraindications before administration.",
      "Evaluate response and document findings after the medicine is given."
    ]
  };
}

function nursingProcessBlocks(topicTitle, frame) {
  return [
    block("bullet", `Assessment: identify why the medicine or drug group is needed, the patient's baseline condition, allergies, current medicines and risk factors.`),
    block("bullet", `Planning: set a clear expected outcome, such as reduced pain, controlled blood pressure, improved infection signs or absence of adverse effects.`),
    block("bullet", `Implementation: administer safely, explain the medicine in simple language and follow facility policy for high-alert medicines.`),
    block("bullet", `Evaluation: compare the patient's response with the expected effect and report poor response, toxicity or serious adverse reactions.`),
    block("paragraph", `In ${frame.theme}, the nursing process prevents medicine administration from becoming a mechanical task. It keeps the focus on whether the patient is safer and improving.`)
  ];
}

function patientTeachingBlocks(topicTitle, frame) {
  return [
    block("bullet", `Explain the purpose of ${topicTitle.toLowerCase()} in language the patient can repeat back.`),
    block("bullet", "Teach the dose schedule, missed-dose advice, storage instructions and warning signs that require review."),
    block("bullet", "Discourage sharing medicines, stopping treatment early or mixing medicines with unreported herbal or over-the-counter products."),
    block("bullet", "Encourage the patient to keep follow-up appointments and bring all current medicines for review."),
    block("paragraph", "Good medicine teaching is practical, respectful and specific to the patient's literacy, culture, resources and home situation.")
  ];
}

function pharmacologyReferences(topicTitle, frame) {
  const refs = [
    "Open RN. Nursing Pharmacology, 2nd edition. NCBI Bookshelf, CC BY 4.0.",
    "Nursing Uganda local enrichment PDF: open-rn-nursing-pharmacology.pdf.",
    "Facility medicines policies, current Uganda clinical guidelines and prescriber instructions."
  ];

  if (/safe medicine systems|regulation/.test(frame.theme)) {
    refs.push("Uganda professional and medicines regulation materials for lawful ordering, storage and administration.");
  }
  if (/anti-infective/.test(frame.theme)) {
    refs.push("Local antimicrobial treatment guidance and antimicrobial stewardship protocols.");
  }
  return refs;
}

function inferMedicalFrame(topicTitle, groupTitle) {
  const title = topicTitle.toLowerCase();
  const group = groupTitle.toLowerCase();
  const combined = `${title} ${group}`;

  if (/tropical|communicable|transmission|epidemiology|gastroenteritis|measles|malaria|tuberculosis|leprosy|trypanosomiasis|helminth|onchocerciasis|schistosomiasis|elephantiasis|filariasis|dracunculosis|typhoid|dysentery|cholera|brucellosis|ebola|yellow fever|mumps|chicken pox|rabies|hemorrhagic|sars|anthrax|hepatitis|scabies|tetanus/.test(combined)) {
    return {
      system: "tropical and communicable disease",
      meaning: `${topicTitle} is studied as a tropical or communicable-disease nursing topic because it can affect the patient, household and community. Nursing care connects early recognition, isolation or prevention measures, hydration and comfort, medicine adherence, surveillance and health education.`,
      causes: [
        "Causes may include bacteria, viruses, parasites, fungi, toxins or vectors, depending on the condition.",
        "Risk increases with unsafe water, poor sanitation, crowding, low immunisation coverage, vector exposure, animal contact, delayed treatment or weak infection-prevention practices.",
        "Outbreak potential is higher when cases are missed, reporting is delayed or community prevention messages are unclear."
      ],
      assessment: [
        "Assess fever, rash, cough, diarrhoea, vomiting, bleeding, dehydration, pain, mental state, nutritional status and exposure history.",
        "Ask about travel, contact with a known case, unsafe water or food, mosquito or animal exposure, immunisation status and similar illness in the community.",
        "Monitor vital signs, fluid balance, level of consciousness, danger signs and response to ordered treatment."
      ],
      complications: "Possible complications include severe dehydration, shock, sepsis, anaemia, neurological injury, respiratory failure, bleeding, renal impairment, disability, death or community outbreak spread."
    };
  }

  if (/hypertension|heart|cardiac|pericard|myocard|endocard|rheumatic|embol|throm|arterio|circulatory|cardiovascular/.test(combined)) {
    return {
      system: "cardiovascular",
      meaning: `${topicTitle} is studied as a cardiovascular nursing problem because it affects perfusion, oxygen delivery, workload of the heart, tissue viability and the patient's ability to perform daily activities.`,
      causes: [
        "Modifiable risks may include smoking, alcohol misuse, high salt intake, obesity, inactivity, uncontrolled diabetes, poor adherence and delayed care seeking.",
        "Non-modifiable risks may include age, family history and previous heart or vascular disease.",
        "Acute worsening may follow infection, anaemia, pregnancy stress, medicine non-adherence, fluid overload or severe pain."
      ],
      assessment: [
        "Check blood pressure, pulse rate, respiratory rate, oxygen saturation, temperature, pain score and level of consciousness.",
        "Assess chest pain, dyspnoea, palpitations, dizziness, oedema, cyanosis, fatigue and exercise tolerance.",
        "Observe perfusion signs such as capillary refill, skin temperature, urine output and changes in mental state."
      ],
      complications: "Possible complications include shock, heart failure, stroke, renal impairment, pulmonary oedema, thromboembolism or sudden deterioration."
    };
  }

  if (/asthma|pneumonia|bronchitis|tuberculosis|influenza|cold|sinus|tonsil|pharyng|laryng|otitis|emphysema|respiratory|lung|airway/.test(combined)) {
    return {
      system: "respiratory",
      meaning: `${topicTitle} is a respiratory nursing topic because it can interfere with airway patency, breathing effort, oxygen exchange, infection control and safe activity.`,
      causes: [
        "Infection, irritants, allergens, poor ventilation, smoke exposure, chronic illness and delayed treatment may contribute depending on the condition.",
        "Transmission risk is higher where people live or work in crowded, poorly ventilated spaces.",
        "Children, older adults, pregnant women, malnourished clients and immunocompromised clients need closer observation."
      ],
      assessment: [
        "Assess respiratory rate, work of breathing, oxygen saturation, temperature, pulse, chest pain and ability to speak full sentences.",
        "Observe cough pattern, sputum, wheeze, stridor, crepitations, cyanosis, nasal flaring or use of accessory muscles.",
        "Ask about duration of symptoms, contact history, smoking exposure, previous attacks, medicines used and danger signs."
      ],
      complications: "Possible complications include hypoxia, dehydration, sepsis, respiratory failure, spread of infection, chronic lung damage or death if severe disease is untreated."
    };
  }

  if (/stomatitis|gastritis|ulcer|jaundice|hepatitis|cirrhosis|cholecystitis|digestive|gastro|liver|bile/.test(combined)) {
    return {
      system: "digestive and hepatobiliary",
      meaning: `${topicTitle} belongs to digestive and hepatobiliary nursing because it can affect nutrition, hydration, pain control, drug metabolism, elimination and infection prevention.`,
      causes: [
        "Contributing factors may include infection, alcohol use, unsafe food or water, medicine irritation, gallstones, chronic viral disease or delayed review.",
        "Nutritional status, hygiene, concurrent medicines and previous abdominal illness influence severity and recovery.",
        "Hepatobiliary disease may change bleeding risk, mental state and the body's handling of medicines."
      ],
      assessment: [
        "Assess pain site and character, vomiting, stool changes, appetite, hydration, weight change, fever and abdominal distension.",
        "Observe jaundice, pallor, bleeding tendency, altered mental state, dark urine, pale stool or signs of shock.",
        "Review medicine use, alcohol history, food exposure, contact history and previous similar episodes."
      ],
      complications: "Possible complications include bleeding, perforation, dehydration, malnutrition, hepatic failure, sepsis, electrolyte imbalance or severe pain."
    };
  }

  if (/urinary|renal|kidney|urethritis|cystitis|pyelonephritis|glomerulonephritis|nephrotic|renal failure/.test(combined)) {
    return {
      system: "urinary and renal",
      meaning: `${topicTitle} is a renal or urinary nursing topic because it can affect fluid balance, electrolyte control, blood pressure, waste elimination, medicine clearance and infection risk.`,
      causes: [
        "Contributing factors may include ascending infection, poor hydration, obstruction, hypertension, diabetes, immune injury, nephrotoxic medicines or delayed treatment.",
        "Pregnancy, catheter use, older age, childhood, chronic disease and recurrent urinary infection increase risk.",
        "Renal impairment can change medicine safety because many medicines or metabolites are cleared through the kidneys."
      ],
      assessment: [
        "Assess urine frequency, pain, dysuria, colour, haematuria, flank pain, oedema, fever, nausea, blood pressure and fluid intake.",
        "Monitor urine output, weight, hydration, pulse, temperature, respiratory status and mental state when disease is severe.",
        "Review diabetes, hypertension, recent infection, catheter use, medicines, herbal products and previous renal disease."
      ],
      complications: "Possible complications include sepsis, acute kidney injury, chronic kidney disease, fluid overload, electrolyte imbalance, hypertension, anaemia or uraemic symptoms."
    };
  }

  if (/nervous|meningitis|encephalitis|stroke|cerebral vascular|cva|coma|unconscious|poliomyelitis|neurolog/.test(combined)) {
    return {
      system: "central nervous system",
      meaning: `${topicTitle} is a neurological nursing topic because it can affect consciousness, movement, speech, swallowing, breathing, safety, infection risk and long-term function.`,
      causes: [
        "Possible causes include infection, vascular blockage or bleeding, trauma, toxins, metabolic disturbance, immune disease or complications of chronic illness.",
        "Delay in treatment can increase disability, aspiration risk, pressure injury, contractures and family burden.",
        "Neurological conditions often require repeated assessment because deterioration may be subtle at first."
      ],
      assessment: [
        "Assess level of consciousness, orientation, pupils, limb strength, speech, swallowing, seizures, headache, neck stiffness and vital signs.",
        "Use airway, breathing and circulation priorities before detailed neurological assessment in an unconscious or convulsing patient.",
        "Ask about onset time, fever, trauma, medicines, hypertension, diabetes, previous stroke, infection exposure and functional baseline."
      ],
      complications: "Possible complications include raised intracranial pressure, aspiration, seizures, respiratory failure, sepsis, paralysis, contractures, pressure injuries or permanent disability."
    };
  }

  if (/diabetes|thyrotoxicosis|endocrine|thyroid|hormone/.test(combined)) {
    return {
      system: "endocrine",
      meaning: `${topicTitle} is an endocrine nursing topic because hormone imbalance can disturb metabolism, fluid balance, cardiovascular stability, infection risk, weight, mood and long-term organ function.`,
      causes: [
        "Contributing factors may include autoimmune disease, genetic risk, infection, pregnancy, lifestyle factors, iodine or thyroid disease, medicines or delayed diagnosis.",
        "Stress, infection, missed medicines and poor nutrition can worsen endocrine control quickly.",
        "Long-term endocrine disease requires patient education because daily self-care affects outcomes."
      ],
      assessment: [
        "Assess weight change, appetite, thirst, urination, fatigue, tremors, sweating, palpitations, heat intolerance, wounds, infection signs and mental state.",
        "Check pulse, blood pressure, temperature, hydration, blood glucose where available and signs of acute deterioration.",
        "Review medicines, adherence, diet, follow-up, family history and barriers to long-term care."
      ],
      complications: "Possible complications include hypoglycaemia, hyperglycaemic crisis, dehydration, infection, cardiovascular strain, thyroid storm, neuropathy, renal disease or eye complications."
    };
  }

  if (/anaemia|anemia|leukemia|leukaemia|coagulation|blood|haemat/.test(combined)) {
    return {
      system: "blood and immune response",
      meaning: `${topicTitle} is a medical nursing topic linked to oxygen transport, immunity, bleeding control, fatigue and safe preparation for procedures or referral.`,
      causes: [
        "Possible causes include nutritional deficiency, chronic infection, malaria, blood loss, inherited disorders, malignancy or medicine effects.",
        "Pregnancy, childhood growth, heavy menstruation and chronic disease can increase vulnerability.",
        "Bleeding disorders require careful review of trauma, procedures, medicines and family history."
      ],
      assessment: [
        "Assess pallor, fatigue, dizziness, breathlessness, fever, bleeding, bruising, lymph node enlargement and infection signs.",
        "Check pulse, blood pressure, respiratory rate, temperature and functional ability.",
        "Ask about diet, bleeding history, malaria episodes, medicines, family history and previous transfusion."
      ],
      complications: "Possible complications include severe anaemia, infection, haemorrhage, shock, organ strain, treatment toxicity or delayed diagnosis of serious disease."
    };
  }

  if (/prevent|causes|factor|sign|symptom|general|terms|definition|introduction|disease/.test(combined)) {
    return {
      system: "general medical nursing",
      meaning: `${topicTitle} gives the foundation for recognizing disease patterns early, preventing avoidable complications and planning nursing care that fits the patient's condition and home situation.`,
      causes: [
        "Disease may result from infection, genetics, environment, nutrition, lifestyle, trauma, medicines or failure of body systems.",
        "Risk increases when poverty, stigma, delayed review, low health literacy or poor access to follow-up reduces timely care.",
        "Prevention requires individual teaching, family support, immunisation where relevant, hygiene, safe medicines and early referral."
      ],
      assessment: [
        "Start with airway, breathing, circulation, disability and exposure before moving to focused history.",
        "Collect the main complaint, onset, duration, associated symptoms, medicines used and previous illness.",
        "Use vital signs and focused examination to decide urgency, nursing priorities and need for referral."
      ],
      complications: "Complications depend on the disease but commonly include dehydration, sepsis, shock, disability, chronic organ damage or death when serious illness is missed."
    };
  }

  return {
    system: "medical nursing",
    meaning: `${topicTitle} should be learned as a patient-care problem, not only as a definition. The nurse connects pathophysiology, assessment findings, medicines, comfort, prevention and follow-up.`,
    causes: [
      "Identify likely causes from the history, examination findings, age, environment, occupation, family history and current medicines.",
      "Consider infection, inflammation, degeneration, trauma, nutrition, lifestyle and chronic disease as common pathways.",
      "Look for factors that make the patient vulnerable, such as pregnancy, childhood, older age, disability or low access to care."
    ],
    assessment: [
      "Take baseline vital signs and repeat them according to severity.",
      "Ask about onset, duration, associated symptoms, medicines already used and previous similar illness.",
      "Observe hydration, nutrition, pain, mobility, mental state, hygiene and family support."
    ],
    complications: "Complications may include worsening symptoms, delayed recovery, disability, organ failure, infection spread or emergency referral needs."
  };
}

function medicalReferences(topicTitle, frame) {
  const refs = [
    "Brunner and Suddarth's Textbook of Medical-Surgical Nursing for adult medical nursing principles.",
    "Current Uganda Clinical Guidelines and facility protocols for assessment, referral and treatment decisions.",
    "World Health Organization disease-specific guidance where relevant to prevention, infection control and public health.",
    "Nursing Uganda local PDF library and class notes for unit outcomes and Ugandan practice context."
  ];

  if (/respiratory/.test(frame.system)) {
    refs.push("WHO tuberculosis, pneumonia and respiratory infection materials for infection-control and community-prevention principles.");
  }
  if (/cardiovascular/.test(frame.system)) {
    refs.push("WHO noncommunicable disease guidance for cardiovascular risk reduction and long-term follow-up.");
  }
  if (/digestive|hepatobiliary/.test(frame.system)) {
    refs.push("WHO hepatitis, food safety and infection-prevention materials where the condition involves liver disease or gastrointestinal infection.");
  }
  if (/tropical|communicable/.test(frame.system)) {
    refs.push("WHO communicable-disease, outbreak-response and infection-prevention guidance matched to the condition.");
    refs.push("Uganda Ministry of Health surveillance and outbreak-reporting guidance where applicable.");
  }
  return refs;
}

function inferMidwiferyFrame(topicTitle, groupTitle) {
  const title = topicTitle.toLowerCase();
  const group = groupTitle.toLowerCase();
  const combined = `${title} ${group}`;

  if (/antenatal|pregnan|minor disorder|health education/.test(combined)) {
    return {
      phase: "antenatal care",
      meaning: `${topicTitle} is studied in midwifery as part of safe care for the pregnant woman and fetus before birth. The midwife links normal pregnancy changes with screening, health education, respectful communication and early recognition of danger signs.`,
      physiology: [
        "Pregnancy changes the cardiovascular, respiratory, renal, gastrointestinal, endocrine and musculoskeletal systems.",
        "Normal discomforts should be distinguished from symptoms that suggest anaemia, infection, hypertensive disease, bleeding or fetal compromise.",
        "Antenatal contacts are used to prevent complications, prepare the family for birth and connect the mother to timely referral when needed."
      ],
      assessment: [
        "Confirm gestational age, parity, previous pregnancy outcomes, current complaints, fetal movements and danger signs.",
        "Check blood pressure, pulse, temperature, pallor, oedema, urine findings where available, fundal height and fetal heart where appropriate.",
        "Assess nutrition, medicines, immunisation, HIV/syphilis testing status where relevant, malaria prevention, emotional wellbeing and family support."
      ],
      management: [
        "Provide respectful privacy, explain findings, document the visit and arrange the next contact or referral.",
        "Give health education on nutrition, rest, hygiene, birth preparedness, danger signs, medicines, malaria prevention and facility delivery.",
        "Escalate abnormal blood pressure, bleeding, severe abdominal pain, convulsions, fever, reduced fetal movement or severe anaemia signs."
      ],
      danger: "Urgent danger signs include vaginal bleeding, severe headache, blurred vision, convulsions, severe abdominal pain, fever, foul discharge, severe breathlessness, swelling of face or hands and reduced fetal movements."
    };
  }

  if (/labou?r|first stage|second stage|mechanism|partograph|vaginal examination|episiotomy|management of 2nd stage/.test(combined)) {
    return {
      phase: "labour and birth",
      meaning: `${topicTitle} belongs to intrapartum midwifery care. The midwife protects the woman and baby by assessing progress, supporting normal birth, preventing infection and identifying delay or distress early.`,
      physiology: [
        "Labour depends on coordinated uterine contractions, cervical effacement and dilatation, descent of the presenting part and maternal effort.",
        "Progress is assessed together with maternal condition and fetal wellbeing, not by contractions alone.",
        "Respectful care, hydration, bladder care, positioning and companionship can support physiological labour."
      ],
      assessment: [
        "Assess contractions, cervical dilatation when indicated, descent, membranes, liquor, moulding, caput and maternal coping.",
        "Monitor maternal pulse, blood pressure, temperature, urine, hydration, pain and bleeding.",
        "Monitor fetal heart rate according to stage of labour and facility protocol."
      ],
      management: [
        "Use the partograph where indicated to record labour progress and trigger timely action.",
        "Maintain hand hygiene, clean technique, privacy, emotional support and clear communication before every examination or procedure.",
        "Prepare birth equipment, neonatal resuscitation readiness, uterotonics according to protocol and referral support if progress becomes abnormal."
      ],
      danger: "Refer or call senior help for obstructed labour signs, abnormal fetal heart rate, heavy bleeding, convulsions, fever, prolonged rupture of membranes, severe maternal exhaustion or failure of descent."
    };
  }

  if (/third stage|placenta/.test(combined)) {
    return {
      phase: "third stage and placenta care",
      meaning: `${topicTitle} focuses on the period after birth of the baby until delivery and examination of the placenta. The midwife's priority is prevention and early treatment of postpartum haemorrhage while keeping mother and newborn safe.`,
      physiology: [
        "Placental separation occurs after birth as the uterus contracts and the placental site reduces in size.",
        "Good uterine tone is essential to close maternal blood vessels and prevent excessive bleeding.",
        "Placenta and membranes must be examined because retained tissue can cause haemorrhage or infection."
      ],
      assessment: [
        "Observe bleeding, uterine tone, pulse, blood pressure, colour, level of consciousness and pain.",
        "Check signs of placental separation and inspect the placenta, membranes and cord after delivery.",
        "Assess the perineum and birth canal for tears, episiotomy extension or ongoing bleeding."
      ],
      management: [
        "Follow facility protocol for active management of the third stage, including uterotonic use when prescribed or authorized.",
        "Keep the bladder empty, monitor uterine contraction and massage the uterus if atony is suspected according to protocol.",
        "Escalate immediately for heavy bleeding, retained placenta, shock signs or incomplete placenta."
      ],
      danger: "Danger signs include heavy bleeding, boggy uterus, retained placenta, maternal collapse, rising pulse, falling blood pressure, severe pallor or an incomplete placenta."
    };
  }

  if (/puerperium|postnatal|post natal/.test(combined)) {
    return {
      phase: "postnatal and puerperium care",
      meaning: `${topicTitle} covers recovery after birth, establishment of breastfeeding, newborn adaptation and prevention of maternal complications. The midwife observes both mother and baby because danger signs may develop after discharge.`,
      physiology: [
        "The uterus involutes, lochia changes, lactation begins and body systems gradually return toward the non-pregnant state.",
        "Normal postnatal changes must be separated from infection, haemorrhage, thrombosis, hypertension and mental-health concerns.",
        "Early breastfeeding, warmth, hygiene and family support improve maternal and newborn outcomes."
      ],
      assessment: [
        "Assess maternal vital signs, bleeding, uterine fundus, bladder, bowel, perineum, breasts, pain, mobility and emotional wellbeing.",
        "Assess newborn breathing, warmth, feeding, colour, cord, activity, urine, stool and danger signs.",
        "Ask about support at home, ability to return for review and understanding of danger signs."
      ],
      management: [
        "Support breastfeeding, hygiene, nutrition, rest, postnatal exercises and family planning counselling according to readiness.",
        "Teach cord care, warmth, immunisation follow-up and when to return urgently.",
        "Arrange postnatal review and referral if mother or newborn findings are abnormal."
      ],
      danger: "Maternal danger signs include heavy bleeding, fever, foul lochia, severe headache, convulsions, chest pain, breathlessness, calf pain or severe sadness. Newborn danger signs include poor feeding, fast breathing, fever, hypothermia, jaundice, convulsions or lethargy."
    };
  }

  return {
    phase: "midwifery foundations",
    meaning: `${topicTitle} introduces the knowledge, language and clinical judgement used in safe midwifery practice. The topic should be connected to respectful maternity care, normal physiology, assessment, documentation and referral.`,
    physiology: [
      "Midwifery begins with understanding normal pregnancy, labour, birth, puerperium and newborn adaptation.",
      "Terminology is useful when it improves clear communication, accurate documentation and safe handover.",
      "A normal finding must always be interpreted with the woman's history, gestational age and current observations."
    ],
    assessment: [
      "Use respectful introduction, consent, privacy and clear explanation before assessment.",
      "Collect history, vital signs and focused findings according to the stage of pregnancy, labour or postnatal period.",
      "Identify danger signs early and decide whether routine care, closer observation or referral is required."
    ],
    management: [
      "Communicate findings in simple language and involve the woman in decisions where possible.",
      "Document assessments, actions, education and referral decisions clearly.",
      "Follow facility protocols, infection-prevention standards and scope of practice."
    ],
    danger: "Any abnormal bleeding, severe pain, convulsions, fever, severe headache, breathing difficulty, reduced fetal movements, fetal distress or maternal collapse requires urgent escalation."
  };
}

function midwiferyReferences(topicTitle, frame) {
  const refs = [
    "Myles Textbook for Midwives for core midwifery principles and normal maternity care.",
    "World Health Organization recommendations on antenatal, intrapartum and postnatal care.",
    "Current Uganda Clinical Guidelines and facility maternity protocols for assessment, referral and emergency care.",
    "Nursing Uganda local PDF library and class notes for curriculum outcomes and Ugandan training context."
  ];

  if (/labour|birth/.test(frame.phase)) {
    refs.push("WHO guidance on respectful intrapartum care and monitoring labour progress.");
  }
  if (/postnatal|puerperium/.test(frame.phase)) {
    refs.push("WHO postnatal care guidance for maternal and newborn danger signs.");
  }
  return refs;
}

function inferMentalHealthFrame(topicTitle, groupTitle) {
  const title = topicTitle.toLowerCase();
  const group = groupTitle.toLowerCase();
  const combined = `${title} ${group}`;

  if (/suicide|suicidal|self-harm|violence|aggression|panic|catatonic|stupor|status epilepticus|emergenc/.test(combined)) {
    return {
      focus: "psychiatric emergency and safety",
      meaning: `${topicTitle} is a psychiatric emergency or high-risk mental-health topic. Nursing care prioritises immediate safety, calm assessment, de-escalation, observation, emergency referral and protection of dignity.`,
      risk: [
        "Risk may rise with acute distress, intoxication, psychosis, severe mood symptoms, withdrawal, trauma, previous attempts, poor support or access to harmful means.",
        "Immediate risk is suggested by threats, plans, weapons, severe agitation, command hallucinations, confusion, recent loss or inability to agree to safety.",
        "Protective factors include supportive family, willingness to accept help, spiritual or personal reasons for living, treatment engagement and reduced access to lethal means."
      ],
      assessment: [
        "Assess airway, breathing, circulation and injury first when the patient is medically unstable.",
        "Ask directly and respectfully about suicidal thoughts, violent intent, hallucinations, substance use, recent triggers and available means.",
        "Observe behaviour, speech, mood, thought content, perception, orientation, impulse control and ability to cooperate with care."
      ],
      priorities: [
        "Remove hazards, reduce stimulation, keep exits accessible and call for help early according to facility protocol.",
        "Use calm, short statements; avoid arguing, shaming, crowding or sudden movements.",
        "Maintain close observation and document risk findings, actions taken, people informed and the patient's response."
      ]
    };
  }

  if (/law|rights|standard|treatment act|legal/.test(combined)) {
    return {
      focus: "rights, law and professional accountability",
      meaning: `${topicTitle} links psychiatric nursing with human rights, professional standards, lawful care and protection from abuse. The nurse must balance safety with autonomy, confidentiality, consent and least-restrictive care.`,
      risk: [
        "Rights violations may occur when patients are restrained, secluded, medicated, disclosed or detained without clear justification and documentation.",
        "Stigma and family pressure can lead to delayed care, abandonment or coercive decisions.",
        "Legal risk increases when staff ignore facility policy, fail to document, or use restriction as punishment instead of safety care."
      ],
      assessment: [
        "Assess decision-making capacity, risk to self or others, consent, family involvement and the reason for any restrictive intervention.",
        "Check whether the patient understands information, can express choices and can participate in the care plan.",
        "Review facility policy, mental-health law requirements and escalation pathways before major rights-limiting actions."
      ],
      priorities: [
        "Use the least restrictive safe option and review restrictions frequently.",
        "Explain care decisions to the patient in respectful language and document consent, refusal, risk and review.",
        "Protect privacy, confidentiality and dignity during admission, assessment, treatment and discharge planning."
      ]
    };
  }

  if (/autism|attention deficit|adhd|child|children|intellectual|mental retardation|eating disorder|adolescent/.test(combined)) {
    return {
      focus: "child and adolescent mental health",
      meaning: `${topicTitle} is studied through child and adolescent mental-health nursing because symptoms affect development, school, family relationships, safety and long-term functioning.`,
      risk: [
        "Risk factors may include genetic vulnerability, neurodevelopmental differences, trauma, family stress, substance exposure, chronic illness, bullying or unmet learning needs.",
        "Children may show distress through behaviour, sleep, appetite, school performance, withdrawal, aggression or physical complaints.",
        "Protective factors include stable caregivers, school support, early assessment, structured routines and reduced stigma."
      ],
      assessment: [
        "Gather history from the child or adolescent and caregiver while protecting privacy and listening to both perspectives.",
        "Assess development, communication, behaviour, mood, sleep, appetite, school function, peer relationships, substance use and safeguarding concerns.",
        "Observe interaction, attention, affect, play or communication style, and risk of self-harm or harm from others."
      ],
      priorities: [
        "Use age-appropriate communication and involve caregivers in practical care plans.",
        "Support routine, safety, sleep, nutrition, school linkage and follow-up.",
        "Refer when there is severe risk, abuse, psychosis, developmental regression, suicidal behaviour or failure to function."
      ]
    };
  }

  if (/substance|alcohol|opium|narcotic|abuse|poison|organophosphate/.test(combined)) {
    return {
      focus: "substance use and toxicology",
      meaning: `${topicTitle} is a mental-health and safety topic because substance use or poisoning can affect judgement, behaviour, breathing, circulation, family wellbeing and long-term recovery.`,
      risk: [
        "Risk increases with dependence, withdrawal, overdose, peer pressure, trauma, poverty, untreated mental illness or easy access to substances.",
        "Acute danger signs include reduced consciousness, respiratory depression, seizures, severe agitation, vomiting, collapse or suicidal intent.",
        "Relapse risk rises when discharge planning ignores triggers, withdrawal symptoms, stigma and family stress."
      ],
      assessment: [
        "Assess airway, breathing, circulation, consciousness, pupil size, vital signs, injuries, substance taken, amount, time and co-ingestants.",
        "Ask about pattern of use, withdrawal symptoms, previous treatment, mental-health symptoms, self-harm risk and social support.",
        "Observe for intoxication, withdrawal, aggression, confusion, hallucinations or medical complications."
      ],
      priorities: [
        "Stabilise urgent medical problems and follow poison or overdose protocols within facility capacity.",
        "Use non-judgemental communication and avoid moralising language.",
        "Plan referral, brief counselling, family support and relapse-prevention education."
      ]
    };
  }

  if (/psychopharmacology|anxiolytic|hypnotic|mood stabilizer|anti-depress|antidepress|anti-psychotic|antipsychotic|anticonvulsant/.test(combined)) {
    return {
      focus: "psychopharmacology",
      meaning: `${topicTitle} is a psychopharmacology topic. Nursing care connects medicine purpose, expected response, side-effect monitoring, adherence support, safety education and respectful follow-up.`,
      risk: [
        "Medicine risk rises with overdose, missed doses, abrupt withdrawal, polypharmacy, alcohol or drug use, pregnancy, liver or renal disease and poor follow-up.",
        "Some psychiatric medicines may cause sedation, falls, movement disorders, metabolic effects, sexual side effects, dependence or toxicity.",
        "Stigma and side effects are common reasons patients stop treatment without review."
      ],
      assessment: [
        "Assess diagnosis or target symptoms, baseline mood, sleep, appetite, psychosis, suicide risk, substance use and current medicines.",
        "Monitor therapeutic response and adverse effects using observable behaviour and patient report.",
        "Check adherence barriers, understanding, family support, cost and follow-up plan."
      ],
      priorities: [
        "Administer exactly as prescribed and avoid abrupt discontinuation unless directed in an emergency.",
        "Teach expected benefits, side effects, warning signs and the need for follow-up before changing or stopping medicine.",
        "Escalate severe sedation, rigidity, fever, confusion, seizures, allergic reaction, suicidal worsening or suspected toxicity."
      ]
    };
  }

  if (/mood|bipolar|depress|anxiety|post-traumatic|ptsd|psychosis|schizophren|mental illness|classification|etiological|aetiological|signs|symptoms|assessment|therapeutic|psychological therap/.test(combined)) {
    return {
      focus: "psychiatric assessment and recovery care",
      meaning: `${topicTitle} is a psychiatric nursing topic that links mental status, behaviour, emotions, thought patterns, relationships and daily function. The nurse supports safety, therapeutic communication, treatment adherence and recovery.`,
      risk: [
        "Risk factors may include family history, trauma, chronic stress, substance use, physical illness, medication effects, social isolation and stigma.",
        "Deterioration may appear as sleep change, withdrawal, agitation, hopelessness, hallucinations, poor self-care or impaired judgement.",
        "Protective factors include early help-seeking, supportive relationships, meaningful activity, adherence and crisis planning."
      ],
      assessment: [
        "Use a calm psychiatric interview and mental status examination: appearance, behaviour, speech, mood, thought, perception, cognition, insight and judgement.",
        "Assess risk of self-harm, harm to others, neglect, abuse, substance use and medical causes of symptoms.",
        "Explore strengths, coping methods, family support, culture, spiritual resources and barriers to follow-up."
      ],
      priorities: [
        "Build rapport, listen without ridicule and set clear, respectful boundaries.",
        "Develop a care plan that includes safety, sleep, nutrition, activity, medicines or therapy, family education and follow-up.",
        "Escalate psychosis, severe depression, suicidal risk, aggression, confusion, catatonia or inability to care for self."
      ]
    };
  }

  return {
    focus: "mental-health nursing",
    meaning: `${topicTitle} should be studied as a mental-health nursing topic that combines therapeutic communication, safety assessment, human rights, recovery planning and family or community support.`,
    risk: [
      "Mental-health problems may be influenced by biological, psychological, social, cultural and spiritual factors.",
      "Stigma, poverty, trauma, substance use, chronic illness and poor access to care can worsen outcomes.",
      "Protective care builds safety, dignity, support, adherence and hope."
    ],
    assessment: [
      "Assess mental status, risk, physical health, substance use, medicines, family support and daily functioning.",
      "Listen for the patient's own explanation of the problem and what help they are willing to accept.",
      "Document findings clearly and repeat assessment when behaviour or risk changes."
    ],
    priorities: [
      "Use therapeutic communication, privacy and respectful boundaries.",
      "Promote safety, sleep, nutrition, hygiene, medication adherence, activity and follow-up.",
      "Refer urgently when risk, psychosis, severe withdrawal, confusion or medical instability is present."
    ]
  };
}

function mentalHealthReferences(topicTitle, frame) {
  const refs = [
    "WHO mental health guidance and mhGAP materials for assessment, risk recognition and priority interventions.",
    "Psychiatric and Mental Health Nursing textbooks for therapeutic communication, mental status examination and recovery-oriented care.",
    "Current Uganda Clinical Guidelines, mental-health law and facility protocols for referral, rights, emergency care and medicines.",
    "Nursing Uganda local PDF library and class notes for curriculum outcomes and Ugandan practice context."
  ];

  if (/emergency|safety/.test(frame.focus)) {
    refs.push("Facility suicide-risk, violence-prevention, observation and emergency referral protocols.");
  }
  if (/psychopharmacology|substance/.test(frame.focus)) {
    refs.push("Open RN Nursing Pharmacology and facility medicine-safety protocols for psychiatric and controlled medicines.");
  }
  return refs;
}

function buildOriginalPharmacologyLesson({ programme, unit, group, topic }) {
  const frame = inferPharmacologyFrame(topic.title, group.title);
  const context = `${programme.label} - ${unit.code ? `${unit.code}: ` : ""}${unit.title}`;
  const title = topic.title;

  return {
    title,
    excerpt: `${title} explained as original Nursing Uganda pharmacology notes with nursing assessment, safe administration, patient teaching and reference guidance.`,
    originalRewrite: {
      status: "pilot-original",
      rewrittenAtUtc: new Date().toISOString(),
      referenceBasis: "Open RN Nursing Pharmacology PDF, Nursing Uganda curriculum structure and local medicines-safety context."
    },
    references: pharmacologyReferences(title, frame),
    sections: [
      {
        title: "Definition And Nursing Meaning",
        blocks: [
          block("paragraph", frame.definition),
          block("paragraph", `In ${context}, study this topic by asking three questions: what does the medicine or drug group do, what patient factors change its safety, and what must the nurse monitor before and after administration?`)
        ]
      },
      {
        title: "Core Concepts",
        blocks: frame.conceptBullets.map((item) => block("bullet", item))
      },
      {
        title: "Nursing Assessment Focus",
        blocks: frame.assessment.map((item) => block("bullet", item))
      },
      {
        title: "Safe Administration And Monitoring",
        blocks: [
          block("bullet", "Use the medication rights and pause when the order, patient condition or available medicine does not match."),
          block("bullet", "Check high-risk medicines, unfamiliar doses and calculations with a competent colleague or prescriber according to local policy."),
          block("bullet", "Monitor the patient at the time the medicine is expected to begin working, not only at the end of the shift."),
          block("bullet", "Document the medicine, dose, route, time, relevant observations, patient education and response."),
          block("paragraph", "Escalate immediately if the patient develops breathing difficulty, collapse, severe allergic features, uncontrolled bleeding, marked confusion, convulsions or any rapidly worsening condition.")
        ]
      },
      {
        title: "Nursing Process Application",
        blocks: nursingProcessBlocks(title, frame)
      },
      {
        title: "Patient Teaching",
        blocks: patientTeachingBlocks(title, frame)
      },
      {
        title: "Uganda Practice Notes",
        blocks: [
          block("bullet", "Use generic medicine names where possible and confirm brand names carefully because different brands may contain the same active ingredient."),
          block("bullet", "Consider stock availability, affordability, storage conditions and referral options when planning patient education."),
          block("bullet", "Follow facility protocols for controlled medicines, cold-chain items, antibiotics, injections and emergency medicines."),
          block("bullet", "Report medicine incidents and near misses honestly so the system can become safer.")
        ]
      },
      {
        title: "Study Wrap",
        blocks: [
          block("bullet", `Revise ${title.toLowerCase()} by linking the drug group, expected effect, adverse effects and nursing checks.`),
          block("bullet", "Confirm baseline observations, contraindications, interactions and monitoring needs before administration."),
          block("bullet", "Connect patient teaching to safe self-administration, adherence, storage and follow-up."),
          block("bullet", "Escalate when the medicine should be held, the dose looks unsafe or the patient deteriorates.")
        ]
      },
      {
        title: "References For Further Reading",
        blocks: pharmacologyReferences(title, frame).map((item) => block("bullet", item))
      }
    ]
  };
}

function buildOriginalMedicalNursingLesson({ programme, unit, group, topic }) {
  if (/pharmacology|drug|medicine/i.test(group.title || "")) {
    return buildOriginalPharmacologyLesson({ programme, unit, group, topic });
  }

  const frame = inferMedicalFrame(topic.title, group.title);
  const context = `${programme.label} - ${unit.code ? `${unit.code}: ` : ""}${unit.title}`;
  const title = topic.title;
  const references = medicalReferences(title, frame);

  return {
    title,
    excerpt: `${title} explained as original Nursing Uganda medical nursing notes with assessment cues, nursing management, prevention, patient education and referral priorities.`,
    originalRewrite: {
      status: "expanded-original",
      rewrittenAtUtc: new Date().toISOString(),
      referenceBasis: "Medical-surgical nursing textbooks, Nursing Uganda local PDF library, Uganda clinical-practice context and WHO public-health guidance."
    },
    references,
    sections: [
      {
        title: "Definition And Clinical Meaning",
        blocks: [
          block("paragraph", frame.meaning),
          block("paragraph", `In ${context}, study ${title.toLowerCase()} by linking the disease process to the patient's symptoms, the nurse's observations, immediate comfort needs, medicines or procedures ordered, and prevention of complications.`)
        ]
      },
      {
        title: "Causes And Risk Factors",
        blocks: frame.causes.map((item) => block("bullet", item))
      },
      {
        title: "Assessment And Key Findings",
        blocks: frame.assessment.map((item) => block("bullet", item))
      },
      {
        title: "Nursing Management",
        blocks: [
          block("bullet", "Prioritise airway, breathing, circulation, pain, hydration, nutrition, elimination, mobility, skin integrity and psychological support."),
          block("bullet", "Position the patient for comfort and safety, maintain privacy, reduce anxiety and involve the family where appropriate."),
          block("bullet", "Administer prescribed treatment safely, observe response and report deterioration early."),
          block("bullet", "Maintain infection-prevention measures, especially hand hygiene, safe waste handling, cough etiquette and appropriate isolation where indicated."),
          block("bullet", "Document assessment findings, interventions, patient response, education given and referral decisions clearly.")
        ]
      },
      {
        title: "Medicines And Treatment Support",
        blocks: [
          block("bullet", "Check allergies, pregnancy status where relevant, current medicines, vital signs and contraindications before giving ordered medicines."),
          block("bullet", "Explain the purpose of each medicine in simple language and observe for expected benefit and adverse effects."),
          block("bullet", "Encourage adherence, completion of prescribed courses and follow-up review, especially for chronic disease or infectious conditions."),
          block("bullet", "Escalate when symptoms worsen despite treatment, when side effects are severe, or when the patient cannot access essential medicines.")
        ]
      },
      {
        title: "Patient Education And Prevention",
        blocks: [
          block("bullet", `Teach the patient and family what ${title.toLowerCase()} means, the warning signs to report and the reason for follow-up.`),
          block("bullet", "Use practical messages about hygiene, nutrition, safe medicines, rest, activity, fluid intake, avoidance of triggers and early review."),
          block("bullet", "Check understanding by asking the patient to repeat the plan in their own words."),
          block("bullet", "Adapt teaching to literacy level, language, culture, cost, distance from care and available family support.")
        ]
      },
      {
        title: "Complications And Danger Signs",
        blocks: [
          block("paragraph", frame.complications),
          block("bullet", "Seek urgent review for collapse, severe breathlessness, chest pain, confusion, convulsions, persistent high fever, uncontrolled bleeding, severe dehydration or rapidly worsening weakness."),
          block("bullet", "Refer early when the condition is beyond the facility's staffing, medicines, oxygen, laboratory or monitoring capacity.")
        ]
      },
      {
        title: "Uganda Practice Notes",
        blocks: [
          block("bullet", "Use available facility protocols and current Uganda Clinical Guidelines when deciding referral urgency, ordered investigations and treatment support."),
          block("bullet", "Consider affordability, transport, medicine availability, stigma and family roles when planning discharge teaching."),
          block("bullet", "For communicable diseases, combine bedside care with contact advice, prevention messages and public-health reporting where required."),
          block("bullet", "For chronic diseases, focus on long-term adherence, lifestyle support, appointment keeping and recognition of relapse or complications.")
        ]
      },
      {
        title: "Study Wrap",
        blocks: [
          block("bullet", `Revise ${title.toLowerCase()} by connecting the affected body system, causes, risk factors and early findings.`),
          block("bullet", "Prioritize the first-hour nursing actions, monitoring needs and escalation points."),
          block("bullet", "Link patient teaching to prevention, home care, adherence and follow-up."),
          block("bullet", "Keep danger signs and referral triggers visible during ward review.")
        ]
      },
      {
        title: "References For Further Reading",
        blocks: references.map((item) => block("bullet", item))
      }
    ]
  };
}

function buildOriginalMidwiferyLesson({ programme, unit, group, topic }) {
  if (/pharmacology|drug|medicine/i.test(group.title || "")) {
    const lesson = buildOriginalPharmacologyLesson({ programme, unit, group, topic });
    return {
      ...lesson,
      excerpt: `${topic.title} explained for midwifery practice with medicine safety, pregnancy considerations, patient education and documentation priorities.`,
      sections: [
        ...lesson.sections,
        {
          title: "Midwifery Medicines Safety",
          blocks: [
            block("bullet", "Before giving medicines in pregnancy, labour or puerperium, confirm the indication, gestational or postnatal stage, allergies, dose, route and prescriber instructions."),
            block("bullet", "Consider both mother and fetus or newborn when monitoring therapeutic effect and adverse effects."),
            block("bullet", "Document the medicine, dose, route, time, maternal observations, patient education and response."),
            block("bullet", "Escalate any uncertainty about safety in pregnancy, breastfeeding, labour, newborn exposure or emergency medicines.")
          ]
        }
      ]
    };
  }

  const frame = inferMidwiferyFrame(topic.title, group.title);
  const context = `${programme.label} - ${unit.code ? `${unit.code}: ` : ""}${unit.title}`;
  const title = topic.title;
  const references = midwiferyReferences(title, frame);

  return {
    title,
    excerpt: `${title} explained as original Nursing Uganda midwifery notes with maternal assessment, fetal or newborn wellbeing, respectful care, danger signs and referral priorities.`,
    originalRewrite: {
      status: "expanded-original",
      rewrittenAtUtc: new Date().toISOString(),
      referenceBasis: "Midwifery textbooks, Nursing Uganda local PDF library, Uganda maternity-practice context and WHO maternal-newborn guidance."
    },
    references,
    sections: [
      {
        title: "Definition And Midwifery Meaning",
        blocks: [
          block("paragraph", frame.meaning),
          block("paragraph", `In ${context}, study ${title.toLowerCase()} by asking what is normal, what requires closer observation, what requires urgent referral, and how the midwife should explain the situation respectfully to the woman and family.`)
        ]
      },
      {
        title: "Physiology And Clinical Link",
        blocks: frame.physiology.map((item) => block("bullet", item))
      },
      {
        title: "Assessment Focus",
        blocks: frame.assessment.map((item) => block("bullet", item))
      },
      {
        title: "Midwifery Management",
        blocks: frame.management.map((item) => block("bullet", item))
      },
      {
        title: "Health Education",
        blocks: [
          block("bullet", "Use simple, respectful language and confirm understanding with teach-back."),
          block("bullet", "Discuss danger signs, hygiene, nutrition, rest, medicines, follow-up visits and facility delivery or referral plans as relevant."),
          block("bullet", "Involve the chosen birth companion or family support person when the woman agrees."),
          block("bullet", "Adapt advice to transport, cost, literacy, language, culture and available services.")
        ]
      },
      {
        title: "Danger Signs And Referral",
        blocks: [
          block("paragraph", frame.danger),
          block("bullet", "Call senior help early when maternal or fetal condition is abnormal, progress is poor, bleeding is heavy, infection is suspected or the facility cannot provide the needed care."),
          block("bullet", "Keep the woman informed during referral preparation and document observations, treatment given and reason for referral.")
        ]
      },
      {
        title: "Documentation And Handover",
        blocks: [
          block("bullet", "Record date, time, history, observations, examination findings, care given, education, medicines and response."),
          block("bullet", "Use standard maternity records, antenatal cards, partograph or postnatal charts according to the stage of care."),
          block("bullet", "During handover, highlight risk factors, current observations, fetal or newborn status, medicines given and pending actions.")
        ]
      },
      {
        title: "Uganda Practice Notes",
        blocks: [
          block("bullet", "Follow facility maternity protocols, current Uganda Clinical Guidelines and referral pathways."),
          block("bullet", "Protect respectful maternity care: privacy, consent, non-abusive communication and support for the woman's choices where safe."),
          block("bullet", "Plan care with real-world barriers in mind, including distance, transport, cost, blood availability, medicine stock and family support."),
          block("bullet", "For emergency signs, stabilise within scope while arranging timely referral or senior review.")
        ]
      },
      {
        title: "Study Wrap",
        blocks: [
          block("bullet", `Revise ${title.toLowerCase()} through the safety of the woman, fetus or newborn.`),
          block("bullet", "Separate normal findings from abnormal findings that need immediate action."),
          block("bullet", "Connect first assessment actions to management priorities, documentation and handover."),
          block("bullet", "Use clear health education, danger-sign advice and referral triggers for the woman or family.")
        ]
      },
      {
        title: "References For Further Reading",
        blocks: references.map((item) => block("bullet", item))
      }
    ]
  };
}

function isMentalPharmacologyTopic(groupTitle, topicTitle) {
  const text = `${groupTitle} ${topicTitle}`.toLowerCase();
  return /pharmacology|psychopharmacology|therapeutic agents|immunological drugs|drugs used|reproductive system|anxiolytic|hypnotic|mood stabilizer|anti-depress|antidepress|anti-psychotic|antipsychotic|anticonvulsant|gonadotropin|androgen|bph|erectile|contraceptive|immunization|immunological|antineoplastic/.test(text);
}

function buildOriginalMentalHealthLesson({ programme, unit, group, topic }) {
  if (isMentalPharmacologyTopic(group.title || "", topic.title || "")) {
    const lesson = buildOriginalPharmacologyLesson({ programme, unit, group, topic });
    return {
      ...lesson,
      excerpt: `${topic.title} explained for mental-health nursing with medicine-safety checks, risk monitoring, adherence teaching and legal documentation priorities.`,
      references: [
        ...(lesson.references || []),
        "WHO mhGAP and facility mental-health protocols for psychiatric medicine monitoring and referral.",
        "Current Uganda Clinical Guidelines and facility controlled-medicine policies where applicable."
      ],
      sections: [
        ...lesson.sections,
        {
          title: "Mental-Health Medicines Safety",
          blocks: [
            block("bullet", "Assess current mental state, suicide risk, substance use, physical observations, allergies and current medicines before administration."),
            block("bullet", "Monitor sedation, falls risk, movement changes, mood worsening, sleep, appetite, adherence and signs of toxicity or withdrawal."),
            block("bullet", "Teach the patient and family that many psychiatric medicines need consistent use and follow-up before full benefit is seen."),
            block("bullet", "Document consent or refusal, medicine given, response, side effects, education and any safety concerns.")
          ]
        }
      ]
    };
  }

  const frame = inferMentalHealthFrame(topic.title, group.title);
  const context = `${programme.label} - ${unit.code ? `${unit.code}: ` : ""}${unit.title}`;
  const title = topic.title;
  const references = mentalHealthReferences(title, frame);

  return {
    title,
    excerpt: `${title} explained as original Nursing Uganda mental-health nursing notes with psychiatric assessment, risk care, rights, therapeutic communication and recovery support.`,
    originalRewrite: {
      status: "expanded-original",
      rewrittenAtUtc: new Date().toISOString(),
      referenceBasis: "Psychiatric nursing textbooks, WHO mental-health guidance, Nursing Uganda local PDF library and Ugandan mental-health practice context."
    },
    references,
    sections: [
      {
        title: "Definition And Psychiatric Nursing Meaning",
        blocks: [
          block("paragraph", frame.meaning),
          block("paragraph", `In ${context}, study ${title.toLowerCase()} by connecting symptoms with safety, mental status examination, physical health, rights, family support and recovery planning.`)
        ]
      },
      {
        title: "Risk And Protective Factors",
        blocks: frame.risk.map((item) => block("bullet", item))
      },
      {
        title: "Assessment And Mental Status Focus",
        blocks: frame.assessment.map((item) => block("bullet", item))
      },
      {
        title: "Immediate Nursing Priorities",
        blocks: frame.priorities.map((item) => block("bullet", item))
      },
      {
        title: "Therapeutic Communication",
        blocks: [
          block("bullet", "Introduce yourself, speak calmly, preserve privacy and explain each step before assessment or intervention."),
          block("bullet", "Use active listening, short clear questions and non-judgemental language."),
          block("bullet", "Set respectful limits when behaviour is unsafe while still protecting dignity."),
          block("bullet", "Avoid arguing with delusions, humiliating the patient or making promises that cannot be kept.")
        ]
      },
      {
        title: "Treatment Support And Recovery",
        blocks: [
          block("bullet", "Support sleep, nutrition, hygiene, medication adherence, structured activity and follow-up appointments."),
          block("bullet", "Involve family or caregivers when appropriate and with attention to consent, safety and confidentiality."),
          block("bullet", "Encourage relapse-prevention planning, early warning-sign recognition and access to crisis help."),
          block("bullet", "Screen for physical illness, substance use and medicine side effects that may worsen mental state.")
        ]
      },
      {
        title: "Rights, Safety And Documentation",
        blocks: [
          block("bullet", "Use the least restrictive safe care and review observation, restraint or seclusion decisions according to facility policy."),
          block("bullet", "Protect confidentiality unless disclosure is required for safety or lawfully authorised care."),
          block("bullet", "Document mental status, risk assessment, care given, medicine response, patient education, family contact and referral decisions."),
          block("bullet", "Escalate urgently for suicidal intent, violent intent, severe withdrawal, delirium, seizures, catatonia, psychosis with danger or inability to care for self.")
        ]
      },
      {
        title: "Uganda Practice Notes",
        blocks: [
          block("bullet", "Work with available mental-health referral pathways, community support, family systems and facility protocols."),
          block("bullet", "Address stigma directly by explaining that mental illness is treatable and that respectful care improves outcomes."),
          block("bullet", "Consider cost, transport, medicine availability, caregiver burden and safety at home before discharge."),
          block("bullet", "For controlled medicines, follow storage, prescription, administration and documentation rules carefully.")
        ]
      },
      {
        title: "Study Wrap",
        blocks: [
          block("bullet", `Revise ${title.toLowerCase()} using psychiatric nursing terms, risk factors and protective factors.`),
          block("bullet", "Connect the mental status examination to immediate safety and communication priorities."),
          block("bullet", "Document risk, protective actions, family involvement, medicine response and follow-up needs."),
          block("bullet", "Escalate suicidal intent, violent intent, delirium, severe withdrawal, seizures or rapid deterioration.")
        ]
      },
      {
        title: "References For Further Reading",
        blocks: references.map((item) => block("bullet", item))
      }
    ]
  };
}

function sortedYears(programme) {
  return Object.values(programme.years || {}).sort((a, b) => a.year - b.year);
}

function sortedSemesters(year) {
  return Object.values(year.semesters || {}).sort((a, b) => a.semester - b.semester);
}

function allUnits(programme) {
  return sortedYears(programme).flatMap((year) => sortedSemesters(year).flatMap((semester) => semester.courseUnits || []));
}

function pruneImportedNonLessons(data) {
  const removedSourceSlugs = new Set();
  const removedByProgramme = {};
  let removed = 0;

  for (const programme of data.programmes || []) {
    for (const unit of allUnits(programme)) {
      unit.topicGroups = (unit.topicGroups || []).map((group) => {
        const topics = [];
        for (const topic of group.topics || []) {
          if (SKIP_TOPIC_RE.test(topic.title || "")) {
            if (topic.sourceSlug) removedSourceSlugs.add(topic.sourceSlug);
            removedByProgramme[programme.id] = (removedByProgramme[programme.id] || 0) + 1;
            removed += 1;
          } else {
            topics.push(topic);
          }
        }
        return { ...group, topics };
      }).filter((group) => (group.topics || []).length);
    }
  }

  const retainedSourceSlugs = new Set();
  for (const programme of data.programmes || []) {
    for (const unit of allUnits(programme)) {
      for (const group of unit.topicGroups || []) {
        for (const topic of group.topics || []) {
          if (topic.sourceSlug) retainedSourceSlugs.add(topic.sourceSlug);
        }
      }
    }
  }

  for (const slug of removedSourceSlugs) {
    if (!retainedSourceSlugs.has(slug) && data.lessons && data.lessons[slug]) {
      delete data.lessons[slug];
    }
  }

  return { removed, removedByProgramme };
}

function recalculateStats(data) {
  const totals = {
    programmes: (data.programmes || []).length,
    years: 0,
    semesters: 0,
    courseUnits: 0,
    topics: 0
  };

  for (const programme of data.programmes || []) {
    const years = sortedYears(programme);
    let semesterCount = 0;
    let unitCount = 0;
    let topicCount = 0;

    for (const year of years) {
      const semesters = sortedSemesters(year);
      semesterCount += semesters.length;
      for (const semester of semesters) {
        unitCount += (semester.courseUnits || []).length;
        for (const unit of semester.courseUnits || []) {
          unit.topicCount = (unit.topicGroups || []).reduce((sum, group) => sum + (group.topics || []).length, 0);
          topicCount += unit.topicCount;
        }
      }
    }

    programme.stats = {
      yearCount: years.length,
      semesterCount,
      unitCount,
      topicCount
    };

    totals.years += years.length;
    totals.semesters += semesterCount;
    totals.courseUnits += unitCount;
    totals.topics += topicCount;
  }

  data.totals = totals;
}

function targetLessonSlug(target, topic, groupIndex, topicIndex) {
  const baseSlug = slugify(topic.title);
  if (target.slugScope === "programme-unit-position") {
    return slugify(`${target.programmeId}-${target.unitId}-${groupIndex + 1}-${topicIndex + 1}-${baseSlug}`);
  }
  if (target.slugScope === "programme-unit") {
    return slugify(`${target.programmeId}-${target.unitId}-${baseSlug}`);
  }
  return baseSlug;
}

function isScopedTargetSlug(target, slug) {
  return Boolean(slug) && String(slug).startsWith(slugify(`${target.programmeId}-${target.unitId}-`));
}

function buildLessonForTarget(target, params) {
  if (target.mode === "mental-pharmacology") return buildOriginalMentalHealthLesson(params);
  if (target.mode === "midwifery-pharmacology") return buildOriginalMidwiferyLesson(params);
  if (target.mode === "medical-pharmacology") return buildOriginalMedicalNursingLesson(params);
  return buildOriginalPharmacologyLesson(params);
}

function rewriteTarget(data, target) {
  const programme = (data.programmes || []).find((item) => item.id === target.programmeId);
  if (!programme) throw new Error(`Programme not found: ${target.programmeId}`);
  const unit = allUnits(programme).find((item) => item.id === target.unitId);
  if (!unit) throw new Error(`Unit not found: ${target.unitId}`);

  let rewritten = 0;
  let removed = 0;
  data.lessons = data.lessons || {};

  unit.topicGroups = (unit.topicGroups || []).map((group) => {
    group.topics = (group.topics || []).filter((topic) => {
      if (!SKIP_TOPIC_RE.test(topic.title || "")) return true;
      if (target.pruneSkippedSource && topic.sourceSlug) delete data.lessons[topic.sourceSlug];
      removed += 1;
      return false;
    });
    return group;
  }).filter((group) => (group.topics || []).length);

  for (const [groupIndex, group] of (unit.topicGroups || []).entries()) {
    for (const [topicIndex, topic] of (group.topics || []).entries()) {
      const previousSlug = topic.sourceSlug;
      const pageSlug = slugify(topic.title);
      const lessonSlug = targetLessonSlug(target, topic, groupIndex, topicIndex);
      if ((target.prunePreviousSlug || isScopedTargetSlug(target, previousSlug)) && previousSlug && previousSlug !== lessonSlug && data.lessons[previousSlug]) {
        delete data.lessons[previousSlug];
      }
      topic.sourceSlug = lessonSlug;
      topic.slug = pageSlug;
      data.lessons[lessonSlug] = buildLessonForTarget(target, { programme, unit, group, topic });
      rewritten += 1;
    }
  }

  unit.topicCount = (unit.topicGroups || []).reduce((sum, group) => sum + (group.topics || []).length, 0);
  return { programme: programme.label, unit: unit.title, rewritten, removed };
}

function main() {
  const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  const globalPrune = pruneImportedNonLessons(data);
  const results = DEFAULT_TARGETS.map((target) => rewriteTarget(data, target));
  recalculateStats(data);
  data.generatedAtUtc = new Date().toISOString();
  data.originalRewritePilot = {
    targets: DEFAULT_TARGETS,
    results,
    globalPrune,
    sourcePolicy: "Original Nursing Uganda summaries written from curriculum topic context and verified reference metadata; do not copy imported source wording."
  };
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  console.log(`Pruned ${globalPrune.removed} imported non-lesson topics across the course tree.`);
  for (const result of results) {
    console.log(`Rewritten ${result.rewritten} lessons in ${result.unit} (${result.programme}); removed ${result.removed} non-lesson items.`);
  }
}

main();
