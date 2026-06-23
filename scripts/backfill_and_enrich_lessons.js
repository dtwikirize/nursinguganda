#!/usr/bin/env node
/* Backfill repeated topics from existing lesson notes and add original clinical depth where source notes are thin. */
const fs = require("node:fs");
const path = require("node:path");

const ROOT = process.cwd();
const DATA_FILE = path.join(ROOT, "assets", "data", "curriculum.json");
const SKIP_TOPIC_RE = /^(terms|privacy policy|disclaimer|about(?: us)?|click here\b.*|want notes in pdf\??.*|home|blog|contact|whatsapp|support|login|register|share|comments?|(?:nurses|midwives)\s+revision|index)$/i;

function normalizeTitle(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/\b(introduction|intro|overview|detailed|diagrammatic|description|the|of|to|and)\b/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function block(type, text) {
  return { type, text };
}

function isImportedAdminSectionTitle(title) {
  return /^(module\s+unit\b|module\s+unit\s+description|contact\s+hours|credit\s+units|course\s+units)$/i.test(String(title || "").trim())
    || /^(revision\s+questions?|review\s+questions?|multiple\s+choice\s+questions?|fill-?in\s+questions?|quiz|questions?)\b/i.test(String(title || "").trim())
    || /references?\s*(?:\(|for|from|\b)/i.test(String(title || ""))
    || /(?:from|in)\s+curriculum|learning[-\s]*working\s+assignments|practical\s+exercises|underpinning\s+knowledge|curriculum\s*$/i.test(String(title || ""));
}

function isImportedAdminBlock(block) {
  const text = String(block && block.text ? block.text : "").trim();
  if (!text) return true;
  const plainText = text.replace(/\*\*/g, "").trim();
  return /^(?:\*\*)?(contact\s+hours|credit\s+units|module\s+unit\s+description|module\s+unit)\b/i.test(text)
    || /^(?:\*\*)?(revision\s+questions?|review\s+questions?|multiple\s+choice\s+questions?|fill-?in\s+questions?|quiz|questions?)\b/i.test(text)
    || /^question\s*\d+\s*[:.)-]/i.test(text)
    || /^(?:\d+|[a-z])\.\s+(?:(?:briefly|shortly|clearly)\s+)?(?:what|where|which|why|how|describe|list|name|define|explain|differentiate|identify|state|mention|discuss|compare|examine|outline|give|write)\b/i.test(plainText)
    || /^(?:\d+|[a-z])\.\s+.+\?\s*(?:answer\s*[:.-].*)?$/i.test(plainText)
    || /^(?:a|b|c|d)[.)]\s+(?:(?:briefly|shortly|clearly)\s+)?(?:what|where|which|why|how|describe|list|name|define|explain|differentiate|identify|state|mention|discuss|compare|examine|outline|give|write)\b/i.test(plainText)
    || /below are the (?:core and other )?references listed in the curriculum/i.test(text)
    || /refer to the original document for full details/i.test(text)
    || /^\(?this (?:section|is) .*curriculum/i.test(text)
    || /learning[-\s]*working\s+assignments|practical\s+exercises|underpinning\s+knowledge/i.test(text);
}

function sanitizeLesson(lesson) {
  if (!lesson || !Array.isArray(lesson.sections)) return 0;
  let removed = 0;
  const cleanedSections = [];

  for (const section of lesson.sections) {
    if (isImportedAdminSectionTitle(section.title)) {
      removed += 1;
      continue;
    }
    const before = (section.blocks || []).length;
    const blocks = (section.blocks || []).filter((item) => !isImportedAdminBlock(item));
    removed += before - blocks.length;
    if (!blocks.length) {
      removed += 1;
      continue;
    }
    cleanedSections.push({ ...section, blocks });
  }

  lesson.sections = cleanedSections;
  if (isImportedAdminBlock({ text: lesson.excerpt })) {
    const firstBlock = lesson.sections.flatMap((section) => section.blocks || []).find((item) => item.text && item.text.length > 30);
    lesson.excerpt = firstBlock ? firstBlock.text.replace(/\*\*/g, "") : lesson.title || "";
    removed += 1;
  }
  return removed;
}

function sanitizeLessons(data) {
  let removed = 0;
  for (const lesson of Object.values(data.lessons || {})) {
    removed += sanitizeLesson(lesson);
  }
  return removed;
}

function lessonWordCount(lesson) {
  return (lesson && lesson.sections ? lesson.sections : [])
    .flatMap((section) => section.blocks || [])
    .reduce((sum, item) => sum + String(item.text || "").split(/\s+/).filter(Boolean).length, 0);
}

function sortedYears(programme) {
  return Object.values(programme.years || {}).sort((a, b) => a.year - b.year);
}

function sortedSemesters(year) {
  return Object.values(year.semesters || {}).sort((a, b) => a.semester - b.semester);
}

function eachTopic(data, callback) {
  for (const programme of data.programmes || []) {
    for (const year of sortedYears(programme)) {
      for (const semester of sortedSemesters(year)) {
        for (const unit of semester.courseUnits || []) {
          for (const group of unit.topicGroups || []) {
            for (const topic of group.topics || []) {
              callback({ programme, year, semester, unit, group, topic });
            }
          }
        }
      }
    }
  }
}

function buildLessonIndex(data) {
  const byTitle = new Map();
  eachTopic(data, ({ topic }) => {
    if (!topic.sourceSlug || SKIP_TOPIC_RE.test(topic.title || "")) return;
    const lesson = data.lessons && data.lessons[topic.sourceSlug];
    if (!lesson) return;
    const key = normalizeTitle(topic.title);
    if (!key || key.length < 4) return;
    const candidate = { sourceSlug: topic.sourceSlug, score: lessonWordCount(lesson), title: topic.title };
    const current = byTitle.get(key);
    if (!current || candidate.score > current.score) byTitle.set(key, candidate);
  });
  return byTitle;
}

function backfillRepeatedTopics(data) {
  const byTitle = buildLessonIndex(data);
  let backfilled = 0;

  eachTopic(data, ({ topic }) => {
    if (SKIP_TOPIC_RE.test(topic.title || "")) return;
    if (topic.sourceSlug && data.lessons && data.lessons[topic.sourceSlug]) return;
    const key = normalizeTitle(topic.title);
    const match = byTitle.get(key);
    if (!match) return;
    topic.sourceSlug = match.sourceSlug;
    backfilled += 1;
  });

  return backfilled;
}

function hasSection(lesson, titlePattern) {
  return Boolean(lesson && (lesson.sections || []).some((section) => titlePattern.test(section.title || "")));
}

function contextIndex(data) {
  const map = new Map();
  eachTopic(data, ({ programme, unit, group, topic }) => {
    if (!topic.sourceSlug || !data.lessons || !data.lessons[topic.sourceSlug]) return;
    if (map.has(topic.sourceSlug)) return;
    map.set(topic.sourceSlug, { programme, unit, group, topic });
  });
  return map;
}

function inferDomain(text) {
  const value = String(text || "").toLowerCase();
  if (/fracture|bone|joint|musculo|skelet|sprain|traction|cast|orthop/.test(value)) return "musculoskeletal";
  if (/pregnan|labou?r|maternal|newborn|antenatal|postnatal|obstetric|midwifery|placenta|uterus|fetal|foetal|abortion|puerper/.test(value)) return "midwifery";
  if (/drug|pharmac|medicine|dose|tablet|injection|antibiotic|antimalarial|analgesic|anaesth|route|contraindication/.test(value)) return "pharmacology";
  if (/mental|psychi|psychosis|depress|anxiety|suicide|counsel|substance|addiction|mood|schizo/.test(value)) return "mental-health";
  if (/infection|communicable|malaria|tuberculosis|tb|hiv|cholera|hepatitis|measles|ebola|sepsis|fever|microbiology|parasite|bacteria|virus|fung/.test(value)) return "infection";
  if (/surg|wound|burn|trauma|bleed|shock|theatre|catheter|ulcer|gangrene|dressing|emergency|first aid/.test(value)) return "surgical";
  if (/child|paediatric|pediatric|infant|neonate|imci|immuni/.test(value)) return "paediatric";
  if (/community|public health|nutrition|sanitation|epidemiology|family planning|primary health|school health|surveillance/.test(value)) return "community";
  if (/palliative|hospice|terminal|pain|dyspnea|grief|bereavement|spiritual/.test(value)) return "palliative";
  if (/management|leadership|entrepreneur|research|ethic|teaching|methodology|documentation|informatics|computer|profession|law|policy/.test(value)) return "systems";
  if (/anatomy|physiology|cell|tissue|organ|system|blood|cardio|respiratory|renal|nervous|endocrine|digestive|reproductive|biochemistry|pathology/.test(value)) return "anatomy-physiology";
  return "general";
}

const DOMAIN_FRAMES = {
  "musculoskeletal": {
    lens: "Connect structure, movement, pain, circulation, nerve function and safe mobility.",
    assessment: ["Pain score, site, onset, deformity, swelling, bruising and ability to move.", "Distal pulse, capillary refill, colour, warmth, sensation and movement.", "Skin integrity, wounds, cast tightness, traction alignment and pressure areas."],
    priorities: ["Immobilize and protect the affected part while preventing further injury.", "Control pain and swelling while monitoring neurovascular status.", "Prevent complications such as compartment syndrome, infection, pressure injury and venous stasis."],
    evaluation: ["Pain is reduced, circulation and sensation remain intact, swelling is controlled and the patient mobilizes safely within the care plan."]
  },
  "midwifery": {
    lens: "Read the topic through the safety of two patients: the mother and the fetus or newborn.",
    assessment: ["Maternal vital signs, bleeding, pain, contractions, uterine tone and danger signs.", "Fetal or newborn wellbeing, feeding, temperature, breathing and activity.", "History of pregnancy, parity, medications, allergies, investigations and referral risks."],
    priorities: ["Recognize danger signs early and escalate without delay.", "Provide respectful communication, privacy, infection prevention and clear documentation.", "Teach the mother what to monitor at home and when to return urgently."],
    evaluation: ["Mother and baby remain stable, danger signs are acted on early, and the family understands follow-up instructions."]
  },
  "pharmacology": {
    lens: "Study medicines through indication, safety checks, expected response, adverse effects and patient teaching.",
    assessment: ["Diagnosis or reason for the medicine, allergies, pregnancy status and previous reactions.", "Current medicines, herbal products, renal or liver risk and baseline observations.", "Dose, route, timing, dilution, expiry date and documentation requirements."],
    priorities: ["Apply the rights of medication administration and facility policy.", "Monitor therapeutic response and class-specific adverse effects.", "Educate the patient on purpose, timing, missed doses, warning symptoms and adherence."],
    evaluation: ["The medicine produces the intended effect without preventable harm, and administration is accurately documented."]
  },
  "mental-health": {
    lens: "Combine safety, therapeutic communication, mental status assessment and dignity.",
    assessment: ["Appearance, behaviour, speech, mood, thought process, perception, cognition and insight.", "Risk of self-harm, harm to others, neglect, withdrawal, substance use or relapse.", "Support systems, medication adherence, sleep, appetite and triggers."],
    priorities: ["Maintain safety using the least restrictive approach possible.", "Use calm communication, active listening and non-judgmental observation.", "Support adherence, coping skills, family involvement and follow-up."],
    evaluation: ["Risk reduces, the patient engages with care, symptoms are monitored and a realistic safety or relapse plan is in place."]
  },
  "infection": {
    lens: "Link cause, transmission, incubation, clinical features, treatment support and prevention.",
    assessment: ["Temperature, pulse, respiratory status, hydration, pain, rash, wounds, stool, urine or sputum changes.", "Exposure history, travel, contacts, vaccination status and comorbidities.", "Specimen orders, isolation needs, antimicrobial history and danger signs."],
    priorities: ["Use standard precautions and transmission-based precautions where needed.", "Support hydration, nutrition, medicines, monitoring and early referral for severe disease.", "Teach prevention, adherence, hygiene, safe water, vector control or contact tracing as relevant."],
    evaluation: ["Symptoms improve, complications are detected early, transmission risk is reduced and treatment is completed correctly."]
  },
  "surgical": {
    lens: "Prioritize airway, breathing, circulation, pain, asepsis, wound healing and early complication detection.",
    assessment: ["Vital signs, pain, bleeding, perfusion, level of consciousness and injury pattern.", "Wound appearance, drainage, odour, swelling, temperature and surrounding skin.", "Fluid balance, mobility, nutrition, surgical site risk and ordered investigations."],
    priorities: ["Stabilize urgent problems first, then prepare for investigations or theatre care.", "Maintain aseptic technique, pain control, wound care and documentation.", "Prevent shock, infection, pressure injury, deep vein thrombosis and delayed healing."],
    evaluation: ["The patient remains stable, wound healing progresses, pain is controlled and complications are recognized early."]
  },
  "paediatric": {
    lens: "Adapt assessment and care to age, weight, development, caregiver knowledge and family support.",
    assessment: ["Airway, breathing, circulation, hydration, temperature, feeding, activity and danger signs.", "Weight-based medicines, immunization status, growth, development and caregiver concerns.", "Signs that may be subtle in children, including lethargy, poor feeding, fast breathing or convulsions."],
    priorities: ["Use age-appropriate communication and involve the caregiver.", "Prevent dehydration, hypothermia, medication errors and delayed referral.", "Teach home care, danger signs and follow-up clearly."],
    evaluation: ["The child is clinically improving, caregiver instructions are understood and follow-up is arranged."]
  },
  "community": {
    lens: "Move from individual illness to prevention, population risk, health education and continuity of care.",
    assessment: ["Who is affected, where they live, risk factors, resources and barriers to care.", "Environmental hygiene, nutrition, immunization, water, sanitation and health-seeking behaviour.", "Community beliefs, leaders, household practices and surveillance data."],
    priorities: ["Promote prevention, early detection, referral and community participation.", "Use clear health education matched to literacy, culture and available resources.", "Document findings and coordinate with community health structures."],
    evaluation: ["The community understands the message, risk is reduced and follow-up or referral pathways are active."]
  },
  "palliative": {
    lens: "Focus on comfort, dignity, symptom control, communication and family support.",
    assessment: ["Pain and other symptoms, function, sleep, appetite, mood, spiritual distress and family concerns.", "Medication response, side effects, wound or skin needs and end-of-life preferences.", "Caregiver burden, home resources and urgent red flags."],
    priorities: ["Relieve distressing symptoms and prevent avoidable suffering.", "Communicate honestly, respectfully and at the patient's pace.", "Support family care, medication access, dignity and continuity."],
    evaluation: ["Symptoms are better controlled, patient preferences are respected and the family knows when to seek help."]
  },
  "systems": {
    lens: "Translate theory into safe decisions, accountability, communication and service improvement.",
    assessment: ["The problem, stakeholders, available resources, policy requirements and ethical issues.", "Risks to patients, staff, confidentiality, quality, costs and continuity.", "Documentation, reporting lines, supervision and evaluation measures."],
    priorities: ["Use evidence, policy and professional standards to guide action.", "Communicate clearly, document decisions and protect confidentiality.", "Evaluate whether the action improves safety, learning or service delivery."],
    evaluation: ["The plan is documented, realistic, ethical and improves patient care or learning outcomes."]
  },
  "anatomy-physiology": {
    lens: "Start with normal structure and function, then connect it to assessment findings and disease.",
    assessment: ["Relevant inspection, palpation, movement, auscultation, vital signs or neurological checks.", "Normal findings, abnormal findings and what each abnormality may indicate.", "Patient history, risk factors and how the body system affects other systems."],
    priorities: ["Use anatomy to explain symptoms and guide focused assessment.", "Recognize findings that need urgent escalation.", "Teach the patient using simple body-system language."],
    evaluation: ["The learner can explain normal function, identify abnormal signs and connect them to nursing action."]
  },
  "general": {
    lens: "Turn the topic into practical nursing knowledge: meaning, assessment, care priorities, teaching and evaluation.",
    assessment: ["Key definitions, patient history, focused observations and risk factors.", "Findings that are normal, abnormal or urgent.", "Resources, referral needs and documentation requirements."],
    priorities: ["Protect safety, comfort, dignity and infection prevention.", "Provide clear care, education and escalation when needed.", "Evaluate response and record what changed."],
    evaluation: ["The topic is understood in a way that supports safe nursing judgement and revision."]
  }
};

function clinicalStudyLayer(title, context) {
  const contextText = [
    title,
    context && context.unit ? context.unit.title : "",
    context && context.group ? context.group.title : "",
    context && context.programme ? context.programme.label : ""
  ].join(" ");
  const domain = inferDomain(contextText);
  const frame = DOMAIN_FRAMES[domain] || DOMAIN_FRAMES.general;
  const lowerTitle = String(title || "this topic").toLowerCase();

  return [
    {
      title: "Nursing Uganda Clinical Lens",
      blocks: [
        block("paragraph", `Use **${title}** as a practical nursing topic, not only a memorized definition. ${frame.lens}`),
        block("bullet", `**What to understand first:** define ${lowerTitle}, identify the normal or expected pattern, then explain what changes when the patient is unwell.`),
        block("bullet", "**Why it matters in care:** the nurse must recognize risk early, explain findings clearly, document accurately and know when to escalate."),
        block("bullet", "**How to revise it:** connect each point to assessment, nursing diagnosis or care problem, intervention, rationale and evaluation.")
      ]
    },
    {
      title: "Assessment Guide",
      blocks: frame.assessment.map((item) => block("bullet", item))
    },
    {
      title: "Nursing Priorities, Rationales and Outcomes",
      blocks: [
        ...frame.priorities.map((item) => block("bullet", item)),
        block("paragraph", `The rationale for these priorities is patient safety: nursing actions should prevent deterioration, reduce discomfort, support recovery and create clear evidence for the next caregiver.`),
        ...frame.evaluation.map((item) => block("bullet", `**Expected outcome:** ${item}`))
      ]
    },
    {
      title: "Patient Teaching and Revision Check",
      blocks: [
        block("bullet", `Explain ${lowerTitle} in simple language the patient or caregiver can repeat back.`),
        block("bullet", "Teach warning signs, medicine or follow-up instructions, hygiene or lifestyle points where relevant."),
        block("bullet", "For exams, prepare a short answer using: definition, causes or risk factors, signs, assessment, management, complications and prevention."),
        block("bullet", "For ward practice, document baseline findings, actions taken, patient response and the plan for review.")
      ]
    }
  ];
}

function table(headers, rows) {
  return { type: "table", headers, rows };
}

function signatureSections(config) {
  return [
    {
      title: "Nursing Uganda Snapshot",
      blocks: [
        block("paragraph", config.snapshot),
        table(["Core idea", "Nursing meaning", "Do not miss"], [[config.coreIdea, config.nursingMeaning, config.doNotMiss]])
      ]
    },
    {
      title: "Build The Idea",
      blocks: [
        block("paragraph", config.build),
        ...config.buildBullets.map((item) => block("bullet", item))
      ]
    },
    {
      title: "Ward Mode",
      blocks: [
        block("paragraph", config.ward),
        ...config.wardSteps.map((item) => block("bullet", item))
      ]
    },
    {
      title: "What The Nurse Looks For",
      blocks: [
        table(["Assessment cue", "Possible meaning", "Nursing response"], config.assessmentRows)
      ]
    },
    {
      title: "Red Flags",
      blocks: config.redFlags.map((item) => block("bullet", item))
    },
    {
      title: "Care Plan Map",
      blocks: [
        table(["Problem or priority", "Nursing action", "Rationale", "Expected outcome"], config.carePlanRows)
      ]
    },
    {
      title: "Patient Teaching",
      blocks: config.teaching.map((item) => block("bullet", item))
    },
    {
      title: "Exam Answer Map",
      blocks: config.exam.map((item) => block("bullet", item))
    }
  ];
}

const SIGNATURE_LESSON_GROUPS = [
  {
    key: "skeletal-system",
    slugs: ["skeletal-system", "anatomy-and-physiology-of-the-musculo-skeletal-system"],
    snapshot: "The skeletal system is best revised as a living support, protection, movement, blood-forming and mineral-storage system. A nurse uses it to understand pain, deformity, movement limits, neurovascular risk and safe mobility.",
    coreIdea: "Bone is living tissue with blood supply, cells, minerals and remodeling.",
    nursingMeaning: "Assess pain, movement, posture, deformity, circulation, sensation and functional ability.",
    doNotMiss: "Fracture complications, spinal injury signs, joint swelling, infection and loss of distal circulation.",
    build: "Start with normal bone and joint function, then ask what changes when injury, inflammation, infection, degeneration or mineral loss occurs.",
    buildBullets: ["**Framework:** bones support posture and protect organs.", "**Movement:** muscles pull on bones across joints.", "**Blood and minerals:** marrow forms blood cells while bone stores calcium and phosphate.", "**Repair:** healing depends on alignment, blood supply, nutrition, immobilization and infection control."],
    ward: "On the ward, skeletal knowledge becomes practical when a patient cannot walk, has pain after trauma, has a cast, or reports numbness and swelling.",
    wardSteps: ["Check pain, deformity, swelling, skin colour and temperature.", "Compare movement, sensation and pulse on both sides.", "Support the part before moving the patient.", "Escalate severe pain, numbness, cold limb or suspected spinal injury."],
    assessmentRows: [["Pain with swelling", "Injury, inflammation or fracture", "Immobilize, assess neurovascular status and report abnormal findings"], ["Reduced movement", "Joint disease, muscle weakness, pain or nerve injury", "Assist safely and document functional limit"], ["Cold pale distal limb", "Possible impaired circulation", "Urgent escalation and loosen restrictive pressure if ordered"], ["Bone tenderness after trauma", "Possible fracture", "Do not force movement; prepare for imaging or referral"]],
    redFlags: ["Increasing pain under a cast.", "Numbness, tingling, blue or cold fingers or toes.", "Loss of movement after trauma.", "Back or neck injury with weakness or altered sensation.", "Open wound with visible bone or severe bleeding."],
    carePlanRows: [["Pain", "Support limb, give prescribed analgesia, reduce unnecessary movement", "Pain increases stress and limits assessment", "Pain score reduces and patient cooperates with care"], ["Impaired mobility", "Use safe transfers, assistive devices and physiotherapy plan", "Prevents falls and deconditioning", "Patient mobilizes within prescribed limits"], ["Risk of neurovascular compromise", "Repeat distal circulation, movement and sensation checks", "Early detection prevents tissue loss", "Distal observations remain stable"]],
    teaching: ["Report severe pain, numbness, swelling, blue colour or inability to move digits.", "Keep casts dry and avoid inserting objects under them.", "Take calcium/protein-rich foods where appropriate and follow mobility instructions."],
    exam: ["Define the skeletal system.", "List functions: support, protection, movement, blood formation, mineral storage.", "Classify bones and joints.", "Add nursing relevance: assessment, fractures, mobility and complications."]
  },
  {
    key: "fractures",
    slugs: ["fractures"],
    snapshot: "A fracture is a break in bone continuity. Nursing care focuses on immobilization, pain relief, neurovascular protection, infection prevention, complication detection and patient education.",
    coreIdea: "The bone is broken and surrounding vessels, nerves, muscles and skin may also be injured.",
    nursingMeaning: "Treat as more than a bone problem: check circulation, sensation, movement, pain and skin.",
    doNotMiss: "Compartment syndrome, open fracture infection, shock, fat embolism and cast pressure injury.",
    build: "Revise fractures by linking classification to risk. Open fractures raise infection risk, displaced fractures raise alignment risk, long-bone fractures raise bleeding and fat embolism risk.",
    buildBullets: ["**Closed:** skin intact.", "**Open:** wound communicates with fracture site.", "**Displaced:** bone ends not aligned.", "**Greenstick:** incomplete fracture common in children.", "**Pathological:** bone breaks because disease has weakened it."],
    ward: "A patient after a road traffic crash with a painful swollen limb should be handled gently, immobilized and assessed before movement.",
    wardSteps: ["Use ABC approach if trauma is severe.", "Control bleeding and cover open wounds with sterile dressing.", "Immobilize the limb in the position found.", "Check pulse, capillary refill, colour, warmth, sensation and movement before and after splinting."],
    assessmentRows: [["Pain out of proportion", "Compartment syndrome risk", "Escalate urgently; do not ignore"], ["Absent distal pulse", "Arterial compromise", "Urgent review and neurovascular documentation"], ["Open wound", "Infection and bleeding risk", "Cover sterile, do not push bone back"], ["Shortened rotated limb", "Possible displaced fracture", "Immobilize and prepare for imaging/referral"]],
    redFlags: ["Pain increasing despite analgesia.", "Pain on passive stretch.", "Numbness or tingling.", "Pale, cold or blue distal limb.", "Difficulty breathing after long-bone fracture.", "Fever, foul drainage or wet cast."],
    carePlanRows: [["Acute pain", "Immobilize, support limb, give analgesia as prescribed", "Movement worsens tissue injury and pain", "Pain becomes tolerable"], ["Risk of peripheral neurovascular dysfunction", "Perform scheduled neurovascular checks", "Swelling may compromise vessels and nerves", "Pulse, sensation and movement remain intact"], ["Risk of infection", "Use aseptic wound and pin-site care", "Open tissue allows microorganism entry", "Wound remains clean and afebrile"]],
    teaching: ["Return immediately for severe pain, numbness, cold digits, swelling or foul smell.", "Do not wet the cast or insert objects under it.", "Continue permitted exercises for joints above and below the injury."],
    exam: ["Definition.", "Causes.", "Classification.", "Signs and symptoms.", "First aid and management.", "Complications.", "Nursing care and patient education."]
  },
  {
    key: "malaria",
    slugs: ["malaria", "diploma-nursing-direct-medical-nursing-ii-and-tropical-medicines-malaria", "malaria-in-pregnancy"],
    snapshot: "Malaria is a mosquito-borne parasitic infection that can progress from fever and malaise to anaemia, hypoglycaemia, convulsions, severe dehydration, shock and death if severe disease is missed.",
    coreIdea: "Plasmodium infection destroys red blood cells and triggers fever cycles and systemic illness.",
    nursingMeaning: "Assess severity first, support fluids, temperature, glucose, medicines, prevention and follow-up.",
    doNotMiss: "Severe malaria signs, pregnancy risk, child danger signs and hypoglycaemia.",
    build: "Think of malaria in three layers: transmission by Anopheles mosquito, illness from parasites in blood, and complications from anaemia, dehydration, low glucose or cerebral involvement.",
    buildBullets: ["**Uncomplicated malaria:** fever, headache, chills, body weakness and positive test.", "**Severe malaria:** impaired consciousness, repeated convulsions, respiratory distress, severe anaemia, shock or jaundice.", "**Pregnancy:** increases risk of anaemia, miscarriage, low birth weight and severe disease.", "**Prevention:** treated nets, environmental control, chemoprevention where indicated and early testing."],
    ward: "In OPD or ward, do not only write 'fever equals malaria'. Test where possible, assess danger signs and consider other causes of fever.",
    wardSteps: ["Check temperature, pulse, respiratory rate, blood pressure, hydration and mental state.", "Ask about pregnancy, age, previous treatment, vomiting and convulsions.", "Do malaria test as ordered and give antimalarial correctly.", "Monitor response and educate on completing treatment."],
    assessmentRows: [["Fever with chills", "Possible malaria or other infection", "Test, assess severity and treat as prescribed"], ["Confusion or convulsions", "Possible cerebral malaria", "Emergency escalation and airway safety"], ["Pallor and weakness", "Anaemia", "Check Hb if available and monitor for transfusion/referral need"], ["Vomiting", "Dehydration and failed oral treatment risk", "Assess fluids and consider referral/alternate route"]],
    redFlags: ["Altered consciousness.", "Repeated convulsions.", "Severe pallor.", "Respiratory distress.", "Persistent vomiting.", "Pregnancy with fever.", "Signs of shock or dehydration."],
    carePlanRows: [["Hyperthermia", "Tepid measures, fluids and antipyretic as prescribed", "Controls fever and discomfort", "Temperature trends down"], ["Risk of deficient fluid volume", "Monitor intake/output and signs of dehydration", "Fever and vomiting cause fluid loss", "Hydration improves"], ["Risk of complications", "Observe mental state, glucose risk, anaemia and breathing", "Severe malaria deteriorates quickly", "Danger signs are detected early"]],
    teaching: ["Complete the full antimalarial course.", "Sleep under an insecticide-treated net.", "Return immediately for convulsions, confusion, breathing difficulty, severe weakness or persistent vomiting.", "Pregnant women and children need early care."],
    exam: ["Define malaria.", "State cause and transmission.", "List signs of uncomplicated and severe malaria.", "Explain investigations and treatment support.", "Add prevention and health education."]
  },
  {
    key: "labour",
    slugs: ["labour", "certificate-in-midwifery-midwifery-i-and-pharmacology-i-1-8-labour", "normal-first-stage-of-labour"],
    snapshot: "Labour is a physiological process, but nursing and midwifery care must constantly balance progress, maternal safety, fetal wellbeing, privacy, respectful care and early referral.",
    coreIdea: "Effective contractions cause cervical dilatation, descent and birth.",
    nursingMeaning: "Monitor mother, fetus, contractions, progress and danger signs together.",
    doNotMiss: "Obstructed labour, fetal distress, postpartum haemorrhage risk and sepsis prevention.",
    build: "Revise labour through the passenger, passage, powers, placenta and psychology. A problem in any area can slow progress or threaten mother and baby.",
    buildBullets: ["**First stage:** cervical dilatation and effacement.", "**Second stage:** birth of the baby.", "**Third stage:** separation and expulsion of placenta.", "**Fourth stage:** early observation after birth."],
    ward: "In labour ward, the partograph and respectful observation protect both mother and baby.",
    wardSteps: ["Assess contractions, cervical dilatation, descent, membranes and maternal vital signs.", "Monitor fetal heart as required by stage and local protocol.", "Maintain privacy, hydration, bladder care and emotional support.", "Escalate delayed progress, abnormal fetal heart, bleeding, fever or severe hypertension."],
    assessmentRows: [["Slow cervical progress", "Poor contractions, obstruction or malposition", "Reassess and escalate using partograph"], ["Abnormal fetal heart", "Possible fetal distress", "Change position, call senior help and prepare referral/intervention"], ["Foul liquor or fever", "Possible infection", "Escalate and prepare antibiotics as prescribed"], ["Excess bleeding", "APH/PPH risk", "Emergency response and uterotonic readiness"]],
    redFlags: ["Fetal heart below or above normal range.", "Meconium with poor fetal heart.", "Convulsions or severe headache.", "Heavy bleeding.", "Prolonged labour.", "Fever or foul-smelling liquor.", "Retained placenta."],
    carePlanRows: [["Anxiety and pain", "Explain progress, support breathing, comfort and companionship", "Respectful care improves cooperation", "Mother feels supported"], ["Risk of fetal compromise", "Monitor fetal heart and labour progress", "Early recognition prevents delay", "Abnormal findings are escalated"], ["Risk of infection", "Use clean technique and limit unnecessary vaginal exams", "Reduces ascending infection", "Mother remains afebrile"]],
    teaching: ["Explain signs of true labour and when to come to facility.", "Teach danger signs: bleeding, reduced fetal movement, severe headache, fever or leaking liquor.", "Encourage birth preparedness and transport planning."],
    exam: ["Define labour.", "Name the stages.", "Explain physiology and signs of each stage.", "Describe monitoring with partograph.", "List danger signs and management priorities."]
  },
  {
    key: "hypertension",
    slugs: ["certificate-in-nursing-medical-nursing-i-and-pharmacology-i-hypertension", "diploma-nursing-direct-medical-nursing-i-and-pharmacology-i-hypertension", "essential-hypertension-in-pregnancy"],
    snapshot: "Hypertension is persistent high blood pressure. It is dangerous because many patients feel well while blood vessels, heart, brain, kidneys and eyes are being damaged.",
    coreIdea: "Pressure stays high against arterial walls.",
    nursingMeaning: "Measure accurately, assess target-organ risk, support adherence and identify emergencies.",
    doNotMiss: "Severe headache, chest pain, breathlessness, neurological signs, pregnancy hypertension and very high readings.",
    build: "Separate chronic control from emergency care. Routine hypertension needs long-term lifestyle and medicine adherence; severe symptomatic hypertension needs urgent escalation.",
    buildBullets: ["**Primary hypertension:** no single clear cause.", "**Secondary hypertension:** linked to another condition.", "**Pregnancy hypertension:** assess mother and fetus together.", "**Complications:** stroke, heart failure, renal disease and retinopathy."],
    ward: "A single high BP reading should be repeated correctly before action, unless the patient has danger signs.",
    wardSteps: ["Use correct cuff size and position arm at heart level.", "Repeat measurement and document time, arm and position.", "Ask about headache, visual changes, chest pain, dyspnoea, weakness and pregnancy.", "Check adherence, salt intake, alcohol, weight and comorbidities."],
    assessmentRows: [["Very high BP with symptoms", "Hypertensive emergency", "Escalate urgently"], ["Proteinuria in pregnancy", "Pre-eclampsia risk", "Urgent midwifery/medical review"], ["Poor adherence", "Uncontrolled chronic disease", "Counsel and identify barriers"], ["Leg swelling or dyspnoea", "Heart or renal complication", "Report and monitor closely"]],
    redFlags: ["Severe headache.", "Blurred vision.", "Chest pain.", "Shortness of breath.", "Weakness on one side.", "Convulsions in pregnancy.", "Reduced urine output."],
    carePlanRows: [["Ineffective health management", "Teach disease, medicines and follow-up", "Understanding improves adherence", "Patient follows plan"], ["Risk of decreased cardiac output", "Monitor BP, pulse, dyspnoea and oedema", "High pressure strains the heart", "Complications detected early"], ["Risk of stroke", "Escalate neurological signs immediately", "Early action reduces harm", "Urgent review occurs"]],
    teaching: ["Take medicines even when feeling well.", "Reduce salt, stop smoking, limit alcohol and keep follow-up appointments.", "Seek urgent care for chest pain, severe headache, weakness, breathlessness or visual changes."],
    exam: ["Define hypertension.", "Classify types.", "List risk factors and complications.", "Explain assessment and management.", "Add patient education and follow-up."]
  },
  {
    key: "pneumonia",
    slugs: ["certificate-in-nursing-medical-nursing-i-and-pharmacology-i-pneumonia", "diploma-nursing-direct-medical-nursing-i-and-pharmacology-i-pneumonia", "pneumonia-in-children"],
    snapshot: "Pneumonia is infection and inflammation of lung tissue. Nursing care focuses on oxygenation, fever control, hydration, medicine adherence, airway clearance and early detection of respiratory distress.",
    coreIdea: "Alveoli fill with inflammatory fluid and gas exchange becomes impaired.",
    nursingMeaning: "Assess breathing first, then infection severity and hydration.",
    doNotMiss: "Fast breathing, chest indrawing, cyanosis, confusion, hypoxia and danger signs in children.",
    build: "Pneumonia becomes dangerous when ventilation, perfusion and oxygenation are affected. The nurse watches work of breathing as carefully as temperature.",
    buildBullets: ["**Common features:** cough, fever, chest pain, sputum and fatigue.", "**Children:** may show fast breathing, poor feeding or lethargy.", "**Older adults:** may present with confusion or weakness.", "**Complications:** respiratory failure, sepsis, pleural effusion and dehydration."],
    ward: "At triage, respiratory distress should be seen before paperwork becomes the priority.",
    wardSteps: ["Count respiratory rate for a full minute.", "Check oxygen saturation if available.", "Observe chest indrawing, nasal flaring, cyanosis and ability to speak/feed.", "Give oxygen, fluids, antipyretics and antibiotics as prescribed."],
    assessmentRows: [["Fast breathing", "Respiratory compromise", "Escalate and monitor saturation"], ["Chest indrawing", "Increased work of breathing", "Urgent review"], ["Thick sputum", "Airway clearance problem", "Encourage fluids and coughing if safe"], ["Poor feeding in child", "Severe illness/dehydration", "Refer or admit per protocol"]],
    redFlags: ["Cyanosis.", "Oxygen saturation below target.", "Chest indrawing.", "Confusion.", "Inability to drink or breastfeed.", "Convulsions.", "Signs of sepsis."],
    carePlanRows: [["Impaired gas exchange", "Position upright, oxygen as prescribed, monitor saturation", "Improves ventilation and oxygen delivery", "Breathing eases"], ["Ineffective airway clearance", "Encourage cough, fluids and chest care as appropriate", "Helps remove secretions", "Air entry improves"], ["Hyperthermia", "Monitor temperature and give antipyretic as prescribed", "Reduces metabolic demand", "Fever reduces"]],
    teaching: ["Complete antibiotics if prescribed.", "Return for difficult breathing, blue lips, inability to drink, persistent fever or worsening weakness.", "Encourage immunization, nutrition, hand hygiene and reduced smoke exposure."],
    exam: ["Define pneumonia.", "State causes and risk factors.", "List clinical features.", "Explain assessment of respiratory distress.", "Describe management and prevention."]
  },
  {
    key: "shock",
    slugs: ["surgical-shock"],
    snapshot: "Shock is a life-threatening state of inadequate tissue perfusion. The nurse must recognize it early because delay leads to organ failure and death.",
    coreIdea: "Cells are not receiving enough oxygenated blood for normal function.",
    nursingMeaning: "Use ABCDE, call for help, monitor vital signs and support circulation quickly.",
    doNotMiss: "Restlessness, cold clammy skin, weak pulse, low BP, fast breathing, reduced urine and altered consciousness.",
    build: "Shock may come from bleeding, fluid loss, sepsis, heart failure, anaphylaxis or spinal injury. The visible cause may differ, but the nursing priority is perfusion.",
    buildBullets: ["**Hypovolaemic:** fluid or blood loss.", "**Septic:** infection with circulatory failure.", "**Cardiogenic:** pump failure.", "**Anaphylactic:** severe allergic reaction.", "**Neurogenic:** loss of vascular tone."],
    ward: "Treat suspected shock as urgent even before blood pressure drops. Early signs can be subtle.",
    wardSteps: ["Call for senior help.", "Assess airway, breathing and circulation.", "Control bleeding and establish IV access as ordered.", "Monitor pulse, BP, respiration, mental state, skin and urine output."],
    assessmentRows: [["Fast weak pulse", "Compensating for poor perfusion", "Escalate and monitor closely"], ["Cold clammy skin", "Peripheral shutdown", "Keep warm and treat cause"], ["Low urine output", "Poor renal perfusion", "Monitor input/output and report"], ["Confusion/restlessness", "Brain hypoperfusion", "Urgent ABCDE review"]],
    redFlags: ["Systolic BP falling.", "Pulse very fast or weak.", "Altered consciousness.", "Severe bleeding.", "Cold clammy skin.", "Oliguria.", "Sepsis signs."],
    carePlanRows: [["Ineffective tissue perfusion", "ABCDE assessment, oxygen as prescribed, IV access support", "Restores oxygen delivery", "Perfusion improves"], ["Risk of fluid volume deficit", "Monitor bleeding, fluids, pulse and BP", "Hypovolaemia worsens shock", "Circulation stabilizes"], ["Anxiety/fear", "Stay with patient and explain actions", "Calm support reduces panic", "Patient/family understand urgency"]],
    teaching: ["After recovery, explain cause and warning signs.", "Teach wound, medicine, hydration or infection follow-up depending on cause.", "Encourage urgent return for collapse, bleeding, fever or breathlessness."],
    exam: ["Define shock.", "Classify types.", "List early and late signs.", "Explain emergency management.", "Add nursing observations and complications."]
  },
  {
    key: "wounds",
    slugs: ["wound-dressing", "suturing-of-the-wound"],
    snapshot: "Wound care is the planned assessment, cleaning, protection and monitoring of damaged tissue so healing occurs without avoidable infection or breakdown.",
    coreIdea: "A wound interrupts skin or tissue integrity.",
    nursingMeaning: "Assess wound type, contamination, exudate, pain, surrounding skin and healing stage.",
    doNotMiss: "Sepsis signs, spreading cellulitis, necrosis, heavy bleeding, dehiscence and pressure injury.",
    build: "Original wound notes should move from wound type to healing needs: blood supply, cleanliness, moisture balance, pressure relief, nutrition and patient education.",
    buildBullets: ["**Clean wound:** lower infection risk.", "**Contaminated wound:** needs careful cleaning and observation.", "**Chronic wound:** often linked to pressure, diabetes, poor circulation or nutrition.", "**Dressing choice:** should match wound condition and facility protocol."],
    ward: "Before dressing, look first. A nurse should not remove and replace dressings mechanically without assessing the wound.",
    wardSteps: ["Prepare equipment and maintain privacy.", "Use hand hygiene and aseptic technique.", "Assess size, depth, exudate, odour, pain, edges and surrounding skin.", "Document findings and patient response."],
    assessmentRows: [["Foul smell", "Possible infection or necrosis", "Report and follow wound protocol"], ["Red hot surrounding skin", "Cellulitis/inflammation", "Escalate and monitor temperature"], ["Heavy exudate", "Infection or poor healing", "Protect skin and review dressing"], ["Black tissue", "Necrosis", "Needs clinical review"]],
    redFlags: ["Fever with wound infection signs.", "Rapidly spreading redness.", "Severe pain.", "Wound opening after surgery.", "Uncontrolled bleeding.", "Black tissue or gas/crepitus."],
    carePlanRows: [["Impaired skin integrity", "Clean and dress using aseptic technique", "Reduces contamination and protects tissue", "Wound bed improves"], ["Risk of infection", "Monitor temperature, odour, exudate and redness", "Early signs guide treatment", "Infection controlled"], ["Pain", "Give analgesia before dressing if prescribed", "Pain control improves cooperation", "Dressing tolerated"]],
    teaching: ["Keep dressing clean and dry unless instructed otherwise.", "Return for fever, swelling, pus, bad smell, severe pain or bleeding.", "Eat protein-rich foods and avoid pressure on the wound."],
    exam: ["Define wound.", "Classify wounds.", "List factors affecting healing.", "Explain wound assessment.", "Describe dressing procedure and patient education."]
  },
  {
    key: "mental-status",
    slugs: ["assessment-of-the-mentally-ill", "diploma-nursing-direct-mental-health-nursing-i-and-pharmacology-ii-psychiatric-assessment"],
    snapshot: "Mental status assessment is a structured observation of how a patient looks, speaks, feels, thinks, perceives, remembers and judges reality.",
    coreIdea: "The nurse assesses mental function through observation, interview and safety screening.",
    nursingMeaning: "Document behaviour objectively and identify risk early.",
    doNotMiss: "Suicidal ideas, violence risk, delirium, hallucinations, confusion and inability to care for self.",
    build: "A strong mental status note separates what the patient says from what the nurse observes. It avoids labels and records evidence.",
    buildBullets: ["**Appearance and behaviour:** grooming, eye contact, activity and cooperation.", "**Speech:** rate, volume, relevance and coherence.", "**Mood and affect:** reported feeling and observed emotional expression.", "**Thought:** flow, content, delusions, suicidal ideas.", "**Cognition:** orientation, memory, attention and judgement."],
    ward: "Use calm questions, privacy and safety. If risk is present, do not leave the patient unsupported.",
    wardSteps: ["Observe before questioning.", "Ask open questions and listen without arguing.", "Screen for self-harm, harm to others and hallucinations.", "Record exact patient statements when risk is mentioned."],
    assessmentRows: [["Confusion with fever", "Possible delirium or infection", "Urgent medical review"], ["Suicidal plan", "High self-harm risk", "Do not leave alone; escalate"], ["Hallucinations commanding harm", "Safety risk", "Escalate and reduce stimuli"], ["Poor self-care", "Functional impairment", "Assess support and care needs"]],
    redFlags: ["Suicidal plan or attempt.", "Threats to others.", "Acute confusion.", "Command hallucinations.", "Severe withdrawal or refusal of food/fluid.", "Aggression with poor impulse control."],
    carePlanRows: [["Risk for self-directed violence", "Maintain observation and remove hazards", "Reduces opportunity for harm", "Patient remains safe"], ["Disturbed thought process", "Use simple reality-based communication", "Reduces distress and confusion", "Patient engages calmly"], ["Self-care deficit", "Assist hygiene, nutrition and routine", "Preserves dignity and health", "Basic needs are met"]],
    teaching: ["Explain follow-up, medicines and relapse signs to patient and caregiver where appropriate.", "Encourage early help for poor sleep, withdrawal, substance use or suicidal thoughts.", "Teach family to reduce stigma and support safety."],
    exam: ["Define mental status assessment.", "List components.", "Explain risk assessment.", "Give examples of objective documentation.", "State nursing actions for urgent risk."]
  },
  {
    key: "drug-administration",
    slugs: ["administer-drugs-appropriately"],
    snapshot: "Drug administration is a safety procedure, not just giving tablets or injections. The nurse protects the patient by verifying the order, patient, medicine, dose, route, time, indication, allergies, response and documentation.",
    coreIdea: "A medicine can heal or harm depending on how safely it is used.",
    nursingMeaning: "Every administration needs assessment before, monitoring during and evaluation after.",
    doNotMiss: "Allergy, wrong patient, wrong dose, unclear order, expired medicine, contraindication and adverse reaction.",
    build: "Use the medication rights as a thinking tool. Do not memorize them as a list only; apply them at the bedside.",
    buildBullets: ["**Before:** check order, patient, allergies, indication and baseline observations.", "**During:** prepare correctly, explain, administer by correct route and maintain infection prevention.", "**After:** monitor effect, side effects, document and report errors immediately."],
    ward: "If something about a prescription is unclear, pause and clarify before giving the medicine.",
    wardSteps: ["Compare prescription with medicine label.", "Identify patient using approved identifiers.", "Calculate dose carefully and ask for double-check when high risk.", "Document immediately after administration."],
    assessmentRows: [["History of allergy", "Risk of reaction/anaphylaxis", "Withhold and report according to policy"], ["Low BP before antihypertensive", "Drug may worsen hypotension", "Clarify before giving"], ["Vomiting after oral dose", "Dose may not be absorbed", "Report and follow protocol"], ["New rash or wheeze", "Possible adverse reaction", "Stop if ordered and escalate urgently"]],
    redFlags: ["Anaphylaxis signs.", "Unclear or incomplete prescription.", "High-alert medication without double-check.", "Dose calculation uncertainty.", "Patient refuses medicine.", "Unexpected deterioration after a drug."],
    carePlanRows: [["Risk of medication error", "Use rights, check calculations and clarify orders", "Prevents preventable harm", "Medicine given safely"], ["Deficient knowledge", "Explain purpose and side effects", "Improves adherence", "Patient states correct use"], ["Risk of adverse reaction", "Monitor response and document", "Early detection reduces harm", "Reaction managed promptly"]],
    teaching: ["Know the medicine name, purpose and timing.", "Do not share medicines.", "Report rash, swelling, breathing difficulty, severe dizziness or unusual bleeding.", "Complete courses such as antibiotics unless told otherwise."],
    exam: ["Define drug administration.", "List medication rights.", "Explain preparation, administration and documentation.", "State adverse reaction actions.", "Add patient education."]
  }
];

function applySignatureLessons(data) {
  let applied = 0;
  for (const config of SIGNATURE_LESSON_GROUPS) {
    for (const slug of config.slugs) {
      const lesson = data.lessons && data.lessons[slug];
      if (!lesson || lesson.nursingUgandaSignature) continue;
      lesson.sections = [
        ...signatureSections(config),
        ...(lesson.sections || []).filter((section) => !/^(Nursing Uganda Snapshot|Build The Idea|Ward Mode|What The Nurse Looks For|Red Flags|Care Plan Map|Patient Teaching|Exam Answer Map)$/i.test(section.title || ""))
      ];
      lesson.nursingUgandaSignature = config.key;
      applied += 1;
    }
  }
  return applied;
}

function enrichAllLessons(data) {
  const contexts = contextIndex(data);
  let enriched = 0;

  for (const [slug, lesson] of Object.entries(data.lessons || {})) {
    if (!lesson || hasSection(lesson, /^Nursing Uganda Clinical Lens$/i)) continue;
    const context = contexts.get(slug);
    const title = context && context.topic && context.topic.title ? context.topic.title : lesson.title || slug;
    lesson.sections = lesson.sections || [];
    lesson.sections.push(...clinicalStudyLayer(title, context));
    lesson.nursingUgandaStudyLayer = true;
    enriched += 1;
  }

  return enriched;
}

function skeletalFractureExtension() {
  return {
    title: "Clinical Extension: Fractures and Skeletal Injuries",
    blocks: [
      block("paragraph", "A **fracture** is a break in the continuity of bone. In nursing practice it is studied with the skeletal system because bone structure, blood supply, periosteum, joints, muscles and nerves all influence the patient's pain, deformity, movement, circulation and healing."),
      block("bullet", "**Common causes:** direct trauma, twisting force, falls, road traffic injury, violent muscle contraction, repeated stress, osteoporosis, bone tumour, infection, malnutrition and ageing."),
      block("bullet", "**Closed fracture:** the bone is broken but the skin remains intact. Infection risk is lower, but bleeding, swelling and neurovascular compromise may still be serious."),
      block("bullet", "**Open fracture:** the wound communicates with the fracture site. Treat it as contaminated, cover with a sterile dressing, prevent further movement and refer urgently."),
      block("bullet", "**Complete and incomplete fractures:** complete fractures pass through the full width of bone, while incomplete fractures include greenstick and hairline injuries, especially in children or stress injuries."),
      block("bullet", "**Pattern classification:** transverse, oblique, spiral, comminuted, impacted, depressed, avulsion, compression and pathological fractures. The pattern helps predict stability and treatment."),
      block("bullet", "**Priority assessment:** pain, swelling, bruising, deformity, shortening, abnormal movement, crepitus, loss of function, wounds, bleeding and the mechanism of injury."),
      block("bullet", "**Neurovascular checks:** assess colour, warmth, capillary refill, distal pulses, sensation, movement, increasing pain and tightness before and after splints, casts or traction."),
      block("bullet", "**Immediate nursing care:** maintain airway and circulation if trauma is severe, control bleeding, immobilize the limb in the position found, elevate if appropriate, apply cold packs where safe, give analgesia as prescribed and prepare for X-ray or referral."),
      block("bullet", "**Complications to remember:** shock, haemorrhage, fat embolism, compartment syndrome, infection, delayed union, non-union, malunion, avascular necrosis, pressure injury under a cast and deep vein thrombosis."),
      block("bullet", "**Patient teaching:** keep the cast dry, do not insert objects under the cast, return urgently for numbness, blue fingers or toes, severe pain, swelling, foul smell, fever or inability to move digits.")
    ]
  };
}

function enrichedFractureLesson() {
  return {
    title: "Fractures",
    excerpt: "Expanded Nursing Uganda notes on fracture definition, classification, assessment, emergency care, complications, treatment and nursing management.",
    sourceFile: "fractures.html",
    nursingUgandaEnriched: true,
    sections: [
      {
        title: "Meaning and Clinical Importance",
        blocks: [
          block("paragraph", "A **fracture** is any break in the normal continuity of a bone. It may be a small crack, a partial break or a complete separation into two or more fragments."),
          block("paragraph", "For nurses, fractures are not only bone injuries. They affect pain, bleeding, mobility, circulation, nerves, skin integrity, independence, psychological comfort and the patient's ability to continue daily activities.")
        ]
      },
      skeletalFractureExtension(),
      {
        title: "Treatment and Nursing Management",
        blocks: [
          block("bullet", "**Reduction:** restores bone alignment. It may be closed manipulation or open surgical reduction depending on the fracture."),
          block("bullet", "**Immobilization:** uses splints, casts, traction, external fixation or internal fixation to maintain alignment while healing occurs."),
          block("bullet", "**Pain control:** assess pain regularly, give prescribed analgesics, support the limb, reduce unnecessary movement and explain procedures before touching the injury."),
          block("bullet", "**Cast care:** check circulation, sensation and movement; keep the cast dry; support the wet cast with palms; observe for tightness, cracks, drainage, odour or pressure areas."),
          block("bullet", "**Traction care:** maintain correct line of pull, prescribed weight, skin care, pin-site care where applicable, pressure-area care and regular neurovascular observations."),
          block("bullet", "**Rehabilitation:** encourage safe exercises, breathing exercises if immobile, nutrition rich in protein/calcium/vitamin D, prevention of constipation and gradual return of function.")
        ]
      },
      {
        title: "Revision Index",
        blocks: [
          block("bullet", "Define fracture and list five causes."),
          block("bullet", "Differentiate closed, open, complete, incomplete, displaced and pathological fractures."),
          block("bullet", "Explain five signs of fracture and five neurovascular observations."),
          block("bullet", "List immediate first aid steps before referral."),
          block("bullet", "Describe complications that require urgent escalation.")
        ]
      }
    ]
  };
}

function enrichCoreLessons(data) {
  data.lessons = data.lessons || {};
  let enriched = 0;

  for (const slug of ["skeletal-system", "anatomy-and-physiology-of-the-musculo-skeletal-system"]) {
    const lesson = data.lessons[slug];
    if (!lesson) continue;
    if (!hasSection(lesson, /fractures? and skeletal injuries/i)) {
      lesson.sections = lesson.sections || [];
      const insertAfter = lesson.sections.findIndex((section) => /fracture|bone structure|skeletal/i.test(section.title || ""));
      lesson.sections.splice(insertAfter >= 0 ? insertAfter + 1 : lesson.sections.length, 0, skeletalFractureExtension());
      lesson.nursingUgandaEnriched = true;
      enriched += 1;
    }
  }

  if (!data.lessons.fractures || lessonWordCount(data.lessons.fractures) < 900 || (data.lessons.fractures.sections || []).length < 3) {
    data.lessons.fractures = enrichedFractureLesson();
    enriched += 1;
  }

  return enriched;
}

function recalculateStats(data) {
  const totals = { programmes: (data.programmes || []).length, years: 0, semesters: 0, courseUnits: 0, topics: 0 };

  for (const programme of data.programmes || []) {
    let semesterCount = 0;
    let unitCount = 0;
    let topicCount = 0;

    for (const year of sortedYears(programme)) {
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
      yearCount: sortedYears(programme).length,
      semesterCount,
      unitCount,
      topicCount
    };

    totals.years += sortedYears(programme).length;
    totals.semesters += semesterCount;
    totals.courseUnits += unitCount;
    totals.topics += topicCount;
  }

  data.totals = totals;
}

function main() {
  const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  const backfilled = backfillRepeatedTopics(data);
  const enriched = enrichCoreLessons(data);
  const signatureLessons = applySignatureLessons(data);
  const studyLayered = enrichAllLessons(data);
  const sanitizedImportedItems = sanitizeLessons(data);
  recalculateStats(data);
  data.generatedAtUtc = new Date().toISOString();
  data.lessonBackfill = {
    backfilledRepeatedTopics: backfilled,
    enrichedCoreLessons: enriched,
    signatureLessons,
    studyLayeredLessons: studyLayered,
    sanitizedImportedItems,
    referenceScope: "Uses the care-plan depth pattern common in nursing references such as Nurseslabs: assessment, problems, interventions, rationales and evaluation.",
    policy: "Repeated topics with exact normalized titles reuse the richest existing lesson; all clinical study layers are original Nursing Uganda study notes and do not copy external note wording."
  };
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  console.log(`Backfilled ${backfilled} repeated topics from existing lessons.`);
  console.log(`Enriched ${enriched} core lessons.`);
  console.log(`Applied Nursing Uganda signature format to ${signatureLessons} high-value lesson bodies.`);
  console.log(`Removed ${sanitizedImportedItems} imported curriculum/question/reference items from lesson bodies.`);
}

main();
