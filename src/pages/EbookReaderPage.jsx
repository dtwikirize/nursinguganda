import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, BookOpen, Check, ChevronLeft, ChevronRight, CloudDownload, Download, List, ShieldCheck, Trash2 } from "lucide-react";
import AdSlot from "../components/AdSlot";
import EbookCover from "../components/EbookCover";
import MedicalImageFrame from "../components/MedicalImageFrame";
import NursingLoader from "../components/NursingLoader";
import ReferencesBox from "../components/ReferencesBox";
import { setPageSeo } from "../components/RouteSeo";
import TopicVisuals, { LessonSections } from "../components/TopicVisuals";
import { recordEbookDownload } from "../lib/api";
import { EBOOK_PRESET_PALETTES } from "../utils/ebookThemes";
import { downloadEbookPdf } from "../utils/pdfExport";
import {
  ebookOfflineUrls,
  isEbookSavedOffline,
  offlineSupported,
  removeEbookOffline,
  saveEbookOffline
} from "../utils/offlineLibrary";

export default function EbookReaderPage() {
  const { slug } = useParams();
  const [ebook, setEbook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeChapterNum, setActiveChapterNum] = useState(1);
  const [viewAllChapters, setViewAllChapters] = useState(false);
  const [email, setEmail] = useState("");
  const [themePreset, setThemePreset] = useState("");
  const [downloadedMsg, setDownloadedMsg] = useState("");
  const [offlineState, setOfflineState] = useState("idle"); // idle | saving | saved | error
  const [offlineMsg, setOfflineMsg] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setActiveChapterNum(1);
    setViewAllChapters(false);

    fetch("/assets/data/ebooks.json")
      .then((r) => r.json())
      .then(async (d) => {
        const found = (d.ebooks || []).find((e) => e.slug === slug);
        if (!found) {
          if (!cancelled) setEbook(null);
          return;
        }

        let merged = found;
        if (found.hasFullBookData) {
          try {
            const fullRes = await fetch(`/assets/data/books/${found.slug}.json`);
            if (fullRes.ok) {
              const fullBook = await fullRes.json();
              merged = {
                ...found,
                ...fullBook,
                chapters: Array.isArray(fullBook.chapters) && fullBook.chapters.length ? fullBook.chapters : found.chapters,
                references: Array.isArray(fullBook.references) && fullBook.references.length ? fullBook.references : found.references,
                figures: Array.isArray(fullBook.figures) ? fullBook.figures : found.figures
              };
            }
          } catch {
            // Fall back cleanly to summary record in ebooks.json
          }
        }

        if (cancelled) return;
        setEbook(merged);
        if (merged?.chapters?.length) {
          setActiveChapterNum(merged.chapters[0].chapterNumber || 1);
        }

        if (merged?.title) {
          setPageSeo({
            title: `${merged.title} (Free Study Textbook) | Nursing Uganda`,
            description: merged.subtitle || `Free structured study textbook on ${merged.title} with full chapters and references.`,
            canonicalPath: `/ebooks/${merged.slug}`,
            type: "book",
            schema: {
              "@type": "Book",
              name: merged.title,
              description: merged.subtitle,
              bookFormat: "https://schema.org/EBook",
              inLanguage: "en-UG",
              publisher: { "@type": "Organization", name: "Nursing Uganda" }
            }
          });
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  // Reflect whether this book is already in the offline cache.
  useEffect(() => {
    if (!ebook?.slug || !offlineSupported()) return;
    let cancelled = false;
    isEbookSavedOffline(ebookOfflineUrls(ebook)).then((res) => {
      if (!cancelled && res?.saved) setOfflineState("saved");
    });
    return () => {
      cancelled = true;
    };
  }, [ebook]);

  const handleSaveOffline = async () => {
    if (!ebook) return;
    const urls = ebookOfflineUrls(ebook);

    if (offlineState === "saved") {
      await removeEbookOffline(urls);
      setOfflineState("idle");
      setOfflineMsg("Removed from offline library.");
      return;
    }

    setOfflineState("saving");
    setOfflineMsg(`Saving ${urls.length} files for offline reading...`);
    const res = await saveEbookOffline(urls);

    if (res?.ok) {
      setOfflineState("saved");
      setOfflineMsg("Saved. This book now opens without a connection.");
    } else if (res?.saved > 0) {
      setOfflineState("saved");
      setOfflineMsg(`Saved ${res.saved} of ${urls.length} files. Some images need a better connection.`);
    } else {
      setOfflineState("error");
      setOfflineMsg("Could not save. Check your connection and try again.");
    }
  };

  const handleDownloadPdf = async (e) => {
    if (e) e.preventDefault();
    if (!ebook) return;
    setDownloadedMsg("Generating your designed full-color textbook .pdf...");
    downloadEbookPdf(ebook, themePreset);
    await recordEbookDownload({ ebookSlug: slug, email: email.trim() }).catch(() => {});
    setDownloadedMsg(`Downloaded ${ebook.title} (.pdf)`);
  };

  if (loading) {
    return (
      <main className="nu-section">
        <div className="nu-container">
          <NursingLoader label="Loading Peer-Reviewed Nursing eBook..." />
        </div>
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
          <div className="nu-ebook-hero-grid">
            <div>
              <span className="nu-badge nu-badge-free" style={{ marginBottom: 10 }}>{ebook.category}</span>
              <h1>{ebook.title}</h1>
              <p className="nu-cl-subtitle">{ebook.subtitle}</p>
              <div className="nu-cl-meta-line">
                <span><ShieldCheck size={14} style={{ display: "inline", marginRight: 4 }} /> {ebook.clinicalReviewer}</span>
                <span><BookOpen size={14} style={{ display: "inline", marginRight: 4 }} /> {(ebook.chapters || []).length} Chapters · ~{ebook.estimatedPages} Print Pages</span>
                <span>Updated {ebook.updatedAt}</span>
              </div>
            </div>

            <div style={{ background: "#fff", color: "var(--nu-ink)", padding: 18, borderRadius: 8, display: "grid", gap: 10 }}>
              <EbookCover ebook={ebook} presetId={themePreset} compact />
              <strong style={{ display: "block", fontSize: "0.96rem" }}>Download Designed eBook (.pdf)</strong>
              <form onSubmit={handleDownloadPdf} style={{ display: "grid", gap: 8 }}>
                <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--nu-ink-muted)" }}>
                  Choose PDF Color Theme
                  <select
                    value={themePreset}
                    onChange={(e) => setThemePreset(e.target.value)}
                    style={{ display: "block", width: "100%", height: 36, marginTop: 4, padding: "0 8px", border: "1px solid var(--nu-border)", borderRadius: 4, fontSize: "0.82rem", background: "#fff" }}
                  >
                    <option value="">Default Volume Signature Theme</option>
                    {Object.values(EBOOK_PRESET_PALETTES).map((p) => (
                      <option key={p.id} value={p.id}>{p.label}</option>
                    ))}
                  </select>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Optional: your email for exam updates"
                  style={{ height: 36, padding: "0 10px", border: "1px solid var(--nu-border)", borderRadius: 4, fontSize: "0.84rem" }}
                />
                <button type="submit" className="nu-btn nu-btn-primary" style={{ width: "100%" }}>
                  <Download size={16} /> Download Full Textbook (.pdf)
                </button>
              </form>
              {downloadedMsg && (
                <small style={{ display: "block", marginTop: 8, color: "var(--nu-success)" }}>{downloadedMsg}</small>
              )}

              {offlineSupported() && (
                <>
                  <button
                    type="button"
                    onClick={handleSaveOffline}
                    disabled={offlineState === "saving"}
                    className={`nu-btn ${offlineState === "saved" ? "nu-btn-outline" : "nu-btn-purple-outline"}`}
                    style={{ width: "100%", fontSize: "0.82rem" }}
                  >
                    {offlineState === "saved" ? (
                      <>
                        <Check size={15} /> Saved for offline
                        <Trash2 size={14} style={{ marginLeft: 6, opacity: 0.7 }} />
                      </>
                    ) : offlineState === "saving" ? (
                      <>Saving for offline...</>
                    ) : (
                      <>
                        <CloudDownload size={15} /> Save for offline reading
                      </>
                    )}
                  </button>
                  {offlineMsg && (
                    <small
                      style={{
                        display: "block",
                        fontSize: "0.74rem",
                        color: offlineState === "error" ? "var(--nu-danger)" : "var(--nu-ink-muted)"
                      }}
                    >
                      {offlineMsg}
                    </small>
                  )}
                </>
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
        <div className="nu-container" style={{ maxWidth: 1180 }}>
          {(() => {
            const allChapters = ebook.chapters || [];
            const isStructuredBook = Boolean(ebook.importedFromInfoBooks || ebook.hasFullBookData);
            const currentIdx = Math.max(0, allChapters.findIndex((c) => c.chapterNumber === activeChapterNum));
            const currentChapter = allChapters[currentIdx] || allChapters[0];
            const visibleChapters = viewAllChapters || allChapters.length <= 1 ? allChapters : currentChapter ? [currentChapter] : [];
            const prevChapter = currentIdx > 0 ? allChapters[currentIdx - 1] : null;
            const nextChapter = currentIdx < allChapters.length - 1 ? allChapters[currentIdx + 1] : null;

            const selectChapter = (num, secIdx = null) => {
              setActiveChapterNum(num);
              if (secIdx !== null) {
                setTimeout(() => {
                  const target = document.getElementById(`ch-${num}-sec-${secIdx}`);
                  if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
                }, 40);
              } else {
                const bodyTop = document.getElementById("ebook-reader-top");
                if (bodyTop) bodyTop.scrollIntoView({ behavior: "smooth", block: "start" });
              }
            };

            return (
              <div
                className="nu-notes-two-col"
                style={{ display: "grid", gridTemplateColumns: "300px minmax(0, 1fr)", gap: 28, alignItems: "start" }}
              >
                {/* Sticky Side Table of Contents (All Chapters + Active Chapter Sections) */}
                <aside
                  className="nu-no-print"
                  style={{
                    position: "sticky",
                    top: 78,
                    maxHeight: "calc(100vh - 96px)",
                    background: "#ffffff",
                    border: "1px solid var(--nu-border)",
                    borderRadius: 10,
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden"
                  }}
                >
                  <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--nu-border-light)", background: "#faf5ff" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontWeight: 800, fontSize: "0.9rem", color: "var(--nu-ink)" }}>
                        <List size={16} color="var(--nu-purple)" /> Table of Contents
                      </span>
                      {allChapters.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setViewAllChapters((v) => !v)}
                          style={{
                            border: "1px solid var(--nu-border)",
                            background: viewAllChapters ? "var(--nu-purple)" : "#ffffff",
                            color: viewAllChapters ? "#ffffff" : "var(--nu-ink)",
                            fontSize: "0.72rem",
                            fontWeight: 700,
                            padding: "3px 8px",
                            borderRadius: 999,
                            cursor: "pointer"
                          }}
                        >
                          {viewAllChapters ? "Single Ch." : "View All"}
                        </button>
                      )}
                    </div>
                    <div style={{ fontSize: "0.76rem", color: "var(--nu-ink-muted)", marginTop: 4 }}>
                      {allChapters.length} chapters · {(ebook.totalWords || 0).toLocaleString()} words
                    </div>
                  </div>

                  <nav aria-label="Book chapters and sections" style={{ overflowY: "auto", padding: "8px 6px", flex: 1 }}>
                    {allChapters.map((ch) => {
                      const isActive = !viewAllChapters && currentChapter?.chapterNumber === ch.chapterNumber;
                      const secList = ch.sections || [];
                      return (
                        <div key={ch.slug || ch.chapterNumber} style={{ marginBottom: 4 }}>
                          <button
                            type="button"
                            className={`nu-ebook-toc-item ${isActive ? "is-active" : ""}`}
                            onClick={() => {
                              if (viewAllChapters) {
                                const el = document.getElementById(`ch-${ch.chapterNumber}`);
                                if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                              } else {
                                selectChapter(ch.chapterNumber);
                              }
                            }}
                          >
                            <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--nu-purple-text)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                              Chapter {ch.chapterNumber}{ch.pageRange ? ` · ${ch.pageRange}` : ""}
                            </div>
                            <div style={{ fontSize: "0.83rem", fontWeight: isActive ? 700 : 600, lineHeight: 1.35, marginTop: 2 }}>
                              {ch.title}
                            </div>
                          </button>

                          {(isActive || viewAllChapters) && secList.length > 0 && (
                            <ul style={{ listStyle: "none", margin: "4px 0 6px 14px", paddingLeft: 10, borderLeft: "1px solid var(--nu-border-light)", display: "grid", gap: 3 }}>
                              {secList.map((sec, sIdx) => (
                                <li key={sIdx}>
                                  <a
                                    href={`#ch-${ch.chapterNumber}-sec-${sIdx}`}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      if (!viewAllChapters) {
                                        selectChapter(ch.chapterNumber, sIdx);
                                      } else {
                                        const el = document.getElementById(`ch-${ch.chapterNumber}-sec-${sIdx}`);
                                        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                                      }
                                    }}
                                    style={{ display: "block", fontSize: "0.76rem", color: "var(--nu-ink-muted)", padding: "3px 6px", borderRadius: 4, textDecoration: "none", lineHeight: 1.3 }}
                                  >
                                    {sec.title}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      );
                    })}

                    {(ebook.references || []).length > 0 && (
                      <a
                        href="#ebook-bibliography"
                        style={{
                          display: "block",
                          margin: "8px 6px 4px",
                          padding: "8px 10px",
                          borderTop: "1px solid var(--nu-border-light)",
                          fontSize: "0.8rem",
                          fontWeight: 700,
                          color: "var(--nu-purple-text)"
                        }}
                      >
                        Master References ({(ebook.references || []).length})
                      </a>
                    )}
                  </nav>
                </aside>

                {/* Main Book Content Column */}
                <div id="ebook-reader-top" style={{ minWidth: 0 }}>
                  <div style={{ borderBottom: "2px solid var(--nu-ink)", paddingBottom: 16, marginBottom: 22 }}>
                    <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--nu-purple-text)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                      {ebook.category || "Nursing Study Textbook"}
                    </div>
                    <h2 style={{ fontFamily: "var(--nu-font-serif)", fontSize: "1.85rem", margin: "6px 0" }}>{ebook.title}</h2>
                    <p style={{ margin: 0, color: "var(--nu-ink-muted)" }}>{ebook.subtitle}</p>
                  </div>

                  <AdSlot slot="ebook-reader-top" />

                  {/* Attributed Figures from Book (if any) */}
                  {Array.isArray(ebook.figures) && ebook.figures.length > 0 && (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14, marginBottom: 28 }}>
                      {ebook.figures.map((fig) => (
                        <figure key={fig.src} style={{ margin: 0, background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 8, overflow: "hidden", padding: 10 }}>
                          <MedicalImageFrame
                            src={fig.src}
                            alt={fig.caption}
                            title={fig.caption}
                            caption={fig.caption}
                            compactBadge
                            imgStyle={{ width: "100%", height: 180, objectFit: "contain", display: "block" }}
                          />
                          <figcaption style={{ marginTop: 8, fontSize: "0.78rem", color: "#475569", textAlign: "center" }}>{fig.caption}</figcaption>
                        </figure>
                      ))}
                    </div>
                  )}

                  {/* Chapters | Clean Narrative Content (No auto-injected tables for full textbooks) */}
                  {visibleChapters.map((ch) => (
                    <article key={ch.slug || ch.chapterNumber} id={`ch-${ch.chapterNumber}`} style={{ marginBottom: 40 }}>
                      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10, fontSize: "0.78rem", fontWeight: 700, color: "var(--nu-purple-text)", textTransform: "uppercase" }}>
                        <span>Chapter {ch.chapterNumber} of {allChapters.length}</span>
                        {ch.pageRange && <span style={{ color: "var(--nu-ink-muted)" }}>· {ch.pageRange}</span>}
                        {ch.wordCount > 0 && <span style={{ color: "var(--nu-ink-muted)" }}>· ~{ch.wordCount.toLocaleString()} words</span>}
                      </div>
                      <h2 style={{ fontFamily: "var(--nu-font-serif)", fontSize: "1.65rem", margin: "6px 0 12px" }}>
                        {ch.title}
                      </h2>

                      {!isStructuredBook && <TopicVisuals lesson={ch} topicTitle={ch.title} />}
                      <LessonSections
                        sections={ch.sections || []}
                        lesson={ch}
                        topicTitle={ch.title}
                        headingTag="h3"
                        disableInlineFigures={isStructuredBook}
                        idPrefix={`ch-${ch.chapterNumber}-sec-`}
                      />

                      {Array.isArray(ch.chapterReferences) && ch.chapterReferences.length > 0 && (
                        <ReferencesBox
                          references={ch.chapterReferences}
                          heading={`Chapter ${ch.chapterNumber} Sources`}
                        />
                      )}
                    </article>
                  ))}

                  {/* Prev / Next Chapter Bar */}
                  {!viewAllChapters && allChapters.length > 1 && (
                    <div
                      className="nu-no-print"
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "space-between",
                        gap: 12,
                        padding: "16px 0 28px",
                        borderTop: "1px solid var(--nu-border-light)"
                      }}
                    >
                      {prevChapter ? (
                        <button
                          type="button"
                          className="nu-btn nu-btn-outline"
                          onClick={() => selectChapter(prevChapter.chapterNumber)}
                        >
                          <ChevronLeft size={16} /> Ch. {prevChapter.chapterNumber}: {prevChapter.title}
                        </button>
                      ) : <span />}
                      {nextChapter && (
                        <button
                          type="button"
                          className="nu-btn nu-btn-primary"
                          onClick={() => selectChapter(nextChapter.chapterNumber)}
                        >
                          Ch. {nextChapter.chapterNumber}: {nextChapter.title} <ChevronRight size={16} />
                        </button>
                      )}
                    </div>
                  )}

                  {/* Master Bibliography */}
                  {(ebook.references || []).length > 0 && (
                    <div id="ebook-bibliography">
                      <ReferencesBox
                        references={ebook.references}
                        heading="Master Book & Guideline Bibliography"
                      />
                    </div>
                  )}

                  <div className="nu-no-print" style={{ marginTop: 32, padding: 24, background: "var(--nu-ink)", color: "#fff", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 16, borderRadius: 10 }}>
                    <div>
                      <h3 style={{ margin: "0 0 4px" }}>Ready to test yourself on this subject?</h3>
                      <p style={{ margin: 0, color: "#cbd5e1", fontSize: "0.9rem" }}>
                        Practice with timed mock exams and explore related study topics.
                      </p>
                    </div>
                    <Link to="/mock-exams" className="nu-btn nu-btn-primary">
                      <Download size={16} /> Try Mock Exams
                    </Link>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </section>
    </main>
  );
}
