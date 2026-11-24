/**
 * Registers client-side WebMCP tools via navigator.modelContext.registerTool()
 * when running in an AI-enabled browser supporting the WebMCP API.
 */

let webMcpRegistered = false;

async function fetchJsonSafe(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url}`);
  return res.json();
}

export function registerWebMcpTools() {
  if (webMcpRegistered) return;
  if (typeof navigator === "undefined") return;
  const mc = navigator.modelContext;
  if (!mc || typeof mc.registerTool !== "function") return;

  webMcpRegistered = true;

  const tools = [
    {
      name: "search_nursing_courses",
      description: "Search Nursing Uganda's 95 Certificate, Diploma, and BScN nursing and midwifery course units.",
      inputSchema: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "Keyword such as 'midwifery', 'anatomy', 'pharmacology', or course code"
          },
          programme: {
            type: "string",
            description: "Optional programme slug filter (e.g. certificate-in-nursing, diploma-nursing-direct)"
          }
        },
        required: ["query"]
      },
      annotations: { readOnlyHint: true },
      execute: async ({ query = "", programme = "" } = {}) => {
        const catalog = await fetchJsonSafe("/assets/data/catalog.json");
        const q = String(query).trim().toLowerCase();
        const prog = String(programme).trim().toLowerCase();
        const matches = (catalog?.courses || [])
          .filter((c) => {
            if (prog && !(c.programmeId || "").toLowerCase().includes(prog)) return false;
            if (!q) return true;
            return `${c.title} ${c.code || ""} ${c.category || ""} ${c.programmeLabel || ""} ${c.description || ""}`
              .toLowerCase()
              .includes(q);
          })
          .slice(0, 12)
          .map((c) => ({
            slug: c.slug,
            title: c.title,
            code: c.code || "",
            programme: c.programmeLabel,
            lessonsCount: c.lessonsCount || 0,
            priceUsd: c.priceUsd ?? 0,
            url: `https://nursinguganda.com/course/${c.slug}`
          }));
        return {
          content: [{ type: "text", text: JSON.stringify({ count: matches.length, courses: matches }, null, 2) }]
        };
      }
    },
    {
      name: "lookup_medical_dictionary",
      description: "Look up A-Z clinical terms and ward abbreviations in the Nursing Uganda Medical Dictionary (1,079+ terms).",
      inputSchema: {
        type: "object",
        properties: {
          term: {
            type: "string",
            description: "Medical term or hospital ward abbreviation to look up"
          }
        },
        required: ["term"]
      },
      annotations: { readOnlyHint: true },
      execute: async ({ term = "" } = {}) => {
        const dict = await fetchJsonSafe("/assets/data/dictionary.json");
        const q = String(term).trim().toLowerCase();
        const matchedTerms = (dict?.terms || [])
          .filter((t) => `${t.term} ${t.simpleDefinition} ${t.definition}`.toLowerCase().includes(q))
          .slice(0, 8)
          .map((t) => ({
            term: t.term,
            pronunciation: t.pronunciation || "",
            category: t.category,
            simpleDefinition: t.simpleDefinition,
            clinicalContext: t.clinicalContext
          }));
        const matchedAbbr = (dict?.abbreviations || [])
          .filter((a) => `${a.abbr} ${a.full}`.toLowerCase().includes(q))
          .slice(0, 8);
        return {
          content: [{
            type: "text",
            text: JSON.stringify({ terms: matchedTerms, abbreviations: matchedAbbr }, null, 2)
          }]
        };
      }
    },
    {
      name: "find_clinical_instrument",
      description: "Search the Nursing Uganda Medical & Surgical Instrument Atlas for ward trays, uses, and OSCE care guides.",
      inputSchema: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "Instrument name or ward tray category (e.g. forceps, speculum, obstetric)"
          }
        },
        required: ["query"]
      },
      annotations: { readOnlyHint: true },
      execute: async ({ query = "" } = {}) => {
        const data = await fetchJsonSafe("/assets/data/medical-instruments.json");
        const q = String(query).trim().toLowerCase();
        const items = Array.isArray(data?.categories)
          ? data.categories.flatMap((c) => c.items || [])
          : data?.instruments || [];
        const list = items
          .filter((it) => `${it.name} ${it.category} ${it.use || it.purpose || ""}`.toLowerCase().includes(q))
          .slice(0, 10)
          .map((it) => ({
            name: it.name,
            category: it.category,
            use: it.use || it.purpose || "",
            sterilization: it.sterilization || "",
            url: `https://nursinguganda.com/instruments?q=${encodeURIComponent(it.name)}`
          }));
        return {
          content: [{ type: "text", text: JSON.stringify({ count: list.length, instruments: list }, null, 2) }]
        };
      }
    },
    {
      name: "get_unmeb_mock_papers",
      description: "List UNMEB objective mock exams and Section B/C past essay papers available on Nursing Uganda.",
      inputSchema: {
        type: "object",
        properties: {
          format: {
            type: "string",
            enum: ["all", "objective", "essay"],
            description: "Filter between objective MCQ mocks, essay past papers, or all"
          }
        }
      },
      annotations: { readOnlyHint: true },
      execute: async ({ format = "all" } = {}) => {
        const out = {};
        if (format === "all" || format === "objective") {
          const obj = await fetchJsonSafe("/assets/data/mock-exams.json");
          out.objectiveExams = (obj?.exams || []).map((e) => ({
            id: e.id,
            title: e.title,
            questionCount: e.questions?.length || 0,
            minutes: e.minutes || 60
          }));
        }
        if (format === "all" || format === "essay") {
          const ess = await fetchJsonSafe("/assets/data/unmeb-essay-papers.json");
          out.essayPapers = (ess?.papers || []).map((p) => ({
            id: p.id,
            title: p.title,
            series: p.series,
            totalMarks: p.totalMarks,
            isFreeSample: Boolean(p.isFreeSample)
          }));
        }
        return {
          content: [{ type: "text", text: JSON.stringify(out, null, 2) }]
        };
      }
    }
  ];

  for (const tool of tools) {
    try {
      mc.registerTool(tool);
    } catch {
      // Ignore duplicate registration on hot reload
    }
  }
}
