import { Link } from 'react-router-dom'
import { SEOHead } from '../components/SEOHead'

const NotFound = () => {
  return (
    <>
      <SEOHead
        title="Page not found | English Calculators"
        description="The page you are looking for was not found. Explore calculators instead."
        path="/404"
      />
      <section className="section">
        <h1>Page not found</h1>
        <p className="notice">
          We could not find that page. Try the calculators index or head back to the home page.
        </p>
        <div className="hero-actions">
          <Link to="/calculators" className="btn btn-primary">
            View calculators
          </Link>
          <Link to="/" className="btn btn-ghost">
            Go home
          </Link>
        </div>
      </section>
    </>
  )
}

export default NotFound
