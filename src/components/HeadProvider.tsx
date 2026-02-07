import type { ReactNode } from 'react'
import { createContext, useContext } from 'react'

export type HeadMeta = {
  name?: string
  property?: string
  content: string
}

export type HeadLink = {
  rel: string
  href: string
}

export type HeadScript = {
  type: string
  json: string
}

export type HeadData = {
  title: string
  meta: HeadMeta[]
  link: HeadLink[]
  script: HeadScript[]
  htmlAttributes: Record<string, string>
}

export type HeadStore = {
  set: (data: HeadData) => void
  get: () => HeadData | null
}

export const createHeadStore = (): HeadStore => {
  let head: HeadData | null = null
  return {
    set: (data) => {
      head = data
    },
    get: () => head,
  }
}

const HeadContext = createContext<HeadStore | null>(null)

export const HeadProvider = ({ store, children }: { store: HeadStore; children: ReactNode }) => (
  <HeadContext.Provider value={store}>{children}</HeadContext.Provider>
)

export const useHeadStore = () => {
  const store = useContext(HeadContext)
  if (!store) {
    throw new Error('useHeadStore must be used within HeadProvider')
  }
  return store
}
