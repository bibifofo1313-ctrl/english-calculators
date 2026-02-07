const FALLBACK_SITE_URL = 'https://english-calculators.netlify.app'

const normalizeUrl = (value?: string) => {
  if (!value) return FALLBACK_SITE_URL
  const trimmed = value.trim()
  if (!trimmed) return FALLBACK_SITE_URL
  return trimmed.endsWith('/') ? trimmed.slice(0, -1) : trimmed
}

export const getSiteUrl = () => {
  const env = (import.meta as { env: { SITE_URL?: string; VITE_SITE_URL?: string } }).env
  return normalizeUrl(env.VITE_SITE_URL ?? env.SITE_URL)
}

export const buildCanonical = (path: string) => `${getSiteUrl()}${path}`

export const getDefaultSocialImage = () => `${getSiteUrl()}/social-card.svg`
