import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  ClipboardCheck,
  Download,
  FlaskConical,
  Lock,
  Search,
  ShieldCheck,
  ShoppingCart
} from "lucide-react";
import { useApp } from "../context/AppContext";
import NclexLabDrawer from "../components/NclexLabDrawer";
import NclexNavStrip from "../components/NclexNavStrip";
import NursingLoader from "../components/NursingLoader";
import QuestionRationalePlate from "../components/QuestionRationalePlate";
import { setPageSeo } from "../components/RouteSeo";
import { LessonSections } from "../components/TopicVisuals";
import { exportNclexUnitPdf } from "../utils/pdfExport";
import { findQuestionVisualPlate } from "../utils/questionPlateMatcher";

const NCLEX_COURSE_ITEM = {
  slug: "nclex-rn-preparation-course",
  title: "NCLEX-RN Preparation Course (16-Week Complete Academy)",
  code: "NCLEX-RN 16W",
  programmeLabel: "USA & International NCLEX-RN Academy",
  priceUsd: 99,
  thumbnail: "/assets/images/udemy/cat-medsurg.webp",
  isFree: false
};

const MASTERED_KEY = "nu_nclex_mastered_v1";

export default function NclexRnPlayerPage() {
  const { unitSlug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isEnrolled, addToCart, cart, user } = useApp();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [sidebarQuery, setSidebarQuery] = useState("");
  const [labOpen, setLabOpen] = useState(false);
  const [masteredSlugs, setMasteredSlugs] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(MASTERED_KEY) || "[]");
      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  });

  const enrolled = isEnrolled(NCLEX_COURSE_ITEM.slug) || Boolean(user?.isAdmin);
  const inCart = cart.some((c) => c.slug === NCLEX_COURSE_ITEM.slug);

  useEffect(() => {
    fetch("/assets/data/nclex-rn-course.json")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setCourse(d))
      .finally(() => setLoading(false));
  }, []);

  const units = course?.units || [];
  const activeUnit = useMemo(() => {
    if (!units.length) return null;
    if (unitSlug) {
      return units.find((u) => u.slug === unitSlug) || units[0];
    }
    return units[0];
  }, [units, unitSlug]);

  const mode = searchParams.get("mode") === "eval" ? "eval" : searchParams.get("mode") === "quiz" ? "quiz" : "notes";
  const topicParam = searchParams.get("topic") || "";
  const activeTopic = useMemo(() => {
    if (!activeUnit?.topics?.length) return null;
    return activeUnit.topics.find((t) => t.slug === topicParam) || activeUnit.topics[0];
  }, [activeUnit, topicParam]);

  // Flat ordered topic sequence across all 16 units for instant Prev/Next master navigation
  const flatTopics = useMemo(() => {
    const arr = [];
    for (const u of units) {
      for (let i = 0; i < (u.topics || []).length; i++) {
        arr.push({
          unitSlug: u.slug,
          unitNumber: u.unitNumber,
          topic: u.topics[i],
          label: `${u.unitNumber}.${i + 1} ${u.topics[i].title}`
        });
      }
    }
    return arr;
  }, [units]);

  const currentIdx = flatTopics.findIndex(
    (entry) => entry.unitSlug === activeUnit?.slug && entry.topic.slug === activeTopic?.slug
  );
  const prevEntry = currentIdx > 0 ? flatTopics[currentIdx - 1] : null;
  const nextEntry = currentIdx >= 0 && currentIdx < flatTopics.length - 1 ? flatTopics[currentIdx + 1] : null;

  const filteredUnits = useMemo(() => {
    const q = sidebarQuery.trim().toLowerCase();
    if (!q) return units;
    return units.filter(
      (u) =>
        u.title.toLowerCase().includes(q) ||
        (u.topics || []).some((t) => t.title.toLowerCase().includes(q))
    );
  }, [units, sidebarQuery]);

  const isUnlocked = activeUnit ? activeUnit.unitNumber === 1 || enrolled : false;

  useEffect(() => {
    setAnswers({});
    setSubmitted(false);
  }, [activeUnit?.slug, activeTopic?.slug, mode]);

  useEffect(() => {
    if (!activeUnit) return;
    setPageSeo({
      title: `${activeUnit.weekLabel}: ${activeTopic?.title || activeUnit.title} | NCLEX-RN Academy`,
      description: `NCLEX-RN 16-Unit Study Player | ${activeUnit.title}. Aligned with Saunders 9th Ed., Kaplan & LaCharity PDA.`,
      canonicalPath: `/nclex-rn/unit/${activeUnit.slug}`,
      type: "article"
    });
  }, [activeUnit, activeTopic]);

  const toggleMastered = (slug) => {
    if (!slug) return;
    setMasteredSlugs((prev) => {
      const next = prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug];
      try {
        localStorage.setItem(MASTERED_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const activeQuestions = useMemo(() => {
    if (mode === "eval") return activeUnit?.finalEvaluation?.questions || [];
    if (mode === "quiz") return activeTopic?.quiz || [];
    return [];
  }, [mode, activeUnit, activeTopic]);

  const score = activeQuestions.reduce((acc, q) => (answers[q.id] === q.answerIndex ? acc + 1 : acc), 0);

  const handleEnroll = () => {
    if (!inCart) addToCart(NCLEX_COURSE_ITEM);
    navigate("/cart");
  };

  const goToTopicEntry = (entry) => {
    if (!entry) return;
    navigate(`/nclex-rn/unit/${entry.unitSlug}?topic=${entry.topic.slug}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <main className="nu-section">
        <div className="nu-container">
          <NursingLoader label="Loading 16-Week NCLEX-RN Course Player..." />
        </div>
      </main>
    );
  }

  if (!activeUnit) {
    return (
      <main className="nu-section">
        <div className="nu-container">
          <h1>NCLEX-RN Course not available</h1>
          <Link to="/nclex-rn" className="nu-btn nu-btn-primary">Back to NCLEX-RN Academy</Link>
        </div>
      </main>
    );
  }

  const totalTopicsCount = flatTopics.length || 48;
  const masteredCount = masteredSlugs.length;
  const masteryPct = Math.round((masteredCount / Math.max(1, totalTopicsCount)) * 100);
  const isCurrentMastered = activeTopic ? masteredSlugs.includes(activeTopic.slug) : false;

  return (
    <main className="nu-nclex-theme" style={{ background: "#f8fafc", minHeight: "86vh" }}>
      <NclexNavStrip />
      <NclexLabDrawer open={labOpen} onClose={() => setLabOpen(false)} />

      <div className="nu-container" style={{ maxWidth: 1280, padding: "24px 16px 48px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "316px minmax(0, 1fr)", gap: 24, alignItems: "start" }} className="nu-notes-two-col">
          {/* Master-Study 16-Week Sidebar Navigation (Obsidian Black + Clinical Blue) */}
          <aside style={{ background: "#ffffff", border: "1px solid #cbd5e1", borderTop: "4px solid #09090b", borderRadius: 12, padding: 14, maxHeight: "84vh", overflowY: "auto", position: "sticky", top: 76 }}>
            <div style={{ padding: "6px 6px 12px", borderBottom: "1px solid #e2e8f0", marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.7rem", fontWeight: 800, color: "#1d4ed8", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  MASTER STUDY TRACKER
                </span>
                <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "#09090b" }}>
                  {masteredCount}/{totalTopicsCount} ({masteryPct}%)
                </span>
              </div>
              <div style={{ marginTop: 6, height: 6, background: "#e2e8f0", borderRadius: 999, overflow: "hidden" }}>
                <div style={{ width: `${masteryPct}%`, height: "100%", background: "#1d4ed8", transition: "width 0.25s ease" }} />
              </div>

              {/* Instant Topic Search */}
              <div style={{ marginTop: 10, position: "relative" }}>
                <Search size={14} color="#64748b" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }} />
                <input
                  type="search"
                  value={sidebarQuery}
                  onChange={(e) => setSidebarQuery(e.target.value)}
                  placeholder="Jump to organ, drug, topic..."
                  aria-label="Filter NCLEX topics"
                  style={{
                    width: "100%",
                    padding: "7px 10px 7px 30px",
                    borderRadius: 7,
                    border: "1px solid #cbd5e1",
                    fontSize: "0.78rem",
                    color: "#09090b",
                    background: "#f8fafc"
                  }}
                />
              </div>
            </div>

            <div style={{ display: "grid", gap: 6 }}>
              {filteredUnits.map((u) => {
                const isCurrentUnit = u.slug === activeUnit.slug;
                const unitFree = u.unitNumber === 1 || enrolled;
                const showTopics = isCurrentUnit || sidebarQuery.trim().length > 0;
                return (
                  <div key={u.slug} style={{ border: `1.5px solid ${isCurrentUnit ? "#09090b" : "#e2e8f0"}`, borderRadius: 8, overflow: "hidden" }}>
                    <Link
                      to={`/nclex-rn/unit/${u.slug}`}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 8,
                        padding: "9px 10px",
                        background: isCurrentUnit ? "#09090b" : "#f8fafc",
                        color: isCurrentUnit ? "#ffffff" : "#09090b",
                        borderLeft: isCurrentUnit ? "4px solid #2563eb" : "none",
                        fontSize: "0.79rem",
                        fontWeight: 700,
                        textDecoration: "none"
                      }}
                    >
                      <span>{u.title}</span>
                      {!unitFree && <Lock size={13} />}
                    </Link>

                    {showTopics && (
                      <div style={{ padding: 8, background: "#ffffff", display: "grid", gap: 4 }}>
                        {u.topics.map((t, idx) => {
                          const isCurrentTopic = isCurrentUnit && mode !== "eval" && activeTopic?.slug === t.slug;
                          const done = masteredSlugs.includes(t.slug);
                          return (
                            <button
                              key={t.slug}
                              type="button"
                              onClick={() => {
                                if (isCurrentUnit) {
                                  setSearchParams({ topic: t.slug });
                                } else {
                                  navigate(`/nclex-rn/unit/${u.slug}?topic=${t.slug}`);
                                }
                              }}
                              style={{
                                textAlign: "left",
                                padding: "7px 8px",
                                borderRadius: 6,
                                border: 0,
                                borderLeft: isCurrentTopic ? "3px solid #1d4ed8" : "3px solid transparent",
                                background: isCurrentTopic ? "#eff6ff" : "transparent",
                                color: isCurrentTopic ? "#09090b" : "#334155",
                                fontWeight: isCurrentTopic ? 800 : 500,
                                fontSize: "0.77rem",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "flex-start",
                                justifyContent: "space-between",
                                gap: 6
                              }}
                            >
                              <span>{u.unitNumber}.{idx + 1} {t.title}</span>
                              {done && <Check size={13} color="#1d4ed8" style={{ flexShrink: 0, marginTop: 2 }} />}
                            </button>
                          );
                        })}
                        <button
                          type="button"
                          onClick={() => {
                            if (isCurrentUnit) setSearchParams({ mode: "eval" });
                            else navigate(`/nclex-rn/unit/${u.slug}?mode=eval`);
                          }}
                          style={{
                            textAlign: "left",
                            padding: "7px 8px",
                            borderRadius: 6,
                            border: "1px dashed #1d4ed8",
                            background: isCurrentUnit && mode === "eval" ? "#09090b" : "#ffffff",
                            color: isCurrentUnit && mode === "eval" ? "#ffffff" : "#1d4ed8",
                            fontWeight: 700,
                            fontSize: "0.76rem",
                            cursor: "pointer",
                            marginTop: 4
                          }}
                        >
                          ★ {u.weekLabel} 60-Q Final Evaluation
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </aside>

          {/* Main Master-Study & Quiz Workspace */}
          <div style={{ background: "#ffffff", border: "1px solid #cbd5e1", borderTop: "4px solid #09090b", borderRadius: 12, padding: "22px 26px" }}>
            {/* Top Master-Study Utility Bar */}
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 10, paddingBottom: 14, borderBottom: "1px solid #e2e8f0", marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: "0.74rem", fontWeight: 800, color: "#1d4ed8", textTransform: "uppercase" }}>
                  {activeUnit.title}
                </div>
                <h1 style={{ margin: "4px 0 0", fontSize: "clamp(1.25rem, 2.2vw, 1.55rem)", color: "#09090b" }}>
                  {mode === "eval" ? activeUnit.finalEvaluation.title : activeTopic?.title}
                </h1>
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                <button
                  type="button"
                  onClick={() => setLabOpen(true)}
                  style={{
                    padding: "8px 12px",
                    borderRadius: 8,
                    border: "1.5px solid #09090b",
                    background: "#ffffff",
                    color: "#09090b",
                    fontWeight: 700,
                    fontSize: "0.8rem",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6
                  }}
                >
                  <FlaskConical size={14} color="#1d4ed8" /> US Labs &amp; Antidotes
                </button>

                {isUnlocked && (
                  <button
                    type="button"
                    onClick={() => exportNclexUnitPdf(activeUnit)}
                    style={{
                      padding: "8px 12px",
                      borderRadius: 8,
                      border: "1.5px solid #cbd5e1",
                      background: "#f8fafc",
                      color: "#09090b",
                      fontWeight: 700,
                      fontSize: "0.8rem",
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6
                    }}
                  >
                    <Download size={14} color="#1d4ed8" /> Export Unit PDF
                  </button>
                )}

                {isUnlocked && mode !== "eval" && activeTopic && (
                  <>
                    <button
                      type="button"
                      onClick={() => setSearchParams({ topic: activeTopic.slug })}
                      style={{
                        padding: "8px 13px",
                        borderRadius: 8,
                        border: `1.5px solid ${mode === "notes" ? "#09090b" : "#cbd5e1"}`,
                        background: mode === "notes" ? "#09090b" : "#ffffff",
                        color: mode === "notes" ? "#ffffff" : "#09090b",
                        fontWeight: 700,
                        fontSize: "0.8rem",
                        cursor: "pointer"
                      }}
                    >
                      <BookOpen size={14} style={{ display: "inline", marginRight: 5, verticalAlign: "text-bottom" }} />
                      Notes
                    </button>
                    <button
                      type="button"
                      onClick={() => setSearchParams({ topic: activeTopic.slug, mode: "quiz" })}
                      style={{
                        padding: "8px 13px",
                        borderRadius: 8,
                        border: `1.5px solid ${mode === "quiz" ? "#1d4ed8" : "#cbd5e1"}`,
                        background: mode === "quiz" ? "#1d4ed8" : "#ffffff",
                        color: mode === "quiz" ? "#ffffff" : "#09090b",
                        fontWeight: 700,
                        fontSize: "0.8rem",
                        cursor: "pointer"
                      }}
                    >
                      <ClipboardCheck size={14} style={{ display: "inline", marginRight: 5, verticalAlign: "text-bottom" }} />
                      Quiz ({activeTopic.quiz?.length || 20})
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Section Outline & Topic Prev/Next Master Navigation Strip */}
            {isUnlocked && mode === "notes" && activeTopic && (
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 10, padding: "10px 14px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, marginBottom: 20 }}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
                  <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "#475569", textTransform: "uppercase" }}>Jump:</span>
                  {(activeTopic.sections || []).map((sec, sIdx) => (
                    <a
                      key={sIdx}
                      href={`#lesson-sec-${sIdx}`}
                      style={{
                        padding: "4px 9px",
                        borderRadius: 6,
                        background: "#ffffff",
                        border: "1px solid #cbd5e1",
                        fontSize: "0.74rem",
                        fontWeight: 700,
                        color: "#09090b",
                        textDecoration: "none"
                      }}
                    >
                      §{sIdx + 1}
                    </a>
                  ))}
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
                  <button
                    type="button"
                    onClick={() => toggleMastered(activeTopic.slug)}
                    style={{
                      padding: "6px 11px",
                      borderRadius: 7,
                      border: `1.5px solid ${isCurrentMastered ? "#1d4ed8" : "#cbd5e1"}`,
                      background: isCurrentMastered ? "#1d4ed8" : "#ffffff",
                      color: isCurrentMastered ? "#ffffff" : "#09090b",
                      fontSize: "0.76rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 5
                    }}
                  >
                    <CheckCircle2 size={13} /> {isCurrentMastered ? "Mastered ✓" : "Mark Mastered"}
                  </button>

                  {prevEntry && (
                    <button
                      type="button"
                      onClick={() => goToTopicEntry(prevEntry)}
                      style={{ padding: "6px 10px", borderRadius: 7, border: "1px solid #cbd5e1", background: "#ffffff", color: "#09090b", fontSize: "0.76rem", fontWeight: 700, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4 }}
                    >
                      <ArrowLeft size={13} /> Prev
                    </button>
                  )}
                  {nextEntry && (
                    <button
                      type="button"
                      onClick={() => goToTopicEntry(nextEntry)}
                      style={{ padding: "6px 10px", borderRadius: 7, border: "1px solid #09090b", background: "#09090b", color: "#ffffff", fontSize: "0.76rem", fontWeight: 700, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4 }}
                    >
                      Next <ArrowRight size={13} />
                    </button>
                  )}
                </div>
              </div>
            )}

            {!isUnlocked ? (
              <div style={{ padding: "36px 20px", textAlign: "center", background: "#f8fafc", borderRadius: 10, border: "1px solid #e2e8f0" }}>
                <Lock size={34} color="#1d4ed8" style={{ marginBottom: 10 }} />
                <h2 style={{ margin: "0 0 8px", color: "#09090b" }}>Unlock All 16 Course Units &amp; 1,920+ Questions</h2>
                <p style={{ margin: "0 auto 20px", maxWidth: 520, color: "#475569", fontSize: "0.94rem" }}>
                  Week 1 is available as a free preview. Enroll in the <strong>NCLEX-RN Preparation Course ($99)</strong> to unlock Weeks 2–16, all 48 topics, 20-Q topic quizzes, 60-Q unit evaluations, and the NCLEX-RN Examinations suite.
                </p>
                <button
                  type="button"
                  onClick={handleEnroll}
                  className="nu-btn nu-btn-primary"
                  style={{ background: "#09090b", borderColor: "#09090b", padding: "12px 24px" }}
                >
                  <ShoppingCart size={16} /> {inCart ? "Go to Cart ($99)" : "Enroll Now | $99"}
                </button>
              </div>
            ) : mode === "notes" && activeTopic ? (
              <>
                <LessonSections
                  sections={activeTopic.sections || []}
                  lesson={activeTopic}
                  topicTitle={activeTopic.title}
                  headingTag="h2"
                  disableInlineFigures
                />

                {/* Per-Lesson Clinical References */}
                <div style={{ marginTop: 28, padding: 18, borderRadius: 10, background: "#f8fafc", border: "1px solid #cbd5e1", borderLeft: "4px solid #1d4ed8" }}>
                  <h3 style={{ margin: "0 0 10px", fontSize: "0.96rem", color: "#09090b", display: "flex", alignItems: "center", gap: 6 }}>
                    <ShieldCheck size={16} color="#1d4ed8" /> Lesson References (Saunders · Kaplan · LaCharity · NCSBN)
                  </h3>
                  <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 6, fontSize: "0.84rem", color: "#334155" }}>
                    {(activeTopic.references || activeUnit.references || []).map((r) => (
                      <li key={r.id}>
                        <strong>[{r.type}]</strong> {r.citation}
                      </li>
                    ))}
                  </ul>
                </div>

                <div style={{ marginTop: 22, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <button
                      type="button"
                      onClick={() => setSearchParams({ topic: activeTopic.slug, mode: "quiz" })}
                      className="nu-btn nu-btn-primary"
                      style={{ background: "#09090b", borderColor: "#09090b" }}
                    >
                      <ClipboardCheck size={15} /> Start 20-Q Topic Quiz
                    </button>
                    <button
                      type="button"
                      onClick={() => setSearchParams({ mode: "eval" })}
                      className="nu-btn nu-btn-outline"
                      style={{ borderColor: "#1d4ed8", color: "#1d4ed8" }}
                    >
                      {activeUnit.weekLabel} 60-Q Eval
                    </button>
                  </div>

                  <div style={{ display: "flex", gap: 8 }}>
                    {prevEntry && (
                      <button
                        type="button"
                        onClick={() => goToTopicEntry(prevEntry)}
                        className="nu-btn nu-btn-outline"
                      >
                        <ArrowLeft size={15} /> Previous Topic
                      </button>
                    )}
                    {nextEntry && (
                      <button
                        type="button"
                        onClick={() => goToTopicEntry(nextEntry)}
                        className="nu-btn nu-btn-primary"
                        style={{ background: "#1d4ed8", borderColor: "#1d4ed8" }}
                      >
                        Next: {nextEntry.label.slice(0, 32)}... <ArrowRight size={15} />
                      </button>
                    )}
                  </div>
                </div>
              </>
            ) : (
              /* 20-Q Topic Quiz or 60-Q Mixed Unit Evaluation */
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 18, padding: "12px 16px", background: "#f8fafc", borderRadius: 8, border: "1px solid #e2e8f0" }}>
                  <div style={{ fontSize: "0.88rem", color: "#334155", fontWeight: 600 }}>
                    {mode === "eval"
                      ? `Mixed Final Evaluation | ${activeQuestions.length} Questions across ${activeUnit.weekLabel}`
                      : `Topic Quiz | ${activeQuestions.length} Questions (${activeTopic?.title})`}
                  </div>
                  {submitted && (
                    <span style={{ padding: "5px 12px", borderRadius: 999, background: "#09090b", color: "#ffffff", fontWeight: 800, fontSize: "0.84rem" }}>
                      Score: {score} / {activeQuestions.length} ({Math.round((score / Math.max(1, activeQuestions.length)) * 100)}%)
                    </span>
                  )}
                </div>

                <div style={{ display: "grid", gap: 16 }}>
                  {activeQuestions.map((q, qi) => (
                    <div key={q.id} style={{ border: "1px solid #e2e8f0", borderRadius: 10, padding: 16 }}>
                      <strong style={{ display: "block", marginBottom: 10, color: "#09090b", lineHeight: 1.45 }}>
                        {qi + 1}. {q.prompt}
                      </strong>
                      <div style={{ display: "grid", gap: 8 }}>
                        {q.options.map((opt, oi) => {
                          const chosen = answers[q.id] === oi;
                          const isRight = submitted && q.answerIndex === oi;
                          const isWrong = submitted && chosen && q.answerIndex !== oi;
                          return (
                            <button
                              key={oi}
                              type="button"
                              disabled={submitted}
                              onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: oi }))}
                              style={{
                                textAlign: "left",
                                padding: "10px 12px",
                                borderRadius: 8,
                                border: `1.5px solid ${isRight ? "#059669" : isWrong ? "#dc2626" : chosen ? "#09090b" : "#cbd5e1"}`,
                                background: isRight ? "#ECFDF5" : isWrong ? "#FEF2F2" : chosen ? "#eff6ff" : "#ffffff",
                                color: "#09090b",
                                fontWeight: chosen || isRight ? 700 : 500,
                                cursor: submitted ? "default" : "pointer"
                              }}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                      {submitted && q.rationale && (
                        <div style={{ marginTop: 10, padding: "10px 12px", borderRadius: 6, background: "#f8fafc", borderLeft: "3px solid #1d4ed8", fontSize: "0.84rem", color: "#334155" }}>
                          <strong>Rationale:</strong> {q.rationale}
                        </div>
                      )}
                      {submitted && (() => {
                        const matchedPlate = findQuestionVisualPlate(q, {
                          unitTitle: activeUnit?.title,
                          topicTitle: activeTopic?.title
                        });
                        return matchedPlate ? <QuestionRationalePlate plate={matchedPlate} /> : null;
                      })()}
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: 22, display: "flex", gap: 10 }}>
                  {!submitted ? (
                    <button
                      type="button"
                      onClick={() => setSubmitted(true)}
                      className="nu-btn nu-btn-primary"
                      style={{ background: "#09090b", borderColor: "#09090b" }}
                    >
                      <CheckCircle2 size={16} /> Submit &amp; View Rationales
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setAnswers({});
                        setSubmitted(false);
                      }}
                      className="nu-btn nu-btn-outline"
                    >
                      Retake {mode === "eval" ? "Unit Evaluation" : "Topic Quiz"}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
