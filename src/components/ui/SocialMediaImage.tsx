'use client'

import React from 'react'
import OptimizedImage from './OptimizedImage'

export interface SocialMediaImageProps {
  type: 'og' | 'twitter' | 'favicon' | 'icon'
  title?: string
  description?: string
  image?: string
  width?: number
  height?: number
  priority?: boolean
}

/**
 * SocialMediaImage component for optimized social media images
 * Generates proper structured data and meta tags for social sharing
 */
const SocialMediaImage: React.FC<SocialMediaImageProps> = ({
  type,
  title = 'Spectra Audit - AI-Powered Smart Contract Security Audits',
  description = 'Get comprehensive security audits with verifiable evidence in under 20 minutes. Protect your DeFi protocols with real-time AI-powered security monitoring.',
  image = '/images/social/og-default.jpg',
  width,
  height,
  priority = true,
}) => {
  const imageConfig = {
    og: {
      width: width || 1200,
      height: height || 630,
      src: image,
      alt: `${title} - ${description}`,
      title: `${title} - Smart Contract Security`,
    },
    twitter: {
      width: width || 1200,
      height: height || 600,
      src: image,
      alt: `${title} - ${description}`,
      title: `${title} - DeFi Security Platform`,
    },
    favicon: {
      width: width || 32,
      height: height || 32,
      src: '/images/social/favicon-32x32.png',
      alt: 'Spectra Audit Platform Favicon',
      title: 'Spectra Audit Favicon',
    },
    icon: {
      width: width || 192,
      height: height || 192,
      src: '/images/social/icon-192x192.png',
      alt: 'Spectra Audit Platform Icon',
      title: 'Spectra Audit Platform Icon',
    },
  }

  const config = imageConfig[type]

  // Generate structured data for social sharing
  const generateStructuredData = () => {
    if (type === 'og') {
      return {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: title,
        description,
        url: 'https://spectra.shield.network',
        applicationCategory: 'SecurityApplication',
        operatingSystem: 'Any',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
          description: 'Free security audit trials available',
        },
      }
    }
    return null
  }

  const structuredData = generateStructuredData()

  return (
    <>
      {type === 'og' && structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
      <OptimizedImage
        src={config.src}
        alt={config.alt}
        width={config.width}
        height={config.height}
        quality={95}
        priority={priority}
        unoptimized={type === 'favicon' || type === 'icon'}
        className="hidden"
        onLoad={() => {
          // Image loaded successfully
          if (process.env.NODE_ENV === 'development') {
            console.log(`Social media image loaded: ${type}`, config)
          }
        }}
      />
    </>
  )
}

export default SocialMediaImage