import { Link } from 'react-router-dom'
import { SEOHead } from '../components/SEOHead'
import {
  calculators,
  calculatorsIndexPage,
  getPopularCalculators,
} from '../data/routes'

const CalculatorsIndex = () => {
  const popular = getPopularCalculators()
  const categories = calculators.reduce<Record<string, typeof calculators>>((acc, calculator) => {
    acc[calculator.category] = acc[calculator.category] || []
    acc[calculator.category].push(calculator)
    return acc
  }, {})

  return (
    <>
      <SEOHead
        title={calculatorsIndexPage.title}
        description={calculatorsIndexPage.description}
        path={calculatorsIndexPage.path}
      />

      <section className="section">
        <h1>All calculators</h1>
        <p className="notice">
          Choose a calculator to explore your next financial step. Each tool includes a short
          explanation and FAQ so you can move with confidence.
        </p>
      </section>

      <section className="section">
        <h2>Popular calculators</h2>
        <div className="card-grid">
          {popular.map((calculator) => (
            <Link key={calculator.id} to={calculator.path} className="card">
              <span className="tag">{calculator.category}</span>
              <h3>{calculator.title}</h3>
              <p>{calculator.description}</p>
              <span className="btn btn-ghost">Open calculator</span>
            </Link>
          ))}
        </div>
      </section>

      {Object.entries(categories).map(([category, items]) => (
        <section key={category} className="section">
          <h2>{category}</h2>
          <div className="card-grid">
            {items.map((calculator) => (
              <Link key={calculator.id} to={calculator.path} className="card">
                <span className="tag">{calculator.category}</span>
                <h3>{calculator.title}</h3>
                <p>{calculator.description}</p>
                <span className="btn btn-ghost">Open calculator</span>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </>
  )
}

export default CalculatorsIndex
