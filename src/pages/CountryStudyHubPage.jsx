import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ClipboardCheck,
  Clock,
  ExternalLink,
  FileCheck2,
  Layers,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  Star
} from "lucide-react";
import AdSlot from "../components/AdSlot";
import CountryFlag from "../components/CountryFlag";
import NursingLoader from "../components/NursingLoader";
import { setPageSeo } from "../components/RouteSeo";
import { LessonSections } from "../components/TopicVisuals";
import {
  COUNTRY_CURRICULA,
  COUNTRY_META,
  DRUG_NAME_EQUIVALENTS,
  LAB_CONVERSIONS,
  SLUG_TO_COUNTRY_KEY
} from "../data/countryCurricula";

const THEME_CONFIG = {
  "coursera-black": {
    heroBg: "#0A0D14",
    heroBorder: "#1E293B",
    cardBg: "rgba(255, 255, 255, 0.06)",
    cardBorder: "rgba(255, 255, 255, 0.14)",
    cardTopBorder: "#FFFFFF",
    switchActiveBg: "rgba(255, 255, 255, 0.18)",
    switchIdleBg: "rgba(255, 255, 255, 0.06)",
    accent: "#111827",
    accentStrong: "#000000",
    badgeBg: "#FFFFFF",
    badgeText: "#0A0D14",
    tintBg: "#F8FAFC",
    tintBorder: "#E2E8F0"
  },
  "red-black": {
    heroBg: "#991B1B",
    heroBorder: "#09090B",
    cardBg: "rgba(9, 9, 11, 0.42)",
    cardBorder: "rgba(255, 255, 255, 0.16)",
    cardTopBorder: "#09090B",
    switchActiveBg: "#09090B",
    switchIdleBg: "rgba(9, 9, 11, 0.28)",
    accent: "#09090B",
    accentStrong: "#000000",
    badgeBg: "#09090B",
    badgeText: "#FFFFFF",
    tintBg: "#F8FAFC",
    tintBorder: "#E2E8F0"
  },
  "green-black": {
    heroBg: "#064E3B",
    heroBorder: "#09090B",
    cardBg: "rgba(9, 9, 11, 0.42)",
    cardBorder: "rgba(255, 255, 255, 0.16)",
    cardTopBorder: "#09090B",
    switchActiveBg: "#09090B",
    switchIdleBg: "rgba(9, 9, 11, 0.28)",
    accent: "#09090B",
    accentStrong: "#000000",
    badgeBg: "#09090B",
    badgeText: "#FFFFFF",
    tintBg: "#F8FAFC",
    tintBorder: "#E2E8F0"
  },
  "blue-black": {
    heroBg: "#1E3A8A",
    heroBorder: "#09090B",
    cardBg: "rgba(9, 9, 11, 0.42)",
    cardBorder: "rgba(255, 255, 255, 0.16)",
    cardTopBorder: "#09090B",
    switchActiveBg: "#09090B",
    switchIdleBg: "rgba(9, 9, 11, 0.28)",
    accent: "#09090B",
    accentStrong: "#000000",
    badgeBg: "#09090B",
    badgeText: "#FFFFFF",
    tintBg: "#F8FAFC",
    tintBorder: "#E2E8F0"
  }
};

function resolveThemeKey(slug) {
  if (slug === "united-kingdom-nmc") return "coursera-black";
  if (slug === "united-states-nclex" || slug === "canada-nnas-nclex") return "red-black";
  if (slug === "kenya-nck") return "blue-black";
  return "green-black";
}

const COUNTRY_HERO_IMAGES = {
  "united-kingdom-nmc": "/assets/images/nursing-uganda-home-hero-1.webp",
  "united-states-nclex": "/assets/images/nclex-rn-hero-bg.webp",
  "canada-nnas-nclex": "/assets/images/nursing-uganda-hero-nursing-student-skills-lab-01.webp",
  "australia-ahpra-nmba": "/assets/images/nursing-uganda-home-hero-2.webp",
  "kenya-nck": "/assets/images/nursing-uganda-disease-assessment-learning-01.webp",
  "uganda-unmc": "/assets/images/nursing-uganda-curriculum-study-group-01.webp",
  "tanzania-tnmc": "/assets/images/nursing-uganda-midwifery-newborn-care-training-01.webp",
  "gulf-dha-moh-scfhs": "/assets/images/nursing-uganda-medical-instruments-clinical-tray-01.webp"
};

const COUNTRY_SWITCHER_LINKS = [
  { label: "UK", code: "UK", to: "/nursing-uk" },
  { label: "USA", code: "US", to: "/nursing-usa" },
  { label: "Canada", code: "CA", to: "/nursing-canada" },
  { label: "Australia", code: "AU", to: "/nursing-australia" },
  { label: "Kenya", code: "KE", to: "/global-nursing/kenya-nck" },
  { label: "Uganda", code: "UG", to: "/global-nursing/uganda-unmc" },
  { label: "Tanzania", code: "TZ", to: "/global-nursing/tanzania-tnmc" },
  { label: "Gulf", code: "AE", to: "/global-nursing/gulf-dha-moh-scfhs" }
];

const COUNTRY_FEATURED_PLATES = {
  "united-kingdom-nmc": [
    { src: "/assets/images/medical-illustrations/hub-uk-nmc-pathway-news2.webp", title: "NMC 4-Stage Pipeline & NEWS2 Scoring", tag: "NMC CBT · OSCE" },
    { src: "/assets/images/medical-illustrations/foundations-vital-signs-monitoring.webp", title: "Adult Observation Chart & ABCDE Escalation", tag: "NEWS2 Triggers" },
    { src: "/assets/images/medical-illustrations/medsurg-pneumonia-pleural-effusion.webp", title: "Sepsis Six, Oxygen Target & Chest Auscultation", tag: "NICE Guidelines" },
    { src: "/assets/images/medical-illustrations/ethics-medico-legal-nursing-principles.webp", title: "NMC Code: Duty of Candour & Delegation", tag: "NHS Governance" }
  ],
  "united-states-nclex": [
    { src: "/assets/images/medical-illustrations/nclex-foreign-rn-licensure-roadmap.webp", title: "CGFNS, State Board, ATT & Visa Roadmap", tag: "Foreign RN Track" },
    { src: "/assets/images/medical-illustrations/nclex-ngn-cat-question-formats.webp", title: "Next-Gen NCLEX CJMM & CAT Blueprint", tag: "NGN Exam Model" },
    { src: "/assets/images/medical-illustrations/medsurg-shock-haemorrhage-cpr.webp", title: "Critical Care Stabilization & ACLS Priorities", tag: "Physiological Integrity" },
    { src: "/assets/images/medical-illustrations/medsurg-cardiovascular-mi-hf.webp", title: "Acute Coronary Care & Haemodynamic Monitoring", tag: "Prioritization" }
  ],
  "canada-nnas-rexpn": [],
  "canada-nnas-nclex": [
    { src: "/assets/images/medical-illustrations/hub-canada-nnas-rexpn.webp", title: "NNAS Advisory, CNO / BCCNM & NCLEX/REx-PN", tag: "Provincial Licensure" },
    { src: "/assets/images/medical-illustrations/psych-therapeutic-nurse-patient-erikson.webp", title: "Therapeutic Communication & Trauma-Informed Care", tag: "Cultural Safety" },
    { src: "/assets/images/medical-illustrations/pharmacology-iv-fluids-infusion.webp", title: "SI Medication Calculations & Electrolyte Safety", tag: "CNO Standard" },
    { src: "/assets/images/medical-illustrations/leadership-research-ethics.webp", title: "Scope of Practice, Autonomy & MAiD Ethics", tag: "CNA Ethics" }
  ],
  "australia-ahpra-nmba": [
    { src: "/assets/images/medical-illustrations/hub-australia-oba-isbar.webp", title: "AHPRA OBA, MCQ/OSCE & ISBAR Clinical Handover", tag: "NSQHS Standards" },
    { src: "/assets/images/medical-illustrations/safety-disaster-management-triage.webp", title: "ED Triage (ATS Categories) & Deterioration", tag: "NMBA Safety" },
    { src: "/assets/images/medical-illustrations/foundations-palliative-end-of-life-care.webp", title: "Voluntary Assisted Care & Goals of Care", tag: "Aged & Acute Care" },
    { src: "/assets/images/medical-illustrations/medsurg-stroke-cva-hemorrhage.webp", title: "Stroke Code FAST, Thrombolysis & swallow screen", tag: "NSQHS Partnering" }
  ],
  "kenya-nck": [
    { src: "/assets/images/medical-illustrations/condition-malaria-smear.webp", title: "Severe Malaria, Artesunate & WHO Protocols", tag: "KEMSA / MoH" },
    { src: "/assets/images/medical-illustrations/condition-preeclampsia-placenta.webp", title: "Eclampsia & Pritchard MgSO4 Emergency Pack", tag: "Paper I & II" },
    { src: "/assets/images/medical-illustrations/paed-imci-dehydration-ors-plans.webp", title: "IMCI Paediatric Dehydration Plan A, B & C", tag: "Paediatric Paper" },
    { src: "/assets/images/medical-illustrations/immune-hiv-opportunistic-infections-pep.webp", title: "NASCOP HIV Care, Opportunistic Infections & PEP", tag: "Community Health" }
  ],
  "uganda-unmc": [
    { src: "/assets/images/medical-illustrations/leadership-hrm-uganda-health-policies.webp", title: "UNMC Regulation, MoH 7-Tier Referral & HRM", tag: "UCG 2023" },
    { src: "/assets/images/medical-illustrations/paed-unepi-immunization-schedule.webp", title: "UNEPI Immunization Schedule & Cold Chain", tag: "MoH Uganda" },
    { src: "/assets/images/medical-illustrations/community-phc-cbhc-home-visiting.webp", title: "VHTs, Primary Health Care & CBHC Home Visits", tag: "Community Paper" },
    { src: "/assets/images/medical-illustrations/pharmacology-antiretrovirals-hiv-cycle.webp", title: "First-Line TLD, EMTCT & Paediatric ARV Dosing", tag: "UCG Pharmacology" }
  ],
  "tanzania-tnmc": [
    { src: "/assets/images/medical-illustrations/who-modified-partograph-chart.webp", title: "WHO Modified Partograph & Alert/Action Lines", tag: "TNMC Midwifery" },
    { src: "/assets/images/medical-illustrations/paed-newborn-resuscitation-apgar-kmc.webp", title: "Helping Babies Breathe & Kangaroo Mother Care", tag: "Neonatal Care" },
    { src: "/assets/images/medical-illustrations/condition-tb-pneumonia-xray.webp", title: "NTLP Tuberculosis DOTS & GeneXpert Screening", tag: "STG/NEMLIT" },
    { src: "/assets/images/medical-illustrations/micro-wash-sanitation-food-housing.webp", title: "Cholera Outbreak Control, WASH & Sanitation", tag: "Public Health" }
  ],
  "gulf-dha-moh-scfhs": [
    { src: "/assets/images/medical-illustrations/hand-hygiene-who-11-steps.webp", title: "JCI IPSG Infection Control & Hand Hygiene Audit", tag: "JCI Hospital Prep" },
    { src: "/assets/images/medical-illustrations/pharmacology-parenteral-injection-angles.webp", title: "High-Alert Medication Independent Double Check", tag: "IPSG Goal 3" },
    { src: "/assets/images/medical-illustrations/safety-occupational-hazards-ppe-fire.webp", title: "OSHAD Fire Safety, Isolation & Hazardous PPE", tag: "DHA / SCFHS" },
    { src: "/assets/images/medical-illustrations/blood-transfusion-clinical-procedure.webp", title: "2-Nurse Blood Transfusion Bedside Verification", tag: "IPSG Goal 1" }
  ]
};

export default function CountryStudyHubPage({ forcedSlug = "" }) {
  const { countrySlug: paramSlug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const targetSlug = forcedSlug || paramSlug || "united-kingdom-nmc";
  const countryKey = SLUG_TO_COUNTRY_KEY[targetSlug] || null;
  const countryMeta = countryKey ? COUNTRY_META[countryKey] : null;
  const curriculum = COUNTRY_CURRICULA[targetSlug] || null;

  const [globalData, setGlobalData] = useState(null);
  const [hubsData, setHubsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const initialTab = searchParams.get("tab") || "notes";
  const [tab, setTab] = useState(initialTab);
  const [answers, setAnswers] = useState({});
  const [submittedQuiz, setSubmittedQuiz] = useState(false);
  const [openModule, setOpenModule] = useState(1);

  // Topics directory state (779 localized pages per country)
  const [allTopics, setAllTopics] = useState([]);
  const [topicsLoading, setTopicsLoading] = useState(false);
  const [topicQuery, setTopicQuery] = useState("");
  const [topicCat, setTopicCat] = useState("all");
  const [topicPage, setTopicPage] = useState(1);

  // Interactive Lab & Drug converter state
  const [glucoseVal, setGlucoseVal] = useState("5.4");
  const [glucoseDir, setGlucoseDir] = useState("si-to-us");
  const [drugSearch, setDrugSearch] = useState("");

  useEffect(() => {
    const qTab = searchParams.get("tab");
    if (qTab && qTab !== tab) setTab(qTab);
  }, [searchParams]);

  const switchTab = (nextTab) => {
    setTab(nextTab);
    setSearchParams(nextTab === "notes" ? {} : { tab: nextTab }, { replace: true });
  };

  useEffect(() => {
    let active = true;
    setLoading(true);
    setAnswers({});
    setSubmittedQuiz(false);
    setTopicPage(1);
    if (!searchParams.get("tab")) setTab("notes");
    Promise.all([
      fetch("/assets/data/global-nursing.json").then((r) => (r.ok ? r.json() : { countries: [] })).catch(() => ({ countries: [] })),
      fetch("/assets/data/country-study-hubs.json").then((r) => (r.ok ? r.json() : { hubs: {} })).catch(() => ({ hubs: {} }))
    ])
      .then(([g, h]) => {
        if (!active) return;
        setGlobalData(g);
        setHubsData(h);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [targetSlug]);

  useEffect(() => {
    if (tab !== "topics" || allTopics.length > 0 || topicsLoading) return;
    setTopicsLoading(true);
    fetch("/assets/data/canonical-lessons-index.json")
      .then((r) => (r.ok ? r.json() : []))
      .then((arr) => setAllTopics(Array.isArray(arr) ? arr : []))
      .catch(() => {})
      .finally(() => setTopicsLoading(false));
  }, [tab, allTopics.length, topicsLoading]);

  const topicCategories = useMemo(() => {
    const counts = new Map();
    for (const t of allTopics) {
      const cat = t.category || "General Nursing";
      counts.set(cat, (counts.get(cat) || 0) + 1);
    }
    return Array.from(counts.entries()).map(([name, count]) => ({ name, count }));
  }, [allTopics]);

  const filteredTopics = useMemo(() => {
    const q = topicQuery.trim().toLowerCase();
    return allTopics.filter((t) => {
      if (topicCat !== "all" && t.category !== topicCat) return false;
      if (q) {
        const hay = `${t.title} ${t.excerpt || ""} ${t.category || ""} ${t.courseTitle || ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [allTopics, topicCat, topicQuery]);

  const TOPIC_PAGE_SIZE = 24;
  const totalTopicPages = Math.max(1, Math.ceil(filteredTopics.length / TOPIC_PAGE_SIZE));
  const pagedTopics = filteredTopics.slice((topicPage - 1) * TOPIC_PAGE_SIZE, topicPage * TOPIC_PAGE_SIZE);

  const countries = globalData?.countries || [];
  const country = useMemo(
    () => countries.find((c) => c.slug === targetSlug) || null,
    [countries, targetSlug]
  );
  const hub = hubsData?.hubs?.[targetSlug] || null;
  const themeKey = hub?.theme || resolveThemeKey(targetSlug);
  const theme = THEME_CONFIG[themeKey] || THEME_CONFIG["green-black"];

  useEffect(() => {
    if (!country) return;
    setPageSeo({
      title: hub?.headline ? `${hub.headline} | Nursing Uganda` : `Becoming a Nurse in ${country.country} (${country.council}) | Nursing Uganda`,
      description: hub?.subheadline || country.summary,
      canonicalPath: hub?.route || `/global-nursing/${country.slug}`,
      type: "article"
    });
  }, [country, hub]);

  if (loading) {
    return (
      <main className="nu-section">
        <div className="nu-container">
          <NursingLoader label="Loading Country Nursing Academy..." />
        </div>
      </main>
    );
  }

  if (!country) {
    return (
      <main className="nu-section">
        <div className="nu-container">
          <h1>Country pathway not found</h1>
          <Link to="/global-nursing" className="nu-btn nu-btn-primary">All 8 Country Pathways</Link>
        </div>
      </main>
    );
  }

  const quizItems = hub?.quiz || [];
  const quizScore = quizItems.reduce((acc, q) => (answers[q.id] === q.answerIndex ? acc + 1 : acc), 0);

  return (
    <main className={`nu-country-hub nu-hub-theme--${themeKey}`} style={{ background: "#f8fafc", minHeight: "80vh" }}>
      {/* Rich Editorial Country Academy Hero with Atmospheric Clinical Photography */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          background: theme.heroBg,
          backgroundImage: `linear-gradient(105deg, rgba(10, 13, 20, 0.94) 0%, ${theme.heroBg}E6 56%, rgba(10, 13, 20, 0.78) 100%), url('${COUNTRY_HERO_IMAGES[targetSlug] || "/assets/images/nursing-uganda-home-hero-1.webp"}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "#ffffff",
          borderBottom: `4px solid ${theme.heroBorder}`,
          padding: "42px 0 36px"
        }}
      >
        <div className="nu-container" style={{ maxWidth: 1180, position: "relative", zIndex: 2 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
              <Link
                to="/global-nursing"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  color: "#cbd5e1",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  textDecoration: "none"
                }}
              >
                <ArrowLeft size={14} /> Global Hub
              </Link>
              <span style={{ color: "#64748b" }}>/</span>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "4px 12px",
                  borderRadius: 999,
                  background: theme.badgeBg,
                  color: theme.badgeText,
                  fontSize: "0.72rem",
                  fontWeight: 800,
                  letterSpacing: "0.05em"
                }}
              >
                {hub?.eyebrow || `${country.region.toUpperCase()} · ${country.flag}`}
              </span>
            </div>

            {/* Complete 8-Country Switcher */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {COUNTRY_SWITCHER_LINKS.map((nav) => {
                const isCurrent = (hub?.route || `/global-nursing/${country.slug}`) === nav.to || `/global-nursing/${country.slug}` === nav.to;
                return (
                  <Link
                    key={nav.to}
                    to={nav.to}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 5,
                      padding: "5px 9px",
                      borderRadius: 6,
                      border: `1px solid ${isCurrent ? "#FFFFFF" : "rgba(255,255,255,0.22)"}`,
                      background: isCurrent ? theme.switchActiveBg : theme.switchIdleBg,
                      color: "#ffffff",
                      fontSize: "0.74rem",
                      fontWeight: 700,
                      textDecoration: "none"
                    }}
                  >
                    <CountryFlag code={nav.code} width={16} />
                    {nav.label}
                  </Link>
                );
              })}
            </div>
          </div>

          <h1 style={{ margin: "0 0 12px", fontSize: "clamp(1.65rem, 3vw, 2.45rem)", display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", color: "#ffffff", lineHeight: 1.18 }}>
            <CountryFlag code={country.flag} width={48} />
            <span>{hub?.headline || `Becoming a Registered Nurse in ${country.country}`}</span>
          </h1>
          <p style={{ margin: "0 0 20px", maxWidth: 840, color: "rgba(255, 255, 255, 0.9)", fontSize: "1.02rem", lineHeight: 1.62 }}>
            {hub?.subheadline || country.summary}
          </p>

          {/* Primary Hero CTAs matching HomePage clarity */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 24 }}>
            {curriculum && (
              <button
                type="button"
                onClick={() => switchTab("curriculum")}
                className="nu-btn nu-btn-primary"
                style={{ background: "#ffffff", color: "#0f172a", borderColor: "#ffffff", fontWeight: 800 }}
              >
                <Layers size={16} /> Start {curriculum.courses.length} {countryMeta?.shortName} Courses <ArrowRight size={15} />
              </button>
            )}
            {countryMeta && (
              <button
                type="button"
                onClick={() => switchTab("topics")}
                className="nu-btn nu-btn-outline"
                style={{ background: "rgba(15, 23, 42, 0.55)", color: "#ffffff", borderColor: "rgba(255,255,255,0.38)" }}
              >
                <BookOpen size={16} /> Browse 779 Localized Topics
              </button>
            )}
            <button
              type="button"
              onClick={() => switchTab("practice")}
              className="nu-btn nu-btn-outline"
              style={{ background: "rgba(15, 23, 42, 0.35)", color: "#ffffff", borderColor: "rgba(255,255,255,0.28)" }}
            >
              <ClipboardCheck size={16} /> Quiz &amp; {country.unitSystem === "SI" ? "US → SI" : "SI → US"} Lab Converter
            </button>
          </div>

          {/* Unified Horizontal Stats Bar */}
          <div
            style={{
              background: "#ffffff",
              color: "#0f172a",
              borderRadius: 10,
              border: "1px solid rgba(15, 23, 42, 0.1)",
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.18)",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(195px, 1fr))",
              overflow: "hidden"
            }}
          >
            {(hub?.highlights || [
              { label: "Regulatory Body", value: country.council },
              { label: "Licensing Exam", value: country.examRequired },
              { label: "Language Bar", value: country.languageTest },
              { label: "Lab System", value: `${country.unitSystem} · ${country.timeline}` }
            ]).map((h, i, arr) => (
              <div
                key={i}
                style={{
                  padding: "14px 18px",
                  borderRight: i < arr.length - 1 ? "1px solid #e2e8f0" : "none",
                  borderBottom: "1px solid #f1f5f9"
                }}
              >
                <div style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#64748b" }}>
                  {h.label}
                </div>
                <div style={{ marginTop: 4, fontSize: "0.9rem", fontWeight: 700, color: "#0f172a", lineHeight: 1.35 }}>
                  {h.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HomePage-style Regulatory Trust & Localization Bar */}
      <div style={{ background: "#ffffff", borderBottom: "1px solid #e2e8f0", padding: "12px 0" }}>
        <div
          className="nu-container"
          style={{
            maxWidth: 1180,
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 14,
            fontSize: "0.82rem",
            color: "#334155",
            fontWeight: 600
          }}
        >
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <ShieldCheck size={16} color={theme.heroBg === "#0A0D14" ? "#7c3aed" : theme.heroBg} />
            Aligned to {country.council}
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <Sparkles size={16} color={theme.heroBg === "#0A0D14" ? "#7c3aed" : theme.heroBg} />
            Drug &amp; Lab Standard: {country.drugConvention} · {country.unitSystem}
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <CheckCircle2 size={16} color={theme.heroBg === "#0A0D14" ? "#7c3aed" : theme.heroBg} />
            779 Localized Clinical Notes Included
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <FileCheck2 size={16} color={theme.heroBg === "#0A0D14" ? "#7c3aed" : theme.heroBg} />
            {country.examRequired} Blueprint
          </span>
        </div>
      </div>

      <section className="nu-section">
        <div className="nu-container" style={{ maxWidth: 1180 }}>
          {globalData?.disclaimer && (
            <div style={{ padding: "11px 15px", borderRadius: 8, background: theme.tintBg, border: `1px solid ${theme.tintBorder}`, color: "#0f172a", fontSize: "0.84rem", marginBottom: 20 }}>
              <ShieldCheck size={15} style={{ display: "inline", marginRight: 6, verticalAlign: "text-bottom", color: theme.accent }} />
              {globalData.disclaimer}
            </div>
          )}

          {/* Coursera-style Hub Navigation Tabs */}
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 22, paddingBottom: 14, borderBottom: "1px solid #e2e8f0" }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {hub?.sections?.length > 0 && (
                <button
                  type="button"
                  onClick={() => switchTab("notes")}
                  style={{
                    padding: "9px 15px",
                    borderRadius: 8,
                    border: `1.5px solid ${tab === "notes" ? theme.accent : "#cbd5e1"}`,
                    background: tab === "notes" ? theme.accent : "#ffffff",
                    color: tab === "notes" ? "#ffffff" : "#0f172a",
                    fontWeight: 700,
                    fontSize: "0.84rem",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6
                  }}
                >
                  <BookOpen size={15} /> About &amp; Blueprint
                </button>
              )}
              {curriculum && (
                <button
                  type="button"
                  onClick={() => switchTab("curriculum")}
                  style={{
                    padding: "9px 15px",
                    borderRadius: 8,
                    border: `1.5px solid ${tab === "curriculum" ? theme.accent : "#cbd5e1"}`,
                    background: tab === "curriculum" ? theme.accent : "#ffffff",
                    color: tab === "curriculum" ? "#ffffff" : "#0f172a",
                    fontWeight: 700,
                    fontSize: "0.84rem",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6
                  }}
                >
                  <Layers size={15} /> Courses &amp; Curriculum ({curriculum.modules.length})
                </button>
              )}
              {countryMeta && (
                <button
                  type="button"
                  onClick={() => switchTab("topics")}
                  style={{
                    padding: "9px 15px",
                    borderRadius: 8,
                    border: `1.5px solid ${tab === "topics" ? theme.accent : "#cbd5e1"}`,
                    background: tab === "topics" ? theme.accent : "#ffffff",
                    color: tab === "topics" ? "#ffffff" : "#0f172a",
                    fontWeight: 700,
                    fontSize: "0.84rem",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6
                  }}
                >
                  <BookOpen size={15} /> 779 Study Topics
                </button>
              )}
              {(quizItems.length > 0 || curriculum) && (
                <button
                  type="button"
                  onClick={() => switchTab("practice")}
                  style={{
                    padding: "9px 15px",
                    borderRadius: 8,
                    border: `1.5px solid ${tab === "practice" || tab === "quiz" ? theme.accent : "#cbd5e1"}`,
                    background: tab === "practice" || tab === "quiz" ? theme.accent : "#ffffff",
                    color: tab === "practice" || tab === "quiz" ? "#ffffff" : "#0f172a",
                    fontWeight: 700,
                    fontSize: "0.84rem",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6
                  }}
                >
                  <ClipboardCheck size={15} /> Practice &amp; Unit Tools
                </button>
              )}
              <button
                type="button"
                onClick={() => switchTab("roadmap")}
                style={{
                  padding: "9px 15px",
                  borderRadius: 8,
                  border: `1.5px solid ${tab === "roadmap" || !hub ? theme.accent : "#cbd5e1"}`,
                  background: tab === "roadmap" || !hub ? theme.accent : "#ffffff",
                  color: tab === "roadmap" || !hub ? "#ffffff" : "#0f172a",
                  fontWeight: 700,
                  fontSize: "0.84rem",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6
                }}
              >
                <MapPin size={15} /> Official Roadmap
              </button>
              {curriculum?.premiumOffer && (
                <button
                  type="button"
                  onClick={() => switchTab("offers")}
                  style={{
                    padding: "9px 15px",
                    borderRadius: 8,
                    border: `1.5px solid ${tab === "offers" ? theme.accent : "#cbd5e1"}`,
                    background: tab === "offers" ? theme.accent : "#ffffff",
                    color: tab === "offers" ? "#ffffff" : "#0f172a",
                    fontWeight: 700,
                    fontSize: "0.84rem",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6
                  }}
                >
                  <Award size={15} /> Prep Bundle
                </button>
              )}
            </div>

            <a
              href={country.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: "9px 14px",
                borderRadius: 8,
                background: theme.heroBg,
                color: "#ffffff",
                fontWeight: 700,
                fontSize: "0.82rem",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 6
              }}
            >
              Official Portal: {country.council.split("(")[0].trim()} <ExternalLink size={13} />
            </a>
          </div>

          {/* Tab 1: Rich Country Home Overview (Clinical Notes + Visual Plates + Courses + Quick Tools) */}
          {tab === "notes" && (
            <div style={{ display: "grid", gap: 30, marginBottom: 28 }}>
              {hub?.sections?.length > 0 && (
                <div>
                  <LessonSections sections={hub.sections} topicTitle={country.country} headingTag="h2" disableInlineFigures />
                </div>
              )}

              {/* Curated Clinical Visual Plates Strip for this Country */}
              {(COUNTRY_FEATURED_PLATES[targetSlug] || []).length > 0 && (
                <section>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 10, marginBottom: 14 }}>
                    <div>
                      <span style={{ fontSize: "0.72rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", color: "#7c3aed" }}>
                        CURATED CLINICAL PLATES · {countryMeta?.shortName || country.country.toUpperCase()}
                      </span>
                      <h2 style={{ margin: "2px 0 0", fontSize: "1.35rem", color: "#0f172a" }}>
                        High-Yield Diagrams &amp; {country.examRequired.split("(")[0].trim()} Flowcharts
                      </h2>
                    </div>
                    <Link to="/medical-atlas" style={{ fontSize: "0.84rem", fontWeight: 700, color: "#7c3aed", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4 }}>
                      Full Medical Atlas <ArrowRight size={14} />
                    </Link>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(235px, 1fr))", gap: 14 }}>
                    {(COUNTRY_FEATURED_PLATES[targetSlug] || []).map((plate) => (
                      <div
                        key={plate.src}
                        style={{
                          background: "#ffffff",
                          border: "1px solid #cbd5e1",
                          borderRadius: 10,
                          overflow: "hidden",
                          boxShadow: "0 2px 10px rgba(15, 23, 42, 0.04)",
                          display: "flex",
                          flexDirection: "column"
                        }}
                      >
                        <div style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0", aspectRatio: "16 / 10", overflow: "hidden" }}>
                          <img
                            src={plate.src}
                            alt={plate.title}
                            loading="lazy"
                            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                          />
                        </div>
                        <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: 4 }}>
                          <span style={{ fontSize: "0.68rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", color: "#7c3aed" }}>
                            {plate.tag}
                          </span>
                          <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#0f172a", lineHeight: 1.35 }}>
                            {plate.title}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* HomePage-style Country Specialization Courses Preview */}
              {curriculum?.courses?.length > 0 && (
                <section>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 10, marginBottom: 14 }}>
                    <div>
                      <span style={{ fontSize: "0.72rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", color: "#475569" }}>
                        {curriculum.partnerLine}
                      </span>
                      <h2 style={{ margin: "2px 0 0", fontSize: "1.35rem", color: "#0f172a" }}>
                        Featured {countryMeta?.shortName || country.country} Specialization Courses ({curriculum.courses.length})
                      </h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => switchTab("curriculum")}
                      style={{
                        background: "none",
                        border: "none",
                        padding: 0,
                        fontSize: "0.84rem",
                        fontWeight: 700,
                        color: "#7c3aed",
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4
                      }}
                    >
                      Open Full {curriculum.modules.length}-Module Syllabus <ArrowRight size={14} />
                    </button>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(255px, 1fr))", gap: 14 }}>
                    {curriculum.courses.slice(0, 4).map((course) => (
                      <div
                        key={course.id}
                        style={{
                          background: "#ffffff",
                          border: "1px solid #cbd5e1",
                          borderTop: `4px solid ${theme.heroBg}`,
                          borderRadius: 10,
                          padding: 16,
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          gap: 10
                        }}
                      >
                        <div>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, marginBottom: 6 }}>
                            <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#475569" }}>{course.provider}</span>
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: "0.75rem", fontWeight: 700, color: "#0f172a" }}>
                              <Star size={12} fill="#0f172a" /> {course.rating}
                            </span>
                          </div>
                          <h3 style={{ margin: "0 0 6px", fontSize: "0.98rem", color: "#0f172a", lineHeight: 1.35 }}>
                            {course.title}
                          </h3>
                          <p style={{ margin: 0, fontSize: "0.83rem", color: "#475569", lineHeight: 1.5 }}>
                            {course.summary}
                          </p>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 10, borderTop: "1px solid #f1f5f9", fontSize: "0.76rem", color: "#334155" }}>
                          <span>{course.level} · {course.topicsCount} topics</span>
                          <Link
                            to={`${countryMeta.topicsBase}/${course.sampleTopicSlug}`}
                            style={{ color: "#7c3aed", fontWeight: 800, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4 }}
                          >
                            Start <ArrowRight size={13} />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* HomePage-style 3-Card Quick Actions & Exam Tools Bento */}
              <section style={{ background: "#ffffff", border: "1px solid #cbd5e1", borderRadius: 12, padding: 22 }}>
                <h2 style={{ margin: "0 0 14px", fontSize: "1.2rem", color: "#0f172a" }}>
                  Interactive Study Tools for {country.country}
                </h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 14 }}>
                  <button
                    type="button"
                    onClick={() => switchTab("practice")}
                    style={{
                      textAlign: "left",
                      background: "#f8fafc",
                      border: "1px solid #cbd5e1",
                      borderRadius: 10,
                      padding: 16,
                      cursor: "pointer"
                    }}
                  >
                    <div style={{ fontSize: "0.72rem", fontWeight: 800, color: "#7c3aed", textTransform: "uppercase", marginBottom: 4 }}>
                      Practice &amp; Unit Converter
                    </div>
                    <div style={{ fontWeight: 700, color: "#0f172a", fontSize: "0.96rem", marginBottom: 4 }}>
                      Quiz + SI ↔ US Lab Values
                    </div>
                    <p style={{ margin: 0, fontSize: "0.82rem", color: "#475569", lineHeight: 1.45 }}>
                      Convert blood glucose ({country.unitSystem}), HbA1c, creatinine, and BAN/rINN vs USAN drug names.
                    </p>
                  </button>

                  {countryMeta && (
                    <button
                      type="button"
                      onClick={() => switchTab("topics")}
                      style={{
                        textAlign: "left",
                        background: "#f8fafc",
                        border: "1px solid #cbd5e1",
                        borderRadius: 10,
                        padding: 16,
                        cursor: "pointer"
                      }}
                    >
                      <div style={{ fontSize: "0.72rem", fontWeight: 800, color: "#7c3aed", textTransform: "uppercase", marginBottom: 4 }}>
                        Full Clinical Library
                      </div>
                      <div style={{ fontWeight: 700, color: "#0f172a", fontSize: "0.96rem", marginBottom: 4 }}>
                        779 {countryMeta.shortName} Study Topics
                      </div>
                      <p style={{ margin: 0, fontSize: "0.82rem", color: "#475569", lineHeight: 1.45 }}>
                        Search localized anatomy, pharmacology, paediatrics, OB/GYN &amp; med-surg topics.
                      </p>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => switchTab("roadmap")}
                    style={{
                      textAlign: "left",
                      background: "#f8fafc",
                      border: "1px solid #cbd5e1",
                      borderRadius: 10,
                      padding: 16,
                      cursor: "pointer"
                    }}
                  >
                    <div style={{ fontSize: "0.72rem", fontWeight: 800, color: "#7c3aed", textTransform: "uppercase", marginBottom: 4 }}>
                      Registration &amp; Timeline
                    </div>
                    <div style={{ fontWeight: 700, color: "#0f172a", fontSize: "0.96rem", marginBottom: 4 }}>
                      Official {country.council.split("(")[0].trim()} Checklist
                    </div>
                    <p style={{ margin: 0, fontSize: "0.82rem", color: "#475569", lineHeight: 1.45 }}>
                      Review step-by-step credentialing ({country.timeline}), English language scores, and documents.
                    </p>
                  </button>
                </div>
              </section>
            </div>
          )}

          {/* Tab 2: Coursera-style Courses & Expandable Multi-Module Curriculum */}
          {tab === "curriculum" && curriculum && (
            <div style={{ marginBottom: 32 }}>
              <div style={{ marginBottom: 22 }}>
                <div style={{ fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#475569", marginBottom: 4 }}>
                  {curriculum.partnerLine}
                </div>
                <h2 style={{ margin: "0 0 6px", fontSize: "1.45rem", color: "#0f172a" }}>
                  {countryMeta?.shortName} Specialization Courses ({curriculum.courses.length} Courses · {curriculum.totalHours})
                </h2>
                <p style={{ margin: 0, color: "#475569", fontSize: "0.92rem" }}>
                  Structured like a Coursera Professional Certificate: step through each course module and open localized clinical study notes.
                </p>
              </div>

              {/* Coursera Specialization Course Cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))", gap: 16, marginBottom: 28 }}>
                {curriculum.courses.map((course) => (
                  <div
                    key={course.id}
                    style={{
                      background: "#ffffff",
                      border: "1px solid #e2e8f0",
                      borderTop: `4px solid ${theme.heroBg}`,
                      borderRadius: 10,
                      padding: 18,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      gap: 12
                    }}
                  >
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, marginBottom: 8 }}>
                        <span style={{ fontSize: "0.74rem", fontWeight: 700, color: "#475569" }}>{course.provider}</span>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: "0.76rem", fontWeight: 700, color: "#0f172a" }}>
                          <Star size={13} fill="#0f172a" /> {course.rating}
                        </span>
                      </div>
                      <h3 style={{ margin: "0 0 8px", fontSize: "1.02rem", color: "#0f172a", lineHeight: 1.35 }}>
                        {course.title}
                      </h3>
                      <p style={{ margin: 0, fontSize: "0.85rem", color: "#475569", lineHeight: 1.55 }}>
                        {course.summary}
                      </p>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 10, borderTop: "1px solid #f1f5f9", fontSize: "0.78rem", color: "#334155" }}>
                      <span>{course.level} · {course.topicsCount} topics</span>
                      <Link
                        to={`${countryMeta.topicsBase}/${course.sampleTopicSlug}`}
                        style={{ color: theme.heroBg === "#0A0D14" ? "#0f172a" : theme.heroBg, fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4 }}
                      >
                        Start <ArrowRight size={13} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {/* Coursera-style Expandable Syllabus Modules */}
              <h3 style={{ margin: "0 0 12px", fontSize: "1.18rem", color: "#0f172a" }}>
                Full {countryMeta?.shortName} Syllabus | {curriculum.modules.length} Modules
              </h3>
              <div style={{ display: "grid", gap: 10 }}>
                {curriculum.modules.map((mod) => {
                  const isOpen = openModule === mod.number;
                  return (
                    <div key={mod.number} style={{ background: "#ffffff", border: "1px solid #cbd5e1", borderRadius: 10, overflow: "hidden" }}>
                      <button
                        type="button"
                        onClick={() => setOpenModule(isOpen ? 0 : mod.number)}
                        style={{
                          width: "100%",
                          padding: "16px 18px",
                          background: isOpen ? "#f8fafc" : "#ffffff",
                          border: 0,
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: 12,
                          textAlign: "left",
                          cursor: "pointer"
                        }}
                      >
                        <div>
                          <div style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#64748b" }}>
                            Module {mod.number} · {mod.duration}
                          </div>
                          <div style={{ fontSize: "1rem", fontWeight: 700, color: "#0f172a", marginTop: 2 }}>
                            {mod.title}
                          </div>
                        </div>
                        {isOpen ? <ChevronUp size={18} color="#334155" /> : <ChevronDown size={18} color="#334155" />}
                      </button>
                      {isOpen && (
                        <div style={{ padding: "0 18px 18px", borderTop: "1px solid #e2e8f0" }}>
                          <ul style={{ margin: "14px 0", paddingLeft: 18, color: "#334155", fontSize: "0.88rem", lineHeight: 1.65 }}>
                            {mod.outcomes.map((o, idx) => (
                              <li key={idx}>{o}</li>
                            ))}
                          </ul>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                            {mod.topicSlugs.map((slug) => (
                              <Link
                                key={slug}
                                to={`${countryMeta.topicsBase}/${slug}`}
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: 6,
                                  padding: "7px 12px",
                                  borderRadius: 6,
                                  background: "#f1f5f9",
                                  border: "1px solid #cbd5e1",
                                  color: "#0f172a",
                                  fontSize: "0.8rem",
                                  fontWeight: 600,
                                  textDecoration: "none"
                                }}
                              >
                                <BookOpen size={13} />
                                {slug.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase())}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tab 3: 779 Localized Country Study Topics (NursingNotes Directory) */}
          {tab === "topics" && countryMeta && (
            <div style={{ marginBottom: 32 }}>
              <div style={{ background: "#ffffff", border: "1px solid #cbd5e1", borderRadius: 12, padding: 20, marginBottom: 18 }}>
                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 14 }}>
                  <div>
                    <h2 style={{ margin: "0 0 4px", fontSize: "1.3rem", color: "#0f172a" }}>
                      {countryMeta.shortName} Nursing Study Notes Library ({filteredTopics.length} Topics)
                    </h2>
                    <p style={{ margin: 0, fontSize: "0.86rem", color: "#475569" }}>
                      Every topic opens in a NursingNotes-style 2-column study layout localized for <strong>{countryMeta.examBadge}</strong> ({countryMeta.unitLabel}).
                    </p>
                  </div>
                  <div style={{ position: "relative", minWidth: 260, flex: "1 1 280px", maxWidth: 360 }}>
                    <Search size={15} color="#64748b" style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)" }} />
                    <input
                      type="search"
                      value={topicQuery}
                      onChange={(e) => {
                        setTopicQuery(e.target.value);
                        setTopicPage(1);
                      }}
                      placeholder={`Search ${countryMeta.shortName} nursing topics...`}
                      style={{ width: "100%", padding: "9px 12px 9px 34px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: "0.86rem" }}
                    />
                  </div>
                </div>

                {/* Category Filter Chips */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  <button
                    type="button"
                    onClick={() => {
                      setTopicCat("all");
                      setTopicPage(1);
                    }}
                    style={{
                      padding: "5px 11px",
                      borderRadius: 999,
                      border: `1px solid ${topicCat === "all" ? theme.accent : "#cbd5e1"}`,
                      background: topicCat === "all" ? theme.accent : "#f8fafc",
                      color: topicCat === "all" ? "#ffffff" : "#0f172a",
                      fontSize: "0.78rem",
                      fontWeight: 600,
                      cursor: "pointer"
                    }}
                  >
                    All ({allTopics.length})
                  </button>
                  {topicCategories.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => {
                        setTopicCat(c.name);
                        setTopicPage(1);
                      }}
                      style={{
                        padding: "5px 11px",
                        borderRadius: 999,
                        border: `1px solid ${topicCat === c.name ? theme.accent : "#cbd5e1"}`,
                        background: topicCat === c.name ? theme.accent : "#f8fafc",
                        color: topicCat === c.name ? "#ffffff" : "#0f172a",
                        fontSize: "0.78rem",
                        fontWeight: 600,
                        cursor: "pointer"
                      }}
                    >
                      {c.name} ({c.count})
                    </button>
                  ))}
                </div>
              </div>

              {topicsLoading ? (
                <NursingLoader label={`Loading ${countryMeta.shortName} study topics...`} />
              ) : (
                <>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: 14 }}>
                    {pagedTopics.map((t) => (
                      <Link
                        key={t.slug}
                        to={`${countryMeta.topicsBase}/${t.slug}`}
                        style={{
                          background: "#ffffff",
                          border: "1px solid #e2e8f0",
                          borderRadius: 10,
                          padding: 16,
                          textDecoration: "none",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          gap: 8
                        }}
                      >
                        <div>
                          <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#64748b", marginBottom: 4 }}>
                            {t.category} · {t.readMinutes || 12} min read
                          </div>
                          <h3 style={{ margin: "0 0 6px", fontSize: "0.96rem", color: "#0f172a", lineHeight: 1.35 }}>
                            {t.title}
                          </h3>
                          <p style={{ margin: 0, fontSize: "0.81rem", color: "#475569", lineHeight: 1.45, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                            {t.excerpt}
                          </p>
                        </div>
                        <div style={{ fontSize: "0.78rem", fontWeight: 700, color: theme.heroBg === "#0A0D14" ? "#0f172a" : theme.heroBg, display: "inline-flex", alignItems: "center", gap: 4 }}>
                          Open {countryMeta.shortName} Notes <ArrowRight size={13} />
                        </div>
                      </Link>
                    ))}
                  </div>

                  {totalTopicPages > 1 && (
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 10, marginTop: 22 }}>
                      <button
                        type="button"
                        disabled={topicPage <= 1}
                        onClick={() => setTopicPage((p) => Math.max(1, p - 1))}
                        className="nu-btn nu-btn-outline"
                        style={{ padding: "7px 14px", fontSize: "0.82rem" }}
                      >
                        Previous
                      </button>
                      <span style={{ fontSize: "0.84rem", fontWeight: 600, color: "#334155" }}>
                        Page {topicPage} of {totalTopicPages}
                      </span>
                      <button
                        type="button"
                        disabled={topicPage >= totalTopicPages}
                        onClick={() => setTopicPage((p) => Math.min(totalTopicPages, p + 1))}
                        className="nu-btn nu-btn-outline"
                        style={{ padding: "7px 14px", fontSize: "0.82rem" }}
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Tab 4: Interactive Practice Check + Live Unit & Drug Converter */}
          {(tab === "practice" || tab === "quiz") && (
            <div style={{ display: "grid", gap: 22, marginBottom: 28 }}>
              {quizItems.length > 0 && (
                <div style={{ background: "#ffffff", border: "1px solid #cbd5e1", borderRadius: 12, padding: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 18 }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: "1.15rem", color: "#0f172a" }}>{country.country} Exam Practice Check</h2>
                  <small style={{ color: "#64748b" }}>Verify your clinical reasoning against {country.council} standards.</small>
                </div>
                {submittedQuiz && (
                  <span style={{ padding: "6px 12px", borderRadius: 999, background: theme.accent, color: "#ffffff", fontWeight: 800, fontSize: "0.84rem" }}>
                    Score: {quizScore} / {quizItems.length}
                  </span>
                )}
              </div>

              <div style={{ display: "grid", gap: 16 }}>
                {quizItems.map((q, qi) => (
                  <div key={q.id} style={{ border: "1px solid #e2e8f0", borderRadius: 10, padding: 16 }}>
                    <strong style={{ display: "block", marginBottom: 10, color: "#0f172a" }}>
                      {qi + 1}. {q.prompt}
                    </strong>
                    <div style={{ display: "grid", gap: 8 }}>
                      {q.options.map((opt, oi) => {
                        const chosen = answers[q.id] === oi;
                        const isRight = submittedQuiz && q.answerIndex === oi;
                        const isWrong = submittedQuiz && chosen && q.answerIndex !== oi;
                        return (
                          <button
                            key={oi}
                            type="button"
                            disabled={submittedQuiz}
                            onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: oi }))}
                            style={{
                              textAlign: "left",
                              padding: "10px 12px",
                              borderRadius: 8,
                              border: `1.5px solid ${isRight ? "#059669" : isWrong ? "#dc2626" : chosen ? theme.accent : "#cbd5e1"}`,
                              background: isRight ? "#ECFDF5" : isWrong ? "#FEF2F2" : chosen ? theme.tintBg : "#ffffff",
                              color: "#0f172a",
                              fontWeight: chosen || isRight ? 700 : 500,
                              cursor: submittedQuiz ? "default" : "pointer"
                            }}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                    {submittedQuiz && q.rationale && (
                      <div style={{ marginTop: 10, padding: "10px 12px", borderRadius: 6, background: "#f8fafc", borderLeft: `3px solid ${theme.accent}`, fontSize: "0.84rem", color: "#334155" }}>
                        <strong>Rationale:</strong> {q.rationale}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 18, display: "flex", gap: 10 }}>
                {!submittedQuiz ? (
                  <button
                    type="button"
                    onClick={() => setSubmittedQuiz(true)}
                    style={{
                      padding: "10px 20px",
                      borderRadius: 8,
                      border: 0,
                      background: theme.accent,
                      color: "#ffffff",
                      fontWeight: 800,
                      cursor: "pointer"
                    }}
                  >
                    Check Answers
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setAnswers({});
                      setSubmittedQuiz(false);
                    }}
                    className="nu-btn nu-btn-outline"
                  >
                    Retake Practice Check
                  </button>
                )}
              </div>
                </div>
              )}

              {/* Live SI <-> US Lab & Drug Name Converter (Stay-on-Site Tool) */}
              <div style={{ background: "#ffffff", border: "1px solid #cbd5e1", borderRadius: 12, padding: 24 }}>
                <h2 style={{ margin: "0 0 6px", fontSize: "1.15rem", color: "#0f172a" }}>
                  Interactive Blood Glucose &amp; International Drug Name Converter
                </h2>
                <p style={{ margin: "0 0 16px", fontSize: "0.86rem", color: "#475569" }}>
                  Switch seamlessly between UK/Canada/Australia <strong>SI Units (mmol/L)</strong> and USA <strong>Conventional Units (mg/dL)</strong>, plus BNF vs USAN generic names.
                </p>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14, marginBottom: 20, padding: 16, borderRadius: 10, background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#334155", marginBottom: 6 }}>
                      Conversion Direction
                    </label>
                    <select
                      value={glucoseDir}
                      onChange={(e) => setGlucoseDir(e.target.value)}
                      style={{ width: "100%", padding: "9px 10px", borderRadius: 8, border: "1px solid #cbd5e1", background: "#ffffff", fontSize: "0.86rem" }}
                    >
                      <option value="si-to-us">SI (mmol/L) → US (mg/dL)</option>
                      <option value="us-to-si">US (mg/dL) → SI (mmol/L)</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#334155", marginBottom: 6 }}>
                      Enter Glucose ({glucoseDir === "si-to-us" ? "mmol/L" : "mg/dL"})
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={glucoseVal}
                      onChange={(e) => setGlucoseVal(e.target.value)}
                      style={{ width: "100%", padding: "9px 10px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: "0.88rem" }}
                    />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>
                      Converted Result
                    </span>
                    <strong style={{ fontSize: "1.25rem", color: "#0f172a" }}>
                      {(() => {
                        const n = Number(glucoseVal);
                        if (!Number.isFinite(n) || n < 0) return "-";
                        return glucoseDir === "si-to-us"
                          ? `${(n * 18.016).toFixed(0)} mg/dL`
                          : `${(n / 18.016).toFixed(1)} mmol/L`;
                      })()}
                    </strong>
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 10 }}>
                  <h3 style={{ margin: 0, fontSize: "1rem", color: "#0f172a" }}>High-Yield Drug Name Equivalents (UK/AU vs USA/CA)</h3>
                  <input
                    type="search"
                    value={drugSearch}
                    onChange={(e) => setDrugSearch(e.target.value)}
                    placeholder="Filter drugs (e.g. adrenaline, paracetamol)..."
                    style={{ padding: "7px 11px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: "0.82rem", minWidth: 230 }}
                  />
                </div>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.84rem" }}>
                    <thead>
                      <tr style={{ background: "#f1f5f9", textAlign: "left" }}>
                        <th style={{ padding: "9px 10px", borderBottom: "1px solid #cbd5e1" }}>UK / Australia / Uganda</th>
                        <th style={{ padding: "9px 10px", borderBottom: "1px solid #cbd5e1" }}>USA / Canada</th>
                        <th style={{ padding: "9px 10px", borderBottom: "1px solid #cbd5e1" }}>Class &amp; Watchpoint</th>
                      </tr>
                    </thead>
                    <tbody>
                      {DRUG_NAME_EQUIVALENTS.filter((d) => {
                        const q = drugSearch.trim().toLowerCase();
                        return !q || `${d.genericUgUkAu} ${d.usCaName} ${d.className}`.toLowerCase().includes(q);
                      }).map((d) => (
                        <tr key={d.genericUgUkAu}>
                          <td style={{ padding: "9px 10px", borderBottom: "1px solid #e2e8f0", fontWeight: 700 }}>{d.genericUgUkAu}</td>
                          <td style={{ padding: "9px 10px", borderBottom: "1px solid #e2e8f0", fontWeight: 700 }}>{d.usCaName}</td>
                          <td style={{ padding: "9px 10px", borderBottom: "1px solid #e2e8f0", color: "#475569" }}>
                            <strong>{d.className}:</strong> {d.note}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Tab 5: Coursera-style Premium Exam Prep Offer */}
          {tab === "offers" && curriculum?.premiumOffer && (
            <div style={{ background: "#ffffff", border: "1px solid #cbd5e1", borderTop: `4px solid ${theme.heroBg}`, borderRadius: 12, padding: 28, marginBottom: 28 }}>
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-start", gap: 20 }}>
                <div style={{ flex: "1 1 360px" }}>
                  <span style={{ display: "inline-block", padding: "4px 10px", borderRadius: 999, background: theme.heroBg, color: "#ffffff", fontSize: "0.74rem", fontWeight: 800, marginBottom: 10 }}>
                    {curriculum.premiumOffer.badge}
                  </span>
                  <h2 style={{ margin: "0 0 10px", fontSize: "1.45rem", color: "#0f172a" }}>
                    {curriculum.premiumOffer.title}
                  </h2>
                  <p style={{ margin: "0 0 16px", color: "#475569", fontSize: "0.92rem", lineHeight: 1.6 }}>
                    Designed for internationally educated nurses preparing for {country.examRequired}. Includes full curriculum modules, localized unit/drug guides, and mock exam practice.
                  </p>
                  <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 8, color: "#0f172a", fontSize: "0.9rem" }}>
                    {curriculum.premiumOffer.features.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                </div>
                <div style={{ flex: "0 1 280px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, padding: 20 }}>
                  <div style={{ fontSize: "0.78rem", color: "#64748b", fontWeight: 700 }}>Full Prep Access</div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 10, margin: "6px 0 14px" }}>
                    <strong style={{ fontSize: "2rem", color: "#0f172a" }}>{curriculum.premiumOffer.price}</strong>
                    <span style={{ textDecoration: "line-through", color: "#94a3b8", fontSize: "0.95rem" }}>{curriculum.premiumOffer.compareAt}</span>
                  </div>
                  <Link
                    to={curriculum.premiumOffer.ctaTo}
                    className="nu-btn nu-btn-primary"
                    style={{ width: "100%", justifyContent: "center", background: theme.heroBg, borderColor: theme.heroBg, marginBottom: 10 }}
                  >
                    {curriculum.premiumOffer.ctaLabel} <ArrowRight size={15} />
                  </Link>
                  <Link
                    to={`${countryMeta.route}?tab=topics`}
                    className="nu-btn nu-btn-outline"
                    style={{ width: "100%", justifyContent: "center" }}
                  >
                    Try 779 Free Topics First
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Tab 6: Registration Roadmap & Docs */}
          {tab === "roadmap" && (
            <div>
              <div style={{ background: "#ffffff", border: "1px solid #cbd5e1", borderTop: `4px solid ${theme.accent}`, borderRadius: 12, padding: 24, marginBottom: 20 }}>
                <h2 style={{ marginTop: 0, color: "#0f172a", display: "flex", alignItems: "center", gap: 8 }}>
                  <MapPin size={18} color={theme.accent} /> Step-by-Step Registration Roadmap ({country.country})
                </h2>
                <ol style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 10, lineHeight: 1.65 }}>
                  {(country.steps || []).map((st, idx) => (
                    <li key={idx} style={{ color: "#1e293b" }}>{st}</li>
                  ))}
                </ol>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))", gap: 20, marginBottom: 28 }}>
                <div style={{ background: "#ffffff", border: "1px solid #cbd5e1", borderRadius: 12, padding: 22 }}>
                  <h3 style={{ marginTop: 0, color: "#0f172a", display: "flex", alignItems: "center", gap: 8 }}>
                    <FileCheck2 size={17} color={theme.accent} /> Required Document Checklist
                  </h3>
                  <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 8, lineHeight: 1.55 }}>
                    {(country.documents || []).map((doc, i) => (
                      <li key={i} style={{ color: "#334155" }}>{doc}</li>
                    ))}
                  </ul>
                </div>

                <div style={{ background: theme.heroBg, borderRadius: 12, padding: 22, color: "#ffffff" }}>
                  <h3 style={{ marginTop: 0, color: "#ffffff", display: "flex", alignItems: "center", gap: 8 }}>
                    <CheckCircle2 size={17} color={theme.accent === "#111827" ? "#ffffff" : theme.accent} /> Study Hubs to Prepare
                  </h3>
                  <div style={{ display: "grid", gap: 10 }}>
                    {(country.recommendedHubs || []).map((h) => (
                      <Link
                        key={h.to + h.label}
                        to={h.to}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "10px 14px",
                          borderRadius: 8,
                          background: "rgba(255,255,255,0.08)",
                          border: "1px solid rgba(255,255,255,0.16)",
                          color: "#ffffff",
                          fontWeight: 700,
                          fontSize: "0.86rem",
                          textDecoration: "none"
                        }}
                      >
                        <span>{h.label}</span>
                        <ArrowRight size={15} />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <AdSlot slot="global-nursing-bottom" />
        </div>
      </section>
    </main>
  );
}
