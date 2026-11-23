import React, { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Filter, Search } from "lucide-react";
import CourseCard from "../components/CourseCard";
import { useApp } from "../context/AppContext";

export default function CoursesCatalogPage() {
  const { catalog, catalogLoading } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialProg = searchParams.get("programme") || "all";
  const initialCat = searchParams.get("category") || "all";
  const initialQ = searchParams.get("q") || "";

  const [programme, setProgramme] = useState(initialProg);
  const [category, setCategory] = useState(initialCat);
  const [priceFilter, setPriceFilter] = useState("all");
  const [q, setQ] = useState(initialQ);

  const courses = catalog?.courses || [];
  const programmes = catalog?.programmes || [];
  const categories = catalog?.categories || [];

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return courses.filter((c) => {
      if (programme !== "all" && c.programmeId !== programme) return false;
      if (category !== "all" && c.category !== category) return false;
      if (priceFilter === "free" && !c.isFree) return false;
      if (priceFilter === "paid" && c.isFree) return false;
      if (query) {
        const hay = `${c.title} ${c.code} ${c.programmeLabel} ${c.category}`.toLowerCase();
        if (!hay.includes(query)) return false;
      }
      return true;
    });
  }, [courses, programme, category, priceFilter, q]);

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
            {courses.length} structured course units across {programmes.length} Ugandan nursing &amp; midwifery programmes.
          </p>
        </div>

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

        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, color: "var(--nu-ink-muted)", fontSize: "0.9rem" }}>
          <Filter size={15} />
          <span>Showing <strong>{filtered.length}</strong> course units</span>
        </div>

        {catalogLoading ? (
          <p>Loading catalog...</p>
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
