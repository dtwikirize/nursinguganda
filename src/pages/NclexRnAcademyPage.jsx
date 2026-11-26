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
        "Complete 16-Unit Next-Gen NCLEX-RN (NGN) Preparation Course aligned with Saunders 9th Ed., Kaplan & LaCharity PDA | 48 topics, 20-Q topic quizzes, 60-Q unit evaluations & 4 full NCLEX-RN Examinations.",
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

      {/* Flagship NCLEX-RN Hero with Layered Clinical Study Background */}
      <section
        style={{
          backgroundImage:
            'linear-gradient(95deg, rgba(46, 16, 101, 0.90) 0%, rgba(107, 33, 168, 0.80) 52%, rgba(28, 29, 31, 0.86) 100%), url("/assets/images/nclex-rn-hero-bg.webp")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundColor: "#581c87",
          color: "#ffffff",
          padding: "42px 0 38px",
          borderBottom: "4px solid #1c1d1f"
        }}
      >
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
                16 structured Course Units with comprehensive clinical study notes aligned with <strong>Saunders Comprehensive Review (9th Ed.)</strong>, <strong>Kaplan NCLEX-RN Prep</strong>, and <strong>LaCharity PDA</strong> | complete with <strong>20-question topic quizzes</strong>, <strong>60-question mixed unit evaluations</strong>, and a dedicated <strong>NCLEX-RN Examinations</strong> simulation suite.
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
                    <ShoppingCart size={16} /> {inCart ? "Go to Cart ($99)" : "Enroll Now | $99"}
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

      {/* Value-for-Money Advantage + Visuals + Foreign RN Roadmap + 24-Week Study Matrix */}
      <section className="nu-section">
        <div className="nu-container" style={{ maxWidth: 1180 }}>
          {/* 1. Smart Value & Foreign RN Highlights Banner */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 16, marginBottom: 32 }}>
            {[
              {
                badge: "BEST VALUE FOR MONEY",
                title: "$99 Complete vs $160–$300+ Elsewhere",
                text: "One-time access covers 16 structured units, 1,920+ rationalized questions, 4 timed mock CAT exams, and lifetime reference updates with zero monthly subscription traps.",
                bg: "#1c1d1f",
                accent: "#d8b4fe"
              },
              {
                badge: "24-WEEK UNIFIED ROADMAP",
                title: "Saunders 9th + Kaplan + LaCharity PDA",
                text: "Weekly guided study progression maps Foundations, Systems, Paediatrics, Maternity, Psych & NGN Prioritization directly to official Saunders units and LaCharity cases.",
                bg: "#4c1d95",
                accent: "#f3e8ff"
              },
              {
                badge: "FOREIGN NURSE USA PATHWAY",
                title: "CGFNS -> State Board -> Visa & Jobs",
                text: "Clear orientation on CGFNS CES document checks, TBON / compact State Board ATT, Pearson VUE scheduling, and EB-3 Green Card vs H-1B direct-hire pathways.",
                bg: "#0f172a",
                accent: "#c084fc"
              }
            ].map((card) => (
              <div
                key={card.title}
                style={{
                  background: card.bg,
                  color: "#ffffff",
                  borderRadius: 12,
                  padding: "20px 22px",
                  boxShadow: "0 4px 16px rgba(15, 23, 42, 0.08)"
                }}
              >
                <div style={{ fontSize: "0.7rem", fontWeight: 800, color: card.accent, letterSpacing: "0.06em", marginBottom: 6 }}>
                  {card.badge}
                </div>
                <h2 style={{ margin: "0 0 8px", fontSize: "1.06rem", color: "#ffffff", lineHeight: 1.35 }}>
                  {card.title}
                </h2>
                <p style={{ margin: 0, fontSize: "0.86rem", color: "rgba(255,255,255,0.88)", lineHeight: 1.55 }}>
                  {card.text}
                </p>
              </div>
            ))}
          </div>

          {/* 2. Reconstructed Visual Study Guides (3 Plates) */}
          <div style={{ marginBottom: 34 }}>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: 12, marginBottom: 14 }}>
              <div>
                <h2 style={{ margin: "0 0 4px", fontSize: "1.38rem", color: "#0f172a" }}>
                  Visual NCLEX-RN Roadmap &amp; Exam Blueprints
                </h2>
                <p style={{ margin: 0, color: "#475569", fontSize: "0.9rem" }}>
                  Step-by-step visual guides covering Foreign RN licensure &amp; visas, NGN Clinical Judgment item styles, and the 24-week ROI plan.
                </p>
              </div>
              <Link to="/nursing-usa" style={{ fontSize: "0.85rem", fontWeight: 700, color: "#7c3aed", textDecoration: "none" }}>
                Open Full USA NCLEX &amp; Lab Converter Hub →
              </Link>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(310px, 1fr))", gap: 16 }}>
              {[
                {
                  src: "/assets/images/medical-illustrations/nclex-foreign-rn-licensure-roadmap.webp",
                  alt: "International nurse 4-step US licensure workflow from CGFNS and Pearson VUE to EB-3 vs H-1B visa",
                  cap: "1. Foreign-Trained Nurse Licensure Flow & EB-3 vs H-1B Visas"
                },
                {
                  src: "/assets/images/medical-illustrations/nclex-ngn-cat-question-formats.webp",
                  alt: "Next-Gen NCLEX 6-Step Clinical Judgment loop and high-yield SATA, Bowtie, Matrix, Case and Trend item formats",
                  cap: "2. NGN 6-Step CJMM Loop & 6 CAT Item Formats"
                },
                {
                  src: "/assets/images/medical-illustrations/nclex-24week-curriculum-value-map.webp",
                  alt: "24-week Saunders, Kaplan and LaCharity accelerated study roadmap with $99 complete access ROI breakdown",
                  cap: "3. 24-Week Intensive Schedule & $99 All-Inclusive Value"
                }
              ].map((fig) => (
                <figure key={fig.src} style={{ margin: 0, background: "#ffffff", border: "1px solid #cbd5e1", borderRadius: 12, overflow: "hidden", boxShadow: "0 2px 10px rgba(15,23,42,0.04)" }}>
                  <img
                    src={fig.src}
                    alt={fig.alt}
                    loading="lazy"
                    style={{ width: "100%", height: "auto", display: "block", background: "#f8fafc" }}
                  />
                  <figcaption style={{ padding: "10px 14px", fontSize: "0.82rem", fontWeight: 700, color: "#0f172a", borderTop: "1px solid #e2e8f0" }}>
                    {fig.cap}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>

          {/* 3. Summarized 24-Week Syllabus Table + Foreign RN Fee & Visa Guide */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 20, marginBottom: 38 }}>
            <div style={{ background: "#ffffff", border: "1px solid #cbd5e1", borderTop: "4px solid #7c3aed", borderRadius: 12, padding: 20 }}>
              <h3 style={{ margin: "0 0 6px", fontSize: "1.12rem", color: "#0f172a" }}>
                24-Week Master Study Tracker (Saunders + Kaplan + LaCharity)
              </h3>
              <p style={{ margin: "0 0 12px", fontSize: "0.83rem", color: "#475569" }}>
                Condenses the full 24-week US NCLEX syllabus into six focused clinical blocks paired with interactive evaluations below.
              </p>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.81rem" }}>
                  <thead>
                    <tr style={{ background: "#f5f3ff", textAlign: "left" }}>
                      <th style={{ padding: "8px 10px", borderBottom: "1px solid #cbd5e1" }}>Weeks</th>
                      <th style={{ padding: "8px 10px", borderBottom: "1px solid #cbd5e1" }}>Core Clinical Domain</th>
                      <th style={{ padding: "8px 10px", borderBottom: "1px solid #cbd5e1" }}>Mapped Texts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Wks 1–3", "NGN Strategies, US Ethics, Delegation, Fluids & ABGs", "Saunders I–III · Kaplan 1–3 · LaCharity Ch.4"],
                      ["Wks 4–9", "Cardiac/EKG, Respiratory, Endocrine, Onco/Haem, Immune & GI", "Saunders VIII–XII · Case Studies 2, 5, 11, 12, 15"],
                      ["Wks 10–14", "Neuro/SCI, Renal/Dialysis, Eye/Ear, Skin & Musculoskeletal", "Saunders VII, XIII–XVI · LaCharity Ch.7, 9, 10, 11, 15, 17"],
                      ["Wks 15–18", "Maternity, Paediatrics, Psychiatric Nursing, Lifespan & ICU", "Saunders IV–VI, XVIII–XIX · LaCharity Ch.18, 19, 22"],
                      ["Wks 19–22", "Client Needs: Safe Care, Health Promo, Pharm/IV, Risk Reduction", "Kaplan Ch.4–10 · HIPAA · CDC Schedule · Septic Shock"],
                      ["Wks 23–24", "Daily Timed CAT Mock Simulations & Weak-Area Remediation", "4 Full CAT Mock Exams · Detailed Rationales"]
                    ].map(([wk, dom, ref]) => (
                      <tr key={wk}>
                        <td style={{ padding: "8px 10px", borderBottom: "1px solid #e2e8f0", fontWeight: 800, color: "#7c3aed", whiteSpace: "nowrap" }}>{wk}</td>
                        <td style={{ padding: "8px 10px", borderBottom: "1px solid #e2e8f0", fontWeight: 600, color: "#0f172a" }}>{dom}</td>
                        <td style={{ padding: "8px 10px", borderBottom: "1px solid #e2e8f0", color: "#475569" }}>{ref}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div style={{ background: "#ffffff", border: "1px solid #cbd5e1", borderTop: "4px solid #0f172a", borderRadius: 12, padding: 20 }}>
              <h3 style={{ margin: "0 0 6px", fontSize: "1.12rem", color: "#0f172a" }}>
                Foreign-Trained RN Process, Regulatory Fees &amp; US Visas
              </h3>
              <p style={{ margin: "0 0 12px", fontSize: "0.83rem", color: "#475569" }}>
                Transparent breakdown of statutory licensing fees paid directly to US bodies plus post-pass employment &amp; visa routes.
              </p>
              <div style={{ overflowX: "auto", marginBottom: 14 }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.81rem" }}>
                  <thead>
                    <tr style={{ background: "#f1f5f9", textAlign: "left" }}>
                      <th style={{ padding: "8px 10px", borderBottom: "1px solid #cbd5e1" }}>Stage &amp; Authority</th>
                      <th style={{ padding: "8px 10px", borderBottom: "1px solid #cbd5e1" }}>Typical Fee</th>
                      <th style={{ padding: "8px 10px", borderBottom: "1px solid #cbd5e1" }}>Action Needed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["1. CGFNS CES Evaluation", "~$485", "O/A-Level email + school & Council direct verifications"],
                      ["2. State Board (e.g. TBON)", "~$75 + $40 prints", "Board application + IdentoGO fingerprints"],
                      ["3. Pearson VUE (ATT & Exam)", "~$200 + $150 intl", "Obtain ATT & schedule at global Pearson center"],
                      ["4. Nursing Uganda Academy", "$99 One-Time", "16 Units, 1,920+ Qs, 4 Mocks (vs $160–$300 elsewhere)"]
                    ].map(([st, fee, act]) => (
                      <tr key={st}>
                        <td style={{ padding: "8px 10px", borderBottom: "1px solid #e2e8f0", fontWeight: 700, color: "#0f172a" }}>{st}</td>
                        <td style={{ padding: "8px 10px", borderBottom: "1px solid #e2e8f0", fontWeight: 800, color: "#7c3aed", whiteSpace: "nowrap" }}>{fee}</td>
                        <td style={{ padding: "8px 10px", borderBottom: "1px solid #e2e8f0", color: "#475569" }}>{act}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, padding: "10px 14px", fontSize: "0.81rem", color: "#0f172a", lineHeight: 1.5 }}>
                <strong>After Passing (Visas &amp; Placement):</strong> Compare direct hospital sponsorship vs staffing agency contracts.{" "}
                <strong>EB-3 Immigrant Visa</strong> grants permanent Green Card residency with spouse work authorization and children's schooling;{" "}
                <strong>H-1B Visa</strong> requires a bachelor's degree (BScN) tied to one contract employer.
              </div>
            </div>
          </div>

          {/* 4. 16 Course Units Curriculum */}
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
