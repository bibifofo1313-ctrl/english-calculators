import { Link, useLocation } from 'react-router-dom'
import { getBreadcrumbs } from '../data/routes'

export const Breadcrumbs = () => {
  const location = useLocation()
  const crumbs = getBreadcrumbs(location.pathname)

  if (!crumbs.length) return null

  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <ol>
        {crumbs.map((crumb, index) => (
          <li key={crumb.path}>
            {index === crumbs.length - 1 ? (
              <span aria-current="page">{crumb.breadcrumb}</span>
            ) : (
              <Link to={crumb.path}>{crumb.breadcrumb}</Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
