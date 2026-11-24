import { jsPDF } from "jspdf";

function cleanPdfText(raw = "") {
  return String(raw || "")
    .replace(/\r\n/g, "\n")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[–—]/g, "-")
    .replace(/•/g, "*")
    .replace(/·/g, "|")
    .replace(/→/g, "->")
    .replace(/×/g, "x")
    .replace(/÷/g, "/")
    .replace(/≥/g, ">=")
    .replace(/≤/g, "<=")
    .replace(/°/g, " deg ")
    .replace(/[^\x09\x0A\x20-\x7E]/g, " ");
}

export function resolvePastPaper(paper, archiveData) {
  if (!paper) return null;
  const mcqBank = archiveData?.mcqBank || {};
  const essayBank = archiveData?.essayBank || {};
  const sectionA = (paper.mcqIds || []).map((id) => mcqBank[id]).filter(Boolean);
  const questions = Array.isArray(paper.questions) && paper.questions.length
    ? paper.questions
    : (paper.essayIds || []).map((id) => essayBank[id]).filter(Boolean);
  return { ...paper, sectionA, questions };
}

/**
 * Generates and directly triggers download of a clean binary `.pdf` file
 * (never opens the browser print dialog). All answers, rationales, marking
 * guides, and model answers render in Dark Navy RGB (15, 41, 66).
 */
export function downloadPastPaperPdf(paper, { includeAnswers = true } = {}) {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginX = 16;
  const maxWidth = pageWidth - marginX * 2;
  let y = 18;

  const ensureSpace = (neededMm = 14) => {
    if (y + neededMm > pageHeight - 18) {
      doc.addPage();
      y = 18;
    }
  };

  const writeWrapped = (text, { fontSize = 10, bold = false, italic = false, color = [17, 24, 39], indent = 0, lineH = 4.9 } = {}) => {
    const style = bold && italic ? "bolditalic" : bold ? "bold" : italic ? "italic" : "normal";
    doc.setFont("helvetica", style);
    doc.setFontSize(fontSize);
    doc.setTextColor(color[0], color[1], color[2]);
    const paragraphs = cleanPdfText(text).split("\n");
    for (const para of paragraphs) {
      const trimmed = para.trim();
      if (!trimmed) {
        y += 2.2;
        continue;
      }
      const lines = doc.splitTextToSize(trimmed, maxWidth - indent);
      for (const line of lines) {
        ensureSpace(lineH + 2);
        doc.text(line, marginX + indent, y);
        y += lineH;
      }
      y += 1.2;
    }
  };

  // Top Header Banner (Dark Navy #0F2942)
  doc.setFillColor(15, 41, 66);
  doc.rect(0, 0, pageWidth, 24, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(255, 255, 255);
  doc.text("NURSING UGANDA  |  UHPAB & UNMEB REVISION ARCHIVE", marginX, 11);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(219, 234, 254);
  doc.text(
    cleanPdfText(`${paper.paperCode || "UNMEB"}  |  ${paper.programmeLabel || "Nursing & Midwifery"}  |  ${paper.seriesTag || "Past Paper"}`),
    marginX,
    18
  );

  y = 32;
  writeWrapped(paper.title || "UNMEB Past Examination Paper", { fontSize: 13, bold: true, color: [15, 41, 66], lineH: 5.8 });
  writeWrapped(
    `Total Marks: ${paper.totalMarks || 60} Marks   |   Duration: ${paper.duration || 120} Minutes   |   Edition: ${includeAnswers ? "Questions + Dark Navy Answers & Marking Guide" : "Student Practice Paper (Questions Only)"}`,
    { fontSize: 9.5, italic: true, color: [71, 85, 105], lineH: 4.5 }
  );

  doc.setDrawColor(203, 213, 225);
  doc.line(marginX, y, pageWidth - marginX, y);
  y += 6;

  // Section A: Objective Questions (A-D)
  const sectionA = paper.sectionA || [];
  if (sectionA.length > 0) {
    ensureSpace(16);
    writeWrapped(`SECTION A: OBJECTIVE QUESTIONS (${sectionA.length} MARKS)`, { fontSize: 11.5, bold: true, color: [15, 41, 66], lineH: 5.5 });
    y += 1;

    sectionA.forEach((q, idx) => {
      ensureSpace(22);
      writeWrapped(`${idx + 1}. ${q.prompt}`, { fontSize: 10, bold: true, color: [17, 24, 39] });
      (q.options || []).forEach((opt, oi) => {
        const letter = String.fromCharCode(65 + oi);
        const isCorrect = includeAnswers && Number(q.answerIndex) === oi;
        writeWrapped(
          `   ${letter}. ${opt}${isCorrect ? "   [CORRECT ANSWER]" : ""}`,
          {
            fontSize: 9.5,
            bold: isCorrect,
            color: isCorrect ? [15, 41, 66] : [31, 41, 55],
            indent: 4,
            lineH: 4.5
          }
        );
      });
      if (includeAnswers && q.explanation) {
        writeWrapped(`Answer Rationale: ${q.explanation}`, {
          fontSize: 9.2,
          bold: false,
          italic: true,
          color: [15, 41, 66],
          indent: 4,
          lineH: 4.4
        });
      }
      y += 2;
    });
  }

  // Sections B & C: Structured Short & Long Clinical Scenario Essays
  const essays = paper.questions || [];
  if (essays.length > 0) {
    ensureSpace(18);
    y += 2;
    writeWrapped(`SECTIONS B & C: STRUCTURED & CLINICAL SCENARIO ESSAYS`, { fontSize: 11.5, bold: true, color: [15, 41, 66], lineH: 5.5 });
    y += 1;

    essays.forEach((q, qi) => {
      ensureSpace(26);
      writeWrapped(
        `Question ${qi + 1} (${q.section || "Essay"} | ${q.marks || 10} Marks) - ${q.topic || ""}`,
        { fontSize: 10.5, bold: true, color: [15, 41, 66] }
      );
      writeWrapped(q.prompt || "", { fontSize: 10, bold: true, color: [17, 24, 39] });

      if (includeAnswers) {
        // Dark Navy Marking Points + Full Model Answer
        if (Array.isArray(q.markingPoints) && q.markingPoints.length > 0) {
          ensureSpace(14);
          writeWrapped(`Marking Scheme (${q.marks} Marks Breakdown):`, { fontSize: 9.8, bold: true, color: [15, 41, 66], indent: 2 });
          for (const pt of q.markingPoints) {
            writeWrapped(`* ${pt}`, { fontSize: 9.3, color: [15, 41, 66], indent: 5, lineH: 4.5 });
          }
        }
        if (q.modelAnswer) {
          ensureSpace(14);
          writeWrapped(`Model Examiner Answer:`, { fontSize: 9.8, bold: true, color: [15, 41, 66], indent: 2 });
          writeWrapped(q.modelAnswer, { fontSize: 9.5, color: [15, 41, 66], indent: 4, lineH: 4.7 });
        }
        if (q.examinerTip) {
          writeWrapped(`Examiner Tip: ${q.examinerTip}`, { fontSize: 9.2, italic: true, color: [15, 41, 66], indent: 4, lineH: 4.4 });
        }
      } else {
        y += 8;
      }
      y += 3;
    });
  }

  // Page Footer on all pages
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text("Nursing Uganda (nursinguganda.com) - Independent UHPAB / UNMEB Revision Archive (UCG 2023 & WHO Aligned)", marginX, pageHeight - 9);
    doc.text(`Page ${p} of ${totalPages}`, pageWidth - marginX - 18, pageHeight - 9);
  }

  const safeSlug = String(paper.id || "unmeb-past-paper").replace(/[^a-z0-9-_]/gi, "-").toLowerCase();
  const suffix = includeAnswers ? "with-answers" : "questions-only";
  doc.save(`nursing-uganda-${safeSlug}-${suffix}.pdf`);
}
