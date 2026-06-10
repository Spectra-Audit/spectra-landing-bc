#!/usr/bin/env node
/**
 * Generates public/images/og-image.jpg (1200x630) — the Open Graph / Twitter
 * card referenced by generateMetadata — and public/logo.png (referenced by the
 * Organization structured data). Run manually: node scripts/generate-og-image.js
 */
const fs = require('fs')
const path = require('path')
const sharp = require('sharp')

const ROOT = path.join(__dirname, '..')
const OUT_DIR = path.join(ROOT, 'public', 'images')
const LOGO_SRC = path.join(ROOT, 'public', 'spectra-logo.png')

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true })

  // Organization schema logo — resized brand logo (source PNG is ~630KB).
  await sharp(LOGO_SRC)
    .resize(512, 512, { fit: 'inside', withoutEnlargement: true })
    .png({ compressionLevel: 9 })
    .toFile(path.join(ROOT, 'public', 'logo.png'))

  const logoB64 = fs.readFileSync(LOGO_SRC).toString('base64')

  const svg = `
  <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0b1120"/>
        <stop offset="55%" stop-color="#111a2e"/>
        <stop offset="100%" stop-color="#0b1120"/>
      </linearGradient>
      <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#3b82f6"/>
        <stop offset="100%" stop-color="#10b981"/>
      </linearGradient>
    </defs>

    <rect width="1200" height="630" fill="url(#bg)"/>

    <!-- subtle grid -->
    <g stroke="rgba(255,255,255,0.04)" stroke-width="1">
      ${Array.from({ length: 29 }, (_, i) => `<line x1="${(i + 1) * 40}" y1="0" x2="${(i + 1) * 40}" y2="630"/>`).join('')}
      ${Array.from({ length: 15 }, (_, i) => `<line x1="0" y1="${(i + 1) * 40}" x2="1200" y2="${(i + 1) * 40}"/>`).join('')}
    </g>

    <!-- brand -->
    <image href="data:image/png;base64,${logoB64}" x="80" y="72" width="72" height="72"/>
    <text x="172" y="120" font-family="Helvetica, Arial, sans-serif" font-size="40" font-weight="700" fill="#ffffff">Spectra Audit</text>

    <!-- headline -->
    <text x="80" y="300" font-family="Helvetica, Arial, sans-serif" font-size="64" font-weight="800" fill="#ffffff">AI-Powered Smart</text>
    <text x="80" y="378" font-family="Helvetica, Arial, sans-serif" font-size="64" font-weight="800" fill="#ffffff">Contract Audits</text>
    <rect x="84" y="408" width="220" height="6" rx="3" fill="url(#accent)"/>

    <text x="80" y="470" font-family="Helvetica, Arial, sans-serif" font-size="28" fill="#94a3b8">One clear security grade — backed by verifiable evidence.</text>

    <!-- grade ring -->
    <circle cx="1000" cy="330" r="120" fill="none" stroke="rgba(16,185,129,0.25)" stroke-width="14"/>
    <circle cx="1000" cy="330" r="120" fill="none" stroke="#10b981" stroke-width="14"
            stroke-linecap="round" stroke-dasharray="565 754" transform="rotate(-90 1000 330)"/>
    <text x="1000" y="330" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="92" font-weight="800" fill="#10b981">A</text>
    <text x="1000" y="382" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="24" fill="#94a3b8">Security Grade</text>

    <text x="80" y="566" font-family="Helvetica, Arial, sans-serif" font-size="24" fill="#64748b">spectra-audit.com</text>
  </svg>`

  await sharp(Buffer.from(svg))
    .resize(1200, 630)
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(path.join(OUT_DIR, 'og-image.jpg'))

  console.log('wrote public/images/og-image.jpg and public/logo.png')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
