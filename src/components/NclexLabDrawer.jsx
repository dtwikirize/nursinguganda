import React from "react";
import { FlaskConical, ShieldAlert, X } from "lucide-react";

const US_LAB_PANELS = [
  {
    group: "Basic Metabolic Panel (BMP)",
    items: [
      ["Sodium (Na+)", "135 – 145 mEq/L", "<120 or >160 (Seizures)"],
      ["Potassium (K+)", "3.5 – 5.0 mEq/L", "<2.5 or >6.0 (Arrhythmia)"],
      ["Calcium (Ca2+)", "8.5 – 10.5 mg/dL", "Chvostek / Trousseau <8.5"],
      ["Magnesium (Mg2+)", "1.5 – 2.5 mEq/L", "Loss of DTRs >4.0"],
      ["Glucose (Fasting)", "70 – 99 mg/dL", "<70 Rescue · >250 DKA"],
      ["BUN / Creatinine", "10–20 / 0.7–1.2 mg/dL", "Oliguria <30 mL/hr"]
    ]
  },
  {
    group: "ABGs & Hematology",
    items: [
      ["Arterial pH", "7.35 – 7.45", "<7.20 or >7.60"],
      ["PaCO2 (Respiratory)", "35 – 45 mmHg", "ROME Opposite"],
      ["HCO3- (Metabolic)", "22 – 26 mEq/L", "ROME Equal"],
      ["Hemoglobin (M / F)", "13.5–17.5 / 12–15 g/dL", "<7 g/dL Transfuse"],
      ["Platelets", "150,000 – 400,000/mm3", "<50,000 Bleeding Risk"],
      ["WBC Count", "4,500 – 11,000/mm3", "<1,000 ANC Neutropenia"]
    ]
  },
  {
    group: "Coagulation, Drugs & Antidotes",
    items: [
      ["Warfarin (INR)", "2.0 – 3.0 (Normal 0.8–1.1)", "Antidote: Vitamin K"],
      ["Heparin (aPTT)", "60 – 80 sec (1.5–2.5x ctrl)", "Antidote: Protamine Sulfate"],
      ["Digoxin Level", "0.5 – 2.0 ng/mL", "Hold HR <60 · Digibind"],
      ["Lithium Level", "0.6 – 1.2 mEq/L", ">1.5 Toxicity (NS + Hold)"],
      ["Phenytoin / Vancomycin", "10–20 / 10–20 mcg/mL", "Vanc Trough <10 or >20"],
      ["MgSO4 / Opioid Overdose", "Stop Infusion / Monitor RR", "Ca Gluconate / Naloxone"]
    ]
  }
];

/**
 * Interactive US Conventional Lab Values & Antidotes Drawer used across the
 * NCLEX-RN Study Player and Examinations Simulation suite (Black + Blue theme).
 */
export default function NclexLabDrawer({ open, onClose }) {
  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-label="NCLEX-RN US Conventional Lab Values Reference"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(9, 9, 11, 0.72)",
        display: "flex",
        justifyContent: "flex-end"
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(520px, 100%)",
          height: "100%",
          background: "#ffffff",
          borderLeft: "4px solid #1d4ed8",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden"
        }}
      >
        <div
          style={{
            background: "#09090b",
            color: "#ffffff",
            padding: "16px 20px",
            borderBottom: "3px solid #2563eb",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <FlaskConical size={20} color="#60a5fa" />
            <div>
              <div style={{ fontSize: "0.7rem", fontWeight: 800, color: "#60a5fa", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                US CONVENTIONAL REFERENCE EXHIBIT
              </div>
              <div style={{ fontSize: "1rem", fontWeight: 800 }}>
                NCLEX-RN Labs, Drug Levels &amp; Antidotes
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close lab reference"
            style={{
              background: "#18181b",
              color: "#ffffff",
              border: "1px solid #334155",
              borderRadius: 8,
              width: 34,
              height: 34,
              display: "grid",
              placeItems: "center",
              cursor: "pointer"
            }}
          >
            <X size={17} />
          </button>
        </div>

        <div style={{ padding: "16px 20px", overflowY: "auto", display: "grid", gap: 16 }}>
          <div style={{ padding: "10px 12px", borderRadius: 8, background: "#eff6ff", borderLeft: "4px solid #1d4ed8", fontSize: "0.8rem", color: "#09090b", display: "flex", gap: 8, alignItems: "center" }}>
            <ShieldAlert size={16} color="#1d4ed8" />
            <span><strong>Quick Tip:</strong> NCSBN tests in US conventional units (`mg/dL`, `mEq/L`). Always pair critical electrolyte changes with cardiac monitoring or airway checks first.</span>
          </div>

          {US_LAB_PANELS.map((panel) => (
            <div key={panel.group} style={{ border: "1px solid #cbd5e1", borderRadius: 10, overflow: "hidden" }}>
              <div style={{ background: "#09090b", color: "#ffffff", padding: "9px 14px", fontSize: "0.82rem", fontWeight: 800, borderBottom: "2px solid #2563eb" }}>
                {panel.group}
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.79rem" }}>
                <thead>
                  <tr style={{ background: "#f8fafc", textAlign: "left" }}>
                    <th style={{ padding: "7px 10px", borderBottom: "1px solid #e2e8f0" }}>Test / Drug</th>
                    <th style={{ padding: "7px 10px", borderBottom: "1px solid #e2e8f0" }}>US Normal / Ther.</th>
                    <th style={{ padding: "7px 10px", borderBottom: "1px solid #e2e8f0" }}>Panic / Action</th>
                  </tr>
                </thead>
                <tbody>
                  {panel.items.map(([name, norm, panic]) => (
                    <tr key={name}>
                      <td style={{ padding: "7px 10px", borderBottom: "1px solid #f1f5f9", fontWeight: 700, color: "#09090b" }}>{name}</td>
                      <td style={{ padding: "7px 10px", borderBottom: "1px solid #f1f5f9", fontWeight: 600, color: "#1d4ed8" }}>{norm}</td>
                      <td style={{ padding: "7px 10px", borderBottom: "1px solid #f1f5f9", color: "#475569" }}>{panic}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
