#!/usr/bin/env node
/* Match imported Nursing Uganda images to curriculum topics and create a review queue. */
const fs = require("node:fs");
const path = require("node:path");

const ROOT = process.cwd();
const CURRICULUM_PATH = path.join(ROOT, "assets", "data", "curriculum.json");
const IMAGE_MANIFEST_PATH = path.join(ROOT, "assets", "images", "nursing-uganda-source-image-library.json");
const OUTPUT_PATH = path.join(ROOT, "assets", "data", "topic-image-matches.json");
const MIN_SCORE = 8;

const STOP_WORDS = new Set([
  "about", "after", "among", "and", "are", "care", "case", "common", "course", "definition",
  "during", "each", "from", "general", "guide", "health", "human", "into", "introduction",
  "learn", "lesson", "management", "medical", "nurse", "nurses", "nursing", "patient", "patients",
  "practice", "revision", "study", "that", "their", "this", "topic", "unit", "used", "with"
]);

const IMPORTANT_TERMS = new Set([
  "abdomen", "abortion", "anaemia", "anemia", "antenatal", "asthma", "autoclave", "blood",
  "burns", "cancer", "cannula", "catheter", "cervix", "diabetes", "dressing", "drugs",
  "ectopic", "epilepsy", "fetal", "foetal", "forceps", "fracture", "heart", "hemorrhage",
  "haemorrhage", "hypertension", "immunization", "kidney", "labour", "labor", "liver",
  "malaria", "mental", "newborn", "nutrition", "pancreas", "placenta", "pregnancy",
  "psychiatric", "stethoscope", "surgical", "syringe", "uterus", "vaccine", "wound"
]);

const CATEGORY_RULES = [
  { category: "midwifery", weight: 9, pattern: /\b(midwifery|obstetric|gynaecology|gynecology|pregnan|antenatal|postnatal|puerper|fetal|foetal|newborn|placenta|uterus|cervix|labou?r|abortion|ectopic|pre-?eclampsia|eclampsia)\b/g },
  { category: "anatomy-physiology", weight: 8, pattern: /\b(anatomy|physiology|heart|lung|kidney|liver|pancreas|skeleton|skeletal|muscle|muscular|brain|eye|ear|nerve|blood|lymph|digestive|respiratory|cardio|endocrine)\b/g },
  { category: "medical-instruments", weight: 10, pattern: /\b(instrument|forceps|syringe|needle|catheter|stethoscope|tray|autoclave|scissor|cannula|suture|thermometer|speculum|clamp)\b/g },
  { category: "medical-surgical", weight: 8, pattern: /\b(surgical|surgery|wound|dressing|theatre|operation|burn|fracture|ulcer|drainage|suturing|amputation)\b/g },
  { category: "community-health", weight: 8, pattern: /\b(community|public|immuni[sz]ation|vaccine|nutrition|malnutrition|family planning|primary health|phc|epidemiology|environmental|sanitation)\b/g },
  { category: "mental-health", weight: 9, pattern: /\b(mental|psychiatric|psychology|counsel|depression|anxiety|psychosis|schizophrenia|mania|addiction)\b/g },
  { category: "pharmacology", weight: 8, pattern: /\b(pharmac|drug|medicine|tablet|dose|injection|toxicology|anaesthesia|antibiotic|antihypertensive|antiemetic)\b/g },
  { category: "nursing-training", weight: 5, pattern: /\b(skill lab|training|student|school|lecture|demonstration|procedure)\b/g }
];

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function cleanText(value) {
  return String(value || "")
    .replace(/[_/\\.-]+/g, " ")
    .replace(/[^a-z0-9\s]+/gi, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function tokensFor(value) {
  return cleanText(value)
    .split(" ")
    .filter((token) => token.length >= 4 && !STOP_WORDS.has(token))
    .map((token) => token.replace(/ies$/, "y").replace(/s$/, ""));
}

function sortedYears(programme) {
  return Object.entries(programme.years || {}).sort((a, b) => a[1].year - b[1].year);
}

function sortedSemesters(year) {
  return Object.entries(year.semesters || {}).sort((a, b) => a[1].semester - b[1].semester);
}

function topicKey(programme, unit, topic) {
  return [programme.id, unit.id, topic.groupIndex, topic.topicIndex, topic.sourceSlug || topic.title].join("::");
}

function flattenTopics(curriculum) {
  const topics = [];
  for (const programme of curriculum.programmes || []) {
    for (const [, year] of sortedYears(programme)) {
      for (const [, semester] of sortedSemesters(year)) {
        for (const unit of semester.courseUnits || []) {
          (unit.topicGroups || []).forEach((group, groupIndex) => {
            (group.topics || []).forEach((topic, topicIndex) => {
              const richTopic = { ...topic, groupIndex, topicIndex, groupTitle: group.title };
              const lesson = topic.sourceSlug && curriculum.lessons ? curriculum.lessons[topic.sourceSlug] : null;
              const sectionTitles = lesson && lesson.sections ? lesson.sections.slice(0, 4).map((section) => section.title).join(" ") : "";
              const text = [
                programme.label,
                unit.code,
                unit.title,
                group.title,
                topic.title,
                topic.sourceSlug,
                lesson && lesson.title,
                lesson && lesson.excerpt,
                sectionTitles
              ].filter(Boolean).join(" ");
              topics.push({
                key: topicKey(programme, unit, richTopic),
                programme: programme.label,
                programmeId: programme.id,
                unit: unit.title,
                unitId: unit.id,
                unitCode: unit.code || "",
                group: group.title,
                title: topic.title,
                sourceSlug: topic.sourceSlug || "",
                text,
                tokens: new Set(tokensFor(text))
              });
            });
          });
        }
      }
    }
  }
  return topics;
}

function prepareImages(manifest) {
  return (manifest.images || [])
    .filter((image) => ![".svg", ".gif"].includes(image.extension))
    .filter((image) => image.size_bytes >= 7000)
    .map((image) => {
      const text = cleanText([
        image.id,
        image.file,
        image.category,
        image.original_file_hint,
        image.source_path
      ].filter(Boolean).join(" "));
      return {
        ...image,
        text,
        tokens: new Set(tokensFor(text))
      };
    });
}

function categoryMatches(topicText, category) {
  const matched = [];
  let score = 0;
  for (const rule of CATEGORY_RULES) {
    const hits = [...topicText.matchAll(rule.pattern)].map((match) => match[0].toLowerCase());
    if (!hits.length) continue;
    if (rule.category === category) {
      score += rule.weight + Math.min(hits.length, 4);
      matched.push(...hits.slice(0, 4));
    }
  }
  return { score, matched };
}

function scoreImage(topic, image) {
  const matchedTerms = new Set();
  let score = 0;

  const categoryScore = categoryMatches(cleanText(topic.text), image.category);
  score += categoryScore.score;
  categoryScore.matched.forEach((term) => matchedTerms.add(term));

  if (/midwifery/i.test(topic.programme) && image.source === "midwifery") score += 5;
  if (!/midwifery/i.test(topic.programme) && image.category === "midwifery") score -= 2;

  const titleText = cleanText(topic.title);
  if (titleText.length > 10 && image.text.includes(titleText)) {
    score += 14;
    matchedTerms.add(titleText);
  }

  for (const token of topic.tokens) {
    if (!image.tokens.has(token)) continue;
    score += IMPORTANT_TERMS.has(token) ? 5 : 3;
    matchedTerms.add(token);
  }

  for (const term of IMPORTANT_TERMS) {
    if (cleanText(topic.text).includes(term) && image.text.includes(term)) {
      score += 2;
      matchedTerms.add(term);
    }
  }

  if (/nursing-uganda-(nursing-study|midwifery)-image-\d+/i.test(image.file)) score -= 5;
  if (image.size_bytes > 50000) score += 2;
  if (image.size_bytes > 120000) score += 1;

  return {
    score,
    matchedTerms: [...matchedTerms].slice(0, 10)
  };
}

function confidenceFor(score) {
  if (score >= 24) return "strong";
  if (score >= 15) return "medium";
  return "needs-review";
}

function main() {
  const curriculum = readJson(CURRICULUM_PATH);
  const imageManifest = readJson(IMAGE_MANIFEST_PATH);
  const topics = flattenTopics(curriculum);
  const images = prepareImages(imageManifest);
  const matches = {};
  const reviewQueue = [];
  const unmatched = [];
  const categoryCounts = {};

  for (const topic of topics) {
    let best = null;
    for (const image of images) {
      const result = scoreImage(topic, image);
      if (!best || result.score > best.score) {
        best = { image, score: result.score, matchedTerms: result.matchedTerms };
      }
    }

    if (!best || best.score < MIN_SCORE) {
      unmatched.push({
        topic_key: topic.key,
        topic_title: topic.title,
        unit_title: topic.unit,
        programme: topic.programme
      });
      continue;
    }

    const entry = {
      topic_key: topic.key,
      topic_title: topic.title,
      unit_title: topic.unit,
      unit_code: topic.unitCode,
      programme: topic.programme,
      image: best.image.file,
      alt: `Visual reference for ${topic.title}`,
      category: best.image.category,
      score: best.score,
      confidence: confidenceFor(best.score),
      matched_terms: best.matchedTerms,
      review_status: best.score >= 24 ? "approved-first-pass" : "review-recommended",
      image_id: best.image.id
    };

    matches[topic.key] = {
      image: entry.image,
      alt: entry.alt,
      category: entry.category,
      confidence: entry.confidence,
      score: entry.score,
      matched_terms: entry.matched_terms
    };
    reviewQueue.push(entry);
    categoryCounts[entry.category] = (categoryCounts[entry.category] || 0) + 1;
  }

  reviewQueue.sort((a, b) => a.confidence.localeCompare(b.confidence) || b.score - a.score);
  const output = {
    generated_at_utc: new Date().toISOString(),
    minimum_score: MIN_SCORE,
    total_topics: topics.length,
    matched_topics: reviewQueue.length,
    unmatched_topics: unmatched.length,
    category_counts: categoryCounts,
    review_queue: reviewQueue,
    unmatched: unmatched.slice(0, 500),
    matches
  };

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2));
  console.log(`Topics: ${topics.length}`);
  console.log(`Images considered: ${images.length}`);
  console.log(`Matched topics: ${reviewQueue.length}`);
  console.log(`Unmatched topics: ${unmatched.length}`);
  console.log(`Review file: ${OUTPUT_PATH}`);
}

main();
