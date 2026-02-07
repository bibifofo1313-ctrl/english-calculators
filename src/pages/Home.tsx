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
        <h2>Plan smarter with clear, practical estimates</h2>
        <p>
          English Calculators is built for people who want straightforward answers without a wall of
          jargon. Each calculator focuses on one decision, gives you the right inputs, and explains
          the output in plain language. Use the{' '}
          <Link to="/calculators/compound-interest">Compound Interest Calculator</Link> to see how
          monthly savings grow, or the{' '}
          <Link to="/calculators/investment-fee-impact">Investment Fee Impact Calculator</Link> to
          understand how small fees add up over time. For debt planning, the{' '}
          <Link to="/calculators/loan-payment">Loan Payment Calculator</Link> helps you compare
          fixed-rate offers, while the{' '}
          <Link to="/calculators/student-loan-payoff">Student Loan Payoff Calculator</Link> shows
          how payment changes affect your timeline. If housing is on your mind, the{' '}
          <Link to="/calculators/mortgage-payment">Mortgage Payment Calculator</Link> includes taxes
          and insurance so the monthly total is more realistic.
        </p>
        <p>
          You can also translate income into a more useful hourly rate with the{' '}
          <Link to="/calculators/salary-to-hourly">Salary to Hourly Calculator</Link>, which is
          helpful for comparing job offers or budgeting against monthly bills. Every tool includes
          an explanation, a worked example, and a short FAQ so you can understand the assumptions
          behind the numbers. Adjust the inputs, test best-case and conservative scenarios, and use
          the results as a starting point for your next decision. The goal is clarity: numbers you
          can trust, and context you can act on.
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
