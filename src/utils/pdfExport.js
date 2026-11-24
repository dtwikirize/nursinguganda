import { jsPDF } from "jspdf";
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
export function downloadCertificatePdf(certificate, learnerName) {
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
  doc.text(cleanPdfText(learnerName || "Nursing Uganda Learner"), w / 2, 69, { align: "center" });

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

  const boxW = 74;
  const boxH = 22;
  const startX = (w - boxW * 3 - 20) / 2;
  const boxY = 124;
  const cards = [
    { label: "FINAL SCORE", val: `${certificate.score} / ${certificate.totalQuestions} (${certificate.percent}%)` },
    { label: "CERTIFICATE ID", val: String(certificate.certificateCode || "NU-CERT") },
    { label: "DATE ISSUED", val: cleanPdfText(displayDate) }
  ];

  cards.forEach((c, idx) => {
    const bx = startX + idx * (boxW + 10);
    doc.setFillColor(240, 245, 250);
    doc.setDrawColor(148, 179, 209);
    doc.setLineWidth(0.4);
    doc.roundedRect(bx, boxY, boxW, boxH, 2, 2, "FD");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139);
    doc.text(c.label, bx + boxW / 2, boxY + 7, { align: "center" });
    doc.setFontSize(11);
    doc.setTextColor(15, 41, 66);
    doc.text(cleanPdfText(c.val), bx + boxW / 2, boxY + 16, { align: "center" });
  });

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

