import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { sendAndLog, corsHeaders, BRAND_COLOR, SITE_URL } from "../_shared/mailer.ts";

interface QuestionResult {
  prompt: string;
  selectedLabel: string | null;
  correctLabel: string;
  correct: boolean;
  explanation?: string;
}

interface Payload {
  email: string;
  name?: string;
  quizTitle: string;
  score: number;
  total: number;
  pct: number;
  grade: string;
  questions?: QuestionResult[];
}

function gradeColor(grade: string) {
  return grade === "Distinction" ? "#059669"
       : grade === "Credit"      ? "#2563eb"
       : grade === "Pass"        ? "#d97706"
       : "#dc2626";
}

function gradeMsg(pct: number) {
  return pct >= 80 ? "🏆 Outstanding! Excellent command of this topic — keep that momentum."
       : pct >= 60 ? "👍 Good work. Review the questions you missed and revise those areas."
       : pct >= 50 ? "📚 Satisfactory. Study the explanations below and give it another attempt."
       : "💪 Keep going. Read each explanation carefully — you will improve with practice.";
}

function questionRows(qs: QuestionResult[]) {
  return qs.map((q, i) => {
    const ok = q.correct;
    const ansCol = ok ? "#059669" : "#dc2626";
    return `
    <tr>
      <td style="padding:14px 20px;border-bottom:1px solid #f1f5f9;vertical-align:top">
        <p style="margin:0 0 8px;font-size:14px;font-weight:600;color:#1f2937;line-height:1.4">${i + 1}. ${q.prompt}</p>
        <p style="margin:0 0 4px;font-size:13px;color:${ansCol}">
          ${ok ? "✅" : "❌"} <strong>Your answer:</strong> ${q.selectedLabel ?? "<em style='color:#9ca3af'>Not answered</em>"}
        </p>
        ${!ok ? `<p style="margin:0 0 4px;font-size:13px;color:#059669">✓ <strong>Correct answer:</strong> ${q.correctLabel}</p>` : ""}
        ${q.explanation ? `<p style="margin:6px 0 0;font-size:12px;color:#6b7280;font-style:italic;line-height:1.5;padding:6px 8px;border-left:3px solid #e5e7eb;background:#f9fafb">${q.explanation}</p>` : ""}
      </td>
    </tr>`;
  }).join("");
}

function buildHtml(p: Payload) {
  const gc   = gradeColor(p.grade);
  const date = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const hi   = p.name ? `Hi ${p.name},` : "Hello,";

  const body = `
    <div style="padding:28px 32px 8px">
      <p style="margin:0 0 4px;font-size:15px;color:#374151">${hi}</p>
      <p style="margin:0 0 20px;font-size:13px;color:#6b7280">You completed a quiz on ${date}. Here are your results:</p>

      <p style="margin:0 0 6px;font-size:16px;font-weight:700;color:#111827">${p.quizTitle}</p>

      <!-- Score card -->
      <div style="background:#f0fdf4;border:2px solid #bbf7d0;border-radius:12px;padding:24px;text-align:center;margin:16px 0 20px">
        <div style="font-size:54px;font-weight:800;color:${gc};line-height:1;letter-spacing:-0.03em">${p.pct}%</div>
        <div style="display:inline-block;background:${gc};color:#fff;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;padding:4px 14px;border-radius:999px;margin:8px 0">${p.grade}</div>
        <div style="font-size:14px;color:#374151;margin-top:6px">${p.score} correct out of ${p.total} questions</div>
      </div>

      <p style="margin:0 0 24px;font-size:14px;color:#374151;line-height:1.6">${gradeMsg(p.pct)}</p>
    </div>

    ${p.questions?.length ? `
    <div style="border-top:1px solid #f1f5f9">
      <div style="padding:12px 20px;background:#f9fafb;border-bottom:1px solid #e5e7eb">
        <p style="margin:0;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#6b7280">Question Breakdown</p>
      </div>
      <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse">
        <tbody>${questionRows(p.questions)}</tbody>
      </table>
    </div>` : ""}

    <div style="padding:24px 32px;text-align:center">
      <a href="${SITE_URL}" style="display:inline-block;background:${BRAND_COLOR};color:#fff;text-decoration:none;padding:12px 28px;border-radius:8px;font-size:14px;font-weight:700">
        Continue Studying →
      </a>
    </div>
  `;

  return emailWrapper(body, `You scored ${p.pct}% (${p.grade}) on ${p.quizTitle}`);
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405, headers: corsHeaders });

  try {
    const p: Payload = await req.json();
    if (!p.email || !p.quizTitle) {
      return new Response(JSON.stringify({ error: "Missing email or quizTitle" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const subject = `Your Quiz Results – ${p.quizTitle} (${p.pct}% · ${p.grade})`;
    const ok = await sendAndLog(
      { to: p.email, subject, html: buildHtml(p) },
      "quiz-results",
    );

    return new Response(JSON.stringify({ ok }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("send-quiz-email error:", msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
