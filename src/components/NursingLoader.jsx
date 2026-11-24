import React from "react";

/**
 * Unique Nursing Uganda clinical loader featuring the Option 4 Navy & Purple NU emblem,
 * dual-arc orbital spinner, and animated ECG clinical pulse trace.
 */
export default function NursingLoader({ label = "Loading Nursing Uganda study module...", compact = false }) {
  return (
    <div
      className={`nu-loader-wrap ${compact ? "is-compact" : ""}`}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="nu-loader-emblem">
        <svg
          className="nu-loader-ring"
          viewBox="0 0 96 96"
          width={compact ? 56 : 76}
          height={compact ? 56 : 76}
          aria-hidden="true"
        >
          <circle cx="48" cy="48" r="42" fill="none" stroke="#E2E8F0" strokeWidth="4" />
          <circle
            className="nu-loader-arc-navy"
            cx="48"
            cy="48"
            r="42"
            fill="none"
            stroke="#0F2942"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeDasharray="72 192"
          />
          <circle
            className="nu-loader-arc-purple"
            cx="48"
            cy="48"
            r="34"
            fill="none"
            stroke="#A137F2"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray="56 160"
          />
        </svg>

        <div className="nu-loader-icon-core">
          <svg
            viewBox="50 80 430 330"
            width={compact ? 26 : 36}
            height={compact ? 26 : 36}
            aria-hidden="true"
          >
            <path
              d="M88 368V152C88 142 96 134 106 134H134C144 134 152 139 158 148L244 294V134H294V352C294 362 286 370 276 370H248C238 370 230 365 224 356L138 210V368H88Z"
              fill="#0F2942"
            />
            <path
              d="M234 134H294V276C294 308 313 326 342 326C371 326 390 308 390 276V134H440V278C440 338 398 376 342 376C286 376 234 338 234 278V134Z"
              fill="#A137F2"
              stroke="#FFFFFF"
              strokeWidth="18"
              strokeLinejoin="round"
            />
            <circle cx="415" cy="96" r="18" fill="#0F2942" />
          </svg>
        </div>
      </div>

      {/* Clinical ECG Pulse Trace */}
      <svg
        className="nu-loader-ecg"
        viewBox="0 0 180 28"
        width={compact ? 110 : 148}
        height={compact ? 20 : 24}
        aria-hidden="true"
      >
        <path
          className="nu-loader-ecg-track"
          d="M2 16 H48 L58 16 L66 7 L75 23 L84 3 L93 25 L101 12 L110 16 H178"
          fill="none"
          stroke="#E2E8F0"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          className="nu-loader-ecg-wave"
          d="M2 16 H48 L58 16 L66 7 L75 23 L84 3 L93 25 L101 12 L110 16 H178"
          fill="none"
          stroke="#A137F2"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {label && <p className="nu-loader-label">{label}</p>}
    </div>
  );
}
