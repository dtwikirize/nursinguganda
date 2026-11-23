import React from "react";
import { Link, useParams } from "react-router-dom";
import { BookMarked, Mail, ShieldCheck } from "lucide-react";

const PAGES = {
  about: {
    title: "About Nursing Uganda",
    subtitle: "Structured nursing and midwifery education tailored for Uganda and East Africa.",
    sections: [
      {
        heading: "Our Mission",
        body: "Nursing Uganda was created to help Certificate, Diploma, and Bachelor of Nursing & Midwifery students prepare effectively for UNMEB exams, ward clinicals, and lifelong safe patient care."
      },
      {
        heading: "How Our Content Is Built",
        body: "Every course unit, free study eBook, and medical dictionary entry is structured around the official Uganda curriculum and cross-checked against Uganda Clinical Guidelines (MoH), World Health Organization (WHO) manuals, and peer-reviewed open nursing textbooks."
      },
      {
        heading: "Sustainable Freemium Model",
        body: "Foundational courses, free preview lessons, referenced study eBooks, the medical dictionary, and clinical dosage calculators remain free to access. Paid unit enrollments and UNMEB mock exam passes fund continuous clinical updates and platform hosting."
      }
    ]
  },
  "editorial-policy": {
    title: "Editorial & Clinical Review Policy",
    subtitle: "How Nursing Uganda verifies accuracy, citations, and clinical safety.",
    sections: [
      {
        heading: "1. Authoritative Primary Sources",
        body: "Every lesson and eBook chapter includes a visible References block citing primary clinical authorities—including the Uganda Clinical Guidelines 2023 (Ministry of Health Uganda), UNMEB syllabi, UNMC Scope of Practice, WHO Maternal/Newborn/Child Guidelines, Open RN (NCBI Bookshelf), OpenStax Anatomy & Physiology, and standard textbooks."
      },
      {
        heading: "2. Zero Unverified Filler",
        body: "We strip incomplete or placeholder topics rather than publishing thin content. Each published course unit and study eBook undergoes structured syllabus alignment and clarity review."
      },
      {
        heading: "3. Reporting Corrections",
        body: "If you spot a clinical guideline update or dosage discrepancy, please notify our Editorial Desk immediately via the Contact page so our clinical team can review and update the unit."
      }
    ]
  },
  "privacy-policy": {
    title: "Privacy Policy",
    subtitle: "How we protect student data, payments, and privacy on nursinguganda.com.",
    sections: [
      {
        heading: "Information We Collect",
        body: "When you register or enroll, we store your name, email address, programme track, and course completion progress in our Hostinger MySQL database. Optional email addresses submitted on Free eBook downloads are used solely to deliver study updates."
      },
      {
        heading: "Payment Security",
        body: "All paid course and mock exam transactions are processed directly via PayPal. Nursing Uganda never receives or stores your card numbers or PayPal password—only your verified PayPal order reference and enrolled course access."
      },
      {
        heading: "Advertising & Cookies",
        body: "Free educational pages (Free eBooks, Medical Dictionary, Instrument Atlas, and Free Lesson Previews) may display Google AdSense advertisements. Paid course players and checkout screens remain ad-free."
      }
    ]
  },
  terms: {
    title: "Terms of Use & Medical Disclaimer",
    subtitle: "Important educational scope and clinical safety notice.",
    sections: [
      {
        heading: "Educational Use Only (Medical Disclaimer)",
        body: "All notes, eBooks, drug calculators, mock exams, and clinical checklists on Nursing Uganda are designed strictly for nursing and midwifery exam revision and student learning. They do NOT replace clinical supervision, institutional protocols, or licensed prescriber judgment in patient care."
      },
      {
        heading: "Course Enrollment & Refunds",
        body: "Every paid unit includes free preview lessons before purchase. Once a PayPal order is verified, lifetime access to that unit's notes and quizzes is unlocked in your My Learning dashboard."
      }
    ]
  },
  contact: {
    title: "Contact & Clinical Contributor Desk",
    subtitle: "Reach our support, editorial review, or nursing tutor partnership team.",
    sections: [
      {
        heading: "Student Support & Billing Help",
        body: "Need help with a PayPal receipt, course access, or account login? Email support@nursinguganda.com with your registered email and PayPal Order ID."
      },
      {
        heading: "Teach or Review Clinical Content",
        body: "Registered nurses, midwives, and nursing tutors in Uganda interested in authoring mock exams or reviewing clinical units can write to editorial@nursinguganda.com."
      }
    ]
  }
};

export default function TrustPage({ pageKey: propKey }) {
  const params = useParams();
  const key = propKey || params.pageKey || "about";
  const page = PAGES[key] || PAGES.about;

  return (
    <main>
      <section className="nu-cl-hero">
        <div className="nu-container">
          <span className="nu-badge nu-badge-free" style={{ marginBottom: 10 }}>
            <ShieldCheck size={13} style={{ display: "inline", marginRight: 4 }} /> Trust &amp; Transparency
          </span>
          <h1>{page.title}</h1>
          <p className="nu-cl-subtitle">{page.subtitle}</p>
        </div>
      </section>

      <section className="nu-section">
        <div className="nu-container" style={{ maxWidth: 860 }}>
          <div style={{ display: "grid", gap: 22 }}>
            {page.sections.map((sec, idx) => (
              <div key={idx} style={{ border: "1px solid var(--nu-border)", padding: 24, background: "#fff" }}>
                <h2 style={{ margin: "0 0 8px", fontSize: "1.25rem" }}>{sec.heading}</h2>
                <p style={{ margin: 0, lineHeight: 1.7, color: "#2d2f31" }}>{sec.body}</p>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 28, display: "flex", flexWrap: "wrap", gap: 12 }}>
            <Link to="/courses" className="nu-btn nu-btn-primary">
              <BookMarked size={16} /> Browse Courses
            </Link>
            <Link to="/ebooks" className="nu-btn nu-btn-outline">
              Free Referenced eBooks
            </Link>
            <Link to="/contact" className="nu-btn nu-btn-outline">
              <Mail size={16} /> Contact Support
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
