#!/usr/bin/env node
/* Normalize the static site header to the current three-item app nav. */
const fs = require("node:fs");
const path = require("node:path");

const ROOT = process.cwd();

function listHtml(dir) {
  const out = [];
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    if (item.name === ".git") continue;
    const full = path.join(dir, item.name);
    if (item.isDirectory()) out.push(...listHtml(full));
    if (item.isFile() && item.name.toLowerCase().endsWith(".html")) out.push(full);
  }
  return out;
}

function relToRoot(fromDir) {
  const rel = path.relative(fromDir, ROOT).replace(/\\/g, "/");
  return rel ? `${rel}/` : "./";
}

function activeFor(file) {
  const rel = path.relative(ROOT, file).replace(/\\/g, "/").toLowerCase();
  if (rel === "index.html" || rel.startsWith("notes/")) return "notes";
  if (rel.startsWith("courses/") || rel.startsWith("programmes/")) return "courses";
  return "resources";
}

function headerFor(file) {
  const dir = path.dirname(file);
  const rootRel = relToRoot(dir);
  const active = activeFor(file);
  const navItem = (key, href, label) =>
    `<a${active === key ? ' class="active"' : ""} href="${rootRel}${href}">${label}</a>`;

  return `<header class="site-header">
      <div class="container nav-shell">
        <a class="brand" href="${rootRel}" aria-label="Nursing Uganda notes home">
          <span class="brand-mark">NU</span>
          <span>Nursing Uganda<small>Nursing Uganda</small></span>
        </a>
        <nav class="main-nav" data-main-nav aria-label="Main navigation">
          ${navItem("notes", "", "Notes")}
          ${navItem("courses", "courses/", "Courses")}
          ${navItem("resources", "resources/", "Resources")}
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

function normalize(file) {
  const original = fs.readFileSync(file, "utf8");
  const updated = original.replace(/<header class="site-header">[\s\S]*?<\/header>/, headerFor(file));
  if (updated !== original) {
    fs.writeFileSync(file, updated);
    return true;
  }
  return false;
}

const changed = listHtml(ROOT).filter(normalize).length;
console.log(`Updated ${changed} HTML headers.`);
