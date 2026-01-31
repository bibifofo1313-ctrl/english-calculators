import rawData from './routes.json'

export type PageMeta = {
  id: string
  path: string
  title: string
  description: string
  breadcrumb: string
}

export type CalculatorMeta = PageMeta & {
  category: string
  popular: boolean
  related: string[]
}

type RoutesData = {
  site: {
    name: string
    tagline: string
    description: string
    contactEmail: string
  }
  corePages: PageMeta[]
  legalPages: PageMeta[]
  calculators: CalculatorMeta[]
}

const data = rawData as RoutesData

export const site = data.site
export const corePages = data.corePages
export const legalPages = data.legalPages
export const calculators = data.calculators

export const homePage = corePages.find((page) => page.id === 'home') ?? corePages[0]
export const calculatorsIndexPage = corePages.find((page) => page.id === 'calculators') ?? corePages[1]

export const allRoutes = [...corePages, ...legalPages, ...calculators].map((route) => route.path)

export const getCalculatorById = (id: string) => calculators.find((calculator) => calculator.id === id)

export const getCalculatorByPath = (path: string) =>
  calculators.find((calculator) => calculator.path === path)

export const getPageByPath = (path: string) =>
  corePages.find((page) => page.path === path) || legalPages.find((page) => page.path === path)

export const getPopularCalculators = () => calculators.filter((calculator) => calculator.popular)

export const getRelatedCalculators = (id: string) => {
  const calculator = getCalculatorById(id)
  if (!calculator) return []
  return calculator.related
    .map((relatedId) => getCalculatorById(relatedId))
    .filter((item): item is CalculatorMeta => Boolean(item))
}

export const getBreadcrumbs = (path: string) => {
  if (!homePage) return []
  if (path === '/') return []

  if (path === calculatorsIndexPage?.path) {
    return [homePage, calculatorsIndexPage]
  }

  if (path.startsWith('/calculators/')) {
    const calculator = getCalculatorByPath(path)
    if (calculator && calculatorsIndexPage) {
      return [homePage, calculatorsIndexPage, calculator]
    }
  }

  const page = getPageByPath(path)
  if (page) {
    return [homePage, page]
  }

  return [homePage]
}
