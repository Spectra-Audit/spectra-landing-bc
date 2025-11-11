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

interface StructuredDataProps {
  type: 'software' | 'organization' | 'security-audit'
  data: SoftwareApplicationSchema | OrganizationSchema | SecurityAuditSchema
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

// Helper functions to create structured data for Spectra
export const createSoftwareSchema = (): SoftwareApplicationSchema => ({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Spectra - AI-Powered Security Audits',
  description: 'Real-time AI audits you can verify. Continuous security monitoring for blockchain smart contracts and DeFi protocols.',
  applicationCategory: 'SecurityApplication',
  operatingSystem: 'Web Browser',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    description: 'Free security audit with comprehensive vulnerability detection'
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: '247'
  },
  provider: {
    '@type': 'Organization',
    name: 'Spectra Security'
  }
})

export const createOrganizationSchema = (): OrganizationSchema => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Spectra Security',
  url: 'https://spectra.security',
  logo: 'https://spectra.security/logo.png',
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