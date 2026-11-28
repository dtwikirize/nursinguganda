/**
 * High-Yield Bedside Clinical Calculators & Decision Engines
 * Aligned with WHO, NICE, UK Royal College of Physicians (NEWS2),
 * and NCSBN / Saunders 9th Edition NCLEX-RN standards.
 */

/**
 * 1. National Early Warning Score 2 (NEWS2) Calculator
 * Standard bedside clinical deterioration scoring system.
 */
export function computeNews2({
  rr,
  spo2,
  spo2Scale = "scale1", // "scale1" (Standard 96%+) | "scale2" (Target 88-92% Hypercapnic/COPD)
  onOxygen = false,
  sbp,
  pulse,
  consciousness = "alert", // "alert" | "cvpu" (Confusion, Voice, Pain, Unresponsive)
  temp
}) {
  const parseNum = (v) => (v !== undefined && v !== null && v !== "" && !isNaN(Number(v)) ? Number(v) : null);

  const numRr = parseNum(rr);
  const numSpo2 = parseNum(spo2);
  const numSbp = parseNum(sbp);
  const numPulse = parseNum(pulse);
  const numTemp = parseNum(temp);

  // If missing primary vitals, return incomplete state
  if (numRr === null || numSpo2 === null || numSbp === null || numPulse === null || numTemp === null) {
    return null;
  }

  // 1. Respiration Rate Score (breaths/min)
  let rrScore = 0;
  if (numRr <= 8) rrScore = 3;
  else if (numRr >= 9 && numRr <= 11) rrScore = 1;
  else if (numRr >= 12 && numRr <= 20) rrScore = 0;
  else if (numRr >= 21 && numRr <= 24) rrScore = 2;
  else if (numRr >= 25) rrScore = 3;

  // 2. Oxygen Saturation Score (%)
  let spo2Score = 0;
  if (spo2Scale === "scale2") {
    // Hypercapnic respiratory failure (target 88-92%)
    if (numSpo2 <= 83) spo2Score = 3;
    else if (numSpo2 >= 84 && numSpo2 <= 85) spo2Score = 2;
    else if (numSpo2 >= 86 && numSpo2 <= 87) spo2Score = 1;
    else if (numSpo2 >= 88 && numSpo2 <= 92) spo2Score = 0;
    else if (numSpo2 >= 93 && numSpo2 <= 94) spo2Score = onOxygen ? 1 : 0;
    else if (numSpo2 >= 95 && numSpo2 <= 96) spo2Score = onOxygen ? 2 : 0;
    else if (numSpo2 >= 97) spo2Score = onOxygen ? 3 : 0;
  } else {
    // Scale 1 - Standard acute admissions
    if (numSpo2 <= 91) spo2Score = 3;
    else if (numSpo2 >= 92 && numSpo2 <= 93) spo2Score = 2;
    else if (numSpo2 >= 94 && numSpo2 <= 95) spo2Score = 1;
    else if (numSpo2 >= 96) spo2Score = 0;
  }

  // 3. Supplemental Oxygen Score
  const oxygenScore = onOxygen ? 2 : 0;

  // 4. Systolic Blood Pressure Score (mmHg)
  let sbpScore = 0;
  if (numSbp <= 90) sbpScore = 3;
  else if (numSbp >= 91 && numSbp <= 100) sbpScore = 2;
  else if (numSbp >= 101 && numSbp <= 110) sbpScore = 1;
  else if (numSbp >= 111 && numSbp <= 219) sbpScore = 0;
  else if (numSbp >= 220) sbpScore = 3;

  // 5. Pulse Rate Score (bpm)
  let pulseScore = 0;
  if (numPulse <= 40) pulseScore = 3;
  else if (numPulse >= 41 && numPulse <= 50) pulseScore = 1;
  else if (numPulse >= 51 && numPulse <= 90) pulseScore = 0;
  else if (numPulse >= 91 && numPulse <= 110) pulseScore = 1;
  else if (numPulse >= 111 && numPulse <= 130) pulseScore = 2;
  else if (numPulse >= 131) pulseScore = 3;

  // 6. Consciousness Score (ACVPU)
  const consciousnessScore = consciousness === "cvpu" ? 3 : 0;

  // 7. Temperature Score (°C)
  let tempScore = 0;
  if (numTemp <= 35.0) tempScore = 3;
  else if (numTemp >= 35.1 && numTemp <= 36.0) tempScore = 1;
  else if (numTemp >= 36.1 && numTemp <= 38.0) tempScore = 0;
  else if (numTemp >= 38.1 && numTemp <= 39.0) tempScore = 1;
  else if (numTemp >= 39.1) tempScore = 2;

  const totalScore = rrScore + spo2Score + oxygenScore + sbpScore + pulseScore + consciousnessScore + tempScore;
  const hasExtremeSingleParam = [rrScore, spo2Score, oxygenScore, sbpScore, pulseScore, consciousnessScore, tempScore].some((s) => s === 3);

  let riskTier = "Low Risk";
  let colorHex = "#059669"; // Green
  let frequency = "Minimum 4 to 6 hourly monitoring";
  let escalationAction = "Ward-based nurse review. Continue observations; escalate to senior nurse if score increases.";

  if (totalScore === 0) {
    riskTier = "Zero Risk (Normal Range)";
    colorHex = "#059669";
    frequency = "Minimum 12-hourly ward monitoring";
    escalationAction = "Continue routine ward-based observations and clinical assessment.";
  } else if (totalScore >= 1 && totalScore <= 4) {
    if (hasExtremeSingleParam) {
      riskTier = "Low-Medium Risk (Single Score 3)";
      colorHex = "#d97706"; // Amber
      frequency = "Minimum 1-hourly ward monitoring";
      escalationAction = "Urgent review by registered nurse to assess need to escalate to attending medical team.";
    } else {
      riskTier = "Low Risk (Scores 1–4)";
      colorHex = "#059669";
      frequency = "Minimum 4 to 6 hourly monitoring";
      escalationAction = "Ward-based nurse review. Continue observations; escalate if score increases.";
    }
  } else if (totalScore >= 5 && totalScore <= 6) {
    riskTier = "Medium Risk (Scores 5–6)";
    colorHex = "#d97706"; // Amber
    frequency = "Minimum 1-hourly continuous monitoring";
    escalationAction = "Urgent review by ward doctor or acute medical team within 30-60 mins. Consider HDU escalation.";
  } else if (totalScore >= 7) {
    riskTier = "High Risk (Emergency Deterioration)";
    colorHex = "#dc2626"; // Red
    frequency = "Continuous vital signs telemetry monitoring";
    escalationAction = "IMMEDIATE EMERGENCY RESPONSE: Call Critical Care Outreach / Medical Emergency Team (MET). Prepare for ICU transfer and airway/circulation stabilization.";
  }

  return {
    totalScore,
    riskTier,
    colorHex,
    frequency,
    escalationAction,
    breakdown: {
      rrScore,
      spo2Score,
      oxygenScore,
      sbpScore,
      pulseScore,
      consciousnessScore,
      tempScore
    }
  };
}

/**
 * 2. Parkland Burn Fluid Resuscitation Calculator
 * 4 mL × Body Weight (kg) × % TBSA (2nd & 3rd degree burns)
 */
export function computeParkland({ weightKg, tbsa, elapsedHours = 0 }) {
  const w = parseFloat(weightKg);
  const t = parseFloat(tbsa);
  const el = parseFloat(elapsedHours) || 0;

  if (!w || w <= 0 || !t || t <= 0 || t > 100) return null;
  if (el < 0 || el >= 8) return null;

  const total24hMl = Math.round(4 * w * t);
  const first8hTotalMl = Math.round(total24hMl / 2);
  const next16hTotalMl = Math.round(total24hMl / 2);

  const remainingFirst8h = Math.max(0.5, 8 - el);
  const first8hRateMlHr = Math.round(first8hTotalMl / remainingFirst8h);
  const next16hRateMlHr = Math.round(next16hTotalMl / 16);

  const adultMinUrineMlHr = Math.round(w * 0.5);
  const adultMaxUrineMlHr = Math.round(w * 1.0);
  const paedMinUrineMlHr = Math.round(w * 1.0);
  const paedMaxUrineMlHr = Math.round(w * 1.5);

  return {
    total24hMl,
    first8hTotalMl,
    next16hTotalMl,
    remainingFirst8h: Number(remainingFirst8h.toFixed(1)),
    first8hRateMlHr,
    next16hRateMlHr,
    adultUrineTarget: `${adultMinUrineMlHr} – ${adultMaxUrineMlHr} mL/hr (0.5 – 1.0 mL/kg/hr)`,
    paedUrineTarget: `${paedMinUrineMlHr} – ${paedMaxUrineMlHr} mL/hr (1.0 – 1.5 mL/kg/hr)`,
    fluidChoice: "Lactated Ringer's (Hartmann's Solution)",
    clinicalWarning:
      el > 0
        ? `Patient arrived ${el} hour(s) post-burn. The first 8-hour volume must be completed in the remaining ${remainingFirst8h.toFixed(1)} hours!`
        : "The first 8 hours start strictly from the TIME OF INJURY, not hospital admission time."
  };
}

/**
 * 3. Arterial Blood Gas (ABG) & ROME Interpreter
 * Analyzes pH, PaCO2, HCO3-, and optional PaO2.
 */
export function computeAbg({ ph, paco2, hco3, pao2 }) {
  const vPh = parseFloat(ph);
  const vPaco2 = parseFloat(paco2);
  const vHco3 = parseFloat(hco3);
  const vPao2 = parseFloat(pao2);

  if (!vPh || !vPaco2 || !vHco3) return null;

  // Normal ranges
  // pH: 7.35 - 7.45 (mid 7.40)
  // PaCO2: 35 - 45 mmHg
  // HCO3: 22 - 26 mEq/L
  // PaO2: 80 - 100 mmHg

  let primaryDisorder = "";
  let compensation = "";
  let badgeColor = "#059669";
  let causes = [];
  let nursingActions = [];

  const isAcidemic = vPh < 7.35;
  const isAlkalemic = vPh > 7.45;
  const isNormalPh = !isAcidemic && !isAlkalemic;

  const isHighCo2 = vPaco2 > 45;
  const isLowCo2 = vPaco2 < 35;
  const isNormalCo2 = !isHighCo2 && !isLowCo2;

  const isHighHco3 = vHco3 > 26;
  const isLowHco3 = vHco3 < 22;
  const isNormalHco3 = !isHighHco3 && !isLowHco3;

  if (isNormalPh) {
    if (isNormalCo2 && isNormalHco3) {
      primaryDisorder = "Normal Acid-Base Balance";
      compensation = "Within physiological normal limits";
      badgeColor = "#059669";
      causes = ["Healthy respiratory and metabolic homeostasis."];
      nursingActions = ["Continue baseline monitoring; verify patient clinical symptoms."];
    } else {
      // Fully compensated
      badgeColor = "#d97706";
      if (vPh < 7.40) {
        // Leaning acidotic
        if (isHighCo2 && isHighHco3) {
          primaryDisorder = "Fully Compensated Respiratory Acidosis";
          compensation = "Kidneys have retained HCO3- to normalize pH";
          causes = ["Chronic COPD", "Severe chronic bronchitis", "Obesity hypoventilation"];
          nursingActions = ["Monitor baseline respiratory status", "Avoid high-flow O2 (suppress hypoxic drive)", "Check for respiratory fatigue"];
        } else if (isLowHco3 && isLowCo2) {
          primaryDisorder = "Fully Compensated Metabolic Acidosis";
          compensation = "Lungs have hyperventilated (blown off CO2) to normalize pH";
          causes = ["Chronic kidney disease", "Resolving diabetic ketoacidosis (DKA)", "Chronic diarrhea"];
          nursingActions = ["Monitor electrolytes (K+, Na+)", "Maintain hydration", "Track renal profile"];
        } else {
          primaryDisorder = "Fully Compensated Acidosis";
          compensation = "Regulatory organs have stabilized systemic pH";
        }
      } else {
        // Leaning alkalotic
        if (isLowCo2 && isLowHco3) {
          primaryDisorder = "Fully Compensated Respiratory Alkalosis";
          compensation = "Kidneys have excreted HCO3- to normalize pH";
          causes = ["Chronic hyperventilation", "High altitude acclimation", "Pregnancy"];
          nursingActions = ["Address emotional anxiety/pain", "Check calcium levels (chvostek/trousseau)"];
        } else if (isHighHco3 && isHighCo2) {
          primaryDisorder = "Fully Compensated Metabolic Alkalosis";
          compensation = "Lungs have hypoventilated (retained CO2) to normalize pH";
          causes = ["Chronic diuretic therapy", "Chronic nasogastric suction", "Excessive antacid use"];
          nursingActions = ["Replace fluids with normal saline", "Assess for hypokalemia and cardiac rhythm changes"];
        } else {
          primaryDisorder = "Fully Compensated Alkalosis";
          compensation = "Regulatory organs have stabilized systemic pH";
        }
      }
    }
  } else if (isAcidemic) {
    badgeColor = "#dc2626";
    if (isHighCo2 && isLowHco3) {
      primaryDisorder = "Mixed Respiratory & Metabolic Acidosis (Critical)";
      compensation = "No compensation (Both systems contributing to acidosis)";
      causes = ["Cardiac arrest", "Severe septic shock with respiratory arrest", "Multi-organ failure"];
      nursingActions = [
        "IMMEDIATE Resuscitation: Secure patent airway and initiate mechanical ventilation",
        "Administer IV fluids and inotropes for circulatory shock",
        "Correct severe underlying hypoxemia and tissue hypoperfusion"
      ];
    } else if (isHighCo2) {
      if (isNormalHco3) {
        primaryDisorder = "Uncompensated Respiratory Acidosis";
        compensation = "Uncompensated (Kidneys have not yet retained HCO3-)";
      } else if (isHighHco3) {
        primaryDisorder = "Partially Compensated Respiratory Acidosis";
        compensation = "Partially Compensated (Kidneys retaining HCO3- but pH remains acidemic)";
      }
      causes = ["Acute hypoventilation", "Opioid / Sedative overdose", "Acute pulmonary edema / severe asthma", "Guillain-Barré / Myasthenia Gravis"];
      nursingActions = [
        "Position patient in High-Fowler's position to maximize lung expansion",
        "If opioid overdose suspected, administer Naloxone (Narcan) as prescribed",
        "Encourage deep breathing, suction airway if secretions present, or prepare for BiPAP/intubation"
      ];
    } else if (isLowHco3) {
      if (isNormalCo2) {
        primaryDisorder = "Uncompensated Metabolic Acidosis";
        compensation = "Uncompensated (Lungs have not yet blown off CO2)";
      } else if (isLowCo2) {
        primaryDisorder = "Partially Compensated Metabolic Acidosis";
        compensation = "Partially Compensated (Lungs hyperventilating [Kussmaul breathing] but pH remains acidemic)";
      }
      causes = ["Diabetic Ketoacidosis (DKA)", "Lactic acidosis (sepsis / tissue hypoxia)", "Severe acute diarrhea", "Renal failure (uremia)"];
      nursingActions = [
        "In DKA: Administer regular insulin IV infusion and 0.9% Normal Saline fluid bolus",
        "Closely monitor serum potassium (K+) — insulin drives K+ into cells, causing rapid hypokalemia",
        "Monitor for Kussmaul respirations and assess mental status"
      ];
    } else {
      primaryDisorder = "Acute Unclassified Acidosis";
      compensation = "Indeterminate";
    }
  } else if (isAlkalemic) {
    badgeColor = "#2563eb";
    if (isLowCo2 && isHighHco3) {
      primaryDisorder = "Mixed Respiratory & Metabolic Alkalosis";
      compensation = "Combined dual alkalemia";
      causes = ["Critical illness with mechanical hyperventilation + massive NG suctioning"];
      nursingActions = ["Adjust ventilator tidal volume / respiratory rate", "Discontinue gastric suctioning or administer saline"];
    } else if (isLowCo2) {
      if (isNormalHco3) {
        primaryDisorder = "Uncompensated Respiratory Alkalosis";
        compensation = "Uncompensated (Kidneys have not yet excreted HCO3-)";
      } else if (isLowHco3) {
        primaryDisorder = "Partially Compensated Respiratory Alkalosis";
        compensation = "Partially Compensated (Kidneys excreting HCO3- but pH remains alkalemic)";
      }
      causes = ["Acute anxiety / panic attack", "Hypoxia / pulmonary embolism", "Severe pain / fever / early gram-negative sepsis", "Mechanical ventilator overventilation"];
      nursingActions = [
        "Coach the patient in slow, calm diaphragmatic breathing or use a rebreather mask",
        "Provide analgesia for pain or anxiolytics if indicated",
        "Monitor for neuromuscular irritability, numbness, tingling (tetany) from hypocalcemia"
      ];
    } else if (isHighHco3) {
      if (isNormalCo2) {
        primaryDisorder = "Uncompensated Metabolic Alkalosis";
        compensation = "Uncompensated (Lungs have not yet retained CO2)";
      } else if (isHighCo2) {
        primaryDisorder = "Partially Compensated Metabolic Alkalosis";
        compensation = "Partially Compensated (Lungs hypoventilating to retain CO2 but pH remains alkalemic)";
      }
      causes = ["Severe vomiting / bulimia", "Prolonged nasogastric (NG) tube suctioning", "Loop or thiazide diuretic therapy", "Excessive sodium bicarbonate administration"];
      nursingActions = [
        "Administer IV 0.9% Normal Saline with Potassium Chloride (KCl) as prescribed",
        "Monitor continuous ECG for U-waves and dysrhythmias secondary to hypokalemia",
        "Hold potassium-wasting diuretics and clarify with physician"
      ];
    } else {
      primaryDisorder = "Acute Unclassified Alkalosis";
      compensation = "Indeterminate";
    }
  }

  // Oxygenation evaluation
  let oxygenationStatus = "";
  if (!isNaN(vPao2)) {
    if (vPao2 >= 100) oxygenationStatus = "Hyperoxia (PaO2 > 100 mmHg) — Consider titrating supplemental O2 down to prevent oxygen toxicity.";
    else if (vPao2 >= 80) oxygenationStatus = "Normal Oxygenation (PaO2 80–100 mmHg).";
    else if (vPao2 >= 60) oxygenationStatus = "Mild Hypoxemia (PaO2 60–79 mmHg) — Apply nasal cannula O2 and assess airway.";
    else if (vPao2 >= 45) oxygenationStatus = "Moderate Hypoxemia (PaO2 45–59 mmHg) — Urgent O2 escalation via non-rebreather mask.";
    else oxygenationStatus = "Severe Critical Hypoxemia (PaO2 < 45 mmHg) — Emergency airway / intubation alert!";
  }

  return {
    primaryDisorder,
    compensation,
    badgeColor,
    causes,
    nursingActions,
    oxygenationStatus
  };
}

/**
 * 4. Paediatric Emergency Weight-Based Doser
 * Instant weight estimation and WHO/APLS critical drug dosages.
 */
export function computePaedEmergency({ weightKg, ageYears, ageMonths }) {
  let effectiveWeight = parseFloat(weightKg);

  if (!effectiveWeight || effectiveWeight <= 0) {
    const mo = parseFloat(ageMonths);
    const yr = parseFloat(ageYears);

    if (mo && mo > 0 && mo <= 12) {
      effectiveWeight = Number(((mo + 9) / 2).toFixed(1));
    } else if (yr && yr > 0 && yr <= 5) {
      effectiveWeight = Number((yr * 2 + 8).toFixed(1));
    } else if (yr && yr > 5 && yr <= 14) {
      effectiveWeight = Number((yr * 3 + 7).toFixed(1));
    }
  }

  if (!effectiveWeight || effectiveWeight <= 0) return null;

  const wt = effectiveWeight;

  // 1. IV Artesunate (WHO Severe Malaria First-Line)
  const artDoseRate = wt < 20 ? 3.0 : 2.4;
  const artDoseMg = Number((wt * artDoseRate).toFixed(1));

  // 2. Epinephrine 1:1,000 (1 mg/mL) IM (Anaphylaxis)
  const epiDoseMg = Math.min(0.3, Number((wt * 0.01).toFixed(2)));
  const epiVolumeMl = epiDoseMg; // Because 1 mg/mL

  // 3. Ceftriaxone IV (Paediatric Severe Sepsis / Bacterial Meningitis)
  const ceftSepsisMg = Math.min(2000, Math.round(wt * 50));
  const ceftMeningitisMg = Math.min(4000, Math.round(wt * 100));

  // 4. Diazepam (Acute Convulsion / Status Epilepticus)
  const diazRectalMg = Math.min(10, Number((wt * 0.5).toFixed(1)));
  const diazIvMg = Math.min(5, Number((wt * 0.2).toFixed(1)));

  // 5. IMCI Plan B Oral Rehydration Salts (ORS)
  const ors4hTotalMl = Math.round(wt * 75);
  const orsHourlyRateMl = Math.round(ors4hTotalMl / 4);

  // 6. Paracetamol (Acetaminophen) Antipyretic
  const paracetamolDoseMg = Math.min(1000, Math.round(wt * 15));
  const paracetamol24hMaxMg = Math.min(4000, Math.round(wt * 60));

  return {
    weightKg: wt,
    drugs: [
      {
        name: "IV Artesunate (Severe Malaria)",
        rate: `${artDoseRate} mg/kg per dose IV / IM`,
        dose: `${artDoseMg} mg`,
        schedule: "Doses at 0 hour, 12 hours, 24 hours, then once daily until able to take oral ACT.",
        pearl: "Reconstitute 60mg vial with 1mL 5% sodium bicarbonate, then dilute with 5mL 0.9% saline (10mg/mL)."
      },
      {
        name: "Epinephrine (Adrenaline) 1:1,000 IM (Anaphylaxis)",
        rate: "0.01 mg/kg (0.01 mL/kg of 1:1,000 solution)",
        dose: `${epiDoseMg} mg (${epiVolumeMl} mL)`,
        schedule: "Inject IM into mid-outer thigh (vastus lateralis). Repeat every 5–15 minutes if symptoms persist.",
        pearl: "Max single dose for child <12 years is 0.3 mg (0.3 mL); max for adolescent is 0.5 mg (0.5 mL)."
      },
      {
        name: "Ceftriaxone IV (Sepsis & Meningitis)",
        rate: "Sepsis: 50 mg/kg/day | Meningitis: 100 mg/kg/day",
        dose: `Sepsis: ${ceftSepsisMg} mg/day | Meningitis: ${ceftMeningitisMg} mg/day`,
        schedule: "Slow IV infusion over 30 minutes (or slow IV push over 3–5 minutes). Max 4g/day.",
        pearl: "Contraindicated in neonates (<28 days) with hyperbilirubinemia or receiving IV calcium (precipitation risk)."
      },
      {
        name: "Diazepam (Status Epilepticus / Convulsions)",
        rate: "Rectal: 0.5 mg/kg | Slow IV: 0.2 mg/kg",
        dose: `Rectal: ${diazRectalMg} mg | IV: ${diazIvMg} mg`,
        schedule: "Give slowly over 2–3 minutes. Repeat once in 10 minutes if convulsions continue.",
        pearl: "Always have bag-valve-mask (Ambu bag) and suction ready — high risk of acute respiratory depression."
      },
      {
        name: "IMCI Plan B ORS (Some Dehydration)",
        rate: "75 mL/kg over 4 hours",
        dose: `${ors4hTotalMl} mL total (${orsHourlyRateMl} mL/hour)`,
        schedule: "Give frequent sips with spoon or cup over 4 hours. Reassess hydration status at 4 hours.",
        pearl: "If the child vomits, wait 10 minutes and continue feeding ORS at a slower pace."
      },
      {
        name: "Paracetamol (Acetaminophen) Antipyretic",
        rate: "15 mg/kg per dose (Max 60 mg/kg/day)",
        dose: `${paracetamolDoseMg} mg every 4–6 hours PRN`,
        schedule: "Maximum 4 doses in 24 hours. Max daily limit: " + paracetamol24hMaxMg + " mg/day.",
        pearl: "Never exceed 60 mg/kg/24h to prevent acute hepatotoxicity."
      }
    ]
  };
}
