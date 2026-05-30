/**
 * send-welcome-email
 *
 * Triggered immediately after a user creates an account (when email
 * confirmation is disabled and a session is returned at sign-up).
 *
 * POST body:
 *   { email: string, name?: string }
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { buildEmail, sendAndLog, corsHeaders, SITE_URL, BRAND_COLOR } from "../_shared/mailer.ts";

interface Payload {
  email: string;
  name?:  string;
}

function buildBody(firstName: string): string {
  return `
    <p style="margin:0 0 16px;font-size:15px;color:#111827;font-weight:700">
      Welcome to Nursing Uganda, ${firstName}! 🎉
    </p>
    <p style="margin:0 0 20px;font-size:14px;color:#374151;line-height:1.7">
      You now have free access to structured nursing and midwifery revision notes,
      quizzes, flashcards, and career guides — everything you need to study
      smarter and revise better.
    </p>

    <!-- Quick-start steps -->
    <table cellpadding="0" cellspacing="0" width="100%"
      style="background-color:#fdf2f7;border:1.5px solid #f5c6dc;border-radius:10px;margin-bottom:20px">
      <tr>
        <td style="padding:18px 22px">
          <p style="margin:0 0 12px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#A64468">
            Get started in 5 steps
          </p>
          ${[
            ["📚", "Browse courses", "Go to <strong>Courses → Curriculum</strong> and choose your programme — CCN, Diploma or BSN."],
            ["🎯", "Take a quiz",    "Open any lesson and hit <strong>Take Quiz</strong> to test yourself immediately."],
            ["🃏", "Use flashcards", "Tap <strong>Flashcards</strong> inside any topic for fast spaced-repetition revision."],
            ["🔖", "Save bookmarks", "Bookmark lessons you want to revisit — they sync across all your devices."],
            ["📊", "Track progress", "Visit <strong>My Progress</strong> to see your completion and quiz scores at a glance."],
          ].map(([emoji, title, desc]) => `
            <table cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:10px">
              <tr>
                <td style="width:28px;vertical-align:top;padding-top:2px;font-size:16px">${emoji}</td>
                <td style="vertical-align:top;padding-left:10px">
                  <p style="margin:0;font-size:13px;color:#374151;line-height:1.5">
                    <strong style="color:#111827">${title}</strong> — ${desc}
                  </p>
                </td>
              </tr>
            </table>
          `).join("")}
        </td>
      </tr>
    </table>

    <p style="margin:0;font-size:13px;color:#6b7280;line-height:1.6">
      If you ever have a question, reply to this email — we read every message.
      Good luck with your studies! 🌟
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
    const subject   = `Welcome to Nursing Uganda, ${firstName}! 🎉`;

    const html = buildEmail({
      subject,
      preheaderText: `Your free nursing & midwifery revision account is ready — here's how to get started.`,
      headline:      `Welcome aboard, ${firstName}!`,
      subheadline:   "Your free revision account is ready.",
      bodyHtml:      buildBody(firstName),
      ctaLabel:      "Start Studying →",
      ctaUrl:        `${SITE_URL}/notes`,
      footerNote:    "You're receiving this because you just created a Nursing Uganda account. If this wasn't you, you can safely ignore this email.",
    });

    const ok = await sendAndLog({ to: p.email, subject, html }, "welcome");

    return new Response(
      JSON.stringify({ ok }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("send-welcome-email error:", msg);
    return new Response(
      JSON.stringify({ error: msg }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
