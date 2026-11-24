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
  }
};

export const SLUG_TO_COUNTRY_KEY = {
  "united-kingdom-nmc": "uk",
  "united-states-nclex": "usa",
  "canada-nnas-nclex": "canada",
  "australia-ahpra-nmba": "australia"
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
        sampleTopicSlug: "dosage-calculations-and-iv-infusion-rates"
      },
      {
        id: "uk-cbt-clinical",
        title: "NMC CBT Part B: Future Nurse Theory & NMC Code",
        provider: "UK NMC Academy",
        level: "Module 2 · 24 hrs",
        rating: "4.9",
        topicsCount: 120,
        summary: "100-question blueprint covering Safeguarding, Mental Capacity Act, NICE Sepsis, infection control, and BNF pharmacology.",
        sampleTopicSlug: "infection-prevention-and-control-standard-precautions"
      },
      {
        id: "uk-osce-apie",
        title: "10-Station UK OSCE: APIE, NEWS2 & ANTT Skills",
        provider: "UK NMC Academy",
        level: "Module 3 · 32 hrs",
        rating: "4.8",
        topicsCount: 64,
        summary: "Step-by-step APIE care planning, NEWS2 escalation, ANTT wound/catheter care, and structured SBAR communication.",
        sampleTopicSlug: "vital-signs-assessment-and-monitoring"
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
        topicSlugs: ["nursing-ethics-and-legal-issues", "therapeutic-communication-in-nursing"]
      },
      {
        number: 2,
        title: "CBT Part A: High-Precision UK Clinical Numeracy",
        duration: "12 hours · 18 drills · 3 timed mocks",
        outcomes: [
          "Solve 15-question Part A numeracy sets within 30 minutes with exact decimal rules.",
          "Convert microgram/milligram/gram and mL/hr infusion pumps without rounding mistakes."
        ],
        topicSlugs: ["dosage-calculations-and-iv-infusion-rates", "fluid-and-electrolyte-balance"]
      },
      {
        number: 3,
        title: "APIE Nursing Process & NEWS2 Escalation",
        duration: "18 hours · 22 readings · OSCE checklists",
        outcomes: [
          "Complete Assessment, Planning, Implementation, and Evaluation stations within UK OSCE time limits.",
          "Calculate NEWS2 scores and escalate deteriorating patients using SBAR."
        ],
        topicSlugs: ["vital-signs-assessment-and-monitoring", "shock-and-hemodynamic-monitoring"]
      },
      {
        number: 4,
        title: "UK BNF Pharmacology, ANTT & Infection Control",
        duration: "16 hours · 30 readings · 2 quizzes",
        outcomes: [
          "Master UK drug naming (Paracetamol, Adrenaline, Salbutamol, Furosemide) and high-alert IV safety.",
          "Execute Aseptic Non-Touch Technique (ANTT) for cannulation, catheterization, and wound dressings."
        ],
        topicSlugs: ["infection-prevention-and-control-standard-precautions", "administration-of-medications-and-rights"]
      },
      {
        number: 5,
        title: "NICE Acute Care: Sepsis, Diabetes, Cardiac & Respiratory",
        duration: "14 hours · 25 readings · Full CBT Mock",
        outcomes: [
          "Apply NICE Sepsis Six bundle within 1 hour of red-flag recognition.",
          "Interpret UK SI blood glucose (<4.0 mmol/L hypoglycemia), ABGs, and heart failure management."
        ],
        topicSlugs: ["diabetes-mellitus-and-ketoacidosis", "hypertension-and-cardiovascular-care"]
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
        sampleTopicSlug: "nursing-process-and-clinical-judgment"
      },
      {
        id: "us-pharm-labs",
        title: "US Pharmacology & Conventional Lab Values (mg/dL, mEq/L)",
        provider: "USA NCLEX Academy",
        level: "Module 2 · 28 hrs",
        rating: "4.9",
        topicsCount: 160,
        summary: "High-alert US generic names (Acetaminophen, Epinephrine, Albuterol), therapeutic drug ranges, and conventional lab drills.",
        sampleTopicSlug: "administration-of-medications-and-rights"
      },
      {
        id: "us-delegation-priority",
        title: "NCLEX Prioritization, Delegation (RN/LPN/UAP) & Safety",
        provider: "USA NCLEX Academy",
        level: "Module 3 · 34 hrs",
        rating: "4.8",
        topicsCount: 110,
        summary: "Master ABCs, Maslow, acute-vs-chronic triage, airborne/droplet/contact isolation, and State Board scope of practice.",
        sampleTopicSlug: "disaster-triage-and-emergency-management"
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
        topicSlugs: ["nursing-ethics-and-legal-issues", "nursing-process-and-clinical-judgment"]
      },
      {
        number: 2,
        title: "NCSBN 6-Step CJMM & Unfolding Case Studies",
        duration: "18 hours · 24 case drills · Matrix & Bow-Tie items",
        outcomes: [
          "Solve NGN unfolding 6-item case studies (Extended Multiple Response, Highlight, Drag-and-Drop).",
          "Avoid common distractors in acute medical-surgical deterioration."
        ],
        topicSlugs: ["shock-and-hemodynamic-monitoring", "fluid-and-electrolyte-balance"]
      },
      {
        number: 3,
        title: "Management of Care: Delegation, Legal & Isolation",
        duration: "16 hours · 20 readings · 2 quizzes",
        outcomes: [
          "Delegate safely between RN, LPN/LVN, and UAP/CNA using US scope-of-practice rules.",
          "Apply HIPAA, informed consent, advance directives, and CDC transmission precautions."
        ],
        topicSlugs: ["infection-prevention-and-control-standard-precautions", "leadership-and-management-in-nursing"]
      },
      {
        number: 4,
        title: "US Pharmacology & Conventional Lab Mastery",
        duration: "22 hours · 45 drug classes · Lab flashcards",
        outcomes: [
          "Convert seamlessly from SI units to US conventional units (glucose 70–99 mg/dL, creatinine 0.7–1.2 mg/dL).",
          "Monitor digoxin, lithium, warfarin (INR), heparin (aPTT), and vancomycin troughs."
        ],
        topicSlugs: ["administration-of-medications-and-rights", "diabetes-mellitus-and-ketoacidosis"]
      },
      {
        number: 5,
        title: "Maternal-Newborn, Pediatrics & Mental Health NCLEX Review",
        duration: "18 hours · 30 readings · 150-Q Mock Exam",
        outcomes: [
          "Interpret fetal heart rate decelerations (VEAL CHOP), postpartum hemorrhage, and pediatric milestones.",
          "Apply therapeutic communication and suicide/lithium/MAOI precautions."
        ],
        topicSlugs: ["normal-labour-and-delivery", "therapeutic-communication-in-nursing"]
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
        sampleTopicSlug: "nursing-ethics-and-legal-issues"
      },
      {
        id: "ca-nclex-rexpn",
        title: "Canadian NCLEX-RN & REx-PN Clinical Decision Mastery",
        provider: "Canada Nursing Academy",
        level: "Module 2 · 36 hrs",
        rating: "4.9",
        topicsCount: 150,
        summary: "Dual-track prep for RN (NCLEX-RN) and RPN/LPN (REx-PN 90–150 items) using Canadian SI laboratory standards.",
        sampleTopicSlug: "fluid-and-electrolyte-balance"
      },
      {
        id: "ca-safety-culture",
        title: "Canadian Healthcare Ethics, Cultural Safety & Medication Safety",
        provider: "Canada Nursing Academy",
        level: "Module 3 · 22 hrs",
        rating: "4.8",
        topicsCount: 75,
        summary: "Trauma-informed care, Indigenous cultural safety, interprofessional SBAR, and Health Canada drug standards.",
        sampleTopicSlug: "therapeutic-communication-in-nursing"
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
        topicSlugs: ["nursing-ethics-and-legal-issues", "leadership-and-management-in-nursing"]
      },
      {
        number: 2,
        title: "Canadian SI Lab Values & Medication Calculations",
        duration: "16 hours · 22 drills · SI flashcards",
        outcomes: [
          "Interpret Canadian SI labs (mmol/L, µmol/L, g/L) alongside Health Canada drug naming.",
          "Calculate pediatric mg/kg, insulin titrations, and IV pump rates accurately."
        ],
        topicSlugs: ["dosage-calculations-and-iv-infusion-rates", "diabetes-mellitus-and-ketoacidosis"]
      },
      {
        number: 3,
        title: "REx-PN & NCLEX-RN Acute Medical-Surgical Care",
        duration: "24 hours · 40 readings · 2 mocks",
        outcomes: [
          "Differentiate stable/predictable RPN care from unstable/complex RN escalation.",
          "Manage sepsis, stroke, ACS, COPD, and acute kidney injury."
        ],
        topicSlugs: ["shock-and-hemodynamic-monitoring", "hypertension-and-cardiovascular-care"]
      },
      {
        number: 4,
        title: "Cultural Safety, Mental Health & Maternal-Child Nursing",
        duration: "20 hours · 30 readings · Final Assessment",
        outcomes: [
          "Integrate cultural humility and trauma-informed communication across diverse Canadian populations.",
          "Review perinatal complications, neonatal resuscitation, and psychiatric emergencies."
        ],
        topicSlugs: ["normal-labour-and-delivery", "therapeutic-communication-in-nursing"]
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
        sampleTopicSlug: "nursing-process-and-clinical-judgment"
      },
      {
        id: "au-oba-stage2-osce",
        title: "Ahpra OBA Stage 2: 10-Station Australian OSCE Mastery",
        provider: "Australia NMBA Academy",
        level: "Module 2 · 26 hrs",
        rating: "4.9",
        topicsCount: 68,
        summary: "Behavioral stations, 3-identifier checks, 5 Moments of Hand Hygiene, NSQHS safety, and PBS medication charts.",
        sampleTopicSlug: "vital-signs-assessment-and-monitoring"
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
        sampleTopicSlug: "administration-of-medications-and-rights"
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
        topicSlugs: ["nursing-ethics-and-legal-issues", "leadership-and-management-in-nursing"]
      },
      {
        number: 2,
        title: "OBA Stage 1: NCLEX-RN Cognitive & Clinical Judgment",
        duration: "26 hours · 35 readings · 2 mocks",
        outcomes: [
          "Pass Stage 1 NCLEX-RN via Pearson VUE while keeping Australian SI units clear.",
          "Prioritize acute deterioration, fluid/electrolyte crises, and maternal-pediatric safety."
        ],
        topicSlugs: ["fluid-and-electrolyte-balance", "shock-and-hemodynamic-monitoring"]
      },
      {
        number: 3,
        title: "OBA Stage 2: Australian OSCE Stations & NSQHS Safety",
        duration: "22 hours · 10 station scripts · Checklists",
        outcomes: [
          "Verbalize 3 patient identifiers, allergies, and 5 Moments of Hand Hygiene in every OSCE station.",
          "Execute Australian National Inpatient Medication Chart (NIMC) checks and ISBAR handover."
        ],
        topicSlugs: ["vital-signs-assessment-and-monitoring", "infection-prevention-and-control-standard-precautions"]
      },
      {
        number: 4,
        title: "Australian Approved Drug Names & Acute Care Protocols",
        duration: "12 hours · 20 readings · Final Mock",
        outcomes: [
          "Use Australian PBS naming (Paracetamol, Adrenaline, Frusemide/Furosemide, Lignocaine) fluently.",
          "Manage sepsis, anaphylaxis, diabetic ketoacidosis, and mental health de-escalation."
        ],
        topicSlugs: ["administration-of-medications-and-rights", "diabetes-mellitus-and-ketoacidosis"]
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
  }
};
