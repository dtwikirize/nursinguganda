#!/usr/bin/env node
/**
 * Generates clean, AdSense-safe canonical static SEO pages and sitemap.xml:
 *  - 95 Course Landing pages (/course/<slug>/index.html) with syllabus & authoritative references
 *  - 8 Free Referenced eBook pages (/ebooks/<slug>/index.html) with full chapter previews & bibliography
 *  - Clean sitemap.xml (no duplicate topic URLs, no thin/junk pages, no checkout/login routes)
 */
const fs = require("node:fs");
const path = require("node:path");

const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, "assets", "data");
const SITE_URL = "https://nursinguganda.com";

function esc(val) {
  return String(val ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildHtml({ title, description, canonicalUrl, bodyHtml }) {
  return `<!doctype html>
<html lang="en-UG">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}" />
  <link rel="canonical" href="${esc(canonicalUrl)}" />
  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(description)}" />
  <meta property="og:type" content="article" />
  <meta property="og:url" content="${esc(canonicalUrl)}" />
  <style>
    body{font-family:Inter,system-ui,sans-serif;margin:0;color:#1c1d1f;background:#fff;line-height:1.6}
    .wrap{max-width:920px;margin:0 auto;padding:32px 20px}
    .hero{background:#1c1d1f;color:#fff;padding:36px 20px}
    .btn{display:inline-block;background:#a435f0;color:#fff;padding:12px 20px;font-weight:700;text-decoration:none;border-radius:4px;margin-top:12px}
    .refs{background:#f7f9fa;border-left:4px solid #a435f0;padding:16px 20px;margin-top:28px}
    h1{margin:0 0 10px;font-size:1.9rem} h2{margin-top:28px}
  </style>
</head>
<body>
  ${bodyHtml}
</body>
</html>`;
}

function main() {
  const catalog = JSON.parse(fs.readFileSync(path.join(DATA_DIR, "catalog.json"), "utf8"));
  const ebooks = JSON.parse(fs.readFileSync(path.join(DATA_DIR, "ebooks.json"), "utf8")).ebooks || [];

  // Remove legacy duplicate courses/ static dump so /courses routes cleanly to SPA
  fs.rmSync(path.join(ROOT, "courses"), { recursive: true, force: true });
  fs.rmSync(path.join(ROOT, "course"), { recursive: true, force: true });
  fs.rmSync(path.join(ROOT, "ebooks"), { recursive: true, force: true });

  const urls = [
    { loc: `${SITE_URL}/`, priority: "1.0" },
    { loc: `${SITE_URL}/courses`, priority: "0.9" },
    { loc: `${SITE_URL}/ebooks`, priority: "0.9" },
    { loc: `${SITE_URL}/mock-exams`, priority: "0.9" },
    { loc: `${SITE_URL}/dictionary`, priority: "0.8" },
    { loc: `${SITE_URL}/instruments`, priority: "0.8" },
    { loc: `${SITE_URL}/clinical-tools`, priority: "0.8" },
    { loc: `${SITE_URL}/about`, priority: "0.5" },
    { loc: `${SITE_URL}/editorial-policy`, priority: "0.5" },
    { loc: `${SITE_URL}/privacy-policy`, priority: "0.4" },
    { loc: `${SITE_URL}/terms`, priority: "0.4" },
    { loc: `${SITE_URL}/contact`, priority: "0.5" }
  ];

  // Generate canonical Course Landing SEO pages (/course/<slug>/index.html)
  for (const c of catalog.courses) {
    const courseJsonPath = path.join(DATA_DIR, "courses", `${c.slug}.json`);
    if (!fs.existsSync(courseJsonPath)) continue;
    const courseData = JSON.parse(fs.readFileSync(courseJsonPath, "utf8"));
    const canonical = `${SITE_URL}/course/${c.slug}`;
    urls.push({ loc: canonical, priority: "0.8" });

    const syllabusHtml = (courseData.topicGroups || [])
      .map(
        (g) =>
          `<h3>${esc(g.title)}</h3><ul>${(g.topics || [])
            .map((t) => `<li>${esc(t.title)} (${t.readMinutes} min${t.isFreePreview ? " — Free Preview" : ""})</li>`)
            .join("")}</ul>`
      )
      .join("");

    const refsHtml = (courseData.references || [])
      .map((r) => `<li>${esc(r.citation)}</li>`)
      .join("");

    const html = buildHtml({
      title: `${c.title} | ${c.programmeLabel} | Nursing Uganda`,
      description: c.subtitle,
      canonicalUrl: canonical,
      bodyHtml: `
        <header class="hero">
          <div class="wrap" style="padding:0">
            <div>${esc(c.programmeLabel)} · ${esc(c.category)}</div>
            <h1>${esc(c.title)}</h1>
            <p>${esc(c.subtitle)}</p>
            <p>Reviewed by ${esc(c.clinicalReviewer)} · ${c.lessonCount} Lessons</p>
            <a class="btn" href="/learn/${esc(c.slug)}">Open Course &amp; Free Previews</a>
          </div>
        </header>
        <main class="wrap">
          <h2>What You Will Learn</h2>
          <ul>${(c.learningOutcomes || []).map((o) => `<li>${esc(o)}</li>`).join("")}</ul>
          <h2>Course Syllabus</h2>
          ${syllabusHtml}
          <section class="refs">
            <h3>Authoritative Medical References</h3>
            <ol>${refsHtml}</ol>
          </section>
        </main>`
    });

    const outPath = path.join(ROOT, "course", c.slug, "index.html");
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, html);
  }

  // Generate canonical Free eBook SEO pages (/ebooks/<slug>/index.html)
  for (const eb of ebooks) {
    const canonical = `${SITE_URL}/ebooks/${eb.slug}`;
    urls.push({ loc: canonical, priority: "0.85" });

    const chaptersHtml = (eb.chapters || [])
      .map((ch) => `<h2>Chapter ${ch.chapterNumber}: ${esc(ch.title)}</h2><p>${esc(ch.excerpt)}</p>`)
      .join("");

    const refsHtml = (eb.references || [])
      .map((r) => `<li>${esc(r.citation)}</li>`)
      .join("");

    const html = buildHtml({
      title: `${eb.title} (Free PDF & Study Guide) | Nursing Uganda`,
      description: eb.subtitle,
      canonicalUrl: canonical,
      bodyHtml: `
        <header class="hero">
          <div class="wrap" style="padding:0">
            <div>Free Referenced Study eBook · ${esc(eb.category)}</div>
            <h1>${esc(eb.title)}</h1>
            <p>${esc(eb.subtitle)}</p>
            <a class="btn" href="/ebooks/${esc(eb.slug)}">Read &amp; Print Free eBook</a>
          </div>
        </header>
        <main class="wrap">
          ${chaptersHtml}
          <section class="refs">
            <h3>Master Clinical &amp; Textbook References</h3>
            <ol>${refsHtml}</ol>
          </section>
        </main>`
    });

    const outPath = path.join(ROOT, "ebooks", eb.slug, "index.html");
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, html);
  }

  const today = new Date().toISOString().slice(0, 10);
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${esc(u.loc)}</loc>
    <lastmod>${today}</lastmod>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;
  fs.writeFileSync(path.join(ROOT, "sitemap.xml"), sitemapXml);
  console.log(`Generated ${catalog.courses.length} course SEO pages, ${ebooks.length} eBook SEO pages, and sitemap.xml (${urls.length} URLs).`);
}

main();
