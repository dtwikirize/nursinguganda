import React from "react";
import { Globe2 } from "lucide-react";

export default function CountryFlag({ code, width = 30 }) {
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
      border: "1px solid rgba(203, 213, 225, 0.7)",
      flexShrink: 0,
      boxShadow: "0 1px 2px rgba(15, 23, 42, 0.12)"
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
