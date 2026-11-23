import React from "react";
import { BookMarked, ExternalLink } from "lucide-react";

export default function ReferencesBox({ references = [], heading = "Authoritative Medical & Textbook References" }) {
  if (!references || references.length === 0) return null;

  return (
    <aside className="nu-refs-box" aria-label="References">
      <h3>
        <BookMarked size={18} color="#a435f0" />
        <span>{heading}</span>
      </h3>
      <ol className="nu-refs-list">
        {references.map((ref, idx) => (
          <li key={ref.id || idx}>
            <span>{ref.citation || `${ref.authors} (${ref.year}). ${ref.title}. ${ref.publisher}.`}</span>{" "}
            {ref.type && (
              <span
                style={{
                  fontSize: "0.72rem",
                  background: "#ede9fe",
                  color: "#5b21b6",
                  padding: "1px 6px",
                  borderRadius: 3,
                  fontWeight: 600,
                  marginLeft: 4
                }}
              >
                {ref.type}
              </span>
            )}
            {ref.url && (
              <a
                href={ref.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ marginLeft: 8, display: "inline-flex", alignItems: "center", gap: 3 }}
              >
                Source <ExternalLink size={12} />
              </a>
            )}
          </li>
        ))}
      </ol>
    </aside>
  );
}
