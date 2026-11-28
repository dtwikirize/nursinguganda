import React from "react";
import { Link } from "react-router-dom";
import { ExternalLink, Eye, Sparkles } from "lucide-react";
import MedicalImageFrame from "./MedicalImageFrame";

export default function QuestionRationalePlate({ plate }) {
  if (!plate || !plate.file) return null;

  return (
    <div
      style={{
        marginTop: 14,
        borderRadius: 8,
        border: "1.5px solid #cbd5e1",
        background: "#ffffff",
        overflow: "hidden",
        boxShadow: "0 2px 6px rgba(15, 41, 66, 0.06)"
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 8,
          padding: "8px 12px",
          background: "#0F2942",
          color: "#ffffff"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Sparkles size={14} color="#60a5fa" />
          <strong style={{ fontSize: "0.82rem", letterSpacing: "0.02em" }}>
            Visual Clinical Rationale: {plate.title}
          </strong>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.74rem", color: "#94a3b8" }}>
          <Eye size={13} />
          <span>Click plate for full-screen zoom</span>
        </div>
      </div>

      <div style={{ background: "#f8fafc", padding: "6px" }}>
        <MedicalImageFrame
          src={plate.file}
          alt={plate.title}
          title={plate.title}
          caption={plate.title}
          allowFocus={true}
          style={{ maxHeight: 380, margin: "0 auto" }}
        />
      </div>

      {plate.clinicalPearl && (
        <div
          style={{
            padding: "10px 14px",
            background: "#eff6ff",
            borderTop: "1px solid #bfdbfe",
            fontSize: "0.84rem",
            color: "#1e3a8a",
            lineHeight: 1.45
          }}
        >
          <strong style={{ color: "#1e40af" }}>Bedside Clinical Pearl:</strong>{" "}
          <span>{plate.clinicalPearl}</span>
        </div>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          padding: "6px 12px",
          background: "#f8fafc",
          borderTop: "1px solid #e2e8f0"
        }}
      >
        <Link
          to="/medical-images"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            fontSize: "0.75rem",
            fontWeight: 600,
            color: "#2563eb",
            textDecoration: "none"
          }}
        >
          Open 153-Plate Medical Illustrations Atlas <ExternalLink size={12} />
        </Link>
      </div>
    </div>
  );
}
