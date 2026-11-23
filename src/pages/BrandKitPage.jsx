import React, { useEffect, useState } from "react";
import { Check, Sparkles } from "lucide-react";
import v1Svg from "../../assets/images/brand/nu-variant-1.svg";
import v1Png32 from "../../assets/images/brand/nu-variant-1-32.png";
import v1Png192 from "../../assets/images/brand/nu-variant-1-192.png";
import v2Svg from "../../assets/images/brand/nu-variant-2.svg";
import v2Png32 from "../../assets/images/brand/nu-variant-2-32.png";
import v2Png192 from "../../assets/images/brand/nu-variant-2-192.png";
import v3Svg from "../../assets/images/brand/nu-variant-3.svg";
import v3Png32 from "../../assets/images/brand/nu-variant-3-32.png";
import v3Png192 from "../../assets/images/brand/nu-variant-3-192.png";
import v4Svg from "../../assets/images/brand/nu-variant-4.svg";
import v4Png32 from "../../assets/images/brand/nu-variant-4-32.png";
import v4Png192 from "../../assets/images/brand/nu-variant-4-192.png";

const VARIANTS = [
  {
    id: 1,
    name: "Variant 1 — Shared-Stem Ligature",
    tagline: "Continuous sculpted NU ribbon sharing one central spine across the Charcoal & Purple split.",
    bestFor: "Primary App Icon, Favicon & Header Mark",
    svg: v1Svg,
    png32: v1Png32,
    png192: v1Png192
  },
  {
    id: 2,
    name: "Variant 2 — Diagonal Slash Split",
    tagline: "Dynamic 18° architectural angle separating Charcoal and Royal Purple right between N and U.",
    bestFor: "Modern SaaS Header, Hero & Certificates",
    svg: v2Svg,
    png32: v2Png32,
    png192: v2Png192
  },
  {
    id: 3,
    name: "Variant 3 — Interlocked Minimalist NU",
    tagline: "Deep charcoal squircle with white N interlocking cleanly behind a glowing purple U.",
    bestFor: "Dark Player Bar, Mobile App & Browser Favicon",
    svg: v3Svg,
    png32: v3Png32,
    png192: v3Png192
  },
  {
    id: 4,
    name: "Variant 4 — Precision Split-Cut",
    tagline: "Refined Charcoal/Purple split badge with razor-sharp center spacing separating N and U.",
    bestFor: "Ultra-crisp 16px Tab Favicon & Compact Badges",
    svg: v4Svg,
    png32: v4Png32,
    png192: v4Png192
  }
];

const PALETTE = [
  { name: "Udemy Royal Purple (Primary CTA)", hex: "#A435F0", text: "#FFFFFF" },
  { name: "Purple Hover / Deep Action", hex: "#8710D8", text: "#FFFFFF" },
  { name: "Charcoal Ink (Dark Headers / Player)", hex: "#1C1D1F", text: "#FFFFFF" },
  { name: "Elevated Charcoal", hex: "#2D2F31", text: "#FFFFFF" },
  { name: "Subtle Surface Gray", hex: "#F7F9FA", text: "#1C1D1F" },
  { name: "Bestseller / Clinical Gold Pill", hex: "#ECEB98", text: "#3D3C0A" },
  { name: "Star Rating Amber", hex: "#B4690E", text: "#FFFFFF" },
  { name: "Verified Free Teal", hex: "#065F46", text: "#FFFFFF" }
];

export default function BrandKitPage() {
  const [activeId, setActiveId] = useState(3);

  const applyVariant = (v) => {
    setActiveId(v.id);
    // Live-swap favicons and navbar logo in DOM
    document.querySelectorAll('link[rel="icon"]').forEach((el) => {
      el.setAttribute("href", v.png32);
    });
    const navImg = document.querySelector(".nu-logo img");
    if (navImg) navImg.setAttribute("src", v.svg);
    window.dispatchEvent(new CustomEvent("nu-brand-change", { detail: v }));
  };

  useEffect(() => {
    const current = VARIANTS.find((x) => x.id === activeId);
    if (current) {
      document.querySelectorAll('link[rel="icon"]').forEach((el) => {
        el.setAttribute("href", current.png32);
      });
    }
  }, [activeId]);

  return (
    <main>
      <section className="nu-cl-hero">
        <div className="nu-container">
          <span className="nu-badge nu-badge-highyield" style={{ marginBottom: 10 }}>
            <Sparkles size={13} style={{ display: "inline", marginRight: 4 }} /> Brand Identity &amp; Design System
          </span>
          <h1>Nursing Uganda &ldquo;NU&rdquo; Logo &amp; Favicon Variants</h1>
          <p className="nu-cl-subtitle" style={{ maxWidth: 740 }}>
            Compare all 4 custom &ldquo;NU&rdquo; logo and favicon designs across light headers, dark footers, and browser tabs. Click any variant below to preview it live in your header and browser tab favicon.
          </p>
        </div>
      </section>

      <section className="nu-section">
        <div className="nu-container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
              gap: 24,
              marginBottom: 48
            }}
          >
            {VARIANTS.map((v) => {
              const isSelected = activeId === v.id;
              return (
                <article
                  key={v.id}
                  style={{
                    border: isSelected ? "2px solid var(--nu-purple)" : "1px solid var(--nu-border)",
                    background: "#fff",
                    display: "flex",
                    flexDirection: "column",
                    boxShadow: isSelected ? "var(--nu-shadow-md)" : "none"
                  }}
                >
                  {/* Full Mark + Dark/Light Contrast Preview */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: "1px solid var(--nu-border-light)" }}>
                    <div style={{ padding: 24, background: "#ffffff", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                      <img src={v.svg} alt={v.name} style={{ width: 92, height: 92 }} />
                      <span style={{ fontSize: "0.72rem", color: "var(--nu-ink-muted)", fontWeight: 600 }}>On Light (#FFF)</span>
                    </div>
                    <div style={{ padding: 24, background: "#1C1D1F", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                      <img src={v.svg} alt={v.name} style={{ width: 92, height: 92 }} />
                      <span style={{ fontSize: "0.72rem", color: "#cbd5e1", fontWeight: 600 }}>On Dark (#1C1D1F)</span>
                    </div>
                  </div>

                  {/* Browser Tab & Navbar Wordmark Simulation */}
                  <div style={{ padding: "14px 18px", background: "var(--nu-bg-subtle)", borderBottom: "1px solid var(--nu-border-light)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#fff", border: "1px solid var(--nu-border)", padding: "5px 10px", borderRadius: 6, fontSize: "0.76rem" }}>
                      <img src={v.png32} alt="" style={{ width: 16, height: 16 }} />
                      <span>Nursing Uganda</span>
                    </div>

                    <div style={{ display: "inline-flex", alignItems: "center", gap: 9 }}>
                      <img src={v.svg} alt="" style={{ width: 32, height: 32 }} />
                      <span className="nu-wordmark-stack">
                        <span className="nu-wordmark-top" style={{ fontSize: "0.98rem" }}>Nursing</span>
                        <span className="nu-wordmark-sub">
                          <span className="nu-wordmark-rule" />
                          <span className="nu-wordmark-ug">UG</span>
                        </span>
                      </span>
                    </div>
                  </div>

                  <div style={{ padding: 18, flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                    <h2 style={{ margin: 0, fontSize: "1.08rem" }}>{v.name}</h2>
                    <p style={{ margin: 0, fontSize: "0.86rem", color: "var(--nu-ink-muted)", flex: 1 }}>{v.tagline}</p>
                    <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--nu-purple)" }}>
                      Best for: {v.bestFor}
                    </div>
                    <button
                      type="button"
                      className={`nu-btn ${isSelected ? "nu-btn-dark" : "nu-btn-primary"}`}
                      style={{ marginTop: 8, width: "100%" }}
                      onClick={() => applyVariant(v)}
                    >
                      {isSelected ? (
                        <>
                          <Check size={16} /> Active in Header &amp; Tab Favicon
                        </>
                      ) : (
                        "Preview Live on Site"
                      )}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Color Palette */}
          <h2 style={{ fontFamily: "var(--nu-font-serif)", marginBottom: 16 }}>Udemy-Aligned Color System</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
            {PALETTE.map((c) => (
              <div key={c.hex} style={{ border: "1px solid var(--nu-border)", overflow: "hidden" }}>
                <div style={{ background: c.hex, color: c.text, padding: "22px 16px", fontWeight: 800, fontSize: "1rem" }}>
                  {c.hex}
                </div>
                <div style={{ padding: "10px 14px", fontSize: "0.84rem", fontWeight: 600 }}>{c.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
