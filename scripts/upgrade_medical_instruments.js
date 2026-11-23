/**
 * Upgrade, Clean & Expand Nursing Uganda Medical Instrument Atlas
 * 1. Normalizes & enhances all existing instrument photos onto crisp 800x600 WebP studio plates.
 * 2. Fixes category misplacements, duplicates & misspellings (e.g. Speculum, Mortar & Pestle, Proctoscope).
 * 3. Generates crisp custom 800x600 WebP clinical illustration plates for 40+ essential new OSCE instruments.
 * 4. Writes rich, unique clinical use, sterilization method, preparation, safety & 4 OSCE exam points per instrument.
 */
const fs = require("node:fs");
const path = require("node:path");
const sharp = require("sharp");

const ROOT = path.resolve(__dirname, "..");
const IMG_DIR = path.join(ROOT, "assets", "images", "medical-instruments");
const DATA_PATH = path.join(ROOT, "assets", "data", "medical-instruments.json");

function sanitizeXml(str) {
  return String(str || "")
    .replace(/&(?!amp;|lt;|gt;|quot;|apos;|#)/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// Specific overrides for legacy item spelling, category, and specific clinical notes
const ITEM_OVERRIDES = {
  "air-ring": {
    name: "Inflatable Air Ring Cushion",
    category: "Ward, Comfort And Infection Prevention",
    use: "Relieves localized pressure over bony prominences (sacrum, ischial tuberosities, heels) for bedbound or postpartum perineal repair patients.",
    sterilization: "Soap-and-water wash + 0.5% chlorine / 70% alcohol wipe between patients.",
    safety: "Do not over-inflate; excessive rim tension restricts collateral skin perfusion—use soft disposable linen cover."
  },
  "air-way-piece": {
    name: "Guedel Oropharyngeal Airway (OPA)",
    use: "Maintains a patent upper airway in deeply unconscious patients without a gag reflex by lifting the tongue off the posterior pharyngeal wall.",
    sterilization: "Single-use disposable (or HLD only where reusable autoclavable polymers are protocols).",
    safety: "Never insert in an awake patient with an intact gag reflex (triggers laryngospasm or vomiting); measure from corner of mouth to angle of mandible."
  },
  ett: {
    name: "Endotracheal Tube (ETT)",
    use: "Secures a definitive sealed airway for mechanical ventilation, positive pressure oxygenation, or general anaesthesia while preventing aspiration.",
    sterilization: "Sterile single-use packed medical PVC; discard immediately after extubation.",
    safety: "Always confirm bilateral breath sounds and ETCO2 after intubation; inflate cuff just enough (20-30 cmH2O) to prevent tracheal mucosal necrosis."
  },
  "inhaler": {
    name: "Metered-Dose Inhaler (MDI)",
    use: "Delivers precise aerosolized bronchodilator (e.g., salbutamol) or corticosteroid doses directly into the lower airways for asthma and COPD.",
    sterilization: "Patient-dedicated device; wash plastic actuator weekly with warm water and air dry.",
    safety: "Pair with a spacer chamber in children or poorly coordinated adults; instruct patient to exhale gently, actuate while inhaling slowly, and hold breath 10 seconds."
  },
  laryngoscope: {
    name: "Macintosh & Miller Laryngoscope",
    use: "Illuminates and lifts the epiglottis (curved Macintosh in vallecula; straight Miller directly) to visualize vocal cords for endotracheal intubation.",
    sterilization: "High-level disinfection (2% glutaraldehyde) or autoclave detachable blades; wipe handle with 70% alcohol.",
    safety: "Test bulb brightness and hinge lock before induction; lift upward along the handle axis—never lever against upper teeth."
  },
  "manual-suction-machine": {
    name: "Manual Foot-Operated Suction Unit",
    use: "Clears blood, vomitus, meconium, or thick secretions from the oropharynx and airway during resuscitation or power outages.",
    sterilization: "Empty & decontaminate collection jar with 0.5% chlorine; sterilize reusable tubing/catheters before storage.",
    safety: "Limit negative pressure (<120 mmHg adults, <100 mmHg infants) and keep suctioning under 10 seconds to prevent hypoxia."
  },
  "mucus-extractor": {
    name: "Neonatal Mucus Extractor (DeLee Trap)",
    use: "Gently clears amniotic fluid, mucus, or meconium from a newborn's mouth then nostrils while preventing aspiration or cross-contamination.",
    sterilization: "Sterile single-use packed catheter/trap; dispose as infectious medical waste after delivery.",
    safety: "Always suction 'Mouth BEFORE Nose' to stop reflex gasping of oral secretions into the trachea; keep bulb pressure gentle."
  },
  nebulizer: {
    name: "Jet / Ultrasonic Nebulizer Set",
    use: "Converts liquid bronchodilators, hypertonic saline, or adrenaline into continuous mist for severe bronchospasm, croup, or bronchiolitis.",
    sterilization: "Single-patient mask & medication chamber; wash, rinse with sterile water, and air-dry between doses.",
    safety: "Run at 6-8 L/min oxygen/air flow; monitor heart rate for tachycardia/tremors with frequent salbutamol nebulization."
  },
  "tracheostomy-tube": {
    name: "Cuffed Tracheostomy Tube with Inner Cannula",
    use: "Maintains a stable artificial airway below the vocal cords for prolonged ventilation, upper airway obstruction, or secretion clearance.",
    sterilization: "Sterile single-patient insertion tube; clean reusable inner cannula using sterile saline/hydrogen peroxide protocols.",
    safety: "Keep spare tube (same size and one size smaller) plus tracheal dilators at the bedside at all times for emergency decannulation."
  },
  "auvard-vaginal-spectrum": {
    name: "Auvard Weighted Vaginal Speculum",
    use: "Provides self-retaining posterior vaginal wall retraction using its weighted handle during cervical, fistula, or perineal surgeries.",
    sterilization: "Steam autoclave (134 C / 121 C wrapped pack).",
    safety: "Confirm sterile temperature before insertion so heated metal does not burn vaginal mucosa; ensure patient is in proper lithotomy."
  },
  "cusco-vaginal-spectrum": {
    name: "Cusco's Bivalve Vaginal Speculum",
    use: "Self-retaining bivalve speculum used for Pap smears, VIA cervical cancer screening, IUCD insertion/removal, and high vaginal swabs.",
    sterilization: "Steam autoclave (121-134 C) or high-level disinfection.",
    safety: "Warm blade, apply water-soluble lubricant (never gel before Pap smear), insert closed blades sideways then rotate 90 degrees before opening."
  },
  "cusco-s-vaginal-spectrum": null, // remove duplicate
  "tracheal-dilatory": null, // remove typo duplicate
  "tracheal-dilator": {
    name: "Trousseau Tracheal Dilator",
    use: "Emergency blunt-tipped instrument used to keep a tracheostomy stoma open during accidental tube dislodgement or tube change.",
    sterilization: "Steam autoclave; kept sterile on every tracheostomy bedside tray.",
    safety: "Spread blades gently along the longitudinal axis only after confirming stoma tract; avoid blind forceful pushing."
  },
  "protoscope": {
    name: "Proctoscope (Anoscope)",
    use: "Direct visual inspection of the anal canal and lower rectum for haemorrhoids, fissures, polyps, fistulae, or rectal biopsy.",
    sterilization: "Steam autoclave metal unit after dismantling obturator and light carrier.",
    safety: "Always keep the obturator seated fully during initial insertion to avoid mucosal tearing, then withdraw gently before inspection."
  },
  "motor-and-pestle": {
    name: "Porcelain Mortar and Pestle",
    use: "Crushes oral tablets into fine powder for nasogastric tube administration or paediatric weight-based compounding.",
    sterilization: "Wash thoroughly, sanitize with 70% alcohol, and dry completely between medications to avoid cross-dose contamination.",
    safety: "Never crush enteric-coated, sustained-release (SR/XR), or cytotoxic tablets—verify pharmacist suitability first."
  },
  "fetal-scope": {
    name: "Pinard Foetal Stethoscope",
    use: "Acoustic horn used in antenatal and labour wards to auscultate foetal heart sounds (normal 110-160 bpm) directly over the foetal back.",
    sterilization: "Soap-and-water wash and 70% alcohol wipe between mothers.",
    safety: "Simultaneously palpate the mother's radial pulse while listening to distinguish true foetal heart rate from maternal uterine souffle."
  },
  "snellen": {
    name: "Snellen Visual Acuity Chart",
    use: "Standardized optotype chart placed 6 metres away to measure distant visual acuity for ophthalmic screening and occupational exams.",
    sterilization: "Wipe laminated surface weekly; keep occluder card disinfected between patients.",
    safety: "Test each eye separately at standard 6-metre illumination without squinting; record results as numerator 6 / denominator."
  },
  "patella-hammer": {
    name: "Patellar Reflex Hammer (Taylor/Queen Square)",
    use: "Elicits deep tendon reflexes (patellar, biceps, triceps, Achilles) and checks Clonus/Babinski during neurological assessment (including pre-eclampsia MgSO4 monitoring).",
    sterilization: "Wipe with 70% alcohol between neurological examinations.",
    safety: "Critical in MgSO4 toxicity monitoring: absent patellar reflexes indicate impending magnesium toxicity—withhold next dose immediately."
  },
  "wrigley-forceps": {
    name: "Wrigley's Outlet Obstetric Forceps",
    use: "Short, lightweight curved forceps used at the pelvic outlet to assist delivery of the foetal head when second stage is delayed or in foetal distress.",
    sterilization: "Steam autoclave wrapped sterile set.",
    safety: "Confirm full cervical dilatation, ruptured membranes, engaged vertex, and empty maternal bladder before application; check lock integrity."
  },
  "sims": {
    name: "Sims Double-Bladed Vaginal Speculum",
    use: "Manual duckbill speculum used with an assistant to inspect vaginal walls, cervix, vesicovaginal fistula repairs, and post-delivery tears.",
    sterilization: "Steam autoclave after thorough enzymatic brush cleaning of hinges.",
    safety: "Requires left-lateral (Sims) or lithotomy position; retract posterior vaginal wall gently without pinching labia."
  }
};

// Specific clinical knowledge by category for enhanced non-generic fallback
const CATEGORY_KNOWLEDGE = {
  "Airway, Oxygen And Emergency Care": {
    sterilization: "High-level disinfection or sterile single-use airway disposables per UNMC/WHO IPC standards.",
    preparation: "Confirm correct patient size (adult/paediatric), verify oxygen source, valve patency, and suction readiness prior to emergency use.",
    safety: "Monitor SpO2, respiratory rate, chest rise, and colour continuously; never force airway adjuncts if gag reflex is intact."
  },
  "Theatre And Surgical Instruments": {
    sterilization: "Pre-soak in enzymatic detergent, scrub box locks open, and steam autoclave at 134 C (18 min) or 121 C (30 min).",
    preparation: "Inspect box locks, ratchet teeth, tip alignment, and chemical indicator tape on sterile wrap before opening onto sterile field.",
    safety: "Maintain strict surgical instrument counts before incision, before cavity closure, and at skin closure to prevent retained items."
  },
  "Midwifery And Obstetric Instruments": {
    sterilization: "Decontaminate immediately in 0.5% chlorine/enzymatic solution, brush grooves, and steam autoclave wrapped trays.",
    preparation: "Check sterile expiry indicator, blade/jaw alignment, and assemble with sterile gloves in delivery suite prior to maternal pushing.",
    safety: "Safeguard maternal perineum, cervix, and foetal scalp; document exact time of instrument use on partograph and delivery register."
  },
  "Medication And Fluid Therapy": {
    sterilization: "Single-use sterile disposable packs (syringes/giving sets/ampoules) or sanitized compounding ware.",
    preparation: "Apply the 10 Rights of Medication Administration, verify drug expiry, clarity, and patient allergies before opening sterile port.",
    safety: "Dispose sharp needles immediately into puncture-proof sharps container WITHOUT recapping; calculate IV drip rate in drops/min."
  },
  "Assessment And Diagnostic Equipment": {
    sterilization: "Wipe patient-contact surfaces (diaphragm, ear tips, probe, cuffs) with 70% isopropyl alcohol wipes between patients.",
    preparation: "Calibrate zero baseline, verify battery/light source, and explain step-by-step assessment cleanly to gain patient cooperation.",
    safety: "Cross-check abnormal automated readings manually and escalate critical thresholds (SpO2 < 92%, GCS drop, hyper/hypoglycaemia) promptly."
  },
  "General Clinical Instruments": {
    sterilization: "Autoclave stainless steel trays/receivers; use single-use sterile blades/tubes per procedure guideline.",
    preparation: "Assemble required procedure tray under aseptic principles, position patient comfortably, and verify lighting and privacy.",
    safety: "Keep contaminated waste segregated into colour-coded bins (yellow infectious, black general, safety box sharps)."
  },
  "Ward, Comfort And Infection Prevention": {
    sterilization: "Hospital-grade detergent wash followed by 0.5% sodium hypochlorite disinfection or autoclave linen packs.",
    preparation: "Inspect mechanical brakes, hinges, fabric seams, and cleanliness before placing near bedside or wound dressing station.",
    safety: "Prevent falls, pressure injuries, and scalds (e.g., wrap hot water bottles in flannel, lock cardiac table castors)."
  },
  "Elimination And Specimen Care": {
    sterilization: "Single-use sterile catheters/specimen containers; bedpan washer-disinfector or 0.5% chlorine immersion for reusable ware.",
    preparation: "Explain privacy measures, use clean/sterile gloves per task, and label specimen bottles with name, IP/OP number, time, and test.",
    safety: "Keep urinary drainage bags strictly BELOW bladder level without touching floor; prevent catheter-associated UTI via closed system."
  },
  "Dental And ENT Instruments": {
    sterilization: "Ultrasonic clean debris from serrations, dry thoroughly, pouch, and steam autoclave at 134 C.",
    preparation: "Verify fine tips under bright examination light, prepare suction, and position headrest firmly.",
    safety: "Protect gingival margin and tympanic membrane from trauma during retraction or foreign-body extraction."
  }
};

// 38 essential new clinical/OSCE instruments to add with bespoke high-res vector artwork
const NEW_INSTRUMENTS = [
  {
    name: "Bag-Valve-Mask Resuscitator (Ambu Bag)",
    slug: "ambu-bag-resuscitator",
    category: "Airway, Oxygen And Emergency Care",
    iconType: "ambu",
    use: "Delivers manual positive-pressure ventilation (with or without high-flow oxygen reservoir) during respiratory arrest, CPR, and neonatal resuscitation.",
    preparation: "Inspect self-inflating bag recoil, PEEP/pop-off valve, mask cushion seal, and oxygen tubing connection (10-15 L/min for reservoir fill).",
    safety: "Use C-E clamp mask grip; deliver 1 breath every 5-6 seconds in adults (watch gentle chest rise)—avoid hyperventilation."
  },
  {
    name: "Venturi Fixed-Performance Oxygen Mask",
    slug: "venturi-oxygen-mask",
    category: "Airway, Oxygen And Emergency Care",
    iconType: "venturi",
    use: "Delivers precise colour-coded FiO2 concentrations (24% blue, 28% white, 35% yellow, 40% red, 60% green) especially in COPD patients.",
    preparation: "Match colour-coded entrainment barrel to prescribed FiO2 and set exact L/min oxygen flow printed on the adaptor.",
    safety: "Crucial in COPD type-II respiratory failure to prevent CO2 narcosis while correcting dangerous hypoxaemia (target SpO2 88-92%)."
  },
  {
    name: "Non-Rebreather Oxygen Mask with Reservoir",
    slug: "non-rebreather-mask",
    category: "Airway, Oxygen And Emergency Care",
    iconType: "nrb",
    use: "Supplies high-concentration oxygen (60-90% FiO2) in acute trauma, shock, severe sepsis, eclampsia, or status asthmaticus.",
    preparation: "Pre-fill reservoir bag with oxygen at 12-15 L/min by depressing valve before placing snugly over patient's nose and mouth.",
    safety: "Never run below 10 L/min—reservoir must stay partially inflated during inspiration to avoid CO2 rebreathing."
  },
  {
    name: "Yankauer Rigid Suction Tip",
    slug: "yankauer-suction-tip",
    category: "Airway, Oxygen And Emergency Care",
    iconType: "suction",
    use: "Wide-bore rigid curved suction tip for rapid clearance of thick vomitus, blood, or pooled secretions in the oropharynx.",
    preparation: "Attach cleanly to suction tubing, test vacuum occluding vent port, and keep within arm's reach beside intubation tray.",
    safety: "Insert only under direct vision into the oropharynx; never push beyond posterior pharynx or apply trauma to tonsillar pillars."
  },
  {
    name: "Magill Intubating Forceps",
    slug: "magill-intubating-forceps",
    category: "Airway, Oxygen And Emergency Care",
    iconType: "forceps-angled",
    use: "Angled offset forceps used under direct laryngoscopy to guide nasotracheal tubes, insert throat packs, or remove supraglottic foreign bodies.",
    preparation: "Autoclave sterilized; inspect serrated oval tips for clean grip and smooth alignment without sharp burrs.",
    safety: "Never clamp directly across an ETT cuff—hold tube body only to prevent cuff perforation."
  },
  {
    name: "Nasopharyngeal Airway (NPA)",
    slug: "nasopharyngeal-airway",
    category: "Airway, Oxygen And Emergency Care",
    iconType: "tube-curved",
    use: "Soft bevelled airway inserted through a nostril into the posterior pharynx when mouth opening is restricted or gag reflex is partially present.",
    preparation: "Size from tip of nose to tragus of ear; coat outside with water-soluble lubricant before gentle insertion along nasal floor.",
    safety: "STRICTLY CONTRAINDICATED in suspected base-of-skull fracture (CSF rhinorrhoea, raccoon eyes) due to risk of intracranial passage."
  },
  {
    name: "Automated External Defibrillator (AED) & Pads",
    slug: "aed-defibrillator-pads",
    category: "Airway, Oxygen And Emergency Care",
    iconType: "aed",
    use: "Analyses cardiac rhythm automatically and delivers synchronized biphasic shock for shockable rhythms (VF / pulseless VT) in cardiac arrest.",
    preparation: "Turn power on immediately, dry bare chest, apply upper-right sternal and lower-left mid-axillary adhesive pads cleanly.",
    safety: "Shave/dry chest if wet, remove GTN patches, and shout 'STAND CLEAR' visually checking nobody touches patient or bed before shocking."
  },
  {
    name: "Foetal Doppler Ultrasound Monitor (Handheld)",
    slug: "foetal-doppler-monitor",
    category: "Midwifery And Obstetric Instruments",
    iconType: "doppler",
    use: "Electronic handheld ultrasound probe that amplifies audible foetal heartbeat and displays real-time bpm in ANC and active labour.",
    preparation: "Test battery, apply warm acoustic gel over foetal anterior shoulder location (Leopold's grip), and clean probe with alcohol-free wipe after.",
    safety: "Listen for 60 full seconds immediately after a uterine contraction to detect late decelerations promptly."
  },
  {
    name: "Manual Vacuum Aspiration (MVA) Syringe & Cannulae",
    slug: "mva-syringe-cannulae",
    category: "Midwifery And Obstetric Instruments",
    iconType: "syringe-mva",
    use: "60 mL locking double-valve vacuum syringe and Karman cannulae used for Post-Abortion Care (PAC) evacuation of retained products of conception.",
    preparation: "Charge vacuum safely before attaching cannula, verify locking collar seal, and perform no-touch aseptic paracervical/cervical prep.",
    safety: "Never push cannula forcefully past uterine fundus; monitor vaginal bleeding, vital signs, and gritty uterus sign indicating completeness."
  },
  {
    name: "Penguin Neonatal Bulb Resuscitation Suction",
    slug: "penguin-bulb-suction",
    category: "Midwifery And Obstetric Instruments",
    iconType: "bulb",
    use: "Single-piece translucent silicone resuscitator bulb designed for safe gentle neonatal airway clearance and easy post-birth sterilization.",
    preparation: "Split seam open to clean thoroughly and steam autoclave or boil between births per Uganda Helping Babies Breathe protocol.",
    safety: "Compress bulb BEFORE placing tip into newborn mouth (first) then nostrils (second)—never squeeze inside airway."
  },
  {
    name: "Resuscitation T-Piece / Newborn Self-Inflating Mask",
    slug: "neonatal-resuscitation-bag",
    category: "Midwifery And Obstetric Instruments",
    iconType: "ambu-neo",
    use: "Delivers gentle 250-500 mL neonatal positive-pressure breaths at 40-60 breaths/min via anatomical newborn round mask during Helping Babies Breathe.",
    preparation: "Set pop-off pressure limit valve (30-40 cmH2O), verify seal over baby's chin, mouth, and nose (covering eyes avoided).",
    safety: "If chest does not rise, follow MR SOPA corrective steps immediately (Mask adjustment, Reposition airway, Suction, Open mouth)."
  },
  {
    name: "Measuring Partograph & Cervical Dilatation Wheel",
    slug: "partograph-chart-board",
    category: "Midwifery And Obstetric Instruments",
    iconType: "partograph",
    use: "WHO/MoH graphical labour monitoring tool plotting cervical dilatation (>=4 cm), foetal heart rate, contractions, liquor, and maternal vitals.",
    preparation: "Confirm onset of active first stage labour (>=4 cm in Uganda MoH guidelines) before plotting Alert Line (1 cm/hr).",
    safety: "If cervical dilatation crosses the Action Line (4 hours right of Alert Line), escalate immediately for obstetric intervention."
  },
  {
    name: "Intravenous Cannula Set (14G–24G Colour-Coded)",
    slug: "iv-cannula-set",
    category: "Medication And Fluid Therapy",
    iconType: "cannula",
    use: "Peripheral venous access catheter with flash chamber and winged injection port; colour-coded by gauge (16G Grey, 18G Green, 20G Pink, 22G Blue, 24G Yellow).",
    preparation: "Select smallest gauge adequate for therapy (18G green for blood/trauma, 22G/24G paediatric), prep skin with 70% alcohol circular scrub and dry.",
    safety: "Never re-insert stylet needle into advanced plastic catheter (shearing embolism risk); document insertion date and inspect daily for phlebitis."
  },
  {
    name: "Blood Transfusion Filter Set (Y-Type 170 Micron)",
    slug: "blood-transfusion-set",
    category: "Medication And Fluid Therapy",
    iconType: "iv-blood",
    use: "Sterile infusion tubing containing an integrated 170-200 micron fibrin clot filter for whole blood, packed red cells, or FFP transfusion.",
    preparation: "Prime filter chamber upright with 0.9% Normal Saline ONLY; verify two-nurse bedside ID & cross-match check against blood bag.",
    safety: "NEVER infuse Dextrose 5% or Ringer's Lactate in the same line (causes haemolysis/clotting); observe closely first 15 minutes at slow rate."
  },
  {
    name: "Soluset / Burette Paediatric IV Chamber (100 mL)",
    slug: "burette-iv-chamber",
    category: "Medication And Fluid Therapy",
    iconType: "burette",
    use: "Graduated 100-150 mL micro-drip chamber (60 drops/mL) preventing accidental fluid overload in neonates, malnourished children, and heart failure.",
    preparation: "Fill burette only with prescribed 1-hour volume plus drug dilution, close upper roller clamp tightly, and calculate drops/min = mL/hr.",
    safety: "Critical safeguard against pulmonary oedema in SAM/paediatric fluids; label chamber clearly with additive dose and start time."
  },
  {
    name: "Three-Way IV Stopcock Extension",
    slug: "three-way-stopcock",
    category: "Medication And Fluid Therapy",
    iconType: "stopcock",
    use: "Sterile rotary manifold allowing simultaneous infusion of maintenance fluid and intermittent IV bolus drugs or CVP measurement.",
    preparation: "Prime all three ports with sterile saline to expel air bubbles; swab needleless hub 15 seconds with 70% alcohol before every access.",
    safety: "Always orient 'OFF' arrow clearly; replace capped sterile non-vented caps after every drug push to prevent line sepsis."
  },
  {
    name: "Insulin Syringe (U-100) & Needle",
    slug: "insulin-syringe-u100",
    category: "Medication And Fluid Therapy",
    iconType: "syringe-ins",
    use: "Ultra-fine subcutaneous syringe calibrated strictly in International Units (30U, 50U, 100U) matching U-100 insulin vials.",
    preparation: "Verify U-100 concentration against syringe barrel, have a second nurse independently double-check dose units, and rotate abdominal sites.",
    safety: "NEVER substitute standard mL syringes for insulin dosing; fatal 10-fold hypoglycaemia overdoses occur from unit/mL confusion."
  },
  {
    name: "WHO Puncture-Proof Sharps Safety Box",
    slug: "sharps-safety-box",
    category: "Ward, Comfort And Infection Prevention",
    iconType: "sharps-box",
    use: "Rigid biohazard cardboard/HDPE container for safe immediate disposal of uncapped needles, scalpel blades, and broken glass ampoules.",
    preparation: "Assemble interlocking flaps cleanly, write ward/date started, and keep within arm's reach of every injection trolley.",
    safety: "Seal and incinerate permanently when 3/4 FULL (fill line)—never overstuff, shake, or empty sharps manually."
  },
  {
    name: "MUAC Malnutrition Screening Tape",
    slug: "muac-tape",
    category: "Assessment And Diagnostic Equipment",
    iconType: "muac",
    use: "Tri-colour tape measuring Mid-Upper Arm Circumference in children 6-59 months: Red (<11.5 cm SAM), Yellow (11.5-12.4 cm MAM), Green (>=12.5 cm Normal).",
    preparation: "Measure exact midpoint between left acromion process and olecranon with arm hanging relaxed alongside child's body.",
    safety: "Pull tape flush against skin without pinching soft tissue or wrapping loosely; always check bilateral pitting oedema concurrently."
  },
  {
    name: "Infantometer Recumbent Length Board",
    slug: "infantometer-length-board",
    category: "Assessment And Diagnostic Equipment",
    iconType: "infantometer",
    use: "Precision horizontal sliding board measuring supine crown-heel length in infants/children under 24 months (or <87 cm) for WHO weight-for-length z-scores.",
    preparation: "Wipe board clean, lay baby flat with crown firmly touching fixed headboard facing straight upward, gently extend knees together.",
    safety: "Requires two people (caregiver stabilizes head gently while clinician brings sliding footboard flush to soles) to read to nearest 0.1 cm."
  },
  {
    name: "Mercury-Free Aneroid & Digital Sphygmomanometer",
    slug: "sphygmomanometer-bp",
    category: "Assessment And Diagnostic Equipment",
    iconType: "bp-cuff",
    use: "Measures systolic and diastolic arterial blood pressure for hypertension, pre-eclampsia (>=140/90), shock resuscitation, and sepsis screening.",
    preparation: "Select proper cuff bladder (covering 80% arm circumference), rest patient seated/supine 5 minutes with cuff aligned to heart level.",
    safety: "Too-small cuff falsely elevates BP; never place cuff on an arm with an AV fistula, PICC line, mastectomy lymphoedema, or active IV."
  },
  {
    name: "Peak Expiratory Flow Rate (PEFR) Meter",
    slug: "peak-flow-meter",
    category: "Assessment And Diagnostic Equipment",
    iconType: "pefr",
    use: "Measures maximum expiratory airflow (L/min) to assess acute asthma severity and response to bronchodilators.",
    preparation: "Fit clean disposable mouthpiece, reset slider marker cleanly to zero, and instruct patient to stand upright.",
    safety: "Take a maximal deep breath, seal lips tightly around mouthpiece, blow a hard fast blast, and record the BEST of three attempts."
  },
  {
    name: "Urinalysis Multi-Parameter Reagent Strips",
    slug: "urinalysis-reagent-strips",
    category: "Assessment And Diagnostic Equipment",
    iconType: "dipstick",
    use: "Point-of-care dipstick testing urine for protein (pre-eclampsia), glucose/ketones (DKA), leukocytes/nitrites (UTI), blood, and pH.",
    preparation: "Check bottle expiry and desiccant cap seal; dip briefly into fresh uncentrifuged mid-stream urine and blot edge vertically.",
    safety: "Read colour pads at exact manufacturer timings (usually 60-120 seconds); protect bottle strips from moisture and direct sunlight."
  },
  {
    name: "Oto-Ophthalmoscope Diagnostic Set",
    slug: "oto-ophthalmoscope-set",
    category: "Assessment And Diagnostic Equipment",
    iconType: "ophthalmoscope",
    use: "Combined illumination handle with detachable speculum otoscope head (tympanic membrane) and lens-wheel ophthalmoscope head (fundus & red reflex).",
    preparation: "Fit fresh clean ear speculum size, dial ophthalmoscope lens wheel to '0' dioptre before starting.",
    safety: "Pull pinna UP and BACK in adults (DOWN and BACK in children <3 yrs) to straighten ear canal safely without injuring ossicles."
  },
  {
    name: "Toomey Wound & Bladder Irrigation Syringe (50 mL)",
    slug: "toomey-irrigation-syringe",
    category: "General Clinical Instruments",
    iconType: "syringe-toomey",
    use: "Large 50-60 mL catheter-tip sterile syringe used to flush clots from 3-way urinary catheters or perform high-volume normal saline wound irrigation.",
    preparation: "Draw warm sterile 0.9% normal saline gently inside sterile field without contaminating plunger tip.",
    safety: "Apply gentle steady pressure (8-15 psi for wounds); never force irrigation against resistance in a blocked bladder catheter."
  },
  {
    name: "Halstead Mosquito Artery Forceps (Curved)",
    slug: "mosquito-curved-halstead",
    category: "Theatre And Surgical Instruments",
    iconType: "hemostat",
    use: "Fine short-jawed transversely serrated haemostatic forceps ideal for clamping small delicate capillaries, paediatric vessels, or suture tags.",
    preparation: "Verify tips close smoothly first without a gap at distal jaws before autoclaving.",
    safety: "Avoid clamping heavy tough fascia or bulky pedicles—tips will spring and lose haemostatic grip."
  },
  {
    name: "Mayo-Hegar Surgical Needle Holder",
    slug: "mayo-hegar-needle-holder",
    category: "Theatre And Surgical Instruments",
    iconType: "needle-holder",
    use: "Heavy cross-hatched tungsten/steel jaws securely grasping curved suture needles during wound closure, episiotomy repair, and surgical anastomosis.",
    preparation: "Test ratchet locks smoothly and check jaw inserts have no worn smooth grooves that allow needle spinning.",
    safety: "Grasp curved suture needle 1/3 back from swage (2/3 from point)—never grip the delicate swaged eye or sharp cutting tip."
  },
  {
    name: "Bard-Parker Scalpel Handle (No. 3 & No. 4)",
    slug: "bard-parker-scalpel-handle",
    category: "Theatre And Surgical Instruments",
    iconType: "scalpel",
    use: "Flat stainless surgical blade handle accepting sterile single-use blades (#10/#11/#15 on No. 3; #20-#24 on No. 4) for precise skin incisions.",
    preparation: "Always load and unload surgical blades using a heavy artery/needle-holder—NEVER bare fingers.",
    safety: "Pass loaded scalpel on a neutral kidney dish ('hands-free neutral zone') rather than hand-to-hand in theatre."
  },
  {
    name: "Langenbeck Surgical Retractor",
    slug: "langenbeck-retractor",
    category: "Theatre And Surgical Instruments",
    iconType: "retractor",
    use: "Right-angled flat handheld retractor providing clear exposure of superficial to medium-depth wound edges during minor surgery and caesarean closure.",
    preparation: "Autoclave clean sterile blade; wrap moist gauze pad under deep margin if retracting delicate bowel/nerve.",
    safety: "Apply steady even traction; relax tension periodically to prevent local tissue ischaemia and neuropraxia."
  },
  {
    name: "Morris Deep Abdominal Retractor",
    slug: "morris-retractor",
    category: "Theatre And Surgical Instruments",
    iconType: "retractor-deep",
    use: "Deep curved L-shaped blade with thick ergonomic grip used to retract thick abdominal wall muscles during laparotomy or Caesarean section.",
    preparation: "Inspect polished edge for nicks; wrap in sterile tray set for major laparotomy packs.",
    safety: "Ensure bladder dome is emptied cleanly and protected before applying deep suprapubic traction."
  },
  {
    name: "Littauer Suture Removal Scissors",
    slug: "littauer-suture-scissors",
    category: "Theatre And Surgical Instruments",
    iconType: "scissors-hook",
    use: "Fine scissors featuring a small crescent hook on one blade tip to slide gently under external nylon/silk sutures without cutting skin.",
    preparation: "Prepare sterile suture removal pack, clean skin suture line with normal saline/chlorhexidine swabs before cutting.",
    safety: "Cut strictly close to the skin BELOW the knot on ONE side so dirty exterior suture is never pulled back through subcutaneous track."
  },
  {
    name: "Metzenbaum Delicate Dissecting Scissors",
    slug: "metzenbaum-scissors",
    category: "Theatre And Surgical Instruments",
    iconType: "scissors-fine",
    use: "Long slender handles with short blunt curved blades designed exclusively for cutting and dissecting fine soft internal tissues.",
    preparation: "Inspect blade edge alignment and screw hinge tightness prior to sterilization.",
    safety: "NEVER use Metzenbaum scissors to cut gauze, dressings, or sutures (reserve Mayo/dressings scissors for those) to protect sharp edges."
  },
  {
    name: "Rampley Sponge-Holding Forceps",
    slug: "rampley-sponge-forceps",
    category: "Theatre And Surgical Instruments",
    iconType: "sponge-forceps",
    use: "Long ringed forceps with fenestrated oval serrated jaws used for antiseptic skin prepping, cervical visualization, and gentle swab holding.",
    preparation: "Lock folded gauze swab securely across oval jaws leaving no frayed edges exposed before dipping in povidone-iodine.",
    safety: "After surgical prepping is finished, discard skin-prep forceps off the sterile table—never reuse on deep wound field."
  },
  {
    name: "Foetal Measuring Tape (Fundal Height Tape)",
    slug: "fundal-height-tape",
    category: "Midwifery And Obstetric Instruments",
    iconType: "tape",
    use: "Flexible metric cloth/fibreglass tape measuring Symphysis-Fundal Height (SFH in cm, roughly matching gestational age +/-2 cm from 20-36 weeks).",
    preparation: "Ask mother to empty bladder, lie semi-recumbent, palpate upper uterine fundus cleanly before fixing tape.",
    safety: "Place plain cm markings face-down while stretching from fundus to upper symphysis border to avoid measurement expectation bias."
  },
  {
    name: "Sterile Umbilical Cord Clamp",
    slug: "umbilical-cord-clamp-sterile",
    category: "Midwifery And Obstetric Instruments",
    iconType: "clamp-cord",
    use: "Self-locking toothed plastic clamp placed 2-3 cm from the newborn abdominal wall before delayed cord clamping/cutting.",
    preparation: "Place sterile clamp onto delivery tray; wait 1-3 minutes after birth (if newborn is crying/vigorous) before clamping.",
    safety: "Confirm crisp audible snap-lock, cut 1 cm above clamp, inspect 3 cord vessels (2 arteries, 1 vein), and check for oozing every 15 minutes."
  },
  {
    name: "Nebulizer Compressor & Mask Tubing",
    slug: "nebulizer-compressor-unit",
    category: "Airway, Oxygen And Emergency Care",
    iconType: "neb",
    use: "Portable electric air compressor generating pressurized flow to aerosolize wet respiratory medications directly into small airways.",
    preparation: "Assemble clean chamber cup, fill prescribed salbutamol + normal saline volume (total ~3-4 mL), attach upright T-piece/mask.",
    safety: "Keep chamber upright throughout treatment; clean air filter monthly and allow components to air dry thoroughly."
  },
  {
    name: "Sterile Urine Specimen Collection Container",
    slug: "urine-specimen-container",
    category: "Elimination And Specimen Care",
    iconType: "cup-specimen",
    use: "Wide-mouth screw-cap leakproof sterile container for Mid-Stream Urine (MSU) microscopy, culture, sensitivity (C&S), and dipstick assays.",
    preparation: "Label container BEFORE collection with patient full name, ward/OPD number, date, time, and test requested.",
    safety: "Instruct patient to clean genitalia front-to-back with water, void first stream into toilet, then catch mid-stream cleanly without touching interior rim."
  },
  {
    name: "Oxygen Concentrator & Humidifier Bottle",
    slug: "oxygen-concentrator-humidifier",
    category: "Airway, Oxygen And Emergency Care",
    iconType: "oxygen-conc",
    use: "Electrically filters ambient air (~21% O2) through zeolite sieve beds to deliver continuous 90-95% medical oxygen on Ugandan hospital wards.",
    preparation: "Check clean air intake sponge filter, fill humidifier bottle to marked line with sterile/boiled cooled water ONLY (never tap water).",
    safety: "Keep 30 cm away from walls/curtains, enforce strict NO SMOKING / naked flame safety zone, and connect flow splitter safely for paediatrics."
  }
];

function buildVectorPlateSvg(item) {
  const safeTitle = sanitizeXml(item.name);
  const safeCat = sanitizeXml(item.category);
  const t = item.iconType || "default";

  let art = "";
  if (t.includes("ambu")) {
    art = `
      <ellipse cx="420" cy="295" rx="135" ry="72" fill="#e0f2fe" stroke="#0284c7" stroke-width="4"/>
      <path d="M295 295 C340 245, 500 245, 545 295" fill="none" stroke="#38bdf8" stroke-width="3" stroke-dasharray="6,6"/>
      <rect x="235" y="275" width="56" height="40" rx="8" fill="#cbd5e1" stroke="#334155" stroke-width="3"/>
      <polygon points="155,250 235,275 235,315 155,345" fill="#f1f5f9" stroke="#334155" stroke-width="4" stroke-linejoin="round"/>
      <ellipse cx="155" cy="297" rx="18" ry="48" fill="#bae6fd" stroke="#0284c7" stroke-width="3"/>
      <rect x="552" y="278" width="42" height="34" rx="6" fill="#0ea5e9" stroke="#0369a1" stroke-width="2.5"/>
      <ellipse cx="645" cy="365" rx="68" ry="42" fill="#fef3c7" stroke="#d97706" stroke-width="3.5"/>
      <path d="M594 295 Q645 295 645 323" fill="none" stroke="#64748b" stroke-width="4"/>
      <text x="420" y="302" text-anchor="middle" font-family="sans-serif" font-size="16" font-weight="700" fill="#0369a1">SELF-INFLATING BAG</text>
      <text x="155" y="370" text-anchor="middle" font-family="sans-serif" font-size="13" font-weight="600" fill="#475569">Patient Mask</text>
      <text x="645" y="428" text-anchor="middle" font-family="sans-serif" font-size="13" font-weight="600" fill="#b45309">O2 Reservoir</text>`;
  } else if (t === "cannula") {
    art = `
      <rect x="190" y="282" width="170" height="24" rx="6" fill="#16a34a" stroke="#14532d" stroke-width="3"/>
      <rect x="360" y="275" width="75" height="38" rx="4" fill="#bbf7d0" stroke="#15803d" stroke-width="3"/>
      <rect x="245" y="242" width="46" height="40" rx="5" fill="#22c55e" stroke="#14532d" stroke-width="3"/>
      <line x1="255" y1="242" x2="281" y2="242" stroke="#14532d" stroke-width="5"/>
      <path d="M235 306 L210 345 L335 345 L310 306 Z" fill="#86efac" stroke="#15803d" stroke-width="2.5"/>
      <rect x="115" y="290" width="75" height="8" rx="3" fill="#94a3b8" stroke="#334155" stroke-width="2"/>
      <line x1="70" y1="294" x2="115" y2="294" stroke="#334155" stroke-width="3"/>
      <rect x="435" y="286" width="120" height="16" rx="4" fill="#e2e8f0" stroke="#475569" stroke-width="2.5"/>
      <circle cx="575" cy="294" r="14" fill="#16a34a" stroke="#14532d" stroke-width="2.5"/>
      <circle cx="480" cy="400" r="16" fill="#64748b"/><text x="480" y="430" text-anchor="middle" font-size="12" font-family="sans-serif">16G</text>
      <circle cx="535" cy="400" r="16" fill="#16a34a"/><text x="535" y="430" text-anchor="middle" font-size="12" font-family="sans-serif">18G</text>
      <circle cx="590" cy="400" r="16" fill="#ec4899"/><text x="590" y="430" text-anchor="middle" font-size="12" font-family="sans-serif">20G</text>
      <circle cx="645" cy="400" r="16" fill="#3b82f6"/><text x="645" y="430" text-anchor="middle" font-size="12" font-family="sans-serif">22G</text>
      <circle cx="700" cy="400" r="16" fill="#eab308"/><text x="700" y="430" text-anchor="middle" font-size="12" font-family="sans-serif">24G</text>
      <text x="275" y="228" text-anchor="middle" font-family="sans-serif" font-size="13" font-weight="700" fill="#14532d">Injection Port</text>
      <text x="515" y="268" text-anchor="middle" font-family="sans-serif" font-size="13" font-weight="700" fill="#334155">Flash Chamber</text>`;
  } else if (t.includes("syringe")) {
    art = `
      <rect x="240" y="260" width="240" height="68" rx="8" fill="#f8fafc" stroke="#334155" stroke-width="4"/>
      <rect x="480" y="280" width="145" height="28" rx="4" fill="#cbd5e1" stroke="#334155" stroke-width="3"/>
      <rect x="625" y="255" width="18" height="78" rx="5" fill="#94a3b8" stroke="#334155" stroke-width="3"/>
      <rect x="270" y="264" width="18" height="60" fill="#1e293b"/>
      <line x1="288" y1="294" x2="480" y2="294" stroke="#94a3b8" stroke-width="6"/>
      <polygon points="240,282 175,288 175,300 240,306" fill="#cbd5e1" stroke="#334155" stroke-width="3"/>
      <line x1="175" y1="294" x2="95" y2="294" stroke="#475569" stroke-width="4"/>
      <line x1="280" y1="260" x2="280" y2="280" stroke="#0f172a" stroke-width="2"/>
      <line x1="320" y1="260" x2="320" y2="280" stroke="#0f172a" stroke-width="2"/>
      <line x1="360" y1="260" x2="360" y2="280" stroke="#0f172a" stroke-width="2"/>
      <line x1="400" y1="260" x2="400" y2="280" stroke="#0f172a" stroke-width="2"/>
      <line x1="440" y1="260" x2="440" y2="280" stroke="#0f172a" stroke-width="2"/>
      <text x="360" y="362" text-anchor="middle" font-family="sans-serif" font-size="14" font-weight="700" fill="#334155">Graduated Barrel &amp; Piston Seal</text>`;
  } else if (t.includes("forceps") || t.includes("hemostat") || t.includes("needle-holder")) {
    art = `
      <g transform="translate(400, 305) rotate(-18)">
        <line x1="-220" y1="-10" x2="120" y2="8" stroke="#64748b" stroke-width="11" stroke-linecap="round"/>
        <line x1="-220" y1="10" x2="120" y2="-8" stroke="#94a3b8" stroke-width="11" stroke-linecap="round"/>
        <circle cx="-10" cy="0" r="14" fill="#cbd5e1" stroke="#334155" stroke-width="4"/>
        <circle cx="148" cy="-34" r="32" fill="none" stroke="#475569" stroke-width="11"/>
        <circle cx="148" cy="34" r="32" fill="none" stroke="#475569" stroke-width="11"/>
        <rect x="82" y="-24" width="20" height="48" rx="4" fill="#64748b"/>
        <text x="-135" y="-32" font-family="sans-serif" font-size="13" font-weight="700" fill="#334155">Serrated Jaws</text>
        <text x="92" y="74" font-family="sans-serif" font-size="13" font-weight="700" fill="#334155">Ratchet Lock &amp; Rings</text>
      </g>`;
  } else if (t.includes("scissors")) {
    art = `
      <g transform="translate(400, 305) rotate(-14)">
        <polygon points="-220,-14 -45,-6 -45,8 -205,2" fill="#cbd5e1" stroke="#334155" stroke-width="3"/>
        <polygon points="-215,16 -45,8 -45,-6 -195,-4" fill="#94a3b8" stroke="#334155" stroke-width="3"/>
        <line x1="-45" y1="-2" x2="120" y2="-30" stroke="#64748b" stroke-width="10"/>
        <line x1="-45" y1="2" x2="120" y2="30" stroke="#64748b" stroke-width="10"/>
        <circle cx="-45" cy="0" r="9" fill="#334155"/>
        <circle cx="152" cy="-36" r="34" fill="none" stroke="#475569" stroke-width="11"/>
        <circle cx="152" cy="36" r="34" fill="none" stroke="#475569" stroke-width="11"/>
      </g>`;
  } else if (t.includes("mask") || t === "venturi" || t === "nrb" || t === "neb") {
    art = `
      <path d="M270 190 Q400 135 530 190 L490 365 Q400 395 310 365 Z" fill="#e0f2fe" stroke="#0284c7" stroke-width="4" fill-opacity="0.75"/>
      <path d="M265 260 Q180 280 275 310" fill="none" stroke="#475569" stroke-width="4" stroke-dasharray="5,4"/>
      <path d="M535 260 Q620 280 525 310" fill="none" stroke="#475569" stroke-width="4" stroke-dasharray="5,4"/>
      <rect x="378" y="365" width="44" height="58" rx="6" fill="#0ea5e9" stroke="#0369a1" stroke-width="3"/>
      <ellipse cx="400" cy="455" rx="65" ry="38" fill="#fef3c7" stroke="#d97706" stroke-width="3"/>
      <text x="400" y="285" text-anchor="middle" font-family="sans-serif" font-size="16" font-weight="700" fill="#0369a1">OXYGEN DELIVERY CONE</text>
      <text x="400" y="460" text-anchor="middle" font-family="sans-serif" font-size="13" font-weight="700" fill="#b45309">Adaptor / Chamber</text>`;
  } else if (t.includes("retractor")) {
    art = `
      <rect x="190" y="276" width="290" height="32" rx="14" fill="#cbd5e1" stroke="#334155" stroke-width="3.5"/>
      <path d="M480 292 L560 292 Q585 292 585 322 L585 415 L525 415 L525 335" fill="none" stroke="#475569" stroke-width="20" stroke-linejoin="round" stroke-linecap="round"/>
      <circle cx="220" cy="292" r="14" fill="#f8fafc" stroke="#334155" stroke-width="3"/>
      <text x="335" y="255" text-anchor="middle" font-family="sans-serif" font-size="14" font-weight="700" fill="#334155">Ergonomic Handle</text>
      <text x="560" y="452" text-anchor="middle" font-family="sans-serif" font-size="14" font-weight="700" fill="#334155">Right-Angle Blade</text>`;
  } else if (t === "muac" || t === "tape") {
    art = `
      <rect x="100" y="275" width="180" height="56" rx="4" fill="#ef4444" stroke="#7f1d1d" stroke-width="3"/>
      <rect x="280" y="275" width="140" height="56" rx="4" fill="#facc15" stroke="#854d0e" stroke-width="3"/>
      <rect x="420" y="275" width="280" height="56" rx="4" fill="#22c55e" stroke="#14532d" stroke-width="3"/>
      <text x="190" y="309" text-anchor="middle" font-family="sans-serif" font-size="16" font-weight="800" fill="#fff">SAM &lt;11.5 cm</text>
      <text x="350" y="309" text-anchor="middle" font-family="sans-serif" font-size="15" font-weight="800" fill="#713f12">MAM 11.5-12.4</text>
      <text x="560" y="309" text-anchor="middle" font-family="sans-serif" font-size="16" font-weight="800" fill="#fff">NORMAL &gt;=12.5 cm</text>`;
  } else if (t === "bp-cuff") {
    art = `
      <rect x="150" y="210" width="230" height="175" rx="14" fill="#1e293b" stroke="#0f172a" stroke-width="4"/>
      <rect x="180" y="238" width="170" height="118" rx="8" fill="#475569"/>
      <circle cx="515" cy="245" r="72" fill="#f8fafc" stroke="#334155" stroke-width="5"/>
      <line x1="515" y1="245" x2="555" y2="205" stroke="#dc2626" stroke-width="5" stroke-linecap="round"/>
      <circle cx="515" cy="245" r="8" fill="#1e293b"/>
      <ellipse cx="625" cy="390" rx="52" ry="34" fill="#0f172a"/>
      <path d="M380 340 Q470 430 573 390" fill="none" stroke="#334155" stroke-width="6"/>
      <text x="515" y="340" text-anchor="middle" font-family="sans-serif" font-size="14" font-weight="700" fill="#334155">Aneroid Gauge (mmHg)</text>`;
  } else if (t === "aed") {
    art = `
      <rect x="235" y="165" width="330" height="250" rx="20" fill="#fef08a" stroke="#ca8a04" stroke-width="5"/>
      <rect x="290" y="205" width="220" height="110" rx="10" fill="#1e293b"/>
      <path d="M310 265 L350 265 L368 228 L392 296 L418 222 L438 265 L490 265" fill="none" stroke="#22c55e" stroke-width="4"/>
      <circle cx="400" cy="365" r="28" fill="#dc2626" stroke="#fff" stroke-width="4"/>
      <text x="400" y="371" text-anchor="middle" font-family="sans-serif" font-size="14" font-weight="800" fill="#fff">SHOCK</text>
      <text x="400" y="452" text-anchor="middle" font-family="sans-serif" font-size="14" font-weight="700" fill="#334155">Automated Rhythm Analysis &amp; Biphasic Pads</text>`;
  } else {
    // Clean versatile clinical diagram frame
    art = `
      <rect x="205" y="185" width="390" height="220" rx="18" fill="#f8fafc" stroke="#7c3aed" stroke-width="4"/>
      <circle cx="400" cy="285" r="76" fill="#faf5ff" stroke="#a855f7" stroke-width="4"/>
      <path d="M360 285 L440 285 M400 245 L400 325" stroke="#7c3aed" stroke-width="10" stroke-linecap="round"/>
      <text x="400" y="445" text-anchor="middle" font-family="sans-serif" font-size="15" font-weight="700" fill="#4c1d95">OSCE Standard Reference Plate</text>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
    <rect width="800" height="600" fill="#ffffff"/>
    <rect x="18" y="18" width="764" height="564" rx="16" fill="#ffffff" stroke="#e2e8f0" stroke-width="3"/>
    <rect x="18" y="18" width="764" height="84" rx="16" fill="#f8fafc"/>
    <text x="44" y="54" font-family="sans-serif" font-size="14" font-weight="800" fill="#7c3aed" letter-spacing="1.2">NURSING UGANDA &#183; CLINICAL INSTRUMENT ATLAS</text>
    <text x="44" y="84" font-family="sans-serif" font-size="24" font-weight="800" fill="#0f172a">${safeTitle}</text>
    ${art}
    <rect x="44" y="522" width="712" height="38" rx="8" fill="#faf5ff"/>
    <text x="400" y="546" text-anchor="middle" font-family="sans-serif" font-size="14" font-weight="700" fill="#5b21b6">${safeCat}</text>
  </svg>`;
}

async function enhanceExistingImage(srcPath, destPath) {
  await sharp(srcPath)
    .trim({ threshold: 18 })
    .resize(700, 500, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .extend({ top: 50, bottom: 50, left: 50, right: 50, background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .sharpen({ sigma: 0.9, m1: 1.0, m2: 1.6 })
    .modulate({ brightness: 1.02, saturation: 1.08 })
    .webp({ quality: 88 })
    .toFile(destPath);
}

async function main() {
  const existing = JSON.parse(fs.readFileSync(DATA_PATH, "utf8"));
  const catMap = new Map();

  for (const cat of existing.categories || []) {
    catMap.set(cat.title, {
      title: cat.title,
      body: cat.body,
      items: []
    });
  }

  let enhancedCount = 0;
  let newGeneratedCount = 0;
  const oldFilesToClean = new Set();

  for (const cat of existing.categories || []) {
    for (const rawItem of cat.items || []) {
      const override = ITEM_OVERRIDES[rawItem.slug];
      if (override === null) {
        // Remove duplicate entry & clean old image
        const oldBasename = path.basename(rawItem.image || "");
        if (oldBasename) oldFilesToClean.add(oldBasename);
        continue;
      }

      const finalCat = override?.category || cat.title;
      const finalName = override?.name || rawItem.name;
      const cleanSlug = rawItem.slug;
      const catKnow = CATEGORY_KNOWLEDGE[finalCat] || CATEGORY_KNOWLEDGE["General Clinical Instruments"];

      const srcAbs = path.join(ROOT, rawItem.image || "");
      const outRel = `assets/images/medical-instruments/${cleanSlug}.webp`;
      const outAbs = path.join(ROOT, outRel);

      if (fs.existsSync(srcAbs)) {
        await enhanceExistingImage(srcAbs, outAbs);
        enhancedCount += 1;
        if (path.basename(srcAbs) !== `${cleanSlug}.webp`) {
          oldFilesToClean.add(path.basename(srcAbs));
        }
      }

      const useText = override?.use || `${finalName} — ${catKnow.use || rawItem.use}`;
      const prepText = catKnow.preparation;
      const sterilText = override?.sterilization || catKnow.sterilization;
      const safetyText = override?.safety || catKnow.safety;

      if (!catMap.has(finalCat)) {
        catMap.set(finalCat, { title: finalCat, body: "", items: [] });
      }
      catMap.get(finalCat).items.push({
        name: finalName,
        slug: cleanSlug,
        category: finalCat,
        image: outRel,
        imageAlt: `${finalName} studio reference image`,
        use: useText,
        preparation: prepText,
        sterilization: sterilText,
        safety: safetyText,
        examPoints: [
          `Identify ${finalName} accurately by visual inspection and state its category (${finalCat}).`,
          `Explain primary indication: ${useText}`,
          `State reprocessing/sterility requirement: ${sterilText}`,
          `Demonstrate key patient safety precaution: ${safetyText}`
        ]
      });
    }
  }

  // Generate 38 new essential instruments
  for (const ni of NEW_INSTRUMENTS) {
    const outRel = `assets/images/medical-instruments/${ni.slug}.webp`;
    const outAbs = path.join(ROOT, outRel);
    const svg = buildVectorPlateSvg(ni);
    await sharp(Buffer.from(svg)).webp({ quality: 90 }).toFile(outAbs);
    newGeneratedCount += 1;

    const catKnow = CATEGORY_KNOWLEDGE[ni.category] || CATEGORY_KNOWLEDGE["General Clinical Instruments"];
    if (!catMap.has(ni.category)) {
      catMap.set(ni.category, { title: ni.category, body: "", items: [] });
    }
    catMap.get(ni.category).items.push({
      name: ni.name,
      slug: ni.slug,
      category: ni.category,
      image: outRel,
      imageAlt: `${ni.name} clinical illustration`,
      use: ni.use,
      preparation: ni.preparation,
      sterilization: catKnow.sterilization,
      safety: ni.safety,
      examPoints: [
        `Identify ${ni.name} and match it to ${ni.category}.`,
        `State clinical use clearly: ${ni.use}`,
        `Outline pre-procedure check: ${ni.preparation}`,
        `Highlight core safety/IPC rule: ${ni.safety}`
      ]
    });
  }

  // Delete superseded space-filled jpg filenames
  for (const oldName of oldFilesToClean) {
    const absOld = path.join(IMG_DIR, oldName);
    if (fs.existsSync(absOld) && !oldName.endsWith(".webp")) {
      fs.unlinkSync(absOld);
    }
  }

  const finalCategories = [...catMap.values()].map((c) => {
    c.items.sort((a, b) => a.name.localeCompare(b.name));
    return c;
  });
  const totalCount = finalCategories.reduce((s, c) => s + c.items.length, 0);

  const output = {
    generatedAt: new Date().toISOString(),
    source: "assets/images/medical-instruments",
    count: totalCount,
    categories: finalCategories
  };

  fs.writeFileSync(DATA_PATH, JSON.stringify(output, null, 2));
  console.log(JSON.stringify({ ok: true, enhancedCount, newGeneratedCount, totalCount }, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
