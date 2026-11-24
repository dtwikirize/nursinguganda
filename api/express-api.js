const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const express = require("express");
const rateLimit = require("express-rate-limit");
const {
  buildWelcomeVerificationEmail,
  buildSecurityAlertEmail,
  buildPaymentReceiptEmail,
  buildWeeklyDigestEmail,
  buildQuizResultEmail,
  buildCertificateEmail
} = require("./email-templates");

let cron = null;
try {
  cron = require("node-cron");
} catch {
  cron = null;
}

const DAILY_TOTAL_EMAIL_LIMIT = 90;  // Safe ceiling under Hostinger 100/day limit (10-email buffer for OTP/security)
const DAILY_DIGEST_LIMIT = 50;       // Max 50 digest emails per day

function getAdminEmail() {
  return String(process.env.ADMIN_EMAIL || "twikirizederick@gmail.com").trim().toLowerCase();
}

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
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
  `CREATE TABLE IF NOT EXISTS email_subscribers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(190) NOT NULL UNIQUE,
    name VARCHAR(120) DEFAULT '',
    source VARCHAR(64) DEFAULT 'signup',
    topic_preference VARCHAR(120) DEFAULT 'all',
    subscribed TINYINT(1) NOT NULL DEFAULT 1,
    last_digest_sent_at DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_sub_active (subscribed, last_digest_sent_at)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
  `CREATE TABLE IF NOT EXISTS email_send_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sent_date DATE NOT NULL,
    category VARCHAR(32) NOT NULL,
    recipient VARCHAR(190) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    status VARCHAR(24) NOT NULL DEFAULT 'sent',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_esl_date_cat (sent_date, category)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
  `CREATE TABLE IF NOT EXISTS digest_campaigns (
    id INT AUTO_INCREMENT PRIMARY KEY,
    subject VARCHAR(255) NOT NULL,
    topic_title VARCHAR(255) NOT NULL,
    summary TEXT NOT NULL,
    highlights_json TEXT NOT NULL,
    cta_url VARCHAR(255) NOT NULL,
    active TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
  `CREATE TABLE IF NOT EXISTS page_visits (
    id INT AUTO_INCREMENT PRIMARY KEY,
    path VARCHAR(255) NOT NULL,
    referrer VARCHAR(255) DEFAULT '',
    visitor_hash VARCHAR(64) NOT NULL,
    device_type VARCHAR(24) DEFAULT 'desktop',
    visit_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_pv_date (visit_date),
    INDEX idx_pv_path (path)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
  `CREATE TABLE IF NOT EXISTS quiz_attempts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    quiz_type VARCHAR(32) NOT NULL DEFAULT 'topic_free',
    quiz_slug VARCHAR(140) NOT NULL,
    quiz_title VARCHAR(255) NOT NULL,
    score INT NOT NULL DEFAULT 0,
    total_questions INT NOT NULL DEFAULT 0,
    percent INT NOT NULL DEFAULT 0,
    passed TINYINT(1) NOT NULL DEFAULT 0,
    attempt_number INT NOT NULL DEFAULT 1,
    breakdown_json TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_qa_user_slug (user_id, quiz_type, quiz_slug)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
  `CREATE TABLE IF NOT EXISTS course_certificates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    course_slug VARCHAR(120) NOT NULL,
    course_title VARCHAR(255) NOT NULL,
    programme_label VARCHAR(120) DEFAULT '',
    score INT NOT NULL DEFAULT 0,
    total_questions INT NOT NULL DEFAULT 30,
    percent INT NOT NULL DEFAULT 0,
    attempt_number INT NOT NULL DEFAULT 1,
    certificate_code VARCHAR(40) NOT NULL UNIQUE,
    issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_user_course_cert (user_id, course_slug)
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

async function getTodayEmailCounts(pool) {
  if (!pool) return { totalToday: 0, digestToday: 0 };
  const [rows] = await pool.query(
    "SELECT category, COUNT(*) AS cnt FROM email_send_log WHERE sent_date = CURDATE() AND status = 'sent' GROUP BY category"
  );
  let totalToday = 0;
  let digestToday = 0;
  for (const r of rows) {
    const cnt = Number(r.cnt || 0);
    totalToday += cnt;
    if (r.category === "digest") digestToday += cnt;
  }
  return { totalToday, digestToday };
}

async function sendBrandedEmail(pool, { to, subject, html, text, category = "transactional" }) {
  if (!to) return false;
  if (pool) {
    const { totalToday, digestToday } = await getTodayEmailCounts(pool);
    if (totalToday >= DAILY_TOTAL_EMAIL_LIMIT) {
      console.warn(`[Mail Quota] Daily total cap (${DAILY_TOTAL_EMAIL_LIMIT}) reached; skipping ${category} to ${to}`);
      return false;
    }
    if (category === "digest" && digestToday >= DAILY_DIGEST_LIMIT) {
      console.warn(`[Mail Quota] Daily digest cap (${DAILY_DIGEST_LIMIT}) reached.`);
      return false;
    }
  }

  const sent = await sendSecurityEmail({ to, subject, html, text });
  if (pool) {
    try {
      await pool.query(
        "INSERT INTO email_send_log (sent_date, category, recipient, subject, status) VALUES (CURDATE(), ?, ?, ?, ?)",
        [category, sanitizeText(to, 190), sanitizeText(subject, 250), sent ? "sent" : "skipped"]
      );
    } catch {
      // non-fatal
    }
  }
  return sent;
}

async function upsertSubscriber(pool, { email, name = "", source = "signup", topicPreference = "all" }) {
  const cleanEmail = normalizeEmail(email);
  if (!pool || !cleanEmail) return;
  try {
    await pool.query(
      `INSERT INTO email_subscribers (email, name, source, topic_preference, subscribed)
       VALUES (?, ?, ?, ?, 1)
       ON DUPLICATE KEY UPDATE name = IF(VALUES(name) != '', VALUES(name), name)`,
      [cleanEmail, sanitizeText(name, 120), sanitizeText(source, 64), sanitizeText(topicPreference, 120)]
    );
  } catch {
    // non-fatal
  }
}

async function runDailyDigestBatch(pool, campaignOverride = null) {
  if (!pool) return { sent: 0, skipped: 0, reason: "no_db" };
  const { totalToday, digestToday } = await getTodayEmailCounts(pool);
  const remaining = Math.max(0, Math.min(DAILY_DIGEST_LIMIT - digestToday, DAILY_TOTAL_EMAIL_LIMIT - totalToday));
  if (remaining <= 0) {
    return { sent: 0, skipped: 0, remainingDigestQuota: 0, reason: "daily_limit_reached" };
  }

  let campaign = campaignOverride;
  if (!campaign) {
    const [cRows] = await pool.query("SELECT * FROM digest_campaigns WHERE active = 1 ORDER BY id DESC LIMIT 1");
    campaign = cRows[0];
  }
  if (!campaign) {
    // Seed default weekly UNMEB Nursing & Midwifery Agenda
    const defaultHighlights = [
      "Anatomy & Physiology High-Yield Revision Notes (UNMEB Paper I)",
      "Uganda MoH Clinical Guidelines 2023 — Essential Drug Dosages",
      "Free Referenced Study eBooks — Download Offline PDFs"
    ];
    const [ins] = await pool.query(
      "INSERT INTO digest_campaigns (subject, topic_title, summary, highlights_json, cta_url, active) VALUES (?, ?, ?, ?, ?, 1)",
      [
        "Nursing Uganda Weekly Digest: UNMEB High-Yield Clinical Agenda",
        "This Week's Nursing & Midwifery Study Agenda",
        "Stay exam-ready with our curated weekly clinical topic, Uganda MoH guideline updates, and free referenced study eBooks.",
        JSON.stringify(defaultHighlights),
        "https://nursinguganda.com/courses"
      ]
    );
    campaign = {
      id: ins.insertId,
      subject: "Nursing Uganda Weekly Digest: UNMEB High-Yield Clinical Agenda",
      topic_title: "This Week's Nursing & Midwifery Study Agenda",
      summary: "Stay exam-ready with our curated weekly clinical topic, Uganda MoH guideline updates, and free referenced study eBooks.",
      highlights_json: JSON.stringify(defaultHighlights),
      cta_url: "https://nursinguganda.com/courses"
    };
  }

  let highlights = [];
  try {
    highlights = JSON.parse(campaign.highlights_json || "[]");
  } catch {
    highlights = [];
  }

  const [subs] = await pool.query(
    `SELECT id, email, name FROM email_subscribers
     WHERE subscribed = 1
       AND (last_digest_sent_at IS NULL OR last_digest_sent_at < DATE_SUB(NOW(), INTERVAL 6 DAY))
     ORDER BY last_digest_sent_at ASC
     LIMIT ?`,
    [remaining]
  );

  let sent = 0;
  let skipped = 0;
  for (const sub of subs) {
    const mail = buildWeeklyDigestEmail({
      name: sub.name,
      email: sub.email,
      subject: campaign.subject,
      topicTitle: campaign.topic_title,
      summary: campaign.summary,
      highlights,
      ctaUrl: campaign.cta_url
    });
    const ok = await sendBrandedEmail(pool, {
      to: sub.email,
      subject: mail.subject,
      html: mail.html,
      text: mail.text,
      category: "digest"
    });
    if (ok) {
      sent += 1;
      await pool.query("UPDATE email_subscribers SET last_digest_sent_at = NOW() WHERE id = ?", [sub.id]);
    } else {
      skipped += 1;
    }
  }

  const after = await getTodayEmailCounts(pool);
  return {
    sent,
    skipped,
    remainingDigestQuota: Math.max(0, DAILY_DIGEST_LIMIT - after.digestToday),
    digestToday: after.digestToday,
    totalToday: after.totalToday
  };
}

async function recordSecurityEvent(pool, req, { userId = null, email = "", eventType, severity = "info", details = "", notifyUser = false, notifyAdmin = false }) {
  const ip = getClientIp(req);
  const ua = sanitizeText(req.headers["user-agent"] || "", 240);
  let alertSent = 0;

  if (notifyUser && email) {
    const mail = buildSecurityAlertEmail({ eventType, details, ipAddress: ip });
    const sent = await sendBrandedEmail(pool, { to: email, ...mail, category: "security" });
    if (sent) alertSent = 1;
  }

  const adminEmail = process.env.SECURITY_ALERT_EMAIL || getAdminEmail() || process.env.SMTP_USER || "";
  if (notifyAdmin && adminEmail) {
    const mail = buildSecurityAlertEmail({
      eventType: `ADMIN_${eventType}`,
      details: `User: ${email || "N/A"} — ${details}`,
      ipAddress: ip
    });
    const sent = await sendBrandedEmail(pool, { to: adminEmail, ...mail, category: "security" });
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

  const mail = buildWelcomeVerificationEmail({ name: user.name, code, authProvider: "password" });
  const sent = await sendBrandedEmail(pool, { to: user.email, ...mail, category: "transactional" });

  await recordSecurityEvent(pool, req, {
    userId: user.id,
    email: user.email,
    eventType: "VERIFICATION_SENT",
    severity: "info",
    details: sent ? "Branded verification email sent via SMTP" : "Verification code generated (SMTP not configured)"
  });

  return sent;
}

async function fetchUserSessionState(pool, user) {
  const [enRows] = await pool.query("SELECT course_slug FROM enrollments WHERE user_id = ?", [user.id]);
  const [prRows] = await pool.query("SELECT course_slug, lesson_slug FROM course_progress WHERE user_id = ? AND completed = 1", [user.id]);
  const [subRows] = await pool.query("SELECT subscribed, topic_preference FROM email_subscribers WHERE email = ? LIMIT 1", [user.email]);
  const [qaAttemptRows] = await pool.query(
    `SELECT id, quiz_type AS quizType, quiz_slug AS quizSlug, quiz_title AS quizTitle, score,
            total_questions AS totalQuestions, percent, passed, attempt_number AS attemptNumber,
            breakdown_json AS breakdownJson, created_at AS createdAt
     FROM quiz_attempts WHERE user_id = ? ORDER BY created_at DESC LIMIT 120`,
    [user.id]
  );
  const [certRows] = await pool.query(
    `SELECT id, course_slug AS courseSlug, course_title AS courseTitle, programme_label AS programmeLabel,
            score, total_questions AS totalQuestions, percent, attempt_number AS attemptNumber,
            certificate_code AS certificateCode, issued_at AS issuedAt
     FROM course_certificates WHERE user_id = ? ORDER BY issued_at DESC`,
    [user.id]
  );
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
      isAdmin: String(user.email || "").toLowerCase() === getAdminEmail(),
      digestSubscribed: subRows[0] ? Boolean(subRows[0].subscribed) : true,
      topicPreference: subRows[0]?.topic_preference || "all",
      initials: initialsOf(user.name)
    },
    enrollments: enRows.map((r) => r.course_slug),
    progress,
    quizAttempts: qaAttemptRows.map((r) => ({ ...r, passed: Boolean(r.passed) })),
    certificates: certRows
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
      await upsertSubscriber(pool, { email: cleanEmail, name: cleanName, source: "signup", topicPreference: cleanProgramme });
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
        await upsertSubscriber(pool, { email: user.email, name: user.name, source: "google" });
        const welcomeMail = buildWelcomeVerificationEmail({ name: user.name, authProvider: "google" });
        await sendBrandedEmail(pool, { to: user.email, ...welcomeMail, category: "transactional" });
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

    if (action === "preferences") {
      if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed." });
      const uid = getSessionUserId(req);
      if (!uid) return res.status(401).json({ error: "Please sign in first." });
      const [uRows] = await pool.query("SELECT id, name, email, programme, email_verified, auth_provider FROM users WHERE id = ?", [uid]);
      const user = uRows[0];
      if (!user) return res.status(404).json({ error: "User not found." });

      const subscribed = req.body?.digestSubscribed !== false ? 1 : 0;
      const topicPreference = sanitizeText(req.body?.topicPreference || "all", 120) || "all";
      await pool.query(
        `INSERT INTO email_subscribers (email, name, source, topic_preference, subscribed)
         VALUES (?, ?, 'dashboard', ?, ?)
         ON DUPLICATE KEY UPDATE topic_preference = VALUES(topic_preference), subscribed = VALUES(subscribed)`,
        [user.email, user.name, topicPreference, subscribed]
      );
      return res.json(await fetchUserSessionState(pool, user));
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

  async function fetchPayPalAccessToken() {
    const clientId = process.env.PAYPAL_CLIENT_ID || "";
    const secret = process.env.PAYPAL_SECRET || "";
    const isLive = (process.env.PAYPAL_MODE || "sandbox") === "live";
    const baseUrl = isLive ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";
    if (!clientId || !secret) {
      return { error: "PayPal API credentials are not set in Hostinger Environment Variables.", status: 500 };
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
      return { error: "Could not authenticate with PayPal API.", status: 502 };
    }
    return { accessToken: tokenData.access_token, baseUrl };
  }

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

    const isLive = (process.env.PAYPAL_MODE || "sandbox") === "live";
    const baseUrl = isLive ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";
    const tokenRes = await fetchPayPalAccessToken();
    if (tokenRes.error) {
      return res.status(tokenRes.status || 502).json({ error: tokenRes.error });
    }

    const orderRes = await fetch(`${baseUrl}/v2/checkout/orders/${encodeURIComponent(cleanOrderId)}`, {
      headers: {
        Authorization: `Bearer ${tokenRes.accessToken}`,
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

    const [uRows] = await pool.query("SELECT name, email FROM users WHERE id = ?", [uid]);
    if (uRows[0]?.email) {
      const receipt = buildPaymentReceiptEmail({
        name: uRows[0].name,
        orderId: cleanOrderId,
        amountUsd: paidAmount,
        items
      });
      await sendBrandedEmail(pool, { to: uRows[0].email, ...receipt, category: "transactional" });
    }

    const [enRows] = await pool.query("SELECT course_slug FROM enrollments WHERE user_id = ?", [uid]);
    return res.json({ orderId: cleanOrderId, enrollments: enRows.map((r) => r.course_slug) });
  });

  // Cryptographically Verified PayPal Webhook Receiver (Refund Revocation & Capture Reconciliation)
  router.post("/paypal-webhook", async (req, res) => {
    const pool = await requireDb(res);
    if (!pool) return;

    const webhookId = String(process.env.PAYPAL_WEBHOOK_ID || "").trim();
    if (!webhookId) {
      return res.status(503).json({ error: "PAYPAL_WEBHOOK_ID is not configured in environment variables." });
    }

    const transmissionId = String(req.headers["paypal-transmission-id"] || "");
    const transmissionTime = String(req.headers["paypal-transmission-time"] || "");
    const certUrl = String(req.headers["paypal-cert-url"] || "");
    const authAlgo = String(req.headers["paypal-auth-algo"] || "");
    const transmissionSig = String(req.headers["paypal-transmission-sig"] || "");
    const webhookEvent = req.body;

    if (!transmissionId || !transmissionTime || !certUrl || !authAlgo || !transmissionSig || !webhookEvent?.event_type) {
      return res.status(400).json({ error: "Missing PayPal webhook signature headers or event body." });
    }

    const tokenRes = await fetchPayPalAccessToken();
    if (tokenRes.error) {
      return res.status(tokenRes.status || 502).json({ error: tokenRes.error });
    }

    const verifyRes = await fetch(`${tokenRes.baseUrl}/v1/notifications/verify-webhook-signature`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenRes.accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        transmission_id: transmissionId,
        transmission_time: transmissionTime,
        cert_url: certUrl,
        auth_algo: authAlgo,
        transmission_sig: transmissionSig,
        webhook_id: webhookId,
        webhook_event: webhookEvent
      })
    });
    const verifyJson = await verifyRes.json();
    if (verifyJson?.verification_status !== "SUCCESS") {
      await recordSecurityEvent(pool, req, {
        eventType: "PAYPAL_WEBHOOK_INVALID",
        severity: "critical",
        details: `Invalid PayPal webhook signature for event ${sanitizeText(webhookEvent.id, 64)} (${sanitizeText(webhookEvent.event_type, 64)})`,
        notifyAdmin: true
      });
      return res.status(401).json({ error: "Webhook signature verification failed." });
    }

    const eventType = String(webhookEvent.event_type || "");
    const resource = webhookEvent.resource || {};
    const relatedOrderId = String(
      resource?.supplementary_data?.related_ids?.order_id ||
      (eventType.startsWith("CHECKOUT.ORDER") ? resource?.id : "") ||
      ""
    ).trim();

    if (eventType === "PAYMENT.CAPTURE.COMPLETED" && relatedOrderId) {
      await pool.query("UPDATE orders SET status = 'COMPLETED' WHERE paypal_order_id = ? AND status != 'REFUNDED'", [relatedOrderId]);
      return res.json({ ok: true, handled: eventType, orderId: relatedOrderId });
    }

    if ((eventType === "PAYMENT.CAPTURE.REFUNDED" || eventType === "PAYMENT.CAPTURE.REVERSED") && relatedOrderId) {
      const [ordRows] = await pool.query("SELECT id, user_id FROM orders WHERE paypal_order_id = ?", [relatedOrderId]);
      if (ordRows[0]) {
        await pool.query("UPDATE orders SET status = 'REFUNDED' WHERE id = ?", [ordRows[0].id]);
        await pool.query("DELETE FROM enrollments WHERE order_id = ? AND access_type = 'purchased'", [ordRows[0].id]);
        await recordSecurityEvent(pool, req, {
          userId: ordRows[0].user_id,
          eventType: "PAYPAL_REFUND_REVOKED",
          severity: "warn",
          details: `PayPal ${eventType} revoked purchased enrollments for order ${relatedOrderId}`,
          notifyAdmin: true
        });
      }
      return res.json({ ok: true, handled: eventType, orderId: relatedOrderId });
    }

    return res.json({ ok: true, ignored: eventType });
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

  // Free Major Topic & Session Quiz Submission (Sign-in mandatory; automatically emails results)
  router.post("/quiz-submit", writeRateLimiter, async (req, res) => {
    const pool = await requireDb(res);
    if (!pool) return;
    const uid = getSessionUserId(req);
    if (!uid) return res.status(401).json({ error: "Please sign in before taking and submitting quizzes." });

    const [uRows] = await pool.query("SELECT id, name, email FROM users WHERE id = ? LIMIT 1", [uid]);
    const user = uRows[0];
    if (!user) return res.status(401).json({ error: "Account not found. Please sign in again." });

    const {
      quizType = "topic_free",
      quizSlug = "",
      quizTitle = "",
      score = 0,
      totalQuestions = 0,
      breakdown = {},
      reviewItems = [],
      sendEmail = true
    } = req.body || {};

    const cleanSlug = sanitizeText(quizSlug, 140);
    const cleanTitle = sanitizeText(quizTitle, 255);
    const allowedType = ["topic_free", "course_session"].includes(quizType) ? quizType : "topic_free";
    const total = Math.max(1, Math.min(100, Number(totalQuestions) || 0));
    const safeScore = Math.max(0, Math.min(total, Number(score) || 0));
    if (!cleanSlug || !cleanTitle) {
      return res.status(400).json({ error: "Valid quiz identifier and title are required." });
    }

    const percent = Math.round((safeScore / total) * 100);
    const passed = percent >= 60 ? 1 : 0;

    const [[cntRow]] = await pool.query(
      "SELECT COUNT(*) AS cnt FROM quiz_attempts WHERE user_id = ? AND quiz_type = ? AND quiz_slug = ?",
      [uid, allowedType, cleanSlug]
    );
    const attemptNumber = Number(cntRow?.cnt || 0) + 1;

    await pool.query(
      `INSERT INTO quiz_attempts (user_id, quiz_type, quiz_slug, quiz_title, score, total_questions, percent, passed, attempt_number, breakdown_json)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [uid, allowedType, cleanSlug, cleanTitle, safeScore, total, percent, passed, attemptNumber, JSON.stringify(breakdown || {})]
    );

    let emailSent = false;
    if (sendEmail && user.email) {
      try {
        const mail = buildQuizResultEmail({
          name: user.name,
          topicTitle: cleanTitle,
          score: safeScore,
          totalQuestions: total,
          passed: Boolean(passed),
          breakdown,
          reviewItems: Array.isArray(reviewItems) ? reviewItems : []
        });
        const emailRes = await sendBrandedEmail(pool, {
          to: user.email,
          ...mail,
          category: "quiz_result"
        });
        emailSent = Boolean(emailRes?.sent);
      } catch (err) {
        console.warn("[Quiz Email Warning]", err?.message || err);
      }
    }

    const [qaAttemptRows] = await pool.query(
      `SELECT id, quiz_type AS quizType, quiz_slug AS quizSlug, quiz_title AS quizTitle, score,
              total_questions AS totalQuestions, percent, passed, attempt_number AS attemptNumber,
              breakdown_json AS breakdownJson, created_at AS createdAt
       FROM quiz_attempts WHERE user_id = ? ORDER BY created_at DESC LIMIT 120`,
      [uid]
    );

    return res.json({
      ok: true,
      attempt: {
        quizType: allowedType,
        quizSlug: cleanSlug,
        quizTitle: cleanTitle,
        score: safeScore,
        totalQuestions: total,
        percent,
        passed: Boolean(passed),
        attemptNumber
      },
      emailSent,
      quizAttempts: qaAttemptRows.map((r) => ({ ...r, passed: Boolean(r.passed) }))
    });
  });

  // Final Course Evaluation (30 Questions, 60% Passmark, Max 4 Attempts -> Certificate of Completion)
  router.post("/course-eval", writeRateLimiter, async (req, res) => {
    const pool = await requireDb(res);
    if (!pool) return;
    const uid = getSessionUserId(req);
    if (!uid) return res.status(401).json({ error: "Please sign in to submit the Final Course Evaluation." });

    const [uRows] = await pool.query("SELECT id, name, email FROM users WHERE id = ? LIMIT 1", [uid]);
    const user = uRows[0];
    if (!user) return res.status(401).json({ error: "Account not found. Please sign in again." });

    const {
      courseSlug = "",
      courseTitle = "",
      programmeLabel = "",
      score = 0,
      totalQuestions = 30,
      breakdown = {}
    } = req.body || {};

    if (!isValidSlug(courseSlug)) {
      return res.status(400).json({ error: "Invalid course slug." });
    }
    const cleanTitle = sanitizeText(courseTitle || courseSlug, 255);
    const cleanProgramme = sanitizeText(programmeLabel || "", 120);
    const total = Math.max(10, Math.min(60, Number(totalQuestions) || 30));
    const safeScore = Math.max(0, Math.min(total, Number(score) || 0));
    const percent = Math.round((safeScore / total) * 100);
    const passed = percent >= 60;

    const [existingCertRows] = await pool.query(
      `SELECT id, course_slug AS courseSlug, course_title AS courseTitle, programme_label AS programmeLabel,
              score, total_questions AS totalQuestions, percent, attempt_number AS attemptNumber,
              certificate_code AS certificateCode, issued_at AS issuedAt
       FROM course_certificates WHERE user_id = ? AND course_slug = ? LIMIT 1`,
      [uid, courseSlug]
    );

    const [[cntRow]] = await pool.query(
      "SELECT COUNT(*) AS cnt FROM quiz_attempts WHERE user_id = ? AND quiz_type = 'course_final' AND quiz_slug = ?",
      [uid, courseSlug]
    );
    const attemptsUsed = Number(cntRow?.cnt || 0);
    const MAX_ATTEMPTS = 4;

    if (attemptsUsed >= MAX_ATTEMPTS && !existingCertRows[0]) {
      return res.status(400).json({
        error: "You have used all 4 allowed evaluation attempts for this course. Please review the study units or contact support@nursinguganda.com for tutor reset assistance.",
        attemptsUsed,
        maxAttempts: MAX_ATTEMPTS
      });
    }

    const attemptNumber = attemptsUsed + 1;
    await pool.query(
      `INSERT INTO quiz_attempts (user_id, quiz_type, quiz_slug, quiz_title, score, total_questions, percent, passed, attempt_number, breakdown_json)
       VALUES (?, 'course_final', ?, ?, ?, ?, ?, ?, ?, ?)`,
      [uid, courseSlug, `${cleanTitle} (Final Evaluation)`, safeScore, total, percent, passed ? 1 : 0, attemptNumber, JSON.stringify(breakdown || {})]
    );

    let certificate = existingCertRows[0] || null;
    let emailSent = false;

    if (passed) {
      const yr = new Date().getFullYear();
      const certHash = crypto
        .createHash("sha256")
        .update(`${uid}:${courseSlug}:nu-cert-salt`)
        .digest("hex")
        .slice(0, 8)
        .toUpperCase();
      const certCode = existingCertRows[0]?.certificateCode || `NU-${yr}-${certHash}`;

      if (!existingCertRows[0]) {
        await pool.query(
          `INSERT INTO course_certificates (user_id, course_slug, course_title, programme_label, score, total_questions, percent, attempt_number, certificate_code)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [uid, courseSlug, cleanTitle, cleanProgramme, safeScore, total, percent, attemptNumber, certCode]
        );
      } else if (percent > Number(existingCertRows[0].percent || 0)) {
        await pool.query(
          `UPDATE course_certificates SET score = ?, percent = ?, attempt_number = ? WHERE user_id = ? AND course_slug = ?`,
          [safeScore, percent, attemptNumber, uid, courseSlug]
        );
      }

      const [updatedCertRows] = await pool.query(
        `SELECT id, course_slug AS courseSlug, course_title AS courseTitle, programme_label AS programmeLabel,
                score, total_questions AS totalQuestions, percent, attempt_number AS attemptNumber,
                certificate_code AS certificateCode, issued_at AS issuedAt
         FROM course_certificates WHERE user_id = ? AND course_slug = ? LIMIT 1`,
        [uid, courseSlug]
      );
      certificate = updatedCertRows[0] || null;

      if (user.email && certificate && !existingCertRows[0]) {
        try {
          const mail = buildCertificateEmail({
            name: user.name,
            courseTitle: cleanTitle,
            score: safeScore,
            totalQuestions: total,
            certificateCode: certificate.certificateCode,
            attemptNumber
          });
          const emailRes = await sendBrandedEmail(pool, {
            to: user.email,
            ...mail,
            category: "certificate"
          });
          emailSent = Boolean(emailRes?.sent);
        } catch (err) {
          console.warn("[Certificate Email Warning]", err?.message || err);
        }
      }
    }

    const [qaAttemptRows] = await pool.query(
      `SELECT id, quiz_type AS quizType, quiz_slug AS quizSlug, quiz_title AS quizTitle, score,
              total_questions AS totalQuestions, percent, passed, attempt_number AS attemptNumber,
              breakdown_json AS breakdownJson, created_at AS createdAt
       FROM quiz_attempts WHERE user_id = ? ORDER BY created_at DESC LIMIT 120`,
      [uid]
    );
    const [allCerts] = await pool.query(
      `SELECT id, course_slug AS courseSlug, course_title AS courseTitle, programme_label AS programmeLabel,
              score, total_questions AS totalQuestions, percent, attempt_number AS attemptNumber,
              certificate_code AS certificateCode, issued_at AS issuedAt
       FROM course_certificates WHERE user_id = ? ORDER BY issued_at DESC`,
      [uid]
    );

    return res.json({
      ok: true,
      passed,
      score: safeScore,
      totalQuestions: total,
      percent,
      attemptNumber,
      attemptsRemaining: Math.max(0, MAX_ATTEMPTS - attemptNumber),
      certificate,
      certificates: allCerts,
      quizAttempts: qaAttemptRows.map((r) => ({ ...r, passed: Boolean(r.passed) })),
      emailSent
    });
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
    if (cleanEmail !== "guest") {
      await upsertSubscriber(pool, { email: cleanEmail, source: "ebook", topicPreference: ebookSlug });
    }
    return res.json({ ok: true });
  });

  // Public Email Collector (Footer / Study Digest Opt-In)
  router.post("/subscribe", writeRateLimiter, async (req, res) => {
    const pool = await requireDb(res);
    if (!pool) return;
    const cleanEmail = normalizeEmail(req.body?.email || "");
    const cleanName = sanitizeText(req.body?.name || "", 120);
    const source = sanitizeText(req.body?.source || "footer", 64);
    const topicPreference = sanitizeText(req.body?.topicPreference || "all", 120);
    if (!cleanEmail) return res.status(400).json({ error: "Enter a valid email address." });

    await upsertSubscriber(pool, { email: cleanEmail, name: cleanName, source, topicPreference });
    const mail = buildWeeklyDigestEmail({
      name: cleanName || "Nursing Colleague",
      email: cleanEmail,
      subject: "Subscribed: Nursing Uganda Weekly Study Digest",
      topicTitle: "You're subscribed to Nursing Uganda Weekly Updates",
      summary: "Every week you'll receive high-yield UNMEB revision agendas, new referenced study eBooks, and clinical guideline updates.",
      highlights: [
        "50 students/day staggered delivery for reliable inbox arrival",
        "Zero spam — strictly Nursing & Midwifery academic updates",
        "Unsubscribe anytime with 1 click"
      ],
      ctaUrl: "https://nursinguganda.com/ebooks"
    });
    await sendBrandedEmail(pool, { to: cleanEmail, ...mail, category: "transactional" });
    return res.json({ ok: true, email: cleanEmail });
  });

  // 1-Click Unsubscribe Link
  router.get("/unsubscribe", async (req, res) => {
    const pool = await requireDb(res);
    if (!pool) return;
    const cleanEmail = normalizeEmail(req.query.email || "");
    if (cleanEmail) {
      await pool.query("UPDATE email_subscribers SET subscribed = 0 WHERE email = ?", [cleanEmail]);
    }
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.send(`<!doctype html><html><body style="font-family:Poppins,sans-serif;background:#F7F9FA;padding:48px 16px;text-align:center;">
      <div style="max-width:460px;margin:auto;background:#fff;padding:32px;border-radius:8px;border:1px solid #d1d7dc;">
        <h2 style="color:#1C1D1F;margin-top:0;">Unsubscribed</h2>
        <p style="color:#6A6F73;">${cleanEmail ? `${cleanEmail} has been unsubscribed from Nursing Uganda weekly study digests.` : "Your preference has been updated."}</p>
        <a href="https://nursinguganda.com/" style="display:inline-block;margin-top:12px;padding:10px 20px;background:#A137F2;color:#fff;text-decoration:none;border-radius:4px;font-weight:700;">Return to Nursing Uganda</a>
      </div>
    </body></html>`);
  });

  // Privacy-Preserving First-Party Page Visit Analytics
  const trackLimiter = rateLimit({ windowMs: 60 * 1000, max: 120, standardHeaders: true, legacyHeaders: false });
  router.post("/track", trackLimiter, async (req, res) => {
    const pool = await getPool().catch(() => null);
    if (!pool) return res.json({ ok: false });

    const rawPath = sanitizeText(req.body?.path || "/", 255);
    if (rawPath.startsWith("/admin")) return res.json({ ok: true });
    const cleanPath = rawPath.split("?")[0] || "/";
    const referrer = sanitizeText(req.body?.referrer || "", 240);
    const ua = String(req.headers["user-agent"] || "");
    const deviceType = /mobile|android|iphone|ipad/i.test(ua) ? "mobile" : "desktop";
    const dayKey = new Date().toISOString().slice(0, 10);
    const visitorHash = crypto
      .createHmac("sha256", sessionSecret())
      .update(`${getClientIp(req)}|${ua}|${dayKey}`)
      .digest("hex")
      .slice(0, 32);

    try {
      await pool.query(
        "INSERT INTO page_visits (path, referrer, visitor_hash, device_type, visit_date) VALUES (?, ?, ?, ?, CURDATE())",
        [cleanPath, referrer, visitorHash, deviceType]
      );
    } catch {
      // non-fatal
    }
    return res.json({ ok: true });
  });

  // Strict Owner-Only Admin Panel API
  const adminLimiter = rateLimit({ windowMs: 60 * 1000, max: 60, standardHeaders: true, legacyHeaders: false });
  router.all("/admin", adminLimiter, async (req, res) => {
    const pool = await requireDb(res);
    if (!pool) return;

    const uid = getSessionUserId(req);
    if (!uid) {
      return res.status(401).json({ error: "Sign in required." });
    }
    const [uRows] = await pool.query(
      "SELECT id, name, email, email_verified FROM users WHERE id = ?",
      [uid]
    );
    const adminUser = uRows[0];
    const expectedAdmin = getAdminEmail();

    if (!adminUser || String(adminUser.email || "").toLowerCase() !== expectedAdmin || !adminUser.email_verified) {
      await recordSecurityEvent(pool, req, {
        userId: uid,
        email: adminUser?.email || "",
        eventType: "ADMIN_ACCESS_DENIED",
        severity: "critical",
        details: `Unauthorized /api/admin access attempt by ${adminUser?.email || uid}`,
        notifyAdmin: true
      });
      return res.status(403).json({ error: "Access denied. Admin privileges are strictly restricted to the site owner." });
    }

    const section = String(req.query.section || "overview");

    if (section === "overview") {
      const [[userStats]] = await pool.query(
        "SELECT COUNT(*) AS totalUsers, SUM(email_verified) AS verifiedUsers, SUM(auth_provider = 'google') AS googleUsers FROM users"
      );
      const [[subStats]] = await pool.query(
        "SELECT COUNT(*) AS totalSubscribers, SUM(subscribed) AS activeSubscribers FROM email_subscribers"
      );
      const [[visitStats]] = await pool.query(
        `SELECT
          COUNT(*) AS totalVisits,
          COUNT(DISTINCT visitor_hash) AS uniqueVisitors,
          SUM(visit_date = CURDATE()) AS visitsToday,
          COUNT(DISTINCT IF(visit_date = CURDATE(), visitor_hash, NULL)) AS uniqueToday
         FROM page_visits`
      );
      const [[payStats]] = await pool.query(
        "SELECT COUNT(*) AS totalOrders, COALESCE(SUM(amount_usd), 0) AS totalRevenueUsd FROM orders WHERE status = 'COMPLETED'"
      );
      const [dailyTrend] = await pool.query(
        `SELECT DATE_FORMAT(visit_date, '%Y-%m-%d') AS day, COUNT(*) AS visits, COUNT(DISTINCT visitor_hash) AS visitors
         FROM page_visits
         WHERE visit_date >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
         GROUP BY visit_date
         ORDER BY visit_date ASC`
      );
      const [topPages] = await pool.query(
        `SELECT path, COUNT(*) AS visits, COUNT(DISTINCT visitor_hash) AS uniqueVisitors
         FROM page_visits
         WHERE visit_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
         GROUP BY path
         ORDER BY visits DESC
         LIMIT 12`
      );
      const emailCounts = await getTodayEmailCounts(pool);

      return res.json({
        adminEmail: adminUser.email,
        userStats,
        subStats,
        visitStats,
        payStats,
        dailyTrend,
        topPages,
        emailQuota: {
          digestToday: emailCounts.digestToday,
          digestLimit: DAILY_DIGEST_LIMIT,
          totalToday: emailCounts.totalToday,
          totalLimit: DAILY_TOTAL_EMAIL_LIMIT,
          hostingerMax: 100
        }
      });
    }

    if (section === "users") {
      const [users] = await pool.query(
        `SELECT u.id, u.name, u.email, u.programme, u.email_verified AS emailVerified, u.auth_provider AS authProvider,
                u.last_login_at AS lastLoginAt, u.last_login_ip AS lastLoginIp, u.created_at AS createdAt,
                COUNT(e.id) AS enrollmentCount
         FROM users u
         LEFT JOIN enrollments e ON e.user_id = u.id
         GROUP BY u.id
         ORDER BY u.created_at DESC
         LIMIT 200`
      );
      return res.json({ users });
    }

    if (section === "payments") {
      const [orders] = await pool.query(
        `SELECT o.id, o.paypal_order_id AS paypalOrderId, o.payer_email AS payerEmail, o.amount_usd AS amountUsd,
                o.currency, o.status, o.items_json AS itemsJson, o.created_at AS createdAt, u.email AS userEmail, u.name AS userName
         FROM orders o
         LEFT JOIN users u ON u.id = o.user_id
         ORDER BY o.created_at DESC
         LIMIT 200`
      );
      return res.json({ orders });
    }

    if (section === "emails") {
      const [subscribers] = await pool.query(
        "SELECT id, email, name, source, topic_preference AS topicPreference, subscribed, last_digest_sent_at AS lastDigestSentAt, created_at AS createdAt FROM email_subscribers ORDER BY created_at DESC LIMIT 300"
      );
      const [campaigns] = await pool.query(
        "SELECT id, subject, topic_title AS topicTitle, summary, highlights_json AS highlightsJson, cta_url AS ctaUrl, active, created_at AS createdAt FROM digest_campaigns ORDER BY id DESC LIMIT 20"
      );
      const emailCounts = await getTodayEmailCounts(pool);
      return res.json({
        subscribers,
        campaigns,
        emailQuota: {
          digestToday: emailCounts.digestToday,
          digestLimit: DAILY_DIGEST_LIMIT,
          totalToday: emailCounts.totalToday,
          totalLimit: DAILY_TOTAL_EMAIL_LIMIT
        }
      });
    }

    if (section === "campaign" && req.method === "POST") {
      const subject = sanitizeText(req.body?.subject || "", 200);
      const topicTitle = sanitizeText(req.body?.topicTitle || "", 200);
      const summary = sanitizeText(req.body?.summary || "", 1000);
      const ctaUrl = sanitizeText(req.body?.ctaUrl || "https://nursinguganda.com/courses", 255);
      const highlights = Array.isArray(req.body?.highlights)
        ? req.body.highlights.map((h) => sanitizeText(h, 200)).filter(Boolean).slice(0, 6)
        : [];
      if (!subject || !topicTitle || !summary) {
        return res.status(400).json({ error: "Subject, topic title, and summary are required." });
      }
      await pool.query("UPDATE digest_campaigns SET active = 0");
      const [ins] = await pool.query(
        "INSERT INTO digest_campaigns (subject, topic_title, summary, highlights_json, cta_url, active) VALUES (?, ?, ?, ?, ?, 1)",
        [subject, topicTitle, summary, JSON.stringify(highlights), ctaUrl]
      );
      return res.json({ ok: true, id: ins.insertId });
    }

    if (section === "send-digest" && req.method === "POST") {
      const result = await runDailyDigestBatch(pool);
      await recordSecurityEvent(pool, req, {
        userId: adminUser.id,
        email: adminUser.email,
        eventType: "ADMIN_DIGEST_BATCH",
        severity: "info",
        details: `Manual digest batch run: sent=${result.sent}, skipped=${result.skipped}, remaining=${result.remainingDigestQuota}`
      });
      return res.json(result);
    }

    if (section === "security") {
      const [events] = await pool.query(
        "SELECT id, user_id AS userId, email, event_type AS eventType, severity, ip_address AS ipAddress, details, alert_sent AS alertSent, created_at AS createdAt FROM security_events ORDER BY created_at DESC LIMIT 150"
      );
      return res.json({ events });
    }

    return res.status(400).json({ error: "Unknown admin section." });
  });

  // Daily Automated Weekly-Digest Batch Scheduler (50/day safe under Hostinger 100/day cap)
  if (cron && !global.__nuDigestCronStarted) {
    global.__nuDigestCronStarted = true;
    cron.schedule("0 5 * * *", async () => {
      try {
        const pool = await getPool();
        if (pool) {
          const res = await runDailyDigestBatch(pool);
          console.info("[Digest Cron]", res);
        }
      } catch (err) {
        console.error("[Digest Cron Error]", err?.message || err);
      }
    });
  }

  return router;
}

module.exports = { createApiRouter };
