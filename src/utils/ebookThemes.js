/**
 * Signature clinical textbook color systems inspired by OpenStax, Elsevier,
 * Bates, and WHO handbooks | shared across React eBook covers and jsPDF exports.
 */

export const EBOOK_PRESET_PALETTES = {
  crimson_navy: {
    id: "crimson_navy",
    label: "Anatomy Crimson & Navy",
    vol: "VOL. I",
    series: "HUMAN SYSTEMS SERIES",
    primaryHex: "#102A43",
    accentHex: "#B91C1C",
    tintHex: "#FEF2F2",
    softBlueHex: "#EFF6FF",
    primaryRgb: [16, 42, 67],
    accentRgb: [185, 28, 28],
    tintRgb: [254, 242, 242],
    softRgb: [239, 246, 255]
  },
  emerald_teal: {
    id: "emerald_teal",
    label: "Pharmacology Emerald & Teal",
    vol: "VOL. II",
    series: "THERAPEUTICS & DOSAGE",
    primaryHex: "#064E3B",
    accentHex: "#0F766E",
    tintHex: "#ECFDF5",
    softBlueHex: "#F0FDFA",
    primaryRgb: [6, 78, 59],
    accentRgb: [13, 148, 136],
    tintRgb: [236, 253, 245],
    softRgb: [240, 253, 250]
  },
  plum_rose: {
    id: "plum_rose",
    label: "Midwifery Plum & Rose",
    vol: "VOL. III",
    series: "MATERNAL & OBSTETRIC CARE",
    primaryHex: "#4C1D95",
    accentHex: "#BE185D",
    tintHex: "#FDF2F8",
    softBlueHex: "#F5F3FF",
    primaryRgb: [76, 29, 149],
    accentRgb: [190, 24, 93],
    tintRgb: [253, 242, 248],
    softRgb: [245, 243, 255]
  },
  cobalt_amber: {
    id: "cobalt_amber",
    label: "Paediatrics Cobalt & Gold",
    vol: "VOL. IV",
    series: "NEWBORN & IMCI POCKETBOOK",
    primaryHex: "#1E3A8A",
    accentHex: "#B45309",
    tintHex: "#FFFBEB",
    softBlueHex: "#EFF6FF",
    primaryRgb: [30, 58, 138],
    accentRgb: [217, 119, 6],
    tintRgb: [255, 251, 235],
    softRgb: [239, 246, 255]
  },
  slate_rust: {
    id: "slate_rust",
    label: "Med-Surg Slate & Rust",
    vol: "VOL. V",
    series: "ACUTE CLINICAL NURSING",
    primaryHex: "#1E293B",
    accentHex: "#C2410C",
    tintHex: "#FFF7ED",
    softBlueHex: "#F8FAFC",
    primaryRgb: [30, 41, 59],
    accentRgb: [194, 65, 12],
    tintRgb: [255, 247, 237],
    softRgb: [248, 250, 252]
  },
  cyan_steel: {
    id: "cyan_steel",
    label: "Foundations Cyan & Steel",
    vol: "VOL. VI",
    series: "IPC & BEDSIDE SKILLS",
    primaryHex: "#134E4A",
    accentHex: "#0369A1",
    tintHex: "#F0F9FF",
    softBlueHex: "#F0FDFA",
    primaryRgb: [19, 78, 74],
    accentRgb: [2, 132, 199],
    tintRgb: [240, 249, 255],
    softRgb: [240, 253, 250]
  },
  forest_gold: {
    id: "forest_gold",
    label: "Community Forest & Ochre",
    vol: "VOL. VII",
    series: "PUBLIC HEALTH & PHC",
    primaryHex: "#14532D",
    accentHex: "#B45309",
    tintHex: "#F0FDF4",
    softBlueHex: "#FEFCE8",
    primaryRgb: [20, 83, 45],
    accentRgb: [180, 83, 9],
    tintRgb: [240, 253, 244],
    softRgb: [254, 252, 232]
  },
  indigo_violet: {
    id: "indigo_violet",
    label: "Psychiatry & Ethics Indigo",
    vol: "VOL. VIII",
    series: "MENTAL HEALTH & UNMC ETHICS",
    primaryHex: "#312E81",
    accentHex: "#7C3AED",
    tintHex: "#F5F3FF",
    softBlueHex: "#EEF2FF",
    primaryRgb: [49, 46, 129],
    accentRgb: [124, 58, 237],
    tintRgb: [245, 243, 255],
    softRgb: [238, 242, 255]
  }
};

const SLUG_TO_PALETTE = {
  "anatomy-physiology-high-yield-guide": "crimson_navy",
  "pharmacology-drug-calculations-uganda": "emerald_teal",
  "maternal-obstetric-emergencies-midwifery": "plum_rose",
  "newborn-paediatric-nursing-essentials": "cobalt_amber",
  "medical-surgical-acute-care-guide": "slate_rust",
  "infection-prevention-control-foundations": "cyan_steel",
  "community-public-health-uganda": "forest_gold",
  "mental-health-ethics-unmeb-prep": "indigo_violet"
};

export function getEbookTheme(ebook, overridePresetId = "") {
  if (overridePresetId && EBOOK_PRESET_PALETTES[overridePresetId]) {
    const base = EBOOK_PRESET_PALETTES[SLUG_TO_PALETTE[ebook?.slug] || "crimson_navy"];
    return {
      ...EBOOK_PRESET_PALETTES[overridePresetId],
      vol: base.vol,
      series: base.series
    };
  }
  const key = SLUG_TO_PALETTE[ebook?.slug];
  if (key && EBOOK_PRESET_PALETTES[key]) return EBOOK_PRESET_PALETTES[key];
  const vals = Object.values(EBOOK_PRESET_PALETTES);
  return vals[0];
}
