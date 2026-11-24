import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Award,
  BarChart2,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  Lock,
  LogOut,
  Mail,
  MailWarning,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  Trophy
} from "lucide-react";
import CertificateCard from "../components/CertificateCard";
import { useApp } from "../context/AppContext";
import { fetchSecurityEvents } from "../lib/api";

const SIDEBAR_ITEMS = [
  { id: "courses", label: "My Courses", icon: BookOpen },
  { id: "badges", label: "Badges & Certificates", icon: Award },
  { id: "progress", label: "Study Progress", icon: BarChart2 },
  { id: "notes", label: "eBooks & Saved Notes", icon: FileText },
  { id: "preferences", label: "Email & Digest", icon: Mail },
  { id: "security", label: "Account & Security", icon: ShieldCheck }
];

export default function MyLearningPage() {
  const { catalog, user, enrollments, progress, quizAttempts, certificates, lessonNotes, logout } = useApp();
  const [searchParams] = useSearchParams();
  const [section, setSection] = useState("courses");
  const [tab, setTab] = useState("all");
  const purchased = searchParams.get("purchased") === "1";

  const [digestSubscribed, setDigestSubscribed] = useState(user?.digestSubscribed !== false);
  const [topicPreference, setTopicPreference] = useState(user?.topicPreference || "all");
  const [prefSaved, setPrefSaved] = useState("");
  const [securityEvents, setSecurityEvents] = useState([]);

  useEffect(() => {
    if (user) {
      setDigestSubscribed(user.digestSubscribed !== false);
      setTopicPreference(user.topicPreference || "all");
    }
  }, [user]);

  useEffect(() => {
    if (section === "security" && user) {
      fetchSecurityEvents().then((res) => {
        if (res?.ok && Array.isArray(res.events)) {
          setSecurityEvents(res.events);
        }
      });
    }
  }, [section, user]);

  const courses = catalog?.courses || [];
  const enrolledCourses = useMemo(
    () =>
      user?.isAdmin
        ? courses
        : courses.filter(
            (c) => enrollments.includes(c.slug) || (Array.isArray(progress[c.slug]) && progress[c.slug].length > 0)
          ),
    [courses, enrollments, progress, user]
  );

  const categorized = useMemo(() => {
    return enrolledCourses.map((c) => {
      const doneCount = (progress[c.slug] || []).length;
      const pct = c.lessonCount ? Math.min(100, Math.round((doneCount / c.lessonCount) * 100)) : 0;
      return { ...c, doneCount, pct };
    });
  }, [enrolledCourses, progress]);

  const visibleCourses = useMemo(() => {
    if (tab === "in-progress") return categorized.filter((c) => c.pct > 0 && c.pct < 100);
    if (tab === "completed") return categorized.filter((c) => c.pct >= 100);
    return categorized;
  }, [categorized, tab]);

  const totalLessonsDone = useMemo(
    () => Object.values(progress || {}).reduce((sum, arr) => sum + (Array.isArray(arr) ? arr.length : 0), 0),
    [progress]
  );

  const noteEntries = useMemo(
    () => Object.entries(lessonNotes || {}).filter(([, text]) => String(text || "").trim()),
    [lessonNotes]
  );

  const handleSavePrefs = async (e) => {
    e.preventDefault();
    setPrefSaved("");
    try {
      const res = await fetch("/api/auth?action=preferences", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ digestSubscribed, topicPreference })
      });
      if (res.ok) {
        setPrefSaved("Your weekly study digest preferences have been saved.");
      }
    } catch {
      setPrefSaved("Could not update preferences right now.");
    }
  };

  return (
    <main style={{ background: "var(--nu-bg-subtle)", minHeight: "82vh" }}>
      <section className="nu-cl-hero" style={{ padding: "24px 0" }}>
        <div className="nu-container">
          <h1 style={{ fontFamily: "var(--nu-font-serif)", fontSize: "2rem", marginBottom: 6 }}>
            Learner Dashboard
          </h1>
          <p className="nu-cl-subtitle" style={{ margin: 0 }}>
            {user
              ? `Welcome back, ${user.name}. Track your nursing units, weekly digests, and account security.`
              : "Access your enrolled courses, free foundational units, and study progress."}
          </p>
        </div>
      </section>

      <div className="nu-container nu-dash-layout">
        {/* Learner Sidebar */}
        <aside className="nu-dash-sidebar">
          <div className="nu-dash-sidebar-head">
            <div className="nu-dash-avatar">{user?.initials || "NU"}</div>
            <div style={{ minWidth: 0 }}>
              <strong style={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {user ? user.name : "Guest Learner"}
              </strong>
              <small style={{ color: "var(--nu-ink-muted)", display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {user ? user.email : "Sign in to sync across devices"}
              </small>
            </div>
          </div>

          <nav className="nu-dash-nav" aria-label="Learner dashboard navigation">
            {SIDEBAR_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`nu-dash-nav-btn ${section === item.id ? "active" : ""}`}
                  onClick={() => setSection(item.id)}
                >
                  <Icon size={17} />
                  <span>{item.label}</span>
                </button>
              );
            })}

            {user?.isAdmin && (
              <Link
                to="/nodadmin"
                className="nu-dash-nav-btn"
                style={{ color: "#A137F2", fontWeight: 700, borderTop: "1px solid var(--nu-border-light)", marginTop: 6, paddingTop: 12 }}
              >
                <Lock size={17} />
                <span>Owner Admin Panel</span>
              </Link>
            )}

            {user ? (
              <button
                type="button"
                className="nu-dash-nav-btn"
                style={{ color: "var(--nu-danger)" }}
                onClick={logout}
              >
                <LogOut size={17} />
                <span>Log out</span>
              </button>
            ) : (
              <Link to="/login" className="nu-dash-nav-btn" style={{ color: "#A137F2", fontWeight: 700 }}>
                <ShieldCheck size={17} />
                <span>Sign in / Sign up</span>
              </Link>
            )}
          </nav>
        </aside>

        {/* Main Content Area */}
        <section className="nu-dash-main">
          {user && user.emailVerified === false && (
            <div
              style={{
                padding: 14,
                background: "#fffbeb",
                border: "1px solid #fcd34d",
                color: "#92400e",
                marginBottom: 20,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                flexWrap: "wrap",
                borderRadius: 4
              }}
            >
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: "0.9rem" }}>
                <MailWarning size={18} />
                <strong>Verify your email ({user.email})</strong> to enable full security alerts and account recovery.
              </span>
              <Link to="/login?verify=1" className="nu-btn nu-btn-primary" style={{ padding: "6px 14px", fontSize: "0.85rem" }}>
                Verify Email
              </Link>
            </div>
          )}

          {purchased && (
            <div
              style={{
                padding: 16,
                background: "var(--nu-success-bg)",
                border: "1px solid #86efac",
                color: "var(--nu-success)",
                marginBottom: 20,
                display: "flex",
                alignItems: "center",
                gap: 10,
                borderRadius: 4
              }}
            >
              <CheckCircle2 size={20} />
              <strong>Payment confirmed! Your courses and UNMEB mock exams are now unlocked.</strong>
            </div>
          )}

          {section === "courses" && (
            <>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 18 }}>
                {[
                  ["all", `All courses (${categorized.length})`],
                  ["in-progress", "In progress"],
                  ["completed", "Completed"]
                ].map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setTab(key)}
                    className={`nu-btn ${tab === key ? "nu-btn-dark" : "nu-btn-outline"}`}
                    style={{ padding: "8px 14px", fontSize: "0.86rem" }}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {visibleCourses.length === 0 ? (
                <div className="nu-admin-card" style={{ textAlign: "center", padding: 40 }}>
                  <BookOpen size={36} color="#A137F2" style={{ margin: "0 auto 10px" }} />
                  <h3>
                    {tab === "all"
                      ? "Start your nursing learning journey"
                      : `No courses in "${tab === "in-progress" ? "In progress" : "Completed"}" yet`}
                  </h3>
                  <p style={{ color: "var(--nu-ink-muted)", marginBottom: 18 }}>
                    Open any course to mark lessons complete and track your mastery.
                  </p>
                  <Link to="/courses" className="nu-btn nu-btn-primary">Explore Courses</Link>
                </div>
              ) : (
                <div className="nu-course-grid">
                  {visibleCourses.map((c) => (
                    <Link
                      key={c.slug}
                      to={`/learn/${c.slug}`}
                      className="nu-course-card"
                      style={{ border: "1px solid var(--nu-border-light)", padding: 12, background: "#fff" }}
                    >
                      <div className="nu-card-thumb" style={{ position: "relative" }}>
                        <img src={c.thumbnail} alt={c.title} loading="lazy" />
                        <span
                          style={{
                            position: "absolute",
                            bottom: 8,
                            right: 8,
                            background: "rgba(28, 29, 31, 0.88)",
                            color: "#fff",
                            padding: "4px 8px",
                            fontSize: "0.74rem",
                            fontWeight: 700,
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4
                          }}
                        >
                          <PlayCircle size={13} /> Continue
                        </span>
                      </div>
                      <h3 className="nu-card-title">{c.title}</h3>
                      <div className="nu-card-meta">{c.programmeLabel}</div>
                      <div style={{ marginTop: 6, background: "var(--nu-border-light)", height: 5, borderRadius: 99, overflow: "hidden" }}>
                        <div style={{ width: `${c.pct}%`, height: "100%", background: "var(--nu-purple)" }} />
                      </div>
                      <div style={{ fontSize: "0.76rem", color: "var(--nu-ink-muted)", marginTop: 4 }}>
                        {c.pct}% complete ({c.doneCount}/{c.lessonCount} lessons)
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}

          {section === "badges" && (
            <div style={{ display: "grid", gap: 22 }}>
              <div className="nu-admin-card">
                <h3 style={{ margin: "0 0 6px", display: "flex", alignItems: "center", gap: 8 }}>
                  <Trophy size={20} color="#A137F2" /> Earned Study &amp; Completion Badges
                </h3>
                <p style={{ margin: "0 0 16px", fontSize: "0.88rem", color: "var(--nu-ink-muted)" }}>
                  Unlock milestone badges automatically as you complete course readings, pass 25+ question topic quizzes, and earn unit Certificates of Completion.
                </p>
                {(() => {
                  const completedCoursesCount = categorized.filter((c) => c.pct >= 100).length;
                  const passedTopicQuizzes = quizAttempts.filter((a) => a.quizType === "topic_free" && a.passed).length;
                  const totalQuizAttempts = quizAttempts.length;
                  const badges = [
                    {
                      id: "starter",
                      title: "Registered Scholar",
                      desc: "Joined Nursing Uganda & synced study profile",
                      earned: Boolean(user),
                      color: "#7c3aed"
                    },
                    {
                      id: "lessons-5",
                      title: "Clinical Reader (5+ Lessons)",
                      desc: `Completed ${totalLessonsDone} study sessions`,
                      earned: totalLessonsDone >= 5,
                      color: "#0284c7"
                    },
                    {
                      id: "quiz-1",
                      title: "Quiz Challenger",
                      desc: `Submitted ${totalQuizAttempts} topic/session quiz attempts`,
                      earned: totalQuizAttempts >= 1,
                      color: "#0d9488"
                    },
                    {
                      id: "quiz-pass",
                      title: "Clinical Quiz Passer (>=60%)",
                      desc: `Passed ${passedTopicQuizzes} Free Topic Quizzes`,
                      earned: passedTopicQuizzes >= 1,
                      color: "#15803d"
                    },
                    {
                      id: "course-done",
                      title: "Unit Syllabus Finisher",
                      desc: `Finished 100% lessons in ${completedCoursesCount} unit(s)`,
                      earned: completedCoursesCount >= 1,
                      color: "#d97706"
                    },
                    {
                      id: "certified",
                      title: "Certified Course Completer",
                      desc: `Earned ${certificates.length} Final Evaluation Certificate(s)`,
                      earned: certificates.length >= 1,
                      color: "#A137F2"
                    }
                  ];
                  return (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(215px, 1fr))", gap: 14 }}>
                      {badges.map((b) => (
                        <div
                          key={b.id}
                          style={{
                            border: b.earned ? `2px solid ${b.color}` : "1px dashed #cbd5e1",
                            background: b.earned ? "#fff" : "#f8fafc",
                            opacity: b.earned ? 1 : 0.65,
                            borderRadius: 8,
                            padding: 14,
                            display: "grid",
                            gap: 6
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <Sparkles size={18} color={b.earned ? b.color : "#94a3b8"} />
                            <span
                              style={{
                                fontSize: "0.7rem",
                                fontWeight: 800,
                                textTransform: "uppercase",
                                padding: "2px 7px",
                                borderRadius: 4,
                                background: b.earned ? "#dcfce7" : "#e2e8f0",
                                color: b.earned ? "#166534" : "#475569"
                              }}
                            >
                              {b.earned ? "Earned" : "Locked"}
                            </span>
                          </div>
                          <strong style={{ fontSize: "0.94rem" }}>{b.title}</strong>
                          <small style={{ color: "var(--nu-ink-muted)", fontSize: "0.8rem" }}>{b.desc}</small>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>

              <div className="nu-admin-card">
                <h3 style={{ margin: "0 0 8px", display: "flex", alignItems: "center", gap: 8 }}>
                  <Award size={20} color="#A137F2" /> Earned Certificates of Completion ({certificates.length})
                </h3>
                <p style={{ margin: "0 0 16px", fontSize: "0.86rem", color: "var(--nu-ink-muted)" }}>
                  Certificates are unlocked upon scoring &ge; 60% on any course&apos;s 30-question Final Evaluation (up to 4 attempts). Note: Certificates certify supplementary study completion only and do not constitute clinical licensure.
                </p>
                {certificates.length === 0 ? (
                  <div style={{ padding: 20, background: "#faf5ff", border: "1px solid #e9d5ff", borderRadius: 6 }}>
                    <strong>No certificates earned yet.</strong>
                    <p style={{ margin: "6px 0 12px", fontSize: "0.88rem", color: "var(--nu-ink-muted)" }}>
                      Open any enrolled course player and click &ldquo;Final Evaluation (30 Qs · Certificate)&rdquo; to earn your first Certificate of Study Completion.
                    </p>
                    <Link to="/courses" className="nu-btn nu-btn-primary">Browse Courses</Link>
                  </div>
                ) : (
                  <div style={{ display: "grid", gap: 20 }}>
                    {certificates.map((cert) => (
                      <CertificateCard key={cert.certificateCode} certificate={cert} learnerName={user?.name} />
                    ))}
                  </div>
                )}
              </div>

              <div className="nu-admin-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 12 }}>
                  <h3 style={{ margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
                    <ClipboardCheck size={19} color="#A137F2" /> Quiz &amp; Final Evaluation History ({quizAttempts.length})
                  </h3>
                  <Link to="/quizzes" className="nu-btn nu-btn-secondary" style={{ height: 34, fontSize: "0.82rem" }}>
                    Take Free Topic Quizzes
                  </Link>
                </div>
                {quizAttempts.length === 0 ? (
                  <p style={{ color: "var(--nu-ink-muted)", margin: 0 }}>
                    No quiz attempts recorded yet. Try our Free Major Topic Quizzes to receive automatic score reports by email.
                  </p>
                ) : (
                  <div className="nu-admin-table-wrap">
                    <table className="nu-admin-table">
                      <thead>
                        <tr><th>Assessment</th><th>Type</th><th>Score</th><th>Status</th><th>Attempt</th></tr>
                      </thead>
                      <tbody>
                        {quizAttempts.slice(0, 20).map((qa) => (
                          <tr key={qa.id}>
                            <td><strong>{qa.quizTitle}</strong></td>
                            <td><code>{qa.quizType}</code></td>
                            <td>{qa.score}/{qa.totalQuestions} ({qa.percent}%)</td>
                            <td>
                              <span className={`nu-badge ${qa.passed ? "nu-badge-free" : "nu-badge-highyield"}`}>
                                {qa.passed ? "Passed" : "Review"}
                              </span>
                            </td>
                            <td>#{qa.attemptNumber}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {section === "progress" && (
            <div style={{ display: "grid", gap: 18 }}>
              <div className="nu-admin-kpi-grid">
                <div className="nu-admin-kpi">
                  <small>Active Units</small>
                  <strong>{categorized.length}</strong>
                  <span>Free + Unlocked courses</span>
                </div>
                <div className="nu-admin-kpi">
                  <small>Lessons Completed</small>
                  <strong>{totalLessonsDone}</strong>
                  <span>Synced across devices</span>
                </div>
                <div className="nu-admin-kpi">
                  <small>Completed Courses</small>
                  <strong>{categorized.filter((c) => c.pct >= 100).length}</strong>
                  <span>100% syllabus mastery</span>
                </div>
              </div>

              <div className="nu-admin-card" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <Award size={26} color="#A137F2" />
                  <div>
                    <strong>Ready for UNMEB Practice?</strong>
                    <div style={{ fontSize: "0.86rem", color: "var(--nu-ink-muted)" }}>
                      Test your clinical knowledge with timed UNMEB-style MCQs and instant rationales.
                    </div>
                  </div>
                </div>
                <Link to="/mock-exams" className="nu-btn nu-btn-primary">Launch Mock Exams</Link>
              </div>
            </div>
          )}

          {section === "notes" && (
            <div style={{ display: "grid", gap: 18 }}>
              <div className="nu-admin-card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                <div>
                  <h3 style={{ margin: "0 0 4px" }}>Free Referenced Study eBooks</h3>
                  <small style={{ color: "var(--nu-ink-muted)" }}>Download 8 full curriculum textbooks with WHO &amp; Uganda MoH 2023 citations.</small>
                </div>
                <Link to="/ebooks" className="nu-btn nu-btn-primary">Browse 8 Free eBooks</Link>
              </div>

              <div className="nu-admin-card">
                <h3 style={{ margin: "0 0 12px" }}>My Saved Lesson Notes ({noteEntries.length})</h3>
                {noteEntries.length === 0 ? (
                  <p style={{ color: "var(--nu-ink-muted)", margin: 0 }}>
                    You haven&apos;t saved any lesson notes yet. Use the Notes tab inside any course lesson player to save personal study summaries.
                  </p>
                ) : (
                  <div style={{ display: "grid", gap: 10 }}>
                    {noteEntries.map(([key, text]) => (
                      <div key={key} style={{ padding: 12, background: "var(--nu-bg-subtle)", border: "1px solid var(--nu-border-light)", borderRadius: 4 }}>
                        <strong style={{ fontSize: "0.82rem", color: "var(--nu-purple)" }}>{key}</strong>
                        <p style={{ margin: "4px 0 0", fontSize: "0.9rem" }}>{text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {section === "preferences" && (
            <div className="nu-admin-card">
              <h3 style={{ margin: "0 0 8px" }}>Weekly Nursing Study Digest</h3>
              <p style={{ color: "var(--nu-ink-muted)", fontSize: "0.9rem", marginTop: 0 }}>
                Receive weekly UNMEB exam revision agendas, new referenced eBooks, and clinical guideline updates (sent in staggered daily batches of 50 learners for reliable delivery).
              </p>
              {!user ? (
                <Link to="/login" className="nu-btn nu-btn-primary">Sign in to manage preferences</Link>
              ) : (
                <form onSubmit={handleSavePrefs} style={{ display: "grid", gap: 14, maxWidth: 460 }}>
                  <label style={{ display: "flex", alignItems: "center", gap: 10, fontSize: "0.95rem", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={digestSubscribed}
                      onChange={(e) => setDigestSubscribed(e.target.checked)}
                    />
                    <span>Send me weekly nursing &amp; midwifery study digests ({user.email})</span>
                  </label>
                  <div>
                    <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: 6 }}>
                      Preferred Study Agenda
                    </label>
                    <select
                      value={topicPreference}
                      onChange={(e) => setTopicPreference(e.target.value)}
                      style={{ width: "100%", height: 42, padding: "0 12px", border: "1px solid var(--nu-border)", background: "#fff" }}
                    >
                      <option value="all">All Nursing &amp; Midwifery Updates</option>
                      <option value="certificate-in-nursing">Certificate in Nursing</option>
                      <option value="diploma-nursing-direct">Diploma in Nursing</option>
                      <option value="certificate-in-midwifery">Midwifery Programmes</option>
                      <option value="unmeb-exams">UNMEB Mock Exams &amp; Past Papers</option>
                    </select>
                  </div>
                  {prefSaved && (
                    <div style={{ padding: 10, background: "var(--nu-teal-bg)", color: "var(--nu-teal-ink)", fontSize: "0.86rem", borderRadius: 4 }}>
                      {prefSaved}
                    </div>
                  )}
                  <button type="submit" className="nu-btn nu-btn-primary" style={{ width: "fit-content" }}>
                    Save Preferences
                  </button>
                </form>
              )}
            </div>
          )}

          {section === "security" && (
            <div className="nu-admin-card">
              <h3 style={{ margin: "0 0 12px" }}>Account &amp; Security Activity</h3>
              {!user ? (
                <Link to="/login" className="nu-btn nu-btn-primary">Sign in to view security activity</Link>
              ) : (
                <>
                  <div style={{ display: "grid", gap: 6, marginBottom: 18, fontSize: "0.9rem" }}>
                    <div><strong>Email:</strong> {user.email} ({user.emailVerified ? "Verified" : "Unverified"})</div>
                    <div><strong>Sign-In Method:</strong> {user.authProvider === "google" ? "Google OAuth 2.0" : "Email & Password"}</div>
                  </div>
                  <h4 style={{ margin: "0 0 10px" }}>Recent Security Events</h4>
                  {securityEvents.length === 0 ? (
                    <p style={{ color: "var(--nu-ink-muted)", margin: 0 }}>No recent security events recorded.</p>
                  ) : (
                    <div className="nu-admin-table-wrap">
                      <table className="nu-admin-table">
                        <thead>
                          <tr><th>Event</th><th>IP Address</th><th>Details</th><th>Time</th></tr>
                        </thead>
                        <tbody>
                          {securityEvents.map((ev) => (
                            <tr key={ev.id}>
                              <td><code>{ev.eventType}</code></td>
                              <td><code>{ev.ipAddress}</code></td>
                              <td>{ev.details}</td>
                              <td>{new Date(ev.createdAt).toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
