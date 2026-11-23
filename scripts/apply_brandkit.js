const fs = require('fs');
const path = require('path');

const brandDir = path.join(process.cwd(), 'assets/images/brand');
const stackedDir = path.join(brandDir, 'stacked-brandkit');

// Copy all logo and wordmark files to brandDir
const copyFiles = [
  'wordmark/nursing-uganda-wordmark-light.svg',
  'wordmark/nursing-uganda-wordmark-dark.svg',
  'wordmark/nursing-ug-wordmark-light.svg',
  'wordmark/nursing-ug-wordmark-dark.svg',
  'wordmark/nursing-uganda-wordmark-light.png',
  'wordmark/nursing-uganda-wordmark-light@2x.png',
  'wordmark/nursing-uganda-wordmark-light@4x.png',
  'wordmark/nursing-uganda-wordmark-dark.png',
  'wordmark/nursing-uganda-wordmark-dark@2x.png',
  'wordmark/nursing-uganda-wordmark-dark@4x.png',
  'wordmark/nursing-ug-wordmark-light.png',
  'wordmark/nursing-ug-wordmark-light@2x.png',
  'wordmark/nursing-ug-wordmark-light@4x.png',
  'wordmark/nursing-ug-wordmark-dark.png',
  'wordmark/nursing-ug-wordmark-dark@2x.png',
  'wordmark/nursing-ug-wordmark-dark@4x.png',
  'logo/nursing-uganda-logo-light.png',
  'logo/nursing-uganda-logo-light@2x.png',
  'logo/nursing-uganda-logo-dark.png',
  'logo/nursing-uganda-logo-dark@2x.png',
  'logo/nursing-ug-logo-light.png',
  'logo/nursing-ug-logo-light@2x.png',
  'logo/nursing-ug-logo-dark.png',
  'logo/nursing-ug-logo-dark@2x.png',
  'preview.png'
];

for (const rel of copyFiles) {
  const src = path.join(stackedDir, rel);
  if (fs.existsSync(src)) {
    const basename = path.basename(rel);
    const dest = path.join(brandDir, basename);
    fs.copyFileSync(src, dest);
  }
}

// Helper to build pure-vector logo SVG
function buildVectorLogo(originalSvgPath, iconY, idPrefix) {
  const orig = fs.readFileSync(originalSvgPath, 'utf8');
  const firstGt = orig.indexOf('>');
  const svgOpenTag = orig.slice(0, firstGt + 1);

  // Find where the wordmark group starts: '<g'
  const gIndex = orig.indexOf('<g');
  if (gIndex === -1) {
    throw new Error('Could not find <g in ' + originalSvgPath);
  }
  const body = orig.slice(gIndex); // from '<g ...' to '</svg>'

  const vectorIcon = `  <svg x="0" y="${iconY}" width="57" height="57" viewBox="0 0 512 512">
    <defs>
      <linearGradient id="${idPrefix}-v3Dark" x1="0" y1="0" x2="512" y2="512" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="#252629"/>
        <stop offset="100%" stop-color="#141517"/>
      </linearGradient>
      <linearGradient id="${idPrefix}-v3Purple" x1="250" y1="120" x2="430" y2="390" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="#C084FC"/>
        <stop offset="100%" stop-color="#A435F0"/>
      </linearGradient>
    </defs>
    <rect width="512" height="512" rx="116" fill="url(#${idPrefix}-v3Dark)"/>
    <rect x="14" y="14" width="484" height="484" rx="104" stroke="#FFFFFF" stroke-opacity="0.08" stroke-width="2"/>
    <path d="M88 368V152C88 142 96 134 106 134H134C144 134 152 139 158 148L244 294V134H294V352C294 362 286 370 276 370H248C238 370 230 365 224 356L138 210V368H88Z" fill="#FFFFFF"/>
    <path d="M234 134H294V276C294 308 313 326 342 326C371 326 390 308 390 276V134H440V278C440 338 398 376 342 376C286 376 234 338 234 278V134Z" fill="url(#${idPrefix}-v3Purple)" stroke="#18191B" stroke-width="14" stroke-linejoin="round"/>
    <circle cx="415" cy="96" r="16" fill="#ECEB98"/>
  </svg>\n`;

  return `${svgOpenTag}\n${vectorIcon}  ${body}`;
}

fs.writeFileSync(
  path.join(brandDir, 'nursing-uganda-logo-light.svg'),
  buildVectorLogo(path.join(stackedDir, 'logo/nursing-uganda-logo-light.svg'), 1, 'nug-ug-light'),
  'utf8'
);
fs.writeFileSync(
  path.join(brandDir, 'nursing-uganda-logo-dark.svg'),
  buildVectorLogo(path.join(stackedDir, 'logo/nursing-uganda-logo-dark.svg'), 1, 'nug-ug-dark'),
  'utf8'
);
fs.writeFileSync(
  path.join(brandDir, 'nursing-ug-logo-light.svg'),
  buildVectorLogo(path.join(stackedDir, 'logo/nursing-ug-logo-light.svg'), 2, 'nug-ugbadge-light'),
  'utf8'
);
fs.writeFileSync(
  path.join(brandDir, 'nursing-ug-logo-dark.svg'),
  buildVectorLogo(path.join(stackedDir, 'logo/nursing-ug-logo-dark.svg'), 2, 'nug-ugbadge-dark'),
  'utf8'
);

console.log('Successfully processed BrandKit and generated 100% crisp pure-vector SVGs!');
