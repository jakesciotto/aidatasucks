// Single source of truth for grading. Imported by page, table, and badge
// so the mapping can't drift across files.

const SCORE = { yes: 2, partial: 1, no: 0 };

// Sort order, best to worst.
export const gradeOrder = { "A+": 1, "A-": 2, B: 3, "B-": 4, C: 5, D: 6, F: 7 };

// Grade -> CSS class (colors defined in globals.css).
export const gradeClass = {
  "A+": "grade-a-plus",
  "A-": "grade-a-minus",
  B: "grade-b",
  "B-": "grade-b-minus",
  C: "grade-c",
  D: "grade-d",
  F: "grade-f",
};

// Legend copy for the methodology section.
export const gradeLegend = [
  { grade: "A+", desc: "Full coverage: cost API, usage API, and billing export", wide: false },
  { grade: "A-", desc: "Full cost and usage APIs, partial billing export", wide: false },
  { grade: "B", desc: "Good visibility, partial billing export", wide: false },
  { grade: "B-", desc: "Good cost/usage visibility, no billing export", wide: false },
  { grade: "C", desc: "Partial coverage, significant limitations", wide: false },
  { grade: "D", desc: "Minimal data, painful to use", wide: false },
  { grade: "F", desc: "Flying blind. No programmatic cost visibility.", wide: true },
];

// Grade = programmatic transparency across cost API, usage API, billing export.
// Explicit tiers run first: they intentionally reward strong cost+usage access
// even when billing export lags. Anything not caught falls through to a score.
// Editorial, not a strict formula.
export function calcGrade(vendor) {
  const { costApi, usageApi, billingExport } = vendor;

  if (costApi === "yes" && usageApi === "yes" && billingExport === "yes")
    return "A+";
  if (costApi === "yes" && usageApi === "yes" && billingExport === "partial")
    return "A-";
  if (costApi !== "no" && usageApi !== "no" && billingExport === "no")
    return "B-";

  const base = SCORE[costApi] + SCORE[usageApi] + SCORE[billingExport];
  const hasVisibility = costApi !== "no" || usageApi !== "no";
  const score = base + (hasVisibility ? 1 : 0);
  if (score >= 4) return "B";
  if (score >= 3) return "C";
  if (score >= 1) return "D";
  return "F";
}
