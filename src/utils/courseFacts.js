/**
 * Verifiable course facts.
 *
 * These replace the previously generated rating / reviewCount / studentCount
 * metrics. Every value here is derived from the real course record, so it can
 * be defended if a learner or a regulator asks where the number came from.
 */

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

/** "~4 h study" / "35 min study" from totalMinutes. Empty when unknown. */
export function formatStudyTime(totalMinutes) {
  const mins = Number(totalMinutes || 0);
  if (!mins) return "";
  if (mins < 90) return `${Math.round(mins)} min study`;
  const hours = mins / 60;
  return `~${hours < 10 ? hours.toFixed(1).replace(/\.0$/, "") : Math.round(hours)} h study`;
}

/** "Nov 2026" from an updatedAt of "2026-11". Empty when unparseable. */
export function formatUpdated(updatedAt) {
  const match = /^(\d{4})-(\d{2})/.exec(String(updatedAt || ""));
  if (!match) return "";
  const monthIndex = Number(match[2]) - 1;
  if (monthIndex < 0 || monthIndex > 11) return "";
  return `${MONTHS[monthIndex]} ${match[1]}`;
}

/** Compact fact strings for a course card. */
export function courseFacts(course = {}) {
  return {
    studyHours: formatStudyTime(course.totalMinutes),
    updatedLabel: formatUpdated(course.updatedAt),
    lessonCount: Number(course.lessonCount || 0),
    freePreviewCount: Number(course.freePreviewCount || 0)
  };
}
