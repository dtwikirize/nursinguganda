import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, BookOpen, Download, Printer, ShieldCheck } from "lucide-react";
import AdSlot from "../components/AdSlot";
import ReferencesBox from "../components/ReferencesBox";
import TopicVisuals, { LessonSections } from "../components/TopicVisuals";
import { recordEbookDownload } from "../lib/api";

export default function EbookReaderPage() {
  const { slug } = useParams();
  const [ebook, setEbook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [downloadedMsg, setDownloadedMsg] = useState("");

  useEffect(() => {
    setLoading(true);
    fetch("/assets/data/ebooks.json")
      .then((r) => r.json())
      .then((d) => {
        const found = (d.ebooks || []).find((e) => e.slug === slug);
        setEbook(found || null);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const handlePrintPdf = async (e) => {
    if (e) e.preventDefault();
    await recordEbookDownload({ ebookSlug: slug, email: email.trim() });
    setDownloadedMsg("Opening clean PDF print/save dialog...");
    setTimeout(() => window.print(), 150);
  };

  if (loading) {
    return (
      <main className="nu-section">
        <div className="nu-container"><p>Loading eBook...</p></div>
      </main>
    );
  }

  if (!ebook) {
    return (
      <main className="nu-section">
        <div className="nu-container">
          <h1>eBook not found</h1>
          <Link to="/ebooks" className="nu-btn nu-btn-primary">Back to Free eBooks</Link>
        </div>
      </main>
    );
  }

  return (
    <main>
      <section className="nu-cl-hero nu-no-print">
        <div className="nu-container">
          <Link to="/ebooks" style={{ color: "#c0c4fc", fontSize: "0.86rem", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
            <ArrowLeft size={15} /> All Free Referenced eBooks
          </Link>
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 320px", gap: 32, alignItems: "center" }}>
            <div>
              <span className="nu-badge nu-badge-free" style={{ marginBottom: 10 }}>{ebook.category}</span>
              <h1>{ebook.title}</h1>
              <p className="nu-cl-subtitle">{ebook.subtitle}</p>
              <div className="nu-cl-meta-line">
                <span><ShieldCheck size={14} style={{ display: "inline", marginRight: 4 }} /> {ebook.clinicalReviewer}</span>
                <span><BookOpen size={14} style={{ display: "inline", marginRight: 4 }} /> {ebook.chapters.length} Chapters · ~{ebook.estimatedPages} Print Pages</span>
                <span>Updated {ebook.updatedAt}</span>
              </div>
            </div>

            <div style={{ background: "#fff", color: "var(--nu-ink)", padding: 20, borderRadius: 4 }}>
              <strong style={{ display: "block", marginBottom: 6 }}>Save or Print Full eBook PDF</strong>
              <p style={{ fontSize: "0.82rem", color: "var(--nu-ink-muted)", margin: "0 0 12px" }}>
                Includes all {ebook.chapters.length} chapters + complete bibliography.
              </p>
              <form onSubmit={handlePrintPdf} style={{ display: "grid", gap: 8 }}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Optional: your email for exam updates"
                  style={{ height: 38, padding: "0 10px", border: "1px solid var(--nu-border)", fontSize: "0.85rem" }}
                />
                <button type="submit" className="nu-btn nu-btn-primary" style={{ width: "100%" }}>
                  <Printer size={16} /> Save as PDF / Print eBook
                </button>
              </form>
              {downloadedMsg && (
                <small style={{ display: "block", marginTop: 8, color: "var(--nu-success)" }}>{downloadedMsg}</small>
              )}
              {ebook.relatedCourseSlug && (
                <Link
                  to={`/course/${ebook.relatedCourseSlug}`}
                  className="nu-btn nu-btn-outline"
                  style={{ width: "100%", marginTop: 10, fontSize: "0.82rem" }}
                >
                  Open Matching Full Course
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="nu-section nu-ebook-print-sheet">
        <div className="nu-container" style={{ maxWidth: 920 }}>
          {/* Print Header */}
          <div style={{ borderBottom: "2px solid var(--nu-ink)", paddingBottom: 16, marginBottom: 24 }}>
            <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--nu-purple)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Nursing Uganda Free Referenced Study Guide
            </div>
            <h2 style={{ fontFamily: "var(--nu-font-serif)", fontSize: "1.8rem", margin: "6px 0" }}>{ebook.title}</h2>
            <p style={{ margin: 0, color: "var(--nu-ink-muted)" }}>{ebook.subtitle}</p>
          </div>

          {/* Table of Contents */}
          <div style={{ background: "var(--nu-bg-subtle)", border: "1px solid var(--nu-border)", padding: 20, marginBottom: 28 }}>
            <h3 style={{ margin: "0 0 10px" }}>Table of Contents</h3>
            <ol style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 6 }}>
              {ebook.chapters.map((ch) => (
                <li key={ch.slug}>
                  <a href={`#ch-${ch.chapterNumber}`} style={{ color: "var(--nu-purple)", fontWeight: 600 }}>
                    {ch.title}
                  </a>{" "}
                  <span style={{ color: "var(--nu-ink-muted)", fontSize: "0.82rem" }}>({ch.wordCount} words)</span>
                </li>
              ))}
              <li>
                <a href="#ebook-bibliography" style={{ color: "var(--nu-purple)", fontWeight: 600 }}>
                  Master References &amp; Clinical Bibliography ({ebook.references.length} sources)
                </a>
              </li>
            </ol>
          </div>

          <AdSlot slot="ebook-reader-top" />

          {/* Chapters */}
          {ebook.chapters.map((ch) => (
            <article key={ch.slug} id={`ch-${ch.chapterNumber}`} style={{ marginBottom: 42 }}>
              <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--nu-purple)", textTransform: "uppercase" }}>
                Chapter {ch.chapterNumber}
              </div>
              <h2 style={{ fontFamily: "var(--nu-font-serif)", fontSize: "1.55rem", margin: "4px 0 10px" }}>
                {ch.title}
              </h2>
              {ch.excerpt && (
                <p style={{ fontSize: "1rem", color: "var(--nu-ink-muted)", fontStyle: "italic" }}>{ch.excerpt}</p>
              )}

              <TopicVisuals lesson={ch} topicTitle={ch.title} />
              <LessonSections sections={ch.sections || []} headingTag="h3" />

              <ReferencesBox
                references={ch.chapterReferences}
                heading={`Chapter ${ch.chapterNumber} Sources`}
              />
            </article>
          ))}

          {/* Master Bibliography */}
          <div id="ebook-bibliography">
            <ReferencesBox
              references={ebook.references}
              heading="Master Book &amp; Guideline Bibliography"
            />
          </div>

          <div className="nu-no-print" style={{ marginTop: 32, padding: 24, background: "var(--nu-ink)", color: "#fff", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
            <div>
              <h3 style={{ margin: "0 0 4px" }}>Ready to test yourself on this topic?</h3>
              <p style={{ margin: 0, color: "#cbd5e1", fontSize: "0.9rem" }}>
                Practice with timed UNMEB mock exams and unlock full course units.
              </p>
            </div>
            <Link to="/mock-exams" className="nu-btn nu-btn-primary">
              <Download size={16} /> Try UNMEB Mock Exams
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
