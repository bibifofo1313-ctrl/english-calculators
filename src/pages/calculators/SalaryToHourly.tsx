import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CalculatorLayout } from '../../components/CalculatorLayout'
import { FormField } from '../../components/FormField'
import { ResultPanel } from '../../components/ResultPanel'
import { SEOHead } from '../../components/SEOHead'
import { getBreadcrumbs, getCalculatorById, getRelatedCalculators } from '../../data/routes'
import { formatCurrency } from '../../utils/format'
import { isPositive, toNumber } from '../../utils/math'
import { buildBreadcrumbSchema, buildFaqSchema } from '../../utils/structuredData'

const SalaryToHourly = () => {
  const calculator = getCalculatorById('salary-to-hourly')
  const related = getRelatedCalculators('salary-to-hourly')

  const [salary, setSalary] = useState('72000')
  const [hours, setHours] = useState('40')
  const [weeks, setWeeks] = useState('52')

  if (!calculator) return null

  const salaryValue = toNumber(salary)
  const hoursValue = toNumber(hours)
  const weeksValue = toNumber(weeks)

  const errors = {
    salary: isPositive(salaryValue) ? '' : 'Enter a salary greater than 0.',
    hours: isPositive(hoursValue) ? '' : 'Enter hours greater than 0.',
    weeks: isPositive(weeksValue) ? '' : 'Enter weeks greater than 0.',
  }

  const hasErrors = Object.values(errors).some(Boolean)

  const results = useMemo(() => {
    if (hasErrors) {
      return { hourly: 0, weekly: 0, monthly: 0 }
    }
    const hourly = salaryValue / (hoursValue * weeksValue)
    const weekly = salaryValue / weeksValue
    const monthly = salaryValue / 12

    return { hourly, weekly, monthly }
  }, [hasErrors, salaryValue, hoursValue, weeksValue])

  const faqs = [
    {
      question: 'Does this include overtime?',
      answer: 'No. This is a straight conversion using standard weekly hours.',
    },
    {
      question: 'What if I take unpaid time off?',
      answer: 'Reduce the weeks per year to reflect unpaid leave or shorter work years.',
    },
    {
      question: 'Is this before or after taxes?',
      answer: 'This is a gross income conversion. Taxes and deductions are not included.',
    },
    {
      question: 'Why show weekly and monthly?',
      answer: 'It helps compare offers with different pay schedules.',
    },
  ]

  const structuredData = [buildBreadcrumbSchema(getBreadcrumbs(calculator.path)), buildFaqSchema(faqs)]

  const content = (
    <section className="section">
      <h2>What it does</h2>
      <p>
        The salary to hourly calculator converts an annual salary into hourly, weekly, and monthly
        pay based on the hours and weeks you actually work. This is helpful when a job offer is
        presented as a salary but you need to compare it to hourly or contract work. By adjusting
        hours per week and weeks per year, you can model time off, seasonal work, or shorter work
        years and see how they affect your effective hourly rate.
      </p>
      <h2>When to use it</h2>
      <p>
        Use this calculator when comparing a salaried role to an hourly offer, or when you are
        negotiating compensation and want to translate salary into a clear rate. It is also useful
        for budgeting monthly expenses like loan payments and housing costs. If you need to compare
        your income to a mortgage or rent target, check the{' '}
        <Link to="/calculators/mortgage-payment">Mortgage Payment Calculator</Link>. If you are
        estimating debt payments, the{' '}
        <Link to="/calculators/loan-payment">Loan Payment Calculator</Link> can provide a helpful
        benchmark.
      </p>
      <h2>How it works</h2>
      <p>
        The calculator divides your annual salary by the total number of hours you work in a year,
        which is your weekly hours multiplied by weeks worked. It then shows the equivalent weekly
        and monthly amounts for quick comparisons. Because it uses gross salary, it does not include
        taxes, benefits, or bonuses. Adjust the inputs to reflect real work schedules, such as 48
        work weeks if you take four weeks off.
      </p>
      <h2>Example</h2>
      <p>
        Imagine a $72,000 salary with a 40-hour week and 52 weeks per year. The calculator will show
        the hourly rate, weekly paycheck, and monthly average. If you plan to take unpaid leave,
        drop the weeks to 48 and see how your hourly rate changes. When weighing income against
        student loan payments, compare your monthly figure to the output of the{' '}
        <Link to="/calculators/student-loan-payoff">Student Loan Payoff Calculator</Link>.
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
        intro="Convert an annual salary to hourly, weekly, and monthly pay based on your schedule."
        form={
          <div className="form-grid">
            <FormField
              id="annual-salary"
              label="Annual salary"
              value={salary}
              onChange={setSalary}
              helper="Gross annual pay before taxes."
              unit="USD"
              error={errors.salary}
            />
            <FormField
              id="hours-per-week"
              label="Hours per week"
              value={hours}
              onChange={setHours}
              helper="Average hours worked each week."
              unit="hours"
              step="0.5"
              error={errors.hours}
            />
            <FormField
              id="weeks-per-year"
              label="Weeks per year"
              value={weeks}
              onChange={setWeeks}
              helper="Typically 52, or fewer for unpaid time off."
              unit="weeks"
              step="1"
              error={errors.weeks}
            />
          </div>
        }
        results={
          <ResultPanel
            title="Pay breakdown"
            items={[
              { label: 'Hourly pay', value: formatCurrency(results.hourly, 2) },
              { label: 'Weekly pay', value: formatCurrency(results.weekly, 2) },
              { label: 'Monthly pay', value: formatCurrency(results.monthly, 2) },
            ]}
          >
            <p className="field-helper">
              Adjust hours or weeks to compare different schedules or contract roles.
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

export default SalaryToHourly
