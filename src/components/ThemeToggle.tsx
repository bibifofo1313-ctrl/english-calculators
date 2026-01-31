import { usePreferences } from './PreferencesProvider'

export const ThemeToggle = () => {
  const { theme, toggleTheme } = usePreferences()
  return (
    <button type="button" className="btn btn-ghost" onClick={toggleTheme} aria-label="Toggle theme">
      {theme === 'dark' ? 'Light mode' : 'Dark mode'}
    </button>
  )
}
