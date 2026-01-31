import fs from 'node:fs'
import path from 'node:path'

const projectRoot = process.cwd()
const dataPath = path.join(projectRoot, 'src', 'data', 'routes.json')
const distDir = path.join(projectRoot, 'dist')

const normalizeBaseUrl = (value) => {
  const fallback = 'https://www.englishcalculators.com'
  const raw = value && value.trim().length > 0 ? value.trim() : fallback
  const cleaned = raw.endsWith('/') ? raw.slice(0, -1) : raw
  return cleaned || fallback
}

const baseUrl = normalizeBaseUrl(process.env.SITE_URL)

if (!fs.existsSync(dataPath)) {
  throw new Error(`Missing routes data at ${dataPath}`)
}

const raw = fs.readFileSync(dataPath, 'utf8').replace(/^\uFEFF/, '')
const data = JSON.parse(raw)
const routes = [...(data.corePages ?? []), ...(data.legalPages ?? []), ...(data.calculators ?? [])]
  .map((route) => route.path)
  .filter(Boolean)

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true })
}

const urlSet = routes
  .map((route) => {
    const loc = `${baseUrl}${route}`
    return `  <url>\n    <loc>${loc}</loc>\n  </url>`
  })
  .join('\n')

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">\n${urlSet}\n</urlset>\n`

fs.writeFileSync(path.join(distDir, 'sitemap.xml'), xml, 'utf8')

const robotsPath = path.join(distDir, 'robots.txt')
const baseRobots = 'User-agent: *\nAllow: /\n'
let robotsContent = fs.existsSync(robotsPath)
  ? fs.readFileSync(robotsPath, 'utf8')
  : baseRobots

const sitemapLine = `Sitemap: ${baseUrl}/sitemap.xml`
if (robotsContent.match(/^Sitemap:/m)) {
  robotsContent = robotsContent.replace(/^Sitemap:.*$/m, sitemapLine)
} else {
  robotsContent = `${robotsContent.trim()}\n${sitemapLine}\n`
}

fs.writeFileSync(robotsPath, robotsContent.trim() + '\n', 'utf8')

console.log(`Sitemap generated with ${routes.length} routes.`)
