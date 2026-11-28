import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  CheckCircle2,
  Clock,
  FlaskConical,
  Lock,
  Pause,
  Play,
  RotateCcw,
  ShoppingCart
} from "lucide-react";
import { useApp } from "../context/AppContext";
import NclexLabDrawer from "../components/NclexLabDrawer";
import NclexNavStrip from "../components/NclexNavStrip";
import NursingLoader from "../components/NursingLoader";
import QuestionRationalePlate from "../components/QuestionRationalePlate";
import { setPageSeo } from "../components/RouteSeo";
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

function formatSeconds(sec) {
  const s = Math.max(0, Number(sec) || 0);
  const mins = Math.floor(s / 60);
  const rem = s % 60;
  return `${String(mins).padStart(2, "0")}:${String(rem).padStart(2, "0")}`;
}

export default function NclexRnExamsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isEnrolled, addToCart, cart, user } = useApp();

  const [examsData, setExamsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [labOpen, setLabOpen] = useState(false);
  const [filterMissed, setFilterMissed] = useState(false);
  const [timerRunning, setTimerRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);

  const enrolled = isEnrolled(NCLEX_COURSE_ITEM.slug) || Boolean(user?.isAdmin);
  const inCart = cart.some((c) => c.slug === NCLEX_COURSE_ITEM.slug);

  useEffect(() => {
    setPageSeo({
      title: "NCLEX-RN Examinations (CAT & Next-Gen NGN Suite) | Nursing Uganda",
      description:
        "Timed NCLEX-RN Diagnostic, Next-Gen (NGN) Clinical Judgment, Pharmacology & 100-Question Comprehensive CAT Simulation Exams.",
      canonicalPath: "/nclex-rn/exams",
      type: "article"
    });
    fetch("/assets/data/nclex-rn-exams.json")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setExamsData(d))
      .finally(() => setLoading(false));
  }, []);

  const exams = examsData?.exams || [];
  const selectedId = searchParams.get("exam") || "";
  const activeExam = useMemo(() => {
    if (!exams.length) return null;
    return exams.find((e) => e.id === selectedId) || exams[0];
  }, [exams, selectedId]);

  useEffect(() => {
    setAnswers({});
    setSubmitted(false);
    setFilterMissed(false);
    setTimerRunning(false);
    setSecondsLeft((activeExam?.durationMinutes || 90) * 60);
  }, [activeExam?.id, activeExam?.durationMinutes]);

  useEffect(() => {
    if (!timerRunning || submitted) return;
    const id = setInterval(() => {
      setSecondsLeft((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [timerRunning, submitted]);

  const isExamUnlocked = activeExam ? activeExam.id === "nclex-exam-1-diagnostic" || enrolled : false;
  const questions = activeExam?.questions || [];
  const answeredCount = questions.filter((q) => answers[q.id] !== undefined).length;
  const score = questions.reduce((acc, q) => (answers[q.id] === q.answerIndex ? acc + 1 : acc), 0);
  const pctScore = Math.round((score / Math.max(1, questions.length)) * 100);
  const passed = pctScore >= (activeExam?.passScore || 75);

  const visibleQuestions = submitted && filterMissed
    ? questions.filter((q) => answers[q.id] !== q.answerIndex)
    : questions;

  if (loading) {
    return (
      <main className="nu-section">
        <div className="nu-container">
          <NursingLoader label="Loading NCLEX-RN Examinations Suite..." />
        </div>
      </main>
    );
  }

  return (
    <main className="nu-nclex-theme" style={{ background: "#f8fafc", minHeight: "86vh" }}>
      <NclexNavStrip />
      <NclexLabDrawer open={labOpen} onClose={() => setLabOpen(false)} />

      {/* Obsidian Black + Clinical Blue Hero Header */}
      <section
        style={{
          background: "#09090b",
          backgroundImage: "linear-gradient(105deg, rgba(9, 9, 11, 0.94) 0%, rgba(15, 23, 42, 0.86) 55%, rgba(29, 78, 216, 0.72) 100%), url('/assets/images/nclex-rn-hero-bg.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "#ffffff",
          padding: "34px 0",
          borderBottom: "4px solid #2563eb"
        }}
      >
        <div className="nu-container" style={{ maxWidth: 1180 }}>
          <div style={{ fontSize: "0.74rem", fontWeight: 800, color: "#60a5fa", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>
            DEDICATED SIMULATION COURSE · INCLUDED WITH $99 ACADEMY
          </div>
          <h1 style={{ margin: "0 0 8px", fontSize: "clamp(1.5rem, 2.6vw, 2.1rem)", color: "#ffffff" }}>
            {examsData?.title || "NCLEX-RN Examinations"}
          </h1>
          <p style={{ margin: 0, color: "#cbd5e1", maxWidth: 780, fontSize: "0.96rem", lineHeight: 1.55 }}>
            {examsData?.subtitle}
          </p>
        </div>
      </section>

      <section className="nu-section">
        <div className="nu-container" style={{ maxWidth: 1180 }}>
          {/* Exam Selector Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12, marginBottom: 24 }}>
            {exams.map((ex) => {
              const isCurrent = ex.id === activeExam?.id;
              const unlocked = ex.id === "nclex-exam-1-diagnostic" || enrolled;
              return (
                <button
                  key={ex.id}
                  type="button"
                  onClick={() => setSearchParams({ exam: ex.id })}
                  style={{
                    textAlign: "left",
                    padding: 16,
                    borderRadius: 10,
                    border: `2px solid ${isCurrent ? "#09090b" : "#cbd5e1"}`,
                    borderLeft: isCurrent ? "5px solid #2563eb" : "1px solid #cbd5e1",
                    background: isCurrent ? "#09090b" : "#ffffff",
                    color: isCurrent ? "#ffffff" : "#09090b",
                    cursor: "pointer"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.74rem", fontWeight: 700, color: isCurrent ? "#60a5fa" : "#475569", marginBottom: 4 }}>
                    <span>{ex.questions.length} Qs · {ex.durationMinutes} mins</span>
                    {!unlocked && <Lock size={13} />}
                  </div>
                  <div style={{ fontWeight: 700, fontSize: "0.92rem", lineHeight: 1.35 }}>
                    {ex.title}
                  </div>
                </button>
              );
            })}
          </div>

          {activeExam && (
            <div style={{ background: "#ffffff", border: "1px solid #cbd5e1", borderTop: "4px solid #09090b", borderRadius: 12, padding: 24 }}>
              {/* Interactive Exam Toolbar: Progress, Timer, & US Lab Exhibit */}
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 12, paddingBottom: 16, borderBottom: "1px solid #e2e8f0", marginBottom: 20 }}>
                <div>
                  <h2 style={{ margin: "0 0 4px", fontSize: "1.25rem", color: "#09090b" }}>{activeExam.title}</h2>
                  <p style={{ margin: 0, fontSize: "0.86rem", color: "#475569" }}>
                    {activeExam.description} · Answered: <strong>{answeredCount}/{questions.length}</strong> · Pass bar: <strong>{activeExam.passScore}%</strong>
                  </p>
                </div>

                {isExamUnlocked && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
                    {/* Countdown Timer Widget */}
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 8, background: "#09090b", color: "#ffffff", fontSize: "0.82rem", fontWeight: 800 }}>
                      <Clock size={14} color="#60a5fa" />
                      <span>{formatSeconds(secondsLeft)}</span>
                      {!submitted && (
                        <>
                          <button
                            type="button"
                            onClick={() => setTimerRunning((v) => !v)}
                            title={timerRunning ? "Pause timer" : "Start countdown timer"}
                            style={{ background: "#1d4ed8", border: 0, color: "#fff", borderRadius: 5, width: 24, height: 24, display: "grid", placeItems: "center", cursor: "pointer" }}
                          >
                            {timerRunning ? <Pause size={12} /> : <Play size={12} />}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setTimerRunning(false);
                              setSecondsLeft((activeExam.durationMinutes || 90) * 60);
                            }}
                            title="Reset timer"
                            style={{ background: "#18181b", border: "1px solid #334155", color: "#cbd5e1", borderRadius: 5, width: 24, height: 24, display: "grid", placeItems: "center", cursor: "pointer" }}
                          >
                            <RotateCcw size={12} />
                          </button>
                        </>
                      )}
                    </div>

                    {/* Pearson-style US Lab Values Exhibit Button */}
                    <button
                      type="button"
                      onClick={() => setLabOpen(true)}
                      style={{
                        padding: "7px 12px",
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
                  </div>
                )}
              </div>

              {/* Post-Submission Readiness Summary & Remediation Box */}
              {submitted && (
                <div style={{ marginBottom: 20, padding: "16px 20px", borderRadius: 10, background: passed ? "#eff6ff" : "#09090b", color: passed ? "#09090b" : "#ffffff", border: `2px solid ${passed ? "#1d4ed8" : "#2563eb"}`, display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 14 }}>
                  <div>
                    <div style={{ fontSize: "0.74rem", fontWeight: 800, color: passed ? "#1d4ed8" : "#60a5fa", textTransform: "uppercase" }}>
                      {passed ? "PASS-PREDICT READINESS ACHIEVED" : "REMEDIATION RECOMMENDED"}
                    </div>
                    <div style={{ fontSize: "1.2rem", fontWeight: 800, marginTop: 2 }}>
                      Score: {score} / {questions.length} ({pctScore}%) · {questions.length - score} Missed
                    </div>
                    <div style={{ fontSize: "0.82rem", opacity: 0.9, marginTop: 2 }}>
                      Review incorrect rationales below or reinforce weak clinical systems in the 16-Unit Study Player.
                    </div>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    <button
                      type="button"
                      onClick={() => setFilterMissed((v) => !v)}
                      style={{ padding: "8px 13px", borderRadius: 8, border: "1.5px solid #1d4ed8", background: filterMissed ? "#1d4ed8" : "#ffffff", color: filterMissed ? "#ffffff" : "#09090b", fontWeight: 700, fontSize: "0.8rem", cursor: "pointer" }}
                    >
                      {filterMissed ? `Showing Missed (${questions.length - score})` : `Filter Missed Only (${questions.length - score})`}
                    </button>
                    <Link
                      to="/nclex-rn/learn"
                      style={{ padding: "8px 13px", borderRadius: 8, background: "#1d4ed8", color: "#ffffff", fontWeight: 700, fontSize: "0.8rem", textDecoration: "none" }}
                    >
                      Review Unit Notes →
                    </Link>
                  </div>
                </div>
              )}

              {!isExamUnlocked ? (
                <div style={{ padding: "36px 20px", textAlign: "center", background: "#f8fafc", borderRadius: 10 }}>
                  <Lock size={34} color="#1d4ed8" style={{ marginBottom: 10 }} />
                  <h3 style={{ margin: "0 0 8px", color: "#09090b" }}>Included with NCLEX-RN Preparation Course ($99)</h3>
                  <p style={{ margin: "0 auto 18px", maxWidth: 500, color: "#475569", fontSize: "0.92rem" }}>
                    Exam 1 (75 Questions) is open as a free diagnostic preview. Enroll for $99 to unlock Exams 2, 3, and 4 plus all 16 weekly study units.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      if (!inCart) addToCart(NCLEX_COURSE_ITEM);
                      navigate("/cart");
                    }}
                    className="nu-btn nu-btn-primary"
                    style={{ background: "#09090b", borderColor: "#09090b" }}
                  >
                    <ShoppingCart size={15} /> {inCart ? "Go to Cart ($99)" : "Unlock Full Academy ($99)"}
                  </button>
                </div>
              ) : (
                <>
                  <div style={{ display: "grid", gap: 16 }}>
                    {visibleQuestions.map((q) => {
                      const qNum = questions.indexOf(q) + 1;
                      return (
                        <div key={q.id} style={{ border: "1px solid #e2e8f0", borderRadius: 10, padding: 16 }}>
                          <strong style={{ display: "block", marginBottom: 10, color: "#09090b" }}>
                            {qNum}. {q.prompt}
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
                            const matchedPlate = findQuestionVisualPlate(q, { unitTitle: activeExam?.title });
                            return matchedPlate ? <QuestionRationalePlate plate={matchedPlate} /> : null;
                          })()}
                        </div>
                      );
                    })}
                  </div>

                  <div style={{ marginTop: 22, display: "flex", gap: 10 }}>
                    {!submitted ? (
                      <button
                        type="button"
                        onClick={() => {
                          setSubmitted(true);
                          setTimerRunning(false);
                        }}
                        className="nu-btn nu-btn-primary"
                        style={{ background: "#09090b", borderColor: "#09090b" }}
                      >
                        <CheckCircle2 size={16} /> Submit Examination &amp; Score
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setAnswers({});
                          setSubmitted(false);
                          setFilterMissed(false);
                          setSecondsLeft((activeExam.durationMinutes || 90) * 60);
                        }}
                        className="nu-btn nu-btn-outline"
                      >
                        Retake Examination
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
