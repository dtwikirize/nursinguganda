import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BookMarked, BookOpen, Download, Search } from "lucide-react";
import AdSlot from "../components/AdSlot";
import EbookCover from "../components/EbookCover";

export default function EbooksPage() {
  const [ebooks, setEbooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [q, setQ] = useState("");

  useEffect(() => {
    fetch("/assets/data/ebooks.json")
      .then((r) => r.json())
      .then((d) => setEbooks(d.ebooks || []))
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(
    () => ["All", ...new Set(ebooks.map((e) => e.category))],
    [ebooks]
  );

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return ebooks.filter((eb) => {
      if (category !== "All" && eb.category !== category) return false;
      if (query && !`${eb.title} ${eb.subtitle} ${eb.category}`.toLowerCase().includes(query)) return false;
      return true;
    });
  }, [ebooks, category, q]);

  return (
    <main>
      <section className="nu-cl-hero">
        <div className="nu-container">
          <span className="nu-badge nu-badge-free" style={{ marginBottom: 12 }}>100% Free Study Guides</span>
          <h1>Free Referenced Nursing &amp; Midwifery eBooks</h1>
          <p className="nu-cl-subtitle" style={{ maxWidth: 740 }}>
            High-yield revision eBooks compiled from the official Ugandan syllabus and backed by WHO, Ministry of Health Uganda Clinical Guidelines, Open RN, and standard nursing textbooks. Read online or save as a clean PDF.
          </p>
        </div>
      </section>

      <section className="nu-section">
        <div className="nu-container">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 24, alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, border: "1px solid var(--nu-border)", padding: "0 12px", height: 42, flex: "1 1 260px", maxWidth: 400 }}>
              <Search size={16} color="#6a6f73" />
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search eBooks by topic..."
                style={{ border: 0, outline: "none", width: "100%" }}
              />
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`nu-btn ${category === cat ? "nu-btn-dark" : "nu-btn-outline"}`}
                  style={{ height: 38, fontSize: "0.82rem" }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <p>Loading Free Referenced eBooks...</p>
          ) : (
            <div className="nu-ebook-grid">
              {filtered.map((eb) => (
                <article key={eb.slug} className="nu-ebook-card">
                  <Link to={`/ebooks/${eb.slug}`} className="nu-ebook-cover-link">
                    <EbookCover ebook={eb} />
                  </Link>
                  <div className="nu-ebook-body">
                    <span className="nu-badge nu-badge-free">{eb.category}</span>
                    <h2 style={{ fontSize: "1.02rem", margin: "4px 0 0", lineHeight: 1.35 }}>
                      <Link to={`/ebooks/${eb.slug}`}>{eb.title}</Link>
                    </h2>
                    <p style={{ margin: 0, fontSize: "0.84rem", color: "var(--nu-ink-muted)", flex: 1 }}>
                      {eb.subtitle}
                    </p>
                    <div style={{ display: "flex", gap: 12, fontSize: "0.78rem", color: "var(--nu-ink-muted)", marginTop: 6 }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                        <BookOpen size={13} /> {eb.chapters.length} chapters (~{eb.estimatedPages} pp.)
                      </span>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                        <BookMarked size={13} /> {eb.references.length} refs
                      </span>
                    </div>
                    <Link
                      to={`/ebooks/${eb.slug}`}
                      className="nu-btn nu-btn-primary"
                      style={{ width: "100%", marginTop: 8 }}
                    >
                      <Download size={15} /> Read &amp; Download Free
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}

          <AdSlot slot="ebooks-hub-bottom" />
        </div>
      </section>
    </main>
  );
}
