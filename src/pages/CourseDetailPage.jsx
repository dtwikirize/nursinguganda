import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Award,
  BookOpen,
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  FileText,
  Lock,
  PlayCircle,
  ShieldCheck,
  ShoppingCart,
  Star,
  Users
} from "lucide-react";
import ReferencesBox from "../components/ReferencesBox";
import CertificateCard from "../components/CertificateCard";
import NursingLoader from "../components/NursingLoader";
import { setPageSeo } from "../components/RouteSeo";
import { formatUgxApprox, formatUsd, useApp } from "../context/AppContext";

export default function CourseDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isEnrolled, enrollments, addToCart, cart, enrollFree, user } = useApp();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openGroups, setOpenGroups] = useState({ 0: true });

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetch(`/assets/data/courses/${slug}.json`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (active) {
          setCourse(data);
          if (data?.title) {
            setPageSeo({
              title: `${data.title} | ${data.programmeLabel || "Nursing"} | Nursing Uganda`,
              description: data.subtitle || `${data.title} curriculum unit with ${data.lessonCount || ""} referenced nursing study lessons for Uganda UNMEB preparation.`,
              canonicalPath: `/course/${data.slug || slug}`,
              type: "article",
              schema: {
                "@type": "Course",
                name: data.title,
                description: data.subtitle,
                provider: {
                  "@type": "EducationalOrganization",
                  name: "Nursing Uganda",
                  sameAs: "https://nursinguganda.com"
                },
                educationalLevel: data.programmeLabel
              }
            });
          }
        }
      })
      .catch(() => {
        if (active) setCourse(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <main className="nu-section">
        <div className="nu-container">
          <NursingLoader label="Loading course curriculum & certificate preview..." />
        </div>
      </main>
    );
  }

  if (!course) {
    return (
      <main className="nu-section">
        <div className="nu-container">
          <h1>Course not found</h1>
          <Link to="/courses" className="nu-btn nu-btn-primary">Back to All Courses</Link>
        </div>
      </main>
    );
  }

  const enrolled = isEnrolled(course.slug, course.isFree);
  const explicitlyEnrolled = enrollments.includes(course.slug);
  const inCart = cart.some((x) => x.slug === course.slug);
  const firstLessonSlug = course.topicGroups?.[0]?.topics?.[0]?.slug || "";

  const handleEnrollOrBuy = async () => {
    if (course.isFree) {
      if (!explicitlyEnrolled) {
        await enrollFree(course.slug);
      }
      navigate(`/learn/${course.slug}/${firstLessonSlug}`);
      return;
    }
    if (enrolled) {
      navigate(`/learn/${course.slug}/${firstLessonSlug}`);
      return;
    }
    addToCart(course);
    navigate("/checkout");
  };

  return (
    <main>
      {/* Udemy Dark Hero */}
      <section className="nu-cl-hero">
        <div className="nu-container">
          <div className="nu-cl-grid">
            <div>
              <nav className="nu-breadcrumbs" aria-label="Breadcrumb">
                <Link to="/courses">Courses</Link>
                <span>›</span>
                <Link to={`/courses?programme=${encodeURIComponent(course.programmeId)}`}>{course.programmeLabel}</Link>
                <span>›</span>
                <span>{course.category}</span>
              </nav>

              <h1>{course.title}</h1>
              <p className="nu-cl-subtitle">{course.subtitle}</p>

              <div className="nu-cl-stats">
                <span className={`nu-badge ${course.isFree ? "nu-badge-free" : "nu-badge-bestseller"}`}>
                  {course.badge}
                </span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 5, color: "#f3ca8c", fontWeight: 700 }}>
                  {course.rating}
                  <Star size={14} fill="#f3ca8c" stroke="#f3ca8c" />
                  <span style={{ color: "#c0c4fc", fontWeight: 400 }}>({course.reviewCount} ratings)</span>
                </span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                  <Users size={15} /> {course.studentCount.toLocaleString()} students
                </span>
              </div>

              <div className="nu-cl-meta-line">
                <span><ShieldCheck size={14} style={{ display: "inline", marginRight: 5 }} /> Reviewed by {course.clinicalReviewer}</span>
                <span><Clock size={14} style={{ display: "inline", marginRight: 5 }} /> Updated {course.updatedAt}</span>
              </div>
            </div>
            <div />
          </div>
        </div>
      </section>

      {/* Main Landing Content + Sticky Sidebar */}
      <section className="nu-cl-body-wrap">
        <div className="nu-container">
          <div className="nu-cl-grid">
            <div className="nu-cl-main">
              {/* What you'll learn */}
              <div className="nu-learn-box">
                <h2>What you&apos;ll learn</h2>
                <ul className="nu-learn-grid">
                  {(course.learningOutcomes || []).map((item, idx) => (
                    <li key={idx}>
                      <Check size={16} style={{ flexShrink: 0, marginTop: 3, color: "var(--nu-ink)" }} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Course Content Accordion */}
              <h2 style={{ fontSize: "1.4rem", margin: "0 0 8px" }}>Course content</h2>
              <p style={{ color: "var(--nu-ink-muted)", fontSize: "0.9rem", margin: "0 0 16px" }}>
                {course.topicGroups?.length || 0} sections · {course.lessonCount} lessons · First {course.freePreviewCount} lessons open for free preview
              </p>

              <div className="nu-accordion">
                {(course.topicGroups || []).map((grp, gIdx) => {
                  const isOpen = !!openGroups[gIdx];
                  return (
                    <div key={gIdx} className="nu-acc-group">
                      <button
                        type="button"
                        className="nu-acc-head"
                        onClick={() => setOpenGroups((prev) => ({ ...prev, [gIdx]: !prev[gIdx] }))}
                      >
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                          {isOpen ? <ChevronUp size={17} /> : <ChevronDown size={17} />}
                          {grp.title}
                        </span>
                        <span style={{ fontSize: "0.82rem", fontWeight: 500, color: "var(--nu-ink-muted)" }}>
                          {grp.topics.length} lessons
                        </span>
                      </button>

                      {isOpen && (
                        <ul className="nu-acc-list">
                          {grp.topics.map((t) => {
                            const accessible = enrolled || t.isFreePreview;
                            return (
                              <li key={t.slug} className="nu-acc-item">
                                <div className="nu-acc-left">
                                  {accessible ? <PlayCircle size={16} color="#a435f0" /> : <Lock size={15} color="#6a6f73" />}
                                  {accessible ? (
                                    <Link to={`/learn/${course.slug}/${t.slug}`} style={{ fontWeight: 500 }}>
                                      {t.title}
                                    </Link>
                                  ) : (
                                    <span>{t.title}</span>
                                  )}
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: "0.82rem", color: "var(--nu-ink-muted)" }}>
                                  {t.isFreePreview && !enrolled && (
                                    <Link to={`/learn/${course.slug}/${t.slug}`} className="nu-preview-tag">
                                      Preview
                                    </Link>
                                  )}
                                  <span>{t.readMinutes}m</span>
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </div>

              <ReferencesBox
                references={course.references}
                heading="Course Unit Primary Medical Sources &amp; Guidelines"
              />

              {/* Visible Udemy/Coursera-Style Course Certificate Preview */}
              <div style={{ marginTop: 28 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 10, marginBottom: 14 }}>
                  <div>
                    <h2 style={{ fontSize: "1.4rem", margin: "0 0 4px" }}>Earn a Verified Certificate of Completion</h2>
                    <p style={{ margin: 0, color: "var(--nu-ink-muted)", fontSize: "0.9rem" }}>
                      Included with this unit — finish the lessons and pass the 30-question Final Evaluation (&ge; 60%) to download your personalized PDF certificate.
                    </p>
                  </div>
                </div>
                <CertificateCard
                  previewMode
                  certificate={{
                    courseTitle: course.title,
                    programmeLabel: course.programmeLabel,
                    studyHours: Math.max(1, Math.round((course.totalMinutes || 60) / 60)),
                    clinicalReviewer: course.clinicalReviewer,
                    certificateCode: `NU-${new Date().getFullYear()}-${String(course.code || "UNIT").replace(/\s+/g, "").toUpperCase()}`,
                    score: 26,
                    totalQuestions: 30,
                    percent: 87
                  }}
                />
              </div>
            </div>

            {/* Sticky Purchase Card spanning the full body height */}
            <aside className="nu-purchase-card" style={{ marginTop: -210 }}>
              <div className="nu-purchase-thumb">
                <img src={course.thumbnail} alt={course.title} />
              </div>
              <div className="nu-purchase-body">
                <div className="nu-purchase-price">
                  <strong>{enrolled && !course.isFree ? "Enrolled" : formatUsd(course.priceUsd)}</strong>
                  {!course.isFree && course.compareAtUsd > course.priceUsd && !enrolled && (
                    <span className="nu-price-was">${course.compareAtUsd.toFixed(2)}</span>
                  )}
                </div>
                {!course.isFree && !enrolled && (
                  <div style={{ fontSize: "0.82rem", color: "var(--nu-ink-muted)", marginBottom: 14 }}>
                    {formatUgxApprox(course.priceUsd)} · Paid securely via PayPal
                  </div>
                )}

                <div style={{ display: "grid", gap: 10 }}>
                  <button
                    type="button"
                    className="nu-btn nu-btn-primary nu-btn-lg"
                    style={{ width: "100%" }}
                    onClick={handleEnrollOrBuy}
                  >
                    {explicitlyEnrolled || (!course.isFree && enrolled)
                      ? "Go to Course Player"
                      : course.isFree
                        ? "Enroll & Start Learning (Free)"
                        : "Buy Now with PayPal"}
                  </button>

                  {!course.isFree && !enrolled && (
                    <button
                      type="button"
                      className="nu-btn nu-btn-outline nu-btn-lg"
                      style={{ width: "100%" }}
                      onClick={() => {
                        addToCart(course);
                        if (inCart) navigate("/cart");
                      }}
                    >
                      <ShoppingCart size={16} />
                      {inCart ? "Go to Cart" : "Add to Cart"}
                    </button>
                  )}

                  {firstLessonSlug && (
                    <Link
                      to={`/learn/${course.slug}/${firstLessonSlug}`}
                      className="nu-btn nu-btn-purple-outline"
                      style={{ width: "100%" }}
                    >
                      <PlayCircle size={16} /> Preview Free Sample Lesson
                    </Link>
                  )}
                </div>

                <ul className="nu-purchase-includes">
                  <li><BookOpen size={15} /> {course.lessonCount} comprehensive nursing lessons</li>
                  <li><Clock size={15} /> ~{course.totalMinutes} mins structured study</li>
                  <li><FileText size={15} /> Authoritative WHO &amp; MoH references on every topic</li>
                  <li><Award size={15} /> Verified PDF Certificate + interactive unit quiz</li>
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
