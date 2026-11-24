/**
 * 12-Month Automated Nursing & Midwifery Study Newsletter Calendar
 * Aligned with Uganda Clinical Guidelines 2023, UNMEB/UHPAB exams & WHO protocols.
 * Rotates automatically by calendar month (1..12) across a 12-month horizon.
 */

const SITE_URL = "https://nursinguganda.com";

const MONTHLY_NEWSLETTERS = [
  {
    monthNumber: 1,
    seasonLabel: "January · Semester Kickoff",
    subject: "January Nursing Dispatch: Infection Prevention, Vital Signs & Safe Care",
    title: "Master Ward Fundamentals Before Rotations Heat Up",
    preheader: "Start the year sharp with IPC hand hygiene, normal vital thresholds & charting skills.",
    lead: "Welcome to a fresh month of clinical practice. Strong fundamentals prevent hospital-acquired infections and catch early patient deterioration faster than any complex test.",
    pearlTitle: "Clinical Pearl: Early Warning Signs",
    pearlBody: "Always interpret vital signs as a trend, not a single number — rising respiratory rate (>20–24 breaths/min) is often the earliest bedside clue to sepsis or hypoxia.",
    ctaLabel: "Open Foundations Units",
    ctaUrl: `${SITE_URL}/courses?programme=certificate-in-nursing`,
    featuredCards: [
      {
        image: `${SITE_URL}/assets/images/udemy/cover-foundations-vitals.webp`,
        title: "Foundations & Vital Signs",
        desc: "Review temperature, pulse, BP norms & aseptic handwashing checklists.",
        cta: "Study Foundations",
        url: `${SITE_URL}/courses`
      },
      {
        image: `${SITE_URL}/assets/images/udemy/cat-research.webp`,
        title: "Ward Chart Templates (.pdf)",
        desc: "Download printable TPR, fluid balance & nursing care plan templates.",
        cta: "Get Ward Charts",
        url: `${SITE_URL}/templates`
      }
    ]
  },
  {
    monthNumber: 2,
    seasonLabel: "February · Anatomy & Physiology Focus",
    subject: "February Nursing Dispatch: Structural Anatomy, Cavities & Organ Systems",
    title: "Connect Surface Landmarks to Deeper Organ Assessment",
    preheader: "High-yield anatomy landmarks, abdominal quadrants & organ physiology review.",
    lead: "Whether palpating the right iliac fossa for McBurney's tenderness or positioning chest auscultation landmarks, anatomy powers confident nursing judgement.",
    pearlTitle: "Clinical Pearl: Abdominal Exam Sequence",
    pearlBody: "Inspect -> Auscultate -> Percuss -> Palpate. Listening before palpation prevents altered bowel sounds or guarding from hiding true clinical findings.",
    ctaLabel: "Review Anatomy Units",
    ctaUrl: `${SITE_URL}/courses?category=Anatomy%20%26%20Physiology`,
    featuredCards: [
      {
        image: `${SITE_URL}/assets/images/udemy/cover-anatomy-cardio.webp`,
        title: "Anatomy & Physiology (50% Off)",
        desc: "Complete cardiovascular, respiratory & abdominal assessment notes.",
        cta: "Explore Anatomy",
        url: `${SITE_URL}/courses`
      },
      {
        image: `${SITE_URL}/assets/images/udemy/cover-foundations-vitals.webp`,
        title: "1,079-Term Medical Dictionary",
        desc: "Quickly revise anatomical suffixes, prefixes & 183 ward abbreviations.",
        cta: "Open Dictionary",
        url: `${SITE_URL}/dictionary`
      }
    ]
  },
  {
    monthNumber: 3,
    seasonLabel: "March · Pharmacology & Safe IV Calculations",
    subject: "March Nursing Dispatch: IV Drip Rates, Drug Maths & Safe Administration",
    title: "Zero-Error Drug Dosage & IV Fluid Calculation Guide",
    preheader: "Master gtt/min formulas, pediatric mg/kg checks & essential antibiotics.",
    lead: "Medication safety is tested heavily in both UNMEB written papers and OSCE bedside checks. Take 15 minutes this month to drill IV flow rate conversions.",
    pearlTitle: "Formula Check: Drops Per Minute",
    pearlBody: "Flow rate (gtt/min) = (Total Volume in mL x Drop Factor) / Time in minutes. Standard macro-drip sets use 15 or 20 gtt/mL; micro-drip chambers use 60 gtt/mL.",
    ctaLabel: "Try IV & Dosage Calculator",
    ctaUrl: `${SITE_URL}/clinical-tools`,
    featuredCards: [
      {
        image: `${SITE_URL}/assets/images/udemy/cover-pharmacology-vials.webp`,
        title: "Pharmacology Study Units",
        desc: "Mechanism, contraindications & nursing checks across MoH essential medicines.",
        cta: "Study Pharmacology",
        url: `${SITE_URL}/courses?category=Pharmacology`
      },
      {
        image: `${SITE_URL}/assets/images/udemy/cover-iv-fluids.webp`,
        title: "Free Referenced eBooks",
        desc: "Download our Pharmacology & IV Therapy study guide PDF offline.",
        cta: "Read Free eBooks",
        url: `${SITE_URL}/ebooks`
      }
    ]
  },
  {
    monthNumber: 4,
    seasonLabel: "April · Maternal Health & AMTSL",
    subject: "April Midwifery Dispatch: AMTSL, PPH Response & Pre-Eclampsia MgSO4",
    title: "High-Yield Maternal Emergencies & Midwifery Practice",
    preheader: "Revise Active Management of 3rd Stage, PPH steps & Pritchard MgSO4 checks.",
    lead: "Every nurse and midwife must act within seconds during obstetric emergencies. Review Uganda MoH maternal bundles and red-flag differentials before mid-year placements.",
    pearlTitle: "Bedside Must-Know: Before Every MgSO4 Dose",
    pearlBody: "Verify all 3 safety checks prior to maintenance Magnesium Sulfate: (1) Patellar reflexes present, (2) Respiratory rate >= 16/min, (3) Urine output >= 30 mL/hr.",
    ctaLabel: "Open Midwifery Units",
    ctaUrl: `${SITE_URL}/courses?programme=certificate-in-midwifery`,
    featuredCards: [
      {
        image: `${SITE_URL}/assets/images/udemy/cover-obstetric-pelvis.webp`,
        title: "Midwifery & Reproductive Health",
        desc: "Partograph interpretation, APH differentiation & obstetric pelvimetry.",
        cta: "Explore Midwifery",
        url: `${SITE_URL}/courses?category=Midwifery%20%26%20Maternal%20Health`
      },
      {
        image: `${SITE_URL}/assets/images/udemy/cover-antenatal-measurements.webp`,
        title: "10 Emergency Ward Checklists",
        desc: "Quick PPH, eclampsia & sepsis checklists ready for quick review.",
        cta: "View Checklists",
        url: `${SITE_URL}/clinical-tools?tab=checklists`
      }
    ]
  },
  {
    monthNumber: 5,
    seasonLabel: "May · Malaria & Acute Febrile Care",
    subject: "May Clinical Dispatch: Severe Malaria IV Artesunate & Uganda MoH Protocol",
    title: "Uganda MoH Malaria & Acute Febrile Triage Mastery",
    preheader: "Compare Artesunate 2.4 vs 3.0 mg/kg dosing, hypoglycemia checks & RDT limits.",
    lead: "Rainy season ward admissions surge with acute febrile illness. Stay sharp on first-line antimalarial dosing by patient weight and immediate danger-sign stabilization.",
    pearlTitle: "Weight Rule for IV Artesunate",
    pearlBody: "Give 3.0 mg/kg for children weighing < 20 kg and 2.4 mg/kg for adults/children >= 20 kg at 0h, 12h, and 24h — and always check blood glucose immediately.",
    ctaLabel: "Practice Tropical Medicine Quizzes",
    ctaUrl: `${SITE_URL}/quizzes`,
    featuredCards: [
      {
        image: `${SITE_URL}/assets/images/udemy/cover-tropical-malaria.webp`,
        title: "Tropical Medicine & Communicable Care",
        desc: "Malaria, typhoid, cholera dehydration & viral haemorrhagic precautions.",
        cta: "Study Tropical Units",
        url: `${SITE_URL}/courses`
      },
      {
        image: `${SITE_URL}/assets/images/udemy/cover-emergency-triage.webp`,
        title: "SI <-> US Normal Lab Ranges",
        desc: "Check Hb, glucose, electrolytes & renal panels across SI and US units.",
        cta: "Check Lab Values",
        url: `${SITE_URL}/clinical-tools?tab=values`
      }
    ]
  },
  {
    monthNumber: 6,
    seasonLabel: "June · UNMEB Mid-Year Exam Prep",
    subject: "June UNMEB Prep: Timed Section A, B & C Past Paper Strategy",
    title: "Mid-Year UNMEB & UHPAB Past Paper Revision Sprint",
    preheader: "Practice 109+ structured past papers with marking guides (now $4.99 · 50% off).",
    lead: "Reading notes alone isn't enough when facing a 3-hour UNMEB exam paper. Pair timed Objective MCQs with structured Section B & C nursing care plan essays.",
    pearlTitle: "Exam Technique Tip: Nursing Care Plans",
    pearlBody: "Link every Nursing Diagnosis directly to an observable patient goal, an actionable nursing intervention, and a clear scientific rationale for full examiner marks.",
    ctaLabel: "Open 109+ Past Papers Archive",
    ctaUrl: `${SITE_URL}/mock-exams`,
    featuredCards: [
      {
        image: `${SITE_URL}/assets/images/udemy/cat-research.webp`,
        title: "109+ UNMEB & UHPAB Past Papers",
        desc: "2019–2025 Section A, B & C papers with examiner guides — 50% off ($4.99).",
        cta: "Start Practicing",
        url: `${SITE_URL}/mock-exams`
      },
      {
        image: `${SITE_URL}/assets/images/udemy/hero-banner.webp`,
        title: "Full All-Access Pass ($34.99)",
        desc: "Unlock all 83 nursing & midwifery units plus every mock exam paper together.",
        cta: "View Catalog",
        url: `${SITE_URL}/courses`
      }
    ]
  },
  {
    monthNumber: 7,
    seasonLabel: "July · Paediatrics & Newborn Resuscitation",
    subject: "July Paediatrics Dispatch: IMCI Pneumonia Cutoff Rates & ORS Plans",
    title: "Paediatric Assessment, IMCI Thresholds & Neonatal Care",
    preheader: "Revise fast-breathing age cutoffs, ORS Plan B/C & Golden Minute newborn care.",
    lead: "Paediatric patients compensate silently until sudden collapse. Refresh age-specific respiratory thresholds, dehydration classification, and newborn warmth protocols.",
    pearlTitle: "IMCI Fast-Breathing Cutoffs",
    pearlBody: "< 2 months: >= 60/min | 2–11 months: >= 50/min | 1–5 years: >= 40/min. Chest indrawing shifts classification toward severe pneumonia.",
    ctaLabel: "Study Paediatrics Units",
    ctaUrl: `${SITE_URL}/courses?category=Paediatrics%20%26%20Child%20Health`,
    featuredCards: [
      {
        image: `${SITE_URL}/assets/images/udemy/cover-paediatrics-neonatal.webp`,
        title: "Paediatrics & Neonatal Care",
        desc: "Sickle cell crisis care, malnutrition F-75/F-100 & neonatal sepsis steps.",
        cta: "Open Paediatrics",
        url: `${SITE_URL}/courses`
      },
      {
        image: `${SITE_URL}/assets/images/udemy/cover-foundations-vitals.webp`,
        title: "Medical Instrument Atlas (146)",
        desc: "Identify paediatric airway bags, bulb syringes & sterile ward instruments.",
        cta: "Browse Instruments",
        url: `${SITE_URL}/instruments`
      }
    ]
  },
  {
    monthNumber: 8,
    seasonLabel: "August · Medical-Surgical & Theatre Nursing",
    subject: "August Med-Surg Dispatch: Sterile Technique, Shock & Pre/Post-Op Care",
    title: "Sharpen Surgical Sterile Safety & Post-Op Recovery Checks",
    preheader: "Pre-op safety checklists, instrument autoclaving & haemorrhage recognition.",
    lead: "OSCE theatre and surgical ward stations expect faultless aseptic discipline alongside systematic ABCDE airway, breathing, and circulation monitoring.",
    pearlTitle: "Post-Op Red Flag: Silent Internal Bleeding",
    pearlBody: "Tachycardia and restlessness appear BEFORE blood pressure drops in early Class I–II hypovolaemic shock — inspect dressings, drains, and capillary refill early.",
    ctaLabel: "Browse Surgical Units",
    ctaUrl: `${SITE_URL}/courses?category=Medical-Surgical%20Nursing`,
    featuredCards: [
      {
        image: `${SITE_URL}/assets/images/udemy/cover-surgical-tray.webp`,
        title: "Medical-Surgical Units (50% Off)",
        desc: "Perioperative nursing, fluid resuscitation, GI & orthopaedic care.",
        cta: "Explore Med-Surg",
        url: `${SITE_URL}/courses`
      },
      {
        image: `${SITE_URL}/assets/images/udemy/cat-medsurg.webp`,
        title: "OSCE Sterile Instrument Atlas",
        desc: "Review 146 surgical clamps, forceps & sterilization verification steps.",
        cta: "Study Instruments",
        url: `${SITE_URL}/instruments`
      }
    ]
  },
  {
    monthNumber: 9,
    seasonLabel: "September · Public Health & Immunisation",
    subject: "September Community Dispatch: UNEPI Vaccine Schedule & Cold Chain",
    title: "Public Health Clinics, Cold Chain Integrity & Primary Care",
    preheader: "Refresh UNEPI vaccine timing, VVM stage checks & community epidemiology.",
    lead: "Community health rotations test how accurately you manage immunization outreach, cold chain monitors (2°C–8°C), antenatal clinics, and disease surveillance.",
    pearlTitle: "Vaccine Vial Monitor (VVM) Rule",
    pearlBody: "Only use vials whose inner square is lighter than the outer circle (Stages 1 & 2). Discard immediately at Stage 3 or 4 when inner square matches or darkens.",
    ctaLabel: "Study Community Health",
    ctaUrl: `${SITE_URL}/courses?category=Community%20%26%20Public%20Health`,
    featuredCards: [
      {
        image: `${SITE_URL}/assets/images/udemy/cover-public-health-vaccines.webp`,
        title: "Community & Public Health Units",
        desc: "Primary Health Care, UNEPI schedules, CBHC & epidemiological metrics.",
        cta: "Explore Public Health",
        url: `${SITE_URL}/courses`
      },
      {
        image: `${SITE_URL}/assets/images/udemy/cover-research-epidemiology.webp`,
        title: "Free Topic Mixed Quizzes",
        desc: "Practice 270 free clinical questions across core nursing domains.",
        cta: "Take Free Quiz",
        url: `${SITE_URL}/quizzes`
      }
    ]
  },
  {
    monthNumber: 10,
    seasonLabel: "October · Mental Health, Ethics & Leadership",
    subject: "October Dispatch: Biopsychosocial Care, Therapeutic Skills & Ethics",
    title: "Strengthen Mental Health Triage, Ethics & Ward Leadership",
    preheader: "De-escalation principles, informed consent, delegation rights & PICO basics.",
    lead: "Mental health and medico-legal questions are frequent differentiators in Diploma and BScN examinations. Master the 5 Rights of Delegation and ethical decision frameworks.",
    pearlTitle: "Delegation Gold Rule (5 Rights)",
    pearlBody: "Assessment, IV push medications, clinical judgement, and patient education remain the nurse's direct responsibility — never delegate initial assessments.",
    ctaLabel: "Review Mental Health & Leadership",
    ctaUrl: `${SITE_URL}/courses?category=Mental%20Health%20%26%20Psychiatric%20Nursing`,
    featuredCards: [
      {
        image: `${SITE_URL}/assets/images/udemy/cover-neuro-mental-health.webp`,
        title: "Mental Health & Psychopathology",
        desc: "Therapeutic communication, suicide risk triage & psychotropic monitoring.",
        cta: "Study Mental Health",
        url: `${SITE_URL}/courses`
      },
      {
        image: `${SITE_URL}/assets/images/udemy/cover-research-epidemiology.webp`,
        title: "Leadership & Nursing Research",
        desc: "PICO clinical questions, PDSA quality improvement & medico-legal ethics.",
        cta: "Explore Research",
        url: `${SITE_URL}/courses`
      }
    ]
  },
  {
    monthNumber: 11,
    seasonLabel: "November · End-of-Year Exam Intensive",
    subject: "November Exam Countdown: 50% Student Cut + Full 109-Paper Revision",
    title: "Lock In High Scores Before Final UNMEB & Semester Papers",
    preheader: "Every paid unit is 50% off + Full All-Access unlocked across all 83 courses.",
    lead: "It's final revision month! Combine short daily 30-question topic quizzes with past paper essay drills so nothing catches you off guard in the exam hall.",
    pearlTitle: "7-Day Final Sprint Method",
    pearlBody: "Spend 60% of revision time actively recalling answers from timed mock exams and 40% reviewing weak topics inside your study notes.",
    ctaLabel: "Open Mock Exams & All-Access",
    ctaUrl: `${SITE_URL}/mock-exams`,
    featuredCards: [
      {
        image: `${SITE_URL}/assets/images/udemy/hero-banner.webp`,
        title: "All 83 Courses (From $2.49 · 50% Off)",
        desc: "Unlock weak subjects individually or grab Full All-Access ($34.99).",
        cta: "Upgrade Revision",
        url: `${SITE_URL}/courses`
      },
      {
        image: `${SITE_URL}/assets/images/udemy/cat-research.webp`,
        title: "109 UNMEB Past Papers Archive",
        desc: "Practice real Section A, B & C papers with examiner guides.",
        cta: "Open Papers",
        url: `${SITE_URL}/mock-exams`
      }
    ]
  },
  {
    monthNumber: 12,
    seasonLabel: "December · Year-End Wrap & Global Licensure",
    subject: "December Dispatch: Holiday Review, QR Certificates & Global Nursing",
    title: "Reflect, Earn Your Study Certificates & Plan Global Pathways",
    preheader: "Review global NMC CBT/OSCE, NCLEX-RN pathways & earn study certificates.",
    lead: "Finish the year strong by completing remaining course quizzes to generate QR-verified PDF certificates — or explore international nursing registration guides for UK, USA, Canada & Australia.",
    pearlTitle: "Year-End Study Habit",
    pearlBody: "Keep skills fresh over holiday breaks with 2 short topic reviews a week — consistency beats last-minute cramming every single year.",
    ctaLabel: "Explore Global Nursing Pathways",
    ctaUrl: `${SITE_URL}/global-nursing`,
    featuredCards: [
      {
        image: `${SITE_URL}/assets/images/udemy/cover-research-epidemiology.webp`,
        title: "8 Global Nursing Pathways",
        desc: "Step-by-step licensure requirements for UK NMC, US NCLEX-RN & CGFNS.",
        cta: "View Pathways",
        url: `${SITE_URL}/global-nursing`
      },
      {
        image: `${SITE_URL}/assets/images/udemy/hero-banner.webp`,
        title: "My Learning & Certificates",
        desc: "Complete your unit evaluation (>= 60%) to download QR certificates.",
        cta: "Open Dashboard",
        url: `${SITE_URL}/my-learning`
      }
    ]
  }
];

function getMonthlyNewsletterForDate(dateObj = new Date(), customMonth = null) {
  const m = customMonth ? Number(customMonth) : dateObj.getUTCMonth() + 1;
  const monthIdx = ((m - 1) % 12 + 12) % 12;
  const year = dateObj.getUTCFullYear();
  const ym = `${year}-${String(m).padStart(2, "0")}`;
  return {
    yearMonth: ym,
    ...MONTHLY_NEWSLETTERS[monthIdx]
  };
}

function getTwelveMonthSchedule(startDate = new Date()) {
  const items = [];
  const baseYear = startDate.getUTCFullYear();
  const baseMonth = startDate.getUTCMonth(); // 0..11
  for (let i = 0; i < 12; i++) {
    const d = new Date(Date.UTC(baseYear, baseMonth + i, 1));
    items.push(getMonthlyNewsletterForDate(d));
  }
  return items;
}

module.exports = {
  MONTHLY_NEWSLETTERS,
  getMonthlyNewsletterForDate,
  getTwelveMonthSchedule
};
