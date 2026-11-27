const fs = require("fs/promises");
const path = require("path");

const BASE_URL = "https://infobooks.org";
const MEDICAL_URL = `${BASE_URL}/free-pdf-books/medical/`;
const OUTPUT_PATH = path.join(__dirname, "..", "assets", "data", "book-library.json");

const CURATED_SLUGS = new Set([
  "nursing",
  "anatomy",
  "pharmacology",
  "first-aid",
  "obstetrics",
  "gynecology",
  "pediatrics",
  "neonatology",
  "nutrition",
  "epidemiology",
  "pathology",
  "parasitology",
  "virology",
  "immunology",
  "internal-medicine",
  "surgery",
  "psychiatry",
  "physiotherapy",
  "cardiology",
  "diabetes"
]);

const SUBJECT_RULES = [
  { subject: "Foundations of Nursing", terms: ["nursing", "fundamental", "clinical skill", "procedure", "communication", "ethic", "leadership"] },
  { subject: "Anatomy and Physiology", terms: ["anatomy", "physiology", "neuroanatomy", "body system"] },
  { subject: "Pharmacology", terms: ["pharmacology", "drug", "medicine", "medication", "nutrition"] },
  { subject: "Midwifery", terms: ["midwifery", "obstetric", "gynecology", "gynaecology", "pregnancy", "maternal", "newborn", "neonatal"] },
  { subject: "Child Health", terms: ["pediatric", "paediatric", "child", "childcare", "neonatology"] },
  { subject: "Community Health", terms: ["community", "public health", "epidemiology", "nutrition", "first aid"] },
  { subject: "Medical Surgical Nursing", terms: ["surgery", "internal medicine", "cardiology", "diabetes", "cancer", "asthma", "nephrology", "gastroenterology", "urology"] },
  { subject: "Pathology and Infection", terms: ["pathology", "pathophysiology", "parasitology", "virology", "immunology", "microbiology", "hematology", "toxicology"] },
  { subject: "Mental Health", terms: ["psychiatry", "mental", "psychology"] },
  { subject: "Clinical Skills", terms: ["first aid", "physiotherapy", "radiology", "anesthesia", "diagnosis", "assessment"] }
];

const PRIORITY_SLUGS = new Map([
  ["nursing", 100],
  ["anatomy", 95],
  ["pharmacology", 94],
  ["first-aid", 91],
  ["obstetrics", 90],
  ["gynecology", 89],
  ["pediatrics", 88],
  ["neonatology", 87],
  ["pathology", 84],
  ["epidemiology", 82],
  ["nutrition", 80],
  ["parasitology", 80],
  ["virology", 79],
  ["immunology", 78],
  ["internal-medicine", 77],
  ["surgery", 76],
  ["psychiatry", 74],
  ["physiotherapy", 72],
  ["cardiology", 70],
  ["diabetes", 70]
]);

function absoluteUrl(url) {
  return new URL(url, BASE_URL).href;
}

function slugFromUrl(url) {
  const match = String(url).match(/\/medical\/([^/]+)\/?$/);
  return match ? match[1] : slugify(url);
}

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function decodeHtml(value) {
  const named = {
    amp: "&",
    apos: "'",
    copy: "(c)",
    gt: ">",
    lt: "<",
    nbsp: " ",
    quot: "\""
  };

  return String(value || "").replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (_, entity) => {
    const key = entity.toLowerCase();
    if (key[0] === "#") {
      const code = key[1] === "x" ? parseInt(key.slice(2), 16) : parseInt(key.slice(1), 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : "";
    }
    return Object.prototype.hasOwnProperty.call(named, key) ? named[key] : "";
  });
}

function stripTags(value) {
  return decodeHtml(String(value || "").replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

function textIncludes(text, terms) {
  const haystack = String(text || "").toLowerCase();
  return terms.some((term) => haystack.includes(term));
}

function subjectsFor(...parts) {
  const text = parts.join(" ").toLowerCase();
  const subjects = SUBJECT_RULES.filter((rule) => textIncludes(text, rule.terms)).map((rule) => rule.subject);
  return subjects.length ? [...new Set(subjects)] : ["General Medical Reading"];
}

function scoreCollection(title, slug) {
  const base = PRIORITY_SLUGS.get(slug) || 50;
  const subjects = subjectsFor(title, slug);
  return Math.min(100, base + Math.min(subjects.length * 2, 8));
}

function scoreBook(book, collection) {
  const text = `${book.title} ${book.description} ${collection.title} ${collection.slug}`.toLowerCase();
  let score = collection.score;
  if (textIncludes(text, ["nursing", "nurse", "clinical skill", "procedure", "pharmacology", "anatomy", "obstetric", "pediatric", "midwifery"])) score += 8;
  if (textIncludes(text, ["openstax", "who", "manual", "guide", "textbook", "fundamental"])) score += 5;
  if (textIncludes(text, ["communication", "ethic", "research", "leadership", "community"])) score += 3;
  return Math.max(45, Math.min(100, score));
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: {
      "accept": "text/html,application/xhtml+xml",
      "user-agent": "Nursing Uganda curriculum resource curator (+https://nursinguganda.com)"
    }
  });
  if (!response.ok) throw new Error(`Could not fetch ${url} (${response.status})`);
  return response.text();
}

function extractJsonLd(html) {
  const blocks = [];
  const scriptPattern = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = scriptPattern.exec(html))) {
    try {
      blocks.push(JSON.parse(decodeHtml(match[1])));
    } catch {
      // Ignore malformed metadata and fall back to link parsing.
    }
  }
  return blocks;
}

function collectItemLists(node, output = []) {
  if (!node || typeof node !== "object") return output;
  if (Array.isArray(node)) {
    node.forEach((item) => collectItemLists(item, output));
    return output;
  }
  if (Array.isArray(node.itemListElement)) output.push(node.itemListElement);
  Object.values(node).forEach((value) => collectItemLists(value, output));
  return output;
}

function parseCollections(html) {
  const fromJson = collectItemLists(extractJsonLd(html))
    .flat()
    .map((item) => ({
      title: stripTags(item.name || item.item?.name || ""),
      url: item.url || item.item?.url || ""
    }))
    .filter((item) => item.title && /\/free-pdf-books\/medical\//.test(item.url || ""));

  const fromLinks = [...html.matchAll(/<a[^>]+href=["']([^"']*\/free-pdf-books\/medical\/[^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)]
    .map((match) => ({
      title: stripTags(match[2]),
      url: absoluteUrl(match[1])
    }))
    .filter((item) => item.title && item.title.length < 80);

  const bySlug = new Map();
  [...fromJson, ...fromLinks].forEach((item) => {
    const url = absoluteUrl(item.url);
    const slug = slugFromUrl(url);
    if (!slug || slug === "medical") return;
    if (!bySlug.has(slug)) bySlug.set(slug, { title: item.title.replace(/\s*\[PDF\].*$/i, ""), url, slug });
  });

  return [...bySlug.values()]
    .filter((collection) => CURATED_SLUGS.has(collection.slug))
    .map((collection) => {
      const score = scoreCollection(collection.title, collection.slug);
      return {
        ...collection,
        subjects: subjectsFor(collection.title, collection.slug),
        score,
        priority: score >= 88 ? "high" : score >= 76 ? "medium" : "supporting",
        fit: fitText(collection.title, collection.slug),
        content_use: ["Further reading", "Topic enrichment", "Quiz and flashcard ideas"],
        status: "review"
      };
    })
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));
}

function fitText(title, slug) {
  if (slug === "nursing") return "Directly supports nursing foundations, procedures, communication, ethics, research and leadership.";
  if (slug === "pharmacology") return "Useful for medicine administration, drug classes, safety checks and pharmacology revision.";
  if (slug === "anatomy") return "Good source material for anatomy and physiology topic notes.";
  if (["obstetrics", "gynecology", "neonatology"].includes(slug)) return "Strong support for midwifery, reproductive health, maternal care and newborn topics.";
  if (slug === "pediatrics") return "Helpful for child health and paediatric nursing revision.";
  if (slug === "first-aid") return "Practical support for emergency care, assessment and clinical skills.";
  if (["pathology", "parasitology", "virology", "immunology", "epidemiology"].includes(slug)) return "Useful for infection, disease process, public health and pathology topics.";
  if (["internal-medicine", "surgery", "cardiology", "diabetes"].includes(slug)) return "Useful for medical-surgical nursing conditions and care planning.";
  if (slug === "psychiatry") return "Useful for mental health nursing concepts and care planning.";
  return `${title} can support related course units and selected topic expansions.`;
}

function parseBookCards(html, collection) {
  return html
    .split(/<li class=["']pdf-card\b/i)
    .slice(1)
    .map((chunk, index) => {
      const card = chunk.split(/<\/li>/i)[0] || chunk;
      const titleMatch = card.match(/pdf-card__title[\s\S]*?<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/i);
      if (!titleMatch) return null;

      const descMatch = card.match(/pdf-card__desc[^>]*>([\s\S]*?)<\/p>/i);
      const authorMatch = card.match(/pdf-card__author[^>]*>([\s\S]*?)<\/p>/i);
      const imageMatch = card.match(/<img[^>]+src=["']([^"']+)["'][^>]*alt=["']([^"']*)["']/i);
      const readMatch = card.match(/<a[^>]+href=["']([^"']+)["'][^>]*pdf-card__btn--read/i);
      const downloadMatch = card.match(/<a[^>]+href=["']([^"']+)["'][^>]*pdf-download/i);
      const chips = [...card.matchAll(/pdf-card__chip[^>]*>([\s\S]*?)<\/span>/gi)].map((match) => stripTags(match[1]));
      const title = stripTags(titleMatch[2]);
      const description = stripTags(descMatch ? descMatch[1] : "");
      const author = stripTags(authorMatch ? authorMatch[1] : "").replace(/^Author:\s*/i, "");

      const book = {
        id: `${collection.slug}-${index + 1}-${slugify(title).slice(0, 60)}`,
        title,
        collection_slug: collection.slug,
        collection_title: collection.title,
        source_url: collection.url,
        read_url: absoluteUrl(readMatch ? readMatch[1] : titleMatch[1]),
        description,
        author,
        cover_image: imageMatch ? absoluteUrl(imageMatch[1]) : "",
        cover_alt: imageMatch ? decodeHtml(imageMatch[2]) : title,
        pages: chips.find((chip) => /\bpages?\b/i.test(chip)) || "",
        file_size: chips.find((chip) => /\b(MB|KB)\b/i.test(chip)) || "",
        subjects: subjectsFor(title, description, collection.title, collection.slug),
        download_available_at_source: Boolean(downloadMatch),
        status: "review"
      };
      return { ...book, score: scoreBook(book, collection) };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));
}

async function buildLibrary() {
  const medicalHtml = await fetchText(MEDICAL_URL);
  const collections = parseCollections(medicalHtml);
  const books = [];

  for (const collection of collections) {
    try {
      const html = await fetchText(collection.url);
      const parsed = parseBookCards(html, collection).slice(0, 10);
      books.push(...parsed);
      collection.books_found = parsed.length;
    } catch (error) {
      collection.books_found = 0;
      collection.import_error = error.message;
    }
  }

  return {
    generated_at_utc: new Date().toISOString(),
    source: {
      name: "InfoBooks",
      base_url: BASE_URL,
      medical_url: MEDICAL_URL
    },
    policy: {
      pdf_downloads: "not_downloaded",
      note: "Nursing Uganda links to InfoBooks source and read pages only. Verify each licence and attribution before hosting any PDF locally."
    },
    summary: {
      collections_found: collections.length,
      curated_collections: collections.length,
      books_indexed: books.length,
      recommended_first: collections.filter((collection) => collection.priority === "high").length
    },
    collections,
    books: books.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
  };
}

buildLibrary()
  .then(async (library) => {
    await fs.mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
    await fs.writeFile(OUTPUT_PATH, `${JSON.stringify(library, null, 2)}\n`, "utf8");
    console.log(`Wrote ${library.summary.books_indexed} books from ${library.summary.curated_collections} collections to ${OUTPUT_PATH}`);
  })
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
