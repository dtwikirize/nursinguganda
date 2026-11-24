const express = require("express");
const path = require("path");
const fs = require("fs");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const { createApiRouter } = require("./api/express-api");

const app = express();
const PORT = process.env.PORT || 3000;
const DIST_DIR = path.join(__dirname, "dist");
const ROOT_ASSETS_DIR = path.join(__dirname, "assets");
const DATA_DIR = path.join(ROOT_ASSETS_DIR, "data");

// Trust Hostinger reverse proxy so req.ip, req.secure, and rate limiters use real client IP
app.set("trust proxy", 1);
app.disable("x-powered-by");
app.use(compression());

function readJsonSafe(filePath, fallback = null) {
  try {
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, "utf8"));
    }
  } catch {
    // Ignore parse errors and return fallback
  }
  return fallback;
}

const catalogData = readJsonSafe(path.join(DATA_DIR, "catalog.json"), { courses: [] });
const ebooksData = readJsonSafe(path.join(DATA_DIR, "ebooks.json"), { ebooks: [] });
const globalNursingData = readJsonSafe(path.join(DATA_DIR, "global-nursing.json"), { countries: [] });
const validCourseSlugs = new Set((catalogData?.courses || []).map((c) => String(c.slug || "").toLowerCase()).filter(Boolean));
const validEbookSlugs = new Set((ebooksData?.ebooks || []).map((b) => String(b.slug || "").toLowerCase()).filter(Boolean));
const validCountrySlugs = new Set((globalNursingData?.countries || []).map((c) => String(c.slug || "").toLowerCase()).filter(Boolean));

// Security Headers
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=(self)");
  // Required for Google Identity Services & PayPal popup communication
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");

  const isHttps = req.secure || req.headers["x-forwarded-proto"] === "https";
  if (isHttps) {
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  }

  res.setHeader(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://accounts.google.com https://apis.google.com https://www.paypal.com https://www.sandbox.paypal.com https://pagead2.googlesyndication.com https://analytics.onebigfile.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://accounts.google.com",
      "font-src 'self' data: https://fonts.gstatic.com",
      "img-src 'self' data: blob: https://*.googleusercontent.com https://www.paypalobjects.com https://*.paypal.com https://pagead2.googlesyndication.com",
      "connect-src 'self' https://accounts.google.com https://oauth2.googleapis.com https://www.paypal.com https://www.sandbox.paypal.com https://api-m.paypal.com https://api-m.sandbox.paypal.com https://analytics.onebigfile.com",
      "frame-src 'self' https://accounts.google.com https://www.paypal.com https://www.sandbox.paypal.com https://googleads.g.doubleclick.net",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self' https://accounts.google.com https://www.paypal.com https://www.sandbox.paypal.com"
    ].join("; ")
  );
  next();
});

// Block direct access to sensitive config, source, or legacy PHP/SQL files
const BLOCKED_PATH_RE = /(\/\.(env|git|htaccess)|\/(package(-lock)?\.json|server\.js|vite\.config\.\w+)$|\/(scripts|src)\/|\.(php|sql|bak|log)$)/i;
app.use((req, res, next) => {
  if (BLOCKED_PATH_RE.test(req.path)) {
    return res.status(404).type("text/plain").send("Not found");
  }
  next();
});

// Rate-limit API & MCP endpoints cleanly without throttling multi-image static pages (e.g. /instruments)
const apiRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 240,
  standardHeaders: true,
  legacyHeaders: false
});

express.static.mime.define({ "application/manifest+json": ["webmanifest"] });

// Native Hostinger Node.js + MySQL + PayPal + Google Auth API routes
app.use("/api", apiRateLimiter, createApiRouter());

// Agent discovery & MCP endpoints
function resolveRootOrDist(relPath) {
  const inDist = path.join(DIST_DIR, relPath);
  if (fs.existsSync(inDist)) return inDist;
  const inRoot = path.join(__dirname, relPath);
  if (fs.existsSync(inRoot)) return inRoot;
  return null;
}

app.get("/robots.txt", (_req, res) => {
  const file = resolveRootOrDist("robots.txt");
  if (!file) return res.status(404).type("text/plain").send("Not found");
  res.setHeader("Cache-Control", "public, max-age=3600");
  return res.type("text/plain; charset=utf-8").sendFile(file);
});

app.get("/llms.txt", (_req, res) => {
  const file = resolveRootOrDist("llms.txt");
  if (!file) return res.status(404).type("text/plain").send("Not found");
  res.setHeader("Cache-Control", "public, max-age=3600");
  return res.type("text/plain; charset=utf-8").sendFile(file);
});

app.get("/.well-known/mcp/server-card.json", (_req, res) => {
  const file = resolveRootOrDist(path.join(".well-known", "mcp", "server-card.json"));
  if (!file) return res.status(404).json({ error: "Not found" });
  res.setHeader("Cache-Control", "public, max-age=3600");
  return res.type("application/json; charset=utf-8").sendFile(file);
});

// Lightweight read-only MCP Streamable HTTP / JSON-RPC endpoint
app.get("/mcp", apiRateLimiter, (_req, res) => {
  const file = resolveRootOrDist(path.join(".well-known", "mcp", "server-card.json"));
  const card = file ? readJsonSafe(file, {}) : {};
  return res.json(card);
});

app.post("/mcp", apiRateLimiter, express.json({ limit: "64kb" }), (req, res) => {
  const payload = req.body || {};
  const id = payload.id ?? null;
  const method = String(payload.method || "");
  const cardFile = resolveRootOrDist(path.join(".well-known", "mcp", "server-card.json"));
  const card = cardFile ? readJsonSafe(cardFile, {}) : {};

  if (method === "initialize") {
    return res.json({
      jsonrpc: "2.0",
      id,
      result: {
        protocolVersion: "2025-03-26",
        capabilities: card.capabilities || { tools: { listChanged: false }, resources: { listChanged: false } },
        serverInfo: { name: card.name || "nursing-uganda", version: card.version || "1.0.0" }
      }
    });
  }
  if (method === "tools/list") {
    return res.json({ jsonrpc: "2.0", id, result: { tools: card.tools || [] } });
  }
  if (method === "resources/list") {
    return res.json({ jsonrpc: "2.0", id, result: { resources: card.resources || [] } });
  }
  if (method === "tools/call") {
    const toolName = String(payload.params?.name || "");
    const args = payload.params?.arguments || {};
    if (toolName === "search_nursing_courses") {
      const q = String(args.query || "").trim().toLowerCase();
      const courses = (catalogData?.courses || [])
        .filter((c) => !q || `${c.title} ${c.code || ""} ${c.category || ""} ${c.programmeLabel || ""}`.toLowerCase().includes(q))
        .slice(0, 10)
        .map((c) => ({ slug: c.slug, title: c.title, programme: c.programmeLabel, url: `https://nursinguganda.com/course/${c.slug}` }));
      return res.json({ jsonrpc: "2.0", id, result: { content: [{ type: "text", text: JSON.stringify(courses, null, 2) }] } });
    }
    if (toolName === "lookup_medical_dictionary") {
      const dict = readJsonSafe(path.join(DATA_DIR, "dictionary.json"), { terms: [], abbreviations: [] });
      const q = String(args.term || "").trim().toLowerCase();
      const terms = (dict?.terms || []).filter((t) => `${t.term} ${t.simpleDefinition}`.toLowerCase().includes(q)).slice(0, 8);
      return res.json({ jsonrpc: "2.0", id, result: { content: [{ type: "text", text: JSON.stringify(terms, null, 2) }] } });
    }
    if (toolName === "find_clinical_instrument") {
      const inst = readJsonSafe(path.join(DATA_DIR, "medical-instruments.json"), { instruments: [] });
      const items = Array.isArray(inst?.categories)
        ? inst.categories.flatMap((c) => c.items || [])
        : inst?.instruments || [];
      const q = String(args.query || "").trim().toLowerCase();
      const hits = items.filter((i) => `${i.name} ${i.category} ${i.use || i.purpose || ""}`.toLowerCase().includes(q)).slice(0, 8);
      return res.json({ jsonrpc: "2.0", id, result: { content: [{ type: "text", text: JSON.stringify(hits, null, 2) }] } });
    }
    if (toolName === "get_unmeb_mock_papers") {
      const essays = readJsonSafe(path.join(DATA_DIR, "unmeb-essay-papers.json"), { papers: [] });
      const mocks = readJsonSafe(path.join(DATA_DIR, "mock-exams.json"), { exams: [] });
      return res.json({
        jsonrpc: "2.0",
        id,
        result: {
          content: [{
            type: "text",
            text: JSON.stringify({
              objectiveCount: (mocks?.exams || []).length,
              essayPapers: (essays?.papers || []).map((p) => ({ id: p.id, title: p.title, series: p.series, totalMarks: p.totalMarks }))
            }, null, 2)
          }]
        }
      });
    }
    return res.status(400).json({ jsonrpc: "2.0", id, error: { code: -32601, message: `Unknown tool: ${toolName}` } });
  }
  return res.status(400).json({ jsonrpc: "2.0", id, error: { code: -32601, message: `Unsupported method: ${method}` } });
});

function buildRouteMarkdown(reqPath) {
  const clean = reqPath.replace(/\.md$/i, "").replace(/\/+$/, "") || "/";
  if (clean === "/" || clean === "/index") {
    const sampleCourses = (catalogData?.courses || []).slice(0, 8)
      .map((c) => `- [${c.title}](https://nursinguganda.com/course/${c.slug}) (${c.programmeLabel})`)
      .join("\n");
    return [
      "# Nursing Uganda — Clinical Mastery That Gets You UNMEB-Ready",
      "",
      "> Structured Certificate, Diploma & BScN nursing courses, free referenced study eBooks, UNMEB timed mock & essay past papers, A-Z medical dictionary (1,079+ terms), instrument atlas, and clinical tools aligned with Uganda Ministry of Health & WHO guidelines.",
      "",
      "## Core Study Sections",
      "- [Explore All 95 Nursing Courses](https://nursinguganda.com/courses)",
      "- [UNMEB Timed Mock & Essay Past Papers](https://nursinguganda.com/mock-exams)",
      "- [Free Referenced Study eBooks](https://nursinguganda.com/ebooks)",
      "- [Free Topic Quizzes (270 Qs)](https://nursinguganda.com/quizzes)",
      "- [A-Z Medical Dictionary (1,079 Terms · 183 Abbreviations)](https://nursinguganda.com/dictionary)",
      "- [Medical & Surgical Instrument Atlas](https://nursinguganda.com/instruments)",
      "- [IV Drip Rate & Dosage Calculators](https://nursinguganda.com/clinical-tools)",
      "",
      "## Popular Units",
      sampleCourses,
      "",
      "## Organization, Legal & Contact",
      "- [About Nursing Uganda](https://nursinguganda.com/about)",
      "- [Editorial & Clinical Review Policy](https://nursinguganda.com/editorial-policy)",
      "- [Contact Desk](https://nursinguganda.com/contact)",
      "- [Terms & Medical Disclaimer](https://nursinguganda.com/terms)",
      "- [Privacy Policy](https://nursinguganda.com/privacy-policy)",
      "- Support Email: mailto:support@nursinguganda.com",
      "- Helpline: tel:+256700000000"
    ].join("\n");
  }
  if (clean === "/courses") {
    const lines = (catalogData?.courses || []).slice(0, 30)
      .map((c) => `- **${c.code ? `${c.code} · ` : ""}${c.title}** — [${c.programmeLabel}](https://nursinguganda.com/course/${c.slug}) (${c.lessonsCount || 0} lessons)`);
    return `# Nursing Uganda Course Catalog (${catalogData?.courses?.length || 95} Units)\n\n${lines.join("\n")}\n`;
  }
  if (clean === "/about" || clean === "/contact" || clean === "/terms" || clean === "/privacy-policy" || clean === "/editorial-policy") {
    return [
      `# Nursing Uganda — ${clean.slice(1).replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase())}`,
      "",
      "Independent nursing and midwifery study platform serving learners across Uganda (Kampala, Uganda).",
      "",
      "- Support Email: support@nursinguganda.com",
      "- Editorial Desk: editorial@nursinguganda.com",
      "- Full Policy Page: https://nursinguganda.com" + clean,
      "- Directory & Index: https://nursinguganda.com/llms.txt"
    ].join("\n");
  }
  return null;
}

function setAgentDiscoveryHeaders(res, { includeHeroPreload = false } = {}) {
  const links = [
    '</llms.txt>; rel="llms-txt"',
    '</index.md>; rel="alternate"; type="text/markdown"',
    '</.well-known/mcp/server-card.json>; rel="service-desc"; type="application/json"'
  ];
  if (includeHeroPreload) {
    links.push('</assets/images/udemy/hero-banner.webp>; rel="preload"; as="image"; fetchpriority="high"');
  }
  res.setHeader("Link", links.join(", "));
  res.setHeader("Vary", "Accept");
}

function prefersMarkdown(req) {
  const accept = String(req.headers.accept || "").toLowerCase();
  return accept.includes("text/markdown") || req.path.toLowerCase().endsWith(".md");
}

function isValidDynamicRoute(reqPath) {
  const clean = reqPath.replace(/\/+$/, "") || "/";
  const courseMatch = clean.match(/^\/(?:course|learn)\/([^/]+)/i);
  if (courseMatch && validCourseSlugs.size > 0) {
    return validCourseSlugs.has(courseMatch[1].toLowerCase());
  }
  const ebookMatch = clean.match(/^\/ebooks\/([^/]+)/i);
  if (ebookMatch && validEbookSlugs.size > 0) {
    return validEbookSlugs.has(ebookMatch[1].toLowerCase());
  }
  const countryMatch = clean.match(/^\/global-nursing\/([^/]+)/i);
  if (countryMatch && validCountrySlugs.size > 0) {
    return validCountrySlugs.has(countryMatch[1].toLowerCase());
  }
  return true;
}

const BOT_UA_RE = /(googlebot|adsbot-google|mediapartners-google|bingbot|slurp|duckduckbot|facebookexternalhit|twitterbot|whatsapp)/i;
const SPA_ROUTE_RE = /^\/($|courses|course|learn|ebooks|quizzes|mock-exams|dictionary|instruments|clinical-tools|templates|global-nursing|cart|checkout|login|my-learning|nodadmin|about|brand-kit|editorial-policy|privacy-policy|terms|contact)(\/|$)/i;

// Markdown negotiation & `.md` routes
app.get(["/index.md", "/courses.md", "/about.md", "/contact.md", "/terms.md", "/privacy-policy.md", "/editorial-policy.md"], (req, res) => {
  const md = buildRouteMarkdown(req.path);
  if (!md) return res.status(404).type("text/plain").send("Not found");
  setAgentDiscoveryHeaders(res);
  return res.type("text/markdown; charset=utf-8").send(md);
});

const SEO_ROUTE_META = {
  "/courses": {
    title: "All 95 Nursing & Midwifery Courses (Certificate, Diploma & BScN) | Nursing Uganda",
    description: "Browse 95 structured Ugandan nursing and midwifery course units covering Anatomy, Pharmacology, Medical-Surgical Nursing, Midwifery, Paediatrics, and Community Health.",
    h1: "All 95 Nursing & Midwifery Courses"
  },
  "/mock-exams": {
    title: "109 UNMEB & UHPAB Past Papers Archive (Dark Navy Answers & Free PDF) | Nursing Uganda",
    description: "Practice 109 UHPAB and UNMEB past papers (2019–2025) featuring Section A MCQs, Section B Short Essays, and Section C Scenarios with Dark Navy answers and direct PDF downloads.",
    h1: "UNMEB & UHPAB Past Papers Archive (109 Papers)"
  },
  "/ebooks": {
    title: "Free Referenced Nursing & Midwifery Study eBooks (Direct PDF) | Nursing Uganda",
    description: "Download 8 peer-reviewed nursing and midwifery PDF eBooks citing Uganda Clinical Guidelines 2023, WHO protocols, OpenStax, and Open RN textbooks.",
    h1: "Free Referenced Study eBooks"
  },
  "/quizzes": {
    title: "Free Nursing & Midwifery Topic Quizzes (270 Mixed Qs) | Nursing Uganda",
    description: "Practice 10 randomized mixed-format UNMEB revision quizzes across Anatomy, Pharmacology, Midwifery, Med-Surg, Paediatrics, and Emergency Care.",
    h1: "Free Major Topic Quizzes (270 Questions)"
  },
  "/dictionary": {
    title: "1,079+ A–Z Nursing & Medical Dictionary + 183 Ward Abbreviations | Nursing Uganda",
    description: "Search 1,079 clinical definitions, pronunciations, nursing priorities, exam mnemonics, and 183 hospital ward abbreviations tailored for Ugandan and global nurses.",
    h1: "Nursing & Medical Dictionary (1,079 Terms · 183 Abbreviations)"
  },
  "/instruments": {
    title: "146-Item Medical & Surgical Instrument Atlas (OSCE Guide & IPC) | Nursing Uganda",
    description: "Visual clinical guide to 146 medical, surgical, obstetric, and diagnostic instruments with indications, steam autoclaving standards, and UNMEB OSCE inspection points.",
    h1: "Medical Instrument Atlas (146 Instruments)"
  },
  "/clinical-tools": {
    title: "Nursing IV Drip Rate Calculator, Paediatric Dosages & Normal Lab Ranges | Nursing Uganda",
    description: "Ward-ready clinical nursing calculators for IV drops/min, weight-based paediatric doses, APGAR & GCS scores, SI <-> US lab ranges, plus printable ward PDF templates.",
    h1: "Clinical Calculators, SI/US Lab Ranges & Ward Templates"
  },
  "/templates": {
    title: "8 Printable Nursing Ward Charts, Care Plan, Partograph & MAR PDF Templates | Nursing Uganda",
    description: "Download direct binary PDF templates: NANDA-I Care Plan, WHO Modified Partograph, SBAR handover, SOAPIE note, 24h Fluid Balance, Vital Signs MEWS, Drug Kardex MAR, and UNMEB Logbook.",
    h1: "Printable Nursing Ward & Practical Logbook Templates (.pdf)"
  },
  "/global-nursing": {
    title: "Becoming a Nurse in Different Countries (Uganda, UK, USA, Kenya, Canada, Gulf) | Nursing Uganda",
    description: "Compare nursing licensure requirements, exams (UNMEB/UHPAB, NCK, TNMC, NMC CBT/OSCE, NCLEX-RN, Prometric), English scores & lab units across 8 countries.",
    h1: "Becoming a Nurse in Different Countries — Global Licensure Hub"
  },
  "/about": {
    title: "About Nursing Uganda & Institutional Non-Affiliation | Nursing Uganda",
    description: "Learn about Nursing Uganda's independent clinical revision mission for Ugandan and international nursing and midwifery students.",
    h1: "About Nursing Uganda & Non-Affiliation"
  },
  "/editorial-policy": {
    title: "Editorial & Clinical Review Policy (UCG 2023 & WHO Aligned) | Nursing Uganda",
    description: "How Nursing Uganda tutors align revision notes, dosages, and mock papers with Uganda Clinical Guidelines 2023, WHO, OpenStax, and Open RN.",
    h1: "Editorial & Clinical Review Policy"
  },
  "/contact": {
    title: "Contact Student Billing, Clinical Editorial & Legal Desk | Nursing Uganda",
    description: "Contact Nursing Uganda support@nursinguganda.com or editorial@nursinguganda.com for PayPal receipts, curriculum review, and data rights.",
    h1: "Contact, Support & Legal Compliance Desk"
  },
  "/privacy-policy": {
    title: "Privacy & Cookies Policy | Nursing Uganda",
    description: "How Nursing Uganda safeguards learner profiles, progress records, and payment verification under Uganda Data Protection & Privacy Act 2019.",
    h1: "Privacy & Cookies Policy"
  },
  "/terms": {
    title: "Terms of Service & Medical Disclaimer | Nursing Uganda",
    description: "Educational terms, certificate scope notice, and clinical disclaimers for Nursing Uganda.",
    h1: "Terms of Service & Medical Disclaimer"
  }
};

function escAttr(s = "") {
  return String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function sendRouteSpaHtml(res, filePath, reqPath) {
  const clean = reqPath === "/" ? "/" : reqPath.replace(/\/+$/, "");
  let html = fs.readFileSync(filePath, "utf8");
  const meta = SEO_ROUTE_META[clean];
  if (meta) {
    const url = `https://nursinguganda.com${clean}`;
    html = html
      .replace(/<title>[\s\S]*?<\/title>/i, `<title>${escAttr(meta.title)}</title>`)
      .replace(/<meta\s+name="description"[\s\S]*?\/>/i, `<meta name="description" content="${escAttr(meta.description)}" />`)
      .replace(/<link\s+rel="canonical"\s+href="[^"]*"\s*\/>/i, `<link rel="canonical" href="${url}" />`)
      .replace(/<meta\s+property="og:title"\s+content="[^"]*"\s*\/>/i, `<meta property="og:title" content="${escAttr(meta.title)}" />`)
      .replace(/<meta\s+property="og:description"\s+content="[^"]*"\s*\/>/i, `<meta property="og:description" content="${escAttr(meta.description)}" />`)
      .replace(/<meta\s+property="og:url"\s+content="[^"]*"\s*\/>/i, `<meta property="og:url" content="${url}" />`)
      .replace(/<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/>/i, `<meta name="twitter:title" content="${escAttr(meta.title)}" />`)
      .replace(/<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/>/i, `<meta name="twitter:description" content="${escAttr(meta.description)}" />`)
      .replace(/<h1>[\s\S]*?<\/h1>/i, `<h1>${escAttr(meta.h1)}</h1>`);
  }
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
  return res.type("text/html; charset=utf-8").send(html);
}

// Match Hostinger .htaccess behavior: human browsers get React SPA index.html on valid app routes;
// AI agents asking for Accept: text/markdown get concise Markdown; bots get static HTML when present.
app.use((req, res, next) => {
  if (req.method !== "GET" || !SPA_ROUTE_RE.test(req.path)) {
    return next();
  }
  if (!isValidDynamicRoute(req.path)) {
    return next();
  }
  if (prefersMarkdown(req)) {
    const md = buildRouteMarkdown(req.path) || buildRouteMarkdown("/");
    if (md) {
      setAgentDiscoveryHeaders(res);
      return res.type("text/markdown; charset=utf-8").send(md);
    }
  }
  if (!BOT_UA_RE.test(req.headers["user-agent"] || "")) {
    const distIndex = path.join(DIST_DIR, "index.html");
    const rootIndex = path.join(__dirname, "index.html");
    const targetIndex = fs.existsSync(distIndex) ? distIndex : rootIndex;
    setAgentDiscoveryHeaders(res, { includeHeroPreload: req.path === "/" });
    return sendRouteSpaHtml(res, targetIndex, req.path);
  }
  // If search bot visits hub route without static pre-rendered subfolder, serve route-injected SPA HTML instead of generic root tags
  if (SEO_ROUTE_META[req.path.replace(/\/+$/, "") || "/"]) {
    const distIndex = path.join(DIST_DIR, "index.html");
    const rootIndex = path.join(__dirname, "index.html");
    const targetIndex = fs.existsSync(distIndex) ? distIndex : rootIndex;
    setAgentDiscoveryHeaders(res, { includeHeroPreload: req.path === "/" });
    return sendRouteSpaHtml(res, targetIndex, req.path);
  }
  setAgentDiscoveryHeaders(res, { includeHeroPreload: req.path === "/" });
  next();
});

function setAssetCacheHeaders(res, filePath) {
  if (filePath.endsWith(".html")) {
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
  } else if (/\.(json|webmanifest)$/i.test(filePath)) {
    res.setHeader("Cache-Control", "public, max-age=0, must-revalidate");
  } else if (/\.(webp|png|jpe?g|svg|gif|ico|woff2?|css|js)$/i.test(filePath)) {
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
  }
}

if (fs.existsSync(DIST_DIR)) {
  app.use(
    express.static(DIST_DIR, {
      dotfiles: "allow",
      maxAge: "365d",
      setHeaders: setAssetCacheHeaders
    })
  );
}

// Fallback to root assets/ for large lesson-images not duplicated in dist/
app.use(
  "/assets",
  express.static(ROOT_ASSETS_DIR, {
    maxAge: "365d",
    setHeaders: setAssetCacheHeaders
  })
);

// Real 404 handler for missing pages, missing images, or invalid dynamic slugs
app.use((req, res) => {
  res.status(404);
  if (prefersMarkdown(req)) {
    return res.type("text/markdown; charset=utf-8").send("# 404 — Page Not Found\n\nThe requested page or asset does not exist on nursinguganda.com.");
  }
  if (req.accepts("html")) {
    const notFoundFile = resolveRootOrDist("404.html");
    if (notFoundFile) {
      res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
      return res.sendFile(notFoundFile);
    }
    return res.type("text/html; charset=utf-8").send("<h1>404 — Page Not Found</h1>");
  }
  return res.json({ error: "Not found", path: req.path });
});

app.listen(PORT, () => {
  console.log(`Nursing Uganda running at http://localhost:${PORT}`);
});
