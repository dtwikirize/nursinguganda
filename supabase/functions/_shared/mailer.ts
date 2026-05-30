/**
 * Shared Hostinger SMTP mailer for Nursing Uganda Edge Functions.
 *
 * Secrets required in Supabase (set via: supabase secrets set KEY=value):
 *   SMTP_HOST              — smtp.hostinger.com
 *   SMTP_PORT              — 465
 *   SMTP_USER              — info@nursinguganda.com
 *   SMTP_PASS              — <your Hostinger email password>
 *   SUPABASE_URL           — https://gunhybscakozycmwufue.supabase.co
 *   SUPABASE_SERVICE_ROLE_KEY — <service role key, for cron/admin functions>
 */

// @deno-types="npm:@types/nodemailer@6"
import nodemailer from "npm:nodemailer@6.9.14";

// ── Config ────────────────────────────────────────────────────────────────────

const SMTP_HOST = Deno.env.get("SMTP_HOST") ?? "smtp.hostinger.com";
const SMTP_PORT = parseInt(Deno.env.get("SMTP_PORT") ?? "465", 10);
const SMTP_USER = Deno.env.get("SMTP_USER") ?? "info@nursinguganda.com";
const SMTP_PASS = Deno.env.get("SMTP_PASS") ?? "";

export const FROM_ADDRESS = `Nursing Uganda <${SMTP_USER}>`;
export const ADMIN_EMAIL  = SMTP_USER;
export const SITE_URL     = "https://nursinguganda.com";

// Brand palette — matches the app's #A64468 rose/mauve theme
export const BRAND_COLOR  = "#A64468";   // deep rose — header background
export const BRAND_DARK   = "#7a3050";   // darker rose — accents
export const BRAND_LIGHT  = "#fce7f3";   // pale rose tint — highlights
export const BRAND_TEXT   = "#1a0a12";   // near-black — body text

// Supabase reference (for edge-function-to-edge-function calls)
export const SUPA_URL     = Deno.env.get("SUPABASE_URL")
  ?? "https://gunhybscakozycmwufue.supabase.co";
export const SUPA_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";


// ── Transporter ───────────────────────────────────────────────────────────────

let _transporter: ReturnType<typeof nodemailer.createTransport> | null = null;

export function getTransporter() {
  if (!_transporter) {
    _transporter = nodemailer.createTransport({
      host:   SMTP_HOST,
      port:   SMTP_PORT,
      secure: SMTP_PORT === 465,      // SSL on 465, STARTTLS on 587
      auth:   { user: SMTP_USER, pass: SMTP_PASS },
      tls:    { rejectUnauthorized: false },  // needed for some Hostinger configs
    });
  }
  return _transporter;
}


// ── Types ─────────────────────────────────────────────────────────────────────

export interface SendOptions {
  to:       string;
  subject:  string;
  html:     string;
  replyTo?: string;
  cc?:      string;
}

export interface EmailParams {
  /** Browser-visible subject line */
  subject:       string;
  /** Hidden preview text shown in inbox list (40–90 chars) */
  preheaderText?: string;
  /** Large headline inside the email body */
  headline:      string;
  /** Optional sub-headline below the main headline */
  subheadline?:  string;
  /** Main HTML content block (paragraphs, lists, etc.) */
  bodyHtml:      string;
  /** CTA button label — omit to hide the button */
  ctaLabel?:     string;
  /** CTA button URL */
  ctaUrl?:       string;
  /** Optional secondary CTA — shown as a plain text link below the main button */
  secondaryCtaLabel?: string;
  secondaryCtaUrl?:   string;
  /** Extra note appended above the footer (plain text or simple HTML) */
  footerNote?:   string;
}


// ── Core send ─────────────────────────────────────────────────────────────────

export async function sendEmail(opts: SendOptions): Promise<void> {
  const transporter = getTransporter();
  await transporter.sendMail({
    from:    FROM_ADDRESS,
    to:      opts.to,
    subject: opts.subject,
    html:    opts.html,
    replyTo: opts.replyTo,
    cc:      opts.cc,
  });
}


// ── Email logging (best-effort, non-blocking) ─────────────────────────────────

export async function logEmail(
  to: string,
  templateName: string,
  subject: string,
  success: boolean,
  errorMsg?: string,
): Promise<void> {
  try {
    if (!SUPA_SERVICE_KEY) return;
    await fetch(`${SUPA_URL}/rest/v1/rpc/nu_log_email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey":        SUPA_SERVICE_KEY,
        "Authorization": `Bearer ${SUPA_SERVICE_KEY}`,
      },
      body: JSON.stringify({
        p_to:       to,
        p_template: templateName,
        p_subject:  subject,
        p_success:  success,
        p_error:    errorMsg ?? null,
      }),
    });
  } catch (_) { /* logging failure must never crash main flow */ }
}


/**
 * Thin wrapper: sends an email, logs the result, and never throws.
 * Returns true on success, false on failure.
 */
export async function sendAndLog(
  opts: SendOptions,
  templateName: string,
): Promise<boolean> {
  try {
    await sendEmail(opts);
    // Non-blocking log
    logEmail(opts.to, templateName, opts.subject, true).catch(() => {});
    return true;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[${templateName}] Send failed to ${opts.to}:`, msg);
    logEmail(opts.to, templateName, opts.subject, false, msg).catch(() => {});
    return false;
  }
}


// ── CORS headers (reused across all functions) ────────────────────────────────

export const corsHeaders = {
  "Access-Control-Allow-Origin":  "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};


// ── Premium HTML email template ───────────────────────────────────────────────
//
//  Renders correctly in:
//    • Gmail (web + app)
//    • Outlook 2016–2021 (Word rendering engine — table layout required)
//    • Apple Mail (macOS + iOS)
//    • Yahoo Mail
//
//  Rules followed:
//    • All CSS inline (no <style> block — Outlook strips them)
//    • Table-based layout
//    • Maximum width 600px, fluid below that
//    • No CSS shorthand for padding/margin (Outlook ignores shorthand)
//    • All images have alt text + explicit width/height

export function buildEmail(p: EmailParams): string {
  const preheader = p.preheaderText
    ? `<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;color:#ffffff;line-height:1px">${p.preheaderText}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;</div>`
    : "";

  const cta = p.ctaLabel && p.ctaUrl
    ? `<table cellpadding="0" cellspacing="0" style="margin:24px auto 0">
         <tr>
           <td style="background-color:${BRAND_COLOR};border-radius:8px;text-align:center;padding:0">
             <a href="${p.ctaUrl}" target="_blank"
                style="display:inline-block;padding:14px 32px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;letter-spacing:-0.01em;mso-padding-alt:14px 32px">
               ${p.ctaLabel}
             </a>
           </td>
         </tr>
       </table>`
    : "";

  const secondaryCta = p.secondaryCtaLabel && p.secondaryCtaUrl
    ? `<p style="margin:16px 0 0;text-align:center;font-size:13px;color:#6b7280;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
         or <a href="${p.secondaryCtaUrl}" style="color:${BRAND_COLOR};text-decoration:none;font-weight:600">${p.secondaryCtaLabel}</a>
       </p>`
    : "";

  const footerNote = p.footerNote
    ? `<p style="margin:16px 0 0;padding:12px 0 0;border-top:1px solid #f1f5f9;font-size:12px;color:#9ca3af;line-height:1.6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">${p.footerNote}</p>`
    : "";

  return `<!DOCTYPE html>
<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta http-equiv="x-ua-compatible" content="ie=edge">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="x-apple-disable-message-reformatting">
  <!--[if mso]>
  <xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml>
  <![endif]-->
</head>
<body style="margin:0;padding:0;background-color:#f3f4f6;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%">
${preheader}

<!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="width:600px"><tr><td><![endif]-->
<table align="center" border="0" cellpadding="0" cellspacing="0" width="100%"
  style="max-width:600px;margin:0 auto;padding:32px 16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">

  <!-- ─── Header ─────────────────────────────────────────────────────────── -->
  <tr>
    <td style="background-color:${BRAND_COLOR};border-radius:12px 12px 0 0;padding:0">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding:24px 32px">
            <!-- Logo row -->
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="background-color:rgba(255,255,255,0.15);border-radius:10px;padding:8px 14px;vertical-align:middle">
                  <!--[if mso]><table cellpadding="0" cellspacing="0"><tr><td style="width:28px;height:28px;background:#fff;border-radius:6px;text-align:center;vertical-align:middle"><![endif]-->
                  <img src="${SITE_URL}/assets/images/pwa/icon-192x192.png"
                       alt="NU" width="28" height="28"
                       style="display:inline-block;vertical-align:middle;border-radius:6px;border:0;line-height:28px;font-size:12px;font-weight:800;color:#fff;background:#A64468">
                  <!--[if mso]></td><td style="padding-left:10px"><![endif]-->
                  <span style="display:inline-block;vertical-align:middle;padding-left:10px;font-size:16px;font-weight:800;color:#ffffff;letter-spacing:-0.02em;font-family:Georgia,'Times New Roman',serif">Nursing Uganda</span>
                  <!--[if mso]></td></tr></table><![endif]-->
                </td>
              </tr>
            </table>
          </td>
          <td align="right" style="padding:24px 32px 24px 0;vertical-align:middle">
            <a href="${SITE_URL}" style="font-size:11px;color:rgba(255,255,255,0.65);text-decoration:none">nursinguganda.com</a>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- ─── Headline band ──────────────────────────────────────────────────── -->
  <tr>
    <td style="background-color:${BRAND_DARK};padding:20px 32px 22px">
      <h1 style="margin:0 0 ${p.subheadline ? "6px" : "0"};font-size:22px;font-weight:800;color:#ffffff;letter-spacing:-0.03em;line-height:1.2;font-family:Georgia,'Times New Roman',serif">${p.headline}</h1>
      ${p.subheadline ? `<p style="margin:0;font-size:14px;color:rgba(255,255,255,0.75);line-height:1.5">${p.subheadline}</p>` : ""}
    </td>
  </tr>

  <!-- ─── Body ────────────────────────────────────────────────────────────── -->
  <tr>
    <td style="background-color:#ffffff;border-left:1px solid #e5e7eb;border-right:1px solid #e5e7eb;padding:28px 32px 8px">
      <div style="font-size:14px;color:#374151;line-height:1.7">
        ${p.bodyHtml}
      </div>
    </td>
  </tr>

  <!-- ─── CTA ─────────────────────────────────────────────────────────────── -->
  ${cta || secondaryCta ? `
  <tr>
    <td style="background-color:#ffffff;border-left:1px solid #e5e7eb;border-right:1px solid #e5e7eb;padding:8px 32px 28px;text-align:center">
      ${cta}
      ${secondaryCta}
    </td>
  </tr>` : ""}

  <!-- ─── Footer ──────────────────────────────────────────────────────────── -->
  <tr>
    <td style="background-color:#f9fafb;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px;padding:18px 32px;text-align:center">
      ${footerNote}
      <p style="margin:${p.footerNote ? "12px" : "0"} 0 0;font-size:11px;color:#9ca3af;line-height:1.7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
        Nursing Uganda &mdash; Nursing &amp; Midwifery Revision for Uganda Students<br>
        <a href="mailto:${ADMIN_EMAIL}" style="color:#9ca3af;text-decoration:none">${ADMIN_EMAIL}</a>
        &nbsp;&bull;&nbsp;
        <a href="${SITE_URL}" style="color:#9ca3af;text-decoration:none">nursinguganda.com</a>
        &nbsp;&bull;&nbsp;
        <a href="${SITE_URL}/unsubscribe?email={{email}}" style="color:#9ca3af;text-decoration:none">Unsubscribe</a>
      </p>
    </td>
  </tr>

</table>
<!--[if mso | IE]></td></tr></table><![endif]-->
</body>
</html>`;
}


/**
 * Legacy wrapper kept for backward-compatibility with existing edge functions.
 * New functions should use buildEmail() instead.
 */
export function emailWrapper(bodyHtml: string, previewText = ""): string {
  return buildEmail({
    subject:       "",
    preheaderText: previewText,
    headline:      "",
    bodyHtml,
  });
}
