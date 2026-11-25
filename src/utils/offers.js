export const UNMEB_PASS_ITEM = {
  slug: "unmeb-mock-pass",
  title: "UNMEB / UHPAB Full Past Papers & Mock Exam Pass (109+ Papers)",
  code: "UNMEB-PASS",
  programmeLabel: "All Nursing & Midwifery Programmes",
  thumbnail: "/assets/images/udemy/cat-research.webp",
  priceUsd: 4.99,
  compareAtUsd: 9.99,
  lessonCount: 109,
  type: "bundle",
  courseSlugs: ["unmeb-mock-pass"]
};

export const ALL_ACCESS_PASS_ITEM = {
  slug: "all-access-pass",
  title: "Full Platform All-Access Pass (All 85 Courses + 109 UNMEB Papers)",
  code: "ALL-ACCESS",
  programmeLabel: "All 6 Programmes · Complete Site Access",
  thumbnail: "/assets/images/udemy/hero-banner.webp",
  priceUsd: 34.99,
  compareAtUsd: 139.99,
  lessonCount: 779,
  type: "bundle",
  courseSlugs: ["all-access-pass", "unmeb-mock-pass"]
};

export function getAllAccessCartItem(courses = []) {
  const allSlugs = Array.from(
    new Set([
      "all-access-pass",
      "unmeb-mock-pass",
      ...courses.map((c) => c?.slug).filter(Boolean)
    ])
  );
  return {
    ...ALL_ACCESS_PASS_ITEM,
    lessonCount: courses.reduce((sum, c) => sum + Number(c?.lessonCount || 0), 0) || 779,
    courseSlugs: allSlugs
  };
}

export function getProgrammeBundleItem(programme, courses = []) {
  if (!programme?.id) return null;
  const progCourses = courses.filter((c) => c.programmeId === programme.id);
  const totalCompare = progCourses
    .filter((c) => !c.isFree)
    .reduce((sum, c) => sum + Number(c.compareAtUsd || c.priceUsd || 0), 0);
  return {
    slug: `bundle-${programme.id}`,
    title: `${programme.label} Full Programme Bundle (${progCourses.length} Units)`,
    code: "PROG-BUNDLE",
    programmeLabel: programme.label,
    thumbnail: progCourses[0]?.thumbnail || "/assets/images/udemy/cat-foundations.webp",
    priceUsd: Number(programme.bundlePriceUsd || 19.99),
    compareAtUsd: Number(Math.max(Number(programme.bundlePriceUsd || 19.99) * 2, totalCompare).toFixed(2)),
    lessonCount: progCourses.reduce((sum, c) => sum + Number(c.lessonCount || 0), 0),
    type: "bundle",
    courseSlugs: [`bundle-${programme.id}`, `full-${programme.id}`, "unmeb-mock-pass", ...progCourses.map((c) => c.slug)]
  };
}

export function getDiscountPercent(priceUsd, compareAtUsd) {
  const p = Number(priceUsd || 0);
  const c = Number(compareAtUsd || 0);
  if (p <= 0 || c <= p) return 0;
  return Math.round(((c - p) / c) * 100);
}
