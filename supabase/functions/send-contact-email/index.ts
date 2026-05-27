import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { sendEmail, emailWrapper, ADMIN_EMAIL, BRAND_COLOR, SITE_URL } from "../_shared/mailer.ts";

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

/** Email TO admin — contains the user's message */
function adminNotificationHtml(p: Payload, date: string) {
  const typeLabel: Record<string, string> = {
    general: "General Enquiry",
    correction: "Content Correction",
    takedown: "Takedown Request",
    partnership: "Partnership / Collaboration",
    bug: "Bug Report",
  };
  const label = typeLabel[p.type ?? "general"] ?? "Contact Form";

  const body = `
    <div style="padding:28px 32px">
      <p style="margin:0 0 6px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#6b7280">New ${label}</p>
      <h2 style="margin:0 0 20px;font-size:20px;font-weight:800;color:#111827">${p.subject}</h2>

      <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:20px">
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;width:120px;font-size:13px;font-weight:600;color:#6b7280;vertical-align:top">From</td>
          <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;font-size:13px;color:#111827">${p.name} &lt;<a href="mailto:${p.email}" style="color:#0f7f4f">${p.email}</a>&gt;</td>
        </tr>
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;font-size:13px;font-weight:600;color:#6b7280;vertical-align:top">Type</td>
          <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;font-size:13px;color:#111827">${label}</td>
        </tr>
        <tr>
          <td style="padding:10px 0;font-size:13px;font-weight:600;color:#6b7280;vertical-align:top">Date</td>
          <td style="padding:10px 0;font-size:13px;color:#111827">${date}</td>
        </tr>
      </table>

      <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:16px 20px;margin-bottom:20px">
        <p style="margin:0 0 6px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#9ca3af">Message</p>
        <p style="margin:0;font-size:14px;color:#374151;line-height:1.7;white-space:pre-wrap">${p.message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>
      </div>

      <a href="mailto:${p.email}?subject=Re: ${encodeURIComponent(p.subject)}" style="display:inline-block;background:${BRAND_COLOR};color:#fff;text-decoration:none;padding:10px 22px;border-radius:8px;font-size:13px;font-weight:700">
        Reply to ${p.name} →
      </a>
    </div>
  `;
  return emailWrapper(body, `New ${label}: ${p.subject}`);
}

/** Confirmation email TO the sender */
function userConfirmationHtml(p: Payload, date: string) {
  const body = `
    <div style="padding:28px 32px">
      <p style="margin:0 0 16px;font-size:15px;color:#374151">Hi ${p.name},</p>
      <p style="margin:0 0 20px;font-size:14px;color:#374151;line-height:1.6">
        Thank you for reaching out to Nursing Uganda. We have received your message and will get back to you within <strong>1–2 business days</strong>.
      </p>

      <!-- Summary box -->
      <div style="background:#f0fdf4;border:1.5px solid #bbf7d0;border-radius:10px;padding:18px 20px;margin-bottom:24px">
        <p style="margin:0 0 6px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#059669">Your Message Summary</p>
        <p style="margin:0 0 4px;font-size:13px;color:#374151"><strong>Subject:</strong> ${p.subject}</p>
        <p style="margin:0 0 8px;font-size:13px;color:#374151"><strong>Sent:</strong> ${date}</p>
        <p style="margin:0;font-size:13px;color:#374151;white-space:pre-wrap;line-height:1.6">${p.message.length > 300 ? p.message.slice(0, 300).replace(/</g, "&lt;") + "…" : p.message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>
      </div>

      <p style="margin:0 0 20px;font-size:13px;color:#6b7280;line-height:1.6">
        While you wait, keep revising with Nursing Uganda — our notes, quizzes and dictionary are always available free.
      </p>

      <a href="${SITE_URL}" style="display:inline-block;background:${BRAND_COLOR};color:#fff;text-decoration:none;padding:11px 24px;border-radius:8px;font-size:14px;font-weight:700">
        Back to Study →
      </a>

      <p style="margin:20px 0 0;font-size:12px;color:#9ca3af">
        If you did not send this message, please ignore this email.
        Replies go directly to <a href="mailto:${ADMIN_EMAIL}" style="color:#0f7f4f">${ADMIN_EMAIL}</a>.
      </p>
    </div>
  `;
  return emailWrapper(body, `We received your message – Nursing Uganda`);
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

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email)) {
      return new Response(JSON.stringify({ error: "Invalid email address." }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const date = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });

    // Send both in parallel
    await Promise.all([
      // 1. Admin notification (to info@nursinguganda.com)
      sendEmail({
        to: ADMIN_EMAIL,
        subject: `[Contact] ${p.subject} — from ${p.name}`,
        html: adminNotificationHtml(p, date),
        replyTo: p.email,
      }),
      // 2. User confirmation
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
