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

// Trust Hostinger reverse proxy so req.ip, req.secure, and rate limiters use real client IP
app.set("trust proxy", 1);
app.disable("x-powered-by");
app.use(compression());

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

// Global baseline rate limiter
app.use(
  rateLimit({
    windowMs: 60 * 1000,
    max: 240,
    standardHeaders: true,
    legacyHeaders: false
  })
);

express.static.mime.define({ "application/manifest+json": ["webmanifest"] });

// Native Hostinger Node.js + MySQL + PayPal + Google Auth API routes
app.use("/api", createApiRouter());

const BOT_UA_RE = /(googlebot|adsbot-google|mediapartners-google|bingbot|slurp|duckduckbot|facebookexternalhit|twitterbot|whatsapp)/i;
const SPA_ROUTE_RE = /^\/($|courses|course|learn|ebooks|quizzes|mock-exams|dictionary|instruments|clinical-tools|cart|checkout|login|my-learning|nodadmin|about|brand-kit|editorial-policy|privacy-policy|terms|contact)(\/|$)/i;

// Match Hostinger .htaccess behavior: human browsers get React SPA index.html on app routes;
// search/AdSense bots get static pre-rendered HTML if available.
app.use((req, res, next) => {
  if (req.method === "GET" && SPA_ROUTE_RE.test(req.path) && !BOT_UA_RE.test(req.headers["user-agent"] || "")) {
    const distIndex = path.join(DIST_DIR, "index.html");
    if (fs.existsSync(distIndex)) {
      res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
      return res.sendFile(distIndex);
    }
  }
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

app.get("*", (_req, res) => {
  const distIndex = path.join(DIST_DIR, "index.html");
  if (fs.existsSync(distIndex)) {
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
    res.sendFile(distIndex);
  } else {
    res.sendFile(path.join(__dirname, "index.html"));
  }
});

// Global error handler — never leak stack traces or internal DB details
app.use((err, _req, res, _next) => {
  console.error("[Server Error]", err?.message || err);
  res.status(500).json({ error: "An internal server error occurred." });
});

app.listen(PORT, () => {
  console.log(`Nursing Uganda running on http://localhost:${PORT}`);
});
