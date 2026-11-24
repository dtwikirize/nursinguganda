import React, { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Mail } from "lucide-react";
import nuLogoDark from "../../assets/images/brand/nursing-uganda-logo-dark.svg";
import { getActiveCountryContext } from "../utils/countryTheme";
import CountryFlag from "./CountryFlag";

export default function Footer() {
  const location = useLocation();
  const countryCtx = useMemo(() => getActiveCountryContext(location.pathname), [location.pathname]);
  const [subEmail, setSubEmail] = useState("");
  const [subMsg, setSubMsg] = useState("");
  const [subLoading, setSubLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!subEmail.trim()) return;
    setSubLoading(true);
    setSubMsg("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: subEmail.trim(), source: "footer" })
      });
      const data = await res.json();
      if (!res.ok) {
        setSubMsg(data.error || "Please enter a valid email address.");
      } else {
        setSubMsg("Subscribed! Check your inbox for your weekly study digest confirmation.");
        setSubEmail("");
      }
    } catch {
      setSubMsg("Could not subscribe right now. Please try again later.");
    }
    setSubLoading(false);
  };

  return (
    <footer
      className="nu-footer nu-no-print"
      style={
        countryCtx
          ? {
              background: countryCtx.palette.footerBg,
              borderTop: `3px solid ${countryCtx.palette.footerBorder}`
            }
          : undefined
      }
    >
      <div className="nu-container">
        <div className="nu-footer-grid nu-footer-mega">
          {/* Brand Column + Study Digest */}
          <div className="nu-footer-brand">
            <Link to={countryCtx ? countryCtx.meta.route : "/"} style={{ display: "inline-flex", alignItems: "center", gap: 10, textDecoration: "none", marginBottom: 14 }} aria-label="Nursing Uganda Home">
              <img
                src={nuLogoDark}
                alt="Nursing Uganda"
                width="142"
                height="32"
                style={{ height: 32, width: "auto", display: "block" }}
              />
              {countryCtx && (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "3px 9px",
                    borderRadius: 999,
                    background: "rgba(255,255,255,0.12)",
                    color: "#ffffff",
                    fontSize: "0.74rem",
                    fontWeight: 700
                  }}
                >
                  <CountryFlag code={countryCtx.meta.flag} width={15} />
                  {countryCtx.meta.shortName}
                </span>
              )}
            </Link>
            <p style={{ color: "#cbd5e1", fontSize: "0.86rem", lineHeight: 1.55, margin: "0 0 14px", maxWidth: 320 }}>
              {countryCtx
                ? `${countryCtx.meta.academy} — ${countryCtx.meta.examBadge}. Localized clinical study notes, ${countryCtx.meta.unitLabel}, and full curriculum prep.`
                : "Independent nursing and midwifery study platform aligned with Uganda Clinical Guidelines 2023, WHO protocols, UNMEB, and international licensure pathways."}
            </p>
            <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#e2e8f0", marginBottom: 6 }}>
              {countryCtx ? `Weekly ${countryCtx.meta.shortName} Exam & Clinical Digest` : "Weekly UNMEB & Clinical Revision Digest"}
            </div>
            <form onSubmit={handleSubscribe} style={{ display: "flex", gap: 6, maxWidth: 320 }}>
              <input
                type="email"
                required
                value={subEmail}
                onChange={(e) => setSubEmail(e.target.value)}
                placeholder="Enter student email..."
                aria-label="Weekly study digest email"
                style={{ flex: 1, minWidth: 0, height: 38, padding: "0 10px", borderRadius: 6, border: "1px solid rgba(255,255,255,0.25)", background: "rgba(0,0,0,0.35)", color: "#fff", fontSize: "0.83rem" }}
              />
              <button
                type="submit"
                disabled={subLoading}
                className="nu-btn nu-btn-primary"
                style={{
                  height: 38,
                  padding: "0 14px",
                  fontSize: "0.82rem",
                  borderRadius: 6,
                  flexShrink: 0,
                  background: countryCtx ? countryCtx.palette.btnBg : undefined,
                  borderColor: countryCtx ? "rgba(255,255,255,0.28)" : undefined
                }}
              >
                {subLoading ? "..." : "Subscribe"}
              </button>
            </form>
            {subMsg && <small style={{ display: "block", marginTop: 6, color: countryCtx ? countryCtx.palette.footerAccent : "#C084FC" }}>{subMsg}</small>}
          </div>

          {/* Column 1: Programmes & Units (Country-aware) */}
          {countryCtx ? (
            <div>
              <h4>{countryCtx.meta.shortName} Curriculum &amp; Courses</h4>
              <ul>
                <li><Link to={countryCtx.meta.route}>{countryCtx.meta.academy} Overview</Link></li>
                <li><Link to={`${countryCtx.meta.route}?tab=curriculum`}>Full {countryCtx.meta.shortName} Syllabus</Link></li>
                <li><Link to={`${countryCtx.meta.route}?tab=topics`}>779 {countryCtx.meta.shortName} Study Topics</Link></li>
                {(countryCtx.curriculum?.courses || []).map((c) => (
                  <li key={c.id}>
                    <Link to={`${countryCtx.meta.topicsBase}/${c.sampleTopicSlug}`}>{c.title}</Link>
                  </li>
                ))}
                <li><Link to={`${countryCtx.meta.route}?tab=offers`}>Premium {countryCtx.meta.shortName} Prep Pack</Link></li>
              </ul>
            </div>
          ) : (
            <div>
              <h4>Programmes &amp; Units</h4>
              <ul>
                <li><Link to="/courses">All 83 Study Courses</Link></li>
                <li><Link to="/topics">779 Nurse Study Topics</Link></li>
                <li><Link to="/courses?programme=certificate-in-nursing">Certificate in Nursing</Link></li>
                <li><Link to="/courses?programme=diploma-nursing-direct">Diploma in Nursing (Direct)</Link></li>
                <li><Link to="/courses?programme=diploma-nursing-extension">Diploma in Nursing (Extension)</Link></li>
                <li><Link to="/courses?programme=certificate-in-midwifery">Certificate in Midwifery</Link></li>
                <li><Link to="/courses?programme=diploma-in-midwifery-extension">Diploma in Midwifery (Extension)</Link></li>
                <li><Link to="/courses?programme=bachelor-of-nursing-science-top-up">BScN Top-Up Units</Link></li>
              </ul>
            </div>
          )}

          {/* Column 2: Exams & Reference (Country-aware) */}
          {countryCtx ? (
            <div>
              <h4>{countryCtx.meta.shortName} Topics &amp; Tools</h4>
              <ul>
                <li><Link to={`${countryCtx.meta.route}?tab=practice`}>{countryCtx.meta.shortName} Interactive Quiz &amp; Lab Converter</Link></li>
                <li><Link to={`${countryCtx.meta.topicsBase}/dosage-calculations-and-iv-infusion-rates`}>Dosage &amp; IV Calculations</Link></li>
                <li><Link to={`${countryCtx.meta.topicsBase}/fluid-and-electrolyte-balance`}>Fluids &amp; Electrolytes</Link></li>
                <li><Link to={`${countryCtx.meta.topicsBase}/diabetes-mellitus-and-ketoacidosis`}>Diabetes &amp; DKA Management</Link></li>
                <li><Link to={`${countryCtx.meta.topicsBase}/hypertension-and-cardiovascular-care`}>Cardiovascular &amp; Hypertension</Link></li>
                <li><Link to="/clinical-tools?tab=values">SI ↔ US Lab Reference</Link></li>
              </ul>
            </div>
          ) : (
            <div>
              <h4>Exams &amp; Reference</h4>
              <ul>
                <li><Link to="/mock-exams">109 UNMEB &amp; UHPAB Papers</Link></li>
                <li><Link to="/quizzes">Free Mixed Topic Quizzes (270 Qs)</Link></li>
                <li><Link to="/ebooks">8 Free Referenced eBooks (.pdf)</Link></li>
                <li><Link to="/dictionary">A–Z Medical Dictionary (1,079)</Link></li>
                <li><Link to="/dictionary?tab=abbreviations">183 Ward Abbreviations</Link></li>
                <li><Link to="/instruments">Medical Instrument Atlas (146)</Link></li>
              </ul>
            </div>
          )}

          {/* Column 3: Clinical Tools & Global */}
          <div>
            <h4>Clinical &amp; Global Hub</h4>
            <ul>
              <li><Link to="/clinical-tools">IV Drip &amp; Dosage Calculators</Link></li>
              <li><Link to="/clinical-tools?tab=values">Normal Lab Ranges (SI ↔ US)</Link></li>
              <li><Link to="/clinical-tools?tab=checklists">10 Ward Emergency Checklists</Link></li>
              <li><Link to="/templates">8 Ward Chart Templates (.pdf)</Link></li>
              <li><Link to="/global-nursing">Global Nursing Pathways (8)</Link></li>
              <li><Link to="/global-nursing/united-kingdom-nmc">UK NMC (CBT &amp; OSCE)</Link></li>
              <li><Link to="/global-nursing/united-states-nclex">USA (NextGen NCLEX-RN)</Link></li>
            </ul>
          </div>

          {/* Column 4: Policies & Contact */}
          <div>
            <h4>Policies &amp; Support</h4>
            <ul>
              <li><Link to="/about">About Nursing Uganda</Link></li>
              <li><Link to="/editorial-policy">Editorial &amp; Clinical Review</Link></li>
              <li><Link to="/contact">Student Support &amp; Contact</Link></li>
              <li><Link to="/privacy-policy">Privacy &amp; Cookies Policy</Link></li>
              <li><Link to="/terms">Terms &amp; Medical Disclaimer</Link></li>
              <li><Link to="/my-learning">My Learning &amp; Certificates</Link></li>
              <li>
                <a href="mailto:support@nursinguganda.com" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#C084FC", fontWeight: 600 }}>
                  <Mail size={14} /> support@nursinguganda.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="nu-footer-bottom">
          <span>
            © {new Date().getFullYear()} Nursing Uganda (nursinguganda.com). Independent educational revision resource — NOT affiliated with or an official credential from UNMEB, UHPAB, UNMC, or the Ministry of Health Uganda.{" "}
            <Link to="/terms" style={{ color: "#e2e8f0", textDecoration: "underline" }}>Read Medical &amp; Certificate Disclaimers</Link>.
          </span>
          <span>Kampala, Uganda · support@nursinguganda.com</span>
        </div>
      </div>
    </footer>
  );
}
