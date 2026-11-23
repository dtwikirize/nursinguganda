import React from "react";
import { Link, useParams } from "react-router-dom";
import { BookMarked, Mail, ShieldAlert, ShieldCheck } from "lucide-react";

const LAST_UPDATED = "November 24, 2026";

const PAGES = {
  about: {
    title: "About Nursing Uganda",
    subtitle: "Structured supplementary nursing and midwifery education tailored for Ugandan and East African learners.",
    effectiveDate: LAST_UPDATED,
    sections: [
      {
        heading: "1. Our Educational Mission",
        body: "Nursing Uganda (nursinguganda.com) provides structured revision notes, visual instrument atlases, self-assessment quizzes, referenced eBooks, and UNMEB-aligned study modules to support Certificate, Diploma, and Bachelor of Nursing and Midwifery students in preparing for institutional exams and lifelong patient safety."
      },
      {
        heading: "2. Independent Platform Notice (Non-Affiliation)",
        body: "Nursing Uganda is an independent educational technology platform. We are NOT an examining body, degree-granting institution, or statutory regulator, and are not officially endorsed by or affiliated with the Uganda Nurses and Midwives Examinations Board (UNMEB), the Uganda Nurses and Midwives Council (UNMC), the Ministry of Health Uganda (MoH), or the National Council for Higher Education (NCHE)."
      },
      {
        heading: "3. Evidence-Based Curriculum Structure",
        body: "Every course unit, free study eBook, and medical dictionary entry is organized around published syllabi and cross-checked against Uganda Clinical Guidelines (MoH 2023), World Health Organization (WHO) maternal/child manuals, OpenStax Anatomy & Physiology, and Open RN clinical textbooks."
      },
      {
        heading: "4. Sustainable Freemium Access Model",
        body: "Foundational courses, free preview sessions, 270+ free major topic quizzes, 8 referenced study eBooks, the medical dictionary, the 146-plate instrument atlas, and clinical dosage calculators remain free to access. Paid course units and UNMEB mock exam passes fund ongoing authoring, hosting, and security operations."
      }
    ]
  },
  "editorial-policy": {
    title: "Editorial & Clinical Guideline Policy",
    subtitle: "How Nursing Uganda verifies accuracy, handles national clinical guidelines, and separates revision aid from bedside authority.",
    effectiveDate: LAST_UPDATED,
    sections: [
      {
        heading: "1. Authoritative Primary Clinical Sources",
        body: "Study materials cite recognized reference authorities including the Uganda Clinical Guidelines 2023 (Ministry of Health Uganda), UNMEB curriculum syllabi, UNMC Scope of Practice, WHO Maternal/Newborn/Child Care Guidelines, Open RN (NCBI Bookshelf), OpenStax, and peer-reviewed pharmacology texts. All cited trademarks and guidelines remain the property of their respective authorities."
      },
      {
        heading: "2. Hierarchy of National Clinical Guidelines",
        body: "Where any discrepancy exists between Nursing Uganda educational summaries and official Ministry of Health Uganda treatment protocols, Uganda National Drug Authority (NDA) bulletins, or your employing hospital's standard operating procedures, official national guidelines and direct prescriber orders ALWAYS take precedence."
      },
      {
        heading: "3. Editorial Independence & Zero Unverified Filler",
        body: "Placeholder or incomplete study stubs are stripped prior to publication. Custom anatomical diagrams, clinical tables, and assessment banks undergo syllabus alignment checks to support clear student comprehension without substituting for accredited classroom lectures or supervised ward practicums."
      },
      {
        heading: "4. Corrections, Updates & Pharmacovigilance Reporting",
        body: "Clinical medicine evolves rapidly. Because drug regimens, paediatric weight bands, and national immunization or obstetric protocols change over time, Nursing Uganda does not guarantee real-time alignment after external guideline revisions. Please report any discrepancy immediately to editorial@nursinguganda.com so our review desk can investigate and issue corrections promptly."
      }
    ]
  },
  "privacy-policy": {
    title: "Privacy Policy & Data Protection Notice",
    subtitle: "How nursinguganda.com collects, secures, retains, and protects your personal data under the Uganda Data Protection and Privacy Act, 2019 and international standards.",
    effectiveDate: LAST_UPDATED,
    sections: [
      {
        heading: "1. Data Controller & Contact Information",
        body: "Nursing Uganda operates the educational web application at https://nursinguganda.com. For privacy requests, data exports, or account deletion inquiries under the Uganda Data Protection and Privacy Act (2019), contact support@nursinguganda.com with the subject line 'Privacy Request'."
      },
      {
        heading: "2. Categories of Personal Data We Collect",
        body: "We collect only information strictly necessary to deliver your learning experience: (a) Account Identity Data: full name, email address, programme track, hashed credentials (bcrypt/scrypt), or Google OAuth verified subject identifier; (b) Academic Activity Data: course enrollments, completed lesson checkpoints, saved personal notes, free/course quiz scores, evaluation attempt counts (max 4), and issued Certificate of Study Completion codes; (c) Payment Transaction References: PayPal order ID, verified payer email, USD amount, and unlocked units (we NEVER collect or store full credit/debit card numbers or PayPal passwords); (d) Security & Anti-Abuse Logs: IP address summaries, timestamped login/security events, rate-limit counters, and privacy-hashed first-party page visit metrics."
      },
      {
        heading: "3. How We Use & Email Your Data (Lawful Basis)",
        body: "Your data is processed to: (i) authenticate your session securely via HttpOnly, SameSite=Lax, Secure cookies; (ii) grade assessments and automatically email your quiz breakdowns and Certificate of Completion notifications; (iii) send essential security alerts and OTP verification codes; and (iv) deliver optional weekly UNMEB study digests (with 1-click unsubscribe links on every digest)."
      },
      {
        heading: "4. Cookies, Local Storage & Google AdSense Advertising",
        body: "Nursing Uganda uses strictly necessary authentication session cookies and browser localStorage (shopping cart and offline draft lesson notes). Free educational resources (Free eBooks, Medical Dictionary, Instrument Atlas, Clinical Tools, and Free Previews) may display Google AdSense advertisements. Google and third-party vendors may use cookies to serve relevant ads; you may manage personalized ad preferences at Google Ad Settings. Paid course player lessons, /login, /cart, /checkout, and /admin remain strictly ad-free."
      },
      {
        heading: "5. Third-Party Service Providers & Data Transfers",
        body: "To run reliable infrastructure, data is processed strictly through trusted service providers: Hostinger (application & MySQL database hosting and transactional SMTP delivery), PayPal (payment authorization and capture verification), Google Identity Services (optional single sign-on), and Google AdSense (ad delivery on free resource hubs only). We never sell, rent, or trade student email lists to data brokers or marketers."
      },
      {
        heading: "6. Data Retention & Your Statutory Rights",
        body: "Account profiles, quiz records, and issued certificate verification hashes are retained while your account remains active so certificates stay verifiable. Security event logs rotate automatically on periodic maintenance cycles. You have the right to request access to, correction of, export of, or permanent deletion of your personal data by emailing support@nursinguganda.com from your registered email address."
      }
    ]
  },
  terms: {
    title: "Terms of Service, Medical Disclaimer & Certificate Policy",
    subtitle: "Binding legal terms governing account use, medical limitations, assessment rules, intellectual property, refunds, and Certificates of Completion.",
    effectiveDate: LAST_UPDATED,
    sections: [
      {
        heading: "1. Acceptance of Terms & Eligibility",
        body: "By creating an account, enrolling in free or paid units, using clinical calculators, or attempting quizzes on Nursing Uganda (nursinguganda.com), you agree to these Terms of Service and our Privacy Policy. Learners under 18 years of age must use the platform with parental, guardian, or training-institution supervision."
      },
      {
        heading: "2. Strict Medical & Clinical Disclaimer (Non-Collision Notice)",
        body: "ALL NOTES, ILLUSTRATIONS, EBOOKS, INSTRUMENT PLATES, DRUG DOSAGE CALCULATORS, QUIZZES, AND MOCK EXAMS ON NURSING UGANDA ARE STRICTLY SUPPLEMENTARY EDUCATIONAL AIDS. Nothing on this site constitutes medical advice, diagnosis, prescription, or authorization to treat patients. Users remain solely responsible for independently verifying drug dosages, contraindications, fluid rates, and interventions against official Ministry of Health Uganda Clinical Guidelines, facility protocols, and licensed physician/preceptor orders prior to any clinical action. TO THE FULLEST EXTENT PERMITTED BY LAW, NURSING UGANDA DISCLAIMS ALL LIABILITY FOR CLINICAL DECISIONS OR PATIENT OUTCOMES."
      },
      {
        heading: "3. Certificate of Study Completion Limitations",
        body: "Upon achieving >= 60% in a course's 30-question Final Evaluation (within the maximum permitted 4 attempts), Nursing Uganda issues a digital 'Certificate of Study Completion' carrying a unique verification code. THIS CERTIFICATE ATTESTS SOLELY TO SELF-PACED PLATFORM REVISION AND DOES NOT CONFER ANY ACADEMIC CREDIT, DEGREE, DIPLOMA, UNMEB TRANSCRIPT, UNMC REGISTRATION, CONTINUING PROFESSIONAL DEVELOPMENT (CPD) ACCREDITATION, OR LEGAL LICENSE TO PRACTICE NURSING OR MIDWIFERY."
      },
      {
        heading: "4. Quizzes, Final Evaluations & Academic Integrity",
        body: "Free major topic quizzes require mandatory learner sign-in so scores can be logged and emailed automatically. Course Final Evaluations enforce a 60% passmark and a strict cap of 4 attempts per course unit. Learners must not share accounts, scrape or automate evaluation submissions, reproduce commercial question banks publicly, or misrepresent completion badges or certificates as statutory credentials."
      },
      {
        heading: "5. Intellectual Property & Authorized Personal License",
        body: "Original Nursing Uganda lesson texts, page layouts, custom SVG/WebP anatomical illustrations, upgraded instrument plates, and code are protected by copyright. Enrollment grants a non-exclusive, non-transferable, single-user personal license for private exam preparation. Republishing, reselling, scraping, or bulk redistribution for commercial coaching centres without written consent is prohibited."
      },
      {
        heading: "6. Payments, Access & Refund Policy",
        body: "Every paid unit displays a clear syllabus and offers free preview lessons or free topic materials before checkout. Payments are verified server-side via PayPal. Once digital access is unlocked, purchases grant ongoing dashboard access to that unit's content. Duplicate charges or technical billing errors reported to support@nursinguganda.com within 7 days of transaction (with your PayPal Order ID) are reviewed promptly for full resolution or refund."
      },
      {
        heading: "7. Account Security, Suspension & Limitation of Liability",
        body: "You are responsible for maintaining password confidentiality and reporting unauthorized access immediately. Nursing Uganda may suspend accounts involved in brute-force attacks, fraudulent chargebacks, scraping, or credential forgery. Platform services are provided 'AS IS' and 'AS AVAILABLE'; aggregate liability for any claim arising out of paid platform access shall not exceed the USD amount actually paid by you for the disputed course unit."
      },
      {
        heading: "8. Governing Law & Dispute Resolution",
        body: "These Terms of Service are governed by and construed in accordance with the laws of the Republic of Uganda, without regard to conflict-of-law principles. Any disputes that cannot be resolved amicably through support@nursinguganda.com shall be subject to the competent courts of Kampala, Uganda."
      }
    ]
  },
  contact: {
    title: "Contact, Support & Legal Compliance Desk",
    subtitle: "Reach student billing support, clinical reviewers, or our data protection desk.",
    effectiveDate: LAST_UPDATED,
    sections: [
      {
        heading: "1. Student Support, Billing & Certificate Inquiries",
        body: "Need help with a PayPal receipt, course access, password reset, evaluation attempt reset, or certificate verification? Email support@nursinguganda.com with your registered email address and PayPal Order ID or Certificate ID."
      },
      {
        heading: "2. Clinical Content Review & Corrections Desk",
        body: "Registered nurses, midwives, pharmacists, and UNMEB tutors who spot a clinical guideline update or wish to collaborate on peer review or mock exam authoring can write to editorial@nursinguganda.com."
      },
      {
        heading: "3. Privacy, DMCA / Copyright & Legal Notices",
        body: "Submit statutory data rights requests (under Uganda Data Protection and Privacy Act 2019), trademark inquiries, or takedown requests to support@nursinguganda.com with full supporting documentation."
      }
    ]
  }
};

const LEGAL_TABS = [
  { key: "terms", label: "Terms & Medical Disclaimer", to: "/terms" },
  { key: "privacy-policy", label: "Privacy & Cookies Policy", to: "/privacy-policy" },
  { key: "editorial-policy", label: "Editorial & Guideline Policy", to: "/editorial-policy" },
  { key: "about", label: "About & Non-Affiliation", to: "/about" },
  { key: "contact", label: "Contact & Legal Desk", to: "/contact" }
];

export default function TrustPage({ pageKey: propKey }) {
  const params = useParams();
  const key = propKey || params.pageKey || "about";
  const page = PAGES[key] || PAGES.about;

  return (
    <main>
      <section className="nu-cl-hero">
        <div className="nu-container">
          <span className="nu-badge nu-badge-free" style={{ marginBottom: 10 }}>
            <ShieldCheck size={13} style={{ display: "inline", marginRight: 4 }} /> Legal, Policy &amp; Clinical Governance &middot; Updated {page.effectiveDate}
          </span>
          <h1>{page.title}</h1>
          <p className="nu-cl-subtitle" style={{ maxWidth: 820 }}>{page.subtitle}</p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 18 }}>
            {LEGAL_TABS.map((t) => (
              <Link
                key={t.key}
                to={t.to}
                className={`nu-btn ${t.key === key ? "nu-btn-dark" : "nu-btn-outline"}`}
                style={{ height: 34, padding: "0 12px", fontSize: "0.82rem" }}
              >
                {t.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="nu-section">
        <div className="nu-container" style={{ maxWidth: 880 }}>
          <div
            style={{
              background: "#FEFCE8",
              border: "1px solid #FDE047",
              borderRadius: 6,
              padding: "14px 18px",
              marginBottom: 22,
              display: "flex",
              gap: 12,
              alignItems: "flex-start",
              fontSize: "0.88rem",
              color: "#713F12"
            }}
          >
            <ShieldAlert size={18} style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <strong>Clinical Safety &amp; Statutory Notice:</strong> Nursing Uganda is an independent study revision tool. It does not substitute for Ministry of Health Uganda Clinical Guidelines, institutional SOPs, or UNMC registration/licensure. Certificates reflect platform study completion only.
            </div>
          </div>

          <div style={{ display: "grid", gap: 20 }}>
            {page.sections.map((sec, idx) => (
              <div key={idx} style={{ border: "1px solid var(--nu-border)", borderRadius: 6, padding: 24, background: "#fff" }}>
                <h2 style={{ margin: "0 0 10px", fontSize: "1.18rem", color: "#1C1D1F" }}>{sec.heading}</h2>
                <p style={{ margin: 0, lineHeight: 1.72, color: "#2d2f31", fontSize: "0.96rem" }}>{sec.body}</p>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 28, display: "flex", flexWrap: "wrap", gap: 12 }}>
            <Link to="/courses" className="nu-btn nu-btn-primary">
              <BookMarked size={16} /> Browse Courses
            </Link>
            <Link to="/quizzes" className="nu-btn nu-btn-outline">
              Free Topic Quizzes
            </Link>
            <Link to="/contact" className="nu-btn nu-btn-outline">
              <Mail size={16} /> Contact Support &amp; Legal Desk
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
