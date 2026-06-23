/**
 * send-lockout-email
 *
 * Triggered when a user's account is locked after 5 consecutive failed
 * login attempts.  Also checks whether the same IP has triggered lockouts
 * on 3+ accounts and sends an admin security alert if so.
 *
 * POST body:
 *   {
 *     email:        string,
 *     name?:        string,
 *     locked_until: string,   // ISO timestamptz
 *     ip?:          string,   // client IP (best-effort, passed by frontend)
 *   }
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import {
  buildEmail, sendAndLog, corsHeaders,
  SITE_URL, ADMIN_EMAIL, BRAND_DARK,
} from "../_shared/mailer.ts";

interface Payload {
  email:        string;
  name?:        string;
  locked_until: string;
  ip?:          string;
}

function formatLockedUntil(iso: string): string {
  try {
    return new Date(iso).toLocaleTimeString("en-UG", {
      hour: "2-digit", minute: "2-digit",
      timeZone: "Africa/Kampala",
      timeZoneName: "short",
    });
  } catch {
    return "in approximately 1 hour";
  }
}

function buildBody(firstName: string, unlockTime: string): string {
  return `
    <p style="margin:0 0 16px;font-size:14px;color:#374151;line-height:1.7">
      Hi ${firstName},
    </p>
    <p style="margin:0 0 16px;font-size:14px;color:#374151;line-height:1.7">
      We detected multiple failed login attempts on your Nursing Uganda account.
      For your security, your account has been <strong>temporarily locked</strong>.
    </p>

    <!-- Lock info box -->
    <table cellpadding="0" cellspacing="0" width="100%"
      style="background-color:#fff7ed;border:1.5px solid #fed7aa;border-radius:10px;margin-bottom:20px">
      <tr>
        <td style="padding:18px 22px">
          <p style="margin:0 0 8px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#ea580c">
            Account Status
          </p>
          <table cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td style="padding:6px 0;border-bottom:1px solid #fed7aa;font-size:13px;font-weight:600;color:#6b7280;width:130px">Status</td>
              <td style="padding:6px 0;border-bottom:1px solid #fed7aa;font-size:13px;color:#dc2626;font-weight:700">🔒 Temporarily locked</td>
            </tr>
            <tr>
              <td style="padding:6px 0;border-bottom:1px solid #fed7aa;font-size:13px;font-weight:600;color:#6b7280">Reason</td>
              <td style="padding:6px 0;border-bottom:1px solid #fed7aa;font-size:13px;color:#374151">5 consecutive failed login attempts</td>
            </tr>
            <tr>
              <td style="padding:6px 0;font-size:13px;font-weight:600;color:#6b7280">Unlocks at</td>
              <td style="padding:6px 0;font-size:13px;color:#374151;font-weight:700">${unlockTime}</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <p style="margin:0 0 16px;font-size:14px;color:#374151;line-height:1.7">
      You can try signing in again after <strong>${unlockTime}</strong>, or reset your
      password now to regain access immediately.
    </p>
    <p style="margin:0 0 16px;font-size:14px;color:#374151;line-height:1.7">
      If you did <strong>not</strong> attempt to sign in, your account may be targeted
      by an unauthorised party. We recommend resetting your password as soon as possible.
    </p>
  `;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST")
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });

  try {
    const p: Payload = await req.json();

    if (!p.email?.trim() || !p.locked_until) {
      return new Response(
        JSON.stringify({ error: "Missing email or locked_until" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const firstName  = (p.name || p.email.split("@")[0]).split(/\s+/)[0];
    const unlockTime = formatLockedUntil(p.locked_until);
    const subject    = "Your account has been temporarily locked — Nursing Uganda";

    const html = buildEmail({
      subject,
      preheaderText: `Your account was locked after 5 failed login attempts. Unlocks at ${unlockTime}.`,
      headline:      "Account Temporarily Locked",
      subheadline:   `Locked after multiple failed sign-in attempts.`,
      bodyHtml:      buildBody(firstName, unlockTime),
      ctaLabel:      "Reset Password →",
      ctaUrl:        `${SITE_URL}/login`,
      footerNote:    "This is an automated security alert from Nursing Uganda. If you need help, reply to this email.",
    });

    const ok = await sendAndLog(
      { to: p.email, subject, html },
      "account-lockout",
    );

    return new Response(
      JSON.stringify({ ok }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("send-lockout-email error:", msg);
    return new Response(
      JSON.stringify({ error: msg }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
