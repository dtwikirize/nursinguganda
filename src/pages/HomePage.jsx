import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  FileText,
  GraduationCap,
  Layers,
  ShieldCheck,
  Sparkles,
  Stethoscope
} from "lucide-react";
import CourseCard from "../components/CourseCard";
import CountryFlag from "../components/CountryFlag";
import EbookCover from "../components/EbookCover";
import NursingLoader from "../components/NursingLoader";
import { formatUsd, useApp } from "../context/AppContext";
import { getAllAccessCartItem } from "../utils/offers";

const CLINICAL_SERIES_CARDS = [
  {
    title: "NextGen NCLEX-RN Mastery",
    coverTitle: "NCLEX-RN: NextGen Clinical Judgment",
    fact: "16 units · 48 topics · 4 CAT exams",
    to: "/nclex-rn",
    orb: "rgba(168, 85, 247, 0.85)",
    core: "#6d28d9",
    badges: ["NCSBN", "CAT", "NGN"]
  },
  {
    title: "Clinical Pharmacology & Safe Dosing",
    coverTitle: "Pharmacology & Safe Prescribing",
    fact: "6 chapters · WHO & BNF referenced",
    to: "/ebooks/book-instant-clinical-pharmacology",
    orb: "rgba(139, 92, 246, 0.82)",
    core: "#4c1d95",
    badges: ["WHO", "BNF", "IV"]
  },
  {
    title: "Midwifery, Labour & Newborn Care",
    coverTitle: "Midwifery & Safe Delivery",
    fact: "WHO partograph · MoH 2023 aligned",
    to: "/topics?cat=Midwifery+%26+Maternal+Health",
    orb: "rgba(192, 132, 252, 0.85)",
    core: "#7e22ce",
    badges: ["WHO", "MoH", "OB"]
  },
  {
    title: "Medical-Surgical Ward Practice",
    coverTitle: "Medical-Surgical Nursing",
    fact: "Ward practice · UCG 2023 referenced",
    to: "/topics?cat=Medical-Surgical+Nursing",
    orb: "rgba(129, 140, 248, 0.82)",
    core: "#4338ca",
    badges: ["ICU", "OR", "MED"]
  },
  {
    title: "UK NMC CBT & OSCE Track",
    coverTitle: "United Kingdom NMC Licensing",
    fact: "NMC CBT & OSCE · NEWS2 scoring",
    to: "/nursing-uk",
    orb: "rgba(167, 139, 250, 0.82)",
    core: "#5b21b6",
    badges: ["NMC", "CBT", "OSCE"]
  },
  {
    title: "Paediatrics, IMCI & Child Health",
    coverTitle: "Paediatrics & Child Health",
    fact: "IMCI plans A/B/C · UNEPI schedule",
    to: "/topics?cat=Paediatrics+%26+Child+Health",
    orb: "rgba(168, 85, 247, 0.82)",
    core: "#6b21a8",
    badges: ["IMCI", "WHO", "PAED"]
  }
];

const GLOBAL_PATHWAY_CARDS = [
  { flag: "US", title: "NCLEX-RN Academy ($99)", sub: "16 Course Units · 4 CAT Exams", to: "/nclex-rn" },
  { flag: "UK", title: "United Kingdom (NMC)", sub: "CBT Numeracy, Clinical & OSCE", to: "/nursing-uk" },
  { flag: "CA", title: "Canada (NNAS & REx-PN)", sub: "NCLEX-RN, REx-PN & SI Labs", to: "/nursing-canada" },
  { flag: "AU", title: "Australia (Ahpra OBA)", sub: "NCLEX-RN & 10-Station OSCE", to: "/nursing-australia" },
  { flag: "KE", title: "Kenya (NCK)", sub: "KRCHN, BScN & KEPI Guides", to: "/global-nursing/kenya-nck" },
  { flag: "TZ", title: "Tanzania (TNMC)", sub: "TNMC Licensure & EAC Track", to: "/global-nursing/tanzania-tnmc" },
  { flag: "AE", title: "UAE & Gulf (Prometric)", sub: "DHA, DOH, SCFHS & DataFlow", to: "/global-nursing/gulf-dha-doh-scfhs" },
  { flag: "UG", title: "Uganda (UHPAB / UNMC)", sub: "Certificate, Diploma & BScN", to: "/global-nursing/uganda-unmc-uhpab" }
];

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
  const [seriesScrolled, setSeriesScrolled] = useState(false);
  const seriesTrackRef = useRef(null);

  const scrollSeries = (dir) => {
    if (!seriesTrackRef.current) return;
    seriesTrackRef.current.scrollBy({ left: dir * 320, behavior: "smooth" });
  };

  useEffect(() => {
    // Slim 4-record slice built at build time. The full ebooks.json is 1.1 MB
    // (165 KB compressed) and this section renders four cards from it.
    fetch("/assets/data/ebooks-featured.json")
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

  // Ranked by actual depth of material, not by the enrolment figures that
  // used to be generated at build time.
  const topCourses = useMemo(
    () =>
      [...courses]
        .filter((c) => !c.isFree)
        .sort((a, b) => Number(b.lessonCount || 0) - Number(a.lessonCount || 0))
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
          <h1>Clinical &amp; licensing mastery for nurses worldwide</h1>
          <p>
            Structured Certificate, Diploma, BScN &amp; NCLEX-RN courses, 87 free referenced textbooks, and timed licensing exams aligned with WHO, Uganda MoH 2023, Saunders &amp; NCSBN standards.
          </p>
          <div className="nu-hero-actions">
            <Link to="/courses" className="nu-btn nu-btn-primary nu-btn-lg">
              Explore {courses.length || 85} Courses
            </Link>
            <Link to="/nclex-rn" className="nu-btn nu-btn-outline nu-btn-lg">
              NCLEX-RN Academy ($99)
            </Link>
          </div>
        </div>
      </section>

      {/* Trust & Curriculum Strip */}
      <section className="nu-trust-strip">
        <div className="nu-container">
          <p className="nu-trust-title">
            Aligned with international nursing &amp; clinical standards worldwide
          </p>
          <div className="nu-trust-pills">
            <span className="nu-trust-pill"><ShieldCheck size={17} color="#a435f0" /> Uganda Clinical Guidelines 2023 &amp; WHO</span>
            <span className="nu-trust-pill"><GraduationCap size={17} color="#a435f0" /> Next-Gen NCLEX-RN &amp; UK NMC</span>
            <span className="nu-trust-pill"><BookOpen size={17} color="#a435f0" /> 87 Free Reference eBooks</span>
            <span className="nu-trust-pill"><Stethoscope size={17} color="#a435f0" /> Saunders, Kaplan &amp; OpenStax Citations</span>
          </div>
        </div>
      </section>

      {/* Coursera-Style Dark Spotlight Carousel */}
      <section className="nu-section" style={{ paddingTop: 0, paddingBottom: 16 }}>
        <div className="nu-container">
          <div className="nu-series-band">
            <div className="nu-series-head">
              <Link to="/nclex-rn" className="nu-series-title-link">
                <span>Introducing Clinical Mastery Series</span>
                <ArrowRight size={20} />
              </Link>
              <p className="nu-series-sub">
                Build the clinical &amp; licensing skills your international nursing career demands.
              </p>
            </div>

            <div className="nu-series-carousel-wrap">
              {seriesScrolled && (
                <button
                  type="button"
                  aria-label="Scroll series left"
                  className="nu-series-nav-btn nu-series-nav-btn--left"
                  onClick={() => scrollSeries(-1)}
                >
                  <ChevronLeft size={18} />
                </button>
              )}

              <div
                className="nu-series-track"
                ref={seriesTrackRef}
                onScroll={(e) => setSeriesScrolled(e.currentTarget.scrollLeft > 16)}
              >
                {CLINICAL_SERIES_CARDS.map((card) => (
                  <Link key={card.title} to={card.to} className="nu-series-card">
                    <div className="nu-series-art">
                      <span
                        className="nu-series-orb"
                        style={{
                          background: `radial-gradient(circle at 38% 52%, ${card.orb} 0%, ${card.core} 44%, rgba(9, 8, 18, 0) 74%)`
                        }}
                        aria-hidden="true"
                      />
                      <svg className="nu-series-constellation" viewBox="0 0 150 146" fill="none" aria-hidden="true">
                        <g stroke="rgba(226, 232, 240, 0.36)" strokeWidth="0.8">
                          <line x1="72" y1="20" x2="108" y2="46" />
                          <line x1="108" y1="46" x2="136" y2="28" />
                          <line x1="108" y1="46" x2="94" y2="88" />
                          <line x1="94" y1="88" x2="134" y2="78" />
                          <line x1="94" y1="88" x2="122" y2="124" />
                          <line x1="62" y1="68" x2="94" y2="88" />
                        </g>
                        <g fill="rgba(248, 250, 252, 0.85)">
                          <circle cx="72" cy="20" r="2" />
                          <circle cx="108" cy="46" r="2.6" />
                          <circle cx="136" cy="28" r="1.8" />
                          <circle cx="94" cy="88" r="2.4" />
                          <circle cx="134" cy="78" r="1.9" />
                          <circle cx="122" cy="124" r="1.7" />
                          <circle cx="62" cy="68" r="1.6" />
                        </g>
                      </svg>

                      <span className="nu-series-pill">
                        <Sparkles size={10} /> Clinical Series
                      </span>
                      <div className="nu-series-art-title">{card.coverTitle}</div>
                      <div className="nu-series-badges">
                        {card.badges.map((b) => (
                          <span key={b} className="nu-series-micro">{b}</span>
                        ))}
                      </div>
                    </div>

                    <div className="nu-series-body">
                      <h3 className="nu-series-card-title">{card.title}</h3>
                      <div className="nu-series-meta">
                        <span>{card.fact}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              <button
                type="button"
                aria-label="Scroll series right"
                className="nu-series-nav-btn nu-series-nav-btn--right"
                onClick={() => scrollSeries(1)}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Coursera-Style International Nursing Pathways Grid */}
      <section className="nu-section" style={{ paddingBottom: 12 }}>
        <div className="nu-container">
          <div className="nu-tab-intro" style={{ marginBottom: 16 }}>
            <div className="nu-section-head" style={{ marginBottom: 0 }}>
              <h2>Choose your nursing licensing &amp; study academy</h2>
              <p>Localized exam roadmaps, SI ↔ US lab units, and 779 clinical study topics tailored to each country.</p>
            </div>
            <Link to="/global-nursing" className="nu-btn nu-btn-outline">
              Compare All 8 Countries
            </Link>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 12 }}>
            {GLOBAL_PATHWAY_CARDS.map((card) => (
              <Link
                key={card.to}
                to={card.to}
                style={{
                  background: "#ffffff",
                  border: "1px solid #d1d7dc",
                  borderRadius: 6,
                  padding: "14px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  textDecoration: "none",
                  color: "#1c1d1f"
                }}
              >
                <CountryFlag code={card.flag} width={30} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: "0.92rem", color: "#1c1d1f" }}>{card.title}</div>
                  <div style={{ fontSize: "0.78rem", color: "#6a6f73", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {card.sub}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Tabbed Programme Course Showcase */}
      <section className="nu-section">
        <div className="nu-container">
          <div className="nu-section-head">
            <h2>All the nursing &amp; midwifery units you need in one place</h2>
            <p>
              Individual paid units start at <strong>$2.49</strong>, or unlock every unit &amp; past paper together.
            </p>
          </div>

          {!hasAllAccess && (
            <div className="nu-allaccess-banner">
              <div className="nu-allaccess-copy">
                <span className="nu-allaccess-eyebrow">
                  <Layers size={13} /> FULL PLATFORM ALL-ACCESS
                </span>
                <h3>Unlock All {catalog?.courses?.length || 85} Courses + 109 UNMEB Past Papers</h3>
                <p>
                  One pass unlocks every Certificate, Diploma &amp; BScN unit, all clinical quizzes &amp; verified certificates for{" "}
                  <strong>{formatUsd(allAccessItem.priceUsd)}</strong>{" "}
                  <span style={{ opacity: 0.85 }}>
                    — ${allAccessItem.separatelyUsd.toFixed(2)} if bought separately
                  </span>
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
                <h2>Free Referenced Study eBooks (87 Books)</h2>
                <p>
                  Browse 87 free nursing, midwifery, pharmacology &amp; clinical reference books complete with downloadable PDFs and full bibliographies.
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
            <h2>Most comprehensive units</h2>
            <p>The clinical &amp; exam preparation units with the deepest referenced material.</p>
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
