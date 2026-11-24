import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  ClipboardCheck,
  Lock,
  MailCheck,
  RotateCcw,
  ShieldAlert
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { gradeQuizResponses } from "../utils/quizGenerator";

function shuffleQuestionsMixed(questions = []) {
  const arr = [...questions];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function FreeQuizzesPage() {
  const { user, quizAttempts, submitQuizResult } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const topicParam = searchParams.get("topic") || "";

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTopicId, setActiveTopicId] = useState(topicParam);
  const [shuffleKey, setShuffleKey] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetch("/assets/data/topic-quizzes.json")
      .then((r) => (r.ok ? r.json() : null))
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (topicParam) setActiveTopicId(topicParam);
  }, [topicParam]);

  const topics = data?.topics || [];
  const rawActiveTopic = useMemo(
    () => topics.find((t) => t.id === activeTopicId) || null,
    [topics, activeTopicId]
  );

  const activeTopic = useMemo(() => {
    if (!rawActiveTopic) return null;
    return {
      ...rawActiveTopic,
      questions: shuffleQuestionsMixed(rawActiveTopic.questions || [])
    };
  }, [rawActiveTopic, shuffleKey]);

  const openTopic = (id) => {
    setActiveTopicId(id);
    setShuffleKey((k) => k + 1);
    setSearchParams({ topic: id });
    setAnswers({});
    setResult(null);
    setErrorMsg("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const closeTopic = () => {
    setActiveTopicId("");
    setSearchParams({});
    setAnswers({});
    setResult(null);
    setErrorMsg("");
  };

  const answeredCount = useMemo(() => {
    if (!activeTopic) return 0;
    return activeTopic.questions.filter((q) => {
      const val = answers[q.id];
      if (q.type === "multi") return Array.isArray(val) && val.length > 0;
      return val !== undefined && val !== null;
    }).length;
  }, [activeTopic, answers]);

  const bestScoreFor = (slug) => {
    const matches = quizAttempts.filter((a) => a.quizType === "topic_free" && a.quizSlug === slug);
    if (!matches.length) return null;
    return Math.max(...matches.map((m) => Number(m.percent || 0)));
  };

  const handleSubmit = async () => {
    if (!activeTopic) return;
    if (!user) {
      setErrorMsg("You must sign in before submitting your quiz.");
      return;
    }
    setSubmitting(true);
    setErrorMsg("");
    const graded = gradeQuizResponses(activeTopic.questions, answers);
    const res = await submitQuizResult({
      quizType: "topic_free",
      quizSlug: activeTopic.id,
      quizTitle: activeTopic.title,
      score: graded.score,
      totalQuestions: graded.totalQuestions,
      breakdown: graded.breakdown,
      reviewItems: graded.reviewItems,
      sendEmail: true
    });
    setSubmitting(false);
    if (!res?.ok) {
      setErrorMsg(res?.error || "Could not submit quiz results.");
      return;
    }
    setResult({ ...graded, emailSent: Boolean(res.emailSent), attemptNumber: res.attempt?.attemptNumber || 1 });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <main className="nu-section">
        <div className="nu-container"><p>Loading Free Major Topic Quizzes...</p></div>
      </main>
    );
  }

  return (
    <main>
      <section className="nu-cl-hero">
        <div className="nu-container">
          <span className="nu-badge nu-badge-free" style={{ marginBottom: 10 }}>
            Free Materials &middot; Auto-Emailed Results
          </span>
          <h1>Free Major Topic Quizzes ({data?.totalQuestions || 270} Questions)</h1>
          <p className="nu-cl-subtitle" style={{ maxWidth: 760 }}>
            Practice 27-question mixed-format quizzes across {topics.length} core nursing &amp; midwifery domains:
            <strong> ~70% Single-Choice</strong>, <strong>~15% Multi-Choice</strong>, and <strong>~15% True/False</strong>.
            Sign in so your scores save and results email directly to your inbox.
          </p>
        </div>
      </section>

      <section className="nu-section">
        <div className="nu-container">
          {/* Mandatory Sign-In Gate Banner / Blocker */}
          {!user && (
            <div
              style={{
                border: "2px solid #A137F2",
                background: "linear-gradient(135deg, #FAF5FF 0%, #FFFFFF 100%)",
                borderRadius: 8,
                padding: 28,
                marginBottom: 28,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 18
              }}
            >
              <div style={{ maxWidth: 640 }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#6d28d9", fontWeight: 800, fontSize: "0.82rem", textTransform: "uppercase", marginBottom: 6 }}>
                  <Lock size={15} /> Free Sign-In Required Before Taking Quizzes
                </div>
                <h2 style={{ margin: "0 0 8px", fontSize: "1.35rem" }}>
                  Sign in to unlock all 10 topic quizzes &amp; receive automatic score emails
                </h2>
                <p style={{ margin: 0, color: "var(--nu-ink-muted)", fontSize: "0.92rem" }}>
                  Every completed quiz is graded with Single/Multi/True-False analytics, clinical rationales, and emailed straight to your registered address. Creating a student account takes 15 seconds.
                </p>
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <Link
                  to={`/login?next=${encodeURIComponent(activeTopicId ? `/quizzes?topic=${activeTopicId}` : "/quizzes")}`}
                  className="nu-btn nu-btn-primary"
                >
                  Sign In with Google or Email
                </Link>
              </div>
            </div>
          )}

          {!activeTopic ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 275px), 1fr))", gap: 20 }}>
              {topics.map((t) => {
                const best = bestScoreFor(t.id);
                const singles = t.questions.filter((q) => q.type === "single").length;
                const multis = t.questions.filter((q) => q.type === "multi").length;
                const bools = t.questions.filter((q) => q.type === "boolean").length;
                return (
                  <div
                    key={t.id}
                    style={{
                      border: "1px solid var(--nu-border)",
                      borderRadius: 8,
                      padding: 22,
                      background: "#fff",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      gap: 14
                    }}
                  >
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center", marginBottom: 10 }}>
                        <span className="nu-badge nu-badge-highyield">{t.badge || `${t.questions.length} Questions`}</span>
                        {best !== null && (
                          <span className="nu-badge nu-badge-free">Best: {best}%</span>
                        )}
                      </div>
                      <h3 style={{ margin: "0 0 6px" }}>{t.title}</h3>
                      <p style={{ margin: "0 0 12px", fontSize: "0.88rem", color: "var(--nu-ink-muted)" }}>{t.subtitle}</p>
                      <div style={{ fontSize: "0.78rem", color: "#4b5563", background: "#f8fafc", padding: "8px 10px", borderRadius: 4 }}>
                        {singles} Single Choice &middot; {multis} Multi-Choice &middot; {bools} True/False
                      </div>
                    </div>

                    {user ? (
                      <button
                        type="button"
                        className="nu-btn nu-btn-primary"
                        onClick={() => openTopic(t.id)}
                      >
                        <ClipboardCheck size={16} /> Start Topic Quiz ({t.questions.length} Qs)
                      </button>
                    ) : (
                      <Link
                        to={`/login?next=${encodeURIComponent(`/quizzes?topic=${t.id}`)}`}
                        className="nu-btn nu-btn-outline"
                        style={{ justifyContent: "center" }}
                      >
                        <Lock size={15} /> Sign In to Take Quiz
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          ) : !user ? (
            <div style={{ textAlign: "center", padding: "32px 16px" }}>
              <Link to="/quizzes" onClick={(e) => { e.preventDefault(); closeTopic(); }} className="nu-btn nu-btn-secondary">
                <ArrowLeft size={16} /> Back to All Topics
              </Link>
            </div>
          ) : (
            <div style={{ maxWidth: 860, margin: "0 auto" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
                <button type="button" className="nu-btn nu-btn-secondary" onClick={closeTopic}>
                  <ArrowLeft size={15} /> All Major Topics
                </button>
                <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#4b5563" }}>
                  Answered {answeredCount} of {activeTopic.questions.length} Questions
                </div>
              </div>

              <div style={{ border: "1px solid var(--nu-border)", borderRadius: 8, padding: 20, background: "#fff", marginBottom: 20 }}>
                <span className="nu-badge nu-badge-highyield">{activeTopic.badge}</span>
                <h2 style={{ margin: "8px 0 4px" }}>{activeTopic.title}</h2>
                <p style={{ margin: 0, color: "var(--nu-ink-muted)", fontSize: "0.92rem" }}>{activeTopic.subtitle}</p>
              </div>

              {errorMsg && (
                <div style={{ padding: 14, marginBottom: 18, background: "#fef2f2", border: "1px solid #fecaca", color: "#991b1b", borderRadius: 6 }}>
                  {errorMsg}
                </div>
              )}

              {result && (
                <div
                  style={{
                    border: result.passed ? "2px solid #16a34a" : "2px solid #eab308",
                    background: result.passed ? "#f0fdf4" : "#fefce8",
                    borderRadius: 8,
                    padding: 22,
                    marginBottom: 24
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
                    <div>
                      <h3 style={{ margin: "0 0 6px" }}>
                        Your Score: {result.score} / {result.totalQuestions} ({result.percent}%) —{" "}
                        {result.passed ? "Passed (>= 60%)" : "Keep Reviewing (< 60%)"}
                      </h3>
                      <div style={{ fontSize: "0.88rem", color: "#374151" }}>
                        Single Choice: <strong>{result.breakdown.single.correct}/{result.breakdown.single.total}</strong> &middot;
                        Multi-Choice: <strong>{result.breakdown.multi.correct}/{result.breakdown.multi.total}</strong> &middot;
                        True/False: <strong>{result.breakdown.tf.correct}/{result.breakdown.tf.total}</strong>
                      </div>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 8, fontSize: "0.85rem", color: "#15803d", fontWeight: 700 }}>
                        <MailCheck size={16} />
                        {result.emailSent
                          ? `Result report automatically emailed to ${user.email}`
                          : `Attempt #${result.attemptNumber} saved to your learner dashboard`}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 10 }}>
                      <button
                        type="button"
                        className="nu-btn nu-btn-primary"
                        onClick={() => {
                          setAnswers({});
                          setResult(null);
                          setShuffleKey((k) => k + 1);
                        }}
                      >
                        <RotateCcw size={15} /> Retake Quiz
                      </button>
                      <Link to="/my-learning" className="nu-btn nu-btn-secondary">
                        Dashboard &amp; Badges
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              <div style={{ display: "grid", gap: 16 }}>
                {activeTopic.questions.map((q, idx) => {
                  const userVal = answers[q.id];
                  const isMulti = q.type === "multi";
                  return (
                    <div key={q.id} style={{ border: "1px solid var(--nu-border)", borderRadius: 8, padding: 18, background: "#fff" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 8, marginBottom: 8 }}>
                        <span className="nu-badge nu-badge-free" style={{ fontSize: "0.72rem" }}>
                          Q{idx + 1} &middot; {isMulti ? "Multi-Choice (Select All Correct)" : q.type === "boolean" ? "True / False" : "Single Choice"}
                        </span>
                      </div>
                      <strong style={{ display: "block", marginBottom: 12, fontSize: "0.98rem" }}>
                        {q.prompt}
                      </strong>
                      <div style={{ display: "grid", gap: 8 }}>
                        {(q.options || []).map((opt, oi) => {
                          const selected = isMulti
                            ? Array.isArray(userVal) && userVal.includes(oi)
                            : userVal === oi;
                          const isRightOpt = result
                            ? isMulti
                              ? (q.answerIndices || []).includes(oi)
                              : Number(q.answerIndex) === oi
                            : false;
                          const isWrongSelected = result && selected && !isRightOpt;
                          return (
                            <label
                              key={oi}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 10,
                                padding: "10px 14px",
                                border: isRightOpt
                                  ? "1.5px solid #16a34a"
                                  : isWrongSelected
                                    ? "1.5px solid #dc2626"
                                    : "1px solid var(--nu-border)",
                                borderRadius: 6,
                                background: isRightOpt
                                  ? "#dcfce7"
                                  : isWrongSelected
                                    ? "#fee2e2"
                                    : selected
                                      ? "#faf5ff"
                                      : "#fff",
                                cursor: result ? "default" : "pointer"
                              }}
                            >
                              <input
                                type={isMulti ? "checkbox" : "radio"}
                                name={`fq-${q.id}`}
                                disabled={!!result}
                                checked={selected}
                                onChange={() => {
                                  if (isMulti) {
                                    setAnswers((prev) => {
                                      const cur = new Set(Array.isArray(prev[q.id]) ? prev[q.id] : []);
                                      if (cur.has(oi)) cur.delete(oi);
                                      else cur.add(oi);
                                      return { ...prev, [q.id]: [...cur] };
                                    });
                                  } else {
                                    setAnswers((prev) => ({ ...prev, [q.id]: oi }));
                                  }
                                }}
                              />
                              <span>{opt}</span>
                            </label>
                          );
                        })}
                      </div>
                      {result && q.rationale && (
                        <div style={{ marginTop: 10, fontSize: "0.86rem", color: "#374151", background: "#f8fafc", padding: "9px 12px", borderRadius: 6 }}>
                          <strong>Clinical Rationale:</strong> {q.rationale}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {!result && (
                <div style={{ marginTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                  <div style={{ fontSize: "0.82rem", color: "var(--nu-ink-muted)", display: "flex", alignItems: "center", gap: 6 }}>
                    <ShieldAlert size={15} /> Submitting grades all {activeTopic.questions.length} items and emails your score summary to {user.email}.
                  </div>
                  <button
                    type="button"
                    disabled={submitting}
                    className="nu-btn nu-btn-primary"
                    onClick={handleSubmit}
                  >
                    <CheckCircle2 size={16} />
                    {submitting ? "Grading & Sending Email..." : `Submit & Email Quiz Results (${answeredCount}/${activeTopic.questions.length})`}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
