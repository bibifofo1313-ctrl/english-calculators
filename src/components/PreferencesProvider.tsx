import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

type ThemeSetting = 'light' | 'dark' | 'system'

type A11ySettings = {
  textSize: 'normal' | 'large'
  highContrast: boolean
  reduceMotion: boolean
}

type PreferencesContextValue = {
  theme: 'light' | 'dark'
  themeSetting: ThemeSetting
  setThemeSetting: (theme: ThemeSetting) => void
  toggleTheme: () => void
  a11y: A11ySettings
  updateA11y: (updates: Partial<A11ySettings>) => void
}

const PreferencesContext = createContext<PreferencesContextValue | null>(null)

const getSystemTheme = () => {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const getSystemReduceMotion = () => {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export const PreferencesProvider = ({ children }: { children: React.ReactNode }) => {
  const [themeSetting, setThemeSetting] = useLocalStorage<ThemeSetting>('theme', 'system')
  const [a11y, setA11y] = useLocalStorage<A11ySettings>('a11y', {
    textSize: 'normal',
    highContrast: false,
    reduceMotion: false,
  })
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>(getSystemTheme)
  const [systemReduceMotion, setSystemReduceMotion] = useState(getSystemReduceMotion)

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => setSystemTheme(media.matches ? 'dark' : 'light')
    media.addEventListener('change', handler)
    return () => media.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handler = () => setSystemReduceMotion(media.matches)
    media.addEventListener('change', handler)
    return () => media.removeEventListener('change', handler)
  }, [])

  const resolvedTheme = themeSetting === 'system' ? systemTheme : themeSetting
  const resolvedReduceMotion = a11y.reduceMotion || systemReduceMotion

  useEffect(() => {
    const root = document.documentElement
    root.dataset.theme = resolvedTheme
    root.dataset.textSize = a11y.textSize
    root.dataset.highContrast = a11y.highContrast ? 'true' : 'false'
    root.dataset.reduceMotion = resolvedReduceMotion ? 'true' : 'false'
  }, [resolvedTheme, a11y, resolvedReduceMotion])

  const updateA11y = (updates: Partial<A11ySettings>) => {
    setA11y((prev) => ({ ...prev, ...updates }))
  }

  const toggleTheme = () => {
    setThemeSetting((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark'
      return next
    })
  }

  const value = useMemo(
    () => ({
      theme: resolvedTheme,
      themeSetting,
      setThemeSetting,
      toggleTheme,
      a11y,
      updateA11y,
    }),
    [resolvedTheme, themeSetting, a11y],
  )

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>
}

export const usePreferences = () => {
  const context = useContext(PreferencesContext)
  if (!context) {
    throw new Error('usePreferences must be used within PreferencesProvider')
  }
  return context
}
