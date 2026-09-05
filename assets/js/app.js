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
  loginIntended: "",   // URL to return to after successful sign-in
  careerHeroSlide: 0,
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
  flashcardIndex: 0,
  flashcardFlipped: false,
  flashcardCategory: "All",
  flashcardSRMode: false,
  currentUser: null,
  userMenuOpen: false,
  loginTab: "signin",
  loginError: "",
  loginLoading: false,
  loginEmailSent: false,
  loginEmailAddress: "",
  announcements: [],
  studyTips: [],
  upcomingEvents: [],
  resourceDownloads: [],
  maintenance: { mode: false, message: "", eta: "" },
  adminTab: "analytics",
  adminAnalytics: { events: [], loading: false, loaded: false, error: "" },
  analyticsRange: "7d",
  adminAnnouncements: [],
  adminUsers: [],
  adminTips: [],
  adminEvents: [],
  adminResources: [],
  adminAnnForm: { open: false, data: {} },
  adminTipForm: { open: false, data: {} },
  adminEventForm: { open: false, data: {} },
  adminResourceForm: { open: false, data: {} },
  contactForm: { name: "", email: "", subject: "", message: "", type: "general", loading: false, sent: false, error: "" },
  loginPrompt: { open: false, feature: "", message: "" },
  mockExam: {
    examId: "",
    questions: [],
    answers: {},
    currentQ: 0,
    examEndTime: 0,
    timeLeft: 0,
    submitted: false,
    paletteOpen: false
  },
  clinicalTools: {
    tab: "calculator",
    calcType: "liquid",
    checklistId: "",
    valuesTab: "vitals"
  },
  planner: {
    weekOffset: 0,
    selectedDay: "",
    addFormOpen: false,
    addForm: { title: "", type: "revision", notes: "" }
  },
  bellOpen: false,
  community: {
    questions: [],
    loading: false,
    selectedQuestion: null,
    questionAnswers: [],
    answerLoading: false,
    askFormOpen: false,
    askTitle: "",
    askBody: "",
    answerBody: "",
    filter: "all",
    search: ""
  },
  leaderboard: null,
  settingsForm: { name: "", programme: "", year: "", goal: "3", saving: false, saved: false }
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
  tag: `<path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42Z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/>`,
  xCircle: `<circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/>`,
  alertTriangle: `<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>`,
  send: `<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>`,
  logOut: `<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>`,
  lock: `<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>`,
  mousePointer: `<path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3Z"/><path d="m13 13 6 6"/>`,
  eye: `<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>`,
  eyeOff: `<path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/>`,
  userCheck: `<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/>`,
  grid: `<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>`,
  alarmClock: `<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2"/><path d="M5 3 2 6"/><path d="m22 6-3-3"/><path d="M6.38 18.7 4 21"/><path d="M17.64 18.67 20 21"/>`,
  timerReset: `<path d="M10 2h4"/><path d="M12 14v-4"/><path d="M4 13a8 8 0 0 1 8-7 8 8 0 1 1-5.3 14L4 17.6"/><path d="M9 17H4v5"/>`,
  zap: `<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>`,
  whatsapp: `<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>`,
  gift: `<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/>`,
};

/* ── Auth Utilities ─────────────────────────────────────────────────── */

/**
 * SHA-256 via the browser's built-in Web Crypto API.
 * Returns a 64-char lowercase hex string.
 * Requires a secure context (HTTPS or localhost), always true on nursinguganda.com.
 */
async function sha256Hash(str) {
  const encoded = new TextEncoder().encode(str);
  const buf = await crypto.subtle.digest("SHA-256", encoded);
  return Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Generate a random 16-byte hex salt (32 hex chars).
 * Each user gets a unique salt so identical passwords produce different hashes.
 */
function generateSalt() {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes).map(b => b.toString(16).padStart(2, "0")).join("");
}

// ─── SUPABASE CLIENT ──────────────────────────────────────────────────────
const SUPA_URL = "https://gunhybscakozycmwufue.supabase.co";
const SUPA_KEY = "sb_publishable_OVP7lpmqKmftV8mqKBxAbA_rKLWcx9Q";
let _sbClient = null;
function sb() {
  if (!_sbClient && typeof window !== "undefined" && window.supabase?.createClient) {
    _sbClient = window.supabase.createClient(SUPA_URL, SUPA_KEY);
  }
  return _sbClient;
}

const AUTH_COLORS = [
  { bg: "#dbeafe", text: "#1e40af" }, { bg: "#dcfce7", text: "#15803d" },
  { bg: "#fce7f3", text: "#9d174d" }, { bg: "#ede9fe", text: "#5b21b6" },
  { bg: "#ffedd5", text: "#c2410c" }, { bg: "#e0f2fe", text: "#0369a1" },
  { bg: "#e0f7f8", text: "#007b83" }, { bg: "#fef9c3", text: "#92400e" },
];
function authAvatarColor(email) {
  let h = 0; const s = String(email || "a");
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) & 0xffff;
  return AUTH_COLORS[h % AUTH_COLORS.length];
}
function supabaseUserToAppUser(sbUser) {
  if (!sbUser) return null;
  const name = sbUser.user_metadata?.name || sbUser.email.split("@")[0];
  const initials = name.split(/\s+/).map(w => w[0] || "").join("").toUpperCase().slice(0, 2) || "?";
  return { id: sbUser.id, name, email: sbUser.email, initials, color: authAvatarColor(sbUser.email) };
}

async function authRegister(name, email, password) {
  const client = sb();
  if (!client) return { ok: false, error: "Auth service unavailable. Please refresh the page." };
  if (!name.trim() || !email.trim() || !password) return { ok: false, error: "All fields are required." };
  if (password.length < 6) return { ok: false, error: "Password must be at least 6 characters." };
  const { data, error } = await client.auth.signUp({
    email: email.toLowerCase().trim(), password,
    options: { data: { name: name.trim() } }
  });
  if (error) return { ok: false, error: error.message };
  if (!data.session) {
    // Email confirmation is required: Supabase sends the confirmation email.
    state.loginEmailSent = true;
    state.loginEmailAddress = email.trim();
    return { ok: true, emailConfirmationRequired: true };
  }
  state.currentUser = supabaseUserToAppUser(data.user);
  state.loginError = "";
  // Fire-and-forget welcome email, non-blocking
  callEdgeFunction("send-welcome-email", {
    email: data.user.email,
    name:  (data.user.user_metadata?.name || "").split(/\s+/)[0] || "Student",
  }).catch(() => {});
  return { ok: true, user: state.currentUser };
}

async function authLogin(email, password) {
  const client = sb();
  if (!client) return { ok: false, error: "Auth service unavailable. Please refresh the page." };
  if (!email.trim() || !password) return { ok: false, error: "Please enter your email and password." };

  // ── Lockout guard ──────────────────────────────────────────────────────────
  const lockStatus = await checkLoginLockout(email);
  if (lockStatus.locked) {
    const unlockAt = lockStatus.locked_until
      ? new Date(lockStatus.locked_until).toLocaleTimeString("en-UG", { hour: "2-digit", minute: "2-digit", timeZone: "Africa/Kampala" })
      : "in about 1 hour";
    return { ok: false, error: `Account locked after too many failed attempts. Try again at ${unlockAt}.`, locked: true };
  }

  const { data, error } = await client.auth.signInWithPassword({
    email: email.toLowerCase().trim(), password
  });

  if (error) {
    const msg = /invalid login credentials/i.test(error.message)
      ? "Incorrect email or password. Please try again."
      : error.message;

    // Record failure. Locks after 5 consecutive wrong attempts
    const attemptResult = await recordFailedLoginAttempt(email);
    if (attemptResult.now_locked) {
      // Non-blocking lockout notification email
      callEdgeFunction("send-lockout-email", {
        email:        email.trim(),
        locked_until: attemptResult.locked_until,
      }).catch(() => {});
      const unlockAt = attemptResult.locked_until
        ? new Date(attemptResult.locked_until).toLocaleTimeString("en-UG", { hour: "2-digit", minute: "2-digit", timeZone: "Africa/Kampala" })
        : "in about 1 hour";
      return { ok: false, error: `Too many failed attempts. Account locked until ${unlockAt}. Check your email for unlock instructions.`, locked: true };
    }

    const remaining = Math.max(0, 5 - (attemptResult.attempts || 0));
    const suffix = remaining > 0 ? ` (${remaining} attempt${remaining !== 1 ? "s" : ""} remaining before lockout)` : "";
    return { ok: false, error: msg + suffix };
  }

  // ── Successful login ───────────────────────────────────────────────────────
  state.currentUser = supabaseUserToAppUser(data.user);
  state.loginError = "";

  // Reset failed-attempt counter (non-blocking)
  clearLoginAttempts(email).catch(() => {});

  // Device fingerprint check: alert on new device (non-blocking)
  checkAndAlertNewDevice(data.user, email).catch(() => {});

  return { ok: true, user: state.currentUser };
}

async function authLogout() {
  const client = sb();
  if (client) await client.auth.signOut();
  state.currentUser = null;
  state.userMenuOpen = false;
  state.loginError = "";
  state.loginEmailSent = false;
}

async function authForgotPassword(email) {
  const client = sb();
  if (!client) return { ok: false, error: "Auth service unavailable." };
  if (!email.trim()) return { ok: false, error: "Enter your email address first, then click Forgot Password." };
  // Supabase handles the reset email (time-limited secure link) natively.
  const { error } = await client.auth.resetPasswordForEmail(email.trim(), {
    redirectTo: `${window.location.origin}/login?reset=1`
  });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

// ─── EMAIL SYSTEM HELPERS ─────────────────────────────────────────────────────

/**
 * Non-blocking helper to call a Supabase Edge Function.
 * Returns true on HTTP 2xx, false on any error (never throws).
 */
async function callEdgeFunction(name, payload) {
  try {
    const client = sb();
    let token = "";
    if (client) {
      const { data } = await client.auth.getSession();
      token = data?.session?.access_token || "";
    }
    const res = await fetch(`${SUPA_URL}/functions/v1/${name}`, {
      method: "POST",
      headers: {
        "Content-Type":  "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.warn(`[email] ${name} failed (${res.status}):`, text.slice(0, 200));
    }
    return res.ok;
  } catch (err) {
    console.warn(`[email] ${name} error:`, err instanceof Error ? err.message : String(err));
    return false;
  }
}

/** Call a Supabase RPC (database function). Returns the result data or null. */
async function callRpc(fnName, params) {
  try {
    const client = sb();
    if (!client) return null;
    const { data, error } = await client.rpc(fnName, params);
    if (error) { console.warn(`[rpc] ${fnName} error:`, error.message); return null; }
    return data;
  } catch (err) {
    console.warn(`[rpc] ${fnName} threw:`, err instanceof Error ? err.message : String(err));
    return null;
  }
}

/** Check if an email address is currently locked out. */
async function checkLoginLockout(email) {
  const result = await callRpc("nu_check_lockout", { p_email: email.trim() });
  return result ?? { locked: false, attempts: 0, locked_until: null };
}

/** Record one failed login attempt. Returns { now_locked, attempts, locked_until }. */
async function recordFailedLoginAttempt(email) {
  const result = await callRpc("nu_record_failed_attempt", { p_email: email.trim() });
  return result ?? { now_locked: false, attempts: 0, locked_until: null };
}

/** Reset the failed-attempt counter after a successful login. */
async function clearLoginAttempts(email) {
  await callRpc("nu_record_success", { p_email: email.trim() });
}

/** Build a stable device fingerprint from browser signals. */
function buildDeviceFingerprint() {
  try {
    const nav = navigator;
    const raw = [
      nav.userAgent,
      nav.language,
      Intl.DateTimeFormat().resolvedOptions().timeZone,
      `${screen.width}x${screen.height}`,
      screen.colorDepth,
    ].join("|");
    // btoa may fail on non-Latin chars in user-agent on some Android browsers
    const fp = btoa(unescape(encodeURIComponent(raw))).slice(0, 64);
    return {
      fingerprint: fp,
      userAgent:   nav.userAgent.slice(0, 200),
      timezone:    Intl.DateTimeFormat().resolvedOptions().timeZone,
      language:    nav.language,
    };
  } catch {
    return { fingerprint: "unknown", userAgent: "", timezone: "", language: "" };
  }
}

/** Register device fingerprint; if new, fire a suspicious-login alert email. */
async function checkAndAlertNewDevice(sbUser, email) {
  try {
    const client = sb();
    if (!client || !sbUser?.id) return;
    const fp = buildDeviceFingerprint();
    const result = await callRpc("nu_check_device", {
      p_user_id:    sbUser.id,
      p_fingerprint: fp.fingerprint,
      p_user_agent:  fp.userAgent,
      p_timezone:    fp.timezone,
      p_language:    fp.language,
    });
    if (!result?.is_new) return;
    // New device: send non-blocking security alert
    await callEdgeFunction("send-suspicious-login", {
      email,
      name:   sbUser.user_metadata?.name || "",
      device: {
        ...fp,
        date: new Date().toLocaleString("en-UG", {
          timeZone: fp.timezone || "Africa/Kampala",
          dateStyle: "medium",
          timeStyle: "short",
        }),
      },
    });
  } catch {} // never block login on alert failure
}

// ─── PROGRESS SYNC ────────────────────────────────────────────────────────
let _progressSyncTimer = null;
function scheduleProgressSync() {
  if (!state.currentUser?.id) return;
  clearTimeout(_progressSyncTimer);
  _progressSyncTimer = setTimeout(pushProgressToSupabase, 1800);
}
async function pushProgressToSupabase() {
  const client = sb(); if (!client || !state.currentUser?.id) return;
  try {
    await client.from("user_progress").upsert({
      user_id: state.currentUser.id,
      mastered_topics:  masteredTopics(),
      completed_topics: completedTopics(),
      quiz_attempts:    quizAttempts(),
      quiz_submitted:   quizSubmitted(),
      bookmarks:        bookmarks(),
      flashcard_mastery: [...(getFlashcardMastery?.() || new Set())],
      streak:           getStreak?.() || null,
      updated_at:       new Date().toISOString()
    }, { onConflict: "user_id" });
  } catch (_) {}
}
async function loadProgressFromSupabase() {
  const client = sb(); if (!client || !state.currentUser?.id) return;
  try {
    const { data } = await client.from("user_progress").select("*").eq("user_id", state.currentUser.id).maybeSingle();
    if (!data) return;
    const merge = (key, remote, local) => { if (remote && Object.keys(remote).length) localStorage.setItem(key, JSON.stringify({ ...local, ...remote })); };
    merge("nursinguganda.masteredTopics",  data.mastered_topics,  masteredTopics());
    merge("nursinguganda.completedTopics", data.completed_topics, completedTopics());
    merge("nursinguganda.quizAttempts",    data.quiz_attempts,    quizAttempts());
    merge("nursinguganda.quizSubmitted",   data.quiz_submitted,   quizSubmitted());
    if (data.bookmarks?.length) {
      const loc = bookmarks();
      const merged = [...data.bookmarks, ...loc.filter(b => !data.bookmarks.some(r => r.key === b.key))];
      localStorage.setItem("nursinguganda.bookmarks", JSON.stringify(merged.slice(0, 80)));
    }
    if (data.flashcard_mastery?.length) {
      const m = getFlashcardMastery?.() || new Set();
      data.flashcard_mastery.forEach(id => m.add(id));
      localStorage.setItem("nursinguganda.flashcardMastery", JSON.stringify([...m]));
    }
    if (data.streak?.count) {
      const loc = getStreak?.() || { count: 0 };
      if (data.streak.count >= loc.count) localStorage.setItem("nursinguganda.streak", JSON.stringify(data.streak));
    }
  } catch (_) {}
}

// ─── ANNOUNCEMENTS ────────────────────────────────────────────────────────
async function loadAnnouncements() {
  const client = sb(); if (!client) return;
  try {
    const { data } = await client.from("announcements").select("*").eq("is_active", true).order("created_at", { ascending: false }).limit(3);
    if (data?.length) state.announcements = data;
  } catch (_) {}
}
function renderAnnouncementBanner() {
  if (!state.announcements.length) return "";
  const dismissed = (() => { try { return new Set(JSON.parse(localStorage.getItem("nursinguganda.dismissedAnns") || "[]")); } catch { return new Set(); } })();
  const ann = state.announcements.find(a => !dismissed.has(a.id));
  if (!ann) return "";
  const palette = { info: ["#dbeafe","#1e40af","#3b82f6"], warning: ["#fef3c7","#92400e","#f59e0b"], success: ["#dcfce7","#15803d","#22c55e"] };
  const [bg, col, acc] = palette[ann.type] || palette.info;
  return `<div class="ann-banner" style="background:${bg};border-bottom:2px solid ${acc}" role="alert" data-ann-id="${escapeHtml(ann.id)}">
    <div class="container ann-inner">
      <span class="ann-msg" style="color:${col}">${escapeHtml(ann.message)}</span>
      ${ann.link_url ? `<a href="${escapeHtml(ann.link_url)}" class="ann-link" style="color:${acc}">${escapeHtml(ann.link_text || "Learn more")}</a>` : ""}
      <button type="button" class="ann-dismiss" data-dismiss-ann="${escapeHtml(ann.id)}" aria-label="Dismiss" style="color:${col}">✕</button>
    </div>
  </div>`;
}

// ─── STUDY TIP WIDGET ────────────────────────────────────────────────────────
function renderStudyTipWidget() {
  if (!state.studyTips.length) return "";
  const dismissed = (() => { try { return new Set(JSON.parse(localStorage.getItem("nursinguganda.dismissedTips") || "[]")); } catch { return new Set(); } })();
  const tip = state.studyTips.find(t => !dismissed.has(t.id));
  if (!tip) return "";
  return `
    <section class="section compact-section">
      <div class="container">
        <div class="study-tip-card" data-tip-id="${escapeHtml(tip.id)}">
          <span class="study-tip-emoji">${escapeHtml(tip.emoji || "💡")}</span>
          <div class="study-tip-body">
            <strong>Study Tip</strong>
            <p>${escapeHtml(tip.message)}</p>
          </div>
          <button type="button" class="study-tip-dismiss" data-dismiss-tip="${escapeHtml(tip.id)}" aria-label="Dismiss tip">✕</button>
        </div>
      </div>
    </section>`;
}

// ─── EVENTS STRIP ─────────────────────────────────────────────────────────────
function evDate(d) { try { return new Date(d + "T00:00:00"); } catch { return new Date(); } }
function renderEventsStrip() {
  if (!state.upcomingEvents.length) return "";
  return `
    <section class="section compact-section events-section">
      <div class="container">
        <div class="section-head slim-head">
          <div><span class="eyebrow">What's On</span><h2>Upcoming Events</h2></div>
        </div>
        <div class="events-grid">
          ${state.upcomingEvents.map(ev => {
            const d = evDate(ev.event_date);
            const dayNum = d.getDate();
            const monthStr = d.toLocaleDateString("en-GB", { month: "short" });
            return `
            <div class="event-card">
              <div class="event-date-badge">
                <strong>${dayNum}</strong>
                <span>${monthStr}</span>
              </div>
              <div class="event-body">
                <strong class="event-title">${escapeHtml(ev.title)}</strong>
                ${ev.description ? `<p class="event-desc">${escapeHtml(ev.description)}</p>` : ""}
                <div class="event-meta">
                  ${ev.event_time ? `<span>${icon("clock")} ${escapeHtml(ev.event_time)}</span>` : ""}
                  ${ev.location ? `<span>${icon("mapPin")} ${escapeHtml(ev.location)}</span>` : ""}
                </div>
              </div>
              ${ev.link_url ? `<a class="event-link button ghost" href="${escapeHtml(ev.link_url)}" target="_blank" rel="noopener">${escapeHtml(ev.link_text || "Details")} ${icon("externalLink")}</a>` : ""}
            </div>`;
          }).join("")}
        </div>
      </div>
    </section>`;
}

// ─── RESOURCE DOWNLOADS SECTION ───────────────────────────────────────────────
function renderResourceDownloadsSection() {
  if (!state.resourceDownloads.length) return "";
  return `
    <section class="section compact-section rds-section">
      <div class="container">
        <div class="section-head slim-head">
          <div><span class="eyebrow">Downloads</span><h2>Free Study Resources</h2></div>
        </div>
        <div class="rds-grid">
          ${state.resourceDownloads.map(r => `
            <div class="rds-card">
              <div class="rds-card-body">
                <span class="rds-tag">${escapeHtml(r.category || "General")}</span>
                <strong class="rds-title">${escapeHtml(r.title)}</strong>
                ${r.description ? `<p class="rds-desc">${escapeHtml(r.description)}</p>` : ""}
              </div>
              ${r.file_url
                ? `<a class="button primary rds-dl-btn" href="${escapeHtml(r.file_url)}" target="_blank" rel="noopener" download>${icon("download")} Download</a>`
                : `<span class="rds-coming">Coming soon</span>`}
            </div>
          `).join("")}
        </div>
      </div>
    </section>`;
}

// ─── ADMIN HELPERS ────────────────────────────────────────────────────────
function isAdmin() { return state.currentUser?.email === "twikirizederick@gmail.com"; }

// ─── MAINTENANCE MODE ─────────────────────────────────────────────────────────
async function loadSiteSettings() {
  try {
    const client = sb(); if (!client) return;
    const { data } = await client.from("site_settings").select("key,value");
    if (!data) return;
    const map = Object.fromEntries(data.map(r => [r.key, r.value]));
    state.maintenance = {
      mode:    map.maintenance_mode === "true",
      message: map.maintenance_message || "",
      eta:     map.maintenance_eta    || "",
    };
  } catch (_) {}
}

async function adminSaveMaintenance(enabled, message, eta) {
  const client = sb(); if (!client) return { ok: false, error: "No connection" };
  try {
    const { error } = await client.rpc("nu_set_maintenance", {
      p_enabled: enabled,
      p_message: message || "",
      p_eta:     eta     || "",
    });
    if (error) throw error;
    state.maintenance = { mode: enabled, message: message || "", eta: eta || "" };
    showToast(enabled ? "⚠️ Maintenance mode ON, users are now blocked" : "✅ Site is live again, maintenance mode OFF", enabled ? "warning" : "success");
    render();
    return { ok: true };
  } catch (err) {
    console.error("[admin] saveMaintenance:", err.message);
    showToast("Save failed: " + err.message, "error");
    return { ok: false, error: err.message };
  }
}

function renderMaintenancePage() {
  const m = state.maintenance || {};
  document.title = "Nursing Uganda: Scheduled Maintenance";
  const msg = m.message || "We're performing scheduled maintenance to improve your experience. We apologise for any inconvenience.";
  app.innerHTML = `
    <div class="maintenance-screen">
      <div class="maintenance-top-bar"></div>
      <div class="maintenance-body">
        <div class="maintenance-mark-wrap">
          <div class="maintenance-ring maintenance-ring-outer"></div>
          <div class="maintenance-ring maintenance-ring-inner"></div>
          <img src="assets/images/nursing-uganda-icon-mark.webp"
               class="maintenance-mark" alt="Nursing Uganda" width="80" height="80">
        </div>
        <div class="maintenance-badge">${icon("wrench")}<span>Scheduled Maintenance</span></div>
        <h1 class="maintenance-heading">We'll be back soon</h1>
        <p class="maintenance-msg">${escapeHtml(msg)}</p>
        ${m.eta ? `
          <div class="maintenance-eta-card">
            ${icon("clock")}
            <div class="maintenance-eta-text">
              <strong>Estimated return</strong>
              <span>${escapeHtml(m.eta)}</span>
            </div>
          </div>` : ""}
        <div class="maintenance-progress">
          <div class="maintenance-progress-fill"></div>
        </div>
        <p class="maintenance-contact">Questions? Contact us at
          <a href="mailto:info@nursinguganda.com">info@nursinguganda.com</a>
        </p>
        <a href="/login" class="maintenance-admin-link" data-nav>
          ${icon("lock")}<span>Administrator sign in</span>
        </a>
      </div>
    </div>
  `;
}

// ─── AUTH GATE ────────────────────────────────────────────────────────────
// If the user is logged in, run callback immediately.
// Otherwise open the login-prompt modal so they can sign in first.
function requireLogin(feature, message, callback) {
  if (state.currentUser) {
    callback();
  } else {
    state.loginPrompt = { open: true, feature, message };
    render();
  }
}

async function adminLoadAnnouncements() {
  const client = sb(); if (!client) return;
  const { data } = await client.from("announcements").select("*").order("created_at", { ascending: false });
  if (data) state.adminAnnouncements = data;
}
async function adminSaveAnn(data, id = null) {
  const client = sb(); if (!client) return { ok: false };
  const payload = { message: data.message, type: data.type || "info", link_text: data.link_text || null, link_url: data.link_url || null, is_active: true };
  const { error } = id ? await client.from("announcements").update(payload).eq("id", id) : await client.from("announcements").insert(payload);
  if (error) return { ok: false, error: error.message };
  await adminLoadAnnouncements(); await loadAnnouncements(); return { ok: true };
}
async function adminToggleAnn(id, isActive) {
  const client = sb(); if (!client) return;
  await client.from("announcements").update({ is_active: !isActive }).eq("id", id);
  await adminLoadAnnouncements(); await loadAnnouncements(); render();
}
async function adminDeleteAnn(id) {
  const client = sb(); if (!client) return;
  if (!confirm("Delete this announcement?")) return;
  await client.from("announcements").delete().eq("id", id);
  await adminLoadAnnouncements(); await loadAnnouncements(); render();
}

// ─── STUDY TIPS ───────────────────────────────────────────────────────────────
async function loadTipsFromSupabase() {
  const client = sb(); if (!client) return;
  try {
    const { data } = await client.from("study_tips").select("*").eq("is_active", true).order("created_at", { ascending: false }).limit(5);
    if (data?.length) state.studyTips = data;
  } catch (_) {}
}
async function adminLoadTips() {
  const client = sb(); if (!client) return;
  const { data } = await client.from("study_tips").select("*").order("created_at", { ascending: false });
  if (data) state.adminTips = data;
}
async function adminSaveTip(tipData, id = null) {
  const client = sb(); if (!client) return { ok: false };
  const payload = { message: tipData.message, emoji: tipData.emoji || "💡", is_active: true };
  const { error } = id ? await client.from("study_tips").update(payload).eq("id", id) : await client.from("study_tips").insert(payload);
  if (error) return { ok: false, error: error.message };
  await adminLoadTips(); await loadTipsFromSupabase();
  return { ok: true };
}
async function adminToggleTip(id, isActive) {
  const client = sb(); if (!client) return;
  await client.from("study_tips").update({ is_active: !isActive }).eq("id", id);
  await adminLoadTips(); await loadTipsFromSupabase(); render();
}
async function adminDeleteTip(id) {
  const client = sb(); if (!client) return;
  if (!confirm("Delete this study tip?")) return;
  await client.from("study_tips").delete().eq("id", id);
  await adminLoadTips(); await loadTipsFromSupabase(); render();
}

// ─── EVENTS ───────────────────────────────────────────────────────────────────
async function loadEventsFromSupabase() {
  const client = sb(); if (!client) return;
  try {
    const today = new Date().toISOString().slice(0, 10);
    const { data } = await client.from("events").select("*").eq("is_active", true).gte("event_date", today).order("event_date", { ascending: true }).limit(6);
    if (data?.length) state.upcomingEvents = data;
  } catch (_) {}
}
async function adminLoadEvents() {
  const client = sb(); if (!client) return;
  const { data } = await client.from("events").select("*").order("event_date", { ascending: false });
  if (data) state.adminEvents = data;
}
async function adminSaveEvent(evData, id = null) {
  const client = sb(); if (!client) return { ok: false };
  const payload = { title: evData.title, description: evData.description || null, event_date: evData.event_date, event_time: evData.event_time || null, location: evData.location || null, link_url: evData.link_url || null, link_text: evData.link_text || null, is_active: true };
  const { error } = id ? await client.from("events").update(payload).eq("id", id) : await client.from("events").insert(payload);
  if (error) return { ok: false, error: error.message };
  await adminLoadEvents(); await loadEventsFromSupabase();
  return { ok: true };
}
async function adminToggleEvent(id, isActive) {
  const client = sb(); if (!client) return;
  await client.from("events").update({ is_active: !isActive }).eq("id", id);
  await adminLoadEvents(); await loadEventsFromSupabase(); render();
}
async function adminDeleteEvent(id) {
  const client = sb(); if (!client) return;
  if (!confirm("Delete this event?")) return;
  await client.from("events").delete().eq("id", id);
  await adminLoadEvents(); await loadEventsFromSupabase(); render();
}

// ─── RESOURCE DOWNLOADS ───────────────────────────────────────────────────────
async function loadResourceDownloadsFromSupabase() {
  const client = sb(); if (!client) return;
  try {
    const { data } = await client.from("resource_downloads").select("*").eq("is_active", true).order("created_at", { ascending: false });
    if (data?.length) state.resourceDownloads = data;
  } catch (_) {}
}
async function adminLoadResources() {
  const client = sb(); if (!client) return;
  const { data } = await client.from("resource_downloads").select("*").order("created_at", { ascending: false });
  if (data) state.adminResources = data;
}
async function adminSaveResource(resData, id = null) {
  const client = sb(); if (!client) return { ok: false };
  const payload = { title: resData.title, description: resData.description || null, category: resData.category || "General", file_url: resData.file_url || null, is_active: true };
  const { error } = id ? await client.from("resource_downloads").update(payload).eq("id", id) : await client.from("resource_downloads").insert(payload);
  if (error) return { ok: false, error: error.message };
  await adminLoadResources(); await loadResourceDownloadsFromSupabase();
  return { ok: true };
}
async function adminToggleResource(id, isActive) {
  const client = sb(); if (!client) return;
  await client.from("resource_downloads").update({ is_active: !isActive }).eq("id", id);
  await adminLoadResources(); await loadResourceDownloadsFromSupabase(); render();
}
async function adminDeleteResource(id) {
  const client = sb(); if (!client) return;
  if (!confirm("Delete this download?")) return;
  await client.from("resource_downloads").delete().eq("id", id);
  await adminLoadResources(); await loadResourceDownloadsFromSupabase(); render();
}

// ─── USERS (admin view) ───────────────────────────────────────────────────────
async function adminLoadUsers() {
  const client = sb(); if (!client) return;
  const { data } = await client.from("profiles").select("*").order("created_at", { ascending: false });
  if (data) state.adminUsers = data;
}

// --- ANALYTICS ---------------------------------------------------------------
const ANALYTICS_EVENTS_KEY = "nursinguganda.analyticsEvents";
const ANALYTICS_VISITOR_KEY = "nursinguganda.visitorId";
const ANALYTICS_SESSION_KEY = "nursinguganda.analyticsSession";
const ANALYTICS_MAX_LOCAL_EVENTS = 900;

function analyticsId(prefix) {
  const bytes = new Uint8Array(8);
  if (crypto?.getRandomValues) crypto.getRandomValues(bytes);
  else for (let i = 0; i < bytes.length; i += 1) bytes[i] = Math.floor(Math.random() * 256);
  return `${prefix}_${Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("")}`;
}

function analyticsVisitorId() {
  try {
    let id = localStorage.getItem(ANALYTICS_VISITOR_KEY);
    if (!id) {
      id = analyticsId("v");
      localStorage.setItem(ANALYTICS_VISITOR_KEY, id);
    }
    return id;
  } catch (_) {
    return "v_private";
  }
}

function analyticsSessionId() {
  try {
    const now = Date.now();
    const saved = JSON.parse(localStorage.getItem(ANALYTICS_SESSION_KEY) || "null");
    if (saved?.id && saved?.expires > now) {
      saved.expires = now + 30 * 60 * 1000;
      localStorage.setItem(ANALYTICS_SESSION_KEY, JSON.stringify(saved));
      return saved.id;
    }
    const next = { id: analyticsId("s"), expires: now + 30 * 60 * 1000 };
    localStorage.setItem(ANALYTICS_SESSION_KEY, JSON.stringify(next));
    return next.id;
  } catch (_) {
    return "s_private";
  }
}

function analyticsReadLocal() {
  try {
    return JSON.parse(localStorage.getItem(ANALYTICS_EVENTS_KEY) || "[]").filter(Boolean);
  } catch (_) {
    return [];
  }
}

function analyticsWriteLocal(events) {
  try {
    localStorage.setItem(ANALYTICS_EVENTS_KEY, JSON.stringify(events.slice(-ANALYTICS_MAX_LOCAL_EVENTS)));
  } catch (_) {}
}

function analyticsRangeStart(range = state.analyticsRange) {
  const days = range === "24h" ? 1 : range === "30d" ? 30 : 7;
  return Date.now() - days * 24 * 60 * 60 * 1000;
}

function analyticsFriendlyPath(path) {
  const clean = String(path || "/").split("?")[0].replace(/\/$/, "") || "/";
  if (clean === "/") return "/notes";
  return clean;
}

function analyticsTrack(type, details = {}) {
  if (!type) return;
  const now = new Date();
  const target = details.target || "";
  const event = {
    id: analyticsId("e"),
    type,
    path: analyticsFriendlyPath(details.path || window.location.pathname),
    title: details.title || document.title || "",
    target: String(target).replace(/\s+/g, " ").trim().slice(0, 120),
    href: details.href || "",
    visitorId: analyticsVisitorId(),
    sessionId: analyticsSessionId(),
    userId: state.currentUser?.id || "",
    userEmail: state.currentUser?.email || "",
    registered: !!state.currentUser,
    ts: now.toISOString(),
    userAgent: navigator.userAgent || ""
  };

  const localEvents = analyticsReadLocal();
  localEvents.push(event);
  analyticsWriteLocal(localEvents);

  const client = sb();
  if (client) {
    client.from("analytics_events").insert({
      event_type: event.type,
      path: event.path,
      page_title: event.title,
      target_text: event.target,
      target_href: event.href,
      visitor_id: event.visitorId,
      session_id: event.sessionId,
      user_id: event.userId || null,
      user_email: event.userEmail || null,
      is_registered: event.registered,
      user_agent: event.userAgent
    }).then(({ error }) => {
      if (error && !state.adminAnalytics.error) {
        state.adminAnalytics.error = "Analytics is using local data until the Supabase analytics migration is applied.";
      }
    }).catch(() => {});
  }
}

function analyticsTrackPageView() {
  const path = analyticsFriendlyPath(window.location.pathname);
  if (state.lastTrackedPage === path) return;
  state.lastTrackedPage = path;
  analyticsTrack("pageview", { path, title: document.title || "Nursing Uganda" });
}

function analyticsTrackClickFromEvent(event) {
  const target = event.target.closest("a[href], button, [role='button']");
  if (!target || target.closest(".adm-shell")) return;
  const text = target.getAttribute("aria-label") || target.textContent || target.title || target.tagName;
  analyticsTrack("click", {
    path: window.location.pathname,
    target: text,
    href: target.getAttribute("href") || target.dataset.nav || ""
  });
}

async function adminLoadAnalytics() {
  state.adminAnalytics.loading = true;
  const start = new Date(analyticsRangeStart()).toISOString();
  let events = analyticsReadLocal().filter((event) => Date.parse(event.ts) >= Date.parse(start));
  const client = sb();

  if (client) {
    try {
      const { data, error } = await client
        .from("analytics_events")
        .select("*")
        .gte("created_at", start)
        .order("created_at", { ascending: false })
        .limit(1200);
      if (error) throw error;
      if (data) {
        events = data.map((row) => ({
          id: row.id,
          type: row.event_type,
          path: row.path,
          title: row.page_title || "",
          target: row.target_text || "",
          href: row.target_href || "",
          visitorId: row.visitor_id,
          sessionId: row.session_id,
          userId: row.user_id || "",
          userEmail: row.user_email || "",
          registered: !!row.is_registered,
          ts: row.created_at
        }));
        state.adminAnalytics.error = "";
      }
    } catch (error) {
      state.adminAnalytics.error = "Showing local analytics only. Apply the Supabase analytics migration for site-wide reporting.";
    }
  }

  state.adminAnalytics = { ...state.adminAnalytics, events, loading: false, loaded: true };
}

function analyticsSummary(events = state.adminAnalytics.events || []) {
  const startMs = analyticsRangeStart();
  const scoped = events.filter((event) => Date.parse(event.ts) >= startMs);
  const pageviews = scoped.filter((event) => event.type === "pageview");
  const clicks = scoped.filter((event) => event.type === "click");
  const visitors = new Set(scoped.map((event) => event.visitorId).filter(Boolean));
  const sessions = new Set(scoped.map((event) => event.sessionId).filter(Boolean));
  const registeredVisitors = new Set(scoped.filter((event) => event.registered || event.userId).map((event) => event.userId || event.userEmail || event.visitorId));
  const topPages = analyticsTopList(pageviews, "path", 7);
  const topClicks = analyticsTopList(clicks, "target", 7);
  return { scoped, pageviews, clicks, visitors, sessions, registeredVisitors, topPages, topClicks };
}

function analyticsTopList(events, field, limit = 6) {
  const counts = new Map();
  events.forEach((event) => {
    const key = event[field] || (field === "target" ? "Unnamed click" : "/notes");
    counts.set(key, (counts.get(key) || 0) + 1);
  });
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([label, count]) => ({ label, count }));
}

function analyticsDailySeries(events) {
  const days = state.analyticsRange === "30d" ? 30 : state.analyticsRange === "24h" ? 1 : 7;
  const today = new Date();
  const buckets = [];
  for (let i = days - 1; i >= 0; i -= 1) {
    const day = new Date(today);
    day.setDate(today.getDate() - i);
    const key = day.toISOString().slice(0, 10);
    buckets.push({ key, label: day.toLocaleDateString("en-GB", { day: "numeric", month: "short" }), views: 0, clicks: 0 });
  }
  const byKey = new Map(buckets.map((bucket) => [bucket.key, bucket]));
  events.forEach((event) => {
    const bucket = byKey.get(String(event.ts || "").slice(0, 10));
    if (!bucket) return;
    if (event.type === "pageview") bucket.views += 1;
    if (event.type === "click") bucket.clicks += 1;
  });
  return buckets;
}

function renderUserAvatar(user, size) {
  const sz = size || 36;
  const c = (user && user.color) ? user.color : { bg: "#dcfce7", text: "#15803d" };
  const initials = (user && user.initials) ? user.initials : "?";
  return `<span class="user-avatar" style="width:${sz}px;height:${sz}px;background:${c.bg};color:${c.text};font-size:${Math.round(sz * 0.38)}px">${escapeHtml(initials)}</span>`;
}

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
  analyticsTrackPageView();
  scrollPageToTop();
}


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
  if (complete) { completed[key] = true; recordStudyDate(); }
  else delete completed[key];
  localStorage.setItem("nursinguganda.completedTopics", JSON.stringify(completed));
  scheduleProgressSync();
}

// ─── STUDY ACTIVITY TRACKING ──────────────────────────────────────────────
// Records today's date whenever the student does any study activity.
// Used by the dashboard heatmap. Keeps last 56 days.
function recordStudyDate() {
  const today = new Date().toISOString().slice(0, 10);
  try {
    const dates = new Set(JSON.parse(localStorage.getItem("nursinguganda.studyDates") || "[]"));
    if (!dates.has(today)) {
      dates.add(today);
      const sorted = [...dates].sort().slice(-56);
      localStorage.setItem("nursinguganda.studyDates", JSON.stringify(sorted));
    }
  } catch {}
}
function getStudyDates() {
  try { return new Set(JSON.parse(localStorage.getItem("nursinguganda.studyDates") || "[]")); }
  catch { return new Set(); }
}

// ─── QUIZ HISTORY ─────────────────────────────────────────────────────────
// Saves a scored quiz result at submission time (while _quizCtx is fresh).
function saveQuizResult(key) {
  if (!_quizCtx?.questions?.length) return;
  const attempt = quizAttempts()[key] || {};
  const questions = _quizCtx.questions;
  const score = questions.filter((q, i) => quizAnswerCorrect(q, attempt[i])).length;
  const total = questions.length;
  const pct   = total ? Math.round((score / total) * 100) : 0;
  const grade = pct >= 80 ? "Distinction" : pct >= 60 ? "Credit" : pct >= 50 ? "Pass" : "Below Pass";
  try {
    const history = JSON.parse(localStorage.getItem("nursinguganda.quizHistory") || "[]");
    const filtered = history.filter(h => h.key !== key);
    filtered.unshift({ key, title: _quizCtx.title || "Quiz", score, total, pct, grade, date: new Date().toISOString() });
    localStorage.setItem("nursinguganda.quizHistory", JSON.stringify(filtered.slice(0, 20)));
  } catch {}
}
function getQuizHistory() {
  try { return JSON.parse(localStorage.getItem("nursinguganda.quizHistory") || "[]"); }
  catch { return []; }
}

async function pushQuizScoreToLeaderboard(key) {
  const client = sb();
  const user = state.currentUser;
  if (!client || !user || !_quizCtx?.questions?.length) return;
  const attempt = quizAttempts()[key] || {};
  const questions = _quizCtx.questions;
  const score = questions.filter((q, i) => quizAnswerCorrect(q, attempt[i])).length;
  const total = questions.length;
  const pct = total ? Math.round((score / total) * 100) : 0;
  const grade = pct >= 80 ? "Distinction" : pct >= 60 ? "Credit" : pct >= 50 ? "Pass" : "Below Pass";
  try {
    await client.from("quiz_leaderboard").insert({
      user_id: user.id,
      user_name: user.name || user.email.split("@")[0],
      quiz_title: _quizCtx.title || "Quiz",
      quiz_key: key,
      score,
      total,
      pct,
      grade
    });
  } catch (_) {}
}

async function loadLeaderboard() {
  const client = sb();
  if (!client) return;
  try {
    const { data } = await client
      .from("quiz_leaderboard")
      .select("user_name, quiz_title, score, total, pct, grade, submitted_at")
      .gte("submitted_at", new Date(Date.now() - 7 * 86400000).toISOString())
      .order("pct", { ascending: false })
      .order("score", { ascending: false })
      .limit(10);
    state.leaderboard = data || [];
  } catch (_) {
    state.leaderboard = [];
  }
  render();
}

function getMilestoneBadges() {
  const completed = Object.keys(completedTopics()).length;
  const streak = getStreak();
  const best = Math.max(streak.count || 0, streak.best || 0);
  const quizzesTaken = Object.keys(quizSubmitted()).length;
  const mastered = flashcardMastery().size;
  const saved = bookmarks().length;
  return [
    { id: "first-lesson",   emoji: "📚", label: "First Step",      desc: "Complete your first lesson",  earned: completed >= 1   },
    { id: "ten-lessons",    emoji: "🎯", label: "On Track",         desc: "Complete 10 lessons",         earned: completed >= 10  },
    { id: "twenty-five",    emoji: "⭐", label: "25 Down",          desc: "Complete 25 lessons",         earned: completed >= 25  },
    { id: "fifty-lessons",  emoji: "🏅", label: "Half Century",     desc: "Complete 50 lessons",         earned: completed >= 50  },
    { id: "hundred",        emoji: "💯", label: "Century",          desc: "Complete 100 lessons",        earned: completed >= 100 },
    { id: "streak-3",       emoji: "🔥", label: "Warm Up",          desc: "3-day study streak",          earned: best >= 3        },
    { id: "streak-7",       emoji: "🔥", label: "On Fire",          desc: "7-day study streak",          earned: best >= 7        },
    { id: "streak-14",      emoji: "⚡", label: "Unstoppable",      desc: "14-day study streak",         earned: best >= 14       },
    { id: "streak-30",      emoji: "🌟", label: "Iron Will",        desc: "30-day study streak",         earned: best >= 30       },
    { id: "first-quiz",     emoji: "✏️", label: "Quiz Taker",      desc: "Submit your first quiz",      earned: quizzesTaken >= 1  },
    { id: "five-quizzes",   emoji: "📝", label: "Quiz Regular",     desc: "Submit 5 quizzes",            earned: quizzesTaken >= 5  },
    { id: "ten-quizzes",    emoji: "🎓", label: "Quiz Scholar",     desc: "Submit 10 quizzes",           earned: quizzesTaken >= 10 },
    { id: "fc-ten",         emoji: "🧠", label: "Brain Builder",    desc: "Master 10 flashcards",        earned: mastered >= 10   },
    { id: "fc-fifty",       emoji: "🧠", label: "Memory Pro",       desc: "Master 50 flashcards",        earned: mastered >= 50   },
    { id: "bookmarker",     emoji: "🔖", label: "Collector",        desc: "Save 5 bookmarks",            earned: saved >= 5       },
  ];
}

function renderMilestoneBadges() {
  const badges = getMilestoneBadges();
  const earned = badges.filter(b => b.earned);
  const locked = badges.filter(b => !b.earned);
  if (!badges.length) return "";
  return `
    <div class="section-head slim-head" style="margin-top:48px">
      <div>
        <h2>Achievement Badges</h2>
        <p>${earned.length} of ${badges.length} earned</p>
      </div>
    </div>
    <div class="milestone-badges-grid">
      ${[...earned, ...locked].map(b => `
        <div class="milestone-badge${b.earned ? " earned" : " locked"}" title="${escapeHtml(b.desc)}">
          <span class="milestone-badge-emoji">${b.earned ? b.emoji : "🔒"}</span>
          <span class="milestone-badge-label">${escapeHtml(b.label)}</span>
          <span class="milestone-badge-desc">${escapeHtml(b.desc)}</span>
        </div>
      `).join("")}
    </div>
  `;
}

function renderLeaderboard() {
  const rows = state.leaderboard;
  const gradeColor = g => g === "Distinction" ? "#059669" : g === "Credit" ? "#2563eb" : g === "Pass" ? "#d97706" : "#dc2626";
  const medals = ["🥇","🥈","🥉"];
  if (!rows) {
    return `
      <div class="section-head slim-head" style="margin-top:48px">
        <div><h2>${icon("send")} Weekly Leaderboard</h2><p>Top 10 quiz scores this week.</p></div>
      </div>
      <div class="leaderboard-loading">Loading leaderboard…</div>
    `;
  }
  if (!rows.length) {
    return `
      <div class="section-head slim-head" style="margin-top:48px">
        <div><h2>${icon("send")} Weekly Leaderboard</h2><p>Top 10 quiz scores this week.</p></div>
      </div>
      <div class="leaderboard-empty">
        <span>📋</span>
        <p>No quiz submissions this week. Be the first on the board!</p>
        ${buttonLink("/resources/quizzes", "Take a Quiz", "primary", "send")}
      </div>
    `;
  }
  return `
    <div class="section-head slim-head" style="margin-top:48px">
      <div><h2>${icon("send")} Weekly Leaderboard</h2><p>Top 10 quiz scores this week. Resets every Monday.</p></div>
    </div>
    <div class="leaderboard-table">
      ${rows.map((r, i) => `
        <div class="lb-row${i < 3 ? " lb-top" : ""}">
          <span class="lb-rank">${medals[i] || (i + 1)}</span>
          <div class="lb-info">
            <strong>${escapeHtml(r.user_name || "Anonymous")}</strong>
            <small>${escapeHtml(r.quiz_title || "Quiz")}</small>
          </div>
          <div class="lb-score-wrap">
            <div class="lb-bar-track"><span class="lb-bar-fill" style="width:${r.pct}%;background:${gradeColor(r.grade)}"></span></div>
            <span class="lb-pct" style="color:${gradeColor(r.grade)}">${r.pct}%</span>
            <span class="lb-grade-badge" style="background:${gradeColor(r.grade)}">${escapeHtml(r.grade)}</span>
          </div>
        </div>
      `).join("")}
    </div>
  `;
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
  scheduleProgressSync();
}

function quizSubmitted() {
  try {
    return JSON.parse(localStorage.getItem("nursinguganda.quizSubmitted") || "{}");
  } catch {
    return {};
  }
}

function submitQuiz(key) {
  const s = quizSubmitted();
  s[key] = true;
  localStorage.setItem("nursinguganda.quizSubmitted", JSON.stringify(s));
}

// ─── QUIZ EMAIL ───────────────────────────────────────────────────────────────
// Cache quiz context so submit handler can build the email payload
let _quizCtx = { title: "", subtitle: "", questions: [] };

// Build a plain-text mailto: link with the full quiz results.
// Used as fallback when the Edge Function is unavailable, and for non-logged-in users.
function buildQuizMailtoLink(quizKey) {
  const ctx = _quizCtx;
  const questions = ctx.questions || [];
  if (!questions.length) return null;
  const attempt = quizAttempts()[quizKey] || {};
  const score = questions.filter((q, i) => quizAnswerCorrect(q, attempt[i])).length;
  const total = questions.length;
  const pct = total ? Math.round((score / total) * 100) : 0;
  const grade = pct >= 80 ? "Distinction" : pct >= 60 ? "Credit" : pct >= 50 ? "Pass" : "Below Pass";
  const title = ctx.title || "Nursing Uganda Quiz";
  const subject = `Quiz Results – ${title} (${pct}% · ${grade})`;
  const qLines = questions.map((q, i) => {
    const ans = attempt[i];
    const correct = quizAnswerCorrect(q, ans);
    const selected = ans === undefined ? "Not answered" : (q.choices?.[Number(ans)] ?? String(ans));
    const correctLabel = q.choices?.[q.answer] ?? String(q.answer);
    let line = `${i + 1}. ${q.prompt}\n   ${correct ? "✓" : "✗"} Your answer: ${selected}`;
    if (!correct) line += `\n   ✓ Correct: ${correctLabel}`;
    if (q.explanation) line += `\n   Note: ${q.explanation}`;
    return line;
  });
  const body = [
    `Nursing Uganda – Quiz Results`,
    ``,
    `Quiz: ${title}`,
    `Score: ${score}/${total} (${pct}%): ${grade}`,
    ``,
    `──────────────────────────`,
    ...qLines,
    `──────────────────────────`,
    ``,
    `Study more at https://nursinguganda.com`
  ].join("\n");
  return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

// Returns { ok: true } on success, { ok: false, mailto: <link> } on failure.
async function sendQuizResultsEmail(quizKey) {
  const user = state.currentUser;
  const ctx = _quizCtx;
  const questions = ctx.questions || [];
  if (!questions.length) return { ok: false };

  const attempt = quizAttempts()[quizKey] || {};
  const score = questions.filter((q, i) => quizAnswerCorrect(q, attempt[i])).length;
  const total = questions.length;
  const pct   = total ? Math.round((score / total) * 100) : 0;
  const grade = pct >= 80 ? "Distinction" : pct >= 60 ? "Credit" : pct >= 50 ? "Pass" : "Below Pass";

  // Build per-question result objects (used by the Edge Function)
  const questionResults = questions.map((q, i) => {
    const ans = attempt[i];
    const correct = quizAnswerCorrect(q, ans);
    const selectedLabel = ans === undefined ? null : (q.choices?.[Number(ans)] ?? String(ans));
    const correctLabel = q.choices?.[q.answer] ?? String(q.answer);
    return { prompt: q.prompt || "", selectedLabel, correctLabel, correct, explanation: q.explanation || "" };
  });

  // Try Supabase Edge Function if user is logged in
  if (user?.email) {
    try {
      const ok = await callEdgeFunction("send-quiz-email", {
        email:     user.email,
        name:      user.name || "",
        quizTitle: ctx.title || "Nursing Uganda Quiz",
        score, total, pct, grade,
        questions: questionResults,
      });
      if (ok) return { ok: true };
      console.warn("[quiz] Edge function send-quiz-email returned non-2xx; falling back to mailto.");
    } catch (err) {
      console.error("[quiz] send-quiz-email dispatch error:", err instanceof Error ? err.message : String(err));
    }
  }

  // Fallback: generate mailto: link so user can send from their own email client
  const mailto = buildQuizMailtoLink(quizKey);
  return { ok: false, mailto };
}

function resetQuiz(key) {
  const attempts = quizAttempts();
  delete attempts[key];
  localStorage.setItem("nursinguganda.quizAttempts", JSON.stringify(attempts));
  const submitted = quizSubmitted();
  delete submitted[key];
  localStorage.setItem("nursinguganda.quizSubmitted", JSON.stringify(submitted));
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
  scheduleProgressSync();
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
    src: "assets/images/nursing-uganda-hero-nursing-student-skills-lab-01.webp",
    alt: "Nursing Uganda student studying in a clinical skills lab"
  },
  curriculum: {
    src: "assets/images/nursing-uganda-curriculum-study-group-01.webp",
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
    src: "assets/images/nursing-uganda-hero-nursing-student-skills-lab-01.webp",
    alt: "Nursing Uganda student studying in a clinical skills lab"
  },
  midwifery: {
    src: "assets/images/nursing-uganda-midwifery-newborn-care-training-01.webp",
    alt: "Midwifery students practising newborn care in a skills lab"
  },
  instruments: {
    src: "assets/images/nursing-uganda-medical-instruments-clinical-tray-01.webp",
    alt: "Nursing medical instruments arranged on a clean clinical tray"
  },
  disease: {
    src: "assets/images/nursing-uganda-disease-assessment-learning-01.webp",
    alt: "Nursing students learning disease assessment with anatomy references"
  },
  schools: {
    src: "assets/images/source-library/nursing-uganda-skill-lab-12-1-1-001-fae1e61b.jpg",
    alt: "Nursing skills laboratory for student training"
  },
  resourcesHero: {
    src: "assets/images/nursing-uganda-hero-nursing-student-skills-lab-01.webp",
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
  const cleanTitle = title === "Nursing Uganda"
    ? "Nursing & Midwifery Notes for Uganda Students | Nursing Uganda"
    : `${title} | Nursing Uganda`;
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
          <!-- Brand header -->
          <div class="cookie-brand-bar">
            <img src="/assets/images/nursing-uganda-icon-mark.webp" width="28" height="28" alt="" aria-hidden="true">
            <strong>Nursing Uganda</strong>
            <span class="cookie-brand-sep">·</span>
            <span>Privacy &amp; Consent</span>
          </div>
          <div class="cookie-consent-body">
            <div class="cookie-consent-text">
              <h2>We respect your privacy</h2>
              <p>Nursing Uganda stores only necessary site data by default. With your consent we may enable <strong>Google Analytics</strong>, <strong>Google AdSense</strong> and <strong>Amazon Associates</strong> affiliate tracking, all of which fund the free revision content available to nursing students.</p>
              <p class="cookie-small">You can change preferences any time via Cookie Preferences in the footer. Read our <a href="/privacy">Privacy Policy</a>, <a href="/cookies">Cookie Policy</a> and <a href="/disclaimer">Affiliate Disclaimer</a>.</p>
            </div>
            <div class="cookie-consent-actions">
              <button class="cookie-button primary" type="button" data-cookie-accept>${icon("badgeCheck")} Accept All</button>
              <button class="cookie-button ghost" type="button" data-cookie-manage>${icon("settings")} Manage</button>
              <button class="cookie-button text" type="button" data-cookie-reject>Reject</button>
            </div>
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
            <button type="button" class="cookie-close" data-cookie-close aria-label="Close">${icon("x")}</button>
          </div>
          <p>Choose which optional tools Nursing Uganda may load. Necessary storage always stays active. It keeps the site working and remembers your choices.</p>
          <div class="cookie-toggle-list">
            <label class="cookie-toggle-row necessary">
              <input type="checkbox" checked disabled>
              <span class="cookie-toggle-info">
                <strong>${icon("lock")} Necessary</strong>
                <small>Navigation, theme, bookmarks and consent record. Always active.</small>
              </span>
              <span class="cookie-toggle-badge always-on">Always on</span>
            </label>
            <label class="cookie-toggle-row">
              <input type="checkbox" data-cookie-pref="analytics"${checked("analytics")}>
              <span class="cookie-toggle-info">
                <strong>${icon("activity")} Google Analytics</strong>
                <small>Counts page views and usage patterns so we can improve revision content. Data is aggregated.</small>
              </span>
            </label>
            <label class="cookie-toggle-row">
              <input type="checkbox" data-cookie-pref="ads"${checked("ads")}>
              <span class="cookie-toggle-info">
                <strong>${icon("badgeCheck")} Google AdSense</strong>
                <small>Allows Google to serve and measure advertisements. Ad revenue funds free student resources.</small>
              </span>
            </label>
            <label class="cookie-toggle-row">
              <input type="checkbox" data-cookie-pref="affiliates"${checked("affiliates")}>
              <span class="cookie-toggle-info">
                <strong>${icon("externalLink")} Amazon Associates &amp; Affiliates</strong>
                <small>Allows referral cookies when you click disclosed affiliate links (books, courses, equipment).</small>
              </span>
            </label>
          </div>
          <div class="cookie-preferences-actions">
            <button class="cookie-button ghost" type="button" data-cookie-reject>Reject All</button>
            <button class="cookie-button primary" type="button" data-cookie-save>${icon("badgeCheck")} Save Preferences</button>
          </div>
          <p class="cookie-small" style="margin-top:10px">See <a href="/cookies">Cookie Policy</a> for full details on each tool, expiry and opt-out options.</p>
        </section>
      ` : ""}

    </div>
  `;
}

function renderFooter() {

  const exploreLinks = [
    ["/notes",                       "Notes",          "bookOpen"],
    ["/courses/curriculum",          "Courses",        "graduationCap"],
    ["/search",                      "Search",         "search"],
    ["/dictionary",                  "Dictionary",     "fileText"],
    ["/resources/medical-instruments","Instruments",   "stethoscope"],
    ["/resources/schools",           "Schools",        "school"],
    ["/resources/past-papers",       "Past Papers",    "clipboardList"],
    ["/careers",                     "Careers",        "briefcaseMedical"]
  ];
  const subjectLinks = [
    ["anatomy|physiology",           "Anatomy & Physiology", "activity"],
    ["medical|surgical",             "Medical Surgical",     "stethoscope"],
    ["midwifery|obstetric|newborn",  "Midwifery",            "heartPulse"],
    ["pharmacology|drug|medicine",   "Pharmacology",         "pill"],
    ["community|public health",      "Community Health",     "home"],
    ["mental|psychiatric",           "Mental Health",        "heartPulse"]
  ];
  const careerLinks = [
    ["/careers/cv-uganda",           "Uganda Nursing CV",    "fileCv"],
    ["/careers/cv-international",    "International CV",     "globe"],
    ["/careers/cover-letter",        "Cover Letters",        "mail"],
    ["/careers/interview-prep",      "Interview Prep",       "users"],
    ["/careers/portfolio",           "Portfolio Guide",      "clipboardList"],
    ["/careers/salary-guide",        "Salary Guide 2025",    "banknote"]
  ];

  return `
    <footer class="site-footer">
      <div class="container">

        <div class="footer-top">
          <div class="footer-brand">
            <a class="footer-logo" href="/notes" aria-label="Nursing Uganda home">
              <img src="/assets/images/nursing-uganda-logo-wordmark.webp" class="footer-logo-img" alt="Nursing Uganda: Notes &amp; Resources" width="220" height="87" loading="lazy" decoding="async">
            </a>
            <p class="footer-tagline">Structured notes, courses, dictionary and career resources for Uganda nursing and midwifery students, free and offline-ready.</p>
          </div>
          <div class="footer-cta-panel">
            <h3>Start studying</h3>
            <p>Jump into structured notes, test yourself with quizzes, or explore the full dictionary, all free, offline-ready.</p>
            <div class="footer-cta-actions">
              ${buttonLink("/notes", "Browse Notes", "primary", "bookOpen")}
              ${buttonLink("/resources/quizzes", "Take a Quiz", "secondary", "helpCircle")}
            </div>
          </div>
        </div>

        <div class="footer-divider"></div>

        <div class="footer-nav">
          <nav class="footer-nav-col" aria-label="Explore">
            <h4>Explore</h4>
            ${exploreLinks.map(([href, label, iconName]) => footerLink(href, label, iconName)).join("")}
          </nav>
          <nav class="footer-nav-col" aria-label="Subjects">
            <h4>Subjects</h4>
            ${subjectLinks.map(([seed, label, iconName]) => footerLink("/search", label, iconName, `data-search-seed="${escapeHtml(seed)}"`)).join("")}
          </nav>
          <nav class="footer-nav-col" aria-label="Career Resources">
            <h4>Career Resources</h4>
            ${careerLinks.map(([href, label, iconName]) => footerLink(href, label, iconName)).join("")}
          </nav>
          <nav class="footer-nav-col" aria-label="More">
            <h4>More</h4>
            ${footerLink("/resources/licensing",      "Licensing & CPD",   "badgeCheck")}
            ${footerLink("/resources/student-support","Student Support",    "heartPulse")}
            ${footerLink("/mock-exams",                "Mock Exams",        "clipboardList")}
            ${footerLink("/clinical-tools",           "Clinical Tools",    "stethoscope")}
            ${footerLink("/planner",                  "Study Planner",     "calendar")}
            ${footerLink("/community",                "Community Q&A",     "users")}
            ${footerLink("/progress",                 "My Progress",       "chartLine")}
            ${footerLink("/flashcards",               "Flashcards",        "bookOpen")}
            ${footerLink("/contact",                  "Contact Us",        "mail")}
            ${footerLink("/privacy",                  "Privacy Policy",    "shield")}
            ${footerLink("/corrections",              "Corrections",       "pencil")}
          </nav>
        </div>

        <!-- Affiliate & AdSense disclosure band -->
        <div class="footer-disclosure">
          <span class="footer-disclosure-item">
            ${icon("externalLink")}
            <span><strong>Affiliate links:</strong> Some resource and book links are Amazon Associates affiliate links. We may earn a commission at no extra cost to you.</span>
          </span>
          <span class="footer-disclosure-item">
            ${icon("badgeCheck")}
            <span><strong>Advertising:</strong> Ads are served by Google AdSense. Advertising does not influence clinical or editorial content.</span>
          </span>
          <span class="footer-disclosure-item">
            ${icon("shield")}
            <span><strong>Study reminder:</strong> Confirm clinical decisions with tutors, approved textbooks and current facility guidance.</span>
          </span>
        </div>

        <!-- Dark bottom bar -->
        <div class="footer-dark-bottom">
          <div class="footer-dark-left">
            <span>&copy; ${new Date().getFullYear()} Nursing Uganda. All rights reserved.</span>
            <span class="footer-dark-sep">·</span>
            <span>Built for Uganda nursing &amp; midwifery students</span>
          </div>
          <nav class="footer-dark-legal" aria-label="Legal pages">
            <a href="/privacy">Privacy</a>
            <a href="/cookies">Cookies</a>
            <a href="/privacy-choices">Consent</a>
            <a href="/terms">Terms</a>
            <a href="/disclaimer">Disclaimer</a>
            <a href="/corrections">Corrections</a>
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
      { href: "/courses/curriculum", label: "All Courses", body: "Browse every nursing and midwifery programme", icon: "graduationCap" },
      { href: "/courses/curriculum", label: "Curriculum Maps", body: "Move by programme, year and semester", icon: "listChecks" },
      ...programmes
    ];
  }

  if (key === "careers") {
    return [
      { href: "/careers",              label: "Career Hub",              body: "Pathways, licensing, CV tools and work-abroad guides", icon: "map" },
      { href: "/careers#international", label: "International Nursing",  body: "UK, Australia, Gulf and regional mobility notes", icon: "globe" },
      { href: "/careers#licensing",    label: "Licensing Guides",        body: "UNMC, good standing and recognition checklists", icon: "badgeCheck" },
      { href: "/careers/cv-uganda",      label: "Uganda Nursing CV",       body: "5 CV templates, hospital, NGO, new graduate and midwifery", icon: "fileCv" },
      { href: "/careers/cover-letter",  label: "Cover Letters",           body: "5 letter templates, hospital, NGO, international and internal", icon: "mail" },
      { href: "/careers/interview-prep",label: "Interview Prep",          body: "5 interview guides, general, ICU, international and leadership", icon: "users" }
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

function megaMenuHelper(key) {
  return key === "notes" ? "Choose focused notes by subject area"
    : key === "courses" ? "Open programmes, units and curriculum maps"
    : key === "careers" ? "Find roles, licensing and career support"
    : key === "dictionary" ? "Search clear nursing and medical definitions"
    : "Open study tools, papers and clinical references";
}

function renderMegaMenu(key, item, active) {
  const links = megaMenuLinks(key);
  const featured = links.slice(0, 2);
  const rest = links.slice(2);
  const isOpen = state.megaOpen === key;
  return `
    <div class="mega-item mega-${key}${isOpen ? " open" : ""}">
      <button type="button" class="mega-trigger${active === key ? " active" : ""}" data-mega-toggle="${key}" aria-expanded="${isOpen}">
        <span class="mega-nav-icon">${icon(item.icon)}</span><span>${escapeHtml(item.label)}</span>${icon("chevronDown")}
      </button>
      <div class="mega-panel" role="dialog" aria-label="${escapeHtml(item.label)} navigation">
        <div class="mega-panel-inner">
          <div class="mega-panel-sidebar">
            <span class="mega-sidebar-eyebrow">${escapeHtml(item.label)}</span>
            <p class="mega-sidebar-desc">${escapeHtml(megaMenuHelper(key))}</p>
            <a class="mega-sidebar-cta" href="${escapeHtml(item.href)}">${icon("arrowRight")}<span>View all</span></a>
            <div class="mega-sidebar-featured">
              ${featured.map((link) => `
                <a class="mega-feat-link" href="${escapeHtml(link.href)}"${link.extra ? ` ${link.extra}` : ""}>
                  <span class="mega-feat-icon">${icon(link.icon)}</span>
                  <div><strong>${escapeHtml(link.label)}</strong><small>${escapeHtml(link.body)}</small></div>
                </a>
              `).join("")}
            </div>
          </div>
          <div class="mega-panel-links">
            ${rest.map((link) => `
              <a class="mega-link" href="${escapeHtml(link.href)}"${link.extra ? ` ${link.extra}` : ""}>
                <span class="mega-icon">${icon(link.icon)}</span>
                <span><strong>${escapeHtml(link.label)}</strong><small>${escapeHtml(link.body)}</small></span>
              </a>
            `).join("")}
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderMainNav(active) {
  return Object.entries(routeMap).map(([key, item]) => renderMegaMenu(key, item, active)).join("");
}

function renderMobileDrawer(active) {
  return `
    <div class="mobile-drawer${state.navOpen ? " open" : ""}" id="mobile-drawer" role="dialog" aria-modal="true" aria-label="Navigation menu">
      <div class="drawer-header">
        <a class="brand drawer-brand" href="/notes" data-nav-close>
          <img src="assets/images/nursing-uganda-icon-mark.webp" class="brand-mark" alt="" aria-hidden="true" width="40" height="40">
          <div class="brand-text"><strong>Nursing Uganda</strong><small>Notes &amp; Resources</small></div>
        </a>
        <button class="drawer-close-btn" type="button" data-nav-toggle aria-label="Close menu">${icon("x")}</button>
      </div>
      <a class="drawer-search-bar" href="/search" data-nav-close>
        ${icon("search")}<span>Search lessons, courses, terms…</span>
      </a>
      <nav class="drawer-nav" aria-label="Main navigation">
        ${Object.entries(routeMap).map(([key, item]) => {
          const links = megaMenuLinks(key);
          const isOpen = state.megaOpen === key;
          return `
            <div class="drawer-section${isOpen ? " open" : ""}">
              <button type="button" class="drawer-section-btn${active === key ? " active" : ""}" data-mega-toggle="${escapeHtml(key)}" aria-expanded="${isOpen}">
                ${icon(item.icon)}<span>${escapeHtml(item.label)}</span>${icon("chevronDown")}
              </button>
              <div class="drawer-section-body">
                ${links.slice(0, 7).map((link) => `
                  <a class="drawer-link" href="${escapeHtml(link.href)}" data-nav-close${link.extra ? ` ${link.extra}` : ""}>
                    <span class="drawer-link-icon">${icon(link.icon)}</span>
                    <span class="drawer-link-text"><strong>${escapeHtml(link.label)}</strong><small>${escapeHtml(link.body)}</small></span>
                  </a>
                `).join("")}
                <a class="drawer-view-all" href="${escapeHtml(item.href)}" data-nav-close>${icon("arrowRight")}<span>All ${escapeHtml(item.label)}</span></a>
              </div>
            </div>
          `;
        }).join("")}
      </nav>
      <!-- Auth section. Sign in CTA or logged-in user card -->
      <div class="drawer-auth-section">
        ${state.currentUser ? `
          <a class="drawer-user-card" href="/account" data-nav-close>
            ${renderUserAvatar(state.currentUser, 38)}
            <div class="drawer-user-info">
              <strong>${escapeHtml(state.currentUser.name.split(" ")[0])}</strong>
              <small>${escapeHtml(state.currentUser.email)}</small>
            </div>
            ${icon("chevronRight")}
          </a>
        ` : `
          <a class="drawer-signin-btn" href="/login" data-nav-close>
            ${icon("users")}<span>Sign In</span>
          </a>
          <a class="drawer-signup-link" href="/login" data-nav-close>
            New here? <strong>Create a free account →</strong>
          </a>
        `}
      </div>

      <div class="drawer-footer">
        <a class="drawer-footer-link" href="/notes" data-nav-close>${icon("bookOpen")}<span>Notes</span></a>
        <a class="drawer-footer-link" href="/resources" data-nav-close>${icon("folderOpen")}<span>Resources</span></a>
        ${state.currentUser
          ? `<a class="drawer-footer-link drawer-footer-user" href="/account" data-nav-close>
               ${renderUserAvatar(state.currentUser, 22)}
               <span>${escapeHtml(state.currentUser.name.split(" ")[0])}</span>
             </a>`
          : `<a class="drawer-footer-link drawer-footer-signin" href="/login" data-nav-close>${icon("users")}<span>Sign In</span></a>`
        }
      </div>
    </div>
    <div class="nav-overlay${state.navOpen ? " open" : ""}" data-nav-overlay></div>
  `;
}

function renderLoginPromptModal() {
  if (!state.loginPrompt.open) return "";
  const featureIconMap = {
    quiz:        "send",
    bookmark:    "bookmark",
    pdf:         "printer",
    template:    "download",
    cv:          "fileCv",
    flashcard:   "star",
    "mock-exam": "clipboardList",
    community:   "users",
    planner:     "calendar"
  };
  const ic = featureIconMap[state.loginPrompt.feature] || "lock";
  return `
    <div class="login-prompt-overlay" role="presentation" data-lp-overlay>
      <div class="login-prompt-modal" role="dialog" aria-modal="true" aria-labelledby="lp-title">
        <button type="button" class="login-prompt-close-btn" data-lp-close aria-label="Close">${icon("x")}</button>
        <div class="login-prompt-icon-wrap">${icon(ic)}</div>
        <h2 id="lp-title" class="login-prompt-title">Sign in to continue</h2>
        <p class="login-prompt-msg">${escapeHtml(state.loginPrompt.message)}</p>
        <div class="login-prompt-actions">
          <a class="button primary login-prompt-btn" href="/login">${icon("user")} Sign In</a>
          <a class="button secondary login-prompt-btn" href="/login" data-lp-signup>${icon("sparkles")} Create Free Account</a>
        </div>
        <p class="login-prompt-note">Free account &mdash; no credit card needed.</p>
      </div>
    </div>
  `;
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
          <p>Search notes, open courses, or look up any term in the dictionary, all free and offline-ready.</p>
        </div>
        <div class="pre-footer-actions">
          ${buttonLink("/search", "Search Everything", "primary", "search")}
          ${buttonLink("/courses/curriculum", "Open Courses", "secondary", "graduationCap")}
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
    <div class="app-shell${parts[0] === "login" ? " app-shell--auth" : ""}">
      ${isAdmin() && state.maintenance?.mode ? `
        <div class="maint-admin-banner" id="maint-admin-banner">
          <span class="maint-banner-icon">${icon("alertTriangle")}</span>
          <span class="maint-banner-text"><strong>Maintenance mode is ACTIVE</strong>: regular users cannot access the site</span>
          <button class="maint-banner-off" data-maint-off>Turn Off Now</button>
        </div>` : ""}
      <header class="site-header">
        <div id="reading-progress-bar" role="progressbar" aria-hidden="true"></div>
        <div class="container nav-shell">
          <a class="brand" href="/notes" aria-label="Nursing Uganda notes home">
            <img src="/assets/images/nursing-uganda-icon-mark.webp" class="brand-mark" alt="" aria-hidden="true" width="40" height="40">
            <div class="brand-text">
              <strong>Nursing Uganda</strong>
              <small>Notes &amp; Resources</small>
            </div>
          </a>
          <nav class="main-nav" data-main-nav aria-label="Main navigation">
            ${renderMainNav(active)}
          </nav>
          <div class="nav-actions">
            <a class="nav-search-pill" href="/search" aria-label="Search notes">${icon("search")}<span>Search</span></a>
            <!-- Notification bell -->
            ${(function() {
              const unread = getUnreadAnnouncementCount();
              return `
                <div class="bell-wrap${state.bellOpen ? " open" : ""}">
                  <button type="button" class="bell-btn" data-bell-toggle aria-label="Notifications" aria-expanded="${state.bellOpen}">
                    ${icon("bell")}
                    ${unread > 0 ? `<span class="bell-badge">${unread > 9 ? "9+" : unread}</span>` : ""}
                  </button>
                  ${state.bellOpen ? renderBellDropdown() : ""}
                </div>
              `;
            })()}
            ${state.currentUser
              ? `<div class="user-menu-wrap${state.userMenuOpen ? " open" : ""}">
                  <button class="user-menu-trigger" type="button" data-user-menu-toggle aria-label="Account menu" aria-expanded="${state.userMenuOpen}">
                    ${renderUserAvatar(state.currentUser)}
                    ${icon("chevronDown")}
                  </button>
                  ${state.userMenuOpen ? `
                    <div class="user-menu-dropdown" role="menu">
                      <div class="user-menu-header">
                        ${renderUserAvatar(state.currentUser, 44)}
                        <div class="user-menu-info"><strong>${escapeHtml(state.currentUser.name)}</strong><small>${escapeHtml(state.currentUser.email)}</small></div>
                      </div>
                      <div class="user-menu-items">
                        <a class="user-menu-item" href="/progress"    role="menuitem" data-nav-close>${icon("chartLine")}<span>My Progress</span></a>
                        <a class="user-menu-item" href="/planner"     role="menuitem" data-nav-close>${icon("calendar")}<span>Study Planner</span></a>
                        <a class="user-menu-item" href="/community"   role="menuitem" data-nav-close>${icon("users")}<span>Community Q&amp;A</span></a>
                        <a class="user-menu-item" href="/flashcards"  role="menuitem" data-nav-close>${icon("sparkles")}<span>Flashcards</span></a>
                        <a class="user-menu-item" href="/settings"    role="menuitem" data-nav-close>${icon("tool")}<span>Settings</span></a>
                        <a class="user-menu-item" href="/account"     role="menuitem" data-nav-close>${icon("users")}<span>Account</span></a>
                        ${isAdmin() ? `<a class="user-menu-item user-menu-admin" href="/admin" role="menuitem" data-nav-close>${icon("tool")}<span>Admin Panel</span></a>` : ""}
                      </div>
                      <div class="user-menu-footer">
                        <button class="user-menu-item user-menu-logout" type="button" data-auth-logout>${icon("logOut")}<span>Sign Out</span></button>
                      </div>
                    </div>
                  ` : ""}
                </div>`
              : `<a class="button primary nav-login-btn" href="/login">${icon("users")}<span>Sign In</span></a>`
            }
            <button class="mobile-toggle" type="button" data-nav-toggle
              aria-label="${state.navOpen ? "Close menu" : "Open menu"}"
              aria-expanded="${state.navOpen}">
              <span class="toggle-bars">
                <span class="bar"></span>
                <span class="bar"></span>
                <span class="bar"></span>
              </span>
            </button>
          </div>
        </div>
      </header>
      ${renderMobileDrawer(active)}
      ${renderAnnouncementBanner()}
      <div class="page-main" id="page-main">
        ${content}
      </div>
      ${renderPreFooterBand()}
      ${renderFooter()}
      ${renderCookieConsent()}
      ${renderImageLightbox()}
      ${renderLoginPromptModal()}
    </div>
  `;

  // Desktop "Sign In" button: save intended destination before redirecting
  app.querySelectorAll(".nav-login-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const here = window.location.pathname;
      if (here !== "/login") { e.preventDefault(); state.loginIntended = here; setRoute("/login"); }
    });
  });

  app.querySelectorAll("[data-nav-toggle]").forEach((toggle) => {
    toggle.addEventListener("click", (event) => {
      event.stopPropagation();
      state.navOpen = !state.navOpen;
      if (!state.navOpen) state.megaOpen = "";
      render();
    });
  });


  // Close mobile drawer when clicking overlay or a nav-close link
  const overlay = app.querySelector("[data-nav-overlay]");
  if (overlay) {
    overlay.addEventListener("click", (event) => { event.stopPropagation(); state.navOpen = false; state.megaOpen = ""; render(); });
  }
  // data-nav-close: close drawer AND navigate if the element is an <a href="...">
  // We handle navigation explicitly so it works reliably on all mobile browsers, 
  // never rely solely on the document-level click delegation for drawer links.
  app.querySelectorAll("[data-nav-close]").forEach((el) => {
    el.addEventListener("click", (e) => {
      state.navOpen  = false;
      state.megaOpen = "";
      const a    = el.tagName === "A" ? el : el.closest("a[href]");
      const href = a ? a.getAttribute("href") : null;
      if (href && href.startsWith("/")) {
        e.preventDefault();
        e.stopImmediatePropagation(); // stop document global handler double-firing
        if (href !== window.location.pathname) {
          history.pushState(null, "", href);
        }
        render();
        scrollPageToTop();
      } else {
        render(); // just close drawer
      }
    });
  });

  app.querySelectorAll("[data-mega-toggle]").forEach((trigger) => {
    trigger.addEventListener("click", (event) => {
      const key = trigger.dataset.megaToggle || "";
      event.preventDefault();
      event.stopPropagation();
      state.megaOpen = state.megaOpen === key ? "" : key;
      render();
    });
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".main-nav") && !event.target.closest(".mobile-drawer") && state.megaOpen) {
      state.megaOpen = "";
      render();
    }
  }, { once: true });

  // User menu toggle
  const userMenuTrigger = app.querySelector("[data-user-menu-toggle]");
  if (userMenuTrigger) {
    userMenuTrigger.addEventListener("click", (e) => {
      e.stopPropagation();
      state.userMenuOpen = !state.userMenuOpen;
      render();
    });
  }
  // Close user menu on outside click
  if (state.userMenuOpen) {
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".user-menu-wrap")) {
        state.userMenuOpen = false;
        render();
      }
    }, { once: true });
  }
  // Logout button(s)
  app.querySelectorAll("[data-auth-logout]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      await authLogout();
      // Always redirect to home after logout: avoids user staying on
      // a protected page (/account, /progress, etc.) that would show an error
      setRoute("/notes");
    });
  });

  // Notification settings
  const notifCb = app.querySelector("[data-notif-enabled]");
  if (notifCb) {
    notifCb.addEventListener("change", async () => {
      const ns = getNotifSettings();
      if (notifCb.checked) {
        // Request permission first
        if ("Notification" in window && Notification.permission !== "granted") {
          const perm = await Notification.requestPermission();
          if (perm !== "granted") { notifCb.checked = false; showToast("Notification permission denied.", "error"); return; }
        }
        ns.reminderEnabled = true;
      } else {
        ns.reminderEnabled = false;
      }
      saveNotifSettings(ns);
      render();
    });
  }
  const notifTime = app.querySelector("[data-notif-time]");
  if (notifTime) {
    notifTime.addEventListener("change", () => {
      const ns = getNotifSettings();
      ns.reminderTime = notifTime.value;
      saveNotifSettings(ns);
    });
  }

  // Forgot password
  app.querySelectorAll("[data-forgot-password]").forEach(btn => {
    btn.addEventListener("click", async () => {
      const emailInput = app.querySelector("#auth-email");
      const email = emailInput?.value?.trim() || "";
      const result = await authForgotPassword(email);
      if (result.ok) {
        state.loginError = "";
        // Show a temporary success banner by re-rendering with a special message
        const errEl = app.querySelector(".login-error");
        const wrap = btn.closest(".login-form-card");
        if (wrap) {
          const msg = document.createElement("div");
          msg.className = "login-success";
          msg.innerHTML = `${icon("checkCircle")} Password reset email sent to <strong>${escapeHtml(email || "your email")}</strong>. Check your inbox.`;
          btn.closest(".login-forgot-wrap").before(msg);
          setTimeout(() => msg.remove(), 6000);
        }
      } else {
        state.loginError = result.error;
        render();
      }
    });
  });

  // Reset email-sent screen
  app.querySelectorAll("[data-reset-email-sent]").forEach(btn => {
    btn.addEventListener("click", () => {
      state.loginEmailSent = false;
      state.loginEmailAddress = "";
      state.loginTab = "signup";
      render();
    });
  });

  // Announcement banner dismiss
  app.querySelectorAll("[data-dismiss-ann]").forEach(btn => {
    btn.addEventListener("click", () => {
      const annId = btn.dataset.dismissAnn;
      try {
        const d = new Set(JSON.parse(localStorage.getItem("nursinguganda.dismissedAnns") || "[]"));
        d.add(annId);
        localStorage.setItem("nursinguganda.dismissedAnns", JSON.stringify([...d]));
      } catch (_) {}
      const banner = btn.closest(".ann-banner");
      if (banner) banner.remove();
    });
  });

  // ── Contact form ─────────────────────────────────────────────────────
  const contactFormEl = app.querySelector("#contact-form");
  if (contactFormEl) {
    // Keep form fields in sync with state so they survive re-renders
    contactFormEl.addEventListener("input", e => {
      const t = e.target;
      if (t.name) state.contactForm[t.name] = t.value;
    });

    contactFormEl.addEventListener("submit", async e => {
      e.preventDefault();
      const fd = new FormData(contactFormEl);
      state.contactForm = {
        ...state.contactForm,
        name: fd.get("name") || "",
        email: fd.get("email") || "",
        type: fd.get("type") || "general",
        subject: fd.get("subject") || "",
        message: fd.get("message") || "",
        loading: true,
        error: ""
      };
      render();

      try {
        const res = await fetch(`${SUPA_URL}/functions/v1/send-contact-email`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "apikey": SUPA_KEY },
          body: JSON.stringify({
            name:    state.contactForm.name,
            email:   state.contactForm.email,
            type:    state.contactForm.type,
            subject: state.contactForm.subject,
            message: state.contactForm.message
          })
        });
        const data = await res.json();
        if (!res.ok || data.error) throw new Error(data.error || "Failed to send. Try again.");
        state.contactForm = { ...state.contactForm, loading: false, sent: true, error: "" };
      } catch (err) {
        state.contactForm = { ...state.contactForm, loading: false, error: err.message || "Something went wrong. Please try again." };
      }
      render();
    });
  }

  // Contact form "Send Another" reset
  app.querySelectorAll("[data-contact-reset]").forEach(btn => {
    btn.addEventListener("click", () => {
      state.contactForm = { name: "", email: "", subject: "", message: "", type: "general", loading: false, sent: false, error: "" };
      render();
    });
  });

  // Quiz: email / share results button
  app.querySelectorAll("[data-email-quiz]").forEach(btn => {
    btn.addEventListener("click", async () => {
      btn.disabled = true;
      btn.innerHTML = `${icon("mail")}<span>Sending…</span>`;
      const result = await sendQuizResultsEmail(btn.dataset.emailQuiz);
      btn.disabled = false;
      if (result?.ok) {
        showToast(`Results emailed to ${state.currentUser?.email}`, "success");
        btn.innerHTML = `${icon("mail")}<span>Sent ✓</span>`;
      } else if (result?.mailto) {
        // Edge Function not available. Open the user's email client instead
        window.location.href = result.mailto;
        showToast("Opening your email app with results…", "info");
        btn.innerHTML = `${icon("mail")}<span>Open Email App</span>`;
      } else {
        showToast("Nothing to email. Complete a quiz first", "error");
        btn.innerHTML = `${icon("mail")}<span>Email Results</span>`;
      }
    });
  });

  // Study tip dismiss
  app.querySelectorAll("[data-dismiss-tip]").forEach(btn => {
    btn.addEventListener("click", () => {
      const tipId = btn.dataset.dismissTip;
      try {
        const d = new Set(JSON.parse(localStorage.getItem("nursinguganda.dismissedTips") || "[]"));
        d.add(tipId);
        localStorage.setItem("nursinguganda.dismissedTips", JSON.stringify([...d]));
      } catch (_) {}
      const card = btn.closest(".study-tip-card");
      if (card) card.closest("section")?.remove();
    });
  });

  // Admin panel tab switching
  app.querySelectorAll("[data-admin-tab]").forEach(btn => {
    btn.addEventListener("click", () => {
      state.adminTab = btn.dataset.adminTab;
      render();
    });
  });
  app.querySelectorAll("[data-analytics-range]").forEach(btn => {
    btn.addEventListener("click", async () => {
      state.analyticsRange = btn.dataset.analyticsRange || "7d";
      await adminLoadAnalytics();
      render();
    });
  });
  app.querySelector("[data-analytics-refresh]")?.addEventListener("click", async () => {
    await adminLoadAnalytics();
    render();
  });

  setupCookieConsentControls();
  setupLightboxControls();
  setupLessonTocActiveState();
  setupLessonRevealAnimations();
  hydrateAdSlots();
  setupReadingProgress();
  setupSwipeNavigation();
  setupLessonNotes();
  setupFlashcards();
  setupSettingsPage();
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

  // ── Login-prompt modal ──────────────────────────────────────────────────
  const lpOverlay = app.querySelector("[data-lp-overlay]");
  if (lpOverlay) {
    lpOverlay.addEventListener("click", (e) => {
      if (e.target === lpOverlay) { state.loginPrompt.open = false; render(); }
    });
  }
  const lpClose = app.querySelector("[data-lp-close]");
  if (lpClose) {
    lpClose.addEventListener("click", () => { state.loginPrompt.open = false; render(); });
  }
  const lpSignup = app.querySelector("[data-lp-signup]");
  if (lpSignup) {
    lpSignup.addEventListener("click", (e) => {
      e.preventDefault();
      state.loginPrompt.open = false;
      state.loginTab = "signup";
      state.loginIntended = window.location.pathname !== "/login" ? window.location.pathname : "/notes";
      setRoute("/login");
    });
  }

  // The primary "Sign In" button in the login prompt modal
  const lpSignin = app.querySelector(".login-prompt-btn:not([data-lp-signup])");
  if (lpSignin) {
    lpSignin.addEventListener("click", (e) => {
      e.preventDefault();
      state.loginPrompt.open = false;
      state.loginTab = "login";
      state.loginIntended = window.location.pathname !== "/login" ? window.location.pathname : "/notes";
      setRoute("/login");
    });
  }
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

// ── Legal page metadata (icon, accent, summary bullets, full sections) ────────
const LEGAL_META = {
  privacy:          { icon: "lock",          accent: "#A64468", accentLight: "#fce7f3" },
  cookies:          { icon: "badgeCheck",    accent: "#A64468", accentLight: "#fce7f3" },
  "privacy-choices":{ icon: "settings",      accent: "#A64468", accentLight: "#fce7f3" },
  disclaimer:       { icon: "alertTriangle", accent: "#A64468", accentLight: "#fce7f3" },
  terms:            { icon: "fileText",      accent: "#A64468", accentLight: "#fce7f3" },
  corrections:      { icon: "edit",          accent: "#A64468", accentLight: "#fce7f3" },
};

const legalPages = {
  privacy: {
    title: "Privacy Policy",
    eyebrow: "Privacy",
    updated: "June 1, 2026",
    intro: "This policy explains how Nursing Uganda collects, uses and protects personal data, and how advertising, analytics and affiliate tools are handled.",
    summary: ["We collect only minimal technical data", "Analytics and advertising require your consent", "We use Google AdSense and Amazon Affiliates", "You can withdraw consent at any time"],
    sections: [
      ["Who We Are", "Nursing Uganda is an educational revision website for nursing and midwifery learners in Uganda and East Africa. For privacy purposes, Nursing Uganda acts as the data controller for information collected through this site. Contact us at info@nursinguganda.com for privacy questions, data requests or content concerns."],
      ["What We Collect", "We may collect basic technical information: browser type, pages viewed, device details, approximate location, cookie choices and messages you send us. Google Analytics (when consented) collects aggregated usage data. Google AdSense and Amazon Associates may process additional signals to serve and measure advertisements and affiliate conversions."],
      ["How We Use Data", "We use data to keep the website running, remember your preferences, improve study resources, measure which pages and tools are most useful, prevent abuse, respond to messages and generate revenue through advertising and affiliate commissions that fund free content."],
      ["Advertising: Google AdSense", "Nursing Uganda uses or intends to use Google AdSense to display advertisements. Google and its partners may use cookies and device identifiers to serve personalised ads based on your interests and prior visits. You can opt out of personalised advertising at g.co/adsettings. AdSense loads only after advertising consent has been collected where required."],
      ["Affiliate Links: Amazon & Partners", "Nursing Uganda participates in or will participate in the Amazon Associates programme and similar affiliate schemes. When you click a disclosed affiliate link and make a qualifying purchase, we may earn a small commission at no extra cost to you. Affiliate status does not influence clinical content or editorial decisions. All affiliate links are labelled."],
      ["Learning Content", "Our content is gathered and rewritten from books, libraries, open educational sources, local PDFs, class materials and peer-to-peer revision inputs. It is for revision and study support only, not a replacement for formal student notes, official curriculum, clinical supervision or current professional guidelines."],
      ["Your Data Rights", "You may request access, correction, deletion or restriction of personal data you have provided to us, and may withdraw optional consent for analytics, advertising or affiliate tracking at any time via the Cookie Preferences link in the footer."],
      ["Retention And Security", "We retain contact messages and preference records only as long as reasonably needed for support, compliance and abuse prevention. We take appropriate technical precautions but cannot guarantee absolute security of data transmitted over the internet."],
      ["External Links", "The website may link to third-party resources, YouTube, job platforms, school pages, regulators and partner websites. We do not control their privacy practices, cookies or content."]
    ]
  },
  cookies: {
    title: "Cookie Policy",
    eyebrow: "Cookies",
    updated: "June 1, 2026",
    intro: "This page explains every type of cookie and storage Nursing Uganda uses, including those needed for Google AdSense and Amazon affiliate tracking.",
    summary: ["Necessary cookies always active", "Analytics & ad cookies need consent", "Amazon affiliate uses referral cookies", "Manage preferences in the footer"],
    sections: [
      ["Necessary Cookies", "Necessary storage supports basic navigation, theme preference, saved school view, bookmarks, service-worker offline caching and your consent record. These cannot be disabled as they are required for the website to function."],
      ["Analytics Cookies: Google Analytics", "When you consent to analytics, Google Analytics (GA4) places cookies (_ga, _gid and related) to count page views, session duration and popular content. Data is aggregated and anonymised. These cookies expire after 13 months. You can opt out at tools.google.com/dlpage/gaoptout."],
      ["Advertising Cookies: Google AdSense", "Google AdSense uses cookies and similar technologies (IDE, DSID, NID) to deliver, limit frequency and measure advertisements. When enabled, ads may be personalised based on your browsing history across Google partner sites. Advertising consent must be collected before these cookies activate for users in applicable regions."],
      ["Affiliate Tracking: Amazon Associates", "Nursing Uganda participates or will participate in the Amazon Associates programme. When you click an affiliate link, Amazon may set a cookie (session-id, ubid-acbus) to attribute your purchase to our referral. These cookies typically last 24 hours for the session attribution. We earn a commission if a qualifying purchase is completed."],
      ["Other Affiliate Partners", "Future affiliate schemes (e.g. medical book publishers, course platforms) may place referral cookies. All affiliate links are disclosed with an (Affiliate) or similar label, and any associated cookies are listed here when introduced."],
      ["Google CMP And TCF", "When serving personalised ads to users in the EEA, UK or Switzerland, Nursing Uganda will use a Google-certified Consent Management Platform (CMP) integrated with the IAB Transparency and Consent Framework v2.2. This ensures advertising partners receive a valid consent signal before processing personal data for ad targeting."],
      ["Managing Your Preferences", "Use the Cookie Preferences link in the footer to accept, reject or update optional cookie categories at any time. You can also clear cookies directly in your browser settings. Removing necessary cookies may affect site functionality."]
    ]
  },
  "privacy-choices": {
    title: "Privacy Choices",
    eyebrow: "Consent Centre",
    updated: "June 1, 2026",
    intro: "Review and change your optional tracking choices for analytics, advertising, Amazon affiliate measurement and similar partner tools.",
    summary: ["Analytics is optional", "Ad personalisation is optional", "Amazon affiliate tracking is optional", "Your choices are saved in your browser"],
    sections: [
      ["What You Always Control", "You can accept or reject optional analytics, advertising and affiliate tracking. Necessary storage remains active because it keeps the site working and remembers your consent choice. Your preferences are saved locally and apply on every visit."],
      ["Analytics Tracking", "Enabling analytics helps Nursing Uganda understand which notes, instruments, quizzes and resources students find most useful, so we can improve the content. Data is aggregated. We cannot identify you personally from analytics reports."],
      ["Google AdSense: Personalised Ads", "When you accept advertising consent, Google AdSense may serve personalised advertisements based on your interests and browsing history. If you reject this category, ads (if shown) will be non-personalised and based only on page context. You can also manage ad personalisation globally at g.co/adsettings."],
      ["Amazon Affiliate Measurement", "When you click an Amazon link and consent to affiliate tracking, Amazon Associates may use referral cookies to credit a purchase to Nursing Uganda. Rejecting this category means the affiliate attribution cookie is not set, but the link still works. You simply won't be attributed to our referral."],
      ["Other Partner Tracking", "As Nursing Uganda grows, other affiliate or sponsor tracking tools may be added. Each category will be listed here with its purpose and opt-out mechanism before it is enabled."],
      ["Do Not Sell Or Share", "Nursing Uganda does not sell personal information. If future advertising or partner systems create regional opt-out obligations under applicable privacy laws, this page is where those choices will be surfaced."],
      ["Withdrawing Consent", "You can withdraw consent at any time by opening Cookie Preferences from the footer. Withdrawal applies going forward and does not affect processing that occurred while consent was valid."]
    ]
  },
  disclaimer: {
    title: "Disclaimer",
    eyebrow: "Study Disclaimer",
    updated: "June 1, 2026",
    intro: "Nursing Uganda is a free revision and peer-learning resource for nursing and midwifery students. It is not a substitute for formal education, professional advice or clinical protocols.",
    summary: ["Not a replacement for formal notes", "Not professional or medical advice", "Content may contain errors", "Affiliate links may earn commission"],
    sections: [
      ["Educational Purpose Only", "Nursing Uganda exists to support revision, self-study and peer-to-peer learning. The notes, instruments, quizzes, flashcards, mock exams and summaries are designed to complement, not replace, school notes, lecturer handouts, approved textbooks, clinical manuals and the official curriculum used by your institution."],
      ["Not Professional Or Medical Advice", "Nothing on this website constitutes medical, nursing, midwifery, legal, licensing or employment advice. Clinical decisions must always be confirmed with tutors, supervisors, facility protocols, current national guidelines and qualified professionals before any patient care action is taken."],
      ["Sources And Accuracy", "Content is gathered from books, libraries, PDFs, open educational sources and student revision inputs, then rewritten for clarity and originality. We strive for accuracy but mistakes, outdated details, missing context or transcription errors may occur. Report concerns via the Corrections page."],
      ["Licensing And Regulatory Bodies", "Nursing Uganda is not affiliated with, endorsed by, or acting on behalf of the Uganda Nurses and Midwives Council, Ministry of Health, academic institutions or any regulatory body. We do not issue professional licences, school recognition, examination approval or registration status."],
      ["Advertising Disclaimer", "Advertisements displayed on this website are served by Google AdSense or similar networks. Advertising content is selected by the ad platform and does not represent an endorsement by Nursing Uganda. We are not responsible for the content, claims or accuracy of advertisements."],
      ["Affiliate Disclaimer", "Nursing Uganda participates in affiliate programmes including Amazon Associates. Pages or articles may contain affiliate links marked with (Affiliate) or a similar disclosure. When you purchase through these links, we may earn a commission at no additional cost to you. Affiliate relationships do not influence clinical or editorial content."],
      ["Availability", "The website may be temporarily unavailable due to maintenance, updates or technical issues. We do not guarantee uninterrupted access and are not liable for any loss arising from downtime."]
    ]
  },
  terms: {
    title: "Terms Of Use",
    eyebrow: "Terms",
    updated: "June 1, 2026",
    intro: "By accessing or using Nursing Uganda, you agree to use the website responsibly as a free revision and peer-learning resource.",
    summary: ["For personal revision only", "Not for clinical or professional use", "Affiliate & ad income funds content", "Email us for partnerships"],
    sections: [
      ["Acceptance Of Terms", "By using Nursing Uganda, you confirm that you have read, understood and agree to these Terms of Use along with our Privacy Policy, Cookie Policy and Disclaimer. If you do not agree, please do not use the website."],
      ["Permitted Educational Use", "You may use Nursing Uganda for personal study, revision, topic discovery and peer-to-peer learning. You may not reproduce, distribute, sell or publish substantial portions of the content without written permission. Brief quotations for study notes or academic discussion are permitted with attribution."],
      ["Responsible Study", "You agree to cross-check important clinical information with your formal notes, approved textbooks, tutors, clinical supervisors, facility policies and current national or institutional guidance before applying it in any professional or clinical context."],
      ["Content Ownership And Sources", "Nursing Uganda compiles, rewrites and organises learning material from public, educational and local reference sources. Rewritten content and original design belong to Nursing Uganda. Third-party materials (images, PDFs, videos, external links) remain subject to their respective owners' rights and licences."],
      ["Advertising Policy", "The website displays advertisements served by Google AdSense and potentially other networks. By using the site, you acknowledge that advertisements may appear alongside educational content. Ad revenue funds the free revision resources available to students. We do not endorse advertised products or services."],
      ["Affiliate Programme", "Nursing Uganda participates in affiliate programmes including the Amazon Associates Programme. Links marked (Affiliate) may earn Nursing Uganda a commission when you purchase through them. This income supports ongoing free content. Affiliate relationships do not influence editorial decisions or clinical recommendations."],
      ["External Links And Jobs", "Links to schools, regulators, YouTube, job boards, book libraries and other external websites are provided for convenience. Always verify applications, payments, deadlines and personal data requests directly with the official source. We are not responsible for external site content."],
      ["Partnerships And Sponsorship", "Businesses, publishers, medical suppliers or organisations interested in sponsoring content, advertising a course or placing a banner can contact us at info@nursinguganda.com. Sponsored content will always be clearly labelled."],
      ["Governing Law", "These terms are governed by and construed in accordance with the laws of Uganda. Any dispute arising from use of the website is subject to the jurisdiction of the courts of Uganda unless otherwise agreed in writing."],
      ["Contact", "For questions, corrections, takedown requests, partnership enquiries or licensing matters, email info@nursinguganda.com. We aim to respond within 5 working days."]
    ]
  },
  corrections: {
    title: "Corrections & Takedown",
    eyebrow: "Content Review",
    updated: "June 1, 2026",
    intro: "Help us maintain accurate, safe and respectful revision content by reporting errors, outdated information, copyright concerns or clinical safety issues.",
    summary: ["Report clinical errors promptly", "Include page URL and exact text", "Rights holders can request removal", "We review all reports"],
    sections: [
      ["What To Report", "Send corrections for inaccurate definitions, unsafe clinical wording, outdated guidance, missing source context, broken links, image concerns, copyright requests or content that appears too close to another publisher's material."],
      ["What To Include", "Please include the page URL, the lesson or instrument title, the exact sentence or image concerned, the suggested correction or source, and whether the issue is urgent for patient safety or examination accuracy. Clear, specific reports are processed faster."],
      ["Clinical Safety Priority", "Reports involving clinical safety: incorrect drug doses, wrong procedures, dangerous advice, are treated as high priority. We will review and act as quickly as possible. For immediate patient safety concerns, consult a qualified professional rather than waiting for our response."],
      ["Review Process", "We will compare the reported content with formal references where possible, edit or remove material when appropriate, and reposition all content as revision support rather than definitive clinical guidance. We do not always publish correction notes but will act on valid reports."],
      ["Advertising And Affiliate Corrections", "If you believe an advertisement or affiliate link displayed on the site is misleading, harmful or inappropriate, please report it with the page URL and a screenshot. For Google AdSense ads, you can also report them directly via the AdChoices icon on the ad."],
      ["Rights Holder Takedown Requests", "If you own rights in a text, PDF, image or other material and want it removed or credited differently, email info@nursinguganda.com with the page URL, a description of the material and your relationship to it. We will review within 10 working days."],
      ["Response Time", "We aim to acknowledge all reports within 3 working days and complete action within 10 working days for routine corrections. Urgent clinical safety reports are prioritised above other work."]
    ]
  }
};

function renderLegalPage(key) {
  const page = legalPages[key] || legalPages.privacy;
  const meta = LEGAL_META[key] || LEGAL_META.privacy;
  const legalNav = [
    ["/privacy",         "Privacy",         "lock"],
    ["/cookies",         "Cookies",          "badgeCheck"],
    ["/disclaimer",      "Disclaimer",       "alertTriangle"],
    ["/terms",           "Terms Of Use",     "fileText"],
    ["/corrections",     "Corrections",      "edit"],
  ];

  // Split sections for mid-ad placement (after section 3)
  const splitAt  = Math.min(3, page.sections.length);
  const firstHalf  = page.sections.slice(0, splitAt);
  const secondHalf = page.sections.slice(splitAt);

  function sectionCard([title, body], idx) {
    return `
      <article class="lp-card">
        <div class="lp-card-num" style="background:${meta.accentLight};color:${meta.accent}">${String(idx + 1).padStart(2, "0")}</div>
        <div class="lp-card-body">
          <h3>${escapeHtml(title)}</h3>
          <p>${escapeHtml(body)}</p>
        </div>
      </article>`;
  }

  return `
  <div class="legal-page-wrap">

    <!-- ── HERO ─────────────────────────────────────────────────────── -->
    <div class="lp-hero" style="--lp-accent:${meta.accent};--lp-accent-light:${meta.accentLight}">
      <div class="lp-hero-bg-icon" aria-hidden="true">${icon(meta.icon)}</div>
      <div class="container lp-hero-inner">
        <div class="lp-hero-content">
          <span class="lp-eyebrow">${icon(meta.icon)} ${escapeHtml(page.eyebrow)}</span>
          <h1>${escapeHtml(page.title)}</h1>
          <p>${escapeHtml(page.intro)}</p>
          <div class="lp-hero-chips">
            <span class="lp-chip">${icon("calendar")} Updated ${escapeHtml(page.updated)}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ── BODY ──────────────────────────────────────────────────────── -->
    <div class="container lp-body">

      <!-- SIDEBAR -->
      <aside class="lp-sidebar">

        <!-- Legal nav -->
        <nav class="lp-nav" aria-label="Legal pages">
          <p class="lp-nav-title">${icon("fileText")} Legal Pages</p>
          ${legalNav.map(([href, label, ico]) => `
            <a class="lp-nav-link${href === `/${key}` ? " active" : ""}" href="${href}" data-nav>
              <span class="lp-nav-icon">${icon(ico)}</span>
              <span>${escapeHtml(label)}</span>
              ${icon("arrowRight")}
            </a>`).join("")}
        </nav>

        <!-- Sidebar ad slot (300×250 rectangle) -->
        <div class="lp-ad-slot lp-ad-sidebar" id="lp-ad-sidebar-${escapeHtml(key)}">
          <span class="lp-ad-label">Advertisement</span>
          <!-- Google AdSense: insert ins.adsbygoogle here -->
          <div class="lp-ad-placeholder" style="width:280px;height:250px">
            <span>Ad</span>
          </div>
        </div>

        <!-- Quick summary -->
        ${page.summary ? `
        <div class="lp-summary-card">
          <p class="lp-summary-title">${icon("sparkles")} Key Points</p>
          <ul class="lp-summary-list">
            ${page.summary.map(s => `<li>${escapeHtml(s)}</li>`).join("")}
          </ul>
        </div>` : ""}

      </aside>

      <!-- MAIN -->
      <main class="lp-main">

        <!-- Top leaderboard ad slot (728×90) -->
        <div class="lp-ad-slot lp-ad-leaderboard" id="lp-ad-top-${escapeHtml(key)}">
          <span class="lp-ad-label">Advertisement</span>
          <!-- Google AdSense leaderboard: insert ins.adsbygoogle here -->
          <div class="lp-ad-placeholder" style="height:90px"><span>Ad</span></div>
        </div>

        <!-- Update badge -->
        <div class="lp-update-bar">
          <span>${icon("calendar")} Last updated: ${escapeHtml(page.updated)}</span>
          <span>${icon("fileText")} ${page.sections.length} sections</span>
        </div>

        <!-- First half of sections -->
        ${firstHalf.map(sectionCard).join("")}

        <!-- Mid-content inline ad -->
        ${secondHalf.length ? `
        <div class="lp-ad-slot lp-ad-inline" id="lp-ad-mid-${escapeHtml(key)}">
          <span class="lp-ad-label">Advertisement</span>
          <!-- Google AdSense in-article: insert ins.adsbygoogle here -->
          <div class="lp-ad-placeholder" style="height:90px"><span>Ad</span></div>
        </div>` : ""}

        <!-- Second half of sections -->
        ${secondHalf.map((s, i) => sectionCard(s, splitAt + i)).join("")}

        <!-- Action cards -->
        ${key === "privacy-choices" ? `
          <div class="lp-action-card" style="--lp-accent:${meta.accent}">
            <div class="lp-action-icon">${icon("settings")}</div>
            <div>
              <h3>Manage Your Tracking Choices</h3>
              <p>Open the consent centre to accept, reject or update analytics, advertising and affiliate measurement at any time.</p>
            </div>
            <button class="button primary" type="button" data-cookie-manage>${buttonLabel("Open Cookie Preferences", "badgeCheck")}</button>
          </div>` : ""}

        ${key === "corrections" ? `
          <div class="lp-action-card" style="--lp-accent:${meta.accent}">
            <div class="lp-action-icon">${icon("edit")}</div>
            <div>
              <h3>Submit A Correction</h3>
              <p>Include the page URL, the specific sentence or image, the suggested correction and any source reference. We review all reports.</p>
            </div>
            <a class="button primary" href="mailto:info@nursinguganda.com?subject=Nursing%20Uganda%20Content%20Correction">${buttonLabel("Email Correction", "mail")}</a>
          </div>` : ""}

        ${key === "terms" ? `
          <div class="lp-action-card lp-partner-card" style="--lp-accent:${meta.accent}">
            <div class="lp-action-icon">${icon("briefcaseMedical")}</div>
            <div>
              <h3>Partner, Sponsor or Advertise</h3>
              <p>Businesses, publishers, medical suppliers and course providers can reach thousands of nursing students. Get in touch to discuss sponsored content, banner advertising or affiliate partnerships.</p>
            </div>
            <a class="button primary" href="mailto:info@nursinguganda.com?subject=Partnership%20Enquiry">${buttonLabel("Get In Touch", "mail")}</a>
          </div>` : ""}

        <!-- Affiliate disclosure box -->
        <div class="lp-affiliate-box">
          <div class="lp-affiliate-icon">${icon("externalLink")}</div>
          <div>
            <strong>Affiliate Disclosure</strong>
            <p>Nursing Uganda is a participant in the Amazon Associates Programme and similar affiliate schemes. Pages may contain links marked <strong>(Affiliate)</strong>, if you purchase through these links, we may earn a small commission at no extra cost to you. Affiliate income helps fund free revision content for nursing and midwifery students.</p>
          </div>
        </div>

        <!-- Study reminder -->
        <div class="lp-study-note">
          <div class="lp-study-note-icon">${icon("alertTriangle")}</div>
          <div>
            <strong>Important Study Reminder</strong>
            <p>Nursing Uganda is for revision support and peer learning only. Always confirm clinical care, examination requirements, licensing and professional decisions using your formal school notes, approved textbooks and official regulatory sources.</p>
          </div>
        </div>

      </main>
    </div>
  </div>`;
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

function renderHomeSearch() {
  return `
    <form class="home-search-bar" data-global-search-form aria-label="Search notes">
      <label class="home-search-field">
        ${icon("search")}
        <input class="search-input" data-global-search type="search"
          value="${escapeHtml(state.globalSearch)}"
          placeholder="Search topics, course units, lesson text…"
          aria-label="Search all notes and courses"
          autocomplete="off">
        ${state.globalSearch ? `<button class="home-search-clear" type="button" data-search-clear-home aria-label="Clear search">${icon("x")}</button>` : ""}
      </label>
      <button class="button primary home-search-submit" type="submit">${buttonLabel("Search", "search")}</button>
    </form>
  `;
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
          <stop offset="0%" stop-color="#007b83" />
          <stop offset="50%" stop-color="#00B5BD" />
          <stop offset="100%" stop-color="#29C9D0" />
        </linearGradient>
      </defs>
      <circle cx="${size / 2}" cy="${size / 2}" r="${r}" />
      <circle cx="${size / 2}" cy="${size / 2}" r="${r}" style="stroke-dasharray:${circumference.toFixed(2)};stroke-dashoffset:${dashOffset.toFixed(2)}" />
    </svg>
  `;
}

// ── 404 Not Found ────────────────────────────────────────────────────────────
function render404Page() {
  const badPath = window.location.pathname;
  const quickLinks = [
    ["/notes",                        "Study Notes",       "bookOpen"],
    ["/courses/curriculum",           "Courses",           "graduationCap"],
    ["/resources/medical-instruments","Instruments",       "stethoscope"],
    ["/dictionary",                   "Dictionary",        "fileText"],
    ["/careers",                      "Careers",           "briefcaseMedical"],
    ["/search",                       "Search",            "search"],
  ];

  return layout(`
    <div class="page-404">

      <!-- Animated mark -->
      <div class="page-404-mark" aria-hidden="true">
        <div class="page-404-ring page-404-ring--outer"></div>
        <div class="page-404-ring page-404-ring--inner"></div>
        <div class="page-404-num">404</div>
      </div>

      <!-- Copy -->
      <div class="page-404-body">
        <span class="page-404-eyebrow">${icon("alertTriangle")} Page Not Found</span>
        <h1>We couldn't find that page</h1>
        <p>The address <code class="page-404-path">${escapeHtml(badPath)}</code> doesn't exist
           on Nursing Uganda. It may have moved, been renamed, or the link may be mistyped.</p>

        <!-- Quick links -->
        <div class="page-404-links">
          ${quickLinks.map(([href, label, ico]) => `
            <a class="page-404-link" href="${href}" data-nav>
              ${icon(ico)}<span>${escapeHtml(label)}</span>
            </a>`).join("")}
        </div>

        <!-- Go home CTA -->
        <div class="page-404-ctas">
          <a class="button primary" href="/notes" data-nav>${icon("home")} Back to Home</a>
          <a class="button secondary" href="/search" data-nav>${icon("search")} Search Notes</a>
        </div>
      </div>

    </div>
  `);
}

/* ── Login / Account Pages ───────────────────────────────────────── */
function renderLoginPage() {
  if (state.currentUser) {
    const u = state.currentUser;
    return `
      <div class="login-page-wrap">
        <div class="login-already-in">
          <div class="login-already-avatar">${renderUserAvatar(u, 72)}</div>
          <h1>Welcome back, ${escapeHtml(u.name.split(" ")[0])}!</h1>
          <p>You're signed in as <strong>${escapeHtml(u.email)}</strong></p>
          <div class="login-already-actions">
            <a class="button primary" href="/notes">Continue Studying</a>
            <a class="button secondary" href="/progress">My Progress</a>
          </div>
          <button class="login-signout-link" type="button" data-auth-logout>Sign out of this account</button>
        </div>
      </div>
    `;
  }

  // Email confirmation sent screen
  if (state.loginEmailSent) {
    return `
      <div class="login-page-wrap">
        <div class="login-already-in">
          <div class="login-already-avatar" style="font-size:2.5rem">📧</div>
          <h1>Check your email</h1>
          <p>We sent a confirmation link to <strong>${escapeHtml(state.loginEmailAddress)}</strong>.<br>Click the link in the email to activate your account.</p>
          <p style="color:var(--color-muted);font-size:.88rem;margin-top:8px">Didn't receive it? Check your spam folder, or <button type="button" class="login-link" data-login-tab="signup" data-reset-email-sent>try again with a different address</button>.</p>
        </div>
      </div>
    `;
  }

  const isSignup = state.loginTab === "signup";
  const err = state.loginError;

  return `
    <div class="login-page-wrap">
      <div class="login-brand-panel">
        <div class="login-slide-bg" aria-hidden="true">
          <img src="assets/images/nursing-uganda-login-panel-1.webp" class="login-slide login-slide-1" alt="" loading="eager">
          <img src="assets/images/nursing-uganda-login-panel-2.webp" class="login-slide login-slide-2" alt="" loading="lazy">
          <div class="login-slide-overlay"></div>
        </div>
        <a class="login-brand-logo" href="/notes" aria-label="Nursing Uganda home">
          <img src="assets/images/nursing-uganda-icon-mark.webp" class="login-brand-icon-mark" alt="" aria-hidden="true" width="34" height="34" loading="eager">
          <span class="login-brand-wordmark-text">Nursing Uganda</span>
        </a>
        <div class="login-brand-tagline">
          <h2>Study smarter.<br>Revise better.</h2>
          <p>Your complete revision companion for nursing &amp; midwifery students in Uganda.</p>
        </div>
      </div>

      <div class="login-form-panel">
        <div class="login-form-card">
          <a class="login-back-link" href="/notes">${icon("arrowLeft")}<span>Back to Nursing Uganda</span></a>
          <div class="login-form-brand">
            <img src="assets/images/nursing-uganda-icon-mark.webp" class="login-form-icon" alt="" aria-hidden="true" width="48" height="48">
          </div>
          <div class="login-form-header">
            <h1>${isSignup ? "Create your account" : "Welcome back"}</h1>
            <p>${isSignup ? "Join thousands of students revising smarter." : "Sign in to track your progress and saved notes."}</p>
          </div>

          <div class="login-tabs" role="tablist">
            <button type="button" class="login-tab${!isSignup ? " active" : ""}" data-login-tab="signin" role="tab" aria-selected="${!isSignup}">Sign In</button>
            <button type="button" class="login-tab${isSignup ? " active" : ""}" data-login-tab="signup" role="tab" aria-selected="${isSignup}">Create Account</button>
          </div>

          <form class="login-form" data-auth-form="${isSignup ? "signup" : "signin"}" novalidate>
            ${isSignup ? `
              <div class="login-field">
                <label for="auth-name">Full Name</label>
                <div class="login-input-wrap">
                  <span class="login-input-icon">${icon("users")}</span>
                  <input type="text" id="auth-name" name="name" placeholder="Your full name" autocomplete="name" required>
                </div>
              </div>
            ` : ""}

            <div class="login-field">
              <label for="auth-email">Email Address</label>
              <div class="login-input-wrap">
                <span class="login-input-icon">${icon("mail")}</span>
                <input type="email" id="auth-email" name="email" placeholder="you@example.com" autocomplete="email" required>
              </div>
            </div>

            <div class="login-field">
              <label for="auth-password">${isSignup ? "Create Password" : "Password"}</label>
              <div class="login-input-wrap">
                <span class="login-input-icon">${icon("lock")}</span>
                <input type="password" id="auth-password" name="password" placeholder="${isSignup ? "At least 6 characters" : "Your password"}" autocomplete="${isSignup ? "new-password" : "current-password"}" required>
                <button type="button" class="login-pw-toggle" data-pw-toggle aria-label="Toggle password visibility">${icon("eye")}</button>
              </div>
            </div>

            ${err ? `<div class="login-error" role="alert">${icon("alertTriangle")}${escapeHtml(err)}</div>` : ""}

            <button type="submit" class="button primary login-submit">${isSignup ? `${icon("userCheck")}<span>Create Account</span>` : `${icon("logOut")}<span>Sign In</span>`}</button>

            <div class="login-forgot-wrap">
              ${!isSignup
                ? `<button type="button" class="login-link" data-forgot-password>Forgot password?</button>
                   <span class="login-divider">·</span>
                   <button type="button" class="login-link" data-login-tab="signup">Create a free account</button>`
                : `<button type="button" class="login-link" data-login-tab="signin">Already have an account? Sign in</button>`}
            </div>
          </form>

          <p class="login-legal">By continuing you agree to our <a href="/privacy" class="login-legal-link">Privacy Policy</a>. Your account is securely stored in the cloud, access your progress from any device.</p>
        </div>
      </div>
    </div>
  `;
}

function renderAccountPage() {
  if (!state.currentUser) {
    return `
      <div class="login-page-wrap login-page-wrap--centered">
        <div class="login-already-in">
          <div class="login-already-avatar">${icon("lock")}</div>
          <h1>Sign in to view your account</h1>
          <p>You need to be signed in to access account settings.</p>
          <a class="button primary" href="/login">Sign In</a>
        </div>
      </div>
    `;
  }
  const u = state.currentUser;
  const mastered = Object.keys(masteredTopics() || {}).length;
  return `
    <div class="container account-page">
      <div class="account-page-header">
        <div class="account-avatar-wrap">${renderUserAvatar(u, 80)}</div>
        <div class="account-header-info">
          <h1>${escapeHtml(u.name)}</h1>
          <p class="account-email">${escapeHtml(u.email)}</p>
        </div>
      </div>

      <div class="account-stats-row">
        <div class="account-stat-card">
          <span class="account-stat-num">${mastered}</span>
          <span class="account-stat-label">Topics Mastered</span>
        </div>
        <div class="account-stat-card">
          <span class="account-stat-num">${updateStreak().current}</span>
          <span class="account-stat-label">Day Streak</span>
        </div>
      </div>

      <div class="account-section-card">
        <h2 class="account-section-title">Quick Links</h2>
        <div class="account-links-grid">
          <a class="account-link-item" href="/progress">${icon("chartLine")}<span>My Progress</span></a>
          <a class="account-link-item" href="/planner">${icon("calendar")}<span>Study Planner</span></a>
          <a class="account-link-item" href="/community">${icon("users")}<span>Community Q&amp;A</span></a>
          <a class="account-link-item" href="/flashcards">${icon("sparkles")}<span>Flashcards</span></a>
          <a class="account-link-item" href="/careers">${icon("briefcaseMedical")}<span>Careers</span></a>
          <a class="account-link-item" href="/notes">${icon("bookOpen")}<span>Study Notes</span></a>
        </div>
      </div>

      ${(function() {
        const ns = getNotifSettings();
        const supported = typeof window !== "undefined" && "Notification" in window;
        return `
          <div class="account-section-card">
            <h2 class="account-section-title">${icon("bell")} Study Reminders</h2>
            <p class="account-section-desc">Get a browser notification when you haven't studied by your chosen time each day.</p>
            ${!supported ? `<p class="account-notif-unsupported">Push notifications are not supported in this browser.</p>` : `
              <div class="account-notif-row">
                <label class="account-notif-toggle-label">
                  <input type="checkbox" class="account-notif-cb" data-notif-enabled ${ns.reminderEnabled ? "checked" : ""}>
                  <span>Enable daily study reminder</span>
                </label>
              </div>
              ${ns.reminderEnabled ? `
                <div class="account-notif-row">
                  <label class="account-notif-time-label">Remind me at</label>
                  <input type="time" class="account-notif-time" value="${ns.reminderTime || "20:00"}" data-notif-time>
                </div>
                <p class="account-notif-hint">You will only receive a reminder if you haven't studied that day.</p>
              ` : ""}
            `}
          </div>
        `;
      })()}

      <div class="account-section-card account-section-danger">
        <h2 class="account-section-title">Account</h2>
        <p class="account-section-desc">Signing out removes your session from this device. Your progress data stays saved locally.</p>
        <button class="button ghost account-logout-btn" type="button" data-auth-logout>${icon("logOut")}<span>Sign Out</span></button>
      </div>
    </div>
  `;
}

// ─── ADMIN PANEL ─────────────────────────────────────────────────────────────
function renderAdminAnalyticsTab() {
  const summary = analyticsSummary();
  const series = analyticsDailySeries(summary.scoped);
  const maxBar = Math.max(1, ...series.map((day) => day.views + day.clicks));
  const rangeLabel = state.analyticsRange === "24h" ? "Last 24 hours" : state.analyticsRange === "30d" ? "Last 30 days" : "Last 7 days";
  const activeUsers = new Set(
    summary.scoped
      .filter((event) => Date.now() - Date.parse(event.ts) < 15 * 60 * 1000)
      .map((event) => event.sessionId)
      .filter(Boolean)
  ).size;

  const statCards = [
    { label: "Visitors", value: summary.visitors.size, iconName: "users", hint: "Anonymous unique devices" },
    { label: "Unique Sessions", value: summary.sessions.size, iconName: "activity", hint: "30-minute visit windows" },
    { label: "Page Views", value: summary.pageviews.length, iconName: "eye", hint: "Lessons and pages opened" },
    { label: "Clicks", value: summary.clicks.length, iconName: "mousePointer", hint: "Buttons and links tapped" },
    { label: "Registered", value: summary.registeredVisitors.size || (state.adminUsers || []).length, iconName: "userCheck", hint: "Signed-in visitors / users" },
    { label: "Live Now", value: activeUsers, iconName: "zap", hint: "Active in last 15 minutes" }
  ];

  const renderTopList = (items, emptyLabel) => items.length ? items.map((item, index) => {
    const pct = Math.max(8, Math.round((item.count / Math.max(1, items[0].count)) * 100));
    return `
      <div class="adm-analytics-rank-row">
        <span class="adm-analytics-rank-index">${index + 1}</span>
        <div class="adm-analytics-rank-body">
          <strong>${escapeHtml(item.label)}</strong>
          <div class="adm-analytics-rank-bar"><span style="width:${pct}%"></span></div>
        </div>
        <b>${item.count}</b>
      </div>
    `;
  }).join("") : `<div class="adm-analytics-empty">${escapeHtml(emptyLabel)}</div>`;

  const recentEvents = summary.scoped
    .slice()
    .sort((a, b) => Date.parse(b.ts) - Date.parse(a.ts))
    .slice(0, 12);

  return `
    <div class="adm-analytics">
      <div class="adm-analytics-hero">
        <div>
          <span class="adm-analytics-kicker">${icon("chartLine")} Site intelligence</span>
          <h2>Analytics Overview</h2>
          <p>Track visitors, clicks, page views, registered activity and the pages students use most.</p>
        </div>
        <div class="adm-analytics-range" role="group" aria-label="Analytics date range">
          ${[
            ["24h", "24h"],
            ["7d", "7 days"],
            ["30d", "30 days"]
          ].map(([value, label]) => `<button type="button" class="${state.analyticsRange === value ? "active" : ""}" data-analytics-range="${value}">${label}</button>`).join("")}
        </div>
      </div>

      ${state.adminAnalytics.error ? `<div class="adm-analytics-notice">${icon("alertTriangle")}<span>${escapeHtml(state.adminAnalytics.error)}</span></div>` : ""}

      <div class="adm-analytics-stat-grid">
        ${statCards.map((card) => `
          <div class="adm-analytics-stat">
            <span>${icon(card.iconName)}</span>
            <strong>${card.value.toLocaleString("en-UG")}</strong>
            <small>${escapeHtml(card.label)}</small>
            <em>${escapeHtml(card.hint)}</em>
          </div>
        `).join("")}
      </div>

      <div class="adm-analytics-main-grid">
        <section class="adm-analytics-panel adm-analytics-panel-wide">
          <div class="adm-analytics-panel-head">
            <div><h3>Traffic Rhythm</h3><p>${rangeLabel}: views and clicks by day.</p></div>
            <button type="button" class="adm-mini-action" data-analytics-refresh>${icon("rotateCcw")} Refresh</button>
          </div>
          <div class="adm-analytics-bars">
            ${series.map((day) => {
              const viewsPct = Math.max(3, Math.round((day.views / maxBar) * 100));
              const clicksPct = Math.max(day.clicks ? 3 : 0, Math.round((day.clicks / maxBar) * 100));
              return `
                <div class="adm-analytics-bar-day" title="${escapeHtml(day.label)}: ${day.views} views, ${day.clicks} clicks">
                  <div class="adm-analytics-bar-stack">
                    <span class="views" style="height:${viewsPct}%"></span>
                    <span class="clicks" style="height:${clicksPct}%"></span>
                  </div>
                  <small>${escapeHtml(day.label)}</small>
                </div>
              `;
            }).join("")}
          </div>
          <div class="adm-analytics-legend"><span class="views"></span> Page views <span class="clicks"></span> Clicks</div>
        </section>

        <section class="adm-analytics-panel">
          <div class="adm-analytics-panel-head"><div><h3>Top Pages</h3><p>Most opened lessons and sections.</p></div></div>
          ${renderTopList(summary.topPages, "No page views tracked yet.")}
        </section>

        <section class="adm-analytics-panel">
          <div class="adm-analytics-panel-head"><div><h3>Top Clicks</h3><p>Buttons and links getting attention.</p></div></div>
          ${renderTopList(summary.topClicks, "No clicks tracked yet.")}
        </section>
      </div>

      <section class="adm-analytics-panel">
        <div class="adm-analytics-panel-head">
          <div><h3>Recent Activity</h3><p>Latest ${Math.min(recentEvents.length, 12)} events across the site.</p></div>
        </div>
        <div class="adm-analytics-events">
          ${recentEvents.length ? recentEvents.map((event) => `
            <div class="adm-analytics-event">
              <span class="adm-event-type ${event.type === "click" ? "click" : "view"}">${event.type === "click" ? icon("mousePointer") : icon("eye")}</span>
              <div>
                <strong>${event.type === "click" ? escapeHtml(event.target || "Click") : escapeHtml(event.path || "/notes")}</strong>
                <small>${escapeHtml(event.type === "click" ? event.path || "/notes" : event.title || "Page view")} &middot; ${new Date(event.ts).toLocaleString("en-UG", { dateStyle: "medium", timeStyle: "short" })}</small>
              </div>
              ${event.registered ? `<b class="adm-analytics-user">Registered</b>` : `<b class="adm-analytics-user muted">Visitor</b>`}
            </div>
          `).join("") : `<div class="adm-analytics-empty">Analytics will appear here after visitors open pages or click links.</div>`}
        </div>
      </section>
    </div>
  `;
}

function renderAdminMaintenanceTab() {
  const m = state.maintenance || { mode: false, message: "", eta: "" };
  return `
    <div class="adm-maint-wrap">

      <!-- Status hero card -->
      <div class="adm-maint-status ${m.mode ? "adm-maint-status--on" : "adm-maint-status--off"}">
        <div class="adm-maint-status-left">
          <div class="adm-maint-dot-wrap"><div class="adm-maint-dot"></div></div>
          <div class="adm-maint-status-text">
            <strong>${m.mode ? "Maintenance is ACTIVE" : "Site is Live"}</strong>
            <span>${m.mode ? "Regular users are seeing the maintenance page" : "All users can access the site normally"}</span>
          </div>
        </div>
        <label class="adm-maint-toggle" title="Toggle maintenance mode">
          <input type="checkbox" id="maint-toggle" ${m.mode ? "checked" : ""}>
          <span class="adm-maint-toggle-track"><span class="adm-maint-toggle-thumb"></span></span>
          <span class="adm-maint-toggle-label">${m.mode ? "ON" : "OFF"}</span>
        </label>
      </div>

      <!-- Config card -->
      <div class="adm-maint-config">
        <div class="adm-maint-config-row">
          <label class="adm-maint-label">${icon("messageSquare")} Message shown to users</label>
          <p class="adm-maint-hint">Leave blank to use the default message.</p>
          <textarea id="maint-message" class="adm-maint-textarea" rows="3"
            placeholder="e.g. We're upgrading our servers for a faster experience. Thank you for your patience.">${escapeHtml(m.message)}</textarea>
        </div>
        <div class="adm-maint-config-row">
          <label class="adm-maint-label">${icon("clock")} Estimated return time</label>
          <p class="adm-maint-hint">Optional: shown as a hint to users on the maintenance page.</p>
          <input id="maint-eta" type="text" class="adm-maint-input"
            value="${escapeHtml(m.eta)}"
            placeholder="e.g. Today at 6:00 PM EAT, or In about 30 minutes">
        </div>
        <div class="adm-maint-save-row">
          <button class="button primary" id="maint-save-btn">${icon("save")} Save Settings</button>
          <span class="adm-maint-save-note">Saving also applies the current toggle state.</span>
        </div>
      </div>

      ${m.mode ? `
      <!-- Active warning -->
      <div class="adm-maint-warn">
        <span class="adm-maint-warn-icon">${icon("alertTriangle")}</span>
        <div>
          <strong>The site is currently in maintenance mode</strong>
          <p>All non-admin visitors are seeing the maintenance page. Toggle it OFF or press "Save Settings" with the toggle disabled to restore access.</p>
        </div>
      </div>` : `
      <!-- Preview hint -->
      <div class="adm-maint-preview-hint">
        <span>${icon("eye")}</span>
        <p>When you turn maintenance mode ON, this is what regular users will see:</p>
      </div>
      <div class="adm-maint-preview">
        <div class="adm-maint-preview-mark">
          <img src="assets/images/nursing-uganda-icon-mark.webp" width="48" height="48" alt="">
        </div>
        <div class="adm-maint-preview-badge">${icon("wrench")} Scheduled Maintenance</div>
        <p class="adm-maint-preview-heading">We'll be back soon</p>
        <p class="adm-maint-preview-msg">${escapeHtml(m.message || "We're performing scheduled maintenance to improve your experience.")}</p>
        ${m.eta ? `<p class="adm-maint-preview-eta">${icon("clock")} ${escapeHtml(m.eta)}</p>` : ""}
      </div>`}
    </div>
  `;
}

function renderAdminPage() {
  if (!isAdmin()) {
    return layout(`
      <section class="section">
        <div class="container" style="text-align:center;padding:4rem 1rem">
          ${icon("lock")}
          <h1 style="margin:.75rem 0 .5rem">Admin Only</h1>
          <p style="color:#6b7280">You need admin access to view this page.</p>
          <a class="button primary" href="/notes">Go Home</a>
        </div>
      </section>
    `);
  }

  const anns  = state.adminAnnouncements || [];
  const tab   = state.adminTab || "analytics";
  const aForm = state.adminAnnForm || { open: false, data: {} };

  const typeColors = { info: "#3b82f6", warning: "#f59e0b", success: "#22c55e" };

  // ── Announcement form modal ─────────────────────────────────────────
  const annFormHtml = aForm.open ? `
    <div class="adm-modal-overlay" id="adm-ann-modal">
      <div class="adm-modal adm-modal-sm">
        <div class="adm-modal-hdr">
          <h3>${aForm.data.id ? "Edit Announcement" : "New Announcement"}</h3>
          <button type="button" class="adm-modal-close" data-adm-ann-form-close>${icon("x")}</button>
        </div>
        <form class="adm-form" id="adm-ann-form" autocomplete="off">
          <div class="adm-form-row">
            <label>Message *</label>
            <textarea name="message" rows="3" required placeholder="Announcement text shown to all users...">${escapeHtml(aForm.data.message || "")}</textarea>
          </div>
          <div class="adm-form-row">
            <label>Type</label>
            <select name="type">
              ${["info","warning","success"].map(t => `<option value="${t}"${aForm.data.type === t ? " selected" : ""}>${t.charAt(0).toUpperCase() + t.slice(1)}</option>`).join("")}
            </select>
          </div>
          <div class="adm-form-2col">
            <div class="adm-form-row">
              <label>Link Text</label>
              <input name="link_text" value="${escapeHtml(aForm.data.link_text || "")}" placeholder="e.g. Learn more">
            </div>
            <div class="adm-form-row">
              <label>Link URL</label>
              <input name="link_url" value="${escapeHtml(aForm.data.link_url || "")}" placeholder="https://...">
            </div>
          </div>
          <div class="adm-form-actions">
            <button type="button" class="button ghost" data-adm-ann-form-close>Cancel</button>
            <button type="submit" class="button primary">${icon("send")} ${aForm.data.id ? "Save Changes" : "Publish"}</button>
          </div>
        </form>
      </div>
    </div>` : "";

  const tips     = state.adminTips || [];
  const events   = state.adminEvents || [];
  const resources= state.adminResources || [];
  const users    = state.adminUsers || [];
  const tForm    = state.adminTipForm || { open: false, data: {} };
  const evForm   = state.adminEventForm || { open: false, data: {} };
  const resForm  = state.adminResourceForm || { open: false, data: {} };

  // ── Tip form modal ───────────────────────────────────────────────────
  const tipFormHtml = tForm.open ? `
    <div class="adm-modal-overlay">
      <div class="adm-modal adm-modal-sm">
        <div class="adm-modal-hdr">
          <h3>${tForm.data.id ? "Edit Tip" : "New Study Tip"}</h3>
          <button type="button" class="adm-modal-close" data-adm-tip-form-close>${icon("x")}</button>
        </div>
        <form class="adm-form" id="adm-tip-form">
          <div class="adm-form-2col">
            <div class="adm-form-row" style="flex:0 0 70px">
              <label>Emoji</label>
              <input name="emoji" value="${escapeHtml(tForm.data.emoji || "💡")}" maxlength="4" style="font-size:1.4rem;text-align:center">
            </div>
            <div class="adm-form-row" style="flex:1">
              <label>Message *</label>
              <textarea name="message" rows="3" required placeholder="Short actionable tip for students...">${escapeHtml(tForm.data.message || "")}</textarea>
            </div>
          </div>
          <div class="adm-form-actions">
            <button type="button" class="button ghost" data-adm-tip-form-close>Cancel</button>
            <button type="submit" class="button primary">${icon("send")} ${tForm.data.id ? "Save" : "Publish"}</button>
          </div>
        </form>
      </div>
    </div>` : "";

  // ── Event form modal ─────────────────────────────────────────────────
  const eventFormHtml = evForm.open ? `
    <div class="adm-modal-overlay">
      <div class="adm-modal">
        <div class="adm-modal-hdr">
          <h3>${evForm.data.id ? "Edit Event" : "New Event"}</h3>
          <button type="button" class="adm-modal-close" data-adm-event-form-close>${icon("x")}</button>
        </div>
        <form class="adm-form" id="adm-event-form">
          <div class="adm-form-row">
            <label>Event Title *</label>
            <input name="title" required value="${escapeHtml(evForm.data.title || "")}" placeholder="e.g. UNMC Registration Webinar">
          </div>
          <div class="adm-form-row">
            <label>Description</label>
            <textarea name="description" rows="2" placeholder="Brief overview...">${escapeHtml(evForm.data.description || "")}</textarea>
          </div>
          <div class="adm-form-2col">
            <div class="adm-form-row">
              <label>Date *</label>
              <input type="date" name="event_date" required value="${escapeHtml(evForm.data.event_date || "")}">
            </div>
            <div class="adm-form-row">
              <label>Time</label>
              <input type="time" name="event_time" value="${escapeHtml(evForm.data.event_time || "")}">
            </div>
          </div>
          <div class="adm-form-row">
            <label>Location</label>
            <input name="location" value="${escapeHtml(evForm.data.location || "")}" placeholder="e.g. Zoom / Mulago Hospital">
          </div>
          <div class="adm-form-2col">
            <div class="adm-form-row">
              <label>Link Text</label>
              <input name="link_text" value="${escapeHtml(evForm.data.link_text || "")}" placeholder="Register">
            </div>
            <div class="adm-form-row">
              <label>Link URL</label>
              <input type="url" name="link_url" value="${escapeHtml(evForm.data.link_url || "")}" placeholder="https://...">
            </div>
          </div>
          <div class="adm-form-actions">
            <button type="button" class="button ghost" data-adm-event-form-close>Cancel</button>
            <button type="submit" class="button primary">${icon("send")} ${evForm.data.id ? "Save" : "Publish"}</button>
          </div>
        </form>
      </div>
    </div>` : "";

  // ── Resource download form modal ─────────────────────────────────────
  const resFormHtml = resForm.open ? `
    <div class="adm-modal-overlay">
      <div class="adm-modal adm-modal-sm">
        <div class="adm-modal-hdr">
          <h3>${resForm.data.id ? "Edit Download" : "New Download"}</h3>
          <button type="button" class="adm-modal-close" data-adm-res-form-close>${icon("x")}</button>
        </div>
        <form class="adm-form" id="adm-res-form">
          <div class="adm-form-row">
            <label>Title *</label>
            <input name="title" required value="${escapeHtml(resForm.data.title || "")}" placeholder="e.g. Certificate Nursing Anatomy Notes">
          </div>
          <div class="adm-form-row">
            <label>Description</label>
            <textarea name="description" rows="2" placeholder="What's in this download?">${escapeHtml(resForm.data.description || "")}</textarea>
          </div>
          <div class="adm-form-2col">
            <div class="adm-form-row">
              <label>Category</label>
              <select name="category">
                ${["Study Notes","Past Papers","Checklists","Templates","Guidelines","Other"].map(c => `<option${resForm.data.category === c ? " selected" : ""}>${c}</option>`).join("")}
              </select>
            </div>
            <div class="adm-form-row">
              <label>File URL</label>
              <input type="url" name="file_url" value="${escapeHtml(resForm.data.file_url || "")}" placeholder="https://...">
            </div>
          </div>
          <div class="adm-form-actions">
            <button type="button" class="button ghost" data-adm-res-form-close>Cancel</button>
            <button type="submit" class="button primary">${icon("send")} ${resForm.data.id ? "Save" : "Publish"}</button>
          </div>
        </form>
      </div>
    </div>` : "";

  // ── Page content ────────────────────────────────────────────────────
  const addBtnMap = {
    analytics: "",
    announcements: `<button class="button primary" type="button" data-adm-ann-new>${icon("bell")} Add Announcement</button>`,
    tips: `<button class="button primary" type="button" data-adm-tip-new>${icon("lightbulb")} Add Tip</button>`,
    events: `<button class="button primary" type="button" data-adm-event-new>${icon("calendar")} Add Event</button>`,
    resources: `<button class="button primary" type="button" data-adm-res-new>${icon("download")} Add Download</button>`,
    users: ""
  };
  const adminNavItems = [
    { key: "analytics", label: "Analytics", iconName: "chartLine", badge: (state.adminAnalytics.events || []).length },
    { key: "announcements", label: "Banners", iconName: "bell", badge: anns.length },
    { key: "tips", label: "Tips", iconName: "lightbulb", badge: tips.length },
    { key: "events", label: "Events", iconName: "calendar", badge: events.length },
    { key: "resources", label: "Downloads", iconName: "download", badge: resources.length },
    { key: "users", label: "Users", iconName: "users", badge: users.length },
    { key: "maintenance", label: "Maintenance", iconName: "wrench", badge: state.maintenance?.mode ? "ON" : "", danger: !!state.maintenance?.mode }
  ];

  const pageContent = `
    <section class="section adm-section">
      <div class="container adm-container">
        <div class="adm-header">
          <div>
            <h1 class="adm-title">${icon("tool")} Admin Panel</h1>
            <p class="adm-subtitle">Monitor analytics and manage content, users, resources and site controls.</p>
          </div>
          ${addBtnMap[tab] || ""}
        </div>

        <div class="adm-shell">
          <aside class="adm-sidebar" aria-label="Admin navigation">
            <div class="adm-sidebar-card">
              <span class="adm-sidebar-label">Workspace</span>
              <strong>Nursing Uganda</strong>
              <small>${state.currentUser?.email ? escapeHtml(state.currentUser.email) : "Administrator"}</small>
            </div>
            <nav class="adm-sidebar-nav">
              ${adminNavItems.map((item) => `
                <button type="button" class="adm-side-link${tab === item.key ? " active" : ""}${item.danger ? " danger" : ""}" data-admin-tab="${item.key}">
                  <span>${icon(item.iconName)} ${escapeHtml(item.label)}</span>
                  ${item.badge !== "" ? `<b>${escapeHtml(item.badge)}</b>` : ""}
                </button>
              `).join("")}
            </nav>
          </aside>
          <div class="adm-content">

        ${tab === "analytics" ? renderAdminAnalyticsTab() : ""}

        ${tab === "announcements" ? `
          <div class="adm-table-wrap">
            ${anns.length === 0 ? `<div class="adm-empty">${icon("bell")}<p>No announcements yet. Click <strong>Add Announcement</strong> to post one.</p></div>` : `
            <table class="adm-table">
              <thead>
                <tr>
                  <th>Message</th>
                  <th>Type</th>
                  <th>Link</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                ${anns.map(a => `
                  <tr class="${a.is_active ? "" : "adm-row-inactive"}">
                    <td><p class="adm-ann-msg">${escapeHtml(a.message || "")}</p></td>
                    <td><span class="adm-chip" style="background:${typeColors[a.type] || "#3b82f6"}22;color:${typeColors[a.type] || "#3b82f6"}">${escapeHtml(a.type || "info")}</span></td>
                    <td>${a.link_url ? `<a href="${escapeHtml(a.link_url)}" target="_blank" rel="noopener" class="adm-link">${escapeHtml(a.link_text || "Link")}</a>` : ", "}</td>
                    <td><span class="adm-status ${a.is_active ? "adm-status-on" : "adm-status-off"}">${a.is_active ? "Active" : "Hidden"}</span></td>
                    <td class="adm-actions">
                      <button class="adm-btn-icon" title="Edit" data-adm-ann-edit="${escapeHtml(a.id)}">${icon("pencil")}</button>
                      <button class="adm-btn-icon" title="${a.is_active ? "Hide" : "Show"}" data-adm-ann-toggle="${escapeHtml(a.id)}" data-adm-ann-active="${a.is_active}">${a.is_active ? icon("eyeOff") : icon("eye")}</button>
                      <button class="adm-btn-icon adm-btn-danger" title="Delete" data-adm-ann-delete="${escapeHtml(a.id)}">${icon("x")}</button>
                    </td>
                  </tr>
                `).join("")}
              </tbody>
            </table>`}
          </div>
        ` : ""}

        ${tab === "tips" ? `
          <div class="adm-table-wrap">
            ${tips.length === 0 ? `<div class="adm-empty">${icon("lightbulb")}<p>No tips yet. Click <strong>Add Tip</strong> to create one.</p></div>` : `
            <table class="adm-table">
              <thead><tr><th>Emoji</th><th>Message</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                ${tips.map(t => `
                  <tr class="${t.is_active ? "" : "adm-row-inactive"}">
                    <td style="font-size:1.5rem;text-align:center">${escapeHtml(t.emoji || "💡")}</td>
                    <td><p class="adm-ann-msg">${escapeHtml(t.message || "")}</p></td>
                    <td><span class="adm-status ${t.is_active ? "adm-status-on" : "adm-status-off"}">${t.is_active ? "Active" : "Hidden"}</span></td>
                    <td class="adm-actions">
                      <button class="adm-btn-icon" title="Edit" data-adm-tip-edit="${escapeHtml(t.id)}">${icon("pencil")}</button>
                      <button class="adm-btn-icon" title="${t.is_active ? "Hide" : "Show"}" data-adm-tip-toggle="${escapeHtml(t.id)}" data-adm-tip-active="${t.is_active}">${t.is_active ? icon("eyeOff") : icon("eye")}</button>
                      <button class="adm-btn-icon adm-btn-danger" title="Delete" data-adm-tip-delete="${escapeHtml(t.id)}">${icon("x")}</button>
                    </td>
                  </tr>
                `).join("")}
              </tbody>
            </table>`}
          </div>
        ` : ""}

        ${tab === "events" ? `
          <div class="adm-table-wrap">
            ${events.length === 0 ? `<div class="adm-empty">${icon("calendar")}<p>No events yet. Click <strong>Add Event</strong> to create one.</p></div>` : `
            <table class="adm-table">
              <thead><tr><th>Title</th><th>Date</th><th>Location</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                ${events.map(e => `
                  <tr class="${e.is_active ? "" : "adm-row-inactive"}">
                    <td><strong class="adm-job-title">${escapeHtml(e.title)}</strong>${e.description ? `<small>${escapeHtml(e.description.slice(0,80))}${e.description.length > 80 ? "…" : ""}</small>` : ""}</td>
                    <td><span class="adm-deadline">${escapeHtml(e.event_date || ", ")}${e.event_time ? ` ${escapeHtml(e.event_time)}` : ""}</span></td>
                    <td>${e.location ? escapeHtml(e.location) : ", "}</td>
                    <td><span class="adm-status ${e.is_active ? "adm-status-on" : "adm-status-off"}">${e.is_active ? "Active" : "Hidden"}</span></td>
                    <td class="adm-actions">
                      <button class="adm-btn-icon" title="Edit" data-adm-event-edit="${escapeHtml(e.id)}">${icon("pencil")}</button>
                      <button class="adm-btn-icon" title="${e.is_active ? "Hide" : "Show"}" data-adm-event-toggle="${escapeHtml(e.id)}" data-adm-event-active="${e.is_active}">${e.is_active ? icon("eyeOff") : icon("eye")}</button>
                      <button class="adm-btn-icon adm-btn-danger" title="Delete" data-adm-event-delete="${escapeHtml(e.id)}">${icon("x")}</button>
                    </td>
                  </tr>
                `).join("")}
              </tbody>
            </table>`}
          </div>
        ` : ""}

        ${tab === "resources" ? `
          <div class="adm-table-wrap">
            ${resources.length === 0 ? `<div class="adm-empty">${icon("download")}<p>No downloads yet. Click <strong>Add Download</strong> to create one.</p></div>` : `
            <table class="adm-table">
              <thead><tr><th>Title</th><th>Category</th><th>File URL</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                ${resources.map(r => `
                  <tr class="${r.is_active ? "" : "adm-row-inactive"}">
                    <td><strong class="adm-job-title">${escapeHtml(r.title)}</strong>${r.description ? `<small>${escapeHtml(r.description.slice(0,70))}${r.description.length > 70 ? "…" : ""}</small>` : ""}</td>
                    <td><span class="adm-chip">${escapeHtml(r.category || "General")}</span></td>
                    <td>${r.file_url ? `<a href="${escapeHtml(r.file_url)}" target="_blank" rel="noopener" class="adm-link">View file</a>` : `<span style="color:#94a3b8">Not set</span>`}</td>
                    <td><span class="adm-status ${r.is_active ? "adm-status-on" : "adm-status-off"}">${r.is_active ? "Active" : "Hidden"}</span></td>
                    <td class="adm-actions">
                      <button class="adm-btn-icon" title="Edit" data-adm-res-edit="${escapeHtml(r.id)}">${icon("pencil")}</button>
                      <button class="adm-btn-icon" title="${r.is_active ? "Hide" : "Show"}" data-adm-res-toggle="${escapeHtml(r.id)}" data-adm-res-active="${r.is_active}">${r.is_active ? icon("eyeOff") : icon("eye")}</button>
                      <button class="adm-btn-icon adm-btn-danger" title="Delete" data-adm-res-delete="${escapeHtml(r.id)}">${icon("x")}</button>
                    </td>
                  </tr>
                `).join("")}
              </tbody>
            </table>`}
          </div>
        ` : ""}

        ${tab === "users" ? `
          <div class="adm-table-wrap">
            ${users.length === 0 ? `<div class="adm-empty">${icon("users")}<p>No registered users yet, or profiles table not set up.</p></div>` : `
            <table class="adm-table">
              <thead><tr><th>Name</th><th>Email</th><th>Joined</th></tr></thead>
              <tbody>
                ${users.map(u => `
                  <tr>
                    <td><div style="display:flex;align-items:center;gap:10px">${renderUserAvatar({ initials: (u.name || u.email || "?").slice(0,2).toUpperCase(), color: authAvatarColor(u.email) }, 32)}<strong>${escapeHtml(u.name || ", ")}</strong></div></td>
                    <td>${escapeHtml(u.email || ", ")}</td>
                    <td><span class="adm-deadline">${u.created_at ? new Date(u.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : ", "}</span></td>
                  </tr>
                `).join("")}
              </tbody>
            </table>`}
          </div>
        ` : ""}

        ${tab === "maintenance" ? renderAdminMaintenanceTab() : ""}

          </div>
        </div>
      </div>
    </section>
    ${annFormHtml}
    ${tipFormHtml}
    ${eventFormHtml}
    ${resFormHtml}
  `;

  layout(pageContent);

  // ── Announcement form wiring ─────────────────────────────────────────
  app.querySelector("[data-adm-ann-new]")?.addEventListener("click", () => {
    state.adminAnnForm = { open: true, data: {} };
    render();
  });
  app.querySelectorAll("[data-adm-ann-edit]").forEach(btn => {
    btn.addEventListener("click", () => {
      const ann = anns.find(a => String(a.id) === btn.dataset.admAnnEdit);
      if (ann) { state.adminAnnForm = { open: true, data: { ...ann } }; render(); }
    });
  });
  app.querySelectorAll("[data-adm-ann-toggle]").forEach(btn => {
    btn.addEventListener("click", () => adminToggleAnn(btn.dataset.admAnnToggle, btn.dataset.admAnnActive === "true"));
  });
  app.querySelectorAll("[data-adm-ann-delete]").forEach(btn => {
    btn.addEventListener("click", () => adminDeleteAnn(btn.dataset.admAnnDelete));
  });
  app.querySelectorAll("[data-adm-ann-form-close]").forEach(btn => {
    btn.addEventListener("click", () => { state.adminAnnForm = { open: false, data: {} }; render(); });
  });
  const annForm = app.querySelector("#adm-ann-form");
  if (annForm) {
    annForm.addEventListener("submit", async e => {
      e.preventDefault();
      const fd = new FormData(annForm);
      const data = {
        message: fd.get("message"), type: fd.get("type"),
        link_text: fd.get("link_text"), link_url: fd.get("link_url")
      };
      const res = await adminSaveAnn(data, aForm.data.id || null);
      if (res.ok) {
        state.adminAnnForm = { open: false, data: {} };
        showToast(aForm.data.id ? "Announcement updated." : "Announcement published!", "success");
      } else {
        showToast(res.error || "Save failed.", "error");
      }
      render();
    });
  }

  // ── Tip form wiring ──────────────────────────────────────────────────
  app.querySelector("[data-adm-tip-new]")?.addEventListener("click", () => {
    state.adminTipForm = { open: true, data: {} }; render();
  });
  app.querySelectorAll("[data-adm-tip-edit]").forEach(btn => {
    btn.addEventListener("click", () => {
      const t = tips.find(t => String(t.id) === btn.dataset.admTipEdit);
      if (t) { state.adminTipForm = { open: true, data: { ...t } }; render(); }
    });
  });
  app.querySelectorAll("[data-adm-tip-toggle]").forEach(btn => {
    btn.addEventListener("click", () => adminToggleTip(btn.dataset.admTipToggle, btn.dataset.admTipActive === "true"));
  });
  app.querySelectorAll("[data-adm-tip-delete]").forEach(btn => {
    btn.addEventListener("click", () => adminDeleteTip(btn.dataset.admTipDelete));
  });
  app.querySelectorAll("[data-adm-tip-form-close]").forEach(btn => {
    btn.addEventListener("click", () => { state.adminTipForm = { open: false, data: {} }; render(); });
  });
  const tipForm = app.querySelector("#adm-tip-form");
  if (tipForm) {
    tipForm.addEventListener("submit", async e => {
      e.preventDefault();
      const fd = new FormData(tipForm);
      const res = await adminSaveTip({ message: fd.get("message"), emoji: fd.get("emoji") || "💡" }, tForm.data.id || null);
      if (res.ok) { state.adminTipForm = { open: false, data: {} }; showToast(tForm.data.id ? "Tip updated." : "Tip published!", "success"); }
      else showToast(res.error || "Save failed.", "error");
      render();
    });
  }

  // ── Event form wiring ────────────────────────────────────────────────
  app.querySelector("[data-adm-event-new]")?.addEventListener("click", () => {
    state.adminEventForm = { open: true, data: {} }; render();
  });
  app.querySelectorAll("[data-adm-event-edit]").forEach(btn => {
    btn.addEventListener("click", () => {
      const e = events.find(e => String(e.id) === btn.dataset.admEventEdit);
      if (e) { state.adminEventForm = { open: true, data: { ...e } }; render(); }
    });
  });
  app.querySelectorAll("[data-adm-event-toggle]").forEach(btn => {
    btn.addEventListener("click", () => adminToggleEvent(btn.dataset.admEventToggle, btn.dataset.admEventActive === "true"));
  });
  app.querySelectorAll("[data-adm-event-delete]").forEach(btn => {
    btn.addEventListener("click", () => adminDeleteEvent(btn.dataset.admEventDelete));
  });
  app.querySelectorAll("[data-adm-event-form-close]").forEach(btn => {
    btn.addEventListener("click", () => { state.adminEventForm = { open: false, data: {} }; render(); });
  });
  const evFormEl = app.querySelector("#adm-event-form");
  if (evFormEl) {
    evFormEl.addEventListener("submit", async e => {
      e.preventDefault();
      const fd = new FormData(evFormEl);
      const res = await adminSaveEvent({ title: fd.get("title"), description: fd.get("description"), event_date: fd.get("event_date"), event_time: fd.get("event_time"), location: fd.get("location"), link_text: fd.get("link_text"), link_url: fd.get("link_url") }, evForm.data.id || null);
      if (res.ok) { state.adminEventForm = { open: false, data: {} }; showToast(evForm.data.id ? "Event updated." : "Event published!", "success"); }
      else showToast(res.error || "Save failed.", "error");
      render();
    });
  }

  // ── Resource download form wiring ────────────────────────────────────
  app.querySelector("[data-adm-res-new]")?.addEventListener("click", () => {
    state.adminResourceForm = { open: true, data: {} }; render();
  });
  app.querySelectorAll("[data-adm-res-edit]").forEach(btn => {
    btn.addEventListener("click", () => {
      const r = resources.find(r => String(r.id) === btn.dataset.admResEdit);
      if (r) { state.adminResourceForm = { open: true, data: { ...r } }; render(); }
    });
  });
  app.querySelectorAll("[data-adm-res-toggle]").forEach(btn => {
    btn.addEventListener("click", () => adminToggleResource(btn.dataset.admResToggle, btn.dataset.admResActive === "true"));
  });
  app.querySelectorAll("[data-adm-res-delete]").forEach(btn => {
    btn.addEventListener("click", () => adminDeleteResource(btn.dataset.admResDelete));
  });
  app.querySelectorAll("[data-adm-res-form-close]").forEach(btn => {
    btn.addEventListener("click", () => { state.adminResourceForm = { open: false, data: {} }; render(); });
  });
  const resFormEl = app.querySelector("#adm-res-form");
  if (resFormEl) {
    resFormEl.addEventListener("submit", async e => {
      e.preventDefault();
      const fd = new FormData(resFormEl);
      const res2 = await adminSaveResource({ title: fd.get("title"), description: fd.get("description"), category: fd.get("category"), file_url: fd.get("file_url") }, resForm.data.id || null);
      if (res2.ok) { state.adminResourceForm = { open: false, data: {} }; showToast(resForm.data.id ? "Download updated." : "Download published!", "success"); }
      else showToast(res2.error || "Save failed.", "error");
      render();
    });
  }

  // ── Maintenance tab wiring ─────────────────────────────────────────────
  const maintToggle = app.querySelector("#maint-toggle");
  if (maintToggle) {
    maintToggle.addEventListener("change", async () => {
      const enabled = maintToggle.checked;
      const message = app.querySelector("#maint-message")?.value || "";
      const eta     = app.querySelector("#maint-eta")?.value     || "";
      await adminSaveMaintenance(enabled, message, eta);
    });
  }
  const maintSaveBtn = app.querySelector("#maint-save-btn");
  if (maintSaveBtn) {
    maintSaveBtn.addEventListener("click", async () => {
      const enabled = app.querySelector("#maint-toggle")?.checked ?? state.maintenance?.mode;
      const message = app.querySelector("#maint-message")?.value || "";
      const eta     = app.querySelector("#maint-eta")?.value     || "";
      maintSaveBtn.disabled = true;
      maintSaveBtn.innerHTML = icon("loader") + " Saving…";
      await adminSaveMaintenance(enabled, message, eta);
      // re-render restores button
    });
  }
}

// ─── CONTACT PAGE ─────────────────────────────────────────────────────────────
function renderContactPage() {
  const cf = state.contactForm;
  const contactTypes = [
    { value: "general",     label: "General Enquiry" },
    { value: "correction",  label: "Content Correction" },
    { value: "takedown",    label: "Takedown / Copyright" },
    { value: "partnership", label: "Partnership / Collaboration" },
    { value: "bug",         label: "Bug Report" }
  ];

  if (cf.sent) {
    return `
      ${pageHeader({ eyebrow: "Get in Touch", title: "Contact Us", body: "We'd love to hear from you." })}
      <section class="section">
        <div class="container">
          <div class="contact-success-card">
            <div class="contact-success-icon">${icon("checkCircle")}</div>
            <h2>Message Sent!</h2>
            <p>Thanks for reaching out. We've received your message and sent a confirmation to <strong>${escapeHtml(cf.email)}</strong>.</p>
            <p class="contact-success-sub">We reply within 1–2 business days. While you wait:</p>
            <div class="contact-success-actions">
              ${buttonLink("/notes", "Browse Notes", "primary", "bookOpen")}
              ${buttonLink("/resources/quizzes", "Take a Quiz", "secondary", "helpCircle")}
              <button class="button ghost" type="button" data-contact-reset>${icon("mail")}<span>Send Another</span></button>
            </div>
          </div>
        </div>
      </section>`;
  }

  return `
    ${pageHeader({
      eyebrow: "Get in Touch",
      title: "Contact Us",
      body: "Questions, corrections, partnership ideas or feedback. We read every message."
    })}
    <section class="section">
      <div class="container contact-layout">

        <!-- Info column -->
        <aside class="contact-info-col">
          <div class="contact-info-card">
            <h3>How can we help?</h3>
            <ul class="contact-info-list">
              <li>${icon("pencil")}<div><strong>Content Corrections</strong><span>Spotted an error in our notes? Let us know and we'll fix it.</span></div></li>
              <li>${icon("briefcaseMedical")}<div><strong>Partnerships</strong><span>Hospitals, schools or NGOs: we'd love to collaborate.</span></div></li>
              <li>${icon("helpCircle")}<div><strong>Student Support</strong><span>Questions about using the platform or resources.</span></div></li>
              <li>${icon("tool")}<div><strong>Technical Issues</strong><span>Something not working? Report a bug and we'll fix it fast.</span></div></li>
            </ul>
            <div class="contact-direct-email">
              ${icon("mail")}
              <div>
                <strong>Direct Email</strong>
                <a href="mailto:info@nursinguganda.com">info@nursinguganda.com</a>
              </div>
            </div>
          </div>
        </aside>

        <!-- Form column -->
        <div class="contact-form-col">
          <form class="contact-form" id="contact-form" autocomplete="on" novalidate>
            ${cf.error ? `<div class="contact-error-banner" role="alert">${icon("alertTriangle")} ${escapeHtml(cf.error)}</div>` : ""}

            <div class="contact-form-row-2">
              <div class="contact-field">
                <label for="cf-name">Your Name *</label>
                <input id="cf-name" name="name" type="text" required autocomplete="name"
                  value="${escapeHtml(cf.name)}" placeholder="e.g. Sarah Namukasa">
              </div>
              <div class="contact-field">
                <label for="cf-email">Email Address *</label>
                <input id="cf-email" name="email" type="email" required autocomplete="email"
                  value="${escapeHtml(cf.email)}" placeholder="you@example.com">
              </div>
            </div>

            <div class="contact-field">
              <label for="cf-type">Enquiry Type</label>
              <select id="cf-type" name="type">
                ${contactTypes.map(t => `<option value="${t.value}"${cf.type === t.value ? " selected" : ""}>${t.label}</option>`).join("")}
              </select>
            </div>

            <div class="contact-field">
              <label for="cf-subject">Subject *</label>
              <input id="cf-subject" name="subject" type="text" required
                value="${escapeHtml(cf.subject)}" placeholder="Brief summary of your message">
            </div>

            <div class="contact-field">
              <label for="cf-message">Message *</label>
              <textarea id="cf-message" name="message" required rows="6"
                placeholder="Describe your question, correction, idea or issue in as much detail as possible…">${escapeHtml(cf.message)}</textarea>
            </div>

            <div class="contact-form-footer">
              <p class="contact-privacy-note">${icon("lock")} Your message goes directly to <strong>info@nursinguganda.com</strong>. We reply within 1–2 business days.</p>
              <button type="submit" class="button primary contact-submit-btn" ${cf.loading ? "disabled" : ""}>
                ${cf.loading ? `${icon("rotateCcw")}<span>Sending…</span>` : `${icon("send")}<span>Send Message</span>`}
              </button>
            </div>
          </form>
        </div>

      </div>
    </section>

    <!-- FAQ strip -->
    <section class="section compact-section contact-faq-section">
      <div class="container">
        <div class="section-head slim-head"><div><span class="eyebrow">Quick Answers</span><h2>Common Questions</h2></div></div>
        <div class="contact-faq-grid">
          <div class="contact-faq-item">
            <strong>${icon("bookOpen")} Are the notes free?</strong>
            <p>Yes: all notes, quizzes, the dictionary and most resources are completely free with no sign-up required.</p>
          </div>
          <div class="contact-faq-item">
            <strong>${icon("pencil")} I found an error in the notes</strong>
            <p>Use the <em>Content Correction</em> enquiry type above and describe exactly what is wrong and what the correct information should be.</p>
          </div>
          <div class="contact-faq-item">
            <strong>${icon("users")} Can my school partner with you?</strong>
            <p>Yes! We welcome partnerships with nursing schools, hospitals and professional bodies. Select <em>Partnership</em> and tell us about your organisation.</p>
          </div>
        </div>
      </div>
    </section>
  `;
}

// ═══════════════════════════════════════════════════════════════════════════
//  MOCK EXAM RENDER
// ═══════════════════════════════════════════════════════════════════════════

function renderMockExamHub() {
  const history = getMockExamHistory();
  const gradeColor = g => g === "Distinction" ? "#059669" : g === "Credit" ? "#2563eb" : g === "Pass" ? "#d97706" : "#dc2626";
  return `
    <div class="me-hub-hero">
      <div class="container">
        <span class="mini-label">Uganda Nursing &amp; Midwifery</span>
        <h1>Mock Examinations</h1>
        <p>Timed full-paper practice exams that mirror BNE exam conditions. Submit and get an instant detailed breakdown.</p>
      </div>
    </div>

    <section class="section">
      <div class="container">
        <div class="section-head slim-head">
          <div><h2>Choose Your Exam</h2><p>Select a paper to begin. Timer starts immediately.</p></div>
        </div>
        <div class="me-hub-grid">
          ${MOCK_EXAMS.map(exam => {
            const best = history.filter(h => h.examId === exam.id).sort((a,b) => b.pct - a.pct)[0];
            return `
              <div class="me-hub-card" style="--exam-color:${exam.color}">
                <div class="me-hub-card-head">
                  <div class="me-hub-icon">${icon(exam.icon)}</div>
                  <span class="me-hub-badge">${escapeHtml(exam.badge)}</span>
                </div>
                <h3>${escapeHtml(exam.title)}</h3>
                <p>${escapeHtml(exam.desc)}</p>
                <div class="me-hub-meta">
                  <span>${icon("clock")} ${exam.duration >= 60 ? exam.duration / 60 + " hr" + (exam.duration > 60 ? "s" : "") : exam.duration + " min"}</span>
                  <span>${icon("clipboardList")} ${exam.count} questions</span>
                  ${best ? `<span style="color:${gradeColor(best.grade)}">${icon("trophy")} Best: ${best.pct}% ${best.grade}</span>` : ""}
                </div>
                <button type="button" class="button primary me-hub-start-btn" data-start-mock="${escapeHtml(exam.id)}">
                  ${icon("send")} Start Exam
                </button>
              </div>
            `;
          }).join("")}
        </div>

        ${history.length ? `
          <div class="section-head slim-head" style="margin-top:56px">
            <div><h2>Past Attempts</h2><p>Your last ${Math.min(history.length, 10)} mock exam results.</p></div>
          </div>
          <div class="dash-quiz-history">
            ${history.slice(0, 10).map(r => {
              const relDate = iso => {
                const diff = Math.floor((Date.now() - new Date(iso)) / 86400000);
                return diff === 0 ? "Today" : diff === 1 ? "Yesterday" : diff < 7 ? diff + "d ago" : new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
              };
              const taken = r.timeTaken ? formatMockTime(r.timeTaken) : "";
              return `
                <div class="dqh-row">
                  <div class="dqh-score-badge" style="--grade-c:${gradeColor(r.grade)}">
                    <strong>${r.pct}%</strong><span>${r.grade}</span>
                  </div>
                  <div class="dqh-info">
                    <strong>${escapeHtml(r.title)}</strong>
                    <small>${r.score}/${r.total} &middot; ${relDate(r.date)}${taken ? " &middot; " + taken : ""}</small>
                  </div>
                  <div class="dqh-bar-wrap">
                    <div class="dqh-bar"><span style="width:${r.pct}%;background:${gradeColor(r.grade)}"></span></div>
                  </div>
                </div>
              `;
            }).join("")}
          </div>
        ` : ""}

      </div>
    </section>
  `;
}

function renderMockExamStart(examId) {
  const exam = findMockExam(examId);
  if (!exam) return `<section class="section"><div class="container"><p>Exam not found.</p></div></section>`;
  return `
    <section class="section">
      <div class="container" style="max-width:640px">
        <a class="breadcrumb-link" href="/mock-exams">${icon("arrowLeft")} All Mock Exams</a>
        <div class="me-start-card content-panel">
          <div class="me-start-icon" style="--exam-color:${exam.color}">${icon(exam.icon)}</div>
          <h1 class="me-start-title">${escapeHtml(exam.title)}</h1>
          <p class="me-start-desc">${escapeHtml(exam.desc)}</p>
          <div class="me-start-meta-grid">
            <div class="me-start-meta-item">
              <span>${icon("clock")}</span>
              <div><strong>${exam.duration >= 60 ? exam.duration / 60 + " hour" + (exam.duration > 60 ? "s" : "") : exam.duration + " minutes"}</strong><small>Time limit</small></div>
            </div>
            <div class="me-start-meta-item">
              <span>${icon("clipboardList")}</span>
              <div><strong>${exam.count} Questions</strong><small>Multiple choice</small></div>
            </div>
            <div class="me-start-meta-item">
              <span>${icon("alarmClock")}</span>
              <div><strong>Auto-submit</strong><small>When time expires</small></div>
            </div>
            <div class="me-start-meta-item">
              <span>${icon("send")}</span>
              <div><strong>Instant results</strong><small>With full breakdown</small></div>
            </div>
          </div>
          <div class="me-start-rules">
            <p class="mini-label" style="margin-bottom:8px">Exam Rules</p>
            <ul>
              <li>The timer starts immediately when you click <em>Start Exam</em>.</li>
              <li>You can navigate between questions in any order.</li>
              <li>Unanswered questions are counted as incorrect.</li>
              <li>The exam auto-submits when time runs out.</li>
              <li>Refresh the page to resume if interrupted: progress is saved.</li>
            </ul>
          </div>
          <button type="button" class="button primary me-start-btn" data-start-mock="${escapeHtml(exam.id)}" style="--btn-color:${exam.color}">
            ${icon("send")} Start Exam Now
          </button>
        </div>
      </div>
    </section>
  `;
}

function renderMockExamInProgress() {
  const me = state.mockExam;
  const exam = findMockExam(me.examId);
  if (!exam || !me.questions.length) return "";
  const q = me.questions[me.currentQ];
  const answered = me.answers[me.currentQ];
  const totalQ = me.questions.length;
  const answeredCount = Object.keys(me.answers).length;
  const timerPct = Math.round((me.timeLeft / (exam.duration * 60)) * 100);

  return `
    <!-- Sticky exam header -->
    <div class="me-header" id="me-header">
      <div class="me-header-inner">
        <div class="me-header-title">
          <strong>${escapeHtml(exam.title)}</strong>
          <span>Q ${me.currentQ + 1} / ${totalQ} &nbsp;&bull;&nbsp; ${answeredCount} answered</span>
        </div>
        <div class="me-timer${me.timeLeft <= 300 && me.timeLeft > 0 ? " me-warning-text" : ""}" id="me-timer">${formatMockTime(me.timeLeft)}</div>
      </div>
      <div class="me-progress-bar"><span id="me-timer-bar" style="width:${timerPct}%"></span></div>
    </div>

    <!-- Question area -->
    <div class="me-body">
      <div class="me-question-area">
        <p class="me-q-number">Question ${me.currentQ + 1} of ${totalQ}</p>
        <h2 class="me-q-prompt">${escapeHtml(q.prompt)}</h2>

        <div class="me-choices">
            ${(q.choices || []).map((choice, ci) => `
              <label class="me-choice${answered === ci ? " selected" : ""}">
                <input type="radio" name="me-q-${me.currentQ}" value="${ci}" ${answered === ci ? "checked" : ""} data-me-answer="${me.currentQ}" data-me-value="${ci}">
                <span class="me-choice-letter">${String.fromCharCode(65 + ci)}</span>
                <span class="me-choice-text">${escapeHtml(choice)}</span>
              </label>
            `).join("")}
          </div>
      </div>

      <!-- Navigation -->
      <div class="me-nav">
        <button type="button" class="button secondary me-nav-btn" data-me-prev ${me.currentQ === 0 ? "disabled" : ""}>${icon("arrowLeft")} Prev</button>
        <button type="button" class="button secondary me-nav-btn" data-me-palette>${icon("grid")} Questions (${answeredCount}/${totalQ})</button>
        <button type="button" class="button secondary me-nav-btn" data-me-next ${me.currentQ === totalQ - 1 ? "disabled" : ""}>Next ${icon("arrowRight")}</button>
        <button type="button" class="button primary me-nav-btn me-submit-btn" data-me-submit>${icon("send")} Submit</button>
      </div>
    </div>

    <!-- Question palette modal -->
    ${me.paletteOpen ? `
      <div class="me-palette-overlay" data-me-palette-close>
        <div class="me-palette-modal">
          <div class="me-palette-head">
            <strong>Question Navigator</strong>
            <button type="button" class="me-palette-close" data-me-palette-close>${icon("x")}</button>
          </div>
          <div class="me-palette-legend">
            <span class="me-pal-dot me-pal-answered"></span>Answered
            <span class="me-pal-dot me-pal-current"></span>Current
            <span class="me-pal-dot me-pal-unanswered"></span>Unanswered
          </div>
          <div class="me-palette-grid">
            ${me.questions.map((_, i) => {
              const isCurrent = i === me.currentQ;
              const isAns = me.answers[i] !== undefined;
              return `<button type="button" class="me-pal-btn${isCurrent ? " current" : isAns ? " answered" : ""}" data-me-goto="${i}">${i + 1}</button>`;
            }).join("")}
          </div>
          <div class="me-palette-footer">
            <button type="button" class="button primary" data-me-palette-close>Close</button>
          </div>
        </div>
      </div>
    ` : ""}
  `;
}

function renderMockExamResults() {
  const me = state.mockExam;
  const exam = findMockExam(me.examId);
  if (!exam) return "";
  const score = me.questions.filter((q, i) => quizAnswerCorrect(q, me.answers[i])).length;
  const total = me.questions.length;
  const pct = total ? Math.round((score / total) * 100) : 0;
  const grade = pct >= 80 ? "Distinction" : pct >= 60 ? "Credit" : pct >= 50 ? "Pass" : "Below Pass";
  const gradeColor = pct >= 80 ? "#059669" : pct >= 60 ? "#2563eb" : pct >= 50 ? "#d97706" : "#dc2626";
  const timeTaken = exam.duration * 60 - me.timeLeft;
  const msg = pct >= 80 ? "Outstanding! Excellent performance across all topics."
    : pct >= 60 ? "Good work. Review the questions you missed and revise those areas."
    : pct >= 50 ? "Satisfactory. Study the explanations carefully and try again."
    : "Keep going. Read each explanation. You will improve with consistent practice.";

  return `
    <div class="me-results-wrap">
      <div class="me-results-card">
        <div class="me-results-header">
          <a href="/mock-exams" class="me-back-link">${icon("arrowLeft")} All Mock Exams</a>
          <h1>${escapeHtml(exam.title)}</h1>
          <p class="me-results-subtitle">Exam Results</p>
        </div>

        <div class="me-score-block" style="--grade-c:${gradeColor}">
          <div class="me-score-pct">${pct}%</div>
          <div class="me-score-grade">${grade}</div>
          <div class="me-score-detail">${score} correct out of ${total} questions</div>
          ${timeTaken ? `<div class="me-score-time">${icon("clock")} Time taken: ${formatMockTime(timeTaken)}</div>` : ""}
        </div>

        <p class="me-results-msg">${escapeHtml(msg)}</p>

        <div class="me-results-actions">
          <button type="button" class="button primary" data-start-mock="${escapeHtml(me.examId)}">${icon("timerReset")} Retake Exam</button>
          ${buttonLink("/mock-exams", "All Mock Exams", "secondary", "clipboardList")}
          ${buttonLink("/progress", "My Dashboard", "secondary", "chartLine")}
        </div>
      </div>

      <!-- Question breakdown -->
      <div class="me-breakdown">
        <div class="section-head slim-head" style="margin: 0 0 20px">
          <div><h2>Question Breakdown</h2><p>Review every question with correct answers and explanations.</p></div>
        </div>
        <div class="me-breakdown-list">
          ${me.questions.map((q, i) => {
            const ans = me.answers[i];
            const correct = quizAnswerCorrect(q, ans);
            const selectedLabel = ans === undefined ? null : (q.choices?.[Number(ans)] ?? String(ans));
            const correctLabel = q.choices?.[q.answer] ?? String(q.answer);
            return `
              <div class="me-bkd-row${correct ? " correct" : " wrong"}">
                <div class="me-bkd-num">${correct ? icon("checkCircle") : icon("xCircle")}<span>Q${i + 1}</span></div>
                <div class="me-bkd-body">
                  <p class="me-bkd-prompt">${escapeHtml(q.prompt)}</p>
                  ${!correct ? `<p class="me-bkd-your">Your answer: <em>${escapeHtml(selectedLabel ?? "Not answered")}</em></p>` : ""}
                  <p class="me-bkd-correct">Correct: <strong>${escapeHtml(correctLabel)}</strong></p>
                  ${q.explanation ? `<p class="me-bkd-exp">${escapeHtml(q.explanation)}</p>` : ""}
                </div>
              </div>
            `;
          }).join("")}
        </div>
      </div>
    </div>
  `;
}

function renderMockExamPage(examId) {
  const me = state.mockExam;
  if (me.examId === examId && me.submitted) return renderMockExamResults();
  if (me.examId === examId && me.questions.length && !me.submitted) return renderMockExamInProgress();
  return renderMockExamStart(examId);
}

// ═══════════════════════════════════════════════════════════════════════════
//  CLINICAL TOOLS: RENDER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

function renderClinicalToolsPage() {
  const tab = state.clinicalTools.tab;
  const tabs = [
    { id: "calculator", label: "Drug Calculator",       icon: "pill" },
    { id: "checklists", label: "Clinical Checklists",   icon: "listChecks" },
    { id: "values",     label: "Normal Values",         icon: "clipboardList" }
  ];
  let tabContent = "";
  if (tab === "calculator") tabContent = renderDrugCalculator();
  else if (tab === "checklists") tabContent = renderClinicalChecklists();
  else tabContent = renderNormalValues();

  return `
    <section class="section">
      <div class="container" style="max-width:900px">
        <div class="ct-page-hero">
          <div class="ct-page-hero-icon">${icon("stethoscope")}</div>
          <div>
            <h1 class="ct-page-hero-title">Clinical Tools</h1>
            <p class="ct-page-hero-desc">Drug dose calculator, clinical procedure checklists, and quick-reference normal values, all in one place.</p>
          </div>
        </div>

        <div class="ct-tabs" role="tablist" aria-label="Clinical tool categories">
          ${tabs.map(t => `
            <button
              type="button"
              class="ct-tab-btn${tab === t.id ? " active" : ""}"
              role="tab"
              aria-selected="${tab === t.id}"
              data-ct-tab="${t.id}"
            >
              ${icon(t.icon)}<span>${t.label}</span>
            </button>
          `).join("")}
        </div>

        <div class="ct-tab-panel">
          ${tabContent}
        </div>
      </div>
    </section>
  `;
}

function renderDrugCalculator() {
  const type = state.clinicalTools.calcType;
  const cfg  = CALC_CONFIGS[type];
  const calcTypes = Object.entries(CALC_CONFIGS).map(([id, c]) => ({ id, label: c.label, icon: c.icon }));

  return `
    <div class="ct-calc-page">
      <div class="ct-calc-type-list" role="list">
        ${calcTypes.map(ct => `
          <button type="button" class="ct-calc-type-btn${type === ct.id ? " active" : ""}" data-calc-type="${ct.id}">
            <span class="ct-calc-type-icon">${icon(ct.icon)}</span>
            <span class="ct-calc-type-label">${ct.label}</span>
          </button>
        `).join("")}
      </div>

      <div class="ct-calc-area">
        <div class="ct-calc-header">
          <h2 class="ct-calc-title">${icon(cfg.icon)} ${escapeHtml(cfg.label)}</h2>
          <p class="ct-calc-formula">${escapeHtml(cfg.formula)}</p>
        </div>

        <form id="ct-calc-form" class="ct-calc-form" autocomplete="off" onsubmit="return false">
          ${cfg.fields.map(f => `
            <div class="ct-field-group">
              <label class="ct-field-label" for="ctf-${f.id}">${escapeHtml(f.label)}</label>
              <div class="ct-field-input-wrap">
                <input
                  id="ctf-${f.id}"
                  type="number" min="0" step="any"
                  class="ct-field-input"
                  placeholder="${escapeHtml(f.placeholder)}"
                  data-calc-field="${f.id}"
                >
                <span class="ct-field-unit">${escapeHtml(f.unit)}</span>
              </div>
            </div>
          `).join("")}
        </form>

        <div id="ct-calc-result" class="ct-calc-result ct-result-empty">
          <div class="ct-result-placeholder">Enter values above to calculate</div>
        </div>

        <button type="button" class="button secondary ct-calc-clear-btn" data-calc-clear>
          ${icon("rotateCcw")} Clear
        </button>

        <p class="ct-calc-note">
          ${icon("alertTriangle")} Always verify calculations with a senior nurse or pharmacist. This tool is for revision only, not for direct clinical use.
        </p>
      </div>
    </div>
  `;
}

function renderClinicalChecklists() {
  const { checklistId } = state.clinicalTools;
  if (checklistId) {
    const cl = CLINICAL_CHECKLISTS.find(c => c.id === checklistId);
    if (cl) return renderChecklistDetail(cl);
  }
  const categories = [...new Set(CLINICAL_CHECKLISTS.map(c => c.category))];
  return `
    <div class="ct-cl-hub">
      ${categories.map(cat => {
        const clists = CLINICAL_CHECKLISTS.filter(c => c.category === cat);
        return `
          <div class="ct-cl-cat-section">
            <h3 class="ct-cl-cat-title">${escapeHtml(cat)}</h3>
            <div class="ct-cl-grid">
              ${clists.map(cl => {
                const progress  = getChecklistProgress(cl.id);
                const done      = Object.keys(progress).length;
                const total     = cl.steps.length;
                const pct       = total ? Math.round((done / total) * 100) : 0;
                const complete  = done === total && total > 0;
                return `
                  <button type="button" class="ct-cl-card${complete ? " ct-cl-card-complete" : ""}" data-cl-open="${cl.id}">
                    <span class="ct-cl-card-icon">${icon(cl.icon)}</span>
                    <span class="ct-cl-card-title">${escapeHtml(cl.title)}</span>
                    <span class="ct-cl-card-steps">${cl.steps.length} steps</span>
                    ${done > 0 ? `
                      <div class="ct-cl-card-bar-wrap">
                        <div class="ct-cl-card-bar" style="width:${pct}%"></div>
                      </div>
                      <span class="ct-cl-card-pct">${pct}%${complete ? " ✓" : ""}</span>
                    ` : ""}
                  </button>
                `;
              }).join("")}
            </div>
          </div>
        `;
      }).join("")}
    </div>
  `;
}

function renderChecklistDetail(cl) {
  const progress = getChecklistProgress(cl.id);
  const done     = Object.keys(progress).length;
  const total    = cl.steps.length;
  const pct      = total ? Math.round((done / total) * 100) : 0;
  const complete = done === total && total > 0;

  return `
    <div class="ct-cl-detail">
      <button type="button" class="breadcrumb-link" data-cl-back>
        ${icon("arrowLeft")} All Checklists
      </button>

      <div class="ct-cl-detail-header">
        <span class="ct-cl-detail-icon">${icon(cl.icon)}</span>
        <div>
          <h2 class="ct-cl-detail-title">${escapeHtml(cl.title)}</h2>
          <span class="ct-cl-detail-cat">${escapeHtml(cl.category)}</span>
        </div>
      </div>

      <div class="ct-cl-progress-row">
        <div class="ct-cl-progress-bar">
          <div class="ct-cl-progress-fill${complete ? " complete" : ""}" style="width:${pct}%"></div>
        </div>
        <span class="ct-cl-progress-label">${done} / ${total} steps${complete ? ". Complete!" : ""}</span>
      </div>

      <div class="ct-cl-steps">
        ${cl.steps.map((step, i) => `
          <label class="ct-cl-step${progress[i] ? " checked" : ""}${step.critical ? " critical" : ""}">
            <input
              type="checkbox"
              class="ct-cl-step-cb"
              ${progress[i] ? "checked" : ""}
              data-cl-step="${cl.id}"
              data-cl-step-index="${i}"
            >
            <span class="ct-cl-step-num">${i + 1}</span>
            <span class="ct-cl-step-text">${escapeHtml(step.text)}</span>
            ${step.critical ? `<span class="ct-cl-critical-badge">Critical</span>` : ""}
          </label>
        `).join("")}
      </div>

      <div class="ct-cl-detail-actions">
        <button type="button" class="button secondary" data-cl-reset="${cl.id}">
          ${icon("rotateCcw")} Reset Checklist
        </button>
        <button type="button" class="breadcrumb-link" data-cl-back>
          ${icon("arrowLeft")} All Checklists
        </button>
      </div>
    </div>
  `;
}

function renderNormalValues() {
  const valuesTab = state.clinicalTools.valuesTab;
  const tabs      = Object.entries(NORMAL_VALUES_DATA);
  const current   = NORMAL_VALUES_DATA[valuesTab] || tabs[0][1];

  return `
    <div class="ct-nv-page">
      <div class="ct-nv-tabs" role="tablist" aria-label="Normal value categories">
        ${tabs.map(([id, data]) => `
          <button
            type="button"
            class="ct-nv-tab${valuesTab === id ? " active" : ""}"
            data-nv-tab="${id}"
            role="tab"
            aria-selected="${valuesTab === id}"
          >
            ${icon(data.icon)}<span>${escapeHtml(data.label)}</span>
          </button>
        `).join("")}
      </div>

      <div class="ct-nv-table-wrap">
        <table class="ct-nv-table">
          <thead>
            <tr>
              <th>Parameter</th>
              <th>Normal Range</th>
              <th>Unit</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            ${current.items.map(item => `
              <tr>
                <td class="ct-nv-name">${escapeHtml(item.name)}</td>
                <td class="ct-nv-value"><strong>${escapeHtml(item.value)}</strong></td>
                <td class="ct-nv-unit">${escapeHtml(item.unit || "")}</td>
                <td class="ct-nv-note">${item.note ? escapeHtml(item.note) : "<span class='ct-nv-none'>: </span>"}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>

      <p class="ct-nv-disclaimer">
        ${icon("alertTriangle")} Reference ranges are for adult patients unless stated. Values may vary by laboratory method and local protocol. Always interpret results in clinical context.
      </p>
    </div>
  `;
}

// ═══════════════════════════════════════════════════════════════════════════
//  STUDY PLANNER RENDER
// ═══════════════════════════════════════════════════════════════════════════

function renderPlanner() {
  const today        = new Date();
  const weekStart    = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay() + 1 + state.planner.weekOffset * 7); // Mon
  const days         = [];
  const dayNames     = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  const plannerData  = getPlannerData();
  for (let i = 0; i < 7; i++) {
    const d   = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    const key = d.toISOString().slice(0, 10);
    const sessions = plannerData[key] || [];
    const isToday  = key === today.toISOString().slice(0, 10);
    const isPast   = d < today && !isToday;
    days.push({ key, d, sessions, isToday, isPast, label: dayNames[i] });
  }
  const weekLabel    = weekStart.toLocaleDateString("en-GB", { day: "numeric", month: "long" });
  const weekEnd      = new Date(weekStart); weekEnd.setDate(weekStart.getDate() + 6);
  const weekEndLabel = weekEnd.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const selectedDay  = state.planner.selectedDay || (days.find(d => d.isToday) || days[0]).key;

  const typeLabels  = { revision: "📖 Revision", notes: "📝 Notes", quiz: "✅ Quiz", mock: "📋 Mock Exam", flashcards: "🃏 Flashcards", clinical: "🩺 Clinical Tools" };
  const typeColors  = { revision: "#3b82f6", notes: "#10b981", quiz: "#f59e0b", mock: "#8b5cf6", flashcards: "#ec4899", clinical: "#00B5BD" };

  const selDay = days.find(function(d) { return d.key === selectedDay; }) || days[0];

  return `
    <section class="section">
      <div class="container" style="max-width:900px">
        <div class="planner-page-hero">
          <div class="planner-hero-icon">${icon("calendar")}</div>
          <div>
            <h1 class="planner-hero-title">Study Planner</h1>
            <p class="planner-hero-desc">Plan your revision week, track sessions, and stay consistent.</p>
          </div>
        </div>

        <!-- Week navigation -->
        <div class="planner-week-nav">
          <button type="button" class="button secondary planner-week-btn" data-planner-week="-1">${icon("arrowLeft")} Prev</button>
          <span class="planner-week-label">${weekLabel}: ${weekEndLabel}</span>
          <button type="button" class="button secondary planner-week-btn" data-planner-week="1">Next ${icon("arrowRight")}</button>
        </div>

        <!-- Week grid -->
        <div class="planner-week-grid">
          ${days.map(function(day) {
            const sel   = day.key === selectedDay;
            const total = day.sessions.length;
            const done  = day.sessions.filter(function(s) { return s.done; }).length;
            return `
              <button type="button" class="planner-day-cell${sel ? " selected" : ""}${day.isToday ? " today" : ""}${day.isPast ? " past" : ""}" data-planner-day="${day.key}">
                <span class="planner-day-name">${day.label}</span>
                <span class="planner-day-num">${day.d.getDate()}</span>
                ${total > 0 ? `<span class="planner-day-count${done === total ? " all-done" : ""}">${done}/${total}</span>` : ""}
                ${day.isToday ? `<span class="planner-today-dot"></span>` : ""}
              </button>
            `;
          }).join("")}
        </div>

        <!-- Selected day detail -->
        <div class="planner-day-detail">
          <div class="planner-day-detail-head">
            <h2 class="planner-day-detail-title">
              ${selDay.d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}
              ${selDay.isToday ? `<span class="planner-today-badge">Today</span>` : ""}
            </h2>
            <button type="button" class="button primary planner-add-btn" data-planner-open-add>
              ${icon("calendar")} Add Session
            </button>
          </div>

          ${state.planner.addFormOpen ? `
            <form class="planner-add-form" data-planner-add-form>
              <div class="planner-form-row">
                <div class="planner-form-group">
                  <label class="planner-form-label">What are you studying?</label>
                  <input type="text" class="planner-form-input" placeholder="e.g. Anatomy: Cardiovascular System"
                    data-planner-field="title" value="${escapeHtml(state.planner.addForm.title)}" maxlength="80">
                </div>
                <div class="planner-form-group" style="max-width:180px">
                  <label class="planner-form-label">Type</label>
                  <select class="planner-form-select" data-planner-field="type">
                    ${Object.entries(typeLabels).map(function(kv) {
                      return `<option value="${kv[0]}"${state.planner.addForm.type === kv[0] ? " selected" : ""}>${kv[1]}</option>`;
                    }).join("")}
                  </select>
                </div>
              </div>
              <div class="planner-form-group">
                <label class="planner-form-label">Notes <span style="font-weight:400;color:var(--color-muted)">(optional)</span></label>
                <input type="text" class="planner-form-input" placeholder="e.g. Focus on cardiac cycle, revise ECG basics"
                  data-planner-field="notes" value="${escapeHtml(state.planner.addForm.notes)}" maxlength="120">
              </div>
              <div class="planner-form-actions">
                <button type="submit" class="button primary">Add Session</button>
                <button type="button" class="button secondary" data-planner-cancel-add>Cancel</button>
              </div>
            </form>
          ` : ""}

          ${selDay.sessions.length === 0 && !state.planner.addFormOpen ? `
            <p class="planner-empty">No sessions planned for this day. Click "Add Session" to get started.</p>
          ` : ""}

          <div class="planner-sessions">
            ${selDay.sessions.map(function(s) {
              const color = typeColors[s.type] || "#6b7280";
              return `
                <div class="planner-session${s.done ? " done" : ""}" style="--session-color:${color}">
                  <button type="button" class="planner-session-check" data-planner-toggle="${selDay.key}" data-planner-session-id="${s.id}" aria-label="${s.done ? "Mark incomplete" : "Mark complete"}">
                    ${s.done ? icon("checkCircle") : icon("clock")}
                  </button>
                  <div class="planner-session-body">
                    <strong>${escapeHtml(s.title || "Untitled session")}</strong>
                    <span class="planner-session-type">${typeLabels[s.type] || s.type}</span>
                    ${s.notes ? `<p class="planner-session-notes">${escapeHtml(s.notes)}</p>` : ""}
                  </div>
                  <button type="button" class="planner-session-del" data-planner-remove="${selDay.key}" data-planner-session-id="${s.id}" aria-label="Remove session">${icon("x")}</button>
                </div>
              `;
            }).join("")}
          </div>
        </div>
      </div>
    </section>
  `;
}

// ═══════════════════════════════════════════════════════════════════════════
//  NOTIFICATION BELL RENDER
// ═══════════════════════════════════════════════════════════════════════════

function renderBellDropdown() {
  const announcements = state.announcements || [];
  const read          = getReadAnnouncements();
  const unread        = announcements.filter(function(a) { return !read.has(a.id); }).length;

  return `
    <div class="bell-dropdown" id="bell-dropdown" role="dialog" aria-label="Notifications">
      <div class="bell-dropdown-head">
        <strong>Notifications</strong>
        ${unread > 0 ? `<button type="button" class="bell-mark-all" data-bell-mark-read>Mark all read</button>` : ""}
      </div>
      ${announcements.length === 0 ? `
        <p class="bell-empty">No announcements right now.</p>
      ` : announcements.slice(0, 6).map(function(a) {
        const isNew = !read.has(a.id);
        return `
          <div class="bell-item${isNew ? " bell-item-unread" : ""}">
            ${isNew ? `<span class="bell-item-dot"></span>` : ""}
            <div class="bell-item-content">
              <strong>${escapeHtml(a.title || "")}</strong>
              ${a.body ? `<p>${escapeHtml(a.body.slice(0, 90))}${a.body.length > 90 ? "…" : ""}</p>` : ""}
              <time>${timeAgo(a.created_at)}</time>
            </div>
          </div>
        `;
      }).join("")}
      <div class="bell-dropdown-footer">
        <a href="/planner" class="bell-footer-link">Study Planner ${icon("arrowRight")}</a>
        <a href="/community" class="bell-footer-link">Community ${icon("arrowRight")}</a>
      </div>
    </div>
  `;
}

// ═══════════════════════════════════════════════════════════════════════════
//  COMMUNITY Q&A RENDER
// ═══════════════════════════════════════════════════════════════════════════

function renderCommunity() {
  const { questions, loading, filter, search, askFormOpen } = state.community;

  let filtered = questions;
  if (filter === "unanswered") filtered = filtered.filter(function(q) { return !q.is_answered; });
  if (filter === "answered")   filtered = filtered.filter(function(q) { return q.is_answered; });
  if (search.trim()) {
    const q = search.toLowerCase();
    filtered = filtered.filter(function(qn) { return (qn.title + " " + qn.body).toLowerCase().includes(q); });
  }

  return `
    <section class="section">
      <div class="container" style="max-width:820px">
        <div class="comm-page-hero">
          <div class="comm-hero-icon">${icon("users")}</div>
          <div>
            <h1 class="comm-hero-title">Community Q&amp;A</h1>
            <p class="comm-hero-desc">Ask questions, share answers, and learn together with other nursing students.</p>
          </div>
        </div>

        <div class="comm-toolbar">
          <div class="comm-filters">
            <button type="button" class="comm-filter-btn${filter === "all" ? " active" : ""}" data-comm-filter="all">All</button>
            <button type="button" class="comm-filter-btn${filter === "unanswered" ? " active" : ""}" data-comm-filter="unanswered">Unanswered</button>
            <button type="button" class="comm-filter-btn${filter === "answered" ? " active" : ""}" data-comm-filter="answered">Answered</button>
          </div>
          <div class="comm-search-wrap">
            <input type="search" class="comm-search" placeholder="Search questions…" value="${escapeHtml(search)}" data-comm-search>
          </div>
          <button type="button" class="button primary comm-ask-btn" data-comm-ask>
            ${icon("pencil")} Ask a Question
          </button>
        </div>

        ${askFormOpen ? `
          <div class="comm-ask-form-wrap">
            <h3 class="comm-ask-form-title">Ask a Question</h3>
            <div class="comm-form-group">
              <label class="comm-form-label">Question title <span class="comm-form-hint">Be specific and clear</span></label>
              <input type="text" class="comm-form-input" maxlength="120"
                placeholder="e.g. What is the difference between osmosis and diffusion?"
                value="${escapeHtml(state.community.askTitle)}"
                data-comm-field="askTitle">
            </div>
            <div class="comm-form-group">
              <label class="comm-form-label">Details</label>
              <textarea class="comm-form-textarea" rows="4" maxlength="2000"
                placeholder="Explain what you're struggling with, what you've already tried, etc."
                data-comm-field="askBody">${escapeHtml(state.community.askBody)}</textarea>
            </div>
            <div class="comm-form-actions">
              <button type="button" class="button primary" data-comm-post-question>Post Question</button>
              <button type="button" class="button secondary" data-comm-cancel-ask>Cancel</button>
            </div>
          </div>
        ` : ""}

        ${loading ? `<div class="comm-loading">${icon("clock")} Loading questions…</div>` : ""}

        ${!loading && filtered.length === 0 ? `
          <div class="comm-empty">
            <p>${search || filter !== "all" ? "No questions match your search." : "No questions yet, be the first to ask!"}</p>
          </div>
        ` : ""}

        <div class="comm-question-list">
          ${filtered.map(function(q) {
            const initials = q.user_initials || "?";
            const color    = authAvatarColor(q.user_name || "");
            return `
              <a class="comm-question-card" href="/community/${q.id}">
                <div class="comm-q-vote">
                  <span class="comm-q-vote-count">${q.upvotes || 0}</span>
                  <span class="comm-q-vote-label">votes</span>
                </div>
                <div class="comm-q-answer-count${q.is_answered ? " answered" : ""}">
                  <span>${q.answer_count || 0}</span>
                  <span>${q.answer_count === 1 ? "answer" : "answers"}</span>
                </div>
                <div class="comm-q-body">
                  <h3 class="comm-q-title">${escapeHtml(q.title)}</h3>
                  <p class="comm-q-excerpt">${escapeHtml((q.body || "").slice(0, 120))}${(q.body || "").length > 120 ? "…" : ""}</p>
                  <div class="comm-q-meta">
                    <span class="comm-q-avatar" style="background:${color.bg};color:${color.text}">${escapeHtml(initials)}</span>
                    <span>${escapeHtml(q.user_name || "Student")}</span>
                    <span class="comm-q-dot">·</span>
                    <time>${timeAgo(q.created_at)}</time>
                    ${q.is_answered ? `<span class="comm-q-answered-badge">${icon("checkCircle")} Answered</span>` : ""}
                  </div>
                </div>
              </a>
            `;
          }).join("")}
        </div>
      </div>
    </section>
  `;
}

function renderCommunityQuestion() {
  const q   = state.community.selectedQuestion;
  const ans = state.community.questionAnswers;

  if (!q) {
    return `
      <section class="section"><div class="container" style="max-width:820px;text-align:center;padding:4rem 1rem">
        ${icon("helpCircle")}<h2 style="margin:.75rem 0">Question not found.</h2>
        <a class="button secondary" href="/community">${icon("arrowLeft")} Back to Community</a>
      </div></section>
    `;
  }

  const qColor = authAvatarColor(q.user_name || "");

  return `
    <section class="section">
      <div class="container" style="max-width:820px">
        <a class="breadcrumb-link" href="/community">${icon("arrowLeft")} All Questions</a>

        <!-- Question -->
        <div class="comm-q-detail">
          <div class="comm-q-detail-head">
            <h1 class="comm-q-detail-title">${escapeHtml(q.title)}</h1>
            <div class="comm-q-detail-meta">
              <span class="comm-q-avatar" style="background:${qColor.bg};color:${qColor.text}">${escapeHtml(q.user_initials || "?")}</span>
              <span>${escapeHtml(q.user_name || "Student")}</span>
              <span class="comm-q-dot">·</span>
              <time>${timeAgo(q.created_at)}</time>
              <span class="comm-q-dot">·</span>
              <span>${q.answer_count || 0} answer${q.answer_count !== 1 ? "s" : ""}</span>
            </div>
          </div>
          <div class="comm-q-detail-body">${escapeHtml(q.body || "")}</div>
          <div class="comm-q-detail-actions">
            <button type="button" class="comm-upvote-btn" data-comm-upvote="question" data-comm-upvote-id="${q.id}" data-comm-upvote-count="${q.upvotes || 0}">
              ${icon("heart")} ${q.upvotes || 0} votes
            </button>
          </div>
        </div>

        <!-- Answers -->
        ${ans.length > 0 ? `
          <div class="comm-answers-head">
            <h2>${ans.length} Answer${ans.length !== 1 ? "s" : ""}</h2>
          </div>
          <div class="comm-answer-list">
            ${ans.map(function(a) {
              const aColor = authAvatarColor(a.user_name || "");
              return `
                <div class="comm-answer${a.is_accepted ? " comm-answer-accepted" : ""}">
                  ${a.is_accepted ? `<div class="comm-answer-accepted-badge">${icon("checkCircle")} Accepted Answer</div>` : ""}
                  <div class="comm-answer-body">${escapeHtml(a.body || "")}</div>
                  <div class="comm-answer-footer">
                    <span class="comm-q-avatar" style="background:${aColor.bg};color:${aColor.text}">${escapeHtml(a.user_initials || "?")}</span>
                    <span>${escapeHtml(a.user_name || "Student")}</span>
                    <span class="comm-q-dot">·</span>
                    <time>${timeAgo(a.created_at)}</time>
                    <button type="button" class="comm-upvote-btn" data-comm-upvote="answer" data-comm-upvote-id="${a.id}" data-comm-upvote-count="${a.upvotes || 0}">
                      ${icon("heart")} ${a.upvotes || 0}
                    </button>
                  </div>
                </div>
              `;
            }).join("")}
          </div>
        ` : `<p class="comm-no-answers">No answers yet: be the first to help!</p>`}

        <!-- Post answer -->
        <div class="comm-post-answer">
          <h3>Your Answer</h3>
          ${state.currentUser ? `
            <textarea class="comm-form-textarea" rows="5" maxlength="3000"
              placeholder="Write a clear, helpful answer…"
              data-comm-field="answerBody"
              ${state.community.answerLoading ? "disabled" : ""}
            >${escapeHtml(state.community.answerBody)}</textarea>
            <button type="button" class="button primary" data-comm-post-answer="${q.id}"
              ${state.community.answerLoading ? "disabled" : ""}>
              ${state.community.answerLoading ? "Posting…" : icon("send") + " Post Answer"}
            </button>
          ` : `
            <div class="comm-login-prompt">
              ${icon("lock")}
              <p>Sign in to post an answer and help your peers.</p>
              <a class="button primary" href="/login">${icon("users")} Sign In</a>
            </div>
          `}
        </div>
      </div>
    </section>
  `;
}

function renderWeeklyChart() {
  const studyDates = getStudyDates();
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const studied = studyDates.has(key);
    const label = i === 0 ? "Today" : i === 1 ? "Yest" : dayNames[d.getDay()];
    days.push({ key, studied, label, isToday: i === 0 });
  }
  const studiedCount = days.filter(d => d.studied).length;
  return `
    <div class="dash-weekly-chart">
      <div class="dash-weekly-head">
        <span class="mini-label">This Week</span>
        <span class="dash-weekly-stat">${studiedCount}/7 days studied</span>
      </div>
      <div class="dash-weekly-bars">
        ${days.map(d => `
          <div class="dash-weekly-col">
            <div class="dash-weekly-bar-wrap">
              <div class="dash-weekly-bar${d.studied ? " active" : ""}${d.isToday ? " is-today" : ""}"></div>
            </div>
            <span class="dash-weekly-day${d.isToday ? " is-today" : ""}">${d.label}</span>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

function renderActivityHeatmap() {
  const studyDates = getStudyDates();
  const today = new Date();
  const WEEKS = 10; // show 10 weeks (70 days)
  const DAYS  = WEEKS * 7;

  // Build ordered day list oldest → newest
  const days = [];
  for (let i = DAYS - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    days.push({ key, dow: d.getDay(), month: d.getMonth(), date: d.getDate(), active: studyDates.has(key) });
  }
  // Pad start to Sunday boundary
  const padBefore = days[0].dow;
  const cells = [...Array(padBefore).fill(null), ...days];

  // Build week columns (each column = one week, 7 rows)
  const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const dayLabels = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

  // Calculate week index for each position to place month labels
  const totalCells = cells.length;
  const numWeeks = Math.ceil(totalCells / 7);

  // Compute month label per week column (show if month changes on that column)
  const weekMonthLabels = [];
  for (let w = 0; w < numWeeks; w++) {
    const firstRealIdx = w * 7;
    let label = "";
    for (let r = 0; r < 7; r++) {
      const c = cells[firstRealIdx + r];
      if (c && c.date <= 7) { label = MONTH_NAMES[c.month]; break; }
      if (c && r === 0) { label = ""; }
    }
    weekMonthLabels.push(label);
  }

  // Build grid HTML: columns are weeks, rows are days-of-week
  const weekCols = [];
  for (let w = 0; w < numWeeks; w++) {
    const cellsInWeek = cells.slice(w * 7, w * 7 + 7);
    const colCells = cellsInWeek.map((c, r) => {
      if (!c) return `<span class="hm-cell hm-pad"></span>`;
      const label = `${dayLabels[r]} ${c.key}${c.active ? " ✓" : ""}`;
      return `<span class="hm-cell${c.active ? " hm-active" : ""}" title="${label}"></span>`;
    }).join("");
    weekCols.push(`<div class="hm-week-col">${colCells}</div>`);
  }

  return `
    <div class="dash-heatmap">
      <div class="dash-heatmap-head">
        <span class="mini-label">Study Activity: last ${WEEKS} weeks</span>
        <span class="dash-heatmap-legend">
          <span class="hm-dot hm-off"></span>No study
          <span class="hm-dot hm-on"></span>Studied
        </span>
      </div>
      <div class="dash-heatmap-body">
        <div class="hm-day-labels">
          ${["","M","","W","","F",""].map(l => `<span>${l}</span>`).join("")}
        </div>
        <div class="hm-weeks-wrap">
          <div class="hm-month-row">
            ${weekMonthLabels.map(l => `<span class="hm-month-label">${l}</span>`).join("")}
          </div>
          <div class="hm-weeks-grid">
            ${weekCols.join("")}
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderQuizHistorySection(history) {
  if (!history.length) return "";
  const gradeColor = g => g === "Distinction" ? "#059669" : g === "Credit" ? "#2563eb" : g === "Pass" ? "#d97706" : "#dc2626";
  const relDate = iso => {
    const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
    if (diff === 0) return "Today";
    if (diff === 1) return "Yesterday";
    if (diff < 7)  return diff + " days ago";
    return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  };
  return `
    <div class="section-head slim-head" style="margin-top:48px">
      <div><h2>Recent Quiz Results</h2><p>Your last ${history.length} submitted quiz${history.length !== 1 ? "zes" : ""}.</p></div>
    </div>
    <div class="dash-quiz-history">
      ${history.map(r => `
        <div class="dqh-row">
          <div class="dqh-score-badge" style="--grade-c:${gradeColor(r.grade)}">
            <strong>${r.pct}%</strong>
            <span>${r.grade}</span>
          </div>
          <div class="dqh-info">
            <strong>${escapeHtml(r.title)}</strong>
            <small>${r.score}/${r.total} correct &middot; ${relDate(r.date)}</small>
          </div>
          <div class="dqh-bar-wrap">
            <div class="dqh-bar"><span style="width:${r.pct}%;background:${gradeColor(r.grade)}"></span></div>
          </div>
        </div>
      `).join("")}
    </div>
  `;
}

function renderProgress() {
  const progress = overallProgress();
  const streak = updateStreak();
  const masteredCount = flashcardMastery().size;
  const saved = bookmarks();
  const completed = completedTopics();
  const last = lastStudiedTopic();
  const history = getQuizHistory();
  const user = state.currentUser;
  const quizzesTaken = Object.keys(quizSubmitted()).length;

  const subjectBreakdown = notesSubjects().map((subject) => {
    const matches = subjectUnits(subject.pattern);
    const topicList = matches.flatMap(({ programme, unit }) =>
      flatTopics(unit).map((topic) => ({ programme, unit, topic }))
    );
    const done = topicList.filter(({ programme, unit, topic }) => completed[topicKey(programme, unit, topic)]).length;
    const total = topicList.length;
    return { title: subject.title, done, total, percent: total ? Math.round((done / total) * 100) : 0 };
  });

  const programmeBreakdown = (state.data?.programmes || []).map(p => {
    const units = allUnits(p);
    const topics = units.flatMap(u => flatTopics(u).map(t => ({ programme: p, unit: u, topic: t })));
    const done = topics.filter(({ programme, unit, topic }) => completed[topicKey(programme, unit, topic)]).length;
    const total = topics.length;
    return { label: p.label || p.id, id: p.id, done, total, percent: total ? Math.round((done / total) * 100) : 0 };
  }).filter(p => p.total > 0);

  const encouragement = progress.percent >= 80
    ? "Exceptional, you're in the final stretch. Push through to 100%."
    : progress.percent >= 50
      ? "More than halfway. Keep your daily habit and you'll finish strong."
      : "Great start. One lesson a day adds up fast: let your streak carry you.";

  const greeting = user ? `Welcome back${user.name ? ", " + user.name.split(" ")[0] : ""}! 👋` : "My Study Dashboard";

  // Build stat chips for dash hero
  const heroChips = [
    { icon: "flame",       value: streak.count,    label: "day streak" },
    { icon: "checkCircle", value: progress.done,   label: "lessons done" },
    { icon: "star",        value: masteredCount,   label: "mastered" },
    { icon: "helpCircle",  value: quizzesTaken,    label: "quizzes" },
  ];

  return `
    <div class="dash-hero">
      <div class="dash-hero-bg" aria-hidden="true"></div>
      <div class="container">
        <div class="dash-hero-inner">
          <div class="dash-hero-text">
            <span class="dash-eyebrow">${icon("chartLine")} Study Dashboard</span>
            <h1>${escapeHtml(greeting)}</h1>
            <p>${escapeHtml(encouragement)}</p>
            <div class="dash-hero-chips">
              ${heroChips.map(c => `
                <div class="dash-hero-chip">
                  ${icon(c.icon)}
                  <strong>${c.value}</strong>
                  <span>${escapeHtml(c.label)}</span>
                </div>`).join("")}
            </div>
          </div>
          <div class="dash-hero-actions">
            ${last
              ? `<a class="button primary" href="${escapeHtml(last.href)}">${icon("arrowRight")} Continue Studying</a>`
              : buttonLink("/courses/curriculum", "Start Studying", "primary", "graduationCap")
            }
            ${buttonLink("/resources/quizzes", "Take a Quiz", "secondary", "send")}
          </div>
        </div>
      </div>
    </div>

    <section class="section">
      <div class="container">

        <!-- Above-the-fold: 2-column grid (left: stats + weekly chart | right: ring + continue) -->
        <div class="dash-above-fold">

          <!-- LEFT: stat tiles + weekly chart -->
          <div class="dash-atf-left">
            <div class="progress-stat-grid">
              <div class="progress-stat-tile">
                <div class="progress-stat-icon psi-primary">${icon("checkCircle")}</div>
                <div><strong>${progress.done}</strong><span>Lessons Done</span><small>of ${progress.total} total</small></div>
              </div>
              <div class="progress-stat-tile psi-streak-tile">
                <div class="progress-stat-icon psi-flame">${icon("flame")}</div>
                <div>
                  <strong>${streak.count}</strong><span>Day Streak</span>
                  <small class="streak-best-hint">Best: ${streak.best || streak.count} day${(streak.best || streak.count) !== 1 ? "s" : ""} ${(streak.best || streak.count) >= 7 ? "🔥" : ""}</small>
                </div>
              </div>
              <div class="progress-stat-tile">
                <div class="progress-stat-icon psi-trophy">${icon("send")}</div>
                <div><strong>${quizzesTaken}</strong><span>Quizzes Taken</span><small>${masteredCount} flashcards mastered</small></div>
              </div>
              <div class="progress-stat-tile">
                <div class="progress-stat-icon psi-bookmark">${icon("bookmark")}</div>
                <div><strong>${saved.length}</strong><span>Bookmarks</span><small>Saved notes &amp; topics</small></div>
              </div>
            </div>
            ${renderWeeklyChart()}
          </div>

          <!-- RIGHT: overall ring + continue card -->
          <div class="dash-atf-right">
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
                <h2>${progress.done} of ${progress.total} lessons</h2>
                <p>${escapeHtml(encouragement)}</p>
                <div class="progress-bar" style="margin-top:14px;margin-bottom:18px">
                  <span style="width:${progress.percent}%"></span>
                </div>
                ${buttonLink("/courses/curriculum", "Browse All Courses", "secondary", "graduationCap")}
              </div>
            </div>
            ${last ? `
              <div class="dash-continue-card content-panel">
                <div class="dash-continue-icon">${icon("bookOpen")}</div>
                <div class="dash-continue-body">
                  <span class="mini-label">Continue where you left off</span>
                  <strong>${escapeHtml(last.title)}</strong>
                  <small>${escapeHtml(last.context || "")}</small>
                </div>
                <a class="button primary" href="${escapeHtml(last.href)}">${icon("arrowRight")} Continue</a>
              </div>
            ` : ""}
          </div>

        </div>

        <!-- Today's Plan -->
        ${(function() {
          const todayPlan = getTodayPlan();
          const todayDone = todayPlan.filter(function(s) { return s.done; }).length;
          return todayPlan.length > 0 ? `
            <div class="dash-today-plan content-panel" style="margin-top:24px">
              <div class="dash-today-icon">${icon("calendar")}</div>
              <div class="dash-today-body">
                <span class="mini-label">Today's Study Plan</span>
                <strong>${todayDone} of ${todayPlan.length} sessions complete</strong>
                <div class="dash-today-sessions">
                  ${todayPlan.slice(0, 3).map(function(s) {
                    return `<span class="dash-today-chip${s.done ? " done" : ""}">${s.done ? icon("checkCircle") : icon("clock")} ${escapeHtml(s.title || "Session")}</span>`;
                  }).join("")}
                  ${todayPlan.length > 3 ? `<span class="dash-today-more">+${todayPlan.length - 3} more</span>` : ""}
                </div>
              </div>
              <a class="button secondary" href="/planner">${icon("calendar")} View Planner</a>
            </div>
          ` : "";
        })()}

        <!-- Activity heatmap -->
        ${renderActivityHeatmap()}

        <!-- Quiz history -->
        ${renderQuizHistorySection(history)}

        <!-- Progress by Programme -->
        ${programmeBreakdown.length ? `
          <div class="section-head slim-head" style="margin-top:48px">
            <div><h2>Progress by Programme</h2><p>Lessons completed across each study programme.</p></div>
          </div>
          <div class="progress-subject-list">
            ${programmeBreakdown.map(p => `
              <div class="progress-subject-row">
                <div class="progress-subject-info">
                  <span class="progress-subject-icon">${icon("graduationCap")}</span>
                  <div>
                    <strong>${escapeHtml(p.label)}</strong>
                    <small>${p.done} of ${p.total} lessons</small>
                  </div>
                </div>
                <div class="progress-subject-track">
                  <div class="progress-bar progress-subject-bar"><span style="width:${p.percent}%"></span></div>
                  <span class="progress-subject-pct">${p.percent}%</span>
                </div>
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Progress by Subject -->
        <div class="section-head slim-head" style="margin-top:48px">
          <div><h2>Progress by Subject</h2><p>Completed lessons across each nursing subject area.</p></div>
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

        <!-- Bookmarks -->
        ${saved.length ? `
          <div class="section-head slim-head" style="margin-top:48px">
            <div><h2>Saved Bookmarks</h2><p>Your bookmarked topics and lessons.</p></div>
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

        <!-- Achievement Badges -->
        ${renderMilestoneBadges()}

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
    <section class="home-hero">
      <div class="hero-slide-bg" aria-hidden="true">
        <img src="assets/images/nursing-uganda-home-hero-1.webp" class="hero-slide hero-slide-1" alt="" width="1600" height="900" loading="eager" fetchpriority="high" decoding="async">
        <img src="assets/images/nursing-uganda-home-hero-2.webp" class="hero-slide hero-slide-2" alt="" width="1600" height="900" loading="lazy" decoding="async">
        <img src="assets/images/nursing-uganda-home-hero-3.webp" class="hero-slide hero-slide-3" alt="" width="1600" height="900" loading="lazy" decoding="async">
        <div class="hero-slide-overlay"></div>
        <div class="hero-slide-indicators" aria-hidden="true">
          <span class="hero-slide-indicator"></span>
          <span class="hero-slide-indicator"></span>
          <span class="hero-slide-indicator"></span>
        </div>
      </div>
      <div class="container">
        <div class="home-hero-inner">
          <div class="home-hero-copy">
            <h1 class="home-hero-title">Nursing &amp; midwifery notes for Uganda students</h1>
            <p class="home-hero-desc">Every course unit for certificate, diploma and degree programmes, with a medical dictionary, past papers, quizzes and an instrument atlas.</p>
          </div>
          <div class="home-hero-search">
            ${renderHomeSearch()}
            <div class="home-hero-links">
              ${buttonLink("/courses/curriculum", "Browse Courses", "ghost-white", "graduationCap")}
              ${buttonLink("/resources/quizzes", "Take a Quiz", "ghost-white", "helpCircle")}
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="section compact-section">
      <div class="container">
        <div class="continue-strip content-panel">
          <div class="continue-strip-info">
            ${streakChip()}
            <p class="continue-strip-title">${last ? escapeHtml(last.title) : "Start Your First Lesson"}</p>
            <p>${last ? `${escapeHtml(last.programme)}, ${escapeHtml(last.unit)}` : "Open any course lesson and Nursing Uganda will track where you stopped."}</p>
          </div>
          ${last ? `<div class="continue-strip-stats">
            <div><strong>${progress.percent}%</strong><span>complete</span></div>
            ${streak.count > 1 ? `<div><strong>${streak.count}</strong><span>day streak</span></div>` : ""}
            ${masteryCount > 0 ? `<div><strong>${masteryCount}</strong><span>mastered</span></div>` : ""}
          </div>` : ""}
          ${buttonLink(last ? last.href : "/courses/curriculum", last ? "Resume" : "Start Learning", "primary", last ? "bookOpen" : "graduationCap")}
        </div>
      </div>
    </section>
    ${renderStudyTipWidget()}
    <section class="section">
      <div class="container">
        <div class="section-head slim-head">
          <div>
            <h2>Browse by subject</h2>
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
            <h2>Flashcards, quizzes and the dictionary</h2>
            <p>Use flashcards for active recall, test yourself with quizzes, or look up any term in the medical dictionary.</p>
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
    <section class="search-page-hero-section">
      <div class="container">
        <span class="eyebrow page-eyebrow">Search</span>
        <h1 class="search-page-title">Find Anything</h1>
        <p class="search-page-subtitle">Course units, topics, lesson notes, dictionary terms and instruments, all in one search.</p>
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
                <div class="search-result-body">
                  <span class="search-result-type">${escapeHtml(result.type)}</span>
                  <h3>${escapeHtml(result.title)}</h3>
                  <p>${escapeHtml(result.body)}</p>
                  ${result.context ? `<strong class="search-result-context">${escapeHtml(result.context)}</strong>` : ""}
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

/* ── User Profile / Settings ─────────────────────────────────────── */
function getUserProfile() {
  try { return JSON.parse(localStorage.getItem("nursinguganda.userProfile") || "{}"); }
  catch { return {}; }
}
function saveUserProfile(profile) {
  try { localStorage.setItem("nursinguganda.userProfile", JSON.stringify(profile)); } catch {}
}

function renderSettingsPage() {
  const ns = getNotifSettings();
  const profile = getUserProfile();
  const user = state.currentUser;
  const programmes = state.data?.programmes || [];
  const sf = state.settingsForm;
  const supported = typeof window !== "undefined" && "Notification" in window;

  return `
    ${pageHeader({ eyebrow: "Account", title: "Profile & Settings", body: "Personalise your study experience, manage reminders, and review your account." })}
    <section class="section">
      <div class="container settings-container">

        <!-- Profile Card -->
        <div class="settings-card">
          <h2 class="settings-card-title">${icon("user")} Study Profile</h2>
          <p class="settings-card-desc">This helps us personalise your dashboard and track the right curriculum for you.</p>
          <div class="settings-form" id="settings-profile-form">
            <div class="settings-field">
              <label for="sf-name">Display Name</label>
              <input id="sf-name" type="text" class="settings-input" placeholder="e.g. Sarah Namukasa" value="${escapeHtml(sf.name || profile.name || user?.name || "")}" data-sf-name>
            </div>
            <div class="settings-field">
              <label for="sf-programme">Programme of Study</label>
              <select id="sf-programme" class="settings-input" data-sf-programme>
                <option value="">: Select programme: </option>
                ${programmes.map(p => `<option value="${escapeHtml(p.id)}"${(sf.programme || profile.programme) === p.id ? " selected" : ""}>${escapeHtml(p.label)}</option>`).join("")}
              </select>
            </div>
            <div class="settings-field">
              <label for="sf-year">Year of Study</label>
              <select id="sf-year" class="settings-input" data-sf-year>
                <option value="">: Select year: </option>
                ${[1,2,3,4].map(y => `<option value="${y}"${String(sf.year || profile.year) === String(y) ? " selected" : ""}>Year ${y}</option>`).join("")}
              </select>
            </div>
            <div class="settings-field">
              <label for="sf-goal">Daily Lesson Goal</label>
              <select id="sf-goal" class="settings-input" data-sf-goal>
                ${[1,2,3,5,10].map(g => `<option value="${g}"${String(sf.goal || profile.goal || "3") === String(g) ? " selected" : ""}>${g} lesson${g > 1 ? "s" : ""} per day</option>`).join("")}
              </select>
            </div>
            <div class="settings-actions">
              <button type="button" class="button primary" data-save-profile>
                ${sf.saving ? "Saving…" : sf.saved ? "✓ Saved!" : "Save Profile"}
              </button>
            </div>
          </div>
        </div>

        <!-- Notifications Card -->
        <div class="settings-card">
          <h2 class="settings-card-title">${icon("bell")} Daily Study Reminder</h2>
          <p class="settings-card-desc">Get a browser notification if you haven't studied by your chosen time each day.</p>
          ${!supported ? `<p class="settings-notif-unsupported">Notifications are not supported in this browser.</p>` : `
            <div class="settings-notif-row">
              <label class="settings-toggle-label">
                <input type="checkbox" class="settings-notif-cb" data-notif-enabled ${ns.reminderEnabled ? "checked" : ""}>
                <span class="settings-toggle-track"><span class="settings-toggle-thumb"></span></span>
                <span>Enable daily reminder</span>
              </label>
            </div>
            ${ns.reminderEnabled ? `
              <div class="settings-field" style="margin-top:12px">
                <label for="sf-notif-time">Remind me at</label>
                <input id="sf-notif-time" type="time" class="settings-input" value="${ns.reminderTime || "20:00"}" data-notif-time style="max-width:140px">
              </div>
              <p class="settings-hint">Only fires if you haven't studied that day. Requires the browser to be open.</p>
            ` : ""}
          `}
        </div>

        <!-- Stats snapshot -->
        <div class="settings-card settings-card-stats">
          <h2 class="settings-card-title">${icon("chartBar")} Your Stats</h2>
          ${(function() {
            const progress = overallProgress();
            const streak = getStreak();
            const quizzesTaken = Object.keys(quizSubmitted()).length;
            const mastered = flashcardMastery().size;
            const due = srDueCount();
            return `
              <div class="settings-stats-grid">
                <div class="settings-stat"><strong>${progress.done}</strong><span>Lessons Done</span></div>
                <div class="settings-stat"><strong>${streak.count}</strong><span>Current Streak</span></div>
                <div class="settings-stat"><strong>${streak.best || streak.count}</strong><span>Best Streak</span></div>
                <div class="settings-stat"><strong>${quizzesTaken}</strong><span>Quizzes Taken</span></div>
                <div class="settings-stat"><strong>${mastered}</strong><span>Cards Mastered</span></div>
                <div class="settings-stat${due > 0 ? " has-due" : ""}"><strong>${due}</strong><span>Cards Due Today</span></div>
              </div>
            `;
          })()}
        </div>

        <!-- Account Card -->
        ${user ? `
          <div class="settings-card settings-card-danger">
            <h2 class="settings-card-title">${icon("user")} Account</h2>
            <p class="settings-card-desc">Signed in as <strong>${escapeHtml(user.email)}</strong></p>
            <button class="button ghost" type="button" data-auth-logout>${icon("logOut")} Sign Out</button>
          </div>
        ` : `
          <div class="settings-card">
            <h2 class="settings-card-title">${icon("user")} Account</h2>
            <p class="settings-card-desc">Sign in to sync your progress and quiz results across devices.</p>
            ${buttonLink("/login", "Sign In / Create Account", "primary", "user")}
          </div>
        `}

      </div>
    </section>
  `;
}

function setupSettingsPage() {
  // Save profile
  app.querySelector("[data-save-profile]")?.addEventListener("click", () => {
    const name = app.querySelector("[data-sf-name]")?.value?.trim() || "";
    const programme = app.querySelector("[data-sf-programme]")?.value || "";
    const year = app.querySelector("[data-sf-year]")?.value || "";
    const goal = app.querySelector("[data-sf-goal]")?.value || "3";
    state.settingsForm = { name, programme, year, goal, saving: true, saved: false };
    const profile = { name, programme, year, goal };
    saveUserProfile(profile);
    // If logged in, update Supabase user name
    const client = sb();
    const user = state.currentUser;
    if (client && user && name) {
      client.from("profiles").upsert({ id: user.id, name }).then(() => {});
      if (user) user.name = name;
    }
    state.settingsForm.saving = false;
    state.settingsForm.saved = true;
    render();
    setTimeout(() => { state.settingsForm.saved = false; render(); }, 2500);
  });

  // Notification toggle (reuse account page handler logic)
  const notifCb = app.querySelector(".settings-notif-cb[data-notif-enabled]");
  if (notifCb) {
    notifCb.addEventListener("change", async () => {
      const ns = getNotifSettings();
      if (notifCb.checked) {
        if ("Notification" in window && Notification.permission !== "granted") {
          const perm = await Notification.requestPermission();
          if (perm !== "granted") { notifCb.checked = false; showToast("Permission denied.", "error"); return; }
        }
        ns.reminderEnabled = true;
        showToast("Study reminders enabled!", "success");
      } else {
        ns.reminderEnabled = false;
      }
      saveNotifSettings(ns);
      render();
    });
  }
  const notifTime = app.querySelector("[data-notif-time]");
  if (notifTime) {
    notifTime.addEventListener("change", () => {
      const ns = getNotifSettings(); ns.reminderTime = notifTime.value; saveNotifSettings(ns);
    });
  }
}

function renderQuizHub() {
  const quizTopics = allStudyTopics()
    .filter(({ programme, unit, topic }) => lessonForTopic(programme, unit, topic))
    .slice(0, 36);

  // Trigger leaderboard load on first visit (non-blocking)
  if (state.leaderboard === null) {
    state.leaderboard = undefined; // mark as loading (not null = triggered)
    loadLeaderboard();
  }

  return `
    ${pageHeader({
      eyebrow: "Active Recall",
      title: "Quick Quizzes",
      body: `Practice nursing and midwifery recall. Open a topic, answer the quick quiz, then mark it complete. ${quizTopics.length} quiz-ready topics available.`,
      actions: buttonLink("/resources", "Back to Resources", "secondary", "arrowLeft")
    })}
    <section class="section">
      <div class="container">

        <!-- Weekly Leaderboard -->
        ${renderLeaderboard()}

        <!-- Quiz Topic Grid -->
        <div class="section-head slim-head" style="margin-top:48px">
          <div><h2>${icon("helpCircle")} Quiz Topics</h2><p>Choose any topic to open its lesson quiz.</p></div>
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
  const level = programmeLevel(programme);
  const stats = [
    ["Years", programme.stats.yearCount],
    ["Semesters", programme.stats.semesterCount],
    ["Units", programme.stats.unitCount],
    ["Topics", programme.stats.topicCount || 0]
  ];

  // Compute per-programme completion
  const completed = completedTopics();
  const pUnits = allUnits(programme);
  const pTopics = pUnits.flatMap(u => flatTopics(u).map(t => ({ unit: u, topic: t })));
  const pDone = pTopics.filter(({ unit, topic }) => completed[topicKey(programme, unit, topic)]).length;
  const pTotal = pTopics.length;
  const pPct = pTotal ? Math.round((pDone / pTotal) * 100) : 0;

  const levelClass = level === "Degree" ? "prog-level-deg" : level === "Diploma" ? "prog-level-dip" : "prog-level-cert";

  return `
    <a class="card programme-card" href="/courses/${programme.id}">
      <span class="programme-art">
        <img src="${escapeHtml(displayImageSrc(visual.src))}" alt="${escapeHtml(visual.alt || programme.label)}" loading="lazy">
        <span class="programme-art-badge" aria-hidden="true">${iconFor(programme.label)}</span>
        <span class="prog-level-badge ${levelClass}">${escapeHtml(level)}</span>
      </span>
      <div class="programme-card-body">
        <h3>${escapeHtml(programme.label)}</h3>
        <div class="programme-meta">
          ${stats.map(([label, value]) => `<span><strong>${value}</strong> ${escapeHtml(label)}</span>`).join("")}
        </div>
        ${pTotal > 0 ? `
          <div class="prog-progress-row">
            <div class="prog-progress-bar"><span style="width:${pPct}%"></span></div>
            <span class="prog-progress-pct">${pPct}% done</span>
          </div>
        ` : ""}
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
  const programmes = state.data.programmes || [];
  const totals = state.data?.totals || {};
  const progress = overallProgress();
  const last = lastStudiedTopic();
  const totalUnits = programmes.reduce((sum, p) => sum + allUnits(p).length, 0);
  const totalLessons = totals.topics || allStudyTopics().length;
  const completed = completedTopics();
  const streak = updateStreak();

  const levels = ["All", "Certificate", "Diploma", "Degree"];

  return `
    <div class="courses-page">

      <!-- ── Hero ── -->
      <section class="courses-hero2">
        <div class="container">
          <div class="courses-hero2-inner">
            <div class="courses-hero2-copy">
              <span class="eyebrow courses-hero2-eyebrow">Courses &amp; Curriculum</span>
              <h1 class="courses-hero2-title">All Nursing &amp;<br>Midwifery Programmes</h1>
              <p class="courses-hero2-desc">Every nursing and midwifery programme for Uganda students, structured by year, semester and lesson. Pick a programme to begin.</p>
              <div class="courses-hero2-pills">
                <span>${icon("graduationCap")}<strong>${programmes.length}</strong> Programmes</span>
                <span>${icon("bookOpen")}<strong>${totalUnits}</strong> Course Units</span>
                <span>${icon("fileText")}<strong>${totalLessons.toLocaleString()}</strong> Lessons</span>
                <span>${icon("checkCircle")}<strong>${progress.percent}%</strong> Progress</span>
              </div>
            </div>
            <div class="courses-hero2-actions">
              ${last ? `
                <div class="courses-resume-card">
                  <div class="courses-resume-meta">
                    <span class="courses-resume-chip">${icon("bookOpen")} Continue studying</span>
                    <strong>${escapeHtml(last.title)}</strong>
                    <span>${escapeHtml(last.programme)} &mdash; ${escapeHtml(last.unit)}</span>
                  </div>
                  ${buttonLink(last.href, "Resume Lesson", "primary", "arrowRight")}
                </div>
              ` : `
                <div class="courses-resume-card courses-resume-empty">
                  ${icon("graduationCap")}
                  <strong>Start your first lesson</strong>
                  <span>Open any course below and your progress will be tracked automatically.</span>
                </div>
              `}
              <div class="courses-hero2-ctas">
                ${buttonLink("/courses/curriculum", "Curriculum Map", "ghost-white", "listChecks")}
                ${buttonLink("/search", "Search Lessons", "ghost-white", "search")}
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ── Level filter bar ── -->
      <div class="courses-filter-bar">
        <div class="container">
          <div class="courses-filter-inner">
            <span class="courses-filter-label">Filter by level:</span>
            <div class="courses-filter-pills" role="group" aria-label="Filter programmes by level">
              ${levels.map((l) => `
                <button type="button" class="filter-pill${state.programmeFilter === l ? " active" : ""}" data-programme-level="${escapeHtml(l)}">
                  ${escapeHtml(l)}
                </button>
              `).join("")}
            </div>
            <span class="courses-filter-count">${programmes.filter(p => state.programmeFilter === "All" || programmeLevel(p) === state.programmeFilter).length} shown</span>
          </div>
        </div>
      </div>

      <!-- ── Programme grid ── -->
      <section class="section">
        <div class="container">
          ${programmeSections()}
        </div>
      </section>

      <!-- ── Bottom CTA ── -->
      <section class="section compact-section courses-bottom-cta-section">
        <div class="container">
          <div class="home-cta-banner">
            <div>
              <span class="eyebrow">Explore further</span>
              <h2>More Study Tools</h2>
              <p>Flashcards for active recall, quizzes to test yourself, and a full medical dictionary.</p>
            </div>
            <div class="home-cta-actions">
              ${buttonLink("/flashcards", "Flashcards", "primary", "bookOpen")}
              ${buttonLink("/resources/quizzes", "Quizzes", "secondary", "helpCircle")}
              ${buttonLink("/dictionary", "Dictionary", "ghost", "search")}
            </div>
          </div>
        </div>
      </section>

    </div>
  `;
}

function renderCurriculumHub() {
  const programmeCount = state.data?.programmes?.length || 0;
  return `
    ${pageHeader({
      eyebrow: "Curriculum",
      title: "Curriculum Maps",
      body: `All ${programmeCount} nursing and midwifery programmes, drill into semesters, course units and topic lists.`,
      actions: buttonLink("/courses/curriculum", "All Courses", "secondary", "graduationCap")
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
          <a href="/courses/curriculum">Courses</a>
          <span>${icon("arrowRight")}</span>
          <a href="/courses/curriculum">${escapeHtml(programmeType)}</a>
          <span>${icon("arrowRight")}</span>
          <strong>${escapeHtml(programme.label)}</strong>
        </nav>
      `,
      actions: firstYearKey ? `
        <button class="button primary" type="button" data-scroll-target="${escapeHtml(firstYearKey)}">${buttonLabel("View Year 1", "arrowRight")}</button>
        <a class="button secondary" href="/courses/curriculum">${buttonLabel("All Programmes", "graduationCap")}</a>
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
          ${topics.length ? `<a class="sidebar-secondary-action" href="${unitQuizHref(programme, unit)}">${icon("helpCircle")}<span>Unit review quiz</span></a>` : ""}
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
      ${renderSecondaryPanel("lesson-flashcards", "Practice Flashcards", "badgeCheck", renderLessonFlashcards(lesson), false)}
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
        ${lesson && lesson.generated ? `<div class="draft-lesson-badge">${icon("pencil")}<span>Draft study notes, full lesson content coming soon</span></div>` : ""}
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
        <a class="lesson-secondary-action lesson-wa-share" href="${waShare(`📚 Studying "${lmsLessonTitle(programme, unit, topic)}" on Nursing Uganda, great notes for nursing students!\n\nhttps://nursinguganda.com${topicHref(programme, unit, topic.groupIndex, topic.topicIndex)}`)}" target="_blank" rel="noopener noreferrer">${icon("whatsapp")}<span>Share on WhatsApp</span></a>
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

function waShare(text) {
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

function quizAnswerCorrect(question, answer) {
  if (answer === undefined) return false;
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

  if (terms.length >= 2) {
    const t = terms[0];
    const wrong = terms.slice(1, 4).map((x) => x.term);
    questions.push({
      prompt: `Which term matches this definition: "${truncateText(t.definition, 100)}"?`,
      answer: t.term,
      choices: rotateChoices([t.term, ...wrong], 0),
      explanation: `${t.term}: ${t.definition}`
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
          <p>${allAnswered && score === questions.length ? "Perfect score. This topic is mastered!" : answered.length ? `${score} of ${answered.length} answered correctly.` : "Answer these quick checks after reading the topic."}</p>
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
          return `
            <article class="quiz-question${answeredQuestion ? (correct ? " quiz-q-correct" : " quiz-q-wrong") : ""}">
              <h4 class="quiz-q-prompt">${questionIndex + 1}. ${escapeHtml(question.prompt)}</h4>
              <div class="quiz-options">
                ${question.choices.map((choice, choiceIndex) => {
                  const isSelected = Number(selected) === choiceIndex;
                  const isCorrect = answeredQuestion && choice === question.answer;
                  const isWrong = answeredQuestion && isSelected && !isCorrect;
                  const stateClass = isCorrect ? " correct" : isWrong ? " wrong" : "";
                  return `<button type="button" class="quiz-option${isSelected ? " selected" : ""}${stateClass}" data-quiz-key="${escapeHtml(key)}" data-quiz-question="${questionIndex}" data-quiz-answer="${choiceIndex}" ${answeredQuestion ? "disabled" : ""}>
                    <span class="qo-letter">${String.fromCharCode(65 + choiceIndex)}</span>
                    <span class="qo-text">${escapeHtml(choice)}</span>
                  </button>`;
                }).join("")}
              </div>
              ${answeredQuestion ? `<div class="quiz-explanation${correct ? " correct-text" : " wrong-text"}">${correct ? icon("checkCircle") : icon("xCircle")}<span>${escapeHtml(question.explanation)}</span></div>` : ""}
            </article>
          `;
        }).join("")}
      </div>
    </section>
  `;
}

function renderLessonFlashcards(lesson) {
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

function quizSeedHash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = (h * 16777619) >>> 0; }
  return h;
}

function deterministicShuffle(arr, seed) {
  const result = arr.slice();
  let h = quizSeedHash(String(seed));
  for (let i = result.length - 1; i > 0; i--) {
    h = (h * 1664525 + 1013904223) >>> 0;
    const j = h % (i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function quizPageHref(programme, unit, topic) {
  return `${topicHref(programme, unit, topic.groupIndex, topic.topicIndex).replace(/\/$/, "")}/quiz`;
}

function unitQuizHref(programme, unit) {
  return `/courses/${programme.id}/${unit.id}/quiz`;
}

function buildLessonQuizQuestions(lesson, programme, unit, topic) {
  const sections = visibleLessonSections(lesson).filter((s) => s.title && !/reference|quiz/i.test(s.title));
  const sectionTitles = sections.map((s) => s.title);
  const terms = lessonTerms(lesson);
  const keyPoints = lessonKeyPoints(lesson);
  const textBlocks = sections.map(firstTextBlock).filter(Boolean).map((b) => truncateText(b.text, 120));
  const questions = [];

  for (let i = 0; i < Math.min(sectionTitles.length, 3); i++) {
    const correct = sectionTitles[i];
    const wrong = sectionTitles.filter((_, j) => j !== i).slice(0, 3);
    if (!wrong.length) continue;
    questions.push({
      prompt: `Which of the following is a section heading in this lesson?`,
      answer: correct,
      choices: rotateChoices([correct, ...wrong], i % 4),
      explanation: `"${correct}" is one of the main sections covered in this lesson.`
    });
  }

  for (let i = 0; i < Math.min(textBlocks.length, 2); i++) {
    const correct = textBlocks[i];
    const wrong = textBlocks.filter((_, j) => j !== i).slice(0, 3);
    if (!wrong.length) continue;
    questions.push({
      prompt: `Which of the following statements appears in these study notes?`,
      answer: correct,
      choices: rotateChoices([correct, ...wrong], (i + 1) % 4),
      explanation: `This statement appears in the lesson content.`
    });
  }

  for (const point of keyPoints.slice(0, 4)) {
    questions.push({
      prompt: `True or false: "${point}"`,
      answer: "True",
      choices: ["True", "False"],
      explanation: `This statement is taken from the lesson notes.`
    });
  }

  if (terms.length >= 2) {
    for (let i = 0; i < Math.min(terms.length, 3); i++) {
      const { term, definition } = terms[i];
      const wrongTerms = terms.filter((_, j) => j !== i).slice(0, 3).map((t) => t.term);
      if (!wrongTerms.length) continue;
      questions.push({
        prompt: `Which term is defined as: "${truncateText(definition, 100)}"?`,
        answer: term,
        choices: rotateChoices([term, ...wrongTerms], i % 4),
        explanation: `${term}: ${definition}`
      });
    }
  }

  questions.push({
    prompt: `This lesson is part of which course?`,
    answer: lmsCourseTitle(programme, unit),
    choices: rotateChoices([
      lmsCourseTitle(programme, unit),
      programme.label,
      lmsModuleTitle(programme, unit, topic),
      `Advanced Nursing Practice`
    ].filter((v, i, a) => v && a.indexOf(v) === i).slice(0, 4), 0),
    explanation: `This lesson is part of ${lmsCourseTitle(programme, unit)} in the ${programme.label} programme.`
  });

  const moduleTitle = lmsModuleTitle(programme, unit, topic);
  if (moduleTitle && moduleTitle !== lmsCourseTitle(programme, unit)) {
    questions.push({
      prompt: `Which module does this lesson belong to?`,
      answer: moduleTitle,
      choices: rotateChoices([
        moduleTitle,
        lmsCourseTitle(programme, unit),
        programme.label,
        `Clinical Practice`
      ].filter((v, i, a) => v && a.indexOf(v) === i).slice(0, 4), 2),
      explanation: `This lesson is in the "${moduleTitle}" module.`
    });
  }

  const seen = new Set();
  return questions.filter((q) => {
    if (seen.has(q.prompt)) return false;
    seen.add(q.prompt);
    return true;
  }).slice(0, 15);
}

function buildUnitQuizQuestions(programme, unit) {
  const topics = flatTopics(unit);
  const all = [];
  for (const topic of topics) {
    const lesson = lessonForTopic(programme, unit, topic);
    if (!lesson) continue;
    const qs = buildLessonQuizQuestions(lesson, programme, unit, topic);
    all.push(...qs.slice(0, 3));
    if (all.length >= 35) break;
  }
  const seed = programme.id + unit.id;
  const shuffled = deterministicShuffle(all, seed);
  const seen = new Set();
  return shuffled.filter((q) => {
    if (seen.has(q.prompt)) return false;
    seen.add(q.prompt);
    return true;
  }).slice(0, 25);
}

// ═══════════════════════════════════════════════════════════════════════════
//  MOCK EXAM ENGINE
// ═══════════════════════════════════════════════════════════════════════════

const MOCK_EXAMS = [
  {
    id: "full-paper-a",
    title: "Full Paper, Series A",
    desc: "80 questions across all nursing subjects. Mirrors BNE exam standard.",
    duration: 120, count: 80, icon: "clipboardList",
    badge: "Full Paper", color: "#00B5BD"
  },
  {
    id: "full-paper-b",
    title: "Full Paper, Series B",
    desc: "A second 80-question mixed paper, different question set from Series A.",
    duration: 120, count: 80, icon: "clipboardList",
    badge: "Full Paper", color: "#00B5BD"
  },
  {
    id: "practice-50",
    title: "Practice Test, 50 Questions",
    desc: "50 mixed questions in 60 minutes. Great for a focused revision session.",
    duration: 60, count: 50, icon: "checkCircle",
    badge: "Practice", color: "#2563eb"
  },
  {
    id: "speed-30",
    title: "Speed Round, 30 Questions",
    desc: "30 questions in 30 minutes. Builds speed and recall under pressure.",
    duration: 30, count: 30, icon: "flame",
    badge: "Speed Round", color: "#d97706"
  },
  {
    id: "subject-anatomy",
    title: "Anatomy & Physiology",
    desc: "Focused on body systems, anatomy and physiology. 60 questions, 90 min.",
    duration: 90, count: 60, icon: "activity",
    badge: "Subject", color: "#7c3aed",
    subjectPattern: "anatomy|physiology"
  },
  {
    id: "subject-pharmacology",
    title: "Pharmacology",
    desc: "Drugs, dosages, mechanisms and nursing responsibilities. 50 questions, 75 min.",
    duration: 75, count: 50, icon: "pill",
    badge: "Subject", color: "#dc2626",
    subjectPattern: "pharmacology|drug|medicine"
  }
];

let _mockExamTimer = null;

// ═══════════════════════════════════════════════════════════════════════════
//  CLINICAL TOOLS DATA
// ═══════════════════════════════════════════════════════════════════════════

const CLINICAL_CHECKLISTS = [
  {
    id: "hand-hygiene", title: "Hand Hygiene, WHO 6-Step",
    category: "Infection Control", icon: "heartPulse",
    steps: [
      { text: "Wet hands with running water; apply enough soap to cover all surfaces" },
      { text: "Rub palms together, palm to palm", critical: true },
      { text: "Rub right palm over left dorsum with interlaced fingers, then vice versa" },
      { text: "Rub palm to palm with fingers interlaced" },
      { text: "Rub back of fingers to opposing palms (fingers interlocked)" },
      { text: "Rotational rubbing of right thumb clasped in left palm, then vice versa" },
      { text: "Rotational rubbing of right fingertips in left palm, then vice versa" },
      { text: "Rinse hands thoroughly under running water", critical: true },
      { text: "Dry thoroughly with a single-use towel", critical: true },
      { text: "Use towel to turn off faucet. Total duration: 40–60 seconds" }
    ]
  },
  {
    id: "vital-signs", title: "Vital Signs Assessment",
    category: "Assessment", icon: "activity",
    steps: [
      { text: "Wash hands / apply gloves as appropriate", critical: true },
      { text: "Explain procedure to patient and gain consent" },
      { text: "Measure temperature (oral / axillary / tympanic)" },
      { text: "Count radial pulse for 60 seconds, note rate, rhythm, volume", critical: true },
      { text: "Count respirations for 60 seconds, note rate, depth, pattern", critical: true },
      { text: "Measure blood pressure, correct cuff size, arm at heart level" },
      { text: "Record SpO₂ with pulse oximeter" },
      { text: "Assess pain using numeric or visual analogue scale" },
      { text: "Record and document all findings accurately", critical: true },
      { text: "Report any abnormal findings to senior staff immediately" }
    ]
  },
  {
    id: "bp-measurement", title: "Blood Pressure Measurement",
    category: "Assessment", icon: "stethoscope",
    steps: [
      { text: "Explain procedure; have patient rest quietly for ≥ 5 minutes", critical: true },
      { text: "Patient seated, feet flat on floor, arm supported at heart level" },
      { text: "Select correct cuff: bladder covers ≥ 80% of arm circumference", critical: true },
      { text: "Apply cuff 2–3 cm above antecubital fossa" },
      { text: "Locate brachial artery; place stethoscope bell/diaphragm over it" },
      { text: "Inflate cuff 30 mmHg above point where radial pulse disappears", critical: true },
      { text: "Deflate slowly at ~2 mmHg/sec; note Korotkoff Phase I (systolic)" },
      { text: "Note Korotkoff Phase V, disappearance of sound (diastolic)", critical: true },
      { text: "Fully deflate cuff. Wait ≥ 2 min before repeating" },
      { text: "Record: reading, arm used, position, cuff size and time" }
    ]
  },
  {
    id: "im-injection", title: "Intramuscular Injection",
    category: "Medications", icon: "syringe",
    steps: [
      { text: "Check prescription, 5 Rights: patient, drug, dose, route, time", critical: true },
      { text: "Gather: correct gauge needle (21–23G, 2.5–3.8 cm), syringe, swab, gloves" },
      { text: "Wash hands and apply gloves" },
      { text: "Draw up medication using aseptic technique", critical: true },
      { text: "Select site: deltoid / vastus lateralis / ventrogluteal / dorsogluteal" },
      { text: "Clean site with 70% alcohol swab, allow to air-dry 30 seconds" },
      { text: "Spread or bunch skin as appropriate for the muscle selected" },
      { text: "Insert needle at 90° in one smooth motion", critical: true },
      { text: "Aspirate 5–10 seconds, if blood appears, withdraw and restart", critical: true },
      { text: "Inject slowly (~10 seconds per mL)" },
      { text: "Withdraw needle at same angle; apply light pressure, do NOT rub" },
      { text: "Dispose of needle in sharps bin immediately, do NOT re-cap", critical: true },
      { text: "Document administration in medication record" }
    ]
  },
  {
    id: "iv-cannulation", title: "IV Cannulation",
    category: "IV Therapy", icon: "activity",
    steps: [
      { text: "Confirm prescription; explain procedure; gain informed consent", critical: true },
      { text: "Prepare: cannula (correct gauge), tegaderm, tape, flush syringe" },
      { text: "Select vein: antecubital, cephalic, basilic, or dorsal hand veins" },
      { text: "Apply tourniquet 10 cm above selected site" },
      { text: "Clean site with 2% chlorhexidine swab, allow to fully dry", critical: true },
      { text: "Apply sterile gloves; stabilise vein with non-dominant hand" },
      { text: "Insert cannula bevel-up at 10–30°; confirm flashback of blood", critical: true },
      { text: "Lower angle, advance cannula off stylet, then withdraw stylet fully" },
      { text: "Release tourniquet; apply finger pressure above cannula tip" },
      { text: "Attach cap or extension set; flush with 5–10 mL normal saline", critical: true },
      { text: "Secure with transparent dressing; label with date, time, gauge, initials" },
      { text: "Document cannula insertion and site assessment in nursing notes" }
    ]
  },
  {
    id: "wound-dressing", title: "Wound Dressing (Aseptic Technique)",
    category: "Wound Care", icon: "heartPulse",
    steps: [
      { text: "Review prescription; explain procedure to patient" },
      { text: "Gather: sterile dressing pack, appropriate dressing, clean gloves, sterile gloves" },
      { text: "Wash hands thoroughly; position patient comfortably" },
      { text: "Open sterile pack using aseptic corners, maintain sterile field", critical: true },
      { text: "Apply clean gloves; remove old dressing; observe and assess wound" },
      { text: "Remove clean gloves; wash hands; apply sterile gloves", critical: true },
      { text: "Irrigate wound with normal saline if required" },
      { text: "Dry wound edges gently with sterile gauze" },
      { text: "Apply appropriate dressing according to wound type" },
      { text: "Secure dressing; label with date, time, nurse initials" },
      { text: "Document wound assessment: size, depth, exudate, surrounding skin" }
    ]
  },
  {
    id: "urinary-catheter", title: "Female Urinary Catheterisation",
    category: "Procedures", icon: "stethoscope",
    steps: [
      { text: "Confirm prescription; explain procedure; gain informed consent", critical: true },
      { text: "Gather: catheter pack, correct size catheter (12–14 Fr), sterile water for balloon" },
      { text: "Position: supine with knees bent, legs apart, good light source" },
      { text: "Wash hands; apply clean gloves; open sterile pack aseptically" },
      { text: "Pour sterile saline/water; apply sterile gloves; place sterile drape", critical: true },
      { text: "Cleanse labia majora front to back, discard each swab after single use", critical: true },
      { text: "Cleanse labia minora front to back; then cleanse urethral meatus" },
      { text: "Place sterile receiver between patient's legs" },
      { text: "Insert lubricated catheter gently until urine flows; advance 5 cm further", critical: true },
      { text: "Inflate balloon with prescribed volume of sterile water (usually 10 mL)" },
      { text: "Gently withdraw catheter to confirm balloon is seated at bladder neck" },
      { text: "Connect to drainage bag; secure catheter to inner thigh; document" }
    ]
  },
  {
    id: "ngt-insertion", title: "Nasogastric Tube Insertion",
    category: "Procedures", icon: "stethoscope",
    steps: [
      { text: "Confirm prescription; explain procedure; gain consent", critical: true },
      { text: "Gather: NGT (correct size), lubricant, pH strips, tape, drainage bag" },
      { text: "Position: high Fowler's (45–90°) unless contraindicated" },
      { text: "Check nostrils for obstruction, select wider nostril" },
      { text: "Measure NEX (Nose–Earlobe–Xiphoid) for insertion length; mark tube" },
      { text: "Wash hands, apply gloves; lubricate tube tip generously" },
      { text: "Insert gently via nostril, aiming toward ear on same side" },
      { text: "Ask patient to swallow as tube passes pharynx; advance to marked point", critical: true },
      { text: "STOP immediately if resistance, coughing or respiratory distress", critical: true },
      { text: "Confirm position: aspirate content; test pH, must be ≤ 5.5", critical: true },
      { text: "Unconscious patients: confirm by chest X-ray before any use" },
      { text: "Secure tube to nose with tape; document position confirmation method and length" }
    ]
  },
  {
    id: "oxygen-therapy", title: "Oxygen Administration",
    category: "Respiratory", icon: "activity",
    steps: [
      { text: "Confirm prescription: O₂ flow rate, target SpO₂, delivery device", critical: true },
      { text: "Assess baseline: SpO₂, respiratory rate, colour, consciousness" },
      { text: "Select delivery device: nasal cannula / simple mask / non-rebreathe / Venturi" },
      { text: "Check oxygen supply, cylinder level or wall outlet working" },
      { text: "Set prescribed flow rate on flow meter" },
      { text: "Apply device correctly to patient; check fit and comfort" },
      { text: "Monitor SpO₂ continuously; document baseline and ongoing response", critical: true },
      { text: "Titrate to target SpO₂: 94–98% adults; 88–92% COPD/hypercapnic patients", critical: true },
      { text: "Reassess every 30 minutes or as per ward protocol" },
      { text: "Document: device used, flow rate, SpO₂, RR, time and clinical response" }
    ]
  },
  {
    id: "blood-glucose", title: "Blood Glucose Monitoring",
    category: "Assessment", icon: "activity",
    steps: [
      { text: "Confirm frequency and prescription" },
      { text: "Explain procedure to patient" },
      { text: "Wash hands; apply clean gloves" },
      { text: "Prepare glucometer, insert test strip; check expiry date", critical: true },
      { text: "Warm patient's finger; clean with alcohol swab; allow to dry" },
      { text: "Use lancet on side of fingertip, apply gentle pressure for blood drop" },
      { text: "Apply blood to test strip, ensure adequate sample", critical: true },
      { text: "Read and note result; note time and patient's last meal" },
      { text: "Apply pressure to puncture site" },
      { text: "Dispose of lancet and strip in sharps/clinical waste", critical: true },
      { text: "Document result; report abnormal values immediately" }
    ]
  }
];

const NORMAL_VALUES_DATA = {
  vitals: {
    label: "Vital Signs",
    icon: "heartPulse",
    items: [
      { name: "Blood Pressure (adult)", value: "90–120 / 60–80", unit: "mmHg", note: "Hypertension ≥ 140/90 mmHg" },
      { name: "Heart Rate (adult)", value: "60–100", unit: "bpm", note: "Tachycardia > 100; bradycardia < 60" },
      { name: "Respiratory Rate (adult)", value: "12–20", unit: "breaths/min", note: "Tachypnoea > 20; bradypnoea < 12" },
      { name: "Temperature, oral", value: "36.1–37.2", unit: "°C", note: "Fever ≥ 38.0°C; hypothermia < 35°C" },
      { name: "Temperature, axillary", value: "35.9–36.7", unit: "°C", note: "0.5°C lower than oral" },
      { name: "SpO₂ (adult)", value: "94–100", unit: "%", note: "Below 94% requires assessment" },
      { name: "SpO₂ (COPD / hypercapnic)", value: "88–92", unit: "%", note: "Higher SpO₂ may suppress hypoxic drive" },
      { name: "GCS (normal adult)", value: "15", unit: "/15", note: "E4 V5 M6. Severe injury ≤ 8" }
    ]
  },
  paediatric: {
    label: "Paediatric Vitals",
    icon: "users",
    items: [
      { name: "Newborn HR", value: "100–160", unit: "bpm" },
      { name: "Infant HR (1–12 months)", value: "90–160", unit: "bpm" },
      { name: "Toddler HR (1–3 years)", value: "80–140", unit: "bpm" },
      { name: "School age HR (6–12 years)", value: "70–120", unit: "bpm" },
      { name: "Newborn RR", value: "30–60", unit: "breaths/min" },
      { name: "Infant RR (1–12 months)", value: "24–40", unit: "breaths/min" },
      { name: "Toddler RR (1–3 years)", value: "20–30", unit: "breaths/min" },
      { name: "School age RR (6–12 years)", value: "16–22", unit: "breaths/min" },
      { name: "Newborn Temp", value: "36.5–37.5", unit: "°C" },
      { name: "Newborn BP (systolic)", value: "60–90", unit: "mmHg" },
      { name: "Child BP, estimate", value: "80 + (2 × age yrs)", unit: "mmHg systolic", note: "Rule of thumb for systolic" },
      { name: "Paediatric SpO₂", value: "95–100", unit: "%" }
    ]
  },
  haematology: {
    label: "Haematology",
    icon: "activity",
    items: [
      { name: "Haemoglobin, male", value: "13.5–17.5", unit: "g/dL", note: "Anaemia < 13 g/dL in males" },
      { name: "Haemoglobin, female", value: "12.0–15.5", unit: "g/dL", note: "Anaemia < 12 g/dL in females" },
      { name: "Haematocrit, male", value: "41–53", unit: "%" },
      { name: "Haematocrit, female", value: "36–46", unit: "%" },
      { name: "WBC (total)", value: "4.5–11.0", unit: "×10³/μL", note: "Leukocytosis > 11; leucopenia < 4.5" },
      { name: "Neutrophils", value: "2.0–7.5", unit: "×10³/μL", note: "60–70% of WBC" },
      { name: "Lymphocytes", value: "1.0–3.5", unit: "×10³/μL", note: "20–40% of WBC" },
      { name: "Platelets", value: "150–400", unit: "×10³/μL", note: "Thrombocytopenia < 150; thrombocytosis > 400" },
      { name: "MCV", value: "80–100", unit: "fL", note: "Microcytic < 80; macrocytic > 100" },
      { name: "MCH", value: "27–33", unit: "pg" },
      { name: "ESR (male)", value: "0–15", unit: "mm/hr" },
      { name: "ESR (female)", value: "0–20", unit: "mm/hr" }
    ]
  },
  chemistry: {
    label: "Blood Chemistry",
    icon: "clipboardList",
    items: [
      { name: "Blood Glucose, fasting", value: "3.9–5.6", unit: "mmol/L", note: "6.1–6.9 = impaired fasting glucose; ≥ 7.0 = diabetes" },
      { name: "Blood Glucose, random", value: "3.9–7.8", unit: "mmol/L", note: "≥ 11.1 mmol/L = diagnostic of diabetes mellitus" },
      { name: "Sodium (Na⁺)", value: "135–145", unit: "mEq/L", note: "Hyponatraemia < 135; hypernatraemia > 145" },
      { name: "Potassium (K⁺)", value: "3.5–5.0", unit: "mEq/L", note: "Hypokalaemia < 3.5; hyperkalaemia > 5.0" },
      { name: "Chloride (Cl⁻)", value: "95–105", unit: "mEq/L" },
      { name: "Bicarbonate (HCO₃⁻)", value: "22–29", unit: "mEq/L" },
      { name: "Urea (BUN)", value: "2.5–7.1", unit: "mmol/L", note: "Elevated in renal impairment and dehydration" },
      { name: "Creatinine, male", value: "62–115", unit: "μmol/L" },
      { name: "Creatinine, female", value: "44–97", unit: "μmol/L" },
      { name: "Total Calcium (Ca²⁺)", value: "2.15–2.55", unit: "mmol/L", note: "Hypocalcaemia < 2.15; hypercalcaemia > 2.55" },
      { name: "Magnesium (Mg²⁺)", value: "0.75–1.0", unit: "mmol/L" },
      { name: "Total Protein", value: "60–80", unit: "g/L" },
      { name: "Albumin", value: "35–50", unit: "g/L", note: "Hypoalbuminaemia < 35; indicates malnutrition/liver disease" }
    ]
  },
  abg: {
    label: "Arterial Blood Gas",
    icon: "activity",
    items: [
      { name: "pH", value: "7.35–7.45", unit: "", note: "Acidosis < 7.35; alkalosis > 7.45" },
      { name: "PaO₂", value: "80–100", unit: "mmHg", note: "Hypoxaemia < 80 mmHg on room air" },
      { name: "PaCO₂", value: "35–45", unit: "mmHg", note: "Hypocapnia < 35; hypercapnia > 45" },
      { name: "HCO₃⁻", value: "22–26", unit: "mEq/L" },
      { name: "SaO₂", value: "95–100", unit: "%" },
      { name: "Base Excess", value: "−2 to +2", unit: "mEq/L", note: "Metabolic component of acid-base status" }
    ]
  },
  fluids: {
    label: "Fluids & Urine",
    icon: "fileText",
    items: [
      { name: "Urine output (adult)", value: "0.5–1.0", unit: "mL/kg/hr", note: "Oliguria < 0.5 mL/kg/hr; anuria < 100 mL/day" },
      { name: "Urine pH", value: "4.6–8.0", unit: "" },
      { name: "Urine specific gravity", value: "1.005–1.030", unit: "" },
      { name: "Urine protein", value: "Negative", unit: "", note: "Proteinuria suggests renal pathology" },
      { name: "Daily fluid requirement (adult)", value: "30–35", unit: "mL/kg/day", note: "≈ 2,000–2,500 mL/day for average adult" },
      { name: "Normal Saline (0.9% NaCl)", value: "Na⁺ 154 / Cl⁻ 154", unit: "mEq/L", note: "Isotonic. Use for hypovolaemia, hypotension" },
      { name: "Ringer's Lactate", value: "Na 130, K 4, Ca 3, Cl 109", unit: "mEq/L", note: "Balanced isotonic, preferred perioperatively" },
      { name: "5% Dextrose", value: "Glucose 50 g/L", unit: "", note: "Hypotonic once glucose metabolised, not for hypovolaemia" },
      { name: "Half Normal Saline (0.45%)", value: "Na⁺ 77 / Cl⁻ 77", unit: "mEq/L", note: "Hypotonic maintenance fluid" }
    ]
  }
};

// ═══════════════════════════════════════════════════════════════════════════
//  CLINICAL TOOLS: CALC CONFIGS & HELPERS
// ═══════════════════════════════════════════════════════════════════════════

const CALC_CONFIGS = {
  tablet: {
    label: "Tablet / Capsule Dose",
    icon: "pill",
    fields: [
      { id: "dose-ordered",   label: "Dose ordered",    placeholder: "e.g. 500", unit: "mg" },
      { id: "dose-available", label: "Dose per tablet", placeholder: "e.g. 250", unit: "mg" }
    ],
    formula: "Tablets = Dose ordered ÷ Dose per tablet",
    compute(v) {
      const ordered   = parseFloat(v["dose-ordered"]);
      const available = parseFloat(v["dose-available"]);
      if (!ordered || !available || available === 0) return null;
      return { value: +(ordered / available).toFixed(3), unit: "tablet(s)", label: "Tablets to give" };
    }
  },
  liquid: {
    label: "Liquid / Syrup Dose",
    icon: "stethoscope",
    fields: [
      { id: "dose-ordered",     label: "Dose ordered",       placeholder: "e.g. 250", unit: "mg" },
      { id: "dose-available",   label: "Drug concentration", placeholder: "e.g. 125", unit: "mg" },
      { id: "volume-available", label: "Volume per dose",    placeholder: "e.g. 5",   unit: "mL" }
    ],
    formula: "Volume = (Dose ordered ÷ Drug concentration) × Volume per dose",
    compute(v) {
      const ordered   = parseFloat(v["dose-ordered"]);
      const available = parseFloat(v["dose-available"]);
      const volume    = parseFloat(v["volume-available"]);
      if (!ordered || !available || !volume || available === 0) return null;
      return { value: +((ordered / available) * volume).toFixed(2), unit: "mL", label: "Volume to give" };
    }
  },
  drip: {
    label: "IV Drip Rate",
    icon: "activity",
    fields: [
      { id: "volume-ml",   label: "Total volume",   placeholder: "e.g. 1000", unit: "mL" },
      { id: "time-hours",  label: "Time to infuse", placeholder: "e.g. 8",    unit: "hours" },
      { id: "drop-factor", label: "Drop factor",    placeholder: "e.g. 20",   unit: "drops/mL" }
    ],
    formula: "Drops/min = (Volume × Drop factor) ÷ (Time × 60)",
    compute(v) {
      const vol  = parseFloat(v["volume-ml"]);
      const time = parseFloat(v["time-hours"]);
      const df   = parseFloat(v["drop-factor"]);
      if (!vol || !time || !df || time === 0) return null;
      return { value: +((vol * df) / (time * 60)).toFixed(1), unit: "drops/min", label: "Drip rate" };
    }
  },
  flow: {
    label: "IV Flow Rate (mL/hr)",
    icon: "chartLine",
    fields: [
      { id: "volume-ml",  label: "Total volume",   placeholder: "e.g. 500", unit: "mL" },
      { id: "time-hours", label: "Time to infuse", placeholder: "e.g. 4",   unit: "hours" }
    ],
    formula: "Flow rate (mL/hr) = Total volume ÷ Time (hours)",
    compute(v) {
      const vol  = parseFloat(v["volume-ml"]);
      const time = parseFloat(v["time-hours"]);
      if (!vol || !time || time === 0) return null;
      return { value: +(vol / time).toFixed(1), unit: "mL/hr", label: "Flow rate" };
    }
  },
  paediatric: {
    label: "Paediatric Dose (mg/kg)",
    icon: "users",
    fields: [
      { id: "weight-kg",        label: "Patient weight",     placeholder: "e.g. 15",  unit: "kg" },
      { id: "dose-per-kg",      label: "Dose per kg",        placeholder: "e.g. 10",  unit: "mg/kg" },
      { id: "dose-available",   label: "Drug concentration", placeholder: "e.g. 250", unit: "mg" },
      { id: "volume-available", label: "Volume per dose",    placeholder: "e.g. 5",   unit: "mL" }
    ],
    formula: "Total dose = Weight × Dose/kg.  Volume = (Total dose ÷ Concentration) × Volume/dose",
    compute(v) {
      const weight    = parseFloat(v["weight-kg"]);
      const dosePerKg = parseFloat(v["dose-per-kg"]);
      if (!weight || !dosePerKg) return null;
      const totalDose = weight * dosePerKg;
      const available = parseFloat(v["dose-available"]);
      const volume    = parseFloat(v["volume-available"]);
      if (!available || !volume || available === 0) {
        return { value: +totalDose.toFixed(2), unit: "mg", label: "Total dose" };
      }
      const vol = (totalDose / available) * volume;
      return { value: +vol.toFixed(2), unit: "mL", label: "Volume to give", extra: "Total dose: " + totalDose.toFixed(1) + " mg" };
    }
  }
};

function computeCalcResult(type, inputs) {
  const cfg = CALC_CONFIGS[type];
  if (!cfg) return null;
  return cfg.compute(inputs);
}

function updateCalcResult() {
  const form     = document.getElementById("ct-calc-form");
  const resultEl = document.getElementById("ct-calc-result");
  if (!form || !resultEl) return;
  const type = state.clinicalTools.calcType;
  const cfg  = CALC_CONFIGS[type];
  if (!cfg) return;
  const inputs = {};
  cfg.fields.forEach(function(f) {
    const el = form.querySelector("[data-calc-field='" + f.id + "']");
    if (el) inputs[f.id] = el.value;
  });
  const result = computeCalcResult(type, inputs);
  if (result) {
    resultEl.innerHTML =
      "<div class='ct-result-value'>" + result.value +
        " <span class='ct-result-unit'>" + escapeHtml(result.unit) + "</span></div>" +
      "<div class='ct-result-label'>" + escapeHtml(result.label) + "</div>" +
      (result.extra ? "<div class='ct-result-extra'>" + escapeHtml(result.extra) + "</div>" : "");
    resultEl.className = "ct-calc-result ct-result-filled";
  } else {
    resultEl.innerHTML = "<div class='ct-result-placeholder'>Enter values above to calculate</div>";
    resultEl.className = "ct-calc-result ct-result-empty";
  }
}

function getChecklistProgress(id) {
  try {
    const all = JSON.parse(localStorage.getItem("nursinguganda.checklists") || "{}");
    return all[id] || {};
  } catch { return {}; }
}

function setChecklistStep(id, index, done) {
  try {
    const all = JSON.parse(localStorage.getItem("nursinguganda.checklists") || "{}");
    if (!all[id]) all[id] = {};
    if (done) all[id][index] = true;
    else delete all[id][index];
    localStorage.setItem("nursinguganda.checklists", JSON.stringify(all));
  } catch {}
}

function resetChecklist(id) {
  try {
    const all = JSON.parse(localStorage.getItem("nursinguganda.checklists") || "{}");
    delete all[id];
    localStorage.setItem("nursinguganda.checklists", JSON.stringify(all));
  } catch {}
}

// ═══════════════════════════════════════════════════════════════════════════
//  STUDY PLANNER HELPERS
// ═══════════════════════════════════════════════════════════════════════════

function getPlannerData() {
  try { return JSON.parse(localStorage.getItem("nursinguganda.planner") || "{}"); }
  catch { return {}; }
}
function setPlannerData(data) {
  try { localStorage.setItem("nursinguganda.planner", JSON.stringify(data)); } catch {}
}
function getPlannerDay(dateStr) {
  return getPlannerData()[dateStr] || [];
}
function addPlannerSession(dateStr, session) {
  const data = getPlannerData();
  if (!data[dateStr]) data[dateStr] = [];
  data[dateStr].push({ id: Date.now().toString(36), done: false, ...session });
  setPlannerData(data);
}
function removePlannerSession(dateStr, sessionId) {
  const data = getPlannerData();
  if (!data[dateStr]) return;
  data[dateStr] = data[dateStr].filter(function(s) { return s.id !== sessionId; });
  if (!data[dateStr].length) delete data[dateStr];
  setPlannerData(data);
}
function togglePlannerSession(dateStr, sessionId) {
  const data = getPlannerData();
  if (!data[dateStr]) return;
  const s = data[dateStr].find(function(s) { return s.id === sessionId; });
  if (s) s.done = !s.done;
  setPlannerData(data);
}
function getTodayPlan() {
  return getPlannerDay(new Date().toISOString().slice(0, 10));
}

// ═══════════════════════════════════════════════════════════════════════════
//  NOTIFICATION HELPERS
// ═══════════════════════════════════════════════════════════════════════════

function getReadAnnouncements() {
  try { return new Set(JSON.parse(localStorage.getItem("nursinguganda.readAnnouncements") || "[]")); }
  catch { return new Set(); }
}
function markAllAnnouncementsRead() {
  const ids = (state.announcements || []).map(function(a) { return a.id; });
  try {
    const existing = getReadAnnouncements();
    ids.forEach(function(id) { existing.add(id); });
    localStorage.setItem("nursinguganda.readAnnouncements", JSON.stringify([...existing]));
  } catch {}
}
function getUnreadAnnouncementCount() {
  const read = getReadAnnouncements();
  return (state.announcements || []).filter(function(a) { return !read.has(a.id); }).length;
}
function getNotifSettings() {
  try { return JSON.parse(localStorage.getItem("nursinguganda.notifSettings") || "{}"); }
  catch { return {}; }
}
function saveNotifSettings(settings) {
  try { localStorage.setItem("nursinguganda.notifSettings", JSON.stringify(settings)); } catch {}
}
function checkStudyReminder() {
  const settings = getNotifSettings();
  if (!settings.reminderEnabled) return;
  if (!("Notification" in window) || Notification.permission !== "granted") return;
  const today = new Date().toISOString().slice(0, 10);
  if (getStudyDates().has(today)) return; // already studied today
  const parts = (settings.reminderTime || "20:00").split(":");
  const rh = parseInt(parts[0], 10);
  const rm = parseInt(parts[1] || "0", 10);
  const now = new Date();
  if (now.getHours() > rh || (now.getHours() === rh && now.getMinutes() >= rm)) {
    const lastDate = localStorage.getItem("nursinguganda.lastReminderDate");
    if (lastDate !== today) {
      localStorage.setItem("nursinguganda.lastReminderDate", today);
      try {
        new Notification("Nursing Uganda, Time to Study! 📚", {
          body: "You haven't studied today. Keep your streak going!",
          icon: "/assets/images/pwa/icon-192x192.png",
          tag: "nu-study-reminder"
        });
      } catch(e) {}
    }
  }
}

function showReminderNudge() {
  if (document.getElementById("nu-reminder-nudge")) return;
  const el = document.createElement("div");
  el.id = "nu-reminder-nudge";
  el.className = "nu-reminder-nudge";
  el.innerHTML = `
    <div class="nu-reminder-nudge-inner">
      <span class="nu-reminder-nudge-icon">${icon("bell")}</span>
      <div class="nu-reminder-nudge-body">
        <strong>Enable study reminders?</strong>
        <p>Get a daily nudge so you never miss a study session.</p>
      </div>
      <div class="nu-reminder-nudge-actions">
        <button class="button primary nu-reminder-yes" type="button">Yes please</button>
        <button class="nu-reminder-no" type="button" aria-label="Dismiss">${icon("x")}</button>
      </div>
    </div>`;
  document.body.appendChild(el);
  requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add("nu-reminder-nudge-visible")));

  function dismiss() {
    el.classList.remove("nu-reminder-nudge-visible");
    el.addEventListener("transitionend", () => el.remove(), { once: true });
  }
  el.querySelector(".nu-reminder-no").addEventListener("click", dismiss);
  el.querySelector(".nu-reminder-yes").addEventListener("click", async () => {
    dismiss();
    const perm = await Notification.requestPermission();
    if (perm === "granted") {
      const ns = getNotifSettings();
      ns.reminderEnabled = true;
      ns.reminderTime = ns.reminderTime || "20:00";
      saveNotifSettings(ns);
      showToast("Study reminders enabled! You can change the time in your Account settings.", "success");
    } else {
      showToast("Permission denied. You can enable reminders in your Account settings.", "error");
    }
  });
  // Auto-dismiss after 12s
  setTimeout(dismiss, 12000);
}

function timeAgo(isoDate) {
  if (!isoDate) return "";
  const diff = Math.floor((Date.now() - new Date(isoDate).getTime()) / 1000);
  if (diff < 60)   return "Just now";
  if (diff < 3600) return Math.floor(diff / 60) + "m ago";
  if (diff < 86400) return Math.floor(diff / 3600) + "h ago";
  const days = Math.floor(diff / 86400);
  if (days < 30) return days + "d ago";
  return new Date(isoDate).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

// ═══════════════════════════════════════════════════════════════════════════
//  COMMUNITY Q&A HELPERS
// ═══════════════════════════════════════════════════════════════════════════

async function communityLoadQuestions() {
  state.community.loading = true;
  render();
  const client = sb();
  if (!client) { state.community.loading = false; render(); return; }
  const { data } = await client
    .from("community_questions")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(60);
  state.community.questions = data || [];
  state.community.loading = false;
  render();
}

async function communityLoadQuestion(id) {
  const client = sb();
  if (!client) return;
  const [qRes, aRes] = await Promise.all([
    client.from("community_questions").select("*").eq("id", id).single(),
    client.from("community_answers").select("*").eq("question_id", id).order("upvotes", { ascending: false })
  ]);
  state.community.selectedQuestion = qRes.data || null;
  state.community.questionAnswers  = aRes.data || [];
  render();
}

async function communityPostQuestion() {
  const client = sb();
  const user   = state.currentUser;
  if (!client || !user) return;
  const title = state.community.askTitle.trim();
  const body  = state.community.askBody.trim();
  if (!title || !body) { showToast("Please enter a title and body.", "error"); return; }
  const { data, error } = await client.from("community_questions").insert({
    user_id: user.id, user_name: user.name, user_initials: user.initials,
    title, body
  }).select().single();
  if (error) { showToast("Could not post question. Try again.", "error"); return; }
  state.community.askFormOpen = false;
  state.community.askTitle    = "";
  state.community.askBody     = "";
  showToast("Question posted!", "success");
  setRoute("/community/" + data.id);
  render();
  communityLoadQuestion(data.id);
}

async function communityPostAnswer(questionId) {
  const client = sb();
  const user   = state.currentUser;
  if (!client || !user) return;
  const body = state.community.answerBody.trim();
  if (!body) { showToast("Please write an answer.", "error"); return; }
  state.community.answerLoading = true;
  render();
  const { data, error } = await client.from("community_answers").insert({
    question_id: questionId, user_id: user.id,
    user_name: user.name, user_initials: user.initials, body
  }).select().single();
  if (error) {
    state.community.answerLoading = false;
    showToast("Could not post answer. Try again.", "error");
    render();
    return;
  }
  // answer_count is incremented automatically by the DB trigger trg_answer_count_inc
  state.community.answerBody    = "";
  state.community.answerLoading = false;
  state.community.questionAnswers = [...state.community.questionAnswers, data];
  if (state.community.selectedQuestion) {
    state.community.selectedQuestion.answer_count = (state.community.selectedQuestion.answer_count || 0) + 1;
    state.community.selectedQuestion.is_answered  = true;
  }
  showToast("Answer posted!", "success");
  render();
}

async function communityUpvote(targetType, targetId) {
  const client = sb();
  if (!client) return;
  requireLogin("community", "Sign in to upvote questions and answers.", async function() {
    // Uses the nu_upvote(target, tid) security-definer RPC defined in the migration
    await client.rpc("nu_upvote", { target: targetType, tid: targetId });
    if (targetType === "question") communityLoadQuestions();
    else if (state.community.selectedQuestion) communityLoadQuestion(state.community.selectedQuestion.id);
  });
}

function findMockExam(id) { return MOCK_EXAMS.find(e => e.id === id) || null; }

function formatMockTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function getAllCurriculumQuestions() {
  if (!state.data?.programmes) return [];
  const all = [];
  for (const programme of state.data.programmes) {
    for (const unit of allUnits(programme)) {
      for (const topic of flatTopics(unit)) {
        const lesson = lessonForTopic(programme, unit, topic);
        if (!lesson) continue;
        const qs = buildLessonQuizQuestions(lesson, programme, unit, topic);
        const subjectTag = `${programme.label || programme.id} ${unit.title || unit.id}`.toLowerCase();
        for (const q of qs) all.push({ ...q, _subject: subjectTag });
      }
    }
  }
  return all;
}

function getMockExamQuestions(exam) {
  let pool = getAllCurriculumQuestions();
  if (exam.subjectPattern) {
    const pat = new RegExp(exam.subjectPattern, "i");
    const filtered = pool.filter(q => pat.test(q._subject));
    if (filtered.length >= Math.ceil(exam.count * 0.4)) pool = filtered;
  }
  const shuffled = deterministicShuffle(pool, exam.id);
  const seen = new Set();
  return shuffled.filter(q => {
    if (seen.has(q.prompt)) return false;
    seen.add(q.prompt);
    return true;
  }).slice(0, exam.count);
}

function getMockExamHistory() {
  try { return JSON.parse(localStorage.getItem("nursinguganda.mockExamHistory") || "[]"); }
  catch { return []; }
}

function saveMockExamState() {
  try {
    const { examId, answers, currentQ, examEndTime } = state.mockExam;
    if (!examId) { localStorage.removeItem("nursinguganda.mockExamInProgress"); return; }
    localStorage.setItem("nursinguganda.mockExamInProgress", JSON.stringify({ examId, answers, currentQ, examEndTime }));
  } catch {}
}

function loadMockExamState() {
  try {
    const saved = JSON.parse(localStorage.getItem("nursinguganda.mockExamInProgress") || "null");
    if (!saved || !saved.examId || !saved.examEndTime) return;
    if (saved.examEndTime <= Date.now()) return; // expired
    const exam = findMockExam(saved.examId);
    if (!exam) return;
    const questions = getMockExamQuestions(exam);
    const timeLeft = Math.max(0, Math.round((saved.examEndTime - Date.now()) / 1000));
    state.mockExam = { examId: saved.examId, questions, answers: saved.answers || {}, currentQ: saved.currentQ || 0, examEndTime: saved.examEndTime, timeLeft, submitted: false, paletteOpen: false };
  } catch {}
}

function startMockExam(examId) {
  const exam = findMockExam(examId);
  if (!exam) return;
  const questions = getMockExamQuestions(exam);
  const examEndTime = Date.now() + exam.duration * 60 * 1000;
  state.mockExam = { examId, questions, answers: {}, currentQ: 0, examEndTime, timeLeft: exam.duration * 60, submitted: false, paletteOpen: false };
  saveMockExamState();
  startMockExamTimer();
  setRoute(`/mock-exams/${examId}`);
  render();
}

function mockExamSetAnswer(qIndex, value) {
  state.mockExam.answers[qIndex] = value;
  saveMockExamState();
}

function mockExamGoto(index) {
  state.mockExam.currentQ = Math.max(0, Math.min(state.mockExam.questions.length - 1, index));
  state.mockExam.paletteOpen = false;
}

function submitMockExam() {
  stopMockExamTimer();
  const me = state.mockExam;
  const exam = findMockExam(me.examId);
  if (!exam || me.submitted) return;
  const score = me.questions.filter((q, i) => quizAnswerCorrect(q, me.answers[i])).length;
  const total = me.questions.length;
  const pct = total ? Math.round((score / total) * 100) : 0;
  const grade = pct >= 80 ? "Distinction" : pct >= 60 ? "Credit" : pct >= 50 ? "Pass" : "Below Pass";
  const timeTaken = exam.duration * 60 - me.timeLeft;
  const result = { examId: me.examId, title: exam.title, score, total, pct, grade, timeTaken, date: new Date().toISOString() };
  // Save to mock history
  const history = getMockExamHistory();
  history.unshift(result);
  localStorage.setItem("nursinguganda.mockExamHistory", JSON.stringify(history.slice(0, 10)));
  // Also push to dashboard quiz history
  const qh = JSON.parse(localStorage.getItem("nursinguganda.quizHistory") || "[]");
  qh.unshift({ key: `mock::${me.examId}`, title: exam.title, score, total, pct, grade, date: result.date });
  localStorage.setItem("nursinguganda.quizHistory", JSON.stringify(qh.slice(0, 20)));
  // Clear in-progress
  localStorage.removeItem("nursinguganda.mockExamInProgress");
  recordStudyDate();
  state.mockExam.submitted = true;
  render();
}

function startMockExamTimer() {
  clearInterval(_mockExamTimer);
  _mockExamTimer = setInterval(() => {
    const me = state.mockExam;
    if (!me.examId || me.submitted) { clearInterval(_mockExamTimer); return; }
    me.timeLeft = Math.max(0, Math.round((me.examEndTime - Date.now()) / 1000));
    // Update timer display directly: no full re-render
    const timerEl = document.getElementById("me-timer");
    if (timerEl) timerEl.textContent = formatMockTime(me.timeLeft);
    const barEl = document.getElementById("me-timer-bar");
    if (barEl) {
      const exam = findMockExam(me.examId);
      if (exam) barEl.style.width = Math.round((me.timeLeft / (exam.duration * 60)) * 100) + "%";
    }
    // Colour warning when < 5 min
    const headerEl = document.getElementById("me-header");
    if (headerEl) headerEl.classList.toggle("me-warning", me.timeLeft > 0 && me.timeLeft <= 300);
    if (me.timeLeft === 0) { clearInterval(_mockExamTimer); submitMockExam(); }
  }, 1000);
}

function stopMockExamTimer() { clearInterval(_mockExamTimer); _mockExamTimer = null; }

/* ── Quiz sidebar (reusable: used by all standalone quiz pages) ── */
function renderQuizSidebar(title, questions, attempt, isSubmitted) {
  const total = questions.length;
  const attempted = questions.filter((_, i) => attempt[i] !== undefined).length;
  const remaining = total - attempted;
  const progressPct = total > 0 ? Math.round((attempted / total) * 100) : 0;

  let correctCount = 0, wrongCount = 0, score = 0, pct = 0, grade = "", gradeClass = "";
  if (isSubmitted) {
    correctCount = questions.filter((q, i) => quizAnswerCorrect(q, attempt[i])).length;
    wrongCount = attempted - correctCount;
    score = correctCount;
    pct = total > 0 ? Math.round((score / total) * 100) : 0;
    grade     = pct >= 80 ? "Distinction" : pct >= 60 ? "Credit" : pct >= 50 ? "Pass" : "Below Pass";
    gradeClass = pct >= 80 ? "grade-distinction" : pct >= 60 ? "grade-credit" : pct >= 50 ? "grade-pass" : "grade-fail";
  }

  const status      = !attempted ? "Not Started" : isSubmitted ? "Completed" : "In Progress";
  const statusClass = !attempted ? "qsp-idle" : isSubmitted ? "qsp-done" : "qsp-active";

  return `
    <div class="quiz-sidebar-panel">
      <div class="qsp-header">
        ${icon("listChecks")}<span>Quiz Progress</span>
      </div>
      <span class="qsp-status-badge ${statusClass}">${status}</span>

      <div class="qsp-stat-group">
        <div class="qsp-stat-row">
          <span class="qsp-stat-label">Total questions</span>
          <strong class="qsp-stat-val">${total}</strong>
        </div>
        <div class="qsp-stat-row">
          <span class="qsp-stat-label">Attempted</span>
          <strong class="qsp-stat-val">${attempted}</strong>
        </div>
        <div class="qsp-stat-row">
          <span class="qsp-stat-label">Remaining</span>
          <strong class="qsp-stat-val${remaining > 0 && !isSubmitted ? " qsp-remaining" : ""}">${remaining}</strong>
        </div>
      </div>

      <div class="qsp-progress-block">
        <div class="qsp-progress-top">
          <span>Completion</span><span>${progressPct}%</span>
        </div>
        <div class="progress-bar slim"><span style="width:${progressPct}%"></span></div>
      </div>

      ${isSubmitted ? `
        <div class="qsp-results-block">
          <div class="qsp-results-divider"></div>
          <div class="qsp-stat-row qsp-score-row">
            <span class="qsp-stat-label">Score</span>
            <strong class="qsp-stat-val qsp-score-big">${score} / ${total}</strong>
          </div>
          <div class="qsp-stat-row">
            <span class="qsp-stat-label qsp-label-correct">${icon("checkCircle")} Correct</span>
            <strong class="qsp-stat-val qsp-correct-val">${correctCount}</strong>
          </div>
          <div class="qsp-stat-row">
            <span class="qsp-stat-label qsp-label-wrong">${icon("xCircle")} Wrong</span>
            <strong class="qsp-stat-val qsp-wrong-val">${wrongCount}</strong>
          </div>
          <div class="qsp-grade-display ${gradeClass}">
            <span class="qsp-pct-big">${pct}%</span>
            <span class="qsp-grade-name">${grade}</span>
          </div>
        </div>
      ` : `
        <p class="qsp-hint">${attempted > 0 ? "Keep going. Submit when ready." : "Select your answers, then click Submit."}</p>
      `}
    </div>
  `;
}

function renderStandaloneQuizPage(title, subtitle, questions, quizKey, backHref, backLabel) {
  // Cache context so the submit handler can build the email payload
  _quizCtx = { title, subtitle: subtitle || "", questions: questions || [] };

  const attempt      = quizAttempts()[quizKey] || {};
  const isSubmitted  = !!quizSubmitted()[quizKey];
  const answeredCount = questions.filter((_, i) => attempt[i] !== undefined).length;
  const unanswered   = questions.length - answeredCount;

  const score    = isSubmitted ? questions.filter((q, i) => quizAnswerCorrect(q, attempt[i])).length : 0;
  const pct       = isSubmitted && questions.length ? Math.round((score / questions.length) * 100) : 0;
  const grade     = pct >= 80 ? "Distinction" : pct >= 60 ? "Credit" : pct >= 50 ? "Pass" : "Below Pass";
  const gradeClass = pct >= 80 ? "grade-distinction" : pct >= 60 ? "grade-credit" : pct >= 50 ? "grade-pass" : "grade-fail";

  return `
    <section class="standalone-quiz-page">
      <div class="container">
        <nav class="quiz-breadcrumb" aria-label="Breadcrumb">
          <a href="${escapeHtml(backHref)}">${icon("arrowLeft")}<span>${escapeHtml(backLabel)}</span></a>
        </nav>
        <div class="quiz-page-head">
          <div>
            <span class="mini-label">Quiz</span>
            <h1>${escapeHtml(title)}</h1>
            ${subtitle ? `<p class="quiz-subtitle">${escapeHtml(subtitle)}</p>` : ""}
          </div>
          <div class="quiz-page-meta">
            <span>${questions.length} questions</span>
            ${isSubmitted
              ? `<span class="quiz-grade-chip ${gradeClass}">${grade} &bull; ${score}/${questions.length} (${pct}%)</span>`
              : `<span>${answeredCount} of ${questions.length} answered</span>`}
          </div>
        </div>

        ${isSubmitted ? `
          <div class="quiz-result-banner ${gradeClass}">
            <div class="quiz-result-score">${icon("trophy")}<strong>${score}/${questions.length}</strong><span>${pct}%</span></div>
            <div class="quiz-result-detail">
              <strong>${grade}</strong>
              <p>${pct >= 80 ? "Outstanding, excellent work." : pct >= 60 ? "Good understanding, keep revising." : pct >= 50 ? "Satisfactory, review explanations below." : "Keep studying: the explanations below will help."}</p>
              <button type="button" class="button secondary" data-reset-quiz="${escapeHtml(quizKey)}">${icon("rotateCcw")}<span>Retake Quiz</span></button>
              <button type="button" class="button ghost quiz-email-btn" data-email-quiz="${escapeHtml(quizKey)}">${icon("mail")}<span>Email Results</span></button>
              <a class="button ghost quiz-wa-share" href="${waShare(`🏆 I scored ${score}/${questions.length} (${pct}%) on "${title}" quiz on Nursing Uganda!\n\nTest yourself 👉 https://nursinguganda.com${window.location.pathname}`)}" target="_blank" rel="noopener noreferrer">${icon("whatsapp")}<span>Share on WhatsApp</span></a>
            </div>
          </div>
        ` : ""}

        <div class="quiz-layout">
          <!-- ── Main content ── -->
          <div class="quiz-main">
            <div class="standalone-quiz-list">
              ${questions.map((question, qi) => {
                const selected = attempt[qi];
                const answered  = selected !== undefined;
                const correct   = isSubmitted ? quizAnswerCorrect(question, selected) : null;
                const stateClass = isSubmitted && answered ? (correct ? " answered-correct" : " answered-wrong") : "";
                return `
                  <article class="sq-question${stateClass}" id="sq-${qi}">
                    <div class="sq-number">${qi + 1}</div>
                    <div class="sq-body">
                      <p class="sq-prompt">${escapeHtml(question.prompt)}</p>
                      <div class="quiz-options sq-options">
                        ${question.choices.map((choice, ci) => {
                          const isSel   = Number(selected) === ci;
                          const isCor   = isSubmitted && choice === question.answer;
                          const isWrong = isSubmitted && isSel && !isCor;
                          const cls     = isCor ? " correct" : isWrong ? " wrong" : "";
                          return `<button type="button" class="quiz-option${isSel ? " selected" : ""}${cls}" data-quiz-key="${escapeHtml(quizKey)}" data-quiz-question="${qi}" data-quiz-answer="${ci}" ${isSubmitted ? "disabled" : ""}>
                            <span class="qo-letter">${String.fromCharCode(65 + ci)}</span>
                            <span class="qo-text">${escapeHtml(choice)}</span>
                          </button>`;
                        }).join("")}
                      </div>
                      ${isSubmitted ? `
                        <div class="sq-explanation ${answered && correct ? "correct-text" : "wrong-text"}">
                          ${answered && correct ? icon("checkCircle") : answered ? icon("xCircle") : icon("alertTriangle")}
                          <div>
                            <strong>${answered && correct ? "Correct!" : `${answered ? "Incorrect" : "Not answered"}, correct answer: ${escapeHtml(question.answer)}`}</strong>
                            <p>${escapeHtml(question.explanation)}</p>
                          </div>
                        </div>
                      ` : ""}
                    </div>
                  </article>
                `;
              }).join("")}
            </div>

            ${!isSubmitted && questions.length ? `
              <div class="quiz-submit-zone">
                ${unanswered > 0 ? `
                  <p class="quiz-unanswered-note">
                    ${icon("alertTriangle")}
                    <span>${unanswered} question${unanswered !== 1 ? "s" : ""} still unanswered</span>
                  </p>
                ` : `
                  <p class="quiz-ready-note">
                    ${icon("checkCircle")}<span>All questions answered: ready to submit!</span>
                  </p>
                `}
                <button type="button" class="button primary quiz-submit-btn"
                  data-submit-quiz="${escapeHtml(quizKey)}"
                  data-submit-total="${questions.length}"
                  data-submit-answered="${answeredCount}">
                  ${icon("send")}<span>Submit Quiz</span>
                </button>
              </div>
            ` : ""}

            <div class="quiz-page-footer">
              ${buttonLink(backHref, backLabel, "secondary", "arrowLeft")}
              ${isSubmitted ? `<button type="button" class="button secondary" data-reset-quiz="${escapeHtml(quizKey)}">${icon("rotateCcw")}<span>Retake Quiz</span></button>` : ""}
            </div>
          </div>

          <!-- ── Progress sidebar ── -->
          <div class="quiz-sidebar-col">
            ${renderQuizSidebar(title, questions, attempt, isSubmitted)}
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderLessonQuizPage(programme, unit, topic) {
  const lesson = lessonForTopic(programme, unit, topic);
  const title = lmsLessonTitle(programme, unit, topic);
  const questions = buildLessonQuizQuestions(lesson, programme, unit, topic);
  const quizKey = `quiz-lesson::${topicKey(programme, unit, topic)}`;
  const backHref = topicHref(programme, unit, topic.groupIndex, topic.topicIndex);
  if (!questions.length) {
    return `
      <section class="standalone-quiz-page">
        <div class="container">
          <nav class="quiz-breadcrumb"><a href="${escapeHtml(backHref)}">${icon("arrowLeft")}<span>Back to Lesson</span></a></nav>
          <div class="empty-state"><p>Quiz questions for this lesson are being prepared.</p>${buttonLink(backHref, "Back to Lesson", "secondary", "arrowLeft")}</div>
        </div>
      </section>
    `;
  }
  return renderStandaloneQuizPage(
    title,
    `Test your knowledge: ${questions.length} questions`,
    questions,
    quizKey,
    backHref,
    "Back to Lesson"
  );
}

function renderUnitQuizPage(programme, unit) {
  const courseTitle = lmsCourseTitle(programme, unit);
  const questions = buildUnitQuizQuestions(programme, unit);
  const quizKey = `quiz-unit::${programme.id}::${unit.id}`;
  const backHref = `/courses/${programme.id}/${unit.id}`;
  if (!questions.length) {
    return `
      <section class="standalone-quiz-page">
        <div class="container">
          <nav class="quiz-breadcrumb"><a href="${escapeHtml(backHref)}">${icon("arrowLeft")}<span>Back to Course</span></a></nav>
          <div class="empty-state"><p>Unit quiz questions are being prepared.</p>${buttonLink(backHref, "Back to Course", "secondary", "arrowLeft")}</div>
        </div>
      </section>
    `;
  }
  return renderStandaloneQuizPage(
    `${courseTitle}: Unit Review Quiz`,
    `Covers all lessons in this course unit: ${questions.length} questions`,
    questions,
    quizKey,
    backHref,
    "Back to Course"
  );
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
        <div class="lesson-quiz-callout">
          <div class="lesson-quiz-callout-text">
            ${icon("helpCircle")}
            <div>
              <strong>Test your knowledge</strong>
              <p>Take the quiz for this lesson to check your understanding.</p>
            </div>
          </div>
          ${buttonLink(quizPageHref(programme, unit, topic), "Take Lesson Quiz", "primary", "helpCircle")}
        </div>
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
    ${renderResourceDownloadsSection()}
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
  const params = new URLSearchParams(window.location.search);
  if (params.get("unlock") === "1") localStorage.setItem("nursinguganda.adminMode", "1");
  if (localStorage.getItem("nursinguganda.adminMode") !== "1") {
    return `
      <section class="section">
        <div class="container">
          <div class="empty-state" style="padding:4rem 1rem;text-align:center">
            <p>This tool is for authorized content reviewers only.</p>
            ${buttonLink("/resources", "Back to Resources", "primary", "arrowLeft")}
          </div>
        </div>
      </section>
    `;
  }
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

const CAREER_HERO_SLIDES = [
  { src: "/assets/images/careers/nursing-uganda-careers-hero-premium-01.webp", pos: "center center" },
];

function renderCareerHero() {
  const activeSlide = state.careerHeroSlide || 0;

  return `
    <section class="careers-hero" id="careers-hero-section">

      <!-- Slideshow background -->
      <div class="careers-hero-slides" aria-hidden="true">
        ${CAREER_HERO_SLIDES.map((slide, i) => `
          <div class="careers-hero-slide${i === activeSlide ? " active" : ""}"
               style="background-image:url('${escapeHtml(slide.src)}');background-position:${slide.pos}">
          </div>`).join("")}
        <div class="careers-hero-overlay"></div>
      </div>

      <!-- Content -->
      <div class="container careers-hero-inner">

        <div class="careers-hero-content">
          <nav class="careers-breadcrumb" aria-label="Breadcrumb">
            <a href="/notes">Home</a><span>${icon("arrowRight")}</span><strong>Careers</strong>
          </nav>
          <p class="careers-hero-eyebrow">${icon("graduationCap")} Uganda Nursing &amp; Midwifery Careers</p>
          <h1>Plan Your<br><span>Nursing Career</span></h1>
          <p class="careers-hero-body">Career pathways, UNMC licensing, work-abroad requirements and
            ready-to-use CV, cover letter and interview templates, for Uganda nursing and midwifery professionals.</p>
          <div class="careers-hero-actions">
            <a class="careers-cta-primary" href="/careers#career-pathways" data-nav>
              ${icon("map")} Explore Pathways
            </a>
            <a class="careers-cta-ghost" href="/careers#cv-resources" data-nav>
              ${icon("fileCv")} CV &amp; Letter Templates
            </a>
          </div>
        </div>

      </div>

      <!-- Dot indicators -->
      <div class="careers-hero-dots">
        ${CAREER_HERO_SLIDES.map((_, i) => `
          <button class="careers-hero-dot${i === activeSlide ? " active" : ""}"
                  type="button" data-career-slide="${i}"
                  aria-label="Slide ${i + 1}"></button>`).join("")}
      </div>

    </section>
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
    ["🇬🇧", "United Kingdom", "NHS · NMC Registration", "GBP 28,000-40,000", "NMC", "OSCE + CBT", "Health & Care Worker Visa", ["UNMC Certificate", "IELTS 7.0+", "Good Standing Letter", "Degree preferred"], 3, "6-18 months", "https://www.nmc.org.uk/registration/joining-the-register/nurses-and-midwives/"],
    ["🇦🇺", "Australia", "AHPRA registration", "AUD 75,000-110,000", "AHPRA", "NCLEX / IELTS", "Subclass 190 / 482", ["UNMC registration", "English test", "Skills assessment", "Experience evidence"], 4, "9-24 months", "https://www.ahpra.gov.au/Registration/New-Registrants.aspx"],
    ["🇦🇪", "UAE", "DHA · HAAD · MOH exam", "AED 6,000-10,000", "DHA / DOH / MOH", "Prometric exam", "Employer visa", ["Two years experience", "DataFlow verification", "Good standing", "Agency screening"], 3, "3-9 months", "https://www.dha.gov.ae/en/DHA-Individual-License/Pages/Nurses.aspx"],
    ["🇸🇦", "Saudi Arabia", "SCFHS registration", "SAR 5,000-9,000", "SCFHS", "Prometric exam", "Employer visa", ["Certificate verification", "Experience letters", "Good standing", "Medical check"], 3, "3-10 months", "https://www.scfhs.org.sa/en/Registration/"],
    ["🇶🇦", "Qatar", "QCHP registration", "QAR 8,000-12,000", "QCHP", "Prometric exam", "Employer visa", ["DataFlow", "Experience evidence", "Good standing", "Interview"], 3, "4-10 months", "https://qchp.com.qa/Nurse/"],
    ["🇿🇦", "South Africa", "SANC registration", "ZAR 260,000-430,000", "SANC", "SAQA recognition", "Work visa", ["SAQA evaluation", "Council verification", "Good standing", "English documents"], 4, "9-18 months", "https://www.sanc.co.za/registration/"],
    ["🇰🇪", "Kenya/Tanzania", "EAC mobility", "Regional scale", "National councils", "Council recognition", "Regional work permit", ["UNMC status", "Good standing", "Transcript", "Employer letter"], 2, "2-6 months", "https://www.nursing.or.ke/"]
  ];
}

function renderInternationalGuides() {
  return `
    <section id="international" class="section career-hub-section">
      <div class="container">
        <div class="section-head"><div><h2>Work Abroad as a Nurse</h2><p>Your Uganda qualification can open doors globally. Here's what you need for each destination.</p></div></div>
        <div class="country-grid">
          ${countryGuides().map(([flag, country, subtitle, salary, body, exam, visa, requirements, difficulty, timeline, regUrl]) => `
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
              <a href="${escapeHtml(regUrl)}" target="_blank" rel="noopener noreferrer">Official Registration Guide ${icon("externalLink")}</a>
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

const CAREER_RESOURCE_MAP = {
    "cv-uganda":        { title: "Uganda Nursing CV Template",        icon: "fileCv",       accent: 0, desc: "Hospital, NGO and government CV formats tailored for Uganda nursing practice." },
    "cv-international": { title: "International Nursing CV Template", icon: "globe",        accent: 1, desc: "UK, Australia, Gulf and USA-style CVs with registration and evidence sections." },
    "cover-letter":     { title: "Cover Letter Guide",                icon: "mail",         accent: 2, desc: "Sample nursing cover letters, phrases and structures that win interviews." },
    "interview-prep":   { title: "Interview Preparation",            icon: "users",        accent: 3, desc: "20+ questions, STAR examples, panel prep and values-based interview guides." },
    "portfolio":        { title: "Nursing Portfolio Guide",           icon: "clipboardList",accent: 4, desc: "What to include for registration, CPD, international and senior nursing roles." },
  "salary-guide":     { title: "Salary Guide Uganda 2025",          icon: "banknote",     accent: 5, desc: "Salary ranges by level, speciality, sector and international destination." }
};

function careerResourceFromSlug(slug) {
  return CAREER_RESOURCE_MAP[slug] || null;
}

function careerResourceCount() {
  return Object.keys(CAREER_RESOURCE_MAP).length;
}

function careerResourceSlugOf(title) {
  const map = {
    "Uganda Nursing CV Template":       "cv-uganda",
    "International Nursing CV Template":"cv-international",
    "Cover Letter Guide":               "cover-letter",
    "Interview Preparation":            "interview-prep",
    "Nursing Portfolio Guide":          "portfolio",
    "Salary Guide Uganda 2025":         "salary-guide"
  };
  return map[title] || null;
}

function renderCareerResourcePage(slug) {
  const resource = careerResourceFromSlug(slug);
  if (!resource) return renderCareers();
  const { title, icon: iconName, accent, desc } = resource;
  const templates = RESOURCE_TEMPLATES[title] || [];
  const accentColors = ["#2563EB", "#00B5BD", "#d97706", "#7C3AED", "#ec4899", "#0ea5e9"];
  const accentBgs    = ["#eff6ff", "#e0f7f8", "#fffbeb", "#f5f0ff", "#fdf2f8", "#e0f7ff"];
  const color = accentColors[accent];
  const bg    = accentBgs[accent];

  return `
    <div class="crp-page">
      <div class="container">
        <nav class="page-breadcrumb" aria-label="Breadcrumb">
          <a href="/careers">Careers</a><span>/</span><strong>${escapeHtml(title)}</strong>
        </nav>
      </div>

      <div class="crp-hero" style="--crp-color:${color}">
        <div class="container">
          <div class="crp-hero-inner">
            <div class="crp-hero-icon-wrap" style="background:${bg}">
              <span style="color:${color}">${icon(iconName)}</span>
            </div>
            <div class="crp-hero-copy">
              <p class="crp-eyebrow">Career Resources</p>
              <h1>${escapeHtml(title)}</h1>
              <p class="crp-hero-desc">${escapeHtml(desc)}</p>
              <div class="crp-hero-pills">
                <span>${icon("download")} ${templates.length} free templates</span>
                <span>${icon("fileText")} PDF &amp; DOC formats</span>
                <span>${icon("badgeCheck")} 4 design styles</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="crp-body">
        <div class="container">
          <div class="crp-section-head crp-section-head--flex">
            <div>
              <h2>Choose a Template</h2>
              <p>Download as a formatted PDF or editable Word document in your preferred style.</p>
            </div>
            ${/cv|cover.letter/i.test(title) ? `<button type="button" class="button primary crp-build-cv-btn" data-open-cv-gen>${icon("fileCv")} Build My CV</button>` : ""}
          </div>
          <div class="crp-template-grid">
            ${templates.map((t, i) => {
              const cl = RESOURCE_CHECKLISTS[t.label];
              const items = cl ? cl.items : [];
              const safeSlug = `s-${i}-${t.label.replace(/[^a-z0-9]/gi,"").slice(0,14).toLowerCase()}`;
              return `
                <article class="crp-card">
                  <div class="crp-card-header" style="background:${bg}">
                    <span class="crp-card-num" style="background:${color}">0${i + 1}</span>
                    <span class="crp-card-hicon" style="color:${color}">${icon(iconName)}</span>
                  </div>
                  <div class="crp-card-body">
                    <h3>${escapeHtml(t.label)}</h3>
                    <p class="crp-card-tagline">${escapeHtml(t.desc)}</p>
                    ${items.length ? `
                      <div class="crp-card-includes">
                        <p class="crp-includes-title">${icon("listChecks")} What's included</p>
                        <ul>
                          ${items.slice(0, 4).map(item => `<li>${escapeHtml(item)}</li>`).join("")}
                          ${items.length > 4 ? `<li class="crp-more">+${items.length - 4} more items…</li>` : ""}
                        </ul>
                      </div>
                    ` : ""}
                  </div>
                  <div class="crp-card-foot">
                    <div class="crp-style-row">
                      <span class="crp-style-lbl">Style:</span>
                      ${CV_STYLES.map(s => `<label class="crp-style-chip" title="${s.name}: ${s.desc}"><input type="radio" name="${safeSlug}" value="${s.id}"${s.id==="modern"?" checked":""}><span style="--chip-c:${s.swatch}">${s.name}</span></label>`).join("")}
                    </div>
                    <div class="crp-dl-row">
                      <button type="button" class="crp-dl-btn crp-dl-btn--pdf" style="--btn-color:${color}" data-template-label="${escapeHtml(t.label)}" data-template-action="pdf">${icon("fileText")} PDF</button>
                      <button type="button" class="crp-dl-btn crp-dl-btn--doc" style="--btn-color:${color}" data-template-label="${escapeHtml(t.label)}" data-template-action="doc">${icon("download")} DOC</button>
                      <span class="crp-free-badge">Free</span>
                    </div>
                  </div>
                </article>
              `;
            }).join("")}
          </div>

          ${/cv|cover.letter/i.test(title) ? `
            <div class="crp-cv-gen-cta">
              <div class="crp-cv-gen-cta-inner">
                <div>
                  <h3>Build Your Own Personalised CV</h3>
                  <p>Enter your own name, experience and skills. Download your finished CV as PDF or Word in 4 professional design styles, free, no account needed.</p>
                </div>
                <button type="button" class="button primary" data-open-cv-gen>${icon("fileCv")} Open CV Generator →</button>
              </div>
            </div>
          ` : ""}

          <div class="crp-back-row">
            ${buttonLink("/careers", "Back to Career Hub", "secondary", "arrowLeft")}
            <p class="crp-note">Templates are professional-grade documents. Tailor each one to your specific role before submitting.</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderCareerResources() {
  const resources = [
    { title: "Uganda Nursing CV Template",      desc: "Hospital, NGO and government CV formats with clinical placement detail.", action: "Download Template", badge: "Free",        accent: 0, icon: "fileCv" },
    { title: "International Nursing CV Template", desc: "UK, Australia and Gulf-style CVs with registration and evidence sections.", action: "Download Template", badge: "Free",   accent: 1, icon: "globe" },
    { title: "Cover Letter Guide",              desc: "Sample nursing cover letters, phrases and structures that work.",           action: "Open Guide",        badge: "Free",        accent: 2, icon: "mail" },
    { title: "Interview Preparation",           desc: "20+ questions, STAR examples, panel prep and values-based interview tips.", action: "Practice",          badge: "Free",        accent: 3, icon: "users" },
    { title: "Nursing Portfolio Guide",         desc: "What to include for registration, CPD, international and senior roles.",   action: "Open Guide",        badge: "Free",        accent: 4, icon: "clipboardList" },
    { title: "Salary Guide Uganda 2025",        desc: "Salary ranges by level, speciality, sector and international destination.", action: "View Guide",        badge: "Free",        accent: 5, icon: "banknote" }
  ];

  const totalTemplates = Object.values(RESOURCE_TEMPLATES).reduce((sum, arr) => sum + arr.length, 0);

  return `
    <section id="cv-resources" class="section career-hub-section">
      <div class="container">
        <div class="section-head">
          <div>
            <h2>Career Resources</h2>
            <p>CV templates, interview preparation, portfolio guidance and salary planning.</p>
          </div>
          <span class="resource-count-badge">${totalTemplates}+ Templates &amp; Guides</span>
        </div>
        <div class="career-resource-grid career-resource-grid--rich">
          ${resources.map(({ title, desc, action, badge, accent, icon: iconName }) => {
            const templates = RESOURCE_TEMPLATES[title] || [];
            return `
              <article class="career-resource-card career-resource-card--rich accent-${accent}">
                <div class="crcard-header">
                  <div class="crcard-icon">${icon(iconName)}</div>
                  <span class="crcard-badge crcard-badge--${badge === "Free" ? "free" : "soon"}">${escapeHtml(badge)}</span>
                </div>
                <div class="crcard-body">
                  <h3>${escapeHtml(title)}</h3>
                  <p>${escapeHtml(desc)}</p>
                </div>
                ${templates.length ? `
                  <div class="crcard-templates">
                    <span class="crcard-templates-label">5 templates:</span>
                    <div class="crcard-chips">
                      ${templates.map(t => `
                        <button type="button" class="crcard-chip" data-career-download="${escapeHtml(t.label)}" title="${escapeHtml(t.desc)}">
                          ${escapeHtml(t.label)}
                        </button>
                      `).join("")}
                    </div>
                  </div>
                ` : ""}
                <div class="crcard-footer">
                  <a class="crcard-cta" href="/careers/${careerResourceSlugOf(title) || slugify(title)}">${escapeHtml(action)} ${icon("arrowRight")}</a>
                </div>
              </article>
            `;
          }).join("")}
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
      body: routeFilter ? `Showing ${terms.length} terms in this category.` : `${allTerms.length} clear definitions for nursing and medical terms, from anatomy to pharmacology.`,
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
    ${renderEventsStrip()}
    ${renderCareerHub()}
  `;
}

// Resource-specific checklist content for career resource downloads
const RESOURCE_CHECKLISTS = {
  "Uganda Nursing CV Template": {
    intro: "Uganda Nursing CV, Key Sections to Include",
    items: [
      "Personal details: full name, UNMC registration number, phone, email",
      "Professional summary: 2-3 sentences on your level, speciality and key strength",
      "Clinical experience: facility, role, dates, key duties and achievements",
      "Education: certificate/diploma/degree, institution, year, grades",
      "UNMC registration status and licence expiry date",
      "CPD activities: trainings, workshops, seminars attended",
      "Speciality skills: specific clinical procedures you are competent in",
      "Languages spoken and community languages if applicable",
      "Two professional referees (name, title, organisation, contact)"
    ]
  },
  "International Nursing CV Template": {
    intro: "International Nursing CV (UK/Australia Style), Key Sections",
    items: [
      "Professional registration: NMC/AHPRA number or eligibility status",
      "Personal statement: 4-6 lines covering speciality, values and career aim",
      "Employment history in reverse chronological order",
      "Evidence of clinical competencies and mandatory training",
      "English language test results (IELTS/OET band scores)",
      "Continuing Professional Development (CPD) log summary",
      "Achievements: awards, quality improvement projects, presentations",
      "References: available on request (do not include contact details)"
    ]
  },
  "Cover Letter Guide": {
    intro: "Nursing Cover Letter, Structure Checklist",
    items: [
      "Opening paragraph: state the post and where you saw it",
      "Why this employer: show you know the facility or organisation",
      "Clinical fit: match your skills/experience to their job description",
      "Career motivation: why this role, why now",
      "Evidence: one specific clinical achievement or patient outcome",
      "Professionalism: mention your registration and language skills if relevant",
      "Closing: state availability, thank the reader, invite interview"
    ]
  },
  "Interview Preparation": {
    intro: "Nursing Interview Preparation Checklist",
    items: [
      "Research the facility: services, values, patient population",
      "Review the job description and match it to your experience",
      "Prepare STAR examples for 5 common clinical scenarios",
      "Know your registration status and CPD hours",
      "Prepare 3 questions to ask the panel",
      "Check uniform/attire requirements before the interview",
      "Bring: printed CV, registration certificate, ID, transcripts",
      "Confirm time, location (or video link) the day before"
    ]
  },
  "Nursing Portfolio Guide": {
    intro: "Nursing Portfolio, What to Include",
    items: [
      "Registration and licence documentation",
      "Academic certificates and transcripts",
      "CPD evidence: certificates, attendance sheets, reflections",
      "Clinical placement records and competency sign-offs",
      "Performance appraisals or supervisor feedback",
      "In-service training and workshop certificates",
      "Any publications, presentations or quality improvement work",
      "Reference letters from supervisors or educators"
    ]
  },
  "Salary Guide Uganda 2025": {
    intro: "Uganda Nursing Salary Reference Guide 2025",
    items: [
      "Student/Intern: UGX 300K-600K (allowance only)",
      "Staff Nurse (Graduate): UGX 1.2M-2.0M per month",
      "Staff Nurse (Experienced): UGX 2.0M-3.0M per month",
      "Senior Staff Nurse: UGX 3.0M-4.2M per month",
      "Charge Nurse / Ward In-Charge: UGX 3.5M-4.5M per month",
      "Nursing Officer: UGX 4.0M-5.5M per month",
      "Principal Nursing Officer: UGX 5.5M-7.0M per month",
      "Chief Nursing Officer: UGX 7.0M+ per month",
      "ICU/Theatre speciality uplift: +20-35% above general ward rate",
      "NGO/International Agency roles: USD/competitive package, not UGX scale"
    ]
  },

  /* ── Uganda CV Sub-Templates ──────────────────────────────────── */
  "Hospital Staff Nurse CV": {
    intro: "Uganda Hospital Staff Nurse CV, Key Sections",
    items: [
      "Personal details: full name, UNMC registration number, phone, email, physical address",
      "Professional summary: 3 lines on your current grade, ward speciality and key clinical strength",
      "Hospital/Facility experience: list posts with dates, unit, grade and key duties per role",
      "Key clinical procedures: list procedures you perform independently (IV, catheter, wound care, obs)",
      "UNMC registration: licence number, current expiry date and renewal status",
      "In-service trainings: BLS/ACLS, infection prevention, obstetric emergencies, any hospital-based",
      "Academic qualifications: certificate/diploma/degree, institution, year, grades or GPA",
      "Professional referees: Ward Manager/Matron + Medical Officer, name, title, facility, contact"
    ]
  },
  "NGO / Non-Profit Nursing CV": {
    intro: "NGO / Non-Profit Nursing CV, Key Sections",
    items: [
      "Personal statement: 4 lines on your community health values, program experience and impact",
      "Programme experience: project name, implementing partner, role, outputs and population reached",
      "Target populations worked with: maternal health, PLHIV, refugees, under-5 nutrition",
      "Reporting and data tools: HMIS, DHIS2, KoboToolbox, RedCap, Excel, note proficiency level",
      "Languages: English fluency, Luganda/local languages and any community dialects",
      "Volunteer or community engagement activities that show field-level commitment",
      "Membership: Uganda Nurses and Midwives Union, Uganda Nursing Association or similar",
      "References: supervisor from last implementing partner + clinical supervisor contact"
    ]
  },
  "New Graduate Nursing CV": {
    intro: "New Graduate Nursing CV, Key Sections",
    items: [
      "Personal statement: 3 lines on your programme, clinical interests and career goal",
      "Student clinical attachments: each rotation with facility, unit, duration and key tasks completed",
      "Academic results: year-by-year performance, distinctions or merit units, cumulative average",
      "Final-year research project or dissertation topic if completed, summarise findings",
      "UNMC student/interim registration number or application status",
      "Clinical skills list: top 10 practical skills acquired during student placements",
      "Extra-curricular: leadership in student nursing association, community health outreach",
      "Referees: academic tutor/lecturer + clinical attachment supervisor, name, institution, contact"
    ]
  },
  "Midwifery Specialist CV": {
    intro: "Midwifery Specialist CV, Key Sections",
    items: [
      "UNMC midwifery registration number, grade (direct midwife / nurse-midwife) and expiry",
      "Professional summary: deliveries supervised, ANC contacts managed and EmONC training level",
      "BEmONC / CEmONC training status, certification body and date of completion",
      "Maternal health experience: normal deliveries, obstetric emergencies, assisted deliveries",
      "Safe motherhood programmes: PMTCT, Kangaroo mother care, family planning, nutrition",
      "Equipment competency: CTG, vacuum extractor, episiotomy instruments, newborn resuscitation bag",
      "Referral competency: recognition of danger signs, pre-referral stabilisation, documentation",
      "Leadership: acting charge midwife experience, student mentoring, case presentation to teams"
    ]
  },
  "Community Health Nursing CV": {
    intro: "Community Health Nursing CV, Key Sections",
    items: [
      "VHT supervision: number of Village Health Teams overseen, location and coverage area",
      "Immunisation campaigns: vaccines deployed, cold chain management, outreach sessions run",
      "Health education: topics delivered (FP, malaria, WASH, nutrition, TB, maternal health)",
      "HMIS data collection: registers completed, monthly reports submitted to district health office",
      "Disease surveillance: outbreak response involvement, contact tracing, case reporting",
      "Community mobilisation: community meetings, leader engagement, behaviour change strategies",
      "Partnerships: local government health office, NGOs, community development committees",
      "Physical fitness and mobility note: community posts require movement across rural catchments"
    ]
  },

  /* ── International CV Sub-Templates ──────────────────────────── */
  "UK NHS Nursing CV": {
    intro: "UK NHS Application CV (NMC Route), Key Sections",
    items: [
      "NMC eligibility status: CBT passed, OSCE passed/booked, or application at assessment stage",
      "English language: IELTS academic 7.0 (each band) or OET Grade B (each skill), state test date",
      "Professional summary: 4-6 lines on speciality, NMC route, values and motivation for NHS",
      "Employment history in reverse chronological order with NHS-equivalent band duties described",
      "Mandatory training status: manual handling, fire safety, infection control, safeguarding",
      "NMC skills gap analysis completion date and any adaptation plan commenced",
      "NHS values alignment: person-centred care, compassion, respect, dignity, evidence with examples",
      "References: clinical supervisor + ward manager: state 'available on request' (UK style)"
    ]
  },
  "Australia AHPRA Nursing CV": {
    intro: "Australia AHPRA Application CV, Key Sections",
    items: [
      "AHPRA application status: skills assessment stage, bridging program enrolled or approved",
      "English language: IELTS academic 7.0 (each band) or OET Grade B, include test date and scores",
      "Professional summary: speciality, years of clinical experience, key clinical achievements",
      "Clinical experience section with equivalent Australian context described (e.g. patient ratios)",
      "CPD log summary: hours completed in last 3 years against 20-hour requirement",
      "Computer skills: familiarity with EMR systems (Epic, Cerner, iMDsoft), note proficiency level",
      "Cultural competency: experience with diverse patient populations, Indigenous health awareness",
      "References: two clinical referees with explicit consent for contact, include title and email"
    ]
  },
  "Gulf States Nursing CV": {
    intro: "Gulf States / Middle East Nursing CV, Key Sections",
    items: [
      "Dataflow professional verification: reference number, status and expected completion date",
      "DHA (Dubai), HAAD/DOH (Abu Dhabi) or MOH (Saudi/Qatar/Oman) exam status and score",
      "Prometric exam score if completed: include licence number or pending application number",
      "Clinical experience: high nurse-to-patient ratio ward work, shift flexibility and night rotation",
      "Gulf-relevant training: BLS (AHA version), IV cannulation, phlebotomy, ECG interpretation",
      "Arabic language: state level: functional, basic phrases or none (employers prefer any effort)",
      "Relocation readiness: confirm willingness to relocate and accommodation preference (provided/own)",
      "References: facility Medical Director letter + Nurse Manager/Matron preferred"
    ]
  },
  "USA / NCLEX Route CV": {
    intro: "USA / NCLEX Route Nursing CV, Key Sections",
    items: [
      "CGFNS credential evaluation status or VisaScreen certificate number if obtained",
      "NCLEX-RN pass date and state of initial licensure or endorsement pending status",
      "IELTS / TOEFL scores if required by state nursing board, include test date",
      "Employment history: describe shift hours, patient ratios, acuity level and specialty unit",
      "Clinical certifications: ACLS, PALS, NRP, TNCC, specialty certifications held",
      "State board application stage: applied, fingerprinted, background check or license issued",
      "Immigration pathway: H1B visa cap-subject, EB3 immigrant petition or employer sponsorship",
      "References: US-style: professional title, direct supervisor, phone and email"
    ]
  },
  "East Africa Regional CV": {
    intro: "East Africa Regional Nursing CV, Key Sections",
    items: [
      "Home nursing council registration: UNMC (Uganda), NCK (Kenya), TNMC (Tanzania) or equivalent",
      "EAC mutual recognition status or East Africa Nursing Council equivalence enquiry reference",
      "Cross-border work experience or student placements in the East Africa region if any",
      "Languages: English proficiency level, Kiswahili (spoken/written), regional local languages",
      "Regional clinical experience: malaria case management, ANC, HIV/TB integrated services",
      "Regional professional memberships or EAC nursing forum participation",
      "Salary expectations: state preferred currency (USD or local) and minimum acceptable range",
      "References: from a recognised facility within the East Africa region preferred"
    ]
  },

  /* ── Cover Letter Sub-Templates ───────────────────────────────── */
  "Hospital Job Application Letter": {
    intro: "Hospital Job Application Cover Letter, Structure",
    items: [
      "Opening: state exact post title, reference number and where you saw the advertisement",
      "Paragraph 1: your current role, years of experience and specific clinical fit for this post",
      "Paragraph 2: specific reason you want this facility, show you researched their services",
      "Paragraph 3: one clinical achievement using brief STAR format (Situation, Action, Result)",
      "Closing: state your availability date, UNMC registration status and willingness to interview",
      "Length: one A4 page maximum, 4 paragraphs, professional font size 11 or 12",
      "Tone: professional, warm and confident, avoid begging or overly formal language",
      "Sign off: Full name + UNMC number + email + phone number below your signature"
    ]
  },
  "NGO / INGO Application Letter": {
    intro: "NGO / INGO Application Cover Letter, Structure",
    items: [
      "Opening: state the post title and how it aligns directly with your public health values",
      "Mission alignment: show you know the organisation's mission, programmes and target population",
      "Program impact: describe a measurable health outcome you contributed to with numbers if possible",
      "Technical skills: mention data tools (DHIS2, KoboToolbox), reporting formats (donor, government)",
      "Flexibility statement: willingness to work in remote, field or challenging environments",
      "Soft skills: cultural sensitivity, teamwork, community mobilisation and adaptive communication",
      "Closing: confirm availability, passport/travel readiness if field deployment is required",
      "Word count: 300-400 words maximum: NGO hiring managers read dozens of letters quickly"
    ]
  },
  "International Application Letter": {
    intro: "International Nursing Application Cover Letter, Structure",
    items: [
      "Opening: state the destination country, post title and your current UNMC registration status",
      "Paragraph 1: key clinical speciality strengths, years of experience and top clinical skill",
      "Paragraph 2: English language proficiency, include IELTS/OET scores and test date",
      "Paragraph 3: adaptability evidence, motivation for international nursing and any relevant exposure",
      "Registration route: NMC CBT/OSCE / AHPRA bridging / NCLEX, state your current stage clearly",
      "Closing: intended availability date, visa status and best contact method for interview",
      "Research detail: mention one specific fact about destination healthcare system to show preparation",
      "Avoid clichés: replace 'hardworking' and 'passionate' with one specific clinical example each"
    ]
  },
  "Promotion / Internal Transfer Letter": {
    intro: "Promotion / Internal Transfer Cover Letter, Structure",
    items: [
      "Opening: clearly state the post you are applying for and your current substantive post",
      "Track record: list 3 specific achievements in your current role with measurable evidence",
      "Leadership readiness: supervisory experience, mentoring, in-service sessions delivered",
      "Role knowledge: show you understand the duties and responsibilities of the target post",
      "Institutional value: 2-3 ways your internal knowledge benefits the organisation directly",
      "First 90 days: state what you intend to deliver in the first 3 months if appointed",
      "Tone: confident and evidence-based: not apologetic, not overselling without substance",
      "End with a concrete request: ask for a formal interview by a specific date"
    ]
  },
  "Speculative / Unsolicited Letter": {
    intro: "Speculative / Unsolicited Application Cover Letter, Structure",
    items: [
      "Opening: state why you chose this specific facility, show research, not generic praise",
      "Value proposition: describe your strongest clinical niche in 2 clear, direct sentences",
      "Vacancy match: reference any known staffing expansion, service area or clinical need",
      "Target post: state the exact type of post you are seeking and your available start date",
      "Evidence: one quantified clinical achievement or patient outcome that demonstrates impact",
      "Call to action: request a 15-minute meeting or ask to be kept on file for suitable vacancies",
      "Include: CV and a reference list attached, do not make them ask for basic documents",
      "Follow-up note: state you will follow up by phone or email within 10-14 working days"
    ]
  },

  /* ── Interview Preparation Sub-Templates ─────────────────────── */
  "General Hospital Interview": {
    intro: "General Hospital Nursing Interview, Key Questions and Tips",
    items: [
      "Tell me about yourself: clinical background, current grade, ward focus and one key strength",
      "Why this facility: mention 2 specific facts you researched about their services or values",
      "Difficult patient scenario: use STAR format, Situation, Task, Action, Result",
      "Multiple urgent tasks: describe ABCDE triage thinking, delegation and escalation steps",
      "Medication error response: report immediately, SBAR to senior, incident form, patient monitoring",
      "Infection prevention: demonstrate standard precautions, hand hygiene 5-moments, PPE protocol",
      "Patient dignity: FREDA principles: fairness, respect, equality, dignity, autonomy",
      "Career in 3 years: show a CPD plan, speciality interest and commitment to this organisation"
    ]
  },
  "ICU / Theatre Specialist Interview": {
    intro: "ICU / Theatre Specialist Nursing Interview, Key Questions",
    items: [
      "Describe your critical care experience: ventilator settings, haemodynamic lines, sedation titration",
      "Deteriorating patient management: full ABCDE approach, early warning score, escalation call",
      "BLS/ACLS certification: state provider, date of last recertification and any skills updates",
      "Emergency recognition: describe a time you identified a critical deterioration before the doctor",
      "Resuscitation team communication: role clarity, closed-loop communication, SBAR handover",
      "Specialist equipment: arterial line care, CVP monitoring, chest drain, tracheostomy suctioning",
      "WHO surgical safety checklist: 3 time-out phases, sign-in, sign-out, your role in each",
      "Patient and family in ICU: explain how you communicate prognosis, update family and provide support"
    ]
  },
  "International Panel Interview (UK / AU)": {
    intro: "International Panel Interview (UK / Australia), Key Questions",
    items: [
      "What do you know about NHS Constitution values / NMBA standards and how they match your practice",
      "Safeguarding scenario: describe a concern you identified, how you escalated and documented it",
      "Multi-cultural team: give an example of working effectively with colleagues from different cultures",
      "Values-based question: describe a specific moment where you showed compassion under pressure",
      "Medication safety: explain the 6 Rights and describe a time you prevented a near-miss error",
      "Wellbeing question: describe how you maintain your resilience and emotional health at work",
      "Clinical governance: describe an audit, complaint process or quality improvement you participated in",
      "Questions for us: prepare at least 3 thoughtful questions about the role, team or development"
    ]
  },
  "Management / Leadership Role Interview": {
    intro: "Nursing Management / Leadership Role Interview, Key Questions",
    items: [
      "Leadership style: describe with a real team example and what outcome your approach achieved",
      "Underperforming team member: describe a constructive feedback conversation and its result",
      "Staff rostering: describe your approach to duty allocation, leave management and shift balance",
      "Staff conflict: describe how you facilitated resolution between two team members",
      "Quality improvement: describe a project you led or significantly contributed to with outcome",
      "Resource management: describe experience with budget, equipment ordering or stock control",
      "Infection prevention leadership: how you ensure your team maintains compliance standards",
      "First 90-day KPIs: what indicators would you set for your unit immediately on appointment"
    ]
  },
  "NGO / Public Health Interview": {
    intro: "NGO / Public Health Nursing Interview, Key Questions",
    items: [
      "Community program experience: describe a program you delivered with population reached and outcomes",
      "Community resistance: describe how you engaged a community that was resistant to health messages",
      "Monitoring tools: name tools you have used (DHIS2, KoboToolbox, RedCap) and your proficiency",
      "Program adaptation: describe a change you made to a program based on data or community feedback",
      "Supply chain in resource-limited settings: how you managed medicine/vaccine shortages",
      "Outbreak or emergency response: describe your role, decision-making and lessons learned",
      "Donor reporting: formats you have used (USAID PEPFAR, Global Fund, MOH), frequency and content",
      "Sustainability question: how would you design a program that continues after funding ends"
    ]
  },

  /* ── Nursing Portfolio Sub-Templates ──────────────────────────── */
  "Student Portfolio (Year 1-3)": {
    intro: "Student Nursing Portfolio (Year 1-3), What to Include",
    items: [
      "Section 1: Title page: full name, programme, student number, school and academic year",
      "Section 2: Programme overview and personal learning objectives written for each clinical year",
      "Section 3: Clinical placement records: facility, unit, dates, hours and supervisor signature",
      "Section 4: Competency sign-off sheets for every practical skill completed during placements",
      "Section 5: Reflective journal: minimum 2 Gibbs-model entries per placement rotation",
      "Section 6: Academic certificates and progress results per year of study",
      "Section 7: Extra activities: nursing association membership, outreach, peer-assisted learning",
      "Section 8: Self-assessment: written strengths and development areas at end of each year"
    ]
  },
  "UNMC Registration Portfolio": {
    intro: "UNMC Registration Portfolio, Documents Required",
    items: [
      "Authenticated academic transcript from your nursing/midwifery training institution",
      "Certificate of training: original certificate of nursing/midwifery (plus notarised photocopy)",
      "Valid national ID or passport bio-data page (photocopy accepted with original for verification)",
      "Recent passport-size photograph: professional background, current (not older than 3 months)",
      "Proof of supervised clinical practice: hours log signed by tutor or clinical supervisor",
      "Two passport-size photos for the UNMC registration card (as specified on current UNMC form)",
      "Duly completed UNMC application form. Use a fresh form for any corrections, no amendments",
      "Bank payment receipt: pay into UNMC-approved bank account and attach original receipt"
    ]
  },
  "International Application Portfolio": {
    intro: "International Nursing Application Portfolio, Key Documents",
    items: [
      "Authenticated degree/diploma and academic transcript, notarised if destination country requires",
      "Clinical experience certificate: detailed letter from last 3-5 years employer with dates, role, hours",
      "Letter of Good Standing from UNMC: current (not older than 3-6 months. Check destination)",
      "English language certificate: IELTS academic or OET, verify band requirement for destination",
      "Valid passport: must be valid at least 12-18 months beyond your intended departure date",
      "Proof of identity: birth certificate and national ID (some routes require both)",
      "Health clearance: medical fitness certificate if required by destination country or employer",
      "Skills assessment reference: Dataflow, CGFNS, AHPRA or NMC reference number as applicable"
    ]
  },
  "CPD & Revalidation Portfolio": {
    intro: "CPD and Revalidation Portfolio, What to Include",
    items: [
      "Annual CPD activity log: date, provider, topic, learning format, hours and certificate for each entry",
      "5 reflective accounts: 200-500 words each on how a CPD activity changed or improved your practice",
      "Patient/carer/colleague feedback: at least one example of feedback received and your response",
      "Good health and good character declaration: signed and dated by you annually",
      "Practice supervisor confirmation: for NMC revalidation a confirming registrant review is required",
      "Annual learning needs assessment: written review against current role competency requirements",
      "Updated mandatory training: BLS, safeguarding level, infection prevention, manual handling dates",
      "Summary of professional values discussions: notes from appraisals or clinical supervision sessions"
    ]
  },
  "Senior / Leadership Portfolio": {
    intro: "Senior / Leadership Nursing Portfolio, What to Include",
    items: [
      "Current evidence-based CV: comprehensive, formatted for leadership-level review",
      "Leadership experience evidence: acting charge records, unit management, team leadership reports",
      "Quality improvement project: full report or summary of audit, change cycle and measurable outcome",
      "Staff mentoring log: evidence of students or junior staff supervised, methods and outcomes noted",
      "Management training certificates: leadership modules, HR basics, health systems management",
      "Performance appraisals: last 2-3 years from line manager, highlight commendations",
      "Publications or presentations: conference papers, in-service training sessions, departmental journal",
      "Leadership statement: 1-2 pages on your leadership philosophy, style and professional vision"
    ]
  },

  /* ── Salary Guide Sub-Templates ───────────────────────────────── */
  "Government Hospital Salary Scale": {
    intro: "Uganda Government / Public Sector Nursing Salary Scale 2025",
    items: [
      "U7, Intern / Enrolled Nurse: UGX 435,000 base + internship/government allowance",
      "U6, Staff Nurse / Enrolled Midwife: UGX 840,000-1,200,000 per month",
      "U5, Nursing Officer / Registered Nurse: UGX 1,800,000-2,500,000 per month",
      "U4, Senior Nursing Officer: UGX 2,800,000-3,500,000 per month",
      "U3, Principal Nursing Officer: UGX 4,000,000-5,500,000 per month",
      "U2, Senior Principal Nursing Officer: UGX 5,500,000-7,000,000 per month",
      "U1E, Chief Nursing Officer / Director: UGX 8,000,000-12,000,000+ per month",
      "Additional allowances: UHF, transport, housing: amounts vary by district and facility level"
    ]
  },
  "Private Hospital Salary Scale": {
    intro: "Uganda Private Hospital Nursing Salary Scale 2025",
    items: [
      "Certificate Nurse (private clinic): UGX 800,000-1,300,000 per month",
      "Diploma Nurse (private hospital): UGX 1,500,000-2,500,000 per month",
      "Degree / BNSc Nurse: UGX 2,500,000-3,800,000 per month",
      "Senior / Charge Nurse: UGX 3,500,000-5,000,000 per month",
      "ICU / Theatre Specialist: UGX 4,500,000-7,000,000 per month",
      "Nurse Educator (hospital-based): UGX 3,000,000-4,500,000 per month",
      "Night shift / weekend allowance: UGX 100,000-300,000 additional where applicable",
      "Negotiation tip: private sector is more flexible: compare 3 facility offers before accepting"
    ]
  },
  "NGO / International Agency Salary Scale": {
    intro: "Uganda NGO / International Agency Nursing Salary Scale 2025",
    items: [
      "Local NGO nurse: UGX 1,200,000-2,500,000 per month (varies by program budget)",
      "International NGO (MSF, IRC, World Vision, CARE): USD 800-2,500 per month",
      "UN Agency (WHO, UNICEF, UNFPA): USD 1,500-5,000+: grade P1/P2/NOA dependent",
      "USAID / PEPFAR implementing partner: UGX 3,000,000-5,000,000 or USD equivalent",
      "Field duty station allowance: USD 100-500 additional for remote deployment",
      "Benefits package: health insurance, group life cover, R&R allowance for field staff",
      "Consultancy (senior nurse): USD 80-200 per day for short-term technical assistance roles",
      "Key note: NGO pay bands are rigid: negotiate post title and grade level, not just salary"
    ]
  },
  "ICU / Theatre / Specialist Premium": {
    intro: "ICU / Theatre and Specialist Nursing Salary Premiums 2025",
    items: [
      "ICU nurse premium (public sector): +15-20% above equivalent general staff nurse grade",
      "ICU nurse premium (private facility): +30-50% above ward nurse rate at same facility",
      "Theatre scrub nurse specialist: UGX 4,500,000-7,500,000 per month (private hospital)",
      "Anaesthetic support nurse / CRNA-equivalent: UGX 5,000,000-8,000,000 per month",
      "Emergency / A&E nurse: UGX 3,500,000-5,500,000 per month",
      "On-call allowance: UGX 50,000-150,000 per call session (varies by facility policy)",
      "ACLS/ATLS-certified uplift: negotiable, typically +UGX 200,000-500,000 per month",
      "Career note: specialist roles have the fastest vacancy fill, certify and apply early"
    ]
  },
  "International Destination Salary Comparison": {
    intro: "International Nursing Salary Comparison, Uganda vs Destinations 2025",
    items: [
      "Uganda (experienced nurse): UGX 3M-5M / month = approx USD 800-1,300",
      "Kenya (Nairobi private hospital): KES 80,000-150,000 / month = approx USD 600-1,150",
      "Tanzania (Dar es Salaam): TZS 1.5M-3M / month = approx USD 580-1,150",
      "UK (NHS Band 5 starting): GBP 29,970-36,483 / year = approx USD 38,000-46,000",
      "Australia (Grade 2 RN): AUD 70,000-82,000 / year = approx USD 45,000-53,000",
      "UAE / Dubai (DHA registered): USD 2,500-4,500 / month plus housing allowance",
      "Saudi Arabia (MOH): USD 2,000-4,000 / month plus accommodation provided",
      "Key reminder: recognition fees, migration costs and cost of living reduce net gain significantly"
    ]
  }
};

const RESOURCE_TEMPLATES = {
  "Uganda Nursing CV Template": [
    { label: "Hospital Staff Nurse CV",      desc: "Public or private hospital ward format" },
    { label: "NGO / Non-Profit Nursing CV",  desc: "WHO, MSF, IRC and local NGO applications" },
    { label: "New Graduate Nursing CV",      desc: "First post after certificate or diploma" },
    { label: "Midwifery Specialist CV",      desc: "Maternal and newborn care focus" },
    { label: "Community Health Nursing CV",  desc: "District health and outreach posts" }
  ],
  "International Nursing CV Template": [
    { label: "UK NHS Nursing CV",            desc: "NMC CBT/OSCE route, NHS values" },
    { label: "Australia AHPRA Nursing CV",   desc: "AHPRA bridging, IELTS, CPD log" },
    { label: "Gulf States Nursing CV",       desc: "Dataflow, DHA/MOH exams, Prometric" },
    { label: "USA / NCLEX Route CV",         desc: "CGFNS, NCLEX-RN, state licensure" },
    { label: "East Africa Regional CV",      desc: "EAC mutual recognition, Kiswahili" }
  ],
  "Cover Letter Guide": [
    { label: "Hospital Job Application Letter",   desc: "Ward-based clinical role format" },
    { label: "NGO / INGO Application Letter",     desc: "Mission-driven, program outcomes" },
    { label: "International Application Letter",  desc: "Registration route, IELTS scores" },
    { label: "Promotion / Internal Transfer Letter", desc: "Track record, leadership readiness" },
    { label: "Speculative / Unsolicited Letter",  desc: "Cold-contact, value proposition" }
  ],
  "Interview Preparation": [
    { label: "General Hospital Interview",              desc: "Values, clinical scenario, teamwork" },
    { label: "ICU / Theatre Specialist Interview",      desc: "Critical care, equipment, ACLS" },
    { label: "International Panel Interview (UK / AU)", desc: "NMC/AHPRA, values-based questions" },
    { label: "Management / Leadership Role Interview",  desc: "Rostering, KPIs, conflict handling" },
    { label: "NGO / Public Health Interview",           desc: "Programs, DHIS2, donor reporting" }
  ],
  "Nursing Portfolio Guide": [
    { label: "Student Portfolio (Year 1-3)",     desc: "Placements, competencies, reflections" },
    { label: "UNMC Registration Portfolio",      desc: "Licence documents and requirements" },
    { label: "International Application Portfolio", desc: "Recognition docs, overseas route" },
    { label: "CPD & Revalidation Portfolio",     desc: "Annual log, feedback, confirmation" },
    { label: "Senior / Leadership Portfolio",    desc: "Management evidence, QI projects" }
  ],
  "Salary Guide Uganda 2025": [
    { label: "Government Hospital Salary Scale",         desc: "Public sector U-scale grades" },
    { label: "Private Hospital Salary Scale",            desc: "Market rates, negotiation tips" },
    { label: "NGO / International Agency Salary Scale",  desc: "USD packages, UN grade bands" },
    { label: "ICU / Theatre / Specialist Premium",       desc: "Specialist uplifts, on-call rates" },
    { label: "International Destination Salary Comparison", desc: "UK, AU, Gulf, EAC comparison" }
  ]
};

// ─── CV DOCUMENT STYLES ────────────────────────────────────────────────────
const CV_STYLES = [
  {
    id: "modern", name: "Modern", desc: "Clean teal accent, contemporary",  swatch: "#00B5BD",
    css: `body{font-family:Arial,Helvetica,sans-serif;margin:0;padding:0;color:#1C1917;line-height:1.55}.cv-header{background:#00B5BD;color:#fff;padding:36px 52px 28px}h1.cv-name{font-size:26pt;font-weight:700;margin:0 0 4px;letter-spacing:-.02em}.cv-title{font-size:12pt;opacity:.85;margin:0 0 12px}.cv-contact-bar{font-size:9pt;opacity:.8;display:flex;flex-wrap:wrap;gap:12px}.cv-body{padding:26px 52px}h2.cv-sec{font-size:9.5pt;font-weight:700;color:#00B5BD;text-transform:uppercase;letter-spacing:.08em;border-left:4px solid #00B5BD;padding-left:10px;margin:22px 0 8px}.cv-item{margin-bottom:14px}.cv-item-head{display:flex;justify-content:space-between;font-weight:700;font-size:10.5pt;margin-bottom:2px}.cv-item-sub{font-size:9.5pt;color:#555;margin-bottom:4px}ul{margin:4px 0;padding-left:18px}li{font-size:9.5pt;margin-bottom:3px}p{font-size:10pt;margin:0 0 8px}.skill-chips{display:flex;flex-wrap:wrap;gap:5px}.skill-chip{background:#e0f7f8;border:1px solid #b2f0f3;border-radius:3px;padding:2px 8px;font-size:9pt;color:#007b83}`
  },
  {
    id: "classic", name: "Classic", desc: "Timeless serif, centred header", swatch: "#1C1917",
    css: `body{font-family:Georgia,'Times New Roman',serif;margin:0;padding:38px 56px;color:#1a1a1a;line-height:1.6}.cv-header{text-align:center;border-bottom:2px solid #1a1a1a;padding-bottom:14px;margin-bottom:18px}h1.cv-name{font-size:26pt;font-weight:700;margin:0 0 4px}.cv-title{font-size:12pt;font-style:italic;color:#444;margin:0 0 8px}.cv-contact-bar{font-size:9pt;color:#555;display:flex;justify-content:center;flex-wrap:wrap;gap:14px}h2.cv-sec{font-size:10pt;font-weight:700;text-transform:uppercase;letter-spacing:.1em;border-bottom:1.5px solid #1a1a1a;padding-bottom:3px;margin:20px 0 8px}.cv-item{margin-bottom:14px}.cv-item-head{display:flex;justify-content:space-between;font-weight:700;font-size:10.5pt;margin-bottom:2px}.cv-item-sub{font-size:9.5pt;color:#555;font-style:italic;margin-bottom:4px}ul{margin:4px 0;padding-left:20px}li{font-size:9.5pt;margin-bottom:3px}p{font-size:10pt;margin:0 0 8px}.skill-chips{display:flex;flex-wrap:wrap;gap:5px}.skill-chip{background:#f5f5f5;border:1px solid #ddd;border-radius:3px;padding:2px 8px;font-size:9pt}`
  },
  {
    id: "executive", name: "Executive", desc: "Navy header, bold corporate", swatch: "#1e3a5f",
    css: `body{font-family:Calibri,Arial,sans-serif;margin:0;padding:0;color:#1C1917;line-height:1.55}.cv-header{background:#1e3a5f;color:#fff;padding:40px 52px 28px}h1.cv-name{font-size:26pt;font-weight:700;margin:0 0 4px}.cv-title{font-size:12pt;opacity:.82;margin:0 0 12px;font-weight:300}.cv-contact-bar{font-size:9pt;opacity:.75;display:flex;flex-wrap:wrap;gap:14px}.cv-body{padding:26px 52px}h2.cv-sec{font-size:9.5pt;font-weight:700;color:#1e3a5f;text-transform:uppercase;letter-spacing:.08em;border-bottom:2px solid #1e3a5f;padding-bottom:4px;margin:22px 0 8px}.cv-item{margin-bottom:14px}.cv-item-head{display:flex;justify-content:space-between;font-weight:700;font-size:10.5pt;margin-bottom:2px}.cv-item-sub{font-size:9.5pt;color:#555;margin-bottom:4px}ul{margin:4px 0;padding-left:18px}li{font-size:9.5pt;margin-bottom:3px}p{font-size:10pt;margin:0 0 8px}.skill-chips{display:flex;flex-wrap:wrap;gap:5px}.skill-chip{background:#f0f4f8;border:1px solid #c4d3e3;border-radius:3px;padding:2px 8px;font-size:9pt;color:#1e3a5f}`
  },
  {
    id: "minimalist", name: "Minimalist", desc: "Ultra-clean, spacious, understated", swatch: "#6B7280",
    css: `body{font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;margin:0;padding:46px 64px;color:#222;line-height:1.65}.cv-header{margin-bottom:24px;padding-bottom:20px;border-bottom:1px solid #e5e7eb}h1.cv-name{font-size:24pt;font-weight:300;margin:0 0 4px;letter-spacing:.02em}.cv-title{font-size:11pt;color:#666;margin:0 0 12px}.cv-contact-bar{font-size:9pt;color:#888;display:flex;flex-wrap:wrap;gap:16px}h2.cv-sec{font-size:8pt;font-weight:700;text-transform:uppercase;letter-spacing:.15em;color:#9ca3af;border-bottom:1px solid #f3f4f6;padding-bottom:6px;margin:26px 0 10px}.cv-item{margin-bottom:14px}.cv-item-head{display:flex;justify-content:space-between;font-weight:600;font-size:10.5pt;margin-bottom:2px}.cv-item-sub{font-size:9.5pt;color:#777;margin-bottom:4px}ul{margin:4px 0;padding-left:16px}li{font-size:9.5pt;margin-bottom:4px;color:#444}p{font-size:10pt;margin:0 0 8px;color:#333}.skill-chips{display:flex;flex-wrap:wrap;gap:5px}.skill-chip{background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;padding:2px 10px;font-size:9pt;color:#6B7280}`
  }
];

// ─── CV GENERATOR STATE ────────────────────────────────────────────────────
const cvGen = {
  open: false, step: 1, styleId: "modern",
  data: {
    name: "", jobTitle: "", email: "", phone: "", location: "", linkedin: "",
    summary: "",
    experience: [{ company: "", role: "", dates: "", duties: "" }],
    education:  [{ institution: "", degree: "", year: "" }],
    skills: "", languages: "", references: "Available upon request"
  }
};

// ─── DOCUMENT HTML BUILDER (for CV Generator) ─────────────────────────────
function buildCVDocHTML(data, styleId) {
  const s = CV_STYLES.find(x => x.id === styleId) || CV_STYLES[0];
  const esc = v => escapeHtml(String(v || ""));
  const name     = esc(data.name)     || "[Your Full Name]";
  const jobTitle = esc(data.jobTitle) || "[Professional Title]";
  const phone    = esc(data.phone);
  const email    = esc(data.email);
  const loc      = esc(data.location);
  const li_url   = esc(data.linkedin);
  const summary  = esc(data.summary)  || "[Write your professional summary: 3-4 sentences on your nursing level, clinical specialty, years of experience and key strength.]";
  const contactParts = [phone, email, loc, li_url].filter(Boolean);
  const sep = styleId === "classic" ? " &nbsp;|&nbsp; " : " &nbsp;·&nbsp; ";

  const expItems = (data.experience || []).filter(e => e.company || e.role || e.duties);
  const expHtml = expItems.length
    ? expItems.map(e => `<div class="cv-item"><div class="cv-item-head"><span>${esc(e.company)||"[Employer / Facility]"}</span><span>${esc(e.dates)||"[Date Range]"}</span></div><div class="cv-item-sub">${esc(e.role)||"[Job Title]"}</div>${e.duties ? `<ul>${e.duties.split("\n").filter(d=>d.trim()).map(d=>`<li>${esc(d.trim())}</li>`).join("")}</ul>` : "<p>[List key duties and achievements here]</p>"}</div>`).join("")
    : "<p>[Add your work experience]</p>";

  const eduItems = (data.education || []).filter(e => e.institution || e.degree);
  const eduHtml = eduItems.length
    ? eduItems.map(e => `<div class="cv-item"><div class="cv-item-head"><span>${esc(e.degree)||"[Degree / Diploma]"}</span><span>${esc(e.year)||"[Year]"}</span></div><div class="cv-item-sub">${esc(e.institution)||"[Institution]"}</div></div>`).join("")
    : "<p>[Add your education]</p>";

  const skillsHtml = data.skills
    ? `<div class="skill-chips">${data.skills.split(/[,\n]/).filter(x=>x.trim()).map(sk=>`<span class="skill-chip">${esc(sk.trim())}</span>`).join("")}</div>`
    : "<p>[List your clinical skills and competencies]</p>";

  const langs = esc(data.languages);
  const refs  = esc(data.references) || "Available upon request";
  const hasBgHdr = styleId === "modern" || styleId === "executive";

  const hdr = `<div class="cv-header"><h1 class="cv-name">${name}</h1><div class="cv-title">${jobTitle}</div><div class="cv-contact-bar">${contactParts.join(sep)}</div></div>`;
  const body = `<h2 class="cv-sec">Professional Summary</h2><p>${summary}</p><h2 class="cv-sec">Work Experience</h2>${expHtml}<h2 class="cv-sec">Education</h2>${eduHtml}<h2 class="cv-sec">Clinical Skills</h2>${skillsHtml}${langs ? `<h2 class="cv-sec">Languages</h2><p>${langs}</p>` : ""}<h2 class="cv-sec">References</h2><p>${refs}</p>`;
  const fullBody = hasBgHdr ? `${hdr}<div class="cv-body">${body}</div>` : `${hdr}${body}`;

  return `<!DOCTYPE html><html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word"><head><meta charset="utf-8"><title>${name}, CV</title><style>${s.css}@page{size:A4;margin:0}@media print{*{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}body{margin:0}}</style></head><body>${fullBody}</body></html>`;
}

// ─── TEMPLATE DOCUMENT BUILDER (for card downloads) ───────────────────────
function buildTemplateDocHTML(label, styleId) {
  const s   = CV_STYLES.find(x => x.id === styleId) || CV_STYLES[0];
  const cl  = RESOURCE_CHECKLISTS[label] || {};
  const items = cl.items || [];
  const intro = cl.intro || label;
  const isCV     = /\bcv\b|resume/i.test(label);
  const isLetter = /letter|application/i.test(label);
  const isSalary = /salary|scale|premium|comparison/i.test(label);
  const hasBgHdr = styleId === "modern" || styleId === "executive";

  let mainContent = "";
  if (isCV) {
    mainContent = items.map(item => {
      const ci = item.indexOf(":");
      const head = ci > 0 ? item.substring(0, ci) : item;
      const guide = ci > 0 ? item.substring(ci + 1).trim() : "";
      return `<h2 class="cv-sec">${head}</h2><div class="inst">${guide || "Complete this section"}</div><p class="ph">[${(guide || head).split(" ").slice(0,10).join(" ")}…]</p>`;
    }).join("");
  } else if (isLetter) {
    mainContent = `<p>[City, Date]</p><p>[Hiring Manager]<br>[Organisation / Facility]<br>[Address]</p><p>Dear Sir / Madam,</p><p><strong>Re: Application for the Post of [Job Title], Ref: [Reference Number]</strong></p>`
      + items.map((item, i) => {
          const ci = item.indexOf(":"); const guide = ci > 0 ? item.substring(ci+1).trim() : item;
          return `<div class="inst">${item}</div><p class="ph">[Paragraph ${i+1}: ${guide.split(" ").slice(0,12).join(" ")}…]</p>`;
        }).join("")
      + `<p>Yours faithfully,</p><p>[Your Full Name]<br>[UNMC Registration No.]<br>[Phone] &nbsp;|&nbsp; [Email]</p>`;
  } else if (isSalary) {
    mainContent = `<h2 class="cv-sec">${escapeHtml(intro)}</h2>`
      + items.map(item => {
          const d = item.indexOf(", "); const grade = d>0 ? item.substring(0,d).trim() : item; const detail = d>0 ? item.substring(d+1).trim() : "";
          return `<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #eee;font-size:10pt"><span><strong>${escapeHtml(grade)}</strong></span><span style="color:#555">${escapeHtml(detail)}</span></div>`;
        }).join("");
  } else {
    mainContent = `<h2 class="cv-sec">${escapeHtml(intro)}</h2><div class="inst">Use this checklist: tick each item as you complete or gather it.</div>`
      + items.map(item => {
          const ci = item.indexOf(":"); const head = ci>0 ? item.substring(0,ci) : item; const body = ci>0 ? item.substring(ci+1).trim() : "";
          return `<div style="display:flex;gap:12px;padding:9px 0;border-bottom:1px solid #f0f0f0;align-items:flex-start"><span style="font-size:14pt;color:#ccc;line-height:1.1">☐</span><div><strong style="font-size:10pt">${escapeHtml(head)}</strong>${body ? `<br><span style="font-size:9.5pt;color:#666">${escapeHtml(body)}</span>` : ""}</div></div>`;
        }).join("");
  }

  const titleLine = isCV || isLetter
    ? `<h1 class="cv-name">[YOUR FULL NAME]</h1><div class="cv-title">[Professional Title]</div><div class="cv-contact-bar">[Phone] &nbsp;·&nbsp; [Email] &nbsp;·&nbsp; [Location]</div>`
    : `<h1 class="cv-name" style="font-size:18pt">${escapeHtml(label)}</h1><div class="cv-title">Nursing Uganda: Career Resource</div>`;
  const hdr = `<div class="cv-header">${titleLine}</div>`;
  const fullBody = hasBgHdr ? `${hdr}<div class="cv-body">${mainContent}</div>` : `${hdr}${mainContent}`;

  return `<!DOCTYPE html><html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word"><head><meta charset="utf-8"><title>${escapeHtml(label)}</title><style>${s.css}.ph{color:#aaa;font-style:italic}.inst{background:#fffbeb;border-left:3px solid #d97706;padding:5px 10px;font-size:9pt;color:#7c4d00;margin:3px 0 8px;border-radius:0 4px 4px 0}@page{size:A4;margin:0}@media print{*{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}body{margin:0}.inst{display:none}}</style></head><body>${fullBody}</body></html>`;
}

// ─── DOWNLOAD HELPERS ──────────────────────────────────────────────────────
function _triggerDocDownload(html, filename) {
  const blob = new Blob(["﻿", html], { type: "application/msword" });
  const url  = URL.createObjectURL(blob);
  const a    = Object.assign(document.createElement("a"), { href: url, download: filename });
  document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
}
function _triggerPDFPrint(html) {
  const win = window.open("", "_blank", "width=850,height=700");
  if (!win) { alert("Allow pop-ups to generate PDF."); return; }
  win.document.write(html); win.document.close();
  setTimeout(() => { win.focus(); win.print(); }, 700);
}
function downloadCVDoc(data, styleId)            { _triggerDocDownload(buildCVDocHTML(data, styleId), `${(data.name||"my-cv").replace(/\s+/g,"-").toLowerCase()}-cv.doc`); }
function downloadCVPDF(data, styleId)            { _triggerPDFPrint(buildCVDocHTML(data, styleId)); }
function downloadTemplateDoc(label, styleId = "modern") { _triggerDocDownload(buildTemplateDocHTML(label, styleId), `${label.toLowerCase().replace(/[^a-z0-9]+/g,"-")}.doc`); }
function downloadTemplatePDF(label, styleId = "modern") { _triggerPDFPrint(buildTemplateDocHTML(label, styleId)); }

// ─── CV GENERATOR MODAL ────────────────────────────────────────────────────
function cvGenRoot() { return document.getElementById("cvg-root"); }

function openCVGenerator() {
  cvGen.open = true;
  renderCVGenIntoRoot();
  document.body.style.overflow = "hidden";
}
function closeCVGenerator() {
  cvGen.open = false;
  const r = cvGenRoot(); if (r) r.innerHTML = "";
  document.body.style.overflow = "";
}
function renderCVGenIntoRoot() {
  const r = cvGenRoot(); if (!r) return;
  r.innerHTML = renderCVGeneratorModal();
  const iframe = r.querySelector(".cvg-preview-frame");
  if (iframe) {
    const blob = new Blob([buildCVDocHTML(cvGen.data, cvGen.styleId)], { type: "text/html" });
    iframe.src = URL.createObjectURL(blob);
  }
  bindCVGenEvents(r);
}
function cvGenSave(r) {
  const g = n => r.querySelector(`[name="${n}"]`)?.value || "";
  Object.assign(cvGen.data, { name: g("name"), jobTitle: g("jobTitle"), email: g("email"), phone: g("phone"), location: g("location"), linkedin: g("linkedin"), summary: g("summary"), skills: g("skills"), languages: g("languages"), references: g("references") || "Available upon request" });
  cvGen.data.experience = cvGen.data.experience.map((_,i) => ({ company: g(`exp-company-${i}`), role: g(`exp-role-${i}`), dates: g(`exp-dates-${i}`), duties: g(`exp-duties-${i}`) }));
  cvGen.data.education  = cvGen.data.education.map((_,i)  => ({ degree: g(`edu-degree-${i}`), institution: g(`edu-inst-${i}`), year: g(`edu-year-${i}`) }));
  const sr = r.querySelector("input[name='cv-style']:checked"); if (sr) cvGen.styleId = sr.value;
}
let _cvPreviewTimer = null;
function updateCVPreview(r) {
  clearTimeout(_cvPreviewTimer);
  _cvPreviewTimer = setTimeout(() => {
    const iframe = r.querySelector(".cvg-preview-frame"); if (!iframe) return;
    const old = iframe.src;
    const blob = new Blob([buildCVDocHTML(cvGen.data, cvGen.styleId)], { type: "text/html" });
    iframe.src = URL.createObjectURL(blob);
    if (old && old.startsWith("blob:")) URL.revokeObjectURL(old);
  }, 350);
}
function bindCVGenEvents(r) {
  r.querySelector(".cvg-close")?.addEventListener("click", closeCVGenerator);
  r.querySelector(".cvg-overlay")?.addEventListener("click", e => { if (e.target === e.currentTarget) closeCVGenerator(); });
  r.querySelector(".cvg-next")?.addEventListener("click", () => { cvGenSave(r); cvGen.step = Math.min(6, cvGen.step + 1); renderCVGenIntoRoot(); });
  r.querySelector(".cvg-prev")?.addEventListener("click", () => { cvGenSave(r); cvGen.step = Math.max(1, cvGen.step - 1); renderCVGenIntoRoot(); });
  r.querySelectorAll("input[name='cv-style']").forEach(el => el.addEventListener("change", () => { cvGen.styleId = el.value; updateCVPreview(r); }));
  r.querySelectorAll(".cvg-form input, .cvg-form textarea").forEach(el => el.addEventListener("input", () => { cvGenSave(r); updateCVPreview(r); }));
  r.querySelector("[data-add-exp]")?.addEventListener("click", () => { cvGenSave(r); cvGen.data.experience.push({ company:"", role:"", dates:"", duties:"" }); renderCVGenIntoRoot(); });
  r.querySelector("[data-add-edu]")?.addEventListener("click", () => { cvGenSave(r); cvGen.data.education.push({ institution:"", degree:"", year:"" }); renderCVGenIntoRoot(); });
  r.querySelectorAll("[data-remove-exp]").forEach(b => b.addEventListener("click", () => { cvGenSave(r); cvGen.data.experience.splice(+b.dataset.removeExp,1); renderCVGenIntoRoot(); }));
  r.querySelectorAll("[data-remove-edu]").forEach(b => b.addEventListener("click", () => { cvGenSave(r); cvGen.data.education.splice(+b.dataset.removeEdu,1); renderCVGenIntoRoot(); }));
  r.querySelector(".cvg-dl-pdf")?.addEventListener("click", () => { cvGenSave(r); downloadCVPDF(cvGen.data, cvGen.styleId); });
  r.querySelector(".cvg-dl-doc")?.addEventListener("click", () => { cvGenSave(r); downloadCVDoc(cvGen.data, cvGen.styleId); });
  const escFn = e => { if (e.key === "Escape") { closeCVGenerator(); document.removeEventListener("keydown", escFn); } };
  document.addEventListener("keydown", escFn);
}

function renderCVGeneratorModal() {
  const { step, styleId, data } = cvGen;
  const STEPS = ["Style","Personal","Summary","Experience","Education","Skills"];
  const stepsBar = STEPS.map((name,i) => {
    const n=i+1, active=n===step, done=n<step;
    return `<div class="cvg-step${active?" cvg-step--a":""}${done?" cvg-step--d":""}"><span class="cvg-step-dot">${done?"✓":n}</span><span class="cvg-step-lbl">${name}</span></div>`;
  }).join("");

  let formBody = "";
  if (step === 1) {
    formBody = `<div class="cvg-step-head"><h3>Choose a Template Style</h3><p>Pick the look for your CV. You can change it any time.</p></div>
      <div class="cvg-style-grid">${CV_STYLES.map(s=>`<label class="cvg-style-opt${styleId===s.id?" cvg-style-opt--a":""}"><input type="radio" name="cv-style" value="${s.id}"${styleId===s.id?" checked":""}><div class="cvg-style-swatch" style="background:${s.swatch}"></div><strong>${s.name}</strong><span>${s.desc}</span></label>`).join("")}</div>`;
  } else if (step === 2) {
    formBody = `<div class="cvg-step-head"><h3>Personal Details</h3><p>Your contact details go at the top of the CV.</p></div>
      <div class="cvg-grid2">
        <div class="cvg-field"><label>Full Name</label><input type="text" name="name" value="${escapeHtml(data.name)}" placeholder="e.g. Nakato Sarah" autocomplete="name"></div>
        <div class="cvg-field"><label>Professional Title</label><input type="text" name="jobTitle" value="${escapeHtml(data.jobTitle)}" placeholder="e.g. Registered Staff Nurse"></div>
        <div class="cvg-field"><label>Phone</label><input type="tel" name="phone" value="${escapeHtml(data.phone)}" placeholder="+256 700 000 000"></div>
        <div class="cvg-field"><label>Email</label><input type="email" name="email" value="${escapeHtml(data.email)}" placeholder="you@example.com"></div>
        <div class="cvg-field"><label>Location</label><input type="text" name="location" value="${escapeHtml(data.location)}" placeholder="Kampala, Uganda"></div>
        <div class="cvg-field"><label>LinkedIn / Website <small>(optional)</small></label><input type="text" name="linkedin" value="${escapeHtml(data.linkedin)}" placeholder="linkedin.com/in/yourname"></div>
      </div>`;
  } else if (step === 3) {
    formBody = `<div class="cvg-step-head"><h3>Professional Summary</h3><p>2–4 sentences: nursing level, specialty, experience, key strength.</p></div>
      <div class="cvg-field cvg-field--full"><label>Summary</label><textarea name="summary" rows="6" placeholder="e.g. Registered Staff Nurse with 4 years of clinical experience in medical-surgical nursing at Mulago National Referral Hospital. UNMC-registered with current BLS certification. Skilled in IV therapy, wound care and patient assessment. Seeking a senior nursing officer post with opportunity to mentor junior staff.">${escapeHtml(data.summary)}</textarea></div>`;
  } else if (step === 4) {
    formBody = `<div class="cvg-step-head"><h3>Work Experience</h3><p>Most recent position first. Up to 3 positions.</p></div>
      ${data.experience.map((exp,i)=>`<div class="cvg-group"><div class="cvg-group-hd"><strong>Position ${i+1}</strong>${i>0?`<button type="button" class="cvg-remove-btn" data-remove-exp="${i}">Remove</button>`:""}</div><div class="cvg-grid2"><div class="cvg-field"><label>Employer / Facility</label><input type="text" name="exp-company-${i}" value="${escapeHtml(exp.company)}" placeholder="e.g. Mulago Hospital"></div><div class="cvg-field"><label>Your Role / Title</label><input type="text" name="exp-role-${i}" value="${escapeHtml(exp.role)}" placeholder="e.g. Staff Nurse, Ward 5B"></div><div class="cvg-field cvg-field--full"><label>Dates</label><input type="text" name="exp-dates-${i}" value="${escapeHtml(exp.dates)}" placeholder="e.g. Jan 2021 – Present"></div></div><div class="cvg-field cvg-field--full"><label>Key Duties &amp; Achievements <small>(one per line)</small></label><textarea name="exp-duties-${i}" rows="4" placeholder="Managed 20-bed medical-surgical ward&#10;Administered IV medications and monitored vital signs&#10;Supervised 2 student nurses on clinical placement">${escapeHtml(exp.duties)}</textarea></div></div>`).join("")}
      ${data.experience.length < 3 ? `<button type="button" class="cvg-add-btn" data-add-exp>+ Add Another Position</button>` : ""}`;
  } else if (step === 5) {
    formBody = `<div class="cvg-step-head"><h3>Education</h3><p>Most recent qualification first.</p></div>
      ${data.education.map((edu,i)=>`<div class="cvg-group"><div class="cvg-group-hd"><strong>Qualification ${i+1}</strong>${i>0?`<button type="button" class="cvg-remove-btn" data-remove-edu="${i}">Remove</button>`:""}</div><div class="cvg-grid3"><div class="cvg-field"><label>Degree / Diploma</label><input type="text" name="edu-degree-${i}" value="${escapeHtml(edu.degree)}" placeholder="e.g. Bachelor of Nursing Science"></div><div class="cvg-field"><label>Institution</label><input type="text" name="edu-inst-${i}" value="${escapeHtml(edu.institution)}" placeholder="e.g. Makerere University"></div><div class="cvg-field"><label>Year</label><input type="text" name="edu-year-${i}" value="${escapeHtml(edu.year)}" placeholder="2020"></div></div></div>`).join("")}
      ${data.education.length < 3 ? `<button type="button" class="cvg-add-btn" data-add-edu>+ Add Another Qualification</button>` : ""}`;
  } else if (step === 6) {
    formBody = `<div class="cvg-step-head"><h3>Skills &amp; Download</h3><p>Add your skills then download your finished CV.</p></div>
      <div class="cvg-field cvg-field--full"><label>Clinical Skills <small>(comma-separated)</small></label><textarea name="skills" rows="3" placeholder="IV cannulation, wound dressing, catheterisation, BLS, medication administration, patient assessment, blood pressure monitoring, HMIS reporting…">${escapeHtml(data.skills)}</textarea></div>
      <div class="cvg-grid2">
        <div class="cvg-field"><label>Languages</label><input type="text" name="languages" value="${escapeHtml(data.languages)}" placeholder="e.g. English (fluent), Luganda (native)"></div>
        <div class="cvg-field"><label>References</label><input type="text" name="references" value="${escapeHtml(data.references)}" placeholder="Available upon request"></div>
      </div>
      <div class="cvg-download-box">
        <p class="cvg-dl-title">Your CV is ready to download</p>
        <p class="cvg-dl-sub">PDF for direct submission &bull; DOC to edit in Word or Google Docs</p>
        <div class="cvg-dl-btns">
          <button type="button" class="button primary cvg-dl-pdf">Download PDF</button>
          <button type="button" class="button secondary cvg-dl-doc">Download DOC (Word)</button>
        </div>
      </div>`;
  }

  return `<div class="cvg-overlay" id="cvg-overlay" role="dialog" aria-modal="true" aria-label="CV Generator">
    <div class="cvg-modal">
      <div class="cvg-hdr">
        <div class="cvg-hdr-left"><span class="cvg-hdr-icon">CV</span><div><h2>CV Generator</h2><p>Build your nursing CV in minutes</p></div></div>
        <button type="button" class="cvg-close" aria-label="Close">✕</button>
      </div>
      <div class="cvg-steps-bar">${stepsBar}</div>
      <div class="cvg-body">
        <form class="cvg-form" novalidate>
          <div class="cvg-form-inner">${formBody}</div>
          <div class="cvg-nav">
            ${step>1?`<button type="button" class="button secondary cvg-prev">← Back</button>`:`<span></span>`}
            ${step<6?`<button type="button" class="button primary cvg-next">Continue →</button>`:`<span></span>`}
          </div>
        </form>
        <div class="cvg-preview">
          <div class="cvg-preview-lbl">Live Preview</div>
          <div class="cvg-preview-wrap"><iframe class="cvg-preview-frame" title="CV Preview" sandbox="allow-same-origin"></iframe></div>
        </div>
      </div>
    </div>
  </div>`;
}

function downloadCareerChecklist(title) {
  const safeTitle = String(title || "career-checklist");
  // Check licensing guides first
  const guide = licensingGuides().find(([guideTitle]) => guideTitle === safeTitle);
  if (guide) {
    const [, , steps, docs] = guide;
    const stepList = (steps || "").split("|").filter(Boolean);
    const content = [
      `${safeTitle}: Nursing Uganda Checklist`,
      "─".repeat(50),
      "",
      "STEPS",
      ...stepList.map((s, i) => `  ${i + 1}. ${s}`),
      "",
      "DOCUMENTS REQUIRED",
      ...docs.map((doc) => `  [ ] ${doc}`),
      "",
      "─".repeat(50),
      "Source: nursinguganda.com | Print or save as PDF."
    ].join("\n");
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([content], { type: "text/plain" }));
    link.download = `${slugify(safeTitle)}-checklist.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    return;
  }
  // Check resource-specific content
  const resource = RESOURCE_CHECKLISTS[safeTitle];
  const intro = resource ? resource.intro : safeTitle;
  const items = resource ? resource.items : ["Updated CV", "Registration certificate", "Academic transcript", "Good standing letter", "Two professional referees"];
  const content = [
    `${intro}`,
    "─".repeat(60),
    "",
    ...items.map((item) => `  [ ] ${item}`),
    "",
    "─".repeat(60),
    "Source: nursinguganda.com | Print or save as PDF."
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

  // Items format: [name, use, preparation, safety, examPoints[], types]
  const categoryData = [
    {
      title: "Assessment And Vital Signs",
      body: "Tools used for baseline observations, triage and routine patient monitoring.",
      items: [
        ["Stethoscope",
         "Auscultates heart, lung and bowel sounds during clinical assessment. Essential for detecting murmurs, crackles, wheeze and absent bowel sounds.",
         "Clean earpieces and diaphragm with an alcohol wipe before and after each patient. Warm the diaphragm by rubbing it before chest placement.",
         "Do not press too hard during auscultation. Ensure earpieces are angled forward for effective sound transmission and do not share without decontamination.",
         ["Name the instrument: stethoscope; used for auscultation of body sounds.", "State its uses: heart sounds (S1/S2), lung sounds (wheeze, crackle, absent), bowel sounds.", "Identify parts: earpieces, tubing, diaphragm (high frequency sounds) and bell (low frequency sounds).", "Preparation: clean diaphragm with alcohol wipe; warm before placing on skin.", "Safety: decontaminate between patients; do not share without cleaning.", "Auscultate apex, pulmonary and tricuspid areas for heart; two anterior and two posterior lung fields."],
         "Diaphragm side (high-pitched sounds) and bell side (low-pitched); adult and paediatric models"],
        ["Blood pressure machine",
         "Measures systolic and diastolic blood pressure. Normal adult reading is below 120/80 mmHg.",
         "Select the correct cuff size: the bladder should encircle at least 80% of the upper arm. Position the arm at heart level with the palm facing up.",
         "Never measure on an injured, cannulated or fistula arm. Avoid measuring immediately after exertion, pain or anxiety.",
         ["Name the instrument; state it measures blood pressure in mmHg.", "State normal adult range: systolic below 120 mmHg, diastolic below 80 mmHg.", "State correct cuff selection: bladder should cover 80% of upper arm circumference.", "Position: patient seated, arm supported at heart level, palm facing up.", "Preparation: confirm manometer reads zero, check tubing for cracks and cuff inflation.", "Safety: never use on a fistula arm, arm with IV access or post-mastectomy side."],
         "Aneroid (manual), digital automatic; cuff sizes: infant, child, standard adult, large adult"],
        ["Thermometer",
         "Measures body temperature in degrees Celsius. Normal oral temperature is 36.1–37.2°C; rectal is 0.5°C higher and axillary 0.5°C lower.",
         "Select the correct route for the patient. Clean reusable probes with alcohol wipe or use disposable probe covers.",
         "Always document the route alongside the reading. Rectal thermometers are contraindicated in patients with rectal surgery, neutropenia or low platelet count.",
         ["Name the instrument: thermometer; measures temperature in degrees Celsius.", "State normal ranges: oral 36.1–37.2°C, axillary 35.5–37.0°C, rectal 36.6–38.0°C.", "Identify types: digital oral, tympanic (ear), infrared forehead, axillary.", "Preparation: select correct route, use probe cover or clean probe, wait for stable reading.", "Safety: always document the route; rectal route is contraindicated after rectal surgery.", "Fever is defined as above 38°C; hypothermia as below 35°C."],
         "Digital oral, tympanic (ear), temporal (forehead), axillary, rectal"],
        ["Pulse oximeter",
         "Measures peripheral oxygen saturation (SpO2) and pulse rate non-invasively using a light sensor. Normal SpO2 in healthy adults is 95–100%.",
         "Place the probe on a warm, clean fingertip. Remove nail polish if present and ensure the finger is still.",
         "Poor peripheral perfusion, cold extremities, nail polish, movement and carbon monoxide exposure can all affect accuracy. Always interpret alongside respiratory rate and patient appearance.",
         ["Name the instrument; state it measures oxygen saturation (SpO2) and pulse rate.", "State normal SpO2 range: 95–100% in healthy adults; 92–95% may be acceptable in stable COPD.", "Apply on a warm fingertip; remove nail varnish; wait for stable waveform.", "Preparation: ensure probe fits snugly; position hand at rest; wait before recording.", "Safety: inaccurate in cold extremities, shock, arrhythmias and carbon monoxide poisoning.", "Always pair SpO2 with respiratory rate, skin colour and work of breathing."],
         "Finger clip (adult and paediatric), handheld probe, wrist and neonatal wrap-around types"],
        ["Glucometer",
         "Measures capillary blood glucose at the bedside. Normal fasting glucose is 3.9–5.5 mmol/L (70–99 mg/dL).",
         "Use calibrated, in-date strips matched to the device. Perform hand hygiene, wipe the fingertip and use a new lancet for each patient.",
         "Never share lancets between patients. Document the result with time, site and patient name.",
         ["Name the instrument: glucometer; measures capillary blood glucose.", "State normal fasting glucose: 3.9–5.5 mmol/L; above 7.0 mmol/L fasting is diagnostic of diabetes.", "Preparation: calibrate device, check strip expiry, perform hand hygiene before and after.", "Technique: fingerstick on the side of the fingertip; apply blood to strip promptly.", "Sharps safety: dispose lancet directly into sharps container immediately after use.", "Document result, time, patient name and action taken for any abnormal reading."],
         "Portable handheld; test strips vary by brand and must match the device model"],
        ["Percussion hammer",
         "Elicits deep tendon reflexes during neurological assessment. Used on the patellar, Achilles, biceps and brachioradialis tendons.",
         "Hold the handle at the end and use a swift wrist flick to strike the tendon directly. Ensure the patient's limb is relaxed and correctly positioned.",
         "Do not strike with excessive force. Compare both sides and grade reflexes consistently from 0 (absent) to 4+ (very brisk with clonus).",
         ["Name the instrument: tendon or percussion hammer; used for deep tendon reflex testing.", "State reflex sites and spinal levels: patellar L3–L4, Achilles S1–S2, biceps C5–C6.", "Technique: hold handle at the end; use a quick wrist-flick motion; strike tendon directly.", "Normal response: brisk reflex; abnormal findings: absent suggests lower motor neurone lesion, exaggerated suggests upper motor neurone lesion.", "If reflexes absent: reinforce using Jendrassik manoeuvre (patient interlocks and pulls fingers).", "Grade and compare bilaterally; document symmetry and grade in patient notes."],
         "Taylor (tomahawk) style, Queen Square style; adult and paediatric sizes"],
        ["Penlight",
         "A handheld torch used to assess pupil reaction and inspect the oral cavity, throat, ears and wound areas.",
         "Test pupils in a dimly lit room for accurate assessment. Move the light from the side rather than directly in front of the face.",
         "Do not shine directly into the eye for a prolonged period. Document pupil size in millimetres, shape, and both direct and consensual reactions separately.",
         ["Name the instrument: penlight or diagnostic torch; used for pupil assessment and cavity inspection.", "State normal pupil size: 2–5 mm; equal bilaterally; round shape; brisk reaction to light.", "Test direct response (ipsilateral pupil constricts) and consensual response (contralateral constricts).", "Abnormal findings to report: unequal pupils, absent reaction, dilated fixed pupils, neurological emergency.", "Preparation: test in reduced lighting; approach from the side; move light briskly.", "Document each eye separately: size in mm, equality, shape and reaction speed (brisk, sluggish, absent)."],
         "Penlight with clip, diagnostic handle; pupil gauge scale often printed on casing"],
        ["Peak flow meter",
         "Measures peak expiratory flow rate (PEFR) in litres per minute to assess airway obstruction in asthma and COPD management.",
         "The patient stands or sits upright, takes a full deep breath, seals the lips around the mouthpiece and blows out as hard and fast as possible.",
         "Record the best of three attempts. Compare the result to the patient's personal best or predicted value for their height, age and sex.",
         ["Name the instrument: peak flow meter; measures peak expiratory flow rate (PEFR) in L/min.", "Normal PEFR varies by age, sex and height; always compare to patient's personal best.", "Instruct patient: stand or sit upright, full breath in, lips sealed, one hard fast exhalation.", "Record best of three attempts; below 50% of personal best requires urgent clinical action.", "Safety: use a clean mouthpiece or disposable filter for each patient.", "OSCE zones: green above 80%, yellow 50–80%, red below 50% of personal best."],
         "Standard adult (60–800 L/min), paediatric (30–400 L/min); low-range for severe disease"]
      ]
    },
    {
      title: "Injection And IV Care",
      body: "Equipment used for safe injections, cannulation, fluids and medication administration.",
      items: [
        ["Syringes",
         "Draw and deliver accurate, measured volumes of medication, fluid or blood. Available in multiple sizes and tip configurations for different routes.",
         "Check the size, sterility, packaging integrity and expiry before use. Draw up medication using aseptic technique without contaminating the barrel.",
         "Use each syringe for one patient and one procedure only. Discard directly into a sharps container without recapping the needle.",
         ["Name the instrument: syringe; used for accurate measurement and delivery of fluids or medication.", "Identify parts: barrel (graduated), plunger, tip (Luer-lock or slip-tip).", "Select correct size: 1 mL for insulin/tuberculin, 5–10 mL for IM or IV, 20–60 mL for irrigation.", "Preparation: check packaging, sterility and expiry; draw up without contaminating the barrel.", "Safety: one syringe equals one patient and one procedure only; never share.", "Disposal: into sharps container immediately after use; do not recap or bend the needle."],
         "1 mL tuberculin, 2.5 mL, 5 mL, 10 mL, 20 mL, 50/60 mL; Luer-lock and slip-tip variants"],
        ["Needles",
         "Pierce tissue, skin or vial septa for injections, drug preparation and blood sampling. Higher gauge number means a finer needle diameter.",
         "Select gauge and length based on the injection route and patient body size. Check packaging and confirm the bevel is undamaged before use.",
         "Never recap a used needle with two hands. Use the single-hand scoop technique only when recapping is unavoidable under local policy.",
         ["Name the instrument: hypodermic needle; used to pierce tissue or vial septa for injections.", "State gauge selection by route: IM 21–23G, subcutaneous 25–27G, IV 18–22G, intradermal 25–27G.", "Higher gauge number equals finer needle; lower gauge equals wider bore.", "Preparation: remove cover without contaminating the bevel; choose correct gauge for drug viscosity.", "Safety: never recap with two hands; use one-hand scoop method only if absolutely required.", "Disposal: directly into sharps bin immediately after use; never force, bend or break a needle."],
         "Gauges 18G to 27G; lengths 10 mm to 40 mm; colour-coded by gauge in many systems"],
        ["IV cannula",
         "Provides continuous venous access for fluids, blood products and intravenous medication. Inserted percutaneously and secured with a transparent dressing.",
         "Select the vein, clean skin with antiseptic, apply tourniquet, insert bevel-up at 15–30°, advance into vein on flashback of blood, remove stylet and secure.",
         "Flush after insertion to confirm patency. Monitor every shift for infiltration, phlebitis, pain and swelling.",
         ["Name the instrument: peripheral IV cannula; provides continuous venous access.", "State gauge and colour coding: 14G grey (major trauma), 16G brown, 18G green, 20G pink, 22G blue.", "Insertion technique: bevel up at 15–30°, advance on blood flashback, remove stylet, flush.", "Preparation: tourniquet 10 cm above site, clean skin, let it dry, prime extension set.", "Safety: confirm blood return and patency; observe for swelling (infiltration) and redness (phlebitis).", "Change peripheral cannula site every 72–96 hours or sooner if complications appear."],
         "14G–24G; colour-coded; with or without injection port; winged butterfly for fragile veins"],
        ["Giving set",
         "Connects an IV fluid container to a patient's venous access for controlled fluid delivery. Standard giving sets deliver 20 drops per mL.",
         "Spike the bag aseptically, squeeze the drip chamber to half-full, prime the tubing fully to remove all air bubbles before connecting to the patient.",
         "Calculate and set the correct flow rate. Change the giving set every 72 hours for standard fluids, every 24 hours for blood products.",
         ["Name the instrument: IV giving set; connects IV fluid to the patient's venous access.", "Identify components: spike, drip chamber, roller clamp, injection port, connector.", "Drop factor: standard 20 drops/mL; blood or colloid set 15 drops/mL; micro-drip 60 drops/mL.", "Priming: spike bag, squeeze drip chamber to half, open clamp to fill line, check no air bubbles.", "Safety: remove all air before connecting to patient; label tubing with start date and time.", "Change every 72 hours for standard IV fluids and every 24 hours for blood and lipid infusions."],
         "Standard (20 drops/mL), blood (15 drops/mL), burette or micro-drip (60 drops/mL), paediatric sets"],
        ["Tourniquet",
         "Temporarily distends veins to improve visibility and access for blood sampling or IV cannulation. Applied 5–10 cm proximal to the intended site.",
         "Apply firmly enough to distend the vein without causing discoloration. Ask the patient to clench and open the fist several times.",
         "Release the tourniquet as soon as blood flow begins or the cannula is secured. Never leave in place for longer than two minutes.",
         ["Name the instrument: tourniquet; temporarily distends veins for venous access.", "Apply 5–10 cm above the intended site; snug but not painful.", "Preparation: use a clean or single-use tourniquet; apply over clothing if needed for comfort.", "Ask patient to clench and open fist several times to distend the vein.", "Safety: release immediately once blood flows or cannula is secured; never exceed two minutes.", "Do not apply over an infected area, wound, oedema, fistula or existing IV line."],
         "Latex-free flat band (most common), Velcro strap; single-use preferred to prevent cross-infection"]
      ]
    },
    {
      title: "Dressing And Wound Care",
      body: "Instruments used during wound cleaning, dressing, minor procedures and infection prevention.",
      items: [
        ["Dressing tray",
         "Holds all sterile supplies needed for wound cleaning and dressing procedures. Assembled aseptically before the procedure begins.",
         "Prepare using a non-touch sterile technique. Arrange the largest sterile items first, then smaller items on top in the order they will be used.",
         "Maintain the sterile field throughout. If any item falls outside the sterile zone or is contaminated, discard and replace it immediately.",
         ["Name the instrument: dressing tray; holds sterile supplies for wound care procedures.", "Typical contents: dressing pack, gauze, forceps, antiseptic, appropriate dressing, tape.", "Preparation: perform hand hygiene; open packs without contaminating inner contents; arrange in use order.", "Sterile field rule: never reach over it; no unsterile items enter the field; work from centre outward.", "Safety: if the sterile field is breached in any way, discard all items and restart with fresh supplies.", "OSCE tip: explain each item's purpose and demonstrate hand hygiene before touching the tray."],
         "Stainless steel reusable tray or single-use cardboard procedure pack; sizes vary by procedure"],
        ["Kidney dish",
         "A bean-shaped concave receptacle used to receive soiled swabs, small instruments, fluid or waste during clinical procedures.",
         "Use a separate clean kidney dish for sterile items and another for waste. Ensure the dish is clean before placing anything sterile in it.",
         "Never mix clean and contaminated items in the same dish. Decontaminate stainless steel dishes according to facility protocol after use.",
         ["Name the instrument: kidney dish; holds instruments, swabs or collects fluids during procedures.", "Identify its characteristic shape: kidney or bean-shaped with concave centre.", "Use one dish for clean items and a separate dish for contaminated waste, never mix the two.", "Preparation: ensure the dish is clean and dry before placing any sterile items in it.", "Safety: a contaminated dish must be treated as clinical waste; never reuse without decontamination.", "Decontaminate stainless steel dishes per facility policy before autoclaving for reuse."],
         "Stainless steel reusable (250–500 mL) or disposable; various sizes"],
        ["Artery forceps",
         "Haemostatic clamps used to compress bleeding vessels, hold tissue or secure drains. The ratchet mechanism locks the clamp in place.",
         "Check that the ratchet locks and releases smoothly before use. Apply with the curve facing away from underlying structures.",
         "Use the minimum force needed to stop bleeding. Avoid crushing vessel walls unnecessarily as this damages tissue and delays healing.",
         ["Name the instrument: artery forceps (haemostatic or mosquito forceps); clamps vessels and holds tissue.", "Identify the ratchet locking mechanism: one click closes lightly; additional clicks increase force.", "Types: straight or curved; mosquito (small vessels), Kelly or Rochester (larger vessels).", "Preparation: confirm sterility; test the ratchet opens and closes correctly before use.", "Application: place curve away from deeper structures; clamp vessel at right angles.", "Safety: apply minimum necessary force; do not leave clamped tissue unattended."],
         "Mosquito (small vessels), standard, Kelly (large vessels); straight or curved; ratcheted handles"],
        ["Dissecting forceps",
         "Handle tissue, swabs, dressings or wound edges during procedures requiring precision. Available in toothed and non-toothed designs.",
         "Select non-toothed forceps for dressing changes and toothed forceps when a secure grip on firm tissue is required.",
         "Never touch the sterile tips with bare hands. Hold the forceps between thumb, index and middle fingers for controlled manipulation.",
         ["Name the instrument: dissecting or tissue forceps; holds tissue, gauze or dressings.", "Identify types: toothed (traumatic, firm grip on fascia) and non-toothed or smooth (atraumatic for delicate tissue).", "Select non-toothed for wound care and dressings; toothed for suturing and tissue grasping.", "Preparation: check sterility and tip alignment; hold by the body, not the tips.", "Safety: never touch sterile tips with bare hands; avoid toothed forceps on fragile tissue.", "Correct grip: thumb and ring finger in handles; index finger on hinge for control."],
         "Non-toothed McIndoe, toothed Adson (1 × 2 teeth); lengths 12–20 cm"],
        ["Bandage scissors",
         "Cut bandages, dressings and clothing safely without injuring the patient. The angled lower blade has a blunt tip designed to slide safely under bandages.",
         "Insert the lower blade between the bandage and skin before cutting. Keep the blunt tip against the skin at all times.",
         "Always announce cutting to the patient before each cut. Inspect blade sharpness before each procedure and store safely after use.",
         ["Name the instrument: bandage scissors (Lister scissors); cut bandages and dressings safely.", "Identify the key feature: the blunt angled lower blade that slides safely under bandages.", "Preparation: confirm scissors are clean and sharp; carry safely with tips pointing down.", "Technique: insert lower blade between dressing and skin; cut upward away from the patient.", "Safety: blunt tip always toward patient skin; announce each cut before making it.", "Clean after use; inspect blades; never use dressing scissors for other cutting tasks."],
         "Lister (angled lower blade), standard curved bandage scissors; stainless steel, lightweight"]
      ]
    },
    {
      title: "Midwifery And Obstetric Care",
      body: "Common instruments for antenatal assessment, labour monitoring and delivery support.",
      items: [
        ["Fetoscope",
         "An acoustic device for auscultating fetal heart sounds during antenatal visits. It transmits sounds through bone conduction without requiring electricity.",
         "Palpate fetal position using Leopold's manoeuvres to locate the fetal back before applying. Apply the fetoscope firmly over the back and count for a full minute.",
         "Simultaneously palpate the mother's radial pulse to distinguish fetal from maternal sounds. A fetal heart rate below 110 or above 160 bpm requires immediate assessment.",
         ["Name the instrument: Pinard fetoscope; auscultates fetal heart sounds during pregnancy.", "State normal fetal heart rate: 110–160 beats per minute.", "Preparation: perform Leopold's manoeuvres to identify fetal back before placing the fetoscope.", "Count for 60 seconds; simultaneously palpate maternal pulse to distinguish fetal from maternal sounds.", "Safety: FHR below 110 or above 160 bpm, or irregular rhythm, report immediately.", "Reassess after repositioning if sounds are unclear; try the opposite fetal side."],
         "Pinard (trumpet-shaped metal or plastic); monaural; no battery required"],
        ["Vaginal speculum",
         "Visualises the vaginal walls and cervix during gynaecological examination, cervical assessment or procedures such as PAP smear.",
         "Select the correct size, warm and lubricate the speculum. Position the patient in the lithotomy position, obtain consent and ensure privacy.",
         "Insert at 45° downward then rotate to horizontal. Open blades slowly and never force the speculum. Explain all sensations beforehand.",
         ["Name the instrument: vaginal speculum; visualises cervix and vaginal walls.", "Identify types: Cusco or bivalve (duckbill) for cervical access; Sims' single blade for vaginal wall examination.", "Preparation: select correct size, warm, lubricate; obtain verbal consent; position patient and ensure privacy.", "Insertion: tilt 45° downward, rotate to horizontal, open blades slowly after full insertion.", "Safety: never force; if resistance is met, reassess; do not proceed against patient discomfort.", "Document findings: cervical appearance, discharge colour and character, lesions and any bleeding."],
         "Cusco small, medium and large; Sims' single blade; metal reusable or disposable plastic"],
        ["Cord clamp",
         "Applied to the umbilical cord after birth to prevent bleeding before and after cord cutting. Applied as two separate clamps prior to cutting between them.",
         "Apply the first clamp 2–3 cm from the baby's umbilicus and the second clamp 2 cm further along. Cut between the two clamps with sterile scissors.",
         "Confirm the clamp is locked correctly and inspect the stump in the early newborn period. Report any bleeding immediately.",
         ["Name the instrument: cord clamp (Hollister clamp); prevents umbilical cord bleeding after delivery.", "Apply first clamp 2–3 cm from baby's abdomen; second clamp 2 cm distally.", "Confirm cord pulsation has ceased or follow early or delayed cord clamping protocol before applying.", "Preparation: sterile clamp within reach before second stage of labour begins.", "Cut cord between the two clamps using sterile scissors; inspect and document cord vessel count.", "Safety: inspect cord stump hourly in early newborn period; report any bleeding immediately."],
         "Plastic Hollister disposable clamp; cord tie as low-resource alternative"],
        ["Delivery set",
         "A sterile instrument pack containing everything needed to conduct a normal vaginal delivery and provide immediate newborn care.",
         "Check all items are present, sterile and within expiry before second stage begins. Arrange on a sterile surface within arm's reach.",
         "Maintain strict aseptic technique throughout. Count all instruments before and after delivery.",
         ["Name the instrument set: sterile delivery set; used for normal vaginal delivery.", "Typical contents: two cord clamps, sterile scissors, artery forceps, kidney dish, gauze, swabs, sterile gloves.", "Preparation: check all items are present, sterile and unexpired before second stage begins.", "Arrange on a sterile trolley within reach; open only when delivery is imminent.", "Safety: count instruments before and after; maintain strict aseptic technique at all times.", "OSCE tip: name each item and state its purpose when presenting the delivery set."],
         "Pre-packaged sterile delivery kit; contents vary by facility level and national protocol"],
        ["Sponge holding forceps",
         "Also called ring or swab-holding forceps: holds swabs, gauze or sponges during antiseptic skin preparation and obstetric or gynaecological procedures.",
         "Load the swab firmly in the ring so it does not slip. Dip in antiseptic solution and wring out excess before use.",
         "Rinse the antiseptic-soaked swab in sterile water before vaginal application to prevent mucosal irritation.",
         ["Name the instrument: sponge holding forceps (ring or swab-holding forceps); holds swabs for cleansing.", "Identify the large ring-ended tips designed to grip gauze or sponges securely.", "Used for antiseptic skin preparation before procedures: perineal or abdominal cleaning.", "Preparation: confirm sterility; grip swab firmly in the rings; soak and wring out excess antiseptic.", "Safety: rinse antiseptic-soaked swab in sterile water before vaginal application.", "Use a fresh swab for each new area; work from clean to dirty, centre outward."],
         "Straight and curved ring forceps; large ring sponge-holding vs small ring swab; stainless steel"],
        ["Doppler fetal monitor",
         "An electronic device that amplifies fetal heart sounds using ultrasound, enabling earlier and clearer fetal heart rate assessment from 12 weeks gestation.",
         "Apply ultrasound gel to the probe head. Place over the fetal abdomen and sweep slowly to locate the fetal heart sounds.",
         "Distinguish fetal heart rate from the maternal pulse. Normal fetal heart rate is 110–160 bpm. Confirm electronically that the rate is not reflecting maternal pulse.",
         ["Name the instrument: hand-held Doppler fetal heart rate monitor; detects fetal heartbeat using ultrasound.", "Apply ultrasound gel before placing probe; sweep slowly over lower abdomen to locate fetal sounds.", "Normal FHR: 110–160 bpm; confirm simultaneously it is not the maternal pulse.", "Earlier detection than fetoscope: audible from approximately 12 weeks gestation.", "Safety: document date, time, FHR and any noted accelerations or decelerations.", "Abnormal: FHR below 110 or above 160 bpm, absent variability or persistent decelerations, report immediately."],
         "Hand-held pocket Doppler; CTG transducer for continuous monitoring; requires ultrasound gel"],
        ["Episiotomy scissors",
         "Specifically designed scissors for making a controlled perineal incision to facilitate delivery or prevent uncontrolled tearing during the second stage of labour.",
         "Confirm medical indication before performing episiotomy. Infiltrate local anaesthetic and wait for it to take effect before making the incision.",
         "Make a single deliberate cut at the peak of a contraction in the mediolateral direction. Repair immediately after delivery using absorbable suture.",
         ["Name the instrument: episiotomy scissors; used for controlled perineal incision.", "State indications: inadequate perineal stretch, fetal distress, instrumental delivery.", "Preparation: obtain consent, confirm indication, infiltrate local anaesthetic and wait for effect.", "Make a single cut at peak of contraction at a 45° mediolateral angle, avoid midline when possible.", "Safety: confirm anaesthetic effect before cutting; avoid premature or unnecessary use.", "After delivery: repair episiotomy immediately with absorbable suture; document in clinical notes."],
         "Straight or angled blade; similar to Mayo scissors; blunt rounded tips"]
      ]
    },
    {
      title: "Sterilization And Theatre",
      body: "Equipment used to keep instruments sterile, safe and ready for surgical and clinical procedures.",
      items: [
        ["Autoclave",
         "Sterilises instruments, linen and equipment using saturated steam under high pressure. Standard cycles run at 134°C for 3 minutes or 121°C for 15 minutes.",
         "Clean all instruments thoroughly before loading. Disassemble hinged items, arrange loosely for steam penetration and include chemical indicator strips in each load.",
         "Never open the autoclave while pressurised. Items must be completely dry after the cycle, wet packs are no longer considered sterile and must be discarded.",
         ["Name the instrument: autoclave; sterilises instruments using pressurised saturated steam.", "State standard cycle parameters: 134°C for 3 minutes (porous load) or 121°C for 15 minutes (gravity cycle).", "Preparation: clean instruments first; disassemble hinged items; use indicator strips or tape in each load.", "Loading rule: items should not touch; wrapped instruments must allow steam penetration to all surfaces.", "Safety: do not open while pressurised; wait for the full cooling cycle before handling.", "After cycle: check indicators have changed; dry packs only are sterile, discard wet packs immediately."],
         "Bench-top (small clinic), portable, large vertical (hospital); gravity and pre-vacuum types"],
        ["Sterile packs",
         "Pre-packaged sterile items sealed and sterilised by the manufacturer or CSSD for use in clinical and surgical procedures.",
         "Before use, check the outer packaging for tears, moisture, sterility indicator change and expiry date.",
         "Open aseptically using the peel-apart technique. Present to the sterile field by peeling back edges without contaminating the inner contents.",
         ["Name the item: sterile pack; contains items sterilised for use in clinical procedures.", "Inspect before use: intact packaging, sterility indicator changed to correct colour, expiry date valid, no moisture.", "Opening technique: peel apart edges from the corners; never reach inside the pack.", "Present to sterile field by peeling edges down and dropping contents directly into the field.", "Safety: wet, torn, expired or previously opened packs are no longer sterile, discard and replace.", "Store in a clean dry environment; rotate stock so nearest expiry is used first."],
         "Individual items (gloves, gauze) or full procedure packs (suture, dressing, catheter sets)"],
        ["Instrument tray",
         "Organises sterile instruments for a specific procedure. Covered with a sterile drape until the procedure is ready to begin.",
         "Arrange instruments in the order of use with most frequently needed items nearest. Count all instruments before beginning and verify count at closure.",
         "Handle the tray from the edges only after the sterile drape is applied. Never allow unsterile hands or items to reach over or into the sterile field.",
         ["Name the instrument: instrument or Mayo tray; organises sterile instruments for a procedure.", "Arrange in use order: instruments needed first placed nearest to the operator.", "Preparation: confirm sterility of all instruments and drape tray before the procedure begins.", "Theatre rule: count instruments, swabs and needles before and after every surgical procedure.", "Safety: handle from edges only after draping; never reach across the sterile field.", "OSCE tip: demonstrate opening instruments onto tray without contaminating the sterile field."],
         "Flat Mayo tray, ring-handled procedure tray, back table; all stainless steel"],
        ["Suture set",
         "A sterile instrument set for wound closure. Contains a needle holder, dissecting forceps, suture scissors, suture material and support items.",
         "Check the suture material type, size and expiry according to wound type and anatomical location. Mount the needle in the needle holder at the junction of the middle and distal thirds.",
         "Handle needles only with instruments at all times, never with fingers. Count all needles before and after the procedure.",
         ["Name the set: suture set; used for wound closure with suture material and instruments.", "Contents: needle holder, toothed dissecting forceps, suture scissors, swabs, drapes, suture material.", "Preparation: confirm suture type (absorbable vs non-absorbable), size and expiry.", "Needle holder technique: mount needle at junction of middle and distal thirds; lock at first ratchet click.", "Cut suture ends 5–10 mm from the knot; excess tails increase infection risk.", "Safety: count needles before and after; dispose into sharps bin immediately after removal."],
         "Absorbable (Vicryl, Chromic Gut) for deep tissue; non-absorbable (Nylon, Prolene) for skin closure"],
        ["Surgical scissors",
         "Cut tissue, sutures or other materials during surgery and wound care. Different types are selected based on the tissue and task.",
         "Identify the correct scissors type before use. Pass scissors to the surgeon with blades closed and rings facing the receiver.",
         "Never use tissue scissors to cut dressings or rough material. This permanently blunts the blades. Keep separate scissors designated for each task.",
         ["Name the instrument: surgical scissors; state that different types exist for specific tasks.", "Types: Mayo scissors (heavy tissue and fascia), Metzenbaum (delicate tissue dissection), suture scissors (cut suture only).", "Preparation: check blade sharpness and alignment; confirm sterility before use.", "Hold with thumb and ring finger in rings; index finger on one shank for control.", "Theatre technique: pass with blades closed and rings facing the receiver, never blade-first.", "Safety: use each scissors only for its designated purpose; blunt tissue scissors risk tissue trauma."],
         "Mayo (straight or curved), Metzenbaum, suture or stitch scissors, iris scissors for fine work"]
      ]
    },
    {
      title: "Patient Care Equipment",
      body: "Bedside tools used for comfort, elimination, airway, oxygen support and basic ward nursing.",
      items: [
        ["Bedpan",
         "Assists bedbound patients with elimination when they cannot use a toilet. Available in standard and fracture designs for different patient mobility levels.",
         "Warm the bedpan before use. Raise the head of the bed and assist the patient to lift their hips for positioning.",
         "Remove the bedpan promptly after use. Assess and document output if required. Offer perineal care and hand hygiene.",
         ["Name the instrument: bedpan; assists bedbound patients with elimination.", "Identify types: standard bedpan and fracture bedpan (low-profile slipper for post-hip-surgery patients).", "Preparation: warm in warm water; bring with toilet paper, call bell and privacy screen.", "Positioning: raise head of bed, assist patient to lift hips using bent knees.", "Safety: check skin under the bedpan rim for pressure injury; never leave a patient on the pan for long.", "After use: remove promptly, measure and document output if prescribed; offer hand hygiene."],
         "Standard round-bottom, fracture or slipper bedpan (low-profile); stainless steel or disposable"],
        ["Urinal",
         "Collects urine for male patients or selected immobile female patients who cannot access the toilet. The male urinal is a handheld bottle; female versions are angled or wedge-shaped.",
         "Position carefully to prevent spillage and assist the patient to hold if needed. Ensure adequate privacy.",
         "Empty promptly after use. Measure and document urine output if on fluid balance monitoring.",
         ["Name the instrument: urinal; collects urine from patients unable to access the toilet.", "Identify types: male bottle urinal; female slipper or wedge urinal for bed use.", "Preparation: bring clean urinal; assist patient with positioning and privacy.", "Safety: never leave a full urinal in the bed or on a surface where spillage can occur.", "Empty, rinse and dry after use; measure and document urine on fluid balance chart if required.", "Monitor urine colour, clarity and odour; report haematuria, dark urine or reduced output."],
         "Male bottle urinal (plastic or metal), female slipper urinal; single-use disposable or reusable"],
        ["Catheter",
         "A flexible tube inserted into the bladder to drain urine. Used for urinary retention, accurate output monitoring or when the patient cannot void independently.",
         "Obtain consent and confirm prescription. Prepare a sterile catheterisation pack and select the correct catheter size in French (Fr).",
         "Use strict aseptic technique throughout. Inflate the balloon only after urine flow confirms bladder placement. Maintain a closed drainage system.",
         ["Name the instrument: urinary catheter; drains urine from the bladder.", "Identify types: Foley indwelling (balloon-retained), straight in-out (single use), coude (angled tip for obstruction).", "Select correct size: 12–18 Fr for adults; smaller sizes for females and paediatric patients.", "Preparation: obtain consent, sterile pack, correct catheter size, sterile gloves and lubricant.", "Insertion: use strict aseptic technique; inflate balloon only after urine flow confirms bladder placement.", "Safety: maintain closed drainage system; document insertion date and time; monitor for CAUTI signs daily."],
         "Foley 2-way, Foley 3-way (for irrigation), straight in-out catheter; sizes 8–24 Fr; latex or silicone"],
        ["Suction machine",
         "Removes secretions from the airway, oral cavity or wound areas using negative pressure. Essential in airway management, post-operative care and emergency response.",
         "Check the machine before use: confirm pressure setting, verify the collection bottle is empty and check all tubing and catheter connections.",
         "Insert the suction catheter without applying suction. Apply suction only during withdrawal using a rotating motion. Limit each pass to 10–15 seconds.",
         ["Name the instrument: suction machine; removes secretions from airway or wound areas using negative pressure.", "State pressure settings: 80–150 mmHg adults; 60–100 mmHg children; 40–60 mmHg neonates.", "Check before use: vacuum pressure, collection bottle (empty and sealed), connecting tubing, suction catheter.", "Technique: pre-oxygenate; insert without suction applied; apply suction during withdrawal with rotation.", "Safety: limit each pass to 10–15 seconds; allow re-oxygenation between passes.", "Monitor for SpO2 drop, patient distress, haemorrhage or change in secretion character."],
         "Portable electric, wall-mounted, foot-operated (manual); Yankauer rigid or flexible suction catheter"],
        ["Oxygen cylinder",
         "Stores compressed medical-grade oxygen for therapeutic administration. Used for hypoxia, respiratory distress, resuscitation and peri-operative care.",
         "Check the cylinder gauge for adequate pressure before starting. Confirm the regulator is correctly fitted and set the flow meter to the prescribed rate in litres per minute.",
         "Keep away from flames, oil and grease. Secure cylinders upright to prevent them falling. Never adjust the flow rate without a prescription.",
         ["Name the instrument: medical oxygen cylinder; stores compressed oxygen for therapeutic use.", "Identify components: cylinder, valve, pressure gauge, regulator, flow meter and outlet port.", "Preparation: check gauge (above 200 PSI adequate), attach regulator, set flow rate per prescription.", "Typical flow rates: 1–4 L/min for nasal cannula; 10–15 L/min for non-rebreather mask.", "Safety: no flames, oil or smoking near the cylinder; secure upright; store away from heat.", "Monitor SpO2 during oxygen therapy; document start time, flow rate and patient response."],
         "F cylinder (common portable), E cylinder (small portable), J cylinder (large ward); piped wall oxygen also used"],
        ["Nasogastric tube",
         "A flexible tube passed through the nostril into the stomach for enteral feeding, medication delivery, gastric decompression or diagnostic aspiration.",
         "Measure from the nose to the ear to the xiphisternum to estimate insertion depth. Insert with the patient upright and ask them to swallow small sips of water as the tube passes.",
         "Always confirm placement before any use: aspirate stomach contents and test pH (must be 5.5 or below) or confirm on chest X-ray per facility policy. Never assume correct placement.",
         ["Name the instrument: nasogastric tube (NG tube); passes into stomach for feeding, medication or decompression.", "Measure insertion depth: nose tip to earlobe to xiphoid process gives approximate length.", "Preparation: patient sitting upright; lubricate tube; ask patient to swallow as tube advances.", "Confirmation before any use: aspirate and test pH, must be 5.5 or below for gastric placement.", "Safety: NEVER use without confirmed placement: misplaced NG tube entering the lung is life-threatening.", "Secure externally with tape; document insertion length, confirmation method, date and time."],
         "Fine-bore 8 Fr (for enteral feeding); wide-bore 14–18 Fr (decompression and aspiration); Ryle's tube"],
        ["Nebulizer",
         "Converts liquid medication into a fine aerosol mist that can be inhaled deep into the airways. Used for bronchodilators, corticosteroids and mucolytics.",
         "Measure the prescribed medication dose into the nebulizer cup and add normal saline to a total of 4–5 mL if required. Connect the mouthpiece or face mask and set the air or oxygen flow.",
         "Treatment usually takes 10–15 minutes. Monitor the patient throughout for bronchospasm response, SpO2 and improvement in breath sounds.",
         ["Name the instrument: nebulizer; converts liquid medication to aerosol mist for inhalation.", "Common medications nebulized: salbutamol (bronchodilator), ipratropium, budesonide, normal saline.", "Preparation: measure prescribed dose; top up to 4–5 mL with normal saline if required.", "Technique: fit mouthpiece (preferred over mask); hold upright; drive with 6–8 L/min airflow.", "Safety: monitor respiratory rate, SpO2 and breath sounds during and after treatment.", "After use: rinse cup, mouthpiece and mask with water; dry and store; replace filter per schedule."],
         "Jet nebulizer (air or oxygen driven), ultrasonic nebulizer; face mask or mouthpiece attachment"]
      ]
    },
    {
      title: "Airway And Breathing",
      body: "Equipment used to maintain a patent airway, support ventilation and deliver supplemental oxygen in emergency and acute care.",
      items: [
        ["Oropharyngeal airway",
         "A rigid curved device placed in the mouth to hold the tongue forward and maintain a clear airway in an unconscious patient. Also called the Guedel airway.",
         "Select the correct size by measuring from the patient's incisors to the angle of the jaw. In adults, insert with the curve upward, then rotate 180° as it passes the back of the mouth.",
         "Only use in patients who are fully unconscious without a gag reflex. Remove immediately if the patient begins to regain consciousness or vomit.",
         ["Name the instrument: oropharyngeal airway (OPA or Guedel airway); maintains patent airway in unconscious patients.", "Sizing: measure from corner of mouth or incisors to angle of jaw; sizes 0 (neonate) to 4 (large adult); colour-coded.", "Insertion technique (adult): curve pointing upward, insert, rotate 180° at soft palate, advance until flange rests on lips.", "Indication: unconscious patient with absent gag reflex only.", "Safety: confirmed absent gag reflex required; never use in a semi-conscious or conscious patient.", "Remove immediately if the patient gags, regains consciousness or vomits; have suction ready."],
         "Guedel sizes 0–4 (neonatal to large adult); colour-coded by size; rigid curved plastic"],
        ["Nasopharyngeal airway",
         "A soft flexible tube inserted through a nostril into the nasopharynx to maintain a clear airway. Better tolerated than an OPA in semi-conscious patients.",
         "Select the correct size by measuring from the nostril to the tragus of the ear. Lubricate well before insertion. Insert with the bevel facing the nasal septum.",
         "Use with caution when a base-of-skull fracture is suspected. Insert the safety pin through the flange before insertion to prevent migration into the airway.",
         ["Name the instrument: nasopharyngeal airway (NPA); maintains airway in semi-conscious or trismus patients.", "Sizing: measure from nostril to tragus of ear; sizes 6–9 mm internal diameter.", "Preparation: lubricate well with water-based lubricant; attach safety pin to flange.", "Insertion: bevel toward the nasal septum; insert perpendicular to face, then advance gently.", "Indication: preferred when OPA cannot be used, semi-conscious, jaw injury, dental trauma.", "Contraindication: suspected base-of-skull fracture; severe nasal injury; coagulopathy."],
         "Sizes 6–9 mm internal diameter; soft PVC; often colour-coded by size"],
        ["Bag-valve mask",
         "A manual resuscitator that delivers positive pressure ventilation when a patient cannot breathe adequately. Commonly called the Ambu bag.",
         "Create a proper mask seal using the EC-clamp technique with one hand. Squeeze the bag with the other hand to deliver a breath over one second.",
         "Use high-flow oxygen (10–15 L/min) connected to the reservoir bag to achieve high-concentration oxygen delivery. Two-person technique is always preferable.",
         ["Name the instrument: bag-valve-mask (BVM or Ambu bag); delivers positive pressure ventilation manually.", "Components: self-inflating bag, one-way valve, face mask, oxygen inlet port and reservoir bag.", "Two-person technique preferred: one maintains mask seal (EC-clamp), one squeezes the bag.", "EC-clamp grip: three fingers under mandible (E), thumb and index form a C on the mask to create seal.", "Ventilation rate: squeeze over 1 second; observe chest rise; 10–12 breaths per minute in adults.", "Safety: avoid over-ventilation and gastric inflation; use oxygen reservoir bag to maximise FiO2."],
         "Adult, child and infant sizes; reusable silicone or single-use; disposable face masks"],
        ["Oxygen mask",
         "Delivers supplemental oxygen to patients who require higher concentrations than nasal prongs can provide. Three types are used depending on the required FiO2.",
         "Select the correct mask type based on the required oxygen concentration. Fit snugly over nose and mouth and mould the metal nose clip to the patient's face.",
         "Non-rebreather masks require adequate oxygen flow to keep the reservoir bag inflated, do not allow flow to drop below 10 L/min.",
         ["Name the instrument: oxygen face mask; delivers supplemental oxygen at various concentrations.", "Types: simple face mask (35–55% FiO2 at 6–10 L/min), Venturi mask (precise 24–60%), non-rebreather (80–95% at 10–15 L/min).", "Preparation: confirm mask type; fit snugly; mould nose clip; connect to oxygen source.", "Venturi mask: use correct colour-coded adaptor for prescribed FiO2; adaptor states required flow rate.", "Safety: non-rebreather reservoir bag must stay inflated throughout, set minimum 10 L/min.", "Monitor SpO2, respiratory rate and patient comfort every 30–60 minutes during oxygen therapy."],
         "Simple face mask, Venturi (colour-coded adaptors), non-rebreather (NRB) with reservoir bag"],
        ["Nasal cannula",
         "Delivers low-flow supplemental oxygen through two short prongs placed in the nostrils. The most comfortable and widely used oxygen delivery device for stable patients.",
         "Insert both prongs into the nostrils with the curve pointing downward. Loop the tubing over each ear and adjust the slider under the chin.",
         "Each litre per minute increases FiO2 by approximately 4% above room air (21%). Humidify at flow rates above 4 L/min to prevent nasal drying.",
         ["Name the instrument: nasal cannula (nasal prongs); delivers low-flow supplemental oxygen.", "Flow rate and approximate FiO2: 1 L/min = 24%, 2 = 28%, 3 = 32%, 4 = 36%, 5 = 40%, 6 = 44%.", "Indication: stable patients needing mild supplemental oxygen who can breathe spontaneously.", "Preparation: insert prongs downward into nostrils; loop tubing behind ears; adjust chin slide.", "Safety: humidify at above 4 L/min to prevent nasal drying and discomfort; inspect nostrils daily for pressure injury.", "Limitation: effective only in nasal breathers; standard prongs maximum flow is 6 L/min."],
         "Standard adult, paediatric and neonatal sizes; high-flow nasal cannula (HFNC) for high-dependency settings"]
      ]
    }
  ];

  return categoryData.map((category) => ({
    ...category,
    items: category.items.map(([name, use, preparation, safety, examPoints, types]) => ({
      name,
      slug: slugify(name),
      use,
      preparation,
      safety,
      examPoints: examPoints || null,
      types: types || null,
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
  // All mapped to actual photos in assets/images/medical-instruments/ (always deployed)
  const MI = "/assets/images/medical-instruments/";
  return {
    // ── Airway / Breathing ─────────────────────────────────────────────
    "air-ring":                          [MI+"air-ring.jpg",                         "Air ring airway adjunct"],
    "oropharyngeal-airway":              [MI+"Air-way-piece.jpg",                    "Oropharyngeal airway"],
    "air-way-piece":                     [MI+"Air-way-piece.jpg",                    "Airway piece"],
    "ett":                               [MI+"ETT.jpg",                              "Endotracheal tube"],
    "tracheostomy-tube":                 [MI+"Tracheostomy tube.jpg",                "Tracheostomy tube"],
    "tracheal-dilator":                  [MI+"Tracheal dilator.jpg",                 "Tracheal dilator"],
    "nasopharyngeal-airway":             [MI+"Air-way-piece.jpg",                    "Nasopharyngeal airway"],
    "bag-valve-mask":                    [MI+"Air-way-piece.jpg",                    "Bag-valve-mask"],
    "laryngoscope":                      [MI+"Laryngoscope.jpg",                     "Laryngoscope"],
    "oxygen-mask":                       [MI+"Inhaler.jpg",                          "Oxygen mask"],
    "nasal-cannula":                     [MI+"Nasogastric tube.jpg",                 "Nasal cannula"],
    "oxygen-cylinder":                   [MI+"Inhaler.jpg",                          "Oxygen cylinder"],
    "suction-machine":                   [MI+"Manual suction machine.jpg",           "Suction machine"],
    "manual-suction-machine":            [MI+"Manual suction machine.jpg",           "Manual suction machine"],
    "mucus-extractor":                   [MI+"Mucus extractor.jpg",                  "Mucus extractor"],
    "nebulizer":                         [MI+"Nebulizer.jpg",                        "Nebulizer"],
    "peak-flow-meter":                   [MI+"Inhaler.jpg",                          "Peak flow meter"],
    "inhaler":                           [MI+"Inhaler.jpg",                          "Inhaler"],
    // ── Assessment ────────────────────────────────────────────────────
    "stethoscope":                       [MI+"stethoscope.jpg",                      "Stethoscope"],
    "blood-pressure-machine":            [MI+"stethoscope.jpg",                      "Blood pressure equipment"],
    "thermometer":                       [MI+"Probe.jpg",                            "Thermometer probe"],
    "pulse-oximeter":                    [MI+"Pulse oximeter.jpg",                   "Pulse oximeter"],
    "glucometer":                        [MI+"Glucometer.jpg",                       "Glucometer"],
    "percussion-hammer":                 [MI+"Patella-hammer.jpg",                   "Percussion hammer"],
    "patella-hammer":                    [MI+"Patella-hammer.jpg",                   "Patella hammer"],
    "penlight":                          [MI+"Penlight.jpg",                         "Penlight"],
    "auriscope":                         [MI+"Auriscope.jpg",                        "Auriscope"],
    "ophthalmoscope":                    [MI+"Ophthalmoscope.jpg",                   "Ophthalmoscope"],
    "tuning-fork":                       [MI+"Tuning-fork.jpg",                      "Tuning fork"],
    "snellen":                           [MI+"snellen.jpg",                          "Snellen chart"],
    "snellen-chart":                     [MI+"snellen.jpg",                          "Snellen chart"],
    "probe":                             [MI+"Probe.jpg",                            "Probe"],
    "urinometer":                        [MI+"Urinometer.jpg",                       "Urinometer"],
    "height-board":                      [MI+"Height board.jpg",                     "Height board"],
    "protoscope":                        [MI+"Protoscope.jpg",                       "Protoscope"],
    "endoscope":                         [MI+"Endoscope.jpg",                        "Endoscope"],
    // ── Injection / IV ────────────────────────────────────────────────
    "syringes":                          [MI+"vial.jpg",                             "Syringe and vial"],
    "needles":                           [MI+"vial.jpg",                             "Needles and vial"],
    "iv-cannula":                        [MI+"giving set.jpg",                       "IV cannula"],
    "giving-set":                        [MI+"giving set.jpg",                       "Giving set"],
    "tourniquet":                        [MI+"Cord-clamp.jpg",                       "Tourniquet"],
    "ampoule":                           [MI+"Ampoule.jpg",                          "Ampoule"],
    "vial":                              [MI+"vial.jpg",                             "Vial"],
    "nasogastric-tube":                  [MI+"Nasogastric tube.jpg",                 "Nasogastric tube"],
    // ── Wound / Sterile ────────────────────────────────────────────────
    "dressing-tray":                     [MI+"Trays.jpg",                            "Dressing tray"],
    "instrument-tray":                   [MI+"Trays.jpg",                            "Instrument tray"],
    "kidney-dish":                       [MI+"kidney-dish.jpg",                      "Kidney dish"],
    "drape":                             [MI+"Drape.jpg",                            "Surgical drape"],
    "sterile-packs":                     [MI+"Drape.jpg",                            "Sterile packs"],
    "specimen-bottles":                  [MI+"Specimen-bottles.jpg",                 "Specimen bottles"],
    "drums":                             [MI+"drums.jpg",                            "Sterilization drums"],
    "autoclave":                         [MI+"drums.jpg",                            "Autoclave / drums"],
    "blade-holder":                      [MI+"Blade holder.jpg",                     "Blade holder"],
    "suture-set":                        [MI+"Needle holder forceps.jpg",            "Suture set"],
    "aneurysm-needle":                   [MI+"Aneurysm needle.jpg",                  "Aneurysm needle"],
    // ── Forceps ────────────────────────────────────────────────────────
    "artery-forceps":                    [MI+"Curved-artery-forceps.jpg",            "Artery forceps"],
    "curved-artery-forceps":             [MI+"Curved-artery-forceps.jpg",            "Curved artery forceps"],
    "straight-artery-forceps":           [MI+"Straight-artery-forceps.jpg",          "Straight artery forceps"],
    "long-artery-forceps":               [MI+"Long-artery-forceps.jpg",              "Long artery forceps"],
    "mosquito-artery-forceps":           [MI+"Mosquito-artery-forceps.jpg",          "Mosquito forceps"],
    "dissecting-forceps":                [MI+"Dissecting forceps.jpg",               "Dissecting forceps"],
    "dressing-forceps":                  [MI+"Dressing forceps.jpg",                 "Dressing forceps"],
    "cheatle-forceps":                   [MI+"Cheatle-forceps.jpg",                  "Cheatle forceps"],
    "babcock-forceps":                   [MI+"Babcock forceps.jpg",                  "Babcock forceps"],
    "allis-tissue-forceps":              [MI+"Allis tissue forceps.jpg",             "Allis tissue forceps"],
    "kocher-forceps":                    [MI+"Kocher forceps.jpg",                   "Kocher forceps"],
    "crocodile-forceps":                 [MI+"Crocodile forceps.jpg",                "Crocodile forceps"],
    "right-angle-forceps":               [MI+"Right angle forceps.jpg",              "Right angle forceps"],
    "sinus-forceps":                     [MI+"Sinus forceps.jpg",                    "Sinus forceps"],
    "nasal-dressing-forceps":            [MI+"Nasal dressing forceps.jpg",           "Nasal dressing forceps"],
    "ovum-forceps":                      [MI+"Ovum-forceps.jpg",                     "Ovum forceps"],
    "sponge-holding-forceps":            [MI+"Sponge holding forceps.jpg",           "Sponge holding forceps"],
    "sterilization-forceps":             [MI+"Sterilization forceps.jpg",            "Sterilization forceps"],
    "tenaculum-forceps":                 [MI+"Tenaculum forceps.jpg",                "Tenaculum forceps"],
    "needle-holder-forceps":             [MI+"Needle holder forceps.jpg",            "Needle holder forceps"],
    "tonsil-holding-forceps":            [MI+"Tonsil holding forceps.jpg",           "Tonsil holding forceps"],
    "duval-intestinal-grasping-forceps": [MI+"Duval intestinal grasping forceps.jpg","Duval forceps"],
    "four-prong-retractor":              [MI+"Four prong retractor.jpg",             "Four prong retractor"],
    // ── Scissors ────────────────────────────────────────────────────────
    "bandage-scissors":                  [MI+"Cord scissor.jpg",                     "Scissors"],
    "cord-scissor":                      [MI+"Cord scissor.jpg",                     "Cord scissors"],
    "cord-scissors":                     [MI+"Cord scissor.jpg",                     "Cord scissors"],
    "episiotomy-scissors":               [MI+"Episiotomy-scissors.jpg",              "Episiotomy scissors"],
    "surgical-scissors":                 [MI+"Tonsil scissors.jpg",                  "Surgical scissors"],
    "tonsil-scissors":                   [MI+"Tonsil scissors.jpg",                  "Tonsil scissors"],
    "towel-clip":                        [MI+"Towel-clip.jpg",                       "Towel clip"],
    // ── Catheter / Urinary ────────────────────────────────────────────
    "catheter":                          [MI+"Foley catheter.jpg",                   "Foley catheter"],
    "foley-catheter":                    [MI+"Foley catheter.jpg",                   "Foley catheter"],
    "three-way-foley-catheter":          [MI+"Three way foley catheter.jpg",         "Three-way Foley catheter"],
    "metallic-catheter":                 [MI+"Metallic catheter.jpg",                "Metallic catheter"],
    "bladder-sound":                     [MI+"Bladder sound.jpg",                    "Bladder sound"],
    "colostomy-bag":                     [MI+"Colostomy bag.jpg",                    "Colostomy bag"],
    "penile-sheath":                     [MI+"Penile sheath.jpg",                    "Penile sheath"],
    // ── Patient Care ─────────────────────────────────────────────────
    "bedpan":                            [MI+"bed-pan.jpg",                          "Bedpan"],
    "bed-pan":                           [MI+"bed-pan.jpg",                          "Bedpan"],
    "urinal":                            [MI+"male-urinal.jpg",                      "Urinal"],
    "male-urinal":                       [MI+"male-urinal.jpg",                      "Male urinal"],
    "vomit-bowl":                        [MI+"Vomit bowl.jpg",                       "Vomit bowl"],
    "sputum-mug":                        [MI+"Sputum mug.jpg",                       "Sputum mug"],
    "hot-water-bottle":                  [MI+"Hot water bottle.jpg",                 "Hot water bottle"],
    "bulb-syringe":                      [MI+"Bulb syringe.jpg",                     "Bulb syringe"],
    "ear-syringe":                       [MI+"Ear-syringe.jpg",                      "Ear syringe"],
    "enema-can":                         [MI+"Enema can.jpg",                        "Enema can"],
    "calibrated-cup":                    [MI+"Calibrated-cup.jpg",                   "Calibrated cup"],
    "backrest":                          [MI+"Backrest.jpg",                         "Backrest"],
    "bed-cradle":                        [MI+"Bed-cradle.jpg",                       "Bed cradle"],
    "bed-block":                         [MI+"bed-block.jpg",                        "Bed block"],
    "trolley":                           [MI+"Trolley.jpg",                          "Trolley"],
    "trays":                             [MI+"Trays.jpg",                            "Trays"],
    "screens":                           [MI+"Screens.jpg",                          "Screens"],
    "bin":                               [MI+"bin.jpg",                              "Clinical bin"],
    "sandbag":                           [MI+"sandbag.jpg",                          "Sandbag"],
    "trapeze":                           [MI+"trapeze.jpg",                          "Trapeze bar"],
    "cardiac-table":                     [MI+"cardiac-table.jpg",                    "Cardiac table"],
    "medical-goggles":                   [MI+"Medical goggles.jpg",                  "Medical goggles"],
    "motor-and-pestle":                  [MI+"Motor and pestle.jpg",                 "Mortar and pestle"],
    "mouth-gag":                         [MI+"mouth-gag.jpg",                        "Mouth gag"],
    // ── Midwifery ────────────────────────────────────────────────────
    "fetoscope":                         [MI+"Fetal scope.jpg",                      "Fetoscope"],
    "fetal-scope":                       [MI+"Fetal scope.jpg",                      "Fetal scope"],
    "doppler-fetal-monitor":             [MI+"Fetal scope.jpg",                      "Doppler fetal monitor"],
    "amnihook":                          [MI+"Amnihook.jpg",                         "Amnihook"],
    "auvard-vaginal-spectrum":           [MI+"Auvard vaginal spectrum.jpg",          "Auvard vaginal spectrum"],
    "cusco-vaginal-spectrum":            [MI+"Cusco-vaginal-spectrum.jpg",           "Cusco vaginal speculum"],
    "vaginal-speculum":                  [MI+"Cusco-vaginal-spectrum.jpg",           "Vaginal speculum"],
    "sims":                              [MI+"sims.jpg",                             "Sim's speculum"],
    "sims-speculum":                     [MI+"sims.jpg",                             "Sim's speculum"],
    "cord-clamp":                        [MI+"Cord-clamp.jpg",                       "Cord clamp"],
    "delivery-set":                      [MI+"Wrigley forceps.jpg",                  "Delivery set"],
    "wrigley-forceps":                   [MI+"Wrigley forceps.jpg",                  "Wrigley forceps"],
    "cervical-dilator":                  [MI+"Cervical dilator.jpg",                 "Cervical dilator"],
    "uterine-sound":                     [MI+"Uterine sound.jpg",                    "Uterine sound"],
    "uterine-curette":                   [MI+"Uterine-curette.jpg",                  "Uterine curette"],
    "uterine-packing-forceps":           [MI+"Uterine packing forceps.jpg",          "Uterine packing forceps"],
    "vulsellum":                         [MI+"Vulsellum.jpg",                        "Vulsellum"],
    "mva":                               [MI+"MVA.jpg",                              "Manual vacuum aspirator"],
    // ── Dental ────────────────────────────────────────────────────────
    "dental-spatula":                    [MI+"Dental-spatula.jpg",                   "Dental spatula"],
    "dental-probe":                      [MI+"dental-probe.jpg",                     "Dental probe"],
    "tongue-depressor":                  [MI+"Tongue depressor.jpg",                 "Tongue depressor"],
    "teeth-extractor":                   [MI+"Teeth extractor.jpg",                  "Teeth extractor"],
    "root-elevator":                     [MI+"Root elevator.jpg",                    "Root elevator"],
    "cusco-s-vaginal-spectrum":          [MI+"Cusco-vaginal-spectrum.jpg",           "Cusco's vaginal speculum"],
    "lane-s-tissue-holding-forceps":     [MI+"Lane's tissue holding forceps.jpg",    "Lane's tissue holding forceps"],
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
      body: `A practical guide to ${instruments.length} nursing and midwifery instruments, uses, images and safe handling points.`,
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
        <h2>How To Revise Instruments For OSCEs</h2>
        <div class="guide-grid">
          <div>
            <h3>1. Name It Clearly</h3>
            <p>State the full instrument name and its category. In an OSCE, examiners expect the correct clinical term, not a description of the object.</p>
          </div>
          <div>
            <h3>2. State The Use</h3>
            <p>Explain exactly what the instrument measures, delivers or assists. Include the clinical context and why it is selected over alternatives.</p>
          </div>
          <div>
            <h3>3. Know Types And Sizes</h3>
            <p>Most instruments come in multiple sizes or types. Knowing which type applies to which patient or procedure shows examiner-level depth.</p>
          </div>
          <div>
            <h3>4. Prepare Before Use</h3>
            <p>State what you check before using the instrument: sterility, calibration, size selection, patient positioning and any accessories needed.</p>
          </div>
          <div>
            <h3>5. State The Safety Points</h3>
            <p>Cover sharps safety, infection control, contraindications and the risk of the specific instrument. Every instrument has at least one patient safety point.</p>
          </div>
          <div>
            <h3>6. Practise Out Loud</h3>
            <p>Run through each instrument verbally as if presenting at a station. Timed practice with a partner or recorder catches gaps that silent reading misses.</p>
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
                <span><strong>${instrument.types ? "Types / Sizes" : "Core skill"}</strong>${instrument.types ? escapeHtml(instrument.types) : "Identify, prepare, use safely"}</span>
                <span><strong>OSCE points</strong>${examPoints.length} specific exam points</span>
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
          <span class="eyebrow">404: Not Found</span>
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

  // ── Maintenance mode gate ────────────────────────────────────────────────
  // Admins always pass through; /login is also allowed so admin can sign in.
  if (state.maintenance?.mode && !isAdmin()) {
    if (window.location.pathname !== "/login") {
      renderMaintenancePage();
      return;
    }
  }

  // Clear exam mode attribute unless we're on an active mock exam page
  if (!state.mockExam.examId || state.mockExam.submitted) {
    app.removeAttribute("data-exam-mode");
  }
  const parts = currentRoute();
  let content = "";
  let meta = {
    title: "Nursing Uganda",
    description: "Nursing and midwifery revision for Uganda students, with notes, courses, resources and practical study support."
  };
  let structuredData = null;

  if (parts[0] === "admin") {
    // Admin page manages its own layout() call (needs to load data first)
    if (!isAdmin()) { setDocumentMeta("Access Denied", ""); layout(`<section class="section"><div class="container" style="text-align:center;padding:4rem 1rem">${icon("lock")}<h2 style="margin:.75rem 0">Admin access required.</h2><a class="button primary" href="/notes">Go Home</a></div></section>`); return; }
    // Load data then render
    Promise.all([adminLoadAnnouncements(), adminLoadTips(), adminLoadEvents(), adminLoadResources(), adminLoadUsers(), adminLoadAnalytics()]).then(() => renderAdminPage());
    // Render immediately with whatever data is already loaded
    renderAdminPage();
    return;
  }
  else if (parts[0] === "contact") {
    content = renderContactPage();
    meta = { title: "Contact Us", description: "Get in touch with Nursing Uganda: questions, corrections, partnerships or feedback." };
  }
  else if (parts[0] === "login") {
    content = renderLoginPage();
    meta = { title: state.loginTab === "signup" ? "Create Account" : "Sign In", description: "Sign in or create a free account on Nursing Uganda to track your progress and saved notes." };
  }
  else if (parts[0] === "account") {
    content = renderAccountPage();
    meta = { title: "My Account", description: "View your Nursing Uganda account, progress stats and saved items." };
  }
  else if (parts[0] === "progress") {
    content = renderProgress();
    meta = { title: "Study Dashboard", description: "Your personalised study dashboard: lessons done, quiz history, streak, activity heatmap and programme progress." };
  }
  else if (parts[0] === "mock-exams" && parts[1]) {
    const me = state.mockExam;
    const isActive = me.examId === parts[1] && me.questions.length && !me.submitted;
    content = renderMockExamPage(parts[1]);
    const examMeta = findMockExam(parts[1]);
    meta = { title: examMeta?.title || "Mock Exam", description: examMeta?.desc || "Timed nursing mock exam." };
    if (isActive) app.setAttribute("data-exam-mode", "");
    else app.removeAttribute("data-exam-mode");
  }
  else if (parts[0] === "mock-exams") {
    content = renderMockExamHub();
    meta = { title: "Mock Exams", description: "Timed full-paper mock examinations that mirror BNE standard. Get instant results and full question breakdowns." };
    app.removeAttribute("data-exam-mode");
  }
  else if (parts[0] === "clinical-tools") {
    content = renderClinicalToolsPage();
    meta = { title: "Clinical Tools", description: "Drug dose calculator, clinical procedure checklists and normal reference values for nursing and midwifery students in Uganda." };
  }
  else if (parts[0] === "planner") {
    content = renderPlanner();
    meta = { title: "Study Planner", description: "Plan your nursing revision week, schedule study sessions, and track what you have done." };
  }
  else if (parts[0] === "community" && parts[1]) {
    content = renderCommunityQuestion();
    meta = { title: (state.community.selectedQuestion?.title || "Question") + ", Community", description: "Nursing student Q&A. Read and contribute answers." };
    if (!state.community.selectedQuestion || state.community.selectedQuestion.id !== parts[1]) {
      communityLoadQuestion(parts[1]);
    }
  }
  else if (parts[0] === "community") {
    content = renderCommunity();
    meta = { title: "Community Q&A", description: "Ask questions and share knowledge with nursing students across Uganda." };
    if (!state.community.questions.length && !state.community.loading) communityLoadQuestions();
  }
  else if (parts[0] === "flashcards") {
    content = renderFlashcards();
    meta = { title: "Flashcards", description: "Study key nursing and medical terms with spaced repetition. Track mastery as you go." };
  }
  else if (parts[0] === "settings") {
    content = renderSettingsPage();
    meta = { title: "Profile & Settings", description: "Manage your study profile, daily reminder, and account settings on Nursing Uganda." };
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
    if (parts[1]) {
      const crpResource = careerResourceFromSlug(parts[1]);
      if (crpResource) {
        content = renderCareerResourcePage(parts[1]);
        meta = { title: `${crpResource.title} | Nursing Uganda`, description: crpResource.desc };
      } else {
        content = notFound();
        meta = { title: "Page Not Found", description: "" };
      }
    } else {
      content = renderCareers();
      meta = { title: "Careers", description: "Nursing and midwifery career pathways, UNMC licensing guides, CV templates and international opportunities for Uganda professionals." };
    }
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
    meta = { title: "Courses", description: "Browse all nursing and midwifery programmes, course units and lesson pages on Nursing Uganda." };
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
      else if (parts[3] === "quiz") {
        content = renderUnitQuizPage(programme, unit);
        meta = { title: `${lmsCourseTitle(programme, unit)}, Unit Quiz`, description: `Test your knowledge of ${lmsCourseTitle(programme, unit)} with a review quiz covering all lessons.` };
      } else if (parts[3] === "topic") {
        const topic = findTopic(unit, parts[4], parts[5]);
        if (parts[6] === "quiz") {
          content = topic ? renderLessonQuizPage(programme, unit, topic) : notFound();
          if (topic) meta = { title: `Quiz: ${lmsLessonTitle(programme, unit, topic)}`, description: `Test your knowledge of ${lmsLessonTitle(programme, unit, topic)}.` };
        } else {
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
        }
      } else if (parts[3]) {
        const topic = findTopicBySlug(programme, unit, parts[3]);
        if (parts[4] === "quiz") {
          content = topic ? renderLessonQuizPage(programme, unit, topic) : notFound();
          if (topic) meta = { title: `Quiz: ${lmsLessonTitle(programme, unit, topic)}`, description: `Test your knowledge of ${lmsLessonTitle(programme, unit, topic)}.` };
        } else {
          content = topic ? renderTopic(programme, unit, topic) : notFound();
          if (topic) {
            const lesson = lessonForTopic(programme, unit, topic);
            meta = {
              title: lmsLessonTitle(programme, unit, topic),
              description: lessonExcerptFor(programme, unit, topic, lesson, 155)
            };
          }
        }
      } else {
        content = renderUnit(programme, unit);
        meta = { title: lmsCourseTitle(programme, unit), description: `${lmsCourseTitle(programme, unit)} modules, lessons and progress for ${programme.label}.` };
      }
    }
  } else {
    // Unknown route: show branded 404 instead of silently rendering /notes
    setDocumentMeta("404 – Page Not Found", "The page you requested does not exist on Nursing Uganda.");
    render404Page();
    return;
  }

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

  app.querySelectorAll("[data-search-clear-home]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.globalSearch = "";
      render();
      const nextSearch = app.querySelector("[data-global-search]");
      if (nextSearch) nextSearch.focus();
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
      const savedY = window.scrollY;
      setQuizAnswer(button.dataset.quizKey, button.dataset.quizQuestion, button.dataset.quizAnswer);
      render();
      const target = app.querySelector("#topic-quiz");
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
      else window.scrollTo(0, savedY); // preserve position on standalone quiz pages
    });
  });


  app.querySelectorAll("[data-reset-quiz]").forEach((button) => {
    button.addEventListener("click", () => {
      resetQuiz(button.dataset.resetQuiz);
      render();
      const target = app.querySelector("#topic-quiz");
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
      else window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  app.querySelectorAll("[data-submit-quiz]").forEach((button) => {
    button.addEventListener("click", () => {
      requireLogin("quiz", "Sign in to submit your quiz and receive your results by email.", () => {
        const key      = button.dataset.submitQuiz;
        const total    = parseInt(button.dataset.submitTotal || "0", 10);
        const answered = parseInt(button.dataset.submitAnswered || "0", 10);
        const missing  = total - answered;
        if (missing > 0) {
          const ok = window.confirm(
            `You have ${missing} unanswered question${missing !== 1 ? "s" : ""}.\n\n` +
            `Unanswered questions will be marked as incorrect.\n\nSubmit anyway?`
          );
          if (!ok) return;
        }
        saveQuizResult(key);    // save scored result before render clears context
        recordStudyDate();
        submitQuiz(key);
        pushQuizScoreToLeaderboard(key); // push to weekly leaderboard (non-blocking)
        state.leaderboard = null; // reset so leaderboard refreshes next visit
        render();
        window.scrollTo({ top: 0, behavior: "smooth" });
        // Send results email (non-blocking): only auto-send for logged-in users
        if (state.currentUser?.email) {
          sendQuizResultsEmail(key).then((result) => {
            if (result?.ok) {
              showToast(`Results emailed to ${state.currentUser.email}`, "success");
            } else if (result?.mailto) {
              // Edge function unavailable: nudge user to the manual button
              setTimeout(() => showToast("Auto-email unavailable. Use the 'Email Results' button to send results.", "info"), 1000);
            } else {
              console.info("[quiz] Email auto-send skipped (no quiz context or not logged in).");
            }
          }).catch((err) => {
            console.error("[quiz] sendQuizResultsEmail threw:", err instanceof Error ? err.message : String(err));
          });
        }
        // Gently prompt for study reminders if not yet enabled
        const ns = getNotifSettings();
        if (!ns.reminderEnabled && "Notification" in window && Notification.permission === "default") {
          setTimeout(() => showReminderNudge(), 1500);
        }
      });
    });
  });

  app.querySelectorAll("[data-bookmark-key]").forEach((button) => {
    button.addEventListener("click", () => {
      requireLogin("bookmark", "Sign in to save bookmarks and access them from any device.", () => {
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
  });

  app.querySelectorAll("[data-print-topic]").forEach((button) => {
    button.addEventListener("click", () => {
      requireLogin("pdf", "Sign in to save notes as a PDF for offline study.", () => window.print());
    });
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

  // ── Hero slideshow ──────────────────────────────────────────────────────────
  app.querySelectorAll("[data-career-slide]").forEach((dot) => {
    dot.addEventListener("click", () => {
      state.careerHeroSlide = parseInt(dot.dataset.careerSlide, 10);
      render();
    });
  });
  // Auto-advance: only start if the section exists (i.e. we're on /careers)
  if (app.querySelector("#careers-hero-section")) {
    clearTimeout(window._careerSlideTimer);
    window._careerSlideTimer = setTimeout(function advSlide() {
      state.careerHeroSlide = ((state.careerHeroSlide || 0) + 1) % CAREER_HERO_SLIDES.length;
      render();
    }, 5000);
  }

  // ── Mock Exam event wiring ────────────────────────────────────────────────
  app.querySelectorAll("[data-start-mock]").forEach(btn => {
    btn.addEventListener("click", () => {
      requireLogin("mock-exam", "Sign in to take mock exams and save your results.", () => {
        startMockExam(btn.dataset.startMock);
      });
    });
  });

  app.querySelector("[data-me-prev]")?.addEventListener("click", () => {
    mockExamGoto(state.mockExam.currentQ - 1); render();
  });
  app.querySelector("[data-me-next]")?.addEventListener("click", () => {
    mockExamGoto(state.mockExam.currentQ + 1); render();
  });

  app.querySelectorAll("[data-me-answer]").forEach(input => {
    input.addEventListener("change", () => {
      mockExamSetAnswer(parseInt(input.dataset.meAnswer, 10), parseInt(input.dataset.meValue, 10));
      // Auto-advance to next question after a short delay
      const next = state.mockExam.currentQ + 1;
      if (next < state.mockExam.questions.length) {
        setTimeout(() => { mockExamGoto(next); render(); }, 300);
      }
    });
  });


  app.querySelector("[data-me-palette]")?.addEventListener("click", () => {
    state.mockExam.paletteOpen = !state.mockExam.paletteOpen; render();
  });
  app.querySelectorAll("[data-me-palette-close]").forEach(el => {
    el.addEventListener("click", (e) => {
      if (e.target === el || el.tagName === "BUTTON") { state.mockExam.paletteOpen = false; render(); }
    });
  });
  app.querySelectorAll("[data-me-goto]").forEach(btn => {
    btn.addEventListener("click", () => { mockExamGoto(parseInt(btn.dataset.meGoto, 10)); render(); });
  });

  app.querySelector("[data-me-submit]")?.addEventListener("click", () => {
    const { answers, questions } = state.mockExam;
    const unanswered = questions.length - Object.keys(answers).length;
    const msg = unanswered > 0
      ? `You have ${unanswered} unanswered question${unanswered !== 1 ? "s" : ""}. Unanswered questions are marked incorrect.\n\nSubmit now?`
      : "Submit the exam now?";
    if (window.confirm(msg)) submitMockExam();
  });

  // ── Clinical Tools event wiring ───────────────────────────────────────────
  app.querySelectorAll("[data-ct-tab]").forEach(btn => {
    btn.addEventListener("click", () => {
      state.clinicalTools.tab = btn.dataset.ctTab;
      render();
    });
  });

  app.querySelectorAll("[data-calc-type]").forEach(btn => {
    btn.addEventListener("click", () => {
      state.clinicalTools.calcType = btn.dataset.calcType;
      render();
    });
  });

  const ctCalcForm = app.querySelector("#ct-calc-form");
  if (ctCalcForm) ctCalcForm.addEventListener("input", () => updateCalcResult());

  app.querySelector("[data-calc-clear]")?.addEventListener("click", () => {
    const form = app.querySelector("#ct-calc-form");
    if (form) { form.reset(); updateCalcResult(); }
  });

  app.querySelectorAll("[data-cl-open]").forEach(btn => {
    btn.addEventListener("click", () => {
      state.clinicalTools.checklistId = btn.dataset.clOpen;
      render();
    });
  });

  app.querySelectorAll("[data-cl-back]").forEach(btn => {
    btn.addEventListener("click", () => {
      state.clinicalTools.checklistId = "";
      render();
    });
  });

  app.querySelectorAll("[data-cl-step]").forEach(cb => {
    cb.addEventListener("change", () => {
      const id    = cb.dataset.clStep;
      const index = parseInt(cb.dataset.clStepIndex, 10);
      setChecklistStep(id, index, cb.checked);
      // Live DOM update: avoid full re-render on every tick
      const stepLabel = cb.closest(".ct-cl-step");
      if (stepLabel) stepLabel.classList.toggle("checked", cb.checked);
      const cl = CLINICAL_CHECKLISTS.find(c => c.id === id);
      if (cl) {
        const progress = getChecklistProgress(id);
        const done     = Object.keys(progress).length;
        const total    = cl.steps.length;
        const pct      = total ? Math.round((done / total) * 100) : 0;
        const fillEl   = app.querySelector(".ct-cl-progress-fill");
        const lblEl    = app.querySelector(".ct-cl-progress-label");
        if (fillEl) { fillEl.style.width = pct + "%"; fillEl.classList.toggle("complete", done === total && total > 0); }
        if (lblEl)  { lblEl.textContent = done + " / " + total + " steps" + (done === total && total > 0 ? ". Complete!" : ""); }
      }
    });
  });

  app.querySelectorAll("[data-cl-reset]").forEach(btn => {
    btn.addEventListener("click", () => {
      if (window.confirm("Reset all steps on this checklist?")) {
        resetChecklist(btn.dataset.clReset);
        render();
      }
    });
  });

  app.querySelectorAll("[data-nv-tab]").forEach(btn => {
    btn.addEventListener("click", () => {
      state.clinicalTools.valuesTab = btn.dataset.nvTab;
      render();
    });
  });

  // ── Notification bell ────────────────────────────────────────────────────
  app.querySelector("[data-bell-toggle]")?.addEventListener("click", (e) => {
    e.stopPropagation();
    state.bellOpen = !state.bellOpen;
    if (state.bellOpen) markAllAnnouncementsRead();
    render();
  });
  app.querySelector("[data-bell-mark-read]")?.addEventListener("click", () => {
    markAllAnnouncementsRead();
    state.bellOpen = false;
    render();
  });
  // Close bell when clicking outside
  document.addEventListener("click", function closeBell(e) {
    if (state.bellOpen && !e.target.closest(".bell-wrap")) {
      state.bellOpen = false;
      render();
    }
  }, { once: true });

  // ── Study Planner event wiring ────────────────────────────────────────────
  app.querySelectorAll("[data-planner-week]").forEach(btn => {
    btn.addEventListener("click", () => {
      state.planner.weekOffset += parseInt(btn.dataset.plannerWeek, 10);
      render();
    });
  });
  app.querySelectorAll("[data-planner-day]").forEach(btn => {
    btn.addEventListener("click", () => {
      state.planner.selectedDay   = btn.dataset.plannerDay;
      state.planner.addFormOpen   = false;
      render();
    });
  });
  app.querySelector("[data-planner-open-add]")?.addEventListener("click", () => {
    state.planner.addFormOpen = true;
    render();
    app.querySelector("[data-planner-field='title']")?.focus();
  });
  app.querySelector("[data-planner-cancel-add]")?.addEventListener("click", () => {
    state.planner.addFormOpen = false;
    render();
  });
  app.querySelectorAll("[data-planner-field]").forEach(el => {
    el.addEventListener("input", () => {
      state.planner.addForm[el.dataset.plannerField] = el.value;
    });
    el.addEventListener("change", () => {
      state.planner.addForm[el.dataset.plannerField] = el.value;
    });
  });
  app.querySelector("[data-planner-add-form]")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const today     = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay() + 1 + state.planner.weekOffset * 7);
    const selDay    = state.planner.selectedDay;
    const title     = state.planner.addForm.title.trim();
    if (!title) { showToast("Please enter what you are studying.", "error"); return; }
    addPlannerSession(selDay, {
      title, type: state.planner.addForm.type, notes: state.planner.addForm.notes.trim()
    });
    state.planner.addFormOpen = false;
    state.planner.addForm     = { title: "", type: "revision", notes: "" };
    render();
  });
  app.querySelectorAll("[data-planner-toggle]").forEach(btn => {
    btn.addEventListener("click", () => {
      togglePlannerSession(btn.dataset.plannerToggle, btn.dataset.plannerSessionId);
      render();
    });
  });
  app.querySelectorAll("[data-planner-remove]").forEach(btn => {
    btn.addEventListener("click", () => {
      removePlannerSession(btn.dataset.plannerRemove, btn.dataset.plannerSessionId);
      render();
    });
  });

  // ── Community Q&A event wiring ────────────────────────────────────────────
  app.querySelectorAll("[data-comm-filter]").forEach(btn => {
    btn.addEventListener("click", () => {
      state.community.filter = btn.dataset.commFilter;
      render();
    });
  });
  const commSearch = app.querySelector("[data-comm-search]");
  if (commSearch) {
    commSearch.addEventListener("input", () => {
      state.community.search = commSearch.value;
      render();
      app.querySelector("[data-comm-search]")?.focus();
    });
  }
  app.querySelector("[data-comm-ask]")?.addEventListener("click", () => {
    requireLogin("community", "Sign in to ask questions in the Community Q&A.", () => {
      state.community.askFormOpen = !state.community.askFormOpen;
      render();
    });
  });
  app.querySelector("[data-comm-cancel-ask]")?.addEventListener("click", () => {
    state.community.askFormOpen = false;
    render();
  });
  app.querySelectorAll("[data-comm-field]").forEach(el => {
    el.addEventListener("input", () => {
      state.community[el.dataset.commField] = el.value;
    });
  });
  app.querySelector("[data-comm-post-question]")?.addEventListener("click", () => {
    communityPostQuestion();
  });
  app.querySelectorAll("[data-comm-post-answer]").forEach(btn => {
    btn.addEventListener("click", () => {
      communityPostAnswer(btn.dataset.commPostAnswer);
    });
  });
  app.querySelectorAll("[data-comm-upvote]").forEach(btn => {
    btn.addEventListener("click", () => {
      communityUpvote(btn.dataset.commUpvote, btn.dataset.commUpvoteId);
    });
  });

  // Add "community" to the login prompt feature icon map (dynamic; done via featureIconMap in renderLoginPromptModal)

  // Legacy checklist downloads (careers main page)
  app.querySelectorAll("[data-career-download]").forEach((button) => {
    button.addEventListener("click", () => downloadCareerChecklist(button.dataset.careerDownload));
  });

  // Template card PDF/DOC downloads (login required)
  app.querySelectorAll("[data-template-label]").forEach(btn => {
    btn.addEventListener("click", () => {
      requireLogin("template", "Sign in to download CV and cover letter templates.", () => {
        const label  = btn.dataset.templateLabel;
        const action = btn.dataset.templateAction;
        const card   = btn.closest(".crp-card");
        const styleInput = card?.querySelector("input[type='radio']:checked");
        const styleId = styleInput?.value || "modern";
        if (action === "pdf") downloadTemplatePDF(label, styleId);
        else downloadTemplateDoc(label, styleId);
      });
    });
  });

  // Open CV Generator (login required)
  app.querySelectorAll("[data-open-cv-gen]").forEach(btn => {
    btn.addEventListener("click", () => {
      requireLogin("cv", "Sign in to use the CV Generator and build your personalised CV.", () => openCVGenerator());
    });
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

  // ── Login tab switching ──────────────────────────────────────────
  app.querySelectorAll("[data-login-tab]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.loginTab = btn.dataset.loginTab || "signin";
      state.loginError = "";
      render();
      const firstInput = app.querySelector(".login-form input");
      if (firstInput) firstInput.focus();
    });
  });

  // ── Password visibility toggle ───────────────────────────────────
  const pwToggle = app.querySelector("[data-pw-toggle]");
  if (pwToggle) {
    pwToggle.addEventListener("click", () => {
      const pwInput = app.querySelector("#auth-password");
      if (!pwInput) return;
      const isHidden = pwInput.type === "password";
      pwInput.type = isHidden ? "text" : "password";
      pwToggle.innerHTML = icon(isHidden ? "eyeOff" : "eye");
    });
  }

  // ── Auth form submit ─────────────────────────────────────────────
  const authForm = app.querySelector("[data-auth-form]");
  if (authForm) {
    authForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formType = authForm.dataset.authForm;
      const emailEl    = authForm.querySelector("#auth-email");
      const passwordEl = authForm.querySelector("#auth-password");
      const nameEl     = authForm.querySelector("#auth-name");
      const email    = emailEl    ? emailEl.value    : "";
      const password = passwordEl ? passwordEl.value : "";
      const name     = nameEl     ? nameEl.value     : "";

      // Show loading state on the submit button
      const submitBtn = authForm.querySelector(".login-submit");
      if (submitBtn) { submitBtn.disabled = true; submitBtn.style.opacity = "0.7"; }

      let result;
      try {
        result = formType === "signup"
          ? await authRegister(name, email, password)
          : await authLogin(email, password);
      } catch (err) {
        result = { ok: false, error: "Something went wrong. Please try again." };
      } finally {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.style.opacity = ""; }
      }

      if (!result.ok) {
        state.loginError = result.error;
        render();
        const firstInput = app.querySelector(".login-form input");
        if (firstInput) firstInput.focus();
        return;
      }

      // Email confirmation required: show the "check your email" screen
      if (result.emailConfirmationRequired) {
        render();
        return;
      }

      // Success: redirect to intended page or /notes
      const intended = state.loginIntended && state.loginIntended !== "/login" ? state.loginIntended : "/notes";
      state.loginIntended = "";
      setRoute(intended);
      showToast(`Welcome${formType === "signup" ? "" : " back"}, ${escapeHtml(state.currentUser?.name?.split(" ")[0] || "")}!`, "success");
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
  scheduleProgressSync();
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
  const best = Math.max(count, streak.best || 0);
  const updated = { count, lastDate: today, best };
  localStorage.setItem("nursinguganda.streak", JSON.stringify(updated));
  return updated;
}

function streakChip() {
  const streak = updateStreak();
  if (streak.count < 2) return "";
  const label = `${streak.count} day streak`;
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
          body: `Reminders on! You're on a ${getStreak().count}-day streak, keep it going!`,
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
        banner.innerHTML = `${icon("wifi")}<span>You\'re offline: showing cached content</span>`;
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

/* ── Popups ────────────────────────────────────────────────────────── */

const STUDY_TIPS = [
  { tip: "Use the SQ3R method: Survey, Question, Read, Recite, Review. It boosts retention by up to 60%.", tag: "Study Skills" },
  { tip: "Review notes within 24 hours of a lecture. The Ebbinghaus curve shows you forget 70% within a day without review.", tag: "Memory" },
  { tip: "Spaced repetition beats cramming every time. Use the Flashcards section daily for 10 minutes.", tag: "Flashcards" },
  { tip: "When studying anatomy, draw the structure from memory before checking your notes.", tag: "Anatomy" },
  { tip: "The ABCs of nursing assessment: Airway, Breathing, Circulation, always prioritise in that order.", tag: "Clinical" },
  { tip: "Link pharmacology to pathophysiology. Understanding why a drug works helps you remember it far longer.", tag: "Pharmacology" },
  { tip: "Practice SBAR communication: Situation, Background, Assessment, Recommendation for clinical handovers.", tag: "Communication" },
  { tip: "Sleep consolidates memory. A 6–8 hour sleep the night before an exam is more valuable than an all-nighter.", tag: "Wellbeing" },
  { tip: "Use mnemonics for lab values, e.g. ROME for acid-base: Respiratory Opposite, Metabolic Equal.", tag: "Labs" },
  { tip: "Normal adult pulse: 60–100 bpm. Normal respirations: 12–20/min. Normal BP: 90–120/60–80 mmHg.", tag: "Vitals" },
  { tip: "OLDCART helps you take a complete pain history: Onset, Location, Duration, Character, Aggravating, Relieving, Treatment.", tag: "Assessment" },
  { tip: "For IV fluid calculations: Volume (mL) ÷ Time (hours) = mL/hour. Master this formula early.", tag: "Calculations" },
  { tip: "The five rights of medication administration: Right patient, Drug, Dose, Route, Time. Check every single time.", tag: "Safety" },
  { tip: "Teach-back is the gold standard for patient education. Ask 'Can you show me how you'd do this at home?'", tag: "Education" },
  { tip: "Read at least one nursing journal article each week. PubMed and CINAHL are great free-access resources.", tag: "Research" },
];

const QUICK_QUIZZES = [
  // ── Vitals & Assessment ──────────────────────────────────────────────
  { q: "A normal adult respiratory rate is:", options: ["8–12/min", "12–20/min", "20–30/min", "30–40/min"], answer: 1 },
  { q: "Normal fasting blood glucose range in adults is:", options: ["2–4 mmol/L", "4–7 mmol/L", "7–10 mmol/L", "10–14 mmol/L"], answer: 1 },
  { q: "A patient with a SpO₂ of 88% should receive oxygen targeting:", options: ["88–90%", "94–98%", "100%", "No oxygen needed"], answer: 1 },
  { q: "Normal adult heart rate range is:", options: ["40–60 bpm", "60–100 bpm", "100–120 bpm", "120–140 bpm"], answer: 1 },
  { q: "Normal systolic blood pressure in a healthy adult is:", options: ["Less than 90 mmHg", "90–119 mmHg", "120–139 mmHg", "140 mmHg or above"], answer: 1 },
  { q: "Normal oral temperature in an adult is approximately:", options: ["35.0 °C", "36.0–37.5 °C", "38.0–38.5 °C", "39.0 °C"], answer: 1 },
  { q: "OLDCART is a mnemonic used to assess:", options: ["Level of consciousness", "Pain history", "Wound healing", "Respiratory status"], answer: 1 },
  // ── Emergency & Primary Survey ───────────────────────────────────────
  { q: "The first priority in the primary survey (ABCDE) is:", options: ["Breathing", "Circulation", "Airway", "Disability"], answer: 2 },
  { q: "Which position is safest for an unconscious but breathing patient?", options: ["Supine", "Prone", "Recovery (lateral) position", "Trendelenburg"], answer: 2 },
  { q: "The correct compression-to-ventilation ratio in adult CPR (1 rescuer) is:", options: ["15:2", "30:2", "5:1", "20:2"], answer: 1 },
  { q: "First-line treatment for anaphylaxis is:", options: ["IV hydrocortisone", "IV antihistamine", "IM adrenaline (epinephrine)", "Oral prednisolone"], answer: 2 },
  { q: "In shock, the earliest compensatory sign is:", options: ["Hypotension", "Tachycardia", "Bradycardia", "Cyanosis"], answer: 1 },
  // ── Pharmacology ─────────────────────────────────────────────────────
  { q: "Which electrolyte imbalance causes 'Chvostek's sign'?", options: ["Hypokalemia", "Hypernatremia", "Hypocalcemia", "Hypomagnesemia"], answer: 2 },
  { q: "The antidote for heparin overdose is:", options: ["Vitamin K", "Protamine sulfate", "Naloxone", "Flumazenil"], answer: 1 },
  { q: "Gentamicin is an example of which antibiotic class?", options: ["Penicillin", "Cephalosporin", "Aminoglycoside", "Macrolide"], answer: 2 },
  { q: "The antidote for paracetamol (acetaminophen) overdose is:", options: ["Activated charcoal", "N-acetylcysteine (NAC)", "Naloxone", "Flumazenil"], answer: 1 },
  { q: "Which drug class does Metformin belong to?", options: ["Sulphonylurea", "Insulin sensitiser (biguanide)", "DPP-4 inhibitor", "Alpha-glucosidase inhibitor"], answer: 1 },
  { q: "Furosemide is classified as which type of diuretic?", options: ["Potassium-sparing", "Thiazide", "Loop diuretic", "Osmotic"], answer: 2 },
  { q: "A patient on warfarin has a supratherapeutic INR. The reversal agent is:", options: ["Protamine sulfate", "Vitamin K", "Fresh frozen plasma only", "Heparin"], answer: 1 },
  { q: "Which opioid side effect requires immediate nursing intervention?", options: ["Constipation", "Nausea", "Respiratory depression", "Dry mouth"], answer: 2 },
  // ── Maternal & Child Health ──────────────────────────────────────────
  { q: "APGAR score is assessed at which time points after birth?", options: ["1 min only", "1 and 5 minutes", "5 and 10 minutes", "3 and 7 minutes"], answer: 1 },
  { q: "A partograph is used to monitor:", options: ["Fetal heart rate only", "Progress of labour", "Maternal blood pressure", "Neonatal weight"], answer: 1 },
  { q: "The classic triad of pre-eclampsia includes hypertension, proteinuria, and:", options: ["Anaemia", "Headache", "Oedema", "Convulsions"], answer: 2 },
  { q: "Exclusive breastfeeding is recommended for the first:", options: ["3 months", "6 months", "9 months", "12 months"], answer: 1 },
  { q: "Kangaroo Mother Care is primarily used for:", options: ["Babies with jaundice", "Low birth weight / preterm infants", "Babies with respiratory distress", "Post-operative neonates"], answer: 1 },
  { q: "Normal duration of the second stage of labour (primigravida) is up to:", options: ["30 minutes", "1 hour", "2 hours", "3 hours"], answer: 2 },
  // ── Fluids, Electrolytes & IV Therapy ───────────────────────────────
  { q: "Which fluid is isotonic and most commonly used in Uganda?", options: ["5% Dextrose", "Normal Saline (0.9%)", "Ringer's Lactate", "0.45% Saline"], answer: 1 },
  { q: "Ringer's Lactate is classified as:", options: ["Hypertonic", "Hypotonic", "Isotonic", "Colloid"], answer: 2 },
  { q: "A patient is to receive 1 litre of Normal Saline over 8 hours. The drip rate (20 drops/mL set) is:", options: ["21 drops/min", "42 drops/min", "14 drops/min", "28 drops/min"], answer: 1 },
  { q: "Hyponatraemia is defined as a serum sodium below:", options: ["145 mmol/L", "135 mmol/L", "125 mmol/L", "115 mmol/L"], answer: 1 },
  // ── Infection Prevention & Control ──────────────────────────────────
  { q: "The single most effective infection prevention practice is:", options: ["Wearing gloves", "Hand hygiene", "Wearing a mask", "Gowning"], answer: 1 },
  { q: "Standard precautions apply to:", options: ["Blood only", "All body fluids except sweat", "Known infectious patients only", "HIV-positive patients only"], answer: 1 },
  { q: "The correct order for donning PPE is:", options: ["Gloves → gown → mask → goggles", "Gown → mask → goggles → gloves", "Mask → goggles → gown → gloves", "Goggles → mask → gloves → gown"], answer: 1 },
  { q: "High-level disinfection destroys all microorganisms except:", options: ["Bacteria", "Viruses", "Fungi", "Some bacterial spores"], answer: 3 },
  // ── Medical–Surgical Nursing ─────────────────────────────────────────
  { q: "A stage 2 pressure ulcer involves:", options: ["Intact skin with redness", "Partial thickness skin loss", "Full thickness skin loss", "Exposed bone or tendon"], answer: 1 },
  { q: "The most common early symptom of a myocardial infarction is:", options: ["Jaw pain", "Crushing central chest pain", "Left arm numbness only", "Shortness of breath only"], answer: 1 },
  { q: "McBurney's point tenderness is associated with:", options: ["Peptic ulcer", "Appendicitis", "Cholecystitis", "Pancreatitis"], answer: 1 },
  { q: "A urinary catheter size is measured in:", options: ["Millimetres", "French (Fr) gauge", "Inches", "American Wire Gauge"], answer: 1 },
  // ── Community & Public Health ────────────────────────────────────────
  { q: "The Uganda immunisation schedule gives BCG vaccine at:", options: ["6 weeks", "Birth", "10 weeks", "14 weeks"], answer: 1 },
  { q: "Oral Rehydration Solution (ORS) is prepared with 1 litre of water plus:", options: ["6 tsp sugar + 1 tsp salt", "1 tsp sugar + 6 tsp salt", "8 tsp sugar + 1 tsp salt", "4 tsp sugar + 2 tsp salt"], answer: 0 },
  { q: "Malaria is transmitted by:", options: ["Culex mosquito (male)", "Anopheles mosquito (female)", "Aedes mosquito (female)", "Any mosquito bite"], answer: 1 },
  // ── Nutrition ────────────────────────────────────────────────────────
  { q: "Kwashiorkor is primarily caused by deficiency of:", options: ["Total calories", "Protein", "Vitamin A", "Iron"], answer: 1 },
  { q: "Normal adult BMI range is:", options: ["15–18.4", "18.5–24.9", "25–29.9", "30–34.9"], answer: 1 },
  { q: "Vitamin C deficiency causes:", options: ["Rickets", "Pellagra", "Scurvy", "Beriberi"], answer: 2 },
  { q: "The best dietary source of iron for a patient with anaemia is:", options: ["Maize porridge", "Red meat and leafy green vegetables", "Milk and dairy products", "Cassava and sweet potato"], answer: 1 },
  // ── Mental Health ─────────────────────────────────────────────────────
  { q: "Therapeutic communication prioritises:", options: ["Giving advice quickly", "Active listening and empathy", "Completing documentation first", "Referring immediately"], answer: 1 },
  { q: "A patient expresses suicidal ideation. The first nursing action is:", options: ["Document and inform the next shift", "Ask directly about a plan and means", "Leave the patient to calm down", "Administer sedation"], answer: 1 },
];

function initPopups() {
  const now = Date.now();

  // ── 1. Welcome / Onboarding popup ─────────────────────────────────
  (function welcomePopup() {
    const KEY = "nursinguganda.welcomeSeen";
    const INTERVAL = 30 * 24 * 60 * 60 * 1000; // 30 days
    const last = parseInt(localStorage.getItem(KEY) || "0", 10);
    if (now - last < INTERVAL) return;

    setTimeout(() => {
      if (document.getElementById("nu-popup-welcome")) return;
      const el = document.createElement("div");
      el.id = "nu-popup-welcome";
      el.className = "nu-popup-overlay";
      el.innerHTML = `
        <div class="nu-popup-modal nu-popup-welcome" role="dialog" aria-modal="true" aria-labelledby="nu-welcome-title">
          <button class="nu-popup-close" aria-label="Close">${icon("x")}</button>
          <div class="nu-popup-welcome-icon">${icon("gift")}</div>
          <h2 id="nu-welcome-title">Welcome to Nursing Uganda</h2>
          <p class="nu-popup-sub">Your complete revision companion for nursing &amp; midwifery students.</p>
          <ul class="nu-popup-feature-list">
            <li>${icon("bookOpen")}<span><strong>Study Notes</strong>: structured notes for every unit</span></li>
            <li>${icon("sparkles")}<span><strong>Flashcards</strong>: spaced-repetition revision</span></li>
            <li>${icon("search")}<span><strong>Dictionary</strong>: 500+ medical terms</span></li>
            <li>${icon("chartBar")}<span><strong>Progress</strong>: track your learning</span></li>
          </ul>
          <div class="nu-popup-email-capture">
            <p class="nu-popup-email-label">${icon("mail")} Get weekly revision tips: free</p>
            <form class="nu-popup-email-form" novalidate>
              <input type="email" class="nu-popup-email-input" placeholder="your@email.com" autocomplete="email" required>
              <button type="submit" class="button primary nu-popup-email-btn">Subscribe</button>
            </form>
            <p class="nu-popup-email-note">No spam, unsubscribe any time.</p>
          </div>
          <div class="nu-popup-actions">
            <a class="button secondary nu-popup-cta" href="/notes">Explore Notes Instead</a>
            <button class="nu-popup-dismiss" type="button">Maybe Later</button>
          </div>
        </div>`;
      document.body.appendChild(el);
      requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add("nu-popup-visible")));

      function close() {
        el.classList.remove("nu-popup-visible");
        el.addEventListener("transitionend", () => el.remove(), { once: true });
        localStorage.setItem(KEY, String(Date.now()));
      }
      el.querySelector(".nu-popup-close").addEventListener("click", close);
      el.querySelector(".nu-popup-dismiss").addEventListener("click", close);
      el.querySelector(".nu-popup-cta").addEventListener("click", close);
      el.addEventListener("click", (e) => { if (e.target === el) close(); });

      // Email capture submit
      el.querySelector(".nu-popup-email-form").addEventListener("submit", async (e) => {
        e.preventDefault();
        const input = el.querySelector(".nu-popup-email-input");
        const email = input.value.trim().toLowerCase();
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          input.classList.add("nu-popup-input-error");
          return;
        }
        input.classList.remove("nu-popup-input-error");
        const btn = el.querySelector(".nu-popup-email-btn");
        btn.textContent = "Saving…";
        btn.disabled = true;
        try {
          const client = sb();
          if (client) await client.from("newsletter_subscribers").upsert({ email, source: "welcome_popup" }, { onConflict: "email" });
        } catch (_) {}
        // Show confirmation
        el.querySelector(".nu-popup-email-capture").innerHTML = `
          <div class="nu-popup-email-success">
            ${icon("checkCircle")}<span>You're subscribed! 🎉 Weekly tips coming your way.</span>
          </div>`;
        setTimeout(close, 2500);
      });
    }, 8000);
  })();

  // ── 2. Sign-In CTA bar (scroll-triggered) ─────────────────────────
  (function signInBar() {
    if (state.user) return; // already signed in
    const KEY = "nursinguganda.signInBarShown";
    if (sessionStorage.getItem(KEY)) return;
    // Count page views this session
    const views = parseInt(sessionStorage.getItem("nursinguganda.pageViews") || "0", 10) + 1;
    sessionStorage.setItem("nursinguganda.pageViews", String(views));
    if (views < 2) return; // wait until 2nd page view

    let triggered = false;
    function onScroll() {
      if (triggered) return;
      const scrolled = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight;
      if (scrolled < 0.5) return;
      triggered = true;
      window.removeEventListener("scroll", onScroll);
      if (document.getElementById("nu-popup-signin")) return;
      const el = document.createElement("div");
      el.id = "nu-popup-signin";
      el.className = "nu-popup-signin-bar";
      el.innerHTML = `
        <div class="nu-popup-signin-inner">
          <span class="nu-popup-signin-text">${icon("sparkles")}<span>Sign up free: save progress, unlock flashcards &amp; more</span></span>
          <div class="nu-popup-signin-actions">
            <button class="button primary nu-popup-signin-btn" type="button" data-lp-signup>Create Free Account</button>
            <button class="nu-popup-signin-close" type="button" aria-label="Dismiss">${icon("x")}</button>
          </div>
        </div>`;
      document.body.appendChild(el);
      requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add("nu-popup-signin-visible")));
      sessionStorage.setItem(KEY, "1");

      function close() {
        el.classList.remove("nu-popup-signin-visible");
        el.addEventListener("transitionend", () => el.remove(), { once: true });
      }
      el.querySelector(".nu-popup-signin-close").addEventListener("click", close);
      el.querySelector(".nu-popup-signin-btn").addEventListener("click", () => {
        close();
        // Trigger login modal via existing mechanism
        const btn = document.querySelector("[data-lp-signup]");
        if (btn && btn !== el.querySelector(".nu-popup-signin-btn")) btn.click();
        else {
          state.loginPrompt = { open: true, tab: "signup" };
          render();
        }
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
  })();

  // ── 3. Study Tip of the Day ────────────────────────────────────────
  (function studyTip() {
    const KEY = "nursinguganda.tipDate";
    const today = new Date().toISOString().slice(0, 10);
    if (localStorage.getItem(KEY) === today) return;

    setTimeout(() => {
      if (document.getElementById("nu-popup-tip")) return;
      const tip = STUDY_TIPS[Math.floor(Math.random() * STUDY_TIPS.length)];
      const el = document.createElement("div");
      el.id = "nu-popup-tip";
      el.className = "nu-popup-tip";
      el.innerHTML = `
        <div class="nu-popup-tip-inner">
          <span class="nu-popup-tip-badge">${icon("lightbulb")} Tip of the Day</span>
          <p class="nu-popup-tip-text">${tip.tip}</p>
          <div class="nu-popup-tip-foot">
            <span class="nu-popup-tip-tag">${tip.tag}</span>
            <div class="nu-popup-tip-actions">
              <a class="nu-popup-tip-wa" href="${waShare(`💡 Nursing Tip: "${tip.tip}"\n\nMore tips at https://nursinguganda.com`)}" target="_blank" rel="noopener noreferrer">${icon("whatsapp")}</a>
              <button class="nu-popup-tip-close" type="button" aria-label="Dismiss">${icon("x")}</button>
            </div>
          </div>
        </div>`;
      document.body.appendChild(el);
      requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add("nu-popup-tip-visible")));
      localStorage.setItem(KEY, today);

      // Auto-dismiss after 14 seconds
      const timer = setTimeout(close, 14000);
      function close() {
        clearTimeout(timer);
        el.classList.remove("nu-popup-tip-visible");
        el.addEventListener("transitionend", () => el.remove(), { once: true });
      }
      el.querySelector(".nu-popup-tip-close").addEventListener("click", close);
    }, 10000);
  })();

  // ── 4. Quiz Challenge (scroll-triggered on study pages) ───────────
  (function quizChallenge() {
    const path = window.location.pathname;
    const isStudyPage = path.startsWith("/notes") || path.startsWith("/courses") || path.startsWith("/flashcards");
    if (!isStudyPage) return;
    const pageKey = "nursinguganda.quizShown." + path;
    if (sessionStorage.getItem(pageKey)) return;

    let triggered = false;
    function onScroll() {
      if (triggered) return;
      const scrolled = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight;
      if (scrolled < 0.6) return;
      triggered = true;
      window.removeEventListener("scroll", onScroll);
      if (document.getElementById("nu-popup-quiz")) return;

      const q = QUICK_QUIZZES[Math.floor(Math.random() * QUICK_QUIZZES.length)];
      let answered = false;

      const el = document.createElement("div");
      el.id = "nu-popup-quiz";
      el.className = "nu-popup-overlay";
      el.innerHTML = `
        <div class="nu-popup-modal nu-popup-quiz" role="dialog" aria-modal="true" aria-labelledby="nu-quiz-title">
          <button class="nu-popup-close" aria-label="Close">${icon("x")}</button>
          <div class="nu-popup-quiz-badge">${icon("zap")} Quick Quiz</div>
          <h2 id="nu-quiz-title" class="nu-popup-quiz-q">${q.q}</h2>
          <div class="nu-popup-quiz-options">
            ${q.options.map((opt, i) => `<button class="nu-popup-quiz-opt" data-idx="${i}" type="button"><span class="qo-letter">${String.fromCharCode(65+i)}</span><span class="qo-text">${opt}</span></button>`).join("")}
          </div>
          <div class="nu-popup-quiz-feedback" aria-live="polite"></div>
          <div class="nu-popup-quiz-actions" style="display:none">
            <a class="button primary" href="/flashcards">Practice More ${icon("arrowRight")}</a>
            <button class="nu-popup-dismiss" type="button">Close</button>
          </div>
        </div>`;
      document.body.appendChild(el);
      requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add("nu-popup-visible")));
      sessionStorage.setItem(pageKey, "1");

      function close() {
        el.classList.remove("nu-popup-visible");
        el.addEventListener("transitionend", () => el.remove(), { once: true });
      }
      el.querySelector(".nu-popup-close").addEventListener("click", close);
      el.querySelector(".nu-popup-dismiss")?.addEventListener("click", close);
      el.addEventListener("click", (e) => { if (e.target === el) close(); });

      el.querySelectorAll(".nu-popup-quiz-opt").forEach((btn) => {
        btn.addEventListener("click", function() {
          if (answered) return;
          answered = true;
          const chosen = parseInt(this.dataset.idx, 10);
          el.querySelectorAll(".nu-popup-quiz-opt").forEach((b, i) => {
            b.disabled = true;
            if (i === q.answer) b.classList.add("nu-quiz-correct");
            else if (i === chosen) b.classList.add("nu-quiz-wrong");
          });
          const fb = el.querySelector(".nu-popup-quiz-feedback");
          if (chosen === q.answer) {
            fb.innerHTML = `${icon("checkCircle")}<span>Correct! Well done.</span>`;
            fb.className = "nu-popup-quiz-feedback nu-quiz-fb-correct";
          } else {
            fb.innerHTML = `${icon("xCircle")}<span>Not quite: the answer is <strong>${q.options[q.answer]}</strong>.</span>`;
            fb.className = "nu-popup-quiz-feedback nu-quiz-fb-wrong";
          }
          el.querySelector(".nu-popup-quiz-actions").style.display = "";
        });
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
  })();
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

/* ── Spaced Repetition (SM-2) ─────────────────────────────────────── */
function getSRCards() {
  try { return JSON.parse(localStorage.getItem("nursinguganda.srCards") || "{}"); }
  catch { return {}; }
}
function saveSRCards(data) {
  try { localStorage.setItem("nursinguganda.srCards", JSON.stringify(data)); } catch {}
}
// quality: 0=Again, 2=Hard, 4=Good, 5=Easy
function updateCardSR(id, quality) {
  const today = new Date().toISOString().slice(0, 10);
  const data = getSRCards();
  const card = data[id] || { ef: 2.5, interval: 1, reps: 0 };
  let { ef, interval, reps } = card;
  if (quality < 3) {
    reps = 0;
    interval = 1;
  } else {
    if (reps === 0) interval = 1;
    else if (reps === 1) interval = 6;
    else interval = Math.round(interval * ef);
    reps++;
  }
  ef = Math.max(1.3, ef + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  const due = new Date(Date.now() + interval * 86400000).toISOString().slice(0, 10);
  data[id] = { ef: Math.round(ef * 100) / 100, interval, reps, due, lastReview: today };
  saveSRCards(data);
  // Also update mastery: if reps >= 3 and ef >= 2.0, consider mastered
  if (reps >= 3 && ef >= 2.0) {
    const m = flashcardMastery(); m.add(id);
    localStorage.setItem("nursinguganda.flashcardMastery", JSON.stringify([...m]));
  }
  return data[id];
}
function srDueCards(deck) {
  const data = getSRCards();
  const today = new Date().toISOString().slice(0, 10);
  return deck.filter(t => {
    const sr = data[t.id];
    return !sr || sr.due <= today; // unseen cards are always due
  });
}
function srDueCount() {
  const terms = dictionaryTerms();
  return srDueCards(terms).length;
}

function flashcardDeck() {
  const terms = dictionaryTerms();
  const cat = state.flashcardCategory || "All";
  return cat === "All" ? terms : terms.filter((t) => t.category === cat);
}

function renderFlashcards() {
  const allDeck = flashcardDeck();
  const mastery = flashcardMastery();
  const srMode  = state.flashcardSRMode;
  const dueDeck = srMode ? srDueCards(allDeck) : allDeck;
  const deck    = dueDeck.length ? dueDeck : allDeck; // fallback to full deck if nothing due
  const dueCount = srDueCards(flashcardDeck()).length;

  const idx = Math.min(state.flashcardIndex || 0, Math.max(0, deck.length - 1));
  const card = deck[idx];
  const categories = ["All", ...new Set(dictionaryTerms().map((t) => t.category))];
  const masteredCount = allDeck.filter((t) => mastery.has(t.id)).length;
  const isMastered = card && mastery.has(card.id);
  const progress = allDeck.length ? Math.round((masteredCount / allDeck.length) * 100) : 0;
  const srData = getSRCards();
  const cardSR = card ? (srData[card.id] || null) : null;
  const allDone = srMode && dueDeck.length === 0;

  return `
    <section class="fc-hero">
      <div class="container">
        <nav class="fc-breadcrumb"><a href="/dictionary">Dictionary</a><span>${icon("arrowRight")}</span><strong>Flashcards</strong></nav>
        <div class="fc-hero-head">
          <div>
            <h1>${icon("sparkles")} Flashcard Study</h1>
            <p>Tap a card to flip it. Rate how well you knew it for spaced repetition.</p>
          </div>
          <div class="fc-summary">
            <span>${icon("checkCircle")}<strong>${masteredCount}</strong> mastered</span>
            <span>${icon("bookOpen")}<strong>${allDeck.length}</strong> in deck</span>
            <span class="fc-due-chip${dueCount > 0 ? " has-due" : ""}">${icon("clock")}<strong>${dueCount}</strong> due today</span>
          </div>
        </div>
        <!-- Mode toggle -->
        <div class="fc-mode-rail">
          <button type="button" class="fc-mode-btn${!srMode ? " active" : ""}" data-fc-mode="browse">Browse All</button>
          <button type="button" class="fc-mode-btn${srMode ? " active" : ""}${dueCount > 0 ? " has-due" : ""}" data-fc-mode="sr">
            Study Due ${dueCount > 0 ? `<span class="fc-due-badge">${dueCount}</span>` : ""}
          </button>
        </div>
        <div class="fc-category-rail">
          ${categories.map((cat) => `<button type="button" class="fc-cat-btn${state.flashcardCategory === cat ? " active" : ""}" data-fc-cat="${escapeHtml(cat)}">${escapeHtml(cat)}</button>`).join("")}
        </div>
      </div>
    </section>
    <div class="fc-arena">
      <div class="container">
        ${allDone ? `
          <div class="fc-all-done">
            <span>🎉</span>
            <h2>All caught up!</h2>
            <p>No cards are due for review today. Come back tomorrow or browse all cards.</p>
            <button type="button" class="button secondary" data-fc-mode="browse">Browse All Cards</button>
          </div>
        ` : card ? `
          <div class="fc-progress-bar"><div class="fc-progress-fill" style="width:${progress}%"></div></div>
          <p class="fc-counter">${idx + 1} of ${deck.length}${srMode ? ` due` : ""}</p>
          <div class="fc-wrapper">
            <div class="fc-card${state.flashcardFlipped ? " flipped" : ""}${isMastered ? " mastered" : ""}" data-fc-flip role="button" tabindex="0" aria-label="Flip card">
              <div class="fc-front">
                <span class="fc-category-tag">${escapeHtml(card.category)}</span>
                <h2>${escapeHtml(card.term)}</h2>
                ${card.pronunciation ? `<p class="fc-pronunciation">${escapeHtml(card.pronunciation)}</p>` : ""}
                <p class="fc-hint">${icon("rotateCcw")} Tap or press <kbd>Space</kbd> to reveal</p>
                <p class="fc-keyboard-hint">${icon("arrowLeft")} <kbd>←</kbd> prev &nbsp; <kbd>→</kbd> next &nbsp; <kbd>M</kbd> master</p>
              </div>
              <div class="fc-back">
                <span class="fc-category-tag">${escapeHtml(card.category)}</span>
                <h2>${escapeHtml(card.term)}</h2>
                <p class="fc-definition">${escapeHtml(card.simpleDefinition)}</p>
                <p class="fc-clinical">${icon("stethoscope")} ${escapeHtml(truncateText(card.clinicalContext, 140))}</p>
                ${cardSR ? `<p class="fc-sr-info">Next review: ${cardSR.due} &middot; Interval: ${cardSR.interval}d &middot; Ease: ${cardSR.ef}</p>` : ""}
              </div>
            </div>
          </div>

          <!-- SR Rating buttons (show after flip) -->
          ${state.flashcardFlipped ? `
            <div class="fc-sr-rating" aria-label="How well did you know this?">
              <span class="fc-sr-label">How well did you know it?</span>
              <div class="fc-sr-btns">
                <button type="button" class="fc-sr-btn sr-again" data-fc-rate="0" data-fc-id="${escapeHtml(card.id)}">
                  <span>Again</span><small>Forgot</small>
                </button>
                <button type="button" class="fc-sr-btn sr-hard" data-fc-rate="2" data-fc-id="${escapeHtml(card.id)}">
                  <span>Hard</span><small>Struggled</small>
                </button>
                <button type="button" class="fc-sr-btn sr-good" data-fc-rate="4" data-fc-id="${escapeHtml(card.id)}">
                  <span>Good</span><small>Remembered</small>
                </button>
                <button type="button" class="fc-sr-btn sr-easy" data-fc-rate="5" data-fc-id="${escapeHtml(card.id)}">
                  <span>Easy</span><small>Instant</small>
                </button>
              </div>
            </div>
          ` : ""}

          <!-- Browse mode controls -->
          ${!srMode ? `
            <div class="fc-controls">
              <button type="button" class="fc-btn secondary" data-fc-prev ${idx === 0 ? "disabled" : ""}>${icon("arrowLeft")} Prev</button>
              <button type="button" class="fc-btn master${isMastered ? " active" : ""}" data-fc-master data-fc-id="${escapeHtml(card.id)}">${icon(isMastered ? "checkCircle" : "star")} ${isMastered ? "Mastered" : "Mark Mastered"}</button>
              <button type="button" class="fc-btn secondary" data-fc-next ${idx >= deck.length - 1 ? "disabled" : ""}>Next ${icon("arrowRight")}</button>
            </div>
          ` : ""}

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
    requireLogin("flashcard", "Sign in to track which flashcards you have mastered.", () => {
      toggleFlashcardMastery(id);
      render();
    });
  });

  // SR: rate button handler: advance to next due card
  app.querySelectorAll("[data-fc-rate]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.fcId;
      const quality = parseInt(btn.dataset.fcRate, 10);
      updateCardSR(id, quality);
      // In SR mode: advance to next due card; in browse mode: just go next
      const deck = state.flashcardSRMode
        ? srDueCards(flashcardDeck())
        : flashcardDeck().filter((t) => state.flashcardCategory === "All" || t.category === state.flashcardCategory);
      const currentIdx = state.flashcardIndex || 0;
      // Stay at same index (next card shifts into position) or clamp
      state.flashcardIndex = Math.min(currentIdx, Math.max(0, deck.length - 2));
      state.flashcardFlipped = false;
      render();
    });
  });

  // Mode toggle
  app.querySelectorAll("[data-fc-mode]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.flashcardSRMode = btn.dataset.fcMode === "sr";
      state.flashcardIndex = 0;
      state.flashcardFlipped = false;
      render();
    });
  });

  app.querySelectorAll("[data-fc-cat]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.flashcardCategory = btn.dataset.fcCat;
      state.flashcardIndex = 0;
      state.flashcardFlipped = false;
      render();
    });
  });

  // ── Global keyboard shortcuts (only when flashcard page is active) ──────────
  function fcKeyHandler(e) {
    // Skip if user is typing in an input/textarea
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA" || e.target.isContentEditable) return;
    const deck = flashcardDeck();
    const idx  = state.flashcardIndex || 0;
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      state.flashcardFlipped = !state.flashcardFlipped;
      render();
    } else if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
      if (idx > 0) { state.flashcardIndex = idx - 1; state.flashcardFlipped = false; render(); }
    } else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
      if (idx < deck.length - 1) { state.flashcardIndex = idx + 1; state.flashcardFlipped = false; render(); }
    } else if (e.key === "m" || e.key === "M") {
      const card = deck[idx];
      if (card) { requireLogin("flashcard", "Sign in to track mastered cards.", () => { toggleFlashcardMastery(card.id); render(); }); }
    }
  }
  // Remove any previous listener, then add fresh one
  document.removeEventListener("keydown", window._fcKeyHandler);
  window._fcKeyHandler = fcKeyHandler;
  document.addEventListener("keydown", fcKeyHandler);
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
    showToast("Break over: back to focus!", "info");
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

    // Curriculum is the minimum needed to render: load it first and paint immediately
    // Use root-relative path so it always resolves correctly regardless of current URL
    const response = await fetch("/assets/data/curriculum.json?v=108");
    if (!response.ok) throw new Error(`Could not load course content (${response.status}). Please refresh.`);
    state.data = await response.json();
    state.imageMatches = { matches: {} };

    setupMonetization();
    if (window.location.pathname === "/" || window.location.pathname === "") history.replaceState(null, "", "/notes");

    // ── Supabase: restore existing session ──────────────────────────────
    const client = sb();
    if (client) {
      try {
        const { data: { session } } = await client.auth.getSession();
        if (session?.user) {
          state.currentUser = supabaseUserToAppUser(session.user);
          // Load cloud progress for returning users (non-blocking)
          loadProgressFromSupabase().catch(() => {});
        }
      } catch (_) {}
      client.auth.onAuthStateChange((_event, session) => {
        const wasLoggedIn = !!state.currentUser;
        state.currentUser = session?.user ? supabaseUserToAppUser(session.user) : null;
        state.loginEmailSent = false;
        // When user logs in, sync cloud progress down
        if (!wasLoggedIn && state.currentUser) loadProgressFromSupabase().catch(() => {});
        render();
      });
    }

    // ── Site settings (maintenance mode, etc.) ───────────────────────────
    await loadSiteSettings();

    // ── Background data: announcements, tips, events, downloads ───
    loadAnnouncements().catch(() => {});
    loadTipsFromSupabase().catch(() => {});
    loadEventsFromSupabase().catch(() => {});
    loadResourceDownloadsFromSupabase().catch(() => {});

    // Initialise CV Generator modal container (outside #app so it survives SPA navigation)
    if (!document.getElementById("cvg-root")) {
      const cvgRoot = document.createElement("div");
      cvgRoot.id = "cvg-root";
      document.body.appendChild(cvgRoot);
    }
    // Restore in-progress mock exam (if any) and restart timer
    loadMockExamState();
    if (state.mockExam.examId && !state.mockExam.submitted) startMockExamTimer();

    // Fire study reminder if conditions met, then re-check every minute
    checkStudyReminder();
    setInterval(checkStudyReminder, 60000);

    render();
    analyticsTrackPageView();
    scrollPageToTop();
    setupOfflineBanner();
    setupStudyNotifications();
    setupStudyTimer();

    // Remaining resources load in the background: re-render when images land
    Promise.allSettled([
      fetch("/assets/data/topic-image-matches.json")
        .then((r) => r.ok ? r.json() : null)
        .then((d) => { if (d) { state.imageMatches = d; render(); } }),
      fetch("/assets/images/optimized/nursing-uganda-optimized-image-manifest.json")
        .then((r) => r.ok ? r.json() : null)
        .then((d) => { if (d) state.optimizedImages = d.images || {}; }),
      fetch("/assets/data/book-library.json")
        .then((r) => r.ok ? r.json() : null)
        .then((d) => { if (d) state.bookLibrary = d; }),
      fetch("/assets/data/medical-instruments.json?v=2")
        .then((r) => r.ok ? r.json() : null)
        .then((d) => { if (d) state.medicalInstrumentLibrary = d; })
    ]);
  } catch (error) {
    app.innerHTML = `
      <div class="loading-screen loading-error">
        <img src="assets/images/nursing-uganda-icon-mark.webp" style="width:56px;height:56px;object-fit:contain;opacity:.5" alt="" width="56" height="56">
        <strong class="loading-wordmark">Nursing Uganda</strong>
        <p class="load-error-msg">${escapeHtml(error.message)}</p>
        <button class="button primary" onclick="window.location.reload()">Try Again</button>
      </div>
    `;
  }
}

// History API navigation: back/forward buttons
window.addEventListener("popstate", () => {
  state.navOpen = false;
  state.megaOpen = "";
  render();
  analyticsTrackPageView();
  scrollPageToTop();
});

// Global: "Turn Off Now" button in admin maintenance banner
document.addEventListener("click", (e) => {
  if (e.target.closest("[data-maint-off]")) {
    adminSaveMaintenance(false, state.maintenance?.message || "", state.maintenance?.eta || "");
  }
});

document.addEventListener("click", analyticsTrackClickFromEvent, { capture: true });

// Intercept all internal link clicks: no full page reloads
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
    analyticsTrackPageView();
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
  if (event.key === "Escape" && state.cookiePreferencesOpen) {
    state.cookiePreferencesOpen = false;
    render();
    return;
  }
  if (event.key === "Escape" && state.lightboxImage) {
    state.lightboxImage = "";
    state.lightboxAlt = "";
    render();
    return;
  }
  if (event.key === "Escape" && state.loginPrompt.open) {
    state.loginPrompt.open = false;
    render();
  }
});

init();
initPopups();

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

// PWA install prompt removed

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
