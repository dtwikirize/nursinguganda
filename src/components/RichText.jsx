import React from "react";

const HIGHLIGHT_REGEX =
  /(\b\d+(?:[–-]\d+)?(?:\.\d+)?%\s*(?:[a-zA-Z0-9\s–-]{0,20})?|\b\d+(?:[–-]\d+)?\s*(?:liters?(?:\s*per\s*day|\/day)?|mL\/(?:hr|min|kg)|mg\/(?:dL|kg)|mmol\/L|mmHg|bpm)\b)/i;

function renderHighlightedSegments(str, keyPrefix) {
  const s = String(str || "");
  if (!s) return null;
  const parts = [];
  let remaining = s;
  let count = 0;

  while (remaining && count < 2) {
    const m = remaining.match(HIGHLIGHT_REGEX);
    if (!m || m.index === undefined) break;
    if (m.index > 0) parts.push(remaining.slice(0, m.index));
    const matchText = m[0];
    // Avoid highlighting overly generic short parentheticals like (e.g.)
    if (/\b(?:e\.g\.|i\.e\.|etc)\b/i.test(matchText)) {
      parts.push(matchText);
    } else {
      parts.push(
        <mark key={`${keyPrefix}-h-${count}`} className="nu-note-highlight">
          {matchText}
        </mark>
      );
      count++;
    }
    remaining = remaining.slice(m.index + matchText.length);
  }
  if (remaining) parts.push(remaining);
  return parts;
}

/**
 * Safely renders inline **bold** markers, optional "Sub-topic:" lead-in bolding,
 * and subtle warm highlighter spans without using dangerouslySetInnerHTML.
 */
export default function RichText({ text, highlightKeyFacts = false }) {
  if (!text) return null;
  const raw = String(text);

  // If explicit **bold** isn't wrapping a short colon-prefixed sub-topic (e.g. "Fluid Recovery: ..."), bold it cleanly
  let working = raw;
  let leadLabel = null;
  if (highlightKeyFacts && !raw.startsWith("**")) {
    const colonMatch = raw.match(/^([A-Z][A-Za-z0-9\s/&(),'-]{2,44}:)\s+(.+)$/);
    if (colonMatch) {
      leadLabel = colonMatch[1];
      working = colonMatch[2];
    }
  }

  const parts = working.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {leadLabel && <strong className="nu-note-subtopic">{leadLabel} </strong>}
      {parts.map((part, idx) => {
        if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
          return <strong key={idx}>{part.slice(2, -2)}</strong>;
        }
        return (
          <React.Fragment key={idx}>
            {highlightKeyFacts ? renderHighlightedSegments(part, `p${idx}`) : part}
          </React.Fragment>
        );
      })}
    </>
  );
}
