import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CalculatorLayout } from '../../components/CalculatorLayout'
import { FormField } from '../../components/FormField'
import { ResultPanel } from '../../components/ResultPanel'
import { SEOHead } from '../../components/SEOHead'
import { getBreadcrumbs, getCalculatorById, getRelatedCalculators } from '../../data/routes'
import { formatCurrency, formatNumber, formatYearsAndMonths } from '../../utils/format'
import { isNonNegative, isPositive, toNumber } from '../../utils/math'
import { buildBreadcrumbSchema, buildFaqSchema } from '../../utils/structuredData'

const StudentLoanPayoff = () => {
  const calculator = getCalculatorById('student-loan-payoff')
  const related = getRelatedCalculators('student-loan-payoff')

  const [balance, setBalance] = useState('28000')
  const [rate, setRate] = useState('5')
  const [payment, setPayment] = useState('350')

  if (!calculator) return null

  const balanceValue = toNumber(balance)
  const rateValue = toNumber(rate)
  const paymentValue = toNumber(payment)

  const baseErrors = {
    balance: isPositive(balanceValue) ? '' : 'Enter a balance greater than 0.',
    rate: isNonNegative(rateValue) ? '' : 'Enter a non-negative rate.',
    payment: isPositive(paymentValue) ? '' : 'Enter a monthly payment greater than 0.',
  }

  const monthlyRate = rateValue / 100 / 12
  const paymentTooLow =
    !Object.values(baseErrors).some(Boolean) && rateValue > 0 && paymentValue <= balanceValue * monthlyRate

  const errors = {
    ...baseErrors,
    payment: paymentTooLow ? 'Payment is too low to reduce the balance.' : baseErrors.payment,
  }

  const hasErrors = Object.values(errors).some(Boolean)

  const results = useMemo(() => {
    if (hasErrors) {
      return { months: 0, totalInterest: 0, totalPaid: 0 }
    }

    let months = 0
    if (rateValue === 0) {
      months = balanceValue / paymentValue
    } else {
      months =
        -Math.log(1 - (monthlyRate * balanceValue) / paymentValue) / Math.log(1 + monthlyRate)
    }
    const totalPaid = paymentValue * Math.ceil(months)
    const totalInterest = totalPaid - balanceValue

    return { months, totalInterest, totalPaid }
  }, [hasErrors, balanceValue, rateValue, paymentValue, monthlyRate])

  const faqs = [
    {
      question: 'What if I make extra payments?',
      answer: 'Increase the monthly payment to see how extra payments shorten payoff time.',
    },
    {
      question: 'Does this include income-driven repayment plans?',
      answer: 'No. This is a standard amortization estimate based on a fixed payment.',
    },
    {
      question: 'Why does the payment need to cover interest?',
      answer: 'Payments below monthly interest will not reduce the balance and can grow the loan.',
    },
    {
      question: 'Can I use this for private loans?',
      answer: 'Yes. Use the current balance, rate, and monthly payment for any fixed-rate loan.',
    },
  ]

  const structuredData = [buildBreadcrumbSchema(getBreadcrumbs(calculator.path)), buildFaqSchema(faqs)]

  const content = (
    <section className="section">
      <h2>What it does</h2>
      <p>
        The student loan payoff calculator estimates how long it will take to pay off a balance
        based on your current interest rate and monthly payment. It returns the payoff timeline in
        months and years, the total interest you are projected to pay, and the total amount paid
        over the life of the loan. This helps you see the cost of carrying a loan over time and
        understand how payment changes affect your payoff date.
      </p>
      <h2>When to use it</h2>
      <p>
        Use this calculator when you are deciding how much to pay each month, evaluating refinance
        options, or checking how a payment increase affects your budget. It is helpful for both
        federal and private loans as long as the rate and payment are fixed. If you want to compare
        loans by term and rate rather than payoff time, the{' '}
        <Link to="/calculators/loan-payment">Loan Payment Calculator</Link> is a better fit. For a
        broader cash-flow view, pair this with the{' '}
        <Link to="/calculators/salary-to-hourly">Salary to Hourly Calculator</Link>.
      </p>
      <h2>How it works</h2>
      <p>
        The calculator converts your annual rate to a monthly rate and estimates the number of
        payments required to reduce the balance to zero. If your payment does not cover monthly
        interest, the balance will not shrink and the calculator warns you. When the rate is 0%,
        the payoff timeline is simply the balance divided by the payment. The results are estimates
        that assume consistent, on-time payments.
      </p>
      <h2>Example</h2>
      <p>
        Imagine you owe $28,000 at 5% and can pay $350 per month. The calculator shows the payoff
        timeframe and total interest paid at that payment level. Increase the payment by $50 and
        see how many months you shave off the timeline. If you are debating whether to invest extra
        money instead of paying down debt, you can compare potential growth with the{' '}
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
        intro="Estimate how long it could take to pay off your student loans based on your current payment."
        form={
          <div className="form-grid">
            <FormField
              id="loan-balance"
              label="Current balance"
              value={balance}
              onChange={setBalance}
              helper="Total remaining loan balance."
              unit="USD"
              error={errors.balance}
            />
            <FormField
              id="student-rate"
              label="Annual interest rate"
              value={rate}
              onChange={setRate}
              helper="Interest rate for the loan."
              unit="%"
              step="0.01"
              error={errors.rate}
            />
            <FormField
              id="monthly-payment"
              label="Monthly payment"
              value={payment}
              onChange={setPayment}
              helper="Planned monthly payment amount."
              unit="USD"
              error={errors.payment}
            />
          </div>
        }
        results={
          <ResultPanel
            title="Payoff estimate"
            items={[
              { label: 'Time to pay off', value: formatYearsAndMonths(results.months) },
              { label: 'Total interest', value: formatCurrency(results.totalInterest, 2) },
              { label: 'Total paid', value: formatCurrency(results.totalPaid, 2) },
            ]}
          >
            <p className="field-helper">
              That is roughly {formatNumber(results.months)} months of payments at the current rate.
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

export default StudentLoanPayoff
