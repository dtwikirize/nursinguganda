/**
 * generate_pwa_icons.js
 * Generates all PWA icon sizes from the SVG favicon.
 * Produces:
 *   - Standard icons (any purpose): 72, 96, 128, 144, 152, 192, 384, 512
 *   - Maskable icon (192, 512): icon centred in safe zone (80% of canvas)
 *   - Apple touch icon: 180x180
 *
 * Run: node scripts/generate_pwa_icons.js
 */

const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const SVG_SRC = path.join(__dirname, "../assets/images/nursing-uganda-favicon.svg");
const OUT_DIR = path.join(__dirname, "../assets/images/pwa");

// Ensure output directory exists
fs.mkdirSync(OUT_DIR, { recursive: true });

// Standard icon sizes
const STANDARD_SIZES = [32, 72, 96, 128, 144, 152, 180, 192, 384, 512];

// Maskable sizes — icon needs padding so the subject stays in the safe zone
// Safe zone = centre circle with radius = 40% of icon size (so icon fills 80%)
const MASKABLE_SIZES = [192, 512];

async function generateStandard(size) {
  const outPath = path.join(OUT_DIR, `icon-${size}x${size}.png`);
  await sharp(SVG_SRC)
    .resize(size, size)
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(outPath);
  console.log(`  ✓ icon-${size}x${size}.png`);
  return outPath;
}

async function generateMaskable(size) {
  // For maskable icons, we need the icon content to fit inside the safe zone
  // (a centre circle of 80% diameter). We shrink the icon to 72% of the canvas
  // and composite it centred onto a solid brand-green background.
  const iconSize = Math.round(size * 0.72);
  const offset = Math.round((size - iconSize) / 2);

  const outPath = path.join(OUT_DIR, `icon-maskable-${size}x${size}.png`);

  // Resize just the SVG content (no rx background — we add our own solid bg)
  // The SVG already has a rect with rx, but for maskable we want a full bleed bg
  const iconBuffer = await sharp(SVG_SRC)
    .resize(iconSize, iconSize)
    .png()
    .toBuffer();

  await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: 15, g: 127, b: 79, alpha: 1 } // #0f7f4f brand green
    }
  })
    .composite([{ input: iconBuffer, left: offset, top: offset, blend: "over" }])
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(outPath);

  console.log(`  ✓ icon-maskable-${size}x${size}.png`);
  return outPath;
}

async function generateSplash(width, height) {
  // Splash screen: solid brand background with centred icon
  const iconSize = Math.min(width, height) * 0.28;
  const left = Math.round((width - iconSize) / 2);
  const top = Math.round((height - iconSize) / 2);
  const outPath = path.join(OUT_DIR, `splash-${width}x${height}.png`);

  const iconBuffer = await sharp(SVG_SRC)
    .resize(Math.round(iconSize), Math.round(iconSize))
    .png()
    .toBuffer();

  await sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 15, g: 127, b: 79, alpha: 1 }
    }
  })
    .composite([{ input: iconBuffer, left, top }])
    .png({ compressionLevel: 9 })
    .toFile(outPath);

  console.log(`  ✓ splash-${width}x${height}.png`);
}

async function main() {
  console.log("Generating PWA icons from:", SVG_SRC);
  console.log("Output:", OUT_DIR);
  console.log("");

  console.log("Standard icons:");
  for (const size of STANDARD_SIZES) {
    await generateStandard(size);
  }

  console.log("\nMaskable icons:");
  for (const size of MASKABLE_SIZES) {
    await generateMaskable(size);
  }

  console.log("\nSplash screens (common iOS/Android sizes):");
  const SPLASHES = [
    [1170, 2532], // iPhone 12/13/14 Pro
    [1284, 2778], // iPhone 12/13/14 Pro Max
    [750,  1334], // iPhone 8
    [828,  1792], // iPhone XR / 11
    [1125, 2436], // iPhone X / XS
    [1242, 2688], // iPhone XS Max
    [1536, 2048], // iPad 9.7"
    [1668, 2388], // iPad Pro 11"
    [2048, 2732], // iPad Pro 12.9"
  ];
  for (const [w, h] of SPLASHES) {
    await generateSplash(w, h);
  }

  console.log("\nDone.");
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
