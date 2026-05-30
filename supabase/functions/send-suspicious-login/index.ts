/**
 * send-suspicious-login
 *
 * Triggered when a user logs in from a device fingerprint not seen before.
 * Sends a security alert with "This was me" and "Secure my account" CTAs.
 *
 * POST body:
 *   {
 *     email:   string,
 *     name?:   string,
 *     device:  {
 *       userAgent: string,
 *       timezone:  string,
 *       language:  string,
 *       date:      string,   // human-readable login time
 *     }
 *   }
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { buildEmail, sendAndLog, corsHeaders, SITE_URL } from "../_shared/mailer.ts";

interface DeviceInfo {
  userAgent?: string;
  timezone?:  string;
  language?:  string;
  date?:      string;
}

interface Payload {
  email:   string;
  name?:   string;
  device?: DeviceInfo;
}

/** Derive a human-readable browser/device label from a User-Agent string. */
function parseUA(ua: string = ""): { browser: string; os: string } {
  let browser = "Unknown browser";
  let os      = "Unknown OS";

  if (/Chrome\/[0-9]/.test(ua) && !/Chromium|Edg\//.test(ua)) browser = "Google Chrome";
  else if (/Firefox\//.test(ua))                                  browser = "Mozilla Firefox";
  else if (/Edg\//.test(ua))                                      browser = "Microsoft Edge";
  else if (/Safari\//.test(ua) && !/Chrome/.test(ua))            browser = "Apple Safari";
  else if (/OPR\/|Opera\//.test(ua))                              browser = "Opera";

  if (/Windows NT 10/.test(ua))      os = "Windows 10 / 11";
  else if (/Windows NT 6/.test(ua))  os = "Windows 7 / 8";
  else if (/Mac OS X/.test(ua))      os = "macOS";
  else if (/Android/.test(ua))       os = "Android";
  else if (/iPhone|iPad/.test(ua))   os = "iOS";
  else if (/Linux/.test(ua))         os = "Linux";

  return { browser, os };
}

function buildBody(firstName: string, device: DeviceInfo): string {
  const { browser, os } = parseUA(device.userAgent);
  const tz   = device.timezone  || "Unknown timezone";
  const date = device.date      || new Date().toLocaleString();

  return `
    <p style="margin:0 0 16px;font-size:14px;color:#374151;line-height:1.7">
      Hi ${firstName},
    </p>
    <p style="margin:0 0 16px;font-size:14px;color:#374151;line-height:1.7">
      We detected a new sign-in to your Nursing Uganda account from a device
      or browser we haven't seen before.
    </p>

    <!-- Device info box -->
    <table cellpadding="0" cellspacing="0" width="100%"
      style="background-color:#eff6ff;border:1.5px solid #bfdbfe;border-radius:10px;margin-bottom:20px">
      <tr>
        <td style="padding:18px 22px">
          <p style="margin:0 0 10px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#2563eb">
            Sign-In Details
          </p>
          ${[
            ["🌐", "Browser",  browser],
            ["💻", "Device",   os],
            ["🕐", "Date / Time", date],
            ["🌍", "Timezone", tz],
          ].map(([icon, label, value]) => `
            <table cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:6px">
              <tr>
                <td style="width:16px;font-size:14px;vertical-align:middle">${icon}</td>
                <td style="padding-left:10px;width:100px;font-size:13px;font-weight:600;color:#6b7280;vertical-align:middle">${label}</td>
                <td style="font-size:13px;color:#1e40af;font-weight:600;vertical-align:middle">${value}</td>
              </tr>
            </table>
          `).join("")}
        </td>
      </tr>
    </table>

    <p style="margin:0 0 16px;font-size:14px;color:#374151;line-height:1.7">
      <strong>Was this you?</strong> If so, no action is needed — click the button below
      to confirm it was you.
    </p>
    <p style="margin:0;font-size:14px;color:#374151;line-height:1.7">
      If you <strong>do not recognise this sign-in</strong>, click
      <em>"Secure my account"</em> to immediately reset your password and
      revoke all active sessions.
    </p>
  `;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST")
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });

  try {
    const p: Payload = await req.json();

    if (!p.email?.trim()) {
      return new Response(
        JSON.stringify({ error: "Missing email" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const firstName = (p.name || p.email.split("@")[0]).split(/\s+/)[0];
    const device    = p.device || {};
    const subject   = "New sign-in to your Nursing Uganda account detected";

    const html = buildEmail({
      subject,
      preheaderText: "A new device or browser just signed into your account. Was this you?",
      headline:      "New Sign-In Detected",
      subheadline:   "A new device signed into your account.",
      bodyHtml:      buildBody(firstName, device),
      ctaLabel:      "This Was Me ✓",
      ctaUrl:        `${SITE_URL}/login?confirm=1`,
      secondaryCtaLabel: "Secure My Account →",
      secondaryCtaUrl:   `${SITE_URL}/login?secure=1`,
      footerNote:    "If you recognise this sign-in, no action is needed. If not, change your password immediately.",
    });

    const ok = await sendAndLog(
      { to: p.email, subject, html },
      "suspicious-login",
    );

    return new Response(
      JSON.stringify({ ok }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("send-suspicious-login error:", msg);
    return new Response(
      JSON.stringify({ error: msg }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
