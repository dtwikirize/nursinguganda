const crypto = require("node:crypto");
const fs = require("node:fs");
const express = require("express");

let mysql = null;
try {
  mysql = require("mysql2/promise");
} catch {
  mysql = null;
}

const COOKIE_NAME = "nu_session";
const SCHEMA_SQL = [
  `CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(190) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    programme VARCHAR(120) DEFAULT 'certificate-in-nursing',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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

let _pool = null;
let _schemaReady = false;

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
    _schemaReady = true;
  }
  return _pool;
}

function sessionSecret() {
  return (
    process.env.SESSION_SECRET ||
    process.env.DB_PASSWORD ||
    process.env.MYSQL_PASSWORD ||
    "nursing-uganda-dev-session-key"
  );
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password, stored) {
  const [salt, origHex] = String(stored || "").split(":");
  if (!salt || !origHex) return false;
  const derived = crypto.scryptSync(password, salt, 64);
  const orig = Buffer.from(origHex, "hex");
  return derived.length === orig.length && crypto.timingSafeEqual(derived, orig);
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
    map[part.slice(0, idx).trim()] = decodeURIComponent(part.slice(idx + 1).trim());
  }
  return map;
}

function setSessionCookie(res, userId) {
  const token = signToken({ uid: userId, exp: Date.now() + 1000 * 60 * 60 * 24 * 14 });
  const isHttps = process.env.NODE_ENV === "production";
  const attrs = [
    `${COOKIE_NAME}=${encodeURIComponent(token)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${60 * 60 * 24 * 14}`,
    ...(isHttps ? ["Secure"] : [])
  ];
  res.setHeader("Set-Cookie", attrs.join("; "));
}

function clearSessionCookie(res) {
  res.setHeader("Set-Cookie", `${COOKIE_NAME}=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax`);
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

function createApiRouter() {
  const router = express.Router();
  router.use((_req, res, next) => {
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, private");
    next();
  });
  router.use(express.json({ limit: "1mb" }));

  router.get("/config", async (_req, res) => {
    const cfg = dbConfig();
    res.json({
      paypalClientId: process.env.PAYPAL_CLIENT_ID || "sb",
      paypalMode: process.env.PAYPAL_MODE || "sandbox",
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
    } catch (err) {
      res.status(503).json({ error: err.message || "Database connection failed.", __noDb: true });
      return null;
    }
  }

  // Auth: me / register / login / logout
  router.all("/auth", async (req, res) => {
    const pool = await requireDb(res);
    if (!pool) return;

    const action = req.query.action || "";

    if (action === "me") {
      const uid = getSessionUserId(req);
      if (!uid) return res.json({ user: null, enrollments: [], progress: {} });
      const [rows] = await pool.query("SELECT id, name, email, programme FROM users WHERE id = ?", [uid]);
      const user = rows[0];
      if (!user) {
        clearSessionCookie(res);
        return res.json({ user: null, enrollments: [], progress: {} });
      }
      user.initials = initialsOf(user.name);
      const [enRows] = await pool.query("SELECT course_slug FROM enrollments WHERE user_id = ?", [uid]);
      const [prRows] = await pool.query("SELECT course_slug, lesson_slug FROM course_progress WHERE user_id = ? AND completed = 1", [uid]);
      const progress = {};
      for (const r of prRows) {
        progress[r.course_slug] = progress[r.course_slug] || [];
        progress[r.course_slug].push(r.lesson_slug);
      }
      return res.json({ user, enrollments: enRows.map((r) => r.course_slug), progress });
    }

    if (action === "register") {
      const { name = "", email = "", password = "", programme = "certificate-in-nursing" } = req.body || {};
      const cleanEmail = String(email).trim().toLowerCase();
      const cleanName = String(name).trim();
      if (!cleanName || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail) || String(password).length < 6) {
        return res.status(400).json({ error: "Enter a valid name, email, and password (6+ characters)." });
      }
      const [existing] = await pool.query("SELECT id FROM users WHERE email = ?", [cleanEmail]);
      if (existing.length > 0) {
        return res.status(409).json({ error: "An account with this email already exists." });
      }
      const hash = hashPassword(String(password));
      const [result] = await pool.query(
        "INSERT INTO users (name, email, password_hash, programme) VALUES (?, ?, ?, ?)",
        [cleanName, cleanEmail, hash, String(programme)]
      );
      const uid = result.insertId;
      setSessionCookie(res, uid);
      return res.json({
        user: { id: uid, name: cleanName, email: cleanEmail, programme, initials: initialsOf(cleanName) },
        enrollments: [],
        progress: {}
      });
    }

    if (action === "login") {
      const { email = "", password = "" } = req.body || {};
      const cleanEmail = String(email).trim().toLowerCase();
      const [rows] = await pool.query("SELECT id, name, email, password_hash, programme FROM users WHERE email = ?", [cleanEmail]);
      const user = rows[0];
      if (!user || !verifyPassword(String(password), user.password_hash)) {
        return res.status(401).json({ error: "Invalid email or password." });
      }
      setSessionCookie(res, user.id);
      const [enRows] = await pool.query("SELECT course_slug FROM enrollments WHERE user_id = ?", [user.id]);
      const [prRows] = await pool.query("SELECT course_slug, lesson_slug FROM course_progress WHERE user_id = ? AND completed = 1", [user.id]);
      const progress = {};
      for (const r of prRows) {
        progress[r.course_slug] = progress[r.course_slug] || [];
        progress[r.course_slug].push(r.lesson_slug);
      }
      return res.json({
        user: { id: user.id, name: user.name, email: user.email, programme: user.programme, initials: initialsOf(user.name) },
        enrollments: enRows.map((r) => r.course_slug),
        progress
      });
    }

    if (action === "logout") {
      clearSessionCookie(res);
      return res.json({ ok: true });
    }

    return res.status(400).json({ error: "Unknown auth action." });
  });

  // Free Enrollments
  router.post("/enrollments", async (req, res) => {
    const pool = await requireDb(res);
    if (!pool) return;
    const uid = getSessionUserId(req);
    if (!uid) return res.status(401).json({ error: "Please sign in first." });

    const courseSlug = String(req.body?.courseSlug || "").trim();
    if (!courseSlug) return res.status(400).json({ error: "Missing courseSlug." });

    await pool.query("INSERT IGNORE INTO enrollments (user_id, course_slug, access_type) VALUES (?, ?, 'free')", [uid, courseSlug]);
    const [enRows] = await pool.query("SELECT course_slug FROM enrollments WHERE user_id = ?", [uid]);
    return res.json({ enrollments: enRows.map((r) => r.course_slug) });
  });

  // PayPal Server-Side Verification & Capture
  router.post("/paypal-capture", async (req, res) => {
    const pool = await requireDb(res);
    if (!pool) return;
    const uid = getSessionUserId(req);
    if (!uid) return res.status(401).json({ error: "Please sign in first." });

    const { orderId = "", items = [], payerEmail = "" } = req.body || {};
    if (!orderId || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Missing PayPal orderId or items." });
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

    const orderRes = await fetch(`${baseUrl}/v2/checkout/orders/${encodeURIComponent(orderId)}`, {
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
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      const [ordRes] = await conn.query(
        "INSERT IGNORE INTO orders (user_id, paypal_order_id, payer_email, amount_usd, status, items_json) VALUES (?, ?, ?, ?, 'COMPLETED', ?)",
        [uid, orderId, String(payerEmail), paidAmount, JSON.stringify(items)]
      );
      const dbOrderId = ordRes.insertId || null;
      for (const item of items) {
        const slugs = Array.isArray(item.courseSlugs) ? item.courseSlugs : [item.slug];
        for (const s of slugs) {
          if (s) {
            await conn.query(
              "INSERT IGNORE INTO enrollments (user_id, course_slug, order_id, access_type) VALUES (?, ?, ?, 'purchased')",
              [uid, s, dbOrderId]
            );
          }
        }
      }
      await conn.commit();
    } catch (err) {
      await conn.rollback();
      return res.status(500).json({ error: "Failed to save enrollment." });
    } finally {
      conn.release();
    }

    const [enRows] = await pool.query("SELECT course_slug FROM enrollments WHERE user_id = ?", [uid]);
    return res.json({ orderId, enrollments: enRows.map((r) => r.course_slug) });
  });

  // Course Progress
  router.post("/progress", async (req, res) => {
    const pool = await requireDb(res);
    if (!pool) return;
    const uid = getSessionUserId(req);
    if (!uid) return res.status(401).json({ error: "Please sign in first." });

    const { courseSlug = "", lessonSlug = "", completed = true } = req.body || {};
    if (!courseSlug || !lessonSlug) {
      return res.status(400).json({ error: "Missing courseSlug or lessonSlug." });
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
  router.all("/qa", async (req, res) => {
    const pool = await requireDb(res);
    if (!pool) return;

    if (req.method === "GET") {
      const courseSlug = String(req.query.course || "").trim();
      if (!courseSlug) return res.json({ questions: [] });
      const [rows] = await pool.query(
        "SELECT id, course_slug AS courseSlug, user_name AS userName, title, body, created_at AS createdAt FROM course_qa WHERE course_slug = ? ORDER BY created_at DESC LIMIT 50",
        [courseSlug]
      );
      return res.json({ questions: rows });
    }

    const uid = getSessionUserId(req);
    if (!uid) return res.status(401).json({ error: "Please sign in to post a question." });
    const { courseSlug = "", title = "", body = "" } = req.body || {};
    if (!courseSlug || !String(title).trim() || !String(body).trim()) {
      return res.status(400).json({ error: "Question title and details are required." });
    }
    const [uRows] = await pool.query("SELECT name FROM users WHERE id = ?", [uid]);
    const userName = uRows[0]?.name || "Nursing Student";
    await pool.query(
      "INSERT INTO course_qa (course_slug, user_id, user_name, title, body) VALUES (?, ?, ?, ?, ?)",
      [courseSlug, uid, userName, String(title).trim(), String(body).trim()]
    );
    const [rows] = await pool.query(
      "SELECT id, course_slug AS courseSlug, user_name AS userName, title, body, created_at AS createdAt FROM course_qa WHERE course_slug = ? ORDER BY created_at DESC LIMIT 50",
      [courseSlug]
    );
    return res.json({ questions: rows });
  });

  // Free eBook Download Lead Tracking
  router.post("/ebooks", async (req, res) => {
    const pool = await requireDb(res);
    if (!pool) return;
    const { ebookSlug = "", email = "guest" } = req.body || {};
    if (!ebookSlug) return res.status(400).json({ error: "Missing ebookSlug." });
    await pool.query("INSERT INTO ebook_downloads (ebook_slug, email) VALUES (?, ?)", [ebookSlug, email || "guest"]);
    return res.json({ ok: true });
  });

  return router;
}

module.exports = { createApiRouter };
