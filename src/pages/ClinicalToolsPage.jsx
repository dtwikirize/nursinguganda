import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  Calculator,
  CheckCircle2,
  CheckSquare,
  Clock,
  Download,
  FileSpreadsheet,
  Flame,
  Globe2,
  HeartPulse,
  Info,
  ShieldAlert,
  Stethoscope,
  Wind
} from "lucide-react";
import AdSlot from "../components/AdSlot";
import NursingLoader from "../components/NursingLoader";
import ReferencesBox from "../components/ReferencesBox";
import {
  computeAbg,
  computeNews2,
  computePaedEmergency,
  computeParkland
} from "../utils/clinicalCalculators";
import { formatLabItemForUnit, QUICK_SI_US_CHEATSHEET } from "../utils/labUnits";
import { downloadNursingTemplatePdf, NURSING_TEMPLATES } from "../utils/pdfExport";

export default function ClinicalToolsPage({ initialTabOverride = "" }) {
  const [searchParams] = useSearchParams();
  const rawTab = initialTabOverride || searchParams.get("tab") || "calc";
  const initialTab = rawTab === "normal-values" ? "values" : rawTab;

  const [data, setData] = useState(null);
  const [tab, setTab] = useState(initialTab);
  const [calcType, setCalcType] = useState("news2");
  const [inputs, setInputs] = useState({});
  const [activeChecklistId, setActiveChecklistId] = useState("hand-hygiene");
  const [checkedSteps, setCheckedSteps] = useState({});
  const [unitSystem, setUnitSystem] = useState("si"); // "si" (Uganda/UK/EAC) | "us" (NCLEX/US Conventional)
  const [includeSampleInTemplate, setIncludeSampleInTemplate] = useState(true);

  useEffect(() => {
    if (initialTabOverride) setTab(initialTabOverride);
  }, [initialTabOverride]);

  useEffect(() => {
    fetch("/assets/data/clinical-tools.json")
      .then((r) => r.json())
      .then(setData);
  }, []);

  const calcResult = (() => {
    const v = (k) => parseFloat(inputs[k]);
    if (calcType === "drip") {
      if (!v("vol") || !v("hrs") || !v("df")) return null;
      return `${((v("vol") * v("df")) / (v("hrs") * 60)).toFixed(1)} drops/min`;
    }
    if (calcType === "tablet") {
      if (!v("ord") || !v("avail")) return null;
      return `${(v("ord") / v("avail")).toFixed(2)} tablet(s)`;
    }
    if (calcType === "liquid") {
      if (!v("ord") || !v("conc") || !v("vol")) return null;
      return `${((v("ord") / v("conc")) * v("vol")).toFixed(2)} mL`;
    }
    if (calcType === "paed") {
      if (!v("wt") || !v("dosekg")) return null;
      return `${(v("wt") * v("dosekg")).toFixed(1)} mg total dose`;
    }
    return null;
  })();

  const news2Result =
    calcType === "news2"
      ? computeNews2({
          rr: inputs.rr,
          spo2: inputs.spo2,
          spo2Scale: inputs.spo2Scale || "scale1",
          onOxygen: Boolean(inputs.onOxygen),
          sbp: inputs.sbp,
          pulse: inputs.pulse,
          consciousness: inputs.consciousness || "alert",
          temp: inputs.temp
        })
      : null;

  const parklandResult =
    calcType === "parkland"
      ? computeParkland({
          weightKg: inputs.weightKg,
          tbsa: inputs.tbsa,
          elapsedHours: inputs.elapsedHours || 0
        })
      : null;

  const abgResult =
    calcType === "abg"
      ? computeAbg({
          ph: inputs.ph,
          paco2: inputs.paco2,
          hco3: inputs.hco3,
          pao2: inputs.pao2
        })
      : null;

  const paedEmergencyResult =
    calcType === "paed_emergency"
      ? computePaedEmergency({
          weightKg: inputs.paedWt,
          ageYears: inputs.paedAgeYears,
          ageMonths: inputs.paedAgeMonths
        })
      : null;

  if (!data) {
    return (
      <main className="nu-section">
        <div className="nu-container">
          <NursingLoader label="Loading clinical calculators, SI/US lab ranges & PDF templates..." />
        </div>
      </main>
    );
  }

  const activeChecklist = data.checklists.find((c) => c.id === activeChecklistId) || data.checklists[0];

  return (
    <main>
      <section className="nu-cl-hero">
        <div className="nu-container">
          <span className="nu-badge nu-badge-free" style={{ marginBottom: 10 }}>Free Ward, Global Exam &amp; OSCE Toolkit</span>
          <h1>Clinical Calculators, Checklists, SI/US Lab Ranges &amp; PDF Templates</h1>
          <p className="nu-cl-subtitle" style={{ maxWidth: 760 }}>
            Bedside IV drip rate calculators, OSCE checklists, toggleable <strong>SI (Uganda/UK) vs US (NCLEX)</strong> lab values, and 8 printable ward &amp; logbook PDF worksheets.
          </p>
        </div>
      </section>

      <section className="nu-section">
        <div className="nu-container">
          <div className="nu-tabs" style={{ flexWrap: "wrap", gap: 6 }}>
            <button type="button" className={`nu-tab ${tab === "calc" ? "active" : ""}`} onClick={() => setTab("calc")}>
              <Calculator size={15} style={{ display: "inline", marginRight: 6 }} />
              Drug &amp; IV Calculators
            </button>
            <button type="button" className={`nu-tab ${tab === "templates" ? "active" : ""}`} onClick={() => setTab("templates")}>
              <FileSpreadsheet size={15} style={{ display: "inline", marginRight: 6 }} />
              Ward &amp; Logbook Templates ({NURSING_TEMPLATES.length} PDFs)
            </button>
            <button type="button" className={`nu-tab ${tab === "values" ? "active" : ""}`} onClick={() => setTab("values")}>
              <HeartPulse size={15} style={{ display: "inline", marginRight: 6 }} />
              Normal Lab &amp; Vital Values (SI / US)
            </button>
            <button type="button" className={`nu-tab ${tab === "checklists" ? "active" : ""}`} onClick={() => setTab("checklists")}>
              <CheckSquare size={15} style={{ display: "inline", marginRight: 6 }} />
              OSCE Checklists ({data.checklists.length})
            </button>
          </div>

          {tab === "calc" && (
            <div style={{ maxWidth: 840, border: "1px solid var(--nu-border)", padding: 24, background: "#fff", borderRadius: 10 }}>
              {/* Category 1: Bedside Acute & Emergency Decision Engines */}
              <div style={{ marginBottom: 18 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                  <ShieldAlert size={15} color="#0F2942" />
                  <span style={{ fontSize: "0.8rem", fontWeight: 800, color: "#0F2942", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                    Acute &amp; Emergency Clinical Engines
                  </span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {[
                    ["news2", "NEWS2 Deterioration Score", Activity],
                    ["parkland", "Parkland Burn Fluid Resuscitation", Flame],
                    ["abg", "ABG & ROME Interpreter", Wind],
                    ["paed_emergency", "Paediatric Emergency Doser", Stethoscope]
                  ].map(([k, lbl, Icon]) => (
                    <button
                      key={k}
                      type="button"
                      className={`nu-btn ${calcType === k ? "nu-btn-dark" : "nu-btn-outline"}`}
                      style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.85rem", padding: "8px 14px" }}
                      onClick={() => {
                        setCalcType(k);
                        setInputs({});
                      }}
                    >
                      <Icon size={14} />
                      {lbl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category 2: Routine Drug & IV Infusion Calculations */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                  <Calculator size={15} color="#64748b" />
                  <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                    Routine Ward Drug &amp; IV Infusion Dosing
                  </span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {[
                    ["drip", "IV Drip Rate (drops/min)"],
                    ["tablet", "Tablet Dose"],
                    ["liquid", "Syrup / Liquid Dose"],
                    ["paed", "Standard Paediatric (mg/kg)"]
                  ].map(([k, lbl]) => (
                    <button
                      key={k}
                      type="button"
                      className={`nu-btn ${calcType === k ? "nu-btn-dark" : "nu-btn-outline"}`}
                      style={{ fontSize: "0.84rem", padding: "7px 12px" }}
                      onClick={() => {
                        setCalcType(k);
                        setInputs({});
                      }}
                    >
                      {lbl}
                    </button>
                  ))}
                </div>
              </div>

              {/* NEWS2 DETERIORATION CALCULATOR */}
              {calcType === "news2" && (
                <div style={{ display: "grid", gap: 16 }}>
                  <div style={{ padding: "12px 16px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8 }}>
                    <strong style={{ display: "block", color: "#0F2942", fontSize: "0.95rem", marginBottom: 4 }}>
                      National Early Warning Score 2 (NEWS2) Bedside Assessment
                    </strong>
                    <small style={{ color: "#475569" }}>
                      Royal College of Physicians standard bedside deterioration tracking. Input the 7 physiological parameters to calculate clinical risk score and escalation protocols.
                    </small>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: 4, color: "#1e293b" }}>
                        Respiration Rate (breaths/min)
                      </label>
                      <input
                        type="number"
                        placeholder="e.g. 18 (Normal: 12–20)"
                        value={inputs.rr || ""}
                        onChange={(e) => setInputs((p) => ({ ...p, rr: e.target.value }))}
                        style={{ width: "100%", height: 42, padding: "0 12px", border: "1px solid var(--nu-border)", borderRadius: 6 }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: 4, color: "#1e293b" }}>
                        Oxygen Saturation SpO2 (%)
                      </label>
                      <input
                        type="number"
                        placeholder="e.g. 97"
                        value={inputs.spo2 || ""}
                        onChange={(e) => setInputs((p) => ({ ...p, spo2: e.target.value }))}
                        style={{ width: "100%", height: 42, padding: "0 12px", border: "1px solid var(--nu-border)", borderRadius: 6 }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: 4, color: "#1e293b" }}>
                        Systolic Blood Pressure (mmHg)
                      </label>
                      <input
                        type="number"
                        placeholder="e.g. 120 (Normal: 111–219)"
                        value={inputs.sbp || ""}
                        onChange={(e) => setInputs((p) => ({ ...p, sbp: e.target.value }))}
                        style={{ width: "100%", height: 42, padding: "0 12px", border: "1px solid var(--nu-border)", borderRadius: 6 }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: 4, color: "#1e293b" }}>
                        Heart Rate / Pulse (bpm)
                      </label>
                      <input
                        type="number"
                        placeholder="e.g. 74 (Normal: 51–90)"
                        value={inputs.pulse || ""}
                        onChange={(e) => setInputs((p) => ({ ...p, pulse: e.target.value }))}
                        style={{ width: "100%", height: 42, padding: "0 12px", border: "1px solid var(--nu-border)", borderRadius: 6 }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: 4, color: "#1e293b" }}>
                        Body Temperature (°C)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        placeholder="e.g. 37.0 (Normal: 36.1–38.0)"
                        value={inputs.temp || ""}
                        onChange={(e) => setInputs((p) => ({ ...p, temp: e.target.value }))}
                        style={{ width: "100%", height: 42, padding: "0 12px", border: "1px solid var(--nu-border)", borderRadius: 6 }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: 4, color: "#1e293b" }}>
                        Consciousness Level (ACVPU)
                      </label>
                      <select
                        value={inputs.consciousness || "alert"}
                        onChange={(e) => setInputs((p) => ({ ...p, consciousness: e.target.value }))}
                        style={{ width: "100%", height: 42, padding: "0 12px", border: "1px solid var(--nu-border)", borderRadius: 6, background: "#fff" }}
                      >
                        <option value="alert">Alert (A) - Fully oriented (Score 0)</option>
                        <option value="cvpu">CVPU - Confusion, Voice, Pain, Unresponsive (Score 3)</option>
                      </select>
                    </div>
                  </div>

                  {/* Supplemental Oxygen & Scale 2 Toggle */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 16, padding: "12px 14px", background: "#f1f5f9", borderRadius: 8 }}>
                    <label style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: "0.85rem", fontWeight: 600, color: "#0F2942", cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        checked={Boolean(inputs.onOxygen)}
                        onChange={(e) => setInputs((p) => ({ ...p, onOxygen: e.target.checked }))}
                      />
                      Patient on Supplemental Oxygen (+2 points)
                    </label>

                    <label style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: "0.85rem", fontWeight: 600, color: "#0F2942", cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        checked={inputs.spo2Scale === "scale2"}
                        onChange={(e) => setInputs((p) => ({ ...p, spo2Scale: e.target.checked ? "scale2" : "scale1" }))}
                      />
                      Use SpO2 Scale 2 (Target 88–92% Hypercapnic / COPD)
                    </label>
                  </div>

                  {news2Result ? (
                    <div style={{ border: `2px solid ${news2Result.colorHex}`, borderRadius: 10, overflow: "hidden" }}>
                      <div style={{ background: news2Result.colorHex, color: "#fff", padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                        <div>
                          <strong style={{ fontSize: "1.2rem", display: "block" }}>
                            NEWS2 Total Score: {news2Result.totalScore}
                          </strong>
                          <span style={{ fontSize: "0.88rem", fontWeight: 600 }}>{news2Result.riskTier}</span>
                        </div>
                        <span style={{ fontSize: "0.82rem", background: "rgba(255,255,255,0.2)", padding: "4px 10px", borderRadius: 6, fontWeight: 700 }}>
                          {news2Result.frequency}
                        </span>
                      </div>
                      <div style={{ padding: 16, background: "#ffffff" }}>
                        <div style={{ marginBottom: 12, padding: "10px 14px", background: "#f8fafc", borderRadius: 6, borderLeft: `4px solid ${news2Result.colorHex}` }}>
                          <strong style={{ color: "#0F2942", display: "block", fontSize: "0.86rem", marginBottom: 2 }}>
                            Clinical Escalation Response:
                          </strong>
                          <span style={{ color: "#334155", fontSize: "0.86rem" }}>{news2Result.escalationAction}</span>
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                          {Object.entries({
                            "Respiration": news2Result.breakdown.rrScore,
                            "Oxygen Sat (SpO2)": news2Result.breakdown.spo2Score,
                            "Supp. O2": news2Result.breakdown.oxygenScore,
                            "Systolic BP": news2Result.breakdown.sbpScore,
                            "Pulse": news2Result.breakdown.pulseScore,
                            "Consciousness": news2Result.breakdown.consciousnessScore,
                            "Temperature": news2Result.breakdown.tempScore
                          }).map(([lbl, pts]) => (
                            <span
                              key={lbl}
                              style={{
                                fontSize: "0.78rem",
                                padding: "4px 8px",
                                borderRadius: 4,
                                background: pts > 0 ? (pts === 3 ? "#fee2e2" : "#fef3c7") : "#f1f5f9",
                                color: pts > 0 ? (pts === 3 ? "#991b1b" : "#92400e") : "#475569",
                                fontWeight: 700
                              }}
                            >
                              {lbl}: +{pts}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div style={{ padding: 14, background: "#f8fafc", border: "1px dashed #cbd5e1", borderRadius: 8, color: "#64748b", fontSize: "0.86rem", textAlign: "center" }}>
                      Fill in Respiration Rate, SpO2, Systolic BP, Pulse, and Temperature to view the NEWS2 deterioration score and escalation response.
                    </div>
                  )}
                </div>
              )}

              {/* PARKLAND BURN FLUID RESUSCITATION CALCULATOR */}
              {calcType === "parkland" && (
                <div style={{ display: "grid", gap: 16 }}>
                  <div style={{ padding: "12px 16px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8 }}>
                    <strong style={{ display: "block", color: "#0F2942", fontSize: "0.95rem", marginBottom: 4 }}>
                      Parkland Formula for Burn Fluid Resuscitation
                    </strong>
                    <small style={{ color: "#475569" }}>
                      Calculates 24-hour Lactated Ringer&apos;s crystalloid requirements (4 mL × kg × %TBSA) for 2nd and 3rd degree burns, partitioned into the critical first 8 hours and subsequent 16 hours.
                    </small>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: 4, color: "#1e293b" }}>
                        Patient Body Weight (kg)
                      </label>
                      <input
                        type="number"
                        placeholder="e.g. 70"
                        value={inputs.weightKg || ""}
                        onChange={(e) => setInputs((p) => ({ ...p, weightKg: e.target.value }))}
                        style={{ width: "100%", height: 42, padding: "0 12px", border: "1px solid var(--nu-border)", borderRadius: 6 }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: 4, color: "#1e293b" }}>
                        Total Body Surface Area Burned (% TBSA)
                      </label>
                      <input
                        type="number"
                        placeholder="e.g. 35 (2nd & 3rd degree)"
                        value={inputs.tbsa || ""}
                        onChange={(e) => setInputs((p) => ({ ...p, tbsa: e.target.value }))}
                        style={{ width: "100%", height: 42, padding: "0 12px", border: "1px solid var(--nu-border)", borderRadius: 6 }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: 4, color: "#1e293b" }}>
                        Time Elapsed Since Burn (hours)
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        placeholder="e.g. 0 (at time of injury)"
                        value={inputs.elapsedHours || ""}
                        onChange={(e) => setInputs((p) => ({ ...p, elapsedHours: e.target.value }))}
                        style={{ width: "100%", height: 42, padding: "0 12px", border: "1px solid var(--nu-border)", borderRadius: 6 }}
                      />
                    </div>
                  </div>

                  {parklandResult ? (
                    <div style={{ display: "grid", gap: 14 }}>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
                        <div style={{ padding: 14, background: "#EFF6FF", border: "1.5px solid #93C5FD", borderRadius: 8 }}>
                          <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#1E40AF", textTransform: "uppercase" }}>Total 24-Hour Requirement</span>
                          <strong style={{ display: "block", fontSize: "1.3rem", color: "#1E3A8A", margin: "4px 0" }}>
                            {parklandResult.total24hMl.toLocaleString()} mL
                          </strong>
                          <small style={{ color: "#3B82F6", fontWeight: 600 }}>({(parklandResult.total24hMl / 1000).toFixed(2)} Litres Crystalloid)</small>
                        </div>

                        <div style={{ padding: 14, background: "#FEF3C7", border: "1.5px solid #FCD34D", borderRadius: 8 }}>
                          <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#92400E", textTransform: "uppercase" }}>First 8 Hours (50%)</span>
                          <strong style={{ display: "block", fontSize: "1.3rem", color: "#78350F", margin: "4px 0" }}>
                            {parklandResult.first8hRateMlHr} mL/hour
                          </strong>
                          <small style={{ color: "#B45309", fontWeight: 600 }}>
                            {parklandResult.first8hTotalMl.toLocaleString()} mL over {parklandResult.remainingFirst8h} remaining hour(s)
                          </small>
                        </div>

                        <div style={{ padding: 14, background: "#ECFDF5", border: "1.5px solid #6EE7B7", borderRadius: 8 }}>
                          <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#065F46", textTransform: "uppercase" }}>Next 16 Hours (50%)</span>
                          <strong style={{ display: "block", fontSize: "1.3rem", color: "#064E3B", margin: "4px 0" }}>
                            {parklandResult.next16hRateMlHr} mL/hour
                          </strong>
                          <small style={{ color: "#047857", fontWeight: 600 }}>
                            {parklandResult.next16hTotalMl.toLocaleString()} mL over 16 hours
                          </small>
                        </div>
                      </div>

                      <div style={{ padding: 14, background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 8, fontSize: "0.85rem", color: "#334155" }}>
                        <div style={{ marginBottom: 6 }}>
                          <strong style={{ color: "#0F2942" }}>Fluid of Choice:</strong> {parklandResult.fluidChoice}
                        </div>
                        <div style={{ marginBottom: 6 }}>
                          <strong style={{ color: "#0F2942" }}>Adult Urine Output Target:</strong> {parklandResult.adultUrineTarget}
                        </div>
                        <div style={{ marginBottom: 6 }}>
                          <strong style={{ color: "#0F2942" }}>Paediatric (&lt;30 kg) Target:</strong> {parklandResult.paedUrineTarget}
                        </div>
                        <div style={{ marginTop: 8, padding: "8px 12px", background: "#FEF2F2", borderLeft: "3px solid #DC2626", color: "#991B1B", fontSize: "0.82rem" }}>
                          <strong>Critical Bedside Warning:</strong> {parklandResult.clinicalWarning}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div style={{ padding: 14, background: "#f8fafc", border: "1px dashed #cbd5e1", borderRadius: 8, color: "#64748b", fontSize: "0.86rem", textAlign: "center" }}>
                      Enter patient body weight (kg) and % TBSA burned to calculate fluid resuscitation requirements.
                    </div>
                  )}
                </div>
              )}

              {/* ARTERIAL BLOOD GAS (ABG) & ROME INTERPRETER */}
              {calcType === "abg" && (
                <div style={{ display: "grid", gap: 16 }}>
                  <div style={{ padding: "12px 16px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8 }}>
                    <strong style={{ display: "block", color: "#0F2942", fontSize: "0.95rem", marginBottom: 4 }}>
                      Arterial Blood Gas (ABG) &amp; ROME Decision Engine
                    </strong>
                    <small style={{ color: "#475569" }}>
                      Applies the <strong>ROME</strong> rule (Respiratory Opposite, Metabolic Equal) to diagnose acid-base disturbances, assess full/partial compensation, and guide emergency nursing actions.
                    </small>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: 4, color: "#1e293b" }}>
                        Arterial pH
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="e.g. 7.31 (7.35–7.45)"
                        value={inputs.ph || ""}
                        onChange={(e) => setInputs((p) => ({ ...p, ph: e.target.value }))}
                        style={{ width: "100%", height: 42, padding: "0 12px", border: "1px solid var(--nu-border)", borderRadius: 6 }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: 4, color: "#1e293b" }}>
                        PaCO2 (mmHg)
                      </label>
                      <input
                        type="number"
                        placeholder="e.g. 52 (35–45 mmHg)"
                        value={inputs.paco2 || ""}
                        onChange={(e) => setInputs((p) => ({ ...p, paco2: e.target.value }))}
                        style={{ width: "100%", height: 42, padding: "0 12px", border: "1px solid var(--nu-border)", borderRadius: 6 }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: 4, color: "#1e293b" }}>
                        HCO3- (mEq/L or mmol/L)
                      </label>
                      <input
                        type="number"
                        placeholder="e.g. 25 (22–26 mEq/L)"
                        value={inputs.hco3 || ""}
                        onChange={(e) => setInputs((p) => ({ ...p, hco3: e.target.value }))}
                        style={{ width: "100%", height: 42, padding: "0 12px", border: "1px solid var(--nu-border)", borderRadius: 6 }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: 4, color: "#1e293b" }}>
                        PaO2 (mmHg) [Optional]
                      </label>
                      <input
                        type="number"
                        placeholder="e.g. 88 (80–100 mmHg)"
                        value={inputs.pao2 || ""}
                        onChange={(e) => setInputs((p) => ({ ...p, pao2: e.target.value }))}
                        style={{ width: "100%", height: 42, padding: "0 12px", border: "1px solid var(--nu-border)", borderRadius: 6 }}
                      />
                    </div>
                  </div>

                  {abgResult ? (
                    <div style={{ border: "1px solid #CBD5E1", borderRadius: 10, overflow: "hidden" }}>
                      <div style={{ background: abgResult.badgeColor, color: "#fff", padding: "12px 16px" }}>
                        <span style={{ fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.03em" }}>
                          Primary Acid-Base Diagnosis
                        </span>
                        <h3 style={{ margin: "4px 0 2px", fontSize: "1.2rem", color: "#fff" }}>
                          {abgResult.primaryDisorder}
                        </h3>
                        <small style={{ opacity: 0.9 }}>Compensation Status: {abgResult.compensation}</small>
                      </div>

                      <div style={{ padding: 16, background: "#ffffff", display: "grid", gap: 12 }}>
                        {abgResult.oxygenationStatus && (
                          <div style={{ padding: "8px 12px", background: "#F1F5F9", borderRadius: 6, fontSize: "0.85rem", color: "#334155" }}>
                            <strong>Oxygenation:</strong> {abgResult.oxygenationStatus}
                          </div>
                        )}

                        <div>
                          <strong style={{ color: "#0F2942", display: "block", fontSize: "0.86rem", marginBottom: 6 }}>
                            Common Clinical Etiologies:
                          </strong>
                          <ul style={{ margin: 0, paddingLeft: 18, fontSize: "0.84rem", color: "#475569" }}>
                            {abgResult.causes.map((c, idx) => (
                              <li key={idx} style={{ marginBottom: 3 }}>{c}</li>
                            ))}
                          </ul>
                        </div>

                        <div style={{ padding: "10px 14px", background: "#EFF6FF", borderLeft: "4px solid #2563EB", borderRadius: 6 }}>
                          <strong style={{ color: "#1E40AF", display: "block", fontSize: "0.86rem", marginBottom: 6 }}>
                            Priority Bedside Nursing Actions:
                          </strong>
                          <ul style={{ margin: 0, paddingLeft: 18, fontSize: "0.84rem", color: "#1E3A8A" }}>
                            {abgResult.nursingActions.map((a, idx) => (
                              <li key={idx} style={{ marginBottom: 4 }}>{a}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div style={{ padding: 14, background: "#f8fafc", border: "1px dashed #cbd5e1", borderRadius: 8, color: "#64748b", fontSize: "0.86rem", textAlign: "center" }}>
                      Enter pH, PaCO2, and HCO3- values to generate the ABG interpretation and nursing response.
                    </div>
                  )}
                </div>
              )}

              {/* PAEDIATRIC EMERGENCY WEIGHT-BASED DOSER */}
              {calcType === "paed_emergency" && (
                <div style={{ display: "grid", gap: 16 }}>
                  <div style={{ padding: "12px 16px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8 }}>
                    <strong style={{ display: "block", color: "#0F2942", fontSize: "0.95rem", marginBottom: 4 }}>
                      Paediatric Emergency Weight-Based Resuscitation Doser
                    </strong>
                    <small style={{ color: "#475569" }}>
                      WHO / APLS critical emergency dosing for Severe Malaria, Anaphylaxis, Sepsis/Meningitis, Status Epilepticus, and Dehydration. Enter known weight or estimate by age.
                    </small>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: 4, color: "#1e293b" }}>
                        Known Weight (kg) [Preferred]
                      </label>
                      <input
                        type="number"
                        placeholder="e.g. 12"
                        value={inputs.paedWt || ""}
                        onChange={(e) => setInputs((p) => ({ ...p, paedWt: e.target.value }))}
                        style={{ width: "100%", height: 42, padding: "0 12px", border: "1px solid var(--nu-border)", borderRadius: 6 }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: 4, color: "#1e293b" }}>
                        OR Child Age (Years)
                      </label>
                      <input
                        type="number"
                        placeholder="e.g. 2"
                        value={inputs.paedAgeYears || ""}
                        onChange={(e) => setInputs((p) => ({ ...p, paedAgeYears: e.target.value }))}
                        style={{ width: "100%", height: 42, padding: "0 12px", border: "1px solid var(--nu-border)", borderRadius: 6 }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: 4, color: "#1e293b" }}>
                        OR Infant Age (Months &lt;1 yr)
                      </label>
                      <input
                        type="number"
                        placeholder="e.g. 6"
                        value={inputs.paedAgeMonths || ""}
                        onChange={(e) => setInputs((p) => ({ ...p, paedAgeMonths: e.target.value }))}
                        style={{ width: "100%", height: 42, padding: "0 12px", border: "1px solid var(--nu-border)", borderRadius: 6 }}
                      />
                    </div>
                  </div>

                  {paedEmergencyResult ? (
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, padding: "8px 14px", background: "#0F2942", color: "#fff", borderRadius: 8 }}>
                        <span style={{ fontSize: "0.88rem", fontWeight: 700 }}>Calculated Emergency Dosages</span>
                        <span style={{ fontSize: "0.82rem", background: "rgba(255,255,255,0.2)", padding: "3px 8px", borderRadius: 4 }}>
                          Effective Child Weight: <strong>{paedEmergencyResult.weightKg} kg</strong>
                        </span>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 12 }}>
                        {paedEmergencyResult.drugs.map((d, idx) => (
                          <div key={idx} style={{ border: "1px solid #CBD5E1", borderRadius: 8, padding: 14, background: "#ffffff", display: "flex", flexDirection: "column", gap: 6 }}>
                            <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#2563EB", textTransform: "uppercase" }}>{d.name}</span>
                            <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "#0F2942" }}>
                              {d.dose}
                            </div>
                            <small style={{ color: "#475569" }}><strong>Rate:</strong> {d.rate}</small>
                            <small style={{ color: "#475569" }}><strong>Schedule:</strong> {d.schedule}</small>
                            <div style={{ marginTop: 4, padding: "6px 8px", background: "#F8FAFC", borderLeft: "2px solid #2563EB", fontSize: "0.76rem", color: "#334155" }}>
                              <strong>Pearl:</strong> {d.pearl}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div style={{ padding: 14, background: "#f8fafc", border: "1px dashed #cbd5e1", borderRadius: 8, color: "#64748b", fontSize: "0.86rem", textAlign: "center" }}>
                      Enter child weight or age to calculate critical emergency medications.
                    </div>
                  )}
                </div>
              )}

              {/* ROUTINE WARD CALCULATORS (DRIP, TABLET, LIQUID, PAED) */}
              {["drip", "tablet", "liquid", "paed"].includes(calcType) && (
                <div>
                  <div style={{ display: "grid", gap: 12 }}>
                    {calcType === "drip" && (
                      <>
                        <input type="number" placeholder="Total volume (mL) e.g. 1000" value={inputs.vol || ""} onChange={(e) => setInputs((p) => ({ ...p, vol: e.target.value }))} style={{ height: 42, padding: "0 12px", border: "1px solid var(--nu-border)", borderRadius: 6 }} />
                        <input type="number" placeholder="Time (hours) e.g. 8" value={inputs.hrs || ""} onChange={(e) => setInputs((p) => ({ ...p, hrs: e.target.value }))} style={{ height: 42, padding: "0 12px", border: "1px solid var(--nu-border)", borderRadius: 6 }} />
                        <input type="number" placeholder="Drop factor (drops/mL) e.g. 20" value={inputs.df || ""} onChange={(e) => setInputs((p) => ({ ...p, df: e.target.value }))} style={{ height: 42, padding: "0 12px", border: "1px solid var(--nu-border)", borderRadius: 6 }} />
                      </>
                    )}
                    {calcType === "tablet" && (
                      <>
                        <input type="number" placeholder="Dose ordered (mg) e.g. 500" value={inputs.ord || ""} onChange={(e) => setInputs((p) => ({ ...p, ord: e.target.value }))} style={{ height: 42, padding: "0 12px", border: "1px solid var(--nu-border)", borderRadius: 6 }} />
                        <input type="number" placeholder="Dose per tablet (mg) e.g. 250" value={inputs.avail || ""} onChange={(e) => setInputs((p) => ({ ...p, avail: e.target.value }))} style={{ height: 42, padding: "0 12px", border: "1px solid var(--nu-border)", borderRadius: 6 }} />
                      </>
                    )}
                    {calcType === "liquid" && (
                      <>
                        <input type="number" placeholder="Dose ordered (mg) e.g. 250" value={inputs.ord || ""} onChange={(e) => setInputs((p) => ({ ...p, ord: e.target.value }))} style={{ height: 42, padding: "0 12px", border: "1px solid var(--nu-border)", borderRadius: 6 }} />
                        <input type="number" placeholder="Concentration (mg) e.g. 125" value={inputs.conc || ""} onChange={(e) => setInputs((p) => ({ ...p, conc: e.target.value }))} style={{ height: 42, padding: "0 12px", border: "1px solid var(--nu-border)", borderRadius: 6 }} />
                        <input type="number" placeholder="Volume per dose (mL) e.g. 5" value={inputs.vol || ""} onChange={(e) => setInputs((p) => ({ ...p, vol: e.target.value }))} style={{ height: 42, padding: "0 12px", border: "1px solid var(--nu-border)", borderRadius: 6 }} />
                      </>
                    )}
                    {calcType === "paed" && (
                      <>
                        <input type="number" placeholder="Child weight (kg) e.g. 15" value={inputs.wt || ""} onChange={(e) => setInputs((p) => ({ ...p, wt: e.target.value }))} style={{ height: 42, padding: "0 12px", border: "1px solid var(--nu-border)", borderRadius: 6 }} />
                        <input type="number" placeholder="Dose per kg (mg/kg) e.g. 10" value={inputs.dosekg || ""} onChange={(e) => setInputs((p) => ({ ...p, dosekg: e.target.value }))} style={{ height: 42, padding: "0 12px", border: "1px solid var(--nu-border)", borderRadius: 6 }} />
                      </>
                    )}
                  </div>

                  <div style={{ marginTop: 18, padding: 16, background: "var(--nu-purple-soft)", border: "1px solid var(--nu-purple-border)", borderRadius: 8 }}>
                    <strong>Result:</strong>{" "}
                    <span style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--nu-purple-hover)" }}>
                      {calcResult || "Enter values above"}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {tab === "templates" && (
            <div>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 12,
                  padding: "14px 18px",
                  background: "#F0F5FA",
                  border: "1px solid #94B3D1",
                  borderRadius: 10,
                  marginBottom: 20
                }}
              >
                <div>
                  <strong style={{ color: "#0F2942", display: "block" }}>
                    Printable Nursing Ward Charts &amp; Logbook Forms (Direct Binary .pdf)
                  </strong>
                  <small style={{ color: "#334155" }}>
                    Download clean blank clinical worksheets or include a pre-filled UNMEB/NMC example inside the PDF.
                  </small>
                </div>
                <label style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: "0.86rem", fontWeight: 700, color: "#0F2942", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={includeSampleInTemplate}
                    onChange={(e) => setIncludeSampleInTemplate(e.target.checked)}
                  />
                  Include worked study sample (Care Plan / SBAR)
                </label>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(295px, 1fr))", gap: 18 }}>
                {NURSING_TEMPLATES.map((tpl) => (
                  <article
                    key={tpl.id}
                    style={{
                      border: "1px solid var(--nu-border)",
                      borderTop: `4px solid ${tpl.colorHex}`,
                      borderRadius: 10,
                      padding: 20,
                      background: "#ffffff",
                      display: "flex",
                      flexDirection: "column",
                      gap: 10
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                      <span className="nu-badge nu-badge-free">{tpl.category}</span>
                      <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#64748b" }}>{tpl.orientation}</span>
                    </div>
                    <h2 style={{ margin: 0, fontSize: "1.05rem", color: "#0F2942" }}>{tpl.title}</h2>
                    <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--nu-ink-muted)", flex: 1 }}>{tpl.desc}</p>
                    <button
                      type="button"
                      className="nu-btn nu-btn-primary"
                      style={{ width: "100%", background: tpl.colorHex, borderColor: tpl.colorHex }}
                      onClick={() => downloadNursingTemplatePdf(tpl.id, { withSample: includeSampleInTemplate })}
                    >
                      <Download size={15} /> Download Template (.pdf)
                    </button>
                  </article>
                ))}
              </div>
            </div>
          )}

          {tab === "checklists" && activeChecklist && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 }}>
              <div style={{ display: "grid", gap: 8, alignContent: "start" }}>
                {data.checklists.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setActiveChecklistId(c.id)}
                    style={{
                      textAlign: "left",
                      padding: "10px 14px",
                      border: "1px solid var(--nu-border)",
                      background: c.id === activeChecklist.id ? "var(--nu-ink)" : "#fff",
                      color: c.id === activeChecklist.id ? "#fff" : "var(--nu-ink)",
                      fontWeight: 600
                    }}
                  >
                    {c.title}
                  </button>
                ))}
              </div>

              <div style={{ border: "1px solid var(--nu-border)", padding: 24, background: "#fff" }}>
                <span className="nu-badge nu-badge-highyield">{activeChecklist.category}</span>
                <h2 style={{ margin: "8px 0 16px" }}>{activeChecklist.title}</h2>
                <div style={{ display: "grid", gap: 10 }}>
                  {activeChecklist.steps.map((st, idx) => {
                    const key = `${activeChecklist.id}-${idx}`;
                    const checked = !!checkedSteps[key];
                    return (
                      <label key={idx} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "8px 10px", background: st.critical ? "#fefcf7" : "transparent", borderBottom: "1px solid var(--nu-border-light)", cursor: "pointer" }}>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => setCheckedSteps((p) => ({ ...p, [key]: !p[key] }))}
                          style={{ marginTop: 4 }}
                        />
                        <span style={{ textDecoration: checked ? "line-through" : "none" }}>
                          {st.text}{" "}
                          {st.critical && <strong style={{ color: "var(--nu-danger)", fontSize: "0.75rem" }}>[CRITICAL]</strong>}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {tab === "values" && (
            <div style={{ display: "grid", gap: 20 }}>
              {/* SI vs US Conventional Exam Unit Switcher */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 12,
                  padding: "14px 18px",
                  background: "#F0F5FA",
                  border: "1px solid #94B3D1",
                  borderRadius: 10
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Globe2 size={20} color="#0F2942" />
                  <div>
                    <strong style={{ color: "#0F2942", display: "block" }}>Unit System Toggle (SI vs US Conventional)</strong>
                    <small style={{ color: "#334155" }}>
                      {unitSystem === "si"
                        ? "Active: SI Units (mmol/L, °C, µmol/L, g/L) | used in Uganda UHPAB/UNMEB, Kenya, UK NMC, Canada & Australia."
                        : "Active: US Conventional Units (mg/dL, °F, g/dL) | used in US NextGen NCLEX-RN & CGFNS."}
                    </small>
                  </div>
                </div>
                <div style={{ display: "inline-flex", gap: 6, flexWrap: "wrap" }}>
                  <button
                    type="button"
                    className="nu-btn"
                    style={{
                      height: 36,
                      fontSize: "0.82rem",
                      background: unitSystem === "si" ? "#0F2942" : "#ffffff",
                      color: unitSystem === "si" ? "#ffffff" : "#0F2942",
                      border: `1.5px solid ${unitSystem === "si" ? "#0F2942" : "#94B3D1"}`
                    }}
                    onClick={() => setUnitSystem("si")}
                  >
                    SI Units (Uganda / UK / EAC)
                  </button>
                  <button
                    type="button"
                    className="nu-btn"
                    style={{
                      height: 36,
                      fontSize: "0.82rem",
                      background: unitSystem === "us" ? "#0F2942" : "#ffffff",
                      color: unitSystem === "us" ? "#ffffff" : "#0F2942",
                      border: `1.5px solid ${unitSystem === "us" ? "#0F2942" : "#94B3D1"}`
                    }}
                    onClick={() => setUnitSystem("us")}
                  >
                    US / NCLEX Units (mg/dL, °F)
                  </button>
                </div>
              </div>

              {/* Side-by-side SI vs US quick conversion sheet */}
              <div style={{ border: "1px solid var(--nu-border)", background: "#fff", borderRadius: 10, overflow: "hidden" }}>
                <div style={{ padding: "11px 16px", background: "#0F2942", color: "#fff", fontWeight: 700, fontSize: "0.88rem", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                  <span>High-Yield SI ↔ US Exam Conversion Reference</span>
                  <Link to="/global-nursing" style={{ color: "#dbeafe", textDecoration: "underline", fontSize: "0.82rem" }}>
                    View International Nursing Country Guides &rarr;
                  </Link>
                </div>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.88rem" }}>
                    <thead>
                      <tr style={{ background: "#f8fafc", borderBottom: "1px solid var(--nu-border)" }}>
                        <th style={{ padding: "9px 14px" }}>Laboratory Parameter</th>
                        <th style={{ padding: "9px 14px" }}>SI Range (Uganda / UK / Canada)</th>
                        <th style={{ padding: "9px 14px" }}>US Conventional (NCLEX-RN)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {QUICK_SI_US_CHEATSHEET.map((r) => (
                        <tr key={r.test} style={{ borderBottom: "1px solid var(--nu-border-light)" }}>
                          <td style={{ padding: "8px 14px", fontWeight: 600 }}>{r.test}</td>
                          <td style={{ padding: "8px 14px", color: unitSystem === "si" ? "#0F2942" : "#64748b", fontWeight: unitSystem === "si" ? 700 : 400 }}>{r.si}</td>
                          <td style={{ padding: "8px 14px", color: unitSystem === "us" ? "#0F2942" : "#64748b", fontWeight: unitSystem === "us" ? 700 : 400 }}>{r.us}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {Object.entries(data.normalValues).map(([key, group]) => (
                <div key={key} style={{ border: "1px solid var(--nu-border)", background: "#fff" }}>
                  <div style={{ padding: "12px 16px", background: "var(--nu-bg-subtle)", fontWeight: 700, borderBottom: "1px solid var(--nu-border)", display: "flex", justifyContent: "space-between" }}>
                    <span>{group.label}</span>
                    <span style={{ fontSize: "0.78rem", color: "#0F2942" }}>{unitSystem === "si" ? "SI Units" : "US Units"}</span>
                  </div>
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                      <tbody>
                        {group.items.map((rawItem, idx) => {
                          const item = formatLabItemForUnit(rawItem, unitSystem);
                          return (
                            <tr key={idx} style={{ borderBottom: "1px solid var(--nu-border-light)" }}>
                              <td style={{ padding: "10px 16px", fontWeight: 600 }}>{item.name}</td>
                              <td style={{ padding: "10px 16px", fontWeight: 700, color: "var(--nu-purple-text)" }}>
                                {item.value} {item.unit}
                              </td>
                              <td style={{ padding: "10px 16px", fontSize: "0.86rem", color: "var(--nu-ink-muted)" }}>
                                {item.note || ""}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          )}

          <AdSlot slot="clinical-tools-bottom" />
          <ReferencesBox references={data.references} heading="Clinical Guidelines &amp; Procedure Sources" />
        </div>
      </section>
    </main>
  );
}
