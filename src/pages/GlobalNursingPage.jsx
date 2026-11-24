import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  ExternalLink,
  FileCheck2,
  Globe2,
  Languages,
  MapPin,
  ShieldCheck
} from "lucide-react";
import AdSlot from "../components/AdSlot";
import { setPageSeo } from "../components/RouteSeo";

export default function GlobalNursingPage() {
  const { countrySlug } = useParams();
  const [data, setData] = useState(null);
  const [regionFilter, setRegionFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/assets/data/global-nursing.json")
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData({ countries: [] }))
      .finally(() => setLoading(false));
  }, []);

  const countries = data?.countries || [];
  const activeCountry = useMemo(
    () => (countrySlug ? countries.find((c) => c.slug === countrySlug) || null : null),
    [countries, countrySlug]
  );

  useEffect(() => {
    if (activeCountry) {
      setPageSeo({
        title: `Becoming a Nurse in ${activeCountry.country} (${activeCountry.council}) | Nursing Uganda`,
        description: activeCountry.summary,
        canonicalPath: `/global-nursing/${activeCountry.slug}`,
        type: "article",
        schema: {
          "@type": "Article",
          headline: `How to Become a Registered Nurse in ${activeCountry.country}`,
          description: activeCountry.summary,
          author: { "@type": "Organization", name: "Nursing Uganda" },
          url: `https://nursinguganda.com/global-nursing/${activeCountry.slug}`
        }
      });
    } else if (!countrySlug) {
      setPageSeo({
        title: "Becoming a Nurse in Different Countries (Uganda, UK, USA, Kenya, Canada, Gulf) | Nursing Uganda",
        description:
          "Compare nursing licensure requirements, exams (UNMEB/UHPAB, NCK, TNMC, NMC CBT/OSCE, NCLEX-RN, Prometric), English scores & verification portals across 8 countries.",
        canonicalPath: "/global-nursing"
      });
    }
  }, [activeCountry, countrySlug]);

  const regions = useMemo(
    () => ["All", ...new Set(countries.map((c) => c.region))],
    [countries]
  );

  const visibleCountries = useMemo(
    () => (regionFilter === "All" ? countries : countries.filter((c) => c.region === regionFilter)),
    [countries, regionFilter]
  );

  if (loading) {
    return (
      <main className="nu-section">
        <div className="nu-container"><p>Loading Global Nursing Licensure Guides...</p></div>
      </main>
    );
  }

  return (
    <main style={{ background: "#f8fafc" }}>
      <section className="nu-cl-hero">
        <div className="nu-container">
          <span className="nu-badge nu-badge-free" style={{ marginBottom: 10 }}>
            <Globe2 size={13} style={{ display: "inline", marginRight: 5 }} /> International Nursing Pathways · 8 Countries
          </span>
          <h1>
            {activeCountry
              ? `Becoming a Registered Nurse in ${activeCountry.country}`
              : "Becoming a Nurse in Different Countries — Global Licensure Hub"}
          </h1>
          <p className="nu-cl-subtitle" style={{ maxWidth: 780 }}>
            {activeCountry
              ? activeCountry.summary
              : "Step-by-step nursing & midwifery registration roadmaps for Ugandan nurses planning international practice and global students studying Uganda, East Africa, UK NMC, NCLEX-RN, Canada, Australia & Gulf standards."}
          </p>
        </div>
      </section>

      <section className="nu-section">
        <div className="nu-container">
          {data?.disclaimer && (
            <div style={{ padding: "12px 16px", borderRadius: 10, background: "#F0F5FA", border: "1px solid #94B3D1", color: "#0F2942", fontSize: "0.85rem", marginBottom: 22 }}>
              <ShieldCheck size={15} style={{ display: "inline", marginRight: 6, verticalAlign: "text-bottom" }} />
              {data.disclaimer}
            </div>
          )}

          {activeCountry ? (
            <div style={{ maxWidth: 900, margin: "0 auto" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 20 }}>
                <Link to="/global-nursing" className="nu-btn nu-btn-outline">
                  <ArrowLeft size={15} /> All 8 Country Guides
                </Link>
                <a
                  href={activeCountry.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nu-btn nu-btn-primary"
                >
                  Official Portal: {activeCountry.council.split("(")[0].trim()} <ExternalLink size={14} />
                </a>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14, marginBottom: 24 }}>
                <div style={{ background: "#fff", border: "1px solid var(--nu-border)", borderRadius: 10, padding: 16 }}>
                  <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Regulatory Council</div>
                  <strong style={{ display: "block", marginTop: 4, color: "#0F2942" }}>{activeCountry.council}</strong>
                </div>
                <div style={{ background: "#fff", border: "1px solid var(--nu-border)", borderRadius: 10, padding: 16 }}>
                  <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Qualifying Exam</div>
                  <strong style={{ display: "block", marginTop: 4, color: "#0F2942" }}>{activeCountry.examRequired}</strong>
                </div>
                <div style={{ background: "#fff", border: "1px solid var(--nu-border)", borderRadius: 10, padding: 16 }}>
                  <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Language Standard</div>
                  <strong style={{ display: "block", marginTop: 4, color: "#0F2942" }}>{activeCountry.languageTest}</strong>
                </div>
                <div style={{ background: "#fff", border: "1px solid var(--nu-border)", borderRadius: 10, padding: 16 }}>
                  <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Lab Units &amp; Timeline</div>
                  <strong style={{ display: "block", marginTop: 4, color: "#0F2942" }}>{activeCountry.unitSystem} · {activeCountry.timeline}</strong>
                </div>
              </div>

              <div style={{ background: "#fff", border: "1px solid var(--nu-border)", borderRadius: 12, padding: 24, marginBottom: 20 }}>
                <h2 style={{ marginTop: 0, color: "#0F2942", display: "flex", alignItems: "center", gap: 8 }}>
                  <MapPin size={18} color="#a137f2" /> Step-by-Step Registration Roadmap
                </h2>
                <ol style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 10, lineHeight: 1.65 }}>
                  {(activeCountry.steps || []).map((st, idx) => (
                    <li key={idx} style={{ color: "#1e293b" }}>{st}</li>
                  ))}
                </ol>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))", gap: 20, marginBottom: 28 }}>
                <div style={{ background: "#fff", border: "1px solid var(--nu-border)", borderRadius: 12, padding: 22 }}>
                  <h3 style={{ marginTop: 0, color: "#0F2942", display: "flex", alignItems: "center", gap: 8 }}>
                    <FileCheck2 size={17} color="#15803d" /> Required Document Checklist
                  </h3>
                  <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 8, lineHeight: 1.55 }}>
                    {(activeCountry.documents || []).map((doc, i) => (
                      <li key={i} style={{ color: "#334155" }}>{doc}</li>
                    ))}
                  </ul>
                </div>

                <div style={{ background: "#F0F5FA", border: "1px solid #94B3D1", borderRadius: 12, padding: 22 }}>
                  <h3 style={{ marginTop: 0, color: "#0F2942", display: "flex", alignItems: "center", gap: 8 }}>
                    <ClipboardList size={17} color="#0F2942" /> Study Here to Prepare
                  </h3>
                  <div style={{ display: "grid", gap: 10 }}>
                    {(activeCountry.recommendedHubs || []).map((h) => (
                      <Link
                        key={h.to + h.label}
                        to={h.to}
                        className="nu-btn nu-btn-outline"
                        style={{ justifyContent: "space-between", background: "#fff", borderColor: "#94B3D1", color: "#0F2942" }}
                      >
                        <span>{h.label}</span>
                        <ArrowRight size={15} />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 22 }}>
                {regions.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRegionFilter(r)}
                    className={`nu-btn ${regionFilter === r ? "nu-btn-dark" : "nu-btn-outline"}`}
                    style={{ height: 36, fontSize: "0.84rem" }}
                  >
                    {r}
                  </button>
                ))}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20, marginBottom: 28 }}>
                {visibleCountries.map((c) => (
                  <article
                    key={c.slug}
                    style={{
                      border: "1px solid var(--nu-border)",
                      borderRadius: 12,
                      padding: 22,
                      background: "#fff",
                      display: "flex",
                      flexDirection: "column",
                      gap: 10
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                      <span className="nu-badge nu-badge-free">{c.region} · {c.flag}</span>
                      <span style={{ fontSize: "0.78rem", color: "#0F2942", fontWeight: 700 }}>{c.unitSystem.split("(")[0].trim()}</span>
                    </div>
                    <h2 style={{ margin: 0, fontSize: "1.18rem", color: "#0F2942" }}>{c.country}</h2>
                    <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#6d28d9" }}>{c.council}</div>
                    <p style={{ margin: 0, fontSize: "0.86rem", color: "var(--nu-ink-muted)", flex: 1 }}>{c.summary}</p>
                    <div style={{ fontSize: "0.8rem", color: "#334155", background: "#f8fafc", padding: "8px 10px", borderRadius: 6 }}>
                      <div><strong>Exam:</strong> {c.examRequired}</div>
                      <div style={{ marginTop: 3 }}><Languages size={12} style={{ display: "inline", marginRight: 4 }} /><strong>English:</strong> {c.languageTest}</div>
                    </div>
                    <Link
                      to={`/global-nursing/${c.slug}`}
                      className="nu-btn nu-btn-primary"
                      style={{ width: "100%", marginTop: 4 }}
                    >
                      <CheckCircle2 size={15} /> View Complete {c.country} Roadmap
                    </Link>
                  </article>
                ))}
              </div>
            </>
          )}

          <AdSlot slot="global-nursing-bottom" />
        </div>
      </section>
    </main>
  );
}
