'use client'

import React, { useState, Suspense, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import dynamic from 'next/dynamic'
import { Button, Card, TrustBadge, Navbar, UnifiedGradeDisplay, MethodologyDiagram, LearningLoopDiagram, DisclaimerFooter } from '@/components/ui'
import MobileOptimized from '@/components/ui/MobileOptimized'
import { Shield, Search, BarChart3, CheckCircle, Eye, Clock, Users, GitBranch, Cpu, Layers, ThumbsUp, Brain, RefreshCw, FileCheck, Droplets, MessagesSquare, ScanSearch, Workflow, Target, Wallet, LifeBuoy } from 'lucide-react'
import { useUmamiAnalytics } from '@/hooks/useUmamiAnalytics'

// Dynamic imports for heavy components
const StructuredData = dynamic(() => import('@/components/ui/StructuredData'), {
  ssr: true
})

// Import schema creators from StructuredData component
import { createSoftwareSchema, createOrganizationSchema } from '@/components/ui/StructuredData'

export default function HomePage() {
  const [timeOnPage, setTimeOnPage] = useState(0)
  const t = useTranslations()
  const {
    trackPageView,
    trackHeroCtaClicked,
    trackLaunchAppClicked,
    trackScrollDepth,
    trackEngagementMilestone,
    trackFeatureViewed,
    trackPageExit,
    trackNavClicked
  } = useUmamiAnalytics()

  // Track page view and engagement
  useEffect(() => {
    trackPageView('home', document.referrer)

    // Track scroll depth
    const handleScroll = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      )
      if (scrollPercent >= 25 && scrollPercent < 50) {
        trackScrollDepth(25)
      } else if (scrollPercent >= 50 && scrollPercent < 75) {
        trackScrollDepth(50)
      } else if (scrollPercent >= 75 && scrollPercent < 90) {
        trackScrollDepth(75)
      } else if (scrollPercent >= 90) {
        trackScrollDepth(90)
      }
    }

    window.addEventListener('scroll', handleScroll)

    // Track engagement milestones
    const milestones = [10, 30, 60, 180, 300] // seconds
    const milestoneInterval = setInterval(() => {
      setTimeOnPage(prev => {
        const newTime = prev + 1
        if (milestones.includes(newTime)) {
          trackEngagementMilestone(newTime)
        }
        return newTime
      })
    }, 1000)

    // Track page exit
    window.addEventListener('beforeunload', () => {
      trackPageExit(timeOnPage)
    })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearInterval(milestoneInterval)
    }
  }, [])

  // Fallback translations for SSR
  const fallbackHeadline = "Smart Contract Security Audits in Minutes, Not Weeks"
  const fallbackSubheadline = "AI-powered smart contract analysis. Get comprehensive security audits with verifiable evidence in under 20 minutes."

  // Hero / final-CTA content. Persona-specific variants were retired when the
  // CTAs were repointed to app.spectra-audit.com, so only the default remains.
  //
  // Verifiable trust metrics — no fabricated counters. Values reflect real
  // platform capabilities: 5 scoring dimensions, 95% known-vulnerability
  // detection, ≤20-minute typical audit time.
  const personaContent = {
    ctaText: t('hero.cta.primary'),
    trustMetrics: [
      { type: 'accuracy' as const, value: 95, label: t('hero.trustMetrics.detectionRate') },
      { type: 'speed' as const, value: 20, label: t('hero.trustMetrics.scanTime') },
      { type: 'compliance' as const, value: 5, label: t('hero.trustMetrics.threatTypes') }
    ]
  }

  return (
    <>
      {/* SEO Structured Data */}
      <Suspense fallback={null}>
        <StructuredData type="software" data={createSoftwareSchema()} />
        <StructuredData type="organization" data={createOrganizationSchema()} />
      </Suspense>

      <MobileOptimized>
        <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-50 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900 mobile-performance">
        {/* Navigation */}
        <Navbar />

        {/* ENHANCED Hero Section - Phase 2 Redesign */}
        <section id="main-content" className="relative overflow-hidden pt-32 pb-20">
          {/* Enhanced Background Effects */}
          <div className="absolute inset-0 bg-gradient-hero dark:bg-gradient-hero-dark" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,102,255,0.1),transparent_50%)] dark:bg-[radial-gradient(ellipse_at_top,rgba(0,102,255,0.15),transparent_50%)]" />
          <div className="absolute inset-0 bg-grid-white/5 dark:bg-grid-white/5 [mask-image:linear-gradient(to_bottom,white,transparent,transparent)]" />

          {/* Animated Grid Pattern */}
          <div className="absolute inset-0 opacity-10 dark:opacity-20">
            <div className="absolute inset-0" style={{
              backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.03) 1px, transparent 1px),
                               linear-gradient(to bottom, rgba(0,0,0,0.03) 1px, transparent 1px)`,
              backgroundSize: '60px 60px'
            }} />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-5xl mx-auto">
              {/* Enhanced Authority Badges - Subtle Top Bar */}
              <div className="flex flex-wrap justify-center gap-3 mb-8 animate-slide-up">
                <TrustBadge
                  type="secure"
                  label={t('hero.page.authorityBadges.publiclyVerifiable.label')}
                  description={t('hero.page.authorityBadges.publiclyVerifiable.description')}
                  size="sm"
                  variant="authority"
                  showIcon={true}
                />
                <TrustBadge
                  type="transparent"
                  label={t('hero.page.authorityBadges.verifiableResults.label')}
                  description={t('hero.page.authorityBadges.verifiableResults.description')}
                  size="sm"
                  variant="authority"
                  showIcon={true}
                />
                <TrustBadge
                  type="verified"
                  label={t('hero.page.authorityBadges.aiOrchestrated.label')}
                  description={t('hero.page.authorityBadges.aiOrchestrated.description')}
                  size="sm"
                  variant="authority"
                  showIcon={true}
                />
              </div>

              {/* Dramatically Enhanced Headline with Gradient Text */}
              <h1 className="text-display-xl md:text-display-xl font-display font-extrabold mb-6 leading-tight animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <span className="text-gradient-spectra">
                  {t('hero.page.heroTitle')}
                </span>
                <br />
                <span className="text-neutral-900 dark:text-white">
                  {t('hero.page.heroSubtitle')}
                </span>
              </h1>

              {/* Enhanced Subheadline */}
              <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-300 mb-8 max-w-3xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '0.2s' }}>
                {t('hero.page.heroDescription')}
              </p>

              {/* Unified Grade Display - CENTERPIECE (Replaces SecurityIllustration + GradeBadge) */}
              <div className="mb-12 animate-scale-in" style={{ animationDelay: '0.3s' }}>
                <UnifiedGradeDisplay
                  score={95}
                  size="xl"
                  animated={true}
                  showLabel={true}
                  showDescription={true}
                  variant="detailed"
                />
              </div>

              {/* Enhanced Trust Metrics - Using new metric variant */}
              <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-12 animate-slide-up" style={{ animationDelay: '0.4s' }}>
                {personaContent.trustMetrics.map((metric, index) => (
                  <TrustBadge
                    key={index}
                    type={metric.type}
                    value={metric.value}
                    label={metric.label}
                    variant="metric"
                    size="md"
                    showIcon={true}
                    animated={index === 0}
                    trend={index === 0 ? 'up' : 'neutral'}
                  />
                ))}
              </div>

              {/* Security Audit Section */}
              <div className="max-w-4xl mx-auto mb-8 animate-slide-up" style={{ animationDelay: '0.5s' }}>
                <div className="glass-spectra rounded-2xl p-8 md:p-10 shadow-2xl">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white mb-3">
                      {t('hero.page.securityAuditTitle')}
                    </h3>
                    <p className="text-neutral-600 dark:text-neutral-300 text-base md:text-lg">
                      {t('hero.page.securityAuditSubtitle')}
                    </p>
                  </div>

                  {/* Security Features */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Reproducible Findings */}
                    <div className="text-center p-6 rounded-xl bg-white dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700/50 shadow-sm">
                      <div className="inline-flex p-3 rounded-full bg-spectra-green-500/20 dark:bg-spectra-green-500/10 text-spectra-green-700 dark:text-spectra-green-500 mb-4">
                        <FileCheck className="w-8 h-8" />
                      </div>
                      <h4 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">{t('hero.page.thirdPartyAudited')}</h4>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">{t('hero.page.thirdPartyAuditedDesc')}</p>
                      <div className="mt-3 inline-flex items-center gap-1 text-xs text-spectra-green-700 dark:text-spectra-green-500">
                        <CheckCircle className="w-3 h-3" />
                        {t('hero.page.verified')}
                      </div>
                    </div>

                    {/* Publicly Verifiable */}
                    <div className="text-center p-6 rounded-xl bg-white dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700/50 shadow-sm">
                      <div className="inline-flex p-3 rounded-full bg-spectra-blue-500/20 dark:bg-spectra-blue-500/10 text-spectra-blue-600 dark:text-spectra-blue-500 mb-4">
                        <Eye className="w-8 h-8" />
                      </div>
                      <h4 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">{t('hero.page.openSource')}</h4>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">{t('hero.page.openSourceDesc')}</p>
                      <div className="mt-3 inline-flex items-center gap-1 text-xs text-spectra-blue-600 dark:text-spectra-blue-500">
                        <CheckCircle className="w-3 h-3" />
                        {t('hero.page.transparent')}
                      </div>
                    </div>
                  </div>

                  {/* Trust Message */}
                  <div className="text-center pt-6 border-t border-neutral-200 dark:border-neutral-700/50">
                    <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                      {t('hero.page.trustMessage')}
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* How Security Scores Work - NEW SECTION */}
        <section className="py-16 sm:py-20 md:py-24 relative bg-white dark:bg-neutral-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-display-md md:text-display-lg font-display font-bold text-neutral-900 dark:text-white mb-6 px-4">
                {t('howScoresWork.title')}
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto px-4 leading-relaxed">
                {t('howScoresWork.subtitle')}
              </p>
              <p className="text-sm sm:text-base text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto px-4 mt-4 leading-relaxed">
                {t('howScoresWork.description')}
              </p>
            </div>

            {/* Dimensions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {/* Code Security */}
              <Card variant="spectra" hover className="h-full">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="inline-flex p-3 rounded-xl bg-spectra-green-500/20 text-spectra-green-700 dark:text-spectra-green-500">
                      <Shield className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">
                      {t('howScoresWork.dimensions.codeSecurity.title')}
                    </h3>
                    <div className="inline-block px-2 py-1 rounded bg-spectra-green-500/20 text-spectra-green-700 dark:text-spectra-green-500 text-xs font-mono font-semibold mb-3">
                      {t('howScoresWork.dimensions.codeSecurity.score')}
                    </div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                      {t('howScoresWork.dimensions.codeSecurity.description')}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Tokenomics */}
              <Card variant="spectra" hover className="h-full">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="inline-flex p-3 rounded-xl bg-spectra-blue-500/20 text-spectra-blue-600 dark:text-spectra-blue-500">
                      <BarChart3 className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">
                      {t('howScoresWork.dimensions.tokenomics.title')}
                    </h3>
                    <div className="inline-block px-2 py-1 rounded bg-spectra-blue-500/20 text-spectra-blue-600 dark:text-spectra-blue-500 text-xs font-mono font-semibold mb-3">
                      {t('howScoresWork.dimensions.tokenomics.score')}
                    </div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                      {t('howScoresWork.dimensions.tokenomics.description')}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Liquidity Health */}
              <Card variant="spectra" hover className="h-full">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="inline-flex p-3 rounded-xl bg-spectra-purple-500/20 text-spectra-purple-600 dark:text-spectra-purple-500">
                      <Droplets className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">
                      {t('howScoresWork.dimensions.liquidity.title')}
                    </h3>
                    <div className="inline-block px-2 py-1 rounded bg-spectra-purple-500/20 text-spectra-purple-600 dark:text-spectra-purple-500 text-xs font-mono font-semibold mb-3">
                      {t('howScoresWork.dimensions.liquidity.score')}
                    </div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                      {t('howScoresWork.dimensions.liquidity.description')}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Holder Distribution */}
              <Card variant="spectra" hover className="h-full">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="inline-flex p-3 rounded-xl bg-spectra-yellow-500/20 text-spectra-yellow-700 dark:text-spectra-yellow-500">
                      <Users className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">
                      {t('howScoresWork.dimensions.distribution.title')}
                    </h3>
                    <div className="inline-block px-2 py-1 rounded bg-spectra-yellow-500/20 text-spectra-yellow-700 dark:text-spectra-yellow-500 text-xs font-mono font-semibold mb-3">
                      {t('howScoresWork.dimensions.distribution.score')}
                    </div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                      {t('howScoresWork.dimensions.distribution.description')}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Team & Sentiment - Spans 2 columns */}
              <div className="md:col-span-2 lg:col-span-2">
                <Card variant="spectra" hover className="h-full">
                  <div className="flex flex-col md:flex-row items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="inline-flex p-3 rounded-xl bg-spectra-cyan-500/20 text-spectra-cyan-700 dark:text-spectra-cyan-500">
                        <MessagesSquare className="w-6 h-6" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                          {t('howScoresWork.dimensions.team.title')}
                        </h3>
                        <span className="inline-block px-2 py-1 rounded bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 text-xs font-semibold">
                          {t('howScoresWork.dimensions.team.comingSoon')}
                        </span>
                      </div>
                      <div className="inline-block px-2 py-1 rounded bg-spectra-cyan-500/20 text-spectra-cyan-700 dark:text-spectra-cyan-500 text-xs font-mono font-semibold mb-3">
                        {t('howScoresWork.dimensions.team.score')}
                      </div>
                      <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                        {t('howScoresWork.dimensions.team.description')}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* Overall Score Explanation */}
            <Card variant="glass" className="max-w-3xl mx-auto">
              <div className="text-center">
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-4">
                  {t('howScoresWork.overallScore.title')}
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-6">
                  {t('howScoresWork.overallScore.description')}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  <div className="p-3 rounded-lg bg-spectra-green-500/10 border border-spectra-green-500/20">
                    <div className="text-sm font-bold text-spectra-green-700 dark:text-spectra-green-500">85+</div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400">{t('grades.excellent')}</div>
                  </div>
                  <div className="p-3 rounded-lg bg-spectra-blue-500/10 border border-spectra-blue-500/20">
                    <div className="text-sm font-bold text-spectra-blue-600 dark:text-spectra-blue-500">70-84</div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400">{t('grades.good')}</div>
                  </div>
                  <div className="p-3 rounded-lg bg-spectra-yellow-500/10 border border-spectra-yellow-500/20">
                    <div className="text-sm font-bold text-spectra-yellow-700 dark:text-spectra-yellow-500">55-69</div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400">{t('grades.fair')}</div>
                  </div>
                  <div className="p-3 rounded-lg bg-spectra-red-500/10 border border-spectra-red-500/20">
                    <div className="text-sm font-bold text-spectra-red-600 dark:text-spectra-red-500">&lt;55</div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400">{t('grades.needsWork')}</div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    variant="gradient"
                    className="px-6 py-3"
                    icon={<Search className="w-4 h-4" />}
                    onClick={() => window.open('https://app.spectra-audit.com', '_blank')}
                  >
                    {t('howScoresWork.cta.exploreProjects')}
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="px-6 py-3"
                  >
                    {t('howScoresWork.cta.viewSampleReport')}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* ENHANCED Features Section - Phase 3 Redesign */}
        <section className="py-16 sm:py-20 md:py-24 relative bg-neutral-100/50 dark:bg-neutral-800/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center mb-12 sm:mb-16 md:mb-20">
              <h2 className="text-display-md md:text-display-lg font-display font-bold text-neutral-900 dark:text-white mb-6 px-4">
                {t('hero.page.featuresTitle')}
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto px-4 leading-relaxed">
                {t('hero.page.featuresSubtitle')}
              </p>

              {/* Enhanced Trust Indicators with Badges */}
              <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mt-6 sm:mt-8 px-4">
                <TrustBadge
                  type="transparent"
                  label={t('features.trustIndicators.monitoring')}
                  description={t('features.trustIndicators.monitoringDesc')}
                  variant="default"
                  size="sm"
                  showIcon={false}
                />
                <TrustBadge
                  type="verified"
                  label={t('features.trustIndicators.zeroFalsePositives')}
                  description={t('features.trustIndicators.zeroFalsePositivesDesc')}
                  variant="default"
                  size="sm"
                  showIcon={false}
                />
                <TrustBadge
                  type="secure"
                  label={t('features.trustIndicators.uptime')}
                  description={t('features.trustIndicators.uptimeDesc')}
                  variant="default"
                  size="sm"
                  showIcon={false}
                />
              </div>
            </div>

            {/* Asymmetrical Features Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {/* Feature 1 - Large (spans 2 columns on large screens) */}
              <div className="md:col-span-2 lg:col-span-2">
                <Card variant="hero" hover className="h-full group">
                  <div className="flex flex-col md:flex-row gap-6 sm:gap-8">
                    {/* Icon */}
                    <div className="flex-shrink-0">
                      <div className="inline-flex p-4 sm:p-5 rounded-2xl bg-spectra-green-500/20 text-spectra-green-700 dark:text-spectra-green-500 group-hover:bg-spectra-green-500/30 transition-all">
                        <ScanSearch className="w-8 h-8 sm:w-10 sm:h-10" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white mb-3 group-hover:text-spectra-green-700 dark:group-hover:text-spectra-green-400 transition-colors">
                        {t('hero.page.realTimeMonitoring')}
                      </h3>
                      <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed mb-4">
                        {t('hero.page.realTimeMonitoringDesc')}
                      </p>

                      {/* Metrics */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        <div>
                          <div className="text-2xl sm:text-3xl font-bold text-spectra-green-700 dark:text-spectra-green-500 mb-1">{t('hero.page.avgScanTime')}</div>
                          <div className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">{t('hero.page.avgScanTimeLabel')}</div>
                        </div>
                        <div>
                          <div className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white mb-1">{t('hero.page.fasterThanAudits')}</div>
                          <div className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">{t('hero.page.fasterThanAuditsLabel')}</div>
                        </div>
                        <div>
                          <div className="text-2xl sm:text-3xl font-bold text-spectra-blue-600 dark:text-spectra-blue-500 mb-1">{t('hero.page.automated')}</div>
                          <div className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">{t('hero.page.automatedLabel')}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Feature 2 - Standard */}
              <Card variant="spectra" hover className="h-full group">
                <div className="flex flex-col h-full">
                  <div className="mb-4">
                    <div className="inline-flex p-3 rounded-xl bg-spectra-blue-500/20 text-spectra-blue-600 dark:text-spectra-blue-500 mb-4 group-hover:bg-spectra-blue-500/30 transition-all">
                      <Eye className="w-6 h-6 sm:w-7 sm:h-7" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white mb-3 group-hover:text-spectra-blue-600 dark:group-hover:text-spectra-blue-400 transition-colors">
                      {t('hero.page.verifiableEvidence')}
                    </h3>
                    <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed">
                      {t('hero.page.verifiableEvidenceDesc')}
                    </p>
                  </div>

                  <div className="mt-auto space-y-3">
                    <div className="flex items-center text-spectra-blue-600 dark:text-spectra-blue-500 text-xs sm:text-sm font-medium">
                      <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                      {t('hero.page.openSourceCodebase')}
                    </div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400">
                      {t('hero.page.publicGitHubRepo')}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Feature 3 - Standard */}
              <Card variant="spectra" hover className="h-full group">
                <div className="flex flex-col h-full">
                  <div className="mb-4">
                    <div className="inline-flex p-3 rounded-xl bg-spectra-purple-500/20 text-spectra-purple-600 dark:text-spectra-purple-500 mb-4 group-hover:bg-spectra-purple-500/30 transition-all">
                      <Layers className="w-6 h-6 sm:w-7 sm:h-7" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white mb-3 group-hover:text-spectra-purple-600 dark:group-hover:text-spectra-purple-400 transition-colors">
                      {t('hero.page.comprehensiveCoverage')}
                    </h3>
                    <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed">
                      {t('hero.page.comprehensiveCoverageDesc')}
                    </p>
                  </div>

                  <div className="mt-auto space-y-3">
                    <div className="flex items-center text-spectra-purple-600 dark:text-spectra-purple-500 text-xs sm:text-sm font-medium">
                      <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                      {t('hero.page.vulnerabilityCategories')}
                    </div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400">
                      {t('hero.page.detectionRate')}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Feature 4 - Large (spans 2 columns on large screens) */}
              <div className="md:col-span-2 lg:col-span-2">
                <Card variant="hero" hover className="h-full group">
                  <div className="flex flex-col md:flex-row gap-6 sm:gap-8">
                    {/* Icon */}
                    <div className="flex-shrink-0">
                      <div className="inline-flex p-4 sm:p-5 rounded-2xl bg-spectra-blue-500/20 text-spectra-blue-600 dark:text-spectra-blue-500 group-hover:bg-spectra-blue-500/30 transition-all">
                        <Workflow className="w-8 h-8 sm:w-10 sm:h-10" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white mb-3 group-hover:text-spectra-blue-600 dark:group-hover:text-spectra-blue-400 transition-colors">
                        {t('hero.page.productionReady')}
                      </h3>
                      <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed mb-4">
                        {t('hero.page.productionReadyDesc')}
                      </p>

                      {/* Metrics */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        <div>
                          <div className="text-2xl sm:text-3xl font-bold text-spectra-green-700 dark:text-spectra-green-500 mb-1">{t('hero.page.auditMetricValue')}</div>
                          <div className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">{t('hero.page.thirdPartyVerified')}</div>
                        </div>
                        <div>
                          <div className="text-2xl sm:text-3xl font-bold text-spectra-blue-600 dark:text-spectra-blue-500 mb-1">100%</div>
                          <div className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">{t('hero.page.sourceCode')}</div>
                        </div>
                        <div>
                          <div className="text-2xl sm:text-3xl font-bold text-spectra-purple-600 dark:text-spectra-purple-500 mb-1">{t('hero.page.fastMetricValue')}</div>
                          <div className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">{t('hero.page.scanTime')}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* Additional Trust Indicators Row */}
            <div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <Card variant="stats" className="text-center">
                <Cpu className="w-8 h-8 sm:w-10 sm:h-10 text-spectra-green-700 dark:text-spectra-green-500 mx-auto mb-3" />
                <div className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white mb-1">{t('hero.page.aiPoweredAnalysis')}</div>
                <div className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">{t('hero.page.aiPoweredAnalysisDesc')}</div>
              </Card>

              <Card variant="stats" className="text-center">
                <Target className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-600 dark:text-yellow-400 mx-auto mb-3" />
                <div className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white mb-1">{t('hero.page.highAccuracy')}</div>
                <div className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">{t('hero.page.highAccuracyDesc')}</div>
              </Card>

              <Card variant="stats" className="text-center">
                <Layers className="w-8 h-8 sm:w-10 sm:h-10 text-spectra-blue-600 dark:text-spectra-blue-500 mx-auto mb-3" />
                <div className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white mb-1">{t('hero.page.multiDimensional')}</div>
                <div className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">{t('hero.page.multiDimensionalDesc')}</div>
              </Card>
            </div>
          </div>
        </section>

        {/* Methodology Section — state-of-the-art audit process */}
        <section
          aria-labelledby="methodology-heading"
          className="py-16 sm:py-20 md:py-24 relative bg-white dark:bg-neutral-900"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2
                id="methodology-heading"
                className="text-display-md md:text-display-lg font-display font-bold text-neutral-900 dark:text-white mb-6 px-4"
              >
                {t('methodology.title')}
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto px-4 leading-relaxed">
                {t('methodology.subtitle')}
              </p>
            </div>

            {/* Diagram + Feature cards layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center mb-12">
              {/* Animated diagram */}
              <div className="flex justify-center">
                <MethodologyDiagram />
              </div>

              {/* Feature cards (2x2 grid) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <Card variant="spectra" hover className="h-full">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <div className="inline-flex p-2.5 rounded-lg bg-spectra-blue-500/20 text-spectra-blue-600 dark:text-spectra-blue-500">
                        <GitBranch className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-1.5">
                        {t('methodology.forkTesting.title')}
                      </h3>
                      <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                        {t('methodology.forkTesting.description')}
                      </p>
                    </div>
                  </div>
                </Card>

                <Card variant="spectra" hover className="h-full">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <div className="inline-flex p-2.5 rounded-lg bg-spectra-purple-500/20 text-spectra-purple-600 dark:text-spectra-purple-500">
                        <Cpu className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-1.5">
                        {t('methodology.aiOrchestration.title')}
                      </h3>
                      <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                        {t('methodology.aiOrchestration.description')}
                      </p>
                    </div>
                  </div>
                </Card>

                <Card variant="spectra" hover className="h-full">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <div className="inline-flex p-2.5 rounded-lg bg-spectra-green-500/20 text-spectra-green-700 dark:text-spectra-green-500">
                        <Search className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-1.5">
                        {t('methodology.staticAnalysis.title')}
                      </h3>
                      <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                        {t('methodology.staticAnalysis.description')}
                      </p>
                    </div>
                  </div>
                </Card>

                <Card variant="spectra" hover className="h-full">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <div className="inline-flex p-2.5 rounded-lg bg-spectra-cyan-500/20 text-spectra-cyan-700 dark:text-spectra-cyan-500">
                        <Layers className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-1.5">
                        {t('methodology.multiDimensional.title')}
                      </h3>
                      <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                        {t('methodology.multiDimensional.description')}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Learning Loop Section — how scores stay accurate over time */}
        <section
          aria-labelledby="learning-loop-heading"
          className="py-16 sm:py-20 md:py-24 relative bg-neutral-100/50 dark:bg-neutral-800/20"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2
                id="learning-loop-heading"
                className="text-display-md md:text-display-lg font-display font-bold text-neutral-900 dark:text-white mb-6 px-4"
              >
                {t('learningLoop.title')}
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto px-4 leading-relaxed">
                {t('learningLoop.subtitle')}
              </p>
            </div>

            {/* Diagram on left, feature cards on right */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
              {/* Animated loop diagram */}
              <div className="flex justify-center order-2 lg:order-1">
                <LearningLoopDiagram />
              </div>

              {/* Feature cards stacked */}
              <div className="grid grid-cols-1 gap-4 sm:gap-5 order-1 lg:order-2">
                <Card variant="spectra" hover className="h-full">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <div className="inline-flex p-2.5 rounded-lg bg-spectra-green-500/20 text-spectra-green-700 dark:text-spectra-green-500">
                        <ThumbsUp className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-1.5">
                        {t('learningLoop.userFeedback.title')}
                      </h3>
                      <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                        {t('learningLoop.userFeedback.description')}
                      </p>
                    </div>
                  </div>
                </Card>

                <Card variant="spectra" hover className="h-full">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <div className="inline-flex p-2.5 rounded-lg bg-spectra-purple-500/20 text-spectra-purple-600 dark:text-spectra-purple-500">
                        <BarChart3 className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-1.5">
                        {t('learningLoop.calibration.title')}
                      </h3>
                      <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                        {t('learningLoop.calibration.description')}
                      </p>
                    </div>
                  </div>
                </Card>

                <Card variant="spectra" hover className="h-full">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <div className="inline-flex p-2.5 rounded-lg bg-spectra-cyan-500/20 text-spectra-cyan-700 dark:text-spectra-cyan-500">
                        <Brain className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-1.5">
                        {t('learningLoop.aiOptimization.title')}
                      </h3>
                      <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                        {t('learningLoop.aiOptimization.description')}
                      </p>
                    </div>
                  </div>
                </Card>

                <Card variant="spectra" hover className="h-full">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <div className="inline-flex p-2.5 rounded-lg bg-spectra-blue-500/20 text-spectra-blue-600 dark:text-spectra-blue-500">
                        <RefreshCw className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-1.5">
                        {t('learningLoop.externalAudits.title')}
                      </h3>
                      <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                        {t('learningLoop.externalAudits.description')}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Live Status Section */}
        <section className="py-24 relative bg-neutral-100/50 dark:bg-neutral-800/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white mb-6">
                {t('hero.page.liveStatusTitle')}
              </h2>
              <p className="text-xl text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto">
                {t('hero.page.liveStatusSubtitle')}
              </p>
            </div>

            <Card variant="glass" className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold text-neutral-900 dark:text-white mb-2 flex items-center justify-center gap-2">
                    {t('hero.page.scanTimeValue')}
                    <Clock className="w-5 h-5 text-spectra-blue-600 dark:text-spectra-blue-500" />
                  </div>
                  <div className="text-neutral-500 dark:text-neutral-400">{t('hero.page.scanTimeLabel')}</div>
                  <div className="text-xs text-spectra-blue-600 dark:text-spectra-blue-500 mt-1">{t('hero.page.scanTimeBadge')}</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-spectra-green-700 dark:text-spectra-green-500 mb-2 flex items-center justify-center gap-2">
                    {t('hero.page.dimensionsValue')}
                    <Layers className="w-5 h-5" />
                  </div>
                  <div className="text-neutral-500 dark:text-neutral-400">{t('hero.page.dimensionsLabel')}</div>
                  <div className="text-xs text-spectra-green-700 dark:text-spectra-green-500 mt-1">{t('hero.page.dimensionsBadge')}</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-spectra-blue-600 dark:text-spectra-blue-500 mb-2">{t('hero.page.aiPoweredValue')}</div>
                  <div className="text-neutral-500 dark:text-neutral-400">{t('hero.page.aiPoweredLabel')}</div>
                  <div className="text-xs text-spectra-blue-600 dark:text-spectra-blue-500 mt-1">{t('hero.page.aiPoweredBadge')}</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-spectra-purple-600 dark:text-spectra-purple-500 mb-2">{t('hero.page.transparentValue')}</div>
                  <div className="text-neutral-500 dark:text-neutral-400">{t('hero.page.transparentLabel')}</div>
                  <div className="text-xs text-spectra-purple-600 dark:text-spectra-purple-500 mt-1">{t('hero.page.transparentBadge')}</div>
                </div>
              </div>

              {/* Real-time Status Indicator */}
              <div className="mt-8 pt-6 border-t border-neutral-200 dark:border-neutral-700/50">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-spectra-green-600 dark:bg-spectra-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-spectra-green-700 dark:text-spectra-green-500">{t('hero.page.systemReady')}</span>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-24 relative">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white mb-6">
                {t('hero.page.finalCtaTitle')}
              </h2>
              <p className="text-xl text-neutral-600 dark:text-neutral-300 mb-8">
                {t('hero.page.finalCtaSubtitle')}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
              <Button
                size="xl"
                variant="gradient"
                className="text-lg px-8 py-4"
                icon={<Search className="w-5 h-5" />}
                onClick={() => window.open('https://app.spectra-audit.com', '_blank')}
              >
                {personaContent.ctaText}
              </Button>
              <div className="flex items-center gap-4 text-neutral-500 dark:text-neutral-400 text-sm">
                <CheckCircle className="w-5 h-5 text-spectra-green-700 dark:text-spectra-green-500" />
                {t('hero.page.noCreditCardRequired')}
              </div>
            </div>

            {/* Trust Builders */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="text-center">
                <Wallet className="w-8 h-8 text-spectra-green-700 dark:text-spectra-green-500 mx-auto mb-3" />
                <h3 className="text-neutral-900 dark:text-white font-medium mb-2">{t('hero.page.quickSetup')}</h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  {t('hero.page.quickSetupDesc')}
                </p>
              </div>
              <div className="text-center">
                <LifeBuoy className="w-8 h-8 text-yellow-600 dark:text-yellow-400 mx-auto mb-3" />
                <h3 className="text-neutral-900 dark:text-white font-medium mb-2">{t('hero.page.expertSupport')}</h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  {t('hero.page.expertSupportDesc')}
                </p>
              </div>
              <div className="text-center">
                <Users className="w-8 h-8 text-spectra-blue-600 dark:text-spectra-blue-500 mx-auto mb-3" />
                <h3 className="text-neutral-900 dark:text-white font-medium mb-2">{t('hero.page.communityDriven')}</h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  {t('hero.page.communityDrivenDesc')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Disclaimer Footer — extracted into shared component for reuse */}
        <DisclaimerFooter />
      </div>
    </MobileOptimized>
    </>
  )
}
