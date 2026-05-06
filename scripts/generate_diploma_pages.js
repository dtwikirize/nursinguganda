#!/usr/bin/env node
/* Generate Diploma in Nursing pages from curriculum-tree.json. */
const fs = require("node:fs");
const path = require("node:path");

const ROOT = process.cwd();
const PROGRAMME_ROOT = path.join(ROOT, "programmes", "diploma-nursing");
const CURRICULUM_FILE = path.join(PROGRAMME_ROOT, "curriculum-tree.json");

function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function yearNumberFromKey(key) {
  const m = key.match(/year-(\d+)/);
  return m ? Number(m[1]) : null;
}

function semesterNumberFromKey(key) {
  const m = key.match(/semester-(\d+)/);
  return m ? Number(m[1]) : null;
}

function relToRoot(fromDir) {
  const rel = path.relative(fromDir, ROOT).replace(/\\/g, "/");
  return rel ? `${rel}/` : "./";
}

function writeFile(targetFile, html) {
  fs.mkdirSync(path.dirname(targetFile), { recursive: true });
  fs.writeFileSync(targetFile, html);
}

function nav(rootRel) {
  return `<header class="site-header">
      <div class="container nav-shell">
        <a class="brand" href="${rootRel}" aria-label="Nursing Uganda notes home">
          <span class="brand-mark">NU</span>
          <span>Nursing Uganda<small>Nursing Uganda</small></span>
        </a>
        <nav class="main-nav" data-main-nav aria-label="Main navigation">
          <a href="${rootRel}">Notes</a>
          <a href="${rootRel}courses/">Courses</a>
          <a href="${rootRel}resources/">Resources</a>
        </nav>
        <div class="nav-actions">
          <a class="button primary" href="${rootRel}courses/">Browse Courses</a>
          <button class="mobile-toggle" type="button" data-nav-toggle aria-label="Open menu" aria-expanded="false">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </header>`;
}

function footer(rootRel, note) {
  return `<footer class="site-footer">
      <div class="container">
        <div class="footer-bottom">
          <span>&copy; 2026 Nursing Uganda</span>
          <span>${escapeHtml(note)}</span>
        </div>
      </div>
    </footer>
    <script src="${rootRel}assets/js/main.js"></script>`;
}

function breadcrumbs(items) {
  const body = items
    .map((item, index) => {
      const sep = index === 0 ? "" : "<span>&gt;</span>";
      if (item.current) return `${sep}<span class="current">${escapeHtml(item.label)}</span>`;
      return `${sep}<a href="${item.href}">${escapeHtml(item.label)}</a>`;
    })
    .join("");
  return `<nav class="breadcrumbs" aria-label="Breadcrumb">${body}</nav>`;
}

function pageShell({ title, description, rootRel, main, schema }) {
  const schemaJson = schema
    ? `<script type="application/ld+json">${JSON.stringify(schema)}</script>`
    : "";
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}">
    ${schemaJson}
    <link rel="stylesheet" href="${rootRel}assets/css/styles.css">
  </head>
  <body>
    ${nav(rootRel)}
    <main>${main}</main>
    ${footer(rootRel, "Curriculum mapped from Nursing Uganda source and organized for structured learning.")}
  </body>
</html>`;
}

function trackMeta(trackKey) {
  if (trackKey === "extension") {
    return {
      label: "Diploma in Nursing (Extension)",
      segment: "extension",
      programmeHref: "../",
      intro:
        "Extension programme flow organized by year, semester, course unit and topic from the Nursing Uganda curriculum."
    };
  }
  return {
    label: "Diploma in Nursing (Direct)",
    segment: "",
    programmeHref: "./",
    intro:
      "Direct-entry programme flow organized by year, semester, course unit and topic from the Nursing Uganda curriculum."
  };
}

function sortedYearEntries(yearsObj) {
  return Object.entries(yearsObj).sort((a, b) => yearNumberFromKey(a[0]) - yearNumberFromKey(b[0]));
}

function sortedSemesterEntries(semObj) {
  return Object.entries(semObj).sort((a, b) => semesterNumberFromKey(a[0]) - semesterNumberFromKey(b[0]));
}

function generateProgrammeOverview(programmes) {
  const direct = programmes.direct;
  const extension = programmes.extension;
  const outFile = path.join(PROGRAMME_ROOT, "index.html");
  const dir = path.dirname(outFile);
  const rootRel = relToRoot(dir);

  const directYears = sortedYearEntries(direct.years)
    .map(
      ([yearKey, yearData]) =>
        `<a class="card" href="${yearKey}/"><h3>Direct Year ${yearData.year}</h3><p>${Object.keys(
          yearData.semesters
        ).length} semester(s) with mapped course units.</p><span class="card-link">Open year</span></a>`
    )
    .join("");

  const extensionYears = sortedYearEntries(extension.years)
    .map(
      ([yearKey, yearData]) =>
        `<a class="card" href="extension/${yearKey}/"><h3>Extension Year ${yearData.year}</h3><p>${Object.keys(
          yearData.semesters
        ).length} semester(s) with mapped course units.</p><span class="card-link">Open year</span></a>`
    )
    .join("");

  const main = `
      <section class="page-hero">
        <div class="container">
          ${breadcrumbs([
            { label: "Home", href: "../../" },
            { label: "Programmes", href: "../" },
            { label: "Diploma in Nursing", current: true }
          ])}
          <h1>Diploma in Nursing Programmes</h1>
          <p>Direct and Extension structures are imported from Nursing Uganda and arranged for clean Uganda-focused study navigation.</p>
          <div class="meta-grid">
            <div class="meta-box"><strong>Tracks</strong><span>Direct + Extension</span></div>
            <div class="meta-box"><strong>Structure</strong><span>Year → Semester → Course Unit → Topic</span></div>
            <div class="meta-box"><strong>Source</strong><span>Nursing Uganda curriculum pages</span></div>
            <div class="meta-box"><strong>Status</strong><span>Mapped and generated locally</span></div>
          </div>
        </div>
      </section>
      <section class="section">
        <div class="container">
          <div class="content-panel">
            <h2>Direct Track</h2>
            <p>Direct-entry diploma pathway with three years of mapped units.</p>
            <div class="resource-strip">
              <a class="button secondary" href="./">Overview</a>
              <a class="button ghost" href="year-1/">Open Direct Year 1</a>
            </div>
            <div class="grid three">${directYears}</div>
          </div>
          <div class="content-panel">
            <h2>Extension Track</h2>
            <p>Extension pathway with mapped years and semester units.</p>
            <div class="resource-strip">
              <a class="button secondary" href="extension/">Open Extension Overview</a>
              <a class="button ghost" href="extension/year-1/">Open Extension Year 1</a>
            </div>
            <div class="grid three">${extensionYears}</div>
          </div>
          <div class="ad-slot">Future AdSense placement: below programme overview</div>
        </div>
      </section>`;

  writeFile(
    outFile,
    pageShell({
      title: "Diploma in Nursing Programmes | Nursing Uganda",
      description:
        "Direct and Extension Diploma in Nursing programme maps with years, semesters, course units and topic pages for Uganda nursing learners.",
      rootRel,
      main
    })
  );
}

function generateTrackOverview(trackKey, programme) {
  if (trackKey === "direct") return;
  const meta = trackMeta(trackKey);
  const outFile = path.join(PROGRAMME_ROOT, meta.segment, "index.html");
  const dir = path.dirname(outFile);
  const rootRel = relToRoot(dir);
  const years = sortedYearEntries(programme.years)
    .map(
      ([yearKey, yearData]) =>
        `<a class="card" href="${yearKey}/"><h3>Year ${yearData.year}</h3><p>${Object.keys(yearData.semesters).length} semester(s) mapped.</p><span class="card-link">Open year</span></a>`
    )
    .join("");

  const main = `
      <section class="page-hero">
        <div class="container">
          ${breadcrumbs([
            { label: "Home", href: "../../../" },
            { label: "Programmes", href: "../../" },
            { label: "Diploma in Nursing", href: "../" },
            { label: "Extension", current: true }
          ])}
          <h1>${escapeHtml(meta.label)}</h1>
          <p>${escapeHtml(meta.intro)}</p>
        </div>
      </section>
      <section class="section">
        <div class="container">
          <div class="content-panel">
            <h2>Years</h2>
            <div class="grid three">${years}</div>
          </div>
          <div class="next-prev">
            <a class="button ghost" href="../">Back to Diploma Programmes</a>
            <a class="button secondary" href="year-1/">Go to Year 1</a>
          </div>
        </div>
      </section>`;

  writeFile(
    outFile,
    pageShell({
      title: "Diploma in Nursing Extension | Nursing Uganda",
      description: "Diploma in Nursing Extension programme pages by year, semester and course units.",
      rootRel,
      main
    })
  );
}

function generateYearPage({ trackKey, yearKey, yearData }) {
  const meta = trackMeta(trackKey);
  const yearDir =
    trackKey === "direct"
      ? path.join(PROGRAMME_ROOT, yearKey)
      : path.join(PROGRAMME_ROOT, meta.segment, yearKey);
  const outFile = path.join(yearDir, "index.html");
  const rootRel = relToRoot(yearDir);

  const semesters = sortedSemesterEntries(yearData.semesters)
    .map(([semesterKey, semesterData]) => {
      const count = semesterData.courseUnits.length;
      return `<a class="card" href="${semesterKey}/"><h3>Semester ${semesterData.semester}</h3><p>${count} mapped course unit(s).</p><span class="card-link">Open semester</span></a>`;
    })
    .join("");

  const programmeBackHref = trackKey === "direct" ? "../" : "../../";
  const crumbs =
    trackKey === "direct"
      ? [
          { label: "Home", href: "../../../" },
          { label: "Programmes", href: "../../" },
          { label: "Diploma in Nursing", href: "../" },
          { label: `Year ${yearData.year}`, current: true }
        ]
      : [
          { label: "Home", href: "../../../../" },
          { label: "Programmes", href: "../../../" },
          { label: "Diploma in Nursing", href: "../../" },
          { label: "Extension", href: "../" },
          { label: `Year ${yearData.year}`, current: true }
        ];

  const main = `
      <section class="page-hero">
        <div class="container">
          ${breadcrumbs(crumbs)}
          <h1>${escapeHtml(meta.label)} - Year ${yearData.year}</h1>
          <p>Choose a semester to continue through mapped course units, topic pages, notes and quiz links.</p>
        </div>
      </section>
      <section class="section">
        <div class="container layout">
          <aside class="sidebar collapsed">
            <button class="button secondary mobile-course-toggle" data-course-toggle>Open course menu</button>
            <h3>Year ${yearData.year} Menu</h3>
            <nav class="side-nav">
              <a class="active" href="./">Semesters</a>
              ${sortedSemesterEntries(yearData.semesters)
                .map(([semesterKey, semesterData]) => `<a href="${semesterKey}/">Semester ${semesterData.semester}</a>`)
                .join("")}
              <a href="${programmeBackHref}">Back to Programme</a>
            </nav>
            <div class="ad-slot">Future sidebar ad</div>
          </aside>
          <div>
            <section class="content-panel">
              <h2>Semesters</h2>
              <div class="grid three">${semesters}</div>
            </section>
            <div class="next-prev">
              <a class="button ghost" href="${programmeBackHref}">Back to Programme</a>
              <a class="button secondary" href="${Object.keys(yearData.semesters)[0]}/">Open First Semester</a>
            </div>
          </div>
        </div>
      </section>`;

  writeFile(
    outFile,
    pageShell({
      title: `${meta.label} Year ${yearData.year} | Nursing Uganda`,
      description: `${meta.label} Year ${yearData.year} semesters and course-unit navigation for Uganda nursing students.`,
      rootRel,
      main
    })
  );
}

function makeCourseSummaryText(title) {
  const lower = title.toLowerCase();
  if (lower.includes("anatomy")) return "Structure and function foundations with nursing relevance.";
  if (lower.includes("nursing")) return "Clinical nursing concepts, care planning and safe practice focus.";
  if (lower.includes("pharmacology")) return "Drug classes, administration safety and nursing responsibilities.";
  if (lower.includes("paediatric")) return "Child health assessment and paediatric nursing management.";
  if (lower.includes("gynaecology")) return "Women's health and reproductive nursing management.";
  if (lower.includes("mental health")) return "Mental health assessment, communication and care approaches.";
  if (lower.includes("research")) return "Research methods and evidence-informed nursing practice.";
  return "Structured revision coverage based on the mapped curriculum unit.";
}

function introductionTopicTitle(courseTitle) {
  if (courseTitle.toLowerCase().includes("anatomy")) {
    return "Introduction to Anatomy and Physiology";
  }
  return `Introduction to ${courseTitle.replace(/\s*\([^)]*\)\s*/g, " ").replace(/\s+/g, " ").trim()}`;
}

function generateSemesterPage({ trackKey, yearData, yearKey, semesterKey, semesterData }) {
  const meta = trackMeta(trackKey);
  const semesterDir =
    trackKey === "direct"
      ? path.join(PROGRAMME_ROOT, yearKey, semesterKey)
      : path.join(PROGRAMME_ROOT, meta.segment, yearKey, semesterKey);
  const outFile = path.join(semesterDir, "index.html");
  const rootRel = relToRoot(semesterDir);
  const courseCards = semesterData.courseUnits
    .map(
      (course) =>
        `<a class="card" href="${course.slug}/"><h3>${escapeHtml(course.code)}: ${escapeHtml(
          course.title
        )}</h3><p>${escapeHtml(makeCourseSummaryText(course.title))}</p><span class="card-link">Open course unit</span></a>`
    )
    .join("");

  const yearBackHref = "../";
  const courseLinks = semesterData.courseUnits
    .slice(0, 10)
    .map((course) => `<a href="${course.slug}/">${escapeHtml(course.code)}</a>`)
    .join("");

  const crumbs =
    trackKey === "direct"
      ? [
          { label: "Home", href: "../../../../" },
          { label: "Programmes", href: "../../../" },
          { label: "Diploma in Nursing", href: "../../" },
          { label: `Year ${yearData.year}`, href: "../" },
          { label: `Semester ${semesterData.semester}`, current: true }
        ]
      : [
          { label: "Home", href: "../../../../../" },
          { label: "Programmes", href: "../../../../" },
          { label: "Diploma in Nursing", href: "../../../" },
          { label: "Extension", href: "../../" },
          { label: `Year ${yearData.year}`, href: "../" },
          { label: `Semester ${semesterData.semester}`, current: true }
        ];

  const main = `
      <section class="page-hero">
        <div class="container">
          ${breadcrumbs(crumbs)}
          <h1>${escapeHtml(meta.label)} - Year ${yearData.year} Semester ${semesterData.semester}</h1>
          <p>Browse course units mapped from Nursing Uganda and continue into topic notes, quizzes and resources.</p>
        </div>
      </section>
      <section class="section">
        <div class="container layout">
          <aside class="sidebar collapsed">
            <button class="button secondary mobile-course-toggle" data-course-toggle>Open course menu</button>
            <h3>Semester ${semesterData.semester}</h3>
            <nav class="side-nav">
              <a class="active" href="./">Course Units</a>
              ${courseLinks}
              <a href="${yearBackHref}">Back to Year ${yearData.year}</a>
            </nav>
            <div class="ad-slot">Future sidebar ad</div>
          </aside>
          <div>
            <section class="content-panel">
              <h2>Course Units</h2>
              <div class="grid three">${courseCards}</div>
            </section>
            <div class="next-prev">
              <a class="button ghost" href="${yearBackHref}">Back to Year ${yearData.year}</a>
              <a class="button secondary" href="${semesterData.courseUnits[0]?.slug || "./"}/">Open First Course</a>
            </div>
          </div>
        </div>
      </section>`;

  writeFile(
    outFile,
    pageShell({
      title: `${meta.label} Year ${yearData.year} Semester ${semesterData.semester} | Nursing Uganda`,
      description: `${meta.label} Year ${yearData.year} Semester ${semesterData.semester} course units and topic navigation.`,
      rootRel,
      main
    })
  );
}

function generateCourseAndTopicPages({ trackKey, yearData, yearKey, semesterData, semesterKey, course }) {
  const meta = trackMeta(trackKey);
  const courseDir =
    trackKey === "direct"
      ? path.join(PROGRAMME_ROOT, yearKey, semesterKey, course.slug)
      : path.join(PROGRAMME_ROOT, meta.segment, yearKey, semesterKey, course.slug);
  const rootRel = relToRoot(courseDir);
  const topicTitle = introductionTopicTitle(course.title);
  const topicSlug = "introduction";

  const courseCrumbs =
    trackKey === "direct"
      ? [
          { label: "Home", href: "../../../../../" },
          { label: "Programmes", href: "../../../../" },
          { label: "Diploma in Nursing", href: "../../../" },
          { label: `Year ${yearData.year}`, href: "../../" },
          { label: `Semester ${semesterData.semester}`, href: "../" },
          { label: `${course.code}`, current: true }
        ]
      : [
          { label: "Home", href: "../../../../../../" },
          { label: "Programmes", href: "../../../../../" },
          { label: "Diploma in Nursing", href: "../../../../" },
          { label: "Extension", href: "../../../" },
          { label: `Year ${yearData.year}`, href: "../../" },
          { label: `Semester ${semesterData.semester}`, href: "../" },
          { label: `${course.code}`, current: true }
        ];

  const quizBlock = course.title.toLowerCase().includes("anatomy")
    ? `<div data-quiz="anatomyIntro"></div>`
    : `<p>MCQ set will be added for this unit. Use quiz listing page for current available quizzes.</p>`;

  const courseMain = `
      <section class="page-hero">
        <div class="container">
          ${breadcrumbs(courseCrumbs)}
          <h1>${escapeHtml(course.code)}: ${escapeHtml(course.title)}</h1>
          <p>${escapeHtml(makeCourseSummaryText(course.title))}</p>
        </div>
      </section>
      <section class="section">
        <div class="container layout">
          <aside class="sidebar collapsed">
            <button class="button secondary mobile-course-toggle" data-course-toggle>Open course menu</button>
            <h3>Course Navigation</h3>
            <nav class="side-nav">
              <a class="active" href="./">Overview</a>
              <a href="${topicSlug}/">${escapeHtml(topicTitle)}</a>
              <a href="#notes">Notes</a>
              <a href="#quiz">Quizzes</a>
              <a href="../">Back to Semester</a>
            </nav>
            <div class="ad-slot">Future sidebar ad</div>
          </aside>
          <div>
            <section class="content-panel">
              <h2>Course Overview</h2>
              <p>This course unit is mapped from Nursing Uganda curriculum content and structured for clear learning progression.</p>
              <div class="tag-row">
                <span class="tag">Year ${yearData.year}</span>
                <span class="tag">Semester ${semesterData.semester}</span>
                <span class="tag">Uganda nursing context</span>
              </div>
            </section>
            <section class="content-panel">
              <h2>Topics</h2>
              <ul class="topic-list">
                <li><a href="${topicSlug}/">${escapeHtml(topicTitle)} <span>Open</span></a></li>
                <li><a href="#">Core subtopics from source <span>Add next</span></a></li>
              </ul>
            </section>
            <section class="content-panel" id="notes">
              <h2>Notes and Resources</h2>
              <div class="grid three">
                <a class="card" href="${topicSlug}/"><h3>Topic Notes</h3><p>Read structured notes for this unit.</p></a>
                <a class="card" href="${rootRel}past-papers/"><h3>Past Questions</h3><p>Connect this unit with past paper practice.</p></a>
                <a class="card" href="${rootRel}notes/"><h3>Downloads</h3><p>Attach handouts and PDF summaries later.</p></a>
              </div>
            </section>
            <section class="content-panel" id="quiz">
              <h2>Practice Quiz</h2>
              ${quizBlock}
            </section>
            <div class="ad-slot">Future AdSense placement: below course content</div>
            <div class="next-prev">
              <a class="button ghost" href="../">Back to Semester</a>
              <a class="button secondary" href="${topicSlug}/">Next Topic</a>
            </div>
          </div>
        </div>
      </section>`;

  writeFile(
    path.join(courseDir, "index.html"),
    pageShell({
      title: `${course.code}: ${course.title} | Nursing Uganda`,
      description: `${course.code} ${course.title} notes, topic pages, quiz links and past questions for Uganda nursing learners.`,
      rootRel,
      main: courseMain,
      schema: {
        "@context": "https://schema.org",
        "@type": "Course",
        name: `${course.code}: ${course.title}`,
        provider: { "@type": "Organization", name: "Nursing Uganda" }
      }
    })
  );

  const topicDir = path.join(courseDir, topicSlug);
  const topicRootRel = relToRoot(topicDir);
  const topicCrumbs =
    trackKey === "direct"
      ? [
          { label: "Home", href: "../../../../../../" },
          { label: "Programmes", href: "../../../../../" },
          { label: "Diploma in Nursing", href: "../../../../" },
          { label: `Year ${yearData.year}`, href: "../../../" },
          { label: `Semester ${semesterData.semester}`, href: "../../" },
          { label: `${course.code}`, href: "../" },
          { label: topicTitle, current: true }
        ]
      : [
          { label: "Home", href: "../../../../../../../" },
          { label: "Programmes", href: "../../../../../../" },
          { label: "Diploma in Nursing", href: "../../../../../" },
          { label: "Extension", href: "../../../../" },
          { label: `Year ${yearData.year}`, href: "../../../" },
          { label: `Semester ${semesterData.semester}`, href: "../../" },
          { label: `${course.code}`, href: "../" },
          { label: topicTitle, current: true }
        ];

  const topicMain = `
      <section class="page-hero">
        <div class="container">
          ${breadcrumbs(topicCrumbs)}
          <h1>${escapeHtml(topicTitle)}</h1>
          <p>Introductory topic scaffold for ${escapeHtml(course.code)} within ${escapeHtml(meta.label)}.</p>
        </div>
      </section>
      <section class="section">
        <div class="container layout">
          <aside class="sidebar collapsed">
            <button class="button secondary mobile-course-toggle" data-course-toggle>Open course menu</button>
            <h3>Topic Menu</h3>
            <nav class="side-nav">
              <a class="active" href="./">${escapeHtml(topicTitle)}</a>
              <a href="../">Back to Course Unit</a>
            </nav>
            <div class="ad-slot">Future sidebar ad</div>
          </aside>
          <article>
            <section class="content-panel">
              <h2>Learning Objectives</h2>
              <ul>
                <li>Describe foundational terms and concepts for this unit.</li>
                <li>Link theory points to nursing care and clinical communication.</li>
                <li>Prepare for deeper topic-specific revision and assessment.</li>
              </ul>
            </section>
            <section class="content-panel">
              <h2>Main Notes</h2>
              <p>This page is a structured starting point generated from the curriculum tree. Add verified notes from approved tutor materials and curriculum references for full publication.</p>
              <div class="ad-slot">Future AdSense placement: inside notes content</div>
              <p>Keep content concise, clinically safe and aligned with Uganda nursing training standards before releasing student-facing final notes.</p>
            </section>
            <section class="content-panel">
              <h2>Key Points Summary</h2>
              <ul>
                <li>Understand the unit scope and terminology.</li>
                <li>Connect classroom content to safe nursing practice.</li>
                <li>Review using notes, quiz practice and past papers together.</li>
              </ul>
            </section>
            <section class="content-panel">
              <h2>Practice Questions</h2>
              ${quizBlock}
            </section>
            <section class="content-panel">
              <h2>Related Resources</h2>
              <div class="resource-strip">
                <a class="button ghost" href="${topicRootRel}quizzes/">Open quiz listing</a>
                <a class="button ghost" href="${topicRootRel}past-papers/">Open past papers</a>
                <a class="button ghost" href="${topicRootRel}disclaimer/">Read medical disclaimer</a>
              </div>
            </section>
            <div class="ad-slot">Future AdSense placement: below topic content</div>
            <div class="next-prev">
              <a class="button ghost" href="../">Back to Course Unit</a>
              <a class="button secondary" href="../">Next Topic</a>
            </div>
          </article>
        </div>
      </section>`;

  writeFile(
    path.join(topicDir, "index.html"),
    pageShell({
      title: `${topicTitle} | Nursing Uganda`,
      description: `${topicTitle} topic notes and objectives for ${course.code} ${course.title}.`,
      rootRel: topicRootRel,
      main: topicMain,
      schema: {
        "@context": "https://schema.org",
        "@type": "LearningResource",
        name: topicTitle,
        educationalLevel: "Diploma in Nursing",
        provider: { "@type": "Organization", name: "Nursing Uganda" }
      }
    })
  );
}

function generateTrackPages(trackKey, programme) {
  generateTrackOverview(trackKey, programme);
  for (const [yearKey, yearData] of sortedYearEntries(programme.years)) {
    generateYearPage({ trackKey, yearKey, yearData });
    for (const [semesterKey, semesterData] of sortedSemesterEntries(yearData.semesters)) {
      generateSemesterPage({ trackKey, yearData, yearKey, semesterKey, semesterData });
      for (const course of semesterData.courseUnits) {
        generateCourseAndTopicPages({ trackKey, yearData, yearKey, semesterData, semesterKey, course });
      }
    }
  }
}

function main() {
  if (!fs.existsSync(CURRICULUM_FILE)) {
    throw new Error(`Missing curriculum file: ${CURRICULUM_FILE}`);
  }
  const tree = JSON.parse(fs.readFileSync(CURRICULUM_FILE, "utf8"));
  generateProgrammeOverview(tree.programmes);
  generateTrackPages("direct", tree.programmes.direct);
  generateTrackPages("extension", tree.programmes.extension);
  console.log(`Generated pages from ${CURRICULUM_FILE}`);
}

main();
