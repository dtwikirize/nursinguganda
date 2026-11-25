/**
 * Coursera-style country curricula, courses, drug/lab localization, and premium offers
 * for UK, USA, Canada, and Australia nursing hubs + 779 localized country topic pages.
 */

export const COUNTRY_META = {
  uk: {
    key: "uk",
    slug: "united-kingdom-nmc",
    route: "/nursing-uk",
    topicsBase: "/nursing-uk/topics",
    flag: "UK",
    name: "United Kingdom",
    shortName: "UK",
    academy: "UK NMC Academy",
    examBadge: "NMC CBT & 10-Station OSCE",
    unitLabel: "SI Units (mmol/L, g/L)",
    drugConvention: "UK BNF Approved Names (Paracetamol, Adrenaline, Salbutamol)",
    guidelineAuthority: "NMC Code (2018) · NICE Guidelines · NHS NEWS2",
    themeKey: "coursera-black",
    heroBg: "#0A0D14",
    accent: "#111827"
  },
  usa: {
    key: "usa",
    slug: "united-states-nclex",
    route: "/nursing-usa",
    topicsBase: "/nursing-usa/topics",
    flag: "US",
    name: "United States",
    shortName: "USA",
    academy: "USA NCLEX-RN Academy",
    examBadge: "Next-Gen NCLEX-RN (NGN) & CGFNS",
    unitLabel: "US Conventional (mg/dL, mEq/L)",
    drugConvention: "USAN Generic Names (Acetaminophen, Epinephrine, Albuterol)",
    guidelineAuthority: "NCSBN 6-Step CJMM · AHA / CDC · State Boards",
    themeKey: "red-black",
    heroBg: "#991B1B",
    accent: "#09090B"
  },
  canada: {
    key: "canada",
    slug: "canada-nnas-nclex",
    route: "/nursing-canada",
    topicsBase: "/nursing-canada/topics",
    flag: "CA",
    name: "Canada",
    shortName: "Canada",
    academy: "Canada NNAS & NCLEX/REx-PN Academy",
    examBadge: "NNAS · NCLEX-RN · REx-PN",
    unitLabel: "Canadian SI Units (mmol/L, µmol/L)",
    drugConvention: "Health Canada Generic Names (Acetaminophen / Epinephrine)",
    guidelineAuthority: "CNO / BCCNM / CRNA Entry-to-Practice Competencies",
    themeKey: "red-black",
    heroBg: "#991B1B",
    accent: "#09090B"
  },
  australia: {
    key: "australia",
    slug: "australia-ahpra-nmba",
    route: "/nursing-australia",
    topicsBase: "/nursing-australia/topics",
    flag: "AU",
    name: "Australia",
    shortName: "Australia",
    academy: "Australia Ahpra & NMBA Academy",
    examBadge: "Ahpra OBA · NCLEX-RN + OSCE",
    unitLabel: "Australian SI Units (mmol/L, g/L)",
    drugConvention: "Australian Approved Names (Paracetamol, Adrenaline, Lignocaine)",
    guidelineAuthority: "NMBA RN Standards · ACSQHC NSQHS · Australian PBS",
    themeKey: "green-black",
    heroBg: "#064E3B",
    accent: "#09090B"
  },
  kenya: {
    key: "kenya",
    slug: "kenya-nck",
    route: "/global-nursing/kenya-nck",
    topicsBase: "/global-nursing/kenya-nck/topics",
    flag: "KE",
    name: "Kenya",
    shortName: "Kenya",
    academy: "Kenya NCK Nursing Academy",
    examBadge: "NCK KRCHN & BScN Licensure",
    unitLabel: "SI Units (mmol/L, g/dL, °C)",
    drugConvention: "WHO / Kenya Essential Medicines List (KEML)",
    guidelineAuthority: "Nursing Council of Kenya (NCK) · Ministry of Health Kenya",
    themeKey: "blue-black",
    heroBg: "#1E3A8A",
    accent: "#09090B"
  },
  uganda: {
    key: "uganda",
    slug: "uganda-unmc-uhpab",
    route: "/global-nursing/uganda-unmc-uhpab",
    topicsBase: "/global-nursing/uganda-unmc-uhpab/topics",
    flag: "UG",
    name: "Uganda",
    shortName: "Uganda",
    academy: "Uganda UHPAB & UNMC Academy",
    examBadge: "UHPAB (UNMEB) & UNMC",
    unitLabel: "SI Units (mmol/L, g/dL, °C)",
    drugConvention: "Uganda Essential Medicines & WHO Generic Names",
    guidelineAuthority: "Uganda Clinical Guidelines 2023 · UNMC · UHPAB",
    themeKey: "green-black",
    heroBg: "#064E3B",
    accent: "#09090B"
  },
  tanzania: {
    key: "tanzania",
    slug: "tanzania-tnmc",
    route: "/global-nursing/tanzania-tnmc",
    topicsBase: "/global-nursing/tanzania-tnmc/topics",
    flag: "TZ",
    name: "Tanzania",
    shortName: "Tanzania",
    academy: "Tanzania TNMC Nursing Academy",
    examBadge: "TNMC National Licensure",
    unitLabel: "SI Units (mmol/L, g/dL, °C)",
    drugConvention: "Tanzania STG & WHO Generic Names",
    guidelineAuthority: "Tanzania Nursing and Midwifery Council (TNMC) · EAC",
    themeKey: "green-black",
    heroBg: "#064E3B",
    accent: "#09090B"
  },
  gulf: {
    key: "gulf",
    slug: "gulf-dha-doh-scfhs",
    route: "/global-nursing/gulf-dha-doh-scfhs",
    topicsBase: "/global-nursing/gulf-dha-doh-scfhs/topics",
    flag: "AE",
    name: "UAE & Gulf",
    shortName: "UAE / Gulf",
    academy: "UAE & Gulf Prometric Academy",
    examBadge: "DHA · DOH · MOHAP · SCFHS",
    unitLabel: "SI & US Lab Values",
    drugConvention: "International Generic & Hospital Formulary",
    guidelineAuthority: "DHA / DOH / MOHAP / SCFHS · DataFlow PSV",
    themeKey: "green-black",
    heroBg: "#064E3B",
    accent: "#09090B"
  }
};

export const SLUG_TO_COUNTRY_KEY = {
  "united-kingdom-nmc": "uk",
  "united-states-nclex": "usa",
  "canada-nnas-nclex": "canada",
  "australia-ahpra-nmba": "australia",
  "kenya-nck": "kenya",
  "uganda-unmc-uhpab": "uganda",
  "tanzania-tnmc": "tanzania",
  "gulf-dha-doh-scfhs": "gulf"
};

export const DRUG_NAME_EQUIVALENTS = [
  { genericUgUkAu: "Paracetamol", usCaName: "Acetaminophen", className: "Analgesic / Antipyretic", note: "Max adult 4 g/24h; check LFTs in overdose." },
  { genericUgUkAu: "Adrenaline", usCaName: "Epinephrine", className: "Sympathomimetic / Vasopressor", note: "Anaphylaxis adult IM: 0.5 mg (1:1000)." },
  { genericUgUkAu: "Noradrenaline", usCaName: "Norepinephrine", className: "Vasopressor", note: "First-line vasopressor in septic shock." },
  { genericUgUkAu: "Salbutamol", usCaName: "Albuterol", className: "Short-Acting Beta-2 Agonist", note: "Acute bronchospasm / hyperkalemia nebulizer." },
  { genericUgUkAu: "Lignocaine", usCaName: "Lidocaine", className: "Local Anesthetic / Antiarrhythmic", note: "Check max mg/kg before infiltration." },
  { genericUgUkAu: "Pethidine", usCaName: "Meperidine", className: "Opioid Analgesic", note: "Avoid repeated doses due to normeperidine neurotoxicity." },
  { genericUgUkAu: "Glibenclamide", usCaName: "Glyburide", className: "Sulfonylurea", note: "Monitor fasting glucose for prolonged hypoglycemia." },
  { genericUgUkAu: "Ciclosporin", usCaName: "Cyclosporine", className: "Immunosuppressant", note: "Monitor serum trough levels & renal function." }
];

export const LAB_CONVERSIONS = [
  { test: "Fasting Blood Glucose", siRange: "3.9 – 5.5 mmol/L", usRange: "70 – 99 mg/dL", factorToUs: 18.016, siUnit: "mmol/L", usUnit: "mg/dL" },
  { test: "Serum Creatinine (Adult)", siRange: "60 – 110 µmol/L", usRange: "0.7 – 1.2 mg/dL", factorToUs: 0.0113, siUnit: "µmol/L", usUnit: "mg/dL" },
  { test: "Hemoglobin (Adult Male)", siRange: "130 – 175 g/L", usRange: "13.0 – 17.5 g/dL", factorToUs: 0.1, siUnit: "g/L", usUnit: "g/dL" },
  { test: "Serum Potassium (K+)", siRange: "3.5 – 5.0 mmol/L", usRange: "3.5 – 5.0 mEq/L", factorToUs: 1, siUnit: "mmol/L", usUnit: "mEq/L" },
  { test: "Serum Sodium (Na+)", siRange: "135 – 145 mmol/L", usRange: "135 – 145 mEq/L", factorToUs: 1, siUnit: "mmol/L", usUnit: "mEq/L" },
  { test: "Total Cholesterol (Desirable)", siRange: "< 5.2 mmol/L", usRange: "< 200 mg/dL", factorToUs: 38.67, siUnit: "mmol/L", usUnit: "mg/dL" }
];

export const COUNTRY_CURRICULA = {
  "united-kingdom-nmc": {
    partnerLine: "Aligned to NMC Future Nurse Standards (2018) & NHS Clinical Practice",
    totalHours: "68 hours",
    level: "International RN Track",
    certificateTitle: "UK NMC CBT & 10-Station OSCE Readiness Certificate",
    courses: [
      {
        id: "uk-cbt-numeracy",
        title: "NMC CBT Part A: Clinical Numeracy & IV Calculations",
        provider: "UK NMC Academy",
        level: "Module 1 · 12 hrs",
        rating: "4.9",
        topicsCount: 18,
        summary: "Zero-rounding-error drills for oral dosages, mg/kg weight-based dosing, IV drip rates (mL/hr), and fluid balance charts.",
        sampleTopicSlug: "dosage-calculations"
      },
      {
        id: "uk-cbt-clinical",
        title: "NMC CBT Part B: Future Nurse Theory & NMC Code",
        provider: "UK NMC Academy",
        level: "Module 2 · 24 hrs",
        rating: "4.9",
        topicsCount: 120,
        summary: "100-question blueprint covering Safeguarding, Mental Capacity Act, NICE Sepsis, infection control, and BNF pharmacology.",
        sampleTopicSlug: "infection-prevention-and-control"
      },
      {
        id: "uk-osce-apie",
        title: "10-Station UK OSCE: APIE, NEWS2 & ANTT Skills",
        provider: "UK NMC Academy",
        level: "Module 3 · 32 hrs",
        rating: "4.8",
        topicsCount: 64,
        summary: "Step-by-step APIE care planning, NEWS2 escalation, ANTT wound/catheter care, and structured SBAR communication.",
        sampleTopicSlug: "taking-vital-signs-or-observations"
      }
    ],
    modules: [
      {
        number: 1,
        title: "NMC Code, Safeguarding & Legal Frameworks (UK)",
        duration: "8 hours · 14 readings · 2 quizzes",
        outcomes: [
          "Apply the 4 pillars of The NMC Code (Prioritize people, Practice effectively, Preserve safety, Promote professionalism).",
          "Navigate Mental Capacity Act (2005), Deprivation of Liberty Safeguards (DoLS), and Duty of Candour."
        ],
        topicSlugs: ["ethics-in-research", "communication-in-palliative-care"]
      },
      {
        number: 2,
        title: "CBT Part A: High-Precision UK Clinical Numeracy",
        duration: "12 hours · 18 drills · 3 timed mocks",
        outcomes: [
          "Solve 15-question Part A numeracy sets within 30 minutes with exact decimal rules.",
          "Convert microgram/milligram/gram and mL/hr infusion pumps without rounding mistakes."
        ],
        topicSlugs: ["dosage-calculations", "fluid-and-electrolyte-imbalance"]
      },
      {
        number: 3,
        title: "APIE Nursing Process & NEWS2 Escalation",
        duration: "18 hours · 22 readings · OSCE checklists",
        outcomes: [
          "Complete Assessment, Planning, Implementation, and Evaluation stations within UK OSCE time limits.",
          "Calculate NEWS2 scores and escalate deteriorating patients using SBAR."
        ],
        topicSlugs: ["taking-vital-signs-or-observations", "surgical-shock"]
      },
      {
        number: 4,
        title: "UK BNF Pharmacology, ANTT & Infection Control",
        duration: "16 hours · 30 readings · 2 quizzes",
        outcomes: [
          "Master UK drug naming (Paracetamol, Adrenaline, Salbutamol, Furosemide) and high-alert IV safety.",
          "Execute Aseptic Non-Touch Technique (ANTT) for cannulation, catheterization, and wound dressings."
        ],
        topicSlugs: ["infection-prevention-and-control", "instilling-medication"]
      },
      {
        number: 5,
        title: "NICE Acute Care: Sepsis, Diabetes, Cardiac & Respiratory",
        duration: "14 hours · 25 readings · Full CBT Mock",
        outcomes: [
          "Apply NICE Sepsis Six bundle within 1 hour of red-flag recognition.",
          "Interpret UK SI blood glucose (<4.0 mmol/L hypoglycemia), ABGs, and heart failure management."
        ],
        topicSlugs: ["certificate-in-nursing-medical-nursing-ll-and-pharmacology-ll-diabetes-mellitus", "certificate-in-nursing-medical-nursing-i-and-pharmacology-i-hypertension"]
      }
    ],
    premiumOffer: {
      badge: "UK NMC COMPLETE BUNDLE",
      title: "UK NMC CBT + 10-Station OSCE Full Prep Pass",
      price: "$24.99",
      compareAt: "$59.00",
      features: [
        "Unlimited CBT Part A Numeracy + Part B 100-Q Timed Mocks",
        "10-Station APIE & Clinical Skills OSCE Checklists",
        "UK BNF Drug Naming & SI Lab Reference eBook",
        "Full Access to All 779 Localized UK Study Topics"
      ],
      ctaLabel: "Browse Full Prep Courses",
      ctaTo: "/courses"
    }
  },
  "united-states-nclex": {
    partnerLine: "Aligned to NCSBN Next-Gen NCLEX-RN (NGN) Test Plan & US Conventional Units",
    totalHours: "84 hours",
    level: "Next-Gen NCLEX-RN",
    certificateTitle: "USA Next-Gen NCLEX-RN & Clinical Judgment Certificate",
    courses: [
      {
        id: "us-ngn-cjmm",
        title: "Next-Gen NCLEX (NGN): 6-Step Clinical Judgment Mastery",
        provider: "USA NCLEX Academy",
        level: "Module 1 · 22 hrs",
        rating: "4.9",
        topicsCount: 95,
        summary: "Master Recognize Cues, Analyze Cues, Prioritize Hypotheses, Generate Solutions, Take Action, and Evaluate Outcomes.",
        sampleTopicSlug: "nursing-process"
      },
      {
        id: "us-pharm-labs",
        title: "US Pharmacology & Conventional Lab Values (mg/dL, mEq/L)",
        provider: "USA NCLEX Academy",
        level: "Module 2 · 28 hrs",
        rating: "4.9",
        topicsCount: 160,
        summary: "High-alert US generic names (Acetaminophen, Epinephrine, Albuterol), therapeutic drug ranges, and conventional lab drills.",
        sampleTopicSlug: "instilling-medication"
      },
      {
        id: "us-delegation-priority",
        title: "NCLEX Prioritization, Delegation (RN/LPN/UAP) & Safety",
        provider: "USA NCLEX Academy",
        level: "Module 3 · 34 hrs",
        rating: "4.8",
        topicsCount: 110,
        summary: "Master ABCs, Maslow, acute-vs-chronic triage, airborne/droplet/contact isolation, and State Board scope of practice.",
        sampleTopicSlug: "first-aid"
      }
    ],
    modules: [
      {
        number: 1,
        title: "CGFNS Credentialing, State Boards & NGN CAT Blueprint",
        duration: "10 hours · 12 readings · 1 diagnostic",
        outcomes: [
          "Understand CES evaluation, VisaScreen, ATT scheduling, and the 85–150 question adaptive CAT engine.",
          "Break down the 8 NCSBN Client Needs categories by exam weight."
        ],
        topicSlugs: ["ethics-in-research", "nursing-process"]
      },
      {
        number: 2,
        title: "NCSBN 6-Step CJMM & Unfolding Case Studies",
        duration: "18 hours · 24 case drills · Matrix & Bow-Tie items",
        outcomes: [
          "Solve NGN unfolding 6-item case studies (Extended Multiple Response, Highlight, Drag-and-Drop).",
          "Avoid common distractors in acute medical-surgical deterioration."
        ],
        topicSlugs: ["surgical-shock", "fluid-and-electrolyte-imbalance"]
      },
      {
        number: 3,
        title: "Management of Care: Delegation, Legal & Isolation",
        duration: "16 hours · 20 readings · 2 quizzes",
        outcomes: [
          "Delegate safely between RN, LPN/LVN, and UAP/CNA using US scope-of-practice rules.",
          "Apply HIPAA, informed consent, advance directives, and CDC transmission precautions."
        ],
        topicSlugs: ["infection-prevention-and-control", "leadership-introduction"]
      },
      {
        number: 4,
        title: "US Pharmacology & Conventional Lab Mastery",
        duration: "22 hours · 45 drug classes · Lab flashcards",
        outcomes: [
          "Convert seamlessly from SI units to US conventional units (glucose 70–99 mg/dL, creatinine 0.7–1.2 mg/dL).",
          "Monitor digoxin, lithium, warfarin (INR), heparin (aPTT), and vancomycin troughs."
        ],
        topicSlugs: ["instilling-medication", "certificate-in-nursing-medical-nursing-ll-and-pharmacology-ll-diabetes-mellitus"]
      },
      {
        number: 5,
        title: "Maternal-Newborn, Pediatrics & Mental Health NCLEX Review",
        duration: "18 hours · 30 readings · 150-Q Mock Exam",
        outcomes: [
          "Interpret fetal heart rate decelerations (VEAL CHOP), postpartum hemorrhage, and pediatric milestones.",
          "Apply therapeutic communication and suicide/lithium/MAOI precautions."
        ],
        topicSlugs: ["certificate-in-midwifery-midwifery-i-and-pharmacology-i-1-8-labour", "communication-in-palliative-care"]
      }
    ],
    premiumOffer: {
      badge: "USA NEXT-GEN NCLEX BUNDLE",
      title: "Next-Gen NCLEX-RN (NGN) & CGFNS Full Study Pack",
      price: "$29.99",
      compareAt: "$69.00",
      features: [
        "NGN 6-Step CJMM Case Studies + 85–150 Q CAT Practice",
        "US Conventional Lab Values & High-Alert Drug Bible",
        "RN / LPN / UAP Delegation & Prioritization Playbook",
        "Full Access to All 779 Localized USA Study Topics"
      ],
      ctaLabel: "Browse Full Prep Courses",
      ctaTo: "/courses"
    }
  },
  "canada-nnas-nclex": {
    partnerLine: "Aligned to NNAS, CNO/BCCNM Entry-to-Practice Competencies & NCLEX-RN / REx-PN",
    totalHours: "72 hours",
    level: "RN (NCLEX) & RPN/LPN (REx-PN)",
    certificateTitle: "Canada NNAS, NCLEX-RN & REx-PN Readiness Certificate",
    courses: [
      {
        id: "ca-nnas-etpc",
        title: "NNAS Advisory Report & Provincial College Pathways",
        provider: "Canada Nursing Academy",
        level: "Module 1 · 14 hrs",
        rating: "4.9",
        topicsCount: 28,
        summary: "Navigate NNAS Main vs Expedited pathways, CNO Ontario jurisprudence, BCCNM BC, and CRNA Alberta requirements.",
        sampleTopicSlug: "ethics-in-research"
      },
      {
        id: "ca-nclex-rexpn",
        title: "Canadian NCLEX-RN & REx-PN Clinical Decision Mastery",
        provider: "Canada Nursing Academy",
        level: "Module 2 · 36 hrs",
        rating: "4.9",
        topicsCount: 150,
        summary: "Dual-track prep for RN (NCLEX-RN) and RPN/LPN (REx-PN 90–150 items) using Canadian SI laboratory standards.",
        sampleTopicSlug: "fluid-and-electrolyte-imbalance"
      },
      {
        id: "ca-safety-culture",
        title: "Canadian Healthcare Ethics, Cultural Safety & Medication Safety",
        provider: "Canada Nursing Academy",
        level: "Module 3 · 22 hrs",
        rating: "4.8",
        topicsCount: 75,
        summary: "Trauma-informed care, Indigenous cultural safety, interprofessional SBAR, and Health Canada drug standards.",
        sampleTopicSlug: "communication-in-palliative-care"
      }
    ],
    modules: [
      {
        number: 1,
        title: "NNAS Document Verification & Provincial Jurisprudence",
        duration: "12 hours · 15 readings · 2 quizzes",
        outcomes: [
          "Prepare NNAS academic/registration packages and compare CNO, BCCNM, CRNA, and NSCN rules.",
          "Pass provincial Jurisprudence exams on consent, privacy, and mandatory reporting."
        ],
        topicSlugs: ["ethics-in-research", "leadership-introduction"]
      },
      {
        number: 2,
        title: "Canadian SI Lab Values & Medication Calculations",
        duration: "16 hours · 22 drills · SI flashcards",
        outcomes: [
          "Interpret Canadian SI labs (mmol/L, µmol/L, g/L) alongside Health Canada drug naming.",
          "Calculate pediatric mg/kg, insulin titrations, and IV pump rates accurately."
        ],
        topicSlugs: ["dosage-calculations", "certificate-in-nursing-medical-nursing-ll-and-pharmacology-ll-diabetes-mellitus"]
      },
      {
        number: 3,
        title: "REx-PN & NCLEX-RN Acute Medical-Surgical Care",
        duration: "24 hours · 40 readings · 2 mocks",
        outcomes: [
          "Differentiate stable/predictable RPN care from unstable/complex RN escalation.",
          "Manage sepsis, stroke, ACS, COPD, and acute kidney injury."
        ],
        topicSlugs: ["surgical-shock", "certificate-in-nursing-medical-nursing-i-and-pharmacology-i-hypertension"]
      },
      {
        number: 4,
        title: "Cultural Safety, Mental Health & Maternal-Child Nursing",
        duration: "20 hours · 30 readings · Final Assessment",
        outcomes: [
          "Integrate cultural humility and trauma-informed communication across diverse Canadian populations.",
          "Review perinatal complications, neonatal resuscitation, and psychiatric emergencies."
        ],
        topicSlugs: ["certificate-in-midwifery-midwifery-i-and-pharmacology-i-1-8-labour", "communication-in-palliative-care"]
      }
    ],
    premiumOffer: {
      badge: "CANADA NNAS + EXAM BUNDLE",
      title: "Canada NNAS, NCLEX-RN & REx-PN Complete Bundle",
      price: "$24.99",
      compareAt: "$59.00",
      features: [
        "Dual-Track NCLEX-RN + REx-PN (90–150 Q) Practice Sets",
        "Ontario CNO Jurisprudence & Provincial Roadmap Guide",
        "Canadian SI Lab Ranges & Pharmacology Pocket eBook",
        "Full Access to All 779 Localized Canada Study Topics"
      ],
      ctaLabel: "Browse Full Prep Courses",
      ctaTo: "/courses"
    }
  },
  "australia-ahpra-nmba": {
    partnerLine: "Aligned to Ahpra / NMBA Stream B OBA (NCLEX-RN + Australian OSCE)",
    totalHours: "70 hours",
    level: "Ahpra OBA Candidate",
    certificateTitle: "Australia Ahpra OBA (NCLEX-RN + OSCE) Certificate",
    courses: [
      {
        id: "au-oba-stage1",
        title: "Ahpra OBA Stage 1: NCLEX-RN Cognitive Exam Prep",
        provider: "Australia NMBA Academy",
        level: "Module 1 · 32 hrs",
        rating: "4.9",
        topicsCount: 140,
        summary: "Targeted NCLEX-RN cognitive mastery bridged to Australian SI units and clinical reasoning.",
        sampleTopicSlug: "nursing-process"
      },
      {
        id: "au-oba-stage2-osce",
        title: "Ahpra OBA Stage 2: 10-Station Australian OSCE Mastery",
        provider: "Australia NMBA Academy",
        level: "Module 2 · 26 hrs",
        rating: "4.9",
        topicsCount: 68,
        summary: "Behavioral stations, 3-identifier checks, 5 Moments of Hand Hygiene, NSQHS safety, and PBS medication charts.",
        sampleTopicSlug: "taking-vital-signs-or-observations"
      },
      {
        number: 3,
        id: "au-nmba-standards",
        title: "NMBA 7 RN Standards, Cultural Safety & Australian Drugs",
        provider: "Australia NMBA Academy",
        level: "Module 3 · 12 hrs",
        rating: "4.8",
        topicsCount: 45,
        summary: "Master Australian Approved Names (Paracetamol, Adrenaline, Lignocaine) and NMBA professional accountability.",
        sampleTopicSlug: "instilling-medication"
      }
    ],
    modules: [
      {
        number: 1,
        title: "Ahpra Self-Check, Portfolio & NMBA 7 Standards",
        duration: "10 hours · 12 readings · 1 quiz",
        outcomes: [
          "Complete Stream B documentation, English verification, and NMBA Code of Conduct alignment.",
          "Apply the 7 interconnected NMBA Registered Nurse Standards for Practice."
        ],
        topicSlugs: ["ethics-in-research", "leadership-introduction"]
      },
      {
        number: 2,
        title: "OBA Stage 1: NCLEX-RN Cognitive & Clinical Judgment",
        duration: "26 hours · 35 readings · 2 mocks",
        outcomes: [
          "Pass Stage 1 NCLEX-RN via Pearson VUE while keeping Australian SI units clear.",
          "Prioritize acute deterioration, fluid/electrolyte crises, and maternal-pediatric safety."
        ],
        topicSlugs: ["fluid-and-electrolyte-imbalance", "surgical-shock"]
      },
      {
        number: 3,
        title: "OBA Stage 2: Australian OSCE Stations & NSQHS Safety",
        duration: "22 hours · 10 station scripts · Checklists",
        outcomes: [
          "Verbalize 3 patient identifiers, allergies, and 5 Moments of Hand Hygiene in every OSCE station.",
          "Execute Australian National Inpatient Medication Chart (NIMC) checks and ISBAR handover."
        ],
        topicSlugs: ["taking-vital-signs-or-observations", "infection-prevention-and-control"]
      },
      {
        number: 4,
        title: "Australian Approved Drug Names & Acute Care Protocols",
        duration: "12 hours · 20 readings · Final Mock",
        outcomes: [
          "Use Australian PBS naming (Paracetamol, Adrenaline, Frusemide/Furosemide, Lignocaine) fluently.",
          "Manage sepsis, anaphylaxis, diabetic ketoacidosis, and mental health de-escalation."
        ],
        topicSlugs: ["instilling-medication", "certificate-in-nursing-medical-nursing-ll-and-pharmacology-ll-diabetes-mellitus"]
      }
    ],
    premiumOffer: {
      badge: "AUSTRALIA AHPRA OBA BUNDLE",
      title: "Australia Ahpra OBA (NCLEX-RN + OSCE) Full Prep Pack",
      price: "$24.99",
      compareAt: "$59.00",
      features: [
        "Stage 1 NCLEX-RN Cognitive + Stage 2 Australian OSCE Scripts",
        "NIMC Medication Chart & ISBAR Handover Checklists",
        "Australian SI Units & PBS Pharmacology Guide",
        "Full Access to All 779 Localized Australia Study Topics"
      ],
      ctaLabel: "Browse Full Prep Courses",
      ctaTo: "/courses"
    }
  },
  "kenya-nck": {
    partnerLine: "Aligned to Nursing Council of Kenya (NCK) KRCHN & BScN Syllabi",
    totalHours: "64 hours",
    level: "KRCHN / BScN Track",
    certificateTitle: "Kenya NCK Licensure & Clinical Readiness Certificate",
    courses: [
      {
        id: "ke-medsurg",
        title: "NCK Medical-Surgical, Critical Care & Pharmacology",
        provider: "Kenya NCK Academy",
        level: "Module 1 · 24 hrs",
        rating: "4.9",
        topicsCount: 140,
        summary: "High-yield Kenyan ward priorities: shock, DKA, hypertension, sepsis, perioperative care & KEML drug safety.",
        sampleTopicSlug: "surgical-shock"
      },
      {
        id: "ke-midwifery",
        title: "NCK Reproductive Health, Partograph & Maternal-Newborn Care",
        provider: "Kenya NCK Academy",
        level: "Module 2 · 22 hrs",
        rating: "4.9",
        topicsCount: 95,
        summary: "Antenatal screening, AMTSL, PPH, eclampsia (MgSO4 Pritchard), and newborn resuscitation.",
        sampleTopicSlug: "certificate-in-midwifery-midwifery-i-and-pharmacology-i-1-8-labour"
      },
      {
        id: "ke-community",
        title: "Community Health, KEPI Immunization & IMCI",
        provider: "Kenya NCK Academy",
        level: "Module 3 · 18 hrs",
        rating: "4.8",
        topicsCount: 80,
        summary: "Kenya immunization schedule, cold chain, IMCI danger signs, TB/HIV, and primary healthcare management.",
        sampleTopicSlug: "infection-prevention-and-control"
      }
    ],
    modules: [
      {
        number: 1,
        title: "NCK Indexing, Scope of Practice & Nursing Ethics",
        duration: "8 hours · 10 readings · 1 quiz",
        outcomes: [
          "Navigate NCK indexing, logbook sign-off, and foreign EAC nurse verification.",
          "Apply Kenyan Nurses Act ethics, informed consent, and documentation standards."
        ],
        topicSlugs: ["ethics-in-research", "communication-in-palliative-care"]
      },
      {
        number: 2,
        title: "Medical-Surgical Nursing & Clinical Pharmacology",
        duration: "22 hours · 30 readings · 2 mocks",
        outcomes: [
          "Manage DKA, severe malaria, hypertensive emergencies, and acute respiratory distress.",
          "Calculate weight-based IV fluids, pediatric dosages, and infusion drip rates."
        ],
        topicSlugs: ["dosage-calculations", "certificate-in-nursing-medical-nursing-ll-and-pharmacology-ll-diabetes-mellitus"]
      },
      {
        number: 3,
        title: "Midwifery, Obstetric Emergencies & Paediatrics",
        duration: "20 hours · 25 readings · OSCE checklists",
        outcomes: [
          "Plot partographs accurately and intervene early for obstructed labour and PPH.",
          "Execute neonatal resuscitation and IMCI danger-sign triage."
        ],
        topicSlugs: ["certificate-in-midwifery-midwifery-i-and-pharmacology-i-1-8-labour", "fluid-and-electrolyte-imbalance"]
      },
      {
        number: 4,
        title: "KEPI Immunization, Community Health & Research",
        duration: "14 hours · 18 readings · Final Mock",
        outcomes: [
          "Maintain +2°C to +8°C vaccine cold chain and community disease surveillance.",
          "Apply ward leadership and nursing research basics for NCK Paper I & II."
        ],
        topicSlugs: ["infection-prevention-and-control", "leadership-introduction"]
      }
    ],
    premiumOffer: {
      badge: "KENYA NCK EXAM BUNDLE",
      title: "Kenya NCK KRCHN & BScN Full Licensure Prep Pack",
      price: "$14.99",
      compareAt: "$39.00",
      features: [
        "Full Access to 83 Structured Courses & 779 Localized Study Topics",
        "Med-Surg, Midwifery, Community & Pharmacology Revision Guides",
        "Printable Ward & OSCE Checklists + Dosage Calculators",
        "Downloadable Referenced Study eBooks (.pdf)"
      ],
      ctaLabel: "Browse Full Prep Courses",
      ctaTo: "/courses"
    }
  },
  "uganda-unmc-uhpab": {
    partnerLine: "Aligned to Uganda Clinical Guidelines 2023, UHPAB (UNMEB) & UNMC",
    totalHours: "80 hours",
    level: "Certificate, Diploma & BScN",
    certificateTitle: "Uganda UHPAB / UNMEB & UNMC Readiness Certificate",
    courses: [
      {
        id: "ug-full-unmeb",
        title: "UHPAB (UNMEB) Certificate & Diploma Nursing Core",
        provider: "Nursing Uganda",
        level: "All Years · 40 hrs",
        rating: "4.9",
        topicsCount: 320,
        summary: "Complete Ugandan nursing & midwifery syllabi aligned with UCG 2023 and 109 past UNMEB papers.",
        sampleTopicSlug: "dosage-calculations"
      },
      {
        id: "ug-midwifery",
        title: "Uganda Midwifery, Maternal & Newborn Health",
        provider: "Nursing Uganda",
        level: "Midwifery Track · 24 hrs",
        rating: "4.9",
        topicsCount: 124,
        summary: "Partograph, PPH, pre-eclampsia, UNEPI immunization, and neonatal resuscitation protocols.",
        sampleTopicSlug: "certificate-in-midwifery-midwifery-i-and-pharmacology-i-1-8-labour"
      },
      {
        id: "ug-osce-viva",
        title: "Uganda Practicals, OSCE & Ward Procedures",
        provider: "Nursing Uganda",
        level: "Clinical Track · 16 hrs",
        rating: "4.8",
        topicsCount: 65,
        summary: "Step-by-step ward trays, aseptic technique, vital signs, and UHPAB viva preparation.",
        sampleTopicSlug: "taking-vital-signs-or-observations"
      }
    ],
    modules: [
      {
        number: 1,
        title: "Anatomy, Physiology & Foundations of Nursing",
        duration: "20 hours · 30 readings · Past Papers",
        outcomes: [
          "Master body systems, vital signs, bed-making, infection control, and patient safety.",
          "Solve UHPAB Year 1 Semester 1 & 2 theory and practical questions."
        ],
        topicSlugs: ["terms-used-in-anatomy-and-physiology", "taking-vital-signs-or-observations"]
      },
      {
        number: 2,
        title: "Pharmacology, Medical-Surgical & UCG 2023",
        duration: "28 hours · 45 readings · Drug drills",
        outcomes: [
          "Apply Uganda Clinical Guidelines 2023 for malaria, pneumonia, HIV/TB, DKA, and shock.",
          "Calculate IV drip rates and pediatric mg/kg doses with zero errors."
        ],
        topicSlugs: ["dosage-calculations", "certificate-in-nursing-medical-nursing-ll-and-pharmacology-ll-diabetes-mellitus"]
      },
      {
        number: 3,
        title: "Midwifery, Paediatrics & Community Health (UNEPI)",
        duration: "32 hours · 40 readings · OSCE Prep",
        outcomes: [
          "Manage normal and complicated labour, PPH, and neonatal sepsis.",
          "Execute UNEPI immunization schedules and IMCI child assessment."
        ],
        topicSlugs: ["certificate-in-midwifery-midwifery-i-and-pharmacology-i-1-8-labour", "infection-prevention-and-control"]
      }
    ],
    premiumOffer: {
      badge: "UGANDA UNMEB COMPLETE ACCESS",
      title: "Full Programme Study Bundle (Certificate, Diploma & BScN)",
      price: "$12.99",
      compareAt: "$29.00",
      features: [
        "All 83 Courses, 109 UNMEB/UHPAB Papers & 779 Study Topics",
        "8 Free Referenced eBooks + Printable Ward Templates",
        "Interactive Dosage Calculators & 270+ Mixed Quizzes",
        "UNMC Registration & CPD Readiness Guides"
      ],
      ctaLabel: "Explore Full Course Bundles",
      ctaTo: "/courses"
    }
  },
  "tanzania-tnmc": {
    partnerLine: "Aligned to Tanzania Nursing and Midwifery Council (TNMC) & EAC Standards",
    totalHours: "60 hours",
    level: "TNMC Licensure Track",
    certificateTitle: "Tanzania TNMC Licensure Readiness Certificate",
    courses: [
      {
        id: "tz-licensure",
        title: "TNMC National Licensing Exam Core (Med-Surg & Pharm)",
        provider: "Tanzania TNMC Academy",
        level: "Module 1 · 24 hrs",
        rating: "4.9",
        topicsCount: 120,
        summary: "Core medical-surgical, emergency resuscitation, and Tanzania Standard Treatment Guidelines pharmacology.",
        sampleTopicSlug: "surgical-shock"
      },
      {
        id: "tz-rmnch",
        title: "Tanzania Reproductive, Maternal & Child Health",
        provider: "Tanzania TNMC Academy",
        level: "Module 2 · 20 hrs",
        rating: "4.8",
        topicsCount: 90,
        summary: "Focused antenatal care, partograph, BEmONC/CEmONC emergencies, and immunization.",
        sampleTopicSlug: "certificate-in-midwifery-midwifery-i-and-pharmacology-i-1-8-labour"
      }
    ],
    modules: [
      {
        number: 1,
        title: "TNMC Registration, Ethics & EAC Mutual Recognition",
        duration: "10 hours · 12 readings",
        outcomes: [
          "Prepare NACTVET/TCU credentials and EAC home-council verification.",
          "Apply TNMC professional conduct and patient advocacy standards."
        ],
        topicSlugs: ["ethics-in-research", "communication-in-palliative-care"]
      },
      {
        number: 2,
        title: "Acute Clinical Nursing, Midwifery & Pharmacology",
        duration: "30 hours · 40 readings · Mock Quiz",
        outcomes: [
          "Manage malaria, sepsis, hypertension, diabetes, and obstetric hemorrhage.",
          "Interpret SI lab values and execute safe medication administration."
        ],
        topicSlugs: ["dosage-calculations", "certificate-in-nursing-medical-nursing-ll-and-pharmacology-ll-diabetes-mellitus"]
      }
    ],
    premiumOffer: {
      badge: "TANZANIA TNMC PREP BUNDLE",
      title: "Tanzania TNMC National Licensure Full Study Pack",
      price: "$14.99",
      compareAt: "$39.00",
      features: [
        "Complete Med-Surg, Midwifery, Community & Pharmacology Notes",
        "779 Localized Clinical Study Topics + Practice Quizzes",
        "Dosage Calculators & Printable Ward Checklists"
      ],
      ctaLabel: "Browse Full Prep Courses",
      ctaTo: "/courses"
    }
  },
  "gulf-dha-doh-scfhs": {
    partnerLine: "Aligned to UAE DHA / DOH / MOHAP & Saudi SCFHS Prometric Blueprints",
    totalHours: "66 hours",
    level: "Prometric CBT Candidate",
    certificateTitle: "UAE & Gulf Prometric Nursing Readiness Certificate",
    courses: [
      {
        id: "gulf-prometric-core",
        title: "DHA / DOH / SCFHS Prometric Clinical Nursing Mastery",
        provider: "Gulf Prometric Academy",
        level: "Module 1 · 32 hrs",
        rating: "4.9",
        topicsCount: 150,
        summary: "High-yield ICU, Med-Surg, Maternity, Pediatrics, and Infection Control MCQs for Gulf Prometric exams.",
        sampleTopicSlug: "surgical-shock"
      },
      {
        id: "gulf-dataflow",
        title: "DataFlow PSV, Sheryan/TAMM & High-Alert Pharmacology",
        provider: "Gulf Prometric Academy",
        level: "Module 2 · 18 hrs",
        rating: "4.8",
        topicsCount: 80,
        summary: "Step-by-step DataFlow PSV checklist, Good Standing rules, and IV/electrolyte safety.",
        sampleTopicSlug: "fluid-and-electrolyte-imbalance"
      }
    ],
    modules: [
      {
        number: 1,
        title: "DataFlow PSV, Good Standing & Exam Eligibility",
        duration: "8 hours · 10 readings",
        outcomes: [
          "Avoid DataFlow PSV delays on degree, UNMC license, and 2-year experience letters.",
          "Understand DHA Sheryan, DOH TAMM, and SCFHS Mumaris+ workflows."
        ],
        topicSlugs: ["ethics-in-research", "leadership-introduction"]
      },
      {
        number: 2,
        title: "Prometric Acute Care, Pharmacology & Patient Safety",
        duration: "36 hours · 45 readings · Practice Mocks",
        outcomes: [
          "Prioritize unstable cardiac, respiratory, sepsis, and endocrine patients.",
          "Convert between SI and US lab ranges seamlessly on Prometric exams."
        ],
        topicSlugs: ["dosage-calculations", "certificate-in-nursing-medical-nursing-i-and-pharmacology-i-hypertension"]
      }
    ],
    premiumOffer: {
      badge: "UAE & GULF PROMETRIC BUNDLE",
      title: "DHA, DOH, MOHAP & SCFHS Prometric Full Prep Pack",
      price: "$24.99",
      compareAt: "$59.00",
      features: [
        "Prometric-Style Med-Surg, ICU, Maternal & Pediatric Prep",
        "DataFlow PSV & Good Standing Step-by-Step Checklist",
        "779 Localized Clinical Study Topics + Lab Unit Converter"
      ],
      ctaLabel: "Browse Full Prep Courses",
      ctaTo: "/courses"
    }
  }
};
