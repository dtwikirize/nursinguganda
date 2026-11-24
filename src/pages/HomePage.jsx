import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Award,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  GraduationCap,
  Layers,
  ShieldCheck,
  Stethoscope
} from "lucide-react";
import CourseCard from "../components/CourseCard";
import EbookCover from "../components/EbookCover";
import NursingLoader from "../components/NursingLoader";
import { formatUsd, useApp } from "../context/AppContext";
import { getAllAccessCartItem } from "../utils/offers";

const CATEGORY_CARDS = [
  { name: "Anatomy & Physiology", img: "/assets/images/udemy/cover-anatomy-cardio.webp" },
  { name: "Midwifery & Maternal Health", img: "/assets/images/udemy/cover-obstetric-pelvis.webp" },
  { name: "Pharmacology", img: "/assets/images/udemy/cover-pharmacology-vials.webp" },
  { name: "Medical-Surgical Nursing", img: "/assets/images/udemy/cover-surgical-tray.webp" },
  { name: "Paediatrics & Child Health", img: "/assets/images/udemy/cover-paediatrics-neonatal.webp" },
  { name: "Foundations of Nursing", img: "/assets/images/udemy/cover-foundations-vitals.webp" },
  { name: "Community & Public Health", img: "/assets/images/udemy/cover-public-health-vaccines.webp" },
  { name: "Leadership, Research & Ethics", img: "/assets/images/udemy/cover-research-epidemiology.webp" }
];

export default function HomePage() {
  const { catalog, catalogLoading, addToCart, enrollments } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("certificate-in-nursing");
  const [ebooks, setEbooks] = useState([]);

  useEffect(() => {
    fetch("/assets/data/ebooks.json")
      .then((r) => (r.ok ? r.json() : { ebooks: [] }))
      .then((d) => setEbooks((d.ebooks || []).slice(0, 4)))
      .catch(() => {});
  }, []);

  const programmes = catalog?.programmes || [];
  const courses = catalog?.courses || [];
  const allAccessItem = getAllAccessCartItem(courses);
  const hasAllAccess = enrollments.includes("all-access-pass");

  const activeProg = useMemo(
    () => programmes.find((p) => p.id === activeTab) || programmes[0],
    [programmes, activeTab]
  );

  const tabCourses = useMemo(
    () => courses.filter((c) => c.programmeId === (activeProg?.id || activeTab)).slice(0, 8),
    [courses, activeProg, activeTab]
  );

  const topCourses = useMemo(
    () =>
      [...courses]
        .sort((a, b) => Number(b.studentCount || 0) - Number(a.studentCount || 0))
        .slice(0, 4),
    [courses]
  );

  return (
    <main>
      {/* Udemy-Style Hero Banner with Floating Card */}
      <section className="nu-hero">
        <img
          src="/assets/images/udemy/hero-banner.webp"
          alt="Ugandan nursing student studying online"
          width="1280"
          height="382"
          fetchPriority="high"
          decoding="sync"
          className="nu-hero-bg"
        />
        <div className="nu-hero-card">
          <h1>Clinical mastery that gets you UNMEB-ready</h1>
          <p>
            Structured Certificate, Diploma &amp; BScN nursing courses, free referenced study eBooks, and timed mock exams aligned with Uganda Ministry of Health &amp; WHO guidelines.
          </p>
          <div className="nu-hero-actions">
            <Link to="/courses" className="nu-btn nu-btn-primary nu-btn-lg">
              Explore 83 Courses
            </Link>
            <Link to="/ebooks" className="nu-btn nu-btn-outline nu-btn-lg">
              Free Study eBooks
            </Link>
          </div>
        </div>
      </section>

      {/* Trust & Curriculum Strip */}
      <section className="nu-trust-strip">
        <div className="nu-container">
          <p className="nu-trust-title">
            Aligned with official clinical &amp; academic standards trusted across Uganda
          </p>
          <div className="nu-trust-pills">
            <span className="nu-trust-pill"><ShieldCheck size={17} color="#a435f0" /> Uganda Clinical Guidelines 2023</span>
            <span className="nu-trust-pill"><GraduationCap size={17} color="#a435f0" /> UNMEB &amp; UNMC Syllabi</span>
            <span className="nu-trust-pill"><BookOpen size={17} color="#a435f0" /> WHO Maternal, Newborn &amp; Child Care</span>
            <span className="nu-trust-pill"><Stethoscope size={17} color="#a435f0" /> Open RN &amp; OpenStax Citations</span>
          </div>
        </div>
      </section>

      {/* Tabbed Programme Course Showcase */}
      <section className="nu-section">
        <div className="nu-container">
          <div className="nu-section-head">
            <h2>All the nursing &amp; midwifery units you need in one place</h2>
            <p>
              Individual paid courses are now <strong>50% OFF</strong> (from $2.49), or unlock every unit &amp; past paper together.
            </p>
          </div>

          {!hasAllAccess && (
            <div className="nu-allaccess-banner">
              <div className="nu-allaccess-copy">
                <span className="nu-allaccess-eyebrow">
                  <Layers size={13} /> FULL PLATFORM ALL-ACCESS · 50% OFF UNITS LIVE
                </span>
                <h3>Unlock All {catalog?.courses?.length || 83} Courses + 109 UNMEB Past Papers</h3>
                <p>
                  One pass unlocks every Certificate, Diploma &amp; BScN unit, all clinical quizzes &amp; verified certificates for{" "}
                  <strong>{formatUsd(allAccessItem.priceUsd)}</strong>{" "}
                  <s>${allAccessItem.compareAtUsd.toFixed(2)}</s>
                </p>
              </div>
              <div className="nu-allaccess-cta">
                <button
                  type="button"
                  className="nu-btn nu-btn-primary nu-btn-lg"
                  onClick={() => {
                    addToCart(allAccessItem);
                    navigate("/checkout");
                  }}
                >
                  Unlock Everything · {formatUsd(allAccessItem.priceUsd)}
                </button>
              </div>
            </div>
          )}

          <div className="nu-tabs" role="tablist">
            {programmes.map((p) => (
              <button
                key={p.id}
                type="button"
                role="tab"
                aria-selected={activeTab === p.id}
                className={`nu-tab ${activeTab === p.id ? "active" : ""}`}
                onClick={() => setActiveTab(p.id)}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="nu-tab-box">
            <div className="nu-tab-intro">
              <div>
                <h3>{activeProg?.label || "Nursing Programme"}</h3>
                <p>
                  {activeProg
                    ? `${activeProg.courseCount} structured course units covering ${activeProg.totalLessons} clinical topics, complete with textbook references and self-check quizzes.`
                    : "Explore structured nursing and midwifery units."}
                </p>
              </div>
              <Link
                to={`/courses?programme=${encodeURIComponent(activeProg?.id || activeTab)}`}
                className="nu-btn nu-btn-outline"
              >
                Explore {activeProg?.label || "Programme"}
              </Link>
            </div>

            {catalogLoading ? (
              <NursingLoader compact label="Loading nursing & midwifery courses..." />
            ) : (
              <div className="nu-course-grid">
                {tabCourses.map((course) => (
                  <CourseCard key={course.slug} course={course} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Free Referenced eBooks Strip */}
      {ebooks.length > 0 && (
        <section className="nu-section" style={{ background: "var(--nu-bg-subtle)" }}>
          <div className="nu-container">
            <div className="nu-tab-intro" style={{ marginBottom: 20 }}>
              <div className="nu-section-head" style={{ marginBottom: 0 }}>
                <h2>Free Referenced Study eBooks</h2>
                <p>
                  Downloadable &amp; printable topic guides complete with WHO, MoH Uganda, and textbook bibliographies.
                </p>
              </div>
              <Link to="/ebooks" className="nu-btn nu-btn-purple-outline">
                View All Free eBooks
              </Link>
            </div>

            <div className="nu-ebook-grid">
              {ebooks.map((eb) => (
                <Link key={eb.slug} to={`/ebooks/${eb.slug}`} className="nu-ebook-card">
                  <EbookCover ebook={eb} compact />
                  <div className="nu-ebook-body" style={{ padding: "12px 14px" }}>
                    <h3 className="nu-card-title" style={{ margin: 0 }}>{eb.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Learners Are Viewing */}
      <section className="nu-section">
        <div className="nu-container">
          <div className="nu-section-head">
            <h2>Learners are viewing</h2>
            <p>Most enrolled clinical &amp; exam preparation units this semester.</p>
          </div>
          <div className="nu-course-grid">
            {topCourses.map((course) => (
              <CourseCard key={course.slug} course={course} />
            ))}
          </div>
        </div>
      </section>

      {/* Top Categories Grid */}
      <section className="nu-section" style={{ background: "var(--nu-bg-subtle)" }}>
        <div className="nu-container">
          <div className="nu-section-head">
            <h2>Top clinical specialties</h2>
          </div>
          <div className="nu-course-grid">
            {CATEGORY_CARDS.map((cat) => (
              <Link
                key={cat.name}
                to={`/courses?category=${encodeURIComponent(cat.name)}`}
                style={{
                  background: "#fff",
                  border: "1px solid var(--nu-border)",
                  overflow: "hidden"
                }}
              >
                <div style={{ aspectRatio: "16/9", overflow: "hidden" }}>
                  <img src={cat.img} alt={cat.name} width="560" height="315" style={{ width: "100%", height: "100%", objectFit: "cover" }} loading="lazy" decoding="async" />
                </div>
                <div style={{ padding: "12px 14px", fontWeight: 700, fontSize: "0.95rem" }}>
                  {cat.name}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Study Tools & Mock Exams CTA */}
      <section className="nu-section">
        <div className="nu-container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 20
            }}
          >
            <div style={{ border: "1px solid var(--nu-border)", padding: 24, background: "#fff" }}>
              <ClipboardCheck size={28} color="#a435f0" />
              <h3 style={{ margin: "12px 0 6px" }}>UNMEB Timed Mock Exams</h3>
              <p style={{ margin: "0 0 16px", color: "var(--nu-ink-muted)", fontSize: "0.9rem" }}>
                Simulate real licensing exam pressure with 30 to 80 question papers and verified rationales.
              </p>
              <Link to="/mock-exams" className="nu-btn nu-btn-outline">Open Mock Exams</Link>
            </div>

            <div style={{ border: "1px solid var(--nu-border)", padding: 24, background: "#fff" }}>
              <FileText size={28} color="#a435f0" />
              <h3 style={{ margin: "12px 0 6px" }}>Medical Dictionary &amp; Instruments</h3>
              <p style={{ margin: "0 0 16px", color: "var(--nu-ink-muted)", fontSize: "0.9rem" }}>
                Free clinical terminology, nursing abbreviations, and sterile procedure instrument atlas.
              </p>
              <Link to="/dictionary" className="nu-btn nu-btn-outline">Browse Dictionary</Link>
            </div>

            <div style={{ border: "1px solid var(--nu-border)", padding: 24, background: "#fff" }}>
              <Award size={28} color="#a435f0" />
              <h3 style={{ margin: "12px 0 6px" }}>Dosage Calculators &amp; Checklists</h3>
              <p style={{ margin: "0 0 16px", color: "var(--nu-ink-muted)", fontSize: "0.9rem" }}>
                Ward-ready IV drip rate calculators, normal lab ranges, and step-by-step clinical checklists.
              </p>
              <Link to="/clinical-tools" className="nu-btn nu-btn-outline">Launch Clinical Tools</Link>
            </div>
          </div>

          <div
            style={{
              marginTop: 40,
              background: "var(--nu-ink)",
              color: "#fff",
              padding: "36px 32px",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 20
            }}
          >
            <div style={{ maxWidth: 640 }}>
              <h2 style={{ fontFamily: "var(--nu-font-serif)", margin: "0 0 8px", fontSize: "1.6rem" }}>
                Are you a Senior Nurse Educator or Midwife Tutor in Uganda?
              </h2>
              <p style={{ margin: 0, color: "#cbd5e1" }}>
                Collaborate with our clinical review board to publish peer-reviewed nursing notes, mock papers, and referenced eBooks.
              </p>
            </div>
            <Link to="/contact" className="nu-btn nu-btn-primary nu-btn-lg">
              <CheckCircle2 size={18} /> Apply to Contribute
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
