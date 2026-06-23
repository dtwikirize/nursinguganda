import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { buildEmail, sendAndLog, corsHeaders, BRAND_COLOR, SITE_URL } from "../_shared/mailer.ts";

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
  return grade === "Distinction" ? BRAND_COLOR
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
  const F = `font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif`;
  return qs.map((q, i) => {
    const ok = q.correct;
    const ansCol = ok ? BRAND_COLOR : "#dc2626";
    return `
    <tr>
      <td style="padding:14px 16px;border-bottom:1px solid #f3f4f6;vertical-align:top">
        <p style="margin:0 0 7px;font-size:13px;font-weight:600;color:#1f2937;line-height:1.4;${F}">${i + 1}. ${q.prompt}</p>
        <p style="margin:0 0 3px;font-size:12px;color:${ansCol};${F}">
          ${ok ? "✅" : "❌"}&nbsp;<strong>Your answer:</strong>&nbsp;${q.selectedLabel ?? "<em style='color:#9ca3af'>Not answered</em>"}
        </p>
        ${!ok ? `<p style="margin:0 0 3px;font-size:12px;color:${BRAND_COLOR};${F}">✓&nbsp;<strong>Correct answer:</strong>&nbsp;${q.correctLabel}</p>` : ""}
        ${q.explanation ? `<p style="margin:6px 0 0;font-size:11.5px;color:#6b7280;font-style:italic;line-height:1.5;padding:6px 10px;border-left:3px solid rgba(166,68,104,0.3);background:#fdf2f7;${F}">${q.explanation}</p>` : ""}
      </td>
    </tr>`;
  }).join("");
}

function buildHtml(p: Payload) {
  const gc   = gradeColor(p.grade);
  const date = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const hi   = p.name ? `Hi ${p.name},` : "Hello,";
  const F    = `font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif`;

  const bodyHtml = `
    <p style="margin:0 0 4px;font-size:15px;color:#374151;${F}">${hi}</p>
    <p style="margin:0 0 20px;font-size:13px;color:#9ca3af;${F}">Quiz completed on ${date}</p>

    <!-- Score card -->
    <table border="0" cellpadding="0" cellspacing="0" width="100%"
      style="background:linear-gradient(135deg,#fdf2f7 0%,#fce7f3 100%);border:2px solid rgba(166,68,104,0.2);border-radius:14px;margin-bottom:20px">
      <tr>
        <td style="padding:24px;text-align:center">
          <div style="font-size:60px;font-weight:800;color:${gc};line-height:1;letter-spacing:-0.04em;${F}">${p.pct}%</div>
          <div style="display:inline-block;background:${gc};color:#fff;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;padding:5px 16px;border-radius:999px;margin:10px 0 6px">${p.grade}</div>
          <div style="font-size:13px;color:#6b7280;margin-top:4px;${F}">${p.score} correct out of ${p.total} questions</div>
        </td>
      </tr>
    </table>

    <p style="margin:0 0 16px;font-size:14px;color:#374151;line-height:1.7;${F}">${gradeMsg(p.pct)}</p>

    ${p.questions?.length ? `
    <!-- Question breakdown -->
    <table border="0" cellpadding="0" cellspacing="0" width="100%"
      style="border:1px solid #e5e7eb;border-radius:10px;overflow:hidden;margin-top:8px">
      <tr>
        <td style="background:#f9fafb;padding:10px 16px;border-bottom:1px solid #e5e7eb">
          <p style="margin:0;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:#9ca3af;${F}">Question Breakdown</p>
        </td>
      </tr>
      ${questionRows(p.questions)}
    </table>` : ""}
  `;

  return buildEmail({
    subject:       `Quiz Results – ${p.quizTitle}`,
    preheaderText: `You scored ${p.pct}% (${p.grade}) on ${p.quizTitle}`,
    headline:      `${p.quizTitle}`,
    subheadline:   `Quiz results &mdash; ${date}`,
    bodyHtml,
    ctaLabel:      "Continue Studying →",
    ctaUrl:        `${SITE_URL}/notes`,
    footerNote:    "You received this because you completed a quiz on Nursing Uganda.",
  });
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
