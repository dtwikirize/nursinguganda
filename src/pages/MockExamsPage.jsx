import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  EyeOff,
  FileText,
  Globe2,
  Lock,
  RotateCcw,
  Search,
  ShoppingCart,
  XCircle
} from "lucide-react";
import AdSlot from "../components/AdSlot";
import NursingLoader from "../components/NursingLoader";
import ReferencesBox from "../components/ReferencesBox";
import { useApp } from "../context/AppContext";
import { UNMEB_PASS_ITEM, getAllAccessCartItem } from "../utils/offers";
import { QUICK_SI_US_CHEATSHEET } from "../utils/labUnits";
import { downloadPastPaperPdf, resolvePastPaper } from "../utils/pdfExport";

const NAVY_TEXT = "#0F2942";
const NAVY_BORDER = "#1E3A5F";
const NAVY_BG = "#F0F5FA";

export default function MockExamsPage() {
  const { catalog, enrollments, addToCart, user } = useApp();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [essayData, setEssayData] = useState(null);
  const [modeTab, setModeTab] = useState("essays"); // "essays" (109 Past Papers Sec A+B+C) | "mcq" (Timed Drill Bank)
  const [activeExam, setActiveExam] = useState(null);
  const [activeEssayPaper, setActiveEssayPaper] = useState(null);

  // Filters & Pagination for 109+ Past Papers
  const [paperQ, setPaperQ] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [yearFilter, setYearFilter] = useState("All");
  const [visiblePapers, setVisiblePapers] = useState(24);

  // Practice state inside an opened past paper
  const [sectionAAnswers, setSectionAAnswers] = useState({});
  const [showSectionAKey, setShowSectionAKey] = useState(false);
  const [essayDrafts, setEssayDrafts] = useState({});
  const [revealedEssays, setRevealedEssays] = useState({});

  // Timed MCQ Drill state
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [examUnitMode, setExamUnitMode] = useState("si"); // "si" | "us"

  useEffect(() => {
    Promise.all([
      fetch("/assets/data/mock-exams.json").then((r) => r.json()),
      fetch("/assets/data/unmeb-essay-papers.json")
        .then((r) => (r.ok ? r.json() : { papers: [] }))
        .catch(() => ({ papers: [] }))
    ]).then(([mcqJson, essJson]) => {
      setData(mcqJson);
      setEssayData(essJson);
    });
  }, []);

  useEffect(() => {
    setVisiblePapers(24);
  }, [paperQ, subjectFilter, yearFilter]);

  const hasExamPass =
    Boolean(user?.isAdmin) || enrollments.includes("unmeb-mock-pass") || enrollments.length >= 1;

  const rawPapers = essayData?.papers || [];

  const subjectOptions = useMemo(() => {
    const set = new Set();
    for (const p of rawPapers) {
      if (p.subject) set.add(p.subject);
    }
    return ["All", ...[...set].sort()];
  }, [rawPapers]);

  const yearOptions = useMemo(() => {
    const set = new Set();
    for (const p of rawPapers) {
      if (p.year) set.add(String(p.year));
    }
    return ["All", ...[...set].sort((a, b) => Number(b) - Number(a))];
  }, [rawPapers]);

  const filteredPapers = useMemo(() => {
    const query = paperQ.trim().toLowerCase();
    return rawPapers.filter((p) => {
      if (subjectFilter !== "All" && p.subject !== subjectFilter) return false;
      if (yearFilter !== "All" && String(p.year || "") !== yearFilter) return false;
      if (!query) return true;
      const hay = `${p.title} ${p.paperCode || ""} ${p.subject || ""} ${p.programmeLabel || ""} ${p.seriesTag || ""} ${p.desc || ""}`.toLowerCase();
      return hay.includes(query);
    });
  }, [rawPapers, paperQ, subjectFilter, yearFilter]);

  const visiblePapersSlice = useMemo(
    () => filteredPapers.slice(0, visiblePapers),
    [filteredPapers, visiblePapers]
  );

  const resolvedActivePaper = useMemo(
    () => (activeEssayPaper ? resolvePastPaper(activeEssayPaper, essayData) : null),
    [activeEssayPaper, essayData]
  );

  const examQuestions = useMemo(() => {
    if (!data?.questions || !activeExam) return [];
    const targetCount = Math.min(activeExam.count, data.questions.length);
    return data.questions.slice(0, targetCount);
  }, [data, activeExam]);

  const score = useMemo(() => {
    if (!submitted) return 0;
    return examQuestions.reduce(
      (acc, q, idx) => (answers[idx] === q.answerIndex ? acc + 1 : acc),
      0
    );
  }, [submitted, examQuestions, answers]);

  const unlockExamPass = () => {
    addToCart(UNMEB_PASS_ITEM);
    navigate("/checkout");
  };

  const unlockAllAccess = () => {
    addToCart(getAllAccessCartItem(catalog?.courses || []));
    navigate("/checkout");
  };

  const startExam = (exam) => {
    if (!exam.isFreeSample && !hasExamPass) {
      unlockExamPass();
      return;
    }
    setActiveExam(exam);
    setActiveEssayPaper(null);
    setAnswers({});
    setSubmitted(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const startEssayPaper = (paper) => {
    if (!paper.isFreeSample && !hasExamPass) {
      unlockExamPass();
      return;
    }
    setActiveEssayPaper(paper);
    setActiveExam(null);
    setSectionAAnswers({});
    setShowSectionAKey(false);
    setRevealedEssays({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDownloadPdf = (paper, includeAnswers = true) => {
    if (!paper.isFreeSample && !hasExamPass) {
      unlockExamPass();
      return;
    }
    const full = resolvePastPaper(paper, essayData);
    if (full) {
      downloadPastPaperPdf(full, { includeAnswers });
    }
  };

  const toggleAllRubrics = (reveal) => {
    if (!resolvedActivePaper) return;
    setShowSectionAKey(reveal);
    const next = {};
    for (const q of resolvedActivePaper.questions || []) {
      next[q.id] = reveal;
    }
    setRevealedEssays(next);
  };

  if (!data) {
    return (
      <main className="nu-section">
        <div className="nu-container">
          <NursingLoader label="Loading 109 UHPAB / UNMEB Past Papers Archive..." />
        </div>
      </main>
    );
  }

  return (
    <main>
      <section className="nu-cl-hero">
        <div className="nu-container">
          <span className="nu-badge nu-badge-bestseller" style={{ marginBottom: 10 }}>
            UHPAB &amp; UNMEB Archive · {rawPapers.length}+ Past Papers
          </span>
          <h1>UNMEB &amp; UHPAB Past Papers Archive ({rawPapers.length} Papers · Direct PDF)</h1>
          <p className="nu-cl-subtitle" style={{ maxWidth: 780 }}>
            Practice complete <strong>Section A (MCQs)</strong>, <strong>Section B (Short Essays)</strong>, and{" "}
            <strong>Section C (Clinical Scenario Essays)</strong> across 18 Certificate &amp; Diploma Nursing and Midwifery subjects (2019–2025).
            View all examiner marking schemes &amp; model answers in <strong>Dark Navy</strong> or save any paper directly as a binary <strong>.pdf</strong> file.
          </p>
        </div>
      </section>

      <section className="nu-section">
        <div className="nu-container">
          {!hasExamPass && !activeExam && !resolvedActivePaper && (
            <div className="nu-allaccess-banner" style={{ marginBottom: 20 }}>
              <div className="nu-allaccess-copy">
                <span className="nu-allaccess-eyebrow">50% OFF PAST PAPER PASS OR FULL SITE ACCESS</span>
                <h3>Unlock All {rawPapers.length}+ Past Papers ($4.99) | or All 85 Courses ($34.99)</h3>
                <p>
                  Get every UNMEB &amp; UHPAB marking guide, timed mock drill &amp; PDF export | or unlock every course sitewide.
                </p>
              </div>
              <div className="nu-allaccess-cta" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button type="button" className="nu-btn nu-btn-primary" onClick={unlockExamPass}>
                  Exam Pass · $4.99
                </button>
                <button type="button" className="nu-btn nu-btn-outline" style={{ color: "#fff", borderColor: "#64748b" }} onClick={unlockAllAccess}>
                  All-Access (83 Units) · $34.99
                </button>
              </div>
            </div>
          )}
          {!activeExam && !resolvedActivePaper ? (
            <>
              {/* Format Switcher Tabs & International SI/US Lab Reference Bar */}
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 14 }}>
                <div className="nu-tabs" style={{ marginBottom: 0, flexWrap: "wrap", gap: 8 }}>
                  <button
                    type="button"
                    className={`nu-tab ${modeTab === "essays" ? "active" : ""}`}
                    onClick={() => setModeTab("essays")}
                  >
                    <FileText size={15} style={{ marginRight: 6, verticalAlign: "text-bottom" }} />
                    UHPAB / UNMEB Past Papers Archive ({rawPapers.length})
                  </button>
                  <button
                    type="button"
                    className={`nu-tab ${modeTab === "mcq" ? "active" : ""}`}
                    onClick={() => setModeTab("mcq")}
                  >
                    <CheckCircle2 size={15} style={{ marginRight: 6, verticalAlign: "text-bottom" }} />
                    Timed MCQ Speed &amp; Full Mock Drills ({(data.exams || []).length})
                  </button>
                </div>

                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#fff", border: "1px solid var(--nu-border)", borderRadius: 8, padding: "4px 8px" }}>
                  <Globe2 size={14} color={NAVY_TEXT} />
                  <span style={{ fontSize: "0.76rem", fontWeight: 700, color: NAVY_TEXT }}>Exam Lab Units:</span>
                  <button
                    type="button"
                    onClick={() => setExamUnitMode("si")}
                    style={{
                      padding: "4px 9px",
                      fontSize: "0.74rem",
                      fontWeight: 700,
                      borderRadius: 5,
                      border: 0,
                      background: examUnitMode === "si" ? NAVY_TEXT : "transparent",
                      color: examUnitMode === "si" ? "#fff" : "#475569"
                    }}
                  >
                    SI (mmol/L)
                  </button>
                  <button
                    type="button"
                    onClick={() => setExamUnitMode("us")}
                    style={{
                      padding: "4px 9px",
                      fontSize: "0.74rem",
                      fontWeight: 700,
                      borderRadius: 5,
                      border: 0,
                      background: examUnitMode === "us" ? NAVY_TEXT : "transparent",
                      color: examUnitMode === "us" ? "#fff" : "#475569"
                    }}
                  >
                    US (mg/dL)
                  </button>
                </div>
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, padding: "8px 12px", marginBottom: 16, background: "#fff", border: "1px solid var(--nu-border-light)", borderRadius: 8, fontSize: "0.77rem", color: "#334155" }}>
                <strong style={{ color: NAVY_TEXT }}>
                  {examUnitMode === "si" ? "SI Lab Ranges (Uganda/UK/Canada):" : "US / NCLEX Lab Ranges (mg/dL, °F):"}
                </strong>
                {QUICK_SI_US_CHEATSHEET.map((item) => (
                  <span key={item.test}>
                    {item.test}: <strong style={{ color: NAVY_TEXT }}>{examUnitMode === "si" ? item.si : item.us}</strong>
                  </span>
                ))}
                <Link to="/global-nursing" style={{ color: "#6d28d9", fontWeight: 700, marginLeft: "auto" }}>
                  International Nursing Guides &rarr;
                </Link>
              </div>

              {modeTab === "essays" ? (
                <>
                  {essayData?.disclaimer && (
                    <div
                      style={{
                        padding: "12px 16px",
                        borderRadius: 10,
                        background: NAVY_BG,
                        border: `1px solid ${NAVY_BORDER}`,
                        fontSize: "0.84rem",
                        color: NAVY_TEXT,
                        marginBottom: 18
                      }}
                    >
                      <BookOpen size={14} style={{ marginRight: 6, verticalAlign: "text-bottom" }} />
                      {essayData.disclaimer}
                    </div>
                  )}

                  {/* Search + Subject + Year Filters */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
                      gap: 12,
                      marginBottom: 20,
                      padding: 16,
                      background: "#fff",
                      border: "1px solid var(--nu-border)",
                      borderRadius: 10
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 8, border: "1px solid var(--nu-border)", borderRadius: 6, padding: "0 12px", height: 42 }}>
                      <Search size={16} color="#64748b" />
                      <input
                        type="search"
                        value={paperQ}
                        onChange={(e) => setPaperQ(e.target.value)}
                        placeholder="Search code (CN 111), subject, or year..."
                        aria-label="Search past papers"
                        style={{ border: 0, outline: "none", width: "100%", fontSize: "0.88rem" }}
                      />
                    </div>
                    <select
                      value={subjectFilter}
                      onChange={(e) => setSubjectFilter(e.target.value)}
                      aria-label="Filter by subject"
                      style={{ height: 42, padding: "0 10px", border: "1px solid var(--nu-border)", borderRadius: 6, fontSize: "0.88rem", background: "#fff" }}
                    >
                      {subjectOptions.map((s) => (
                        <option key={s} value={s}>{s === "All" ? "All 18 Subjects / Courses" : s}</option>
                      ))}
                    </select>
                    <select
                      value={yearFilter}
                      onChange={(e) => setYearFilter(e.target.value)}
                      aria-label="Filter by examination year"
                      style={{ height: 42, padding: "0 10px", border: "1px solid var(--nu-border)", borderRadius: 6, fontSize: "0.88rem", background: "#fff" }}
                    >
                      {yearOptions.map((y) => (
                        <option key={y} value={y}>{y === "All" ? "All Sittings (2019–2025)" : `${y} Examination Series`}</option>
                      ))}
                    </select>
                  </div>

                  <div style={{ fontSize: "0.86rem", color: "var(--nu-ink-muted)", marginBottom: 14 }}>
                    Showing <strong>{visiblePapersSlice.length}</strong> of <strong>{filteredPapers.length}</strong> UHPAB / UNMEB past papers
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(305px, 1fr))",
                      gap: 18,
                      marginBottom: 24
                    }}
                  >
                    {visiblePapersSlice.map((paper) => {
                      const unlocked = paper.isFreeSample || hasExamPass;
                      return (
                        <article
                          key={paper.id}
                          style={{
                            border: "1px solid var(--nu-border)",
                            borderRadius: 12,
                            padding: 20,
                            background: "#fff",
                            display: "flex",
                            flexDirection: "column",
                            gap: 9
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                            <span className={`nu-badge ${unlocked ? "nu-badge-free" : "nu-badge-highyield"}`}>
                              {paper.isFreeSample ? "Free Sample Paper" : unlocked ? "Unlocked" : "Exam Pass ($4.99 · 50% Off)"}
                            </span>
                            <span style={{ fontSize: "0.8rem", color: "var(--nu-ink-muted)", display: "inline-flex", alignItems: "center", gap: 4 }}>
                              <Clock size={13} /> {paper.duration} min · {paper.totalMarks} Marks
                            </span>
                          </div>
                          <div style={{ fontSize: "0.74rem", fontWeight: 700, color: NAVY_TEXT, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                            {paper.paperCode} · {paper.programmeLabel}
                          </div>
                          <h2 style={{ fontSize: "1.04rem", margin: 0, lineHeight: 1.35 }}>{paper.title}</h2>
                          <p style={{ margin: 0, fontSize: "0.84rem", color: "var(--nu-ink-muted)", flex: 1 }}>
                            {paper.desc}
                          </p>
                          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", paddingTop: 4 }}>
                            <button
                              type="button"
                              className={`nu-btn ${unlocked ? "nu-btn-primary" : "nu-btn-outline"}`}
                              style={{ flex: "1 1 150px", fontSize: "0.82rem" }}
                              onClick={() => startEssayPaper(paper)}
                            >
                              {unlocked ? (
                                `Open Paper & Answers`
                              ) : (
                                <>
                                  <Lock size={14} /> Unlock ({paper.seriesTag?.split(" ")[0]})
                                </>
                              )}
                            </button>
                            {unlocked && (
                              <button
                                type="button"
                                className="nu-btn nu-btn-outline"
                                style={{ fontSize: "0.8rem", borderColor: NAVY_BORDER, color: NAVY_TEXT }}
                                onClick={() => handleDownloadPdf(paper, true)}
                                title="Download direct binary PDF with Dark Navy answers"
                              >
                                <Download size={14} /> PDF
                              </button>
                            )}
                          </div>
                        </article>
                      );
                    })}
                  </div>

                  {visiblePapersSlice.length < filteredPapers.length && (
                    <div style={{ textAlign: "center", marginBottom: 30 }}>
                      <button
                        type="button"
                        className="nu-btn nu-btn-outline nu-btn-lg"
                        onClick={() => setVisiblePapers((v) => v + 24)}
                      >
                        Load More Past Papers (Showing {visiblePapersSlice.length} of {filteredPapers.length})
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
                    gap: 20,
                    marginBottom: 32
                  }}
                >
                  {data.exams.map((ex) => {
                    const unlocked = ex.isFreeSample || hasExamPass;
                    return (
                      <article key={ex.id} style={{ border: "1px solid var(--nu-border)", borderRadius: 12, padding: 22, background: "#fff", display: "flex", flexDirection: "column", gap: 10 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span className={`nu-badge ${unlocked ? "nu-badge-free" : "nu-badge-highyield"}`}>
                            {ex.isFreeSample ? "Free Sample" : unlocked ? "Unlocked" : "Exam Pass ($4.99 · 50% Off)"}
                          </span>
                          <span style={{ fontSize: "0.82rem", color: "var(--nu-ink-muted)", display: "inline-flex", alignItems: "center", gap: 4 }}>
                            <Clock size={14} /> {ex.duration} min
                          </span>
                        </div>
                        <h2 style={{ fontSize: "1.12rem", margin: 0 }}>{ex.title}</h2>
                        <p style={{ margin: 0, fontSize: "0.88rem", color: "var(--nu-ink-muted)", flex: 1 }}>{ex.desc}</p>
                        <button
                          type="button"
                          className={`nu-btn ${unlocked ? "nu-btn-primary" : "nu-btn-outline"}`}
                          onClick={() => startExam(ex)}
                        >
                          {unlocked ? (
                            `Start ${ex.count}-Question Paper`
                          ) : (
                            <>
                              <Lock size={15} /> Unlock All Mock Papers
                            </>
                          )}
                        </button>
                      </article>
                    );
                  })}
                </div>
              )}

              <AdSlot slot="mock-exams-hub" />
              <ReferencesBox references={data.references} heading="Official Examination Blueprints & Guideline Sources" />
            </>
          ) : resolvedActivePaper ? (
            <div style={{ maxWidth: 900, margin: "0 auto" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 12,
                  marginBottom: 22,
                  paddingBottom: 14,
                  borderBottom: "1px solid var(--nu-border)"
                }}
              >
                <div>
                  <span className="nu-badge nu-badge-free" style={{ marginBottom: 6 }}>
                    {resolvedActivePaper.paperCode} · {resolvedActivePaper.seriesTag} · {resolvedActivePaper.totalMarks} Marks
                  </span>
                  <h2 style={{ margin: 0 }}>{resolvedActivePaper.title}</h2>
                  <small style={{ color: "var(--nu-ink-muted)" }}>
                    {(resolvedActivePaper.sectionA || []).length} Section A MCQs · {(resolvedActivePaper.questions || []).length} Sections B &amp; C Essays · {resolvedActivePaper.duration} minutes
                  </small>
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <button
                    type="button"
                    className="nu-btn nu-btn-primary"
                    style={{ background: NAVY_TEXT, borderColor: NAVY_TEXT }}
                    onClick={() => handleDownloadPdf(activeEssayPaper, true)}
                  >
                    <Download size={14} /> Download Paper + Dark Navy Answers (.pdf)
                  </button>
                  <button
                    type="button"
                    className="nu-btn nu-btn-outline"
                    onClick={() => handleDownloadPdf(activeEssayPaper, false)}
                  >
                    <Download size={14} /> Questions Only (.pdf)
                  </button>
                  <button type="button" className="nu-btn nu-btn-outline" onClick={() => toggleAllRubrics(true)}>
                    <Eye size={14} /> Reveal All Answers
                  </button>
                  <button type="button" className="nu-btn nu-btn-outline" onClick={() => toggleAllRubrics(false)}>
                    <EyeOff size={14} /> Hide Answers
                  </button>
                  <button type="button" className="nu-btn nu-btn-outline" onClick={() => setActiveEssayPaper(null)}>
                    Back to {rawPapers.length} Papers
                  </button>
                </div>
              </div>

              {/* Section A: Objective A-D Block */}
              {(resolvedActivePaper.sectionA || []).length > 0 && (
                <section style={{ marginBottom: 28 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
                    <h3 style={{ margin: 0, color: NAVY_TEXT }}>
                      Section A | Objective Questions ({resolvedActivePaper.sectionA.length} Marks)
                    </h3>
                    <button
                      type="button"
                      className="nu-btn nu-btn-outline"
                      style={{ fontSize: "0.82rem", borderColor: NAVY_BORDER, color: NAVY_TEXT }}
                      onClick={() => setShowSectionAKey((v) => !v)}
                    >
                      {showSectionAKey ? <EyeOff size={14} /> : <Eye size={14} />}
                      {showSectionAKey ? "Hide Section A Answers" : "Check & Reveal Section A Dark Navy Key"}
                    </button>
                  </div>
                  <div style={{ display: "grid", gap: 14 }}>
                    {resolvedActivePaper.sectionA.map((q, qi) => {
                      const chosen = sectionAAnswers[q.id];
                      return (
                        <div key={q.id} style={{ border: "1px solid #e2e8f0", borderRadius: 10, padding: 16, background: "#fff" }}>
                          <div style={{ fontWeight: 700, color: "#111827", marginBottom: 10, fontSize: "0.96rem" }}>
                            {qi + 1}. {q.prompt}
                          </div>
                          <div style={{ display: "grid", gap: 6 }}>
                            {(q.options || []).map((opt, oi) => {
                              const isSel = chosen === oi;
                              const isRight = showSectionAKey && oi === Number(q.answerIndex);
                              const isWrong = showSectionAKey && isSel && oi !== Number(q.answerIndex);
                              return (
                                <button
                                  key={oi}
                                  type="button"
                                  onClick={() => setSectionAAnswers((prev) => ({ ...prev, [q.id]: oi }))}
                                  style={{
                                    textAlign: "left",
                                    padding: "9px 12px",
                                    borderRadius: 6,
                                    border: isRight
                                      ? `2px solid ${NAVY_BORDER}`
                                      : isWrong
                                        ? "1.5px solid #dc2626"
                                        : isSel
                                          ? "2px solid var(--nu-purple)"
                                          : "1px solid #e2e8f0",
                                    background: isRight ? NAVY_BG : isWrong ? "#fee2e2" : "#fff",
                                    color: isRight ? NAVY_TEXT : "#1f2937",
                                    fontWeight: isRight ? 700 : 400,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8
                                  }}
                                >
                                  <strong>{String.fromCharCode(65 + oi)}.</strong>
                                  <span>{opt}</span>
                                </button>
                              );
                            })}
                          </div>
                          {showSectionAKey && (
                            <div
                              style={{
                                marginTop: 10,
                                padding: "10px 14px",
                                borderRadius: 8,
                                background: NAVY_BG,
                                borderLeft: `4px solid ${NAVY_TEXT}`,
                                color: NAVY_TEXT,
                                fontSize: "0.88rem",
                                lineHeight: 1.55
                              }}
                            >
                              <strong>Answer ({String.fromCharCode(65 + Number(q.answerIndex))}):</strong> {q.explanation || q.options?.[Number(q.answerIndex)]}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* Sections B & C Essays */}
              <div style={{ display: "grid", gap: 22 }}>
                {(resolvedActivePaper.questions || []).map((q, qi) => {
                  const isRevealed = Boolean(revealedEssays[q.id]);
                  const draft = essayDrafts[q.id] || "";
                  const draftWords = draft.trim() ? draft.trim().split(/\s+/).length : 0;

                  return (
                    <article
                      key={q.id}
                      style={{
                        border: "1px solid #e2e8f0",
                        borderRadius: 12,
                        padding: "22px 24px",
                        background: "#ffffff",
                        boxShadow: "0 1px 4px rgba(15,23,42,0.04)"
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
                        <span style={{ fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", color: "#475569" }}>
                          Question {qi + 1} · {q.section}
                        </span>
                        <span style={{ padding: "3px 10px", borderRadius: 999, background: "#fef3c7", color: "#78350f", fontSize: "0.78rem", fontWeight: 700 }}>
                          {q.marks} Marks · {q.topic}
                        </span>
                      </div>

                      <div style={{ fontSize: "1rem", fontWeight: 700, color: "#0f172a", lineHeight: 1.6, whiteSpace: "pre-line", marginBottom: 14 }}>
                        {q.prompt}
                      </div>

                      <div style={{ marginBottom: 14 }}>
                        <label
                          htmlFor={`essay-draft-${q.id}`}
                          style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", fontWeight: 600, color: "#64748b", marginBottom: 6 }}
                        >
                          <span>Practice Response Sheet (Optional | outline points before checking marking guide)</span>
                          <span>{draftWords} words</span>
                        </label>
                        <textarea
                          id={`essay-draft-${q.id}`}
                          rows={4}
                          value={draft}
                          onChange={(e) => setEssayDrafts((prev) => ({ ...prev, [q.id]: e.target.value }))}
                          placeholder="Outline your points for (a), (b), (c) here..."
                          style={{
                            width: "100%",
                            padding: "10px 12px",
                            borderRadius: 8,
                            border: "1px solid #cbd5e1",
                            fontFamily: "inherit",
                            fontSize: "0.9rem",
                            lineHeight: 1.55,
                            resize: "vertical"
                          }}
                        />
                      </div>

                      <button
                        type="button"
                        className={`nu-btn ${isRevealed ? "nu-btn-outline" : "nu-btn-primary"}`}
                        onClick={() => setRevealedEssays((prev) => ({ ...prev, [q.id]: !isRevealed }))}
                      >
                        {isRevealed ? (
                          <>
                            <EyeOff size={15} /> Hide Marking Guide &amp; Sample Essay
                          </>
                        ) : (
                          <>
                            <Eye size={15} /> Show Marking Guide &amp; Dark Navy Model Answer
                          </>
                        )}
                      </button>

                      {isRevealed && (
                        <div
                          style={{
                            marginTop: 18,
                            padding: "18px 20px",
                            borderRadius: 10,
                            border: `1.5px solid ${NAVY_BORDER}`,
                            borderLeft: `5px solid ${NAVY_TEXT}`,
                            background: NAVY_BG,
                            color: NAVY_TEXT,
                            display: "grid",
                            gap: 14
                          }}
                        >
                          <div>
                            <strong style={{ display: "block", fontSize: "0.86rem", textTransform: "uppercase", letterSpacing: "0.03em", color: NAVY_TEXT, marginBottom: 8 }}>
                              Examiner Marking Scheme ({q.marks} Marks Breakdown)
                            </strong>
                            <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.65, fontSize: "0.91rem", color: NAVY_TEXT }}>
                              {(q.markingPoints || []).map((pt, pi) => (
                                <li key={pi} style={{ marginBottom: 6 }}>{pt}</li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <strong style={{ display: "block", fontSize: "0.93rem", color: NAVY_TEXT, marginBottom: 8 }}>
                              Sample Full Model Answer
                            </strong>
                            <div style={{ fontSize: "0.94rem", lineHeight: 1.72, color: NAVY_TEXT, whiteSpace: "pre-line" }}>
                              {q.modelAnswer}
                            </div>
                          </div>

                          {q.examinerTip && (
                            <div style={{ padding: "10px 14px", borderRadius: 8, background: "#ffffff", border: `1px solid ${NAVY_BORDER}`, color: NAVY_TEXT, fontSize: "0.88rem", lineHeight: 1.55, display: "flex", gap: 8, alignItems: "flex-start" }}>
                              <Sparkles size={16} style={{ marginTop: 2, flexShrink: 0, color: NAVY_TEXT }} />
                              <div>
                                <strong>Examiner Tip:</strong> {q.examinerTip}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            </div>
          ) : (
            <div style={{ maxWidth: 820, margin: "0 auto" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, paddingBottom: 12, borderBottom: "1px solid var(--nu-border)" }}>
                <div>
                  <h2 style={{ margin: 0 }}>{activeExam.title}</h2>
                  <small style={{ color: "var(--nu-ink-muted)" }}>{examQuestions.length} questions · {activeExam.duration} minutes</small>
                </div>
                <button type="button" className="nu-btn nu-btn-outline" onClick={() => setActiveExam(null)}>
                  Exit Exam
                </button>
              </div>

              {submitted && (
                <div style={{ padding: 20, background: NAVY_BG, border: `1.5px solid ${NAVY_BORDER}`, color: NAVY_TEXT, marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, borderRadius: 10 }}>
                  <div>
                    <strong style={{ fontSize: "1.2rem" }}>
                      Score: {score} / {examQuestions.length} ({Math.round((score / examQuestions.length) * 100)}%)
                    </strong>
                    <div style={{ fontSize: "0.88rem", color: NAVY_TEXT }}>
                      Review every Dark Navy clinical rationale below to lock in clinical memory.
                    </div>
                  </div>
                  <button
                    type="button"
                    className="nu-btn nu-btn-primary"
                    onClick={() => {
                      setAnswers({});
                      setSubmitted(false);
                    }}
                  >
                    <RotateCcw size={15} /> Retry Paper
                  </button>
                </div>
              )}

              <div style={{ display: "grid", gap: 18 }}>
                {examQuestions.map((q, qi) => {
                  const chosen = answers[qi];
                  return (
                    <div key={q.id} style={{ border: "1px solid var(--nu-border)", padding: 18, background: "#fff", borderRadius: 10 }}>
                      <strong style={{ display: "block", marginBottom: 12 }}>
                        {qi + 1}. {q.prompt}
                      </strong>
                      <div style={{ display: "grid", gap: 8 }}>
                        {q.options.map((opt, oi) => {
                          const isSelected = chosen === oi;
                          const isRight = submitted && oi === q.answerIndex;
                          const isWrong = submitted && isSelected && oi !== q.answerIndex;
                          return (
                            <button
                              key={oi}
                              type="button"
                              disabled={submitted}
                              onClick={() => setAnswers((p) => ({ ...p, [qi]: oi }))}
                              style={{
                                textAlign: "left",
                                padding: "10px 12px",
                                borderRadius: 6,
                                border: isRight ? `2px solid ${NAVY_BORDER}` : isSelected ? "2px solid var(--nu-purple)" : "1px solid var(--nu-border)",
                                background: isRight ? NAVY_BG : isWrong ? "#fee2e2" : "#fff",
                                color: isRight ? NAVY_TEXT : "#1f2937",
                                fontWeight: isRight ? 700 : 400,
                                display: "flex",
                                alignItems: "center",
                                gap: 10
                              }}
                            >
                              <strong style={{ minWidth: 20 }}>{String.fromCharCode(65 + oi)}.</strong>
                              <span>{opt}</span>
                            </button>
                          );
                        })}
                      </div>
                      {submitted && (
                        <div style={{ marginTop: 10, padding: "9px 12px", borderRadius: 6, background: NAVY_BG, color: NAVY_TEXT, borderLeft: `4px solid ${NAVY_TEXT}`, fontSize: "0.88rem", display: "flex", alignItems: "center", gap: 6 }}>
                          {chosen === q.answerIndex ? <CheckCircle2 size={15} /> : <XCircle size={15} color="#dc2626" />}
                          <span>{q.explanation}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {!submitted && (
                <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
                  <button
                    type="button"
                    className="nu-btn nu-btn-primary nu-btn-lg"
                    onClick={() => setSubmitted(true)}
                  >
                    Submit &amp; Grade Exam
                  </button>
                  <Link to="/courses" className="nu-btn nu-btn-outline nu-btn-lg">
                    <ShoppingCart size={16} /> Browse Study Units
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
