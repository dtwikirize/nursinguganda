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
import NursingLoader from "../components/NursingLoader";
import { setPageSeo } from "../components/RouteSeo";

function CountryFlag({ code, width = 30 }) {
  const height = Math.round((width * 2) / 3);
  const common = {
    width,
    height,
    viewBox: "0 0 30 20",
    role: "img",
    "aria-label": `${code} flag`,
    style: {
      display: "inline-block",
      verticalAlign: "middle",
      borderRadius: 4,
      border: "1px solid #cbd5e1",
      flexShrink: 0,
      boxShadow: "0 1px 2px rgba(15,23,42,0.08)"
    }
  };

  const c = String(code || "").toUpperCase();
  if (c === "UG") {
    return (
      <svg {...common}>
        <rect y="0" width="30" height="3.34" fill="#000000" />
        <rect y="3.33" width="30" height="3.34" fill="#FCDC04" />
        <rect y="6.66" width="30" height="3.34" fill="#D90000" />
        <rect y="10" width="30" height="3.34" fill="#000000" />
        <rect y="13.33" width="30" height="3.34" fill="#FCDC04" />
        <rect y="16.66" width="30" height="3.34" fill="#D90000" />
        <circle cx="15" cy="10" r="3.4" fill="#FFFFFF" />
        <circle cx="15" cy="9.2" r="1.2" fill="#0F172A" />
        <path d="M14.3 10.2 L16.1 10.8 L14.4 12.2 Z" fill="#D90000" />
      </svg>
    );
  }
  if (c === "KE") {
    return (
      <svg {...common}>
        <rect y="0" width="30" height="6" fill="#000000" />
        <rect y="6" width="30" height="1" fill="#FFFFFF" />
        <rect y="7" width="30" height="6" fill="#BB0000" />
        <rect y="13" width="30" height="1" fill="#FFFFFF" />
        <rect y="14" width="30" height="6" fill="#006600" />
        <path d="M11 4 L19 16 M19 4 L11 16" stroke="#FFFFFF" strokeWidth="1" />
        <ellipse cx="15" cy="10" rx="2.7" ry="4.5" fill="#BB0000" stroke="#FFFFFF" strokeWidth="0.7" />
        <line x1="15" y1="6.2" x2="15" y2="13.8" stroke="#000000" strokeWidth="0.9" />
      </svg>
    );
  }
  if (c === "TZ") {
    return (
      <svg {...common}>
        <polygon points="0,0 30,0 0,20" fill="#1EB53A" />
        <polygon points="30,0 30,20 0,20" fill="#00A3DD" />
        <path d="M-2,21 L32,-1" stroke="#FCD116" strokeWidth="6" />
        <path d="M-2,21 L32,-1" stroke="#000000" strokeWidth="4" />
      </svg>
    );
  }
  if (c === "UK" || c === "GB") {
    return (
      <svg {...common}>
        <rect width="30" height="20" fill="#012169" />
        <path d="M0,0 L30,20 M30,0 L0,20" stroke="#FFFFFF" strokeWidth="3.6" />
        <path d="M0,0 L30,20 M30,0 L0,20" stroke="#C8102E" strokeWidth="1.6" />
        <path d="M15,0 V20 M0,10 H30" stroke="#FFFFFF" strokeWidth="5.4" />
        <path d="M15,0 V20 M0,10 H30" stroke="#C8102E" strokeWidth="3.2" />
      </svg>
    );
  }
  if (c === "US") {
    return (
      <svg {...common}>
        <rect width="30" height="20" fill="#FFFFFF" />
        {[0, 3.08, 6.16, 9.24, 12.32, 15.4, 18.48].map((y, i) => (
          <rect key={i} y={y} width="30" height="1.54" fill="#B22234" />
        ))}
        <rect width="13.5" height="10.7" fill="#3C3B6E" />
        {[2.4, 5.4, 8.4].map((cy, r) =>
          [2.5, 5.5, 8.5, 11].map((cx, k) => (
            <circle key={`${r}-${k}`} cx={cx} cy={cy} r="0.65" fill="#FFFFFF" />
          ))
        )}
      </svg>
    );
  }
  if (c === "CA") {
    return (
      <svg {...common}>
        <rect x="0" width="7.5" height="20" fill="#D80621" />
        <rect x="7.5" width="15" height="20" fill="#FFFFFF" />
        <rect x="22.5" width="7.5" height="20" fill="#D80621" />
        <path
          d="M15 4 L16 6.8 L18.5 6.4 L17.3 9 L19.4 10 L18.7 11.4 L15.7 11.1 L15.7 15.2 L14.3 15.2 L14.3 11.1 L11.3 11.4 L10.6 10 L12.7 9 L11.5 6.4 L14 6.8 Z"
          fill="#D80621"
        />
      </svg>
    );
  }
  if (c === "AU") {
    return (
      <svg {...common}>
        <rect width="30" height="20" fill="#00008B" />
        <rect width="14" height="10" fill="#012169" />
        <path d="M0,0 L14,10 M14,0 L0,10" stroke="#FFFFFF" strokeWidth="1.8" />
        <path d="M0,0 L14,10 M14,0 L0,10" stroke="#C8102E" strokeWidth="0.9" />
        <path d="M7,0 V10 M0,5 H14" stroke="#FFFFFF" strokeWidth="2.8" />
        <path d="M7,0 V10 M0,5 H14" stroke="#C8102E" strokeWidth="1.6" />
        <circle cx="7" cy="14.8" r="1.7" fill="#FFFFFF" />
        <circle cx="22.5" cy="4.2" r="1" fill="#FFFFFF" />
        <circle cx="26" cy="8.4" r="0.9" fill="#FFFFFF" />
        <circle cx="22.5" cy="14.5" r="1" fill="#FFFFFF" />
        <circle cx="19" cy="9.2" r="0.9" fill="#FFFFFF" />
      </svg>
    );
  }
  if (c === "AE") {
    return (
      <svg {...common}>
        <rect x="0" width="8" height="20" fill="#FF0000" />
        <rect x="8" y="0" width="22" height="6.67" fill="#00732F" />
        <rect x="8" y="6.67" width="22" height="6.67" fill="#FFFFFF" />
        <rect x="8" y="13.34" width="22" height="6.66" fill="#000000" />
      </svg>
    );
  }
  return <Globe2 size={18} />;
}

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
        <div className="nu-container">
          <NursingLoader label="Loading Global Nursing Licensure Guides..." />
        </div>
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
          <h1 style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            {activeCountry && <CountryFlag code={activeCountry.flag} width={42} />}
            <span>
              {activeCountry
                ? `Becoming a Registered Nurse in ${activeCountry.country}`
                : "Becoming a Nurse in Different Countries — Global Licensure Hub"}
            </span>
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
                      <span className="nu-badge nu-badge-free" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                        <CountryFlag code={c.flag} width={20} /> {c.region} &middot; {c.flag}
                      </span>
                      <span style={{ fontSize: "0.78rem", color: "#0F2942", fontWeight: 700 }}>{c.unitSystem.split("(")[0].trim()}</span>
                    </div>
                    <h2 style={{ margin: 0, fontSize: "1.18rem", color: "#0F2942", display: "flex", alignItems: "center", gap: 10 }}>
                      <CountryFlag code={c.flag} width={28} />
                      <span>{c.country}</span>
                    </h2>
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
