import { useMemo, useState } from 'react'
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
        faqs={faqs}
        relatedCalculators={related}
      />
    </>
  )
}

export default SalaryToHourly
