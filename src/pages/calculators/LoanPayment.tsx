import { useMemo, useState } from 'react'
import { CalculatorLayout } from '../../components/CalculatorLayout'
import { FormField } from '../../components/FormField'
import { ResultPanel } from '../../components/ResultPanel'
import { SEOHead } from '../../components/SEOHead'
import { getBreadcrumbs, getCalculatorById, getRelatedCalculators } from '../../data/routes'
import { formatCurrency } from '../../utils/format'
import { isNonNegative, isPositive, toNumber } from '../../utils/math'
import { buildBreadcrumbSchema, buildFaqSchema } from '../../utils/structuredData'

const LoanPayment = () => {
  const calculator = getCalculatorById('loan-payment')
  const related = getRelatedCalculators('loan-payment')

  const [amount, setAmount] = useState('20000')
  const [rate, setRate] = useState('7')
  const [years, setYears] = useState('5')

  if (!calculator) return null

  const amountValue = toNumber(amount)
  const rateValue = toNumber(rate)
  const yearsValue = toNumber(years)

  const errors = {
    amount: isPositive(amountValue) ? '' : 'Enter a loan amount greater than 0.',
    rate: isNonNegative(rateValue) ? '' : 'Enter a non-negative rate.',
    years: isPositive(yearsValue) ? '' : 'Enter a term greater than 0.',
  }

  const hasErrors = Object.values(errors).some(Boolean)

  const results = useMemo(() => {
    if (hasErrors) {
      return { payment: 0, totalInterest: 0, totalCost: 0 }
    }
    const months = yearsValue * 12
    const monthlyRate = rateValue / 100 / 12
    const payment =
      rateValue === 0
        ? amountValue / months
        : (amountValue * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months))
    const totalCost = payment * months
    const totalInterest = totalCost - amountValue

    return { payment, totalInterest, totalCost }
  }, [hasErrors, amountValue, rateValue, yearsValue])

  const faqs = [
    {
      question: 'Is this for fixed-rate loans only?',
      answer: 'Yes. Variable-rate loans require a schedule of rate changes to estimate accurately.',
    },
    {
      question: 'Does this include fees or taxes?',
      answer: 'No. It only models principal and interest for a standard amortized loan.',
    },
    {
      question: 'Can I use this for auto loans?',
      answer: 'Yes. Any fixed-rate installment loan works with this formula.',
    },
    {
      question: 'What if my rate is 0%?',
      answer: 'The payment is simply the loan amount divided by the total number of months.',
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
        intro="Estimate your monthly payment, total interest, and overall cost for a fixed-rate loan."
        form={
          <div className="form-grid">
            <FormField
              id="loan-amount"
              label="Loan amount"
              value={amount}
              onChange={setAmount}
              helper="Total amount you plan to borrow."
              unit="USD"
              error={errors.amount}
            />
            <FormField
              id="loan-rate"
              label="Annual interest rate"
              value={rate}
              onChange={setRate}
              helper="Interest rate before fees or discounts."
              unit="%"
              step="0.01"
              error={errors.rate}
            />
            <FormField
              id="loan-years"
              label="Loan term"
              value={years}
              onChange={setYears}
              helper="Length of the loan in years."
              unit="years"
              step="1"
              error={errors.years}
            />
          </div>
        }
        results={
          <ResultPanel
            title="Loan payment summary"
            items={[
              { label: 'Monthly payment', value: formatCurrency(results.payment, 2) },
              { label: 'Total interest', value: formatCurrency(results.totalInterest, 2) },
              { label: 'Total cost', value: formatCurrency(results.totalCost, 2) },
            ]}
          >
            <p className="field-helper">
              This estimate assumes on-time monthly payments over the full term.
            </p>
          </ResultPanel>
        }
        faqs={faqs}
        relatedCalculators={related}
      />
    </>
  )
}

export default LoanPayment
