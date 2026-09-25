import React from 'react'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Navbar, DisclaimerFooter } from '@/components/ui'
import MobileOptimized from '@/components/ui/MobileOptimized'
import WhitepaperAnalyticsTracker from '@/components/ui/WhitepaperAnalyticsTracker'
import DimensionsGrid, { type DimensionsGridItem } from '@/components/ui/DimensionsGrid'
import {
  Shield,
  Code,
  TrendingUp,
  Droplets,
  Users,
  MessageSquare,
  Brain,
  Activity,
  Target,
  Map,
  CheckCircle,
  ArrowRight,
  BookOpen,
  Search,
  GitBranch,
  Calculator,
  Sliders,
  Gauge,
  Layers
} from 'lucide-react'

export default async function WhitepaperPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  // Enable static rendering for this segment — see app/[locale]/layout.tsx
  // for why this must run before any next-intl API. (whitepaper/layout.tsx
  // also calls this for its own generateMetadata/layout invocation; each
  // route segment that reaches for a next-intl API needs its own call.)
  setRequestLocale(locale)

  const t = await getTranslations('whitepaper')

  // Dimension icons mapping
  const dimensionIcons = {
    sentiment: { icon: MessageSquare, color: 'blue', gradient: 'from-blue-500 to-cyan-500', bgLight: 'bg-blue-500/20', text: 'text-blue-500', border: 'border-blue-500/30' },
    code: { icon: Code, color: 'green', gradient: 'from-green-500 to-emerald-500', bgLight: 'bg-green-500/20', text: 'text-green-500', border: 'border-green-500/30' },
    tokenomics: { icon: TrendingUp, color: 'purple', gradient: 'from-purple-500 to-pink-500', bgLight: 'bg-purple-500/20', text: 'text-purple-500', border: 'border-purple-500/30' },
    liquidity: { icon: Droplets, color: 'cyan', gradient: 'from-cyan-500 to-blue-500', bgLight: 'bg-cyan-500/20', text: 'text-cyan-500', border: 'border-cyan-500/30' },
    distribution: { icon: Users, color: 'orange', gradient: 'from-orange-500 to-red-500', bgLight: 'bg-orange-500/20', text: 'text-orange-500', border: 'border-orange-500/30' }
  }

  // Build dimensions array from translations
  const dimensionKeys = ['sentiment', 'code', 'tokenomics', 'liquidity', 'distribution'] as const
  const dimensions = dimensionKeys.map((key) => {
    const detailKeyMap: Record<typeof key, readonly string[]> = {
      sentiment: ['socialVolume', 'sentimentScoring', 'influencerAnalysis', 'communityHealth', 'fudFomoDetection'] as const,
      code: ['vulnerabilityDetection', 'codeQuality', 'auditVerification', 'dependencyAnalysis', 'bestPractices'] as const,
      tokenomics: ['supplyDistribution', 'vestingAnalysis', 'inflationRates', 'economicModel', 'unlockSchedule'] as const,
      liquidity: ['poolDepth', 'volumeTrends', 'slippageCalc', 'dexCoverage', 'liquidityConcentration'] as const,
      distribution: ['holderConcentration', 'whaleTracking', 'decentralizationScore', 'airdropAnalysis', 'walletDistribution'] as const
    }

    const detailKeys = detailKeyMap[key]
    const details = detailKeys.map(detailKey =>
      t(`dimensions.items.${key}.details.${detailKey}`)
    )

    const index = dimensionKeys.indexOf(key)
    const icons = dimensionIcons[key]

    return {
      id: index + 1,
      name: t(`dimensions.items.${key}.name`),
      shortName: t(`dimensions.items.${key}.shortName`),
      icon: icons.icon,
      color: icons.color,
      gradient: icons.gradient,
      bgLight: icons.bgLight,
      text: icons.text,
      border: icons.border,
      description: t(`dimensions.items.${key}.description`),
      details,
      weight: Number(t(`dimensions.items.${key}.weight`))
    }
  })

  // Pre-rendered icon variant for the interactive DimensionsGrid client
  // island — a component *type* (e.g. `MessageSquare`) can't be passed as a
  // prop across the RSC boundary, but an already-rendered element can.
  const dimensionsForGrid: DimensionsGridItem[] = dimensions.map((dimension) => {
    const Icon = dimension.icon
    return {
      id: dimension.id,
      name: dimension.name,
      description: dimension.description,
      details: dimension.details,
      weight: dimension.weight,
      color: dimension.color,
      bgLight: dimension.bgLight,
      text: dimension.text,
      border: dimension.border,
      icon: <Icon className={`w-8 h-8 ${dimension.text}`} />
    }
  })

  // The published scoring weights. Source of truth, and the only thing these
  // two columns may ever be copied from:
  //   spectra/services/scoring/phase4_metrics.py
  //   PHASE4_WEIGHTS_HAS_TOKEN / PHASE4_WEIGHTS_NO_TOKEN
  //
  // What used to be here was the `TECHNICAL_WEIGHTS_WITH_TOKEN` table from
  // sentiment.py (code 45 / distribution 15 / tokenomics 15 / liquidity 15),
  // which produces `score_technical` — a display-only subscore that is not an
  // input to the headline score at all. The no-token column was a 70/30
  // two-input model that exists in no file.
  //
  // `sample` is the illustrative per-dimension score in the worked example
  // below. The example's products and total are computed from these numbers
  // rather than written out, so the two can't drift apart.
  const weightRows = [
    { key: 'rowCode', Icon: Code, tone: 'text-green-600 dark:text-green-400', hasToken: 35, noToken: 55, sample: 82 },
    { key: 'rowDistribution', Icon: Users, tone: 'text-orange-600 dark:text-orange-400', hasToken: 10, noToken: null, sample: 71 },
    { key: 'rowTokenomics', Icon: TrendingUp, tone: 'text-purple-600 dark:text-purple-400', hasToken: 10, noToken: null, sample: 64 },
    { key: 'rowLiquidity', Icon: Droplets, tone: 'text-cyan-600 dark:text-cyan-400', hasToken: 10, noToken: null, sample: 77 },
    { key: 'rowSentiment', Icon: MessageSquare, tone: 'text-blue-600 dark:text-blue-400', hasToken: 10, noToken: 25, sample: 80 },
    { key: 'rowVelocity', Icon: Activity, tone: 'text-sky-600 dark:text-sky-400', hasToken: 5, noToken: null, sample: 55 },
    { key: 'rowHolderGrowth', Icon: Users, tone: 'text-emerald-600 dark:text-emerald-400', hasToken: 5, noToken: null, sample: 62 },
    { key: 'rowRealizedPnl', Icon: TrendingUp, tone: 'text-amber-600 dark:text-amber-400', hasToken: 5, noToken: null, sample: 48 },
    { key: 'rowNetFlow', Icon: GitBranch, tone: 'text-indigo-600 dark:text-indigo-400', hasToken: 5, noToken: null, sample: 58 },
    { key: 'rowWhaleDumpRisk', Icon: Shield, tone: 'text-rose-600 dark:text-rose-400', hasToken: 5, noToken: 20, sample: 69 }
  ] as const

  const exampleTotal = weightRows.reduce((sum, row) => sum + (row.sample * row.hasToken) / 100, 0)

  // Build roadmap array from translations
  const phaseKeys = ['q1_2025', 'q2_2025', 'q3_2025', 'q4_2025'] as const
  const roadmap = phaseKeys.map((key) => {
    const itemsKey = `roadmap.phases.${key}.items` as const
    return {
      phase: t(`roadmap.phases.${key}.phase`),
      status: key === 'q1_2025' ? 'completed' : key === 'q2_2025' ? 'current' : 'upcoming',
      title: t(`roadmap.phases.${key}.title`),
      items: [
        t(`${itemsKey}.0`),
        t(`${itemsKey}.1`),
        t(`${itemsKey}.2`),
        t(`${itemsKey}.3`)
      ]
    }
  })

  return (
    <MobileOptimized>
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-50 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900">
        {/* Render-nothing client island for the page-view / whitepaper-viewed
            analytics side effect. */}
        <WhitepaperAnalyticsTracker />

        <Navbar />

        {/* Hero Section */}
        <section className="relative overflow-hidden pt-32 pb-20">
          <div className="absolute inset-0 bg-gradient-hero" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,102,255,0.15),transparent_50%)]" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-spectra-blue-500/20 border border-spectra-blue-500/30 text-spectra-blue-400 mb-6">
                <BookOpen className="w-4 h-4" />
                <span className="text-sm font-medium">{t('badge')}</span>
              </div>

              <h1 className="text-display-lg md:text-display-xl font-display font-extrabold mb-6 leading-tight">
                <span className="text-gradient-spectra">{t('hero.title')}</span>
                <br />
                <span className="text-neutral-900 dark:text-white">{t('hero.subtitle')}</span>
              </h1>

              <p className="text-xl text-neutral-600 dark:text-neutral-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                {t('hero.description')}
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="#dimensions"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-spectra-blue-500 to-spectra-purple-500 text-white font-semibold hover:opacity-90 transition-opacity"
                >
                  <Layers className="w-5 h-5" />
                  {t('hero.buttons.exploreDimensions')}
                </a>
                <a
                  href="#scoring"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  <Calculator className="w-5 h-5" />
                  {t('hero.buttons.scoringAlgorithm')}
                </a>
                <a
                  href="#roadmap"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  <Map className="w-5 h-5" />
                  {t('hero.buttons.viewRoadmap')}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Introduction */}
        <section className="py-20 bg-neutral-100/50 dark:bg-neutral-800/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-6">
                {t('introduction.title')}
              </h2>
              <div className="space-y-4 text-neutral-600 dark:text-neutral-300 leading-relaxed">
                <p>{t('introduction.paragraph1')}</p>
                <p>
                  {t('introduction.paragraph2.before')}
                  <span className="text-spectra-blue-500 dark:text-spectra-blue-400 font-semibold">{t('introduction.paragraph2.highlight')}</span>
                  {t('introduction.paragraph2.after')}
                </p>
              </div>

              {/*
                Stats. The "5 / Core Dimensions" tile is gone: its whole content
                was the number, and with ten weighted inputs for a project that
                has a token and three for one that does not, there is no honest
                number to show. Three tiles left, so md:grid-cols-3.
              */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-12">
                {[
                  { value: t('introduction.stats.detectionRate.value'), label: t('introduction.stats.detectionRate.label'), icon: Target },
                  { value: t('introduction.stats.analysisTime.value'), label: t('introduction.stats.analysisTime.label'), icon: Gauge },
                  { value: t('introduction.stats.riskCategories.value'), label: t('introduction.stats.riskCategories.label'), icon: Shield }
                ].map((stat, i) => (
                  <div key={i} className="text-center p-4 rounded-xl bg-white dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700/50 hover:border-neutral-300 dark:hover:border-neutral-600/50 transition-colors shadow-sm">
                    <stat.icon className="w-6 h-6 text-spectra-blue-500 dark:text-spectra-blue-400 mx-auto mb-2" />
                    <div className="text-2xl md:text-3xl font-bold text-spectra-blue-500 dark:text-spectra-blue-400 mb-1">{stat.value}</div>
                    <div className="text-sm text-neutral-500 dark:text-neutral-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* The deep-analysis dimensions - New Grid Layout */}
        <section id="dimensions" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-display-md md:text-display-lg font-display font-bold text-neutral-900 dark:text-white mb-6">
                {t('dimensions.title.before')}
                <span className="text-gradient-spectra">{t('dimensions.title.highlight')}</span>
                {t('dimensions.title.after')}
              </h2>
              <p className="text-xl text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto">
                {t('dimensions.subtitle')}
              </p>
            </div>

            {/* Central Score + Dimensions Grid */}
            <div className="max-w-6xl mx-auto mb-16">
              {/* Score Display Row */}
              <div className="flex justify-center mb-12">
                <div className="glass-spectra rounded-2xl p-8 border-2 border-spectra-blue-500/50 shadow-2xl shadow-spectra-blue-500/20 dark:shadow-spectra-blue-500/10 text-center bg-white/80 dark:bg-neutral-800/80">
                  <Gauge className="w-16 h-16 text-spectra-blue-500 mx-auto mb-4" />
                  <div className="text-5xl font-bold text-neutral-900 dark:text-white mb-2">{t('dimensions.scoreDisplay.score')}</div>
                  <div className="text-lg text-neutral-600 dark:text-neutral-300 mb-1">{t('dimensions.scoreDisplay.label')}</div>
                  <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-spectra-green-500/20 dark:bg-spectra-green-500/10 text-spectra-green-600 dark:text-spectra-green-400 text-sm font-semibold">
                    <CheckCircle className="w-4 h-4" />
                    {t('dimensions.scoreDisplay.excellent')}
                  </div>
                </div>
              </div>

              {/* Connecting Lines Visualization */}
              <div className="hidden lg:flex justify-center mb-8">
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-0.5 bg-gradient-to-r from-transparent via-spectra-blue-500/50 to-transparent max-w-32" />
                  <div className="text-neutral-500 dark:text-neutral-400 text-sm flex items-center gap-2">
                    <Layers className="w-4 h-4" />
                    <span>{t('dimensions.convergeLabel')}</span>
                  </div>
                  <div className="flex-1 h-0.5 bg-gradient-to-r from-transparent via-spectra-blue-500/50 to-transparent max-w-32" />
                </div>
              </div>

              {/* Dimensions Grid — hover-state client island (the only
                  interactive piece of this section) */}
              <DimensionsGrid dimensions={dimensionsForGrid} />
            </div>

            {/* Weights Summary Bar */}
            <div className="max-w-4xl mx-auto">
              <div className="glass-spectra rounded-2xl p-6 border border-neutral-200 dark:border-neutral-700/50 bg-white/80 dark:bg-neutral-800/80">
                <h4 className="text-lg font-bold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-spectra-blue-500" />
                  {t('dimensions.weightDistribution.title')}
                </h4>
                <div className="space-y-3">
                  {dimensions.map((dim) => {
                    const Icon = dim.icon
                    return (
                      <div key={dim.id} className="flex items-center gap-4">
                        <Icon className={`w-5 h-5 ${dim.text} flex-shrink-0`} />
                        <div className="flex-1">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-neutral-700 dark:text-neutral-300 font-medium">{dim.name}</span>
                            <span className={`font-bold ${dim.text}`}>{dim.weight}%</span>
                          </div>
                          <div className="h-2.5 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                            <div
                              className={`h-full bg-gradient-to-r ${dim.gradient} transition-all duration-700 ease-out`}
                              style={{ width: `${Math.min(dim.weight * 2, 100)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700/50 text-center">
                  <span className="text-sm text-neutral-500 dark:text-neutral-400">{t('dimensions.weightDistribution.totalLabel')}</span>
                  <span className="text-lg font-bold text-spectra-green-600 dark:text-spectra-green-400">{t('dimensions.weightDistribution.totalValue')}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Security Score Calculation Section */}
        <section id="scoring" className="py-20 bg-neutral-100/50 dark:bg-neutral-800/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-spectra-purple-500/20 dark:bg-spectra-purple-500/10 border border-spectra-purple-500/30 text-spectra-purple-600 dark:text-spectra-purple-400 mb-6">
                <Calculator className="w-4 h-4" />
                <span className="text-sm font-medium">{t('scoring.badge')}</span>
              </div>
              <h2 className="text-display-md md:text-display-lg font-display font-bold text-neutral-900 dark:text-white mb-6">
                {t('scoring.title.before')}
                <span className="text-gradient-spectra">{t('scoring.title.highlight')}</span>
                {t('scoring.title.after')}
              </h2>
              <p className="text-xl text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto">
                {t('scoring.subtitle')}
              </p>
            </div>

            {/* Formula Display */}
            <div className="max-w-4xl mx-auto mb-12">
              <div className="glass-spectra rounded-2xl p-8 border border-spectra-purple-500/30 bg-gradient-to-r from-spectra-purple-500/10 to-spectra-blue-500/10 dark:from-spectra-purple-500/5 dark:to-spectra-blue-500/5">
                <div className="text-center mb-6">
                  <div className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">{t('scoring.formula.title')}</div>
                  <div className="text-2xl md:text-3xl font-mono font-bold text-neutral-900 dark:text-white">
                    {t('scoring.formula.formula')}
                  </div>
                </div>
                {/*
                  This row read "Dynamic Weights × AI Adjustments = Accuracy".
                  `aggregate_scores` applies no adjustment factor and no
                  accuracy term; it sums the measured dimensions against the
                  published weights and divides by the weights it actually
                  used. The three steps below are that, in order.
                */}
                <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-neutral-500 dark:text-neutral-400">
                  <span className="flex items-center gap-1">
                    <Layers className="w-4 h-4" />
                    {t('scoring.formula.measuredDimensions')}
                  </span>
                  <span>→</span>
                  <span className="flex items-center gap-1">
                    <Sliders className="w-4 h-4" />
                    {t('scoring.formula.publishedWeights')}
                  </span>
                  <span>→</span>
                  <span className="flex items-center gap-1 text-spectra-green-600 dark:text-spectra-green-400">
                    <Target className="w-4 h-4" />
                    {t('scoring.formula.securityScore')}
                  </span>
                </div>
              </div>
            </div>

            {/* How It Works */}
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
              {/* Weight Distribution */}
              <div className="glass-spectra rounded-2xl p-6 border border-neutral-200 dark:border-neutral-700/50 bg-white/80 dark:bg-neutral-800/80">
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-spectra-blue-500" />
                  {t('scoring.weightDistribution.title')}
                </h3>
                <p className="text-neutral-600 dark:text-neutral-300 text-sm mb-4">
                  {t('scoring.weightDistribution.description')}
                </p>
                <div className="space-y-3">
                  {dimensions.map((dim) => (
                    <div key={dim.id} className="flex items-center gap-3">
                      <dim.icon className={`w-4 h-4 ${dim.text} flex-shrink-0`} />
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-neutral-700 dark:text-neutral-300">{dim.shortName}</span>
                          <span className={`font-semibold ${dim.text}`}>{dim.weight}%</span>
                        </div>
                        <div className="h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r ${dim.gradient} transition-all duration-500`}
                            style={{ width: `${dim.weight}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Optimization */}
              <div className="glass-spectra rounded-2xl p-6 border border-neutral-200 dark:border-neutral-700/50 bg-white/80 dark:bg-neutral-800/80">
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-spectra-purple-500" />
                  {t('scoring.aiOptimization.title')}
                </h3>
                <p className="text-neutral-600 dark:text-neutral-300 text-sm mb-4">
                  {t('scoring.aiOptimization.description')}
                </p>
                <ul className="space-y-2">
                  {[
                    t('scoring.aiOptimization.factors.exploitPatterns'),
                    t('scoring.aiOptimization.factors.marketCorrelation'),
                    t('scoring.aiOptimization.factors.projectCategorization'),
                    t('scoring.aiOptimization.factors.threatIntelligence'),
                    t('scoring.aiOptimization.factors.communityFeedback')
                  ].map((factor, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300">
                      <div className="w-2 h-2 rounded-full bg-spectra-blue-500 flex-shrink-0" />
                      <span>{factor}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Calculation Example */}
            <div className="max-w-4xl mx-auto">
              <div className="glass-spectra rounded-2xl p-8 border border-neutral-200 dark:border-neutral-700/50 bg-white/80 dark:bg-neutral-800/80">
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-6 flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-spectra-green-500" />
                  {t('scoring.calculationExample.title')}
                </h3>

                <div className="bg-neutral-100 dark:bg-neutral-900/50 rounded-xl p-6 font-mono text-sm mb-6 border border-neutral-200 dark:border-neutral-700">
                  <div className="text-neutral-500 dark:text-neutral-400 mb-4">{t('scoring.calculationExample.comment')}</div>
                  <div className="space-y-2">
                    {weightRows.map(({ key, tone, hasToken, sample }) => (
                      <div key={key}>
                        <span className={tone}>{t(`dimensions.weightTable.${key}`)}</span>
                        <span className="text-neutral-400">:</span>
                        <span className="text-neutral-900 dark:text-white">{` ${sample}/100 × ${hasToken}% = ${((sample * hasToken) / 100).toFixed(2)}`}</span>
                      </div>
                    ))}
                    <div className="border-t border-neutral-300 dark:border-neutral-700 pt-2 mt-2">
                      <span className="text-spectra-green-600 dark:text-spectra-green-400 font-semibold">{t('scoring.calculationExample.compositeScore')}</span>
                      <span className="text-spectra-green-600 dark:text-spectra-green-400 font-bold">{` ${exampleTotal.toFixed(2)}/100`}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-spectra-green-500/10 dark:bg-spectra-green-500/5 border border-spectra-green-500/30 rounded-lg mb-8">
                  <CheckCircle className="w-5 h-5 text-spectra-green-600 dark:text-spectra-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-spectra-green-600 dark:text-spectra-green-400 font-semibold mb-1">{t('scoring.calculationExample.renormalisationTitle')}</div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-300">
                      {t('scoring.calculationExample.renormalisationDescription')}
                    </p>
                  </div>
                </div>

                {/* Weight Table — has-token vs no-token comparison */}
                <div className="mt-4">
                  <div className="mb-4">
                    <h4 className="text-lg font-bold text-neutral-900 dark:text-white mb-2 flex items-center gap-2">
                      <Sliders className="w-5 h-5 text-spectra-blue-500" />
                      {t('dimensions.weightTable.title')}
                    </h4>
                    <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                      {t('dimensions.weightTable.subtitle')}
                    </p>
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-700">
                    <table className="w-full text-sm">
                      <thead className="bg-neutral-100 dark:bg-neutral-900/50">
                        <tr>
                          <th className="text-left px-4 py-3 font-semibold text-neutral-700 dark:text-neutral-300 border-b border-neutral-200 dark:border-neutral-700">
                            {t('dimensions.weightTable.headerDimension')}
                          </th>
                          <th className="text-center px-4 py-3 font-semibold text-neutral-700 dark:text-neutral-300 border-b border-neutral-200 dark:border-neutral-700">
                            {t('dimensions.weightTable.headerHasToken')}
                          </th>
                          <th className="text-center px-4 py-3 font-semibold text-neutral-700 dark:text-neutral-300 border-b border-neutral-200 dark:border-neutral-700">
                            {t('dimensions.weightTable.headerNoToken')}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-neutral-800/50">
                        {weightRows.map(({ key, Icon, tone, hasToken, noToken }) => (
                          <tr key={key} className="border-b border-neutral-200 dark:border-neutral-700/50">
                            <td className="px-4 py-3 text-neutral-700 dark:text-neutral-300 flex items-center gap-2">
                              <Icon className={`w-4 h-4 ${tone} flex-shrink-0`} />
                              {t(`dimensions.weightTable.${key}`)}
                            </td>
                            <td className="px-4 py-3 text-center font-bold text-spectra-blue-600 dark:text-spectra-blue-400">{hasToken}%</td>
                            {noToken === null ? (
                              <td className="px-4 py-3 text-center text-neutral-400 dark:text-neutral-500 italic">{t('dimensions.weightTable.notApplicable')}</td>
                            ) : (
                              <td className="px-4 py-3 text-center font-bold text-spectra-purple-600 dark:text-spectra-purple-400">{noToken}%</td>
                            )}
                          </tr>
                        ))}
                        <tr className="bg-neutral-50 dark:bg-neutral-900/40">
                          <td className="px-4 py-3 font-semibold text-neutral-700 dark:text-neutral-300">
                            {t('dimensions.weightTable.rowTotal')}
                          </td>
                          <td className="px-4 py-3 text-center font-bold text-neutral-700 dark:text-neutral-300">
                            {weightRows.reduce((sum, row) => sum + row.hasToken, 0)}%
                          </td>
                          <td className="px-4 py-3 text-center font-bold text-neutral-700 dark:text-neutral-300">
                            {weightRows.reduce((sum, row) => sum + (row.noToken ?? 0), 0)}%
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <p className="mt-4 text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed italic">
                    {t('dimensions.weightTable.footnote')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-display-md md:text-display-lg font-display font-bold text-neutral-900 dark:text-white mb-6">
                {t('howItWorks.title.before')}
                <span className="text-gradient-spectra">{t('howItWorks.title.highlight')}</span>
                {t('howItWorks.title.after')}
              </h2>
              <p className="text-xl text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto">
                {t('howItWorks.subtitle')}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="glass-spectra rounded-2xl p-8 text-center border border-neutral-200 dark:border-neutral-700/50 bg-white/80 dark:bg-neutral-800/80 hover:border-spectra-blue-500/50 transition-all">
                <div className="inline-flex p-4 rounded-full bg-spectra-blue-500/20 dark:bg-spectra-blue-500/10 text-spectra-blue-500 mb-6">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">{t('howItWorks.steps.dataCollection.title')}</h3>
                <p className="text-neutral-500 dark:text-neutral-400">
                  {t('howItWorks.steps.dataCollection.description')}
                </p>
              </div>

              <div className="glass-spectra rounded-2xl p-8 text-center border border-neutral-200 dark:border-neutral-700/50 bg-white/80 dark:bg-neutral-800/80 hover:border-spectra-purple-500/50 transition-all">
                <div className="inline-flex p-4 rounded-full bg-spectra-purple-500/20 dark:bg-spectra-purple-500/10 text-spectra-purple-500 mb-6">
                  <Brain className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">{t('howItWorks.steps.aiAnalysis.title')}</h3>
                <p className="text-neutral-500 dark:text-neutral-400">
                  {t('howItWorks.steps.aiAnalysis.description')}
                </p>
              </div>

              <div className="glass-spectra rounded-2xl p-8 text-center border border-neutral-200 dark:border-neutral-700/50 bg-white/80 dark:bg-neutral-800/80 hover:border-spectra-green-500/50 transition-all">
                <div className="inline-flex p-4 rounded-full bg-spectra-green-500/20 dark:bg-spectra-green-500/10 text-spectra-green-500 mb-6">
                  <Shield className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">{t('howItWorks.steps.riskScoring.title')}</h3>
                <p className="text-neutral-500 dark:text-neutral-400">
                  {t('howItWorks.steps.riskScoring.description')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Roadmap */}
        <section id="roadmap" className="py-20 bg-neutral-100/50 dark:bg-neutral-800/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-display-md md:text-display-lg font-display font-bold text-neutral-900 dark:text-white mb-6">
                {t('roadmap.title.before')}
                <span className="text-gradient-spectra">{t('roadmap.title.highlight')}</span>
                {t('roadmap.title.after')}
              </h2>
              <p className="text-xl text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto">
                {t('roadmap.subtitle')}
              </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-6">
              {roadmap.map((phase) => (
                <div
                  key={phase.phase}
                  className="glass-spectra rounded-2xl p-8 border border-neutral-200 dark:border-neutral-700/50 bg-white/80 dark:bg-neutral-800/80 hover:border-neutral-300 dark:hover:border-neutral-600/50 transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-6">
                    {/* Status Badge */}
                    <div className="flex-shrink-0">
                      {phase.status === 'completed' && (
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-spectra-green-500/20 dark:bg-spectra-green-500/10 border border-spectra-green-500/30 text-spectra-green-600 dark:text-spectra-green-400 text-sm font-semibold">
                          <CheckCircle className="w-4 h-4" />
                          {t('roadmap.status.completed')}
                        </div>
                      )}
                      {phase.status === 'current' && (
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-spectra-blue-500/20 dark:bg-spectra-blue-500/10 border border-spectra-blue-500/30 text-spectra-blue-600 dark:text-spectra-blue-400 text-sm font-semibold">
                          <Activity className="w-4 h-4" />
                          {t('roadmap.status.inProgress')}
                        </div>
                      )}
                      {phase.status === 'upcoming' && (
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-200 dark:bg-neutral-700/50 border border-neutral-300 dark:border-neutral-600/30 text-neutral-500 dark:text-neutral-400 text-sm font-semibold">
                          <Target className="w-4 h-4" />
                          {t('roadmap.status.upcoming')}
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-sm font-mono text-neutral-500 dark:text-neutral-400">{phase.phase}</span>
                        <h3 className="text-xl font-bold text-neutral-900 dark:text-white">{phase.title}</h3>
                      </div>

                      <ul className="space-y-2">
                        {phase.items.map((item: string, i: number) => (
                          <li key={i} className="flex items-start gap-2 text-neutral-600 dark:text-neutral-300">
                            <ArrowRight className="w-5 h-5 text-spectra-blue-500 flex-shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}

              {/* Expansion Note */}
              <div className="glass-spectra rounded-2xl p-8 border border-spectra-blue-500/30 bg-gradient-to-r from-spectra-blue-500/10 to-spectra-purple-500/10 dark:from-spectra-blue-500/5 dark:to-spectra-purple-500/5">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="inline-flex p-3 rounded-xl bg-spectra-blue-500/20 dark:bg-spectra-blue-500/10 text-spectra-blue-600 dark:text-spectra-blue-400">
                      <GitBranch className="w-6 h-6" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">{t('roadmap.expansion.title')}</h4>
                    <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
                      {t('roadmap.expansion.description')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Shield className="w-16 h-16 text-spectra-blue-500 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-6">
              {t('cta.title')}
            </h2>
            <p className="text-xl text-neutral-600 dark:text-neutral-300 mb-8">
              {t('cta.description')}
            </p>
            <a
              href="https://app.spectra-audit.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-spectra-blue-500 to-spectra-purple-500 text-white font-semibold text-lg hover:opacity-90 transition-opacity"
            >
              <Search className="w-5 h-5" />
              {t('cta.button')}
            </a>
          </div>
        </section>

        {/* Persistent disclaimer footer — same shared component used on landing page */}
        <DisclaimerFooter />
      </div>
    </MobileOptimized>
  )
}
