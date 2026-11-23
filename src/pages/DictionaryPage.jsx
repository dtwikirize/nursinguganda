import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Search } from "lucide-react";
import AdSlot from "../components/AdSlot";
import ReferencesBox from "../components/ReferencesBox";

export default function DictionaryPage() {
  const [data, setData] = useState(null);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [tab, setTab] = useState("terms");

  useEffect(() => {
    fetch("/assets/data/dictionary.json")
      .then((r) => r.json())
      .then(setData);
  }, []);

  const categories = useMemo(() => {
    if (!data?.terms) return ["All"];
    return ["All", ...new Set(data.terms.map((t) => t.category))];
  }, [data]);

  const filteredTerms = useMemo(() => {
    if (!data?.terms) return [];
    const query = q.trim().toLowerCase();
    return data.terms.filter((t) => {
      if (cat !== "All" && t.category !== cat) return false;
      if (!query) return true;
      return `${t.term} ${t.simpleDefinition} ${t.definition} ${t.clinicalContext}`.toLowerCase().includes(query);
    });
  }, [data, q, cat]);

  const filteredAbbr = useMemo(() => {
    if (!data?.abbreviations) return [];
    const query = q.trim().toLowerCase();
    return data.abbreviations.filter((a) =>
      !query || `${a.abbr} ${a.full}`.toLowerCase().includes(query)
    );
  }, [data, q]);

  if (!data) {
    return (
      <main className="nu-section">
        <div className="nu-container"><p>Loading medical dictionary...</p></div>
      </main>
    );
  }

  return (
    <main>
      <section className="nu-cl-hero">
        <div className="nu-container">
          <span className="nu-badge nu-badge-free" style={{ marginBottom: 10 }}>Free Clinical Reference</span>
          <h1>Nursing &amp; Medical Dictionary</h1>
          <p className="nu-cl-subtitle" style={{ maxWidth: 720 }}>
            Plain-language definitions, clinical nursing priorities, mnemonics, and essential ward abbreviations for Ugandan nursing students.
          </p>
        </div>
      </section>

      <section className="nu-section">
        <div className="nu-container">
          <div className="nu-tabs">
            <button type="button" className={`nu-tab ${tab === "terms" ? "active" : ""}`} onClick={() => setTab("terms")}>
              Medical Terms ({data.terms.length})
            </button>
            <button type="button" className={`nu-tab ${tab === "abbr" ? "active" : ""}`} onClick={() => setTab("abbr")}>
              Ward Abbreviations ({data.abbreviations.length})
            </button>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, border: "1px solid var(--nu-border)", padding: "0 12px", height: 42, flex: "1 1 260px", maxWidth: 420 }}>
              <Search size={16} color="#6a6f73" />
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search terms or abbreviations (e.g. hypoxia, GCS, IM)..."
                style={{ border: 0, outline: "none", width: "100%" }}
              />
            </div>

            {tab === "terms" && (
              <select
                value={cat}
                onChange={(e) => setCat(e.target.value)}
                style={{ height: 42, padding: "0 12px", border: "1px solid var(--nu-border)", background: "#fff" }}
              >
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            )}
          </div>

          {tab === "terms" ? (
            <div style={{ display: "grid", gap: 16 }}>
              {filteredTerms.map((t) => (
                <article key={t.id} style={{ border: "1px solid var(--nu-border)", padding: 20, background: "#fff" }}>
                  <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 8, marginBottom: 8 }}>
                    <h2 style={{ margin: 0, fontSize: "1.2rem" }}>
                      {t.term} {t.pronunciation ? <small style={{ fontWeight: 400, color: "var(--nu-ink-muted)" }}>({t.pronunciation})</small> : null}
                    </h2>
                    <span className="nu-badge nu-badge-highyield">{t.category} · {t.bodySystem}</span>
                  </div>
                  <p style={{ margin: "0 0 8px", fontWeight: 600 }}>{t.simpleDefinition}</p>
                  <p style={{ margin: "0 0 8px", color: "#2d2f31", fontSize: "0.94rem" }}>{t.definition}</p>
                  <div style={{ background: "var(--nu-bg-subtle)", padding: "10px 14px", fontSize: "0.88rem", borderLeft: "3px solid var(--nu-purple)" }}>
                    <strong>Nursing Priority:</strong> {t.clinicalContext}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div style={{ border: "1px solid var(--nu-border)", overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                  <tr style={{ background: "var(--nu-bg-subtle)", borderBottom: "1px solid var(--nu-border)" }}>
                    <th style={{ padding: "12px 16px" }}>Abbreviation</th>
                    <th style={{ padding: "12px 16px" }}>Clinical Meaning</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAbbr.map((a) => (
                    <tr key={a.abbr} style={{ borderBottom: "1px solid var(--nu-border-light)" }}>
                      <td style={{ padding: "10px 16px", fontWeight: 700, color: "var(--nu-purple)" }}>{a.abbr}</td>
                      <td style={{ padding: "10px 16px" }}>{a.full}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <AdSlot slot="dictionary-bottom" />
          <ReferencesBox references={data.references} heading="Dictionary Reference Sources" />

          <div style={{ marginTop: 28, display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link to="/ebooks" className="nu-btn nu-btn-primary">
              <BookOpen size={16} /> Download Free Study eBooks
            </Link>
            <Link to="/courses" className="nu-btn nu-btn-outline">Explore Full Courses</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
