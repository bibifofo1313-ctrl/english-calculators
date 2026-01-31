import { useMemo, useState } from 'react'
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
        faqs={faqs}
        relatedCalculators={related}
      />
    </>
  )
}

export default CompoundInterest
