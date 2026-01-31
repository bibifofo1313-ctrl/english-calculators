import { site } from '../data/routes'
import type { PageMeta } from '../data/routes'
import { buildCanonical, getSiteUrl } from './seo'
import type { FAQItem } from '../components/FAQ'

export const buildWebsiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: site.name,
  url: getSiteUrl(),
  description: site.description,
})

export const buildOrganizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: site.name,
  url: getSiteUrl(),
  email: site.contactEmail,
  logo: `${getSiteUrl()}/social-card.svg`,
})

export const buildBreadcrumbSchema = (items: PageMeta[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.breadcrumb,
    item: buildCanonical(item.path),
  })),
})

export const buildFaqSchema = (items: FAQItem[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: items.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
})
