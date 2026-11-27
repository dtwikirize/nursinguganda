const fs = require("fs/promises");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const CURRICULUM_PATH = path.join(ROOT, "assets", "data", "curriculum.json");
const BOOK_LIBRARY_PATH = path.join(ROOT, "assets", "data", "book-library.json");
const OUTPUT_DIR = path.join(ROOT, "research", "enrichment");
const CANDIDATES_PATH = path.join(OUTPUT_DIR, "source-candidates.json");
const MATCHES_PATH = path.join(OUTPUT_DIR, "curriculum-match-suggestions.json");
const README_PATH = path.join(OUTPUT_DIR, "README.md");
const PLAN_PATH = path.join(OUTPUT_DIR, "priority-reading-plan.md");

const STOPWORDS = new Set([
  "about", "above", "after", "again", "against", "also", "and", "are", "because", "been",
  "before", "being", "between", "both", "but", "can", "course", "courses", "during",
  "each", "from", "for", "guide", "guideline", "guidelines", "has", "have", "into",
  "its", "manual", "more", "nurse", "nurses", "nursing", "onto", "other", "page",
  "pages", "part", "pdf", "practical", "programme", "programmes", "section", "should",
  "student", "students", "study", "than", "that", "the", "their", "these", "this",
  "through", "unit", "units", "use", "used", "uses", "using", "with", "will", "within"
]);

const SUBJECT_KEYWORDS = {
  "Foundations of Nursing": ["fundamental", "procedure", "ethics", "communication", "leadership", "research", "clinical", "skills"],
  "Anatomy and Physiology": ["anatomy", "physiology", "body", "cell", "tissue", "blood", "cardiovascular", "respiratory", "renal", "nervous"],
  Pharmacology: ["pharmacology", "drug", "drugs", "medicine", "medication", "dose", "dosage", "pharmacy"],
  Midwifery: ["midwifery", "obstetric", "pregnancy", "labour", "labor", "delivery", "maternal", "newborn", "antenatal", "postnatal"],
  "Child Health": ["pediatric", "paediatric", "child", "children", "neonatal", "newborn", "immunization", "infection"],
  "Community Health": ["community", "public", "health", "epidemiology", "nutrition", "first", "aid", "prevention"],
  "Medical Surgical Nursing": ["surgery", "surgical", "medical", "internal", "cardiology", "diabetes", "cancer", "asthma", "renal"],
  "Pathology and Infection": ["pathology", "pathophysiology", "infection", "microbiology", "parasitology", "virology", "immunology"],
  "Mental Health": ["psychiatry", "mental", "psychology", "psychosocial"],
  "Clinical Skills": ["assessment", "diagnosis", "first", "aid", "emergency", "care", "procedure", "skills"]
};

const GENERIC_IMPORT_TITLES = new Set(["nursing revision", "midwifery revision"]);

function normalize(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function words(value) {
  return normalize(value)
    .split(" ")
    .filter((word) => word.length > 2 && !STOPWORDS.has(word));
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function tokenSet(...parts) {
  return new Set(words(parts.join(" ")));
}

function intersectionSize(a, b) {
  let count = 0;
  for (const item of a) {
    if (b.has(item)) count += 1;
  }
  return count;
}

async function readJson(filePath) {
  return JSON.parse(await fs.readFile(filePath, "utf8"));
}

function flattenCurriculum(curriculum) {
  const units = [];

  for (const programme of curriculum.programmes || []) {
    for (const yearKey of Object.keys(programme.years || {})) {
      const year = programme.years[yearKey];
      for (const semesterKey of Object.keys(year.semesters || {})) {
        const semester = year.semesters[semesterKey];
        for (const unit of semester.courseUnits || []) {
          const topicGroups = unit.topicGroups || [];
          const topics = topicGroups.flatMap((group) =>
            (group.topics || [])
              .filter((topic) => !GENERIC_IMPORT_TITLES.has(normalize(topic.title)))
              .map((topic) => ({
                title: topic.title,
                sourceSlug: topic.sourceSlug,
                sourceHref: topic.sourceHref,
                groupTitle: group.title
              }))
          );

          const allText = [
            programme.label,
            unit.code,
            unit.title,
            ...topicGroups.map((group) => group.title),
            ...topics.map((topic) => topic.title)
          ].join(" ");

          units.push({
            programmeId: programme.id,
            programme: programme.label,
            year: year.year,
            semester: semester.semester,
            unitId: unit.id,
            unitCode: unit.code,
            unitTitle: unit.title,
            topicGroupCount: topicGroups.length,
            topicCount: topics.length,
            topicGroups: topicGroups.map((group) => group.title),
            topics,
            tokens: tokenSet(allText)
          });
        }
      }
    }
  }

  return units;
}

function subjectBoost(book, unit) {
  let boost = 0;
  const programmeText = normalize(unit.programme);
  const unitText = normalize(`${unit.unitTitle} ${unit.topicGroups.join(" ")} ${unit.topics.map((topic) => topic.title).join(" ")}`);

  for (const subject of book.subjects || []) {
    const terms = SUBJECT_KEYWORDS[subject] || [];
    if (terms.some((term) => unitText.includes(term))) boost += 6;
    if (subject === "Midwifery" && programmeText.includes("midwifery")) boost += 8;
    if (subject === "Child Health" && /pediatric|paediatric|child|newborn|neonatal/.test(unitText)) boost += 8;
    if (subject === "Anatomy and Physiology" && /anatomy|physiology|body|system/.test(unitText)) boost += 8;
    if (subject === "Pharmacology" && /pharmacology|drug|medicine|medication/.test(unitText)) boost += 8;
    if (subject === "Clinical Skills" && /procedure|assessment|care|emergency|first aid/.test(unitText)) boost += 6;
  }

  return boost;
}

function licenceReview(book) {
  const text = normalize(`${book.title} ${book.author} ${book.description} ${book.read_url} ${book.source_url}`);

  if (text.includes("openstax")) {
    return {
      status: "manual_verification_required",
      likelyUse: "Use table of contents and concepts as references only until the exact book licence and current OpenStax terms are verified.",
      aiRestriction: "Do not feed full OpenStax book text into AI tools or publish copied passages."
    };
  }

  if (text.includes("world health organization") || /\bwho\b/.test(text)) {
    return {
      status: "manual_verification_required",
      likelyUse: "WHO publications often have specific open access terms; verify the publication page before extracting beyond metadata.",
      aiRestriction: "Keep raw text out of the public app unless a licence explicitly allows reuse."
    };
  }

  if (text.includes("nhs") || text.includes("public health") || text.includes("hospital") || text.includes("ministry")) {
    return {
      status: "manual_verification_required",
      likelyUse: "Institutional or government-style guidance may be useful for curriculum gap checks and original summaries after source licence review.",
      aiRestriction: "Do not republish raw procedures or policy language without permission."
    };
  }

  return {
    status: "manual_verification_required",
    likelyUse: "Use as discovery metadata first. Review licence and source page before extraction.",
    aiRestriction: "Do not publish or transform full book text without confirmed permission."
  };
}

function recommendedUses(book) {
  const subjects = new Set(book.subjects || []);
  const uses = ["Curriculum gap check", "Further reading link"];

  if (subjects.has("Anatomy and Physiology") || subjects.has("Pharmacology")) uses.push("Topic outline comparison");
  if (subjects.has("Foundations of Nursing") || subjects.has("Clinical Skills")) uses.push("Clinical skills checklist ideas");
  if (subjects.has("Midwifery") || subjects.has("Child Health")) uses.push("Case scenario ideas");
  if (subjects.has("Community Health") || subjects.has("Pathology and Infection")) uses.push("Quiz and flashcard seed ideas");

  return unique(uses);
}

function rankCandidates(bookLibrary) {
  const highValueSubjects = new Set([
    "Foundations of Nursing",
    "Anatomy and Physiology",
    "Pharmacology",
    "Midwifery",
    "Child Health",
    "Community Health",
    "Medical Surgical Nursing",
    "Pathology and Infection",
    "Clinical Skills"
  ]);

  return (bookLibrary.books || [])
    .map((book) => {
      const subjectMatches = (book.subjects || []).filter((subject) => highValueSubjects.has(subject)).length;
      const text = normalize(`${book.title} ${book.description} ${book.author} ${book.collection_title}`);
      let relevance = Number(book.score || 0) + subjectMatches * 4;

      if (text.includes("nursing") || text.includes("midwifery")) relevance += 8;
      if (text.includes("pharmacology") || text.includes("anatomy") || text.includes("physiology")) relevance += 6;
      if (text.includes("procedure") || text.includes("clinical") || text.includes("emergency")) relevance += 5;
      if (text.includes("who") || text.includes("openstax") || text.includes("ministry") || text.includes("nhs")) relevance += 3;

      return {
        id: book.id,
        title: book.title,
        author: book.author || "Unknown source",
        collection: book.collection_title,
        collectionSlug: book.collection_slug,
        sourceUrl: book.source_url,
        readUrl: book.read_url,
        description: book.description,
        pages: book.pages || "",
        fileSize: book.file_size || "",
        subjects: book.subjects || [],
        sourceScore: book.score || 0,
        enrichmentScore: Math.min(120, relevance),
        recommendedUses: recommendedUses(book),
        licenceReview: licenceReview(book),
        rawTextPolicy: "Do not publish raw book text in Nursing Uganda. Use verified sources to write original notes with attribution."
      };
    })
    .filter((book) => book.enrichmentScore >= 88)
    .sort((a, b) => b.enrichmentScore - a.enrichmentScore || a.title.localeCompare(b.title))
    .slice(0, 60);
}

function matchCandidatesToCurriculum(candidates, curriculumUnits) {
  return candidates.map((book) => {
    const bookTokens = tokenSet(book.title, book.description, book.collection, book.subjects.join(" "), book.author);

    const matchedUnits = curriculumUnits
      .map((unit) => {
        const overlap = intersectionSize(bookTokens, unit.tokens);
        const score = overlap * 5 + subjectBoost(book, unit);

        const matchingTopics = unit.topics
          .map((topic) => {
            const topicTokens = tokenSet(topic.title, topic.groupTitle);
            const topicScore = intersectionSize(bookTokens, topicTokens) * 4;
            return { ...topic, score: topicScore };
          })
          .filter((topic) => topic.score > 0)
          .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
          .slice(0, 8)
          .map(({ score: _score, ...topic }) => topic);

        return {
          programme: unit.programme,
          year: unit.year,
          semester: unit.semester,
          unitCode: unit.unitCode,
          unitTitle: unit.unitTitle,
          topicGroupCount: unit.topicGroupCount,
          topicCount: unit.topicCount,
          matchScore: score,
          suggestedTopicTouchpoints: matchingTopics
        };
      })
      .filter((unit) => unit.matchScore >= 8)
      .sort((a, b) => b.matchScore - a.matchScore || a.unitTitle.localeCompare(b.unitTitle))
      .slice(0, 12);

    return {
      bookId: book.id,
      title: book.title,
      author: book.author,
      subjects: book.subjects,
      readUrl: book.readUrl,
      enrichmentScore: book.enrichmentScore,
      bestCurriculumMatches: matchedUnits,
      nextAction: matchedUnits.length
        ? "Review these units, verify the source licence, then write original Nursing Uganda notes or quiz prompts."
        : "Keep as a general reference candidate; no strong curriculum match was found."
    };
  });
}

function buildReadme(summary) {
  return `# Nursing Uganda Enrichment Research

This folder is for internal curriculum enrichment research. It is not part of the public app content pipeline.

## What was generated

- \`source-candidates.json\`: relevant books from the local InfoBooks index, ranked for Nursing Uganda.
- \`curriculum-match-suggestions.json\`: suggested matches between those books and existing curriculum units/topics.
- \`priority-reading-plan.md\`: a short review queue for the most useful sources.

## Use rules

- Do not publish downloaded PDFs or raw book text in the web app.
- Verify each source licence before extracting beyond metadata, headings, or short notes.
- Use sources to write original Nursing Uganda explanations, quizzes, checklists, and summaries.
- Keep any downloaded PDFs in ignored folders such as \`tmp/\` or \`research/enrichment/raw/\`.
- Keep extracted raw text in \`research/enrichment/extracted/\` and review it manually before it influences public content.

## Current summary

- Candidate books: ${summary.candidateCount}
- Curriculum units scanned: ${summary.unitCount}
- Programmes scanned: ${summary.programmeCount}
- Generated at UTC: ${summary.generatedAtUtc}
`;
}

function buildPriorityPlan(candidates, matches, summary) {
  const topCandidates = candidates.slice(0, 20);
  const matchByBook = new Map(matches.map((item) => [item.bookId, item]));

  const lines = [
    "# Priority Reading Plan",
    "",
    "Use this as the first review queue for enriching Nursing Uganda. Verify licences before extracting text; write original notes, quizzes, and summaries.",
    "",
    `Generated at UTC: ${summary.generatedAtUtc}`,
    "",
    "## First Sources To Review",
    ""
  ];

  topCandidates.forEach((book, index) => {
    const match = matchByBook.get(book.id);
    const bestMatches = (match && match.bestCurriculumMatches ? match.bestCurriculumMatches : []).slice(0, 3);

    lines.push(`### ${index + 1}. ${book.title}`);
    lines.push("");
    lines.push(`- Author/source: ${book.author}`);
    lines.push(`- Subjects: ${book.subjects.join(", ") || "General medical reading"}`);
    lines.push(`- Suggested use: ${book.recommendedUses.join(", ")}`);
    lines.push(`- Licence step: ${book.licenceReview.status}`);
    lines.push(`- Read link: ${book.readUrl}`);

    if (bestMatches.length) {
      lines.push("- Best curriculum matches:");
      bestMatches.forEach((unit) => {
        lines.push(`  - ${unit.unitCode} ${unit.unitTitle} (${unit.programme}, Year ${unit.year}, Semester ${unit.semester})`);
      });
    }

    lines.push("");
  });

  lines.push("## Content Enrichment Workflow");
  lines.push("");
  lines.push("1. Open one source from the list and verify the licence on the original source page.");
  lines.push("2. Compare its headings or concepts with the matched Nursing Uganda units.");
  lines.push("3. Write original Nursing Uganda notes, examples, quizzes, or checklists.");
  lines.push("4. Add attribution or further-reading links where appropriate.");
  lines.push("5. Keep raw PDFs and extracted text out of the public app.");
  lines.push("");

  return `${lines.join("\n")}\n`;
}

async function main() {
  const [curriculum, bookLibrary] = await Promise.all([readJson(CURRICULUM_PATH), readJson(BOOK_LIBRARY_PATH)]);
  const curriculumUnits = flattenCurriculum(curriculum);
  const candidates = rankCandidates(bookLibrary);
  const matches = matchCandidatesToCurriculum(candidates, curriculumUnits);
  const generatedAtUtc = new Date().toISOString();

  const summary = {
    generatedAtUtc,
    sourceLibraryGeneratedAtUtc: bookLibrary.generated_at_utc,
    candidateCount: candidates.length,
    unitCount: curriculumUnits.length,
    programmeCount: (curriculum.programmes || []).length,
    policy: {
      downloads: "not_downloaded",
      publicUse: "metadata and original summaries only after licence review",
      rawText: "do_not_publish"
    }
  };

  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  await fs.writeFile(CANDIDATES_PATH, `${JSON.stringify({ summary, candidates }, null, 2)}\n`);
  await fs.writeFile(MATCHES_PATH, `${JSON.stringify({ summary, matches }, null, 2)}\n`);
  await fs.writeFile(README_PATH, buildReadme(summary));
  await fs.writeFile(PLAN_PATH, buildPriorityPlan(candidates, matches, summary));

  console.log(`Wrote ${path.relative(ROOT, CANDIDATES_PATH)}`);
  console.log(`Wrote ${path.relative(ROOT, MATCHES_PATH)}`);
  console.log(`Wrote ${path.relative(ROOT, README_PATH)}`);
  console.log(`Wrote ${path.relative(ROOT, PLAN_PATH)}`);
  console.log(`Candidate books: ${summary.candidateCount}`);
  console.log(`Curriculum units scanned: ${summary.unitCount}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
