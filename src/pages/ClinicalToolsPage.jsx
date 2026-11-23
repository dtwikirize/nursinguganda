import React, { useEffect, useState } from "react";
import { Calculator, CheckSquare, HeartPulse } from "lucide-react";
import AdSlot from "../components/AdSlot";
import ReferencesBox from "../components/ReferencesBox";

export default function ClinicalToolsPage() {
  const [data, setData] = useState(null);
  const [tab, setTab] = useState("calc");
  const [calcType, setCalcType] = useState("drip");
  const [inputs, setInputs] = useState({});
  const [activeChecklistId, setActiveChecklistId] = useState("hand-hygiene");
  const [checkedSteps, setCheckedSteps] = useState({});

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
        <div className="nu-container"><p>Loading clinical tools...</p></div>
      </main>
    );
  }

  const activeChecklist = data.checklists.find((c) => c.id === activeChecklistId) || data.checklists[0];

  return (
    <main>
      <section className="nu-cl-hero">
        <div className="nu-container">
          <span className="nu-badge nu-badge-free" style={{ marginBottom: 10 }}>Free Ward &amp; OSCE Toolkit</span>
          <h1>Clinical Calculators, Checklists &amp; Normal Values</h1>
          <p className="nu-cl-subtitle" style={{ maxWidth: 720 }}>
            Fast bedside drug dosage &amp; IV drip rate calculators, OSCE procedure checklists, and adult/paediatric reference ranges.
          </p>
        </div>
      </section>

      <section className="nu-section">
        <div className="nu-container">
          <div className="nu-tabs">
            <button type="button" className={`nu-tab ${tab === "calc" ? "active" : ""}`} onClick={() => setTab("calc")}>
              <Calculator size={15} style={{ display: "inline", marginRight: 6 }} />
              Drug &amp; IV Calculators
            </button>
            <button type="button" className={`nu-tab ${tab === "checklists" ? "active" : ""}`} onClick={() => setTab("checklists")}>
              <CheckSquare size={15} style={{ display: "inline", marginRight: 6 }} />
              OSCE Checklists ({data.checklists.length})
            </button>
            <button type="button" className={`nu-tab ${tab === "values" ? "active" : ""}`} onClick={() => setTab("values")}>
              <HeartPulse size={15} style={{ display: "inline", marginRight: 6 }} />
              Normal Lab &amp; Vital Values
            </button>
          </div>

          {tab === "calc" && (
            <div style={{ maxWidth: 640, border: "1px solid var(--nu-border)", padding: 24, background: "#fff" }}>
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

              <div style={{ marginTop: 18, padding: 16, background: "var(--nu-purple-soft)", border: "1px solid var(--nu-purple-border)" }}>
                <strong>Result:</strong>{" "}
                <span style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--nu-purple-hover)" }}>
                  {calcResult || "Enter values above"}
                </span>
              </div>
            </div>
          )}

          {tab === "checklists" && activeChecklist && (
            <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 24 }}>
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
            <div style={{ display: "grid", gap: 24 }}>
              {Object.entries(data.normalValues).map(([key, group]) => (
                <div key={key} style={{ border: "1px solid var(--nu-border)", background: "#fff" }}>
                  <div style={{ padding: "12px 16px", background: "var(--nu-bg-subtle)", fontWeight: 700, borderBottom: "1px solid var(--nu-border)" }}>
                    {group.label}
                  </div>
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                      <tbody>
                        {group.items.map((item, idx) => (
                          <tr key={idx} style={{ borderBottom: "1px solid var(--nu-border-light)" }}>
                            <td style={{ padding: "10px 16px", fontWeight: 600 }}>{item.name}</td>
                            <td style={{ padding: "10px 16px", fontWeight: 700, color: "var(--nu-purple)" }}>
                              {item.value} {item.unit}
                            </td>
                            <td style={{ padding: "10px 16px", fontSize: "0.86rem", color: "var(--nu-ink-muted)" }}>
                              {item.note || ""}
                            </td>
                          </tr>
                        ))}
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
