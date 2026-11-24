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
  const [activeProgId, setActiveProgId] = useState("certificate-in-nursing");
  const [activeHubId, setActiveHubId] = useState("");
  const [hubEbooks, setHubEbooks] = useState([]);
  const [hubExams, setHubExams] = useState([]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileProgExpanded, setMobileProgExpanded] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchIndexLoaded, setSearchIndexLoaded] = useState(false);
  const [lessonIndex, setLessonIndex] = useState([]);
  const [dictTerms, setDictTerms] = useState([]);
  const [instrumentList, setInstrumentList] = useState([]);
  const [logoSrc, setLogoSrc] = useState(nuLogoUganda);

  const countryCtx = useMemo(() => getActiveCountryContext(location.pathname), [location.pathname]);

  useEffect(() => {
    if (!megaOpen || hubEbooks.length > 0) return;
    Promise.all([
      fetch("/assets/data/ebooks.json").then((r) => (r.ok ? r.json() : null)),
      fetch("/assets/data/mock-exams.json").then((r) => (r.ok ? r.json() : null))
    ])
      .then(([eb, ex]) => {
        if (eb?.ebooks) setHubEbooks(eb.ebooks);
        if (ex?.exams) setHubExams(ex.exams);
      })
      .catch(() => {});
  }, [megaOpen, hubEbooks.length]);

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

  const activeProg = useMemo(
    () => programmes.find((p) => p.id === activeProgId) || programmes[0],
    [programmes, activeProgId]
  );

  const activeProgAllCourses = useMemo(
    () => courses.filter((c) => c.programmeId === activeProgId),
    [courses, activeProgId]
  );

  const activeHub = useMemo(
    () => FREE_HUBS.find((h) => h.id === activeHubId) || null,
    [activeHubId]
  );

  const activeHubItems = useMemo(() => {
    if (!activeHubId) return [];
    if (activeHubId === "ebooks") {
      return hubEbooks.length
        ? hubEbooks.map((b) => ({ label: b.title, to: `/ebooks/${b.slug}` }))
        : [{ label: "Browse All 8 Free Referenced Study eBooks", to: "/ebooks" }];
    }
    if (activeHubId === "mock-exams") {
      return hubExams.length
        ? hubExams.map((ex) => ({ label: ex.title, to: `/mock-exams?exam=${encodeURIComponent(ex.id)}` }))
        : [{ label: "Launch UNMEB Mock Exam Simulator", to: "/mock-exams" }];
    }
    return STATIC_HUB_ITEMS[activeHubId] || [];
  }, [activeHubId, hubEbooks, hubExams]);

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

          {/* Explore Mega Menu */}
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
            >
              Explore <ChevronDown size={15} />
            </button>

            {megaOpen && (
              <div className="nu-megamenu" role="menu" aria-label="Explore Nursing Curriculum">
                {countryCtx && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 12,
                      padding: "10px 18px",
                      background: countryCtx.meta.heroBg,
                      color: "#ffffff",
                      borderBottom: "1px solid rgba(255,255,255,0.14)"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.84rem", fontWeight: 700 }}>
                      <CountryFlag code={countryCtx.meta.flag} width={18} />
                      <span>{countryCtx.meta.academy} — {countryCtx.meta.examBadge}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <Link
                        to={`${countryCtx.meta.route}?tab=curriculum`}
                        onClick={() => setMegaOpen(false)}
                        style={{ color: "#ffffff", fontSize: "0.78rem", fontWeight: 600, textDecoration: "underline" }}
                      >
                        Full Curriculum
                      </Link>
                      <Link
                        to={`${countryCtx.meta.route}?tab=topics`}
                        onClick={() => setMegaOpen(false)}
                        style={{ color: "#ffffff", fontSize: "0.78rem", fontWeight: 600, textDecoration: "underline" }}
                      >
                        779 Topics
                      </Link>
                      <Link
                        to={`${countryCtx.meta.route}?tab=offers`}
                        onClick={() => setMegaOpen(false)}
                        style={{ color: "#ffffff", fontSize: "0.78rem", fontWeight: 600, textDecoration: "underline" }}
                      >
                        Prep Bundle
                      </Link>
                    </div>
                  </div>
                )}
                <div className="nu-mega-grid nu-mega-grid--simple">
                  {/* Column 1: Programmes & Free Hubs */}
                  <div className="nu-mega-col">
                    <div className="nu-mega-kicker">Academic Programmes ({programmes.length})</div>
                    {programmes.map((p) => {
                      const isMidwifery = p.id.includes("midwifery");
                      const isSelected = !activeHubId && activeProgId === p.id;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          className={`nu-mega-item ${isSelected ? "active" : ""}`}
                          onMouseEnter={() => {
                            setActiveHubId("");
                            setActiveProgId(p.id);
                          }}
                          onFocus={() => {
                            setActiveHubId("");
                            setActiveProgId(p.id);
                          }}
                          onClick={() => {
                            setMegaOpen(false);
                            navigate(`/courses?programme=${encodeURIComponent(p.id)}`);
                          }}
                        >
                          <span className="nu-mega-item-left">
                            {isMidwifery ? <HeartPulse size={15} /> : <GraduationCap size={15} />}
                            <span>{p.label}</span>
                          </span>
                          <ChevronRight size={14} />
                        </button>
                      );
                    })}

                    <div className="nu-mega-divider" />
                    <div className="nu-mega-kicker">Free Study &amp; Clinical Hubs</div>

                    {FREE_HUBS.map((hub) => {
                      const HubIcon = hub.icon;
                      const isSelected = activeHubId === hub.id;
                      return (
                        <button
                          key={hub.id}
                          type="button"
                          className={`nu-mega-item ${isSelected ? "active" : ""}`}
                          onMouseEnter={() => setActiveHubId(hub.id)}
                          onFocus={() => setActiveHubId(hub.id)}
                          onClick={() => {
                            setMegaOpen(false);
                            navigate(hub.to);
                          }}
                        >
                          <span className="nu-mega-item-left">
                            <HubIcon size={15} />
                            <span>{hub.label}</span>
                          </span>
                          <ChevronRight size={14} />
                        </button>
                      );
                    })}
                  </div>

                  {/* Column 2: Clean Stretched One-Line Submenu Topics */}
                  <div className="nu-mega-middle">
                    <div className="nu-mega-middle-head">
                      <h4 className="nu-mega-prog-title">
                        {activeHub ? activeHub.label : activeProg?.label || "Nursing Programme"}
                      </h4>
                      <Link
                        to={activeHub ? activeHub.to : `/courses?programme=${encodeURIComponent(activeProgId)}`}
                        className="nu-mega-view-all"
                        onClick={() => setMegaOpen(false)}
                      >
                        {activeHub ? `Open ${activeHub.label} →` : `View all ${activeProgAllCourses.length} units →`}
                      </Link>
                    </div>

                    <div className="nu-mega-links-cols">
                      {activeHub
                        ? activeHubItems.map((item) => (
                            <Link
                              key={item.label}
                              to={item.to}
                              className="nu-mega-clean-link"
                              onClick={() => setMegaOpen(false)}
                            >
                              <span>{item.label}</span>
                              <ChevronRight size={14} />
                            </Link>
                          ))
                        : activeProgAllCourses.map((c) => (
                            <Link
                              key={c.slug}
                              to={`/course/${c.slug}`}
                              className="nu-mega-clean-link"
                              onClick={() => setMegaOpen(false)}
                            >
                              <span>
                                {c.code ? <strong>{c.code} · </strong> : null}
                                {c.title}
                              </span>
                              <ChevronRight size={14} />
                            </Link>
                          ))}
                    </div>
                  </div>
                </div>

                {/* Compact All-Visible Quick Strip */}
                <div className="nu-mega-footer-bar">
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                    <Link to="/courses" className="nu-mega-footer-chip" onClick={() => setMegaOpen(false)}>All 83 Courses</Link>
                    <Link to="/topics" className="nu-mega-footer-chip" onClick={() => setMegaOpen(false)}>Nurse Topics (779)</Link>
                    <Link to="/ebooks" className="nu-mega-footer-chip" onClick={() => setMegaOpen(false)}>Free eBooks (8)</Link>
                    <Link to="/mock-exams" className="nu-mega-footer-chip" onClick={() => setMegaOpen(false)}>UNMEB Papers (109)</Link>
                    <Link to="/quizzes" className="nu-mega-footer-chip" onClick={() => setMegaOpen(false)}>Topic Quizzes (270 Qs)</Link>
                    <Link to="/dictionary" className="nu-mega-footer-chip" onClick={() => setMegaOpen(false)}>Dictionary (1,079)</Link>
                    <Link to="/instruments" className="nu-mega-footer-chip" onClick={() => setMegaOpen(false)}>Instruments (146)</Link>
                    <Link to="/templates" className="nu-mega-footer-chip" onClick={() => setMegaOpen(false)}>Ward PDFs (8)</Link>
                    <Link to="/global-nursing" className="nu-mega-footer-chip" onClick={() => setMegaOpen(false)}>Global Nursing (8 Countries)</Link>
                  </div>
                </div>
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
                placeholder="Search courses, topics (e.g. digestive), drugs, midwifery..."
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
            <Link to="/topics" className="nu-nav-link nu-nav-desktop-only">
              Nurse Topics
            </Link>
            <Link to="/ebooks" className="nu-nav-link nu-nav-desktop-only">
              Free eBooks
            </Link>
            <Link to="/mock-exams" className="nu-nav-link nu-nav-desktop-only">
              Mock Exams
            </Link>
            <Link to="/my-learning" className="nu-nav-link nu-nav-desktop-only">
              My Learning {enrollments.length > 0 ? `(${enrollments.length})` : ""}
            </Link>

            <Link to="/cart" className="nu-icon-btn" aria-label="Shopping cart">
              <ShoppingCart size={20} />
              {cart.length > 0 && <span className="nu-cart-badge">{cart.length}</span>}
            </Link>

            {user ? (
              <div style={{ position: "relative" }}>
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
                    fontSize: "0.82rem"
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
                      top: 44,
                      width: 230,
                      background: "#fff",
                      border: "1px solid var(--nu-border)",
                      boxShadow: "var(--nu-shadow-lg)",
                      padding: 12,
                      zIndex: 90
                    }}
                  >
                    <div style={{ paddingBottom: 10, borderBottom: "1px solid var(--nu-border-light)" }}>
                      <strong style={{ display: "block", fontSize: "0.9rem" }}>{user.name}</strong>
                      <small style={{ color: "var(--nu-ink-muted)" }}>{user.email}</small>
                    </div>
                    <Link
                      to="/my-learning"
                      className="nu-mega-sublink"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <BookOpen size={14} style={{ display: "inline", marginRight: 6 }} />
                      My Learning
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
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="nu-btn nu-btn-outline nu-nav-desktop-only">
                  Log in
                </Link>
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
                {/* Primary Study Navigation */}
                <div className="nu-mobile-sec-title">Learn &amp; Dashboard</div>
                <Link to="/my-learning" className="nu-mobile-link" onClick={() => setMobileOpen(false)}>
                  <span className="nu-mobile-link-left">
                    <BookOpen size={17} color="#A137F2" />
                    <span>My Learning Dashboard</span>
                  </span>
                  {enrollments.length > 0 && <span className="nu-mega-count">{enrollments.length}</span>}
                </Link>
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
                  <span className="nu-mega-count">{courses.length || 83}</span>
                </Link>
                <Link to="/topics" className="nu-mobile-link" onClick={() => setMobileOpen(false)}>
                  <span className="nu-mobile-link-left">
                    <FileText size={17} color="#0F2942" />
                    <span>Nurse Topics &amp; Notes</span>
                  </span>
                  <span className="nu-mega-count">779</span>
                </Link>
                <Link to="/ebooks" className="nu-mobile-link" onClick={() => setMobileOpen(false)}>
                  <span className="nu-mobile-link-left">
                    <BookOpen size={17} color="#065F46" />
                    <span>Free Referenced eBooks</span>
                  </span>
                  <span className="nu-mega-count">8</span>
                </Link>
                <Link to="/mock-exams" className="nu-mobile-link" onClick={() => setMobileOpen(false)}>
                  <span className="nu-mobile-link-left">
                    <Award size={17} />
                    <span>UNMEB Mock Exams</span>
                  </span>
                  <ChevronRight size={16} />
                </Link>
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
                              {c.code ? <strong>{c.code} · </strong> : null}
                              {c.title}
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
