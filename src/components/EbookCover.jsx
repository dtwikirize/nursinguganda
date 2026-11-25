import React from "react";
import { getEbookTheme } from "../utils/ebookThemes";

/**
 * Editorial multi-color medical textbook cover modeled after OpenStax / Elsevier
 * clinical pocketbooks with spine edge, specialty badge, specimen window & footer stamp.
 */
export default function EbookCover({ ebook, presetId = "", compact = false }) {
  if (!ebook) return null;
  const theme = getEbookTheme(ebook, presetId);
  const coverThumb = ebook.coverImage
    ? ebook.coverImage.startsWith("/")
      ? ebook.coverImage
      : `/${ebook.coverImage}`
    : "/assets/images/udemy/cat-anatomy.webp";

  if (ebook.importedFromInfoBooks && ebook.coverImage?.includes("/book-covers/")) {
    return (
      <div
        className={`nu-textbook-cover ${compact ? "is-compact" : ""}`}
        style={{ background: "#0f172a", borderColor: "#cbd5e1", padding: 0, overflow: "hidden", position: "relative" }}
      >
        <img
          src={coverThumb}
          alt={ebook.title}
          width="360"
          height="480"
          loading="lazy"
          decoding="async"
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center", display: "block" }}
        />
        <span
          className="nu-textbook-badge"
          style={{
            position: "absolute",
            bottom: 10,
            right: 10,
            background: "#09090B",
            color: "#ffffff",
            boxShadow: "0 2px 8px rgba(0,0,0,0.45)"
          }}
        >
          FREE · {ebook.estimatedPages || 90} pp.
        </span>
      </div>
    );
  }

  return (
    <div
      className={`nu-textbook-cover ${compact ? "is-compact" : ""}`}
      style={{
        background: `linear-gradient(155deg, ${theme.primaryHex} 0%, ${theme.primaryHex} 64%, #0f172a 100%)`,
        borderColor: theme.accentHex
      }}
    >
      {/* Book Spine Highlight */}
      <span
        className="nu-textbook-spine"
        style={{ background: `linear-gradient(90deg, rgba(255,255,255,0.22), rgba(0,0,0,0.34), transparent)` }}
        aria-hidden="true"
      />
      {/* Top Color Accent Ribbon */}
      <div className="nu-textbook-topbar" style={{ background: theme.accentHex }}>
        <span>Nursing Uganda Press &middot; {theme.vol}</span>
        <span>2026 UCG / WHO</span>
      </div>

      {/* Cover Main Body */}
      <div className="nu-textbook-body">
        <div className="nu-textbook-kicker" style={{ color: "#e2e8f0" }}>
          {theme.series}
        </div>
        <h3 className="nu-textbook-title">{ebook.title}</h3>
        {!compact && ebook.subtitle && (
          <p className="nu-textbook-sub">{ebook.subtitle}</p>
        )}

        {/* Specimen Window Frame */}
        <div className="nu-textbook-window" style={{ borderColor: theme.accentHex }}>
          <img
            src={coverThumb}
            alt={ebook.title}
            width="480"
            height="270"
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>

      {/* Cover Publisher Footer */}
      <div className="nu-textbook-foot">
        <span>{ebook.chapters?.length || 6} Chapters · ~{ebook.estimatedPages || 90} pp.</span>
        <span className="nu-textbook-badge" style={{ background: theme.accentHex }}>
          FREE PDF
        </span>
      </div>
    </div>
  );
}
