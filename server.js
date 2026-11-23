const express = require("express");
const path = require("path");
const fs = require("fs");
const compression = require("compression");
const rateLimit = require("express-rate-limit");

const app = express();
const PORT = process.env.PORT || 3000;
const DIST_DIR = path.join(__dirname, "dist");
const ROOT_ASSETS_DIR = path.join(__dirname, "assets");

app.disable("x-powered-by");
app.use(compression());
app.use(
  rateLimit({
    windowMs: 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false
  })
);

express.static.mime.define({ "application/manifest+json": ["webmanifest"] });

const BOT_UA_RE = /(googlebot|adsbot-google|mediapartners-google|bingbot|slurp|duckduckbot|facebookexternalhit|twitterbot|whatsapp)/i;
const SPA_ROUTE_RE = /^\/(courses|course|learn|ebooks|mock-exams|dictionary|instruments|clinical-tools|cart|checkout|login|my-learning|about|brand-kit|editorial-policy|privacy-policy|terms|contact)(\/|$)/i;

// Match Hostinger .htaccess behavior: human browsers get React SPA index.html on app routes;
// search/AdSense bots get static pre-rendered HTML if available.
app.use((req, res, next) => {
  if (req.method === "GET" && SPA_ROUTE_RE.test(req.path) && !BOT_UA_RE.test(req.headers["user-agent"] || "")) {
    const distIndex = path.join(DIST_DIR, "index.html");
    if (fs.existsSync(distIndex)) {
      return res.sendFile(distIndex);
    }
  }
  next();
});

if (fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR, { maxAge: "1h" }));
}

// Fallback to root assets/ for large lesson-images not duplicated in dist/
app.use("/assets", express.static(ROOT_ASSETS_DIR, { maxAge: "90d" }));

app.get("*", (_req, res) => {
  const distIndex = path.join(DIST_DIR, "index.html");
  if (fs.existsSync(distIndex)) {
    res.sendFile(distIndex);
  } else {
    res.sendFile(path.join(__dirname, "index.html"));
  }
});

app.listen(PORT, () => {
  console.log(`Nursing Uganda running on http://localhost:${PORT}`);
});
