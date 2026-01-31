import { SEOHead } from '../components/SEOHead'
import { getPageByPath } from '../data/routes'

const Privacy = () => {
  const page = getPageByPath('/privacy')

  if (!page) return null

  return (
    <>
      <SEOHead title={page.title} description={page.description} path={page.path} />
      <section className="section">
        <h1>Privacy policy</h1>
        <p className="notice">
          We keep this site lightweight and do not run third-party analytics, ads, or trackers. Your
          calculations stay in your browser.
        </p>
        <h2>What we collect</h2>
        <p>
          We do not collect personal information, and we do not store calculator inputs on our
          servers. Standard hosting logs may capture basic technical data such as IP address and
          request time.
        </p>
        <h2>How we use data</h2>
        <p>
          Any technical logs are used only to keep the site secure, diagnose outages, and improve
          performance. We do not sell data.
        </p>
        <h2>Contact</h2>
        <p>If you have privacy questions, email support@englishcalculators.com.</p>
      </section>
    </>
  )
}

export default Privacy
