import type { Metadata } from 'next'
import Link from 'next/link'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { ArrowLeft, ArrowRight, BookOpen, Info, Search } from 'lucide-react'
import Card from '@/components/ui/Card'
import UnifiedGradeDisplay from '@/components/ui/UnifiedGradeDisplay'
import DisclaimerFooter from '@/components/ui/DisclaimerFooter'
import { defaultLocale } from '@/i18n/config'
import { SITE_URL } from '@/lib/site'
import {
  SAMPLE_COMPOSITE_SCORE,
  SAMPLE_HEADLINE_SCORE,
  SCORING_WEIGHT_ROWS,
  dimensionContribution,
} from '@/lib/scoring-example'

const TITLE = 'Sample Security Report'
const DESCRIPTION =
  'An illustrative Spectra report: one composite Security Score, the ten weighted dimensions behind it, and the arithmetic that produces it. Sample data, not an audit of a real project.'
const CANONICAL = `${SITE_URL}/sample-report`

export const metadata: Metadata = {
  title: `${TITLE} | Spectra Audit`,
  description: DESCRIPTION,
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: 'article',
    siteName: 'Spectra Audit',
    url: CANONICAL,
    images: [{ url: `${SITE_URL}/images/og-image.jpg`, width: 1200, height: 630, alt: TITLE }],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: [`${SITE_URL}/images/og-image.jpg`],
  },
}

/**
 * /sample-report — the artifact the hero Security Score and the "View Sample
 * Report" CTA point at.
 *
 * Why it exists: the home page published a Security Score with no provenance.
 * A reader had no way to find out what the number was, what went into it, or
 * whether anything had been measured to produce it. This page is the answer,
 * and the hero score is now this report's headline score (see
 * @/lib/scoring-example) rather than an independent decorative figure.
 *
 * Why it is not localized: it sits in the `(root)` segment, outside `[locale]`,
 * alongside `/not-found` and `/error` — one English document at one URL, the
 * same treatment `/llms.txt` gets. Translating a specimen report into 16
 * languages would be 200+ strings of machine-translated audit vocabulary, which
 * is a worse outcome than one correct English artifact. The dimension names are
 * still read from the translation layer at the default locale so this page and
 * the whitepaper's weight table always name the dimensions identically.
 *
 * `setRequestLocale` is what lets next-intl resolve those strings statically
 * here, where no locale segment set a request locale — without it this route
 * renders dynamically.
 */
export default async function SampleReportPage() {
  setRequestLocale(defaultLocale)

  const t = await getTranslations({ locale: defaultLocale, namespace: 'whitepaper.dimensions.weightTable' })
  const tGrades = await getTranslations({ locale: defaultLocale, namespace: 'grades' })

  // One string rather than JSX text interleaved with expressions: a space that
  // sits between an expression and a line-wrapped text run gets trimmed away,
  // which is how this paragraph first shipped reading "falls in the Goodband".
  const composite = SAMPLE_COMPOSITE_SCORE.toFixed(2)
  const bandSentence =
    `${SAMPLE_HEADLINE_SCORE}/100 falls in the ${tGrades('good')} band (70\u201384). ` +
    `The composite computes to ${composite}; the app stores and displays the score as a whole ` +
    `number, so ${composite} is shown as ${SAMPLE_HEADLINE_SCORE}.`

  const rows = SCORING_WEIGHT_ROWS.map((row) => ({
    label: t(row.key),
    score: row.sample,
    weight: row.hasToken,
    contribution: dimensionContribution(row),
  }))

  return (
    <main className="min-h-screen bg-white dark:bg-ink-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-spectra-blue-600 dark:hover:text-spectra-blue-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to spectra-audit.com
        </Link>

        <header className="mt-8">
          <span className="inline-flex items-center rounded-full border border-spectra-yellow-500/40 bg-spectra-yellow-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-spectra-yellow-700 dark:text-spectra-yellow-500">
            Sample
          </span>
          <h1 className="mt-4 text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white">{TITLE}</h1>
          <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-300">
            This is the shape of a Spectra report: one composite Security Score from 0 to 100, the ten
            weighted dimensions behind it, and the arithmetic that turns them into the headline number.
          </p>
        </header>

        {/* The provenance statement. This is the point of the page: anyone who
            arrives here from the hero score must learn, before any number, that
            nothing was scanned to produce it. */}
        <Card variant="warning" className="mt-8 p-6">
          <h2 className="flex items-center gap-2 text-base font-bold text-neutral-900 dark:text-white">
            <Info className="w-5 h-5 flex-shrink-0" />
            What this is, and what it is not
          </h2>
          <ul className="mt-4 space-y-2 text-sm text-neutral-700 dark:text-neutral-300">
            <li>
              <strong>It is a specimen.</strong> The subject is a hypothetical project with a tradeable
              token for which every dimension could be measured. No contract was scanned, and no real
              project is being described, graded or recommended here.
            </li>
            <li>
              <strong>The weights are real.</strong> The weight column is the live weighting the scoring
              service applies, published in full in the{' '}
              <Link href="/whitepaper" className="underline hover:no-underline">
                whitepaper
              </Link>
              .
            </li>
            <li>
              <strong>The per-dimension scores are invented</strong>{' '}
              for this specimen, and are the same ten numbers as the whitepaper&apos;s worked example.
              They are chosen to be plausible, not flattering.
            </li>
            <li>
              <strong>For a report with real findings</strong>, run an audit in the app on a contract you
              care about. Real reports carry the evidence behind each dimension; a specimen cannot.
            </li>
          </ul>
        </Card>

        <section className="mt-12" aria-labelledby="headline-score">
          <h2 id="headline-score" className="text-2xl font-bold text-neutral-900 dark:text-white">
            Headline score
          </h2>
          <div className="mt-6 flex flex-col items-center">
            <UnifiedGradeDisplay score={SAMPLE_HEADLINE_SCORE} size="xl" showLabel showDescription />
            <p className="mt-6 max-w-xl text-center text-sm text-neutral-500 dark:text-neutral-400">
              {bandSentence}
            </p>
          </div>
        </section>

        <section className="mt-12" aria-labelledby="dimension-breakdown">
          <h2 id="dimension-breakdown" className="text-2xl font-bold text-neutral-900 dark:text-white">
            Dimension breakdown
          </h2>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
            Score = &Sigma; (Dimension &times; Weight) &divide; &Sigma; Weight. Every dimension is measured
            in this specimen, so the weights sum to 100 and nothing is renormalised.
          </p>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <caption className="sr-only">
                Illustrative per-dimension scores, their published weights, and each dimension&apos;s
                contribution to the composite score
              </caption>
              <thead>
                <tr className="bg-neutral-50 dark:bg-neutral-800/50">
                  <th scope="col" className="text-left px-4 py-3 font-semibold text-neutral-700 dark:text-neutral-300 border-b border-neutral-200 dark:border-neutral-700">
                    {t('headerDimension')}
                  </th>
                  <th scope="col" className="text-center px-4 py-3 font-semibold text-neutral-700 dark:text-neutral-300 border-b border-neutral-200 dark:border-neutral-700">
                    Score
                  </th>
                  <th scope="col" className="text-center px-4 py-3 font-semibold text-neutral-700 dark:text-neutral-300 border-b border-neutral-200 dark:border-neutral-700">
                    Weight
                  </th>
                  <th scope="col" className="text-center px-4 py-3 font-semibold text-neutral-700 dark:text-neutral-300 border-b border-neutral-200 dark:border-neutral-700">
                    Contribution
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-neutral-800/30">
                {rows.map((row) => (
                  <tr key={row.label} className="border-b border-neutral-200 dark:border-neutral-700/50">
                    <th scope="row" className="text-left px-4 py-3 font-normal text-neutral-700 dark:text-neutral-300">
                      {row.label}
                    </th>
                    <td className="px-4 py-3 text-center font-mono text-neutral-900 dark:text-white">
                      {row.score}/100
                    </td>
                    <td className="px-4 py-3 text-center font-mono text-spectra-blue-600 dark:text-spectra-blue-400">
                      {row.weight}%
                    </td>
                    <td className="px-4 py-3 text-center font-mono text-neutral-900 dark:text-white">
                      {row.contribution.toFixed(2)}
                    </td>
                  </tr>
                ))}
                <tr className="bg-neutral-50 dark:bg-neutral-800/60 font-bold">
                  <th scope="row" className="text-left px-4 py-3 text-neutral-900 dark:text-white">
                    {t('rowTotal')}
                  </th>
                  <td className="px-4 py-3" />
                  <td className="px-4 py-3 text-center font-mono text-spectra-blue-600 dark:text-spectra-blue-400">
                    {SCORING_WEIGHT_ROWS.reduce((sum, row) => sum + row.hasToken, 0)}%
                  </td>
                  <td className="px-4 py-3 text-center font-mono text-spectra-green-600 dark:text-spectra-green-400">
                    {SAMPLE_COMPOSITE_SCORE.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-xs text-neutral-500 dark:text-neutral-400">{t('footnote')}</p>
        </section>

        <div className="mt-12 flex flex-col sm:flex-row gap-4">
          <a
            href="https://app.spectra-audit.com"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-spectra-blue-500 to-spectra-purple-500 px-6 py-3 font-semibold text-white shadow-md transition-transform hover:-translate-y-0.5"
          >
            <Search className="w-4 h-4" />
            Audit a real contract
            <ArrowRight className="w-4 h-4" />
          </a>
          <Link
            href="/whitepaper"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral-300 dark:border-neutral-700 px-6 py-3 font-semibold text-neutral-700 dark:text-neutral-200 transition-colors hover:border-spectra-blue-500/60"
          >
            <BookOpen className="w-4 h-4" />
            Read the scoring methodology
          </Link>
        </div>

        <DisclaimerFooter className="mt-12" />
      </div>
    </main>
  )
}
