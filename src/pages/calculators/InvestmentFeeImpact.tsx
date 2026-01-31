import { useMemo, useState } from 'react'
import { CalculatorLayout } from '../../components/CalculatorLayout'
import { FormField } from '../../components/FormField'
import { ResultPanel } from '../../components/ResultPanel'
import { SEOHead } from '../../components/SEOHead'
import { getBreadcrumbs, getCalculatorById, getRelatedCalculators } from '../../data/routes'
import { formatCurrency, formatPercent } from '../../utils/format'
import { isNonNegative, isPositive, toNumber } from '../../utils/math'
import { buildBreadcrumbSchema, buildFaqSchema } from '../../utils/structuredData'

const InvestmentFeeImpact = () => {
  const calculator = getCalculatorById('investment-fee-impact')
  const related = getRelatedCalculators('investment-fee-impact')

  const [startingBalance, setStartingBalance] = useState('15000')
  const [annualContribution, setAnnualContribution] = useState('3000')
  const [annualReturn, setAnnualReturn] = useState('6.5')
  const [years, setYears] = useState('20')
  const [fee, setFee] = useState('1.0')

  if (!calculator) return null

  const startingValue = toNumber(startingBalance)
  const contributionValue = toNumber(annualContribution)
  const returnValue = toNumber(annualReturn)
  const yearsValue = toNumber(years)
  const feeValue = toNumber(fee)

  const errors = {
    startingBalance: isNonNegative(startingValue) ? '' : 'Enter a non-negative amount.',
    annualContribution: isNonNegative(contributionValue) ? '' : 'Enter a non-negative amount.',
    annualReturn: isNonNegative(returnValue) ? '' : 'Enter a non-negative return rate.',
    years: isPositive(yearsValue) ? '' : 'Enter a number greater than 0.',
    fee: isNonNegative(feeValue) ? '' : 'Enter a non-negative fee.',
  }

  const hasErrors = Object.values(errors).some(Boolean)

  const results = useMemo(() => {
    if (hasErrors) {
      return { noFee: 0, withFee: 0, lostToFees: 0, feeRate: 0 }
    }

    const grossRate = returnValue / 100
    const feeRate = feeValue / 100
    const netRate = grossRate - feeRate

    const growth = (rate: number) => {
      if (rate === 0) return startingValue + contributionValue * yearsValue
      const factor = Math.pow(1 + rate, yearsValue)
      return startingValue * factor + contributionValue * ((factor - 1) / rate)
    }

    const noFee = growth(grossRate)
    const withFee = growth(netRate)
    const lostToFees = noFee - withFee

    return { noFee, withFee, lostToFees, feeRate: feeValue }
  }, [hasErrors, startingValue, contributionValue, returnValue, yearsValue, feeValue])

  const faqs = [
    {
      question: 'Is the fee applied annually?',
      answer: 'Yes. This assumes an annual fee as a percentage of assets under management.',
    },
    {
      question: 'What types of fees does this model?',
      answer: 'Think expense ratios, advisory fees, or platform fees expressed as annual percentages.',
    },
    {
      question: 'Does it include taxes?',
      answer: 'No. Taxes and inflation are not included in this estimate.',
    },
    {
      question: 'What if my expected return is lower than the fee?',
      answer: 'The model still works, but long-term growth may be reduced or flat.',
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
        intro="Compare investment growth with and without annual fees to see the long-term impact."
        form={
          <div className="form-grid">
            <FormField
              id="starting-balance"
              label="Starting balance"
              value={startingBalance}
              onChange={setStartingBalance}
              helper="Amount already invested."
              unit="USD"
              error={errors.startingBalance}
            />
            <FormField
              id="annual-contribution"
              label="Annual contribution"
              value={annualContribution}
              onChange={setAnnualContribution}
              helper="How much you invest each year."
              unit="USD"
              error={errors.annualContribution}
            />
            <FormField
              id="annual-return"
              label="Annual return (before fees)"
              value={annualReturn}
              onChange={setAnnualReturn}
              helper="Expected average annual return."
              unit="%"
              step="0.01"
              error={errors.annualReturn}
            />
            <FormField
              id="years"
              label="Years invested"
              value={years}
              onChange={setYears}
              helper="Total time invested."
              unit="years"
              step="1"
              error={errors.years}
            />
            <FormField
              id="annual-fee"
              label="Annual fee"
              value={fee}
              onChange={setFee}
              helper="Expense ratio or advisory fee."
              unit="%"
              step="0.01"
              error={errors.fee}
            />
          </div>
        }
        results={
          <ResultPanel
            title="Fee impact summary"
            items={[
              { label: 'Balance without fees', value: formatCurrency(results.noFee, 2) },
              { label: 'Balance with fees', value: formatCurrency(results.withFee, 2) },
              { label: 'Estimated cost of fees', value: formatCurrency(results.lostToFees, 2) },
            ]}
          >
            <p className="field-helper">
              An annual fee of {formatPercent(results.feeRate, 2)} can noticeably reduce your ending
              balance over time.
            </p>
          </ResultPanel>
        }
        faqs={faqs}
        relatedCalculators={related}
      />
    </>
  )
}

export default InvestmentFeeImpact
