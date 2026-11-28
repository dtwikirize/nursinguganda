import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import { COURSE_COUNT } from "../data/siteCounts";

const SITE_URL = "https://nursinguganda.com";
const DEFAULT_IMAGE = `${SITE_URL}/assets/images/udemy/hero-banner.webp`;

const ROUTE_META = {
  "/": {
    title: "Nursing Uganda | NCLEX-RN, UNMEB & UHPAB Past Papers, Courses & Free eBooks",
    description:
      "NCLEX-RN Academy plus Certificate, Diploma & BScN nursing and midwifery in Uganda — 85 courses, 109 UHPAB/UNMEB past papers with Dark Navy PDF answers, 87 free eBooks, 1,079+ medical terms & OSCE tools.",
    type: "website"
  },
  "/courses": {
    title: `All ${COURSE_COUNT} Nursing & Midwifery Courses (Certificate, Diploma & BScN) | Nursing Uganda`,
    description: `Browse all ${COURSE_COUNT} structured Ugandan nursing and midwifery course units covering Anatomy, Pharmacology, Medical-Surgical Nursing, Midwifery, Paediatrics, and Community Health.`
  },
  "/topics": {
    title: "779 Nurse Topics & Clinical Study Notes (Anatomy to Midwifery) | Nursing Uganda",
    description:
      "Browse 779 structured nursing & midwifery study topics by clinical specialty or keyword with Uganda Clinical Guidelines 2023 & WHO references."
  },
  "/mock-exams": {
    title: "109 UNMEB & UHPAB Past Papers Archive (Dark Navy Answers & Free PDF) | Nursing Uganda",
    description:
      "Practice 109 UHPAB and UNMEB past papers (2019–2025) featuring Section A MCQs, Section B Short Essays, and Section C Clinical Scenarios with Dark Navy marking guides and direct binary PDF downloads."
  },
  "/ebooks": {
    title: "Free Referenced Nursing & Midwifery Study eBooks (Direct PDF) | Nursing Uganda",
    description:
      "Download 8 free peer-reviewed nursing and midwifery PDF study eBooks citing Uganda Clinical Guidelines 2023, WHO protocols, OpenStax, and Open RN textbooks."
  },
  "/quizzes": {
    title: "Free Nursing & Midwifery Topic Quizzes (270 Mixed Qs) | Nursing Uganda",
    description:
      "Test your UNMEB readiness with 10 randomized mixed-format topic quizzes across Anatomy, Pharmacology, Midwifery, Med-Surg, Paediatrics, and Emergency Care."
  },
  "/dictionary": {
    title: "1,079+ A-Z Nursing & Medical Dictionary + 183 Ward Abbreviations | Nursing Uganda",
    description:
      "Search 1,079 clinical definitions, pronunciations, nursing priorities, exam mnemonics, and 183 hospital ward abbreviations tailored for Ugandan nurses and global students."
  },
  "/medical-images": {
    title: "Medical Images Dictionary & Visual Anatomy Atlas | Nursing Uganda",
    description:
      "Browse categorized high-resolution human anatomy plates, cellular biology diagrams, and clinical pathology visuals with labeled landmarks and study pearls."
  },
  "/instruments": {
    title: "146-Item Medical & Surgical Instrument Atlas (OSCE Guide & IPC) | Nursing Uganda",
    description:
      "Visual clinical guide to 146 medical, surgical, obstetric, and diagnostic instruments with indications, steam autoclaving standards, and UNMEB OSCE inspection points."
  },
  "/clinical-tools": {
    title: "Nursing IV Drip Rate Calculator, Paediatric Dosages & Normal Lab Ranges | Nursing Uganda",
    description:
      "Ward-ready clinical nursing calculators for IV drops/min, weight-based paediatric doses, APGAR & GCS scores, SI ↔ US lab units, and downloadable ward PDF templates."
  },
  "/templates": {
    title: "8 Printable Nursing Ward Charts, Care Plan, Partograph & MAR PDF Templates | Nursing Uganda",
    description:
      "Download direct PDF nursing templates: NANDA-I Care Plan worksheet, WHO Modified Partograph, SBAR handover, SOAPIE notes, 24h Fluid Balance, Vital Signs MEWS, Drug Kardex MAR, and UNMEB Logbook."
  },
  "/global-nursing": {
    title: "Becoming a Nurse in Different Countries (Uganda, UK, USA, Kenya, Canada, Gulf) | Nursing Uganda",
    description:
      "Country-by-country nursing licensure roadmaps comparing exams (UNMEB/UHPAB, NCK, TNMC, NMC CBT & OSCE, NCLEX-RN, Prometric), English scores & lab units."
  },
  "/about": {
    title: "About Nursing Uganda & Institutional Non-Affiliation | Nursing Uganda",
    description:
      "Learn about Nursing Uganda's independent clinical revision mission for Ugandan and international nursing and midwifery students."
  },
  "/editorial-policy": {
    title: "Editorial & Clinical Review Policy (UCG 2023 & WHO Aligned) | Nursing Uganda",
    description:
      "How Nursing Uganda tutors and reviewers align notes, dosages, and mock papers with Uganda Clinical Guidelines 2023, WHO, OpenStax, and Open RN."
  },
  "/contact": {
    title: "Contact Student Billing, Clinical Editorial & Legal Desk | Nursing Uganda",
    description:
      "Contact Nursing Uganda support@nursinguganda.com or editorial@nursinguganda.com for PayPal receipts, curriculum review, and data rights requests."
  },
  "/privacy-policy": {
    title: "Privacy & Cookies Policy | Nursing Uganda",
    description: "How Nursing Uganda safeguards learner profiles, progress data, and payment records under the Uganda Data Protection and Privacy Act 2019."
  },
  "/terms": {
    title: "Terms of Service & Medical Disclaimer | Nursing Uganda",
    description: "Educational terms, certificate scope notice, and medical study disclaimers for Nursing Uganda."
  },
  "/login": { title: "Sign In or Create Student Account | Nursing Uganda", noindex: true },
  "/cart": { title: "Study Cart | Nursing Uganda", noindex: true },
  "/checkout": { title: "Secure Checkout | Nursing Uganda", noindex: true },
  "/my-learning": { title: "My Learning Dashboard & Certificates | Nursing Uganda", noindex: true },
  "/nodadmin": { title: "Admin Workspace | Nursing Uganda", noindex: true }
};

function upsertMeta(attrName, attrValue, content) {
  let el = document.head.querySelector(`meta[${attrName}="${attrValue}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attrName, attrValue);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertCanonical(href) {
  let el = document.head.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

function upsertRouteJsonLd(schemaObj) {
  let el = document.getElementById("nu-route-schema");
  if (!schemaObj) {
    if (el) el.remove();
    return;
  }
  if (!el) {
    el = document.createElement("script");
    el.type = "application/ld+json";
    el.id = "nu-route-schema";
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(schemaObj);
}

export function setPageSeo({
  title,
  description,
  canonicalPath = "/",
  image = DEFAULT_IMAGE,
  type = "website",
  noindex = false,
  schema = null
}) {
  const cleanPath = canonicalPath === "/" ? "/" : canonicalPath.replace(/\/+$/, "");
  const canonicalUrl = `${SITE_URL}${cleanPath}`;
  if (title) document.title = title;
  if (description) upsertMeta("name", "description", description);
  upsertMeta(
    "name",
    "robots",
    noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1"
  );
  upsertCanonical(canonicalUrl);
  if (title) {
    upsertMeta("property", "og:title", title);
    upsertMeta("name", "twitter:title", title);
  }
  if (description) {
    upsertMeta("property", "og:description", description);
    upsertMeta("name", "twitter:description", description);
  }
  upsertMeta("property", "og:type", type);
  upsertMeta("property", "og:url", canonicalUrl);
  upsertMeta("property", "og:image", image);
  upsertMeta("name", "twitter:image", image);

  const crumbName = title ? title.split("|")[0].trim() : "Page";
  const defaultSchema = cleanPath === "/" || noindex
    ? null
    : {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
              { "@type": "ListItem", position: 2, name: crumbName, item: canonicalUrl }
            ]
          },
          ...(schema ? [schema] : [])
        ]
      };
  upsertRouteJsonLd(schema && schema["@graph"] ? schema : defaultSchema);
}

export default function RouteSeo() {
  const { pathname } = useLocation();

  useEffect(() => {
    const clean = pathname === "/" ? "/" : pathname.replace(/\/+$/, "");
    const known = ROUTE_META[clean];
    if (known) {
      let schema = null;
      if (clean === "/dictionary") {
        schema = {
          "@type": "DefinedTermSet",
          name: "Nursing Uganda A–Z Medical Dictionary",
          description: known.description,
          url: `${SITE_URL}/dictionary`
        };
      } else if (clean === "/mock-exams" || clean === "/quizzes" || clean === "/courses" || clean === "/ebooks" || clean === "/instruments" || clean === "/medical-images") {
        schema = {
          "@type": "CollectionPage",
          name: known.title.split("|")[0].trim(),
          description: known.description,
          url: `${SITE_URL}${clean}`
        };
      } else if (clean === "/clinical-tools") {
        schema = {
          "@type": "WebApplication",
          name: "Nursing Uganda Clinical Calculators & Lab Ranges",
          applicationCategory: "MedicalApplication",
          operatingSystem: "Any",
          url: `${SITE_URL}/clinical-tools`
        };
      }
      setPageSeo({
        title: known.title,
        description: known.description || ROUTE_META["/"].description,
        canonicalPath: clean,
        noindex: Boolean(known.noindex),
        schema
      });
      return;
    }

    // Dynamic fallbacks until CourseDetailPage / EbookReaderPage loads exact JSON metadata
    if (/^\/course\/[^/]+$/i.test(clean) || /^\/learn\/[^/]+/i.test(clean)) {
      const slug = clean.split("/")[2] || "";
      const readable = slug.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
      const canonicalPath = clean.startsWith("/learn/") ? `/course/${slug}` : clean;
      setPageSeo({
        title: `${readable} | Nursing Uganda Revision Unit`,
        description: `Study ${readable} with Uganda Clinical Guidelines 2023 aligned notes, anatomical visuals, session quizzes, and UNMEB preparation.`,
        canonicalPath,
        type: "article"
      });
      return;
    }

    if (/^\/ebooks\/[^/]+$/i.test(clean)) {
      const slug = clean.split("/")[2] || "";
      const readable = slug.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
      setPageSeo({
        title: `${readable} (Free PDF Study eBook) | Nursing Uganda`,
        description: `Read and download ${readable} free PDF study guide with WHO, MoH Uganda, OpenStax, and Open RN citations.`,
        canonicalPath: clean,
        type: "book"
      });
      return;
    }

    setPageSeo({
      title: "Page Not Found | Nursing Uganda",
      description: "Requested Nursing Uganda page was not found.",
      canonicalPath: clean,
      noindex: true
    });
  }, [pathname]);

  return null;
}
