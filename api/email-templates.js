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
        `<li style="margin-bottom:8px;"><strong>${escapeHtml(item.prompt)}</strong><br/><span style="color:#166534;">Correct: ${escapeHtml(item.correctLabel)}</span>${item.rationale ? `<br/><span style="color:#6A6F73;font-size:12px;">${escapeHtml(item.rationale)}</span>` : ""}</li>`
    )
    .join("");

  const html = wrapBrandedLayout({
    preheader: `${topicTitle}: You scored ${score}/${totalQuestions} (${pct}%).`,
    badge: "QUIZ RESULT REPORT",
    title: `${safeTopic} — Quiz Results`,
    bodyHtml: `
      <p style="margin:0 0 12px;">Hello ${safeName},</p>
      <p style="margin:0 0 16px;">Your Nursing Uganda free topic quiz attempt has been graded and saved to your learner dashboard.</p>
      <div style="background:#F7F9FA;border:1px solid #D1D7DC;border-left:5px solid #A137F2;border-radius:6px;padding:16px 18px;margin-bottom:18px;">
        <div style="font-size:28px;font-weight:800;color:#1C1D1F;line-height:1.1;">${pct}% <span style="font-size:15px;font-weight:600;color:#6A6F73;">(${Number(score)} / ${Number(totalQuestions)} correct)</span></div>
        <div style="margin-top:8px;">
          <span style="display:inline-block;background:${passBadgeBg};color:${passBadgeColor};font-size:12px;font-weight:700;padding:4px 10px;border-radius:4px;">${statusLabel}</span>
        </div>
        ${breakdownStr ? `<div style="margin-top:10px;font-size:13px;color:#2D2F31;"><strong>Type Breakdown:</strong> ${breakdownStr}</div>` : ""}
      </div>
      ${
        reviewHtml
          ? `<div style="margin:14px 0;"><div style="font-size:13px;font-weight:700;color:#1C1D1F;margin-bottom:8px;">High-Yield Revision Highlights:</div><ol style="margin:0;padding-left:20px;font-size:13px;">${reviewHtml}</ol></div>`
          : ""
      }
      <p style="margin:14px 0 0;font-size:12px;color:#6A6F73;"><em>Study Disclaimer:</em> Nursing Uganda assessments support UNMEB and clinical revision only and do not constitute institutional grading or licensure.</p>
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
      <p style="margin:0 0 12px;">You have successfully passed the 30-question Final Course Evaluation for <strong>${safeCourse}</strong> and unlocked your <strong>Certificate of Study Completion</strong> and Completion Badge.</p>
      <div style="background:#FAF5FF;border:2px solid #A137F2;border-radius:8px;padding:18px;margin:16px 0;">
        <div style="font-size:11px;font-weight:700;color:#A137F2;letter-spacing:0.08em;text-transform:uppercase;">Verification Summary</div>
        <div style="font-size:16px;font-weight:700;color:#1C1D1F;margin:6px 0;">${safeCourse}</div>
        <div style="font-size:13px;color:#2D2F31;">Final Evaluation Score: <strong>${Number(score)} / ${Number(totalQuestions)} (${pct}%)</strong> (Attempt #${Number(attemptNumber || 1)})</div>
        <div style="font-size:13px;color:#2D2F31;margin-top:4px;">Certificate ID: <code>${safeCode}</code></div>
      </div>
      <p style="margin:12px 0 0;font-size:12px;color:#6A6F73;"><strong>Regulatory Disclaimer:</strong> This Certificate of Completion recognizes independent supplementary study on Nursing Uganda only. It is NOT an accredited academic transcript, statutory clinical license, or official qualification from UNMEB, UNMC, or the Ministry of Health Uganda.</p>
    `,
    ctaLabel: "Print Certificate & View Badges",
    ctaUrl: `${SITE_URL}/my-learning`
  });

  const text = `Congratulations ${name}!\n\nYou passed ${courseTitle} Final Evaluation (${score}/${totalQuestions} = ${pct}%).\nCertificate ID: ${certificateCode}\n\nNote: This supplementary study completion certificate is not a clinical practicing license.\nView & print at ${SITE_URL}/my-learning`;
  return { subject: `Certificate of Completion Earned: ${courseTitle} (${safeCode})`, html, text };
}

module.exports = {
  buildWelcomeVerificationEmail,
  buildSecurityAlertEmail,
  buildPaymentReceiptEmail,
  buildWeeklyDigestEmail,
  buildQuizResultEmail,
  buildCertificateEmail
};
