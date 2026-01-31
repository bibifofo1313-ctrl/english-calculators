import type { ReactNode } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Breadcrumbs } from './Breadcrumbs'
import { A11yPanel } from './A11yPanel'
import { ThemeToggle } from './ThemeToggle'
import { getPopularCalculators, site } from '../data/routes'

export const Layout = ({ children }: { children: ReactNode }) => {
  const popular = getPopularCalculators().slice(0, 3)

  return (
    <div className="app">
      <a className="skip-link" href="#main">
        Skip to main content
      </a>
      <header className="site-header">
        <div className="container header-inner">
          <Link to="/" className="logo">
            {site.name}
          </Link>
          <nav className="nav" aria-label="Primary">
            <NavLink to="/calculators">Calculators</NavLink>
            <NavLink to="/privacy">Privacy</NavLink>
            <NavLink to="/terms">Terms</NavLink>
            <NavLink to="/accessibility">Accessibility</NavLink>
          </nav>
          <div className="header-actions">
            <ThemeToggle />
            <A11yPanel />
          </div>
        </div>
      </header>

      <main id="main" className="main">
        <div className="container">
          <Breadcrumbs />
        </div>
        <div className="container main-content">{children}</div>
      </main>

      <footer className="footer">
        <div className="container footer-grid">
          <div>
            <h3>{site.name}</h3>
            <p>{site.tagline}</p>
            <p className="field-helper">Results are estimates and not financial advice.</p>
          </div>
          <div>
            <h4>Popular calculators</h4>
            <div className="inline-list">
              {popular.map((calculator) => (
                <Link key={calculator.id} to={calculator.path}>
                  {calculator.title}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h4>Trust & legal</h4>
            <div className="inline-list">
              <Link to="/privacy">Privacy</Link>
              <Link to="/terms">Terms</Link>
              <Link to="/accessibility">Accessibility</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
