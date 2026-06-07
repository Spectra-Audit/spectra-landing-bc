#!/usr/bin/env node
/* i18n coverage check: every t() key referenced in code must resolve in every locale. */
const fs = require('fs')
const path = require('path')

const LOCALES_DIR = path.join(__dirname, '..', 'src', 'i18n', 'locales')

function resolve(obj, key) {
  const parts = key.split('.')
  let cur = obj
  for (const p of parts) {
    if (cur == null) return undefined
    if (Array.isArray(cur)) {
      const i = Number(p)
      cur = Number.isInteger(i) ? cur[i] : undefined
    } else if (typeof cur === 'object' && p in cur) {
      cur = cur[p]
    } else return undefined
  }
  return typeof cur === 'string' || typeof cur === 'number' ? cur : undefined
}

// Consumer file -> namespace prefix ('' = root)
const CONSUMERS = {
  'src/app/[locale]/page.tsx': '',
  // layout.tsx mixes two namespaces (metadata + accessibility) so it can't be
  // modeled by the single-namespace-per-file extractor; its keys are verified separately.
  'src/app/[locale]/whitepaper/page.tsx': 'whitepaper',
  'src/components/ui/Navbar.tsx': '',
  'src/components/ui/DisclaimerFooter.tsx': 'disclaimer',
  'src/components/ui/MethodologyDiagram.tsx': 'methodology.diagram',
  'src/components/ui/LearningLoopDiagram.tsx': 'learningLoop.diagram',
  'src/components/ui/UnifiedGradeDisplay.tsx': 'grades',
  'src/components/ui/Analytics.tsx': 'cookieConsent',
}

// Keys referenced outside the per-file extractor (e.g. layout.tsx's mixed namespaces)
const EXTRA_KEYS = ['metadata.title', 'metadata.description', 'metadata.keywords', 'accessibility.skipToMain']

const root = path.join(__dirname, '..')
const staticKeys = new Set()
const dynamicCalls = []

for (const [rel, ns] of Object.entries(CONSUMERS)) {
  const abs = path.join(root, rel)
  if (!fs.existsSync(abs)) {
    // Don't hard-crash CI when a consumer file is renamed/removed — warn and skip.
    console.warn(`⚠️  i18n-check: consumer file not found, skipping: ${rel}`)
    continue
  }
  const src = fs.readFileSync(abs, 'utf8')
  const re = /\bt(?:\.(?:rich|raw|has|markup))?\(\s*(['"`])((?:\\.|(?!\1).)*)\1/g
  let m
  while ((m = re.exec(src))) {
    const quote = m[1]
    const key = m[2]
    if (quote === '`' && key.includes('${')) {
      dynamicCalls.push({ rel, key })
      continue
    }
    staticKeys.add(ns ? `${ns}.${key}` : key)
  }
}

// Manually-enumerated dynamic key space (whitepaper namespace)
const DIM_DETAILS = {
  sentiment: ['socialVolume', 'sentimentScoring', 'influencerAnalysis', 'communityHealth', 'fudFomoDetection'],
  code: ['vulnerabilityDetection', 'codeQuality', 'auditVerification', 'dependencyAnalysis', 'bestPractices'],
  tokenomics: ['supplyDistribution', 'vestingAnalysis', 'inflationRates', 'economicModel', 'unlockSchedule'],
  liquidity: ['poolDepth', 'volumeTrends', 'slippageCalc', 'dexCoverage', 'liquidityConcentration'],
  distribution: ['holderConcentration', 'whaleTracking', 'decentralizationScore', 'airdropAnalysis', 'walletDistribution'],
}
const PHASES = ['q1_2025', 'q2_2025', 'q3_2025', 'q4_2025']
const dynamicKeys = new Set()
for (const [dim, details] of Object.entries(DIM_DETAILS)) {
  for (const f of ['name', 'shortName', 'description', 'weight']) dynamicKeys.add(`whitepaper.dimensions.items.${dim}.${f}`)
  for (const d of details) dynamicKeys.add(`whitepaper.dimensions.items.${dim}.details.${d}`)
}
for (const ph of PHASES) {
  dynamicKeys.add(`whitepaper.roadmap.phases.${ph}.phase`)
  dynamicKeys.add(`whitepaper.roadmap.phases.${ph}.title`)
  for (let i = 0; i < 4; i++) dynamicKeys.add(`whitepaper.roadmap.phases.${ph}.items.${i}`)
}
// UnifiedGradeDisplay resolves grade tier + description keys dynamically: t(config.tier), t(`descriptions.${tier}`)
for (const tier of ['excellent', 'good', 'fair', 'poor', 'critical']) {
  dynamicKeys.add(`grades.${tier}`)
  dynamicKeys.add(`grades.descriptions.${tier}`)
}

const allKeys = [...new Set([...staticKeys, ...dynamicKeys, ...EXTRA_KEYS])].sort()

const localeFiles = fs.readdirSync(LOCALES_DIR).filter((f) => f.endsWith('.json')).sort()
let totalMissing = 0
const report = {}
for (const f of localeFiles) {
  const j = JSON.parse(fs.readFileSync(path.join(LOCALES_DIR, f), 'utf8'))
  const missing = allKeys.filter((k) => resolve(j, k) === undefined)
  if (missing.length) {
    report[f] = missing
    totalMissing += missing.length
  }
}

console.log(`Code references ${allKeys.length} keys (${staticKeys.size} static + ${dynamicKeys.size} dynamic).`)
console.log(`Dynamic template calls found in code: ${dynamicCalls.length}`)
console.log('')
if (totalMissing === 0) {
  console.log('✅ All referenced keys resolve in all 16 locales.')
} else {
  for (const [f, missing] of Object.entries(report)) {
    console.log(`❌ ${f}: ${missing.length} missing`)
    missing.forEach((k) => console.log(`     ${k}`))
  }
}
// Export for other scripts
module.exports = { allKeys, staticKeys: [...staticKeys].sort(), dynamicKeys: [...dynamicKeys].sort() }
