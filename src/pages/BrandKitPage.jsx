import React, { useEffect, useState } from "react";
import { Check, Copy, Download, ExternalLink, Sparkles } from "lucide-react";

// Official BrandKit Stacked SVGs
import nugLightSvg from "../../assets/images/brand/nursing-uganda-logo-light.svg";
import nugDarkSvg from "../../assets/images/brand/nursing-uganda-logo-dark.svg";
import nugUgLightSvg from "../../assets/images/brand/nursing-ug-logo-light.svg";
import nugUgDarkSvg from "../../assets/images/brand/nursing-ug-logo-dark.svg";

// Official BrandKit Stacked PNGs
import nugLightPng from "../../assets/images/brand/nursing-uganda-logo-light.png";
import nugLight2x from "../../assets/images/brand/nursing-uganda-logo-light@2x.png";
import nugLight4x from "../../assets/images/brand/nursing-uganda-logo-light@4x.png";

import nugDarkPng from "../../assets/images/brand/nursing-uganda-logo-dark.png";
import nugDark2x from "../../assets/images/brand/nursing-uganda-logo-dark@2x.png";
import nugDark4x from "../../assets/images/brand/nursing-uganda-logo-dark@4x.png";

import nugUgLightPng from "../../assets/images/brand/nursing-ug-logo-light.png";
import nugUgLight2x from "../../assets/images/brand/nursing-ug-logo-light@2x.png";
import nugUgLight4x from "../../assets/images/brand/nursing-ug-logo-light@4x.png";

import nugUgDarkPng from "../../assets/images/brand/nursing-ug-logo-dark.png";
import nugUgDark2x from "../../assets/images/brand/nursing-ug-logo-dark@2x.png";
import nugUgDark4x from "../../assets/images/brand/nursing-ug-logo-dark@4x.png";

// Pure Vector Icon
import nuIconSvg from "../../assets/images/brand/nu-variant-3.svg";
import nuIcon32 from "../../assets/images/brand/nu-variant-3-32.png";
import nuIcon192 from "../../assets/images/brand/nu-variant-3-192.png";
import nuIcon512 from "../../assets/images/brand/nu-variant-3-512.png";

const STACKED_LOGOS = [
  {
    id: "uganda-light",
    name: "Nursing Uganda — Light",
    subtitle: "Primary Brand Mark (Light Backgrounds)",
    description: "Full stacked lockup featuring the interlocking NU squircle, Charcoal 'Nursing' (Poppins Bold 700), and evenly tracking 'U G A N D A' in Royal Purple (#A137F2).",
    bg: "#ffffff",
    textColor: "#1C1D1F",
    svg: nugLightSvg,
    png1x: nugLightPng,
    png2x: nugLight2x,
    png4x: nugLight4x,
    bestFor: "Website desktop/mobile header, PDF certificates, academic stationery"
  },
  {
    id: "uganda-dark",
    name: "Nursing Uganda — Dark",
    subtitle: "Inverted High-Contrast Mark (Dark Backgrounds)",
    description: "Inverted stack with crisp white 'Nursing' and luminous Lavender (#B36AFA) 'U G A N D A' tailored for dark footers, video players, and nocturnal interfaces.",
    bg: "#111214",
    textColor: "#ffffff",
    svg: nugDarkSvg,
    png1x: nugDarkPng,
    png2x: nugDark2x,
    png4x: nugDark4x,
    bestFor: "Site footer, course video player, dark mode overlays, digital signage"
  },
  {
    id: "ug-light",
    name: "Nursing UG — Light",
    subtitle: "Compact Badge Mark (Light Backgrounds)",
    description: "Streamlined modern lockup with 'Nursing' stacked over 'UG' followed by a dynamic purple rule line fading outward to the right.",
    bg: "#ffffff",
    textColor: "#1C1D1F",
    svg: nugUgLightSvg,
    png1x: nugUgLightPng,
    png2x: nugUgLight2x,
    png4x: nugUgLight4x,
    bestFor: "Editorial headers, compact mobile bars, social media covers"
  },
  {
    id: "ug-dark",
    name: "Nursing UG — Dark",
    subtitle: "Compact Badge Mark (Dark Backgrounds)",
    description: "Dark-mode edition of the 'Nursing UG' lockup with white lettering, lavender badge, and glowing lavender rule line fading outward.",
    bg: "#111214",
    textColor: "#ffffff",
    svg: nugUgDarkSvg,
    png1x: nugUgDarkPng,
    png2x: nugUgDark2x,
    png4x: nugUgDark4x,
    bestFor: "Compact dark player, mobile bottom navigation, dark banners"
  }
];

const PALETTE = [
  { name: "Charcoal Ink (Nursing text)", hex: "#1C1D1F", text: "#FFFFFF", role: "Primary brand text & dark containers" },
  { name: "Royal Purple (UGANDA / UG)", hex: "#A137F2", text: "#FFFFFF", role: "Primary accent, links & buttons" },
  { name: "Luminous Lavender", hex: "#B36AFA", text: "#111214", role: "Dark-surface accent & U-stem highlight" },
  { name: "Clinical Cream Accent", hex: "#ECEB98", text: "#3D3C0A", role: "NU icon peak dot & high-yield pill" },
  { name: "Pure White", hex: "#FFFFFF", text: "#1C1D1F", role: "Dark wordmark 'Nursing' & surface base" },
  { name: "Elevated Charcoal", hex: "#2D2F31", text: "#FFFFFF", role: "Dark cards & player background" }
];

const CODE_SNIPPET = `<!-- Nursing Uganda Stacked Header Logo -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@600;700&display=swap" rel="stylesheet">

<style>
  .nug-logo {
    --nug-ink: #1C1D1F;
    --nug-accent: #A137F2;
    display: inline-flex;
    align-items: center;
    gap: 0.325em;
    font-family: 'Poppins', system-ui, sans-serif;
    font-size: 32px; /* 32px desktop, 26px mobile */
    line-height: 1;
    text-decoration: none;
  }
  .nug-logo--dark { --nug-ink: #FFFFFF; --nug-accent: #B36AFA; }
  .nug-logo__icon { width: 1.425em; height: 1.425em; display: block; flex-shrink: 0; }
  .nug-logo__text { display: flex; flex-direction: column; gap: 0.175em; }
  .nug-logo__name { font-weight: 700; letter-spacing: -0.02em; color: var(--nug-ink); }
  .nug-logo__country {
    display: flex;
    justify-content: space-between;
    padding: 0 0.05em;
    font-weight: 600;
    font-size: 0.3em;
    color: var(--nug-accent);
  }
</style>

<a class="nug-logo" href="/" aria-label="Nursing Uganda, home">
  <img class="nug-logo__icon" src="/assets/images/brand/nu-variant-3.svg" alt="NU">
  <span class="nug-logo__text" aria-hidden="true">
    <span class="nug-logo__name">Nursing</span>
    <span class="nug-logo__country"><span>U</span><span>G</span><span>A</span><span>N</span><span>D</span><span>A</span></span>
  </span>
</a>`;

export default function BrandKitPage() {
  const [activeLogoId, setActiveLogoId] = useState("uganda-light");
  const [copied, setCopied] = useState(false);

  const applyLogoToHeader = (logo) => {
    setActiveLogoId(logo.id);
    const lightSvg = logo.id.includes("ug-light") ? nugUgLightSvg : nugLightSvg;
    window.dispatchEvent(new CustomEvent("nu-brand-change", { detail: { logoLightSvg: lightSvg } }));
  };

  const copyCode = () => {
    navigator.clipboard.writeText(CODE_SNIPPET);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <main>
      <section className="nu-cl-hero">
        <div className="nu-container">
          <span className="nu-badge nu-badge-highyield" style={{ marginBottom: 10 }}>
            <Sparkles size={13} style={{ display: "inline", marginRight: 4 }} /> Official Brand Identity System
          </span>
          <h1>Nursing Uganda Stacked BrandKit</h1>
          <p className="nu-cl-subtitle" style={{ maxWidth: 760 }}>
            The definitive design system and vector assets for Nursing Uganda. Features the interlocking NU squircle, Poppins geometric wordmark with edge-to-edge tracking, and high-contrast clinical palettes.
          </p>
        </div>
      </section>

      <section className="nu-section">
        <div className="nu-container">
          <h2 style={{ fontFamily: "var(--nu-font-serif)", marginBottom: 8 }}>Official Stacked Logos</h2>
          <p style={{ color: "var(--nu-ink-muted)", marginBottom: 28 }}>
            Pure-vector SVGs and transparent retina PNGs (1x, @2x, @4x). Click any variant to apply it live to the website header.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: 24,
              marginBottom: 48
            }}
          >
            {STACKED_LOGOS.map((item) => {
              const isActive = activeLogoId === item.id;
              return (
                <article
                  key={item.id}
                  style={{
                    border: isActive ? "2px solid var(--nu-purple)" : "1px solid var(--nu-border)",
                    background: "#ffffff",
                    display: "flex",
                    flexDirection: "column",
                    boxShadow: isActive ? "var(--nu-shadow-md)" : "none",
                    borderRadius: 4,
                    overflow: "hidden"
                  }}
                >
                  {/* Visual Preview Box */}
                  <div
                    style={{
                      background: item.bg,
                      padding: "36px 24px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      minHeight: 140,
                      borderBottom: "1px solid var(--nu-border-light)"
                    }}
                  >
                    <img
                      src={item.svg}
                      alt={item.name}
                      style={{ height: 54, width: "auto", display: "block" }}
                    />
                  </div>

                  <div style={{ padding: 20, flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
                    <div>
                      <h3 style={{ margin: "0 0 4px 0", fontSize: "1.15rem" }}>{item.name}</h3>
                      <span style={{ fontSize: "0.8rem", color: "var(--nu-purple)", fontWeight: 600 }}>
                        {item.subtitle}
                      </span>
                    </div>

                    <p style={{ margin: 0, fontSize: "0.86rem", color: "var(--nu-ink-muted)", flex: 1 }}>
                      {item.description}
                    </p>

                    <div style={{ fontSize: "0.78rem", background: "var(--nu-bg-subtle)", padding: "8px 10px", borderRadius: 4 }}>
                      <strong>Best for:</strong> {item.bestFor}
                    </div>

                    <button
                      type="button"
                      className={`nu-btn ${isActive ? "nu-btn-dark" : "nu-btn-primary"}`}
                      style={{ width: "100%", marginTop: 4 }}
                      onClick={() => applyLogoToHeader(item)}
                    >
                      {isActive ? (
                        <>
                          <Check size={16} /> Active in Header
                        </>
                      ) : (
                        "Apply Live to Header"
                      )}
                    </button>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 4 }}>
                      <a
                        href={item.svg}
                        download={`${item.id}.svg`}
                        className="nu-btn nu-btn-secondary"
                        style={{ fontSize: "0.78rem", padding: "6px 8px" }}
                      >
                        <Download size={13} /> SVG (Vector)
                      </a>
                      <a
                        href={item.png2x}
                        download={`${item.id}@2x.png`}
                        className="nu-btn nu-btn-secondary"
                        style={{ fontSize: "0.78rem", padding: "6px 8px" }}
                      >
                        <Download size={13} /> PNG (@2x Retina)
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Color System */}
          <h2 style={{ fontFamily: "var(--nu-font-serif)", marginBottom: 8 }}>Official Color System</h2>
          <p style={{ color: "var(--nu-ink-muted)", marginBottom: 20 }}>
            Exact hex codes specified in the BrandKit. Designed for AA/AAA accessibility on medical learning interfaces.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 14,
              marginBottom: 48
            }}
          >
            {PALETTE.map((c) => (
              <div key={c.hex} style={{ border: "1px solid var(--nu-border)", borderRadius: 4, overflow: "hidden" }}>
                <div
                  style={{
                    background: c.hex,
                    color: c.text,
                    padding: "24px 16px",
                    fontWeight: 800,
                    fontSize: "1.05rem",
                    borderBottom: "1px solid rgba(0,0,0,0.06)"
                  }}
                >
                  {c.hex}
                </div>
                <div style={{ padding: "10px 14px" }}>
                  <div style={{ fontWeight: 700, fontSize: "0.88rem" }}>{c.name}</div>
                  <div style={{ fontSize: "0.76rem", color: "var(--nu-ink-muted)", marginTop: 2 }}>{c.role}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Typography & Proportions Guide */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: 24,
              marginBottom: 48
            }}
          >
            <div style={{ border: "1px solid var(--nu-border)", padding: 24, borderRadius: 4, background: "#fff" }}>
              <h3 style={{ marginTop: 0, fontFamily: "var(--nu-font-serif)" }}>Typography Guidelines</h3>
              <ul style={{ paddingLeft: 18, fontSize: "0.9rem", color: "var(--nu-ink)", lineHeight: 1.7 }}>
                <li>
                  <strong>&ldquo;Nursing&rdquo;</strong> — Poppins Bold 700, letter-spacing <code>-0.02em</code>. Charcoal (#1C1D1F) on light, White (#FFFFFF) on dark.
                </li>
                <li>
                  <strong>&ldquo;UGANDA&rdquo;</strong> — Poppins SemiBold 600, 30% font size of &ldquo;Nursing&rdquo;, justified across the exact width of &ldquo;Nursing&rdquo;.
                </li>
                <li>
                  <strong>&ldquo;UG&rdquo; Badge</strong> — Poppins SemiBold 600, letter-spacing <code>0.3em</code>, followed by a gradient rule fading outward to transparent.
                </li>
                <li>
                  <strong>Body &amp; Learning UI</strong> — Inter (400, 500, 600, 700) for clinical data, quizzes, and syllabus trees.
                </li>
                <li>
                  <strong>eBook &amp; Editorial</strong> — Merriweather (700, 900) for textbook chapters and academic citations.
                </li>
              </ul>
            </div>

            <div style={{ border: "1px solid var(--nu-border)", padding: 24, borderRadius: 4, background: "#fff" }}>
              <h3 style={{ marginTop: 0, fontFamily: "var(--nu-font-serif)" }}>Mathematical Proportions</h3>
              <p style={{ fontSize: "0.88rem", color: "var(--nu-ink-muted)", marginTop: 0 }}>
                Based on the font-size of &ldquo;Nursing&rdquo; (<strong>N</strong>):
              </p>
              <ul style={{ paddingLeft: 18, fontSize: "0.9rem", color: "var(--nu-ink)", lineHeight: 1.7 }}>
                <li><strong>Icon Height:</strong> <code>1.425 &times; N</code> (e.g. 57 px when N = 40 px, or 45.6 px when N = 32 px)</li>
                <li><strong>Icon to Wordmark Gap:</strong> <code>0.325 &times; N</code> (~10 px)</li>
                <li><strong>Vertical Wordmark Gap:</strong> <code>0.175 &times; N</code> (~5.6 px)</li>
                <li><strong>Country Text Size:</strong> <code>0.300 &times; N</code> (9.6 px when N = 32 px)</li>
                <li><strong>Clear Space:</strong> Minimum 0.5&times; icon height on all sides.</li>
                <li><strong>Minimum Scale:</strong> Icon 32 px high on screen (below that, use standalone icon).</li>
              </ul>
            </div>
          </div>

          {/* Standalone Icon & App Assets */}
          <h2 style={{ fontFamily: "var(--nu-font-serif)", marginBottom: 8 }}>Standalone App Icon (Variant 3)</h2>
          <p style={{ color: "var(--nu-ink-muted)", marginBottom: 20 }}>
            The pure interlocking NU squircle without wordmark for mobile home screens, PWA icons, and browser favicons.
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 16, marginBottom: 48, background: "#fff", border: "1px solid var(--nu-border)", padding: 20, borderRadius: 4 }}>
            <img src={nuIconSvg} alt="NU Icon" style={{ width: 64, height: 64 }} />
            <div style={{ flex: 1, minWidth: 200 }}>
              <strong style={{ display: "block" }}>Interlocked Minimalist NU Squircle</strong>
              <span style={{ fontSize: "0.84rem", color: "var(--nu-ink-muted)" }}>
                Ultra-crisp 512&times;512 vector with dark charcoal squircle, angled white N, royal purple U, and cream dot.
              </span>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <a href={nuIconSvg} download="nu-icon.svg" className="nu-btn nu-btn-secondary" style={{ fontSize: "0.78rem" }}>
                <Download size={13} /> SVG
              </a>
              <a href={nuIcon32} download="nu-icon-32.png" className="nu-btn nu-btn-secondary" style={{ fontSize: "0.78rem" }}>
                <Download size={13} /> 32px Favicon
              </a>
              <a href={nuIcon192} download="nu-icon-192.png" className="nu-btn nu-btn-secondary" style={{ fontSize: "0.78rem" }}>
                <Download size={13} /> 192px PWA
              </a>
              <a href={nuIcon512} download="nu-icon-512.png" className="nu-btn nu-btn-secondary" style={{ fontSize: "0.78rem" }}>
                <Download size={13} /> 512px App Store
              </a>
            </div>
          </div>

          {/* Web Integration Code Snippet */}
          <div style={{ border: "1px solid var(--nu-border)", borderRadius: 4, background: "#1C1D1F", color: "#fff", padding: 24 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <h3 style={{ margin: 0, color: "#fff", fontSize: "1.05rem" }}>Direct HTML/CSS Web Integration</h3>
              <button
                type="button"
                className="nu-btn nu-btn-secondary"
                style={{ fontSize: "0.78rem", background: "rgba(255,255,255,0.1)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)" }}
                onClick={copyCode}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? "Copied!" : "Copy Snippet"}
              </button>
            </div>
            <pre style={{ margin: 0, overflowX: "auto", fontSize: "0.8rem", color: "#e2e8f0", background: "transparent", padding: 0 }}>
              <code>{CODE_SNIPPET}</code>
            </pre>
          </div>
        </div>
      </section>
    </main>
  );
}
