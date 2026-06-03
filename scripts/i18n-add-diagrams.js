#!/usr/bin/env node
/* Inject methodology.diagram and learningLoop.diagram label blocks into every locale.
 * Lane labels are sourced from each locale's existing dimension shortNames so the
 * diagram stays consistent with the rest of the site. Run once; idempotent. */
const fs = require('fs')
const path = require('path')

const LOCALES_DIR = path.join(__dirname, '..', 'src', 'i18n', 'locales')
const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'diagram-i18n-data.json'), 'utf8'))

const get = (o, k) => k.split('.').reduce((c, p) => (c && typeof c === 'object' ? c[p] : undefined), o)

const files = fs.readdirSync(LOCALES_DIR).filter((f) => f.endsWith('.json')).sort()
for (const file of files) {
  const locale = file.replace('.json', '')
  const d = data[locale]
  if (!d) {
    console.log(`SKIP ${locale} (no translation data)`)
    continue
  }
  const full = path.join(LOCALES_DIR, file)
  const raw = fs.readFileSync(full, 'utf8')
  const json = JSON.parse(raw)

  const lane = (key) => get(json, `whitepaper.dimensions.items.${key}.shortName`)

  json.methodology.diagram = {
    ariaLabel: d.m.ariaLabel,
    lanes: {
      code: lane('code'),
      distribution: lane('distribution'),
      tokenomics: lane('tokenomics'),
      liquidity: lane('liquidity'),
      sentiment: lane('sentiment'),
    },
    compositeLine1: d.m.compositeLine1,
    compositeLine2: d.m.compositeLine2,
    subtitle: d.m.subtitle,
  }

  json.learningLoop.diagram = {
    ariaLabel: d.l.ariaLabel,
    nodes: {
      audit: d.l.audit,
      feedback: d.l.feedback,
      evaluation: d.l.evaluation,
      calibration: d.l.calibration,
      retraining: d.l.retraining,
    },
    centerLine1: d.l.centerLine1,
    centerLine2: d.l.centerLine2,
  }

  // Preserve exact file format: en.json has no trailing newline; all others do.
  const out = JSON.stringify(json, null, 2) + (locale === 'en' ? '' : '\n')
  fs.writeFileSync(full, out)
  console.log(`✓ ${locale}: +methodology.diagram (lanes: ${Object.values(json.methodology.diagram.lanes).join(', ')})  +learningLoop.diagram`)
}
console.log('\nDone.')
