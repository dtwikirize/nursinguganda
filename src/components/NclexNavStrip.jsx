import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Award, BookOpen, ClipboardCheck, GraduationCap } from "lucide-react";
import CountryFlag from "./CountryFlag";

export default function NclexNavStrip() {
  const { pathname } = useLocation();
  const isOverview = pathname === "/nclex-rn";
  const isPlayer = pathname.startsWith("/nclex-rn/learn") || pathname.startsWith("/nclex-rn/unit");
  const isExams = pathname.startsWith("/nclex-rn/exams");

  const linkStyle = (active) => ({
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "10px 14px",
    fontSize: "0.84rem",
    fontWeight: active ? 700 : 500,
    color: active ? "#ffffff" : "rgba(255,255,255,0.8)",
    borderBottom: active ? "3px solid #ffffff" : "3px solid transparent",
    textDecoration: "none",
    whiteSpace: "nowrap"
  });

  return (
    <div style={{ background: "#09090B", borderBottom: "1px solid #27272A" }}>
      <div
        className="nu-container"
        style={{
          maxWidth: 1180,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          overflowX: "auto",
          scrollbarWidth: "none"
        }}
      >
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "#ffffff", fontWeight: 700, fontSize: "0.84rem", whiteSpace: "nowrap", padding: "8px 0" }}>
          <CountryFlag code="US" width={16} />
          <span>NCLEX-RN Academy</span>
        </div>

        <nav style={{ display: "flex", alignItems: "stretch", gap: 4 }} aria-label="NCLEX-RN Academy Navigation">
          <Link to="/nclex-rn" style={linkStyle(isOverview)}>
            <GraduationCap size={15} /> 16-Week Course ($99)
          </Link>
          <Link to="/nclex-rn/learn" style={linkStyle(isPlayer)}>
            <BookOpen size={15} /> Study Player &amp; Unit Quizzes
          </Link>
          <Link to="/nclex-rn/exams" style={linkStyle(isExams)}>
            <ClipboardCheck size={15} /> NCLEX-RN Examinations
          </Link>
          <Link to="/nursing-usa" style={linkStyle(false)}>
            <Award size={15} /> USA Hub
          </Link>
        </nav>
      </div>
    </div>
  );
}
