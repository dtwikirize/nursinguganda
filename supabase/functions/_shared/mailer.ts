/**
 * Shared Hostinger SMTP mailer for Nursing Uganda Edge Functions.
 *
 * Secrets required in Supabase (set via: supabase secrets set KEY=value):
 *   SMTP_HOST   — smtp.hostinger.com
 *   SMTP_PORT   — 465
 *   SMTP_USER   — info@nursinguganda.com
 *   SMTP_PASS   — <your Hostinger email password>
 */

// @deno-types="npm:@types/nodemailer@6"
import nodemailer from "npm:nodemailer@6.9.14";

const SMTP_HOST = Deno.env.get("SMTP_HOST") ?? "smtp.hostinger.com";
const SMTP_PORT = parseInt(Deno.env.get("SMTP_PORT") ?? "465", 10);
const SMTP_USER = Deno.env.get("SMTP_USER") ?? "info@nursinguganda.com";
const SMTP_PASS = Deno.env.get("SMTP_PASS") ?? "";

export const FROM_ADDRESS  = `Nursing Uganda <${SMTP_USER}>`;
export const ADMIN_EMAIL   = SMTP_USER;
export const SITE_URL      = "https://nursinguganda.com";
export const BRAND_COLOR   = "#0f7f4f";
export const BRAND_LIGHT   = "#d1fae5";

/** One shared transporter — created lazily. */
let _transporter: ReturnType<typeof nodemailer.createTransport> | null = null;

export function getTransporter() {
  if (!_transporter) {
    _transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,   // SSL on 465, STARTTLS on 587
      auth: { user: SMTP_USER, pass: SMTP_PASS },
      tls: { rejectUnauthorized: false },   // needed for some Hostinger configs
    });
  }
  return _transporter;
}

export interface SendOptions {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
  cc?: string;
}

export async function sendEmail(opts: SendOptions) {
  const transporter = getTransporter();
  await transporter.sendMail({
    from: FROM_ADDRESS,
    to: opts.to,
    subject: opts.subject,
    html: opts.html,
    replyTo: opts.replyTo,
    cc: opts.cc,
  });
}

/** Shared HTML email wrapper — consistent branding across all emails. */
export function emailWrapper(bodyHtml: string, previewText = ""): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  ${previewText ? `<div style="display:none;max-height:0;overflow:hidden">${previewText}</div>` : ""}
</head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
  <div style="max-width:600px;margin:0 auto;padding:32px 16px">

    <!-- Header -->
    <div style="background:${BRAND_COLOR};border-radius:14px 14px 0 0;padding:20px 32px">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td>
            <span style="display:inline-flex;align-items:center;gap:10px">
              <span style="display:inline-block;width:36px;height:36px;background:rgba(255,255,255,.2);border-radius:8px;text-align:center;line-height:36px;font-size:14px;font-weight:800;color:#fff">NU</span>
              <span style="font-size:16px;font-weight:800;color:#fff;letter-spacing:-0.02em">Nursing Uganda</span>
            </span>
          </td>
          <td align="right">
            <a href="${SITE_URL}" style="font-size:11px;color:#a7f3d0;text-decoration:none">${SITE_URL}</a>
          </td>
        </tr>
      </table>
    </div>

    <!-- Body -->
    <div style="background:#ffffff;border:1px solid #e5e7eb;border-top:none">
      ${bodyHtml}
    </div>

    <!-- Footer -->
    <div style="background:#f9fafb;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 14px 14px;padding:16px 24px;text-align:center">
      <p style="margin:0;font-size:11px;color:#9ca3af;line-height:1.6">
        Nursing Uganda &mdash; Nursing &amp; Midwifery Revision for Uganda Students<br>
        <a href="mailto:${ADMIN_EMAIL}" style="color:#9ca3af">${ADMIN_EMAIL}</a>
        &nbsp;&bull;&nbsp;
        <a href="${SITE_URL}" style="color:#9ca3af">${SITE_URL}</a>
      </p>
    </div>

  </div>
</body>
</html>`;
}
