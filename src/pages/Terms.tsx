import { SEOHead } from '../components/SEOHead'
import { getPageByPath } from '../data/routes'

const Terms = () => {
  const page = getPageByPath('/terms')

  if (!page) return null

  return (
    <>
      <SEOHead title={page.title} description={page.description} path={page.path} />
      <section className="section">
        <h1>Terms of use</h1>
        <p className="notice">
          By using English Calculators, you agree to these terms. The calculators provide estimates
          for educational purposes and are not financial advice.
        </p>
        <h2>Use of information</h2>
        <p>
          You are responsible for how you use the results. Always verify important financial
          decisions with qualified professionals.
        </p>
        <h2>Availability</h2>
        <p>
          We aim to keep the site reliable, but we do not guarantee uninterrupted access. Features
          may change without notice.
        </p>
        <h2>Contact</h2>
        <p>Questions about these terms? Email support@englishcalculators.com.</p>
      </section>
    </>
  )
}

export default Terms
