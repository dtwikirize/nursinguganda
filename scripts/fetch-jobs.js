/**
 * Fetch and refresh nursing job listings.
 *
 * Runs daily at 06:00 UTC via GitHub Actions.
 * Writes updated job data to assets/data/jobs.json.
 *
 * To add a real data source, replace the SOURCES array entries with
 * live API endpoints and parse their responses into the standard job shape.
 */

const fs = require("fs");
const path = require("path");
const https = require("https");

const OUT_PATH = path.join(__dirname, "../assets/data/jobs.json");

/* ── helpers ─────────────────────────────────────────────── */
function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { "User-Agent": "NursingUganda-JobBot/1.0" } }, (res) => {
        let body = "";
        res.on("data", (chunk) => (body += chunk));
        res.on("end", () => {
          try {
            resolve(JSON.parse(body));
          } catch {
            reject(new Error(`Invalid JSON from ${url}`));
          }
        });
      })
      .on("error", reject);
  });
}

function isoDate(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split("T")[0];
}

/* ── SOURCES ─────────────────────────────────────────────── */
/**
 * Each source is an async function that returns an array of job objects
 * matching the standard shape used by app.js.
 *
 * Example shape:
 * {
 *   id: "unique-slug",
 *   title: "Staff Nurse",
 *   employer: "Mulago National Referral Hospital",
 *   employerDescription: "...",
 *   employerType: "Government",
 *   location: "Kampala, Uganda",
 *   region: "central",
 *   type: "Full-Time",
 *   level: "Mid-Level",
 *   speciality: "General Nursing",
 *   salary: "UGX 1.8M – 2.4M per month",
 *   description: "...",
 *   responsibilities: ["..."],
 *   requirements: ["..."],
 *   documents: ["..."],
 *   posted: "2025-01-01",
 *   deadline: "2025-01-31",
 *   duration: "Permanent",
 *   positions: 3,
 *   applyUrl: "#/careers",
 *   isFeatured: false,
 *   isExternal: false
 * }
 */
const SOURCES = [
  // Placeholder: returns an empty array until a live API is wired up.
  // Replace with real fetch calls, e.g.:
  //   async function fetchLinkedInJobs() { ... }
  async function placeholderSource() {
    return [];
  }
];

/* ── main ─────────────────────────────────────────────────── */
async function main() {
  const existing = fs.existsSync(OUT_PATH)
    ? JSON.parse(fs.readFileSync(OUT_PATH, "utf-8"))
    : { jobs: [], fetchedAt: null };

  const fresh = [];

  for (const source of SOURCES) {
    try {
      const jobs = await source();
      fresh.push(...jobs);
    } catch (err) {
      console.error("Source error:", err.message);
    }
  }

  // If no live data yet, preserve existing jobs and just update the timestamp.
  const jobs = fresh.length ? fresh : existing.jobs || [];

  const output = {
    fetchedAt: new Date().toISOString(),
    jobCount: jobs.length,
    jobs
  };

  fs.writeFileSync(OUT_PATH, JSON.stringify(output, null, 2), "utf-8");
  console.log(`Wrote ${jobs.length} jobs to ${OUT_PATH} (fetched at ${output.fetchedAt})`);
}

main().catch((err) => {
  console.error("fetch-jobs failed:", err);
  process.exit(1);
});
