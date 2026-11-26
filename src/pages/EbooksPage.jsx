import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Download, Search } from "lucide-react";
import AdSlot from "../components/AdSlot";
import EbookCover from "../components/EbookCover";
import NursingLoader from "../components/NursingLoader";

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

  const categories = useMemo(() => {
    const counts = new Map();
    for (const e of ebooks) {
      counts.set(e.category, (counts.get(e.category) || 0) + 1);
    }
    return [{ name: "All", count: ebooks.length }, ...Array.from(counts.entries()).map(([name, count]) => ({ name, count }))];
  }, [ebooks]);

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
          <span className="nu-badge nu-badge-free" style={{ marginBottom: 12 }}>100% Free Reference Library ({ebooks.length} Books)</span>
          <h1>Free Referenced Nursing &amp; Medical eBooks</h1>
          <p className="nu-cl-subtitle" style={{ maxWidth: 740 }}>
            High-yield revision eBooks, open clinical textbooks, and WHO/MSF guidelines organized by specialty. All books are 100% free to read online or print to PDF | zero books are sold.
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
                  key={cat.name}
                  type="button"
                  onClick={() => setCategory(cat.name)}
                  className={`nu-btn ${category === cat.name ? "nu-btn-dark" : "nu-btn-outline"}`}
                  style={{ height: 38, fontSize: "0.82rem" }}
                >
                  {cat.name} ({cat.count})
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <NursingLoader label="Loading Free Referenced Study eBooks..." />
          ) : (
            <div className="nu-ebook-grid">
              {filtered.map((eb) => (
                <article key={eb.slug} className="nu-ebook-card">
                  <Link to={`/ebooks/${eb.slug}`} className="nu-ebook-cover-link">
                    <EbookCover ebook={eb} />
                  </Link>
                  <div className="nu-ebook-body" style={{ padding: "12px 14px", gap: 10 }}>
                    <h2 style={{ fontSize: "0.98rem", margin: 0, lineHeight: 1.35, flex: 1 }}>
                      <Link to={`/ebooks/${eb.slug}`}>{eb.title}</Link>
                    </h2>
                    <Link
                      to={`/ebooks/${eb.slug}`}
                      className="nu-btn nu-btn-primary"
                      style={{ width: "100%", marginTop: "auto" }}
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
