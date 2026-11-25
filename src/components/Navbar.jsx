import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Award,
  BookOpen,
  ChevronDown,
  ChevronRight,
  FileText,
  GraduationCap,
  HeartPulse,
  LogOut,
  Menu,
  Search,
  ShoppingCart,
  Sparkles,
  Star,
  Stethoscope,
  Wrench,
  X
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { getActiveCountryContext } from "../utils/countryTheme";
import CountryFlag from "./CountryFlag";
import nuLogoUganda from "../../assets/images/brand/nursing-uganda-logo-light.svg";
import nuLogoUg from "../../assets/images/brand/nursing-ug-logo-light.svg";

const COUNTRY_TOP_LINKS = [
  { code: "UG", label: "Uganda", to: "/global-nursing/uganda-unmc-uhpab" },
  { code: "UK", label: "UK", to: "/nursing-uk" },
  { code: "US", label: "USA", to: "/nursing-usa" },
  { code: "CA", label: "Canada", to: "/nursing-canada" },
  { code: "AU", label: "Australia", to: "/nursing-australia" },
  { code: "KE", label: "Kenya", to: "/global-nursing/kenya-nck" },
  { code: "TZ", label: "Tanzania", to: "/global-nursing/tanzania-tnmc" },
  { code: "AE", label: "UAE / Gulf", to: "/global-nursing/gulf-dha-doh-scfhs" }
];

const FREE_HUBS = [
  { id: "topics", label: "Nurse Topics & Study Notes", to: "/topics", icon: BookOpen },
  { id: "ebooks", label: "Free Referenced eBooks", to: "/ebooks", icon: BookOpen },
  { id: "quizzes", label: "Free Topic Quizzes (25+ Qs)", to: "/quizzes", icon: Award },
  { id: "mock-exams", label: "UNMEB Mock Exams", to: "/mock-exams", icon: Award },
  { id: "dictionary", label: "Medical Dictionary", to: "/dictionary", icon: FileText },
  { id: "instruments", label: "Instrument Atlas", to: "/instruments", icon: Stethoscope },
  { id: "clinical-tools", label: "Clinical Tools, Templates & Units", to: "/clinical-tools", icon: Wrench },
  { id: "global-nursing", label: "Becoming a Nurse (8 Countries)", to: "/global-nursing", icon: GraduationCap }
];

const STATIC_HUB_ITEMS = {
  topics: [
    { label: "Browse All 779 Nurse Study Topics", to: "/topics" },
    { label: "Pharmacology & Clinical Dosages (320)", to: "/topics?cat=Pharmacology" },
    { label: "Midwifery & Maternal Health (124)", to: "/topics?cat=Midwifery+%26+Maternal+Health" },
    { label: "Paediatrics & Child Health (70)", to: "/topics?cat=Paediatrics+%26+Child+Health" },
    { label: "Medical-Surgical Nursing (48)", to: "/topics?cat=Medical-Surgical+Nursing" },
    { label: "Community & Public Health (44)", to: "/topics?cat=Community+%26+Public+Health" },
    { label: "Anatomy & Physiology (26)", to: "/topics?cat=Anatomy+%26+Physiology" },
    { label: "Foundations of Nursing (26)", to: "/topics?cat=Foundations+of+Nursing" },
    { label: "Mental Health & Psychology (34)", to: "/topics?cat=Mental+Health+%26+Psychology" }
  ],
  quizzes: [
    { label: "All 10 Major Nursing Topic Quizzes (270 Qs)", to: "/quizzes" },
    { label: "Anatomy & Physiology (27 Qs)", to: "/quizzes?topic=anatomy-physiology" },
    { label: "Foundations & Health Assessment (27 Qs)", to: "/quizzes?topic=foundations-nursing" },
    { label: "Midwifery & Maternal Health (27 Qs)", to: "/quizzes?topic=midwifery-maternal" },
    { label: "Clinical Pharmacology & Dosages (27 Qs)", to: "/quizzes?topic=pharmacology" },
    { label: "Medical-Surgical Nursing (27 Qs)", to: "/quizzes?topic=medical-surgical" },
    { label: "Paediatrics & Child Health (27 Qs)", to: "/quizzes?topic=paediatrics" },
    { label: "Community Health & Microbiology (27 Qs)", to: "/quizzes?topic=community-microbiology" },
    { label: "First Aid, Triage & Emergency Care (27 Qs)", to: "/quizzes?topic=emergency-critical" }
  ],
  dictionary: [
    { label: "Browse All Medical Terms (A–Z)", to: "/dictionary" },
    { label: "Clinical & Ward Abbreviations", to: "/dictionary?tab=abbreviations" },
    { label: "Anatomy & Physiology Glossary", to: "/dictionary?q=anatomy" },
    { label: "Obstetric & Midwifery Terms", to: "/dictionary?q=labour" },
    { label: "Pharmacology Prefix & Suffix Guide", to: "/dictionary?q=pharmacology" },
    { label: "Infectious Disease Terminology", to: "/dictionary?q=infection" }
  ],
  instruments: [
    { label: "All Medical & Surgical Instruments", to: "/instruments" },
    { label: "Obstetric & Delivery Tray", to: "/instruments?cat=Obstetric" },
    { label: "General Surgical & Suture Set", to: "/instruments?cat=Surgical" },
    { label: "Diagnostic & Vital Signs Equipment", to: "/instruments?cat=Diagnostic" },
    { label: "Sterile Dressing & Ward Procedures", to: "/instruments?cat=Dressing" }
  ],
  "clinical-tools": [
    { label: "IV Drip Rate & Dosage Calculator", to: "/clinical-tools" },
    { label: "Printable Ward & OSCE Templates (8 PDFs)", to: "/templates" },
    { label: "Normal Lab Ranges (SI ↔ US Units Toggle)", to: "/clinical-tools?tab=values" },
    { label: "Emergency & Procedure Checklists (10)", to: "/clinical-tools?tab=checklists" },
    { label: "Global Nursing Licensure Guides (8 Countries)", to: "/global-nursing" }
  ],
  "global-nursing": [
    { label: "All 8 Country Licensure Roadmaps", to: "/global-nursing" },
    { label: "Uganda (UNMC / UHPAB Registration)", to: "/global-nursing/uganda-unmc-uhpab" },
    { label: "United Kingdom (NMC CBT & OSCE)", to: "/global-nursing/united-kingdom-nmc" },
    { label: "USA (CGFNS & NextGen NCLEX-RN)", to: "/global-nursing/united-states-nclex" },
    { label: "Kenya (NCK) & Tanzania (TNMC)", to: "/global-nursing/kenya-nck" },
    { label: "Canada (NNAS), Australia (AHPRA) & Gulf", to: "/global-nursing/canada-nnas-nclex" }
  ]
};

export default function Navbar() {
  const { catalog, user, cart, enrollments, logout } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const [promoVisible, setPromoVisible] = useState(true);
  const [megaOpen, setMegaOpen] = useState(false);
  const [activeNavMenu, setActiveNavMenu] = useState("");
  const [hubEbooks, setHubEbooks] = useState([]);
  const [hubExams, setHubExams] = useState([]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileProgExpanded, setMobileProgExpanded] = useState("");
  const [mobileNavExpanded, setMobileNavExpanded] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchIndexLoaded, setSearchIndexLoaded] = useState(false);
  const [lessonIndex, setLessonIndex] = useState([]);
  const [dictTerms, setDictTerms] = useState([]);
  const [instrumentList, setInstrumentList] = useState([]);
  const [logoSrc, setLogoSrc] = useState(nuLogoUganda);

  const countryCtx = useMemo(() => getActiveCountryContext(location.pathname), [location.pathname]);

  const cleanCourseTitle = (title = "") =>
    String(title || "")
      .replace(/^(CN|DN|CM|DM)\s*\d+\s*[-–·:]\s*/i, "")
      .replace(/\(\s*i+\s*\)/gi, (m) => ` ${m.trim().toUpperCase()}`)
      .replace(/\s{2,}/g, " ")
      .trim();

  useEffect(() => {
    if ((!megaOpen && activeNavMenu !== "ebooks" && activeNavMenu !== "mock-exams") || hubEbooks.length > 0) return;
    Promise.all([
      fetch("/assets/data/ebooks.json").then((r) => (r.ok ? r.json() : null)),
      fetch("/assets/data/mock-exams.json").then((r) => (r.ok ? r.json() : null))
    ])
      .then(([eb, ex]) => {
        if (eb?.ebooks) setHubEbooks(eb.ebooks);
        if (ex?.exams) setHubExams(ex.exams);
      })
      .catch(() => {});
  }, [megaOpen, activeNavMenu, hubEbooks.length]);

  const ensureSearchIndex = () => {
    if (searchIndexLoaded) return;
    setSearchIndexLoaded(true);
    Promise.all([
      fetch("/assets/data/canonical-lessons-index.json").then((r) => (r.ok ? r.json() : [])),
      fetch("/assets/data/dictionary.json").then((r) => (r.ok ? r.json() : null)),
      fetch("/assets/data/medical-instruments.json").then((r) => (r.ok ? r.json() : null)),
      hubEbooks.length ? Promise.resolve(null) : fetch("/assets/data/ebooks.json").then((r) => (r.ok ? r.json() : null))
    ])
      .then(([lessons, dict, inst, eb]) => {
        if (Array.isArray(lessons)) setLessonIndex(lessons);
        if (dict?.terms) setDictTerms(dict.terms);
        if (inst?.categories) setInstrumentList(inst.categories.flatMap((c) => c.items || []));
        if (eb?.ebooks) setHubEbooks(eb.ebooks);
      })
      .catch(() => {});
  };

  useEffect(() => {
    const handler = (e) => {
      if (e.detail?.logoLightSvg) {
        setLogoSrc(e.detail.logoLightSvg);
      }
    };
    window.addEventListener("nu-brand-change", handler);
    return () => window.removeEventListener("nu-brand-change", handler);
  }, []);

  useEffect(() => {
    if (!megaOpen && !mobileOpen) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") {
        setMegaOpen(false);
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [megaOpen, mobileOpen]);

  const programmes = catalog?.programmes || [];
  const courses = catalog?.courses || [];

  const searchHits = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    const results = [];
    const tokens = q.split(/\s+/).filter(Boolean);
    const matchesAll = (hay) => tokens.every((tk) => hay.includes(tk));

    // 1. Direct Course Unit hits
    for (const c of courses) {
      const hay = `${c.title} ${c.category} ${c.code} ${c.programmeLabel} ${c.subtitle || ""}`.toLowerCase();
      if (matchesAll(hay)) {
        results.push({
          key: `course:${c.slug}`,
          kind: "Course Unit",
          title: c.title,
          meta: `${c.programmeLabel} · ${c.lessonCount} lessons`,
          to: `/course/${c.slug}`,
          rightTag: c.isFree ? "Free" : `$${Number(c.priceUsd || 0).toFixed(2)}`
        });
      }
      if (results.length >= 4) break;
    }

    // 2. Canonical Lesson / Topic hits (819+ clinical topics!)
    const seenTopicSlugs = new Set();
    for (const l of lessonIndex) {
      const hay = `${l.title} ${l.excerpt || ""} ${l.courseTitle} ${l.category}`.toLowerCase();
      if (matchesAll(hay) && !seenTopicSlugs.has(l.slug)) {
        seenTopicSlugs.add(l.slug);
        results.push({
          key: `lesson:${l.courseSlug}:${l.slug}`,
          kind: "Lesson Topic",
          title: l.title,
          meta: `${l.courseTitle} · ${l.programmeLabel}`,
          to: `/learn/${l.courseSlug}/${l.slug}`,
          rightTag: `${l.readMinutes || 15} min`
        });
      }
      if (seenTopicSlugs.size >= 4) break;
    }

    // 3. Dictionary & Instruments & eBooks
    for (const t of dictTerms) {
      const hay = `${t.term} ${t.simpleDefinition || ""} ${t.category}`.toLowerCase();
      if (matchesAll(hay)) {
        results.push({
          key: `dict:${t.id}`,
          kind: "Dictionary",
          title: t.term,
          meta: t.simpleDefinition,
          to: `/dictionary?q=${encodeURIComponent(t.term)}`,
          rightTag: "Glossary"
        });
        break;
      }
    }

    for (const it of instrumentList) {
      const hay = `${it.name} ${it.category} ${it.use || ""}`.toLowerCase();
      if (matchesAll(hay)) {
        results.push({
          key: `inst:${it.slug}`,
          kind: "Instrument",
          title: it.name,
          meta: it.category,
          to: `/instruments?q=${encodeURIComponent(it.name)}`,
          rightTag: "Atlas"
        });
        break;
      }
    }

    for (const b of hubEbooks) {
      const hay = `${b.title} ${b.subtitle || ""} ${b.category}`.toLowerCase();
      if (matchesAll(hay)) {
        results.push({
          key: `eb:${b.slug}`,
          kind: "Free eBook",
          title: b.title,
          meta: `${b.chapters?.length || 6} Chapters · PDF`,
          to: `/ebooks/${b.slug}`,
          rightTag: "Free"
        });
        break;
      }
    }

    return results.slice(0, 9);
  }, [courses, lessonIndex, dictTerms, instrumentList, hubEbooks, query]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSearchFocused(false);
    navigate(`/courses?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <>
      {promoVisible && (
        <div className="nu-promo-bar" role="navigation" aria-label="Nursing countries">
          <div className="nu-promo-countries">
            <span className="nu-promo-lead">Nursing Hubs:</span>
            {COUNTRY_TOP_LINKS.map((item) => {
              const active = location.pathname === item.to;
              return (
                <Link
                  key={item.code}
                  to={item.to}
                  className={`nu-promo-country${active ? " is-active" : ""}`}
                >
                  <CountryFlag code={item.code} width={15} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <Link
              to="/global-nursing"
              className={`nu-promo-country nu-promo-all${location.pathname === "/global-nursing" ? " is-active" : ""}`}
            >
              All 8 →
            </Link>
          </div>
          <button
            type="button"
            className="nu-promo-close"
            aria-label="Close country bar"
            onClick={() => setPromoVisible(false)}
          >
            <X size={15} />
          </button>
        </div>
      )}

      <header
        className="nu-header"
        style={countryCtx ? { borderBottom: `3px solid ${countryCtx.palette.headerBorder}` } : undefined}
      >
        <div className="nu-nav-inner">
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <Link to={countryCtx ? countryCtx.meta.route : "/"} className="nu-logo" aria-label={countryCtx ? `${countryCtx.meta.academy} Home` : "Nursing Uganda Home"}>
              <img src={logoSrc} alt="Nursing Uganda" width="154" height="34" className="nu-logo-img" />
            </Link>
            {countryCtx && (
              <Link
                to={countryCtx.meta.route}
                className="nu-nav-desktop-only"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "4px 10px",
                  borderRadius: 999,
                  background: countryCtx.palette.badgeBg,
                  color: countryCtx.palette.badgeText,
                  fontSize: "0.74rem",
                  fontWeight: 700,
                  textDecoration: "none",
                  whiteSpace: "nowrap"
                }}
              >
                <CountryFlag code={countryCtx.meta.flag} width={15} />
                <span>{countryCtx.meta.shortName}</span>
              </Link>
            )}
          </div>

          {/* Coursera-Style Compact 4-Column Explore Mega Menu */}
          <div
            className="nu-explore-wrap nu-nav-desktop-only"
            onMouseEnter={() => setMegaOpen(true)}
            onMouseLeave={() => setMegaOpen(false)}
          >
            <button
              type="button"
              className="nu-nav-link-btn"
              aria-expanded={megaOpen}
              onClick={() => setMegaOpen((v) => !v)}
              style={{
                background: megaOpen ? "#ede9fe" : "#f5f3ff",
                color: "var(--nu-purple)",
                fontWeight: 700,
                padding: "8px 14px",
                borderRadius: 6
              }}
            >
              Explore <ChevronDown size={15} />
            </button>

            {megaOpen && (
              <div className="nu-megamenu" role="menu" aria-label="Explore Nursing Curriculum">
                {countryCtx ? (
                  <>
                    <div className="nu-coursera-mega-cols">
                      <div className="nu-coursera-mega-col">
                        <h4 className="nu-coursera-mega-head">{countryCtx.meta.shortName} Nursing Tracks</h4>
                        {(countryCtx.curriculum?.courses || []).slice(0, 7).map((c) => (
                          <Link
                            key={c.id}
                            to={`${countryCtx.meta.topicsBase}/${c.sampleTopicSlug}`}
                            className="nu-coursera-mega-link"
                            onClick={() => setMegaOpen(false)}
                          >
                            {cleanCourseTitle(c.title)}
                          </Link>
                        ))}
                        <Link to={`${countryCtx.meta.route}?tab=curriculum`} className="nu-coursera-mega-viewall" onClick={() => setMegaOpen(false)}>
                          View all
                        </Link>
                      </div>

                      <div className="nu-coursera-mega-col">
                        <h4 className="nu-coursera-mega-head">Core Clinical Modules</h4>
                        {(countryCtx.curriculum?.modules || []).slice(0, 8).map((m) => (
                          <Link
                            key={m.number}
                            to={`${countryCtx.meta.topicsBase}/${m.topicSlugs?.[0] || "dosage-calculations"}`}
                            className="nu-coursera-mega-link"
                            onClick={() => setMegaOpen(false)}
                          >
                            {m.title}
                          </Link>
                        ))}
                        <Link to={`${countryCtx.meta.route}?tab=topics`} className="nu-coursera-mega-viewall" onClick={() => setMegaOpen(false)}>
                          View all 779 topics
                        </Link>
                      </div>

                      <div className="nu-coursera-mega-col">
                        <h4 className="nu-coursera-mega-head">Localized Topics &amp; Tools</h4>
                        {[
                          { label: "Dosage Calculations & IV Rates", to: `${countryCtx.meta.topicsBase}/dosage-calculations` },
                          { label: "Fluid & Electrolyte Balance", to: `${countryCtx.meta.topicsBase}/fluid-and-electrolyte-imbalance` },
                          { label: "Diabetes & DKA Management", to: `${countryCtx.meta.topicsBase}/certificate-in-nursing-medical-nursing-ll-and-pharmacology-ll-diabetes-mellitus` },
                          { label: "SI ↔ US Lab Unit Converter", to: `${countryCtx.meta.route}?tab=practice` },
                          { label: "UK/AU ↔ USA Drug Equivalents", to: `${countryCtx.meta.route}?tab=practice` }
                        ].map((item) => (
                          <Link key={item.label} to={item.to} className="nu-coursera-mega-link" onClick={() => setMegaOpen(false)}>
                            {item.label}
                          </Link>
                        ))}
                        <Link to={`${countryCtx.meta.route}?tab=practice`} className="nu-coursera-mega-viewall" onClick={() => setMegaOpen(false)}>
                          View tools
                        </Link>
                      </div>

                      <div className="nu-coursera-mega-col">
                        <h4 className="nu-coursera-mega-head">Exam &amp; Licensure Prep</h4>
                        <Link to="/nclex-rn" className="nu-coursera-mega-link" onClick={() => setMegaOpen(false)}>
                          NCLEX-RN Complete Course <span className="nu-coursera-mega-badge">New</span>
                        </Link>
                        <Link to="/nclex-rn/exams" className="nu-coursera-mega-link" onClick={() => setMegaOpen(false)}>
                          NCLEX-RN CAT Mock Exams
                        </Link>
                        <Link to={`${countryCtx.meta.route}?tab=roadmap`} className="nu-coursera-mega-link" onClick={() => setMegaOpen(false)}>
                          {countryCtx.meta.examBadge} Licensure Roadmap
                        </Link>
                        <Link to={`${countryCtx.meta.route}?tab=offers`} className="nu-coursera-mega-link" onClick={() => setMegaOpen(false)}>
                          {countryCtx.meta.shortName} Prep Bundle ({countryCtx.curriculum?.premiumOffer?.price || "$24.99"})
                        </Link>
                        <Link to="/global-nursing" className="nu-coursera-mega-link" onClick={() => setMegaOpen(false)}>
                          Compare All 8 Countries
                        </Link>
                      </div>
                    </div>

                    <div className="nu-coursera-mega-footer">
                      <span>Switch learning hub:</span>
                      <Link to="/courses" onClick={() => setMegaOpen(false)}>Uganda UNMEB Courses (85)</Link>
                      <span>or</span>
                      <Link to="/ebooks" onClick={() => setMegaOpen(false)}>Browse Free Textbooks (87)</Link>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="nu-coursera-mega-cols">
                      {/* Column 1: Programmes & Global Licensure */}
                      <div className="nu-coursera-mega-col">
                        <h4 className="nu-coursera-mega-head">Explore Programmes</h4>
                        {programmes.map((p) => (
                          <Link
                            key={p.id}
                            to={`/courses?programme=${encodeURIComponent(p.id)}`}
                            className="nu-coursera-mega-link"
                            onClick={() => setMegaOpen(false)}
                          >
                            {p.label}
                          </Link>
                        ))}
                        <Link to="/nclex-rn" className="nu-coursera-mega-link" onClick={() => setMegaOpen(false)}>
                          NCLEX-RN Preparation <span className="nu-coursera-mega-badge">New</span>
                        </Link>
                        <Link to="/global-nursing" className="nu-coursera-mega-link" onClick={() => setMegaOpen(false)}>
                          International Nursing (8 Countries)
                        </Link>
                        <Link to="/courses" className="nu-coursera-mega-viewall" onClick={() => setMegaOpen(false)}>
                          View all 85 course units
                        </Link>
                      </div>

                      {/* Column 2: Clinical Categories / Topics */}
                      <div className="nu-coursera-mega-col">
                        <h4 className="nu-coursera-mega-head">Explore Clinical Subjects</h4>
                        {[
                          { label: "Anatomy & Physiology", to: "/topics?cat=Anatomy+%26+Physiology" },
                          { label: "Foundations of Nursing", to: "/topics?cat=Foundations+of+Nursing" },
                          { label: "Pharmacology & Prescribing", to: "/topics?cat=Pharmacology" },
                          { label: "Midwifery & Maternal Health", to: "/topics?cat=Midwifery+%26+Maternal+Health" },
                          { label: "Paediatrics & Child Health", to: "/topics?cat=Paediatrics+%26+Child+Health" },
                          { label: "Medical-Surgical Nursing", to: "/topics?cat=Medical-Surgical+Nursing" },
                          { label: "Community & Public Health", to: "/topics?cat=Community+%26+Public+Health" },
                          { label: "Mental Health & Psychology", to: "/topics?cat=Mental+Health+%26+Psychology" },
                          { label: "Tropical Medicine & First Aid", to: "/topics?cat=Emergency+%26+Critical+Care" }
                        ].map((cat) => (
                          <Link key={cat.label} to={cat.to} className="nu-coursera-mega-link" onClick={() => setMegaOpen(false)}>
                            {cat.label}
                          </Link>
                        ))}
                        <Link to="/topics" className="nu-coursera-mega-viewall" onClick={() => setMegaOpen(false)}>
                          View all 779 study topics
                        </Link>
                      </div>

                      {/* Column 3: Free Textbooks + Reference Tools */}
                      <div className="nu-coursera-mega-col">
                        <h4 className="nu-coursera-mega-head">Free Reference Books</h4>
                        <Link to="/ebooks/book-instant-clinical-pharmacology" className="nu-coursera-mega-link" onClick={() => setMegaOpen(false)}>
                          Instant Clinical Pharmacology
                        </Link>
                        <Link to="/ebooks?cat=Anatomy+%26+Physiology" className="nu-coursera-mega-link" onClick={() => setMegaOpen(false)}>
                          Anatomy &amp; Physiology Texts
                        </Link>
                        <Link to="/ebooks?cat=Midwifery+%26+Maternal+Health" className="nu-coursera-mega-link" onClick={() => setMegaOpen(false)}>
                          Midwifery &amp; Maternal Library
                        </Link>
                        <Link to="/ebooks" className="nu-coursera-mega-viewall" onClick={() => setMegaOpen(false)}>
                          View all 87 free books
                        </Link>

                        <h4 className="nu-coursera-mega-head nu-coursera-mega-head--spaced">Clinical Reference Tools</h4>
                        <Link to="/dictionary" className="nu-coursera-mega-link" onClick={() => setMegaOpen(false)}>
                          Medical Dictionary (1,079 Terms)
                        </Link>
                        <Link to="/instruments" className="nu-coursera-mega-link" onClick={() => setMegaOpen(false)}>
                          Surgical Instrument Atlas (146)
                        </Link>
                        <Link to="/clinical-tools" className="nu-coursera-mega-link" onClick={() => setMegaOpen(false)}>
                          Dosage &amp; IV Drip Calculator
                        </Link>
                        <Link to="/templates" className="nu-coursera-mega-link" onClick={() => setMegaOpen(false)}>
                          Printable OSCE &amp; Ward PDFs
                        </Link>
                      </div>

                      {/* Column 4: Trending Topics + Exams */}
                      <div className="nu-coursera-mega-col">
                        <h4 className="nu-coursera-mega-head">Explore High-Yield Notes</h4>
                        {[
                          { label: "Pharmacokinetics & Dosing", to: "/topics?q=pharmacokinetics" },
                          { label: "Fluid & Electrolyte Balance", to: "/topics?q=electrolyte" },
                          { label: "Stages of Normal Labour", to: "/topics?q=labour" },
                          { label: "Infection Prevention & Sepsis", to: "/topics?q=infection" },
                          { label: "Acid-Base Balance & ABGs", to: "/topics?q=respiratory" },
                          { label: "Hypertension & Stroke Care", to: "/topics?q=hypertension" }
                        ].map((sk) => (
                          <Link key={sk.label} to={sk.to} className="nu-coursera-mega-link" onClick={() => setMegaOpen(false)}>
                            {sk.label}
                          </Link>
                        ))}
                        <Link to="/topics" className="nu-coursera-mega-viewall" onClick={() => setMegaOpen(false)}>
                          View all topics
                        </Link>

                        <h4 className="nu-coursera-mega-head nu-coursera-mega-head--spaced">Prepare for Licensing Exams</h4>
                        <Link to="/mock-exams" className="nu-coursera-mega-link" onClick={() => setMegaOpen(false)}>
                          UNMEB Mock Exams (109 Papers)
                        </Link>
                        <Link to="/nclex-rn/exams" className="nu-coursera-mega-link" onClick={() => setMegaOpen(false)}>
                          NextGen NCLEX-RN Mock Suite
                        </Link>
                        <Link to="/quizzes" className="nu-coursera-mega-link" onClick={() => setMegaOpen(false)}>
                          Free Topic Quizzes (270 Qs)
                        </Link>
                      </div>
                    </div>

                    <div className="nu-coursera-mega-footer">
                      <span>Not sure where to begin?</span>
                      <Link to="/topics" onClick={() => setMegaOpen(false)}>Browse free study notes</Link>
                      <span>or</span>
                      <Link to="/nclex-rn" onClick={() => setMegaOpen(false)}>Explore the NCLEX-RN 16-Unit Academy</Link>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Search Pill */}
          <form
            className="nu-search-form"
            onSubmit={handleSearchSubmit}
            toolname="search_nursing_curriculum"
            tooldescription="Search Nursing Uganda courses, lesson topics, study eBooks, drugs, and medical glossary terms."
          >
            <div className="nu-search-box">
              <Search size={18} color="#6a6f73" />
              <input
                type="search"
                name="query"
                value={query}
                placeholder={countryCtx ? `Search ${countryCtx.meta.shortName} topics, drugs, ${countryCtx.meta.examBadge}...` : "Search courses, topics (e.g. digestive), drugs, midwifery..."}
                aria-label="Search courses and clinical topics"
                onFocus={() => {
                  setSearchFocused(true);
                  ensureSearchIndex();
                }}
                onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                onChange={(e) => {
                  setQuery(e.target.value);
                  ensureSearchIndex();
                }}
              />
            </div>
            {searchFocused && searchHits.length > 0 && (
              <div className="nu-search-dropdown">
                {searchHits.map((hit) => (
                  <Link
                    key={hit.key}
                    to={hit.to}
                    className="nu-search-hit"
                    onMouseDown={() => navigate(hit.to)}
                  >
                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                        <span className="nu-badge nu-badge-free" style={{ fontSize: "0.66rem", padding: "1px 6px" }}>{hit.kind}</span>
                        <strong style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{hit.title}</strong>
                      </div>
                      <small style={{ display: "block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {hit.meta}
                      </small>
                    </div>
                    <span style={{ fontWeight: 700, fontSize: "0.78rem", flexShrink: 0, color: "#6d28d9" }}>
                      {hit.rightTag}
                    </span>
                  </Link>
                ))}
                <Link
                  to={`/courses?q=${encodeURIComponent(query.trim())}`}
                  className="nu-search-hit"
                  style={{ background: "#faf5ff", fontWeight: 700, color: "#A137F2", justifyContent: "center" }}
                  onMouseDown={() => navigate(`/courses?q=${encodeURIComponent(query.trim())}`)}
                >
                  See all course &amp; lesson results for &ldquo;{query.trim()}&rdquo; &rarr;
                </Link>
              </div>
            )}
          </form>

          <nav className="nu-nav-actions">
            {countryCtx ? (
              <>
                <Link to="/nclex-rn" className="nu-nav-link nu-nav-desktop-only" style={{ fontWeight: 700, color: "#991B1B" }}>
                  NCLEX-RN ($99)
                </Link>
                <Link to="/nclex-rn/exams" className="nu-nav-link nu-nav-desktop-only">
                  NCLEX Exams
                </Link>
                <Link to={`${countryCtx.meta.route}?tab=curriculum`} className="nu-nav-link nu-nav-desktop-only">
                  Curriculum
                </Link>
                <Link to={`${countryCtx.meta.route}?tab=topics`} className="nu-nav-link nu-nav-desktop-only">
                  779 Topics
                </Link>
              </>
            ) : (
              <>
                {/* Nurse Topics Submenu */}
                <div
                  className="nu-nav-dropdown-wrap nu-nav-desktop-only"
                  onMouseEnter={() => setActiveNavMenu("topics")}
                  onMouseLeave={() => setActiveNavMenu("")}
                >
                  <Link to="/topics" className="nu-nav-link nu-nav-dropdown-trigger" aria-expanded={activeNavMenu === "topics"}>
                    <span>Nurse Topics</span>
                    <ChevronDown size={13} />
                  </Link>
                  {activeNavMenu === "topics" && (
                    <div className="nu-nav-dropdown" role="menu" aria-label="Nurse Topics Submenu">
                      <div className="nu-nav-dropdown-head">Study Topics &amp; Clinical Subjects</div>
                      {STATIC_HUB_ITEMS.topics.map((item) => (
                        <Link
                          key={item.label}
                          to={item.to}
                          className="nu-nav-dropdown-link"
                          onClick={() => setActiveNavMenu("")}
                        >
                          <span>{item.label}</span>
                          <ChevronRight size={13} />
                        </Link>
                      ))}
                      <div className="nu-nav-dropdown-sep" />
                      <Link to="/dictionary" className="nu-nav-dropdown-link" onClick={() => setActiveNavMenu("")}>
                        <span>Medical Dictionary (A–Z)</span>
                        <ChevronRight size={13} />
                      </Link>
                      <Link to="/instruments" className="nu-nav-dropdown-link" onClick={() => setActiveNavMenu("")}>
                        <span>Surgical Instrument Atlas</span>
                        <ChevronRight size={13} />
                      </Link>
                    </div>
                  )}
                </div>

                {/* Free eBooks Submenu */}
                <div
                  className="nu-nav-dropdown-wrap nu-nav-desktop-only"
                  onMouseEnter={() => setActiveNavMenu("ebooks")}
                  onMouseLeave={() => setActiveNavMenu("")}
                >
                  <Link to="/ebooks" className="nu-nav-link nu-nav-dropdown-trigger" aria-expanded={activeNavMenu === "ebooks"}>
                    <span>Free eBooks</span>
                    <ChevronDown size={13} />
                  </Link>
                  {activeNavMenu === "ebooks" && (
                    <div className="nu-nav-dropdown" role="menu" aria-label="Free eBooks Submenu">
                      <div className="nu-nav-dropdown-head">Free Textbooks &amp; Guides (87)</div>
                      <Link to="/ebooks" className="nu-nav-dropdown-link" style={{ fontWeight: 700, color: "var(--nu-purple)" }} onClick={() => setActiveNavMenu("")}>
                        <span>Browse All Free Study Books</span>
                        <ChevronRight size={13} />
                      </Link>
                      <Link to="/ebooks/book-instant-clinical-pharmacology" className="nu-nav-dropdown-link" onClick={() => setActiveNavMenu("")}>
                        <span>Instant Clinical Pharmacology</span>
                        <ChevronRight size={13} />
                      </Link>
                      <Link to="/ebooks?cat=Anatomy+%26+Physiology" className="nu-nav-dropdown-link" onClick={() => setActiveNavMenu("")}>
                        <span>Anatomy &amp; Physiology Library</span>
                        <ChevronRight size={13} />
                      </Link>
                      <Link to="/ebooks?cat=Midwifery+%26+Maternal+Health" className="nu-nav-dropdown-link" onClick={() => setActiveNavMenu("")}>
                        <span>Midwifery &amp; Obstetrics</span>
                        <ChevronRight size={13} />
                      </Link>
                      <Link to="/ebooks?cat=Medical-Surgical+Nursing" className="nu-nav-dropdown-link" onClick={() => setActiveNavMenu("")}>
                        <span>Medical-Surgical Nursing</span>
                        <ChevronRight size={13} />
                      </Link>
                      <Link to="/ebooks?cat=Paediatrics+%26+Child+Health" className="nu-nav-dropdown-link" onClick={() => setActiveNavMenu("")}>
                        <span>Paediatrics &amp; Child Health</span>
                        <ChevronRight size={13} />
                      </Link>
                      {hubEbooks.length > 0 && (
                        <>
                          <div className="nu-nav-dropdown-sep" />
                          <div className="nu-nav-dropdown-head">Featured Books</div>
                          {hubEbooks.slice(0, 4).map((b) => (
                            <Link
                              key={b.slug}
                              to={`/ebooks/${b.slug}`}
                              className="nu-nav-dropdown-link"
                              onClick={() => setActiveNavMenu("")}
                            >
                              <span>{b.title}</span>
                              <ChevronRight size={13} />
                            </Link>
                          ))}
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Mock Exams Submenu */}
                <div
                  className="nu-nav-dropdown-wrap nu-nav-desktop-only"
                  onMouseEnter={() => setActiveNavMenu("mock-exams")}
                  onMouseLeave={() => setActiveNavMenu("")}
                >
                  <Link to="/mock-exams" className="nu-nav-link nu-nav-dropdown-trigger" aria-expanded={activeNavMenu === "mock-exams"}>
                    <span>Mock Exams</span>
                    <ChevronDown size={13} />
                  </Link>
                  {activeNavMenu === "mock-exams" && (
                    <div className="nu-nav-dropdown nu-nav-dropdown--right" role="menu" aria-label="Mock Exams Submenu">
                      <div className="nu-nav-dropdown-head">Exam Prep &amp; Simulators</div>
                      <Link to="/mock-exams" className="nu-nav-dropdown-link" style={{ fontWeight: 700, color: "var(--nu-purple)" }} onClick={() => setActiveNavMenu("")}>
                        <span>All UNMEB Mock Exams (109)</span>
                        <ChevronRight size={13} />
                      </Link>
                      <Link to="/nclex-rn/exams" className="nu-nav-dropdown-link" onClick={() => setActiveNavMenu("")}>
                        <span>NextGen NCLEX-RN Mock Suite</span>
                        <ChevronRight size={13} />
                      </Link>
                      <Link to="/quizzes" className="nu-nav-dropdown-link" onClick={() => setActiveNavMenu("")}>
                        <span>Free Topic Quizzes (270 Qs)</span>
                        <ChevronRight size={13} />
                      </Link>
                      {hubExams.length > 0 && (
                        <>
                          <div className="nu-nav-dropdown-sep" />
                          <div className="nu-nav-dropdown-head">Featured Mock Papers</div>
                          {hubExams.slice(0, 5).map((ex) => (
                            <Link
                              key={ex.id}
                              to={`/mock-exams?exam=${encodeURIComponent(ex.id)}`}
                              className="nu-nav-dropdown-link"
                              onClick={() => setActiveNavMenu("")}
                            >
                              <span>{cleanCourseTitle(ex.title)}</span>
                              <ChevronRight size={13} />
                            </Link>
                          ))}
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* NCLEX-RN Submenu (Moved directly to Header; My Learning moved under Account) */}
                <div
                  className="nu-nav-dropdown-wrap nu-nav-desktop-only"
                  onMouseEnter={() => setActiveNavMenu("nclex-rn")}
                  onMouseLeave={() => setActiveNavMenu("")}
                >
                  <Link
                    to="/nclex-rn"
                    className="nu-nav-link nu-nav-dropdown-trigger"
                    style={{ fontWeight: 700, color: "#6d28d9" }}
                    aria-expanded={activeNavMenu === "nclex-rn"}
                  >
                    <span>NCLEX-RN</span>
                    <ChevronDown size={13} />
                  </Link>
                  {activeNavMenu === "nclex-rn" && (
                    <div className="nu-nav-dropdown nu-nav-dropdown--right" role="menu" aria-label="NCLEX-RN Submenu">
                      <div className="nu-nav-dropdown-head">International Licensing Track</div>
                      <Link to="/nclex-rn" className="nu-nav-dropdown-link" style={{ fontWeight: 700, color: "var(--nu-purple)" }} onClick={() => setActiveNavMenu("")}>
                        <span>NCLEX-RN 16-Unit Academy ($99)</span>
                        <ChevronRight size={13} />
                      </Link>
                      <Link to="/nclex-rn/exams" className="nu-nav-dropdown-link" onClick={() => setActiveNavMenu("")}>
                        <span>NextGen CAT Mock Exams (4)</span>
                        <ChevronRight size={13} />
                      </Link>
                      <Link to="/nclex-rn/unit/unit-1-ngn-clinical-judgment-strategies?topic=ngn-cjmm-6-steps" className="nu-nav-dropdown-link" onClick={() => setActiveNavMenu("")}>
                        <span>NGN Clinical Judgment (CJMM)</span>
                        <ChevronRight size={13} />
                      </Link>
                      <div className="nu-nav-dropdown-sep" />
                      <div className="nu-nav-dropdown-head">Country Nursing Hubs</div>
                      <Link to="/nursing-usa" className="nu-nav-dropdown-link" onClick={() => setActiveNavMenu("")}>
                        <span>USA (CGFNS &amp; NCLEX-RN)</span>
                        <ChevronRight size={13} />
                      </Link>
                      <Link to="/nursing-uk" className="nu-nav-dropdown-link" onClick={() => setActiveNavMenu("")}>
                        <span>United Kingdom (NMC CBT &amp; OSCE)</span>
                        <ChevronRight size={13} />
                      </Link>
                      <Link to="/nursing-canada" className="nu-nav-dropdown-link" onClick={() => setActiveNavMenu("")}>
                        <span>Canada (NNAS &amp; REx-PN)</span>
                        <ChevronRight size={13} />
                      </Link>
                      <Link to="/nursing-australia" className="nu-nav-dropdown-link" onClick={() => setActiveNavMenu("")}>
                        <span>Australia (AHPRA OBA)</span>
                        <ChevronRight size={13} />
                      </Link>
                      <Link to="/global-nursing" className="nu-nav-dropdown-link" style={{ fontWeight: 600 }} onClick={() => setActiveNavMenu("")}>
                        <span>All 8 Nursing Countries →</span>
                        <ChevronRight size={13} />
                      </Link>
                    </div>
                  )}
                </div>
              </>
            )}

            <Link to="/cart" className="nu-icon-btn" aria-label="Shopping cart">
              <ShoppingCart size={20} />
              {cart.length > 0 && <span className="nu-cart-badge">{cart.length}</span>}
            </Link>

            {user ? (
              <div
                style={{ position: "relative" }}
                onMouseEnter={() => setUserMenuOpen(true)}
                onMouseLeave={() => setUserMenuOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => setUserMenuOpen((v) => !v)}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "999px",
                    border: 0,
                    background: "var(--nu-ink)",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "0.82rem",
                    cursor: "pointer"
                  }}
                  title={user.name}
                >
                  {user.initials}
                </button>
                {userMenuOpen && (
                  <div
                    style={{
                      position: "absolute",
                      right: 0,
                      top: "100%",
                      paddingTop: 8,
                      zIndex: 95
                    }}
                  >
                    <div
                      style={{
                        width: 245,
                        background: "#fff",
                        border: "1px solid var(--nu-border)",
                        borderTop: "2px solid var(--nu-purple)",
                        borderRadius: "0 0 8px 8px",
                        boxShadow: "var(--nu-shadow-lg)",
                        padding: 12
                      }}
                    >
                      <div style={{ paddingBottom: 10, borderBottom: "1px solid var(--nu-border-light)", marginBottom: 6 }}>
                        <strong style={{ display: "block", fontSize: "0.9rem" }}>{user.name}</strong>
                        <small style={{ color: "var(--nu-ink-muted)" }}>{user.email}</small>
                      </div>
                      <Link
                        to="/my-learning"
                        className="nu-mega-sublink"
                        style={{ fontWeight: 700, color: "var(--nu-purple)", display: "flex", alignItems: "center", justifyContent: "space-between" }}
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <span>
                          <BookOpen size={14} style={{ display: "inline", marginRight: 6 }} />
                          My Learning
                        </span>
                        {enrollments.length > 0 && (
                          <span className="nu-mega-count">{enrollments.length}</span>
                        )}
                      </Link>
                      <Link
                        to="/courses"
                        className="nu-mega-sublink"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <GraduationCap size={14} style={{ display: "inline", marginRight: 6 }} />
                        Enrolled &amp; All Courses
                      </Link>
                      <Link
                        to="/templates"
                        className="nu-mega-sublink"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <FileText size={14} style={{ display: "inline", marginRight: 6 }} />
                        OSCE &amp; Ward Templates
                      </Link>
                      {user.isAdmin && (
                        <Link
                          to="/nodadmin"
                          className="nu-mega-sublink"
                          style={{ color: "var(--nu-purple)", fontWeight: 700 }}
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <Award size={14} style={{ display: "inline", marginRight: 6 }} />
                          Owner Admin Panel
                        </Link>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setUserMenuOpen(false);
                          logout();
                        }}
                        className="nu-mega-sublink"
                        style={{
                          background: "transparent",
                          border: 0,
                          width: "100%",
                          textAlign: "left",
                          color: "var(--nu-danger)"
                        }}
                      >
                        <LogOut size={14} style={{ display: "inline", marginRight: 6 }} />
                        Log out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <div
                  className="nu-nav-dropdown-wrap nu-nav-desktop-only"
                  onMouseEnter={() => setUserMenuOpen(true)}
                  onMouseLeave={() => setUserMenuOpen(false)}
                >
                  <Link to="/login" className="nu-btn nu-btn-outline">
                    Log in
                  </Link>
                  {userMenuOpen && (
                    <div className="nu-nav-dropdown nu-nav-dropdown--right" role="menu" aria-label="Account Menu">
                      <div className="nu-nav-dropdown-head">Account &amp; My Learning</div>
                      <Link to="/my-learning" className="nu-nav-dropdown-link" style={{ fontWeight: 700, color: "var(--nu-purple)" }} onClick={() => setUserMenuOpen(false)}>
                        <span>My Learning {enrollments.length > 0 ? `(${enrollments.length})` : ""}</span>
                        <ChevronRight size={13} />
                      </Link>
                      <Link to="/login" className="nu-nav-dropdown-link" onClick={() => setUserMenuOpen(false)}>
                        <span>Student Sign In / Google</span>
                        <ChevronRight size={13} />
                      </Link>
                      <Link to="/login?mode=signup" className="nu-nav-dropdown-link" onClick={() => setUserMenuOpen(false)}>
                        <span>Create Free Account</span>
                        <ChevronRight size={13} />
                      </Link>
                    </div>
                  )}
                </div>
                <Link to="/login?mode=signup" className="nu-btn nu-btn-dark">
                  Sign up
                </Link>
              </>
            )}

            <button
              type="button"
              className="nu-icon-btn nu-mobile-toggle"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle navigation"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </nav>
        </div>

        {mobileOpen && (
          <div className="nu-mobile-overlay" onClick={() => setMobileOpen(false)}>
            <nav
              className="nu-mobile-drawer"
              aria-label="Mobile navigation"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drawer Header */}
              <div className="nu-mobile-drawer-head">
                <Link to="/" onClick={() => setMobileOpen(false)} style={{ display: "inline-flex", alignItems: "center" }}>
                  <img src={logoSrc} alt="Nursing Uganda" style={{ height: 34, width: "auto", display: "block" }} />
                </Link>
                <button
                  type="button"
                  className="nu-mobile-close-btn"
                  aria-label="Close navigation menu"
                  onClick={() => setMobileOpen(false)}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Account Banner */}
              <div className="nu-mobile-account-box">
                {user ? (
                  <div className="nu-mobile-user-row">
                    <div className="nu-dash-avatar">{user.initials}</div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <strong style={{ display: "block", fontSize: "0.92rem", color: "var(--nu-ink)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {user.name}
                      </strong>
                      <small style={{ display: "block", fontSize: "0.78rem", color: "var(--nu-ink-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {user.email}
                      </small>
                    </div>
                  </div>
                ) : (
                  <div className="nu-mobile-auth-cta">
                    <Link
                      to="/login"
                      className="nu-btn nu-btn-primary"
                      style={{ flex: 1, fontSize: "0.86rem", padding: "9px 12px" }}
                      onClick={() => setMobileOpen(false)}
                    >
                      Log in / Google
                    </Link>
                    <Link
                      to="/login?mode=signup"
                      className="nu-btn nu-btn-outline"
                      style={{ flex: 1, fontSize: "0.86rem", padding: "9px 12px" }}
                      onClick={() => setMobileOpen(false)}
                    >
                      Sign up
                    </Link>
                  </div>
                )}
              </div>

              <div className="nu-mobile-drawer-body">
                {/* Expandable Primary Study Submenus */}
                <div className="nu-mobile-sec-title">Learn &amp; Dashboard</div>
                <div className="nu-mobile-prog-group">
                  <button
                    type="button"
                    className={`nu-mobile-link nu-mobile-prog-btn ${mobileNavExpanded === "my-learning" ? "open" : ""}`}
                    onClick={() => setMobileNavExpanded((v) => (v === "my-learning" ? "" : "my-learning"))}
                    aria-expanded={mobileNavExpanded === "my-learning"}
                  >
                    <span className="nu-mobile-link-left">
                      <BookOpen size={17} color="#A137F2" />
                      <span>My Learning</span>
                    </span>
                    <span className="nu-mega-item-right">
                      {enrollments.length > 0 && <span className="nu-mega-count">{enrollments.length}</span>}
                      <ChevronDown size={15} style={{ transform: mobileNavExpanded === "my-learning" ? "rotate(180deg)" : "none", transition: "transform 0.15s" }} />
                    </span>
                  </button>
                  {mobileNavExpanded === "my-learning" && (
                    <div className="nu-mobile-sublist">
                      <Link to="/my-learning" className="nu-mobile-sublink" onClick={() => setMobileOpen(false)}>My Learning Dashboard</Link>
                      <Link to="/nclex-rn" className="nu-mobile-sublink" onClick={() => setMobileOpen(false)}>NCLEX-RN 16-Unit Academy</Link>
                      <Link to="/templates" className="nu-mobile-sublink" onClick={() => setMobileOpen(false)}>Printable OSCE &amp; Ward PDFs</Link>
                      <Link to="/clinical-tools" className="nu-mobile-sublink" onClick={() => setMobileOpen(false)}>Dosage &amp; Clinical Tools</Link>
                    </div>
                  )}
                </div>
                {user?.isAdmin && (
                  <Link to="/nodadmin" className="nu-mobile-link" style={{ color: "var(--nu-purple)", fontWeight: 700 }} onClick={() => setMobileOpen(false)}>
                    <span className="nu-mobile-link-left">
                      <Award size={17} color="#A137F2" />
                      <span>Owner Admin Panel</span>
                    </span>
                    <ChevronRight size={16} />
                  </Link>
                )}
                <Link to="/courses" className="nu-mobile-link" onClick={() => setMobileOpen(false)}>
                  <span className="nu-mobile-link-left">
                    <GraduationCap size={17} />
                    <span>All Course Units</span>
                  </span>
                  <span className="nu-mega-count">{courses.length || 85}</span>
                </Link>
                <div className="nu-mobile-prog-group">
                  <button
                    type="button"
                    className={`nu-mobile-link nu-mobile-prog-btn ${mobileNavExpanded === "topics" ? "open" : ""}`}
                    onClick={() => setMobileNavExpanded((v) => (v === "topics" ? "" : "topics"))}
                    aria-expanded={mobileNavExpanded === "topics"}
                  >
                    <span className="nu-mobile-link-left">
                      <FileText size={17} color="#0F2942" />
                      <span>Nurse Topics</span>
                    </span>
                    <span className="nu-mega-item-right">
                      <span className="nu-mega-count">779</span>
                      <ChevronDown size={15} style={{ transform: mobileNavExpanded === "topics" ? "rotate(180deg)" : "none", transition: "transform 0.15s" }} />
                    </span>
                  </button>
                  {mobileNavExpanded === "topics" && (
                    <div className="nu-mobile-sublist">
                      {STATIC_HUB_ITEMS.topics.slice(0, 6).map((item) => (
                        <Link key={item.label} to={item.to} className="nu-mobile-sublink" onClick={() => setMobileOpen(false)}>
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
                <div className="nu-mobile-prog-group">
                  <button
                    type="button"
                    className={`nu-mobile-link nu-mobile-prog-btn ${mobileNavExpanded === "ebooks" ? "open" : ""}`}
                    onClick={() => setMobileNavExpanded((v) => (v === "ebooks" ? "" : "ebooks"))}
                    aria-expanded={mobileNavExpanded === "ebooks"}
                  >
                    <span className="nu-mobile-link-left">
                      <BookOpen size={17} color="#065F46" />
                      <span>Free eBooks</span>
                    </span>
                    <span className="nu-mega-item-right">
                      <span className="nu-mega-count">87</span>
                      <ChevronDown size={15} style={{ transform: mobileNavExpanded === "ebooks" ? "rotate(180deg)" : "none", transition: "transform 0.15s" }} />
                    </span>
                  </button>
                  {mobileNavExpanded === "ebooks" && (
                    <div className="nu-mobile-sublist">
                      <Link to="/ebooks" className="nu-mobile-sublink" onClick={() => setMobileOpen(false)}>Browse All Free Books</Link>
                      <Link to="/ebooks/book-instant-clinical-pharmacology" className="nu-mobile-sublink" onClick={() => setMobileOpen(false)}>Instant Clinical Pharmacology</Link>
                      <Link to="/ebooks?cat=Midwifery+%26+Maternal+Health" className="nu-mobile-sublink" onClick={() => setMobileOpen(false)}>Midwifery &amp; Obstetrics Books</Link>
                      <Link to="/ebooks?cat=Medical-Surgical+Nursing" className="nu-mobile-sublink" onClick={() => setMobileOpen(false)}>Medical-Surgical Nursing Books</Link>
                    </div>
                  )}
                </div>
                <div className="nu-mobile-prog-group">
                  <button
                    type="button"
                    className={`nu-mobile-link nu-mobile-prog-btn ${mobileNavExpanded === "mock-exams" ? "open" : ""}`}
                    onClick={() => setMobileNavExpanded((v) => (v === "mock-exams" ? "" : "mock-exams"))}
                    aria-expanded={mobileNavExpanded === "mock-exams"}
                  >
                    <span className="nu-mobile-link-left">
                      <Award size={17} />
                      <span>Mock Exams</span>
                    </span>
                    <span className="nu-mega-item-right">
                      <span className="nu-mega-count">109</span>
                      <ChevronDown size={15} style={{ transform: mobileNavExpanded === "mock-exams" ? "rotate(180deg)" : "none", transition: "transform 0.15s" }} />
                    </span>
                  </button>
                  {mobileNavExpanded === "mock-exams" && (
                    <div className="nu-mobile-sublist">
                      <Link to="/mock-exams" className="nu-mobile-sublink" onClick={() => setMobileOpen(false)}>UNMEB Mock Exams (109 Papers)</Link>
                      <Link to="/nclex-rn/exams" className="nu-mobile-sublink" onClick={() => setMobileOpen(false)}>NextGen NCLEX-RN Mock Suite</Link>
                      <Link to="/quizzes" className="nu-mobile-sublink" onClick={() => setMobileOpen(false)}>Free Topic Quizzes (270 Qs)</Link>
                    </div>
                  )}
                </div>
                <Link to="/cart" className="nu-mobile-link" onClick={() => setMobileOpen(false)}>
                  <span className="nu-mobile-link-left">
                    <ShoppingCart size={17} />
                    <span>Shopping Cart</span>
                  </span>
                  {cart.length > 0 && <span className="nu-mega-count">{cart.length}</span>}
                </Link>

                {/* Expandable Programmes */}
                <div className="nu-mobile-sec-title" style={{ marginTop: 14 }}>
                  Academic Programmes ({programmes.length})
                </div>
                {programmes.map((p) => {
                  const isExp = mobileProgExpanded === p.id;
                  const isMidwifery = p.id.includes("midwifery");
                  const progCourses = courses.filter((c) => c.programmeId === p.id).slice(0, 5);
                  return (
                    <div key={p.id} className="nu-mobile-prog-group">
                      <button
                        type="button"
                        className={`nu-mobile-link nu-mobile-prog-btn ${isExp ? "open" : ""}`}
                        onClick={() => setMobileProgExpanded(isExp ? "" : p.id)}
                        aria-expanded={isExp}
                      >
                        <span className="nu-mobile-link-left">
                          {isMidwifery ? <HeartPulse size={17} color="#A137F2" /> : <GraduationCap size={17} />}
                          <span>{p.label}</span>
                        </span>
                        <span className="nu-mega-item-right">
                          <span className="nu-mega-count">{p.courseCount}</span>
                          <ChevronDown size={15} style={{ transform: isExp ? "rotate(180deg)" : "none", transition: "transform 0.15s" }} />
                        </span>
                      </button>

                      {isExp && (
                        <div className="nu-mobile-sublist">
                          {progCourses.map((c) => (
                            <Link
                              key={c.slug}
                              to={`/course/${c.slug}`}
                              className="nu-mobile-sublink"
                              onClick={() => setMobileOpen(false)}
                            >
                              {cleanCourseTitle(c.title)}
                            </Link>
                          ))}
                          <Link
                            to={`/courses?programme=${encodeURIComponent(p.id)}`}
                            className="nu-mobile-sublink"
                            style={{ color: "var(--nu-purple)", fontWeight: 700 }}
                            onClick={() => setMobileOpen(false)}
                          >
                            View all {p.courseCount} units →
                          </Link>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Clinical Tools & References */}
                <div className="nu-mobile-sec-title" style={{ marginTop: 14 }}>
                  Clinical Tools &amp; Free Quizzes
                </div>
                <Link to="/quizzes" className="nu-mobile-link" onClick={() => setMobileOpen(false)}>
                  <span className="nu-mobile-link-left">
                    <Award size={17} />
                    <span>Free Topic Quizzes (25+ Qs)</span>
                  </span>
                  <ChevronRight size={16} />
                </Link>
                <Link to="/dictionary" className="nu-mobile-link" onClick={() => setMobileOpen(false)}>
                  <span className="nu-mobile-link-left">
                    <FileText size={17} />
                    <span>Medical Dictionary</span>
                  </span>
                  <ChevronRight size={16} />
                </Link>
                <Link to="/instruments" className="nu-mobile-link" onClick={() => setMobileOpen(false)}>
                  <span className="nu-mobile-link-left">
                    <Stethoscope size={17} />
                    <span>Medical Instrument Atlas</span>
                  </span>
                  <ChevronRight size={16} />
                </Link>
                <Link to="/clinical-tools" className="nu-mobile-link" onClick={() => setMobileOpen(false)}>
                  <span className="nu-mobile-link-left">
                    <Wrench size={17} />
                    <span>Dosage &amp; Clinical Tools</span>
                  </span>
                  <ChevronRight size={16} />
                </Link>
              </div>

              {/* Drawer Footer */}
              <div className="nu-mobile-drawer-foot">
                {user ? (
                  <button
                    type="button"
                    className="nu-btn nu-btn-outline"
                    style={{ width: "100%", color: "var(--nu-danger)", borderColor: "#fecaca" }}
                    onClick={() => {
                      setMobileOpen(false);
                      logout();
                    }}
                  >
                    <LogOut size={16} /> Log out
                  </button>
                ) : (
                  <small style={{ color: "var(--nu-ink-muted)", display: "block", textAlign: "center" }}>
                    UNMEB &amp; UNMC Aligned · Nursing Uganda
                  </small>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
