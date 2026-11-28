/**
 * Bundle pricing.
 *
 * `separatelyUsd` is the real total of what the bundled units cost when bought
 * one at a time. It is a like-for-like comparison, not a former price, and the
 * UI must label it "if bought separately" — never "was".
 *
 * The previous `compareAtUsd` fields were invented anchors (per-course values
 * were literally `priceUsd * 2.2`), which is a fictitious reference price under
 * the UK DMCC Act 2024, the EU Omnibus Directive, the FTC Act and the ACL.
 */

export const UNMEB_PASS_ITEM = {
  slug: "unmeb-mock-pass",
  title: "UNMEB / UHPAB Full Past Papers & Mock Exam Pass (109+ Papers)",
  code: "UNMEB-PASS",
  programmeLabel: "All Nursing & Midwifery Programmes",
  thumbnail: "/assets/images/udemy/cat-research.webp",
  priceUsd: 4.99,
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
  lessonCount: 779,
  type: "bundle",
  courseSlugs: ["all-access-pass", "unmeb-mock-pass"]
};

/** Real sum of individual unit prices — what these units actually cost one by one. */
function sumSeparately(courses = []) {
  return Number(
    courses
      .filter((c) => c && !c.isFree)
      .reduce((sum, c) => sum + Number(c.priceUsd || 0), 0)
      .toFixed(2)
  );
}

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
    separatelyUsd: sumSeparately(courses) + UNMEB_PASS_ITEM.priceUsd,
    courseSlugs: allSlugs
  };
}

export function getProgrammeBundleItem(programme, courses = []) {
  if (!programme?.id) return null;
  const progCourses = courses.filter((c) => c.programmeId === programme.id);
  const separatelyUsd = sumSeparately(progCourses);
  return {
    slug: `bundle-${programme.id}`,
    title: `${programme.label} Full Programme Bundle (${progCourses.length} Units)`,
    code: "PROG-BUNDLE",
    programmeLabel: programme.label,
    thumbnail: progCourses[0]?.thumbnail || "/assets/images/udemy/cat-foundations.webp",
    priceUsd: Number(programme.bundlePriceUsd || 19.99),
    separatelyUsd,
    lessonCount: progCourses.reduce((sum, c) => sum + Number(c.lessonCount || 0), 0),
    type: "bundle",
    courseSlugs: [`bundle-${programme.id}`, `full-${programme.id}`, "unmeb-mock-pass", ...progCourses.map((c) => c.slug)]
  };
}

/**
 * How much a bundle saves against buying its units separately.
 * Only ever call this with a real `separatelyUsd`, never an invented anchor.
 */
export function getBundleSavingPercent(priceUsd, separatelyUsd) {
  const p = Number(priceUsd || 0);
  const s = Number(separatelyUsd || 0);
  if (p <= 0 || s <= p) return 0;
  return Math.round(((s - p) / s) * 100);
}
