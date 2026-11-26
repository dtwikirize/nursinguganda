import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { BookOpen, Filter, Layers, Search } from "lucide-react";
import CourseCard from "../components/CourseCard";
import NursingLoader from "../components/NursingLoader";
import { formatUgxApprox, formatUsd, useApp } from "../context/AppContext";
import { getAllAccessCartItem, getProgrammeBundleItem } from "../utils/offers";

export default function CoursesCatalogPage() {
  const { catalog, catalogLoading, addToCart, enrollments, isEnrolled } = useApp();
  const navigate = useNavigate();
  const allAccessItem = getAllAccessCartItem(catalog?.courses || []);
  const hasAllAccess = enrollments.includes("all-access-pass");
  const [searchParams, setSearchParams] = useSearchParams();

  const initialProg = searchParams.get("programme") || "all";
  const initialCat = searchParams.get("category") || "all";
  const initialQ = searchParams.get("q") || "";

  const [programme, setProgramme] = useState(initialProg);
  const [category, setCategory] = useState(initialCat);
  const [priceFilter, setPriceFilter] = useState("all");
  const [q, setQ] = useState(initialQ);
  const [lessonIndex, setLessonIndex] = useState([]);

  useEffect(() => {
    setQ(searchParams.get("q") || "");
    if (searchParams.get("programme")) setProgramme(searchParams.get("programme"));
    if (searchParams.get("category")) setCategory(searchParams.get("category"));
  }, [searchParams]);

  useEffect(() => {
    fetch("/assets/data/canonical-lessons-index.json")
      .then((r) => (r.ok ? r.json() : []))
      .then((arr) => {
        if (Array.isArray(arr)) setLessonIndex(arr);
      })
      .catch(() => {});
  }, []);

  const courses = catalog?.courses || [];
  const programmes = catalog?.programmes || [];
  const categories = catalog?.categories || [];
  const fullCourses = catalog?.fullCourses || [];
  const visibleFullCourses = useMemo(() => {
    if (programme === "all") return fullCourses;
    return fullCourses.filter((fc) => fc.programmeId === programme);
  }, [fullCourses, programme]);

  const matchedLessons = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (query.length < 2 || !lessonIndex.length) return [];
    const tokens = query.split(/\s+/).filter(Boolean);
    const hits = [];
    const seen = new Set();
    for (const l of lessonIndex) {
      const hay = `${l.title} ${l.excerpt || ""} ${l.courseTitle} ${l.category}`.toLowerCase();
      if (tokens.every((t) => hay.includes(t))) {
        hits.push(l);
        seen.add(l.courseSlug);
      }
      if (hits.length >= 16) break;
    }
    return { hits: hits.slice(0, 8), courseSlugs: seen };
  }, [lessonIndex, q]);

  const matchingCourseSlugs = matchedLessons?.courseSlugs || new Set();
  const directTopics = matchedLessons?.hits || [];

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    const tokens = query ? query.split(/\s+/).filter(Boolean) : [];
    return courses.filter((c) => {
      if (programme !== "all" && c.programmeId !== programme) return false;
      if (category !== "all" && c.category !== category) return false;
      if (priceFilter === "free" && !c.isFree) return false;
      if (priceFilter === "paid" && c.isFree) return false;
      if (tokens.length > 0) {
        const hay = `${c.title} ${c.code} ${c.programmeLabel} ${c.category} ${c.subtitle || ""}`.toLowerCase();
        const metaMatch = tokens.every((t) => hay.includes(t));
        const topicMatch = matchingCourseSlugs.has(c.slug);
        if (!metaMatch && !topicMatch) return false;
      }
      return true;
    });
  }, [courses, programme, category, priceFilter, q, matchingCourseSlugs]);

  const updateProgramme = (val) => {
    setProgramme(val);
    const next = new URLSearchParams(searchParams);
    if (val === "all") next.delete("programme");
    else next.set("programme", val);
    setSearchParams(next);
  };

  return (
    <main className="nu-section">
      <div className="nu-container">
        <div className="nu-section-head">
          <h1>Nursing &amp; Midwifery Course Catalog</h1>
          <p>
            {courses.length} structured course units across {programmes.length} Ugandan nursing &amp; midwifery programmes | individual paid courses now <strong>50% OFF</strong>.
          </p>
        </div>

        {!hasAllAccess && (
          <div className="nu-allaccess-banner" style={{ marginBottom: 22 }}>
            <div className="nu-allaccess-copy">
              <span className="nu-allaccess-eyebrow">
                <Layers size={13} /> FULL PLATFORM ACCESS · SAVE 75%
              </span>
              <h3>Get Every Course ({courses.length} Units) + 109 UNMEB Past Papers</h3>
              <p>
                Unlock all 6 programmes together for <strong>{formatUsd(allAccessItem.priceUsd)}</strong>{" "}
                <s>${allAccessItem.compareAtUsd.toFixed(2)}</s> instead of buying units separately.
              </p>
            </div>
            <div className="nu-allaccess-cta">
              <button
                type="button"
                className="nu-btn nu-btn-primary"
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

        {/* Filter Bar */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 12,
            padding: 16,
            background: "var(--nu-bg-subtle)",
            border: "1px solid var(--nu-border)",
            marginBottom: 28
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#fff", border: "1px solid var(--nu-border)", padding: "0 12px", height: 42 }}>
            <Search size={16} color="#6a6f73" />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Filter by course title or code..."
              style={{ border: 0, outline: "none", width: "100%", fontSize: "0.9rem" }}
            />
          </div>

          <select
            value={programme}
            onChange={(e) => updateProgramme(e.target.value)}
            aria-label="Filter by programme"
            style={{ height: 42, padding: "0 12px", border: "1px solid var(--nu-border)", background: "#fff" }}
          >
            <option value="all">All Programmes ({courses.length})</option>
            {programmes.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label} ({p.courseCount})
              </option>
            ))}
          </select>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            aria-label="Filter by specialty"
            style={{ height: 42, padding: "0 12px", border: "1px solid var(--nu-border)", background: "#fff" }}
          >
            <option value="all">All Specialties</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select
            value={priceFilter}
            onChange={(e) => setPriceFilter(e.target.value)}
            aria-label="Filter by price"
            style={{ height: 42, padding: "0 12px", border: "1px solid var(--nu-border)", background: "#fff" }}
          >
            <option value="all">All Prices (Free &amp; Paid)</option>
            <option value="free">Free Courses Only</option>
            <option value="paid">Premium Units (PayPal)</option>
          </select>
        </div>

        {/* Full Programme Curriculum Courses & Bundles ($12.99 - $24.99 alongside All-Access $34.99) */}
        {visibleFullCourses.length > 0 && (
          <section style={{ marginBottom: 28 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
              <div>
                <h2 style={{ margin: 0, fontSize: "1.18rem", color: "#0f2942" }}>
                  {programme === "all"
                    ? "Complete Programme Courses (Full Year 1–3 Curriculum)"
                    : `${visibleFullCourses[0].programmeLabel} | Complete Full Curriculum Course`}
                </h2>
                <small style={{ color: "var(--nu-ink-muted)" }}>
                  Unlock an entire programme&apos;s combined units + 109 UNMEB past papers in one structured curriculum player ($12.99–$24.99).
                </small>
              </div>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: programme === "all" ? "repeat(auto-fit, minmax(290px, 1fr))" : "minmax(0, 1fr)",
                gap: 14
              }}
            >
              {visibleFullCourses.map((fc) => {
                const progObj = programmes.find((p) => p.id === fc.programmeId);
                const bundleCartItem = getProgrammeBundleItem(progObj, courses) || fc;
                const progUnlocked = isEnrolled(fc.slug, false, fc.programmeId);
                return (
                  <div
                    key={fc.slug}
                    style={{
                      background: "#ffffff",
                      border: "1.5px solid #e2e8f0",
                      borderLeft: "4px solid #7c3aed",
                      borderRadius: 10,
                      padding: 16,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      gap: 12,
                      boxShadow: "0 2px 6px rgba(15, 23, 42, 0.04)"
                    }}
                  >
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, marginBottom: 6 }}>
                        <span className="nu-badge nu-badge-highyield" style={{ fontSize: "0.7rem" }}>
                          FULL PROGRAMME · {fc.unitCount} UNITS
                        </span>
                        <span style={{ fontWeight: 800, fontSize: "1.02rem", color: "#0f2942" }}>
                          {formatUsd(fc.priceUsd)}{" "}
                          <s style={{ fontSize: "0.78rem", color: "#64748b", fontWeight: 500 }}>${Number(fc.compareAtUsd || fc.priceUsd * 2).toFixed(2)}</s>
                        </span>
                      </div>
                      <h3 style={{ margin: "0 0 6px", fontSize: "1rem", color: "#0f172a" }}>
                        <Link to={`/course/${fc.slug}`}>{fc.title}</Link>
                      </h3>
                      <p style={{ margin: 0, fontSize: "0.83rem", color: "var(--nu-ink-muted)", lineHeight: 1.5 }}>
                        {fc.lessonCount} organized topics across all semesters + 109 UNMEB past papers ({formatUgxApprox(fc.priceUsd)}).
                      </p>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      <Link to={`/course/${fc.slug}`} className="nu-btn nu-btn-outline" style={{ height: 34, fontSize: "0.8rem", padding: "0 12px" }}>
                        Open Full Curriculum
                      </Link>
                      {progUnlocked ? (
                        <Link to={`/learn/${fc.slug}`} className="nu-btn nu-btn-dark" style={{ height: 34, fontSize: "0.8rem", padding: "0 12px" }}>
                          Continue Learning
                        </Link>
                      ) : (
                        <button
                          type="button"
                          className="nu-btn nu-btn-primary"
                          style={{ height: 34, fontSize: "0.8rem", padding: "0 12px" }}
                          onClick={() => {
                            addToCart(bundleCartItem);
                            navigate("/checkout");
                          }}
                        >
                          Unlock Full Programme ({formatUsd(fc.priceUsd)})
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, color: "var(--nu-ink-muted)", fontSize: "0.9rem" }}>
          <Filter size={15} />
          <span>Showing <strong>{filtered.length}</strong> course units</span>
        </div>

        {directTopics.length > 0 && (
          <div style={{ border: "1px solid #e9d5ff", background: "#FAF5FF", borderRadius: 10, padding: "14px 16px", marginBottom: 22 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 700, fontSize: "0.88rem", color: "#5b21b6", marginBottom: 10 }}>
              <BookOpen size={15} /> Direct Lesson &amp; Clinical Topic Matches for &ldquo;{q}&rdquo;
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {directTopics.map((topic) => (
                <Link
                  key={`${topic.courseSlug}:${topic.slug}`}
                  to={`/learn/${topic.courseSlug}/${topic.slug}`}
                  style={{
                    background: "#fff",
                    border: "1px solid #d8b4fe",
                    borderRadius: 999,
                    padding: "6px 12px",
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    color: "#1c1d1f"
                  }}
                >
                  {topic.title} <small style={{ color: "#6d28d9" }}>({topic.courseTitle})</small>
                </Link>
              ))}
            </div>
          </div>
        )}

        {catalogLoading ? (
          <NursingLoader label="Loading Nursing Uganda courses..." />
        ) : filtered.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", border: "1px solid var(--nu-border)" }}>
            <h3>No courses match your filters</h3>
            <button
              type="button"
              className="nu-btn nu-btn-primary"
              onClick={() => {
                setProgramme("all");
                setCategory("all");
                setPriceFilter("all");
                setQ("");
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="nu-course-grid">
            {filtered.map((course) => (
              <CourseCard key={course.slug} course={course} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
