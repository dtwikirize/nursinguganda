#!/usr/bin/env node
const fs = require("node:fs");
const path = require("node:path");
const { execSync } = require("node:child_process");

const ROOT = path.join(__dirname, "..");
const args = process.argv.slice(2);
const jsOnly = args.includes("--js-only");
const cssOnly = args.includes("--css-only");

async function buildJs() {
  let esbuild;
  try {
    esbuild = require("esbuild");
  } catch {
    console.error("esbuild not found. Run: npm install");
    process.exit(1);
  }

  const inFile = path.join(ROOT, "assets", "js", "app.js");
  const outFile = path.join(ROOT, "assets", "js", "app.min.js");

  const result = await esbuild.build({
    entryPoints: [inFile],
    bundle: false,
    minify: true,
    target: ["es2017"],
    outfile: outFile,
    logLevel: "info"
  });

  const inSize = fs.statSync(inFile).size;
  const outSize = fs.statSync(outFile).size;
  console.log(`JS: ${(inSize / 1024).toFixed(1)} KB → ${(outSize / 1024).toFixed(1)} KB (${Math.round((1 - outSize / inSize) * 100)}% smaller)`);
  return result;
}

function buildCss() {
  const inFile = path.join(ROOT, "assets", "css", "main.css");
  const outFile = path.join(ROOT, "assets", "css", "main.min.css");

  const source = fs.readFileSync(inFile, "utf8");
  const minified = source
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s+/g, " ")
    .replace(/\s*([{}:;,>])\s*/g, (_m, d) => d)
    .replace(/;}/g, "}")
    .trim();

  fs.writeFileSync(outFile, minified);
  console.log(`CSS: ${(source.length / 1024).toFixed(1)} KB → ${(minified.length / 1024).toFixed(1)} KB (${Math.round((1 - minified.length / source.length) * 100)}% smaller)`);
}

(async () => {
  if (!cssOnly) await buildJs();
  if (!jsOnly) buildCss();
  console.log("Build complete.");
})();
