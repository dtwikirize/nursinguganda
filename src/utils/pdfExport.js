import { jsPDF } from "jspdf";
import QRCode from "qrcode";
import { getEbookTheme } from "./ebookThemes";

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

/**
 * Generates and directly triggers binary download of a premium full-color medical textbook `.pdf`
 * modeled after OpenStax / Elsevier clinical handbooks:
 *  - Page 1: Full-bleed specialty colored textbook cover page with spine stripe & edition badge
 *  - Page 2: Editorial Governance & Styled Table of Contents
 *  - Interior: Chapter divider banners, running headers, edge thumb tabs, clinical callout cards,
 *    bold lead-in terms, and shaded Master Bibliography.
 */
export function downloadEbookPdf(ebook, themeOverrideId = "") {
  if (!ebook) return;
  const theme = getEbookTheme(ebook, themeOverrideId);
  const P = theme.primaryRgb;
  const A = theme.accentRgb;
  const T = theme.tintRgb;
  const S = theme.softRgb;

  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginX = 18;
  const maxWidth = pageWidth - marginX * 2;
  let y = 26;

  // ── PAGE 1: FULL-BLEED COLORED TEXTBOOK COVER PAGE ──
  doc.setFillColor(P[0], P[1], P[2]);
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  // Left vertical accent spine stripe
  doc.setFillColor(A[0], A[1], A[2]);
  doc.rect(0, 0, 12, pageHeight, "F");
  doc.setFillColor(255, 255, 255);
  doc.rect(12, 0, 0.8, pageHeight, "F");

  // Top publisher ribbon
  doc.setFillColor(A[0], A[1], A[2]);
  doc.rect(24, 24, pageWidth - 40, 11, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(255, 255, 255);
  doc.text(cleanPdfText(`NURSING UGANDA CLINICAL PRESS   |   ${theme.vol}   |   OPEN ACCESS HANDBOOK`), 28, 31);

  // Decorative subtle geometry blocks (clean medical editorial grid look)
  doc.setFillColor(S[0], S[1], S[2]);
  doc.rect(24, 152, pageWidth - 40, 82, "F");
  doc.setFillColor(A[0], A[1], A[2]);
  doc.rect(24, 152, 4, 82, "F");

  // Cover Series & Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(226, 232, 240);
  doc.text(cleanPdfText(`${theme.series}   •   ${(ebook.category || "CLINICAL NURSING").toUpperCase()}`), 24, 52);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(26);
  doc.setTextColor(255, 255, 255);
  const coverTitleLines = doc.splitTextToSize(cleanPdfText(ebook.title || "Nursing Uganda Clinical eBook"), pageWidth - 44);
  doc.text(coverTitleLines, 24, 70);

  const subStartY = 70 + coverTitleLines.length * 10.5 + 4;
  if (ebook.subtitle) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12.5);
    doc.setTextColor(226, 232, 240);
    doc.text(doc.splitTextToSize(cleanPdfText(ebook.subtitle), pageWidth - 44), 24, subStartY);
  }

  // Edition Pill Box on lower light panel
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(P[0], P[1], P[2]);
  doc.text("CURRICULUM ALIGNMENT & EDITORIAL CREDENTIALS", 34, 165);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(30, 41, 59);
  const coverMetaLines = [
    `Clinical Reviewer: ${ebook.clinicalReviewer || "Nursing Uganda Clinical Review Desk"}`,
    `Standards: Uganda Clinical Guidelines (UCG 2023), UNMEB / UHPAB Syllabi, WHO, Open RN & OpenStax`,
    `Contents: ${(ebook.chapters || []).length} Structured Chapters   |   ${(ebook.references || []).length} Master References   |   Theme: ${theme.label}`,
    `Updated Edition: ${ebook.updatedAt || "2026"}   |   Published by nursinguganda.com`
  ];
  coverMetaLines.forEach((line, idx) => {
    doc.text(cleanPdfText(`• ${line}`), 34, 177 + idx * 10.5);
  });

  // Cover bottom strip
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(255, 255, 255);
  doc.text("nursinguganda.com   |   Free Peer-Reviewed Nursing & Midwifery Revision Series", 24, pageHeight - 16);

  // Track active chapter name per page for running headers & thumb tabs
  const pageChapters = {};
  let currentRunningSection = "Table of Contents";

  const addInteriorPage = (chapterTag = currentRunningSection) => {
    doc.addPage();
    const pgNo = doc.getNumberOfPages();
    pageChapters[pgNo] = chapterTag;
    y = 24;
  };

  const ensureSpace = (neededMm = 14) => {
    if (y + neededMm > pageHeight - 20) {
      addInteriorPage(currentRunningSection);
    }
  };

  const writeWrapped = (text, { fontSize = 10, bold = false, italic = false, color = [30, 41, 59], indent = 0, lineH = 4.9 } = {}) => {
    const style = bold && italic ? "bolditalic" : bold ? "bold" : italic ? "italic" : "normal";
    doc.setFont("helvetica", style);
    doc.setFontSize(fontSize);
    doc.setTextColor(color[0], color[1], color[2]);
    const paragraphs = cleanPdfText(text).split("\n");
    for (const para of paragraphs) {
      const trimmed = para.trim();
      if (!trimmed) {
        y += 2;
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

  const drawCalloutBox = (label, bodyText) => {
    const cleanBody = cleanPdfText(bodyText);
    const wrapped = doc.splitTextToSize(cleanBody, maxWidth - 12);
    const boxHeight = Math.max(15, wrapped.length * 4.5 + 11);
    ensureSpace(boxHeight + 4);

    doc.setFillColor(T[0], T[1], T[2]);
    doc.setDrawColor(A[0], A[1], A[2]);
    doc.setLineWidth(0.35);
    doc.roundedRect(marginX, y, maxWidth, boxHeight, 2, 2, "FD");
    doc.setFillColor(A[0], A[1], A[2]);
    doc.rect(marginX, y, 2.2, boxHeight, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.2);
    doc.setTextColor(A[0], A[1], A[2]);
    doc.text(cleanPdfText(label.toUpperCase()), marginX + 6, y + 6);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.4);
    doc.setTextColor(P[0], P[1], P[2]);
    doc.text(wrapped, marginX + 6, y + 11.5);
    y += boxHeight + 4;
  };

  // ── PAGE 2: TABLE OF CONTENTS & EDITORIAL OVERVIEW ──
  addInteriorPage("Table of Contents");
  doc.setFillColor(S[0], S[1], S[2]);
  doc.roundedRect(marginX, y, maxWidth, 16, 2, 2, "F");
  doc.setFillColor(P[0], P[1], P[2]);
  doc.rect(marginX, y, 3, 16, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(P[0], P[1], P[2]);
  doc.text("TABLE OF CONTENTS & CHAPTER ROADMAP", marginX + 7, y + 10);
  y += 22;

  (ebook.chapters || []).forEach((ch, idx) => {
    ensureSpace(12);
    doc.setFillColor(idx % 2 === 0 ? 248 : 255, idx % 2 === 0 ? 250 : 255, idx % 2 === 0 ? 252 : 255);
    doc.rect(marginX, y - 4, maxWidth, 8.5, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.8);
    doc.setTextColor(A[0], A[1], A[2]);
    doc.text(`CH ${String(ch.chapterNumber).padStart(2, "0")}`, marginX + 3, y + 1.2);
    doc.setTextColor(P[0], P[1], P[2]);
    doc.text(cleanPdfText(ch.title), marginX + 20, y + 1.2);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.8);
    doc.setTextColor(100, 116, 139);
    doc.text(`${ch.wordCount || ""} words`, pageWidth - marginX - 2, y + 1.2, { align: "right" });
    y += 9.5;
  });

  y += 6;
  drawCalloutBox(
    "HOW TO USE THIS TEXTBOOK FOR EXAMS",
    "Read bold definitions first, master highlighted Nursing Priority & Safety pearls for clinical scenarios, and verify every protocol against the cited Uganda Clinical Guidelines 2023 and WHO references at the end of each volume."
  );

  // ── CHAPTER PAGES ──
  for (const ch of ebook.chapters || []) {
    currentRunningSection = `Chapter ${ch.chapterNumber}: ${ch.title}`;
    addInteriorPage(currentRunningSection);

    // Chapter Opener Colored Header Card (OpenStax / Elsevier Style)
    const chTitleLines = doc.splitTextToSize(cleanPdfText(ch.title), maxWidth - 16);
    const headerH = 20 + chTitleLines.length * 6.5;
    doc.setFillColor(P[0], P[1], P[2]);
    doc.roundedRect(marginX, y, maxWidth, headerH, 2.5, 2.5, "F");
    doc.setFillColor(A[0], A[1], A[2]);
    doc.rect(marginX, y, 4.5, headerH, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(219, 234, 254);
    doc.text(`CHAPTER ${String(ch.chapterNumber).padStart(2, "0")}   |   ${cleanPdfText(theme.series)}`, marginX + 9, y + 8);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(15.5);
    doc.setTextColor(255, 255, 255);
    doc.text(chTitleLines, marginX + 9, y + 17);
    y += headerH + 6;

    if (ch.excerpt) {
      drawCalloutBox("CHAPTER CLINICAL SUMMARY", ch.excerpt);
    }

    for (const sec of ch.sections || []) {
      if (!sec.title || /^references?$/i.test(sec.title.trim())) continue;
      ensureSpace(16);

      // Section Heading with subtle Accent Rule
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11.5);
      doc.setTextColor(P[0], P[1], P[2]);
      doc.text(cleanPdfText(sec.title), marginX, y);
      y += 2;
      doc.setDrawColor(A[0], A[1], A[2]);
      doc.setLineWidth(0.5);
      doc.line(marginX, y, marginX + 38, y);
      y += 5;

      const isPrioritySec = /nursing priority|safety|alert|teaching|uganda|mnemonic|warning/i.test(sec.title);
      if (isPrioritySec && (sec.blocks || []).length > 0 && (sec.blocks || []).length <= 4) {
        const joined = sec.blocks.map((b) => (b.text || "").replace(/\*\*/g, "").replace(/==/g, "")).filter(Boolean).join("\n");
        if (joined.length < 750) {
          drawCalloutBox(sec.title, joined);
          continue;
        }
      }

      for (const blk of sec.blocks || []) {
        const txt = (blk.text || "").replace(/\*\*/g, "").replace(/==/g, "");
        if (!txt.trim()) continue;
        if (/^(Clinical Pearl|Nursing Priority|Key Warning|Mnemonic|Note):/i.test(txt.trim())) {
          const idx = txt.indexOf(":");
          drawCalloutBox(txt.slice(0, idx), txt.slice(idx + 1).trim());
        } else if (blk.type === "bullet") {
          writeWrapped(`• ${txt}`, { fontSize: 9.7, color: [31, 41, 55], indent: 4, lineH: 4.7 });
        } else {
          writeWrapped(txt, { fontSize: 9.9, color: [17, 24, 39], indent: 0, lineH: 4.9 });
        }
      }
      y += 2;
    }
  }

  // ── MASTER BIBLIOGRAPHY PAGE ──
  if (Array.isArray(ebook.references) && ebook.references.length > 0) {
    currentRunningSection = "Master Clinical Bibliography";
    addInteriorPage(currentRunningSection);
    doc.setFillColor(P[0], P[1], P[2]);
    doc.roundedRect(marginX, y, maxWidth, 14, 2, 2, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.text("MASTER CLINICAL & TEXTBOOK BIBLIOGRAPHY", marginX + 6, y + 9.5);
    y += 20;

    ebook.references.forEach((ref, i) => {
      const cit = typeof ref === "string" ? ref : `${ref.citation || ""}${ref.url ? ` (${ref.url})` : ""}`;
      writeWrapped(`${i + 1}. ${cit}`, { fontSize: 9.2, color: P, indent: 2, lineH: 4.5 });
    });
  }

  // Apply Running Header, Outer Thumb Index Tab, and Folio Footer on pages 2..N
  const totalPages = doc.getNumberOfPages();
  for (let p = 2; p <= totalPages; p++) {
    doc.setPage(p);
    // Edge Thumb Tab along right margin
    doc.setFillColor(A[0], A[1], A[2]);
    doc.rect(pageWidth - 4, 32, 4, 24, "F");

    // Running Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.8);
    doc.setTextColor(P[0], P[1], P[2]);
    doc.text(cleanPdfText(ebook.title || "Nursing Uganda Study eBook").slice(0, 48), marginX, 11);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(A[0], A[1], A[2]);
    doc.text(cleanPdfText(pageChapters[p] || "").slice(0, 42), pageWidth - marginX, 11, { align: "right" });

    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.25);
    doc.line(marginX, 13.5, pageWidth - marginX, 13.5);

    // Folio Footer
    doc.line(marginX, pageHeight - 13, pageWidth - marginX, pageHeight - 13);
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text("Nursing Uganda (nursinguganda.com)  •  Free Open-Access Study Textbook", marginX, pageHeight - 8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(P[0], P[1], P[2]);
    doc.text(`Page ${p} of ${totalPages}`, pageWidth - marginX, pageHeight - 8, { align: "right" });
  }

  const safeSlug = String(ebook.slug || "study-ebook").replace(/[^a-z0-9-_]/gi, "-").toLowerCase();
  doc.save(`nursing-uganda-ebook-${safeSlug}.pdf`);
}

/**
 * Generates and directly triggers binary `.pdf` download of a Learner Completion Certificate
 * (Landscape A4 framed certificate with full UNMEB/UNMC non-regulatory disclaimer).
 */
export async function downloadCertificatePdf(certificate, learnerName) {
  if (!certificate) return;
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "landscape" });
  const w = doc.internal.pageSize.getWidth();
  const h = doc.internal.pageSize.getHeight();

  // Outer Dark Charcoal & Inner Purple Double Border
  doc.setDrawColor(28, 29, 31);
  doc.setLineWidth(2.6);
  doc.rect(10, 10, w - 20, h - 20);
  doc.setDrawColor(161, 55, 242);
  doc.setLineWidth(0.9);
  doc.rect(14, 14, w - 28, h - 28);

  // Header Badge
  doc.setFillColor(15, 41, 66);
  doc.roundedRect(w / 2 - 72, 24, 144, 11, 5, 5, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(255, 255, 255);
  doc.text("NURSING UGANDA  |  CERTIFICATE OF STUDY COMPLETION", w / 2, 31, { align: "center" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(28, 29, 31);
  doc.text("THIS CERTIFIES THAT", w / 2, 52, { align: "center" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(26);
  doc.setTextColor(161, 55, 242);
  const cleanRecipient = cleanPdfText(learnerName || "").trim();
  if (cleanRecipient) {
    doc.text(cleanRecipient, w / 2, 68, { align: "center" });
  }
  doc.setDrawColor(197, 155, 39);
  doc.setLineWidth(0.7);
  doc.line(w / 2 - 58, 71, w / 2 + 58, 71);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(75, 85, 99);
  doc.text(
    "has satisfactorily completed structured revision readings and passed the 30-question Final Evaluation (>= 60%) for:",
    w / 2,
    83,
    { align: "center" }
  );

  doc.setFont("helvetica", "bold");
  doc.setFontSize(17);
  doc.setTextColor(15, 41, 66);
  const titleLines = doc.splitTextToSize(cleanPdfText(certificate.courseTitle || "Nursing & Midwifery Course"), w - 60);
  doc.text(titleLines, w / 2, 97, { align: "center" });

  if (certificate.programmeLabel) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(106, 111, 115);
    doc.text(cleanPdfText(`Track: ${certificate.programmeLabel}`), w / 2, 113, { align: "center" });
  }

  // Summary Stats Boxes (Score | Certificate ID | Date Issued)
  const displayDate = certificate.issuedAt
    ? new Date(certificate.issuedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
    : new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  const boxW = 62;
  const boxH = 22;
  const startX = 20;
  const boxY = 124;
  const cards = [
    { label: "FINAL SCORE", val: `${certificate.score} / ${certificate.totalQuestions} (${certificate.percent}%)` },
    { label: "CERTIFICATE ID", val: String(certificate.certificateCode || "NU-CERT") },
    { label: "DATE ISSUED", val: cleanPdfText(displayDate) }
  ];

  cards.forEach((c, idx) => {
    const bx = startX + idx * (boxW + 7);
    doc.setFillColor(240, 245, 250);
    doc.setDrawColor(148, 179, 209);
    doc.setLineWidth(0.4);
    doc.roundedRect(bx, boxY, boxW, boxH, 2, 2, "FD");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(c.label, bx + boxW / 2, boxY + 7, { align: "center" });
    doc.setFontSize(10.5);
    doc.setTextColor(15, 41, 66);
    doc.text(cleanPdfText(c.val), bx + boxW / 2, boxY + 16, { align: "center" });
  });

  // Scannable Verification QR Code (No Signatories)
  try {
    const verifyCode = String(certificate.certificateCode || "NU-VERIFY");
    const verifyUrl = `https://nursinguganda.com/my-learning?verify=${encodeURIComponent(verifyCode)}`;
    const qrDataUrl = await QRCode.toDataURL(verifyUrl, {
      width: 180,
      margin: 1,
      color: { dark: "#0F2942", light: "#FFFFFF" }
    });
    const qrSize = 26;
    const qrX = w - 20 - qrSize;
    const qrY = 120;
    doc.addImage(qrDataUrl, "PNG", qrX, qrY, qrSize, qrSize);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text("SCAN TO VERIFY", qrX + qrSize / 2, qrY + qrSize + 4, { align: "center" });
  } catch {
    // Graceful skip if canvas QR unavailable
  }

  // Regulatory Scope Notice Footer
  doc.setFillColor(254, 252, 232);
  doc.setDrawColor(234, 179, 8);
  doc.roundedRect(20, 158, w - 40, 26, 2, 2, "FD");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(113, 63, 18);
  const disclaimer = cleanPdfText(
    "Scope & Regulatory Notice: This certificate attests solely to self-paced study completion on Nursing Uganda (nursinguganda.com). It is NOT an official academic transcript, practicing license, or statutory credential from UNMEB, the Uganda Nurses and Midwives Council (UNMC), or the Ministry of Health Uganda, and does not authorize independent clinical practice."
  );
  doc.text(doc.splitTextToSize(disclaimer, w - 52), 26, 166);

  const safeCode = String(certificate.certificateCode || certificate.courseSlug || "certificate").replace(/[^a-z0-9-_]/gi, "-").toLowerCase();
  doc.save(`nursing-uganda-certificate-${safeCode}.pdf`);
}

export const NURSING_TEMPLATES = [
  {
    id: "nanda-care-plan",
    title: "NANDA-I Nursing Care Plan (NCP) Worksheet",
    category: "Ward & UNMEB Practicals",
    orientation: "Landscape A4 (6-Column)",
    colorHex: "#102A43",
    desc: "6-column NANDA nursing process sheet: Assessment, Nursing Diagnosis, Expected SMART Outcome, Interventions, Scientific Rationales & Evaluation (Page 2 includes filled Pneumonia sample)."
  },
  {
    id: "who-partograph",
    title: "WHO Modified Partograph Labour Practice Chart",
    category: "Midwifery Practicum",
    orientation: "Portrait A4",
    colorHex: "#4C1D95",
    desc: "Full intrapartum monitoring grid: FHR (100-180 bpm), Liquor/Moulding, Cervical Dilatation (4-10 cm with Alert & 4-hr Action Lines), Contractions, Oxytocin & Maternal Vitals."
  },
  {
    id: "sbar-handover",
    title: "SBAR Clinical Handover & Shift Report Sheet",
    category: "Global Ward Communication",
    orientation: "Portrait A4",
    colorHex: "#064E3B",
    desc: "Structured Situation, Background, Assessment & Recommendation clinical handover template with allergies, escalation flags, and UK NMC / US NCLEX / Uganda ward boxes."
  },
  {
    id: "soap-progress",
    title: "SOAP / SOAPIE Nursing Progress Note Template",
    category: "Daily Patient Charting",
    orientation: "Portrait A4",
    colorHex: "#1E3A8A",
    desc: "Clean patient progress chart capturing Subjective complaints, Objective vitals/exam, Assessment impression, Plan, Implementation times & Evaluation outcome."
  },
  {
    id: "fluid-balance",
    title: "24-Hour Fluid Balance (Intake & Output) Chart",
    category: "Med-Surg & Paediatrics",
    orientation: "Portrait A4",
    colorHex: "#134E4A",
    desc: "Hourly oral/NGT feeds + IV fluids intake table paired with Urine, Emesis/NGT, Drain/Stool output columns and 24-hour Cumulative Net Balance summary."
  },
  {
    id: "vitals-mews",
    title: "Ward Vital Signs & MEWS/PEWS Observation Chart",
    category: "Acute & Early Warning",
    orientation: "Landscape A4",
    colorHex: "#991B1B",
    desc: "Time-stamped bedside observation table covering Temp (°C/°F), Pulse, BP, Respiratory Rate, SpO2 %, Oxygen Flow, AVPU consciousness, Pain (0-10) & escalation signature."
  },
  {
    id: "drug-kardex-mar",
    title: "Drug Kardex & Medication Administration Record (MAR)",
    category: "Pharmacology Safety",
    orientation: "Landscape A4",
    colorHex: "#0F2942",
    desc: "Structured inpatient Drug Kardex featuring allergy header box, Scheduled Regular Medicines time-slot grids, STAT/Once-Only doses, and PRN As-Required chart."
  },
  {
    id: "unmeb-case-logbook",
    title: "UNMEB Practical Case Study & Ward Logbook Form",
    category: "Logbook & OSCE Assessment",
    orientation: "Portrait A4",
    colorHex: "#312E81",
    desc: "Complete student case-presentation booklet covering Patient Biographics, Chief Complaint, HPI, Physical Exam by System, Investigations/UCG Diagnosis & Discharge Teaching."
  }
];

function drawPdfBanner(doc, { title, subtitle, colorRgb = [15, 41, 66] }) {
  const w = doc.internal.pageSize.getWidth();
  doc.setFillColor(colorRgb[0], colorRgb[1], colorRgb[2]);
  doc.rect(0, 0, w, 20, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(255, 255, 255);
  doc.text(cleanPdfText(title), 14, 9.5);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(219, 234, 254);
  doc.text(cleanPdfText(subtitle), 14, 15.5);
}

function drawGridTable(doc, startX, startY, colWidths, headers, rows, headerRgb = [15, 41, 66], rowH = 14) {
  let x = startX;
  doc.setFillColor(headerRgb[0], headerRgb[1], headerRgb[2]);
  const totalW = colWidths.reduce((a, b) => a + b, 0);
  doc.rect(startX, startY, totalW, 9, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.2);
  doc.setTextColor(255, 255, 255);
  headers.forEach((h, i) => {
    doc.text(cleanPdfText(h), x + 2, startY + 6);
    x += colWidths[i];
  });

  let y = startY + 9;
  const pageH = doc.internal.pageSize.getHeight();
  doc.setDrawColor(180, 194, 210);
  doc.setLineWidth(0.25);

  rows.forEach((row, rIdx) => {
    if (y + rowH > pageH - 16) {
      doc.addPage();
      y = 18;
    }
    if (rIdx % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(startX, y, totalW, rowH, "F");
    }
    let cx = startX;
    colWidths.forEach((cw, ci) => {
      doc.rect(cx, y, cw, rowH, "D");
      const val = String(row?.[ci] || "");
      if (val) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(17, 24, 39);
        const lines = doc.splitTextToSize(cleanPdfText(val), cw - 4);
        doc.text(lines.slice(0, Math.floor((rowH - 2) / 3.8)), cx + 2, y + 4.5);
      }
      cx += cw;
    });
    y += rowH;
  });
  return y;
}

/**
 * Generates and downloads clean structured Nursing Ward & Practical Exam Templates directly as `.pdf`.
 */
export function downloadNursingTemplatePdf(templateId, { withSample = true } = {}) {
  const tpl = NURSING_TEMPLATES.find((t) => t.id === templateId) || NURSING_TEMPLATES[0];
  const isLandscape = tpl.orientation.toLowerCase().includes("landscape");
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: isLandscape ? "landscape" : "portrait" });
  const w = doc.internal.pageSize.getWidth();
  const h = doc.internal.pageSize.getHeight();

  const headerColor = tpl.id === "who-partograph" ? [76, 29, 149] : tpl.id === "sbar-handover" ? [6, 78, 59] : tpl.id === "vitals-mews" ? [153, 27, 27] : [15, 41, 66];
  drawPdfBanner(doc, {
    title: `NURSING UGANDA  |  ${tpl.title.toUpperCase()}`,
    subtitle: `Official Clinical Study & Ward Practice Form   •   nursinguganda.com   •   ${withSample ? "Printable Blank Sheet + Worked Study Example" : "Clean Printable Worksheet"}`,
    colorRgb: headerColor
  });

  // Standard Patient / Student Identification Bar
  doc.setDrawColor(148, 163, 184);
  doc.setFillColor(248, 250, 252);
  doc.rect(14, 24, w - 28, 14, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(15, 41, 66);
  doc.text("Client / Patient Initials: ___________________   Age / Sex: _________   Ward / Unit: _________________   Date: _______________", 17, 30);
  doc.text("Student / Nurse Name: _____________________   Reg / Index No: _______________   Working Dx: ___________________________", 17, 35.5);

  if (tpl.id === "nanda-care-plan") {
    const cols = [42, 46, 42, 54, 46, 39];
    const headers = ["Assessment (S/O)", "Nursing Diagnosis", "Expected Outcomes", "Nursing Interventions", "Scientific Rationale", "Evaluation"];
    const blankRows = Array.from({ length: 5 }, () => ["", "", "", "", "", ""]);
    drawGridTable(doc, 14, 42, cols, headers, blankRows, headerColor, 26);

    if (withSample) {
      doc.addPage();
      drawPdfBanner(doc, {
        title: "WORKED EXAMPLE: SEVERE PNEUMONIA CARE PLAN (NANDA-I)",
        subtitle: "Sample filled guide styled in UNMEB / NMC / NCLEX Care Plan examination rubric",
        colorRgb: headerColor
      });
      const sampleRows = [[
        "S: Patient reports breathless pain on cough.\nO: Temp 39.1C, RR 32/min, SpO2 87% room air, RLL crackles.",
        "Impaired Gas Exchange related to alveolar inflammatory exudate AEB SpO2 87% & RR 32/min.",
        "Within 2 hours, patient maintains SpO2 >= 94%, RR <= 22/min, and effortless breathing.",
        "1. Sit upright (High-Fowler's).\n2. Humidified O2 via mask.\n3. Give ordered IV Ceftriaxone post sputum culture.\n4. Encourage oral fluids & splinted coughing.",
        "Upright position lowers diaphragm & boosts ventilation; O2 raises alveolar pO2; antibiotics eradicate pathogen; hydration thins thick secretions.",
        "Met partly at 2 hrs: SpO2 improved to 95% on 4L O2; RR reduced to 22/min."
      ]];
      drawGridTable(doc, 14, 28, cols, headers, sampleRows, headerColor, 58);
    }
  } else if (tpl.id === "who-partograph") {
    drawGridTable(
      doc,
      14,
      42,
      [34, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 16],
      ["Hour / Time", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "Notes"],
      [
        ["FHR (100-180 bpm)", "", "", "", "", "", "", "", "", "", "", "", ""],
        ["Liquor (I/C/M/B)", "", "", "", "", "", "", "", "", "", "", "", ""],
        ["Moulding (0/+/++)", "", "", "", "", "", "", "", "", "", "", "", ""],
        ["Cervix 10 cm", "", "", "", "", "", "", "", "", "", "", "", ""],
        ["Cervix 8-9 cm", "", "", "", "", "", "", "", "", "", "", "", ""],
        ["Cervix 6-7 cm", "", "", "", "", "", "", "", "", "", "", "", "Action ->"],
        ["Cervix 4-5 cm (Start)", "", "", "", "", "", "", "", "", "", "", "", "Alert ->"],
        ["Descent (5/5 - 0/5)", "", "", "", "", "", "", "", "", "", "", "", ""],
        ["Contractions / 10m", "", "", "", "", "", "", "", "", "", "", "", ""],
        ["Oxytocin IU / dpm", "", "", "", "", "", "", "", "", "", "", "", ""],
        ["Maternal BP / Pulse", "", "", "", "", "", "", "", "", "", "", "", ""],
        ["Temp / Urine (P/A)", "", "", "", "", "", "", "", "", "", "", "", ""]
      ],
      headerColor,
      16
    );
  } else if (tpl.id === "sbar-handover") {
    const sections = [
      { k: "S | SITUATION (Identify self, patient name, unit, exact active problem / urgent concern)", h: 40, sample: withSample ? "Example: Calling regarding Bed 4 Mr. M.K., 58 yrs post-laparotomy Day 1; sudden BP drop 88/54 mmHg, HR 122 bpm." : "" },
      { k: "B | BACKGROUND (Relevant diagnoses, surgery/admission date, allergies, current IV meds/fluids)", h: 48, sample: withSample ? "Example: Admitted yesterday for perforated appendix repair; known hypertensive on Amlodipine; no drug allergies." : "" },
      { k: "A | ASSESSMENT (Latest vitals, physical exam, SpO2, lab trends, clinical impression)", h: 52, sample: withSample ? "Example: Incision dressing shows fresh dark oozing; skin cool & clammy; SpO2 94% on air; urine output 15 mL past hr." : "" },
      { k: "R | RECOMMENDATION (Urgent actions requested, review timeframe, immediate bedside steps taken)", h: 48, sample: withSample ? "Example: Request stat surgical registrar review within 10 mins, cross-match order, & confirm bolus Ringer's Lactate." : "" }
    ];
    let sy = 43;
    sections.forEach((sec) => {
      doc.setFillColor(headerColor[0], headerColor[1], headerColor[2]);
      doc.rect(14, sy, w - 28, 7.5, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(255, 255, 255);
      doc.text(cleanPdfText(sec.k), 17, sy + 5.2);
      doc.setDrawColor(148, 163, 184);
      doc.rect(14, sy + 7.5, w - 28, sec.h, "D");
      if (sec.sample) {
        doc.setFont("helvetica", "italic");
        doc.setFontSize(8.5);
        doc.setTextColor(71, 85, 105);
        doc.text(doc.splitTextToSize(cleanPdfText(sec.sample), w - 36), 17, sy + 14);
      }
      sy += 7.5 + sec.h + 5;
    });
  } else if (tpl.id === "soap-progress") {
    const blocks = [
      { label: "S | Subjective Data (Patient symptoms, pain score 0-10, concerns verbatim)", h: 36 },
      { label: "O | Objective Data (Temp, BP, HR, RR, SpO2, physical exam, labs, wound status)", h: 46 },
      { label: "A | Assessment / Nursing Diagnosis (Clinical interpretation & progress)", h: 36 },
      { label: "P | Plan (Short-term goals, diagnostic/medication/education targets)", h: 34 },
      { label: "I | Implementation (Timed nursing actions delivered & medications given)", h: 38 },
      { label: "E | Evaluation (Patient response, unmet needs, plan revision + Sign)", h: 30 }
    ];
    let sy = 42;
    blocks.forEach((b) => {
      doc.setFillColor(240, 245, 250);
      doc.setDrawColor(148, 179, 209);
      doc.rect(14, sy, w - 28, 7, "FD");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(15, 41, 66);
      doc.text(cleanPdfText(b.label), 17, sy + 4.8);
      doc.rect(14, sy + 7, w - 28, b.h - 7, "D");
      sy += b.h + 3;
    });
  } else if (tpl.id === "fluid-balance") {
    const cols = [18, 28, 22, 22, 22, 22, 22, 26];
    const headers = ["Time", "Oral / NGT (mL)", "IV Fluid (mL)", "Blood / Drug", "Urine Out (mL)", "Emesis / NGT", "Drain / Stool", "Initials"];
    const rows = Array.from({ length: 14 }, (_, i) => [i === 13 ? "24h TOTAL" : `${String((7 + i) % 24).padStart(2, "0")}:00`, "", "", "", "", "", "", ""]);
    const endY = drawGridTable(doc, 14, 42, cols, headers, rows, headerColor, 13);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(15, 41, 66);
    doc.text("Total 24h Intake: _________ mL   |   Total 24h Output: _________ mL   |   Net Fluid Balance (+/-): _________ mL", 14, Math.min(h - 16, endY + 9));
  } else if (tpl.id === "vitals-mews") {
    const cols = [24, 24, 24, 28, 22, 24, 24, 24, 24, 51];
    const headers = ["Time", "Temp (C/F)", "Pulse (bpm)", "BP (mmHg)", "RR /min", "SpO2 %", "O2 L/m", "AVPU", "Pain /10", "MEWS Total / Nurse Sign"];
    const rows = Array.from({ length: 10 }, () => ["", "", "", "", "", "", "", "", "", ""]);
    drawGridTable(doc, 14, 42, cols, headers, rows, headerColor, 13.5);
  } else if (tpl.id === "drug-kardex-mar") {
    doc.setFillColor(254, 242, 242);
    doc.setDrawColor(220, 38, 38);
    doc.rect(14, 41, w - 28, 9, "FD");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(185, 28, 28);
    doc.text("KNOWN DRUG ALLERGIES & WEIGHT (kg): ____________________________________________________________________", 17, 47);

    const cols = [54, 28, 22, 26, 20, 20, 20, 20, 20, 39];
    const headers = ["Approved Drug Name", "Dose", "Route", "Freq", "06h", "12h", "18h", "22h", "Start", "Prescriber / Stop"];
    const rows = Array.from({ length: 8 }, () => ["", "", "", "", "", "", "", "", "", ""]);
    drawGridTable(doc, 14, 53, cols, headers, rows, headerColor, 15.5);
  } else {
    // UNMEB Practical Case Study & Ward Logbook Presentation Template
    const boxes = [
      ["1. Chief Presenting Complaint & History of Presenting Illness (SOCRATES)", 42],
      ["2. Past Medical, Surgical, Obstetric, Drug & Allergy History", 32],
      ["3. Systematic Physical Examination & Baseline Vitals Findings", 42],
      ["4. Provisional Diagnosis & Ordered Laboratory / Imaging Investigations", 34],
      ["5. Priority Nursing Diagnoses & Nursing Process Management Summary (UCG 2023)", 48],
      ["6. Outcome Evaluation, Discharge Advice & Clinical Preceptor Sign-Off", 30]
    ];
    let sy = 42;
    boxes.forEach(([title, bh]) => {
      doc.setFillColor(headerColor[0], headerColor[1], headerColor[2]);
      doc.rect(14, sy, w - 28, 7, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(255, 255, 255);
      doc.text(cleanPdfText(title), 17, sy + 4.9);
      doc.setDrawColor(148, 163, 184);
      doc.rect(14, sy + 7, w - 28, bh - 7, "D");
      sy += bh + 3;
    });
  }

  // Standard Footer
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text("Nursing Uganda (nursinguganda.com)  •  Free Clinical Nursing Ward & Practical Form", 14, h - 8);
    doc.text(`Page ${p} of ${totalPages}`, w - 14, h - 8, { align: "right" });
  }

  doc.save(`nursing-uganda-template-${tpl.id}.pdf`);
}


