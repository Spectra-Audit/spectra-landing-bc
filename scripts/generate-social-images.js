#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

// Generate optimized social media images for the Spectra platform
function generateSocialImages() {
  const outputDir = path.join(__dirname, '../public/images/social')
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  // Generate Open Graph image (1200x630)
  const ogImage = `
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#1e293b;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#334155;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#1e293b;stop-opacity:1" />
        </linearGradient>
        <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#10b981;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#059669;stop-opacity:1" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      <!-- Background -->
      <rect width="100%" height="100%" fill="url(#bgGrad)"/>

      <!-- Grid pattern for tech feel -->
      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
        <rect width="40" height="40" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
      </pattern>
      <rect width="100%" height="100%" fill="url(#grid)"/>

      <!-- Security shield icon -->
      <g transform="translate(100, 100)">
        <path d="M 60 20 L 100 35 L 100 80 Q 60 100 20 80 L 20 35 Z"
              fill="url(#accentGrad)"
              filter="url(#glow)"
              opacity="0.9"/>
        <text x="60" y="65" font-family="Arial, sans-serif" font-size="24" font-weight="bold"
              fill="white" text-anchor="middle">A+</text>
      </g>

      <!-- Main title -->
      <text x="600" y="200" font-family="Inter, Arial, sans-serif" font-size="54" font-weight="bold"
            fill="white" text-anchor="middle">
        Smart Contract Security
      </text>
      <text x="600" y="270" font-family="Inter, Arial, sans-serif" font-size="54" font-weight="bold"
            fill="url(#accentGrad)" text-anchor="middle">
        Audits in Seconds
      </text>

      <!-- Subtitle -->
      <text x="600" y="330" font-family="Inter, Arial, sans-serif" font-size="24"
            fill="#94a3b8" text-anchor="middle">
        AI-powered security analysis with verifiable evidence
      </text>

      <!-- Trust indicators -->
      <g transform="translate(200, 400)">
        <circle cx="0" cy="0" r="4" fill="#10b981"/>
        <text x="20" y="5" font-family="Inter, Arial, sans-serif" font-size="18" fill="white">
          30-second average scan time
        </text>
      </g>

      <g transform="translate(200, 450)">
        <circle cx="0" cy="0" r="4" fill="#3b82f6"/>
        <text x="20" y="5" font-family="Inter, Arial, sans-serif" font-size="18" fill="white">
          99.9% detection accuracy
        </text>
      </g>

      <g transform="translate(200, 500)">
        <circle cx="0" cy="0" r="4" fill="#f59e0b"/>
        <text x="20" y="5" font-family="Inter, Arial, sans-serif" font-size="18" fill="white">
          $2.4B in protected assets
        </text>
      </g>

      <!-- Spectra logo -->
      <text x="1050" y="580" font-family="Inter, Arial, sans-serif" font-size="28" font-weight="bold"
            fill="white" text-anchor="end">
        SPECTRA
      </text>
      <text x="1050" y="600" font-family="Inter, Arial, sans-serif" font-size="14"
            fill="#10b981" text-anchor="end">
        spectra.shield.network
      </text>
    </svg>
  `

  // Generate Twitter card image (1200x600)
  const twitterImage = `
    <svg width="1200" height="600" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="twitterBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#0ea5e9;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#0284c7;stop-opacity:1" />
        </linearGradient>
        <filter id="twitterGlow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      <!-- Background -->
      <rect width="100%" height="100%" fill="url(#twitterBg)"/>

      <!-- Main content -->
      <text x="600" y="200" font-family="Inter, Arial, sans-serif" font-size="48" font-weight="bold"
            fill="white" text-anchor="middle">
        Protect Your DeFi Protocols
      </text>
      <text x="600" y="280" font-family="Inter, Arial, sans-serif" font-size="36" font-weight="300"
            fill="white" text-anchor="middle">
        with Real-time AI Security
      </text>

      <!-- Key metrics -->
      <g transform="translate(300, 380)">
        <text x="0" y="0" font-family="Inter, Arial, sans-serif" font-size="32" font-weight="bold"
              fill="white" text-anchor="middle">30s</text>
        <text x="0" y="30" font-family="Inter, Arial, sans-serif" font-size="16"
              fill="white" text-anchor="middle">Scan Time</text>
      </g>

      <g transform="translate(600, 380)">
        <text x="0" y="0" font-family="Inter, Arial, sans-serif" font-size="32" font-weight="bold"
              fill="white" text-anchor="middle">99.9%</text>
        <text x="0" y="30" font-family="Inter, Arial, sans-serif" font-size="16"
              fill="white" text-anchor="middle">Accuracy</text>
      </g>

      <g transform="translate(900, 380)">
        <text x="0" y="0" font-family="Inter, Arial, sans-serif" font-size="32" font-weight="bold"
              fill="white" text-anchor="middle">24/7</text>
        <text x="0" y="30" font-family="Inter, Arial, sans-serif" font-size="16"
              fill="white" text-anchor="middle">Monitoring</text>
      </g>

      <!-- Brand -->
      <text x="600" y="520" font-family="Inter, Arial, sans-serif" font-size="24" font-weight="bold"
            fill="white" text-anchor="middle">
        🛡️ SPECTRA
      </text>
      <text x="600" y="550" font-family="Inter, Arial, sans-serif" font-size="16"
            fill="white" text-anchor="middle">
        AI-Powered Smart Contract Security
      </text>
    </svg>
  `

  // Save SVG files
  fs.writeFileSync(path.join(outputDir, 'og-default.svg'), ogImage)
  fs.writeFileSync(path.join(outputDir, 'twitter-default.svg'), twitterImage)

  console.log('✅ Generated social media SVG files')
  console.log('   - og-default.svg (1200x630)')
  console.log('   - twitter-default.svg (1200x600)')

  // Try to convert to PNG using sharp
  try {
    const sharp = require('sharp')

    // Convert Open Graph image to PNG
    sharp(Buffer.from(ogImage))
      .png({ quality: 90, compressionLevel: 9 })
      .toFile(path.join(outputDir, 'og-default.png'))
      .then(() => console.log('✅ Generated og-default.png'))

    // Convert Twitter image to PNG
    sharp(Buffer.from(twitterImage))
      .png({ quality: 90, compressionLevel: 9 })
      .toFile(path.join(outputDir, 'twitter-default.png'))
      .then(() => console.log('✅ Generated twitter-default.png'))

    // Generate WebP versions
    sharp(Buffer.from(ogImage))
      .webp({ quality: 90 })
      .toFile(path.join(outputDir, 'og-default.webp'))
      .then(() => console.log('✅ Generated og-default.webp'))

    sharp(Buffer.from(twitterImage))
      .webp({ quality: 90 })
      .toFile(path.join(outputDir, 'twitter-default.webp'))
      .then(() => console.log('✅ Generated twitter-default.webp'))

  } catch (error) {
    console.log('⚠️  Sharp not available. PNG/WebP generation skipped.')
    console.log('   Install with: npm install sharp')
  }

  // Generate favicon files
  generateFavicons(outputDir)
}

function generateFavicons(outputDir) {
  const faviconSizes = [
    { size: 16, name: 'favicon-16x16.png' },
    { size: 32, name: 'favicon-32x32.png' },
    { size: 192, name: 'icon-192x192.png' },
    { size: 512, name: 'icon-512x512.png' },
  ]

  // Simple favicon SVG
  const faviconSVG = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <defs>
        <linearGradient id="favGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#10b981;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#059669;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" fill="url(#favGrad)" rx="20"/>
      <text x="50" y="65" font-family="Arial, sans-serif" font-size="40" font-weight="bold"
            fill="white" text-anchor="middle">S</text>
    </svg>
  `

  fs.writeFileSync(path.join(outputDir, 'favicon.svg'), faviconSVG)

  // Try to convert to PNG using sharp
  try {
    const sharp = require('sharp')

    faviconSizes.forEach(({ size, name }) => {
      sharp(Buffer.from(faviconSVG))
        .resize(size, size)
        .png({ quality: 95 })
        .toFile(path.join(outputDir, name))
        .then(() => console.log(`✅ Generated ${name}`))
    })

  } catch (error) {
    console.log('⚠️  Sharp not available. Favicon PNG generation skipped.')
  }

  console.log('✅ Generated favicon files')
}

// Run the generator
console.log('🎨 Generating social media images...\n')
generateSocialImages()
console.log('\n🚀 Social media images generated successfully!')
console.log(`📁 Location: ${path.join(__dirname, '../public/images/social')}`)