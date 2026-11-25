import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ClipboardCheck,
  Lock,
  ShoppingCart,
  ShieldCheck,
  Unlock
} from "lucide-react";
import { useApp } from "../context/AppContext";
import CountryFlag from "../components/CountryFlag";
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

export default function NclexRnAcademyPage() {
  const { addToCart, cart, isEnrolled, user } = useApp();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [examsData, setExamsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openUnit, setOpenUnit] = useState(1);

  const enrolled = isEnrolled(NCLEX_COURSE_ITEM.slug) || Boolean(user?.isAdmin);
  const inCart = cart.some((c) => c.slug === NCLEX_COURSE_ITEM.slug);

  useEffect(() => {
    setPageSeo({
      title: "NCLEX-RN Preparation Course ($99 · 16-Week Academy) | Nursing Uganda",
      description:
        "Complete 16-Week Next-Gen NCLEX-RN (NGN) Preparation Course triangulated across Saunders 9th Ed., Kaplan & LaCharity PDA — 48 topics, 20-Q topic quizzes, 60-Q unit evaluations & 4 full NCLEX-RN Examinations.",
      canonicalPath: "/nclex-rn",
      type: "article"
    });
    Promise.all([
      fetch("/assets/data/nclex-rn-course.json").then((r) => (r.ok ? r.json() : null)).catch(() => null),
      fetch("/assets/data/nclex-rn-exams.json").then((r) => (r.ok ? r.json() : null)).catch(() => null)
    ])
      .then(([c, e]) => {
        setCourse(c);
        setExamsData(e);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleEnrollOrCart = () => {
    if (enrolled) {
      navigate("/nclex-rn/learn");
      return;
    }
    if (!inCart) {
      addToCart(NCLEX_COURSE_ITEM);
    }
    navigate("/cart");
  };

  if (loading) {
    return (
      <main className="nu-section">
        <div className="nu-container">
          <NursingLoader label="Loading 16-Week NCLEX-RN Preparation Academy..." />
        </div>
      </main>
    );
  }

  const units = course?.units || [];
  const exams = examsData?.exams || [];

  return (
    <main style={{ background: "#f8fafc", minHeight: "85vh" }}>
      <NclexNavStrip />

      {/* Red + Black Flagship NCLEX-RN Hero */}
      <section style={{ background: "#a435f0", color: "#ffffff", padding: "38px 0 34px", borderBottom: "4px solid #1c1d1f" }}>
        <div className="nu-container" style={{ maxWidth: 1180 }}>
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.55fr) minmax(290px, 0.85fr)", gap: 28, alignItems: "center" }} className="nu-notes-two-col">
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "4px 12px", borderRadius: 999, background: "#1c1d1f", color: "#ffffff", fontSize: "0.74rem", fontWeight: 800, letterSpacing: "0.05em", marginBottom: 14 }}>
                <CountryFlag code="US" width={15} />
                <span>NEXT-GEN NCLEX-RN (NGN) · 16-UNIT COMPLETE ACADEMY</span>
              </div>
              <h1 style={{ margin: "0 0 12px", fontSize: "clamp(1.65rem, 3vw, 2.35rem)", color: "#ffffff", lineHeight: 1.2 }}>
                NCLEX-RN Preparation Course
              </h1>
              <p style={{ margin: "0 0 22px", color: "rgba(255,255,255,0.9)", fontSize: "1.02rem", lineHeight: 1.6, maxWidth: 720 }}>
                16 structured weekly Course Units rewritten into fresh, comprehensive clinical notes triangulated with <strong>Saunders Comprehensive Review (9th Ed.)</strong>, <strong>Kaplan NCLEX-RN Prep</strong>, and <strong>LaCharity PDA</strong> — complete with <strong>20-question topic quizzes</strong>, <strong>60-question mixed unit evaluations</strong>, and a dedicated <strong>NCLEX-RN Examinations</strong> simulation suite.
              </p>

              {/* Unified White Coursera Stats Strip */}
              <div
                style={{
                  background: "#ffffff",
                  color: "#0f172a",
                  borderRadius: 10,
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(145px, 1fr))",
                  overflow: "hidden",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.14)"
                }}
              >
                {[
                  { label: "Course Units", value: `${units.length} Course Units` },
                  { label: "Study Topics", value: `${course?.totalTopics || 48} Detailed Topics` },
                  { label: "Topic Quizzes", value: `${course?.totalTopicQuestions || 960} Qs (20/Topic)` },
                  { label: "Unit Evaluations", value: `${course?.totalEvaluationQuestions || 960} Qs (60/Unit)` }
                ].map((stat, idx, arr) => (
                  <div
                    key={stat.label}
                    style={{
                      padding: "13px 16px",
                      borderRight: idx < arr.length - 1 ? "1px solid #e2e8f0" : "none"
                    }}
                  >
                    <div style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#64748b" }}>
                      {stat.label}
                    </div>
                    <div style={{ marginTop: 3, fontSize: "0.88rem", fontWeight: 700, color: "#0f172a" }}>
                      {stat.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* $99 Enrollment Box */}
            <div style={{ background: "#1c1d1f", color: "#ffffff", borderRadius: 12, padding: 24, border: "1px solid rgba(255,255,255,0.18)" }}>
              <div style={{ fontSize: "0.74rem", fontWeight: 700, color: "#d8b4fe", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Full 16-Unit Access + NCLEX Exams
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 10, margin: "8px 0 14px" }}>
                <strong style={{ fontSize: "2.3rem", color: "#ffffff" }}>$99</strong>
                <span style={{ textDecoration: "line-through", color: "#94a3b8", fontSize: "1rem" }}>$249</span>
                <span style={{ fontSize: "0.76rem", background: "#a435f0", color: "#fff", padding: "3px 8px", borderRadius: 999, fontWeight: 700 }}>
                  60% OFF
                </span>
              </div>

              <ul style={{ margin: "0 0 18px", padding: 0, listStyle: "none", display: "grid", gap: 8, fontSize: "0.85rem", color: "#e2e8f0" }}>
                <li style={{ display: "flex", gap: 8, alignItems: "center" }}><CheckCircle2 size={15} color="#d8b4fe" /> 16 Course Units (48 Topics)</li>
                <li style={{ display: "flex", gap: 8, alignItems: "center" }}><CheckCircle2 size={15} color="#d8b4fe" /> 20-Q Quiz per Topic + Rationales</li>
                <li style={{ display: "flex", gap: 8, alignItems: "center" }}><CheckCircle2 size={15} color="#d8b4fe" /> 60-Q Mixed Final Evaluation per Unit</li>
                <li style={{ display: "flex", gap: 8, alignItems: "center" }}><CheckCircle2 size={15} color="#d8b4fe" /> Includes NCLEX-RN Examinations Course</li>
              </ul>

              <button
                type="button"
                onClick={handleEnrollOrCart}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: 8,
                  border: 0,
                  background: "#ffffff",
                  color: "#1c1d1f",
                  fontWeight: 800,
                  fontSize: "0.94rem",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  marginBottom: 10
                }}
              >
                {enrolled ? (
                  <>
                    <Unlock size={16} /> Open 16-Week Course Player
                  </>
                ) : (
                  <>
                    <ShoppingCart size={16} /> {inCart ? "Go to Cart ($99)" : "Enroll Now — $99"}
                  </>
                )}
              </button>

              <Link
                to="/nclex-rn/unit/unit-1-ngn-clinical-judgment-strategies"
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: 8,
                  border: "1px solid rgba(255,255,255,0.28)",
                  background: "transparent",
                  color: "#ffffff",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6
                }}
              >
                <BookOpen size={15} /> Preview Course Unit 1 Free
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 16-Week Syllabus & Separate NCLEX Examinations Course */}
      <section className="nu-section">
        <div className="nu-container" style={{ maxWidth: 1180 }}>
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ margin: "0 0 6px", fontSize: "1.45rem", color: "#0f172a" }}>
              16 Course Units Curriculum
            </h2>
            <p style={{ margin: 0, color: "#475569", fontSize: "0.92rem" }}>
              Every unit includes detailed clinical study topics, Saunders &amp; Kaplan references per lesson, a 20-question quiz per topic, and a 60-question mixed final evaluation.
            </p>
          </div>

          <div style={{ display: "grid", gap: 10, marginBottom: 38 }}>
            {units.map((u) => {
              const isOpen = openUnit === u.unitNumber;
              const isFreePreview = u.unitNumber === 1 || enrolled;
              return (
                <div key={u.slug} style={{ background: "#ffffff", border: "1px solid #cbd5e1", borderRadius: 10, overflow: "hidden" }}>
                  <button
                    type="button"
                    onClick={() => setOpenUnit(isOpen ? 0 : u.unitNumber)}
                    style={{
                      width: "100%",
                      padding: "16px 20px",
                      background: isOpen ? "#f8fafc" : "#ffffff",
                      border: 0,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 12,
                      textAlign: "left",
                      cursor: "pointer"
                    }}
                  >
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.74rem", fontWeight: 700, color: "#a435f0", textTransform: "uppercase" }}>
                        <span>{u.weekLabel}</span>
                        <span>·</span>
                        <span>{u.topics.length} Topics · 60-Q Mixed Evaluation</span>
                        {u.unitNumber === 1 && (
                          <span style={{ background: "#1c1d1f", color: "#fff", padding: "2px 8px", borderRadius: 999, fontSize: "0.68rem" }}>
                            FREE PREVIEW
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: "1.02rem", fontWeight: 700, color: "#0f172a", marginTop: 3 }}>
                        {u.title}
                      </div>
                    </div>
                    {isOpen ? <ChevronUp size={18} color="#334155" /> : <ChevronDown size={18} color="#334155" />}
                  </button>

                  {isOpen && (
                    <div style={{ padding: "16px 20px 20px", borderTop: "1px solid #e2e8f0" }}>
                      <div style={{ display: "grid", gap: 8, marginBottom: 14 }}>
                        {u.topics.map((t, tIdx) => (
                          <div
                            key={t.slug}
                            style={{
                              display: "flex",
                              flexWrap: "wrap",
                              justifyContent: "space-between",
                              alignItems: "center",
                              gap: 10,
                              padding: "10px 14px",
                              borderRadius: 8,
                              background: "#f8fafc",
                              border: "1px solid #e2e8f0"
                            }}
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              {isFreePreview ? <BookOpen size={15} color="#a435f0" /> : <Lock size={15} color="#64748b" />}
                              <span style={{ fontWeight: 600, fontSize: "0.9rem", color: "#0f172a" }}>
                                {u.unitNumber}.{tIdx + 1} {t.title}
                              </span>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              <span style={{ fontSize: "0.76rem", color: "#475569", fontWeight: 600 }}>
                                {t.quiz?.length || 20} Qs
                              </span>
                              <Link
                                to={`/nclex-rn/unit/${u.slug}?topic=${t.slug}`}
                                style={{ fontSize: "0.8rem", fontWeight: 700, color: "#a435f0", textDecoration: "none" }}
                              >
                                {isFreePreview ? "Open Lesson →" : "Preview →"}
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 12, paddingTop: 12, borderTop: "1px solid #f1f5f9" }}>
                        <div style={{ fontSize: "0.78rem", color: "#475569" }}>
                          <strong>References:</strong> Saunders 9th Ed. · Kaplan NCLEX-RN · LaCharity PDA · NCSBN
                        </div>
                        <Link
                          to={`/nclex-rn/unit/${u.slug}?mode=eval`}
                          className="nu-btn nu-btn-primary"
                          style={{ padding: "8px 14px", fontSize: "0.82rem", background: "#1c1d1f", borderColor: "#1c1d1f" }}
                        >
                          <ClipboardCheck size={14} /> Take {u.weekLabel} 60-Q Final Evaluation
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Separate Course: NCLEX-RN Examinations */}
          <div style={{ background: "#1c1d1f", color: "#ffffff", borderRadius: 12, padding: 28, borderTop: "4px solid #a435f0" }}>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 16, marginBottom: 18 }}>
              <div>
                <div style={{ fontSize: "0.74rem", fontWeight: 800, color: "#d8b4fe", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  INCLUDED COMPANION COURSE
                </div>
                <h2 style={{ margin: "4px 0 6px", fontSize: "1.45rem", color: "#ffffff" }}>
                  {examsData?.title || "NCLEX-RN Examinations (CAT & Next-Gen NGN Mock Suite)"}
                </h2>
                <p style={{ margin: 0, color: "#cbd5e1", fontSize: "0.9rem", maxWidth: 740 }}>
                  {examsData?.subtitle}
                </p>
              </div>
              <Link to="/nclex-rn/exams" className="nu-btn nu-btn-primary" style={{ background: "#a435f0", borderColor: "#a435f0" }}>
                Open NCLEX-RN Examinations <ArrowRight size={15} />
              </Link>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 12 }}>
              {exams.map((ex) => (
                <Link
                  key={ex.id}
                  to={`/nclex-rn/exams?exam=${ex.id}`}
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.16)",
                    borderRadius: 10,
                    padding: 16,
                    textDecoration: "none",
                    color: "#ffffff"
                  }}
                >
                  <div style={{ fontSize: "0.74rem", color: "#d8b4fe", fontWeight: 700, marginBottom: 4 }}>
                    {ex.questions.length} Questions · {ex.durationMinutes} mins
                  </div>
                  <div style={{ fontWeight: 700, fontSize: "0.94rem", lineHeight: 1.35, marginBottom: 6 }}>
                    {ex.title}
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "#cbd5e1" }}>
                    Pass bar: {ex.passScore}% · Instant Rationales
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
