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
  const F = `font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif`;
  const SERIF = `font-family:Georgia,'Times New Roman',Times,serif`;

  const preheader = p.preheaderText
    ? `<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;color:#f8fbfc;line-height:1px;white-space:nowrap">${p.preheaderText}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;</div>`
    : "";

  // ── CTA button (gradient via VML for Outlook, CSS gradient elsewhere) ────────
  const cta = p.ctaLabel && p.ctaUrl ? `
    <table cellpadding="0" cellspacing="0" style="margin:0 auto">
      <tr>
        <td align="center" style="border-radius:10px;mso-padding-alt:0">
          <!--[if mso]>
          <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word"
            href="${p.ctaUrl}" style="height:50px;v-text-anchor:middle;width:220px" arcsize="20%"
            fillcolor="${BRAND_COLOR}" strokecolor="${BRAND_DARK}">
            <w:anchorlock/>
            <center style="${F};font-size:15px;font-weight:700;color:#ffffff;letter-spacing:-0.01em">${p.ctaLabel}</center>
          </v:roundrect>
          <![endif]-->
          <!--[if !mso]><!-->
          <a href="${p.ctaUrl}" target="_blank"
             style="display:inline-block;background:linear-gradient(135deg,${BRAND_COLOR} 0%,${BRAND_DARK} 100%);color:#ffffff;text-decoration:none;padding:14px 36px;border-radius:10px;font-size:15px;font-weight:700;letter-spacing:-0.01em;${F};mso-hide:all;border:0;line-height:1.4">
            ${p.ctaLabel}
          </a>
          <!--<![endif]-->
        </td>
      </tr>
    </table>` : "";

  const secondaryCta = p.secondaryCtaLabel && p.secondaryCtaUrl
    ? `<p style="margin:14px 0 0;text-align:center;font-size:13px;color:#9ca3af;${F}">
         or &nbsp;<a href="${p.secondaryCtaUrl}" style="color:${BRAND_COLOR};text-decoration:none;font-weight:600">${p.secondaryCtaLabel}</a>
       </p>` : "";

  const footerNote = p.footerNote
    ? `<tr><td style="padding:0 32px 14px;${F}">
         <p style="margin:0;font-size:11.5px;color:#9ca3af;line-height:1.7;text-align:center">${p.footerNote}</p>
       </td></tr>
       <tr><td style="padding:0 32px 14px"><table width="100%" cellpadding="0" cellspacing="0"><tr><td style="border-top:1px solid #e5e7eb;font-size:0;line-height:0">&nbsp;</td></tr></table></td></tr>` : "";

  return `<!DOCTYPE html>
<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta http-equiv="x-ua-compatible" content="ie=edge">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="x-apple-disable-message-reformatting">
  <title>${p.subject || "Nursing Uganda"}</title>
  <!--[if mso]>
  <xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml>
  <noscript><xml><o:OfficeDocumentSettings><o:AllowPNG/></o:OfficeDocumentSettings></xml></noscript>
  <![endif]-->
</head>
<body style="margin:0;padding:0;background-color:#f0f2f5;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;word-break:break-word">
${preheader}

<!-- ══ Outer wrapper ══════════════════════════════════════════════════════ -->
<table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f0f2f5;min-width:320px">
  <tr>
    <td align="center" style="padding:32px 16px 40px">
      <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="width:600px"><tr><td><![endif]-->
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.09)">

        <!-- ── Accent top stripe ──────────────────────────────────────── -->
        <tr>
          <td height="5" style="background:linear-gradient(90deg,#7a3050 0%,${BRAND_COLOR} 45%,#d472a0 100%);font-size:0;line-height:0">&#8203;</td>
        </tr>

        <!-- ── Brand header ───────────────────────────────────────────── -->
        <tr>
          <td style="background-color:${BRAND_COLOR};padding:22px 32px 20px">
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <!-- Logo mark + wordmark -->
                <td style="vertical-align:middle">
                  <table border="0" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="vertical-align:middle;padding-right:0">
                        <!--[if mso]><table cellpadding="0" cellspacing="0"><tr><td style="width:44px;height:44px"><![endif]-->
                        <img src="${SITE_URL}/assets/images/nursing-uganda-icon-light-transparent.png"
                             alt="NU" width="44" height="44"
                             style="display:block;border-radius:10px;border:2px solid rgba(255,255,255,0.28);background:rgba(255,255,255,0.1)">
                        <!--[if mso]></td><td style="padding-left:12px;vertical-align:middle"><![endif]-->
                      </td>
                      <td style="padding-left:12px;vertical-align:middle">
                        <span style="display:block;font-size:19px;font-weight:800;color:#ffffff;letter-spacing:-0.025em;${SERIF};line-height:1.1">Nursing Uganda</span>
                        <span style="display:block;font-size:10px;color:rgba(255,255,255,0.65);letter-spacing:0.1em;text-transform:uppercase;margin-top:3px;${F}">Notes &amp; Resources</span>
                      </td>
                      <!--[if mso]></tr></table><![endif]-->
                    </tr>
                  </table>
                </td>
                <!-- Site link -->
                <td align="right" style="vertical-align:middle">
                  <a href="${SITE_URL}" style="font-size:11px;color:rgba(255,255,255,0.55);text-decoration:none;${F};letter-spacing:0.03em">nursinguganda.com</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- ── Headline card ──────────────────────────────────────────── -->
        ${p.headline ? `<tr>
          <td style="background-color:#ffffff;padding:28px 32px 20px;border-left:4px solid ${BRAND_COLOR}">
            <h1 style="margin:0 0 ${p.subheadline ? "8px" : "0"};font-size:26px;font-weight:800;color:#111827;letter-spacing:-0.03em;line-height:1.2;${F}">${p.headline}</h1>
            ${p.subheadline ? `<p style="margin:0;font-size:14px;color:#6b7280;line-height:1.55;${F}">${p.subheadline}</p>` : ""}
          </td>
        </tr>` : ""}

        <!-- ── Divider ────────────────────────────────────────────────── -->
        ${p.headline ? `<tr><td style="background-color:#ffffff;padding:0 32px"><table width="100%" cellpadding="0" cellspacing="0"><tr><td height="1" style="background-color:#f3f4f6;font-size:0;line-height:0">&#8203;</td></tr></table></td></tr>` : ""}

        <!-- ── Body ──────────────────────────────────────────────────── -->
        <tr>
          <td style="background-color:#ffffff;padding:24px 32px 8px">
            <div style="font-size:14px;color:#374151;line-height:1.75;${F}">
              ${p.bodyHtml}
            </div>
          </td>
        </tr>

        <!-- ── CTA ───────────────────────────────────────────────────── -->
        ${cta || secondaryCta ? `
        <tr>
          <td style="background-color:#ffffff;padding:20px 32px 32px;text-align:center">
            ${cta}
            ${secondaryCta}
          </td>
        </tr>` : ""}

        <!-- ── Footer ────────────────────────────────────────────────── -->
        <tr>
          <td style="background-color:#f9fafb;border-top:1px solid #e5e7eb;border-radius:0 0 16px 16px;padding:0">
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
              ${footerNote}
              <!-- Brand mark row -->
              <tr>
                <td align="center" style="padding:20px 32px 6px">
                  <table border="0" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="vertical-align:middle;padding-right:8px">
                        <img src="${SITE_URL}/assets/images/nursing-uganda-icon-light-transparent.png"
                             alt="" width="22" height="22"
                             style="display:block;opacity:0.35;border-radius:4px">
                      </td>
                      <td style="vertical-align:middle">
                        <span style="font-size:13px;font-weight:700;color:#9ca3af;letter-spacing:-0.01em;${F}">Nursing Uganda</span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <!-- Links row -->
              <tr>
                <td align="center" style="padding:4px 32px 20px">
                  <p style="margin:0;font-size:11px;color:#b0b7c3;line-height:1.8;${F}">
                    Nursing &amp; Midwifery Revision for Uganda Students<br>
                    <a href="mailto:${ADMIN_EMAIL}" style="color:#b0b7c3;text-decoration:none">${ADMIN_EMAIL}</a>
                    &nbsp;&#8231;&nbsp;
                    <a href="${SITE_URL}" style="color:#b0b7c3;text-decoration:none">nursinguganda.com</a>
                    &nbsp;&#8231;&nbsp;
                    <a href="${SITE_URL}/unsubscribe" style="color:${BRAND_COLOR};text-decoration:none;font-weight:600">Unsubscribe</a>
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

      </table>
      <!--[if mso | IE]></td></tr></table><![endif]-->
    </td>
  </tr>
</table>
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
