import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router'
import { AppRoutes } from './App'
import { createHeadStore, HeadProvider } from './components/HeadProvider'
import { PreferencesProvider } from './components/PreferencesProvider'

type RenderResult = {
  appHtml: string
  headTags: string
  htmlAttributes: string
}

export const render = (url: string): RenderResult => {
  const headStore = createHeadStore()

  const appHtml = renderToString(
    <HeadProvider store={headStore}>
      <PreferencesProvider>
        <StaticRouter location={url}>
          <AppRoutes />
        </StaticRouter>
      </PreferencesProvider>
    </HeadProvider>,
  )

  const head = headStore.get()
  const headTags = [
    head?.title ? `<title>${head.title}</title>` : '',
    ...(head?.meta ?? []).map((meta) => {
      const attrs = Object.entries(meta)
        .map(([key, value]) => `${key}="${value}"`)
        .join(' ')
      return `<meta ${attrs}>`
    }),
    ...(head?.link ?? []).map((link) => `<link rel="${link.rel}" href="${link.href}">`),
    ...(head?.script ?? []).map(
      (script) => `<script type="${script.type}">${script.json}</script>`,
    ),
  ]
    .filter(Boolean)
    .join('\n')

  return {
    appHtml,
    headTags,
    htmlAttributes: head?.htmlAttributes
      ? Object.entries(head.htmlAttributes)
          .map(([key, value]) => `${key}="${value}"`)
          .join(' ')
      : '',
  }
}
