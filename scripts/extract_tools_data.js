#!/usr/bin/env node
/**
 * Extracts dictionary terms, abbreviations, clinical checklists, normal values,
 * mock exam configs, and high-yield quiz questions from legacy assets/js/app.js
 * into standalone JSON datasets for the Vite + React Udemy platform.
 */
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const ROOT = process.cwd();
const APP_JS = fs.readFileSync(path.join(ROOT, "assets", "js", "app.js"), "utf8");
const OUT_DIR = path.join(ROOT, "assets", "data");
const REFERENCES = JSON.parse(fs.readFileSync(path.join(OUT_DIR, "references.json"), "utf8")).references;

function slugify(val) {
  return String(val ?? "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function sliceBetween(src, startMarker, endMarker) {
  const s = src.indexOf(startMarker);
  if (s === -1) throw new Error(`Missing marker: ${startMarker}`);
  const e = src.indexOf(endMarker, s);
  if (e === -1) throw new Error(`Missing end marker: ${endMarker}`);
  return src.slice(s, e);
}

const dictBlock = sliceBetween(APP_JS, "function makeDictionaryTerm", "function dictionaryTermBySlug");
const mockExamsBlock = sliceBetween(APP_JS, "const MOCK_EXAMS =", "let _mockExamTimer");
const clinicalBlock = sliceBetween(APP_JS, "const CLINICAL_CHECKLISTS =", "const CALC_CONFIGS =");
const quickQuizBlock = sliceBetween(APP_JS, "const QUICK_QUIZZES =", "// The consent banner");

const sandbox = { slugify };
vm.createContext(sandbox);
vm.runInContext(
  `
  ${dictBlock}
  ${mockExamsBlock}
  ${clinicalBlock}
  ${quickQuizBlock}
  this.__result = {
    terms: dictionaryTerms(),
    abbreviations: dictionaryAbbreviations(),
    mockExams: MOCK_EXAMS,
    checklists: CLINICAL_CHECKLISTS,
    normalValues: NORMAL_VALUES_DATA,
    quickQuizzes: QUICK_QUIZZES
  };
  `,
  sandbox
);

const res = sandbox.__result;

const dictPayload = {
  generatedAtUtc: new Date().toISOString(),
  references: REFERENCES.filter((r) => ["openstax-ap-2e", "openrn-fundamentals", "ug-ucg-2023", "openrn-pharmacology-2e"].includes(r.id)),
  terms: res.terms,
  abbreviations: res.abbreviations.map(([abbr, full]) => ({ abbr, full }))
};

const clinicalPayload = {
  generatedAtUtc: new Date().toISOString(),
  references: REFERENCES.filter((r) => ["openrn-skills", "openrn-fundamentals", "who-ipc-manual", "ug-ucg-2023"].includes(r.id)),
  checklists: res.checklists,
  normalValues: res.normalValues
};

const mockExamsPayload = {
  generatedAtUtc: new Date().toISOString(),
  references: REFERENCES.filter((r) => ["unmeb-curriculum-ug", "ug-ucg-2023", "openrn-pharmacology-2e", "who-maternal-2025"].includes(r.id)),
  exams: res.mockExams.map((ex, idx) => ({
    ...ex,
    isFreeSample: idx === 3, // Speed Round 30 Questions is free sample; full BNE papers unlock with bundle/enrollment
    priceUsd: idx === 3 ? 0 : 4.99
  })),
  questions: res.quickQuizzes.map((q, idx) => ({
    id: `qq-${idx + 1}`,
    prompt: q.q,
    options: q.options,
    answerIndex: q.answer,
    explanation: `Verified clinical rationale: "${q.options[q.answer]}" is the standard nursing/midwifery guideline answer.`
  }))
};

fs.writeFileSync(path.join(OUT_DIR, "dictionary.json"), JSON.stringify(dictPayload, null, 2));
fs.writeFileSync(path.join(OUT_DIR, "clinical-tools.json"), JSON.stringify(clinicalPayload, null, 2));
fs.writeFileSync(path.join(OUT_DIR, "mock-exams.json"), JSON.stringify(mockExamsPayload, null, 2));

console.log("Extracted datasets:", {
  terms: dictPayload.terms.length,
  abbreviations: dictPayload.abbreviations.length,
  checklists: clinicalPayload.checklists.length,
  exams: mockExamsPayload.exams.length,
  questions: mockExamsPayload.questions.length
});
