import { SEOHead } from '../components/SEOHead'
import { getPageByPath, site } from '../data/routes'

const Accessibility = () => {
  const page = getPageByPath('/accessibility')

  if (!page) return null

  return (
    <>
      <SEOHead title={page.title} description={page.description} path={page.path} />
      <section className="section">
        <h1>Accessibility statement</h1>
        <p className="notice">
          English Calculators aims to meet WCAG 2.1 AA guidance. We build with semantic HTML, clear
          focus states, and adjustable display settings.
        </p>
        <h2>Accessibility features</h2>
        <ul>
          <li>Keyboard-friendly navigation and visible focus indicators.</li>
          <li>Skip link to jump directly to main content.</li>
          <li>Form fields with labels, helper text, and live error messaging.</li>
          <li>Optional high contrast mode, reduced motion, and larger text size.</li>
        </ul>
        <h2>Feedback</h2>
        <p>
          If you encounter an accessibility barrier, let us know at {site.contactEmail}. We will
          respond within two business days.
        </p>
      </section>
    </>
  )
}

export default Accessibility
