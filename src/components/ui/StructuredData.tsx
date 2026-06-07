'use client'

interface SoftwareApplicationSchema {
  '@context': string
  '@type': string
  name: string
  description: string
  applicationCategory: string
  operatingSystem: string
  offers?: {
    '@type': string
    price: string
    priceCurrency: string
    description?: string
  }
  aggregateRating?: {
    '@type': string
    ratingValue: string
    reviewCount: string
  }
  provider?: {
    '@type': string
    name: string
  }
}

interface OrganizationSchema {
  '@context': string
  '@type': string
  name: string
  url: string
  logo: string
  description: string
  sameAs?: string[]
  contactPoint?: {
    '@type': string
    telephone?: string
    contactType: string
    availableLanguage: string[]
  }
}

interface SecurityAuditSchema {
  '@context': string
  '@type': string
  name: string
  description: string
  auditScore: string
  dateModified: string
  itemReviewed: {
    '@type': string
    name: string
  }
}

interface WebPageSchema {
  '@context': string
  '@type': string
  name: string
  description: string
  url: string
  inLanguage: string
  isPartOf: {
    '@type': string
    name: string
    url: string
  }
  about?: string[]
  mainEntity?: {
    '@type': string
    name: string
  }
}

interface FAQSchema {
  '@context': string
  '@type': string
  mainEntity: Array<{
    '@type': string
    acceptedAnswer: {
      '@type': string
      text: string
    }
    name: string
  }>
}

interface ServiceSchema {
  '@context': string
  '@type': string
  name: string
  description: string
  provider: {
    '@type': string
    name: string
    url: string
  }
  serviceType: string
  areaServed: string
  hasOfferCatalog: {
    '@type': string
    itemListElement: Array<{
      '@type': string
      name: string
      description: string
      offers: {
        '@type': string
        price: string
        priceCurrency: string
      }
    }>
  }
}

interface StructuredDataProps {
  type: 'software' | 'organization' | 'security-audit' | 'webpage' | 'faq' | 'service'
  data: SoftwareApplicationSchema | OrganizationSchema | SecurityAuditSchema | WebPageSchema | FAQSchema | ServiceSchema
}

export default function StructuredData({ type, data }: StructuredDataProps) {
  // Validate required fields based on type
  const validateData = (data: any, type: string): boolean => {
    switch (type) {
      case 'software':
        return !!(data.name && data.description && data.applicationCategory)
      case 'organization':
        return !!(data.name && data.url && data.description)
      case 'security-audit':
        return !!(data.name && data.description && data.auditScore)
      case 'webpage':
        return !!(data.name && data.description && data.url)
      case 'faq':
        return !!(data.mainEntity && Array.isArray(data.mainEntity) && data.mainEntity.length > 0)
      case 'service':
        return !!(data.name && data.description && data.serviceType)
      default:
        return false
    }
  }

  if (!validateData(data, type)) {
    console.warn(`StructuredData: Missing required fields for ${type} schema`)
    return null
  }

  // Generate appropriate schema based on type with proper type casting
  let schema: any = {}

  switch (type) {
    case 'software': {
      const softwareData = data as SoftwareApplicationSchema
      schema = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: softwareData.name,
        description: softwareData.description,
        applicationCategory: softwareData.applicationCategory,
        operatingSystem: softwareData.operatingSystem || 'Any',
        ...(softwareData.offers && { offers: softwareData.offers }),
        ...(softwareData.aggregateRating && { aggregateRating: softwareData.aggregateRating }),
        ...(softwareData.provider && { provider: softwareData.provider })
      }
      break
    }

    case 'organization': {
      const organizationData = data as OrganizationSchema
      schema = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: organizationData.name,
        url: organizationData.url,
        logo: organizationData.logo,
        description: organizationData.description,
        ...(organizationData.sameAs && { sameAs: organizationData.sameAs }),
        ...(organizationData.contactPoint && { contactPoint: organizationData.contactPoint })
      }
      break
    }

    case 'security-audit': {
      const auditData = data as SecurityAuditSchema
      schema = {
        '@context': 'https://schema.org',
        '@type': 'Review',
        name: auditData.name,
        description: auditData.description,
        reviewRating: {
          '@type': 'Rating',
          ratingValue: auditData.auditScore,
          bestRating: 'A',
          worstRating: 'F'
        },
        dateModified: auditData.dateModified,
        itemReviewed: {
          '@type': 'SoftwareApplication',
          name: auditData.itemReviewed.name
        }
      }
      break
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema, null, 2)
      }}
    />
  )
}

// Helper functions to create structured data for Spectra Audit
export const createSoftwareSchema = (): SoftwareApplicationSchema => ({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Spectra Audit - AI-Powered Security Audits',
  description: 'Real-time AI audits you can verify. Continuous security monitoring for blockchain smart contracts and DeFi protocols.',
  applicationCategory: 'SecurityApplication',
  operatingSystem: 'Web Browser',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    description: 'Free AI-powered security analysis with comprehensive vulnerability detection'
  },
  provider: {
    '@type': 'Organization',
    name: 'Spectra Audit'
  }
})

export const createOrganizationSchema = (): OrganizationSchema => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Spectra Audit',
  url: 'https://spectra-audit.com',
  logo: 'https://spectra-audit.com/logo.png',
  description: 'Leading blockchain security platform providing AI-powered smart contract audits and continuous security monitoring.',
  sameAs: [
    'https://twitter.com/spectrasecurity',
    'https://github.com/spectra-security',
    'https://linkedin.com/company/spectra-security'
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer support',
    availableLanguage: ['English']
  }
})

export const createSecurityAuditSchema = (contractName: string, grade: string): SecurityAuditSchema => ({
  '@context': 'https://schema.org',
  '@type': 'Review',
  name: `${contractName} Security Audit`,
  description: `Comprehensive security analysis of ${contractName} smart contract using AI-powered vulnerability detection.`,
  auditScore: grade,
  dateModified: new Date().toISOString(),
  itemReviewed: {
    '@type': 'SoftwareApplication',
    name: contractName
  }
})

export const createWebPageSchema = (): WebPageSchema => ({
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Spectra Audit - AI-Powered Security Audits | Smart Contract Security',
  description: 'Real-time AI audits you can verify. Get comprehensive smart contract security audits in minutes, not weeks. Continuous monitoring for blockchain protocols.',
  url: 'https://spectra-audit.com',
  inLanguage: 'en',
  isPartOf: {
    '@type': 'WebSite',
    name: 'Spectra Audit',
    url: 'https://spectra-audit.com'
  },
  about: [
    'Smart Contract Security',
    'Blockchain Security',
    'DeFi Auditing',
    'Vulnerability Detection',
    'AI Security Analysis'
  ],
  mainEntity: {
    '@type': 'SoftwareApplication',
    name: 'Spectra Audit Platform'
  }
})

export const createFAQSchema = (): FAQSchema => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How long does a security audit take?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Spectra Audit completes audits in 20 minutes or less — more than 2.4 times faster than traditional manual audits.'
      }
    },
    {
      '@type': 'Question',
      name: 'What types of vulnerabilities can Spectra Audit detect?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Spectra Audit detects 15+ vulnerability categories including reentrancy, overflow/underflow, access control issues, and economic attack vectors.'
      }
    },
    {
      '@type': 'Question',
      name: 'Is Spectra Audit\'s security audit really free?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, Spectra Audit offers free comprehensive security audits with no credit card required. Premium features are available for advanced monitoring.'
      }
    },
    {
      '@type': 'Question',
      name: 'How accurate are Spectra Audit\'s security findings?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Spectra Audit detects up to 95% of known vulnerability patterns. All findings are produced by AI analysis and include verifiable evidence you can inspect. Results are informational and do not guarantee project safety.'
      }
    },
    {
      '@type': 'Question',
      name: 'Does Spectra Audit support multiple blockchains?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Spectra Audit supports Ethereum, BSC, Polygon, Arbitrum, Optimism, and other major EVM-compatible blockchains.'
      }
    }
  ]
})

export const createServiceSchema = (): ServiceSchema => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'AI-Powered Security Audit Service',
  description: 'AI-powered security analysis for blockchain smart contracts and DeFi protocols.',
  provider: {
    '@type': 'Organization',
    name: 'Spectra Audit',
    url: 'https://spectra-audit.com'
  },
  serviceType: 'Security Audit Service',
  areaServed: 'Worldwide',
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    itemListElement: [
      {
        '@type': 'Offer',
        name: 'AI-Powered Security Analysis',
        description: '5-dimensional smart contract security analysis with AI-powered vulnerability detection',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD'
        }
      }
    ]
  }
})