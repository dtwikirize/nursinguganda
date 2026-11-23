import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import nuLogoUganda from "../../assets/images/brand/nursing-uganda-logo-light.svg";
import nuLogoUg from "../../assets/images/brand/nursing-ug-logo-light.svg";

export default function Navbar() {
  const { catalog, user, cart, enrollments, logout } = useApp();
  const navigate = useNavigate();

  const [promoVisible, setPromoVisible] = useState(true);
  const [megaOpen, setMegaOpen] = useState(false);
  const [activeProgId, setActiveProgId] = useState("certificate-in-nursing");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileProgExpanded, setMobileProgExpanded] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [logoSrc, setLogoSrc] = useState(nuLogoUganda);

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

  const activeProgCourses = useMemo(
    () => activeProgAllCourses.slice(0, 10),
    [activeProgAllCourses]
  );

  const featuredCourse = useMemo(() => {
    if (!activeProgAllCourses.length) return null;
    return (
      activeProgAllCourses.find((c) => c.badge === "Bestseller") ||
      activeProgAllCourses[0]
    );
  }, [activeProgAllCourses]);

  const searchHits = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    return courses
      .filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q) ||
          c.code.toLowerCase().includes(q) ||
          c.programmeLabel.toLowerCase().includes(q)
      )
      .slice(0, 6);
  }, [courses, query]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSearchFocused(false);
    navigate(`/courses?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <>
      {promoVisible && (
        <div className="nu-promo-bar">
          <span>
            <strong>UNMEB Exam Season Ready</strong> — Free Referenced eBooks + Full Course Bundles with instant PayPal access.
          </span>
          <Link to="/ebooks" style={{ textDecoration: "underline", fontWeight: 700, color: "#fff" }}>
            Browse Free eBooks
          </Link>
          <button
            type="button"
            className="nu-promo-close"
            aria-label="Close announcement"
            onClick={() => setPromoVisible(false)}
          >
            <X size={16} />
          </button>
        </div>
      )}

      <header className="nu-header">
        <div className="nu-nav-inner">
          <Link to="/" className="nu-logo" aria-label="Nursing Uganda Home">
            <img src={logoSrc} alt="Nursing Uganda" className="nu-logo-img" />
          </Link>

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
              <div className="nu-megamenu" role="menu" aria-label="Explore Nursing Uganda Curriculum">
                <div className="nu-mega-grid">
                  {/* Column 1: Programmes & Free Hubs */}
                  <div className="nu-mega-col">
                    <div className="nu-mega-kicker">Academic Programmes ({programmes.length})</div>
                    {programmes.map((p) => {
                      const isMidwifery = p.id.includes("midwifery");
                      return (
                        <button
                          key={p.id}
                          type="button"
                          className={`nu-mega-item ${activeProgId === p.id ? "active" : ""}`}
                          onMouseEnter={() => setActiveProgId(p.id)}
                          onFocus={() => setActiveProgId(p.id)}
                          onClick={() => {
                            setMegaOpen(false);
                            navigate(`/courses?programme=${encodeURIComponent(p.id)}`);
                          }}
                        >
                          <span className="nu-mega-item-left">
                            {isMidwifery ? <HeartPulse size={15} /> : <GraduationCap size={15} />}
                            <span>{p.label}</span>
                          </span>
                          <span className="nu-mega-item-right">
                            <span className="nu-mega-count">{p.courseCount}</span>
                            <ChevronRight size={14} />
                          </span>
                        </button>
                      );
                    })}

                    <div className="nu-mega-divider" />
                    <div className="nu-mega-kicker">Free Study &amp; Clinical Hubs</div>

                    <Link to="/ebooks" className="nu-mega-item" onClick={() => setMegaOpen(false)}>
                      <span className="nu-mega-item-left">
                        <BookOpen size={15} />
                        <span>Free Referenced eBooks</span>
                      </span>
                      <ChevronRight size={14} />
                    </Link>
                    <Link to="/mock-exams" className="nu-mega-item" onClick={() => setMegaOpen(false)}>
                      <span className="nu-mega-item-left">
                        <Award size={15} />
                        <span>UNMEB Mock Exams</span>
                      </span>
                      <ChevronRight size={14} />
                    </Link>
                    <Link to="/dictionary" className="nu-mega-item" onClick={() => setMegaOpen(false)}>
                      <span className="nu-mega-item-left">
                        <FileText size={15} />
                        <span>Medical Dictionary</span>
                      </span>
                      <ChevronRight size={14} />
                    </Link>
                    <Link to="/instruments" className="nu-mega-item" onClick={() => setMegaOpen(false)}>
                      <span className="nu-mega-item-left">
                        <Stethoscope size={15} />
                        <span>Instrument Atlas</span>
                      </span>
                      <ChevronRight size={14} />
                    </Link>
                    <Link to="/clinical-tools" className="nu-mega-item" onClick={() => setMegaOpen(false)}>
                      <span className="nu-mega-item-left">
                        <Wrench size={15} />
                        <span>Clinical Tools &amp; Dosages</span>
                      </span>
                      <ChevronRight size={14} />
                    </Link>
                  </div>

                  {/* Column 2: Stretched 2-Column Course Units Grid */}
                  <div className="nu-mega-middle">
                    <div className="nu-mega-middle-head">
                      <div>
                        <div className="nu-mega-kicker" style={{ padding: 0, marginBottom: 2 }}>
                          Programme Syllabus
                        </div>
                        <h4 className="nu-mega-prog-title">
                          {activeProg?.label || "Nursing Programme"}
                        </h4>
                      </div>
                      <Link
                        to={`/courses?programme=${encodeURIComponent(activeProgId)}`}
                        className="nu-mega-view-all"
                        onClick={() => setMegaOpen(false)}
                      >
                        View all {activeProgAllCourses.length} units →
                      </Link>
                    </div>

                    <div className="nu-mega-units-grid">
                      {activeProgCourses.map((c) => (
                        <Link
                          key={c.slug}
                          to={`/course/${c.slug}`}
                          className="nu-mega-unit-card"
                          onClick={() => setMegaOpen(false)}
                        >
                          <div className="nu-mega-unit-top">
                            {c.code && <span className="nu-mega-code">{c.code}</span>}
                            {c.isFree ? (
                              <span className="nu-mega-pill nu-mega-pill--free">Free</span>
                            ) : c.badge === "Bestseller" ? (
                              <span className="nu-mega-pill nu-mega-pill--best">Bestseller</span>
                            ) : null}
                          </div>
                          <div className="nu-mega-unit-title">{c.title}</div>
                          <div className="nu-mega-unit-meta">
                            <span>{c.lessonCount} lessons</span>
                            <span>·</span>
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 3, color: "var(--nu-star)" }}>
                              <Star size={11} fill="currentColor" /> {c.rating?.toFixed(1) || "4.8"}
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Column 3: Spotlight & High-Yield Prep */}
                  <div className="nu-mega-spotlight">
                    <div className="nu-mega-kicker" style={{ padding: 0, marginBottom: 10 }}>
                      Featured Unit &amp; Prep
                    </div>

                    {featuredCourse && (
                      <Link
                        to={`/course/${featuredCourse.slug}`}
                        className="nu-mega-feature-card"
                        onClick={() => setMegaOpen(false)}
                      >
                        {featuredCourse.thumbnail && (
                          <img
                            src={featuredCourse.thumbnail}
                            alt={featuredCourse.title}
                            className="nu-mega-feature-thumb"
                          />
                        )}
                        <div className="nu-mega-feature-body">
                          <span className="nu-mega-feature-badge">
                            <Sparkles size={11} /> {featuredCourse.badge || "Top Unit"}
                          </span>
                          <strong>{featuredCourse.title}</strong>
                          <small>
                            {featuredCourse.lessonCount} lessons · ★ {featuredCourse.rating?.toFixed(1) || "4.8"} (
                            {featuredCourse.reviewCount || 120})
                          </small>
                        </div>
                      </Link>
                    )}

                    <div className="nu-mega-quick-cards">
                      <Link
                        to="/mock-exams"
                        className="nu-mega-quick-card"
                        onClick={() => setMegaOpen(false)}
                      >
                        <Award size={18} color="#A137F2" />
                        <div>
                          <strong>UNMEB Mock Exam Simulator</strong>
                          <small>Timed MCQs with clinical rationales</small>
                        </div>
                      </Link>
                      <Link
                        to="/ebooks"
                        className="nu-mega-quick-card"
                        onClick={() => setMegaOpen(false)}
                      >
                        <BookOpen size={18} color="#065F46" />
                        <div>
                          <strong>8 Free Referenced eBooks</strong>
                          <small>WHO &amp; Uganda MoH 2023 cited PDFs</small>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Bottom Full-Width Strip */}
                <div className="nu-mega-footer">
                  <span>
                    <strong>Nursing Uganda Curriculum</strong> — 95 Course Units · 819 Structured Lessons · UNMEB &amp; UNMC Aligned
                  </span>
                  <Link
                    to="/courses"
                    className="nu-mega-footer-cta"
                    onClick={() => setMegaOpen(false)}
                  >
                    Explore Complete Catalog →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Search Pill */}
          <form className="nu-search-form" onSubmit={handleSearchSubmit}>
            <div className="nu-search-box">
              <Search size={18} color="#6a6f73" />
              <input
                type="search"
                value={query}
                placeholder="Search nursing courses, drugs, anatomy, midwifery..."
                aria-label="Search courses"
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 180)}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            {searchFocused && searchHits.length > 0 && (
              <div className="nu-search-dropdown">
                {searchHits.map((hit) => (
                  <Link
                    key={hit.slug}
                    to={`/course/${hit.slug}`}
                    className="nu-search-hit"
                    onMouseDown={() => navigate(`/course/${hit.slug}`)}
                  >
                    <div>
                      <strong>{hit.title}</strong>
                      <small>
                        {hit.programmeLabel} · {hit.lessonCount} lessons
                      </small>
                    </div>
                    <span style={{ fontWeight: 700, fontSize: "0.82rem" }}>
                      {hit.isFree ? "Free" : `$${hit.priceUsd.toFixed(2)}`}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </form>

          <nav className="nu-nav-actions">
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
                        to="/admin"
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
                  <Link to="/admin" className="nu-mobile-link" style={{ color: "var(--nu-purple)", fontWeight: 700 }} onClick={() => setMobileOpen(false)}>
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
                  <span className="nu-mega-count">{courses.length || 95}</span>
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
                  Clinical Tools &amp; References
                </div>
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
                <Link to="/brand-kit" className="nu-mobile-link" onClick={() => setMobileOpen(false)}>
                  <span className="nu-mobile-link-left">
                    <Sparkles size={17} />
                    <span>NU BrandKit</span>
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
