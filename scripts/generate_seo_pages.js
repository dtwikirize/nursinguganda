#!/usr/bin/env node
/* Generate crawlable course, unit and lesson pages for Nursing Uganda. */
const fs = require("node:fs");
const path = require("node:path");

const ROOT = process.cwd();
const DATA_FILE = path.join(ROOT, "assets", "data", "curriculum.json");
const LESSON_IMAGES_MANIFEST_FILE = path.join(ROOT, "assets", "data", "lesson-images-manifest.json");
const COURSES_ROOT = path.join(ROOT, "courses");

// Lesson images manifest: slug → string[] of filenames in assets/images/lesson-images/
// Written by inject_lesson_images_from_nurses_revision.js (and later NursesLabs variant).
// If the file does not exist yet, we degrade gracefully with an empty map.
const LESSON_IMAGES_MANIFEST = (() => {
  try {
    return JSON.parse(fs.readFileSync(LESSON_IMAGES_MANIFEST_FILE, "utf8"));
  } catch {
    return {};
  }
})();
const SITE_URL = "https://nursinguganda.com";
const CSS_VERSION = "126";
const NON_LESSON_TOPIC_RE = /^(terms|privacy policy|disclaimer|about(?: us)?|click here\b.*|want notes in pdf\??.*|home|blog|contact|whatsapp|support|login|register|share|comments?|(?:nurses|midwives)\s+revision|index)$/i;

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderInlineText(value) {
  return escapeHtml(value || "").replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
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

// Source notes are full of em dashes. Replace them on the way out so every
// generated page is consistent with the rest of the site.
function stripEmDashes(text) {
  return String(text)
    .replace(/([A-Za-z0-9)"'%\]])[ ]*—[ ]*(?=[a-z0-9])/g, "$1, ")
    .replace(/([A-Za-z0-9)"'%\]])[ ]*—[ ]*(?=[A-Z])/g, "$1: ")
    .replace(/[ ]*—[ ]*/g, ", ");
}

function writeFile(file, html) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, stripEmDashes(html));
}

function cleanCoursesRoot() {
  const resolved = path.resolve(COURSES_ROOT);
  const expected = path.resolve(ROOT, "courses");
  if (resolved !== expected || !resolved.startsWith(path.resolve(ROOT))) {
    throw new Error(`Refusing to clean unexpected courses directory: ${resolved}`);
  }
  fs.rmSync(resolved, { recursive: true, force: true });
  fs.mkdirSync(resolved, { recursive: true });
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

function hasPublishableLesson(data, topic) {
  return Boolean(topic && topic.sourceSlug && data.lessons && data.lessons[topic.sourceSlug]);
}

function isNonLessonTopic(topic) {
  return NON_LESSON_TOPIC_RE.test(topic && topic.title ? topic.title : "");
}

function publishableTopics(data, unit) {
  return flatTopics(unit).filter((topic) => !isNonLessonTopic(topic) && hasPublishableLesson(data, topic));
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
    generated: true,
    sections: [
      {
        title: "Study Focus",
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
        title: "Study Wrap",
        blocks: [
          { type: "bullet", text: "Summarize the topic using the key terms, patient risks and expected nursing actions." },
          { type: "bullet", text: "Revise priority assessments, danger signs and referral points." },
          { type: "bullet", text: "Connect the notes to safe documentation, patient education and evaluation of outcomes." }
        ]
      }
    ]
  };
}

function isImportedAdminBlockText(value) {
  const text = String(value || "").trim();
  if (!text) return false;
  const plainText = text.replace(/\*\*/g, "").trim();
  return /^(?:\*\*)?(contact\s+hours|credit\s+units|module\s+unit\s+description|module\s+unit|main\s+questions?\s+to\s+answer|learning\s+outcomes?|objectives?|definition\s+of\s+terms?)\b/i.test(text)
    || /^(?:\*\*)?(revision\s+questions?|review\s+questions?|multiple\s+choice\s+questions?|fill-?in\s+questions?|quiz|questions?)\b/i.test(text)
    || /^question\s*\d+\s*[:.)-]/i.test(text)
    || /^(?:\d+|[a-z])\.\s+(?:(?:briefly|shortly|clearly)\s+)?(?:what|where|which|why|how|describe|list|name|define|explain|differentiate|identify|state|mention|discuss|compare|examine|outline|give|write)\b/i.test(plainText)
    || /^(?:\d+|[a-z])\.\s+.+\?\s*(?:answer\s*[:.-].*)?$/i.test(plainText)
    || /^(?:a|b|c|d)[.)]\s+(?:(?:briefly|shortly|clearly)\s+)?(?:what|where|which|why|how|describe|list|name|define|explain|differentiate|identify|state|mention|discuss|compare|examine|outline|give|write)\b/i.test(plainText)
    || /below are the (?:core and other )?references listed in the curriculum/i.test(text)
    || /refer to the original document for full details/i.test(text)
    || /^\(?this (?:section|is) .*curriculum/i.test(text)
    || /learning[-\s]*working\s+assignments|practical\s+exercises|underpinning\s+knowledge/i.test(text);
}

// Notes are full of "Term: explanation" lines. Bolding the term makes the page
// scannable and gives the key phrase semantic weight for search.
function emphasiseLeadTerm(html) {
  if (/^<strong/.test(html)) return html;
  const match = html.match(/^([^:<>]{2,48}):\s+(?=\S)/);
  if (!match) return html;
  const term = match[1];
  if (/[.!?]/.test(term)) return html;
  return `<strong class="seo-term">${term}:</strong> ${html.slice(match[0].length)}`;
}

function renderBlocks(blocks = []) {
  const html = [];
  let bullets = [];

  function flushBullets() {
    if (!bullets.length) return;
    html.push(`<ul>${bullets.map((item) => `<li>${emphasiseLeadTerm(renderInlineText(item))}</li>`).join("")}</ul>`);
    bullets = [];
  }

  for (const block of blocks.filter((item) => !isImportedAdminBlockText(item && item.text))) {
    if (block.type === "bullet") {
      bullets.push(block.text || "");
    } else if (block.type === "table") {
      flushBullets();
      const headers = block.headers || [];
      const rows = block.rows || [];
      html.push(`<div class="seo-note-table-wrap"><table class="seo-note-table">${headers.length ? `<thead><tr>${headers.map((item) => `<th>${renderInlineText(item)}</th>`).join("")}</tr></thead>` : ""}<tbody>${rows.map((row) => `<tr>${row.map((item) => `<td>${renderInlineText(item)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`);
    } else {
      flushBullets();
      html.push(`<p>${emphasiseLeadTerm(renderInlineText(block.text || ""))}</p>`);
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
    <a class="brand" href="/" aria-label="Nursing Uganda home"><img src="${rootRel}assets/images/nursing-uganda-icon-mark.webp" alt="" aria-hidden="true" width="34" height="34" decoding="async"><span>Nursing Uganda<small>nursinguganda.com</small></span></a>
    <nav aria-label="Main navigation">
      <a href="/courses/">Courses</a>
      <a href="/notes">Notes</a>
      <a href="/dictionary">Dictionary</a>
      <a href="/resources">Resources</a>
      <a href="/careers">Careers</a>
      <a class="seo-app-link" href="${escapeHtml(appHref)}">Open Learning Platform</a>
    </nav>
  </header>`;
}

function pageShell({ file, title, seoTitle, description, canonical, appHash, breadcrumbsHtml, breadcrumbTrail, main, schema }) {
  const rootRel = relToRoot(path.dirname(file));
  const appHref = "/notes";
  const baseTitle = seoTitle || title;
  const cleanTitle = baseTitle.endsWith("Nursing Uganda") ? baseTitle : `${baseTitle} | Nursing Uganda`;
  const schemaJson = schema ? `<script type="application/ld+json">${JSON.stringify(schema)}</script>` : "";
  const breadcrumbSchemaJson = breadcrumbTrail && breadcrumbTrail.length
    ? `<script type="application/ld+json">${JSON.stringify(breadcrumbSchema(breadcrumbTrail))}</script>`
    : "";

  return `<!doctype html>
<html lang="en-UG">
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
    <meta property="og:site_name" content="Nursing Uganda">
    <meta property="og:locale" content="en_UG">
    <meta property="og:image" content="${SITE_URL}/assets/images/nursing-uganda-logo-wordmark.png">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeHtml(cleanTitle)}">
    <meta name="twitter:description" content="${escapeHtml(description)}">
    <meta name="twitter:image" content="${SITE_URL}/assets/images/nursing-uganda-logo-wordmark.png">
    <meta name="theme-color" content="#A64468">
    ${schemaJson}${breadcrumbSchemaJson}
    <link rel="icon" href="${rootRel}assets/images/nursing-uganda-favicon.svg" type="image/svg+xml">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="preload" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" as="style" onload="this.onload=null;this.rel='stylesheet'">
    <noscript><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet"></noscript>
    <link rel="preload" href="${rootRel}assets/css/main.min.css?v=${CSS_VERSION}" as="style" onload="this.onload=null;this.rel='stylesheet'">
    <noscript><link rel="stylesheet" href="${rootRel}assets/css/main.min.css?v=${CSS_VERSION}"></noscript>
    <style>
      html{scroll-behavior:smooth}
      :root{--seo-primary:#A64468;--seo-primary-dark:#7a3050;--seo-primary-light:#fce8f0;--seo-navy:#2b1520;--seo-bg:#FDF7F9;--seo-card:#FFFFFF;--seo-border:#EFE1E7;--seo-text:#2b1520;--seo-muted:#7c6470;--seo-heading:"Inter",system-ui,sans-serif;--seo-body:"Inter",system-ui,sans-serif}
      .seo-page{background:var(--seo-bg);color:var(--seo-text);font-family:var(--seo-body)}
      .seo-header{align-items:center;background:var(--seo-card);border-bottom:1px solid var(--seo-border);display:flex;gap:24px;justify-content:space-between;padding:16px clamp(16px,4vw,56px);position:sticky;top:0;z-index:10}
      .seo-header nav{align-items:center;display:flex;flex-wrap:wrap;gap:8px 16px}.seo-header a{text-decoration:none}.seo-header .brand{align-items:center;color:inherit;display:flex;gap:10px;font-weight:800}.seo-header .brand small{color:var(--seo-muted);display:block;font-weight:500}.seo-app-link{background:var(--seo-primary);border-radius:10px;color:#fff!important;padding:10px 14px}
      .seo-main{max-width:1120px;margin:0 auto;padding:32px clamp(16px,4vw,40px) 64px}.seo-hero{background:linear-gradient(135deg,#2b1520 0%,#7a3050 45%,#A64468 100%);border-radius:18px;color:#fff;margin-bottom:24px;padding:32px}
      .seo-hero h1{color:#fff;font-family:var(--seo-heading);font-size:clamp(2rem,5vw,3.4rem);line-height:1.04;margin:14px 0}.seo-hero p{color:rgba(255,255,255,.84);font-size:1.05rem;max-width:780px}
      .seo-breadcrumbs{align-items:center;display:flex;flex-wrap:wrap;gap:8px;font-size:.92rem}.seo-breadcrumbs a,.seo-breadcrumbs strong{color:inherit}
      .seo-grid{display:grid;gap:18px;grid-template-columns:repeat(auto-fit,minmax(240px,1fr))}.seo-card,.seo-panel,.seo-lesson-section{background:var(--seo-card);border:1px solid var(--seo-border);border-radius:14px;box-shadow:0 16px 38px rgba(28,25,23,.06);padding:20px}
      .seo-card{display:block;text-decoration:none;transition:transform .2s ease,box-shadow .2s ease}.seo-card:hover{box-shadow:0 20px 44px rgba(28,25,23,.10);transform:translateY(-2px)}
      .seo-card h2,.seo-card h3,.seo-panel h2,.seo-lesson-section h2{color:var(--seo-navy);font-family:var(--seo-heading);margin-top:0}.seo-card p,.seo-panel p,.seo-lesson-section p,.seo-lesson-section li{font-size:1.08rem;line-height:1.82}.seo-lesson-section strong{background:#fce8f0;border-radius:6px;color:#2b1520;padding:0 .22em}.seo-lesson-section strong.seo-term{background:none;color:var(--seo-primary-dark);font-weight:800;padding:0}
      .seo-note-table-wrap{border:1px solid var(--seo-border);border-radius:12px;margin:16px 0;overflow:auto}.seo-note-table{border-collapse:collapse;min-width:720px;width:100%}.seo-note-table th{background:#7a3050;color:#fff;text-align:left}.seo-note-table th,.seo-note-table td{border-bottom:1px solid var(--seo-border);font-size:1rem;line-height:1.55;padding:12px}.seo-note-table tr:last-child td{border-bottom:0}
      .seo-meta{display:flex;flex-wrap:wrap;gap:10px;margin-top:18px}.seo-meta span{background:rgba(255,255,255,.14);border:1px solid rgba(255,255,255,.26);border-radius:999px;color:#fff;padding:8px 12px}
      .seo-content{display:grid;gap:18px}.seo-topic-list{display:grid;gap:12px}.seo-topic-link{align-items:flex-start;border:1px solid var(--seo-border);border-radius:12px;display:flex;gap:12px;padding:14px;text-decoration:none}
      .seo-topic-link span{background:#fce8f0;border-radius:999px;color:var(--seo-primary);flex:0 0 auto;font-weight:800;padding:4px 9px}.seo-topic-link strong{color:var(--seo-navy);display:block}.seo-topic-link small{color:var(--seo-muted)}
      .seo-lesson-section{border-left:5px solid var(--seo-primary);margin-bottom:16px}.seo-lesson-section summary{cursor:pointer;font-size:1.38rem;font-weight:900;color:var(--seo-navy);line-height:1.22}.seo-lesson-section ul{display:grid;gap:9px;padding-left:24px}.seo-actions{display:flex;flex-wrap:wrap;gap:12px;margin:24px 0}
      .seo-lesson-section.signature-section{--sig:#A64468;--sig-bg:#fce8f0;border-color:color-mix(in srgb,var(--sig) 34%,var(--seo-border) 66%);border-left-color:var(--sig);background:linear-gradient(90deg,var(--sig-bg),#fff 42%)}
      .seo-lesson-section.signature-section summary{align-items:center;display:flex;gap:10px}.seo-lesson-section.signature-section summary:before{background:var(--sig);border-radius:999px;content:"";display:inline-block;flex:0 0 auto;height:12px;width:12px}
      .seo-lesson-section.snapshot-section{--sig:#1C1917;--sig-bg:#f5f3ef}.seo-lesson-section.build-section{--sig:#7C3AED;--sig-bg:#f5f0ff}.seo-lesson-section.ward-section{--sig:#0F766E;--sig-bg:#edfdfa}.seo-lesson-section.assessment-section{--sig:#2563EB;--sig-bg:#eff6ff}.seo-lesson-section.red-flags-section{--sig:#B42318;--sig-bg:#fff1ef}.seo-lesson-section.care-plan-section{--sig:#9B4F72;--sig-bg:#fff0f6}.seo-lesson-section.teaching-section{--sig:#A64468;--sig-bg:#fce8f0}.seo-lesson-section.exam-map-section{--sig:#8A5A00;--sig-bg:#fff7df}.seo-lesson-section.clinical-lens-section{--sig:#A64468;--sig-bg:#fce8f0}
      .seo-button{align-items:center;background:var(--seo-primary);border-radius:10px;color:#fff;display:inline-flex;font-weight:800;padding:12px 16px;text-decoration:none}.seo-button.secondary{background:var(--seo-navy)}
      .seo-disclaimer,.seo-affiliate{border:1px solid var(--seo-border);border-radius:12px;background:#f5f3ef;color:var(--seo-muted);margin:14px 0;padding:12px}.seo-disclaimer strong{color:var(--seo-navy);display:block;margin-bottom:4px}.seo-affiliate{font-size:.86rem}
      .seo-reference-grid{display:grid;gap:12px;grid-template-columns:repeat(auto-fit,minmax(220px,1fr))}.seo-reference-grid article{border:1px solid var(--seo-border);border-radius:12px;padding:14px}.seo-reference-grid strong{color:var(--seo-navy);display:block}.seo-reference-grid span,.seo-reference-grid small{color:var(--seo-muted);display:block;margin:4px 0 8px}.seo-reference-grid a{color:var(--seo-primary);font-weight:800}.seo-video{align-items:start;display:grid;gap:10px}
      .seo-footer{border-top:1px solid var(--seo-border);color:var(--seo-muted);margin-top:44px;padding-top:24px}.seo-footer a{color:var(--seo-primary);font-weight:800;margin-right:12px}
      @media(max-width:720px){.seo-header{align-items:flex-start;flex-direction:column}.seo-hero{border-radius:0;margin-left:calc(clamp(16px,4vw,40px)*-1);margin-right:calc(clamp(16px,4vw,40px)*-1)}}
    </style>
    <script>
      if ("scrollRestoration" in history) history.scrollRestoration = "manual";
      window.addEventListener("load", () => window.scrollTo(0, 0));
      window.addEventListener("pageshow", () => window.scrollTo(0, 0));
      // Open a <details> element when a TOC anchor link targets it
      document.addEventListener("click", function(e) {
        var a = e.target.closest("a[href^='#']");
        if (!a) return;
        var id = a.getAttribute("href").slice(1);
        if (!id) return;
        var el = document.getElementById(id);
        if (el && el.tagName === "DETAILS") el.open = true;
      });
    </script>
  </head>
  <body class="seo-page">
    <a href="#" aria-label="Back to top" title="Back to top" style="align-items:center;background:var(--seo-primary);border-radius:999px;bottom:24px;box-shadow:0 4px 14px rgba(0,0,0,.28);color:#fff;display:flex;font-size:1.2rem;font-weight:900;height:46px;justify-content:center;position:fixed;right:22px;text-decoration:none;width:46px;z-index:50">↑</a>
    ${nav(rootRel, appHref)}
    <main class="seo-main">
      ${breadcrumbsHtml}
      ${main}
      <footer class="seo-footer">
        Nursing Uganda is a peer revision resource and does not replace formal student notes or clinical guidance.
        <div><a href="/privacy">Privacy</a><a href="/privacy-choices">Privacy Choices</a><a href="/cookies">Cookies</a><a href="/disclaimer">Disclaimer</a><a href="/terms">Terms</a><a href="/corrections">Corrections</a></div>
      </footer>
    </main>
  </body>
</html>`;
}

function breadcrumbSchema(trail) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
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

const SEO_REFERENCES = [
  {
    title: "Open RN Nursing Pharmacology, 2nd edition",
    author: "Open RN / NCBI Bookshelf",
    href: "https://www.ncbi.nlm.nih.gov/books/NBK595000/",
    subjects: /pharmac|drug|medicine|dose|injection|antibiotic/
  },
  {
    title: "WHO recommendations on maternal health, 2nd edition",
    author: "World Health Organization",
    href: "https://www.ncbi.nlm.nih.gov/books/NBK615644/",
    subjects: /maternal|pregnan|antenatal|labou?r|postnatal|obstetric|midwifery/
  },
  {
    title: "WHO recommendations on newborn health",
    author: "World Health Organization",
    href: "https://iris.who.int/handle/10665/259269",
    subjects: /newborn|neonatal|baby/
  },
  {
    title: "WHO recommendations on child health",
    author: "World Health Organization",
    href: "https://iris.who.int/handle/10665/259267",
    subjects: /child|children|paediatric|pediatric|immuni|infection/
  },
  {
    title: "Anatomy and Physiology 2e",
    author: "OpenStax / Rice University",
    href: "https://openstax.org/details/books/anatomy-and-physiology-2e",
    subjects: /anatomy|physiology|body|cell|tissue|system/
  },
  {
    title: "Nursing Education and Regulation in Uganda",
    author: "Local Uganda nursing education research PDF",
    href: "",
    subjects: /regulation|licensing|professional|ethics|education|management/
  }
];

function youtubeUrl(programme, unit, topic) {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(`${topic.title} ${unit.title} nursing lecture`)}`;
}


function isLearningOutcomeSection(section) {
  return Boolean(section && /learning\s+(outcomes?|objectives?)/i.test(section.title || ""));
}

function visibleLessonSections(lesson) {
  return (lesson && lesson.sections ? lesson.sections : []).filter((section) => !isLearningOutcomeSection(section) && !isImportedAdminSection(section));
}

function isImportedAdminSection(section) {
  const title = String(section && section.title ? section.title : "").trim();
  return /^(module\s+unit\b|module\s+unit\s+description|contact\s+hours|credit\s+units|course\s+units)$/i.test(title)
    || /^(revision\s+questions?|review\s+questions?|multiple\s+choice\s+questions?|fill-?in\s+questions?|quiz|questions?)\b/i.test(title)
    || /references?\s*(?:\(|for|from|\b)/i.test(title)
    || /(?:from|in)\s+curriculum|learning[-\s]*working\s+assignments|practical\s+exercises|underpinning\s+knowledge|curriculum\s*$/i.test(title);
}

function imageAlt(filename) {
  const name = filename
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\d+x\d+$/i, "")
    .replace(/\s+/g, " ")
    .trim();
  // Generic filenames like "img45", "image 115", "fig 3" get a meaningful label
  if (/^(img|image|figure|fig|photo|pic|illustration)\s*\d*$/i.test(name) || /^\d+$/.test(name)) {
    return "Anatomy Diagram";
  }
  return name.replace(/\b\w/g, (c) => c.toUpperCase());
}

function renderLessonImagesSection(slug, rootRel) {
  const allFilenames = LESSON_IMAGES_MANIFEST[slug];
  if (!allFilenames || !allFilenames.length) return "";
  const filenames = allFilenames.slice(0, 8);
  const remaining = allFilenames.length - filenames.length;
  const figures = filenames.map((filename) => {
    const alt = escapeHtml(imageAlt(filename));
    const src = `${rootRel}assets/images/lesson-images/${escapeHtml(filename)}`;
    return (
      `<figure style="margin:0;break-inside:avoid">` +
      `<img src="${src}" alt="${alt}" loading="lazy" ` +
      `style="max-width:100%;height:auto;border-radius:8px;border:1px solid var(--seo-border);display:block">` +
      `<figcaption style="font-size:.82rem;color:var(--seo-muted);margin-top:4px;text-align:center">${alt}</figcaption>` +
      `</figure>`
    );
  }).join("\n          ");
  const moreNote = remaining > 0 ? `<p style="color:var(--seo-muted);font-size:.85rem;margin:8px 0 0">${remaining} more diagram${remaining > 1 ? "s" : ""} available — open the lesson for full illustrations.</p>` : "";
  return `
      <details class="seo-lesson-section" id="lesson-images">
        <summary>Illustrations and Diagrams (${allFilenames.length})</summary>
        <div class="lesson-images-section" style="display:grid;gap:16px;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));padding:8px 0">
          ${figures}
        </div>
        ${moreNote}
      </details>`;
}

function renderTOC(sections) {
  if (!sections || sections.length < 3) return "";
  const count = sections.length;
  const links = sections.map((section, i) =>
    `<a href="#section-${i + 1}" style="background:#eef4f8;border:1px solid var(--seo-border);border-radius:8px;color:var(--seo-primary);display:block;font-size:.88rem;font-weight:600;padding:8px 12px;text-decoration:none">${escapeHtml(section.title)}</a>`
  ).join("\n          ");
  const grid = `<div style="display:grid;gap:8px;grid-template-columns:repeat(auto-fill,minmax(180px,1fr))${count > 12 ? ";margin-top:12px" : ""}">
          ${links}
        </div>`;
  // Short lessons: always-visible nav
  if (count <= 12) {
    return `
      <nav aria-label="Page sections" style="background:var(--seo-card);border:1px solid var(--seo-border);border-radius:14px;box-shadow:0 2px 8px rgba(13,33,55,.05);padding:18px;margin-bottom:4px">
        <h2 style="color:var(--seo-navy);font-family:var(--seo-heading);font-size:1.05rem;margin:0 0 12px">Contents (${count})</h2>
        ${grid}
      </nav>`;
  }
  // Long lessons: collapsible, closed by default
  return `
      <details style="background:var(--seo-card);border:1px solid var(--seo-border);border-radius:14px;box-shadow:0 2px 8px rgba(13,33,55,.05);padding:18px;margin-bottom:4px">
        <summary style="cursor:pointer;font-family:var(--seo-heading);font-size:1.05rem;font-weight:700;color:var(--seo-navy)">Contents — ${count} sections (tap to expand)</summary>
        ${grid}
      </details>`;
}

function lessonSectionClass(title) {
  if (/Nursing Uganda Snapshot/i.test(title)) return " signature-section snapshot-section";
  if (/Build The Idea/i.test(title)) return " signature-section build-section";
  if (/Ward Mode/i.test(title)) return " signature-section ward-section";
  if (/What The Nurse Looks For|Assessment Guide/i.test(title)) return " signature-section assessment-section";
  if (/Red Flags/i.test(title)) return " signature-section red-flags-section";
  if (/Care Plan Map|Nursing Priorities/i.test(title)) return " signature-section care-plan-section";
  if (/Patient Teaching/i.test(title)) return " signature-section teaching-section";
  if (/Exam Answer Map/i.test(title)) return " signature-section exam-map-section";
  if (/Nursing Uganda Clinical Lens/i.test(title)) return " signature-section clinical-lens-section";
  if (/revision|question|exam/i.test(title)) return " exam-section";
  if (/reference|bibliography/i.test(title)) return " reference-section";
  return "";
}

function isLearningOutcomeText(value) {
  const text = String(value || "").trim();
  return /learning\s+(outcomes?|objectives?)/i.test(text)
    || /by\s+the\s+end\s+of\s+this\s+(unit|lesson|course|topic)/i.test(text)
    || /^(at\s+the\s+end\s+of|upon\s+completion|after\s+this\s+(unit|lesson))/i.test(text)
    || /student\s+shall\s+be\s+able\s+to/i.test(text)
    || /^(define|describe|explain|list|state|identify|discuss|outline|differentiate)\b/i.test(text)
    // Section headings that leaked into excerpts and became meta descriptions.
    || /^(main\s+questions?\s+to\s+answer|questions?\s+to\s+answer|introduction|overview|definition\s+of\s+terms?|terminolog(y|ies)|key\s+terms?|content|contents)\b/i.test(text);
}

function lessonExcerptFor(programme, unit, topic, lesson, max) {
  const unitLabel = `${unit.code ? `${unit.code}: ` : ""}${unit.title}`;
  const fallback = `${topic.title} study notes for ${programme.label} students in Uganda, covering ${unitLabel} with revision points, clinical application and exam-focused summaries.`;
  const raw = lesson && lesson.excerpt && !isLearningOutcomeText(lesson.excerpt) ? String(lesson.excerpt).trim() : "";
  // Very short excerpts produce weak, duplicate-looking snippets, so top them up with context.
  if (!raw) return max ? truncateText(fallback, max) : fallback;
  // The same excerpt is reused by topics that appear in several programmes, so
  // the programme and unit have to be appended or the snippets read as duplicates.
  const context = `${programme.label}, ${unitLabel}.`;
  const room = max ? Math.max(40, max - context.length - 2) : 400;
  const lead = truncateText(raw.replace(/[.\s]+$/, ""), room);
  const text = `${lead}. ${context}`;
  return text;
}

function referencesForTopic(programme, unit, topic) {
  const text = `${programme.label} ${unit.title} ${topic.groupTitle || ""} ${topic.title}`.toLowerCase();
  const matched = SEO_REFERENCES.filter((reference) => reference.subjects.test(text));
  return (matched.length ? matched : SEO_REFERENCES.slice(0, 2)).slice(0, 4);
}

function originalSeoExpansion(programme, unit, topic) {
  const text = `${programme.label} ${unit.title} ${topic.groupTitle || ""} ${topic.title}`.toLowerCase();
  if (/classification|drug class|drug group/.test(text)) {
    return `${topic.title} should be studied as a way of organizing medicines by therapeutic use, mechanism, chemical group, body-system effect and safety profile. For nursing practice, classification helps predict indications, adverse effects, contraindications and the observations required after administration.`;
  }
  if (/pregnan|labou?r|maternal|newborn|antenatal|postnatal|obstetric|midwifery/.test(text)) {
    return `${topic.title} should be reviewed through safe maternal and newborn assessment, early recognition of danger signs, respectful communication and timely referral. Connect the definition to vital signs, bleeding, fetal or newborn wellbeing, patient education and local protocol requirements.`;
  }
  if (/drug|pharmac|medicine|dose|tablet|injection|antibiotic|anaesthesia/.test(text)) {
    return `${topic.title} should be studied as a medication-safety topic: indication, dose, route, timing, contraindications, expected effects, adverse effects, documentation and patient teaching all matter.`;
  }
  if (/infection|communicable|malaria|tuberculosis|tb|hiv|sepsis|immuni|cholera|hepatitis|measles/.test(text)) {
    return `${topic.title} links cause, transmission, prevention, assessment and treatment support. Good nursing notes should include infection prevention, danger signs, adherence support and community health education.`;
  }
  return `${topic.title} should be understood beyond a short definition. Link the concept to patient history, focused assessment, common risks, nursing priorities, documentation and evaluation of outcomes.`;
}

function renderLessonPage(data, programme, unit, topic, previous, next) {
  if (!hasPublishableLesson(data, topic)) {
    throw new Error(`Refusing to publish placeholder SEO lesson: ${programme.id}/${unit.id}/${topicSlug(topic)}`);
  }
  const slug = uniqueTopicSlug(unit, topic);
  const file = path.join(COURSES_ROOT, programme.id, unit.id, slug, "index.html");
  const canonical = canonicalFor("courses", programme.id, unit.id, slug);
  const lesson = lessonForTopic(data, programme, unit, topic);
  const title = topic.title || lesson.title;
  const description = lessonExcerptFor(programme, unit, topic, lesson, 155);
  const rootRel = relToRoot(path.dirname(file));
  const appHash = appHashFor(programme.id, unit.id, slug);
  const references = referencesForTopic(programme, unit, topic);
  const related = [previous, next].filter(Boolean).slice(0, 4);
  const sections = visibleLessonSections(lesson);

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
      <a class="seo-button" href="/notes">Open in Study Hub</a>
      <a class="seo-button secondary" href="../">Back to Unit</a>
    </div>
    <article class="seo-content">
      <aside class="seo-disclaimer">
        <strong>Revision reminder</strong>
        Nursing Uganda supports revision and peer-to-peer learning only. Confirm important details with formal student notes, tutors, approved textbooks, clinical supervisors and current facility guidance.
      </aside>
      <section class="seo-panel">
        <h2>Expanded Nursing Uganda Explanation</h2>
        <p>${escapeHtml(originalSeoExpansion(programme, unit, topic))}</p>
      </section>
      ${renderTOC(sections)}
      ${sections.map((section, index) => `
        <details class="seo-lesson-section${lessonSectionClass(section.title)}"${index < 2 ? " open" : ""} id="section-${index + 1}">
          <summary>${String(index + 1).padStart(2, "0")} ${escapeHtml(section.title)}</summary>
          ${renderBlocks(section.blocks)}
        </details>
      `).join("")}
      ${renderLessonImagesSection(slug, rootRel)}
      <section class="seo-panel seo-video">
        <h2>Related Video Lectures</h2>
        <p>Watch nursing lecture videos on YouTube for this topic. Opens in a new tab.</p>
        <a class="seo-button secondary" href="${escapeHtml(youtubeUrl(programme, unit, topic))}" target="_blank" rel="noopener noreferrer">Watch on YouTube</a>
        <p class="seo-affiliate" style="margin-top:10px">External link: YouTube may use its own cookies and terms. Nursing Uganda is not affiliated with YouTube.</p>
      </section>
      <section class="seo-panel">
        <h2>Reference Books And PDFs</h2>
        <div class="seo-reference-grid">
          ${references.map((reference) => `<article>
            <strong>${escapeHtml(reference.title)}</strong>
            <span>${escapeHtml(reference.author)}</span>
            ${reference.href ? `<small class="seo-affiliate">External reference or partner link. Nursing Uganda may earn commissions only where future affiliate links are clearly disclosed.</small>` : ""}
            ${reference.href ? `<a href="${escapeHtml(reference.href)}" target="_blank" rel="noopener">Open reference</a>` : `<small>Available in the local project PDF folder.</small>`}
          </article>`).join("")}
        </div>
      </section>
    </article>
    <nav class="seo-actions" aria-label="Lesson navigation">
      ${previous ? `<a class="seo-button secondary" href="../${uniqueTopicSlug(unit, previous)}/">Previous: ${escapeHtml(previous.title)}</a>` : ""}
      ${next ? `<a class="seo-button secondary" href="../${uniqueTopicSlug(unit, next)}/">Next: ${escapeHtml(next.title)}</a>` : ""}
    </nav>`;

  writeFile(file, pageShell({
    file,
    title,
    // The same topic (e.g. Tuberculosis) appears in many programmes, so the
    // programme has to be in the title or Google treats them as duplicates.
    seoTitle: `${title} | ${unit.title} | ${programme.label}`,
    description,
    canonical,
    appHash,
    breadcrumbsHtml: breadcrumbs([
      { label: "Courses", href: "../../../" },
      { label: programme.label, href: "../../" },
      { label: unit.title, href: "../" },
      { label: title, current: true }
    ]),
    breadcrumbTrail: [
      { name: "Courses", url: `${SITE_URL}/courses/` },
      { name: programme.label, url: canonicalFor("courses", programme.id) },
      { name: unit.title, url: canonicalFor("courses", programme.id, unit.id) },
      { name: title, url: canonical }
    ],
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
  const topics = publishableTopics(data, unit);
  const title = `${unit.code ? `${unit.code}: ` : ""}${unit.title}`;
  const description = truncateText(`${unit.title} topics, notes and separate lesson pages for ${programme.label} students and nursing professionals in Uganda.`);
  const seoTitle = `${unit.title} | ${programme.label}`;
  const rootRel = relToRoot(path.dirname(file));
  const appHash = appHashFor(programme.id, unit.id);

  const groups = (unit.topicGroups || []).map((group, groupIndex) => {
    const groupTopics = topics.filter((topic) => topic.groupIndex === groupIndex);
    if (!groupTopics.length) return "";
    return `
    <section class="seo-panel">
      <h2>${escapeHtml(group.title)}</h2>
      <div class="seo-topic-list">
        ${groupTopics.map((indexedTopic) => {
          const lesson = lessonForTopic(data, programme, unit, indexedTopic);
          return `<a class="seo-topic-link" href="${uniqueTopicSlug(unit, indexedTopic)}/">
            <span>${String(indexedTopic.topicIndex + 1).padStart(2, "0")}</span>
            <div><strong>${escapeHtml(lesson.title || indexedTopic.title)}</strong><small>${escapeHtml(lessonExcerptFor(programme, unit, indexedTopic, lesson, 110))}</small></div>
          </a>`;
        }).join("")}
      </div>
    </section>
  `;
  }).join("");

  writeFile(file, pageShell({
    file,
    title,
    seoTitle,
    description,
    canonical,
    appHash,
    breadcrumbsHtml: breadcrumbs([
      { label: "Courses", href: "../../" },
      { label: programme.label, href: "../" },
      { label: unit.title, current: true }
    ]),
    breadcrumbTrail: [
      { name: "Courses", url: `${SITE_URL}/courses/` },
      { name: programme.label, url: canonicalFor("courses", programme.id) },
      { name: unit.title, url: canonical }
    ],
    main: `
      <section class="seo-hero">
        <h1>${escapeHtml(title)}</h1>
        <p>${escapeHtml(description)}</p>
        <div class="seo-meta"><span>${topics.length} lesson pages</span><span>Year ${unit.year}</span><span>Semester ${unit.semester}</span></div>
      </section>
      <div class="seo-actions"><a class="seo-button" href="/notes">Open in Study Hub</a><a class="seo-button secondary" href="../">Back to Programme</a></div>
      <div class="seo-content">${groups}</div>
    `,
    schema: schemaCourse(title, description, canonical)
  }));

  return canonical;
}

function renderProgrammePage(data, programme) {
  const file = path.join(COURSES_ROOT, programme.id, "index.html");
  const canonical = canonicalFor("courses", programme.id);
  const units = allUnits(programme).map((unit) => ({ ...unit, publishableCount: publishableTopics(data, unit).length })).filter((unit) => unit.publishableCount);
  const description = truncateText(`${programme.label} course units, semester structure and lesson pages for Nursing Uganda students.`);
  const rootRel = relToRoot(path.dirname(file));
  const appHash = appHashFor(programme.id);

  const unitCards = units.map((unit) => `<a class="seo-card" href="${unit.id}/">
    <h2>${escapeHtml(unit.code ? `${unit.code}: ${unit.title}` : unit.title)}</h2>
    <p>Year ${unit.year}, Semester ${unit.semester}. ${unit.publishableCount} indexed lesson pages.</p>
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
    breadcrumbTrail: [
      { name: "Courses", url: `${SITE_URL}/courses/` },
      { name: programme.label, url: canonical }
    ],
    main: `
      <section class="seo-hero">
        <h1>${escapeHtml(programme.label)}</h1>
        <p>${escapeHtml(description)}</p>
        <div class="seo-meta"><span>${units.length} course units</span><span>${programme.stats?.topicCount || 0} topics</span><span>${programme.stats?.semesterCount || 0} semesters</span></div>
      </section>
      <div class="seo-actions"><a class="seo-button" href="/courses/curriculum">Open Curriculum Map</a><a class="seo-button secondary" href="../">All Courses</a></div>
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
  const programmeCards = data.programmes.map((programme) => {
    const units = allUnits(programme).map((unit) => publishableTopics(data, unit).length).filter(Boolean);
    const lessonCount = units.reduce((sum, count) => sum + count, 0);
    if (!lessonCount) return "";
    return `<a class="seo-card" href="${programme.id}/">
    <h2>${escapeHtml(programme.label)}</h2>
    <p>${units.length} course units and ${lessonCount} indexed lesson pages.</p>
  </a>`;
  }).join("");

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
        <div class="seo-meta"><span>${data.programmes.length} programmes</span><span>Published lessons only</span></div>
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

// Hub routes are rendered by the SPA, so no static HTML links to them. Without
// these entries Google has no crawl path to them at all.
const STATIC_ROUTES = [
  ["/notes", "weekly", "0.95"],
  ["/courses/curriculum", "weekly", "0.9"],
  ["/dictionary", "weekly", "0.85"],
  ["/dictionary/abbreviations", "monthly", "0.7"],
  ["/dictionary/category/anatomy", "monthly", "0.7"],
  ["/dictionary/category/clinical-skills", "monthly", "0.7"],
  ["/dictionary/category/pharmacology", "monthly", "0.7"],
  ["/resources", "weekly", "0.85"],
  ["/resources/books", "monthly", "0.75"],
  ["/resources/past-papers", "weekly", "0.85"],
  ["/resources/quizzes", "weekly", "0.85"],
  ["/resources/medical-instruments", "monthly", "0.8"],
  ["/resources/schools", "monthly", "0.8"],
  ["/resources/licensing", "monthly", "0.75"],
  ["/resources/student-support", "monthly", "0.7"],
  ["/careers", "weekly", "0.8"],
  ["/careers/cv-uganda", "monthly", "0.75"],
  ["/careers/cv-international", "monthly", "0.7"],
  ["/careers/cover-letter", "monthly", "0.7"],
  ["/careers/interview-prep", "monthly", "0.7"],
  ["/careers/portfolio", "monthly", "0.65"],
  ["/careers/salary-guide", "monthly", "0.7"],
  ["/flashcards", "monthly", "0.7"],
  ["/contact", "yearly", "0.4"],
  ["/privacy", "yearly", "0.3"],
  ["/cookies", "yearly", "0.3"],
  ["/disclaimer", "yearly", "0.3"],
  ["/terms", "yearly", "0.3"]
];

function sitemapXml(urls) {
  const unique = [...new Map(urls.map((item) => [item.loc, item])).values()];
  const lastmod = new Date().toISOString().slice(0, 10);
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${unique.map((item) => `  <url>
    <loc>${escapeHtml(item.loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>
  </url>`).join("\n")}
</urlset>
`;
}

function main() {
  const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  cleanCoursesRoot();
  const urls = [
    { loc: `${SITE_URL}/`, changefreq: "weekly", priority: "1.0" },
    { loc: renderCoursesIndex(data), changefreq: "weekly", priority: "0.9" },
    ...STATIC_ROUTES.map(([route, changefreq, priority]) => ({ loc: `${SITE_URL}${route}`, changefreq, priority }))
  ];

  let programmeCount = 0;
  let unitCount = 0;
  let topicCount = 0;

  for (const programme of data.programmes || []) {
    const units = allUnits(programme).filter((unit) => publishableTopics(data, unit).length);
    if (!units.length) continue;
    urls.push({ loc: renderProgrammePage(data, programme), changefreq: "weekly", priority: "0.85" });
    programmeCount += 1;

    for (const unit of units) {
      urls.push({ loc: renderUnitPage(data, programme, unit), changefreq: "weekly", priority: "0.8" });
      unitCount += 1;
      const topics = publishableTopics(data, unit);
      for (const [topicIndex, topic] of topics.entries()) {
        const previous = topics[topicIndex - 1];
        const next = topics[topicIndex + 1];
        urls.push({ loc: renderLessonPage(data, programme, unit, topic, previous, next), changefreq: "monthly", priority: "0.72" });
        topicCount += 1;
      }
    }
  }

  writeFile(path.join(ROOT, "sitemap.xml"), sitemapXml(urls));
  console.log(`Generated ${programmeCount} programme pages, ${unitCount} unit pages, ${topicCount} lesson pages and sitemap.xml.`);
}

main();
