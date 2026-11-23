import React, { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Award, BookOpen, CheckCircle2, PlayCircle } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function MyLearningPage() {
  const { catalog, user, enrollments, progress } = useApp();
  const [searchParams] = useSearchParams();
  const [tab, setTab] = useState("all");
  const purchased = searchParams.get("purchased") === "1";

  const courses = catalog?.courses || [];
  const enrolledCourses = useMemo(
    () => courses.filter((c) => enrollments.includes(c.slug) || c.isFree),
    [courses, enrollments]
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

  return (
    <main>
      {/* Udemy Dark My Learning Header + Integrated Tabs */}
      <section className="nu-cl-hero" style={{ paddingBottom: 0 }}>
        <div className="nu-container">
          <h1 style={{ fontFamily: "var(--nu-font-serif)", fontSize: "2.1rem", marginBottom: 8 }}>
            My learning
          </h1>
          <p className="nu-cl-subtitle" style={{ marginBottom: 22 }}>
            {user
              ? `Welcome back, ${user.name}. Track your nursing units, mock exams, and completion progress.`
              : "Access your enrolled courses and free foundational units."}
          </p>

          <div style={{ display: "flex", gap: 24, overflowX: "auto" }}>
            {[
              ["all", `All courses (${categorized.length})`],
              ["in-progress", "In progress"],
              ["completed", "Completed"]
            ].map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setTab(key)}
                style={{
                  background: "transparent",
                  border: 0,
                  borderBottom: tab === key ? "4px solid #ffffff" : "4px solid transparent",
                  color: tab === key ? "#ffffff" : "#cbd5e1",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  padding: "10px 2px 14px",
                  whiteSpace: "nowrap"
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="nu-section">
        <div className="nu-container">
          {purchased && (
            <div
              style={{
                padding: 16,
                background: "var(--nu-success-bg)",
                border: "1px solid #86efac",
                color: "var(--nu-success)",
                marginBottom: 24,
                display: "flex",
                alignItems: "center",
                gap: 10
              }}
            >
              <CheckCircle2 size={20} />
              <strong>Payment confirmed! Your courses and UNMEB mock exams are now unlocked.</strong>
            </div>
          )}

          {/* Quick Study Shortcuts */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
              padding: "16px 20px",
              background: "var(--nu-bg-subtle)",
              border: "1px solid var(--nu-border)",
              marginBottom: 28
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Award size={22} color="#a435f0" />
              <div>
                <strong style={{ display: "block", fontSize: "0.95rem" }}>Daily UNMEB Revision Streak</strong>
                <small style={{ color: "var(--nu-ink-muted)" }}>
                  Continue a unit or practice with Free Referenced eBooks &amp; timed mock papers.
                </small>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Link to="/ebooks" className="nu-btn nu-btn-outline">Free eBooks</Link>
              <Link to="/mock-exams" className="nu-btn nu-btn-primary">Mock Exams</Link>
            </div>
          </div>

          {visibleCourses.length === 0 ? (
            <div style={{ border: "1px solid var(--nu-border)", padding: 48, textAlign: "center" }}>
              <BookOpen size={36} color="#a435f0" style={{ margin: "0 auto 10px" }} />
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
                  style={{ border: "1px solid var(--nu-border-light)", padding: 12 }}
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
                      <PlayCircle size={13} /> Resume
                    </span>
                  </div>
                  <h3 className="nu-card-title">{c.title}</h3>
                  <div className="nu-card-meta">{c.programmeLabel}</div>
                  <div style={{ height: 6, background: "var(--nu-border-light)", marginTop: 10, overflow: "hidden" }}>
                    <div style={{ width: `${c.pct}%`, height: "100%", background: "var(--nu-purple)" }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: "0.78rem", color: "var(--nu-ink-muted)" }}>
                    <span>{c.pct}% complete</span>
                    <span>{c.doneCount}/{c.lessonCount} lessons</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
