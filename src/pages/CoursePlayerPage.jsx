import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Lock,
  MessageSquare,
  PanelRightClose,
  PanelRightOpen,
  ShoppingCart
} from "lucide-react";
import AdSlot from "../components/AdSlot";
import ReferencesBox from "../components/ReferencesBox";
import RichText from "../components/RichText";
import { fetchCourseQA, postCourseQuestion } from "../lib/api";
import { formatUsd, useApp } from "../context/AppContext";

export default function CoursePlayerPage() {
  const { courseSlug, lessonSlug } = useParams();
  const navigate = useNavigate();
  const {
    user,
    progress,
    lessonNotes,
    isEnrolled,
    toggleLessonComplete,
    saveLessonNote,
    addToCart
  } = useApp();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [bottomTab, setBottomTab] = useState("overview");
  const [qaList, setQaList] = useState([]);
  const [qTitle, setQTitle] = useState("");
  const [qBody, setQBody] = useState("");
  const [quizAnswers, setQuizAnswers] = useState({});

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetch(`/assets/data/courses/${courseSlug}.json`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (active) setCourse(d);
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

  // Build deterministic self-check quiz from lesson sections
  const lessonQuiz = useMemo(() => {
    if (!activeLesson?.sections) return [];
    const headings = activeLesson.sections
      .map((s) => s.title)
      .filter((t) => t && !/reference|overview/i.test(t));
    if (headings.length < 2) return [];
    return headings.slice(0, 3).map((h, i) => {
      const distractors = headings.filter((x) => x !== h).slice(0, 3);
      while (distractors.length < 3) distractors.push(`Unrelated clinical unit ${distractors.length + 1}`);
      const options = [h, ...distractors].sort();
      return {
        id: i,
        prompt: `Which clinical section is covered in "${activeLesson.title}"?`,
        options,
        correct: h
      };
    });
  }, [activeLesson]);

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

              {/* Lesson Images */}
              {activeLesson.images && activeLesson.images.length > 0 && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14, margin: "18px 0 24px" }}>
                  {activeLesson.images.slice(0, 3).map((src, i) => (
                    <figure key={i} style={{ margin: 0, border: "1px solid var(--nu-border-light)", background: "#fff", padding: 8 }}>
                      <img src={src} alt={`${activeTopic.title} diagram ${i + 1}`} style={{ width: "100%", height: 210, objectFit: "contain" }} loading="lazy" />
                    </figure>
                  ))}
                </div>
              )}

              {/* Structured Sections */}
              {(activeLesson.sections || []).map((sec, sIdx) => (
                <section key={sIdx} className="nu-lesson-section">
                  <h2>{sec.title}</h2>
                  {(sec.blocks || []).map((b, bIdx) => {
                    if (b.type === "bullet") {
                      return (
                        <ul key={bIdx}>
                          <li><RichText text={b.text} /></li>
                        </ul>
                      );
                    }
                    if (Array.isArray(b.items)) {
                      return (
                        <ul key={bIdx}>
                          {b.items.map((it, ii) => <li key={ii}><RichText text={it} /></li>)}
                        </ul>
                      );
                    }
                    return <p key={bIdx}><RichText text={b.text} /></p>;
                  })}
                </section>
              ))}

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

          {/* Udemy Bottom Tabs: Overview | Q&A | Personal Notes | Quiz */}
          <div style={{ marginTop: 40 }}>
            <div className="nu-tabs">
              {["overview", "qa", "notes", "quiz"].map((tabKey) => (
                <button
                  key={tabKey}
                  type="button"
                  className={`nu-tab ${bottomTab === tabKey ? "active" : ""}`}
                  onClick={() => setBottomTab(tabKey)}
                >
                  {tabKey === "overview" && "Overview"}
                  {tabKey === "qa" && `Q&A (${qaList.length})`}
                  {tabKey === "notes" && "Personal Notes"}
                  {tabKey === "quiz" && "Topic Quiz"}
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
                {lessonQuiz.length === 0 ? (
                  <p style={{ color: "var(--nu-ink-muted)" }}>
                    Try our <Link to="/mock-exams" style={{ color: "var(--nu-purple)", fontWeight: 700 }}>UNMEB Timed Mock Exams</Link> for full clinical MCQs on this programme.
                  </p>
                ) : (
                  <div style={{ display: "grid", gap: 16 }}>
                    {lessonQuiz.map((q) => {
                      const picked = quizAnswers[q.id];
                      return (
                        <div key={q.id} style={{ border: "1px solid var(--nu-border)", padding: 16 }}>
                          <strong style={{ display: "block", marginBottom: 10 }}>{q.id + 1}. {q.prompt}</strong>
                          <div style={{ display: "grid", gap: 8 }}>
                            {q.options.map((opt) => {
                              const isSelected = picked === opt;
                              const isCorrect = picked && opt === q.correct;
                              const isWrong = isSelected && opt !== q.correct;
                              return (
                                <button
                                  key={opt}
                                  type="button"
                                  disabled={!!picked}
                                  onClick={() => setQuizAnswers((p) => ({ ...p, [q.id]: opt }))}
                                  style={{
                                    textAlign: "left",
                                    padding: "10px 12px",
                                    border: "1px solid var(--nu-border)",
                                    background: isCorrect ? "#dcfce7" : isWrong ? "#fee2e2" : "#fff"
                                  }}
                                >
                                  {opt}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
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
          </aside>
        )}
      </div>
    </div>
  );
}
