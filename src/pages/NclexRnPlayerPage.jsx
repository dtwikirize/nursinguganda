import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  Lock,
  ShieldCheck,
  ShoppingCart
} from "lucide-react";
import { useApp } from "../context/AppContext";
import NclexNavStrip from "../components/NclexNavStrip";
import NursingLoader from "../components/NursingLoader";
import { setPageSeo } from "../components/RouteSeo";
import { LessonSections } from "../components/TopicVisuals";

const NCLEX_COURSE_ITEM = {
  slug: "nclex-rn-preparation-course",
  title: "NCLEX-RN Preparation Course (16-Week Complete Academy)",
  code: "NCLEX-RN 16W",
  programmeLabel: "USA & International NCLEX-RN Academy",
  priceUsd: 99,
  compareAtUsd: 249,
  thumbnail: "/assets/images/udemy/cat-medsurg.webp",
  isFree: false
};

export default function NclexRnPlayerPage() {
  const { unitSlug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isEnrolled, addToCart, cart, user } = useApp();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

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

  return (
    <main className="nu-nclex-theme" style={{ background: "#f8fafc", minHeight: "86vh" }}>
      <NclexNavStrip />

      <div className="nu-container" style={{ maxWidth: 1260, padding: "24px 16px 48px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "300px minmax(0, 1fr)", gap: 24, alignItems: "start" }} className="nu-notes-two-col">
          {/* Unique 16-Week Sidebar Navigation (Mostly Black + Clinical Blue) */}
          <aside style={{ background: "#ffffff", border: "1px solid #cbd5e1", borderTop: "4px solid #09090b", borderRadius: 12, padding: 14, maxHeight: "82vh", overflowY: "auto", position: "sticky", top: 76 }}>
            <div style={{ padding: "6px 8px 12px", borderBottom: "1px solid #e2e8f0", marginBottom: 10 }}>
              <div style={{ fontSize: "0.72rem", fontWeight: 800, color: "#1d4ed8", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                16 Course Units
              </div>
              <div style={{ fontSize: "0.94rem", fontWeight: 800, color: "#09090b", marginTop: 2 }}>
                NCLEX-RN Preparation
              </div>
            </div>

            <div style={{ display: "grid", gap: 6 }}>
              {units.map((u) => {
                const isCurrentUnit = u.slug === activeUnit.slug;
                const unitFree = u.unitNumber === 1 || enrolled;
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
                        fontSize: "0.8rem",
                        fontWeight: 700,
                        textDecoration: "none"
                      }}
                    >
                      <span>{u.title}</span>
                      {!unitFree && <Lock size={13} />}
                    </Link>

                    {isCurrentUnit && (
                      <div style={{ padding: 8, background: "#ffffff", display: "grid", gap: 4 }}>
                        {u.topics.map((t, idx) => {
                          const isCurrentTopic = mode !== "eval" && activeTopic?.slug === t.slug;
                          return (
                            <button
                              key={t.slug}
                              type="button"
                              onClick={() => setSearchParams({ topic: t.slug })}
                              style={{
                                textAlign: "left",
                                padding: "7px 8px",
                                borderRadius: 6,
                                border: 0,
                                borderLeft: isCurrentTopic ? "3px solid #1d4ed8" : "3px solid transparent",
                                background: isCurrentTopic ? "#eff6ff" : "transparent",
                                color: isCurrentTopic ? "#09090b" : "#334155",
                                fontWeight: isCurrentTopic ? 800 : 500,
                                fontSize: "0.78rem",
                                cursor: "pointer"
                              }}
                            >
                              {u.unitNumber}.{idx + 1} {t.title}
                            </button>
                          );
                        })}
                        <button
                          type="button"
                          onClick={() => setSearchParams({ mode: "eval" })}
                          style={{
                            textAlign: "left",
                            padding: "7px 8px",
                            borderRadius: 6,
                            border: "1px dashed #1d4ed8",
                            background: mode === "eval" ? "#09090b" : "#ffffff",
                            color: mode === "eval" ? "#ffffff" : "#1d4ed8",
                            fontWeight: 700,
                            fontSize: "0.78rem",
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

          {/* Main Study & Quiz Workspace */}
          <div style={{ background: "#ffffff", border: "1px solid #cbd5e1", borderTop: "4px solid #09090b", borderRadius: 12, padding: "24px 26px" }}>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 12, paddingBottom: 16, borderBottom: "1px solid #e2e8f0", marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: "0.76rem", fontWeight: 800, color: "#1d4ed8", textTransform: "uppercase" }}>
                  {activeUnit.title}
                </div>
                <h1 style={{ margin: "4px 0 0", fontSize: "1.45rem", color: "#09090b" }}>
                  {mode === "eval" ? activeUnit.finalEvaluation.title : activeTopic?.title}
                </h1>
              </div>

              {isUnlocked && mode !== "eval" && activeTopic && (
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    type="button"
                    onClick={() => setSearchParams({ topic: activeTopic.slug })}
                    style={{
                      padding: "8px 14px",
                      borderRadius: 8,
                      border: `1.5px solid ${mode === "notes" ? "#09090b" : "#cbd5e1"}`,
                      background: mode === "notes" ? "#09090b" : "#ffffff",
                      color: mode === "notes" ? "#ffffff" : "#09090b",
                      fontWeight: 700,
                      fontSize: "0.82rem",
                      cursor: "pointer"
                    }}
                  >
                    <BookOpen size={14} style={{ display: "inline", marginRight: 5, verticalAlign: "text-bottom" }} />
                    Study Notes
                  </button>
                  <button
                    type="button"
                    onClick={() => setSearchParams({ topic: activeTopic.slug, mode: "quiz" })}
                    style={{
                      padding: "8px 14px",
                      borderRadius: 8,
                      border: `1.5px solid ${mode === "quiz" ? "#1d4ed8" : "#cbd5e1"}`,
                      background: mode === "quiz" ? "#1d4ed8" : "#ffffff",
                      color: mode === "quiz" ? "#ffffff" : "#09090b",
                      fontWeight: 700,
                      fontSize: "0.82rem",
                      cursor: "pointer"
                    }}
                  >
                    <ClipboardCheck size={14} style={{ display: "inline", marginRight: 5, verticalAlign: "text-bottom" }} />
                    Topic Quiz ({activeTopic.quiz?.length || 20} Qs)
                  </button>
                </div>
              )}
            </div>

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
                  <button
                    type="button"
                    onClick={() => setSearchParams({ topic: activeTopic.slug, mode: "quiz" })}
                    className="nu-btn nu-btn-primary"
                    style={{ background: "#09090b", borderColor: "#09090b" }}
                  >
                    <ClipboardCheck size={15} /> Start 20-Question Topic Quiz <ArrowRight size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setSearchParams({ mode: "eval" })}
                    className="nu-btn nu-btn-outline"
                    style={{ borderColor: "#1d4ed8", color: "#1d4ed8" }}
                  >
                    Jump to {activeUnit.weekLabel} 60-Q Final Evaluation
                  </button>
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
