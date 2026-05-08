const fs = require("fs");
const fsp = require("fs/promises");
const path = require("path");
const http = require("http");
const https = require("https");

const ROOT = path.join(__dirname, "..");
const OUTPUT_DIR = path.join(ROOT, "research", "enrichment");
const PDF_DIR = path.join(OUTPUT_DIR, "raw", "pdfs");
const MANIFEST_PATH = path.join(OUTPUT_DIR, "pdf-download-manifest.json");
const SUMMARY_PATH = path.join(OUTPUT_DIR, "downloaded-pdfs.md");

const SOURCES = [
  {
    id: "open-rn-nursing-pharmacology",
    title: "Nursing Pharmacology, 2nd edition",
    publisher: "Open Resources for Nursing / NCBI Bookshelf",
    sourcePage: "https://www.ncbi.nlm.nih.gov/books/NBK595000/",
    pdfUrl: "https://www.ncbi.nlm.nih.gov/books/NBK595000/pdf/Bookshelf_NBK595000.pdf",
    license: "CC BY 4.0",
    usePolicy: "Good source for original pharmacology notes, quizzes, medication-safety summaries, and study checklists with attribution.",
    fileName: "open-rn-nursing-pharmacology.pdf",
    maxBytes: 220 * 1024 * 1024
  },
  {
    id: "who-maternal-health-2025",
    title: "WHO recommendations on maternal health, 2nd edition",
    publisher: "World Health Organization / NCBI Bookshelf",
    sourcePage: "https://www.ncbi.nlm.nih.gov/books/NBK615644/",
    pdfUrl: "https://www.ncbi.nlm.nih.gov/books/NBK615644/pdf/Bookshelf_NBK615644.pdf",
    license: "CC BY-NC-SA 3.0 IGO",
    usePolicy: "Use for original midwifery, antenatal, intrapartum, postnatal, and maternal-complication summaries. Non-commercial/share-alike terms need review before publishing adapted material.",
    fileName: "who-maternal-health-2025.pdf",
    maxBytes: 20 * 1024 * 1024
  },
  {
    id: "who-child-health-2017",
    title: "WHO recommendations on child health",
    publisher: "World Health Organization / WHO IRIS",
    sourcePage: "https://iris.who.int/handle/10665/259267",
    pdfUrl: "https://iris.who.int/server/api/core/bitstreams/08ad3b39-451e-478f-8ec7-cf067182b3a0/content",
    license: "CC BY-NC-SA 3.0 IGO",
    usePolicy: "Use for original child-health study summaries and quiz seeds. Non-commercial/share-alike terms need review before publishing adapted material.",
    fileName: "who-child-health-2017.pdf",
    maxBytes: 10 * 1024 * 1024
  },
  {
    id: "who-newborn-health-2017",
    title: "WHO recommendations on newborn health",
    publisher: "World Health Organization / WHO IRIS",
    sourcePage: "https://iris.who.int/handle/10665/259269",
    pdfUrl: "https://iris.who.int/server/api/core/bitstreams/e3ae29ae-a7f2-47f8-b1ce-bed3e3b2a971/content",
    license: "CC BY-NC-SA 3.0 IGO",
    usePolicy: "Use for original newborn-care notes, revision checklists, and quiz seeds. Non-commercial/share-alike terms need review before publishing adapted material.",
    fileName: "who-newborn-health-2017.pdf",
    maxBytes: 10 * 1024 * 1024
  },
  {
    id: "who-adolescent-health-2017",
    title: "WHO recommendations on adolescent health",
    publisher: "World Health Organization / WHO IRIS",
    sourcePage: "https://iris.who.int/handle/10665/259628",
    pdfUrl: "https://iris.who.int/server/api/core/bitstreams/84f5240b-35ed-436f-ae51-1c025f1e5ba0/content",
    license: "CC BY-NC-SA 3.0 IGO",
    usePolicy: "Use for original adolescent-health revision notes and counselling-oriented quiz seeds. Non-commercial/share-alike terms need review before publishing adapted material.",
    fileName: "who-adolescent-health-2017.pdf",
    maxBytes: 10 * 1024 * 1024
  },
  {
    id: "open-rn-nursing-skills",
    title: "Nursing Skills",
    publisher: "Open Resources for Nursing / NCBI Bookshelf",
    sourcePage: "https://www.ncbi.nlm.nih.gov/books/NBK596735/",
    pdfUrl: "https://www.ncbi.nlm.nih.gov/books/NBK596735/pdf/Bookshelf_NBK596735.pdf",
    license: "CC BY 4.0",
    usePolicy: "Very relevant for clinical skills and procedure checklists, but intentionally skipped by default because the official PDF is roughly 449 MB.",
    fileName: "open-rn-nursing-skills.pdf",
    maxBytes: 220 * 1024 * 1024,
    skipByDefault: true,
    skipReason: "Large official PDF. Download manually only if you want a 449 MB local reference file."
  }
];

function request(url, redirectCount = 0) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https:") ? https : http;
    const req = client.get(
      url,
      {
        headers: {
          "User-Agent": "Nursing Uganda enrichment downloader/1.0",
          Accept: "application/pdf,text/html;q=0.5,*/*;q=0.1"
        }
      },
      (res) => {
        const location = res.headers.location;
        if ([301, 302, 303, 307, 308].includes(res.statusCode) && location) {
          res.resume();
          if (redirectCount >= 8) {
            reject(new Error(`Too many redirects for ${url}`));
            return;
          }
          const nextUrl = new URL(location, url).toString();
          resolve(request(nextUrl, redirectCount + 1));
          return;
        }
        resolve(res);
      }
    );

    req.on("error", reject);
    req.setTimeout(600000, () => {
      req.destroy(new Error(`Timed out while requesting ${url}`));
    });
  });
}

async function fileStartsWithPdf(filePath) {
  const handle = await fsp.open(filePath, "r");
  try {
    const buffer = Buffer.alloc(5);
    const { bytesRead } = await handle.read(buffer, 0, 5, 0);
    return bytesRead === 5 && buffer.toString("utf8") === "%PDF-";
  } finally {
    await handle.close();
  }
}

async function safeRemove(filePath) {
  await fsp.rm(filePath, { force: true }).catch(() => {});
}

async function downloadSource(source) {
  const destination = path.join(PDF_DIR, source.fileName);
  const tempDestination = `${destination}.${process.pid}.${Date.now()}.part`;

  if (source.skipByDefault) {
    return {
      ...source,
      status: "skipped",
      reason: source.skipReason,
      localPath: destination
    };
  }

  const existing = await fsp.stat(destination).catch(() => null);
  if (existing && existing.size > 0 && await fileStartsWithPdf(destination)) {
    return {
      ...source,
      status: "already_downloaded",
      bytes: existing.size,
      localPath: destination
    };
  }

  const res = await request(source.pdfUrl);
  const statusCode = res.statusCode || 0;
  const contentType = String(res.headers["content-type"] || "");
  const contentLength = Number(res.headers["content-length"] || 0);

  if (statusCode < 200 || statusCode >= 300) {
    res.resume();
    return {
      ...source,
      status: "failed",
      reason: `HTTP ${statusCode}`,
      contentType,
      localPath: destination
    };
  }

  if (contentLength && contentLength > source.maxBytes) {
    res.resume();
    return {
      ...source,
      status: "skipped",
      reason: `Remote file is ${contentLength} bytes, above ${source.maxBytes} byte limit.`,
      contentType,
      bytes: contentLength,
      localPath: destination
    };
  }

  await new Promise((resolve, reject) => {
    const output = fs.createWriteStream(tempDestination);
    let bytes = 0;

    res.on("data", (chunk) => {
      bytes += chunk.length;
      if (bytes > source.maxBytes) {
        res.destroy(new Error(`Download exceeded ${source.maxBytes} byte limit.`));
      }
    });
    res.on("error", reject);
    output.on("error", reject);
    output.on("close", resolve);
    res.pipe(output);
  });

  const downloaded = await fsp.stat(tempDestination);
  const isPdf = await fileStartsWithPdf(tempDestination);

  if (!isPdf) {
    await safeRemove(tempDestination);
    return {
      ...source,
      status: "failed",
      reason: `Downloaded response was not a PDF. Content-Type: ${contentType || "unknown"}.`,
      contentType,
      bytes: downloaded.size,
      localPath: destination
    };
  }

  await fsp.rename(tempDestination, destination);

  return {
    ...source,
    status: "downloaded",
    bytes: downloaded.size,
    contentType,
    localPath: destination
  };
}

function formatBytes(bytes) {
  if (!bytes) return "";
  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  return `${value.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

async function writeOutputs(results) {
  const manifest = {
    generatedAtUtc: new Date().toISOString(),
    policy: "Downloaded PDFs are local research inputs only. Do not publish raw PDFs or extracted third-party text in the web app. Use them to write original notes, quizzes, checklists, and summaries with attribution and licence review.",
    results
  };

  const lines = [
    "# Enrichment PDF Downloads",
    "",
    `Generated: ${manifest.generatedAtUtc}`,
    "",
    "These PDFs are kept as local research inputs only. They are not part of the public app build and should not be committed.",
    "",
    "| Status | Title | Size | Licence | Source | Local file / note |",
    "| --- | --- | ---: | --- | --- | --- |"
  ];

  for (const result of results) {
    const note = result.status === "downloaded" || result.status === "already_downloaded"
      ? result.localPath
      : result.reason || "";
    lines.push([
      result.status,
      result.title,
      formatBytes(result.bytes),
      result.license,
      result.sourcePage,
      note.replaceAll("|", "\\|")
    ].map((value) => String(value || "")).join(" | "));
  }

  await fsp.writeFile(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`);
  await fsp.writeFile(SUMMARY_PATH, `${lines.join("\n")}\n`);
}

async function main() {
  await fsp.mkdir(PDF_DIR, { recursive: true });

  const results = [];
  for (const source of SOURCES) {
    process.stdout.write(`Processing ${source.id}...\n`);
    try {
      results.push(await downloadSource(source));
    } catch (error) {
      results.push({
        ...source,
        status: "failed",
        reason: error.message,
        localPath: path.join(PDF_DIR, source.fileName)
      });
    }
  }

  await writeOutputs(results);
  process.stdout.write(`Wrote ${MANIFEST_PATH}\n`);
  process.stdout.write(`Wrote ${SUMMARY_PATH}\n`);

  const downloaded = results.filter((result) => ["downloaded", "already_downloaded"].includes(result.status));
  process.stdout.write(`Ready PDFs: ${downloaded.length}/${results.length}\n`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
