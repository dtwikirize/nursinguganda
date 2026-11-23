import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CheckCircle2, Clock, Lock, RotateCcw, ShoppingCart, XCircle } from "lucide-react";
import AdSlot from "../components/AdSlot";
import ReferencesBox from "../components/ReferencesBox";
import { useApp } from "../context/AppContext";

export default function MockExamsPage() {
  const { enrollments, addToCart } = useApp();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [activeExam, setActiveExam] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetch("/assets/data/mock-exams.json")
      .then((r) => r.json())
      .then(setData);
  }, []);

  const hasExamPass = enrollments.includes("unmeb-mock-pass") || enrollments.length >= 1;

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

  const startExam = (exam) => {
    if (!exam.isFreeSample && !hasExamPass) {
      addToCart({
        slug: "unmeb-mock-pass",
        title: "UNMEB Full Mock Exam Pass (All 6 Papers)",
        code: "UNMEB-PASS",
        programmeLabel: "All Programmes",
        thumbnail: "/assets/images/udemy/cat-research.png",
        priceUsd: 6.99,
        compareAtUsd: 14.99,
        lessonCount: 6,
        type: "bundle",
        courseSlugs: ["unmeb-mock-pass"]
      });
      navigate("/checkout");
      return;
    }
    setActiveExam(exam);
    setAnswers({});
    setSubmitted(false);
  };

  if (!data) {
    return (
      <main className="nu-section">
        <div className="nu-container"><p>Loading mock exams...</p></div>
      </main>
    );
  }

  return (
    <main>
      <section className="nu-cl-hero">
        <div className="nu-container">
          <span className="nu-badge nu-badge-bestseller" style={{ marginBottom: 10 }}>UNMEB &amp; BNE Exam Prep</span>
          <h1>Nursing &amp; Midwifery Mock Exams</h1>
          <p className="nu-cl-subtitle" style={{ maxWidth: 700 }}>
            Practice under real exam pacing with verified clinical rationales. Try the 30-question Speed Round free, or unlock all full exam series via PayPal (also unlocked automatically when you enroll in any paid course).
          </p>
        </div>
      </section>

      <section className="nu-section">
        <div className="nu-container">
          {!activeExam ? (
            <>
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
                    <article key={ex.id} style={{ border: "1px solid var(--nu-border)", padding: 22, background: "#fff", display: "flex", flexDirection: "column", gap: 10 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span className={`nu-badge ${unlocked ? "nu-badge-free" : "nu-badge-highyield"}`}>
                          {ex.isFreeSample ? "Free Sample" : unlocked ? "Unlocked" : "Exam Pass ($6.99)"}
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

              <AdSlot slot="mock-exams-hub" />
              <ReferencesBox references={data.references} heading="Exam Question Bank Sources" />
            </>
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
                <div style={{ padding: 20, background: "var(--nu-purple-soft)", border: "1px solid var(--nu-purple-border)", marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                  <div>
                    <strong style={{ fontSize: "1.2rem" }}>
                      Score: {score} / {examQuestions.length} ({Math.round((score / examQuestions.length) * 100)}%)
                    </strong>
                    <div style={{ fontSize: "0.88rem", color: "var(--nu-ink-muted)" }}>
                      Review every question rationale below to lock in clinical memory.
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
                    <div key={q.id} style={{ border: "1px solid var(--nu-border)", padding: 18, background: "#fff" }}>
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
                                border: isSelected ? "2px solid var(--nu-purple)" : "1px solid var(--nu-border)",
                                background: isRight ? "#dcfce7" : isWrong ? "#fee2e2" : "#fff",
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
                        <div style={{ marginTop: 10, fontSize: "0.86rem", display: "flex", alignItems: "center", gap: 6, color: chosen === q.answerIndex ? "var(--nu-success)" : "var(--nu-danger)" }}>
                          {chosen === q.answerIndex ? <CheckCircle2 size={15} /> : <XCircle size={15} />}
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
