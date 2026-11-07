/**
 * The published scoring weights, and the one illustrative project this site
 * scores with them.
 *
 * `hasToken` / `noToken` are the real weights. Source of truth, and the only
 * thing they may ever be copied from:
 *   spectra/services/scoring/phase4_metrics.py
 *   PHASE4_WEIGHTS_HAS_TOKEN / PHASE4_WEIGHTS_NO_TOKEN
 *
 * `sample` is the per-dimension score of the illustrative project. It is not a
 * measurement of anything: no contract was scanned to produce these ten
 * numbers. Every score the site shows outside the app is derived from them, so
 * that the hero readout, the whitepaper's worked example and /sample-report
 * cannot disagree about what the product would output. Previously the hero
 * published a bare 95 that no example on the site added up to.
 *
 * Row labels are not here: they live in the `whitepaper.dimensions.weightTable`
 * translation namespace, which is already localized for all 16 locales.
 */
export const SCORING_WEIGHT_ROWS = [
  { key: 'rowCode', hasToken: 35, noToken: 55, sample: 82 },
  { key: 'rowDistribution', hasToken: 10, noToken: null, sample: 71 },
  { key: 'rowTokenomics', hasToken: 10, noToken: null, sample: 64 },
  { key: 'rowLiquidity', hasToken: 10, noToken: null, sample: 77 },
  { key: 'rowSentiment', hasToken: 10, noToken: 25, sample: 80 },
  { key: 'rowVelocity', hasToken: 5, noToken: null, sample: 55 },
  { key: 'rowHolderGrowth', hasToken: 5, noToken: null, sample: 62 },
  { key: 'rowRealizedPnl', hasToken: 5, noToken: null, sample: 48 },
  { key: 'rowNetFlow', hasToken: 5, noToken: null, sample: 58 },
  { key: 'rowWhaleDumpRisk', hasToken: 5, noToken: 20, sample: 69 },
] as const

export type ScoringWeightRow = (typeof SCORING_WEIGHT_ROWS)[number]

/** A dimension's share of the composite: score x weight. */
export function dimensionContribution(row: {
  sample: number
  hasToken: number
}): number {
  return (row.sample * row.hasToken) / 100
}

/**
 * Composite for the illustrative project, as the published formula computes it:
 * Score = Sigma (Dimension x Weight) / Sigma Weight. Every dimension is
 * measured in this example, so Sigma Weight is 100 and no renormalisation
 * applies.
 */
export const SAMPLE_COMPOSITE_SCORE = SCORING_WEIGHT_ROWS.reduce(
  (sum, row) => sum + dimensionContribution(row),
  0
)

/**
 * What the app would display for that composite. `score_general` is stored as
 * an integer 0-100, so the fractional composite is rounded for display.
 */
export const SAMPLE_HEADLINE_SCORE = Math.round(SAMPLE_COMPOSITE_SCORE)

/** Path of the sample report artifact. Not locale-prefixed — see the route. */
export const SAMPLE_REPORT_PATH = '/sample-report'
