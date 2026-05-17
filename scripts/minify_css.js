#!/usr/bin/env node
/* Small project-local CSS minifier. Keeps replacement groups inside Node, not PowerShell. */
const fs = require("node:fs");
const path = require("node:path");

const ROOT = process.cwd();
const inputFile = path.join(ROOT, "assets", "css", "main.css");
const outputFile = path.join(ROOT, "assets", "css", "main.min.css");

const source = fs.readFileSync(inputFile, "utf8");
const minified = source
  .replace(/\/\*[\s\S]*?\*\//g, "")
  .replace(/\s+/g, " ")
  .replace(/\s*([{}:;,>])\s*/g, (_match, delimiter) => delimiter)
  .replace(/;}/g, "}")
  .trim();

fs.writeFileSync(outputFile, minified);
console.log(`Minified ${path.relative(ROOT, inputFile)} from ${source.length} to ${minified.length} bytes.`);
