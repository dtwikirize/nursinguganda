import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  ExternalLink,
  FileCheck2,
  MapPin,
  ShieldCheck
} from "lucide-react";
import AdSlot from "../components/AdSlot";
import CountryFlag from "../components/CountryFlag";
import NursingLoader from "../components/NursingLoader";
import { setPageSeo } from "../components/RouteSeo";
import { LessonSections } from "../components/TopicVisuals";

const THEME_CONFIG = {
  "coursera-black": {
    heroBg: "#0A0D14",
    heroBorder: "#1E293B",
    cardBg: "rgba(255, 255, 255, 0.06)",
    cardBorder: "rgba(255, 255, 255, 0.14)",
    cardTopBorder: "#FFFFFF",
    switchActiveBg: "rgba(255, 255, 255, 0.18)",
    switchIdleBg: "rgba(255, 255, 255, 0.06)",
    accent: "#111827",
    accentStrong: "#000000",
    badgeBg: "#FFFFFF",
    badgeText: "#0A0D14",
    tintBg: "#F8FAFC",
    tintBorder: "#E2E8F0"
  },
  "red-black": {
    heroBg: "#991B1B",
    heroBorder: "#09090B",
    cardBg: "rgba(9, 9, 11, 0.42)",
    cardBorder: "rgba(255, 255, 255, 0.16)",
    cardTopBorder: "#09090B",
    switchActiveBg: "#09090B",
    switchIdleBg: "rgba(9, 9, 11, 0.28)",
    accent: "#09090B",
    accentStrong: "#000000",
    badgeBg: "#09090B",
    badgeText: "#FFFFFF",
    tintBg: "#F8FAFC",
    tintBorder: "#E2E8F0"
  },
  "green-black": {
    heroBg: "#064E3B",
    heroBorder: "#09090B",
    cardBg: "rgba(9, 9, 11, 0.42)",
    cardBorder: "rgba(255, 255, 255, 0.16)",
    cardTopBorder: "#09090B",
    switchActiveBg: "#09090B",
    switchIdleBg: "rgba(9, 9, 11, 0.28)",
    accent: "#09090B",
    accentStrong: "#000000",
    badgeBg: "#09090B",
    badgeText: "#FFFFFF",
    tintBg: "#F8FAFC",
    tintBorder: "#E2E8F0"
  }
};

function resolveThemeKey(slug) {
  if (slug === "united-kingdom-nmc") return "coursera-black";
  if (slug === "united-states-nclex" || slug === "canada-nnas-nclex") return "red-black";
  return "green-black";
}

export default function CountryStudyHubPage({ forcedSlug = "" }) {
  const { countrySlug: paramSlug } = useParams();
  const targetSlug = forcedSlug || paramSlug || "united-kingdom-nmc";

  const [globalData, setGlobalData] = useState(null);
  const [hubsData, setHubsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("notes");
  const [answers, setAnswers] = useState({});
  const [submittedQuiz, setSubmittedQuiz] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setAnswers({});
    setSubmittedQuiz(false);
    setTab("notes");
    Promise.all([
      fetch("/assets/data/global-nursing.json").then((r) => (r.ok ? r.json() : { countries: [] })).catch(() => ({ countries: [] })),
      fetch("/assets/data/country-study-hubs.json").then((r) => (r.ok ? r.json() : { hubs: {} })).catch(() => ({ hubs: {} }))
    ])
      .then(([g, h]) => {
        if (!active) return;
        setGlobalData(g);
        setHubsData(h);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [targetSlug]);

  const countries = globalData?.countries || [];
  const country = useMemo(
    () => countries.find((c) => c.slug === targetSlug) || null,
    [countries, targetSlug]
  );
  const hub = hubsData?.hubs?.[targetSlug] || null;
  const themeKey = hub?.theme || resolveThemeKey(targetSlug);
  const theme = THEME_CONFIG[themeKey] || THEME_CONFIG["green-black"];

  useEffect(() => {
    if (!country) return;
    setPageSeo({
      title: hub?.headline ? `${hub.headline} | Nursing Uganda` : `Becoming a Nurse in ${country.country} (${country.council}) | Nursing Uganda`,
      description: hub?.subheadline || country.summary,
      canonicalPath: hub?.route || `/global-nursing/${country.slug}`,
      type: "article"
    });
  }, [country, hub]);

  if (loading) {
    return (
      <main className="nu-section">
        <div className="nu-container">
          <NursingLoader label="Loading Country Nursing Academy..." />
        </div>
      </main>
    );
  }

  if (!country) {
    return (
      <main className="nu-section">
        <div className="nu-container">
          <h1>Country pathway not found</h1>
          <Link to="/global-nursing" className="nu-btn nu-btn-primary">All 8 Country Pathways</Link>
        </div>
      </main>
    );
  }

  const quizItems = hub?.quiz || [];
  const quizScore = quizItems.reduce((acc, q) => (answers[q.id] === q.answerIndex ? acc + 1 : acc), 0);

  return (
    <main className={`nu-country-hub nu-hub-theme--${themeKey}`} style={{ background: "#f8fafc", minHeight: "80vh" }}>
      {/* Unique Country Academy Hero (Black/Black UK · Red/Black USA & Canada · Green/Black Rest) */}
      <section
        style={{
          background: theme.heroBg,
          color: "#ffffff",
          borderBottom: `4px solid ${theme.heroBorder}`,
          padding: "36px 0 32px"
        }}
      >
        <div className="nu-container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 18 }}>
            <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
              <Link
                to="/global-nursing"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  color: "#cbd5e1",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  textDecoration: "none"
                }}
              >
                <ArrowLeft size={14} /> Global Hub
              </Link>
              <span style={{ color: "#475569" }}>/</span>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "3px 10px",
                  borderRadius: 999,
                  background: theme.badgeBg,
                  color: theme.badgeText,
                  fontSize: "0.72rem",
                  fontWeight: 800,
                  letterSpacing: "0.05em"
                }}
              >
                {hub?.eyebrow || `${country.region.toUpperCase()} · ${country.flag}`}
              </span>
            </div>

            {/* Quick Country Flag Switcher */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {[
                { label: "UK", code: "UK", to: "/nursing-uk" },
                { label: "USA", code: "US", to: "/nursing-usa" },
                { label: "Canada", code: "CA", to: "/nursing-canada" },
                { label: "Australia", code: "AU", to: "/nursing-australia" }
              ].map((nav) => {
                const isCurrent = (hub?.route || `/global-nursing/${country.slug}`) === nav.to;
                return (
                  <Link
                    key={nav.to}
                    to={nav.to}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "5px 10px",
                      borderRadius: 6,
                      border: `1px solid ${isCurrent ? "#FFFFFF" : "rgba(255,255,255,0.22)"}`,
                      background: isCurrent ? theme.switchActiveBg : theme.switchIdleBg,
                      color: "#ffffff",
                      fontSize: "0.76rem",
                      fontWeight: 700,
                      textDecoration: "none"
                    }}
                  >
                    <CountryFlag code={nav.code} width={18} />
                    {nav.label}
                  </Link>
                );
              })}
            </div>
          </div>

          <h1 style={{ margin: "0 0 10px", fontSize: "clamp(1.55rem, 2.8vw, 2.2rem)", display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", color: "#ffffff" }}>
            <CountryFlag code={country.flag} width={46} />
            <span>{hub?.headline || `Becoming a Registered Nurse in ${country.country}`}</span>
          </h1>
          <p style={{ margin: "0 0 22px", maxWidth: 820, color: "rgba(255, 255, 255, 0.88)", fontSize: "1rem", lineHeight: 1.6 }}>
            {hub?.subheadline || country.summary}
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
            {(hub?.highlights || [
              { label: "Regulatory Body", value: country.council },
              { label: "Licensing Exam", value: country.examRequired },
              { label: "Language Bar", value: country.languageTest },
              { label: "Lab System", value: `${country.unitSystem} · ${country.timeline}` }
            ]).map((h, i) => (
              <div
                key={i}
                style={{
                  background: theme.cardBg,
                  border: `1px solid ${theme.cardBorder}`,
                  borderTop: `3px solid ${theme.cardTopBorder}`,
                  borderRadius: 8,
                  padding: "12px 14px"
                }}
              >
                <div style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "rgba(255, 255, 255, 0.72)" }}>
                  {h.label}
                </div>
                <div style={{ marginTop: 4, fontSize: "0.9rem", fontWeight: 700, color: "#ffffff" }}>
                  {h.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="nu-section">
        <div className="nu-container" style={{ maxWidth: 1020 }}>
          {globalData?.disclaimer && (
            <div style={{ padding: "11px 15px", borderRadius: 8, background: theme.tintBg, border: `1px solid ${theme.tintBorder}`, color: "#0f172a", fontSize: "0.84rem", marginBottom: 20 }}>
              <ShieldCheck size={15} style={{ display: "inline", marginRight: 6, verticalAlign: "text-bottom", color: theme.accent }} />
              {globalData.disclaimer}
            </div>
          )}

          {/* Hub Navigation Tabs */}
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 22 }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {hub?.sections?.length > 0 && (
                <button
                  type="button"
                  onClick={() => setTab("notes")}
                  style={{
                    padding: "9px 16px",
                    borderRadius: 8,
                    border: `1.5px solid ${tab === "notes" ? theme.accent : "#cbd5e1"}`,
                    background: tab === "notes" ? theme.accent : "#ffffff",
                    color: tab === "notes" ? "#ffffff" : "#0f172a",
                    fontWeight: 700,
                    fontSize: "0.86rem",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6
                  }}
                >
                  <BookOpen size={15} /> Study Notes &amp; Tables
                </button>
              )}
              {quizItems.length > 0 && (
                <button
                  type="button"
                  onClick={() => setTab("quiz")}
                  style={{
                    padding: "9px 16px",
                    borderRadius: 8,
                    border: `1.5px solid ${tab === "quiz" ? theme.accent : "#cbd5e1"}`,
                    background: tab === "quiz" ? theme.accent : "#ffffff",
                    color: tab === "quiz" ? "#ffffff" : "#0f172a",
                    fontWeight: 700,
                    fontSize: "0.86rem",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6
                  }}
                >
                  <ClipboardCheck size={15} /> Practice Check ({quizItems.length} Qs)
                </button>
              )}
              <button
                type="button"
                onClick={() => setTab("roadmap")}
                style={{
                  padding: "9px 16px",
                  borderRadius: 8,
                  border: `1.5px solid ${tab === "roadmap" || !hub ? theme.accent : "#cbd5e1"}`,
                  background: tab === "roadmap" || !hub ? theme.accent : "#ffffff",
                  color: tab === "roadmap" || !hub ? "#ffffff" : "#0f172a",
                  fontWeight: 700,
                  fontSize: "0.86rem",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6
                }}
              >
                <MapPin size={15} /> Licensure Roadmap &amp; Docs
              </button>
            </div>

            <a
              href={country.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: "9px 14px",
                borderRadius: 8,
                background: theme.heroBg,
                color: "#ffffff",
                fontWeight: 700,
                fontSize: "0.82rem",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 6
              }}
            >
              Official Portal: {country.council.split("(")[0].trim()} <ExternalLink size={13} />
            </a>
          </div>

          {/* Tab 1: Structured Study Notes (NotebookLM-Ready) */}
          {tab === "notes" && hub?.sections?.length > 0 && (
            <div style={{ marginBottom: 28 }}>
              <LessonSections sections={hub.sections} topicTitle={country.country} headingTag="h2" />
            </div>
          )}

          {/* Tab 2: Interactive Exam Practice Quiz */}
          {tab === "quiz" && quizItems.length > 0 && (
            <div style={{ background: "#ffffff", border: "1px solid #cbd5e1", borderRadius: 12, padding: 24, marginBottom: 28 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 18 }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: "1.15rem", color: "#0f172a" }}>{country.country} Exam Practice Check</h2>
                  <small style={{ color: "#64748b" }}>Verify your clinical reasoning against {country.council} standards.</small>
                </div>
                {submittedQuiz && (
                  <span style={{ padding: "6px 12px", borderRadius: 999, background: theme.accent, color: "#ffffff", fontWeight: 800, fontSize: "0.84rem" }}>
                    Score: {quizScore} / {quizItems.length}
                  </span>
                )}
              </div>

              <div style={{ display: "grid", gap: 16 }}>
                {quizItems.map((q, qi) => (
                  <div key={q.id} style={{ border: "1px solid #e2e8f0", borderRadius: 10, padding: 16 }}>
                    <strong style={{ display: "block", marginBottom: 10, color: "#0f172a" }}>
                      {qi + 1}. {q.prompt}
                    </strong>
                    <div style={{ display: "grid", gap: 8 }}>
                      {q.options.map((opt, oi) => {
                        const chosen = answers[q.id] === oi;
                        const isRight = submittedQuiz && q.answerIndex === oi;
                        const isWrong = submittedQuiz && chosen && q.answerIndex !== oi;
                        return (
                          <button
                            key={oi}
                            type="button"
                            disabled={submittedQuiz}
                            onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: oi }))}
                            style={{
                              textAlign: "left",
                              padding: "10px 12px",
                              borderRadius: 8,
                              border: `1.5px solid ${isRight ? "#059669" : isWrong ? "#dc2626" : chosen ? theme.accent : "#cbd5e1"}`,
                              background: isRight ? "#ECFDF5" : isWrong ? "#FEF2F2" : chosen ? theme.tintBg : "#ffffff",
                              color: "#0f172a",
                              fontWeight: chosen || isRight ? 700 : 500,
                              cursor: submittedQuiz ? "default" : "pointer"
                            }}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                    {submittedQuiz && q.rationale && (
                      <div style={{ marginTop: 10, padding: "10px 12px", borderRadius: 6, background: "#f8fafc", borderLeft: `3px solid ${theme.accent}`, fontSize: "0.84rem", color: "#334155" }}>
                        <strong>Rationale:</strong> {q.rationale}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 18, display: "flex", gap: 10 }}>
                {!submittedQuiz ? (
                  <button
                    type="button"
                    onClick={() => setSubmittedQuiz(true)}
                    style={{
                      padding: "10px 20px",
                      borderRadius: 8,
                      border: 0,
                      background: theme.accent,
                      color: "#ffffff",
                      fontWeight: 800,
                      cursor: "pointer"
                    }}
                  >
                    Check Answers
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setAnswers({});
                      setSubmittedQuiz(false);
                    }}
                    className="nu-btn nu-btn-outline"
                  >
                    Retake Practice Check
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Tab 3 (or Default if no custom study notes yet): Registration Roadmap & Docs */}
          {(tab === "roadmap" || !hub?.sections?.length) && (
            <div>
              <div style={{ background: "#ffffff", border: "1px solid #cbd5e1", borderTop: `4px solid ${theme.accent}`, borderRadius: 12, padding: 24, marginBottom: 20 }}>
                <h2 style={{ marginTop: 0, color: "#0f172a", display: "flex", alignItems: "center", gap: 8 }}>
                  <MapPin size={18} color={theme.accent} /> Step-by-Step Registration Roadmap ({country.country})
                </h2>
                <ol style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 10, lineHeight: 1.65 }}>
                  {(country.steps || []).map((st, idx) => (
                    <li key={idx} style={{ color: "#1e293b" }}>{st}</li>
                  ))}
                </ol>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))", gap: 20, marginBottom: 28 }}>
                <div style={{ background: "#ffffff", border: "1px solid #cbd5e1", borderRadius: 12, padding: 22 }}>
                  <h3 style={{ marginTop: 0, color: "#0f172a", display: "flex", alignItems: "center", gap: 8 }}>
                    <FileCheck2 size={17} color={theme.accent} /> Required Document Checklist
                  </h3>
                  <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 8, lineHeight: 1.55 }}>
                    {(country.documents || []).map((doc, i) => (
                      <li key={i} style={{ color: "#334155" }}>{doc}</li>
                    ))}
                  </ul>
                </div>

                <div style={{ background: theme.heroBg, borderRadius: 12, padding: 22, color: "#ffffff" }}>
                  <h3 style={{ marginTop: 0, color: "#ffffff", display: "flex", alignItems: "center", gap: 8 }}>
                    <CheckCircle2 size={17} color={theme.accent === "#111827" ? "#ffffff" : theme.accent} /> Study Hubs to Prepare
                  </h3>
                  <div style={{ display: "grid", gap: 10 }}>
                    {(country.recommendedHubs || []).map((h) => (
                      <Link
                        key={h.to + h.label}
                        to={h.to}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "10px 14px",
                          borderRadius: 8,
                          background: "rgba(255,255,255,0.08)",
                          border: "1px solid rgba(255,255,255,0.16)",
                          color: "#ffffff",
                          fontWeight: 700,
                          fontSize: "0.86rem",
                          textDecoration: "none"
                        }}
                      >
                        <span>{h.label}</span>
                        <ArrowRight size={15} />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <AdSlot slot="global-nursing-bottom" />
        </div>
      </section>
    </main>
  );
}
