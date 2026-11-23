import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Award,
  CheckCircle2,
  Circle,
  Lock,
  MessageSquare,
  PanelRightClose,
  PanelRightOpen,
  RotateCcw,
  ShoppingCart
} from "lucide-react";
import AdSlot from "../components/AdSlot";
import CertificateCard from "../components/CertificateCard";
import ReferencesBox from "../components/ReferencesBox";
import TopicVisuals, { LessonSections } from "../components/TopicVisuals";
import { fetchCourseQA, postCourseQuestion } from "../lib/api";
import { formatUsd, useApp } from "../context/AppContext";
import { buildFinalEvaluation, buildSessionQuiz, gradeQuizResponses } from "../utils/quizGenerator";

export default function CoursePlayerPage() {
  const { courseSlug, lessonSlug } = useParams();
  const navigate = useNavigate();
  const {
    user,
    progress,
    lessonNotes,
    quizAttempts,
    certificates,
    isEnrolled,
    toggleLessonComplete,
    saveLessonNote,
    addToCart,
    submitQuizResult,
    submitFinalEvaluation
  } = useApp();

  const [course, setCourse] = useState(null);
  const [topicQuizzes, setTopicQuizzes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [bottomTab, setBottomTab] = useState("overview");
  const [qaList, setQaList] = useState([]);
  const [qTitle, setQTitle] = useState("");
  const [qBody, setQBody] = useState("");
  const [quizAnswers, setQuizAnswers] = useState({});
  const [sessionResult, setSessionResult] = useState(null);
  const [sessionSubmitting, setSessionSubmitting] = useState(false);
  const [evalAnswers, setEvalAnswers] = useState({});
  const [evalResult, setEvalResult] = useState(null);
  const [evalError, setEvalError] = useState("");
  const [evalSubmitting, setEvalSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setQuizAnswers({});
    setSessionResult(null);
    setEvalAnswers({});
    setEvalResult(null);
    setEvalError("");
    Promise.all([
      fetch(`/assets/data/courses/${courseSlug}.json`).then((r) => (r.ok ? r.json() : null)),
      fetch("/assets/data/topic-quizzes.json").then((r) => (r.ok ? r.json() : null)).catch(() => null)
    ])
      .then(([d, tq]) => {
        if (active) {
          setCourse(d);
          setTopicQuizzes(tq);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    fetchCourseQA(courseSlug).then((res) => {
      if (active && res?.ok) setQaList(res.questions || []);
    });
    return () => {
      active = false;
    };
  }, [courseSlug]);

  useEffect(() => {
    setQuizAnswers({});
    setSessionResult(null);
  }, [lessonSlug]);

  const flatTopics = useMemo(
    () => (course?.topicGroups || []).flatMap((g) => g.topics || []),
    [course]
  );

  const activeTopic = useMemo(() => {
    if (!flatTopics.length) return null;
    return flatTopics.find((t) => t.slug === lessonSlug) || flatTopics[0];
  }, [flatTopics, lessonSlug]);

  const activeLesson = activeTopic ? course?.lessons?.[activeTopic.slug] : null;
  const enrolled = course ? isEnrolled(course.slug, course.isFree) : false;
  const canViewLesson = enrolled || !!activeTopic?.isFreePreview;

  const completedSet = new Set(progress[courseSlug] || []);
  const completedCount = flatTopics.filter((t) => completedSet.has(t.slug)).length;
  const pct = flatTopics.length ? Math.round((completedCount / flatTopics.length) * 100) : 0;

  const noteKey = `${courseSlug}::${activeTopic?.slug || ""}`;
  const currentNote = lessonNotes[noteKey] || "";

  // Build 5-Question Session Quiz (Single, Multi-Choice & True/False) + 30-Question Final Evaluation
  const lessonQuiz = useMemo(
    () => (activeLesson && course ? buildSessionQuiz(activeLesson, course, topicQuizzes) : []),
    [activeLesson, course, topicQuizzes]
  );

  const finalEvalQuestions = useMemo(
    () => (course ? buildFinalEvaluation(course, topicQuizzes) : []),
    [course, topicQuizzes]
  );

  const existingCertificate = useMemo(
    () => certificates.find((c) => c.courseSlug === courseSlug) || null,
    [certificates, courseSlug]
  );

  const finalEvalAttempts = useMemo(
    () => quizAttempts.filter((a) => a.quizType === "course_final" && a.quizSlug === courseSlug),
    [quizAttempts, courseSlug]
  );
  const attemptsUsed = finalEvalAttempts.length;
  const attemptsRemaining = Math.max(0, 4 - attemptsUsed);

  if (loading) {
    return <div style={{ padding: 40 }}>Loading course player...</div>;
  }

  if (!course || !activeLesson) {
    return (
      <div style={{ padding: 40 }}>
        <h2>Lesson not found</h2>
        <Link to="/courses" className="nu-btn nu-btn-primary">Back to Courses</Link>
      </div>
    );
  }

  const currentIdx = flatTopics.findIndex((t) => t.slug === activeTopic.slug);
  const nextTopic = currentIdx >= 0 && currentIdx + 1 < flatTopics.length ? flatTopics[currentIdx + 1] : null;

  const handleMarkAndNext = async () => {
    await toggleLessonComplete(courseSlug, activeTopic.slug, !completedSet.has(activeTopic.slug));
    if (nextTopic) {
      navigate(`/learn/${courseSlug}/${nextTopic.slug}`);
    }
  };

  const handleAskQuestion = async (e) => {
    e.preventDefault();
    if (!qTitle.trim() || !qBody.trim()) return;
    const res = await postCourseQuestion({ courseSlug, title: qTitle, body: qBody, user });
    if (res.ok) {
      setQaList(res.questions || []);
      setQTitle("");
      setQBody("");
    }
  };

  return (
    <div>
      {/* Dark Udemy Player Top Bar */}
      <div className="nu-player-bar">
        <div style={{ display: "flex", alignItems: "center", gap: 14, minWidth: 0 }}>
          <Link to={`/course/${course.slug}`} style={{ color: "#e2e8f0", display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.85rem" }}>
            <ArrowLeft size={16} /> Back to Course
          </Link>
          <span style={{ color: "#4b5563" }}>|</span>
          <strong style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontSize: "0.92rem" }}>
            {course.title}
          </strong>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontSize: "0.82rem", color: "#cbd5e1" }}>
            {completedCount} of {flatTopics.length} completed ({pct}%)
          </span>
          <button
            type="button"
            onClick={() => setSidebarOpen((v) => !v)}
            style={{ background: "transparent", border: "1px solid #4b5563", color: "#fff", padding: "6px 10px", display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.82rem" }}
          >
            {sidebarOpen ? <PanelRightClose size={15} /> : <PanelRightOpen size={15} />}
            Curriculum
          </button>
        </div>
      </div>

      <div className={`nu-player-layout ${sidebarOpen ? "" : "sidebar-hidden"}`}>
        {/* Left: Distraction-free lesson reader */}
        <div className="nu-player-main">
          {!canViewLesson ? (
            <div
              style={{
                border: "1px solid var(--nu-border)",
                background: "var(--nu-bg-subtle)",
                padding: "40px 28px",
                textAlign: "center"
              }}
            >
              <Lock size={38} color="#a435f0" style={{ margin: "0 auto 12px" }} />
              <h2 style={{ margin: "0 0 8px" }}>Unlock Full Course Access</h2>
              <p style={{ color: "var(--nu-ink-muted)", maxWidth: 500, margin: "0 auto 20px" }}>
                This topic is part of the full <strong>{course.title}</strong> unit ({course.lessonCount} lessons, unit quizzes &amp; references). Unlock lifetime access securely via PayPal for {formatUsd(course.priceUsd)}.
              </p>
              <button
                type="button"
                className="nu-btn nu-btn-primary nu-btn-lg"
                onClick={() => {
                  addToCart(course);
                  navigate("/checkout");
                }}
              >
                <ShoppingCart size={18} /> Unlock Full Course ({formatUsd(course.priceUsd)})
              </button>
            </div>
          ) : (
            <article className="nu-lesson-article">
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
                <span className="nu-badge nu-badge-highyield">{course.programmeLabel}</span>
                {activeTopic.isFreePreview && !enrolled && (
                  <span className="nu-badge nu-badge-free">Free Preview Lesson</span>
                )}
                <span style={{ fontSize: "0.82rem", color: "var(--nu-ink-muted)" }}>
                  {activeLesson.readMinutes} min read · {activeLesson.wordCount} words
                </span>
              </div>

              <h1>{activeTopic.title}</h1>
              {activeLesson.excerpt && (
                <p style={{ fontSize: "1.05rem", color: "var(--nu-ink-muted)", marginBottom: 20 }}>
                  {activeLesson.excerpt}
                </p>
              )}

              {/* Medical Illustrations, Napkin Study Flowchart & Clinical Reference Table */}
              <TopicVisuals lesson={activeLesson} topicTitle={activeTopic.title} />

              {/* Page-by-Page Color-Organized Notes */}
              <LessonSections sections={activeLesson.sections || []} headingTag="h2" />

              {/* AdSense only on Free Preview / Free Courses — NEVER on Paid Player */}
              {(!course.isFree && activeTopic.isFreePreview && !enrolled) || course.isFree ? (
                <AdSlot slot="free-lesson-bottom" />
              ) : null}

              {/* Authoritative References on EVERY Topic */}
              <ReferencesBox
                references={activeLesson.references}
                heading="Topic References &amp; Clinical Sources"
              />

              {/* Complete & Continue Bar */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "space-between", alignItems: "center", marginTop: 28, paddingTop: 20, borderTop: "1px solid var(--nu-border)" }}>
                <button
                  type="button"
                  className={`nu-btn ${completedSet.has(activeTopic.slug) ? "nu-btn-outline" : "nu-btn-primary"}`}
                  onClick={handleMarkAndNext}
                >
                  <CheckCircle2 size={16} />
                  {completedSet.has(activeTopic.slug)
                    ? nextTopic ? "Completed — Next Lesson" : "Completed"
                    : nextTopic ? "Mark Complete & Continue" : "Mark Lesson Complete"}
                </button>
                {!enrolled && !course.isFree && (
                  <button
                    type="button"
                    className="nu-btn nu-btn-dark"
                    onClick={() => {
                      addToCart(course);
                      navigate("/checkout");
                    }}
                  >
                    Unlock All {course.lessonCount} Lessons ({formatUsd(course.priceUsd)})
                  </button>
                )}
              </div>
            </article>
          )}

          {/* Udemy Bottom Tabs: Overview | Q&A | Personal Notes | Session Quiz (5 Qs) | Final Evaluation (30 Qs) */}
          <div style={{ marginTop: 40 }} id="nu-player-assessments">
            <div className="nu-tabs">
              {["overview", "qa", "notes", "quiz", "final-exam"].map((tabKey) => (
                <button
                  key={tabKey}
                  type="button"
                  className={`nu-tab ${bottomTab === tabKey ? "active" : ""}`}
                  onClick={() => setBottomTab(tabKey)}
                >
                  {tabKey === "overview" && "Overview"}
                  {tabKey === "qa" && `Q&A (${qaList.length})`}
                  {tabKey === "notes" && "Personal Notes"}
                  {tabKey === "quiz" && `Session Quiz (${lessonQuiz.length} Qs)`}
                  {tabKey === "final-exam" && "Final Evaluation (30 Qs · Certificate)"}
                </button>
              ))}
            </div>

            {bottomTab === "overview" && (
              <div>
                <h3>About this unit</h3>
                <p style={{ color: "var(--nu-ink-muted)" }}>{course.subtitle}</p>
                <p><strong>Clinical Reviewer:</strong> {course.clinicalReviewer}</p>
              </div>
            )}

            {bottomTab === "qa" && (
              <div>
                <form onSubmit={handleAskQuestion} style={{ display: "grid", gap: 10, marginBottom: 24, padding: 16, border: "1px solid var(--nu-border)" }}>
                  <strong style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <MessageSquare size={16} /> Ask a question about this unit
                  </strong>
                  <input
                    type="text"
                    placeholder="Question summary (e.g. How do we calculate paediatric drip rate?)"
                    value={qTitle}
                    onChange={(e) => setQTitle(e.target.value)}
                    style={{ height: 40, padding: "0 12px", border: "1px solid var(--nu-border)" }}
                  />
                  <textarea
                    rows={3}
                    placeholder="Add details..."
                    value={qBody}
                    onChange={(e) => setQBody(e.target.value)}
                    style={{ padding: 12, border: "1px solid var(--nu-border)", fontFamily: "inherit" }}
                  />
                  <button type="submit" className="nu-btn nu-btn-primary" style={{ width: "fit-content" }}>
                    Post Question
                  </button>
                </form>

                {qaList.length === 0 ? (
                  <p style={{ color: "var(--nu-ink-muted)" }}>No questions asked in this unit yet.</p>
                ) : (
                  <div style={{ display: "grid", gap: 14 }}>
                    {qaList.map((q) => (
                      <div key={q.id} style={{ border: "1px solid var(--nu-border-light)", padding: 14 }}>
                        <strong>{q.title}</strong>
                        <p style={{ margin: "6px 0", fontSize: "0.9rem" }}>{q.body}</p>
                        <small style={{ color: "var(--nu-ink-muted)" }}>Asked by {q.userName}</small>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {bottomTab === "notes" && (
              <div>
                <label style={{ display: "block", fontWeight: 700, marginBottom: 8 }}>
                  Your study notes for &ldquo;{activeTopic.title}&rdquo;
                </label>
                <textarea
                  rows={6}
                  value={currentNote}
                  onChange={(e) => saveLessonNote(noteKey, e.target.value)}
                  placeholder="Write exam mnemonics, drug dosages, or ward reminders here (saved automatically)..."
                  style={{ width: "100%", padding: 14, border: "1px solid var(--nu-border)", fontFamily: "inherit" }}
                />
              </div>
            )}

            {bottomTab === "quiz" && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 14 }}>
                  <div>
                    <h3 style={{ margin: 0 }}>Session Checkpoint Quiz ({lessonQuiz.length} Questions)</h3>
                    <small style={{ color: "var(--nu-ink-muted)" }}>
                      Includes Single-Choice, Multi-Choice (Select ALL), and True/False checks for <strong>{activeTopic.title}</strong>.
                    </small>
                  </div>
                  {sessionResult && (
                    <button
                      type="button"
                      className="nu-btn nu-btn-secondary"
                      style={{ height: 34, padding: "0 12px", fontSize: "0.82rem" }}
                      onClick={() => {
                        setQuizAnswers({});
                        setSessionResult(null);
                      }}
                    >
                      <RotateCcw size={14} /> Retake Session Quiz
                    </button>
                  )}
                </div>

                {sessionResult && (
                  <div
                    style={{
                      padding: 16,
                      marginBottom: 18,
                      borderRadius: 6,
                      border: sessionResult.passed ? "1px solid #86efac" : "1px solid #fde047",
                      background: sessionResult.passed ? "#f0fdf4" : "#fefce8"
                    }}
                  >
                    <strong>
                      Session Score: {sessionResult.score} / {sessionResult.totalQuestions} ({sessionResult.percent}%) —{" "}
                      {sessionResult.passed ? "Checkpoint Passed" : "Review Notes & Retry"}
                    </strong>
                    {sessionResult.emailSent && (
                      <div style={{ fontSize: "0.82rem", color: "#15803d", marginTop: 4 }}>
                        Results emailed automatically to {user?.email}.
                      </div>
                    )}
                  </div>
                )}

                <div style={{ display: "grid", gap: 16 }}>
                  {lessonQuiz.map((q) => {
                    const userVal = quizAnswers[q.id];
                    const isMulti = q.type === "multi";
                    return (
                      <div key={q.id} style={{ border: "1px solid var(--nu-border)", borderRadius: 6, padding: 16, background: "#fff" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 8, marginBottom: 8 }}>
                          <span className="nu-badge nu-badge-free" style={{ fontSize: "0.7rem" }}>
                            {isMulti ? "Multi-Choice (Select All)" : q.type === "boolean" ? "True / False" : "Single Choice"}
                          </span>
                        </div>
                        <strong style={{ display: "block", marginBottom: 10 }}>
                          {q.qNum}. {q.prompt}
                        </strong>
                        <div style={{ display: "grid", gap: 8 }}>
                          {(q.options || []).map((opt, oi) => {
                            const selected = isMulti
                              ? Array.isArray(userVal) && userVal.includes(oi)
                              : userVal === oi;
                            const isRightOpt = sessionResult
                              ? isMulti
                                ? (q.answerIndices || []).includes(oi)
                                : Number(q.answerIndex) === oi
                              : false;
                            const isWrongSelected = sessionResult && selected && !isRightOpt;
                            return (
                              <label
                                key={oi}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 10,
                                  padding: "10px 12px",
                                  border: isRightOpt
                                    ? "1.5px solid #16a34a"
                                    : isWrongSelected
                                      ? "1.5px solid #dc2626"
                                      : "1px solid var(--nu-border)",
                                  borderRadius: 4,
                                  background: isRightOpt
                                    ? "#dcfce7"
                                    : isWrongSelected
                                      ? "#fee2e2"
                                      : selected
                                        ? "#faf5ff"
                                        : "#fff",
                                  cursor: sessionResult ? "default" : "pointer"
                                }}
                              >
                                <input
                                  type={isMulti ? "checkbox" : "radio"}
                                  name={`sess-${q.id}`}
                                  disabled={!!sessionResult}
                                  checked={selected}
                                  onChange={() => {
                                    if (isMulti) {
                                      setQuizAnswers((prev) => {
                                        const cur = new Set(Array.isArray(prev[q.id]) ? prev[q.id] : []);
                                        if (cur.has(oi)) cur.delete(oi);
                                        else cur.add(oi);
                                        return { ...prev, [q.id]: [...cur] };
                                      });
                                    } else {
                                      setQuizAnswers((prev) => ({ ...prev, [q.id]: oi }));
                                    }
                                  }}
                                />
                                <span>{opt}</span>
                              </label>
                            );
                          })}
                        </div>
                        {sessionResult && q.rationale && (
                          <div style={{ marginTop: 10, fontSize: "0.84rem", color: "#4b5563", background: "#f8fafc", padding: "8px 10px", borderRadius: 4 }}>
                            <strong>Rationale:</strong> {q.rationale}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {!sessionResult && lessonQuiz.length > 0 && (
                  <div style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                    <button
                      type="button"
                      disabled={sessionSubmitting}
                      className="nu-btn nu-btn-primary"
                      onClick={async () => {
                        const graded = gradeQuizResponses(lessonQuiz, quizAnswers);
                        if (!user) {
                          setSessionResult({ ...graded, emailSent: false });
                          return;
                        }
                        setSessionSubmitting(true);
                        const res = await submitQuizResult({
                          quizType: "course_session",
                          quizSlug: `${courseSlug}::${activeTopic.slug}`,
                          quizTitle: `${course.title} — ${activeTopic.title} (Session Quiz)`,
                          score: graded.score,
                          totalQuestions: graded.totalQuestions,
                          breakdown: graded.breakdown,
                          reviewItems: graded.reviewItems,
                          sendEmail: true
                        });
                        setSessionSubmitting(false);
                        setSessionResult({ ...graded, emailSent: Boolean(res?.emailSent) });
                      }}
                    >
                      {sessionSubmitting ? "Grading..." : "Submit Session Quiz (5 Qs)"}
                    </button>
                    {!user && (
                      <small style={{ color: "var(--nu-ink-muted)" }}>
                        <Link to="/login" style={{ color: "var(--nu-purple)", fontWeight: 700 }}>Sign in</Link> to save session scores and receive email reports.
                      </small>
                    )}
                  </div>
                )}
              </div>
            )}

            {bottomTab === "final-exam" && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 18 }}>
                  <div>
                    <h3 style={{ margin: "0 0 4px", display: "flex", alignItems: "center", gap: 8 }}>
                      <Award size={20} color="#A137F2" /> Final Course Evaluation (30 Questions)
                    </h3>
                    <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--nu-ink-muted)" }}>
                      Passmark: <strong>60%</strong> ({Math.ceil(30 * 0.6)}/30) &middot; Maximum <strong>4 attempts</strong> allowed &middot; Unlocks printable <strong>Certificate of Study Completion</strong>.
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <span className="nu-badge nu-badge-highyield">Attempts Used: {attemptsUsed} / 4</span>
                    {existingCertificate && <span className="nu-badge nu-badge-free">Certified ({existingCertificate.percent}%)</span>}
                  </div>
                </div>

                {existingCertificate && (
                  <div style={{ marginBottom: 24 }}>
                    <CertificateCard certificate={existingCertificate} learnerName={user?.name} />
                  </div>
                )}

                {!user ? (
                  <div style={{ border: "1px solid var(--nu-border)", padding: 24, borderRadius: 6, background: "#faf5ff", textAlign: "center" }}>
                    <h4 style={{ margin: "0 0 8px" }}>Sign In Required for Final Evaluation &amp; Certificate</h4>
                    <p style={{ margin: "0 0 16px", color: "var(--nu-ink-muted)" }}>
                      Create a free learner account or sign in so Nursing Uganda can issue your named Certificate of Completion, track your 4 attempts, and email your verified result.
                    </p>
                    <Link to={`/login?next=${encodeURIComponent(`/learn/${course.slug}/${activeTopic.slug}`)}`} className="nu-btn nu-btn-primary">
                      Sign In to Take Final Evaluation
                    </Link>
                  </div>
                ) : !enrolled ? (
                  <div style={{ border: "1px solid var(--nu-border)", padding: 24, borderRadius: 6, background: "#fff" }}>
                    <h4 style={{ margin: "0 0 8px" }}>Enroll to Unlock the 30-Question Final Evaluation</h4>
                    <p style={{ margin: "0 0 14px", color: "var(--nu-ink-muted)" }}>
                      Full unit enrollment unlocks all course lessons plus the 30-question Final Evaluation &amp; Certificate of Completion.
                    </p>
                    <button
                      type="button"
                      className="nu-btn nu-btn-primary"
                      onClick={() => {
                        addToCart(course);
                        navigate("/cart");
                      }}
                    >
                      Enroll in {course.title} ({formatUsd(course.priceUsd)})
                    </button>
                  </div>
                ) : attemptsRemaining === 0 && !existingCertificate ? (
                  <div style={{ border: "1px solid #fca5a5", background: "#fef2f2", padding: 20, borderRadius: 6 }}>
                    <h4 style={{ margin: "0 0 6px", color: "#991b1b" }}>Maximum 4 Attempts Used</h4>
                    <p style={{ margin: 0, fontSize: "0.9rem", color: "#7f1d1d" }}>
                      You have completed all 4 permitted Final Evaluation attempts for this course without reaching the 60% passmark. Review the unit notes and Free Topic Quizzes, or contact <strong>support@nursinguganda.com</strong> for tutor evaluation reset.
                    </p>
                  </div>
                ) : (
                  <div>
                    {evalError && (
                      <div style={{ padding: 12, marginBottom: 14, background: "#fef2f2", border: "1px solid #fecaca", color: "#991b1b", borderRadius: 6 }}>
                        {evalError}
                      </div>
                    )}

                    {evalResult && (
                      <div
                        style={{
                          padding: 16,
                          marginBottom: 18,
                          borderRadius: 6,
                          border: evalResult.passed ? "1px solid #86efac" : "1px solid #fde047",
                          background: evalResult.passed ? "#f0fdf4" : "#fefce8"
                        }}
                      >
                        <strong>
                          Final Evaluation Result (Attempt #{evalResult.attemptNumber} of 4): {evalResult.score} / {evalResult.totalQuestions} ({evalResult.percent}%) —{" "}
                          {evalResult.passed ? "PASSED! Certificate Unlocked." : `Below 60% passmark. ${evalResult.attemptsRemaining} attempt(s) remaining.`}
                        </strong>
                        {evalResult.emailSent && (
                          <div style={{ fontSize: "0.84rem", color: "#15803d", marginTop: 4 }}>
                            Certificate notification emailed to {user.email}.
                          </div>
                        )}
                        {!evalResult.passed && evalResult.attemptsRemaining > 0 && (
                          <div style={{ marginTop: 10 }}>
                            <button
                              type="button"
                              className="nu-btn nu-btn-secondary"
                              style={{ height: 34, fontSize: "0.82rem" }}
                              onClick={() => {
                                setEvalAnswers({});
                                setEvalResult(null);
                              }}
                            >
                              <RotateCcw size={14} /> Try Next Attempt ({evalResult.attemptsRemaining} left)
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    <div style={{ display: "grid", gap: 14 }}>
                      {finalEvalQuestions.map((q) => {
                        const userVal = evalAnswers[q.id];
                        const isMulti = q.type === "multi";
                        return (
                          <div key={q.id} style={{ border: "1px solid var(--nu-border)", borderRadius: 6, padding: 16, background: "#fff" }}>
                            <div style={{ marginBottom: 6 }}>
                              <span className="nu-badge nu-badge-free" style={{ fontSize: "0.7rem" }}>
                                Q{q.qNum} &middot; {isMulti ? "Multi-Choice (Select All)" : q.type === "boolean" ? "True / False" : "Single Choice"}
                              </span>
                            </div>
                            <strong style={{ display: "block", marginBottom: 10 }}>{q.prompt}</strong>
                            <div style={{ display: "grid", gap: 8 }}>
                              {(q.options || []).map((opt, oi) => {
                                const selected = isMulti
                                  ? Array.isArray(userVal) && userVal.includes(oi)
                                  : userVal === oi;
                                const isRightOpt = evalResult
                                  ? isMulti
                                    ? (q.answerIndices || []).includes(oi)
                                    : Number(q.answerIndex) === oi
                                  : false;
                                const isWrongSelected = evalResult && selected && !isRightOpt;
                                return (
                                  <label
                                    key={oi}
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 10,
                                      padding: "9px 12px",
                                      border: isRightOpt
                                        ? "1.5px solid #16a34a"
                                        : isWrongSelected
                                          ? "1.5px solid #dc2626"
                                          : "1px solid var(--nu-border)",
                                      borderRadius: 4,
                                      background: isRightOpt
                                        ? "#dcfce7"
                                        : isWrongSelected
                                          ? "#fee2e2"
                                          : selected
                                            ? "#faf5ff"
                                            : "#fff",
                                      cursor: evalResult ? "default" : "pointer"
                                    }}
                                  >
                                    <input
                                      type={isMulti ? "checkbox" : "radio"}
                                      name={`eval-${q.id}`}
                                      disabled={!!evalResult}
                                      checked={selected}
                                      onChange={() => {
                                        if (isMulti) {
                                          setEvalAnswers((prev) => {
                                            const cur = new Set(Array.isArray(prev[q.id]) ? prev[q.id] : []);
                                            if (cur.has(oi)) cur.delete(oi);
                                            else cur.add(oi);
                                            return { ...prev, [q.id]: [...cur] };
                                          });
                                        } else {
                                          setEvalAnswers((prev) => ({ ...prev, [q.id]: oi }));
                                        }
                                      }}
                                    />
                                    <span>{opt}</span>
                                  </label>
                                );
                              })}
                            </div>
                            {evalResult && q.rationale && (
                              <div style={{ marginTop: 8, fontSize: "0.82rem", color: "#4b5563", background: "#f8fafc", padding: "8px 10px", borderRadius: 4 }}>
                                <strong>Rationale:</strong> {q.rationale}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {!evalResult && (
                      <div style={{ marginTop: 20 }}>
                        <button
                          type="button"
                          disabled={evalSubmitting}
                          className="nu-btn nu-btn-primary"
                          onClick={async () => {
                            setEvalError("");
                            setEvalSubmitting(true);
                            const graded = gradeQuizResponses(finalEvalQuestions, evalAnswers);
                            const res = await submitFinalEvaluation({
                              courseSlug: course.slug,
                              courseTitle: course.title,
                              programmeLabel: course.programmeLabel || "",
                              score: graded.score,
                              totalQuestions: graded.totalQuestions,
                              breakdown: graded.breakdown
                            });
                            setEvalSubmitting(false);
                            if (!res?.ok) {
                              setEvalError(res?.error || "Could not submit final evaluation.");
                            } else {
                              setEvalResult(res);
                            }
                          }}
                        >
                          {evalSubmitting ? "Submitting Final Evaluation..." : `Submit Final Evaluation (${finalEvalQuestions.length} Qs)`}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right: Collapsible Curriculum Sidebar */}
        {sidebarOpen && (
          <aside className="nu-player-sidebar">
            <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--nu-border)", fontWeight: 700 }}>
              Course content
            </div>
            {(course.topicGroups || []).map((grp, gi) => (
              <div key={gi}>
                <div style={{ padding: "10px 16px", background: "var(--nu-bg-subtle)", fontSize: "0.82rem", fontWeight: 700, borderBottom: "1px solid var(--nu-border-light)" }}>
                  {grp.title}
                </div>
                {grp.topics.map((t) => {
                  const done = completedSet.has(t.slug);
                  const active = t.slug === activeTopic.slug;
                  const unlocked = enrolled || t.isFreePreview;
                  return (
                    <Link
                      key={t.slug}
                      to={`/learn/${course.slug}/${t.slug}`}
                      className={`nu-player-lesson-row ${active ? "active" : ""}`}
                    >
                      <span style={{ marginTop: 2 }}>
                        {done ? (
                          <CheckCircle2 size={16} color="#15803d" />
                        ) : unlocked ? (
                          <Circle size={16} color="#6a6f73" />
                        ) : (
                          <Lock size={15} color="#6a6f73" />
                        )}
                      </span>
                      <div style={{ flex: 1 }}>
                        <div>{t.title}</div>
                        <small style={{ color: "var(--nu-ink-muted)" }}>
                          {t.readMinutes} min {t.isFreePreview && !enrolled ? "· Free Preview" : ""}
                        </small>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ))}
            <div style={{ padding: 16, borderTop: "2px solid var(--nu-border)", background: "#FAF5FF" }}>
              <button
                type="button"
                className="nu-btn nu-btn-primary"
                style={{ width: "100%", justifyContent: "center", fontSize: "0.84rem" }}
                onClick={() => {
                  setBottomTab("final-exam");
                  document.getElementById("nu-player-assessments")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <Award size={16} /> Final Evaluation (30 Qs · Certificate)
              </button>
              <small style={{ display: "block", marginTop: 6, color: "var(--nu-ink-muted)", textAlign: "center" }}>
                60% passmark &middot; {attemptsUsed}/4 attempts used
              </small>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
