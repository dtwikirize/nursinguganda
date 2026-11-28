import React from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  Award,
  Baby,
  BookOpen,
  Brain,
  Clock,
  Eye,
  HeartPulse,
  Microscope,
  Pill,
  ShieldCheck,
  Stethoscope
} from "lucide-react";
import { formatUsd, useApp } from "../context/AppContext";
import { courseFacts } from "../utils/courseFacts";

const DESIGN_PALETTES = {
  "Anatomy & Physiology": { orb: "rgba(96, 165, 250, 0.72)", core: "#2563eb", Icon: HeartPulse },
  "Medical-Surgical Nursing": { orb: "rgba(168, 85, 247, 0.78)", core: "#6d28d9", Icon: Activity },
  "Pharmacology": { orb: "rgba(45, 212, 191, 0.68)", core: "#0d9488", Icon: Pill },
  "Midwifery & Maternal Health": { orb: "rgba(192, 132, 252, 0.82)", core: "#7e22ce", Icon: Baby },
  "Paediatrics & Child Health": { orb: "rgba(129, 140, 248, 0.78)", core: "#4338ca", Icon: Baby },
  "Community & Public Health": { orb: "rgba(52, 211, 153, 0.68)", core: "#059669", Icon: ShieldCheck },
  "Foundations of Nursing": { orb: "rgba(167, 139, 250, 0.78)", core: "#5b21b6", Icon: Stethoscope },
  "Mental Health & Psychology": { orb: "rgba(217, 70, 239, 0.72)", core: "#86198f", Icon: Brain },
  "Microbiology & Pathology": { orb: "rgba(56, 189, 248, 0.72)", core: "#0284c7", Icon: Microscope },
  "Leadership, Research & Ethics": { orb: "rgba(168, 85, 247, 0.74)", core: "#581c87", Icon: Award },
  "International Licensure & NCLEX": { orb: "rgba(192, 132, 252, 0.85)", core: "#6b21a8", Icon: BookOpen }
};

export default function CourseCard({ course }) {
  const { isEnrolled } = useApp();
  const enrolled = isEnrolled(course.slug, course.isFree);

  const badgeClass = course.isFree ? "nu-badge-free" : "nu-badge-highyield";
  const { studyHours, updatedLabel } = courseFacts(course);

  const theme = DESIGN_PALETTES[course.category] || { orb: "rgba(168, 85, 247, 0.76)", core: "#6d28d9", Icon: BookOpen };
  const IconComp = theme.Icon;
  const displayUnitTitle = String(course.title || "").replace(/^(CN|DN|CM|DM)\s*\d+\s*[-–·:]\s*/i, "").trim();

  return (
    <Link to={course.customRoute || `/course/${course.slug}`} className="nu-course-card">
      <div className="nu-card-thumb nu-card-thumb--editorial">
        <span
          className="nu-series-orb"
          style={{
            background: `radial-gradient(circle at 38% 48%, ${theme.orb} 0%, ${theme.core} 42%, rgba(9, 8, 18, 0) 74%)`
          }}
          aria-hidden="true"
        />
        <svg className="nu-series-constellation" viewBox="0 0 150 146" fill="none" aria-hidden="true">
          <g stroke="rgba(226, 232, 240, 0.34)" strokeWidth="0.8">
            <line x1="68" y1="22" x2="104" y2="48" />
            <line x1="104" y1="48" x2="134" y2="30" />
            <line x1="104" y1="48" x2="92" y2="86" />
            <line x1="92" y1="86" x2="132" y2="76" />
            <line x1="92" y1="86" x2="118" y2="120" />
            <line x1="60" y1="68" x2="92" y2="86" />
          </g>
          <g fill="rgba(248, 250, 252, 0.78)">
            <circle cx="68" cy="22" r="2" />
            <circle cx="104" cy="48" r="2.6" />
            <circle cx="134" cy="30" r="1.8" />
            <circle cx="92" cy="86" r="2.4" />
            <circle cx="132" cy="76" r="1.9" />
            <circle cx="118" cy="120" r="1.7" />
            <circle cx="60" cy="68" r="1.6" />
          </g>
        </svg>

        <div className="nu-card-editorial-inner">
          <div className="nu-card-editorial-top">
            <span className="nu-card-editorial-code">{course.category || "Clinical Unit"}</span>
          </div>
          <div className="nu-card-editorial-mid">
            <span style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
              {displayUnitTitle}
            </span>
          </div>
          <div className="nu-series-badges">
            <span className="nu-series-micro" title={course.programmeLabel}>
              <IconComp size={12} strokeWidth={2.2} />
            </span>
            <span className="nu-series-micro">NU</span>
            <span className="nu-series-micro">{course.isFree ? "FREE" : "PRO"}</span>
          </div>
        </div>
      </div>

      <div className="nu-card-body">
        <h3 className="nu-card-title">{displayUnitTitle}</h3>
        <div className="nu-card-meta">
          {course.programmeLabel} · {course.lessonCount} lessons
        </div>

        <div className="nu-card-facts">
          {studyHours && (
            <span className="nu-card-fact">
              <Clock size={12} strokeWidth={2.2} aria-hidden="true" /> {studyHours}
            </span>
          )}
          {course.freePreviewCount > 0 && (
            <span className="nu-card-fact">
              <Eye size={12} strokeWidth={2.2} aria-hidden="true" /> {course.freePreviewCount} free
              {course.freePreviewCount === 1 ? " preview" : " previews"}
            </span>
          )}
          {updatedLabel && <span className="nu-card-fact">Updated {updatedLabel}</span>}
        </div>

        <div className="nu-price-row">
          <span className="nu-price-now">
            {enrolled && !course.isFree ? "Enrolled" : formatUsd(course.priceUsd)}
          </span>
        </div>

        <span className={`nu-badge ${badgeClass}`}>
          {enrolled && !course.isFree ? "Unlocked" : course.badge}
        </span>
      </div>
    </Link>
  );
}
