import { Link } from 'react-router-dom'
import { SEOHead } from '../components/SEOHead'
import { calculators, getPopularCalculators, homePage, site } from '../data/routes'
import { buildOrganizationSchema, buildWebsiteSchema } from '../utils/structuredData'

const Home = () => {
  const popular = getPopularCalculators()

  return (
    <>
      <SEOHead
        title={homePage.title}
        description={homePage.description}
        path={homePage.path}
        structuredData={[buildWebsiteSchema(), buildOrganizationSchema()]}
      />

      <section className="hero">
        <h1>English calculators for personal finance and education ROI</h1>
        <p>
          {site.description} Get clear inputs, instant results, and quick guidance without the clutter.
        </p>
        <div className="hero-actions">
          <Link to="/calculators" className="btn btn-primary">
            Explore calculators
          </Link>
          <Link to="/calculators/compound-interest" className="btn btn-ghost">
            Start with compound interest
          </Link>
        </div>
        <div className="badge-row">
          <span className="badge">Fast estimates</span>
          <span className="badge">No sign-up required</span>
          <span className="badge">WCAG-minded design</span>
          <span className="badge">Built for clarity</span>
        </div>
      </section>

      <section className="section">
        <h2>Popular calculators</h2>
        <div className="card-grid">
          {popular.map((calculator) => (
            <Link key={calculator.id} to={calculator.path} className="card">
              <span className="tag">{calculator.category}</span>
              <h3>{calculator.title}</h3>
              <p>{calculator.description}</p>
              <span className="btn btn-ghost">Calculate now</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section">
        <h2>All calculators</h2>
        <div className="card-grid">
          {calculators.map((calculator) => (
            <Link key={calculator.id} to={calculator.path} className="card">
              <span className="tag">{calculator.category}</span>
              <h3>{calculator.title}</h3>
              <p>{calculator.description}</p>
              <span className="btn btn-ghost">View details</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section">
        <h2>Why people use English Calculators</h2>
        <div className="card-grid">
          <div className="card">
            <h3>Focused on what matters</h3>
            <p>Inputs are simple, defaults are realistic, and the results emphasize next steps.</p>
          </div>
          <div className="card">
            <h3>Built for accessibility</h3>
            <p>Keyboard-friendly controls, visible focus states, and customizable contrast.</p>
          </div>
          <div className="card">
            <h3>SEO-friendly structure</h3>
            <p>Each calculator includes explanations, FAQs, and structured data.</p>
          </div>
        </div>
      </section>
    </>
  )
}

export default Home
