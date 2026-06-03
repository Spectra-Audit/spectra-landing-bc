#!/usr/bin/env node
/* Inject the full-sweep strings (grade display, hero authority badges, feature
 * badge descriptions, stat values) into every locale. Reuses existing translated
 * values for grade 'excellent', the two authority labels, and the 'Audit' stat. */
const fs = require('fs')
const path = require('path')

const LOCALES_DIR = path.join(__dirname, '..', 'src', 'i18n', 'locales')
const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'sweep-i18n-data.json'), 'utf8'))

const get = (o, k) => k.split('.').reduce((c, p) => (c && typeof c === 'object' ? c[p] : undefined), o)
function set(o, k, v) {
  const parts = k.split('.')
  let cur = o
  for (let i = 0; i < parts.length - 1; i++) {
    if (typeof cur[parts[i]] !== 'object' || cur[parts[i]] === null) cur[parts[i]] = {}
    cur = cur[parts[i]]
  }
  cur[parts[parts.length - 1]] = v
}

const files = fs.readdirSync(LOCALES_DIR).filter((f) => f.endsWith('.json')).sort()
for (const file of files) {
  const locale = file.replace('.json', '')
  const d = data[locale]
  if (!d) { console.log(`SKIP ${locale}`); continue }
  const full = path.join(LOCALES_DIR, file)
  const json = JSON.parse(fs.readFileSync(full, 'utf8'))

  // Reused existing translations (must already exist in every locale)
  const excellent = get(json, 'whitepaper.dimensions.scoreDisplay.excellent')
  const pvLabel = get(json, 'hero.page.openSource')              // "Publicly Verifiable"
  const vrLabel = get(json, 'hero.page.thirdPartyVerified')      // "Verifiable Results"
  const auditValue = get(json, 'learningLoop.diagram.nodes.audit') // "Audit"
  for (const [name, val] of Object.entries({ excellent, pvLabel, vrLabel, auditValue })) {
    if (val == null) throw new Error(`${locale}: missing reuse source for ${name}`)
  }

  // grades namespace
  set(json, 'grades.excellent', excellent)
  set(json, 'grades.good', d.grades.good)
  set(json, 'grades.fair', d.grades.fair)
  set(json, 'grades.poor', d.grades.poor)
  set(json, 'grades.critical', d.grades.critical)
  set(json, 'grades.needsWork', d.grades.needsWork)
  set(json, 'grades.security', d.grades.security)
  set(json, 'grades.labelFormat', d.grades.labelFormat)
  set(json, 'grades.descriptions.excellent', d.grades.descExcellent)
  set(json, 'grades.descriptions.good', d.grades.descGood)
  set(json, 'grades.descriptions.fair', d.grades.descFair)
  set(json, 'grades.descriptions.poor', d.grades.descPoor)
  set(json, 'grades.descriptions.critical', d.grades.descCritical)

  // hero authority badges (labels reuse existing keys)
  set(json, 'hero.page.authorityBadges.publiclyVerifiable.label', pvLabel)
  set(json, 'hero.page.authorityBadges.publiclyVerifiable.description', d.authority.pvDesc)
  set(json, 'hero.page.authorityBadges.verifiableResults.label', vrLabel)
  set(json, 'hero.page.authorityBadges.verifiableResults.description', d.authority.vrDesc)
  set(json, 'hero.page.authorityBadges.aiOrchestrated.label', d.authority.aioLabel)
  set(json, 'hero.page.authorityBadges.aiOrchestrated.description', d.authority.aioDesc)

  // hero stat values (Audit reuses diagram node label)
  set(json, 'hero.page.auditMetricValue', auditValue)
  set(json, 'hero.page.fastMetricValue', d.stats.fastValue)

  // feature trust-indicator descriptions (siblings of existing labels)
  set(json, 'features.trustIndicators.monitoringDesc', d.features.monitoringDesc)
  set(json, 'features.trustIndicators.zeroFalsePositivesDesc', d.features.accuracyDesc)
  set(json, 'features.trustIndicators.uptimeDesc', d.features.uptimeDesc)

  const out = JSON.stringify(json, null, 2) + (locale === 'en' ? '' : '\n')
  fs.writeFileSync(full, out)
  console.log(`✓ ${locale}: grades + authorityBadges + stat values + feature descriptions`)
}
console.log('\nDone.')
