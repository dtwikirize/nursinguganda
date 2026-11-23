const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const express = require("express");
const rateLimit = require("express-rate-limit");

let mysql = null;
try {
  mysql = require("mysql2/promise");
} catch {
  mysql = null;
}

let nodemailer = null;
try {
  nodemailer = require("nodemailer");
} catch {
  nodemailer = null;
}

const COOKIE_NAME = "nu_session";
const EPHEMERAL_FALLBACK_SECRET = crypto.randomBytes(32).toString("hex");
let _warnedSecret = false;

const COMMON_PASSWORDS = new Set([
  "12345678",
  "123456789",
  "1234567890",
  "password",
  "password1",
  "password123",
  "qwerty123",
  "abc12345",
  "nursing123",
  "uganda123",
  "welcome1",
  "admin123"
]);

const SCHEMA_SQL = [
  `CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(190) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    programme VARCHAR(120) DEFAULT 'certificate-in-nursing',
    email_verified TINYINT(1) NOT NULL DEFAULT 0,
    auth_provider VARCHAR(32) NOT NULL DEFAULT 'password',
    google_sub VARCHAR(128) NULL,
    failed_login_attempts INT NOT NULL DEFAULT 0,
    locked_until DATETIME NULL,
    last_login_at DATETIME NULL,
    last_login_ip VARCHAR(64) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
  `CREATE TABLE IF NOT EXISTS email_verifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    email VARCHAR(190) NOT NULL,
    code_hash VARCHAR(128) NOT NULL,
    attempts INT NOT NULL DEFAULT 0,
    expires_at DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_ev_user (user_id, expires_at),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
  `CREATE TABLE IF NOT EXISTS security_events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    email VARCHAR(190) DEFAULT '',
    event_type VARCHAR(64) NOT NULL,
    severity VARCHAR(16) NOT NULL DEFAULT 'info',
    ip_address VARCHAR(64) DEFAULT '',
    user_agent VARCHAR(255) DEFAULT '',
    details TEXT,
    alert_sent TINYINT(1) NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_sec_user (user_id, created_at),
    INDEX idx_sec_type (event_type, created_at)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
  `CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    paypal_order_id VARCHAR(120) NOT NULL UNIQUE,
    payer_email VARCHAR(190) DEFAULT '',
    amount_usd DECIMAL(10,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    status VARCHAR(32) NOT NULL DEFAULT 'COMPLETED',
    items_json TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
  `CREATE TABLE IF NOT EXISTS enrollments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    course_slug VARCHAR(160) NOT NULL,
    order_id INT NULL,
    access_type VARCHAR(32) NOT NULL DEFAULT 'free',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_user_course (user_id, course_slug),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
  `CREATE TABLE IF NOT EXISTS course_progress (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    course_slug VARCHAR(160) NOT NULL,
    lesson_slug VARCHAR(180) NOT NULL,
    completed TINYINT(1) NOT NULL DEFAULT 1,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_user_lesson (user_id, course_slug, lesson_slug),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
  `CREATE TABLE IF NOT EXISTS course_qa (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course_slug VARCHAR(160) NOT NULL,
    user_id INT NOT NULL,
    user_name VARCHAR(120) NOT NULL,
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_qa_course (course_slug, created_at),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
  `CREATE TABLE IF NOT EXISTS ebook_downloads (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ebook_slug VARCHAR(160) NOT NULL,
    email VARCHAR(190) DEFAULT 'guest',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`
];

const USER_MIGRATION_COLUMNS = [
  ["email_verified", "TINYINT(1) NOT NULL DEFAULT 0"],
  ["auth_provider", "VARCHAR(32) NOT NULL DEFAULT 'password'"],
  ["google_sub", "VARCHAR(128) NULL"],
  ["failed_login_attempts", "INT NOT NULL DEFAULT 0"],
  ["locked_until", "DATETIME NULL"],
  ["last_login_at", "DATETIME NULL"],
  ["last_login_ip", "VARCHAR(64) NULL"]
];

let _pool = null;
let _schemaReady = false;
let _catalogCache = null;

function getCatalogPrices() {
  if (_catalogCache) return _catalogCache;
  try {
    const p = path.join(process.cwd(), "assets", "data", "catalog.json");
    if (!fs.existsSync(p)) return null;
    const raw = JSON.parse(fs.readFileSync(p, "utf8"));
    const coursePriceMap = new Map();
    for (const c of raw.courses || []) {
      coursePriceMap.set(c.slug, Number(c.priceUsd || 0));
    }
    const bundlePriceMap = new Map();
    for (const prog of raw.programmes || []) {
      bundlePriceMap.set(`bundle-${prog.id}`, Number(prog.bundlePriceUsd || 24.99));
    }
    _catalogCache = { coursePriceMap, bundlePriceMap };
    return _catalogCache;
  } catch {
    return null;
  }
}

function dbConfig() {
  const host = process.env.DB_HOST || process.env.MYSQL_HOST || "127.0.0.1";
  const database = process.env.DB_NAME || process.env.MYSQL_DATABASE || "";
  const user = process.env.DB_USER || process.env.MYSQL_USER || "";
  const password = process.env.DB_PASSWORD || process.env.DB_PASS || process.env.MYSQL_PASSWORD || "";
  const port = Number(process.env.DB_PORT || process.env.MYSQL_PORT || 3306);
  return { host, database, user, password, port };
}

async function getPool() {
  if (!mysql) return null;
  const cfg = dbConfig();
  if (!cfg.database || !cfg.user) return null;

  if (!_pool) {
    const poolOpts = {
      host: cfg.host,
      port: cfg.port,
      user: cfg.user,
      password: cfg.password,
      database: cfg.database,
      waitForConnections: true,
      connectionLimit: 10
    };
    if (cfg.host === "localhost") {
      const sock = [
        process.env.DB_SOCKET,
        "/var/lib/mysql/mysql.sock",
        "/run/mysqld/mysqld.sock",
        "/tmp/mysql.sock"
      ].find((p) => p && fs.existsSync(p));
      if (sock) {
        poolOpts.socketPath = sock;
        delete poolOpts.host;
        delete poolOpts.port;
      }
    }
    _pool = mysql.createPool(poolOpts);
  }

  if (!_schemaReady) {
    for (const stmt of SCHEMA_SQL) {
      await _pool.query(stmt);
    }
    // Idempotently add new security columns to existing users table
    const [cols] = await _pool.query(
      "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'users'",
      [cfg.database]
    );
    const existingCols = new Set(cols.map((c) => c.COLUMN_NAME));
    for (const [colName, colDef] of USER_MIGRATION_COLUMNS) {
      if (!existingCols.has(colName)) {
        await _pool.query(`ALTER TABLE users ADD COLUMN ${colName} ${colDef}`);
      }
    }
    _schemaReady = true;
  }
  return _pool;
}

function sessionSecret() {
  if (process.env.SESSION_SECRET && process.env.SESSION_SECRET.length >= 24) {
    return process.env.SESSION_SECRET;
  }
  if (!_warnedSecret) {
    _warnedSecret = true;
    console.warn("[Security] SESSION_SECRET is missing or <24 chars; using ephemeral CSPRNG secret.");
  }
  return EPHEMERAL_FALLBACK_SECRET;
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64, { N: 16384, r: 8, p: 1 }).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password, stored) {
  const [salt, origHex] = String(stored || "").split(":");
  if (!salt || !origHex) return false;
  const derived = crypto.scryptSync(password, salt, 64, { N: 16384, r: 8, p: 1 });
  const orig = Buffer.from(origHex, "hex");
  return derived.length === orig.length && crypto.timingSafeEqual(derived, orig);
}

function hashOtp(code) {
  return crypto.createHmac("sha256", sessionSecret()).update(String(code)).digest("hex");
}

function signToken(payloadObj) {
  const json = Buffer.from(JSON.stringify(payloadObj)).toString("base64url");
  const sig = crypto.createHmac("sha256", sessionSecret()).update(json).digest("base64url");
  return `${json}.${sig}`;
}

function verifyToken(token) {
  const [json, sig] = String(token || "").split(".");
  if (!json || !sig) return null;
  const expected = crypto.createHmac("sha256", sessionSecret()).update(json).digest("base64url");
  if (sig.length !== expected.length) return null;
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  try {
    const data = JSON.parse(Buffer.from(json, "base64url").toString("utf8"));
    if (data.exp && Date.now() > data.exp) return null;
    return data;
  } catch {
    return null;
  }
}

function parseCookies(req) {
  const header = req.headers.cookie || "";
  const map = {};
  for (const part of header.split(";")) {
    const idx = part.indexOf("=");
    if (idx === -1) continue;
    try {
      map[part.slice(0, idx).trim()] = decodeURIComponent(part.slice(idx + 1).trim());
    } catch {
      // ignore malformed cookie encoding
    }
  }
  return map;
}

function isRequestHttps(req) {
  return Boolean(
    req.secure ||
    req.headers["x-forwarded-proto"] === "https" ||
    process.env.NODE_ENV === "production"
  );
}

function setSessionCookie(req, res, userId) {
  const token = signToken({ uid: userId, exp: Date.now() + 1000 * 60 * 60 * 24 * 14 });
  const attrs = [
    `${COOKIE_NAME}=${encodeURIComponent(token)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${60 * 60 * 24 * 14}`,
    ...(isRequestHttps(req) ? ["Secure"] : [])
  ];
  res.setHeader("Set-Cookie", attrs.join("; "));
}

function clearSessionCookie(req, res) {
  const attrs = [
    `${COOKIE_NAME}=`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    "Max-Age=0",
    ...(isRequestHttps(req) ? ["Secure"] : [])
  ];
  res.setHeader("Set-Cookie", attrs.join("; "));
}

function getSessionUserId(req) {
  const cookies = parseCookies(req);
  const data = verifyToken(cookies[COOKIE_NAME]);
  return data?.uid ? Number(data.uid) : null;
}

function initialsOf(name) {
  const parts = String(name || "NU").trim().split(/\s+/);
  return ((parts[0]?.[0] || "N") + (parts[1]?.[0] || "")).toUpperCase();
}

function getClientIp(req) {
  const fwd = req.headers["x-forwarded-for"];
  if (typeof fwd === "string" && fwd.trim()) {
    return fwd.split(",")[0].trim().slice(0, 64);
  }
  return String(req.ip || req.socket?.remoteAddress || "unknown").slice(0, 64);
}

function normalizeEmail(email) {
  const clean = String(email || "").trim().toLowerCase();
  if (clean.length > 190 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(clean)) return "";
  return clean;
}

function validatePasswordStrength(password) {
  const pw = String(password || "");
  if (pw.length < 8) return "Password must be at least 8 characters long.";
  if (pw.length > 128) return "Password must be 128 characters or fewer.";
  if (!/[a-zA-Z]/.test(pw) || !/[0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pw)) {
    return "Password must include at least one letter and one number or symbol.";
  }
  if (COMMON_PASSWORDS.has(pw.toLowerCase())) {
    return "That password is too common. Please choose a stronger password.";
  }
  return null;
}

function isValidSlug(slug) {
  return /^[a-z0-9-]{2,160}$/i.test(String(slug || ""));
}

function sanitizeText(str, maxLen = 255) {
  return String(str || "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim()
    .slice(0, maxLen);
}

// ── Mailer & Security Alerts ────────────────────────────────────────────────
let _transporter = null;
function getMailer() {
  if (_transporter) return _transporter;
  if (!nodemailer) return null;
  const host = process.env.SMTP_HOST || "";
  const user = process.env.SMTP_USER || "";
  const pass = process.env.SMTP_PASS || "";
  if (!host || !user || !pass) return null;

  _transporter = nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT || 465),
    secure: String(process.env.SMTP_SECURE || "true") !== "false",
    auth: { user, pass }
  });
  return _transporter;
}

async function sendSecurityEmail({ to, subject, html, text }) {
  const mailer = getMailer();
  if (!mailer || !to) {
    console.info(`[Mail Preview -> ${to || "admin"}] ${subject}`);
    return false;
  }
  try {
    const from = process.env.SMTP_FROM || `"Nursing Uganda Security" <${process.env.SMTP_USER}>`;
    await mailer.sendMail({ from, to, subject, text, html });
    return true;
  } catch (err) {
    console.error("[Mail Error]", err?.message || err);
    return false;
  }
}

async function recordSecurityEvent(pool, req, { userId = null, email = "", eventType, severity = "info", details = "", notifyUser = false, notifyAdmin = false }) {
  const ip = getClientIp(req);
  const ua = sanitizeText(req.headers["user-agent"] || "", 240);
  let alertSent = 0;

  if (notifyUser && email) {
    const sent = await sendSecurityEmail({
      to: email,
      subject: `[Nursing Uganda Security Alert] ${eventType.replace(/_/g, " ")}`,
      text: `Hello,\n\nA security event was detected on your Nursing Uganda account:\n\nEvent: ${eventType}\nDetails: ${details}\nIP Address: ${ip}\nTime: ${new Date().toISOString()}\n\nIf this wasn't you, please change your password immediately.\n\nNursing Uganda Security Team`,
      html: `<div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;border:1px solid #e2e8f0;padding:24px;border-radius:8px;">
        <h2 style="color:#1C1D1F;margin-top:0;">Nursing Uganda Security Alert</h2>
        <p style="color:#334155;">A security event was recorded on your account:</p>
        <ul style="background:#f8fafc;padding:14px 20px;border-radius:6px;color:#1e293b;list-style:none;">
          <li><strong>Event:</strong> ${eventType}</li>
          <li><strong>Details:</strong> ${details}</li>
          <li><strong>IP Address:</strong> ${ip}</li>
          <li><strong>Time (UTC):</strong> ${new Date().toUTCString()}</li>
        </ul>
        <p style="color:#64748b;font-size:13px;">If you did not perform this action, please reset your password immediately or contact support@nursinguganda.com.</p>
      </div>`
    });
    if (sent) alertSent = 1;
  }

  const adminEmail = process.env.SECURITY_ALERT_EMAIL || process.env.SMTP_USER || "";
  if (notifyAdmin && adminEmail) {
    const sent = await sendSecurityEmail({
      to: adminEmail,
      subject: `[CRITICAL ADMIN ALERT] ${eventType} (${ip})`,
      text: `Event: ${eventType}\nSeverity: ${severity}\nEmail: ${email}\nIP: ${ip}\nUA: ${ua}\nDetails: ${details}`,
      html: `<p><strong>Critical Security Event:</strong> ${eventType}</p><p><strong>User:</strong> ${email || "N/A"}</p><p><strong>IP:</strong> ${ip}</p><p><strong>Details:</strong> ${details}</p>`
    });
    if (sent) alertSent = 1;
  }

  if (pool) {
    try {
      await pool.query(
        "INSERT INTO security_events (user_id, email, event_type, severity, ip_address, user_agent, details, alert_sent) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [userId, sanitizeText(email, 190), eventType, severity, ip, ua, sanitizeText(details, 500), alertSent]
      );
    } catch {
      // non-fatal logging failure
    }
  }
}

async function issueEmailVerification(pool, req, user) {
  const code = String(crypto.randomInt(100000, 1000000));
  const codeHash = hashOtp(code);
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  await pool.query("DELETE FROM email_verifications WHERE user_id = ?", [user.id]);
  await pool.query(
    "INSERT INTO email_verifications (user_id, email, code_hash, expires_at) VALUES (?, ?, ?, ?)",
    [user.id, user.email, codeHash, expiresAt]
  );

  const sent = await sendSecurityEmail({
    to: user.email,
    subject: `Your Nursing Uganda verification code: ${code}`,
    text: `Hello ${user.name},\n\nYour Nursing Uganda email verification code is: ${code}\n\nThis code expires in 15 minutes. Never share this code with anyone.\n\nNursing Uganda`,
    html: `<div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;border:1px solid #e2e8f0;padding:24px;border-radius:8px;">
      <h2 style="color:#1C1D1F;margin-top:0;">Verify Your Email</h2>
      <p style="color:#334155;">Hello ${sanitizeText(user.name, 80)}, enter this 6-digit code to verify your Nursing Uganda student account:</p>
      <div style="font-size:32px;font-weight:800;letter-spacing:6px;color:#A137F2;background:#f7edff;padding:16px;text-align:center;border-radius:6px;margin:18px 0;">
        ${code}
      </div>
      <p style="color:#64748b;font-size:13px;">This code expires in 15 minutes. If you didn't request this, you can safely ignore this email.</p>
    </div>`
  });

  await recordSecurityEvent(pool, req, {
    userId: user.id,
    email: user.email,
    eventType: "VERIFICATION_SENT",
    severity: "info",
    details: sent ? "Verification code emailed via SMTP" : "Verification code generated (SMTP not configured)"
  });

  return sent;
}

async function fetchUserSessionState(pool, user) {
  const [enRows] = await pool.query("SELECT course_slug FROM enrollments WHERE user_id = ?", [user.id]);
  const [prRows] = await pool.query("SELECT course_slug, lesson_slug FROM course_progress WHERE user_id = ? AND completed = 1", [user.id]);
  const progress = {};
  for (const r of prRows) {
    progress[r.course_slug] = progress[r.course_slug] || [];
    progress[r.course_slug].push(r.lesson_slug);
  }
  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      programme: user.programme,
      emailVerified: Boolean(user.email_verified),
      authProvider: user.auth_provider || "password",
      initials: initialsOf(user.name)
    },
    enrollments: enRows.map((r) => r.course_slug),
    progress
  };
}

function createApiRouter() {
  const router = express.Router();

  router.use((_req, res, next) => {
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, private");
    next();
  });

  // Strict JSON size cap to prevent large-payload DoS
  router.use(express.json({ limit: "256kb" }));

  // CSRF / Cross-Origin Guard for state-changing requests
  router.use(async (req, res, next) => {
    if (["GET", "HEAD", "OPTIONS"].includes(req.method)) return next();

    const origin = req.headers.origin;
    const host = req.headers.host;
    if (origin && host) {
      try {
        const originHost = new URL(origin).host;
        const allowed = new Set([host, ...(process.env.ALLOWED_ORIGINS || "").split(",").map((s) => s.trim()).filter(Boolean)]);
        if (!allowed.has(originHost)) {
          const pool = await getPool().catch(() => null);
          await recordSecurityEvent(pool, req, {
            eventType: "CSRF_BLOCKED",
            severity: "critical",
            details: `Blocked cross-origin ${req.method} from ${origin} to ${req.originalUrl}`,
            notifyAdmin: true
          });
          return res.status(403).json({ error: "Cross-origin request blocked by security policy." });
        }
      } catch {
        return res.status(403).json({ error: "Invalid request origin." });
      }
    }
    next();
  });

  // Endpoint-specific Rate Limiters
  const authRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 15,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many authentication attempts. Please wait 15 minutes and try again." }
  });

  const verifyRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many verification attempts. Please wait 15 minutes." }
  });

  const writeRateLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 45,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Rate limit exceeded. Slow down and try again shortly." }
  });

  router.get("/config", async (_req, res) => {
    const cfg = dbConfig();
    res.json({
      paypalClientId: process.env.PAYPAL_CLIENT_ID || "sb",
      paypalMode: process.env.PAYPAL_MODE || "sandbox",
      googleClientId: process.env.GOOGLE_CLIENT_ID || "",
      smtpConfigured: Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS),
      dbConfigured: Boolean(cfg.database && cfg.user)
    });
  });

  async function requireDb(res) {
    try {
      const pool = await getPool();
      if (!pool) {
        res.status(503).json({ error: "Hostinger MySQL is not configured yet.", __noDb: true });
        return null;
      }
      return pool;
    } catch {
      res.status(503).json({ error: "Database service unavailable.", __noDb: true });
      return null;
    }
  }

  // Auth: me / register / login / google / verify-email / resend-verification / security-events / logout
  router.all("/auth", async (req, res, next) => {
    const action = String(req.query.action || "");
    if (["login", "register", "google"].includes(action)) {
      return authRateLimiter(req, res, () => handleAuth(req, res, action));
    }
    if (["verify-email", "resend-verification"].includes(action)) {
      return verifyRateLimiter(req, res, () => handleAuth(req, res, action));
    }
    return handleAuth(req, res, action).catch(next);
  });

  async function handleAuth(req, res, action) {
    const pool = await requireDb(res);
    if (!pool) return;

    if (action === "me") {
      const uid = getSessionUserId(req);
      if (!uid) return res.json({ user: null, enrollments: [], progress: {} });
      const [rows] = await pool.query(
        "SELECT id, name, email, programme, email_verified, auth_provider FROM users WHERE id = ?",
        [uid]
      );
      const user = rows[0];
      if (!user) {
        clearSessionCookie(req, res);
        return res.json({ user: null, enrollments: [], progress: {} });
      }
      return res.json(await fetchUserSessionState(pool, user));
    }

    if (action === "security-events") {
      const uid = getSessionUserId(req);
      if (!uid) return res.status(401).json({ error: "Please sign in first." });
      const [events] = await pool.query(
        "SELECT id, event_type AS eventType, severity, ip_address AS ipAddress, details, created_at AS createdAt FROM security_events WHERE user_id = ? ORDER BY created_at DESC LIMIT 15",
        [uid]
      );
      return res.json({ events });
    }

    if (action === "register") {
      if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed." });
      const { name = "", email = "", password = "", programme = "certificate-in-nursing" } = req.body || {};
      const cleanEmail = normalizeEmail(email);
      const cleanName = sanitizeText(name, 120);
      const cleanProgramme = isValidSlug(programme) ? programme : "certificate-in-nursing";

      if (!cleanName || cleanName.length < 2 || !cleanEmail) {
        return res.status(400).json({ error: "Enter a valid full name and email address." });
      }
      const pwError = validatePasswordStrength(password);
      if (pwError) {
        return res.status(400).json({ error: pwError });
      }

      const [existing] = await pool.query("SELECT id FROM users WHERE email = ?", [cleanEmail]);
      if (existing.length > 0) {
        return res.status(409).json({ error: "An account with this email already exists." });
      }

      const hash = hashPassword(String(password));
      const ip = getClientIp(req);
      const [result] = await pool.query(
        "INSERT INTO users (name, email, password_hash, programme, email_verified, auth_provider, last_login_at, last_login_ip) VALUES (?, ?, ?, ?, 0, 'password', NOW(), ?)",
        [cleanName, cleanEmail, hash, cleanProgramme, ip]
      );
      const uid = result.insertId;
      const newUser = {
        id: uid,
        name: cleanName,
        email: cleanEmail,
        programme: cleanProgramme,
        email_verified: 0,
        auth_provider: "password"
      };

      const emailSent = await issueEmailVerification(pool, req, newUser);
      await recordSecurityEvent(pool, req, {
        userId: uid,
        email: cleanEmail,
        eventType: "REGISTER_SUCCESS",
        severity: "info",
        details: "New password account registered"
      });

      setSessionCookie(req, res, uid);
      return res.json({
        ...(await fetchUserSessionState(pool, newUser)),
        verificationEmailSent: emailSent
      });
    }

    if (action === "login") {
      if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed." });
      const { email = "", password = "" } = req.body || {};
      const cleanEmail = normalizeEmail(email);
      if (!cleanEmail || !password) {
        return res.status(400).json({ error: "Email and password are required." });
      }

      const [rows] = await pool.query(
        "SELECT id, name, email, password_hash, programme, email_verified, auth_provider, failed_login_attempts, locked_until, last_login_ip FROM users WHERE email = ?",
        [cleanEmail]
      );
      const user = rows[0];

      if (user?.locked_until && new Date(user.locked_until).getTime() > Date.now()) {
        const mins = Math.max(1, Math.ceil((new Date(user.locked_until).getTime() - Date.now()) / 60000));
        return res.status(429).json({
          error: `Account temporarily locked due to repeated failed logins. Try again in ${mins} minute(s).`
        });
      }

      if (!user || !verifyPassword(String(password), user.password_hash)) {
        if (user) {
          const nextAttempts = Number(user.failed_login_attempts || 0) + 1;
          if (nextAttempts >= 5) {
            const lockUntil = new Date(Date.now() + 15 * 60 * 1000);
            await pool.query(
              "UPDATE users SET failed_login_attempts = ?, locked_until = ? WHERE id = ?",
              [nextAttempts, lockUntil, user.id]
            );
            await recordSecurityEvent(pool, req, {
              userId: user.id,
              email: user.email,
              eventType: "ACCOUNT_LOCKED",
              severity: "critical",
              details: `Account locked for 15 minutes after ${nextAttempts} failed login attempts`,
              notifyUser: true,
              notifyAdmin: true
            });
            return res.status(429).json({
              error: "Too many failed login attempts. Your account is locked for 15 minutes and a security alert has been sent."
            });
          }
          await pool.query("UPDATE users SET failed_login_attempts = ? WHERE id = ?", [nextAttempts, user.id]);
          await recordSecurityEvent(pool, req, {
            userId: user.id,
            email: user.email,
            eventType: "LOGIN_FAILED",
            severity: "warn",
            details: `Failed password attempt (${nextAttempts}/5)`
          });
        } else {
          await recordSecurityEvent(pool, req, {
            email: cleanEmail,
            eventType: "LOGIN_FAILED",
            severity: "warn",
            details: "Failed login attempt for unknown email"
          });
        }
        return res.status(401).json({ error: "Invalid email or password." });
      }

      const ip = getClientIp(req);
      const isNewIp = Boolean(user.last_login_ip && user.last_login_ip !== ip);
      await pool.query(
        "UPDATE users SET failed_login_attempts = 0, locked_until = NULL, last_login_at = NOW(), last_login_ip = ? WHERE id = ?",
        [ip, user.id]
      );

      await recordSecurityEvent(pool, req, {
        userId: user.id,
        email: user.email,
        eventType: isNewIp ? "NEW_IP_LOGIN" : "LOGIN_SUCCESS",
        severity: isNewIp ? "warn" : "info",
        details: isNewIp ? `Sign-in from new IP (${ip}, previous ${user.last_login_ip})` : "Password sign-in succeeded",
        notifyUser: isNewIp
      });

      setSessionCookie(req, res, user.id);
      return res.json(await fetchUserSessionState(pool, user));
    }

    if (action === "google") {
      if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed." });
      const googleClientId = process.env.GOOGLE_CLIENT_ID || "";
      if (!googleClientId) {
        return res.status(501).json({ error: "Google Login is not configured on the server yet (missing GOOGLE_CLIENT_ID)." });
      }

      const credential = String(req.body?.credential || "").trim();
      if (!credential) {
        return res.status(400).json({ error: "Missing Google credential token." });
      }

      let tokenInfo = null;
      try {
        const verifyRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`);
        if (!verifyRes.ok) {
          return res.status(401).json({ error: "Invalid or expired Google Sign-In token." });
        }
        tokenInfo = await verifyRes.json();
      } catch {
        return res.status(502).json({ error: "Could not verify Google token with Google servers." });
      }

      const validIss = tokenInfo.iss === "accounts.google.com" || tokenInfo.iss === "https://accounts.google.com";
      const validAud = tokenInfo.aud === googleClientId;
      const verifiedEmail = tokenInfo.email_verified === "true" || tokenInfo.email_verified === true;
      const notExpired = Number(tokenInfo.exp || 0) * 1000 > Date.now();
      const cleanEmail = normalizeEmail(tokenInfo.email);

      if (!validIss || !validAud || !verifiedEmail || !notExpired || !cleanEmail) {
        await recordSecurityEvent(pool, req, {
          email: cleanEmail,
          eventType: "GOOGLE_TOKEN_REJECTED",
          severity: "critical",
          details: "Google ID token failed audience, issuer, expiry, or verified-email check",
          notifyAdmin: true
        });
        return res.status(401).json({ error: "Google Sign-In verification failed." });
      }

      const googleSub = sanitizeText(tokenInfo.sub || "", 128);
      const googleName = sanitizeText(tokenInfo.name || cleanEmail.split("@")[0], 120);
      const ip = getClientIp(req);

      const [rows] = await pool.query(
        "SELECT id, name, email, programme, email_verified, auth_provider, last_login_ip FROM users WHERE email = ?",
        [cleanEmail]
      );
      let user = rows[0];

      if (!user) {
        const randomHash = hashPassword(crypto.randomBytes(32).toString("hex"));
        const [result] = await pool.query(
          "INSERT INTO users (name, email, password_hash, programme, email_verified, auth_provider, google_sub, last_login_at, last_login_ip) VALUES (?, ?, ?, 'certificate-in-nursing', 1, 'google', ?, NOW(), ?)",
          [googleName, cleanEmail, randomHash, googleSub, ip]
        );
        user = {
          id: result.insertId,
          name: googleName,
          email: cleanEmail,
          programme: "certificate-in-nursing",
          email_verified: 1,
          auth_provider: "google"
        };
        await recordSecurityEvent(pool, req, {
          userId: user.id,
          email: user.email,
          eventType: "GOOGLE_REGISTER",
          severity: "info",
          details: "New account created via Google Sign-In"
        });
      } else {
        const isNewIp = Boolean(user.last_login_ip && user.last_login_ip !== ip);
        await pool.query(
          "UPDATE users SET email_verified = 1, google_sub = COALESCE(google_sub, ?), failed_login_attempts = 0, locked_until = NULL, last_login_at = NOW(), last_login_ip = ? WHERE id = ?",
          [googleSub, ip, user.id]
        );
        user.email_verified = 1;
        await recordSecurityEvent(pool, req, {
          userId: user.id,
          email: user.email,
          eventType: isNewIp ? "NEW_IP_LOGIN" : "GOOGLE_LOGIN",
          severity: isNewIp ? "warn" : "info",
          details: isNewIp ? `Google sign-in from new IP (${ip})` : "Google sign-in succeeded",
          notifyUser: isNewIp
        });
      }

      setSessionCookie(req, res, user.id);
      return res.json(await fetchUserSessionState(pool, user));
    }

    if (action === "verify-email") {
      if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed." });
      const uid = getSessionUserId(req);
      if (!uid) return res.status(401).json({ error: "Please sign in first." });

      const code = String(req.body?.code || "").trim();
      if (!/^\d{6}$/.test(code)) {
        return res.status(400).json({ error: "Enter the 6-digit verification code." });
      }

      const [evRows] = await pool.query(
        "SELECT id, code_hash, attempts, expires_at FROM email_verifications WHERE user_id = ? ORDER BY id DESC LIMIT 1",
        [uid]
      );
      const ev = evRows[0];
      if (!ev || new Date(ev.expires_at).getTime() < Date.now()) {
        return res.status(400).json({ error: "Verification code expired. Please request a new code." });
      }
      if (ev.attempts >= 5) {
        return res.status(429).json({ error: "Too many incorrect codes. Please request a new code." });
      }

      const candidateHash = hashOtp(code);
      if (candidateHash !== ev.code_hash) {
        await pool.query("UPDATE email_verifications SET attempts = attempts + 1 WHERE id = ?", [ev.id]);
        return res.status(400).json({ error: "Incorrect verification code." });
      }

      await pool.query("UPDATE users SET email_verified = 1 WHERE id = ?", [uid]);
      await pool.query("DELETE FROM email_verifications WHERE user_id = ?", [uid]);

      const [uRows] = await pool.query(
        "SELECT id, name, email, programme, email_verified, auth_provider FROM users WHERE id = ?",
        [uid]
      );
      const user = uRows[0];
      await recordSecurityEvent(pool, req, {
        userId: uid,
        email: user?.email || "",
        eventType: "EMAIL_VERIFIED",
        severity: "info",
        details: "Email address verified via 6-digit OTP"
      });

      return res.json({ ok: true, ...(await fetchUserSessionState(pool, user)) });
    }

    if (action === "resend-verification") {
      if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed." });
      const uid = getSessionUserId(req);
      if (!uid) return res.status(401).json({ error: "Please sign in first." });

      const [uRows] = await pool.query(
        "SELECT id, name, email, email_verified FROM users WHERE id = ?",
        [uid]
      );
      const user = uRows[0];
      if (!user) return res.status(404).json({ error: "Account not found." });
      if (user.email_verified) return res.json({ ok: true, alreadyVerified: true });

      const sent = await issueEmailVerification(pool, req, user);
      return res.json({ ok: true, verificationEmailSent: sent });
    }

    if (action === "logout") {
      clearSessionCookie(req, res);
      return res.json({ ok: true });
    }

    return res.status(400).json({ error: "Unknown auth action." });
  }

  // Free Enrollments
  router.post("/enrollments", writeRateLimiter, async (req, res) => {
    const pool = await requireDb(res);
    if (!pool) return;
    const uid = getSessionUserId(req);
    if (!uid) return res.status(401).json({ error: "Please sign in first." });

    const courseSlug = String(req.body?.courseSlug || "").trim();
    if (!isValidSlug(courseSlug)) return res.status(400).json({ error: "Invalid courseSlug." });

    await pool.query("INSERT IGNORE INTO enrollments (user_id, course_slug, access_type) VALUES (?, ?, 'free')", [uid, courseSlug]);
    const [enRows] = await pool.query("SELECT course_slug FROM enrollments WHERE user_id = ?", [uid]);
    return res.json({ enrollments: enRows.map((r) => r.course_slug) });
  });

  // PayPal Server-Side Verification & Capture (with Replay & Amount Tamper Protection)
  router.post("/paypal-capture", writeRateLimiter, async (req, res) => {
    const pool = await requireDb(res);
    if (!pool) return;
    const uid = getSessionUserId(req);
    if (!uid) return res.status(401).json({ error: "Please sign in first." });

    const { orderId = "", items = [], payerEmail = "" } = req.body || {};
    const cleanOrderId = String(orderId || "").trim();
    if (!/^[A-Z0-9-]{8,64}$/i.test(cleanOrderId) || !Array.isArray(items) || items.length === 0 || items.length > 50) {
      return res.status(400).json({ error: "Invalid PayPal orderId or items." });
    }

    // Prevent orderId replay across accounts
    const [existingOrders] = await pool.query("SELECT id, user_id FROM orders WHERE paypal_order_id = ?", [cleanOrderId]);
    if (existingOrders.length > 0) {
      if (existingOrders[0].user_id !== uid) {
        await recordSecurityEvent(pool, req, {
          userId: uid,
          eventType: "SUSPICIOUS_ORDER",
          severity: "critical",
          details: `Attempted replay of PayPal order ${cleanOrderId} owned by user ${existingOrders[0].user_id}`,
          notifyAdmin: true
        });
        return res.status(409).json({ error: "This PayPal order has already been claimed." });
      }
      const [enRows] = await pool.query("SELECT course_slug FROM enrollments WHERE user_id = ?", [uid]);
      return res.json({ orderId: cleanOrderId, enrollments: enRows.map((r) => r.course_slug) });
    }

    const clientId = process.env.PAYPAL_CLIENT_ID || "";
    const secret = process.env.PAYPAL_SECRET || "";
    const isLive = (process.env.PAYPAL_MODE || "sandbox") === "live";
    const baseUrl = isLive ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";

    if (!clientId || !secret) {
      return res.status(500).json({ error: "PayPal API credentials are not set in Hostinger Environment Variables." });
    }

    const authHeader = Buffer.from(`${clientId}:${secret}`).toString("base64");
    const tokenRes = await fetch(`${baseUrl}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${authHeader}`,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: "grant_type=client_credentials"
    });
    const tokenData = await tokenRes.json();
    if (!tokenData?.access_token) {
      return res.status(502).json({ error: "Could not authenticate with PayPal API." });
    }

    const orderRes = await fetch(`${baseUrl}/v2/checkout/orders/${encodeURIComponent(cleanOrderId)}`, {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        "Content-Type": "application/json"
      }
    });
    const orderData = await orderRes.json();
    if (orderData?.status !== "COMPLETED") {
      return res.status(402).json({ error: "PayPal order is not completed." });
    }

    const paidAmount = Number(orderData?.purchase_units?.[0]?.amount?.value || 0);
    const catalogPrices = getCatalogPrices();
    if (catalogPrices) {
      let expectedTotal = 0;
      for (const item of items) {
        if (catalogPrices.bundlePriceMap.has(item.slug)) {
          expectedTotal += catalogPrices.bundlePriceMap.get(item.slug);
        } else if (catalogPrices.coursePriceMap.has(item.slug)) {
          expectedTotal += catalogPrices.coursePriceMap.get(item.slug);
        }
      }
      if (expectedTotal > 0 && paidAmount + 0.05 < expectedTotal) {
        await recordSecurityEvent(pool, req, {
          userId: uid,
          eventType: "SUSPICIOUS_ORDER",
          severity: "critical",
          details: `Order ${cleanOrderId} paid $${paidAmount} but expected $${expectedTotal.toFixed(2)}`,
          notifyAdmin: true
        });
        return res.status(402).json({ error: "Paid amount does not match course catalog price." });
      }
    }

    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      const [ordRes] = await conn.query(
        "INSERT INTO orders (user_id, paypal_order_id, payer_email, amount_usd, status, items_json) VALUES (?, ?, ?, ?, 'COMPLETED', ?)",
        [uid, cleanOrderId, sanitizeText(payerEmail, 190), paidAmount, JSON.stringify(items)]
      );
      const dbOrderId = ordRes.insertId || null;
      for (const item of items) {
        const slugs = Array.isArray(item.courseSlugs) ? item.courseSlugs : [item.slug];
        for (const s of slugs) {
          if (isValidSlug(s)) {
            await conn.query(
              "INSERT IGNORE INTO enrollments (user_id, course_slug, order_id, access_type) VALUES (?, ?, ?, 'purchased')",
              [uid, s, dbOrderId]
            );
          }
        }
      }
      await conn.commit();
    } catch {
      await conn.rollback();
      return res.status(500).json({ error: "Failed to save enrollment." });
    } finally {
      conn.release();
    }

    const [enRows] = await pool.query("SELECT course_slug FROM enrollments WHERE user_id = ?", [uid]);
    return res.json({ orderId: cleanOrderId, enrollments: enRows.map((r) => r.course_slug) });
  });

  // Course Progress
  router.post("/progress", writeRateLimiter, async (req, res) => {
    const pool = await requireDb(res);
    if (!pool) return;
    const uid = getSessionUserId(req);
    if (!uid) return res.status(401).json({ error: "Please sign in first." });

    const { courseSlug = "", lessonSlug = "", completed = true } = req.body || {};
    if (!isValidSlug(courseSlug) || !isValidSlug(lessonSlug)) {
      return res.status(400).json({ error: "Invalid courseSlug or lessonSlug." });
    }
    await pool.query(
      "INSERT INTO course_progress (user_id, course_slug, lesson_slug, completed) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE completed = VALUES(completed)",
      [uid, courseSlug, lessonSlug, completed ? 1 : 0]
    );
    const [prRows] = await pool.query("SELECT course_slug, lesson_slug FROM course_progress WHERE user_id = ? AND completed = 1", [uid]);
    const progress = {};
    for (const r of prRows) {
      progress[r.course_slug] = progress[r.course_slug] || [];
      progress[r.course_slug].push(r.lesson_slug);
    }
    return res.json({ progress });
  });

  // Course Q&A
  router.all("/qa", writeRateLimiter, async (req, res) => {
    const pool = await requireDb(res);
    if (!pool) return;

    if (req.method === "GET") {
      const courseSlug = String(req.query.course || "").trim();
      if (!isValidSlug(courseSlug)) return res.json({ questions: [] });
      const [rows] = await pool.query(
        "SELECT id, course_slug AS courseSlug, user_name AS userName, title, body, created_at AS createdAt FROM course_qa WHERE course_slug = ? ORDER BY created_at DESC LIMIT 50",
        [courseSlug]
      );
      return res.json({ questions: rows });
    }

    const uid = getSessionUserId(req);
    if (!uid) return res.status(401).json({ error: "Please sign in to post a question." });
    const { courseSlug = "", title = "", body = "" } = req.body || {};
    const cleanTitle = sanitizeText(title, 200);
    const cleanBody = sanitizeText(body, 2500);
    if (!isValidSlug(courseSlug) || !cleanTitle || !cleanBody) {
      return res.status(400).json({ error: "Valid course, question title, and details are required." });
    }
    const [uRows] = await pool.query("SELECT name FROM users WHERE id = ?", [uid]);
    const userName = uRows[0]?.name || "Nursing Student";
    await pool.query(
      "INSERT INTO course_qa (course_slug, user_id, user_name, title, body) VALUES (?, ?, ?, ?, ?)",
      [courseSlug, uid, userName, cleanTitle, cleanBody]
    );
    const [rows] = await pool.query(
      "SELECT id, course_slug AS courseSlug, user_name AS userName, title, body, created_at AS createdAt FROM course_qa WHERE course_slug = ? ORDER BY created_at DESC LIMIT 50",
      [courseSlug]
    );
    return res.json({ questions: rows });
  });

  // Free eBook Download Lead Tracking
  router.post("/ebooks", writeRateLimiter, async (req, res) => {
    const pool = await requireDb(res);
    if (!pool) return;
    const { ebookSlug = "", email = "guest" } = req.body || {};
    if (!isValidSlug(ebookSlug)) return res.status(400).json({ error: "Invalid ebookSlug." });
    const cleanEmail = email === "guest" ? "guest" : normalizeEmail(email) || "guest";
    await pool.query("INSERT INTO ebook_downloads (ebook_slug, email) VALUES (?, ?)", [ebookSlug, cleanEmail]);
    return res.json({ ok: true });
  });

  return router;
}

module.exports = { createApiRouter };
