import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { BookOpen, Lightbulb, Search, ShieldCheck, Sparkles, Stethoscope } from "lucide-react";
import AdSlot from "../components/AdSlot";
import NursingLoader from "../components/NursingLoader";
import ReferencesBox from "../components/ReferencesBox";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function DictionaryPage() {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") === "abbreviations" ? "abbr" : "terms";
  const initialQ = searchParams.get("q") || "";

  const [data, setData] = useState(null);
  const [q, setQ] = useState(initialQ);
  const [cat, setCat] = useState("All");
  const [letter, setLetter] = useState("ALL");
  const [tab, setTab] = useState(initialTab);
  const [visibleLimit, setVisibleLimit] = useState(48);

  useEffect(() => {
    setVisibleLimit(48);
  }, [tab, q, cat, letter]);

  useEffect(() => {
    fetch("/assets/data/dictionary.json")
      .then((r) => r.json())
      .then(setData);
  }, []);

  const categories = useMemo(() => {
    if (!data?.terms) return [{ name: "All", count: 0 }];
    const counts = new Map();
    for (const t of data.terms) {
      counts.set(t.category, (counts.get(t.category) || 0) + 1);
    }
    return [
      { name: "All", count: data.terms.length },
      ...[...counts.entries()]
        .sort((a, b) => b[1] - a[1])
        .map(([name, count]) => ({ name, count }))
    ];
  }, [data]);

  const termLetterCounts = useMemo(() => {
    const map = {};
    for (const t of data?.terms || []) {
      const ch = (t.term || "")[0]?.toUpperCase();
      if (ch) map[ch] = (map[ch] || 0) + 1;
    }
    return map;
  }, [data]);

  const abbrLetterCounts = useMemo(() => {
    const map = {};
    for (const a of data?.abbreviations || []) {
      const ch = (a.abbr || "")[0]?.toUpperCase();
      if (ch) map[ch] = (map[ch] || 0) + 1;
    }
    return map;
  }, [data]);

  const filteredTerms = useMemo(() => {
    if (!data?.terms) return [];
    const query = q.trim().toLowerCase();
    return data.terms.filter((t) => {
      if (cat !== "All" && t.category !== cat) return false;
      if (letter !== "ALL" && (t.term || "")[0]?.toUpperCase() !== letter) return false;
      if (!query) return true;
      return `${t.term} ${t.simpleDefinition} ${t.definition} ${t.clinicalContext} ${t.bodySystem}`.toLowerCase().includes(query);
    });
  }, [data, q, cat, letter]);

  const paginatedTerms = useMemo(() => {
    if (letter !== "ALL" || q.trim()) return filteredTerms;
    return filteredTerms.slice(0, visibleLimit);
  }, [filteredTerms, letter, q, visibleLimit]);

  const groupedTerms = useMemo(() => {
    const groups = new Map();
    for (const t of paginatedTerms) {
      const ch = (t.term || "#")[0].toUpperCase();
      if (!groups.has(ch)) groups.set(ch, []);
      groups.get(ch).push(t);
    }
    return [...groups.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [paginatedTerms]);

  const filteredAbbr = useMemo(() => {
    if (!data?.abbreviations) return [];
    const query = q.trim().toLowerCase();
    return data.abbreviations.filter((a) => {
      if (letter !== "ALL" && (a.abbr || "")[0]?.toUpperCase() !== letter) return false;
      if (!query) return true;
      return `${a.abbr} ${a.full}`.toLowerCase().includes(query);
    });
  }, [data, q, letter]);

  if (!data) {
    return (
      <main className="nu-section">
        <div className="nu-container">
          <NursingLoader label="Loading A–Z Medical Dictionary (1,079 Terms)..." />
        </div>
      </main>
    );
  }

  const activeCounts = tab === "terms" ? termLetterCounts : abbrLetterCounts;

  return (
    <main style={{ background: "#F8FAFC" }}>
      <section className="nu-cl-hero">
        <div className="nu-container">
          <span className="nu-badge nu-badge-free" style={{ marginBottom: 10 }}>
            <Sparkles size={13} style={{ display: "inline", marginRight: 4 }} /> Complete A–Z Clinical Glossary
          </span>
          <h1>Nursing &amp; Medical Dictionary ({data.terms.length} Terms · {data.abbreviations.length} Abbreviations)</h1>
          <p className="nu-cl-subtitle" style={{ maxWidth: 740 }}>
            Full A–Z nursing definitions, phonetic pronunciations, Uganda MoH clinical priorities, exam mnemonics, and standardized hospital ward abbreviations.
          </p>
        </div>
      </section>

      <section className="nu-section" style={{ paddingTop: 24 }}>
        <div className="nu-container">
          {/* Top Switch Tabs */}
          <div className="nu-tabs" style={{ marginBottom: 18, flexWrap: "wrap", gap: 6 }}>
            <button
              type="button"
              className={`nu-tab ${tab === "terms" ? "active" : ""}`}
              onClick={() => {
                setTab("terms");
                setLetter("ALL");
              }}
            >
              A–Z Medical Terms ({data.terms.length})
            </button>
            <button
              type="button"
              className={`nu-tab ${tab === "abbr" ? "active" : ""}`}
              onClick={() => {
                setTab("abbr");
                setLetter("ALL");
              }}
            >
              Ward Abbreviations ({data.abbreviations.length})
            </button>
          </div>

          {/* Search Bar + Counter */}
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 14 }}>
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
                flex: "1 1 280px",
                maxWidth: 480,
                boxShadow: "0 2px 6px rgba(15, 23, 42, 0.04)"
              }}
            >
              <Search size={17} color="#6a6f73" />
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={tab === "terms" ? "Search any condition, symptom, drug term..." : "Search ward abbreviation (e.g. STAT, BD, MgSO4, PPH)..."}
                style={{ border: 0, outline: "none", width: "100%", fontSize: "0.92rem", background: "transparent" }}
              />
            </div>

            <div style={{ fontSize: "0.86rem", color: "var(--nu-ink-muted)", fontWeight: 600 }}>
              Showing <strong>{tab === "terms" ? filteredTerms.length : filteredAbbr.length}</strong>{" "}
              {tab === "terms" ? "medical terms" : "abbreviations"}
              {letter !== "ALL" && ` starting with "${letter}"`}
              {(q || cat !== "All" || letter !== "ALL") && (
                <button
                  type="button"
                  onClick={() => {
                    setQ("");
                    setCat("All");
                    setLetter("ALL");
                  }}
                  style={{ marginLeft: 10, background: "none", border: "none", color: "#A137F2", fontWeight: 700, cursor: "pointer", textDecoration: "underline" }}
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Interactive A–Z Letter Index Ribbon */}
          <div className="nu-dict-az-bar" role="group" aria-label="Filter glossary alphabetically A to Z">
            <button
              type="button"
              className={`nu-dict-az-btn ${letter === "ALL" ? "active" : ""}`}
              onClick={() => setLetter("ALL")}
            >
              All
            </button>
            {ALPHABET.map((ch) => {
              const count = activeCounts[ch] || 0;
              const isSelected = letter === ch;
              return (
                <button
                  key={ch}
                  type="button"
                  disabled={count === 0}
                  title={count > 0 ? `${ch}: ${count} entries` : `No ${ch} entries`}
                  className={`nu-dict-az-btn ${isSelected ? "active" : ""}`}
                  onClick={() => setLetter(ch)}
                >
                  {ch}
                </button>
              );
            })}
          </div>

          {/* Category Pill Filter Buttons for Medical Terms (No Dropdown) */}
          {tab === "terms" && (
            <div className="nu-inst-filter-bar" style={{ marginBottom: 22 }} role="group" aria-label="Filter terms by specialty">
              {categories.map((c) => {
                const active = cat === c.name;
                return (
                  <button
                    key={c.name}
                    type="button"
                    className={`nu-inst-filter-btn ${active ? "active" : ""}`}
                    aria-pressed={active}
                    onClick={() => setCat(c.name)}
                  >
                    <span>{c.name}</span>
                    <span className="nu-inst-filter-count">{c.count}</span>
                  </button>
                );
              })}
            </div>
          )}

          {tab === "terms" ? (
            groupedTerms.length === 0 ? (
              <div style={{ padding: 42, textAlign: "center", background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0" }}>
                <h3 style={{ margin: "0 0 8px" }}>No dictionary terms match your filter</h3>
                <button
                  type="button"
                  className="nu-btn nu-btn-primary"
                  onClick={() => {
                    setQ("");
                    setCat("All");
                    setLetter("ALL");
                  }}
                >
                  Show Complete A–Z Dictionary ({data.terms.length})
                </button>
              </div>
            ) : (
              <div style={{ display: "grid", gap: 28 }}>
                {groupedTerms.map(([grpLetter, entries]) => (
                  <section key={grpLetter}>
                    <div className="nu-dict-letter-head">
                      <span className="nu-dict-letter-badge">{grpLetter}</span>
                      <span style={{ fontSize: "0.84rem", fontWeight: 700, color: "#64748b" }}>
                        {entries.length} {entries.length === 1 ? "term" : "terms"}
                      </span>
                    </div>
                    <div className="nu-dict-grid">
                      {entries.map((t) => (
                        <article key={t.id} className="nu-dict-card">
                          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                            <div>
                              <h2 className="nu-dict-term">{t.term}</h2>
                              {t.pronunciation && (
                                <div className="nu-dict-pron">/{t.pronunciation}/</div>
                              )}
                            </div>
                            <span className="nu-badge nu-badge-highyield" style={{ fontSize: "0.7rem" }}>
                              {t.category} &middot; {t.bodySystem}
                            </span>
                          </div>

                          <p className="nu-dict-simple">{t.simpleDefinition}</p>
                          <p className="nu-dict-def">{t.definition}</p>

                          <div className="nu-dict-priority">
                            <div style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 700, color: "#5b21b6", marginBottom: 3 }}>
                              <Stethoscope size={14} /> Nursing &amp; UNMEB Priority
                            </div>
                            <span>{t.clinicalContext}</span>
                          </div>

                          {t.mnemonics && (
                            <div className="nu-dict-mnemonic">
                              <Lightbulb size={14} style={{ flexShrink: 0, marginTop: 2 }} />
                              <span><strong>Mnemonic:</strong> {t.mnemonics}</span>
                            </div>
                          )}
                        </article>
                      ))}
                    </div>
                  </section>
                ))}

                {letter === "ALL" && !q.trim() && paginatedTerms.length < filteredTerms.length && (
                  <div style={{ textAlign: "center", paddingTop: 6 }}>
                    <button
                      type="button"
                      className="nu-btn nu-btn-outline nu-btn-lg"
                      onClick={() => setVisibleLimit((v) => v + 60)}
                    >
                      Show More Medical Terms (Showing {paginatedTerms.length} of {filteredTerms.length})
                    </button>
                  </div>
                )}
              </div>
            )
          ) : (
            <div className="nu-dict-abbr-grid">
              {filteredAbbr.map((a) => (
                <div key={a.abbr} className="nu-dict-abbr-card">
                  <span className="nu-dict-abbr-code">{a.abbr}</span>
                  <span className="nu-dict-abbr-full">{a.full}</span>
                </div>
              ))}
            </div>
          )}

          <AdSlot slot="dictionary-bottom" />
          <ReferencesBox references={data.references} heading="Dictionary Reference Sources" />

          <div style={{ marginTop: 28, display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link to="/ebooks" className="nu-btn nu-btn-primary">
              <BookOpen size={16} /> Download Free Study eBooks
            </Link>
            <Link to="/quizzes" className="nu-btn nu-btn-outline">
              <ShieldCheck size={16} /> Practice Free Topic Quizzes
            </Link>
            <Link to="/courses" className="nu-btn nu-btn-outline">Explore Full Courses</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
