/**
 * fetch-jobs.js
 * ─────────────────────────────────────────────────────────────
 * Pulls nursing & midwifery job listings from free public APIs:
 *   • ReliefWeb Jobs API  (humanitarian / NGO positions)
 *   • WHO Careers RSS     (consultant / programme officer roles)
 *
 * Merges results with hand-crafted seed jobs in
 * scripts/career-jobs-seed.json, deduplicates by title+employer,
 * and writes the combined payload to assets/data/career-jobs.json.
 *
 * Run:   node scripts/fetch-jobs.js
 * Cron:  see .github/workflows/update-jobs.yml (runs daily at 05:00 UTC)
 *
 * No API keys required. Both APIs are publicly available.
 */

const https  = require("https");
const http   = require("http");
const fs     = require("fs");
const path   = require("path");

const OUT_FILE   = path.join(__dirname, "../assets/data/career-jobs.json");
const SEED_FILE  = path.join(__dirname, "career-jobs-seed.json");
const TODAY      = new Date().toISOString().slice(0, 10);

// ── helpers ──────────────────────────────────────────────────

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? https : http;
    let data = "";
    client.get(url, { headers: { "User-Agent": "NursingUganda/1.0 (https://nursinguganda.com)" } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchJson(res.headers.location).then(resolve).catch(reject);
      }
      res.on("data", (chunk) => { data += chunk; });
      res.on("end", () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(new Error(`JSON parse error from ${url}: ${e.message}`)); }
      });
    }).on("error", reject);
  });
}

function fetchText(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? https : http;
    let data = "";
    client.get(url, { headers: { "User-Agent": "NursingUganda/1.0 (https://nursinguganda.com)" } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchText(res.headers.location).then(resolve).catch(reject);
      }
      res.on("data", (chunk) => { data += chunk; });
      res.on("end", () => resolve(data));
    }).on("error", reject);
  });
}

function slugify(str) {
  return String(str).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function addDays(dateStr, days) {
  const d = new Date(`${dateStr}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function classifyLevel(title) {
  const t = title.toLowerCase();
  if (/student|intern/.test(t))                      return "Student";
  if (/graduate|newly|fresh|entry/.test(t))          return "Graduate";
  if (/senior|principal|chief|specialist/.test(t))   return "Senior";
  if (/officer|manager|director|consultant/.test(t)) return "Senior";
  return "Experienced";
}

function classifySpeciality(title, body) {
  const hay = `${title} ${body}`.toLowerCase();
  if (/icu|critical|intensive/.test(hay))              return "ICU";
  if (/theatre|surgical|operat|scrub/.test(hay))       return "Theatre";
  if (/paediat|child|neonat/.test(hay))                return "Paediatrics";
  if (/midwif|maternal|obstet|delivery/.test(hay))     return "Midwifery";
  if (/mental|psychiatr|psycholog/.test(hay))          return "Mental Health";
  if (/communit|outreach|public health|surveillance/.test(hay)) return "Community";
  return "General";
}

function classifyRegion(locationStr) {
  const l = String(locationStr || "").toLowerCase();
  if (/uganda/.test(l))                                    return "Uganda";
  if (/kenya|tanzania|rwanda|burundi|ethiopia|south sudan/.test(l)) return "East Africa";
  if (/uk|united kingdom|england|scotland|wales/.test(l)) return "UK";
  if (/australia|new zealand/.test(l))                    return "Australia";
  if (/saudi|uae|dubai|qatar|oman|kuwait|bahrain/.test(l)) return "Middle East";
  return "Other";
}

// ── ReliefWeb Jobs API ────────────────────────────────────────
// Docs: https://reliefweb.int/help/api
async function fetchReliefWebJobs() {
  const params = [
    "appname=nursinguganda.com",
    "profile=list",
    "slim=1",
    "limit=30",
    "query%5Bvalue%5D=nurse+OR+midwife+OR+nursing+OR+midwifery",
    "query%5Boperator%5D=OR",
    "filter%5Boperator%5D=OR",
    "filter%5Bconditions%5D%5B0%5D%5Bfield%5D=country.name",
    "filter%5Bconditions%5D%5B0%5D%5Bvalue%5D%5B%5D=Uganda",
    "filter%5Bconditions%5D%5B1%5D%5Bfield%5D=country.name",
    "filter%5Bconditions%5D%5B1%5D%5Bvalue%5D%5B%5D=Kenya",
    "filter%5Bconditions%5D%5B2%5D%5Bfield%5D=country.name",
    "filter%5Bconditions%5D%5B2%5D%5Bvalue%5D%5B%5D=South+Sudan",
    "sort%5B%5D=date%3Adesc"
  ].join("&");

  const data = await fetchJson(`https://api.reliefweb.int/v1/jobs?${params}`);
  const items = data.data || [];

  return items.map((item) => {
    const f       = item.fields || {};
    const title   = f.title || "Nursing Role";
    const org     = (f.source || [{}])[0]?.name || "ReliefWeb Partner";
    const country = (f.country || [{}])[0]?.name || "Uganda";
    const posted  = (f.date?.created || TODAY).slice(0, 10);
    const closing = (f["closing_date"] || addDays(posted, 45)).slice(0, 10);
    const body    = (f.body || "").replace(/<[^>]+>/g, "").trim();
    const url     = f.url_alias ? `https://reliefweb.int${f.url_alias}` : "https://reliefweb.int/jobs";

    return {
      id:          `rw-${slugify(title)}-${slugify(org)}`.slice(0, 64),
      title,
      employer:    org,
      location:    country,
      type:        "Contract",
      level:       classifyLevel(title),
      region:      classifyRegion(country),
      speciality:  classifySpeciality(title, body),
      salary:      "Not disclosed",
      posted,
      deadline:    closing,
      isFeatured:  false,
      isExternal:  true,
      source:      "reliefweb",
      applyUrl:    url,
      positions:   1,
      duration:    "6-12 months",
      description: body.slice(0, 300) || `${title} opportunity with ${org}.`,
      responsibilities: [
        "Deliver safe clinical care in line with organisational protocols.",
        "Collaborate with interdisciplinary teams and local health authorities.",
        "Maintain accurate patient records and submit timely reports."
      ],
      requirements: [
        `${classifyLevel(title)} nursing or midwifery experience`,
        "Valid professional registration in country of practice",
        "Experience in humanitarian, refugee or rural health settings preferred"
      ],
      documents: ["CV", "Nursing registration certificate", "Field experience letter", "Passport copy"],
      employerType: "International Agency / NGO",
      employerDescription: `${org} posts nursing and midwifery roles on ReliefWeb for humanitarian and development programmes across Africa.`
    };
  });
}

// ── WHO Careers RSS ───────────────────────────────────────────
async function fetchWhoJobs() {
  let xml;
  try { xml = await fetchText("https://www.who.int/careers/vacancies/rss"); }
  catch (e) { console.warn("  ⚠  WHO RSS unavailable:", e.message); return []; }

  const items = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let m;
  while ((m = itemRegex.exec(xml)) !== null) {
    const block = m[1];
    const get   = (tag) => {
      const r = new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>|<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`);
      const x = r.exec(block);
      return (x?.[1] || x?.[2] || "").trim();
    };
    const title = get("title");
    if (!title || !/nurs|midwif/i.test(title)) continue;

    const link    = get("link") || "https://careers.who.int/";
    const pubDate = get("pubDate");
    const posted  = pubDate ? new Date(pubDate).toISOString().slice(0, 10) : TODAY;
    const desc    = get("description").replace(/<[^>]+>/g, "").trim().slice(0, 300);

    items.push({
      id:           `who-${slugify(title)}`.slice(0, 64),
      title,
      employer:     "WHO Vacancies",
      location:     "Africa Region",
      type:         "Contract",
      level:        classifyLevel(title),
      region:       "Other",
      speciality:   classifySpeciality(title, desc),
      salary:       "WHO rate (P-grade or consultancy)",
      posted,
      deadline:     addDays(posted, 45),
      isFeatured:   false,
      isExternal:   true,
      source:       "who-rss",
      applyUrl:     link,
      positions:    1,
      duration:     "3-12 months",
      description:  desc || `${title} — WHO vacancy.`,
      responsibilities: [
        "Provide technical nursing guidance and support to Member States.",
        "Develop or review clinical protocols and health workforce frameworks.",
        "Coordinate with WHO country offices, ministries of health and partners."
      ],
      requirements: [
        "Advanced degree in Nursing, Public Health or Health Systems",
        "Minimum 5 years relevant experience; international experience preferred",
        "Strong analytical and written communication skills in English"
      ],
      documents: ["WHO e-Recruit application", "CV", "Academic certificates", "Three references"],
      employerType: "International Agency / NGO",
      employerDescription: "WHO posts nursing and health workforce roles through careers.who.int. Positions range from national programme officers to global consultancy assignments."
    });
  }
  return items;
}

// ── Load seed ─────────────────────────────────────────────────
function loadSeedJobs() {
  if (!fs.existsSync(SEED_FILE)) return [];
  try {
    const raw = JSON.parse(fs.readFileSync(SEED_FILE, "utf8"));
    return Array.isArray(raw) ? raw : (raw.jobs || []);
  } catch (e) {
    console.warn("  ⚠  Could not parse seed file:", e.message);
    return [];
  }
}

// ── Deduplicate by title+employer slug ───────────────────────
function dedup(jobs) {
  const seen = new Set();
  return jobs.filter((j) => {
    const key = `${slugify(j.title)}-${slugify(j.employer)}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// ── Main ─────────────────────────────────────────────────────
async function main() {
  console.log("⟳  Fetching nursing & midwifery jobs…\n");

  const seed = loadSeedJobs();
  console.log(`  ✓ Seed jobs: ${seed.length}`);

  let reliefJobs = [];
  try {
    reliefJobs = await fetchReliefWebJobs();
    console.log(`  ✓ ReliefWeb: ${reliefJobs.length} jobs`);
  } catch (e) { console.warn(`  ⚠  ReliefWeb: ${e.message}`); }

  let whoJobs = [];
  try {
    whoJobs = await fetchWhoJobs();
    console.log(`  ✓ WHO RSS: ${whoJobs.length} jobs`);
  } catch (e) { console.warn(`  ⚠  WHO RSS: ${e.message}`); }

  // Seed jobs take priority (richer content); API jobs supplement
  const merged = dedup([...seed, ...reliefJobs, ...whoJobs]);

  // Sort: featured first, then newest posted date
  merged.sort((a, b) => {
    if (a.isFeatured && !b.isFeatured) return -1;
    if (!a.isFeatured && b.isFeatured) return  1;
    return new Date(b.posted) - new Date(a.posted);
  });

  const output = {
    _comment:    "Auto-updated daily by GitHub Actions (.github/workflows/update-jobs.yml). Do not edit manually.",
    lastUpdated: TODAY,
    sources:     ["seed", "ReliefWeb API", "WHO Careers RSS"],
    totalJobs:   merged.length,
    jobs:        merged
  };

  fs.writeFileSync(OUT_FILE, JSON.stringify(output, null, 2), "utf8");
  console.log(`\n✅  Written ${merged.length} jobs → ${path.relative(process.cwd(), OUT_FILE)}`);
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
