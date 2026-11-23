import React, { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import AdSlot from "../components/AdSlot";
import ReferencesBox from "../components/ReferencesBox";

const INSTRUMENT_REFS = [
  {
    id: "openrn-skills",
    citation: "Ernstmeyer K, Christman E, editors. Nursing Skills. 2nd ed. Eau Claire (WI): Chippewa Valley Technical College / Open RN; 2023.",
    type: "Clinical Skills Textbook",
    url: "https://www.ncbi.nlm.nih.gov/books/NBK596735/"
  },
  {
    id: "who-ipc-manual",
    citation: "World Health Organization. Guidelines on Core Components of Infection Prevention and Control Programmes. Geneva: WHO; 2016.",
    type: "International IPC Guideline",
    url: "https://www.who.int/publications/i/item/9789241549929"
  }
];

export default function InstrumentsPage() {
  const [data, setData] = useState(null);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetch("/assets/data/medical-instruments.json")
      .then((r) => r.json())
      .then(setData);
  }, []);

  const allItems = useMemo(() => {
    if (!data?.categories) return [];
    return data.categories.flatMap((c) => c.items || []);
  }, [data]);

  const categories = useMemo(() => {
    if (!data?.categories) return ["All"];
    return ["All", ...data.categories.map((c) => c.title)];
  }, [data]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return allItems.filter((it) => {
      if (cat !== "All" && it.category !== cat) return false;
      if (!query) return true;
      return `${it.name} ${it.category} ${it.use} ${it.safety}`.toLowerCase().includes(query);
    });
  }, [allItems, q, cat]);

  if (!data) {
    return (
      <main className="nu-section">
        <div className="nu-container"><p>Loading medical instrument atlas...</p></div>
      </main>
    );
  }

  return (
    <main>
      <section className="nu-cl-hero">
        <div className="nu-container">
          <span className="nu-badge nu-badge-free" style={{ marginBottom: 10 }}>OSCE Visual Reference</span>
          <h1>Medical Instrument Atlas ({data.count} Instruments)</h1>
          <p className="nu-cl-subtitle" style={{ maxWidth: 720 }}>
            Visual identification, clinical use, sterile preparation, and OSCE exam safety points for surgical, obstetric, airway, and ward equipment.
          </p>
        </div>
      </section>

      <section className="nu-section">
        <div className="nu-container">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, border: "1px solid var(--nu-border)", padding: "0 12px", height: 42, flex: "1 1 260px", maxWidth: 420 }}>
              <Search size={16} color="#6a6f73" />
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search forceps, speculum, stethoscope, airway..."
                style={{ border: 0, outline: "none", width: "100%" }}
              />
            </div>

            <select
              value={cat}
              onChange={(e) => setCat(e.target.value)}
              style={{ height: 42, padding: "0 12px", border: "1px solid var(--nu-border)", background: "#fff" }}
            >
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {selected && (
            <div style={{ border: "2px solid var(--nu-purple)", padding: 24, marginBottom: 28, background: "#fff" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
                <div>
                  <span className="nu-badge nu-badge-highyield">{selected.category}</span>
                  <h2 style={{ margin: "8px 0" }}>{selected.name}</h2>
                </div>
                <button type="button" className="nu-btn nu-btn-outline" onClick={() => setSelected(null)}>
                  Close Detail
                </button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 24, marginTop: 12 }}>
                <img
                  src={`/${selected.image}`}
                  alt={selected.imageAlt || selected.name}
                  style={{ width: "100%", height: 200, objectFit: "contain", border: "1px solid var(--nu-border-light)", background: "#fff" }}
                />
                <div style={{ display: "grid", gap: 10, fontSize: "0.94rem" }}>
                  <p style={{ margin: 0 }}><strong>Clinical Use:</strong> {selected.use}</p>
                  <p style={{ margin: 0 }}><strong>Preparation &amp; Sterility:</strong> {selected.preparation}</p>
                  <p style={{ margin: 0 }}><strong>Safety Point:</strong> {selected.safety}</p>
                  {selected.examPoints && (
                    <div>
                      <strong>OSCE / Practical Exam Points:</strong>
                      <ul style={{ margin: "6px 0 0", paddingLeft: 18 }}>
                        {selected.examPoints.map((pt, i) => <li key={i}>{pt}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="nu-course-grid">
            {filtered.map((item) => (
              <button
                key={item.slug}
                type="button"
                onClick={() => setSelected(item)}
                style={{
                  textAlign: "left",
                  border: "1px solid var(--nu-border)",
                  background: "#fff",
                  padding: 12,
                  display: "flex",
                  flexDirection: "column",
                  gap: 8
                }}
              >
                <div style={{ aspectRatio: "16/10", background: "#fff", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <img
                    src={`/${item.image}`}
                    alt={item.name}
                    style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }}
                    loading="lazy"
                  />
                </div>
                <strong style={{ fontSize: "0.95rem" }}>{item.name}</strong>
                <small style={{ color: "var(--nu-ink-muted)" }}>{item.category}</small>
              </button>
            ))}
          </div>

          <AdSlot slot="instruments-bottom" />
          <ReferencesBox references={INSTRUMENT_REFS} heading="Instrument &amp; Sterile Technique References" />
        </div>
      </section>
    </main>
  );
}
