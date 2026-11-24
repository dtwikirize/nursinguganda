import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, BookOpen, Clock, Layers, Search, Sparkles } from "lucide-react";
import { useApp } from "../context/AppContext";
import NursingLoader from "../components/NursingLoader";

const CATEGORY_ORDER = [
  "Anatomy & Physiology",
  "Foundations of Nursing",
  "Pharmacology",
  "Medical-Surgical Nursing",
  "Midwifery & Maternal Health",
  "Paediatrics & Child Health",
  "Community & Public Health",
  "Mental Health & Psychology",
  "Leadership, Research & Ethics"
];

const PAGE_SIZE = 24;

export default function NurseTopicsPage() {
  const { catalog, isEnrolled } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const selectedCat = searchParams.get("cat") || "all";
  const selectedProg = searchParams.get("programme") || "all";
  const query = searchParams.get("q") || "";

  useEffect(() => {
    fetch("/assets/data/canonical-lessons-index.json")
      .then((r) => (r.ok ? r.json() : []))
      .then((arr) => {
        setTopics(Array.isArray(arr) ? arr : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    setPage(1);
  }, [selectedCat, selectedProg, query]);

  const courseLookup = useMemo(() => {
    const map = new Map();
    for (const c of catalog?.courses || []) {
      map.set(c.slug, c);
    }
    return map;
  }, [catalog]);

  const categories = useMemo(() => {
    const counts = new Map();
    for (const t of topics) {
      const cat = t.category || "General Nursing";
      counts.set(cat, (counts.get(cat) || 0) + 1);
    }
    const ordered = CATEGORY_ORDER.filter((c) => counts.has(c)).map((c) => ({ name: c, count: counts.get(c) }));
    for (const [name, count] of counts.entries()) {
      if (!CATEGORY_ORDER.includes(name)) ordered.push({ name, count });
    }
    return ordered;
  }, [topics]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return topics.filter((t) => {
      if (selectedCat !== "all" && t.category !== selectedCat) return false;
      if (selectedProg !== "all" && t.programmeId !== selectedProg) return false;
      if (q) {
        const hay = `${t.title} ${t.excerpt || ""} ${t.courseTitle || ""} ${t.category || ""} ${t.programmeLabel || ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [topics, selectedCat, selectedProg, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const setParam = (key, val) => {
    const next = new URLSearchParams(searchParams);
    if (!val || val === "all") next.delete(key);
    else next.set(key, val);
    setSearchParams(next);
  };

  const changePage = (nextPage) => {
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <main className="nu-section">
        <div className="nu-container">
          <NursingLoader label="Loading Nurse Topics & clinical study notes..." />
        </div>
      </main>
    );
  }

  return (
    <main style={{ background: "#f8fafc", minHeight: "70vh" }}>
      <section className="nu-cl-hero">
        <div className="nu-container">
          <span className="nu-badge nu-badge-free" style={{ marginBottom: 10 }}>
            {topics.length} Clinical Study Topics · UNMEB &amp; MoH Aligned
          </span>
          <h1>Nurse Topics &amp; Clinical Study Notes</h1>
          <p style={{ maxWidth: 740, color: "#cbd5e1", margin: "10px 0 0", fontSize: "1.02rem" }}>
            Browse every nursing and midwifery study topic directly by clinical specialty or keyword — from Anatomy &amp; Pharmacology to Midwifery, Paediatrics, and Ward Emergencies.
          </p>
        </div>
      </section>

      <section className="nu-section" style={{ paddingTop: 28 }}>
        <div className="nu-container">
          {/* Search + Programme Filter Row */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center", marginBottom: 18 }}>
            <div style={{ flex: "1 1 280px", position: "relative" }}>
              <Search size={17} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#64748b" }} />
              <input
                type="search"
                value={query}
                onChange={(e) => setParam("q", e.target.value)}
                placeholder="Search any clinical topic (e.g. Malaria, PPH, Insulin, Cannulation, APGAR)..."
                aria-label="Search nurse topics"
                style={{
                  width: "100%",
                  height: 44,
                  padding: "0 14px 0 38px",
                  borderRadius: 8,
                  border: "1px solid #cbd5e1",
                  background: "#ffffff",
                  fontSize: "0.94rem"
                }}
              />
            </div>

            <select
              value={selectedProg}
              onChange={(e) => setParam("programme", e.target.value)}
              aria-label="Filter by academic programme"
              style={{
                height: 44,
                padding: "0 12px",
                borderRadius: 8,
                border: "1px solid #cbd5e1",
                background: "#ffffff",
                fontWeight: 600,
                color: "#0F2942",
                fontSize: "0.88rem"
              }}
            >
              <option value="all">All Programmes ({catalog?.programmes?.length || 6})</option>
              {(catalog?.programmes || []).map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>

            <Link to="/quizzes" className="nu-btn nu-btn-outline" style={{ height: 44, display: "inline-flex", alignItems: "center", gap: 6 }}>
              Practice Free Quizzes
            </Link>
          </div>

          {/* Clinical Specialty Pills */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 22 }} role="tablist" aria-label="Filter nurse topics by clinical specialty">
            <button
              type="button"
              onClick={() => setParam("cat", "all")}
              style={{
                padding: "7px 14px",
                borderRadius: 999,
                border: selectedCat === "all" ? "1.5px solid #0F2942" : "1px solid #cbd5e1",
                background: selectedCat === "all" ? "#0F2942" : "#ffffff",
                color: selectedCat === "all" ? "#ffffff" : "#0F2942",
                fontWeight: 700,
                fontSize: "0.82rem",
                cursor: "pointer"
              }}
            >
              All Topics ({topics.length})
            </button>
            {categories.map((cat) => {
              const active = selectedCat === cat.name;
              return (
                <button
                  key={cat.name}
                  type="button"
                  onClick={() => setParam("cat", cat.name)}
                  style={{
                    padding: "7px 14px",
                    borderRadius: 999,
                    border: active ? "1.5px solid #A137F2" : "1px solid #cbd5e1",
                    background: active ? "#A137F2" : "#ffffff",
                    color: active ? "#ffffff" : "#1e293b",
                    fontWeight: 600,
                    fontSize: "0.82rem",
                    cursor: "pointer"
                  }}
                >
                  {cat.name} ({cat.count})
                </button>
              );
            })}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
            <p style={{ margin: 0, color: "#475569", fontSize: "0.9rem" }}>
              Showing <strong>{pageItems.length}</strong> of <strong>{filtered.length}</strong> matching nurse study topics
              {selectedCat !== "all" ? ` in ${selectedCat}` : ""}
              {totalPages > 1 ? ` · Page ${safePage} of ${totalPages}` : ""}
            </p>
            {(selectedCat !== "all" || selectedProg !== "all" || query) && (
              <button
                type="button"
                className="nu-btn nu-btn-outline"
                style={{ padding: "5px 12px", fontSize: "0.8rem" }}
                onClick={() => setSearchParams({})}
              >
                Reset Filters
              </button>
            )}
          </div>

          {pageItems.length === 0 ? (
            <div style={{ padding: 40, textAlign: "center", background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0" }}>
              <h3>No nurse topics match your filters</h3>
              <p style={{ color: "var(--nu-ink-muted)" }}>Try clearing your search or selecting another clinical specialty.</p>
              <button type="button" className="nu-btn nu-btn-primary" onClick={() => setSearchParams({})}>
                Show All {topics.length} Topics
              </button>
            </div>
          ) : (
            <div className="nu-dict-grid">
              {pageItems.map((item) => {
                const parentCourse = courseLookup.get(item.courseSlug);
                const freeAccess = parentCourse ? isEnrolled(parentCourse.slug, parentCourse.isFree) : false;
                return (
                  <article
                    key={`${item.courseSlug}:${item.slug}`}
                    style={{
                      background: "#ffffff",
                      border: "1px solid #e2e8f0",
                      borderRadius: 12,
                      padding: "18px 20px",
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                      boxShadow: "0 2px 10px rgba(15, 23, 42, 0.04)"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                      <span className="nu-badge nu-badge-free" style={{ fontSize: "0.72rem" }}>
                        {item.category || "Clinical Notes"}
                      </span>
                      <span style={{ fontSize: "0.76rem", color: "#64748b", display: "inline-flex", alignItems: "center", gap: 4 }}>
                        <Clock size={13} /> ~{item.readMinutes || 8} min read
                      </span>
                    </div>

                    <h2 style={{ margin: 0, fontSize: "1.06rem", color: "#0F2942", lineHeight: 1.32 }}>
                      <Link to={`/learn/${item.courseSlug}/${item.slug}`} style={{ color: "inherit", textDecoration: "none" }}>
                        {item.title}
                      </Link>
                    </h2>

                    {item.excerpt && (
                      <p style={{ margin: 0, fontSize: "0.86rem", color: "#475569", lineHeight: 1.5 }}>
                        {item.excerpt}
                      </p>
                    )}

                    <div style={{ fontSize: "0.78rem", color: "#64748b", display: "flex", alignItems: "center", gap: 6, marginTop: "auto", paddingTop: 6 }}>
                      <Layers size={13} color="#A137F2" />
                      <span>
                        <strong>{item.courseTitle}</strong> · {item.programmeLabel}
                      </span>
                    </div>

                    <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", paddingTop: 4 }}>
                      <Link
                        to={`/learn/${item.courseSlug}/${item.slug}`}
                        className="nu-btn nu-btn-primary"
                        style={{ padding: "8px 14px", fontSize: "0.82rem", display: "inline-flex", alignItems: "center", gap: 5 }}
                      >
                        <BookOpen size={14} /> Open Study Notes
                      </Link>
                      <Link
                        to={`/course/${item.courseSlug}`}
                        className="nu-btn nu-btn-outline"
                        style={{ padding: "8px 12px", fontSize: "0.82rem", display: "inline-flex", alignItems: "center", gap: 4 }}
                      >
                        {freeAccess ? "Unit Syllabus" : "Preview Unit"} <ArrowRight size={13} />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {totalPages > 1 && (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 10, marginTop: 28, flexWrap: "wrap" }}>
              <button
                type="button"
                className="nu-btn nu-btn-outline"
                disabled={safePage <= 1}
                onClick={() => changePage(safePage - 1)}
              >
                ← Previous
              </button>
              <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "#0F2942" }}>
                Page {safePage} of {totalPages}
              </span>
              <button
                type="button"
                className="nu-btn nu-btn-primary"
                disabled={safePage >= totalPages}
                onClick={() => changePage(safePage + 1)}
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
