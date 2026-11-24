/**
 * Branded HTML Email Templates for Nursing Uganda
 * Clean modern responsive layouts inspired by Inverted Pyramid, Hybrid & F-Pattern systems:
 *  - Obsidian Ink: #0F172A / #141413
 *  - Royal Purple: #7C3AED / #A137F2
 *  - Warm Paper Canvas: #F3F4F6
 */

const { getMonthlyNewsletterForDate } = require("./monthly-newsletters");

const SITE_URL = "https://nursinguganda.com";
const ICON_URL = `${SITE_URL}/assets/images/brand/nu-variant-3-192.png`;
const HERO_PHOTO_URL = `${SITE_URL}/assets/images/udemy/hero-banner.webp`;
const MOCK_PHOTO_URL = `${SITE_URL}/assets/images/udemy/cat-research.webp`;
const CLINICAL_PHOTO_URL = `${SITE_URL}/assets/images/udemy/cover-foundations-vitals.webp`;
const ANATOMY_PHOTO_URL = `${SITE_URL}/assets/images/udemy/cover-anatomy-cardio.webp`;

function escapeHtml(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildFPatternRows(rows = []) {
  if (!rows.length) return "";
  const trs = rows
    .map(
      (r) => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #F1F5F9;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
            <tr>
              <td width="116" valign="top" style="width:116px;padding-right:14px;">
                <a href="${escapeHtml(r.url || SITE_URL)}" style="display:block;text-decoration:none;">
                  <img src="${escapeHtml(r.image || HERO_PHOTO_URL)}" alt="${escapeHtml(r.title)}" width="116" height="72" style="width:116px;height:72px;object-fit:cover;border-radius:8px;display:block;border:1px solid #E2E8F0;" />
                </a>
              </td>
              <td valign="top">
                <div style="font-size:14px;font-weight:700;color:#0F172A;line-height:1.3;margin-bottom:4px;">${escapeHtml(r.title)}</div>
                <div style="font-size:13px;color:#475569;line-height:1.45;margin-bottom:5px;">${escapeHtml(r.desc)}</div>
                <a href="${escapeHtml(r.url || SITE_URL)}" style="font-size:12px;font-weight:700;color:#7C3AED;text-decoration:none;">${escapeHtml(r.cta || "Open Resource")} &rarr;</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>`
    )
    .join("");
  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:18px 0 6px;">${trs}</table>`;
}

function buildTwoColumnCards(cards = []) {
  if (!cards.length) return "";
  const pair = cards.slice(0, 2);
  const cols = pair
    .map(
      (c, idx) => `
      <td width="50%" valign="top" style="width:50%;${idx === 0 ? "padding-right:7px;" : "padding-left:7px;"}">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:10px;overflow:hidden;">
          <tr>
            <td>
              <img src="${escapeHtml(c.image || CLINICAL_PHOTO_URL)}" alt="${escapeHtml(c.title)}" width="256" height="120" style="width:100%;height:112px;object-fit:cover;display:block;" />
            </td>
          </tr>
          <tr>
            <td style="padding:12px 13px;">
              <div style="font-size:13.5px;font-weight:700;color:#0F172A;margin-bottom:4px;line-height:1.3;">${escapeHtml(c.title)}</div>
              <div style="font-size:12px;color:#475569;line-height:1.45;margin-bottom:8px;">${escapeHtml(c.desc)}</div>
              <a href="${escapeHtml(c.url || SITE_URL)}" style="display:inline-block;font-size:12px;font-weight:700;color:#7C3AED;text-decoration:none;">${escapeHtml(c.cta || "Explore")} &rarr;</a>
            </td>
          </tr>
        </table>
      </td>`
    )
    .join("");
  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:18px 0 8px;"><tr>${cols}</tr></table>`;
}

function buildCourseProgressCard({ courseTitle, courseThumb, pct = 0, completedCount = 0, totalLessons = 0 }) {
  const safePct = Math.max(0, Math.min(100, Number(pct || 0)));
  return `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#F8FAFC;border:1px solid #CBD5E1;border-radius:10px;margin:16px 0;">
      <tr>
        <td style="padding:14px 16px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
            <tr>
              ${
                courseThumb
                  ? `<td width="86" valign="middle" style="width:86px;padding-right:14px;">
                      <img src="${escapeHtml(courseThumb)}" alt="${escapeHtml(courseTitle)}" width="86" height="58" style="width:86px;height:58px;object-fit:cover;border-radius:7px;display:block;border:1px solid #E2E8F0;" />
                    </td>`
                  : ""
              }
              <td valign="middle">
                <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:#7C3AED;margin-bottom:3px;">Active Course Progress</div>
                <div style="font-size:15px;font-weight:700;color:#0F172A;line-height:1.3;margin-bottom:6px;">${escapeHtml(courseTitle)}</div>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#E2E8F0;border-radius:99px;height:8px;overflow:hidden;">
                  <tr>
                    <td width="${Math.max(4, safePct)}%" style="background:#7C3AED;height:8px;border-radius:99px;font-size:0;line-height:0;">&nbsp;</td>
                    <td style="font-size:0;line-height:0;">&nbsp;</td>
                  </tr>
                </table>
                <div style="font-size:12px;color:#475569;margin-top:6px;">
                  <strong>${safePct}% completed</strong> (${Number(completedCount)} of ${Number(totalLessons)} topics finished)
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;
}

function wrapBrandedLayout({
  preheader = "",
  badge = "NURSING UGANDA",
  heroImageUrl = "",
  heroAlt = "Nursing Uganda Study Platform",
  title,
  bodyHtml,
  secondaryHtml = "",
  ctaLabel,
  ctaUrl,
  secondaryCtaLabel = "",
  secondaryCtaUrl = "",
  footerNote = ""
}) {
  const safeBadge = escapeHtml(badge);
  const safeTitle = escapeHtml(title);
  const safePreheader = escapeHtml(preheader);

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${safeTitle}</title>
</head>
<body style="margin:0;padding:0;background-color:#F1F5F9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;color:#0F172A;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${safePreheader}</div>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#F1F5F9;padding:26px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;background-color:#FFFFFF;border:1px solid #E2E8F0;border-radius:14px;overflow:hidden;">
          <!-- Clean Light Top Brand Bar (Matches Enlarged NU Identity) -->
          <tr>
            <td style="background-color:#FFFFFF;padding:18px 24px;border-bottom:1px solid #F1F5F9;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td valign="middle" style="width:44px;">
                    <img src="${ICON_URL}" alt="NU" width="40" height="40" style="display:block;border-radius:9px;" />
                  </td>
                  <td valign="middle" style="padding-left:10px;">
                    <div style="font-size:18px;font-weight:800;color:#0F2942;line-height:1.05;letter-spacing:-0.02em;">Nursing</div>
                    <div style="font-size:10px;font-weight:700;color:#7C3AED;letter-spacing:0.28em;margin-top:2px;">UGANDA</div>
                  </td>
                  <td align="right" valign="middle">
                    <span style="display:inline-block;background-color:#F3E8FF;color:#6D28D9;border:1px solid #E9D5FF;font-size:10px;font-weight:800;padding:4px 10px;border-radius:99px;letter-spacing:0.05em;">${safeBadge}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Hero Media Banner (Inverted Pyramid / Hybrid Visual Anchor) -->
          ${
            heroImageUrl
              ? `<tr>
                  <td style="padding:18px 24px 0;">
                    <img src="${escapeHtml(heroImageUrl)}" alt="${escapeHtml(heroAlt)}" width="552" style="width:100%;max-height:210px;object-fit:cover;border-radius:10px;display:block;border:1px solid #E2E8F0;" />
                  </td>
                </tr>`
              : ""
          }

          <!-- Primary Body (Inverted Pyramid: H1 + Copy + Primary CTA) -->
          <tr>
            <td style="padding:24px 24px 18px;">
              <h1 style="margin:0 0 12px;font-size:23px;line-height:1.25;color:#0F172A;font-weight:800;letter-spacing:-0.02em;">${safeTitle}</h1>
              <div style="font-size:15px;line-height:1.6;color:#334155;">
                ${bodyHtml}
              </div>
              ${
                ctaLabel && ctaUrl
                  ? `<table role="presentation" cellspacing="0" cellpadding="0" style="margin:22px 0 6px;">
                      <tr>
                        <td style="border-radius:8px;background-color:#7C3AED;">
                          <a href="${escapeHtml(ctaUrl)}" style="display:inline-block;background-color:#7C3AED;color:#FFFFFF;text-decoration:none;font-weight:700;font-size:14px;padding:13px 22px;border-radius:8px;">${escapeHtml(ctaLabel)} &rarr;</a>
                        </td>
                        ${
                          secondaryCtaLabel && secondaryCtaUrl
                            ? `<td style="padding-left:10px;">
                                <a href="${escapeHtml(secondaryCtaUrl)}" style="display:inline-block;background-color:#F8FAFC;color:#0F172A;border:1px solid #CBD5E1;text-decoration:none;font-weight:700;font-size:13px;padding:12px 16px;border-radius:8px;">${escapeHtml(secondaryCtaLabel)}</a>
                              </td>`
                            : ""
                        }
                      </tr>
                    </table>`
                  : ""
              }
            </td>
          </tr>

          <!-- Secondary Hybrid Content Module (F-Pattern / Two-Column Cards) -->
          ${
            secondaryHtml
              ? `<tr>
                  <td style="padding:4px 24px 22px;border-top:1px solid #F1F5F9;">
                    ${secondaryHtml}
                  </td>
                </tr>`
              : ""
          }

          <!-- Clean Modern Footer (Quick Hubs + Email Only + Unsubscribe) -->
          <tr>
            <td style="background-color:#0F172A;padding:20px 24px;font-size:12px;line-height:1.65;color:#CBD5E1;">
              <div style="margin-bottom:8px;">
                <a href="${SITE_URL}/courses" style="color:#E2E8F0;text-decoration:none;font-weight:600;">Courses</a> &nbsp;&middot;&nbsp;
                <a href="${SITE_URL}/mock-exams" style="color:#E2E8F0;text-decoration:none;font-weight:600;">UNMEB Papers</a> &nbsp;&middot;&nbsp;
                <a href="${SITE_URL}/ebooks" style="color:#E2E8F0;text-decoration:none;font-weight:600;">Free eBooks</a> &nbsp;&middot;&nbsp;
                <a href="${SITE_URL}/clinical-tools" style="color:#E2E8F0;text-decoration:none;font-weight:600;">Calculators</a>
              </div>
              <p style="margin:0 0 6px;color:#94A3B8;"><strong style="color:#FFFFFF;">Nursing Uganda</strong> &middot; UNMEB &amp; Uganda MoH Aligned Study Platform</p>
              <p style="margin:0;color:#94A3B8;">
                ${footerNote || `Questions? Write to <a href="mailto:support@nursinguganda.com" style="color:#C084FC;">support@nursinguganda.com</a> or visit <a href="${SITE_URL}" style="color:#C084FC;">nursinguganda.com</a>.`}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function buildWelcomeVerificationEmail({ name, code, authProvider = "password" }) {
  const safeName = escapeHtml(name || "Nursing Student");
  const isGoogle = authProvider === "google";

  if (isGoogle) {
    const secondaryHtml = buildTwoColumnCards([
      {
        image: ANATOMY_PHOTO_URL,
        title: "83 Study Units (50% Off)",
        desc: "Anatomy, Midwifery, Pharmacology & Ward Skills with free topic previews.",
        cta: "Browse Courses",
        url: `${SITE_URL}/courses`
      },
      {
        image: MOCK_PHOTO_URL,
        title: "109+ UNMEB Past Papers",
        desc: "Practice Section A, B & C papers with marking guides & PDF export.",
        cta: "Open Exam Bank",
        url: `${SITE_URL}/mock-exams`
      }
    ]);
    const html = wrapBrandedLayout({
      preheader: "Welcome to Nursing Uganda — your student dashboard is ready.",
      badge: "WELCOME",
      heroImageUrl: HERO_PHOTO_URL,
      heroAlt: "Nursing Uganda student studying",
      title: `Welcome to Nursing Uganda, ${safeName}!`,
      bodyHtml: `
        <p style="margin:0 0 12px;">Your student account is verified and ready across <strong>83 Nursing &amp; Midwifery courses</strong>, <strong>109+ UNMEB past papers</strong>, and clinical revision tools.</p>
      `,
      secondaryHtml,
      ctaLabel: "Open My Learning Dashboard",
      ctaUrl: `${SITE_URL}/my-learning`
    });
    const text = `Welcome to Nursing Uganda, ${name}!\n\nYour Google account is linked and verified. Open your Learner Dashboard at ${SITE_URL}/my-learning.`;
    return { subject: "Welcome to Nursing Uganda — Your Student Account is Ready", html, text };
  }

  const safeCode = escapeHtml(code);
  const html = wrapBrandedLayout({
    preheader: `Your Nursing Uganda verification code is ${safeCode}`,
    badge: "CONFIRM EMAIL",
    title: `Confirm your email, ${safeName}`,
    bodyHtml: `
      <p style="margin:0 0 14px;">Thank you for joining <strong>Nursing Uganda</strong>! Enter this 6-digit security code to verify your email address and unlock saved progress &amp; certificates:</p>
      <div style="margin:18px 0;padding:18px;background-color:#FAF5FF;border:1.5px dashed #7C3AED;border-radius:10px;text-align:center;">
        <span style="font-size:32px;font-weight:800;letter-spacing:8px;color:#7C3AED;">${safeCode}</span>
      </div>
      <p style="margin:0;font-size:13px;color:#64748B;">This code expires in <strong>15 minutes</strong>. Never share this code with anyone.</p>
    `,
    ctaLabel: "Verify Email Now",
    ctaUrl: `${SITE_URL}/login?verify=1`
  });
  const text = `Welcome to Nursing Uganda, ${name}!\n\nYour 6-digit verification code is: ${code}\nIt expires in 15 minutes.\nVerify at: ${SITE_URL}/login?verify=1`;
  return { subject: `Confirm your Nursing Uganda email (Code: ${code})`, html, text };
}

function buildSecurityAlertEmail({ eventType, details, ipAddress }) {
  const safeType = escapeHtml(String(eventType || "").replace(/_/g, " "));
  const safeDetails = escapeHtml(details);
  const safeIp = escapeHtml(ipAddress);
  const html = wrapBrandedLayout({
    preheader: `Security alert on your Nursing Uganda account: ${safeType}`,
    badge: "SECURITY ALERT",
    title: "Account Security Notice",
    bodyHtml: `
      <p style="margin:0 0 14px;">Our security monitor detected the following event on your Nursing Uganda account:</p>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="8" style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:8px;font-size:13px;">
        <tr><td style="width:120px;font-weight:700;color:#0F172A;">Event:</td><td>${safeType}</td></tr>
        <tr><td style="font-weight:700;color:#0F172A;">Details:</td><td>${safeDetails}</td></tr>
        <tr><td style="font-weight:700;color:#0F172A;">IP Address:</td><td>${safeIp}</td></tr>
        <tr><td style="font-weight:700;color:#0F172A;">Time (UTC):</td><td>${new Date().toUTCString()}</td></tr>
      </table>
      <p style="margin:14px 0 0;font-size:13px;color:#64748B;">If this was you, no action is needed. If you do not recognize this activity, email <a href="mailto:support@nursinguganda.com" style="color:#7C3AED;">support@nursinguganda.com</a> immediately.</p>
    `,
    ctaLabel: "Review My Account",
    ctaUrl: `${SITE_URL}/my-learning`
  });
  const text = `Nursing Uganda Security Alert\n\nEvent: ${eventType}\nDetails: ${details}\nIP: ${ipAddress}\nTime: ${new Date().toUTCString()}`;
  return { subject: `[Nursing Uganda Security] ${String(eventType).replace(/_/g, " ")}`, html, text };
}

function buildPaymentReceiptEmail({ name, orderId, amountUsd, items = [] }) {
  const safeName = escapeHtml(name || "Nursing Student");
  const listHtml = items
    .map((it) => `<li style="margin-bottom:6px;"><strong>${escapeHtml(it.title || it.slug)}</strong></li>`)
    .join("");
  const html = wrapBrandedLayout({
    preheader: `Payment confirmed ($${Number(amountUsd).toFixed(2)}) — your study units are unlocked!`,
    badge: "PAYMENT CONFIRMED",
    heroImageUrl: HERO_PHOTO_URL,
    title: `Thank you, ${safeName}! Your courses are unlocked`,
    bodyHtml: `
      <p style="margin:0 0 12px;">We confirmed your payment of <strong>$${Number(amountUsd).toFixed(2)} USD</strong> (Order ID: <code>${escapeHtml(orderId)}</code>).</p>
      <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:10px;padding:14px 16px;margin:14px 0;">
        <div style="font-size:12px;font-weight:700;text-transform:uppercase;color:#7C3AED;margin-bottom:8px;">Unlocked Units &amp; Access</div>
        <ul style="margin:0;padding-left:18px;">${listHtml}</ul>
      </div>
    `,
    ctaLabel: "Start Learning Now",
    ctaUrl: `${SITE_URL}/my-learning?purchased=1`
  });
  const text = `Thank you, ${name}! Payment of $${Number(amountUsd).toFixed(2)} (Order ${orderId}) is confirmed. Access your courses at ${SITE_URL}/my-learning`;
  return { subject: `Payment Confirmed — Courses Unlocked (Order ${orderId})`, html, text };
}

function buildWeeklyDigestEmail({ name, subject, topicTitle, summary, highlights = [], ctaUrl, email, unsubscribeUrl = "" }) {
  const safeName = escapeHtml(name || "Nursing Colleague");
  const safeTopic = escapeHtml(topicTitle);
  const safeSummary = escapeHtml(summary);
  const bulletsHtml = highlights
    .filter(Boolean)
    .map((h) => `<li style="margin-bottom:7px;">${escapeHtml(h)}</li>`)
    .join("");
  const unsubUrl = unsubscribeUrl || `${SITE_URL}/api/unsubscribe?email=${encodeURIComponent(email || "")}`;

  const secondaryHtml = `
    <div style="font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:0.06em;color:#0F172A;margin:14px 0 4px;">Continue Revising This Week</div>
    ${buildFPatternRows([
      {
        image: ANATOMY_PHOTO_URL,
        title: "50% Student Price Cut Active",
        desc: "Individual study units start at $2.49, or unlock all 83 courses + 109 past papers together.",
        cta: "Explore Study Units",
        url: `${SITE_URL}/courses`
      },
      {
        image: MOCK_PHOTO_URL,
        title: "109+ UNMEB & UHPAB Past Papers",
        desc: "Test yourself with timed MCQs, Section B & C essay guides, and printable PDFs.",
        cta: "Practice Past Papers",
        url: `${SITE_URL}/mock-exams`
      }
    ])}
  `;

  const html = wrapBrandedLayout({
    preheader: summary,
    badge: "WEEKLY STUDY DIGEST",
    heroImageUrl: HERO_PHOTO_URL,
    title: safeTopic,
    bodyHtml: `
      <p style="margin:0 0 10px;">Hello ${safeName},</p>
      <p style="margin:0 0 12px;">${safeSummary}</p>
      ${
        bulletsHtml
          ? `<div style="background:#FAF5FF;border-left:4px solid #7C3AED;padding:14px 16px;margin:14px 0;border-radius:0 8px 8px 0;">
              <div style="font-size:11.5px;font-weight:800;text-transform:uppercase;color:#6D28D9;letter-spacing:0.06em;margin-bottom:8px;">This Week's High-Yield Focus</div>
              <ul style="margin:0;padding-left:18px;color:#0F172A;">${bulletsHtml}</ul>
            </div>`
          : ""
      }
    `,
    secondaryHtml,
    ctaLabel: "Open This Week's Guide",
    ctaUrl: ctaUrl || `${SITE_URL}/courses`,
    footerNote: `You received this study digest from Nursing Uganda. <a href="${unsubUrl}" style="color:#C084FC;">Unsubscribe</a>`
  });

  const text = `Hello ${name || "Colleague"},\n\n${topicTitle}\n\n${summary}\n\n${highlights.map((h) => `- ${h}`).join("\n")}\n\nRead more: ${ctaUrl || SITE_URL}\nUnsubscribe: ${unsubUrl}`;
  return { subject: subject || `Nursing Uganda Weekly Digest: ${topicTitle}`, html, text };
}

function buildQuizResultEmail({ name, topicTitle, score, totalQuestions, passed, breakdown = {}, reviewItems = [] }) {
  const safeName = escapeHtml(name || "Nursing Student");
  const safeTopic = escapeHtml(topicTitle || "Major Nursing Topic Quiz");
  const pct = totalQuestions > 0 ? Math.round((Number(score) / Number(totalQuestions)) * 100) : 0;
  const passBadgeBg = passed ? "#dcfce7" : "#fef3c7";
  const passBadgeColor = passed ? "#166534" : "#92400e";
  const statusLabel = passed ? "PASS (>= 60% Benchmark Met)" : "NEEDS REVIEW (< 60% Benchmark)";

  const singleLine = breakdown.single ? `${breakdown.single.correct}/${breakdown.single.total} Single-Choice` : "";
  const multiLine = breakdown.multi ? `${breakdown.multi.correct}/${breakdown.multi.total} Multi-Choice` : "";
  const tfLine = breakdown.tf ? `${breakdown.tf.correct}/${breakdown.tf.total} True/False` : "";
  const breakdownStr = [singleLine, multiLine, tfLine].filter(Boolean).join(" &middot; ");

  const reviewHtml = (reviewItems || [])
    .slice(0, 6)
    .map(
      (item) =>
        `<li style="margin-bottom:8px;"><strong>${escapeHtml(item.prompt)}</strong><br/><span style="color:#166534;">Correct: ${escapeHtml(item.correctLabel)}</span>${item.rationale ? `<br/><span style="color:#64748B;font-size:12px;">${escapeHtml(item.rationale)}</span>` : ""}</li>`
    )
    .join("");

  const html = wrapBrandedLayout({
    preheader: `${topicTitle}: You scored ${score}/${totalQuestions} (${pct}%).`,
    badge: "QUIZ REPORT",
    title: `${safeTopic} — Quiz Results`,
    bodyHtml: `
      <p style="margin:0 0 12px;">Hello ${safeName},</p>
      <p style="margin:0 0 16px;">Your Nursing Uganda quiz attempt has been graded and saved to your dashboard.</p>
      <div style="background:#F8FAFC;border:1px solid #CBD5E1;border-left:5px solid #7C3AED;border-radius:10px;padding:16px 18px;margin-bottom:16px;">
        <div style="font-size:28px;font-weight:800;color:#0F172A;line-height:1.1;">${pct}% <span style="font-size:15px;font-weight:600;color:#64748B;">(${Number(score)} / ${Number(totalQuestions)} correct)</span></div>
        <div style="margin-top:8px;">
          <span style="display:inline-block;background:${passBadgeBg};color:${passBadgeColor};font-size:12px;font-weight:700;padding:4px 10px;border-radius:6px;">${statusLabel}</span>
        </div>
        ${breakdownStr ? `<div style="margin-top:10px;font-size:13px;color:#334155;"><strong>Type Breakdown:</strong> ${breakdownStr}</div>` : ""}
      </div>
      ${
        reviewHtml
          ? `<div style="margin:14px 0;"><div style="font-size:13px;font-weight:700;color:#0F172A;margin-bottom:8px;">High-Yield Revision Highlights:</div><ol style="margin:0;padding-left:20px;font-size:13px;">${reviewHtml}</ol></div>`
          : ""
      }
    `,
    ctaLabel: "View Dashboard & Retake Quiz",
    ctaUrl: `${SITE_URL}/quizzes`
  });

  const text = `Hello ${name || "Student"},\n\nQuiz Result: ${topicTitle}\nScore: ${score}/${totalQuestions} (${pct}%) — ${statusLabel}\n\nContinue revising at ${SITE_URL}/quizzes`;
  return { subject: `[Quiz Result: ${pct}%] ${topicTitle} — Nursing Uganda`, html, text };
}

function buildCertificateEmail({ name, courseTitle, score, totalQuestions, certificateCode, attemptNumber }) {
  const safeName = escapeHtml(name || "Nursing Student");
  const safeCourse = escapeHtml(courseTitle || "Nursing & Midwifery Course");
  const safeCode = escapeHtml(certificateCode || "NU-CERT");
  const pct = totalQuestions > 0 ? Math.round((Number(score) / Number(totalQuestions)) * 100) : 0;

  const html = wrapBrandedLayout({
    preheader: `Congratulations! Certificate ${certificateCode} issued for ${courseTitle} (${pct}%).`,
    badge: "CERTIFICATE EARNED",
    title: `Congratulations, ${safeName}!`,
    bodyHtml: `
      <p style="margin:0 0 12px;">You passed the 30-question Final Evaluation for <strong>${safeCourse}</strong> and unlocked your verified <strong>Certificate of Study Completion</strong>.</p>
      <div style="background:#FAF5FF;border:1.5px solid #7C3AED;border-radius:10px;padding:18px;margin:16px 0;">
        <div style="font-size:11px;font-weight:800;color:#6D28D9;letter-spacing:0.08em;text-transform:uppercase;">Verification Summary</div>
        <div style="font-size:16px;font-weight:700;color:#0F172A;margin:6px 0;">${safeCourse}</div>
        <div style="font-size:13px;color:#334155;">Evaluation Score: <strong>${Number(score)} / ${Number(totalQuestions)} (${pct}%)</strong> (Attempt #${Number(attemptNumber || 1)})</div>
        <div style="font-size:13px;color:#334155;margin-top:4px;">Certificate ID: <code>${safeCode}</code></div>
      </div>
      <p style="margin:12px 0 0;font-size:12px;color:#64748B;"><strong>Regulatory Disclaimer:</strong> This Certificate of Completion verifies independent study on Nursing Uganda only and is NOT a statutory practicing license from UNMEB, UNMC, or Ministry of Health Uganda.</p>
    `,
    ctaLabel: "Download Certificate PDF",
    ctaUrl: `${SITE_URL}/my-learning`
  });

  const text = `Congratulations ${name}!\n\nYou passed ${courseTitle} Final Evaluation (${score}/${totalQuestions} = ${pct}%).\nCertificate ID: ${certificateCode}\nView & print at ${SITE_URL}/my-learning`;
  return { subject: `Certificate of Completion Earned: ${courseTitle} (${safeCode})`, html, text };
}

/**
 * Automated Course Stall Nudge (10 / 20 / 30+ Days Without Completing Enrolled Course)
 */
function buildCourseStallEmail({
  name,
  email,
  courseTitle,
  courseSlug,
  courseThumb = "",
  pct = 0,
  completedCount = 0,
  totalLessons = 0,
  daysIdle = 10,
  milestoneDays = 10,
  unsubscribeUrl = ""
}) {
  const safeName = escapeHtml(name || "Nursing Colleague");
  const resumeUrl = `${SITE_URL}/learn/${encodeURIComponent(courseSlug || "")}`;
  const unsubUrl = unsubscribeUrl || `${SITE_URL}/api/unsubscribe?email=${encodeURIComponent(email || "")}`;
  const remaining = Math.max(1, Number(totalLessons || 0) - Number(completedCount || 0));

  const tierMap = {
    10: {
      badge: "10-DAY CHECK-IN",
      subject: `Keep going: ${courseTitle} is waiting (${pct}% complete)`,
      headline: `Finish what you started in ${courseTitle}`,
      lead: `It has been ${Number(daysIdle)} days since your last session on <strong>${escapeHtml(courseTitle)}</strong>. Just one 15-minute topic tonight keeps your UNMEB recall sharp (${remaining} lesson${remaining === 1 ? "" : "s"} left to your certificate).`
    },
    20: {
      badge: "20-DAY REVISION NUDGE",
      subject: `20 days paused on ${courseTitle} — ready for a quick study boost?`,
      headline: `${Number(daysIdle)} days away from ${courseTitle}`,
      lead: `Don't let your earlier notes fade! You're already at <strong>${Number(pct)}%</strong> in <strong>${escapeHtml(courseTitle)}</strong>. Jump back into your next saved checkpoint or test yourself with a 5-minute quiz.`
    },
    30: {
      badge: "30+ DAY COMEBACK",
      subject: `30+ days since ${courseTitle} — restart with a 15-min plan`,
      headline: `Restart ${courseTitle} in 15 minutes today`,
      lead: `Clinical rotations and shifts get busy — it has been over 30 days since you opened <strong>${escapeHtml(courseTitle)}</strong>. Your saved notes and progress (${Number(pct)}%) are still waiting safely right where you stopped.`
    }
  };

  const t = tierMap[milestoneDays] || tierMap[10];
  const hero = courseThumb && /^https?:\/\//i.test(courseThumb) ? courseThumb : `${SITE_URL}${courseThumb || "/assets/images/udemy/hero-banner.webp"}`;

  const secondaryHtml = `
    <div style="font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:0.06em;color:#0F172A;margin:14px 0 4px;">Your Quick Comeback Toolkit</div>
    ${buildFPatternRows([
      {
        image: hero,
        title: `Resume ${courseTitle}`,
        desc: `Pick up straight inside the course player and unlock your Final Evaluation certificate.`,
        cta: "Open Course Player",
        url: resumeUrl
      },
      {
        image: MOCK_PHOTO_URL,
        title: "Test Recall With Past Papers",
        desc: "Pair your notes with 109+ UNMEB & UHPAB past exam papers and marking schemes.",
        cta: "Open Mock Exams",
        url: `${SITE_URL}/mock-exams`
      },
      {
        image: CLINICAL_PHOTO_URL,
        title: "50% Student Price Cut + All-Access",
        desc: "Need another unit? Individual units start at $2.49 (50% off) or $34.99 for all 83 courses.",
        cta: "View Catalog",
        url: `${SITE_URL}/courses`
      }
    ])}
  `;

  const html = wrapBrandedLayout({
    preheader: `${courseTitle} is ${pct}% done — resume your revision today.`,
    badge: t.badge,
    heroImageUrl: HERO_PHOTO_URL,
    title: t.headline,
    bodyHtml: `
      <p style="margin:0 0 10px;">Hello ${safeName},</p>
      <p style="margin:0 0 8px;">${t.lead}</p>
      ${buildCourseProgressCard({ courseTitle, courseThumb: hero, pct, completedCount, totalLessons })}
    `,
    secondaryHtml,
    ctaLabel: "Resume Course Now",
    ctaUrl: resumeUrl,
    secondaryCtaLabel: "My Dashboard",
    secondaryCtaUrl: `${SITE_URL}/my-learning`,
    footerNote: `Automated study reminder from Nursing Uganda. <a href="${unsubUrl}" style="color:#C084FC;">Unsubscribe from reminders</a>`
  });

  const text = `Hello ${name || "Student"},\n\n${t.headline}\nYou are ${pct}% (${completedCount}/${totalLessons} topics) through ${courseTitle}.\nResume here: ${resumeUrl}\nUnsubscribe: ${unsubUrl}`;
  return { subject: t.subject, html, text };
}

/**
 * Automated Site Inactivity Re-Engagement (10 / 20 / 30+ Days Without Visiting Site)
 */
function buildSiteInactivityEmail({ name, email, daysIdle = 10, milestoneDays = 10, unsubscribeUrl = "" }) {
  const safeName = escapeHtml(name || "Nursing Colleague");
  const unsubUrl = unsubscribeUrl || `${SITE_URL}/api/unsubscribe?email=${encodeURIComponent(email || "")}`;

  const tierMap = {
    10: {
      badge: "10 DAYS AWAY",
      subject: "Pick up your nursing & midwifery revision on Nursing Uganda",
      headline: "Your study desk is ready when you are",
      lead: `It has been ${Number(daysIdle)} days since your last visit to <strong>Nursing Uganda</strong>. Spend 10 minutes today reviewing a clinical topic or testing your speed on a UNMEB paper.`
    },
    20: {
      badge: "20 DAYS AWAY · 50% OFF",
      subject: "20 days away: Individual courses now 50% OFF on Nursing Uganda",
      headline: "Fresh 50% student price cut waiting for you",
      lead: `We noticed you haven't visited in ${Number(daysIdle)} days. Every individual paid course unit is now cut by <strong>50% (starting at $2.49)</strong> — or unlock all 83 courses + 109 past papers for $34.99.`
    },
    30: {
      badge: "30+ DAYS COMEBACK",
      subject: "Ready to jump back in? Free eBooks + 50% off all study units",
      headline: "Welcome back to clinical & exam prep",
      lead: `Whether you are preparing for UNMEB exams or starting a new ward rotation after 30+ days away, all <strong>8 referenced study eBooks</strong>, calculators, and updated course notes are ready for you.`
    }
  };

  const t = tierMap[milestoneDays] || tierMap[10];

  const secondaryHtml = `
    <div style="font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:0.06em;color:#0F172A;margin:14px 0 4px;">Popular With Ugandan Nursing Students This Week</div>
    ${buildTwoColumnCards([
      {
        image: ANATOMY_PHOTO_URL,
        title: "50% Off Study Units",
        desc: "Unlock Anatomy, Midwifery, Med-Surg & Pharmacology from $2.49 per unit.",
        cta: "Browse 83 Courses",
        url: `${SITE_URL}/courses`
      },
      {
        image: MOCK_PHOTO_URL,
        title: "109+ UNMEB Past Papers",
        desc: "Practice real Section A, B & C papers with model answers ($4.99).",
        cta: "Start Exam Drill",
        url: `${SITE_URL}/mock-exams`
      }
    ])}
    ${buildFPatternRows([
      {
        image: CLINICAL_PHOTO_URL,
        title: "Free Referenced eBooks & Clinical Calculators",
        desc: "Download 8 referenced PDF textbooks and check IV drip rates & MoH lab ranges free.",
        cta: "Open Free Resources",
        url: `${SITE_URL}/ebooks`
      }
    ])}
  `;

  const html = wrapBrandedLayout({
    preheader: t.lead.replace(/<[^>]+>/g, ""),
    badge: t.badge,
    heroImageUrl: HERO_PHOTO_URL,
    title: t.headline,
    bodyHtml: `
      <p style="margin:0 0 10px;">Hello ${safeName},</p>
      <p style="margin:0 0 8px;">${t.lead}</p>
    `,
    secondaryHtml,
    ctaLabel: "Return to My Learning",
    ctaUrl: `${SITE_URL}/my-learning`,
    secondaryCtaLabel: "Explore 50% Off Courses",
    secondaryCtaUrl: `${SITE_URL}/courses`,
    footerNote: `Automated visit reminder from Nursing Uganda. <a href="${unsubUrl}" style="color:#C084FC;">Unsubscribe</a>`
  });

  const text = `Hello ${name || "Colleague"},\n\n${t.headline}\nReturn to your revision dashboard at ${SITE_URL}/my-learning or browse 50% off courses at ${SITE_URL}/courses.\nUnsubscribe: ${unsubUrl}`;
  return { subject: t.subject, html, text };
}

function buildMonthlyNewsletterEmail({ name = "Colleague", newsletter = null, customMonth = null, unsubscribeUrl = "" }) {
  const nl = newsletter || getMonthlyNewsletterForDate(new Date(), customMonth);
  const safeName = escapeHtml(name || "Colleague");
  const unsubUrl = escapeHtml(unsubscribeUrl || `${SITE_URL}/courses`);
  const heroImg = (nl.featuredCards && nl.featuredCards[0] && nl.featuredCards[0].image) || HERO_PHOTO_URL;

  const twoColHtml = buildTwoColumnCards(nl.featuredCards || []);
  const pearlHtml = nl.pearlBody
    ? `
      <div style="margin:16px 0 4px;padding:14px 16px;background-color:#FAF5FF;border-left:4px solid #7C3AED;border-radius:0 10px 10px 0;">
        <div style="font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:0.06em;color:#6D28D9;margin-bottom:4px;">${escapeHtml(nl.pearlTitle || "Clinical Pearl")}</div>
        <div style="font-size:13.5px;line-height:1.55;color:#1E293B;">${escapeHtml(nl.pearlBody)}</div>
      </div>`
    : "";

  const html = wrapBrandedLayout({
    preheader: nl.preheader || nl.title,
    badge: nl.seasonLabel || "MONTHLY DISPATCH",
    heroImageUrl: heroImg,
    heroAlt: nl.title,
    title: nl.title,
    bodyHtml: `
      <p style="margin:0 0 12px;">Hello <strong>${safeName}</strong>,</p>
      <p style="margin:0 0 10px;">${escapeHtml(nl.lead)}</p>
      ${pearlHtml}
    `,
    ctaLabel: nl.ctaLabel || "Open Study Platform",
    ctaUrl: nl.ctaUrl || `${SITE_URL}/courses`,
    secondaryCtaLabel: "Browse 50% Off Units",
    secondaryCtaUrl: `${SITE_URL}/courses`,
    secondaryHtml: `
      <div style="font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:0.06em;color:#64748B;margin:14px 0 0;">Featured This Month</div>
      ${twoColHtml}
    `,
    footerNote: `Monthly Clinical Newsletter (${escapeHtml(nl.yearMonth || "")}). <a href="${unsubUrl}" style="color:#C084FC;">Unsubscribe</a>`
  });

  const text = `Hello ${name || "Colleague"},\n\n${nl.seasonLabel}\n${nl.title}\n\n${nl.lead}\n\n${nl.pearlTitle}: ${nl.pearlBody}\n\nOpen platform: ${nl.ctaUrl}\nUnsubscribe: ${unsubUrl}`;
  return { subject: nl.subject, html, text };
}

module.exports = {
  escapeHtml,
  buildWelcomeVerificationEmail,
  buildSecurityAlertEmail,
  buildPaymentReceiptEmail,
  buildWeeklyDigestEmail,
  buildQuizResultEmail,
  buildCertificateEmail,
  buildCourseStallEmail,
  buildSiteInactivityEmail,
  buildMonthlyNewsletterEmail
};
