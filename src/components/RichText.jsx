import React from "react";

/**
 * Safely renders inline **bold** markdown markers as <strong> elements
 * without using dangerouslySetInnerHTML.
 */
export default function RichText({ text }) {
  if (!text) return null;
  const parts = String(text).split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, idx) => {
        if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
          return <strong key={idx}>{part.slice(2, -2)}</strong>;
        }
        return <React.Fragment key={idx}>{part}</React.Fragment>;
      })}
    </>
  );
}
