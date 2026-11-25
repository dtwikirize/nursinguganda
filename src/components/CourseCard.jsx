import React from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  Award,
  Baby,
  BookOpen,
  Brain,
  HeartPulse,
  Microscope,
  Pill,
  ShieldCheck,
  Star,
  Stethoscope
} from "lucide-react";
import { formatUsd, useApp } from "../context/AppContext";

const DESIGN_PALETTES = {
  "Anatomy & Physiology": { bg: "#102A43", accent: "#334E68", Icon: HeartPulse },
  "Medical-Surgical Nursing": { bg: "#1C1D1F", accent: "#374151", Icon: Activity },
  "Pharmacology": { bg: "#064E3B", accent: "#0F766E", Icon: Pill },
  "Midwifery & Maternal Health": { bg: "#4C1D95", accent: "#6D28D9", Icon: Baby },
  "Paediatrics & Child Health": { bg: "#1E3A8A", accent: "#1D4ED8", Icon: Baby },
  "Community & Public Health": { bg: "#14532D", accent: "#15803D", Icon: ShieldCheck },
  "Foundations of Nursing": { bg: "#1E293B", accent: "#334155", Icon: Stethoscope },
  "Mental Health & Psychology": { bg: "#3B0764", accent: "#581C87", Icon: Brain },
  "Microbiology & Pathology": { bg: "#134E4A", accent: "#0F766E", Icon: Microscope },
  "Leadership, Research & Ethics": { bg: "#27272A", accent: "#3F3F46", Icon: Award },
  "International Licensure & NCLEX": { bg: "#7F1D1D", accent: "#991B1B", Icon: BookOpen }
};

export default function CourseCard({ course }) {
  const { isEnrolled } = useApp();
  const enrolled = isEnrolled(course.slug, course.isFree);

  const badgeClass = course.isFree
    ? "nu-badge-free"
    : course.badge === "Bestseller"
      ? "nu-badge-bestseller"
      : "nu-badge-highyield";

  const theme = DESIGN_PALETTES[course.category] || { bg: "#1C1D1F", accent: "#334155", Icon: BookOpen };
  const IconComp = theme.Icon;
  const yearLabel = course.year ? course.year.replace(/-/g, " ").toUpperCase() : "CLINICAL UNIT";

  return (
    <Link to={course.customRoute || `/course/${course.slug}`} className="nu-course-card">
      <div
        className="nu-card-thumb nu-card-thumb--editorial"
        style={{
          background: `linear-gradient(135deg, ${theme.bg} 0%, ${theme.accent} 100%)`
        }}
      >
        <span className="nu-card-editorial-grid" aria-hidden="true" />
        <IconComp className="nu-card-editorial-wm" size={76} strokeWidth={1.25} aria-hidden="true" />
        <div className="nu-card-editorial-inner">
          <div className="nu-card-editorial-top">
            <span className="nu-card-editorial-code">{course.code || yearLabel}</span>
            <span className="nu-card-editorial-cat">{course.category || "Nursing"}</span>
          </div>
          <div className="nu-card-editorial-mid">
            <IconComp size={20} strokeWidth={1.9} />
            <span>{course.programmeLabel}</span>
          </div>
        </div>
      </div>

      <div className="nu-card-body">
        <h3 className="nu-card-title">{course.title}</h3>
        <div className="nu-card-meta">
          {course.programmeLabel} · {course.lessonCount} lessons
        </div>

        <div className="nu-rating-row">
          <span className="nu-rating-num">{Number(course.rating || 4.8).toFixed(1)}</span>
          <span className="nu-stars" aria-label={`Rated ${course.rating} out of 5`}>
            {[0, 1, 2, 3, 4].map((i) => (
              <Star key={i} size={12} fill="#b4690e" stroke="#b4690e" />
            ))}
          </span>
          <span className="nu-rating-count">({(course.reviewCount || 120).toLocaleString()})</span>
        </div>

        <div className="nu-price-row">
          <span className="nu-price-now">
            {enrolled && !course.isFree ? "Enrolled" : formatUsd(course.priceUsd)}
          </span>
          {!course.isFree && !enrolled && course.compareAtUsd > course.priceUsd && (
            <span className="nu-price-was">${course.compareAtUsd.toFixed(2)}</span>
          )}
        </div>

        <span className={`nu-badge ${badgeClass}`}>
          {enrolled && !course.isFree ? "Unlocked" : course.badge}
        </span>
      </div>
    </Link>
  );
}
