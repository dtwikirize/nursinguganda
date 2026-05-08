#!/usr/bin/env node
/* Generate crawlable course, unit and lesson pages for the Nursing Uganda web app. */
const fs = require("node:fs");
const path = require("node:path");

const ROOT = process.cwd();
const DATA_FILE = path.join(ROOT, "assets", "data", "curriculum.json");
const COURSES_ROOT = path.join(ROOT, "courses");
const SITE_URL = "https://nursinguganda.com";
const CSS_VERSION = "10";

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function slugify(value) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function truncateText(value, max = 155) {
  const text = String(value ?? "").replace(/\s+/g, " ").trim();
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).replace(/\s+\S*$/, "")}...`;
}

function relToRoot(fromDir) {
  const rel = path.relative(fromDir, ROOT).replace(/\\/g, "/");
  return rel ? `${rel}/` : "./";
}

function writeFile(file, html) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
}

function sortedYears(programme) {
  return Object.entries(programme.years || {}).sort((a, b) => a[1].year - b[1].year);
}

function sortedSemesters(year) {
  return Object.entries(year.semesters || {}).sort((a, b) => a[1].semester - b[1].semester);
}

function allUnits(programme) {
  const units = [];
  for (const [, year] of sortedYears(programme)) {
    for (const [, semester] of sortedSemesters(year)) {
      for (const unit of semester.courseUnits || []) {
        units.push({ ...unit, year: year.year, semester: semester.semester });
      }
    }
  }
  return units;
}

function flatTopics(unit) {
  const topics = [];
  for (const [groupIndex, group] of (unit.topicGroups || []).entries()) {
    for (const [topicIndex, topic] of (group.topics || []).entries()) {
      topics.push({
        ...topic,
        groupTitle: group.title,
        groupIndex,
        topicIndex,
        flatIndex: topics.length
      });
    }
  }
  return topics;
}

function topicSlug(topic) {
  return slugify(topic && (topic.slug || topic.title || topic.sourceSlug || "topic")) || "topic";
}

function uniqueTopicSlug(unit, topic) {
  const base = topicSlug(topic);
  const matches = flatTopics(unit).filter((item) => topicSlug(item) === base);
  if (matches.length <= 1) return base;
  const matchIndex = matches.findIndex((item) => item.groupIndex === topic.groupIndex && item.topicIndex === topic.topicIndex);
  return `${base}-${matchIndex >= 0 ? matchIndex + 1 : topic.flatIndex + 1}`;
}

function staticPath(...segments) {
  return `/${segments.filter(Boolean).map((segment) => encodeURIComponent(segment)).join("/")}/`;
}

function canonicalFor(...segments) {
  return `${SITE_URL}${staticPath(...segments)}`;
}

function appHashFor(...segments) {
  return `#/courses/${segments.filter(Boolean).join("/")}`;
}

function lessonForTopic(data, programme, unit, topic) {
  if (topic.sourceSlug && data.lessons && data.lessons[topic.sourceSlug]) {
    return { ...data.lessons[topic.sourceSlug], generated: false };
  }

  const topicTitle = topic.title || "Nursing topic";
  const unitLabel = `${unit.code ? `${unit.code}: ` : ""}${unit.title}`;
  return {
    title: topicTitle,
    excerpt: `Structured study notes for ${topicTitle.toLowerCase()} in ${unitLabel} for ${programme.label}.`,
    sourceFile: "Nursing Uganda generated study outline",
    generated: true,
    sections: [
      {
        title: "Learning Objectives",
        blocks: [
          { type: "bullet", text: `Define the key terms used in ${topicTitle.toLowerCase()}.` },
          { type: "bullet", text: `Explain the main nursing concepts linked to ${topicTitle.toLowerCase()}.` },
          { type: "bullet", text: "Apply safe assessment, documentation and escalation principles." }
        ]
      },
      {
        title: "Core Study Notes",
        blocks: [
          { type: "paragraph", text: `${topicTitle} is studied in ${programme.label} as part of ${unitLabel}. Use this page as a revision outline and connect it with tutor guidance, clinical placement experience and official standards.` },
          { type: "bullet", text: "Start with definitions, normal structure or process, then common abnormalities." },
          { type: "bullet", text: "Link every concept to nursing assessment, patient safety and health education." },
          { type: "bullet", text: "Document findings clearly and escalate urgent changes early." }
        ]
      },
      {
        title: "Revision Checklist",
        blocks: [
          { type: "bullet", text: "Can you explain the topic in your own words?" },
          { type: "bullet", text: "Can you list priority assessments and danger signs?" },
          { type: "bullet", text: "Can you identify appropriate nursing actions and referral points?" }
        ]
      }
    ]
  };
}

function renderBlocks(blocks = []) {
  const html = [];
  let bullets = [];

  function flushBullets() {
    if (!bullets.length) return;
    html.push(`<ul>${bullets.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`);
    bullets = [];
  }

  for (const block of blocks) {
    if (block.type === "bullet") {
      bullets.push(block.text || "");
    } else {
      flushBullets();
      html.push(`<p>${escapeHtml(block.text || "")}</p>`);
    }
  }

  flushBullets();
  return html.join("\n");
}

function breadcrumbs(items) {
  return `<nav class="seo-breadcrumbs" aria-label="Breadcrumb">${items.map((item, index) => {
    const sep = index ? "<span>/</span>" : "";
    if (item.current) return `${sep}<strong>${escapeHtml(item.label)}</strong>`;
    return `${sep}<a href="${escapeHtml(item.href)}">${escapeHtml(item.label)}</a>`;
  }).join("")}</nav>`;
}

function nav(rootRel, appHref) {
  return `<header class="seo-header">
    <a class="brand" href="${rootRel}" aria-label="Nursing Uganda home"><span class="brand-mark">NU</span><span>Nursing Uganda<small>nursinguganda.com</small></span></a>
    <nav aria-label="Main navigation">
      <a href="${rootRel}courses/">Courses</a>
      <a href="${rootRel}#/resources">Resources</a>
      <a href="${rootRel}#/careers">Careers</a>
      <a class="seo-app-link" href="${escapeHtml(appHref)}">Open App</a>
    </nav>
  </header>`;
}

function pageShell({ file, title, description, canonical, appHash, breadcrumbsHtml, main, schema }) {
  const rootRel = relToRoot(path.dirname(file));
  const appHref = `${rootRel}${appHash || "#/courses"}`;
  const cleanTitle = title.endsWith("Nursing Uganda") ? title : `${title} | Nursing Uganda`;
  const schemaJson = schema ? `<script type="application/ld+json">${JSON.stringify(schema)}</script>` : "";

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(cleanTitle)}</title>
    <meta name="description" content="${escapeHtml(description)}">
    <link rel="canonical" href="${escapeHtml(canonical)}">
    <meta property="og:title" content="${escapeHtml(cleanTitle)}">
    <meta property="og:description" content="${escapeHtml(description)}">
    <meta property="og:url" content="${escapeHtml(canonical)}">
    <meta property="og:type" content="article">
    <meta name="twitter:card" content="summary">
    ${schemaJson}
    <link rel="icon" href="${rootRel}assets/images/nursing-uganda-favicon.svg" type="image/svg+xml">
    <link rel="stylesheet" href="${rootRel}assets/css/main.min.css?v=${CSS_VERSION}">
    <style>
      .seo-page{background:#f4f7f9;color:#1e2d3d;font-family:Inter,Arial,sans-serif}
      .seo-header{align-items:center;background:#fff;border-bottom:1px solid #d9e6ec;display:flex;gap:24px;justify-content:space-between;padding:16px clamp(16px,4vw,56px);position:sticky;top:0;z-index:10}
      .seo-header nav{align-items:center;display:flex;flex-wrap:wrap;gap:8px 16px}.seo-header a{text-decoration:none}.seo-app-link{background:#1a5f7a;border-radius:10px;color:#fff!important;padding:10px 14px}
      .seo-main{max-width:1120px;margin:0 auto;padding:32px clamp(16px,4vw,40px) 64px}.seo-hero{background:linear-gradient(135deg,#0d2137 0%,#1a5f7a 55%,#00bcd4 100%);border-radius:18px;color:#fff;margin-bottom:24px;padding:32px}
      .seo-hero h1{font-size:clamp(2rem,5vw,3.4rem);line-height:1.04;margin:14px 0}.seo-hero p{color:rgba(255,255,255,.84);font-size:1.05rem;max-width:780px}
      .seo-breadcrumbs{align-items:center;display:flex;flex-wrap:wrap;gap:8px;font-size:.92rem}.seo-breadcrumbs a,.seo-breadcrumbs strong{color:inherit}
      .seo-grid{display:grid;gap:18px;grid-template-columns:repeat(auto-fit,minmax(240px,1fr))}.seo-card,.seo-panel,.seo-lesson-section{background:#fff;border:1px solid #d9e6ec;border-radius:14px;box-shadow:0 16px 38px rgba(13,33,55,.07);padding:20px}
      .seo-card{display:block;text-decoration:none;transition:transform .2s ease,box-shadow .2s ease}.seo-card:hover{box-shadow:0 20px 44px rgba(13,33,55,.12);transform:translateY(-2px)}
      .seo-card h2,.seo-card h3,.seo-panel h2,.seo-lesson-section h2{color:#0d2137;margin-top:0}.seo-card p,.seo-panel p,.seo-lesson-section p,.seo-lesson-section li{line-height:1.72}
      .seo-meta{display:flex;flex-wrap:wrap;gap:10px;margin-top:18px}.seo-meta span{background:rgba(255,255,255,.14);border:1px solid rgba(255,255,255,.26);border-radius:999px;color:#fff;padding:8px 12px}
      .seo-content{display:grid;gap:18px}.seo-topic-list{display:grid;gap:12px}.seo-topic-link{align-items:flex-start;border:1px solid #d9e6ec;border-radius:12px;display:flex;gap:12px;padding:14px;text-decoration:none}
      .seo-topic-link span{background:#e8f7fa;border-radius:999px;color:#1a5f7a;flex:0 0 auto;font-weight:800;padding:4px 9px}.seo-topic-link strong{color:#0d2137;display:block}.seo-topic-link small{color:#5f7d8e}
      .seo-lesson-section{margin-bottom:16px}.seo-lesson-section summary{cursor:pointer;font-weight:800;color:#0d2137}.seo-lesson-section ul{padding-left:22px}.seo-actions{display:flex;flex-wrap:wrap;gap:12px;margin:24px 0}
      .seo-button{align-items:center;background:#9b4f72;border-radius:10px;color:#fff;display:inline-flex;font-weight:800;padding:12px 16px;text-decoration:none}.seo-button.secondary{background:#1a5f7a}
      .seo-footer{border-top:1px solid #d9e6ec;color:#5f7d8e;margin-top:44px;padding-top:24px}
      @media(max-width:720px){.seo-header{align-items:flex-start;flex-direction:column}.seo-hero{border-radius:0;margin-left:calc(clamp(16px,4vw,40px)*-1);margin-right:calc(clamp(16px,4vw,40px)*-1)}}
    </style>
  </head>
  <body class="seo-page">
    ${nav(rootRel, appHref)}
    <main class="seo-main">
      ${breadcrumbsHtml}
      ${main}
      <footer class="seo-footer">Nursing Uganda combines static SEO lesson pages with the interactive Nursing Uganda web app.</footer>
    </main>
  </body>
</html>`;
}

function schemaCourse(name, description, canonical) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name,
    description,
    provider: {
      "@type": "Organization",
      name: "Nursing Uganda",
      url: SITE_URL
    },
    url: canonical
  };
}

function renderLessonPage(data, programme, unit, topic, previous, next) {
  const slug = uniqueTopicSlug(unit, topic);
  const file = path.join(COURSES_ROOT, programme.id, unit.id, slug, "index.html");
  const canonical = canonicalFor("courses", programme.id, unit.id, slug);
  const lesson = lessonForTopic(data, programme, unit, topic);
  const title = lesson.title || topic.title;
  const description = truncateText(lesson.excerpt || `${topic.title} study notes for ${programme.label} in ${unit.title}.`);
  const rootRel = relToRoot(path.dirname(file));
  const appHash = appHashFor(programme.id, unit.id, slug);

  const main = `
    <section class="seo-hero">
      <h1>${escapeHtml(title)}</h1>
      <p>${escapeHtml(description)}</p>
      <div class="seo-meta">
        <span>${escapeHtml(programme.label)}</span>
        <span>${escapeHtml(unit.code || "Course Unit")}</span>
        <span>${escapeHtml(topic.groupTitle || "Lesson")}</span>
      </div>
    </section>
    <div class="seo-actions">
      <a class="seo-button" href="${rootRel}${escapeHtml(appHash)}">Open Interactive Lesson</a>
      <a class="seo-button secondary" href="../">Back to Unit</a>
    </div>
    <article class="seo-content">
      ${(lesson.sections || []).map((section, index) => `
        <details class="seo-lesson-section" open>
          <summary>${String(index + 1).padStart(2, "0")} ${escapeHtml(section.title)}</summary>
          ${renderBlocks(section.blocks)}
        </details>
      `).join("")}
    </article>
    <nav class="seo-actions" aria-label="Lesson navigation">
      ${previous ? `<a class="seo-button secondary" href="../${uniqueTopicSlug(unit, previous)}/">Previous: ${escapeHtml(previous.title)}</a>` : ""}
      ${next ? `<a class="seo-button secondary" href="../${uniqueTopicSlug(unit, next)}/">Next: ${escapeHtml(next.title)}</a>` : ""}
    </nav>`;

  writeFile(file, pageShell({
    file,
    title,
    description,
    canonical,
    appHash,
    breadcrumbsHtml: breadcrumbs([
      { label: "Courses", href: "../../../" },
      { label: programme.label, href: "../../" },
      { label: unit.title, href: "../" },
      { label: title, current: true }
    ]),
    main,
    schema: {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: title,
      description,
      url: canonical,
      publisher: { "@type": "Organization", name: "Nursing Uganda", url: SITE_URL },
      about: [programme.label, unit.title, topic.groupTitle].filter(Boolean)
    }
  }));

  return canonical;
}

function renderUnitPage(data, programme, unit) {
  const file = path.join(COURSES_ROOT, programme.id, unit.id, "index.html");
  const canonical = canonicalFor("courses", programme.id, unit.id);
  const topics = flatTopics(unit);
  const title = `${unit.code ? `${unit.code}: ` : ""}${unit.title}`;
  const description = truncateText(`${unit.title} topics, notes and separate lesson pages for ${programme.label} students and nursing professionals in Uganda.`);
  const rootRel = relToRoot(path.dirname(file));
  const appHash = appHashFor(programme.id, unit.id);

  const groups = (unit.topicGroups || []).map((group, groupIndex) => `
    <section class="seo-panel">
      <h2>${escapeHtml(group.title)}</h2>
      <div class="seo-topic-list">
        ${(group.topics || []).map((topic, topicIndex) => {
          const indexedTopic = topics.find((item) => item.groupIndex === groupIndex && item.topicIndex === topicIndex);
          const lesson = lessonForTopic(data, programme, unit, indexedTopic);
          return `<a class="seo-topic-link" href="${uniqueTopicSlug(unit, indexedTopic)}/">
            <span>${String(topicIndex + 1).padStart(2, "0")}</span>
            <div><strong>${escapeHtml(lesson.title || topic.title)}</strong><small>${escapeHtml(truncateText(lesson.excerpt || topic.title, 110))}</small></div>
          </a>`;
        }).join("")}
      </div>
    </section>
  `).join("");

  writeFile(file, pageShell({
    file,
    title,
    description,
    canonical,
    appHash,
    breadcrumbsHtml: breadcrumbs([
      { label: "Courses", href: "../../" },
      { label: programme.label, href: "../" },
      { label: unit.title, current: true }
    ]),
    main: `
      <section class="seo-hero">
        <h1>${escapeHtml(title)}</h1>
        <p>${escapeHtml(description)}</p>
        <div class="seo-meta"><span>${topics.length} lesson pages</span><span>Year ${unit.year}</span><span>Semester ${unit.semester}</span></div>
      </section>
      <div class="seo-actions"><a class="seo-button" href="${rootRel}${escapeHtml(appHash)}">Open Interactive Unit</a><a class="seo-button secondary" href="../">Back to Programme</a></div>
      <div class="seo-content">${groups}</div>
    `,
    schema: schemaCourse(title, description, canonical)
  }));

  return canonical;
}

function renderProgrammePage(programme) {
  const file = path.join(COURSES_ROOT, programme.id, "index.html");
  const canonical = canonicalFor("courses", programme.id);
  const units = allUnits(programme);
  const description = truncateText(`${programme.label} course units, semester structure and lesson pages for Nursing Uganda students.`);
  const rootRel = relToRoot(path.dirname(file));
  const appHash = appHashFor(programme.id);

  const unitCards = units.map((unit) => `<a class="seo-card" href="${unit.id}/">
    <h2>${escapeHtml(unit.code ? `${unit.code}: ${unit.title}` : unit.title)}</h2>
    <p>Year ${unit.year}, Semester ${unit.semester}. ${unit.topicCount || flatTopics(unit).length} separate lesson pages.</p>
  </a>`).join("");

  writeFile(file, pageShell({
    file,
    title: programme.label,
    description,
    canonical,
    appHash,
    breadcrumbsHtml: breadcrumbs([
      { label: "Courses", href: "../" },
      { label: programme.label, current: true }
    ]),
    main: `
      <section class="seo-hero">
        <h1>${escapeHtml(programme.label)}</h1>
        <p>${escapeHtml(description)}</p>
        <div class="seo-meta"><span>${units.length} course units</span><span>${programme.stats?.topicCount || 0} topics</span><span>${programme.stats?.semesterCount || 0} semesters</span></div>
      </section>
      <div class="seo-actions"><a class="seo-button" href="${rootRel}${escapeHtml(appHash)}">Open Interactive Programme</a><a class="seo-button secondary" href="../">All Courses</a></div>
      <div class="seo-grid">${unitCards}</div>
    `,
    schema: schemaCourse(programme.label, description, canonical)
  }));

  return canonical;
}

function renderCoursesIndex(data) {
  const file = path.join(COURSES_ROOT, "index.html");
  const canonical = canonicalFor("courses");
  const description = "Browse Nursing Uganda nursing and midwifery programmes, course units and separate lesson pages.";
  const programmeCards = data.programmes.map((programme) => `<a class="seo-card" href="${programme.id}/">
    <h2>${escapeHtml(programme.label)}</h2>
    <p>${programme.stats?.unitCount || allUnits(programme).length} course units and ${programme.stats?.topicCount || 0} mapped topics.</p>
  </a>`).join("");

  writeFile(file, pageShell({
    file,
    title: "Courses",
    description,
    canonical,
    appHash: "#/courses",
    breadcrumbsHtml: breadcrumbs([{ label: "Courses", current: true }]),
    main: `
      <section class="seo-hero">
        <h1>Nursing Uganda Courses</h1>
        <p>${escapeHtml(description)}</p>
        <div class="seo-meta"><span>${data.programmes.length} programmes</span><span>${data.totals?.courseUnits || 0} course units</span><span>${data.totals?.topics || 0} lesson pages</span></div>
      </section>
      <div class="seo-grid">${programmeCards}</div>
    `,
    schema: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Nursing Uganda Courses",
      description,
      url: canonical
    }
  }));

  return canonical;
}

function sitemapXml(urls) {
  const unique = [...new Map(urls.map((item) => [item.loc, item])).values()];
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${unique.map((item) => `  <url>
    <loc>${escapeHtml(item.loc)}</loc>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>
  </url>`).join("\n")}
</urlset>
`;
}

function main() {
  const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  const urls = [
    { loc: `${SITE_URL}/`, changefreq: "weekly", priority: "1.0" },
    { loc: renderCoursesIndex(data), changefreq: "weekly", priority: "0.9" }
  ];

  let programmeCount = 0;
  let unitCount = 0;
  let topicCount = 0;

  for (const programme of data.programmes || []) {
    urls.push({ loc: renderProgrammePage(programme), changefreq: "weekly", priority: "0.85" });
    programmeCount += 1;

    for (const unit of allUnits(programme)) {
      urls.push({ loc: renderUnitPage(data, programme, unit), changefreq: "weekly", priority: "0.8" });
      unitCount += 1;
      const topics = flatTopics(unit);
      for (const topic of topics) {
        const previous = topics[topic.flatIndex - 1];
        const next = topics[topic.flatIndex + 1];
        urls.push({ loc: renderLessonPage(data, programme, unit, topic, previous, next), changefreq: "monthly", priority: "0.72" });
        topicCount += 1;
      }
    }
  }

  writeFile(path.join(ROOT, "sitemap.xml"), sitemapXml(urls));
  console.log(`Generated ${programmeCount} programme pages, ${unitCount} unit pages, ${topicCount} lesson pages and sitemap.xml.`);
}

main();
