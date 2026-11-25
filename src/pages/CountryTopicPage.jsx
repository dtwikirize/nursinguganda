import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  Clock,
  FileText,
  Layers,
  ShieldCheck
} from "lucide-react";
import CountryFlag from "../components/CountryFlag";
import NursingLoader from "../components/NursingLoader";
import { setPageSeo } from "../components/RouteSeo";
import { LessonSections } from "../components/TopicVisuals";
import {
  COUNTRY_CURRICULA,
  COUNTRY_META,
  DRUG_NAME_EQUIVALENTS,
  SLUG_TO_COUNTRY_KEY
} from "../data/countryCurricula";

export default function CountryTopicPage({ countryKey: forcedKey = "" }) {
  const { topicSlug, countrySlug } = useParams();
  const resolvedKey = forcedKey || SLUG_TO_COUNTRY_KEY[countrySlug] || "uk";
  const meta = COUNTRY_META[resolvedKey] || COUNTRY_META.uk;
  const curriculum = COUNTRY_CURRICULA[meta.slug];

  const [indexList, setIndexList] = useState([]);
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);

  const indexEntry = useMemo(
    () => indexList.find((t) => t.slug === topicSlug) || null,
    [indexList, topicSlug]
  );

  useEffect(() => {
    let active = true;
    setLoading(true);
    setCourseData(null);

    fetch("/assets/data/canonical-lessons-index.json")
      .then((r) => (r.ok ? r.json() : []))
      .then((arr) => {
        if (!active) return null;
        const list = Array.isArray(arr) ? arr : [];
        setIndexList(list);
        const match = list.find((t) => t.slug === topicSlug);
        if (!match?.courseSlug) return null;
        return fetch(`/assets/data/courses/${match.courseSlug}.json`).then((r) => (r.ok ? r.json() : null));
      })
      .then((cData) => {
        if (active && cData) setCourseData(cData);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [topicSlug]);

  const lesson = useMemo(() => {
    if (!courseData?.lessons) return null;
    if (Array.isArray(courseData.lessons)) {
      return courseData.lessons.find((l) => l.slug === topicSlug) || null;
    }
    return courseData.lessons[topicSlug] || null;
  }, [courseData, topicSlug]);

  const relatedTopics = useMemo(() => {
    if (!indexEntry) return [];
    return indexList
      .filter((t) => t.category === indexEntry.category && t.slug !== indexEntry.slug)
      .slice(0, 8);
  }, [indexList, indexEntry]);

  const { prevTopic, nextTopic } = useMemo(() => {
    if (!indexEntry) return { prevTopic: null, nextTopic: null };
    const sameCat = indexList.filter((t) => t.category === indexEntry.category);
    const idx = sameCat.findIndex((t) => t.slug === indexEntry.slug);
    return {
      prevTopic: idx > 0 ? sameCat[idx - 1] : null,
      nextTopic: idx >= 0 && idx < sameCat.length - 1 ? sameCat[idx + 1] : null
    };
  }, [indexList, indexEntry]);

  useEffect(() => {
    if (!indexEntry) return;
    setPageSeo({
      title: `${indexEntry.title} — ${meta.shortName} Nursing Notes (${meta.examBadge}) | Nursing Uganda`,
      description: `${indexEntry.excerpt || indexEntry.title} — Adapted for ${meta.name} (${meta.examBadge}, ${meta.unitLabel}).`,
      canonicalPath: `${meta.topicsBase}/${indexEntry.slug}`,
      type: "article"
    });
  }, [indexEntry, meta]);

  if (loading) {
    return (
      <main className="nu-section">
        <div className="nu-container">
          <NursingLoader label={`Loading ${meta.shortName} clinical study notes...`} />
        </div>
      </main>
    );
  }

  if (!indexEntry || !lesson) {
    return (
      <main className="nu-section">
        <div className="nu-container" style={{ maxWidth: 680 }}>
          <h1>Study topic not found</h1>
          <p style={{ color: "#475569" }}>
            Browse all 779 localized {meta.shortName} nursing study topics in {meta.academy}.
          </p>
          <Link to={`${meta.route}?tab=topics`} className="nu-btn nu-btn-primary">
            Browse {meta.shortName} Topics
          </Link>
        </div>
      </main>
    );
  }

  const headings = Array.isArray(lesson.headings) ? lesson.headings.slice(0, 10) : [];

  return (
    <main style={{ background: "#f8fafc", minHeight: "82vh" }}>
      {/* Country Sub-Header Banner */}
      <section style={{ background: meta.heroBg, color: "#ffffff", padding: "20px 0", borderBottom: "3px solid #09090B" }}>
        <div className="nu-container" style={{ maxWidth: 1160 }}>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 8, fontSize: "0.82rem" }}>
              <Link to={meta.route} style={{ color: "#ffffff", fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}>
                <ArrowLeft size={14} /> {meta.academy}
              </Link>
              <span style={{ opacity: 0.6 }}>/</span>
              <Link to={`${meta.route}?tab=topics`} style={{ color: "rgba(255,255,255,0.85)", textDecoration: "none" }}>
                779 Study Topics
              </Link>
              <span style={{ opacity: 0.6 }}>/</span>
              <span style={{ color: "rgba(255,255,255,0.9)" }}>{indexEntry.category}</span>
            </div>

            {/* Switch Country Context for Same Topic */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {Object.values(COUNTRY_META).map((c) => {
                const active = c.key === meta.key;
                return (
                  <Link
                    key={c.key}
                    to={`${c.topicsBase}/${topicSlug}`}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 5,
                      padding: "4px 9px",
                      borderRadius: 6,
                      border: `1px solid ${active ? "#FFFFFF" : "rgba(255,255,255,0.22)"}`,
                      background: active ? "#09090B" : "rgba(0,0,0,0.25)",
                      color: "#ffffff",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      textDecoration: "none"
                    }}
                  >
                    <CountryFlag code={c.flag} width={15} />
                    {c.shortName}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* NursingNotes.com 2-Column Study Layout */}
      <section className="nu-section">
        <div className="nu-container" style={{ maxWidth: 1160 }}>
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 310px", gap: 28, alignItems: "start" }} className="nu-notes-two-col">
            {/* Left Main Study Article */}
            <article style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 12, padding: "28px 26px" }}>
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 999, background: meta.heroBg, color: "#ffffff", fontSize: "0.74rem", fontWeight: 700 }}>
                  <CountryFlag code={meta.flag} width={14} /> {meta.examBadge}
                </span>
                <span style={{ fontSize: "0.8rem", color: "#64748b", display: "inline-flex", alignItems: "center", gap: 4 }}>
                  <Clock size={14} /> {lesson.readMinutes || indexEntry.readMinutes || 15} min read
                </span>
                <span style={{ fontSize: "0.8rem", color: "#64748b", display: "inline-flex", alignItems: "center", gap: 4 }}>
                  <FileText size={14} /> {(lesson.wordCount || indexEntry.wordCount || 2000).toLocaleString()} words
                </span>
              </div>

              <h1 style={{ margin: "0 0 14px", fontSize: "clamp(1.5rem, 2.5vw, 2.05rem)", color: "#0f172a", lineHeight: 1.25 }}>
                {lesson.title}
              </h1>

              {/* Country Clinical Localization Box */}
              <div style={{ background: "#f8fafc", border: "1px solid #cbd5e1", borderLeft: `4px solid ${meta.heroBg}`, borderRadius: 8, padding: "14px 16px", marginBottom: 22 }}>
                <div style={{ fontSize: "0.76rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", color: "#0f172a", marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
                  <ShieldCheck size={15} /> {meta.shortName} Exam &amp; Clinical Localization
                </div>
                <div style={{ display: "grid", gap: 4, fontSize: "0.85rem", color: "#334155" }}>
                  <div><strong>Lab System:</strong> {meta.unitLabel}</div>
                  <div><strong>Drug Naming:</strong> {meta.drugConvention}</div>
                  <div><strong>Standards:</strong> {meta.guidelineAuthority}</div>
                </div>
              </div>

              {/* Full Structured Clinical Lesson */}
              {Array.isArray(lesson.sections) && lesson.sections.length > 0 ? (
                <LessonSections sections={lesson.sections} lesson={lesson} topicTitle={lesson.title} headingTag="h2" />
              ) : lesson.contentHtml ? (
                <div className="nu-lesson-prose" dangerouslySetInnerHTML={{ __html: lesson.contentHtml }} />
              ) : (
                <p style={{ color: "#334155", lineHeight: 1.7 }}>{lesson.excerpt}</p>
              )}

              {/* Prev / Next Topic Navigation */}
              <div style={{ marginTop: 32, paddingTop: 20, borderTop: "1px solid #e2e8f0", display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 12 }}>
                {prevTopic ? (
                  <Link to={`${meta.topicsBase}/${prevTopic.slug}`} className="nu-btn nu-btn-outline" style={{ fontSize: "0.82rem" }}>
                    <ArrowLeft size={14} /> {prevTopic.title.slice(0, 38)}
                  </Link>
                ) : (
                  <Link to={`${meta.route}?tab=topics`} className="nu-btn nu-btn-outline" style={{ fontSize: "0.82rem" }}>
                    <ArrowLeft size={14} /> All {meta.shortName} Topics
                  </Link>
                )}
                {nextTopic && (
                  <Link to={`${meta.topicsBase}/${nextTopic.slug}`} className="nu-btn nu-btn-primary" style={{ fontSize: "0.82rem", background: meta.heroBg, borderColor: meta.heroBg }}>
                    {nextTopic.title.slice(0, 38)} <ArrowRight size={14} />
                  </Link>
                )}
              </div>
            </article>

            {/* Right Sticky Sidebar (NursingNotes.com Style) */}
            <aside style={{ display: "grid", gap: 18, position: "sticky", top: 82 }}>
              {headings.length > 0 && (
                <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 10, padding: 16 }}>
                  <h3 style={{ margin: "0 0 10px", fontSize: "0.9rem", color: "#0f172a", display: "flex", alignItems: "center", gap: 6 }}>
                    <Layers size={15} /> On This Page
                  </h3>
                  <ul style={{ margin: 0, paddingLeft: 16, display: "grid", gap: 6, fontSize: "0.8rem", color: "#475569" }}>
                    {headings.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Quick Drug Naming Reference */}
              <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 10, padding: 16 }}>
                <h3 style={{ margin: "0 0 10px", fontSize: "0.9rem", color: "#0f172a" }}>
                  Quick Drug Naming ({meta.shortName})
                </h3>
                <div style={{ display: "grid", gap: 6, fontSize: "0.78rem", color: "#334155" }}>
                  {DRUG_NAME_EQUIVALENTS.slice(0, 5).map((d) => (
                    <div key={d.genericUgUkAu} style={{ display: "flex", justifyContent: "space-between", gap: 8, paddingBottom: 5, borderBottom: "1px solid #f1f5f9" }}>
                      <strong>{meta.key === "usa" || meta.key === "canada" ? d.usCaName : d.genericUgUkAu}</strong>
                      <span style={{ color: "#64748b" }}>{meta.key === "usa" || meta.key === "canada" ? `UK: ${d.genericUgUkAu}` : `US: ${d.usCaName}`}</span>
                    </div>
                  ))}
                </div>
                <Link to={`${meta.route}?tab=practice`} style={{ display: "inline-flex", alignItems: "center", gap: 4, marginTop: 10, fontSize: "0.78rem", fontWeight: 700, color: "#0f172a" }}>
                  Open Lab &amp; Drug Converter <ArrowRight size={13} />
                </Link>
              </div>

              {/* Related Topics */}
              {relatedTopics.length > 0 && (
                <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 10, padding: 16 }}>
                  <h3 style={{ margin: "0 0 10px", fontSize: "0.9rem", color: "#0f172a", display: "flex", alignItems: "center", gap: 6 }}>
                    <BookOpen size={15} /> Related {meta.shortName} Topics
                  </h3>
                  <div style={{ display: "grid", gap: 8 }}>
                    {relatedTopics.map((rt) => (
                      <Link
                        key={rt.slug}
                        to={`${meta.topicsBase}/${rt.slug}`}
                        style={{ fontSize: "0.8rem", color: "#1e293b", textDecoration: "none", fontWeight: 600, lineHeight: 1.35 }}
                      >
                        • {rt.title}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Premium Country Offer Card */}
              {curriculum?.premiumOffer && (
                <div style={{ background: meta.heroBg, color: "#ffffff", borderRadius: 10, padding: 18 }}>
                  <div style={{ fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.06em", opacity: 0.85, marginBottom: 6 }}>
                    {curriculum.premiumOffer.badge}
                  </div>
                  <h3 style={{ margin: "0 0 8px", fontSize: "1rem", color: "#ffffff" }}>
                    {curriculum.premiumOffer.title}
                  </h3>
                  <div style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: 12 }}>
                    {curriculum.premiumOffer.price}{" "}
                    <span style={{ fontSize: "0.82rem", fontWeight: 500, textDecoration: "line-through", opacity: 0.7 }}>
                      {curriculum.premiumOffer.compareAt}
                    </span>
                  </div>
                  <Link
                    to={`${meta.route}?tab=offers`}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 6,
                      width: "100%",
                      padding: "9px 12px",
                      borderRadius: 8,
                      background: "#ffffff",
                      color: "#0f172a",
                      fontSize: "0.82rem",
                      fontWeight: 800,
                      textDecoration: "none"
                    }}
                  >
                    <Award size={14} /> View Full Prep Bundle
                  </Link>
                </div>
              )}
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
