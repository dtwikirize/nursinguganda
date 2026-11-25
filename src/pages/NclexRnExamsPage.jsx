import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  Lock,
  ShoppingCart
} from "lucide-react";
import { useApp } from "../context/AppContext";
import NclexNavStrip from "../components/NclexNavStrip";
import NursingLoader from "../components/NursingLoader";
import { setPageSeo } from "../components/RouteSeo";

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

export default function NclexRnExamsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isEnrolled, addToCart, cart, user } = useApp();

  const [examsData, setExamsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

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
  }, [activeExam?.id]);

  // Exam 1 is free preview (first 15 Qs if not enrolled, or full exam 1 free!)
  const isExamUnlocked = activeExam ? activeExam.id === "nclex-exam-1-diagnostic" || enrolled : false;
  const questions = activeExam?.questions || [];
  const score = questions.reduce((acc, q) => (answers[q.id] === q.answerIndex ? acc + 1 : acc), 0);

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
    <main style={{ background: "#f8fafc", minHeight: "86vh" }}>
      <NclexNavStrip />

      <section style={{ background: "#09090B", color: "#ffffff", padding: "30px 0", borderBottom: "4px solid #991B1B" }}>
        <div className="nu-container" style={{ maxWidth: 1180 }}>
          <div style={{ fontSize: "0.74rem", fontWeight: 800, color: "#FCA5A5", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>
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
                    border: `2px solid ${isCurrent ? "#991B1B" : "#cbd5e1"}`,
                    background: isCurrent ? "#991B1B" : "#ffffff",
                    color: isCurrent ? "#ffffff" : "#0f172a",
                    cursor: "pointer"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.74rem", fontWeight: 700, opacity: 0.85, marginBottom: 4 }}>
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
            <div style={{ background: "#ffffff", border: "1px solid #cbd5e1", borderRadius: 12, padding: 24 }}>
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 12, paddingBottom: 16, borderBottom: "1px solid #e2e8f0", marginBottom: 20 }}>
                <div>
                  <h2 style={{ margin: "0 0 4px", fontSize: "1.25rem", color: "#0f172a" }}>{activeExam.title}</h2>
                  <p style={{ margin: 0, fontSize: "0.86rem", color: "#475569" }}>
                    {activeExam.description} · <Clock size={13} style={{ display: "inline", verticalAlign: "text-bottom" }} /> {activeExam.durationMinutes} minutes · Pass bar: {activeExam.passScore}%
                  </p>
                </div>
                {submitted && (
                  <span style={{ padding: "6px 14px", borderRadius: 999, background: "#09090B", color: "#ffffff", fontWeight: 800, fontSize: "0.86rem" }}>
                    Final Score: {score} / {questions.length} ({Math.round((score / Math.max(1, questions.length)) * 100)}%)
                  </span>
                )}
              </div>

              {!isExamUnlocked ? (
                <div style={{ padding: "36px 20px", textAlign: "center", background: "#f8fafc", borderRadius: 10 }}>
                  <Lock size={34} color="#991B1B" style={{ marginBottom: 10 }} />
                  <h3 style={{ margin: "0 0 8px", color: "#0f172a" }}>Included with NCLEX-RN Preparation Course ($99)</h3>
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
                    style={{ background: "#991B1B", borderColor: "#991B1B" }}
                  >
                    <ShoppingCart size={15} /> {inCart ? "Go to Cart ($99)" : "Unlock Full Academy ($99)"}
                  </button>
                </div>
              ) : (
                <>
                  <div style={{ display: "grid", gap: 16 }}>
                    {questions.map((q, qi) => (
                      <div key={q.id} style={{ border: "1px solid #e2e8f0", borderRadius: 10, padding: 16 }}>
                        <strong style={{ display: "block", marginBottom: 10, color: "#0f172a" }}>
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
                                  border: `1.5px solid ${isRight ? "#059669" : isWrong ? "#dc2626" : chosen ? "#09090B" : "#cbd5e1"}`,
                                  background: isRight ? "#ECFDF5" : isWrong ? "#FEF2F2" : chosen ? "#f1f5f9" : "#ffffff",
                                  color: "#0f172a",
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
                          <div style={{ marginTop: 10, padding: "10px 12px", borderRadius: 6, background: "#f8fafc", borderLeft: "3px solid #991B1B", fontSize: "0.84rem", color: "#334155" }}>
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
                        style={{ background: "#991B1B", borderColor: "#991B1B" }}
                      >
                        <CheckCircle2 size={16} /> Submit Examination &amp; Score
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
