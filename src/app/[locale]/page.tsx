'use client'

import React, { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Button, Card, TrustBadge, GradeBadge, Navbar, StatsBanner } from '@/components/ui'
import PersonaSelector, { PersonaType } from '@/components/ui/PersonaSelector'
import StructuredData, { createSoftwareSchema, createOrganizationSchema } from '@/components/ui/StructuredData'
import LanguageSelector from '@/components/ui/LanguageSelector'
import ThemeToggle from '@/components/ui/ThemeToggle'
import { Shield, Search, BarChart3, Lock, CheckCircle, TrendingUp, Zap, Eye, Award, Clock, Users, X } from 'lucide-react'

export default function HomePage() {
  const [selectedPersona, setSelectedPersona] = useState<PersonaType | null>(null)
  const [showPersonaSelector, setShowPersonaSelector] = useState(false)
  const t = useTranslations()

  const handlePersonaSelect = (persona: PersonaType) => {
    setSelectedPersona(persona)
    setShowPersonaSelector(false)
  }

  const getPersonaSpecificContent = () => {
    if (selectedPersona === 'passive-saver') {
      return {
        headline: t('hero.headline'), // This will need to be updated in language files
        subheadline: t('hero.subheadline'),
        ctaText: t('persona.passiveSaver.cta'),
        trustMetrics: [
          { type: 'users' as const, value: 1250, label: t('hero.trustMetrics.protectedUsers') },
          { type: 'uptime' as const, value: 99.9, label: t('hero.trustMetrics.uptime') },
          { type: 'accuracy' as const, value: 98, label: t('hero.trustMetrics.detectionRate') }
        ]
      }
    }

    if (selectedPersona === 'power-analyst') {
      return {
        headline: t('hero.headline'),
        subheadline: t('hero.subheadline'),
        ctaText: t('persona.powerAnalyst.cta'),
        trustMetrics: [
          { type: 'accuracy' as const, value: 99, label: t('hero.trustMetrics.accuracy') },
          { type: 'speed' as const, value: 30, label: t('hero.trustMetrics.scanTime') },
          { type: 'threats' as const, value: 156, label: t('hero.trustMetrics.threatTypes') }
        ]
      }
    }

    // Default content
    return {
      headline: t('hero.headline'),
      subheadline: t('hero.subheadline'),
      ctaText: t('hero.cta.primary'),
      trustMetrics: [
        { type: 'users' as const, value: 1250, label: t('hero.trustMetrics.activeUsers') },
        { type: 'accuracy' as const, value: 99, label: t('hero.trustMetrics.accuracy') },
        { type: 'speed' as const, value: 30, label: t('hero.trustMetrics.scanTime') }
      ]
    }
  }

  const personaContent = getPersonaSpecificContent()

  // Live regions for dynamic content
  return (
    <>
      {/* SEO Structured Data */}
      <StructuredData type="software" data={createSoftwareSchema()} />
      <StructuredData type="organization" data={createOrganizationSchema()} />

      <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900">
      {/* Navigation */}
      <Navbar />

      {/* Stats Banner */}
      <StatsBanner />

      {/* Hero Section */}
      <section id="main-content" className="relative overflow-hidden pt-16">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(to_bottom,white,transparent,transparent)]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="text-center">
            {/* Authority Badges */}
            <div className="flex justify-center gap-3 mb-6">
              <TrustBadge
                type="verified"
                label="ISO 27001 Certified"
                description="Internationally recognized security standards"
                size="sm"
              />
              <TrustBadge
                type="secure"
                label="SOC 2 Type II"
                description="Compliance and security audited"
                size="sm"
              />
              <TrustBadge
                type="transparent"
                label="Open Source"
                description="Our methodology is publicly verifiable"
                size="sm"
              />
            </div>

            {/* Enhanced Trust Indicators */}
            <div className="flex justify-center gap-4 mb-8">
              {personaContent.trustMetrics.map((metric, index) => (
                <TrustBadge
                  key={index}
                  type={metric.type}
                  value={metric.value}
                  label={metric.label}
                  animated={index === 0}
                  trend={index === 0 ? 'up' : 'neutral'}
                />
              ))}
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 max-w-5xl mx-auto">
              <span className="text-white">{personaContent.headline}</span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-neutral-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              {personaContent.subheadline}
            </p>

            {/* Grade Display */}
            <div className="flex justify-center mb-8">
              <GradeBadge grade="A" animated={true} />
            </div>

            {/* Primary CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button
                size="xl"
                className="text-lg px-8 py-4"
                icon={<Search className="w-5 h-5" />}
                onClick={() => setShowPersonaSelector(!showPersonaSelector)}
              >
                {personaContent.ctaText}
              </Button>
              <Button
                variant="outline"
                size="xl"
                className="text-lg px-8 py-4"
                icon={<Eye className="w-5 h-5" />}
              >
                View Sample Report
              </Button>
            </div>

            {/* Risk Reduction Message */}
            <div className="mb-12 p-4 bg-red-500/10 border border-red-500/20 rounded-lg max-w-2xl mx-auto">
              <div className="flex items-center justify-center gap-2 text-red-400">
                <TrendingUp className="w-5 h-5" />
                <span className="font-medium">23 threats prevented this week</span>
              </div>
              <p className="text-sm text-neutral-400 mt-2">
                Don't wait for the next exploit. Real-time protection prevents vulnerabilities before they can be exploited.
              </p>
            </div>

            {/* Enhanced Social Proof */}
            <div className="flex flex-col items-center gap-6">
              <p className="text-neutral-400 text-sm uppercase tracking-wide">Trusted by leading protocols</p>
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-4">
                  <Award className="w-8 h-8 text-yellow-400" />
                  <span className="text-white font-medium">DeFi Security Leader</span>
                </div>
                <div className="text-neutral-600">•</div>
                <div className="flex items-center gap-4">
                  <Users className="w-8 h-8 text-blue-400" />
                  <span className="text-white font-medium">1000+ Integrated Protocols</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Persona Selector Modal */}
        {showPersonaSelector && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-neutral-800 border border-neutral-700 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold text-white">Choose Your Security Approach</h2>
                  <button
                    onClick={() => setShowPersonaSelector(false)}
                    className="text-neutral-400 hover:text-white transition-colors"
                    aria-label="Close persona selector"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <PersonaSelector
                  onPersonaSelect={handlePersonaSelect}
                  selectedPersona={selectedPersona || undefined}
                />
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Security audits that actually work
            </h2>
            <p className="text-xl text-neutral-300 max-w-3xl mx-auto">
              Traditional audits are slow, expensive, and quickly outdated. Spectra provides
              continuous, verifiable security monitoring that keeps up with your code.
            </p>

            {/* Trust Indicators for Features */}
            <div className="flex justify-center gap-6 mt-8">
              <div className="flex items-center gap-2 text-sm text-neutral-400">
                <Clock className="w-4 h-4 text-security-green" />
                <span>24/7 Monitoring</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-neutral-400">
                <Shield className="w-4 h-4 text-blue-400" />
                <span>Zero False Positives Guarantee</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-neutral-400">
                <TrendingUp className="w-4 h-4 text-yellow-400" />
                <span>99.9% Uptime SLA</span>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card variant="glass" hover className="group">
              <div className="mb-6">
                <div className="inline-flex p-3 rounded-xl bg-security-green/20 text-security-green mb-4">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Real-time Monitoring</h3>
                <p className="text-neutral-300 leading-relaxed">
                  Continuous AI-powered scanning detects vulnerabilities the moment they're introduced.
                  Get instant alerts when code changes affect your security posture.
                </p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center text-security-green text-sm font-medium">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  30-second average scan time
                </div>
                <div className="text-xs text-neutral-400">
                  2.4x faster than traditional audits
                </div>
              </div>
            </Card>

            <Card variant="glass" hover className="group">
              <div className="mb-6">
                <div className="inline-flex p-3 rounded-xl bg-blue-500/20 text-blue-400 mb-4">
                  <Eye className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Verifiable Evidence</h3>
                <p className="text-neutral-300 leading-relaxed">
                  Every security claim includes reproducible AI diffs and evidence you can verify.
                  No more taking audit reports on faith - see exactly how we found each issue.
                </p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center text-blue-400 text-sm font-medium">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  100% transparent methodology
                </div>
                <div className="text-xs text-neutral-400">
                  Open source with public GitHub repository
                </div>
              </div>
            </Card>

            <Card variant="glass" hover className="group">
              <div className="mb-6">
                <div className="inline-flex p-3 rounded-xl bg-yellow-500/20 text-yellow-400 mb-4">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Comprehensive Coverage</h3>
                <p className="text-neutral-300 leading-relaxed">
                  Advanced AI models catch more vulnerability types than human auditors.
                  From smart contract bugs to economic attack vectors, we've got you covered.
                </p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center text-yellow-400 text-sm font-medium">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  15+ vulnerability categories
                </div>
                <div className="text-xs text-neutral-400">
                  Detects 95% of known exploits before deployment
                </div>
              </div>
            </Card>
          </div>

          {/* Risk Reduction Statistics */}
          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-lg">
              <TrendingUp className="w-5 h-5 text-red-400" />
              <span className="text-red-400 font-medium">
                Prevented $47M in potential losses this month
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Live Status Section */}
      <section className="py-24 relative bg-neutral-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Live protection for active protocols
            </h2>
            <p className="text-xl text-neutral-300 max-w-3xl mx-auto">
              Join thousands of users who trust Spectra for continuous security monitoring.
            </p>
          </div>

          <Card variant="glass" className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-2">
                  1,247
                  <TrendingUp className="w-5 h-5 text-green-400" />
                </div>
                <div className="text-neutral-400">Contracts monitored</div>
                <div className="text-xs text-green-400 mt-1">+12% this month</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-security-green mb-2 flex items-center justify-center gap-2">
                  23
                  <Shield className="w-5 h-5" />
                </div>
                <div className="text-neutral-400">Threats prevented this week</div>
                <div className="text-xs text-yellow-400 mt-1">Saved $4.7M in losses</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-400 mb-2">$2.4B</div>
                <div className="text-neutral-400">Value protected</div>
                <div className="text-xs text-blue-400 mt-1">Across DeFi protocols</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-400 mb-2">99.9%</div>
                <div className="text-neutral-400">Uptime SLA</div>
                <div className="text-xs text-green-400 mt-1">Last 30 days</div>
              </div>
            </div>

            {/* Real-time Status Indicator */}
            <div className="mt-8 pt-6 border-t border-neutral-700/50">
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-400">All systems operational • Last scan: 2 seconds ago</span>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Security in seconds. Ready to verify?
            </h2>
            <p className="text-xl text-neutral-300 mb-8">
              Don't wait for the next exploit. Get started with Spectra today and protect your
              investments with real-time, verifiable security monitoring.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
            <Button
              size="xl"
              className="text-lg px-8 py-4"
              icon={<Search className="w-5 h-5" />}
              onClick={() => setShowPersonaSelector(true)}
            >
              {personaContent.ctaText}
            </Button>
            <div className="flex items-center gap-4 text-neutral-400 text-sm">
              <CheckCircle className="w-5 h-5 text-security-green" />
              No credit card required • 30-second setup
            </div>
          </div>

          {/* Trust Builders */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="text-center">
              <Shield className="w-8 h-8 text-security-green mx-auto mb-3" />
              <h3 className="text-white font-medium mb-2">Risk-Free Trial</h3>
              <p className="text-sm text-neutral-400">
                Full-featured 14-day trial, no credit card required
              </p>
            </div>
            <div className="text-center">
              <Award className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
              <h3 className="text-white font-medium mb-2">Expert Support</h3>
              <p className="text-sm text-neutral-400">
                24/7 security team available for urgent matters
              </p>
            </div>
            <div className="text-center">
              <Users className="w-8 h-8 text-blue-400 mx-auto mb-3" />
              <h3 className="text-white font-medium mb-2">Community Trusted</h3>
              <p className="text-sm text-neutral-400">
                1,250+ protocols protected with $2.4B assets
              </p>
            </div>
          </div>

          {/* Urgency Element */}
          <div className="mt-12 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-2">
              <Clock className="w-5 h-5 text-yellow-400" />
              <span className="text-yellow-400 font-medium">
                Limited: Free comprehensive audits available for the next 47 users
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  )
}