#!/usr/bin/env node
/**
 * Generates clean, AdSense-safe canonical static SEO pages and sitemap.xml:
 *  - 95 Course Landing pages (/course/<slug>/index.html) with Course + Breadcrumb Schema
 *  - 8 Free Referenced eBook pages (/ebooks/<slug>/index.html) with Book + Breadcrumb Schema
 *  - Clean sitemap.xml (includes /quizzes, 116 canonical URLs, no thin/checkout/login pages)
 */
const fs = require("node:fs");
const path = require("node:path");

const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, "assets", "data");
const SITE_URL = "https://nursinguganda.com";
const DEFAULT_IMG = `${SITE_URL}/assets/images/udemy/hero-banner.webp`;

function esc(val) {
  return String(val ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildHtml({ title, description, canonicalUrl, imageUrl = DEFAULT_IMG, ogType = "article", jsonLd = null, bodyHtml }) {
  const schemaScript = jsonLd
    ? `\n  <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`
    : "";
  return `<!doctype html>
<html lang="en-UG">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}" />
  <meta name="keywords" content="nursing courses Uganda, UNMEB past papers, UHPAB revision Uganda, midwifery courses Uganda, Uganda Clinical Guidelines 2023" />
  <meta name="geo.region" content="UG" />
  <meta name="geo.placename" content="Kampala, Uganda" />
  <link rel="canonical" href="${esc(canonicalUrl)}" />
  <meta property="og:site_name" content="Nursing Uganda" />
  <meta property="og:locale" content="en_UG" />
  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(description)}" />
  <meta property="og:type" content="${esc(ogType)}" />
  <meta property="og:url" content="${esc(canonicalUrl)}" />
  <meta property="og:image" content="${esc(imageUrl)}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(title)}" />
  <meta name="twitter:description" content="${esc(description)}" />
  <meta name="twitter:image" content="${esc(imageUrl)}" />${schemaScript}
  <style>
    body{font-family:Inter,system-ui,sans-serif;margin:0;color:#1c1d1f;background:#fff;line-height:1.6}
    .wrap{max-width:920px;margin:0 auto;padding:32px 20px}
    .hero{background:#1c1d1f;color:#fff;padding:36px 20px}
    .btn{display:inline-block;background:#a137f2;color:#fff;padding:12px 20px;font-weight:700;text-decoration:none;border-radius:6px;margin-top:12px}
    .refs{background:#f7f9fa;border-left:4px solid #a137f2;padding:16px 20px;margin-top:28px}
    .nav{display:flex;flex-wrap:wrap;gap:14px;padding:16px 0;border-top:1px solid #d1d7dc;margin-top:32px;font-size:0.9rem}
    .nav a{color:#4c1d95;text-decoration:none;font-weight:600}
    h1{margin:0 0 10px;font-size:1.9rem} h2{margin-top:28px}
  </style>
</head>
<body>
  ${bodyHtml}
</body>
</html>`;
}

const HUB_FOOTER_LINKS = `
  <nav class="nav" aria-label="Nursing Uganda Hubs">
    <a href="/">Home</a>
    <a href="/courses">83 Nursing Courses</a>
    <a href="/topics">779 Nurse Topics</a>
    <a href="/mock-exams">109 UHPAB/UNMEB Past Papers (.pdf)</a>
    <a href="/quizzes">Free Mixed Topic Quizzes</a>
    <a href="/ebooks">Free eBooks (.pdf)</a>
    <a href="/dictionary">A–Z Medical Dictionary</a>
    <a href="/instruments">Instrument Atlas</a>
    <a href="/clinical-tools">Dosage Calculator</a>
    <a href="/about">About</a>
    <a href="/contact">Contact</a>
    <a href="/terms">Terms</a>
  </nav>`;

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
    { loc: `${SITE_URL}/topics`, priority: "0.9" },
    { loc: `${SITE_URL}/ebooks`, priority: "0.9" },
    { loc: `${SITE_URL}/mock-exams`, priority: "0.95" },
    { loc: `${SITE_URL}/quizzes`, priority: "0.85" },
    { loc: `${SITE_URL}/dictionary`, priority: "0.85" },
    { loc: `${SITE_URL}/instruments`, priority: "0.85" },
    { loc: `${SITE_URL}/clinical-tools`, priority: "0.85" },
    { loc: `${SITE_URL}/templates`, priority: "0.85" },
    { loc: `${SITE_URL}/global-nursing`, priority: "0.9" },
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

    const courseImage = c.thumbnail ? (c.thumbnail.startsWith("http") ? c.thumbnail : `${SITE_URL}${c.thumbnail.startsWith("/") ? "" : "/"}${c.thumbnail}`) : DEFAULT_IMG;

    const jsonLd = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
            { "@type": "ListItem", position: 2, name: "Courses", item: `${SITE_URL}/courses` },
            { "@type": "ListItem", position: 3, name: c.title, item: canonical }
          ]
        },
        {
          "@type": "Course",
          name: c.title,
          description: c.subtitle,
          provider: {
            "@type": "EducationalOrganization",
            name: "Nursing Uganda",
            sameAs: SITE_URL
          },
          educationalLevel: c.programmeLabel,
          inLanguage: "en-UG",
          url: canonical
        }
      ]
    };

    const html = buildHtml({
      title: `${c.title} | ${c.programmeLabel} | Nursing Uganda`,
      description: c.subtitle,
      canonicalUrl: canonical,
      imageUrl: courseImage,
      jsonLd,
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
          ${HUB_FOOTER_LINKS}
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

    const ebImg = eb.coverImage ? `${SITE_URL}${eb.coverImage.startsWith("/") ? "" : "/"}${eb.coverImage}` : DEFAULT_IMG;
    const jsonLd = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
            { "@type": "ListItem", position: 2, name: "Free Study eBooks", item: `${SITE_URL}/ebooks` },
            { "@type": "ListItem", position: 3, name: eb.title, item: canonical }
          ]
        },
        {
          "@type": "Book",
          name: eb.title,
          description: eb.subtitle,
          bookFormat: "https://schema.org/EBook",
          inLanguage: "en-UG",
          publisher: { "@type": "Organization", name: "Nursing Uganda", sameAs: SITE_URL },
          url: canonical
        }
      ]
    };

    const html = buildHtml({
      title: `${eb.title} (Free PDF & Study Guide) | Nursing Uganda`,
      description: eb.subtitle,
      canonicalUrl: canonical,
      imageUrl: ebImg,
      ogType: "book",
      jsonLd,
      bodyHtml: `
        <header class="hero">
          <div class="wrap" style="padding:0">
            <div>Free Referenced Study eBook · ${esc(eb.category)}</div>
            <h1>${esc(eb.title)}</h1>
            <p>${esc(eb.subtitle)}</p>
            <a class="btn" href="/ebooks/${esc(eb.slug)}">Read &amp; Download Free eBook (.pdf)</a>
          </div>
        </header>
        <main class="wrap">
          ${chaptersHtml}
          <section class="refs">
            <h3>Master Clinical &amp; Textbook References</h3>
            <ol>${refsHtml}</ol>
          </section>
          ${HUB_FOOTER_LINKS}
        </main>`
    });

    const outPath = path.join(ROOT, "ebooks", eb.slug, "index.html");
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, html);
  }

  // Generate Global Nursing Licensure SEO pages (/global-nursing/<slug>/index.html)
  const globalDataPath = path.join(DATA_DIR, "global-nursing.json");
  if (fs.existsSync(globalDataPath)) {
    fs.rmSync(path.join(ROOT, "global-nursing"), { recursive: true, force: true });
    const countries = JSON.parse(fs.readFileSync(globalDataPath, "utf8")).countries || [];
    for (const c of countries) {
      const canonical = `${SITE_URL}/global-nursing/${c.slug}`;
      urls.push({ loc: canonical, priority: "0.85" });
      const stepsHtml = (c.steps || []).map((s) => `<li>${esc(s)}</li>`).join("");
      const docsHtml = (c.documents || []).map((d) => `<li>${esc(d)}</li>`).join("");
      const html = buildHtml({
        title: `Becoming a Nurse in ${c.country} (${c.council}) | Nursing Uganda`,
        description: c.summary,
        canonicalUrl: canonical,
        jsonLd: {
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
                { "@type": "ListItem", position: 2, name: "Global Nursing Pathways", item: `${SITE_URL}/global-nursing` },
                { "@type": "ListItem", position: 3, name: c.country, item: canonical }
              ]
            },
            {
              "@type": "Article",
              headline: `How to Become a Registered Nurse in ${c.country}`,
              description: c.summary,
              author: { "@type": "Organization", name: "Nursing Uganda", sameAs: SITE_URL },
              url: canonical
            }
          ]
        },
        bodyHtml: `
          <header class="hero">
            <div class="wrap" style="padding:0">
              <div>${esc(c.region)} · ${esc(c.council)}</div>
              <h1>Becoming a Registered Nurse in ${esc(c.country)}</h1>
              <p>${esc(c.summary)}</p>
              <a class="btn" href="/global-nursing/${esc(c.slug)}">Open Interactive ${esc(c.country)} Guide</a>
            </div>
          </header>
          <main class="wrap">
            <h2>Key Requirements</h2>
            <p><strong>Qualifying Exam:</strong> ${esc(c.examRequired)}</p>
            <p><strong>Language Test:</strong> ${esc(c.languageTest)}</p>
            <p><strong>Lab Unit System:</strong> ${esc(c.unitSystem)} · <strong>Timeline:</strong> ${esc(c.timeline)}</p>
            <h2>Step-by-Step Roadmap</h2>
            <ol>${stepsHtml}</ol>
            <h2>Document Checklist</h2>
            <ul>${docsHtml}</ul>
            ${HUB_FOOTER_LINKS}
          </main>`
      });
      const outPath = path.join(ROOT, "global-nursing", c.slug, "index.html");
      fs.mkdirSync(path.dirname(outPath), { recursive: true });
      fs.writeFileSync(outPath, html);
    }
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
