#!/usr/bin/env node
/* Normalize stale static lesson pages that are no longer emitted by the SEO generator. */
const fs = require("node:fs");
const path = require("node:path");

const ROOT = process.cwd();
const FILES = [
  "courses/bachelor-of-nursing-science-top-up/pharmacology-i/want-notes-in-pdf-join-our-classes/index.html",
  "courses/bachelor-of-nursing-science-top-up/pharmacology-i/about-us/index.html",
  "courses/bachelor-of-nursing-science-top-up/pharmacology-i/terms/index.html",
  "courses/bachelor-of-nursing-science-top-up/pharmacology-i/privacy-policy/index.html",
  "courses/bachelor-of-nursing-science-top-up/pharmacology-i/disclaimer/index.html"
];

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function normalizeFile(relativePath) {
  const file = path.join(ROOT, relativePath);
  if (!fs.existsSync(file)) return false;

  let html = fs.readFileSync(file, "utf8");
  const original = html;
  const title = (html.match(/<h1>([\s\S]*?)<\/h1>/) || [null, "This topic"])[1].replace(/<[^>]+>/g, "").trim();

  html = html.replace(/main\.min\.css\?v=(?:11|12|13|14|15|16|17|18|19|20|21|22|23|24|25|26|27|28|29|30|31|32|33)/g, "main.min.css?v=34");
  html = html.replace(/\s*<details class="seo-lesson-section" open>\s*<summary>\d+\s+Learning\s+(?:Objectives|Outcomes)[\s\S]*?<\/details>\s*/i, "\n");

  const pictureMatch = html.match(/\s*<section class="seo-panel">\s*<h2>Pictures For This Lesson<\/h2>[\s\S]*?<\/section>\s*/);
  const videoMatch = html.match(/\s*<section class="seo-panel seo-video">[\s\S]*?<\/section>\s*/);

  if (pictureMatch) html = html.replace(pictureMatch[0], "\n");
  if (videoMatch) html = html.replace(videoMatch[0], "\n");

  let videoHref = "";
  if (videoMatch) {
    const hrefMatch = videoMatch[0].match(/href="([^"]+)"/);
    videoHref = hrefMatch ? hrefMatch[1] : "";
  }
  const query = videoHref.includes("search_query=")
    ? decodeURIComponent(videoHref.split("search_query=")[1].split("&")[0])
    : `${title} nursing lecture`;
  const embed = `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(query)}`;
  const videoSection = `
      <section class="seo-panel seo-video">
        <h2>YouTube Video Preview</h2>
        <div style="aspect-ratio:16/9;background:#000;border:1px solid #d9e6ec;border-radius:12px;overflow:hidden">
          <iframe src="${escapeHtml(embed)}" title="${escapeHtml(`${title} YouTube lesson preview`)}" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen style="border:0;display:block;height:100%;width:100%"></iframe>
        </div>
        <p>Preview related nursing lectures here, then open YouTube if you want the full search results.</p>
        <a class="seo-button secondary" href="${escapeHtml(videoHref || `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`)}" target="_blank" rel="noopener">Watch Topic Videos</a>
      </section>`;

  const pictureSection = pictureMatch ? pictureMatch[0].trimStart() : "";
  html = html.replace(/\s*<section class="seo-panel">\s*<h2>Reference Books And PDFs<\/h2>/, `\n${videoSection}\n${pictureSection ? `${pictureSection}\n` : ""}      <section class="seo-panel">\n        <h2>Reference Books And PDFs</h2>`);

  let index = 0;
  html = html.replace(/<summary>\d+\s+([^<]+)<\/summary>/g, (_match, label) => {
    index += 1;
    return `<summary>${String(index).padStart(2, "0")} ${label}</summary>`;
  });

  if (html !== original) {
    fs.writeFileSync(file, html);
    return true;
  }
  return false;
}

const changed = FILES.filter(normalizeFile);
console.log(`Normalized ${changed.length} stale lesson pages.`);
