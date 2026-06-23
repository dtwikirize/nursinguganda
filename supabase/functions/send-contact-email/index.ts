import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { sendEmail, buildEmail, ADMIN_EMAIL, BRAND_COLOR, SITE_URL } from "../_shared/mailer.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface Payload {
  name: string;
  email: string;
  subject: string;
  message: string;
  type?: string;   // "general" | "correction" | "takedown" | "partnership" | "bug"
}

const F = `font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif`;

/** Email TO admin — contains the user's message */
function adminNotificationHtml(p: Payload, date: string) {
  const typeLabel: Record<string, string> = {
    general:     "General Enquiry",
    correction:  "Content Correction",
    takedown:    "Takedown Request",
    partnership: "Partnership / Collaboration",
    bug:         "Bug Report",
  };
  const label = typeLabel[p.type ?? "general"] ?? "Contact Form";

  const bodyHtml = `
    <p style="margin:0 0 6px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#6b7280;${F}">New ${label}</p>
    <h2 style="margin:0 0 20px;font-size:20px;font-weight:800;color:#111827;${F}">${p.subject}</h2>

    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:20px">
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;width:120px;font-size:13px;font-weight:600;color:#6b7280;vertical-align:top;${F}">From</td>
        <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;font-size:13px;color:#111827;${F}">
          ${p.name} &lt;<a href="mailto:${p.email}" style="color:${BRAND_COLOR};text-decoration:none;font-weight:600">${p.email}</a>&gt;
        </td>
      </tr>
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;font-size:13px;font-weight:600;color:#6b7280;vertical-align:top;${F}">Type</td>
        <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;font-size:13px;color:#111827;${F}">${label}</td>
      </tr>
      <tr>
        <td style="padding:10px 0;font-size:13px;font-weight:600;color:#6b7280;vertical-align:top;${F}">Date</td>
        <td style="padding:10px 0;font-size:13px;color:#111827;${F}">${date}</td>
      </tr>
    </table>

    <div style="background:#fdf2f7;border:1.5px solid rgba(166,68,104,.2);border-radius:10px;padding:16px 20px;margin-bottom:24px">
      <p style="margin:0 0 8px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#A64468;${F}">Message</p>
      <p style="margin:0;font-size:14px;color:#374151;line-height:1.7;white-space:pre-wrap;${F}">${p.message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>
    </div>
  `;

  return buildEmail({
    subject:       `[Contact] ${p.subject} — from ${p.name}`,
    preheaderText: `New ${label} from ${p.name}: ${p.subject}`,
    headline:      `New ${label}`,
    subheadline:   `From ${p.name} · ${date}`,
    bodyHtml,
    ctaLabel:      `Reply to ${p.name} →`,
    ctaUrl:        `mailto:${p.email}?subject=Re: ${encodeURIComponent(p.subject)}`,
    footerNote:    "This message was submitted via the Nursing Uganda contact form.",
  });
}

/** Confirmation email TO the sender */
function userConfirmationHtml(p: Payload, date: string) {
  const bodyHtml = `
    <p style="margin:0 0 16px;font-size:15px;color:#374151;${F}">Hi ${p.name},</p>
    <p style="margin:0 0 20px;font-size:14px;color:#374151;line-height:1.7;${F}">
      Thank you for reaching out to Nursing Uganda. We have received your message
      and will get back to you within <strong>1–2 business days</strong>.
    </p>

    <!-- Summary box -->
    <table border="0" cellpadding="0" cellspacing="0" width="100%"
      style="background:linear-gradient(135deg,#fdf2f7 0%,#fce7f3 100%);border:1.5px solid rgba(166,68,104,.18);border-radius:12px;margin-bottom:24px">
      <tr>
        <td style="padding:18px 20px">
          <p style="margin:0 0 10px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#A64468;${F}">Your Message Summary</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse">
            <tr>
              <td style="padding:5px 0;font-size:13px;font-weight:600;color:#6b7280;width:80px;${F}">Subject</td>
              <td style="padding:5px 0;font-size:13px;color:#111827;font-weight:700;${F}">${p.subject}</td>
            </tr>
            <tr>
              <td style="padding:5px 0;font-size:13px;font-weight:600;color:#6b7280;${F}">Sent</td>
              <td style="padding:5px 0;font-size:13px;color:#374151;${F}">${date}</td>
            </tr>
          </table>
          <p style="margin:12px 0 0;font-size:13px;color:#374151;line-height:1.6;border-top:1px solid rgba(166,68,104,.1);padding-top:10px;${F}">${
            p.message.length > 280 ? p.message.slice(0, 280).replace(/</g, "&lt;") + "…" : p.message.replace(/</g, "&lt;").replace(/>/g, "&gt;")
          }</p>
        </td>
      </tr>
    </table>

    <p style="margin:0 0 8px;font-size:13px;color:#6b7280;line-height:1.6;${F}">
      While you wait, keep revising — notes, quizzes, flashcards and the dictionary are always free.
    </p>
    <p style="margin:0;font-size:12px;color:#9ca3af;${F}">
      If you did not send this message, please ignore this email.
    </p>
  `;

  return buildEmail({
    subject:       `We received your message – Nursing Uganda`,
    preheaderText: `Thanks for getting in touch — we'll reply within 1–2 business days.`,
    headline:      "Message Received",
    subheadline:   "We'll be in touch shortly",
    bodyHtml,
    ctaLabel:      "Continue Studying →",
    ctaUrl:        SITE_URL,
    footerNote:    "You received this because you submitted the Nursing Uganda contact form.",
  });
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405, headers: corsHeaders });

  try {
    const p: Payload = await req.json();

    if (!p.name?.trim() || !p.email?.trim() || !p.subject?.trim() || !p.message?.trim()) {
      return new Response(JSON.stringify({ error: "All fields are required." }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email)) {
      return new Response(JSON.stringify({ error: "Invalid email address." }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const date = new Date().toLocaleDateString("en-GB", {
      day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
    });

    await Promise.all([
      sendEmail({
        to: ADMIN_EMAIL,
        subject: `[Contact] ${p.subject} — from ${p.name}`,
        html: adminNotificationHtml(p, date),
        replyTo: p.email,
      }),
      sendEmail({
        to: p.email,
        subject: `We received your message – Nursing Uganda`,
        html: userConfirmationHtml(p, date),
      }),
    ]);

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("send-contact-email error:", msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
