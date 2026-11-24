import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  Search,
  ShieldAlert,
  Sparkles,
  Wrench,
  X
} from "lucide-react";
import AdSlot from "../components/AdSlot";
import NursingLoader from "../components/NursingLoader";
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

function normalizeInstImg(rawPath) {
  const s = String(rawPath || "").replace(/^\//, "");
  return s ? `/${s}?v=20261124c` : "";
}

function getShortCategoryLabel(title) {
  return String(title || "")
    .replace(" And ", " & ")
    .replace(" Equipment", "")
    .replace(" Instruments", "")
    .replace(" Care", "");
}

function getSterileBadge(sterilizationText = "") {
  const s = sterilizationText.toLowerCase();
  if (s.includes("autoclave")) return "Steam Autoclave";
  if (s.includes("single-use") || s.includes("disposable")) return "Sterile Single-Use";
  if (s.includes("high-level disinfection") || s.includes("glutaraldehyde")) return "HLD / Disinfect";
  if (s.includes("chlorine") || s.includes("alcohol")) return "0.5% Chlorine / Alcohol";
  return "IPC Standard";
}

export default function InstrumentsPage() {
  const [searchParams] = useSearchParams();
  const initialCatParam = searchParams.get("cat") || "";
  const initialQParam = searchParams.get("q") || "";
  const [data, setData] = useState(null);
  const [q, setQ] = useState(initialQParam);
  const [cat, setCat] = useState("All");
  const [selected, setSelected] = useState(null);
  const detailRef = useRef(null);

  useEffect(() => {
    fetch("/assets/data/medical-instruments.json")
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        if (initialCatParam && d?.categories) {
          const match = d.categories.find((c) => c.title.toLowerCase().includes(initialCatParam.toLowerCase()));
          if (match) setCat(match.title);
        }
      });
  }, [initialCatParam]);

  const allItems = useMemo(() => {
    if (!data?.categories) return [];
    return data.categories.flatMap((c) => c.items || []);
  }, [data]);

  const categoryButtons = useMemo(() => {
    if (!data?.categories) return [{ title: "All", label: "All Instruments", count: 0 }];
    return [
      { title: "All", label: "All Instruments", count: allItems.length },
      ...data.categories.map((c) => ({
        title: c.title,
        label: getShortCategoryLabel(c.title),
        count: (c.items || []).length
      }))
    ];
  }, [data, allItems.length]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return allItems.filter((it) => {
      if (cat !== "All" && it.category !== cat) return false;
      if (!query) return true;
      return `${it.name} ${it.category} ${it.use} ${it.safety} ${it.sterilization || ""}`
        .toLowerCase()
        .includes(query);
    });
  }, [allItems, q, cat]);

  const handleSelectInstrument = (item) => {
    setSelected(item);
    setTimeout(() => {
      detailRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 40);
  };

  if (!data) {
    return (
      <main className="nu-section">
        <div className="nu-container">
          <NursingLoader label="Loading 146-Item Medical Instrument Atlas..." />
        </div>
      </main>
    );
  }

  return (
    <main style={{ background: "#F8FAFC" }}>
      <section className="nu-cl-hero">
        <div className="nu-container">
          <span className="nu-badge nu-badge-free" style={{ marginBottom: 10 }}>
            <Sparkles size={13} style={{ display: "inline", marginRight: 4 }} /> OSCE Visual &amp; Sterile Reference
          </span>
          <h1>Medical Instrument Atlas ({data.count} Instruments)</h1>
          <p className="nu-cl-subtitle" style={{ maxWidth: 740 }}>
            High-resolution identification plates, clinical indications, steam autoclaving / IPC reprocessing standards, and 4-point UNMEB OSCE exam checklists.
          </p>
        </div>
      </section>

      <section className="nu-section" style={{ paddingTop: 28 }}>
        <div className="nu-container">
          {/* Search + Result Counter Row */}
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 14, marginBottom: 16 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                border: "1px solid #cbd5e1",
                borderRadius: 999,
                background: "#fff",
                padding: "0 16px",
                height: 44,
                flex: "1 1 300px",
                maxWidth: 480,
                boxShadow: "0 2px 6px rgba(15, 23, 42, 0.04)"
              }}
            >
              <Search size={17} color="#6a6f73" />
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search forceps, speculum, cannula, ambu bag, laryngoscope..."
                style={{ border: 0, outline: "none", width: "100%", fontSize: "0.92rem", background: "transparent" }}
              />
            </div>

            <div style={{ fontSize: "0.88rem", color: "var(--nu-ink-muted)", fontWeight: 600 }}>
              Showing <strong>{filtered.length}</strong> of {data.count} clinical instruments
              {(q || cat !== "All") && (
                <button
                  type="button"
                  onClick={() => {
                    setQ("");
                    setCat("All");
                  }}
                  style={{
                    marginLeft: 10,
                    background: "none",
                    border: "none",
                    color: "#A137F2",
                    fontWeight: 700,
                    cursor: "pointer",
                    textDecoration: "underline"
                  }}
                >
                  Reset filters
                </button>
              )}
            </div>
          </div>

          {/* Interactive Category Pill Filter Buttons (No Dropdown) */}
          <div className="nu-inst-filter-bar" role="group" aria-label="Filter instruments by clinical category">
            {categoryButtons.map((cb) => {
              const isActive = cat === cb.title;
              return (
                <button
                  key={cb.title}
                  type="button"
                  className={`nu-inst-filter-btn ${isActive ? "active" : ""}`}
                  aria-pressed={isActive}
                  onClick={() => {
                    setCat(cb.title);
                    setSelected(null);
                  }}
                >
                  <span>{cb.label}</span>
                  <span className="nu-inst-filter-count">{cb.count}</span>
                </button>
              );
            })}
          </div>

          {/* Premium Selected Instrument Detail Inspector */}
          {selected && (
            <div ref={detailRef} className="nu-inst-detail-panel">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap", borderBottom: "1px solid #f1f5f9", paddingBottom: 14 }}>
                <div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", marginBottom: 6 }}>
                    <span className="nu-badge nu-badge-highyield">{selected.category}</span>
                    {selected.sterilization && (
                      <span className="nu-inst-ipc-tag">
                        <CheckCircle2 size={13} /> {getSterileBadge(selected.sterilization)}
                      </span>
                    )}
                  </div>
                  <h2 style={{ margin: 0, fontSize: "1.45rem" }}>{selected.name}</h2>
                </div>
                <button
                  type="button"
                  className="nu-btn nu-btn-outline"
                  style={{ height: 36, padding: "0 12px", fontSize: "0.84rem" }}
                  onClick={() => setSelected(null)}
                >
                  <X size={15} /> Close Inspector
                </button>
              </div>

              <div className="nu-inst-detail-grid">
                <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, padding: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <img
                    src={normalizeInstImg(selected.image)}
                    alt={selected.imageAlt || selected.name}
                    style={{ width: "100%", height: 220, objectFit: "contain", background: "#fff", borderRadius: 6 }}
                  />
                </div>

                <div style={{ display: "grid", gap: 12, fontSize: "0.94rem" }}>
                  <div style={{ padding: "10px 14px", background: "#FAF5FF", borderLeft: "4px solid #A137F2", borderRadius: "0 6px 6px 0" }}>
                    <strong style={{ color: "#5b21b6", display: "block", marginBottom: 2 }}>Clinical Use &amp; Indications</strong>
                    <span>{selected.use}</span>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
                    <div style={{ padding: 12, border: "1px solid #e2e8f0", borderRadius: 8, background: "#fff" }}>
                      <strong style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4, fontSize: "0.86rem" }}>
                        <Wrench size={14} color="#0284c7" /> Pre-Procedure Setup
                      </strong>
                      <span style={{ fontSize: "0.86rem", color: "#334155" }}>{selected.preparation}</span>
                    </div>

                    {selected.sterilization && (
                      <div style={{ padding: 12, border: "1px solid #bbf7d0", borderRadius: 8, background: "#f0fdf4" }}>
                        <strong style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4, fontSize: "0.86rem", color: "#166534" }}>
                          <CheckCircle2 size={14} /> Sterilization / IPC
                        </strong>
                        <span style={{ fontSize: "0.86rem", color: "#14532d" }}>{selected.sterilization}</span>
                      </div>
                    )}
                  </div>

                  <div style={{ padding: "10px 14px", background: "#FEFCE8", border: "1px solid #FDE047", borderRadius: 8, display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <ShieldAlert size={17} color="#a16207" style={{ flexShrink: 0, marginTop: 2 }} />
                    <div style={{ fontSize: "0.88rem", color: "#713F12" }}>
                      <strong>Patient Safety Watchpoint:</strong> {selected.safety}
                    </div>
                  </div>

                  {selected.examPoints && (
                    <div style={{ padding: 14, border: "1px solid #e2e8f0", borderRadius: 8, background: "#f8fafc" }}>
                      <strong style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                        <ClipboardCheck size={16} color="#A137F2" /> UNMEB OSCE Practical Checklist
                      </strong>
                      <ol style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 5, fontSize: "0.88rem", color: "#334155" }}>
                        {selected.examPoints.map((pt, i) => <li key={i}>{pt}</li>)}
                      </ol>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Premium Instrument Cards Grid */}
          {filtered.length === 0 ? (
            <div style={{ padding: 48, textAlign: "center", background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0" }}>
              <h3 style={{ margin: "0 0 8px" }}>No matching instruments found</h3>
              <p style={{ color: "var(--nu-ink-muted)", marginBottom: 16 }}>
                Try another keyword or clear your category filter.
              </p>
              <button
                type="button"
                className="nu-btn nu-btn-primary"
                onClick={() => {
                  setQ("");
                  setCat("All");
                }}
              >
                Show All {data.count} Instruments
              </button>
            </div>
          ) : (
            <div className="nu-inst-grid">
              {filtered.map((item) => {
                const isSelected = selected?.slug === item.slug;

                return (
                  <button
                    key={item.slug}
                    type="button"
                    className={`nu-inst-card ${isSelected ? "selected" : ""}`}
                    onClick={() => handleSelectInstrument(item)}
                  >
                    <div className="nu-inst-card-media">
                      <span className="nu-inst-cat-pill">{getShortCategoryLabel(item.category)}</span>
                      <img
                        src={normalizeInstImg(item.image)}
                        alt={item.name}
                        loading="lazy"
                      />
                    </div>
                    <div className="nu-inst-card-body">
                      <h3 className="nu-inst-card-title">{item.name}</h3>
                      <p className="nu-inst-card-desc">{item.use}</p>
                      <div className="nu-inst-card-foot">
                        <span className="nu-inst-ipc-tag">
                          {getSterileBadge(item.sterilization)}
                        </span>
                        <span style={{ color: "#A137F2", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 3 }}>
                          OSCE Guide <ArrowRight size={13} />
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          <AdSlot slot="instruments-bottom" />
          <ReferencesBox references={INSTRUMENT_REFS} heading="Instrument &amp; Sterile Technique References" />
        </div>
      </section>
    </main>
  );
}
