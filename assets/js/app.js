const state = {
  data: null,
  imageMatches: null,
  bookLibrary: null,
  imageLibrary: null,
  medicalInstrumentLibrary: null,
  optimizedImages: {},
  navOpen: false,
  megaOpen: "",
  search: "",
  programmeFilter: "All",
  globalSearch: "",
  globalSearchCategory: "all",
  globalSearchType: "all",
  schoolSearch: "",
  schoolStatus: "all",
  schoolRegion: "all",
  schoolDistrict: "all",
  schoolSector: "all",
  schoolProgramme: "all",
  schoolView: localStorage.getItem("nursinguganda.schoolView") || "cards",
  selectedSchool: "",
  activeSchool: "",
  imageReviewSearch: "",
  imageReviewStatus: "strong",
  librarySearch: "",
  librarySubject: "all",
  resourceSearch: "",
  resourceFilter: "All",
  careerMode: "jobs",
  careerSearch: "",
  careerType: "All",
  careerLevel: "All",
  careerRegion: "All",
  careerSpeciality: "All",
  careerDeadline: "All",
  careerSort: "Newest",
  selectedCareerJob: "",
  savedCareerJobs: JSON.parse(localStorage.getItem("nursinguganda.savedCareerJobs") || "[]"),
  instrumentSearch: "",
  instrumentCategory: "all",
  dictionarySearch: "",
  dictionaryCategory: "All",
  dictionarySystem: "All Systems",
  dictionaryDifficulty: "All",
  dictionaryAbbreviationSort: "abbr",
  lightboxImage: "",
  lightboxAlt: "",
  imagePickerKey: "",
  imagePickerSearch: "",
  imagePickerCategory: "all",
  cookiePreferencesOpen: false,
  theme: "light",
  flashcardIndex: 0,
  flashcardFlipped: false,
  flashcardCategory: "All"
};

const app = document.querySelector("#app");

const routeMap = {
  notes: { label: "Notes", href: "/notes", icon: "bookOpen" },
  courses: { label: "Courses", href: "/courses", icon: "graduationCap" },
  resources: { label: "Resources", href: "/resources", icon: "folderOpen" },
  dictionary: { label: "Dictionary", href: "/dictionary", icon: "fileText" },
  careers: { label: "Careers", href: "/careers", icon: "briefcaseMedical" }
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
  building2: `<path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18"/><path d="M6 12H4a2 2 0 0 0-2 2v8h20v-8a2 2 0 0 0-2-2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/>`,
  calendar: `<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>`,
  chartBar: `<path d="M3 3v18h18"/><path d="M7 16V9"/><path d="M12 16V5"/><path d="M17 16v-4"/>`,
  chartLine: `<path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/>`,
  checkCircle: `<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/>`,
  chevronDown: `<path d="m6 9 6 6 6-6"/>`,
  clipboardList: `<rect width="8" height="4" x="8" y="2" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/>`,
  clock: `<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>`,
  download: `<path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/>`,
  externalLink: `<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>`,
  fileCv: `<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><circle cx="10" cy="13" r="2"/><path d="M8 18c.5-1.4 3.5-1.4 4 0"/><path d="M14 13h3"/><path d="M14 17h3"/>`,
  filter: `<path d="M22 3H2l8 9.46V19l4 2v-8.54Z"/>`,
  fileText: `<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>`,
  folderOpen: `<path d="m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6A2 2 0 0 1 18.46 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.9a2 2 0 0 1 1.69.9L13 6h7a2 2 0 0 1 2 2v2"/>`,
  graduationCap: `<path d="M21.42 10.92a1 1 0 0 0-.02-1.84l-8.57-3.9a2 2 0 0 0-1.66 0l-8.57 3.9a1 1 0 0 0 0 1.84l8.57 3.9a2 2 0 0 0 1.66 0Z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/>`,
  heartPulse: `<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3H21"/>`,
  helpCircle: `<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 1 1 5.82 1c0 2-3 2-3 4"/><path d="M12 17h.01"/>`,
  home: `<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/><path d="M9 22V12h6v10"/>`,
  layoutGrid: `<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>`,
  listChecks: `<path d="m3 17 2 2 4-4"/><path d="m3 7 2 2 4-4"/><path d="M13 6h8"/><path d="M13 12h8"/><path d="M13 18h8"/>`,
  mail: `<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-10 6L2 7"/>`,
  map: `<path d="M14.5 4.5 9.5 2 3 5v17l6.5-3 5 2.5 6.5-3v-17Z"/><path d="M9.5 2v17"/><path d="M14.5 4.5v17"/>`,
  mapPin: `<path d="M20 10c0 4.99-5.54 10.19-7.4 11.8a1 1 0 0 1-1.2 0C9.54 20.19 4 14.99 4 10a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>`,
  menu2: `<path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/>`,
  moon: `<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>`,
  pencil: `<path d="M12 20h9"/><path d="m16.5 3.5 4 4L7 21H3v-4Z"/>`,
  pill: `<path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/>`,
  phone: `<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.77.63 2.61a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.47-1.2a2 2 0 0 1 2.11-.45c.84.3 1.71.51 2.61.63A2 2 0 0 1 22 16.92Z"/>`,
  printer: `<path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 14h12v8H6z"/>`,
  rotateCcw: `<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>`,
  school: `<path d="m4 6 8-4 8 4"/><path d="m18 10 4 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8l4-2"/><path d="M14 22v-6a2 2 0 0 0-4 0v6"/><path d="M18 5v17"/><path d="M6 5v17"/><circle cx="12" cy="9" r="2"/>`,
  search: `<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>`,
  stethoscope: `<path d="M11 2v2"/><path d="M5 2v2"/><path d="M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1"/><path d="M8 15a6 6 0 0 0 12 0v-3"/><circle cx="20" cy="10" r="2"/>`,
  star: `<path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01Z"/>`,
  sun: `<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>`,
  syringe: `<path d="m18 2 4 4"/><path d="m17 7 3-3"/><path d="M19 9 8.7 19.3c-1 1-2.5 1-3.5 0l-.5-.5c-1-1-1-2.5 0-3.5L15 5"/><path d="m9 11 4 4"/><path d="m5 19-3 3"/><path d="m14 4 6 6"/>`,
  tool: `<path d="M14.7 6.3a4 4 0 0 0-5 5L3 18v3h3l6.7-6.7a4 4 0 0 0 5-5l-2.4 2.4-3-3Z"/>`,
  users: `<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>`,
  video: `<path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2"/>`,
  x: `<path d="M18 6 6 18"/><path d="m6 6 12 12"/>`,
  bell: `<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>`,
  flame: `<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3z"/>`,
  trophy: `<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>`,
  wifi: `<path d="M12 20h.01"/><path d="M2 8.82a15 15 0 0 1 20 0"/><path d="M5 12.859a10 10 0 0 1 14 0"/><path d="M8.5 16.429a5 5 0 0 1 7 0"/>`,
  heart: `<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>`,
  globe: `<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>`,
  banknote: `<rect width="20" height="12" x="2" y="6" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/>`,
  sparkles: `<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0Z"/><path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/>`,
  lightbulb: `<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>`,
  tag: `<path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42Z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/>`
};

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderInlineText(value) {
  return escapeHtml(value || "").replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
}

function currentRoute() {
  const path = window.location.pathname.replace(/^\//, "");
  return path ? path.split("/").filter(Boolean) : ["notes"];
}

function routeKey(parts = currentRoute()) {
  if (parts[0] === "courses") return "courses";
  if (parts[0] === "resources") return "resources";
  if (parts[0] === "dictionary") return "dictionary";
  if (parts[0] === "careers") return "careers";
  if (parts[0] === "progress") return "progress";
  if (parts[0] === "flashcards") return "flashcards";
  return "notes";
}

function setRoute(path) {
  const cleanPath = path.startsWith("#") ? path.slice(1) : path;
  history.pushState(null, "", cleanPath);
  state.navOpen = false;
  state.megaOpen = "";
  render();
  scrollPageToTop();
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

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

function scrollPageToTop() {
  requestAnimationFrame(() => window.scrollTo({ top: 0, left: 0, behavior: "auto" }));
}

const COOKIE_CONSENT_KEY = "nursinguganda.cookieConsent";
const COOKIE_CONSENT_VERSION = "2026-05-09";
const monetizationOverrides = window.NURSING_UGANDA_MONETIZATION || {};
const monetizationSettings = {
  googleAnalyticsId: monetizationOverrides.googleAnalyticsId || "",
  adsenseClient: monetizationOverrides.adsenseClient || "",
  adSlots: {
    lessonIntro: monetizationOverrides.lessonIntroSlot || "",
    lessonMiddle: monetizationOverrides.lessonMiddleSlot || "",
    resourcesInline: monetizationOverrides.resourcesInlineSlot || "",
    footer: monetizationOverrides.footerSlot || ""
  },
  affiliateDisclosure: "Nursing Uganda may earn a commission when visitors use some partner or affiliate links. This does not change the revision guidance shown to students."
};

function defaultCookieConsent() {
  return {
    necessary: true,
    analytics: false,
    ads: false,
    affiliates: false,
    version: COOKIE_CONSENT_VERSION,
    updatedAt: ""
  };
}

function storedCookieConsent() {
  try {
    const raw = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!raw) return null;
    return { ...defaultCookieConsent(), ...JSON.parse(raw) };
  } catch (error) {
    return null;
  }
}

function hasCookieDecision() {
  return Boolean(storedCookieConsent());
}

function saveCookieConsent(consent) {
  const next = {
    ...defaultCookieConsent(),
    ...consent,
    necessary: true,
    version: COOKIE_CONSENT_VERSION,
    updatedAt: new Date().toISOString()
  };
  localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(next));
  state.cookiePreferencesOpen = false;
  setupMonetization();
}

function consentAllows(type) {
  const consent = storedCookieConsent();
  return Boolean(consent && consent[type]);
}

function configuredValue(value) {
  return typeof value === "string" && value.trim() && !/^(G-|ca-pub-)?X+$/i.test(value.trim());
}

function loadExternalScript(id, src, options = {}) {
  if (document.getElementById(id)) return;
  const script = document.createElement("script");
  script.id = id;
  script.src = src;
  script.async = true;
  Object.entries(options).forEach(([key, value]) => {
    if (value !== undefined && value !== null) script.setAttribute(key, value);
  });
  document.head.appendChild(script);
}

function setupMonetization() {
  if (consentAllows("analytics") && configuredValue(monetizationSettings.googleAnalyticsId)) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function gtag() { window.dataLayer.push(arguments); };
    loadExternalScript("nursing-uganda-google-analytics", `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(monetizationSettings.googleAnalyticsId)}`);
    window.gtag("js", new Date());
    window.gtag("config", monetizationSettings.googleAnalyticsId, { anonymize_ip: true });
  }

  if (consentAllows("ads") && configuredValue(monetizationSettings.adsenseClient)) {
    loadExternalScript(
      "nursing-uganda-adsense",
      `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(monetizationSettings.adsenseClient)}`,
      { crossorigin: "anonymous" }
    );
  }
}

function hydrateAdSlots() {
  if (!consentAllows("ads") || !configuredValue(monetizationSettings.adsenseClient)) return;
  if (!window.adsbygoogle) return;
  app.querySelectorAll(".adsbygoogle[data-ad-ready='false']").forEach((slot) => {
    try {
      window.adsbygoogle.push({});
      slot.dataset.adReady = "true";
    } catch (error) {
      slot.dataset.adReady = "error";
    }
  });
}

function renderAdSlot(slotKey, label = "Advertisement") {
  const slotId = monetizationSettings.adSlots && monetizationSettings.adSlots[slotKey];
  if (!configuredValue(monetizationSettings.adsenseClient) || !configuredValue(slotId)) return "";
  return `
    <aside class="ad-slot-panel" aria-label="${escapeHtml(label)}">
      <span>Advertisement</span>
      <ins class="adsbygoogle"
        data-ad-ready="false"
        data-ad-client="${escapeHtml(monetizationSettings.adsenseClient)}"
        data-ad-slot="${escapeHtml(slotId)}"
        data-ad-format="auto"
        data-full-width-responsive="true"></ins>
    </aside>
  `;
}

function renderStudyDisclaimer(context = "lesson") {
  const label = context === "resource" ? "Resource Reminder" : "Revision Reminder";
  return `
    <aside class="study-disclaimer-panel">
      ${icon("badgeCheck")}
      <div>
        <strong>${label}</strong>
        <p>Nursing Uganda supports revision and peer-to-peer learning only. Confirm important details with formal student notes, tutors, approved textbooks, clinical supervisors and current facility guidance.</p>
      </div>
    </aside>
  `;
}

function renderAffiliateDisclosure(short = false) {
  return `
    <aside class="affiliate-disclosure">
      ${icon("externalLink")}
      <span>${escapeHtml(short ? "External or affiliate link: we may earn a commission where a partner link is disclosed." : monetizationSettings.affiliateDisclosure)}</span>
    </aside>
  `;
}

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

const generatedLessonCache = new Map();

function fallbackLessonKey(programme, unit, topic) {
  return [
    programme && programme.id ? programme.id : "programme",
    unit && unit.id ? unit.id : "unit",
    topic && topic.groupIndex !== undefined ? topic.groupIndex : "group",
    topic && topic.topicIndex !== undefined ? topic.topicIndex : "topic",
    topic && topic.title ? topic.title : "untitled"
  ].join("::");
}

function buildFallbackLesson(programme, unit, topic) {
  if (!programme || !unit || !topic) return null;
  const cacheKey = fallbackLessonKey(programme, unit, topic);
  if (generatedLessonCache.has(cacheKey)) return generatedLessonCache.get(cacheKey);

  const topicTitle = topic.title || "Topic";
  const unitLabel = `${unit.code ? `${unit.code}: ` : ""}${unit.title}`;
  const context = `${programme.label} - ${unitLabel}`;
  const lower = topicTitle.toLowerCase();
  const isEmergency = /(first aid|emerg|shock|bleed|trauma|resusc|burn|poison|collapse|unconscious)/i.test(lower);
  const isMaternal = /(pregnan|labou?r|antenatal|postnatal|midwif|newborn|neonat)/i.test(lower);
  const isInfection = /(infection|communicable|malaria|tb|hiv|sepsis|immuni|sterile|aseptic)/i.test(lower);

  const alertFocus = isEmergency
    ? "prioritize scene safety, airway, breathing and circulation before detailed interventions"
    : isMaternal
      ? "monitor maternal and fetal wellbeing, identify danger signs early and escalate promptly"
      : isInfection
        ? "apply infection prevention measures consistently and recognize red flags early"
        : "assess systematically, document findings and escalate concerns early";

  const sections = [
    {
      title: "Study Focus",
      blocks: [
        { type: "bullet", text: `Define key terms used in ${topicTitle.toLowerCase()}.` },
        { type: "bullet", text: `Describe the core nursing principles linked to ${topicTitle.toLowerCase()}.` },
        { type: "bullet", text: `Apply safe and ethical nursing actions in this area of practice.` }
      ]
    },
    {
      title: "Core Notes",
      blocks: [
        { type: "paragraph", text: `${topicTitle} is studied in ${context} to strengthen clinical reasoning, safe practice and patient-centered care.` },
        { type: "paragraph", text: `When reviewing this topic, ${alertFocus}. Always relate theory to bedside assessment and local protocol requirements.` },
        { type: "bullet", text: "Use structured assessment: history, observation, focused examination and nursing interpretation." },
        { type: "bullet", text: "Link findings to likely causes, patient risk level and immediate nursing priorities." },
        { type: "bullet", text: "Document interventions clearly and evaluate response after each action." }
      ]
    },
    {
      title: "Nursing Assessment Focus",
      blocks: [
        { type: "bullet", text: "Identify presenting complaints, onset, duration and associated symptoms." },
        { type: "bullet", text: "Record baseline vital signs and repeat according to patient acuity." },
        { type: "bullet", text: "Assess risk factors, comorbidities, medication history and allergies." },
        { type: "bullet", text: "Recognize danger signs requiring urgent review or referral." }
      ]
    },
    {
      title: "Nursing Interventions And Safety",
      blocks: [
        { type: "bullet", text: "Prioritize interventions according to urgency and available resources." },
        { type: "bullet", text: "Apply infection prevention and control throughout all procedures." },
        { type: "bullet", text: "Provide clear patient and caregiver explanations before and after care." },
        { type: "bullet", text: "Escalate deterioration immediately and hand over using a structured format." }
      ]
    },
    {
      title: "Study Wrap",
      blocks: [
        { type: "bullet", text: `Summarize ${topicTitle.toLowerCase()} using the key terms, patient risks and expected nursing actions.` },
        { type: "bullet", text: "Revise the priority assessments, danger signs and escalation points." },
        { type: "bullet", text: "Connect the notes to safe documentation, patient education and evaluation of outcomes." }
      ]
    },
    {
      title: "Reference",
      blocks: [
        { type: "paragraph", text: "Nursing Uganda structured lesson notes. Cross-check with current tutor guidance, facility protocols and national professional standards." }
      ]
    }
  ];

  const lesson = {
    title: topicTitle,
    excerpt: `Structured study notes for ${topicTitle.toLowerCase()} in ${unitLabel}.`,
    generated: true,
    sections
  };
  generatedLessonCache.set(cacheKey, lesson);
  return lesson;
}

function lessonForTopic(programme, unit, topic) {
  const override = anatomyPhysiologyLessonOverride(programme, unit, topic);
  if (override) return override;

  const canonicalSourceSlug = anatomyPhysiologyCanonicalSourceSlug(programme, unit, topic);
  const sourceTopic = canonicalSourceSlug ? { ...topic, sourceSlug: canonicalSourceSlug } : topic;
  return lessonFor(sourceTopic) || buildFallbackLesson(programme, unit, { ...sourceTopic, title: lmsLessonTitle(programme, unit, topic) });
}

function anatomyPhysiologyCanonicalLessonIndex(programme, unit, topic) {
  const topicTitle = String(topic && topic.title ? topic.title : "").toLowerCase();
  const displayTitle = String(lmsLessonTitle(programme, unit, topic)).toLowerCase();
  const moduleText = `${unit && unit.id ? unit.id : ""} ${unit && unit.title ? unit.title : ""} ${topic && topic.groupTitle ? topic.groupTitle : ""}`.toLowerCase();
  const isAnatomyUnit = /anatomy/.test(moduleText) && /physiology/.test(moduleText);
  if (!isAnatomyUnit) return -1;
  if (/terms/.test(topicTitle) || /terms used in anatomy/.test(displayTitle)) return 0;
  if (/human body organi[sz]ation/.test(topicTitle) || /human body organi[sz]ation/.test(displayTitle)) return 1;
  if (/body fluids|transport|homeostasis/.test(topicTitle) || /body fluids|transport|homeostasis/.test(displayTitle)) return 2;
  return -1;
}

function anatomyPhysiologyCanonicalSourceSlug(programme, unit, topic) {
  const index = anatomyPhysiologyCanonicalLessonIndex(programme, unit, topic);
  if (index === 0) return "terms-used-in-anatomy-and-physiology";
  if (index === 1) return "human-body-organization";
  if (index === 2) return "bodys-environments-homeostasis-and-transport";
  return "";
}

function anatomyPhysiologyLessonOverride(programme, unit, topic) {
  const index = anatomyPhysiologyCanonicalLessonIndex(programme, unit, topic);
  if (index < 0) return null;
  return [
    {
      title: "Terms Used in Anatomy and Physiology",
      excerpt: "Learn the professional language used to describe body structure, body function, position, direction, planes, regions, cavities, homeostasis, health and disease.",
      practiceFrame: {
        lens: "Anatomy language lens",
        definition: "Terms used in anatomy and physiology give nurses a shared, accurate language for describing the body. They help the learner document positions, directions, planes, regions, cavities and basic body functions without ambiguity.",
        assessment: ["Use anatomical position as the starting point before describing a finding", "Describe the exact body region, side, plane or direction involved", "Connect terms such as homeostasis, pathology and pathophysiology to patient changes"],
        priorities: ["Use standard terms in notes and handover", "Avoid vague descriptions such as above, below or near without a body reference point", "Escalate abnormal findings using clear anatomical and physiological language"]
      },
      sections: [
        { title: "Learning Objectives", blocks: [
          { type: "bullet", text: "Define anatomy, physiology, pathology, pathophysiology and homeostasis." },
          { type: "bullet", text: "Use anatomical position, directional terms, body planes and body regions correctly." },
          { type: "bullet", text: "Explain why standard anatomical language improves nursing assessment and documentation." },
          { type: "bullet", text: "Apply basic anatomy and physiology terms during observation, handover and patient education." }
        ] },
        { title: "Anatomy and Physiology as Partner Sciences", blocks: [
          { type: "paragraph", text: "Anatomy: the study of the structure of the body and the relationship between its parts. In nursing, anatomy helps you locate organs, recognize normal landmarks and describe exactly where a problem is found." },
          { type: "paragraph", text: "Physiology: the study of how body parts work. Physiology explains processes such as breathing, circulation, digestion, nerve transmission, muscle contraction, temperature control and fluid balance." },
          { type: "paragraph", text: "Structure and function should be studied together. A nurse who understands the structure of the lungs can better understand breathing difficulty; a nurse who understands blood vessels can better interpret bleeding, shock and pulse changes." }
        ] },
        { title: "Core Professional Terms", blocks: [
          { type: "paragraph", text: "Pathology: the study of disease and the structural or functional changes caused by disease." },
          { type: "paragraph", text: "Pathophysiology: the study of how disease changes normal body function. It links anatomy, physiology and clinical signs." },
          { type: "paragraph", text: "Homeostasis: the ability of the body to keep the internal environment relatively stable despite changes inside or outside the body." },
          { type: "paragraph", text: "Health: a state in which body systems function well enough to support physical, mental and social wellbeing." },
          { type: "paragraph", text: "Disease: a disturbance of normal body structure or function that may produce signs, symptoms or reduced ability to function." }
        ] },
        { title: "Anatomical Position", blocks: [
          { type: "paragraph", text: "Anatomical position is the standard reference position used when describing the body. The person stands upright, faces forward, keeps the feet together or slightly apart, holds the arms at the sides and turns the palms forward." },
          { type: "paragraph", text: "This position prevents confusion. For example, the thumb is lateral to the little finger in anatomical position even if a patient's hand is turned during an examination." },
          { type: "paragraph", text: "When documenting injuries, pain, swelling, wounds or movement, first think from anatomical position, then describe the finding using standard directional language." }
        ] },
        { title: "Directional Terms", blocks: [
          { type: "paragraph", text: "Superior: toward the head or upper part of the body. The chest is superior to the abdomen." },
          { type: "paragraph", text: "Inferior: toward the feet or lower part of the body. The knee is inferior to the hip." },
          { type: "paragraph", text: "Anterior: toward the front of the body. The sternum is anterior to the heart." },
          { type: "paragraph", text: "Posterior: toward the back of the body. The spine is posterior to the abdominal organs." },
          { type: "paragraph", text: "Medial: nearer to the midline of the body. The nose is medial to the eyes." },
          { type: "paragraph", text: "Lateral: farther from the midline. The ears are lateral to the nose." },
          { type: "paragraph", text: "Proximal: nearer to the point of attachment or origin. The elbow is proximal to the wrist." },
          { type: "paragraph", text: "Distal: farther from the point of attachment or origin. The fingers are distal to the wrist." },
          { type: "paragraph", text: "Superficial: near the body surface. Deep: farther away from the body surface." }
        ] },
        { title: "Planes, Sections and Body Cavities", blocks: [
          { type: "paragraph", text: "Sagittal plane: divides the body into right and left parts. A midsagittal plane divides the body into equal right and left halves." },
          { type: "paragraph", text: "Frontal or coronal plane: divides the body into anterior and posterior parts." },
          { type: "paragraph", text: "Transverse plane: divides the body into superior and inferior parts. It is also called a horizontal or axial plane." },
          { type: "paragraph", text: "Oblique plane: cuts the body at an angle and is often used in imaging descriptions." },
          { type: "paragraph", text: "Body cavities: spaces that contain and protect organs. Major cavities include the cranial cavity, vertebral cavity, thoracic cavity, abdominal cavity and pelvic cavity." }
        ] },
        { title: "Nursing Application", blocks: [
          { type: "bullet", text: "Document wounds, swelling and pain using precise body regions and directions." },
          { type: "bullet", text: "Use anatomical position when explaining limb movements or injury sites." },
          { type: "bullet", text: "Link physiology terms to vital signs, patient complaints and clinical deterioration." },
          { type: "bullet", text: "Use clear terms during handover so the next nurse can understand the finding quickly." }
        ] },
        { title: "Study Wrap", blocks: [
          { type: "bullet", text: "Revise anatomy and physiology as paired subjects: structure first, function second." },
          { type: "bullet", text: "Practice anatomical position, directional terms and body planes using patient examples." },
          { type: "bullet", text: "Use precise language when describing wounds, pain, swelling or injury sites." },
          { type: "bullet", text: "Connect homeostasis to vital signs and early recognition of deterioration." }
        ] },
        { title: "References", blocks: [
          { type: "paragraph", text: "Adapted into original Nursing Uganda study notes from local Nurses Revision anatomy and physiology material, with terminology aligned to standard nursing anatomy language." }
        ] }
      ]
    },
    {
      title: "Human Body Organization",
      excerpt: "Study how the human body is organized from atoms and cells to tissues, organs, organ systems and the complete human organism.",
      practiceFrame: {
        lens: "Body organization lens",
        definition: "Human body organization explains how small living and chemical units combine to form tissues, organs, organ systems and the whole person. Nurses use this framework to connect microscopic changes to visible patient signs.",
        assessment: ["Relate symptoms to the level affected: cell, tissue, organ or system", "Observe how one system problem may affect another system", "Use organized assessment to move from general appearance to focused body systems"],
        priorities: ["Assess the whole patient, not only one organ", "Recognize early signs that homeostasis is failing", "Document findings in a logical body-system order"]
      },
      sections: [
        { title: "Learning Objectives", blocks: [
          { type: "bullet", text: "Identify the levels of body organization from chemical level to organism level." },
          { type: "bullet", text: "Describe the main tissue types and their basic functions." },
          { type: "bullet", text: "Explain how organs and organ systems work together to maintain life." },
          { type: "bullet", text: "Apply body organization to nursing assessment and clinical reasoning." }
        ] },
        { title: "Introduction", blocks: [
          { type: "paragraph", text: "The human body is not a random collection of parts. It is organized in levels, with each level building on the one before it. Atoms combine to form molecules, molecules support cells, cells form tissues, tissues form organs, organs work in systems and systems support the whole person." },
          { type: "paragraph", text: "This organization helps nurses reason from a symptom to a possible body level involved. For example, dehydration affects body fluids and cells, but the patient may present with dry mucous membranes, fast pulse, reduced urine output and weakness." }
        ] },
        { title: "Chemical Level", blocks: [
          { type: "paragraph", text: "Chemical level: the simplest level of body organization. It includes atoms, ions, molecules and compounds that form body structures and support body processes." },
          { type: "paragraph", text: "Important examples include water, oxygen, carbon dioxide, glucose, proteins, lipids, electrolytes and nucleic acids. These substances are essential for energy production, fluid balance, growth and repair." },
          { type: "paragraph", text: "A change at the chemical level can affect the whole patient. Low oxygen, abnormal glucose or electrolyte imbalance may quickly alter consciousness, pulse, breathing, muscle function or heart rhythm." }
        ] },
        { title: "Cellular Level", blocks: [
          { type: "paragraph", text: "Cell: the basic living unit of the body. Cells carry out life processes such as metabolism, growth, response to stimuli, repair and reproduction." },
          { type: "paragraph", text: "Different cells are specialized for different roles. Red blood cells transport oxygen, nerve cells transmit impulses, muscle cells contract and epithelial cells protect body surfaces." },
          { type: "paragraph", text: "When cells do not receive enough oxygen, nutrients or fluid, tissue function becomes impaired. This is why nurses monitor circulation, hydration, oxygen saturation, temperature and blood glucose where relevant." }
        ] },
        { title: "Tissue Level", blocks: [
          { type: "paragraph", text: "Tissue: a group of similar cells working together to perform a specific function. The body has four basic tissue types: epithelial, connective, muscle and nervous tissue." },
          { type: "paragraph", text: "Epithelial tissue covers surfaces, lines cavities and forms glands. It protects the body, absorbs substances, secretes fluids and helps with filtration." },
          { type: "paragraph", text: "Connective tissue supports, binds, protects and transports. Examples include bone, cartilage, fat, blood and loose connective tissue." },
          { type: "paragraph", text: "Muscle tissue contracts to produce movement. Skeletal muscle moves the body, cardiac muscle pumps blood and smooth muscle moves substances through organs such as the intestines and blood vessels." },
          { type: "paragraph", text: "Nervous tissue detects changes, processes information and sends impulses. It allows coordination, sensation, movement and response to the environment." }
        ] },
        { title: "Organ Level", blocks: [
          { type: "paragraph", text: "Organ: a structure made of two or more tissue types working together for a specific function. The heart, lungs, kidneys, stomach, skin and brain are examples of organs." },
          { type: "paragraph", text: "An organ contains different tissues arranged to support its function. For example, the stomach has epithelial tissue for lining and secretion, muscle tissue for mixing food, nervous tissue for control and connective tissue for support." },
          { type: "paragraph", text: "Nursing assessment often focuses on organ function: breath sounds for lungs, heart rate and pulse for the heart, urine output for kidneys, bowel sounds for intestines and level of consciousness for brain function." }
        ] },
        { title: "Organ System Level", blocks: [
          { type: "paragraph", text: "Organ system: a group of organs working together to perform major body functions. Examples include the respiratory, cardiovascular, digestive, urinary, nervous, endocrine, musculoskeletal, integumentary, lymphatic, reproductive and immune systems." },
          { type: "paragraph", text: "No system works alone. The respiratory system brings in oxygen, the cardiovascular system transports it, cells use it for energy and the urinary and respiratory systems help remove wastes." },
          { type: "paragraph", text: "A problem in one system can affect many others. Severe bleeding may reduce circulation, oxygen delivery, urine output and level of consciousness." }
        ] },
        { title: "Organism Level and Homeostasis", blocks: [
          { type: "paragraph", text: "Organism level: the complete human being, where all body systems work together to maintain life." },
          { type: "paragraph", text: "Homeostasis is the body maintaining a stable internal environment. Temperature, blood glucose, blood pressure, pH, oxygen levels and fluid balance are kept within ranges that allow cells to function." },
          { type: "paragraph", text: "Nurses support homeostasis by monitoring vital signs, fluid intake and output, pain, consciousness, nutrition, elimination, mobility, infection risk and response to treatment." }
        ] },
        { title: "Nursing Assessment Focus", blocks: [
          { type: "bullet", text: "Begin with general appearance, airway, breathing, circulation and level of consciousness." },
          { type: "bullet", text: "Relate symptoms to possible tissues, organs or systems involved." },
          { type: "bullet", text: "Monitor trends in vital signs instead of relying on one reading." },
          { type: "bullet", text: "Record findings clearly using body system headings where appropriate." }
        ] },
        { title: "Study Wrap", blocks: [
          { type: "bullet", text: "Revise the levels of body organization from chemical level to whole person." },
          { type: "bullet", text: "Link the four basic tissue types to organs, organ systems and patient assessment." },
          { type: "bullet", text: "Use homeostasis and vital signs to explain how body systems work together." }
        ] },
        { title: "References", blocks: [
          { type: "paragraph", text: "Adapted into original Nursing Uganda study notes from local Nurses Revision anatomy introduction material and standard anatomy and physiology teaching structure." }
        ] }
      ]
    },
    {
      title: "Body Fluids, Transport and Homeostasis",
      excerpt: "Understand internal and external environments, fluid compartments, transport processes and how feedback mechanisms keep body conditions stable.",
      practiceFrame: {
        lens: "Fluid balance lens",
        definition: "Body fluids, transport and homeostasis explain how water, electrolytes and dissolved substances move within the body and how control systems keep the internal environment stable.",
        assessment: ["Check hydration, mucous membranes, urine output, skin turgor and vital signs", "Look for signs of fluid overload, dehydration, shock or electrolyte disturbance", "Relate abnormal findings to possible failure of homeostasis"],
        priorities: ["Monitor intake and output accurately", "Escalate severe dehydration, altered consciousness, shock signs or respiratory distress", "Teach patients fluid, nutrition and medicine instructions in practical language"]
      },
      sections: [
        { title: "Learning Objectives", blocks: [
          { type: "bullet", text: "Differentiate the body's external and internal environments." },
          { type: "bullet", text: "Describe intracellular and extracellular fluid compartments." },
          { type: "bullet", text: "Explain diffusion, osmosis, facilitated diffusion and active transport." },
          { type: "bullet", text: "Apply homeostasis and feedback control to nursing assessment." }
        ] },
        { title: "Introduction", blocks: [
          { type: "paragraph", text: "Cells live in a carefully controlled internal environment. Even when the outside environment changes, the body must keep water, electrolytes, oxygen, nutrients, temperature and waste products within safe limits." },
          { type: "paragraph", text: "For nurses, body fluids and homeostasis are practical bedside concepts. They explain why observations such as blood pressure, pulse, temperature, urine output, skin condition, respiratory pattern and level of consciousness are so important." }
        ] },
        { title: "External and Internal Environments", blocks: [
          { type: "paragraph", text: "External environment: the surroundings outside the body, including air, temperature, microorganisms, food, water, medicines, chemicals and injuries." },
          { type: "paragraph", text: "Internal environment: the fluid environment around body cells. It supplies oxygen and nutrients and removes wastes so that cells can function." },
          { type: "paragraph", text: "The skin, mucous membranes, lungs, digestive tract, kidneys and immune defenses help protect the internal environment from harmful external changes." }
        ] },
        { title: "Body Fluid Compartments", blocks: [
          { type: "paragraph", text: "Intracellular fluid: fluid inside the cells. It contains many dissolved substances needed for cell metabolism and is rich in potassium compared with extracellular fluid." },
          { type: "paragraph", text: "Extracellular fluid: fluid outside the cells. It includes interstitial fluid around cells, plasma in blood vessels, lymph and special fluids such as cerebrospinal fluid." },
          { type: "paragraph", text: "Extracellular fluid is especially important in nursing because changes can be seen through edema, dehydration, blood pressure changes, pulse changes and urine output." }
        ] },
        { title: "Transport Processes", blocks: [
          { type: "paragraph", text: "Diffusion: movement of particles from an area of higher concentration to an area of lower concentration. Oxygen and carbon dioxide move by diffusion during gas exchange." },
          { type: "paragraph", text: "Facilitated diffusion: movement across a membrane with help from a carrier or channel protein, without direct energy use." },
          { type: "paragraph", text: "Osmosis: movement of water across a selectively permeable membrane from a more dilute solution toward a more concentrated solution." },
          { type: "paragraph", text: "Active transport: movement of substances across a membrane using energy. This is important when the body needs to move substances against a concentration gradient." }
        ] },
        { title: "Homeostasis and Feedback", blocks: [
          { type: "paragraph", text: "Homeostasis depends on receptors, a control center and effectors. Receptors detect change, the control center interprets the information and effectors produce a response." },
          { type: "paragraph", text: "Negative feedback reverses a change and brings the body back toward normal. Temperature regulation and blood glucose control are common examples." },
          { type: "paragraph", text: "Positive feedback strengthens a process until a specific event is completed. It is less common, but examples include blood clotting and uterine contractions during labour." },
          { type: "paragraph", text: "Homeostatic imbalance occurs when control systems fail or are overwhelmed. Infection, bleeding, dehydration, severe pain, shock and uncontrolled diabetes can all disturb homeostasis." }
        ] },
        { title: "Nursing Assessment Focus", blocks: [
          { type: "bullet", text: "Measure and trend vital signs." },
          { type: "bullet", text: "Observe skin, mucous membranes, edema, thirst and urine output." },
          { type: "bullet", text: "Record intake and output when fluid balance is a concern." },
          { type: "bullet", text: "Report abnormal pulse, low blood pressure, confusion, reduced urine output or signs of shock promptly." }
        ] },
        { title: "Study Wrap", blocks: [
          { type: "bullet", text: "Compare intracellular and extracellular fluid as nursing assessment concepts." },
          { type: "bullet", text: "Connect osmosis, feedback loops and homeostasis to common bedside findings." },
          { type: "bullet", text: "Revise the visible signs of dehydration, fluid overload and shock." }
        ] },
        { title: "References", blocks: [
          { type: "paragraph", text: "Adapted into original Nursing Uganda study notes from local Nurses Revision material on the body's environments, transport and homeostasis." }
        ] }
      ]
    }
  ][index] || null;
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

function topicSearchText(programme, unit, topic, lesson = null) {
  return [
    programme && programme.label,
    unit && unit.code,
    unit && unit.title,
    topic && topic.groupTitle,
    topic && topic.title,
    lesson && lesson.title,
    lesson && lesson.excerpt
  ].filter(Boolean).join(" ");
}

function wordsForMatch(value) {
  const stop = new Set(["about", "after", "and", "care", "course", "from", "health", "into", "lesson", "medical", "nurse", "nurses", "nursing", "patient", "study", "that", "the", "this", "topic", "unit", "with"]);
  return String(value || "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .split(" ")
    .filter((word) => word.length > 3 && !stop.has(word));
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
    title: topic.title,
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
  const available = topics.filter((topic) => lessonForTopic(programme, unit, topic)).length;
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

function normalizeSearchValue(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function searchTokens(value) {
  return normalizeSearchValue(value).split(" ").filter((token) => token.length > 1);
}

function withinEditDistance(a, b, limit) {
  if (!a || !b) return false;
  if (Math.abs(a.length - b.length) > limit) return false;
  if (a === b) return true;

  let previous = Array.from({ length: b.length + 1 }, (_, index) => index);
  for (let i = 1; i <= a.length; i += 1) {
    const current = [i];
    let rowBest = current[0];
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      current[j] = Math.min(
        previous[j] + 1,
        current[j - 1] + 1,
        previous[j - 1] + cost
      );
      rowBest = Math.min(rowBest, current[j]);
    }
    if (rowBest > limit) return false;
    previous = current;
  }
  return previous[b.length] <= limit;
}

function tokenMatchesSearchWord(queryToken, word) {
  if (word.includes(queryToken) || queryToken.includes(word)) return true;
  if (queryToken.length < 5 || word.length < 5) return false;
  const limit = queryToken.length > 8 || word.length > 8 ? 2 : 1;
  return withinEditDistance(queryToken, word, limit);
}

function textMatchesSearchQuery(text, query) {
  const normalizedText = normalizeSearchValue(text);
  const normalizedQuery = normalizeSearchValue(query);
  if (!normalizedQuery) return true;
  if (normalizedText.includes(normalizedQuery)) return true;
  const queryTokens = searchTokens(normalizedQuery);
  if (!queryTokens.length) return true;
  const words = [...new Set(searchTokens(normalizedText).slice(0, 360))];
  return queryTokens.every((token) => words.some((word) => tokenMatchesSearchWord(token, word)));
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
    },
    {
      name: "Kabale School of Enrolled Comprehensive Nursing",
      district: "Kabale",
      sector: "Government",
      programmes: ["Diploma Comprehensive Nursing", "Diploma Midwifery", "Certificate Enrolled Comprehensive Nursing"],
      verification: "Confirm with UNMC and the school before applying",
      status: "Full Registration",
      note: "Government school listed with Kabale Regional Referral Hospital as training facility."
    },
    {
      name: "Lira School of Comprehensive Nursing",
      district: "Lira",
      sector: "Government",
      programmes: ["Diploma Comprehensive Nursing", "Diploma Midwifery", "Certificate Enrolled Comprehensive Nursing"],
      verification: "Confirm with UNMC and the school before applying",
      status: "Full Registration",
      note: "Government comprehensive nursing and midwifery pathway in northern Uganda."
    },
    {
      name: "Masaka School of Comprehensive Nursing",
      district: "Masaka",
      sector: "Government",
      programmes: ["Diploma Nursing", "Diploma Midwifery", "Diploma Comprehensive Nursing"],
      verification: "Confirm with UNMC and the school before applying",
      status: "Full Registration",
      note: "Listed with Masaka Regional Referral Hospital as training facility."
    },
    {
      name: "Soroti School of Comprehensive Nursing",
      district: "Soroti",
      sector: "Government",
      programmes: ["Diploma Comprehensive Nursing"],
      verification: "Confirm with UNMC and the school before applying",
      status: "Full Registration",
      note: "Government comprehensive nursing school in eastern Uganda."
    },
    {
      name: "Bugongi College of Nursing and Midwifery",
      district: "Sheema",
      sector: "Faith Based",
      programmes: ["Certificate Nursing", "Certificate Midwifery"],
      verification: "Confirm with UNMC and the school before applying",
      status: "Provisional License",
      note: "Faith-based certificate nursing and midwifery option; verify status before application."
    },
    {
      name: "Fort Portal International Nurses Training School",
      district: "Fort Portal",
      sector: "Faith Based",
      programmes: ["Diploma Nursing", "Diploma Midwifery", "Certificate Nursing", "Certificate Midwifery"],
      verification: "Confirm with UNMC and the school before applying",
      status: "Full Registration",
      note: "Listed with Fort Portal Regional Referral Hospital as training facility."
    },
    {
      name: "Ibanda School of Nursing and Midwifery",
      district: "Ibanda",
      sector: "Faith Based",
      programmes: ["Diploma Nursing", "Diploma Midwifery", "Certificate Midwifery", "Certificate Enrolled Comprehensive Nursing"],
      verification: "Confirm with UNMC and the school before applying",
      status: "Full Registration",
      note: "Offers nursing, midwifery and enrolled comprehensive nursing routes."
    },
    {
      name: "Ishaka Adventist School of Nursing",
      district: "Bushenyi",
      sector: "Faith Based",
      programmes: ["Certificate Nursing", "Certificate Midwifery"],
      verification: "Confirm with UNMC and the school before applying",
      status: "Full Registration",
      note: "Faith-based certificate route attached to Ishaka Hospital."
    },
    {
      name: "Kagando School of Nursing and Midwifery",
      district: "Kasese",
      sector: "Faith Based",
      programmes: ["Diploma Nursing", "Diploma Midwifery", "Certificate Midwifery"],
      verification: "Confirm with UNMC and the school before applying",
      status: "Full Registration",
      note: "Faith-based western Uganda nursing and midwifery school."
    },
    {
      name: "Kalongo School of Nursing and Midwifery",
      district: "Pader",
      sector: "Faith Based",
      programmes: ["Diploma Midwifery", "Certificate Midwifery", "Certificate Comprehensive Nursing"],
      verification: "Confirm with UNMC and the school before applying",
      status: "Full Registration",
      note: "Listed with Kalongo Hospital as training facility."
    },
    {
      name: "Kalungi School of Nursing and Midwifery",
      district: "Kalungu",
      sector: "Faith Based",
      programmes: ["Certificate Nursing", "Certificate Midwifery"],
      verification: "Confirm with UNMC and the school before applying",
      status: "Full Registration",
      note: "Certificate nursing and midwifery option in Kalungu."
    },
    {
      name: "Kamuli School of Nursing and Midwifery",
      district: "Kamuli",
      sector: "Faith Based",
      programmes: ["Certificate Nursing", "Certificate Midwifery", "Diploma Midwifery"],
      verification: "Confirm with UNMC and the school before applying",
      status: "Full Registration",
      note: "Faith-based school listed with Kamuli Hospital."
    },
    {
      name: "Kibuli School of Nursing and Midwifery",
      district: "Kampala",
      sector: "Faith Based",
      programmes: ["Certificate Comprehensive Nursing", "Diploma Midwifery", "Certificate Nursing"],
      verification: "Confirm with UNMC and the school before applying",
      status: "Full Registration",
      note: "Kampala faith-based route for nursing and midwifery students."
    },
    {
      name: "Kisiizi School of Nursing",
      district: "Rukungiri",
      sector: "Faith Based",
      programmes: ["Certificate Comprehensive Nursing", "Certificate Nursing"],
      verification: "Confirm with UNMC and the school before applying",
      status: "Full Registration",
      note: "Faith-based nursing school linked to Kisiizi Hospital."
    },
    {
      name: "Kiwoko School of Nursing",
      district: "Nakaseke",
      sector: "Faith Based",
      programmes: ["Diploma Midwifery", "Certificate Comprehensive Nursing"],
      verification: "Confirm with UNMC and the school before applying",
      status: "Full Registration",
      note: "Central Uganda school listed with Kiwoko Hospital."
    },
    {
      name: "Kuluva School of Nursing and Midwifery",
      district: "Arua",
      sector: "Faith Based",
      programmes: ["Diploma Nursing", "Certificate Comprehensive Nursing", "Certificate Midwifery"],
      verification: "Confirm with UNMC and the school before applying",
      status: "Full Registration",
      note: "Faith-based school serving West Nile nursing and midwifery students."
    },
    {
      name: "Lacor School of Nursing and Midwifery",
      district: "Gulu",
      sector: "Faith Based",
      programmes: ["Diploma Nursing", "Diploma Midwifery", "Certificate Nursing", "Certificate Midwifery"],
      verification: "Confirm with UNMC and the school before applying",
      status: "Full Registration",
      note: "Listed with Gulu health facilities for clinical training exposure."
    },
    {
      name: "Matany School of Nursing and Midwifery",
      district: "Moroto",
      sector: "Faith Based",
      programmes: ["Diploma Nursing", "Certificate Nursing", "Certificate Midwifery"],
      verification: "Confirm with UNMC and the school before applying",
      status: "Full Registration",
      note: "Karamoja-region school listed with Matany Hospital."
    },
    {
      name: "Mbale School of Nursing and Midwifery",
      district: "Mbale",
      sector: "Faith Based",
      programmes: ["Certificate Enrolled Nursing", "Certificate Enrolled Midwifery", "Diploma Midwifery", "Diploma Nursing"],
      verification: "Confirm with UNMC and the school before applying",
      status: "Full Registration",
      note: "Eastern Uganda school with certificate and diploma routes."
    },
    {
      name: "Mukono Diocese School of Nursing and Midwifery",
      district: "Mukono",
      sector: "Faith Based",
      programmes: ["Certificate Nursing", "Certificate Midwifery"],
      verification: "Confirm with UNMC and the school before applying",
      status: "Provisional License",
      note: "Verify current licensing status before applying."
    },
    {
      name: "Ngora School of Nursing",
      district: "Ngora",
      sector: "Faith Based",
      programmes: ["Certificate Enrolled Comprehensive Nursing", "Certificate Midwifery", "Diploma Midwifery"],
      verification: "Confirm with UNMC and the school before applying",
      status: "Full Registration",
      note: "Eastern Uganda nursing and midwifery route listed by UNMC."
    },
    {
      name: "Lubaga Health Training Institution",
      district: "Kampala",
      sector: "Faith Based",
      programmes: ["Diploma Nursing", "Diploma Midwifery", "Certificate Nursing", "Certificate Midwifery"],
      verification: "Confirm with UNMC and the school before applying",
      status: "Full Registration",
      note: "Kampala faith-based nursing and midwifery training institution."
    },
    {
      name: "Villa Maria School of Nursing",
      district: "Masaka",
      sector: "Faith Based",
      programmes: ["Certificate Nursing", "Certificate Midwifery", "Diploma Nursing", "Diploma Midwifery"],
      verification: "Confirm with UNMC and the school before applying",
      status: "Full Registration",
      note: "Listed with Villa Maria Hospital as training facility."
    },
    {
      name: "Virika School of Nursing and Midwifery",
      district: "Kabarole",
      sector: "Faith Based",
      programmes: ["Diploma Nursing", "Certificate Midwifery", "Certificate Comprehensive Nursing"],
      verification: "Confirm with UNMC and the school before applying",
      status: "Full Registration",
      note: "Western Uganda faith-based nursing and midwifery institution."
    },
    {
      name: "Access School of Nursing and Midwifery",
      district: "Nakaseke",
      sector: "Private",
      programmes: ["Certificate Nursing", "Certificate Midwifery"],
      verification: "Confirm with UNMC and the school before applying",
      status: "Provisional License",
      note: "Private certificate training option; verify current status before applying."
    },
    {
      name: "Agule School of Nursing and Midwifery",
      district: "Pallisa",
      sector: "Private",
      programmes: ["Certificate Enrolled Comprehensive Nursing", "Certificate Enrolled Midwifery"],
      verification: "Confirm with UNMC and the school before applying",
      status: "Full Registration",
      note: "Private eastern Uganda nursing and midwifery school."
    },
    {
      name: "Alice Anume Memorial School of Nursing and Midwifery",
      district: "Pallisa",
      sector: "Private",
      programmes: ["Certificate Nursing", "Certificate Midwifery"],
      verification: "Confirm with UNMC and the school before applying",
      status: "Full Registration",
      note: "Private certificate nursing and midwifery route in Pallisa."
    },
    {
      name: "Bweyale School of Nursing and Midwifery",
      district: "Kiryandongo",
      sector: "Private",
      programmes: ["Certificate Nursing", "Certificate Midwifery"],
      verification: "Confirm with UNMC and the school before applying",
      status: "Provisional License",
      note: "Private certificate route; confirm current status with UNMC."
    },
    {
      name: "DAF School of Nursing and Midwifery",
      district: "Lira",
      sector: "Private",
      programmes: ["Certificate Nursing", "Certificate Midwifery"],
      verification: "Confirm with UNMC and the school before applying",
      status: "Provisional License",
      note: "Private Lira training option listed with provisional status."
    },
    {
      name: "Good Samaritan School of Nursing and Midwifery",
      district: "Lira",
      sector: "Private",
      programmes: ["Certificate Nursing", "Certificate Midwifery"],
      verification: "Confirm with UNMC and the school before applying",
      status: "Provisional License",
      note: "Private certificate training option in Lira."
    },
    {
      name: "King James School of Nursing and Midwifery",
      district: "Lira",
      sector: "Private",
      programmes: ["Certificate Nursing", "Certificate Midwifery"],
      verification: "Confirm with UNMC and the school before applying",
      status: "Provisional License",
      note: "Private certificate route; verify status before applying."
    },
    {
      name: "Kumi School of Nursing and Midwifery",
      district: "Kumi",
      sector: "Private",
      programmes: ["Certificate Nursing", "Certificate Midwifery"],
      verification: "Confirm with UNMC and the school before applying",
      status: "Provisional License",
      note: "Private nursing and midwifery school in eastern Uganda."
    },
    {
      name: "Lubega Institute of Nursing and Medical Science",
      district: "Iganga",
      sector: "Private",
      programmes: ["Certificate Nursing", "Certificate Midwifery"],
      verification: "Confirm with UNMC and the school before applying",
      status: "Provisional License",
      note: "Private certificate training institution listed for Iganga."
    },
    {
      name: "Maracha School of Nursing and Midwifery",
      district: "Maracha",
      sector: "Private",
      programmes: ["Certificate Nursing", "Certificate Midwifery"],
      verification: "Confirm with UNMC and the school before applying",
      status: "Provisional License",
      note: "West Nile private nursing and midwifery school."
    },
    {
      name: "Mityana Institute of Nursing and Midwifery",
      district: "Mityana",
      sector: "Private",
      programmes: ["Certificate Nursing", "Certificate Midwifery"],
      verification: "Confirm with UNMC and the school before applying",
      status: "Provisional License",
      note: "Private certificate option in Mityana."
    },
    {
      name: "Mutolere School of Nursing and Midwifery",
      district: "Kisoro",
      sector: "Private",
      programmes: ["Diploma Nursing", "Diploma Midwifery", "Certificate Nursing", "Certificate Midwifery"],
      verification: "Confirm with UNMC and the school before applying",
      status: "Full Registration",
      note: "Southwestern Uganda school with certificate and diploma options."
    },
    {
      name: "Ntungamo Health Training Institute",
      district: "Ntungamo",
      sector: "Private",
      programmes: ["Certificate Nursing", "Certificate Midwifery"],
      verification: "Confirm with UNMC and the school before applying",
      status: "Full Registration",
      note: "Private training institution listed with full registration."
    },
    {
      name: "Iganga School of Nursing and Midwifery",
      district: "Iganga",
      sector: "Private",
      programmes: ["Certificate Nursing", "Certificate Midwifery", "Diploma Nursing", "Diploma Midwifery"],
      verification: "Confirm with UNMC and the school before applying",
      status: "Full Registration",
      note: "Private school with certificate and diploma pathways."
    },
    {
      name: "International Institute of Health Sciences",
      district: "Jinja",
      sector: "Private",
      programmes: ["Certificate Comprehensive Nursing", "Certificate Midwifery", "Diploma Nursing"],
      verification: "Confirm with UNMC and the school before applying",
      status: "Full Registration",
      note: "Private health sciences institution listed with Jinja clinical training links."
    },
    {
      name: "Jerusalem Institute of Health Sciences and Technology",
      district: "Lira",
      sector: "Private",
      programmes: ["Certificate Enrolled Comprehensive Nursing", "Certificate Midwifery"],
      verification: "Confirm with UNMC and the school before applying",
      status: "Full Registration",
      note: "Private Lira institution with certificate training routes."
    },
    {
      name: "Mayanja Memorial Medical Training Institute",
      district: "Mbarara",
      sector: "Private",
      programmes: ["Certificate Comprehensive Nursing", "Certificate Nursing", "Certificate Midwifery"],
      verification: "Confirm with UNMC and the school before applying",
      status: "Full Registration",
      note: "Private medical training institute listed in Mbarara."
    },
    {
      name: "Rakai Community Nursing School",
      district: "Rakai",
      sector: "Private",
      programmes: ["Certificate Comprehensive Nursing", "Certificate Nursing", "Diploma Nursing"],
      verification: "Confirm with UNMC and the school before applying",
      status: "Full Registration",
      note: "Private community nursing school with certificate and diploma pathways."
    },
    {
      name: "Tumu Medical Institute",
      district: "Buhweju",
      sector: "Private",
      programmes: ["Certificate Nursing", "Certificate Midwifery", "Certificate Comprehensive Nursing"],
      verification: "Confirm with UNMC and the school before applying",
      status: "Full Registration",
      note: "Private institute listed with Mbarara regional clinical exposure."
    },
    {
      name: "Busitema University",
      district: "Tororo",
      sector: "University",
      programmes: ["Bachelor of Nursing Science"],
      verification: "Confirm with UNMC and the university before applying",
      status: "Full Registration",
      note: "University-level nursing degree route listed by UNMC."
    },
    {
      name: "Gulu University Department of Midwifery",
      district: "Gulu",
      sector: "University",
      programmes: ["Bachelor of Science in Midwifery"],
      verification: "Confirm with UNMC and the university before applying",
      status: "Full Registration",
      note: "University pathway for midwifery study in northern Uganda."
    },
    {
      name: "Uganda Christian University School of Nursing",
      district: "Mukono",
      sector: "University",
      programmes: ["Bachelor of Science in Nursing", "Master of Nursing Science"],
      verification: "Confirm with UNMC and the university before applying",
      status: "Full Registration",
      note: "University-level nursing route in Mukono."
    },
    {
      name: "Bishop Stuart University School of Nursing and Midwifery",
      district: "Mbarara",
      sector: "University",
      programmes: ["Bachelor of Science in Nursing", "Diploma Nursing"],
      verification: "Confirm with UNMC and the university before applying",
      status: "Full Registration",
      note: "University and diploma pathway in western Uganda."
    },
    {
      name: "Kampala International University Western Campus",
      district: "Bushenyi",
      sector: "University",
      programmes: ["Bachelor of Science in Nursing", "Diploma Nursing", "Certificate Comprehensive Nursing"],
      verification: "Confirm with UNMC and the university before applying",
      status: "Full Registration",
      note: "University campus listed with nursing and comprehensive nursing routes."
    },
    {
      name: "Mountains of the Moon University School of Nursing and Midwifery",
      district: "Fort Portal",
      sector: "University",
      programmes: ["Diploma Nursing", "Bachelor of Science in Nursing"],
      verification: "Confirm with UNMC and the university before applying",
      status: "Full Registration",
      note: "Western Uganda university option for diploma and degree nursing study."
    },
    {
      name: "The Aga Khan University",
      district: "Kampala",
      sector: "University",
      programmes: ["Bachelor of Science in Nursing", "Diploma Nursing"],
      verification: "Confirm with UNMC and the university before applying",
      status: "Full Registration",
      note: "University nursing pathway listed in Kampala."
    },
    {
      name: "Victoria University",
      district: "Kampala",
      sector: "University",
      programmes: ["Bachelor of Science in Nursing"],
      verification: "Confirm with UNMC and the university before applying",
      status: "Full Registration",
      note: "University-level nursing degree route in Kampala."
    }
  ];
}

function schoolCoordinates() {
  return {
    "Arua School of Nursing": [3.0201, 30.9111],
    "Butabika School of Psychiatric Nursing": [0.3187, 32.6498],
    "Hoima School of Nursing": [1.4319, 31.3525],
    "Jinja School of Nursing and Midwifery": [0.4479, 33.2026],
    "Mulago School of Nursing and Midwifery": [0.3404, 32.5763],
    "Public Health Nurses College": [0.3391, 32.5801],
    "Mengo School of Nursing and Midwifery": [0.3136, 32.5626],
    "Nsambya School of Nursing and Midwifery": [0.3008, 32.5912],
    "Gulu School of Nursing and Midwifery": [2.7746, 32.299],
    "Makerere University Department of Nursing": [0.3347, 32.5676],
    "Mbarara University Department of Nursing": [-0.6167, 30.65],
    "Uganda Nursing School Bwindi": [-1.0524, 29.7151]
  };
}

function districtCoordinates() {
  return {
    Apac: [1.9845, 32.534],
    Arua: [3.0201, 30.9111],
    Buhweju: [-0.35, 30.33],
    Buikwe: [0.3375, 33.0106],
    Bushenyi: [-0.5417, 30.1856],
    "Fort Portal": [0.671, 30.275],
    Gulu: [2.7746, 32.299],
    Hoima: [1.4319, 31.3525],
    Ibanda: [-0.133, 30.495],
    Iganga: [0.6092, 33.4686],
    Jinja: [0.4479, 33.2026],
    Kabarole: [0.585, 30.255],
    Kabale: [-1.2486, 29.9899],
    Kaliro: [0.8949, 33.5028],
    Kalungu: [-0.169, 31.758],
    Kampala: [0.3136, 32.5811],
    Kamuli: [0.9472, 33.1197],
    Kanungu: [-0.9575, 29.7897],
    Kasese: [0.1861, 30.088],
    Kiryandongo: [1.8763, 32.0622],
    Kisoro: [-1.2854, 29.6849],
    Kitgum: [3.2783, 32.8867],
    Kumi: [1.4877, 33.9361],
    Lira: [2.2499, 32.8999],
    Luwero: [0.8492, 32.4731],
    Lwengo: [-0.416, 31.408],
    Maracha: [3.2876, 30.9403],
    Masaka: [-0.3338, 31.7341],
    Mbarara: [-0.6167, 30.65],
    Mbale: [1.0806, 34.175],
    Mityana: [0.4016, 32.0439],
    Moroto: [2.533, 34.666],
    Mukono: [0.3533, 32.7553],
    Nakaseke: [1.0444, 32.3904],
    Ngora: [1.4314, 33.7772],
    Ntungamo: [-0.8794, 30.2642],
    Pader: [2.881, 33.086],
    Pallisa: [1.1713, 33.709],
    Rakai: [-0.72, 31.4],
    Rukungiri: [-0.8411, 29.9419],
    Sheema: [-0.55, 30.38],
    Soroti: [1.7146, 33.6111],
    Tororo: [0.6928, 34.181]
  };
}

function schoolRegionForDistrict(district) {
  const value = String(district || "");
  if (/Arua|Maracha/.test(value)) return "West Nile";
  if (/Gulu|Lira|Pader|Kitgum|Apac/.test(value)) return "Northern";
  if (/Jinja|Mbale|Soroti|Pallisa|Kumi|Iganga|Kaliro|Kamuli|Ngora|Tororo|Buikwe/.test(value)) return "Eastern";
  if (/Moroto/.test(value)) return "Karamoja";
  if (/Kampala|Mukono|Masaka|Kalungu|Lwengo|Rakai|Mityana|Nakaseke|Kiryandongo|Luwero/.test(value)) return "Central";
  if (/Mbarara|Bushenyi|Ibanda|Kabale|Kisoro|Rukungiri|Ntungamo|Sheema|Buhweju|Kanungu/.test(value)) return "Western";
  if (/Fort Portal|Kabarole|Kasese/.test(value)) return "Rwenzori";
  return "Other";
}

function schoolRecordId(school) {
  return slugify(school.name);
}

function schoolWithDisplayData(school) {
  const coordinates = schoolCoordinates()[school.name] || districtCoordinates()[school.district] || null;
  const sector = school.sector === "Faith Based" || school.sector === "University" ? "Private" : school.sector;
  const region = school.region || schoolRegionForDistrict(school.district);
  return {
    ...school,
    id: schoolRecordId(school),
    coordinates,
    region,
    filterSector: sector,
    contact: school.contact || "",
    email: school.email || "",
    website: school.website || "",
    address: school.address || "",
    description: school.note || "Nursing and midwifery training institution listed for student comparison."
  };
}

function schoolStatusClass(status) {
  const value = String(status || "").toLowerCase();
  if (value.includes("full")) return "full";
  if (value.includes("provisional")) return "provisional";
  return "not-recognized";
}

function schoolStatusIcon(status) {
  const value = schoolStatusClass(status);
  if (value === "full") return "✓";
  if (value === "provisional") return "!";
  return "×";
}

function schoolStatusExplanation(status) {
  const value = schoolStatusClass(status);
  if (value === "full") {
    return "This school is fully recognized by the Uganda Nurses and Midwives Council (UNMC). Students may apply with confidence, subject to personal verification.";
  }
  if (value === "provisional") {
    return "This school holds a provisional license. Verify current status directly with UNMC before applying.";
  }
  return "This school is not currently listed as recognized by UNMC. Exercise caution before applying.";
}

function schoolProgrammeType(programme) {
  const value = String(programme || "").toLowerCase();
  if (/bachelor|master|degree/.test(value)) return "Degree";
  if (/certificate/.test(value)) return "Certificate";
  return "Diploma";
}

function schoolProgrammeClass(programme) {
  return schoolProgrammeType(programme).toLowerCase();
}

function schoolAvatar(school, size = "") {
  return `<span class="school-avatar${size ? ` ${size}` : ""}" aria-hidden="true">${escapeHtml(school.name.slice(0, 1))}</span>`;
}

function schoolStatusBadge(school, large = false) {
  return `<span class="school-status-badge ${schoolStatusClass(school.status)}${large ? " large" : ""}"><span>${schoolStatusIcon(school.status)}</span>${escapeHtml(school.status)}</span>`;
}

function schoolProgrammeChip(programme) {
  return `<span class="school-programme-chip ${schoolProgrammeClass(programme)}">${escapeHtml(schoolProgrammeType(programme))}</span>`;
}

function schoolFilters() {
  const schools = schoolDirectory().map(schoolWithDisplayData);
  const districts = [...new Set(schools.map((school) => school.district))].sort((a, b) => a.localeCompare(b));
  const regions = [...new Set(schools.map((school) => school.region))].sort((a, b) => a.localeCompare(b));
  return {
    statuses: ["Full Registration", "Provisional License", "Not Recognized"],
    regions,
    districts,
    sectors: ["Government", "Private", "University", "Faith Based"],
    programmes: ["Diploma", "Certificate", "Degree"]
  };
}

function filteredSchools() {
  const query = state.schoolSearch.trim();
  return schoolDirectory().map(schoolWithDisplayData).filter((school) => {
    const programmeTypes = school.programmes.map(schoolProgrammeType);
    const haystack = `${school.name} ${school.district} ${school.region} ${school.sector} ${school.filterSector} ${school.status} ${school.programmes.join(" ")} ${school.description}`;
    const matchesQuery = !query || textMatchesSearchQuery(haystack, query);
    const matchesStatus = state.schoolStatus === "all" || school.status === state.schoolStatus;
    const matchesRegion = state.schoolRegion === "all" || school.region === state.schoolRegion;
    const matchesDistrict = state.schoolDistrict === "all" || school.district === state.schoolDistrict;
    const matchesSector = state.schoolSector === "all" || school.filterSector === state.schoolSector || school.sector === state.schoolSector;
    const matchesProgramme = state.schoolProgramme === "all" || programmeTypes.includes(state.schoolProgramme);
    return matchesQuery && matchesStatus && matchesRegion && matchesDistrict && matchesSector && matchesProgramme;
  });
}

function hasActiveSchoolFilters() {
  return Boolean(state.schoolSearch.trim()) ||
    state.schoolStatus !== "all" ||
    state.schoolRegion !== "all" ||
    state.schoolDistrict !== "all" ||
    state.schoolSector !== "all" ||
    state.schoolProgramme !== "all";
}

function selectedSchool() {
  if (!state.selectedSchool) return null;
  return schoolDirectory().map(schoolWithDisplayData).find((school) => school.id === state.selectedSchool) || null;
}

function schoolFilterPills(label, type, values, active) {
  return `
    <div class="school-filter-group" aria-label="${escapeHtml(label)} filter">
      <span>${escapeHtml(label)}</span>
      <button type="button" class="${active === "all" ? "active" : ""}" data-school-filter-type="${escapeHtml(type)}" data-school-filter-value="all">All</button>
      ${values.map((value) => `
        <button type="button" class="${active === value ? "active" : ""}" data-school-filter-type="${escapeHtml(type)}" data-school-filter-value="${escapeHtml(value)}">${escapeHtml(value)}</button>
      `).join("")}
    </div>
  `;
}

function schoolFilterSelect(label, key, values, active) {
  return `
    <label class="schools-premium-select">
      <span>${escapeHtml(label)}</span>
      <select data-school-select="${escapeHtml(key)}" aria-label="Filter schools by ${escapeHtml(label.toLowerCase())}">
        <option value="all"${active === "all" ? " selected" : ""}>All ${escapeHtml(label.toLowerCase())}</option>
        ${values.map((value) => `<option value="${escapeHtml(value)}"${active === value ? " selected" : ""}>${escapeHtml(value)}</option>`).join("")}
      </select>
    </label>
  `;
}

function schoolSummaryStats(schools) {
  const all = schoolDirectory().map(schoolWithDisplayData);
  return [
    ["Schools", schools.length],
    ["Districts", new Set(all.map((school) => school.district)).size],
    ["Full registration", schools.filter((school) => schoolStatusClass(school.status) === "full").length],
    ["Degree routes", schools.filter((school) => school.programmes.some((programme) => schoolProgrammeType(programme) === "Degree")).length]
  ];
}

function renderSchoolCard(school) {
  return `
    <article class="school-directory-card" data-school-card="${escapeHtml(school.id)}">
      <header class="school-directory-card-head">
        ${schoolAvatar(school)}
        <div class="school-card-badges">
          ${schoolStatusBadge(school)}
          <span class="school-sector-tag">${escapeHtml(school.sector)}</span>
        </div>
      </header>
      <button class="school-title-button" type="button" data-school-open="${escapeHtml(school.id)}">${escapeHtml(school.name)}</button>
      <p>${escapeHtml(school.description)}</p>
      <div class="school-info-list">
        <span>${icon("mapPin")}<strong>${escapeHtml(school.district)}</strong></span>
        <span>${icon("map")}<em>${escapeHtml(school.region)}</em></span>
      </div>
      <div class="school-programmes">
        ${school.programmes.map((programme) => `<span class="${schoolProgrammeClass(programme)}">${escapeHtml(programme)}</span>`).join("")}
      </div>
      <button class="school-detail-button" type="button" data-school-open="${escapeHtml(school.id)}">View School Details ${icon("arrowRight")}</button>
    </article>
  `;
}

function renderExternalLinkDisclosure(label = "External source") {
  return `<small class="external-link-disclosure">${escapeHtml(label)}. Verify details on the official site before acting.</small>`;
}

function renderSchoolMapPopup(school) {
  return `
    <div class="school-map-popup">
      <div class="school-popup-top">${schoolStatusBadge(school)}<span class="school-sector-tag">${escapeHtml(school.sector)}</span></div>
      <strong>${escapeHtml(school.name)}</strong>
      <span class="school-popup-line">${icon("mapPin")}${escapeHtml(school.district)}</span>
      ${school.programmes[0] ? schoolProgrammeChip(school.programmes[0]) : ""}
      <button type="button" data-school-open="${escapeHtml(school.id)}">View Details ${icon("arrowRight")}</button>
    </div>
  `;
}

function renderSchoolsMapView(schools) {
  return `
    <div class="schools-map-layout">
      <aside class="schools-map-list" aria-label="Schools map list">
        ${schools.map((school) => `
          <button class="${state.activeSchool === school.id ? "active" : ""}" type="button" data-school-map-focus="${escapeHtml(school.id)}">
            ${schoolAvatar(school, "small")}
            <span><strong>${escapeHtml(school.name)}</strong><small>${escapeHtml(school.district)} · ${escapeHtml(school.sector)}</small></span>
            <i class="${schoolStatusClass(school.status)}"></i>
          </button>
        `).join("")}
      </aside>
      <div class="schools-map-stage">
        <div id="schools-leaflet-map" class="schools-leaflet-map" aria-label="Map of nursing and midwifery schools in Uganda"></div>
        <div class="schools-map-fallback" aria-hidden="true">
          <span class="uganda-map-label">Uganda</span>
          ${schools.filter((school) => school.coordinates).map((school) => `
            <button style="--pin-x:${Math.min(88, Math.max(12, 50 + ((school.coordinates[1] - 32.2903) * 11)))}%; --pin-y:${Math.min(88, Math.max(10, 50 - ((school.coordinates[0] - 1.3733) * 12)))}%;" class="schools-fallback-pin ${schoolStatusClass(school.status)}" type="button" data-school-map-focus="${escapeHtml(school.id)}" aria-label="${escapeHtml(school.name)}"></button>
          `).join("")}
        </div>
        <div class="schools-mobile-sheet">
          <span></span>
          <strong>Schools in this view</strong>
          <div>
            ${schools.map((school) => `
              <button type="button" data-school-map-focus="${escapeHtml(school.id)}">
                ${schoolAvatar(school, "small")}
                <span>${escapeHtml(school.name)}<small>${escapeHtml(school.district)} · ${escapeHtml(school.sector)}</small></span>
              </button>
            `).join("")}
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderSchoolDrawer(school) {
  if (!school) return "";
  return `
    <div class="school-drawer-overlay" data-school-overlay>
      <aside class="school-detail-drawer" role="dialog" aria-modal="true" aria-labelledby="school-drawer-title">
        <button class="school-drawer-close" type="button" data-school-close aria-label="Close school details">${icon("x")}</button>
        <header class="school-drawer-hero">
          ${schoolAvatar(school, "large")}
          ${schoolStatusBadge(school)}
          <h2 id="school-drawer-title">${escapeHtml(school.name)}</h2>
          <span class="school-drawer-sector">${escapeHtml(school.sector)}</span>
        </header>
        <div class="school-drawer-body">
          <section>
            <h3>About</h3>
            <p>${escapeHtml(school.description)}</p>
          </section>
          <section>
            <h3>Location & Contact</h3>
            <div class="school-detail-rows">
              <span>${icon("mapPin")}<strong>District</strong><em>${escapeHtml(school.district)}</em></span>
              <span>${icon("building2")}<strong>Address</strong><em>${school.address ? escapeHtml(school.address) : "Not listed"}</em></span>
              <span>${icon("phone")}<strong>Phone</strong><em>${school.contact ? escapeHtml(school.contact) : "Not listed"}</em></span>
              <span>${icon("mail")}<strong>Email</strong><em>${school.email ? escapeHtml(school.email) : "Not listed"}</em></span>
              <span>${icon("externalLink")}<strong>Website</strong><em>${school.website ? escapeHtml(school.website) : "Not listed"}</em></span>
            </div>
            ${school.coordinates ? `<div class="school-mini-map" data-school-mini-map="${escapeHtml(school.id)}"></div>` : ""}
          </section>
          <section>
            <h3>Registration Status</h3>
            <div class="school-status-explainer">
              ${schoolStatusBadge(school, true)}
              <p>${escapeHtml(schoolStatusExplanation(school.status))}</p>
              ${renderExternalLinkDisclosure("External regulator link")}
              <a href="https://unmc.ug/recognized-schools/" target="_blank" rel="noopener">${icon("externalLink")}Verify on UNMC website</a>
            </div>
          </section>
          <section>
            <h3>Programmes Offered</h3>
            <div class="school-programme-list">
              ${school.programmes.map((programme) => `
                <div>${schoolProgrammeChip(programme)}<strong>${escapeHtml(programme)}</strong><span>Duration not listed</span></div>
              `).join("")}
            </div>
          </section>
        </div>
        <footer class="school-drawer-footer">
          ${renderExternalLinkDisclosure("External regulator link")}
          <a href="https://unmc.ug/recognized-schools/" target="_blank" rel="noopener">${icon("externalLink")}Check UNMC Source</a>
          <button type="button" data-school-close>${icon("x")}Close</button>
        </footer>
      </aside>
    </div>
  `;
}

function globalSearchResults(query, options = {}) {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];
  const results = [];
  const applyFilters = options.applyFilters !== false;

  for (const programme of state.data.programmes) {
    for (const unit of allUnits(programme)) {
      const unitText = `${programme.label} ${unit.code || ""} ${unit.title}`;
      if (textMatchesSearchQuery(unitText, query)) {
        results.push({
          type: "Course Unit",
          category: searchCategoryFor(unitText),
          title: `${unit.code ? `${unit.code}: ` : ""}${unit.title}`,
          context: programme.label,
          body: `Year ${unit.year}, Semester ${unit.semester}. ${unit.topicCount || 0} topics.`,
          href: `/courses/${programme.id}/${unit.id}`,
          score: unit.title.toLowerCase().includes(q) ? 4 : 2
        });
      }

      for (const topic of flatTopics(unit)) {
        const lesson = lessonForTopic(programme, unit, topic);
        const searchText = `${programme.label} ${unit.title} ${topic.groupTitle} ${topic.title} ${lessonSearchText(lesson)}`;
        const prioritySearchText = `${programme.label} ${unit.title} ${topic.groupTitle} ${topic.title} ${lesson ? `${lesson.title || ""} ${lesson.excerpt || ""}` : ""}`;
        if (!searchText.toLowerCase().includes(q) && !textMatchesSearchQuery(prioritySearchText, query)) continue;
        results.push({
          type: lesson ? "Lesson" : "Topic",
          category: searchCategoryFor(searchText),
          title: topic.title,
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
    if (!textMatchesSearchQuery(text, query)) continue;
    results.push({
      type: "Instrument",
      category: "instruments",
      title: instrument.name,
      context: instrument.category,
      body: snippetFor(text, query),
      href: `/resources/medical-instruments/${instrument.slug}`,
      score: instrument.name.toLowerCase().includes(q) ? 4 : 1
    });
  }

  for (const school of schoolDirectory()) {
    const text = `${school.name} ${school.district} ${school.sector} ${school.status} ${school.programmes.join(" ")}`;
    if (!textMatchesSearchQuery(text, query)) continue;
    results.push({
      type: "School",
      category: "schools",
      title: school.name,
      context: `${school.district} - ${school.status}`,
      body: snippetFor(text, query),
      href: "/resources/schools",
      score: school.name.toLowerCase().includes(q) ? 4 : 1
    });
  }

  for (const term of dictionaryTerms()) {
    const text = `${term.term} ${term.simpleDefinition} ${term.definition} ${term.clinicalContext} ${term.category} ${term.bodySystem} ${(term.tags || []).join(" ")}`;
    if (!textMatchesSearchQuery(text, query)) continue;
    results.push({
      type: "Dictionary",
      category: "dictionary",
      title: term.term,
      context: `${term.category} - ${term.bodySystem}`,
      body: term.simpleDefinition,
      href: `/dictionary/${term.slug}`,
      score: term.term.toLowerCase().includes(q) ? 5 : 2
    });
  }

  for (const resource of resourceCards()) {
    const text = `${resource.title} ${resource.body} ${resource.category}`.toLowerCase();
    if (!textMatchesSearchQuery(text, query)) continue;
    results.push({
      type: resource.category === "Reference" ? "Research" : "Resource",
      category: searchCategoryFor(`${resource.title} ${resource.body} ${resource.category}`),
      title: resource.title,
      context: resource.category,
      body: resource.body,
      href: resource.href,
      score: resource.title.toLowerCase().includes(q) ? 4 : 1
    });
  }

  return results
    .filter((result) => !applyFilters || resultMatchesAdvancedFilters(result))
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
    .slice(0, 60);
}

function searchCategoryFor(value) {
  const text = String(value || "").toLowerCase();
  if (/anatomy|physiology|body|cell|tissue|first aid/.test(text)) return "anatomy";
  if (/foundation|fundamental|ethic|nursing process|documentation/.test(text)) return "foundations";
  if (/medical|surgical|surgery|wound|theatre|clinical|instrument/.test(text)) return "medical";
  if (/midwifery|obstetric|maternal|newborn|antenatal|labou?r|pregnan|reproductive|gynaecology/.test(text)) return "midwifery";
  if (/pharmacology|drug|medicine|dose|tablet|injection|antibiotic/.test(text)) return "pharmacology";
  if (/community|public health|primary health|epidemiology|family health/.test(text)) return "community";
  if (/mental|psychiatric|psychology|counsel/.test(text)) return "mental";
  if (/instrument|stethoscope|forceps|catheter|syringe/.test(text)) return "instruments";
  if (/school|college|university/.test(text)) return "schools";
  if (/library|book|reference|research|paper/.test(text)) return "research";
  return "general";
}

function resultMatchesAdvancedFilters(result) {
  const category = state.globalSearchCategory || "all";
  const type = state.globalSearchType || "all";
  const resultType = String(result.type || "").toLowerCase();
  const resultCategory = result.category || "general";
  const matchesCategory = category === "all" || resultCategory === category;
  const matchesType = type === "all"
    || (type === "topic-lesson" && /topic|lesson/.test(resultType))
    || (type === "unit" && /unit/.test(resultType))
    || resultType === type;
  return matchesCategory && matchesType;
}

function topicHref(programme, unit, groupIndex, topicIndex) {
  const topic = unit && unit.topicGroups ? findTopic(unit, groupIndex, topicIndex) : null;
  if (!topic) return `/courses/${programme.id}/${unit.id}/topic/${groupIndex}/${topicIndex}`;
  return `/courses/${programme.id}/${unit.id}/${uniqueTopicSlug(unit, { ...topic, title: lmsLessonTitle(programme, unit, topic) })}/`;
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
    src: "assets/images/source-library/nursing-uganda-1105-anterior-and-posterior-views-of-muscles2-1024x631-1-001-794c89cd.jpg",
    alt: "Anatomy and physiology learning illustration"
  },
  anatomyIntro: {
    src: "assets/images/source-library/nursing-uganda-9-abdominopelvic-regions-001-74041a16.jpg",
    alt: "Anatomy introduction learning image"
  },
  community: {
    src: "assets/images/source-library/nursing-uganda-introduction-to-environmental-hygiene-001-d86a0e24.jpg",
    alt: "Community health nursing programme illustration"
  },
  mental: {
    src: "assets/images/source-library/nursing-uganda-mental-health-001-4e5eb33a.webp",
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
  resourcesHero: {
    src: "assets/images/nursing-uganda-hero-nursing-student-skills-lab-01.png",
    alt: "Nursing students collaborating around learning resources"
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

  const pageUrl = `https://nursinguganda.com${window.location.pathname}`;

  [
    ["og:title", cleanTitle],
    ["og:description", description],
    ["og:url", pageUrl],
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

  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) canonical.setAttribute("href", pageUrl);
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
  return "";
}

function lessonGalleryImages(programme, unit, topic, lesson) {
  const text = topicSearchText(programme, unit, topic, lesson).toLowerCase();
  const images = [];
  const addImage = (image, label = "Topic visual") => {
    if (!image || !image.src) return;
    if (images.some((item) => item.src === image.src)) return;
    images.push({
      src: image.src,
      alt: image.alt || `${label} for ${topic.title}`,
      label
    });
  };

  const match = topicImageMatch(programme, unit, topic);
  if (match) {
    addImage({ src: match.image, alt: match.alt || `Visual reference for ${topic.title}` }, topicImageCategoryLabel(match.category));
  }

  addImage(imageFor(topic.title), "Topic overview");
  addImage(imageFor(`${unit.title} ${programme.label}`), "Course context");

  if (/drug|pharmac|medicine|dose|tablet|injection|antibiotic|anaesthesia/.test(text)) addImage(imageCatalog.instruments, "Medication safety");
  if (/pregnan|labou?r|maternal|newborn|antenatal|postnatal|obstetric|midwifery|placenta|uterus/.test(text)) addImage(imageCatalog.midwifery, "Maternal and newborn care");
  if (/community|public|nutrition|sanitation|immuni|epidemiology|family planning/.test(text)) addImage(imageCatalog.community, "Community health");
  if (/mental|psychiatric|anxiety|depression|psychosis|counsel/.test(text)) addImage(imageCatalog.mental, "Mental health");
  if (/surgical|wound|dressing|theatre|fracture|burn|trauma|catheter|forceps|instrument/.test(text)) addImage(imageCatalog.instruments, "Clinical tools");
  if (/disease|pathology|infection|malaria|tb|hiv|diabetes|asthma|cardiac|renal|liver/.test(text)) addImage(imageCatalog.disease, "Clinical assessment");

  addImage(imageCatalog.nursing, "Nursing practice");
  return images.slice(0, 5);
}

function renderLessonGallery(programme, unit, topic, lesson) {
  return "";
}

function topicPracticeFrame(programme, unit, topic, lesson) {
  if (lesson && lesson.practiceFrame) return lesson.practiceFrame;

  const text = topicSearchText(programme, unit, topic, lesson).toLowerCase();
  const titleText = `${lmsLessonTitle(programme, unit, topic)} ${lmsModuleTitle(programme, unit, topic)}`.toLowerCase();

  if (/shock|bleed|resusc|first aid|emerg|trauma|burn|poison|unconscious/.test(titleText)) {
    return {
      lens: "Emergency care lens",
      definition: `${topic.title} refers to a time-sensitive clinical situation where assessment and action must happen together. The nurse first protects life, prevents further harm and calls for help while continuing focused observation.`,
      assessment: ["Airway, breathing, circulation, disability and exposure", "Level of consciousness, pain, bleeding, burns or injury pattern", "Vital signs, response to first aid and need for urgent referral"],
      priorities: ["Keep the patient safe and escalate early", "Use available emergency equipment correctly", "Document time, findings, actions and response"]
    };
  }

  if (/pregnan|labou?r|maternal|newborn|antenatal|postnatal|obstetric|midwifery|placenta|uterus|fetal|foetal/.test(text)) {
    return {
      lens: "Maternal and newborn lens",
      definition: `${topic.title} is studied as part of safe maternal, fetal or newborn care. The nursing focus is to connect normal physiology with danger signs, respectful communication and timely referral.`,
      assessment: ["Maternal vital signs, pain, bleeding, contractions and general wellbeing", "Fetal or newborn status where relevant", "Risk factors, previous obstetric history and current danger signs"],
      priorities: ["Monitor trends instead of single findings", "Prepare for escalation when mother or baby deteriorates", "Give clear health education to the mother and caregiver"]
    };
  }

  if (/drug|pharmac|medicine|dose|tablet|injection|antibiotic|anaesthesia|toxicology/.test(text)) {
    return {
      lens: "Medication safety lens",
      definition: `${topic.title} involves understanding how medicines are selected, prepared, given, monitored and documented. Safe nursing practice links the drug action to the patient's condition and likely adverse effects.`,
      assessment: ["Indication for the medicine and current diagnosis", "Allergies, age, pregnancy status, renal or liver risk where relevant", "Dose, route, timing, interactions and patient response"],
      priorities: ["Apply the rights of medication administration", "Observe for expected and unwanted effects", "Educate the patient using simple, practical language"]
    };
  }

  if (/infection|communicable|malaria|tuberculosis|tb|hiv|sepsis|immuni|cholera|hepatitis|measles/.test(text)) {
    return {
      lens: "Infection prevention lens",
      definition: `${topic.title} is best understood by linking the organism or cause, mode of transmission, patient risk and prevention. Nursing care protects the patient, staff and community at the same time.`,
      assessment: ["Fever pattern, exposure history and key symptoms", "Hydration, nutrition, respiratory status and danger signs", "Isolation needs, contact tracing or community prevention needs"],
      priorities: ["Use hand hygiene and appropriate protective equipment", "Support diagnosis and treatment adherence", "Teach prevention in language the patient can act on"]
    };
  }

  if (/mental|psychiatric|anxiety|depression|psychosis|mania|substance|counsel|violence/.test(text)) {
    return {
      lens: "Psychosocial care lens",
      definition: `${topic.title} requires nurses to assess safety, symptoms, relationships and functioning without stigma. The aim is therapeutic communication, risk reduction and coordinated care.`,
      assessment: ["Mood, thought content, perception, behavior and orientation", "Risk of self-harm, harm to others, neglect or abuse", "Family support, substance use and treatment adherence"],
      priorities: ["Use calm, respectful communication", "Maintain privacy and dignity", "Escalate safety concerns promptly"]
    };
  }

  return {
    lens: "Clinical reasoning lens",
    definition: `${topic.title} is a nursing topic that should be understood through definition, causes or contributing factors, assessment findings, patient risks and practical nursing actions. The goal is to move beyond memorizing terms into safe bedside decision-making.`,
    assessment: ["Patient history, presenting symptoms and relevant risk factors", "Focused physical or psychosocial assessment", "Vital signs, danger signs and findings that require escalation"],
    priorities: ["Explain care in patient-friendly language", "Prioritize safety, infection prevention and documentation", "Evaluate whether the patient improves after nursing interventions"]
  };
}

function renderOriginalExpansion(programme, unit, topic, lesson) {
  const frame = topicPracticeFrame(programme, unit, topic, lesson);
  return `
    <section class="original-lesson-panel" id="original-notes">
      <div>
        <span class="mini-label">Nursing Uganda Notes</span>
        <h3>Expanded Original Explanation</h3>
        <p>${escapeHtml(frame.definition)}</p>
      </div>
      <div class="original-lesson-grid">
        <article>
          <strong>${escapeHtml(frame.lens)}</strong>
          <p>${escapeHtml(`${topic.title} sits within ${unit.code ? `${unit.code}: ` : ""}${unit.title}. Read it with your class notes, clinical placement examples and current facility protocols.`)}</p>
        </article>
        <article>
          <strong>Assessment Focus</strong>
          <ul>${frame.assessment.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
        </article>
        <article>
          <strong>Nursing Priorities</strong>
          <ul>${frame.priorities.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
        </article>
      </div>
    </section>
  `;
}

function youtubeTopicUrl(programme, unit, topic) {
  const query = `${topic.title} ${unit.title} nursing lecture`;
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
}

function youtubeTopicEmbedUrl(programme, unit, topic) {
  const query = `${topic.title} ${unit.title} nursing lecture`;
  return `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(query)}`;
}

function renderTopicVideo(programme, unit, topic) {
  const href = youtubeTopicUrl(programme, unit, topic);
  const embedHref = youtubeTopicEmbedUrl(programme, unit, topic);
  return `
    <section class="video-study-panel" id="topic-video">
      <div class="video-preview-frame">
        <iframe
          src="${escapeHtml(embedHref)}"
          title="${escapeHtml(`${lmsLessonTitle(programme, unit, topic)} YouTube lesson preview`)}"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen></iframe>
        <div class="video-fallback-card">
          ${icon("video")}
          <strong>Video preview unavailable?</strong>
          <a href="${escapeHtml(href)}" target="_blank" rel="noopener">Watch on YouTube</a>
        </div>
      </div>
      <div class="video-study-copy">
        <span class="mini-label">Video Preview</span>
        <h3>YouTube Lesson Support</h3>
        <p>Use the video search as a supporting explanation after reading the lesson notes.</p>
        ${renderAffiliateDisclosure(true)}
        <a class="button secondary" href="${escapeHtml(href)}" target="_blank" rel="noopener">${buttonLabel("Open On YouTube", "externalLink")}</a>
      </div>
    </section>
  `;
}

const officialReferenceCatalog = [
  {
    title: "Open RN Nursing Pharmacology, 2nd edition",
    author: "Open RN / NCBI Bookshelf",
    href: "https://www.ncbi.nlm.nih.gov/books/NBK595000/",
    subjects: ["pharmacology", "drug", "medicine", "medication", "dose", "injection", "antibiotic"],
    note: "Downloaded locally for pharmacology enrichment; CC BY 4.0 source."
  },
  {
    title: "WHO recommendations on maternal health, 2nd edition",
    author: "World Health Organization",
    href: "https://www.ncbi.nlm.nih.gov/books/NBK615644/",
    subjects: ["maternal", "pregnancy", "antenatal", "labour", "postnatal", "obstetric", "midwifery"],
    note: "Local PDF research source for maternal-health topic expansion."
  },
  {
    title: "WHO recommendations on newborn health",
    author: "World Health Organization",
    href: "https://iris.who.int/handle/10665/259269",
    subjects: ["newborn", "neonatal", "baby", "postnatal", "child"],
    note: "Local PDF research source for newborn care and referral priorities."
  },
  {
    title: "WHO recommendations on child health",
    author: "World Health Organization",
    href: "https://iris.who.int/handle/10665/259267",
    subjects: ["child", "children", "paediatric", "pediatric", "immunization", "infection"],
    note: "Local PDF research source for child-health and prevention topics."
  },
  {
    title: "WHO recommendations on adolescent health",
    author: "World Health Organization",
    href: "https://iris.who.int/handle/10665/259628",
    subjects: ["adolescent", "youth", "sexuality", "reproductive", "mental"],
    note: "Local PDF research source for adolescent and reproductive-health topics."
  },
  {
    title: "Nursing Education and Regulation in Uganda",
    author: "Uganda nursing education research PDF",
    href: "",
    subjects: ["regulation", "education", "licensing", "professional", "ethics", "management"],
    note: "Local project PDF used for Uganda professional-context references."
  }
];

function bookScoreForTopic(book, tokens, text) {
  const haystack = `${book.title || ""} ${book.description || ""} ${(book.subjects || []).join(" ")} ${book.collection_title || ""}`.toLowerCase();
  let score = 0;
  for (const token of tokens) {
    if (haystack.includes(token)) score += 4;
  }
  if (/pregnan|labou?r|maternal|newborn|obstetric|midwifery/.test(text) && /obstetric|midwifery|neonat|maternal|newborn/.test(haystack)) score += 18;
  if (/child|paediatric|pediatric|immuni/.test(text) && /pediatric|paediatric|child|neonat/.test(haystack)) score += 18;
  if (/drug|pharmac|medicine|dose/.test(text) && /pharmac|drug|medicine|medication/.test(haystack)) score += 18;
  if (/anatomy|physiology|body|system/.test(text) && /anatomy|physiology/.test(haystack)) score += 18;
  if (/infection|pathology|disease|malaria|tb|hiv/.test(text) && /pathology|infection|virology|immunology|parasitology|internal medicine/.test(haystack)) score += 14;
  if (/mental|psychiatric|psychology/.test(text) && /psychiatry|mental|psychology/.test(haystack)) score += 18;
  if (/first aid|emerg|trauma|wound|surgical|theatre/.test(text) && /first aid|surgery|clinical|emergency|procedure/.test(haystack)) score += 16;
  return score + Number(book.score || 0) / 20;
}

function lessonReferences(programme, unit, topic, lesson) {
  const text = topicSearchText(programme, unit, topic, lesson).toLowerCase();
  const tokens = wordsForMatch(text);
  const official = officialReferenceCatalog
    .map((reference) => ({
      ...reference,
      type: "PDF / official reference",
      score: reference.subjects.some((subject) => text.includes(subject)) ? 30 : 0
    }))
    .filter((reference) => reference.score > 0)
    .slice(0, 2);

  const books = ((state.bookLibrary && state.bookLibrary.books) || [])
    .map((book) => ({ ...book, type: "Book", score: bookScoreForTopic(book, tokens, text) }))
    .filter((book) => book.score >= 16)
    .sort((a, b) => b.score - a.score || String(a.title).localeCompare(String(b.title)))
    .slice(0, 3);

  const fallback = officialReferenceCatalog.slice(0, 1).map((reference) => ({ ...reference, type: "PDF / official reference" }));
  return [...official, ...books, ...(!official.length && !books.length ? fallback : [])].slice(0, 5);
}

function renderLessonReferences(programme, unit, topic, lesson) {
  const references = lessonReferences(programme, unit, topic, lesson);
  if (!references.length) return "";
  return `
    <section class="reference-books-panel" id="lesson-references">
      <div class="section-head slim-head">
        <div>
          <span class="mini-label">References</span>
          <h3>Books And PDFs To Check</h3>
        </div>
      </div>
      <div class="reference-book-grid">
        ${references.map((reference) => {
          const href = reference.read_url || reference.href || reference.source_url || "";
          return `
            <article>
              <span>${escapeHtml(reference.type || "Reference")}</span>
              <h4>${escapeHtml(reference.title)}</h4>
              <p>${escapeHtml(reference.author || reference.note || reference.collection_title || "Reference source")}</p>
              ${reference.description ? `<small>${escapeHtml(truncateText(reference.description, 135))}</small>` : ""}
              ${href ? `${renderAffiliateDisclosure(true)}<a href="${escapeHtml(href)}" target="_blank" rel="noopener">${icon("externalLink")}<span>Open reference</span></a>` : `<small>${escapeHtml(reference.note || "Available in the local project PDF folder.")}</small>`}
            </article>
          `;
        }).join("")}
      </div>
    </section>
  `;
}

function relatedLessonsFor(programme, unit, topic, lesson) {
  const currentKey = topicKey(programme, unit, topic);
  const currentWords = new Set(wordsForMatch(topicSearchText(programme, unit, topic, lesson)));
  const all = allStudyTopics()
    .filter((item) => topicKey(item.programme, item.unit, item.topic) !== currentKey)
    .map((item) => {
      const otherLesson = lessonForTopic(item.programme, item.unit, item.topic);
      const otherWords = new Set(wordsForMatch(topicSearchText(item.programme, item.unit, item.topic, otherLesson)));
      let score = item.unit.id === unit.id ? 8 : 0;
      if (item.programme.id === programme.id) score += 3;
      if (item.topic.groupTitle === topic.groupTitle) score += 4;
      for (const word of currentWords) {
        if (otherWords.has(word)) score += 2;
      }
      return {
        ...item,
        lesson: otherLesson,
        score,
        href: topicHref(item.programme, item.unit, item.topic.groupIndex, item.topic.topicIndex)
      };
    })
    .filter((item) => item.score >= 8)
    .sort((a, b) => b.score - a.score || a.topic.title.localeCompare(b.topic.title));

  return all.slice(0, 6);
}

function renderRelatedLessons(programme, unit, topic, lesson) {
  const related = relatedLessonsFor(programme, unit, topic, lesson);
  if (!related.length) return "";
  return `
    <section class="related-lessons-panel" id="related-lessons">
      <div class="section-head slim-head">
        <div>
          <span class="mini-label">Keep Studying</span>
          <h3>Related Lessons</h3>
        </div>
      </div>
      <div class="related-lesson-grid">
        ${related.map((item) => `
          <a href="${escapeHtml(item.href)}">
            <strong>${escapeHtml(item.topic.title)}</strong>
            <span>${escapeHtml(item.unit.code ? `${item.unit.code}: ${item.unit.title}` : item.unit.title)}</span>
          </a>
        `).join("")}
      </div>
    </section>
  `;
}

function footerLink(href, label, iconName = "arrowRight", extra = "") {
  return `<a href="${escapeHtml(href)}"${extra ? ` ${extra}` : ""}>${icon(iconName)}<span>${escapeHtml(label)}</span></a>`;
}

function footerMegaLink(href, title, body, iconName = "arrowRight", extra = "") {
  return `
    <a class="footer-mega-link" href="${escapeHtml(href)}"${extra ? ` ${extra}` : ""}>
      <span>${icon(iconName)}</span>
      <strong>${escapeHtml(title)}</strong>
      <small>${escapeHtml(body)}</small>
    </a>
  `;
}

function renderCookieConsent() {
  const consent = storedCookieConsent() || defaultCookieConsent();
  const showBanner = !hasCookieDecision();
  const showPreferences = state.cookiePreferencesOpen;
  if (!showBanner && !showPreferences) return "";
  const checked = (key) => consent[key] ? " checked" : "";

  return `
    <div class="cookie-consent-layer" aria-live="polite">
      ${showBanner ? `
        <section class="cookie-consent-banner" aria-label="Privacy and cookie choices">
          <div class="cookie-consent-copy">
            <div>
              <span class="mini-label">Privacy Choices</span>
              <h2>We Care About Your Privacy</h2>
              <p>Nursing Uganda stores only necessary site preferences by default. With your permission we may use analytics, advertising cookies and affiliate tracking to improve the website, measure useful content and support free peer-to-peer revision resources.</p>
              <p class="cookie-small">You can change your choices later from Cookie Preferences in the footer. See our <a href="/privacy">Privacy Policy</a> and <a href="/cookies">Cookie Policy</a>.</p>
            </div>
            <div>
              <span class="mini-label">Partners And External Services</span>
              <h3>We and selected partners process data to provide:</h3>
              <ul>
                <li>Anonymous or aggregated site usage measurement.</li>
                <li>Advertising and AdSense-supported placements when enabled.</li>
                <li>Affiliate-link tracking on partner resources where disclosed.</li>
              </ul>
            </div>
          </div>
          <div class="cookie-consent-actions">
            <button class="cookie-button primary" type="button" data-cookie-accept>I Accept</button>
            <button class="cookie-button secondary" type="button" data-cookie-reject>Reject All</button>
            <button class="cookie-button ghost" type="button" data-cookie-manage>Manage Preferences</button>
          </div>
        </section>
      ` : ""}
      ${showPreferences ? `
        <section class="cookie-preferences-panel" role="dialog" aria-modal="false" aria-label="Cookie preferences">
          <div class="cookie-preferences-head">
            <div>
              <span class="mini-label">Consent Centre</span>
              <h2>Cookie Preferences</h2>
            </div>
            <button type="button" class="cookie-close" data-cookie-close aria-label="Close cookie preferences">${icon("x")}</button>
          </div>
          <p>Choose how Nursing Uganda may use optional tools. Necessary storage keeps preferences, theme and basic site functions working.</p>
          <div class="cookie-toggle-list">
            <label><input type="checkbox" checked disabled><span><strong>Necessary</strong><small>Required for navigation, saved choices and core site security.</small></span></label>
            <label><input type="checkbox" data-cookie-pref="analytics"${checked("analytics")}><span><strong>Analytics</strong><small>Helps us understand which revision pages and resources are useful.</small></span></label>
            <label><input type="checkbox" data-cookie-pref="ads"${checked("ads")}><span><strong>Google AdSense</strong><small>Allows ad scripts to load once publisher IDs are configured.</small></span></label>
            <label><input type="checkbox" data-cookie-pref="affiliates"${checked("affiliates")}><span><strong>Affiliate Links</strong><small>Allows partner-link measurement when you open disclosed external resources.</small></span></label>
          </div>
          <div class="cookie-preferences-actions">
            <button class="cookie-button ghost" type="button" data-cookie-reject>Reject All</button>
            <button class="cookie-button primary" type="button" data-cookie-save>Save Preferences</button>
          </div>
        </section>
      ` : ""}
    </div>
  `;
}

function renderFooter() {
  const totals = state.data?.totals || {};
  const programmeCount = state.data?.programmes?.length || 0;
  const dictionaryCount = dictionaryTerms().length;
  const instrumentCount = allMedicalInstruments().length;

  const exploreLinks = [
    ["/notes", "Notes", "bookOpen"],
    ["/courses", "Courses", "graduationCap"],
    ["/search", "Search", "search"],
    ["/dictionary", "Dictionary", "fileText"],
    ["/resources/medical-instruments", "Instruments", "stethoscope"],
    ["/resources/schools", "Schools", "school"],
    ["/resources/past-papers", "Past Papers", "clipboardList"],
    ["/careers", "Careers", "briefcaseMedical"]
  ];
  const subjectLinks = [
    ["anatomy|physiology", "Anatomy & Physiology", "activity"],
    ["medical|surgical", "Medical Surgical", "stethoscope"],
    ["midwifery|obstetric|newborn", "Midwifery", "heartPulse"],
    ["pharmacology|drug|medicine", "Pharmacology", "pill"],
    ["community|public health", "Community Health", "home"],
    ["mental|psychiatric", "Mental Health", "heartPulse"]
  ];

  return `
    <footer class="site-footer">
      <div class="container footer-shell">
        <div class="footer-top">
          <div class="footer-brand">
            <a class="footer-logo" href="/notes" aria-label="Nursing Uganda home">
              <span class="brand-mark">NU</span>
              <div><strong>Nursing Uganda</strong><small>Revision &amp; Resources</small></div>
            </a>
            <p>Structured notes, courses, dictionary and resources for Uganda nursing and midwifery students — free and offline-ready.</p>
            <div class="footer-stats" aria-label="Quick stats">
              <span>${icon("graduationCap")}<strong>${programmeCount || 7}</strong> programmes</span>
              <span>${icon("bookOpen")}<strong>${totals.courseUnits || 95}</strong> units</span>
              <span>${icon("fileText")}<strong>${dictionaryCount}</strong> terms</span>
              <span>${icon("stethoscope")}<strong>${instrumentCount}</strong> instruments</span>
            </div>
          </div>
          <div class="footer-cta-aside">
            <span class="eyebrow footer-cta-eyebrow">Start Studying</span>
            <h3>Ready to revise?</h3>
            <p>Jump into notes, test yourself with quizzes, or explore the full dictionary.</p>
            <div class="footer-cta-aside-actions">
              ${buttonLink("/notes", "Browse Notes", "primary", "bookOpen")}
              ${buttonLink("/resources/quizzes", "Take a Quiz", "secondary", "helpCircle")}
            </div>
          </div>
        </div>
        <div class="footer-nav">
          <nav class="footer-nav-col" aria-label="Explore links">
            <h4>Explore</h4>
            ${exploreLinks.map(([href, label, iconName]) => footerLink(href, label, iconName)).join("")}
          </nav>
          <nav class="footer-nav-col" aria-label="Subjects">
            <h4>Subjects</h4>
            ${subjectLinks.map(([seed, label, iconName]) => footerLink("/search", label, iconName, `data-search-seed="${escapeHtml(seed)}"`)).join("")}
          </nav>
          <nav class="footer-nav-col" aria-label="More">
            <h4>More</h4>
            ${footerLink("/resources/licensing", "Licensing & CPD", "badgeCheck")}
            ${footerLink("/resources/student-support", "Student Support", "heartPulse")}
            ${footerLink("/progress", "My Progress", "chartLine")}
            ${footerLink("/privacy", "Privacy Policy", "shield")}
            ${footerLink("/disclaimer", "Disclaimer", "fileText")}
            ${footerLink("/corrections", "Corrections", "pencil")}
          </nav>
        </div>
        <div class="footer-bottom">
          <span class="footer-disclaimer">${icon("badgeCheck")} Use for revision. Confirm clinical decisions with tutors and current guidance.</span>
          <span>&copy; ${new Date().getFullYear()} Nursing Uganda. All rights reserved.</span>
          <nav class="footer-legal-links" aria-label="Legal links">
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
            <a href="/disclaimer">Disclaimer</a>
            <button type="button" data-cookie-manage>Cookie Preferences</button>
          </nav>
        </div>
        ${renderAdSlot("footer", "Footer advertisement")}
      </div>
    </footer>
  `;
}

function setupCookieConsentControls() {
  app.querySelectorAll("[data-cookie-accept]").forEach((button) => {
    button.addEventListener("click", () => {
      saveCookieConsent({ analytics: true, ads: true, affiliates: true });
      render();
    });
  });

  app.querySelectorAll("[data-cookie-reject]").forEach((button) => {
    button.addEventListener("click", () => {
      saveCookieConsent({ analytics: false, ads: false, affiliates: false });
      render();
    });
  });

  app.querySelectorAll("[data-cookie-manage]").forEach((button) => {
    button.addEventListener("click", () => {
      state.cookiePreferencesOpen = true;
      render();
    });
  });

  app.querySelectorAll("[data-cookie-close]").forEach((button) => {
    button.addEventListener("click", () => {
      state.cookiePreferencesOpen = false;
      render();
    });
  });

  app.querySelectorAll("[data-cookie-save]").forEach((button) => {
    button.addEventListener("click", () => {
      const preferences = { analytics: false, ads: false, affiliates: false };
      app.querySelectorAll("[data-cookie-pref]").forEach((input) => {
        preferences[input.dataset.cookiePref] = input.checked;
      });
      saveCookieConsent(preferences);
      render();
    });
  });
}

function setStructuredData(id, data) {
  const existing = document.getElementById(id);
  if (!data) {
    if (existing) existing.remove();
    return;
  }
  const element = existing || document.createElement("script");
  element.id = id;
  element.type = "application/ld+json";
  element.textContent = JSON.stringify(data);
  if (!existing) document.head.appendChild(element);
}

function megaMenuLinks(key) {
  if (key === "notes") {
    return notesSubjects().map((subject) => ({
      href: "/search",
      label: subject.title,
      body: `${subject.unitCount} units, ${subject.topicCount} topics`,
      icon: iconNameFor(subject.title),
      extra: `data-search-seed="${escapeHtml(subject.search)}"`
    }));
  }

  if (key === "courses") {
    const programmes = (state.data && state.data.programmes ? state.data.programmes : []).slice(0, 6).map((programme) => ({
      href: `/courses/${programme.id}`,
      label: programme.label,
      body: `${programme.stats.unitCount} units, ${programme.stats.topicCount || 0} topics`,
      icon: iconNameFor(programme.label)
    }));
    return [
      { href: "/courses", label: "All Courses", body: "Browse every nursing and midwifery programme", icon: "graduationCap" },
      { href: "/courses/curriculum", label: "Curriculum Maps", body: "Move by programme, year and semester", icon: "listChecks" },
      ...programmes
    ];
  }

  if (key === "careers") {
    return [
      { href: "/careers", label: "Jobs Board", body: "Search nursing roles, internships and international listings", icon: "briefcaseMedical" },
      { href: "/careers", label: "Career Hub", body: "Pathways, licensing, CV tools and work abroad guides", icon: "map" },
      { href: "/careers", label: "International Nursing", body: "UK, Australia, Gulf and regional mobility notes", icon: "externalLink" },
      { href: "/careers", label: "Licensing Guides", body: "UNMC, good standing and recognition checklists", icon: "badgeCheck" },
      { href: "/careers", label: "CV Resources", body: "Templates, cover letters, interviews and portfolios", icon: "fileText" }
    ];
  }

  if (key === "dictionary") {
    return [
      { href: "/dictionary", label: "All Terms", body: "Search nursing and medical definitions", icon: "search" },
      { href: "/dictionary/category/anatomy", label: "Anatomy", body: "Body structures, tissues and systems", icon: "activity" },
      { href: "/dictionary/category/clinical-skills", label: "Clinical Skills", body: "Assessment, documentation and bedside terms", icon: "stethoscope" },
      { href: "/dictionary/category/pharmacology", label: "Pharmacology", body: "Medicines, routes and safety concepts", icon: "pill" },
      { href: "/dictionary/abbreviations", label: "Abbreviations", body: "Common nursing abbreviations in one lookup table", icon: "fileText" }
    ];
  }

  return [
    { href: "/resources/books", label: "Digital Library", body: "Curated medical and nursing book sources", icon: "bookOpen" },
    { href: "/resources/past-papers", label: "Past Papers", body: "Exam practice and revision sets", icon: "fileText" },
    { href: "/resources/quizzes", label: "Quick Quizzes", body: "Practice active recall by topic", icon: "helpCircle" },
    { href: "/resources/medical-instruments", label: "Medical Instruments", body: "Uses, safety points and OSCE notes", icon: "stethoscope" },
    { href: "/resources/schools", label: "Schools Directory", body: "Training options and recognition notes", icon: "school" },
    { href: "/resources/licensing", label: "Licensing And CPD", body: "Professional document planning", icon: "badgeCheck" },
    { href: "/resources/student-support", label: "Student Support", body: "Study planning and placement support", icon: "heartPulse" }
  ];
}

function renderMegaMenu(key, item, active) {
  const links = megaMenuLinks(key);
  const helper = key === "notes"
    ? "Choose focused notes by subject area"
    : key === "courses"
      ? "Open programmes, units and curriculum maps"
      : key === "careers"
        ? "Find roles, licensing and career support"
        : key === "dictionary"
          ? "Search clear nursing and medical definitions"
        : "Open study tools, papers and clinical references";
  const quickLinks = key === "courses"
    ? [["/courses", "All programmes"], ["/courses/curriculum", "Curriculum map"], ["/notes", "Continue studying"]]
    : key === "resources"
      ? [["/resources/books", "Books"], ["/resources/medical-instruments", "Instruments"], ["/resources/past-papers", "Past papers"]]
      : key === "careers"
        ? [["/careers", "Jobs board"], ["/careers", "Career paths"], ["/careers", "CV support"]]
        : key === "dictionary"
          ? [["/dictionary", "All terms"], ["/dictionary/abbreviations", "Abbreviations"], ["/dictionary/category/anatomy", "Anatomy"]]
        : [["/notes", "Subject notes"], ["/courses", "Courses"], ["/resources", "Resources"]];
  return `
    <div class="mega-item mega-${key}${state.megaOpen === key ? " open" : ""}">
      <a class="mega-trigger ${active === key ? "active" : ""}" href="${item.href}" data-mega-toggle="${key}" aria-expanded="${state.megaOpen === key ? "true" : "false"}">
        ${icon(item.icon)}<span>${item.label}</span>
      </a>
      <div class="mega-panel" role="group" aria-label="${escapeHtml(item.label)} menu">
        <div class="mega-panel-head">
          <div>
            <span class="mega-eyebrow">Nursing Uganda</span>
            <strong>${escapeHtml(item.label)}</strong>
          </div>
          <a class="mega-head-link" href="${escapeHtml(item.href)}">${escapeHtml(helper)} ${icon("arrowRight")}</a>
        </div>
        <div class="mega-grid">
          ${links.map((link, index) => `
            <a class="mega-link${index < 2 ? " featured" : ""}" href="${escapeHtml(link.href)}"${link.extra ? ` ${link.extra}` : ""}>
              <span class="mega-icon">${icon(link.icon)}</span>
              <span><strong>${escapeHtml(link.label)}</strong><small>${escapeHtml(link.body)}</small></span>
            </a>
          `).join("")}
        </div>
        <div class="mega-panel-foot">
          <span>Quick access</span>
          ${quickLinks.map(([href, label]) => `<a href="${escapeHtml(href)}">${escapeHtml(label)}</a>`).join("")}
        </div>
      </div>
    </div>
  `;
}

function renderMainNav(active) {
  return Object.entries(routeMap).map(([key, item]) => renderMegaMenu(key, item, active)).join("");
}

function renderImageLightbox() {
  if (!state.lightboxImage) return "";
  return `
    <div class="image-lightbox" role="dialog" aria-modal="true" aria-label="Expanded lesson image" data-lightbox-close>
      <figure>
        <button type="button" aria-label="Close expanded image" data-lightbox-close>${icon("x")}</button>
        <img src="${escapeHtml(state.lightboxImage)}" alt="${escapeHtml(state.lightboxAlt || "Expanded lesson image")}">
        ${state.lightboxAlt ? `<figcaption>${escapeHtml(state.lightboxAlt)}</figcaption>` : ""}
      </figure>
    </div>
  `;
}

function renderPreFooterBand() {
  return `
    <div class="pre-footer-band">
      <div class="container pre-footer-inner">
        <div class="pre-footer-text">
          <span class="eyebrow pre-footer-eyebrow">Your Toolkit</span>
          <h3>Everything you need to revise, in one place</h3>
          <p>Search notes, open courses, or look up any term in the dictionary — all free and offline-ready.</p>
        </div>
        <div class="pre-footer-actions">
          ${buttonLink("/search", "Search Everything", "primary", "search")}
          ${buttonLink("/courses", "Open Courses", "secondary", "graduationCap")}
          ${buttonLink("/dictionary", "Dictionary", "ghost", "fileText")}
        </div>
      </div>
    </div>
  `;
}

function layout(content) {
  const parts = currentRoute();
  const active = routeKey(parts);
  app.innerHTML = `
    <div class="app-shell">
      <header class="site-header">
        <div id="reading-progress-bar" role="progressbar" aria-hidden="true"></div>
        <div class="container nav-shell">
          <a class="brand" href="/notes" aria-label="Nursing Uganda notes home">
            <span class="brand-mark">NU</span>
            <div class="brand-text">
              <strong>Nursing Uganda</strong>
              <small>Notes &amp; Resources</small>
            </div>
          </a>
          <nav class="main-nav${state.navOpen ? " open" : ""}" data-main-nav aria-label="Main navigation">
            ${renderMainNav(active)}
          </nav>
          <div class="nav-actions">
            <a class="nav-search-pill" href="/search" aria-label="Search notes">${icon("search")}<span>Search</span></a>
            <button class="mobile-toggle" type="button" data-nav-toggle aria-label="Open menu" aria-expanded="${state.navOpen}">
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>
      </header>
      <div class="page-main" id="page-main">
        ${content}
      </div>
      ${renderPreFooterBand()}
      ${renderFooter()}
      ${renderCookieConsent()}
      ${renderImageLightbox()}
    </div>
  `;

  const toggle = app.querySelector("[data-nav-toggle]");
  if (toggle) {
    toggle.addEventListener("click", () => {
      state.navOpen = !state.navOpen;
      if (!state.navOpen) state.megaOpen = "";
      render();
    });
  }

  app.querySelectorAll("[data-mega-toggle]").forEach((trigger) => {
    trigger.addEventListener("click", (event) => {
      const key = trigger.dataset.megaToggle || "";
      const isMobileNav = window.matchMedia("(max-width: 760px)").matches || state.navOpen;
      if (isMobileNav || state.megaOpen !== key) {
        event.preventDefault();
        state.megaOpen = state.megaOpen === key ? "" : key;
        render();
      } else {
        state.megaOpen = "";
      }
    });
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".main-nav")) state.megaOpen = "";
  }, { once: true });

  setupCookieConsentControls();
  setupLightboxControls();
  setupLessonTocActiveState();
  setupLessonRevealAnimations();
  hydrateAdSlots();
  setupReadingProgress();
  setupSwipeNavigation();
  setupLessonNotes();
  setupFlashcards();
}

function setupLightboxControls() {
  app.querySelectorAll("[data-lightbox-image]").forEach((button) => {
    button.addEventListener("click", () => {
      state.lightboxImage = button.dataset.lightboxImage || "";
      state.lightboxAlt = button.dataset.lightboxAlt || "";
      render();
    });
  });

  app.querySelectorAll("[data-lightbox-close]").forEach((element) => {
    element.addEventListener("click", (event) => {
      if (element.matches("button") || event.target === element) {
        state.lightboxImage = "";
        state.lightboxAlt = "";
        render();
      }
    });
  });
}

function setupLessonTocActiveState() {
  const links = Array.from(app.querySelectorAll("[data-toc-link]"));
  if (!links.length || !("IntersectionObserver" in window)) return;
  const byId = new Map(links.map((link) => [link.dataset.tocLink, links.filter((item) => item.dataset.tocLink === link.dataset.tocLink)]));
  const sections = Array.from(byId.keys()).map((id) => document.getElementById(id)).filter(Boolean);
  const setActive = (id) => {
    links.forEach((link) => link.classList.toggle("active", link.dataset.tocLink === id));
  };
  const observer = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
    if (visible && visible.target.id) setActive(visible.target.id);
  }, { rootMargin: "-20% 0px -65% 0px", threshold: [0, 0.2, 0.6] });
  sections.forEach((section) => observer.observe(section));
  if (sections[0]) setActive(sections[0].id);
}

function setupLessonRevealAnimations() {
  const elements = Array.from(app.querySelectorAll("[data-lesson-reveal]"));
  if (!elements.length) return;
  if (!("IntersectionObserver" in window)) {
    elements.forEach((element) => element.classList.add("is-visible"));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { rootMargin: "0px 0px -12% 0px", threshold: 0.12 });
  elements.forEach((element) => observer.observe(element));
}

const legalPages = {
  privacy: {
    title: "Privacy Policy",
    eyebrow: "Privacy",
    intro: "This policy explains how Nursing Uganda handles personal data, site preferences, analytics, advertising tools, affiliate links and external links.",
    sections: [
      ["Who We Are", "Nursing Uganda is an educational revision website for nursing and midwifery learners. For website privacy purposes, Nursing Uganda acts as the data controller for information collected through this site. Contact us at info@nursinguganda.com for privacy questions, corrections or content concerns."],
      ["What We Collect", "We may collect basic technical information such as browser type, pages viewed, device details, approximate location, cookie choices and messages you send to us. If Google Analytics, Google AdSense or affiliate tools are enabled, those partners may process data according to your consent choices."],
      ["How We Use Data", "We use data to keep the website running, remember preferences, improve study resources, measure useful pages, prevent abuse, respond to messages and prepare the site for advertising or affiliate-supported income."],
      ["Learning Content", "Our content is gathered and rewritten from a series of books, libraries, open educational sources, local PDFs, class materials and peer-to-peer revision inputs. It is for revision and study support only, not a replacement for formal student notes, tutor instruction, official curriculum, clinical supervision or current professional guidelines."],
      ["Your Data Rights", "You may request access, correction, deletion or restriction of personal data you have provided to us, and you may withdraw optional consent for analytics, advertising or affiliate tracking. Email info@nursinguganda.com and describe the request clearly so we can review it."],
      ["Retention And Security", "We keep contact messages and preference records only for as long as reasonably needed for support, compliance, improvement and abuse prevention. If we learn of a material data incident affecting users, we will review the issue and take reasonable steps to notify affected users or relevant authorities where required."],
      ["External Links", "The website may link to third-party resources, libraries, videos, job platforms, school pages, regulators and partner websites. We do not control their privacy practices, cookies or content."],
      ["Your Choices", "You can accept, reject or manage optional analytics, advertising and affiliate tracking from the cookie banner or the Cookie Preferences link in the footer. Necessary storage remains active so the website can remember core preferences."]
    ]
  },
  cookies: {
    title: "Cookie Policy",
    eyebrow: "Cookies",
    intro: "This page explains the cookies and similar storage Nursing Uganda may use as the site becomes ready for Google Analytics, Google AdSense and affiliate monetization.",
    sections: [
      ["Necessary Cookies", "Necessary storage supports basic navigation, theme preferences, saved school view, saved jobs, bookmarks and your consent choice. These are required for the website to work properly."],
      ["Analytics Cookies", "Analytics cookies may be used only when you consent. They help us understand which lessons, resources and instruments students use most so we can improve the revision experience."],
      ["Advertising Cookies", "Google AdSense or similar advertising tools may use cookies and device signals to deliver, limit and measure ads once publisher settings are configured. These tools load only after advertising consent."],
      ["Google CMP Readiness", "If Nursing Uganda serves personalized ads to users in the EEA, the United Kingdom or Switzerland, the site should use a Google-certified consent management platform integrated with the IAB Transparency and Consent Framework before those ads are enabled for that traffic."],
      ["Affiliate Tracking", "Some external resource links may become affiliate links. If a user follows a disclosed affiliate link, a partner may use cookies or referral codes to attribute a commission. Affiliate income does not influence the educational warning that learners must confirm material with formal sources."],
      ["Managing Preferences", "Use the Cookie Preferences link in the footer to change optional choices. You can also delete cookies from your browser settings at any time."]
    ]
  },
  "privacy-choices": {
    title: "Privacy Choices",
    eyebrow: "Consent Centre",
    intro: "Review and change optional tracking choices for analytics, advertising, affiliate measurement and similar partner tools.",
    sections: [
      ["What You Can Control", "You can accept or reject optional analytics, advertising and affiliate tracking. Necessary storage remains active because it keeps the website functional and remembers your choices."],
      ["Analytics", "Analytics helps Nursing Uganda understand which notes, resources and instrument pages are useful. It should not be used to replace personal academic support or identify individual student performance."],
      ["Advertising And AdSense", "Advertising tools stay dormant until publisher IDs and ad slots are configured. When enabled, they should load only after the relevant advertising consent has been saved."],
      ["Affiliate Links", "Affiliate or partner links should be labelled near the link. Where a commission may be earned, the disclosure should be clear before you open the external page."],
      ["Do Not Sell Or Share Style Requests", "Nursing Uganda does not currently sell personal information. If future advertising or partner systems create regional opt-out obligations, this page is the place where those choices will be surfaced."]
    ]
  },
  corrections: {
    title: "Corrections And Takedown",
    eyebrow: "Content Review",
    intro: "Report incorrect clinical information, outdated revision notes, copyright concerns, image issues or source problems.",
    sections: [
      ["What To Report", "Send corrections for inaccurate definitions, unsafe clinical wording, outdated guidance, missing source context, broken external links, image concerns, copyright requests or content that appears too close to another publisher."],
      ["What To Include", "Please include the page URL, lesson title, the sentence or image concerned, the corrected wording or source, and whether the issue is urgent for patient safety or examination accuracy."],
      ["Review Process", "We will review reports, compare with formal references where possible, edit or remove material when appropriate, and keep the content positioned as revision support rather than official guidance."],
      ["Rights Holder Requests", "If you own rights in a text, PDF, image or other material and want it removed or credited differently, email info@nursinguganda.com with enough detail to identify the material and your relationship to it."],
      ["Clinical Safety", "For urgent clinical decisions, do not rely on the website. Consult a tutor, supervisor, facility protocol, approved textbook or current official guideline."]
    ]
  },
  disclaimer: {
    title: "Disclaimer",
    eyebrow: "Study Disclaimer",
    intro: "Nursing Uganda supports revision, peer-to-peer learning and quick topic review. It is not a substitute for formal nursing or midwifery education.",
    sections: [
      ["No Replacement For Formal Notes", "The notes, instruments, videos, images, summaries and related lessons do not replace school notes, lecturer handouts, approved textbooks, clinical manuals, professional standards or the official curriculum used by your institution."],
      ["Not Professional Advice", "The website does not provide medical, nursing, midwifery, legal, licensing or employment advice. Clinical decisions must be confirmed with tutors, supervisors, facility protocols, current guidelines and qualified professionals."],
      ["Sources And Accuracy", "Information is gathered from many books, libraries, PDFs, open sources, references and student revision inputs, then rewritten for originality and clarity. We try to keep it useful, but mistakes, outdated details or missing context may occur."],
      ["Licensing And Regulators", "Nursing Uganda is not a licensing body and does not issue professional licences, school recognition, examination approval or registration status. Always verify official matters with the relevant regulator or institution."],
      ["External And Affiliate Links", "External links are provided for convenience and further study. Some may be affiliate links in future, and Nursing Uganda may earn a commission when users buy or register through disclosed partner links."]
    ]
  },
  terms: {
    title: "Terms Of Use",
    eyebrow: "Terms",
    intro: "By using Nursing Uganda, you agree to use the website responsibly as a revision and peer-learning resource.",
    sections: [
      ["Educational Use", "You may use Nursing Uganda for personal study, revision, topic discovery and peer-to-peer learning. Do not present the website as official school material, a clinical protocol or a replacement for assessed coursework."],
      ["Responsible Study", "You agree to cross-check important information with your formal notes, approved books, tutors, clinical supervisors, facility policies and current national or institutional guidance."],
      ["Content Ownership And Sources", "Nursing Uganda compiles, rewrites and organizes learning material from multiple public, educational and local reference sources. Some images, PDFs, videos or links may come from third-party sources and remain subject to their own rights and terms."],
      ["External Links And Jobs", "We may link to schools, regulators, YouTube videos, job boards, book libraries and other external websites. Always verify applications, payments, deadlines and personal data requests directly with the official source."],
      ["Monetization", "The website may use Google Analytics, Google AdSense, sponsored placements or affiliate links. Sponsored or affiliate features must not be treated as clinical endorsement, and affiliate disclosures should appear close to relevant links."],
      ["Contact", "For questions, corrections, takedown requests or partnership matters, email info@nursinguganda.com."]
    ]
  }
};

function renderLegalPage(key) {
  const page = legalPages[key] || legalPages.privacy;
  const legalNav = [
    ["/privacy", "Privacy"],
    ["/privacy-choices", "Privacy Choices"],
    ["/cookies", "Cookies"],
    ["/disclaimer", "Disclaimer"],
    ["/terms", "Terms"],
    ["/corrections", "Corrections"]
  ];

  return `
    <section class="legal-hero">
      <div class="container legal-hero-grid">
        <div>
          <span class="mini-label">${escapeHtml(page.eyebrow)}</span>
          <h1>${escapeHtml(page.title)}</h1>
          <p>${escapeHtml(page.intro)}</p>
          <div class="legal-contact-card">
            ${icon("mail")}
            <span>Contact: <a href="mailto:info@nursinguganda.com">info@nursinguganda.com</a></span>
          </div>
        </div>
        <nav class="legal-nav-card" aria-label="Legal pages">
          <strong>Legal Pages</strong>
          ${legalNav.map(([href, label]) => `<a class="${href === `/${key}` ? "active" : ""}" href="${href}">${escapeHtml(label)}${icon("arrowRight")}</a>`).join("")}
        </nav>
      </div>
    </section>
    <section class="section legal-section">
      <div class="container legal-content">
        <div class="legal-update">Last updated: May 9, 2026</div>
        ${page.sections.map(([title, body]) => `
          <article class="legal-card">
            <h2>${escapeHtml(title)}</h2>
            <p>${escapeHtml(body)}</p>
          </article>
        `).join("")}
        ${key === "privacy-choices" ? `
          <article class="legal-action-card">
            <div>
              <h2>Manage Optional Tracking</h2>
              <p>Open the consent centre to accept, reject or update analytics, advertising and affiliate-link measurement choices.</p>
            </div>
            <button class="button primary" type="button" data-cookie-manage>${buttonLabel("Open Cookie Preferences", "badgeCheck")}</button>
          </article>
        ` : ""}
        ${key === "corrections" ? `
          <article class="legal-action-card">
            <div>
              <h2>Send A Correction</h2>
              <p>Use email for now so you can include screenshots, page URLs and source details. This keeps the review trail clear until a backend form is added.</p>
            </div>
            <a class="button primary" href="mailto:info@nursinguganda.com?subject=Nursing%20Uganda%20content%20correction">${buttonLabel("Email Correction", "mail")}</a>
          </article>
        ` : ""}
        <aside class="legal-note">
          <strong>Important study reminder</strong>
          <p>Nursing Uganda is for revision support and peer learning. Always confirm care, exams, licensing and professional decisions using formal notes, approved references and official sources.</p>
        </aside>
      </div>
    </section>
  `;
}

function hero({ title, body, actions = "", image = imageCatalog.anatomy, breadcrumb = "", stats = [], cues = [] }) {
  const statCues = stats && stats.length ? stats.slice(0, 3).map(([label]) => label) : [];
  const cueLabels = cues.length
    ? cues
    : (statCues.length ? statCues : ["Structured curriculum", "Uganda-focused content", "Revision-ready resources"]);
  return `
    <section class="hero" style="--hero-image: url('${escapeHtml(rootAssetPath(displayImageSrc(image.src)))}')">
      <div class="container hero-grid premium-hero-grid">
        <div class="hero-copy">
          ${breadcrumb}
          <h1>${escapeHtml(title)}</h1>
          <p>${escapeHtml(body)}</p>
          ${actions ? `<div class="hero-actions">${actions}</div>` : ""}
          <div class="hero-cues">
            ${cueLabels.map((cue) => `<span>${escapeHtml(cue)}</span>`).join("")}
          </div>
        </div>
        <aside class="hero-visual" aria-label="${escapeHtml(title)} visual">
          <img src="${escapeHtml(rootAssetPath(displayImageSrc(image.src)))}" alt="${escapeHtml(image.alt || title)}">
        </aside>
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

function searchFilterOptions() {
  return {
    categories: [
      ["all", "All categories"],
      ["anatomy", "Anatomy"],
      ["foundations", "Foundations"],
      ["medical", "Medical Surgical"],
      ["midwifery", "Midwifery"],
      ["pharmacology", "Pharmacology"],
      ["community", "Community Health"],
      ["mental", "Mental Health"],
      ["research", "Research & Books"],
      ["instruments", "Instruments"],
      ["dictionary", "Dictionary"],
      ["schools", "Schools"]
    ],
    types: [
      ["all", "Everything"],
      ["topic-lesson", "Topic + Lesson"],
      ["lesson", "Lessons only"],
      ["topic", "Topics only"],
      ["unit", "Course units"],
      ["research", "Research"],
      ["instrument", "Instruments"],
      ["dictionary", "Dictionary"],
      ["resource", "Resources"],
      ["school", "Schools"]
    ]
  };
}

function searchOptionLabel(group, value) {
  return searchFilterOptions()[group].find(([optionValue]) => optionValue === value)?.[1] || "All";
}

function hasActiveSearchFilters() {
  return state.globalSearchCategory !== "all" || state.globalSearchType !== "all";
}

function searchStarterChips() {
  return [
    ["malaria", "Malaria"],
    ["skeletal system", "Skeletal system"],
    ["fractures", "Fractures"],
    ["drug administration", "Drug administration"],
    ["labour", "Labour"],
    ["blood pressure", "Blood pressure"]
  ];
}

function renderAdvancedSearchForm(extraClass = "") {
  const options = searchFilterOptions();
  const activeFilters = hasActiveSearchFilters();
  return `
    <form class="search-hero advanced-search-hero ${extraClass}" data-global-search-form>
      <div class="search-hero-main">
        <label class="search-main-field">
          ${icon("search")}
          <input class="search-input large" data-global-search type="search" value="${escapeHtml(state.globalSearch)}" placeholder="Search notes, course units, topics or lesson text" aria-label="Search all notes and courses" autocomplete="off">
        </label>
        <button class="button primary search-submit-button" type="submit">${buttonLabel("Search", "search")}</button>
      </div>
      <div class="advanced-filter-row" aria-label="Advanced search filters">
        <label class="premium-select">
          <span>Category</span>
          <select data-search-category aria-label="Filter search by category">
            ${options.categories.map(([value, label]) => `<option value="${escapeHtml(value)}"${state.globalSearchCategory === value ? " selected" : ""}>${escapeHtml(label)}</option>`).join("")}
          </select>
        </label>
        <label class="premium-select">
          <span>Result type</span>
          <select data-search-type aria-label="Filter search by result type">
            ${options.types.map(([value, label]) => `<option value="${escapeHtml(value)}"${state.globalSearchType === value ? " selected" : ""}>${escapeHtml(label)}</option>`).join("")}
          </select>
        </label>
        ${activeFilters ? `<button class="search-clear-filter" type="button" data-search-clear-filters>${icon("x")}<span>Clear filters</span></button>` : ""}
      </div>
      <div class="search-filter-summary">
        <span>${icon("search")} ${escapeHtml(searchOptionLabel("categories", state.globalSearchCategory))}</span>
        <span>${escapeHtml(searchOptionLabel("types", state.globalSearchType))}</span>
      </div>
    </form>
  `;
}

function majorTopicTracks() {
  return [
    ["Clinical Assessment", "Vitals, history taking, examination findings and documentation habits.", "assessment|vital|history|examination", "activity"],
    ["Medication Safety", "Drug classes, dose checks, administration rights and patient teaching.", "drug|pharmacology|medicine|dose|injection", "pill"],
    ["Maternal & Newborn", "Antenatal care, labour, postnatal checks and newborn danger signs.", "midwifery|maternal|newborn|labour|antenatal", "heartPulse"],
    ["Surgical & Wound Care", "Pre-op care, instruments, wounds, theatre safety and recovery notes.", "surgical|wound|theatre|instrument|dressing", "stethoscope"],
    ["Community Research", "PHC, epidemiology, family health, prevention and health education.", "community|public health|epidemiology|prevention", "home"],
    ["Mental Health Practice", "Therapeutic communication, risk assessment and psychiatric nursing.", "mental|psychiatric|counsel|communication", "heartPulse"]
  ].map(([title, body, search, iconName]) => {
    const matches = allStudyTopics().filter(({ programme, unit, topic }) => {
      const text = `${programme.label} ${unit.title} ${topic.groupTitle} ${topic.title}`.toLowerCase();
      return search.split("|").some((term) => text.includes(term));
    });
    return { title, body, search, iconName, count: matches.length };
  });
}

function researchNoteCards() {
  const library = bookLibrary();
  const collections = (library.collections || []).slice(0, 3);
  const base = collections.length ? collections.map((collection) => ({
    title: collection.title,
    body: collection.fit || "Source-linked reading for deeper nursing revision.",
    search: collection.subjects && collection.subjects[0] ? collection.subjects[0] : "research",
    meta: `${collection.score || "Curated"}% match`,
    iconName: "bookOpen"
  })) : [];
  return [
    ...base,
    {
      title: "Official PDF Review",
      body: "Use WHO, Open RN and local PDF references to confirm high-risk clinical topics.",
      search: "WHO reference nursing PDF",
      meta: "Reference check",
      iconName: "fileText"
    },
    {
      title: "Evidence Notes",
      body: "Compare lesson summaries against books, libraries and current clinical guidance.",
      search: "research nursing evidence",
      meta: "Research method",
      iconName: "clipboardList"
    }
  ].slice(0, 5);
}

function renderProgressRing(percent, size = 140) {
  const r = (size / 2) - 12;
  const circumference = 2 * Math.PI * r;
  const dashOffset = circumference * (1 - percent / 100);
  return `
    <svg class="progress-dash-ring" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" aria-hidden="true">
      <defs>
        <linearGradient id="prog-ring-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#1a5f7a" />
          <stop offset="50%" stop-color="#00bcd4" />
          <stop offset="100%" stop-color="#0f7f4f" />
        </linearGradient>
      </defs>
      <circle cx="${size / 2}" cy="${size / 2}" r="${r}" />
      <circle cx="${size / 2}" cy="${size / 2}" r="${r}" style="stroke-dasharray:${circumference.toFixed(2)};stroke-dashoffset:${dashOffset.toFixed(2)}" />
    </svg>
  `;
}

function renderProgress() {
  const progress = overallProgress();
  const streak = updateStreak();
  const masteredCount = Object.keys(masteredTopics()).length;
  const saved = bookmarks();
  const completed = completedTopics();

  const subjectBreakdown = notesSubjects().map((subject) => {
    const matches = subjectUnits(subject.pattern);
    const topicList = matches.flatMap(({ programme, unit }) =>
      flatTopics(unit).map((topic) => ({ programme, unit, topic }))
    );
    const done = topicList.filter(({ programme, unit, topic }) => completed[topicKey(programme, unit, topic)]).length;
    const total = topicList.length;
    return { title: subject.title, done, total, percent: total ? Math.round((done / total) * 100) : 0 };
  });

  const encouragement = progress.percent >= 80
    ? "Exceptional — you're in the final stretch. Push through to 100%."
    : progress.percent >= 50
      ? "More than halfway. Keep your daily habit and you'll finish strong."
      : "Great start. One lesson a day adds up fast — let your streak carry you.";

  return `
    ${hero({
      title: "My Study Progress",
      body: "Track your completed lessons, quiz mastery, study streak and bookmarks across all programmes.",
      image: imageCatalog.curriculum,
      actions: `${buttonLink("/courses", "Continue Studying", "primary", "graduationCap")}${buttonLink("/notes", "Back to Notes", "secondary", "bookOpen")}`
    })}
    <section class="section">
      <div class="container">

        <div class="progress-stat-grid">
          <div class="progress-stat-tile">
            <div class="progress-stat-icon psi-primary">${icon("checkCircle")}</div>
            <div><strong>${progress.done}</strong><span>Lessons Complete</span><small>of ${progress.total} mapped</small></div>
          </div>
          <div class="progress-stat-tile">
            <div class="progress-stat-icon psi-flame">${icon("flame")}</div>
            <div><strong>${streak.count}</strong><span>Day Streak</span><small>${streak.count >= 7 ? "Incredible!" : streak.count >= 3 ? "Building momentum" : "Keep it going"}</small></div>
          </div>
          <div class="progress-stat-tile">
            <div class="progress-stat-icon psi-trophy">${icon("trophy")}</div>
            <div><strong>${masteredCount}</strong><span>Quizzes Mastered</span><small>Perfect scores</small></div>
          </div>
          <div class="progress-stat-tile">
            <div class="progress-stat-icon psi-bookmark">${icon("bookmark")}</div>
            <div><strong>${saved.length}</strong><span>Saved Bookmarks</span><small>Topics &amp; lessons</small></div>
          </div>
        </div>

        <div class="progress-overall-panel content-panel">
          <div class="progress-ring-wrap">
            ${renderProgressRing(progress.percent)}
            <div class="progress-ring-center">
              <strong>${progress.percent}%</strong>
              <span>Complete</span>
            </div>
          </div>
          <div class="progress-overall-body">
            <span class="mini-label">Overall Progress</span>
            <h2>${progress.done} of ${progress.total} lessons completed</h2>
            <p>${escapeHtml(encouragement)}</p>
            <div class="progress-bar" style="margin-top:16px;margin-bottom:20px">
              <span style="width:${progress.percent}%"></span>
            </div>
            ${buttonLink("/courses", "Continue Studying", "primary", "arrowRight")}
          </div>
        </div>

        <div class="section-head slim-head" style="margin-top:48px">
          <div>
            <h2>Progress by Subject</h2>
            <p>Completed lessons across each nursing subject area.</p>
          </div>
        </div>
        <div class="progress-subject-list">
          ${subjectBreakdown.map((sub) => `
            <div class="progress-subject-row">
              <div class="progress-subject-info">
                <span class="progress-subject-icon">${iconFor(sub.title)}</span>
                <div>
                  <strong>${escapeHtml(sub.title)}</strong>
                  <small>${sub.done} of ${sub.total} lessons</small>
                </div>
              </div>
              <div class="progress-subject-track">
                <div class="progress-bar progress-subject-bar">
                  <span style="width:${sub.percent}%"></span>
                </div>
                <span class="progress-subject-pct">${sub.percent}%</span>
              </div>
            </div>
          `).join("")}
        </div>

        ${saved.length ? `
          <div class="section-head slim-head" style="margin-top:48px">
            <div><h2>Saved Bookmarks</h2><p>Your bookmarked topics and lessons for quick return.</p></div>
            ${buttonLink("/notes", "All Notes", "secondary", "bookOpen")}
          </div>
          <div class="saved-grid">
            ${saved.slice(0, 6).map((item) => `
              <a class="saved-card" href="${escapeHtml(item.href)}">
                <span>${escapeHtml(item.type)}</span>
                <strong>${escapeHtml(item.title)}</strong>
                ${item.context ? `<small>${escapeHtml(item.context)}</small>` : ""}
              </a>
            `).join("")}
          </div>
        ` : ""}

      </div>
    </section>
  `;
}

function pageHeader({ title, body = "", eyebrow = "", actions = "", breadcrumb = "" }) {
  return `
    <div class="page-header">
      <div class="container">
        ${breadcrumb}
        ${eyebrow ? `<span class="eyebrow page-eyebrow">${escapeHtml(eyebrow)}</span>` : ""}
        <div class="page-header-row">
          <div>
            <h1 class="page-header-title">${escapeHtml(title)}</h1>
            ${body ? `<p class="page-header-body">${escapeHtml(body)}</p>` : ""}
          </div>
          ${actions ? `<div class="page-header-actions">${actions}</div>` : ""}
        </div>
      </div>
    </div>
  `;
}

function renderNotes() {
  const subjects = notesSubjects();
  const progress = overallProgress();
  const last = lastStudiedTopic();
  const saved = bookmarks().slice(0, 3);
  const totals = state.data?.totals || {};
  const programmeCount = state.data?.programmes?.length || 0;
  const dictionaryCount = dictionaryTerms().length;
  const instrumentCount = allMedicalInstruments().length;
  const streak = updateStreak();
  const masteryCount = flashcardMastery().size;
  const completed = completedTopics();

  const subjectPct = (subject) => {
    const subTopics = allStudyTopics().filter(({ programme, unit, topic }) => {
      const text = `${programme.label} ${unit.title} ${topic.groupTitle || ""} ${topic.title}`.toLowerCase();
      return subject.pattern.split("|").some((t) => text.includes(t));
    });
    const done = subTopics.filter(({ programme, unit, topic }) => completed[topicKey(programme, unit, topic)]).length;
    return { done, pct: subTopics.length ? Math.round((done / subTopics.length) * 100) : 0 };
  };

  const tools = [
    { href: "/flashcards",                    iconName: "bookOpen",        label: "Flashcards",   desc: "Active recall" },
    { href: "/dictionary",                    iconName: "fileText",        label: "Dictionary",   desc: "800+ terms" },
    { href: "/resources/quizzes",             iconName: "helpCircle",      label: "Quizzes",      desc: "Test yourself" },
    { href: "/resources/medical-instruments", iconName: "stethoscope",     label: "Instruments",  desc: "Clinical atlas" },
    { href: "/resources/past-papers",         iconName: "clipboardList",   label: "Past Papers",  desc: "Exam prep" },
    { href: "/careers",                       iconName: "briefcaseMedical",label: "Careers",      desc: "Your pathway" }
  ];

  return `
    ${pageHeader({
      eyebrow: "Study Hub",
      title: "Nursing Notes",
      body: "Structured nursing and midwifery notes, curriculum maps and revision resources for Uganda students.",
      actions: `${buttonLink("/courses", "Open Courses", "primary", "graduationCap")}${buttonLink("/search", "Search", "secondary", "search")}`
    })}
    <div class="notes-stats-strip">
      <div class="container">
        <span>${icon("graduationCap")}<strong>${programmeCount || 7}</strong> Programmes</span>
        <span>${icon("bookOpen")}<strong>${totals.courseUnits || 95}</strong> Course Units</span>
        <span>${icon("fileText")}<strong>${dictionaryCount}</strong> Terms</span>
        <span>${icon("stethoscope")}<strong>${instrumentCount}</strong> Instruments</span>
      </div>
    </div>
    <section class="section compact-section">
      <div class="container">
        ${renderAdvancedSearchForm()}
      </div>
    </section>
    <section class="section compact-section">
      <div class="container">
        <div class="continue-strip content-panel">
          <div class="continue-strip-info">
            ${streakChip()}
            <h3>${last ? escapeHtml(last.title) : "Start Your First Lesson"}</h3>
            <p>${last ? `${escapeHtml(last.programme)} — ${escapeHtml(last.unit)}` : "Open any course lesson and Nursing Uganda will track where you stopped."}</p>
          </div>
          <div class="continue-strip-stats">
            <div><strong>${progress.percent}%</strong><span>complete</span></div>
            <div><strong>${streak.count || 0}</strong><span>day streak</span></div>
            ${masteryCount > 0 ? `<div><strong>${masteryCount}</strong><span>mastered</span></div>` : ""}
          </div>
          ${buttonLink(last ? last.href : "/courses", last ? "Resume" : "Start Learning", "primary", last ? "bookOpen" : "graduationCap")}
        </div>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <div class="section-head slim-head">
          <div>
            <span class="eyebrow">Browse by Subject</span>
            <h2>Choose a Subject</h2>
          </div>
          <a class="section-head-link" href="/search">${icon("search")}<span>Search all notes</span></a>
        </div>
        <div class="subject-list">
          ${subjects.map((subject) => {
            const sp = subjectPct(subject);
            const href = subject.first ? `/courses/${subject.first.programme.id}/${subject.first.unit.id}` : "/search";
            return `
              <a class="subject-row${subject.first ? "" : " subject-row-muted"}" href="${escapeHtml(href)}">
                <span class="subject-row-icon">${iconFor(subject.title)}</span>
                <div class="subject-row-body">
                  <strong>${escapeHtml(subject.title)}</strong>
                  <small>${subject.unitCount} units · ${subject.topicCount} topics</small>
                  <div class="subject-progress-bar"><span style="width:${sp.pct}%"></span></div>
                </div>
                ${sp.pct > 0 ? `<span class="subject-row-pct">${sp.pct}%</span>` : ""}
                ${icon("arrowRight")}
              </a>
            `;
          }).join("")}
        </div>
      </div>
    </section>
    ${saved.length ? `
      <section class="section compact-section">
        <div class="container">
          <div class="section-head slim-head">
            <div>
              <span class="eyebrow">Saved For Later</span>
              <h2>Your Bookmarks</h2>
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
    <section class="section home-tools-section">
      <div class="container">
        <div class="section-head slim-head">
          <div>
            <span class="eyebrow">Your Study Toolkit</span>
            <h2>Study Tools</h2>
          </div>
        </div>
        <div class="home-tools-strip">
          ${tools.map((t) => `
            <a class="home-tool-card" href="${escapeHtml(t.href)}">
              <span class="home-tool-icon">${icon(t.iconName)}</span>
              <div>
                <strong>${escapeHtml(t.label)}</strong>
                <p>${escapeHtml(t.desc)}</p>
              </div>
              ${icon("arrowRight")}
            </a>
          `).join("")}
        </div>
      </div>
    </section>
    <section class="section compact-section">
      <div class="container">
        <div class="home-cta-banner">
          <div>
            <span class="eyebrow">Ready to go deeper?</span>
            <h2>Level Up Your Revision</h2>
            <p>Use flashcards for active recall, test yourself with quizzes, or explore the full medical dictionary.</p>
          </div>
          <div class="home-cta-actions">
            ${buttonLink("/flashcards", "Open Flashcards", "primary", "bookOpen")}
            ${buttonLink("/resources/quizzes", "Take a Quiz", "secondary", "helpCircle")}
            ${buttonLink("/dictionary", "Dictionary", "ghost", "search")}
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderGlobalSearchPage() {
  const query = state.globalSearch.trim();
  const results = globalSearchResults(query);
  const allResults = hasActiveSearchFilters() ? globalSearchResults(query, { applyFilters: false }) : results;
  const filterLimited = query.length >= 2 && !results.length && allResults.length > 0;
  const categoryLabel = searchOptionLabel("categories", state.globalSearchCategory);
  const typeLabel = searchOptionLabel("types", state.globalSearchType);

  return `
    ${pageHeader({
      eyebrow: "Search",
      title: "Search Notes & Courses",
      body: "Find course units, topics and lesson text across nursing and midwifery revision."
    })}
    <section class="section">
      <div class="container">
        ${renderAdvancedSearchForm("search-page-form")}
        ${query.length < 2 ? `
          <div class="search-start-panel">
            <div>
              <span class="eyebrow">Start with a topic</span>
              <h2>Search across the full study library</h2>
              <p>Try a disease, body system, nursing procedure, medicine group, school, dictionary term or instrument.</p>
            </div>
            <div class="search-chip-row">
              ${searchStarterChips().map(([seed, label]) => `<a href="/search" data-search-seed="${escapeHtml(seed)}">${escapeHtml(label)}</a>`).join("")}
            </div>
          </div>
        ` : `
          <div class="section-head search-head">
            <div>
              <h2>${results.length} Results</h2>
              <p>Showing matches for "${escapeHtml(query)}" with ${escapeHtml(categoryLabel)} and ${escapeHtml(typeLabel)}.</p>
            </div>
            ${hasActiveSearchFilters() ? `<button class="search-clear-filter inline" type="button" data-search-clear-filters>${icon("x")}<span>Clear filters</span></button>` : ""}
          </div>
          <div class="search-results">
            ${results.length ? results.map((result) => `
              <a class="search-result-card" href="${result.href}">
                <span class="search-result-icon">${icon(iconFor(result.category || result.type))}</span>
                <span class="search-result-type">${escapeHtml(result.type)}</span>
                <div>
                  <h3>${escapeHtml(result.title)}</h3>
                  <p>${escapeHtml(result.body)}</p>
                  <strong>${escapeHtml(result.context)}</strong>
                </div>
                <span class="search-result-arrow">${icon("arrowRight")}</span>
              </a>
            `).join("") : `
              <div class="search-empty-card">
                <span>${icon(filterLimited ? "filter" : "search")}</span>
                <h3>${filterLimited ? "Filters are hiding matching results" : "No strong matches found"}</h3>
                <p>${filterLimited ? `${allResults.length} result${allResults.length === 1 ? "" : "s"} matched "${escapeHtml(query)}" before filters. Clear filters to see them.` : "Try a shorter word, a broader clinical term, or one of the suggested searches below."}</p>
                ${filterLimited ? `<button class="button secondary" type="button" data-search-clear-filters>${buttonLabel("Search all categories", "search")}</button>` : `
                  <div class="search-chip-row">
                    ${searchStarterChips().slice(0, 4).map(([seed, label]) => `<a href="/search" data-search-seed="${escapeHtml(seed)}">${escapeHtml(label)}</a>`).join("")}
                  </div>
                `}
              </div>
            `}
          </div>
        `}
      </div>
    </section>
  `;
}

function renderQuizHub() {
  const quizTopics = allStudyTopics()
    .filter(({ programme, unit, topic }) => lessonForTopic(programme, unit, topic))
    .slice(0, 36);

  return `
    ${pageHeader({
      eyebrow: "Active Recall",
      title: "Quick Quizzes",
      body: `Practice nursing and midwifery recall. Open a topic, answer the quick quiz, then mark it complete. ${quizTopics.length} quiz-ready topics available.`,
      actions: buttonLink("/resources", "Back to Resources", "secondary", "arrowLeft")
    })}
    <section class="section">
      <div class="container">
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

function programmeVisual(programme) {
  const visuals = {
    "certificate-in-nursing": {
      src: "assets/images/programmes/nursing-uganda-programme-certificate-nursing-premium-w900.jpg",
      alt: "Ugandan student nurses practicing clinical assessment in a skills laboratory"
    },
    "diploma-nursing-direct": {
      src: "assets/images/programmes/nursing-uganda-programme-diploma-nursing-premium-w900.jpg",
      alt: "Nursing students and a tutor reviewing patient care in a training ward"
    },
    "diploma-nursing-extension": {
      src: "assets/images/programmes/nursing-uganda-programme-diploma-nursing-premium-w900.jpg",
      alt: "Nursing students and a tutor reviewing patient care in a training ward"
    },
    "bachelor-of-nursing-science-top-up": {
      src: "assets/images/programmes/nursing-uganda-programme-bns-topup-premium-w900.jpg",
      alt: "Experienced nurses studying digital clinical notes in a modern seminar room"
    }
  };

  if (visuals[programme.id]) return visuals[programme.id];
  if (/midwifery/i.test(programme.label)) {
    return {
      src: "assets/images/programmes/nursing-uganda-programme-midwifery-premium-w900.jpg",
      alt: "Student midwives learning newborn care in a maternity skills laboratory"
    };
  }
  return imageFor(programme.label);
}

function programmeLevel(programme) {
  const label = `${programme.id || ""} ${programme.label || ""}`.toLowerCase();
  if (/bachelor|degree|bns/.test(label)) return "Degree";
  if (/diploma/.test(label)) return "Diploma";
  if (/certificate/.test(label)) return "Certificate";
  return "Other";
}

function programmeFilterOptions() {
  return ["All", "Certificate", "Diploma", "Degree"];
}

function programmeFilterButtons() {
  return programmeFilterOptions().map((level) => `
    <button
      class="programme-filter${state.programmeFilter === level ? " active" : ""}"
      type="button"
      data-programme-level="${escapeHtml(level)}"
      aria-pressed="${state.programmeFilter === level ? "true" : "false"}"
    >${escapeHtml(level)}</button>
  `).join("");
}

function programmeCard(programme) {
  const visual = programmeVisual(programme);
  const stats = [
    ["Years", programme.stats.yearCount],
    ["Semesters", programme.stats.semesterCount],
    ["Units", programme.stats.unitCount],
    ["Topics", programme.stats.topicCount || 0]
  ];
  return `
    <a class="card programme-card" href="/courses/${programme.id}">
      <span class="programme-art">
        <img src="${escapeHtml(displayImageSrc(visual.src))}" alt="${escapeHtml(visual.alt || programme.label)}" loading="lazy">
        <span class="programme-art-badge" aria-hidden="true">${iconFor(programme.label)}</span>
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
  const section = (title, body, programmes) => {
    const visibleProgrammes = state.programmeFilter === "All"
      ? programmes
      : programmes.filter((programme) => programmeLevel(programme) === state.programmeFilter);
    const countText = `${visibleProgrammes.length} ${visibleProgrammes.length === 1 ? "programme" : "programmes"}`;

    return `
    <section class="programme-section" data-programme-section="${escapeHtml(title)}">
      <div class="section-head programme-section-head">
        <div class="programme-title-block">
          <div class="programme-heading-row">
            <h2>${escapeHtml(title)}</h2>
            <span class="programme-count">${escapeHtml(countText)}</span>
          </div>
          <p>${escapeHtml(body)}</p>
        </div>
        <div class="programme-filter-row" aria-label="${escapeHtml(title)} filters">
          ${programmeFilterButtons()}
        </div>
      </div>
      ${visibleProgrammes.length
        ? `<div class="programme-grid">${visibleProgrammes.map(programmeCard).join("")}</div>`
        : `<div class="programme-empty-panel">${icon("graduationCap")}<strong>No ${escapeHtml(state.programmeFilter.toLowerCase())} programmes here yet</strong><span>Switch to All to see the full curriculum map.</span></div>`}
    </section>
  `;
  };

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
    ${pageHeader({
      eyebrow: "Programmes",
      title: "Courses & Curriculum",
      body: "Browse nursing and midwifery programmes, year and semester pathways, and topic maps.",
      actions: buttonLink("/courses/curriculum", "Curriculum Maps", "secondary", "listChecks")
    })}
    <section class="section">
      <div class="container">
        <label class="search-field course-search-label">
          ${icon("search")}
          <input class="search-input" data-search type="search" value="${escapeHtml(state.search)}" placeholder="Search course units, codes or programmes…" aria-label="Search courses">
        </label>
        ${query ? renderSearchResults(matchedUnits) : programmeSections()}
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
        <a class="unit-card" href="/courses/${programme.id}/${unit.id}">
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
  const programmeCount = state.data?.programmes?.length || 0;
  return `
    ${pageHeader({
      eyebrow: "Curriculum",
      title: "Curriculum Maps",
      body: `All ${programmeCount} nursing and midwifery programmes — drill into semesters, course units and topic lists.`,
      actions: buttonLink("/courses", "All Courses", "secondary", "graduationCap")
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
      body: `A ${programme.stats.yearCount}-year programme with ${programme.stats.semesterCount} semesters and ${programme.stats.unitCount} course units of structured nursing content.`,
      image: imageFor(programme.label),
      breadcrumb: `
        <nav class="hero-breadcrumb" aria-label="Breadcrumb">
          <a href="/courses">Courses</a>
          <span>${icon("arrowRight")}</span>
          <a href="/courses">${escapeHtml(programmeType)}</a>
          <span>${icon("arrowRight")}</span>
          <strong>${escapeHtml(programme.label)}</strong>
        </nav>
      `,
      actions: firstYearKey ? `
        <button class="button primary" type="button" data-scroll-target="${escapeHtml(firstYearKey)}">${buttonLabel("View Year 1", "arrowRight")}</button>
        <a class="button secondary" href="/courses">${buttonLabel("All Programmes", "graduationCap")}</a>
      ` : "",
      cues: [
        `${programme.stats.yearCount} Years`,
        `${programme.stats.semesterCount} Semesters`,
        `${programme.stats.unitCount} Units`,
        `${programme.stats.topicCount || totalTopics} Topics`
      ],
      stats: [
        ["Years", programme.stats.yearCount, "calendar"],
        ["Semesters", programme.stats.semesterCount, "listChecks"],
        ["Course Units", programme.stats.unitCount, "bookOpen"],
        ["Topics", programme.stats.topicCount || totalTopics, "graduationCap"]
      ]
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
                      <a class="unit-card curriculum-unit-card" href="/courses/${programme.id}/${unit.id}">
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

function lmsCourseTitle(programme, unit) {
  if (programme.id === "certificate-in-nursing" && unit.id === "anatomy-and-physiology-l-and-first-aid") {
    return "Anatomy and Physiology 1";
  }
  return unit.title.replace(/\s*&\s*/g, " and ").replace(/\bl\b/g, "1");
}

function anatomyPhysiologyOneLessonTitles() {
  return [
    "Terms Used in Anatomy and Physiology",
    "Human Body Organization",
    "Body Fluids, Transport and Homeostasis",
    "Atoms, Molecules and Compounds",
    "Cell Structure and Function",
    "Tissue Structure and Function",
    "Blood and Its Composition",
    "Cardiovascular System",
    "Lymphatic System",
    "Digestive System",
    "Skeletal System",
    "Muscular System"
  ];
}

function lmsLessonTitle(programme, unit, topic) {
  if (programme.id === "certificate-in-nursing" && unit.id === "anatomy-and-physiology-l-and-first-aid" && Number(topic.groupIndex) === 0) {
    return anatomyPhysiologyOneLessonTitles()[Number(topic.topicIndex)] || topic.title;
  }
  const moduleText = `${unit && unit.id ? unit.id : ""} ${unit && unit.title ? unit.title : ""} ${topic && topic.groupTitle ? topic.groupTitle : ""}`.toLowerCase();
  const topicTitle = String(topic && topic.title ? topic.title : "").toLowerCase();
  if (/anatomy/.test(moduleText) && /physiology/.test(moduleText)) {
    if (/terms/.test(topicTitle)) return "Terms Used in Anatomy and Physiology";
    if (/human body organi[sz]ation/.test(topicTitle)) return "Human Body Organization";
    if (/body fluids|transport|homeostasis/.test(topicTitle)) return "Body Fluids, Transport and Homeostasis";
  }
  return topic.title;
}

function lmsModuleTitle(programme, unit, topic) {
  if (programme.id === "certificate-in-nursing" && unit.id === "anatomy-and-physiology-l-and-first-aid") {
    return Number(topic.groupIndex) === 0 ? "Anatomy and Physiology" : "First Aid";
  }
  const moduleText = `${unit && unit.id ? unit.id : ""} ${unit && unit.title ? unit.title : ""} ${topic && topic.groupTitle ? topic.groupTitle : ""}`.toLowerCase();
  if (/anatomy/.test(moduleText) && /physiology/.test(moduleText) && anatomyPhysiologyCanonicalLessonIndex(programme, unit, topic) >= 0) {
    return "Anatomy and Physiology";
  }
  return topic.groupTitle || "Module";
}

function lmsLessonDescription(title, programme, unit) {
  const descriptions = {
    "Terms Used in Anatomy and Physiology": "Learn the key anatomical terms used to describe the human body, body positions, planes, directions, and regions.",
    "Human Body Organization": "Understand how the body is organized from cells and tissues to organs, systems and the complete human organism.",
    "Body Fluids, Transport and Homeostasis": "Study body fluid compartments, transport processes and how homeostasis keeps the internal environment stable.",
    "Atoms, Molecules and Compounds": "Build the basic chemistry foundation needed to understand cells, tissues and body functions.",
    "Cell Structure and Function": "Explore the main parts of a cell and how each structure supports life, growth and repair.",
    "Tissue Structure and Function": "Compare epithelial, connective, muscle and nervous tissue and relate their structure to function.",
    "Blood and Its Composition": "Review blood cells, plasma, haemoglobin and the major functions of blood in patient care.",
    "Cardiovascular System": "Learn the structure and function of the heart and blood vessels in circulation.",
    "Lymphatic System": "Understand lymph flow, lymph nodes and the system's role in immunity and fluid balance.",
    "Digestive System": "Follow the pathway of food through the digestive tract and the organs that support digestion.",
    "Skeletal System": "Study bones, joints and the supportive framework that protects organs and enables movement.",
    "Muscular System": "Review muscle types, contraction and how muscles work with the skeleton to produce movement."
  };
  return descriptions[title] || `${title} study notes for ${programme.label} in ${lmsCourseTitle(programme, unit)}.`;
}

function lmsLessonIcon(title, index) {
  if (/quiz|question|test/i.test(title)) return "helpCircle";
  if (/video|demonstration/i.test(title)) return "video";
  if (index % 5 === 0) return "fileText";
  return "bookOpen";
}

function correctedAnatomyPhysiologyOneOutline(programme, unit) {
  const groups = unit.topicGroups || [];
  const sourceGroup = groups[0] || { topics: [] };
  const firstAidGroup = groups[1] || { title: "First Aid", topics: [] };
  const lessonTitles = anatomyPhysiologyOneLessonTitles();
  const moduleSpecs = [
    { title: "Anatomy and Physiology", range: [0, 3] },
    { title: "Basic Chemistry and Cells", range: [3, 6] },
    { title: "Body Systems", range: [6, 12] }
  ];
  let lessonNumber = 1;
  const modules = moduleSpecs.map((spec, moduleIndex) => {
    const topics = sourceGroup.topics.slice(spec.range[0], spec.range[1]);
    return {
      title: spec.title,
      label: `Module ${moduleIndex + 1}`,
      lessons: topics.map((topic, offset) => {
        const topicIndex = spec.range[0] + offset;
        const title = lessonTitles[topicIndex] || topic.title;
        return {
          ...topic,
          title,
          originalTitle: topic.title,
          groupIndex: 0,
          topicIndex,
          lessonNumber: lessonNumber++,
          description: lmsLessonDescription(title, programme, unit)
        };
      })
    };
  });

  if (firstAidGroup.topics.length) {
    modules.push({
      title: "First Aid",
      label: `Module ${modules.length + 1}`,
      lessons: firstAidGroup.topics.map((topic, topicIndex) => ({
        ...topic,
        groupIndex: 1,
        topicIndex,
        lessonNumber: lessonNumber++,
        description: lmsLessonDescription(topic.title, programme, unit)
      }))
    });
  }
  return modules;
}

function lmsCourseOutline(programme, unit) {
  if (programme.id === "certificate-in-nursing" && unit.id === "anatomy-and-physiology-l-and-first-aid") {
    return correctedAnatomyPhysiologyOneOutline(programme, unit);
  }

  let lessonNumber = 1;
  return (unit.topicGroups || []).map((group, groupIndex) => ({
    title: group.title,
    label: `Module ${groupIndex + 1}`,
    lessons: group.topics.map((topic, topicIndex) => ({
      ...topic,
      groupIndex,
      topicIndex,
      lessonNumber: lessonNumber++,
      description: lmsLessonDescription(topic.title, programme, unit)
    }))
  }));
}

function renderUnit(programme, unit) {
  const modules = lmsCourseOutline(programme, unit);
  const topics = flatTopics(unit);
  const courseTitle = lmsCourseTitle(programme, unit);
  const lessonCount = modules.reduce((total, module) => total + module.lessons.length, 0);
  const progress = { done: 0, total: lessonCount, percent: 0, available: topics.filter((topic) => lessonForTopic(programme, unit, topic)).length };
  return `
    ${hero({
      title: courseTitle,
      body: lessonCount ? "Course content organized by modules and lessons." : "This course is listed. Detailed lessons will be added soon.",
      image: imageFor(`${unit.title} ${programme.label}`)
    })}
    <section class="section">
      <div class="container app-layout lms-course-shell">
        <aside class="side-panel lms-course-sidebar">
          <span class="sidebar-label">Programme</span>
          <h3>${escapeHtml(programme.label)}</h3>
          <div class="sidebar-course-card">
            <span>Course</span>
            <strong>${escapeHtml(courseTitle)}</strong>
          </div>
          <a href="/courses/${programme.id}">${icon("arrowLeft")}<span>Back to programme</span></a>
          ${topics.length ? `<a class="sidebar-primary-action" href="${topicHref(programme, unit, topics[0].groupIndex, topics[0].topicIndex)}">${icon("bookOpen")}<span>Start first lesson</span></a>` : ""}
          <div class="progress-panel">
            <div class="progress-ring-wrap-inner">
              <svg viewBox="0 0 64 64" aria-hidden="true">
                <circle class="progress-ring-track" cx="32" cy="32" r="28"/>
                <circle class="progress-ring-arc" cx="32" cy="32" r="28"
                  stroke-dasharray="176"
                  stroke-dashoffset="${Math.round(176 * (1 - progress.percent / 100))}"
                  transform="rotate(-90 32 32)"/>
              </svg>
              <div class="progress-ring-label">${progress.percent}%</div>
            </div>
            <div>
              <strong>${progress.done} of ${progress.total}</strong>
              <span>lessons completed</span>
            </div>
          </div>
          <div class="progress-bar slim" aria-label="Course progress"><span style="width: ${progress.percent}%"></span></div>
          <div class="course-quick-facts" aria-label="Course summary">
            <span><strong>Course</strong>${escapeHtml(courseTitle)}</span>
            <span><strong>Modules/Topics</strong>${modules.length}</span>
            <span><strong>Lessons</strong>${lessonCount}</span>
            <span><strong>Progress</strong>${progress.percent}%</span>
          </div>
          <p class="side-note">${progress.available} lessons currently have study notes.</p>
          ${modules.map((module) => `<button type="button" data-scroll-target="${groupId(module.title)}">${icon("listChecks")}<span>${escapeHtml(module.label)}: ${escapeHtml(module.title)}</span></button>`).join("")}
        </aside>
        <div class="lms-course-main">
          <div class="course-overview-panel">
            <div>
              <span class="course-context">${escapeHtml(programme.label)} / Course</span>
              <h2>${escapeHtml(courseTitle)}</h2>
              <p>Course content organized by modules and lessons.</p>
            </div>
            <div class="course-overview-meta">
              <span>${modules.length} Modules</span>
              <span>${lessonCount} Lessons</span>
            </div>
          </div>
          ${modules.length ? modules.map((module) => `
            <section class="topic-group lms-module-section" id="${groupId(module.title)}">
              <div class="semester-head lms-module-head">
                <div>
                  <span>${escapeHtml(module.label)}</span>
                  <h2>${escapeHtml(module.title)}</h2>
                </div>
                <em>${module.lessons.length} ${module.lessons.length === 1 ? "lesson" : "lessons"}</em>
              </div>
              <div class="topic-list lms-lesson-list">
                ${module.lessons.map((topic, index) => {
                  const topicWithIndex = { ...topic, flatIndex: topic.lessonNumber - 1 };
                  const lesson = lessonForTopic(programme, unit, topicWithIndex);
                  const status = "Not Started";
                  return `
                    <a class="topic-row topic-link lms-lesson-card${topic.lessonNumber === 1 ? " current" : ""}" href="${topicHref(programme, unit, topic.groupIndex, topic.topicIndex)}">
                      <span class="lesson-number-badge">Lesson ${topic.lessonNumber}</span>
                      <div class="lesson-card-body">
                        <div class="lesson-card-topline">
                          <span class="lesson-type-chip">${icon(lmsLessonIcon(topic.title, index))}<span>Study Notes</span></span>
                          <span class="lesson-status not-started">${escapeHtml(status)}</span>
                        </div>
                        <small>${escapeHtml(module.label)}: ${escapeHtml(module.title)}</small>
                        <h3>${escapeHtml(topic.title)}</h3>
                        <p>${escapeHtml(topic.description || (lesson ? lessonExcerptFor(programme, unit, topicWithIndex, lesson, 140) : "Lesson notes will be added soon."))}</p>
                      </div>
                      <strong class="lesson-action">${icon("arrowRight")}<span>Start Lesson</span></strong>
                    </a>
                  `;
                }).join("")}
              </div>
            </section>
          `).join("") : `<div class="empty-state">No modules yet for this course. Detailed lessons will be added soon.</div>`}
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
    html += `<ol>${listItems.map((item) => `<li>${renderInlineText(item)}</li>`).join("")}</ol>`;
    listItems = [];
  };

  for (const block of (blocks || []).filter((item) => !isImportedAdminBlockText(item && item.text))) {
    if (block.type === "bullet") {
      listItems.push(block.text);
    } else if (block.type === "table") {
      flushList();
      const headers = block.headers || [];
      const rows = block.rows || [];
      html += `
        <div class="lesson-note-table-wrap">
          <table class="lesson-note-table">
            ${headers.length ? `<thead><tr>${headers.map((item) => `<th>${renderInlineText(item)}</th>`).join("")}</tr></thead>` : ""}
            <tbody>
              ${rows.map((row) => `<tr>${row.map((item) => `<td>${renderInlineText(item)}</td>`).join("")}</tr>`).join("")}
            </tbody>
          </table>
        </div>
      `;
    } else {
      flushList();
      html += `<p>${renderInlineText(block.text)}</p>`;
    }
  }
  flushList();
  return html;
}

function isLearningOutcomeSection(section) {
  return Boolean(section && /learning\s+(outcomes?|objectives?)/i.test(section.title || ""));
}

function visibleLessonSections(lesson) {
  return (lesson && lesson.sections ? lesson.sections : []).filter((section) => !isLearningOutcomeSection(section) && !isImportedAdminSection(section));
}

function isImportedAdminSection(section) {
  const title = String(section && section.title ? section.title : "").trim();
  return /^(module\s+unit\b|module\s+unit\s+description|contact\s+hours|credit\s+units|course\s+units)$/i.test(title)
    || /^(revision\s+questions?|review\s+questions?|multiple\s+choice\s+questions?|fill-?in\s+questions?|quiz|questions?)\b/i.test(title)
    || /references?\s*(?:\(|for|from|\b)/i.test(title)
    || /(?:from|in)\s+curriculum|learning[-\s]*working\s+assignments|practical\s+exercises|underpinning\s+knowledge|curriculum\s*$/i.test(title);
}

function isImportedAdminBlockText(value) {
  const text = String(value || "").trim();
  if (!text) return false;
  const plainText = text.replace(/\*\*/g, "").trim();
  return /^(?:\*\*)?(contact\s+hours|credit\s+units|module\s+unit\s+description|module\s+unit)\b/i.test(text)
    || /^(?:\*\*)?(revision\s+questions?|review\s+questions?|multiple\s+choice\s+questions?|fill-?in\s+questions?|quiz|questions?)\b/i.test(text)
    || /^question\s*\d+\s*[:.)-]/i.test(text)
    || /^(?:\d+|[a-z])\.\s+(?:(?:briefly|shortly|clearly)\s+)?(?:what|where|which|why|how|describe|list|name|define|explain|differentiate|identify|state|mention|discuss|compare|examine|outline|give|write)\b/i.test(plainText)
    || /^(?:\d+|[a-z])\.\s+.+\?\s*(?:answer\s*[:.-].*)?$/i.test(plainText)
    || /^(?:a|b|c|d)[.)]\s+(?:(?:briefly|shortly|clearly)\s+)?(?:what|where|which|why|how|describe|list|name|define|explain|differentiate|identify|state|mention|discuss|compare|examine|outline|give|write)\b/i.test(plainText)
    || /below are the (?:core and other )?references listed in the curriculum/i.test(text)
    || /refer to the original document for full details/i.test(text)
    || /^\(?this (?:section|is) .*curriculum/i.test(text)
    || /learning[-\s]*working\s+assignments|practical\s+exercises|underpinning\s+knowledge/i.test(text);
}

function isLearningOutcomeText(value) {
  return /learning\s+(outcomes?|objectives?)/i.test(String(value || ""));
}

function lessonExcerptFor(programme, unit, topic, lesson, fallbackMax) {
  const fallback = `${lmsLessonTitle(programme, unit, topic)} nursing study notes for ${programme.label} in ${lmsCourseTitle(programme, unit)}.`;
  const text = lesson && lesson.excerpt && !isLearningOutcomeText(lesson.excerpt) && !isImportedAdminBlockText(lesson.excerpt) ? lesson.excerpt : fallback;
  return fallbackMax ? truncateText(text, fallbackMax) : text;
}

function lessonBlocks(lesson) {
  return visibleLessonSections(lesson)
    .flatMap((section) => section.blocks || [])
    .filter((block) => block.text && block.text.length > 20 && !isImportedAdminBlockText(block.text));
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
  if (/Nursing Uganda Snapshot/i.test(title)) return " signature-section snapshot-section";
  if (/Build The Idea/i.test(title)) return " signature-section build-section";
  if (/Ward Mode/i.test(title)) return " signature-section ward-section";
  if (/What The Nurse Looks For|Assessment Guide/i.test(title)) return " signature-section assessment-section";
  if (/Red Flags/i.test(title)) return " signature-section red-flags-section";
  if (/Care Plan Map|Nursing Priorities/i.test(title)) return " signature-section care-plan-section";
  if (/Patient Teaching/i.test(title)) return " signature-section teaching-section";
  if (/Exam Answer Map/i.test(title)) return " signature-section exam-map-section";
  if (/Nursing Uganda Clinical Lens/i.test(title)) return " signature-section clinical-lens-section";
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
  const sections = visibleLessonSections(lesson);
  if (!sections.length) {
    return `
      <div class="empty-state">
        Detailed notes for this topic will be added soon.
      </div>
    `;
  }

  return `
    <div class="lesson-content">
      ${sections.map((section, index) => `
        <details id="lesson-section-${index}" class="lesson-section${lessonSectionClass(section.title)}" open>
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
  const sections = visibleLessonSections(lesson);
  if (!sections.length) return "";
  const firstSections = sections.slice(0, 4).map((section) => section.title);

  return `
    <div class="study-tools">
      <div>
        <h3>In This Lesson</h3>
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

function lessonReadingMinutes(lesson) {
  const words = lessonBlocks(lesson).reduce((count, block) => count + String(block.text || "").split(/\s+/).filter(Boolean).length, 0);
  return Math.max(5, Math.ceil(words / 180));
}

function learningObjectivesFor(programme, unit, topic, lesson) {
  const existing = (lesson && lesson.sections ? lesson.sections : []).find((section) => isLearningOutcomeSection(section));
  const blocks = existing ? (existing.blocks || []).map((block) => block.text).filter(Boolean).slice(0, 5) : [];
  if (blocks.length) return blocks;
  const title = lmsLessonTitle(programme, unit, topic);
  return [
    `Define ${title.toLowerCase()} in simple nursing language.`,
    "Identify the key concepts that appear in patient assessment and documentation.",
    "Explain why the lesson matters in safe nursing or midwifery care.",
    "Apply the lesson to clinical observation, escalation and patient education."
  ];
}

function lessonTocItems(lesson) {
  const items = [
    ["learning-objectives", "Learning Objectives"],
    ["introduction", "Introduction"],
    ["key-concepts", "Key Concepts"],
    ["clinical-relevance", "Clinical Relevance"],
    ["nursing-assessment", "Nursing Assessment"],
    ["nursing-interventions", "Nursing Interventions"],
    ["important-terms", "Important Terms"],
    ["quick-revision", "Quick Revision"],
    ["secondary-learning-resources", "Resources"]
  ];
  if (!lessonTerms(lesson).length) return items.filter(([id]) => id !== "important-terms");
  return items;
}

function renderLessonToc(lesson, mobileOnly = false, topic = null, unit = null, programme = null) {
  const items = lessonTocItems(lesson);
  const currentLesson = topic ? Number(topic.flatIndex || 0) + 1 : 1;
  const totalLessons = unit ? flatTopics(unit).length : "";
  return `
    ${mobileOnly ? "" : `<nav class="lesson-toc" aria-label="Lesson contents">
      <strong>On This Lesson</strong>
      ${items.map(([id, label], index) => `<a href="#${id}" data-toc-link="${id}"><span></span>${index + 1}. ${escapeHtml(label)}</a>`).join("")}
      <div class="lesson-toc-divider"></div>
      <div class="lesson-reading-info">
        <span>${lessonReadingMinutes(lesson)} min read</span>
        <span>Lesson ${currentLesson}${totalLessons ? ` of ${totalLessons}` : ""}</span>
        <span>${unit && programme ? escapeHtml(lmsCourseTitle(programme, unit)) : "Anatomy and Physiology"}</span>
      </div>
    </nav>`}
    ${mobileOnly ? `<details class="mobile-lesson-toc">
      <summary>${icon("listChecks")}<span>Lesson Contents</span></summary>
      <div>
        ${items.map(([id, label], index) => `<a href="#${id}" data-toc-link="${id}"><span></span>${index + 1}. ${escapeHtml(label)}</a>`).join("")}
      </div>
    </details>` : ""}
  `;
}

function isHumanBodyOrganizationLesson(title) {
  return /human body organi[sz]ation/i.test(title || "");
}

function bodyOrganizationTerms() {
  return [
    { term: "Atom", definition: "Smallest unit of matter that retains chemical properties." },
    { term: "Molecule", definition: "Two or more atoms bonded together." },
    { term: "Cell", definition: "Basic structural and functional unit of life." },
    { term: "Tissue", definition: "Group of similar cells performing a common function." },
    { term: "Organ", definition: "Structure of two or more tissue types with a specific function." },
    { term: "Organ System", definition: "Group of organs working together for a major body function." },
    { term: "Homeostasis", definition: "Maintenance of a stable internal environment." },
    { term: "Epithelial", definition: "Tissue covering body surfaces and lining cavities." },
    { term: "Connective", definition: "Tissue supporting, binding and protecting other tissues." },
    { term: "Metabolism", definition: "All chemical reactions occurring in the body." }
  ];
}

function lessonDisplayTerms(title, lesson) {
  if (isHumanBodyOrganizationLesson(title)) return bodyOrganizationTerms();
  return lessonTerms(lesson);
}

function bodyOrganizationConceptCards() {
  return [
    ["activity", "Chemical Level", "Atoms, ions, molecules and compounds. Examples include water, oxygen, glucose, electrolytes and nucleic acids. Essential for energy production, fluid balance, growth and reproduction."],
    ["stethoscope", "Cellular Level", "The basic living unit. Carries out metabolism, growth, response to stimuli, repair and reproduction. Red blood cells transport oxygen; nerve cells transmit impulses; muscle cells contract."],
    ["layoutGrid", "Tissue Level", "Similar cells working together for a specific function. Four types: epithelial, connective, muscle and nervous. Each type has a distinct structural role."],
    ["heartPulse", "Organ Level", "Two or more tissue types working together for a specific function. Heart, lungs, kidneys, stomach, skin and brain are all organs."]
  ];
}

function bodyOrganizationAssessmentPoints() {
  return [
    "Observe skin color, temperature and moisture (integumentary and chemical level).",
    "Assess breathing rate, depth and rhythm (respiratory and organ level).",
    "Monitor pulse rate, regularity and strength (cardiovascular and organ level).",
    "Check level of consciousness and orientation (nervous system and cellular level).",
    "Measure blood glucose, oxygen saturation and electrolytes (chemical level)."
  ];
}

function bodyOrganizationInterventions() {
  return [
    "At the chemical level: administer IV fluids, oxygen therapy and medicines as prescribed.",
    "At the cellular level: support perfusion, nutrition, temperature control and oxygen delivery.",
    "At the tissue level: provide wound care, pressure area management and safe repositioning.",
    "At the organ level: support breathing, monitor cardiac function and maintain catheter care where indicated.",
    "At the system level: coordinate care plans, referrals, health education and follow-up."
  ];
}

function renderLessonImageBlock(image, index, aspectRatio, caption, credit = "Nursing Uganda") {
  return "";
}

function renderLessonSectionBlock(id, number, title, body) {
  return `
    <section class="textbook-section" id="${escapeHtml(id)}" data-lesson-reveal>
      <div class="textbook-section-head">
        <span>${number}</span>
        <h3>${escapeHtml(title)}</h3>
      </div>
      <div class="textbook-section-body">
        ${body}
      </div>
    </section>
  `;
}

function renderTextbookLessonNotes(programme, unit, topic, lesson) {
  const frame = topicPracticeFrame(programme, unit, topic, lesson);
  const title = lmsLessonTitle(programme, unit, topic);
  const isBodyOrganization = isHumanBodyOrganizationLesson(title);
  const sections = visibleLessonSections(lesson).filter((section) => !/reference|bibliography|nursing\s+assessment|interventions?|safety|revision\s+checklist/i.test(section.title || ""));
  const terms = lessonDisplayTerms(title, lesson);
  const images = lessonGalleryImages(programme, unit, topic, lesson);
  const objectives = learningObjectivesFor(programme, unit, topic, lesson);
  const clinicalFocus = isBodyOrganization
    ? "Connect theory with assessment findings, patient safety, documentation and nursing decision-making at every level of organization."
    : "Connect theory with assessment findings, patient safety, documentation and nursing decision-making.";
  const clinicalRelevance = isBodyOrganization
    ? [
      "A change at the chemical level can affect the whole patient. Low oxygen, abnormal glucose or electrolyte imbalance may quickly alter consciousness, pulse, breathing, muscle function or heart rhythm.",
      "When cells do not receive enough oxygen, nutrients or fluid, tissue function becomes impaired. This is why nurses monitor circulation, hydration, oxygen saturation, temperature and blood glucose.",
      "Nursing assessment often focuses on organ function: breath sounds for lungs, heart rate and pulse for the heart, urine output for kidneys."
    ]
    : [`Understanding ${title.toLowerCase()} helps nurses assess patients systematically, identify urgent changes early and explain care in language patients can understand.`];
  const assessment = isBodyOrganization ? bodyOrganizationAssessmentPoints() : frame.assessment;
  const interventions = isBodyOrganization ? bodyOrganizationInterventions() : frame.priorities;
  const introImage = isBodyOrganization ? { ...imageCatalog.anatomyIntro, label: "Body organization overview" } : images[0];
  const conceptImage = isBodyOrganization ? { ...imageCatalog.anatomy, label: "Anatomy reference" } : (images[1] || images[0]);
  const assessmentImage = isBodyOrganization ? { ...imageCatalog.nursing, label: "Clinical assessment" } : (images[2] || images[0]);
  const conceptBody = isBodyOrganization
    ? `
      <p>The human body is organized into six structural levels, each building on the one below it.</p>
      <div class="lesson-concept-grid">
        ${bodyOrganizationConceptCards().map(([iconName, conceptTitle, body]) => `
          <article>
            <span>${icon(iconName)}</span>
            <h4>${escapeHtml(conceptTitle)}</h4>
            <p>${escapeHtml(body)}</p>
          </article>
        `).join("")}
      </div>
      ${renderLessonImageBlock(conceptImage, 2, "4/3", "Fig 2. The four major tissue types and their locations", conceptImage && conceptImage.label ? conceptImage.label : "Nursing Uganda")}
    `
    : `
      ${sections.length
        ? sections.map((section) => `<article class="lesson-prose-block${lessonSectionClass(section.title)}"><h4>${escapeHtml(section.title)}</h4>${renderLessonBlocks(section.blocks)}</article>`).join("")
        : `<p>Detailed notes for this lesson will be added soon.</p>`}
      ${renderLessonImageBlock(conceptImage, 2, "4/3", "Fig 2. Supporting anatomy and physiology reference", conceptImage && conceptImage.label ? conceptImage.label : "Nursing Uganda")}
    `;

  return `
    <article class="lesson-notes-container printable-topic" id="lesson-notes">
      <div class="lesson-objectives-block" id="learning-objectives" data-lesson-reveal>
        <span class="lesson-obj-pill">Learning Objectives</span>
        <p class="lesson-obj-lead">By the end of this lesson, you should be able to:</p>
        <ol class="lesson-obj-list">
          ${objectives.slice(0, 4).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
        </ol>
      </div>

      ${renderLessonSectionBlock("introduction", 1, "Introduction", `
        <p>${escapeHtml(frame.definition)}</p>
        <div class="clinical-focus-callout">
          <strong>Clinical Learning Focus</strong>
          <p>${escapeHtml(clinicalFocus)}</p>
        </div>
        ${renderLessonImageBlock(introImage, 1, "16/9", isBodyOrganization ? "Fig 1. Overview of human body organization levels" : "Fig 1. Lesson overview reference", introImage && introImage.label ? introImage.label : "Nursing Uganda")}
      `)}

      ${renderLessonSectionBlock("key-concepts", 2, isBodyOrganization ? "Key Concepts (Levels of Organization)" : "Key Concepts", conceptBody)}

      ${renderLessonSectionBlock("clinical-relevance", 3, "Clinical Relevance", `
        ${clinicalRelevance.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}
      `)}

      ${renderLessonSectionBlock("nursing-assessment", 4, "Nursing Assessment", `
        <p>Use the lesson concept to organize patient observations and decide what requires escalation.</p>
        <div class="assessment-card-list">
          ${assessment.map((item) => `<div><span aria-hidden="true">*</span><p>${escapeHtml(item)}</p></div>`).join("")}
        </div>
        ${renderLessonImageBlock(assessmentImage, 3, "21/9", "Fig 3. Nurse conducting a structured patient assessment", assessmentImage && assessmentImage.label ? assessmentImage.label : "Nursing Uganda")}
      `)}

      ${renderLessonSectionBlock("nursing-interventions", 5, "Nursing Interventions", `
        <p>Nursing interventions should target the correct organizational level and then be evaluated through patient response.</p>
        <div class="assessment-card-list intervention-list">
          ${interventions.map((item) => `<div><span aria-hidden="true">*</span><p>${escapeHtml(item)}</p></div>`).join("")}
        </div>
      `)}

      ${terms.length ? renderLessonSectionBlock("important-terms", 6, "Important Terms", `
        <dl class="lesson-term-list">
          ${terms.map((item) => `<div><dt>${escapeHtml(item.term)}</dt><dd>${escapeHtml(item.definition)}</dd></div>`).join("")}
        </dl>
      `) : ""}

      ${renderLessonSectionBlock("study-wrap", terms.length ? 7 : 6, "Study Wrap", `
        <div class="revision-card">
          <h4>Before you move on</h4>
          ${[
            "Restate the main lesson concept in practical nursing language.",
            "Connect the important assessment findings to patient risk.",
            "Prioritize the nursing actions that protect safety first.",
            "Document abnormal findings clearly and escalate early."
          ].map((item) => `
            <div>
              <span aria-hidden="true">*</span>
              <p>${escapeHtml(item)}</p>
            </div>
          `).join("")}
        </div>
      `)}
    </article>
  `;
}

function renderSecondaryPanel(id, title, iconName, body, open = false) {
  if (!body) return "";
  const subtitles = {
    "Watch Video": "Visual walkthrough of this lesson",
    "Quick Quiz": "Test your knowledge",
    "Practice Flashcards": "Key terms and definitions",
    "References": "Textbooks and official sources",
    "Related Lessons": "Continue through this course"
  };
  return `
    <details class="secondary-learning-accordion lesson-resource-item" id="${escapeHtml(id)}"${open ? " open" : ""}>
      <summary>
        <span class="resource-icon-tile">${icon(iconName)}</span>
        <span class="resource-copy"><strong>${escapeHtml(title)}</strong><small>${escapeHtml(subtitles[title] || "Open supporting resource")}</small></span>
        <span class="resource-arrow">${icon("arrowRight")}</span>
      </summary>
      <div>${body}</div>
    </details>
  `;
}

function renderSecondaryLearningResources(programme, unit, topic, lesson) {
  return `
    <section class="secondary-learning-resources" id="secondary-learning-resources">
      <div class="secondary-learning-head">
        <span class="mini-label">Practice, Watch and Verify</span>
      </div>
      ${renderSecondaryPanel("video-resource", "Watch Video", "video", renderTopicVideo(programme, unit, topic), false)}
      ${renderSecondaryPanel("quiz-resource", "Quick Quiz", "helpCircle", renderTopicQuiz(lesson, programme, unit, topic, topicKey(programme, unit, topic)), false)}
      ${renderSecondaryPanel("lesson-flashcards", "Practice Flashcards", "badgeCheck", renderFlashcards(lesson), false)}
      ${renderSecondaryPanel("lesson-references", "References", "bookOpen", renderLessonReferences(programme, unit, topic, lesson), false)}
    </section>
  `;
}

function renderLessonHeader(programme, unit, topic, lesson, complete) {
  const title = lmsLessonTitle(programme, unit, topic);
  const courseTitle = lmsCourseTitle(programme, unit);
  const moduleTitle = lmsModuleTitle(programme, unit, topic);
  return `
    <section class="lesson-header" data-lesson-reveal>
      <span class="lesson-hero-circle one" aria-hidden="true"></span>
      <span class="lesson-hero-circle two" aria-hidden="true"></span>
      <div class="lesson-header-copy">
        <p class="lesson-kicker">Lesson ${topic.flatIndex + 1} - ${escapeHtml(moduleTitle)}</p>
        <h1>${escapeHtml(title)}</h1>
        <p>${escapeHtml(lessonExcerptFor(programme, unit, topic, lesson, 180))}</p>
        <div class="lesson-header-meta">
          <span>${lessonReadingMinutes(lesson)} min read</span>
          <span>Beginner</span>
          <span>Study Notes</span>
        </div>
      </div>
    </section>
  `;
}

function renderLessonSidebar(programme, unit, topic, previous, next, complete, progress, bookmark) {
  const radiusDash = 88;
  const dashOffset = Math.max(0, radiusDash - (radiusDash * progress.percent) / 100);
  const active = isBookmarked(bookmark.key);
  return `
    <aside class="lesson-sidebar">
      <section>
        <span class="lesson-sidebar-label">Course Progress</span>
        <div class="lesson-progress-row">
          <svg class="lesson-progress-ring" width="44" height="44" viewBox="0 0 44 44" aria-label="${progress.percent}% complete">
            <circle cx="22" cy="22" r="14"></circle>
            <circle cx="22" cy="22" r="14" style="stroke-dashoffset: ${dashOffset}"></circle>
            <text x="22" y="25" text-anchor="middle">${progress.percent}%</text>
          </svg>
          <div>
            <strong>${progress.done} of ${progress.total}</strong>
            <span>lessons complete</span>
          </div>
        </div>
        <div class="lesson-linear-progress"><span style="width: ${progress.percent}%"></span></div>
        <p>Lesson ${topic.flatIndex + 1} - Beginner</p>
      </section>
      <section>
        <span class="lesson-sidebar-label">Lesson Navigation</span>
        ${previous ? `<a href="${topicHref(programme, unit, previous.groupIndex, previous.topicIndex)}"><span aria-hidden="true">${icon("arrowLeft")}</span>Previous lesson</a>` : `<button type="button" disabled><span aria-hidden="true">${icon("arrowLeft")}</span>Previous lesson</button>`}
        ${next ? `<a href="${topicHref(programme, unit, next.groupIndex, next.topicIndex)}"><span aria-hidden="true">${icon("arrowRight")}</span>Next lesson</a>` : `<button type="button" disabled><span aria-hidden="true">${icon("arrowRight")}</span>Next lesson</button>`}
        <a href="/courses/${programme.id}/${unit.id}"><span aria-hidden="true">${icon("arrowLeft")}</span>Back to course</a>
      </section>
      <section>
        <span class="lesson-sidebar-label">Quick Actions</span>
        <button type="button" class="lesson-primary-action${complete ? " active" : ""}" data-complete-topic="${escapeHtml(topicKey(programme, unit, topic))}">${icon("checkCircle")}<span>${complete ? "Mark incomplete" : "Mark lesson complete"}</span></button>
        <button
          type="button"
          class="lesson-secondary-action bookmark-toggle${active ? " active" : ""}"
          data-bookmark-key="${escapeHtml(bookmark.key)}"
          data-bookmark-title="${escapeHtml(bookmark.title)}"
          data-bookmark-type="${escapeHtml(bookmark.type)}"
          data-bookmark-context="${escapeHtml(bookmark.context || "")}"
          data-bookmark-href="${escapeHtml(bookmark.href)}"
        >${icon("download")}<span>${active ? "Notes saved" : "Save notes"}</span></button>
        <button type="button" class="lesson-secondary-action" data-print-topic>${icon("printer")}<span>Print / Save PDF</span></button>
        <div class="lesson-sidebar-badges">
          <span>${lessonReadingMinutes(lessonForTopic(programme, unit, topic))} min read</span>
          <span>Beginner</span>
          <span>${complete ? "Complete" : "Not Started"}</span>
        </div>
      </section>
    </aside>
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
  const sections = visibleLessonSections(lesson).filter((section) => section.title && !/reference|quiz/i.test(section.title));
  if (!sections.length) return [];
  const sectionTitles = sections.map((section) => section.title).slice(0, 8);
  const textBlocks = sections.map(firstTextBlock).filter(Boolean).map((block) => truncateText(block.text, 130));
  const terms = lessonTerms(lesson);
  const questions = [];

  if (sectionTitles.length >= 2) {
    const correct = sectionTitles[0];
    questions.push({
      prompt: "Which heading appears in this lesson?",
      answer: correct,
      choices: rotateChoices([correct, ...sectionTitles.slice(1, 4)], 1),
      explanation: `The lesson includes the section "${correct}".`
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
      explanation: "This statement appears in the lesson notes."
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
    prompt: "This lesson belongs to which course?",
    answer: lmsCourseTitle(programme, unit),
    choices: rotateChoices([
      lmsCourseTitle(programme, unit),
      programme.label,
      lmsModuleTitle(programme, unit, topic),
      "Medical Instruments"
    ], 3),
    explanation: `This lesson is part of ${lmsCourseTitle(programme, unit)}.`
  });

  return questions.slice(0, 4);
}

function renderTopicQuiz(lesson, programme, unit, topic, key) {
  const questions = quizQuestionsFor(lesson, programme, unit, topic);
  if (!questions.length) return "";
  const attempt = quizAttempts()[key] || {};
  const answered = questions.filter((_, index) => attempt[index] !== undefined);
  const score = questions.filter((question, index) => quizAnswerCorrect(question, attempt[index])).length;
  const allAnswered = answered.length === questions.length;
  if (allAnswered && score === questions.length) setTopicMastery(key);
  const mastered = isTopicMastered(key);

  return `
    <section class="quiz-panel${mastered ? " quiz-mastered" : ""}" id="topic-quiz">
      <div class="quiz-head">
        <div>
          <span class="mini-label">Quick Quiz</span>
          <h3>Test Yourself${mastered ? `<span class="mastery-badge">${icon("trophy")} Mastered</span>` : ""}</h3>
          <p>${allAnswered && score === questions.length ? "Perfect score — this topic is mastered!" : answered.length ? `${score} of ${answered.length} answered correctly.` : "Answer these quick checks after reading the topic."}</p>
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
  const lesson = lessonForTopic(programme, unit, topic);
  const lessonTitle = lmsLessonTitle(programme, unit, topic);
  const courseTitle = lmsCourseTitle(programme, unit);
  const lessonSections = visibleLessonSections(lesson);
  const sourceText = "Original Nursing Uganda lesson notes. Use the reference books, official PDFs, tutor guidance and current facility protocols below for verification.";
  const key = topicKey(programme, unit, topic);
  const complete = Boolean(completedTopics()[key]);
  const progress = topicProgress(programme, unit);
  const topicBookmark = {
    key: `topic::${key}`,
    type: "Lesson",
    title: lessonTitle,
    context: `${programme.label} - ${courseTitle}`,
    href: topicHref(programme, unit, topic.groupIndex, topic.topicIndex)
  };
  setLastStudiedTopic(programme, unit, topic, lesson);

  return `
    <section class="premium-lesson-page">
      ${renderLessonSidebar(programme, unit, topic, previous, next, complete, progress, topicBookmark)}
      <main class="premium-lesson-main">
        <details class="lesson-mobile-sidebar">
          <summary>${icon("menu2")}<span>Lesson tools</span></summary>
          ${renderLessonSidebar(programme, unit, topic, previous, next, complete, progress, topicBookmark)}
        </details>
        ${renderLessonHeader(programme, unit, topic, lesson, complete)}
        <div class="revision-reminder-bar">
          <span aria-hidden="true">${icon("helpCircle")}</span>
          <p><strong>Revision Reminder:</strong> Nursing Uganda supports revision and peer-to-peer learning only. Confirm important details with formal student notes, tutors, approved textbooks, clinical supervisors and current facility guidance.</p>
        </div>
        <div class="premium-lesson-body">
          ${renderLessonToc(lesson, true, topic, unit, programme)}
          ${renderTextbookLessonNotes(programme, unit, topic, lesson)}
          ${renderSecondaryLearningResources(programme, unit, topic, lesson)}
          <div class="topic-source compact-source">
            <strong>Reference</strong>
            <span>${escapeHtml(sourceText)}</span>
          </div>
        </div>
        ${renderLessonNotesPanel(key)}
        <nav class="lesson-bottom-actions" aria-label="Lesson navigation">
          ${previous ? buttonLink(topicHref(programme, unit, previous.groupIndex, previous.topicIndex), "Previous Lesson", "secondary", "arrowLeft") : `<span></span>`}
          <button class="button secondary" type="button" data-print-topic>${buttonLabel("Print / Save PDF", "printer")}</button>
          ${next ? buttonLink(topicHref(programme, unit, next.groupIndex, next.topicIndex), "Next Lesson", "primary", "arrowRight") : buttonLink(`/courses/${programme.id}/${unit.id}`, "Back to Course", "secondary", "arrowLeft")}
        </nav>
      </main>
      ${renderLessonToc(lesson, false, topic, unit, programme)}
    </section>
  `;
}

function groupId(title) {
  return title.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function slugify(value) {
  return String(value).toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function topicSlug(topic) {
  return slugify(topic && (topic.slug || topic.title || topic.sourceSlug || "topic"));
}

function uniqueTopicSlug(unit, topic) {
  const base = topicSlug(topic) || "topic";
  const topics = flatTopics(unit);
  const matches = topics.filter((item) => topicSlug(item) === base);
  if (matches.length <= 1) return base;

  const matchIndex = matches.findIndex((item) => item.groupIndex === topic.groupIndex && item.topicIndex === topic.topicIndex);
  return `${base}-${matchIndex >= 0 ? matchIndex + 1 : topic.flatIndex + 1}`;
}

function findTopicBySlug(programme, unit, slug) {
  const cleanSlug = slugify(slug);
  return flatTopics(unit).find((topic) => {
    const lessonTopic = { ...topic, title: programme ? lmsLessonTitle(programme, unit, topic) : topic.title };
    const exactSlug = uniqueTopicSlug(unit, lessonTopic);
    return exactSlug === cleanSlug || topicSlug(lessonTopic) === cleanSlug || topicSlug(topic) === cleanSlug || slugify(topic.sourceSlug || "") === cleanSlug;
  }) || null;
}

function resourceCards() {
  return [
    {
      title: "Digital Library",
      body: "Curated nursing and medical book sources matched to course topics.",
      href: "/resources/books",
      category: "Reference",
      icon: "bookOpen",
      accent: "library",
      image: {
        src: "assets/images/resources/resource-digital-library-hero.jpg",
        alt: "Nursing students reviewing books and study notes together"
      }
    },
    {
      title: "Past Papers",
      body: "Exam practice grouped by programme and course unit.",
      href: "/resources/past-papers",
      category: "Exam Prep",
      icon: "fileText",
      accent: "papers",
      image: {
        src: "assets/images/resources/resource-past-papers-hero.png",
        alt: "Nursing past paper used for examination revision"
      }
    },
    {
      title: "Quizzes",
      body: "MCQs for notes, course units and topic revision.",
      href: "/resources/quizzes",
      category: "Exam Prep",
      icon: "helpCircle",
      accent: "quizzes",
      image: {
        src: "assets/images/resources/resource-quizzes-hero.jpg",
        alt: "Nursing quiz board for revision practice"
      }
    },
    {
      title: "Licensing",
      body: "UNMC, CPD and renewal guidance for professional requirements.",
      href: "/resources/licensing",
      category: "Licensing",
      icon: "badgeCheck",
      accent: "licensing",
      image: {
        src: "assets/images/resources/resource-licensing-hero.jpg",
        alt: "Professional nursing standards and policy reference"
      }
    },
    {
      title: "Medical Instruments",
      body: "Common nursing and midwifery instruments with use, handling and revision notes.",
      href: "/resources/medical-instruments",
      category: "Reference",
      icon: "stethoscope",
      accent: "instruments",
      image: {
        src: "assets/images/resources/resource-medical-instruments-hero.jpg",
        alt: imageCatalog.instruments.alt
      }
    },
    {
      title: "Schools",
      body: "A directory of recognized nursing and midwifery schools.",
      href: "/resources/schools",
      category: "Career Support",
      icon: "school",
      accent: "schools",
      image: {
        src: "assets/images/resources/resource-schools-hero.webp",
        alt: "Nursing school and training environment"
      }
    },
    {
      title: "Student Support",
      body: "Study planning, placement preparation and career guidance.",
      href: "/resources/student-support",
      category: "Career Support",
      icon: "heartPulse",
      accent: "support",
      image: {
        src: "assets/images/resources/resource-student-support-hero.webp",
        alt: "Student support and supervision in nursing training"
      }
    },
    {
      title: "Image Review",
      body: "Review topic image matches, confidence levels and unmatched topics.",
      href: "/resources/image-review",
      category: "Reference",
      icon: "search",
      accent: "review",
      image: {
        src: "assets/images/resources/resource-image-review-hero.jpg",
        alt: "Desktop setup used for reviewing and curating learning images"
      }
    }
  ];
}

function renderResources() {
  const resources = resourceCards();
  const filters = ["All", "Exam Prep", "Reference", "Licensing", "Career Support"];
  const query = state.resourceSearch.trim().toLowerCase();
  const activeFilter = state.resourceFilter;
  const filtered = resources.filter((item) => {
    const matchesFilter = activeFilter === "All" || item.category === activeFilter;
    const haystack = `${item.title} ${item.body} ${item.category}`.toLowerCase();
    return matchesFilter && (!query || haystack.includes(query));
  });
  const hasFilters = query || activeFilter !== "All";

  return `
    ${pageHeader({
      eyebrow: "Resource Hub",
      title: "Resources",
      body: "Past papers, quizzes, licensing guides, medical references, schools and student support."
    })}
    <section class="section resources-section">
      <div class="container">
        <div class="resource-toolbar">
          <label class="search-field resource-search-label">
            ${icon("search")}
            <input data-resource-search type="search" value="${escapeHtml(state.resourceSearch)}" placeholder="Search resources…" aria-label="Search resources">
          </label>
          <div class="resource-filter-strip" role="group" aria-label="Filter resources by category">
            ${filters.map((filter) => `
              <button type="button" class="filter-pill${activeFilter === filter ? " active" : ""}" data-resource-filter="${escapeHtml(filter)}">${escapeHtml(filter)}</button>
            `).join("")}
          </div>
        </div>
        ${hasFilters ? `<p class="resource-count-row"><strong>${filtered.length}</strong> of <strong>${resources.length}</strong> resources${query ? ` matching "${escapeHtml(state.resourceSearch)}"` : ""}</p>` : ""}
        ${renderStudyDisclaimer("resource")}
        <div class="resource-hub-grid">
          ${filtered.length ? filtered.map((item, index) => `
            <a class="resource-hub-card accent-${escapeHtml(item.accent)}" href="${escapeHtml(item.href)}" style="--card-index:${index}">
              <span class="resource-card-art">
                <img class="resource-card-image" src="${escapeHtml(rootAssetPath(displayImageSrc(item.image.src)))}" alt="${escapeHtml(item.image.alt)}" loading="lazy">
                <span class="resource-card-overlay" aria-hidden="true"></span>
                <span class="resource-card-icon-badge" aria-hidden="true">${icon(item.icon)}</span>
              </span>
              <span class="resource-tag">${escapeHtml(item.category)}</span>
              <h3>${escapeHtml(item.title)}</h3>
              <p>${escapeHtml(item.body)}</p>
              <span class="resource-button">${icon("arrowRight")}<span>Open resource</span></span>
            </a>
          `).join("") : `<div class="empty-state resource-empty"><p>No resources matched that search.</p><button class="button secondary" type="button" data-resource-filter="All">Clear filters</button></div>`}
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
    ${pageHeader({
      eyebrow: "Digital Library",
      title: "Medical Books",
      body: "Curated nursing and medical book sources matched to anatomy, pharmacology, midwifery, child health, community health and clinical skills revision.",
      actions: `${buttonLink("/resources", "Back to Resources", "secondary", "arrowLeft")}${buttonLink(library.source.medical_url, "Open InfoBooks", "primary", "externalLink", `target="_blank" rel="noopener noreferrer"`)}`
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
            ${renderAffiliateDisclosure()}
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
              ${renderAffiliateDisclosure(true)}
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
                ${renderAffiliateDisclosure(true)}
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
        ${renderAdSlot("resourcesInline", "Digital library advertisement")}
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
    ) : "/resources/image-review";
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
    ) : "/resources/image-review";
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
      actions: buttonLink("/resources", "Back to Resources", "secondary", "arrowLeft")
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
            <p>Strong matches show on lesson pages by default. Approved choices also show; hidden and replace-marked choices stay off the lesson pages.</p>
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
    href: `/resources/${page.slug}`
  };

  return `
    ${hero({
      title: page.title,
      body: page.body,
      image: imageFor(page.title),
      actions: `${buttonLink("/resources", "Back to Resources", "secondary", "arrowLeft")}${bookmarkButton(resourceBookmark)}`
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

const careerFilterGroups = {
  type: ["All", "Internship", "Full Time", "Part Time", "Contract", "Volunteer"],
  level: ["All", "Student", "Graduate", "Experienced", "Senior"],
  region: ["All", "Uganda", "East Africa", "UK", "Australia", "Middle East", "Other"],
  speciality: ["All", "General", "ICU", "Theatre", "Paediatrics", "Midwifery", "Community", "Mental Health"],
  deadline: ["All", "This week", "This month"]
};

function careerJobs() {
  return [
    ["mulago-graduate-nurse", "Graduate Nurse Program", "Mulago National Referral Hospital", "Kampala, Uganda", "Full Time", "Graduate", "Uganda", "General", "UGX 1.2M-1.8M", "2026-05-02", "2026-05-31", true, false],
    ["aga-khan-theatre-nurse", "Theatre Nurse", "Aga Khan Hospital Uganda", "Kampala, Uganda", "Full Time", "Experienced", "Uganda", "Theatre", "UGX 2.4M-3.4M", "2026-05-06", "2026-05-22", true, false],
    ["unhcr-community-health", "Community Health Nurse", "UNHCR Uganda", "Arua, Uganda", "Contract", "Experienced", "Uganda", "Community", "Not disclosed", "2026-05-04", "2026-05-17", false, true],
    ["msf-icu-nurse", "ICU Nurse", "MSF Uganda", "Kampala, Uganda", "Contract", "Experienced", "Uganda", "ICU", "Not disclosed", "2026-05-01", "2026-05-12", true, true],
    ["who-surveillance-nurse", "Nursing Surveillance Officer", "WHO Uganda", "Kampala, Uganda", "Contract", "Senior", "Uganda", "Community", "Not disclosed", "2026-04-30", "2026-05-27", false, true],
    ["red-cross-volunteer-nurse", "Volunteer Nurse - Emergency Response", "Uganda Red Cross", "Gulu, Uganda", "Volunteer", "Student", "Uganda", "General", "Volunteer allowance", "2026-05-07", "2026-05-15", false, false],
    ["moh-midwife", "Midwife - District Health Facility", "MOH Uganda", "Mbarara, Uganda", "Full Time", "Graduate", "Uganda", "Midwifery", "Government scale", "2026-05-03", "2026-06-07", false, false],
    ["nakasero-paediatric", "Paediatric Nurse", "Nakasero Hospital", "Kampala, Uganda", "Full Time", "Experienced", "Uganda", "Paediatrics", "UGX 2.0M-2.8M", "2026-05-05", "2026-06-02", false, false],
    ["ihk-mental-health", "Mental Health Nurse", "International Hospital Kampala", "Namuwongo, Uganda", "Part Time", "Experienced", "Uganda", "Mental Health", "UGX 1.8M-2.6M", "2026-04-28", "2026-05-24", false, false],
    ["nile-internship", "Student Nursing Internship", "Nile Community Clinic", "Jinja, Uganda", "Internship", "Student", "Uganda", "General", "Transport allowance", "2026-05-08", "2026-05-19", false, false],
    ["kisumu-nurse", "Staff Nurse", "Kisumu County Hospital", "Kisumu, Kenya", "Full Time", "Experienced", "East Africa", "General", "KES 65K-95K", "2026-05-01", "2026-06-10", false, true],
    ["nairobi-midwife", "Registered Midwife", "Nairobi Maternal Centre", "Nairobi, Kenya", "Contract", "Experienced", "East Africa", "Midwifery", "KES 80K-120K", "2026-05-06", "2026-05-28", false, true],
    ["nhs-band5", "Band 5 Staff Nurse", "NHS Trust", "Manchester, UK", "Full Time", "Graduate", "UK", "General", "GBP 28K-34K", "2026-05-03", "2026-06-14", true, true],
    ["nhs-theatre", "Operating Theatre Practitioner", "NHS Jobs", "Birmingham, UK", "Full Time", "Experienced", "UK", "Theatre", "GBP 35K-42K", "2026-05-02", "2026-05-30", false, true],
    ["aged-care-australia", "Registered Nurse - Aged Care", "SEEK Australia", "Melbourne, Australia", "Full Time", "Experienced", "Australia", "General", "AUD 75K-95K", "2026-04-29", "2026-06-21", false, true],
    ["icu-australia", "Critical Care Registered Nurse", "Queensland Health", "Brisbane, Australia", "Contract", "Senior", "Australia", "ICU", "AUD 90K-115K", "2026-05-05", "2026-06-04", true, true],
    ["dubai-dha", "DHA Registered Nurse", "Dubai Health Recruiters", "Dubai, UAE", "Contract", "Experienced", "Middle East", "General", "AED 6K-9K", "2026-05-01", "2026-05-25", false, true],
    ["abu-dhabi-paeds", "Paediatric Nurse", "Abu Dhabi Medical City", "Abu Dhabi, UAE", "Full Time", "Experienced", "Middle East", "Paediatrics", "AED 7K-10K", "2026-05-04", "2026-06-12", false, true],
    ["saudi-midwife", "Staff Midwife", "Saudi Healthcare Group", "Riyadh, Saudi Arabia", "Contract", "Experienced", "Middle East", "Midwifery", "SAR 5K-8K", "2026-04-26", "2026-05-14", true, true],
    ["qatar-theatre", "Theatre Scrub Nurse", "Qatar Medical Centre", "Doha, Qatar", "Full Time", "Senior", "Middle East", "Theatre", "QAR 8K-12K", "2026-05-06", "2026-06-01", false, true],
    ["reliefweb-field-nurse", "Field Nurse - Humanitarian Response", "ReliefWeb Partner", "South Sudan", "Contract", "Experienced", "Other", "Community", "USD package", "2026-04-27", "2026-05-20", false, true],
    ["who-consultant", "Nursing Consultant", "WHO Vacancies", "Remote / Africa Region", "Contract", "Senior", "Other", "General", "Consultancy rate", "2026-05-08", "2026-06-18", false, true],
    ["clinic-parttime", "Part-time Clinic Nurse", "Kampala Family Clinic", "Kampala, Uganda", "Part Time", "Graduate", "Uganda", "General", "UGX 900K-1.4M", "2026-05-07", "2026-05-10", false, false],
    ["mental-health-ngo", "Mental Health Outreach Nurse", "StrongMinds Uganda", "Mbale, Uganda", "Contract", "Graduate", "Uganda", "Mental Health", "Not disclosed", "2026-05-02", "2026-05-23", false, true]
  ].map(([id, title, employer, location, type, level, region, speciality, salary, posted, deadline, isFeatured, isExternal]) => ({
    id,
    title,
    employer,
    location,
    type,
    level,
    region,
    speciality,
    salary,
    posted,
    deadline,
    isFeatured,
    isExternal,
    positions: isFeatured ? 3 : 1,
    duration: type === "Contract" ? "6-24 months" : type === "Internship" ? "8-12 weeks" : "Permanent",
    applyUrl: isExternal ? "https://www.linkedin.com/jobs/" : `mailto:careers@nursinguganda.com?subject=${encodeURIComponent(title)}`,
    description: `${title} opportunity for Uganda nursing and midwifery professionals seeking structured growth, safe practice and patient-centred care.`,
    responsibilities: ["Deliver safe nursing care and accurate documentation.", "Work with multidisciplinary teams and follow facility protocols.", "Support patient education, handover and quality improvement."],
    requirements: [`${level} nursing or midwifery experience`, `${speciality} interest or relevant placement exposure`, "Active registration or eligibility for registration where required"],
    documents: ["Updated CV", "Academic transcripts", "Registration certificate or student letter", "National ID or passport", "Two professional referees"],
    employerType: /WHO|UNHCR|MSF|Relief|Red Cross|StrongMinds/.test(employer) ? "International Agency / NGO" : /MOH|Mulago|County/.test(employer) ? "Government Hospital" : "Private Facility",
    employerDescription: `${employer} hires nurses and midwives for clinical service, community health, training support and programme delivery.`
  }));
}

function careerExternalSources() {
  return [
    ["NHS Jobs", "UK public health service roles and sponsorship pathways.", "https://www.jobs.nhs.uk/"],
    ["SEEK Australia", "Hospital, aged care and regional Australian nursing roles.", "https://www.seek.com.au/"],
    ["LinkedIn", "Employer-posted jobs and recruiter networking.", "https://www.linkedin.com/jobs/"],
    ["WHO Vacancies", "Global health officer, consultant and field positions.", "https://careers.who.int/"],
    ["MSF Jobs", "Humanitarian nursing, theatre, midwifery and field work.", "https://www.msf.org/careers"],
    ["UNHCR Uganda", "Protection, public health and refugee-response openings.", "https://www.unhcr.org/careers.html"],
    ["ReliefWeb", "NGO and humanitarian jobs across East Africa.", "https://reliefweb.int/jobs"],
    ["MOH Uganda", "Government notices, health worker recruitment and updates.", "https://www.health.go.ug/"]
  ];
}

function careerEmployers() {
  return ["Mulago National Referral Hospital", "Aga Khan Hospital Uganda", "UNHCR Uganda", "MSF Uganda", "WHO Uganda", "Uganda Red Cross", "MOH Uganda", "Nakasero Hospital", "International Hospital Kampala"].map((name, index) => ({
    name,
    location: index < 7 ? "Uganda" : "Kampala",
    type: /UNHCR|MSF|WHO|Red Cross/.test(name) ? "International Agency" : /MOH|Mulago/.test(name) ? "Government Hospital" : "Private",
    roles: /MSF|WHO|UNHCR/.test(name) ? ["Community", "Field", "Senior"] : /Aga|Nakasero|International/.test(name) ? ["Theatre", "ICU", "General"] : ["Graduate", "Midwifery", "General"],
    hiring: index !== 8
  }));
}

function savedCareerJobs() {
  return new Set(state.savedCareerJobs || []);
}

function setCareerJobSaved(id, saved) {
  const next = savedCareerJobs();
  if (saved) next.add(id);
  else next.delete(id);
  state.savedCareerJobs = [...next];
  localStorage.setItem("nursinguganda.savedCareerJobs", JSON.stringify(state.savedCareerJobs));
}

function dateLabel(value) {
  return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(`${value}T00:00:00`));
}

function daysUntil(value) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.ceil((new Date(`${value}T00:00:00`) - today) / 86400000);
}

function deadlineClass(job) {
  const days = daysUntil(job.deadline);
  if (days < 0) return "expired";
  if (days < 7) return "urgent";
  if (days <= 14) return "warning";
  return "normal";
}

function regionLabel(region) {
  const flags = { Uganda: "🇺🇬", "East Africa": "🌍", UK: "🇬🇧", Australia: "🇦🇺", "Middle East": "🇦🇪", Other: "🌐" };
  return `${flags[region] || "🌐"} ${region}`;
}

function careerBadge(label, type = "") {
  return `<span class="career-badge ${escapeHtml(type || slugify(label))}">${escapeHtml(label)}</span>`;
}

function careerJobMatches(job) {
  const query = state.careerSearch.trim().toLowerCase();
  const haystack = `${job.title} ${job.employer} ${job.location} ${job.type} ${job.level} ${job.region} ${job.speciality} ${job.description}`.toLowerCase();
  const deadlineDays = daysUntil(job.deadline);
  return (!query || haystack.includes(query))
    && (state.careerType === "All" || job.type === state.careerType)
    && (state.careerLevel === "All" || job.level === state.careerLevel)
    && (state.careerRegion === "All" || job.region === state.careerRegion)
    && (state.careerSpeciality === "All" || job.speciality === state.careerSpeciality)
    && (state.careerDeadline === "All" || (state.careerDeadline === "This week" && deadlineDays >= 0 && deadlineDays <= 7) || (state.careerDeadline === "This month" && deadlineDays >= 0 && deadlineDays <= 31));
}

function filteredCareerJobs() {
  const jobs = careerJobs().filter(careerJobMatches);
  return jobs.sort((a, b) => {
    if (state.careerSort === "Deadline Soonest") return new Date(a.deadline) - new Date(b.deadline);
    if (state.careerSort === "Most Relevant") return Number(b.isFeatured) - Number(a.isFeatured) || daysUntil(a.deadline) - daysUntil(b.deadline);
    return new Date(b.posted) - new Date(a.posted);
  });
}

function hasActiveCareerFilters() {
  return Boolean(state.careerSearch || state.careerType !== "All" || state.careerLevel !== "All" || state.careerRegion !== "All" || state.careerSpeciality !== "All" || state.careerDeadline !== "All");
}

function clearCareerFilters() {
  state.careerSearch = "";
  state.careerType = "All";
  state.careerLevel = "All";
  state.careerRegion = "All";
  state.careerSpeciality = "All";
  state.careerDeadline = "All";
}

function careerAvatar(name, size = "") {
  return `<span class="career-avatar ${size}" aria-hidden="true">${escapeHtml(String(name || "N").trim().slice(0, 1))}</span>`;
}

function renderCareerHero() {
  const jobCount = careerJobs().length;
  return `
    <section class="careers-hero">
      <div class="container careers-hero-inner">
        <nav class="careers-breadcrumb" aria-label="Breadcrumb">
          <a href="/notes">Home</a><span>${icon("arrowRight")}</span><strong>Careers & Jobs</strong>
        </nav>
        <h1>Nursing Careers & Jobs</h1>
        <p>Internships, graduate positions, senior roles and international opportunities for Uganda nursing and midwifery professionals.</p>
        <div class="careers-hero-chips">
          <span>${icon("briefcaseMedical")}<strong>${jobCount}</strong> Active Listings</span>
          <span>${icon("globe")}<strong>7</strong> Countries Covered</span>
          <span>${icon("chartLine")}<strong>8</strong> Career Levels</span>
        </div>
        <div class="careers-hero-actions">
          <button type="button" data-career-mode="jobs">${icon("briefcaseMedical")}Browse Jobs</button>
          <button type="button" data-career-mode="hub">${icon("graduationCap")}Career Guidance</button>
        </div>
        ${renderAdSlot("resourcesInline", "Resource hub advertisement")}
      </div>
    </section>
  `;
}

function renderCareerModeToggle() {
  return `
    <section class="career-mode-bar">
      <div class="container career-mode-shell">
        <button type="button" class="${state.careerMode === "jobs" ? "active" : ""}" data-career-mode="jobs">${icon("briefcaseMedical")}Jobs Board</button>
        <button type="button" class="${state.careerMode === "hub" ? "active" : ""}" data-career-mode="hub">${icon("graduationCap")}Career Hub</button>
      </div>
    </section>
  `;
}

function renderCareerFilterGroup(label, key, options, active) {
  return `
    <div class="career-filter-group" aria-label="${escapeHtml(label)} filter">
      <span>${escapeHtml(label)}</span>
      ${options.map((option) => `<button type="button" class="${active === option ? "active" : ""}" data-career-filter="${escapeHtml(key)}" data-career-filter-value="${escapeHtml(option)}">${escapeHtml(option)}</button>`).join("")}
    </div>
  `;
}

function renderCareerJobCard(job) {
  const saved = savedCareerJobs().has(job.id);
  const status = deadlineClass(job);
  return `
    <article class="career-job-card ${job.isFeatured ? "featured" : ""}" data-career-card="${escapeHtml(job.id)}">
      <div class="career-job-flags">
        ${job.isFeatured ? `<span class="featured-flag">${icon("sparkles")} Featured</span>` : ""}
        ${job.isExternal ? `<span class="external-flag">${icon("externalLink")} External</span>` : ""}
      </div>
      <header class="career-job-head">
        ${careerAvatar(job.employer)}
        <div>
          <button type="button" data-career-job-open="${escapeHtml(job.id)}">${escapeHtml(job.title)}</button>
          <a href="/careers" data-career-employer="${escapeHtml(job.employer)}">${escapeHtml(job.employer)}</a>
        </div>
      </header>
      <div class="career-job-meta">
        <span>${icon("mapPin")}${escapeHtml(job.location)}</span>
        <span>${icon("calendar")}Posted ${dateLabel(job.posted)}</span>
      </div>
      <p class="career-deadline ${status}">${icon("clock")}<span>Deadline: ${dateLabel(job.deadline)}${status === "urgent" ? " — Closing soon" : ""}</span></p>
      <p class="career-job-desc">${escapeHtml(job.description)}</p>
      <div class="career-badge-row">
        ${careerBadge(job.type, `type-${slugify(job.type)}`)}
        ${careerBadge(job.level, "level")}
        ${careerBadge(regionLabel(job.region), "region")}
        ${careerBadge(job.speciality, "speciality")}
      </div>
      <p class="career-salary">${icon("banknote")} ${escapeHtml(job.salary)}</p>
      <footer class="career-job-actions">
        <button type="button" class="career-save ${saved ? "active" : ""}" data-career-job-save="${escapeHtml(job.id)}">${icon("heart")}<span>${saved ? "Saved" : "Save"}</span></button>
        <button type="button" class="career-apply" data-career-job-open="${escapeHtml(job.id)}">View & Apply ${icon("arrowRight")}</button>
      </footer>
    </article>
  `;
}

function renderJobsBoard() {
  const jobs = filteredCareerJobs();
  return `
    <section class="section career-mode-panel">
      <div class="container">
        <div class="career-board-toolbar">
          <label class="career-search">
            ${icon("search")}
            <input data-career-search type="search" value="${escapeHtml(state.careerSearch)}" placeholder="Search jobs, employers, locations, specialities..." aria-label="Search careers and jobs">
          </label>
          <label class="career-sort">
            <span>Sort</span>
            <select data-career-sort aria-label="Sort jobs">
              ${["Newest", "Deadline Soonest", "Most Relevant"].map((sort) => `<option value="${escapeHtml(sort)}"${state.careerSort === sort ? " selected" : ""}>${escapeHtml(sort)}</option>`).join("")}
            </select>
          </label>
        </div>
        <div class="career-filter-rail">
          ${renderCareerFilterGroup("Job Type", "type", careerFilterGroups.type, state.careerType)}
          ${renderCareerFilterGroup("Level", "level", careerFilterGroups.level, state.careerLevel)}
          ${renderCareerFilterGroup("Region", "region", careerFilterGroups.region, state.careerRegion)}
          ${renderCareerFilterGroup("Speciality", "speciality", careerFilterGroups.speciality, state.careerSpeciality)}
          ${renderCareerFilterGroup("Deadline", "deadline", careerFilterGroups.deadline, state.careerDeadline)}
        </div>
        <div class="career-results-head">
          <h2>${jobs.length} Jobs Found <span>${careerJobs().length} total</span></h2>
          ${hasActiveCareerFilters() ? `<button type="button" data-career-clear>${icon("x")} Clear filters</button>` : ""}
        </div>
        ${jobs.length ? `<div class="career-job-grid">${jobs.map(renderCareerJobCard).join("")}</div>` : `
          <div class="career-empty-state">
            <span class="career-empty-icon">${icon("briefcaseMedical")}</span>
            <h2>No jobs match your filters</h2>
            <p>Try adjusting your search or clearing filters.</p>
            <button type="button" data-career-clear>Clear filters</button>
          </div>
        `}
        ${renderSavedCareerJobsPanel()}
      </div>
    </section>
    ${renderExternalJobSources()}
    ${renderEmployerSpotlight()}
    ${renderJobAlerts()}
    ${renderCareerDrawer()}
  `;
}

function renderSavedCareerJobsPanel() {
  const saved = careerJobs().filter((job) => savedCareerJobs().has(job.id));
  if (!saved.length) {
    return `
      <aside class="career-saved-panel empty">
        <span class="career-saved-icon">${icon("heart")}</span>
        <div>
          <h3>No saved jobs yet</h3>
          <p>Click the heart on any job to save it for later.</p>
        </div>
      </aside>
    `;
  }
  return `
    <aside class="career-saved-panel">
      <div>
        <h3>${saved.length} Saved ${saved.length === 1 ? "Job" : "Jobs"}</h3>
        <p>Return to these opportunities before their deadlines.</p>
      </div>
      <div class="career-saved-list">
        ${saved.slice(0, 4).map((job) => `<button type="button" data-career-job-open="${escapeHtml(job.id)}">${escapeHtml(job.title)}<span>${escapeHtml(job.employer)}</span></button>`).join("")}
      </div>
    </aside>
  `;
}

function renderExternalJobSources() {
  return `
    <section class="section career-external-section">
      <div class="container">
        <div class="section-head">
          <div>
            <h2>Browse More on External Platforms</h2>
            <p>Use these trusted sources for additional Uganda, regional and international nursing opportunities.</p>
          </div>
        </div>
        <div class="career-source-row">
          ${careerExternalSources().map(([name, body, url]) => `
            <a class="career-source-card" href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">
              <span>${careerAvatar(name, "small")}</span>
              <strong>${escapeHtml(name)}</strong>
              <p>${escapeHtml(body)}</p>
              ${renderExternalLinkDisclosure("External job platform")}
              <em>Browse Jobs ↗</em>
            </a>
          `).join("")}
        </div>
      </div>
    </section>
  `;
}

function renderEmployerSpotlight() {
  return `
    <section class="section career-employer-section">
      <div class="container">
        <div class="section-head">
          <div>
            <h2>Featured Employers</h2>
            <p>Hospitals, agencies and organisations that commonly recruit nurses and midwives.</p>
          </div>
        </div>
        <div class="career-employer-row">
          ${careerEmployers().map((employer) => `
            <article class="career-employer-card">
              ${careerAvatar(employer.name)}
              <h3>${escapeHtml(employer.name)}</h3>
              <p>${escapeHtml(employer.location)} · ${escapeHtml(employer.type)}</p>
              <div class="career-badge-row">${employer.roles.map((role) => careerBadge(role, "speciality")).join("")}</div>
              ${employer.hiring ? `<span class="hiring-badge">${icon("badgeCheck")} Currently Hiring</span>` : ""}
              <a href="/careers">View Jobs ${icon("arrowRight")}</a>
            </article>
          `).join("")}
        </div>
        ${renderStudyDisclaimer("resource")}
      </div>
    </section>
  `;
}

function renderJobAlerts() {
  return `
    <section class="section career-alert-section">
      <div class="container career-alert-banner">
        <div>
          <h2>Never Miss a Nursing Job</h2>
          <p>Get new jobs matching your preferences delivered to your inbox</p>
          <small>No spam. Unsubscribe anytime.</small>
        </div>
        <form class="career-alert-form" data-career-alert-form>
          <input type="email" placeholder="Email address" aria-label="Email address" required>
          <select aria-label="Preferred speciality">
            ${careerFilterGroups.speciality.map((speciality) => `<option>${escapeHtml(speciality)}</option>`).join("")}
          </select>
          <select aria-label="Alert frequency"><option>Weekly</option><option>Daily</option></select>
          <button type="submit">Subscribe ${icon("arrowRight")}</button>
        </form>
      </div>
    </section>
  `;
}

function selectedCareerJob() {
  return careerJobs().find((job) => job.id === state.selectedCareerJob);
}

function renderCareerDrawer() {
  const job = selectedCareerJob();
  if (!job) return "";
  const saved = savedCareerJobs().has(job.id);
  const status = deadlineClass(job);
  return `
    <div class="career-drawer-overlay" data-career-drawer-overlay>
      <aside class="career-drawer" role="dialog" aria-modal="true" aria-labelledby="career-drawer-title">
        <button class="career-drawer-close" type="button" data-career-drawer-close aria-label="Close job details">${icon("x")}</button>
        <header class="career-drawer-header">
          ${careerAvatar(job.employer, "large")}
          <div>
            <h2 id="career-drawer-title">${escapeHtml(job.title)}</h2>
            <p>${escapeHtml(job.employer)}</p>
            <div class="career-badge-row">
              ${careerBadge(job.type, `type-${slugify(job.type)}`)}
              ${careerBadge(job.level, "level")}
              ${careerBadge(regionLabel(job.region), "region")}
              ${job.isFeatured ? `<span class="featured-flag">${icon("sparkles")} Featured</span>` : ""}
              ${job.isExternal ? `<span class="external-flag">${icon("externalLink")} External</span>` : ""}
            </div>
          </div>
        </header>
        <div class="career-drawer-body">
          <section>
            <h3>Overview</h3>
            <p>${escapeHtml(job.description)}</p>
            <h4>Key responsibilities</h4>
            <ul>${job.responsibilities.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
            <h4>Requirements</h4>
            <ul class="check-list">${job.requirements.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
          </section>
          <section>
            <h3>Details</h3>
            <div class="career-detail-grid">
              <span>${icon("mapPin")}<strong>Location</strong><em>${escapeHtml(job.location)}</em></span>
              <span>💰<strong>Salary</strong><em>${escapeHtml(job.salary)}</em></span>
              <span>${icon("calendar")}<strong>Posted</strong><em>${dateLabel(job.posted)}</em></span>
              <span class="${status}">${icon("calendar")}<strong>Deadline</strong><em>${dateLabel(job.deadline)}</em></span>
              <span>${icon("clipboardList")}<strong>Positions</strong><em>${job.positions}</em></span>
              <span>${icon("fileText")}<strong>Contract</strong><em>${escapeHtml(job.type)} · ${escapeHtml(job.duration)}</em></span>
            </div>
          </section>
          <section>
            <h3>How to Apply</h3>
            <p>Prepare the documents below and apply through the listed employer channel. For external listings, confirm the job on the source website before submitting personal documents.</p>
            <div class="career-doc-list">
              ${job.documents.map((doc) => `<label><input type="checkbox"> <span>${escapeHtml(doc)}</span></label>`).join("")}
            </div>
          </section>
          <section>
            <h3>About the Employer</h3>
            <p>${escapeHtml(job.employerDescription)}</p>
            <div class="career-badge-row">${careerBadge(job.employerType, "level")}${careerBadge(job.speciality, "speciality")}</div>
          </section>
        </div>
        <footer class="career-drawer-footer">
          <button type="button" class="career-save ${saved ? "active" : ""}" data-career-job-save="${escapeHtml(job.id)}">${icon("heart")} ${saved ? "Saved" : "Save Job"}</button>
          <a class="career-apply" href="${escapeHtml(job.applyUrl)}" ${job.isExternal ? `target="_blank" rel="noopener noreferrer"` : ""}>${job.isExternal ? "Apply on External Site" : "Apply Now"} ${icon("arrowRight")}</a>
        </footer>
      </aside>
    </div>
  `;
}

function careerPathwayData() {
  return {
    Nursing: ["Student Nurse|0 yrs|In training|Certificate, Diploma or Degree programme", "Intern/Volunteer Nurse|0-1 yr|UGX allowance|Certificate/Diploma", "Staff Nurse|1-3 yrs|UGX 1.2M-2.0M|Diploma/Degree", "Senior Staff Nurse|3-5 yrs|UGX 2.0M-3.0M|Experience + CPD", "Charge Nurse / Ward In-Charge|5-8 yrs|UGX 3.0M-4.2M|Leadership experience", "Nursing Officer|8-12 yrs|UGX 4.0M-5.5M|Degree required", "Principal Nursing Officer|12+ yrs|UGX 5.5M-7.0M|Advanced leadership", "Chief Nursing Officer|15+ yrs|UGX 7.0M+|Masters preferred"],
    Midwifery: ["Student Midwife|0 yrs|In training|Certificate, Diploma or Degree programme", "Intern/Volunteer Midwife|0-1 yr|UGX allowance|Certificate/Diploma", "Staff Midwife|1-3 yrs|UGX 1.2M-2.0M|Diploma/Degree", "Senior Midwife|3-5 yrs|UGX 2.0M-3.0M|Maternal care experience", "Maternity In-Charge|5-8 yrs|UGX 3.0M-4.2M|Labour ward leadership", "Midwifery Officer|8-12 yrs|UGX 4.0M-5.5M|Degree required", "Principal Midwifery Officer|12+ yrs|UGX 5.5M-7.0M|Advanced leadership", "Chief Midwifery Officer|15+ yrs|UGX 7.0M+|Masters preferred"]
  };
}

function renderCareerPathways() {
  const tracks = careerPathwayData();
  const specialities = [
    ["ICU/Critical Care", "1-2 years ward experience, critical care CPD", "+20-35%"],
    ["Theatre/Surgical", "Theatre placement, sterile technique, instrument skill", "+15-30%"],
    ["Paediatric", "Child health exposure and safeguarding knowledge", "+10-25%"],
    ["Community Health", "Public health, outreach and programme reporting", "+10-20%"],
    ["Mental Health", "Psychiatric nursing exposure and counselling skills", "+15-30%"],
    ["Oncology", "Chemotherapy safety, palliative care and counselling", "+20-40%"]
  ];
  return `
    <section id="career-pathways" class="section career-hub-section">
      <div class="container">
        <div class="section-head"><div><h2>Career Pathways</h2><p>Compare nursing and midwifery progression from student roles through senior leadership.</p></div></div>
        <div class="career-pathway-grid">
          ${Object.entries(tracks).map(([track, steps]) => `
            <article class="career-track">
              <h3>${escapeHtml(track)} Track</h3>
              <div class="career-timeline">
                ${steps.map((step, index) => {
                  const [title, years, salary, qualification] = step.split("|");
                  return `<div class="career-step ${index === 0 ? "current" : ""}"><span>${index + 1}</span><div><h4>${escapeHtml(title)}</h4><p>${escapeHtml(years)} · ${escapeHtml(salary)}</p><small>${escapeHtml(qualification)}</small></div></div>`;
                }).join("")}
              </div>
            </article>
          `).join("")}
        </div>
        <div class="career-speciality-grid">
          ${specialities.map(([name, req, uplift]) => `<article><h3>${escapeHtml(name)}</h3><p>${escapeHtml(req)}</p><span>${escapeHtml(uplift)} salary uplift</span></article>`).join("")}
        </div>
      </div>
    </section>
  `;
}

function countryGuides() {
  return [
    ["🇬🇧", "United Kingdom", "NHS · NMC Registration", "GBP 28,000-40,000", "NMC", "OSCE + CBT", "Health & Care Worker Visa", ["UNMC Certificate", "IELTS 7.0+", "Good Standing Letter", "Degree preferred"], 3, "6-18 months"],
    ["🇦🇺", "Australia", "AHPRA registration", "AUD 75,000-110,000", "AHPRA", "NCLEX / IELTS", "Subclass 190 / 482", ["UNMC registration", "English test", "Skills assessment", "Experience evidence"], 4, "9-24 months"],
    ["🇦🇪", "UAE", "DHA · HAAD · MOH exam", "AED 6,000-10,000", "DHA / DOH / MOH", "Prometric exam", "Employer visa", ["Two years experience", "DataFlow verification", "Good standing", "Agency screening"], 3, "3-9 months"],
    ["🇸🇦", "Saudi Arabia", "SCFHS registration", "SAR 5,000-9,000", "SCFHS", "Prometric exam", "Employer visa", ["Certificate verification", "Experience letters", "Good standing", "Medical check"], 3, "3-10 months"],
    ["🇶🇦", "Qatar", "QCHP registration", "QAR 8,000-12,000", "QCHP", "Prometric exam", "Employer visa", ["DataFlow", "Experience evidence", "Good standing", "Interview"], 3, "4-10 months"],
    ["🇿🇦", "South Africa", "SANC registration", "ZAR 260,000-430,000", "SANC", "SAQA recognition", "Work visa", ["SAQA evaluation", "Council verification", "Good standing", "English documents"], 4, "9-18 months"],
    ["🇰🇪", "Kenya/Tanzania", "EAC mobility", "Regional scale", "National councils", "Council recognition", "Regional work permit", ["UNMC status", "Good standing", "Transcript", "Employer letter"], 2, "2-6 months"]
  ];
}

function renderInternationalGuides() {
  return `
    <section id="international" class="section career-hub-section">
      <div class="container">
        <div class="section-head"><div><h2>Work Abroad as a Nurse</h2><p>Your Uganda qualification can open doors globally. Here's what you need for each destination.</p></div></div>
        <div class="country-grid">
          ${countryGuides().map(([flag, country, subtitle, salary, body, exam, visa, requirements, difficulty, timeline]) => `
            <article class="country-card">
              <header><span>${flag}</span><div><h3>${escapeHtml(country)}</h3><p>${escapeHtml(subtitle)}</p></div></header>
              <div class="country-facts">
                <span>Average Salary: <strong>${escapeHtml(salary)}</strong></span>
                <span>Registration Body: <strong>${escapeHtml(body)}</strong></span>
                <span>Key Exam: <strong>${escapeHtml(exam)}</strong></span>
                <span>Visa: <strong>${escapeHtml(visa)}</strong></span>
              </div>
              <div class="country-requirements"><strong>Requirements:</strong>${requirements.map((item) => `<span>${icon("checkCircle")} ${escapeHtml(item)}</span>`).join("")}</div>
              <div class="country-rating"><span>${"●".repeat(difficulty)}${"○".repeat(5 - difficulty)}</span><em>${difficulty > 3 ? "Challenging" : difficulty > 2 ? "Moderate" : "Accessible"}</em><strong>${escapeHtml(timeline)}</strong></div>
              <a href="/careers">View Full Guide ${icon("arrowRight")}</a>
            </article>
          `).join("")}
        </div>
      </div>
    </section>
  `;
}

function licensingGuides() {
  return [
    ["Register with UNMC", "For new graduates preparing first registration.", "Documents needed|Application form|Fee payment|Examination|Certificate", ["National ID", "Academic transcript", "Passport photo", "School completion letter"], "https://unmc.ug/"],
    ["Renew Your UNMC Licence", "Annual renewal process, fees and deadline planning.", "Check renewal window|Update CPD records|Pay renewal fee|Submit proof|Keep receipt", ["Current licence", "CPD evidence", "Payment receipt", "Contact details"], "https://unmc.ug/"],
    ["Get Qualifications Recognised Abroad", "Prepare UK NMC, AHPRA, DHA and SCFHS documentation.", "Choose destination|Verify documents|Book English test|Request council letters|Submit portal profile", ["Transcript", "Good standing letter", "Certificate of registration", "English test"], "https://www.nmc.org.uk/"],
    ["Good Standing Letter from UNMC", "What it is, why you need it and how to request it.", "Confirm eligibility|Gather registration proof|Pay request fee|Submit application|Collect letter", ["Registration certificate", "Licence copy", "Payment proof", "Destination body details"], "https://unmc.ug/"]
  ];
}

function renderLicensingGuides() {
  return `
    <section id="licensing" class="section career-hub-section">
      <div class="container">
        <div class="section-head"><div><h2>Licensing & Registration Guides</h2><p>Structured checklists for Uganda registration, renewal, good standing and international recognition.</p></div></div>
        <div class="licensing-grid">
          ${licensingGuides().map(([title, body, steps, docs, url]) => `
            <article class="licensing-card">
              <span class="card-icon">${iconFor(title)}</span>
              <h3>${escapeHtml(title)}</h3>
              <p>${escapeHtml(body)}</p>
              <details open><summary>Step list</summary><ol>${steps.split("|").map((step) => `<li>${escapeHtml(step)}</li>`).join("")}</ol></details>
              <div class="career-doc-list">${docs.map((doc) => `<label><input type="checkbox"> <span>${escapeHtml(doc)}</span></label>`).join("")}</div>
              <div class="licensing-actions">
                <button type="button" data-career-download="${escapeHtml(title)}">Download Checklist</button>
                <a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">Official Website ↗</a>
              </div>
            </article>
          `).join("")}
        </div>
      </div>
    </section>
  `;
}

function renderCareerResources() {
  const resources = [
    ["Uganda Nursing CV Template", "Local hospital and NGO CV structure with clinical placement detail.", "Download Template", "Free"],
    ["International Nursing CV Template", "UK and Australia style CV with registration and evidence sections.", "Download Template", "Free"],
    ["Cover Letter Guide", "Sample nursing cover letters and phrases that work.", "Open Guide", "Free"],
    ["Interview Preparation", "20 common questions, STAR examples and panel preparation.", "Practice", "Free"],
    ["Nursing Portfolio Guide", "What to include and how to present it digitally.", "Open Guide", "Coming Soon"],
    ["Salary Guide Uganda 2024", "Salary ranges by level, speciality and sector.", "View Guide", "Free"]
  ];
  return `
    <section id="cv-resources" class="section career-hub-section">
      <div class="container">
        <div class="section-head"><div><h2>Career Resources</h2><p>CV templates, interview preparation, portfolio guidance and salary planning.</p></div></div>
        <div class="career-resource-grid">
          ${resources.map(([title, body, action, badge], index) => `
            <article class="career-resource-card accent-${index % 4}">
              <span>${iconFor(title)}</span>
              <strong>${escapeHtml(badge)}</strong>
              <h3>${escapeHtml(title)}</h3>
              <p>${escapeHtml(body)}</p>
              <button type="button" data-career-download="${escapeHtml(title)}">${escapeHtml(action)} ${icon("arrowRight")}</button>
            </article>
          `).join("")}
        </div>
      </div>
    </section>
  `;
}

function renderCareerHub() {
  return `
    <section class="career-hub-nav">
      <div class="container">
        <a href="#career-pathways">${icon("chartLine")} Career Pathways</a>
        <a href="#international">${icon("globe")} International</a>
        <a href="#licensing">${icon("badgeCheck")} Licensing</a>
        <a href="#cv-resources">${icon("fileCv")} CV & Resources</a>
      </div>
    </section>
    <div class="career-mode-panel">
      ${renderCareerPathways()}
      ${renderInternationalGuides()}
      ${renderLicensingGuides()}
      ${renderCareerResources()}
    </div>
  `;
}

function dictionaryCategories() {
  return ["All", "Anatomy", "Physiology", "Pharmacology", "Pathology", "Clinical Skills", "Equipment", "Medical Conditions", "Procedures", "Abbreviations"];
}

function dictionaryBodySystems() {
  return ["All Systems", "Cardiovascular", "Respiratory", "Nervous", "Digestive", "Musculoskeletal", "Integumentary", "Endocrine", "Reproductive", "Urinary", "Immune", "Lymphatic"];
}

function dictionaryDifficulties() {
  return ["All", "Beginner", "Intermediate", "Advanced"];
}

function dictionaryLessonLinks() {
  return {
    "lesson-1": { title: "Terms Used in Anatomy and Physiology", course: "Anatomy and Physiology 1", href: "/courses/certificate-in-nursing/anatomy-and-physiology-1/terms-used-in-anatomy-and-physiology" },
    "lesson-2": { title: "Human Body Organization", course: "Anatomy and Physiology 1", href: "/courses/certificate-in-nursing/anatomy-and-physiology-1/human-body-organization" },
    "lesson-3": { title: "Body Fluids, Transport and Homeostasis", course: "Anatomy and Physiology 1", href: "/courses/certificate-in-nursing/anatomy-and-physiology-1/body-fluids-transport-and-homeostasis" },
    "lesson-7": { title: "Blood and Its Composition", course: "Anatomy and Physiology 1", href: "/courses/certificate-in-nursing/anatomy-and-physiology-1/blood-and-its-composition" },
    "lesson-8": { title: "Cardiovascular System", course: "Anatomy and Physiology 1", href: "/courses/certificate-in-nursing/anatomy-and-physiology-1/cardiovascular-system" }
  };
}

function makeDictionaryTerm(term, category, bodySystem, difficulty, simpleDefinition, definition, clinicalContext, extra = {}) {
  const slug = extra.slug || slugify(term);
  return {
    id: slug,
    term,
    slug,
    pronunciation: extra.pronunciation || "",
    partOfSpeech: extra.partOfSpeech || "noun",
    category,
    bodySystem,
    difficulty,
    simpleDefinition,
    definition,
    clinicalContext,
    example: extra.example || `In practice, nurses use the term ${term.toLowerCase()} when assessing, documenting or explaining patient care.`,
    relatedTerms: extra.relatedTerms || [],
    relatedLessons: extra.relatedLessons || [],
    tags: extra.tags || [slugify(term), slugify(category), slugify(bodySystem)].filter(Boolean),
    mnemonics: extra.mnemonics || "Connect the word to assessment, documentation and safe nursing action.",
    lastUpdated: extra.lastUpdated || "Updated weekly"
  };
}

function dictionaryTerms() {
  return [
    makeDictionaryTerm(
      "Epithelial Tissue",
      "Anatomy",
      "Integumentary",
      "Beginner",
      "Tissue that covers and protects surfaces inside and outside the body.",
      "A type of tissue that covers body surfaces, lines internal cavities and forms glands. It acts as a protective barrier against infection, injury and fluid loss.",
      "Damaged epithelial tissue increases infection risk. Nurses assess skin integrity, wound edges and mucous membranes during routine care.",
      {
        pronunciation: "ep-ih-THEE-lee-ul",
        example: "The lining of the mouth, the skin surface and the inner wall of the stomach are examples of epithelial tissue.",
        relatedTerms: ["connective-tissue", "tissue", "integumentary-system", "mucous-membrane"],
        relatedLessons: ["lesson-2"],
        tags: ["tissue", "anatomy", "cells", "skin", "barrier"],
        mnemonics: "Epithelial tissue covers, lines and forms glands."
      }
    ),
    makeDictionaryTerm("Connective Tissue", "Anatomy", "Musculoskeletal", "Beginner", "Tissue that supports, binds, protects and connects body parts.", "Connective tissue includes bone, cartilage, blood, adipose tissue and loose support tissue. It gives structure and support to organs and body systems.", "Nurses meet connective tissue concepts in wound healing, fractures, pressure injury prevention, blood disorders and mobility care.", { relatedTerms: ["epithelial-tissue", "tissue", "cartilage", "blood"], relatedLessons: ["lesson-2"] }),
    makeDictionaryTerm("Muscle Tissue", "Anatomy", "Musculoskeletal", "Beginner", "Tissue that contracts to produce movement.", "Muscle tissue is specialized for contraction. Skeletal muscle moves the body, cardiac muscle pumps blood and smooth muscle moves substances through organs.", "Weakness, cramps, paralysis and reduced mobility can reflect muscle or nerve problems that require careful nursing assessment.", { relatedTerms: ["nervous-tissue", "tissue", "musculoskeletal-system"], relatedLessons: ["lesson-2"] }),
    makeDictionaryTerm("Nervous Tissue", "Anatomy", "Nervous", "Beginner", "Tissue that receives and sends messages in the body.", "Nervous tissue is made of neurons and support cells. It detects change, carries impulses and coordinates body responses.", "Nurses assess consciousness, orientation, pain response, pupil reaction and limb movement to monitor nervous system function.", { relatedTerms: ["muscle-tissue", "neuron", "nervous-system"], relatedLessons: ["lesson-2"] }),
    makeDictionaryTerm("Tissue", "Anatomy", "All Systems", "Beginner", "A group of similar cells working together for one function.", "A tissue is a level of body organization between cells and organs. The four major tissue groups are epithelial, connective, muscle and nervous tissue.", "Understanding tissue helps nurses connect wounds, inflammation, oxygen supply and healing to the patient's overall condition.", { relatedTerms: ["cell", "organ", "epithelial-tissue"], relatedLessons: ["lesson-2"] }),
    makeDictionaryTerm("Cell", "Anatomy", "All Systems", "Beginner", "The smallest living unit of the body.", "A cell is the basic structural and functional unit of life. Cells use oxygen and nutrients, remove waste, respond to signals and reproduce when needed.", "Poor oxygen, glucose or fluid balance affects cell function first, then tissues, organs and the whole patient.", { relatedTerms: ["tissue", "metabolism", "homeostasis"], relatedLessons: ["lesson-2"] }),
    makeDictionaryTerm("Organ", "Anatomy", "All Systems", "Beginner", "A body structure made from two or more tissues with a specific job.", "An organ is formed when tissues work together for a specific function. Examples include the heart, lungs, kidneys, skin, stomach and brain.", "Nurses assess organ function by observing breathing, pulse, urine output, skin condition, consciousness and other clinical signs.", { relatedTerms: ["tissue", "organ-system", "homeostasis"], relatedLessons: ["lesson-2"] }),
    makeDictionaryTerm("Organ System", "Anatomy", "All Systems", "Beginner", "A group of organs working together for a major body function.", "An organ system is a set of organs that cooperate to maintain life, such as the respiratory, cardiovascular, digestive and urinary systems.", "System thinking helps nurses prioritize airway, breathing, circulation, elimination, nutrition and neurological status.", { relatedTerms: ["organ", "homeostasis"], relatedLessons: ["lesson-2"] }),
    makeDictionaryTerm("Homeostasis", "Physiology", "All Systems", "Beginner", "The body's ability to keep internal conditions stable.", "Homeostasis is the maintenance of a stable internal environment despite changes inside or outside the body.", "Nurses support homeostasis through monitoring vital signs, fluids, glucose, temperature, oxygenation and elimination.", { relatedTerms: ["metabolism", "electrolyte", "body-fluids"], relatedLessons: ["lesson-3"] }),
    makeDictionaryTerm("Metabolism", "Physiology", "Endocrine", "Beginner", "All the chemical reactions that keep the body alive.", "Metabolism includes reactions that build body materials and reactions that break down nutrients to release energy.", "Changes in metabolism may appear as altered temperature, weight change, fatigue, glucose imbalance or poor wound healing.", { relatedTerms: ["cell", "glucose", "homeostasis"], relatedLessons: ["lesson-2"] }),
    makeDictionaryTerm("Electrolyte", "Physiology", "All Systems", "Intermediate", "A charged mineral in body fluids that supports nerves, muscles and fluid balance.", "Electrolytes such as sodium, potassium, calcium and chloride help regulate fluid movement, muscle contraction, heart rhythm and nerve function.", "Abnormal electrolytes can cause weakness, confusion, seizures or dangerous heart rhythms, so nurses monitor results and report changes.", { relatedTerms: ["dehydration", "homeostasis", "body-fluids"], relatedLessons: ["lesson-3"] }),
    makeDictionaryTerm("Dehydration", "Pathology", "All Systems", "Beginner", "Too little water in the body.", "Dehydration occurs when fluid loss is greater than fluid intake. It may follow vomiting, diarrhoea, fever, bleeding, poor intake or excessive sweating.", "Nurses assess thirst, dry mucous membranes, reduced urine, low blood pressure, fast pulse, poor skin turgor and altered consciousness.", { relatedTerms: ["electrolyte", "shock", "blood-pressure"], relatedLessons: ["lesson-3"] }),
    makeDictionaryTerm("Edema", "Pathology", "Cardiovascular", "Intermediate", "Swelling caused by excess fluid in body tissues.", "Edema is the accumulation of fluid in the interstitial spaces. It may occur in the legs, hands, face, abdomen or lungs.", "Nurses observe swelling, skin tightness, weight gain, shortness of breath and response to positioning or prescribed medicines.", { relatedTerms: ["fluid-balance", "heart-failure", "homeostasis"], relatedLessons: ["lesson-3"] }),
    makeDictionaryTerm("Hypoxia", "Pathology", "Respiratory", "Intermediate", "Not enough oxygen reaching body tissues.", "Hypoxia occurs when tissues receive insufficient oxygen for normal function. It may result from airway obstruction, lung disease, poor circulation or anaemia.", "Nurses monitor respiratory rate, oxygen saturation, mental status, cyanosis and work of breathing, then escalate quickly when oxygenation is unsafe.", { relatedTerms: ["oxygen-saturation", "cyanosis", "airway"], relatedLessons: ["lesson-3"] }),
    makeDictionaryTerm("Cyanosis", "Pathology", "Respiratory", "Intermediate", "Bluish discoloration of skin or mucous membranes from low oxygen.", "Cyanosis is a clinical sign where the skin, lips or nail beds appear blue or dusky because blood oxygen is low.", "Nurses treat cyanosis as an urgent warning sign and assess airway, breathing, circulation and oxygen saturation.", { relatedTerms: ["hypoxia", "oxygen-saturation", "airway"], relatedLessons: ["lesson-3"] }),
    makeDictionaryTerm("Blood Pressure", "Clinical Skills", "Cardiovascular", "Beginner", "The force of blood pushing against artery walls.", "Blood pressure is recorded as systolic pressure over diastolic pressure. It reflects circulation, vascular resistance and heart pumping action.", "Nurses measure blood pressure accurately, compare it with baseline and report very high, very low or rapidly changing readings.", { relatedTerms: ["pulse", "hypertension", "shock"], relatedLessons: ["lesson-8"] }),
    makeDictionaryTerm("Pulse", "Clinical Skills", "Cardiovascular", "Beginner", "The beat felt as blood is pumped through arteries.", "Pulse is the rhythmic expansion of an artery caused by heart contraction. It is assessed by rate, rhythm, strength and equality.", "Pulse assessment helps nurses identify pain, fever, dehydration, shock, arrhythmia and response to treatment.", { relatedTerms: ["blood-pressure", "shock", "cardiovascular-system"], relatedLessons: ["lesson-8"] }),
    makeDictionaryTerm("Respiration", "Clinical Skills", "Respiratory", "Beginner", "The act of breathing in oxygen and breathing out carbon dioxide.", "Respiration includes ventilation and gas exchange. Nurses assess rate, depth, rhythm, effort and breath sounds.", "Abnormal respiration may indicate pain, anxiety, infection, asthma, hypoxia, shock or neurological changes.", { relatedTerms: ["oxygen-saturation", "hypoxia", "airway"], relatedLessons: ["lesson-3"] }),
    makeDictionaryTerm("Temperature", "Clinical Skills", "All Systems", "Beginner", "A measurement of body heat.", "Body temperature shows the balance between heat production and heat loss. Fever or low temperature can signal illness or environmental stress.", "Nurses record temperature, compare trends and link findings to infection, dehydration, exposure or medication effects.", { relatedTerms: ["fever", "infection", "homeostasis"], relatedLessons: ["lesson-3"] }),
    makeDictionaryTerm("Oxygen Saturation", "Clinical Skills", "Respiratory", "Beginner", "The percentage of haemoglobin carrying oxygen in the blood.", "Oxygen saturation is commonly measured with a pulse oximeter and helps estimate how well oxygen is being carried.", "A falling saturation can be an early danger sign. Nurses confirm probe placement, assess the patient and escalate according to protocol.", { relatedTerms: ["hypoxia", "cyanosis", "respiration"], relatedLessons: ["lesson-3"] }),
    makeDictionaryTerm("Capillary Refill", "Clinical Skills", "Cardiovascular", "Beginner", "A quick test of blood flow to small vessels.", "Capillary refill is checked by pressing a nail bed or skin area and observing how quickly normal colour returns.", "Slow refill may suggest poor perfusion, cold exposure, dehydration or shock, and should be interpreted with other observations.", { relatedTerms: ["pulse", "shock", "blood-pressure"], relatedLessons: ["lesson-8"] }),
    makeDictionaryTerm("Asepsis", "Clinical Skills", "Immune", "Beginner", "Practices that prevent contamination by harmful microorganisms.", "Asepsis means reducing or preventing the introduction of infection-causing organisms during care.", "Hand hygiene, clean technique, sterile technique and safe handling of equipment protect patients from healthcare-associated infection.", { relatedTerms: ["infection", "wound", "sterile-technique"], relatedLessons: ["lesson-1"] }),
    makeDictionaryTerm("Infection", "Pathology", "Immune", "Beginner", "Invasion and multiplication of harmful microorganisms in the body.", "Infection occurs when bacteria, viruses, fungi or parasites enter and multiply, causing local or systemic effects.", "Nurses monitor temperature, pain, swelling, wound discharge, respiratory symptoms and sepsis warning signs.", { relatedTerms: ["asepsis", "inflammation", "sepsis"], relatedLessons: ["lesson-1"] }),
    makeDictionaryTerm("Inflammation", "Pathology", "Immune", "Beginner", "The body's protective response to injury or infection.", "Inflammation is a response involving redness, heat, swelling, pain and sometimes loss of function.", "Nurses observe inflammatory signs around wounds, cannula sites, joints and mucous membranes, then document and report concerns.", { relatedTerms: ["infection", "wound", "edema"], relatedLessons: ["lesson-1"] }),
    makeDictionaryTerm("Wound", "Clinical Skills", "Integumentary", "Beginner", "A break or injury in body tissue.", "A wound may involve skin, mucous membrane or deeper tissue. It can result from surgery, trauma, pressure, burns or disease.", "Nurses assess wound size, depth, edges, exudate, odour, pain, surrounding skin and signs of infection.", { relatedTerms: ["epithelial-tissue", "infection", "inflammation"], relatedLessons: ["lesson-2"] }),
    makeDictionaryTerm("Hemorrhage", "Pathology", "Cardiovascular", "Intermediate", "Bleeding from a damaged blood vessel.", "Hemorrhage may be external or internal and can lead to shock if blood loss is significant.", "Nurses monitor bleeding, pulse, blood pressure, skin condition, consciousness and urine output while escalating urgently.", { relatedTerms: ["shock", "pulse", "blood-pressure"], relatedLessons: ["lesson-7"] }),
    makeDictionaryTerm("Shock", "Medical Conditions", "Cardiovascular", "Advanced", "A life-threatening state where tissues do not receive enough blood flow and oxygen.", "Shock occurs when circulation cannot meet tissue needs. Causes include blood loss, severe infection, heart problems and allergic reactions.", "Nursing priorities include rapid recognition, airway and breathing support, circulation monitoring, fluid preparation and urgent escalation.", { relatedTerms: ["hypoxia", "hemorrhage", "sepsis"], relatedLessons: ["lesson-8"] }),
    makeDictionaryTerm("Analgesic", "Pharmacology", "Nervous", "Beginner", "A medicine used to relieve pain.", "Analgesics reduce pain through different mechanisms. Examples include paracetamol, non-steroidal anti-inflammatory medicines and opioids.", "Nurses assess pain before and after administration, check allergies, watch adverse effects and document response.", { relatedTerms: ["pain", "opioid", "medication"], relatedLessons: ["lesson-1"] }),
    makeDictionaryTerm("Antibiotic", "Pharmacology", "Immune", "Beginner", "A medicine used to treat bacterial infection.", "Antibiotics kill bacteria or stop their growth. They do not treat viral infections unless bacterial infection is also present.", "Nurses check prescriptions, allergies, timing, route, cultures where ordered and patient response to treatment.", { relatedTerms: ["infection", "sepsis", "asepsis"], relatedLessons: ["lesson-1"] }),
    makeDictionaryTerm("Intravenous", "Procedures", "Cardiovascular", "Beginner", "Given into a vein.", "Intravenous, often shortened to IV, means a medicine or fluid is delivered directly into the venous circulation.", "Nurses monitor cannula site, fluid rate, compatibility, infiltration, phlebitis and patient response.", { relatedTerms: ["electrolyte", "dehydration", "medication"], relatedLessons: ["lesson-3"] }),
    makeDictionaryTerm("Intramuscular Injection", "Procedures", "Musculoskeletal", "Beginner", "An injection given into muscle.", "An intramuscular injection places medicine into muscle tissue for absorption into the bloodstream.", "Nurses select the correct site, needle size, angle and infection prevention steps while observing for pain or reaction.", { relatedTerms: ["subcutaneous-injection", "asepsis", "medication"], relatedLessons: ["lesson-1"] }),
    makeDictionaryTerm("Subcutaneous Injection", "Procedures", "Integumentary", "Beginner", "An injection given into the fatty layer under the skin.", "A subcutaneous injection places medicine into tissue below the skin and above the muscle.", "Common examples include insulin and some anticoagulants. Nurses rotate sites and assess for bruising or irritation.", { relatedTerms: ["intramuscular-injection", "blood-glucose", "asepsis"], relatedLessons: ["lesson-1"] }),
    makeDictionaryTerm("Blood Glucose", "Clinical Skills", "Endocrine", "Beginner", "The amount of sugar in the blood.", "Blood glucose is a key energy measurement. It can become too high or too low in diabetes, illness, fasting or medication effects.", "Nurses monitor glucose, recognize hypoglycaemia or hyperglycaemia signs and follow facility protocols.", { relatedTerms: ["metabolism", "homeostasis", "subcutaneous-injection"], relatedLessons: ["lesson-3"] }),
    makeDictionaryTerm("Fever", "Medical Conditions", "Immune", "Beginner", "A body temperature higher than normal.", "Fever is often a response to infection, inflammation or other illness. It reflects changes in temperature regulation.", "Nurses monitor temperature trends, hydration, comfort, prescribed medicines and danger signs such as confusion or stiff neck.", { relatedTerms: ["temperature", "infection", "dehydration"], relatedLessons: ["lesson-3"] }),
    makeDictionaryTerm("Airway", "Clinical Skills", "Respiratory", "Beginner", "The passage that allows air to move into and out of the lungs.", "The airway includes the nose, mouth, throat, larynx, trachea and bronchi. A clear airway is essential for breathing.", "Airway assessment is a first nursing priority. Obstruction, secretions, vomiting or reduced consciousness can quickly become life-threatening.", { relatedTerms: ["respiration", "hypoxia", "aspiration"], relatedLessons: ["lesson-3"] }),
    makeDictionaryTerm("Aspiration", "Pathology", "Respiratory", "Intermediate", "Entry of food, fluid, saliva or vomit into the airway.", "Aspiration can irritate the lungs, block breathing or cause aspiration pneumonia.", "Nurses reduce risk by positioning patients safely, checking swallowing ability and monitoring coughing, choking or breathing changes.", { relatedTerms: ["airway", "hypoxia", "pneumonia"], relatedLessons: ["lesson-3"] }),
    makeDictionaryTerm("Hypertension", "Medical Conditions", "Cardiovascular", "Intermediate", "Blood pressure that remains higher than normal.", "Hypertension increases strain on the heart and blood vessels and raises the risk of stroke, heart disease and kidney disease.", "Nurses measure accurately, support lifestyle education, monitor medicine adherence and report very high readings or symptoms.", { relatedTerms: ["blood-pressure", "stroke", "myocardial-infarction"], relatedLessons: ["lesson-8"] }),
    makeDictionaryTerm("Myocardial Infarction", "Medical Conditions", "Cardiovascular", "Advanced", "A heart attack caused by blocked blood supply to heart muscle.", "Myocardial infarction occurs when part of the heart muscle is injured because oxygen-rich blood cannot reach it.", "Nurses treat chest pain, breathlessness, sweating, nausea or collapse as urgent, monitor vital signs and support emergency care.", { relatedTerms: ["blood-pressure", "pulse", "shock"], relatedLessons: ["lesson-8"], tags: ["heart attack", "mi", "cardiac", "chest pain"] }),
    makeDictionaryTerm("Stroke", "Medical Conditions", "Nervous", "Advanced", "Sudden brain injury caused by blocked or bleeding blood vessels.", "Stroke occurs when blood supply to part of the brain is interrupted or bleeding occurs in the brain.", "Nurses watch for facial droop, arm weakness, speech difficulty, altered consciousness and urgent onset time documentation.", { relatedTerms: ["blood-pressure", "nervous-tissue", "hypertension"], relatedLessons: ["lesson-8"] }),
    makeDictionaryTerm("Sepsis", "Medical Conditions", "Immune", "Advanced", "A life-threatening body response to infection.", "Sepsis is severe organ-threatening illness caused by a dysregulated response to infection.", "Nurses monitor temperature, pulse, respiration, blood pressure, mental status and urine output, then escalate immediately when sepsis is suspected.", { relatedTerms: ["infection", "shock", "antibiotic"], relatedLessons: ["lesson-1"] })
  ];
}

function dictionaryAbbreviations() {
  return [
    ["ABG", "Arterial Blood Gas"], ["AIDS", "Acquired Immunodeficiency Syndrome"], ["BP", "Blood Pressure"], ["BPM", "Beats Per Minute"],
    ["CBC", "Complete Blood Count"], ["CPR", "Cardiopulmonary Resuscitation"], ["CVA", "Cerebrovascular Accident"], ["DVT", "Deep Vein Thrombosis"],
    ["ECG", "Electrocardiogram"], ["ENT", "Ear, Nose and Throat"], ["GCS", "Glasgow Coma Scale"], ["Hb", "Haemoglobin"],
    ["HIV", "Human Immunodeficiency Virus"], ["IM", "Intramuscular"], ["IV", "Intravenous"], ["NBM", "Nil By Mouth"],
    ["NGT", "Nasogastric Tube"], ["NPO", "Nothing By Mouth"], ["OBS", "Observations"], ["OD", "Once Daily"],
    ["PRN", "As Needed"], ["QID", "Four Times Daily"], ["ROM", "Range of Motion"], ["SOB", "Shortness of Breath"],
    ["SpO2", "Peripheral Oxygen Saturation"], ["STAT", "Immediately"], ["TDS", "Three Times Daily"], ["TPR", "Temperature, Pulse, Respiration"],
    ["UTI", "Urinary Tract Infection"], ["WBC", "White Blood Cell"]
  ];
}

function dictionaryTermBySlug(slug) {
  return dictionaryTerms().find((term) => term.slug === slugify(slug));
}

function dictionaryRouteFilter(parts) {
  if (parts[1] === "category" && parts[2]) return { type: "category", value: parts[2] };
  if (parts[1] === "system" && parts[2]) return { type: "system", value: parts[2] };
  return null;
}

function dictionaryLabelMatches(label, slug) {
  const clean = slugify(slug || "");
  return slugify(label || "") === clean || slugify(`${label || ""} System`) === clean || slugify(String(label || "").replace(/\s+System$/i, "")) === clean;
}

function dictionarySearchMatches(term, query) {
  const q = String(query || "").trim().toLowerCase();
  if (!q) return true;
  const haystack = [
    term.term,
    term.definition,
    term.simpleDefinition,
    term.clinicalContext,
    term.category,
    term.bodySystem,
    term.difficulty,
    ...(term.tags || [])
  ].join(" ").toLowerCase();
  return haystack.includes(q);
}

function filteredDictionaryTerms(parts = currentRoute()) {
  const routeFilter = dictionaryRouteFilter(parts);
  return dictionaryTerms().filter((term) => {
    const routeOk = !routeFilter
      || (routeFilter.type === "category" && dictionaryLabelMatches(term.category, routeFilter.value))
      || (routeFilter.type === "system" && dictionaryLabelMatches(term.bodySystem, routeFilter.value));
    const categoryOk = state.dictionaryCategory === "All" || term.category === state.dictionaryCategory;
    const systemOk = state.dictionarySystem === "All Systems" || term.bodySystem === state.dictionarySystem || `${term.bodySystem} System` === state.dictionarySystem;
    const difficultyOk = state.dictionaryDifficulty === "All" || term.difficulty === state.dictionaryDifficulty;
    return routeOk && categoryOk && systemOk && difficultyOk && dictionarySearchMatches(term, state.dictionarySearch);
  }).sort((a, b) => a.term.localeCompare(b.term));
}

function dictionaryGroupByLetter(terms) {
  return terms.reduce((groups, term) => {
    const letter = term.term.charAt(0).toUpperCase();
    groups[letter] = groups[letter] || [];
    groups[letter].push(term);
    return groups;
  }, {});
}

function dictionaryBadge(label, className = "") {
  return `<span class="dictionary-badge ${className}">${escapeHtml(label)}</span>`;
}

function dictionaryFilterSelect(label, key, values, active) {
  return `
    <label class="dictionary-filter-select">
      <span>${escapeHtml(label)}</span>
      <select data-dictionary-select="${escapeHtml(key)}" aria-label="Filter dictionary by ${escapeHtml(label.toLowerCase())}">
        ${values.map((value) => `<option value="${escapeHtml(value)}"${active === value ? " selected" : ""}>${escapeHtml(value)}</option>`).join("")}
      </select>
    </label>
  `;
}

function renderDictionarySearch() {
  const suggestions = dictionaryTerms()
    .filter((term) => state.dictionarySearch && dictionarySearchMatches(term, state.dictionarySearch))
    .slice(0, 8);
  return `
    <div class="dict-search-wrap">
      <form class="dict-search-bar" data-dictionary-search-form role="search">
        ${icon("search")}
        <input class="dict-search-input" type="search" value="${escapeHtml(state.dictionarySearch)}"
          placeholder="Search a term, condition or abbreviation…"
          data-dictionary-search aria-label="Search dictionary terms" autocomplete="off">
        ${state.dictionarySearch ? `<button class="dict-search-clear" type="button" data-dictionary-clear aria-label="Clear search">${icon("x")}</button>` : ""}
        ${state.dictionarySearch ? `
          <div class="dict-search-results" role="listbox" aria-label="Dictionary suggestions">
            ${suggestions.length ? suggestions.map((term) => `
              <a href="/dictionary/${escapeHtml(term.slug)}" class="dict-search-result">
                <span class="dict-result-icon">${icon("fileText")}</span>
                <div class="dict-result-body">
                  <strong>${escapeHtml(term.term)}</strong>
                  <span>${escapeHtml(term.simpleDefinition)}</span>
                </div>
                ${dictionaryBadge(term.category)}
              </a>
            `).join("") : `
              <div class="dict-search-empty">
                ${icon("search")}
                <strong>No terms found for "${escapeHtml(state.dictionarySearch)}"</strong>
                <span>Try a shorter word, a body system, or an abbreviation.</span>
              </div>
            `}
          </div>
        ` : ""}
      </form>
    </div>
  `;
}

function renderDictionaryFilters(parts = currentRoute()) {
  const visibleTerms = filteredDictionaryTerms(parts);
  const allTerms = dictionaryTerms();
  const hasFilters = state.dictionarySearch || state.dictionaryCategory !== "All" || state.dictionarySystem !== "All Systems" || state.dictionaryDifficulty !== "All";
  return `
    <div class="dict-filter-bar">
      <div class="dict-filter-controls">
        ${dictionaryFilterSelect("Category", "category", dictionaryCategories(), state.dictionaryCategory)}
        ${dictionaryFilterSelect("Body System", "system", dictionaryBodySystems(), state.dictionarySystem)}
        ${dictionaryFilterSelect("Difficulty", "difficulty", dictionaryDifficulties(), state.dictionaryDifficulty)}
        ${hasFilters ? `<button class="dict-clear-btn" type="button" data-dictionary-clear>${icon("x")}<span>Clear</span></button>` : ""}
      </div>
      <div class="dict-quick-pills" aria-label="Quick filters">
        ${["Clinical Skills", "Pharmacology", "Medical Conditions", "Procedures", "Anatomy"].map((cat) => `
          <button class="dictionary-filter-pill${state.dictionaryCategory === cat ? " active" : ""}" type="button" data-dictionary-filter="category" data-dictionary-filter-value="${escapeHtml(cat)}">${escapeHtml(cat)}</button>
        `).join("")}
        ${["Respiratory", "Cardiovascular", "Nervous"].map((sys) => `
          <button class="dictionary-filter-pill${state.dictionarySystem === sys ? " active" : ""}" type="button" data-dictionary-filter="system" data-dictionary-filter-value="${escapeHtml(sys)}">${escapeHtml(sys)}</button>
        `).join("")}
      </div>
      <div class="dict-count-row">
        <span><strong>${visibleTerms.length}</strong> of <strong>${allTerms.length}</strong> terms</span>
        <span><strong>${dictionaryCategories().length - 1}</strong> categories · <strong>${dictionaryBodySystems().length - 1}</strong> body systems</span>
      </div>
    </div>
  `;
}

function renderDictionaryAlphabetNav(terms) {
  const lettersWithTerms = new Set(terms.map((term) => term.term.charAt(0).toUpperCase()));
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  return `
    <nav class="dictionary-alpha-nav" aria-label="Dictionary alphabet navigation">
      ${letters.map((letter) => `
        <button type="button" class="${lettersWithTerms.has(letter) ? "has-terms" : "empty"}" ${lettersWithTerms.has(letter) ? `data-dictionary-letter="${letter}"` : "disabled"}>${letter}</button>
      `).join("")}
    </nav>
  `;
}

function renderDictionaryTermRow(term) {
  return `
    <a class="dict-term-row" href="/dictionary/${escapeHtml(term.slug)}">
      <div class="dict-term-row-main">
        <strong>${escapeHtml(term.term)}</strong>
        ${term.pronunciation ? `<span class="dict-term-pron">${escapeHtml(term.pronunciation)}</span>` : ""}
        <p>${escapeHtml(term.simpleDefinition)}</p>
      </div>
      <div class="dict-term-row-meta">
        ${dictionaryBadge(term.category)}
        <span class="dict-term-system">${escapeHtml(term.bodySystem)}</span>
        <span class="dict-difficulty dict-difficulty-${escapeHtml(term.difficulty.toLowerCase())}">${escapeHtml(term.difficulty)}</span>
      </div>
      <span class="dict-term-arrow">${icon("arrowRight")}</span>
    </a>
  `;
}

function renderDictionaryListing(parts = currentRoute()) {
  const terms = filteredDictionaryTerms(parts);
  const groups = dictionaryGroupByLetter(terms);
  const allTerms = dictionaryTerms();
  const routeFilter = dictionaryRouteFilter(parts);
  const pageTitle = routeFilter
    ? routeFilter.type === "category"
      ? dictionaryCategories().find((item) => dictionaryLabelMatches(item, routeFilter.value)) || routeFilter.value
      : dictionaryBodySystems().find((item) => dictionaryLabelMatches(item, routeFilter.value)) || routeFilter.value
    : "Nursing Dictionary";
  return `
    ${pageHeader({
      eyebrow: "Reference",
      title: routeFilter ? escapeHtml(pageTitle) : "Nursing Dictionary",
      body: routeFilter ? `Showing ${terms.length} terms in this category.` : `${allTerms.length} clear definitions for nursing and medical terms — from anatomy to pharmacology.`,
      actions: `${buttonLink("/dictionary/abbreviations", "Abbreviations", "secondary", "fileText")}`
    })}
    <section class="section compact-section dict-search-section">
      <div class="container">
        ${renderDictionarySearch()}
      </div>
    </section>
    <section class="section compact-section">
      <div class="container">
        ${renderDictionaryFilters(parts)}
        ${renderDictionaryAlphabetNav(terms)}
        ${terms.length ? `
          <div class="dict-term-list" aria-label="Dictionary terms">
            ${Object.keys(groups).sort().map((letter) => `
              <div class="dict-letter-group" id="dict-letter-${letter}">
                <div class="dict-letter-head">${letter}</div>
                ${groups[letter].map(renderDictionaryTermRow).join("")}
              </div>
            `).join("")}
          </div>
        ` : `
          <div class="dict-empty-state">
            ${icon("search")}
            <strong>No terms match your filters</strong>
            <p>Try clearing filters, searching a shorter word, or browsing by A–Z.</p>
            <button type="button" class="button primary" data-dictionary-clear>Clear filters</button>
          </div>
        `}
      </div>
    </section>
  `;
}

function renderDictionarySidebar(term) {
  const related = (term.relatedTerms || []).map(dictionaryTermBySlug).filter(Boolean).slice(0, 6);
  return `
    <aside class="dictionary-term-sidebar">
      <div class="dict-side-back">
        <a href="/dictionary">${icon("arrowLeft")}<span>Dictionary</span></a>
      </div>
      <div class="dictionary-side-block">
        <span class="mini-label">Browse</span>
        <a href="/dictionary">${icon("bookOpen")} All terms</a>
        <a href="/dictionary/abbreviations">${icon("fileText")} Abbreviations</a>
        <a href="/dictionary/category/${escapeHtml(slugify(term.category))}">${icon("tag")} ${escapeHtml(term.category)}</a>
        <a href="/dictionary/system/${escapeHtml(slugify(term.bodySystem))}">${icon("activity")} ${escapeHtml(term.bodySystem)}</a>
      </div>
      <div class="dictionary-side-block">
        <span class="mini-label">Related Terms</span>
        ${related.length
          ? related.map((item) => `<a href="/dictionary/${escapeHtml(item.slug)}" class="dict-related-link">${escapeHtml(item.term)}</a>`).join("")
          : `<p class="muted-small">Related terms will be added as the dictionary grows.</p>`}
      </div>
    </aside>
  `;
}

function renderDictionaryTermToc() {
  const items = [
    ["definition", "Definition"],
    ["simple-explanation", "Simple Explanation"],
    ["clinical-context", "Clinical Context"],
    ["example-practice", "Example in Practice"],
    ["memory-aid", "Memory Aid"],
    ["related-terms", "Related Terms"],
    ["related-lessons", "Related Lessons"]
  ];
  return `
    <aside class="dictionary-term-toc">
      <span class="mini-label">On This Page</span>
      ${items.map(([id, label], index) => `
        <button type="button" data-scroll-target="${id}" class="${index === 0 ? "active" : ""}"><span></span>${escapeHtml(label)}</button>
      `).join("")}
    </aside>
  `;
}

function renderDictionaryDetailSection(id, number, title, body) {
  return `
    <section class="dictionary-detail-section" id="${escapeHtml(id)}">
      <header><span>${number}</span><h2>${escapeHtml(title)}</h2></header>
      <div class="dictionary-detail-body">${body}</div>
    </section>
  `;
}

function renderDictionaryTermPage(slug) {
  const term = dictionaryTermBySlug(slug);
  if (!term) return notFound();
  const related = (term.relatedTerms || []).map(dictionaryTermBySlug).filter(Boolean);
  const lessonMap = dictionaryLessonLinks();
  const lessons = (term.relatedLessons || []).map((id) => lessonMap[id]).filter(Boolean);
  return `
    <main class="dictionary-term-page">
      <div class="dictionary-term-layout">
        ${renderDictionarySidebar(term)}
        <article class="dictionary-term-main">
          <header class="dict-term-header">
            <nav class="dict-term-breadcrumb">
              <a href="/dictionary">Dictionary</a>${icon("arrowRight")}
              <a href="/dictionary/category/${escapeHtml(slugify(term.category))}">${escapeHtml(term.category)}</a>${icon("arrowRight")}
              <strong>${escapeHtml(term.term)}</strong>
            </nav>
            <div class="dict-term-title-row">
              <div>
                ${term.pronunciation ? `<p class="dictionary-pronunciation">${escapeHtml(term.pronunciation)}</p>` : ""}
                <h1>${escapeHtml(term.term)}</h1>
                <span class="dict-part-of-speech">${escapeHtml(term.partOfSpeech)}</span>
              </div>
              <div class="dict-term-badges">
                ${dictionaryBadge(term.category)}
                ${dictionaryBadge(term.bodySystem)}
                <span class="dict-difficulty dict-difficulty-${escapeHtml(term.difficulty.toLowerCase())}">${escapeHtml(term.difficulty)}</span>
              </div>
            </div>
          </header>
          <div class="dictionary-detail-flow">
            ${renderDictionaryDetailSection("definition", 1, "Definition", `<blockquote class="dictionary-definition-quote">${escapeHtml(term.definition)}</blockquote>`)}
            ${renderDictionaryDetailSection("simple-explanation", 2, "In Simple Terms", `<div class="simple-definition-card">${escapeHtml(term.simpleDefinition)}</div>`)}
            ${renderDictionaryDetailSection("clinical-context", 3, "Clinical Relevance for Nurses", `<div class="dictionary-clinical-card"><span>${icon("stethoscope")} Clinical Context</span><p>${escapeHtml(term.clinicalContext)}</p></div>`)}
            ${renderDictionaryDetailSection("example-practice", 4, "Example in Practice", `<div class="dictionary-example-card">${icon("bookOpen")}<p>${escapeHtml(term.example)}</p></div>`)}
            ${renderDictionaryDetailSection("memory-aid", 5, "Memory Aid", `<div class="dictionary-memory-card">${icon("lightbulb")}<p>${escapeHtml(term.mnemonics)}</p></div>`)}
            ${renderDictionaryDetailSection("related-terms", 6, "Related Terms", related.length ? `
              <div class="related-term-grid">
                ${related.map((item) => `
                  <a href="/dictionary/${escapeHtml(item.slug)}">
                    <strong>${escapeHtml(item.term)}</strong>
                    <span>${escapeHtml(item.simpleDefinition)}</span>
                    <em>${icon("arrowRight")}</em>
                  </a>
                `).join("")}
              </div>
            ` : `<p class="muted-small">Related terms will be added as the dictionary grows.</p>`)}
            ${renderDictionaryDetailSection("related-lessons", 7, "Learn This in Context", lessons.length ? `
              <div class="related-lesson-grid">
                ${lessons.map((lesson) => `
                  <a href="${escapeHtml(lesson.href)}">
                    <span>${escapeHtml(lesson.course)}</span>
                    <strong>${escapeHtml(lesson.title)}</strong>
                    <em>Open lesson ${icon("arrowRight")}</em>
                  </a>
                `).join("")}
              </div>
            ` : `<p class="muted-small">This term will be linked to lessons as content is added.</p>`)}
          </div>
        </article>
        ${renderDictionaryTermToc()}
      </div>
    </main>
  `;
}

function renderAbbreviationsTable() {
  const q = state.dictionarySearch.trim().toLowerCase();
  const allRows = dictionaryAbbreviations().sort((a, b) => state.dictionaryAbbreviationSort === "meaning" ? a[1].localeCompare(b[1]) : a[0].localeCompare(b[0]));
  const rows = q ? allRows.filter(([abbr, meaning]) => abbr.toLowerCase().includes(q) || meaning.toLowerCase().includes(q)) : allRows;
  return `
    ${pageHeader({
      eyebrow: "Reference",
      title: "Nursing Abbreviations",
      body: `${allRows.length} common abbreviations used in notes, observations, ward reports and exams.`,
      actions: buttonLink("/dictionary", "Full Dictionary", "secondary", "fileText")
    })}
    <section class="section">
      <div class="container">
        <div class="abbr-toolbar">
          <label class="search-field course-search-label abbr-search-label">
            ${icon("search")}
            <input class="search-input" data-dictionary-search type="search" value="${escapeHtml(state.dictionarySearch)}" placeholder="Search abbreviations or meanings…" aria-label="Search abbreviations">
          </label>
          <div class="abbr-sort-row">
            <button type="button" class="abbr-sort-btn${state.dictionaryAbbreviationSort !== "meaning" ? " active" : ""}" data-abbreviation-sort="abbr">A–Z</button>
            <button type="button" class="abbr-sort-btn${state.dictionaryAbbreviationSort === "meaning" ? " active" : ""}" data-abbreviation-sort="meaning">By meaning</button>
          </div>
        </div>
        <p class="abbr-count-label">Showing <strong>${rows.length}</strong> of <strong>${allRows.length}</strong> abbreviations</p>
        ${rows.length ? `
          <table class="abbreviations-table">
            <thead><tr><th>Abbreviation</th><th>Meaning</th></tr></thead>
            <tbody>
              ${rows.map(([abbr, meaning]) => `<tr><td>${escapeHtml(abbr)}</td><td>${escapeHtml(meaning)}</td></tr>`).join("")}
            </tbody>
          </table>
        ` : `
          <div class="dict-empty-state">
            ${icon("search")}
            <strong>No abbreviations match "${escapeHtml(q)}"</strong>
            <button type="button" class="button secondary" data-dictionary-clear>Clear search</button>
          </div>
        `}
      </div>
    </section>
  `;
}

function renderDictionary(parts = currentRoute()) {
  if (parts[1] === "abbreviations") return renderAbbreviationsTable();
  if (parts[1] === "category" || parts[1] === "system" || !parts[1]) return renderDictionaryListing(parts);
  return renderDictionaryTermPage(parts[1]);
}

function renderCareers() {
  return `
    ${renderCareerHero()}
    ${renderCareerModeToggle()}
    ${state.careerMode === "hub" ? renderCareerHub() : renderJobsBoard()}
  `;
}

function downloadCareerChecklist(title) {
  const safeTitle = String(title || "career-checklist");
  const guide = licensingGuides().find(([guideTitle]) => guideTitle === safeTitle);
  const docs = guide ? guide[3] : ["Updated CV", "Registration certificate", "Academic transcript", "Good standing letter", "Referees"];
  const content = [
    `${safeTitle} - Nursing Uganda Checklist`,
    "",
    ...docs.map((doc) => `[ ] ${doc}`),
    "",
    "Print this checklist or save it as PDF from your browser."
  ].join("\n");
  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob([content], { type: "text/plain" }));
  link.download = `${slugify(safeTitle)}-checklist.txt`;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

function renderSchoolsDirectory() {
  const schools = filteredSchools();
  const filters = schoolFilters();
  const selected = selectedSchool();
  const showClear = hasActiveSchoolFilters();
  const view = state.schoolView === "map" ? "map" : "cards";
  const heroImage = imageCatalog.schools;
  const heroImageSrc = rootAssetPath(displayImageSrc(heroImage.src));
  const stats = schoolSummaryStats(schools);

  return `
    ${pageHeader({
      eyebrow: "Schools Directory",
      title: "Nursing & Midwifery Schools",
      body: "Find UNMC-recognized training institutions by district, programme type and registration status.",
      breadcrumb: `<nav class="page-breadcrumb" aria-label="Breadcrumb"><a href="/resources">Resources</a><span>/</span><strong>Schools Directory</strong></nav>`,
      actions: `${buttonLink("/resources", "Back to Resources", "secondary", "arrowLeft")}<a class="button ghost" href="https://unmc.ug/recognized-schools/" target="_blank" rel="noopener noreferrer">${buttonLabel("UNMC Source", "externalLink")}</a>`
    })}
    <section class="schools-filter-shell">
      <div class="container">
        <div class="schools-command-panel">
          <div class="schools-command-copy">
            <span class="eyebrow">Recognized schools finder</span>
            <h2>Compare nursing and midwifery schools faster</h2>
            <p>Filter by status, region, district, sector and programme level. Records are summarized from the UNMC recognized-schools listing, so students should still verify before applying.</p>
          </div>
          <div class="schools-command-grid">
            <label class="schools-search premium">
              ${icon("search")}
              <input data-school-search type="search" value="${escapeHtml(state.schoolSearch)}" placeholder="Search school, district, programme or sector..." aria-label="Search school, district, programme or sector">
            </label>
            ${schoolFilterSelect("Status", "status", filters.statuses, state.schoolStatus)}
            ${schoolFilterSelect("Region", "region", filters.regions, state.schoolRegion)}
            ${schoolFilterSelect("District", "district", filters.districts, state.schoolDistrict)}
            ${schoolFilterSelect("Sector", "sector", filters.sectors, state.schoolSector)}
            ${schoolFilterSelect("Programme", "programme", filters.programmes, state.schoolProgramme)}
            ${showClear ? `<button class="schools-clear premium" type="button" data-school-clear>${icon("x")}Clear filters</button>` : ""}
          </div>
          <div class="schools-stat-strip">
            ${stats.map(([label, value]) => `<span><strong>${value}</strong>${escapeHtml(label)}</span>`).join("")}
          </div>
        </div>
        <div class="schools-results-head">
          <div>
            <h2>${schools.length} Schools Listed <span>${schools.length}</span></h2>
            <p>Status notes are based on the UNMC recognized-schools listing. Always confirm directly with UNMC and the school before applying.</p>
          </div>
          <div class="schools-view-toggle" aria-label="Schools view toggle">
            <button class="${view === "cards" ? "active" : ""}" type="button" data-school-view="cards">${icon("layoutGrid")}Cards</button>
            <button class="${view === "map" ? "active" : ""}" type="button" data-school-view="map">${icon("map")}Map</button>
          </div>
        </div>
      </div>
    </section>
    <section class="schools-directory-section">
      <div class="container">
        <div class="schools-view-panel ${view === "map" ? "is-map" : "is-cards"}">
          ${schools.length ? (view === "map" ? renderSchoolsMapView(schools) : `<div class="school-directory-grid">${schools.map(renderSchoolCard).join("")}</div>`) : `
            <div class="schools-empty-state">
              <span>${icon("school")}</span>
              <h2>No schools match your filters</h2>
              <p>Try adjusting your search or clearing filters.</p>
              <button type="button" data-school-clear>Clear all filters</button>
            </div>
          `}
        </div>
      </div>
    </section>
    ${renderSchoolDrawer(selected)}
  `;
}

function medicalInstrumentCategories() {
  if (state.medicalInstrumentLibrary && Array.isArray(state.medicalInstrumentLibrary.categories)) {
    return state.medicalInstrumentLibrary.categories;
  }

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
  if (instrument.image) {
    return {
      src: instrument.image,
      alt: instrument.imageAlt || `${instrument.name} medical instrument reference image`
    };
  }
  const [src, alt] = medicalInstrumentImageMap()[instrument.slug] || [imageCatalog.instruments.src, imageCatalog.instruments.alt];
  return { src, alt };
}

function relatedMedicalInstruments(instrument) {
  const all = allMedicalInstruments();
  if (Array.isArray(instrument.related) && instrument.related.length) {
    return instrument.related
      .map((slug) => findMedicalInstrument(slug))
      .filter(Boolean)
      .slice(0, 6);
  }
  return all
    .filter((item) => item.slug !== instrument.slug && item.category === instrument.category)
    .slice(0, 6);
}

function instrumentSearchText(instrument) {
  return `${instrument.name} ${instrument.category} ${instrument.use} ${instrument.preparation} ${instrument.safety} ${(instrument.examPoints || []).join(" ")}`;
}

function filteredMedicalInstruments() {
  const query = state.instrumentSearch.trim();
  const category = state.instrumentCategory || "all";
  return allMedicalInstruments()
    .filter((instrument) => category === "all" || instrument.category === category)
    .filter((instrument) => !query || textMatchesSearchQuery(instrumentSearchText(instrument), query));
}

function renderInstrumentAtlasCard(instrument, compact = false) {
  const image = instrumentImageFor(instrument);
  return `
    <a class="instrument-atlas-card${compact ? " compact" : ""}" href="/resources/medical-instruments/${escapeHtml(instrument.slug)}">
      <figure>
        <img src="${escapeHtml(displayImageSrc(image.src))}" alt="${escapeHtml(image.alt)}" loading="lazy">
      </figure>
      <div>
        <small>${escapeHtml(instrument.category)}</small>
        <h3>${escapeHtml(instrument.name)}</h3>
        <p>${escapeHtml(truncateText(instrument.use, compact ? 90 : 118))}</p>
        <span>${icon("badgeCheck")} Safe handling notes</span>
      </div>
    </a>
  `;
}

function renderMedicalInstruments() {
  const categories = medicalInstrumentCategories();
  const instruments = allMedicalInstruments();
  const filtered = filteredMedicalInstruments();
  const activeCategory = categories.find((category) => category.title === state.instrumentCategory);
  const popular = instruments
    .filter((instrument) => /stethoscope|blood pressure|syringe|iv cannula|dressing tray|fetoscope|autoclave|catheter/i.test(instrument.name))
    .slice(0, 8);
  const hasFilters = state.instrumentSearch.trim() || state.instrumentCategory !== "all";

  return `
    ${pageHeader({
      eyebrow: "Clinical Skills Atlas",
      title: "Medical Instruments",
      body: `A practical guide to ${instruments.length} nursing and midwifery instruments — uses, images and safe handling points.`,
      actions: buttonLink("/resources", "Back to Resources", "secondary", "arrowLeft")
    })}
    <section class="instrument-atlas-section">
      <div class="container">
        <div class="instrument-command-panel">
          <div class="instrument-command-copy">
            <span class="eyebrow">Clinical skills atlas</span>
            <h2>Find the right instrument faster</h2>
            <p>Search by name, ward use, preparation step or safety risk. Use category dropdowns when you want a clean OSCE-style revision flow.</p>
          </div>
          <div class="instrument-command-controls">
            <label class="instrument-search-field">
              ${icon("search")}
              <input data-instrument-search type="search" value="${escapeHtml(state.instrumentSearch)}" placeholder="Search instruments, use or safety point" aria-label="Search medical instruments">
            </label>
            <label class="instrument-select-field">
              <span>Category</span>
              <select data-instrument-category aria-label="Filter medical instruments by category">
                <option value="all"${state.instrumentCategory === "all" ? " selected" : ""}>All categories</option>
                ${categories.map((category) => `<option value="${escapeHtml(category.title)}"${state.instrumentCategory === category.title ? " selected" : ""}>${escapeHtml(category.title)}</option>`).join("")}
              </select>
            </label>
            ${hasFilters ? `<button class="instrument-clear-button" type="button" data-instrument-clear>${icon("x")}Clear</button>` : ""}
          </div>
          <div class="instrument-stats-row">
            <span><strong>${instruments.length}</strong> instruments</span>
            <span><strong>${categories.length}</strong> categories</span>
            <span><strong>${filtered.length}</strong> visible now</span>
          </div>
        </div>

        <div class="instrument-feature-strip">
          <div>
            <h2>${activeCategory ? escapeHtml(activeCategory.title) : "High-use instruments"}</h2>
            <p>${activeCategory ? escapeHtml(activeCategory.body) : "Start with tools students meet repeatedly in skills lab, bedside assessment, wound care, theatre and midwifery practice."}</p>
          </div>
          <div class="instrument-feature-list">
            ${(activeCategory ? activeCategory.items : popular).slice(0, 4).map((instrument) => renderInstrumentAtlasCard(instrument, true)).join("")}
          </div>
        </div>

        <div class="instrument-workspace">
          <aside class="instrument-category-rail" aria-label="Instrument categories">
            <h2>Browse By Category</h2>
            ${categories.map((category, index) => {
              const isOpen = state.instrumentCategory === "all" ? index < 2 : state.instrumentCategory === category.title;
              return `
                <details class="instrument-category-dropdown"${isOpen ? " open" : ""}>
                  <summary>
                    <span>${iconFor(category.title)}</span>
                    <strong>${escapeHtml(category.title)}</strong>
                    <small>${category.items.length}</small>
                  </summary>
                  <p>${escapeHtml(category.body)}</p>
                  <div>
                    ${category.items.slice(0, 10).map((item) => `<a href="/resources/medical-instruments/${escapeHtml(item.slug)}">${escapeHtml(item.name)}</a>`).join("")}
                    ${category.items.length > 10 ? `<button type="button" data-instrument-category-jump="${escapeHtml(category.title)}">${icon("search")}Show all ${category.items.length}</button>` : ""}
                  </div>
                </details>
              `;
            }).join("")}
          </aside>

          <main class="instrument-results-panel">
            <div class="instrument-results-head">
              <div>
                <span class="eyebrow">Instrument library</span>
                <h2>${filtered.length} ${filtered.length === 1 ? "Instrument" : "Instruments"}</h2>
                <p>${state.instrumentSearch.trim() ? `Matches for "${escapeHtml(state.instrumentSearch.trim())}"` : "Open any instrument for use, preparation, safety and exam points."}</p>
              </div>
              <span class="resource-count-pill">${escapeHtml(state.instrumentCategory === "all" ? "All categories" : state.instrumentCategory)}</span>
            </div>
            ${filtered.length ? `
              <div class="instrument-atlas-grid">
                ${filtered.map((instrument) => renderInstrumentAtlasCard(instrument)).join("")}
              </div>
            ` : `
              <div class="instrument-empty-state">
                <span>${icon("stethoscope")}</span>
                <h3>No instruments match that filter</h3>
                <p>Try a shorter search term or clear the category filter.</p>
                <button type="button" data-instrument-clear>${icon("x")}Clear filters</button>
              </div>
            `}
          </main>
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

function renderInstrumentStudyCard(id, iconName, label, title, body, tone = "") {
  return `
    <section id="${escapeHtml(id)}" class="instrument-study-card ${escapeHtml(tone)}">
      <div class="instrument-study-icon">${icon(iconName)}</div>
      <div>
        <span>${escapeHtml(label)}</span>
        <h3>${escapeHtml(title)}</h3>
        <p>${escapeHtml(body)}</p>
      </div>
    </section>
  `;
}

function renderInstrumentExamCards(points) {
  return `
    <section id="instrument-exam" class="instrument-exam-panel">
      <div class="instrument-section-heading">
        <span>${icon("fileText")}</span>
        <div>
          <small>OSCE answer guide</small>
          <h3>Exam Points</h3>
        </div>
      </div>
      <ol>
        ${points.map((point, index) => `
          <li>
            <strong>${String(index + 1).padStart(2, "0")}</strong>
            <span>${escapeHtml(point)}</span>
          </li>
        `).join("")}
      </ol>
    </section>
  `;
}

function renderMedicalInstrumentDetail(instrument) {
  const instrumentImage = instrumentImageFor(instrument);
  const related = relatedMedicalInstruments(instrument);
  const examPoints = instrument.examPoints || [
    "State the name of the instrument clearly.",
    "Explain its main clinical use.",
    "Mention preparation before use.",
    "Give at least one safety or infection prevention point."
  ];
  const instrumentBookmark = {
    key: `instrument::${instrument.slug}`,
    type: "Instrument",
    title: instrument.name,
    context: instrument.category,
    href: `/resources/medical-instruments/${instrument.slug}`
  };

  return `
    ${hero({
      title: instrument.name,
      body: `${instrument.category}. Revise the use, preparation and safety points for clinical practice and OSCEs.`,
      image: instrumentImage,
      actions: `${buttonLink("/resources/medical-instruments", "Back to Instruments", "secondary", "arrowLeft")}${bookmarkButton(instrumentBookmark)}`
    })}
    <section class="section">
      <div class="container app-layout instrument-detail-shell">
        <aside class="side-panel instrument-note-rail">
          <span class="mini-label">Study Route</span>
          <h3>Instrument Notes</h3>
          <a href="/resources/medical-instruments">${icon("stethoscope")}<span>All instruments</span></a>
          <button type="button" data-scroll-target="instrument-use">${icon("activity")}<span>Use</span></button>
          <button type="button" data-scroll-target="instrument-preparation">${icon("clipboardList")}<span>Preparation</span></button>
          <button type="button" data-scroll-target="instrument-safety">${icon("badgeCheck")}<span>Safety</span></button>
          <button type="button" data-scroll-target="instrument-exam">${icon("fileText")}<span>Exam Points</span></button>
        </aside>
        <article class="topic-detail content-panel instrument-detail-panel">
          <div class="instrument-detail-head">
            <div>
              <span class="mini-label">Clinical instrument file</span>
              <h2>${escapeHtml(instrument.name)}</h2>
              <p>Use this as a quick revision sheet for identification, bedside preparation, safety checks and OSCE answers.</p>
            </div>
            <div class="instrument-detail-badges" aria-label="Instrument quick tags">
              <span>${escapeHtml(instrument.category)}</span>
              <span>OSCE Ready</span>
              <span>Safety First</span>
            </div>
          </div>
          <div class="instrument-overview-grid">
            <figure class="instrument-image-panel premium">
              <img src="${escapeHtml(displayImageSrc(instrumentImage.src))}" alt="${escapeHtml(instrumentImage.alt)}" loading="lazy">
              <figcaption>
                <strong>${escapeHtml(instrument.name)}</strong>
                <span>Clinical image reference</span>
              </figcaption>
            </figure>
            <div class="instrument-at-a-glance">
              <span class="mini-label">At A Glance</span>
              <h3>What to remember first</h3>
              <div>
                <span><strong>Category</strong>${escapeHtml(instrument.category)}</span>
                <span><strong>Core skill</strong>Identify, prepare, use safely</span>
                <span><strong>Exam focus</strong>${examPoints.length} practical points</span>
              </div>
            </div>
          </div>
          <div class="instrument-study-grid">
            ${renderInstrumentStudyCard("instrument-use", "activity", "Clinical role", "Use", instrument.use, "use-card")}
            ${renderInstrumentStudyCard("instrument-preparation", "clipboardList", "Before use", "Preparation", instrument.preparation, "prep-card")}
            ${renderInstrumentStudyCard("instrument-safety", "badgeCheck", "Patient safety", "Safety", instrument.safety, "safety-card")}
          </div>
          ${renderInstrumentExamCards(examPoints)}
          ${related.length ? `
            <section class="related-instruments-panel">
              <div class="section-head slim-head">
                <div>
                  <span class="mini-label">Related Instruments</span>
                  <h3>Study These Next</h3>
                </div>
              </div>
              <div class="related-instrument-grid">
                ${related.map((item) => {
                  const image = instrumentImageFor(item);
                  return `
                    <a class="instrument-mini-card compact" href="/resources/medical-instruments/${escapeHtml(item.slug)}">
                      <img src="${escapeHtml(displayImageSrc(image.src))}" alt="${escapeHtml(image.alt)}" loading="lazy">
                      <span>
                        <strong>${escapeHtml(item.name)}</strong>
                        <small>${escapeHtml(item.category)}</small>
                      </span>
                    </a>
                  `;
                }).join("")}
              </div>
            </section>
          ` : ""}
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

function leafletStatusColor(status) {
  const value = schoolStatusClass(status);
  if (value === "full") return "#2E7D52";
  if (value === "provisional") return "#D97706";
  return "#C0392B";
}

function setupSchoolsMap() {
  const mapElement = app.querySelector("#schools-leaflet-map");
  if (!mapElement || state.schoolView !== "map") return;
  const schools = filteredSchools().filter((school) => school.coordinates);

  if (!window.L) {
    mapElement.classList.add("leaflet-unavailable");
    mapElement.innerHTML = `<div><strong>Map tiles are unavailable.</strong><span>Use the school list and pins while Leaflet loads.</span></div>`;
    return;
  }

  const map = L.map(mapElement, {
    scrollWheelZoom: false,
    zoomControl: true
  }).setView([1.3733, 32.2903], 7);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map);

  const markers = {};
  const bounds = [];
  schools.forEach((school) => {
    const color = leafletStatusColor(school.status);
    const marker = L.marker(school.coordinates, {
      title: school.name,
      icon: L.divIcon({
        className: "school-leaflet-pin",
        html: `<span style="background:${color}"></span>`,
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -28]
      })
    }).addTo(map);
    marker.bindPopup(renderSchoolMapPopup(school), { className: "school-leaflet-popup", maxWidth: 280 });
    marker.on("click", () => {
      state.activeSchool = school.id;
      app.querySelectorAll("[data-school-map-focus]").forEach((row) => row.classList.toggle("active", row.dataset.schoolMapFocus === school.id));
    });
    markers[school.id] = marker;
    bounds.push(school.coordinates);
  });

  if (bounds.length > 1) {
    map.fitBounds(bounds, { padding: [34, 34], maxZoom: 8 });
  }

  const focusSchool = (id) => {
    const school = schools.find((item) => item.id === id);
    const marker = markers[id];
    if (!school || !marker) return;
    state.activeSchool = id;
    map.flyTo(school.coordinates, 9, { duration: 0.6 });
    marker.openPopup();
    app.querySelectorAll("[data-school-map-focus]").forEach((row) => row.classList.toggle("active", row.dataset.schoolMapFocus === id));
  };

  app.querySelectorAll("[data-school-map-focus]").forEach((button) => {
    button.addEventListener("click", () => focusSchool(button.dataset.schoolMapFocus));
  });

  map.on("popupopen", (event) => {
    const button = event.popup.getElement().querySelector("[data-school-open]");
    if (button) {
      button.addEventListener("click", () => {
        state.selectedSchool = button.dataset.schoolOpen;
        render();
      });
    }
  });

  if (state.activeSchool && markers[state.activeSchool]) {
    setTimeout(() => focusSchool(state.activeSchool), 120);
  }
  setTimeout(() => map.invalidateSize(), 80);
}

function setupSchoolMiniMap() {
  const mini = app.querySelector("[data-school-mini-map]");
  if (!mini || !window.L) return;
  const school = selectedSchool();
  if (!school || !school.coordinates) return;
  const map = L.map(mini, {
    attributionControl: false,
    zoomControl: false,
    dragging: false,
    scrollWheelZoom: false,
    doubleClickZoom: false
  }).setView(school.coordinates, 12);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19
  }).addTo(map);
  L.circleMarker(school.coordinates, {
    radius: 9,
    color: leafletStatusColor(school.status),
    fillColor: leafletStatusColor(school.status),
    fillOpacity: 0.9
  }).addTo(map);
  setTimeout(() => map.invalidateSize(), 80);
}

function notFound() {
  return `
    <section class="section not-found-section">
      <div class="container">
        <div class="not-found-panel">
          <div class="not-found-icon">${icon("alertCircle")}</div>
          <span class="eyebrow">404 — Not Found</span>
          <h1>This page doesn't exist yet</h1>
          <p>The link may be incorrect, or this content is still being built. Head back to study notes or search for what you need.</p>
          <div class="not-found-actions">
            ${buttonLink("/notes", "Back to Notes", "primary", "bookOpen")}
            ${buttonLink("/search", "Search", "secondary", "search")}
          </div>
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
  let structuredData = null;

  if (parts[0] === "progress") {
    content = renderProgress();
    meta = { title: "My Progress", description: "Track your completed lessons, quiz mastery, study streak and saved bookmarks on Nursing Uganda." };
  }
  else if (parts[0] === "flashcards") {
    content = renderFlashcards();
    meta = { title: "Flashcards", description: "Study key nursing and medical terms with flip-card mode. Track your mastery as you go." };
  }
  else if (legalPages[parts[0]]) {
    content = renderLegalPage(parts[0]);
    meta = {
      title: legalPages[parts[0]].title,
      description: `${legalPages[parts[0]].title} for Nursing Uganda, including revision disclaimers, external links and monetization disclosures.`
    };
  }
  else if (parts[0] === "notes") {
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
  else if (parts[0] === "careers") {
    content = renderCareers();
    meta = { title: "Careers & Jobs", description: "Nursing and midwifery jobs, career pathways, licensing guides and international opportunities for Uganda professionals." };
  }
  else if (parts[0] === "dictionary") {
    content = renderDictionary(parts);
    if (parts[1] === "abbreviations") {
      meta = { title: "Nursing Abbreviations", description: "Browse common nursing and medical abbreviations used in ward reports, observations, exams and clinical notes." };
    } else if (parts[1] && parts[1] !== "category" && parts[1] !== "system") {
      const term = dictionaryTermBySlug(parts[1]);
      meta = term
        ? { title: `${term.term} - Nursing Dictionary`, description: `${term.simpleDefinition} Learn more about ${term.term} in the Nursing Uganda dictionary.` }
        : { title: "Dictionary", description: "Clear nursing and medical definitions for Nursing Uganda students." };
      if (term) {
        structuredData = {
          "@context": "https://schema.org",
          "@type": "DefinedTerm",
          name: term.term,
          description: term.definition,
          termCode: term.slug,
          inDefinedTermSet: {
            "@type": "DefinedTermSet",
            name: "Nursing Uganda Dictionary",
            url: "https://nursinguganda.com/dictionary"
          }
        };
      }
    } else {
      meta = { title: "Dictionary", description: "Search student-friendly nursing and medical definitions by category, body system and difficulty." };
    }
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
        if (topic) {
          const canonicalHref = topicHref(programme, unit, topic.groupIndex, topic.topicIndex);
          if (window.location.pathname !== canonicalHref) history.replaceState(null, "", canonicalHref);
        }
        content = topic ? renderTopic(programme, unit, topic) : notFound();
        if (topic) {
          const lesson = lessonForTopic(programme, unit, topic);
          meta = {
            title: lmsLessonTitle(programme, unit, topic),
            description: lessonExcerptFor(programme, unit, topic, lesson, 155)
          };
        }
      } else if (parts[3]) {
        const topic = findTopicBySlug(programme, unit, parts[3]);
        content = topic ? renderTopic(programme, unit, topic) : notFound();
        if (topic) {
          const lesson = lessonForTopic(programme, unit, topic);
          meta = {
            title: lmsLessonTitle(programme, unit, topic),
            description: lessonExcerptFor(programme, unit, topic, lesson, 155)
          };
        }
      } else {
        content = renderUnit(programme, unit);
        meta = { title: lmsCourseTitle(programme, unit), description: `${lmsCourseTitle(programme, unit)} modules, lessons and progress for ${programme.label}.` };
      }
    }
  } else content = renderNotes();

  setDocumentMeta(meta.title, meta.description);
  setStructuredData("nursing-uganda-defined-term", structuredData);
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

  app.querySelectorAll("[data-programme-level]").forEach((button) => {
    button.addEventListener("click", () => {
      state.programmeFilter = button.dataset.programmeLevel || "All";
      render();
    });
  });

  const globalSearch = app.querySelector("[data-global-search]");
  if (globalSearch) {
    globalSearch.addEventListener("input", (event) => {
      state.globalSearch = event.target.value;
      if (currentRoute()[0] !== "search") {
        setRoute("/search");
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

  const searchCategory = app.querySelector("[data-search-category]");
  if (searchCategory) {
    searchCategory.addEventListener("change", (event) => {
      state.globalSearchCategory = event.target.value;
      if (currentRoute()[0] === "search") render();
    });
  }

  const searchType = app.querySelector("[data-search-type]");
  if (searchType) {
    searchType.addEventListener("change", (event) => {
      state.globalSearchType = event.target.value;
      if (currentRoute()[0] === "search") render();
    });
  }

  app.querySelectorAll("[data-search-clear-filters]").forEach((button) => {
    button.addEventListener("click", () => {
      state.globalSearchCategory = "all";
      state.globalSearchType = "all";
      render();
      const nextSearch = app.querySelector("[data-global-search]");
      if (nextSearch) {
        nextSearch.focus();
        nextSearch.setSelectionRange(nextSearch.value.length, nextSearch.value.length);
      }
    });
  });

  app.querySelectorAll("[data-global-search-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      setRoute("/search");
    });
  });

  app.querySelectorAll("[data-search-seed]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      state.globalSearch = link.dataset.searchSeed || "";
      state.globalSearchCategory = "all";
      state.globalSearchType = "all";
      setRoute("/search");
      render();
    });
  });

  app.querySelectorAll("[data-dictionary-search]").forEach((dictionarySearch) => {
    dictionarySearch.addEventListener("input", (event) => {
      state.dictionarySearch = event.target.value;
      render();
      const nextSearch = app.querySelector(`[data-dictionary-search][aria-label="${escapeHtml(dictionarySearch.getAttribute("aria-label") || "Search dictionary terms")}"]`) || app.querySelector("[data-dictionary-search]");
      if (nextSearch) {
        nextSearch.focus();
        nextSearch.setSelectionRange(nextSearch.value.length, nextSearch.value.length);
      }
    });
  });

  app.querySelectorAll("[data-dictionary-search-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const firstResult = app.querySelector(".dictionary-search-result");
      if (firstResult) firstResult.click();
    });
  });

  app.querySelectorAll("[data-dictionary-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      const key = button.dataset.dictionaryFilter;
      const value = button.dataset.dictionaryFilterValue || "All";
      if (key === "category") state.dictionaryCategory = value;
      if (key === "system") state.dictionarySystem = value;
      if (key === "difficulty") state.dictionaryDifficulty = value;
      render();
    });
  });

  app.querySelectorAll("[data-dictionary-select]").forEach((select) => {
    select.addEventListener("change", () => {
      const key = select.dataset.dictionarySelect;
      if (key === "category") state.dictionaryCategory = select.value;
      if (key === "system") state.dictionarySystem = select.value;
      if (key === "difficulty") state.dictionaryDifficulty = select.value;
      render();
    });
  });

  app.querySelectorAll("[data-dictionary-clear]").forEach((button) => {
    button.addEventListener("click", () => {
      state.dictionarySearch = "";
      state.dictionaryCategory = "All";
      state.dictionarySystem = "All Systems";
      state.dictionaryDifficulty = "All";
      render();
    });
  });

  app.querySelectorAll("[data-dictionary-letter]").forEach((button) => {
    button.addEventListener("click", () => {
      const target = app.querySelector(`#dict-letter-${button.dataset.dictionaryLetter}`);
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  app.querySelectorAll("[data-abbreviation-sort]").forEach((button) => {
    button.addEventListener("click", () => {
      state.dictionaryAbbreviationSort = button.dataset.abbreviationSort === "meaning" ? "meaning" : "abbr";
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
      const completing = !button.classList.contains("active");
      setTopicComplete(button.dataset.completeTopic, completing);
      showToast(completing ? "Lesson marked complete!" : "Marked as incomplete", completing ? "success" : "info");
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
      const saving = !button.classList.contains("active");
      setBookmark({
        key: button.dataset.bookmarkKey,
        title: button.dataset.bookmarkTitle,
        type: button.dataset.bookmarkType,
        context: button.dataset.bookmarkContext,
        href: button.dataset.bookmarkHref
      }, saving);
      showToast(saving ? "Saved to your bookmarks" : "Removed from bookmarks", saving ? "success" : "info");
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

  app.querySelectorAll("[data-school-select]").forEach((select) => {
    select.addEventListener("change", (event) => {
      const type = select.dataset.schoolSelect;
      const value = event.target.value || "all";
      if (type === "status") state.schoolStatus = value;
      if (type === "region") {
        state.schoolRegion = value;
        state.schoolDistrict = "all";
      }
      if (type === "district") state.schoolDistrict = value;
      if (type === "sector") state.schoolSector = value;
      if (type === "programme") state.schoolProgramme = value;
      render();
    });
  });

  app.querySelectorAll("[data-school-filter-type]").forEach((button) => {
    button.addEventListener("click", () => {
      const type = button.dataset.schoolFilterType;
      const value = button.dataset.schoolFilterValue || "all";
      if (type === "status") state.schoolStatus = value;
      if (type === "district") state.schoolDistrict = value;
      if (type === "sector") state.schoolSector = value;
      if (type === "programme") state.schoolProgramme = value;
      render();
    });
  });

  app.querySelectorAll("[data-school-view]").forEach((button) => {
    button.addEventListener("click", () => {
      state.schoolView = button.dataset.schoolView === "map" ? "map" : "cards";
      localStorage.setItem("nursinguganda.schoolView", state.schoolView);
      render();
    });
  });

  app.querySelectorAll("[data-school-open]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedSchool = button.dataset.schoolOpen || "";
      render();
    });
  });

  app.querySelectorAll("[data-school-close]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedSchool = "";
      render();
    });
  });

  app.querySelectorAll("[data-school-overlay]").forEach((overlay) => {
    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) {
        state.selectedSchool = "";
        render();
      }
    });
  });

  app.querySelectorAll("[data-school-clear]").forEach((button) => {
    button.addEventListener("click", () => {
      state.schoolSearch = "";
      state.schoolStatus = "all";
      state.schoolRegion = "all";
      state.schoolDistrict = "all";
      state.schoolSector = "all";
      state.schoolProgramme = "all";
      render();
    });
  });

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

  const resourceSearch = app.querySelector("[data-resource-search]");
  if (resourceSearch) {
    resourceSearch.addEventListener("input", (event) => {
      state.resourceSearch = event.target.value;
      render();
      const nextSearch = app.querySelector("[data-resource-search]");
      if (nextSearch) {
        nextSearch.focus();
        nextSearch.setSelectionRange(nextSearch.value.length, nextSearch.value.length);
      }
    });
  }

  app.querySelectorAll("[data-resource-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      state.resourceFilter = button.dataset.resourceFilter || "All";
      render();
    });
  });

  const instrumentSearch = app.querySelector("[data-instrument-search]");
  if (instrumentSearch) {
    instrumentSearch.addEventListener("input", (event) => {
      state.instrumentSearch = event.target.value;
      render();
      const nextSearch = app.querySelector("[data-instrument-search]");
      if (nextSearch) {
        nextSearch.focus();
        nextSearch.setSelectionRange(nextSearch.value.length, nextSearch.value.length);
      }
    });
  }

  const instrumentCategory = app.querySelector("[data-instrument-category]");
  if (instrumentCategory) {
    instrumentCategory.addEventListener("change", (event) => {
      state.instrumentCategory = event.target.value || "all";
      render();
    });
  }

  app.querySelectorAll("[data-instrument-category-jump]").forEach((button) => {
    button.addEventListener("click", () => {
      state.instrumentCategory = button.dataset.instrumentCategoryJump || "all";
      render();
    });
  });

  app.querySelectorAll("[data-instrument-clear]").forEach((button) => {
    button.addEventListener("click", () => {
      state.instrumentSearch = "";
      state.instrumentCategory = "all";
      render();
    });
  });

  app.querySelectorAll("[data-career-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      state.careerMode = button.dataset.careerMode === "hub" ? "hub" : "jobs";
      if (currentRoute()[0] !== "careers") { setRoute("/careers"); return; }
      render();
      requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "smooth" }));
    });
  });

  const careerSearch = app.querySelector("[data-career-search]");
  if (careerSearch) {
    careerSearch.addEventListener("input", (event) => {
      state.careerSearch = event.target.value;
      render();
      const nextSearch = app.querySelector("[data-career-search]");
      if (nextSearch) {
        nextSearch.focus();
        nextSearch.setSelectionRange(nextSearch.value.length, nextSearch.value.length);
      }
    });
  }

  const careerSort = app.querySelector("[data-career-sort]");
  if (careerSort) {
    careerSort.addEventListener("change", (event) => {
      state.careerSort = event.target.value;
      render();
    });
  }

  app.querySelectorAll("[data-career-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      const key = button.dataset.careerFilter;
      const value = button.dataset.careerFilterValue || "All";
      if (key === "type") state.careerType = value;
      if (key === "level") state.careerLevel = value;
      if (key === "region") state.careerRegion = value;
      if (key === "speciality") state.careerSpeciality = value;
      if (key === "deadline") state.careerDeadline = value;
      render();
    });
  });

  app.querySelectorAll("[data-career-clear]").forEach((button) => {
    button.addEventListener("click", () => {
      clearCareerFilters();
      render();
    });
  });

  app.querySelectorAll("[data-career-job-open]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedCareerJob = button.dataset.careerJobOpen || "";
      render();
    });
  });

  app.querySelectorAll("[data-career-job-save]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      setCareerJobSaved(button.dataset.careerJobSave, !button.classList.contains("active"));
      render();
    });
  });

  app.querySelectorAll("[data-career-drawer-close]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedCareerJob = "";
      render();
    });
  });

  app.querySelectorAll("[data-career-drawer-overlay]").forEach((overlay) => {
    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) {
        state.selectedCareerJob = "";
        render();
      }
    });
  });

  app.querySelectorAll("[data-career-alert-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      form.classList.add("subscribed");
      const button = form.querySelector("button");
      if (button) button.innerHTML = `${icon("checkCircle")}<span>Subscribed</span>`;
    });
  });

  app.querySelectorAll("[data-career-download]").forEach((button) => {
    button.addEventListener("click", () => downloadCareerChecklist(button.dataset.careerDownload));
  });

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

  setupSchoolsMap();
  setupSchoolMiniMap();
}

/* ── Quiz Mastery ─────────────────────────────────────────────────── */
function masteredTopics() {
  try {
    return JSON.parse(localStorage.getItem("nursinguganda.masteredTopics") || "{}");
  } catch { return {}; }
}

function setTopicMastery(key) {
  const mastered = masteredTopics();
  if (mastered[key]) return;
  mastered[key] = new Date().toISOString();
  localStorage.setItem("nursinguganda.masteredTopics", JSON.stringify(mastered));
}

function isTopicMastered(key) {
  return !!masteredTopics()[key];
}

/* ── Toast Notifications ──────────────────────────────────────────── */
function showToast(message, type = "success") {
  let container = document.getElementById("nu-toasts");
  if (!container) {
    container = document.createElement("div");
    container.id = "nu-toasts";
    document.body.appendChild(container);
  }
  const toast = document.createElement("div");
  toast.className = `nu-toast nu-toast-${type}`;
  const iconName = type === "success" ? "checkCircle" : type === "error" ? "x" : "bookOpen";
  toast.innerHTML = `<span class="nu-toast-icon">${icon(iconName)}</span><span>${escapeHtml(message)}</span>`;
  container.appendChild(toast);
  requestAnimationFrame(() => requestAnimationFrame(() => toast.classList.add("nu-toast-show")));
  setTimeout(() => {
    toast.classList.remove("nu-toast-show");
    toast.addEventListener("transitionend", () => toast.remove(), { once: true });
  }, 3200);
}

/* ── Study Streak ─────────────────────────────────────────────────── */
function getStreak() {
  try {
    const data = JSON.parse(localStorage.getItem("nursinguganda.streak") || "null");
    return (data && typeof data === "object") ? data : { count: 0, lastDate: "" };
  } catch { return { count: 0, lastDate: "" }; }
}

function updateStreak() {
  const today = new Date().toISOString().slice(0, 10);
  const streak = getStreak();
  if (streak.lastDate === today) return streak;
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const count = streak.lastDate === yesterday ? streak.count + 1 : 1;
  const updated = { count, lastDate: today };
  localStorage.setItem("nursinguganda.streak", JSON.stringify(updated));
  return updated;
}

function streakChip() {
  const streak = updateStreak();
  if (streak.count < 1) return "";
  const label = streak.count === 1 ? "Day 1 streak — keep going!" : `${streak.count} day streak`;
  return `<div class="streak-chip">${icon("flame")}<span>${escapeHtml(label)}</span></div>`;
}

/* ── Reading Progress Bar ─────────────────────────────────────────── */
function setupReadingProgress() {
  const bar = document.getElementById("reading-progress-bar");
  if (!bar) return;
  const parts = currentRoute();
  const inLesson = parts[0] === "courses" && parts.length >= 4;
  if (!inLesson) {
    bar.style.transform = "scaleX(0)";
    return;
  }
  function update() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;
    bar.style.transform = `scaleX(${progress})`;
  }
  window.addEventListener("scroll", update, { passive: true });
  update();
}

/* ── Swipe Navigation ─────────────────────────────────────────────── */
function setupSwipeNavigation() {
  const page = app.querySelector(".premium-lesson-page");
  if (!page) return;
  let startX = 0;
  let startY = 0;
  page.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }, { passive: true });
  page.addEventListener("touchend", (e) => {
    const dx = e.changedTouches[0].clientX - startX;
    const dy = Math.abs(e.changedTouches[0].clientY - startY);
    if (Math.abs(dx) < 64 || dy > Math.abs(dx) * 0.85) return;
    const nav = app.querySelector(".lesson-bottom-actions");
    if (!nav) return;
    if (dx < 0) {
      const next = nav.querySelector("a.primary");
      if (next) next.click();
    } else {
      const prev = nav.querySelector("a.secondary");
      if (prev) prev.click();
    }
  }, { passive: true });
}

/* ── Study Notifications ──────────────────────────────────────────── */
function setupStudyNotifications() {
  if (!("Notification" in window)) return;
  const streak = getStreak();
  if (streak.count < 2) return;
  if (localStorage.getItem("nursinguganda.notifAsked")) {
    if (Notification.permission === "granted") {
      const today = new Date().toISOString().slice(0, 10);
      if (streak.lastDate !== today) {
        new Notification("Keep your streak alive!", {
          body: `You're on a ${streak.count}-day streak. Study one lesson today to keep it going.`,
          icon: "/assets/images/nursing-uganda-favicon.svg"
        });
      }
    }
    return;
  }
  setTimeout(showNotifPrompt, 10000);
}

function showNotifPrompt() {
  if (document.getElementById("nu-notif-prompt")) return;
  if (Notification.permission !== "default") return;
  const streak = getStreak();
  const el = document.createElement("div");
  el.id = "nu-notif-prompt";
  el.setAttribute("role", "dialog");
  el.setAttribute("aria-label", "Enable study reminders");
  el.innerHTML = `
    <span class="nu-notif-icon">${icon("bell")}</span>
    <div class="nu-notif-body">
      <strong>Daily study reminders?</strong>
      <p>We'll remind you to keep your ${streak.count}-day streak alive.</p>
    </div>
    <div class="nu-notif-actions">
      <button type="button" id="nu-notif-allow">Allow</button>
      <button type="button" id="nu-notif-dismiss" aria-label="Dismiss">${icon("x")}</button>
    </div>
  `;
  document.body.appendChild(el);
  requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add("nu-notif-show")));
  el.querySelector("#nu-notif-allow").addEventListener("click", async () => {
    localStorage.setItem("nursinguganda.notifAsked", "1");
    el.classList.remove("nu-notif-show");
    el.addEventListener("transitionend", () => el.remove(), { once: true });
    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        new Notification("Nursing Uganda", {
          body: `Reminders on! You're on a ${getStreak().count}-day streak — keep it going!`,
          icon: "/assets/images/nursing-uganda-favicon.svg"
        });
      }
    } catch (_) { /* unsupported */ }
  });
  el.querySelector("#nu-notif-dismiss").addEventListener("click", () => {
    localStorage.setItem("nursinguganda.notifAsked", "1");
    el.classList.remove("nu-notif-show");
    el.addEventListener("transitionend", () => el.remove(), { once: true });
  });
}

/* ── Offline Banner ───────────────────────────────────────────────── */
function setupOfflineBanner() {
  function update() {
    let banner = document.getElementById("nu-offline-banner");
    if (!navigator.onLine) {
      if (!banner) {
        banner = document.createElement("div");
        banner.id = "nu-offline-banner";
        banner.innerHTML = `${icon("wifi")}<span>You\'re offline — showing cached content</span>`;
        document.body.appendChild(banner);
        requestAnimationFrame(() => requestAnimationFrame(() => banner.classList.add("nu-offline-show")));
      }
    } else if (banner) {
      banner.classList.remove("nu-offline-show");
      banner.addEventListener("transitionend", () => banner.remove(), { once: true });
    }
  }
  window.addEventListener("online", update);
  window.addEventListener("offline", update);
  update();
}

/* ── PWA Install Prompt ───────────────────────────────────────────── */
let _deferredInstallPrompt = null;

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  _deferredInstallPrompt = e;
  if (!localStorage.getItem("nursinguganda.pwaDismissed")) {
    setTimeout(showPwaPrompt, 5000);
  }
});

function showPwaPrompt() {
  if (document.getElementById("nu-pwa-prompt")) return;
  if (!_deferredInstallPrompt) return;
  const el = document.createElement("div");
  el.id = "nu-pwa-prompt";
  el.setAttribute("role", "dialog");
  el.setAttribute("aria-label", "Install Nursing Uganda app");
  el.innerHTML = `
    <span class="brand-mark" aria-hidden="true">NU</span>
    <div class="nu-pwa-body">
      <strong>Install Nursing Uganda</strong>
      <p>Add to your home screen for quick offline access.</p>
    </div>
    <div class="nu-pwa-actions">
      <button type="button" id="nu-pwa-install">Install</button>
      <button type="button" id="nu-pwa-dismiss" aria-label="Dismiss install prompt">${icon("x")}</button>
    </div>
  `;
  document.body.appendChild(el);
  requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add("nu-pwa-show")));
  el.querySelector("#nu-pwa-install").addEventListener("click", async () => {
    if (_deferredInstallPrompt) {
      await _deferredInstallPrompt.prompt();
      _deferredInstallPrompt = null;
    }
    el.remove();
  });
  el.querySelector("#nu-pwa-dismiss").addEventListener("click", () => {
    el.classList.remove("nu-pwa-show");
    el.addEventListener("transitionend", () => el.remove(), { once: true });
    localStorage.setItem("nursinguganda.pwaDismissed", "1");
  });
}

/* ── Flashcards ───────────────────────────────────────────────────── */
function flashcardMastery() {
  try { return new Set(JSON.parse(localStorage.getItem("nursinguganda.flashcardMastery") || "[]")); }
  catch { return new Set(); }
}

function toggleFlashcardMastery(id) {
  const m = flashcardMastery();
  m.has(id) ? m.delete(id) : m.add(id);
  localStorage.setItem("nursinguganda.flashcardMastery", JSON.stringify([...m]));
}

function flashcardDeck() {
  const terms = dictionaryTerms();
  const cat = state.flashcardCategory || "All";
  return cat === "All" ? terms : terms.filter((t) => t.category === cat);
}

function renderFlashcards() {
  const deck = flashcardDeck();
  const mastery = flashcardMastery();
  const idx = Math.min(state.flashcardIndex || 0, Math.max(0, deck.length - 1));
  const card = deck[idx];
  const categories = ["All", ...new Set(dictionaryTerms().map((t) => t.category))];
  const masteredCount = deck.filter((t) => mastery.has(t.id)).length;
  const isMastered = card && mastery.has(card.id);
  const progress = deck.length ? Math.round((masteredCount / deck.length) * 100) : 0;

  return `
    <section class="fc-hero">
      <div class="container">
        <nav class="fc-breadcrumb"><a href="/dictionary">Dictionary</a><span>${icon("arrowRight")}</span><strong>Flashcards</strong></nav>
        <div class="fc-hero-head">
          <div>
            <h1>${icon("sparkles")} Flashcard Study</h1>
            <p>Tap a card to flip it. Mark terms mastered as you go.</p>
          </div>
          <div class="fc-summary">
            <span>${icon("checkCircle")}<strong>${masteredCount}</strong> mastered</span>
            <span>${icon("bookOpen")}<strong>${deck.length}</strong> in deck</span>
            <span>${icon("chartBar")}<strong>${progress}%</strong> complete</span>
          </div>
        </div>
        <div class="fc-category-rail">
          ${categories.map((cat) => `<button type="button" class="fc-cat-btn${state.flashcardCategory === cat ? " active" : ""}" data-fc-cat="${escapeHtml(cat)}">${escapeHtml(cat)}</button>`).join("")}
        </div>
      </div>
    </section>
    <div class="fc-arena">
      <div class="container">
        ${card ? `
          <div class="fc-progress-bar"><div class="fc-progress-fill" style="width:${progress}%"></div></div>
          <p class="fc-counter">${idx + 1} of ${deck.length}</p>
          <div class="fc-wrapper">
            <div class="fc-card${state.flashcardFlipped ? " flipped" : ""}${isMastered ? " mastered" : ""}" data-fc-flip role="button" tabindex="0" aria-label="Flip card">
              <div class="fc-front">
                <span class="fc-category-tag">${escapeHtml(card.category)}</span>
                <h2>${escapeHtml(card.term)}</h2>
                ${card.pronunciation ? `<p class="fc-pronunciation">${escapeHtml(card.pronunciation)}</p>` : ""}
                <p class="fc-hint">${icon("rotateCcw")} Tap to reveal definition</p>
              </div>
              <div class="fc-back">
                <span class="fc-category-tag">${escapeHtml(card.category)}</span>
                <h2>${escapeHtml(card.term)}</h2>
                <p class="fc-definition">${escapeHtml(card.simpleDefinition)}</p>
                <p class="fc-clinical">${icon("stethoscope")} ${escapeHtml(truncateText(card.clinicalContext, 140))}</p>
              </div>
            </div>
          </div>
          <div class="fc-controls">
            <button type="button" class="fc-btn secondary" data-fc-prev ${idx === 0 ? "disabled" : ""}>${icon("arrowLeft")} Prev</button>
            <button type="button" class="fc-btn master${isMastered ? " active" : ""}" data-fc-master data-fc-id="${escapeHtml(card.id)}">${icon(isMastered ? "checkCircle" : "star")} ${isMastered ? "Mastered" : "Mark Mastered"}</button>
            <button type="button" class="fc-btn secondary" data-fc-next ${idx >= deck.length - 1 ? "disabled" : ""}>Next ${icon("arrowRight")}</button>
          </div>
          ${state.flashcardFlipped && card.relatedTerms?.length ? `
            <div class="fc-related">
              <span>Related terms:</span>
              ${card.relatedTerms.slice(0, 4).map((slug) => `<a href="/dictionary/${escapeHtml(slug)}">${escapeHtml(slug.replace(/-/g, " "))}</a>`).join("")}
            </div>
          ` : ""}
        ` : `
          <div class="fc-empty">
            <span>${icon("sparkles")}</span>
            <p>No cards in this category yet.</p>
          </div>
        `}
      </div>
    </div>
  `;
}

function setupFlashcards() {
  const flipBtn = app.querySelector("[data-fc-flip]");
  if (!flipBtn) return;

  flipBtn.addEventListener("click", () => {
    state.flashcardFlipped = !state.flashcardFlipped;
    flipBtn.classList.toggle("flipped", state.flashcardFlipped);
  });

  flipBtn.addEventListener("keydown", (e) => {
    if (e.key === " " || e.key === "Enter") { e.preventDefault(); flipBtn.click(); }
  });

  app.querySelector("[data-fc-prev]")?.addEventListener("click", () => {
    state.flashcardIndex = Math.max(0, (state.flashcardIndex || 0) - 1);
    state.flashcardFlipped = false;
    render();
  });

  app.querySelector("[data-fc-next]")?.addEventListener("click", () => {
    const deck = flashcardDeck();
    state.flashcardIndex = Math.min(deck.length - 1, (state.flashcardIndex || 0) + 1);
    state.flashcardFlipped = false;
    render();
  });

  app.querySelector("[data-fc-master]")?.addEventListener("click", (e) => {
    const id = e.currentTarget.dataset.fcId;
    toggleFlashcardMastery(id);
    render();
  });

  app.querySelectorAll("[data-fc-cat]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.flashcardCategory = btn.dataset.fcCat;
      state.flashcardIndex = 0;
      state.flashcardFlipped = false;
      render();
    });
  });
}

/* ── Lesson Notes ─────────────────────────────────────────────────── */
function renderLessonNotesPanel(topicKey) {
  const saved = localStorage.getItem(`nursinguganda.notes.${topicKey}`) || "";
  return `
    <aside class="lesson-notes-panel" data-notes-panel="${escapeHtml(topicKey)}">
      <button type="button" class="lesson-notes-toggle" data-notes-toggle>
        ${icon("pencil")}
        <span>My Notes</span>
        ${saved ? `<span class="notes-saved-dot" aria-label="Notes saved"></span>` : ""}
        ${icon("chevronDown")}
      </button>
      <div class="lesson-notes-body" id="lesson-notes-body"${saved ? "" : " hidden"}>
        <textarea
          id="lesson-notes-textarea"
          class="lesson-notes-textarea"
          placeholder="Write your personal notes for this lesson…"
          rows="5"
          aria-label="Personal lesson notes"
        >${escapeHtml(saved)}</textarea>
        <div class="lesson-notes-footer">
          <span class="lesson-notes-count" id="lesson-notes-count">${saved.length} chars</span>
          <button type="button" class="lesson-notes-clear" id="lesson-notes-clear">Clear notes</button>
        </div>
      </div>
    </aside>
  `;
}

function setupLessonNotes() {
  const toggle = app.querySelector("[data-notes-toggle]");
  if (!toggle) return;
  const body = document.getElementById("lesson-notes-body");
  const textarea = document.getElementById("lesson-notes-textarea");
  const count = document.getElementById("lesson-notes-count");
  const clearBtn = document.getElementById("lesson-notes-clear");
  const panel = app.querySelector("[data-notes-panel]");

  const noteKey = `nursinguganda.notes.${panel?.dataset.notesPanel || ""}`;

  toggle.addEventListener("click", () => {
    const hidden = body.hasAttribute("hidden");
    if (hidden) { body.removeAttribute("hidden"); textarea.focus(); }
    else body.setAttribute("hidden", "");
    toggle.querySelector(".ui-icon:last-child")?.classList.toggle("rotated", hidden);
  });

  let saveTimer;
  textarea.addEventListener("input", () => {
    count.textContent = `${textarea.value.length} chars`;
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      localStorage.setItem(noteKey, textarea.value);
      if (textarea.value) {
        if (!toggle.querySelector(".notes-saved-dot")) {
          const dot = document.createElement("span");
          dot.className = "notes-saved-dot";
          toggle.querySelector("span").after(dot);
        }
      }
    }, 600);
  });

  clearBtn.addEventListener("click", () => {
    if (!textarea.value) return;
    if (!confirm("Clear your notes for this lesson? This cannot be undone.")) return;
    textarea.value = "";
    count.textContent = "0 chars";
    localStorage.removeItem(noteKey);
    toggle.querySelector(".notes-saved-dot")?.remove();
    showToast("Notes cleared", "info");
  });
}

/* ── Study Timer / Pomodoro ───────────────────────────────────────── */
const TIMER_PHASES = [
  { label: "Focus", minutes: 25, icon: "flame", color: "primary" },
  { label: "Short Break", minutes: 5, icon: "heartPulse", color: "success" },
  { label: "Long Break", minutes: 15, icon: "moon", color: "cyan" }
];

const _timer = {
  phaseIndex: 0,
  secondsLeft: TIMER_PHASES[0].minutes * 60,
  totalSeconds: TIMER_PHASES[0].minutes * 60,
  running: false,
  sessions: 0,
  _interval: null
};

function timerFmt(s) {
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

function timerArcOffset(secondsLeft, totalSeconds) {
  const r = 42;
  const circumference = 2 * Math.PI * r;
  const pct = totalSeconds > 0 ? secondsLeft / totalSeconds : 1;
  return circumference * (1 - pct);
}

function timerUpdateDisplay() {
  const display = document.getElementById("nu-timer-display");
  const label = document.getElementById("nu-timer-label");
  const arc = document.getElementById("nu-timer-arc");
  const phase = document.getElementById("nu-timer-phase");
  const startBtn = document.getElementById("nu-timer-start");
  if (display) display.textContent = timerFmt(_timer.secondsLeft);
  if (label) label.textContent = timerFmt(_timer.secondsLeft);
  if (arc) arc.style.strokeDashoffset = timerArcOffset(_timer.secondsLeft, _timer.totalSeconds);
  if (phase) phase.textContent = TIMER_PHASES[_timer.phaseIndex].label;
  if (startBtn) startBtn.textContent = _timer.running ? "Pause" : "Start";
}

function timerAdvancePhase() {
  _timer.running = false;
  clearInterval(_timer._interval);
  if (_timer.phaseIndex === 0) {
    _timer.sessions++;
    _timer.phaseIndex = _timer.sessions % 4 === 0 ? 2 : 1;
    showToast(`Focus session done! Time for a ${TIMER_PHASES[_timer.phaseIndex].label}.`, "success");
  } else {
    _timer.phaseIndex = 0;
    showToast("Break over — back to focus!", "info");
  }
  const phase = TIMER_PHASES[_timer.phaseIndex];
  _timer.secondsLeft = phase.minutes * 60;
  _timer.totalSeconds = phase.minutes * 60;
  timerUpdateDisplay();
  const el = document.getElementById("nu-timer");
  if (el) el.dataset.phase = ["primary", "success", "cyan"][_timer.phaseIndex];
}

function setupStudyTimer() {
  if (document.getElementById("nu-timer")) return;
  const el = document.createElement("div");
  el.id = "nu-timer";
  el.dataset.phase = "primary";
  const circumference = 2 * Math.PI * 42;
  el.innerHTML = `
    <button class="nu-timer-toggle" id="nu-timer-toggle" aria-label="Study timer" aria-expanded="false">
      ${icon("clock")} <span id="nu-timer-display">${timerFmt(_timer.secondsLeft)}</span>
    </button>
    <div class="nu-timer-panel" id="nu-timer-panel" hidden>
      <div class="nu-timer-ring-wrap">
        <svg class="nu-timer-ring" viewBox="0 0 100 100" aria-hidden="true">
          <circle class="nu-timer-track" cx="50" cy="50" r="42"/>
          <circle class="nu-timer-arc" id="nu-timer-arc" cx="50" cy="50" r="42"
            stroke-dasharray="${circumference}"
            stroke-dashoffset="0"
            transform="rotate(-90 50 50)"/>
        </svg>
        <span class="nu-timer-center">
          <span id="nu-timer-label">${timerFmt(_timer.secondsLeft)}</span>
          <small id="nu-timer-phase">${TIMER_PHASES[0].label}</small>
        </span>
      </div>
      <div class="nu-timer-phase-btns">
        ${TIMER_PHASES.map((p, i) => `<button type="button" class="nu-timer-phase-btn${i === 0 ? " active" : ""}" data-timer-phase="${i}">${p.label}</button>`).join("")}
      </div>
      <div class="nu-timer-actions">
        <button type="button" id="nu-timer-start">Start</button>
        <button type="button" id="nu-timer-reset">Reset</button>
      </div>
      <p class="nu-timer-sessions">${icon("flame")} <span id="nu-timer-sessions">0</span> focus sessions today</p>
    </div>
  `;
  document.body.appendChild(el);

  document.getElementById("nu-timer-toggle").addEventListener("click", () => {
    const panel = document.getElementById("nu-timer-panel");
    const toggle = document.getElementById("nu-timer-toggle");
    const hidden = panel.hasAttribute("hidden");
    if (hidden) { panel.removeAttribute("hidden"); toggle.setAttribute("aria-expanded", "true"); }
    else { panel.setAttribute("hidden", ""); toggle.setAttribute("aria-expanded", "false"); }
  });

  document.getElementById("nu-timer-start").addEventListener("click", () => {
    if (_timer.running) {
      _timer.running = false;
      clearInterval(_timer._interval);
    } else {
      _timer.running = true;
      _timer._interval = setInterval(() => {
        _timer.secondsLeft--;
        if (_timer.secondsLeft <= 0) timerAdvancePhase();
        timerUpdateDisplay();
        document.getElementById("nu-timer-sessions").textContent = _timer.sessions;
      }, 1000);
    }
    timerUpdateDisplay();
  });

  document.getElementById("nu-timer-reset").addEventListener("click", () => {
    _timer.running = false;
    clearInterval(_timer._interval);
    const phase = TIMER_PHASES[_timer.phaseIndex];
    _timer.secondsLeft = phase.minutes * 60;
    _timer.totalSeconds = phase.minutes * 60;
    timerUpdateDisplay();
  });

  el.querySelectorAll("[data-timer-phase]").forEach((btn) => {
    btn.addEventListener("click", () => {
      _timer.running = false;
      clearInterval(_timer._interval);
      _timer.phaseIndex = Number(btn.dataset.timerPhase);
      const phase = TIMER_PHASES[_timer.phaseIndex];
      _timer.secondsLeft = phase.minutes * 60;
      _timer.totalSeconds = phase.minutes * 60;
      el.dataset.phase = ["primary", "success", "cyan"][_timer.phaseIndex];
      el.querySelectorAll("[data-timer-phase]").forEach((b) => b.classList.toggle("active", b === btn));
      timerUpdateDisplay();
    });
  });
}

async function init() {
  try {
    applyTheme();
    const [response, imageResponse, optimizedResponse, bookResponse, instrumentResponse] = await Promise.all([
      fetch("assets/data/curriculum.json"),
      fetch("assets/data/topic-image-matches.json"),
      fetch("assets/images/optimized/nursing-uganda-optimized-image-manifest.json"),
      fetch("assets/data/book-library.json"),
      fetch("assets/data/medical-instruments.json?v=2")
    ]);
    if (!response.ok) throw new Error(`We could not load the curriculum. Please refresh. (${response.status})`);
    state.data = await response.json();
    state.imageMatches = imageResponse.ok ? await imageResponse.json() : { matches: {} };
    state.optimizedImages = optimizedResponse.ok ? (await optimizedResponse.json()).images || {} : {};
    state.bookLibrary = bookResponse.ok ? await bookResponse.json() : bookLibrary();
    state.medicalInstrumentLibrary = instrumentResponse.ok ? await instrumentResponse.json() : null;
    setupMonetization();
    if (window.location.pathname === "/" || window.location.pathname === "") history.replaceState(null, "", "/notes");
    render();
    scrollPageToTop();
    setupOfflineBanner();
    setupStudyNotifications();
    setupStudyTimer();
  } catch (error) {
    app.innerHTML = `<div class="loading-screen"><strong class="loading-wordmark">Nursing Uganda</strong><p>${escapeHtml(error.message)}</p></div>`;
  }
}

// History API navigation — back/forward buttons
window.addEventListener("popstate", () => {
  state.navOpen = false;
  state.megaOpen = "";
  render();
  scrollPageToTop();
});

// Intercept all internal link clicks — no full page reloads
document.addEventListener("click", (event) => {
  const anchor = event.target.closest("a[href]");
  if (!anchor) return;
  const href = anchor.getAttribute("href");
  if (!href || href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("#") || anchor.hasAttribute("target")) return;
  if (href.startsWith("/")) {
    event.preventDefault();
    if (window.location.pathname === href) return;
    history.pushState(null, "", href);
    state.navOpen = false;
    state.megaOpen = "";
    render();
    scrollPageToTop();
  }
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && state.megaOpen) {
    state.megaOpen = "";
    render();
    return;
  }
  if (event.key === "Escape" && state.selectedSchool) {
    state.selectedSchool = "";
    render();
    return;
  }
  if (event.key === "Escape" && state.selectedCareerJob) {
    state.selectedCareerJob = "";
    render();
    return;
  }
  if (event.key === "Escape" && state.cookiePreferencesOpen) {
    state.cookiePreferencesOpen = false;
    render();
    return;
  }
  if (event.key === "Escape" && state.lightboxImage) {
    state.lightboxImage = "";
    state.lightboxAlt = "";
    render();
  }
});

init();

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js").then((reg) => {
    reg.addEventListener("updatefound", () => {
      const next = reg.installing;
      if (!next) return;
      next.addEventListener("statechange", () => {
        if (next.state === "installed" && navigator.serviceWorker.controller) {
          let container = document.getElementById("nu-toasts");
          if (!container) { container = document.createElement("div"); container.id = "nu-toasts"; document.body.appendChild(container); }
          const swToast = document.createElement("div");
          swToast.className = "nu-toast nu-toast-info";
          swToast.innerHTML = `<span class="nu-toast-icon">${icon("refreshCw")}</span><span>Update ready</span><button class="nu-toast-action" type="button">Reload</button>`;
          swToast.querySelector(".nu-toast-action").addEventListener("click", () => location.reload());
          container.appendChild(swToast);
          requestAnimationFrame(() => requestAnimationFrame(() => swToast.classList.add("nu-toast-show")));
        }
      });
    });
  }).catch(() => {});
}

// ── PWA install prompt ──────────────────────────────────────────────────────
let _pwaPromptEvent = null;

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  _pwaPromptEvent = e;

  // Don't show if user dismissed this session, or already installed
  if (sessionStorage.getItem("nu-install-dismissed") || window.matchMedia("(display-mode: standalone)").matches) return;

  // Show the banner after a short pause so it doesn't compete with initial load
  setTimeout(() => {
    if (!_pwaPromptEvent) return;
    const banner = document.createElement("div");
    banner.id = "nu-install-banner";
    banner.setAttribute("role", "banner");
    banner.innerHTML = `
      <img class="nu-install-icon" src="assets/images/pwa/icon-192x192.png" alt="Nursing Uganda icon" width="48" height="48">
      <div class="nu-install-body">
        <strong>Add to Home Screen</strong>
        <span>Study offline, faster load &amp; app-like experience</span>
      </div>
      <button class="nu-install-btn" type="button" id="nu-install-confirm">Install</button>
      <button class="nu-install-close" type="button" id="nu-install-dismiss" aria-label="Dismiss">${icon("x")}</button>
    `;
    document.body.appendChild(banner);
    requestAnimationFrame(() => requestAnimationFrame(() => banner.classList.add("nu-install-banner-show")));

    document.getElementById("nu-install-confirm").addEventListener("click", async () => {
      if (!_pwaPromptEvent) return;
      _pwaPromptEvent.prompt();
      const { outcome } = await _pwaPromptEvent.userChoice;
      _pwaPromptEvent = null;
      banner.remove();
      if (outcome === "accepted") {
        // Optionally show a thank-you toast
        showToast("App installed! You can open it from your home screen.", "success");
      }
    });

    document.getElementById("nu-install-dismiss").addEventListener("click", () => {
      sessionStorage.setItem("nu-install-dismissed", "1");
      banner.classList.remove("nu-install-banner-show");
      setTimeout(() => banner.remove(), 300);
    });
  }, 6000);
});

window.addEventListener("appinstalled", () => {
  _pwaPromptEvent = null;
  const banner = document.getElementById("nu-install-banner");
  if (banner) banner.remove();
});

function showToast(message, type = "info") {
  let container = document.getElementById("nu-toasts");
  if (!container) { container = document.createElement("div"); container.id = "nu-toasts"; document.body.appendChild(container); }
  const t = document.createElement("div");
  t.className = `nu-toast nu-toast-${type}`;
  t.textContent = message;
  container.appendChild(t);
  requestAnimationFrame(() => requestAnimationFrame(() => t.classList.add("nu-toast-show")));
  setTimeout(() => { t.classList.remove("nu-toast-show"); setTimeout(() => t.remove(), 350); }, 4000);
}
