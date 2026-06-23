#!/usr/bin/env node
/* Generate data used by the single-page Nursing Uganda app. */
const fs = require("node:fs");
const path = require("node:path");

const ROOT = process.cwd();
const LEGACY_SOURCE_FOLDER = ["Nurses", "revision"].join(" ");
const LEGACY_SOURCE_DIR = ["Nurses", "Revision", "Full"].join("_");
const SOURCE_ROOT = path.resolve(ROOT, "..", LEGACY_SOURCE_FOLDER, LEGACY_SOURCE_DIR);
const MIDWIVES_SOURCE_ROOT = path.resolve(ROOT, "..", "Midwives Revision", "Midwives_Revision_Full");
const DIPLOMA_TREE = path.join(ROOT, "programmes", "diploma-nursing", "curriculum-tree.json");
const OUT_FILE = path.join(ROOT, "assets", "data", "curriculum.json");
const NON_LESSON_LINK_RE = /^(terms|privacy policy|disclaimer|about(?: us)?|click here\b.*|want notes in pdf\??.*|home|blog|contact|whatsapp|support|login|register|share|comments?|(?:nurses|midwives)\s+revision|index)$/i;

const BNS_FILES = [
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

function clean(value) {
  return String(value)
    .replace(/Â/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&rsquo;|&#8217;/g, "'")
    .replace(/&lsquo;|&#8216;/g, "'")
    .replace(/&ndash;|&#8211;/g, "-")
    .replace(/&mdash;|&#8212;/g, "-")
    .replace(/&quot;/g, '"')
    .replace(/Ã‚/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function decodeText(value) {
  const withEmphasis = String(value)
    .replace(/<(strong|b)[^>]*>([\s\S]*?)<\/\1>/gi, (_, _tag, inner) => ` **${clean(inner)}** `)
    .replace(/<(em|i)[^>]*>([\s\S]*?)<\/\1>/gi, (_, _tag, inner) => ` ${clean(inner)} `);

  return clean(withEmphasis
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/(p|li|h[1-6]|td|th)>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCharCode(parseInt(code, 16))));
}

function readSource(file) {
  return fs.readFileSync(path.join(SOURCE_ROOT, file), "utf8");
}

function readSourceFrom(sourceRoot, file) {
  return fs.readFileSync(path.join(sourceRoot, file), "utf8");
}

function parseLinks(block) {
  const links = [];
  const linkRegex = /<a\s+[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;
  for (const match of block.matchAll(linkRegex)) {
    const title = clean(match[2]);
    if (!title || title.length < 2) continue;
    if (NON_LESSON_LINK_RE.test(title)) continue;
    const sourceSlug = match[1].startsWith("http") ? "" : match[1].replace(/\.html(#.*)?$/i, "");
    if (NON_LESSON_LINK_RE.test(sourceSlug)) continue;
    links.push({
      title,
      sourceHref: match[1],
      sourceSlug
    });
  }
  return links;
}

function sourceRootForName(sourceName) {
  return /midwives|midwifery/i.test(sourceName || "") ? MIDWIVES_SOURCE_ROOT : SOURCE_ROOT;
}

function localFileFromHref(sourceRoot, href) {
  if (!href || href.startsWith("#")) return null;
  let file = href.split("#")[0].split("?")[0];
  if (/^https?:\/\//i.test(file)) {
    try {
      file = new URL(file).pathname;
    } catch {
      return null;
    }
  }
  file = path.basename(file);
  if (!file) return null;
  if (!/\.html$/i.test(file)) file = `${file.replace(/\/$/, "")}.html`;
  const resolved = path.join(sourceRoot, file);
  return fs.existsSync(resolved) ? resolved : null;
}

function lessonTitle(html, fallback) {
  const h1 = html.match(/<h1[^>]*class="[^"]*\bentry-title\b[^"]*"[^>]*>([\s\S]*?)<\/h1>/i);
  if (h1) return decodeText(h1[1]).replace(/\s+-\s+Nursing Uganda$/i, "");
  return parseSourceTitle(html, fallback).replace(/\s+-\s+Nursing Uganda$/i, "");
}

function metaDescription(html) {
  const match = html.match(/<meta\s+content="([^"]+)"\s+name="description"\s*\/?>/i);
  return match ? decodeText(match[1]) : "";
}

function extractContentRegion(html) {
  const entryStart = html.search(/<div[^>]+class="[^"]*\bentry-content\b[^"]*"[^>]*>/i);
  let region = "";
  if (entryStart >= 0) {
    const articleEnd = html.indexOf("</article>", entryStart);
    region = html.slice(entryStart, articleEnd > entryStart ? articleEnd : html.length);
  } else {
    const bodyStart = html.search(/<h1|<h2/i);
    const bodyEnd = html.search(/<footer|elementorFrontendConfig|var localize/i);
    region = html.slice(bodyStart > -1 ? bodyStart : 0, bodyEnd > bodyStart ? bodyEnd : html.length);
  }

  return region
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<svg[\s\S]*?<\/svg>/gi, " ")
    .replace(/<form[\s\S]*?<\/form>/gi, " ")
    .replace(/<ins[\s\S]*?<\/ins>/gi, " ")
    .replace(/<nav[\s\S]*?<\/nav>/gi, " ")
    .replace(/<div[^>]+id="ez-toc-container"[\s\S]*?<\/nav>\s*<\/div>/gi, " ")
    .replace(/<div[^>]+class="[^"]*heateor_sss[\s\S]*$/i, " ");
}

function extractLesson(sourceRoot, href, fallbackTitle) {
  const file = localFileFromHref(sourceRoot, href);
  if (!file) return null;
  const html = fs.readFileSync(file, "utf8");
  const title = lessonTitle(html, fallbackTitle);
  const description = metaDescription(html);
  const region = extractContentRegion(html);
  const sections = [];
  let current = { title: "Overview", blocks: [] };
  const pushCurrent = () => {
    if (current.blocks.length) sections.push(current);
  };

  for (const match of region.matchAll(/<(h[1-4]|p|li|tr)[^>]*>([\s\S]*?)<\/\1>/gi)) {
    const tag = match[1].toLowerCase();
    const text = decodeText(match[2]);
    if (!text || text.length < 3) continue;
    if (/table of contents|toggle|spread the love|preparing questions|great effort|choose your answer/i.test(text)) continue;
    if (/^(?:\*\*)?(contact\s+hours|credit\s+units|module\s+unit\s+description|module\s+unit)\b/i.test(text)) continue;
    if (/^(?:\*\*)?(revision\s+questions?|review\s+questions?|multiple\s+choice\s+questions?|fill-?in\s+questions?|quiz|questions?)\b/i.test(text)) continue;
    if (/^question\s*\d+\s*[:.)-]/i.test(text)) continue;
    if (/^(?:\d+|[a-z])\.\s+(?:(?:briefly|shortly|clearly)\s+)?(?:what|where|which|why|how|describe|list|name|define|explain|differentiate|identify|state|mention|discuss|compare|examine|outline|give|write)\b/i.test(text.replace(/\*\*/g, "").trim())) continue;
    if (/^(?:\d+|[a-z])\.\s+.+\?\s*(?:answer\s*[:.-].*)?$/i.test(text.replace(/\*\*/g, "").trim())) continue;
    if (/learning[-\s]*working\s+assignments|practical\s+exercises|underpinning\s+knowledge|below are the .*references listed in the curriculum|refer to the original document for full details/i.test(text)) continue;
    if (tag.startsWith("h")) {
      if (/quiz|references from curriculum/i.test(text)) break;
      if (/^(module\s+unit\b|module\s+unit\s+description|contact\s+hours|credit\s+units|course\s+units)$/i.test(text)) continue;
      if (/^(revision\s+questions?|review\s+questions?|multiple\s+choice\s+questions?|fill-?in\s+questions?|quiz|questions?)\b/i.test(text)) continue;
      if (/references?\s*(?:\(|for|from|\b)|(?:from|in)\s+curriculum|learning[-\s]*working\s+assignments|practical\s+exercises|underpinning\s+knowledge|curriculum\s*$/i.test(text)) continue;
      pushCurrent();
      current = { title: text, blocks: [] };
      continue;
    }
    current.blocks.push({ type: tag === "li" || tag === "tr" ? "bullet" : "paragraph", text });
    if (current.blocks.length >= 220) break;
  }
  pushCurrent();

  const excerpt = description || (sections[0] && sections[0].blocks[0] ? sections[0].blocks[0].text : "");
  return {
    title,
    excerpt,
    sourceFile: path.basename(file),
    sections: sections.slice(0, 40)
  };
}

function collectLessons(programmes) {
  const lessons = {};
  const addTopic = (topic, sourceName) => {
    if (!topic.sourceSlug || lessons[topic.sourceSlug]) return;
    const lesson = extractLesson(sourceRootForName(sourceName), topic.sourceHref, topic.title);
    if (lesson) lessons[topic.sourceSlug] = lesson;
  };

  for (const programme of programmes) {
    for (const year of Object.values(programme.years)) {
      for (const semester of Object.values(year.semesters)) {
        for (const unit of semester.courseUnits) {
          for (const group of unit.topicGroups || []) {
            for (const topic of group.topics || []) {
              addTopic(topic, unit.sourceName || programme.sourceName || programme.label);
            }
          }
        }
      }
    }
  }
  return lessons;
}

function parseSourceTitle(html, fallback) {
  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (h1) return clean(h1[1]);
  const title = html.match(/<title>([\s\S]*?)<\/title>/i);
  return title ? clean(title[1]).replace(/\s+-\s+Nursing Uganda$/i, "") : fallback;
}

function parseSectionedUnit(file) {
  const html = readSource(file);
  const bodyStart = Math.max(html.search(/<h1/i), 0);
  const bodyEnd = html.search(/Key Reference|References|elementorFrontendConfig|var localize/i);
  const content = html.slice(bodyStart, bodyEnd > bodyStart ? bodyEnd : html.length);
  const rawTitle = parseSourceTitle(html, file.replace(".html", ""));
  const codeMatch = rawTitle.match(/\b([A-Z]{2,4}\s*\d{3,4})\b/);
  const code = codeMatch ? codeMatch[1].replace(/\s+/, " ") : "";
  const title = rawTitle.replace(/\b[A-Z]{2,4}\s*\d{3,4}\s*:?\s*/i, "").replace(/\s+Curriculum$/i, "").trim();
  const headings = [...content.matchAll(/<h[23][^>]*>([\s\S]*?)<\/h[23]>/gi)]
    .map((match) => ({ index: match.index || 0, title: clean(match[1]) }))
    .filter((item) => item.title && !/course outline|key reference/i.test(item.title));
  const topicGroups = [];

  for (let i = 0; i < headings.length; i += 1) {
    const start = headings[i].index;
    const end = i + 1 < headings.length ? headings[i + 1].index : content.length;
    const topics = parseLinks(content.slice(start, end));
    if (topics.length) topicGroups.push({ title: headings[i].title, topics });
  }

  return {
    id: slugify(title || rawTitle),
    code,
    title: title || rawTitle,
    sourceFile: file,
    topicGroups,
    topicCount: topicGroups.reduce((sum, group) => sum + group.topics.length, 0)
  };
}

function yearSemesterFromText(value) {
  const lower = value.toLowerCase();
  const words = { one: 1, two: 2, three: 3, four: 4 };
  const toNumber = (valuePart) => (/^\d+$/.test(valuePart || "") ? Number(valuePart) : words[valuePart] || null);
  const year = lower.match(/year\s+(one|two|three|four|\d+)/);
  const semester = lower.match(/semester\s+(one|two|three|four|\d+)/);
  return { year: toNumber(year && year[1]), semester: toNumber(semester && semester[1]) };
}

function parseCertificate() {
  const file = "certificate-in-nursing-updated-curriculum.html";
  const html = readSource(file);
  const markers = [];

  for (const match of html.matchAll(/price-currency">([\s\S]*?)<\/span>/gi)) {
    const label = clean(match[1]);
    const parsed = yearSemesterFromText(label);
    if (parsed.year && parsed.semester) markers.push({ type: "semester", index: match.index || 0, ...parsed });
    if (/^CN\s*\d{3}$/i.test(label)) markers.push({ type: "unit", index: match.index || 0, code: label.replace(/\s+/, " ") });
  }

  for (const match of html.matchAll(/<span>\s*(CN\s*\d{3})\s*:?\s*([^<]+)<\/span>/gi)) {
    markers.push({ type: "unit", index: match.index || 0, code: match[1].replace(/\s+/, " "), inlineTitle: clean(match[2]) });
  }

  markers.sort((a, b) => a.index - b.index);
  const years = {};
  let current = { year: 1, semester: 1 };
  const seen = new Set();

  for (let i = 0; i < markers.length; i += 1) {
    const marker = markers[i];
    if (marker.type === "semester") {
      current = { year: marker.year, semester: marker.semester };
      continue;
    }
    if (seen.has(marker.code)) continue;
    seen.add(marker.code);

    const next = i + 1 < markers.length ? markers[i + 1].index : html.length;
    const block = html.slice(marker.index, next);
    const titleMatch = block.match(/<span>([^<]*(?:CN\s*\d{3}:)?[^<]+)<\/span>/i);
    const title = (marker.inlineTitle || clean(titleMatch ? titleMatch[1] : marker.code)).replace(/^CN\s*\d{3}\s*:?\s*/i, "").trim();
    const topicGroups = [];
    const headings = [...block.matchAll(/<h[45][^>]*>([\s\S]*?)<\/h[45]>/gi)]
      .map((match) => ({ index: match.index || 0, title: clean(match[1]) }))
      .filter((item) => item.title);

    if (headings.length) {
      for (let h = 0; h < headings.length; h += 1) {
        const start = headings[h].index;
        const end = h + 1 < headings.length ? headings[h + 1].index : block.length;
        const topics = parseLinks(block.slice(start, end));
        if (topics.length) topicGroups.push({ title: headings[h].title, topics });
      }
    } else {
      const topics = parseLinks(block);
      if (topics.length) topicGroups.push({ title: "Topics", topics });
    }

    const yKey = `year-${current.year}`;
    const sKey = `semester-${current.semester}`;
    if (!years[yKey]) years[yKey] = { year: current.year, semesters: {} };
    if (!years[yKey].semesters[sKey]) years[yKey].semesters[sKey] = { semester: current.semester, courseUnits: [] };
    years[yKey].semesters[sKey].courseUnits.push({
      id: slugify(title),
      code: marker.code,
      title,
      sourceFile: file,
      topicGroups,
      topicCount: topicGroups.reduce((sum, group) => sum + group.topics.length, 0)
    });
  }

  return { id: "certificate-in-nursing", label: "Certificate in Nursing", sourceFile: file, sourceName: "Nursing Uganda", years };
}

function parseOutlineProgramme({ id, label, file, sourceRoot, sourceName }) {
  const html = readSourceFrom(sourceRoot, file);
  const markers = [];
  const unitCodePattern = /^([A-Z]{2,4}(?:-[A-Z])?)\s*\d{3}$/i;

  for (const match of html.matchAll(/price-currency">([\s\S]*?)<\/span>/gi)) {
    const text = clean(match[1]);
    const parsed = yearSemesterFromText(text);
    if (parsed.year && parsed.semester) {
      markers.push({ type: "semester", index: match.index || 0, ...parsed });
      continue;
    }
    if (unitCodePattern.test(text)) {
      markers.push({ type: "unit", index: match.index || 0, code: text.replace(/\s+/, " ") });
    }
  }

  for (const match of html.matchAll(/<span>\s*([A-Z]{2,4}(?:-[A-Z])?\s*\d{3})\s*:?\s*([^<]+)<\/span>/gi)) {
    markers.push({
      type: "unit",
      index: match.index || 0,
      code: match[1].replace(/\s+/, " "),
      inlineTitle: clean(match[2])
    });
  }

  markers.sort((a, b) => a.index - b.index);
  const years = {};
  let current = { year: 1, semester: 1 };
  const seen = new Set();

  for (let i = 0; i < markers.length; i += 1) {
    const marker = markers[i];
    if (marker.type === "semester") {
      current = { year: marker.year, semester: marker.semester };
      continue;
    }
    if (seen.has(marker.code)) continue;
    seen.add(marker.code);

    const next = i + 1 < markers.length ? markers[i + 1].index : html.length;
    const block = html.slice(marker.index, next);
    const titleMatch = block.match(/<span>([^<]*(?:[A-Z]{2,4}(?:-[A-Z])?\s*\d{3}:)?[^<]+)<\/span>/i);
    const title = (marker.inlineTitle || clean(titleMatch ? titleMatch[1] : marker.code))
      .replace(/^[A-Z]{2,4}(?:-[A-Z])?\s*\d{3}\s*:?\s*/i, "")
      .trim();
    const topicGroups = [];
    const headings = [...block.matchAll(/<h[3-6][^>]*>([\s\S]*?)<\/h[3-6]>/gi)]
      .map((heading) => ({ index: heading.index || 0, title: clean(heading[1]) }))
      .filter((heading) => heading.title && !/updated curriculum/i.test(heading.title));

    if (headings.length) {
      for (let h = 0; h < headings.length; h += 1) {
        const start = headings[h].index;
        const end = h + 1 < headings.length ? headings[h + 1].index : block.length;
        const topics = parseLinks(block.slice(start, end));
        if (topics.length) topicGroups.push({ title: headings[h].title, topics });
      }
    } else {
      const topics = parseLinks(block);
      if (topics.length) topicGroups.push({ title: "Topics", topics });
    }

    const yKey = `year-${current.year}`;
    const sKey = `semester-${current.semester}`;
    if (!years[yKey]) years[yKey] = { year: current.year, semesters: {} };
    if (!years[yKey].semesters[sKey]) years[yKey].semesters[sKey] = { semester: current.semester, courseUnits: [] };
    years[yKey].semesters[sKey].courseUnits.push({
      id: slugify(title || marker.code),
      code: marker.code,
      title: title || marker.code,
      sourceFile: file,
      sourceName,
      topicGroups,
      topicCount: topicGroups.reduce((sum, group) => sum + group.topics.length, 0)
    });
  }

  return { id, label, sourceFile: file, sourceName, years };
}

function loadMidwifery() {
  return [
    parseOutlineProgramme({
      id: "certificate-in-midwifery",
      label: "Certificate in Midwifery",
      file: "certificate-in-midwifery-course-outline.html",
      sourceRoot: MIDWIVES_SOURCE_ROOT,
      sourceName: "Midwives Revision"
    }),
    parseOutlineProgramme({
      id: "diploma-in-midwifery-e-learners",
      label: "Diploma in Midwifery (E-Learners)",
      file: "diploma-in-midwifery-e-learners-course-outline.html",
      sourceRoot: MIDWIVES_SOURCE_ROOT,
      sourceName: "Midwives Revision"
    }),
    parseOutlineProgramme({
      id: "diploma-in-midwifery-extension",
      label: "Diploma in Midwifery (Extension)",
      file: "diploma-in-midwifery-extension-course-outline.html",
      sourceRoot: MIDWIVES_SOURCE_ROOT,
      sourceName: "Midwives Revision"
    })
  ];
}

function loadDiploma() {
  return [
    parseOutlineProgramme({
      id: "diploma-nursing-direct",
      label: "Diploma in Nursing (Direct)",
      file: "diploma-in-nursing-direct-curriculum.html",
      sourceRoot: SOURCE_ROOT,
      sourceName: "Nursing Uganda"
    }),
    parseOutlineProgramme({
      id: "diploma-nursing-extension",
      label: "Diploma in Nursing (Extension)",
      file: "diploma-nursing-extension-curriculum.html",
      sourceRoot: SOURCE_ROOT,
      sourceName: "Nursing Uganda"
    })
  ];
}

function parseBns() {
  const html = readSource("bachelor-of-nursing-science-curriculum.html");
  const content = html.slice(Math.max(html.indexOf('<h3 class="bns-year-heading"'), 0));
  const years = {};
  let currentYear = 1;

  for (const match of content.matchAll(/<h3 class="bns-year-heading"[^>]*>([\s\S]*?)<\/h3>|<a class="bns-course-item" href="([^"]+)"[\s\S]*?<span class="bns-course-title">([\s\S]*?)<\/span>/gi)) {
    if (match[1]) {
      currentYear = /ii/i.test(clean(match[1])) ? 2 : 1;
      continue;
    }
    const unit = parseSectionedUnit(match[2]);
    const titleMatch = clean(match[3]).match(/^([A-Z]{2,4}\s*\d{3,4})\s*:?\s*(.+)$/i);
    if (titleMatch) {
      unit.code = titleMatch[1];
      unit.title = titleMatch[2];
      unit.id = slugify(unit.title);
    }
    const yKey = `year-${currentYear}`;
    if (!years[yKey]) years[yKey] = { year: currentYear, semesters: { "semester-1": { semester: 1, courseUnits: [] } } };
    years[yKey].semesters["semester-1"].courseUnits.push(unit);
  }

  for (const file of BNS_FILES) {
    const alreadyAdded = Object.values(years).some((year) =>
      Object.values(year.semesters).some((semester) => semester.courseUnits.some((unit) => unit.sourceFile === file))
    );
    if (!alreadyAdded && fs.existsSync(path.join(SOURCE_ROOT, file))) {
      if (!years["year-1"]) years["year-1"] = { year: 1, semesters: { "semester-1": { semester: 1, courseUnits: [] } } };
      years["year-1"].semesters["semester-1"].courseUnits.push(parseSectionedUnit(file));
    }
  }

  return { id: "bachelor-of-nursing-science-top-up", label: "Bachelor of Nursing Science (Top-Up)", sourceFile: "bachelor-of-nursing-science-curriculum.html", sourceName: "Nursing Uganda", years };
}

function stats(programme) {
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

function main() {
  const programmes = [parseCertificate(), ...loadDiploma(), parseBns(), ...loadMidwifery()].map((programme) => ({ ...programme, stats: stats(programme) }));
  const lessons = collectLessons(programmes);
  const appData = {
    generatedAtUtc: new Date().toISOString(),
    sourceRoot: SOURCE_ROOT,
    sourceRoots: {
      nursing: SOURCE_ROOT,
      midwifery: MIDWIVES_SOURCE_ROOT
    },
    lessons,
    programmes,
    totals: programmes.reduce((acc, programme) => {
      acc.programmes += 1;
      acc.years += programme.stats.yearCount;
      acc.semesters += programme.stats.semesterCount;
      acc.courseUnits += programme.stats.unitCount;
      acc.topics += programme.stats.topicCount;
      return acc;
    }, { programmes: 0, years: 0, semesters: 0, courseUnits: 0, topics: 0 })
  };

  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
  fs.writeFileSync(OUT_FILE, JSON.stringify(appData, null, 2));
  console.log(`Wrote ${OUT_FILE}`);
  console.log(`${appData.totals.programmes} programmes, ${appData.totals.courseUnits} units, ${appData.totals.topics} topics`);
  console.log(`${Object.keys(lessons).length} lesson pages imported`);
}

main();
