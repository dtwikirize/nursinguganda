import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Star } from "lucide-react";
import { formatUgxApprox, formatUsd, useApp } from "../context/AppContext";
import { getDiscountPercent } from "../utils/offers";

export default function CourseCard({ course }) {
  const { isEnrolled } = useApp();
  const enrolled = isEnrolled(course.slug, course.isFree);
  const discountPct = !course.isFree && !enrolled ? getDiscountPercent(course.priceUsd, course.compareAtUsd) : 0;

  const badgeClass = course.isFree
    ? "nu-badge-free"
    : course.badge === "Bestseller"
      ? "nu-badge-bestseller"
      : "nu-badge-highyield";

  return (
    <Link to={`/course/${course.slug}`} className="nu-course-card">
      <div className="nu-card-thumb">
        <img
          src={course.thumbnail}
          alt={course.title}
          width="560"
          height="315"
          loading="lazy"
          decoding="async"
        />
        <div className="nu-card-overlay" aria-hidden="true" />
        {course.code && <span className="nu-card-code">{course.code}</span>}
        <span className="nu-card-hover-pill" aria-hidden="true">
          Preview Unit <ArrowRight size={12} />
        </span>
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
              <Star key={i} size={13} fill="#e59819" stroke="#e59819" />
            ))}
          </span>
          <span className="nu-rating-count">({course.reviewCount || 120})</span>
        </div>

        <div className="nu-price-row">
          <span className="nu-price-now">
            {enrolled && !course.isFree ? "Enrolled" : formatUsd(course.priceUsd)}
          </span>
          {!course.isFree && !enrolled && course.compareAtUsd > course.priceUsd && (
            <span className="nu-price-was">${course.compareAtUsd.toFixed(2)}</span>
          )}
          {discountPct > 0 && (
            <span className="nu-price-cut-badge">{discountPct}% OFF</span>
          )}
          {!course.isFree && (
            <span className="nu-ugx-hint">{formatUgxApprox(course.priceUsd)}</span>
          )}
        </div>

        <span className={`nu-badge ${badgeClass}`}>
          {enrolled && !course.isFree ? "Unlocked" : course.badge}
        </span>
      </div>
    </Link>
  );
}
