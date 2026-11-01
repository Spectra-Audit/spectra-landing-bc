// Server Component — renders a static <script type="application/ld+json">
// from plain data (no hooks, no browser APIs, no `'use client'` needed).
import { SITE_URL, absoluteLocaleUrl } from '@/lib/site'

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

interface ArticleSchema {
  '@context': string
  '@type': 'TechArticle'
  headline: string
  description: string
  inLanguage: string
  url: string
  mainEntityOfPage: {
    '@type': 'WebPage'
    '@id': string
  }
  datePublished: string
  dateModified: string
  author: {
    '@type': 'Organization'
    name: string
    url: string
  }
  publisher: {
    '@type': 'Organization'
    name: string
    url: string
    logo: { '@type': 'ImageObject'; url: string }
  }
  isPartOf: {
    '@type': 'WebSite'
    name: string
    url: string
  }
  about: string[]
}

interface BreadcrumbSchema {
  '@context': string
  '@type': 'BreadcrumbList'
  itemListElement: Array<{
    '@type': 'ListItem'
    position: number
    name: string
    item: string
  }>
}

interface StructuredDataProps {
  type: 'software' | 'organization' | 'faq' | 'article' | 'breadcrumb'
  data: SoftwareApplicationSchema | OrganizationSchema | FAQSchema | ArticleSchema | BreadcrumbSchema
}

export default function StructuredData({ type, data }: StructuredDataProps) {
  // Validate required fields based on type
  const validateData = (data: any, type: string): boolean => {
    switch (type) {
      case 'software':
        return !!(data.name && data.description && data.applicationCategory)
      case 'organization':
        return !!(data.name && data.url && data.description)
      case 'faq':
        return !!(data.mainEntity && Array.isArray(data.mainEntity) && data.mainEntity.length > 0)
      case 'article':
        return !!(data.headline && data.description && data.url && data.dateModified)
      case 'breadcrumb':
        return !!(
          data.itemListElement &&
          Array.isArray(data.itemListElement) &&
          data.itemListElement.length > 0
        )
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

    case 'faq': {
      // FAQ data arrives as a complete schema.org FAQPage object (built from
      // the active locale's translations so the markup matches visible text).
      schema = data as FAQSchema
      break
    }

    // Article + breadcrumb builders below already emit complete, localized
    // schema.org objects, so these cases pass the data straight through
    // rather than re-deriving fields the builder already resolved.
    case 'article': {
      schema = data as ArticleSchema
      break
    }

    case 'breadcrumb': {
      schema = data as BreadcrumbSchema
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
  url: 'https://www.spectra-audit.com',
  logo: 'https://www.spectra-audit.com/logo.png',
  description: 'Leading blockchain security platform providing AI-powered smart contract audits and continuous security monitoring.',
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer support',
    availableLanguage: ['English']
  }
})

// FAQ structured data is built from translations in the page that renders it
// (see HomePage) so the JSON-LD always matches the visible, localized FAQ text.
export type { FAQSchema }

// /whitepaper schema (SPE-4 section 4.4). Both builders take the already
// translated, locale-specific strings from the page so the JSON-LD matches the
// visible content in all 16 locales — the same rule the FAQPage schema follows.
export const createArticleSchema = ({
  locale,
  headline,
  description,
  datePublished,
  dateModified,
  about,
}: {
  locale: string
  headline: string
  description: string
  datePublished: string
  dateModified: string
  about: string[]
}): ArticleSchema => {
  const url = absoluteLocaleUrl(locale, '/whitepaper')

  return {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline,
    description,
    inLanguage: locale,
    url,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    datePublished,
    dateModified,
    author: {
      '@type': 'Organization',
      name: 'Spectra Audit',
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Spectra Audit',
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo.png`,
      },
    },
    isPartOf: {
      '@type': 'WebSite',
      name: 'Spectra Audit',
      url: SITE_URL,
    },
    about,
  }
}

export const createBreadcrumbSchema = ({
  locale,
  homeName,
  pageName,
}: {
  locale: string
  homeName: string
  pageName: string
}): BreadcrumbSchema => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: homeName,
      item: absoluteLocaleUrl(locale),
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: pageName,
      item: absoluteLocaleUrl(locale, '/whitepaper'),
    },
  ],
})
