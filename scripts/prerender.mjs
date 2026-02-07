import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const projectRoot = process.cwd()
const distDir = path.join(projectRoot, 'dist')
const templatePath = path.join(distDir, 'index.html')
const routesPath = path.join(projectRoot, 'src', 'data', 'routes.json')
const ssrEntry = path.join(projectRoot, '.ssr', 'entry-server.js')

if (!fs.existsSync(templatePath)) {
  throw new Error('Missing dist/index.html. Run the client build first.')
}

if (!fs.existsSync(routesPath)) {
  throw new Error('Missing routes data.')
}

if (!fs.existsSync(ssrEntry)) {
  throw new Error('Missing SSR bundle. Run the SSR build first.')
}

const template = fs.readFileSync(templatePath, 'utf8')
const rawRoutes = JSON.parse(fs.readFileSync(routesPath, 'utf8').replace(/^\uFEFF/, ''))
const routes = [...(rawRoutes.corePages ?? []), ...(rawRoutes.legalPages ?? []), ...(rawRoutes.calculators ?? [])]
  .map((route) => route.path)
  .filter(Boolean)

const { render } = await import(pathToFileURL(ssrEntry).href)

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

routes.forEach((route) => {
  const { appHtml, headTags, htmlAttributes } = render(route)

  let html = template

  if (htmlAttributes) {
    html = html.replace(/<html[^>]*>/, `<html ${htmlAttributes}>`)
  }

  if (html.includes('<!--head-tags-->')) {
    html = html.replace('<!--head-tags-->', headTags)
  } else {
    html = html.replace('</head>', `${headTags}\n</head>`)
  }

  if (html.includes('<!--app-html-->')) {
    html = html.replace('<!--app-html-->', appHtml)
  } else {
    html = html.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`)
  }

  const outputPath =
    route === '/'
      ? path.join(distDir, 'index.html')
      : path.join(distDir, route.slice(1), 'index.html')

  ensureDir(path.dirname(outputPath))
  fs.writeFileSync(outputPath, html, 'utf8')
})

console.log(`Prerendered ${routes.length} routes.`)
