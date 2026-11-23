import React from "react";
import { Award, Printer, ShieldAlert } from "lucide-react";

export default function CertificateCard({ certificate, learnerName }) {
  if (!certificate) return null;

  const displayDate = certificate.issuedAt
    ? new Date(certificate.issuedAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric"
      })
    : new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric"
      });

  return (
    <div
      className="nu-certificate-sheet"
      style={{
        background: "#fff",
        border: "8px solid #1C1D1F",
        boxShadow: "0 0 0 3px #A137F2 inset, 0 14px 36px rgba(28,29,31,0.1)",
        padding: "32px 28px",
        borderRadius: 6,
        position: "relative"
      }}
    >
      <div
        className="nu-no-print"
        style={{ display: "flex", justifyContent: "flex-end", marginBottom: 14 }}
      >
        <button
          type="button"
          className="nu-btn nu-btn-secondary"
          onClick={() => window.print()}
          style={{ height: 36, fontSize: "0.82rem", padding: "0 12px" }}
        >
          <Printer size={14} /> Print / Save PDF Certificate
        </button>
      </div>

      <div style={{ textAlign: "center", borderBottom: "2px solid #F3F0FF", paddingBottom: 18 }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "#FAF5FF",
            color: "#6d28d9",
            padding: "5px 14px",
            borderRadius: 999,
            fontSize: "0.75rem",
            fontWeight: 800,
            letterSpacing: "0.08em",
            textTransform: "uppercase"
          }}
        >
          <Award size={14} /> Nursing Uganda · Certificate of Study Completion
        </div>
        <h2
          style={{
            fontFamily: "var(--nu-font-serif)",
            fontSize: "clamp(1.4rem, 2.5vw, 1.9rem)",
            margin: "14px 0 6px",
            color: "#1C1D1F"
          }}
        >
          This Certifies That
        </h2>
        <div
          style={{
            fontSize: "clamp(1.45rem, 2.6vw, 2rem)",
            fontWeight: 800,
            color: "#A137F2",
            margin: "6px 0 10px"
          }}
        >
          {learnerName || "Nursing Uganda Learner"}
        </div>
        <p style={{ margin: "0 auto", maxWidth: 600, fontSize: "0.95rem", color: "#4b5563" }}>
          has satisfactorily completed the structured revision readings and passed the 30-question Final Evaluation (&ge; 60% passmark) for:
        </p>
        <h3 style={{ margin: "12px 0 6px", fontSize: "1.25rem", color: "#1C1D1F" }}>
          {certificate.courseTitle}
        </h3>
        {certificate.programmeLabel && (
          <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#6A6F73" }}>
            Track: {certificate.programmeLabel}
          </div>
        )}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: 14,
          marginTop: 18,
          textAlign: "center",
          fontSize: "0.85rem"
        }}
      >
        <div style={{ padding: 10, background: "#F7F9FA", borderRadius: 6 }}>
          <div style={{ color: "#6A6F73", fontSize: "0.72rem", textTransform: "uppercase", fontWeight: 700 }}>
            Final Score
          </div>
          <strong style={{ fontSize: "1rem", color: "#15803d" }}>
            {certificate.score} / {certificate.totalQuestions} ({certificate.percent}%)
          </strong>
        </div>
        <div style={{ padding: 10, background: "#F7F9FA", borderRadius: 6 }}>
          <div style={{ color: "#6A6F73", fontSize: "0.72rem", textTransform: "uppercase", fontWeight: 700 }}>
            Certificate ID
          </div>
          <code style={{ fontWeight: 800, color: "#1C1D1F" }}>{certificate.certificateCode}</code>
        </div>
        <div style={{ padding: 10, background: "#F7F9FA", borderRadius: 6 }}>
          <div style={{ color: "#6A6F73", fontSize: "0.72rem", textTransform: "uppercase", fontWeight: 700 }}>
            Date Issued
          </div>
          <strong style={{ color: "#1C1D1F" }}>{displayDate}</strong>
        </div>
      </div>

      <div
        style={{
          marginTop: 18,
          padding: "10px 14px",
          background: "#FEFCE8",
          border: "1px solid #FDE047",
          borderRadius: 6,
          display: "flex",
          gap: 10,
          alignItems: "flex-start",
          fontSize: "0.74rem",
          lineHeight: 1.5,
          color: "#713F12"
        }}
      >
        <ShieldAlert size={16} style={{ flexShrink: 0, marginTop: 2 }} />
        <div>
          <strong>Scope &amp; Regulatory Notice:</strong> This certificate attests solely to self-paced study completion on Nursing Uganda (<code>nursinguganda.com</code>). It is <strong>NOT</strong> an official academic transcript, practicing license, or statutory credential from UNMEB, the Uganda Nurses and Midwives Council (UNMC), or the Ministry of Health Uganda, and does not authorize independent clinical practice.
        </div>
      </div>
    </div>
  );
}
