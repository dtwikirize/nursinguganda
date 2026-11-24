/**
 * Accurate SI (Uganda / UK / EAC / Canada / Australia) <-> US Conventional (NCLEX-RN)
 * normal clinical reference conversions for Nursing Uganda tools & mock exams.
 */

const US_CONVERSIONS = {
  "Temperature, oral": {
    value: "97.0–99.0",
    unit: "°F",
    note: "Fever >= 100.4°F; hypothermia < 95.0°F"
  },
  "Temperature, axillary": {
    value: "96.6–98.1",
    unit: "°F",
    note: "~0.9°F lower than oral"
  },
  "Newborn Temp": {
    value: "97.7–99.5",
    unit: "°F",
    note: "NCLEX thermoregulation baseline"
  },
  "Blood Glucose, fasting": {
    value: "70–100",
    unit: "mg/dL",
    note: "101–125 mg/dL pre-diabetes; >= 126 mg/dL diabetes"
  },
  "Blood Glucose, random": {
    value: "70–140",
    unit: "mg/dL",
    note: ">= 200 mg/dL + symptoms diagnostic"
  },
  "Urea (BUN)": {
    value: "7–20",
    unit: "mg/dL",
    note: "US BUN equivalent of Urea 2.5–7.1 mmol/L"
  },
  "Creatinine, male": {
    value: "0.7–1.3",
    unit: "mg/dL",
    note: "Conversion: 1 mg/dL = 88.4 umol/L"
  },
  "Creatinine, female": {
    value: "0.5–1.1",
    unit: "mg/dL",
    note: "Conversion: 1 mg/dL = 88.4 umol/L"
  },
  "Total Calcium (Ca²⁺)": {
    value: "8.6–10.2",
    unit: "mg/dL",
    note: "Hypocalcaemia < 8.6; hypercalcaemia > 10.2 mg/dL"
  },
  "Magnesium (Mg²⁺)": {
    value: "1.8–2.4",
    unit: "mEq/L (or mg/dL)",
    note: "Important in MgSO4 toxicity checks"
  },
  "Total Protein": {
    value: "6.0–8.0",
    unit: "g/dL",
    note: "Equivalent of 60–80 g/L"
  },
  "Albumin": {
    value: "3.5–5.0",
    unit: "g/dL",
    note: "Hypoalbuminaemia < 3.5 g/dL"
  },
  "Haemoglobin, male": {
    value: "13.5–17.5",
    unit: "g/dL",
    note: "SI equivalent: 135–175 g/L"
  },
  "Haemoglobin, female": {
    value: "12.0–15.5",
    unit: "g/dL",
    note: "SI equivalent: 120–155 g/L"
  }
};

export function formatLabItemForUnit(item, unitSystem = "si") {
  if (!item) return item;
  if (unitSystem !== "us") return item;
  const match = US_CONVERSIONS[item.name];
  if (!match) return item;
  return {
    ...item,
    value: match.value,
    unit: match.unit,
    note: match.note || item.note || ""
  };
}

export const QUICK_SI_US_CHEATSHEET = [
  { test: "Fasting Glucose", si: "3.9–5.6 mmol/L", us: "70–100 mg/dL" },
  { test: "Serum Creatinine (Male)", si: "62–115 µmol/L", us: "0.7–1.3 mg/dL" },
  { test: "Serum Calcium", si: "2.15–2.55 mmol/L", us: "8.6–10.2 mg/dL" },
  { test: "BUN / Urea", si: "2.5–7.1 mmol/L", us: "7–20 mg/dL" },
  { test: "Body Temperature", si: "36.1–37.2 °C", us: "97.0–99.0 °F" },
  { test: "Haemoglobin (Female)", si: "120–155 g/L", us: "12.0–15.5 g/dL" }
];
