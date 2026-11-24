/**
 * Deterministic Session Quiz (5 Qs) & Course Final Evaluation (30 Qs) Builder
 * Question types:
 *  - "single"  (~70%) : answerIndex
 *  - "multi"   (~15%) : answerIndices (array of indices)
 *  - "boolean" (~15%) : answerIndex (0 = True, 1 = False)
 */

function hashSeed(str) {
  let h = 2166136261;
  const s = String(str || "nu");
  for (let i = 0; i < s.length; i += 1) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function seededPick(arr, count, seedStr, offset = 0) {
  if (!Array.isArray(arr) || !arr.length) return [];
  const copy = [...arr];
  let seed = hashSeed(`${seedStr}:${offset}`);
  for (let i = copy.length - 1; i > 0; i -= 1) {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    const j = seed % (i + 1);
    const tmp = copy[i];
    copy[i] = copy[j];
    copy[j] = tmp;
  }
  return copy.slice(0, count);
}

export function mapCourseToTopicIds(course) {
  const haystack = `${course?.slug || ""} ${course?.title || ""} ${course?.programmeLabel || ""} ${course?.subtitle || ""}`.toLowerCase();
  const ids = [];

  if (/anatomy|physiology|microbiology|pathology/.test(haystack)) ids.push("anatomy-physiology");
  if (/midwif|gynaec|gynec|reproductive|obstet|antenatal|labour|labor/.test(haystack)) ids.push("midwifery-maternal", "obstetrics-gynaecology");
  if (/pharmacol|drug|therapeut|dosage/.test(haystack)) ids.push("pharmacology");
  if (/paediat|pediat|child|neonat/.test(haystack)) ids.push("paediatrics");
  if (/community|epidemiol|public health|hygiene|biostat|research/.test(haystack)) ids.push("community-microbiology");
  if (/mental|psych|ethic|law|leadership|management|sociology|professional/.test(haystack)) ids.push("mental-health-ethics");
  if (/first aid|triage|emerg|trauma|critical|theatre/.test(haystack)) ids.push("emergency-critical");
  if (/foundation|fundamentals|assessment|nursing i\b|skills/.test(haystack)) ids.push("foundations-nursing");
  if (/medicine|medical|surg|tropical|palliative|ent|ophthalm/.test(haystack)) ids.push("medical-surgical");

  if (!ids.length) ids.push("foundations-nursing", "medical-surgical");
  // Always ensure extra pool topics if needed to reach 30 distinct questions
  for (const fallback of [
    "foundations-nursing",
    "medical-surgical",
    "pharmacology",
    "anatomy-physiology",
    "emergency-critical"
  ]) {
    if (!ids.includes(fallback)) ids.push(fallback);
  }
  return ids;
}

export function buildSessionQuiz(lesson, course, topicQuizzesData) {
  const bankTopics = topicQuizzesData?.topics || [];
  const topicIds = mapCourseToTopicIds(course);
  const primaryTopic = bankTopics.find((t) => t.id === topicIds[0]) || bankTopics[0];
  const secondaryTopic = bankTopics.find((t) => t.id === topicIds[1]) || bankTopics[1] || primaryTopic;

  const poolSingle = [
    ...(primaryTopic?.questions?.filter((q) => q.type === "single") || []),
    ...(secondaryTopic?.questions?.filter((q) => q.type === "single") || [])
  ];
  const poolMulti = [
    ...(primaryTopic?.questions?.filter((q) => q.type === "multi") || []),
    ...(secondaryTopic?.questions?.filter((q) => q.type === "multi") || [])
  ];
  const poolBool = [
    ...(primaryTopic?.questions?.filter((q) => q.type === "boolean") || []),
    ...(secondaryTopic?.questions?.filter((q) => q.type === "boolean") || [])
  ];

  const seed = `${course?.slug || ""}:${lesson?.slug || ""}`;
  const singles = seededPick(poolSingle, 3, seed, 1);
  const multis = seededPick(poolMulti, 1, seed, 2);
  const bools = seededPick(poolBool, 1, seed, 3);

  // Add one lesson-tailored objective/section item if available so session reflects the unit topic directly
  const sections = (lesson?.sections || []).filter((s) => s.title && !/reference|overview/i.test(s.title));
  let customSingle = null;
  if (sections.length >= 2) {
    const targetSec = sections[hashSeed(seed) % sections.length];
    const altDistractors = [
      "Routine non-clinical hospital housekeeping schedule",
      "Hospital payroll & procurement tender procedures",
      "Unverified traditional herbal compounding without dosage"
    ];
    const distractors = sections.filter((s) => s.title !== targetSec.title).slice(0, 1).map((s) => s.title);
    while (distractors.length < 3) distractors.push(altDistractors[distractors.length % altDistractors.length]);
    const options = seededPick([targetSec.title, ...distractors], 4, `${seed}:opt`);
    customSingle = {
      id: `sess-custom-${lesson.slug}`,
      type: "single",
      prompt: `Which priority topic belongs directly to the lesson "${lesson.title}"?`,
      options,
      answerIndex: options.indexOf(targetSec.title),
      rationale: `"${targetSec.title}" is a core structured section inside ${lesson.title}.`
    };
  }

  const chosenSingles = customSingle ? [customSingle, ...singles.slice(0, 2)] : singles;
  const combined = seededPick([...chosenSingles, ...multis, ...bools].slice(0, 5), 5, seed, 99);
  return combined.map((q, idx) => ({ ...q, qNum: idx + 1 }));
}

export function buildFinalEvaluation(course, topicQuizzesData) {
  const bankTopics = topicQuizzesData?.topics || [];
  const topicIds = mapCourseToTopicIds(course);

  const orderedTopics = topicIds
    .map((id) => bankTopics.find((t) => t.id === id))
    .filter(Boolean);

  const seenIds = new Set();
  const singlePool = [];
  const multiPool = [];
  const boolPool = [];

  for (const topic of orderedTopics) {
    for (const q of topic.questions || []) {
      if (seenIds.has(q.id)) continue;
      seenIds.add(q.id);
      if (q.type === "single") singlePool.push(q);
      else if (q.type === "multi") multiPool.push(q);
      else if (q.type === "boolean") boolPool.push(q);
    }
  }

  // Target 30 Questions: 21 Single (70%), 5 Multi (16.7%), 4 Boolean (13.3%) -> 70/15/15 mix
  const seed = `final-eval:${course?.slug || "course"}`;
  const pickedSingle = seededPick(singlePool, 21, seed, 11);
  const pickedMulti = seededPick(multiPool, 5, seed, 22);
  const pickedBool = seededPick(boolPool, 4, seed, 33);

  const combined = seededPick([...pickedSingle, ...pickedMulti, ...pickedBool].slice(0, 30), 30, seed, 99);
  return combined.map((q, idx) => ({ ...q, qNum: idx + 1 }));
}

export function gradeQuizResponses(questions, answersMap) {
  let score = 0;
  const breakdown = {
    single: { correct: 0, total: 0 },
    multi: { correct: 0, total: 0 },
    tf: { correct: 0, total: 0 }
  };
  const reviewItems = [];

  for (const q of questions) {
    const val = answersMap[q.id];
    let isCorrect = false;
    let correctLabel = "";

    if (q.type === "multi") {
      breakdown.multi.total += 1;
      const expected = [...(q.answerIndices || [])].sort((a, b) => a - b);
      const selected = Array.isArray(val) ? [...val].sort((a, b) => a - b) : [];
      isCorrect =
        expected.length > 0 &&
        expected.length === selected.length &&
        expected.every((v, idx) => v === selected[idx]);
      if (isCorrect) breakdown.multi.correct += 1;
      correctLabel = expected.map((i) => q.options?.[i]).filter(Boolean).join("; ");
    } else if (q.type === "boolean") {
      breakdown.tf.total += 1;
      isCorrect = Number(val) === Number(q.answerIndex);
      if (isCorrect) breakdown.tf.correct += 1;
      correctLabel = q.options?.[q.answerIndex] || (q.answerIndex === 0 ? "True" : "False");
    } else {
      breakdown.single.total += 1;
      isCorrect = val !== undefined && val !== null && Number(val) === Number(q.answerIndex);
      if (isCorrect) breakdown.single.correct += 1;
      correctLabel = q.options?.[q.answerIndex] || "";
    }

    if (isCorrect) score += 1;
    else {
      reviewItems.push({
        id: q.id,
        prompt: q.prompt,
        correctLabel,
        rationale: q.rationale || ""
      });
    }
  }

  const totalQuestions = questions.length;
  const percent = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

  return {
    score,
    totalQuestions,
    percent,
    passed: percent >= 60,
    breakdown,
    reviewItems
  };
}
