import React from "react";
import { Link } from "react-router-dom";
import nuLogoDark from "../../assets/images/brand/nursing-uganda-logo-dark.svg";

export default function Footer() {
  return (
    <footer className="nu-footer nu-no-print">
      <div className="nu-container">
        <div className="nu-footer-grid">
          <div>
            <Link to="/" style={{ display: "inline-block", textDecoration: "none", marginBottom: 14 }} aria-label="Nursing Uganda Home">
              <img
                src={nuLogoDark}
                alt="Nursing Uganda"
                style={{ height: 42, width: "auto", display: "block" }}
              />
            </Link>
            <p style={{ color: "#cbd5e1", fontSize: "0.875rem", margin: 0, maxWidth: 320 }}>
              Authoritative nursing and midwifery courses, referenced free study eBooks, and UNMEB exam prep tailored for Ugandan and East African learners.
            </p>
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
            </ul>
          </div>
        </div>

        <div className="nu-footer-bottom">
          <span>© {new Date().getFullYear()} Nursing Uganda (nursinguganda.com). Educational content reviewed against WHO &amp; Uganda MoH guidelines.</span>
          <span>Payments secured by PayPal · Kampala, Uganda</span>
        </div>
      </div>
    </footer>
  );
}
