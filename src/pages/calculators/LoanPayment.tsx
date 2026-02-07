import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
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

  const content = (
    <section className="section">
      <h2>What it does</h2>
      <p>
        The loan payment calculator estimates the monthly payment for a fixed-rate installment loan
        and shows how much interest you will pay over the full term. It uses your loan amount,
        interest rate, and repayment term to calculate the payment, the total interest, and the
        total cost of the loan. This gives you a clear view of how much the loan will cost beyond
        the original principal and helps you compare offers on the same footing.
      </p>
      <h2>When to use it</h2>
      <p>
        Use this tool when you are comparing personal loans, auto loans, or consolidation offers.
        It is also helpful when you are refinancing and want to see how a new rate or term changes
        the monthly payment. If you are modeling a home loan specifically, the{' '}
        <Link to="/calculators/mortgage-payment">Mortgage Payment Calculator</Link> includes taxes
        and insurance. If you want to see the payoff timeline for a fixed payment, try the{' '}
        <Link to="/calculators/student-loan-payoff">Student Loan Payoff Calculator</Link>.
      </p>
      <h2>How it works</h2>
      <p>
        The formula assumes a fixed interest rate and equal monthly payments that cover principal
        and interest over the life of the loan. It converts the annual rate to a monthly rate and
        spreads repayment across the number of months in the term. If the rate is 0%, the payment
        is simply the loan amount divided by months. It does not include origination fees, taxes,
        or insurance, so you can add those to your budget separately.
      </p>
      <h2>Example</h2>
      <p>
        Imagine borrowing $20,000 at 7% for five years. The calculator will return a monthly payment
        and show how much of the total cost is interest. You can then test what happens if you
        shorten the term to four years or lower the rate by 1%. If you are weighing saving versus
        paying off debt, compare the monthly payment to the growth estimate from the{' '}
        <Link to="/calculators/compound-interest">Compound Interest Calculator</Link>.
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
        content={content}
        faqs={faqs}
        relatedCalculators={related}
      />
    </>
  )
}

export default LoanPayment
