import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Calculator, CheckSquare, Download, FileSpreadsheet, Globe2, HeartPulse } from "lucide-react";
import AdSlot from "../components/AdSlot";
import NursingLoader from "../components/NursingLoader";
import ReferencesBox from "../components/ReferencesBox";
import { formatLabItemForUnit, QUICK_SI_US_CHEATSHEET } from "../utils/labUnits";
import { downloadNursingTemplatePdf, NURSING_TEMPLATES } from "../utils/pdfExport";

export default function ClinicalToolsPage({ initialTabOverride = "" }) {
  const [searchParams] = useSearchParams();
  const rawTab = initialTabOverride || searchParams.get("tab") || "calc";
  const initialTab = rawTab === "normal-values" ? "values" : rawTab;

  const [data, setData] = useState(null);
  const [tab, setTab] = useState(initialTab);
  const [calcType, setCalcType] = useState("drip");
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
            <div style={{ maxWidth: 640, border: "1px solid var(--nu-border)", padding: 24, background: "#fff", borderRadius: 10 }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 18 }}>
                {[
                  ["drip", "IV Drip Rate (drops/min)"],
                  ["tablet", "Tablet Dose"],
                  ["liquid", "Syrup / Liquid Dose"],
                  ["paed", "Paediatric (mg/kg)"]
                ].map(([k, lbl]) => (
                  <button
                    key={k}
                    type="button"
                    className={`nu-btn ${calcType === k ? "nu-btn-dark" : "nu-btn-outline"}`}
                    onClick={() => {
                      setCalcType(k);
                      setInputs({});
                    }}
                  >
                    {lbl}
                  </button>
                ))}
              </div>

              <div style={{ display: "grid", gap: 12 }}>
                {calcType === "drip" && (
                  <>
                    <input type="number" placeholder="Total volume (mL) e.g. 1000" value={inputs.vol || ""} onChange={(e) => setInputs((p) => ({ ...p, vol: e.target.value }))} style={{ height: 42, padding: "0 12px", border: "1px solid var(--nu-border)" }} />
                    <input type="number" placeholder="Time (hours) e.g. 8" value={inputs.hrs || ""} onChange={(e) => setInputs((p) => ({ ...p, hrs: e.target.value }))} style={{ height: 42, padding: "0 12px", border: "1px solid var(--nu-border)" }} />
                    <input type="number" placeholder="Drop factor (drops/mL) e.g. 20" value={inputs.df || ""} onChange={(e) => setInputs((p) => ({ ...p, df: e.target.value }))} style={{ height: 42, padding: "0 12px", border: "1px solid var(--nu-border)" }} />
                  </>
                )}
                {calcType === "tablet" && (
                  <>
                    <input type="number" placeholder="Dose ordered (mg) e.g. 500" value={inputs.ord || ""} onChange={(e) => setInputs((p) => ({ ...p, ord: e.target.value }))} style={{ height: 42, padding: "0 12px", border: "1px solid var(--nu-border)" }} />
                    <input type="number" placeholder="Dose per tablet (mg) e.g. 250" value={inputs.avail || ""} onChange={(e) => setInputs((p) => ({ ...p, avail: e.target.value }))} style={{ height: 42, padding: "0 12px", border: "1px solid var(--nu-border)" }} />
                  </>
                )}
                {calcType === "liquid" && (
                  <>
                    <input type="number" placeholder="Dose ordered (mg) e.g. 250" value={inputs.ord || ""} onChange={(e) => setInputs((p) => ({ ...p, ord: e.target.value }))} style={{ height: 42, padding: "0 12px", border: "1px solid var(--nu-border)" }} />
                    <input type="number" placeholder="Concentration (mg) e.g. 125" value={inputs.conc || ""} onChange={(e) => setInputs((p) => ({ ...p, conc: e.target.value }))} style={{ height: 42, padding: "0 12px", border: "1px solid var(--nu-border)" }} />
                    <input type="number" placeholder="Volume per dose (mL) e.g. 5" value={inputs.vol || ""} onChange={(e) => setInputs((p) => ({ ...p, vol: e.target.value }))} style={{ height: 42, padding: "0 12px", border: "1px solid var(--nu-border)" }} />
                  </>
                )}
                {calcType === "paed" && (
                  <>
                    <input type="number" placeholder="Child weight (kg) e.g. 15" value={inputs.wt || ""} onChange={(e) => setInputs((p) => ({ ...p, wt: e.target.value }))} style={{ height: 42, padding: "0 12px", border: "1px solid var(--nu-border)" }} />
                    <input type="number" placeholder="Dose per kg (mg/kg) e.g. 10" value={inputs.dosekg || ""} onChange={(e) => setInputs((p) => ({ ...p, dosekg: e.target.value }))} style={{ height: 42, padding: "0 12px", border: "1px solid var(--nu-border)" }} />
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
