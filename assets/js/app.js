const state = {
  data: null,
  imageMatches: null,
  bookLibrary: null,
  imageLibrary: null,
  optimizedImages: {},
  navOpen: false,
  search: "",
  globalSearch: "",
  schoolSearch: "",
  schoolStatus: "all",
  imageReviewSearch: "",
  imageReviewStatus: "strong",
  librarySearch: "",
  librarySubject: "all",
  imagePickerKey: "",
  imagePickerSearch: "",
  imagePickerCategory: "all",
  theme: localStorage.getItem("nursinguganda.theme") || "light"
};

const app = document.querySelector("#app");

const routeMap = {
  notes: { label: "Notes", href: "#/notes", icon: "bookOpen" },
  courses: { label: "Courses", href: "#/courses", icon: "graduationCap" },
  resources: { label: "Resources", href: "#/resources", icon: "folderOpen" }
};

const iconPaths = {
  activity: `<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>`,
  arrowLeft: `<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>`,
  arrowRight: `<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>`,
  badgeCheck: `<path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.77 4 4 0 0 1 0 6.76 4 4 0 0 1-4.78 4.77 4 4 0 0 1-6.74 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><path d="m9 12 2 2 4-4"/>`,
  bookOpen: `<path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3Z"/><path d="M21 18a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1h-5a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3Z"/>`,
  bookmark: `<path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16Z"/>`,
  bookmarkCheck: `<path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16Z"/><path d="m9 10 2 2 4-4"/>`,
  briefcaseMedical: `<path d="M12 11v4"/><path d="M14 13h-4"/><path d="M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><rect width="20" height="14" x="2" y="6" rx="2"/>`,
  calendar: `<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>`,
  checkCircle: `<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/>`,
  clipboardList: `<rect width="8" height="4" x="8" y="2" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/>`,
  externalLink: `<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>`,
  fileText: `<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>`,
  folderOpen: `<path d="m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6A2 2 0 0 1 18.46 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.9a2 2 0 0 1 1.69.9L13 6h7a2 2 0 0 1 2 2v2"/>`,
  graduationCap: `<path d="M21.42 10.92a1 1 0 0 0-.02-1.84l-8.57-3.9a2 2 0 0 0-1.66 0l-8.57 3.9a1 1 0 0 0 0 1.84l8.57 3.9a2 2 0 0 0 1.66 0Z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/>`,
  heartPulse: `<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3H21"/>`,
  helpCircle: `<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 1 1 5.82 1c0 2-3 2-3 4"/><path d="M12 17h.01"/>`,
  home: `<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/><path d="M9 22V12h6v10"/>`,
  listChecks: `<path d="m3 17 2 2 4-4"/><path d="m3 7 2 2 4-4"/><path d="M13 6h8"/><path d="M13 12h8"/><path d="M13 18h8"/>`,
  moon: `<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>`,
  pill: `<path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/>`,
  printer: `<path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 14h12v8H6z"/>`,
  rotateCcw: `<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>`,
  school: `<path d="m4 6 8-4 8 4"/><path d="m18 10 4 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8l4-2"/><path d="M14 22v-6a2 2 0 0 0-4 0v6"/><path d="M18 5v17"/><path d="M6 5v17"/><circle cx="12" cy="9" r="2"/>`,
  search: `<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>`,
  stethoscope: `<path d="M11 2v2"/><path d="M5 2v2"/><path d="M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1"/><path d="M8 15a6 6 0 0 0 12 0v-3"/><circle cx="20" cy="10" r="2"/>`,
  sun: `<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>`,
  syringe: `<path d="m18 2 4 4"/><path d="m17 7 3-3"/><path d="M19 9 8.7 19.3c-1 1-2.5 1-3.5 0l-.5-.5c-1-1-1-2.5 0-3.5L15 5"/><path d="m9 11 4 4"/><path d="m5 19-3 3"/><path d="m14 4 6 6"/>`
};

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function currentRoute() {
  const hash = window.location.hash.replace(/^#\/?/, "");
  return hash ? hash.split("/").filter(Boolean) : ["notes"];
}

function routeKey(parts = currentRoute()) {
  if (parts[0] === "courses") return "courses";
  if (parts[0] === "resources") return "resources";
  return "notes";
}

function setRoute(path) {
  window.location.hash = path;
}

function applyTheme() {
  document.documentElement.dataset.theme = state.theme;
}

function setTheme(theme) {
  state.theme = theme;
  localStorage.setItem("nursinguganda.theme", theme);
  applyTheme();
}

applyTheme();

function sortedYears(programme) {
  return Object.entries(programme.years).sort((a, b) => a[1].year - b[1].year);
}

function sortedSemesters(year) {
  return Object.entries(year.semesters).sort((a, b) => a[1].semester - b[1].semester);
}

function allUnits(programme) {
  const units = [];
  for (const [, year] of sortedYears(programme)) {
    for (const [, semester] of sortedSemesters(year)) {
      for (const unit of semester.courseUnits) {
        units.push({ ...unit, year: year.year, semester: semester.semester });
      }
    }
  }
  return units;
}

function findProgramme(id) {
  return state.data.programmes.find((programme) => programme.id === id);
}

function findUnit(programme, unitId) {
  return allUnits(programme).find((unit) => unit.id === unitId || unit.slug === unitId);
}

function flatTopics(unit) {
  const topics = [];
  (unit.topicGroups || []).forEach((group, groupIndex) => {
    group.topics.forEach((topic, topicIndex) => {
      topics.push({
        ...topic,
        groupTitle: group.title,
        groupIndex,
        topicIndex,
        flatIndex: topics.length
      });
    });
  });
  return topics;
}

function findTopic(unit, groupIndex, topicIndex) {
  const group = (unit.topicGroups || [])[Number(groupIndex)];
  if (!group) return null;
  const topic = group.topics[Number(topicIndex)];
  if (!topic) return null;
  return {
    ...topic,
    groupTitle: group.title,
    groupIndex: Number(groupIndex),
    topicIndex: Number(topicIndex),
    flatIndex: flatTopics(unit).findIndex((item) => item.groupIndex === Number(groupIndex) && item.topicIndex === Number(topicIndex))
  };
}

function lessonFor(topic) {
  return topic && topic.sourceSlug && state.data.lessons ? state.data.lessons[topic.sourceSlug] : null;
}

function topicKey(programme, unit, topic) {
  return [programme.id, unit.id, topic.groupIndex, topic.topicIndex, topic.sourceSlug || topic.title].join("::");
}

function topicImageMatch(programme, unit, topic) {
  const matches = state.imageMatches && state.imageMatches.matches ? state.imageMatches.matches : {};
  const key = topicKey(programme, unit, topic);
  const match = matches[key];
  const decision = imageReviewDecision(key);
  if (decision.status === "custom" && decision.image) {
    return {
      image: decision.image,
      alt: decision.alt || `Visual reference for ${topic.title}`,
      category: decision.category || "nursing-study",
      confidence: "custom"
    };
  }
  if (!match || decision.status === "hidden" || decision.status === "replace") return null;
  if (decision.status === "approved") return match;
  return match.confidence === "strong" ? match : null;
}

function imageReviewDecisions() {
  try {
    return JSON.parse(localStorage.getItem("nursinguganda.imageReviewDecisions") || "{}");
  } catch {
    return {};
  }
}

function imageReviewDecision(key) {
  return imageReviewDecisions()[key] || { status: "" };
}

function setImageReviewDecision(key, status, details = {}) {
  const decisions = imageReviewDecisions();
  if (!status || status === "clear") delete decisions[key];
  else decisions[key] = { status, ...details, savedAt: new Date().toISOString() };
  localStorage.setItem("nursinguganda.imageReviewDecisions", JSON.stringify(decisions));
}

function imageReviewDecisionStats(decisions = imageReviewDecisions()) {
  return Object.values(decisions).reduce((stats, item) => {
    stats[item.status] = (stats[item.status] || 0) + 1;
    stats.total += 1;
    return stats;
  }, { total: 0, approved: 0, hidden: 0, replace: 0, custom: 0 });
}

function imageReviewDecisionLabel(status) {
  const labels = {
    approved: "Approved",
    custom: "Custom",
    hidden: "Hidden",
    replace: "Replace"
  };
  return labels[status] || "";
}

function completedTopics() {
  try {
    return JSON.parse(localStorage.getItem("nursinguganda.completedTopics") || "{}");
  } catch {
    return {};
  }
}

function setTopicComplete(key, complete) {
  const completed = completedTopics();
  if (complete) completed[key] = true;
  else delete completed[key];
  localStorage.setItem("nursinguganda.completedTopics", JSON.stringify(completed));
}

function allStudyTopics() {
  const topics = [];
  for (const programme of state.data.programmes) {
    for (const unit of allUnits(programme)) {
      for (const topic of flatTopics(unit)) {
        topics.push({ programme, unit, topic });
      }
    }
  }
  return topics;
}

function overallProgress() {
  const topics = allStudyTopics();
  const completed = completedTopics();
  const done = topics.filter(({ programme, unit, topic }) => completed[topicKey(programme, unit, topic)]).length;
  const percent = topics.length ? Math.round((done / topics.length) * 100) : 0;
  return { total: topics.length, done, percent };
}

function lastStudiedTopic() {
  try {
    return JSON.parse(localStorage.getItem("nursinguganda.lastStudiedTopic") || "null");
  } catch {
    return null;
  }
}

function setLastStudiedTopic(programme, unit, topic, lesson) {
  localStorage.setItem("nursinguganda.lastStudiedTopic", JSON.stringify({
    title: lesson ? lesson.title : topic.title,
    topicTitle: topic.title,
    programme: programme.label,
    unit: `${unit.code ? `${unit.code}: ` : ""}${unit.title}`,
    href: topicHref(programme, unit, topic.groupIndex, topic.topicIndex),
    key: topicKey(programme, unit, topic),
    savedAt: new Date().toISOString()
  }));
}

function quizAttempts() {
  try {
    return JSON.parse(localStorage.getItem("nursinguganda.quizAttempts") || "{}");
  } catch {
    return {};
  }
}

function setQuizAnswer(key, questionIndex, answerIndex) {
  const attempts = quizAttempts();
  if (!attempts[key]) attempts[key] = {};
  attempts[key][questionIndex] = answerIndex;
  localStorage.setItem("nursinguganda.quizAttempts", JSON.stringify(attempts));
}

function resetQuiz(key) {
  const attempts = quizAttempts();
  delete attempts[key];
  localStorage.setItem("nursinguganda.quizAttempts", JSON.stringify(attempts));
}

function bookmarks() {
  try {
    return JSON.parse(localStorage.getItem("nursinguganda.bookmarks") || "[]");
  } catch {
    return [];
  }
}

function isBookmarked(key) {
  return bookmarks().some((item) => item.key === key);
}

function setBookmark(item, save) {
  const saved = bookmarks().filter((bookmark) => bookmark.key !== item.key);
  if (save) saved.unshift({ ...item, savedAt: new Date().toISOString() });
  localStorage.setItem("nursinguganda.bookmarks", JSON.stringify(saved.slice(0, 80)));
}

function bookmarkButton(item) {
  const active = isBookmarked(item.key);
  return `
    <button
      type="button"
      class="bookmark-toggle${active ? " active" : ""}"
      data-bookmark-key="${escapeHtml(item.key)}"
      data-bookmark-title="${escapeHtml(item.title)}"
      data-bookmark-type="${escapeHtml(item.type)}"
      data-bookmark-context="${escapeHtml(item.context || "")}"
      data-bookmark-href="${escapeHtml(item.href)}"
    >${icon(active ? "bookmarkCheck" : "bookmark")}<span>${active ? "Saved" : "Save"}</span></button>
  `;
}

function topicProgress(programme, unit) {
  const topics = flatTopics(unit);
  const completed = completedTopics();
  const done = topics.filter((topic) => completed[topicKey(programme, unit, topic)]).length;
  const available = topics.filter((topic) => lessonFor(topic)).length;
  const percent = topics.length ? Math.round((done / topics.length) * 100) : 0;
  return { total: topics.length, done, available, percent };
}

function truncateText(value, max = 150) {
  const text = String(value || "").replace(/\s+/g, " ").trim();
  if (text.length <= max) return text;
  return `${text.slice(0, max).replace(/\s+\S*$/, "")}...`;
}

function lessonSearchText(lesson) {
  if (!lesson) return "";
  const sections = (lesson.sections || [])
    .map((section) => `${section.title} ${(section.blocks || []).map((block) => block.text).join(" ")}`)
    .join(" ");
  return `${lesson.title || ""} ${lesson.excerpt || ""} ${sections}`;
}

function snippetFor(text, query, max = 170) {
  const normalized = String(text || "").replace(/\s+/g, " ").trim();
  if (!normalized) return "";
  const index = normalized.toLowerCase().indexOf(query.toLowerCase());
  if (index < 0) return truncateText(normalized, max);
  const start = Math.max(0, index - 55);
  const snippet = normalized.slice(start, start + max);
  return `${start > 0 ? "..." : ""}${truncateText(snippet, max)}`;
}

function schoolDirectory() {
  return [
    {
      name: "Arua School of Nursing",
      district: "Arua",
      sector: "Government",
      programmes: ["Diploma Midwifery", "Diploma Comprehensive Nursing", "Certificate Comprehensive Nursing"],
      verification: "Confirm with UNMC and the school before applying",
      status: "Full Registration",
      note: "Listed by UNMC with Arua Regional Referral Hospital as training facility."
    },
    {
      name: "Butabika School of Psychiatric Nursing",
      district: "Kampala",
      sector: "Government",
      programmes: ["Diploma Mental Health Nursing", "Certificate Mental Health Nursing"],
      verification: "Confirm with UNMC and the school before applying",
      status: "Full Registration",
      note: "Useful for students interested in mental health nursing pathways."
    },
    {
      name: "Hoima School of Nursing",
      district: "Hoima",
      sector: "Government",
      programmes: ["Certificate Nursing", "Certificate Midwifery"],
      verification: "Confirm with UNMC and the school before applying",
      status: "Provisional License",
      note: "Check the current UNMC status before submitting an application."
    },
    {
      name: "Jinja School of Nursing and Midwifery",
      district: "Jinja",
      sector: "Government",
      programmes: ["Diploma Nursing", "Diploma Midwifery", "Diploma Paediatric Nursing", "Certificate Comprehensive Nursing"],
      verification: "Confirm with UNMC and the school before applying",
      status: "Full Registration",
      note: "Listed with Jinja Regional Referral Hospital as training facility."
    },
    {
      name: "Mulago School of Nursing and Midwifery",
      district: "Kampala",
      sector: "Government",
      programmes: ["Diploma Nursing", "Diploma Midwifery"],
      verification: "Confirm with UNMC and the school before applying",
      status: "Full Registration",
      note: "Public training institution linked to national referral hospital clinical exposure."
    },
    {
      name: "Public Health Nurses College",
      district: "Kampala",
      sector: "Government",
      programmes: ["Diploma Public Health Nursing", "Diploma Community Health", "Diploma Nursing", "Diploma Midwifery"],
      verification: "Confirm with UNMC and the school before applying",
      status: "Full Registration",
      note: "Strong fit for public health and community health interests."
    },
    {
      name: "Mengo School of Nursing and Midwifery",
      district: "Kampala",
      sector: "Faith Based",
      programmes: ["Diploma Nursing", "Diploma Midwifery", "Certificate Nursing", "Certificate Midwifery"],
      verification: "Confirm with UNMC and the school before applying",
      status: "Full Registration",
      note: "Offers certificate and diploma routes according to the UNMC listing."
    },
    {
      name: "Nsambya School of Nursing and Midwifery",
      district: "Kampala",
      sector: "Faith Based",
      programmes: ["Diploma Nursing", "Diploma Midwifery", "Certificate Nursing", "Certificate Midwifery"],
      verification: "Confirm with UNMC and the school before applying",
      status: "Full Registration",
      note: "Listed with direct and extension diploma options."
    },
    {
      name: "Gulu School of Nursing and Midwifery",
      district: "Gulu",
      sector: "Private",
      programmes: ["Certificate Nursing", "Certificate Midwifery", "Diploma Nursing", "Diploma Midwifery"],
      verification: "Confirm with UNMC and the school before applying",
      status: "Full Registration",
      note: "Northern Uganda option with both certificate and diploma pathways."
    },
    {
      name: "Makerere University Department of Nursing",
      district: "Kampala",
      sector: "University",
      programmes: ["Bachelor of Nursing Science", "Master of Nursing Science"],
      verification: "Confirm with UNMC and the school before applying",
      status: "Full Registration",
      note: "University-level pathway for degree and postgraduate nursing study."
    },
    {
      name: "Mbarara University Department of Nursing",
      district: "Mbarara",
      sector: "University",
      programmes: ["Bachelor of Nursing Science", "Master of Nursing Science"],
      verification: "Confirm with UNMC and the school before applying",
      status: "Full Registration",
      note: "University-level option for western Uganda."
    },
    {
      name: "Uganda Nursing School Bwindi",
      district: "Kanungu",
      sector: "Faith Based",
      programmes: ["Diploma Nursing", "Certificate Nursing", "Certificate Midwifery"],
      verification: "Confirm with UNMC and the school before applying",
      status: "Provisional License",
      note: "Confirm current recognition status directly with UNMC."
    }
  ];
}

function globalSearchResults(query) {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];
  const results = [];

  for (const programme of state.data.programmes) {
    for (const unit of allUnits(programme)) {
      const unitText = `${programme.label} ${unit.code || ""} ${unit.title}`;
      if (unitText.toLowerCase().includes(q)) {
        results.push({
          type: "Course Unit",
          title: `${unit.code ? `${unit.code}: ` : ""}${unit.title}`,
          context: programme.label,
          body: `Year ${unit.year}, Semester ${unit.semester}. ${unit.topicCount || 0} topics.`,
          href: `#/courses/${programme.id}/${unit.id}`,
          score: unit.title.toLowerCase().includes(q) ? 4 : 2
        });
      }

      for (const topic of flatTopics(unit)) {
        const lesson = lessonFor(topic);
        const searchText = `${programme.label} ${unit.title} ${topic.groupTitle} ${topic.title} ${lessonSearchText(lesson)}`;
        if (!searchText.toLowerCase().includes(q)) continue;
        results.push({
          type: lesson ? "Lesson" : "Topic",
          title: lesson ? lesson.title : topic.title,
          context: `${programme.label} - ${unit.code || "Unit"}`,
          body: snippetFor(searchText, query),
          href: topicHref(programme, unit, topic.groupIndex, topic.topicIndex),
          score: topic.title.toLowerCase().includes(q) ? 5 : lesson && lesson.title.toLowerCase().includes(q) ? 4 : 1
        });
      }
    }
  }

  for (const instrument of allMedicalInstruments()) {
    const text = `${instrument.name} ${instrument.category} ${instrument.use} ${instrument.preparation} ${instrument.safety}`;
    if (!text.toLowerCase().includes(q)) continue;
    results.push({
      type: "Instrument",
      title: instrument.name,
      context: instrument.category,
      body: snippetFor(text, query),
      href: `#/resources/medical-instruments/${instrument.slug}`,
      score: instrument.name.toLowerCase().includes(q) ? 4 : 1
    });
  }

  for (const school of schoolDirectory()) {
    const text = `${school.name} ${school.district} ${school.sector} ${school.status} ${school.programmes.join(" ")}`;
    if (!text.toLowerCase().includes(q)) continue;
    results.push({
      type: "School",
      title: school.name,
      context: `${school.district} - ${school.status}`,
      body: snippetFor(text, query),
      href: "#/resources/schools",
      score: school.name.toLowerCase().includes(q) ? 4 : 1
    });
  }

  return results
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
    .slice(0, 60);
}

function topicHref(programme, unit, groupIndex, topicIndex) {
  return `#/courses/${programme.id}/${unit.id}/topic/${groupIndex}/${topicIndex}`;
}

function icon(name) {
  const path = iconPaths[name] || iconPaths.bookOpen;
  return `<svg class="ui-icon" aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`;
}

function iconNameFor(label) {
  const value = String(label || "").toLowerCase();
  if (/anatomy|physiology|vital|assessment|health/.test(value)) return "activity";
  if (/foundation|checklist|student support|support|planning/.test(value)) return "clipboardList";
  if (/medical surgical|surgical|instrument|theatre|wound|dressing/.test(value)) return "stethoscope";
  if (/midwifery|obstetric|maternal|newborn|child/.test(value)) return "heartPulse";
  if (/pharmacology|drug|medicine|injection|iv/.test(value)) return "pill";
  if (/community|public/.test(value)) return "home";
  if (/mental|psychiatric/.test(value)) return "heartPulse";
  if (/past paper|paper|exam|mock/.test(value)) return "fileText";
  if (/quiz|question|practice/.test(value)) return "helpCircle";
  if (/licensing|cpd|registration|recognized|status/.test(value)) return "badgeCheck";
  if (/school|university|college/.test(value)) return "school";
  if (/course|curriculum|programme|semester/.test(value)) return "graduationCap";
  return "bookOpen";
}

function iconFor(label) {
  return icon(iconNameFor(label));
}

function buttonLabel(label, iconName) {
  return `${iconName ? icon(iconName) : ""}<span>${escapeHtml(label)}</span>`;
}

function buttonLink(href, label, variant = "primary", iconName = "", extra = "") {
  return `<a class="button ${variant}" href="${escapeHtml(href)}"${extra ? ` ${extra}` : ""}>${buttonLabel(label, iconName)}</a>`;
}

const imageCatalog = {
  heroNurse: {
    src: "assets/images/nursing-uganda-hero-nursing-student-skills-lab-01.png",
    alt: "Nursing Uganda student studying in a clinical skills lab"
  },
  curriculum: {
    src: "assets/images/nursing-uganda-curriculum-study-group-01.png",
    alt: "Nursing and midwifery students studying a curriculum together"
  },
  anatomy: {
    src: "assets/images/nursing-uganda-anatomy-physiology-course-01.jpg",
    alt: "Anatomy and physiology learning illustration"
  },
  anatomyIntro: {
    src: "assets/images/nursing-uganda-anatomy-introduction-learning-01.jpg",
    alt: "Anatomy introduction learning image"
  },
  community: {
    src: "assets/images/nursing-uganda-community-health-programme-01.jpg",
    alt: "Community health nursing programme illustration"
  },
  mental: {
    src: "assets/images/nursing-uganda-mental-health-nursing-reference-01.webp",
    alt: "Mental health nursing reference image"
  },
  nursing: {
    src: "assets/images/nursing-uganda-hero-nursing-student-skills-lab-01.png",
    alt: "Nursing Uganda student studying in a clinical skills lab"
  },
  midwifery: {
    src: "assets/images/nursing-uganda-midwifery-newborn-care-training-01.png",
    alt: "Midwifery students practising newborn care in a skills lab"
  },
  instruments: {
    src: "assets/images/nursing-uganda-medical-instruments-clinical-tray-01.png",
    alt: "Nursing medical instruments arranged on a clean clinical tray"
  },
  disease: {
    src: "assets/images/nursing-uganda-disease-assessment-learning-01.png",
    alt: "Nursing students learning disease assessment with anatomy references"
  },
  schools: {
    src: "assets/images/source-library/nursing-uganda-skill-lab-12-1-1-001-fae1e61b.jpg",
    alt: "Nursing skills laboratory for student training"
  },
  exams: {
    src: "assets/images/source-library/nursing-uganda-unmeb-past-paper-1-001-60ae67af.png",
    alt: "Nursing examination paper for revision practice"
  }
};

function imageFor(label, fallback = "nursing") {
  const value = String(label || "").toLowerCase();
  if (/anatomy|physiology|first aid/.test(value)) return imageCatalog.anatomy;
  if (/community|public health|primary health|phc/.test(value)) return imageCatalog.community;
  if (/mental|psychiatric/.test(value)) return imageCatalog.mental;
  if (/midwifery|obstetric|gynaecology|reproductive|maternal|newborn|antenatal|labou?r|pregnan/.test(value)) return imageCatalog.midwifery;
  if (/instrument|stethoscope|catheter|forceps|autoclave|syringe|cannula|theatre|wound|dressing/.test(value)) return imageCatalog.instruments;
  if (/medical|surgical|disease|pathology|tropical|diagnos|assessment|care plan/.test(value)) return imageCatalog.disease;
  if (/library|book|reading/.test(value)) return imageCatalog.curriculum;
  if (/quiz|paper|exam|mock/.test(value)) return imageCatalog.exams;
  if (/school|skills lab|student support|training/.test(value)) return imageCatalog.schools;
  if (/course|curriculum|programme|semester/.test(value)) return imageCatalog.curriculum;
  if (/foundation|management|licensing|resource/.test(value)) return imageCatalog.nursing;
  return imageCatalog[fallback] || imageCatalog.nursing;
}

function cardImage(label, className = "card-media") {
  const image = imageFor(label);
  return `<img class="${className}" src="${escapeHtml(displayImageSrc(image.src))}" alt="${escapeHtml(image.alt)}" loading="lazy">`;
}

function rootAssetPath(src) {
  return `/${String(src || "").replace(/^\/+/, "")}`;
}

function displayImageSrc(src) {
  const optimized = state.optimizedImages && state.optimizedImages[src];
  return optimized && optimized.src ? optimized.src : src;
}

function setDocumentMeta(title, description) {
  const cleanTitle = title === "Nursing Uganda" ? title : `${title} | Nursing Uganda`;
  document.title = cleanTitle;
  const meta = document.querySelector('meta[name="description"]');
  if (meta) meta.setAttribute("content", description);

  [
    ["og:title", cleanTitle],
    ["og:description", description],
    ["twitter:title", cleanTitle],
    ["twitter:description", description]
  ].forEach(([property, content]) => {
    let element = document.querySelector(`meta[property="${property}"], meta[name="${property}"]`);
    if (!element) {
      element = document.createElement("meta");
      if (property.startsWith("twitter:")) element.setAttribute("name", property);
      else element.setAttribute("property", property);
      document.head.appendChild(element);
    }
    element.setAttribute("content", content);
  });
}

function topicImageCategoryLabel(category) {
  const labels = {
    "anatomy-physiology": "Anatomy and physiology",
    "community-health": "Community health",
    "medical-instruments": "Medical instruments",
    "medical-surgical": "Medical-surgical nursing",
    "mental-health": "Mental health",
    "midwifery": "Midwifery",
    "nursing-study": "Nursing study",
    "nursing-training": "Skills training",
    "unmatched": "Unmatched",
    "pharmacology": "Pharmacology"
  };
  return labels[category] || "Study image";
}

function renderTopicImage(programme, unit, topic) {
  const match = topicImageMatch(programme, unit, topic);
  if (!match) return "";
  return `
    <figure class="topic-image-panel">
      <img src="${escapeHtml(displayImageSrc(match.image))}" alt="${escapeHtml(match.alt || `Visual reference for ${topic.title}`)}" loading="lazy">
      <figcaption>
        <strong>${escapeHtml(topicImageCategoryLabel(match.category))}</strong>
        <span>Visual reference for this topic</span>
      </figcaption>
    </figure>
  `;
}

function footerLink(href, label, iconName = "arrowRight", extra = "") {
  return `<a href="${escapeHtml(href)}"${extra ? ` ${extra}` : ""}>${icon(iconName)}<span>${escapeHtml(label)}</span></a>`;
}

function renderFooter() {
  const studyLinks = [
    ["#/notes", "Notes Home", "bookOpen"],
    ["#/courses", "Courses", "graduationCap"],
    ["#/courses/curriculum", "Curriculum Maps", "listChecks"],
    ["#/search", "Search Topics", "search"],
    ["#/resources/quizzes", "Quick Quizzes", "helpCircle"]
  ];
  const resourceLinks = [
    ["#/resources/past-papers", "Past Papers", "fileText"],
    ["#/resources/books", "Digital Library", "bookOpen"],
    ["#/resources/medical-instruments", "Medical Instruments", "stethoscope"],
    ["#/resources/schools", "Schools Directory", "school"],
    ["#/resources/licensing", "Licensing And CPD", "badgeCheck"],
    ["#/resources/student-support", "Student Support", "heartPulse"]
  ];
  const subjectLinks = [
    ["anatomy|physiology", "Anatomy And Physiology", "activity"],
    ["medical|surgical", "Medical Surgical", "stethoscope"],
    ["midwifery|obstetric|newborn", "Midwifery", "briefcaseMedical"],
    ["pharmacology|drug|medicine", "Pharmacology", "pill"],
    ["community|public health|primary health", "Community Health", "home"],
    ["mental|psychiatric", "Mental Health", "heartPulse"]
  ];

  return `
    <footer class="site-footer">
      <div class="container footer-shell">
        <div class="footer-main">
          <div class="footer-brand">
            <a class="footer-logo" href="#/notes" aria-label="Nursing Uganda notes home">
              <span class="brand-mark">NU</span>
              <span>Nursing Uganda<small>nursinguganda.com</small></span>
            </a>
            <p>Structured nursing and midwifery notes, course maps, practice tools and student resources for Uganda learners.</p>
            <div class="footer-stats" aria-label="Nursing Uganda content totals">
              <span><strong>${state.data.totals.programmes}</strong> Programmes</span>
              <span><strong>${state.data.totals.courseUnits}</strong> Course Units</span>
              <span><strong>${state.data.totals.topics}</strong> Topics</span>
            </div>
          </div>
          <nav class="footer-column" aria-label="Study links">
            <h2>Study</h2>
            ${studyLinks.map(([href, label, iconName]) => footerLink(href, label, iconName)).join("")}
          </nav>
          <nav class="footer-column" aria-label="Resource links">
            <h2>Resources</h2>
            ${resourceLinks.map(([href, label, iconName]) => footerLink(href, label, iconName)).join("")}
          </nav>
          <nav class="footer-column" aria-label="Subject shortcuts">
            <h2>Subjects</h2>
            ${subjectLinks.map(([seed, label, iconName]) => footerLink("#/search", label, iconName, `data-search-seed="${escapeHtml(seed)}"`)).join("")}
          </nav>
        </div>
        <div class="footer-support">
          <div>
            <span class="mini-label">Student Reminder</span>
            <p>Use these notes for revision, then confirm clinical decisions with tutors, supervisors and current official guidance.</p>
          </div>
          <div class="footer-actions">
            ${buttonLink("#/courses", "Open Courses", "primary", "graduationCap")}
            ${buttonLink("#/resources", "Open Resources", "secondary", "folderOpen")}
          </div>
        </div>
        <div class="footer-bottom">
          <span>&copy; ${new Date().getFullYear()} Nursing Uganda. All rights reserved.</span>
          <span>Educational content should be checked against current clinical guidance.</span>
        </div>
      </div>
    </footer>
  `;
}

function megaMenuLinks(key) {
  if (key === "notes") {
    return notesSubjects().map((subject) => ({
      href: "#/search",
      label: subject.title,
      body: `${subject.unitCount} units, ${subject.topicCount} topics`,
      icon: iconNameFor(subject.title),
      extra: `data-search-seed="${escapeHtml(subject.search)}"`
    }));
  }

  if (key === "courses") {
    const programmes = (state.data && state.data.programmes ? state.data.programmes : []).slice(0, 6).map((programme) => ({
      href: `#/courses/${programme.id}`,
      label: programme.label,
      body: `${programme.stats.unitCount} units, ${programme.stats.topicCount || 0} topics`,
      icon: iconNameFor(programme.label)
    }));
    return [
      { href: "#/courses", label: "All Courses", body: "Browse every nursing and midwifery programme", icon: "graduationCap" },
      { href: "#/courses/curriculum", label: "Curriculum Maps", body: "Move by programme, year and semester", icon: "listChecks" },
      ...programmes
    ];
  }

  return [
    { href: "#/resources/books", label: "Digital Library", body: "Curated medical and nursing book sources", icon: "bookOpen" },
    { href: "#/resources/past-papers", label: "Past Papers", body: "Exam practice and revision sets", icon: "fileText" },
    { href: "#/resources/quizzes", label: "Quick Quizzes", body: "Practice active recall by topic", icon: "helpCircle" },
    { href: "#/resources/medical-instruments", label: "Medical Instruments", body: "Uses, safety points and OSCE notes", icon: "stethoscope" },
    { href: "#/resources/schools", label: "Schools Directory", body: "Training options and recognition notes", icon: "school" },
    { href: "#/resources/licensing", label: "Licensing And CPD", body: "Professional document planning", icon: "badgeCheck" },
    { href: "#/resources/student-support", label: "Student Support", body: "Study planning and placement support", icon: "heartPulse" }
  ];
}

function renderMegaMenu(key, item, active) {
  const links = megaMenuLinks(key);
  return `
    <div class="mega-item">
      <a class="mega-trigger ${active === key ? "active" : ""}" href="${item.href}">
        ${icon(item.icon)}<span>${item.label}</span>
      </a>
      <div class="mega-panel" role="group" aria-label="${escapeHtml(item.label)} menu">
        <div class="mega-panel-head">
          <strong>${escapeHtml(item.label)}</strong>
          <span>${key === "notes" ? "Choose a subject area" : key === "courses" ? "Open a programme or curriculum map" : "Open study resources"}</span>
        </div>
        <div class="mega-grid">
          ${links.map((link) => `
            <a class="mega-link" href="${escapeHtml(link.href)}"${link.extra ? ` ${link.extra}` : ""}>
              <span class="mega-icon">${icon(link.icon)}</span>
              <span><strong>${escapeHtml(link.label)}</strong><small>${escapeHtml(link.body)}</small></span>
            </a>
          `).join("")}
        </div>
      </div>
    </div>
  `;
}

function renderMainNav(active) {
  return Object.entries(routeMap).map(([key, item]) => renderMegaMenu(key, item, active)).join("");
}

function layout(content) {
  const parts = currentRoute();
  const active = routeKey(parts);
  app.innerHTML = `
    <div class="app-shell">
      <header class="site-header">
        <div class="container nav-shell">
          <a class="brand" href="#/notes" aria-label="Nursing Uganda notes home">
            <span class="brand-mark">NU</span>
            <span>Nursing Uganda<small>nursinguganda.com</small></span>
          </a>
          <nav class="main-nav${state.navOpen ? " open" : ""}" data-main-nav aria-label="Main navigation">
            ${renderMainNav(active)}
          </nav>
          <div class="nav-actions">
            <button class="theme-toggle" type="button" data-theme-toggle aria-label="Switch color theme">${icon(state.theme === "dark" ? "sun" : "moon")}<span>${state.theme === "dark" ? "Light" : "Dark"}</span></button>
            <button class="mobile-toggle" type="button" data-nav-toggle aria-label="Open menu" aria-expanded="${state.navOpen}">
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>
      </header>
      ${content}
      ${renderFooter()}
    </div>
  `;

  const toggle = app.querySelector("[data-nav-toggle]");
  if (toggle) {
    toggle.addEventListener("click", () => {
      state.navOpen = !state.navOpen;
      render();
    });
  }

  const themeToggle = app.querySelector("[data-theme-toggle]");
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      setTheme(state.theme === "dark" ? "light" : "dark");
      render();
    });
  }
}

function hero({ title, body, actions = "", image = imageCatalog.anatomy, breadcrumb = "" }) {
  return `
    <section class="hero" style="--hero-image: url('${escapeHtml(rootAssetPath(displayImageSrc(image.src)))}')">
      <div class="container hero-grid">
        <div>
          ${breadcrumb}
          <h1>${escapeHtml(title)}</h1>
          <p>${escapeHtml(body)}</p>
          ${actions ? `<div class="hero-actions">${actions}</div>` : ""}
        </div>
        <div class="app-panel">
          <div class="stat-grid">
            ${[
              ["Programmes", state.data.totals.programmes, "graduationCap"],
              ["Course Units", state.data.totals.courseUnits, "bookOpen"],
              ["Study Topics", state.data.totals.topics, "listChecks"],
              ["Semesters", state.data.totals.semesters, "calendar"]
            ].map(([label, value, iconName]) => `
              <div class="stat">
                <span class="stat-icon">${icon(iconName)}</span>
                <span><strong>${value}</strong><small>${escapeHtml(label)}</small></span>
              </div>
            `).join("")}
          </div>
        </div>
      </div>
    </section>
  `;
}

function subjectUnits(pattern) {
  const regex = new RegExp(pattern, "i");
  const units = [];
  for (const programme of state.data.programmes) {
    for (const unit of allUnits(programme)) {
      const text = `${programme.label} ${unit.code || ""} ${unit.title}`;
      if (regex.test(text)) units.push({ programme, unit });
    }
  }
  return units;
}

function notesSubjects() {
  return [
    ["Anatomy", "Body structure, terminology, systems and core physiology foundations.", "anatomy|physiology", "AN", "anatomy"],
    ["Foundations", "Ward routines, nursing process, documentation, ethics and patient care.", "foundation|fundamental", "FN", "foundations"],
    ["Medical Surgical", "Common medical and surgical conditions, assessment and nursing management.", "medical|surgical", "MS", "medical"],
    ["Midwifery", "Antenatal care, labour, puerperium, newborn care and reproductive health.", "midwifery|obstetric|gynaecology|reproductive", "MW", "midwifery"],
    ["Pharmacology", "Drug classes, safe administration, calculations and nursing responsibilities.", "pharmacology|drug|medicine", "PH", "pharmacology"],
    ["Community Health", "Primary health care, public health, family health and community practice.", "community|public health|primary health", "CH", "community"],
    ["Mental Health", "Therapeutic communication, psychiatric assessment and mental health nursing.", "mental|psychiatric", "MH", "mental"]
  ].map(([title, body, pattern, icon, search]) => {
    const matches = subjectUnits(pattern);
    const topics = matches.reduce((sum, item) => sum + (item.unit.topicCount || 0), 0);
    return { title, body, pattern, icon, search, unitCount: matches.length, topicCount: topics, first: matches[0] };
  });
}

function renderNotes() {
  const subjects = notesSubjects();
  const progress = overallProgress();
  const last = lastStudiedTopic();
  const saved = bookmarks().slice(0, 6);

  return `
    ${hero({
      title: "Nursing Notes for Uganda Students",
      body: "Structured nursing and midwifery notes, curriculum maps and revision resources for Uganda students.",
      image: imageCatalog.heroNurse,
      actions: `${buttonLink("#/courses", "Open Courses", "primary", "graduationCap")}${buttonLink("#/resources", "Open Resources", "secondary", "folderOpen")}`
    })}
    <section class="section compact-section">
      <div class="container">
        <form class="search-hero" data-global-search-form>
          <input class="search-input large" data-global-search type="search" value="${escapeHtml(state.globalSearch)}" placeholder="Search notes, course units, topics or lesson text" aria-label="Search all notes and courses">
          <button class="button primary" type="submit">${buttonLabel("Search", "search")}</button>
        </form>
      </div>
    </section>
    <section class="section compact-section">
      <div class="container continue-grid">
        <article class="continue-card content-panel">
          <div>
            <span class="mini-label">Continue Studying</span>
            <h2>${last ? escapeHtml(last.title) : "Start Your First Topic"}</h2>
            <p>${last ? `${escapeHtml(last.programme)} - ${escapeHtml(last.unit)}` : "Open any course topic and Nursing Uganda will remember where you stopped."}</p>
          </div>
          ${buttonLink(last ? last.href : "#/courses", last ? "Resume Topic" : "Open Courses", "primary", last ? "bookOpen" : "graduationCap")}
        </article>
        <article class="continue-card content-panel">
          <div>
            <span class="mini-label">Revision Progress</span>
            <h2>${progress.done} of ${progress.total}</h2>
            <p>${progress.percent}% of mapped study topics completed.</p>
            <div class="progress-bar"><span style="width: ${progress.percent}%"></span></div>
          </div>
        </article>
      </div>
    </section>
    ${saved.length ? `
      <section class="section compact-section">
        <div class="container">
          <div class="section-head slim-head">
            <div>
              <h2>Saved For Later</h2>
              <p>Your bookmarked topics and resources are kept here for quick return.</p>
            </div>
          </div>
          <div class="saved-grid">
            ${saved.map((item) => `
              <a class="saved-card" href="${escapeHtml(item.href)}">
                <span>${escapeHtml(item.type)}</span>
                <strong>${escapeHtml(item.title)}</strong>
                ${item.context ? `<small>${escapeHtml(item.context)}</small>` : ""}
              </a>
            `).join("")}
          </div>
        </div>
      </section>
    ` : ""}
    <section class="section">
      <div class="container">
        <div class="section-head">
          <div>
            <h2>Choose A Subject</h2>
            <p>Start from the subject area you want to revise, then move into the mapped course units and topics.</p>
          </div>
        </div>
        <div class="grid subject-grid">
          ${subjects.map((subject) => `
            <article class="card image-card subject-card">
              ${cardImage(subject.title)}
              <span class="card-icon">${iconFor(subject.title)}</span>
              <h3>${escapeHtml(subject.title)}</h3>
              <p>${escapeHtml(subject.body)}</p>
              <div class="subject-stats">
                <span>${subject.unitCount} units</span>
                <span>${subject.topicCount} topics</span>
              </div>
              <div class="subject-actions">
                ${subject.first ? `<a class="card-link" href="#/courses/${subject.first.programme.id}/${subject.first.unit.id}">${icon("arrowRight")}<span>Open first unit</span></a>` : `<span class="card-link">${icon("bookOpen")}<span>Coming soon</span></span>`}
                <a class="card-link muted-link" href="#/search" data-search-seed="${escapeHtml(subject.search)}">${icon("search")}<span>Search subject</span></a>
              </div>
            </article>
          `).join("")}
        </div>
      </div>
    </section>
    <section class="section">
      <div class="container content-panel card">
        <h2>Study With A Clear Path</h2>
        <p>Search for a topic, open a course unit, study each lesson, then mark topics complete as you revise.</p>
      </div>
    </section>
  `;
}

function renderGlobalSearchPage() {
  const query = state.globalSearch.trim();
  const results = globalSearchResults(query);

  return `
    ${hero({
      title: "Search Notes And Courses",
      body: "Find course units, topics and imported lesson text across nursing and midwifery revision.",
      image: imageCatalog.community
    })}
    <section class="section">
      <div class="container">
        <form class="search-hero search-page-form" data-global-search-form>
          <input class="search-input large" data-global-search type="search" value="${escapeHtml(state.globalSearch)}" placeholder="Try anatomy, blood, antenatal, pharmacology..." aria-label="Search all notes and courses">
          <button class="button primary" type="submit">${buttonLabel("Search", "search")}</button>
        </form>
        ${query.length < 2 ? `<div class="empty-state">Type at least two letters to search notes, topics and course units.</div>` : `
          <div class="section-head search-head">
            <div>
              <h2>${results.length} Results</h2>
              <p>Showing the strongest matches for "${escapeHtml(query)}".</p>
            </div>
          </div>
          <div class="search-results">
            ${results.length ? results.map((result) => `
              <a class="search-result-card" href="${result.href}">
                <span>${escapeHtml(result.type)}</span>
                <h3>${escapeHtml(result.title)}</h3>
                <p>${escapeHtml(result.body)}</p>
                <strong>${escapeHtml(result.context)}</strong>
              </a>
            `).join("") : `<div class="empty-state">No notes or course units matched that search.</div>`}
          </div>
        `}
      </div>
    </section>
  `;
}

function renderQuizHub() {
  const quizTopics = allStudyTopics()
    .filter(({ topic }) => lessonFor(topic))
    .slice(0, 36);

  return `
    ${hero({
      title: "Quick Quizzes",
      body: "Practice active recall from nursing and midwifery topics. Open a topic, answer the quick quiz, then mark it complete.",
      image: imageCatalog.mental
    })}
    <section class="section">
      <div class="container">
        <div class="section-head">
          <div>
            <h2>Ready To Practice</h2>
            <p>${quizTopics.length} quiz-ready topics with imported notes.</p>
          </div>
        </div>
        <div class="unit-grid">
          ${quizTopics.map(({ programme, unit, topic }) => `
            <a class="unit-card" href="${topicHref(programme, unit, topic.groupIndex, topic.topicIndex)}">
              <span class="unit-code">${escapeHtml(programme.label)}</span>
              <h3>${escapeHtml(topic.title)}</h3>
              <p>${escapeHtml(unit.code || "Course Unit")} - ${escapeHtml(unit.title)}</p>
              <span class="card-link">${icon("helpCircle")}<span>Open quiz</span></span>
            </a>
          `).join("")}
        </div>
      </div>
    </section>
  `;
}

function programmeCard(programme) {
  const stats = [
    ["Years", programme.stats.yearCount],
    ["Semesters", programme.stats.semesterCount],
    ["Units", programme.stats.unitCount],
    ["Topics", programme.stats.topicCount || 0]
  ];
  return `
    <a class="card programme-card" href="#/courses/${programme.id}">
      <span class="programme-art" aria-hidden="true">
        <span>${iconFor(programme.label)}</span>
      </span>
      <div class="programme-card-body">
        <h3>${escapeHtml(programme.label)}</h3>
        <div class="programme-meta">
          ${stats.map(([label, value]) => `<span><strong>${value}</strong> ${escapeHtml(label)}</span>`).join("")}
        </div>
        <span class="programme-link">${icon("arrowRight")}<span>Open curriculum</span></span>
      </div>
    </a>
  `;
}

function programmeSections() {
  const midwifery = state.data.programmes.filter((programme) => /midwifery/i.test(programme.label));
  const nursing = state.data.programmes.filter((programme) => !/midwifery/i.test(programme.label));
  const section = (title, body, programmes) => `
    <section class="programme-section">
      <div class="section-head programme-section-head">
        <div>
          <h2>${escapeHtml(title)}</h2>
          <p>${escapeHtml(body)}</p>
        </div>
      </div>
      <div class="programme-grid">${programmes.map(programmeCard).join("")}</div>
    </section>
  `;

  return `
    ${section("Nursing Programmes", "Certificate, diploma and BNS curriculum maps for nursing students.", nursing)}
    ${section("Midwifery Programmes", "Certificate and diploma curriculum maps for midwifery students.", midwifery)}
  `;
}

function renderCourses() {
  const query = state.search.trim().toLowerCase();
  const matchedUnits = [];
  if (query) {
    for (const programme of state.data.programmes) {
      for (const unit of allUnits(programme)) {
        const haystack = `${programme.label} ${unit.code || ""} ${unit.title}`.toLowerCase();
        if (haystack.includes(query)) matchedUnits.push({ programme, unit });
      }
    }
  }

  return `
    ${hero({
      title: "Courses and Curriculum Maps",
      body: "Browse nursing and midwifery programmes, years, semesters and course units. Topic maps help you move from curriculum to focused revision.",
      image: imageCatalog.curriculum,
      actions: buttonLink("#/courses/curriculum", "View all maps", "primary", "listChecks")
    })}
    <section class="section">
      <div class="container">
        <div class="toolbar course-toolbar">
          <label class="search-field">
            ${icon("search")}
            <input class="search-input" data-search type="search" value="${escapeHtml(state.search)}" placeholder="Search course units, codes or programmes" aria-label="Search courses">
          </label>
          <button class="button secondary filter-button" type="button">${buttonLabel("Filter", "listChecks")}</button>
        </div>
        ${query ? renderSearchResults(matchedUnits) : `
          ${programmeSections()}
        `}
      </div>
    </section>
  `;
}

function renderSearchResults(results) {
  if (!results.length) {
    return `<div class="empty-state">No course units matched that search.</div>`;
  }
  return `
    <div class="section-head">
      <div>
        <h2>Search Results</h2>
        <p>${results.length} course units matched.</p>
      </div>
    </div>
    <div class="unit-grid">
      ${results.map(({ programme, unit }) => `
        <a class="unit-card" href="#/courses/${programme.id}/${unit.id}">
          <span class="unit-code">${escapeHtml(unit.code || "Unit")}</span>
          <h3>${escapeHtml(unit.title)}</h3>
          <p>${escapeHtml(programme.label)} - Year ${unit.year}, Semester ${unit.semester}</p>
          <span class="card-link">${icon("arrowRight")}<span>Open unit</span></span>
        </a>
      `).join("")}
    </div>
  `;
}

function renderCurriculumHub() {
  return `
    ${hero({
      title: "Curriculum Maps",
      body: "Choose a nursing or midwifery programme and drill into course units, semesters and topics.",
      image: imageCatalog.curriculum
    })}
    <section class="section">
      <div class="container">
        ${programmeSections()}
      </div>
    </section>
  `;
}

function renderProgramme(programme) {
  const years = sortedYears(programme);
  const firstYearKey = years[0] ? years[0][0] : "";
  const programmeType = /midwifery/i.test(programme.label) ? "Midwifery Programmes" : "Nursing Programmes";
  const totalTopics = years.reduce((sum, [, year]) => sum + sortedSemesters(year).reduce((semesterSum, [, semester]) => semesterSum + semester.courseUnits.reduce((unitSum, unit) => unitSum + (unit.topicCount || 0), 0), 0), 0);
  const totalUnits = years.reduce((sum, [, year]) => sum + sortedSemesters(year).reduce((semesterSum, [, semester]) => semesterSum + semester.courseUnits.length, 0), 0);
  return `
    ${hero({
      title: programme.label,
      body: `Explore ${programme.stats.yearCount} years, ${programme.stats.semesterCount} semesters and ${programme.stats.unitCount} course units.`,
      image: imageFor(programme.label),
      breadcrumb: `
        <nav class="hero-breadcrumb" aria-label="Breadcrumb">
          <a href="#/courses">Courses</a>
          <span>${icon("arrowRight")}</span>
          <a href="#/courses">${escapeHtml(programmeType)}</a>
          <span>${icon("arrowRight")}</span>
          <strong>${escapeHtml(programme.label)}</strong>
        </nav>
      `,
      actions: firstYearKey ? `<button class="button primary" type="button" data-scroll-target="${escapeHtml(firstYearKey)}">${buttonLabel("View Year 1", "arrowRight")}</button>` : ""
    })}
    <section class="section">
      <div class="container app-layout curriculum-layout">
        <aside class="side-panel curriculum-side-panel" data-curriculum-nav>
          <div class="curriculum-side-head">
            <span class="mini-label">Jump To</span>
            <h3>Curriculum Path</h3>
          </div>
          <div class="curriculum-progress">
            <div>
              <strong data-curriculum-progress-label>Year 1</strong>
              <span>${totalUnits} units · ${totalTopics} topics</span>
            </div>
            <div class="progress-bar slim"><span data-curriculum-progress-bar style="width: ${years.length ? Math.round(100 / years.length) : 0}%"></span></div>
          </div>
          <div class="year-nav-list">
            ${years.map(([key, year], index) => {
              const semesters = sortedSemesters(year);
              const yearUnits = semesters.reduce((sum, [, semester]) => sum + semester.courseUnits.length, 0);
              return `
                <div class="year-nav-item${index === 0 ? " active" : ""}" data-year-nav="${escapeHtml(key)}">
                  <button type="button" data-scroll-target="${escapeHtml(key)}">
                    ${icon("calendar")}
                    <span>Year ${year.year}</span>
                    <small>${yearUnits} units</small>
                  </button>
                  <div class="year-subnav">
                    ${semesters.map(([semesterKey, semester]) => `<button type="button" data-scroll-target="${escapeHtml(`${key}-${semesterKey}`)}">${icon("bookOpen")}<span>Semester ${semester.semester}</span></button>`).join("")}
                  </div>
                </div>
              `;
            }).join("")}
          </div>
        </aside>
        <div class="curriculum-content">
          ${years.map(([yearKey, year]) => {
            const semesters = sortedSemesters(year);
            const yearUnits = semesters.reduce((sum, [, semester]) => sum + semester.courseUnits.length, 0);
            return `
            <section id="${yearKey}" class="programme-block curriculum-year-block" data-year-section="${yearKey}" data-year-label="Year ${year.year}" data-year-index="${years.findIndex(([key]) => key === yearKey)}" data-year-total="${years.length}">
              <div class="year-head">
                <span>Year ${year.year}</span>
                <h2>Year ${year.year}</h2>
                <p>${semesters.length} Semesters · ${yearUnits} Course Units</p>
              </div>
              ${sortedSemesters(year).map(([semesterKey, semester]) => `
                <div id="${yearKey}-${semesterKey}" class="semester-block curriculum-semester-block">
                  <div class="semester-head">
                    <h3>Semester ${semester.semester}</h3>
                    <span>${semester.courseUnits.length} course units</span>
                  </div>
                  <div class="unit-grid">
                    ${semester.courseUnits.map((unit) => `
                      <a class="unit-card curriculum-unit-card" href="#/courses/${programme.id}/${unit.id}">
                        <div class="unit-card-head">
                          <span class="unit-code">${escapeHtml(unit.code || "Unit")}</span>
                          <span class="unit-status">${unit.topicCount ? "Ready" : "Pending topics"}</span>
                        </div>
                        <h3>${escapeHtml(unit.title)}</h3>
                        ${unit.topicCount ? `
                          <div class="unit-meta">
                            <span>${unit.topicGroups.length} topic groups</span>
                            <span>${unit.topicCount} topics</span>
                          </div>
                        ` : `<span class="unit-info-chip">${icon("helpCircle")}<span>Detailed topics will be added soon</span></span>`}
                        <span class="unit-action">${icon("arrowRight")}<span>Open unit</span></span>
                      </a>
                    `).join("")}
                  </div>
                </div>
              `).join("")}
            </section>
          `;
          }).join("")}
        </div>
      </div>
    </section>
  `;
}

function renderUnit(programme, unit) {
  const groups = unit.topicGroups || [];
  const topics = flatTopics(unit);
  const progress = topicProgress(programme, unit);
  return `
    ${hero({
      title: `${unit.code ? `${unit.code}: ` : ""}${unit.title}`,
      body: unit.topicCount ? `${unit.topicCount} topics are grouped here for study and revision.` : "This course unit is listed. Detailed topics will be added soon.",
      image: imageFor(`${unit.title} ${programme.label}`)
    })}
    <section class="section">
      <div class="container app-layout">
        <aside class="side-panel">
          <h3>${escapeHtml(programme.label)}</h3>
          <a href="#/courses/${programme.id}">${icon("arrowLeft")}<span>Back to programme</span></a>
          ${topics.length ? `<a href="${topicHref(programme, unit, topics[0].groupIndex, topics[0].topicIndex)}">${icon("bookOpen")}<span>Start first topic</span></a>` : ""}
          <div class="progress-panel">
            <div class="progress-ring">${progress.percent}%</div>
            <div>
              <strong>${progress.done} of ${progress.total}</strong>
              <span>topics completed</span>
            </div>
          </div>
          <div class="progress-bar slim" aria-label="Unit progress"><span style="width: ${progress.percent}%"></span></div>
          <p class="side-note">${progress.available} topics currently have study notes.</p>
          ${groups.map((group) => `<button type="button" data-scroll-target="${groupId(group.title)}">${icon("listChecks")}<span>${escapeHtml(group.title)}</span></button>`).join("")}
        </aside>
        <div>
          ${groups.length ? groups.map((group) => `
            <section class="topic-group" id="${groupId(group.title)}">
              <div class="semester-head">
                <h2>${escapeHtml(group.title)}</h2>
                <span>${group.topics.length} topics</span>
              </div>
              <div class="topic-list">
                ${group.topics.map((topic, index) => {
                  const topicWithIndex = { ...topic, groupIndex: groups.indexOf(group), topicIndex: index };
                  const lesson = lessonFor(topic);
                  const complete = completedTopics()[topicKey(programme, unit, topicWithIndex)];
                  return `
                    <a class="topic-row topic-link${complete ? " complete" : ""}" href="${topicHref(programme, unit, groups.indexOf(group), index)}">
                      <span>${String(index + 1).padStart(2, "0")}</span>
                      <div>
                        <h3>${escapeHtml(topic.title)}</h3>
                        <p>${lesson ? escapeHtml(truncateText(lesson.excerpt || lesson.title)) : (topic.sourceSlug ? `Reference: ${escapeHtml(topic.sourceSlug)}` : "Reference will be added soon.")}</p>
                      </div>
                      <strong>${complete ? `${icon("checkCircle")}<span>Done</span>` : (lesson ? `${icon("bookOpen")}<span>Study</span>` : `${icon("arrowRight")}<span>Open</span>`)}</strong>
                    </a>
                  `;
                }).join("")}
              </div>
            </section>
          `).join("") : `<div class="empty-state">No topic groups yet for this unit. Detailed topics will be added soon.</div>`}
        </div>
      </div>
    </section>
  `;
}

function renderLessonBlocks(blocks) {
  let html = "";
  let listItems = [];
  const flushList = () => {
    if (!listItems.length) return;
    html += `<ul>${listItems.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
    listItems = [];
  };

  for (const block of blocks || []) {
    if (block.type === "bullet") {
      listItems.push(block.text);
    } else {
      flushList();
      html += `<p>${escapeHtml(block.text)}</p>`;
    }
  }
  flushList();
  return html;
}

function lessonBlocks(lesson) {
  return (lesson && lesson.sections ? lesson.sections : [])
    .flatMap((section) => section.blocks || [])
    .filter((block) => block.text && block.text.length > 20);
}

function lessonKeyPoints(lesson) {
  return lessonBlocks(lesson)
    .filter((block) => block.type === "paragraph")
    .map((block) => truncateText(block.text, 165))
    .filter((text, index, list) => list.indexOf(text) === index)
    .slice(0, 4);
}

function lessonTerms(lesson) {
  const terms = [];
  for (const block of lessonBlocks(lesson)) {
    const match = block.text.match(/^([^:]{3,48}):\s+(.{18,220})/);
    if (!match) continue;
    const term = match[1].replace(/^\d+\.\s*/, "").trim();
    if (/topic|module|contact hours|learning outcomes/i.test(term)) continue;
    if (terms.some((item) => item.term.toLowerCase() === term.toLowerCase())) continue;
    terms.push({ term, definition: truncateText(match[2], 150) });
    if (terms.length >= 6) break;
  }
  return terms;
}

function lessonSectionClass(title) {
  if (/revision|question|exam/i.test(title)) return " exam-section";
  if (/reference|bibliography/i.test(title)) return " reference-section";
  return "";
}

function renderLessonHighlights(lesson) {
  const points = lessonKeyPoints(lesson);
  const terms = lessonTerms(lesson);
  if (!points.length && !terms.length) return "";

  return `
    <div class="lesson-highlights">
      ${points.length ? `
        <section class="highlight-panel">
          <span class="mini-label">Key Points</span>
          <ul>
            ${points.map((point) => `<li>${escapeHtml(point)}</li>`).join("")}
          </ul>
        </section>
      ` : ""}
      ${terms.length ? `
        <section class="highlight-panel">
          <span class="mini-label">Important Terms</span>
          <div class="term-grid">
            ${terms.map((item) => `
              <div>
                <strong>${escapeHtml(item.term)}</strong>
                <p>${escapeHtml(item.definition)}</p>
              </div>
            `).join("")}
          </div>
        </section>
      ` : ""}
    </div>
  `;
}

function renderLessonContent(lesson) {
  if (!lesson || !lesson.sections || !lesson.sections.length) {
    return `
      <div class="empty-state">
        Detailed notes for this topic will be added soon.
      </div>
    `;
  }

  return `
    <div class="lesson-content">
      ${lesson.sections.map((section, index) => `
        <details id="lesson-section-${index}" class="lesson-section${lessonSectionClass(section.title)}" ${index < 2 ? "open" : ""}>
          <summary>
            <span>${String(index + 1).padStart(2, "0")}</span>
            <h3>${escapeHtml(section.title)}</h3>
            <small>${(section.blocks || []).length} notes</small>
          </summary>
          <div class="lesson-section-body">
            ${renderLessonBlocks(section.blocks)}
          </div>
        </details>
      `).join("")}
    </div>
  `;
}

function renderStudyTools(lesson) {
  if (!lesson || !lesson.sections || !lesson.sections.length) return "";
  const firstSections = lesson.sections.slice(0, 4).map((section) => section.title);

  return `
    <div class="study-tools">
      <div>
        <h3>In This Topic</h3>
        <ul>
          ${firstSections.map((title) => `<li>${escapeHtml(title)}</li>`).join("")}
        </ul>
      </div>
      <div>
        <h3>Study Checklist</h3>
        <ul>
          <li>Read the overview once without rushing.</li>
          <li>Write down new terms and definitions.</li>
          <li>Turn each heading into a short question.</li>
          <li>Review the topic again before moving on.</li>
        </ul>
      </div>
    </div>
  `;
}

function rotateChoices(choices, index) {
  const offset = choices.length ? index % choices.length : 0;
  return choices.slice(offset).concat(choices.slice(0, offset));
}

function firstTextBlock(section) {
  return (section.blocks || []).find((block) => block.text && block.text.length > 25);
}

function normalizeQuizAnswer(value) {
  return String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function quizAnswerCorrect(question, answer) {
  if (answer === undefined) return false;
  if (question.type === "blank") return normalizeQuizAnswer(answer) === normalizeQuizAnswer(question.answer);
  return question.choices[Number(answer)] === question.answer;
}

function quizQuestionsFor(lesson, programme, unit, topic) {
  if (!lesson || !lesson.sections || !lesson.sections.length) return [];
  const sections = lesson.sections.filter((section) => section.title && !/reference|quiz/i.test(section.title));
  const sectionTitles = sections.map((section) => section.title).slice(0, 8);
  const textBlocks = sections.map(firstTextBlock).filter(Boolean).map((block) => truncateText(block.text, 130));
  const terms = lessonTerms(lesson);
  const questions = [];

  if (sectionTitles.length >= 2) {
    const correct = sectionTitles[0];
    questions.push({
      prompt: "Which heading appears in this topic?",
      answer: correct,
      choices: rotateChoices([correct, ...sectionTitles.slice(1, 4)], 1),
      explanation: `The topic includes the section "${correct}".`
    });
  }

  if (textBlocks.length >= 2) {
    const correct = textBlocks[0];
    questions.push({
      prompt: "Which statement is taken from these notes?",
      answer: correct,
      choices: rotateChoices([correct, ...textBlocks.slice(1, 4)], 2),
      explanation: "This statement appears in the lesson content above."
    });
  }

  if (textBlocks.length) {
    questions.push({
      prompt: `True or false: ${textBlocks[0]}`,
      answer: "True",
      choices: ["True", "False"],
      explanation: "This statement appears in the topic notes."
    });
  }

  if (terms.length) {
    questions.push({
      type: "blank",
      prompt: `Fill in the blank: ${terms[0].definition}`,
      answer: terms[0].term,
      explanation: `The term is "${terms[0].term}".`
    });
  }

  questions.push({
    prompt: "This topic belongs to which course unit?",
    answer: `${unit.code ? `${unit.code}: ` : ""}${unit.title}`,
    choices: rotateChoices([
      `${unit.code ? `${unit.code}: ` : ""}${unit.title}`,
      programme.label,
      topic.groupTitle,
      "Medical Instruments"
    ], 3),
    explanation: `This topic is part of ${unit.code ? `${unit.code}: ` : ""}${unit.title}.`
  });

  return questions.slice(0, 4);
}

function renderTopicQuiz(lesson, programme, unit, topic, key) {
  const questions = quizQuestionsFor(lesson, programme, unit, topic);
  if (!questions.length) return "";
  const attempt = quizAttempts()[key] || {};
  const answered = questions.filter((_, index) => attempt[index] !== undefined);
  const score = questions.filter((question, index) => quizAnswerCorrect(question, attempt[index])).length;

  return `
    <section class="quiz-panel" id="topic-quiz">
      <div class="quiz-head">
        <div>
          <span class="mini-label">Quick Quiz</span>
          <h3>Test Yourself</h3>
          <p>${answered.length ? `${score} of ${answered.length} answered correctly.` : "Answer these quick checks after reading the topic."}</p>
        </div>
        <div class="quiz-score-box">
          <strong>${score}/${questions.length}</strong>
          ${answered.length ? `<button type="button" class="quiz-reset" data-reset-quiz="${escapeHtml(key)}">${icon("rotateCcw")}<span>Retry</span></button>` : ""}
        </div>
      </div>
      <div class="quiz-list">
        ${questions.map((question, questionIndex) => {
          const selected = attempt[questionIndex];
          const answeredQuestion = selected !== undefined;
          const correct = quizAnswerCorrect(question, selected);
          if (question.type === "blank") {
            return `
              <article class="quiz-question">
                <h4>${questionIndex + 1}. ${escapeHtml(question.prompt)}</h4>
                <form class="fill-blank-form" data-blank-quiz-form data-quiz-key="${escapeHtml(key)}" data-quiz-question="${questionIndex}">
                  <input type="text" value="${answeredQuestion ? escapeHtml(selected) : ""}" placeholder="Type your answer" aria-label="Fill in the blank answer">
                  <button type="submit">${icon("checkCircle")}<span>Check</span></button>
                </form>
                ${answeredQuestion ? `<p class="quiz-explanation ${correct ? "correct-text" : "wrong-text"}">${correct ? "Correct." : "Not yet."} ${escapeHtml(question.explanation)}</p>` : ""}
              </article>
            `;
          }
          return `
            <article class="quiz-question">
              <h4>${questionIndex + 1}. ${escapeHtml(question.prompt)}</h4>
              <div class="quiz-options">
                ${question.choices.map((choice, choiceIndex) => {
                  const isSelected = Number(selected) === choiceIndex;
                  const isCorrect = choice === question.answer;
                  const stateClass = answeredQuestion ? (isCorrect ? " correct" : isSelected ? " wrong" : "") : "";
                  return `<button type="button" class="quiz-option${isSelected ? " selected" : ""}${stateClass}" data-quiz-key="${escapeHtml(key)}" data-quiz-question="${questionIndex}" data-quiz-answer="${choiceIndex}">${escapeHtml(choice)}</button>`;
                }).join("")}
              </div>
              ${answeredQuestion ? `<p class="quiz-explanation">${escapeHtml(question.explanation)}</p>` : ""}
            </article>
          `;
        }).join("")}
      </div>
    </section>
  `;
}

function renderFlashcards(lesson) {
  const terms = lessonTerms(lesson).slice(0, 4);
  if (!terms.length) return "";

  return `
    <section class="flashcard-panel">
      <div class="section-head slim-head">
        <div>
          <span class="mini-label">Flashcards</span>
          <h3>Tap A Term, Recall The Meaning</h3>
        </div>
      </div>
      <div class="flashcard-grid">
        ${terms.map((item) => `
          <details class="flashcard">
            <summary>${escapeHtml(item.term)}</summary>
            <p>${escapeHtml(item.definition)}</p>
          </details>
        `).join("")}
      </div>
    </section>
  `;
}

function renderTopic(programme, unit, topic) {
  const topics = flatTopics(unit);
  const previous = topics[topic.flatIndex - 1];
  const next = topics[topic.flatIndex + 1];
  const lesson = lessonFor(topic);
  const sourceText = lesson ? lesson.sourceFile : (topic.sourceSlug || topic.sourceHref || "Reference will be added soon");
  const key = topicKey(programme, unit, topic);
  const complete = Boolean(completedTopics()[key]);
  const progress = topicProgress(programme, unit);
  const topicBookmark = {
    key: `topic::${key}`,
    type: "Topic",
    title: lesson ? lesson.title : topic.title,
    context: `${programme.label} - ${unit.code || "Course Unit"}`,
    href: topicHref(programme, unit, topic.groupIndex, topic.topicIndex)
  };
  setLastStudiedTopic(programme, unit, topic, lesson);

  return `
    ${hero({
      title: lesson ? lesson.title : topic.title,
      body: lesson && lesson.excerpt ? truncateText(lesson.excerpt, 220) : `${programme.label} - ${unit.code ? `${unit.code}: ` : ""}${unit.title}. Use this topic page for focused revision.`,
      image: imageFor(`${topic.title} ${unit.title} ${programme.label}`)
    })}
    <section class="section">
      <div class="container app-layout">
        <aside class="side-panel">
          <h3>Topic Navigation</h3>
          <a href="#/courses/${programme.id}/${unit.id}">${icon("arrowLeft")}<span>Back to unit topics</span></a>
          <a href="#/courses/${programme.id}">${icon("graduationCap")}<span>Back to programme</span></a>
          <div class="progress-panel">
            <div class="progress-ring">${progress.percent}%</div>
            <div>
              <strong>${progress.done} of ${progress.total}</strong>
              <span>topics completed</span>
            </div>
          </div>
          <button type="button" class="complete-toggle${complete ? " active" : ""}" data-complete-topic="${escapeHtml(key)}">
            ${icon("checkCircle")}<span>${complete ? "Mark as not done" : "Mark topic complete"}</span>
          </button>
          ${bookmarkButton(topicBookmark)}
          <button type="button" data-print-topic>${icon("printer")}<span>Print / Save PDF</span></button>
          ${lesson ? `<button type="button" data-scroll-target="topic-quiz">${icon("helpCircle")}<span>Quick quiz</span></button>` : ""}
          ${previous ? `<a href="${topicHref(programme, unit, previous.groupIndex, previous.topicIndex)}">${icon("arrowLeft")}<span>Previous topic</span></a>` : ""}
          ${next ? `<a href="${topicHref(programme, unit, next.groupIndex, next.topicIndex)}">${icon("arrowRight")}<span>Next topic</span></a>` : ""}
          ${lesson && lesson.sections ? lesson.sections.slice(0, 8).map((section, index) => `<button type="button" data-lesson-target="lesson-section-${index}">${escapeHtml(section.title)}</button>`).join("") : ""}
        </aside>
        <article class="topic-detail content-panel printable-topic">
          <div class="topic-meta">
            <span>${escapeHtml(programme.label)}</span>
            <span>${escapeHtml(unit.code || "Course Unit")}</span>
            <span>${escapeHtml(topic.groupTitle)}</span>
          </div>
          <h2>${escapeHtml(topic.title)}</h2>
          ${lesson ? `<p class="lesson-excerpt">${escapeHtml(lesson.excerpt || "Study the notes below and use the navigation links to move through the unit.")}</p>` : `<p>This topic page is ready for learning objectives, key points, nursing notes, practice questions and references.</p>`}
          ${renderTopicImage(programme, unit, topic)}
          ${renderStudyTools(lesson)}
          ${renderLessonHighlights(lesson)}
          ${renderLessonContent(lesson)}
          ${renderFlashcards(lesson)}
          ${renderTopicQuiz(lesson, programme, unit, topic, key)}
          <div class="topic-source">
            <strong>Reference</strong>
            <span>${escapeHtml(sourceText)}</span>
          </div>
          <div class="topic-actions">
            ${previous ? buttonLink(topicHref(programme, unit, previous.groupIndex, previous.topicIndex), "Previous Topic", "secondary", "arrowLeft") : `<span></span>`}
            <button class="button secondary" type="button" data-print-topic>${buttonLabel("Print / Save PDF", "printer")}</button>
            ${next ? buttonLink(topicHref(programme, unit, next.groupIndex, next.topicIndex), "Next Topic", "primary", "arrowRight") : buttonLink(`#/courses/${programme.id}/${unit.id}`, "Back to Unit", "secondary", "arrowLeft")}
          </div>
        </article>
      </div>
    </section>
    <nav class="mobile-study-bar" aria-label="Mobile topic navigation">
      ${previous ? `<a href="${topicHref(programme, unit, previous.groupIndex, previous.topicIndex)}">Previous</a>` : `<a href="#/courses/${programme.id}/${unit.id}">Unit</a>`}
      <button type="button" class="${complete ? "active" : ""}" data-complete-topic="${escapeHtml(key)}">${complete ? "Done" : "Complete"}</button>
      ${next ? `<a href="${topicHref(programme, unit, next.groupIndex, next.topicIndex)}">Next</a>` : `<a href="#/courses/${programme.id}/${unit.id}">Unit</a>`}
    </nav>
    <div class="mobile-study-spacer" aria-hidden="true"></div>
  `;
}

function groupId(title) {
  return title.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function slugify(value) {
  return String(value).toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function renderResources() {
  const resources = [
    ["Digital Library", "Curated nursing and medical book sources matched to course topics.", "#/resources/books"],
    ["Past Papers", "Exam practice grouped by programme and course unit.", "#/resources/past-papers"],
    ["Quizzes", "MCQs for notes, course units and topic revision.", "#/resources/quizzes"],
    ["Licensing", "UNMC, CPD and renewal guidance for professional requirements.", "#/resources/licensing"],
    ["Medical Instruments", "Common nursing and midwifery instruments with use, handling and revision notes.", "#/resources/medical-instruments"],
    ["Schools", "A directory of recognized nursing and midwifery schools.", "#/resources/schools"],
    ["Student Support", "Study planning, placement preparation and career guidance.", "#/resources/student-support"],
    ["Image Review", "Review topic image matches, confidence levels and unmatched topics.", "#/resources/image-review"]
  ];

  return `
    ${hero({
      title: "Resources",
      body: "Exam practice, medical instruments, licensing, schools and study support for nursing and midwifery students.",
      image: imageCatalog.instruments
    })}
    <section class="section">
      <div class="container">
        <div class="grid three">
          ${resources.map(([title, body, href]) => {
            const content = `${cardImage(title)}<span class="card-icon">${iconFor(title)}</span><h3>${escapeHtml(title)}</h3><p>${escapeHtml(body)}</p>${href ? `<span class="card-link">${icon("arrowRight")}<span>Open resource</span></span>` : ""}`;
            return href ? `<a class="card image-card" href="${href}">${content}</a>` : `<article class="card image-card">${content}</article>`;
          }).join("")}
        </div>
      </div>
    </section>
  `;
}

function resourcePages() {
  return [
    {
      slug: "past-papers",
      title: "Past Papers",
      body: "Organize exam practice by programme, subject and course unit so revision connects back to notes.",
      sections: [
        ["Certificate Practice", "Certificate nursing and midwifery revision sets arranged by course unit."],
        ["Diploma Practice", "Diploma-level paper sets for direct and extension nursing or midwifery pathways."],
        ["BNS Practice", "University-level revision prompts and topic-linked practice."],
        ["Mock Exams", "Timed sets for practising recall, structure and exam stamina."]
      ],
      steps: ["Choose a programme", "Select the course unit", "Attempt questions without notes", "Review the linked lesson topic", "Repeat missed areas"]
    },
    {
      slug: "licensing",
      title: "Licensing And CPD",
      body: "A clean checklist area for registration, licence renewal, CPD planning and professional document preparation.",
      sections: [
        ["Registration Checklist", "Keep track of personal details, school records and professional documents."],
        ["Licence Renewal", "Plan renewal tasks early and confirm requirements with the official council guidance."],
        ["CPD Planning", "Record learning activities, certificates and reflection notes."],
        ["Document Folder", "Keep copies of identity, qualification, registration and CPD evidence in one place."]
      ],
      steps: ["Check current official guidance", "Gather required documents", "Confirm deadlines", "Track CPD evidence", "Keep copies of submissions"]
    },
    {
      slug: "schools",
      title: "Schools",
      body: "A future directory for recognized nursing and midwifery schools, with programme and location filters.",
      sections: [
        ["Nursing Schools", "List nursing institutions by programme type and training level."],
        ["Midwifery Schools", "Group midwifery training options by certificate and diploma pathways."],
        ["Programme Finder", "Compare certificate, diploma and top-up routes."],
        ["Application Notes", "Prepare admission documents, deadlines and interview readiness notes."]
      ],
      steps: ["Choose a training level", "Compare available programmes", "Check recognition status", "Prepare application documents", "Verify details with the school directly"]
    },
    {
      slug: "student-support",
      title: "Student Support",
      body: "Practical support for study planning, clinical placement, exam preparation and early career readiness.",
      sections: [
        ["Study Planning", "Build weekly revision blocks around course units and difficult topics."],
        ["Clinical Placement", "Prepare ward expectations, documentation habits and professional conduct."],
        ["Exam Readiness", "Use active recall, past questions, quick quizzes and topic completion."],
        ["Career Guidance", "Track goals, mentorship questions and professional development plans."]
      ],
      steps: ["Set a weekly target", "Pick one course unit", "Complete three topics", "Attempt a quick quiz", "Review weak areas before moving on"]
    }
  ];
}

function findResourcePage(slug) {
  return resourcePages().find((page) => page.slug === slug);
}

function bookLibrary() {
  return state.bookLibrary || {
    summary: { curated_collections: 0, books_indexed: 0, recommended_first: 0 },
    collections: [],
    books: [],
    policy: {
      note: "Book source links are being prepared. Check back after the library data has loaded."
    },
    source: {
      name: "InfoBooks",
      medical_url: "https://infobooks.org/free-pdf-books/medical/"
    }
  };
}

function librarySubjects() {
  const subjects = new Set();
  for (const book of bookLibrary().books || []) {
    (book.subjects || []).forEach((subject) => subjects.add(subject));
  }
  return [...subjects].sort((a, b) => a.localeCompare(b));
}

function filteredLibraryBooks() {
  const query = state.librarySearch.trim().toLowerCase();
  const subject = state.librarySubject;
  return (bookLibrary().books || []).filter((book) => {
    const haystack = `${book.title} ${book.description} ${book.author} ${book.collection_title} ${(book.subjects || []).join(" ")}`.toLowerCase();
    const matchesQuery = !query || haystack.includes(query);
    const matchesSubject = subject === "all" || (book.subjects || []).includes(subject);
    return matchesQuery && matchesSubject;
  });
}

function renderLibraryTags(tags = []) {
  return `<div class="programme-tags">${tags.slice(0, 4).map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div>`;
}

function renderBookLibrary() {
  const library = bookLibrary();
  const collections = library.collections || [];
  const priorityCollections = collections.filter((collection) => collection.priority === "high");
  const books = filteredLibraryBooks();
  const visibleBooks = books.slice(0, 60);
  const subjects = librarySubjects();

  return `
    ${hero({
      title: "Digital Library",
      body: "Curated nursing and medical book sources matched to anatomy, pharmacology, midwifery, child health, community health and clinical skills revision.",
      image: imageCatalog.curriculum,
      actions: `${buttonLink("#/resources", "Back to Resources", "secondary", "arrowLeft")}${buttonLink(library.source.medical_url, "Open InfoBooks", "primary", "externalLink", `target="_blank" rel="noopener noreferrer"`)}`
    })}
    <section class="section">
      <div class="container">
        <div class="library-stats">
          <div><strong>${library.summary.curated_collections || collections.length}</strong><span>Collections</span></div>
          <div><strong>${library.summary.books_indexed || (library.books || []).length}</strong><span>Books Indexed</span></div>
          <div><strong>${library.summary.recommended_first || priorityCollections.length}</strong><span>Start Here</span></div>
        </div>
        <div class="content-panel library-note">
          <span class="card-icon">${icon("bookOpen")}</span>
          <div>
            <h2>Source-Linked Reading</h2>
            <p>${escapeHtml(library.policy.note)}</p>
          </div>
        </div>
      </div>
    </section>
    <section class="section soft-section">
      <div class="container">
        <div class="section-head">
          <div>
            <h2>Best Starting Collections</h2>
            <p>Begin with the closest course matches, then use supporting collections for deeper revision.</p>
          </div>
        </div>
        <div class="grid three">
          ${collections.map((collection) => `
            <article class="card library-collection-card">
              <div class="library-card-head">
                <span>${escapeHtml(collection.priority)}</span>
                <strong>${escapeHtml(collection.score)}%</strong>
              </div>
              <span class="card-icon">${iconFor(collection.title)}</span>
              <h3>${escapeHtml(collection.title)}</h3>
              <p>${escapeHtml(collection.fit)}</p>
              ${renderLibraryTags(collection.subjects)}
              <a class="card-link" href="${escapeHtml(collection.url)}" target="_blank" rel="noopener noreferrer">${icon("externalLink")}<span>Open source page</span></a>
            </article>
          `).join("")}
        </div>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <div class="section-head">
          <div>
            <h2>Books For Revision</h2>
            <p>${books.length} matches. Use search and subject filters to find the right reading faster.</p>
          </div>
        </div>
        <div class="directory-toolbar content-panel library-toolbar">
          <input class="search-input" data-library-search type="search" value="${escapeHtml(state.librarySearch)}" placeholder="Search title, author, subject or topic" aria-label="Search digital library">
          <select data-library-subject aria-label="Filter digital library by subject">
            <option value="all"${state.librarySubject === "all" ? " selected" : ""}>All subjects</option>
            ${subjects.map((subject) => `<option value="${escapeHtml(subject)}"${state.librarySubject === subject ? " selected" : ""}>${escapeHtml(subject)}</option>`).join("")}
          </select>
        </div>
        <div class="book-grid">
          ${visibleBooks.length ? visibleBooks.map((book) => `
            <article class="card book-card">
              ${book.cover_image ? `<img class="book-cover" src="${escapeHtml(book.cover_image)}" alt="${escapeHtml(book.cover_alt || book.title)}" loading="lazy">` : `<span class="card-icon">${icon("bookOpen")}</span>`}
              <div class="book-card-body">
                <div class="library-card-head">
                  <span>${escapeHtml(book.collection_title)}</span>
                  <strong>${escapeHtml(book.score)}%</strong>
                </div>
                <h3>${escapeHtml(book.title)}</h3>
                <p>${escapeHtml(book.description)}</p>
                <div class="book-meta">
                  ${book.author ? `<span>${icon("fileText")}${escapeHtml(book.author)}</span>` : ""}
                  ${book.pages ? `<span>${escapeHtml(book.pages)}</span>` : ""}
                  ${book.file_size ? `<span>${escapeHtml(book.file_size)}</span>` : ""}
                </div>
                ${renderLibraryTags(book.subjects)}
                <div class="book-actions">
                  <a class="card-link" href="${escapeHtml(book.read_url)}" target="_blank" rel="noopener noreferrer">${icon("bookOpen")}<span>Read source page</span></a>
                  <a class="card-link muted-link" href="${escapeHtml(book.source_url)}" target="_blank" rel="noopener noreferrer">${icon("externalLink")}<span>Collection</span></a>
                </div>
              </div>
            </article>
          `).join("") : `
            <div class="empty-state">
              <h3>No books found</h3>
              <p>Try a broader search term or choose all subjects.</p>
            </div>
          `}
        </div>
        ${books.length > visibleBooks.length ? `<p class="review-limit">Showing the first ${visibleBooks.length} matches. Narrow your search to see a more focused list.</p>` : ""}
      </div>
    </section>
  `;
}

function imageReviewRows() {
  const matchData = state.imageMatches || {};
  const rows = [];

  for (const entry of matchData.review_queue || []) {
    const topicUrlParts = String(entry.topic_key || "").split("::");
    const href = topicUrlParts.length >= 4 ? topicHref(
      { id: topicUrlParts[0] },
      { id: topicUrlParts[1] },
      topicUrlParts[2],
      topicUrlParts[3]
    ) : "#/resources/image-review";
    const decision = imageReviewDecision(entry.topic_key);

    rows.push({
      key: entry.topic_key,
      status: entry.confidence || "needs-review",
      title: entry.topic_title || "Untitled topic",
      unit: `${entry.unit_code ? `${entry.unit_code}: ` : ""}${entry.unit_title || "Course unit"}`,
      programme: entry.programme || "Programme",
      category: decision.status === "custom" && decision.category ? decision.category : entry.category || "nursing-study",
      image: decision.status === "custom" && decision.image ? decision.image : entry.image,
      score: entry.score || 0,
      terms: entry.matched_terms || [],
      decision,
      href
    });
  }

  for (const entry of matchData.unmatched || []) {
    const topicUrlParts = String(entry.topic_key || "").split("::");
    const href = topicUrlParts.length >= 4 ? topicHref(
      { id: topicUrlParts[0] },
      { id: topicUrlParts[1] },
      topicUrlParts[2],
      topicUrlParts[3]
    ) : "#/resources/image-review";
    const decision = imageReviewDecision(entry.topic_key);

    rows.push({
      key: entry.topic_key,
      status: "unmatched",
      title: entry.topic_title || "Untitled topic",
      unit: entry.unit_title || "Course unit",
      programme: entry.programme || "Programme",
      category: decision.status === "custom" && decision.category ? decision.category : "unmatched",
      image: decision.status === "custom" && decision.image ? decision.image : "",
      score: 0,
      terms: [],
      decision,
      href
    });
  }

  return rows;
}

async function loadImageLibrary() {
  if (state.imageLibrary) return state.imageLibrary;
  const response = await fetch("assets/images/nursing-uganda-source-image-library.json");
  if (!response.ok) throw new Error("Image library could not be loaded.");
  const data = await response.json();
  state.imageLibrary = (data.images || [])
    .filter((image) => image.file && ![".svg", ".gif"].includes(image.extension))
    .filter((image) => image.size_bytes >= 7000)
    .filter((image) => state.optimizedImages[image.file] || image.size_bytes <= 180000);
  return state.imageLibrary;
}

function imagePickerCategories() {
  const images = state.imageLibrary || [];
  return [...new Set(images.map((image) => image.category).filter(Boolean))].sort();
}

function imageSearchText(image) {
  return [
    image.id,
    image.category,
    image.original_file_hint,
    image.source_path,
    image.file
  ].filter(Boolean).join(" ").toLowerCase();
}

function imagePickerResults() {
  const images = state.imageLibrary || [];
  const query = state.imagePickerSearch.trim().toLowerCase();
  const category = state.imagePickerCategory;
  return images
    .filter((image) => category === "all" || image.category === category)
    .filter((image) => !query || imageSearchText(image).includes(query))
    .sort((a, b) => {
      const optimizedDifference = Number(Boolean(state.optimizedImages[b.file])) - Number(Boolean(state.optimizedImages[a.file]));
      return optimizedDifference || b.size_bytes - a.size_bytes;
    })
    .slice(0, 36);
}

function renderImagePicker(activeRow) {
  if (!state.imagePickerKey || !activeRow) return "";
  if (!state.imageLibrary) {
    return `
      <div class="image-picker-panel content-panel">
        <div class="section-head">
          <div>
            <h2>Choose Replacement Image</h2>
            <p>Loading image library...</p>
          </div>
        </div>
      </div>
    `;
  }

  const categories = imagePickerCategories();
  const results = imagePickerResults();
  return `
    <div class="image-picker-panel content-panel">
      <div class="section-head">
        <div>
          <h2>Choose Replacement Image</h2>
          <p>${escapeHtml(activeRow.title)} - ${escapeHtml(activeRow.programme)}</p>
        </div>
        <button type="button" class="button secondary" data-image-picker-close>${buttonLabel("Close Picker", "arrowLeft")}</button>
      </div>
      <div class="directory-toolbar image-picker-toolbar">
        <input class="search-input" data-image-picker-search type="search" value="${escapeHtml(state.imagePickerSearch)}" placeholder="Search image library by topic, category or filename" aria-label="Search replacement images">
        <select data-image-picker-category aria-label="Filter replacement images by category">
          <option value="all"${state.imagePickerCategory === "all" ? " selected" : ""}>All categories</option>
          ${categories.map((category) => `<option value="${escapeHtml(category)}"${state.imagePickerCategory === category ? " selected" : ""}>${escapeHtml(topicImageCategoryLabel(category))}</option>`).join("")}
        </select>
      </div>
      <div class="image-picker-grid">
        ${results.map((image) => `
          <button type="button" class="image-picker-option" data-image-pick-key="${escapeHtml(activeRow.key)}" data-image-pick-src="${escapeHtml(image.file)}" data-image-pick-category="${escapeHtml(image.category)}">
            <img src="${escapeHtml(displayImageSrc(image.file))}" alt="${escapeHtml(`Replacement option for ${activeRow.title}`)}" loading="lazy">
            <span>${escapeHtml(topicImageCategoryLabel(image.category))}</span>
          </button>
        `).join("")}
        ${results.length ? "" : `<div class="empty-state">No replacement images matched that search.</div>`}
      </div>
    </div>
  `;
}

function imageReviewStats(rows = imageReviewRows()) {
  return rows.reduce((stats, row) => {
    stats[row.status] = (stats[row.status] || 0) + 1;
    stats.total += 1;
    return stats;
  }, { total: 0, strong: 0, medium: 0, "needs-review": 0, unmatched: 0 });
}

function renderImageReview() {
  const query = state.imageReviewSearch.trim().toLowerCase();
  const status = state.imageReviewStatus;
  const rows = imageReviewRows();
  const stats = imageReviewStats(rows);
  const decisionStats = imageReviewDecisionStats();
  const filtered = rows.filter((row) => {
    const decisionStatus = row.decision.status || "";
    const haystack = `${row.title} ${row.unit} ${row.programme} ${row.category} ${row.terms.join(" ")} ${decisionStatus}`.toLowerCase();
    const matchesQuery = !query || haystack.includes(query);
    const matchesStatus = status === "all" || row.status === status;
    return matchesQuery && matchesStatus;
  });
  const activePickerRow = rows.find((row) => row.key === state.imagePickerKey);

  return `
    ${hero({
      title: "Image Review",
      body: "Check topic images before they become part of the final student experience.",
      image: imageCatalog.schools,
      actions: buttonLink("#/resources", "Back to Resources", "secondary", "arrowLeft")
    })}
    <section class="section">
      <div class="container">
        <div class="review-stats">
          ${[
            ["Strong", stats.strong, "strong"],
            ["Medium", stats.medium, "medium"],
            ["Needs Review", stats["needs-review"], "needs-review"],
            ["Unmatched", stats.unmatched, "unmatched"]
          ].map(([label, value, key]) => `
            <button type="button" class="review-stat${state.imageReviewStatus === key ? " active" : ""}" data-image-review-status="${escapeHtml(key)}">
              <strong>${value}</strong>
              <span>${escapeHtml(label)}</span>
            </button>
          `).join("")}
        </div>
        <div class="directory-toolbar content-panel">
          <input class="search-input" data-image-review-search type="search" value="${escapeHtml(state.imageReviewSearch)}" placeholder="Search topic, programme, unit or image category" aria-label="Search image review">
          <select data-image-review-status-select aria-label="Filter image review by status">
            <option value="all"${state.imageReviewStatus === "all" ? " selected" : ""}>All matches</option>
            <option value="strong"${state.imageReviewStatus === "strong" ? " selected" : ""}>Strong</option>
            <option value="medium"${state.imageReviewStatus === "medium" ? " selected" : ""}>Medium</option>
            <option value="needs-review"${state.imageReviewStatus === "needs-review" ? " selected" : ""}>Needs review</option>
            <option value="unmatched"${state.imageReviewStatus === "unmatched" ? " selected" : ""}>Unmatched</option>
          </select>
        </div>
        <div class="section-head">
          <div>
            <h2>${filtered.length} Items</h2>
            <p>Strong matches show on topic pages by default. Approved choices also show; hidden and replace-marked choices stay off the topic pages.</p>
          </div>
          <div class="decision-summary">
            <span>${decisionStats.approved} approved</span>
            <span>${decisionStats.custom} custom</span>
            <span>${decisionStats.hidden} hidden</span>
            <span>${decisionStats.replace} marked for replace</span>
          </div>
        </div>
        ${renderImagePicker(activePickerRow)}
        <div class="image-review-grid">
          ${filtered.slice(0, 120).map((row) => `
            <article class="image-review-card card">
              ${row.image ? `<img src="${escapeHtml(displayImageSrc(row.image))}" alt="${escapeHtml(`Matched image for ${row.title}`)}" loading="lazy">` : `<div class="image-review-empty">${icon("fileText")}<span>No strong image yet</span></div>`}
              <div class="image-review-body">
                <div class="school-card-head">
                  <span class="status-pill ${row.status === "strong" ? "full" : row.status === "unmatched" ? "provisional" : ""}">${escapeHtml(row.status.replace("-", " "))}</span>
                  <span>${row.score ? `Score ${row.score}` : "Manual pick needed"}</span>
                </div>
                ${row.decision.status ? `<span class="decision-pill ${escapeHtml(row.decision.status)}">${escapeHtml(imageReviewDecisionLabel(row.decision.status))}</span>` : ""}
                <h3>${escapeHtml(row.title)}</h3>
                <p>${escapeHtml(row.unit)}</p>
                <div class="programme-tags">
                  <span>${escapeHtml(row.programme)}</span>
                  <span>${escapeHtml(topicImageCategoryLabel(row.category))}</span>
                </div>
                ${row.terms.length ? `<p class="review-terms">${escapeHtml(row.terms.slice(0, 5).join(", "))}</p>` : ""}
                <div class="image-review-actions">
                  <button type="button" data-image-picker-key="${escapeHtml(row.key)}" data-image-picker-title="${escapeHtml(row.title)}" data-image-picker-category-seed="${escapeHtml(row.category)}">${icon("search")}<span>Choose</span></button>
                  ${row.image ? `<button type="button" data-image-decision-key="${escapeHtml(row.key)}" data-image-decision-status="approved">${icon("checkCircle")}<span>Approve</span></button>` : ""}
                  ${row.image ? `<button type="button" data-image-decision-key="${escapeHtml(row.key)}" data-image-decision-status="hidden">${icon("bookmark")}<span>Hide</span></button>` : ""}
                  <button type="button" data-image-decision-key="${escapeHtml(row.key)}" data-image-decision-status="replace">${icon("rotateCcw")}<span>Replace</span></button>
                  ${row.decision.status ? `<button type="button" data-image-decision-key="${escapeHtml(row.key)}" data-image-decision-status="clear">${icon("arrowLeft")}<span>Clear</span></button>` : ""}
                </div>
                <a class="card-link" href="${escapeHtml(row.href)}">${icon("arrowRight")}<span>Open topic</span></a>
              </div>
            </article>
          `).join("")}
          ${filtered.length ? "" : `<div class="empty-state">No image review items matched that filter.</div>`}
        </div>
        ${filtered.length > 120 ? `<p class="review-limit">Showing the first 120 matches. Use search or filters to narrow the list.</p>` : ""}
      </div>
    </section>
  `;
}

function renderResourceDetail(page) {
  const resourceBookmark = {
    key: `resource::${page.slug}`,
    type: "Resource",
    title: page.title,
    context: "Resources",
    href: `#/resources/${page.slug}`
  };

  return `
    ${hero({
      title: page.title,
      body: page.body,
      image: imageFor(page.title),
      actions: `${buttonLink("#/resources", "Back to Resources", "secondary", "arrowLeft")}${bookmarkButton(resourceBookmark)}`
    })}
    <section class="section">
      <div class="container">
        <div class="grid two">
          ${page.sections.map(([title, body]) => `
            <article class="card image-card resource-card">
              ${cardImage(title)}
              <span class="card-icon">${iconFor(title)}</span>
              <h3>${escapeHtml(title)}</h3>
              <p>${escapeHtml(body)}</p>
            </article>
          `).join("")}
        </div>
      </div>
    </section>
    <section class="section soft-section">
      <div class="container content-panel resource-plan">
        <div class="section-head">
          <div>
            <h2>How To Use This Resource</h2>
            <p>Follow this simple path and connect each resource back to your course notes.</p>
          </div>
        </div>
        <ol class="resource-steps">
          ${page.steps.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}
        </ol>
      </div>
    </section>
  `;
}

function renderSchoolsDirectory() {
  const query = state.schoolSearch.trim().toLowerCase();
  const status = state.schoolStatus;
  const schools = schoolDirectory().filter((school) => {
    const haystack = `${school.name} ${school.district} ${school.sector} ${school.status} ${school.programmes.join(" ")}`.toLowerCase();
    const matchesQuery = !query || haystack.includes(query);
    const matchesStatus = status === "all" || school.status.toLowerCase().includes(status);
    return matchesQuery && matchesStatus;
  });

  return `
    ${hero({
      title: "Schools Directory",
      body: "Find nursing and midwifery training institutions by district, programme type and recognition status.",
      image: imageCatalog.nursing,
      actions: `${buttonLink("#/resources", "Back to Resources", "secondary", "arrowLeft")}${buttonLink("https://unmc.ug/recognized-schools/", "Check UNMC Source", "primary", "externalLink", `target="_blank" rel="noopener"`)}`
    })}
    <section class="section">
      <div class="container">
        <div class="directory-toolbar content-panel">
          <input class="search-input" data-school-search type="search" value="${escapeHtml(state.schoolSearch)}" placeholder="Search school, district, programme or sector" aria-label="Search schools directory">
          <select data-school-status aria-label="Filter schools by recognition status">
            <option value="all"${state.schoolStatus === "all" ? " selected" : ""}>All statuses</option>
            <option value="full registration"${state.schoolStatus === "full registration" ? " selected" : ""}>Full registration</option>
            <option value="provisional"${state.schoolStatus === "provisional" ? " selected" : ""}>Provisional license</option>
          </select>
        </div>
        <div class="section-head">
          <div>
            <h2>${schools.length} Schools Listed</h2>
            <p>Status notes are based on the UNMC recognized-schools listing. Always confirm directly with UNMC and the school before applying.</p>
          </div>
        </div>
        <div class="school-grid">
          ${schools.length ? schools.map((school) => `
            <article class="school-card card">
              <span class="card-icon">${icon("school")}</span>
              <div class="school-card-head">
                <span class="status-pill ${school.status.toLowerCase().includes("full") ? "full" : "provisional"}">${escapeHtml(school.status)}</span>
                <span>${escapeHtml(school.sector)}</span>
              </div>
              <h3>${escapeHtml(school.name)}</h3>
              <p>${escapeHtml(school.note)}</p>
              <div class="school-meta">
                <strong>District</strong>
                <span>${escapeHtml(school.district)}</span>
                <strong>Verify</strong>
                <span>${escapeHtml(school.verification)}</span>
              </div>
              <div class="programme-tags">
                ${school.programmes.map((programme) => `<span>${escapeHtml(programme)}</span>`).join("")}
              </div>
            </article>
          `).join("") : `<div class="empty-state">No schools matched that filter.</div>`}
        </div>
      </div>
    </section>
  `;
}

function medicalInstrumentCategories() {
  const categoryData = [
    {
      title: "Assessment And Vital Signs",
      body: "Tools used for baseline observations, triage and routine patient monitoring.",
      items: [
        ["Stethoscope", "Auscultates heart, lung and bowel sounds.", "Clean earpieces and diaphragm before and after use.", "Do not press too hard during chest assessment."],
        ["Blood pressure machine", "Measures systolic and diastolic blood pressure.", "Select the correct cuff size and position at heart level.", "Avoid measuring on an injured arm or arm with an IV line."],
        ["Thermometer", "Checks body temperature.", "Use the correct route and disinfect reusable probes.", "Document route because oral, axillary and rectal readings differ."],
        ["Pulse oximeter", "Measures oxygen saturation and pulse rate.", "Place on a warm clean finger or toe.", "Poor perfusion, nail polish and movement may affect readings."],
        ["Glucometer", "Checks capillary blood glucose.", "Use a clean lancet and compatible test strip.", "Dispose of sharps safely and follow infection prevention."]
      ]
    },
    {
      title: "Injection And IV Care",
      body: "Equipment used for safe injections, cannulation, fluids and medication administration.",
      items: [
        ["Syringes", "Draws and administers measured medication volumes.", "Check size, sterility and expiry before use.", "Use one syringe for one patient and one procedure only."],
        ["Needles", "Pierces tissue or vial rubber for injections and drug preparation.", "Choose gauge and length according to route and patient.", "Never recap used needles unless local safety policy requires a protected method."],
        ["IV cannula", "Provides venous access for fluids and medications.", "Prepare skin, select vein and secure after insertion.", "Monitor for infiltration, phlebitis and infection."],
        ["Giving set", "Connects IV fluid container to venous access.", "Prime the line and remove air before connection.", "Regulate flow rate and check patient response."],
        ["Tourniquet", "Temporarily distends veins for cannulation or blood sampling.", "Apply above the intended site and release promptly.", "Do not leave on for prolonged periods."]
      ]
    },
    {
      title: "Dressing And Wound Care",
      body: "Instruments used during wound cleaning, dressing, minor procedures and infection prevention.",
      items: [
        ["Dressing tray", "Holds sterile supplies for wound care.", "Arrange sterile items before exposing the wound.", "Maintain the sterile field throughout the procedure."],
        ["Kidney dish", "Receives used swabs, small instruments or fluids.", "Keep clean and within easy reach.", "Do not mix clean and contaminated items."],
        ["Artery forceps", "Clamps bleeding vessels or holds tissue during procedures.", "Check locking mechanism and sterility.", "Use gently to avoid unnecessary tissue trauma."],
        ["Dissecting forceps", "Holds tissue, gauze or dressing materials.", "Choose toothed or non-toothed type based on tissue handling.", "Avoid touching sterile tips with bare hands."],
        ["Bandage scissors", "Cuts bandages and dressings safely.", "Use blunt tip toward the patient.", "Clean after use and store safely."]
      ]
    },
    {
      title: "Midwifery And Obstetric Care",
      body: "Common instruments for antenatal assessment, labour monitoring and delivery support.",
      items: [
        ["Fetoscope", "Listens to fetal heart sounds.", "Position correctly after palpating fetal lie.", "Count fetal heart rate for a full minute when concerned."],
        ["Vaginal speculum", "Visualizes the cervix and vaginal walls.", "Use correct size, lubrication and privacy.", "Explain the procedure and maintain dignity."],
        ["Cord clamp", "Clamps the umbilical cord after birth.", "Apply securely before cutting the cord.", "Check for bleeding from the cord stump."],
        ["Delivery set", "Contains sterile instruments for conducting delivery.", "Confirm all items before second stage or procedure.", "Maintain asepsis and prepare newborn care items."],
        ["Sponge holding forceps", "Holds swabs during cleaning or obstetric procedures.", "Confirm sterility before use.", "Use carefully to prevent tissue injury."]
      ]
    },
    {
      title: "Sterilization And Theatre",
      body: "Equipment used to keep instruments safe, sterile and ready for procedures.",
      items: [
        ["Autoclave", "Sterilizes instruments using steam under pressure.", "Load correctly and check cycle indicators.", "Do not use wet or damaged packs as sterile."],
        ["Sterile packs", "Keep instruments sterile until use.", "Check expiry, dryness and intact wrapping.", "Open without contaminating contents."],
        ["Instrument tray", "Organizes instruments for procedures.", "Arrange in order of use.", "Keep sterile and count items where required."],
        ["Suture set", "Supports wound closure or minor surgical procedures.", "Prepare sutures, needle holder, forceps and scissors.", "Use aseptic technique and dispose sharps correctly."],
        ["Surgical scissors", "Cuts tissue, sutures or dressings depending on type.", "Use the correct scissors for the task.", "Do not use tissue scissors for rough materials."]
      ]
    },
    {
      title: "Patient Care Equipment",
      body: "Bedside tools used for comfort, elimination, oxygen support and basic ward care.",
      items: [
        ["Bedpan", "Assists bedbound patients with elimination.", "Warm, position and support patient privacy.", "Clean promptly and observe output if needed."],
        ["Urinal", "Collects urine for male or selected immobile patients.", "Position safely and empty after use.", "Measure and document urine output when prescribed."],
        ["Catheter", "Drains urine from the bladder.", "Use sterile technique for insertion.", "Monitor for infection and maintain a closed drainage system."],
        ["Suction machine", "Removes secretions from airway or wound areas.", "Check pressure, tubing and container before use.", "Use correct pressure and avoid prolonged airway suction."],
        ["Oxygen cylinder", "Stores oxygen for oxygen therapy.", "Check gauge, regulator and flow meter.", "Keep away from flames and secure cylinder upright."]
      ]
    }
  ];

  return categoryData.map((category) => ({
    ...category,
    items: category.items.map(([name, use, preparation, safety]) => ({
      name,
      slug: slugify(name),
      use,
      preparation,
      safety,
      category: category.title
    }))
  }));
}

function allMedicalInstruments() {
  return medicalInstrumentCategories().flatMap((category) => category.items);
}

function findMedicalInstrument(slug) {
  return allMedicalInstruments().find((instrument) => instrument.slug === slug);
}

function medicalInstrumentImageMap() {
  return {
    "stethoscope": ["assets/images/source-library/nursing-uganda-auscultation-using-a-stethoscope-001-0bc2e155.jpg", "Stethoscope used during auscultation"],
    "blood-pressure-machine": ["assets/images/source-library/nursing-uganda-proper-measurement-of-blood-pressure-1-001-b6736952.png", "Blood pressure measurement in clinical practice"],
    "thermometer": ["assets/images/source-library/nursing-uganda-clinical-thermometer-diagram-001-9a9cfdc2.webp", "Clinical thermometer diagram"],
    "pulse-oximeter": ["assets/images/source-library/nursing-uganda-pulse-taking-001-8df08029.jpg", "Pulse assessment in patient care"],
    "glucometer": ["assets/images/source-library/nursing-uganda-proper-measurement-of-blood-pressure-1-001-b6736952.png", "Bedside assessment equipment reference"],
    "syringes": ["assets/images/source-library/nursing-uganda-injectable-contraceptives-sayana-001-ee428388.jpg", "Injection equipment used for medication administration"],
    "needles": ["assets/images/source-library/nursing-uganda-suture-needles-001-1eeb36ee.jpg", "Clinical needles reference"],
    "iv-cannula": ["assets/images/source-library/nursing-uganda-urinary-catheter-001-36b710e8.webp", "Tubular clinical device reference"],
    "giving-set": ["assets/images/source-library/nursing-uganda-oxygen-administration-001-8b0fc992.jpg", "Clinical tubing and bedside care reference"],
    "tourniquet": ["assets/images/source-library/nursing-uganda-requirements-radial-pulse-001-233e723c.webp", "Assessment requirements used during bedside care"],
    "dressing-tray": ["assets/images/source-library/nursing-uganda-medical-instruments-for-nursing-uganda-001-d983f851.jpg", "Medical instruments arranged for clinical use"],
    "kidney-dish": ["assets/images/source-library/nursing-uganda-medical-instruments-for-nursing-uganda-001-d983f851.jpg", "Instrument tray and kidney dish reference"],
    "artery-forceps": ["assets/images/source-library/nursing-uganda-polypectomy-forceps-or-ring-forceps-001-27ed4325.jpg", "Forceps used in clinical procedures"],
    "dissecting-forceps": ["assets/images/source-library/nursing-uganda-polypectomy-forceps-or-ring-forceps-001-27ed4325.jpg", "Forceps used in clinical procedures"],
    "bandage-scissors": ["assets/images/source-library/nursing-uganda-medical-instruments-for-nursing-uganda-001-d983f851.jpg", "Instrument set including cutting tools"],
    "fetoscope": ["assets/images/source-library/nursing-uganda-midwifery-1024x546-001-5661a73d.jpg", "Midwifery skills practice"],
    "vaginal-speculum": ["assets/images/source-library/nursing-uganda-bimanual-pelvic-examination-and-speculum-vaginal-examination-001-d127121e.jpg", "Speculum and pelvic examination reference"],
    "cord-clamp": ["assets/images/source-library/nursing-uganda-cleaning-of-the-baby-cord-checklist-nursing-uganda-001-39d0ef7e.jpg", "Umbilical cord care reference"],
    "delivery-set": ["assets/images/source-library/nursing-uganda-midwifery-1024x546-001-5661a73d.jpg", "Midwifery delivery skills practice"],
    "sponge-holding-forceps": ["assets/images/source-library/nursing-uganda-polypectomy-forceps-or-ring-forceps-001-27ed4325.jpg", "Forceps used in clinical procedures"],
    "autoclave": ["assets/images/source-library/nursing-uganda-autoclave-or-different-types-of-disinfectants-001-0c018319.webp", "Autoclave and disinfection reference"],
    "sterile-packs": ["assets/images/source-library/nursing-uganda-personal-protective-equipment-ppe-001-738ef2a0.jpg", "Sterile protective equipment reference"],
    "instrument-tray": ["assets/images/source-library/nursing-uganda-medical-instruments-for-nursing-uganda-001-d983f851.jpg", "Medical instruments arranged on a tray"],
    "suture-set": ["assets/images/source-library/nursing-uganda-suture-materials-1-1024x640-001-ae40a6a1.jpg", "Suture materials and wound closure reference"],
    "surgical-scissors": ["assets/images/source-library/nursing-uganda-medical-instruments-for-nursing-uganda-001-d983f851.jpg", "Clinical instrument set"],
    "bedpan": ["assets/images/source-library/nursing-uganda-nurse-giving-a-bed-bath-001-338d6734.jpg", "Bedside patient care reference"],
    "urinal": ["assets/images/source-library/nursing-uganda-giving-a-urinal-1-001-4cdd0670.png", "Patient urinal care reference"],
    "catheter": ["assets/images/source-library/nursing-uganda-catheter-001-56996e14.jpg", "Urinary catheter reference"],
    "suction-machine": ["assets/images/source-library/nursing-uganda-suctioning-001-42122ec0.jpg", "Suctioning equipment and procedure reference"],
    "oxygen-cylinder": ["assets/images/source-library/nursing-uganda-oxygen-administration-001-8b0fc992.jpg", "Oxygen administration reference"]
  };
}

function instrumentImageFor(instrument) {
  const [src, alt] = medicalInstrumentImageMap()[instrument.slug] || [imageCatalog.instruments.src, imageCatalog.instruments.alt];
  return { src, alt };
}

function renderMedicalInstruments() {
  const categories = medicalInstrumentCategories();

  return `
    ${hero({
      title: "Medical Instruments",
      body: "A practical guide to common nursing and midwifery instruments, their uses and safe handling points.",
      image: imageCatalog.instruments,
      actions: buttonLink("#/resources", "Back to Resources", "secondary", "arrowLeft")
    })}
    <section class="section">
      <div class="container">
        <div class="section-head">
          <div>
            <h2>Instrument Categories</h2>
            <p>Use these categories for quick revision before skills lab, ward placement, OSCE practice and clinical demonstrations.</p>
          </div>
        </div>
        <div class="grid three">
          ${categories.map((category) => `
            <article class="instrument-card card">
              <span class="card-icon">${iconFor(category.title)}</span>
              <h3>${escapeHtml(category.title)}</h3>
              <p>${escapeHtml(category.body)}</p>
              <ul class="instrument-list">
                ${category.items.map((item) => `<li><a href="#/resources/medical-instruments/${item.slug}">${escapeHtml(item.name)}</a></li>`).join("")}
              </ul>
            </article>
          `).join("")}
        </div>
      </div>
    </section>
    <section class="section soft-section">
      <div class="container content-panel instrument-guide">
        <h2>How To Revise Instruments</h2>
        <div class="guide-grid">
          <div>
            <h3>Know The Use</h3>
            <p>Be able to explain what the instrument is used for and when it should be selected.</p>
          </div>
          <div>
            <h3>Handle Safely</h3>
            <p>Revise cleanliness, sterility, sharps safety, patient privacy and infection prevention.</p>
          </div>
          <div>
            <h3>Prepare Correctly</h3>
            <p>Check function, gather accessories, arrange the tray and document care where required.</p>
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderMedicalInstrumentDetail(instrument) {
  const instrumentImage = instrumentImageFor(instrument);
  const instrumentBookmark = {
    key: `instrument::${instrument.slug}`,
    type: "Instrument",
    title: instrument.name,
    context: instrument.category,
    href: `#/resources/medical-instruments/${instrument.slug}`
  };

  return `
    ${hero({
      title: instrument.name,
      body: `${instrument.category}. Revise the use, preparation and safety points for clinical practice and OSCEs.`,
      image: instrumentImage,
      actions: `${buttonLink("#/resources/medical-instruments", "Back to Instruments", "secondary", "arrowLeft")}${bookmarkButton(instrumentBookmark)}`
    })}
    <section class="section">
      <div class="container app-layout">
        <aside class="side-panel">
          <h3>Instrument Notes</h3>
          <a href="#/resources/medical-instruments">${icon("stethoscope")}<span>All instruments</span></a>
          <button type="button" data-scroll-target="instrument-use">${icon("activity")}<span>Use</span></button>
          <button type="button" data-scroll-target="instrument-preparation">${icon("clipboardList")}<span>Preparation</span></button>
          <button type="button" data-scroll-target="instrument-safety">${icon("badgeCheck")}<span>Safety</span></button>
          <button type="button" data-scroll-target="instrument-exam">${icon("fileText")}<span>Exam Points</span></button>
        </aside>
        <article class="topic-detail content-panel">
          <div class="topic-meta">
            <span>${escapeHtml(instrument.category)}</span>
            <span>Medical Instrument</span>
          </div>
          <figure class="instrument-image-panel">
            <img src="${escapeHtml(displayImageSrc(instrumentImage.src))}" alt="${escapeHtml(instrumentImage.alt)}" loading="lazy">
            <figcaption>
              <strong>${escapeHtml(instrument.name)}</strong>
              <span>Clinical image reference</span>
            </figcaption>
          </figure>
          <section id="instrument-use" class="lesson-section">
            <h3>Use</h3>
            <p>${escapeHtml(instrument.use)}</p>
          </section>
          <section id="instrument-preparation" class="lesson-section">
            <h3>Preparation</h3>
            <p>${escapeHtml(instrument.preparation)}</p>
          </section>
          <section id="instrument-safety" class="lesson-section">
            <h3>Safety</h3>
            <p>${escapeHtml(instrument.safety)}</p>
          </section>
          <section id="instrument-exam" class="lesson-section">
            <h3>Exam Points</h3>
            <ul>
              <li>State the name of the instrument clearly.</li>
              <li>Explain its main clinical use.</li>
              <li>Mention preparation before use.</li>
              <li>Give at least one safety or infection prevention point.</li>
            </ul>
          </section>
        </article>
      </div>
    </section>
  `;
}

function updateCurriculumNav(activeId) {
  const nav = app.querySelector("[data-curriculum-nav]");
  if (!nav || !activeId) return;
  const items = [...nav.querySelectorAll("[data-year-nav]")];
  const activeIndex = Math.max(0, items.findIndex((item) => item.dataset.yearNav === activeId));
  items.forEach((item, index) => item.classList.toggle("active", item.dataset.yearNav === activeId));

  const label = nav.querySelector("[data-curriculum-progress-label]");
  if (label) {
    const activeButton = items[activeIndex] ? items[activeIndex].querySelector("button span") : null;
    label.textContent = activeButton ? activeButton.textContent : "Year 1";
  }

  const bar = nav.querySelector("[data-curriculum-progress-bar]");
  if (bar && items.length) {
    bar.style.width = `${Math.round(((activeIndex + 1) / items.length) * 100)}%`;
  }
}

function setupCurriculumScrollSpy() {
  const sections = [...app.querySelectorAll("[data-year-section]")];
  if (!sections.length) return;
  const updateFromScroll = () => {
    const viewportAnchor = 132;
    const active = sections
      .map((section) => ({ section, rect: section.getBoundingClientRect() }))
      .filter(({ rect }) => rect.top <= window.innerHeight * 0.5 && rect.bottom >= viewportAnchor)
      .sort((a, b) => Math.abs(a.rect.top - viewportAnchor) - Math.abs(b.rect.top - viewportAnchor))[0];
    if (active && active.section.id) updateCurriculumNav(active.section.id);
  };
  updateCurriculumNav(sections[0].id);
  updateFromScroll();
  window.addEventListener("scroll", () => requestAnimationFrame(updateFromScroll), { passive: true });
  if (!("IntersectionObserver" in window)) return;
  const observer = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => Math.abs(a.boundingClientRect.top - 120) - Math.abs(b.boundingClientRect.top - 120))[0];
    if (visible && visible.target.id) updateCurriculumNav(visible.target.id);
  }, { rootMargin: "-22% 0px -58% 0px", threshold: [0.05, 0.2, 0.5] });
  sections.forEach((section) => observer.observe(section));
}

function notFound() {
  return `
    <section class="section">
      <div class="container">
        <div class="empty-state">
          <h1>Page not found</h1>
          <p>This page is not available yet.</p>
          ${buttonLink("#/notes", "Go to Notes", "primary", "home")}
        </div>
      </div>
    </section>
  `;
}

function render() {
  if (!state.data) return;
  const parts = currentRoute();
  let content = "";
  let meta = {
    title: "Nursing Uganda",
    description: "Nursing and midwifery revision for Uganda students, with notes, courses, resources and practical study support."
  };

  if (parts[0] === "notes") {
    content = renderNotes();
    meta = { title: "Notes", description: "Study nursing and midwifery notes by subject, course unit and topic." };
  }
  else if (parts[0] === "search") {
    content = renderGlobalSearchPage();
    meta = { title: "Search", description: "Search Nursing Uganda notes, courses, resources, instruments and schools." };
  }
  else if (parts[0] === "quizzes") {
    content = renderQuizHub();
    meta = { title: "Quizzes", description: "Practice nursing and midwifery revision with topic-linked quick quizzes." };
  }
  else if (parts[0] === "resources" && parts[1] === "quizzes") {
    content = renderQuizHub();
    meta = { title: "Quizzes", description: "Practice nursing and midwifery revision with topic-linked quick quizzes." };
  }
  else if (parts[0] === "resources" && (parts[1] === "books" || parts[1] === "digital-library")) {
    content = renderBookLibrary();
    meta = { title: "Digital Library", description: "Curated nursing and medical book source links matched to Nursing Uganda course topics." };
  }
  else if (parts[0] === "resources" && parts[1] === "medical-instruments" && parts[2]) {
    const instrument = findMedicalInstrument(parts[2]);
    content = instrument ? renderMedicalInstrumentDetail(instrument) : notFound();
    if (instrument) meta = { title: instrument.name, description: `${instrument.name}: ${instrument.use} Revise preparation, safety and exam points.` };
  }
  else if (parts[0] === "resources" && parts[1] === "medical-instruments") {
    content = renderMedicalInstruments();
    meta = { title: "Medical Instruments", description: "Review common nursing and midwifery instruments with real image references, uses and safety notes." };
  }
  else if (parts[0] === "resources" && parts[1] === "schools") {
    content = renderSchoolsDirectory();
    meta = { title: "Schools Directory", description: "Browse nursing and midwifery schools by district, programme type and recognition status notes." };
  }
  else if (parts[0] === "resources" && parts[1] === "image-review") {
    content = renderImageReview();
    meta = { title: "Image Review", description: "Review, approve and replace topic images used across Nursing Uganda lessons." };
  }
  else if (parts[0] === "resources" && parts[1]) {
    const page = findResourcePage(parts[1]);
    content = page ? renderResourceDetail(page) : notFound();
    if (page) meta = { title: page.title, description: page.body };
  }
  else if (parts[0] === "resources") {
    content = renderResources();
    meta = { title: "Resources", description: "Use Nursing Uganda resources for past papers, quizzes, instruments, licensing, schools and student support." };
  }
  else if (parts[0] === "courses" && !parts[1]) {
    content = renderCourses();
    meta = { title: "Courses", description: "Browse nursing and midwifery programmes, course units and curriculum topics." };
  }
  else if (parts[0] === "courses" && parts[1] === "curriculum") {
    content = renderCurriculumHub();
    meta = { title: "Curriculum", description: "Explore nursing and midwifery curriculum pages by programme, year and semester." };
  }
  else if (parts[0] === "courses" && parts[1]) {
    const programme = findProgramme(parts[1]);
    if (!programme) content = notFound();
    else if (!parts[2]) {
      content = renderProgramme(programme);
      meta = { title: programme.label, description: `Explore ${programme.label} course units, topics, notes and progress tracking.` };
    }
    else {
      const unit = findUnit(programme, parts[2]);
      if (!unit) content = notFound();
      else if (parts[3] === "topic") {
        const topic = findTopic(unit, parts[4], parts[5]);
        content = topic ? renderTopic(programme, unit, topic) : notFound();
        if (topic) {
          const lesson = lessonFor(topic);
          meta = {
            title: lesson ? lesson.title : topic.title,
            description: lesson && lesson.excerpt ? truncateText(lesson.excerpt, 155) : `${topic.title} in ${unit.code ? `${unit.code}: ` : ""}${unit.title} for ${programme.label}.`
          };
        }
      } else {
        content = renderUnit(programme, unit);
        meta = { title: `${unit.code ? `${unit.code}: ` : ""}${unit.title}`, description: `${unit.title} topics, notes and progress for ${programme.label}.` };
      }
    }
  } else content = renderNotes();

  setDocumentMeta(meta.title, meta.description);
  layout(content);

  const search = app.querySelector("[data-search]");
  if (search) {
    search.addEventListener("input", (event) => {
      state.search = event.target.value;
      render();
      const newSearch = app.querySelector("[data-search]");
      if (newSearch) {
        newSearch.focus();
        newSearch.setSelectionRange(newSearch.value.length, newSearch.value.length);
      }
    });
  }

  const globalSearch = app.querySelector("[data-global-search]");
  if (globalSearch) {
    globalSearch.addEventListener("input", (event) => {
      state.globalSearch = event.target.value;
      if (currentRoute()[0] !== "search") {
        window.location.hash = "#/search";
        return;
      }
      render();
      const newSearch = app.querySelector("[data-global-search]");
      if (newSearch) {
        newSearch.focus();
        newSearch.setSelectionRange(newSearch.value.length, newSearch.value.length);
      }
    });
  }

  app.querySelectorAll("[data-global-search-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      window.location.hash = "#/search";
      render();
    });
  });

  app.querySelectorAll("[data-search-seed]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      state.globalSearch = link.dataset.searchSeed || "";
      window.location.hash = "#/search";
      render();
    });
  });

  app.querySelectorAll("[data-lesson-target]").forEach((button) => {
    button.addEventListener("click", () => {
      const target = app.querySelector(`#${button.dataset.lessonTarget}`);
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  app.querySelectorAll("[data-scroll-target]").forEach((button) => {
    button.addEventListener("click", () => {
      const target = app.querySelector(`#${button.dataset.scrollTarget}`);
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
  setupCurriculumScrollSpy();

  app.querySelectorAll("[data-complete-topic]").forEach((button) => {
    button.addEventListener("click", () => {
      setTopicComplete(button.dataset.completeTopic, !button.classList.contains("active"));
      render();
    });
  });

  app.querySelectorAll("[data-quiz-key]").forEach((button) => {
    button.addEventListener("click", () => {
      setQuizAnswer(button.dataset.quizKey, button.dataset.quizQuestion, button.dataset.quizAnswer);
      render();
      const target = app.querySelector("#topic-quiz");
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  app.querySelectorAll("[data-blank-quiz-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const input = form.querySelector("input");
      setQuizAnswer(form.dataset.quizKey, form.dataset.quizQuestion, input ? input.value : "");
      render();
      const target = app.querySelector("#topic-quiz");
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  app.querySelectorAll("[data-reset-quiz]").forEach((button) => {
    button.addEventListener("click", () => {
      resetQuiz(button.dataset.resetQuiz);
      render();
      const target = app.querySelector("#topic-quiz");
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  app.querySelectorAll("[data-bookmark-key]").forEach((button) => {
    button.addEventListener("click", () => {
      setBookmark({
        key: button.dataset.bookmarkKey,
        title: button.dataset.bookmarkTitle,
        type: button.dataset.bookmarkType,
        context: button.dataset.bookmarkContext,
        href: button.dataset.bookmarkHref
      }, !button.classList.contains("active"));
      render();
    });
  });

  app.querySelectorAll("[data-print-topic]").forEach((button) => {
    button.addEventListener("click", () => window.print());
  });

  const schoolSearch = app.querySelector("[data-school-search]");
  if (schoolSearch) {
    schoolSearch.addEventListener("input", (event) => {
      state.schoolSearch = event.target.value;
      render();
      const nextSearch = app.querySelector("[data-school-search]");
      if (nextSearch) {
        nextSearch.focus();
        nextSearch.setSelectionRange(nextSearch.value.length, nextSearch.value.length);
      }
    });
  }

  const schoolStatus = app.querySelector("[data-school-status]");
  if (schoolStatus) {
    schoolStatus.addEventListener("change", (event) => {
      state.schoolStatus = event.target.value;
      render();
    });
  }

  const librarySearch = app.querySelector("[data-library-search]");
  if (librarySearch) {
    librarySearch.addEventListener("input", (event) => {
      state.librarySearch = event.target.value;
      render();
      const nextSearch = app.querySelector("[data-library-search]");
      if (nextSearch) {
        nextSearch.focus();
        nextSearch.setSelectionRange(nextSearch.value.length, nextSearch.value.length);
      }
    });
  }

  const librarySubject = app.querySelector("[data-library-subject]");
  if (librarySubject) {
    librarySubject.addEventListener("change", (event) => {
      state.librarySubject = event.target.value;
      render();
    });
  }

  const imageReviewSearch = app.querySelector("[data-image-review-search]");
  if (imageReviewSearch) {
    imageReviewSearch.addEventListener("input", (event) => {
      state.imageReviewSearch = event.target.value;
      render();
      const nextSearch = app.querySelector("[data-image-review-search]");
      if (nextSearch) {
        nextSearch.focus();
        nextSearch.setSelectionRange(nextSearch.value.length, nextSearch.value.length);
      }
    });
  }

  app.querySelectorAll("[data-image-review-status]").forEach((button) => {
    button.addEventListener("click", () => {
      state.imageReviewStatus = button.dataset.imageReviewStatus || "all";
      render();
    });
  });

  const imageReviewStatus = app.querySelector("[data-image-review-status-select]");
  if (imageReviewStatus) {
    imageReviewStatus.addEventListener("change", (event) => {
      state.imageReviewStatus = event.target.value;
      render();
    });
  }

  app.querySelectorAll("[data-image-decision-key]").forEach((button) => {
    button.addEventListener("click", () => {
      setImageReviewDecision(button.dataset.imageDecisionKey, button.dataset.imageDecisionStatus);
      render();
    });
  });

  app.querySelectorAll("[data-image-picker-key]").forEach((button) => {
    button.addEventListener("click", async () => {
      state.imagePickerKey = button.dataset.imagePickerKey || "";
      state.imagePickerSearch = "";
      const seed = button.dataset.imagePickerCategorySeed || "all";
      state.imagePickerCategory = seed === "unmatched" ? "all" : seed;
      render();
      try {
        await loadImageLibrary();
      } catch (error) {
        console.error(error);
      }
      render();
    });
  });

  const imagePickerSearch = app.querySelector("[data-image-picker-search]");
  if (imagePickerSearch) {
    imagePickerSearch.addEventListener("input", (event) => {
      state.imagePickerSearch = event.target.value;
      render();
      const nextSearch = app.querySelector("[data-image-picker-search]");
      if (nextSearch) {
        nextSearch.focus();
        nextSearch.setSelectionRange(nextSearch.value.length, nextSearch.value.length);
      }
    });
  }

  const imagePickerCategory = app.querySelector("[data-image-picker-category]");
  if (imagePickerCategory) {
    imagePickerCategory.addEventListener("change", (event) => {
      state.imagePickerCategory = event.target.value;
      render();
    });
  }

  app.querySelectorAll("[data-image-pick-key]").forEach((button) => {
    button.addEventListener("click", () => {
      setImageReviewDecision(button.dataset.imagePickKey, "custom", {
        image: button.dataset.imagePickSrc,
        category: button.dataset.imagePickCategory
      });
      state.imagePickerKey = "";
      render();
    });
  });

  const imagePickerClose = app.querySelector("[data-image-picker-close]");
  if (imagePickerClose) {
    imagePickerClose.addEventListener("click", () => {
      state.imagePickerKey = "";
      render();
    });
  }
}

async function init() {
  try {
    applyTheme();
    const [response, imageResponse, optimizedResponse, bookResponse] = await Promise.all([
      fetch("assets/data/curriculum.json"),
      fetch("assets/data/topic-image-matches.json"),
      fetch("assets/images/optimized/nursing-uganda-optimized-image-manifest.json"),
      fetch("assets/data/book-library.json")
    ]);
    if (!response.ok) throw new Error(`We could not load the curriculum. Please refresh. (${response.status})`);
    state.data = await response.json();
    state.imageMatches = imageResponse.ok ? await imageResponse.json() : { matches: {} };
    state.optimizedImages = optimizedResponse.ok ? (await optimizedResponse.json()).images || {} : {};
    state.bookLibrary = bookResponse.ok ? await bookResponse.json() : bookLibrary();
    if (!window.location.hash) window.location.hash = "#/notes";
    render();
  } catch (error) {
    app.innerHTML = `<div class="loading-screen"><span class="brand-mark">NU</span><p>${escapeHtml(error.message)}</p></div>`;
  }
}

window.addEventListener("hashchange", () => {
  state.navOpen = false;
  render();
});

init();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("service-worker.js").catch(() => {});
  });
}
