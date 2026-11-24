import React, { useState } from "react";
import { Link } from "react-router-dom";
import nuLogoDark from "../../assets/images/brand/nursing-uganda-logo-dark.svg";

export default function Footer() {
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
        setSubMsg(data.error || "Enter a valid email.");
      } else {
        setSubMsg("Subscribed! Check your inbox for confirmation.");
        setSubEmail("");
      }
    } catch {
      setSubMsg("Could not subscribe right now.");
    }
    setSubLoading(false);
  };

  return (
    <footer className="nu-footer nu-no-print">
      <div className="nu-container">
        <div className="nu-footer-grid">
          <div>
            <Link to="/" style={{ display: "inline-block", textDecoration: "none", marginBottom: 14 }} aria-label="Nursing Uganda Home">
              <img
                src={nuLogoDark}
                alt="Nursing Uganda"
                width="180"
                height="42"
                style={{ height: 42, width: "auto", display: "block" }}
              />
            </Link>
            <p style={{ color: "#cbd5e1", fontSize: "0.875rem", margin: "0 0 14px", maxWidth: 320 }}>
              Authoritative nursing and midwifery courses, referenced free study eBooks, and UNMEB exam prep tailored for Ugandan and East African learners.
            </p>
            <form onSubmit={handleSubscribe} style={{ display: "flex", gap: 6, maxWidth: 320 }}>
              <input
                type="email"
                required
                value={subEmail}
                onChange={(e) => setSubEmail(e.target.value)}
                placeholder="Weekly UNMEB digest email..."
                aria-label="Weekly UNMEB digest email"
                style={{ flex: 1, height: 36, padding: "0 10px", borderRadius: 4, border: "1px solid #475569", background: "#2D2F31", color: "#fff", fontSize: "0.82rem" }}
              />
              <button
                type="submit"
                disabled={subLoading}
                className="nu-btn nu-btn-primary"
                style={{ height: 36, padding: "0 12px", fontSize: "0.8rem" }}
              >
                {subLoading ? "..." : "Join"}
              </button>
            </form>
            {subMsg && <small style={{ display: "block", marginTop: 6, color: "#B36AFA" }}>{subMsg}</small>}
          </div>

          <div>
            <h4>Study &amp; Courses</h4>
            <ul>
              <li><Link to="/courses">All Nursing Courses</Link></li>
              <li><Link to="/courses?programme=certificate-in-nursing">Certificate in Nursing</Link></li>
              <li><Link to="/courses?programme=diploma-nursing-direct">Diploma in Nursing</Link></li>
              <li><Link to="/courses?programme=certificate-in-midwifery">Midwifery Programmes</Link></li>
              <li><Link to="/mock-exams">UNMEB Mock Exams</Link></li>
            </ul>
          </div>

          <div>
            <h4>Free Resources</h4>
            <ul>
              <li><Link to="/ebooks">Free Referenced eBooks</Link></li>
              <li><Link to="/quizzes">Free Major Topic Quizzes</Link></li>
              <li><Link to="/dictionary">Medical Dictionary</Link></li>
              <li><Link to="/instruments">Medical Instrument Atlas</Link></li>
              <li><Link to="/clinical-tools">Drug Dosage &amp; Checklists</Link></li>
            </ul>
          </div>

          <div>
            <h4>Trust, Policy &amp; Support</h4>
            <ul>
              <li><Link to="/about">About Nursing Uganda</Link></li>
              <li><Link to="/editorial-policy">Editorial &amp; Clinical Review Policy</Link></li>
              <li><Link to="/contact">Contact &amp; Contributor Desk</Link></li>
              <li><Link to="/privacy-policy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms &amp; Medical Disclaimer</Link></li>
              <li><Link to="/brand-kit">NU Logo &amp; Brand Kit</Link></li>
              <li><a href="mailto:support@nursinguganda.com">support@nursinguganda.com</a></li>
              <li><a href="tel:+256700000000">+256 700 000 000</a></li>
            </ul>
          </div>
        </div>

        <div className="nu-footer-bottom">
          <span>© {new Date().getFullYear()} Nursing Uganda (nursinguganda.com). Independent study platform only — NOT an official UNMEB/UNMC/MoH credential or clinical license. <Link to="/terms" style={{ color: "#e2e8f0", textDecoration: "underline" }}>Read Medical &amp; Certificate Disclaimers</Link>.</span>
          <span>Payments secured by PayPal · Kampala, Uganda</span>
        </div>
      </div>
    </footer>
  );
}
