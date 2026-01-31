import { useEffect } from 'react'
import { site } from '../data/routes'
import { buildCanonical, getDefaultSocialImage } from '../utils/seo'

type SEOHeadProps = {
  title: string
  description: string
  path: string
  ogType?: string
  image?: string
  structuredData?: Record<string, unknown> | Array<Record<string, unknown>>
}

const upsertMeta = (selector: string, attrs: Record<string, string>, content: string) => {
  let element = document.querySelector(selector) as HTMLMetaElement | null
  if (!element) {
    element = document.createElement('meta')
    Object.entries(attrs).forEach(([key, value]) => element?.setAttribute(key, value))
    document.head.appendChild(element)
  }
  element.setAttribute('content', content)
}

const upsertLink = (rel: string, href: string) => {
  let link = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null
  if (!link) {
    link = document.createElement('link')
    link.setAttribute('rel', rel)
    document.head.appendChild(link)
  }
  link.setAttribute('href', href)
}

export const SEOHead = ({
  title,
  description,
  path,
  ogType = 'website',
  image,
  structuredData,
}: SEOHeadProps) => {
  useEffect(() => {
    const canonical = buildCanonical(path)
    const socialImage = image ?? getDefaultSocialImage()

    document.title = title

    upsertMeta('meta[name="description"]', { name: 'description' }, description)
    upsertLink('canonical', canonical)

    upsertMeta('meta[property="og:title"]', { property: 'og:title' }, title)
    upsertMeta('meta[property="og:description"]', { property: 'og:description' }, description)
    upsertMeta('meta[property="og:url"]', { property: 'og:url' }, canonical)
    upsertMeta('meta[property="og:type"]', { property: 'og:type' }, ogType)
    upsertMeta('meta[property="og:site_name"]', { property: 'og:site_name' }, site.name)
    upsertMeta('meta[property="og:image"]', { property: 'og:image' }, socialImage)

    upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card' }, 'summary_large_image')
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title' }, title)
    upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description' }, description)
    upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image' }, socialImage)

    if (structuredData) {
      const scriptId = 'structured-data'
      let script = document.getElementById(scriptId) as HTMLScriptElement | null
      if (!script) {
        script = document.createElement('script')
        script.type = 'application/ld+json'
        script.id = scriptId
        document.head.appendChild(script)
      }
      script.textContent = JSON.stringify(structuredData)
    } else {
      const existing = document.getElementById('structured-data')
      if (existing) {
        existing.remove()
      }
    }
  }, [title, description, path, ogType, image, structuredData])

  return null
}
