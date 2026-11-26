import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Images,
  Layers,
  Search,
  Sparkles,
  X
} from "lucide-react";
import AdSlot from "../components/AdSlot";
import MedicalImageFrame from "../components/MedicalImageFrame";
import NursingLoader from "../components/NursingLoader";
import ReferencesBox from "../components/ReferencesBox";
import { setPageSeo } from "../components/RouteSeo";

const IMAGE_ATLAS_REFS = [
  {
    id: "openstax-ap-2e",
    citation: "Betts JG, Young KA, Wise JA, et al. Anatomy and Physiology 2e. Houston (TX): OpenStax; 2022.",
    type: "Open-Access Anatomy Textbook",
    url: "https://openstax.org/details/books/anatomy-and-physiology-2e"
  },
  {
    id: "blausen-medical",
    citation: "Blausen Medical Communications. Medical Gallery of Blausen Medical 2014. WikiJournal of Medicine. 2014;1(2).",
    type: "Peer-Reviewed Clinical Illustrations",
    url: "https://en.wikiversity.org/wiki/WikiJournal_of_Medicine/Medical_gallery_of_Blausen_Medical_2014"
  },
  {
    id: "uganda-moh-ucg",
    citation: "Ministry of Health Uganda. Uganda Clinical Guidelines 2023: National Guidelines for Management of Common Conditions. Kampala: MoH; 2023.",
    type: "National Clinical Guideline",
    url: "https://www.health.go.ug/"
  }
];

function imgUrlWithVersion(src) {
  const s = String(src || "");
  if (!s) return "";
  return s.includes("?") ? s : `${s}?v=20261126f`;
}

export default function MedicalImagesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCat = searchParams.get("cat") || "All";
  const initialQ = searchParams.get("q") || "";
  const initialId = searchParams.get("img") || "";

  const [data, setData] = useState(null);
  const [q, setQ] = useState(initialQ);
  const [cat, setCat] = useState(initialCat);
  const [selected, setSelected] = useState(null);
  const inspectorRef = useRef(null);

  useEffect(() => {
    fetch("/assets/data/medical-images.json")
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        if (initialId && Array.isArray(d?.images)) {
          const hit = d.images.find((im) => im.id === initialId);
          if (hit) setSelected(hit);
        }
      })
      .catch(() => setData({ categories: [], images: [] }));
  }, [initialId]);

  const images = useMemo(() => data?.images || [], [data]);

  const categoryTabs = useMemo(() => {
    const counts = new Map();
    for (const im of images) {
      counts.set(im.category, (counts.get(im.category) || 0) + 1);
    }
    const ordered = (data?.categories || []).filter((c) => counts.has(c));
    return [
      { name: "All", count: images.length },
      ...ordered.map((name) => ({ name, count: counts.get(name) || 0 }))
    ];
  }, [data, images]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return images.filter((im) => {
      if (cat !== "All" && im.category !== cat) return false;
      if (!query) return true;
      const hay = [
        im.title,
        im.category,
        im.summary,
        im.clinicalPearl,
        ...(im.structures || [])
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(query);
    });
  }, [images, cat, q]);

  useEffect(() => {
    if (!data) return;
    setPageSeo({
      title: selected
        ? `${selected.title} | Medical Image Dictionary | Nursing Uganda`
        : "Medical Images Dictionary & Visual Anatomy Atlas | Nursing Uganda",
      description: selected
        ? selected.summary
        : "Browse categorized high-resolution human anatomy plates, cellular diagrams, and clinical pathology visuals with labeled landmarks and nursing study pearls.",
      canonicalPath: "/medical-images",
      image: selected ? `https://nursinguganda.com${selected.file}` : undefined,
      schema: {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Nursing Uganda Medical Images Dictionary & Visual Atlas",
        url: "https://nursinguganda.com/medical-images",
        numberOfItems: images.length
      }
    });
  }, [data, selected, images.length]);

  const selectPlate = (item) => {
    setSelected(item);
    const next = new URLSearchParams(searchParams);
    next.set("img", item.id);
    setSearchParams(next, { replace: true });
    setTimeout(() => {
      inspectorRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 40);
  };

  const clearSelection = () => {
    setSelected(null);
    const next = new URLSearchParams(searchParams);
    next.delete("img");
    setSearchParams(next, { replace: true });
  };

  if (!data) {
    return (
      <main className="nu-section">
        <div className="nu-container">
          <NursingLoader label="Loading Medical Images Dictionary & Anatomy Plates..." />
        </div>
      </main>
    );
  }

  return (
    <main style={{ background: "#F8FAFC" }}>
      <section className="nu-cl-hero">
        <div className="nu-container">
          <span className="nu-badge nu-badge-free" style={{ marginBottom: 10 }}>
            <Images size={13} style={{ marginRight: 5, verticalAlign: "-2px" }} />
            Visual Anatomy &amp; Clinical Image Dictionary
          </span>
          <h1>Medical Images Dictionary ({images.length} Study Plates)</h1>
          <p className="nu-cl-subtitle" style={{ maxWidth: 760 }}>
            Clean, watermark-protected human anatomy diagrams, cellular biology plates, and clinical condition visuals categorized by body system for fast UNMEB, UHPAB, and NCLEX revision.
          </p>
        </div>
      </section>

      <section className="nu-section" style={{ paddingTop: 28 }}>
        <div className="nu-container">
          {/* Search + Result Counter */}
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 14, marginBottom: 16 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                border: "1px solid #cbd5e1",
                borderRadius: 999,
                background: "#fff",
                padding: "0 16px",
                height: 44,
                flex: "1 1 300px",
                maxWidth: 520,
                boxShadow: "0 2px 6px rgba(15, 23, 42, 0.04)"
              }}
            >
              <Search size={17} color="#6a6f73" />
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search heart, mitosis, nephron, eye, skeleton, blood, placenta..."
                aria-label="Search medical images dictionary"
                style={{ border: 0, outline: "none", width: "100%", fontSize: "0.92rem", background: "transparent" }}
              />
            </div>

            <div style={{ fontSize: "0.88rem", color: "var(--nu-ink-muted)", fontWeight: 600 }}>
              Showing <strong>{filtered.length}</strong> of {images.length} visual plates
              {(q || cat !== "All") && (
                <button
                  type="button"
                  onClick={() => {
                    setQ("");
                    setCat("All");
                  }}
                  style={{
                    marginLeft: 10,
                    background: "none",
                    border: "none",
                    color: "#A137F2",
                    fontWeight: 700,
                    cursor: "pointer",
                    textDecoration: "underline"
                  }}
                >
                  Reset filters
                </button>
              )}
            </div>
          </div>

          {/* Category Pill Filter Bar */}
          <div className="nu-inst-filter-bar" role="group" aria-label="Filter medical images by body system or category">
            {categoryTabs.map((cb) => {
              const isActive = cat === cb.name;
              return (
                <button
                  key={cb.name}
                  type="button"
                  className={`nu-inst-filter-btn ${isActive ? "active" : ""}`}
                  aria-pressed={isActive}
                  onClick={() => {
                    setCat(cb.name);
                    setSelected(null);
                  }}
                >
                  <span>{cb.name === "All" ? "All Categories" : cb.name}</span>
                  <span className="nu-inst-filter-count">{cb.count}</span>
                </button>
              );
            })}
          </div>

          {/* Selected Medical Plate Inspector */}
          {selected && (
            <div ref={inspectorRef} className="nu-inst-detail-panel" style={{ marginBottom: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap", borderBottom: "1px solid #f1f5f9", paddingBottom: 14 }}>
                <div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", marginBottom: 6 }}>
                    <span className="nu-badge nu-badge-highyield">{selected.category}</span>
                    <span className="nu-inst-ipc-tag">
                      <CheckCircle2 size={13} /> 1280×800 Clinical Plate
                    </span>
                  </div>
                  <h2 style={{ margin: 0, fontSize: "1.45rem" }}>{selected.title}</h2>
                </div>
                <button
                  type="button"
                  className="nu-btn nu-btn-outline"
                  style={{ height: 36, padding: "0 12px", fontSize: "0.84rem" }}
                  onClick={clearSelection}
                >
                  <X size={15} /> Close Plate View
                </button>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                  gap: 20,
                  marginTop: 16,
                  alignItems: "start"
                }}
              >
                <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 12, padding: 10 }}>
                  <MedicalImageFrame
                    src={imgUrlWithVersion(selected.file)}
                    alt={selected.alt || selected.title}
                    title={selected.title}
                    caption={selected.category}
                    imgStyle={{ width: "100%", height: "auto", borderRadius: 8, display: "block" }}
                  />
                </div>

                <div style={{ display: "grid", gap: 14, fontSize: "0.94rem" }}>
                  <p style={{ margin: 0, color: "#1e293b", lineHeight: 1.65 }}>{selected.summary}</p>

                  {Array.isArray(selected.structures) && selected.structures.length > 0 && (
                    <div style={{ padding: 14, border: "1px solid #e2e8f0", borderRadius: 10, background: "#fff" }}>
                      <strong style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8, fontSize: "0.88rem" }}>
                        <Layers size={15} color="#7c3aed" /> Key Labeled Landmarks
                      </strong>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {selected.structures.map((st) => (
                          <span
                            key={st}
                            style={{
                              fontSize: "0.8rem",
                              fontWeight: 600,
                              padding: "4px 10px",
                              borderRadius: 999,
                              background: "#f8fafc",
                              border: "1px solid #e2e8f0",
                              color: "#0f172a"
                            }}
                          >
                            {st}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {selected.clinicalPearl && (
                    <div style={{ padding: "12px 14px", background: "#FAF5FF", borderLeft: "4px solid #7c3aed", borderRadius: "0 8px 8px 0" }}>
                      <strong style={{ display: "flex", alignItems: "center", gap: 6, color: "#5b21b6", marginBottom: 4, fontSize: "0.86rem" }}>
                        <Sparkles size={14} /> Nursing &amp; Exam Pearl
                      </strong>
                      <span style={{ color: "#1e293b", fontSize: "0.9rem" }}>{selected.clinicalPearl}</span>
                    </div>
                  )}

                  {Array.isArray(selected.relatedTopics) && selected.relatedTopics.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {selected.relatedTopics.map((rt) => (
                        <Link key={rt.to} to={rt.to} className="nu-btn nu-btn-primary" style={{ height: 38, fontSize: "0.84rem", padding: "0 14px" }}>
                          <BookOpen size={14} /> Study: {rt.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Gallery Grid */}
          {filtered.length === 0 ? (
            <div style={{ padding: 48, textAlign: "center", background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0" }}>
              <h3 style={{ margin: "0 0 8px" }}>No matching medical plates found</h3>
              <p style={{ color: "var(--nu-ink-muted)", marginBottom: 16 }}>
                Try another anatomical structure, system, or clear your category filter.
              </p>
              <button
                type="button"
                className="nu-btn nu-btn-primary"
                onClick={() => {
                  setQ("");
                  setCat("All");
                }}
              >
                Show All {images.length} Medical Images
              </button>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))",
                gap: 18
              }}
            >
              {filtered.map((item) => {
                const isSelected = selected?.id === item.id;
                return (
                  <article
                    key={item.id}
                    style={{
                      background: "#fff",
                      border: isSelected ? "2px solid #7c3aed" : "1px solid #e2e8f0",
                      borderRadius: 12,
                      overflow: "hidden",
                      display: "flex",
                      flexDirection: "column",
                      boxShadow: "0 2px 10px rgba(15, 23, 42, 0.04)"
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => selectPlate(item)}
                      style={{
                        border: 0,
                        padding: 0,
                        background: "#f8fafc",
                        cursor: "pointer",
                        position: "relative",
                        display: "block",
                        width: "100%",
                        aspectRatio: "16 / 10",
                        overflow: "hidden"
                      }}
                      aria-label={`Inspect ${item.title}`}
                    >
                      <MedicalImageFrame
                        src={imgUrlWithVersion(item.file)}
                        alt={item.alt || item.title}
                        title={item.title}
                        allowFocus={false}
                        style={{ width: "100%", height: "100%" }}
                        imgStyle={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                      />
                    </button>

                    <div style={{ padding: 14, display: "flex", flexDirection: "column", flex: 1, gap: 8 }}>
                      <span style={{ fontSize: "0.74rem", fontWeight: 700, color: "#7c3aed", textTransform: "uppercase", letterSpacing: "0.03em" }}>
                        {item.category}
                      </span>
                      <h3 style={{ margin: 0, fontSize: "1.02rem", lineHeight: 1.35, color: "#0f172a" }}>
                        {item.title}
                      </h3>
                      <p style={{ margin: 0, fontSize: "0.85rem", color: "#475569", lineHeight: 1.5, flex: 1 }}>
                        {item.summary}
                      </p>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, paddingTop: 8, borderTop: "1px solid #f1f5f9" }}>
                        <button
                          type="button"
                          onClick={() => selectPlate(item)}
                          style={{
                            background: "none",
                            border: "none",
                            padding: 0,
                            color: "#7c3aed",
                            fontWeight: 700,
                            fontSize: "0.84rem",
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4
                          }}
                        >
                          Inspect Plate &amp; Landmarks <ArrowRight size={13} />
                        </button>
                        {item.relatedTopics?.[0] && (
                          <Link
                            to={item.relatedTopics[0].to}
                            style={{ fontSize: "0.8rem", fontWeight: 600, color: "#0f172a", textDecoration: "underline" }}
                          >
                            Read Lesson
                          </Link>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          <AdSlot slot="medical-images-bottom" />
          <ReferencesBox references={IMAGE_ATLAS_REFS} heading="Medical Illustration &amp; Anatomy References" />
        </div>
      </section>
    </main>
  );
}
