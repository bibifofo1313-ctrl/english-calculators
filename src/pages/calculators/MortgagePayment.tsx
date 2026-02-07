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

const MortgagePayment = () => {
  const calculator = getCalculatorById('mortgage-payment')
  const related = getRelatedCalculators('mortgage-payment')

  const [homePrice, setHomePrice] = useState('350000')
  const [downPayment, setDownPayment] = useState('70000')
  const [rate, setRate] = useState('6.2')
  const [years, setYears] = useState('30')
  const [taxRate, setTaxRate] = useState('1.1')
  const [insurance, setInsurance] = useState('1200')
  const [hoa, setHoa] = useState('0')

  if (!calculator) return null

  const homeValue = toNumber(homePrice)
  const downValue = toNumber(downPayment)
  const rateValue = toNumber(rate)
  const yearsValue = toNumber(years)
  const taxValue = toNumber(taxRate)
  const insuranceValue = toNumber(insurance)
  const hoaValue = toNumber(hoa)

  const loanAmount = homeValue - downValue

  const errors = {
    homePrice: isPositive(homeValue) ? '' : 'Enter a home price greater than 0.',
    downPayment: isNonNegative(downValue) ? '' : 'Enter a non-negative down payment.',
    rate: isNonNegative(rateValue) ? '' : 'Enter a non-negative rate.',
    years: isPositive(yearsValue) ? '' : 'Enter a term greater than 0.',
    taxRate: isNonNegative(taxValue) ? '' : 'Enter a non-negative tax rate.',
    insurance: isNonNegative(insuranceValue) ? '' : 'Enter a non-negative amount.',
    hoa: isNonNegative(hoaValue) ? '' : 'Enter a non-negative amount.',
    loanAmount: loanAmount >= 0 ? '' : 'Down payment cannot exceed the home price.',
  }

  const hasErrors = Object.values(errors).some(Boolean)

  const results = useMemo(() => {
    if (hasErrors) {
      return {
        principalAndInterest: 0,
        taxes: 0,
        insurance: 0,
        hoa: 0,
        total: 0,
      }
    }
    const months = yearsValue * 12
    const monthlyRate = rateValue / 100 / 12
    const principalAndInterest =
      rateValue === 0
        ? loanAmount / months
        : (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months))
    const taxes = (homeValue * (taxValue / 100)) / 12
    const insuranceMonthly = insuranceValue / 12
    const total = principalAndInterest + taxes + insuranceMonthly + hoaValue

    return {
      principalAndInterest,
      taxes,
      insurance: insuranceMonthly,
      hoa: hoaValue,
      total,
    }
  }, [hasErrors, loanAmount, homeValue, rateValue, yearsValue, taxValue, insuranceValue, hoaValue])

  const faqs = [
    {
      question: 'Does this include PMI?',
      answer: 'No. Add PMI to the HOA field if you want to include it in the estimate.',
    },
    {
      question: 'Are property taxes required?',
      answer: 'They are optional but recommended for a realistic payment estimate.',
    },
    {
      question: 'Can I use this for refinancing?',
      answer: 'Yes. Use your new loan balance, rate, and term to estimate the new payment.',
    },
    {
      question: 'Why is my payment different from a lender quote?',
      answer: 'Lenders may include insurance, escrow fees, and other items not modeled here.',
    },
  ]

  const structuredData = [buildBreadcrumbSchema(getBreadcrumbs(calculator.path)), buildFaqSchema(faqs)]

  const content = (
    <section className="section">
      <h2>What it does</h2>
      <p>
        The mortgage payment calculator estimates your full monthly housing cost by combining the
        principal and interest payment with property taxes, homeowners insurance, and optional HOA
        or PMI costs. Enter the home price, down payment, interest rate, and loan term to see the
        core loan payment, then add the annual tax rate and insurance premium to get a more realistic
        total. This helps you understand what it takes to carry a mortgage, not just the loan
        itself.
      </p>
      <h2>When to use it</h2>
      <p>
        Use this calculator when comparing homes or evaluating what price range fits your monthly
        budget. It is useful before pre-approval, when negotiating rates, or when deciding between
        a larger down payment and a higher monthly payment. If you are modeling a simple loan
        without taxes and insurance, the{' '}
        <Link to="/calculators/loan-payment">Loan Payment Calculator</Link> is a faster alternative.
        For affordability checks, compare the output to your income with the{' '}
        <Link to="/calculators/salary-to-hourly">Salary to Hourly Calculator</Link>.
      </p>
      <h2>How it works</h2>
      <p>
        The calculator uses the standard amortization formula to compute the principal-and-interest
        portion of your payment over the selected term. It then adds monthly property taxes based on
        the annual tax rate, plus monthly insurance and HOA/PMI values. The result is an estimate,
        and real lender quotes may include escrow fees or different insurance assumptions, so use it
        to test scenarios and adjust inputs as your numbers change.
      </p>
      <h2>Example</h2>
      <p>
        Suppose you are shopping for a $350,000 home with a $70,000 down payment at 6.2% for 30
        years. Add a 1.1% tax rate, $1,200 annual insurance, and any HOA or PMI costs. The calculator
        will show each component and the combined monthly payment, helping you see whether a smaller
        down payment or a shorter term fits your plan. If you are also saving toward a down payment,
        compare your timeline with the{' '}
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
        intro="Estimate your monthly mortgage payment including taxes, insurance, and HOA fees."
        form={
          <div className="form-grid">
            <FormField
              id="home-price"
              label="Home price"
              value={homePrice}
              onChange={setHomePrice}
              helper="Purchase price of the home."
              unit="USD"
              error={errors.homePrice}
            />
            <FormField
              id="down-payment"
              label="Down payment"
              value={downPayment}
              onChange={setDownPayment}
              helper="Cash paid upfront."
              unit="USD"
              error={errors.downPayment || errors.loanAmount}
            />
            <FormField
              id="mortgage-rate"
              label="Annual interest rate"
              value={rate}
              onChange={setRate}
              helper="Interest rate for the mortgage loan."
              unit="%"
              step="0.01"
              error={errors.rate}
            />
            <FormField
              id="mortgage-years"
              label="Loan term"
              value={years}
              onChange={setYears}
              helper="Total mortgage length in years."
              unit="years"
              step="1"
              error={errors.years}
            />
            <FormField
              id="tax-rate"
              label="Property tax rate"
              value={taxRate}
              onChange={setTaxRate}
              helper="Annual property tax percentage."
              unit="%"
              step="0.01"
              error={errors.taxRate}
            />
            <FormField
              id="insurance"
              label="Home insurance (annual)"
              value={insurance}
              onChange={setInsurance}
              helper="Estimated yearly insurance premium."
              unit="USD"
              error={errors.insurance}
            />
            <FormField
              id="hoa"
              label="HOA / PMI (monthly)"
              value={hoa}
              onChange={setHoa}
              helper="Monthly association dues or PMI if applicable."
              unit="USD"
              error={errors.hoa}
            />
          </div>
        }
        results={
          <ResultPanel
            title="Monthly payment estimate"
            items={[
              { label: 'Principal & interest', value: formatCurrency(results.principalAndInterest, 2) },
              { label: 'Property taxes', value: formatCurrency(results.taxes, 2) },
              { label: 'Insurance', value: formatCurrency(results.insurance, 2) },
              { label: 'HOA / PMI', value: formatCurrency(results.hoa, 2) },
              { label: 'Total monthly payment', value: formatCurrency(results.total, 2) },
            ]}
          >
            <p className="field-helper">
              This estimate assumes a fixed-rate mortgage and steady monthly costs.
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

export default MortgagePayment
