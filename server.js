const express    = require("express");
const path       = require("path");
const fs         = require("fs");
const compression = require("compression");
const rateLimit  = require("express-rate-limit");

const app  = express();
const PORT = process.env.PORT || 3000;
const PROD = process.env.NODE_ENV === "production";

// ── Hide stack fingerprint ────────────────────────────────────────────────────
app.disable("x-powered-by");

// ── Block sensitive files & directories (before static middleware) ────────────
// These files exist in the project root but must never be served to browsers.
const BLOCKED_EXACT = new Set([
  "/package.json",
  "/package-lock.json",
  "/server.js",
  "/.gitignore",
  "/preview-server.log",
  "/preview-server.err.log",
  "/DEPLOYMENT.md",
  "/DEPLOYMENT_AUDIT.md",
  "/PROJECT_STUDY.md",
]);
const BLOCKED_PREFIX = ["/node_modules/", "/scripts/", "/research/"];

app.use((req, res, next) => {
  const p = req.path;
  // Block exact files
  if (BLOCKED_EXACT.has(p)) return res.status(403).end();
  // Block sensitive directories
  if (BLOCKED_PREFIX.some((pfx) => p.startsWith(pfx))) return res.status(403).end();
  // Block any .md and .log files at any depth
  if (/\.(md|log|sh|env)$/i.test(p)) return res.status(403).end();
  next();
});

// ── Security headers ──────────────────────────────────────────────────────────
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://unpkg.com https://cdn.jsdelivr.net", // unsafe-inline needed for inline scripts in SEO pages
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://unpkg.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: https:",                 // https: allows lesson images & map tiles
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
  "frame-src https://www.youtube.com",           // kept for any future embeds
  "object-src 'none'",                           // no Flash / plugins
  "base-uri 'self'",                             // prevent base-tag injection
  "form-action 'self'",                          // prevent form hijacking
  "frame-ancestors 'self'",                      // replaces X-Frame-Options
].join("; ");

app.use((_req, res, next) => {
  res.setHeader("Content-Security-Policy", CSP);
  res.setHeader("X-Content-Type-Options",  "nosniff");
  res.setHeader("X-Frame-Options",         "SAMEORIGIN");
  res.setHeader("X-XSS-Protection",        "1; mode=block");
  res.setHeader("Referrer-Policy",         "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy",      "camera=(), microphone=(), geolocation=()");
  next();
});

// ── HTTPS redirect (only in production behind a proxy) ────────────────────────
if (PROD) {
  app.use((req, res, next) => {
    // Heroku / Render / Railway set x-forwarded-proto
    const proto = req.headers["x-forwarded-proto"];
    if (proto && proto !== "https") {
      return res.redirect(301, `https://${req.headers.host}${req.url}`);
    }
    next();
  });
}

// ── Gzip / Brotli compression ─────────────────────────────────────────────────
app.use(compression());

// ── Rate limiting ─────────────────────────────────────────────────────────────
// General: 300 requests / 1 minute per IP (covers normal browsing + PWA caching)
app.use(
  rateLimit({
    windowMs: 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
    message: "Too many requests — please try again in a minute.",
  })
);

// ── MIME types ────────────────────────────────────────────────────────────────
express.static.mime.define({ "application/manifest+json": ["webmanifest"] });

// ── Service worker — always fresh ─────────────────────────────────────────────
app.get("/service-worker.js", (_req, res) => {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.sendFile(path.join(__dirname, "service-worker.js"));
});

// ── Versioned CSS / JS — immutable (1 year) ───────────────────────────────────
app.use(
  "/assets/css",
  express.static(path.join(__dirname, "assets", "css"), { maxAge: "1y", immutable: true })
);
app.use(
  "/assets/js",
  express.static(path.join(__dirname, "assets", "js"), { maxAge: "1y", immutable: true })
);

// ── Images — long cache (90 days) ────────────────────────────────────────────
app.use(
  "/assets/images",
  express.static(path.join(__dirname, "assets", "images"), { maxAge: "90d", etag: true })
);

// ── Data files — short cache (1 hour) ────────────────────────────────────────
app.use(
  "/assets/data",
  express.static(path.join(__dirname, "assets", "data"), { maxAge: "1h", etag: true })
);

// ── Everything else — 1 day ───────────────────────────────────────────────────
app.use(
  express.static(__dirname, { maxAge: "1d", etag: true, lastModified: true })
);

// ── Fallback routing ──────────────────────────────────────────────────────────
app.get("*", (req, res) => {
  // Guard against path traversal in custom file-existence check
  const rawPath = req.path;

  if (rawPath.startsWith("/courses/")) {
    const relative  = rawPath.endsWith("/") ? rawPath + "index.html" : rawPath;
    const resolved  = path.resolve(path.join(__dirname, relative));
    const inRoot    = resolved.startsWith(__dirname + path.sep) || resolved === __dirname;

    // Reject traversal attempts that escape the project root
    if (!inRoot) return res.status(403).end();

    if (!fs.existsSync(resolved)) {
      return res.status(404).sendFile(path.join(__dirname, "404.html"));
    }
  }

  res.sendFile(path.join(__dirname, "index.html"));
});

// ── Daily cron: inactivity win-back check ─────────────────────────────────────
// Calls check-inactivity edge function every day at 08:00 UTC.
// Requires SUPABASE_SERVICE_ROLE_KEY env var.
try {
  const cron = require("node-cron");
  const SUPA_PROJECT_URL = "https://gunhybscakozycmwufue.supabase.co";

  cron.schedule("0 8 * * *", async () => {
    console.log("[cron] Daily inactivity check starting…");
    try {
      const res = await fetch(`${SUPA_PROJECT_URL}/functions/v1/check-inactivity`, {
        method: "POST",
        headers: {
          "Content-Type":  "application/json",
          "Authorization": `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY || ""}`,
        },
        body: JSON.stringify({ source: "server-cron", timestamp: new Date().toISOString() }),
      });
      const data = await res.json().catch(() => ({}));
      console.log("[cron] Inactivity check result:", data);
    } catch (err) {
      console.error("[cron] Inactivity check failed:", err.message);
    }
  }, { timezone: "UTC" });

  console.log("[cron] Daily inactivity check scheduled (08:00 UTC).");
} catch (err) {
  console.warn("[cron] node-cron not available — inactivity check disabled:", err.message);
}

app.listen(PORT, () => {
  console.log(`Nursing Uganda running on port ${PORT}${PROD ? " [production]" : ""}`);
});
