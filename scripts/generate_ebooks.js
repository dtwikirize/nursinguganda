#!/usr/bin/env node
/**
 * Synthesizes 8 comprehensive Free Referenced Study eBooks into assets/data/ebooks.json
 * directly from verified course payloads and assets/data/references.json.
 */
const fs = require("node:fs");
const path = require("node:path");

const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, "assets", "data");
const COURSES_DIR = path.join(DATA_DIR, "courses");
const REFERENCES = JSON.parse(fs.readFileSync(path.join(DATA_DIR, "references.json"), "utf8")).references;
const CATALOG = JSON.parse(fs.readFileSync(path.join(DATA_DIR, "catalog.json"), "utf8"));

const EBOOK_SPECS = [
  {
    slug: "anatomy-physiology-high-yield-guide",
    title: "Human Anatomy & Physiology High-Yield Study eBook",
    subtitle: "Body organization, homeostasis, cardiovascular, respiratory, and organ systems for Ugandan nursing students.",
    category: "Anatomy & Physiology",
    coverImage: "/assets/images/udemy/cat-anatomy.png",
    keywords: ["anatomy", "physiology", "homeostasis", "cardiovascular", "blood"],
    refIds: ["openstax-ap-2e", "tortora-ap-16e", "unmeb-curriculum-ug", "openrn-fundamentals"]
  },
  {
    slug: "pharmacology-drug-calculations-uganda",
    title: "Nursing Pharmacology & Drug Calculations Handbook",
    subtitle: "Essential drug classes, antibiotics, IV drip rates, paediatric mg/kg dosing, and safe medication administration.",
    category: "Pharmacology",
    coverImage: "/assets/images/udemy/cat-pharmacology.png",
    keywords: ["pharmacology", "drug", "medication", "antibiotic", "dose"],
    refIds: ["openrn-pharmacology-2e", "rang-dale-pharmacology", "ug-ucg-2023", "openrn-skills"]
  },
  {
    slug: "maternal-obstetric-emergencies-midwifery",
    title: "Maternal Health & Obstetric Emergencies Pocket eBook",
    subtitle: "Antenatal assessment, partograph monitoring, PPH, pre-eclampsia/eclampsia, and safe delivery protocols.",
    category: "Midwifery & Maternal Health",
    coverImage: "/assets/images/udemy/cat-midwifery.png",
    keywords: ["midwifery", "obstetric", "antenatal", "labour", "maternal", "postnatal"],
    refIds: ["who-maternal-2025", "who-impac-2017", "myles-midwives-17e", "ug-ucg-2023"]
  },
  {
    slug: "newborn-paediatric-nursing-essentials",
    title: "Newborn & Paediatric Nursing Care Essentials",
    subtitle: "APGAR scoring, neonatal resuscitation, Kangaroo Mother Care, IMCI, and childhood immunisation schedules.",
    category: "Paediatrics & Child Health",
    coverImage: "/assets/images/udemy/cat-paediatrics.png",
    keywords: ["paediatric", "pediatric", "newborn", "child", "immun"],
    refIds: ["who-newborn-2017", "who-pocketbook-children", "ug-ucg-2023", "ug-unepi-immunization"]
  },
  {
    slug: "medical-surgical-acute-care-guide",
    title: "Medical-Surgical & Acute Care Nursing Revision Guide",
    subtitle: "Shock, hypertension, diabetes, perioperative care, fluid balance, and emergency resuscitation priorities.",
    category: "Medical-Surgical Nursing",
    coverImage: "/assets/images/udemy/cat-medsurg.png",
    keywords: ["medical", "surgical", "first aid", "shock", "emergency"],
    refIds: ["brunner-suddarth-15e", "ug-ucg-2023", "ifrc-first-aid", "openrn-skills"]
  },
  {
    slug: "infection-prevention-control-foundations",
    title: "Infection Prevention, Asepsis & Clinical Foundations",
    subtitle: "WHO 6-step hand hygiene, sterile fields, biomedical waste, vital signs, and safe bedside nursing procedures.",
    category: "Foundations of Nursing",
    coverImage: "/assets/images/udemy/cat-foundations.png",
    keywords: ["foundations", "infection", "microbiology", "asepsis", "hygiene"],
    refIds: ["who-ipc-manual", "openrn-fundamentals", "openrn-skills", "potter-perry-11e"]
  },
  {
    slug: "community-public-health-uganda",
    title: "Community Health, Primary Care & Nutrition in Uganda",
    subtitle: "UNEPI immunisation, sanitation, epidemiology, malaria prevention, and acute malnutrition management.",
    category: "Community & Public Health",
    coverImage: "/assets/images/udemy/cat-community.png",
    keywords: ["community", "primary health", "commun", "nutrition", "epidemiol"],
    refIds: ["ug-unepi-immunization", "who-nutrition-ug", "ug-ucg-2023", "openstax-microbiology"]
  },
  {
    slug: "mental-health-ethics-unmeb-prep",
    title: "Mental Health Nursing, Ethics & UNMEB Exam Guide",
    subtitle: "Therapeutic communication, psychiatric emergencies, UNMC ethics, nursing leadership, and exam technique.",
    category: "Leadership, Research & Ethics",
    coverImage: "/assets/images/udemy/cat-mental-health.png",
    keywords: ["mental", "psych", "ethics", "management", "research"],
    refIds: ["openrn-mental-health", "unmc-scope-ethics", "openrn-management", "polit-beck-research", "unmeb-curriculum-ug"]
  }
];

function main() {
  const ebooks = [];
  const globalUsedSlugs = new Set();

  for (const spec of EBOOK_SPECS) {
    // Prioritize exact category matches first, then keyword matches
    const exactCourses = CATALOG.courses.filter((c) => c.category === spec.category);
    const keywordCourses = CATALOG.courses.filter((c) => {
      if (c.category === spec.category) return false;
      const text = `${c.title} ${c.category}`.toLowerCase();
      return spec.keywords.some((k) => text.includes(k));
    });
    const matchingCourses = [...exactCourses, ...keywordCourses];

    const chapters = [];
    let relatedCourseSlug = matchingCourses[0]?.slug || CATALOG.courses[0]?.slug;

    for (const c of matchingCourses) {
      const courseFile = path.join(COURSES_DIR, `${c.slug}.json`);
      if (!fs.existsSync(courseFile)) continue;
      const courseData = JSON.parse(fs.readFileSync(courseFile, "utf8"));
      for (const [lSlug, lesson] of Object.entries(courseData.lessons || {})) {
        if (globalUsedSlugs.has(lSlug)) continue;
        if ((lesson.wordCount || 0) < 180) continue;
        globalUsedSlugs.add(lSlug);
        chapters.push({
          chapterNumber: chapters.length + 1,
          slug: lSlug,
          title: lesson.title,
          excerpt: lesson.excerpt,
          wordCount: lesson.wordCount,
          sections: (lesson.sections || []).slice(0, 5),
          chapterReferences: lesson.references || []
        });
        if (chapters.length >= 6) break;
      }
      if (chapters.length >= 6) break;
    }

    const references = spec.refIds
      .map((id) => REFERENCES.find((r) => r.id === id))
      .filter(Boolean);

    const totalWords = chapters.reduce((acc, ch) => acc + (ch.wordCount || 0), 0);

    ebooks.push({
      slug: spec.slug,
      title: spec.title,
      subtitle: spec.subtitle,
      category: spec.category,
      coverImage: spec.coverImage,
      relatedCourseSlug,
      clinicalReviewer: "Nursing Uganda Editorial & Clinical Review Team",
      updatedAt: "November 2026",
      totalWords,
      estimatedPages: Math.max(12, Math.round(totalWords / 260)),
      chapters,
      references
    });
  }

  fs.writeFileSync(path.join(DATA_DIR, "ebooks.json"), JSON.stringify({ generatedAtUtc: new Date().toISOString(), ebooks }, null, 2));
  console.log("Generated Free Referenced eBooks:", ebooks.map((e) => ({ slug: e.slug, chapters: e.chapters.length, refs: e.references.length, words: e.totalWords })));
}

main();
