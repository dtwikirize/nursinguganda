import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  LogOut,
  Menu,
  Search,
  ShoppingCart,
  X
} from "lucide-react";
import { useApp } from "../context/AppContext";
import nuLogo from "../../assets/images/brand/nu-variant-3.svg";

export default function Navbar() {
  const { catalog, user, cart, enrollments, logout } = useApp();
  const navigate = useNavigate();

  const [promoVisible, setPromoVisible] = useState(true);
  const [megaOpen, setMegaOpen] = useState(false);
  const [activeProgId, setActiveProgId] = useState("certificate-in-nursing");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  const programmes = catalog?.programmes || [];
  const courses = catalog?.courses || [];

  const activeProgCourses = useMemo(
    () => courses.filter((c) => c.programmeId === activeProgId).slice(0, 7),
    [courses, activeProgId]
  );

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
            <img src={nuLogo} alt="NU" />
            <span className="nu-wordmark-stack">
              <span className="nu-wordmark-top">Nursing</span>
              <span className="nu-wordmark-sub">
                <span className="nu-wordmark-rule" />
                <span className="nu-wordmark-ug">UG</span>
              </span>
            </span>
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
              <div className="nu-megamenu" role="menu">
                <div className="nu-mega-col">
                  {programmes.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      className={`nu-mega-item ${activeProgId === p.id ? "active" : ""}`}
                      onMouseEnter={() => setActiveProgId(p.id)}
                      onClick={() => {
                        setMegaOpen(false);
                        navigate(`/courses?programme=${encodeURIComponent(p.id)}`);
                      }}
                    >
                      <span>{p.label}</span>
                      <ChevronRight size={15} />
                    </button>
                  ))}
                  <div style={{ borderTop: "1px solid var(--nu-border-light)", marginTop: 8, paddingTop: 8 }}>
                    <Link
                      to="/ebooks"
                      className="nu-mega-item"
                      onClick={() => setMegaOpen(false)}
                    >
                      <span>Free Referenced eBooks</span>
                      <ChevronRight size={15} />
                    </Link>
                    <Link
                      to="/dictionary"
                      className="nu-mega-item"
                      onClick={() => setMegaOpen(false)}
                    >
                      <span>Medical Dictionary</span>
                      <ChevronRight size={15} />
                    </Link>
                    <Link
                      to="/clinical-tools"
                      className="nu-mega-item"
                      onClick={() => setMegaOpen(false)}
                    >
                      <span>Clinical Tools &amp; Calculators</span>
                      <ChevronRight size={15} />
                    </Link>
                  </div>
                </div>

                <div className="nu-mega-right">
                  <h4>Featured Course Units</h4>
                  {activeProgCourses.map((c) => (
                    <Link
                      key={c.slug}
                      to={`/course/${c.slug}`}
                      className="nu-mega-sublink"
                      onClick={() => setMegaOpen(false)}
                    >
                      {c.code ? `${c.code} · ` : ""}
                      {c.title}
                    </Link>
                  ))}
                  <Link
                    to={`/courses?programme=${encodeURIComponent(activeProgId)}`}
                    className="nu-mega-sublink"
                    style={{ color: "var(--nu-purple)", fontWeight: 700, marginTop: 8 }}
                    onClick={() => setMegaOpen(false)}
                  >
                    View all units in this programme →
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
          <div
            style={{
              background: "#fff",
              borderTop: "1px solid var(--nu-border-light)",
              padding: "12px 24px 18px",
              display: "grid",
              gap: 10
            }}
          >
            <Link to="/courses" onClick={() => setMobileOpen(false)}>All Courses (95 Units)</Link>
            <Link to="/ebooks" onClick={() => setMobileOpen(false)}>Free Referenced eBooks</Link>
            <Link to="/mock-exams" onClick={() => setMobileOpen(false)}>UNMEB Mock Exams</Link>
            <Link to="/dictionary" onClick={() => setMobileOpen(false)}>Medical Dictionary</Link>
            <Link to="/clinical-tools" onClick={() => setMobileOpen(false)}>Clinical Tools &amp; Calculators</Link>
            <Link to="/instruments" onClick={() => setMobileOpen(false)}>Instrument Atlas</Link>
            <Link to="/my-learning" onClick={() => setMobileOpen(false)}>My Learning</Link>
            {!user && (
              <Link to="/login" onClick={() => setMobileOpen(false)} style={{ color: "var(--nu-purple)", fontWeight: 700 }}>
                Log in / Create Free Account
              </Link>
            )}
          </div>
        )}
      </header>
    </>
  );
}
