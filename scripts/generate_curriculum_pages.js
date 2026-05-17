#!/usr/bin/env node
/* Build curriculum navigation pages from Nursing Uganda source HTML. */
const fs = require("node:fs");
const path = require("node:path");

const ROOT = process.cwd();
const LEGACY_SOURCE_FOLDER = ["Nurses", "revision"].join(" ");
const LEGACY_SOURCE_DIR = ["Nurses", "Revision", "Full"].join("_");
const SOURCE_ROOT = path.resolve(ROOT, "..", LEGACY_SOURCE_FOLDER, LEGACY_SOURCE_DIR);
const OUT_ROOT = path.join(ROOT, "courses", "curriculum");
const DIPLOMA_TREE = path.join(ROOT, "programmes", "diploma-nursing", "curriculum-tree.json");

const BNS_CURRICULUM_FILES = [
  "anatomy-bns-curriculum.html",
  "physiology-bns-curriculum.html",
  "biochemistry-bns-curriculum.html",
  "pathology-bns-curriculum.html",
  "pharmacology-bns-curriculum.html",
  "microbiology-bns-curriculum.html",
  "foundations-of-nursing-bns-curriculum.html",
  "health-assessment-bns-curriculum.html",
  "computer-skills-bns-curriculum.html",
  "nursing-informatics-bns-curriculum.html"
];

function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function decodeEntities(value) {
  return String(value)
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&rsquo;|&#8217;/g, "'")
    .replace(/&lsquo;|&#8216;/g, "'")
    .replace(/&ndash;|&#8211;/g, "-")
    .replace(/&mdash;|&#8212;/g, "-")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/Ã‚/g, "");
}

function stripTags(value) {
  return decodeEntities(String(value).replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function readSource(file) {
  return fs.readFileSync(path.join(SOURCE_ROOT, file), "utf8");
}

function writeFile(file, html) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
}

function relToRoot(fromDir) {
  const rel = path.relative(fromDir, ROOT).replace(/\\/g, "/");
  return rel ? `${rel}/` : "./";
}

function nav(rootRel, active = "courses") {
  const item = (key, href, label) => `<a${active === key ? ' class="active"' : ""} href="${rootRel}${href}">${label}</a>`;
  return `<header class="site-header">
      <div class="container nav-shell">
        <a class="brand" href="${rootRel}" aria-label="Nursing Uganda notes home">
          <span class="brand-mark">NU</span>
          <span>Nursing Uganda<small>Nursing Uganda</small></span>
        </a>
        <nav class="main-nav" data-main-nav aria-label="Main navigation">
          ${item("notes", "", "Notes")}
          ${item("courses", "courses/", "Courses")}
          ${item("resources", "resources/", "Resources")}
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

function pageShell({ file, title, description, main }) {
  const rootRel = relToRoot(path.dirname(file));
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}">
    <link rel="stylesheet" href="${rootRel}assets/css/styles.css">
    <script>
      if ("scrollRestoration" in history) history.scrollRestoration = "manual";
      window.addEventListener("load", () => window.scrollTo(0, 0));
      window.addEventListener("pageshow", () => window.scrollTo(0, 0));
    </script>
  </head>
  <body>
    ${nav(rootRel)}
    <main>${main}</main>
    ${footer(rootRel, "Curriculum pages are generated from Nursing Uganda source and prepared for original Nursing Uganda notes.")}
  </body>
</html>`;
}

function sourceTopicHref(href) {
  if (!href || href.startsWith("http")) return "";
  return href.replace(/\.html(#.*)?$/i, "");
}

function parseSourceTitle(html, fallback) {
  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (h1) return stripTags(h1[1]).replace(/\s+Curriculum$/i, " Curriculum");
  const title = html.match(/<title>([\s\S]*?)<\/title>/i);
  return title ? stripTags(title[1]).replace(/\s+-\s+Nursing Uganda$/i, "") : fallback;
}

function parseLinks(block) {
  const links = [];
  const linkRegex = /<a\s+[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;
  for (const match of block.matchAll(linkRegex)) {
    const title = stripTags(match[2]);
    if (!title || title.length < 2) continue;
    links.push({
      title,
      sourceHref: match[1],
      sourceSlug: sourceTopicHref(match[1])
    });
  }
  return links;
}

function parseSectionedCurriculum(file) {
  const html = readSource(file);
  const bodyStart = Math.max(
    html.search(/<h1/i),
    0
  );
  const bodyEnd = html.search(/Key Reference|References|elementorFrontendConfig|var localize/i);
  const content = html.slice(bodyStart, bodyEnd > bodyStart ? bodyEnd : html.length);
  const title = parseSourceTitle(html, file.replace(".html", ""));
  const codeMatch = title.match(/\b([A-Z]{2,4}\s*\d{3,4})\b/);
  const code = codeMatch ? codeMatch[1].replace(/\s+/, " ") : "";
  const unitTitle = title.replace(/\b[A-Z]{2,4}\s*\d{3,4}\s*:?\s*/i, "").replace(/\s+Curriculum$/i, "").trim();
  const sections = [];

  const headingRegex = /<h[23][^>]*>([\s\S]*?)<\/h[23]>/gi;
  const headings = [...content.matchAll(headingRegex)].map((match) => ({
    index: match.index || 0,
    title: stripTags(match[1])
  })).filter((item) => item.title && !/course outline|key reference/i.test(item.title));

  for (let i = 0; i < headings.length; i += 1) {
    const start = headings[i].index;
    const end = i + 1 < headings.length ? headings[i + 1].index : content.length;
    const block = content.slice(start, end);
    const topics = parseLinks(block);
    if (topics.length) {
      sections.push({
        title: headings[i].title,
        topics
      });
    }
  }

  return {
    code,
    title: unitTitle || title,
    fullTitle: code ? `${code}: ${unitTitle}` : title,
    slug: slugify(unitTitle || title),
    sourceFile: file,
    sections,
    topicCount: sections.reduce((sum, section) => sum + section.topics.length, 0)
  };
}

function yearSemesterFromText(value) {
  const lower = value.toLowerCase();
  const words = { one: 1, two: 2, three: 3, four: 4 };
  const yearWord = lower.match(/year\s+(one|two|three|four|\d+)/);
  const semesterWord = lower.match(/semester\s+(one|two|three|four|\d+)/);
  const toNumber = (part) => {
    if (!part) return null;
    if (/^\d+$/.test(part)) return Number(part);
    return words[part] || null;
  };
  return {
    year: toNumber(yearWord && yearWord[1]),
    semester: toNumber(semesterWord && semesterWord[1])
  };
}

function parseCertificateCurriculum() {
  const file = "certificate-in-nursing-updated-curriculum.html";
  const html = readSource(file);
  const markers = [];
  const markerRegex = /price-currency">([\s\S]*?)<\/span>/gi;
  for (const match of html.matchAll(markerRegex)) {
    const label = stripTags(match[1]);
    const parsed = yearSemesterFromText(label);
    if (parsed.year && parsed.semester) {
      markers.push({ type: "semester", index: match.index || 0, label, ...parsed });
      continue;
    }
    if (/^CN\s*\d{3}$/i.test(label)) {
      markers.push({ type: "unit", index: match.index || 0, code: label.replace(/\s+/, " ") });
    }
  }
  const inlineUnitRegex = /<span>\s*(CN\s*\d{3})\s*:?\s*([^<]+)<\/span>/gi;
  for (const match of html.matchAll(inlineUnitRegex)) {
    markers.push({
      type: "unit",
      index: match.index || 0,
      code: match[1].replace(/\s+/, " "),
      inlineTitle: stripTags(match[2])
    });
  }
  markers.sort((a, b) => a.index - b.index);

  const programme = {
    key: "certificate-nursing",
    label: "Certificate in Nursing",
    sourceFile: file,
    years: {}
  };

  let current = { year: null, semester: null };
  const seenCodes = new Set();
  for (let i = 0; i < markers.length; i += 1) {
    const marker = markers[i];
    if (marker.type === "semester") {
      current = { year: marker.year, semester: marker.semester };
      continue;
    }
    if (seenCodes.has(marker.code)) continue;
    seenCodes.add(marker.code);
    const next = i + 1 < markers.length ? markers[i + 1].index : html.length;
    const block = html.slice(marker.index, next);
    const titleMatch = block.match(/<span>([^<]*(?:CN\s*\d{3}:)?[^<]+)<\/span>/i);
    let title = marker.inlineTitle || (titleMatch ? stripTags(titleMatch[1]) : marker.code);
    title = title.replace(/^CN\s*\d{3}\s*:?\s*/i, "").trim();
    const sections = [];
    const headingRegex = /<h[45][^>]*>([\s\S]*?)<\/h[45]>/gi;
    const headings = [...block.matchAll(headingRegex)].map((match) => ({
      index: match.index || 0,
      title: stripTags(match[1])
    })).filter((item) => item.title && item.title.length > 2);

    if (headings.length) {
      for (let h = 0; h < headings.length; h += 1) {
        const start = headings[h].index;
        const end = h + 1 < headings.length ? headings[h + 1].index : block.length;
        const topics = parseLinks(block.slice(start, end));
        if (topics.length) sections.push({ title: headings[h].title, topics });
      }
    } else {
      const topics = parseLinks(block);
      if (topics.length) sections.push({ title: "Topics", topics });
    }

    const year = current.year || Number(marker.code.match(/\d(\d)\d/)?.[1] || 1);
    const semester = current.semester || Number(marker.code.match(/\d(\d)\d/)?.[1] || 1);
    const yKey = `year-${year}`;
    const sKey = `semester-${semester}`;
    if (!programme.years[yKey]) programme.years[yKey] = { year, semesters: {} };
    if (!programme.years[yKey].semesters[sKey]) programme.years[yKey].semesters[sKey] = { semester, courseUnits: [] };
    programme.years[yKey].semesters[sKey].courseUnits.push({
      code: marker.code,
      title,
      slug: slugify(title),
      sourceFile: file,
      sections,
      topicCount: sections.reduce((sum, section) => sum + section.topics.length, 0)
    });
  }

  return programme;
}

function parseBnsOverview() {
  const html = readSource("bachelor-of-nursing-science-curriculum.html");
  const contentStart = html.indexOf('<h3 class="bns-year-heading"');
  const content = html.slice(contentStart > -1 ? contentStart : 0);
  const years = {};
  let currentYear = 1;
  const tokenRegex = /<h3 class="bns-year-heading"[^>]*>([\s\S]*?)<\/h3>|<a class="bns-course-item" href="([^"]+)"[\s\S]*?<span class="bns-course-title">([\s\S]*?)<\/span>/gi;
  for (const match of content.matchAll(tokenRegex)) {
    if (match[1]) {
      const label = stripTags(match[1]);
      currentYear = /ii/i.test(label) ? 2 : 1;
      continue;
    }
    const sourceFile = match[2];
    const fullTitle = stripTags(match[3]);
    const parsed = parseSectionedCurriculum(sourceFile);
    const codeTitle = fullTitle.match(/^([A-Z]{2,4}\s*\d{3,4})\s*:?\s*(.+)$/i);
    const code = codeTitle ? codeTitle[1] : parsed.code;
    const title = codeTitle ? codeTitle[2] : parsed.title;
    const yKey = `year-${currentYear}`;
    if (!years[yKey]) years[yKey] = { year: currentYear, semesters: { "semester-1": { semester: 1, courseUnits: [] } } };
    years[yKey].semesters["semester-1"].courseUnits.push({
      ...parsed,
      code,
      title,
      fullTitle: code ? `${code}: ${title}` : title,
      slug: slugify(title),
      sourceFile
    });
  }

  for (const file of BNS_CURRICULUM_FILES) {
    const exists = Object.values(years).some((year) =>
      Object.values(year.semesters).some((semester) => semester.courseUnits.some((unit) => unit.sourceFile === file))
    );
    if (!exists && fs.existsSync(path.join(SOURCE_ROOT, file))) {
      const parsed = parseSectionedCurriculum(file);
      const yKey = "year-1";
      if (!years[yKey]) years[yKey] = { year: 1, semesters: { "semester-1": { semester: 1, courseUnits: [] } } };
      years[yKey].semesters["semester-1"].courseUnits.push(parsed);
    }
  }

  return {
    key: "bachelor-nursing-science-top-up",
    label: "Bachelor of Nursing Science (Top-Up)",
    sourceFile: "bachelor-of-nursing-science-curriculum.html",
    years
  };
}

function loadDiplomaProgrammes() {
  const tree = JSON.parse(fs.readFileSync(DIPLOMA_TREE, "utf8"));
  return [
    { ...tree.programmes.direct, key: "diploma-nursing-direct", slug: "diploma-nursing-direct" },
    { ...tree.programmes.extension, key: "diploma-nursing-extension", slug: "diploma-nursing-extension" }
  ];
}

function programmeStats(programme) {
  let semesterCount = 0;
  let unitCount = 0;
  let topicCount = 0;
  for (const year of Object.values(programme.years)) {
    for (const semester of Object.values(year.semesters)) {
      semesterCount += 1;
      unitCount += semester.courseUnits.length;
      topicCount += semester.courseUnits.reduce((sum, unit) => sum + (unit.topicCount || 0), 0);
    }
  }
  return { yearCount: Object.keys(programme.years).length, semesterCount, unitCount, topicCount };
}

function plural(count, singular, pluralLabel = `${singular}s`) {
  return `${count} ${count === 1 ? singular : pluralLabel}`;
}

function sortedYears(programme) {
  return Object.entries(programme.years).sort((a, b) => a[1].year - b[1].year);
}

function sortedSemesters(year) {
  return Object.entries(year.semesters).sort((a, b) => a[1].semester - b[1].semester);
}

function unitHref(programmeSlug, unit) {
  if (unit.sections) return `${unit.slug}/`;
  if (programmeSlug === "diploma-nursing-direct") return `../../../programmes/diploma-nursing/year-${unit.year}/semester-${unit.semester}/${unit.slug}/`;
  return `../../../programmes/diploma-nursing/extension/year-${unit.year}/semester-${unit.semester}/${unit.slug}/`;
}

function enrichDiplomaUnits(programme) {
  for (const year of Object.values(programme.years)) {
    for (const semester of Object.values(year.semesters)) {
      for (const unit of semester.courseUnits) {
        unit.year = year.year;
        unit.semester = semester.semester;
      }
    }
  }
  return programme;
}

function renderProgrammePage(programme, programmeSlug) {
  const stats = programmeStats(programme);
  const file = path.join(OUT_ROOT, programmeSlug, "index.html");
  const main = `
      <section class="curriculum-hero">
        <div class="container curriculum-hero-grid">
          <div>
            <nav class="breadcrumbs" aria-label="Breadcrumb"><a href="../../">Courses</a><span>&gt;</span><a href="../">Curriculum</a><span>&gt;</span><span class="current">${escapeHtml(programme.label)}</span></nav>
            <h1>${escapeHtml(programme.label)}</h1>
            <p>Large curriculum map generated from <strong>${escapeHtml(programme.sourceFile)}</strong>. Use it to move from year and semester into each course unit, then into topic-level notes.</p>
          </div>
          <div class="curriculum-stat-panel">
            <div><strong>${stats.yearCount}</strong><span>Years</span></div>
            <div><strong>${stats.semesterCount}</strong><span>Semesters</span></div>
            <div><strong>${stats.unitCount}</strong><span>Course Units</span></div>
            <div><strong>${stats.topicCount || "Mapped"}</strong><span>${stats.topicCount ? "Topics" : "Topics next"}</span></div>
          </div>
        </div>
      </section>
      <section class="section">
        <div class="container curriculum-shell">
          <aside class="curriculum-rail">
            <h2>Jump To</h2>
            ${sortedYears(programme).map(([yearKey, year]) => `<a href="#${yearKey}">Year ${year.year}</a>`).join("")}
          </aside>
          <div class="curriculum-flow">
            ${sortedYears(programme).map(([yearKey, year]) => `
              <section id="${yearKey}" class="curriculum-year">
                <div class="curriculum-year-head">
                  <span>Year ${year.year}</span>
                  <h2>${escapeHtml(programme.label)} Year ${year.year}</h2>
                </div>
                ${sortedSemesters(year).map(([semesterKey, semester]) => `
                  <div class="curriculum-semester" id="${yearKey}-${semesterKey}">
                    <div class="curriculum-semester-head">
                      <h3>Semester ${semester.semester}</h3>
                      <span>${semester.courseUnits.length} course units</span>
                    </div>
                    <div class="curriculum-unit-grid">
                      ${semester.courseUnits.map((unit) => `
                        <a class="curriculum-unit-card" href="${unitHref(programmeSlug, unit)}">
                          <span class="unit-code">${escapeHtml(unit.code || "Unit")}</span>
                          <h4>${escapeHtml(unit.title)}</h4>
                          <p>${unit.sections ? `${unit.sections.length} topic groups, ${unit.topicCount} source topics.` : "Open the generated course unit page."}</p>
                          <span class="card-link">Open curriculum</span>
                        </a>
                      `).join("")}
                    </div>
                  </div>
                `).join("")}
              </section>
            `).join("")}
          </div>
        </div>
      </section>`;

  writeFile(file, pageShell({
    file,
    title: `${programme.label} Curriculum | Nursing Uganda`,
    description: `${programme.label} curriculum organized by year, semester and course unit for Nursing Uganda.`,
    main
  }));
}

function renderUnitPage(programme, programmeSlug, unit) {
  if (!unit.sections) return;
  const file = path.join(OUT_ROOT, programmeSlug, unit.slug, "index.html");
  const main = `
      <section class="curriculum-hero compact">
        <div class="container curriculum-hero-grid">
          <div>
            <nav class="breadcrumbs" aria-label="Breadcrumb"><a href="../../../">Courses</a><span>&gt;</span><a href="../../">Curriculum</a><span>&gt;</span><a href="../">${escapeHtml(programme.label)}</a><span>&gt;</span><span class="current">${escapeHtml(unit.title)}</span></nav>
            <h1>${escapeHtml(unit.fullTitle || unit.title)}</h1>
            <p>Topic map generated from <strong>${escapeHtml(unit.sourceFile)}</strong>. Each topic is ready to become an original Nursing Uganda note page.</p>
          </div>
          <div class="curriculum-stat-panel">
            <div><strong>${unit.sections.length}</strong><span>Topic Groups</span></div>
            <div><strong>${unit.topicCount}</strong><span>Topics</span></div>
          </div>
        </div>
      </section>
      <section class="section">
        <div class="container curriculum-shell">
          <aside class="curriculum-rail">
            <h2>Topic Groups</h2>
            ${unit.sections.map((section) => `<a href="#${slugify(section.title)}">${escapeHtml(section.title)}</a>`).join("")}
          </aside>
          <div class="curriculum-flow">
            ${unit.sections.map((section) => `
              <section id="${slugify(section.title)}" class="topic-group">
                <div class="curriculum-semester-head">
                  <h2>${escapeHtml(section.title)}</h2>
                  <span>${section.topics.length} topics</span>
                </div>
                <div class="topic-list">
                  ${section.topics.map((topic, index) => `
                    <div class="topic-row">
                      <span>${String(index + 1).padStart(2, "0")}</span>
                      <div>
                        <h3>${escapeHtml(topic.title)}</h3>
                        <p>${topic.sourceSlug ? `Source topic: ${escapeHtml(topic.sourceSlug)}` : "Source topic will be connected during note conversion."}</p>
                      </div>
                    </div>
                  `).join("")}
                </div>
              </section>
            `).join("")}
          </div>
        </div>
      </section>`;

  writeFile(file, pageShell({
    file,
    title: `${unit.fullTitle || unit.title} | Nursing Uganda`,
    description: `${unit.title} topic map generated from Nursing Uganda for Nursing Uganda curriculum navigation.`,
    main
  }));
}

function renderHub(programmes) {
  const file = path.join(OUT_ROOT, "index.html");
  const cards = programmes.map((programme) => {
    const stats = programmeStats(programme);
    const slug = programme.slug || programme.key;
    return `<a class="curriculum-program-card" href="${slug}/">
        <span class="card-icon">${escapeHtml(programme.label.split(" ").map((word) => word[0]).slice(0, 2).join(""))}</span>
        <h2>${escapeHtml(programme.label)}</h2>
        <p>${plural(stats.yearCount, "year")}, ${plural(stats.semesterCount, "semester")}, ${plural(stats.unitCount, "course unit")}${stats.topicCount ? `, ${plural(stats.topicCount, "source topic")}` : ""}.</p>
        <span class="card-link">Open curriculum</span>
      </a>`;
  }).join("");

  const main = `
      <section class="curriculum-hero">
        <div class="container curriculum-hero-grid">
          <div>
            <nav class="breadcrumbs" aria-label="Breadcrumb"><a href="../">Courses</a><span>&gt;</span><span class="current">Curriculum</span></nav>
            <h1>Curriculum Maps</h1>
            <p>Big, navigable curriculum pages generated from the Nursing Uganda clone. Start here, choose a programme, then drill into years, semesters, course units and topic groups.</p>
          </div>
          <div class="curriculum-stat-panel">
            <div><strong>${programmes.length}</strong><span>Programmes</span></div>
            <div><strong>${programmes.reduce((sum, p) => sum + programmeStats(p).unitCount, 0)}</strong><span>Course Units</span></div>
            <div><strong>${programmes.reduce((sum, p) => sum + programmeStats(p).topicCount, 0)}</strong><span>Topics</span></div>
          </div>
        </div>
      </section>
      <section class="section">
        <div class="container">
          <div class="curriculum-program-grid">${cards}</div>
        </div>
      </section>
      <section class="section soft">
        <div class="container">
          <div class="content-panel">
            <h2>How These Pages Are Used</h2>
            <ul class="standards-list">
              <li>Curriculum pages define the navigation backbone of the app.</li>
              <li>Source topics are listed as conversion targets, then rewritten into original Nursing Uganda notes.</li>
              <li>Diploma pages already link into generated course-unit pages; certificate and BNS topic pages are now mapped for the next import pass.</li>
            </ul>
          </div>
        </div>
      </section>`;

  writeFile(file, pageShell({
    file,
    title: "Curriculum Maps | Nursing Uganda",
    description: "Large navigable curriculum pages generated from Nursing Uganda source pages.",
    main
  }));
}

function main() {
  const certificate = parseCertificateCurriculum();
  const bns = parseBnsOverview();
  const diploma = loadDiplomaProgrammes().map(enrichDiplomaUnits);
  const programmes = [
    { ...certificate, slug: "certificate-in-nursing" },
    ...diploma,
    { ...bns, slug: "bachelor-of-nursing-science-top-up" }
  ];

  renderHub(programmes);
  for (const programme of programmes) {
    const programmeSlug = programme.slug || programme.key;
    renderProgrammePage(programme, programmeSlug);
    for (const year of Object.values(programme.years)) {
      for (const semester of Object.values(year.semesters)) {
        for (const unit of semester.courseUnits) {
          renderUnitPage(programme, programmeSlug, unit);
        }
      }
    }
  }

  const unitPages = programmes.reduce((sum, programme) => {
    let total = 0;
    for (const year of Object.values(programme.years)) {
      for (const semester of Object.values(year.semesters)) {
        total += semester.courseUnits.filter((unit) => unit.sections).length;
      }
    }
    return sum + total;
  }, 0);
  console.log(`Generated ${programmes.length} curriculum programmes and ${unitPages} topic-mapped unit pages.`);
}

main();
