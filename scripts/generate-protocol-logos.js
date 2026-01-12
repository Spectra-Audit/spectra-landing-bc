#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

// Protocol configurations with custom colors
const protocols = [
  { symbol: 'UNI', name: 'Uniswap', gradient: ['#FF007A', '#D40069'] },
  { symbol: 'AAVE', name: 'Aave', gradient: ['#B6509E', '#2EBAC6'] },
  { symbol: 'COMP', name: 'Compound', gradient: ['#00D395', '#2E7DDB'] },
  { symbol: 'CRV', name: 'Curve', gradient: ['#9B59B6', '#3498DB'] },
  { symbol: 'SUSHI', name: 'SushiSwap', gradient: ['#F94E4A', '#FF7A45'] },
  { symbol: 'BAL', name: 'Balancer', gradient: ['#3D348B', '#FE5B65'] },
]

// Generate SVG for protocol logo
function generateProtocolLogo(protocol, size = 128) {
  const [color1, color2] = protocol.gradient

  const svg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad_${protocol.symbol}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${color2};stop-opacity:1" />
        </linearGradient>
        <filter id="shadow_${protocol.symbol}" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
          <feOffset dx="0" dy="2" result="offsetblur"/>
          <feFlood flood-color="#000000" flood-opacity="0.3"/>
          <feComposite in2="offsetblur" operator="in"/>
          <feMerge>
            <feMergeNode/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      <!-- Background circle with gradient -->
      <circle cx="${size/2}" cy="${size/2}" r="${size/2-2}"
              fill="url(#grad_${protocol.symbol})"
              filter="url(#shadow_${protocol.symbol})"/>

      <!-- Protocol text/symbol -->
      <text x="${size/2}" y="${size/2 + size*0.15}"
            font-family="Arial, sans-serif"
            font-size="${size*0.4}"
            font-weight="bold"
            fill="white"
            text-anchor="middle">
        ${protocol.symbol.charAt(0)}
      </text>

      <!-- Inner ring for visual appeal -->
      <circle cx="${size/2}" cy="${size/2}" r="${size/2-4}"
              fill="none"
              stroke="rgba(255,255,255,0.2)"
              stroke-width="1"/>
    </svg>
  `.trim()

  return svg
}

// Create protocol logos directory
const protocolDir = path.join(__dirname, '../public/images/protocols')
if (!fs.existsSync(protocolDir)) {
  fs.mkdirSync(protocolDir, { recursive: true })
}

// Generate and save protocol logos
protocols.forEach(protocol => {
  const svg = generateProtocolLogo(protocol)
  const filename = `${protocol.symbol.toLowerCase()}.svg`
  const filepath = path.join(protocolDir, filename)

  fs.writeFileSync(filepath, svg)
  console.log(`Generated ${filename} for ${protocol.name}`)
})

// Generate PNG versions for fallback (requires sharp)
console.log('\nGenerating PNG fallbacks...')

try {
  const sharp = require('sharp')

  protocols.forEach(async protocol => {
    const svgPath = path.join(protocolDir, `${protocol.symbol.toLowerCase()}.svg`)
    const pngPath = path.join(protocolDir, `${protocol.symbol.toLowerCase()}.png`)

    if (fs.existsSync(svgPath)) {
      await sharp(svgPath)
        .resize(128, 128)
        .png({ quality: 90, compressionLevel: 9 })
        .toFile(pngPath)

      console.log(`Generated PNG fallback for ${protocol.symbol}`)
    }
  })

} catch (error) {
  console.log('Sharp not available, PNG generation skipped. Install with: npm install sharp')
}

// Generate WebP versions
console.log('\nGenerating WebP versions...')

try {
  const sharp = require('sharp')

  protocols.forEach(async protocol => {
    const svgPath = path.join(protocolDir, `${protocol.symbol.toLowerCase()}.svg`)
    const webpPath = path.join(protocolDir, `${protocol.symbol.toLowerCase()}.webp`)

    if (fs.existsSync(svgPath)) {
      await sharp(svgPath)
        .resize(128, 128)
        .webp({ quality: 90 })
        .toFile(webpPath)

      console.log(`Generated WebP version for ${protocol.symbol}`)
    }
  })

} catch (error) {
  console.log('Sharp not available, WebP generation skipped.')
}

console.log('\nProtocol logos generated successfully!')
console.log(`Location: ${protocolDir}`)
console.log('\nAdd the following to your next.config.js domains array if using external images:')
console.log('["your-cdn-domain.com"]')