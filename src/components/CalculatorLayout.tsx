import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import type { CalculatorMeta } from '../data/routes'
import { FAQ } from './FAQ'
import type { FAQItem } from './FAQ'

type CalculatorLayoutProps = {
  title: string
  intro: string
  form: ReactNode
  results: ReactNode
  content: ReactNode
  faqs: FAQItem[]
  relatedCalculators: CalculatorMeta[]
}

export const CalculatorLayout = ({
  title,
  intro,
  form,
  results,
  content,
  faqs,
  relatedCalculators,
}: CalculatorLayoutProps) => {
  return (
    <article className="section">
      <header className="section">
        <h1>{title}</h1>
        <p className="notice">{intro}</p>
      </header>

      <section className="calc-grid">
        <div className="panel">
          <h2>Inputs</h2>
          {form}
        </div>
        <div className="panel">
          {results}
          <p className="disclaimer">
            Results are estimates and for informational purposes only. This is not financial advice.
          </p>
        </div>
      </section>

      {content}

      <FAQ items={faqs} />

      <section className="section">
        <h2>Related calculators</h2>
        <div className="card-grid">
          {relatedCalculators.map((calculator) => (
            <Link key={calculator.id} to={calculator.path} className="card">
              <span className="tag">{calculator.category}</span>
              <h3>{calculator.title}</h3>
              <p>{calculator.description}</p>
              <span className="btn btn-ghost">Open calculator</span>
            </Link>
          ))}
        </div>
      </section>
    </article>
  )
}
