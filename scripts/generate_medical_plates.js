/**
 * Generates crisp 960x720 WebP medical diagram plates from pure vector SVG
 * for clinical domains without raster plates (Pharmacology, Endocrine, Hematology,
 * Integumentary/Wound, Eye/Ear, Nursing Assessment, Emergency/CPR, Mental Health, Leadership/Ethics).
 */
const fs = require("node:fs");
const path = require("node:path");
const sharp = require("sharp");

const OUT_DIR = path.join(process.cwd(), "assets", "images", "medical-illustrations");
fs.mkdirSync(OUT_DIR, { recursive: true });

function sanitizeXmlAmp(str) {
  return String(str || "").replace(/&(?!amp;|lt;|gt;|quot;|apos;|#\d+;|#x[a-fA-F0-9]+;)/g, "&amp;");
}

function wrapPlate({ title, subtitle, badge, bodySvg }) {
  const safeTitle = sanitizeXmlAmp(title);
  const safeSubtitle = sanitizeXmlAmp(subtitle);
  const safeBadge = sanitizeXmlAmp(badge);
  const safeBody = sanitizeXmlAmp(bodySvg);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="720" viewBox="0 0 960 720">
    <defs>
      <linearGradient id="nuHead" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#1C1D1F"/>
        <stop offset="100%" stop-color="#2D2F31"/>
      </linearGradient>
      <linearGradient id="nuPurp" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#A137F2"/>
        <stop offset="100%" stop-color="#7E22CE"/>
      </linearGradient>
      <linearGradient id="nuTeal" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#0D9488"/>
        <stop offset="100%" stop-color="#065F46"/>
      </linearGradient>
      <filter id="cardShadow" x="-5%" y="-5%" width="110%" height="115%">
        <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#1C1D1F" flood-opacity="0.08"/>
      </filter>
    </defs>
    <rect width="960" height="720" fill="#FFFFFF"/>
    <rect x="20" y="20" width="920" height="680" rx="18" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="2"/>
    <rect x="20" y="20" width="920" height="96" rx="18" fill="url(#nuHead)"/>
    <rect x="20" y="96" width="920" height="20" fill="url(#nuHead)"/>
    <rect x="44" y="42" width="190" height="24" rx="12" fill="#ECEB98"/>
    <text x="139" y="58" text-anchor="middle" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#3D3C0A">${safeBadge}</text>
    <text x="44" y="94" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="#FFFFFF">${safeTitle}</text>
    <text x="916" y="92" text-anchor="end" font-family="Arial, sans-serif" font-size="13" fill="#CBD5E1">${safeSubtitle}</text>
    ${safeBody}
    <text x="480" y="684" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="#64748B">Nursing Uganda Visual Reference · Aligned with UNMEB &amp; Uganda MoH Clinical Guidelines</text>
  </svg>`;
}

const PLATES = [
  {
    file: "pharmacology-adme.webp",
    svg: wrapPlate({
      badge: "PHARMACOKINETICS",
      title: "ADME Drug Pathway & 10 Rights Safety",
      subtitle: "Absorption · Distribution · Metabolism · Excretion",
      bodySvg: `
        <g filter="url(#cardShadow)">
          <rect x="48" y="150" width="195" height="240" rx="14" fill="#FFFFFF" stroke="#D8B4FE" stroke-width="2"/>
          <circle cx="145" cy="198" r="28" fill="#F3E8FF"/>
          <text x="145" y="206" text-anchor="middle" font-family="Arial" font-size="22" font-weight="bold" fill="#A137F2">A</text>
          <text x="145" y="252" text-anchor="middle" font-family="Arial" font-size="17" font-weight="bold" fill="#1C1D1F">1. Absorption</text>
          <text x="145" y="278" text-anchor="middle" font-family="Arial" font-size="13" fill="#475569">Oral (GI tract), IM, SC,</text>
          <text x="145" y="298" text-anchor="middle" font-family="Arial" font-size="13" fill="#475569">or 100% Bioavailable IV</text>
          <rect x="74" y="324" width="142" height="40" rx="8" fill="#F7EDFF"/>
          <text x="145" y="349" text-anchor="middle" font-family="Arial" font-size="12" font-weight="bold" fill="#7E22CE">First-Pass Effect (PO)</text>

          <rect x="271" y="150" width="195" height="240" rx="14" fill="#FFFFFF" stroke="#99F6E4" stroke-width="2"/>
          <circle cx="368" cy="198" r="28" fill="#CCFBF1"/>
          <text x="368" y="206" text-anchor="middle" font-family="Arial" font-size="22" font-weight="bold" fill="#0D9488">D</text>
          <text x="368" y="252" text-anchor="middle" font-family="Arial" font-size="17" font-weight="bold" fill="#1C1D1F">2. Distribution</text>
          <text x="368" y="278" text-anchor="middle" font-family="Arial" font-size="13" fill="#475569">Bloodstream transport</text>
          <text x="368" y="298" text-anchor="middle" font-family="Arial" font-size="13" fill="#475569">Albumin binding &amp; Vd</text>
          <rect x="297" y="324" width="142" height="40" rx="8" fill="#ECFEFF"/>
          <text x="368" y="349" text-anchor="middle" font-family="Arial" font-size="12" font-weight="bold" fill="#0F766E">Free Drug = Active</text>

          <rect x="494" y="150" width="195" height="240" rx="14" fill="#FFFFFF" stroke="#FDE68A" stroke-width="2"/>
          <circle cx="591" cy="198" r="28" fill="#FEF3C7"/>
          <text x="591" y="206" text-anchor="middle" font-family="Arial" font-size="22" font-weight="bold" fill="#B45309">M</text>
          <text x="591" y="252" text-anchor="middle" font-family="Arial" font-size="17" font-weight="bold" fill="#1C1D1F">3. Metabolism</text>
          <text x="591" y="278" text-anchor="middle" font-family="Arial" font-size="13" fill="#475569">Hepatic CYP450 Phase I</text>
          <text x="591" y="298" text-anchor="middle" font-family="Arial" font-size="13" fill="#475569">&amp; Phase II conjugation</text>
          <rect x="520" y="324" width="142" height="40" rx="8" fill="#FFFBEB"/>
          <text x="591" y="349" text-anchor="middle" font-family="Arial" font-size="12" font-weight="bold" fill="#B45309">Water-Soluble Forms</text>

          <rect x="717" y="150" width="195" height="240" rx="14" fill="#FFFFFF" stroke="#BFDBFE" stroke-width="2"/>
          <circle cx="814" cy="198" r="28" fill="#DBEAFE"/>
          <text x="814" y="206" text-anchor="middle" font-family="Arial" font-size="22" font-weight="bold" fill="#1D4ED8">E</text>
          <text x="814" y="252" text-anchor="middle" font-family="Arial" font-size="17" font-weight="bold" fill="#1C1D1F">4. Excretion</text>
          <text x="814" y="278" text-anchor="middle" font-family="Arial" font-size="13" fill="#475569">Renal GFR &amp; tubular</text>
          <text x="814" y="298" text-anchor="middle" font-family="Arial" font-size="13" fill="#475569">secretion, bile &amp; lungs</text>
          <rect x="743" y="324" width="142" height="40" rx="8" fill="#EFF6FF"/>
          <text x="814" y="349" text-anchor="middle" font-family="Arial" font-size="12" font-weight="bold" fill="#1D4ED8">Half-Life (t1/2) Control</text>
        </g>
        <path d="M245 270 H267 M468 270 H490 M691 270 H713" stroke="#A137F2" stroke-width="4" stroke-linecap="round"/>

        <!-- Bottom Safety Card -->
        <rect x="48" y="424" width="864" height="222" rx="14" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2"/>
        <text x="72" y="460" font-family="Arial" font-size="17" font-weight="bold" fill="#1C1D1F">Nursing Clinical Formula &amp; Medication Administration Checkpoints</text>
        <rect x="72" y="482" width="400" height="72" rx="10" fill="#F7EDFF" stroke="#D8B4FE"/>
        <text x="90" y="508" font-family="Arial" font-size="14" font-weight="bold" fill="#7E22CE">IV Drip Rate (drops/min)</text>
        <text x="90" y="534" font-family="Arial" font-size="15" font-weight="bold" fill="#1C1D1F">= (Volume in mL × Drop Factor) ÷ Time in Minutes</text>

        <rect x="492" y="482" width="396" height="72" rx="10" fill="#ECFDF5" stroke="#A7F3D0"/>
        <text x="510" y="508" font-family="Arial" font-size="14" font-weight="bold" fill="#065F46">Tablet / Syringe Dose Calculation</text>
        <text x="510" y="534" font-family="Arial" font-size="15" font-weight="bold" fill="#1C1D1F">= (Desired Dose ÷ Stock Strength) × Volume</text>

        <text x="72" y="592" font-family="Arial" font-size="13" font-weight="bold" fill="#334155">10 Rights: Patient · Drug · Dose · Route · Time · Documentation · Education · Assessment · Evaluation · Right to Refuse</text>
        <text x="72" y="618" font-family="Arial" font-size="13" fill="#64748B">Always verify allergies, renal/hepatic function, and pregnancy category before administration.</text>
      `
    })
  },
  {
    file: "endocrine-glands.webp",
    svg: wrapPlate({
      badge: "ENDOCRINE SYSTEM",
      title: "Hypothalamic–Pituitary–Target Organ Axis",
      subtitle: "Hormone Regulation & Negative Feedback Loop",
      bodySvg: `
        <g filter="url(#cardShadow)">
          <rect x="330" y="140" width="300" height="76" rx="14" fill="url(#nuPurp)"/>
          <text x="480" y="172" text-anchor="middle" font-family="Arial" font-size="18" font-weight="bold" fill="#FFFFFF">Hypothalamus (Master Link)</text>
          <text x="480" y="196" text-anchor="middle" font-family="Arial" font-size="13" fill="#F3E8FF">TRH · CRH · GnRH · GHRH · Dopamine</text>

          <rect x="330" y="254" width="300" height="82" rx="14" fill="#1C1D1F"/>
          <text x="480" y="286" text-anchor="middle" font-family="Arial" font-size="18" font-weight="bold" fill="#FFFFFF">Pituitary Gland (Anterior &amp; Posterior)</text>
          <text x="480" y="312" text-anchor="middle" font-family="Arial" font-size="12" fill="#ECEB98">TSH · ACTH · FSH/LH · GH · Prolactin | ADH · Oxytocin</text>

          <rect x="48" y="388" width="205" height="190" rx="14" fill="#FFFFFF" stroke="#D8B4FE" stroke-width="2"/>
          <text x="150" y="422" text-anchor="middle" font-family="Arial" font-size="16" font-weight="bold" fill="#7E22CE">Thyroid &amp; Parathyroid</text>
          <text x="150" y="454" text-anchor="middle" font-family="Arial" font-size="13" fill="#334155">T3 &amp; T4: Metabolic Rate</text>
          <text x="150" y="478" text-anchor="middle" font-family="Arial" font-size="13" fill="#334155">Calcitonin: Lowers Ca2+</text>
          <text x="150" y="502" text-anchor="middle" font-family="Arial" font-size="13" fill="#334155">PTH: Raises Serum Ca2+</text>
          <rect x="70" y="528" width="160" height="32" rx="6" fill="#F7EDFF"/>
          <text x="150" y="549" text-anchor="middle" font-family="Arial" font-size="12" font-weight="bold" fill="#7E22CE">Goitre / Hypothyroid</text>

          <rect x="270" y="388" width="205" height="190" rx="14" fill="#FFFFFF" stroke="#FDE68A" stroke-width="2"/>
          <text x="372" y="422" text-anchor="middle" font-family="Arial" font-size="16" font-weight="bold" fill="#B45309">Adrenal Glands</text>
          <text x="372" y="454" text-anchor="middle" font-family="Arial" font-size="13" fill="#334155">Cortisol: Stress &amp; Glucose</text>
          <text x="372" y="478" text-anchor="middle" font-family="Arial" font-size="13" fill="#334155">Aldosterone: Na+ / BP</text>
          <text x="372" y="502" text-anchor="middle" font-family="Arial" font-size="13" fill="#334155">Adrenaline: Fight / Flight</text>
          <rect x="292" y="528" width="160" height="32" rx="6" fill="#FFFBEB"/>
          <text x="372" y="549" text-anchor="middle" font-family="Arial" font-size="12" font-weight="bold" fill="#B45309">Cushing's vs Addison's</text>

          <rect x="492" y="388" width="205" height="190" rx="14" fill="#FFFFFF" stroke="#99F6E4" stroke-width="2"/>
          <text x="594" y="422" text-anchor="middle" font-family="Arial" font-size="16" font-weight="bold" fill="#065F46">Endocrine Pancreas</text>
          <text x="594" y="454" text-anchor="middle" font-family="Arial" font-size="13" fill="#334155">Beta Cells: Insulin (↓ BG)</text>
          <text x="594" y="478" text-anchor="middle" font-family="Arial" font-size="13" fill="#334155">Alpha Cells: Glucagon (↑ BG)</text>
          <text x="594" y="502" text-anchor="middle" font-family="Arial" font-size="13" fill="#334155">Normal FBG: 3.9–5.5 mmol/L</text>
          <rect x="514" y="528" width="160" height="32" rx="6" fill="#ECFDF5"/>
          <text x="594" y="549" text-anchor="middle" font-family="Arial" font-size="12" font-weight="bold" fill="#065F46">Diabetes / DKA Care</text>

          <rect x="714" y="388" width="198" height="190" rx="14" fill="#FFFFFF" stroke="#FBCFE8" stroke-width="2"/>
          <text x="813" y="422" text-anchor="middle" font-family="Arial" font-size="16" font-weight="bold" fill="#BE185D">Gonads</text>
          <text x="813" y="454" text-anchor="middle" font-family="Arial" font-size="13" fill="#334155">Ovaries: Estrogen &amp;</text>
          <text x="813" y="474" text-anchor="middle" font-family="Arial" font-size="13" fill="#334155">Progesterone (Cycle)</text>
          <text x="813" y="502" text-anchor="middle" font-family="Arial" font-size="13" fill="#334155">Testes: Testosterone</text>
          <rect x="733" y="528" width="160" height="32" rx="6" fill="#FDF2F8"/>
          <text x="813" y="549" text-anchor="middle" font-family="Arial" font-size="12" font-weight="bold" fill="#BE185D">LH Surge = Ovulation</text>
        </g>
        <path d="M480 216 V250 M480 336 V362 M150 362 H813 M150 362 V384 M372 362 V384 M594 362 V384 M813 362 V384" stroke="#A137F2" stroke-width="3" fill="none"/>
        <rect x="48" y="600" width="864" height="50" rx="10" fill="#EFF6FF" stroke="#BFDBFE"/>
        <text x="480" y="630" text-anchor="middle" font-family="Arial" font-size="14" font-weight="bold" fill="#1E40AF">Negative Feedback Principle: Rising target hormone inhibits Hypothalamus &amp; Pituitary release to maintain homeostasis.</text>
      `
    })
  },
  {
    file: "blood-immune-lymphatic.webp",
    svg: wrapPlate({
      badge: "HEMATOLOGY & IMMUNITY",
      title: "Blood Components, WBC Differential & Lymphatic Defense",
      subtitle: "Plasma 55% · Formed Elements 45% · Innate vs Adaptive Immunity",
      bodySvg: `
        <g filter="url(#cardShadow)">
          <rect x="48" y="145" width="270" height="230" rx="14" fill="#FFFFFF" stroke="#FECACA" stroke-width="2"/>
          <circle cx="110" cy="205" r="28" fill="#EF4444"/>
          <circle cx="110" cy="205" r="14" fill="#FCA5A5"/>
          <text x="152" y="198" font-family="Arial" font-size="17" font-weight="bold" fill="#991B1B">Erythrocytes (RBC)</text>
          <text x="152" y="220" font-family="Arial" font-size="13" fill="#475569">O2 / CO2 via Hemoglobin</text>
          <text x="70" y="264" font-family="Arial" font-size="13" fill="#334155">• Lifespan: 120 days (Spleen cleared)</text>
          <text x="70" y="288" font-family="Arial" font-size="13" fill="#334155">• Adult Hb: Male 13–17 | Female 12–15 g/dL</text>
          <text x="70" y="312" font-family="Arial" font-size="13" fill="#334155">• Anemia: Fatigue, pallor, tachycardia</text>
          <rect x="70" y="330" width="226" height="28" rx="6" fill="#FEF2F2"/>
          <text x="183" y="349" text-anchor="middle" font-family="Arial" font-size="12" font-weight="bold" fill="#B91C1C">Sickle Cell Trait High-Yield in Uganda</text>

          <rect x="345" y="145" width="270" height="230" rx="14" fill="#FFFFFF" stroke="#D8B4FE" stroke-width="2"/>
          <circle cx="405" cy="205" r="28" fill="#A137F2"/>
          <circle cx="397" cy="200" r="7" fill="#FFFFFF"/>
          <circle cx="414" cy="206" r="8" fill="#FFFFFF"/>
          <circle cx="402" cy="215" r="6" fill="#FFFFFF"/>
          <text x="448" y="198" font-family="Arial" font-size="17" font-weight="bold" fill="#7E22CE">Leukocytes (WBC)</text>
          <text x="448" y="220" font-family="Arial" font-size="13" fill="#475569">Normal: 4,000–11,000 /µL</text>
          <text x="368" y="264" font-family="Arial" font-size="13" fill="#334155">• Neutrophils (60%): Acute bacteria</text>
          <text x="368" y="288" font-family="Arial" font-size="13" fill="#334155">• Lymphocytes (30%): Viral / B &amp; T cells</text>
          <text x="368" y="312" font-family="Arial" font-size="13" fill="#334155">• Monocytes/Macrophages &amp; Eosinophils</text>
          <rect x="368" y="330" width="224" height="28" rx="6" fill="#F7EDFF"/>
          <text x="480" y="349" text-anchor="middle" font-family="Arial" font-size="12" font-weight="bold" fill="#7E22CE">CD4 Count Monitors HIV Immunity</text>

          <rect x="642" y="145" width="270" height="230" rx="14" fill="#FFFFFF" stroke="#FDE68A" stroke-width="2"/>
          <polygon points="702,178 726,204 712,230 684,218 686,188" fill="#F59E0B"/>
          <text x="745" y="198" font-family="Arial" font-size="17" font-weight="bold" fill="#B45309">Platelets &amp; Plasma</text>
          <text x="745" y="220" font-family="Arial" font-size="13" fill="#475569">150,000–400,000 /µL</text>
          <text x="664" y="264" font-family="Arial" font-size="13" fill="#334155">• Primary hemostasis plug + Fibrin mesh</text>
          <text x="664" y="288" font-family="Arial" font-size="13" fill="#334155">• Plasma: Water, Albumin, Clotting factors</text>
          <text x="664" y="312" font-family="Arial" font-size="13" fill="#334155">• ABO &amp; Rh Blood Group Compatibility</text>
          <rect x="664" y="330" width="226" height="28" rx="6" fill="#FFFBEB"/>
          <text x="777" y="349" text-anchor="middle" font-family="Arial" font-size="12" font-weight="bold" fill="#B45309">O-neg Universal RBC · AB Universal Plasma</text>
        </g>

        <rect x="48" y="405" width="864" height="240" rx="14" fill="#FFFFFF" stroke="#A7F3D0" stroke-width="2"/>
        <text x="72" y="440" font-family="Arial" font-size="17" font-weight="bold" fill="#065F46">Antibody Classes (GAMED) &amp; Vaccination Immunity Summary</text>
        <text x="72" y="476" font-family="Arial" font-size="14" fill="#1C1D1F"><tspan font-weight="bold">• IgG:</tspan> Most abundant; ONLY antibody that crosses the placenta to protect newborns.</text>
        <text x="72" y="506" font-family="Arial" font-size="14" fill="#1C1D1F"><tspan font-weight="bold">• IgM:</tspan> First antibody produced in acute primary infection (early diagnostic marker).</text>
        <text x="72" y="536" font-family="Arial" font-size="14" fill="#1C1D1F"><tspan font-weight="bold">• IgA:</tspan> Mucosal protection in breastmilk (colostrum), saliva, respiratory &amp; GI tracts.</text>
        <text x="72" y="566" font-family="Arial" font-size="14" fill="#1C1D1F"><tspan font-weight="bold">• IgE:</tspan> Allergic anaphylaxis (histamine mast cells) &amp; helminth parasitic defense.</text>
        <text x="72" y="608" font-family="Arial" font-size="13" font-weight="bold" fill="#065F46">Active Natural = Infection · Active Artificial = Vaccines (UNEPI) · Passive = Maternal IgG / Antitoxin</text>
      `
    })
  },
  {
    file: "skin-wound-healing.webp",
    svg: wrapPlate({
      badge: "INTEGUMENTARY & WOUND CARE",
      title: "Skin Layers, Burns Rule of Nines & 4-Phase Healing",
      subtitle: "Epidermis · Dermis · Subcutaneous · Sterile Wound Dressing",
      bodySvg: `
        <g filter="url(#cardShadow)">
          <rect x="48" y="145" width="420" height="250" rx="14" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2"/>
          <text x="72" y="178" font-family="Arial" font-size="17" font-weight="bold" fill="#1C1D1F">3 Anatomical Skin Layers</text>
          <rect x="72" y="198" width="372" height="44" rx="6" fill="#FDE68A"/>
          <text x="88" y="225" font-family="Arial" font-size="14" font-weight="bold" fill="#78350F">1. Epidermis — Keratinocytes, Melanocytes (1st-Degree Burn)</text>
          <rect x="72" y="250" width="372" height="62" rx="6" fill="#FCA5A5"/>
          <text x="88" y="276" font-family="Arial" font-size="14" font-weight="bold" fill="#7F1D1D">2. Dermis — Collagen, Sweat Glands, Nerve Endings</text>
          <text x="88" y="298" font-family="Arial" font-size="12" fill="#7F1D1D">(2nd-Degree / Partial-Thickness: Blisters &amp; Severe Pain)</text>
          <rect x="72" y="320" width="372" height="54" rx="6" fill="#FEF08A"/>
          <text x="88" y="346" font-family="Arial" font-size="14" font-weight="bold" fill="#713F12">3. Subcutaneous (Hypodermis) — Adipose, SC Injections</text>
          <text x="88" y="365" font-family="Arial" font-size="12" fill="#713F12">(3rd-Degree Full-Thickness: Painless leathery eschar)</text>

          <rect x="492" y="145" width="420" height="250" rx="14" fill="#FFFFFF" stroke="#D8B4FE" stroke-width="2"/>
          <text x="516" y="178" font-family="Arial" font-size="17" font-weight="bold" fill="#7E22CE">4 Phases of Wound Healing</text>
          <text x="516" y="216" font-family="Arial" font-size="14" fill="#1C1D1F"><tspan font-weight="bold" fill="#A137F2">1. Hemostasis (0–2 hrs):</tspan> Vasoconstriction &amp; fibrin clot</text>
          <text x="516" y="254" font-family="Arial" font-size="14" fill="#1C1D1F"><tspan font-weight="bold" fill="#A137F2">2. Inflammatory (Days 1–4):</tspan> Neutrophils &amp; macrophages</text>
          <text x="516" y="292" font-family="Arial" font-size="14" fill="#1C1D1F"><tspan font-weight="bold" fill="#A137F2">3. Proliferative (Days 4–21):</tspan> Granulation &amp; angiogenesis</text>
          <text x="516" y="330" font-family="Arial" font-size="14" fill="#1C1D1F"><tspan font-weight="bold" fill="#A137F2">4. Maturation (21 days–1 yr):</tspan> Collagen remodeling</text>
          <text x="516" y="370" font-family="Arial" font-size="12" font-weight="bold" fill="#065F46">Clean from Cleanest to Dirtiest · Maintain Moist Wound Bed</text>
        </g>

        <rect x="48" y="422" width="864" height="224" rx="14" fill="#FFFFFF" stroke="#99F6E4" stroke-width="2"/>
        <text x="72" y="458" font-family="Arial" font-size="17" font-weight="bold" fill="#065F46">Adult Burns Wallace Rule of Nines &amp; Parkland Fluid Resuscitation</text>
        <text x="72" y="496" font-family="Arial" font-size="14" fill="#1C1D1F">• Head &amp; Neck: 9%  |  Each Arm: 9%  |  Anterior Trunk: 18%  |  Posterior Trunk: 18%  |  Each Leg: 18%  |  Perineum: 1%</text>
        <rect x="72" y="524" width="816" height="58" rx="8" fill="#ECFDF5"/>
        <text x="92" y="558" font-family="Arial" font-size="16" font-weight="bold" fill="#065F46">Parkland Formula (24h Ringer's Lactate): 4 mL × Body Weight (kg) × %TBSA Burned (Give 50% in first 8 hours)</text>
        <text x="72" y="618" font-family="Arial" font-size="13" fill="#475569">Pressure Ulcer Prevention: Reposition bedridden patients every 2 hours; monitor Braden Scale &amp; protein nutrition.</text>
      `
    })
  },
  {
    file: "eye-ear-sensory.webp",
    svg: wrapPlate({
      badge: "SENSORY ORGANS (ENT & OPHTHALMOLOGY)",
      title: "Eye Visual Pathway & Ear Auditory/Equilibrium Anatomy",
      subtitle: "Cranial Nerves II, III, IV, VI & VIII · Clinical Screening",
      bodySvg: `
        <g filter="url(#cardShadow)">
          <rect x="48" y="145" width="420" height="495" rx="14" fill="#FFFFFF" stroke="#D8B4FE" stroke-width="2"/>
          <text x="72" y="182" font-family="Arial" font-size="19" font-weight="bold" fill="#7E22CE">Eye Anatomy &amp; Refraction Flow</text>
          <circle cx="258" cy="292" r="78" fill="#EFF6FF" stroke="#1C1D1F" stroke-width="3"/>
          <path d="M180 292 Q192 252 204 292 Q192 332 180 292" fill="#BAE6FD" stroke="#0284C7" stroke-width="2"/>
          <ellipse cx="222" cy="292" rx="12" ry="30" fill="#FFFFFF" stroke="#A137F2" stroke-width="2"/>
          <path d="M336 284 L390 284 L390 300 L336 300" fill="#FDE68A" stroke="#D97706" stroke-width="2"/>
          <text x="72" y="405" font-family="Arial" font-size="14" fill="#1C1D1F"><tspan font-weight="bold">1. Cornea &amp; Aqueous Humor:</tspan> Refraction &amp; IOP (10–21 mmHg)</text>
          <text x="72" y="438" font-family="Arial" font-size="14" fill="#1C1D1F"><tspan font-weight="bold">2. Iris &amp; Lens:</tspan> Pupil light reflex (CN II in / CN III out)</text>
          <text x="72" y="471" font-family="Arial" font-size="14" fill="#1C1D1F"><tspan font-weight="bold">3. Retina:</tspan> Rods (night vision) &amp; Cones (color/macula)</text>
          <text x="72" y="504" font-family="Arial" font-size="14" fill="#1C1D1F"><tspan font-weight="bold">4. Optic Nerve (CN II):</tspan> Carries signal to Occipital Cortex</text>
          <rect x="72" y="534" width="372" height="80" rx="8" fill="#F7EDFF"/>
          <text x="90" y="562" font-family="Arial" font-size="13" font-weight="bold" fill="#7E22CE">Uganda Nursing High-Yield:</text>
          <text x="90" y="584" font-family="Arial" font-size="13" fill="#334155">Glaucoma = ↑ IOP &gt;21 mmHg · Cataract = cloudy lens</text>
          <text x="90" y="604" font-family="Arial" font-size="13" fill="#334155">Snellen Chart: Normal vision 6/6 meters (20/20 ft)</text>

          <rect x="492" y="145" width="420" height="495" rx="14" fill="#FFFFFF" stroke="#99F6E4" stroke-width="2"/>
          <text x="516" y="182" font-family="Arial" font-size="19" font-weight="bold" fill="#065F46">Ear Sound &amp; Balance Pathway</text>
          <rect x="524" y="232" width="120" height="110" rx="12" fill="#ECFDF5" stroke="#0D9488" stroke-width="2"/>
          <text x="584" y="278" text-anchor="middle" font-family="Arial" font-size="14" font-weight="bold" fill="#065F46">Outer Ear</text>
          <text x="584" y="302" text-anchor="middle" font-family="Arial" font-size="12" fill="#334155">Pinna + Canal</text>
          <rect x="664" y="232" width="110" height="110" rx="12" fill="#FEF3C7" stroke="#D97706" stroke-width="2"/>
          <text x="719" y="274" text-anchor="middle" font-family="Arial" font-size="14" font-weight="bold" fill="#92400E">Middle Ear</text>
          <text x="719" y="298" text-anchor="middle" font-family="Arial" font-size="11" fill="#334155">Malleus, Incus,</text>
          <text x="719" y="314" text-anchor="middle" font-family="Arial" font-size="11" fill="#334155">Stapes (Ossicles)</text>
          <rect x="794" y="232" width="96" height="110" rx="12" fill="#F3E8FF" stroke="#A137F2" stroke-width="2"/>
          <text x="842" y="274" text-anchor="middle" font-family="Arial" font-size="14" font-weight="bold" fill="#7E22CE">Inner Ear</text>
          <text x="842" y="298" text-anchor="middle" font-family="Arial" font-size="11" fill="#334155">Cochlea &amp;</text>
          <text x="842" y="314" text-anchor="middle" font-family="Arial" font-size="11" fill="#334155">Vestibule</text>

          <text x="516" y="405" font-family="Arial" font-size="14" fill="#1C1D1F"><tspan font-weight="bold">• Tympanic Membrane:</tspan> Pearly grey cone of light (otoscope)</text>
          <text x="516" y="438" font-family="Arial" font-size="14" fill="#1C1D1F"><tspan font-weight="bold">• Eustachian Tube:</tspan> Equalizes pressure (shorter in children)</text>
          <text x="516" y="471" font-family="Arial" font-size="14" fill="#1C1D1F"><tspan font-weight="bold">• Cochlea (Hearing):</tspan> Organ of Corti -> CN VIII</text>
          <text x="516" y="504" font-family="Arial" font-size="14" fill="#1C1D1F"><tspan font-weight="bold">• Semicircular Canals:</tspan> Dynamic balance &amp; vertigo</text>
          <rect x="516" y="534" width="372" height="80" rx="8" fill="#ECFDF5"/>
          <text x="534" y="562" font-family="Arial" font-size="13" font-weight="bold" fill="#065F46">Otoscope &amp; Tuning Fork Tests:</text>
          <text x="534" y="584" font-family="Arial" font-size="13" fill="#334155">Adult ear exam: Pull pinna UP &amp; BACK (Child &lt;3y: DOWN &amp; BACK)</text>
          <text x="534" y="604" font-family="Arial" font-size="13" fill="#334155">Rinne Normal: Air Conduction &gt; Bone Conduction (AC &gt; BC)</text>
        </g>
      `
    })
  },
  {
    file: "nursing-vitals-assessment.webp",
    svg: wrapPlate({
      badge: "FOUNDATIONS & HEALTH ASSESSMENT",
      title: "ADPIE Nursing Process & Normal Adult Vital Signs",
      subtitle: "Systematic Head-to-Toe Assessment & Documentation",
      bodySvg: `
        <g filter="url(#cardShadow)">
          <rect x="48" y="145" width="160" height="170" rx="12" fill="#FFFFFF" stroke="#A137F2" stroke-width="2"/>
          <text x="128" y="180" text-anchor="middle" font-family="Arial" font-size="24" font-weight="bold" fill="#A137F2">A</text>
          <text x="128" y="208" text-anchor="middle" font-family="Arial" font-size="15" font-weight="bold" fill="#1C1D1F">Assessment</text>
          <text x="128" y="236" text-anchor="middle" font-family="Arial" font-size="12" fill="#475569">Subjective (History)</text>
          <text x="128" y="256" text-anchor="middle" font-family="Arial" font-size="12" fill="#475569">&amp; Objective Vitals</text>
          <text x="128" y="276" text-anchor="middle" font-family="Arial" font-size="12" fill="#475569">IPPA Exam</text>

          <rect x="224" y="145" width="160" height="170" rx="12" fill="#FFFFFF" stroke="#0D9488" stroke-width="2"/>
          <text x="304" y="180" text-anchor="middle" font-family="Arial" font-size="24" font-weight="bold" fill="#0D9488">D</text>
          <text x="304" y="208" text-anchor="middle" font-family="Arial" font-size="15" font-weight="bold" fill="#1C1D1F">Diagnosis</text>
          <text x="304" y="236" text-anchor="middle" font-family="Arial" font-size="12" fill="#475569">NANDA-I Clinical</text>
          <text x="304" y="256" text-anchor="middle" font-family="Arial" font-size="12" fill="#475569">Problem Statement</text>
          <text x="304" y="276" text-anchor="middle" font-family="Arial" font-size="12" fill="#475569">P-E-S Format</text>

          <rect x="400" y="145" width="160" height="170" rx="12" fill="#FFFFFF" stroke="#2563EB" stroke-width="2"/>
          <text x="480" y="180" text-anchor="middle" font-family="Arial" font-size="24" font-weight="bold" fill="#2563EB">P</text>
          <text x="480" y="208" text-anchor="middle" font-family="Arial" font-size="15" font-weight="bold" fill="#1C1D1F">Planning</text>
          <text x="480" y="236" text-anchor="middle" font-family="Arial" font-size="12" fill="#475569">SMART Patient</text>
          <text x="480" y="256" text-anchor="middle" font-family="Arial" font-size="12" fill="#475569">Goals &amp; Priority</text>
          <text x="480" y="276" text-anchor="middle" font-family="Arial" font-size="12" fill="#475569">(ABCDE Triage)</text>

          <rect x="576" y="145" width="160" height="170" rx="12" fill="#FFFFFF" stroke="#D97706" stroke-width="2"/>
          <text x="656" y="180" text-anchor="middle" font-family="Arial" font-size="24" font-weight="bold" fill="#D97706">I</text>
          <text x="656" y="208" text-anchor="middle" font-family="Arial" font-size="15" font-weight="bold" fill="#1C1D1F">Implementation</text>
          <text x="656" y="236" text-anchor="middle" font-family="Arial" font-size="12" fill="#475569">Independent &amp;</text>
          <text x="656" y="256" text-anchor="middle" font-family="Arial" font-size="12" fill="#475569">Collaborative Care</text>
          <text x="656" y="276" text-anchor="middle" font-family="Arial" font-size="12" fill="#475569">+ Infection Control</text>

          <rect x="752" y="145" width="160" height="170" rx="12" fill="#FFFFFF" stroke="#059669" stroke-width="2"/>
          <text x="832" y="180" text-anchor="middle" font-family="Arial" font-size="24" font-weight="bold" fill="#059669">E</text>
          <text x="832" y="208" text-anchor="middle" font-family="Arial" font-size="15" font-weight="bold" fill="#1C1D1F">Evaluation</text>
          <text x="832" y="236" text-anchor="middle" font-family="Arial" font-size="12" fill="#475569">Goal Met / Partial</text>
          <text x="832" y="256" text-anchor="middle" font-family="Arial" font-size="12" fill="#475569">Re-assess &amp; Revise</text>
          <text x="832" y="276" text-anchor="middle" font-family="Arial" font-size="12" fill="#475569">Care Plan</text>
        </g>

        <rect x="48" y="346" width="864" height="302" rx="14" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2"/>
        <text x="72" y="382" font-family="Arial" font-size="18" font-weight="bold" fill="#1C1D1F">Normal Adult Vital Signs &amp; Physical Examination Sequence</text>
        <text x="72" y="422" font-family="Arial" font-size="14" fill="#1C1D1F"><tspan font-weight="bold" fill="#A137F2">• Temperature:</tspan> 36.5°C – 37.5°C (Fever ≥ 38.0°C · Hypothermia &lt; 35.0°C)</text>
        <text x="72" y="454" font-family="Arial" font-size="14" fill="#1C1D1F"><tspan font-weight="bold" fill="#A137F2">• Pulse / Heart Rate:</tspan> 60 – 100 beats/min (Bradycardia &lt; 60 · Tachycardia &gt; 100)</text>
        <text x="72" y="486" font-family="Arial" font-size="14" fill="#1C1D1F"><tspan font-weight="bold" fill="#A137F2">• Respiratory Rate:</tspan> 12 – 20 breaths/min (Check SpO2: Normal 95% – 100%)</text>
        <text x="72" y="518" font-family="Arial" font-size="14" fill="#1C1D1F"><tspan font-weight="bold" fill="#A137F2">• Blood Pressure:</tspan> &lt; 120 / 80 mmHg (Hypertension ≥ 140 / 90 mmHg on two readings)</text>
        <rect x="72" y="544" width="816" height="82" rx="10" fill="#F7EDFF" stroke="#D8B4FE"/>
        <text x="92" y="576" font-family="Arial" font-size="14" font-weight="bold" fill="#7E22CE">IPPA Sequence: General (Inspection → Palpation → Percussion → Auscultation)</text>
        <text x="92" y="604" font-family="Arial" font-size="14" font-weight="bold" fill="#1C1D1F">Abdominal Exception: Inspection → Auscultation → Percussion → Palpation (prevents altering bowel sounds)</text>
      `
    })
  },
  {
    file: "emergency-cpr-triage.webp",
    svg: wrapPlate({
      badge: "FIRST AID & EMERGENCY CARE",
      title: "ABCDE Primary Survey & High-Quality CPR Protocol",
      subtitle: "Immediate Life-Saving Priorities · 30:2 Compression-Ventilation",
      bodySvg: `
        <g filter="url(#cardShadow)">
          <rect x="48" y="145" width="420" height="495" rx="14" fill="#FFFFFF" stroke="#FECACA" stroke-width="2"/>
          <text x="72" y="182" font-family="Arial" font-size="19" font-weight="bold" fill="#B91C1C">ABCDE Emergency Primary Survey</text>
          <rect x="72" y="205" width="372" height="72" rx="8" fill="#FEF2F2"/>
          <text x="90" y="232" font-family="Arial" font-size="15" font-weight="bold" fill="#991B1B">A — Airway (+ Cervical Spine Protection)</text>
          <text x="90" y="256" font-family="Arial" font-size="13" fill="#334155">Head-tilt chin-lift (Jaw thrust in trauma) · Suction secretions</text>

          <rect x="72" y="290" width="372" height="72" rx="8" fill="#EFF6FF"/>
          <text x="90" y="317" font-family="Arial" font-size="15" font-weight="bold" fill="#1E40AF">B — Breathing &amp; Oxygenation</text>
          <text x="90" y="341" font-family="Arial" font-size="13" fill="#334155">SpO2, RR, chest rise · High-flow O2 · Treat tension pneumothorax</text>

          <rect x="72" y="375" width="372" height="72" rx="8" fill="#F7EDFF"/>
          <text x="90" y="402" font-family="Arial" font-size="15" font-weight="bold" fill="#7E22CE">C — Circulation &amp; Hemorrhage Control</text>
          <text x="90" y="426" font-family="Arial" font-size="13" fill="#334155">2 large-bore IV cannulas · Ringer's Lactate · Stop external bleeding</text>

          <rect x="72" y="460" width="372" height="72" rx="8" fill="#FFFBEB"/>
          <text x="90" y="487" font-family="Arial" font-size="15" font-weight="bold" fill="#B45309">D — Disability (AVPU / GCS + Blood Glucose)</text>
          <text x="90" y="511" font-family="Arial" font-size="13" fill="#334155">Check pupils (PERRLA) · Always rule out hypoglycemia ("DON'T ever forget glucose")</text>

          <rect x="72" y="545" width="372" height="72" rx="8" fill="#ECFDF5"/>
          <text x="90" y="572" font-family="Arial" font-size="15" font-weight="bold" fill="#065F46">E — Exposure &amp; Temperature Control</text>
          <text x="90" y="596" font-family="Arial" font-size="13" fill="#334155">Inspect whole body for hidden injuries/rashes · Prevent hypothermia</text>

          <rect x="492" y="145" width="420" height="495" rx="14" fill="#FFFFFF" stroke="#D8B4FE" stroke-width="2"/>
          <text x="516" y="182" font-family="Arial" font-size="19" font-weight="bold" fill="#7E22CE">Adult BLS / CPR Algorithm</text>
          <text x="516" y="226" font-family="Arial" font-size="15" font-weight="bold" fill="#1C1D1F">1. Scene Safety &amp; Check Responsiveness</text>
          <text x="534" y="250" font-family="Arial" font-size="13" fill="#475569">Tap shoulders &amp; shout; call for help + AED.</text>
          <text x="516" y="290" font-family="Arial" font-size="15" font-weight="bold" fill="#1C1D1F">2. Check Carotid Pulse &amp; Breathing (&le; 10 sec)</text>
          <text x="534" y="314" font-family="Arial" font-size="13" fill="#475569">No pulse or gasping = Start CPR immediately (C-A-B).</text>
          <text x="516" y="354" font-family="Arial" font-size="15" font-weight="bold" fill="#1C1D1F">3. Chest Compressions (Lower Half of Sternum)</text>
          <text x="534" y="378" font-family="Arial" font-size="13" fill="#475569">• Rate: 100 – 120 compressions/min</text>
          <text x="534" y="400" font-family="Arial" font-size="13" fill="#475569">• Depth: 5 – 6 cm (2 inches) + full chest recoil</text>
          <text x="534" y="422" font-family="Arial" font-size="13" fill="#475569">• Ratio: 30 compressions : 2 rescue breaths</text>
          <rect x="516" y="456" width="372" height="160" rx="10" fill="#1C1D1F"/>
          <text x="702" y="492" text-anchor="middle" font-family="Arial" font-size="15" font-weight="bold" fill="#ECEB98">Triage Color System (START / ETAT)</text>
          <text x="540" y="526" font-family="Arial" font-size="13" font-weight="bold" fill="#FCA5A5">RED (Immediate): Life-threatening airway/shock</text>
          <text x="540" y="554" font-family="Arial" font-size="13" font-weight="bold" fill="#FDE68A">YELLOW (Delayed): Serious stable fractures/wounds</text>
          <text x="540" y="582" font-family="Arial" font-size="13" font-weight="bold" fill="#6EE7B7">GREEN (Minor): Walking wounded</text>
        </g>
      `
    })
  },
  {
    file: "mental-health-biopsychosocial.webp",
    svg: wrapPlate({
      badge: "MENTAL HEALTH & PSYCHIATRIC NURSING",
      title: "Biopsychosocial Model & Mental Status Examination (MSE)",
      subtitle: "Therapeutic Communication · Crisis & Mood Disorder Care",
      bodySvg: `
        <g filter="url(#cardShadow)">
          <rect x="48" y="145" width="420" height="495" rx="14" fill="#FFFFFF" stroke="#D8B4FE" stroke-width="2"/>
          <text x="72" y="182" font-family="Arial" font-size="19" font-weight="bold" fill="#7E22CE">Mental Status Exam (ASEPTIC Mnemonic)</text>
          <text x="72" y="226" font-family="Arial" font-size="14" fill="#1C1D1F"><tspan font-weight="bold" fill="#A137F2">A — Appearance &amp; Behavior:</tspan> Hygiene, posture, eye contact</text>
          <text x="72" y="264" font-family="Arial" font-size="14" fill="#1C1D1F"><tspan font-weight="bold" fill="#A137F2">S — Speech:</tspan> Rate, volume, fluency, pressured vs retarded</text>
          <text x="72" y="302" font-family="Arial" font-size="14" fill="#1C1D1F"><tspan font-weight="bold" fill="#A137F2">E — Emotion (Mood &amp; Affect):</tspan> Euthymic, depressed, labile</text>
          <text x="72" y="340" font-family="Arial" font-size="14" fill="#1C1D1F"><tspan font-weight="bold" fill="#A137F2">P — Perception:</tspan> Auditory/visual hallucinations, illusions</text>
          <text x="72" y="378" font-family="Arial" font-size="14" fill="#1C1D1F"><tspan font-weight="bold" fill="#A137F2">T — Thought Process &amp; Content:</tspan> Flight of ideas, delusions</text>
          <text x="72" y="416" font-family="Arial" font-size="14" fill="#1C1D1F"><tspan font-weight="bold" fill="#A137F2">I — Insight &amp; Judgment:</tspan> Awareness of illness, safety choices</text>
          <text x="72" y="454" font-family="Arial" font-size="14" fill="#1C1D1F"><tspan font-weight="bold" fill="#A137F2">C — Cognition:</tspan> Orientation (Person/Place/Time), memory</text>
          <rect x="72" y="492" width="372" height="122" rx="10" fill="#FEF2F2" stroke="#FECACA"/>
          <text x="92" y="524" font-family="Arial" font-size="14" font-weight="bold" fill="#B91C1C">Priority Suicide &amp; Violence Risk Protocol</text>
          <text x="92" y="552" font-family="Arial" font-size="13" fill="#334155">1. Never leave a high-risk patient alone; ensure 1:1 observation.</text>
          <text x="92" y="576" font-family="Arial" font-size="13" fill="#334155">2. Remove sharps, cords, belts &amp; unmonitored medications.</text>
          <text x="92" y="600" font-family="Arial" font-size="13" fill="#334155">3. Use calm, non-judgmental, open-ended therapeutic questions.</text>

          <rect x="492" y="145" width="420" height="495" rx="14" fill="#FFFFFF" stroke="#99F6E4" stroke-width="2"/>
          <text x="516" y="182" font-family="Arial" font-size="19" font-weight="bold" fill="#065F46">Biopsychosocial Care &amp; Therapies</text>
          <rect x="516" y="210" width="372" height="118" rx="10" fill="#ECFDF5"/>
          <text x="536" y="240" font-family="Arial" font-size="15" font-weight="bold" fill="#065F46">Biological (Neurotransmitters)</text>
          <text x="536" y="266" font-family="Arial" font-size="13" fill="#334155">• Depression: ↓ Serotonin / Norepinephrine (SSRIs)</text>
          <text x="536" y="290" font-family="Arial" font-size="13" fill="#334155">• Schizophrenia: ↑ Dopamine (Antipsychotics · Watch EPS)</text>
          <text x="536" y="314" font-family="Arial" font-size="13" fill="#334155">• Anxiety: ↓ GABA (Short-term Benzodiazepines + CBT)</text>

          <rect x="516" y="346" width="372" height="128" rx="10" fill="#EFF6FF"/>
          <text x="536" y="376" font-family="Arial" font-size="15" font-weight="bold" fill="#1E40AF">Psychological &amp; Developmental</text>
          <text x="536" y="402" font-family="Arial" font-size="13" fill="#334155">• Erikson's Psychosocial Stages (Trust vs Mistrust → Integrity)</text>
          <text x="536" y="426" font-family="Arial" font-size="13" fill="#334155">• Cognitive Behavioral Therapy (CBT) &amp; Motivational Interviewing</text>
          <text x="536" y="450" font-family="Arial" font-size="13" fill="#334155">• Defense Mechanisms (Denial, Projection, Sublimation)</text>

          <rect x="516" y="492" width="372" height="122" rx="10" fill="#F7EDFF"/>
          <text x="536" y="524" font-family="Arial" font-size="15" font-weight="bold" fill="#7E22CE">Social &amp; Uganda Community Care</text>
          <text x="536" y="552" font-family="Arial" font-size="13" fill="#334155">• Family psychoeducation &amp; stigma reduction</text>
          <text x="536" y="576" font-family="Arial" font-size="13" fill="#334155">• Alcohol/substance rehabilitation &amp; PTSD support</text>
          <text x="536" y="600" font-family="Arial" font-size="13" fill="#334155">• mhGAP integration at HC III / HC IV &amp; Regional Hospitals</text>
        </g>
      `
    })
  },
  {
    file: "leadership-research-ethics.webp",
    svg: wrapPlate({
      badge: "LEADERSHIP, ETHICS & NURSING RESEARCH",
      title: "4 Bioethical Principles, Management Cycle & Research Steps",
      subtitle: "UNMC Scope of Practice · Evidence-Based Nursing Care",
      bodySvg: `
        <g filter="url(#cardShadow)">
          <rect x="48" y="145" width="420" height="240" rx="14" fill="#FFFFFF" stroke="#D8B4FE" stroke-width="2"/>
          <text x="72" y="180" font-family="Arial" font-size="18" font-weight="bold" fill="#7E22CE">4 Core Bioethical Principles</text>
          <text x="72" y="218" font-family="Arial" font-size="14" fill="#1C1D1F"><tspan font-weight="bold" fill="#A137F2">1. Autonomy:</tspan> Informed consent &amp; right to refuse treatment</text>
          <text x="72" y="254" font-family="Arial" font-size="14" fill="#1C1D1F"><tspan font-weight="bold" fill="#A137F2">2. Beneficence:</tspan> Acting actively to benefit the patient</text>
          <text x="72" y="290" font-family="Arial" font-size="14" fill="#1C1D1F"><tspan font-weight="bold" fill="#A137F2">3. Non-Maleficence:</tspan> "First, do no harm" (Prevent errors)</text>
          <text x="72" y="326" font-family="Arial" font-size="14" fill="#1C1D1F"><tspan font-weight="bold" fill="#A137F2">4. Justice:</tspan> Fair triage &amp; equitable care regardless of status</text>
          <text x="72" y="362" font-family="Arial" font-size="12" font-weight="bold" fill="#065F46">+ Fidelity (Keeping promises) · Veracity (Truthfulness) · Confidentiality</text>

          <rect x="492" y="145" width="420" height="240" rx="14" fill="#FFFFFF" stroke="#99F6E4" stroke-width="2"/>
          <text x="516" y="180" font-family="Arial" font-size="18" font-weight="bold" fill="#065F46">Ward Management &amp; Delegation (5 Rights)</text>
          <text x="516" y="218" font-family="Arial" font-size="14" fill="#1C1D1F">• Functions: Planning → Organizing → Staffing → Directing → Controlling</text>
          <text x="516" y="254" font-family="Arial" font-size="14" fill="#1C1D1F">• Leadership Styles: Transformational · Democratic · Autocratic (Code Blue)</text>
          <text x="516" y="290" font-family="Arial" font-size="14" fill="#1C1D1F">• 5 Rights of Delegation: Task · Circumstance · Person · Direction · Supervision</text>
          <text x="516" y="326" font-family="Arial" font-size="14" fill="#1C1D1F">• Quality Improvement: PDSA Cycle (Plan–Do–Study–Act)</text>
          <text x="516" y="362" font-family="Arial" font-size="12" font-weight="bold" fill="#065F46">Accountability stays with the delegating Registered Nurse/Midwife</text>

          <rect x="48" y="408" width="864" height="236" rx="14" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2"/>
          <text x="72" y="444" font-family="Arial" font-size="18" font-weight="bold" fill="#1C1D1F">Nursing Research &amp; Evidence-Based Practice (PICO → Dissemination)</text>
          <rect x="72" y="472" width="146" height="90" rx="10" fill="#F7EDFF" stroke="#D8B4FE"/>
          <text x="145" y="504" text-anchor="middle" font-family="Arial" font-size="14" font-weight="bold" fill="#7E22CE">1. Problem &amp; PICO</text>
          <text x="145" y="530" text-anchor="middle" font-family="Arial" font-size="12" fill="#334155">Patient, Intervention,</text>
          <text x="145" y="548" text-anchor="middle" font-family="Arial" font-size="12" fill="#334155">Comparison, Outcome</text>

          <rect x="238" y="472" width="146" height="90" rx="10" fill="#EFF6FF" stroke="#BFDBFE"/>
          <text x="311" y="504" text-anchor="middle" font-family="Arial" font-size="14" font-weight="bold" fill="#1D4ED8">2. Lit Review</text>
          <text x="311" y="530" text-anchor="middle" font-family="Arial" font-size="12" fill="#334155">PubMed, Cochrane,</text>
          <text x="311" y="548" text-anchor="middle" font-family="Arial" font-size="12" fill="#334155">WHO Guidelines</text>

          <rect x="404" y="472" width="146" height="90" rx="10" fill="#ECFDF5" stroke="#A7F3D0"/>
          <text x="477" y="504" text-anchor="middle" font-family="Arial" font-size="14" font-weight="bold" fill="#065F46">3. Study Design</text>
          <text x="477" y="530" text-anchor="middle" font-family="Arial" font-size="12" fill="#334155">Cross-sectional, RCT,</text>
          <text x="477" y="548" text-anchor="middle" font-family="Arial" font-size="12" fill="#334155">IRB Ethics Approval</text>

          <rect x="570" y="472" width="146" height="90" rx="10" fill="#FFFBEB" stroke="#FDE68A"/>
          <text x="643" y="504" text-anchor="middle" font-family="Arial" font-size="14" font-weight="bold" fill="#B45309">4. Data Analysis</text>
          <text x="643" y="530" text-anchor="middle" font-family="Arial" font-size="12" fill="#334155">Mean, SD, p &lt; 0.05,</text>
          <text x="643" y="548" text-anchor="middle" font-family="Arial" font-size="12" fill="#334155">Thematic Coding</text>

          <rect x="736" y="472" width="150" height="90" rx="10" fill="#1C1D1F"/>
          <text x="811" y="504" text-anchor="middle" font-family="Arial" font-size="14" font-weight="bold" fill="#ECEB98">5. Ward Adoption</text>
          <text x="811" y="530" text-anchor="middle" font-family="Arial" font-size="12" fill="#E2E8F0">Clinical SOPs &amp;</text>
          <text x="811" y="548" text-anchor="middle" font-family="Arial" font-size="12" fill="#E2E8F0">UNMC CME Practice</text>

          <text x="72" y="608" font-family="Arial" font-size="13" fill="#475569">Remember: Research Ethics require Voluntary Informed Consent, Confidentiality, REC/UNCST Approval &amp; Zero Plagiarism.</text>
        </g>
      `
    })
  }
];

async function run() {
  for (const plate of PLATES) {
    await sharp(Buffer.from(plate.svg))
      .webp({ quality: 90 })
      .toFile(path.join(OUT_DIR, plate.file));
    console.log("Generated:", plate.file);
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
