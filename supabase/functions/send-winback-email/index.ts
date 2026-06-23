/**
 * send-winback-email
 *
 * Sends a "we miss you" win-back email to a user who hasn't visited
 * in 10+ days.  Called by the check-inactivity cron function.
 *
 * POST body:
 *   {
 *     email:       string,
 *     name?:       string,
 *     days_away:   number,          // days since last activity
 *     is_followup: boolean,         // true → second "final check-in" email
 *     last_path?:  string,          // last URL path they visited
 *   }
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { buildEmail, sendAndLog, corsHeaders, SITE_URL, BRAND_LIGHT } from "../_shared/mailer.ts";

interface Payload {
  email:       string;
  name?:       string;
  days_away?:  number;
  is_followup?: boolean;
  last_path?:  string;
}

function buildBody(firstName: string, daysAway: number, lastPath: string, isFollowup: boolean): string {
  const deepLink  = lastPath ? `${SITE_URL}${lastPath}` : `${SITE_URL}/notes`;
  const daysLabel = daysAway === 1 ? "1 day" : `${daysAway} days`;

  if (isFollowup) {
    // Second email — softer, gives unsubscribe option prominently
    return `
      <p style="margin:0 0 16px;font-size:14px;color:#374151;line-height:1.7">
        Hi ${firstName},
      </p>
      <p style="margin:0 0 16px;font-size:14px;color:#374151;line-height:1.7">
        It's been a while since we last saw you on Nursing Uganda — we just wanted
        to check in one final time.
      </p>
      <p style="margin:0 0 16px;font-size:14px;color:#374151;line-height:1.7">
        Your notes, quiz history, and bookmarks are all still here whenever
        you're ready. No pressure — study at your own pace.
      </p>
      <p style="margin:0;font-size:13px;color:#6b7280;line-height:1.6">
        If you'd prefer not to receive check-in emails, you can
        <a href="${SITE_URL}/unsubscribe" style="color:#A64468;text-decoration:none">unsubscribe here</a>.
      </p>
    `;
  }

  // First win-back email
  return `
    <p style="margin:0 0 16px;font-size:14px;color:#374151;line-height:1.7">
      Hi ${firstName},
    </p>
    <p style="margin:0 0 16px;font-size:14px;color:#374151;line-height:1.7">
      It's been <strong>${daysLabel}</strong> since you last studied on Nursing Uganda,
      and we miss you! 👋
    </p>
    <p style="margin:0 0 20px;font-size:14px;color:#374151;line-height:1.7">
      Your progress, bookmarks, and quiz scores are all still saved — pick up
      exactly where you left off.
    </p>

    <!-- Highlight box -->
    <table cellpadding="0" cellspacing="0" width="100%"
      style="background-color:#fdf2f7;border:1.5px solid #f5c6dc;border-radius:10px;margin-bottom:20px">
      <tr>
        <td style="padding:18px 22px">
          <p style="margin:0 0 10px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#A64468">
            What's waiting for you
          </p>
          ${[
            ["📖", "Your notes are right where you left them — continue your last topic."],
            ["🎯", "Take a quick quiz to refresh your memory in just 5 minutes."],
            ["🃏", "New flashcards have been added to help you revise faster."],
            ["🏆", "The weekly leaderboard has reset — a fresh chance to top the scores."],
          ].map(([emoji, text]) => `
            <table cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:8px">
              <tr>
                <td style="width:22px;font-size:15px;vertical-align:top;padding-top:1px">${emoji}</td>
                <td style="padding-left:10px;font-size:13px;color:#374151;line-height:1.5;vertical-align:top">${text}</td>
              </tr>
            </table>
          `).join("")}
        </td>
      </tr>
    </table>

    <p style="margin:0;font-size:14px;color:#374151;line-height:1.7">
      Every day counts when you're preparing for your exams. Come back and
      keep that study streak going! 💪
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
    const daysAway  = Math.max(1, Math.round(p.days_away ?? 10));
    const lastPath  = p.last_path || "/notes";
    const isFollowup = !!p.is_followup;

    const subject = isFollowup
      ? `A final check-in from Nursing Uganda, ${firstName} 👋`
      : `We miss you, ${firstName} 👋`;

    const deepLink = lastPath ? `${SITE_URL}${lastPath}` : `${SITE_URL}/notes`;

    const html = buildEmail({
      subject,
      preheaderText: isFollowup
        ? "Just checking in — your notes and progress are still here when you need them."
        : `It's been ${daysAway} days since your last study session. Come back and keep the momentum going!`,
      headline:    isFollowup ? `Still thinking of you, ${firstName}` : `We miss you, ${firstName}!`,
      subheadline: isFollowup
        ? "Your notes are still here whenever you're ready."
        : `${daysAway} days since your last study session.`,
      bodyHtml:    buildBody(firstName, daysAway, lastPath, isFollowup),
      ctaLabel:    isFollowup ? "Come Back →" : "Continue Studying →",
      ctaUrl:      deepLink,
      footerNote:  `You're receiving this because you have a Nursing Uganda account and haven't been active recently. <a href="${SITE_URL}/unsubscribe" style="color:#9ca3af">Unsubscribe from check-in emails</a>.`,
    });

    const ok = await sendAndLog(
      { to: p.email, subject, html },
      isFollowup ? "winback-followup" : "winback-first",
    );

    return new Response(
      JSON.stringify({ ok }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("send-winback-email error:", msg);
    return new Response(
      JSON.stringify({ error: msg }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
