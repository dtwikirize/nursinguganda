#!/usr/bin/env node
/**
 * Builds 1 lightweight Master Full-Programme Course JSON per programme (`assets/data/courses/full-<progId>.json`)
 * and registers them under `catalog.fullCourses` inside `assets/data/catalog.json`.
 * Keeps payload tiny (< 60 KB per master file) by referencing `sourceCourseSlug` per topic for lazy loading.
 */
// ⚠️ DISABLED — this legacy generator emitted fabricated rating / reviewCount /
// studentCount / compareAtUsd fields, which were removed from the live site as
// misleading commercial claims. Do not run it without stripping those first.
throw new Error(
  "build_full_programme_courses.js is disabled: it generates fabricated ratings, " +
  "review counts, student counts and reference prices. See scripts/split_curriculum.js."
);

const fs = require("node:fs");
const path = require("node:path");

const ROOT = process.cwd();
const CATALOG_PATH = path.join(ROOT, "assets", "data", "catalog.json");
const COURSES_DIR = path.join(ROOT, "assets", "data", "courses");

function yearOrderKey(y, s) {
  const yn = parseInt(String(y || "").replace(/\D+/g, ""), 10) || 1;
  const sn = parseInt(String(s || "").replace(/\D+/g, ""), 10) || 1;
  return yn * 10 + sn;
}

function main() {
  const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, "utf8"));
  const courses = catalog.courses || [];
  const programmes = catalog.programmes || [];
  const fullCourses = [];

  for (const prog of programmes) {
    const progUnits = courses
      .filter((c) => c.programmeId === prog.id)
      .sort((a, b) => yearOrderKey(a.year, a.semester) - yearOrderKey(b.year, b.semester));

    if (!progUnits.length) continue;

    const fullSlug = `full-${prog.id}`;
    const seenTopicSlugs = new Set();
    const mergedGroups = [];
    const mergedOutcomes = [];
    const mergedRefsMap = new Map();
    const unitSlugs = [];
    let totalMinutes = 0;
    let totalLessons = 0;
    let totalPaidValue = 0;

    for (const unitSummary of progUnits) {
      unitSlugs.push(unitSummary.slug);
      totalPaidValue += Number(unitSummary.compareAtUsd || unitSummary.priceUsd || 0);
      const unitPath = path.join(COURSES_DIR, `${unitSummary.slug}.json`);
      if (!fs.existsSync(unitPath)) continue;
      const unitData = JSON.parse(fs.readFileSync(unitPath, "utf8"));

      for (const r of unitData.references || []) {
        if (r?.id && !mergedRefsMap.has(r.id)) mergedRefsMap.set(r.id, r);
      }
      for (const out of unitData.learningOutcomes || []) {
        if (mergedOutcomes.length < 8 && !mergedOutcomes.includes(out)) mergedOutcomes.push(out);
      }

      const unitTopics = [];
      for (const grp of unitData.topicGroups || []) {
        for (const t of grp.topics || []) {
          if (seenTopicSlugs.has(t.slug)) continue;
          seenTopicSlugs.add(t.slug);
          const isFreePreview = totalLessons < 3; // First 3 topics across full programme open as Free Preview
          unitTopics.push({
            slug: t.slug,
            title: t.title,
            readMinutes: Number(t.readMinutes || 12),
            wordCount: Number(t.wordCount || 1500),
            isFreePreview,
            sourceCourseSlug: unitSummary.slug
          });
          totalMinutes += Number(t.readMinutes || 12);
          totalLessons++;
        }
      }

      if (unitTopics.length > 0) {
        const yrLabel = String(unitSummary.year || "year-1").replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase());
        const smLabel = String(unitSummary.semester || "semester-1").replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase());
        mergedGroups.push({
          title: `${yrLabel} ${smLabel} · ${unitSummary.code ? `${unitSummary.code} — ` : ""}${unitSummary.title}`,
          unitSlug: unitSummary.slug,
          topics: unitTopics
        });
      }
    }

    const bundlePriceUsd = Number(prog.bundlePriceUsd || 19.99);
    const compareAtUsd = Number(Math.max(bundlePriceUsd * 2.2, totalPaidValue).toFixed(2));
    const summaryObj = {
      slug: fullSlug,
      unitId: `full-curriculum-${prog.id}`,
      code: "FULL CURRICULUM",
      title: `${prog.label} — Complete Full Curriculum (${progUnits.length} Units)`,
      subtitle: `All ${progUnits.length} units (${totalLessons} organized clinical topics) across every semester + 109 UNMEB past papers in one structured programme player.`,
      programmeId: prog.id,
      programmeLabel: prog.label,
      year: "all-years",
      semester: "complete",
      category: progUnits[0]?.category || "Foundations of Nursing",
      thumbnail: progUnits[0]?.thumbnail || "/assets/images/udemy/hero-banner.webp",
      lessonCount: totalLessons,
      unitCount: progUnits.length,
      freePreviewCount: Math.min(3, totalLessons),
      totalMinutes,
      isFree: false,
      isFullProgramme: true,
      priceUsd: bundlePriceUsd,
      compareAtUsd,
      rating: 4.9,
      reviewCount: progUnits.reduce((s, u) => s + Number(u.reviewCount || 40), 0),
      studentCount: Math.max(...progUnits.map((u) => Number(u.studentCount || 400))),
      badge: "Full Curriculum",
      clinicalReviewer: "Nursing Uganda Editorial & Clinical Review Team",
      updatedAt: "2026-11",
      learningOutcomes: mergedOutcomes,
      courseSlugs: [fullSlug, `bundle-${prog.id}`, "unmeb-mock-pass", ...unitSlugs]
    };

    const fullPayload = {
      ...summaryObj,
      references: Array.from(mergedRefsMap.values()).slice(0, 6),
      unitSlugs,
      topicGroups: mergedGroups,
      lessons: {} // Loaded lazily on demand from topic.sourceCourseSlug
    };

    fs.writeFileSync(path.join(COURSES_DIR, `${fullSlug}.json`), JSON.stringify(fullPayload, null, 2));
    fullCourses.push(summaryObj);
    console.log(`Built ${fullSlug}.json (${progUnits.length} units, ${totalLessons} unique topics, $${bundlePriceUsd})`);
  }

  catalog.fullCourses = fullCourses;
  catalog.generatedAtUtc = new Date().toISOString();
  fs.writeFileSync(CATALOG_PATH, JSON.stringify(catalog, null, 2));
  console.log("Updated catalog.json with", fullCourses.length, "fullCourses.");
}

main();
