/**
 * Branded HTML Email Templates for Nursing Uganda
 * Colors follow the official Stacked BrandKit:
 *  - Ink: #1C1D1F
 *  - Royal Purple: #A137F2
 *  - Lavender: #B36AFA
 *  - Clinical Cream: #ECEB98
 */

const SITE_URL = "https://nursinguganda.com";
const ICON_URL = `${SITE_URL}/assets/images/brand/nu-variant-3-192.png`;

function escapeHtml(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function wrapBrandedLayout({ preheader = "", badge = "NURSING UGANDA", title, bodyHtml, ctaLabel, ctaUrl, footerNote }) {
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
<body style="margin:0;padding:0;background-color:#F7F9FA;font-family:'Poppins','Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#1C1D1F;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${safePreheader}</div>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#F7F9FA;padding:28px 14px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;background-color:#FFFFFF;border:1px solid #D1D7DC;border-radius:8px;overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="background-color:#1C1D1F;padding:22px 28px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td valign="middle" style="width:46px;">
                    <img src="${ICON_URL}" alt="NU" width="38" height="38" style="display:block;border-radius:8px;" />
                  </td>
                  <td valign="middle" style="padding-left:10px;">
                    <div style="font-size:20px;font-weight:700;color:#FFFFFF;line-height:1.1;letter-spacing:-0.02em;">Nursing</div>
                    <div style="font-size:10px;font-weight:600;color:#B36AFA;letter-spacing:0.28em;margin-top:2px;">UGANDA</div>
                  </td>
                  <td align="right" valign="middle">
                    <span style="display:inline-block;background-color:#ECEB98;color:#3D3C0A;font-size:10px;font-weight:700;padding:4px 9px;border-radius:4px;letter-spacing:0.04em;">${safeBadge}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Purple Accent Rule -->
          <tr>
            <td style="height:4px;background:linear-gradient(90deg,#A137F2 0%,#B36AFA 100%);font-size:0;line-height:0;">&nbsp;</td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:30px 28px 24px;">
              <h1 style="margin:0 0 14px;font-size:22px;line-height:1.3;color:#1C1D1F;font-weight:700;">${safeTitle}</h1>
              <div style="font-size:15px;line-height:1.65;color:#2D2F31;">
                ${bodyHtml}
              </div>
              ${
                ctaLabel && ctaUrl
                  ? `<div style="margin:26px 0 8px;">
                      <a href="${escapeHtml(ctaUrl)}" style="display:inline-block;background-color:#A137F2;color:#FFFFFF;text-decoration:none;font-weight:700;font-size:14px;padding:13px 24px;border-radius:4px;">${escapeHtml(ctaLabel)} &rarr;</a>
                    </div>`
                  : ""
              }
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#F7F9FA;border-top:1px solid #E8ECEF;padding:18px 28px;font-size:12px;line-height:1.6;color:#6A6F73;">
              <p style="margin:0 0 6px;"><strong>Nursing Uganda</strong> &middot; UNMEB &amp; UNMC Aligned Nursing &amp; Midwifery Learning</p>
              <p style="margin:0;">
                ${footerNote || `Need help? Reply to <a href="mailto:support@nursinguganda.com" style="color:#A137F2;">support@nursinguganda.com</a> or visit <a href="${SITE_URL}" style="color:#A137F2;">nursinguganda.com</a>.`}
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
    const html = wrapBrandedLayout({
      preheader: "Welcome to Nursing Uganda — your student dashboard is ready.",
      badge: "WELCOME",
      title: `Welcome to Nursing Uganda, ${safeName}!`,
      bodyHtml: `
        <p style="margin:0 0 14px;">Your Google account is now linked and verified on <strong>Nursing Uganda</strong>.</p>
        <p style="margin:0 0 14px;">From your personal Learner Dashboard you can:</p>
        <ul style="margin:0 0 14px;padding-left:20px;">
          <li>Track your unit completion across <strong>95 Nursing &amp; Midwifery courses</strong></li>
          <li>Download <strong>8 Free Referenced Study eBooks</strong> (WHO &amp; Uganda MoH 2023 cited)</li>
          <li>Practice timed <strong>UNMEB Mock Exams</strong> with clinical rationales</li>
        </ul>
      `,
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
      <p style="margin:0 0 14px;">Thank you for joining <strong>Nursing Uganda</strong>! Enter this 6-digit security code to verify your email address and activate full account alerts:</p>
      <div style="margin:20px 0;padding:18px;background-color:#F7EDFF;border:1px dashed #A137F2;border-radius:6px;text-align:center;">
        <span style="font-size:32px;font-weight:800;letter-spacing:8px;color:#A137F2;">${safeCode}</span>
      </div>
      <p style="margin:0;font-size:13px;color:#6A6F73;">This code expires in <strong>15 minutes</strong>. Never share this code with anyone.</p>
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
      <table role="presentation" width="100%" cellspacing="0" cellpadding="8" style="background:#F7F9FA;border:1px solid #E8ECEF;border-radius:6px;font-size:13px;">
        <tr><td style="width:120px;font-weight:700;color:#1C1D1F;">Event:</td><td>${safeType}</td></tr>
        <tr><td style="font-weight:700;color:#1C1D1F;">Details:</td><td>${safeDetails}</td></tr>
        <tr><td style="font-weight:700;color:#1C1D1F;">IP Address:</td><td>${safeIp}</td></tr>
        <tr><td style="font-weight:700;color:#1C1D1F;">Time (UTC):</td><td>${new Date().toUTCString()}</td></tr>
      </table>
      <p style="margin:14px 0 0;font-size:13px;color:#6A6F73;">If this was you, no action is needed. If you do not recognize this activity, contact <a href="mailto:support@nursinguganda.com" style="color:#A137F2;">support@nursinguganda.com</a> immediately.</p>
    `,
    ctaLabel: "Review Account Security",
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
    preheader: `Payment confirmed ($${Number(amountUsd).toFixed(2)}) — courses unlocked!`,
    badge: "PAYMENT CONFIRMED",
    title: `Thank you, ${safeName}! Your courses are unlocked`,
    bodyHtml: `
      <p style="margin:0 0 14px;">We received your PayPal payment of <strong>$${Number(amountUsd).toFixed(2)} USD</strong> (Order ID: <code>${escapeHtml(orderId)}</code>).</p>
      <p style="margin:0 0 8px;font-weight:700;">Unlocked Learning Units:</p>
      <ul style="margin:0 0 16px;padding-left:20px;">${listHtml}</ul>
    `,
    ctaLabel: "Start Learning Now",
    ctaUrl: `${SITE_URL}/my-learning?purchased=1`
  });
  const text = `Thank you, ${name}! Payment of $${Number(amountUsd).toFixed(2)} (Order ${orderId}) is confirmed. Access your courses at ${SITE_URL}/my-learning`;
  return { subject: `Payment Confirmed — Courses Unlocked (Order ${orderId})`, html, text };
}

function buildWeeklyDigestEmail({ name, subject, topicTitle, summary, highlights = [], ctaUrl, email }) {
  const safeName = escapeHtml(name || "Nursing Colleague");
  const safeTopic = escapeHtml(topicTitle);
  const safeSummary = escapeHtml(summary);
  const bulletsHtml = highlights
    .filter(Boolean)
    .map((h) => `<li style="margin-bottom:8px;">${escapeHtml(h)}</li>`)
    .join("");
  const unsubUrl = `${SITE_URL}/api/unsubscribe?email=${encodeURIComponent(email || "")}`;

  const html = wrapBrandedLayout({
    preheader: summary,
    badge: "WEEKLY STUDY DIGEST",
    title: topicTitle,
    bodyHtml: `
      <p style="margin:0 0 12px;">Hello ${safeName},</p>
      <p style="margin:0 0 14px;">${safeSummary}</p>
      ${
        bulletsHtml
          ? `<div style="background:#F7F9FA;border-left:4px solid #A137F2;padding:14px 18px;margin:16px 0;border-radius:0 6px 6px 0;">
              <div style="font-size:12px;font-weight:800;text-transform:uppercase;color:#A137F2;letter-spacing:0.06em;margin-bottom:8px;">This Week's High-Yield Agenda</div>
              <ul style="margin:0;padding-left:18px;">${bulletsHtml}</ul>
            </div>`
          : ""
      }
      <p style="margin:0;font-size:13px;color:#6A6F73;">All Nursing Uganda notes &amp; eBooks are aligned with UNMEB, UNMC, and Uganda MoH Clinical Guidelines.</p>
    `,
    ctaLabel: "Read This Week's Topic",
    ctaUrl: ctaUrl || `${SITE_URL}/courses`,
    footerNote: `You received this weekly nursing digest from Nursing Uganda. <a href="${unsubUrl}" style="color:#A137F2;">Unsubscribe</a>`
  });

  const text = `Hello ${name || "Colleague"},\n\n${topicTitle}\n\n${summary}\n\n${highlights.map((h) => `- ${h}`).join("\n")}\n\nRead more: ${ctaUrl || SITE_URL}\nUnsubscribe: ${unsubUrl}`;
  return { subject: subject || `Nursing Uganda Weekly Digest: ${topicTitle}`, html, text };
}

module.exports = {
  buildWelcomeVerificationEmail,
  buildSecurityAlertEmail,
  buildPaymentReceiptEmail,
  buildWeeklyDigestEmail
};
