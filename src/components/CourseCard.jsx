import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Star } from "lucide-react";
import { formatUgxApprox, formatUsd, useApp } from "../context/AppContext";
import { getDiscountPercent } from "../utils/offers";

export default function CourseCard({ course }) {
  const { isEnrolled } = useApp();
  const enrolled = isEnrolled(course.slug, course.isFree);

  const badgeClass = course.isFree
    ? "nu-badge-free"
    : course.badge === "Bestseller"
      ? "nu-badge-bestseller"
      : "nu-badge-highyield";

  return (
    <Link to={course.customRoute || `/course/${course.slug}`} className="nu-course-card">
      <div className="nu-card-thumb">
        <img
          src={course.thumbnail || "/assets/images/udemy/cat-medsurg.webp"}
          alt={course.title}
          width="560"
          height="315"
          loading="lazy"
          decoding="async"
          onError={(e) => {
            if (!e.currentTarget.dataset.fb) {
              e.currentTarget.dataset.fb = "1";
              e.currentTarget.src = "/assets/images/udemy/cat-medsurg.webp";
            }
          }}
        />
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
