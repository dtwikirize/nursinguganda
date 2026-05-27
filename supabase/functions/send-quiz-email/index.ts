import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? "";
const FROM_EMAIL = "quiz@nursinguganda.com";
const SITE_NAME  = "Nursing Uganda";
const SITE_URL   = "https://nursinguganda.com";
const BRAND_COLOR = "#0f7f4f";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface QuestionResult {
  prompt: string;
  selectedLabel: string | null;
  correctLabel: string;
  correct: boolean;
  explanation?: string;
}

interface EmailPayload {
  email: string;
  name?: string;
  quizTitle: string;
  score: number;
  total: number;
  pct: number;
  grade: string;
  questions?: QuestionResult[];
}

function gradeColor(grade: string): string {
  return grade === "Distinction" ? "#059669"
       : grade === "Credit"      ? "#2563eb"
       : grade === "Pass"        ? "#d97706"
       : "#dc2626";
}

function gradeEmoji(pct: number): string {
  return pct >= 80 ? "🏆" : pct >= 60 ? "👍" : pct >= 50 ? "📚" : "💪";
}

function gradeMessage(pct: number): string {
  return pct >= 80 ? "Outstanding! You have an excellent grasp of this topic. Keep it up!"
       : pct >= 60 ? "Good work. Review the questions you missed and your knowledge will be solid."
       : pct >= 50 ? "Satisfactory. Study the explanations below and give it another try."
       : "Keep going. Review the explanations below — every attempt makes you stronger.";
}

function buildQuestionRows(questions: QuestionResult[]): string {
  return questions.map((q, i) => {
    const tick = q.correct ? "✅" : "❌";
    const answerColor = q.correct ? "#059669" : "#dc2626";
    return `
      <tr>
        <td style="padding:14px 20px;border-bottom:1px solid #f1f5f9;vertical-align:top">
          <p style="margin:0 0 8px;font-size:14px;font-weight:600;color:#1f2937;line-height:1.4">
            ${i + 1}. ${q.prompt}
          </p>
          <p style="margin:0 0 4px;font-size:13px;color:${answerColor}">
            ${tick} <strong>Your answer:</strong> ${q.selectedLabel ?? "<em>Not answered</em>"}
          </p>
          ${!q.correct ? `
            <p style="margin:0 0 4px;font-size:13px;color:#059669">
              ✓ <strong>Correct answer:</strong> ${q.correctLabel}
            </p>
          ` : ""}
          ${q.explanation ? `
            <p style="margin:6px 0 0;font-size:12px;color:#6b7280;font-style:italic;line-height:1.4;padding-left:4px;border-left:3px solid #e5e7eb">
              ${q.explanation}
            </p>
          ` : ""}
        </td>
      </tr>
    `;
  }).join("");
}

function buildEmailHtml(p: EmailPayload): string {
  const gc = gradeColor(p.grade);
  const dateStr = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const greeting = p.name ? `Hi ${p.name},` : "Hello,";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Quiz Results – ${p.quizTitle}</title>
</head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
  <div style="max-width:600px;margin:0 auto;padding:32px 16px">

    <!-- Header -->
    <div style="background:${BRAND_COLOR};border-radius:14px 14px 0 0;padding:28px 32px;text-align:center">
      <p style="margin:0 0 4px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:#a7f3d0">Nursing Uganda</p>
      <h1 style="margin:0;font-size:24px;font-weight:800;color:#ffffff;letter-spacing:-0.02em">Quiz Results</h1>
      <p style="margin:8px 0 0;font-size:13px;color:#bbf7d0">${p.quizTitle}</p>
    </div>

    <!-- Greeting -->
    <div style="background:#ffffff;padding:24px 32px 0;border:1px solid #e5e7eb;border-top:none">
      <p style="margin:0;font-size:15px;color:#374151">${greeting}</p>
      <p style="margin:8px 0 0;font-size:14px;color:#6b7280">You completed the quiz on ${dateStr}. Here are your results:</p>
    </div>

    <!-- Score card -->
    <div style="background:#ffffff;padding:20px 32px 24px;border:1px solid #e5e7eb;border-top:none">
      <div style="background:#f0fdf4;border:2px solid #bbf7d0;border-radius:12px;padding:24px;text-align:center">
        <div style="font-size:56px;font-weight:800;color:${gc};line-height:1;letter-spacing:-0.03em">${p.pct}%</div>
        <div style="display:inline-block;background:${gc};color:#fff;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;padding:4px 14px;border-radius:999px;margin:8px 0">${p.grade}</div>
        <div style="font-size:14px;color:#374151;margin-top:6px">${p.score} correct out of ${p.total} questions</div>
      </div>
      <p style="margin:16px 0 0;font-size:14px;color:#374151;line-height:1.6">
        ${gradeEmoji(p.pct)} ${gradeMessage(p.pct)}
      </p>
    </div>

    ${p.questions?.length ? `
    <!-- Question breakdown -->
    <div style="background:#ffffff;border:1px solid #e5e7eb;border-top:none;margin-top:1px">
      <div style="padding:14px 20px;background:#f9fafb;border-bottom:1px solid #e5e7eb">
        <h2 style="margin:0;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#6b7280">Question Breakdown</h2>
      </div>
      <table style="width:100%;border-collapse:collapse">
        <tbody>${buildQuestionRows(p.questions)}</tbody>
      </table>
    </div>
    ` : ""}

    <!-- CTA -->
    <div style="background:#ffffff;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 14px 14px;padding:24px 32px;text-align:center;margin-top:1px">
      <a href="${SITE_URL}" style="display:inline-block;background:${BRAND_COLOR};color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:8px;font-size:14px;font-weight:700;letter-spacing:.01em">
        Continue Studying →
      </a>
      <p style="margin:16px 0 0;font-size:11px;color:#9ca3af">
        ${SITE_NAME} · Nursing &amp; Midwifery Revision for Uganda Students<br>
        <a href="${SITE_URL}" style="color:#9ca3af">${SITE_URL}</a>
      </p>
    </div>

  </div>
</body>
</html>`;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }

  try {
    const payload: EmailPayload = await req.json();

    if (!payload.email || !payload.quizTitle) {
      return new Response(JSON.stringify({ error: "Missing email or quizTitle" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!RESEND_API_KEY) {
      return new Response(JSON.stringify({ error: "Email service not configured" }), {
        status: 503,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const html = buildEmailHtml(payload);

    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `${SITE_NAME} <${FROM_EMAIL}>`,
        to: [payload.email],
        subject: `Your Quiz Results – ${payload.quizTitle} (${payload.pct}% · ${payload.grade})`,
        html,
      }),
    });

    const resendData = await resendRes.json();

    if (!resendRes.ok) {
      console.error("Resend error:", resendData);
      throw new Error(resendData.message ?? "Email delivery failed");
    }

    return new Response(JSON.stringify({ ok: true, id: resendData.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
