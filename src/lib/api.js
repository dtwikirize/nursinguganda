/**
 * Hostinger PHP + MySQL API client with graceful local-dev fallback.
 * On Hostinger production, requests hit /api/*.php backed by MySQL.
 * During local `vite dev` without PHP, state falls back to localStorage
 * so every user flow (auth, cart, PayPal test mode, progress, Q&A) works end-to-end.
 */

const LS_KEYS = {
  user: "nu.auth.user",
  enrollments: "nu.enrollments",
  progress: "nu.progress",
  notes: "nu.notes",
  qa: "nu.qa",
  ebookLeads: "nu.ebookLeads"
};

function readLS(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeLS(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore storage quota errors
  }
}

async function apiFetch(endpoint, options = {}) {
  try {
    const res = await fetch(endpoint, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {})
      },
      ...options
    });
    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return import.meta.env.DEV ? { __noPhp: true } : { ok: false, error: `Unexpected server response (${res.status}).` };
    }
    const data = await res.json();
    if (data?.__noDb) {
      return import.meta.env.DEV ? { __noPhp: true } : { ok: false, error: data.error || "Database service unavailable." };
    }
    if (!res.ok) {
      return { ok: false, error: data.error || `Request failed (${res.status})`, status: res.status };
    }
    return { ok: true, ...data };
  } catch {
    return import.meta.env.DEV ? { __noPhp: true } : { ok: false, error: "Network error. Please try again." };
  }
}

export async function fetchSession() {
  const res = await apiFetch("/api/auth?action=me");
  if (!res.__noPhp) return res;
  return {
    ok: true,
    user: readLS(LS_KEYS.user, null),
    enrollments: readLS(LS_KEYS.enrollments, []),
    progress: readLS(LS_KEYS.progress, {})
  };
}

export async function loginUser({ email, password }) {
  const res = await apiFetch("/api/auth?action=login", {
    method: "POST",
    body: JSON.stringify({ email, password })
  });
  if (!res.__noPhp) return res;

  if (!email || !password) return { ok: false, error: "Email and password are required." };
  const cleanEmail = email.trim().toLowerCase();
  const name = cleanEmail.split("@")[0].replace(/[._-]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const user = {
    id: `local-${cleanEmail}`,
    email: cleanEmail,
    name,
    emailVerified: true,
    initials: name.slice(0, 2).toUpperCase(),
    programme: "Diploma in Nursing (Direct)"
  };
  writeLS(LS_KEYS.user, user);
  return {
    ok: true,
    user,
    enrollments: readLS(LS_KEYS.enrollments, []),
    progress: readLS(LS_KEYS.progress, {})
  };
}

export async function registerUser({ name, email, password, programme }) {
  const res = await apiFetch("/api/auth?action=register", {
    method: "POST",
    body: JSON.stringify({ name, email, password, programme })
  });
  if (!res.__noPhp) return res;

  if (!name?.trim() || !email?.trim() || (password || "").length < 8) {
    return { ok: false, error: "Please enter name, valid email, and a strong password (8+ characters with a number/symbol)." };
  }
  const cleanEmail = email.trim().toLowerCase();
  const cleanName = name.trim();
  const user = {
    id: `local-${cleanEmail}`,
    email: cleanEmail,
    name: cleanName,
    emailVerified: false,
    initials: cleanName.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase(),
    programme: programme || "Certificate in Nursing"
  };
  writeLS(LS_KEYS.user, user);
  return { ok: true, user, enrollments: [], progress: {} };
}

export async function loginWithGoogle(credential) {
  return apiFetch("/api/auth?action=google", {
    method: "POST",
    body: JSON.stringify({ credential })
  });
}

export async function verifyEmailCode(code) {
  return apiFetch("/api/auth?action=verify-email", {
    method: "POST",
    body: JSON.stringify({ code })
  });
}

export async function resendVerificationCode() {
  return apiFetch("/api/auth?action=resend-verification", {
    method: "POST"
  });
}

export async function fetchSecurityEvents() {
  return apiFetch("/api/auth?action=security-events");
}

export async function logoutUser() {
  const res = await apiFetch("/api/auth?action=logout", { method: "POST" });
  if (!res.__noPhp) return res;
  localStorage.removeItem(LS_KEYS.user);
  return { ok: true };
}

export async function enrollFreeCourse(courseSlug) {
  const res = await apiFetch("/api/enrollments", {
    method: "POST",
    body: JSON.stringify({ action: "enroll_free", courseSlug })
  });
  if (!res.__noPhp) return res;

  const list = readLS(LS_KEYS.enrollments, []);
  if (!list.includes(courseSlug)) {
    list.push(courseSlug);
    writeLS(LS_KEYS.enrollments, list);
  }
  return { ok: true, enrollments: list };
}

export async function verifyPayPalOrder({ orderId, items, totalUsd, payerEmail }) {
  const res = await apiFetch("/api/paypal-capture", {
    method: "POST",
    body: JSON.stringify({ orderId, items, totalUsd, payerEmail })
  });
  if (!res.__noPhp) return res;

  const list = readLS(LS_KEYS.enrollments, []);
  for (const item of items || []) {
    if (item.slug && !list.includes(item.slug)) list.push(item.slug);
    if (Array.isArray(item.courseSlugs)) {
      for (const s of item.courseSlugs) {
        if (!list.includes(s)) list.push(s);
      }
    }
  }
  writeLS(LS_KEYS.enrollments, list);
  return { ok: true, orderId, enrollments: list };
}

export async function toggleLessonProgress(courseSlug, lessonSlug, completed) {
  const res = await apiFetch("/api/progress", {
    method: "POST",
    body: JSON.stringify({ courseSlug, lessonSlug, completed })
  });
  if (!res.__noPhp) return res;

  const progress = readLS(LS_KEYS.progress, {});
  const cur = new Set(progress[courseSlug] || []);
  if (completed) cur.add(lessonSlug);
  else cur.delete(lessonSlug);
  progress[courseSlug] = [...cur];
  writeLS(LS_KEYS.progress, progress);
  return { ok: true, progress };
}

export async function fetchCourseQA(courseSlug) {
  const res = await apiFetch(`/api/qa?course=${encodeURIComponent(courseSlug)}`);
  if (!res.__noPhp) return res;

  const all = readLS(LS_KEYS.qa, {});
  return { ok: true, questions: all[courseSlug] || [] };
}

export async function postCourseQuestion({ courseSlug, title, body, user }) {
  const res = await apiFetch("/api/qa", {
    method: "POST",
    body: JSON.stringify({ action: "ask", courseSlug, title, body })
  });
  if (!res.__noPhp) return res;

  const all = readLS(LS_KEYS.qa, {});
  const list = all[courseSlug] || [];
  const item = {
    id: `q-${Date.now()}`,
    courseSlug,
    userName: user?.name || "Nursing Student",
    userInitials: user?.initials || "NS",
    title: title.trim(),
    body: body.trim(),
    answers: [],
    createdAt: new Date().toISOString()
  };
  list.unshift(item);
  all[courseSlug] = list;
  writeLS(LS_KEYS.qa, all);
  return { ok: true, question: item, questions: list };
}

export async function recordEbookDownload({ ebookSlug, email }) {
  const res = await apiFetch("/api/ebooks", {
    method: "POST",
    body: JSON.stringify({ ebookSlug, email })
  });
  if (!res.__noPhp) return res;

  const leads = readLS(LS_KEYS.ebookLeads, []);
  leads.push({ ebookSlug, email: email || "guest", createdAt: new Date().toISOString() });
  writeLS(LS_KEYS.ebookLeads, leads);
  return { ok: true };
}

export async function fetchRuntimeConfig() {
  try {
    const res = await fetch("/api/config");
    if (res.ok) return await res.json();
  } catch {}
  return null;
}

export function getPayPalConfig() {
  return {
    clientId: window.__NU_PAYPAL_CLIENT_ID || import.meta.env.VITE_PAYPAL_CLIENT_ID || "sb",
    currency: "USD"
  };
}
