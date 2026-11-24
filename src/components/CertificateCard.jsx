import React from "react";
import { Award, CheckCircle2, Download, ShieldAlert, ShieldCheck } from "lucide-react";
import { downloadCertificatePdf } from "../utils/pdfExport";
import nuLogoLight from "../../assets/images/brand/nursing-uganda-logo-light.svg";

/**
 * Premium Udemy / Coursera style Certificate of Completion.
 * Supports earned mode (with binary .pdf download) and previewMode on CourseDetailPage.
 */
export default function CertificateCard({ certificate, learnerName, previewMode = false }) {
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

  const displayRecipient =
    learnerName || (previewMode ? "Grace Namukasa (Sample Learner)" : "Nursing Uganda Learner");

  return (
    <div
      className="nu-certificate-sheet"
      style={{
        background: "linear-gradient(135deg, #FFFFFF 0%, #FAFBFD 60%, #F5F3FF 100%)",
        border: "10px solid #0F2942",
        boxShadow:
          "0 0 0 2px #C59B27 inset, 0 0 0 6px #FFFFFF inset, 0 0 0 7px #A137F2 inset, 0 18px 42px rgba(15, 41, 66, 0.14)",
        padding: previewMode ? "26px 24px" : "32px 28px",
        borderRadius: 8,
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* Subtle Top Action Bar */}
      <div
        className="nu-no-print"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 10,
          marginBottom: 16
        }}
      >
        <img src={nuLogoLight} alt="Nursing Uganda" style={{ height: 28, width: "auto", display: "block" }} />

        {previewMode ? (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: "#ECFDF5",
              color: "#065F46",
              border: "1px solid #A7F3D0",
              padding: "5px 12px",
              borderRadius: 999,
              fontSize: "0.75rem",
              fontWeight: 700
            }}
          >
            <ShieldCheck size={14} /> Included Upon Completion (60%+ Passmark)
          </span>
        ) : (
          <button
            type="button"
            className="nu-btn nu-btn-primary"
            onClick={() => downloadCertificatePdf(certificate, learnerName)}
            style={{ height: 36, fontSize: "0.82rem", padding: "0 14px", display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            <Download size={14} /> Download Verified PDF
          </button>
        )}
      </div>

      {/* Center Diploma Body */}
      <div
        style={{
          textAlign: "center",
          borderTop: "1px solid #E2E8F0",
          borderBottom: "1px solid #E2E8F0",
          padding: "22px 12px"
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "linear-gradient(90deg, #0F2942 0%, #1E4468 100%)",
            color: "#FFFFFF",
            padding: "5px 16px",
            borderRadius: 999,
            fontSize: "0.72rem",
            fontWeight: 800,
            letterSpacing: "0.1em",
            textTransform: "uppercase"
          }}
        >
          <Award size={14} color="#FDE047" /> Verified Certificate of Completion
        </div>

        <h2
          style={{
            fontFamily: "var(--nu-font-serif)",
            fontSize: "clamp(1.25rem, 2.2vw, 1.65rem)",
            margin: "14px 0 4px",
            color: "#0F2942",
            letterSpacing: "0.01em"
          }}
        >
          This Is Proudly Presented To
        </h2>

        <div
          style={{
            fontFamily: "var(--nu-font-serif)",
            fontSize: "clamp(1.45rem, 2.7vw, 2.05rem)",
            fontWeight: 800,
            color: "#A137F2",
            margin: "6px auto 10px",
            paddingBottom: 6,
            borderBottom: "2px solid #C59B27",
            display: "inline-block",
            minWidth: "min(340px, 90%)"
          }}
        >
          {displayRecipient}
        </div>

        <p style={{ margin: "6px auto 0", maxWidth: 620, fontSize: "0.93rem", color: "#334155", lineHeight: 1.5 }}>
          for successfully completing all clinical study units, guided readings, and passing the 30-question Final Course Evaluation (&ge; 60% mastery benchmark) in:
        </p>

        <h3 style={{ margin: "12px 0 6px", fontSize: "1.28rem", fontWeight: 800, color: "#0F2942" }}>
          {certificate.courseTitle}
        </h3>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 10,
            flexWrap: "wrap",
            fontSize: "0.8rem",
            color: "#475569",
            fontWeight: 600,
            marginTop: 6
          }}
        >
          {certificate.programmeLabel && <span>Track: {certificate.programmeLabel}</span>}
          {certificate.studyHours && <span>· Study Load: ~{certificate.studyHours} hrs</span>}
          {certificate.clinicalReviewer && <span>· Reviewed by {certificate.clinicalReviewer}</span>}
        </div>
      </div>

      {/* Signatures + Gold Seal + Metadata Row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
          gap: 16,
          alignItems: "center",
          marginTop: 18,
          padding: "8px 4px"
        }}
      >
        {/* Left Signature */}
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontFamily: "Georgia, serif",
              fontStyle: "italic",
              fontSize: "1.05rem",
              color: "#0F2942",
              borderBottom: "1px solid #94A3B8",
              paddingBottom: 4,
              marginBottom: 4
            }}
          >
            Dr. D. Twikirize, RN
          </div>
          <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#64748B", textTransform: "uppercase" }}>
            Clinical Curriculum Director
          </div>
        </div>

        {/* Center Gold Embossed Seal */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: "radial-gradient(circle at 30% 30%, #FDE047, #D97706 70%, #92400E 100%)",
              border: "3px dashed #FFFBEB",
              boxShadow: "0 4px 14px rgba(180, 83, 9, 0.35)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: "#FFFFFF"
            }}
          >
            <CheckCircle2 size={22} />
            <span style={{ fontSize: "0.58rem", fontWeight: 900, letterSpacing: "0.06em" }}>VERIFIED</span>
          </div>
          <code style={{ fontSize: "0.72rem", fontWeight: 800, color: "#0F2942" }}>
            ID: {certificate.certificateCode}
          </code>
        </div>

        {/* Right Metadata / Date & Score */}
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: "0.95rem",
              fontWeight: 700,
              color: "#0F2942",
              borderBottom: "1px solid #94A3B8",
              paddingBottom: 4,
              marginBottom: 4
            }}
          >
            {previewMode
              ? "Passmark >= 60%"
              : `${certificate.score} / ${certificate.totalQuestions} (${certificate.percent}%)`}
          </div>
          <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#64748B", textTransform: "uppercase" }}>
            Issued: {displayDate}
          </div>
        </div>
      </div>

      {/* Regulatory Disclaimer Strip */}
      <div
        style={{
          marginTop: 14,
          padding: "10px 14px",
          background: "#FEFCE8",
          border: "1px solid #FDE047",
          borderRadius: 6,
          display: "flex",
          gap: 10,
          alignItems: "flex-start",
          fontSize: "0.73rem",
          lineHeight: 1.48,
          color: "#713F12"
        }}
      >
        <ShieldAlert size={15} style={{ flexShrink: 0, marginTop: 2 }} />
        <div>
          <strong>Scope &amp; Regulatory Notice:</strong> This supplementary completion certificate verifies self-paced academic study on Nursing Uganda (<code>nursinguganda.com</code>). It is <strong>NOT</strong> an accredited university transcript, statutory clinical practicing license, or official credential from UNMEB, UNMC, or the Ministry of Health Uganda.
        </div>
      </div>
    </div>
  );
}
