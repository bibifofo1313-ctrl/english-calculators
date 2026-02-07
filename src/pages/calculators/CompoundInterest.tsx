import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CalculatorLayout } from '../../components/CalculatorLayout'
import { FormField } from '../../components/FormField'
import { ResultPanel } from '../../components/ResultPanel'
import { SEOHead } from '../../components/SEOHead'
import { getBreadcrumbs, getCalculatorById, getRelatedCalculators } from '../../data/routes'
import { formatCurrency, formatNumber } from '../../utils/format'
import { isNonNegative, isPositive, toNumber } from '../../utils/math'
import { buildBreadcrumbSchema, buildFaqSchema } from '../../utils/structuredData'

const CompoundInterest = () => {
  const calculator = getCalculatorById('compound-interest')
  const related = getRelatedCalculators('compound-interest')

  const [principal, setPrincipal] = useState('5000')
  const [contribution, setContribution] = useState('200')
  const [rate, setRate] = useState('6')
  const [years, setYears] = useState('20')

  if (!calculator) return null

  const principalValue = toNumber(principal)
  const contributionValue = toNumber(contribution)
  const rateValue = toNumber(rate)
  const yearsValue = toNumber(years)

  const errors = {
    principal: isNonNegative(principalValue) ? '' : 'Enter a non-negative number.',
    contribution: isNonNegative(contributionValue) ? '' : 'Enter a non-negative number.',
    rate: isNonNegative(rateValue) ? '' : 'Enter a non-negative rate.',
    years: isPositive(yearsValue) ? '' : 'Enter a number greater than 0.',
  }

  const hasErrors = Object.values(errors).some(Boolean)
  const safeYears = isPositive(yearsValue) ? yearsValue : 0

  const results = useMemo(() => {
    if (hasErrors) {
      return {
        futureValue: 0,
        totalContributions: 0,
        interestEarned: 0,
      }
    }
    const months = yearsValue * 12
    const monthlyRate = rateValue / 100 / 12
    const growth = Math.pow(1 + monthlyRate, months)
    const futureValue =
      rateValue === 0
        ? principalValue + contributionValue * months
        : principalValue * growth + contributionValue * ((growth - 1) / monthlyRate)
    const totalContributions = principalValue + contributionValue * months
    const interestEarned = futureValue - totalContributions

    return {
      futureValue,
      totalContributions,
      interestEarned,
    }
  }, [hasErrors, principalValue, contributionValue, rateValue, yearsValue])

  const faqs = [
    {
      question: 'What does compound interest mean?',
      answer:
        'Compound interest means you earn interest on your original balance and on the interest already earned.',
    },
    {
      question: 'How often is interest compounded here?',
      answer: 'This calculator assumes monthly compounding and monthly contributions.',
    },
    {
      question: 'Can I set contributions to zero?',
      answer: 'Yes. Enter 0 for monthly contributions to see growth from the starting balance only.',
    },
    {
      question: 'Does this include taxes or inflation?',
      answer: 'No. Results are gross estimates before taxes or inflation effects.',
    },
  ]

  const structuredData = [buildBreadcrumbSchema(getBreadcrumbs(calculator.path)), buildFaqSchema(faqs)]

  const content = (
    <section className="section">
      <h2>What it does</h2>
      <p>
        The compound interest calculator estimates how a balance can grow over time when interest
        is earned on both the original deposit and the interest already credited. You enter a
        starting balance, a steady monthly contribution, an annual interest rate, and a time
        horizon. The results show the projected future value, the total amount you contributed, and
        the portion of the ending balance that comes from interest. This helps you separate what
        you saved from what your money earned.
      </p>
      <h2>When to use it</h2>
      <p>
        Use this calculator when you are planning long-term goals such as retirement, a home down
        payment, or an education fund and want a quick estimate. It is especially useful for
        comparing different monthly savings amounts or testing how sensitive your plan is to rate
        changes. If you want to see how fees reduce growth, pair this with the{' '}
        <Link to="/calculators/investment-fee-impact">Investment Fee Impact Calculator</Link>. If
        you are deciding whether to save or pay down debt, compare outcomes with the{' '}
        <Link to="/calculators/loan-payment">Loan Payment Calculator</Link>.
      </p>
      <h2>How it works</h2>
      <p>
        The calculator converts your annual rate into a monthly rate, then compounds it across the
        total number of months in your timeline. Monthly contributions are added at each step so
        you can see the effect of consistent deposits. If your rate is 0% it simply totals your
        deposits, while higher rates increase the interest-earned line over time. The output is a
        straightforward estimate, not a prediction, so you can adjust inputs to explore best-case
        and conservative scenarios.
      </p>
      <h2>Example</h2>
      <p>
        Suppose you start with $5,000, contribute $200 each month, and assume a 6% annual return
        over 20 years. The calculator will show the projected future value and how much of that
        balance came from your own deposits versus interest. Try reducing the rate by a point or
        changing the timeline to see how growth accelerates or slows. If your goal is a specific
        monthly budget target, you can also compare the result to housing costs using the{' '}
        <Link to="/calculators/mortgage-payment">Mortgage Payment Calculator</Link>.
      </p>
    </section>
  )

  return (
    <>
      <SEOHead
        title={`${calculator.title} | English Calculators`}
        description={calculator.description}
        path={calculator.path}
        structuredData={structuredData}
      />
      <CalculatorLayout
        title={calculator.title}
        intro="Estimate how your savings grow with compounding and steady monthly contributions."
        form={
          <div className="form-grid">
            <FormField
              id="principal"
              label="Starting balance"
              value={principal}
              onChange={setPrincipal}
              helper="The amount you have saved today."
              unit="USD"
              error={errors.principal}
            />
            <FormField
              id="contribution"
              label="Monthly contribution"
              value={contribution}
              onChange={setContribution}
              helper="How much you plan to add each month."
              unit="USD"
              error={errors.contribution}
            />
            <FormField
              id="rate"
              label="Annual interest rate"
              value={rate}
              onChange={setRate}
              helper="Use the expected yearly return rate."
              unit="%"
              step="0.01"
              error={errors.rate}
            />
            <FormField
              id="years"
              label="Years to grow"
              value={years}
              onChange={setYears}
              helper="Total time your money is invested."
              unit="years"
              step="1"
              error={errors.years}
            />
          </div>
        }
        results={
          <ResultPanel
            title="Estimated growth"
            items={[
              { label: 'Future value', value: formatCurrency(results.futureValue, 2) },
              {
                label: 'Total contributions',
                value: formatCurrency(results.totalContributions, 2),
              },
              { label: 'Interest earned', value: formatCurrency(results.interestEarned, 2) },
            ]}
          >
            <p className="field-helper">
              Over {formatNumber(safeYears)} years, your balance could reach{' '}
              {formatCurrency(results.futureValue, 2)}.
            </p>
          </ResultPanel>
        }
        content={content}
        faqs={faqs}
        relatedCalculators={related}
      />
    </>
  )
}

export default CompoundInterest
