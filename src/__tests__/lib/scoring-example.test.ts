import fs from 'fs'
import path from 'path'
import {
  SAMPLE_COMPOSITE_SCORE,
  SAMPLE_HEADLINE_SCORE,
  SCORING_WEIGHT_ROWS,
  dimensionContribution,
} from '@/lib/scoring-example'
import { locales } from '@/i18n/config'

/**
 * The hero Security Score must stay traceable to the sample report.
 *
 * Why this is worth a test. The hero published a bare 95 that no example on
 * the site produced, which is the defect SPE-21 fixed: a headline number with
 * no provenance. The fix only holds while three things agree — the hero
 * readout, the whitepaper's worked example, and /sample-report — and they only
 * agree because all three read this one module. A future edit that types a
 * literal back into any of those pages restores the original defect silently,
 * because nothing about the rendered page looks wrong.
 */
describe('scoring example', () => {
  const read = (p: string) => fs.readFileSync(path.join(process.cwd(), p), 'utf8')

  // The two pages live in the `(pages)` route group — a route group is
  // organizational and does not appear in the URL, so `/` and `/whitepaper`
  // are unchanged. SPE-24 moved them there so the segment's `loading.tsx`
  // stops sitting above `[locale]/[...rest]`, whose `notFound()` was being
  // downgraded to a soft 404 by the streamed shell.
  const HOME = 'src/app/[locale]/(pages)/page.tsx'
  const WHITEPAPER = 'src/app/[locale]/(pages)/whitepaper/page.tsx'

  it('weights sum to 100 for a project with a token', () => {
    expect(SCORING_WEIGHT_ROWS.reduce((sum, row) => sum + row.hasToken, 0)).toBe(100)
  })

  it('composites the illustrative dimensions with the published weights', () => {
    const expected = SCORING_WEIGHT_ROWS.reduce((sum, row) => sum + dimensionContribution(row), 0)
    expect(SAMPLE_COMPOSITE_SCORE).toBeCloseTo(expected, 10)
    expect(SAMPLE_HEADLINE_SCORE).toBe(Math.round(expected))
  })

  it('publishes a headline score inside the 0-100 range the display expects', () => {
    expect(SAMPLE_HEADLINE_SCORE).toBeGreaterThanOrEqual(0)
    expect(SAMPLE_HEADLINE_SCORE).toBeLessThanOrEqual(100)
  })

  it('renders the hero score from this module, not a literal', () => {
    const home = read(HOME)
    expect(home).toContain('score={SAMPLE_HEADLINE_SCORE}')
    // The pre-SPE-21 hardcoded score, and any other bare number, must not come back.
    expect(home).not.toMatch(/<UnifiedGradeDisplay[\s\S]{0,200}?score=\{\d/)
  })

  it('computes the whitepaper worked example from this module, not a literal', () => {
    const whitepaper = read(WHITEPAPER)
    expect(whitepaper).toContain("from '@/lib/scoring-example'")
    expect(whitepaper).toContain('const exampleTotal = SAMPLE_COMPOSITE_SCORE')
    // The weights themselves must not be re-declared here.
    expect(whitepaper).not.toMatch(/hasToken:\s*\d/)
  })

  it('links the hero score and the CTA to the sample report artifact', () => {
    const home = read(HOME)
    expect(home.match(/href=\{SAMPLE_REPORT_PATH\}/g)).toHaveLength(2)
    expect(fs.existsSync(path.join(process.cwd(), 'src/app/(root)/sample-report/page.tsx'))).toBe(true)
  })

  it('keeps /sample-report out of the locale middleware so the route resolves', () => {
    // In the matcher, next-intl rewrites /sample-report to /en/sample-report,
    // which has no route and 404s.
    expect(read('middleware.ts')).toContain('sample-report')
  })

  it('labels the hero score as a sample in every locale', () => {
    for (const locale of locales) {
      const messages = JSON.parse(read(`src/i18n/locales/${locale}.json`))
      expect(typeof messages.hero.page.sampleScoreBadge).toBe('string')
      expect(messages.hero.page.sampleScoreBadge.trim().length).toBeGreaterThan(0)
    }
  })
})
